// BIZOMAT ERP, Release 4 part A reports (/api/erp/c/:company/reports/...): inspection results, rejection rates by product
// and by supplier, supplier defects, the NCR register with its ageing, corrective action status and overdue actions,
// rework, and the cost of poor quality. Each takes the filters that fit it, lists the records behind its numbers (the
// screen links each row to its record) and exports CSV (?format=csv). Numbers come only from the company's own records.
//
// Rejection: a failed inspection rejects its lot (its quantity); a lot accepted on condition is not rejected. The cost
// of poor quality counts what the records hold: scrap at its value in the stock ledger (scrap and production scrap) and
// rework labour and machine time at its cost. Appraisal costs (inspection time is not recorded) and external failure
// costs (no sales orders or customer returns linked to quality before Release 5) are planned and say so.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { requireErp } from './access';
import { csvResponse, dollars, validDate, wantsCsv } from './util';
import { q6 } from './stock';
import { addDays, label, todayIso } from './manufacturing';
import { PLAN_KINDS, RESULTS } from './quality';
import { CAPA_KINDS, CAPA_STATUS, DISPOSITIONS, NCR_STATUS, SEVERITIES } from './ncr';

export const qualityReportRoutes = new Hono<AppEnv>();

const DAY = 86_400_000;
const date = (c: any, k: string) => {
  const v = c.req.query(k);
  return v && validDate(v) ? (v as string) : null;
};
const startMs = (d: string) => Date.parse(`${d}T00:00:00Z`);
const day = (ms: number | null | undefined) => (ms ? new Date(ms).toISOString().slice(0, 10) : '');
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : null);

/** The date range of a report: from and to (inclusive), the last 30 days by default. */
function range(c: any) {
  const to = date(c, 'to') ?? todayIso();
  const from = date(c, 'from') ?? addDays(to, -29);
  return { from, to, fromMs: startMs(from), toMs: startMs(to) + DAY };
}

// 1. Inspection results: completed inspections in the period, with totals by result and kind.
qualityReportRoutes.get('/c/:company/reports/inspection-results', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const where = ["i.company_id = ?", "i.status = 'completed'", 'i.completed_at >= ?', 'i.completed_at < ?'];
  const args: unknown[] = [a.companyId, r.fromMs, r.toMs];
  for (const [k, col] of [
    ['kind', 'i.kind'],
    ['result', 'i.result'],
    ['productId', 'i.product_id'],
    ['supplierId', 'i.supplier_id'],
  ] as const) {
    const v = c.req.query(k);
    if (v) {
      where.push(`${col} = ?`);
      args.push(v);
    }
  }
  const rows = await c.env.DB.prepare(
    `SELECT i.id, i.number, i.kind, i.result, i.quantity, i.lot, i.serial, i.completed_at, i.plan_label, p.id AS product_id, p.number AS product_number, p.name AS product_name, p.uom,
            s.id AS supplier_id, s.legal_name AS supplier_name, u.name AS inspector_name, r.number AS receipt_number, mo.number AS mo_number,
            (SELECT COUNT(*) FROM erp_qc_insp_chars ch WHERE ch.company_id = i.company_id AND ch.inspection_id = i.id AND ch.result = 'fail') AS failed_chars
       FROM erp_qc_inspections i LEFT JOIN erp_products p ON p.company_id = i.company_id AND p.id = i.product_id LEFT JOIN erp_suppliers s ON s.company_id = i.company_id AND s.id = i.supplier_id
       LEFT JOIN users u ON u.id = i.inspector_id LEFT JOIN erp_receipts r ON r.company_id = i.company_id AND r.id = i.receipt_id LEFT JOIN erp_mfg_orders mo ON mo.company_id = i.company_id AND mo.id = i.mo_id
      WHERE ${where.join(' AND ')} ORDER BY i.completed_at DESC LIMIT 5000`,
  )
    .bind(...args)
    .all<any>();
  const list = rows.results.map((i) => ({
    id: i.id,
    number: i.number,
    date: day(i.completed_at),
    kind: i.kind,
    kindLabel: label(PLAN_KINDS, i.kind),
    result: i.result,
    resultLabel: label(RESULTS, i.result),
    productId: i.product_id,
    productNumber: i.product_number ?? '',
    productName: i.product_name ?? '',
    uom: i.uom ?? '',
    supplierId: i.supplier_id,
    supplierName: i.supplier_name ?? '',
    quantity: i.quantity === null ? null : q6(i.quantity),
    lot: i.lot,
    reference: i.receipt_number ?? i.mo_number ?? '',
    plan: i.plan_label,
    failedCharacteristics: Number(i.failed_chars),
    inspectorName: i.inspector_name ?? '',
  }));
  if (wantsCsv(c)) return csvResponse('inspection-results', [['Date', 'Inspection', 'Kind', 'Result', 'Product', 'Name', 'Supplier', 'Quantity', 'Unit', 'Lot', 'Reference', 'Plan', 'Characteristics failed', 'Inspector'], ...list.map((i) => [i.date, i.number, i.kindLabel, i.resultLabel, i.productNumber, i.productName, i.supplierName, i.quantity ?? '', i.uom, i.lot, i.reference, i.plan, i.failedCharacteristics, i.inspectorName])]);
  const count = (f: (x: (typeof list)[number]) => boolean) => list.filter(f).length;
  const totals = { completed: list.length, passed: count((x) => x.result === 'passed'), failed: count((x) => x.result === 'failed'), conditional: count((x) => x.result === 'conditional') };
  const byKind = Object.keys(PLAN_KINDS)
    .map((k) => ({ kind: k, label: label(PLAN_KINDS, k), completed: count((x) => x.kind === k), passed: count((x) => x.kind === k && x.result === 'passed'), failed: count((x) => x.kind === k && x.result === 'failed'), conditional: count((x) => x.kind === k && x.result === 'conditional') }))
    .filter((k) => k.completed);
  return c.json({ from: r.from, to: r.to, rows: list, totals: { ...totals, passRatePct: pct(totals.passed, totals.completed) }, byKind, note: 'Completed inspections. The result is worked out from the readings and the limits; accepted on condition: a failed lot a quality manager accepted, with a reason.' });
});

