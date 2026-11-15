// BIZOMAT ERP, Release 3: planning (/api/erp/c/:company/...). Who may do what: access.ts (manufacturing.view,
// production.plan, mrp.run, mrp.buy).
//
//   mps                  the master production schedule: forecast or confirmed demand for a product, a quantity, a due
//                        date and a reference (Release 5: confirmed sales orders are demand of their own, next to it)
//   mrp/runs             MRP, deterministic: each run is stored with its inputs, a line per product and its suggestions
//   mrp/suggestions/:id  buy (to a requisition, through procurement.ts), make (to a draft manufacturing order, through
//                        production.ts), expedite (an open order due after it is needed); or dismissed
//   capacity             rough-cut capacity: load per work centre per week against its available hours
//
// How MRP plans (docs/erp/release-3.md, "MRP"): products are planned level by level down the released bills of
// materials (low-level codes). For each product, from its available stock (on hand outside quarantine, less
// reservations) and in date order: receipts expected (open purchase orders at their line's or order's required date;
// open manufacturing orders' remaining output at their required date, else their planned finish) come in; requirements (confirmed demand in the
// schedule, forecasts if asked, confirmed sales orders' open lines (Release 5), open manufacturing orders' materials not yet issued or reserved, and the materials of
// the orders MRP plans for the products above) go out. When stock would fall below the safety stock, a later receipt is
// pulled in first (expedite); otherwise an order is planned for the shortfall, sized by the minimum order and the
// multiple, due on the date of the requirement and started its lead time before (purchase: the product supplier's,
// else the product's; make: the routing's, else the product's, else worked out from the routing). A product with a
// reorder point that ends the horizon at or below it gets one more order, up to its maximum (else one unit above the
// reorder point). Messages: late (should already have been ordered or started), overdue (needed before today), expedite.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { assertCan, can, requireErp } from './access';
import { badState, csvResponse, eventStmt, likeOf, nextNumber, wantsCsv, zDate, zId, zText } from './util';
import { availableByProduct, currentUnitCost, q6 } from './stock';
import { loadProduct } from './products';
import { createRequisition } from './procurement';
import { createMo, mfgLeadDays } from './production';
import { DEMAND_KINDS, SOURCES, SUGGESTION_KINDS, addDays, isKey, label, loadMfgSettings, opHours, routingOps, todayIso, weekHours, weekStart, workCentreDTO } from './manufacturing';

export const planningRoutes = new Hono<AppEnv>();

// ------------------------------------------------------------------ the master production schedule

const mpsDTO = (e: any) => ({
  id: e.id,
  productId: e.product_id,
  productNumber: e.product_number,
  productName: e.product_name,
  uom: e.uom,
  quantity: q6(e.quantity),
  dueDate: e.due_date,
  kind: e.kind,
  kindLabel: label(DEMAND_KINDS, e.kind),
  reference: e.reference,
  notes: e.notes,
  status: e.status,
  statusLabel: label({ open: 'Open', closed: 'Closed', cancelled: 'Cancelled' }, e.status),
  createdByName: e.by_name ?? null,
  createdAt: e.created_at,
  updatedAt: e.updated_at,
});

const MPS_SELECT = `SELECT e.*, p.number AS product_number, p.name AS product_name, p.uom, u.name AS by_name FROM erp_mps_entries e
  JOIN erp_products p ON p.company_id = e.company_id AND p.id = e.product_id LEFT JOIN users u ON u.id = e.created_by`;

planningRoutes.get('/c/:company/mps', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const where = ['e.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const qp = (k: string) => c.req.query(k)?.trim();
  const status = qp('status') ?? 'open';
  if (status !== 'all') {
    where.push('e.status = ?');
    args.push(status);
  }
  if (qp('kind') && isKey(DEMAND_KINDS, qp('kind'))) {
    where.push('e.kind = ?');
    args.push(qp('kind'));
  }
  if (qp('productId')) {
    where.push('e.product_id = ?');
    args.push(qp('productId'));
  }
  if (qp('from')) {
    where.push('e.due_date >= ?');
    args.push(qp('from'));
  }
  if (qp('to')) {
    where.push('e.due_date <= ?');
    args.push(qp('to'));
  }
  if (qp('q')) {
    where.push('(p.number LIKE ? OR lower(p.name) LIKE ? OR lower(e.reference) LIKE ?)');
    const l = likeOf(qp('q')!);
    args.push(l, l, l);
  }
  const rows = await db.prepare(`${MPS_SELECT} WHERE ${where.join(' AND ')} ORDER BY e.due_date, p.number LIMIT 2000`).bind(...args).all<any>();
  const list = rows.results.map(mpsDTO);
  if (wantsCsv(c)) return csvResponse('master-production-schedule', [['Product', 'Name', 'Quantity', 'Unit', 'Due', 'Kind', 'Reference', 'Status'], ...list.map((e) => [e.productNumber, e.productName, e.quantity, e.uom, e.dueDate, e.kindLabel, e.reference, e.statusLabel])]);
  return c.json({ entries: list, kinds: Object.entries(DEMAND_KINDS).map(([value, l]) => ({ value, label: l })), note: 'Confirmed sales orders are demand in MRP of their own. Enter here only demand that is not on a sales order (forecasts, or confirmed demand agreed another way), so nothing is counted twice.', can: { edit: can(a, 'production.plan') } });
});

const zMps = z.object({ productId: zId, quantity: z.number().positive().max(1e9), dueDate: zDate.refine((v) => !!v, 'Give the due date'), kind: z.enum(Object.keys(DEMAND_KINDS) as [string, ...string[]]), reference: zText(200).optional(), notes: zText(2000).optional() });

