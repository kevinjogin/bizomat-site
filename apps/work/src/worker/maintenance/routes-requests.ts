// Maintenance requests (/api/maintenance/c/:company/requests): anyone with access to the company may raise one (only the
// description is required). With the company's approval rule on (the default), a new request waits for a supervisor's
// or administrator's approval; with it off, it is submitted straight away. Supervisors and administrators approve,
// decline (with a reason), ask for more information, make a work order from it or attach it to an open work order, and
// close it. A request becomes or joins one work order only, and is completed when that work order is completed.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { deny, isManager, requestScope, requireMt, workOrderScope, type MtAccess } from './access';
import { requestDTO, workOrderDTO } from './dto';
import { WO_SELECT, fromRequestSchema, loadWorkOrder, workOrderStatements } from './routes-work';
import { OPEN_REQUESTS, OUTSTANDING, PRIORITY, PRIORITY_RANK, commentStmt, commentsOf, departmentName, eventDTO, eventStmt, filesOf, likeOf, nextNumber, searchText, sqlList, validDate, zDate, zId, zText, type RequestStatus } from './util';

export const requestRoutes = new Hono<AppEnv>();

const SELECT = `SELECT r.*, a.number AS asset_number, a.name AS asset_name, u.name AS requester_name, dc.name AS decider_name, d.name AS department_name, w.number AS wo_number, w.status AS wo_status
  FROM mt_requests r
  LEFT JOIN mt_assets a ON a.company_id = r.company_id AND a.id = r.asset_id
  LEFT JOIN users u ON u.id = r.requested_by
  LEFT JOIN users dc ON dc.id = r.decided_by
  LEFT JOIN co_departments d ON d.id = r.department_id
  LEFT JOIN mt_work_orders w ON w.company_id = r.company_id AND w.id = r.work_order_id`;

export async function requireApproval(db: D1Database, companyId: string): Promise<boolean> {
  const s = await db.prepare('SELECT require_approval FROM mt_settings WHERE company_id = ?').bind(companyId).first<{ require_approval: number }>();
  return s ? !!s.require_approval : true;
}

/** The request if the caller may see it, else 404 (also for another company's). */
async function loadRequest(db: D1Database, a: MtAccess, id: string) {
  const scope = requestScope(a, 'r');
  const r = await db.prepare(`${SELECT} WHERE r.company_id = ? AND r.id = ? AND ${scope.sql}`).bind(a.companyId, id, ...scope.args).first<any>();
  if (!r) throw notFound('Request');
  return r;
}

const fields = {
  description: zText(5000).min(1, 'Describe the fault or the work needed'),
  assetId: zId.nullable().optional(),
  priority: z.enum(PRIORITY).optional(),
  department: zText(120).optional(),
  departmentId: zId.nullable().optional(),
  location: zText(200).optional(),
  neededBy: zDate.optional(),
  notes: zText(5000).optional(),
};

function columnsOf(i: Partial<z.infer<z.ZodObject<typeof fields>>>): Record<string, unknown> {
  const map: Record<string, [string, unknown]> = {
    description: ['description', i.description],
    assetId: ['asset_id', i.assetId],
    priority: ['priority', i.priority],
    department: ['department', i.department],
    departmentId: ['department_id', i.departmentId],
    location: ['location', i.location],
    neededBy: ['needed_by', i.neededBy],
    notes: ['notes', i.notes],
  };
  const out: Record<string, unknown> = {};
  for (const [, [col, v]] of Object.entries(map)) if (v !== undefined) out[col] = v;
  return out;
}

async function validate(db: D1Database, a: MtAccess, cols: Record<string, unknown>) {
  if (cols.asset_id) {
    const asset = await db.prepare('SELECT archived_at FROM mt_assets WHERE company_id = ? AND id = ?').bind(a.companyId, cols.asset_id).first<{ archived_at: number | null }>();
    if (!asset) throw new HttpError(400, 'Choose an asset from this company');
    if (asset.archived_at) throw new HttpError(400, 'That asset is archived');
  }
  if (cols.department_id) {
    if (a.kind !== 'registered') throw new HttpError(400, 'Departments belong to registered companies; type the department instead');
    await departmentName(db, a.companyId, String(cols.department_id));
  }
}

const reqSearch = (r: Record<string, unknown>) => searchText(r.number as string, r.description as string, r.location as string, r.department as string, r.notes as string);

// ------------------------------------------------------------------ list

