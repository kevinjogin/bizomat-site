// Work orders (/api/maintenance/c/:company/work-orders): standard work orders on an asset, with tasks, parts lines,
// labour time from a start/stop timer, notes, photos and documents, and the history of every change. Supervisors and
// administrators make, assign, close, cancel and reopen them; the assigned technician works on them and completes them.
// A completed, closed or cancelled work order is locked: every change is refused here until a supervisor or
// administrator reopens it with a reason.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { assertPerson, deny, isManager, requestScope, requireMt, workOrderScope, type MtAccess } from './access';
import { SUBTREE_SQL, assetPath } from './routes-assets';
import { requestDTO, workOrderDTO } from './dto';
import {
  JOB_TYPES,
  LOCKED,
  OUTSTANDING,
  PRIORITY,
  PRIORITY_RANK,
  changes,
  commentStmt,
  commentsOf,
  departmentName,
  eventDTO,
  eventStmt,
  filesOf,
  likeOf,
  nextNumber,
  searchText,
  sqlList,
  todayFrom,
  validDate,
  zDate,
  zId,
  zText,
  type WoStatus,
} from './util';

export const workRoutes = new Hono<AppEnv>();

/** The work order columns with asset, people, department, actual minutes and whether the caller's timer runs (bind the caller's id first). */
export const WO_SELECT = `SELECT w.*, a.number AS asset_number, a.name AS asset_name, u.name AS assignee_name, d.name AS department_name, cu.name AS completer_name,
    (SELECT COALESCE(SUM(l.minutes), 0) FROM mt_labour l WHERE l.work_order_id = w.id AND l.ended_at IS NOT NULL) AS actual_minutes,
    (SELECT 1 FROM mt_labour l2 WHERE l2.work_order_id = w.id AND l2.user_id = ? AND l2.ended_at IS NULL) AS my_timer
  FROM mt_work_orders w
  JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id
  LEFT JOIN users u ON u.id = w.assigned_to
  LEFT JOIN co_departments d ON d.id = w.department_id
  LEFT JOIN users cu ON cu.id = w.completed_by`;

/** The work order if the caller may see it, else 404 (also for another company's). */
export async function loadWorkOrder(db: D1Database, a: MtAccess, id: string) {
  const scope = workOrderScope(a, 'w');
  const w = await db.prepare(`${WO_SELECT} WHERE w.company_id = ? AND w.id = ? AND ${scope.sql}`).bind(a.userId, a.companyId, id, ...scope.args).first<any>();
  if (!w) throw notFound('Work order');
  return w;
}

/** The assigned technician, supervisors and administrators work on a work order. */
export const canWork = (a: MtAccess, w: { assigned_to: string | null }) => isManager(a) || (a.role === 'technician' && w.assigned_to === a.userId);

function assertWork(a: MtAccess, w: { assigned_to: string | null }) {
  if (!canWork(a, w)) deny('Only the assigned technician, a supervisor or an administrator can work on this work order');
}

export function assertUnlocked(w: { status: string; number: string }) {
  if ((LOCKED as string[]).includes(w.status)) {
    throw new HttpError(409, `${w.number} is ${w.status === 'completed' ? 'completed' : w.status} and locked. A supervisor or administrator can reopen it with a reason.`);
  }
}

const fields = {
  assetId: zId,
  description: zText(5000).min(1),
  jobType: z.enum(JOB_TYPES).optional(),
  priority: z.enum(PRIORITY).optional(),
  department: zText(120).optional(),
  departmentId: zId.nullable().optional(),
  trade: zText(80).optional(),
  assignedTo: zId.nullable().optional(),
  contractor: zText(200).optional(),
  dueStart: zDate.optional(),
  dueFinish: zDate.optional(),
  estimatedHours: z.number().min(0).max(100000).nullable().optional(),
  instructions: zText(20000).optional(),
  safety: zText(10000).optional(),
  projectRef: zText(120).optional(),
  customerRef: zText(120).optional(),
};
const lines = {
  tasks: z.array(zText(500).min(1)).max(100).optional(),
  parts: z.array(z.object({ part: zText(200).min(1), quantity: z.number().positive().max(1e6) })).max(100).optional(),
};
export const createSchema = z.object({ ...fields, ...lines });
/** Making a work order from a request: the asset comes from the request unless it has none. */
export const fromRequestSchema = z.object({ ...fields, ...lines, assetId: zId.optional(), description: zText(5000).min(1).optional() });
const updateSchema = z.object({ ...fields, assetId: zId.optional(), description: zText(5000).min(1).optional() });
type WoInput = Partial<z.infer<typeof createSchema>>;