// 2. Rejection rates by product and by supplier: inspections and inspected quantities against failed ones.
qualityReportRoutes.get('/c/:company/reports/rejection-rates', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const rows = await c.env.DB.prepare(
    `SELECT i.result, i.quantity, p.id AS product_id, p.number AS product_number, p.name AS product_name, p.uom, s.id AS supplier_id, s.number AS supplier_number, s.legal_name AS supplier_name
       FROM erp_qc_inspections i LEFT JOIN erp_products p ON p.company_id = i.company_id AND p.id = i.product_id LEFT JOIN erp_suppliers s ON s.company_id = i.company_id AND s.id = i.supplier_id
      WHERE i.company_id = ? AND i.status = 'completed' AND i.completed_at >= ? AND i.completed_at < ? LIMIT 20000`,
  )
    .bind(a.companyId, r.fromMs, r.toMs)
    .all<any>();
  type Row = { id: string; number: string; name: string; uom: string; inspections: number; passed: number; failed: number; conditional: number; inspectedQty: number; rejectedQty: number };
  const group = (key: (x: any) => [string, string, string, string] | null) => {
    const m = new Map<string, Row>();
    for (const x of rows.results) {
      const k = key(x);
      if (!k) continue;
      const g = m.get(k[0]) ?? { id: k[0], number: k[1], name: k[2], uom: k[3], inspections: 0, passed: 0, failed: 0, conditional: 0, inspectedQty: 0, rejectedQty: 0 };
      g.inspections++;
      if (x.result === 'passed') g.passed++;
      else if (x.result === 'failed') g.failed++;
      else g.conditional++;
      g.inspectedQty = q6(g.inspectedQty + Number(x.quantity ?? 0));
      if (x.result === 'failed') g.rejectedQty = q6(g.rejectedQty + Number(x.quantity ?? 0));
      m.set(k[0], g);
    }
    return [...m.values()].map((g) => ({ ...g, rejectionRatePct: pct(g.failed, g.inspections), quantityRatePct: pct(g.rejectedQty, g.inspectedQty) })).sort((x, y) => (y.rejectionRatePct ?? 0) - (x.rejectionRatePct ?? 0) || x.number.localeCompare(y.number));
  };
  const byProduct = group((x) => (x.product_id ? [x.product_id, x.product_number, x.product_name, x.uom] : null));
  const bySupplier = group((x) => (x.supplier_id ? [x.supplier_id, x.supplier_number, x.supplier_name, ''] : null));
  if (wantsCsv(c)) {
    const by = c.req.query('by') === 'supplier' ? bySupplier : byProduct;
    return csvResponse(`rejection-rates-by-${c.req.query('by') === 'supplier' ? 'supplier' : 'product'}`, [[c.req.query('by') === 'supplier' ? 'Supplier' : 'Product', 'Name', 'Inspections', 'Passed', 'Failed', 'Accepted on condition', 'Rejection rate %', 'Quantity inspected', 'Quantity rejected', 'Quantity rejected %'], ...by.map((g) => [g.number, g.name, g.inspections, g.passed, g.failed, g.conditional, g.rejectionRatePct ?? '', g.inspectedQty, g.rejectedQty, g.quantityRatePct ?? ''])]);
  }
  return c.json({ from: r.from, to: r.to, byProduct, bySupplier, note: 'Rejection rate: failed inspections of all completed ones. Quantity rejected: the lots of failed inspections. A lot accepted on condition is not counted as rejected.' });
});

