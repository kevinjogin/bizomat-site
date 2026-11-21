// Inspection rounds (/api/maintenance/c/:company/...): ONE work order of job type inspection that covers many assets,
// each with its own checklist (the field release; MEX is a functional reference only).
//
//   The round    one per work order (mt_rounds), with the checklist chosen for it. The work order keeps its own timer,
//                labour, photos, parts and status, so the work order list shows one job: a 40-asset round is never 40
//                work orders. Its asset is the one chosen, else the nearest asset above (or equal to) all of them.
//   Its assets   one line per asset (mt_round_assets), with the round's checklist or another one. The assigned
//                technician (or a supervisor or administrator) records each item and completes the asset. A failed
//                asset makes at most one follow-up, on that asset, by its checklist's rule (a once-only key per attempt;
//                a redo never makes a second one). Results keep a copy of the item as it was (mt_round_results), as
//                inspections on work orders do, so a later change to the checklist never changes them.
//   Review       a supervisor or administrator approves each completed asset, or marks it not approved with a reason.
//                Not approved opens it again (attempt + 1) with its results kept to be corrected; that needs the work
//                order unlocked, so on a completed one a supervisor reopens it first. The person who completed an asset
//                cannot decide it, unless no other active supervisor or administrator is in the company: the decision
//                is then allowed and the history says so. Approvals never block completing the work order; an asset
//                still open does (round-guard.ts).
//
// Words used on the screens: Exceptions are assets with at least one failed item (open or completed). Awaiting approval
// is completed and not reviewed. Not approved is marked not approved (open again until it is completed). Progress is
// completed assets out of all, rounded down.
//
// Why new tables: mt_wo_inspections (0024) allows one row per checklist on a work order (a table constraint), and
// mt_insp_results names exactly one of an inspection and a prestart (a CHECK), so neither can hold a round's assets
// without rebuilding the table. The checklist code is shared with routes-inspections.ts, never copied.
//
// routes-work.ts sits in an import cycle (routes-work, routes-parts, routes-inspections): nothing here uses its exports
// at the top level, so the round's schema is built on first use.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { atLeast, companyPeople, deny, isManager, requireMt, workOrderScope, type MtAccess } from './access';
import { workOrderDTO } from './dto';
import { assertUnlocked, canWork, createSchema, loadWorkOrder, workOrderStatements } from './routes-work';
import { evaluate, followUpStatements, itemDTO, resultDTO, resultInput, type FollowUp } from './routes-inspections';
import { doneStmt, eventIfStmt, isUnique } from './m2util';
import { LOCKED, OUTSTANDING, eventDTO, eventStmt, likeOf, sqlList, zId, zText } from './util';

export const roundRoutes = new Hono<AppEnv>();

const MAX_PER_CALL = 100;
const MAX_PER_ROUND = 300;

const refuse = (status: number, message: string, code: string, extra: Record<string, unknown> = {}) => new HttpError(status, message, { code, ...extra });
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const lineInput = z.object({ assetId: zId, templateId: zId.optional() });
const assetList = z.array(lineInput).min(1).max(MAX_PER_CALL);

/** A new round: a work order's fields (createSchema, without its asset, description and job type) plus the assets. */
const buildRoundSchema = () =>
  createSchema.omit({ assetId: true, description: true, jobType: true }).extend({
    templateId: zId,
    assets: assetList,
    assetId: zId.optional(),
    description: zText(5000).optional(),
  });
let roundSchemaMemo: ReturnType<typeof buildRoundSchema> | null = null;
const roundSchema = () => (roundSchemaMemo ??= buildRoundSchema());

// ------------------------------------------------------------------ lines

/** A line of a round with its asset, site, people, follow-up, photo and counts (bind the company and the filter). */
const LINE_SELECT = `SELECT l.*, a.number AS asset_number, a.name AS asset_name, a.status AS asset_status, a.location AS asset_location, a.search AS asset_search,
    s.code AS site_code, cu.name AS completer, ru.name AS reviewer, fw.number AS fw_number, fr.number AS fr_number,
    (SELECT f.id FROM mt_files f WHERE f.company_id = l.company_id AND f.asset_id = l.asset_id AND f.deleted_at IS NULL AND f.mime LIKE 'image/%' ORDER BY f.created_at DESC LIMIT 1) AS photo_id,
    (SELECT COUNT(*) FROM mt_insp_items i WHERE i.company_id = l.company_id AND i.template_id = l.template_id AND i.archived_at IS NULL) AS live_items,
    (SELECT COUNT(*) FROM mt_round_results r WHERE r.company_id = l.company_id AND r.round_asset_id = l.id) AS recorded,
    (SELECT COUNT(*) FROM mt_round_results r JOIN mt_insp_items i ON i.company_id = r.company_id AND i.id = r.item_id
      WHERE r.company_id = l.company_id AND r.round_asset_id = l.id AND i.template_id = l.template_id AND i.archived_at IS NULL) AS answered_live,
    (SELECT COUNT(*) FROM mt_round_results r WHERE r.company_id = l.company_id AND r.round_asset_id = l.id AND r.passed = 0) AS failed_items
  FROM mt_round_assets l
  JOIN mt_assets a ON a.company_id = l.company_id AND a.id = l.asset_id
  LEFT JOIN mt_asset_sites ls ON ls.company_id = l.company_id AND ls.asset_id = l.asset_id
  LEFT JOIN mt_sites s ON s.company_id = ls.company_id AND s.id = ls.site_id
  LEFT JOIN users cu ON cu.id = l.completed_by
  LEFT JOIN users ru ON ru.id = l.reviewed_by
  LEFT JOIN mt_work_orders fw ON fw.company_id = l.company_id AND fw.id = l.follow_up_work_order_id
  LEFT JOIN mt_requests fr ON fr.company_id = l.company_id AND fr.id = l.follow_up_request_id`;

