// Inspection templates, inspections on work orders and prestart checks (stages M2 and M3), under
// /api/maintenance/c/:company/...
//
//   Templates   checklists of pass/fail, number (with limits) and text items; an item may be required and critical.
//               What a failed inspection makes (one corrective work order, one request, or nothing) is the template's.
//   Inspections a template attached to a work order (by hand, or by the preventive maintenance schedule that made it).
//               The technician records each item; completing it locks the results, and a failed one makes its follow-up
//               once (a once-only key in the same transaction: two completions at the same moment make one).
//   Prestarts   a quick check of an asset before use, from a phone. Any failure raises one request; a failed critical
//               item also sets the asset out of service. That is the one place Maintenance changes an asset's status by
//               itself, and it is recorded on the prestart and in the asset's history with the status before. A work
//               order's status still never changes the asset's status.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { deny, isManager, requireMt, type MtAccess } from './access';
import { loadAsset } from './routes-assets';
import { assertUnlocked, canWork, loadWorkOrder } from './routes-work';
import { requireApproval } from './routes-requests';
import { eventStmt, nextNumber, searchText, zId, zText } from './util';
import { doneStmt, isUnique, todayNear } from './m2util';
import { loadMeter, readingStatements } from './routes-meters';
import { generateDue } from './pm';

export const inspectionRoutes = new Hono<AppEnv>();

export const ITEM_KINDS = ['pass_fail', 'number', 'text'] as const;
export const FAIL_ACTIONS = ['work_order', 'request', 'none'] as const;

const itemSchema = z.object({
  id: zId.optional(),
  label: zText(300).min(1),
  kind: z.enum(ITEM_KINDS),
  unit: zText(20).optional(),
  min: z.number().finite().nullable().optional(),
  max: z.number().finite().nullable().optional(),
  required: z.boolean().optional(),
  critical: z.boolean().optional(),
});
const templateSchema = z.object({ name: zText(200).min(1), description: zText(2000).optional(), failAction: z.enum(FAIL_ACTIONS).optional(), items: z.array(itemSchema).min(1).max(100) });

const itemDTO = (i: any) => ({ id: i.id, position: i.position, label: i.label, kind: i.kind, unit: i.unit, min: i.min_value, max: i.max_value, required: !!i.required, critical: !!i.critical });
const resultDTO = (r: any) => ({ id: r.id, itemId: r.item_id, position: r.position, label: r.label, kind: r.kind, unit: r.unit, min: r.min_value, max: r.max_value, critical: !!r.critical, passed: r.passed === null ? null : !!r.passed, value: r.value_num, text: r.value_text, note: r.note, recordedBy: r.recorded_by, recordedByName: r.recorder ?? null, recordedAt: r.recorded_at });

async function loadTemplate(db: D1Database, companyId: string, id: string) {
  const t = await db.prepare('SELECT * FROM mt_insp_templates WHERE company_id = ? AND id = ?').bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!t) throw notFound('Inspection template');
  const items = await db.prepare('SELECT * FROM mt_insp_items WHERE company_id = ? AND template_id = ? AND archived_at IS NULL ORDER BY position, created_at').bind(companyId, t.id).all<any>();
  return { t, items: items.results };
}

function checkItem(i: z.infer<typeof itemSchema>, n: number) {
  if (i.kind !== 'number' && (i.min != null || i.max != null)) throw new HttpError(400, `Item ${n}: only number items have limits`);
  if (i.min != null && i.max != null && i.min > i.max) throw new HttpError(400, `Item ${n}: the minimum cannot be above the maximum`);
}

// ------------------------------------------------------------------ templates

inspectionRoutes.get('/c/:company/inspection-templates', async (c) => {
  const a = await requireMt(c);
  const rows = await c.env.DB.prepare(
    `SELECT t.*, (SELECT COUNT(*) FROM mt_insp_items i WHERE i.company_id = t.company_id AND i.template_id = t.id AND i.archived_at IS NULL) AS items,
            (SELECT COUNT(*) FROM mt_insp_items i WHERE i.company_id = t.company_id AND i.template_id = t.id AND i.archived_at IS NULL AND i.critical = 1) AS critical
       FROM mt_insp_templates t WHERE t.company_id = ? ${c.req.query('archived') === '1' ? '' : 'AND t.archived_at IS NULL'} ORDER BY t.name COLLATE NOCASE LIMIT 300`,
  )
    .bind(a.companyId)
    .all<any>();
  return c.json({ templates: rows.results.map((t) => ({ id: t.id, name: t.name, description: t.description, failAction: t.fail_action, items: t.items, critical: t.critical, archived: !!t.archived_at })), can: { manage: isManager(a) } });
});

