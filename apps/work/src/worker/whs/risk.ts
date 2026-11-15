// BIZOMAT WHS, Release 1: risk assessments and the risk register (brief section 6). JSA, JHA, SWMS, task, workplace,
// plant, chemical, manual handling, construction, environmental, psychosocial and contractor assessments: the task in
// steps, each hazard with the harm, the people affected, likelihood x consequence on the company's risk matrix (the
// matrix version is kept, so a later change of the matrix never changes an assessment), controls tagged with the
// hierarchy of controls and their effectiveness, and the residual risk. A warning is given when a high risk is
// controlled only by administrative controls and PPE, and approving it then needs the warning acknowledged.
//
// Statuses: draft, submitted, approved (by a WHS manager who neither drafted nor submitted it; in a company of one person
// the recorded exception), superseded (by a later approved revision of the same number), cancelled. A new revision
// copies an approved assessment into a draft with the reason (the work, equipment, controls or circumstances changed,
// a scheduled review, an incident); approving it supersedes the earlier one in the same transaction.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { assertPerson, assertWhs, raScope, requireWhs, segregation, type WhsAccess } from './access';
import { actionsOf } from './actions';
import {
  EFFECTIVENESS,
  HIERARCHY,
  LOWER_ORDER,
  RA_KINDS,
  RA_STATUS,
  REF_COLUMNS,
  REF_JOINS,
  REVIEW_TRIGGERS,
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

export const riskRoutes = new Hono<AppEnv>();

const RA_SELECT = `SELECT r.*, ${REF_COLUMNS}, rp.name AS responsible_name, db.name AS drafted_by_name, sb.name AS submitted_by_name, ab.name AS approved_by_name
  FROM whs_risk_assessments r ${REF_JOINS('r')}
  LEFT JOIN users rp ON rp.id = r.responsible_id LEFT JOIN users db ON db.id = r.drafted_by LEFT JOIN users sb ON sb.id = r.submitted_by LEFT JOIN users ab ON ab.id = r.approved_by`;

export function raDTO(r: any, today: string) {
  return {
    id: r.id,
    number: r.number,
    revision: r.revision,
    kind: r.kind,
    kindLabel: WHS_KIND_LABEL(RA_KINDS, r.kind),
    title: r.title,
    activity: r.activity,
    scope: r.scope,
    siteId: r.site_id,
    siteName: r.site_name ?? null,
    location: r.location,
    departmentId: r.department_id,
    departmentName: r.department_name ?? null,
    assetId: r.asset_id,
    assetLabel: r.asset_number ? `${r.asset_number} ${r.asset_name}` : null,
    responsibleId: r.responsible_id,
    responsibleName: r.responsible_name ?? null,
    reviewDate: r.review_date,
    reviewDue: r.status === 'approved' && !!r.review_date && r.review_date < today,
    status: r.status,
    statusLabel: WHS_KIND_LABEL(RA_STATUS, r.status),
    confidential: !!r.confidential,
    reviewTrigger: r.review_trigger,
    reviewTriggerLabel: WHS_KIND_LABEL(REVIEW_TRIGGERS, r.review_trigger),
    reviewReason: r.review_reason,
    draftedById: r.drafted_by,
    draftedByName: r.drafted_by_name ?? null,
    submittedAt: r.submitted_at,
    submittedByName: r.submitted_by_name ?? null,
    approvedAt: r.approved_at,
    approvedByName: r.approved_by_name ?? null,
    approvalNote: r.approval_note,
    approvalSod: !!r.approval_sod,
    warningsAcknowledged: !!r.warnings_acknowledged,
    supersededAt: r.superseded_at,
    createdAt: r.created_at,
    matrixId: r.matrix_id,
  };
}

async function loadRa(db: D1Database, a: WhsAccess, id: string) {
  const scope = raScope(a, 'r');
  const r = await db.prepare(`${RA_SELECT} WHERE r.company_id = ? AND r.id = ? AND ${scope.sql}`).bind(a.companyId, id, ...scope.args).first<any>();
  if (!r) throw notFound('Risk assessment');
  return r;
}

/** The steps, the hazard lines with their controls, and the warnings of an assessment. */
async function content(db: D1Database, companyId: string, raId: string, m: Matrix | null) {
  const [steps, lines, controls] = await db.batch([
    db.prepare('SELECT * FROM whs_ra_steps WHERE company_id = ? AND ra_id = ? ORDER BY seq').bind(companyId, raId),
    db.prepare('SELECT l.*, u.name AS responsible_name, h.number AS hazard_number FROM whs_ra_hazards l LEFT JOIN users u ON u.id = l.responsible_id LEFT JOIN whs_hazards h ON h.company_id = l.company_id AND h.id = l.hazard_id WHERE l.company_id = ? AND l.ra_id = ? ORDER BY l.seq').bind(companyId, raId),
    db.prepare('SELECT c.*, u.name AS responsible_name FROM whs_ra_controls c LEFT JOIN users u ON u.id = c.responsible_id WHERE c.company_id = ? AND c.ra_id = ? ORDER BY c.seq').bind(companyId, raId),
  ]);
  const ctrl = controls.results as any[];
  const out = (lines.results as any[]).map((l) => {
    const cs = ctrl.filter((x) => x.line_id === l.id).map((x) => ({ id: x.id, stage: x.stage, hierarchy: x.hierarchy, hierarchyLabel: WHS_KIND_LABEL(HIERARCHY, x.hierarchy), description: x.description, effectiveness: x.effectiveness, effectivenessLabel: WHS_KIND_LABEL(EFFECTIVENESS, x.effectiveness), responsibleId: x.responsible_id, responsibleName: x.responsible_name ?? null }));
    const warnings: string[] = [];
    if (m && Number(l.rank) >= m.highFrom && (!cs.length || cs.every((x) => LOWER_ORDER.includes(x.hierarchy)))) {
      warnings.push(`${levelLabel(m, l.level)} risk with ${cs.length ? 'only administrative controls and PPE' : 'no controls'}: look for elimination, substitution, isolation or engineering controls first.`);
    }
    if (m && l.residual_rank != null && Number(l.residual_rank) >= m.highFrom) warnings.push(`The residual risk is still ${levelLabel(m, l.residual_level).toLowerCase()}.`);
    return {
      id: l.id,
      stepId: l.step_id,
      hazardId: l.hazard_id,
      hazardNumber: l.hazard_number ?? null,
      hazard: l.hazard,
      harm: l.harm,
      persons: l.persons,
      likelihood: l.likelihood,
      consequence: l.consequence,
      level: l.level,
      levelLabel: levelLabel(m, l.level),
      rank: l.rank,
      high: m ? Number(l.rank) >= m.highFrom : false,
      residualLikelihood: l.residual_likelihood,
      residualConsequence: l.residual_consequence,
      residualLevel: l.residual_level,
      residualLabel: levelLabel(m, l.residual_level),
      responsibleId: l.responsible_id,
      responsibleName: l.responsible_name ?? null,
      controls: cs,
      warnings,
    };
  });
  return { steps: (steps.results as any[]).map((s) => ({ id: s.id, seq: s.seq, step: s.step })), lines: out, warnings: out.flatMap((l) => l.warnings.map((w) => `${l.hazard}: ${w}`)) };
}

const zHeader = z.object({
  kind: zKind(RA_KINDS, 'kind of assessment'),
  title: zText(200).min(1),
  activity: zText(500).optional(),
  scope: zLong(3000).optional(),
  siteId: z.string().max(64).nullable().optional(),
  location: zText(300).optional(),
  departmentId: z.string().max(64).nullable().optional(),
  assetId: z.string().max(64).nullable().optional(),
  responsibleId: z.string().max(64).nullable().optional(),
  reviewDate: zDate.optional(),
  confidential: z.boolean().optional(),
});

const zContent = z.object({
  steps: z.array(z.object({ key: z.string().min(1).max(64), step: zText(500).min(1) })).max(60),
  lines: z
    .array(
      z.object({
        stepKey: z.string().max(64).nullable().optional(),
        hazardId: z.string().max(64).nullable().optional(),
        hazard: zText(500).min(1),
        harm: zText(500).optional(),
        persons: zText(300).optional(),
        likelihood: z.number().int().min(1).max(9),
        consequence: z.number().int().min(1).max(9),
        residualLikelihood: z.number().int().min(1).max(9).nullable().optional(),
        residualConsequence: z.number().int().min(1).max(9).nullable().optional(),
        responsibleId: z.string().max(64).nullable().optional(),
        controls: z
          .array(z.object({ stage: z.enum(['existing', 'additional']), hierarchy: zKind(HIERARCHY, 'place in the hierarchy of controls'), description: zText(500).min(1), effectiveness: zKind(EFFECTIVENESS, 'effectiveness').optional(), responsibleId: z.string().max(64).nullable().optional() }))
          .max(30),
      }),
    )
    .max(100),
});
type Content = z.infer<typeof zContent>;

/** Statements that replace a draft's content (rated on its own matrix version). */
async function contentStmts(db: D1Database, a: WhsAccess, raId: string, m: Matrix, input: Content) {
  const people = new Set<string>();
  for (const l of input.lines) {
    if (l.responsibleId) people.add(l.responsibleId);
    for (const x of l.controls) if (x.responsibleId) people.add(x.responsibleId);
    if (l.hazardId && !(await db.prepare('SELECT 1 FROM whs_hazards WHERE company_id = ? AND id = ?').bind(a.companyId, l.hazardId).first())) throw new HttpError(400, 'A linked hazard must be in this company’s register');
    if ((l.residualLikelihood == null) !== (l.residualConsequence == null)) throw new HttpError(400, 'Give both the residual likelihood and consequence, or neither');
  }
  for (const p of people) await assertPerson(db, a, p, 'A responsible person');
  const keys = new Map<string, string>();
  const stmts: D1PreparedStatement[] = [
    db.prepare('DELETE FROM whs_ra_controls WHERE company_id = ? AND ra_id = ?').bind(a.companyId, raId),
    db.prepare('DELETE FROM whs_ra_hazards WHERE company_id = ? AND ra_id = ?').bind(a.companyId, raId),
    db.prepare('DELETE FROM whs_ra_steps WHERE company_id = ? AND ra_id = ?').bind(a.companyId, raId),
  ];
  input.steps.forEach((s, i) => {
    const id = newId();
    keys.set(s.key, id);
    stmts.push(db.prepare('INSERT INTO whs_ra_steps (id, company_id, ra_id, seq, step) VALUES (?, ?, ?, ?, ?)').bind(id, a.companyId, raId, i + 1, s.step));
  });
  input.lines.forEach((l, i) => {
    const level = rate(m, l.likelihood, l.consequence);
    const residual = l.residualLikelihood && l.residualConsequence ? rate(m, l.residualLikelihood, l.residualConsequence) : null;
    const id = newId();
    if (l.stepKey && !keys.has(l.stepKey)) throw new HttpError(400, 'Each hazard must belong to one of the steps');
    stmts.push(
      db
        .prepare('INSERT INTO whs_ra_hazards (id, company_id, ra_id, step_id, hazard_id, seq, hazard, harm, persons, likelihood, consequence, level, rank, residual_likelihood, residual_consequence, residual_level, residual_rank, responsible_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(id, a.companyId, raId, l.stepKey ? keys.get(l.stepKey)! : null, l.hazardId ?? null, i + 1, l.hazard, l.harm ?? '', l.persons ?? '', l.likelihood, l.consequence, level.key, level.rank, residual ? l.residualLikelihood : null, residual ? l.residualConsequence : null, residual?.key ?? null, residual?.rank ?? null, l.responsibleId ?? null),
    );
    l.controls.forEach((x, j) => {
      stmts.push(
        db
          .prepare('INSERT INTO whs_ra_controls (id, company_id, ra_id, line_id, seq, stage, hierarchy, description, effectiveness, responsible_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(newId(), a.companyId, raId, id, j + 1, x.stage, x.hierarchy, x.description, x.effectiveness ?? 'not_assessed', x.responsibleId ?? null),
      );
    });
  });
  return stmts;
}

async function checkHeader(db: D1Database, a: WhsAccess, input: Partial<z.infer<typeof zHeader>>) {
  if (input.siteId !== undefined) await siteName(db, a.companyId, input.siteId);
  if (input.departmentId !== undefined) await departmentName(db, a.companyId, input.departmentId);
  if (input.assetId !== undefined) await assetName(db, a.companyId, input.assetId);
  await assertPerson(db, a, input.responsibleId, 'The responsible person');
  if (input.confidential) assertWhs(a, 'confidential');
}

riskRoutes.get('/c/:company/risk-assessments', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const scope = raScope(a, 'r');
  const where = ['r.company_id = ?', scope.sql];
  const args: unknown[] = [a.companyId, ...scope.args];
  const add = (sql: string, ...xs: unknown[]) => {
    where.push(sql);
    args.push(...xs);
  };
  const status = c.req.query('status');
  if (status && Object.hasOwn(RA_STATUS, status)) add('r.status = ?', status);
  else if (c.req.query('all') !== '1') add("r.status NOT IN ('superseded', 'cancelled')");
  const kind = c.req.query('kind');
  if (kind && Object.hasOwn(RA_KINDS, kind)) add('r.kind = ?', kind);
  if (c.req.query('site')) add('r.site_id = ?', c.req.query('site'));
  if (c.req.query('reviewDue') === '1') add("r.status = 'approved' AND r.review_date IS NOT NULL AND r.review_date < ?", today);
  const q = c.req.query('q');
  if (q?.trim()) add('r.search LIKE ?', likeOf(q));
  const rows = await db.prepare(`${RA_SELECT} WHERE ${where.join(' AND ')} ORDER BY r.number DESC, r.revision DESC LIMIT 500`).bind(...args).all<any>();
  const list = rows.results.map((r) => raDTO(r, today));
  if (c.req.query('format') === 'csv') {
    const { csvResponse } = await import('../erp/util');
    return csvResponse(`whs-risk-assessments-${today}`, [['Number', 'Revision', 'Kind', 'Title', 'Site', 'Responsible', 'Status', 'Approved', 'Review date', 'Review due'], ...list.map((r) => [r.number, r.revision, r.kindLabel, r.title, r.siteName ?? '', r.responsibleName ?? '', r.statusLabel, r.approvedAt ? new Date(r.approvedAt).toISOString().slice(0, 10) : '', r.reviewDate ?? '', r.reviewDue ? 'yes' : 'no'])]);
  }
  return c.json({ assessments: list });
});

riskRoutes.post('/c/:company/risk-assessments', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const input = await body(c, zHeader.extend({ hazardId: z.string().max(64).nullable().optional(), content: zContent.optional() }));
  await checkHeader(db, a, input);
  if (input.hazardId && !(await db.prepare('SELECT 1 FROM whs_hazards WHERE company_id = ? AND id = ?').bind(a.companyId, input.hazardId).first())) throw new HttpError(400, 'The hazard must be in this company’s register');
  const { id: matrixId, matrix } = await currentMatrix(db, a.companyId, a.userId);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'risk_assessment');
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO whs_risk_assessments (id, company_id, number, revision, kind, title, activity, scope, site_id, location, department_id, asset_id, responsible_id, review_date, matrix_id, status, confidential, drafted_by, search, created_at, updated_at)
         VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.companyId, number, input.kind, input.title, input.activity ?? '', input.scope ?? '', input.siteId ?? null, input.location ?? '', input.departmentId ?? null, input.assetId ?? null, input.responsibleId ?? null, input.reviewDate ?? null, matrixId, input.confidential ? 1 : 0, a.userId, searchText(number, input.title, input.activity), t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'risk_assessment.drafted', entityType: 'risk_assessment', entityId: id, summary: `${number} drafted: ${WHS_KIND_LABEL(RA_KINDS, input.kind)}, ${input.title}`, at: t }),
  ];
  if (input.hazardId) stmts.push(linkStmt(db, a.companyId, ['hazard', input.hazardId], ['risk_assessment', id], a.userId, t), eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'link.added', entityType: 'hazard', entityId: input.hazardId, summary: `Risk assessment ${number} made for this hazard`, at: t }));
  if (input.content) stmts.push(...(await contentStmts(db, a, id, matrix, input.content)));
  await db.batch(stmts);
  return c.json(await detail(db, a, id, todayFrom(c.req.query('today'))), 201);
});

