// BIZOMAT ERP, Release 5 part A reports (/api/erp/c/:company/reports/...) and the Supply Chain hub's counts: open orders
// and backlog, on-time and in-full delivery to customers, shipments by carrier, freight cost against charge, returns
// rate and reasons, sales by product and by customer, and job profitability. Each lists the records behind its numbers
// (the screen links each row to its record), takes the filters that fit it and exports CSV (?format=csv). Numbers come
// only from the company's own records.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { can, requireErp } from './access';
import { csvResponse, dollars, validDate, wantsCsv } from './util';
import { q6 } from './stock';
import { addDays, label, todayIso } from './manufacturing';
import { SO_STATUS } from './sales';
import { RMA_REASONS } from './returns';
import { actualCosts } from './production';

export const supplyReportRoutes = new Hono<AppEnv>();

const date = (c: any, k: string) => {
  const v = c.req.query(k);
  return v && validDate(v) ? (v as string) : null;
};
const startMs = (d: string) => Date.parse(`${d}T00:00:00Z`);
const day = (ms: number | null | undefined) => (ms ? new Date(ms).toISOString().slice(0, 10) : '');
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : null);

/** The date range of a report: from and to (inclusive), 30 days to today by default. */
function range(c: any) {
  const to = date(c, 'to') ?? todayIso();
  const from = date(c, 'from') ?? addDays(to, -29);
  return { from, to, fromMs: startMs(from), toMs: startMs(to) + 86_400_000 };
}

/** A line's value before tax for part of its quantity. */
const share = (netCents: number, part: number, quantity: number) => (quantity > 0 ? Math.round((netCents * part) / quantity) : 0);
const OPEN = "('confirmed','partially_allocated','allocated','partially_shipped')";

// 1. Open orders and backlog: what confirmed orders still have to ship, its value and whether it is late.
supplyReportRoutes.get('/c/:company/reports/open-orders', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const today = todayIso();
  const late = c.req.query('late') === '1';
  const rows = await c.env.DB.prepare(
    `SELECT o.id, o.number, o.customer_name, o.status, o.currency, o.order_date, COALESCE(l.promised_date, o.promised_date, o.requested_date) AS due, l.position, l.quantity, l.shipped_qty, l.allocated_qty, l.net_cents, p.id AS product_id, p.number AS product_number, p.name AS product_name, l.uom
       FROM erp_so_lines l JOIN erp_sales_orders o ON o.company_id = l.company_id AND o.id = l.so_id JOIN erp_products p ON p.company_id = l.company_id AND p.id = l.product_id
      WHERE l.company_id = ? AND o.status IN ${OPEN} AND l.quantity - l.shipped_qty > 1e-9 ORDER BY COALESCE(l.promised_date, o.promised_date, o.requested_date, '9999'), o.number, l.position LIMIT 20000`,
  )
    .bind(a.companyId)
    .all<any>();
  const list = rows.results
    .map((r) => {
      const open = q6(r.quantity - r.shipped_qty);
      return { orderId: r.id, number: r.number, customerName: r.customer_name, status: r.status, statusLabel: label(SO_STATUS, r.status), orderDate: r.order_date, due: r.due, late: !!r.due && r.due < today, line: r.position, productId: r.product_id, productNumber: r.product_number, productName: r.product_name, uom: r.uom, ordered: q6(r.quantity), shipped: q6(r.shipped_qty), allocated: q6(r.allocated_qty), openQty: open, openValueCents: share(r.net_cents, open, r.quantity), currency: r.currency };
    })
    .filter((r) => !late || r.late);
  const byCustomer = new Map<string, { customerName: string; orders: Set<string>; openValueCents: number; lateValueCents: number }>();
  for (const r of list) {
    const x = byCustomer.get(r.customerName) ?? { customerName: r.customerName, orders: new Set<string>(), openValueCents: 0, lateValueCents: 0 };
    x.orders.add(r.orderId);
    x.openValueCents += r.openValueCents;
    if (r.late) x.lateValueCents += r.openValueCents;
    byCustomer.set(r.customerName, x);
  }
  if (wantsCsv(c)) return csvResponse('open-orders', [['Order', 'Customer', 'Status', 'Line', 'Product', 'Name', 'Ordered', 'Shipped', 'Allocated', 'Open', 'Unit', 'Open value', 'Due', 'Late'], ...list.map((r) => [r.number, r.customerName, r.statusLabel, r.line, r.productNumber, r.productName, r.ordered, r.shipped, r.allocated, r.openQty, r.uom, dollars(r.openValueCents), r.due ?? '', r.late ? 'yes' : ''])]);
  return c.json({
    rows: list,
    byCustomer: [...byCustomer.values()].map((x) => ({ customerName: x.customerName, orders: x.orders.size, openValueCents: x.openValueCents, lateValueCents: x.lateValueCents })).sort((x, y) => y.openValueCents - x.openValueCents),
    totals: { orders: new Set(list.map((r) => r.orderId)).size, lines: list.length, openValueCents: list.reduce((s, r) => s + r.openValueCents, 0), lateLines: list.filter((r) => r.late).length, lateValueCents: list.filter((r) => r.late).reduce((s, r) => s + r.openValueCents, 0) },
    note: 'Confirmed orders not shipped in full. Open value: each line’s value before tax for what is still to ship. Late: due (the line’s promised date, else the order’s promised or requested date) before today.',
  });
});