/** A stored review of '' reads as nothing while the asset is open, and as awaiting approval once it is completed. */
const reviewOf = (l: any): 'awaiting' | 'approved' | 'not_approved' | null => (l.review === '' ? (l.status === 'open' ? null : 'awaiting') : l.review);

const followUpOf = (l: any): FollowUp | null =>
  l.follow_up_work_order_id ? { kind: 'work_order', id: l.follow_up_work_order_id, number: l.fw_number } : l.follow_up_request_id ? { kind: 'request', id: l.follow_up_request_id, number: l.fr_number } : null;

function lineDTO(l: any, companyId: string) {
  const open = l.status === 'open';
  // Open: the checklist's items now. Completed: the results recorded (every one of them answered).
  const questions = Number(open ? l.live_items : l.recorded);
  const answered = Number(open ? l.answered_live : l.recorded);
  return {
    id: l.id as string,
    position: l.position as number,
    assetId: l.asset_id as string,
    assetNumber: l.asset_number as string,
    assetName: l.asset_name as string,
    assetStatus: l.asset_status as string,
    siteCode: (l.site_code ?? null) as string | null,
    photoUrl: l.photo_id ? `/api/maintenance/c/${companyId}/files/${l.photo_id}` : null,
    templateId: l.template_id as string,
    templateName: l.template_name as string,
    status: l.status as 'open' | 'passed' | 'failed',
    attempt: l.attempt as number,
    questions,
    answered,
    percent: open ? (questions ? Math.floor((answered * 100) / questions) : 0) : 100,
    failedItems: Number(l.failed_items),
    completedAt: l.completed_at as number | null,
    completedByName: (l.completer ?? null) as string | null,
    review: reviewOf(l),
    reviewNote: l.review_note as string,
    reviewedAt: l.reviewed_at as number | null,
    reviewedByName: (l.reviewer ?? null) as string | null,
    followUp: followUpOf(l),
  };
}
type Line = ReturnType<typeof lineDTO>;

function totalsOf(lines: Line[]) {
  const assets = lines.length;
  const completed = lines.filter((l) => l.status !== 'open').length;
  const count = (f: (l: Line) => boolean) => lines.filter(f).length;
  return {
    assets,
    completed,
    open: assets - completed,
    passed: count((l) => l.status === 'passed'),
    failed: count((l) => l.status === 'failed'),
    percent: assets ? Math.floor((completed * 100) / assets) : 0,
    questions: lines.reduce((s, l) => s + l.questions, 0),
    answered: lines.reduce((s, l) => s + l.answered, 0),
    exceptions: count((l) => l.failedItems > 0),
    approved: count((l) => l.review === 'approved'),
    notApproved: count((l) => l.review === 'not_approved'),
    awaitingApproval: count((l) => l.review === 'awaiting'),
  };
}

const linesOf = async (db: D1Database, companyId: string, woId: string) => (await db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.work_order_id = ? ORDER BY l.position`).bind(companyId, woId).all<any>()).results;

async function loadLine(db: D1Database, companyId: string, woId: string, lineId: string) {
  const l = await db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.work_order_id = ? AND l.id = ?`).bind(companyId, woId, String(lineId).slice(0, 64)).first<any>();
  if (!l) throw notFound('Round asset');
  return l;
}

/** The work order (404 when the caller may not see it) and its round, or null when it is not a round. */
async function loadRound(db: D1Database, a: MtAccess, woId: string) {
  const w = await loadWorkOrder(db, a, woId);
  const ro = await db
    .prepare('SELECT ro.*, t.name AS template_name FROM mt_rounds ro JOIN mt_insp_templates t ON t.company_id = ro.company_id AND t.id = ro.template_id WHERE ro.company_id = ? AND ro.work_order_id = ?')
    .bind(a.companyId, w.id)
    .first<any>();
  return { w, ro: ro as any | null };
}

const notARound = () => refuse(404, 'This work order is not an inspection round', 'NOT_A_ROUND');
const lineDone = (l: any) => refuse(409, `The checklist of ${l.asset_number} is completed: its results are locked`, 'ROUND_LINE_DONE');
const isLocked = (w: { status: string }) => (LOCKED as string[]).includes(w.status);

/** A round's work order the caller may work on (the assigned technician, supervisors and administrators), not locked. */
async function workable(c: Context<AppEnv>) {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  const { w, ro } = await loadRound(db, a, c.req.param('id') ?? '');
  if (!canWork(a, w)) deny('Only the assigned technician, a supervisor or an administrator can work on this work order');
  assertUnlocked(w);
  if (!ro) throw notARound();
  return { a, w, ro, db };
}

/** The checklist's live items (not archived), in order. */
const liveItems = async (db: D1Database, companyId: string, templateId: string) =>
  (await db.prepare('SELECT * FROM mt_insp_items WHERE company_id = ? AND template_id = ? AND archived_at IS NULL ORDER BY position, created_at').bind(companyId, templateId).all<any>()).results;

/** The next open asset after this one (wrapping round to the start), for "Next asset". */
async function nextOpen(db: D1Database, companyId: string, woId: string, position: number, lineId: string) {
  const r = await db
    .prepare("SELECT l.id, a.number, a.name FROM mt_round_assets l JOIN mt_assets a ON a.company_id = l.company_id AND a.id = l.asset_id WHERE l.company_id = ? AND l.work_order_id = ? AND l.status = 'open' AND l.id <> ? ORDER BY (l.position <= ?), l.position LIMIT 1")
    .bind(companyId, woId, lineId, position)
    .first<{ id: string; number: string; name: string }>();
  return r ? { lineId: r.id, assetNumber: r.number, assetName: r.name } : null;
}

/** True when nobody else active in the company holds the maintenance role supervisor or administrator. */
const reviewerAlone = async (db: D1Database, a: MtAccess) => !(await companyPeople(db, a)).some((p) => p.id !== a.userId && atLeast(p, 'supervisor'));

// ------------------------------------------------------------------ checks shared by making and adding