/** A supplier's quality figures (read only), for the supplier page and the supplier defects report. */
export async function supplierQualityRows(db: D1Database, companyId: string, r: { fromMs: number; toMs: number; from: string; to: string }, supplierId?: string) {
  const sup = supplierId ? 'AND s.id = ?' : '';
  const args = (...x: unknown[]) => [...x, ...(supplierId ? [supplierId] : [])];
  const [rec, insp, ncr, ret] = await db.batch([
    db
      .prepare(
        `SELECT s.id, s.number, s.legal_name, COALESCE(SUM(x.received_qty), 0) AS received, COALESCE(SUM(x.damaged_qty + x.rejected_qty), 0) AS refused, COUNT(DISTINCT r.id) AS receipts
           FROM erp_receipts r JOIN erp_receipt_lines x ON x.company_id = r.company_id AND x.receipt_id = r.id JOIN erp_suppliers s ON s.company_id = r.company_id AND s.id = r.supplier_id
          WHERE r.company_id = ? AND r.received_date >= ? AND r.received_date <= ? ${sup} GROUP BY s.id`,
      )
      .bind(...args(companyId, r.from, r.to)),
    db
      .prepare(
        `SELECT s.id, s.number, s.legal_name, COUNT(*) AS inspections, SUM(CASE WHEN i.result = 'failed' THEN 1 ELSE 0 END) AS failed, SUM(CASE WHEN i.result = 'conditional' THEN 1 ELSE 0 END) AS conditional,
                SUM(CASE WHEN i.result = 'failed' THEN COALESCE(i.quantity, 0) ELSE 0 END) AS rejected
           FROM erp_qc_inspections i JOIN erp_suppliers s ON s.company_id = i.company_id AND s.id = i.supplier_id
          WHERE i.company_id = ? AND i.status = 'completed' AND i.completed_at >= ? AND i.completed_at < ? ${sup} GROUP BY s.id`,
      )
      .bind(...args(companyId, r.fromMs, r.toMs)),
    db
      .prepare(
        `SELECT s.id, s.number, s.legal_name, COUNT(*) AS ncrs, SUM(CASE WHEN n.status NOT IN ('closed','cancelled') THEN 1 ELSE 0 END) AS open, COALESCE(SUM(n.quantity), 0) AS affected
           FROM erp_qc_ncrs n JOIN erp_suppliers s ON s.company_id = n.company_id AND s.id = n.supplier_id
          WHERE n.company_id = ? AND n.status <> 'cancelled' AND n.created_at >= ? AND n.created_at < ? ${sup} GROUP BY s.id`,
      )
      .bind(...args(companyId, r.fromMs, r.toMs)),
    db
      .prepare(
        `SELECT s.id, s.number, s.legal_name, COALESCE(SUM(x.quantity), 0) AS returned, COALESCE(SUM((SELECT -COALESCE(SUM(m.value_delta_cents), 0) FROM erp_stock_moves m WHERE m.company_id = x.company_id AND m.group_id = x.group_id)), 0) AS value
           FROM erp_qc_ncr_actions x JOIN erp_qc_ncrs n ON n.company_id = x.company_id AND n.id = x.ncr_id JOIN erp_suppliers s ON s.company_id = n.company_id AND s.id = n.supplier_id
          WHERE x.company_id = ? AND x.action = 'supplier_return' AND x.created_at >= ? AND x.created_at < ? ${sup} GROUP BY s.id`,
      )
      .bind(...args(companyId, r.fromMs, r.toMs)),
  ]);
  const m = new Map<string, any>();
  const get = (x: any) => {
    let g = m.get(x.id);
    if (!g) m.set(x.id, (g = { supplierId: x.id, number: x.number, name: x.legal_name, receipts: 0, receivedQty: 0, refusedAtReceiptQty: 0, inspections: 0, failedInspections: 0, conditional: 0, rejectedQty: 0, ncrs: 0, openNcrs: 0, affectedQty: 0, returnedQty: 0, returnedValueCents: 0 }));
    return g;
  };
  for (const x of rec.results as any[]) Object.assign(get(x), { receipts: Number(x.receipts), receivedQty: q6(x.received), refusedAtReceiptQty: q6(x.refused) });
  for (const x of insp.results as any[]) Object.assign(get(x), { inspections: Number(x.inspections), failedInspections: Number(x.failed), conditional: Number(x.conditional), rejectedQty: q6(x.rejected) });
  for (const x of ncr.results as any[]) Object.assign(get(x), { ncrs: Number(x.ncrs), openNcrs: Number(x.open), affectedQty: q6(x.affected) });
  for (const x of ret.results as any[]) Object.assign(get(x), { returnedQty: q6(x.returned), returnedValueCents: Number(x.value) });
  return [...m.values()]
    .map((g) => ({ ...g, inspectionFailRatePct: pct(g.failedInspections, g.inspections), defectRatePct: pct(g.refusedAtReceiptQty + g.rejectedQty, g.receivedQty) }))
    .sort((x, y) => y.ncrs + y.failedInspections - (x.ncrs + x.failedInspections) || String(x.name).localeCompare(String(y.name)));
}

