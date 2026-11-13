// Super admin (platform admin) API for BIZOMAT Customer Relationship Management and BIZOMAT Finance, mounted at
// /api/admin/crm and /api/admin/fin behind requireAuth + requirePlatformAdmin (app.ts): the same people, the same
// server-side check and the same 404 for everyone else as the Project Management founder console.
//
// What a super admin sees is usage, not content. The CRM: organisation names and settings, members and their roles,
// counts of records, and audit actions (never contact details, deal values, notes or files). Finance: workspace kinds,
// members and roles, counts and integrity checks (never amounts, balances, account names, payees or descriptions); a
// personal or household workspace is shown by its kind, not its name, because personal financial information stays
// private. Support actions (restore a deleted organisation or workspace; hand ownership to another member) are written
// to the product's audit trail and to the platform's.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, notFound, now } from '../lib/util';
import { audit } from '../services/audit';
import { utcDay } from '../services/analytics';
import { auditStmt as crmAuditStmt } from '../crm/util';
import { auditStmt as finAuditStmt } from '../fin/util';

const DAY = 86_400_000;
type Range = '7d' | '30d' | '90d' | 'all';
const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90 } as const;

function parseRange(v: string | undefined): Range {
  return v === '7d' || v === '30d' || v === '90d' || v === 'all' ? v : '30d';
}

/** The first day of the range: for "all", the first organisation or workspace (at most two years of daily points). */
async function rangeStart(db: D1Database, range: Range, table: 'crm_orgs' | 'fin_orgs'): Promise<string> {
  const today = utcDay();
  if (range !== 'all') return utcDay(Date.parse(today) - (RANGE_DAYS[range] - 1) * DAY);
  const first = await db.prepare(`SELECT MIN(created_at) AS t FROM ${table}`).first<{ t: number | null }>();
  const start = first?.t ? utcDay(first.t) : today;
  const cap = utcDay(Date.parse(today) - 729 * DAY);
  return start < cap ? cap : start;
}

function days(from: string, to: string): string[] {
  const out: string[] = [];
  for (let t = Date.parse(from); t <= Date.parse(to); t += DAY) out.push(utcDay(t));
  return out;
}

function fill(ds: string[], rows: { d: string; n: number }[]) {
  const m = new Map(rows.map((r) => [r.d, r.n]));
  return ds.map((d) => ({ date: d, value: m.get(d) ?? 0 }));
}

const dayExpr = (col: string) => `date(${col} / 1000, 'unixepoch')`;

async function first<T>(db: D1Database, sql: string, ...args: unknown[]): Promise<T> {
  return (await db.prepare(sql).bind(...args).first<T>()) as T;
}
async function all<T>(db: D1Database, sql: string, ...args: unknown[]): Promise<T[]> {
  return (await db.prepare(sql).bind(...args).all<T>()).results;
}

