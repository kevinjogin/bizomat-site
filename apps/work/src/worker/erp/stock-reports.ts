// BIZOMAT ERP, Release 2 reports (/api/erp/c/:company/reports/...): purchase commitments, supplier spend, purchase price
// variance, supplier delivery performance, stock on hand, stock valuation, stock movements, stock ageing, slow-moving
// stock and shortages. Each takes date, status, supplier or warehouse filters as fits it, lists the records behind its
// numbers (the screen links each row to its record) and exports CSV (?format=csv). Numbers come only from the company's
// own records.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { requireErp } from './access';
import { csvResponse, dollars, likeOf, validDate, wantsCsv } from './util';
import { loadSettings } from './settings';
import { q6 } from './stock';
import { PO_LABELS } from './purchasing';
import { PERFORMANCE_HELP, supplierPerformance } from './performance';

export const stockReportRoutes = new Hono<AppEnv>();

const date = (c: any, k: string) => {
  const v = c.req.query(k);
  return v && validDate(v) ? (v as string) : null;
};
const pct = (n: number | null) => (n === null ? '' : `${Math.round(n * 1000) / 10}%`);
const day = (ms: number | null | undefined) => (ms ? new Date(ms).toISOString().slice(0, 10) : '');

/** Net price per unit of a purchase order line (after its discount, before tax). */
const NET_UNIT = 'CASE WHEN pl.quantity > 0 THEN pl.net_cents * 1.0 / pl.quantity ELSE 0 END';

// 1. Purchase commitments: what open orders still owe, at their net price.
stockReportRoutes.get('/c/:company/reports/purchase-commitments', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const where = ["o.company_id = ?", "o.status IN ('approved','sent','partially_received')"];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status && ['approved', 'sent', 'partially_received'].includes(status)) {
    where.push('o.status = ?');
    args.push(status);
  }
  if (c.req.query('supplierId')) {
    where.push('o.supplier_id = ?');
    args.push(c.req.query('supplierId'));
  }
  const from = date(c, 'from');
  const to = date(c, 'to');
  if (from) {
    where.push('o.order_date >= ?');
    args.push(from);
  }
  if (to) {
    where.push('o.order_date <= ?');
    args.push(to);
  }
  const rows = await db
    .prepare(
      `SELECT o.id, o.number, o.status, o.order_date, o.required_date, o.currency, o.total_cents, s.id AS supplier_id, s.number AS supplier_number, s.legal_name,
              (SELECT COALESCE(SUM(CAST(round((pl.quantity - pl.received_qty) * ${NET_UNIT}) AS INTEGER)), 0) FROM erp_po_lines pl WHERE pl.company_id = o.company_id AND pl.po_id = o.id AND pl.received_qty < pl.quantity) AS outstanding_cents,
              (SELECT COALESCE(SUM(pl.quantity - pl.received_qty), 0) FROM erp_po_lines pl WHERE pl.company_id = o.company_id AND pl.po_id = o.id AND pl.received_qty < pl.quantity) AS outstanding_qty
         FROM erp_purchase_orders o JOIN erp_suppliers s ON s.company_id = o.company_id AND s.id = o.supplier_id
        WHERE ${where.join(' AND ')} ORDER BY COALESCE(o.required_date, '9999'), o.number LIMIT 5000`,
    )
    .bind(...args)
    .all<any>();
  const list = rows.results.map((r) => ({ id: r.id, number: r.number, status: r.status, statusLabel: PO_LABELS[r.status as keyof typeof PO_LABELS], orderDate: r.order_date, requiredDate: r.required_date, supplierId: r.supplier_id, supplier: `${r.supplier_number} ${r.legal_name}`, currency: r.currency, totalCents: r.total_cents, outstandingCents: r.outstanding_cents, outstandingQty: q6(r.outstanding_qty) }));
  if (wantsCsv(c)) return csvResponse('purchase-commitments', [['Order', 'Supplier', 'Status', 'Order date', 'Required', 'Currency', 'Order total', 'Outstanding (net)', 'Outstanding quantity'], ...list.map((r) => [r.number, r.supplier, r.statusLabel, r.orderDate, r.requiredDate ?? '', r.currency, dollars(r.totalCents), dollars(r.outstandingCents), r.outstandingQty])]);
  const totals = new Map<string, number>();
  for (const r of list) totals.set(r.currency, (totals.get(r.currency) ?? 0) + r.outstandingCents);
  return c.json({ rows: list, totals: [...totals.entries()].map(([currency, cents]) => ({ currency, cents })), note: 'Outstanding: ordered less accepted, at each line’s net price (after discount, before tax).' });
});

