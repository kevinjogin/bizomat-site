// BIZOMAT WHS, Release 1: the actions register (brief section 9). Corrective, preventive and improvement actions from
// any source (a hazard, an incident, an investigation, a risk assessment, by hand; later releases add inspections,
// audits, meetings, contractors and regulatory findings through the same polymorphic source). Each has a number
// (ACT-00001), a responsible person, a priority, a due date, the evidence it needs, completion, verification and closure.
//
// Statuses: open, in progress, completed (to verify), verified, closed, cancelled. The responsible person starts and
// completes their action whatever their role; completion is refused without evidence (a file on the action) when the
// action needs it. A WHS officer or manager verifies it (not effective sends it back to in progress) and closes it,
// never the person who completed it, unless they are alone in the company (the recorded exception). Overdue actions
// show in My Work and on the dashboard, and are escalated once in the app to the responsible person and the WHS
// managers (escalateOverdue, from the 15-minute run and when the dashboard opens).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { actionScope, assertPerson, assertWhs, peopleWith, requireWhs, segregation, type WhsAccess } from './access';
import {
  ACTION_KINDS,
  ACTION_SOURCES,
  ACTION_STATUS,
  HIERARCHY,
  LIVE_ACTION_SOURCES,
  PRIORITIES,
  WHS_KIND_LABEL,
  alert,
  badState,
  commentsOf,
  companyKindOf,
  eventStmt,
  filesOf,
  historyOf,
  likeOf,
  nextNumber,
  searchText,
  todayFrom,
  zDate,
  zKind,
  zLong,
  zText,
} from './util';

export const actionRoutes = new Hono<AppEnv>();

export const zActionInput = z.object({
  title: zText(200).min(1),
  description: zLong(5000).optional(),
  kind: zKind(ACTION_KINDS, 'kind of action').optional(),
  hierarchy: zKind(HIERARCHY, 'place in the hierarchy of controls').nullable().optional(),
  priority: zKind(PRIORITIES, 'priority').optional(),
  responsibleId: z.string().max(64).nullable().optional(),
  dueDate: zDate.optional(),
  evidenceRequired: z.boolean().optional(),
  evidenceNote: zLong(1000).optional(),
});
export type ActionInput = z.infer<typeof zActionInput>;

const ACTION_SELECT = `SELECT x.*, rp.name AS responsible_name, cb.name AS completed_by_name, vb.name AS verified_by_name, lb.name AS closed_by_name, mb.name AS created_by_name,
    (SELECT COUNT(*) FROM whs_files f WHERE f.company_id = x.company_id AND f.entity_type = 'action' AND f.entity_id = x.id AND f.deleted_at IS NULL) AS evidence_count
  FROM whs_actions x LEFT JOIN users rp ON rp.id = x.responsible_id LEFT JOIN users cb ON cb.id = x.completed_by LEFT JOIN users vb ON vb.id = x.verified_by
  LEFT JOIN users lb ON lb.id = x.closed_by LEFT JOIN users mb ON mb.id = x.created_by`;