planningRoutes.post('/c/:company/mps', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const input = await body(c, zMps);
  const p = await loadProduct(db, a.companyId, input.productId);
  if (p.archived_at) throw new HttpError(409, `${p.number} is archived`);
  if (p.type === 'service') throw new HttpError(400, `${p.number} is a service: services are not planned`);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO erp_mps_entries (id, company_id, product_id, quantity, due_date, kind, reference, notes, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, p.id, input.quantity, input.dueDate, input.kind, input.reference ?? '', input.notes ?? '', a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mps.created', entityType: 'mps', entityId: id, productId: p.id, summary: `${label(DEMAND_KINDS, input.kind)} demand: ${input.quantity} ${p.uom} of ${p.number} due ${input.dueDate}${input.reference ? ` (${input.reference})` : ''}`, at: t }),
  ]);
  return c.json(mpsDTO(await db.prepare(`${MPS_SELECT} WHERE e.company_id = ? AND e.id = ?`).bind(a.companyId, id).first<any>()), 201);
});

planningRoutes.patch('/c/:company/mps/:id', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const e = await db.prepare(`${MPS_SELECT} WHERE e.company_id = ? AND e.id = ?`).bind(a.companyId, c.req.param('id')).first<any>();
  if (!e) throw notFound('Schedule entry');
  const input = await body(c, zMps.omit({ productId: true }).partial().extend({ status: z.enum(['open', 'closed', 'cancelled']).optional() }));
  const next = { quantity: input.quantity ?? e.quantity, due_date: input.dueDate ?? e.due_date, kind: input.kind ?? e.kind, reference: input.reference ?? e.reference, notes: input.notes ?? e.notes, status: input.status ?? e.status };
  const t = now();
  await db.batch([
    db.prepare('UPDATE erp_mps_entries SET quantity = ?, due_date = ?, kind = ?, reference = ?, notes = ?, status = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(next.quantity, next.due_date, next.kind, next.reference, next.notes, next.status, t, a.companyId, e.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mps.changed', entityType: 'mps', entityId: e.id, productId: e.product_id, summary: `Schedule entry for ${e.product_number} due ${next.due_date} changed`, before: { quantity: e.quantity, dueDate: e.due_date, kind: e.kind, status: e.status }, after: { quantity: next.quantity, dueDate: next.due_date, kind: next.kind, status: next.status }, at: t }),
  ]);
  return c.json(mpsDTO(await db.prepare(`${MPS_SELECT} WHERE e.company_id = ? AND e.id = ?`).bind(a.companyId, e.id).first<any>()));
});

// ------------------------------------------------------------------ MRP

interface Event {
  date: string;
  qty: number;
  kind: 'receipt' | 'requirement';
  ref: string;
  /** a receipt from an open order: its type, id and number (for an expedite message) */
  supply?: { type: 'purchase_order' | 'manufacturing_order'; id: string; number: string; date: string };
}

interface ProductInfo {
  id: string;
  number: string;
  name: string;
  type: string;
  uom: string;
  source: 'make' | 'buy';
  bomRevisionId: string | null;
  routing: any | null;
  planning: any;
  safety: number;
  reorderPoint: number | null;
  maxQty: number | null;
  minOrder: number | null;
  multiple: number | null;
  supplierId: string | null;
  supplierLead: number | null;
  supplierPrice: number | null;
}

interface Suggestion {
  productId: string;
  kind: 'buy' | 'make' | 'expedite';
  quantity: number;
  needDate: string;
  orderDate: string | null;
  leadTimeDays: number;
  supplierId: string | null;
  refType: string;
  refId: string | null;
  refNumber: string;
  messages: string[];
  reason: string;
}

/** Sizes a planned order: at least the minimum order quantity, rounded up to the multiple. */
export function lotSize(net: number, minOrder: number | null, multiple: number | null) {
  let q = net;
  if (minOrder && q < minOrder) q = minOrder;
  if (multiple) q = Math.ceil(q / multiple - 1e-9) * multiple;
  return q6(q);
}

