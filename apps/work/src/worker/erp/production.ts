// BIZOMAT ERP, Release 3: manufacturing orders and their execution (/api/erp/c/:company/...). Who may do what:
// access.ts (manufacturing.view, production.plan, production.execute, production.issue, production.receive).
//
// Manufacturing order (MO-00001): a product, a released bill of materials revision and a released routing revision,
// a quantity, required date, method, production type, priority, customer or job reference and the people assigned.
// Materials come from the bill of materials (direct lines, first of each alternative group, no optional lines) with
// the scrap allowance; operations are copied from the routing and scheduled forward over each work centre's calendar.
// Estimated cost by element is kept on the order. Statuses: draft, released, in_progress, completed, closed, cancelled.
// A released order is amended with a reason: the version before is kept in erp_mo_revisions.
//
// Execution: release (shortages shown; materials reserved through StockOps as far as stock allows); issue materials
// (from the order's reservations first; lots and serials; partial) and return what is unused; operations started (their
// predecessors done, or started where overlap is allowed), labour (a timer per person, or minutes entered) and machine
// time, good output, scrap with a reason, rework, downtime with a reason, an inspection result where the routing asks for
// one (full Quality is Release 4), completed; finished goods received into stock, valued at the order's actual cost,
// once per client key, never beyond the over-completion tolerance (the CHECK on erp_mfg_orders). Completed, then
// closed: costs final by element, variances recorded, the Finance posting recorded as planned (nothing is posted).
//
// Every stock change goes through stock.ts in one transaction: two people issuing the last unit cannot both succeed.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { can, companyPeople, requireErp, type ErpAccess } from './access';
import { badState, csvResponse, dollars, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zDate, zId, zText } from './util';
import { loadSettings } from './settings';
import { PLANNED_POSTING, StockOps, availableByProduct, currentUnitCost, onceStmt, q6, runStock, stockError, unitCostOrNull, type StockKey } from './stock';
import { loadLocation, loadStockProduct, stockKey } from './inventory';
import { loadProduct } from './products';
import { recordFiles } from './record-files';
import {
  COST_ELEMENTS,
  ELEMENT_LABELS,
  METHODS,
  MO_STATUS,
  OP_SELECT,
  OP_STATUS,
  PRIORITIES,
  PRODUCTION_TYPES,
  REPORT_KINDS,
  TIME_KINDS,
  addDays,
  addWorkingDays,
  assetStates,
  daysBetween,
  estimateOps,
  label,
  loadMfgSettings,
  nextWorkingDay,
  opHours,
  operationDTO,
  parseDays,
  predecessorsOf,
  routingOps,
  todayIso,
  type CostElement,
} from './manufacturing';

export const productionRoutes = new Hono<AppEnv>();

const OPEN = ['released', 'in_progress'];
const zKey = z.string().trim().min(8).max(80).optional();
const zQ = z.number().positive().max(1e9);
const keys = <T extends Record<string, string>>(m: T) => Object.keys(m) as [string, ...string[]];

// ------------------------------------------------------------------ loading and DTOs

const MO_SELECT = `SELECT mo.*, p.number AS product_number, p.name AS product_name, p.uom AS product_uom, p.type AS product_type,
  r.label AS bom_revision, r.status AS bom_status, rt.revision AS routing_revision, rt.status AS routing_status, l.code AS fg_location_code, w.code AS fg_warehouse_code,
  cb.name AS created_by_name, rb.name AS released_by_name, kb.name AS completed_by_name, xb.name AS closed_by_name,
  (SELECT COUNT(*) FROM erp_mo_operations o WHERE o.company_id = mo.company_id AND o.mo_id = mo.id) AS op_count,
  (SELECT COUNT(*) FROM erp_mo_operations o WHERE o.company_id = mo.company_id AND o.mo_id = mo.id AND o.status = 'completed') AS ops_done
  FROM erp_mfg_orders mo JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id
  JOIN erp_revisions r ON r.company_id = mo.company_id AND r.id = mo.bom_revision_id
  LEFT JOIN erp_routings rt ON rt.company_id = mo.company_id AND rt.id = mo.routing_id
  LEFT JOIN erp_locations l ON l.company_id = mo.company_id AND l.id = mo.fg_location_id LEFT JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
  LEFT JOIN users cb ON cb.id = mo.created_by LEFT JOIN users rb ON rb.id = mo.released_by LEFT JOIN users kb ON kb.id = mo.completed_by LEFT JOIN users xb ON xb.id = mo.closed_by`;

export function estimateOf(mo: any) {
  const e = {
    materials: mo.est_material_cents,
    labour: mo.est_labour_cents,
    machine: mo.est_machine_cents,
    outsourcing: mo.est_outsource_cents,
    overheads: mo.est_overhead_cents,
    scrap: mo.est_scrap_cents,
    rework: 0,
  } as Record<CostElement, number>;
  return { ...e, total: COST_ELEMENTS.reduce((s, k) => s + e[k], 0) };
}

export function moDTO(mo: any) {
  const today = todayIso();
  const open = ['draft', 'released', 'in_progress'].includes(mo.status);
  return {
    id: mo.id,
    number: mo.number,
    productId: mo.product_id,
    productNumber: mo.product_number,
    productName: mo.product_name,
    uom: mo.product_uom,
    bomRevisionId: mo.bom_revision_id,
    bomRevision: mo.bom_revision,
    bomStatus: mo.bom_status,
    routingId: mo.routing_id,
    routingRevision: mo.routing_revision ?? null,
    routingStatus: mo.routing_status ?? null,
    quantity: q6(mo.quantity),
    maxQty: q6(mo.max_qty),
    completedQty: q6(mo.completed_qty),
    receivedValueCents: mo.received_value_cents,
    startDate: mo.start_date,
    requiredDate: mo.required_date,
    finishDate: mo.finish_date,
    method: mo.method,
    methodLabel: label(METHODS, mo.method),
    productionType: mo.production_type,
    productionTypeLabel: label(PRODUCTION_TYPES, mo.production_type),
    priority: mo.priority,
    priorityLabel: label(PRIORITIES, mo.priority),
    customerRef: mo.customer_ref,
    fgLocationId: mo.fg_location_id,
    fgLocationCode: mo.fg_location_code ? `${mo.fg_warehouse_code}/${mo.fg_location_code}` : null,
    notes: mo.notes,
    status: mo.status,
    statusLabel: label(MO_STATUS, mo.status),
    revision: mo.revision,
    currency: mo.currency,
    estimate: estimateOf(mo),
    estimateMissing: mo.est_missing ? String(mo.est_missing).split(',').filter(Boolean) : [],
    actualCents: mo.actual_cents,
    varianceCents: mo.variance_cents,
    late: open && !!mo.required_date && (!!(mo.finish_date && mo.finish_date > mo.required_date) || mo.required_date < today),
    overdue: open && !!mo.required_date && mo.required_date < today,
    operations: mo.op_count === undefined ? undefined : { total: mo.op_count, done: mo.ops_done },
    progressPct: mo.quantity > 0 ? Math.min(100, Math.round((mo.completed_qty / mo.quantity) * 100)) : 0,
    mrpSuggestionId: mo.mrp_suggestion_id,
    createdByName: mo.created_by_name ?? null,
    releasedByName: mo.released_by_name ?? null,
    releasedAt: mo.released_at,
    startedAt: mo.started_at,
    completedByName: mo.completed_by_name ?? null,
    completedAt: mo.completed_at,
    closedByName: mo.closed_by_name ?? null,
    closedAt: mo.closed_at,
    cancelledAt: mo.cancelled_at,
    cancelReason: mo.cancel_reason,
    createdAt: mo.created_at,
    updatedAt: mo.updated_at,
  };
}

