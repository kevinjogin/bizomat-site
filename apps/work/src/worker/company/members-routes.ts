// Company members, roles and ownership transfer (owner's brief of 19 Nov 2026; docs/platform/members.md). The API of
// the Members page, under /api/company/c/<company>/team, acting only where the flag company_members_v2 is on (404
// MEMBERS_V2_OFF elsewhere). Every rule is enforced here; the page only hides what this refuses.
//
//   GET    /c/:company/team                          members: search, filters, sort and pages
//   GET    /c/:company/team/roles                    the role matrix, modules and scopes (Roles & Access tab)
//   PATCH  /c/:company/team/:userId/role             change a role (anti-escalation: members-access.assertMayManage)
//   PUT    /c/:company/team/:userId/access           modules, scopes and sensitive fields
//   POST   /c/:company/team/:userId/suspend          suspend (data kept) / reactivate
//   GET    /c/:company/team/:userId/open-items       what to reassign before removing
//   POST   /c/:company/team/:userId/remove           remove, reassigning open items to another member or leaving them
//   POST   /c/:company/team/:userId/verification-reminder
//   GET    /c/:company/team/activity                 who did what to whom, with old and new values
//   POST   /c/:company/team/invitations              invite one or many (bulk or CSV), with role, modules, scope, message
//   POST   /c/:company/team/invitations/:id/resend   a new link and expiry
//   GET    /c/:company/team/transfer                 the pending ownership transfer
//   POST   /c/:company/team/transfer                 the owner asks (password, a code if enrolled, the company's name)
//   DELETE /c/:company/team/transfer                 the owner cancels
//   GET    /transfers/mine, POST /transfers/:id/accept | decline       the new owner answers
//   GET    /notices, POST /notices/read              the person's in-app notices about their memberships
//   POST   /admin/platform/members/companies/:id/force-transfer         a platform admin's recovery transfer

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, placeholders, randomToken, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { verifyPassword } from '../auth/password';
import { auditStmt } from '../services/audit';
import { enqueueEmail, processOutbox } from '../services/email/outbox';
import { checkAddress, loadPolicy } from '../services/signup-guard';
import { appBase } from '../services/app-url';
import { checkSecondFactor, mfaOf, requireMfa, requireReauth } from '../platform/security';
import { ASSIGNABLE_ROLES, COMPANY_ROLE_LABELS, type CompanyAccess, type CompanyRole, coAuditStmt, companyTools, normRole, requireCompany } from './access';
import { memberToolStmts, rolesOf, syncDepartmentsOf } from './sync';
import { type InviteRow, ownershipTransferStmts, presetRoles, removeMember, sendInvite } from './routes';
import {
  CAPABILITIES,
  CAPABILITY_LABELS,
  DEFAULT_SCOPE,
  MEMBER_MODULES,
  MEMBER_MODULE_KEYS,
  type MemberModule,
  ROLE_MATRIX,
  SCOPES,
  SCOPE_APPLIES,
  SCOPE_LABELS,
  type Scope,
  accessFrom,
  assertMayManage,
  isMemberModule,
  membersV2,
  roleAllows,
} from './members-access';

export const membersRoutes = new Hono<AppEnv>();
export const platformMembersRoutes = new Hono<AppEnv>();
platformMembersRoutes.use('*', requireMfa);

const DAY = 86_400_000;
/** Invitations per company: at most this many an hour and a day (brief 4.2). */
export const INVITES_PER_HOUR = 30;
export const INVITES_PER_DAY = 100;

async function setting(db: D1Database, companyId: string, key: string, fallback: number, min: number, max: number): Promise<number> {
  const r = await db.prepare('SELECT value_json FROM company_settings WHERE company_id = ? AND key = ?').bind(companyId, key).first<{ value_json: string }>();
  const n = r ? Number(JSON.parse(r.value_json)) : NaN;
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
}
/** Days an invitation lasts once the members work is on (7, a company setting `invitation_days`, 1 to 30). */
export const invitationDays = (db: D1Database, companyId: string) => setting(db, companyId, 'invitation_days', 7, 1, 30);
/** Days an ownership transfer request waits for an answer (7, `transfer_days`, 1 to 30). */
export const transferDays = (db: D1Database, companyId: string) => setting(db, companyId, 'transfer_days', 7, 1, 30);

/** The company of the route with the caller's access, refused (404) unless the members work is on for it. */
async function team(c: any, min: 'member' | 'admin' | 'owner' = 'member'): Promise<CompanyAccess> {
  const a = await requireCompany(c, min);
  if (!(await membersV2(c.env.DB, a.companyId))) throw new HttpError(404, 'Not found', { code: 'MEMBERS_V2_OFF' });
  return a;
}

function erpLink(env: any, path: string): string | null {
  try {
    return `${appBase(env).origin}/erp${path}`;
  } catch {
    return null;
  }
}