inspectionRoutes.post('/c/:company/inspection-templates', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const input = await body(c, templateSchema);
  input.items.forEach((i, n) => checkItem(i, n + 1));
  if (await db.prepare('SELECT 1 FROM mt_insp_templates WHERE company_id = ? AND name = ?').bind(a.companyId, input.name).first()) throw new HttpError(409, `A template called ${input.name} already exists`);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO mt_insp_templates (id, company_id, name, description, fail_action, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, input.name, input.description ?? '', input.failAction ?? 'work_order', a.userId, t, t),
    ...input.items.map((i, n) =>
      db
        .prepare('INSERT INTO mt_insp_items (id, company_id, template_id, position, label, kind, unit, min_value, max_value, required, critical, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), a.companyId, id, n + 1, i.label, i.kind, i.unit ?? '', i.min ?? null, i.max ?? null, i.required === false ? 0 : 1, i.critical ? 1 : 0, t),
    ),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection_template.created', summary: `Inspection template "${input.name}" created with ${input.items.length} items`, after: { templateId: id, name: input.name, failAction: input.failAction ?? 'work_order' }, at: t }),
  ]);
  const { t: tpl, items } = await loadTemplate(db, a.companyId, id);
  return c.json({ id: tpl.id, name: tpl.name, description: tpl.description, failAction: tpl.fail_action, archived: false, items: items.map(itemDTO) }, 201);
});

inspectionRoutes.get('/c/:company/inspection-templates/:id', async (c) => {
  const a = await requireMt(c);
  const { t, items } = await loadTemplate(c.env.DB, a.companyId, c.req.param('id'));
  return c.json({ id: t.id, name: t.name, description: t.description, failAction: t.fail_action, archived: !!t.archived_at, items: items.map(itemDTO), can: { manage: isManager(a) } });
});

