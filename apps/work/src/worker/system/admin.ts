// The super admin's System console (/api/admin/system/*, behind requirePlatformAdmin: 404 for everyone else): every
// account and every company in one place, with activity across all the tools, and the actions to manage them. The
// founder alone may disable or enable an account, suspend or resume a registered company and make the missing own
// companies. Usage, not content: activity shows who did what kind of thing where and when, never record contents.
import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, clientIp, notFound, now } from '../lib/util';
import { auditStmt } from '../services/audit';
import { coAuditStmt } from '../company/access';
import { backfillOwnCompanies } from './system';

export const adminSystemRoutes = new Hono<AppEnv>();

const founderOnly = (c: any) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can do this.');
};
const DAY = 86_400_000;
const like = (q: string) => `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;

adminSystemRoutes.get('/overview', async (c) => {
  const db = c.env.DB;
  const t = now();
  const [users, companies, tools, cad] = await db.batch([
    db
      .prepare(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN disabled_at IS NULL AND last_active_at >= ? THEN 1 ELSE 0 END) AS active7,
                SUM(CASE WHEN disabled_at IS NULL AND last_active_at >= ? THEN 1 ELSE 0 END) AS active30,
                SUM(CASE WHEN disabled_at IS NOT NULL THEN 1 ELSE 0 END) AS disabled,
                SUM(CASE WHEN email_verified_at IS NULL THEN 1 ELSE 0 END) AS unconfirmed
           FROM users`,
      )
      .bind(t - 7 * DAY, t - 30 * DAY),
    db.prepare(
      `SELECT (SELECT COUNT(*) FROM co_companies WHERE deleted_at IS NULL) AS registered,
              (SELECT COUNT(*) FROM co_companies WHERE deleted_at IS NULL AND suspended_at IS NOT NULL) AS suspended,
              (SELECT COUNT(*) FROM sys_companies) AS own`,
    ),
    db.prepare(
      `SELECT (SELECT COUNT(*) FROM workspaces WHERE deleted_at IS NULL) AS workspaces,
              (SELECT COUNT(*) FROM crm_orgs WHERE deleted_at IS NULL) AS crm,
              (SELECT COUNT(*) FROM fin_orgs WHERE deleted_at IS NULL) AS finance`,
    ),
    db.prepare('SELECT COUNT(*) AS accounts, MAX(reported_at) AS last FROM sys_cad_status'),
  ]);
  return c.json({ users: users.results[0], companies: companies.results[0], tools: tools.results[0], cad: cad.results[0] });
});

adminSystemRoutes.get('/users', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const offset = Math.max(0, Math.min(100_000, Number(c.req.query('offset')) || 0));
  const where = q ? 'WHERE u.name LIKE ? ESCAPE \'\\\' OR u.email LIKE ? ESCAPE \'\\\'' : '';
  const args = q ? [like(q), like(q)] : [];
  const rows = await c.env.DB.prepare(
    `SELECT u.id, u.name, u.email, u.created_at, u.last_login_at, u.last_active_at, u.disabled_at, u.email_verified_at,
            pa.role AS platform_role, s.id AS own_id, s.name AS own_name,
            (SELECT COUNT(*) FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id AND w.deleted_at IS NULL WHERE m.user_id = u.id) AS tasks,
            (SELECT COUNT(*) FROM crm_members m JOIN crm_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL WHERE m.user_id = u.id) AS crm,
            (SELECT COUNT(*) FROM fin_members m JOIN fin_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL WHERE m.user_id = u.id) AS finance,
            (SELECT group_concat(co.name || ' (' || m.role || ')', '; ') FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL WHERE m.user_id = u.id) AS registered,
            (SELECT COUNT(*) FROM sys_cad_status x WHERE x.bizomat_sub = u.id OR (x.email = u.email AND x.email_verified = 1)) AS cad
       FROM users u LEFT JOIN platform_admins pa ON pa.user_id = u.id LEFT JOIN sys_companies s ON s.owner_id = u.id
       ${where} ORDER BY COALESCE(u.last_active_at, u.created_at) DESC LIMIT 51 OFFSET ?`,
  )
    .bind(...args, offset)
    .all();
  return c.json({ users: rows.results.slice(0, 50), more: rows.results.length > 50, offset });
});

adminSystemRoutes.get('/companies', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const offset = Math.max(0, Math.min(100_000, Number(c.req.query('offset')) || 0));
  const filter = q ? 'WHERE name LIKE ? ESCAPE \'\\\' OR owner_email LIKE ? ESCAPE \'\\\'' : '';
  const rows = await c.env.DB.prepare(
    `SELECT * FROM (
       SELECT co.id, co.name, 'registered' AS kind, co.abn_status, co.email_verified_at, co.suspended_at, co.created_at,
              (SELECT u.name FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = co.id AND m.role = 'owner' LIMIT 1) AS owner_name,
              (SELECT u.email FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = co.id AND m.role = 'owner' LIMIT 1) AS owner_email,
              (SELECT COUNT(*) FROM co_members m WHERE m.company_id = co.id) AS people,
              (SELECT COUNT(*) FROM co_tools t WHERE t.company_id = co.id) AS tools
         FROM co_companies co WHERE co.deleted_at IS NULL
       UNION ALL
       SELECT s.id, s.name, 'own', 'none', NULL, NULL, s.created_at, u.name, u.email, 1,
              (SELECT COUNT(*) FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id AND w.deleted_at IS NULL
                WHERE m.user_id = s.owner_id AND m.role = 'owner' AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'tasks' AND t.ref_id = w.id))
            + (SELECT COUNT(*) FROM crm_members m JOIN crm_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL
                WHERE m.user_id = s.owner_id AND m.role = 'owner' AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'crm' AND t.ref_id = o.id))
            + (SELECT COUNT(*) FROM fin_members m JOIN fin_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL
                WHERE m.user_id = s.owner_id AND m.role = 'owner' AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'finance' AND t.ref_id = o.id))
         FROM sys_companies s JOIN users u ON u.id = s.owner_id
     ) ${filter} ORDER BY kind DESC, created_at DESC LIMIT 51 OFFSET ?`,
  )
    .bind(...(q ? [like(q), like(q)] : []), offset)
    .all();
  return c.json({ companies: rows.results.slice(0, 50), more: rows.results.length > 50, offset });
});