export function actionDTO(x: any, today: string) {
  const open = x.status === 'open' || x.status === 'in_progress';
  return {
    id: x.id,
    number: x.number,
    title: x.title,
    description: x.description,
    kind: x.kind,
    kindLabel: WHS_KIND_LABEL(ACTION_KINDS, x.kind),
    sourceType: x.source_type,
    sourceLabel: WHS_KIND_LABEL(ACTION_SOURCES, x.source_type),
    sourceId: x.source_id,
    sourceNumber: x.source_number ?? null,
    hierarchy: x.hierarchy,
    hierarchyLabel: WHS_KIND_LABEL(HIERARCHY, x.hierarchy),
    priority: x.priority,
    priorityLabel: WHS_KIND_LABEL(PRIORITIES, x.priority),
    responsibleId: x.responsible_id,
    responsibleName: x.responsible_name ?? null,
    dueDate: x.due_date,
    overdue: open && !!x.due_date && x.due_date < today,
    evidenceRequired: !!x.evidence_required,
    evidenceNote: x.evidence_note,
    evidenceCount: Number(x.evidence_count ?? 0),
    status: x.status,
    statusLabel: WHS_KIND_LABEL(ACTION_STATUS, x.status),
    confidential: !!x.confidential,
    startedAt: x.started_at,
    completedAt: x.completed_at,
    completedByName: x.completed_by_name ?? null,
    completionNote: x.completion_note,
    verifiedAt: x.verified_at,
    verifiedByName: x.verified_by_name ?? null,
    verificationNote: x.verification_note,
    verifySod: !!x.verify_sod,
    closedAt: x.closed_at,
    closedByName: x.closed_by_name ?? null,
    closureNote: x.closure_note,
    closeSod: !!x.close_sod,
    createdAt: x.created_at,
    createdById: x.created_by,
    createdByName: x.created_by_name ?? null,
  };
}

/** The number of the record an action came from, when it is a WHS record of the company. */
async function sourceNumber(db: D1Database, companyId: string, type: string, id: string | null): Promise<string | null> {
  if (!id) return null;
  const table = type === 'hazard' ? 'whs_hazards' : type === 'incident' ? 'whs_incidents' : type === 'investigation' ? 'whs_investigations' : type === 'risk_assessment' ? 'whs_risk_assessments' : null;
  if (!table) return null;
  const r = await db.prepare(`SELECT number FROM ${table} WHERE company_id = ? AND id = ?`).bind(companyId, id).first<{ number: string }>();
  return r?.number ?? null;
}

/**
 * Statements that make one action from `source` (the caller adds them to its own batch, so the action and the step
 * that raised it are one transaction). Checks the responsible person is in the company.
 */