function likeEscape(s: string) {
  return `%${s.toLowerCase().replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
}

const n = (v: unknown) => Number(v ?? 0);

function requireFounder(c: any, what: string) {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, `Only the founder can ${what}`);
}

// ================================================================== CRM

export const adminCrmRoutes = new Hono<AppEnv>();

const CRM_ORG_COUNTS = `
  (SELECT COUNT(*) FROM crm_members m WHERE m.org_id = o.id) AS members,
  (SELECT COUNT(*) FROM crm_leads x WHERE x.org_id = o.id AND x.deleted_at IS NULL) AS leads,
  (SELECT COUNT(*) FROM crm_contacts x WHERE x.org_id = o.id AND x.deleted_at IS NULL) AS contacts,
  (SELECT COUNT(*) FROM crm_companies x WHERE x.org_id = o.id AND x.deleted_at IS NULL) AS companies,
  (SELECT COUNT(*) FROM crm_deals x WHERE x.org_id = o.id AND x.deleted_at IS NULL) AS deals,
  (SELECT COUNT(*) FROM crm_activities x WHERE x.org_id = o.id AND x.deleted_at IS NULL) AS activities,
  (SELECT MAX(a.created_at) FROM crm_audit_log a WHERE a.org_id = o.id) AS last_activity,
  (SELECT u.id FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND m.role = 'owner') AS owner_id,
  (SELECT u.name FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND m.role = 'owner') AS owner_name,
  (SELECT u.email FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND m.role = 'owner') AS owner_email`;

function crmOrgRow(o: any) {
  return {
    id: o.id,
    name: o.name,
    industry: o.industry,
    country: o.country,
    currency: o.currency,
    createdAt: o.created_at,
    deletedAt: o.deleted_at,
    owner: o.owner_id ? { id: o.owner_id, name: o.owner_name, email: o.owner_email } : null,
    members: n(o.members),
    leads: n(o.leads),
    contacts: n(o.contacts),
    companies: n(o.companies),
    deals: n(o.deals),
    activities: n(o.activities),
    lastActivityAt: o.last_activity ?? null,
  };
}

adminCrmRoutes.get('/overview', async (c) => {
  const db = c.env.DB;
  const range = parseRange(c.req.query('range'));
  const from = await rangeStart(db, range, 'crm_orgs');
  const fromMs = Date.parse(`${from}T00:00:00Z`);
  const ds = days(from, utcDay());
  const live = 'org_id IN (SELECT id FROM crm_orgs WHERE deleted_at IS NULL)';
  const [orgs, members, records, deals, acts, files, activeOrgs, orgSeries, recordSeries, eventSeries, topOrgs, recentOrgs] = await Promise.all([
    first<any>(db, 'SELECT SUM(deleted_at IS NULL) AS active, SUM(deleted_at IS NOT NULL) AS deleted, SUM(created_at >= ?) AS created FROM crm_orgs', fromMs),
    first<any>(db, `SELECT COUNT(DISTINCT user_id) AS n FROM crm_members WHERE ${live}`),
    first<any>(
      db,
      `SELECT (SELECT COUNT(*) FROM crm_leads WHERE deleted_at IS NULL AND ${live}) AS leads,
              (SELECT COUNT(*) FROM crm_leads WHERE converted_at IS NOT NULL AND ${live}) AS converted,
              (SELECT COUNT(*) FROM crm_contacts WHERE deleted_at IS NULL AND ${live}) AS contacts,
              (SELECT COUNT(*) FROM crm_companies WHERE deleted_at IS NULL AND ${live}) AS companies,
              (SELECT COUNT(*) FROM crm_notes WHERE deleted_at IS NULL AND ${live}) AS notes`,
    ),
    first<any>(db, `SELECT SUM(status = 'open') AS open, SUM(status = 'won') AS won, SUM(status = 'lost') AS lost FROM crm_deals WHERE deleted_at IS NULL AND ${live}`),
    first<any>(db, `SELECT SUM(status = 'open') AS open, SUM(status = 'done') AS done FROM crm_activities WHERE deleted_at IS NULL AND ${live}`),
    first<any>(db, `SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM crm_files WHERE deleted_at IS NULL AND ${live}`),
    first<any>(db, 'SELECT COUNT(DISTINCT org_id) AS n FROM crm_audit_log WHERE created_at >= ?', fromMs),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM crm_orgs WHERE created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(
      db,
      `SELECT d, SUM(n) AS n FROM (
         SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM crm_leads WHERE created_at >= ? GROUP BY d
         UNION ALL SELECT ${dayExpr('created_at')}, COUNT(*) FROM crm_contacts WHERE created_at >= ? GROUP BY 1
         UNION ALL SELECT ${dayExpr('created_at')}, COUNT(*) FROM crm_companies WHERE created_at >= ? GROUP BY 1
         UNION ALL SELECT ${dayExpr('created_at')}, COUNT(*) FROM crm_deals WHERE created_at >= ? GROUP BY 1
       ) GROUP BY d`,
      fromMs,
      fromMs,
      fromMs,
      fromMs,
    ),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM crm_audit_log WHERE created_at >= ? GROUP BY d`, fromMs),
    all<any>(
      db,
      `SELECT o.id, o.name, COUNT(a.id) AS events, (SELECT COUNT(*) FROM crm_members m WHERE m.org_id = o.id) AS members
       FROM crm_audit_log a JOIN crm_orgs o ON o.id = a.org_id WHERE a.created_at >= ? AND o.deleted_at IS NULL GROUP BY o.id ORDER BY events DESC LIMIT 8`,
      fromMs,
    ),
    all<any>(db, `SELECT o.*, ${CRM_ORG_COUNTS} FROM crm_orgs o ORDER BY o.created_at DESC LIMIT 8`),
  ]);
  return c.json({
    range,
    generatedAt: now(),
    orgs: { active: n(orgs?.active), deleted: n(orgs?.deleted), createdInRange: n(orgs?.created), activeInRange: n(activeOrgs?.n) },
    members: n(members?.n),
    records: {
      leads: n(records?.leads),
      convertedLeads: n(records?.converted),
      contacts: n(records?.contacts),
      companies: n(records?.companies),
      notes: n(records?.notes),
      dealsOpen: n(deals?.open),
      dealsWon: n(deals?.won),
      dealsLost: n(deals?.lost),
      activitiesOpen: n(acts?.open),
      activitiesDone: n(acts?.done),
      files: n(files?.n),
      fileBytes: n(files?.bytes),
    },
    series: { orgsCreated: fill(ds, orgSeries), recordsCreated: fill(ds, recordSeries), events: fill(ds, eventSeries) },
    topOrgs: topOrgs.map((o) => ({ id: o.id, name: o.name, events: n(o.events), members: n(o.members) })),
    recentOrgs: recentOrgs.map(crmOrgRow),
  });
});

adminCrmRoutes.get('/orgs', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const status = c.req.query('status') === 'deleted' ? 'deleted' : c.req.query('status') === 'all' ? 'all' : 'active';
  const sort = c.req.query('sort') === 'created' ? 'o.created_at DESC' : c.req.query('sort') === 'members' ? 'members DESC' : c.req.query('sort') === 'records' ? '(leads + contacts + companies + deals) DESC' : 'COALESCE(last_activity, o.created_at) DESC';
  const where = [status === 'active' ? 'o.deleted_at IS NULL' : status === 'deleted' ? 'o.deleted_at IS NOT NULL' : '1 = 1'];
  const args: unknown[] = [];
  if (q) {
    where.push("(lower(o.name) LIKE ? ESCAPE '\\' OR EXISTS (SELECT 1 FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND lower(u.email) LIKE ? ESCAPE '\\'))");
    args.push(likeEscape(q), likeEscape(q));
  }
  const rows = await all<any>(c.env.DB, `SELECT * FROM (SELECT o.*, ${CRM_ORG_COUNTS} FROM crm_orgs o WHERE ${where.join(' AND ')}) o ORDER BY ${sort} LIMIT 500`, ...args);
  return c.json({ orgs: rows.map(crmOrgRow) });
});

async function crmOrg(db: D1Database, id: string) {
  const o = await first<any>(db, `SELECT o.*, ${CRM_ORG_COUNTS} FROM crm_orgs o WHERE o.id = ?`, id);
  if (!o) throw notFound('Organisation');
  return o;
}