// 3. Supplier defects: refused at receipt, failed incoming and supplier inspections, NCRs and returns, per supplier.
qualityReportRoutes.get('/c/:company/reports/supplier-defects', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const list = await supplierQualityRows(c.env.DB, a.companyId, r, c.req.query('supplierId') || undefined);
  if (wantsCsv(c))
    return csvResponse('supplier-defects', [
      ['Supplier', 'Name', 'Receipts', 'Received', 'Damaged or rejected at receipt', 'Inspections', 'Failed', 'Accepted on condition', 'Quantity rejected by inspection', 'Defect rate %', 'NCRs', 'NCRs open', 'Quantity affected', 'Returned to supplier', 'Value returned'],
      ...list.map((g) => [g.number, g.name, g.receipts, g.receivedQty, g.refusedAtReceiptQty, g.inspections, g.failedInspections, g.conditional, g.rejectedQty, g.defectRatePct ?? '', g.ncrs, g.openNcrs, g.affectedQty, g.returnedQty, dollars(g.returnedValueCents)]),
    ]);
  return c.json({ from: r.from, to: r.to, rows: list, note: 'Defect rate: quantity damaged or rejected at receipt plus the lots of failed inspections, of the quantity received in the period. Receipts by received date; inspections by completion; NCRs by when they were raised.' });
});