/** The chosen assets, each once, all of this company and none archived. */
async function checkAssets(db: D1Database, companyId: string, list: { assetId: string }[]) {
  const ids = list.map((x) => x.assetId);
  if (new Set(ids).size !== ids.length) throw refuse(400, 'An asset appears twice in the round', 'ROUND_DUPLICATE');
  const rows = (await db.prepare('SELECT id, number, archived_at FROM mt_assets WHERE company_id = ? AND id IN (SELECT value FROM json_each(?))').bind(companyId, JSON.stringify(ids)).all<{ id: string; number: string; archived_at: number | null }>()).results;
  const byId = new Map(rows.map((r) => [r.id, r]));
  if (ids.some((id) => !byId.has(id))) throw refuse(400, 'Choose assets from this company', 'ROUND_ASSET_UNKNOWN');
  const archived = ids.map((id) => byId.get(id)!).filter((r) => r.archived_at);
  if (archived.length) throw refuse(400, `Archived assets cannot be inspected: ${archived.map((r) => r.number).join(', ')}. Restore them or leave them out.`, 'ROUND_ASSET_ARCHIVED');
  return byId;
}

/** The checklists named, each a live template of this company. */
async function checkTemplates(db: D1Database, companyId: string, ids: string[]) {
  const unique = [...new Set(ids)];
  const rows = (await db.prepare('SELECT id, name, archived_at FROM mt_insp_templates WHERE company_id = ? AND id IN (SELECT value FROM json_each(?))').bind(companyId, JSON.stringify(unique)).all<{ id: string; name: string; archived_at: number | null }>()).results;
  const byId = new Map(rows.map((r) => [r.id, r]));
  if (unique.some((id) => !byId.has(id))) throw refuse(400, 'Choose a checklist of this company', 'TEMPLATE_UNKNOWN');
  const archived = unique.map((id) => byId.get(id)!).find((r) => r.archived_at);
  if (archived) throw refuse(400, `The checklist "${archived.name}" is archived`, 'TEMPLATE_ARCHIVED');
  return byId;
}

/** The nearest asset above (or equal to) every one of the assets, in one query; null when they share none. */
async function commonParent(db: D1Database, companyId: string, ids: string[]) {
  const r = await db
    .prepare(
      `WITH RECURSIVE up(start, id, parent_id, depth) AS (
         SELECT s.id, s.id, s.parent_id, 0 FROM mt_assets s WHERE s.company_id = ?1 AND s.id IN (SELECT value FROM json_each(?2))
         UNION ALL
         SELECT up.start, p.id, p.parent_id, up.depth + 1 FROM mt_assets p JOIN up ON p.id = up.parent_id WHERE p.company_id = ?1 AND up.depth < 200
       )
       SELECT up.id, MAX(up.depth) AS d, (SELECT x.archived_at FROM mt_assets x WHERE x.company_id = ?1 AND x.id = up.id) AS archived_at
         FROM up GROUP BY up.id HAVING COUNT(DISTINCT up.start) = ?3 ORDER BY d LIMIT 1`,
    )
    .bind(companyId, JSON.stringify(ids), ids.length)
    .first<{ id: string; archived_at: number | null }>();
  return r ? { id: r.id, archived: !!r.archived_at } : null;
}

const lineInsert = (db: D1Database, companyId: string, actorId: string, o: { roundId: string; woId: string; assetId: string; templateId: string; templateName: string; position: number; t: number }) =>
  db
    .prepare('INSERT INTO mt_round_assets (id, company_id, round_id, work_order_id, asset_id, template_id, template_name, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), companyId, o.roundId, o.woId, o.assetId, o.templateId, o.templateName, o.position, actorId, o.t, o.t);

// ------------------------------------------------------------------ make a round, list rounds

roundRoutes.post('/c/:company/inspection-rounds', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const input = await body(c, roundSchema());
  const { templateId, assets, assetId, description, ...rest } = input;
  await checkAssets(db, a.companyId, assets);
  const templates = await checkTemplates(db, a.companyId, [templateId, ...assets.map((x) => x.templateId ?? templateId)]);
  const tpl = templates.get(templateId)!;
  // The work order's own asset: the one sent, else the nearest asset above all of them, else the first one.
  let woAsset = assetId;
  if (!woAsset) {
    const parent = assets.length > 1 ? await commonParent(db, a.companyId, assets.map((x) => x.assetId)) : null;
    woAsset = parent && !parent.archived ? parent.id : assets[0].assetId;
  }
  const n = assets.length;
  const made = await workOrderStatements(db, a, { ...rest, assetId: woAsset, description: description?.trim() || `Inspection round: ${tpl.name}, ${plural(n, 'asset', 'assets')}`, jobType: 'inspection' });
  const roundId = newId();
  const t = made.at;
  await db.batch([
    ...made.stmts,
    db.prepare('INSERT INTO mt_rounds (id, company_id, work_order_id, template_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(roundId, a.companyId, made.id, tpl.id, a.userId, t),
    ...assets.map((x, i) => {
      const lt = templates.get(x.templateId ?? templateId)!;
      return lineInsert(db, a.companyId, a.userId, { roundId, woId: made.id, assetId: x.assetId, templateId: lt.id, templateName: lt.name, position: i + 1, t });
    }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'round.created', assetId: woAsset, workOrderId: made.id, summary: `Inspection round made: ${plural(n, 'asset', 'assets')}, checklist "${tpl.name}"`, after: { roundId, templateId: tpl.id, assets: n }, at: t }),
  ]);
  return c.json({ workOrder: workOrderDTO(await loadWorkOrder(db, a, made.id)), roundId, assets: n }, 201);
});