/** Changes a template. Items left out are archived (results keep their own copy); new items are added. */
inspectionRoutes.patch('/c/:company/inspection-templates/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const { t: tpl, items } = await loadTemplate(db, a.companyId, c.req.param('id'));
  const input = await body(c, templateSchema.partial().extend({ archived: z.boolean().optional() }));
  if (input.name && input.name.toLowerCase() !== String(tpl.name).toLowerCase() && (await db.prepare('SELECT 1 FROM mt_insp_templates WHERE company_id = ? AND name = ? AND id <> ?').bind(a.companyId, input.name, tpl.id).first())) {
    throw new HttpError(409, `A template called ${input.name} already exists`);
  }
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db
      .prepare('UPDATE mt_insp_templates SET name = ?, description = ?, fail_action = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?')
      .bind(input.name ?? tpl.name, input.description ?? tpl.description, input.failAction ?? tpl.fail_action, input.archived === undefined ? tpl.archived_at : input.archived ? (tpl.archived_at ?? t) : null, t, a.companyId, tpl.id),
  ];
  if (input.items) {
    input.items.forEach((i, n) => checkItem(i, n + 1));
    const known = new Set(items.map((i) => i.id));
    const kept = new Set<string>();
    input.items.forEach((i, n) => {
      if (i.id && known.has(i.id)) {
        kept.add(i.id);
        stmts.push(db.prepare('UPDATE mt_insp_items SET position = ?, label = ?, kind = ?, unit = ?, min_value = ?, max_value = ?, required = ?, critical = ? WHERE company_id = ? AND id = ?').bind(n + 1, i.label, i.kind, i.unit ?? '', i.min ?? null, i.max ?? null, i.required === false ? 0 : 1, i.critical ? 1 : 0, a.companyId, i.id));
      } else {
        stmts.push(db.prepare('INSERT INTO mt_insp_items (id, company_id, template_id, position, label, kind, unit, min_value, max_value, required, critical, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, tpl.id, n + 1, i.label, i.kind, i.unit ?? '', i.min ?? null, i.max ?? null, i.required === false ? 0 : 1, i.critical ? 1 : 0, t));
      }
    });
    for (const i of items) if (!kept.has(i.id)) stmts.push(db.prepare('UPDATE mt_insp_items SET archived_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, i.id));
  }
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection_template.updated', summary: `Inspection template "${input.name ?? tpl.name}" changed${input.archived === true ? ' (archived)' : ''}`, at: t }));
  await db.batch(stmts);
  const after = await loadTemplate(db, a.companyId, tpl.id);
  return c.json({ id: after.t.id, name: after.t.name, description: after.t.description, failAction: after.t.fail_action, archived: !!after.t.archived_at, items: after.items.map(itemDTO) });
});

/** The prestart checklist of an asset (or none). */
inspectionRoutes.put('/c/:company/assets/:id/prestart', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const asset = await loadAsset(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ templateId: zId.nullable() }));
  let name = '';
  if (input.templateId) {
    const { t } = await loadTemplate(db, a.companyId, input.templateId);
    if (t.archived_at) throw new HttpError(400, 'That template is archived');
    name = t.name;
  }
  const t = now();
  await db.batch([
    input.templateId
      ? db.prepare('INSERT INTO mt_asset_prestart (company_id, asset_id, template_id, set_by, set_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id, asset_id) DO UPDATE SET template_id = excluded.template_id, set_by = excluded.set_by, set_at = excluded.set_at').bind(a.companyId, asset.id, input.templateId, a.userId, t)
      : db.prepare('DELETE FROM mt_asset_prestart WHERE company_id = ? AND asset_id = ?').bind(a.companyId, asset.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'asset.prestart', assetId: asset.id, summary: input.templateId ? `Prestart checklist set: ${name}` : 'Prestart checklist removed', at: t }),
  ]);
  return c.json({ templateId: input.templateId, name: name || null });
});

// ------------------------------------------------------------------ results

const resultInput = z.object({ itemId: zId, passed: z.boolean().nullable().optional(), value: z.number().finite().nullable().optional(), text: zText(2000).optional(), note: zText(1000).optional() });
type ResultInput = z.infer<typeof resultInput>;

/** A result checked against its item: pass/fail as given, a number inside its limits, text recorded (never failing). */
function evaluate(item: any, r: ResultInput | undefined, n: number): { passed: number | null; value: number | null; text: string; note: string } | null {
  const given = r && (r.passed !== undefined && r.passed !== null ? true : r.value !== undefined && r.value !== null ? true : !!r.text?.trim());
  if (!r || !given) {
    if (item.required) throw new HttpError(400, `Item ${n} (${item.label}) needs a result`);
    return null;
  }
  if (item.kind === 'pass_fail') {
    if (typeof r.passed !== 'boolean') throw new HttpError(400, `Item ${n} (${item.label}): choose pass or fail`);
    return { passed: r.passed ? 1 : 0, value: null, text: r.text ?? '', note: r.note ?? '' };
  }
  if (item.kind === 'number') {
    if (typeof r.value !== 'number') throw new HttpError(400, `Item ${n} (${item.label}): enter a number`);
    const ok = (item.min_value === null || r.value >= item.min_value) && (item.max_value === null || r.value <= item.max_value);
    return { passed: ok ? 1 : 0, value: r.value, text: '', note: r.note ?? '' };
  }
  return { passed: null, value: null, text: (r.text ?? '').trim(), note: r.note ?? '' };
}

function resultStmt(db: D1Database, companyId: string, item: any, ev: NonNullable<ReturnType<typeof evaluate>>, target: { inspectionId?: string; prestartId?: string }, actorId: string, t: number) {
  return db
    .prepare(
      `INSERT INTO mt_insp_results (id, company_id, inspection_id, prestart_id, item_id, position, label, kind, unit, min_value, max_value, critical, passed, value_num, value_text, note, recorded_by, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(inspection_id, item_id) WHERE inspection_id IS NOT NULL DO UPDATE SET passed = excluded.passed, value_num = excluded.value_num, value_text = excluded.value_text, note = excluded.note, recorded_by = excluded.recorded_by, recorded_at = excluded.recorded_at`,
    )
    .bind(newId(), companyId, target.inspectionId ?? null, target.prestartId ?? null, item.id, item.position, item.label, item.kind, item.unit, item.min_value, item.max_value, item.critical, ev.passed, ev.value, ev.text, ev.note, actorId, t);
}