// 2. Supplier spend: orders placed (approved or later) and goods accepted, per supplier.
stockReportRoutes.get('/c/:company/reports/supplier-spend', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const from = date(c, 'from');
  const to = date(c, 'to');
  const rows = await db
    .prepare(
      `SELECT s.id, s.number, s.legal_name, o.currency,
              COUNT(DISTINCT o.id) AS orders,
              (SELECT COALESCE(SUM(o2.total_cents), 0) FROM erp_purchase_orders o2 WHERE o2.company_id = s.company_id AND o2.supplier_id = s.id AND o2.currency = o.currency AND o2.status IN ('approved','sent','partially_received','received','closed') ${from ? 'AND o2.order_date >= ?1' : ''} ${to ? 'AND o2.order_date <= ?2' : ''}) AS ordered_cents,
              (SELECT COALESCE(SUM(CAST(round(x.accepted_qty * CASE WHEN pl.quantity > 0 THEN pl.net_cents * 1.0 / pl.quantity ELSE 0 END) AS INTEGER)), 0) FROM erp_receipt_lines x
                 JOIN erp_receipts r ON r.company_id = x.company_id AND r.id = x.receipt_id JOIN erp_po_lines pl ON pl.company_id = x.company_id AND pl.id = x.po_line_id JOIN erp_purchase_orders o3 ON o3.company_id = r.company_id AND o3.id = r.po_id
                WHERE r.company_id = s.company_id AND r.supplier_id = s.id AND o3.currency = o.currency ${from ? 'AND r.received_date >= ?1' : ''} ${to ? 'AND r.received_date <= ?2' : ''}) AS received_cents
         FROM erp_suppliers s JOIN erp_purchase_orders o ON o.company_id = s.company_id AND o.supplier_id = s.id AND o.status IN ('approved','sent','partially_received','received','closed')
        WHERE s.company_id = ?3 ${from ? 'AND o.order_date >= ?1' : ''} ${to ? 'AND o.order_date <= ?2' : ''}
        GROUP BY s.id, o.currency ORDER BY ordered_cents DESC LIMIT 2000`,
    )
    .bind(from ?? '', to ?? '', a.companyId)
    .all<any>();
  const list = rows.results.map((r) => ({ supplierId: r.id, number: r.number, name: r.legal_name, currency: r.currency, orders: r.orders, orderedCents: r.ordered_cents, receivedCents: r.received_cents }));
  if (wantsCsv(c)) return csvResponse('supplier-spend', [['Supplier', 'Name', 'Currency', 'Orders', 'Ordered (incl. tax)', 'Accepted (net)'], ...list.map((r) => [r.number, r.name, r.currency, r.orders, dollars(r.orderedCents), dollars(r.receivedCents)])]);
  return c.json({ rows: list, note: 'Ordered: approved orders (and later) by order date, with tax. Accepted: goods accepted on receipts by receipt date, at the order’s net price.' });
});

