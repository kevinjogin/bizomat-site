// BIZOMAT ERP, Release 1: who may do what in a company's ERP modules (products and engineering, procurement).
//
// Companies are the ERP's (src/worker/system/system.ts), resolved exactly as Maintenance resolves them
// (src/worker/maintenance/access.ts): a registered company (co_companies, its people in co_members), a person's own
// company (sys_companies, its owner only) or their example company (sys_demo, its owner only). People who only share a
// tool with a company (guests) and everyone outside it get 404, so another company's existence is never revealed.
//
// Roles (erp_user_roles; a person may hold several):
//   erp_admin             everything, including ERP roles
//   executive             reads everything
//   engineer              products, variants, bills of materials, revisions, change requests and draft change orders,
//                         engineering documents
//   engineering_approver  approves and releases change orders, approves documents (and does an engineer's work)
//   buyer                 suppliers: create and change, contacts, product supplier prices
//   procurement_manager   approves, holds and blocks suppliers (and does a buyer's work)
//   viewer                reads products, engineering records and suppliers
// The company's owner and administrators are ERP administrators; other members are viewers until an ERP administrator
// gives them roles. In a person's own or example company the owner is the ERP administrator.
//
// Segregation of duties: nobody approves a change order they drafted, or approves a supplier they created, unless they
// are the only person in the company (own and example companies, or a registered company of one); that exception is
// recorded on the record and in the history.

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, notFound } from '../lib/util';

export const ERP_ROLES = ['erp_admin', 'executive', 'engineer', 'engineering_approver', 'buyer', 'procurement_manager', 'viewer'] as const;
export type ErpRole = (typeof ERP_ROLES)[number];

export const ROLE_LABELS: Record<ErpRole, string> = {
  erp_admin: 'ERP administrator',
  executive: 'Executive',
  engineer: 'Engineer',
  engineering_approver: 'Engineering approver',
  buyer: 'Buyer',
  procurement_manager: 'Procurement manager',
  viewer: 'Viewer',
};

/** Every action the ERP checks, and the roles that may take it (erp_admin may take every one). */
export const CAPABILITIES = {
  'products.view': ['executive', 'engineer', 'engineering_approver', 'buyer', 'procurement_manager', 'viewer'],
  'products.edit': ['engineer', 'engineering_approver'],
  'changes.raise': ['engineer', 'engineering_approver'],
  'changes.review': ['engineering_approver'],
  'changes.approve': ['engineering_approver'],
  'documents.edit': ['engineer', 'engineering_approver'],
  'documents.approve': ['engineering_approver'],
  'suppliers.view': ['executive', 'engineer', 'engineering_approver', 'buyer', 'procurement_manager', 'viewer'],
  'suppliers.edit': ['buyer', 'procurement_manager'],
  'suppliers.approve': ['procurement_manager'],
  'product_suppliers.edit': ['buyer', 'procurement_manager', 'engineer', 'engineering_approver'],
  'reports.view': ['executive', 'engineer', 'engineering_approver', 'buyer', 'procurement_manager', 'viewer'],
  'roles.manage': [],
} as const satisfies Record<string, readonly ErpRole[]>;
export type Capability = keyof typeof CAPABILITIES;

export type CompanyKind = 'registered' | 'own' | 'demo';

export interface ErpAccess {
  companyId: string;
  kind: CompanyKind;
  companyName: string;
  companyRole: 'owner' | 'admin' | 'member';
  userId: string;
  userName: string;
  roles: ErpRole[];
  /** True when nobody else is in the company: segregation of duties then allows a recorded exception. */
  solo: boolean;
}

export function can(a: Pick<ErpAccess, 'roles'>, cap: Capability): boolean {
  if (a.roles.includes('erp_admin')) return true;
  const allowed = CAPABILITIES[cap] as readonly ErpRole[];
  return a.roles.some((r) => allowed.includes(r));
}

export function capabilities(a: Pick<ErpAccess, 'roles'>): Record<Capability, boolean> {
  return Object.fromEntries((Object.keys(CAPABILITIES) as Capability[]).map((k) => [k, can(a, k)])) as Record<Capability, boolean>;
}

const NEEDED: Partial<Record<Capability, string>> = {
  'products.edit': 'Only engineers, engineering approvers and ERP administrators can change products',
  'changes.raise': 'Only engineers, engineering approvers and ERP administrators can raise engineering changes',
  'changes.review': 'Only engineering approvers and ERP administrators can review change requests',
  'changes.approve': 'Only engineering approvers and ERP administrators can approve or release change orders',
  'documents.edit': 'Only engineers, engineering approvers and ERP administrators can change engineering documents',
  'documents.approve': 'Only engineering approvers and ERP administrators can approve documents',
  'suppliers.edit': 'Only buyers, procurement managers and ERP administrators can change suppliers',
  'suppliers.approve': 'Only procurement managers and ERP administrators can approve, hold or block suppliers',
  'product_suppliers.edit': 'Only buyers, engineers and ERP administrators can change who supplies a product',
  'roles.manage': 'Only ERP administrators can give ERP roles',
};

export function deny(msg = 'You do not have permission to do that'): never {
  throw new HttpError(403, msg);
}

export function assertCan(a: ErpAccess, cap: Capability) {
  if (!can(a, cap)) deny(NEEDED[cap] ?? 'You do not have access to this in this company');
}