// 2. On time and in full to customers: orders whose first dispatch was in the period.
supplyReportRoutes.get('/c/:company/reports/customer-delivery', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const r = range(c);
  const orders = (
    await db
      .prepare(
        `SELECT o.id, o.number, o.customer_name, o.status, COALESCE(o.promised_date, o.requested_date) AS due,
                (SELECT MIN(s.dispatched_at) FROM erp_shipments s WHERE s.company_id = o.company_id AND s.so_id = o.id AND s.status IN ('dispatched','delivered')) AS first_at,
                (SELECT COUNT(*) FROM erp_shipments s WHERE s.company_id = o.company_id AND s.so_id = o.id AND s.status IN ('dispatched','delivered')) AS shipments,
                (SELECT SUM(quantity) FROM erp_so_lines l WHERE l.company_id = o.company_id AND l.so_id = o.id) AS ordered,
                (SELECT SUM(shipped_qty) FROM erp_so_lines l WHERE l.company_id = o.company_id AND l.so_id = o.id) AS shipped
           FROM erp_sales_orders o WHERE o.company_id = ? AND o.status NOT IN ('draft','cancelled')
            AND (SELECT MIN(s.dispatched_at) FROM erp_shipments s WHERE s.company_id = o.company_id AND s.so_id = o.id AND s.status IN ('dispatched','delivered')) BETWEEN ? AND ?
          ORDER BY o.number LIMIT 5000`,
      )
      .bind(a.companyId, r.fromMs, r.toMs - 1)
      .all<any>()
  ).results;
  const list = [];
  for (const o of orders) {
    const ships = (await db.prepare("SELECT id, number, dispatched_at, delivered_at FROM erp_shipments WHERE company_id = ? AND so_id = ? AND status IN ('dispatched','delivered') ORDER BY dispatched_at, rowid").bind(a.companyId, o.id).all<any>()).results;
    const first = ships[0];
    const firstQty = first ? Number((await db.prepare('SELECT COALESCE(SUM(shipped_qty), 0) AS q FROM erp_shipment_lines WHERE company_id = ? AND shipment_id = ?').bind(a.companyId, first.id).first<{ q: number }>())?.q ?? 0) : 0;
    const complete = Number(o.shipped) >= Number(o.ordered) - 1e-9;
    const last = ships[ships.length - 1];
    const arrived = last ? day(last.delivered_at ?? last.dispatched_at) : '';
    const onTime = complete && (!o.due || arrived <= o.due);
    const inFull = firstQty >= Number(o.ordered) - 1e-9;
    list.push({ id: o.id, number: o.number, customerName: o.customer_name, statusLabel: label(SO_STATUS, o.status), due: o.due, firstDispatch: day(o.first_at), completedOn: complete ? arrived : null, shipments: o.shipments, ordered: q6(o.ordered), shipped: q6(o.shipped), onTime, inFull, otif: onTime && inFull });
  }
  const n = list.length;
  const totals = { orders: n, onTime: list.filter((x) => x.onTime).length, inFull: list.filter((x) => x.inFull).length, otif: list.filter((x) => x.otif).length };
  if (wantsCsv(c)) return csvResponse('customer-delivery', [['Order', 'Customer', 'Status', 'Due', 'First dispatch', 'Completed', 'Shipments', 'Ordered', 'Shipped', 'On time', 'In full', 'On time and in full'], ...list.map((x) => [x.number, x.customerName, x.statusLabel, x.due ?? '', x.firstDispatch, x.completedOn ?? '', x.shipments, x.ordered, x.shipped, x.onTime ? 'yes' : 'no', x.inFull ? 'yes' : 'no', x.otif ? 'yes' : 'no'])]);
  return c.json({
    from: r.from,
    to: r.to,
    rows: list,
    totals: { ...totals, onTimePct: pct(totals.onTime, n), inFullPct: pct(totals.inFull, n), otifPct: pct(totals.otif, n) },
    note: 'Orders whose first shipment was dispatched in the period. On time: every unit shipped and the last shipment delivered (else dispatched) on or before the order’s promised date, else its requested date. In full: the first shipment carried every unit ordered.',
  });
});