roundRoutes.get('/c/:company/inspection-rounds', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const scope = workOrderScope(a, 'w');
  const where: string[] = [scope.sql];
  const args: unknown[] = [...scope.args];
  const status = c.req.query('status') ?? 'outstanding';
  if (status === 'completed') where.push("w.status IN ('completed','closed')");
  else if (status !== 'all') where.push(`w.status IN (${sqlList(OUTSTANDING)})`);
  const q = (c.req.query('q') ?? '').trim();
  if (q) {
    where.push('(w.search LIKE ? OR a.search LIKE ?)');
    args.push(likeOf(q), likeOf(q));
  }
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 100, 1), 200);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);
  const cond = where.map((x) => ` AND ${x}`).join('');
  const [rows, total] = await db.batch([
    db
      .prepare(
        `SELECT w.id AS wo_id, w.number, w.description, w.status, w.priority, w.due_start, w.due_finish, a.number AS asset_number, a.name AS asset_name, t.name AS template_name, u.name AS assignee_name,
                COUNT(l.id) AS assets,
                COALESCE(SUM(CASE WHEN l.status <> 'open' THEN 1 ELSE 0 END), 0) AS completed,
                COALESCE(SUM(CASE WHEN l.review = 'not_approved' THEN 1 ELSE 0 END), 0) AS not_approved,
                COALESCE(SUM(CASE WHEN l.status <> 'open' AND l.review = '' THEN 1 ELSE 0 END), 0) AS awaiting,
                COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM mt_round_results r WHERE r.company_id = l.company_id AND r.round_asset_id = l.id AND r.passed = 0) THEN 1 ELSE 0 END), 0) AS exceptions
           FROM mt_rounds ro
           JOIN mt_work_orders w ON w.company_id = ro.company_id AND w.id = ro.work_order_id
           JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id
           JOIN mt_insp_templates t ON t.company_id = ro.company_id AND t.id = ro.template_id
           LEFT JOIN users u ON u.id = w.assigned_to
           LEFT JOIN mt_round_assets l ON l.company_id = ro.company_id AND l.round_id = ro.id
          WHERE ro.company_id = ?${cond}
          GROUP BY ro.id
          ORDER BY COALESCE(w.due_finish, '9999-12-31'), w.number
          LIMIT ? OFFSET ?`,
      )
      .bind(a.companyId, ...args, limit, offset),
    db
      .prepare(`SELECT COUNT(*) AS n FROM mt_rounds ro JOIN mt_work_orders w ON w.company_id = ro.company_id AND w.id = ro.work_order_id JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id WHERE ro.company_id = ?${cond}`)
      .bind(a.companyId, ...args),
  ]);
  return c.json({
    rounds: (rows.results as any[]).map((r) => ({
      workOrderId: r.wo_id,
      number: r.number,
      description: r.description,
      status: r.status,
      priority: r.priority,
      assetNumber: r.asset_number,
      assetName: r.asset_name,
      templateName: r.template_name,
      assignedToName: r.assignee_name ?? null,
      dueStart: r.due_start,
      dueFinish: r.due_finish,
      assets: r.assets,
      completed: r.completed,
      percent: r.assets ? Math.floor((r.completed * 100) / r.assets) : 0,
      exceptions: r.exceptions,
      awaitingApproval: r.awaiting,
      notApproved: r.not_approved,
    })),
    total: (total.results[0] as any)?.n ?? 0,
  });
});

// ------------------------------------------------------------------ one round

const FILTERS = ['all', 'incomplete', 'exceptions', 'awaiting', 'not_approved'] as const;
const FILTER_TEST: Record<(typeof FILTERS)[number], (l: Line) => boolean> = {
  all: () => true,
  incomplete: (l) => l.status === 'open',
  exceptions: (l) => l.failedItems > 0,
  awaiting: (l) => l.review === 'awaiting',
  not_approved: (l) => l.review === 'not_approved',
};

/** The round of a work order with its assets; a work order that is not a round answers { round: null, lines: [] }. */
roundRoutes.get('/c/:company/work-orders/:id/round', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const { w, ro } = await loadRound(db, a, c.req.param('id'));
  if (!ro) return c.json({ round: null, lines: [] });
  const rows = await linesOf(db, a.companyId, w.id);
  const all = rows.map((l) => lineDTO(l, a.companyId));
  const filter = (FILTERS as readonly string[]).includes(c.req.query('filter') ?? '') ? (c.req.query('filter') as (typeof FILTERS)[number]) : 'all';
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const term = q.toLowerCase();
  const lines = all.filter((l, i) => FILTER_TEST[filter](l) && (!term || String(rows[i].asset_search ?? '').includes(term)));
  const locked = isLocked(w);
  const work = canWork(a, w);
  return c.json({
    round: { id: ro.id, templateId: ro.template_id, templateName: ro.template_name, workOrder: workOrderDTO(w), locked, totals: totalsOf(all) },
    ...(c.req.query('summary') === '1' ? {} : { lines }),
    filter,
    q,
    can: { record: work && !locked, manage: isManager(a) && !locked, review: isManager(a) && w.status !== 'cancelled', timer: work && !locked },
  });
});

/** Adds assets to a round (skipping those already on it), up to MAX_PER_ROUND. */
roundRoutes.post('/c/:company/work-orders/:id/round/assets', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const { w, ro } = await loadRound(db, a, c.req.param('id'));
  assertUnlocked(w);
  if (!ro) throw notARound();
  const input = await body(c, z.object({ assets: assetList }));
  const byAsset = await checkAssets(db, a.companyId, input.assets);
  const templates = await checkTemplates(db, a.companyId, input.assets.map((x) => x.templateId ?? ro.template_id));
  const on = await db.prepare('SELECT asset_id, position FROM mt_round_assets WHERE company_id = ? AND work_order_id = ?').bind(a.companyId, w.id).all<{ asset_id: string; position: number }>();
  const have = new Set(on.results.map((r) => r.asset_id));
  const add = input.assets.filter((x) => !have.has(x.assetId));
  const skipped = input.assets.filter((x) => have.has(x.assetId)).map((x) => ({ assetId: x.assetId, number: byAsset.get(x.assetId)!.number }));
  if (have.size + add.length > MAX_PER_ROUND) throw refuse(400, `A round holds up to ${MAX_PER_ROUND} assets`, 'ROUND_TOO_MANY');
  if (!add.length) return c.json({ added: 0, skipped, assets: have.size });
  const start = on.results.reduce((m, r) => Math.max(m, r.position), 0);
  const t = now();
  try {
    await db.batch([
      ...add.map((x, i) => {
        const lt = templates.get(x.templateId ?? ro.template_id)!;
        return lineInsert(db, a.companyId, a.userId, { roundId: ro.id, woId: w.id, assetId: x.assetId, templateId: lt.id, templateName: lt.name, position: start + i + 1, t });
      }),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'round.assets_added', assetId: w.asset_id, workOrderId: w.id, summary: `${plural(add.length, 'asset', 'assets')} added to the round`, after: { assets: add.map((x) => byAsset.get(x.assetId)!.number) }, at: t }),
    ]);
  } catch (e) {
    if (isUnique(e)) throw new HttpError(409, 'Someone added these assets a moment ago: refresh');
    throw e;
  }
  return c.json({ added: add.length, skipped, assets: have.size + add.length });
});