export async function newActionStmts(db: D1Database, a: WhsAccess, input: ActionInput, source: { type: string; id: string | null; confidential?: boolean }, t = now()) {
  await assertPerson(db, a, input.responsibleId, 'The responsible person');
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'action');
  const stmts = [
    db
      .prepare(
        `INSERT INTO whs_actions (id, company_id, number, title, description, kind, source_type, source_id, hierarchy, priority, responsible_id, due_date, evidence_required, evidence_note, status, confidential, created_by, search, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.companyId, number, input.title, input.description ?? '', input.kind ?? 'corrective', source.type, source.id, input.hierarchy ?? null, input.priority ?? 'medium', input.responsibleId ?? null, input.dueDate ?? null, input.evidenceRequired ? 1 : 0, input.evidenceNote ?? '', source.confidential ? 1 : 0, a.userId, searchText(number, input.title, input.description), t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'action.created', entityType: 'action', entityId: id, summary: `${number} raised: ${input.title}`, after: { source: source.type, sourceId: source.id, responsible: input.responsibleId ?? null, due: input.dueDate ?? null, evidenceRequired: !!input.evidenceRequired }, at: t }),
  ];
  return { id, number, stmts };
}

/** Tells the responsible person, in the app, that an action is theirs (never themselves). */
export async function alertAssigned(env: Env, a: WhsAccess, action: { id: string; number: string; title: string; responsibleId?: string | null }) {
  if (!action.responsibleId || action.responsibleId === a.userId) return;
  await alert(env, { companyId: a.companyId, companyName: a.companyName, demo: a.kind === 'demo', userIds: [action.responsibleId], kind: 'assigned', title: `${action.number} is yours: ${action.title}`, link: `/c/${a.companyId}/whs/actions/${action.id}`, entityType: 'action', entityId: action.id, dedupe: `assigned:${action.id}:${action.responsibleId}` });
}

async function loadAction(db: D1Database, a: WhsAccess, id: string) {
  const scope = actionScope(a, 'x');
  const x = await db.prepare(`${ACTION_SELECT} WHERE x.company_id = ? AND x.id = ? AND ${scope.sql}`).bind(a.companyId, id, ...scope.args).first<any>();
  if (!x) throw notFound('Action');
  x.source_number = await sourceNumber(db, a.companyId, x.source_type, x.source_id);
  return x;
}

export async function actionsOf(db: D1Database, a: WhsAccess, sourceType: string, sourceId: string, today: string) {
  const scope = actionScope(a, 'x');
  const rows = await db.prepare(`${ACTION_SELECT} WHERE x.company_id = ? AND x.source_type = ? AND x.source_id = ? AND ${scope.sql} ORDER BY x.created_at`).bind(a.companyId, sourceType, sourceId, ...scope.args).all<any>();
  return rows.results.map((x) => actionDTO(x, today));
}

const mine = (a: WhsAccess, x: any) => x.responsible_id === a.userId;

// ------------------------------------------------------------------ routes

actionRoutes.get('/c/:company/actions', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const scope = actionScope(a, 'x');
  const where = ['x.company_id = ?', scope.sql];
  const args: unknown[] = [a.companyId, ...scope.args];
  const status = c.req.query('status');
  if (status === 'open') where.push("x.status IN ('open', 'in_progress')");
  else if (status === 'to_verify') where.push("x.status = 'completed'");
  else if (status && Object.hasOwn(ACTION_STATUS, status)) {
    where.push('x.status = ?');
    args.push(status);
  }
  if (c.req.query('overdue') === '1') {
    where.push("x.status IN ('open', 'in_progress') AND x.due_date IS NOT NULL AND x.due_date < ?");
    args.push(today);
  }
  if (c.req.query('mine') === '1') {
    where.push('x.responsible_id = ?');
    args.push(a.userId);
  }
  const source = c.req.query('source');
  if (source && Object.hasOwn(ACTION_SOURCES, source)) {
    where.push('x.source_type = ?');
    args.push(source);
  }
  const q = c.req.query('q');
  if (q?.trim()) {
    where.push('x.search LIKE ?');
    args.push(likeOf(q));
  }
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 100, 1), 500);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);
  const [rows, total] = await db.batch([
    db.prepare(`${ACTION_SELECT} WHERE ${where.join(' AND ')} ORDER BY CASE WHEN x.status IN ('open','in_progress') THEN 0 ELSE 1 END, COALESCE(x.due_date, '9999') , x.created_at DESC LIMIT ? OFFSET ?`).bind(...args, limit, offset),
    db.prepare(`SELECT COUNT(*) AS n FROM whs_actions x WHERE ${where.join(' AND ')}`).bind(...args),
  ]);
  const list = await Promise.all((rows.results as any[]).map(async (x) => ({ ...actionDTO({ ...x, source_number: await sourceNumber(db, a.companyId, x.source_type, x.source_id) }, today) })));
  if (c.req.query('format') === 'csv') {
    const { csvResponse } = await import('../erp/util');
    return csvResponse(`whs-actions-${today}`, [
      ['Number', 'Title', 'Source', 'Source number', 'Kind', 'Hierarchy of controls', 'Priority', 'Responsible', 'Due', 'Overdue', 'Evidence required', 'Evidence files', 'Status', 'Completed', 'Verified', 'Closed'],
      ...list.map((x) => [x.number, x.title, x.sourceLabel, x.sourceNumber ?? '', x.kindLabel, x.hierarchyLabel, x.priorityLabel, x.responsibleName ?? '', x.dueDate ?? '', x.overdue ? 'yes' : 'no', x.evidenceRequired ? 'yes' : 'no', x.evidenceCount, x.statusLabel, x.completedAt ? new Date(x.completedAt).toISOString().slice(0, 10) : '', x.verifiedAt ? new Date(x.verifiedAt).toISOString().slice(0, 10) : '', x.closedAt ? new Date(x.closedAt).toISOString().slice(0, 10) : '']),
    ]);
  }
  return c.json({ actions: list, total: Number((total.results[0] as any)?.n ?? 0), limit, offset });
});

actionRoutes.post('/c/:company/actions', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const input = await body(c, zActionInput.extend({ sourceType: zKind(ACTION_SOURCES, 'source'), sourceId: z.string().max(64).nullable().optional() }));
  if (!(LIVE_ACTION_SOURCES as readonly string[]).includes(input.sourceType)) throw new HttpError(400, `${WHS_KIND_LABEL(ACTION_SOURCES, input.sourceType)} records come in a later release: raise this action by hand (source Other) for now`);
  let confidential = false;
  if (input.sourceType !== 'other') {
    if (!input.sourceId) throw new HttpError(400, 'Say which record the action comes from');
    const table = { hazard: 'whs_hazards', incident: 'whs_incidents', investigation: 'whs_investigations', risk_assessment: 'whs_risk_assessments' }[input.sourceType as 'hazard'];
    const src = await db.prepare(`SELECT * FROM ${table} WHERE company_id = ? AND id = ?`).bind(a.companyId, input.sourceId).first<any>();
    if (!src) throw new HttpError(400, 'The source record must be one of this company’s');
    if (src.confidential) {
      assertWhs(a, 'confidential');
      confidential = true;
    }
  }
  const made = await newActionStmts(db, a, input, { type: input.sourceType, id: input.sourceType === 'other' ? null : input.sourceId!, confidential });
  await db.batch(made.stmts);
  await alertAssigned(c.env, a, { id: made.id, number: made.number, title: input.title, responsibleId: input.responsibleId });
  return c.json(actionDTO(await loadAction(db, a, made.id), todayFrom(c.req.query('today'))), 201);
});

actionRoutes.get('/c/:company/actions/:id', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const x = await loadAction(db, a, c.req.param('id'));
  return c.json({
    action: actionDTO(x, todayFrom(c.req.query('today'))),
    files: await filesOf(db, a.companyId, 'action', x.id),
    comments: await commentsOf(db, a.companyId, 'action', x.id),
    history: await historyOf(db, a.companyId, 'action', x.id),
    can: {
      edit: a.can.assess && !['closed', 'cancelled'].includes(x.status),
      start: (a.can.assess || mine(a, x)) && x.status === 'open',
      complete: (a.can.assess || mine(a, x)) && (x.status === 'open' || x.status === 'in_progress'),
      evidence: (a.can.assess || mine(a, x)) && !['closed', 'cancelled'].includes(x.status),
      verify: a.can.assess && x.status === 'completed',
      close: a.can.assess && x.status === 'verified',
      cancel: a.can.assess && ['open', 'in_progress', 'completed'].includes(x.status),
    },
  });
});

actionRoutes.patch('/c/:company/actions/:id', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const x = await loadAction(db, a, c.req.param('id'));
  if (['closed', 'cancelled'].includes(x.status)) badState(`${x.number} is ${x.status}: it is not changed any more`);
  const input = await body(c, zActionInput.partial());
  await assertPerson(db, a, input.responsibleId, 'The responsible person');
  const next = {
    title: input.title ?? x.title,
    description: input.description ?? x.description,
    kind: input.kind ?? x.kind,
    hierarchy: input.hierarchy === undefined ? x.hierarchy : input.hierarchy,
    priority: input.priority ?? x.priority,
    responsible_id: input.responsibleId === undefined ? x.responsible_id : input.responsibleId,
    due_date: input.dueDate === undefined ? x.due_date : input.dueDate,
    evidence_required: input.evidenceRequired === undefined ? x.evidence_required : input.evidenceRequired ? 1 : 0,
    evidence_note: input.evidenceNote ?? x.evidence_note,
  };
  const before = Object.fromEntries(Object.keys(next).map((k) => [k, x[k]]));
  const t = now();
  await db.batch([
    db
      .prepare('UPDATE whs_actions SET title = ?, description = ?, kind = ?, hierarchy = ?, priority = ?, responsible_id = ?, due_date = ?, evidence_required = ?, evidence_note = ?, escalated_at = CASE WHEN ? IS NOT due_date THEN NULL ELSE escalated_at END, search = ?, updated_at = ? WHERE company_id = ? AND id = ?')
      .bind(next.title, next.description, next.kind, next.hierarchy, next.priority, next.responsible_id, next.due_date, next.evidence_required, next.evidence_note, next.due_date, searchText(x.number, next.title, next.description), t, a.companyId, x.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'action.changed', entityType: 'action', entityId: x.id, summary: `${x.number} changed`, before, after: next, at: t }),
  ]);
  if (next.responsible_id !== x.responsible_id) await alertAssigned(c.env, a, { id: x.id, number: x.number, title: next.title, responsibleId: next.responsible_id });
  return c.json(actionDTO(await loadAction(db, a, x.id), todayFrom(c.req.query('today'))));
});

async function move(c: any, a: WhsAccess, x: any, from: string[], to: string, set: { sql: string; args: unknown[] }, summary: string, after: Record<string, unknown> = {}) {
  const db = c.env.DB as D1Database;
  if (!from.includes(x.status)) badState(`${x.number} is ${WHS_KIND_LABEL(ACTION_STATUS, x.status).toLowerCase()}`);
  const t = now();
  const res = await db.batch([
    db.prepare(`UPDATE whs_actions SET status = ?, ${set.sql}updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`).bind(to, ...set.args, t, a.companyId, x.id, x.status),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `action.${to}`, entityType: 'action', entityId: x.id, summary, before: { status: x.status }, after: { status: to, ...after }, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This action changed at the same moment: refresh and try again');
  return c.json(actionDTO(await loadAction(db, a, x.id), todayFrom(c.req.query('today'))));
}

actionRoutes.post('/c/:company/actions/:id/start', async (c) => {
  const a = await requireWhs(c);
  const x = await loadAction(c.env.DB, a, c.req.param('id'));
  if (!a.can.assess && !mine(a, x)) throw new HttpError(403, 'Only the responsible person or a WHS officer or manager can start this action');
  return move(c, a, x, ['open'], 'in_progress', { sql: 'started_at = ?, ', args: [now()] }, `${x.number} started`);
});

actionRoutes.post('/c/:company/actions/:id/complete', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const x = await loadAction(db, a, c.req.param('id'));
  if (!a.can.assess && !mine(a, x)) throw new HttpError(403, 'Only the responsible person or a WHS officer or manager can complete this action');
  const input = await body(c, z.object({ note: zLong(5000).min(1, 'Say what was done') }));
  // the evidence rule: a file on the action, checked on the server when the action needs evidence
  if (x.evidence_required && Number(x.evidence_count ?? 0) === 0) throw new HttpError(409, `${x.number} needs evidence before it is completed: add a photo or document${x.evidence_note ? ` (${x.evidence_note})` : ''}`, { code: 'EVIDENCE_REQUIRED' });
  return move(c, a, x, ['open', 'in_progress'], 'completed', { sql: 'completed_by = ?, completed_at = ?, completion_note = ?, started_at = COALESCE(started_at, ?), ', args: [a.userId, now(), input.note, now()] }, `${x.number} completed`, { note: input.note });
});

actionRoutes.post('/c/:company/actions/:id/verify', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const x = await loadAction(db, a, c.req.param('id'));
  const input = await body(c, z.object({ effective: z.boolean(), note: zLong(2000).min(1, 'Say how it was verified') }));
  const sod = segregation(a, [[x.completed_by, 'completed this action']], 'verify it');
  if (!input.effective) return move(c, a, x, ['completed'], 'in_progress', { sql: 'verification_note = ?, completed_at = NULL, completed_by = NULL, ', args: [`Not effective: ${input.note}`] }, `${x.number} checked: not effective, back in progress`, { note: input.note });
  return move(c, a, x, ['completed'], 'verified', { sql: 'verified_by = ?, verified_at = ?, verification_note = ?, verify_sod = ?, ', args: [a.userId, now(), input.note, sod ? 1 : 0] }, `${x.number} verified${sod ? ' by the person who completed it, alone in the company (recorded exception)' : ''}`, { note: input.note, exception: sod });
});

actionRoutes.post('/c/:company/actions/:id/close', async (c) => {
  const a = await requireWhs(c, 'assess');
  const x = await loadAction(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ note: zLong(2000).optional() }));
  const sod = segregation(a, [[x.completed_by, 'completed this action']], 'close it');
  return move(c, a, x, ['verified'], 'closed', { sql: 'closed_by = ?, closed_at = ?, closure_note = ?, close_sod = ?, ', args: [a.userId, now(), input.note ?? '', sod ? 1 : 0] }, `${x.number} closed${sod ? ' (recorded one-person exception)' : ''}`);
});

actionRoutes.post('/c/:company/actions/:id/cancel', async (c) => {
  const a = await requireWhs(c, 'assess');
  const x = await loadAction(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ reason: zLong(1000).min(1, 'Say why') }));
  return move(c, a, x, ['open', 'in_progress', 'completed'], 'cancelled', { sql: 'closure_note = ?, closed_by = ?, closed_at = ?, ', args: [input.reason, a.userId, now()] }, `${x.number} cancelled: ${input.reason}`);
});

// ------------------------------------------------------------------ overdue escalation

/**
 * Overdue actions (open or in progress after their due date), escalated once each in the app to the responsible
 * person and the WHS managers (ERP administrators where nobody is a WHS manager). `companyId` limits it to one company.
 */
export async function escalateOverdue(env: Env, today: string, companyId?: string, limit = 200): Promise<number> {
  const db = env.DB;
  const rows = await db
    .prepare(
      `SELECT x.id, x.company_id, x.number, x.title, x.responsible_id, x.due_date, x.confidential FROM whs_actions x
        WHERE x.status IN ('open', 'in_progress') AND x.due_date IS NOT NULL AND x.due_date < ? AND x.escalated_at IS NULL ${companyId ? 'AND x.company_id = ?' : ''}
        ORDER BY x.due_date LIMIT ?`,
    )
    .bind(...(companyId ? [today, companyId, limit] : [today, limit]))
    .all<any>();
  let n = 0;
  const managers = new Map<string, string[]>();
  for (const x of rows.results) {
    if (!managers.has(x.company_id)) {
      const kind = await companyKindOf(db, x.company_id);
      // confidential sources go to the people who read confidential reports
      managers.set(x.company_id, await peopleWith(db, { companyId: x.company_id, kind }, ['whs_manager']));
    }
    const kind = await companyKindOf(db, x.company_id);
    const confReaders = x.confidential ? await peopleWith(db, { companyId: x.company_id, kind }, ['whs_manager', 'health_officer']) : null;
    const to = [x.responsible_id, ...(confReaders ?? managers.get(x.company_id)!)].filter(Boolean);
    const t = now();
    const claim = await db.prepare('UPDATE whs_actions SET escalated_at = ? WHERE company_id = ? AND id = ? AND escalated_at IS NULL').bind(t, x.company_id, x.id).run();
    if (!claim.meta.changes) continue;
    await alert(env, {
      companyId: x.company_id,
      companyName: '',
      demo: true, // in the app only
      userIds: to,
      kind: 'overdue_action',
      title: `${x.number} is overdue (due ${x.due_date})`,
      body: x.confidential ? 'A confidential action is overdue.' : x.title,
      link: `/c/${x.company_id}/whs/actions/${x.id}`,
      entityType: 'action',
      entityId: x.id,
      dedupe: `overdue:${x.id}:${x.due_date}`,
    });
    await db.batch([eventStmt(db, { companyId: x.company_id, actorId: null, action: 'action.escalated', entityType: 'action', entityId: x.id, summary: `${x.number} overdue since ${x.due_date}: escalated to the responsible person and the WHS managers`, at: t })]);
    n++;
  }
  return n;
}
