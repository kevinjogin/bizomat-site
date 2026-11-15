// BIZOMAT WHS, Release 1: who may do what in a company's Work Health & Safety records. Every route resolves the
// caller's ERP access to the company in the address first (erp/access.ts loadErpAccess): people outside the company
// (and people who only share a tool with it) get 404, so another company's existence is never revealed. Every query
// then filters on that company's id, and what a person may see of each record comes from the scopes below, never from
// the client.
//
// WHS roles are ERP roles, given in Administration > ERP roles (erp_role_grants; the code checks the names):
//   whs_manager      everything in WHS: settings (risk matrix, site jurisdictions, hours worked, company policies),
//                    approvals (risk assessments, investigations, closing incidents), the notification decision and
//                    the submission record, confidential reports. Not medical details (below).
//   whs_officer      supervisors and safety officers: assess hazards, classify incidents, draft risk assessments,
//                    investigate, raise, verify and close actions. Never confidential reports or medical details.
//   whs_investigator investigates incidents (team, timeline, statements, evidence, root cause).
//   whs_hsr          health and safety representative: reads the registers and adds consultation comments.
//   health_officer   the only role that reads confidential health information (medical treatment details), and the
//                    confidential reports.
// Every person in the company may report a hazard or an incident and follows their own reports, and sees what is
// assigned to them (a hazard or action they are responsible for, an investigation they are on, a notification they are
// to make). ERP administrators (the company's owner and administrators) may do what a WHS manager does except read
// medical details, and read confidential reports only while nobody in the company is a WHS manager or health officer.
// Executives read the registers. Other ERP roles report and follow their own, like every member.
//
// Medical details: only health officers. A WHS manager does not read them: the incident's own classification (outcome,
// body part, nature of injury, severity) is enough to manage it and to decide whether it is notifiable, and keeping
// medical records with the one role that needs them follows the brief (section 20: supervisors never, private health
// information apart from ordinary reporting). In a company of one person (own and example companies, or a registered
// company of one) that person holds every WHS capability.

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { companyPeople, loadErpAccess, type ErpAccess, type ErpRole } from '../erp/access';

export const WHS_ROLES = ['whs_manager', 'whs_officer', 'whs_investigator', 'whs_hsr', 'health_officer'] as const;
export type WhsRole = (typeof WHS_ROLES)[number];

export const WHS_CAPABILITIES = {
  /** Report a hazard or an incident, follow one's own reports. Every person in the company. */
  report: [],
  /** Read the registers (records that are not confidential). */
  view: ['whs_manager', 'whs_officer', 'whs_investigator', 'whs_hsr', 'health_officer', 'executive', 'erp_admin'],
  /** Assess hazards, classify incidents, draft risk assessments, raise, verify and close actions. */
  assess: ['whs_manager', 'whs_officer', 'erp_admin'],
  /** Investigate incidents. */
  investigate: ['whs_manager', 'whs_officer', 'whs_investigator', 'erp_admin'],
  /** Approve risk assessments and investigations, close incidents. */
  approve: ['whs_manager', 'erp_admin'],
  /** Record the notification decision and the submission. */
  notify: ['whs_manager', 'erp_admin'],
  /** WHS settings: the risk matrix, site jurisdictions, hours worked, company policies. */
  manage: ['whs_manager', 'erp_admin'],
  /** Consultation comments on records. */
  consult: ['whs_manager', 'whs_officer', 'whs_investigator', 'whs_hsr', 'health_officer', 'erp_admin'],
} as const satisfies Record<string, readonly (ErpRole | WhsRole)[]>;
export type WhsCapability = keyof typeof WHS_CAPABILITIES | 'confidential' | 'health';

export interface WhsAccess extends ErpAccess {
  can: Record<WhsCapability, boolean>;
}

