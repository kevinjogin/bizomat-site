// Maintenance reports (stage M2/M3 reliability reporting), under /api/maintenance/c/:company/reports/:name, for
// supervisors and administrators. Each takes a period (from and to, inclusive UTC days; 90 days to today by default) and
// a site, answers with the rows behind its figures (assets and work orders, for drill-down), and as CSV with
// ?format=csv. The formulas (also in docs/maintenance/README.md):
//
//   reliability  per asset, from failures: breakdown, emergency repair and corrective work orders (not cancelled) whose
//                downtime started in the period and has ended.
//                  downtime (h)     = sum of (downtime end - downtime start)
//                  MTTR (h)         = downtime / failures
//                  MTBF (h)         = (hours in the period - downtime) / failures
//                  availability (%) = (hours in the period - downtime) / hours in the period x 100
//   backlog      open work now (open, assigned, in progress, on hold), by priority and age since it was made
//                (0-7, 8-30, 31-90, over 90 days), with the estimated hours. The period does not apply.
//   pm-compliance preventive occurrences due in the period up to today: on time = completed (or closed) on or before
//                the due date (UTC date of completion); late = completed after it; missed = still open past its due
//                date; skipped = its work order was cancelled. Compliance (%) = on time / due x 100.
//   breakdowns   per month: breakdown and emergency repair work orders made, corrective work orders made, and failures
//                with their downtime (as in reliability). Work recorded after it was done counts in the month it was
//                done (its completion), not the month it was recorded, as its downtime does.
//   costs        per asset: labour cost (labour lines priced when recorded, by the date of the work), labour minutes
//                without a rate, parts cost (the stock ledger's value of parts issued less returned, by the date of the
//                movement), and their total. Its posting to Finance is planned, not built.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { csvResponse, dollars } from '../erp/util';
import { requireMt } from './access';
import { OUTSTANDING, sqlList, todayFrom, validDate } from './util';
import { DAY_MS, addDays, daysBetween, inSiteSql, r2, utcDate } from './m2util';

export const reportRoutes = new Hono<AppEnv>();

const FAILURE_TYPES = ['breakdown', 'emergency_repair', 'corrective'];
const BREAKDOWN_TYPES = ['breakdown', 'emergency_repair'];
const r1 = (n: number) => Math.round(n * 10) / 10;