/** In-app notices, and email through the outbox where email is set up (never for the example company). */
export async function notifyPeople(c: any, n: { companyId: string; company: string; userIds: string[]; kind: string; title: string; body?: string; link?: string }): Promise<void> {
  const db = c.env.DB as D1Database;
  const ids = Array.from(new Set(n.userIds.filter(Boolean)));
  if (!ids.length) return;
  const t = now();
  await db.batch(ids.map((uid) => db.prepare('INSERT INTO co_member_notices (id, company_id, user_id, kind, title, body, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), n.companyId, uid, n.kind, n.title.slice(0, 200), (n.body ?? '').slice(0, 1000), n.link ?? null, t)));
  const people = await db.prepare(`SELECT id, email FROM users WHERE disabled_at IS NULL AND id IN (${placeholders(ids.length)})`).bind(...ids).all<{ id: string; email: string }>();
  const url = n.link ? erpLink(c.env, n.link) : null;
  for (const p of people.results) {
    await enqueueEmail(c.env, { userId: p.id, to: p.email, data: { template: 'notification', organisation: n.company, title: n.title, body: n.body ?? null, url }, idempotencyKey: `co-member:${n.kind}:${n.companyId}:${p.id}:${t}` }).catch(() => null);
  }
  c.executionCtx?.waitUntil?.(processOutbox(c.env, { max: 10 }).catch(() => null));
}

async function adminsOf(db: D1Database, companyId: string): Promise<string[]> {
  const r = await db.prepare("SELECT user_id FROM co_members WHERE company_id = ? AND role IN ('owner','admin') AND status = 'active'").bind(companyId).all<{ user_id: string }>();
  return r.results.map((x) => x.user_id);
}

interface TeamRow {
  user_id: string;
  role: string;
  title: string;
  status: string;
  sensitive: number | null;
  joined_at: number;
  last_active_at: number | null;
  suspended_at: number | null;
  suspend_reason: string | null;
  tasks_role: string | null;
  crm_role: string | null;
  fin_role: string | null;
  name: string;
  email: string;
  email_verified_at: number | null;
}

async function loadTeam(db: D1Database, companyId: string) {
  const rows = await db
    .prepare(
      `SELECT m.user_id, m.role, m.title, m.status, m.sensitive, m.joined_at, m.last_active_at, m.suspended_at, m.suspend_reason, m.tasks_role, m.crm_role, m.fin_role,
              u.name, u.email, u.email_verified_at
         FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ?`,
    )
    .bind(companyId)
    .all<TeamRow>();
  const access = await db.prepare('SELECT user_id, module, access, scope FROM co_member_access WHERE company_id = ?').bind(companyId).all<{ user_id: string; module: string; access: number; scope: string }>();
  return rows.results.map((r) => {
    const role = normRole(r.role);
    const a = accessFrom(companyId, r.user_id, role, r.status === 'suspended' ? 'suspended' : 'active', r.sensitive, access.results.filter((x) => x.user_id === r.user_id), []);
    return { row: r, role, access: a };
  });
}

const view = (m: Awaited<ReturnType<typeof loadTeam>>[number], me: CompanyAccess) => {
  const full = me.role === 'owner' || me.role === 'admin';
  return {
    userId: m.row.user_id,
    name: m.row.name,
    email: m.row.email,
    emailVerified: !!m.row.email_verified_at,
    role: m.role,
    title: m.row.title,
    status: m.row.status === 'suspended' ? 'suspended' : 'active',
    joinedAt: m.row.joined_at,
    // Administrators see access, activity and suspension details; everyone sees who is in the company.
    lastActiveAt: full ? m.row.last_active_at : null,
    suspendedAt: full ? m.row.suspended_at : null,
    suspendReason: full ? m.row.suspend_reason : null,
    modules: full || m.row.user_id === me.userId ? m.access.modules : null,
    sensitive: full || m.row.user_id === me.userId ? m.access.sensitive : null,
    toolRoles: full ? rolesOf(m.row as any) : null,
    isMe: m.row.user_id === me.userId,
  };
};

membersRoutes.get('/c/:company/team', async (c) => {
  const a = await team(c);
  const db = c.env.DB;
  const q = (c.req.query('q') ?? '').trim().toLowerCase();
  const role = c.req.query('role');
  const status = c.req.query('status');
  const mod = c.req.query('module');
  const sort = c.req.query('sort') ?? 'role';
  const pageSize = Math.min(100, Math.max(5, Number(c.req.query('pageSize')) || 25));
  const page = Math.max(1, Number(c.req.query('page')) || 1);
  let list = await loadTeam(db, a.companyId);
  if (q) list = list.filter((m) => m.row.name.toLowerCase().includes(q) || m.row.email.toLowerCase().includes(q));
  if (role) list = list.filter((m) => m.role === role);
  if (status) list = list.filter((m) => (m.row.status === 'suspended' ? 'suspended' : 'active') === status);
  if (mod && isMemberModule(mod)) list = list.filter((m) => m.access.modules[mod].access);
  const rank: Record<CompanyRole, number> = { owner: 0, admin: 1, manager: 2, employee: 3, read_only: 4 };
  const by: Record<string, (x: (typeof list)[number], y: (typeof list)[number]) => number> = {
    name: (x, y) => x.row.name.localeCompare(y.row.name),
    role: (x, y) => rank[x.role] - rank[y.role] || x.row.name.localeCompare(y.row.name),
    joined: (x, y) => y.row.joined_at - x.row.joined_at,
    active: (x, y) => (y.row.last_active_at ?? 0) - (x.row.last_active_at ?? 0),
  };
  list.sort(by[sort] ?? by.role);
  const total = list.length;
  const pending = await pendingTransfer(db, a.companyId);
  return c.json({
    members: list.slice((page - 1) * pageSize, page * pageSize).map((m) => view(m, a)),
    total,
    page,
    pageSize,
    me: { userId: a.userId, role: a.role },
    can: {
      invite: roleAllows(a.role, 'invite'),
      manageMembers: roleAllows(a.role, 'manage_members'),
      manageAdmins: roleAllows(a.role, 'manage_admins'),
      transferOwnership: roleAllows(a.role, 'transfer_ownership'),
    },
    pendingTransfer: pending && (a.role === 'owner' || a.role === 'admin' || pending.to_user_id === a.userId) ? transferView(pending) : null,
  });
});

membersRoutes.get('/c/:company/team/roles', async (c) => {
  await team(c);
  return c.json({
    roles: ['owner', 'admin', 'manager', 'employee', 'read_only'].map((r) => ({ key: r, label: COMPANY_ROLE_LABELS[r as CompanyRole], defaultScope: DEFAULT_SCOPE[r as CompanyRole] })),
    capabilities: CAPABILITIES.map((k) => ({ key: k, label: CAPABILITY_LABELS[k], allow: ROLE_MATRIX[k] })),
    modules: MEMBER_MODULES.map((m) => ({ ...m, scopeApplies: SCOPE_APPLIES[m.key] })),
    scopes: SCOPES.map((s) => ({ key: s, label: SCOPE_LABELS[s] })),
    notes: [
      'Owner and administrators always have every module, every record and every field.',
      'A request must pass both these rules and the module’s own role (job roles in the ERP, Maintenance and Health and Safety; tool roles in Projects, Sales and CRM, and Finance).',
      'Own and team scopes limit what is seen in Sales and CRM and in Finance; in the other modules they limit changes to records the person or their team created.',
      'Anyone in the company can report a hazard or an incident, or ask for maintenance, whatever their role.',
    ],
  });
});

async function targetOf(db: D1Database, companyId: string, userId: string) {
  const t = await db.prepare('SELECT role, status, tasks_role, crm_role, fin_role FROM co_members WHERE company_id = ? AND user_id = ?').bind(companyId, userId).first<{ role: string; status: string; tasks_role: string | null; crm_role: string | null; fin_role: string | null }>();
  if (!t) throw notFound('Member');
  return { ...t, role: normRole(t.role), userId };
}

membersRoutes.patch('/c/:company/team/:userId/role', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, z.object({ role: z.enum(ASSIGNABLE_ROLES) }));
  const target = await targetOf(db, a.companyId, c.req.param('userId'));
  assertMayManage(a.role, a.userId, target, input.role);
  if (target.role === input.role) return c.json({ ok: true, unchanged: true });
  const roles = presetRoles(input.role, a.tools);
  await db.batch([
    db.prepare('UPDATE co_members SET role = ?, tasks_role = ?, crm_role = ?, fin_role = ? WHERE company_id = ? AND user_id = ?').bind(input.role, roles.tasks, roles.crm, roles.finance, a.companyId, target.userId),
    ...memberToolStmts(db, a.tools, target.userId, roles, a.userId),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.role_changed', targetType: 'user', targetId: target.userId, metadata: { from: target.role, to: input.role }, ip: clientIp(c) }),
  ]);
  await syncDepartmentsOf(db, a.tools, a.companyId, target.userId);
  await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [target.userId], kind: 'role_changed', title: `Your role in ${a.company.name} is now ${COMPANY_ROLE_LABELS[input.role]}`, body: `${a.userName} changed your role from ${COMPANY_ROLE_LABELS[target.role]} to ${COMPANY_ROLE_LABELS[input.role]}.`, link: `/company/c/${a.companyId}/members` });
  return c.json({ ok: true });
});