requestRoutes.get('/c/:company/requests', async (c) => {
  const a = await requireMt(c);
  const qp = (k: string) => c.req.query(k) ?? '';
  const scope = requestScope(a, 'r');
  const where = ['r.company_id = ?', scope.sql];
  const args: unknown[] = [a.companyId, ...scope.args];
  if (qp('mine') === '1') {
    where.push('r.requested_by = ?');
    args.push(a.userId);
  }
  const status = qp('status');
  if (status === 'open') where.push(`r.status IN (${sqlList(OPEN_REQUESTS)})`);
  else if (status === 'awaiting') where.push("r.status IN ('awaiting_approval','submitted')");
  else if (status) {
    const list = status.split(',').filter((s) => ['submitted', 'awaiting_approval', 'approved', 'declined', 'info_requested', 'converted', 'completed', 'closed'].includes(s));
    if (list.length) where.push(`r.status IN (${sqlList(list)})`);
  }
  if (qp('priority') && (PRIORITY as readonly string[]).includes(qp('priority'))) {
    where.push('r.priority = ?');
    args.push(qp('priority'));
  }
  if (qp('assetId')) {
    where.push('r.asset_id = ?');
    args.push(qp('assetId').slice(0, 64));
  }
  // Dates: when the request was raised, from and to (inclusive, UTC days).
  if (validDate(qp('from'))) {
    where.push('r.created_at >= ?');
    args.push(Date.parse(`${qp('from')}T00:00:00Z`));
  }
  if (validDate(qp('to'))) {
    where.push('r.created_at < ?');
    args.push(Date.parse(`${qp('to')}T00:00:00Z`) + 86_400_000);
  }
  if (qp('q').trim()) {
    where.push('(r.search LIKE ? OR a.search LIKE ?)');
    args.push(likeOf(qp('q')), likeOf(qp('q')));
  }
  const sort = qp('sort') === 'priority' ? `${PRIORITY_RANK.replace('{col}', 'r.priority')} DESC, r.created_at DESC` : qp('sort') === 'number' ? 'r.number COLLATE NOCASE DESC' : qp('sort') === 'oldest' ? 'r.created_at ASC' : 'r.created_at DESC';
  const limit = Math.min(Math.max(Number(qp('limit')) || 100, 1), 500);
  const offset = Math.max(Number(qp('offset')) || 0, 0);
  const [rows, total] = await c.env.DB.batch([
    c.env.DB.prepare(`${SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort} LIMIT ? OFFSET ?`).bind(...args, limit, offset),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM mt_requests r LEFT JOIN mt_assets a ON a.company_id = r.company_id AND a.id = r.asset_id WHERE ${where.join(' AND ')}`).bind(...args),
  ]);
  return c.json({ requests: (rows.results as any[]).map(requestDTO), total: (total.results[0] as any)?.n ?? 0 });
});

// ------------------------------------------------------------------ raise, read, change

requestRoutes.post('/c/:company/requests', async (c) => {
  const a = await requireMt(c);
  await rateLimit(c.env.DB, `mt-request:${a.userId}`, 30, 60_000);
  const input = await body(c, z.object(fields));
  const cols = columnsOf(input);
  await validate(c.env.DB, a, cols);
  const status: RequestStatus = (await requireApproval(c.env.DB, a.companyId)) ? 'awaiting_approval' : 'submitted';
  const id = newId();
  const number = await nextNumber(c.env.DB, a.companyId, 'request');
  const t = now();
  const row: Record<string, unknown> = { ...cols, id, company_id: a.companyId, number, status, requested_by: a.userId, created_at: t, updated_at: t };
  row.search = reqSearch(row);
  const keys = Object.keys(row);
  await c.env.DB.batch([
    c.env.DB.prepare(`INSERT INTO mt_requests (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => row[k])),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'request.created', assetId: (cols.asset_id as string) ?? null, requestId: id, summary: `Request ${number} raised${status === 'awaiting_approval' ? ', awaiting approval' : ''}`, after: { ...cols, status }, at: t }),
  ]);
  return c.json(requestDTO(await loadRequest(c.env.DB, a, id)), 201);
});