/** The roles a member holds: their own rows, else viewer; owners and administrators are always ERP administrators. */
export function effectiveRoles(companyRole: 'owner' | 'admin' | 'member', chosen: string[]): ErpRole[] {
  if (companyRole === 'owner' || companyRole === 'admin') return ['erp_admin'];
  const valid = chosen.filter((r): r is ErpRole => (ERP_ROLES as readonly string[]).includes(r));
  return valid.length ? valid : ['viewer'];
}

export async function loadErpAccess(db: D1Database, companyId: string, user: { id: string; name: string }): Promise<ErpAccess> {
  if (typeof companyId !== 'string' || !companyId || companyId.length > 64) throw notFound('Company');
  const reg = await db
    .prepare(
      `SELECT co.id, co.name, co.suspended_at, m.role,
              (SELECT group_concat(r.role) FROM erp_user_roles r WHERE r.company_id = co.id AND r.user_id = m.user_id) AS erp_roles,
              (SELECT COUNT(*) FROM co_members x WHERE x.company_id = co.id) AS people
         FROM co_companies co JOIN co_members m ON m.company_id = co.id AND m.user_id = ?
        WHERE co.id = ? AND co.deleted_at IS NULL`,
    )
    .bind(user.id, companyId)
    .first<{ id: string; name: string; suspended_at: number | null; role: 'owner' | 'admin' | 'member'; erp_roles: string | null; people: number }>();
  if (reg) {
    if (reg.suspended_at) throw new HttpError(423, 'This company account is suspended. Contact BIZOMAT support.');
    return {
      companyId: reg.id,
      kind: 'registered',
      companyName: reg.name,
      companyRole: reg.role,
      userId: user.id,
      userName: user.name,
      roles: effectiveRoles(reg.role, (reg.erp_roles ?? '').split(',').filter(Boolean)),
      solo: Number(reg.people) <= 1,
    };
  }
  const own = await db.prepare('SELECT id, name FROM sys_companies WHERE id = ? AND owner_id = ?').bind(companyId, user.id).first<{ id: string; name: string }>();
  if (own) return { companyId: own.id, kind: 'own', companyName: own.name, companyRole: 'owner', userId: user.id, userName: user.name, roles: ['erp_admin'], solo: true };
  const example = await db.prepare("SELECT company_id, name FROM sys_demo WHERE company_id = ? AND user_id = ? AND status IN ('building', 'ready')").bind(companyId, user.id).first<{ company_id: string; name: string }>();
  if (example) return { companyId: example.company_id, kind: 'demo', companyName: example.name, companyRole: 'owner', userId: user.id, userName: user.name, roles: ['erp_admin'], solo: true };
  throw notFound('Company');
}

/** The company in the route (":company") with the caller's access, cached on the request; 403 without `cap`. */
export async function requireErp(c: Context<AppEnv>, cap: Capability): Promise<ErpAccess> {
  const id = c.req.param('company') ?? '';
  const cached = (c as any).__erpAccess as ErpAccess | undefined;
  const a = cached && cached.companyId === id ? cached : await loadErpAccess(c.env.DB, id, c.get('user'));
  (c as any).__erpAccess = a;
  assertCan(a, cap);
  return a;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  companyRole: 'owner' | 'admin' | 'member';
  roles: ErpRole[];
  rolesAreDefault: boolean;
}

/** The people of the company with their ERP roles (a person's own or example company: its owner). */
export async function companyPeople(db: D1Database, a: Pick<ErpAccess, 'companyId' | 'kind'>): Promise<Person[]> {
  if (a.kind === 'own' || a.kind === 'demo') {
    const r =
      a.kind === 'own'
        ? await db.prepare('SELECT u.id, u.name, u.email FROM sys_companies s JOIN users u ON u.id = s.owner_id WHERE s.id = ?').bind(a.companyId).first<{ id: string; name: string; email: string }>()
        : await db.prepare('SELECT u.id, u.name, u.email FROM sys_demo s JOIN users u ON u.id = s.user_id WHERE s.company_id = ?').bind(a.companyId).first<{ id: string; name: string; email: string }>();
    return r ? [{ ...r, companyRole: 'owner', roles: ['erp_admin'], rolesAreDefault: true }] : [];
  }
  const rows = await db
    .prepare(
      `SELECT u.id, u.name, u.email, m.role AS company_role,
              (SELECT group_concat(r.role) FROM erp_user_roles r WHERE r.company_id = m.company_id AND r.user_id = m.user_id) AS erp_roles
         FROM co_members m JOIN users u ON u.id = m.user_id
        WHERE m.company_id = ? AND u.disabled_at IS NULL ORDER BY u.name COLLATE NOCASE`,
    )
    .bind(a.companyId)
    .all<{ id: string; name: string; email: string; company_role: 'owner' | 'admin' | 'member'; erp_roles: string | null }>();
  return rows.results.map((r) => {
    const chosen = (r.erp_roles ?? '').split(',').filter(Boolean);
    return { id: r.id, name: r.name, email: r.email, companyRole: r.company_role, roles: effectiveRoles(r.company_role, chosen), rolesAreDefault: r.company_role === 'member' ? !chosen.length : true };
  });
}

/**
 * Segregation of duties for an approval: refused when the approver is the person who drafted the record, unless they
 * are alone in the company. Returns true when the recorded exception applies.
 */
export function segregation(a: ErpAccess, authorId: string | null | undefined, what: string): boolean {
  if (!authorId || authorId !== a.userId) return false;
  if (a.solo) return true;
  throw new HttpError(403, `You ${what} yourself, so someone else must approve it (segregation of duties)`);
}
