// BIZOMAT ERP: Asset Management and Maintenance, Stage 1 (owner, 14 Nov 2026). The API under /api/maintenance (signed
// in), mounted by src/worker/app.ts: the same Worker, database, file store, accounts and session as the rest of the ERP.
// Tables: migrations/0018_maintenance.sql. Who may do what: access.ts.
//
//   GET   /companies                          companies where the caller has maintenance access, with their role
//   GET   /c/:company/me                      the caller's role, the approval rule, people and departments
//   GET   /c/:company/overview                counts for the overview
//   GET   /c/:company/events                  the company's maintenance history (supervisors and administrators)
//   GET   /c/:company/roles, PUT /roles/:user maintenance roles (administrators)
//   PATCH /c/:company/settings                the approval rule (administrators)
//   assets, requests, work orders and files:  routes-assets.ts, routes-requests.ts, routes-work.ts, routes-files.ts

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, now } from '../lib/util';
import { ensureOwnCompany } from '../system/system';
import { MT_ROLES, companyPeople, isManager, mtCompanies, requestScope, requireMt, workOrderScope } from './access';
import { assetRoutes } from './routes-assets';
import { requestRoutes, requireApproval } from './routes-requests';
import { workRoutes } from './routes-work';
import { fileRoutes } from './routes-files';
import { OPEN_REQUESTS, OUTSTANDING, eventDTO, eventStmt, sqlList, todayFrom } from './util';

export const maintenanceRoutes = new Hono<AppEnv>();

maintenanceRoutes.get('/companies', async (c) => {
  const user = c.get('user');
  await ensureOwnCompany(c.env.DB, user);
  return c.json({ companies: await mtCompanies(c.env.DB, user) });
});

maintenanceRoutes.get('/c/:company/me', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const departments =
    a.kind === 'registered'
      ? (await db.prepare('SELECT id, name, parent_id FROM co_departments WHERE company_id = ? AND archived_at IS NULL ORDER BY name COLLATE NOCASE').bind(a.companyId).all<{ id: string; name: string; parent_id: string | null }>()).results.map((d) => ({ id: d.id, name: d.name, parentId: d.parent_id }))
      : [];
  const people = await companyPeople(db, a);
  return c.json({
    company: { id: a.companyId, name: a.companyName, kind: a.kind },
    user: { id: a.userId, name: a.userName },
    role: a.role,
    roleIsDefault: a.roleIsDefault,
    companyRole: a.companyRole,
    approvalRequired: await requireApproval(db, a.companyId),
    departments,
    // Names only for everyone; the role of each person matters to whoever assigns work.
    people: people.map((p) => ({ id: p.id, name: p.name, role: isManager(a) ? p.role : undefined })),
    can: {
      manageAssets: isManager(a),
      importAssets: a.role === 'admin',
      manageWork: isManager(a),
      decide: isManager(a),
      roles: a.role === 'admin',
    },
  });
});

maintenanceRoutes.get('/c/:company/overview', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const wo = workOrderScope(a, 'w');
  const rq = requestScope(a, 'r');
  const [counts, reqs, assets] = await db.batch([
    db
      .prepare(
        `SELECT
           SUM(CASE WHEN w.status IN (${sqlList(OUTSTANDING)}) THEN 1 ELSE 0 END) AS open_work,
           SUM(CASE WHEN w.status IN (${sqlList(OUTSTANDING)}) AND w.due_finish IS NOT NULL AND w.due_finish < ? THEN 1 ELSE 0 END) AS overdue,
           SUM(CASE WHEN w.status IN (${sqlList(OUTSTANDING)}) AND w.assigned_to = ? THEN 1 ELSE 0 END) AS my_work,
           SUM(CASE WHEN w.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
           SUM(CASE WHEN w.status = 'on_hold' THEN 1 ELSE 0 END) AS on_hold,
           SUM(CASE WHEN w.status = 'completed' THEN 1 ELSE 0 END) AS completed
         FROM mt_work_orders w WHERE w.company_id = ? AND ${wo.sql}`,
      )
      .bind(today, a.userId, a.companyId, ...wo.args),
    db
      .prepare(
        `SELECT
           SUM(CASE WHEN r.status IN ('awaiting_approval','submitted') THEN 1 ELSE 0 END) AS awaiting,
           SUM(CASE WHEN r.status = 'info_requested' THEN 1 ELSE 0 END) AS info,
           SUM(CASE WHEN r.status IN (${sqlList(OPEN_REQUESTS)}) THEN 1 ELSE 0 END) AS open_requests,
           SUM(CASE WHEN r.requested_by = ? AND r.status NOT IN ('closed','declined','completed') THEN 1 ELSE 0 END) AS my_requests
         FROM mt_requests r WHERE r.company_id = ? AND ${rq.sql}`,
      )
      .bind(a.userId, a.companyId, ...rq.args),
    db.prepare("SELECT COUNT(*) AS n, SUM(CASE WHEN status IN ('under_maintenance','out_of_service') THEN 1 ELSE 0 END) AS down FROM mt_assets WHERE company_id = ? AND archived_at IS NULL").bind(a.companyId),
  ]);
  const w = (counts.results[0] ?? {}) as any;
  const r = (reqs.results[0] ?? {}) as any;
  const s = (assets.results[0] ?? {}) as any;
  const running = await db
    .prepare('SELECT l.work_order_id, l.started_at, w.number FROM mt_labour l JOIN mt_work_orders w ON w.company_id = l.company_id AND w.id = l.work_order_id WHERE l.company_id = ? AND l.user_id = ? AND l.ended_at IS NULL ORDER BY l.started_at')
    .bind(a.companyId, a.userId)
    .all<{ work_order_id: string; started_at: number; number: string }>();
  return c.json({
    today,
    role: a.role,
    awaitingApproval: r.awaiting ?? 0,
    infoRequested: r.info ?? 0,
    openRequests: r.open_requests ?? 0,
    myRequests: r.my_requests ?? 0,
    openWorkOrders: w.open_work ?? 0,
    overdue: w.overdue ?? 0,
    myWork: w.my_work ?? 0,
    inProgress: w.in_progress ?? 0,
    onHold: w.on_hold ?? 0,
    completedNotClosed: w.completed ?? 0,
    assets: s.n ?? 0,
    assetsDown: s.down ?? 0,
    myTimers: running.results.map((x) => ({ workOrderId: x.work_order_id, number: x.number, startedAt: x.started_at })),
  });
});