// ------------------------------------------------------------------ inspections on work orders

export async function inspectionsOf(db: D1Database, companyId: string, woId: string) {
  const [insp, results, items] = await db.batch([
    db.prepare('SELECT i.*, u.name AS completer, fw.number AS fw_number, fr.number AS fr_number FROM mt_wo_inspections i LEFT JOIN users u ON u.id = i.completed_by LEFT JOIN mt_work_orders fw ON fw.company_id = i.company_id AND fw.id = i.follow_up_work_order_id LEFT JOIN mt_requests fr ON fr.company_id = i.company_id AND fr.id = i.follow_up_request_id WHERE i.company_id = ? AND i.work_order_id = ? ORDER BY i.created_at').bind(companyId, woId),
    db.prepare('SELECT r.*, u.name AS recorder FROM mt_insp_results r JOIN mt_wo_inspections i ON i.company_id = r.company_id AND i.id = r.inspection_id LEFT JOIN users u ON u.id = r.recorded_by WHERE i.company_id = ? AND i.work_order_id = ? ORDER BY r.position').bind(companyId, woId),
    db.prepare('SELECT it.*, i.id AS inspection_id FROM mt_wo_inspections i JOIN mt_insp_items it ON it.company_id = i.company_id AND it.template_id = i.template_id AND it.archived_at IS NULL WHERE i.company_id = ? AND i.work_order_id = ? ORDER BY it.position').bind(companyId, woId),
  ]);
  return (insp.results as any[]).map((i) => {
    const rs = (results.results as any[]).filter((r) => r.inspection_id === i.id);
    // Open: the template's items now, with what is recorded so far. Completed: the results as they were recorded.
    const its = i.status === 'open' ? (items.results as any[]).filter((x) => x.inspection_id === i.id).map(itemDTO) : rs.map((r) => ({ id: r.item_id, position: r.position, label: r.label, kind: r.kind, unit: r.unit, min: r.min_value, max: r.max_value, required: true, critical: !!r.critical }));
    return {
      id: i.id,
      templateId: i.template_id,
      templateName: i.template_name,
      status: i.status,
      completedAt: i.completed_at,
      completedByName: i.completer ?? null,
      followUp: i.follow_up_work_order_id ? { kind: 'work_order', id: i.follow_up_work_order_id, number: i.fw_number } : i.follow_up_request_id ? { kind: 'request', id: i.follow_up_request_id, number: i.fr_number } : null,
      items: its,
      results: rs.map(resultDTO),
      failed: rs.filter((r) => r.passed === 0).length,
    };
  });
}

async function workableWo(c: any) {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB as D1Database;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  if (!canWork(a, w)) deny('Only the assigned technician, a supervisor or an administrator can work on this work order');
  assertUnlocked(w);
  return { a, w, db };
}

