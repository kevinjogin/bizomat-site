// The Company Admin console's server side (owner's request of 20 Nov 2026; docs/platform/company-admin.md): one place in
// the ERP where the owner and administrators of a registered company manage their own team. It adds what the company
// pages lacked: the team at a glance with what needs attention, the company's API tokens (seen and revoked by its
// administrators), and an access review export. Members, invitations, departments, roles, activity and settings are the
// existing company endpoints, with their own checks; nothing here widens them.
//
// Who: the owner and administrators of a registered company, active in it (a suspended administrator is refused), and
// only where the flag company_admin_console is on for the company (404 COMPANY_ADMIN_OFF otherwise). People outside the
// company get 404 (requireCompany), members who are not administrators 403. Never another company's data: every
// statement names the company.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { auditStmt } from '../services/audit';
import { MODULES, type ModuleKey, flagOn, moduleEnabled } from '../platform/flags';
import { csvResponse } from '../erp/util';
import { COMPANY_ROLE_LABELS, type CompanyAccess, coAuditStmt, normRole, requireCompany } from './access';
import { MEMBER_MODULES, membersV2 } from './members-access';
import { notifyPeople } from './members-routes';

export const companyAdminRoutes = new Hono<AppEnv>();

const DAY = 86_400_000;
const INACTIVE_DAYS = 30;
const STALE_TOKEN_DAYS = 90;

export async function consoleOn(db: D1Database, companyId: string): Promise<boolean> {
  try {
    return await flagOn(db, 'company_admin_console', { companyId });
  } catch {
    return false;
  }
}

/** The company of the route, for its owner or an active administrator, with the console on. */
export async function requireConsole(c: any): Promise<CompanyAccess> {
  const a = await requireCompany(c, 'admin');
  if ((a.member as { status?: string }).status === 'suspended') throw new HttpError(403, 'Your access to this company is suspended.', { code: 'MEMBER_SUSPENDED' });
  if (!(await consoleOn(c.env.DB, a.companyId))) throw new HttpError(404, 'Not found', { code: 'COMPANY_ADMIN_OFF' });
  return a;
}

// ------------------------------------------------------------------ where the person may open the console

companyAdminRoutes.get('/admin/companies', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB
    .prepare(
      `SELECT co.id, co.name, m.role FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL AND co.suspended_at IS NULL
        WHERE m.user_id = ? AND m.role IN ('owner','admin') AND COALESCE(m.status, 'active') = 'active' AND m.company_id = co.id ORDER BY co.name COLLATE NOCASE`,
    )
    .bind(user.id)
    .all<{ id: string; name: string; role: string }>();
  const out: { id: string; name: string; role: string }[] = [];
  for (const r of rows.results) if (await consoleOn(c.env.DB, r.id)) out.push({ id: r.id, name: r.name, role: normRole(r.role) });
  return c.json({ companies: out });
});

// ------------------------------------------------------------------ the team at a glance

interface Attention {
  key: string;
  level: 'high' | 'medium' | 'info';
  title: string;
  detail: string;
  tab: 'members' | 'departments' | 'roles' | 'security' | 'activity' | 'settings';
  count?: number;
}

const REG_LABELS: Record<string, string> = {
  not_registered: 'Not registered',
  registration_pending: 'Registration pending',
  verification_in_progress: 'Being checked',
  verified: 'Verified',
  verification_failed: 'Check failed',
  manual_review: 'In manual review',
  status_changed: 'Status changed at the register',
  suspended: 'Suspended',
  deregistered: 'Deregistered',
};