// 3. Purchase price variance: what was paid per unit against the product's standard cost, on goods accepted.
stockReportRoutes.get('/c/:company/reports/price-variance', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const settings = await loadSettings(db, a.companyId);
  const where = ['x.company_id = ?', 'x.product_id IS NOT NULL', 'x.accepted_qty > 0'];
  const args: unknown[] = [a.companyId];
  const from = date(c, 'from');
  const to = date(c, 'to');
  if (from) {
    where.push('r.received_date >= ?');
    args.push(from);
  }
  if (to) {
    where.push('r.received_date <= ?');
    args.push(to);
  }
  if (c.req.query('supplierId')) {
    where.push('r.supplier_id = ?');
    args.push(c.req.query('supplierId'));
  }
  const rows = await db
    .prepare(
      `SELECT x.id, x.accepted_qty, r.id AS receipt_id, r.number AS receipt_number, r.received_date, o.id AS po_id, o.number AS po_number, o.currency, p.id AS product_id, p.number AS product_number, p.name AS product_name, p.standard_cost_cents, p.currency AS product_currency,
              ${NET_UNIT} AS unit_net, s.legal_name AS supplier
         FROM erp_receipt_lines x JOIN erp_receipts r ON r.company_id = x.company_id AND r.id = x.receipt_id JOIN erp_purchase_orders o ON o.company_id = r.company_id AND o.id = r.po_id
         JOIN erp_po_lines pl ON pl.company_id = x.company_id AND pl.id = x.po_line_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id JOIN erp_suppliers s ON s.company_id = r.company_id AND s.id = r.supplier_id
        WHERE ${where.join(' AND ')} ORDER BY r.received_date DESC, r.number LIMIT 5000`,
    )
    .bind(...args)
    .all<any>();
  const list = rows.results.map((r) => {
    const comparable = r.standard_cost_cents !== null && r.currency === r.product_currency;
    const variance = comparable ? Math.round((r.unit_net - r.standard_cost_cents) * r.accepted_qty) : null;
    return { receiptId: r.receipt_id, receiptNumber: r.receipt_number, receivedDate: r.received_date, poId: r.po_id, poNumber: r.po_number, supplier: r.supplier, productId: r.product_id, productNumber: r.product_number, productName: r.product_name, quantity: q6(r.accepted_qty), unitPaidCents: r.unit_net, standardCostCents: r.standard_cost_cents, currency: r.currency, varianceCents: variance, flag: comparable ? null : r.standard_cost_cents === null ? 'No standard cost' : 'Other currency' };
  });
  const total = list.reduce((s, r) => s + (r.varianceCents ?? 0), 0);
  if (wantsCsv(c)) return csvResponse('purchase-price-variance', [['Receipt', 'Received', 'Order', 'Supplier', 'Product', 'Name', 'Quantity', 'Unit paid (net)', 'Standard cost', 'Currency', 'Variance', 'Note'], ...list.map((r) => [r.receiptNumber, r.receivedDate, r.poNumber, r.supplier, r.productNumber, r.productName, r.quantity, (r.unitPaidCents / 100).toFixed(4), dollars(r.standardCostCents), r.currency, dollars(r.varianceCents), r.flag ?? ''])]);
  return c.json({ rows: list, totalVarianceCents: total, currency: settings.currency, note: 'Variance: (unit price paid, net of discount and tax, less the standard cost) times the quantity accepted. Above zero: paid more than standard.' });
});

// 4. Supplier delivery performance, from goods receipts.
stockReportRoutes.get('/c/:company/reports/supplier-delivery', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const perf = await supplierPerformance(db, a.companyId, c.req.query('supplierId') || undefined, { from: date(c, 'from') ?? undefined, to: date(c, 'to') ?? undefined });
  const names = new Map((await db.prepare('SELECT id, number, legal_name FROM erp_suppliers WHERE company_id = ?').bind(a.companyId).all<any>()).results.map((s) => [s.id, s]));
  const list = perf.map((p) => ({ ...p, number: names.get(p.supplierId)?.number ?? '', name: names.get(p.supplierId)?.legal_name ?? '' })).sort((x, y) => x.number.localeCompare(y.number));
  if (wantsCsv(c)) return csvResponse('supplier-delivery-performance', [['Supplier', 'Name', 'Orders received', 'Receipts', 'On time', 'Measured on time', 'In full', 'Measured in full', 'Average lead time (days)', 'Received', 'Damaged or rejected'], ...list.map((r) => [r.number, r.name, r.orders, r.receipts, pct(r.onTimeRate), r.onTimeMeasured, pct(r.inFullRate), r.inFullMeasured, r.avgLeadTimeDays ?? '', r.receivedQty, r.rejectedQty])]);
  return c.json({ rows: list, note: PERFORMANCE_HELP });
});