function columnsOf(i: WoInput): Record<string, unknown> {
  const map: Record<string, [string, unknown]> = {
    assetId: ['asset_id', i.assetId],
    description: ['description', i.description],
    jobType: ['job_type', i.jobType],
    priority: ['priority', i.priority],
    department: ['department', i.department],
    departmentId: ['department_id', i.departmentId],
    trade: ['trade', i.trade],
    assignedTo: ['assigned_to', i.assignedTo],
    contractor: ['contractor', i.contractor],
    dueStart: ['due_start', i.dueStart],
    dueFinish: ['due_finish', i.dueFinish],
    estimatedHours: ['estimated_minutes', i.estimatedHours === undefined ? undefined : i.estimatedHours === null ? null : Math.round(i.estimatedHours * 60)],
    instructions: ['instructions', i.instructions],
    safety: ['safety', i.safety],
    projectRef: ['project_ref', i.projectRef],
    customerRef: ['customer_ref', i.customerRef],
  };
  const out: Record<string, unknown> = {};
  for (const [, [col, v]] of Object.entries(map)) if (v !== undefined) out[col] = v;
  return out;
}

async function validate(db: D1Database, a: MtAccess, cols: Record<string, unknown>, before: any | null) {
  if (cols.asset_id !== undefined) {
    const asset = await db.prepare('SELECT archived_at FROM mt_assets WHERE company_id = ? AND id = ?').bind(a.companyId, cols.asset_id).first<{ archived_at: number | null }>();
    if (!asset) throw new HttpError(400, 'Choose an asset from this company');
    if (asset.archived_at && cols.asset_id !== before?.asset_id) throw new HttpError(400, 'That asset is archived. Restore it first.');
  }
  const start = (cols.due_start !== undefined ? cols.due_start : before?.due_start) as string | null;
  const finish = (cols.due_finish !== undefined ? cols.due_finish : before?.due_finish) as string | null;
  if (start && finish && start > finish) throw new HttpError(400, 'The due finish cannot be before the due start');
  if (cols.assigned_to) await assertPerson(db, a, String(cols.assigned_to), 'technician', 'The technician');
  if (cols.department_id) {
    if (a.kind !== 'registered') throw new HttpError(400, 'Departments belong to registered companies; type the department instead');
    await departmentName(db, a.companyId, String(cols.department_id));
  }
}

const woSearch = (r: Record<string, unknown>) => searchText(r.number as string, r.description as string, r.trade as string, r.contractor as string, r.project_ref as string, r.customer_ref as string, r.department as string);

/**
 * The statements that make a work order (with its tasks and parts lines). With `fromRequest`, the work order is made
 * only while that request has no work order yet, in the same transaction that links it: a request is never made into
 * two work orders, even when two people press the button at once.
 */