const accessSchema = z.object({
  modules: z.record(z.string(), z.object({ access: z.boolean(), scope: z.enum(SCOPES) })).default({}),
  sensitive: z.boolean().optional(),
});

membersRoutes.put('/c/:company/team/:userId/access', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, accessSchema);
  const target = await targetOf(db, a.companyId, c.req.param('userId'));
  assertMayManage(a.role, a.userId, target);
  if (target.role === 'admin') throw new HttpError(400, 'Administrators always have every module, every record and every field.');
  for (const k of Object.keys(input.modules)) if (!isMemberModule(k)) throw new HttpError(400, `Unknown module: ${k}`);
  if (input.sensitive !== undefined && target.role !== 'manager' && input.sensitive) throw new HttpError(400, 'Only managers can be given sensitive fields (administrators always have them).');
  const before = (await loadTeam(db, a.companyId)).find((m) => m.row.user_id === target.userId)!.access;
  const t = now();
  const stmts: D1PreparedStatement[] = Object.entries(input.modules).map(([k, v]) =>
    db
      .prepare('INSERT INTO co_member_access (company_id, user_id, module, access, scope, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(company_id, user_id, module) DO UPDATE SET access = excluded.access, scope = excluded.scope, updated_by = excluded.updated_by, updated_at = excluded.updated_at')
      .bind(a.companyId, target.userId, k, v.access ? 1 : 0, v.scope, a.userId, t),
  );
  if (input.sensitive !== undefined) stmts.push(db.prepare('UPDATE co_members SET sensitive = ? WHERE company_id = ? AND user_id = ?').bind(input.sensitive ? 1 : 0, a.companyId, target.userId));
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const [k, v] of Object.entries(input.modules)) {
    const was = before.modules[k as MemberModule];
    if (was.access !== v.access || was.scope !== v.scope) changes[k] = { from: was, to: v };
  }
  if (input.sensitive !== undefined && input.sensitive !== before.sensitive) changes.sensitive = { from: before.sensitive, to: input.sensitive };
  stmts.push(coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.access_changed', targetType: 'user', targetId: target.userId, metadata: { changes }, ip: clientIp(c) }));
  await db.batch(stmts);
  if (Object.keys(changes).length)
    await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [target.userId], kind: 'access_changed', title: `Your access in ${a.company.name} changed`, body: `${a.userName} changed which modules and records you can use.`, link: `/company/c/${a.companyId}/members` });
  return c.json({ ok: true, changes });
});

/** Ends a member's API tokens limited to this company (their other companies' tokens stay). */
const revokeTokensStmt = (db: D1Database, companyId: string, userId: string, reason: string) =>
  db.prepare("UPDATE api_tokens SET revoked_at = ?, revoked_reason = ? WHERE user_id = ? AND company_id = ? AND revoked_at IS NULL").bind(now(), reason, userId, companyId);

membersRoutes.post('/c/:company/team/:userId/suspend', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, z.object({ reason: z.string().trim().min(3).max(500) }));
  const target = await targetOf(db, a.companyId, c.req.param('userId'));
  assertMayManage(a.role, a.userId, target);
  if (target.status === 'suspended') return c.json({ ok: true, unchanged: true });
  const t = now();
  await db.batch([
    db.prepare("UPDATE co_members SET status = 'suspended', suspended_at = ?, suspended_by = ?, suspend_reason = ? WHERE company_id = ? AND user_id = ?").bind(t, a.userId, input.reason, a.companyId, target.userId),
    revokeTokensStmt(db, a.companyId, target.userId, 'suspended in the company'),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.suspended', targetType: 'user', targetId: target.userId, metadata: { reason: input.reason }, ip: clientIp(c) }),
  ]);
  await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [target.userId], kind: 'suspended', title: `Your access to ${a.company.name} is suspended`, body: `${a.userName} suspended your access. Your other companies are not affected. Reason: ${input.reason}` });
  return c.json({ ok: true });
});

