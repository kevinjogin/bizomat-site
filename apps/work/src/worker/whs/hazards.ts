// BIZOMAT WHS, Release 1: the hazard register (brief section 5). Every person in the company may report a hazard (a
// short form first, made for a phone, with photos) and follows their own reports. The workflow: Reported, Assessment
// (rated on the company's risk matrix by a WHS officer), Controls assigned (the proposed controls, and actions tagged with
// the hierarchy of controls), Control implementation, Verification (every action from it done), Closed (with the
// verification note and the residual risk). A hazard links to risk assessments, incidents, Maintenance work orders
// (read only) and its actions. Psychosocial, violence and fatigue hazards may be marked confidential.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, andAll, body, newId, notFound, now } from '../lib/util';
import { assertPerson, assertWhs, hazardScope, requireWhs, type WhsAccess } from './access';
import { actionsOf, alertAssigned, newActionStmts, zActionInput } from './actions';
import {
  HAZARD_CATEGORIES,
  HAZARD_STATUS,
  LOWER_ORDER,
  REF_COLUMNS,
  REF_JOINS,
  WHS_KIND_LABEL,
  assetName,
  badState,
  changed,
  commentsOf,
  currentMatrix,
  departmentName,
  eventStmt,
  filesOf,
  historyOf,
  levelLabel,
  likeOf,
  linkStmt,
  linksOf,
  matrixById,
  nextNumber,
  rate,
  searchText,
  siteName,
  todayFrom,
  zDate,
  zKind,
  zLong,
  zText,
  type Matrix,
} from './util';

export const hazardRoutes = new Hono<AppEnv>();

/** Categories a report may be marked confidential in (psychosocial, workplace violence, fatigue). */
export const CONFIDENTIAL_CATEGORIES: readonly string[] = ['psychosocial', 'violence', 'fatigue'];
const OPEN = ['reported', 'assessment', 'controls_assigned', 'implementation', 'verification'];

const HAZARD_SELECT = `SELECT h.*, ${REF_COLUMNS}, rp.name AS responsible_name, rb.name AS reported_by_name, ab.name AS assessed_by_name, vb.name AS verified_by_name, cb.name AS closed_by_name
  FROM whs_hazards h ${REF_JOINS('h')}
  LEFT JOIN users rp ON rp.id = h.responsible_id LEFT JOIN users rb ON rb.id = h.reported_by LEFT JOIN users ab ON ab.id = h.assessed_by
  LEFT JOIN users vb ON vb.id = h.verified_by LEFT JOIN users cb ON cb.id = h.closed_by`;

export function hazardDTO(h: any, m: Matrix | null, a: WhsAccess, today: string) {
  const high = h.risk_rank != null && m ? Number(h.risk_rank) >= m.highFrom : false;
  return {
    id: h.id,
    number: h.number,
    title: h.title,
    description: h.description,
    category: h.category,
    categoryLabel: WHS_KIND_LABEL(HAZARD_CATEGORIES, h.category),
    siteId: h.site_id,
    siteName: h.site_name ?? null,
    location: h.location,
    departmentId: h.department_id,
    departmentName: h.department_name ?? null,
    assetId: h.asset_id,
    assetLabel: h.asset_number ? `${h.asset_number} ${h.asset_name}` : null,
    activity: h.activity,
    peopleExposed: h.people_exposed,
    consequenceText: h.consequence_text,
    existingControls: h.existing_controls,
    proposedControls: h.proposed_controls,
    likelihood: h.likelihood,
    consequence: h.consequence,
    riskLevel: h.risk_level,
    riskLabel: levelLabel(m, h.risk_level),
    riskRank: h.risk_rank,
    high,
    residualLikelihood: h.residual_likelihood,
    residualConsequence: h.residual_consequence,
    residualLevel: h.residual_level,
    residualLabel: levelLabel(m, h.residual_level),
    responsibleId: h.responsible_id,
    responsibleName: h.responsible_name ?? null,
    dueDate: h.due_date,
    overdue: OPEN.includes(h.status) && !!h.due_date && h.due_date < today,
    status: h.status,
    statusLabel: WHS_KIND_LABEL(HAZARD_STATUS, h.status),
    confidential: !!h.confidential,
    reportedById: h.reported_by,
    reportedByName: h.reported_by_name ?? null,
    reportedAt: h.created_at,
    assessedAt: h.assessed_at,
    assessedByName: h.assessed_by_name ?? null,
    verifiedAt: h.verified_at,
    verifiedByName: h.verified_by_name ?? null,
    verificationNote: h.verification_note,
    closedAt: h.closed_at,
    closureNote: h.closure_note,
    mine: h.reported_by === a.userId,
  };
}