const NEEDED: Record<WhsCapability, string> = {
  report: 'You do not have access to health and safety in this company',
  view: 'Only WHS staff, health and safety representatives, executives and ERP administrators can read the WHS registers',
  assess: 'Only WHS officers, WHS managers and ERP administrators can do that',
  investigate: 'Only investigators, WHS officers, WHS managers and ERP administrators can investigate incidents',
  approve: 'Only WHS managers and ERP administrators can approve or close this',
  notify: 'Only WHS managers and ERP administrators can record a notification decision or submission',
  manage: 'Only WHS managers and ERP administrators can change the WHS settings',
  consult: 'Only WHS staff, health and safety representatives and ERP administrators can add consultation comments',
  confidential: 'This report is confidential: only WHS managers and health officers can read it',
  health: 'Health details are confidential: only health officers can read them',
};

const has = (roles: readonly string[], allowed: readonly string[]) => roles.some((r) => allowed.includes(r));

/** Whether anyone in a registered company holds the roles that read confidential reports (else administrators may). */
async function confidentialHolders(db: D1Database, companyId: string): Promise<number> {
  const r = await db
    .prepare("SELECT COUNT(DISTINCT g.user_id) AS n FROM erp_role_grants g JOIN co_members m ON m.company_id = g.company_id AND m.user_id = g.user_id WHERE g.company_id = ? AND g.role IN ('whs_manager', 'health_officer')")
    .bind(companyId)
    .first<{ n: number }>();
  return Number(r?.n ?? 0);
}

export async function loadWhsAccess(db: D1Database, companyId: string, user: { id: string; name: string }): Promise<WhsAccess> {
  const a = await loadErpAccess(db, companyId, user);
  const roles = a.roles as readonly string[];
  const can = Object.fromEntries((Object.keys(WHS_CAPABILITIES) as (keyof typeof WHS_CAPABILITIES)[]).map((k) => [k, a.solo || k === 'report' || has(roles, WHS_CAPABILITIES[k])])) as Record<WhsCapability, boolean>;
  can.health = a.solo || roles.includes('health_officer');
  can.confidential = a.solo || roles.includes('whs_manager') || roles.includes('health_officer') || (roles.includes('erp_admin') && a.kind === 'registered' && (await confidentialHolders(db, a.companyId)) === 0);
  return { ...a, can };
}

/** The company in the route (":company") with the caller's WHS access, cached on the request; 403 without `cap`. */
export async function requireWhs(c: Context<AppEnv>, cap: WhsCapability = 'report'): Promise<WhsAccess> {
  const id = c.req.param('company') ?? '';
  const cached = (c as any).__whsAccess as WhsAccess | undefined;
  const a = cached && cached.companyId === id ? cached : await loadWhsAccess(c.env.DB, id, c.get('user'));
  (c as any).__whsAccess = a;
  assertWhs(a, cap);
  return a;
}

export function assertWhs(a: WhsAccess, cap: WhsCapability) {
  if (!a.can[cap]) throw new HttpError(403, NEEDED[cap]);
}

/** Who reads confidential reports in the company: said to a reporter before they mark a report confidential. */
export async function confidentialReaders(db: D1Database, a: WhsAccess): Promise<{ names: string[]; fallback: boolean }> {
  const people = await companyPeople(db, a);
  if (a.solo) return { names: people.map((p) => p.name), fallback: false };
  const holders = people.filter((p) => (p.roles as readonly string[]).some((r) => r === 'whs_manager' || r === 'health_officer'));
  if (holders.length) return { names: holders.map((p) => p.name), fallback: false };
  return { names: people.filter((p) => p.roles.includes('erp_admin')).map((p) => p.name), fallback: true };
}

/** People of the company holding one of `roles` (ERP administrators count for WHS manager duties when `admins`). */
export async function peopleWith(db: D1Database, a: Pick<ErpAccess, 'companyId' | 'kind'>, roles: readonly string[], admins = true): Promise<string[]> {
  const people = await companyPeople(db, a);
  const direct = people.filter((p) => (p.roles as readonly string[]).some((r) => roles.includes(r)));
  if (direct.length || !admins) return direct.map((p) => p.id);
  return people.filter((p) => p.roles.includes('erp_admin')).map((p) => p.id);
}