// 4. NCR register and ageing.
qualityReportRoutes.get('/c/:company/reports/ncr-register', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const where = ['n.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status === 'open') where.push("n.status NOT IN ('closed','cancelled')");
  else if (status) {
    where.push('n.status = ?');
    args.push(status);
  }
  if (c.req.query('severity')) {
    where.push('n.severity = ?');
    args.push(c.req.query('severity'));
  }
  const from = date(c, 'from');
  const to = date(c, 'to');
  if (from) {
    where.push('n.created_at >= ?');
    args.push(startMs(from));
  }
  if (to) {
    where.push('n.created_at < ?');
    args.push(startMs(to) + DAY);
  }
  const rows = await c.env.DB.prepare(
    `SELECT n.*, p.number AS product_number, p.name AS product_name, s.legal_name AS supplier_name, u.name AS raised_by_name,
            (SELECT group_concat(d.kind || ':' || d.quantity) FROM erp_qc_dispositions d WHERE d.company_id = n.company_id AND d.ncr_id = n.id) AS dispositions,
            (SELECT COUNT(*) FROM erp_qc_capas x WHERE x.company_id = n.company_id AND x.ncr_id = n.id) AS capas
       FROM erp_qc_ncrs n LEFT JOIN erp_products p ON p.company_id = n.company_id AND p.id = n.product_id LEFT JOIN erp_suppliers s ON s.company_id = n.company_id AND s.id = n.supplier_id LEFT JOIN users u ON u.id = n.raised_by
      WHERE ${where.join(' AND ')} ORDER BY n.created_at DESC LIMIT 5000`,
  )
    .bind(...args)
    .all<any>();
  const t = Date.now();
  const list = rows.results.map((n) => {
    const end = n.closed_at ?? (n.status === 'cancelled' ? n.updated_at : t);
    const age = Math.max(0, Math.floor((end - n.created_at) / DAY));
    return {
      id: n.id,
      number: n.number,
      title: n.title,
      severity: n.severity,
      severityLabel: label(SEVERITIES, n.severity),
      status: n.status,
      statusLabel: label(NCR_STATUS, n.status),
      open: !['closed', 'cancelled'].includes(n.status),
      productNumber: n.product_number ?? '',
      productName: n.product_name ?? '',
      lot: n.lot,
      quantity: n.quantity === null ? null : q6(n.quantity),
      supplierName: n.supplier_name ?? '',
      raised: day(n.created_at),
      raisedByName: n.raised_by_name ?? '',
      closed: day(n.closed_at),
      ageDays: age,
      disposition: String(n.dispositions ?? '')
        .split(',')
        .filter(Boolean)
        .map((d) => `${label(DISPOSITIONS, d.split(':')[0])} ${q6(Number(d.split(':')[1]))}`)
        .join(', '),
      capas: Number(n.capas),
    };
  });
  if (wantsCsv(c)) return csvResponse('ncr-register', [['NCR', 'Title', 'Severity', 'Status', 'Product', 'Name', 'Lot', 'Quantity', 'Supplier', 'Raised', 'Raised by', 'Closed', 'Age (days)', 'Disposition', 'Corrective actions'], ...list.map((n) => [n.number, n.title, n.severityLabel, n.statusLabel, n.productNumber, n.productName, n.lot, n.quantity ?? '', n.supplierName, n.raised, n.raisedByName, n.closed, n.ageDays, n.disposition, n.capas])]);
  const open = list.filter((n) => n.open);
  const ageing = [
    { label: '0 to 7 days', count: open.filter((n) => n.ageDays <= 7).length },
    { label: '8 to 30 days', count: open.filter((n) => n.ageDays >= 8 && n.ageDays <= 30).length },
    { label: '31 to 90 days', count: open.filter((n) => n.ageDays >= 31 && n.ageDays <= 90).length },
    { label: 'Over 90 days', count: open.filter((n) => n.ageDays > 90).length },
  ];
  const byStatus = Object.keys(NCR_STATUS).map((s) => ({ status: s, label: label(NCR_STATUS, s), count: list.filter((n) => n.status === s).length })).filter((s) => s.count);
  const bySeverity = Object.keys(SEVERITIES).map((s) => ({ severity: s, label: label(SEVERITIES, s), count: list.filter((n) => n.severity === s).length, open: open.filter((n) => n.severity === s).length }));
  return c.json({ rows: list, ageing, byStatus, bySeverity, openCount: open.length, note: 'Age: days from raising to closing, or to today while open. Ageing counts the open NCRs.' });
});