requestRoutes.get('/c/:company/requests/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const r = await loadRequest(db, a, c.req.param('id'));
  // The asset's outstanding work orders, so a supervisor can attach the request to one instead of making another.
  let assetWork: unknown[] = [];
  if (r.asset_id && isManager(a)) {
    const rows = await db.prepare(`${WO_SELECT} WHERE w.company_id = ? AND w.asset_id = ? AND w.status IN (${sqlList(OUTSTANDING)}) ORDER BY w.created_at DESC LIMIT 50`).bind(a.userId, a.companyId, r.asset_id).all<any>();
    assetWork = rows.results.map(workOrderDTO);
  }
  let workOrderVisible = false;
  if (r.work_order_id) {
    const s = workOrderScope(a, 'w');
    workOrderVisible = !!(await db.prepare(`SELECT 1 FROM mt_work_orders w WHERE w.company_id = ? AND w.id = ? AND ${s.sql}`).bind(a.companyId, r.work_order_id, ...s.args).first());
  }
  const events = await db.prepare('SELECT e.*, u.name AS actor_name FROM mt_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.company_id = ? AND e.request_id = ? ORDER BY e.created_at DESC LIMIT 200').bind(a.companyId, r.id).all<any>();
  const mine = r.requested_by === a.userId;
  const manager = isManager(a);
  const open = (OPEN_REQUESTS as string[]).includes(r.status);
  const free = !r.work_order_id && ['submitted', 'awaiting_approval', 'approved'].includes(r.status);
  return c.json({
    request: requestDTO(r),
    assetOutstandingWorkOrders: assetWork,
    workOrderVisible,
    comments: await commentsOf(db, a.companyId, 'request_id', r.id),
    files: await filesOf(db, a.companyId, 'request_id', r.id),
    history: events.results.map(eventDTO),
    approvalRequired: await requireApproval(db, a.companyId),
    can: {
      edit: (manager && open) || (mine && ['submitted', 'awaiting_approval', 'info_requested'].includes(r.status)),
      approve: manager && ['submitted', 'awaiting_approval', 'info_requested'].includes(r.status),
      decline: manager && open,
      requestInfo: manager && ['submitted', 'awaiting_approval', 'approved'].includes(r.status),
      respond: (mine || manager) && r.status === 'info_requested',
      convert: manager && free,
      attach: manager && free,
      close: manager && r.status !== 'closed',
      comment: (mine || manager) && r.status !== 'closed',
      upload: (mine || manager) && r.status !== 'closed',
    },
  });
});

requestRoutes.patch('/c/:company/requests/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const r = await loadRequest(db, a, c.req.param('id'));
  const mine = r.requested_by === a.userId;
  const manager = isManager(a);
  if (!(manager && (OPEN_REQUESTS as string[]).includes(r.status)) && !(mine && ['submitted', 'awaiting_approval', 'info_requested'].includes(r.status))) {
    if (!manager && !mine) deny();
    throw new HttpError(409, `${r.number} can no longer be changed`);
  }
  const input = await body(c, z.object(fields).partial());
  const cols = columnsOf(input);
  await validate(db, a, cols);
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(cols)) {
    if (JSON.stringify(r[k] ?? null) !== JSON.stringify(v ?? null)) {
      before[k] = r[k] ?? null;
      after[k] = v;
    }
  }
  if (!Object.keys(after).length) return c.json(requestDTO(r));
  const set: Record<string, unknown> = { ...after, search: reqSearch({ ...r, ...after }), updated_at: now() };
  const keys = Object.keys(set);
  await db.batch([
    db.prepare(`UPDATE mt_requests SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ?`).bind(...keys.map((k) => set[k]), a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.updated', assetId: (after.asset_id as string) ?? r.asset_id, requestId: r.id, summary: `Changed ${Object.keys(after).map((k) => k.replace(/_id$/, '').replace(/_/g, ' ')).join(', ')}`, before, after }),
  ]);
  return c.json(requestDTO(await loadRequest(db, a, r.id)));
});

// ------------------------------------------------------------------ decisions