async function detail(db: D1Database, a: WhsAccess, id: string, today: string) {
  const r = await loadRa(db, a, id);
  const m = await matrixById(db, a.companyId, r.matrix_id);
  const revisions = await db.prepare('SELECT id, revision, status, review_trigger, review_reason, approved_at, created_at FROM whs_risk_assessments WHERE company_id = ? AND number = ? ORDER BY revision DESC').bind(a.companyId, r.number).all<any>();
  const body2 = await content(db, a.companyId, r.id, m);
  return {
    assessment: raDTO(r, today),
    matrix: m,
    ...body2,
    revisions: revisions.results.map((x) => ({ id: x.id, revision: x.revision, status: x.status, statusLabel: WHS_KIND_LABEL(RA_STATUS, x.status), trigger: WHS_KIND_LABEL(REVIEW_TRIGGERS, x.review_trigger), reason: x.review_reason, approvedAt: x.approved_at, createdAt: x.created_at })),
    actions: await actionsOf(db, a, 'risk_assessment', r.id, today),
    links: await linksOf(db, a.companyId, 'risk_assessment', r.id),
    files: await filesOf(db, a.companyId, 'risk_assessment', r.id),
    comments: await commentsOf(db, a.companyId, 'risk_assessment', r.id),
    history: await historyOf(db, a.companyId, 'risk_assessment', r.id),
    can: {
      edit: a.can.assess && r.status === 'draft',
      submit: a.can.assess && r.status === 'draft',
      approve: a.can.approve && r.status === 'submitted',
      revise: a.can.assess && r.status === 'approved',
      cancel: a.can.assess && (r.status === 'draft' || r.status === 'submitted'),
      consult: a.can.consult,
    },
  };
}