/** A person named on a record must be in the company. */
export async function assertPerson(db: D1Database, a: Pick<ErpAccess, 'companyId' | 'kind'>, userId: string | null | undefined, label: string) {
  if (!userId) return;
  const p = (await companyPeople(db, a)).find((x) => x.id === userId);
  if (!p) throw new HttpError(400, `${label} must be a person in this company`);
}

// ------------------------------------------------------------------ what each person may see

/** Hazards: the register for WHS readers (confidential ones only for confidential readers); else one's own and assigned. */
export function hazardScope(a: WhsAccess, alias = 'h'): { sql: string; args: unknown[] } {
  if (a.can.view && a.can.confidential) return { sql: '1', args: [] };
  if (a.can.view) return { sql: `(${alias}.confidential = 0 OR ${alias}.reported_by = ? OR ${alias}.responsible_id = ?)`, args: [a.userId, a.userId] };
  return { sql: `(${alias}.reported_by = ? OR ${alias}.responsible_id = ?)`, args: [a.userId, a.userId] };
}

/** Incidents: as hazards, plus the investigation team and the person responsible for a notification. */
export function incidentScope(a: WhsAccess, alias = 'i'): { sql: string; args: unknown[] } {
  const assigned = `EXISTS (SELECT 1 FROM whs_investigations sv JOIN whs_inv_team st ON st.company_id = sv.company_id AND st.investigation_id = sv.id WHERE sv.company_id = ${alias}.company_id AND sv.incident_id = ${alias}.id AND st.user_id = ?)
    OR EXISTS (SELECT 1 FROM whs_investigations sl WHERE sl.company_id = ${alias}.company_id AND sl.incident_id = ${alias}.id AND sl.lead_id = ?)
    OR EXISTS (SELECT 1 FROM whs_reg_notices sn WHERE sn.company_id = ${alias}.company_id AND sn.incident_id = ${alias}.id AND sn.responsible_id = ?)`;
  if (a.can.view && a.can.confidential) return { sql: '1', args: [] };
  if (a.can.view) return { sql: `(${alias}.confidential = 0 OR ${alias}.reported_by = ? OR ${assigned})`, args: [a.userId, a.userId, a.userId, a.userId] };
  return { sql: `(${alias}.reported_by = ? OR ${assigned})`, args: [a.userId, a.userId, a.userId, a.userId] };
}

/** Actions: the register for WHS readers (confidential sources only for confidential readers); else one's own. */
export function actionScope(a: WhsAccess, alias = 'x'): { sql: string; args: unknown[] } {
  if (a.can.view && a.can.confidential) return { sql: '1', args: [] };
  if (a.can.view) return { sql: `(${alias}.confidential = 0 OR ${alias}.responsible_id = ? OR ${alias}.created_by = ?)`, args: [a.userId, a.userId] };
  return { sql: `(${alias}.responsible_id = ? OR ${alias}.created_by = ?)`, args: [a.userId, a.userId] };
}

/** Risk assessments: WHS readers (confidential ones for confidential readers); else those one drafted or is responsible for. */
export function raScope(a: WhsAccess, alias = 'r'): { sql: string; args: unknown[] } {
  if (a.can.view && a.can.confidential) return { sql: '1', args: [] };
  if (a.can.view) return { sql: `(${alias}.confidential = 0 OR ${alias}.drafted_by = ? OR ${alias}.responsible_id = ?)`, args: [a.userId, a.userId] };
  return { sql: `(${alias}.drafted_by = ? OR ${alias}.responsible_id = ?)`, args: [a.userId, a.userId] };
}

/**
 * Segregation of duties: refused when the person did the step being checked, unless they are alone in the company
 * (the exception is then recorded). Returns true when the exception applies.
 */
export function segregation(a: WhsAccess, parties: [string | null | undefined, string][], decision: string): boolean {
  const hit = parties.find(([id]) => !!id && id === a.userId);
  if (!hit) return false;
  if (a.solo) return true;
  throw new HttpError(403, `You ${hit[1]}, so someone else must ${decision} (segregation of duties)`);
}