export async function workOrderStatements(db: D1Database, a: MtAccess, input: WoInput, fromRequest?: { id: string; number: string; assetId: string | null }) {
  const cols = columnsOf(input);
  await validate(db, a, cols, null);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'work_order');
  const t = now();
  const row: Record<string, unknown> = { ...cols, id, company_id: a.companyId, number, status: cols.assigned_to ? 'assigned' : 'open', created_by: a.userId, created_at: t, updated_at: t };
  row.search = woSearch(row);
  const keys = Object.keys(row);
  const stmts: D1PreparedStatement[] = [];
  if (fromRequest) {
    stmts.push(
      db
        .prepare(`INSERT INTO mt_work_orders (${keys.join(', ')}) SELECT ${keys.map(() => '?').join(', ')} WHERE EXISTS (SELECT 1 FROM mt_requests WHERE company_id = ? AND id = ? AND work_order_id IS NULL AND status IN ('submitted','awaiting_approval','approved'))`)
        .bind(...keys.map((k) => row[k]), a.companyId, fromRequest.id),
    );
  } else {
    stmts.push(db.prepare(`INSERT INTO mt_work_orders (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => row[k])));
  }
  (input.tasks ?? []).forEach((text, i) => stmts.push(db.prepare('INSERT INTO mt_wo_tasks (id, company_id, work_order_id, position, text, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, id, i + 1, text, a.userId, t)));
  (input.parts ?? []).forEach((p, i) => stmts.push(db.prepare('INSERT INTO mt_wo_parts (id, company_id, work_order_id, position, part, quantity, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, id, i + 1, p.part, p.quantity, a.userId, t)));
  stmts.push(
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'work_order.created',
      assetId: String(cols.asset_id),
      workOrderId: id,
      requestId: fromRequest?.id,
      summary: `Work order ${number} created${fromRequest ? ` from request ${fromRequest.number}` : ''}`,
      after: { ...cols, tasks: input.tasks?.length ?? 0, parts: input.parts?.length ?? 0 },
      at: t,
    }),
  );
  return { id, number, stmts, at: t };
}

// ------------------------------------------------------------------ list

const SORTS: Record<string, string> = {
  due: "COALESCE(w.due_finish, '9999-12-31')",
  finish: 'COALESCE(w.completed_at, 0)',
  number: 'w.number COLLATE NOCASE',
  priority: PRIORITY_RANK.replace('{col}', 'w.priority'),
  asset: 'a.number COLLATE NOCASE',
  jobType: 'w.job_type',
  created: 'w.created_at',
  status: 'w.status',
};

workRoutes.get('/c/:company/work-orders', async (c) => {
  const a = await requireMt(c);
  const qp = (k: string) => c.req.query(k) ?? '';
  const today = todayFrom(c.req.query('today'));
  const scope = workOrderScope(a, 'w');
  const where = ['w.company_id = ?', scope.sql];
  const args: unknown[] = [a.companyId, ...scope.args];
  if (qp('mine') === '1') {
    where.push('w.assigned_to = ?');
    args.push(a.userId);
  }
  const status = qp('status');
  if (status === 'outstanding' || status === 'overdue') where.push(`w.status IN (${sqlList(OUTSTANDING)})`);
  else if (status) {
    const list = status.split(',').filter((s) => ['open', 'assigned', 'in_progress', 'on_hold', 'completed', 'closed', 'cancelled'].includes(s));
    if (list.length) where.push(`w.status IN (${sqlList(list)})`);
  }
  if (status === 'overdue') {
    where.push('w.due_finish IS NOT NULL AND w.due_finish < ?');
    args.push(today);
  }
  if (qp('priority') && (PRIORITY as readonly string[]).includes(qp('priority'))) {
    where.push('w.priority = ?');
    args.push(qp('priority'));
  }
  if (qp('jobType') && (JOB_TYPES as readonly string[]).includes(qp('jobType'))) {
    where.push('w.job_type = ?');
    args.push(qp('jobType'));
  }
  if (qp('trade')) {
    where.push('w.trade = ? COLLATE NOCASE');
    args.push(qp('trade').slice(0, 80));
  }
  if (qp('assignedTo')) {
    where.push('w.assigned_to = ?');
    args.push(qp('assignedTo').slice(0, 64));
  }
  if (qp('assetId')) {
    if (qp('includeChildren') === '1') {
      where.push(`w.asset_id IN (${SUBTREE_SQL})`);
      args.push(a.companyId, qp('assetId').slice(0, 64), a.companyId);
    } else {
      where.push('w.asset_id = ?');
      args.push(qp('assetId').slice(0, 64));
    }
  }
  for (const [key, op] of [
    ['dueFrom', '>='],
    ['dueTo', '<='],
  ] as const) {
    if (validDate(qp(key))) {
      where.push(`w.due_finish ${op} ?`);
      args.push(qp(key));
    }
  }
  if (qp('q').trim()) {
    where.push('(w.search LIKE ? OR a.search LIKE ?)');
    args.push(likeOf(qp('q')), likeOf(qp('q')));
  }
  const sort = SORTS[qp('sort')] ?? SORTS.due;
  const dir = qp('dir') === 'desc' ? 'DESC' : 'ASC';
  const limit = Math.min(Math.max(Number(qp('limit')) || 100, 1), 500);
  const offset = Math.max(Number(qp('offset')) || 0, 0);
  const sql = `${WO_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort} ${dir}, w.number ${dir} LIMIT ? OFFSET ?`;
  const [rows, total, trades] = await c.env.DB.batch([
    c.env.DB.prepare(sql).bind(a.userId, ...args, limit, offset),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM mt_work_orders w JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id WHERE ${where.join(' AND ')}`).bind(...args),
    c.env.DB.prepare("SELECT DISTINCT trade FROM mt_work_orders WHERE company_id = ? AND trade <> '' ORDER BY trade COLLATE NOCASE LIMIT 100").bind(a.companyId),
  ]);
  return c.json({ workOrders: (rows.results as any[]).map(workOrderDTO), total: (total.results[0] as any)?.n ?? 0, trades: (trades.results as any[]).map((r) => r.trade), today });
});