// ------------------------------------------------------------------ one asset of a round

roundRoutes.get('/c/:company/work-orders/:id/round/lines/:lineId', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const { w, ro } = await loadRound(db, a, c.req.param('id'));
  if (!ro) throw notFound('Round asset');
  const l = await loadLine(db, a.companyId, w.id, c.req.param('lineId'));
  const open = l.status === 'open';
  const [items, results, history] = await db.batch([
    db.prepare('SELECT * FROM mt_insp_items WHERE company_id = ? AND template_id = ? AND archived_at IS NULL ORDER BY position, created_at').bind(a.companyId, l.template_id),
    db.prepare('SELECT r.*, u.name AS recorder FROM mt_round_results r LEFT JOIN users u ON u.id = r.recorded_by WHERE r.company_id = ? AND r.round_asset_id = ? ORDER BY r.position').bind(a.companyId, l.id),
    db.prepare("SELECT e.*, u.name AS actor_name FROM mt_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.company_id = ? AND e.work_order_id = ? AND e.asset_id = ? AND e.action LIKE 'round.%' ORDER BY e.created_at DESC LIMIT 50").bind(a.companyId, w.id, l.asset_id),
  ]);
  const rs = results.results as any[];
  const locked = isLocked(w);
  const work = canWork(a, w);
  const manager = isManager(a);
  const segregation = manager && !open && l.completed_by === a.userId && !(await reviewerAlone(db, a)) ? 'You completed this checklist, so another supervisor or administrator reviews it.' : null;
  return c.json({
    line: lineDTO(l, a.companyId),
    round: { id: ro.id, workOrderId: w.id, number: w.number, description: w.description, status: w.status, locked },
    asset: { id: l.asset_id, number: l.asset_number, name: l.asset_name, status: l.asset_status, location: l.asset_location, siteCode: l.site_code ?? null },
    // Open: the checklist's items now. Completed: the items as they were recorded.
    items: open ? (items.results as any[]).map(itemDTO) : rs.map((r) => ({ id: r.item_id, position: r.position, label: r.label, kind: r.kind, unit: r.unit, min: r.min_value, max: r.max_value, required: true, critical: !!r.critical })),
    results: rs.map(resultDTO),
    history: (history.results as any[]).map(eventDTO),
    next: await nextOpen(db, a.companyId, w.id, l.position, l.id),
    can: {
      record: work && !locked && open,
      complete: work && !locked && open,
      approve: manager && !open && w.status !== 'cancelled' && l.review !== 'approved',
      notApprove: manager && !open && !locked,
      remove: manager && !locked && open && Number(l.recorded) === 0,
      changeChecklist: manager && !locked && open && Number(l.recorded) === 0,
    },
    segregation,
  });
});

/** Gives an asset of the round another checklist, while nothing is recorded for it. */
roundRoutes.patch('/c/:company/work-orders/:id/round/lines/:lineId', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const { w, ro } = await loadRound(db, a, c.req.param('id'));
  assertUnlocked(w);
  if (!ro) throw notFound('Round asset');
  const l = await loadLine(db, a.companyId, w.id, c.req.param('lineId'));
  const input = await body(c, z.object({ templateId: zId }));
  const tpl = (await checkTemplates(db, a.companyId, [input.templateId])).get(input.templateId)!;
  if (tpl.id === l.template_id) return c.json({ line: lineDTO(l, a.companyId) });
  const t = now();
  const res = await db.batch([
    db
      .prepare(
        "UPDATE mt_round_assets SET template_id = ?, template_name = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open' AND NOT EXISTS (SELECT 1 FROM mt_round_results r WHERE r.company_id = mt_round_assets.company_id AND r.round_asset_id = mt_round_assets.id)",
      )
      .bind(tpl.id, tpl.name, t, a.companyId, l.id),
    eventIfStmt(
      db,
      { companyId: a.companyId, actorId: a.userId, action: 'round.checklist_changed', assetId: l.asset_id, workOrderId: w.id, summary: `${l.asset_number}: checklist changed from "${l.template_name}" to "${tpl.name}"`, before: { templateId: l.template_id }, after: { templateId: tpl.id }, at: t },
      'EXISTS (SELECT 1 FROM mt_round_assets x WHERE x.company_id = ? AND x.id = ? AND x.template_id = ? AND x.updated_at = ?)',
      [a.companyId, l.id, tpl.id, t],
    ),
  ]);
  if (!res[0].meta.changes) throw refuse(409, `Results are recorded for ${l.asset_number}: its checklist cannot change`, 'ROUND_LINE_HAS_RESULTS');
  return c.json({ line: lineDTO(await loadLine(db, a.companyId, w.id, l.id), a.companyId) });
});