/** Runs MRP for a company and stores the run with its inputs, lines and suggestions. */
export async function runMrp(db: D1Database, a: { companyId: string; userId: string }, opts: { horizonDays?: number; includeForecast?: boolean }) {
  const settings = await loadMfgSettings(db, a.companyId);
  const today = todayIso();
  const horizon = opts.horizonDays ?? settings.mrpHorizonDays;
  const end = addDays(today, horizon);
  const includeForecast = !!opts.includeForecast;

  // ---- inputs
  const demand = (
    await db
      .prepare(`SELECT e.id, e.product_id, e.quantity, e.due_date, e.kind, e.reference, p.number FROM erp_mps_entries e JOIN erp_products p ON p.company_id = e.company_id AND p.id = e.product_id WHERE e.company_id = ? AND e.status = 'open' AND e.due_date <= ? ${includeForecast ? '' : "AND e.kind = 'confirmed'"} ORDER BY e.due_date`)
      .bind(a.companyId, end)
      .all<any>()
  ).results;
  // Release 5: confirmed sales orders: what each open line still needs (ordered less shipped less allocated: allocated
  // stock is reserved, so it is already out of the available stock), due on the line's promised date, else the order's
  // promised, requested or order date.
  const salesDemand = (
    await db
      .prepare(
        `SELECT l.product_id, round(l.quantity - l.shipped_qty - l.allocated_qty, 6) AS qty, COALESCE(l.promised_date, o.promised_date, o.requested_date, o.order_date) AS due, o.number, o.customer_name, l.position, p.number AS product_number
           FROM erp_so_lines l JOIN erp_sales_orders o ON o.company_id = l.company_id AND o.id = l.so_id JOIN erp_products p ON p.company_id = l.company_id AND p.id = l.product_id
          WHERE l.company_id = ? AND o.status IN ('confirmed','partially_allocated','allocated','partially_shipped') AND l.quantity - l.shipped_qty - l.allocated_qty > 1e-9
            AND COALESCE(l.promised_date, o.promised_date, o.requested_date, o.order_date) <= ? ORDER BY due`,
      )
      .bind(a.companyId, end)
      .all<any>()
  ).results;
  const pos = (
    await db
      .prepare(
        `SELECT o.id, o.number, o.order_date, o.required_date AS po_required, o.supplier_id, l.product_id, l.quantity - l.received_qty AS qty, l.required_date FROM erp_po_lines l JOIN erp_purchase_orders o ON o.company_id = l.company_id AND o.id = l.po_id
          WHERE l.company_id = ? AND l.product_id IS NOT NULL AND o.status IN ('approved','sent','partially_received') AND l.received_qty < l.quantity - 1e-9`,
      )
      .bind(a.companyId)
      .all<any>()
  ).results;
  const mos = (await db.prepare("SELECT id, number, product_id, quantity, completed_qty, start_date, required_date, finish_date, status FROM erp_mfg_orders WHERE company_id = ? AND status IN ('draft','released','in_progress')").bind(a.companyId).all<any>()).results;
  const moNeeds = (
    await db
      .prepare(
        `SELECT m.mo_id, m.product_id, m.required_qty, m.issued_qty, mo.number, mo.start_date,
                (SELECT COALESCE(SUM(r.quantity - r.issued_qty - r.released_qty), 0) FROM erp_mo_reservations mr JOIN erp_reservations r ON r.company_id = mr.company_id AND r.id = mr.reservation_id WHERE mr.company_id = m.company_id AND mr.material_id = m.id AND r.status = 'open') AS reserved_open
           FROM erp_mo_materials m JOIN erp_mfg_orders mo ON mo.company_id = m.company_id AND mo.id = m.mo_id WHERE m.company_id = ? AND mo.status IN ('draft','released','in_progress')`,
      )
      .bind(a.companyId)
      .all<any>()
  ).results;
  const stockSettings = (await db.prepare('SELECT product_id, reorder_point, max_qty FROM erp_product_stock WHERE company_id = ?').bind(a.companyId).all<any>()).results;
  const planningRows = (await db.prepare('SELECT * FROM erp_product_planning WHERE company_id = ?').bind(a.companyId).all<any>()).results;
  const products = new Map((await db.prepare('SELECT id, number, name, type, uom FROM erp_products WHERE company_id = ? AND archived_at IS NULL').bind(a.companyId).all<any>()).results.map((p) => [p.id, p]));
  const releasedBoms = new Map((await db.prepare("SELECT r.id, r.product_id FROM erp_revisions r WHERE r.company_id = ? AND r.status = 'released' AND EXISTS (SELECT 1 FROM erp_bom_lines l WHERE l.company_id = r.company_id AND l.revision_id = r.id)").bind(a.companyId).all<any>()).results.map((r) => [r.product_id, r.id]));
  const bomLines = (
    await db
      .prepare(`SELECT l.revision_id, l.component_id, l.quantity, l.scrap_pct, l.optional, l.alt_group, l.effective_from, l.effective_to, c.type FROM erp_bom_lines l JOIN erp_revisions r ON r.company_id = l.company_id AND r.id = l.revision_id AND r.status = 'released' JOIN erp_products c ON c.company_id = l.company_id AND c.id = l.component_id WHERE l.company_id = ? ORDER BY l.position, l.created_at, l.rowid`)
      .bind(a.companyId)
      .all<any>()
  ).results;
  const routings = new Map((await db.prepare("SELECT * FROM erp_routings WHERE company_id = ? AND status = 'released'").bind(a.companyId).all<any>()).results.map((r) => [r.product_id, r]));
  const suppliers = (await db.prepare('SELECT ps.product_id, ps.supplier_id, ps.lead_time_days, ps.price_cents, ps.moq, ps.preferred FROM erp_product_suppliers ps JOIN erp_suppliers s ON s.company_id = ps.company_id AND s.id = ps.supplier_id WHERE ps.company_id = ? AND s.archived_at IS NULL').bind(a.companyId).all<any>()).results;
  const centres = new Map((await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ?').bind(a.companyId).all<any>()).results.map((w) => [w.id, w]));

  /** The lines a planned order of a product uses: no optional lines, the first of each alternative group, no services. */
  const linesOf = (revId: string, asOf: string) => {
    const groups = new Set<string>();
    return bomLines.filter((l) => {
      if (l.revision_id !== revId || l.optional || l.type === 'service') return false;
      if ((l.effective_from && l.effective_from > asOf) || (l.effective_to && l.effective_to < asOf)) return false;
      if (l.alt_group) {
        if (groups.has(l.alt_group)) return false;
        groups.add(l.alt_group);
      }
      return true;
    });
  };

  // ---- the products to plan and their levels
  const relevant = new Set<string>();
  for (const d of demand) relevant.add(d.product_id);
  for (const d of salesDemand) relevant.add(d.product_id);
  for (const p of pos) relevant.add(p.product_id);
  for (const m of mos) relevant.add(m.product_id);
  for (const m of moNeeds) relevant.add(m.product_id);
  for (const s of stockSettings) if (s.reorder_point !== null) relevant.add(s.product_id);
  for (const p of planningRows) if (p.safety_stock > 0) relevant.add(p.product_id);
  const level = new Map<string, number>();
  for (const id of relevant) level.set(id, 0);
  // low-level codes: a component is planned after every product that uses it (loops are refused by Release 1)
  for (let pass = 0; pass < 30; pass++) {
    let moved = false;
    for (const [id, lv] of [...level.entries()]) {
      const rev = releasedBoms.get(id);
      if (!rev) continue;
      for (const l of bomLines.filter((x) => x.revision_id === rev && !x.optional && x.type !== 'service')) {
        if ((level.get(l.component_id) ?? -1) < lv + 1) {
          level.set(l.component_id, lv + 1);
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  for (const id of [...level.keys()]) if (!products.has(id) || products.get(id).type === 'service') level.delete(id);

  const info = new Map<string, ProductInfo>();
  for (const id of level.keys()) {
    const p = products.get(id);
    const plan = planningRows.find((x) => x.product_id === id) ?? null;
    const st = stockSettings.find((x) => x.product_id === id) ?? null;
    const sups = suppliers.filter((s) => s.product_id === id);
    const pref = sups.find((s) => s.preferred && s.lead_time_days !== null) ?? sups.filter((s) => s.lead_time_days !== null).sort((x, y) => x.lead_time_days - y.lead_time_days)[0] ?? sups.find((s) => s.preferred) ?? sups[0] ?? null;
    const routing = routings.get(id) ?? null;
    const bom = releasedBoms.get(id) ?? null;
    const source: 'make' | 'buy' = plan?.source === 'make' || plan?.source === 'buy' ? plan.source : bom && routing ? 'make' : 'buy';
    info.set(id, {
      id,
      number: p.number,
      name: p.name,
      type: p.type,
      uom: p.uom,
      source,
      bomRevisionId: bom,
      routing,
      planning: plan,
      safety: Number(plan?.safety_stock ?? 0),
      reorderPoint: st?.reorder_point ?? null,
      maxQty: st?.max_qty ?? null,
      minOrder: plan?.min_order_qty ?? (source === 'buy' ? pref?.moq ?? null : null),
      multiple: plan?.order_multiple ?? null,
      supplierId: pref?.supplier_id ?? null,
      supplierLead: pref?.lead_time_days ?? null,
      supplierPrice: pref?.price_cents ?? null,
    });
  }
  const opsCache = new Map<string, any[]>();
  const opsOf = async (routingId: string) => {
    if (!opsCache.has(routingId)) opsCache.set(routingId, await routingOps(db, a.companyId, routingId));
    return opsCache.get(routingId)!;
  };
  const leadOf = async (p: ProductInfo, qty: number) => {
    if (p.source === 'buy') return Number(p.supplierLead ?? p.planning?.purchase_lead_days ?? 0);
    return mfgLeadDays(p.routing, p.planning, p.routing ? await opsOf(p.routing.id) : [], qty, centres);
  };

  // ---- events per product
  const events = new Map<string, Event[]>();
  const add = (id: string, e: Event) => {
    if (!level.has(id)) return;
    events.set(id, [...(events.get(id) ?? []), e]);
  };
  for (const d of demand) add(d.product_id, { date: d.due_date, qty: Number(d.quantity), kind: 'requirement', ref: `${label(DEMAND_KINDS, d.kind)} demand${d.reference ? ` ${d.reference}` : ''} due ${d.due_date}` });
  for (const d of salesDemand) add(d.product_id, { date: d.due, qty: Number(d.qty), kind: 'requirement', ref: `Sales order ${d.number} line ${d.position} (${d.customer_name}) due ${d.due}` });
  for (const m of moNeeds) {
    const need = Math.max(0, q6(m.required_qty - m.issued_qty - Number(m.reserved_open)));
    if (need > 0) add(m.product_id, { date: m.start_date ?? today, qty: need, kind: 'requirement', ref: `Materials for ${m.number}` });
  }
  for (const p of pos) {
    const date = p.required_date ?? p.po_required ?? p.order_date ?? today;
    add(p.product_id, { date, qty: q6(p.qty), kind: 'receipt', ref: `Purchase order ${p.number}`, supply: { type: 'purchase_order', id: p.id, number: p.number, date } });
  }
  for (const m of mos) {
    const out = Math.max(0, q6(m.quantity - m.completed_qty));
    const date = m.required_date ?? m.finish_date ?? today;
    if (out > 0) add(m.product_id, { date, qty: out, kind: 'receipt', ref: `Manufacturing order ${m.number}`, supply: { type: 'manufacturing_order', id: m.id, number: m.number, date } });
  }

  const stock = await availableByProduct(db, a.companyId, [...level.keys()]);
  const suggestions: Suggestion[] = [];
  const lines: any[] = [];
  const order = [...level.entries()].sort((x, y) => x[1] - y[1] || (info.get(x[0])!.number < info.get(y[0])!.number ? -1 : 1));
  const clamp = (d: string) => (d < today ? today : d);

  for (const [id, lv] of order) {
    const p = info.get(id)!;
    const st = stock.get(id) ?? { onHand: 0, reserved: 0, available: 0, quarantine: 0 };
    const evs = (events.get(id) ?? []).slice().sort((x, y) => (clamp(x.date) < clamp(y.date) ? -1 : clamp(x.date) > clamp(y.date) ? 1 : x.kind === y.kind ? (x.date < y.date ? -1 : 1) : x.kind === 'receipt' ? -1 : 1));
    const receipts = evs.filter((e) => e.kind === 'receipt');
    const reqs = evs.filter((e) => e.kind === 'requirement');
    const used = new Set<Event>();
    const detail: { date: string; what: string; qty: number; projected: number }[] = [];
    let projected = st.available;
    let planned = 0;
    const gross = reqs.reduce((s, e) => s + e.qty, 0);
    const scheduled = receipts.reduce((s, e) => s + e.qty, 0);
    const planOrder = async (net: number, need: string, reason: string) => {
      const qty = lotSize(net, p.minOrder, p.multiple);
      const lead = await leadOf(p, qty);
      const orderDate = addDays(need, -lead);
      const messages: string[] = [];
      if (orderDate < today) messages.push('late');
      if (need < today) messages.push('overdue');
      suggestions.push({ productId: id, kind: p.source, quantity: qty, needDate: need, orderDate, leadTimeDays: lead, supplierId: p.source === 'buy' ? p.supplierId : null, refType: '', refId: null, refNumber: '', messages, reason });
      planned += qty;
      projected = q6(projected + qty);
      detail.push({ date: need, what: `Planned ${p.source === 'make' ? 'manufacturing' : 'purchase'} (${reason})`, qty, projected });
      // the materials of a planned manufacturing order are needed when it starts (today at the earliest)
      if (p.source === 'make' && p.bomRevisionId) {
        const start = clamp(orderDate);
        for (const l of linesOf(p.bomRevisionId, start)) add(l.component_id, { date: start, qty: q6(qty * l.quantity * (1 + (l.scrap_pct || 0) / 100)), kind: 'requirement', ref: `Planned order of ${p.number} (${q6(qty)})` });
      }
    };
    // receipts due before the first need simply come in; later ones are pulled in when stock would fall short
    let ri = 0;
    const takeReceiptsUpTo = (d: string) => {
      while (ri < receipts.length && clamp(receipts[ri].date) <= d) {
        const r = receipts[ri++];
        if (used.has(r)) continue;
        used.add(r);
        projected = q6(projected + r.qty);
        detail.push({ date: r.date, what: r.ref, qty: r.qty, projected });
        if (r.supply && r.date < today) suggestions.push({ productId: id, kind: 'expedite', quantity: r.qty, needDate: today, orderDate: null, leadTimeDays: 0, supplierId: null, refType: r.supply.type, refId: r.supply.id, refNumber: r.supply.number, messages: ['overdue'], reason: `${r.ref} was due ${r.date} and is not in yet` });
      }
    };
    if (projected < p.safety - 1e-9) {
      takeReceiptsUpTo(today);
      if (projected < p.safety - 1e-9) await planOrder(q6(p.safety - projected), today, 'Below safety stock');
    }
    for (const r of reqs) {
      const d = clamp(r.date);
      takeReceiptsUpTo(d);
      projected = q6(projected - r.qty);
      detail.push({ date: r.date, what: r.ref, qty: -r.qty, projected });
      // pull later receipts in first (expedite), then plan for what is still short
      while (projected < p.safety - 1e-9) {
        const later = receipts.find((x) => !used.has(x));
        if (!later) break;
        used.add(later);
        projected = q6(projected + later.qty);
        detail.push({ date: d, what: `${later.ref} (needed earlier)`, qty: later.qty, projected });
        if (later.supply) {
          const msgs = ['expedite'];
          if (later.date < today) msgs.push('overdue');
          suggestions.push({ productId: id, kind: 'expedite', quantity: later.qty, needDate: r.date < today ? today : r.date, orderDate: null, leadTimeDays: 0, supplierId: null, refType: later.supply.type, refId: later.supply.id, refNumber: later.supply.number, messages: msgs, reason: `Due ${later.supply.date}; needed ${r.date} for ${r.ref}` });
        }
      }
      if (projected < p.safety - 1e-9) await planOrder(q6(p.safety - projected), r.date, r.ref);
    }
    takeReceiptsUpTo('9999-12-31');
    if (p.reorderPoint !== null && projected <= p.reorderPoint + 1e-9) {
      const target = p.maxQty !== null && p.maxQty > p.reorderPoint ? p.maxQty : p.reorderPoint + 1;
      const lead = await leadOf(p, target - projected);
      await planOrder(q6(target - projected), addDays(today, lead), 'At or below the reorder point');
    }
    lines.push({ productId: id, level: lv, source: p.source, onHand: st.onHand, reserved: st.reserved, available: st.available, safety: p.safety, reorderPoint: p.reorderPoint, scheduled: q6(scheduled), gross: q6(gross), planned: q6(planned), projectedEnd: projected, lead: await leadOf(p, Math.max(1, planned)), detail });
  }

  // ---- store the run
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'mrp_run');
  const t = now();
  const inputs = {
    asOf: today,
    horizonDays: horizon,
    horizonEnd: end,
    includeForecast,
    demand: demand.slice(0, 2000).map((d) => ({ product: d.number, quantity: d.quantity, due: d.due_date, kind: d.kind, reference: d.reference })),
    salesOrders: salesDemand.slice(0, 2000).map((d) => ({ order: d.number, line: d.position, product: d.product_number, quantity: q6(Number(d.qty)), due: d.due, customer: d.customer_name })),
    purchaseOrders: pos.slice(0, 2000).map((p) => ({ order: p.number, product: info.get(p.product_id)?.number ?? p.product_id, outstanding: q6(p.qty), expected: p.required_date ?? p.po_required ?? p.order_date })),
    manufacturingOrders: mos.slice(0, 2000).map((m) => ({ order: m.number, product: info.get(m.product_id)?.number ?? m.product_id, status: m.status, remaining: Math.max(0, q6(m.quantity - m.completed_qty)), finish: m.finish_date ?? m.required_date })),
    stock: [...level.keys()].slice(0, 5000).map((pid) => ({ product: info.get(pid)!.number, ...(stock.get(pid) ?? { onHand: 0, reserved: 0, available: 0, quarantine: 0 }) })),
    planning: [...info.values()].slice(0, 5000).map((p) => ({ product: p.number, source: p.source, safetyStock: p.safety, reorderPoint: p.reorderPoint, maxQty: p.maxQty, minOrder: p.minOrder, multiple: p.multiple, supplierLeadDays: p.supplierLead, purchaseLeadDays: p.planning?.purchase_lead_days ?? null, mfgLeadDays: p.planning?.mfg_lead_days ?? null, routingLeadDays: p.routing?.lead_time_days ?? null })),
  };
  const summary = { products: lines.length, buy: suggestions.filter((s) => s.kind === 'buy').length, make: suggestions.filter((s) => s.kind === 'make').length, expedite: suggestions.filter((s) => s.kind === 'expedite').length, late: suggestions.filter((s) => s.messages.includes('late')).length, overdue: suggestions.filter((s) => s.messages.includes('overdue')).length };
  const stmts: D1PreparedStatement[] = [
    db.prepare('INSERT INTO erp_mrp_runs (id, company_id, number, run_date, horizon_days, include_forecast, inputs_json, summary_json, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, number, today, horizon, includeForecast ? 1 : 0, JSON.stringify(inputs).slice(0, 900_000), JSON.stringify(summary), a.userId, t),
    // earlier runs' open suggestions give way to this run's
    db.prepare("UPDATE erp_mrp_suggestions SET status = 'dismissed' WHERE company_id = ? AND status = 'open' AND run_id <> ? AND converted_at IS NULL").bind(a.companyId, id),
  ];
  for (const l of lines) {
    stmts.push(
      db
        .prepare('INSERT INTO erp_mrp_lines (company_id, run_id, product_id, level, source, on_hand, reserved, available, safety_stock, reorder_point, scheduled_receipts, gross_requirements, planned_qty, projected_end, lead_time_days, detail_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(a.companyId, id, l.productId, l.level, l.source, l.onHand, l.reserved, l.available, l.safety, l.reorderPoint, l.scheduled, l.gross, l.planned, l.projectedEnd, l.lead, JSON.stringify(l.detail.slice(0, 500))),
    );
  }
  for (const s of suggestions) {
    stmts.push(
      db
        .prepare('INSERT INTO erp_mrp_suggestions (id, company_id, run_id, product_id, kind, quantity, need_date, order_date, lead_time_days, supplier_id, ref_type, ref_id, ref_number, messages, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), a.companyId, id, s.productId, s.kind, s.quantity, s.needDate, s.orderDate, s.leadTimeDays, s.supplierId, s.refType, s.refId, s.refNumber, s.messages.join(','), s.reason.slice(0, 500)),
    );
  }
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mrp.run', entityType: 'mrp_run', entityId: id, summary: `${number}: ${summary.make} to make, ${summary.buy} to buy, ${summary.expedite} to expedite (${summary.late} late, ${summary.overdue} overdue)`, after: summary, at: t }));
  for (let i = 0; i < stmts.length; i += 400) await db.batch(stmts.slice(i, i + 400));
  return { id, number, summary };
}

const runDTO = (r: any) => ({ id: r.id, number: r.number, runDate: r.run_date, horizonDays: r.horizon_days, includeForecast: !!r.include_forecast, summary: parseJson<Record<string, number>>(r.summary_json, {}), byName: r.by_name ?? null, createdAt: r.created_at });

export function suggestionDTO(s: any) {
  return {
    id: s.id,
    runId: s.run_id,
    productId: s.product_id,
    productNumber: s.product_number,
    productName: s.product_name,
    uom: s.uom,
    kind: s.kind,
    kindLabel: label(SUGGESTION_KINDS, s.kind),
    quantity: q6(s.quantity),
    needDate: s.need_date,
    orderDate: s.order_date,
    leadTimeDays: s.lead_time_days,
    supplierId: s.supplier_id,
    supplierName: s.supplier_name ?? null,
    refType: s.ref_type,
    refId: s.ref_id,
    refNumber: s.ref_number,
    messages: String(s.messages || '').split(',').filter(Boolean),
    reason: s.reason,
    status: s.status,
    convertedType: s.converted_type,
    convertedId: s.converted_id,
    convertedNumber: s.converted_number,
  };
}

const SUG_SELECT = `SELECT s.*, p.number AS product_number, p.name AS product_name, p.uom, su.legal_name AS supplier_name FROM erp_mrp_suggestions s
  JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id LEFT JOIN erp_suppliers su ON su.company_id = s.company_id AND su.id = s.supplier_id`;

planningRoutes.post('/c/:company/mrp/runs', async (c) => {
  const a = await requireErp(c, 'mrp.run');
  const input = await body(c, z.object({ horizonDays: z.number().int().min(7).max(730).optional(), includeForecast: z.boolean().optional() }));
  return c.json(await runMrp(c.env.DB, a, input), 201);
});

planningRoutes.get('/c/:company/mrp/runs', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const rows = await c.env.DB.prepare('SELECT r.*, u.name AS by_name FROM erp_mrp_runs r LEFT JOIN users u ON u.id = r.created_by WHERE r.company_id = ? ORDER BY r.created_at DESC LIMIT 100').bind(a.companyId).all<any>();
  return c.json({ runs: rows.results.map(runDTO), can: { run: can(a, 'mrp.run'), buy: can(a, 'mrp.buy') } });
});

planningRoutes.get('/c/:company/mrp/runs/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const id = c.req.param('id');
  const r =
    id === 'latest'
      ? await db.prepare('SELECT r.*, u.name AS by_name FROM erp_mrp_runs r LEFT JOIN users u ON u.id = r.created_by WHERE r.company_id = ? ORDER BY r.created_at DESC, r.rowid DESC LIMIT 1').bind(a.companyId).first<any>()
      : await db.prepare('SELECT r.*, u.name AS by_name FROM erp_mrp_runs r LEFT JOIN users u ON u.id = r.created_by WHERE r.company_id = ? AND r.id = ?').bind(a.companyId, id).first<any>();
  if (!r) {
    if (id === 'latest') return c.json({ run: null, lines: [], suggestions: [], can: { run: can(a, 'mrp.run'), buy: can(a, 'mrp.buy') } });
    throw notFound('MRP run');
  }
  const sugs = await db.prepare(`${SUG_SELECT} WHERE s.company_id = ? AND s.run_id = ? ORDER BY CASE s.kind WHEN 'expedite' THEN 0 WHEN 'make' THEN 1 ELSE 2 END, s.need_date, p.number`).bind(a.companyId, r.id).all<any>();
  const list = sugs.results.map(suggestionDTO);
  if (wantsCsv(c)) {
    return csvResponse(`mrp-${r.number}`, [
      ['Kind', 'Product', 'Name', 'Quantity', 'Unit', 'Needed', 'Order or start by', 'Lead time (days)', 'Supplier', 'Order', 'Messages', 'Reason', 'Status', 'Converted to'],
      ...list.map((s) => [s.kindLabel, s.productNumber, s.productName, s.quantity, s.uom, s.needDate ?? '', s.orderDate ?? '', s.leadTimeDays, s.supplierName ?? '', s.refNumber, s.messages.join(' '), s.reason, s.status, s.convertedNumber]),
    ]);
  }
  const lines = await db.prepare('SELECT l.*, p.number, p.name, p.uom FROM erp_mrp_lines l JOIN erp_products p ON p.company_id = l.company_id AND p.id = l.product_id WHERE l.company_id = ? AND l.run_id = ? ORDER BY l.level, p.number').bind(a.companyId, r.id).all<any>();
  return c.json({
    run: { ...runDTO(r), inputs: parseJson<Record<string, unknown>>(r.inputs_json, {}) },
    lines: lines.results.map((l) => ({ productId: l.product_id, number: l.number, name: l.name, uom: l.uom, level: l.level, source: l.source, sourceLabel: label(SOURCES, l.source), onHand: l.on_hand, reserved: l.reserved, available: l.available, safetyStock: l.safety_stock, reorderPoint: l.reorder_point, scheduledReceipts: l.scheduled_receipts, grossRequirements: l.gross_requirements, plannedQty: l.planned_qty, projectedEnd: l.projected_end, leadTimeDays: l.lead_time_days, detail: parseJson<unknown[]>(l.detail_json, []) })),
    suggestions: list,
    can: { run: can(a, 'mrp.run'), buy: can(a, 'mrp.buy') },
  });
});

planningRoutes.post('/c/:company/mrp/suggestions/:id/:action{convert|dismiss}', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const s = await db.prepare(`${SUG_SELECT} WHERE s.company_id = ? AND s.id = ?`).bind(a.companyId, c.req.param('id')).first<any>();
  if (!s) throw notFound('Suggestion');
  assertCan(a, s.kind === 'buy' ? 'mrp.buy' : 'mrp.run');
  if (s.status !== 'open') badState(s.status === 'converted' ? `Already converted to ${s.converted_number}` : 'This suggestion was dismissed or replaced by a later run');
  const input = await body(c, z.object({ submit: z.boolean().optional(), note: zText(500).optional() }));
  const run = await db.prepare('SELECT number FROM erp_mrp_runs WHERE company_id = ? AND id = ?').bind(a.companyId, s.run_id).first<{ number: string }>();
  const t = now();
  if (c.req.param('action') === 'dismiss') {
    const res = await db.batch([
      db.prepare("UPDATE erp_mrp_suggestions SET status = 'dismissed', converted_by = ?, converted_at = ? WHERE company_id = ? AND id = ? AND status = 'open' AND converted_at IS NULL").bind(a.userId, t, a.companyId, s.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mrp.dismissed', entityType: 'mrp_run', entityId: s.run_id, productId: s.product_id, summary: `${run?.number}: ${label(SUGGESTION_KINDS, s.kind)} suggestion for ${s.product_number} dismissed${input.note ? ` (${input.note})` : ''}`, at: t }),
    ]);
    if (!res[0].meta.changes) badState('This suggestion changed at the same moment: reload');
    return c.json({ ok: true });
  }
  if (s.kind === 'expedite') badState(`Expedite ${s.ref_number} with the supplier or on the shop floor: there is nothing to convert`);
  // claimed first, so two people converting at once make one record
  const claim = await db.prepare("UPDATE erp_mrp_suggestions SET converted_by = ?, converted_at = ? WHERE company_id = ? AND id = ? AND status = 'open' AND converted_at IS NULL").bind(a.userId, t, a.companyId, s.id).run();
  if (!claim.meta.changes) badState('This suggestion is being converted by someone else, or was just converted: reload');
  try {
    const today = todayIso();
    let made: { id: string; number: string };
    let type: string;
    if (s.kind === 'buy') {
      assertCan(a, 'requisitions.raise');
      const price = s.supplier_id ? await db.prepare('SELECT price_cents FROM erp_product_suppliers WHERE company_id = ? AND product_id = ? AND supplier_id = ?').bind(a.companyId, s.product_id, s.supplier_id).first<{ price_cents: number | null }>() : null;
      const est = price?.price_cents ?? Math.round(await currentUnitCost(db, a.companyId, s.product_id));
      made = await createRequisition(
        db,
        a,
        {
          title: `${run?.number ?? 'MRP'}: ${s.product_number} ${s.product_name}`.slice(0, 200),
          requiredDate: s.need_date && s.need_date >= today ? s.need_date : today,
          reason: `MRP suggestion: ${s.reason}${s.messages ? ` (${String(s.messages).replace(/,/g, ', ')})` : ''}`.slice(0, 2000),
          lines: [{ productId: s.product_id, quantity: s.quantity, estUnitCostCents: est }],
          submit: input.submit ?? true,
        },
        `from ${run?.number ?? 'MRP'}`,
      );
      type = 'requisition';
    } else {
      made = await createMo(db, a, { productId: s.product_id, quantity: s.quantity, requiredDate: s.need_date && s.need_date >= today ? s.need_date : today, startDate: s.order_date && s.order_date >= today ? s.order_date : today }, { mrpSuggestionId: s.id, reason: `from ${run?.number ?? 'MRP'}` });
      type = 'manufacturing_order';
    }
    await db.batch([
      db.prepare("UPDATE erp_mrp_suggestions SET status = 'converted', converted_type = ?, converted_id = ?, converted_number = ? WHERE company_id = ? AND id = ?").bind(type, made.id, made.number, a.companyId, s.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mrp.converted', entityType: 'mrp_run', entityId: s.run_id, productId: s.product_id, summary: `${run?.number}: ${label(SUGGESTION_KINDS, s.kind)} ${q6(s.quantity)} of ${s.product_number} converted to ${made.number}`, at: t }),
    ]);
    return c.json({ type, id: made.id, number: made.number }, 201);
  } catch (e) {
    await db.prepare("UPDATE erp_mrp_suggestions SET converted_by = NULL, converted_at = NULL WHERE company_id = ? AND id = ? AND status = 'open'").bind(a.companyId, s.id).run();
    throw e;
  }
});

// ------------------------------------------------------------------ rough-cut capacity

/**
 * Load per work centre per week (Monday to Sunday) against its available hours. Manufacturing orders (draft, released,
 * in progress): each operation not completed and not outsourced, its set-up (when not started) and run time for the
 * quantity still to make, in the week it is planned to start (the current week when that is past). MRP's planned make
 * orders (the latest run's open suggestions): their routing's operations, in the week they should start.
 */
export async function capacityLoad(db: D1Database, companyId: string, weeks: number, from?: string) {
  const first = weekStart(from ?? todayIso());
  const mondays = Array.from({ length: weeks }, (_, i) => addDays(first, i * 7));
  const last = addDays(mondays[mondays.length - 1], 6);
  const centres = (await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ? AND archived_at IS NULL ORDER BY code COLLATE NOCASE').bind(companyId).all<any>()).results;
  const bucket = (d: string | null) => {
    const w = weekStart(d && d > first ? d : first);
    return w > last ? null : w;
  };
  const load = new Map<string, { firm: number; planned: number; orders: Set<string> }>();
  const at = (wc: string, w: string) => {
    const k = `${wc}|${w}`;
    if (!load.has(k)) load.set(k, { firm: 0, planned: 0, orders: new Set() });
    return load.get(k)!;
  };
  const ops = (
    await db
      .prepare(
        `SELECT o.*, mo.number AS mo_number, mo.quantity AS mo_quantity, mo.start_date FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id
          WHERE o.company_id = ? AND mo.status IN ('draft','released','in_progress') AND o.status <> 'completed' AND o.outsourced = 0 AND o.work_centre_id IS NOT NULL`,
      )
      .bind(companyId)
      .all<any>()
  ).results;
  for (const o of ops) {
    const w = bucket(o.planned_start ?? o.start_date);
    if (!w) continue;
    const remaining = Math.max(0, Number(o.mo_quantity) - Number(o.good_qty));
    const hours = ((o.status === 'pending' ? Number(o.setup_minutes) : 0) + Number(o.run_minutes) * remaining) / 60;
    const x = at(o.work_centre_id, w);
    x.firm += hours;
    x.orders.add(o.mo_number);
  }
  const run = await db.prepare('SELECT id, number FROM erp_mrp_runs WHERE company_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1').bind(companyId).first<{ id: string; number: string }>();
  if (run) {
    const sugs = (await db.prepare("SELECT s.product_id, s.quantity, s.order_date, p.number FROM erp_mrp_suggestions s JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id WHERE s.company_id = ? AND s.run_id = ? AND s.kind = 'make' AND s.status = 'open'").bind(companyId, run.id).all<any>()).results;
    for (const s of sugs) {
      const r = await db.prepare("SELECT id FROM erp_routings WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(companyId, s.product_id).first<{ id: string }>();
      if (!r) continue;
      const w = bucket(s.order_date);
      if (!w) continue;
      for (const o of await routingOps(db, companyId, r.id)) {
        if (o.outsourced || !o.work_centre_id) continue;
        const x = at(o.work_centre_id, w);
        x.planned += opHours(o, Number(s.quantity));
        x.orders.add(`Planned ${s.number}`);
      }
    }
  }
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return {
    weeks: mondays,
    run: run ? { id: run.id, number: run.number } : null,
    workCentres: centres.map((w) => ({
      ...workCentreDTO(w),
      weeks: mondays.map((m) => {
        const x = load.get(`${w.id}|${m}`);
        const available = weekHours(w, m);
        const firm = r2(x?.firm ?? 0);
        const planned = r2(x?.planned ?? 0);
        const total = r2(firm + planned);
        return { week: m, availableHours: available, firmHours: firm, plannedHours: planned, loadHours: total, loadPct: available > 0 ? Math.round((total / available) * 100) : null, overload: total > available + 1e-9, orders: [...(x?.orders ?? [])].slice(0, 20) };
      }),
    })),
  };
}

planningRoutes.get('/c/:company/capacity', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const weeks = Math.min(Math.max(Number(c.req.query('weeks')) || 8, 1), 26);
  const from = c.req.query('from');
  const data = await capacityLoad(c.env.DB, a.companyId, weeks, from && /^\d{4}-\d{2}-\d{2}$/.test(from) ? from : undefined);
  if (wantsCsv(c)) {
    return csvResponse('capacity-load', [
      ['Work centre', 'Name', 'Week starting', 'Available hours', 'Manufacturing orders (hours)', 'MRP planned (hours)', 'Load (hours)', 'Load %', 'Overloaded'],
      ...data.workCentres.flatMap((w) => w.weeks.map((x) => [w.code, w.name, x.week, x.availableHours, x.firmHours, x.plannedHours, x.loadHours, x.loadPct ?? '', x.overload ? 'yes' : ''])),
    ]);
  }
  return c.json({ ...data, note: 'Rough-cut: each operation’s hours fall in the week it is planned to start. Available hours: working days times hours per day, machines and efficiency.' });
});