function period(c: any) {
  const today = todayFrom(c.req.query('today'));
  const qTo = c.req.query('to') ?? '';
  const qFrom = c.req.query('from') ?? '';
  const to: string = validDate(qTo) ? qTo : today;
  const from: string = validDate(qFrom) ? qFrom : addDays(to, -89);
  if (from > to) throw new HttpError(400, 'The start date cannot be after the end date');
  if (daysBetween(from, to) > 3700) throw new HttpError(400, 'Choose a period of ten years or less');
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`) + DAY_MS;
  const site = (c.req.query('siteId') ?? '').slice(0, 64);
  return { today, from, to, start, end, hours: (end - start) / 3_600_000, site };
}

/** "AND the asset is in the site", with its argument. */
const siteFilter = (site: string, alias = 'a') => (site ? { sql: ` AND ${inSiteSql(alias)}`, args: [site] } : { sql: '', args: [] as string[] });

export async function reliability(db: D1Database, companyId: string, p: ReturnType<typeof period>) {
  const sf = siteFilter(p.site);
  const rows = await db
    .prepare(
      `SELECT a.id AS asset_id, a.number AS asset_number, a.name AS asset_name, w.id AS wo_id, w.number AS wo_number, w.job_type, d.started_at, d.ended_at
         FROM mt_downtime d JOIN mt_work_orders w ON w.company_id = d.company_id AND w.id = d.work_order_id
         JOIN mt_assets a ON a.company_id = d.company_id AND a.id = d.asset_id
        WHERE d.company_id = ? AND d.ended_at IS NOT NULL AND d.started_at >= ? AND d.started_at < ? AND w.job_type IN (${sqlList(FAILURE_TYPES)}) AND w.status <> 'cancelled'${sf.sql}
        ORDER BY a.number COLLATE NOCASE, d.started_at`,
    )
    .bind(companyId, p.start, p.end, ...sf.args)
    .all<any>();
  type Row = { assetId: string; assetNumber: string; assetName: string; failures: number; downtimeMinutes: number; workOrders: { id: string; number: string; jobType: string; startedAt: number; endedAt: number; minutes: number }[] };
  const byAsset = new Map<string, Row>();
  for (const r of rows.results) {
    const x: Row = byAsset.get(r.asset_id) ?? { assetId: r.asset_id, assetNumber: r.asset_number, assetName: r.asset_name, failures: 0, downtimeMinutes: 0, workOrders: [] };
    const minutes = (r.ended_at - r.started_at) / 60000;
    x.failures++;
    x.downtimeMinutes += minutes;
    x.workOrders.push({ id: r.wo_id, number: r.wo_number, jobType: r.job_type, startedAt: r.started_at, endedAt: r.ended_at, minutes: r2(minutes) });
    byAsset.set(r.asset_id, x);
  }
  const assets = [...byAsset.values()].map((x) => {
    const downtimeHours = x.downtimeMinutes / 60;
    return {
      ...x,
      downtimeMinutes: r2(x.downtimeMinutes),
      downtimeHours: r2(downtimeHours),
      mttrHours: r2(downtimeHours / x.failures),
      mtbfHours: r2((p.hours - downtimeHours) / x.failures),
      availabilityPct: r1(((p.hours - downtimeHours) / p.hours) * 100),
    };
  });
  const down = await db
    .prepare(`SELECT a.id, a.number, a.name, w.id AS wo_id, w.number AS wo_number, d.started_at FROM mt_downtime d JOIN mt_work_orders w ON w.company_id = d.company_id AND w.id = d.work_order_id JOIN mt_assets a ON a.company_id = d.company_id AND a.id = d.asset_id WHERE d.company_id = ? AND d.ended_at IS NULL${sf.sql} ORDER BY d.started_at`)
    .bind(companyId, ...sf.args)
    .all<any>();
  const failures = assets.reduce((s, x) => s + x.failures, 0);
  const downtimeHours = r2(assets.reduce((s, x) => s + x.downtimeMinutes, 0) / 60);
  return {
    periodHours: p.hours,
    assets,
    totals: { failures, downtimeHours, mttrHours: failures ? r2(downtimeHours / failures) : null },
    downNow: down.results.map((d) => ({ assetId: d.id, assetNumber: d.number, assetName: d.name, workOrderId: d.wo_id, workOrderNumber: d.wo_number, since: d.started_at })),
  };
}

export const AGE_BANDS = [
  { key: '0-7', label: '0 to 7 days', min: 0, max: 7 },
  { key: '8-30', label: '8 to 30 days', min: 8, max: 30 },
  { key: '31-90', label: '31 to 90 days', min: 31, max: 90 },
  { key: '91+', label: 'Over 90 days', min: 91, max: Infinity },
];
const PRIORITIES = ['urgent', 'high', 'medium', 'low'];

export async function backlog(db: D1Database, companyId: string, p: ReturnType<typeof period>) {
  const sf = siteFilter(p.site);
  const rows = await db
    .prepare(
      `SELECT w.id, w.number, w.description, w.priority, w.status, w.job_type, w.created_at, w.due_finish, w.estimated_minutes, a.id AS asset_id, a.number AS asset_number, a.name AS asset_name, u.name AS assignee
         FROM mt_work_orders w JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id LEFT JOIN users u ON u.id = w.assigned_to
        WHERE w.company_id = ? AND w.status IN (${sqlList(OUTSTANDING)})${sf.sql} ORDER BY w.created_at LIMIT 5000`,
    )
    .bind(companyId, ...sf.args)
    .all<any>();
  const matrix: Record<string, Record<string, { count: number; estimatedHours: number }>> = {};
  for (const pr of PRIORITIES) matrix[pr] = Object.fromEntries(AGE_BANDS.map((b) => [b.key, { count: 0, estimatedHours: 0 }]));
  const list = rows.results.map((w) => {
    const age = Math.max(0, daysBetween(utcDate(w.created_at), p.today));
    const band = AGE_BANDS.find((b) => age >= b.min && age <= b.max)!.key;
    const cell = matrix[w.priority]?.[band];
    if (cell) {
      cell.count++;
      cell.estimatedHours = r2(cell.estimatedHours + (w.estimated_minutes ?? 0) / 60);
    }
    return { id: w.id, number: w.number, description: w.description, priority: w.priority, status: w.status, jobType: w.job_type, assetId: w.asset_id, assetNumber: w.asset_number, assetName: w.asset_name, assignedToName: w.assignee ?? null, ageDays: age, band, dueFinish: w.due_finish, overdue: !!w.due_finish && w.due_finish < p.today, estimatedHours: w.estimated_minutes === null ? null : r2(w.estimated_minutes / 60) };
  });
  return {
    bands: AGE_BANDS.map((b) => ({ key: b.key, label: b.label })),
    matrix,
    totals: { count: list.length, overdue: list.filter((w) => w.overdue).length, estimatedHours: r2(list.reduce((s, w) => s + (w.estimatedHours ?? 0), 0)), byBand: Object.fromEntries(AGE_BANDS.map((b) => [b.key, list.filter((w) => w.band === b.key).length])), byPriority: Object.fromEntries(PRIORITIES.map((pr) => [pr, list.filter((w) => w.priority === pr).length])) },
    workOrders: list,
  };
}

export async function pmCompliance(db: D1Database, companyId: string, p: ReturnType<typeof period>) {
  const sf = siteFilter(p.site);
  const upTo = p.to < p.today ? p.to : p.today;
  const rows = await db
    .prepare(
      `SELECT o.due_date, o.due_meter, o.work_order_id, w.number, w.status, w.completed_at, s.id AS schedule_id, s.name, s.trigger_kind, a.id AS asset_id, a.number AS asset_number, a.name AS asset_name
         FROM mt_pm_occurrences o JOIN mt_work_orders w ON w.company_id = o.company_id AND w.id = o.work_order_id
         JOIN mt_pm_schedules s ON s.company_id = o.company_id AND s.id = o.schedule_id JOIN mt_assets a ON a.company_id = s.company_id AND a.id = s.asset_id
        WHERE o.company_id = ? AND o.due_date >= ? AND o.due_date <= ?${sf.sql} ORDER BY o.due_date, a.number COLLATE NOCASE`,
    )
    .bind(companyId, p.from, upTo, ...sf.args)
    .all<any>();
  const list = rows.results.map((o) => {
    const done = ['completed', 'closed'].includes(o.status) && o.completed_at;
    const doneDate = done ? utcDate(o.completed_at) : null;
    const outcome = done ? (doneDate! <= o.due_date ? 'on_time' : 'late') : o.status === 'cancelled' ? 'skipped' : 'missed';
    return { scheduleId: o.schedule_id, scheduleName: o.name, triggerKind: o.trigger_kind, assetId: o.asset_id, assetNumber: o.asset_number, assetName: o.asset_name, dueDate: o.due_date, workOrderId: o.work_order_id, workOrderNumber: o.number, status: o.status, completedDate: doneDate, outcome };
  });
  const count = (k: string) => list.filter((x) => x.outcome === k).length;
  return {
    upTo,
    due: list.length,
    onTime: count('on_time'),
    late: count('late'),
    missed: count('missed'),
    skipped: count('skipped'),
    compliancePct: list.length ? r1((count('on_time') / list.length) * 100) : null,
    occurrences: list,
  };
}

export async function breakdowns(db: D1Database, companyId: string, p: ReturnType<typeof period>) {
  const sf = siteFilter(p.site);
  // When a work order counts: when it was made, or for work recorded after it was done, when it was done.
  const dated = 'CASE WHEN w.recorded_done = 1 THEN COALESCE(w.completed_at, w.created_at) ELSE w.created_at END';
  const [made, failures] = await db.batch([
    db
      .prepare(`SELECT w.id, w.number, w.job_type, ${dated} AS dated_at FROM mt_work_orders w JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id WHERE w.company_id = ? AND ${dated} >= ? AND ${dated} < ? AND w.status <> 'cancelled' AND w.job_type IN (${sqlList(FAILURE_TYPES)})${sf.sql}`)
      .bind(companyId, p.start, p.end, ...sf.args),
    db
      .prepare(
        `SELECT d.started_at, d.ended_at FROM mt_downtime d JOIN mt_work_orders w ON w.company_id = d.company_id AND w.id = d.work_order_id JOIN mt_assets a ON a.company_id = d.company_id AND a.id = d.asset_id
          WHERE d.company_id = ? AND d.ended_at IS NOT NULL AND d.started_at >= ? AND d.started_at < ? AND w.job_type IN (${sqlList(FAILURE_TYPES)}) AND w.status <> 'cancelled'${sf.sql}`,
      )
      .bind(companyId, p.start, p.end, ...sf.args),
  ]);
  const months: string[] = [];
  for (let m = p.from.slice(0, 7); m <= p.to.slice(0, 7) && months.length < 130; ) {
    months.push(m);
    const [y, mm] = m.split('-').map(Number);
    m = mm === 12 ? `${y + 1}-01` : `${y}-${String(mm + 1).padStart(2, '0')}`;
  }
  const rows = months.map((month) => ({ month, breakdowns: 0, corrective: 0, failures: 0, downtimeHours: 0, workOrders: [] as { id: string; number: string; jobType: string }[] }));
  const at = (t: number) => rows.find((r) => r.month === utcDate(t).slice(0, 7));
  for (const w of made.results as any[]) {
    const r = at(w.dated_at);
    if (!r) continue;
    if (BREAKDOWN_TYPES.includes(w.job_type)) r.breakdowns++;
    else r.corrective++;
    if (r.workOrders.length < 100) r.workOrders.push({ id: w.id, number: w.number, jobType: w.job_type });
  }
  for (const d of failures.results as any[]) {
    const r = at(d.started_at);
    if (!r) continue;
    r.failures++;
    r.downtimeHours = r2(r.downtimeHours + (d.ended_at - d.started_at) / 3_600_000);
  }
  return { months: rows, totals: { breakdowns: rows.reduce((s, r) => s + r.breakdowns, 0), corrective: rows.reduce((s, r) => s + r.corrective, 0), failures: rows.reduce((s, r) => s + r.failures, 0), downtimeHours: r2(rows.reduce((s, r) => s + r.downtimeHours, 0)) } };
}

export async function assetCosts(db: D1Database, companyId: string, p: ReturnType<typeof period>) {
  const sf = siteFilter(p.site);
  const [labour, parts] = await db.batch([
    db
      .prepare(
        `SELECT a.id, a.number, a.name, COALESCE(SUM(k.cost_cents), 0) AS labour, SUM(CASE WHEN k.cost_cents IS NULL THEN k.minutes ELSE 0 END) AS unpriced, SUM(k.minutes) AS minutes, COUNT(DISTINCT w.id) AS wos
           FROM mt_labour_costs k JOIN mt_work_orders w ON w.company_id = k.company_id AND w.id = k.work_order_id JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id
          WHERE k.company_id = ? AND k.work_date >= ? AND k.work_date <= ?${sf.sql} GROUP BY a.id`,
      )
      .bind(companyId, p.from, p.to, ...sf.args),
    db
      .prepare(
        `SELECT a.id, a.number, a.name, COALESCE(SUM(-m.value_delta_cents), 0) AS parts, COUNT(DISTINCT w.id) AS wos
           FROM erp_stock_moves m JOIN mt_work_orders w ON w.company_id = m.company_id AND w.id = m.source_id JOIN mt_assets a ON a.company_id = w.company_id AND a.id = w.asset_id
          WHERE m.company_id = ? AND m.source_type = 'work_order' AND m.move_type IN ('maintenance_issue','maintenance_return') AND m.created_at >= ? AND m.created_at < ?${sf.sql} GROUP BY a.id`,
      )
      .bind(companyId, p.start, p.end, ...sf.args),
  ]);
  const by = new Map<string, { assetId: string; assetNumber: string; assetName: string; labourCents: number; labourMinutes: number; unpricedMinutes: number; partsCents: number; totalCents: number }>();
  const row = (r: any) => by.get(r.id) ?? { assetId: r.id, assetNumber: r.number, assetName: r.name, labourCents: 0, labourMinutes: 0, unpricedMinutes: 0, partsCents: 0, totalCents: 0 };
  for (const r of labour.results as any[]) by.set(r.id, { ...row(r), labourCents: r.labour, labourMinutes: r.minutes ?? 0, unpricedMinutes: r.unpriced ?? 0 });
  for (const r of parts.results as any[]) by.set(r.id, { ...row(r), partsCents: r.parts });
  const assets = [...by.values()].map((x) => ({ ...x, totalCents: x.labourCents + x.partsCents })).sort((x, y) => y.totalCents - x.totalCents || x.assetNumber.localeCompare(y.assetNumber));
  return {
    assets,
    totals: { labourCents: assets.reduce((s, x) => s + x.labourCents, 0), partsCents: assets.reduce((s, x) => s + x.partsCents, 0), totalCents: assets.reduce((s, x) => s + x.totalCents, 0), unpricedMinutes: assets.reduce((s, x) => s + x.unpricedMinutes, 0) },
    financePosting: 'Planned: maintenance costs are not posted to Finance yet.',
  };
}

const hoursText = (n: number | null) => (n === null ? '' : String(n));

reportRoutes.get('/c/:company/reports/:name', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const p = period(c);
  const csv = c.req.query('format') === 'csv';
  const name = c.req.param('name');
  const meta = { from: p.from, to: p.to, today: p.today, siteId: p.site || null };
  if (name === 'reliability') {
    const r = await reliability(db, a.companyId, p);
    if (csv) return csvResponse(`maintenance-reliability-${p.from}-${p.to}`, [['Asset', 'Name', 'Failures', 'Downtime (h)', 'MTTR (h)', 'MTBF (h)', 'Availability (%)', 'Work orders'], ...r.assets.map((x) => [x.assetNumber, x.assetName, x.failures, x.downtimeHours, x.mttrHours, x.mtbfHours, x.availabilityPct, x.workOrders.map((w) => w.number).join(' ')])]);
    return c.json({ ...meta, ...r });
  }
  if (name === 'backlog') {
    const r = await backlog(db, a.companyId, p);
    if (csv) return csvResponse(`maintenance-backlog-${p.today}`, [['Work order', 'Asset', 'Description', 'Priority', 'Status', 'Age (days)', 'Age band', 'Due finish', 'Overdue', 'Estimated (h)', 'Technician'], ...r.workOrders.map((w) => [w.number, w.assetNumber, w.description, w.priority, w.status, w.ageDays, w.band, w.dueFinish ?? '', w.overdue ? 'yes' : 'no', hoursText(w.estimatedHours), w.assignedToName ?? ''])]);
    return c.json({ ...meta, ...r });
  }
  if (name === 'pm-compliance') {
    const r = await pmCompliance(db, a.companyId, p);
    if (csv) return csvResponse(`maintenance-pm-compliance-${p.from}-${r.upTo}`, [['Due', 'Schedule', 'Asset', 'Work order', 'Status', 'Completed', 'Outcome'], ...r.occurrences.map((o) => [o.dueDate, o.scheduleName, o.assetNumber, o.workOrderNumber, o.status, o.completedDate ?? '', o.outcome.replace('_', ' ')])]);
    return c.json({ ...meta, ...r });
  }
  if (name === 'breakdowns') {
    const r = await breakdowns(db, a.companyId, p);
    if (csv) return csvResponse(`maintenance-breakdowns-${p.from}-${p.to}`, [['Month', 'Breakdowns and emergency repairs', 'Corrective work orders', 'Failures with downtime', 'Downtime (h)'], ...r.months.map((m) => [m.month, m.breakdowns, m.corrective, m.failures, m.downtimeHours])]);
    return c.json({ ...meta, ...r });
  }
  if (name === 'costs') {
    const r = await assetCosts(db, a.companyId, p);
    if (csv) return csvResponse(`maintenance-asset-costs-${p.from}-${p.to}`, [['Asset', 'Name', 'Labour', 'Labour (min)', 'Labour without a rate (min)', 'Parts', 'Total'], ...r.assets.map((x) => [x.assetNumber, x.assetName, dollars(x.labourCents), x.labourMinutes, x.unpricedMinutes, dollars(x.partsCents), dollars(x.totalCents)])]);
    return c.json({ ...meta, ...r });
  }
  throw new HttpError(404, 'Report not found');
});
