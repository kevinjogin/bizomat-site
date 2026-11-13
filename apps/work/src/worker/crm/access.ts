// CRM authorisation. Every CRM route resolves the caller's membership of the organisation first (requireOrg); a person
// who is not a member gets 404, so another organisation's existence is never revealed. Every query then filters on
// that organisation's id, and record-level rights come from scopeSql()/canRecord(), never from the client.

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, notFound, parseJson } from '../lib/util';
import { type CrmModule, type CrmPerms, type CrmRole, type RecordModule, type Scope, CRM_ROLES, resolvePerms } from '../../shared/crm/roles';
import { orgSettings, type OrgSettings } from '../../shared/crm/defaults';

export interface OrgRow {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  description: string;
  currency: string;
  timezone: string;
  logo_key: string | null;
  settings_json: string;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface OrgAccess {
  org: OrgRow;
  orgId: string;
  userId: string;
  userName: string;
  role: CrmRole;
  perms: CrmPerms;
  settings: OrgSettings;
}

/** Overrides stored for a role: { module: { action: value } }. */
async function overridesFor(db: D1Database, orgId: string, role: CrmRole): Promise<Record<string, Record<string, unknown>>> {
  if (role === 'owner' || role === 'admin') return {};
  const rows = await db.prepare('SELECT module, perms_json FROM crm_role_permissions WHERE org_id = ? AND role = ?').bind(orgId, role).all<{ module: string; perms_json: string }>();
  const out: Record<string, Record<string, unknown>> = {};
  for (const r of rows.results) out[r.module] = parseJson(r.perms_json, {});
  return out;
}

export async function loadAccess(db: D1Database, orgId: string, user: { id: string; name: string }): Promise<OrgAccess> {
  if (typeof orgId !== 'string' || orgId.length > 64) throw notFound('Organisation');
  const row = await db
    .prepare('SELECT o.*, m.role AS member_role FROM crm_orgs o JOIN crm_members m ON m.org_id = o.id WHERE o.id = ? AND m.user_id = ? AND o.deleted_at IS NULL')
    .bind(orgId, user.id)
    .first<OrgRow & { member_role: CrmRole }>();
  if (!row || !CRM_ROLES.includes(row.member_role)) throw notFound('Organisation');
  const { member_role: role, ...org } = row;
  return { org, orgId: org.id, userId: user.id, userName: user.name, role, perms: resolvePerms(role, await overridesFor(db, org.id, role)), settings: orgSettings(parseJson(org.settings_json, {})) };
}

/** The organisation in the route (":org") with the caller's access, cached on the request. */
export async function requireOrg(c: Context<AppEnv>): Promise<OrgAccess> {
  const cached = (c as any).__crmAccess as OrgAccess | undefined;
  const orgId = c.req.param('org') ?? '';
  if (cached && cached.orgId === orgId) return cached;
  const user = c.get('user');
  const access = await loadAccess(c.env.DB, orgId, user);
  (c as any).__crmAccess = access;
  return access;
}

export function deny(msg = 'You do not have permission to do that'): never {
  throw new HttpError(403, msg);
}

/** A module-level permission (create, export, import, manage...). Throws 403. */
export function requirePerm(a: OrgAccess, module: CrmModule, action: string, msg?: string) {
  const v = (a.perms[module] as unknown as Record<string, unknown>)[action];
  if (v === true || v === 'all' || v === 'own') return;
  deny(msg);
}

export function hasPerm(a: OrgAccess, module: CrmModule, action: string): boolean {
  const v = (a.perms[module] as unknown as Record<string, unknown>)[action];
  return v === true || v === 'all' || v === 'own';
}

export interface Ownable {
  owner_id?: string | null;
  created_by?: string | null;
  assigned_to?: string | null;
}

/** Whether a scope covers this record: own = the owner, or the creator of an unowned record (activities: assignee). */
export function inScope(scope: Scope, a: OrgAccess, module: RecordModule, rec: Ownable): boolean {
  if (scope === 'all') return true;
  if (scope === 'none') return false;
  if (module === 'activities') return rec.assigned_to === a.userId || rec.created_by === a.userId;
  return rec.owner_id === a.userId || (!rec.owner_id && rec.created_by === a.userId);
}

export function canRecord(a: OrgAccess, module: RecordModule, action: 'view' | 'edit' | 'delete', rec: Ownable): boolean {
  return inScope(a.perms[module][action], a, module, rec);
}

/** Throws 404 when the record is not visible, 403 when it is visible but the action is not allowed. */
export function assertRecord(a: OrgAccess, module: RecordModule, action: 'view' | 'edit' | 'delete', rec: Ownable, what = 'Record') {
  if (!canRecord(a, module, 'view', rec)) throw notFound(what);
  if (action !== 'view' && !canRecord(a, module, action, rec)) deny(`You can ${action === 'edit' ? 'change' : 'delete'} only records you own`);
}

/**
 * The SQL condition limiting a list to the records the caller may see (or act on), for a table alias.
 * Returns '1' for 'all' and '0' for 'none'.
 */
export function scopeSql(a: OrgAccess, module: RecordModule, alias: string, action: 'view' | 'edit' | 'delete' = 'view'): { sql: string; args: unknown[] } {
  const scope = a.perms[module][action];
  if (scope === 'all') return { sql: '1', args: [] };
  if (scope === 'none') return { sql: '0', args: [] };
  if (module === 'activities') return { sql: `(${alias}.assigned_to = ? OR ${alias}.created_by = ?)`, args: [a.userId, a.userId] };
  return { sql: `(${alias}.owner_id = ? OR (${alias}.owner_id IS NULL AND ${alias}.created_by = ?))`, args: [a.userId, a.userId] };
}

/** Active member ids of the organisation. */
export async function memberIds(db: D1Database, orgId: string): Promise<Set<string>> {
  const rows = await db.prepare('SELECT user_id FROM crm_members WHERE org_id = ?').bind(orgId).all<{ user_id: string }>();
  return new Set(rows.results.map((r) => r.user_id));
}

/** A user id given for an owner or assignee must be a member of this organisation. */
export async function assertMember(db: D1Database, orgId: string, userId: string | null | undefined, label = 'That person') {
  if (!userId) return;
  const r = await db.prepare('SELECT 1 FROM crm_members WHERE org_id = ? AND user_id = ?').bind(orgId, userId).first();
  if (!r) throw new HttpError(400, `${label} is not a member of this organisation`);
}