// ------------------------------------------------------------------ create, read, change

workRoutes.post('/c/:company/work-orders', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const input = await body(c, createSchema);
  const made = await workOrderStatements(c.env.DB, a, input);
  await c.env.DB.batch(made.stmts);
  return c.json(workOrderDTO(await loadWorkOrder(c.env.DB, a, made.id)), 201);
});

workRoutes.get('/c/:company/work-orders/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  const rq = requestScope(a, 'r');
  const [requests, tasks, parts, labour, events, outstandingCount] = await db.batch([
    db.prepare(`SELECT r.*, u.name AS requester_name FROM mt_requests r LEFT JOIN users u ON u.id = r.requested_by WHERE r.company_id = ? AND r.work_order_id = ? AND ${rq.sql} ORDER BY r.created_at`).bind(a.companyId, w.id, ...rq.args),
    db.prepare('SELECT t.*, u.name AS done_by_name FROM mt_wo_tasks t LEFT JOIN users u ON u.id = t.done_by WHERE t.company_id = ? AND t.work_order_id = ? ORDER BY t.position, t.created_at').bind(a.companyId, w.id),
    db.prepare('SELECT * FROM mt_wo_parts WHERE company_id = ? AND work_order_id = ? ORDER BY position, created_at').bind(a.companyId, w.id),
    db.prepare('SELECT l.*, u.name AS user_name FROM mt_labour l LEFT JOIN users u ON u.id = l.user_id WHERE l.company_id = ? AND l.work_order_id = ? ORDER BY l.started_at').bind(a.companyId, w.id),
    db.prepare('SELECT e.*, u.name AS actor_name FROM mt_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.company_id = ? AND e.work_order_id = ? ORDER BY e.created_at DESC LIMIT 300').bind(a.companyId, w.id),
    db.prepare(`SELECT COUNT(*) AS n FROM mt_work_orders WHERE company_id = ? AND asset_id = ? AND id <> ? AND status IN (${sqlList(OUTSTANDING)})`).bind(a.companyId, w.asset_id, w.id),
  ]);
  const locked = (LOCKED as string[]).includes(w.status);
  const work = canWork(a, w);
  const labourRows = (labour.results as any[]).map((l) => ({ id: l.id, userId: l.user_id, userName: l.user_name ?? null, startedAt: l.started_at, endedAt: l.ended_at, minutes: l.minutes, running: !l.ended_at }));
  return c.json({
    workOrder: workOrderDTO(w),
    assetPath: await assetPath(db, a.companyId, w.asset_id),
    otherOutstandingOnAsset: isManager(a) ? (outstandingCount.results[0] as any)?.n ?? 0 : null,
    requests: (requests.results as any[]).map(requestDTO),
    tasks: (tasks.results as any[]).map((t) => ({ id: t.id, text: t.text, position: t.position, done: !!t.done_at, doneAt: t.done_at, doneBy: t.done_by, doneByName: t.done_by_name ?? null })),
    parts: (parts.results as any[]).map((p) => ({ id: p.id, part: p.part, quantity: p.quantity, position: p.position })),
    labour: labourRows,
    totals: {
      actualMinutes: labourRows.reduce((s, l) => s + (l.minutes ?? 0), 0),
      estimatedMinutes: w.estimated_minutes,
      running: labourRows.filter((l) => l.running).map((l) => ({ userId: l.userId, userName: l.userName, startedAt: l.startedAt })),
      myTimer: labourRows.find((l) => l.running && l.userId === a.userId) ?? null,
    },
    comments: await commentsOf(db, a.companyId, 'work_order_id', w.id),
    files: await filesOf(db, a.companyId, 'work_order_id', w.id),
    history: (events.results as any[]).map(eventDTO),
    locked,
    can: {
      edit: isManager(a) && !locked,
      work: work && !locked,
      complete: work && (OUTSTANDING as string[]).includes(w.status),
      reopen: isManager(a) && locked,
      close: isManager(a) && w.status === 'completed',
      cancel: isManager(a) && (OUTSTANDING as string[]).includes(w.status),
    },
  });
});

