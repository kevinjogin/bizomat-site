// The field release, stream A (migration 0040; MEX a functional reference only): what the work order and request lists
// add (date, department, person, contractor and site filters, the due-today and due-this-week lists, unassigned work,
// paging and CSV files), the other open work on a request's asset, the dashboard's extra counts, and the statuses a
// requester may withdraw their own request from. Every count stays within what the person may see: supervisors and
// administrators see the whole company, others only their own work (access.ts).
//
// Dates: the browser sends getTimezoneOffset() as tzOffset, so "raised on 20 Nov" means the person's own 20 Nov. Without
// it the dates are UTC days, as before. "Due this week" runs from today to the Sunday on or after it.

import { requestScope, workOrderScope, type MtAccess } from './access';
import { DAY_MS, addDays, inSiteSql, r2 } from './m2util';
import { OPEN_REQUESTS, OUTSTANDING, likeOf, sqlList, validDate, type RequestStatus } from './util';

/** A requester may withdraw their own request from these statuses, while it has no work order. */
export const WITHDRAWABLE: RequestStatus[] = ['submitted', 'awaiting_approval', 'info_requested', 'approved'];

/** The most rows a list's CSV file holds. */
export const CSV_MAX = 5000;

/** The browser's getTimezoneOffset() (minutes, -840 to 840), or 0: UTC days. */
export function tzOffsetFrom(q: string | undefined): number {
  if (!q || !/^-?\d{1,3}$/.test(q.trim())) return 0;
  const n = Number(q.trim());
  return n >= -840 && n <= 840 ? n : 0;
}

/** The first millisecond of a local day (YYYY-MM-DD) in the time zone of the offset. */
export const dayStartMs = (date: string, tz: number) => Date.parse(`${date}T00:00:00Z`) + tz * 60_000;

/** A time as 'YYYY-MM-DD HH:MM' in the time zone of the offset. */
export const localStamp = (t: number | null | undefined, tz: number) => (t ? new Date(t - tz * 60_000).toISOString().slice(0, 16).replace('T', ' ') : '');

/** The Sunday on or after a date: the end of "due this week" (2026-11-20, a Friday, gives 2026-11-22). */
export function weekEndOf(today: string): string {
  const day = new Date(`${today}T00:00:00Z`).getUTCDay();
  return addDays(today, (7 - day) % 7);
}

/**
 * A request still to be dealt with (MEX's rule): waiting for a decision or for more information, or made into a work
 * order that is still outstanding. A request whose work order was cancelled is not outstanding.
 */
export const outstandingRequestSql = (alias: string) =>
  `(${alias}.status IN (${sqlList(OPEN_REQUESTS)}) OR (${alias}.status = 'converted' AND EXISTS (SELECT 1 FROM mt_work_orders xo WHERE xo.company_id = ${alias}.company_id AND xo.id = ${alias}.work_order_id AND xo.status IN (${sqlList(OUTSTANDING)}))))`;

/** "The due dates include a day up to `end`": bind the last day of the window, then its first. */
const dueWindowSql = (alias: string) => `COALESCE(${alias}.due_start, ${alias}.due_finish) <= ? AND COALESCE(${alias}.due_finish, ${alias}.due_start) >= ?`;

type Query = (k: string) => string;

/** A range of days on a time column (from and to inclusive, in the person's own days). */
function dayRange(where: string[], args: unknown[], column: string, from: string, to: string, tz: number) {
  if (validDate(from)) {
    where.push(`${column} >= ?`);
    args.push(dayStartMs(from, tz));
  }
  if (validDate(to)) {
    where.push(`${column} < ?`);
    args.push(dayStartMs(to, tz) + DAY_MS);
  }
}

/** The department chosen by id (exactly that department), else typed as text. */
function department(where: string[], args: unknown[], alias: string, qp: Query) {
  if (qp('departmentId')) {
    where.push(`${alias}.department_id = ?`);
    args.push(qp('departmentId').slice(0, 64));
  } else if (qp('department').trim()) {
    where.push(`${alias}.department = ? COLLATE NOCASE`);
    args.push(qp('department').trim().slice(0, 120));
  }
}