async function loadHazard(db: D1Database, a: WhsAccess, id: string) {
  const scope = hazardScope(a, 'h');
  const h = await db.prepare(`${HAZARD_SELECT} WHERE h.company_id = ? AND h.id = ? AND ${scope.sql}`).bind(a.companyId, id, ...scope.args).first<any>();
  if (!h) throw notFound('Hazard');
  return h;
}

const zReport = z.object({
  title: zText(200).min(1, 'Give the hazard a short title'),
  description: zLong(5000).optional(),
  category: zKind(HAZARD_CATEGORIES, 'hazard category'),
  siteId: z.string().max(64).nullable().optional(),
  location: zText(300).optional(),
  departmentId: z.string().max(64).nullable().optional(),
  assetId: z.string().max(64).nullable().optional(),
  activity: zText(500).optional(),
  peopleExposed: zText(500).optional(),
  consequenceText: zLong(2000).optional(),
  existingControls: zLong(2000).optional(),
  proposedControls: zLong(2000).optional(),
  confidential: z.boolean().optional(),
});

hazardRoutes.get('/c/:company/hazards', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const scope = hazardScope(a, 'h');
  const where: string[] = [scope.sql];
  const args: unknown[] = [a.companyId, ...scope.args];
  const add = (sql: string, ...xs: unknown[]) => {
    where.push(sql);
    args.push(...xs);
  };
  const status = c.req.query('status');
  if (status === 'open') add(`h.status IN (${OPEN.map(() => '?').join(',')})`, ...OPEN);
  else if (status && Object.hasOwn(HAZARD_STATUS, status)) add('h.status = ?', status);
  const category = c.req.query('category');
  if (category && Object.hasOwn(HAZARD_CATEGORIES, category)) add('h.category = ?', category);
  if (c.req.query('site')) add('h.site_id = ?', c.req.query('site'));
  if (c.req.query('department')) add('h.department_id = ?', c.req.query('department'));
  if (c.req.query('level')) add('h.risk_level = ?', c.req.query('level'));
  if (c.req.query('mine') === '1') add('(h.reported_by = ? OR h.responsible_id = ?)', a.userId, a.userId);
  const q = c.req.query('q');
  if (q?.trim()) add('h.search LIKE ?', likeOf(q));
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 100, 1), 500);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);
  const [rows, total] = await db.batch([
    db.prepare(`${HAZARD_SELECT} WHERE h.company_id = ?${andAll(where)} ORDER BY CASE WHEN h.status IN ('closed','cancelled') THEN 1 ELSE 0 END, COALESCE(h.risk_rank, 0) DESC, h.created_at DESC LIMIT ? OFFSET ?`).bind(...args, limit, offset),
    db.prepare(`SELECT COUNT(*) AS n FROM whs_hazards h WHERE h.company_id = ?${andAll(where)}`).bind(...args),
  ]);
  const list = [];
  for (const h of rows.results as any[]) list.push(hazardDTO(h, await matrixById(db, a.companyId, h.matrix_id), a, today));
  if (c.req.query('format') === 'csv') {
    const { csvResponse } = await import('../erp/util');
    return csvResponse(`whs-hazard-register-${today}`, [
      ['Number', 'Title', 'Category', 'Site', 'Location', 'Department', 'Asset', 'Likelihood', 'Consequence', 'Initial risk', 'Residual risk', 'Responsible', 'Due', 'Status', 'Reported', 'Reported by', 'Confidential'],
      ...list.map((h) => [h.number, h.confidential && !a.can.confidential ? '(confidential)' : h.title, h.categoryLabel, h.siteName ?? '', h.location, h.departmentName ?? '', h.assetLabel ?? '', h.likelihood ?? '', h.consequence ?? '', h.riskLabel, h.residualLabel, h.responsibleName ?? '', h.dueDate ?? '', h.statusLabel, new Date(h.reportedAt).toISOString().slice(0, 10), h.reportedByName ?? '', h.confidential ? 'yes' : 'no']),
    ]);
  }
  return c.json({ hazards: list, total: Number((total.results[0] as any)?.n ?? 0), limit, offset });
});

