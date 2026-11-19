// Who may do what in a company account (src/worker/company/routes.ts). Five company roles (Stage 1, R5; brief Part 4):
//
//   owner      one per company; owns every linked tool; may link and unlink tools, transfer ownership, delete.
//   admin      manages people (except the owner), departments, invitations and the company's details.
//   manager    \
//   employee    } see the company, its departments and people, and open the tools the company gives them.
//   read_only  /
//
// Manager, employee and read_only differ in the role each one gets in the company's tools: a preset (ROLE_PRESETS) that
// sets each tool's role when a person is added, invited or given a new company role, unless roles are chosen for the
// tools one by one. Each tool keeps its own detail. The role member (before R5) is read as employee.
//
// A member's access inside each tool is that tool's own role (co_members.tasks_role, crm_role, fin_role), kept in step
// with the tool's members table by src/worker/company/sync.ts. Numbers from a tool are shown in the control centre only
// to people who could see them in the tool, and to the head of a department for that department.

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, newId, notFound, now } from '../lib/util';

export type CompanyRole = 'owner' | 'admin' | 'manager' | 'employee' | 'read_only';
export const COMPANY_ROLES: CompanyRole[] = ['owner', 'admin', 'manager', 'employee', 'read_only'];
/** The roles a person can be given in a company (the owner is made by registering or a transfer). */
export const ASSIGNABLE_ROLES = ['admin', 'manager', 'employee', 'read_only'] as const;
/** The least a route needs: any person in the company, an administrator, or the owner. */
export type MinRole = 'member' | 'admin' | 'owner';

/** A stored role as a company role (member, from before R5, is employee). */
export function normRole(r: string): CompanyRole {
  return r === 'member' ? 'employee' : (COMPANY_ROLES as string[]).includes(r) ? (r as CompanyRole) : 'read_only';
}
export type ToolApp = 'tasks' | 'crm' | 'finance';
export const TOOL_APPS: ToolApp[] = ['tasks', 'crm', 'finance'];

export const TASKS_ROLES = ['admin', 'project_manager', 'member', 'viewer'] as const;
export const CRM_ROLES = ['admin', 'manager', 'sales', 'member', 'viewer'] as const;
export const FIN_ROLES = ['admin', 'accountant', 'finance_manager', 'contributor', 'viewer'] as const;
export type TasksRole = (typeof TASKS_ROLES)[number] | 'owner';
export type CrmRole = (typeof CRM_ROLES)[number] | 'owner';
export type FinRole = (typeof FIN_ROLES)[number] | 'owner';

export const COMPANY_ROLE_LABELS: Record<CompanyRole, string> = { owner: 'Owner', admin: 'Administrator', manager: 'Manager', employee: 'Employee', read_only: 'Read-only' };

/** Each company role's role in the company's tools (decision D9), unless the tools' roles are chosen one by one. */
export const ROLE_PRESETS: Record<Exclude<CompanyRole, 'owner'>, { tasks: (typeof TASKS_ROLES)[number]; crm: (typeof CRM_ROLES)[number]; finance: (typeof FIN_ROLES)[number] }> = {
  admin: { tasks: 'admin', crm: 'admin', finance: 'admin' },
  manager: { tasks: 'project_manager', crm: 'manager', finance: 'finance_manager' },
  employee: { tasks: 'member', crm: 'member', finance: 'contributor' },
  read_only: { tasks: 'viewer', crm: 'viewer', finance: 'viewer' },
};
export const TOOL_LABELS: Record<ToolApp, string> = { tasks: 'Project Management', crm: 'Customer Relationship Management', finance: 'Finance' };

export interface CompanyRow {
  id: string;
  name: string;
  kind: 'business' | 'individual';
  legal_name: string;
  country: string;
  abn: string | null;
  acn: string | null;
  abn_status: 'none' | 'format_ok' | 'active' | 'cancelled' | 'not_found';
  abr_entity_name: string;
  abr_entity_type: string;
  abr_gst_from: string | null;
  abr_state: string;
  abr_postcode: string;
  abr_checked_at: number | null;
  email: string;
  email_verified_at: number | null;
  phone: string;
  phone_kind: string;
  address_line1: string;
  address_line2: string;
  suburb: string;
  state: string;
  postcode: string;
  website: string;
  settings_json: string;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  suspended_at: number | null;
  deleted_at: number | null;
}

export interface MemberRow {
  company_id: string;
  user_id: string;
  role: CompanyRole;
  title: string;
  tasks_role: TasksRole | null;
  crm_role: CrmRole | null;
  fin_role: FinRole | null;
  invited_by: string | null;
  joined_at: number;
}

export interface CompanyAccess {
  company: CompanyRow;
  companyId: string;
  userId: string;
  userName: string;
  member: MemberRow;
  role: CompanyRole;
  /** The tools the company runs: app -> the tool's id. */
  tools: Partial<Record<ToolApp, string>>;
}

const RANK: Record<CompanyRole | 'member', number> = { owner: 3, admin: 2, manager: 1, employee: 1, read_only: 1, member: 1 };
export const atLeast = (role: CompanyRole, min: MinRole | CompanyRole) => RANK[role] >= RANK[min];

export async function companyTools(db: D1Database, companyId: string): Promise<Partial<Record<ToolApp, string>>> {
  const rows = await db.prepare('SELECT app, ref_id FROM co_tools WHERE company_id = ?').bind(companyId).all<{ app: ToolApp; ref_id: string }>();
  const out: Partial<Record<ToolApp, string>> = {};
  for (const r of rows.results) out[r.app] = r.ref_id;
  return out;
}

export async function loadAccess(db: D1Database, companyId: string, user: { id: string; name: string }): Promise<CompanyAccess> {
  if (typeof companyId !== 'string' || companyId.length > 64) throw notFound('Company');
  const company = await db.prepare('SELECT * FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(companyId).first<CompanyRow>();
  const member = company ? await db.prepare('SELECT * FROM co_members WHERE company_id = ? AND user_id = ?').bind(companyId, user.id).first<MemberRow>() : null;
  // Someone outside the company cannot tell whether it exists.
  if (!company || !member) throw notFound('Company');
  if (company.suspended_at) throw new HttpError(423, 'This company account is suspended. Contact BIZOMAT support.');
  const role = normRole(member.role);
  return { company, companyId, userId: user.id, userName: user.name, member: { ...member, role }, role, tools: await companyTools(db, companyId) };
}

/** The company in the route (":company") with the caller's access, cached on the request. */
export async function requireCompany(c: Context<AppEnv>, min: MinRole = 'member'): Promise<CompanyAccess> {
  const cached = (c as any).__coAccess as CompanyAccess | undefined;
  const id = c.req.param('company') ?? '';
  const a = cached && cached.companyId === id ? cached : await loadAccess(c.env.DB, id, c.get('user'));
  (c as any).__coAccess = a;
  if (!atLeast(a.role, min)) throw new HttpError(403, min === 'owner' ? 'Only the company owner can do that' : 'Only company administrators can do that');
  return a;
}

/** The company's own activity log. Never contents: who did what to which record. */
export function coAuditStmt(db: D1Database, e: { companyId: string; actorId: string | null; action: string; targetType?: string; targetId?: string; metadata?: Record<string, unknown>; ip?: string | null }) {
  return db
    .prepare('INSERT INTO co_audit (id, company_id, actor_id, action, target_type, target_id, metadata_json, ip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), e.companyId, e.actorId, e.action, e.targetType ?? null, e.targetId ?? null, JSON.stringify(e.metadata ?? {}), e.ip ?? null, now());
}