adminCrmRoutes.get('/orgs/:id', async (c) => {
  const db = c.env.DB;
  const o = await crmOrg(db, c.req.param('id'));
  const t = now();
  const [members, invitations, leadStatus, deals, acts, autos, runs, files, events] = await Promise.all([
    all<any>(db, 'SELECT m.user_id, m.role, m.joined_at, u.name, u.email, u.last_active_at, u.disabled_at FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? ORDER BY m.role = \'owner\' DESC, u.name COLLATE NOCASE', o.id),
    all<any>(db, 'SELECT email, role, created_at, expires_at, accepted_at, declined_at, revoked_at FROM crm_invitations WHERE org_id = ? ORDER BY created_at DESC LIMIT 50', o.id),
    all<any>(db, 'SELECT status, COUNT(*) AS n FROM crm_leads WHERE org_id = ? AND deleted_at IS NULL GROUP BY status ORDER BY n DESC', o.id),
    first<any>(db, "SELECT SUM(status = 'open') AS open, SUM(status = 'won') AS won, SUM(status = 'lost') AS lost FROM crm_deals WHERE org_id = ? AND deleted_at IS NULL", o.id),
    first<any>(db, "SELECT SUM(status = 'open') AS open, SUM(status = 'done') AS done, SUM(status = 'open' AND due_date < date('now')) AS overdue FROM crm_activities WHERE org_id = ? AND deleted_at IS NULL", o.id),
    first<any>(db, 'SELECT COUNT(*) AS n, SUM(enabled) AS enabled FROM crm_automations WHERE org_id = ?', o.id),
    first<any>(db, "SELECT COUNT(*) AS n, SUM(status = 'failed') AS failed FROM crm_automation_runs WHERE org_id = ? AND created_at >= ?", o.id, t - 30 * DAY),
    first<any>(db, 'SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM crm_files WHERE org_id = ? AND deleted_at IS NULL', o.id),
    all<any>(db, 'SELECT a.id, a.action, a.target_type, a.created_at, u.email AS actor_email FROM crm_audit_log a LEFT JOIN users u ON u.id = a.actor_id WHERE a.org_id = ? ORDER BY a.created_at DESC LIMIT 30', o.id),
  ]);
  return c.json({
    org: { ...crmOrgRow(o), website: o.website, timezone: o.timezone },
    members: members.map((m) => ({ userId: m.user_id, name: m.name, email: m.email, role: m.role, joinedAt: m.joined_at, lastActiveAt: m.last_active_at, disabled: !!m.disabled_at })),
    invitations: invitations.map((i) => ({ email: i.email, role: i.role, createdAt: i.created_at, status: i.accepted_at ? 'accepted' : i.declined_at ? 'declined' : i.revoked_at ? 'withdrawn' : i.expires_at < t ? 'expired' : 'pending' })),
    leadsByStatus: leadStatus.map((l) => ({ status: l.status, count: n(l.n) })),
    deals: { open: n(deals?.open), won: n(deals?.won), lost: n(deals?.lost) },
    activities: { open: n(acts?.open), done: n(acts?.done), overdue: n(acts?.overdue) },
    automations: { total: n(autos?.n), enabled: n(autos?.enabled), runs30d: n(runs?.n), failed30d: n(runs?.failed) },
    files: { count: n(files?.n), bytes: n(files?.bytes) },
    events: events.map((e) => ({ id: e.id, action: e.action, targetType: e.target_type, at: e.created_at, actorEmail: e.actor_email })),
  });
});

adminCrmRoutes.post('/orgs/:id/restore', async (c) => {
  const o = await crmOrg(c.env.DB, c.req.param('id'));
  if (!o.deleted_at) throw badRequest('This organisation is not deleted');
  const me = c.get('user');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_orgs SET deleted_at = NULL, updated_at = ? WHERE id = ?').bind(now(), o.id),
    crmAuditStmt(c.env.DB, { orgId: o.id, actorId: me.id, action: 'org.restored_by_platform_admin', targetType: 'org', targetId: o.id, ip: clientIp(c) }),
  ]);
  await audit(c.env.DB, { actorId: me.id, action: 'admin.crm_org_restored', targetType: 'crm_org', targetId: o.id, ip: clientIp(c) });
  return c.json({ ok: true });
});

adminCrmRoutes.post('/orgs/:id/transfer', async (c) => {
  requireFounder(c, 'hand over ownership');
  const db = c.env.DB;
  const o = await crmOrg(db, c.req.param('id'));
  const { userId } = await body(c, z.object({ userId: z.string().max(64) }));
  const target = await first<{ role: string } | null>(db, 'SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?', o.id, userId);
  if (!target) throw badRequest('Choose a member of this organisation');
  if (target.role === 'owner') throw badRequest('That member is already the owner');
  const me = c.get('user');
  await db.batch([
    // Demote first: one owner at a time (crm_members_one_owner).
    db.prepare("UPDATE crm_members SET role = 'admin' WHERE org_id = ? AND role = 'owner'").bind(o.id),
    db.prepare("UPDATE crm_members SET role = 'owner' WHERE org_id = ? AND user_id = ?").bind(o.id, userId),
    crmAuditStmt(db, { orgId: o.id, actorId: me.id, action: 'org.ownership_transferred_by_platform_admin', targetType: 'user', targetId: userId, before: { owner: o.owner_id, newOwnerRole: target.role }, after: { owner: userId }, ip: clientIp(c) }),
  ]);
  await audit(db, { actorId: me.id, action: 'admin.crm_ownership_transferred', targetType: 'crm_org', targetId: o.id, metadata: { from: o.owner_id, to: userId }, ip: clientIp(c) });
  return c.json({ ok: true });
});