export async function loadMo(db: D1Database, companyId: string, id: string) {
  const mo = await db.prepare(`${MO_SELECT} WHERE mo.company_id = ? AND mo.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!mo) throw notFound('Manufacturing order');
  return mo;
}

async function moMaterials(db: D1Database, companyId: string, moId: string) {
  return (
    await db
      .prepare(
        `SELECT m.*, p.number AS product_number, p.name AS product_name, p.type AS product_type,
                (SELECT COALESCE(SUM(r.quantity - r.issued_qty - r.released_qty), 0) FROM erp_mo_reservations mr JOIN erp_reservations r ON r.company_id = mr.company_id AND r.id = mr.reservation_id
                  WHERE mr.company_id = m.company_id AND mr.material_id = m.id AND r.status = 'open') AS reserved_open
           FROM erp_mo_materials m JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id
          WHERE m.company_id = ? AND m.mo_id = ? ORDER BY m.position`,
      )
      .bind(companyId, moId)
      .all<any>()
  ).results;
}

async function moOps(db: D1Database, companyId: string, moId: string) {
  return (await db.prepare(`${OP_SELECT('erp_mo_operations')} WHERE o.company_id = ? AND o.mo_id = ? ORDER BY o.op_no`).bind(companyId, moId).all<any>()).results;
}

function moOpDTO(o: any, all: any[]) {
  const preds = predecessorsOf(o, all);
  const predOps = all.filter((x) => preds.includes(x.op_no));
  const ready = predOps.every((p) => p.status === 'completed' || (o.overlap && p.status !== 'pending'));
  // units in: what the predecessors passed on (the order's maximum for a first operation)
  const unitsIn = predOps.length ? Math.min(...predOps.map((p) => Number(p.good_qty))) : Number(o.max_qty);
  return {
    ...operationDTO(o),
    effectivePredecessors: preds,
    status: o.status,
    statusLabel: label(OP_STATUS, o.status),
    maxQty: q6(o.max_qty),
    goodQty: q6(o.good_qty),
    scrapQty: q6(o.scrap_qty),
    reworkQty: q6(o.rework_qty),
    downtimeMinutes: Math.round(Number(o.downtime_minutes) * 100) / 100,
    unitsIn: q6(unitsIn),
    plannedStart: o.planned_start,
    plannedFinish: o.planned_finish,
    startedAt: o.started_at,
    completedAt: o.completed_at,
    inspectionResult: o.inspection_result,
    inspectionComment: o.inspection_comment,
    inspectionAt: o.inspection_at,
    actualOutsourceCents: o.actual_outsource_cents,
    ready: o.status === 'pending' ? ready : null,
  };
}

// ------------------------------------------------------------------ building an order

/** The lines of a bill of materials an order uses: no optional lines, the first of each alternative group, effective on `asOf`, no services. */
async function bomMaterialLines(db: D1Database, companyId: string, revisionId: string, asOf: string) {
  const rows = await db
    .prepare(
      `SELECT l.*, c.number, c.name, c.type, c.uom AS c_uom FROM erp_bom_lines l JOIN erp_products c ON c.company_id = l.company_id AND c.id = l.component_id
        WHERE l.company_id = ? AND l.revision_id = ? ORDER BY l.position, l.created_at, l.rowid`,
    )
    .bind(companyId, revisionId)
    .all<any>();
  const groups = new Set<string>();
  return rows.results.filter((l) => {
    if (l.optional || l.type === 'service') return false;
    if ((l.effective_from && l.effective_from > asOf) || (l.effective_to && l.effective_to < asOf)) return false;
    if (l.alt_group) {
      if (groups.has(l.alt_group)) return false;
      groups.add(l.alt_group);
    }
    return true;
  });
}

const workCentreMaps = async (db: D1Database, companyId: string) => ({
  centres: new Map((await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ?').bind(companyId).all<any>()).results.map((w) => [w.id, w])),
  machines: new Map((await db.prepare('SELECT id, code, machine_rate_cents, asset_id FROM erp_machines WHERE company_id = ?').bind(companyId).all<any>()).results.map((m) => [m.id, m])),
});

/**
 * Plans operations forward from `start`: an operation starts the working day after its predecessors finish (on the day
 * the last of them starts, where overlap is allowed) and takes its hours (set-up plus run time for the quantity) over
 * its work centre's productive hours per day (hours per day times efficiency), at least one working day. An outsourced
 * operation takes its supplier's days.
 */
export function scheduleOps(ops: any[], start: string, qty: number, centres: Map<string, any>) {
  const out = new Map<number, { start: string; finish: string; days: number }>();
  const sorted = [...ops].sort((x, y) => x.op_no - y.op_no);
  for (const o of sorted) {
    const w = centres.get(o.work_centre_id);
    const days = o.outsourced ? [1, 2, 3, 4, 5, 6, 7] : parseDays(w?.working_days ?? '1,2,3,4,5');
    let earliest = start;
    for (const p of predecessorsOf(o, sorted)) {
      const s = out.get(p);
      if (!s) continue;
      const cand = o.overlap ? s.start : addDays(s.finish, 1);
      if (cand > earliest) earliest = cand;
    }
    const begin = nextWorkingDay(earliest, days);
    const perDay = w ? Math.max(0.01, w.hours_per_day * (w.efficiency_pct / 100)) : 8;
    const duration = o.outsourced ? Math.max(1, Number(o.outsource_days ?? 1)) : Math.max(1, Math.ceil(opHours(o, qty) / perDay - 1e-9));
    const finish = o.outsourced ? addDays(begin, duration - 1) : addWorkingDays(begin, duration - 1, days);
    out.set(o.op_no, { start: begin, finish, days: duration });
  }
  return out;
}

/**
 * Manufacturing lead time of a product in calendar days: the routing's own lead time, else the product's planning
 * lead time, else worked out from the routing's operations for the quantity (scheduled from a Monday).
 */
export function mfgLeadDays(routing: { lead_time_days: number | null } | null, planning: { mfg_lead_days?: number | null } | null, ops: any[], qty: number, centres: Map<string, any>) {
  if (routing?.lead_time_days !== null && routing?.lead_time_days !== undefined) return Number(routing.lead_time_days);
  if (planning?.mfg_lead_days !== null && planning?.mfg_lead_days !== undefined) return Number(planning.mfg_lead_days);
  if (!ops.length) return 0;
  const ref = '2024-01-01';
  const plan = scheduleOps(ops, ref, qty, centres);
  const last = [...plan.values()].reduce((m, x) => (x.finish > m ? x.finish : m), ref);
  return daysBetween(ref, last) + 1;
}

interface MaterialPlan {
  productId: string;
  number: string;
  bomLineId: string;
  qtyPer: number;
  scrapPct: number;
  requiredQty: number;
  unitCost: number | null;
  uom: string;
}

async function planMaterials(db: D1Database, companyId: string, revisionId: string, qty: number, asOf: string): Promise<MaterialPlan[]> {
  const lines = await bomMaterialLines(db, companyId, revisionId, asOf);
  const out: MaterialPlan[] = [];
  for (const l of lines) {
    out.push({ productId: l.component_id, number: l.number, bomLineId: l.id, qtyPer: l.quantity, scrapPct: l.scrap_pct || 0, requiredQty: q6(qty * l.quantity * (1 + (l.scrap_pct || 0) / 100)), unitCost: await unitCostOrNull(db, companyId, l.component_id), uom: l.uom || l.c_uom || 'each' });
  }
  return out;
}

/** Estimated cost by element for a quantity, from the materials' unit costs and the operations. */
function estimateFor(qty: number, materials: MaterialPlan[], ops: any[], centres: Map<string, any>, machines: Map<string, any>) {
  let mat = 0;
  let scrap = 0;
  const missing: string[] = [];
  for (const m of materials) {
    if (m.unitCost === null) missing.push(m.number);
    const cost = m.unitCost ?? 0;
    const base = qty * m.qtyPer;
    mat += base * cost;
    scrap += base * (m.scrapPct / 100) * cost;
  }
  const o = estimateOps(ops, qty, centres, machines);
  return { material: Math.round(mat), scrap: Math.round(scrap), labour: o.labourCents, machine: o.machineCents, outsource: o.outsourceCents, overhead: o.overheadCents, missing };
}

const zMoIn = z.object({
  productId: zId,
  quantity: zQ,
  requiredDate: zDate.optional(),
  startDate: zDate.optional(),
  bomRevisionId: zId.optional(),
  routingId: zId.optional(),
  method: z.enum(keys(METHODS)).optional(),
  productionType: z.enum(keys(PRODUCTION_TYPES)).optional(),
  priority: z.enum(keys(PRIORITIES)).optional(),
  customerRef: zText(200).optional(),
  notes: zText(4000).optional(),
  fgLocationId: zId.nullable().optional(),
  assignees: z.array(zId).max(50).optional(),
});
type MoIn = z.infer<typeof zMoIn>;

async function checkFgLocation(db: D1Database, companyId: string, id: string | null | undefined) {
  if (!id) return null;
  const l = await loadLocation(db, companyId, id);
  if (l.archived_at || l.warehouse_archived) throw new HttpError(400, `Location ${l.code} is archived`);
  if (l.kind === 'quarantine') throw new HttpError(400, 'Finished goods cannot go straight into quarantine');
  return l.id;
}

async function checkAssignees(db: D1Database, a: ErpAccess, ids: string[] | undefined) {
  if (!ids?.length) return [];
  const people = new Set((await companyPeople(db, a)).map((p) => p.id));
  const out = [...new Set(ids)];
  for (const id of out) if (!people.has(id)) throw new HttpError(400, 'Assign people of this company only');
  return out;
}

/** The product's released bill of materials and routing (or the chosen ones, which must be released), checked. */
async function sources(db: D1Database, companyId: string, p: { id: string; number: string }, bomRevisionId?: string, routingId?: string) {
  const bom = bomRevisionId
    ? await db.prepare('SELECT id, label, status, product_id FROM erp_revisions WHERE company_id = ? AND id = ?').bind(companyId, bomRevisionId).first<any>()
    : await db.prepare("SELECT id, label, status, product_id FROM erp_revisions WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(companyId, p.id).first<any>();
  if (!bom || bom.product_id !== p.id) throw new HttpError(400, `${p.number} has no released bill of materials. Release one through a change order first.`);
  if (bom.status !== 'released') throw new HttpError(400, `Revision ${bom.label} of ${p.number} is ${bom.status.replace('_', ' ')}: use its released revision`);
  const routing = routingId
    ? await db.prepare('SELECT * FROM erp_routings WHERE company_id = ? AND id = ?').bind(companyId, routingId).first<any>()
    : await db.prepare("SELECT * FROM erp_routings WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(companyId, p.id).first<any>();
  if (!routing || routing.product_id !== p.id) throw new HttpError(400, `${p.number} has no released routing. Add its operations and release a routing revision first.`);
  if (routing.status !== 'released') throw new HttpError(400, `Routing revision ${routing.revision} of ${p.number} is ${routing.status}: use the released revision`);
  return { bom, routing };
}

/** The statements that write an order's materials and operations (with their planned dates). */
function buildStmts(db: D1Database, companyId: string, moId: string, qty: number, maxQty: number, materials: MaterialPlan[], ops: any[], plan: Map<number, { start: string; finish: string }>) {
  const stmts: D1PreparedStatement[] = materials.map((m, i) =>
    db
      .prepare('INSERT INTO erp_mo_materials (id, company_id, mo_id, position, product_id, bom_line_id, qty_per, scrap_pct, required_qty, est_unit_cost_cents, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), companyId, moId, i + 1, m.productId, m.bomLineId, m.qtyPer, m.scrapPct, m.requiredQty, m.unitCost, m.uom),
  );
  for (const o of ops) {
    const s = plan.get(o.op_no);
    stmts.push(
      db
        .prepare(
          `INSERT INTO erp_mo_operations (id, company_id, mo_id, op_no, name, instructions, work_centre_id, machine_id, setup_minutes, run_minutes, crew, inspection, inspection_note, outsourced, supplier_id, outsource_cost_cents, outsource_days, predecessors, overlap, max_qty, planned_start, planned_finish)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(newId(), companyId, moId, o.op_no, o.name, o.instructions, o.work_centre_id, o.machine_id, o.setup_minutes, o.run_minutes, o.crew, o.inspection, o.inspection_note, o.outsourced, o.supplier_id, o.outsource_cost_cents, o.outsource_days, o.predecessors, o.overlap, maxQty, s?.start ?? null, s?.finish ?? null),
    );
  }
  return stmts;
}

/**
 * Makes a draft manufacturing order (also used by MRP's "make" suggestions). The start date, when not given, is the
 * required date less the manufacturing lead time, and never before today.
 */
export async function createMo(db: D1Database, a: ErpAccess, input: MoIn, extra: { mrpSuggestionId?: string; reason?: string } = {}) {
  const p = await loadProduct(db, a.companyId, input.productId);
  if (p.archived_at) throw new HttpError(409, `${p.number} is archived`);
  if (p.type === 'service') throw new HttpError(400, `${p.number} is a service: services are not manufactured`);
  const { bom, routing } = await sources(db, a.companyId, p, input.bomRevisionId, input.routingId);
  const ops = await routingOps(db, a.companyId, routing.id);
  const { centres, machines } = await workCentreMaps(db, a.companyId);
  const settings = await loadMfgSettings(db, a.companyId);
  const fg = await checkFgLocation(db, a.companyId, input.fgLocationId);
  const assignees = await checkAssignees(db, a, input.assignees);
  const today = todayIso();
  const planning = await db.prepare('SELECT mfg_lead_days FROM erp_product_planning WHERE company_id = ? AND product_id = ?').bind(a.companyId, p.id).first<any>();
  const lead = mfgLeadDays(routing, planning, ops, input.quantity, centres);
  let start = input.startDate ?? (input.requiredDate ? addDays(input.requiredDate, -lead) : today);
  if (!input.startDate && start < today) start = today;
  const materials = await planMaterials(db, a.companyId, bom.id, input.quantity, start);
  if (!materials.length) throw new HttpError(400, `The bill of materials of ${p.number} has no lines to make it from`);
  const plan = scheduleOps(ops, start, input.quantity, centres);
  const finish = [...plan.values()].reduce((m, x) => (x.finish > m ? x.finish : m), start);
  const est = estimateFor(input.quantity, materials, ops, centres, machines);
  const maxQty = q6(input.quantity * (1 + settings.overCompletionPct / 100));
  const currency = (await loadSettings(db, a.companyId)).currency;
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'manufacturing_order');
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_mfg_orders (id, company_id, number, product_id, bom_revision_id, routing_id, quantity, max_qty, start_date, required_date, finish_date, method, production_type, priority, customer_ref, fg_location_id, notes, status, currency,
           est_material_cents, est_labour_cents, est_machine_cents, est_outsource_cents, est_overhead_cents, est_scrap_cents, est_missing, mrp_suggestion_id, search, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id, a.companyId, number, p.id, bom.id, routing.id, input.quantity, maxQty, start, input.requiredDate ?? null, finish, input.method ?? 'make_to_stock', input.productionType ?? 'discrete', input.priority ?? 'normal', input.customerRef ?? '', fg, input.notes ?? '', currency,
        est.material, est.labour, est.machine, est.outsource, est.overhead, est.scrap, est.missing.join(','), extra.mrpSuggestionId ?? null, searchText(number, p.number, p.name, input.customerRef, input.notes), a.userId, t, t,
      ),
    ...buildStmts(db, a.companyId, id, input.quantity, maxQty, materials, ops, plan),
    ...assignees.map((u) => db.prepare('INSERT INTO erp_mo_assignees (company_id, mo_id, user_id) VALUES (?, ?, ?)').bind(a.companyId, id, u)),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'mo.created',
      entityType: 'manufacturing_order',
      entityId: id,
      productId: p.id,
      summary: `${number} drafted: ${input.quantity} ${p.uom} of ${p.number} from bill of materials ${bom.label} and routing ${routing.revision}${extra.reason ? ` (${extra.reason})` : ''}`,
      after: { quantity: input.quantity, requiredDate: input.requiredDate ?? null, start, finish },
      at: t,
    }),
  ]);
  return { id, number };
}

// ------------------------------------------------------------------ lists

productionRoutes.get('/c/:company/mos', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['mo.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const qp = (k: string) => c.req.query(k)?.trim();
  const status = qp('status');
  if (status === 'open') where.push("mo.status IN ('draft','released','in_progress')");
  else if (status === 'active') where.push("mo.status IN ('released','in_progress')");
  else if (status && Object.hasOwn(MO_STATUS, status)) {
    where.push('mo.status = ?');
    args.push(status);
  }
  if (qp('productId')) {
    where.push('mo.product_id = ?');
    args.push(qp('productId'));
  }
  if (qp('workCentreId')) {
    where.push('EXISTS (SELECT 1 FROM erp_mo_operations o WHERE o.company_id = mo.company_id AND o.mo_id = mo.id AND o.work_centre_id = ?)');
    args.push(qp('workCentreId'));
  }
  if (qp('priority') && Object.hasOwn(PRIORITIES, qp('priority')!)) {
    where.push('mo.priority = ?');
    args.push(qp('priority'));
  }
  if (qp('mine') === '1') {
    where.push('EXISTS (SELECT 1 FROM erp_mo_assignees x WHERE x.company_id = mo.company_id AND x.mo_id = mo.id AND x.user_id = ?)');
    args.push(a.userId);
  }
  if (qp('late') === '1') {
    where.push("mo.status IN ('draft','released','in_progress') AND mo.required_date IS NOT NULL AND (mo.required_date < ? OR mo.finish_date > mo.required_date)");
    args.push(todayIso());
  }
  const from = qp('from');
  const to = qp('to');
  if (from) {
    where.push('mo.required_date >= ?');
    args.push(from);
  }
  if (to) {
    where.push('mo.required_date <= ?');
    args.push(to);
  }
  if (qp('q')) {
    where.push('mo.search LIKE ?');
    args.push(likeOf(qp('q')!));
  }
  const sorts: Record<string, string> = { required: "COALESCE(mo.required_date, '9999'), mo.number", number: 'mo.number COLLATE NOCASE DESC', priority: "CASE mo.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, COALESCE(mo.required_date, '9999')", newest: 'mo.created_at DESC' };
  const order = sorts[qp('sort') ?? ''] ?? sorts.newest;
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${MO_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(moDTO);
  if (csv) {
    return csvResponse('manufacturing-orders', [
      ['Number', 'Product', 'Name', 'Status', 'Quantity', 'Completed', 'Start', 'Required', 'Planned finish', 'Priority', 'Method', 'Type', 'Customer or job', 'Estimated cost', 'Actual cost', 'Variance', 'Late'],
      ...list.map((m) => [m.number, m.productNumber, m.productName, m.statusLabel, m.quantity, m.completedQty, m.startDate ?? '', m.requiredDate ?? '', m.finishDate ?? '', m.priorityLabel, m.methodLabel, m.productionTypeLabel, m.customerRef, dollars(m.estimate.total), dollars(m.actualCents), dollars(m.varianceCents), m.late ? 'yes' : '']),
    ]);
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_mfg_orders mo WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ orders: list, total: total?.n ?? 0, limit, offset, can: { plan: can(a, 'production.plan') } });
});