/** Dispatched shipments in a period with their carrier, packages, weight and freight. */
async function shippedIn(db: D1Database, companyId: string, fromMs: number, toMs: number, carrierId?: string | null) {
  return (
    await db
      .prepare(
        `SELECT s.id, s.number, s.status, s.dispatched_at, s.delivered_at, s.freight_cost_cents, s.freight_charge_cents, s.carrier_id, s.service, s.tracking_number, o.number AS so_number, o.customer_name, o.currency,
                ca.code AS carrier_code, ca.name AS carrier_name,
                (SELECT COUNT(*) FROM erp_packages p WHERE p.company_id = s.company_id AND p.shipment_id = s.id) AS packages,
                (SELECT COALESCE(SUM(p.weight_kg), 0) FROM erp_packages p WHERE p.company_id = s.company_id AND p.shipment_id = s.id) AS weight
           FROM erp_shipments s JOIN erp_sales_orders o ON o.company_id = s.company_id AND o.id = s.so_id LEFT JOIN erp_carriers ca ON ca.company_id = s.company_id AND ca.id = s.carrier_id
          WHERE s.company_id = ? AND s.status IN ('dispatched','delivered') AND s.dispatched_at >= ? AND s.dispatched_at < ? ${carrierId ? 'AND s.carrier_id = ?' : ''}
          ORDER BY s.dispatched_at, s.number LIMIT 20000`,
      )
      .bind(companyId, fromMs, toMs, ...(carrierId ? [carrierId] : []))
      .all<any>()
  ).results;
}

// 3. Shipments by carrier.
supplyReportRoutes.get('/c/:company/reports/shipments-by-carrier', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const ships = await shippedIn(c.env.DB, a.companyId, r.fromMs, r.toMs, c.req.query('carrierId') || null);
  const by = new Map<string, any>();
  for (const s of ships) {
    const k = s.carrier_id ?? '';
    const x = by.get(k) ?? { carrierId: s.carrier_id, carrierCode: s.carrier_code ?? '', carrierName: s.carrier_name ?? 'No carrier', shipments: 0, packages: 0, weightKg: 0, freightCostCents: 0, freightChargeCents: 0, delivered: 0, transitDays: [] as number[] };
    x.shipments += 1;
    x.packages += Number(s.packages);
    x.weightKg = Math.round((x.weightKg + Number(s.weight)) * 1000) / 1000;
    x.freightCostCents += s.freight_cost_cents;
    x.freightChargeCents += s.freight_charge_cents;
    if (s.delivered_at) {
      x.delivered += 1;
      x.transitDays.push((s.delivered_at - s.dispatched_at) / 86_400_000);
    }
    by.set(k, x);
  }
  const carriers = [...by.values()].map(({ transitDays, ...x }) => ({ ...x, averageTransitDays: transitDays.length ? Math.round((transitDays.reduce((s: number, d: number) => s + d, 0) / transitDays.length) * 10) / 10 : null })).sort((x, y) => y.shipments - x.shipments);
  if (wantsCsv(c)) return csvResponse('shipments-by-carrier', [['Carrier', 'Name', 'Shipments', 'Packages', 'Weight (kg)', 'Delivered', 'Average transit (days)', 'Freight cost', 'Freight charge'], ...carriers.map((x) => [x.carrierCode, x.carrierName, x.shipments, x.packages, x.weightKg, x.delivered, x.averageTransitDays ?? '', dollars(x.freightCostCents), dollars(x.freightChargeCents)])]);
  return c.json({ from: r.from, to: r.to, carriers, shipments: ships.map((s) => ({ id: s.id, number: s.number, salesOrderNumber: s.so_number, customerName: s.customer_name, carrierName: s.carrier_name ?? 'No carrier', service: s.service, trackingNumber: s.tracking_number, dispatchedOn: day(s.dispatched_at), deliveredOn: day(s.delivered_at), packages: Number(s.packages), weightKg: Math.round(Number(s.weight) * 1000) / 1000 })), note: 'Shipments dispatched in the period. Transit: from dispatch to the delivery confirmed.' });
});