adminCrmRoutes.get('/users', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const rows = await all<any>(
    c.env.DB,
    `SELECT u.id, u.name, u.email, u.created_at, u.last_active_at, u.disabled_at, COUNT(m.org_id) AS orgs, SUM(m.role = 'owner') AS owned, MIN(m.joined_at) AS first_joined,
       (SELECT COUNT(*) FROM crm_audit_log a WHERE a.actor_id = u.id AND a.created_at >= ?) AS events30d
     FROM users u JOIN crm_members m ON m.user_id = u.id JOIN crm_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL
     ${q ? "WHERE (lower(u.email) LIKE ? ESCAPE '\\' OR lower(u.name) LIKE ? ESCAPE '\\')" : ''}
     GROUP BY u.id ORDER BY COALESCE(u.last_active_at, u.created_at) DESC LIMIT 500`,
    now() - 30 * DAY,
    ...(q ? [likeEscape(q), likeEscape(q)] : []),
  );
  return c.json({ users: rows.map((u) => ({ id: u.id, name: u.name, email: u.email, registeredAt: u.created_at, lastActiveAt: u.last_active_at, disabled: !!u.disabled_at, orgs: n(u.orgs), owned: n(u.owned), firstJoinedAt: u.first_joined, events30d: n(u.events30d) })) });
});

const activityQuery = z.object({ org: z.string().max(64).optional(), action: z.string().max(60).optional(), before: z.coerce.number().int().positive().optional(), limit: z.coerce.number().int().min(1).max(200).default(100) });

adminCrmRoutes.get('/activity', async (c) => {
  const p = activityQuery.safeParse(c.req.query());
  if (!p.success) throw badRequest('Invalid filters');
  const where = ['1 = 1'];
  const args: unknown[] = [];
  if (p.data.org) {
    where.push('a.org_id = ?');
    args.push(p.data.org);
  }
  if (p.data.action) {
    where.push("a.action LIKE ? ESCAPE '\\'");
    args.push(`${p.data.action.replace(/[\\%_]/g, (m) => `\\${m}`)}%`);
  }
  if (p.data.before) {
    where.push('a.created_at < ?');
    args.push(p.data.before);
  }
  const rows = await all<any>(
    c.env.DB,
    `SELECT a.id, a.action, a.target_type, a.created_at, a.org_id, o.name AS org_name, u.id AS actor_id, u.email AS actor_email
     FROM crm_audit_log a LEFT JOIN crm_orgs o ON o.id = a.org_id LEFT JOIN users u ON u.id = a.actor_id WHERE ${where.join(' AND ')} ORDER BY a.created_at DESC LIMIT ?`,
    ...args,
    p.data.limit,
  );
  return c.json({
    events: rows.map((e) => ({ id: e.id, action: e.action, targetType: e.target_type, at: e.created_at, orgId: e.org_id, orgName: e.org_name, actorId: e.actor_id, actorEmail: e.actor_email })),
    nextBefore: rows.length === p.data.limit ? rows[rows.length - 1].created_at : null,
  });
});

adminCrmRoutes.get('/health', async (c) => {
  const db = c.env.DB;
  const t = now();
  const [autos, runs, failedRuns, invites, unread, ownerless, overdue] = await Promise.all([
    first<any>(db, 'SELECT COUNT(*) AS n, SUM(enabled) AS enabled FROM crm_automations a JOIN crm_orgs o ON o.id = a.org_id AND o.deleted_at IS NULL'),
    first<any>(db, "SELECT COUNT(*) AS n, SUM(status = 'failed') AS failed FROM crm_automation_runs WHERE created_at >= ?", t - 7 * DAY),
    all<any>(db, "SELECT r.id, r.trigger_type, r.detail, r.created_at, o.name AS org_name, o.id AS org_id, a.name AS automation FROM crm_automation_runs r JOIN crm_orgs o ON o.id = r.org_id LEFT JOIN crm_automations a ON a.id = r.automation_id WHERE r.status = 'failed' ORDER BY r.created_at DESC LIMIT 20"),
    first<any>(db, 'SELECT SUM(accepted_at IS NULL AND declined_at IS NULL AND revoked_at IS NULL AND expires_at > ?) AS pending, SUM(accepted_at IS NULL AND declined_at IS NULL AND revoked_at IS NULL AND expires_at <= ?) AS expired FROM crm_invitations', t, t),
    first<any>(db, 'SELECT COUNT(*) AS n FROM crm_notifications WHERE read_at IS NULL'),
    first<any>(db, "SELECT COUNT(*) AS n FROM crm_orgs o WHERE o.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM crm_members m WHERE m.org_id = o.id AND m.role = 'owner')"),
    first<any>(db, "SELECT COUNT(*) AS n FROM crm_activities a JOIN crm_orgs o ON o.id = a.org_id AND o.deleted_at IS NULL WHERE a.deleted_at IS NULL AND a.status = 'open' AND a.due_date < date('now')"),
  ]);
  return c.json({
    generatedAt: t,
    checks: [
      { key: 'ownerless', label: 'Organisations without an owner', value: n(ownerless?.n), ok: n(ownerless?.n) === 0, hint: 'Every organisation has exactly one owner; the database allows no more than one.' },
      { key: 'failed_runs', label: 'Automation runs that failed (7 days)', value: n(runs?.failed), ok: n(runs?.failed) === 0, hint: `${n(runs?.n)} runs in the last 7 days.` },
    ],
    automations: { total: n(autos?.n), enabled: n(autos?.enabled) },
    invitations: { pending: n(invites?.pending), expired: n(invites?.expired) },
    unreadNotifications: n(unread?.n),
    overdueActivities: n(overdue?.n),
    failedRuns: failedRuns.map((r) => ({ id: r.id, orgId: r.org_id, orgName: r.org_name, automation: r.automation, trigger: r.trigger_type, detail: String(r.detail ?? '').slice(0, 300), at: r.created_at })),
  });
});

// ================================================================== Finance

export const adminFinRoutes = new Hono<AppEnv>();

const KIND_LABEL: Record<string, string> = { personal: 'Personal workspace', household: 'Household workspace', business: 'Business workspace' };

/** A business is shown by its name; personal and household workspaces by their kind only (private finances). */
const finLabel = (o: { kind: string; name: string }) => (o.kind === 'business' ? o.name : KIND_LABEL[o.kind] ?? 'Workspace');