/** A status change by a supervisor or administrator, only from the statuses given; optional comment. */
async function decide(c: any, opts: { from: RequestStatus[]; to: RequestStatus; action: string; summary: (r: any) => string; comment?: string; note?: string }) {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB as D1Database;
  const r = await loadRequest(db, a, c.req.param('id'));
  if (!opts.from.includes(r.status)) throw new HttpError(409, `${r.number} is ${r.status.replace(/_/g, ' ')}: that cannot be done now`);
  const t = now();
  const res = await db.batch([
    db.prepare(`UPDATE mt_requests SET status = ?, decided_by = ?, decided_at = ?, decision_note = COALESCE(?, decision_note), updated_at = ?, closed_at = CASE WHEN ? = 'closed' THEN ? ELSE closed_at END WHERE company_id = ? AND id = ? AND status IN (${sqlList(opts.from)})`)
      .bind(opts.to, a.userId, t, opts.note ?? null, t, opts.to, t, a.companyId, r.id),
    ...(opts.comment ? [commentStmt(db, { companyId: a.companyId, requestId: r.id, authorId: a.userId, body: opts.comment, at: t })] : []),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: opts.action, assetId: r.asset_id, requestId: r.id, summary: opts.summary(r), before: { status: r.status }, after: { status: opts.to, ...(opts.note ? { note: opts.note } : {}) }, at: t }),
  ]);
  if (!res[0].meta.changes) throw new HttpError(409, `${r.number} changed while you were deciding`);
  return c.json(requestDTO(await loadRequest(db, a, r.id)));
}

requestRoutes.post('/c/:company/requests/:id/approve', async (c) => {
  await requireMt(c, 'supervisor');
  const input = await body(c, z.object({ note: zText(2000).optional() }).default({}));
  return decide(c, { from: ['submitted', 'awaiting_approval', 'info_requested'], to: 'approved', action: 'request.approved', summary: (r) => `Request ${r.number} approved`, note: input.note || undefined, comment: input.note || undefined });
});

requestRoutes.post('/c/:company/requests/:id/decline', async (c) => {
  await requireMt(c, 'supervisor');
  const input = await body(c, z.object({ reason: zText(2000).min(1, 'Give a reason') }));
  return decide(c, { from: ['submitted', 'awaiting_approval', 'info_requested', 'approved'], to: 'declined', action: 'request.declined', summary: (r) => `Request ${r.number} declined: ${input.reason}`, note: input.reason, comment: `Declined: ${input.reason}` });
});

requestRoutes.post('/c/:company/requests/:id/request-info', async (c) => {
  await requireMt(c, 'supervisor');
  const input = await body(c, z.object({ comment: zText(2000).min(1, 'Say what information is needed') }));
  return decide(c, { from: ['submitted', 'awaiting_approval', 'approved'], to: 'info_requested', action: 'request.info_requested', summary: (r) => `More information requested on ${r.number}: ${input.comment}`, comment: input.comment });
});

requestRoutes.post('/c/:company/requests/:id/close', async (c) => {
  await requireMt(c, 'supervisor');
  const input = await body(c, z.object({ note: zText(2000).optional() }).default({}));
  return decide(c, { from: ['submitted', 'awaiting_approval', 'approved', 'declined', 'info_requested', 'converted', 'completed'], to: 'closed', action: 'request.closed', summary: (r) => `Request ${r.number} closed${input.note ? `: ${input.note}` : ''}`, comment: input.note || undefined });
});