workRoutes.patch('/c/:company/work-orders/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  assertUnlocked(w);
  const input = await body(c, updateSchema);
  const cols = columnsOf(input);
  await validate(db, a, cols, w);
  // Assigning a technician moves an open work order to assigned; taking them off moves it back.
  if (cols.assigned_to !== undefined) {
    if (cols.assigned_to && w.status === 'open') cols.status = 'assigned';
    if (!cols.assigned_to && w.status === 'assigned') cols.status = 'open';
  }
  const diff = changes(w, cols);
  if (!diff) return c.json(workOrderDTO(w));
  const set: Record<string, unknown> = { ...cols, search: woSearch({ ...w, ...cols }), updated_at: now() };
  const keys = Object.keys(set);
  const res = await db.batch([
    db.prepare(`UPDATE mt_work_orders SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ? AND status NOT IN (${sqlList(LOCKED)})`).bind(...keys.map((k) => set[k]), a.companyId, w.id),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: cols.assigned_to !== undefined && Object.keys(diff.after).length <= 2 && 'assigned_to' in diff.after ? 'work_order.assigned' : 'work_order.updated',
      assetId: (cols.asset_id as string) ?? w.asset_id,
      workOrderId: w.id,
      summary: `Changed ${Object.keys(diff.after).map((k) => k.replace(/_id$|_minutes$/, '').replace(/_to$/, ' to').replace(/_/g, ' ')).join(', ')}`,
      before: diff.before,
      after: diff.after,
    }),
  ]);
  if (!res[0].meta.changes) throw new HttpError(409, `${w.number} was locked while you were changing it`);
  return c.json(workOrderDTO(await loadWorkOrder(db, a, w.id)));
});

// ------------------------------------------------------------------ status, complete, reopen, close, cancel

workRoutes.post('/c/:company/work-orders/:id/status', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  assertWork(a, w);
  assertUnlocked(w);
  const input = await body(c, z.object({ status: z.enum(['open', 'assigned', 'in_progress', 'on_hold']), note: zText(2000).optional() }));
  if ((input.status === 'open' || input.status === 'assigned') && !isManager(a)) deny('Only supervisors and administrators can move a work order back to open or assigned');
  if (input.status === 'assigned' && !w.assigned_to) throw new HttpError(400, 'Assign a technician first');
  if (input.status === w.status) return c.json(workOrderDTO(w));
  const t = now();
  await db.batch([
    db.prepare(`UPDATE mt_work_orders SET status = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status NOT IN (${sqlList(LOCKED)})`).bind(input.status, t, a.companyId, w.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.status', assetId: w.asset_id, workOrderId: w.id, summary: `Status changed to ${input.status.replace('_', ' ')}${input.note ? `: ${input.note}` : ''}`, before: { status: w.status }, after: { status: input.status } }),
    ...(input.note ? [commentStmt(db, { companyId: a.companyId, workOrderId: w.id, authorId: a.userId, body: input.note, at: t })] : []),
  ]);
  return c.json(workOrderDTO(await loadWorkOrder(db, a, w.id)));
});

/** Stops every running timer on the work order (on completing or cancelling it). */
const stopAllTimers = (db: D1Database, companyId: string, woId: string, t: number) =>
  db.prepare('UPDATE mt_labour SET ended_at = ?1, minutes = MAX(0, CAST(ROUND((?1 - started_at) / 60000.0) AS INTEGER)) WHERE company_id = ?2 AND work_order_id = ?3 AND ended_at IS NULL').bind(t, companyId, woId);