membersRoutes.post('/c/:company/team/:userId/reactivate', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  const target = await targetOf(db, a.companyId, c.req.param('userId'));
  assertMayManage(a.role, a.userId, target);
  if (target.status !== 'suspended') return c.json({ ok: true, unchanged: true });
  await db.batch([
    db.prepare("UPDATE co_members SET status = 'active', suspended_at = NULL, suspended_by = NULL, suspend_reason = NULL WHERE company_id = ? AND user_id = ?").bind(a.companyId, target.userId),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.reactivated', targetType: 'user', targetId: target.userId, ip: clientIp(c) }),
  ]);
  await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [target.userId], kind: 'reactivated', title: `Your access to ${a.company.name} is back`, body: `${a.userName} reactivated your access.`, link: `/company/c/${a.companyId}/overview` });
  return c.json({ ok: true });
});

/** A member's open work in the company's tools: what removal would leave without anyone. */
async function openItems(db: D1Database, a: CompanyAccess, userId: string) {
  const crm = a.tools.crm;
  const one = async (sql: string, ...args: unknown[]) => Number((await db.prepare(sql).bind(...args).first<{ n: number }>())?.n ?? 0);
  return {
    crmDeals: crm ? await one("SELECT COUNT(*) AS n FROM crm_deals WHERE org_id = ? AND owner_id = ? AND status = 'open' AND deleted_at IS NULL", crm, userId) : 0,
    crmLeads: crm ? await one("SELECT COUNT(*) AS n FROM crm_leads WHERE org_id = ? AND owner_id = ? AND status NOT IN ('converted','unqualified','disqualified') AND deleted_at IS NULL", crm, userId) : 0,
    crmActivities: crm ? await one("SELECT COUNT(*) AS n FROM crm_activities WHERE org_id = ? AND assigned_to = ? AND status = 'open' AND deleted_at IS NULL", crm, userId) : 0,
    workOrders: await one("SELECT COUNT(*) AS n FROM mt_work_orders WHERE company_id = ? AND assigned_to = ? AND status NOT IN ('completed','closed','cancelled')", a.companyId, userId),
    whsActions: await one("SELECT COUNT(*) AS n FROM whs_actions WHERE company_id = ? AND responsible_id = ? AND status NOT IN ('completed','verified','closed','cancelled')", a.companyId, userId),
  };
}

membersRoutes.get('/c/:company/team/:userId/open-items', async (c) => {
  const a = await team(c, 'admin');
  await targetOf(c.env.DB, a.companyId, c.req.param('userId'));
  return c.json(await openItems(c.env.DB, a, c.req.param('userId')));
});

membersRoutes.post('/c/:company/team/:userId/remove', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, z.object({ reassignTo: z.string().max(64).nullable().default(null) }));
  const target = await targetOf(db, a.companyId, c.req.param('userId'));
  assertMayManage(a.role, a.userId, target);
  const items = await openItems(db, a, target.userId);
  if (input.reassignTo) {
    if (input.reassignTo === target.userId) throw new HttpError(400, 'Choose someone else to take over the open items.');
    const to = await db.prepare("SELECT 1 FROM co_members WHERE company_id = ? AND user_id = ? AND status = 'active'").bind(a.companyId, input.reassignTo).first();
    if (!to) throw new HttpError(400, 'Open items can go only to an active member of the company.');
    const stmts: D1PreparedStatement[] = [];
    const crm = a.tools.crm;
    if (crm) {
      const inCrm = await db.prepare('SELECT 1 FROM crm_members WHERE org_id = ? AND user_id = ?').bind(crm, input.reassignTo).first();
      if (inCrm) {
        const t = now();
        stmts.push(
          db.prepare("UPDATE crm_deals SET owner_id = ?, updated_at = ? WHERE org_id = ? AND owner_id = ? AND status = 'open' AND deleted_at IS NULL").bind(input.reassignTo, t, crm, target.userId),
          db.prepare("UPDATE crm_leads SET owner_id = ?, updated_at = ? WHERE org_id = ? AND owner_id = ? AND status NOT IN ('converted','unqualified','disqualified') AND deleted_at IS NULL").bind(input.reassignTo, t, crm, target.userId),
          db.prepare("UPDATE crm_activities SET assigned_to = ?, updated_at = ? WHERE org_id = ? AND assigned_to = ? AND status = 'open' AND deleted_at IS NULL").bind(input.reassignTo, t, crm, target.userId),
        );
      }
    }
    stmts.push(
      db.prepare("UPDATE mt_work_orders SET assigned_to = ?, updated_at = ? WHERE company_id = ? AND assigned_to = ? AND status NOT IN ('completed','closed','cancelled')").bind(input.reassignTo, now(), a.companyId, target.userId),
      db.prepare("UPDATE whs_actions SET responsible_id = ?, updated_at = ? WHERE company_id = ? AND responsible_id = ? AND status NOT IN ('completed','verified','closed','cancelled')").bind(input.reassignTo, now(), a.companyId, target.userId),
    );
    await db.batch(stmts);
  }
  await removeMember(c, a, target.userId, 'member.removed');
  await coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.items_reassigned', targetType: 'user', targetId: target.userId, metadata: { to: input.reassignTo, items }, ip: clientIp(c) }).run();
  await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [target.userId], kind: 'removed', title: `You were removed from ${a.company.name}`, body: `${a.userName} removed you from the company. The records you made stay with the company. Your other companies are not affected.` });
  return c.json({ ok: true, reassigned: input.reassignTo ? items : null });
});

membersRoutes.post('/c/:company/team/:userId/verification-reminder', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  const target = await targetOf(db, a.companyId, c.req.param('userId'));
  await rateLimit(db, `co-verify-remind:${a.companyId}:${target.userId}`, 1, DAY);
  const u = await db.prepare('SELECT email_verified_at FROM users WHERE id = ?').bind(target.userId).first<{ email_verified_at: number | null }>();
  if (u?.email_verified_at) return c.json({ ok: true, already: true });
  await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [target.userId], kind: 'verify_email', title: 'Please confirm your email address', body: `${a.userName} asked you to confirm your email address for ${a.company.name}. Sign in to BIZOMAT and choose "Send the confirmation again" if you cannot find the first email.`, link: '/tasks/settings/profile' });
  await coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.verification_reminded', targetType: 'user', targetId: target.userId, ip: clientIp(c) }).run();
  return c.json({ ok: true });
});