/** Takes an asset off the round, while nothing is recorded for it and it is not the last one. */
roundRoutes.delete('/c/:company/work-orders/:id/round/lines/:lineId', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const { w, ro } = await loadRound(db, a, c.req.param('id'));
  assertUnlocked(w);
  if (!ro) throw notFound('Round asset');
  const l = await loadLine(db, a.companyId, w.id, c.req.param('lineId'));
  if (Number(l.recorded) > 0) throw refuse(409, `Results are recorded for ${l.asset_number}: complete its checklist instead of taking it off the round`, 'ROUND_LINE_HAS_RESULTS');
  if (l.status !== 'open') throw refuse(409, `The checklist of ${l.asset_number} is completed: it stays on the round`, 'ROUND_LINE_DONE');
  const others = await db.prepare('SELECT COUNT(*) AS n FROM mt_round_assets WHERE company_id = ? AND round_id = ? AND id <> ?').bind(a.companyId, ro.id, l.id).first<{ n: number }>();
  if (!others?.n) throw refuse(409, 'A round needs at least one asset: cancel the work order instead', 'ROUND_LAST_ASSET');
  const t = now();
  const res = await db.batch([
    db
      .prepare(
        "DELETE FROM mt_round_assets WHERE company_id = ? AND id = ? AND status = 'open' AND NOT EXISTS (SELECT 1 FROM mt_round_results r WHERE r.company_id = mt_round_assets.company_id AND r.round_asset_id = mt_round_assets.id) AND (SELECT COUNT(*) FROM mt_round_assets x WHERE x.company_id = ? AND x.round_id = ?) > 1",
      )
      .bind(a.companyId, l.id, a.companyId, ro.id),
    eventIfStmt(
      db,
      { companyId: a.companyId, actorId: a.userId, action: 'round.asset_removed', assetId: l.asset_id, workOrderId: w.id, summary: `${l.asset_number} taken off the round`, before: { templateId: l.template_id, position: l.position }, at: t },
      'NOT EXISTS (SELECT 1 FROM mt_round_assets x WHERE x.company_id = ? AND x.id = ?)',
      [a.companyId, l.id],
    ),
  ]);
  if (!res[0].meta.changes) throw refuse(409, `${l.asset_number} changed a moment ago: refresh and try again`, 'ROUND_CONFLICT');
  return c.json({ ok: true });
});

/** Answers recorded on the asset while its checklist is open and its attempt is still this one. */
const OPEN_LINE = "EXISTS (SELECT 1 FROM mt_round_assets l WHERE l.company_id = ? AND l.id = ? AND l.status = 'open' AND l.attempt = ?)";

/** Records results for some or all items of an asset's checklist (each again replaces the last). */
roundRoutes.put('/c/:company/work-orders/:id/round/lines/:lineId/results', async (c) => {
  const { a, w, db } = await workable(c);
  const l = await loadLine(db, a.companyId, w.id, c.req.param('lineId'));
  if (l.status !== 'open') throw lineDone(l);
  const input = await body(c, z.object({ results: z.array(resultInput).min(1).max(100) }));
  const items = await liveItems(db, a.companyId, l.template_id);
  const byId = new Map(items.map((x) => [x.id, x]));
  const given = new Map(input.results.map((r) => [r.itemId, r]));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let failed = 0;
  for (const r of given.values()) {
    const item = byId.get(r.itemId);
    if (!item) throw new HttpError(400, 'That item is not on this checklist');
    const ev = evaluate({ ...item, required: 0 }, r, item.position);
    if (!ev) continue;
    if (ev.passed === 0) failed++;
    stmts.push(
      db
        .prepare(
          `INSERT INTO mt_round_results (id, company_id, round_asset_id, item_id, position, label, kind, unit, min_value, max_value, critical, passed, value_num, value_text, note, recorded_by, recorded_at)
           SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE ${OPEN_LINE}
           ON CONFLICT(company_id, round_asset_id, item_id) DO UPDATE SET passed = excluded.passed, value_num = excluded.value_num, value_text = excluded.value_text, note = excluded.note, label = excluded.label, kind = excluded.kind,
             unit = excluded.unit, min_value = excluded.min_value, max_value = excluded.max_value, critical = excluded.critical, position = excluded.position, recorded_by = excluded.recorded_by, recorded_at = excluded.recorded_at`,
        )
        .bind(newId(), a.companyId, l.id, item.id, item.position, item.label, item.kind, item.unit ?? '', item.min_value, item.max_value, item.critical ? 1 : 0, ev.passed, ev.value, ev.text, ev.note, a.userId, t, a.companyId, l.id, l.attempt),
    );
  }
  const progress = async () => {
    const r = await db
      .prepare('SELECT COUNT(*) AS n FROM mt_round_results r JOIN mt_insp_items i ON i.company_id = r.company_id AND i.id = r.item_id WHERE r.company_id = ? AND r.round_asset_id = ? AND i.template_id = ? AND i.archived_at IS NULL')
      .bind(a.companyId, l.id, l.template_id)
      .first<{ n: number }>();
    const answered = Number(r?.n ?? 0);
    return { answered, questions: items.length, percent: items.length ? Math.floor((answered * 100) / items.length) : 0 };
  };
  if (!stmts.length) return c.json({ recorded: 0, failed: 0, ...(await progress()) });
  const n = stmts.length;
  stmts.push(
    eventIfStmt(
      db,
      { companyId: a.companyId, actorId: a.userId, action: 'round.recorded', assetId: l.asset_id, workOrderId: w.id, summary: `${l.asset_number}: ${plural(n, 'result', 'results')} recorded${failed ? `, ${failed} failed` : ''}`, after: { recorded: n, failed }, at: t },
      OPEN_LINE,
      [a.companyId, l.id, l.attempt],
    ),
  );
  const res = await db.batch(stmts);
  if (!res[0].meta.changes) throw lineDone(l);
  return c.json({ recorded: n, failed, ...(await progress()) });
});