workRoutes.post('/c/:company/work-orders/:id/complete', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  assertWork(a, w);
  if (!(OUTSTANDING as string[]).includes(w.status)) assertUnlocked(w);
  const input = await body(c, z.object({ notes: zText(10000).min(1, 'Write what was done') }));
  const linked = (await db.prepare("SELECT id, number FROM mt_requests WHERE company_id = ? AND work_order_id = ? AND status = 'converted'").bind(a.companyId, w.id).all<{ id: string; number: string }>()).results;
  const t = now();
  const res = await db.batch([
    db.prepare(`UPDATE mt_work_orders SET status = 'completed', completion_notes = ?, completed_at = ?, completed_by = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN (${sqlList(OUTSTANDING)})`).bind(input.notes, t, a.userId, t, a.companyId, w.id),
    stopAllTimers(db, a.companyId, w.id, t),
    // Completing a work order completes the requests it was made from.
    db.prepare("UPDATE mt_requests SET status = 'completed', completed_at = ?, updated_at = ? WHERE company_id = ? AND work_order_id = ? AND status = 'converted'").bind(t, t, a.companyId, w.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.completed', assetId: w.asset_id, workOrderId: w.id, summary: `Work order ${w.number} completed`, before: { status: w.status }, after: { status: 'completed', notes: input.notes }, at: t }),
    ...linked.map((r) => eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.completed', assetId: w.asset_id, requestId: r.id, workOrderId: w.id, summary: `Request ${r.number} completed with work order ${w.number}`, before: { status: 'converted' }, after: { status: 'completed' }, at: t })),
  ]);
  if (!res[0].meta.changes) throw new HttpError(409, `${w.number} is not open any more`);
  return c.json(workOrderDTO(await loadWorkOrder(db, a, w.id)));
});

workRoutes.post('/c/:company/work-orders/:id/reopen', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  if (!(LOCKED as string[]).includes(w.status)) throw new HttpError(409, `${w.number} is not completed, closed or cancelled`);
  const input = await body(c, z.object({ reason: zText(2000).min(1, 'Give a reason for reopening') }));
  const status: WoStatus = w.status === 'cancelled' ? (w.assigned_to ? 'assigned' : 'open') : 'in_progress';
  const linked = (await db.prepare("SELECT id, number FROM mt_requests WHERE company_id = ? AND work_order_id = ? AND status = 'completed'").bind(a.companyId, w.id).all<{ id: string; number: string }>()).results;
  const t = now();
  const res = await db.batch([
    db.prepare(`UPDATE mt_work_orders SET status = ?, completed_at = NULL, completed_by = NULL, closed_at = NULL, cancelled_at = NULL, updated_at = ? WHERE company_id = ? AND id = ? AND status IN (${sqlList(LOCKED)})`).bind(status, t, a.companyId, w.id),
    db.prepare("UPDATE mt_requests SET status = 'converted', completed_at = NULL, updated_at = ? WHERE company_id = ? AND work_order_id = ? AND status = 'completed'").bind(t, a.companyId, w.id),
    commentStmt(db, { companyId: a.companyId, workOrderId: w.id, authorId: a.userId, body: `Reopened: ${input.reason}`, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.reopened', assetId: w.asset_id, workOrderId: w.id, summary: `Work order ${w.number} reopened: ${input.reason}`, before: { status: w.status, completedAt: w.completed_at, completedBy: w.completed_by, closedAt: w.closed_at, cancelledAt: w.cancelled_at }, after: { status, reason: input.reason }, at: t }),
    ...linked.map((r) => eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.reopened', assetId: w.asset_id, requestId: r.id, workOrderId: w.id, summary: `Request ${r.number} is open again: work order ${w.number} was reopened`, before: { status: 'completed' }, after: { status: 'converted' }, at: t })),
  ]);
  if (!res[0].meta.changes) throw new HttpError(409, `${w.number} changed while you were reopening it`);
  return c.json(workOrderDTO(await loadWorkOrder(db, a, w.id)));
});

workRoutes.post('/c/:company/work-orders/:id/close', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  if (w.status !== 'completed') throw new HttpError(409, 'Only a completed work order can be closed');
  const t = now();
  await db.batch([
    db.prepare("UPDATE mt_work_orders SET status = 'closed', closed_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'completed'").bind(t, t, a.companyId, w.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.closed', assetId: w.asset_id, workOrderId: w.id, summary: `Work order ${w.number} closed`, before: { status: 'completed' }, after: { status: 'closed' }, at: t }),
  ]);
  return c.json(workOrderDTO(await loadWorkOrder(db, a, w.id)));
});

workRoutes.post('/c/:company/work-orders/:id/cancel', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  assertUnlocked(w);
  const input = await body(c, z.object({ reason: zText(2000).min(1, 'Give a reason for cancelling') }));
  const t = now();
  await db.batch([
    db.prepare(`UPDATE mt_work_orders SET status = 'cancelled', cancelled_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN (${sqlList(OUTSTANDING)})`).bind(t, t, a.companyId, w.id),
    stopAllTimers(db, a.companyId, w.id, t),
    commentStmt(db, { companyId: a.companyId, workOrderId: w.id, authorId: a.userId, body: `Cancelled: ${input.reason}`, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.cancelled', assetId: w.asset_id, workOrderId: w.id, summary: `Work order ${w.number} cancelled: ${input.reason}`, before: { status: w.status }, after: { status: 'cancelled', reason: input.reason }, at: t }),
  ]);
  return c.json(workOrderDTO(await loadWorkOrder(db, a, w.id)));
});

// ------------------------------------------------------------------ tasks

/** A work order the caller may work on and that is not locked. */
async function workable(c: any) {
  const a = await requireMt(c, 'technician');
  const w = await loadWorkOrder(c.env.DB, a, c.req.param('id'));
  assertWork(a, w);
  assertUnlocked(w);
  return { a, w, db: c.env.DB as D1Database };
}

workRoutes.post('/c/:company/work-orders/:id/tasks', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ text: zText(500).min(1) }));
  const pos = await db.prepare('SELECT COALESCE(MAX(position), 0) + 1 AS p FROM mt_wo_tasks WHERE work_order_id = ?').bind(w.id).first<{ p: number }>();
  const id = newId();
  await db.batch([
    db.prepare('INSERT INTO mt_wo_tasks (id, company_id, work_order_id, position, text, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, w.id, pos?.p ?? 1, input.text, a.userId, now()),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'task.added', assetId: w.asset_id, workOrderId: w.id, summary: `Task added: ${input.text}` }),
  ]);
  return c.json({ id }, 201);
});

workRoutes.patch('/c/:company/work-orders/:id/tasks/:taskId', async (c) => {
  const { a, w, db } = await workable(c);
  const task = await db.prepare('SELECT * FROM mt_wo_tasks WHERE company_id = ? AND work_order_id = ? AND id = ?').bind(a.companyId, w.id, c.req.param('taskId')).first<any>();
  if (!task) throw notFound('Task');
  const input = await body(c, z.object({ done: z.boolean().optional(), text: zText(500).min(1).optional() }));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  if (input.done !== undefined && input.done !== !!task.done_at) {
    stmts.push(db.prepare('UPDATE mt_wo_tasks SET done_at = ?, done_by = ? WHERE id = ?').bind(input.done ? t : null, input.done ? a.userId : null, task.id));
    stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: input.done ? 'task.done' : 'task.undone', assetId: w.asset_id, workOrderId: w.id, summary: `${input.done ? 'Ticked' : 'Unticked'}: ${task.text}`, at: t }));
  }
  if (input.text !== undefined && input.text !== task.text) {
    stmts.push(db.prepare('UPDATE mt_wo_tasks SET text = ? WHERE id = ?').bind(input.text, task.id));
    stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'task.updated', assetId: w.asset_id, workOrderId: w.id, summary: `Task changed: ${input.text}`, before: { text: task.text }, after: { text: input.text }, at: t }));
  }
  if (stmts.length) await db.batch(stmts);
  return c.json({ ok: true });
});

