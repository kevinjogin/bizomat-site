// BIZOMAT ERP, Release 3 reports (/api/erp/c/:company/reports/...): production output, work order progress, material
// consumption, labour utilisation, production variance, machine downtime, MRP suggestions and capacity load. Each takes
// the filters that fit it (dates, work centre, product, status), lists the records behind its numbers (the screen links
// each row to its record) and exports CSV (?format=csv). Numbers come only from the company's own records. Job
// profitability (Release 5) is its own report in supply-reports.ts: orders made to order for a sales order line.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { requireErp } from './access';
import { csvResponse, dollars, validDate, wantsCsv } from './util';
import { q6 } from './stock';
import { ELEMENT_LABELS, COST_ELEMENTS, MO_STATUS, OP_STATUS, REPORT_KINDS, SUGGESTION_KINDS, addDays, label, parseDays, todayIso, weekday, workCentreDTO } from './manufacturing';
import { capacityLoad, suggestionDTO } from './planning';

export const mfgReportRoutes = new Hono<AppEnv>();

const date = (c: any, k: string) => {
  const v = c.req.query(k);
  return v && validDate(v) ? (v as string) : null;
};
const startMs = (d: string) => Date.parse(`${d}T00:00:00Z`);
const day = (ms: number | null | undefined) => (ms ? new Date(ms).toISOString().slice(0, 10) : '');
const hours = (minutes: number) => Math.round((minutes / 60) * 100) / 100;

/** The date range of a report: from and to (inclusive), 30 days to today by default. */
function range(c: any) {
  const to = date(c, 'to') ?? todayIso();
  const from = date(c, 'from') ?? addDays(to, -29);
  return { from, to, fromMs: startMs(from), toMs: startMs(to) + 86_400_000 };
}

// 1. Production output: finished goods received from manufacturing orders, by date.
mfgReportRoutes.get('/c/:company/reports/production-output', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const where = ['x.company_id = ?', 'x.created_at >= ?', 'x.created_at < ?'];
  const args: unknown[] = [a.companyId, r.fromMs, r.toMs];
  if (c.req.query('productId')) {
    where.push('x.product_id = ?');
    args.push(c.req.query('productId'));
  }
  const rows = await c.env.DB.prepare(
    `SELECT x.id, x.number, x.quantity, x.value_cents, x.created_at, x.lot, mo.id AS mo_id, mo.number AS mo_number, mo.quantity AS planned, p.id AS product_id, p.number AS product_number, p.name AS product_name, p.uom
       FROM erp_mo_receipts x JOIN erp_mfg_orders mo ON mo.company_id = x.company_id AND mo.id = x.mo_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
      WHERE ${where.join(' AND ')} ORDER BY x.created_at DESC LIMIT 5000`,
  )
    .bind(...args)
    .all<any>();
  const list = rows.results.map((x) => ({ id: x.id, number: x.number, date: day(x.created_at), moId: x.mo_id, moNumber: x.mo_number, productId: x.product_id, productNumber: x.product_number, productName: x.product_name, uom: x.uom, quantity: q6(x.quantity), valueCents: x.value_cents, lot: x.lot }));
  if (wantsCsv(c)) return csvResponse('production-output', [['Date', 'Receipt', 'Manufacturing order', 'Product', 'Name', 'Quantity', 'Unit', 'Value', 'Lot'], ...list.map((x) => [x.date, x.number, x.moNumber, x.productNumber, x.productName, x.quantity, x.uom, dollars(x.valueCents), x.lot])]);
  const byProduct = new Map<string, { productId: string; number: string; name: string; uom: string; quantity: number; valueCents: number; receipts: number }>();
  for (const x of list) {
    const k = byProduct.get(x.productId) ?? { productId: x.productId, number: x.productNumber, name: x.productName, uom: x.uom, quantity: 0, valueCents: 0, receipts: 0 };
    k.quantity = q6(k.quantity + x.quantity);
    k.valueCents += x.valueCents;
    k.receipts++;
    byProduct.set(x.productId, k);
  }
  return c.json({ from: r.from, to: r.to, rows: list, byProduct: [...byProduct.values()], note: 'Finished goods received into stock from manufacturing orders, at their actual cost.' });
});