/** What the order form offers: products with a released bill of materials and routing, locations, people. */
productionRoutes.get('/c/:company/mo-options', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const products = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.uom, r.id AS bom_id, r.label AS bom_label, rt.id AS routing_id, rt.revision AS routing_revision
         FROM erp_products p JOIN erp_revisions r ON r.company_id = p.company_id AND r.product_id = p.id AND r.status = 'released'
         LEFT JOIN erp_routings rt ON rt.company_id = p.company_id AND rt.product_id = p.id AND rt.status = 'released'
        WHERE p.company_id = ? AND p.archived_at IS NULL AND p.type <> 'service'
          AND EXISTS (SELECT 1 FROM erp_bom_lines l WHERE l.company_id = r.company_id AND l.revision_id = r.id)
        ORDER BY p.number COLLATE NOCASE LIMIT 2000`,
    )
    .bind(a.companyId)
    .all<any>();
  const locations = await db
    .prepare("SELECT l.id, l.code, l.name, l.kind, w.code AS warehouse_code FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.archived_at IS NULL AND w.archived_at IS NULL AND l.kind <> 'quarantine' ORDER BY w.code, l.code LIMIT 2000")
    .bind(a.companyId)
    .all<any>();
  const settings = await loadMfgSettings(db, a.companyId);
  return c.json({
    products: products.results.map((p) => ({ id: p.id, number: p.number, name: p.name, uom: p.uom, bomRevisionId: p.bom_id, bomRevision: p.bom_label, routingId: p.routing_id, routingRevision: p.routing_revision })),
    locations: locations.results.map((l) => ({ id: l.id, code: `${l.warehouse_code}/${l.code}`, name: l.name, kind: l.kind })),
    people: (await companyPeople(db, a)).map((p) => ({ id: p.id, name: p.name })),
    methods: Object.entries(METHODS).map(([value, l]) => ({ value, label: l })),
    productionTypes: Object.entries(PRODUCTION_TYPES).map(([value, l]) => ({ value, label: l })),
    priorities: Object.entries(PRIORITIES).map(([value, l]) => ({ value, label: l })),
    settings,
  });
});

productionRoutes.post('/c/:company/mos', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const input = await body(c, zMoIn);
  return c.json(await createMo(c.env.DB, a, input), 201);
});

// ------------------------------------------------------------------ one order

/** Actual cost by element, from the ledger, the time entries and the outsourced operations. */
export async function actualCosts(db: D1Database, companyId: string, moId: string): Promise<Record<CostElement, number> & { total: number }> {
  const [moves, time, outs] = await db.batch([
    db
      .prepare(
        `SELECT COALESCE(SUM(CASE WHEN move_type IN ('production_issue','production_return') THEN -value_delta_cents ELSE 0 END), 0) AS materials,
                COALESCE(SUM(CASE WHEN move_type = 'production_scrap' THEN -value_delta_cents ELSE 0 END), 0) AS scrap
           FROM erp_stock_moves WHERE company_id = ? AND source_type = 'manufacturing_order' AND source_id = ?`,
      )
      .bind(companyId, moId),
    db
      .prepare(
        `SELECT COALESCE(SUM(CASE WHEN kind = 'labour' AND rework = 0 THEN cost_cents ELSE 0 END), 0) AS labour,
                COALESCE(SUM(CASE WHEN kind = 'machine' AND rework = 0 THEN cost_cents ELSE 0 END), 0) AS machine,
                COALESCE(SUM(CASE WHEN rework = 1 THEN cost_cents ELSE 0 END), 0) AS rework,
                COALESCE(SUM(overhead_cents), 0) AS overheads
           FROM erp_mo_time WHERE company_id = ? AND mo_id = ? AND minutes IS NOT NULL`,
      )
      .bind(companyId, moId),
    db.prepare("SELECT COALESCE(SUM(actual_outsource_cents), 0) AS outsourcing FROM erp_mo_operations WHERE company_id = ? AND mo_id = ? AND outsourced = 1 AND status = 'completed'").bind(companyId, moId),
  ]);
  const m = (moves.results[0] ?? {}) as any;
  const t = (time.results[0] ?? {}) as any;
  const o = (outs.results[0] ?? {}) as any;
  const out = { materials: Number(m.materials), labour: Number(t.labour), machine: Number(t.machine), outsourcing: Number(o.outsourcing), overheads: Number(t.overheads), scrap: Number(m.scrap), rework: Number(t.rework) } as Record<CostElement, number>;
  return { ...out, total: COST_ELEMENTS.reduce((s, k) => s + out[k], 0) };
}

async function costView(db: D1Database, companyId: string, mo: any) {
  const est = estimateOf(mo);
  let actual: Record<string, number>;
  let final = false;
  if (mo.status === 'closed') {
    const rows = await db.prepare('SELECT element, estimated_cents, actual_cents, variance_cents FROM erp_mo_costs WHERE company_id = ? AND mo_id = ?').bind(companyId, mo.id).all<any>();
    actual = Object.fromEntries(rows.results.map((r) => [r.element, r.actual_cents]));
    actual.total = rows.results.reduce((s, r) => s + r.actual_cents, 0);
    final = true;
  } else actual = await actualCosts(db, companyId, mo.id);
  const elements = COST_ELEMENTS.map((k) => ({ element: k, label: ELEMENT_LABELS[k], estimatedCents: est[k], actualCents: actual[k] ?? 0, varianceCents: (actual[k] ?? 0) - est[k] }));
  const good = Number(mo.completed_qty);
  return {
    currency: mo.currency,
    final,
    elements,
    estimatedCents: est.total,
    actualCents: actual.total,
    varianceCents: actual.total - est.total,
    estimatedUnitCents: mo.quantity > 0 ? Math.round(est.total / mo.quantity) : null,
    actualUnitCents: good > 0 ? Math.round(actual.total / good) : null,
    receivedValueCents: mo.received_value_cents,
    unabsorbedCents: actual.total - mo.received_value_cents,
    missing: mo.est_missing ? String(mo.est_missing).split(',').filter(Boolean) : [],
    profitability: 'Planned. There are no sales orders before Release 5, so no revenue can be linked to a manufacturing order honestly.',
    note: 'Materials: issued less returned, at the stock value of each movement. Labour and machine: time recorded at the work centre’s rates (rework time is counted under Rework). Overheads: per labour hour or as a percentage of labour and machine cost. Scrap: materials scrapped against the order. Outsourcing: the actual cost entered when an outsourced operation is completed.',
  };
}

productionRoutes.get('/c/:company/mos/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const mo = await loadMo(db, a.companyId, c.req.param('id'));
  const [materials, ops] = await Promise.all([moMaterials(db, a.companyId, mo.id), moOps(db, a.companyId, mo.id)]);
  const stock = await availableByProduct(db, a.companyId, materials.map((m) => m.product_id));
  const { machines } = await workCentreMaps(db, a.companyId);
  const states = await assetStates(db, a.companyId, ops.map((o) => (o.machine_id ? machines.get(o.machine_id)?.asset_id : null)));
  const time = await db
    .prepare('SELECT t.*, u.name AS user_name, o.op_no, m.code AS machine_code FROM erp_mo_time t JOIN erp_mo_operations o ON o.company_id = t.company_id AND o.id = t.operation_id LEFT JOIN users u ON u.id = t.user_id LEFT JOIN erp_machines m ON m.company_id = t.company_id AND m.id = t.machine_id WHERE t.company_id = ? AND t.mo_id = ? ORDER BY t.created_at DESC LIMIT 500')
    .bind(a.companyId, mo.id)
    .all<any>();
  const reports = await db
    .prepare('SELECT r.*, u.name AS by_name, o.op_no FROM erp_mo_reports r JOIN erp_mo_operations o ON o.company_id = r.company_id AND o.id = r.operation_id LEFT JOIN users u ON u.id = r.created_by WHERE r.company_id = ? AND r.mo_id = ? ORDER BY r.created_at DESC LIMIT 500')
    .bind(a.companyId, mo.id)
    .all<any>();
  const receipts = await db
    .prepare('SELECT x.*, l.code AS location_code, w.code AS warehouse_code, u.name AS by_name FROM erp_mo_receipts x JOIN erp_locations l ON l.company_id = x.company_id AND l.id = x.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id LEFT JOIN users u ON u.id = x.created_by WHERE x.company_id = ? AND x.mo_id = ? ORDER BY x.created_at')
    .bind(a.companyId, mo.id)
    .all<any>();
  const revisions = await db.prepare('SELECT r.*, u.name AS by_name FROM erp_mo_revisions r LEFT JOIN users u ON u.id = r.changed_by WHERE r.company_id = ? AND r.mo_id = ? ORDER BY r.revision DESC').bind(a.companyId, mo.id).all<any>();
  const assignees = await db.prepare('SELECT u.id, u.name FROM erp_mo_assignees x JOIN users u ON u.id = x.user_id WHERE x.company_id = ? AND x.mo_id = ? ORDER BY u.name').bind(a.companyId, mo.id).all<any>();
  const integration = await db.prepare('SELECT * FROM erp_integration_events WHERE company_id = ? AND source_type = ? AND source_id = ? ORDER BY created_at').bind(a.companyId, 'manufacturing_order', mo.id).all<any>();
  const open = OPEN.includes(mo.status);
  return c.json({
    order: moDTO(mo),
    assignees: assignees.results,
    materials: materials.map((m) => {
      const outstanding = Math.max(0, q6(m.required_qty - m.issued_qty));
      const reserved = q6(Number(m.reserved_open));
      const available = stock.get(m.product_id)?.available ?? 0;
      return {
        id: m.id,
        productId: m.product_id,
        productNumber: m.product_number,
        productName: m.product_name,
        uom: m.uom,
        qtyPer: m.qty_per,
        scrapPct: m.scrap_pct,
        requiredQty: q6(m.required_qty),
        issuedQty: q6(m.issued_qty),
        scrappedQty: q6(m.scrapped_qty),
        outstandingQty: outstanding,
        reservedQty: reserved,
        availableQty: available,
        shortageQty: open || mo.status === 'draft' ? Math.max(0, q6(outstanding - reserved - available)) : 0,
        estUnitCostCents: m.est_unit_cost_cents,
      };
    }),
    operations: ops.map((o) => {
      const mach = o.machine_id ? machines.get(o.machine_id) : null;
      const st = mach?.asset_id ? states.get(mach.asset_id) : null;
      return { ...moOpDTO(o, ops), machineDown: !!st?.down, breakdown: st?.workOrder ?? null };
    }),
    time: time.results.map((t) => ({ id: t.id, operationId: t.operation_id, opNo: t.op_no, kind: t.kind, kindLabel: label(TIME_KINDS, t.kind), userId: t.user_id, userName: t.user_name ?? null, machineCode: t.machine_code ?? null, startedAt: t.started_at, endedAt: t.ended_at, minutes: t.minutes === null ? null : Math.round(t.minutes * 100) / 100, running: t.minutes === null, rework: !!t.rework, rateCents: t.rate_cents, costCents: t.cost_cents, overheadCents: t.overhead_cents, note: t.note, createdAt: t.created_at })),
    reports: reports.results.map((r) => ({ id: r.id, operationId: r.operation_id, opNo: r.op_no, kind: r.kind, kindLabel: label(REPORT_KINDS, r.kind), quantity: q6(r.quantity), minutes: r.minutes, reason: r.reason, byName: r.by_name ?? null, createdAt: r.created_at })),
    receipts: receipts.results.map((x) => ({ id: x.id, number: x.number, quantity: q6(x.quantity), locationCode: `${x.warehouse_code}/${x.location_code}`, lot: x.lot, serials: parseJson<string[]>(x.serials_json, []), unitCostCents: x.unit_cost_cents, valueCents: x.value_cents, byName: x.by_name ?? null, createdAt: x.created_at })),
    revisions: revisions.results.map((r) => ({ revision: r.revision, reason: r.reason, byName: r.by_name ?? null, changedAt: r.changed_at, snapshot: parseJson<Record<string, unknown>>(r.snapshot_json, {}) })),
    costs: await costView(db, a.companyId, mo),
    integration: integration.results.map((e) => ({ id: e.id, kind: e.kind, kindLabel: e.kind === 'finance.production_variance' ? 'Production variance to Finance' : 'Production posting to Finance', status: e.status, note: e.last_error, amountCents: e.amount_cents, createdAt: e.created_at })),
    files: await recordFiles(db, a.companyId, 'manufacturing_order', mo.id),
    history: await historyOf(db, a.companyId, { entityType: 'manufacturing_order', entityId: mo.id }),
    qualityNote: 'Inspection points record a pass or fail with a note. Full Quality (inspection plans, nonconformances, corrective actions) is Release 4.',
    can: {
      plan: can(a, 'production.plan'),
      edit: can(a, 'production.plan') && ['draft', 'released', 'in_progress'].includes(mo.status),
      release: can(a, 'production.plan') && mo.status === 'draft',
      execute: can(a, 'production.execute') && open,
      issue: can(a, 'production.issue') && open,
      returnMaterials: can(a, 'production.issue') && (open || mo.status === 'completed'),
      receive: can(a, 'production.receive') && open,
      complete: can(a, 'production.plan') && open,
      close: can(a, 'production.plan') && mo.status === 'completed',
      cancel: can(a, 'production.plan') && (mo.status === 'draft' || mo.status === 'released'),
    },
  });
});

productionRoutes.get('/c/:company/mos/:id/costs', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const mo = await loadMo(db, a.companyId, c.req.param('id'));
  const view = await costView(db, a.companyId, mo);
  if (wantsCsv(c)) return csvResponse(`costs-${mo.number}`, [['Element', `Estimated (${mo.currency})`, 'Actual', 'Variance'], ...view.elements.map((e) => [e.label, dollars(e.estimatedCents), dollars(e.actualCents), dollars(e.varianceCents)]), ['Total', dollars(view.estimatedCents), dollars(view.actualCents), dollars(view.varianceCents)]]);
  return c.json({ order: moDTO(mo), ...view });
});

// ------------------------------------------------------------------ changing an order

productionRoutes.patch('/c/:company/mos/:id', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const mo = await loadMo(db, a.companyId, c.req.param('id'));
  if (!['draft', 'released', 'in_progress'].includes(mo.status)) badState(`${mo.number} is ${label(MO_STATUS, mo.status).toLowerCase()} and cannot change`);
  const input = await body(c, zMoIn.omit({ productId: true }).partial().extend({ reason: zText(1000).optional() }));
  const t = now();
  const assignees = input.assignees ? await checkAssignees(db, a, input.assignees) : null;
  const fg = input.fgLocationId !== undefined ? await checkFgLocation(db, a.companyId, input.fgLocationId) : mo.fg_location_id;
  const qty = input.quantity ?? mo.quantity;
  const settings = await loadMfgSettings(db, a.companyId);
  const { centres, machines } = await workCentreMaps(db, a.companyId);
  const stmts: D1PreparedStatement[] = [];
  const head = {
    quantity: qty,
    required_date: input.requiredDate !== undefined ? input.requiredDate : mo.required_date,
    start_date: input.startDate !== undefined ? input.startDate ?? todayIso() : mo.start_date,
    method: input.method ?? mo.method,
    production_type: input.productionType ?? mo.production_type,
    priority: input.priority ?? mo.priority,
    customer_ref: input.customerRef ?? mo.customer_ref,
    notes: input.notes ?? mo.notes,
    fg_location_id: fg,
  };
  let summary: string;
  if (mo.status === 'draft') {
    // A draft is rebuilt from its sources: the bill of materials, routing, quantity and dates may all change.
    const p = await loadProduct(db, a.companyId, mo.product_id);
    // a draft follows the released bill of materials and routing unless others are chosen
    const { bom, routing } = await sources(db, a.companyId, p, input.bomRevisionId, input.routingId);
    const ops = await routingOps(db, a.companyId, routing.id);
    const materials = await planMaterials(db, a.companyId, bom.id, qty, head.start_date ?? todayIso());
    if (!materials.length) throw new HttpError(400, `The bill of materials of ${p.number} has no lines to make it from`);
    const plan = scheduleOps(ops, head.start_date ?? todayIso(), qty, centres);
    const finish = [...plan.values()].reduce((m, x) => (x.finish > m ? x.finish : m), head.start_date ?? todayIso());
    const est = estimateFor(qty, materials, ops, centres, machines);
    const maxQty = q6(qty * (1 + settings.overCompletionPct / 100));
    // only while it is still a draft: released at the same moment, the rebuilt operations clash and nothing changes
    const isDraft = "EXISTS (SELECT 1 FROM erp_mfg_orders WHERE company_id = ?1 AND id = ?2 AND status = 'draft')";
    stmts.push(
      db.prepare(`DELETE FROM erp_mo_materials WHERE company_id = ?1 AND mo_id = ?2 AND ${isDraft}`).bind(a.companyId, mo.id),
      db.prepare(`DELETE FROM erp_mo_operations WHERE company_id = ?1 AND mo_id = ?2 AND ${isDraft}`).bind(a.companyId, mo.id),
      db
        .prepare(
          `UPDATE erp_mfg_orders SET bom_revision_id = ?, routing_id = ?, quantity = ?, max_qty = ?, start_date = ?, required_date = ?, finish_date = ?, method = ?, production_type = ?, priority = ?, customer_ref = ?, notes = ?, fg_location_id = ?,
             est_material_cents = ?, est_labour_cents = ?, est_machine_cents = ?, est_outsource_cents = ?, est_overhead_cents = ?, est_scrap_cents = ?, est_missing = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'`,
        )
        .bind(bom.id, routing.id, qty, maxQty, head.start_date, head.required_date, finish, head.method, head.production_type, head.priority, head.customer_ref, head.notes, fg, est.material, est.labour, est.machine, est.outsource, est.overhead, est.scrap, est.missing.join(','), searchText(mo.number, mo.product_number, mo.product_name, head.customer_ref, head.notes), t, a.companyId, mo.id),
      ...buildStmts(db, a.companyId, mo.id, qty, maxQty, materials, ops, plan),
    );
    summary = `${mo.number} changed (draft)`;
  } else {
    // A released order is amended with a reason; the version before is kept.
    if (!input.reason?.trim()) throw new HttpError(400, 'Say why the order is amended');
    if (input.bomRevisionId || input.routingId) badState('The bill of materials and routing of a released order cannot change. Cancel it and make a new one, or finish it.');
    if (qty + 1e-9 < mo.completed_qty) throw new HttpError(400, `${q6(mo.completed_qty)} is already completed: the quantity cannot go below it`);
    const materials = await moMaterials(db, a.companyId, mo.id);
    const ops = await moOps(db, a.companyId, mo.id);
    const maxQty = q6(qty * (1 + settings.overCompletionPct / 100));
    if (ops.some((o) => o.good_qty > maxQty + 1e-9)) throw new HttpError(400, 'An operation has already reported more good output than the new quantity allows');
    const prevAssignees = (await db.prepare('SELECT user_id FROM erp_mo_assignees WHERE company_id = ? AND mo_id = ?').bind(a.companyId, mo.id).all<{ user_id: string }>()).results.map((r) => r.user_id);
    const snapshot = { revision: mo.revision, quantity: mo.quantity, requiredDate: mo.required_date, startDate: mo.start_date, priority: mo.priority, customerRef: mo.customer_ref, notes: mo.notes, fgLocationId: mo.fg_location_id, assignees: prevAssignees, materials: materials.map((m) => ({ product: m.product_number, required: m.required_qty })) };
    const planMats: MaterialPlan[] = materials.map((m) => ({ productId: m.product_id, number: m.product_number, bomLineId: m.bom_line_id, qtyPer: m.qty_per, scrapPct: m.scrap_pct, requiredQty: q6(qty * m.qty_per * (1 + m.scrap_pct / 100)), unitCost: m.est_unit_cost_cents, uom: m.uom }));
    const est = estimateFor(qty, planMats, ops, centres, machines);
    let finish = mo.finish_date;
    if (qty !== mo.quantity || head.start_date !== mo.start_date) {
      const pending = ops.filter((o) => o.status === 'pending');
      const plan = scheduleOps(ops, head.start_date ?? todayIso(), qty, centres);
      for (const o of pending) {
        const s = plan.get(o.op_no)!;
        stmts.push(db.prepare("UPDATE erp_mo_operations SET planned_start = ?, planned_finish = ? WHERE company_id = ? AND id = ? AND status = 'pending'").bind(s.start, s.finish, a.companyId, o.id));
      }
      finish = [...plan.values()].reduce((m, x) => (x.finish > m ? x.finish : m), head.start_date ?? todayIso());
    }
    stmts.push(
      db.prepare('INSERT INTO erp_mo_revisions (id, company_id, mo_id, revision, snapshot_json, reason, changed_by, changed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, mo.id, mo.revision, JSON.stringify(snapshot).slice(0, 60000), input.reason, a.userId, t),
      // max_qty first on the operations: their CHECK keeps good output within it
      db.prepare('UPDATE erp_mo_operations SET max_qty = ? WHERE company_id = ? AND mo_id = ?').bind(maxQty, a.companyId, mo.id),
      db
        .prepare(
          `UPDATE erp_mfg_orders SET quantity = ?, max_qty = ?, start_date = ?, required_date = ?, finish_date = ?, priority = ?, customer_ref = ?, notes = ?, fg_location_id = ?, method = ?, production_type = ?, revision = revision + 1,
             est_material_cents = ?, est_labour_cents = ?, est_machine_cents = ?, est_outsource_cents = ?, est_overhead_cents = ?, est_scrap_cents = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('released','in_progress') AND revision = ?`,
        )
        .bind(qty, maxQty, head.start_date, head.required_date, finish, head.priority, head.customer_ref, head.notes, fg, head.method, head.production_type, est.material, est.labour, est.machine, est.outsource, est.overhead, est.scrap, searchText(mo.number, mo.product_number, mo.product_name, head.customer_ref, head.notes), t, a.companyId, mo.id, mo.revision),
    );
    if (qty !== mo.quantity) for (const m of materials) stmts.push(db.prepare('UPDATE erp_mo_materials SET required_qty = ? WHERE company_id = ? AND id = ?').bind(q6(qty * m.qty_per * (1 + m.scrap_pct / 100)), a.companyId, m.id));
    summary = `${mo.number} amended to revision ${mo.revision + 1}: ${input.reason}`;
  }
  if (assignees) {
    stmts.push(db.prepare('DELETE FROM erp_mo_assignees WHERE company_id = ? AND mo_id = ?').bind(a.companyId, mo.id));
    for (const u of assignees) stmts.push(db.prepare('INSERT INTO erp_mo_assignees (company_id, mo_id, user_id) VALUES (?, ?, ?)').bind(a.companyId, mo.id, u));
  }
  const before = { quantity: mo.quantity, requiredDate: mo.required_date, startDate: mo.start_date, priority: mo.priority, customerRef: mo.customer_ref };
  const after = { quantity: qty, requiredDate: head.required_date, startDate: head.start_date, priority: head.priority, customerRef: head.customer_ref };
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: mo.status === 'draft' ? 'mo.changed' : 'mo.amended', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary, before, after, at: t }));
  try {
    await db.batch(stmts);
  } catch (e) {
    if (/CHECK constraint failed|UNIQUE constraint failed|FOREIGN KEY constraint failed/i.test(String((e as Error)?.message ?? e))) badState('The order changed at the same moment: reload it');
    throw e;
  }
  const fresh = await loadMo(db, a.companyId, mo.id);
  if (mo.status !== 'draft' && fresh.revision === mo.revision) badState(`${mo.number} changed at the same moment: reload it and amend it again`);
  return c.json(moDTO(fresh));
});