/** Report a hazard: every person in the company. */
hazardRoutes.post('/c/:company/hazards', async (c) => {
  const a = await requireWhs(c, 'report');
  const db = c.env.DB;
  const input = await body(c, zReport);
  if (input.confidential && !CONFIDENTIAL_CATEGORIES.includes(input.category)) throw new HttpError(400, 'Only psychosocial, workplace violence and fatigue reports can be marked confidential');
  await siteName(db, a.companyId, input.siteId);
  await departmentName(db, a.companyId, input.departmentId);
  await assetName(db, a.companyId, input.assetId);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'hazard');
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO whs_hazards (id, company_id, number, title, description, category, site_id, location, department_id, asset_id, activity, people_exposed, consequence_text, existing_controls, proposed_controls, status, confidential, reported_by, search, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'reported', ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.companyId, number, input.title, input.description ?? '', input.category, input.siteId ?? null, input.location ?? '', input.departmentId ?? null, input.assetId ?? null, input.activity ?? '', input.peopleExposed ?? '', input.consequenceText ?? '', input.existingControls ?? '', input.proposedControls ?? '', input.confidential ? 1 : 0, a.userId, searchText(number, input.title, input.description, input.location), t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'hazard.reported', entityType: 'hazard', entityId: id, summary: `${number} reported${input.confidential ? ' (confidential)' : `: ${input.title}`}`, at: t }),
  ]);
  return c.json(hazardDTO(await loadHazard(db, a, id), null, a, todayFrom(c.req.query('today'))), 201);
});

hazardRoutes.get('/c/:company/hazards/:id', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const h = await loadHazard(db, a, c.req.param('id'));
  const m = await matrixById(db, a.companyId, h.matrix_id);
  const full = a.can.view || h.responsible_id === a.userId;
  const actions = await actionsOf(db, a, 'hazard', h.id, today);
  return c.json({
    hazard: hazardDTO(h, m, a, today),
    matrix: full ? (m ?? (await currentMatrix(db, a.companyId, a.userId)).matrix) : null,
    actions,
    links: full ? await linksOf(db, a, 'hazard', h.id) : [],
    files: await filesOf(db, a.companyId, 'hazard', h.id),
    comments: full ? await commentsOf(db, a.companyId, 'hazard', h.id) : [],
    history: full ? await historyOf(db, a.companyId, 'hazard', h.id) : [],
    warnings: controlWarnings(h, m, actions),
    can: {
      edit: a.can.assess || (h.reported_by === a.userId && h.status === 'reported'),
      assess: a.can.assess && OPEN.includes(h.status),
      advance: a.can.assess || h.responsible_id === a.userId,
      close: a.can.assess && h.status === 'verification',
      link: a.can.assess,
      addFiles: h.status !== 'closed' && h.status !== 'cancelled',
      comment: a.can.view,
      consult: a.can.consult,
    },
  });
});

