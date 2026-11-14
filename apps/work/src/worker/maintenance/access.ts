// Asset Management and Maintenance (Stage 1): who may do what in a company. Every route resolves the caller's access to
// the company in the address first (requireMt); someone with no access gets 404, so another company's existence is never
// revealed. Every query then filters on that company's id, and record-level visibility comes from the scopes below,
// never from the client.
//
// Companies are the ERP's (src/worker/system/system.ts): a registered company (co_companies, its people in co_members)
// or a person's own company (sys_companies, its owner only). People who only share a tool with a company (guests) have
// no access to its maintenance.
//
// Maintenance roles, per company:
//   admin       everything: assets and their import, requests, work orders, roles and settings.
//   supervisor  assets, approving requests, making, assigning, closing and reopening work orders.
//   technician  the work orders assigned to them: timer, tasks, parts, notes, photos, completing.
//   requester   raises requests and follows their own; views the asset register.
// Defaults: a registered company's owner and administrators are maintenance administrators, its other members are
// requesters until an administrator gives them another role (mt_roles). The owner is always an administrator. A person's
// own company's owner is its administrator.

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, notFound } from '../lib/util';

export const MT_ROLES = ['admin', 'supervisor', 'technician', 'requester'] as const;
export type MtRole = (typeof MT_ROLES)[number];
const RANK: Record<MtRole, number> = { requester: 1, technician: 2, supervisor: 3, admin: 4 };

export type CompanyKind = 'registered' | 'own' | 'demo';
export type CompanyRole = 'owner' | 'admin' | 'member';

export interface MtAccess {
  companyId: string;
  kind: CompanyKind;
  companyName: string;
  /** The person's role in the company itself. */
  companyRole: CompanyRole;
  userId: string;
  userName: string;
  role: MtRole;
  /** True when no administrator has chosen the role (the default for the company role applies). */
  roleIsDefault: boolean;
}

export const defaultRole = (companyRole: CompanyRole): MtRole => (companyRole === 'owner' || companyRole === 'admin' ? 'admin' : 'requester');

/** The role that applies: the owner is always an administrator; otherwise an administrator's choice, else the default. */
export function effectiveRole(companyRole: CompanyRole, chosen: string | null | undefined): { role: MtRole; isDefault: boolean } {
  if (companyRole === 'owner') return { role: 'admin', isDefault: !chosen };
  if (chosen && (MT_ROLES as readonly string[]).includes(chosen)) return { role: chosen as MtRole, isDefault: false };
  return { role: defaultRole(companyRole), isDefault: true };
}

export async function loadMtAccess(db: D1Database, companyId: string, user: { id: string; name: string }): Promise<MtAccess> {
  if (typeof companyId !== 'string' || !companyId || companyId.length > 64) throw notFound('Company');
  const reg = await db
    .prepare(
      `SELECT co.id, co.name, co.suspended_at, m.role, r.role AS mt_role FROM co_companies co
         JOIN co_members m ON m.company_id = co.id AND m.user_id = ?
         LEFT JOIN mt_roles r ON r.company_id = co.id AND r.user_id = m.user_id
        WHERE co.id = ? AND co.deleted_at IS NULL`,
    )
    .bind(user.id, companyId)
    .first<{ id: string; name: string; suspended_at: number | null; role: CompanyRole; mt_role: string | null }>();
  if (reg) {
    if (reg.suspended_at) throw new HttpError(423, 'This company account is suspended. Contact BIZOMAT support.');
    const { role, isDefault } = effectiveRole(reg.role, reg.mt_role);
    return { companyId: reg.id, kind: 'registered', companyName: reg.name, companyRole: reg.role, userId: user.id, userName: user.name, role, roleIsDefault: isDefault };
  }
  const own = await db.prepare('SELECT id, name FROM sys_companies WHERE id = ? AND owner_id = ?').bind(companyId, user.id).first<{ id: string; name: string }>();
  if (own) return { companyId: own.id, kind: 'own', companyName: own.name, companyRole: 'owner', userId: user.id, userName: user.name, role: 'admin', roleIsDefault: true };
  // The person's example company (system/example.ts): theirs alone, while it is being made and once it is ready.
  const example = await db.prepare("SELECT company_id, name FROM sys_demo WHERE company_id = ? AND user_id = ? AND status IN ('building', 'ready')").bind(companyId, user.id).first<{ company_id: string; name: string }>();
  if (example) return { companyId: example.company_id, kind: 'demo', companyName: example.name, companyRole: 'owner', userId: user.id, userName: user.name, role: 'admin', roleIsDefault: true };
  throw notFound('Company');
}

/** The company in the route (":company") with the caller's access, cached on the request; 403 below `min`. */
export async function requireMt(c: Context<AppEnv>, min: MtRole = 'requester'): Promise<MtAccess> {
  const id = c.req.param('company') ?? '';
  const cached = (c as any).__mtAccess as MtAccess | undefined;
  const a = cached && cached.companyId === id ? cached : await loadMtAccess(c.env.DB, id, c.get('user'));
  (c as any).__mtAccess = a;
  if (!atLeast(a, min)) deny(ROLE_NEEDED[min]);
  return a;
}

const ROLE_NEEDED: Record<MtRole, string> = {
  requester: 'You do not have access to maintenance in this company',
  technician: 'Only technicians, supervisors and administrators can do that',
  supervisor: 'Only maintenance supervisors and administrators can do that',
  admin: 'Only maintenance administrators can do that',
};