const FIN_ORG_COUNTS = `
  (SELECT COUNT(*) FROM fin_members m WHERE m.org_id = o.id) AS members,
  (SELECT COUNT(*) FROM fin_accounts x WHERE x.org_id = o.id AND x.archived_at IS NULL) AS accounts,
  (SELECT COUNT(*) FROM fin_transactions x WHERE x.org_id = o.id AND x.deleted_at IS NULL) AS transactions,
  (SELECT COUNT(*) FROM fin_docs x WHERE x.org_id = o.id AND x.deleted_at IS NULL) AS docs,
  (SELECT COUNT(*) FROM fin_journals x WHERE x.org_id = o.id AND x.status = 'posted') AS journals,
  (SELECT MAX(a.created_at) FROM fin_audit_log a WHERE a.org_id = o.id) AS last_activity,
  (SELECT u.id FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND m.role = 'owner') AS owner_id,
  (SELECT u.name FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND m.role = 'owner') AS owner_name,
  (SELECT u.email FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND m.role = 'owner') AS owner_email`;

function finOrgRow(o: any) {
  return {
    id: o.id,
    label: finLabel(o),
    kind: o.kind,
    currency: o.currency,
    gstRegistered: o.kind === 'business' && !!o.gst_registered,
    createdAt: o.created_at,
    deletedAt: o.deleted_at,
    lockDate: o.lock_date,
    owner: o.owner_id ? { id: o.owner_id, name: o.owner_name, email: o.owner_email } : null,
    members: n(o.members),
    accounts: n(o.accounts),
    transactions: n(o.transactions),
    docs: n(o.docs),
    journals: n(o.journals),
    lastActivityAt: o.last_activity ?? null,
  };
}