/** The hierarchy-of-controls warning: a high risk controlled only by administrative controls and PPE (or nothing yet). */
function controlWarnings(h: any, m: Matrix | null, actions: { hierarchy: string | null; status: string }[]): string[] {
  if (!m || h.risk_rank == null || Number(h.risk_rank) < m.highFrom) return [];
  const tagged = actions.filter((x) => x.status !== 'cancelled' && x.hierarchy);
  if (h.status === 'reported' || h.status === 'assessment') return [];
  if (!tagged.length || tagged.every((x) => LOWER_ORDER.includes(x.hierarchy!))) {
    return [`${levelLabel(m, h.risk_level)} risk with ${tagged.length ? 'only administrative controls and PPE' : 'no control tagged in the hierarchy of controls'}: look for elimination, substitution, isolation or engineering controls first.`];
  }
  return [];
}

hazardRoutes.patch('/c/:company/hazards/:id', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const h = await loadHazard(db, a, c.req.param('id'));
  if (!a.can.assess && !(h.reported_by === a.userId && h.status === 'reported')) throw new HttpError(403, 'Only a WHS officer or manager can change this hazard now');
  if (h.status === 'closed' || h.status === 'cancelled') badState(`${h.number} is ${h.status}`);
  const input = await body(c, zReport.partial().extend({ responsibleId: z.string().max(64).nullable().optional(), dueDate: zDate.optional() }));
  if (input.responsibleId !== undefined || input.dueDate !== undefined) assertWhs(a, 'assess');
  const category = input.category ?? h.category;
  const confidential = input.confidential === undefined ? !!h.confidential : input.confidential;
  if (confidential && !CONFIDENTIAL_CATEGORIES.includes(category)) throw new HttpError(400, 'Only psychosocial, workplace violence and fatigue reports can be marked confidential');
  if (input.siteId !== undefined) await siteName(db, a.companyId, input.siteId);
  if (input.departmentId !== undefined) await departmentName(db, a.companyId, input.departmentId);
  if (input.assetId !== undefined) await assetName(db, a.companyId, input.assetId);
  await assertPerson(db, a, input.responsibleId, 'The responsible person');
  const next: Record<string, unknown> = {
    title: input.title ?? h.title,
    description: input.description ?? h.description,
    category,
    site_id: input.siteId === undefined ? h.site_id : input.siteId,
    location: input.location ?? h.location,
    department_id: input.departmentId === undefined ? h.department_id : input.departmentId,
    asset_id: input.assetId === undefined ? h.asset_id : input.assetId,
    activity: input.activity ?? h.activity,
    people_exposed: input.peopleExposed ?? h.people_exposed,
    consequence_text: input.consequenceText ?? h.consequence_text,
    existing_controls: input.existingControls ?? h.existing_controls,
    proposed_controls: input.proposedControls ?? h.proposed_controls,
    confidential: confidential ? 1 : 0,
    responsible_id: input.responsibleId === undefined ? h.responsible_id : input.responsibleId,
    due_date: input.dueDate === undefined ? h.due_date : input.dueDate,
  };
  const diff = changed(h, next);
  if (!diff.any) return c.json(hazardDTO(h, await matrixById(db, a.companyId, h.matrix_id), a, todayFrom(c.req.query('today'))));
  const t = now();
  await db.batch([
    db
      .prepare(
        `UPDATE whs_hazards SET title = ?, description = ?, category = ?, site_id = ?, location = ?, department_id = ?, asset_id = ?, activity = ?, people_exposed = ?, consequence_text = ?, existing_controls = ?, proposed_controls = ?,
           confidential = ?, responsible_id = ?, due_date = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ?`,
      )
      .bind(next.title, next.description, next.category, next.site_id, next.location, next.department_id, next.asset_id, next.activity, next.people_exposed, next.consequence_text, next.existing_controls, next.proposed_controls, next.confidential, next.responsible_id, next.due_date, searchText(h.number, next.title as string, next.description as string, next.location as string), t, a.companyId, h.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'hazard.changed', entityType: 'hazard', entityId: h.id, summary: `${h.number} changed`, before: diff.before, after: diff.after, at: t }),
  ]);
  if (next.responsible_id && next.responsible_id !== h.responsible_id) await alertAssigned(c.env, a, { id: h.id, number: h.number, title: String(next.title), responsibleId: next.responsible_id as string });
  return c.json(hazardDTO(await loadHazard(db, a, h.id), await matrixById(db, a.companyId, h.matrix_id), a, todayFrom(c.req.query('today'))));
});

