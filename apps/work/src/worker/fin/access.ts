// BIZOMAT Finance authorisation. Every route resolves the caller's membership of the workspace first (requireOrg); a
// person who is not a member gets 404, so another workspace's existence is never revealed. Every query then filters on
// that workspace's id, and record-level rights come from scopeSql()/assertRecord(), never from the client.

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, notFound, parseJson } from '../lib/util';
import { FIN_ROLES, resolvePerms, type FinModule, type FinPerms, type FinRole, type RecordModule, type Scope, type WorkspaceKind } from '../../shared/fin/roles';
import { finSettings, type FinSettings } from '../../shared/fin/settings';

export interface FinOrgRow {
  id: string;
  name: string;
  kind: WorkspaceKind;
  currency: string;
  country: string;
  timezone: string;
  fy_start_month: number;
  gst_registered: number;
  gst_basis: 'cash' | 'accrual';
  gst_period: 'monthly' | 'quarterly' | 'annual';
  bas_method: 'simpler' | 'full';
  legal_name: string;
  abn: string;
  address: string;
  email: string;
  phone: string;
  lock_date: string | null;
  settings_json: string;
  logo_key: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface FinAccess {
  org: FinOrgRow;
  orgId: string;
  userId: string;
  userName: string;
  role: FinRole;
  perms: FinPerms;
  settings: FinSettings;
  /** GST applies: a business registered for GST. */
  gst: boolean;
}

async function overridesFor(db: D1Database, orgId: string, role: FinRole): Promise<Record<string, Record<string, unknown>>> {
  if (role === 'owner' || role === 'admin') return {};
  const rows = await db.prepare('SELECT module, perms_json FROM fin_role_permissions WHERE org_id = ? AND role = ?').bind(orgId, role).all<{ module: string; perms_json: string }>();
  const out: Record<string, Record<string, unknown>> = {};
  for (const r of rows.results) out[r.module] = parseJson(r.perms_json, {});
  return out;
}

export async function loadAccess(db: D1Database, orgId: string, user: { id: string; name: string }): Promise<FinAccess> {
  if (typeof orgId !== 'string' || orgId.length > 64) throw notFound('Workspace');
  const row = await db
    .prepare('SELECT o.*, m.role AS member_role FROM fin_orgs o JOIN fin_members m ON m.org_id = o.id WHERE o.id = ? AND m.user_id = ? AND o.deleted_at IS NULL')
    .bind(orgId, user.id)
    .first<FinOrgRow & { member_role: FinRole }>();
  if (!row || !FIN_ROLES.includes(row.member_role)) throw notFound('Workspace');
  const { member_role: role, ...org } = row;
  return {
    org,
    orgId: org.id,
    userId: user.id,
    userName: user.name,
    role,
    perms: resolvePerms(role, await overridesFor(db, org.id, role), org.kind),
    settings: finSettings(parseJson(org.settings_json, {}), org.kind),
    gst: org.kind === 'business' && !!org.gst_registered,
  };
}

/** The workspace in the route (":org") with the caller's access, cached on the request. */
export async function requireOrg(c: Context<AppEnv>): Promise<FinAccess> {
  const cached = (c as any).__finAccess as FinAccess | undefined;
  const orgId = c.req.param('org') ?? '';
  if (cached && cached.orgId === orgId) return cached;
  const access = await loadAccess(c.env.DB, orgId, c.get('user'));
  (c as any).__finAccess = access;
  return access;
}

export function deny(msg = 'You do not have permission to do that'): never {
  throw new HttpError(403, msg);
}

export function hasPerm(a: FinAccess, module: FinModule, action: string): boolean {
  const v = (a.perms[module] as unknown as Record<string, unknown>)[action];
  return v === true || v === 'all' || v === 'own';
}

/** A module-level permission (create, approve, export, manage...). Throws 403. */
export function requirePerm(a: FinAccess, module: FinModule, action: string, msg?: string) {
  if (!hasPerm(a, module, action)) deny(msg);
}

/** Business features (invoices, bills, purchase orders, expense claims) exist only in business workspaces. */
export function requireBusiness(a: FinAccess) {
  if (a.org.kind !== 'business') throw new HttpError(400, 'Invoices, bills, purchase orders and expense claims are available in business workspaces');
}

export interface Ownable {
  created_by?: string | null;
  claimant_id?: string | null;
  uploaded_by?: string | null;
}

const owner = (rec: Ownable) => rec.created_by ?? rec.uploaded_by ?? null;

export function inScope(scope: Scope, a: FinAccess, rec: Ownable): boolean {
  if (scope === 'all') return true;
  if (scope === 'none') return false;
  return owner(rec) === a.userId || rec.claimant_id === a.userId;
}

export function canRecord(a: FinAccess, module: RecordModule, action: 'view' | 'edit' | 'delete', rec: Ownable): boolean {
  return inScope(a.perms[module][action], a, rec);
}

/** Throws 404 when the record is not visible, 403 when it is visible but the action is not allowed. */
export function assertRecord(a: FinAccess, module: RecordModule, action: 'view' | 'edit' | 'delete', rec: Ownable, what = 'Record') {
  if (!canRecord(a, module, 'view', rec)) throw notFound(what);
  if (action !== 'view' && !canRecord(a, module, action, rec)) deny(`You can ${action === 'edit' ? 'change' : 'delete'} only records you created`);
}

/** The SQL condition limiting a list to the records the caller may see, for a table alias ('1' all, '0' none). */
export function scopeSql(a: FinAccess, module: RecordModule, alias: string, ownerColumn = 'created_by'): { sql: string; args: unknown[] } {
  const scope = a.perms[module].view;
  if (scope === 'all') return { sql: '1', args: [] };
  if (scope === 'none') return { sql: '0', args: [] };
  return { sql: `${alias}.${ownerColumn} = ?`, args: [a.userId] };
}

export async function assertMember(db: D1Database, orgId: string, userId: string | null | undefined, label = 'That person') {
  if (!userId) return;
  const r = await db.prepare('SELECT 1 FROM fin_members WHERE org_id = ? AND user_id = ?').bind(orgId, userId).first();
  if (!r) throw new HttpError(400, `${label} is not a member of this workspace`);
}

export async function membersWithPerm(db: D1Database, a: FinAccess, module: FinModule, action: string): Promise<string[]> {
  const rows = await db.prepare('SELECT user_id, role FROM fin_members WHERE org_id = ?').bind(a.orgId).all<{ user_id: string; role: FinRole }>();
  const out: string[] = [];
  for (const r of rows.results) {
    const perms = resolvePerms(r.role, await overridesFor(db, a.orgId, r.role), a.org.kind);
    const v = (perms[module] as unknown as Record<string, unknown>)[action];
    if (v === true || v === 'all' || v === 'own') out.push(r.user_id);
  }
  return out;
}