const APPS = ['tasks', 'crm', 'finance', 'company', 'sign-in'] as const;

/** Activity across every tool, newest first: who did what kind of thing, where and when (no record contents). */
adminSystemRoutes.get('/activity', async (c) => {
  const app = c.req.query('app');
  const before = Number(c.req.query('before')) || now() + 1;
  const user = (c.req.query('user') ?? '').slice(0, 64);
  const parts: Record<(typeof APPS)[number], string> = {
    tasks: `SELECT 'tasks' AS app, a.action, a.target_type, a.created_at AS at, a.actor_id, w.name AS place FROM audit_log a LEFT JOIN workspaces w ON w.id = a.workspace_id WHERE a.created_at < ?1`,
    crm: `SELECT 'crm' AS app, a.action, a.target_type, a.created_at AS at, a.actor_id, o.name AS place FROM crm_audit_log a LEFT JOIN crm_orgs o ON o.id = a.org_id WHERE a.created_at < ?1`,
    finance: `SELECT 'finance' AS app, a.action, a.target_type, a.created_at AS at, a.actor_id, o.name AS place FROM fin_audit_log a LEFT JOIN fin_orgs o ON o.id = a.org_id WHERE a.created_at < ?1`,
    company: `SELECT 'company' AS app, a.action, a.target_type, a.created_at AS at, a.actor_id, co.name AS place FROM co_audit a LEFT JOIN co_companies co ON co.id = a.company_id WHERE a.created_at < ?1`,
    'sign-in': `SELECT 'sign-in' AS app, 'signed_in' AS action, s.provider AS target_type, s.created_at AS at, s.user_id AS actor_id, NULL AS place FROM sessions s WHERE s.created_at < ?1`,
  };
  const chosen = (APPS as readonly string[]).includes(app ?? '') ? [parts[app as (typeof APPS)[number]]] : Object.values(parts);
  const sql = `SELECT x.*, u.name AS actor_name, u.email AS actor_email FROM (${chosen.join(' UNION ALL ')}) x LEFT JOIN users u ON u.id = x.actor_id
                ${user ? 'WHERE x.actor_id = ?2' : ''} ORDER BY x.at DESC LIMIT 100`;
  const rows = await c.env.DB.prepare(sql).bind(before, ...(user ? [user] : [])).all();
  return c.json({ events: rows.results });
});

adminSystemRoutes.post('/backfill', async (c) => {
  founderOnly(c);
  let made = 0;
  for (let i = 0; i < 20; i++) {
    const n = await backfillOwnCompanies(c.env.DB, 500);
    made += n;
    if (n < 500) break;
  }
  await auditStmt(c.env.DB, { actorId: c.get('user').id, action: 'system.backfill', metadata: { made }, ip: clientIp(c) }).run();
  return c.json({ made });
});

adminSystemRoutes.post('/users/:id/:action{disable|enable}', async (c) => {
  founderOnly(c);
  const me = c.get('user');
  const id = c.req.param('id');
  const action = c.req.param('action');
  if (id === me.id) throw new HttpError(400, 'You cannot disable your own account.');
  const u = await c.env.DB.prepare('SELECT u.id, pa.role FROM users u LEFT JOIN platform_admins pa ON pa.user_id = u.id WHERE u.id = ?').bind(id).first<{ id: string; role: string | null }>();
  if (!u) throw notFound('Account');
  if (u.role === 'founder') throw new HttpError(400, 'A founder account cannot be disabled here.');
  const t = now();
  const stmts = [
    c.env.DB.prepare('UPDATE users SET disabled_at = ?, updated_at = ? WHERE id = ?').bind(action === 'disable' ? t : null, t, id),
    auditStmt(c.env.DB, { actorId: me.id, action: action === 'disable' ? 'system.user_disabled' : 'system.user_enabled', targetType: 'user', targetId: id, ip: clientIp(c) }),
  ];
  // A disabled account is signed out everywhere at once (sessions and API tokens stop at the next request anyway).
  if (action === 'disable') stmts.push(c.env.DB.prepare("UPDATE sessions SET revoked_at = ?, ended_at = COALESCE(ended_at, ?), end_reason = COALESCE(end_reason, 'revoked') WHERE user_id = ? AND revoked_at IS NULL").bind(t, t, id));
  await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

adminSystemRoutes.post('/companies/:id/:action{suspend|resume}', async (c) => {
  founderOnly(c);
  const id = c.req.param('id');
  const action = c.req.param('action');
  const co = await c.env.DB.prepare('SELECT id FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(id).first<{ id: string }>();
  if (!co) throw notFound('Registered company');
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE co_companies SET suspended_at = ?, updated_at = ? WHERE id = ?').bind(action === 'suspend' ? t : null, t, id),
    coAuditStmt(c.env.DB, { companyId: id, actorId: c.get('user').id, action: action === 'suspend' ? 'company.suspended' : 'company.resumed', ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