// 4. Freight cost against charge.
supplyReportRoutes.get('/c/:company/reports/freight', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const ships = await shippedIn(c.env.DB, a.companyId, r.fromMs, r.toMs, c.req.query('carrierId') || null);
  const list = ships.map((s) => ({ id: s.id, number: s.number, salesOrderNumber: s.so_number, customerName: s.customer_name, carrierName: s.carrier_name ?? 'No carrier', dispatchedOn: day(s.dispatched_at), costCents: s.freight_cost_cents, chargeCents: s.freight_charge_cents, differenceCents: s.freight_charge_cents - s.freight_cost_cents, currency: s.currency }));
  const cost = list.reduce((s, x) => s + x.costCents, 0);
  const charge = list.reduce((s, x) => s + x.chargeCents, 0);
  if (wantsCsv(c)) return csvResponse('freight', [['Shipment', 'Sales order', 'Customer', 'Carrier', 'Dispatched', 'Freight cost', 'Freight charge', 'Charge less cost'], ...list.map((x) => [x.number, x.salesOrderNumber, x.customerName, x.carrierName, x.dispatchedOn, dollars(x.costCents), dollars(x.chargeCents), dollars(x.differenceCents)])]);
  return c.json({ from: r.from, to: r.to, rows: list, totals: { shipments: list.length, costCents: cost, chargeCents: charge, differenceCents: charge - cost, recoveryPct: pct(charge, cost), underCharged: list.filter((x) => x.differenceCents < 0).length }, note: 'Shipments dispatched in the period. Cost: what the carrier charges the company, entered on the shipment. Charge: what the customer is charged (a line on the draft invoice). Recovery: charge over cost.' });
});