/** Assess: rate the hazard on the company's current risk matrix (the matrix version is kept with the rating). */
hazardRoutes.post('/c/:company/hazards/:id/assess', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const h = await loadHazard(db, a, c.req.param('id'));
  if (!OPEN.includes(h.status)) badState(`${h.number} is ${h.status}`);
  const input = await body(c, z.object({ likelihood: z.number().int().min(1).max(9), consequence: z.number().int().min(1).max(9), existingControls: zLong(2000).optional(), consequenceText: zLong(2000).optional(), peopleExposed: zText(500).optional(), note: zLong(2000).optional() }));
  const { id: matrixId, matrix } = await currentMatrix(db, a.companyId, a.userId);
  const level = rate(matrix, input.likelihood, input.consequence);
  const t = now();
  const status = h.status === 'reported' ? 'assessment' : h.status;
  await db.batch([
    db
      .prepare('UPDATE whs_hazards SET likelihood = ?, consequence = ?, risk_level = ?, risk_rank = ?, matrix_id = ?, existing_controls = COALESCE(?, existing_controls), consequence_text = COALESCE(?, consequence_text), people_exposed = COALESCE(?, people_exposed), status = ?, assessed_by = ?, assessed_at = ?, updated_at = ? WHERE company_id = ? AND id = ?')
      .bind(input.likelihood, input.consequence, level.key, level.rank, matrixId, input.existingControls ?? null, input.consequenceText ?? null, input.peopleExposed ?? null, status, a.userId, t, t, a.companyId, h.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'hazard.assessed', entityType: 'hazard', entityId: h.id, summary: `${h.number} rated ${level.label} (likelihood ${input.likelihood}, consequence ${input.consequence})${input.note ? `: ${input.note}` : ''}`, before: { likelihood: h.likelihood, consequence: h.consequence, risk_level: h.risk_level, status: h.status }, after: { likelihood: input.likelihood, consequence: input.consequence, risk_level: level.key, status }, at: t }),
  ]);
  return c.json(hazardDTO(await loadHazard(db, a, h.id), matrix, a, todayFrom(c.req.query('today'))));
});

/** Controls assigned: the proposed controls and the actions that carry them out (each tagged in the hierarchy). */
hazardRoutes.post('/c/:company/hazards/:id/controls', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const h = await loadHazard(db, a, c.req.param('id'));
  if (!['assessment', 'controls_assigned', 'implementation'].includes(h.status)) badState(h.status === 'reported' ? `Rate ${h.number} on the risk matrix first` : `${h.number} is ${h.status}`);
  const input = await body(c, z.object({ proposedControls: zLong(2000).optional(), responsibleId: z.string().max(64).nullable().optional(), dueDate: zDate.optional(), actions: z.array(zActionInput).max(20).optional() }));
  if (!input.proposedControls?.trim() && !input.actions?.length && !h.proposed_controls) throw new HttpError(400, 'Say which controls are proposed, or raise an action for each');
  await assertPerson(db, a, input.responsibleId, 'The responsible person');
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  const made: { id: string; number: string; title: string; responsibleId?: string | null }[] = [];
  for (const x of input.actions ?? []) {
    const r = await newActionStmts(db, a, { ...x, kind: x.kind ?? 'corrective' }, { type: 'hazard', id: h.id, confidential: !!h.confidential }, t);
    stmts.push(...r.stmts);
    made.push({ id: r.id, number: r.number, title: x.title, responsibleId: x.responsibleId });
  }
  const status = h.status === 'assessment' ? 'controls_assigned' : h.status;
  stmts.push(
    db
      .prepare('UPDATE whs_hazards SET proposed_controls = COALESCE(?, proposed_controls), responsible_id = COALESCE(?, responsible_id), due_date = COALESCE(?, due_date), status = ?, updated_at = ? WHERE company_id = ? AND id = ?')
      .bind(input.proposedControls ?? null, input.responsibleId ?? null, input.dueDate ?? null, status, t, a.companyId, h.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'hazard.controls_assigned', entityType: 'hazard', entityId: h.id, summary: `${h.number}: controls assigned${made.length ? `, actions ${made.map((m) => m.number).join(', ')}` : ''}`, before: { status: h.status, proposed_controls: h.proposed_controls }, after: { status, proposed_controls: input.proposedControls ?? h.proposed_controls, actions: made.map((m) => m.number) }, at: t }),
  );
  await db.batch(stmts);
  for (const m of made) await alertAssigned(c.env, a, m);
  if (input.responsibleId && input.responsibleId !== h.responsible_id) await alertAssigned(c.env, a, { id: h.id, number: h.number, title: h.title, responsibleId: input.responsibleId });
  const today = todayFrom(c.req.query('today'));
  const fresh = await loadHazard(db, a, h.id);
  const m = await matrixById(db, a.companyId, fresh.matrix_id);
  return c.json({ hazard: hazardDTO(fresh, m, a, today), warnings: controlWarnings(fresh, m, await actionsOf(db, a, 'hazard', h.id, today)) });
});