riskRoutes.get('/c/:company/risk-assessments/:id', async (c) => {
  const a = await requireWhs(c);
  return c.json(await detail(c.env.DB, a, c.req.param('id'), todayFrom(c.req.query('today'))));
});

riskRoutes.patch('/c/:company/risk-assessments/:id', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const r = await loadRa(db, a, c.req.param('id'));
  if (r.status !== 'draft') badState('Only a draft is changed: make a new revision of an approved assessment');
  const input = await body(c, zHeader.partial());
  await checkHeader(db, a, input);
  const next: Record<string, unknown> = {
    kind: input.kind ?? r.kind,
    title: input.title ?? r.title,
    activity: input.activity ?? r.activity,
    scope: input.scope ?? r.scope,
    site_id: input.siteId === undefined ? r.site_id : input.siteId,
    location: input.location ?? r.location,
    department_id: input.departmentId === undefined ? r.department_id : input.departmentId,
    asset_id: input.assetId === undefined ? r.asset_id : input.assetId,
    responsible_id: input.responsibleId === undefined ? r.responsible_id : input.responsibleId,
    review_date: input.reviewDate === undefined ? r.review_date : input.reviewDate,
    confidential: input.confidential === undefined ? r.confidential : input.confidential ? 1 : 0,
  };
  const diff = changed(r, next);
  const t = now();
  await db.batch([
    db
      .prepare('UPDATE whs_risk_assessments SET kind = ?, title = ?, activity = ?, scope = ?, site_id = ?, location = ?, department_id = ?, asset_id = ?, responsible_id = ?, review_date = ?, confidential = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = ?')
      .bind(next.kind, next.title, next.activity, next.scope, next.site_id, next.location, next.department_id, next.asset_id, next.responsible_id, next.review_date, next.confidential, searchText(r.number, next.title as string, next.activity as string), t, a.companyId, r.id, 'draft'),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'risk_assessment.changed', entityType: 'risk_assessment', entityId: r.id, summary: `${r.number} revision ${r.revision} changed`, before: diff.before, after: diff.after, at: t }),
  ]);
  return c.json(await detail(db, a, r.id, todayFrom(c.req.query('today'))));
});