export const atLeast = (a: Pick<MtAccess, 'role'>, min: MtRole) => RANK[a.role] >= RANK[min];
/** Supervisors and administrators manage requests, work orders and the asset register. */
export const isManager = (a: Pick<MtAccess, 'role'>) => atLeast(a, 'supervisor');

export function deny(msg = 'You do not have permission to do that'): never {
  throw new HttpError(403, msg);
}

/** The requests a person may see: all for managers; their own (and, for technicians, those of their work orders). */
export function requestScope(a: MtAccess, alias = 'r'): { sql: string; args: unknown[] } {
  if (isManager(a)) return { sql: '1', args: [] };
  if (a.role === 'technician') {
    return {
      sql: `(${alias}.requested_by = ? OR EXISTS (SELECT 1 FROM mt_work_orders sw WHERE sw.company_id = ${alias}.company_id AND sw.id = ${alias}.work_order_id AND sw.assigned_to = ?))`,
      args: [a.userId, a.userId],
    };
  }
  return { sql: `${alias}.requested_by = ?`, args: [a.userId] };
}

/** The work orders a person may see: all for managers; technicians those assigned to them; requesters those made from their requests. */
export function workOrderScope(a: MtAccess, alias = 'w'): { sql: string; args: unknown[] } {
  if (isManager(a)) return { sql: '1', args: [] };
  if (a.role === 'technician') return { sql: `${alias}.assigned_to = ?`, args: [a.userId] };
  return { sql: `EXISTS (SELECT 1 FROM mt_requests sr WHERE sr.company_id = ${alias}.company_id AND sr.work_order_id = ${alias}.id AND sr.requested_by = ?)`, args: [a.userId] };
}

export interface Person {
  id: string;
  name: string;
  email: string;
  companyRole: CompanyRole;
  role: MtRole;
  roleIsDefault: boolean;
}

/** The people of the company with their maintenance roles (a person's own company: its owner). */
export async function companyPeople(db: D1Database, a: Pick<MtAccess, 'companyId' | 'kind'>): Promise<Person[]> {
  if (a.kind === 'own') {
    const r = await db.prepare('SELECT u.id, u.name, u.email FROM sys_companies s JOIN users u ON u.id = s.owner_id WHERE s.id = ?').bind(a.companyId).first<{ id: string; name: string; email: string }>();
    return r ? [{ ...r, companyRole: 'owner', role: 'admin', roleIsDefault: true }] : [];
  }
  if (a.kind === 'demo') {
    const r = await db.prepare('SELECT u.id, u.name, u.email FROM sys_demo s JOIN users u ON u.id = s.user_id WHERE s.company_id = ?').bind(a.companyId).first<{ id: string; name: string; email: string }>();
    return r ? [{ ...r, companyRole: 'owner', role: 'admin', roleIsDefault: true }] : [];
  }
  const rows = await db
    .prepare(
      `SELECT u.id, u.name, u.email, m.role AS company_role, r.role AS mt_role FROM co_members m
         JOIN users u ON u.id = m.user_id
         LEFT JOIN mt_roles r ON r.company_id = m.company_id AND r.user_id = m.user_id
        WHERE m.company_id = ? AND u.disabled_at IS NULL ORDER BY u.name COLLATE NOCASE`,
    )
    .bind(a.companyId)
    .all<{ id: string; name: string; email: string; company_role: CompanyRole; mt_role: string | null }>();
  return rows.results.map((r) => {
    const { role, isDefault } = effectiveRole(r.company_role, r.mt_role);
    return { id: r.id, name: r.name, email: r.email, companyRole: r.company_role, role, roleIsDefault: isDefault };
  });
}

/** A person named on a record (responsible person, technician) must be in the company, with at least `min` role. */
export async function assertPerson(db: D1Database, a: MtAccess, userId: string | null | undefined, min: MtRole, label: string) {
  if (!userId) return;
  const p = (await companyPeople(db, a)).find((x) => x.id === userId);
  if (!p) throw new HttpError(400, `${label} must be a person in this company`);
  if (!atLeast(p, min)) throw new HttpError(400, `${label} must have a maintenance role of technician, supervisor or administrator`);
}

/** The companies where the person has maintenance access, with their role (for the quick request form). */
export async function mtCompanies(db: D1Database, user: { id: string }): Promise<{ id: string; name: string; kind: CompanyKind; role: MtRole }[]> {
  const [reg, own] = await db.batch([
    db
      .prepare(
        `SELECT co.id, co.name, m.role, r.role AS mt_role FROM co_members m
           JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL AND co.suspended_at IS NULL
           LEFT JOIN mt_roles r ON r.company_id = co.id AND r.user_id = m.user_id
          WHERE m.user_id = ? ORDER BY co.name COLLATE NOCASE`,
      )
      .bind(user.id),
    db.prepare('SELECT id, name FROM sys_companies WHERE owner_id = ?').bind(user.id),
  ]);
  const out: { id: string; name: string; kind: CompanyKind; role: MtRole }[] = (reg.results as any[]).map((r) => ({ id: r.id, name: r.name, kind: 'registered', role: effectiveRole(r.role, r.mt_role).role }));
  for (const r of own.results as any[]) out.push({ id: r.id, name: r.name, kind: 'own', role: 'admin' });
  const example = await db.prepare("SELECT company_id, name FROM sys_demo WHERE user_id = ? AND status = 'ready'").bind(user.id).first<{ company_id: string; name: string }>();
  if (example) out.push({ id: example.company_id, name: example.name, kind: 'demo', role: 'admin' });
  return out;
}