inspectionRoutes.post('/c/:company/work-orders/:id/inspections', async (c) => {
  const { a, w, db } = await workableWo(c);
  const input = await body(c, z.object({ templateId: zId }));
  const { t: tpl } = await loadTemplate(db, a.companyId, input.templateId);
  if (tpl.archived_at) throw new HttpError(400, 'That template is archived');
  const id = newId();
  const t = now();
  try {
    await db.batch([
      db.prepare("INSERT INTO mt_wo_inspections (id, company_id, work_order_id, template_id, template_name, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, 'open', ?, ?)").bind(id, a.companyId, w.id, tpl.id, tpl.name, a.userId, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.added', assetId: w.asset_id, workOrderId: w.id, summary: `Inspection "${tpl.name}" added`, at: t }),
    ]);
  } catch (e) {
    if (isUnique(e)) throw new HttpError(409, `"${tpl.name}" is already on ${w.number}`);
    throw e;
  }
  return c.json({ id }, 201);
});

async function openInspection(db: D1Database, a: MtAccess, woId: string, inspId: string) {
  const i = await db.prepare('SELECT * FROM mt_wo_inspections WHERE company_id = ? AND work_order_id = ? AND id = ?').bind(a.companyId, woId, inspId).first<any>();
  if (!i) throw notFound('Inspection');
  if (i.status !== 'open') throw new HttpError(409, `The inspection "${i.template_name}" is completed: its results are locked`);
  const items = await db.prepare('SELECT * FROM mt_insp_items WHERE company_id = ? AND template_id = ? AND archived_at IS NULL ORDER BY position').bind(a.companyId, i.template_id).all<any>();
  return { i, items: items.results };
}

/** Records results (some or all items; each again replaces the last). */
inspectionRoutes.put('/c/:company/work-orders/:id/inspections/:inspId/results', async (c) => {
  const { a, w, db } = await workableWo(c);
  const { i, items } = await openInspection(db, a, w.id, c.req.param('inspId'));
  const input = await body(c, z.object({ results: z.array(resultInput).min(1).max(100) }));
  const byId = new Map(items.map((x) => [x.id, x]));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let failed = 0;
  for (const r of input.results) {
    const item = byId.get(r.itemId);
    if (!item) throw new HttpError(400, 'That item is not on this inspection');
    const ev = evaluate({ ...item, required: 0 }, r, item.position);
    if (!ev) continue;
    if (ev.passed === 0) failed++;
    stmts.push(resultStmt(db, a.companyId, item, ev, { inspectionId: i.id }, a.userId, t));
  }
  if (!stmts.length) return c.json({ ok: true, recorded: 0 });
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.recorded', assetId: w.asset_id, workOrderId: w.id, summary: `Inspection "${i.template_name}": ${stmts.length} ${stmts.length === 1 ? 'result' : 'results'} recorded${failed ? `, ${failed} failed` : ''}`, at: t }));
  await db.batch(stmts);
  return c.json({ ok: true, recorded: stmts.length - 1, failed });
});

/** Completes an inspection: every required item has a result; a failure makes its follow-up once. */
inspectionRoutes.post('/c/:company/work-orders/:id/inspections/:inspId/complete', async (c) => {
  const { a, w, db } = await workableWo(c);
  const { i, items } = await openInspection(db, a, w.id, c.req.param('inspId'));
  const recorded = (await db.prepare('SELECT * FROM mt_insp_results WHERE company_id = ? AND inspection_id = ?').bind(a.companyId, i.id).all<any>()).results;
  const have = new Map(recorded.map((r) => [r.item_id, r]));
  const missing = items.filter((x) => x.required && !have.has(x.id));
  if (missing.length) throw new HttpError(400, `Record every required item first: ${missing.map((x) => x.label).join(', ')}`);
  const failedItems = recorded.filter((r) => r.passed === 0);
  const status = failedItems.length ? 'failed' : 'passed';
  const tpl = await db.prepare('SELECT fail_action FROM mt_insp_templates WHERE company_id = ? AND id = ?').bind(a.companyId, i.template_id).first<{ fail_action: string }>();
  const action = failedItems.length ? (tpl?.fail_action ?? 'work_order') : 'none';
  const t = now();
  const what = failedItems.map((r) => `${r.label}${r.kind === 'number' && r.value_num !== null ? ` (${r.value_num}${r.unit ? ` ${r.unit}` : ''})` : ''}`).join('; ');
  const description = `Follow-up of the failed inspection "${i.template_name}" on ${w.number}: ${what}`.slice(0, 5000);
  const stmts: D1PreparedStatement[] = [doneStmt(db, a.companyId, `inspection-complete:${i.id}`, t)];
  let followUp: { kind: string; id: string; number: string } | null = null;
  if (action === 'work_order') {
    const id = newId();
    const number = await nextNumber(db, a.companyId, 'work_order');
    stmts.push(
      db
        .prepare("INSERT INTO mt_work_orders (id, company_id, number, asset_id, description, job_type, priority, status, department, department_id, trade, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'corrective', ?, 'open', ?, ?, ?, ?, ?, ?, ?)")
        .bind(id, a.companyId, number, w.asset_id, description, w.priority === 'low' ? 'medium' : w.priority, w.department, w.department_id, w.trade, searchText(number, description, w.trade), a.userId, t, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_order.created', assetId: w.asset_id, workOrderId: id, summary: `Work order ${number} made as the follow-up of the failed inspection "${i.template_name}" on ${w.number}`, after: { from: w.id, inspection: i.id }, at: t }),
    );
    followUp = { kind: 'work_order', id, number };
  } else if (action === 'request') {
    const id = newId();
    const number = await nextNumber(db, a.companyId, 'request');
    const rstatus = (await requireApproval(db, a.companyId)) ? 'awaiting_approval' : 'submitted';
    stmts.push(
      db
        .prepare('INSERT INTO mt_requests (id, company_id, number, description, asset_id, priority, department, department_id, status, requested_by, search, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(id, a.companyId, number, description, w.asset_id, w.priority === 'low' ? 'medium' : w.priority, w.department, w.department_id, rstatus, a.userId, searchText(number, description, w.department), t, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.created', assetId: w.asset_id, requestId: id, workOrderId: w.id, summary: `Request ${number} raised as the follow-up of the failed inspection "${i.template_name}" on ${w.number}`, after: { status: rstatus }, at: t }),
    );
    followUp = { kind: 'request', id, number };
  }
  stmts.push(
    db
      .prepare("UPDATE mt_wo_inspections SET status = ?, completed_at = ?, completed_by = ?, follow_up_work_order_id = ?, follow_up_request_id = ? WHERE company_id = ? AND id = ? AND status = 'open'")
      .bind(status, t, a.userId, followUp?.kind === 'work_order' ? followUp.id : null, followUp?.kind === 'request' ? followUp.id : null, a.companyId, i.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: status === 'failed' ? 'inspection.failed' : 'inspection.passed', assetId: w.asset_id, workOrderId: w.id, summary: `Inspection "${i.template_name}" ${status}${failedItems.length ? `: ${what}` : ''}${followUp ? `; follow-up ${followUp.number}` : ''}`, after: { status, failed: failedItems.length, followUp: followUp?.number ?? null }, at: t }),
  );
  try {
    await db.batch(stmts);
  } catch (e) {
    if (isUnique(e)) throw new HttpError(409, `The inspection "${i.template_name}" was completed a moment ago: refresh to see it`);
    throw e;
  }
  return c.json({ status, failed: failedItems.length, followUp });
});