// 2. Work order progress: open manufacturing orders, their operations and dates.
mfgReportRoutes.get('/c/:company/reports/work-order-progress', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const status = c.req.query('status');
  const statuses = status && Object.hasOwn(MO_STATUS, status) ? [status] : ['draft', 'released', 'in_progress', 'completed'];
  const today = todayIso();
  const rows = await c.env.DB.prepare(
    `SELECT mo.id, mo.number, mo.status, mo.quantity, mo.completed_qty, mo.start_date, mo.required_date, mo.finish_date, mo.priority, p.number AS product_number, p.name AS product_name, p.uom,
            (SELECT COUNT(*) FROM erp_mo_operations o WHERE o.company_id = mo.company_id AND o.mo_id = mo.id) AS ops,
            (SELECT COUNT(*) FROM erp_mo_operations o WHERE o.company_id = mo.company_id AND o.mo_id = mo.id AND o.status = 'completed') AS ops_done,
            (SELECT o.op_no || ' ' || o.name || '|' || o.status FROM erp_mo_operations o WHERE o.company_id = mo.company_id AND o.mo_id = mo.id AND o.status <> 'completed' ORDER BY o.op_no LIMIT 1) AS current_op
       FROM erp_mfg_orders mo JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id
      WHERE mo.company_id = ? AND mo.status IN (${statuses.map(() => '?').join(',')}) ORDER BY COALESCE(mo.required_date, '9999'), mo.number LIMIT 5000`,
  )
    .bind(a.companyId, ...statuses)
    .all<any>();
  const list = rows.results.map((m) => {
    const [op, opStatus] = String(m.current_op ?? '').split('|');
    return {
      id: m.id,
      number: m.number,
      status: m.status,
      statusLabel: label(MO_STATUS, m.status),
      productNumber: m.product_number,
      productName: m.product_name,
      uom: m.uom,
      quantity: q6(m.quantity),
      completedQty: q6(m.completed_qty),
      progressPct: m.quantity > 0 ? Math.min(100, Math.round((m.completed_qty / m.quantity) * 100)) : 0,
      operations: `${m.ops_done} of ${m.ops}`,
      currentOperation: op ? `${op} (${label(OP_STATUS, opStatus)})` : '',
      startDate: m.start_date,
      requiredDate: m.required_date,
      finishDate: m.finish_date,
      late: ['draft', 'released', 'in_progress'].includes(m.status) && !!m.required_date && (m.required_date < today || (!!m.finish_date && m.finish_date > m.required_date)),
    };
  });
  if (wantsCsv(c)) return csvResponse('work-order-progress', [['Order', 'Product', 'Name', 'Status', 'Quantity', 'Completed', 'Progress %', 'Operations done', 'Current operation', 'Start', 'Required', 'Planned finish', 'Late'], ...list.map((m) => [m.number, m.productNumber, m.productName, m.statusLabel, m.quantity, m.completedQty, m.progressPct, m.operations, m.currentOperation, m.startDate ?? '', m.requiredDate ?? '', m.finishDate ?? '', m.late ? 'yes' : ''])]);
  return c.json({ rows: list, note: 'Late: required before today, or planned to finish after it is required.' });
});