membersRoutes.get('/c/:company/team/activity', async (c) => {
  const a = await team(c, 'admin');
  const page = Math.max(1, Number(c.req.query('page')) || 1);
  const rows = await c.env.DB
    .prepare(
      `SELECT x.id, x.action, x.actor_id, x.target_type, x.target_id, x.metadata_json, x.created_at, ua.name AS actor_name, ut.name AS target_name
         FROM co_audit x LEFT JOIN users ua ON ua.id = x.actor_id LEFT JOIN users ut ON ut.id = x.target_id AND x.target_type = 'user'
        WHERE x.company_id = ? AND (x.action LIKE 'member.%' OR x.action LIKE 'invitation.%' OR x.action LIKE 'ownership.%')
        ORDER BY x.created_at DESC LIMIT 51 OFFSET ?`,
    )
    .bind(a.companyId, (page - 1) * 50)
    .all<any>();
  return c.json({
    page,
    more: rows.results.length > 50,
    events: rows.results.slice(0, 50).map((r) => ({ id: r.id, action: r.action, actor: r.actor_name, targetType: r.target_type, target: r.target_name ?? r.target_id, details: JSON.parse(r.metadata_json || '{}'), at: r.created_at })),
  });
});

// ------------------------------------------------------------------ invitations

const inviteManySchema = z.object({
  emails: z.array(z.string().trim().toLowerCase().max(320)).min(1).max(100),
  role: z.enum(ASSIGNABLE_ROLES).default('employee'),
  title: z.string().trim().max(100).default(''),
  modules: z.record(z.string(), z.object({ access: z.boolean(), scope: z.enum(SCOPES) })).default({}),
  sensitive: z.boolean().default(false),
  message: z.string().trim().max(1000).default(''),
});

membersRoutes.post('/c/:company/team/invitations', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, inviteManySchema);
  if (input.role === 'admin' && a.role !== 'owner') throw new HttpError(403, 'Only the owner can invite administrators', { code: 'ADMIN_PROTECTED' });
  for (const k of Object.keys(input.modules)) if (!isMemberModule(k)) throw new HttpError(400, `Unknown module: ${k}`);
  if (input.sensitive && input.role !== 'manager') throw new HttpError(400, 'Only managers can be given sensitive fields (administrators always have them).');
  const t = now();
  const emails = Array.from(new Set(input.emails.filter(Boolean)));
  // Per company: at most INVITES_PER_HOUR an hour and INVITES_PER_DAY a day.
  const sent = await db
    .prepare('SELECT SUM(CASE WHEN created_at > ? THEN 1 ELSE 0 END) AS hour, COUNT(*) AS day FROM co_invitations WHERE company_id = ? AND created_at > ?')
    .bind(t - 3_600_000, a.companyId, t - DAY)
    .first<{ hour: number | null; day: number }>();
  const room = Math.min(INVITES_PER_HOUR - Number(sent?.hour ?? 0), INVITES_PER_DAY - Number(sent?.day ?? 0));
  if (room <= 0) throw new HttpError(429, `This company has sent its ${INVITES_PER_HOUR} invitations for this hour (or ${INVITES_PER_DAY} for the day). Try again later.`, { code: 'INVITE_LIMIT' });
  const policy = await loadPolicy(db);
  const days = await invitationDays(db, a.companyId);
  const roles = presetRoles(input.role, a.tools);
  const results: { email: string; status: 'sent' | 'invalid' | 'already_member' | 'already_invited' | 'limit'; message?: string; id?: string; delivery?: string }[] = [];
  let made = 0;
  for (const email of emails) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      results.push({ email, status: 'invalid', message: 'Not an email address' });
      continue;
    }
    const mail = await checkAddress(c.env, email, policy);
    if (!mail.ok) {
      results.push({ email, status: 'invalid', message: mail.message });
      continue;
    }
    if (await db.prepare('SELECT 1 FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? AND u.email = ?').bind(a.companyId, email).first()) {
      results.push({ email, status: 'already_member' });
      continue;
    }
    if (await db.prepare('SELECT 1 FROM co_invitations WHERE company_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?').bind(a.companyId, email, t).first()) {
      results.push({ email, status: 'already_invited', message: 'Already invited: resend it from Invitations' });
      continue;
    }
    if (made >= room) {
      results.push({ email, status: 'limit', message: 'Over the company’s invitation limit for now' });
      continue;
    }
    const token = randomToken(32);
    const inv: InviteRow = {
      id: newId(),
      company_id: a.companyId,
      email,
      role: input.role,
      title: input.title,
      tasks_role: roles.tasks,
      crm_role: roles.crm,
      fin_role: roles.finance,
      department_ids: '[]',
      invited_by: a.userId,
      created_at: t,
      expires_at: t + days * DAY,
      accepted_at: null,
      revoked_at: null,
      access_json: JSON.stringify({ modules: input.modules, sensitive: input.sensitive }),
      message: input.message || null,
    };
    await db.batch([
      db
        .prepare('INSERT INTO co_invitations (id, company_id, email, role, title, tasks_role, crm_role, fin_role, department_ids, token_hash, invited_by, created_at, expires_at, access_json, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(inv.id, a.companyId, email, inv.role, inv.title, inv.tasks_role, inv.crm_role, inv.fin_role, '[]', await sha256Hex(token), a.userId, t, inv.expires_at, inv.access_json, inv.message),
      coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'invitation.created', targetType: 'invitation', targetId: inv.id, metadata: { role: inv.role, domain: email.split('@')[1], bulk: emails.length > 1 }, ip: clientIp(c) }),
    ]);
    const r = await sendInvite(c, a, inv, token);
    made++;
    results.push({ email, status: 'sent', id: inv.id, delivery: r.delivery });
  }
  return c.json({ results, sent: made, expiresInDays: days }, made ? 201 : 200);
});