// ------------------------------------------------------------------ prestart checks

const prestartDTO = (p: any) => ({
  id: p.id,
  assetId: p.asset_id,
  assetNumber: p.asset_number ?? null,
  assetName: p.asset_name ?? null,
  templateId: p.template_id,
  templateName: p.template_name,
  result: p.result,
  failedItems: p.failed_items,
  criticalFailed: p.critical_failed,
  statusBefore: p.status_before,
  setOutOfService: !!p.set_out_of_service,
  requestId: p.request_id,
  requestNumber: p.request_number ?? null,
  notes: p.notes,
  performedBy: p.performed_by,
  performedByName: p.performer ?? null,
  performedAt: p.performed_at,
});
const PRESTART_SELECT = `SELECT p.*, a.number AS asset_number, a.name AS asset_name, u.name AS performer, r.number AS request_number FROM mt_prestarts p
  JOIN mt_assets a ON a.company_id = p.company_id AND a.id = p.asset_id LEFT JOIN users u ON u.id = p.performed_by LEFT JOIN mt_requests r ON r.company_id = p.company_id AND r.id = p.request_id`;

inspectionRoutes.get('/c/:company/prestarts', async (c) => {
  const a = await requireMt(c);
  const assetId = c.req.query('assetId');
  const result = c.req.query('result');
  const rows = await c.env.DB.prepare(`${PRESTART_SELECT} WHERE p.company_id = ? ${assetId ? 'AND p.asset_id = ?' : ''} ${result === 'failed' || result === 'passed' ? 'AND p.result = ?' : ''} ORDER BY p.performed_at DESC LIMIT 200`)
    .bind(a.companyId, ...(assetId ? [assetId.slice(0, 64)] : []), ...(result === 'failed' || result === 'passed' ? [result] : []))
    .all<any>();
  return c.json({ prestarts: rows.results.map(prestartDTO) });
});