/** Reserves what stock allows for each material (outside quarantine, soonest expiry first), through StockOps. */
async function reserveMaterials(db: D1Database, a: ErpAccess, ops: StockOps, mo: any, materials: any[], stmts: D1PreparedStatement[]) {
  const ids = [...new Set(materials.map((m) => m.product_id))];
  if (!ids.length) return [];
  const rows = (
    await db
      .prepare(
        `SELECT s.id, s.product_id, s.location_id, s.lot, s.serial, s.on_hand, s.reserved FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id
          WHERE s.company_id = ? AND s.product_id IN (${ids.map(() => '?').join(',')}) AND l.kind <> 'quarantine' AND l.archived_at IS NULL AND s.on_hand - s.reserved > 1e-9
          ORDER BY s.product_id, COALESCE(s.expiry, '9999'), l.code, s.lot, s.serial`,
      )
      .bind(a.companyId, ...ids)
      .all<any>()
  ).results.map((r) => ({ ...r, left: q6(r.on_hand - r.reserved) }));
  const done: { product: string; quantity: number }[] = [];
  for (const m of materials) {
    let need = Math.max(0, q6(m.required_qty - m.issued_qty - Number(m.reserved_open ?? 0)));
    for (const r of rows) {
      if (need <= 1e-9) break;
      if (r.product_id !== m.product_id || r.left <= 1e-9) continue;
      const take = q6(Math.min(need, r.left));
      r.left = q6(r.left - take);
      need = q6(need - take);
      const resId = newId();
      ops.reserve({ productId: r.product_id, locationId: r.location_id, lot: r.lot, serial: r.serial }, take, { source: 'manufacturing_order', sourceId: mo.id, reference: mo.number });
      stmts.push(
        db.prepare('INSERT INTO erp_reservations (id, company_id, stock_id, product_id, quantity, reference, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(resId, a.companyId, r.id, r.product_id, take, `${mo.number} (${m.product_number})`, a.userId, ops.t, ops.t),
        db.prepare('INSERT INTO erp_mo_reservations (company_id, reservation_id, mo_id, material_id) VALUES (?, ?, ?, ?)').bind(a.companyId, resId, mo.id, m.id),
      );
      done.push({ product: m.product_number, quantity: take });
    }
  }
  return done;
}

/** Releases the order's open reservations (when it is completed or cancelled). */
async function releaseReservations(db: D1Database, a: ErpAccess, ops: StockOps, mo: any, stmts: D1PreparedStatement[], reason: string) {
  const rows = await db
    .prepare(
      `SELECT r.id, r.quantity, r.issued_qty, r.released_qty, s.product_id, s.location_id, s.lot, s.serial FROM erp_mo_reservations mr JOIN erp_reservations r ON r.company_id = mr.company_id AND r.id = mr.reservation_id
         JOIN erp_stock s ON s.company_id = r.company_id AND s.id = r.stock_id WHERE mr.company_id = ? AND mr.mo_id = ? AND r.status = 'open'`,
    )
    .bind(a.companyId, mo.id)
    .all<any>();
  for (const r of rows.results) {
    const open = q6(r.quantity - r.issued_qty - r.released_qty);
    if (open <= 1e-9) continue;
    ops.reserve({ productId: r.product_id, locationId: r.location_id, lot: r.lot, serial: r.serial }, -open, { source: 'manufacturing_order', sourceId: mo.id, reference: mo.number, reason });
    stmts.push(db.prepare("UPDATE erp_reservations SET released_qty = round(released_qty + ?, 6), status = 'released', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'").bind(open, ops.t, a.companyId, r.id));
  }
  return rows.results.length;
}

productionRoutes.post('/c/:company/mos/:id/release', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const mo = await loadMo(db, a.companyId, c.req.param('id'));
  if (mo.status !== 'draft') badState(`${mo.number} is ${label(MO_STATUS, mo.status).toLowerCase()}: only a draft is released`);
  const input = await body(c, z.object({ reserve: z.boolean().optional() }));
  if (mo.bom_status !== 'released') badState(`Bill of materials revision ${mo.bom_revision} of ${mo.product_number} is no longer released. Change the order to the released revision first.`);
  if (mo.routing_status !== 'released') badState(`Routing revision ${mo.routing_revision} of ${mo.product_number} is no longer released. Change the order to the released routing first.`);
  const materials = await moMaterials(db, a.companyId, mo.id);
  const ops = await moOps(db, a.companyId, mo.id);
  const settings = await loadMfgSettings(db, a.companyId);
  const stockSettings = await loadSettings(db, a.companyId);
  const { centres } = await workCentreMaps(db, a.companyId);
  const stock = await availableByProduct(db, a.companyId, materials.map((m) => m.product_id));
  const shortages = materials
    .map((m) => ({ productId: m.product_id, number: m.product_number, name: m.product_name, required: q6(m.required_qty), available: stock.get(m.product_id)?.available ?? 0 }))
    .map((s) => ({ ...s, short: Math.max(0, q6(s.required - s.available)) }))
    .filter((s) => s.short > 0);
  const stockOps = new StockOps(db, a, stockSettings);
  const t = stockOps.t;
  const after: D1PreparedStatement[] = [];
  const reserve = input.reserve ?? settings.reserveOnRelease;
  const reserved = reserve ? await reserveMaterials(db, a, stockOps, mo, materials, after) : [];
  // planned again from today (or the start date, if later)
  const start = mo.start_date && mo.start_date > todayIso() ? mo.start_date : todayIso();
  const plan = scheduleOps(ops, start, mo.quantity, centres);
  for (const o of ops) {
    const s = plan.get(o.op_no)!;
    after.push(db.prepare('UPDATE erp_mo_operations SET planned_start = ?, planned_finish = ? WHERE company_id = ? AND id = ?').bind(s.start, s.finish, a.companyId, o.id));
  }
  const finish = [...plan.values()].reduce((m, x) => (x.finish > m ? x.finish : m), start);
  after.push(
    db.prepare("UPDATE erp_mfg_orders SET status = 'released', released_by = ?, released_at = ?, start_date = ?, finish_date = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'").bind(a.userId, t, start, finish, t, a.companyId, mo.id),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'mo.released',
      entityType: 'manufacturing_order',
      entityId: mo.id,
      productId: mo.product_id,
      summary: `${mo.number} released${reserved.length ? `; reserved ${reserved.map((r) => `${r.quantity} ${r.product}`).join(', ')}` : ''}${shortages.length ? `; short of ${shortages.map((s) => `${s.short} ${s.number}`).join(', ')}` : ''}`,
      after: { start, finish, reserved: reserved.length, shortages: shortages.length },
      at: t,
    }),
  );
  // a draft leaves draft once: a second release, or a cancel, at the same moment fails whole (and reserves nothing twice)
  await runStock(db, stockOps.all([onceStmt(db, a.companyId, `mo-leave-draft:${mo.id}`, t)], after, { type: 'manufacturing_order', id: mo.id, kind: 'finance.production_posting' }));
  return c.json({ order: moDTO(await loadMo(db, a.companyId, mo.id)), shortages, reserved });
});