// 5. Returns rate and reasons.
supplyReportRoutes.get('/c/:company/reports/returns', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const r = range(c);
  const [shipped, received, raised] = await db.batch([
    db
      .prepare(
        `SELECT x.product_id, p.number, p.name, SUM(x.shipped_qty) AS q FROM erp_shipment_lines x JOIN erp_shipments s ON s.company_id = x.company_id AND s.id = x.shipment_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
          WHERE x.company_id = ? AND s.status IN ('dispatched','delivered') AND s.dispatched_at >= ? AND s.dispatched_at < ? GROUP BY x.product_id`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
    db
      .prepare(
        `SELECT x.product_id, p.number, p.name, rm.reason, SUM(x.received_qty) AS q FROM erp_rma_lines x JOIN erp_rmas rm ON rm.company_id = x.company_id AND rm.id = x.rma_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
          WHERE x.company_id = ? AND rm.status IN ('received','closed') AND rm.received_at >= ? AND rm.received_at < ? GROUP BY x.product_id, rm.reason`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
    db
      .prepare(
        `SELECT rm.id, rm.number, rm.status, rm.reason, rm.customer_name, rm.created_at, rm.received_at, o.number AS so_number, (SELECT SUM(quantity) FROM erp_rma_lines x WHERE x.company_id = rm.company_id AND x.rma_id = rm.id) AS q,
                (SELECT SUM(received_qty) FROM erp_rma_lines x WHERE x.company_id = rm.company_id AND x.rma_id = rm.id) AS rq
           FROM erp_rmas rm JOIN erp_sales_orders o ON o.company_id = rm.company_id AND o.id = rm.so_id WHERE rm.company_id = ? AND rm.created_at >= ? AND rm.created_at < ? ORDER BY rm.created_at`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
  ]);
  const products = new Map<string, { productId: string; number: string; name: string; shipped: number; returned: number }>();
  for (const s of shipped.results as any[]) products.set(s.product_id, { productId: s.product_id, number: s.number, name: s.name, shipped: q6(s.q), returned: 0 });
  const reasons = new Map<string, { reason: string; label: string; returns: number; units: number }>();
  for (const x of received.results as any[]) {
    const p = products.get(x.product_id) ?? { productId: x.product_id, number: x.number, name: x.name, shipped: 0, returned: 0 };
    p.returned = q6(p.returned + Number(x.q));
    products.set(x.product_id, p);
  }
  const list = (raised.results as any[]).map((x) => ({ id: x.id, number: x.number, salesOrderNumber: x.so_number, customerName: x.customer_name, status: x.status, reason: x.reason, reasonLabel: label(RMA_REASONS, x.reason), quantity: q6(x.q ?? 0), receivedQty: q6(x.rq ?? 0), raisedOn: day(x.created_at), receivedOn: day(x.received_at) }));
  for (const x of list.filter((y) => !['cancelled', 'rejected'].includes(y.status))) {
    const k = reasons.get(x.reason) ?? { reason: x.reason, label: x.reasonLabel, returns: 0, units: 0 };
    k.returns += 1;
    k.units = q6(k.units + x.quantity);
    reasons.set(x.reason, k);
  }
  const byProduct = [...products.values()].map((p) => ({ ...p, ratePct: pct(p.returned, p.shipped) })).sort((x, y) => y.returned - x.returned || (x.number < y.number ? -1 : 1));
  const shippedUnits = q6(byProduct.reduce((s, p) => s + p.shipped, 0));
  const returnedUnits = q6(byProduct.reduce((s, p) => s + p.returned, 0));
  if (wantsCsv(c)) return csvResponse('returns', [['Return', 'Sales order', 'Customer', 'Status', 'Reason', 'Quantity', 'Received', 'Raised', 'Received on'], ...list.map((x) => [x.number, x.salesOrderNumber, x.customerName, x.status, x.reasonLabel, x.quantity, x.receivedQty, x.raisedOn, x.receivedOn])]);
  return c.json({ from: r.from, to: r.to, rows: list, byReason: [...reasons.values()].sort((x, y) => y.units - x.units), byProduct, totals: { returns: list.length, shippedUnits, returnedUnits, ratePct: pct(returnedUnits, shippedUnits) }, note: 'Returns rate: units received back in the period over units dispatched in the period. Reasons: returns raised in the period (not cancelled or rejected), by the units asked for.' });
});

// 6. Sales by product and by customer: what was dispatched in the period, at each line's value before tax.
supplyReportRoutes.get('/c/:company/reports/sales', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const rows = (
    await c.env.DB.prepare(
      `SELECT x.shipped_qty, l.quantity, l.net_cents, l.product_id, p.number, p.name, l.uom, o.id AS so_id, o.number AS so_number, o.customer_name, COALESCE(o.crm_company_id, o.fin_contact_id) AS customer_key, s.number AS shipment_number, s.dispatched_at
         FROM erp_shipment_lines x JOIN erp_shipments s ON s.company_id = x.company_id AND s.id = x.shipment_id JOIN erp_so_lines l ON l.company_id = x.company_id AND l.id = x.so_line_id
         JOIN erp_sales_orders o ON o.company_id = l.company_id AND o.id = l.so_id JOIN erp_products p ON p.company_id = l.company_id AND p.id = l.product_id
        WHERE x.company_id = ? AND s.status IN ('dispatched','delivered') AND s.dispatched_at >= ? AND s.dispatched_at < ? AND x.shipped_qty > 0 ORDER BY s.dispatched_at LIMIT 50000`,
    )
      .bind(a.companyId, r.fromMs, r.toMs)
      .all<any>()
  ).results;
  const byProduct = new Map<string, any>();
  const byCustomer = new Map<string, any>();
  for (const x of rows) {
    const v = share(x.net_cents, x.shipped_qty, x.quantity);
    const p = byProduct.get(x.product_id) ?? { productId: x.product_id, number: x.number, name: x.name, uom: x.uom, quantity: 0, valueCents: 0, orders: new Set<string>() };
    p.quantity = q6(p.quantity + x.shipped_qty);
    p.valueCents += v;
    p.orders.add(x.so_id);
    byProduct.set(x.product_id, p);
    const k = x.customer_key ?? x.customer_name;
    const cu = byCustomer.get(k) ?? { customerName: x.customer_name, quantity: 0, valueCents: 0, orders: new Set<string>() };
    cu.quantity = q6(cu.quantity + x.shipped_qty);
    cu.valueCents += v;
    cu.orders.add(x.so_id);
    byCustomer.set(k, cu);
  }
  const products = [...byProduct.values()].map(({ orders, ...p }) => ({ ...p, orders: orders.size })).sort((x, y) => y.valueCents - x.valueCents);
  const customers = [...byCustomer.values()].map(({ orders, ...p }) => ({ ...p, orders: orders.size })).sort((x, y) => y.valueCents - x.valueCents);
  const by = c.req.query('by') === 'customer' ? 'customer' : 'product';
  if (wantsCsv(c)) {
    return by === 'customer'
      ? csvResponse('sales-by-customer', [['Customer', 'Orders', 'Units', 'Value before tax'], ...customers.map((x) => [x.customerName, x.orders, x.quantity, dollars(x.valueCents)])])
      : csvResponse('sales-by-product', [['Product', 'Name', 'Orders', 'Quantity', 'Unit', 'Value before tax'], ...products.map((x) => [x.number, x.name, x.orders, x.quantity, x.uom, dollars(x.valueCents)])]);
  }
  return c.json({ from: r.from, to: r.to, byProduct: products, byCustomer: customers, totals: { valueCents: products.reduce((s, p) => s + p.valueCents, 0), shipments: new Set(rows.map((x) => x.shipment_number)).size }, note: 'Goods dispatched in the period, at each sales order line’s value before tax for the quantity shipped (freight not included). Returns are in the returns report.' });
});

// 7. Job profitability: manufacturing orders made to order for a sales order line, revenue against actual cost.
supplyReportRoutes.get('/c/:company/reports/job-profitability', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const rows = (
    await db
      .prepare(
        `SELECT mo.id, mo.number, mo.status, mo.quantity, mo.completed_qty, mo.currency, p.number AS product_number, p.name AS product_name, k.quantity AS link_qty, l.quantity AS line_qty, l.net_cents, l.position, o.id AS so_id, o.number AS so_number, o.customer_name
           FROM erp_so_mo_links k JOIN erp_mfg_orders mo ON mo.company_id = k.company_id AND mo.id = k.mo_id JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id
           JOIN erp_so_lines l ON l.company_id = k.company_id AND l.id = k.so_line_id JOIN erp_sales_orders o ON o.company_id = l.company_id AND o.id = l.so_id
          WHERE k.company_id = ? AND mo.status <> 'cancelled' ORDER BY mo.number LIMIT 5000`,
      )
      .bind(a.companyId)
      .all<any>()
  ).results;
  const status = c.req.query('status');
  const list = [];
  for (const x of rows) {
    if (status === 'closed' && x.status !== 'closed') continue;
    if (status === 'open' && x.status === 'closed') continue;
    let cost: number;
    if (x.status === 'closed') cost = Number((await db.prepare('SELECT COALESCE(SUM(actual_cents), 0) AS n FROM erp_mo_costs WHERE company_id = ? AND mo_id = ?').bind(a.companyId, x.id).first<{ n: number }>())?.n ?? 0);
    else cost = (await actualCosts(db, a.companyId, x.id)).total;
    const revenue = share(x.net_cents, x.link_qty, x.line_qty);
    list.push({ id: x.id, number: x.number, status: x.status, final: x.status === 'closed', productNumber: x.product_number, productName: x.product_name, quantity: q6(x.quantity), completedQty: q6(x.completed_qty), salesOrderId: x.so_id, salesOrderNumber: x.so_number, line: x.position, customerName: x.customer_name, revenueCents: revenue, costCents: cost, marginCents: revenue - cost, marginPct: pct(revenue - cost, revenue), currency: x.currency });
  }
  const revenue = list.reduce((s, x) => s + x.revenueCents, 0);
  const cost = list.reduce((s, x) => s + x.costCents, 0);
  if (wantsCsv(c)) return csvResponse('job-profitability', [['Order', 'Status', 'Product', 'Name', 'Quantity', 'Completed', 'Sales order', 'Line', 'Customer', 'Revenue', 'Actual cost', 'Margin', 'Margin %'], ...list.map((x) => [x.number, x.status, x.productNumber, x.productName, x.quantity, x.completedQty, x.salesOrderNumber, x.line, x.customerName, dollars(x.revenueCents), dollars(x.costCents), dollars(x.marginCents), x.marginPct ?? ''])]);
  return c.json({ rows: list, totals: { orders: list.length, revenueCents: revenue, costCents: cost, marginCents: revenue - cost, marginPct: pct(revenue - cost, revenue) }, note: 'Manufacturing orders made to order for a sales order line. Revenue: the line’s value before tax for the quantity made for it. Cost: the order’s actual cost by element (final once the order is closed; so far while it is open). Freight is not included.' });
});