inspectionRoutes.get('/c/:company/prestarts/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const p = await db.prepare(`${PRESTART_SELECT} WHERE p.company_id = ? AND p.id = ?`).bind(a.companyId, c.req.param('id')).first<any>();
  if (!p) throw notFound('Prestart check');
  const results = await db.prepare('SELECT r.*, u.name AS recorder FROM mt_insp_results r LEFT JOIN users u ON u.id = r.recorded_by WHERE r.company_id = ? AND r.prestart_id = ? ORDER BY r.position').bind(a.companyId, p.id).all<any>();
  return c.json({ prestart: prestartDTO(p), results: results.results.map(resultDTO) });
});

/** The checklist for a prestart of an asset (its own, or the one asked for). */
inspectionRoutes.get('/c/:company/assets/:id/prestart', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const asset = await loadAsset(db, a.companyId, c.req.param('id'));
  const chosen = c.req.query('templateId') ?? (await db.prepare('SELECT template_id FROM mt_asset_prestart WHERE company_id = ? AND asset_id = ?').bind(a.companyId, asset.id).first<{ template_id: string }>())?.template_id;
  const meters = await db.prepare('SELECT id, name, unit, rising, last_value FROM mt_meters WHERE company_id = ? AND asset_id = ? AND archived_at IS NULL ORDER BY name').bind(a.companyId, asset.id).all<any>();
  const last = await db.prepare(`${PRESTART_SELECT} WHERE p.company_id = ? AND p.asset_id = ? ORDER BY p.performed_at DESC LIMIT 1`).bind(a.companyId, asset.id).first<any>();
  const tpl = chosen ? await loadTemplate(db, a.companyId, chosen).catch(() => null) : null;
  return c.json({
    asset: { id: asset.id, number: asset.number, name: asset.name, status: asset.status, archived: !!asset.archived_at },
    template: tpl && !tpl.t.archived_at ? { id: tpl.t.id, name: tpl.t.name, items: tpl.items.map(itemDTO) } : null,
    meters: meters.results.map((m) => ({ id: m.id, name: m.name, unit: m.unit, rising: !!m.rising, lastValue: m.last_value })),
    last: last ? prestartDTO(last) : null,
  });
});