adminFinRoutes.get('/overview', async (c) => {
  const db = c.env.DB;
  const range = parseRange(c.req.query('range'));
  const from = await rangeStart(db, range, 'fin_orgs');
  const fromMs = Date.parse(`${from}T00:00:00Z`);
  const ds = days(from, utcDay());
  const live = 'org_id IN (SELECT id FROM fin_orgs WHERE deleted_at IS NULL)';
  const [orgs, kinds, members, tx, docs, journals, statements, plans, files, activeOrgs, orgSeries, recordSeries, eventSeries, topOrgs, recentOrgs] = await Promise.all([
    first<any>(db, "SELECT SUM(deleted_at IS NULL) AS active, SUM(deleted_at IS NOT NULL) AS deleted, SUM(created_at >= ?) AS created, SUM(deleted_at IS NULL AND kind = 'business' AND gst_registered = 1) AS gst FROM fin_orgs", fromMs),
    all<any>(db, 'SELECT kind, COUNT(*) AS n FROM fin_orgs WHERE deleted_at IS NULL GROUP BY kind'),
    first<any>(db, `SELECT COUNT(DISTINCT user_id) AS n FROM fin_members WHERE ${live}`),
    first<any>(db, `SELECT SUM(status = 'posted') AS posted, SUM(status = 'draft') AS draft, SUM(status = 'submitted') AS submitted, SUM(status = 'void') AS void FROM fin_transactions WHERE deleted_at IS NULL AND ${live}`),
    all<any>(db, `SELECT kind, COUNT(*) AS n FROM fin_docs WHERE deleted_at IS NULL AND ${live} GROUP BY kind`),
    first<any>(db, `SELECT COUNT(*) AS n FROM fin_journals WHERE status = 'posted' AND ${live}`),
    first<any>(db, `SELECT COUNT(*) AS n, SUM(status = 'matched') AS matched, SUM(status = 'unmatched') AS unmatched FROM fin_statement_lines WHERE ${live}`),
    first<any>(db, `SELECT (SELECT COUNT(*) FROM fin_budgets WHERE archived_at IS NULL AND ${live}) AS budgets, (SELECT COUNT(*) FROM fin_goals WHERE archived_at IS NULL AND ${live}) AS goals, (SELECT COUNT(*) FROM fin_recurring WHERE active = 1 AND ${live}) AS recurring`),
    first<any>(db, `SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM fin_files WHERE deleted_at IS NULL AND ${live}`),
    first<any>(db, 'SELECT COUNT(DISTINCT org_id) AS n FROM fin_audit_log WHERE created_at >= ?', fromMs),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM fin_orgs WHERE created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(
      db,
      `SELECT d, SUM(n) AS n FROM (
         SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM fin_transactions WHERE created_at >= ? GROUP BY d
         UNION ALL SELECT ${dayExpr('created_at')}, COUNT(*) FROM fin_docs WHERE created_at >= ? GROUP BY 1
       ) GROUP BY d`,
      fromMs,
      fromMs,
    ),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM fin_audit_log WHERE created_at >= ? GROUP BY d`, fromMs),
    all<any>(
      db,
      `SELECT o.id, o.name, o.kind, COUNT(a.id) AS events, (SELECT COUNT(*) FROM fin_members m WHERE m.org_id = o.id) AS members
       FROM fin_audit_log a JOIN fin_orgs o ON o.id = a.org_id WHERE a.created_at >= ? AND o.deleted_at IS NULL GROUP BY o.id ORDER BY events DESC LIMIT 8`,
      fromMs,
    ),
    all<any>(db, `SELECT o.*, ${FIN_ORG_COUNTS} FROM fin_orgs o ORDER BY o.created_at DESC LIMIT 8`),
  ]);
  const byKind = Object.fromEntries(kinds.map((k) => [k.kind, n(k.n)]));
  const docKinds = Object.fromEntries(docs.map((d) => [d.kind, n(d.n)]));
  return c.json({
    range,
    generatedAt: now(),
    workspaces: { active: n(orgs?.active), deleted: n(orgs?.deleted), createdInRange: n(orgs?.created), activeInRange: n(activeOrgs?.n), personal: byKind.personal ?? 0, household: byKind.household ?? 0, business: byKind.business ?? 0, gstRegistered: n(orgs?.gst) },
    members: n(members?.n),
    records: {
      transactionsPosted: n(tx?.posted),
      transactionsDraft: n(tx?.draft),
      transactionsAwaiting: n(tx?.submitted),
      transactionsVoid: n(tx?.void),
      invoices: docKinds.invoice ?? 0,
      bills: docKinds.bill ?? 0,
      purchaseOrders: docKinds.purchase_order ?? 0,
      expenseClaims: docKinds.expense_claim ?? 0,
      journalsPosted: n(journals?.n),
      statementLines: n(statements?.n),
      statementLinesMatched: n(statements?.matched),
      statementLinesToMatch: n(statements?.unmatched),
      budgets: n(plans?.budgets),
      goals: n(plans?.goals),
      recurringActive: n(plans?.recurring),
      files: n(files?.n),
      fileBytes: n(files?.bytes),
    },
    series: { workspacesCreated: fill(ds, orgSeries), recordsCreated: fill(ds, recordSeries), events: fill(ds, eventSeries) },
    topWorkspaces: topOrgs.map((o) => ({ id: o.id, label: finLabel(o), kind: o.kind, events: n(o.events), members: n(o.members) })),
    recentWorkspaces: recentOrgs.map(finOrgRow),
  });
});

adminFinRoutes.get('/workspaces', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const status = c.req.query('status') === 'deleted' ? 'deleted' : c.req.query('status') === 'all' ? 'all' : 'active';
  const kind = ['personal', 'household', 'business'].includes(c.req.query('kind') ?? '') ? c.req.query('kind') : null;
  const sort = c.req.query('sort') === 'created' ? 'o.created_at DESC' : c.req.query('sort') === 'members' ? 'members DESC' : c.req.query('sort') === 'records' ? '(transactions + docs) DESC' : 'COALESCE(last_activity, o.created_at) DESC';
  const where = [status === 'active' ? 'o.deleted_at IS NULL' : status === 'deleted' ? 'o.deleted_at IS NOT NULL' : '1 = 1'];
  const args: unknown[] = [];
  if (kind) {
    where.push('o.kind = ?');
    args.push(kind);
  }
  if (q) {
    // Personal and household names are not searchable (they are not shown either); members' emails are.
    where.push("((o.kind = 'business' AND lower(o.name) LIKE ? ESCAPE '\\') OR EXISTS (SELECT 1 FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = o.id AND lower(u.email) LIKE ? ESCAPE '\\'))");
    args.push(likeEscape(q), likeEscape(q));
  }
  const rows = await all<any>(c.env.DB, `SELECT * FROM (SELECT o.*, ${FIN_ORG_COUNTS} FROM fin_orgs o WHERE ${where.join(' AND ')}) o ORDER BY ${sort} LIMIT 500`, ...args);
  return c.json({ workspaces: rows.map(finOrgRow) });
});

async function finOrg(db: D1Database, id: string) {
  const o = await first<any>(db, `SELECT o.*, ${FIN_ORG_COUNTS} FROM fin_orgs o WHERE o.id = ?`, id);
  if (!o) throw notFound('Workspace');
  return o;
}

/** Whether a workspace's posted journals balance: one flag and a count, never an amount. */
async function ledgerCheck(db: D1Database, orgId?: string) {
  const scope = orgId ? 'AND j.org_id = ?' : '';
  const args = orgId ? [orgId] : [];
  const [unbalancedJournals, unbalancedOrgs, staleDrafts] = await Promise.all([
    first<any>(db, `SELECT COUNT(*) AS n FROM (SELECT j.id FROM fin_journals j LEFT JOIN fin_journal_lines l ON l.journal_id = j.id WHERE j.status = 'posted' ${scope} GROUP BY j.id HAVING COUNT(l.id) < 2 OR COALESCE(SUM(l.debit), 0) <> COALESCE(SUM(l.credit), 0))`, ...args),
    first<any>(db, `SELECT COUNT(*) AS n FROM (SELECT j.org_id FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id WHERE j.status = 'posted' ${scope} GROUP BY j.org_id HAVING SUM(l.debit) <> SUM(l.credit))`, ...args),
    first<any>(db, `SELECT COUNT(*) AS n FROM fin_journals j WHERE j.status = 'draft' AND j.created_at < ? ${scope}`, now() - 3_600_000, ...args),
  ]);
  return { unbalancedJournals: n(unbalancedJournals?.n), unbalancedWorkspaces: n(unbalancedOrgs?.n), staleDrafts: n(staleDrafts?.n) };
}

adminFinRoutes.get('/workspaces/:id', async (c) => {
  const db = c.env.DB;
  const o = await finOrg(db, c.req.param('id'));
  const t = now();
  const [members, invitations, tx, docs, statements, recurring, files, ledger, events] = await Promise.all([
    all<any>(db, "SELECT m.user_id, m.role, m.joined_at, u.name, u.email, u.last_active_at, u.disabled_at FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? ORDER BY m.role = 'owner' DESC, u.name COLLATE NOCASE", o.id),
    all<any>(db, 'SELECT email, role, created_at, expires_at, accepted_at, declined_at, revoked_at FROM fin_invitations WHERE org_id = ? ORDER BY created_at DESC LIMIT 50', o.id),
    first<any>(db, "SELECT SUM(status = 'posted') AS posted, SUM(status = 'draft') AS draft, SUM(status = 'submitted') AS submitted, SUM(status = 'void') AS void FROM fin_transactions WHERE org_id = ? AND deleted_at IS NULL", o.id),
    all<any>(db, 'SELECT kind, status, COUNT(*) AS n FROM fin_docs WHERE org_id = ? AND deleted_at IS NULL GROUP BY kind, status', o.id),
    first<any>(db, "SELECT COUNT(*) AS n, SUM(status = 'unmatched') AS unmatched FROM fin_statement_lines WHERE org_id = ?", o.id),
    first<any>(db, "SELECT SUM(active = 1) AS active, SUM(active = 0 AND last_error <> '') AS paused_with_error FROM fin_recurring WHERE org_id = ?", o.id),
    first<any>(db, 'SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM fin_files WHERE org_id = ? AND deleted_at IS NULL', o.id),
    ledgerCheck(db, o.id),
    all<any>(db, 'SELECT a.id, a.action, a.target_type, a.created_at, u.email AS actor_email FROM fin_audit_log a LEFT JOIN users u ON u.id = a.actor_id WHERE a.org_id = ? ORDER BY a.created_at DESC LIMIT 30', o.id),
  ]);
  return c.json({
    workspace: { ...finOrgRow(o), timezone: o.timezone, fyStartMonth: o.fy_start_month, gstBasis: o.kind === 'business' ? o.gst_basis : null },
    members: members.map((m) => ({ userId: m.user_id, name: m.name, email: m.email, role: m.role, joinedAt: m.joined_at, lastActiveAt: m.last_active_at, disabled: !!m.disabled_at })),
    invitations: invitations.map((i) => ({ email: i.email, role: i.role, createdAt: i.created_at, status: i.accepted_at ? 'accepted' : i.declined_at ? 'declined' : i.revoked_at ? 'withdrawn' : i.expires_at < t ? 'expired' : 'pending' })),
    transactions: { posted: n(tx?.posted), draft: n(tx?.draft), awaiting: n(tx?.submitted), void: n(tx?.void) },
    docs: docs.map((d) => ({ kind: d.kind, status: d.status, count: n(d.n) })),
    statementLines: { total: n(statements?.n), toMatch: n(statements?.unmatched) },
    recurring: { active: n(recurring?.active), pausedWithError: n(recurring?.paused_with_error) },
    files: { count: n(files?.n), bytes: n(files?.bytes) },
    ledger: { ...ledger, balanced: ledger.unbalancedJournals === 0 && ledger.unbalancedWorkspaces === 0 },
    events: events.map((e) => ({ id: e.id, action: e.action, targetType: e.target_type, at: e.created_at, actorEmail: e.actor_email })),
  });
});

adminFinRoutes.post('/workspaces/:id/restore', async (c) => {
  const o = await finOrg(c.env.DB, c.req.param('id'));
  if (!o.deleted_at) throw badRequest('This workspace is not deleted');
  const me = c.get('user');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_orgs SET deleted_at = NULL, updated_at = ? WHERE id = ?').bind(now(), o.id),
    finAuditStmt(c.env.DB, { orgId: o.id, actorId: me.id, action: 'org.restored_by_platform_admin', targetType: 'org', targetId: o.id, ip: clientIp(c) }),
  ]);
  await audit(c.env.DB, { actorId: me.id, action: 'admin.fin_workspace_restored', targetType: 'fin_org', targetId: o.id, ip: clientIp(c) });
  return c.json({ ok: true });
});

adminFinRoutes.post('/workspaces/:id/transfer', async (c) => {
  requireFounder(c, 'hand over ownership');
  const db = c.env.DB;
  const o = await finOrg(db, c.req.param('id'));
  const { userId } = await body(c, z.object({ userId: z.string().max(64) }));
  const target = await first<{ role: string } | null>(db, 'SELECT role FROM fin_members WHERE org_id = ? AND user_id = ?', o.id, userId);
  if (!target) throw badRequest('Choose a member of this workspace');
  if (target.role === 'owner') throw badRequest('That member is already the owner');
  const me = c.get('user');
  await db.batch([
    // Demote first: one owner at a time.
    db.prepare("UPDATE fin_members SET role = 'admin' WHERE org_id = ? AND role = 'owner'").bind(o.id),
    db.prepare("UPDATE fin_members SET role = 'owner' WHERE org_id = ? AND user_id = ?").bind(o.id, userId),
    finAuditStmt(db, { orgId: o.id, actorId: me.id, action: 'org.ownership_transferred_by_platform_admin', targetType: 'user', targetId: userId, before: { owner: o.owner_id, newOwnerRole: target.role }, after: { owner: userId }, ip: clientIp(c) }),
  ]);
  await audit(db, { actorId: me.id, action: 'admin.fin_ownership_transferred', targetType: 'fin_org', targetId: o.id, metadata: { from: o.owner_id, to: userId }, ip: clientIp(c) });
  return c.json({ ok: true });
});

adminFinRoutes.get('/users', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const rows = await all<any>(
    c.env.DB,
    `SELECT u.id, u.name, u.email, u.created_at, u.last_active_at, u.disabled_at, COUNT(m.org_id) AS orgs, SUM(m.role = 'owner') AS owned,
       SUM(o.kind = 'personal') AS personal, SUM(o.kind = 'household') AS household, SUM(o.kind = 'business') AS business, MIN(m.joined_at) AS first_joined,
       (SELECT COUNT(*) FROM fin_audit_log a WHERE a.actor_id = u.id AND a.created_at >= ?) AS events30d
     FROM users u JOIN fin_members m ON m.user_id = u.id JOIN fin_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL
     ${q ? "WHERE (lower(u.email) LIKE ? ESCAPE '\\' OR lower(u.name) LIKE ? ESCAPE '\\')" : ''}
     GROUP BY u.id ORDER BY COALESCE(u.last_active_at, u.created_at) DESC LIMIT 500`,
    now() - 30 * DAY,
    ...(q ? [likeEscape(q), likeEscape(q)] : []),
  );
  return c.json({
    users: rows.map((u) => ({ id: u.id, name: u.name, email: u.email, registeredAt: u.created_at, lastActiveAt: u.last_active_at, disabled: !!u.disabled_at, workspaces: n(u.orgs), owned: n(u.owned), personal: n(u.personal), household: n(u.household), business: n(u.business), firstJoinedAt: u.first_joined, events30d: n(u.events30d) })),
  });
});

adminFinRoutes.get('/activity', async (c) => {
  const p = activityQuery.safeParse(c.req.query());
  if (!p.success) throw badRequest('Invalid filters');
  const where = ['1 = 1'];
  const args: unknown[] = [];
  if (p.data.org) {
    where.push('a.org_id = ?');
    args.push(p.data.org);
  }
  if (p.data.action) {
    where.push("a.action LIKE ? ESCAPE '\\'");
    args.push(`${p.data.action.replace(/[\\%_]/g, (m) => `\\${m}`)}%`);
  }
  if (p.data.before) {
    where.push('a.created_at < ?');
    args.push(p.data.before);
  }
  const rows = await all<any>(
    c.env.DB,
    `SELECT a.id, a.action, a.target_type, a.created_at, a.org_id, o.name AS org_name, o.kind AS org_kind, u.id AS actor_id, u.email AS actor_email
     FROM fin_audit_log a LEFT JOIN fin_orgs o ON o.id = a.org_id LEFT JOIN users u ON u.id = a.actor_id WHERE ${where.join(' AND ')} ORDER BY a.created_at DESC LIMIT ?`,
    ...args,
    p.data.limit,
  );
  return c.json({
    events: rows.map((e) => ({ id: e.id, action: e.action, targetType: e.target_type, at: e.created_at, workspaceId: e.org_id, workspaceLabel: e.org_kind ? finLabel({ kind: e.org_kind, name: e.org_name }) : null, kind: e.org_kind, actorId: e.actor_id, actorEmail: e.actor_email })),
    nextBefore: rows.length === p.data.limit ? rows[rows.length - 1].created_at : null,
  });
});

adminFinRoutes.get('/health', async (c) => {
  const db = c.env.DB;
  const t = now();
  const [ledger, recurring, paused, schedules, toMatch, unread, ownerless, invites] = await Promise.all([
    ledgerCheck(db),
    first<any>(db, 'SELECT SUM(active = 1) AS active, SUM(active = 1 AND next_date < ?) AS behind FROM fin_recurring r JOIN fin_orgs o ON o.id = r.org_id AND o.deleted_at IS NULL', utcDay(t - DAY)),
    all<any>(db, "SELECT r.id, r.kind, r.last_error, r.next_date, r.updated_at, o.id AS org_id, o.name, o.kind AS org_kind FROM fin_recurring r JOIN fin_orgs o ON o.id = r.org_id AND o.deleted_at IS NULL WHERE r.active = 0 AND r.last_error <> '' ORDER BY r.updated_at DESC LIMIT 20"),
    first<any>(db, 'SELECT SUM(active = 1) AS active, SUM(active = 0) AS stopped FROM fin_report_schedules s JOIN fin_orgs o ON o.id = s.org_id AND o.deleted_at IS NULL'),
    first<any>(db, "SELECT COUNT(*) AS n FROM fin_statement_lines l JOIN fin_orgs o ON o.id = l.org_id AND o.deleted_at IS NULL WHERE l.status = 'unmatched'"),
    first<any>(db, 'SELECT COUNT(*) AS n FROM fin_notifications WHERE read_at IS NULL'),
    first<any>(db, "SELECT COUNT(*) AS n FROM fin_orgs o WHERE o.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM fin_members m WHERE m.org_id = o.id AND m.role = 'owner')"),
    first<any>(db, 'SELECT SUM(accepted_at IS NULL AND declined_at IS NULL AND revoked_at IS NULL AND expires_at > ?) AS pending, SUM(accepted_at IS NULL AND declined_at IS NULL AND revoked_at IS NULL AND expires_at <= ?) AS expired FROM fin_invitations', t, t),
  ]);
  return c.json({
    generatedAt: t,
    checks: [
      { key: 'unbalanced_journals', label: 'Posted journals that do not balance', value: ledger.unbalancedJournals, ok: ledger.unbalancedJournals === 0, hint: 'Every posted journal has two or more lines and equal debits and credits; database triggers refuse anything else.' },
      { key: 'unbalanced_workspaces', label: 'Workspaces whose ledger does not balance', value: ledger.unbalancedWorkspaces, ok: ledger.unbalancedWorkspaces === 0, hint: 'Total debits equal total credits in every workspace.' },
      { key: 'stale_drafts', label: 'Journals left as drafts for over an hour', value: ledger.staleDrafts, ok: ledger.staleDrafts === 0, hint: 'A journal is drafted and posted in one step; a lasting draft means a step failed half way.' },
      { key: 'ownerless', label: 'Workspaces without an owner', value: n(ownerless?.n), ok: n(ownerless?.n) === 0, hint: 'Every workspace has exactly one owner.' },
      { key: 'recurring_behind', label: 'Recurring records more than a day behind', value: n(recurring?.behind), ok: n(recurring?.behind) === 0, hint: 'The 15-minute maintenance run creates recurring records on their date.' },
    ],
    recurring: { active: n(recurring?.active), pausedWithError: paused.length },
    reportSchedules: { active: n(schedules?.active), stopped: n(schedules?.stopped) },
    statementLinesToMatch: n(toMatch?.n),
    unreadNotifications: n(unread?.n),
    invitations: { pending: n(invites?.pending), expired: n(invites?.expired) },
    pausedRecurring: paused.map((r) => ({ id: r.id, workspaceId: r.org_id, workspaceLabel: finLabel({ kind: r.org_kind, name: r.name }), kind: r.kind, error: String(r.last_error ?? '').slice(0, 300), nextDate: r.next_date, at: r.updated_at })),
  });
});