membersRoutes.post('/c/:company/team/invitations/:id/resend', async (c) => {
  const a = await team(c, 'admin');
  const db = c.env.DB;
  await rateLimit(db, `co-invite-resend:${a.companyId}:${c.req.param('id')}`, 5, DAY);
  const inv = await db.prepare('SELECT * FROM co_invitations WHERE company_id = ? AND id = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(a.companyId, c.req.param('id')).first<InviteRow>();
  if (!inv) throw notFound('Invitation');
  if (inv.role === 'admin' && a.role !== 'owner') throw new HttpError(403, 'Only the owner can invite administrators', { code: 'ADMIN_PROTECTED' });
  const token = randomToken(32);
  const t = now();
  const expires = t + (await invitationDays(db, a.companyId)) * DAY;
  // A new link: the earlier one stops working.
  await db.batch([
    db.prepare('UPDATE co_invitations SET token_hash = ?, expires_at = ?, resent_at = ?, resend_count = resend_count + 1 WHERE company_id = ? AND id = ?').bind(await sha256Hex(token), expires, t, a.companyId, inv.id),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'invitation.resent', targetType: 'invitation', targetId: inv.id, ip: clientIp(c) }),
  ]);
  const r = await sendInvite(c, a, { ...inv, expires_at: expires }, token);
  return c.json({ ok: true, delivery: r.delivery, expiresAt: expires });
});

// ------------------------------------------------------------------ ownership transfer

interface TransferRow {
  id: string;
  company_id: string;
  from_user_id: string;
  to_user_id: string;
  from_new_role: string;
  status: string;
  kind: string;
  reason: string | null;
  created_at: number;
  expires_at: number;
  decided_at: number | null;
}

/** The company's pending transfer; one past its expiry is marked expired first. */
async function pendingTransfer(db: D1Database, companyId: string): Promise<TransferRow | null> {
  const p = await db.prepare("SELECT * FROM co_ownership_transfers WHERE company_id = ? AND status = 'pending'").bind(companyId).first<TransferRow>();
  if (p && p.expires_at <= now()) {
    await db.prepare("UPDATE co_ownership_transfers SET status = 'expired', decided_at = ? WHERE company_id = ? AND id = ? AND status = 'pending'").bind(now(), companyId, p.id).run();
    await coAuditStmt(db, { companyId, actorId: null, action: 'ownership.transfer_expired', targetType: 'user', targetId: p.to_user_id }).run();
    return null;
  }
  return p;
}

const transferView = (t: TransferRow) => ({ id: t.id, fromUserId: t.from_user_id, toUserId: t.to_user_id, fromNewRole: t.from_new_role, status: t.status, createdAt: t.created_at, expiresAt: t.expires_at });

/** The password, and a code when the person has two-factor sign-in (brief 3.2). */
async function confirmIdentity(c: any, input: { password: string; code?: string; recoveryCode?: string }): Promise<void> {
  const db = c.env.DB as D1Database;
  const user = c.get('user');
  await rateLimit(db, `co-transfer-auth:${user.id}`, 10, 900_000);
  const u = await db.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first<{ password_hash: string | null }>();
  const ok = await verifyPassword(input.password, u?.password_hash ?? null);
  const mfa = ok ? await mfaOf(db, user.id) : null;
  const second = !mfa?.confirmed_at || !!(await checkSecondFactor(c.env, mfa, input));
  if (!ok || !second) throw new HttpError(400, mfa?.confirmed_at ? 'The password or the code is not right.' : 'The password is not right.', { code: 'REAUTH_INVALID' });
}

membersRoutes.get('/c/:company/team/transfer', async (c) => {
  const a = await team(c);
  const p = await pendingTransfer(c.env.DB, a.companyId);
  if (!p || !(a.role === 'owner' || a.role === 'admin' || p.to_user_id === a.userId)) return c.json({ transfer: null });
  return c.json({ transfer: transferView(p) });
});

membersRoutes.post('/c/:company/team/transfer', async (c) => {
  const a = await team(c, 'owner');
  const db = c.env.DB;
  const input = await body(
    c,
    z.object({
      toUserId: z.string().min(1).max(64),
      newRole: z.enum(ASSIGNABLE_ROLES).default('admin'),
      companyName: z.string().trim().min(1).max(200),
      password: z.string().min(1).max(200),
      code: z.string().trim().max(8).optional(),
      recoveryCode: z.string().trim().max(20).optional(),
    }),
  );
  await confirmIdentity(c, input);
  if (input.companyName.trim().toLowerCase() !== a.company.name.trim().toLowerCase()) throw new HttpError(400, 'Type the company’s name exactly to confirm.', { code: 'NAME_MISMATCH' });
  if (input.toUserId === a.userId) throw new HttpError(400, 'Choose another member.');
  const target = await db
    .prepare('SELECT m.role, m.status, u.email_verified_at, u.disabled_at FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? AND m.user_id = ?')
    .bind(a.companyId, input.toUserId)
    .first<{ role: string; status: string; email_verified_at: number | null; disabled_at: number | null }>();
  if (!target) throw new HttpError(400, 'Ownership can go only to someone who has joined the company (an invitation is not enough).', { code: 'NOT_MEMBER' });
  if (target.status === 'suspended' || target.disabled_at) throw new HttpError(400, 'Ownership cannot go to a suspended member.', { code: 'TARGET_SUSPENDED' });
  if (!target.email_verified_at) throw new HttpError(400, 'Ownership can go only to a member who has confirmed their email address.', { code: 'EMAIL_UNVERIFIED' });
  if (normRole(target.role) === 'read_only') throw new HttpError(400, 'Ownership cannot go to a read-only member. Change their role first.', { code: 'TARGET_READ_ONLY' });
  if (await pendingTransfer(db, a.companyId)) throw new HttpError(409, 'A transfer is already waiting for an answer. Cancel it first.', { code: 'TRANSFER_PENDING' });
  const t = now();
  const id = newId();
  try {
    await db.batch([
      db
        .prepare("INSERT INTO co_ownership_transfers (id, company_id, from_user_id, to_user_id, from_new_role, status, kind, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, 'pending', 'request', ?, ?, ?)")
        .bind(id, a.companyId, a.userId, input.toUserId, input.newRole, a.userId, t, t + (await transferDays(db, a.companyId)) * DAY),
      coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'ownership.transfer_requested', targetType: 'user', targetId: input.toUserId, metadata: { newRoleForOwner: input.newRole }, ip: clientIp(c) }),
    ]);
  } catch {
    throw new HttpError(409, 'A transfer is already waiting for an answer. Cancel it first.', { code: 'TRANSFER_PENDING' });
  }
  await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [input.toUserId], kind: 'transfer_requested', title: `${a.userName} asks you to become the owner of ${a.company.name}`, body: 'Open BIZOMAT to accept or decline. The request expires if it is not answered.', link: `/company/c/${a.companyId}/members` });
  return c.json({ ok: true, id }, 201);
});