// ------------------------------------------------------------------ the Supply Chain hub

/** What waits in Supply Chain, for the hub and the Operations page. */
export async function supplyCounts(db: D1Database, companyId: string) {
  const today = todayIso();
  const [so, sh, inv, rma] = await db.batch([
    db
      .prepare(
        `SELECT SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft, SUM(CASE WHEN status IN ('confirmed','partially_allocated') THEN 1 ELSE 0 END) AS to_allocate,
                SUM(CASE WHEN status IN ${OPEN} THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN status IN ${OPEN} AND COALESCE(promised_date, requested_date) < ?2 THEN 1 ELSE 0 END) AS late
           FROM erp_sales_orders WHERE company_id = ?1`,
      )
      .bind(companyId, today),
    db
      .prepare(
        `SELECT SUM(CASE WHEN status IN ('planned','picking') THEN 1 ELSE 0 END) AS to_pick, SUM(CASE WHEN status = 'picked' THEN 1 ELSE 0 END) AS to_pack, SUM(CASE WHEN status = 'packed' THEN 1 ELSE 0 END) AS to_dispatch,
                SUM(CASE WHEN status = 'dispatched' THEN 1 ELSE 0 END) AS in_transit, SUM(CASE WHEN status IN ('planned','picking','picked','packed') AND planned_date = ?2 THEN 1 ELSE 0 END) AS today
           FROM erp_shipments WHERE company_id = ?1`,
      )
      .bind(companyId, today),
    db.prepare("SELECT COUNT(*) AS n FROM erp_shipments s WHERE s.company_id = ? AND s.status IN ('dispatched','delivered') AND NOT EXISTS (SELECT 1 FROM erp_integration_events e WHERE e.company_id = s.company_id AND e.source_type = 'shipment' AND e.source_id = s.id AND e.kind = 'finance.draft_invoice' AND e.status = 'done')").bind(companyId),
    db.prepare("SELECT SUM(CASE WHEN status = 'requested' THEN 1 ELSE 0 END) AS to_authorise, SUM(CASE WHEN status = 'authorised' THEN 1 ELSE 0 END) AS to_receive FROM erp_rmas WHERE company_id = ?").bind(companyId),
  ]);
  const one = (r: D1Result) => (r.results[0] ?? {}) as Record<string, number | null>;
  return {
    ordersDraft: one(so).draft ?? 0,
    ordersToAllocate: one(so).to_allocate ?? 0,
    ordersOpen: one(so).open ?? 0,
    ordersLate: one(so).late ?? 0,
    toPick: one(sh).to_pick ?? 0,
    toPack: one(sh).to_pack ?? 0,
    toDispatch: one(sh).to_dispatch ?? 0,
    inTransit: one(sh).in_transit ?? 0,
    shippingToday: one(sh).today ?? 0,
    toInvoice: one(inv).n ?? 0,
    returnsToAuthorise: one(rma).to_authorise ?? 0,
    returnsToReceive: one(rma).to_receive ?? 0,
  };
}

supplyReportRoutes.get('/c/:company/supply-chain/overview', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const counts = await supplyCounts(db, a.companyId);
  const any = await db.prepare('SELECT (SELECT COUNT(*) FROM erp_sales_orders WHERE company_id = ?1) AS orders, (SELECT COUNT(*) FROM erp_carriers WHERE company_id = ?1) AS carriers').bind(a.companyId).first<{ orders: number; carriers: number }>();
  return c.json({
    counts,
    empty: !any?.orders,
    carriers: any?.carriers ?? 0,
    can: {
      edit: can(a, 'sales.edit'),
      confirm: can(a, 'sales.confirm'),
      allocate: can(a, 'sales.allocate'),
      plan: can(a, 'shipping.plan'),
      pick: can(a, 'shipping.pick'),
      pack: can(a, 'shipping.pack'),
      dispatch: can(a, 'shipping.dispatch'),
      deliver: can(a, 'shipping.deliver'),
      carriers: can(a, 'carriers.setup'),
      returns: can(a, 'returns.raise'),
      authorise: can(a, 'returns.authorise'),
      receive: can(a, 'returns.receive'),
    },
  });
});