/** The later steps: implementation, verification, closure (with the verification note and residual rating), cancel, reopen. */
hazardRoutes.post('/c/:company/hazards/:id/advance', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const h = await loadHazard(db, a, c.req.param('id'));
  const input = await body(c, z.object({ to: z.enum(['implementation', 'verification', 'closed', 'cancelled', 'reopen']), note: zLong(2000).optional(), residualLikelihood: z.number().int().min(1).max(9).optional(), residualConsequence: z.number().int().min(1).max(9).optional() }));
  const responsible = h.responsible_id === a.userId;
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let to: string = input.to;
  let set = '';
  let args: unknown[] = [];
  if (input.to === 'implementation') {
    if (!a.can.assess && !responsible) throw new HttpError(403, 'Only the responsible person or a WHS officer or manager can do that');
    if (h.status !== 'controls_assigned') badState(`Assign the controls of ${h.number} first`);
  } else if (input.to === 'verification') {
    if (!a.can.assess && !responsible) throw new HttpError(403, 'Only the responsible person or a WHS officer or manager can do that');
    if (!['controls_assigned', 'implementation'].includes(h.status)) badState(`${h.number} is ${h.status}`);
    const open = await db.prepare("SELECT number FROM whs_actions WHERE company_id = ? AND source_type = 'hazard' AND source_id = ? AND status IN ('open', 'in_progress')").bind(a.companyId, h.id).all<{ number: string }>();
    if (open.results.length) badState(`Finish the actions first: ${open.results.map((x) => x.number).join(', ')}`);
  } else if (input.to === 'closed') {
    assertWhs(a, 'assess');
    if (h.status !== 'verification') badState(`${h.number} must be in verification to close it`);
    if (!input.note?.trim()) throw new HttpError(400, 'Say how the controls were verified');
    const waiting = await db.prepare("SELECT number FROM whs_actions WHERE company_id = ? AND source_type = 'hazard' AND source_id = ? AND status IN ('open', 'in_progress', 'completed')").bind(a.companyId, h.id).all<{ number: string }>();
    if (waiting.results.length) badState(`Verify the actions first: ${waiting.results.map((x) => x.number).join(', ')}`);
    set = 'verified_by = ?, verified_at = ?, verification_note = ?, closed_by = ?, closed_at = ?, closure_note = ?, ';
    args = [a.userId, t, input.note, a.userId, t, input.note];
    if (input.residualLikelihood && input.residualConsequence) {
      const m = (await matrixById(db, a.companyId, h.matrix_id)) ?? (await currentMatrix(db, a.companyId, a.userId)).matrix;
      const level = rate(m, input.residualLikelihood, input.residualConsequence);
      set += 'residual_likelihood = ?, residual_consequence = ?, residual_level = ?, residual_rank = ?, ';
      args.push(input.residualLikelihood, input.residualConsequence, level.key, level.rank);
    }
  } else if (input.to === 'cancelled') {
    assertWhs(a, 'assess');
    if (!OPEN.includes(h.status)) badState(`${h.number} is ${h.status}`);
    if (!input.note?.trim()) throw new HttpError(400, 'Say why');
    set = 'closure_note = ?, closed_by = ?, closed_at = ?, ';
    args = [input.note, a.userId, t];
  } else {
    assertWhs(a, 'approve');
    if (h.status !== 'closed' && h.status !== 'cancelled') badState(`${h.number} is not closed`);
    to = h.risk_level ? 'assessment' : 'reported';
    set = 'closed_at = NULL, closed_by = NULL, ';
  }
  stmts.push(
    db.prepare(`UPDATE whs_hazards SET status = ?, ${set}updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`).bind(to, ...args, t, a.companyId, h.id, h.status),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `hazard.${input.to}`, entityType: 'hazard', entityId: h.id, summary: `${h.number}: ${input.to === 'reopen' ? 'reopened' : WHS_KIND_LABEL(HAZARD_STATUS, to).toLowerCase()}${input.note ? ` (${input.note})` : ''}`, before: { status: h.status }, after: { status: to }, at: t }),
  );
  const res = await db.batch(stmts);
  if (!res[0].meta.changes) badState('This hazard changed at the same moment: refresh and try again');
  return c.json(hazardDTO(await loadHazard(db, a, h.id), await matrixById(db, a.companyId, h.matrix_id), a, todayFrom(c.req.query('today'))));
});