membersRoutes.delete('/c/:company/team/transfer', async (c) => {
  const a = await team(c, 'owner');
  const db = c.env.DB;
  const p = await pendingTransfer(db, a.companyId);
  if (!p) throw notFound('Transfer');
  await db.batch([
    db.prepare("UPDATE co_ownership_transfers SET status = 'cancelled', decided_at = ?, decided_by = ? WHERE company_id = ? AND id = ? AND status = 'pending'").bind(now(), a.userId, a.companyId, p.id),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'ownership.transfer_cancelled', targetType: 'user', targetId: p.to_user_id, ip: clientIp(c) }),
  ]);
  await notifyPeople(c, { companyId: a.companyId, company: a.company.name, userIds: [p.to_user_id], kind: 'transfer_cancelled', title: `The ownership transfer of ${a.company.name} was cancelled`, body: `${a.userName} cancelled the request.` });
  return c.json({ ok: true });
});

membersRoutes.get('/transfers/mine', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB
    .prepare(
      `SELECT t.*, co.name AS company, u.name AS from_name FROM co_ownership_transfers t JOIN co_companies co ON co.id = t.company_id AND co.deleted_at IS NULL
         LEFT JOIN users u ON u.id = t.from_user_id
        WHERE t.to_user_id = ? AND t.status = 'pending' AND t.expires_at > ? ORDER BY t.created_at DESC`,
    )
    .bind(user.id, now())
    .all<TransferRow & { company: string; from_name: string | null }>();
  return c.json({ transfers: rows.results.map((r) => ({ ...transferView(r), companyId: r.company_id, company: r.company, from: r.from_name })) });
});

/** Applies a transfer in one batch (one transaction): the new owner everywhere, the old owner in the chosen role. */
async function applyTransfer(db: D1Database, companyId: string, fromUserId: string, toUserId: string, fromNewRole: CompanyRole, extra: D1PreparedStatement[]): Promise<void> {
  const tools = await companyTools(db, companyId);
  const t = now();
  const stmts = [...ownershipTransferStmts(db, companyId, tools, fromUserId, toUserId, t)];
  if (fromNewRole !== 'admin' && fromNewRole !== 'owner') {
    const roles = presetRoles(fromNewRole as (typeof ASSIGNABLE_ROLES)[number], tools);
    stmts.push(
      db.prepare('UPDATE co_members SET role = ?, tasks_role = ?, crm_role = ?, fin_role = ? WHERE company_id = ? AND user_id = ?').bind(fromNewRole, roles.tasks, roles.crm, roles.finance, companyId, fromUserId),
      ...memberToolStmts(db, tools, fromUserId, roles, toUserId),
    );
  }
  await db.batch([...stmts, ...extra]);
  const { syncCompany } = await import('./identity');
  await syncCompany(db, companyId).catch(() => null);
}

membersRoutes.post('/transfers/:id/accept', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const t = await db.prepare('SELECT * FROM co_ownership_transfers WHERE id = ? AND to_user_id = ?').bind(c.req.param('id'), user.id).first<TransferRow>();
  if (!t) throw notFound('Transfer');
  const p = await pendingTransfer(db, t.company_id);
  if (!p || p.id !== t.id) throw new HttpError(409, t.status === 'pending' ? 'This request has expired.' : `This request was ${t.status}.`, { code: 'TRANSFER_CLOSED' });
  const owner = await db.prepare("SELECT user_id FROM co_members WHERE company_id = ? AND role = 'owner'").bind(t.company_id).first<{ user_id: string }>();
  if (owner?.user_id !== t.from_user_id) throw new HttpError(409, 'The company’s owner changed since the request was made.', { code: 'TRANSFER_STALE' });
  const me = await db.prepare('SELECT status FROM co_members WHERE company_id = ? AND user_id = ?').bind(t.company_id, user.id).first<{ status: string }>();
  if (!me || me.status === 'suspended') throw new HttpError(409, 'Only an active member of the company can accept.', { code: 'TARGET_SUSPENDED' });
  const at = now();
  await applyTransfer(db, t.company_id, t.from_user_id, user.id, normRole(t.from_new_role), [
    db.prepare("UPDATE co_ownership_transfers SET status = 'accepted', decided_at = ?, decided_by = ? WHERE company_id = ? AND id = ? AND status = 'pending'").bind(at, user.id, t.company_id, t.id),
    coAuditStmt(db, { companyId: t.company_id, actorId: user.id, action: 'ownership.transferred', targetType: 'user', targetId: user.id, metadata: { from: t.from_user_id, to: user.id, oldOwnerRole: t.from_new_role }, ip: clientIp(c) }),
  ]);
  const co = await db.prepare('SELECT name FROM co_companies WHERE id = ?').bind(t.company_id).first<{ name: string }>();
  await notifyPeople(c, { companyId: t.company_id, company: co?.name ?? '', userIds: [t.from_user_id, user.id, ...(await adminsOf(db, t.company_id))], kind: 'ownership_transferred', title: `${user.name} is now the owner of ${co?.name ?? 'the company'}`, body: `The ownership transfer was accepted. The previous owner is now ${COMPANY_ROLE_LABELS[normRole(t.from_new_role)].toLowerCase()}.`, link: `/company/c/${t.company_id}/members` });
  return c.json({ ok: true, companyId: t.company_id });
});