workRoutes.delete('/c/:company/work-orders/:id/tasks/:taskId', async (c) => {
  const { a, w, db } = await workable(c);
  if (!isManager(a)) deny('Only supervisors and administrators can remove tasks');
  const task = await db.prepare('SELECT * FROM mt_wo_tasks WHERE company_id = ? AND work_order_id = ? AND id = ?').bind(a.companyId, w.id, c.req.param('taskId')).first<any>();
  if (!task) throw notFound('Task');
  await db.batch([
    db.prepare('DELETE FROM mt_wo_tasks WHERE id = ?').bind(task.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'task.removed', assetId: w.asset_id, workOrderId: w.id, summary: `Task removed: ${task.text}`, before: { text: task.text, done: !!task.done_at } }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ parts lines

const partSchema = z.object({ part: zText(200).min(1), quantity: z.number().positive().max(1e6) });

workRoutes.post('/c/:company/work-orders/:id/parts', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, partSchema);
  const pos = await db.prepare('SELECT COALESCE(MAX(position), 0) + 1 AS p FROM mt_wo_parts WHERE work_order_id = ?').bind(w.id).first<{ p: number }>();
  const id = newId();
  await db.batch([
    db.prepare('INSERT INTO mt_wo_parts (id, company_id, work_order_id, position, part, quantity, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, w.id, pos?.p ?? 1, input.part, input.quantity, a.userId, now()),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'part.added', assetId: w.asset_id, workOrderId: w.id, summary: `Part added: ${input.quantity} × ${input.part}`, after: input }),
  ]);
  return c.json({ id }, 201);
});

workRoutes.patch('/c/:company/work-orders/:id/parts/:partId', async (c) => {
  const { a, w, db } = await workable(c);
  const part = await db.prepare('SELECT * FROM mt_wo_parts WHERE company_id = ? AND work_order_id = ? AND id = ?').bind(a.companyId, w.id, c.req.param('partId')).first<any>();
  if (!part) throw notFound('Part line');
  const input = await body(c, partSchema.partial());
  const next = { part: input.part ?? part.part, quantity: input.quantity ?? part.quantity };
  await db.batch([
    db.prepare('UPDATE mt_wo_parts SET part = ?, quantity = ? WHERE id = ?').bind(next.part, next.quantity, part.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'part.updated', assetId: w.asset_id, workOrderId: w.id, summary: `Part changed: ${next.quantity} × ${next.part}`, before: { part: part.part, quantity: part.quantity }, after: next }),
  ]);
  return c.json({ ok: true });
});

workRoutes.delete('/c/:company/work-orders/:id/parts/:partId', async (c) => {
  const { a, w, db } = await workable(c);
  const part = await db.prepare('SELECT * FROM mt_wo_parts WHERE company_id = ? AND work_order_id = ? AND id = ?').bind(a.companyId, w.id, c.req.param('partId')).first<any>();
  if (!part) throw notFound('Part line');
  await db.batch([
    db.prepare('DELETE FROM mt_wo_parts WHERE id = ?').bind(part.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'part.removed', assetId: w.asset_id, workOrderId: w.id, summary: `Part removed: ${part.quantity} × ${part.part}`, before: { part: part.part, quantity: part.quantity } }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ labour timer

workRoutes.post('/c/:company/work-orders/:id/timer/start', async (c) => {
  const { a, w, db } = await workable(c);
  const running = await db.prepare('SELECT id FROM mt_labour WHERE work_order_id = ? AND user_id = ? AND ended_at IS NULL').bind(w.id, a.userId).first();
  if (running) throw new HttpError(409, 'Your timer is already running on this work order');
  const t = now();
  const id = newId();
  const moves = ['open', 'assigned', 'on_hold'].includes(w.status);
  try {
    await db.batch([
      db.prepare('INSERT INTO mt_labour (id, company_id, work_order_id, user_id, started_at, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, a.companyId, w.id, a.userId, t, t),
      ...(moves
        ? [
            db.prepare(`UPDATE mt_work_orders SET status = 'in_progress', updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('open','assigned','on_hold')`).bind(t, a.companyId, w.id),
            eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.status', assetId: w.asset_id, workOrderId: w.id, summary: 'Status changed to in progress (timer started)', before: { status: w.status }, after: { status: 'in_progress' }, at: t }),
          ]
        : []),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'labour.started', assetId: w.asset_id, workOrderId: w.id, summary: 'Timer started', at: t }),
    ]);
  } catch (e) {
    // The one-running-timer index: a second start at the same moment.
    if (/UNIQUE/i.test(String((e as Error)?.message))) throw new HttpError(409, 'Your timer is already running on this work order');
    throw e;
  }
  return c.json({ id, startedAt: t }, 201);
});

workRoutes.post('/c/:company/work-orders/:id/timer/stop', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  assertWork(a, w);
  const run = await db.prepare('SELECT * FROM mt_labour WHERE work_order_id = ? AND user_id = ? AND ended_at IS NULL').bind(w.id, a.userId).first<any>();
  if (!run) throw new HttpError(409, 'Your timer is not running on this work order');
  const t = now();
  const minutes = Math.max(0, Math.round((t - run.started_at) / 60000));
  await db.batch([
    db.prepare('UPDATE mt_labour SET ended_at = ?, minutes = ? WHERE id = ? AND ended_at IS NULL').bind(t, minutes, run.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'labour.recorded', assetId: w.asset_id, workOrderId: w.id, summary: `Timer stopped: ${minutes} min recorded`, after: { minutes }, at: t }),
  ]);
  return c.json({ id: run.id, startedAt: run.started_at, endedAt: t, minutes });
});

// ------------------------------------------------------------------ notes

workRoutes.post('/c/:company/work-orders/:id/comments', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ body: zText(5000).min(1) }));
  const t = now();
  await db.batch([
    commentStmt(db, { companyId: a.companyId, workOrderId: w.id, authorId: a.userId, body: input.body, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.note', assetId: w.asset_id, workOrderId: w.id, summary: 'Note added', at: t }),
  ]);
  return c.json({ ok: true }, 201);
});