// 5. Corrective and preventive actions: status and overdue.
qualityReportRoutes.get('/c/:company/reports/capa-status', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const today = todayIso();
  const where = ['x.company_id = ?'];
  const args: unknown[] = [a.companyId];
  if (c.req.query('status')) {
    where.push('x.status = ?');
    args.push(c.req.query('status'));
  }
  if (c.req.query('overdue') === '1') {
    where.push("x.status IN ('proposed','approved','in_progress') AND x.due_date IS NOT NULL AND x.due_date < ?");
    args.push(today);
  }
  const rows = await c.env.DB.prepare(
    `SELECT x.*, u.name AS responsible_name, n.number AS ncr_number FROM erp_qc_capas x LEFT JOIN users u ON u.id = x.responsible_id LEFT JOIN erp_qc_ncrs n ON n.company_id = x.company_id AND n.id = x.ncr_id
      WHERE ${where.join(' AND ')} ORDER BY COALESCE(x.due_date, '9999'), x.number LIMIT 5000`,
  )
    .bind(...args)
    .all<any>();
  const list = rows.results.map((x) => {
    const open = ['proposed', 'approved', 'in_progress'].includes(x.status);
    const overdue = open && !!x.due_date && x.due_date < today;
    return {
      id: x.id,
      number: x.number,
      kindLabel: label(CAPA_KINDS, x.kind),
      title: x.title,
      status: x.status,
      statusLabel: label(CAPA_STATUS, x.status),
      ncrId: x.ncr_id,
      ncrNumber: x.ncr_number ?? '',
      responsibleName: x.responsible_name ?? '',
      dueDate: x.due_date ?? '',
      overdue,
      daysOverdue: overdue ? Math.round((startMs(today) - startMs(x.due_date)) / DAY) : 0,
      effective: x.effective === null ? '' : x.effective ? 'yes' : 'no',
      approvalException: !!x.approval_sod,
      closureException: !!x.closure_sod,
    };
  });
  if (wantsCsv(c)) return csvResponse('capa-status', [['Action', 'Kind', 'Title', 'Status', 'NCR', 'Responsible', 'Due', 'Days overdue', 'Effective', 'Approved under the one-person exception', 'Closed under the one-person exception'], ...list.map((x) => [x.number, x.kindLabel, x.title, x.statusLabel, x.ncrNumber, x.responsibleName, x.dueDate, x.daysOverdue || '', x.effective, x.approvalException ? 'yes' : '', x.closureException ? 'yes' : ''])]);
  const byStatus = Object.keys(CAPA_STATUS).map((s) => ({ status: s, label: label(CAPA_STATUS, s), count: list.filter((x) => x.status === s).length }));
  return c.json({ rows: list, byStatus, overdue: list.filter((x) => x.overdue), note: 'Overdue: proposed, approved or in progress after its due date.' });
});