riskRoutes.put('/c/:company/risk-assessments/:id/content', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const r = await loadRa(db, a, c.req.param('id'));
  if (r.status !== 'draft') badState('Only a draft is changed: make a new revision of an approved assessment');
  const input = await body(c, zContent);
  const m = (await matrixById(db, a.companyId, r.matrix_id))!;
  const t = now();
  await db.batch([
    ...(await contentStmts(db, a, r.id, m, input)),
    db.prepare('UPDATE whs_risk_assessments SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'risk_assessment.content', entityType: 'risk_assessment', entityId: r.id, summary: `${r.number} revision ${r.revision}: ${input.steps.length} steps and ${input.lines.length} hazards saved`, after: { steps: input.steps.length, hazards: input.lines.length, controls: input.lines.reduce((s, l) => s + l.controls.length, 0) }, at: t }),
  ]);
  return c.json(await detail(db, a, r.id, todayFrom(c.req.query('today'))));
});

async function setStatus(c: any, a: WhsAccess, r: any, from: string, to: string, set: { sql: string; args: unknown[] }, summary: string, extra: D1PreparedStatement[] = []) {
  const db = c.env.DB as D1Database;
  const t = now();
  const res = await db.batch([
    db.prepare(`UPDATE whs_risk_assessments SET status = ?, ${set.sql}updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`).bind(to, ...set.args, t, a.companyId, r.id, from),
    ...extra,
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `risk_assessment.${to}`, entityType: 'risk_assessment', entityId: r.id, summary, before: { status: r.status }, after: { status: to }, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This assessment changed at the same moment: refresh and try again');
  return c.json(await detail(db, a, r.id, todayFrom(c.req.query('today'))));
}

riskRoutes.post('/c/:company/risk-assessments/:id/submit', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const r = await loadRa(db, a, c.req.param('id'));
  if (r.status !== 'draft') badState(`${r.number} is ${r.status}`);
  const n = await db.prepare('SELECT COUNT(*) AS n FROM whs_ra_hazards WHERE company_id = ? AND ra_id = ?').bind(a.companyId, r.id).first<{ n: number }>();
  if (!Number(n?.n)) badState('Add at least one hazard with its rating before submitting');
  return setStatus(c, a, r, 'draft', 'submitted', { sql: 'submitted_by = ?, submitted_at = ?, ', args: [a.userId, now()] }, `${r.number} revision ${r.revision} submitted for approval`);
});

riskRoutes.post('/c/:company/risk-assessments/:id/return', async (c) => {
  const a = await requireWhs(c, 'approve');
  const r = await loadRa(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ note: zLong(2000).min(1, 'Say what to change') }));
  if (r.status !== 'submitted') badState(`${r.number} is ${r.status}`);
  return setStatus(c, a, r, 'submitted', 'draft', { sql: 'approval_note = ?, ', args: [input.note] }, `${r.number} revision ${r.revision} returned for changes: ${input.note}`);
});