/** Link a hazard to an incident, a risk assessment or a Maintenance work order of the same company. */
hazardRoutes.post('/c/:company/links', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const input = await body(c, z.object({ fromType: z.enum(['hazard', 'incident', 'risk_assessment']), fromId: z.string().max(64), toType: z.enum(['hazard', 'incident', 'risk_assessment', 'work_order']), toId: z.string().max(64), remove: z.boolean().optional() }));
  const table: Record<string, string> = { hazard: 'whs_hazards', incident: 'whs_incidents', risk_assessment: 'whs_risk_assessments', work_order: 'mt_work_orders' };
  for (const [type, id] of [[input.fromType, input.fromId], [input.toType, input.toId]] as const) {
    const row = await db.prepare(`SELECT ${type === 'work_order' ? '0' : 'confidential'} AS confidential FROM ${table[type]} WHERE company_id = ? AND id = ?`).bind(a.companyId, id).first<{ confidential: number }>();
    if (!row) throw new HttpError(400, 'Both records must be in this company');
    if (row.confidential) assertWhs(a, 'confidential');
  }
  if (input.fromType === input.toType && input.fromId === input.toId) throw new HttpError(400, 'A record cannot be linked to itself');
  const t = now();
  if (input.remove) {
    await db.batch([
      db.prepare('DELETE FROM whs_links WHERE company_id = ? AND ((a_type = ? AND a_id = ? AND b_type = ? AND b_id = ?) OR (a_type = ? AND a_id = ? AND b_type = ? AND b_id = ?))').bind(a.companyId, input.fromType, input.fromId, input.toType, input.toId, input.toType, input.toId, input.fromType, input.fromId),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'link.removed', entityType: input.fromType, entityId: input.fromId, summary: `Link to a ${input.toType.replace('_', ' ')} removed`, before: { type: input.toType, id: input.toId }, at: t }),
    ]);
  } else {
    await db.batch([
      linkStmt(db, a.companyId, [input.fromType, input.fromId], [input.toType, input.toId], a.userId, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'link.added', entityType: input.fromType, entityId: input.fromId, summary: `Linked to a ${input.toType.replace('_', ' ')}`, after: { type: input.toType, id: input.toId }, at: t }),
    ]);
  }
  return c.json({ links: await linksOf(db, a, input.fromType, input.fromId) });
});