// 3. Material consumption: materials issued to, returned from and scrapped against manufacturing orders, by product.
mfgReportRoutes.get('/c/:company/reports/material-consumption', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const rows = await c.env.DB.prepare(
    `SELECT m.product_id, p.number, p.name, p.uom,
            SUM(CASE WHEN m.move_type = 'production_issue' THEN -m.on_hand_delta ELSE 0 END) AS issued,
            SUM(CASE WHEN m.move_type = 'production_return' THEN m.on_hand_delta ELSE 0 END) AS returned,
            SUM(CASE WHEN m.move_type = 'production_scrap' THEN -m.on_hand_delta ELSE 0 END) AS scrapped,
            SUM(CASE WHEN m.move_type IN ('production_issue','production_return','production_scrap') THEN -m.value_delta_cents ELSE 0 END) AS value,
            COUNT(DISTINCT m.source_id) AS orders, group_concat(DISTINCT m.reference) AS refs
       FROM erp_stock_moves m JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id
      WHERE m.company_id = ? AND m.source_type = 'manufacturing_order' AND m.move_type IN ('production_issue','production_return','production_scrap') AND m.created_at >= ? AND m.created_at < ?
      GROUP BY m.product_id ORDER BY p.number COLLATE NOCASE LIMIT 5000`,
  )
    .bind(a.companyId, r.fromMs, r.toMs)
    .all<any>();
  const list = rows.results.map((x) => ({ productId: x.product_id, number: x.number, name: x.name, uom: x.uom, issued: q6(x.issued), returned: q6(x.returned), scrapped: q6(x.scrapped), net: q6(x.issued - x.returned + x.scrapped), valueCents: Number(x.value), orders: x.orders, references: String(x.refs ?? '').split(',').filter(Boolean).slice(0, 20) }));
  if (wantsCsv(c)) return csvResponse('material-consumption', [['Product', 'Name', 'Unit', 'Issued', 'Returned', 'Scrapped', 'Net used', 'Value', 'Orders'], ...list.map((x) => [x.number, x.name, x.uom, x.issued, x.returned, x.scrapped, x.net, dollars(x.valueCents), x.orders])]);
  return c.json({ from: r.from, to: r.to, rows: list, note: 'From the stock movement ledger: issued less returned, plus scrapped against an order, at the value of each movement.' });
});

// 4. Labour utilisation: labour and machine hours recorded per work centre and per person, against available hours.
mfgReportRoutes.get('/c/:company/reports/labour-utilisation', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const r = range(c);
  const centres = (await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ? AND archived_at IS NULL ORDER BY code COLLATE NOCASE').bind(a.companyId).all<any>()).results;
  const time = (
    await db
      .prepare(
        `SELECT o.work_centre_id, t.kind, t.user_id, u.name AS user_name, SUM(t.minutes) AS minutes, SUM(t.cost_cents) AS cost, SUM(CASE WHEN t.rework = 1 THEN t.minutes ELSE 0 END) AS rework
           FROM erp_mo_time t JOIN erp_mo_operations o ON o.company_id = t.company_id AND o.id = t.operation_id LEFT JOIN users u ON u.id = t.user_id
          WHERE t.company_id = ? AND t.minutes IS NOT NULL AND t.created_at >= ? AND t.created_at < ? GROUP BY o.work_centre_id, t.kind, t.user_id`,
      )
      .bind(a.companyId, r.fromMs, r.toMs)
      .all<any>()
  ).results;
  const days = Math.round((r.toMs - r.fromMs) / 86_400_000);
  const byCentre = centres.map((w) => {
    const wd = parseDays(w.working_days);
    let workingDays = 0;
    for (let i = 0; i < days; i++) if (wd.includes(weekday(addDays(r.from, i)))) workingDays++;
    const available = Math.round(workingDays * w.hours_per_day * w.machines * (w.efficiency_pct / 100) * 100) / 100;
    const mine = time.filter((t) => t.work_centre_id === w.id);
    const labour = hours(mine.filter((t) => t.kind === 'labour').reduce((s, t) => s + Number(t.minutes), 0));
    const machine = hours(mine.filter((t) => t.kind === 'machine').reduce((s, t) => s + Number(t.minutes), 0));
    const rework = hours(mine.reduce((s, t) => s + Number(t.rework), 0));
    return { ...workCentreDTO(w), availableHours: available, labourHours: labour, machineHours: machine, reworkHours: rework, labourCostCents: mine.filter((t) => t.kind === 'labour').reduce((s, t) => s + Number(t.cost), 0), utilisationPct: available > 0 ? Math.round((Math.max(labour, machine) / available) * 100) : null };
  });
  const people = new Map<string, { userId: string; name: string; labourHours: number; reworkHours: number }>();
  for (const t of time.filter((x) => x.kind === 'labour' && x.user_id)) {
    const p = people.get(t.user_id) ?? { userId: t.user_id, name: t.user_name ?? '', labourHours: 0, reworkHours: 0 };
    p.labourHours = Math.round((p.labourHours + Number(t.minutes) / 60) * 100) / 100;
    p.reworkHours = Math.round((p.reworkHours + Number(t.rework) / 60) * 100) / 100;
    people.set(t.user_id, p);
  }
  if (wantsCsv(c)) return csvResponse('labour-utilisation', [['Work centre', 'Name', 'Available hours', 'Labour hours', 'Machine hours', 'Rework hours', 'Labour cost', 'Utilisation %'], ...byCentre.map((w) => [w.code, w.name, w.availableHours, w.labourHours, w.machineHours, w.reworkHours, dollars(w.labourCostCents), w.utilisationPct ?? ''])]);
  return c.json({ from: r.from, to: r.to, workCentres: byCentre, people: [...people.values()].sort((x, y) => y.labourHours - x.labourHours), note: 'Hours recorded on operations against the work centre’s available hours (working days, hours per day, machines and efficiency). Utilisation uses the larger of labour and machine hours.' });
});