riskRoutes.post('/c/:company/risk-assessments/:id/approve', async (c) => {
  const a = await requireWhs(c, 'approve');
  const db = c.env.DB;
  const r = await loadRa(db, a, c.req.param('id'));
  if (r.status !== 'submitted') badState(`${r.number} must be submitted before it is approved`);
  const input = await body(c, z.object({ note: zLong(2000).optional(), acknowledgeWarnings: z.boolean().optional() }));
  const m = await matrixById(db, a.companyId, r.matrix_id);
  const { warnings } = await content(db, a.companyId, r.id, m);
  if (warnings.length && !input.acknowledgeWarnings) throw new HttpError(409, `Read the warnings before approving: ${warnings.join(' ')}`, { code: 'WARNINGS', warnings });
  const sod = segregation(a, [[r.drafted_by, 'drafted this assessment'], [r.submitted_by, 'submitted this assessment']], 'approve it');
  const t = now();
  // the earlier approved revision is superseded in the same transaction (a unique index keeps one approved per number)
  const prior = db.prepare("UPDATE whs_risk_assessments SET status = 'superseded', superseded_at = ?, updated_at = ? WHERE company_id = ? AND number = ? AND status = 'approved' AND id <> ?").bind(t, t, a.companyId, r.number, r.id);
  const db2 = c.env.DB;
  const res = await db2.batch([
    prior,
    db2.prepare("UPDATE whs_risk_assessments SET status = 'approved', approved_by = ?, approved_at = ?, approval_note = ?, approval_sod = ?, warnings_acknowledged = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'submitted'").bind(a.userId, t, input.note ?? '', sod ? 1 : 0, warnings.length ? 1 : 0, t, a.companyId, r.id),
    eventStmt(db2, { companyId: a.companyId, actorId: a.userId, action: 'risk_assessment.approved', entityType: 'risk_assessment', entityId: r.id, summary: `${r.number} revision ${r.revision} approved${sod ? ' by the person who drafted it, alone in the company (recorded exception)' : ''}${warnings.length ? `, with ${warnings.length} warning${warnings.length === 1 ? '' : 's'} acknowledged` : ''}`, before: { status: 'submitted' }, after: { status: 'approved', exception: sod, warnings }, at: t }),
  ]);
  if (!res[1].meta.changes) badState('This assessment changed at the same moment: refresh and try again');
  return c.json(await detail(db, a, r.id, todayFrom(c.req.query('today'))));
});