inspectionRoutes.post('/c/:company/prestarts', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const input = await body(
    c,
    z.object({
      assetId: zId,
      templateId: zId.optional(),
      results: z.array(resultInput).max(100),
      notes: zText(2000).optional(),
      reading: z.object({ meterId: zId, value: z.number().finite().min(-1e12).max(1e12), reset: z.boolean().optional() }).nullable().optional(),
      requestKey: z.string().trim().min(8).max(80).optional(),
      today: z.string().optional(),
    }),
  );
  const asset = await loadAsset(db, a.companyId, input.assetId).catch(() => {
    throw new HttpError(400, 'Choose an asset from this company');
  });
  if (asset.archived_at) throw new HttpError(400, 'That asset is archived');
  const templateId = input.templateId ?? (await db.prepare('SELECT template_id FROM mt_asset_prestart WHERE company_id = ? AND asset_id = ?').bind(a.companyId, asset.id).first<{ template_id: string }>())?.template_id;
  if (!templateId) throw new HttpError(400, `${asset.number} has no prestart checklist yet. A supervisor sets one on the asset.`);
  const { t: tpl, items } = await loadTemplate(db, a.companyId, templateId);
  if (tpl.archived_at) throw new HttpError(400, 'That checklist is archived');
  const given = new Map(input.results.map((r) => [r.itemId, r]));
  for (const id of given.keys()) if (!items.some((x) => x.id === id)) throw new HttpError(400, 'A result names an item that is not on this checklist');
  const evaluated = items.map((item, n) => ({ item, ev: evaluate(item, given.get(item.id), n + 1) })).filter((x) => x.ev);
  const failed = evaluated.filter((x) => x.ev!.passed === 0);
  const critical = failed.filter((x) => x.item.critical);
  const t = now();
  const id = newId();
  const stmts: D1PreparedStatement[] = [];
  if (input.requestKey) stmts.push(doneStmt(db, a.companyId, `prestart:${input.requestKey}`, t));
  let request: { id: string; number: string } | null = null;
  if (failed.length) {
    const rid = newId();
    const number = await nextNumber(db, a.companyId, 'request');
    const rstatus = (await requireApproval(db, a.companyId)) ? 'awaiting_approval' : 'submitted';
    const description = `Prestart check "${tpl.name}" failed on ${asset.number} ${asset.name}: ${failed.map((x) => `${x.item.label}${x.item.critical ? ' (critical)' : ''}`).join('; ')}`.slice(0, 5000);
    stmts.push(
      db.prepare('INSERT INTO mt_requests (id, company_id, number, description, asset_id, priority, location, status, requested_by, notes, search, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(rid, a.companyId, number, description, asset.id, critical.length ? 'urgent' : 'medium', asset.location ?? '', rstatus, a.userId, input.notes ?? '', searchText(number, description, asset.location), t, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'request.created', assetId: asset.id, requestId: rid, summary: `Request ${number} raised by a failed prestart check`, after: { status: rstatus, prestart: id }, at: t }),
    );
    request = { id: rid, number };
  }
  const outOfService = critical.length > 0 && !['out_of_service', 'disposed'].includes(asset.status);
  stmts.push(
    db
      .prepare('INSERT INTO mt_prestarts (id, company_id, asset_id, template_id, template_name, result, failed_items, critical_failed, status_before, set_out_of_service, request_id, notes, performed_by, performed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, asset.id, tpl.id, tpl.name, failed.length ? 'failed' : 'passed', failed.length, critical.length, asset.status, outOfService ? 1 : 0, request?.id ?? null, input.notes ?? '', a.userId, t),
  );
  for (const x of evaluated) stmts.push(resultStmt(db, a.companyId, x.item, x.ev!, { prestartId: id }, a.userId, t));
  let meterId: string | null = null;
  if (input.reading) {
    const m = await loadMeter(db, a.companyId, input.reading.meterId);
    if (m.asset_id !== asset.id) throw new HttpError(400, 'That meter is on another asset');
    stmts.push(...readingStatements(db, a.companyId, a.userId, m, { value: input.reading.value, reset: input.reading.reset, source: 'prestart', prestartId: id }, t).stmts);
    meterId = m.id;
  }
  if (outOfService) {
    // The one place Maintenance changes an asset's status by itself: explicit, and recorded with the status before.
    stmts.push(
      db.prepare("UPDATE mt_assets SET status = 'out_of_service', updated_at = ? WHERE company_id = ? AND id = ?").bind(t, a.companyId, asset.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'asset.out_of_service', assetId: asset.id, requestId: request?.id ?? null, summary: `Set out of service by a prestart check: ${critical.map((x) => x.item.label).join('; ')} failed (critical)`, before: { status: asset.status }, after: { status: 'out_of_service', prestart: id }, at: t }),
    );
  }
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: failed.length ? 'prestart.failed' : 'prestart.passed', assetId: asset.id, requestId: request?.id ?? null, summary: `Prestart check "${tpl.name}" ${failed.length ? `failed: ${failed.length} ${failed.length === 1 ? 'item' : 'items'}` : 'passed'}`, after: { prestart: id, failed: failed.length, critical: critical.length }, at: t }));
  try {
    await db.batch(stmts);
  } catch (e) {
    if (isUnique(e) && input.requestKey) throw new HttpError(409, 'This prestart check was already sent');
    if (isUnique(e)) throw new HttpError(409, 'Someone entered a reading of this meter at the same moment. Send the check again.');
    throw e;
  }
  const generated = meterId ? (await generateDue(db, { companyId: a.companyId, meterId, today: todayNear(input.today), actorId: a.userId })).made : [];
  const p = await db.prepare(`${PRESTART_SELECT} WHERE p.company_id = ? AND p.id = ?`).bind(a.companyId, id).first<any>();
  return c.json({ prestart: prestartDTO(p), request, outOfService, generated }, 201);
});