// 5. Stock on hand per product (and per warehouse when chosen).
stockReportRoutes.get('/c/:company/reports/stock-on-hand', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const settings = await loadSettings(db, a.companyId);
  const wh = c.req.query('warehouseId');
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.uom, w.id AS warehouse_id, w.code AS warehouse_code, SUM(s.on_hand) AS on_hand, SUM(s.reserved) AS reserved,
              SUM(CASE WHEN l.kind = 'quarantine' THEN s.on_hand ELSE 0 END) AS quarantine, v.qty AS v_qty, v.value_cents AS v_value
         FROM erp_stock s JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id
         JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id LEFT JOIN erp_valuation v ON v.company_id = s.company_id AND v.product_id = s.product_id
        WHERE s.company_id = ? ${wh ? 'AND w.id = ?' : ''} AND (s.on_hand <> 0 OR s.reserved <> 0) ${c.req.query('q') ? 'AND (p.number LIKE ? OR p.name LIKE ?)' : ''}
        GROUP BY p.id, w.id ORDER BY p.number COLLATE NOCASE, w.code LIMIT 10000`,
    )
    .bind(a.companyId, ...(wh ? [wh] : []), ...(c.req.query('q') ? [likeOf(c.req.query('q')!), likeOf(c.req.query('q')!)] : []))
    .all<any>();
  const list = rows.results.map((r) => {
    const unit = r.v_qty > 1e-9 ? r.v_value / r.v_qty : null;
    return { productId: r.id, number: r.number, name: r.name, uom: r.uom, warehouseId: r.warehouse_id, warehouse: r.warehouse_code, onHand: q6(r.on_hand), reserved: q6(r.reserved), available: q6(r.on_hand - r.quarantine - r.reserved), quarantine: q6(r.quarantine), valueCents: unit === null ? 0 : Math.round(unit * r.on_hand) };
  });
  if (wantsCsv(c)) return csvResponse('stock-on-hand-by-warehouse', [['Product', 'Name', 'Warehouse', 'On hand', 'Reserved', 'Available', 'In quarantine', 'Unit', `Value (${settings.currency})`], ...list.map((r) => [r.number, r.name, r.warehouse, r.onHand, r.reserved, r.available, r.quarantine, r.uom, dollars(r.valueCents)])]);
  return c.json({ rows: list, currency: settings.currency, totalCents: list.reduce((s, r) => s + r.valueCents, 0) });
});

// 6. Stock valuation and 7. stock movements are the inventory endpoints /valuation and /movements (inventory.ts), with
// the same filters and CSV; the report screens use them directly.

/** Incoming movements newest first per product: the stock on hand is taken to be the most recent receipts (first in, first out). */
async function ageingData(db: D1Database, companyId: string, wh: string | null) {
  const stock = await db
    .prepare(
      `SELECT s.product_id, SUM(s.on_hand) AS on_hand FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id
        WHERE s.company_id = ? ${wh ? 'AND l.warehouse_id = ?' : ''} GROUP BY s.product_id HAVING SUM(s.on_hand) > 1e-9`,
    )
    .bind(companyId, ...(wh ? [wh] : []))
    .all<{ product_id: string; on_hand: number }>();
  const ins = await db
    .prepare(
      `SELECT m.product_id, m.on_hand_delta, m.created_at FROM erp_stock_moves m JOIN erp_locations l ON l.company_id = m.company_id AND l.id = m.location_id
        WHERE m.company_id = ? ${wh ? 'AND l.warehouse_id = ?' : ''} AND m.move_type IN ('receipt','customer_return','adjust_in','count_in','transfer_in','release_in','quarantine_in') ORDER BY m.created_at DESC, m.rowid DESC`,
    )
    .bind(companyId, ...(wh ? [wh] : []))
    .all<{ product_id: string; on_hand_delta: number; created_at: number }>();
  const byProduct = new Map<string, { q: number; at: number }[]>();
  for (const m of ins.results) {
    if (!byProduct.has(m.product_id)) byProduct.set(m.product_id, []);
    byProduct.get(m.product_id)!.push({ q: m.on_hand_delta, at: m.created_at });
  }
  return { stock: stock.results, byProduct };
}

// 8. Stock ageing: quantity on hand by age since it came in, and lots that expire soon.
stockReportRoutes.get('/c/:company/reports/stock-ageing', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const wh = c.req.query('warehouseId') || null;
  const t = Date.now();
  const buckets = [
    { key: 'd30', label: '0 to 30 days', max: 30 },
    { key: 'd60', label: '31 to 60 days', max: 60 },
    { key: 'd90', label: '61 to 90 days', max: 90 },
    { key: 'd180', label: '91 to 180 days', max: 180 },
    { key: 'older', label: 'Over 180 days', max: Infinity },
  ];
  const { stock, byProduct } = await ageingData(db, a.companyId, wh);
  const products = new Map((await db.prepare('SELECT id, number, name, uom FROM erp_products WHERE company_id = ?').bind(a.companyId).all<any>()).results.map((p) => [p.id, p]));
  const list = stock.map((s) => {
    let left = s.on_hand;
    const ages: Record<string, number> = Object.fromEntries(buckets.map((b) => [b.key, 0]));
    for (const m of byProduct.get(s.product_id) ?? []) {
      if (left <= 1e-9) break;
      const take = Math.min(left, m.q);
      const days = (t - m.at) / 86_400_000;
      ages[buckets.find((b) => days <= b.max)!.key] += take;
      left -= take;
    }
    if (left > 1e-9) ages.older += left;
    const p = products.get(s.product_id);
    return { productId: s.product_id, number: p?.number ?? '', name: p?.name ?? '', uom: p?.uom ?? '', onHand: q6(s.on_hand), ...Object.fromEntries(Object.entries(ages).map(([k, v]) => [k, q6(v)])) };
  });
  const soon = new Date(t + 30 * 86_400_000).toISOString().slice(0, 10);
  const expiring = await db
    .prepare(
      `SELECT s.product_id, p.number, p.name, s.lot, s.serial, s.expiry, s.on_hand, l.code AS location_code, w.code AS warehouse_code FROM erp_stock s JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id
         JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
        WHERE s.company_id = ? AND s.expiry IS NOT NULL AND s.expiry <= ? AND s.on_hand > 0 ${wh ? 'AND w.id = ?' : ''} ORDER BY s.expiry LIMIT 500`,
    )
    .bind(a.companyId, soon, ...(wh ? [wh] : []))
    .all<any>();
  if (wantsCsv(c)) return csvResponse('stock-ageing', [['Product', 'Name', 'On hand', ...buckets.map((b) => b.label), 'Unit'], ...list.map((r: any) => [r.number, r.name, r.onHand, ...buckets.map((b) => r[b.key]), r.uom])]);
  return c.json({
    buckets: buckets.map((b) => ({ key: b.key, label: b.label })),
    rows: list.sort((x, y) => x.number.localeCompare(y.number)),
    expiring: expiring.results.map((e) => ({ productId: e.product_id, number: e.number, name: e.name, lot: e.lot, serial: e.serial, expiry: e.expiry, onHand: q6(e.on_hand), location: `${e.warehouse_code}/${e.location_code}` })),
    note: 'Age of the stock on hand since it came in, taking the most recent arrivals as the stock still held (first in, first out). Expiring: lots that expire within 30 days or have expired.',
  });
});

// 9. Slow-moving stock: products held with no issue in the chosen number of days.
stockReportRoutes.get('/c/:company/reports/slow-moving', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const days = Math.min(Math.max(Number(c.req.query('days')) || 90, 7), 3650);
  const wh = c.req.query('warehouseId');
  const settings = await loadSettings(db, a.companyId);
  const since = Date.now() - days * 86_400_000;
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.uom, SUM(s.on_hand) AS on_hand, v.qty AS v_qty, v.value_cents AS v_value,
              (SELECT MAX(m.created_at) FROM erp_stock_moves m WHERE m.company_id = p.company_id AND m.product_id = p.id AND m.move_type IN ('issue','supplier_return','scrap')) AS last_out,
              (SELECT MAX(m.created_at) FROM erp_stock_moves m WHERE m.company_id = p.company_id AND m.product_id = p.id AND m.on_hand_delta > 0 AND m.move_type IN ('receipt','customer_return','adjust_in','count_in')) AS last_in
         FROM erp_stock s JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id
         LEFT JOIN erp_valuation v ON v.company_id = s.company_id AND v.product_id = s.product_id
        WHERE s.company_id = ? ${wh ? 'AND l.warehouse_id = ?' : ''} GROUP BY p.id HAVING SUM(s.on_hand) > 1e-9 AND COALESCE(last_out, 0) < ? ORDER BY COALESCE(last_out, 0), p.number LIMIT 5000`,
    )
    .bind(a.companyId, ...(wh ? [wh] : []), since)
    .all<any>();
  const list = rows.results.map((r) => ({ productId: r.id, number: r.number, name: r.name, uom: r.uom, onHand: q6(r.on_hand), valueCents: r.v_qty > 1e-9 ? Math.round((r.v_value / r.v_qty) * r.on_hand) : 0, lastIssued: day(r.last_out), lastReceived: day(r.last_in), daysSinceIssue: r.last_out ? Math.floor((Date.now() - r.last_out) / 86_400_000) : null }));
  if (wantsCsv(c)) return csvResponse('slow-moving-stock', [['Product', 'Name', 'On hand', 'Unit', `Value (${settings.currency})`, 'Last issued', 'Last received', 'Days since issue'], ...list.map((r) => [r.number, r.name, r.onHand, r.uom, dollars(r.valueCents), r.lastIssued || 'never', r.lastReceived, r.daysSinceIssue ?? ''])]);
  return c.json({ days, rows: list, currency: settings.currency, totalCents: list.reduce((s, r) => s + r.valueCents, 0), note: `Products in stock with no issue, return to supplier or scrap in the last ${days} days.` });
});