/** The requester (or a supervisor) answers a request for more information: it goes back for a decision. */
requestRoutes.post('/c/:company/requests/:id/respond', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const r = await loadRequest(db, a, c.req.param('id'));
  if (r.requested_by !== a.userId && !isManager(a)) deny('Only the person who raised the request can answer');
  if (r.status !== 'info_requested') throw new HttpError(409, `${r.number} is not waiting for more information`);
  const input = await body(c, z.object({ comment: zText(5000).min(1, 'Write the information asked for'), description: zText(5000).min(1).optional() }));
  const to: RequestStatus = (await requireApproval(db, a.companyId)) ? 'awaiting_approval' : 'submitted';
  const t = now();
  await db.batch([
    db.prepare("UPDATE mt_requests SET status = ?, description = COALESCE(?, description), updated_at = ? WHERE company_id = ? AND id = ? AND status = 'info_requested'").bind(to, input.description ?? null, t, a.companyId, r.id),
    commentStmt(db, { companyId: a.companyId, requestId: r.id, authorId: a.userId, body: input.comment, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.info_given', assetId: r.asset_id, requestId: r.id, summary: `Information given on ${r.number}`, before: { status: r.status }, after: { status: to }, at: t }),
  ]);
  return c.json(requestDTO(await loadRequest(db, a, r.id)));
});

requestRoutes.post('/c/:company/requests/:id/comments', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const r = await loadRequest(db, a, c.req.param('id'));
  if (r.requested_by !== a.userId && !isManager(a)) deny();
  if (r.status === 'closed') throw new HttpError(409, `${r.number} is closed`);
  const input = await body(c, z.object({ body: zText(5000).min(1) }));
  const t = now();
  await db.batch([
    commentStmt(db, { companyId: a.companyId, requestId: r.id, authorId: a.userId, body: input.body, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.comment', assetId: r.asset_id, requestId: r.id, summary: 'Comment added', at: t }),
  ]);
  return c.json({ ok: true }, 201);
});

// ------------------------------------------------------------------ to a work order

/** Make a work order from the request. A request already made into (or attached to) a work order is refused. */
requestRoutes.post('/c/:company/requests/:id/convert', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const r = await loadRequest(db, a, c.req.param('id'));
  if (r.work_order_id) throw new HttpError(409, `${r.number} already has work order ${r.wo_number ?? ''}`.trim());
  if (!['submitted', 'awaiting_approval', 'approved'].includes(r.status)) throw new HttpError(409, `${r.number} is ${r.status.replace(/_/g, ' ')}: it cannot be made into a work order`);
  const input = await body(c, fromRequestSchema);
  const assetId = input.assetId ?? r.asset_id;
  if (!assetId) throw new HttpError(400, 'Choose the asset for the work order: the request does not name one');
  const made = await workOrderStatements(
    db,
    a,
    { ...input, assetId, description: input.description ?? r.description, priority: input.priority ?? r.priority, department: input.department ?? r.department, departmentId: input.departmentId !== undefined ? input.departmentId : r.department_id },
    { id: r.id, number: r.number, assetId: r.asset_id },
  );
  const t = made.at;
  let res: D1Result[];
  try {
    res = await db.batch([
      ...made.stmts,
      db.prepare("UPDATE mt_requests SET status = 'converted', work_order_id = ?, decided_by = COALESCE(decided_by, ?), decided_at = COALESCE(decided_at, ?), updated_at = ? WHERE company_id = ? AND id = ? AND work_order_id IS NULL").bind(made.id, a.userId, t, t, a.companyId, r.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.converted', assetId, requestId: r.id, workOrderId: made.id, summary: `Request ${r.number} made into work order ${made.number}`, before: { status: r.status }, after: { status: 'converted', workOrder: made.number }, at: t }),
    ]);
  } catch (e) {
    // Someone made it into a work order a moment ago: the transaction is rolled back.
    const now2 = await db.prepare('SELECT work_order_id FROM mt_requests WHERE company_id = ? AND id = ?').bind(a.companyId, r.id).first<{ work_order_id: string | null }>();
    if (now2?.work_order_id) throw new HttpError(409, `${r.number} already has a work order`);
    throw e;
  }
  if (!res[0].meta.changes) throw new HttpError(409, `${r.number} already has a work order`);
  return c.json({ request: requestDTO(await loadRequest(db, a, r.id)), workOrder: workOrderDTO(await loadWorkOrder(db, a, made.id)) }, 201);
});

/** Attach the request to an open work order (for example one already made for the same fault). */
requestRoutes.post('/c/:company/requests/:id/attach', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const r = await loadRequest(db, a, c.req.param('id'));
  if (r.work_order_id) throw new HttpError(409, `${r.number} already has work order ${r.wo_number ?? ''}`.trim());
  if (!['submitted', 'awaiting_approval', 'approved'].includes(r.status)) throw new HttpError(409, `${r.number} is ${r.status.replace(/_/g, ' ')}: it cannot be attached to a work order`);
  const input = await body(c, z.object({ workOrderId: zId }));
  const w = await db.prepare('SELECT * FROM mt_work_orders WHERE company_id = ? AND id = ?').bind(a.companyId, input.workOrderId).first<any>();
  if (!w) throw notFound('Work order');
  if (!(OUTSTANDING as string[]).includes(w.status)) throw new HttpError(409, `${w.number} is ${w.status.replace(/_/g, ' ')}: attach the request to an open work order`);
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE mt_requests SET status = 'converted', work_order_id = ?, decided_by = COALESCE(decided_by, ?), decided_at = COALESCE(decided_at, ?), updated_at = ? WHERE company_id = ? AND id = ? AND work_order_id IS NULL AND status IN ('submitted','awaiting_approval','approved')").bind(w.id, a.userId, t, t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.attached', assetId: r.asset_id ?? w.asset_id, requestId: r.id, workOrderId: w.id, summary: `Request ${r.number} attached to work order ${w.number}`, before: { status: r.status }, after: { status: 'converted', workOrder: w.number }, at: t }),
  ]);
  if (!res[0].meta.changes) throw new HttpError(409, `${r.number} already has a work order`);
  return c.json(requestDTO(await loadRequest(db, a, r.id)));
});