maintenanceRoutes.get('/c/:company/events', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const before = Number(c.req.query('before')) || Number.MAX_SAFE_INTEGER;
  const rows = await c.env.DB.prepare('SELECT e.*, u.name AS actor_name FROM mt_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.company_id = ? AND e.created_at < ? ORDER BY e.created_at DESC LIMIT 100').bind(a.companyId, before).all<any>();
  return c.json({ events: rows.results.map(eventDTO) });
});

// ------------------------------------------------------------------ roles and settings

maintenanceRoutes.get('/c/:company/roles', async (c) => {
  const a = await requireMt(c, 'admin');
  return c.json({ kind: a.kind, people: await companyPeople(c.env.DB, a) });
});

maintenanceRoutes.put('/c/:company/roles/:userId', async (c) => {
  const a = await requireMt(c, 'admin');
  const input = await body(c, z.object({ role: z.enum(MT_ROLES).nullable() }));
  const people = await companyPeople(c.env.DB, a);
  const target = people.find((p) => p.id === c.req.param('userId'));
  if (!target) throw new HttpError(404, 'Person not found');
  if (target.companyRole === 'owner') throw new HttpError(400, 'The company owner is always a maintenance administrator');
  const t = now();
  const stmt = input.role
    ? c.env.DB.prepare('INSERT INTO mt_roles (company_id, user_id, role, set_by, set_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id, user_id) DO UPDATE SET role = excluded.role, set_by = excluded.set_by, set_at = excluded.set_at').bind(a.companyId, target.id, input.role, a.userId, t)
    : c.env.DB.prepare('DELETE FROM mt_roles WHERE company_id = ? AND user_id = ?').bind(a.companyId, target.id);
  await c.env.DB.batch([
    stmt,
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'role.changed', summary: `${target.name}: maintenance role ${input.role ?? 'back to the default'}`, before: { userId: target.id, role: target.role, default: target.roleIsDefault }, after: { userId: target.id, role: input.role ?? 'default' }, at: t }),
  ]);
  const after = (await companyPeople(c.env.DB, a)).find((p) => p.id === target.id)!;
  return c.json(after);
});

maintenanceRoutes.patch('/c/:company/settings', async (c) => {
  const a = await requireMt(c, 'admin');
  const input = await body(c, z.object({ requireApproval: z.boolean() }));
  const before = await requireApproval(c.env.DB, a.companyId);
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO mt_settings (company_id, require_approval, updated_by, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(company_id) DO UPDATE SET require_approval = excluded.require_approval, updated_by = excluded.updated_by, updated_at = excluded.updated_at').bind(a.companyId, input.requireApproval ? 1 : 0, a.userId, t),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'settings.changed', summary: input.requireApproval ? 'New requests now need approval' : 'New requests no longer need approval', before: { requireApproval: before }, after: { requireApproval: input.requireApproval }, at: t }),
  ]);
  return c.json({ approvalRequired: input.requireApproval });
});

maintenanceRoutes.route('/', assetRoutes);
maintenanceRoutes.route('/', requestRoutes);
maintenanceRoutes.route('/', workRoutes);
maintenanceRoutes.route('/', fileRoutes);