// 5. Production variance: closed manufacturing orders, estimated against actual by element.
mfgReportRoutes.get('/c/:company/reports/production-variance', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const rows = await c.env.DB.prepare(
    `SELECT mo.id, mo.number, mo.quantity, mo.completed_qty, mo.closed_at, mo.currency, p.number AS product_number, p.name AS product_name, k.element, k.estimated_cents, k.actual_cents, k.variance_cents
       FROM erp_mfg_orders mo JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id JOIN erp_mo_costs k ON k.company_id = mo.company_id AND k.mo_id = mo.id
      WHERE mo.company_id = ? AND mo.status = 'closed' AND mo.closed_at >= ? AND mo.closed_at < ? ORDER BY mo.closed_at DESC, mo.number LIMIT 20000`,
  )
    .bind(a.companyId, r.fromMs, r.toMs)
    .all<any>();
  const orders = new Map<string, any>();
  for (const x of rows.results) {
    const o = orders.get(x.id) ?? { id: x.id, number: x.number, productNumber: x.product_number, productName: x.product_name, quantity: q6(x.quantity), completedQty: q6(x.completed_qty), closedAt: x.closed_at, currency: x.currency, elements: {} as Record<string, { estimatedCents: number; actualCents: number; varianceCents: number }>, estimatedCents: 0, actualCents: 0, varianceCents: 0 };
    o.elements[x.element] = { estimatedCents: x.estimated_cents, actualCents: x.actual_cents, varianceCents: x.variance_cents };
    o.estimatedCents += x.estimated_cents;
    o.actualCents += x.actual_cents;
    o.varianceCents += x.variance_cents;
    orders.set(x.id, o);
  }
  const list = [...orders.values()];
  const totals = COST_ELEMENTS.map((k) => ({ element: k, label: ELEMENT_LABELS[k], estimatedCents: list.reduce((s, o) => s + (o.elements[k]?.estimatedCents ?? 0), 0), actualCents: list.reduce((s, o) => s + (o.elements[k]?.actualCents ?? 0), 0), varianceCents: list.reduce((s, o) => s + (o.elements[k]?.varianceCents ?? 0), 0) }));
  if (wantsCsv(c)) {
    return csvResponse('production-variance', [
      ['Order', 'Product', 'Name', 'Quantity', 'Completed', 'Closed', ...COST_ELEMENTS.flatMap((k) => [`${ELEMENT_LABELS[k]} estimated`, `${ELEMENT_LABELS[k]} actual`]), 'Estimated', 'Actual', 'Variance'],
      ...list.map((o) => [o.number, o.productNumber, o.productName, o.quantity, o.completedQty, day(o.closedAt), ...COST_ELEMENTS.flatMap((k) => [dollars(o.elements[k]?.estimatedCents ?? 0), dollars(o.elements[k]?.actualCents ?? 0)]), dollars(o.estimatedCents), dollars(o.actualCents), dollars(o.varianceCents)]),
    ]);
  }
  return c.json({ from: r.from, to: r.to, rows: list, totals, note: 'Orders closed in the period. Variance: actual less estimated; above zero costs more than estimated.', profitability: 'Job profitability is in its own report: orders made to order for a sales order line, their revenue against their actual cost.' });
});