/** A new revision of an approved assessment, with why it is reviewed. */
riskRoutes.post('/c/:company/risk-assessments/:id/revise', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const r = await loadRa(db, a, c.req.param('id'));
  if (r.status !== 'approved') badState('Only the approved revision is revised');
  const input = await body(c, z.object({ trigger: zKind(REVIEW_TRIGGERS, 'reason for the review'), reason: zLong(2000).min(1, 'Say what changed') }));
  const { id: matrixId, matrix } = await currentMatrix(db, a.companyId, a.userId);
  const old = await content(db, a.companyId, r.id, await matrixById(db, a.companyId, r.matrix_id));
  const clamp = (v: number, n: number) => Math.min(Math.max(v, 1), n);
  const L = matrix.likelihood.length;
  const C = matrix.consequence.length;
  const copy: Content = {
    steps: old.steps.map((s) => ({ key: s.id, step: s.step })),
    lines: old.lines.map((l) => ({
      stepKey: l.stepId,
      hazardId: l.hazardId,
      hazard: l.hazard,
      harm: l.harm,
      persons: l.persons,
      likelihood: clamp(l.likelihood, L),
      consequence: clamp(l.consequence, C),
      residualLikelihood: l.residualLikelihood == null ? null : clamp(l.residualLikelihood, L),
      residualConsequence: l.residualConsequence == null ? null : clamp(l.residualConsequence, C),
      responsibleId: l.responsibleId,
      controls: l.controls.map((x) => ({ stage: x.stage, hierarchy: x.hierarchy, description: x.description, effectiveness: x.effectiveness, responsibleId: x.responsibleId })),
    })),
  };
  const id = newId();
  const t = now();
  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO whs_risk_assessments (id, company_id, number, revision, kind, title, activity, scope, site_id, location, department_id, asset_id, responsible_id, review_date, matrix_id, status, confidential, review_trigger, review_reason, drafted_by, search, created_at, updated_at)
           SELECT ?, company_id, number, revision + 1, kind, title, activity, scope, site_id, location, department_id, asset_id, responsible_id, NULL, ?, 'draft', confidential, ?, ?, ?, search, ?, ? FROM whs_risk_assessments WHERE company_id = ? AND id = ?`,
        )
        .bind(id, matrixId, input.trigger, input.reason, a.userId, t, t, a.companyId, r.id),
      ...(await contentStmts(db, a, id, matrix, copy)),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'risk_assessment.revised', entityType: 'risk_assessment', entityId: id, summary: `${r.number} revision ${r.revision + 1} drafted: ${WHS_KIND_LABEL(REVIEW_TRIGGERS, input.trigger).toLowerCase()} (${input.reason})`, after: { from: r.id, trigger: input.trigger }, at: t }),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'risk_assessment.review_started', entityType: 'risk_assessment', entityId: r.id, summary: `Revision ${r.revision + 1} drafted to review this assessment: ${input.reason}`, at: t }),
    ]);
  } catch (e) {
    if (String((e as Error)?.message ?? e).includes('UNIQUE')) badState('A new revision of this assessment is already being drafted');
    throw e;
  }
  return c.json(await detail(db, a, id, todayFrom(c.req.query('today'))), 201);
});

riskRoutes.post('/c/:company/risk-assessments/:id/cancel', async (c) => {
  const a = await requireWhs(c, 'assess');
  const r = await loadRa(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ reason: zLong(1000).min(1, 'Say why') }));
  if (r.status !== 'draft' && r.status !== 'submitted') badState(`${r.number} is ${r.status}`);
  return setStatus(c, a, r, r.status, 'cancelled', { sql: 'approval_note = ?, ', args: [input.reason] }, `${r.number} revision ${r.revision} cancelled: ${input.reason}`);
});

// ------------------------------------------------------------------ the risk register and its heat map

/**
 * The risk register: every hazard line of the approved assessments and every rated hazard of the register, on the
 * company's current matrix (lines rated on an earlier matrix are counted by their level, not their cell), with the
 * heat map counts of initial and residual risk.
 */
riskRoutes.get('/c/:company/risk-register', async (c) => {
  const a = await requireWhs(c, 'view');
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const { id: matrixId, matrix } = await currentMatrix(db, a.companyId, a.userId);
  const conf = a.can.confidential ? '' : 'AND r.confidential = 0';
  const site = c.req.query('site');
  const lines = await db
    .prepare(
      `SELECT l.*, r.number, r.revision, r.title AS ra_title, r.kind, r.review_date, r.matrix_id, r.site_id FROM whs_ra_hazards l JOIN whs_risk_assessments r ON r.company_id = l.company_id AND r.id = l.ra_id
        WHERE l.company_id = ? AND r.status = 'approved' ${conf} ${site ? 'AND r.site_id = ?' : ''} ORDER BY l.rank DESC, r.number`,
    )
    .bind(...(site ? [a.companyId, site] : [a.companyId]))
    .all<any>();
  const hazards = await db
    .prepare(`SELECT h.id, h.number, h.title, h.likelihood, h.consequence, h.risk_level, h.risk_rank, h.residual_likelihood, h.residual_consequence, h.residual_level, h.matrix_id, h.status FROM whs_hazards h WHERE h.company_id = ? AND h.risk_level IS NOT NULL AND h.status NOT IN ('closed', 'cancelled') ${a.can.confidential ? '' : 'AND h.confidential = 0'} ${site ? 'AND h.site_id = ?' : ''}`)
    .bind(...(site ? [a.companyId, site] : [a.companyId]))
    .all<any>();
  const L = matrix.likelihood.length;
  const C = matrix.consequence.length;
  const initial = Array.from({ length: L }, () => Array(C).fill(0) as number[]);
  const residual = Array.from({ length: L }, () => Array(C).fill(0) as number[]);
  let otherMatrix = 0;
  const place = (grid: number[][], l: number | null, cns: number | null, mId: string) => {
    if (l == null || cns == null) return;
    if (mId !== matrixId) {
      otherMatrix++;
      return;
    }
    if (grid[l - 1] && grid[l - 1][cns - 1] !== undefined) grid[l - 1][cns - 1]++;
  };
  for (const l of lines.results) {
    place(initial, l.likelihood, l.consequence, l.matrix_id);
    place(residual, l.residual_likelihood, l.residual_consequence, l.matrix_id);
  }
  for (const h of hazards.results) {
    place(initial, h.likelihood, h.consequence, h.matrix_id);
    place(residual, h.residual_likelihood, h.residual_consequence, h.matrix_id);
  }
  const byLevel: Record<string, number> = {};
  for (const x of [...lines.results.map((l) => l.level), ...hazards.results.map((h) => h.risk_level)]) byLevel[x] = (byLevel[x] ?? 0) + 1;
  const rows = [
    ...lines.results.map((l) => ({ source: 'risk_assessment' as const, id: l.ra_id, number: `${l.number} rev ${l.revision}`, title: l.ra_title, hazard: l.hazard, level: l.level, levelLabel: levelLabel(matrix, l.level), rank: l.rank, residualLevel: l.residual_level, residualLabel: levelLabel(matrix, l.residual_level), reviewDate: l.review_date, reviewDue: !!l.review_date && l.review_date < today })),
    ...hazards.results.map((h) => ({ source: 'hazard' as const, id: h.id, number: h.number, title: h.title, hazard: h.title, level: h.risk_level, levelLabel: levelLabel(matrix, h.risk_level), rank: h.risk_rank, residualLevel: h.residual_level, residualLabel: levelLabel(matrix, h.residual_level), reviewDate: null, reviewDue: false })),
  ].sort((x, y) => Number(y.rank) - Number(x.rank));
  if (c.req.query('format') === 'csv') {
    const { csvResponse } = await import('../erp/util');
    return csvResponse(`whs-risk-register-${today}`, [['Source', 'Number', 'Title', 'Hazard', 'Initial risk', 'Residual risk', 'Review date', 'Review due'], ...rows.map((r) => [r.source === 'hazard' ? 'Hazard register' : 'Risk assessment', r.number, r.title, r.hazard, r.levelLabel, r.residualLabel, r.reviewDate ?? '', r.reviewDue ? 'yes' : 'no'])]);
  }
  return c.json({ matrix, heatMap: { initial, residual }, otherMatrix, byLevel, rows });
});