productionRoutes.post('/c/:company/mos/:id/cancel', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const mo = await loadMo(db, a.companyId, c.req.param('id'));
  if (mo.status !== 'draft' && mo.status !== 'released') badState(`${mo.number} is ${label(MO_STATUS, mo.status).toLowerCase()}: complete and close it instead`);
  const input = await body(c, z.object({ reason: zText(1000).min(1, 'Say why the order is cancelled') }));
  const work = await db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM erp_mo_materials WHERE company_id = ?1 AND mo_id = ?2 AND (abs(issued_qty) > 1e-9 OR scrapped_qty > 0)) +
              (SELECT COUNT(*) FROM erp_mo_time WHERE company_id = ?1 AND mo_id = ?2) + (SELECT COUNT(*) FROM erp_mo_reports WHERE company_id = ?1 AND mo_id = ?2) +
              (SELECT COUNT(*) FROM erp_mo_receipts WHERE company_id = ?1 AND mo_id = ?2) AS n`,
    )
    .bind(a.companyId, mo.id)
    .first<{ n: number }>();
  if (work?.n) badState(`${mo.number} has recorded work, materials or receipts: return the materials and complete and close it instead`);
  const stockOps = new StockOps(db, a, await loadSettings(db, a.companyId));
  const after: D1PreparedStatement[] = [];
  await releaseReservations(db, a, stockOps, mo, after, 'Order cancelled');
  after.push(
    db.prepare("UPDATE erp_mfg_orders SET status = 'cancelled', cancelled_by = ?, cancelled_at = ?, cancel_reason = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('draft','released')").bind(a.userId, stockOps.t, input.reason, stockOps.t, a.companyId, mo.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.cancelled', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `${mo.number} cancelled: ${input.reason}`, at: stockOps.t }),
  );
  const once = mo.status === 'draft' ? `mo-leave-draft:${mo.id}` : `mo-cancel:${mo.id}`;
  await runStock(db, stockOps.all([onceStmt(db, a.companyId, once, stockOps.t)], after, { type: 'manufacturing_order', id: mo.id, kind: 'finance.production_posting' }));
  return c.json(moDTO(await loadMo(db, a.companyId, mo.id)));
});

productionRoutes.post('/c/:company/mos/:id/complete', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const mo = await loadMo(db, a.companyId, c.req.param('id'));
  if (!OPEN.includes(mo.status)) badState(`${mo.number} is ${label(MO_STATUS, mo.status).toLowerCase()}: only a released order in progress is completed`);
  const ops = await moOps(db, a.companyId, mo.id);
  const notDone = ops.filter((o) => o.status !== 'completed');
  if (notDone.length) badState(`Complete operation${notDone.length === 1 ? '' : 's'} ${notDone.map((o) => o.op_no).join(', ')} first`);
  const running = await db.prepare('SELECT COUNT(*) AS n FROM erp_mo_time WHERE company_id = ? AND mo_id = ? AND minutes IS NULL').bind(a.companyId, mo.id).first<{ n: number }>();
  if (running?.n) badState('Stop the running timers first');
  const stockOps = new StockOps(db, a, await loadSettings(db, a.companyId));
  const after: D1PreparedStatement[] = [];
  const released = await releaseReservations(db, a, stockOps, mo, after, 'Order completed');
  after.push(
    db.prepare("UPDATE erp_mfg_orders SET status = 'completed', completed_by = ?, completed_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('released','in_progress')").bind(a.userId, stockOps.t, stockOps.t, a.companyId, mo.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.completed', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `${mo.number} completed: ${q6(mo.completed_qty)} of ${q6(mo.quantity)} received${released ? '; unused reservations released' : ''}`, at: stockOps.t }),
  );
  await runStock(db, stockOps.all([onceStmt(db, a.companyId, `mo-complete:${mo.id}`, stockOps.t)], after, { type: 'manufacturing_order', id: mo.id, kind: 'finance.production_posting' }));
  return c.json(moDTO(await loadMo(db, a.companyId, mo.id)));
});

productionRoutes.post('/c/:company/mos/:id/close', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const mo = await loadMo(db, a.companyId, c.req.param('id'));
  if (mo.status !== 'completed') badState(`${mo.number} is ${label(MO_STATUS, mo.status).toLowerCase()}: complete it before closing`);
  const actual = await actualCosts(db, a.companyId, mo.id);
  const est = estimateOf(mo);
  const t = now();
  const unabsorbed = actual.total - mo.received_value_cents;
  const stmts: D1PreparedStatement[] = [
    onceStmt(db, a.companyId, `mo-close:${mo.id}`, t),
    ...COST_ELEMENTS.map((k) => db.prepare('INSERT INTO erp_mo_costs (company_id, mo_id, element, estimated_cents, actual_cents, variance_cents) VALUES (?, ?, ?, ?, ?, ?)').bind(a.companyId, mo.id, k, est[k], actual[k], actual[k] - est[k])),
    db.prepare("UPDATE erp_mfg_orders SET status = 'closed', closed_by = ?, closed_at = ?, actual_cents = ?, variance_cents = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'completed'").bind(a.userId, t, actual.total, actual.total - est.total, t, a.companyId, mo.id),
    // the cost not taken into finished goods stock: recorded for Finance as planned (nothing is posted)
    db
      .prepare(
        `INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, last_error, amount_cents, created_by, created_at, updated_at)
         VALUES (?, ?, 'finance.production_variance', 'manufacturing_order', ?, 'finance', ?, 'planned', 0, ?, ?, ?, ?, ?)`,
      )
      .bind(newId(), a.companyId, mo.id, `mo-close:${a.companyId}:${mo.id}`, PLANNED_POSTING, unabsorbed, a.userId, t, t),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'mo.closed',
      entityType: 'manufacturing_order',
      entityId: mo.id,
      productId: mo.product_id,
      summary: `${mo.number} closed: actual ${dollars(actual.total)} against an estimate of ${dollars(est.total)} (variance ${dollars(actual.total - est.total)}); ${dollars(mo.received_value_cents)} taken into stock`,
      after: { actual: actual.total, estimated: est.total, variance: actual.total - est.total, unabsorbed },
      at: t,
    }),
  ];
  try {
    await db.batch(stmts);
  } catch (e) {
    stockError(e);
  }
  return c.json(moDTO(await loadMo(db, a.companyId, mo.id)));
});

// ------------------------------------------------------------------ materials

const zLine = z.object({ materialId: zId, locationId: zId, lot: zText(80).optional(), serial: zText(80).optional(), quantity: zQ });

async function openMo(db: D1Database, a: ErpAccess, id: string, statuses = OPEN) {
  const mo = await loadMo(db, a.companyId, id);
  if (!statuses.includes(mo.status)) badState(`${mo.number} is ${label(MO_STATUS, mo.status).toLowerCase()}: ${mo.status === 'draft' ? 'release it first' : 'nothing more can be recorded on it'}`);
  return mo;
}

/** Turns the order to in progress (from released) in the same transaction as the first work recorded on it. */
const startedStmt = (db: D1Database, companyId: string, moId: string, t: number) =>
  db.prepare("UPDATE erp_mfg_orders SET status = 'in_progress', started_at = COALESCE(started_at, ?), updated_at = ? WHERE company_id = ? AND id = ? AND status = 'released'").bind(t, t, companyId, moId);

productionRoutes.post('/c/:company/mos/:id/issue', async (c) => {
  const a = await requireErp(c, 'production.issue');
  const db = c.env.DB;
  const mo = await openMo(db, a, c.req.param('id'));
  const input = await body(c, z.object({ requestKey: zKey, lines: z.array(zLine).min(1).max(100) }));
  const materials = new Map((await moMaterials(db, a.companyId, mo.id)).map((m) => [m.id, m]));
  const reservations = (
    await db
      .prepare(
        `SELECT r.id, r.quantity, r.issued_qty, r.released_qty, s.product_id, s.location_id, s.lot, s.serial, mr.material_id FROM erp_mo_reservations mr JOIN erp_reservations r ON r.company_id = mr.company_id AND r.id = mr.reservation_id
           JOIN erp_stock s ON s.company_id = r.company_id AND s.id = r.stock_id WHERE mr.company_id = ? AND mr.mo_id = ? AND r.status = 'open'`,
      )
      .bind(a.companyId, mo.id)
      .all<any>()
  ).results.map((r) => ({ ...r, open: q6(r.quantity - r.issued_qty - r.released_qty) }));
  const ops = new StockOps(db, a, await loadSettings(db, a.companyId));
  const before: D1PreparedStatement[] = [];
  if (input.requestKey) before.push(onceStmt(db, a.companyId, `mo-issue:${input.requestKey}`, ops.t));
  const after: D1PreparedStatement[] = [];
  const summary: string[] = [];
  for (const [i, x] of input.lines.entries()) {
    const m = materials.get(x.materialId);
    if (!m) throw new HttpError(400, `Line ${i + 1} is not a material of ${mo.number}`);
    const { p, l, key } = await stockKey(db, a.companyId, { productId: m.product_id, locationId: x.locationId, lot: x.lot, serial: x.serial }, { incoming: false, quantity: x.quantity });
    if (l.kind === 'quarantine') throw new HttpError(400, `Line ${i + 1}: stock in quarantine cannot be issued to production`);
    let left = x.quantity;
    // the order's own reservations on this stock first
    for (const r of reservations) {
      if (left <= 1e-9) break;
      if (r.material_id !== m.id || r.product_id !== key.productId || r.location_id !== key.locationId || r.lot !== (key.lot ?? '') || r.serial !== (key.serial ?? '') || r.open <= 1e-9) continue;
      const take = q6(Math.min(left, r.open));
      r.open = q6(r.open - take);
      left = q6(left - take);
      await ops.takeOut('production_issue', key, take, { source: 'manufacturing_order', sourceId: mo.id, reference: mo.number, fromReserved: true });
      // guarded by the reservation's own CHECK (issued plus released never above the quantity)
      after.push(db.prepare("UPDATE erp_reservations SET issued_qty = round(issued_qty + ?, 6), status = CASE WHEN round(quantity - issued_qty - released_qty - ?, 6) <= 1e-9 THEN 'issued' ELSE status END, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'").bind(take, take, ops.t, a.companyId, r.id));
    }
    if (left > 1e-9) await ops.takeOut('production_issue', key, left, { source: 'manufacturing_order', sourceId: mo.id, reference: mo.number });
    after.push(db.prepare('UPDATE erp_mo_materials SET issued_qty = round(issued_qty + ?, 6) WHERE company_id = ? AND id = ?').bind(x.quantity, a.companyId, m.id));
    summary.push(`${x.quantity} ${p.uom} of ${p.number} from ${l.warehouse_code}/${l.code}${key.lot ? ` lot ${key.lot}` : ''}${key.serial ? ` serial ${key.serial}` : ''}`);
  }
  after.push(startedStmt(db, a.companyId, mo.id, ops.t), eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.issued', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `Issued to ${mo.number}: ${summary.join('; ')}`, at: ops.t }));
  await runStock(db, ops.all(before, after, { type: 'manufacturing_order', id: mo.id, kind: 'finance.production_posting' }));
  return c.json({ ok: true, groupId: ops.groupId }, 201);
});

/** The average cost at which the order took a product (issued less returned), for a return; else its cost now. */
async function issuedUnitCost(db: D1Database, companyId: string, moId: string, productId: string) {
  const r = await db
    .prepare("SELECT COALESCE(SUM(-value_delta_cents), 0) AS v, COALESCE(SUM(-on_hand_delta), 0) AS q FROM erp_stock_moves WHERE company_id = ? AND source_type = 'manufacturing_order' AND source_id = ? AND product_id = ? AND move_type IN ('production_issue','production_return')")
    .bind(companyId, moId, productId)
    .first<{ v: number; q: number }>();
  return r && r.q > 1e-9 ? r.v / r.q : currentUnitCost(db, companyId, productId);
}

productionRoutes.post('/c/:company/mos/:id/return', async (c) => {
  const a = await requireErp(c, 'production.issue');
  const db = c.env.DB;
  const mo = await openMo(db, a, c.req.param('id'), [...OPEN, 'completed']);
  const input = await body(c, z.object({ requestKey: zKey, reason: zText(500).optional(), lines: z.array(zLine.extend({ expiry: zDate.optional() })).min(1).max(100) }));
  const materials = new Map((await moMaterials(db, a.companyId, mo.id)).map((m) => [m.id, m]));
  const ops = new StockOps(db, a, await loadSettings(db, a.companyId));
  const before: D1PreparedStatement[] = [];
  if (input.requestKey) before.push(onceStmt(db, a.companyId, `mo-return:${input.requestKey}`, ops.t));
  const after: D1PreparedStatement[] = [];
  const summary: string[] = [];
  for (const [i, x] of input.lines.entries()) {
    const m = materials.get(x.materialId);
    if (!m) throw new HttpError(400, `Line ${i + 1} is not a material of ${mo.number}`);
    if (x.quantity > m.issued_qty + 1e-9) throw new HttpError(400, `Line ${i + 1}: ${q6(m.issued_qty)} of ${m.product_number} is issued to ${mo.number}; more cannot come back`);
    const row = await db.prepare('SELECT expiry FROM erp_stock WHERE company_id = ? AND product_id = ? AND location_id = ? AND lot = ? AND serial = ?').bind(a.companyId, m.product_id, x.locationId, (x.lot ?? '').trim(), (x.serial ?? '').trim()).first<{ expiry: string | null }>();
    const expiry = x.expiry ?? row?.expiry ?? null;
    const { p, l, key } = await stockKey(db, a.companyId, { productId: m.product_id, locationId: x.locationId, lot: x.lot, serial: x.serial }, { incoming: true, quantity: x.quantity, expiry });
    const unitCost = await issuedUnitCost(db, a.companyId, mo.id, m.product_id);
    await ops.addIn('production_return', key, x.quantity, { source: 'manufacturing_order', sourceId: mo.id, reference: mo.number, reason: input.reason ?? 'Unused', unitCost, expiry });
    // the CHECK on issued_qty refuses returning more than was issued, also under concurrency
    after.push(db.prepare('UPDATE erp_mo_materials SET issued_qty = round(issued_qty - ?, 6) WHERE company_id = ? AND id = ?').bind(x.quantity, a.companyId, m.id));
    summary.push(`${x.quantity} ${p.uom} of ${p.number} to ${l.warehouse_code}/${l.code}`);
  }
  after.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.returned', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `Returned from ${mo.number}: ${summary.join('; ')}`, at: ops.t }));
  await runStock(db, ops.all(before, after, { type: 'manufacturing_order', id: mo.id, kind: 'finance.production_posting' }));
  return c.json({ ok: true, groupId: ops.groupId }, 201);
});

productionRoutes.post('/c/:company/mos/:id/scrap-material', async (c) => {
  const a = await requireErp(c, 'production.issue');
  const db = c.env.DB;
  const mo = await openMo(db, a, c.req.param('id'));
  const input = await body(c, zLine.extend({ reason: zText(500).min(1, 'Say why it is scrapped'), requestKey: zKey }));
  const m = (await moMaterials(db, a.companyId, mo.id)).find((x) => x.id === input.materialId);
  if (!m) throw new HttpError(400, `That is not a material of ${mo.number}`);
  const { p, l, key } = await stockKey(db, a.companyId, { productId: m.product_id, locationId: input.locationId, lot: input.lot, serial: input.serial }, { incoming: false, quantity: input.quantity });
  if (l.kind === 'quarantine') throw new HttpError(400, 'Scrap stock in quarantine through Inventory');
  const ops = new StockOps(db, a, await loadSettings(db, a.companyId));
  await ops.takeOut('production_scrap', key, input.quantity, { source: 'manufacturing_order', sourceId: mo.id, reference: mo.number, reason: input.reason });
  await runStock(
    db,
    ops.all(
      input.requestKey ? [onceStmt(db, a.companyId, `mo-scrap:${input.requestKey}`, ops.t)] : [],
      [
        db.prepare('UPDATE erp_mo_materials SET scrapped_qty = round(scrapped_qty + ?, 6) WHERE company_id = ? AND id = ?').bind(input.quantity, a.companyId, m.id),
        startedStmt(db, a.companyId, mo.id, ops.t),
        eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.material_scrapped', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `Scrapped for ${mo.number}: ${input.quantity} ${p.uom} of ${p.number} at ${l.warehouse_code}/${l.code} (${input.reason})`, at: ops.t }),
      ],
      { type: 'manufacturing_order', id: mo.id, kind: 'finance.production_posting' },
    ),
  );
  return c.json({ ok: true }, 201);
});

// ------------------------------------------------------------------ operations

async function loadOp(db: D1Database, companyId: string, moId: string, opId: string) {
  const ops = await moOps(db, companyId, moId);
  const o = ops.find((x) => x.id === opId);
  if (!o) throw notFound('Operation');
  return { o, ops };
}

/** The cost a time entry adds: minutes at the rate per hour, and its overheads. */
function timeCost(kind: string, minutes: number, rate: number, w: any) {
  const cost = Math.round((minutes / 60) * rate);
  const overhead = Math.round((kind === 'labour' ? (minutes / 60) * Number(w?.overhead_rate_cents ?? 0) : 0) + (cost * Number(w?.overhead_pct ?? 0)) / 100);
  return { cost, overhead };
}

/** Statements that stop the operation's running timers (all of them, or one person's). */
async function stopTimers(db: D1Database, companyId: string, o: any, t: number, userId?: string, kind?: string) {
  const rows = await db
    .prepare(`SELECT t.* FROM erp_mo_time t WHERE t.company_id = ? AND t.operation_id = ? AND t.minutes IS NULL ${userId ? 'AND t.user_id = ?' : ''} ${kind ? 'AND t.kind = ?' : ''}`)
    .bind(companyId, o.id, ...(userId ? [userId] : []), ...(kind ? [kind] : []))
    .all<any>();
  const w = o.work_centre_id ? await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ? AND id = ?').bind(companyId, o.work_centre_id).first<any>() : null;
  return rows.results.map((r) => {
    const minutes = Math.max(0, Math.round(((t - Number(r.started_at)) / 60000) * 100) / 100);
    const { cost, overhead } = timeCost(r.kind, minutes, r.rate_cents, w);
    return db.prepare('UPDATE erp_mo_time SET ended_at = ?, minutes = ?, cost_cents = ?, overhead_cents = ? WHERE company_id = ? AND id = ? AND minutes IS NULL').bind(t, minutes, cost, overhead, companyId, r.id);
  });
}

productionRoutes.post('/c/:company/mos/:id/operations/:opId/:action{start|pause|complete}', async (c) => {
  const a = await requireErp(c, 'production.execute');
  const db = c.env.DB;
  const mo = await openMo(db, a, c.req.param('id'));
  const { o, ops } = await loadOp(db, a.companyId, mo.id, c.req.param('opId'));
  const action = c.req.param('action');
  const input = await body(c, z.object({ timer: z.boolean().optional(), actualOutsourceCents: z.number().int().min(0).max(1e13).optional(), goodQty: z.number().min(0).max(1e9).optional(), note: zText(500).optional() }));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let summary: string;
  if (action === 'start') {
    if (o.status === 'in_progress') badState(`Operation ${o.op_no} is already in progress`);
    if (o.status === 'completed') badState(`Operation ${o.op_no} is completed`);
    const preds = predecessorsOf(o, ops);
    for (const p of ops.filter((x) => preds.includes(x.op_no))) {
      if (p.status === 'completed') continue;
      if (o.overlap && p.status !== 'pending') continue;
      badState(o.overlap ? `Operation ${o.op_no} may overlap operation ${p.op_no}, but ${p.op_no} has not started` : `Operation ${p.op_no} must be completed before operation ${o.op_no} starts`);
    }
    stmts.push(db.prepare("UPDATE erp_mo_operations SET status = 'in_progress', started_at = COALESCE(started_at, ?), started_by = COALESCE(started_by, ?) WHERE company_id = ? AND id = ? AND status IN ('pending','paused')").bind(t, a.userId, a.companyId, o.id));
    if (input.timer && !o.outsourced) {
      const w = await db.prepare('SELECT labour_rate_cents FROM erp_work_centres WHERE company_id = ? AND id = ?').bind(a.companyId, o.work_centre_id).first<any>();
      stmts.push(db.prepare("INSERT INTO erp_mo_time (id, company_id, mo_id, operation_id, kind, user_id, started_at, rate_cents, created_by, created_at) VALUES (?, ?, ?, ?, 'labour', ?, ?, ?, ?, ?)").bind(newId(), a.companyId, mo.id, o.id, a.userId, t, w?.labour_rate_cents ?? 0, a.userId, t));
    }
    summary = `Operation ${o.op_no} ${o.name} ${o.status === 'paused' ? 'resumed' : 'started'}`;
  } else if (action === 'pause') {
    if (o.status !== 'in_progress') badState(`Operation ${o.op_no} is not in progress`);
    stmts.push(...(await stopTimers(db, a.companyId, o, t)), db.prepare("UPDATE erp_mo_operations SET status = 'paused' WHERE company_id = ? AND id = ? AND status = 'in_progress'").bind(a.companyId, o.id));
    summary = `Operation ${o.op_no} ${o.name} paused${input.note ? `: ${input.note}` : ''}`;
  } else {
    if (o.status === 'completed') badState(`Operation ${o.op_no} is already completed`);
    if (o.status === 'pending' && !o.outsourced) badState(`Start operation ${o.op_no} first`);
    if (o.inspection && !o.inspection_result) badState(`Operation ${o.op_no} is an inspection point: record a pass or fail first`);
    if (o.outsourced && input.actualOutsourceCents === undefined) throw new HttpError(400, 'Enter what the outsourced operation actually cost');
    // an outsourced operation comes back with what the supplier returned good: given, else what went out to it
    let good = Number(o.good_qty);
    if (o.outsourced) {
      const preds = predecessorsOf(o, ops);
      const predOps = ops.filter((x) => preds.includes(x.op_no));
      const open = predOps.filter((x) => x.status !== 'completed' && !(o.overlap && x.status !== 'pending'));
      if (open.length) badState(`Operation ${open[0].op_no} must be completed first`);
      const unitsIn = predOps.length ? Math.min(...predOps.map((x) => Number(x.good_qty))) : Number(mo.quantity);
      if (input.goodQty !== undefined && input.goodQty > unitsIn + 1e-9) throw new HttpError(400, `Only ${q6(unitsIn)} went out to the supplier`);
      if (good <= 1e-9) good = q6(input.goodQty ?? unitsIn);
    }
    stmts.push(
      ...(await stopTimers(db, a.companyId, o, t)),
      db
        .prepare("UPDATE erp_mo_operations SET status = 'completed', good_qty = ?, started_at = COALESCE(started_at, ?), completed_at = ?, completed_by = ?, actual_outsource_cents = COALESCE(?, actual_outsource_cents) WHERE company_id = ? AND id = ? AND status <> 'completed'")
        .bind(good, t, t, a.userId, o.outsourced ? input.actualOutsourceCents : null, a.companyId, o.id),
    );
    summary = `Operation ${o.op_no} ${o.name} completed: ${q6(good)} good${o.scrap_qty ? `, ${q6(o.scrap_qty)} scrapped` : ''}${o.outsourced ? `; outsourced cost ${dollars(input.actualOutsourceCents)}` : ''}`;
  }
  stmts.push(startedStmt(db, a.companyId, mo.id, t), eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `mo.operation_${action}`, entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `${mo.number}: ${summary}`, at: t }));
  try {
    const res = await db.batch(stmts);
    if (action === 'start' && !res[0].meta.changes) badState(`Operation ${o.op_no} changed at the same moment: reload`);
  } catch (e) {
    if (e instanceof HttpError) throw e;
    if (/UNIQUE constraint failed: erp_mo_time/i.test(String((e as Error)?.message ?? e))) badState('Your timer is already running on this operation');
    throw e;
  }
  return c.json({ ok: true });
});

productionRoutes.post('/c/:company/mos/:id/operations/:opId/report', async (c) => {
  const a = await requireErp(c, 'production.execute');
  const db = c.env.DB;
  const input = await body(c, z.object({ kind: z.enum(keys(REPORT_KINDS)), quantity: z.number().min(0).max(1e9).optional(), minutes: z.number().min(0).max(100000).optional(), reason: zText(500).optional(), requestKey: zKey }));
  if (input.requestKey) {
    const done = await db.prepare('SELECT id FROM erp_mo_reports WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string }>();
    if (done) return c.json({ id: done.id, replayed: true });
  }
  const mo = await openMo(db, a, c.req.param('id'));
  const { o, ops } = await loadOp(db, a.companyId, mo.id, c.req.param('opId'));
  if (o.status !== 'in_progress' && o.status !== 'paused') badState(o.status === 'completed' ? `Operation ${o.op_no} is completed` : `Start operation ${o.op_no} first`);
  const qn = input.quantity ?? 0;
  const mins = input.minutes ?? 0;
  if (input.kind === 'downtime') {
    if (!(mins > 0)) throw new HttpError(400, 'Give the minutes of downtime');
  } else if (!(qn > 0)) throw new HttpError(400, 'Give a quantity above zero');
  if ((input.kind === 'scrap' || input.kind === 'rework' || input.kind === 'downtime') && !input.reason?.trim()) throw new HttpError(400, `Say why (${label(REPORT_KINDS, input.kind).toLowerCase()})`);
  if (input.kind === 'good' || input.kind === 'scrap') {
    const preds = predecessorsOf(o, ops);
    const predOps = ops.filter((x) => preds.includes(x.op_no));
    if (predOps.length) {
      const unitsIn = Math.min(...predOps.map((p) => Number(p.good_qty)));
      if (o.good_qty + o.scrap_qty + qn > unitsIn + 1e-9) throw new HttpError(400, `Operation ${o.op_no} has received ${q6(unitsIn)} from the operations before it; ${q6(o.good_qty + o.scrap_qty)} are already reported`);
    }
    if (input.kind === 'good' && o.good_qty + qn > o.max_qty + 1e-9) throw new HttpError(400, `That is more than the order allows (${q6(o.max_qty)} including the over-completion tolerance)`);
  }
  const col = { good: 'good_qty', scrap: 'scrap_qty', rework: 'rework_qty', downtime: 'downtime_minutes' }[input.kind as 'good' | 'scrap' | 'rework' | 'downtime'];
  const id = newId();
  const t = now();
  const what = input.kind === 'downtime' ? `${mins} minutes of downtime (${input.reason})` : `${qn} ${label(REPORT_KINDS, input.kind).toLowerCase()}${input.reason ? ` (${input.reason})` : ''}`;
  try {
    await db.batch([
      db
        .prepare('INSERT INTO erp_mo_reports (id, company_id, mo_id, operation_id, kind, quantity, minutes, reason, machine_id, request_key, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(id, a.companyId, mo.id, o.id, input.kind, qn, mins, input.reason ?? '', o.machine_id, input.requestKey ?? null, a.userId, t),
      // the CHECK on good_qty keeps it within the order's maximum, also when two people report at once
      db.prepare(`UPDATE erp_mo_operations SET ${col} = round(${col} + ?, 6) WHERE company_id = ? AND id = ?`).bind(input.kind === 'downtime' ? mins : qn, a.companyId, o.id),
      startedStmt(db, a.companyId, mo.id, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `mo.reported_${input.kind}`, entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `${mo.number} operation ${o.op_no}: ${what}`, at: t }),
    ]);
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (input.requestKey && /erp_mo_reports\.request_key|erp_mo_reports_request|UNIQUE constraint failed: erp_mo_reports/i.test(msg)) {
      const done = await db.prepare('SELECT id FROM erp_mo_reports WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string }>();
      if (done) return c.json({ id: done.id, replayed: true });
    }
    if (/CHECK constraint failed/i.test(msg)) badState('That is more than the order allows, or someone reported at the same moment: reload');
    throw e;
  }
  return c.json({ id }, 201);
});

productionRoutes.post('/c/:company/mos/:id/operations/:opId/time', async (c) => {
  const a = await requireErp(c, 'production.execute');
  const db = c.env.DB;
  const mo = await openMo(db, a, c.req.param('id'));
  const { o } = await loadOp(db, a.companyId, mo.id, c.req.param('opId'));
  const input = await body(c, z.object({ kind: z.enum(keys(TIME_KINDS)).optional(), action: z.enum(['start', 'stop', 'enter']).optional(), minutes: z.number().positive().max(100000).optional(), userId: zId.optional(), rework: z.boolean().optional(), note: zText(500).optional() }));
  if (o.outsourced) badState('An outsourced operation has no labour or machine time here: enter its cost when it is completed');
  if (o.status !== 'in_progress' && o.status !== 'paused' && o.status !== 'completed') badState(`Start operation ${o.op_no} first`);
  const kind = input.kind ?? 'labour';
  const action = input.action ?? (input.minutes ? 'enter' : 'start');
  const person = input.userId ?? a.userId;
  if (person !== a.userId && !(await companyPeople(db, a)).some((p) => p.id === person)) throw new HttpError(400, 'Record time for people of this company only');
  const w = await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ? AND id = ?').bind(a.companyId, o.work_centre_id).first<any>();
  const machine = o.machine_id ? await db.prepare('SELECT machine_rate_cents FROM erp_machines WHERE company_id = ? AND id = ?').bind(a.companyId, o.machine_id).first<any>() : null;
  const rate = kind === 'labour' ? Number(w?.labour_rate_cents ?? 0) : Number(machine?.machine_rate_cents ?? w?.machine_rate_cents ?? 0);
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let summary: string;
  if (action === 'stop') {
    const stop = await stopTimers(db, a.companyId, o, t, person, kind);
    if (!stop.length) badState('No timer of yours is running on this operation');
    stmts.push(...stop);
    summary = `${label(TIME_KINDS, kind)} timer stopped on operation ${o.op_no}`;
  } else if (action === 'start') {
    if (o.status === 'completed') badState(`Operation ${o.op_no} is completed`);
    stmts.push(
      db
        .prepare('INSERT INTO erp_mo_time (id, company_id, mo_id, operation_id, kind, user_id, machine_id, started_at, rework, rate_cents, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), a.companyId, mo.id, o.id, kind, person, kind === 'machine' ? o.machine_id : null, t, input.rework ? 1 : 0, rate, input.note ?? '', a.userId, t),
    );
    summary = `${label(TIME_KINDS, kind)} timer started on operation ${o.op_no}${input.rework ? ' (rework)' : ''}`;
  } else {
    if (!input.minutes) throw new HttpError(400, 'Give the minutes');
    const { cost, overhead } = timeCost(kind, input.minutes, rate, w);
    stmts.push(
      db
        .prepare('INSERT INTO erp_mo_time (id, company_id, mo_id, operation_id, kind, user_id, machine_id, minutes, rework, rate_cents, cost_cents, overhead_cents, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), a.companyId, mo.id, o.id, kind, person, kind === 'machine' ? o.machine_id : null, input.minutes, input.rework ? 1 : 0, rate, cost, overhead, input.note ?? '', a.userId, t),
    );
    summary = `${input.minutes} minutes of ${label(TIME_KINDS, kind).toLowerCase()} time on operation ${o.op_no}${input.rework ? ' (rework)' : ''}`;
  }
  stmts.push(startedStmt(db, a.companyId, mo.id, t), eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `mo.time_${action}`, entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `${mo.number}: ${summary}`, at: t }));
  try {
    await db.batch(stmts);
  } catch (e) {
    if (/UNIQUE constraint failed: erp_mo_time|erp_mo_time_running/i.test(String((e as Error)?.message ?? e))) badState('That timer is already running');
    throw e;
  }
  return c.json({ ok: true }, 201);
});

productionRoutes.post('/c/:company/mos/:id/operations/:opId/inspection', async (c) => {
  const a = await requireErp(c, 'production.execute');
  const db = c.env.DB;
  const mo = await openMo(db, a, c.req.param('id'));
  const { o } = await loadOp(db, a.companyId, mo.id, c.req.param('opId'));
  const input = await body(c, z.object({ result: z.enum(['pass', 'fail']), comment: zText(1000).optional() }));
  if (!o.inspection) badState(`Operation ${o.op_no} is not an inspection point`);
  if (o.status === 'completed') badState(`Operation ${o.op_no} is completed`);
  if (o.status === 'pending') badState(`Start operation ${o.op_no} first`);
  if (input.result === 'fail' && !input.comment?.trim()) throw new HttpError(400, 'Say what failed');
  const t = now();
  await db.batch([
    db.prepare('UPDATE erp_mo_operations SET inspection_result = ?, inspection_comment = ?, inspection_by = ?, inspection_at = ? WHERE company_id = ? AND id = ?').bind(input.result, input.comment ?? '', a.userId, t, a.companyId, o.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.inspection', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `${mo.number} operation ${o.op_no} inspection: ${input.result === 'pass' ? 'pass' : 'fail'}${input.comment ? ` (${input.comment})` : ''}`, after: { result: input.result }, at: t }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ finished goods

productionRoutes.post('/c/:company/mos/:id/receive', async (c) => {
  const a = await requireErp(c, 'production.receive');
  const db = c.env.DB;
  const input = await body(c, z.object({ requestKey: zKey, quantity: zQ, locationId: zId.optional(), lot: zText(80).optional(), serials: z.array(zText(80)).max(1000).optional(), expiry: zDate.optional() }));
  if (input.requestKey) {
    const done = await db.prepare('SELECT id, number, value_cents FROM erp_mo_receipts WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<any>();
    if (done) return c.json({ id: done.id, number: done.number, valueCents: done.value_cents, replayed: true });
  }
  const mo = await openMo(db, a, c.req.param('id'));
  const ops = await moOps(db, a.companyId, mo.id);
  // finished goods come off the last operations: no more than they passed as good
  const finals = ops.filter((o) => !ops.some((x) => predecessorsOf(x, ops).includes(o.op_no)));
  if (finals.length) {
    const ready = Math.min(...finals.map((o) => Number(o.good_qty)));
    if (mo.completed_qty + input.quantity > ready + 1e-9) throw new HttpError(400, `Operation ${finals.map((o) => o.op_no).join(', ')} reported ${q6(ready)} good; ${q6(mo.completed_qty)} is already received`);
  }
  if (mo.completed_qty + input.quantity > mo.max_qty + 1e-9) throw new HttpError(400, `That is more than ${mo.number} may complete: ${q6(mo.max_qty)} including the over-completion tolerance, ${q6(mo.completed_qty)} already received`);
  const settings = await loadMfgSettings(db, a.companyId);
  const p = await loadStockProduct(db, a.companyId, mo.product_id);
  const locationId = input.locationId ?? mo.fg_location_id ?? settings.fgLocationId ?? p.default_location_id;
  if (!locationId) throw new HttpError(400, 'Choose where the finished goods go');
  const loc = await loadLocation(db, a.companyId, locationId);
  if (loc.kind === 'quarantine') throw new HttpError(400, 'Finished goods cannot go straight into quarantine');
  const lot = p.track_lots ? (input.lot ?? '').trim() : '';
  const serials = p.track_serials ? [...new Set((input.serials ?? []).map((s) => s.trim()).filter(Boolean))] : [];
  if (p.track_serials) {
    if (!Number.isInteger(input.quantity)) throw new HttpError(400, 'Serial-numbered goods are received in whole units');
    if (serials.length !== input.quantity) throw new HttpError(400, `Give ${input.quantity} different serial number${input.quantity === 1 ? '' : 's'}, one for each unit`);
  }
  await stockKey(db, a.companyId, { productId: p.id, locationId: loc.id, lot, serial: serials[0] }, { incoming: true, expiry: input.expiry ?? null });
  // valued at actual cost: the order's cost not yet taken into stock, spread over the units still expected
  const actual = await actualCosts(db, a.companyId, mo.id);
  const unabsorbed = Math.max(0, actual.total - mo.received_value_cents);
  const remaining = Math.max(q6(mo.quantity - mo.completed_qty), input.quantity);
  const unitCost = unabsorbed / remaining;
  const ops2 = new StockOps(db, a, await loadSettings(db, a.companyId));
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'fg_receipt');
  let value = 0;
  if (serials.length) for (const s of serials) value += (await ops2.addIn('production_receipt', { productId: p.id, locationId: loc.id, lot, serial: s }, 1, { source: 'manufacturing_order', sourceId: mo.id, reference: `${mo.number} / ${number}`, unitCost, expiry: input.expiry ?? null })).value;
  else value = (await ops2.addIn('production_receipt', { productId: p.id, locationId: loc.id, lot, serial: '' } as StockKey, input.quantity, { source: 'manufacturing_order', sourceId: mo.id, reference: `${mo.number} / ${number}`, unitCost, expiry: input.expiry ?? null })).value;
  const t = ops2.t;
  // the quantity turns negative (refused by its CHECK, and the whole transaction with it) if the order was completed,
  // closed or cancelled at the same moment
  const head = db
    .prepare(
      `INSERT INTO erp_mo_receipts (id, company_id, number, mo_id, product_id, location_id, quantity, lot, serials_json, expiry, unit_cost_cents, value_cents, request_key, group_id, created_by, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, CASE WHEN EXISTS (SELECT 1 FROM erp_mfg_orders WHERE company_id = ?2 AND id = ?4 AND status IN ('released','in_progress')) THEN ?7 ELSE -1 END, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)`,
    )
    .bind(id, a.companyId, number, mo.id, p.id, loc.id, input.quantity, lot, JSON.stringify(serials), input.expiry ?? null, unitCost, value, input.requestKey ?? null, ops2.groupId, a.userId, t);
  const after = [
    // the CHECK on completed_qty refuses completing beyond the tolerance, also when two people receive at once
    db.prepare("UPDATE erp_mfg_orders SET completed_qty = round(completed_qty + ?, 6), received_value_cents = received_value_cents + ?, status = 'in_progress', started_at = COALESCE(started_at, ?), updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('released','in_progress')").bind(input.quantity, value, t, t, a.companyId, mo.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.received', entityType: 'manufacturing_order', entityId: mo.id, productId: mo.product_id, summary: `${number}: ${input.quantity} ${p.uom} of ${p.number} from ${mo.number} into ${loc.warehouse_code}/${loc.code}, valued at ${dollars(value)}`, after: { quantity: input.quantity, valueCents: value, unitCostCents: unitCost }, at: t }),
  ];
  try {
    await db.batch(ops2.all([head], after, { type: 'manufacturing_order', id: mo.id, kind: 'finance.production_posting' }));
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (input.requestKey && /erp_mo_receipts\.request_key|erp_mo_receipts_request|UNIQUE constraint failed: erp_mo_receipts\.company_id, erp_mo_receipts\.request_key/i.test(msg)) {
      const done = await db.prepare('SELECT id, number, value_cents FROM erp_mo_receipts WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<any>();
      if (done) return c.json({ id: done.id, number: done.number, valueCents: done.value_cents, replayed: true });
    }
    if (/completed_qty <= max_qty/i.test(msg)) badState(`That is more than ${mo.number} may complete, or someone received at the same moment: reload`);
    if (/quantity > 0/i.test(msg)) badState(`${mo.number} changed at the same moment and cannot receive goods now: reload`);
    stockError(e);
  }
  return c.json({ id, number, valueCents: value, unitCostCents: unitCost }, 201);
});

// ------------------------------------------------------------------ the shop floor

/**
 * The shop floor (for a phone or a terminal at the machine): per work centre its status and machines (down when their
 * Maintenance asset has an open breakdown work order), the jobs in progress and the jobs ready to start (predecessors
 * done), progress, planned against actual output, material shortages and outstanding inspections.
 */
productionRoutes.get('/c/:company/shop-floor', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const wcFilter = c.req.query('workCentreId');
  const centres = (await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ? AND archived_at IS NULL ORDER BY code COLLATE NOCASE').bind(a.companyId).all<any>()).results.filter((w) => !wcFilter || w.id === wcFilter);
  const machines = (await db.prepare('SELECT * FROM erp_machines WHERE company_id = ? AND archived_at IS NULL ORDER BY code COLLATE NOCASE').bind(a.companyId).all<any>()).results;
  const states = await assetStates(db, a.companyId, machines.map((m) => m.asset_id));
  const ops = (
    await db
      .prepare(
        `SELECT o.*, mo.number AS mo_number, mo.status AS mo_status, mo.quantity AS mo_quantity, mo.required_date, mo.priority, p.number AS product_number, p.name AS product_name, p.uom, m.code AS machine_code,
                (SELECT COUNT(*) FROM erp_mo_time t WHERE t.company_id = o.company_id AND t.operation_id = o.id AND t.minutes IS NULL AND t.user_id = ?) AS my_timers
           FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id
           LEFT JOIN erp_machines m ON m.company_id = o.company_id AND m.id = o.machine_id
          WHERE o.company_id = ? AND mo.status IN ('released','in_progress') ORDER BY CASE mo.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, COALESCE(o.planned_start, '9999'), mo.number, o.op_no`,
      )
      .bind(a.userId, a.companyId)
      .all<any>()
  ).results;
  const byMo = new Map<string, any[]>();
  for (const o of ops) byMo.set(o.mo_id, [...(byMo.get(o.mo_id) ?? []), o]);
  // shortages of the open orders' materials (what is still to issue, less reserved, against what is available)
  const mats = (
    await db
      .prepare(
        `SELECT m.mo_id, m.product_id, m.required_qty, m.issued_qty, p.number, p.name, mo.number AS mo_number,
                (SELECT COALESCE(SUM(r.quantity - r.issued_qty - r.released_qty), 0) FROM erp_mo_reservations mr JOIN erp_reservations r ON r.company_id = mr.company_id AND r.id = mr.reservation_id WHERE mr.company_id = m.company_id AND mr.material_id = m.id AND r.status = 'open') AS reserved_open
           FROM erp_mo_materials m JOIN erp_mfg_orders mo ON mo.company_id = m.company_id AND mo.id = m.mo_id JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id
          WHERE m.company_id = ? AND mo.status IN ('released','in_progress') AND m.required_qty - m.issued_qty > 1e-9`,
      )
      .bind(a.companyId)
      .all<any>()
  ).results;
  const stock = await availableByProduct(db, a.companyId, mats.map((m) => m.product_id));
  const shortByMo = new Map<string, { product: string; name: string; short: number }[]>();
  const left = new Map([...stock.entries()].map(([k, v]) => [k, v.available]));
  for (const m of mats) {
    const need = Math.max(0, q6(m.required_qty - m.issued_qty - Number(m.reserved_open)));
    const have = left.get(m.product_id) ?? 0;
    const short = Math.max(0, q6(need - have));
    left.set(m.product_id, Math.max(0, q6(have - need)));
    if (short > 0) shortByMo.set(m.mo_id, [...(shortByMo.get(m.mo_id) ?? []), { product: m.number, name: m.name, short }]);
  }
  const today = todayIso();
  const weekEnd = addDays(today, 7 - ((new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7) - 1);
  const goodToday = new Map(
    (await db.prepare("SELECT o.work_centre_id, SUM(r.quantity) AS q FROM erp_mo_reports r JOIN erp_mo_operations o ON o.company_id = r.company_id AND o.id = r.operation_id WHERE r.company_id = ? AND r.kind = 'good' AND r.created_at >= ? GROUP BY o.work_centre_id").bind(a.companyId, Date.parse(`${today}T00:00:00Z`)).all<any>()).results.map((r) => [r.work_centre_id, q6(r.q)]),
  );
  const job = (o: any) => {
    const sibs = byMo.get(o.mo_id) ?? [];
    const preds = sibs.filter((x) => predecessorsOf(o, sibs).includes(x.op_no));
    const ready = preds.every((p) => p.status === 'completed' || (o.overlap && p.status !== 'pending'));
    const mach = o.machine_id ? machines.find((m) => m.id === o.machine_id) : null;
    const st = mach?.asset_id ? states.get(mach.asset_id) : null;
    return {
      moId: o.mo_id,
      moNumber: o.mo_number,
      productNumber: o.product_number,
      productName: o.product_name,
      uom: o.uom,
      priority: o.priority,
      priorityLabel: label(PRIORITIES, o.priority),
      requiredDate: o.required_date,
      operationId: o.id,
      opNo: o.op_no,
      name: o.name,
      status: o.status,
      statusLabel: label(OP_STATUS, o.status),
      machineCode: o.machine_code ?? null,
      machineDown: !!st?.down,
      planned: q6(o.mo_quantity),
      goodQty: q6(o.good_qty),
      scrapQty: q6(o.scrap_qty),
      progressPct: o.mo_quantity > 0 ? Math.min(100, Math.round((o.good_qty / o.mo_quantity) * 100)) : 0,
      plannedStart: o.planned_start,
      plannedFinish: o.planned_finish,
      inspection: !!o.inspection,
      inspectionResult: o.inspection_result,
      myTimerRunning: Number(o.my_timers) > 0,
      ready,
      late: !!o.planned_finish && o.planned_finish < today,
      shortages: shortByMo.get(o.mo_id) ?? [],
    };
  };
  const result = centres.map((w) => {
    const mine = ops.filter((o) => o.work_centre_id === w.id && o.status !== 'completed');
    const current = mine.filter((o) => o.status === 'in_progress' || o.status === 'paused').map(job);
    const available = mine.filter((o) => o.status === 'pending').map(job).filter((j) => j.ready);
    const wMachines = machines.filter((m) => m.work_centre_id === w.id).map((m) => {
      const st = m.asset_id ? states.get(m.asset_id) : null;
      return { id: m.id, code: m.code, name: m.name, status: m.status, down: !!st?.down, breakdown: st?.workOrder ?? null };
    });
    const plannedWeek = ops.filter((o) => o.work_centre_id === w.id && o.planned_finish && o.planned_finish <= weekEnd).reduce((s, o) => s + Number(o.mo_quantity), 0);
    const actualWeek = ops.filter((o) => o.work_centre_id === w.id && o.planned_finish && o.planned_finish <= weekEnd).reduce((s, o) => s + Number(o.good_qty), 0);
    return {
      id: w.id,
      code: w.code,
      name: w.name,
      status: w.status,
      statusLabel: label({ active: 'Active', on_hold: 'On hold', inactive: 'Inactive' }, w.status),
      down: wMachines.length > 0 && wMachines.filter((m) => m.status === 'active').every((m) => m.down),
      machines: wMachines,
      current,
      available,
      inspections: mine.filter((o) => o.inspection && !o.inspection_result && o.status !== 'pending').map(job),
      goodToday: goodToday.get(w.id) ?? 0,
      plannedThisWeek: q6(plannedWeek),
      actualThisWeek: q6(actualWeek),
    };
  });
  const outsourced = ops.filter((o) => o.outsourced && o.status !== 'completed').map(job);
  return c.json({
    today,
    workCentres: result,
    outsourced,
    shortages: [...shortByMo.entries()].map(([moId, list]) => ({ moId, moNumber: ops.find((o) => o.mo_id === moId)?.mo_number ?? mats.find((m) => m.mo_id === moId)?.mo_number, items: list })),
    can: { execute: can(a, 'production.execute'), issue: can(a, 'production.issue'), receive: can(a, 'production.receive') },
    note: 'Inspection points record a pass or fail with a note. Full Quality is Release 4.',
  });
});