// 6. Machine downtime: downtime reported on operations, by work centre and machine, with the reasons.
mfgReportRoutes.get('/c/:company/reports/machine-downtime', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const r = range(c);
  const where = ["x.company_id = ?", "x.kind = 'downtime'", 'x.created_at >= ?', 'x.created_at < ?'];
  const args: unknown[] = [a.companyId, r.fromMs, r.toMs];
  if (c.req.query('workCentreId')) {
    where.push('o.work_centre_id = ?');
    args.push(c.req.query('workCentreId'));
  }
  const rows = await c.env.DB.prepare(
    `SELECT x.id, x.minutes, x.reason, x.created_at, mo.id AS mo_id, mo.number AS mo_number, o.op_no, o.name AS op_name, w.id AS wc_id, w.code AS wc_code, w.name AS wc_name, m.code AS machine_code, u.name AS by_name
       FROM erp_mo_reports x JOIN erp_mo_operations o ON o.company_id = x.company_id AND o.id = x.operation_id JOIN erp_mfg_orders mo ON mo.company_id = x.company_id AND mo.id = x.mo_id
       LEFT JOIN erp_work_centres w ON w.company_id = o.company_id AND w.id = o.work_centre_id LEFT JOIN erp_machines m ON m.company_id = x.company_id AND m.id = x.machine_id LEFT JOIN users u ON u.id = x.created_by
      WHERE ${where.join(' AND ')} ORDER BY x.created_at DESC LIMIT 5000`,
  )
    .bind(...args)
    .all<any>();
  const list = rows.results.map((x) => ({ id: x.id, date: day(x.created_at), minutes: Math.round(x.minutes * 100) / 100, reason: x.reason, moId: x.mo_id, moNumber: x.mo_number, operation: `${x.op_no} ${x.op_name}`, workCentreId: x.wc_id, workCentre: x.wc_code ? `${x.wc_code} ${x.wc_name}` : '', machine: x.machine_code ?? '', byName: x.by_name ?? null }));
  if (wantsCsv(c)) return csvResponse('machine-downtime', [['Date', 'Work centre', 'Machine', 'Order', 'Operation', 'Minutes', 'Reason', 'By'], ...list.map((x) => [x.date, x.workCentre, x.machine, x.moNumber, x.operation, x.minutes, x.reason, x.byName ?? ''])]);
  const by = new Map<string, { key: string; workCentre: string; machine: string; minutes: number; events: number }>();
  for (const x of list) {
    const k = `${x.workCentre}|${x.machine}`;
    const v = by.get(k) ?? { key: k, workCentre: x.workCentre, machine: x.machine, minutes: 0, events: 0 };
    v.minutes = Math.round((v.minutes + x.minutes) * 100) / 100;
    v.events++;
    by.set(k, v);
  }
  const reasons = new Map<string, number>();
  for (const x of list) reasons.set(x.reason, Math.round(((reasons.get(x.reason) ?? 0) + x.minutes) * 100) / 100);
  return c.json({ from: r.from, to: r.to, rows: list, byMachine: [...by.values()].sort((x, y) => y.minutes - x.minutes), byReason: [...reasons.entries()].map(([reason, minutes]) => ({ reason, minutes })).sort((x, y) => y.minutes - x.minutes), note: `Downtime reported on the shop floor. ${label(REPORT_KINDS, 'downtime')} is recorded with its minutes and a reason.` });
});