// 6. Rework: rework reported on the shop floor, rework time and its cost, and NCR rework and repair dispositions.
qualityReportRoutes.get('/c/:company/reports/rework', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const db = c.env.DB;
  const [reports, time, disps] = await db.batch([
    db
      .prepare(
        `SELECT x.id, x.quantity, x.reason, x.created_at, o.op_no, o.name AS op_name, mo.id AS mo_id, mo.number AS mo_number, p.number AS product_number, p.name AS product_name, p.uom
           FROM erp_mo_reports x JOIN erp_mo_operations o ON o.company_id = x.company_id AND o.id = x.operation_id JOIN erp_mfg_orders mo ON mo.company_id = x.company_id AND mo.id = x.mo_id JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id
          WHERE x.company_id = ? AND x.kind = 'rework' AND x.created_at >= ? AND x.created_at < ? ORDER BY x.created_at DESC LIMIT 5000`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
    db
      .prepare(
        `SELECT mo.id AS mo_id, mo.number AS mo_number, SUM(t.minutes) AS minutes, SUM(t.cost_cents + t.overhead_cents) AS cost FROM erp_mo_time t JOIN erp_mfg_orders mo ON mo.company_id = t.company_id AND mo.id = t.mo_id
          WHERE t.company_id = ? AND t.rework = 1 AND t.minutes IS NOT NULL AND t.created_at >= ? AND t.created_at < ? GROUP BY mo.id ORDER BY mo.number`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
    db
      .prepare(
        `SELECT d.kind, d.quantity, d.done_qty, n.id AS ncr_id, n.number AS ncr_number, n.title, n.dispositioned_at, p.number AS product_number, p.uom
           FROM erp_qc_dispositions d JOIN erp_qc_ncrs n ON n.company_id = d.company_id AND n.id = d.ncr_id LEFT JOIN erp_products p ON p.company_id = n.company_id AND p.id = n.product_id
          WHERE d.company_id = ? AND d.kind IN ('rework','repair') AND n.dispositioned_at >= ? AND n.dispositioned_at < ? ORDER BY n.dispositioned_at DESC`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
  ]);
  const shopFloor = (reports.results as any[]).map((x) => ({ id: x.id, date: day(x.created_at), moId: x.mo_id, moNumber: x.mo_number, opNo: x.op_no, operation: x.op_name, productNumber: x.product_number, productName: x.product_name, quantity: q6(x.quantity), uom: x.uom, reason: x.reason }));
  const timeRows = (time.results as any[]).map((x) => ({ moId: x.mo_id, moNumber: x.mo_number, hours: Math.round((Number(x.minutes) / 60) * 100) / 100, costCents: Number(x.cost) }));
  const ncrRows = (disps.results as any[]).map((x) => ({ ncrId: x.ncr_id, ncrNumber: x.ncr_number, title: x.title, date: day(x.dispositioned_at), kind: x.kind, kindLabel: label(DISPOSITIONS, x.kind), productNumber: x.product_number ?? '', quantity: q6(x.quantity), doneQty: q6(x.done_qty), uom: x.uom ?? '' }));
  if (wantsCsv(c))
    return csvResponse('rework', [
      ['Source', 'Date', 'Record', 'Detail', 'Product', 'Quantity', 'Hours', 'Cost'],
      ...shopFloor.map((x) => ['Shop floor', x.date, x.moNumber, `Operation ${x.opNo} ${x.operation}: ${x.reason}`, x.productNumber, x.quantity, '', '']),
      ...timeRows.map((x) => ['Rework time', '', x.moNumber, '', '', '', x.hours, dollars(x.costCents)]),
      ...ncrRows.map((x) => ['Nonconformance', x.date, x.ncrNumber, `${x.kindLabel}: ${x.title}`, x.productNumber, x.quantity, '', '']),
    ]);
  return c.json({
    from: r.from,
    to: r.to,
    shopFloor,
    time: timeRows,
    ncrs: ncrRows,
    totals: { reworkedQty: q6(shopFloor.reduce((s, x) => s + x.quantity, 0)), hours: Math.round(timeRows.reduce((s, x) => s + x.hours, 0) * 100) / 100, costCents: timeRows.reduce((s, x) => s + x.costCents, 0), ncrQty: q6(ncrRows.reduce((s, x) => s + x.quantity, 0)) },
    note: 'Rework reported at operations on the shop floor, rework labour and machine time at its cost with overheads, and the rework and repair dispositions of nonconformances.',
  });
});

// 7. Cost of poor quality: what the records hold (scrap at its stock value, rework time at its cost).
qualityReportRoutes.get('/c/:company/reports/cost-of-poor-quality', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const db = c.env.DB;
  const [scrap, rework, returns] = await db.batch([
    db
      .prepare(
        `SELECT m.move_type, CASE WHEN m.source_type = 'scrap' AND EXISTS (SELECT 1 FROM erp_qc_ncrs n WHERE n.company_id = m.company_id AND n.id = m.source_id) THEN 'ncr' ELSE m.source_type END AS source,
                p.id AS product_id, p.number AS product_number, p.name AS product_name, p.uom, SUM(-m.on_hand_delta) AS qty, SUM(-m.value_delta_cents) AS value
           FROM erp_stock_moves m JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id
          WHERE m.company_id = ? AND m.move_type IN ('scrap','production_scrap') AND m.created_at >= ? AND m.created_at < ?
          GROUP BY m.move_type, source, p.id ORDER BY value DESC`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
    db.prepare('SELECT COALESCE(SUM(t.minutes), 0) AS minutes, COALESCE(SUM(t.cost_cents + t.overhead_cents), 0) AS cost FROM erp_mo_time t WHERE t.company_id = ? AND t.rework = 1 AND t.minutes IS NOT NULL AND t.created_at >= ? AND t.created_at < ?').bind(a.companyId, r.fromMs, r.toMs),
    db
      .prepare(
        `SELECT COALESCE(SUM(-m.on_hand_delta), 0) AS qty, COALESCE(SUM(-m.value_delta_cents), 0) AS value FROM erp_stock_moves m
          WHERE m.company_id = ? AND m.move_type = 'supplier_return' AND m.created_at >= ? AND m.created_at < ? AND EXISTS (SELECT 1 FROM erp_qc_ncrs n WHERE n.company_id = m.company_id AND n.id = m.source_id)`,
      )
      .bind(a.companyId, r.fromMs, r.toMs),
  ]);
  const SOURCE_LABELS: Record<string, string> = { ncr: 'Scrapped under a nonconformance', manufacturing_order: 'Scrapped in production', scrap: 'Scrapped in the warehouse' };
  const scrapRows = (scrap.results as any[]).map((x) => ({ source: x.source, sourceLabel: SOURCE_LABELS[x.source] ?? (x.move_type === 'production_scrap' ? SOURCE_LABELS.manufacturing_order : 'Scrap'), productId: x.product_id, productNumber: x.product_number, productName: x.product_name, uom: x.uom, quantity: q6(x.qty), valueCents: Number(x.value) }));
  const rw = (rework.results[0] ?? {}) as any;
  const ret = (returns.results[0] ?? {}) as any;
  const scrapCents = scrapRows.reduce((s, x) => s + x.valueCents, 0);
  const reworkCents = Number(rw.cost ?? 0);
  if (wantsCsv(c))
    return csvResponse('cost-of-poor-quality', [
      ['Element', 'Product', 'Name', 'Quantity', 'Value'],
      ...scrapRows.map((x) => [x.sourceLabel, x.productNumber, x.productName, x.quantity, dollars(x.valueCents)]),
      ['Rework labour and machine time', '', '', Math.round((Number(rw.minutes ?? 0) / 60) * 100) / 100, dollars(reworkCents)],
      ['Total internal failure', '', '', '', dollars(scrapCents + reworkCents)],
    ]);
  return c.json({
    from: r.from,
    to: r.to,
    scrap: scrapRows,
    rework: { hours: Math.round((Number(rw.minutes ?? 0) / 60) * 100) / 100, costCents: reworkCents },
    totals: { scrapCents, reworkCents, internalFailureCents: scrapCents + reworkCents },
    returnedToSuppliers: { quantity: q6(Number(ret.qty ?? 0)), valueCents: Number(ret.value ?? 0), note: 'Goods returned to suppliers under nonconformances, at their stock value. Not counted as a cost: a supplier may credit them, and credits are not recorded here.' },
    planned: ['Appraisal costs: inspection time is not recorded.', 'External failure costs: there are no sales orders or customer returns linked to quality before Release 5.'],
    note: 'Internal failure costs only, from the company’s own records: scrap at its value in the stock movement ledger, and rework time at its cost with overheads.',
  });
});

/** The supplier page's quality figures over the last year (read only). */
export async function supplierQuality(db: D1Database, companyId: string, supplierId: string) {
  const to = todayIso();
  const from = addDays(to, -364);
  const rows = await supplierQualityRows(db, companyId, { from, to, fromMs: startMs(from), toMs: startMs(to) + DAY }, supplierId);
  const g = rows[0];
  return {
    from,
    to,
    inspections: g?.inspections ?? 0,
    failedInspections: g?.failedInspections ?? 0,
    inspectionFailRatePct: g?.inspectionFailRatePct ?? null,
    rejectedQty: g?.rejectedQty ?? 0,
    ncrs: g?.ncrs ?? 0,
    openNcrs: g?.openNcrs ?? 0,
    returnedQty: g?.returnedQty ?? 0,
    note: 'Quality over the last year, read from inspections and nonconformances: failed incoming and supplier inspections, NCRs raised against the supplier, and goods returned to it.',
  };
}