companyAdminRoutes.get('/c/:company/admin/overview', async (c) => {
  const a = await requireConsole(c);
  const db = c.env.DB;
  const t = now();
  const id = a.companyId;
  const v2 = await membersV2(db, id);

  const byRole = await db.prepare('SELECT role, COALESCE(status, \'active\') AS status, COUNT(*) AS n FROM co_members WHERE company_id = ? GROUP BY role, status').bind(id).all<{ role: string; status: string; n: number }>();
  const roles: Record<string, number> = { owner: 0, admin: 0, manager: 0, employee: 0, read_only: 0 };
  let active = 0;
  let suspended = 0;
  for (const r of byRole.results) {
    if (r.status === 'suspended') {
      suspended += r.n;
      continue;
    }
    active += r.n;
    roles[normRole(r.role)] = (roles[normRole(r.role)] ?? 0) + r.n;
  }
  const inv = await db
    .prepare(
      `SELECT SUM(CASE WHEN expires_at > ?2 THEN 1 ELSE 0 END) AS pending,
              SUM(CASE WHEN expires_at > ?2 AND expires_at <= ?3 THEN 1 ELSE 0 END) AS expiring,
              SUM(CASE WHEN expires_at <= ?2 AND expires_at > ?4 THEN 1 ELSE 0 END) AS expired
         FROM co_invitations WHERE company_id = ?1 AND accepted_at IS NULL AND revoked_at IS NULL`,
    )
    .bind(id, t, t + 2 * DAY, t - 30 * DAY)
    .first<{ pending: number | null; expiring: number | null; expired: number | null }>();
  const joins = await db.prepare("SELECT COUNT(*) AS n FROM company_join_requests WHERE company_id = ? AND status = 'pending'").bind(id).first<{ n: number }>();
  const depts = await db.prepare('SELECT COUNT(*) AS n FROM co_departments WHERE company_id = ? AND archived_at IS NULL').bind(id).first<{ n: number }>();
  const noDept = (depts?.n ?? 0) > 0
    ? await db
        .prepare(
          `SELECT COUNT(*) AS n FROM co_members m WHERE m.company_id = ?1 AND COALESCE(m.status, 'active') = 'active'
             AND NOT EXISTS (SELECT 1 FROM co_department_members d JOIN co_departments x ON x.company_id = d.company_id AND x.id = d.department_id AND x.archived_at IS NULL
                              WHERE d.company_id = ?1 AND d.user_id = m.user_id)`,
        )
        .bind(id)
        .first<{ n: number }>()
    : { n: 0 };
  const inactive = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM co_members m JOIN users u ON u.id = m.user_id
        WHERE m.company_id = ? AND COALESCE(m.status, 'active') = 'active' AND m.role <> 'owner'
          AND COALESCE(m.last_active_at, u.last_login_at, 0) < ?`,
    )
    .bind(id, t - INACTIVE_DAYS * DAY)
    .first<{ n: number }>();
  const support = await db
    .prepare('SELECT COUNT(*) AS n, MAX(ends_at) AS until FROM support_access_grants WHERE company_id = ? AND revoked_at IS NULL AND starts_at <= ? AND ends_at > ?')
    .bind(id, t, t)
    .first<{ n: number; until: number | null }>();
  const transfer = await db
    .prepare("SELECT x.to_user_id, x.expires_at, u.name FROM co_ownership_transfers x LEFT JOIN users u ON u.id = x.to_user_id WHERE x.company_id = ? AND x.status = 'pending'")
    .bind(id)
    .first<{ to_user_id: string; expires_at: number; name: string | null }>();
  const tokens = await db
    .prepare(
      `SELECT COUNT(*) AS active,
              SUM(CASE WHEN COALESCE(last_used_at, created_at) < ?2 THEN 1 ELSE 0 END) AS stale,
              SUM(CASE WHEN expires_at IS NOT NULL AND expires_at <= ?3 THEN 1 ELSE 0 END) AS expiring
         FROM api_tokens WHERE company_id = ?1 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?4)`,
    )
    .bind(id, t - STALE_TOKEN_DAYS * DAY, t + 14 * DAY, t)
    .first<{ active: number; stale: number | null; expiring: number | null }>();
  const unscoped = await db
    .prepare(
      `SELECT COUNT(DISTINCT k.user_id) AS n FROM api_tokens k JOIN co_members m ON m.user_id = k.user_id AND m.company_id = ?
        WHERE k.company_id IS NULL AND k.revoked_at IS NULL AND (k.expires_at IS NULL OR k.expires_at > ?)`,
    )
    .bind(id, t)
    .first<{ n: number }>();
  const reg = await db.prepare('SELECT registration_status FROM companies WHERE id = ?').bind(id).first<{ registration_status: string }>();
  const off: string[] = [];
  for (const key of Object.keys(MODULES) as ModuleKey[]) {
    if (!(await moduleEnabled(db, key, id).catch(() => true))) off.push(MODULES[key].label);
  }
  const recent = await db
    .prepare('SELECT l.id, l.action, l.target_type, l.metadata_json, l.created_at, u.name AS actor FROM co_audit l LEFT JOIN users u ON u.id = l.actor_id WHERE l.company_id = ? ORDER BY l.created_at DESC LIMIT 8')
    .bind(id)
    .all<{ id: string; action: string; target_type: string | null; metadata_json: string; created_at: number; actor: string | null }>();

  const attention: Attention[] = [];
  const add = (x: Attention) => attention.push(x);
  if (joins?.n) add({ key: 'join_requests', level: 'high', title: `${joins.n} ${joins.n === 1 ? 'person asks' : 'people ask'} to join`, detail: 'Approve or decline each request.', tab: 'members', count: joins.n });
  if (transfer) add({ key: 'transfer', level: 'high', title: 'An ownership transfer is waiting', detail: `${transfer.name ?? 'The new owner'} has until ${new Date(transfer.expires_at).toISOString().slice(0, 10)} to accept it.`, tab: 'members' });
  if (support?.n) add({ key: 'support', level: 'medium', title: 'BIZOMAT support can see this company', detail: `Read-only support access is open until ${new Date(support.until ?? t).toISOString().slice(0, 16).replace('T', ' ')} UTC. You can end it.`, tab: 'security' });
  if (inv?.expiring) add({ key: 'invites_expiring', level: 'medium', title: `${inv.expiring} ${inv.expiring === 1 ? 'invitation expires' : 'invitations expire'} within two days`, detail: 'Resend it if the person still needs to join.', tab: 'members', count: inv.expiring });
  if (inv?.expired) add({ key: 'invites_expired', level: 'info', title: `${inv.expired} ${inv.expired === 1 ? 'invitation' : 'invitations'} expired in the last 30 days without an answer`, detail: 'Invite the person again if they still need access.', tab: 'members', count: inv.expired });
  if (!a.company.email_verified_at) add({ key: 'email', level: 'medium', title: 'The company’s contact email is not confirmed', detail: 'Send a confirmation link from the company’s settings.', tab: 'settings' });
  if (roles.owner + roles.admin < 2) add({ key: 'one_admin', level: 'info', title: 'Only one person can administer the company', detail: 'Consider a second administrator, so the team is never locked out.', tab: 'members' });
  if (noDept?.n) add({ key: 'no_department', level: 'info', title: `${noDept.n} ${noDept.n === 1 ? 'member is' : 'members are'} in no department`, detail: 'Departments decide team scopes and what department heads see.', tab: 'departments', count: noDept.n });
  if (inactive?.n) add({ key: 'inactive', level: 'info', title: `${inactive.n} ${inactive.n === 1 ? 'member has' : 'members have'} not been active for ${INACTIVE_DAYS} days`, detail: 'Check whether they still need access.', tab: 'members', count: inactive.n });
  if (suspended) add({ key: 'suspended', level: 'info', title: `${suspended} ${suspended === 1 ? 'member is' : 'members are'} suspended`, detail: 'Reactivate or remove them.', tab: 'members', count: suspended });
  if (tokens?.stale) add({ key: 'stale_tokens', level: 'medium', title: `${tokens.stale} API ${tokens.stale === 1 ? 'token has' : 'tokens have'} not been used for ${STALE_TOKEN_DAYS} days`, detail: 'Revoke tokens nobody uses.', tab: 'security', count: tokens.stale });
  if (unscoped?.n) add({ key: 'unscoped_tokens', level: 'info', title: `${unscoped.n} ${unscoped.n === 1 ? 'member has' : 'members have'} older API tokens not limited to one company`, detail: 'They reach every company the person belongs to; ask them to replace them with tokens for this company.', tab: 'security', count: unscoped.n });
  if (off.length) add({ key: 'modules_off', level: 'info', title: `Switched off for this company: ${off.join(', ')}`, detail: 'BIZOMAT support switches modules on and off.', tab: 'roles' });
  const rank = { high: 0, medium: 1, info: 2 };
  attention.sort((x, y) => rank[x.level] - rank[y.level]);

  return c.json({
    company: { id, name: a.company.name, registration: { status: reg?.registration_status ?? 'not_registered', label: REG_LABELS[reg?.registration_status ?? 'not_registered'] ?? 'Unknown' }, emailConfirmed: !!a.company.email_verified_at, createdAt: a.company.created_at },
    me: { role: a.role, roleLabel: COMPANY_ROLE_LABELS[a.role] },
    membersV2: v2,
    people: { active, suspended, roles, invitations: { pending: inv?.pending ?? 0, expiring: inv?.expiring ?? 0 }, joinRequests: joins?.n ?? 0, departments: depts?.n ?? 0, noDepartment: noDept?.n ?? 0, inactive: inactive?.n ?? 0 },
    security: { supportAccess: support?.n ? { until: support.until } : null, transfer: transfer ? { to: transfer.name, expiresAt: transfer.expires_at } : null, tokens: { active: tokens?.active ?? 0, stale: tokens?.stale ?? 0, expiring: tokens?.expiring ?? 0 }, unscopedTokenHolders: unscoped?.n ?? 0 },
    modulesOff: off,
    attention,
    recent: recent.results.map((r) => ({ id: r.id, action: r.action, actor: r.actor, targetType: r.target_type, metadata: parseJson(r.metadata_json, {}), at: r.created_at })),
  });
});

// ------------------------------------------------------------------ the company's API tokens

companyAdminRoutes.get('/c/:company/admin/tokens', async (c) => {
  const a = await requireConsole(c);
  const t = now();
  const rows = await c.env.DB
    .prepare(
      `SELECT k.id, k.name, k.prefix, k.user_id, k.created_at, k.last_used_at, k.expires_at, k.apps_json, k.read_only, u.name AS user_name, u.email AS user_email, m.role
         FROM api_tokens k JOIN users u ON u.id = k.user_id LEFT JOIN co_members m ON m.company_id = k.company_id AND m.user_id = k.user_id
        WHERE k.company_id = ? AND k.revoked_at IS NULL AND (k.expires_at IS NULL OR k.expires_at > ?)
        ORDER BY COALESCE(k.last_used_at, k.created_at) DESC LIMIT 500`,
    )
    .bind(a.companyId, t)
    .all<any>();
  return c.json({
    tokens: rows.results.map((r) => ({
      id: r.id,
      name: r.name,
      prefix: r.prefix,
      person: { id: r.user_id, name: r.user_name, email: r.user_email, role: r.role ? normRole(r.role) : null },
      createdAt: r.created_at,
      lastUsedAt: r.last_used_at,
      expiresAt: r.expires_at,
      apps: parseJson<string[] | null>(r.apps_json, null),
      readOnly: !!r.read_only,
      stale: (r.last_used_at ?? r.created_at) < t - STALE_TOKEN_DAYS * DAY,
      canRevoke: a.role === 'owner' || r.user_id === a.userId || normRole(r.role ?? 'employee') !== 'owner',
    })),
    staleDays: STALE_TOKEN_DAYS,
  });
});

// An administrator revokes a token limited to this company: never the owner's (only the owner, or the person), and
// never a token of another company or an unscoped one (those belong to the person alone).
companyAdminRoutes.post('/c/:company/admin/tokens/:id/revoke', async (c) => {
  const a = await requireConsole(c);
  const db = c.env.DB;
  await rateLimit(db, `co-admin-token:${a.userId}`, 60, 60 * 60_000);
  const input = await body(c, z.object({ reason: z.string().trim().min(3).max(300) }));
  const tok = await db
    .prepare('SELECT k.id, k.name, k.user_id, m.role FROM api_tokens k LEFT JOIN co_members m ON m.company_id = k.company_id AND m.user_id = k.user_id WHERE k.id = ? AND k.company_id = ? AND k.revoked_at IS NULL')
    .bind(c.req.param('id'), a.companyId)
    .first<{ id: string; name: string; user_id: string; role: string | null }>();
  if (!tok) throw notFound('Token');
  if (a.role !== 'owner' && tok.user_id !== a.userId && normRole(tok.role ?? 'employee') === 'owner') throw new HttpError(403, 'Only the owner can revoke the owner’s tokens.');
  const t = now();
  await db.batch([
    db.prepare('UPDATE api_tokens SET revoked_at = ?, revoked_reason = ? WHERE id = ? AND company_id = ? AND revoked_at IS NULL').bind(t, `Revoked by a company administrator: ${input.reason}`.slice(0, 300), tok.id, a.companyId),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'company.token_revoked', targetType: 'api_token', targetId: tok.id, metadata: { name: tok.name, owner: tok.user_id, reason: input.reason }, ip: clientIp(c) }),
    auditStmt(db, { actorId: a.userId, action: 'company.token_revoked', targetType: 'api_token', targetId: tok.id, metadata: { companyId: a.companyId, owner: tok.user_id }, ip: clientIp(c) ?? undefined }),
  ]);
  if (tok.user_id !== a.userId) {
    await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [tok.user_id], kind: 'token_revoked', title: `Your API token “${tok.name}” for ${a.company.name} was revoked`, body: `An administrator of ${a.company.name} revoked it: ${input.reason}` }).catch(() => null);
  }
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ access review (for audits)

companyAdminRoutes.get('/c/:company/admin/access-review', async (c) => {
  const a = await requireConsole(c);
  const db = c.env.DB;
  await rateLimit(db, `co-admin-review:${a.userId}`, 30, 60 * 60_000);
  const v2 = await membersV2(db, a.companyId);
  const members = await db
    .prepare(
      `SELECT m.user_id, m.role, COALESCE(m.status, 'active') AS status, m.title, m.tasks_role, m.crm_role, m.fin_role, m.joined_at, m.last_active_at, u.name, u.email, u.last_login_at
         FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? ORDER BY u.name COLLATE NOCASE LIMIT 5000`,
    )
    .bind(a.companyId)
    .all<any>();
  const deps = await db
    .prepare('SELECT d.user_id, x.name FROM co_department_members d JOIN co_departments x ON x.company_id = d.company_id AND x.id = d.department_id AND x.archived_at IS NULL WHERE d.company_id = ?')
    .bind(a.companyId)
    .all<{ user_id: string; name: string }>();
  const deptOf = new Map<string, string[]>();
  for (const d of deps.results) deptOf.set(d.user_id, [...(deptOf.get(d.user_id) ?? []), d.name]);
  const access = v2
    ? await db.prepare('SELECT user_id, module, access, scope FROM co_member_access WHERE company_id = ?').bind(a.companyId).all<{ user_id: string; module: string; access: number; scope: string }>()
    : { results: [] as { user_id: string; module: string; access: number; scope: string }[] };
  const accOf = new Map<string, string[]>();
  for (const x of access.results) accOf.set(x.user_id, [...(accOf.get(x.user_id) ?? []), `${x.module}: ${x.access ? x.scope : 'no access'}`]);
  const tokens = await db
    .prepare('SELECT user_id, COUNT(*) AS n FROM api_tokens WHERE company_id = ? AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?) GROUP BY user_id')
    .bind(a.companyId, now())
    .all<{ user_id: string; n: number }>();
  const tokOf = new Map(tokens.results.map((x) => [x.user_id, x.n]));
  const day = (ms: number | null) => (ms ? new Date(ms).toISOString().slice(0, 10) : '');
  const rows = members.results.map((m) => ({
    name: m.name,
    email: m.email,
    role: COMPANY_ROLE_LABELS[normRole(m.role)],
    status: m.status === 'suspended' ? 'Suspended' : 'Active',
    title: m.title ?? '',
    departments: (deptOf.get(m.user_id) ?? []).join('; '),
    tasks: m.tasks_role ?? '',
    crm: m.crm_role ?? '',
    finance: m.fin_role ?? '',
    modules: v2 ? (accOf.get(m.user_id) ?? []).join('; ') || 'role defaults' : '',
    tokens: tokOf.get(m.user_id) ?? 0,
    joined: day(m.joined_at),
    lastActive: day(m.last_active_at ?? m.last_login_at ?? null),
  }));
  const t = now();
  await coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'company.access_review', metadata: { members: rows.length, format: c.req.query('format') === 'csv' ? 'csv' : 'json' }, ip: clientIp(c) }).run();
  if (c.req.query('format') === 'csv') {
    const head = ['Name', 'Email', 'Company role', 'Status', 'Title', 'Departments', 'Project Management role', 'CRM role', 'Finance role', ...(v2 ? ['Module access (changed from the role)'] : []), 'API tokens for this company', 'Joined', 'Last active'];
    return csvResponse(`access-review-${a.company.name}-${new Date(t).toISOString().slice(0, 10)}`, [
      head,
      ...rows.map((r) => [r.name, r.email, r.role, r.status, r.title, r.departments, r.tasks, r.crm, r.finance, ...(v2 ? [r.modules] : []), r.tokens, r.joined, r.lastActive]),
    ]);
  }
  return c.json({ membersV2: v2, modules: MEMBER_MODULES.map((m) => m.key), rows });
});