/** The work order list's filters added by the field release (alias w, the asset a). */
export function workOrderListFilters(qp: Query, today: string): { where: string[]; args: unknown[]; tz: number; weekEnd: string } {
  const where: string[] = [];
  const args: unknown[] = [];
  const tz = tzOffsetFrom(qp('tzOffset'));
  const weekEnd = weekEndOf(today);
  if (validDate(qp('dueStartFrom'))) {
    where.push('w.due_start >= ?');
    args.push(qp('dueStartFrom'));
  }
  if (validDate(qp('dueStartTo'))) {
    where.push('w.due_start <= ?');
    args.push(qp('dueStartTo'));
  }
  dayRange(where, args, 'w.created_at', qp('raisedFrom'), qp('raisedTo'), tz);
  dayRange(where, args, 'w.completed_at', qp('completedFrom'), qp('completedTo'), tz);
  if (qp('due') === 'today' || qp('due') === 'week') {
    where.push(dueWindowSql('w'));
    args.push(qp('due') === 'week' ? weekEnd : today, today);
  }
  if (qp('unassigned') === '1') where.push('w.assigned_to IS NULL');
  department(where, args, 'w', qp);
  if (qp('raisedBy')) {
    where.push('w.created_by = ?');
    args.push(qp('raisedBy').slice(0, 64));
  }
  if (qp('contractor').trim()) {
    where.push('w.contractor LIKE ?');
    args.push(likeOf(qp('contractor')));
  }
  return { where, args, tz, weekEnd };
}

/** The request list's filters added by the field release (alias r, the asset a, joined LEFT). */
export function requestListFilters(qp: Query): { where: string[]; args: unknown[]; tz: number } {
  const where: string[] = [];
  const args: unknown[] = [];
  const tz = tzOffsetFrom(qp('tzOffset'));
  if (qp('requestedBy')) {
    where.push('r.requested_by = ?');
    args.push(qp('requestedBy').slice(0, 64));
  }
  department(where, args, 'r', qp);
  if (qp('siteId')) {
    where.push(inSiteSql('a'));
    args.push(qp('siteId').slice(0, 64));
  }
  const status = qp('status');
  if (status === 'outstanding') where.push(outstandingRequestSql('r'));
  else if (status === 'withdrawn') where.push("r.status = 'closed' AND r.withdrawn_at IS NOT NULL");
  else if (status === 'wo_cancelled') where.push("r.status = 'converted' AND EXISTS (SELECT 1 FROM mt_work_orders cw WHERE cw.company_id = r.company_id AND cw.id = r.work_order_id AND cw.status = 'cancelled')");
  return { where, args, tz };
}

/**
 * The request list's extra columns: the other outstanding requests and work orders on the same asset, counted within
 * what the person may see (a request's own work order is not counted), and the asset's site. Bind `args` first.
 */
export function requestListColumns(a: MtAccess): { sql: string; args: unknown[] } {
  const rq = requestScope(a, 'oq');
  const wo = workOrderScope(a, 'ow');
  return {
    sql: `, (SELECT COUNT(*) FROM mt_requests oq WHERE oq.company_id = r.company_id AND oq.asset_id = r.asset_id AND oq.id <> r.id AND ${outstandingRequestSql('oq')} AND ${rq.sql}) AS other_open_requests,
      (SELECT COUNT(*) FROM mt_work_orders ow WHERE ow.company_id = r.company_id AND ow.asset_id = r.asset_id AND ow.id IS NOT r.work_order_id AND ow.status IN (${sqlList(OUTSTANDING)}) AND ${wo.sql}) AS other_open_work_orders,
      (SELECT st.code FROM mt_asset_sites xs JOIN mt_sites st ON st.company_id = xs.company_id AND st.id = xs.site_id WHERE xs.company_id = r.company_id AND xs.asset_id = r.asset_id) AS site_code`,
    args: [...rq.args, ...wo.args],
  };
}

// ------------------------------------------------------------------ CSV files

// The plain words of the fixed lists, as the screens show them (client/system/maintenance/api.ts).
export const WO_STATUS_TEXT: Record<string, string> = { open: 'Open', assigned: 'Assigned', in_progress: 'In progress', on_hold: 'On hold', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' };
export const REQUEST_STATUS_TEXT: Record<string, string> = {
  submitted: 'Submitted',
  awaiting_approval: 'Awaiting approval',
  approved: 'Approved',
  declined: 'Declined',
  info_requested: 'More information requested',
  converted: 'Work order made',
  completed: 'Completed',
  closed: 'Closed',
};
export const PRIORITY_TEXT: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };
export const JOB_TYPE_TEXT: Record<string, string> = {
  corrective: 'Corrective',
  preventive: 'Preventive',
  breakdown: 'Breakdown',
  inspection: 'Inspection',
  emergency_repair: 'Emergency repair',
  electrical: 'Electrical',
  mechanical: 'Mechanical',
  calibration: 'Calibration',
  planned_shutdown: 'Planned shutdown',
  general: 'General',
};

const hours = (minutes: number | null | undefined) => (minutes === null || minutes === undefined ? '' : r2(minutes / 60));