/** Completes an asset's checklist: every required item has a result; a failure makes its follow-up once. */
roundRoutes.post('/c/:company/work-orders/:id/round/lines/:lineId/complete', async (c) => {
  const { a, w, db } = await workable(c);
  const l = await loadLine(db, a.companyId, w.id, c.req.param('lineId'));
  if (l.status !== 'open') throw lineDone(l);
  const [itemsRes, recordedRes, tplRes] = await db.batch([
    db.prepare('SELECT * FROM mt_insp_items WHERE company_id = ? AND template_id = ? AND archived_at IS NULL ORDER BY position, created_at').bind(a.companyId, l.template_id),
    db.prepare('SELECT * FROM mt_round_results WHERE company_id = ? AND round_asset_id = ? ORDER BY position').bind(a.companyId, l.id),
    db.prepare('SELECT fail_action FROM mt_insp_templates WHERE company_id = ? AND id = ?').bind(a.companyId, l.template_id),
  ]);
  const items = itemsRes.results as any[];
  const recorded = recordedRes.results as any[];
  const have = new Set(recorded.map((r) => r.item_id));
  const missing = items.filter((x) => x.required && !have.has(x.id));
  if (missing.length) throw refuse(400, `Record every required item first: ${missing.map((x) => x.label).join(', ')}`, 'ROUND_LINE_MISSING');
  const failedItems = recorded.filter((r) => r.passed === 0);
  const status = failedItems.length ? 'failed' : 'passed';
  const earlier = followUpOf(l);
  const action = failedItems.length && !earlier ? ((tplRes.results[0] as any)?.fail_action ?? 'work_order') : 'none';
  const t = now();
  const what = failedItems.map((r) => `${r.label}${r.kind === 'number' && r.value_num !== null ? ` (${r.value_num}${r.unit ? ` ${r.unit}` : ''})` : ''}`).join('; ');
  const made = await followUpStatements(db, a, {
    action,
    assetId: l.asset_id,
    from: w,
    description: `Follow-up of the failed inspection "${l.template_name}" of ${l.asset_number} ${l.asset_name} on the inspection round ${w.number}: ${what}`.slice(0, 5000),
    woSummary: (number) => `Work order ${number} made as the follow-up of the failed inspection "${l.template_name}" of ${l.asset_number} on the inspection round ${w.number}`,
    reqSummary: (number) => `Request ${number} raised as the follow-up of the failed inspection "${l.template_name}" of ${l.asset_number} on the inspection round ${w.number}`,
    woAfter: { from: w.id, roundAsset: l.id },
    t,
  });
  const fu = made.followUp;
  try {
    await db.batch([
      doneStmt(db, a.companyId, `round-asset:${l.id}:${l.attempt}`, t),
      ...made.stmts,
      db
        .prepare(
          "UPDATE mt_round_assets SET status = ?, completed_at = ?, completed_by = ?, follow_up_work_order_id = COALESCE(follow_up_work_order_id, ?), follow_up_request_id = COALESCE(follow_up_request_id, ?), review = '', review_note = '', reviewed_by = NULL, reviewed_at = NULL, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open' AND attempt = ?",
        )
        .bind(status, t, a.userId, fu?.kind === 'work_order' ? fu.id : null, fu?.kind === 'request' ? fu.id : null, t, a.companyId, l.id, l.attempt),
      eventStmt(db, {
        companyId: a.companyId,
        actorId: a.userId,
        action: status === 'failed' ? 'round.asset_failed' : 'round.asset_passed',
        assetId: l.asset_id,
        workOrderId: w.id,
        summary: `${l.asset_number}: checklist "${l.template_name}" ${status}${failedItems.length ? `: ${what}` : ''}${fu ? `; follow-up ${fu.number}` : ''}`,
        after: { status, failed: failedItems.length, attempt: l.attempt, followUp: fu?.number ?? null },
        at: t,
      }),
    ]);
  } catch (e) {
    if (isUnique(e)) throw refuse(409, `The checklist of ${l.asset_number} was completed a moment ago: refresh to see it`, 'ROUND_CONFLICT');
    throw e;
  }
  const after = await linesOf(db, a.companyId, w.id);
  const lines = after.map((x) => lineDTO(x, a.companyId));
  return c.json({
    status,
    failed: failedItems.length,
    followUp: fu ?? earlier,
    followUpMade: !!fu,
    next: await nextOpen(db, a.companyId, w.id, l.position, l.id),
    totals: totalsOf(lines),
    line: lines.find((x) => x.id === l.id) ?? null,
  });
});

/**
 * A supervisor's or administrator's decision on a completed asset: approved, or not approved with a reason (open again,
 * attempt + 1, results kept). The person who completed it cannot decide it unless nobody else active in the company is a
 * maintenance supervisor or administrator; the history then records the exception.
 */