// 7. MRP suggestions: the latest run's (or a chosen run's) suggestions, by kind and status.
mfgReportRoutes.get('/c/:company/reports/mrp-suggestions', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const runId = c.req.query('runId');
  const run = runId
    ? await db.prepare('SELECT id, number, run_date, created_at FROM erp_mrp_runs WHERE company_id = ? AND id = ?').bind(a.companyId, runId).first<any>()
    : await db.prepare('SELECT id, number, run_date, created_at FROM erp_mrp_runs WHERE company_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1').bind(a.companyId).first<any>();
  if (!run) {
    if (wantsCsv(c)) return csvResponse('mrp-suggestions', [['Kind', 'Product', 'Name', 'Quantity', 'Needed', 'Order or start by', 'Messages', 'Status']]);
    return c.json({ run: null, rows: [] });
  }
  const where = ['s.company_id = ?', 's.run_id = ?'];
  const args: unknown[] = [a.companyId, run.id];
  const kind = c.req.query('kind');
  if (kind && Object.hasOwn(SUGGESTION_KINDS, kind)) {
    where.push('s.kind = ?');
    args.push(kind);
  }
  const status = c.req.query('status');
  if (status && ['open', 'converted', 'dismissed'].includes(status)) {
    where.push('s.status = ?');
    args.push(status);
  }
  const rows = await db
    .prepare(`SELECT s.*, p.number AS product_number, p.name AS product_name, p.uom, su.legal_name AS supplier_name FROM erp_mrp_suggestions s JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id LEFT JOIN erp_suppliers su ON su.company_id = s.company_id AND su.id = s.supplier_id WHERE ${where.join(' AND ')} ORDER BY s.need_date, p.number LIMIT 5000`)
    .bind(...args)
    .all<any>();
  const list = rows.results.map(suggestionDTO);
  if (wantsCsv(c)) return csvResponse('mrp-suggestions', [['Kind', 'Product', 'Name', 'Quantity', 'Needed', 'Order or start by', 'Supplier', 'Order', 'Messages', 'Status', 'Converted to'], ...list.map((s) => [s.kindLabel, s.productNumber, s.productName, s.quantity, s.needDate ?? '', s.orderDate ?? '', s.supplierName ?? '', s.refNumber, s.messages.join(' '), s.status, s.convertedNumber])]);
  return c.json({ run: { id: run.id, number: run.number, runDate: run.run_date, createdAt: run.created_at }, rows: list });
});

// 8. Capacity load: the rough-cut load per work centre per week (planning.ts).
mfgReportRoutes.get('/c/:company/reports/capacity-load', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const weeks = Math.min(Math.max(Number(c.req.query('weeks')) || 8, 1), 26);
  const data = await capacityLoad(c.env.DB, a.companyId, weeks);
  if (wantsCsv(c)) {
    return csvResponse('capacity-load', [
      ['Work centre', 'Name', 'Week starting', 'Available hours', 'Manufacturing orders (hours)', 'MRP planned (hours)', 'Load (hours)', 'Load %', 'Overloaded'],
      ...data.workCentres.flatMap((w) => w.weeks.map((x) => [w.code, w.name, x.week, x.availableHours, x.firmHours, x.plannedHours, x.loadHours, x.loadPct ?? '', x.overload ? 'yes' : ''])),
    ]);
  }
  return c.json(data);
});