// 10. Shortages: products whose available stock and open orders fall short of the reorder point or minimum.
stockReportRoutes.get('/c/:company/reports/shortages', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.uom, ps.reorder_point, ps.min_qty, ps.max_qty,
              (SELECT COALESCE(SUM(s.on_hand - s.reserved), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = p.company_id AND s.product_id = p.id AND l.kind <> 'quarantine') AS available,
              (SELECT COALESCE(SUM(s.reserved), 0) FROM erp_stock s WHERE s.company_id = p.company_id AND s.product_id = p.id) AS reserved,
              (SELECT COALESCE(SUM(pl.quantity - pl.received_qty), 0) FROM erp_po_lines pl JOIN erp_purchase_orders o ON o.company_id = pl.company_id AND o.id = pl.po_id WHERE pl.company_id = p.company_id AND pl.product_id = p.id AND o.status IN ('approved','sent','partially_received')) AS on_order,
              (SELECT MIN(o.required_date) FROM erp_po_lines pl JOIN erp_purchase_orders o ON o.company_id = pl.company_id AND o.id = pl.po_id WHERE pl.company_id = p.company_id AND pl.product_id = p.id AND o.status IN ('approved','sent','partially_received') AND pl.received_qty < pl.quantity) AS next_due
         FROM erp_products p JOIN erp_product_stock ps ON ps.company_id = p.company_id AND ps.product_id = p.id
        WHERE p.company_id = ? AND p.archived_at IS NULL AND (ps.reorder_point IS NOT NULL OR ps.min_qty IS NOT NULL) ORDER BY p.number COLLATE NOCASE`,
    )
    .bind(a.companyId)
    .all<any>();
  const list = rows.results
    .map((r) => {
      const level = Math.max(r.reorder_point ?? 0, r.min_qty ?? 0);
      const position = q6(Number(r.available) + Math.max(0, Number(r.on_order)));
      const target = r.max_qty ?? level;
      return { productId: r.id, number: r.number, name: r.name, uom: r.uom, available: q6(r.available), reserved: q6(r.reserved), onOrder: Math.max(0, q6(r.on_order)), reorderPoint: r.reorder_point, minQty: r.min_qty, maxQty: r.max_qty, shortfall: q6(Math.max(0, level - position)), suggestedOrder: q6(Math.max(0, target - position)), nextDue: r.next_due, below: position <= level };
    })
    .filter((r) => r.below);
  if (wantsCsv(c)) return csvResponse('stock-shortages', [['Product', 'Name', 'Available', 'Reserved', 'On order', 'Reorder point', 'Minimum', 'Maximum', 'Shortfall', 'Suggested order (to maximum)', 'Next order due', 'Unit'], ...list.map((r) => [r.number, r.name, r.available, r.reserved, r.onOrder, r.reorderPoint ?? '', r.minQty ?? '', r.maxQty ?? '', r.shortfall, r.suggestedOrder, r.nextDue ?? '', r.uom])]);
  return c.json({ rows: list, note: 'Available (outside quarantine, less reservations) plus open orders, against the higher of the reorder point and the minimum. Suggested order: up to the maximum, else the reorder level.' });
});

export const RELEASE2_REPORTS = [
  { key: 'purchase-commitments', title: 'Purchase commitments', help: 'What open purchase orders still owe' },
  { key: 'supplier-spend', title: 'Supplier spend', help: 'Orders placed and goods accepted per supplier' },
  { key: 'price-variance', title: 'Purchase price variance', help: 'Prices paid against standard costs' },
  { key: 'supplier-delivery', title: 'Supplier delivery performance', help: 'On time, in full and lead time from receipts' },
  { key: 'stock-on-hand', title: 'Stock on hand', help: 'Per product and warehouse' },
  { key: 'stock-valuation', title: 'Stock valuation', help: 'Quantity and value per product' },
  { key: 'stock-movements', title: 'Stock movements', help: 'The movement ledger with its documents' },
  { key: 'stock-ageing', title: 'Stock ageing', help: 'How long stock has been held, and what expires soon' },
  { key: 'slow-moving', title: 'Slow-moving stock', help: 'Stock with no issue for a while' },
  { key: 'shortages', title: 'Shortages', help: 'Below the reorder point or minimum' },
] as const;