/** The work order list as CSV rows (header first). No costs. Rows from WO_LIST_SELECT. */
export function workOrderCsvRows(rows: any[], tz: number): unknown[][] {
  return [
    ['Number', 'Description', 'Asset', 'Asset name', 'Site', 'Job type', 'Priority', 'Status', 'Trade', 'Technician', 'Contractor', 'Department', 'Raised by', 'Raised', 'Due start', 'Due finish', 'Completed', 'Estimated (h)', 'Recorded (h)'],
    ...rows.map((w) => [
      w.number,
      w.description,
      w.asset_number ?? '',
      w.asset_name ?? '',
      w.site_code ?? '',
      JOB_TYPE_TEXT[w.job_type] ?? w.job_type,
      PRIORITY_TEXT[w.priority] ?? w.priority,
      WO_STATUS_TEXT[w.status] ?? w.status,
      w.trade,
      w.assignee_name ?? '',
      w.contractor,
      w.department_name ?? w.department,
      w.creator_name ?? '',
      localStamp(w.created_at, tz),
      w.due_start ?? '',
      w.due_finish ?? '',
      localStamp(w.completed_at, tz),
      hours(w.estimated_minutes),
      hours(w.actual_minutes ?? 0),
    ]),
  ];
}

/** The request list as CSV rows (header first). A withdrawn request says Withdrawn, with its reason. */
export function requestCsvRows(rows: any[], tz: number): unknown[][] {
  return [
    ['Number', 'Description', 'Status', 'Priority', 'Asset', 'Asset name', 'Site', 'Location', 'Department', 'Raised by', 'Raised', 'Requested-by date', 'Decided by', 'Decided', 'Decision or withdrawal note', 'Work order', 'Work order status', 'Completed', 'Closed'],
    ...rows.map((r) => [
      r.number,
      r.description,
      r.withdrawn_at ? 'Withdrawn' : (REQUEST_STATUS_TEXT[r.status] ?? r.status),
      PRIORITY_TEXT[r.priority] ?? r.priority,
      r.asset_number ?? '',
      r.asset_name ?? '',
      r.site_code ?? '',
      r.location,
      r.department_name ?? r.department,
      r.requester_name ?? '',
      localStamp(r.created_at, tz),
      r.needed_by ?? '',
      r.decider_name ?? '',
      localStamp(r.decided_at, tz),
      r.withdrawn_at ? r.withdraw_reason : r.decision_note,
      r.wo_number ?? '',
      r.wo_status ? (WO_STATUS_TEXT[r.wo_status] ?? r.wo_status) : '',
      localStamp(r.completed_at, tz),
      localStamp(r.closed_at, tz),
    ]),
  ];
}

// ------------------------------------------------------------------ the dashboard

/**
 * The overview's figures added by the field release, within the person's scope: outstanding work orders due today and
 * this week and those with no technician; new requests (submitted without needing approval) and outstanding requests.
 */
export async function overviewExtras(db: D1Database, a: MtAccess, today: string) {
  const weekEnd = weekEndOf(today);
  const wo = workOrderScope(a, 'w');
  const rq = requestScope(a, 'r');
  const [work, reqs] = await db.batch([
    db
      .prepare(
        `SELECT
           SUM(CASE WHEN ${dueWindowSql('w')} THEN 1 ELSE 0 END) AS due_today,
           SUM(CASE WHEN ${dueWindowSql('w')} THEN 1 ELSE 0 END) AS due_week,
           SUM(CASE WHEN w.assigned_to IS NULL THEN 1 ELSE 0 END) AS unassigned
         FROM mt_work_orders w WHERE w.company_id = ? AND w.status IN (${sqlList(OUTSTANDING)}) AND ${wo.sql}`,
      )
      .bind(today, today, weekEnd, today, a.companyId, ...wo.args),
    db
      .prepare(
        `SELECT
           SUM(CASE WHEN r.status = 'submitted' THEN 1 ELSE 0 END) AS new_requests,
           SUM(CASE WHEN ${outstandingRequestSql('r')} THEN 1 ELSE 0 END) AS outstanding
         FROM mt_requests r WHERE r.company_id = ? AND ${rq.sql}`,
      )
      .bind(a.companyId, ...rq.args),
  ]);
  const w = (work.results[0] ?? {}) as any;
  const r = (reqs.results[0] ?? {}) as any;
  return {
    newRequests: r.new_requests ?? 0,
    outstandingRequests: r.outstanding ?? 0,
    dueToday: w.due_today ?? 0,
    dueThisWeek: w.due_week ?? 0,
    unassigned: w.unassigned ?? 0,
    weekEnd,
  };
}