membersRoutes.post('/transfers/:id/decline', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const t = await db.prepare("SELECT * FROM co_ownership_transfers WHERE id = ? AND to_user_id = ? AND status = 'pending'").bind(c.req.param('id'), user.id).first<TransferRow>();
  if (!t) throw notFound('Transfer');
  await db.batch([
    db.prepare("UPDATE co_ownership_transfers SET status = 'declined', decided_at = ?, decided_by = ? WHERE company_id = ? AND id = ? AND status = 'pending'").bind(now(), user.id, t.company_id, t.id),
    coAuditStmt(db, { companyId: t.company_id, actorId: user.id, action: 'ownership.transfer_declined', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  const co = await db.prepare('SELECT name FROM co_companies WHERE id = ?').bind(t.company_id).first<{ name: string }>();
  await notifyPeople(c, { companyId: t.company_id, company: co?.name ?? '', userIds: [t.from_user_id], kind: 'transfer_declined', title: `${user.name} declined to become the owner of ${co?.name ?? 'the company'}`, link: `/company/c/${t.company_id}/members` });
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ notices

membersRoutes.get('/notices', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB
    .prepare('SELECT n.id, n.company_id, n.kind, n.title, n.body, n.link, n.created_at, n.read_at FROM co_member_notices n WHERE n.user_id = ? ORDER BY n.created_at DESC LIMIT 50')
    .bind(user.id)
    .all<any>();
  return c.json({ notices: rows.results.map((n) => ({ id: n.id, companyId: n.company_id, kind: n.kind, title: n.title, body: n.body, link: n.link, createdAt: n.created_at, read: !!n.read_at })), unread: rows.results.filter((n) => !n.read_at).length });
});

membersRoutes.post('/notices/read', async (c) => {
  const user = c.get('user');
  const input = await body(c, z.object({ ids: z.array(z.string().max(64)).max(100).optional() }));
  const t = now();
  if (input.ids?.length) await c.env.DB.prepare(`UPDATE co_member_notices SET read_at = ? WHERE user_id = ? AND read_at IS NULL AND id IN (${placeholders(input.ids.length)})`).bind(t, user.id, ...input.ids).run();
  else await c.env.DB.prepare('UPDATE co_member_notices SET read_at = ? WHERE user_id = ? AND read_at IS NULL').bind(t, user.id).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ platform recovery (brief Part 2)

platformMembersRoutes.post('/companies/:id/force-transfer', async (c) => {
  await requireReauth(c);
  const db = c.env.DB;
  const me = c.get('user');
  const input = await body(c, z.object({ toUserId: z.string().min(1).max(64), reason: z.string().trim().min(10).max(1000), evidence: z.string().trim().min(3).max(2000), oldOwnerRole: z.enum(ASSIGNABLE_ROLES).default('admin') }));
  const companyId = c.req.param('id');
  const co = await db.prepare('SELECT id, name FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(companyId).first<{ id: string; name: string }>();
  if (!co) throw notFound('Company');
  const owner = await db.prepare("SELECT user_id FROM co_members WHERE company_id = ? AND role = 'owner'").bind(companyId).first<{ user_id: string }>();
  if (!owner) throw new HttpError(409, 'This company has no owner to transfer from.');
  if (owner.user_id === input.toUserId) throw new HttpError(400, 'That person is already the owner.');
  const target = await db.prepare('SELECT m.status, u.disabled_at FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? AND m.user_id = ?').bind(companyId, input.toUserId).first<{ status: string; disabled_at: number | null }>();
  if (!target || target.status === 'suspended' || target.disabled_at) throw new HttpError(400, 'The new owner must be an active member of the company.');
  const t = now();
  const pending = await pendingTransfer(db, companyId);
  const id = newId();
  await applyTransfer(db, companyId, owner.user_id, input.toUserId, input.oldOwnerRole, [
    ...(pending ? [db.prepare("UPDATE co_ownership_transfers SET status = 'cancelled', decided_at = ?, decided_by = ? WHERE company_id = ? AND id = ? AND status = 'pending'").bind(t, me.id, companyId, pending.id)] : []),
    db
      .prepare("INSERT INTO co_ownership_transfers (id, company_id, from_user_id, to_user_id, from_new_role, status, kind, reason, evidence, created_by, created_at, expires_at, decided_at, decided_by) VALUES (?, ?, ?, ?, ?, 'accepted', 'forced', ?, ?, ?, ?, ?, ?, ?)")
      .bind(id, companyId, owner.user_id, input.toUserId, input.oldOwnerRole, input.reason, input.evidence, me.id, t, t, t, me.id),
    coAuditStmt(db, { companyId, actorId: me.id, action: 'ownership.forced_transfer', targetType: 'user', targetId: input.toUserId, metadata: { from: owner.user_id, reason: input.reason }, ip: clientIp(c) }),
    auditStmt(db, { actorId: me.id, action: 'platform.ownership_forced', targetType: 'company', targetId: companyId, metadata: { from: owner.user_id, to: input.toUserId, reason: input.reason }, ip: clientIp(c) }),
  ]);
  await notifyPeople(c, { companyId, company: co.name, userIds: [owner.user_id, input.toUserId, ...(await adminsOf(db, companyId))], kind: 'ownership_forced', title: `BIZOMAT transferred the ownership of ${co.name}`, body: `A BIZOMAT platform administrator made the ownership transfer for a recovery case. Reason: ${input.reason}` });
  return c.json({ ok: true, id });
});

/** Access given by an invitation (members-routes invitations), written when it is accepted (routes.ts). */
export function accessStmtsFromInvite(db: D1Database, companyId: string, userId: string, accessJson: string | null | undefined, actorId: string | null): D1PreparedStatement[] {
  if (!accessJson) return [];
  let parsed: { modules?: Record<string, { access?: boolean; scope?: string }>; sensitive?: boolean } = {};
  try {
    parsed = JSON.parse(accessJson);
  } catch {
    return [];
  }
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const [k, v] of Object.entries(parsed.modules ?? {})) {
    if (!isMemberModule(k) || !v || !(SCOPES as readonly string[]).includes(v.scope ?? '')) continue;
    stmts.push(
      db
        .prepare('INSERT OR REPLACE INTO co_member_access (company_id, user_id, module, access, scope, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(companyId, userId, k, v.access === false ? 0 : 1, v.scope as Scope, actorId, t),
    );
  }
  if (parsed.sensitive) stmts.push(db.prepare("UPDATE co_members SET sensitive = 1 WHERE company_id = ? AND user_id = ? AND role = 'manager'").bind(companyId, userId));
  return stmts;
}

export { MEMBER_MODULE_KEYS };