roundRoutes.post('/c/:company/work-orders/:id/round/lines/:lineId/decide', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const { w, ro } = await loadRound(db, a, c.req.param('id'));
  if (!ro) throw notFound('Round asset');
  const l = await loadLine(db, a.companyId, w.id, c.req.param('lineId'));
  const input = await body(c, z.object({ decision: z.enum(['approved', 'not_approved']), note: zText(1000).optional() }));
  if (l.status === 'open') throw refuse(409, `Complete the checklist of ${l.asset_number} first`, 'ROUND_NOT_COMPLETED');
  if (w.status === 'cancelled') throw refuse(409, `${w.number} is cancelled`, 'ROUND_CANCELLED');
  let exception = false;
  if (l.completed_by === a.userId) {
    if (!(await reviewerAlone(db, a))) throw refuse(403, `You completed the checklist of ${l.asset_number}, so another supervisor or administrator must review it (segregation of duties)`, 'SEGREGATION');
    exception = true;
  }
  const note = (input.note ?? '').trim();
  const suffix = exception ? ' (no other supervisor or administrator: the segregation exception is recorded)' : '';
  // The exception always fits in the line of history: a long note is cut before it.
  const summary = (text: string) => `${text.slice(0, 500 - suffix.length)}${suffix}`;
  const t = now();
  let res: D1Result[];
  if (input.decision === 'approved') {
    if (l.review === 'approved') throw refuse(409, `${l.asset_number} is already approved`, 'ROUND_REVIEWED');
    res = await db.batch([
      db
        .prepare("UPDATE mt_round_assets SET review = 'approved', review_note = ?, reviewed_by = ?, reviewed_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('passed','failed') AND review <> 'approved' AND attempt = ?")
        .bind(note, a.userId, t, t, a.companyId, l.id, l.attempt),
      eventIfStmt(
        db,
        { companyId: a.companyId, actorId: a.userId, action: 'round.approved', assetId: l.asset_id, workOrderId: w.id, summary: summary(`${l.asset_number}: checklist "${l.template_name}" approved${note ? `: ${note}` : ''}`), before: { review: l.review }, after: { review: 'approved', note, segregationException: exception }, at: t },
        "EXISTS (SELECT 1 FROM mt_round_assets x WHERE x.company_id = ? AND x.id = ? AND x.review = 'approved' AND x.reviewed_at = ?)",
        [a.companyId, l.id, t],
      ),
    ]);
  } else {
    if (!note) throw new HttpError(400, 'Say why it is not approved');
    if (isLocked(w)) throw refuse(409, `${w.number} is ${w.status === 'closed' ? 'closed' : 'completed'} and locked. Reopen it with a reason, then mark ${l.asset_number} not approved so its checklist is done again.`, 'ROUND_LOCKED');
    res = await db.batch([
      db
        .prepare(
          `UPDATE mt_round_assets SET status = 'open', attempt = attempt + 1, completed_at = NULL, completed_by = NULL, review = 'not_approved', review_note = ?, reviewed_by = ?, reviewed_at = ?, updated_at = ?
            WHERE company_id = ? AND id = ? AND status IN ('passed','failed') AND attempt = ? AND EXISTS (SELECT 1 FROM mt_work_orders w WHERE w.company_id = ? AND w.id = ? AND w.status IN (${sqlList(OUTSTANDING)}))`,
        )
        .bind(note, a.userId, t, t, a.companyId, l.id, l.attempt, a.companyId, w.id),
      eventIfStmt(
        db,
        { companyId: a.companyId, actorId: a.userId, action: 'round.not_approved', assetId: l.asset_id, workOrderId: w.id, summary: summary(`${l.asset_number}: checklist "${l.template_name}" not approved: ${note}`), before: { status: l.status, review: l.review, attempt: l.attempt }, after: { status: 'open', review: 'not_approved', attempt: l.attempt + 1, note, segregationException: exception }, at: t },
        "EXISTS (SELECT 1 FROM mt_round_assets x WHERE x.company_id = ? AND x.id = ? AND x.review = 'not_approved' AND x.attempt = ?)",
        [a.companyId, l.id, l.attempt + 1],
      ),
    ]);
  }
  if (!res[0].meta.changes) throw refuse(409, `${l.asset_number} changed a moment ago: refresh and try again`, 'ROUND_CONFLICT');
  return c.json({ line: lineDTO(await loadLine(db, a.companyId, w.id, l.id), a.companyId), segregationException: exception });
});

// ------------------------------------------------------------------ the job card (stream D)

/**
 * A round for the printed job card: each asset with its site, checklist, status and review, and its items (the
 * checklist's items now for an open asset, the results as recorded for a completed one). No costs. Null when the work
 * order is not a round.
 */
export async function roundForCard(db: D1Database, a: Pick<MtAccess, 'companyId'>, w: { id: string }) {
  const ro = await db
    .prepare('SELECT ro.id, t.name AS template_name FROM mt_rounds ro JOIN mt_insp_templates t ON t.company_id = ro.company_id AND t.id = ro.template_id WHERE ro.company_id = ? AND ro.work_order_id = ?')
    .bind(a.companyId, w.id)
    .first<{ id: string; template_name: string }>();
  if (!ro) return null;
  const [lines, results, items] = await db.batch([
    db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.work_order_id = ? ORDER BY l.position LIMIT ${MAX_PER_ROUND}`).bind(a.companyId, w.id),
    db.prepare('SELECT r.*, u.name AS recorder FROM mt_round_results r JOIN mt_round_assets l ON l.company_id = r.company_id AND l.id = r.round_asset_id LEFT JOIN users u ON u.id = r.recorded_by WHERE l.company_id = ? AND l.work_order_id = ? ORDER BY r.position').bind(a.companyId, w.id),
    db
      .prepare("SELECT it.*, l.id AS line_id FROM mt_round_assets l JOIN mt_insp_items it ON it.company_id = l.company_id AND it.template_id = l.template_id AND it.archived_at IS NULL WHERE l.company_id = ? AND l.work_order_id = ? AND l.status = 'open' ORDER BY it.position, it.created_at")
      .bind(a.companyId, w.id),
  ]);
  const rs = results.results as any[];
  const its = items.results as any[];
  return {
    id: ro.id,
    templateName: ro.template_name,
    lines: (lines.results as any[]).map((l) => {
      const mine = rs.filter((r) => r.round_asset_id === l.id);
      return {
        id: l.id as string,
        position: l.position as number,
        assetNumber: l.asset_number as string,
        assetName: l.asset_name as string,
        siteCode: (l.site_code ?? null) as string | null,
        templateName: l.template_name as string,
        status: l.status as 'open' | 'passed' | 'failed',
        attempt: l.attempt as number,
        review: reviewOf(l),
        reviewNote: l.review_note as string,
        completedAt: l.completed_at as number | null,
        completedByName: (l.completer ?? null) as string | null,
        items: l.status === 'open' ? its.filter((x) => x.line_id === l.id).map(itemDTO) : mine.map((r) => ({ id: r.item_id, position: r.position, label: r.label, kind: r.kind, unit: r.unit, min: r.min_value, max: r.max_value, required: true, critical: !!r.critical })),
        results: mine.map(resultDTO),
      };
    }),
  };
}
