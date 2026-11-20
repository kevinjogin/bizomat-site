// Domain rules of the modules framework that a definition cannot say: computed fields (working days of leave, hours,
// depreciation, book value, response due dates, consumption, claim amounts, payroll totals...), checks across fields and
// records (leave balances, timesheet dates, contract parties), and what a step changes elsewhere (a calibration moves its
// instrument's due date or takes it out of service). All on the server; the screens only show the results.

import type { Env } from '../../env';
import { HttpError, parseJson } from '../../lib/util';
import type { ErpAccess } from '../access';
import { badState } from '../util';
import type { ObjAccess, RecordRow, Data, Line } from './engine';
import { OBJECT_BY_KEY, type ObjectDef, type TransitionDef } from '../../../shared/erp-objects';

export interface HookCtx {
  env: Env;
  db: D1Database;
  a: ErpAccess;
  user: { id: string; name: string };
  def: ObjectDef;
  x: ObjAccess;
  data: Data;
  lines: Line[] | null;
  beforeLines: Line[] | null;
  before: RecordRow | null;
  /** Reference labels by field (ref fields of the record). */
  labels: Record<string, string>;
  today: string;
  recordId: string;
}

export interface StepCtx extends HookCtx {
  t: TransitionDef;
  row: RecordRow;
  note: string | null;
}

// ------------------------------------------------------------------ dates and numbers

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** The same day n months on (the month's last day when it has fewer days). */
export function addMonths(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const total = y * 12 + (m - 1) + n;
  const ny = Math.floor(total / 12);
  const nm = total % 12;
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  return `${ny}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

/** Monday to Friday between two dates, both included. */
export function workingDays(from: string, to: string): number {
  if (to < from) return 0;
  let n = 0;
  const d = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`).getTime();
  for (let i = 0; i < 3700 && d.getTime() <= end; i++) {
    const w = d.getUTCDay();
    if (w !== 0 && w !== 6) n++;
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return n;
}

/** n working days after a date (Monday to Friday). */
export function addWorkingDays(date: string, n: number): string {
  let d = date;
  let left = n;
  for (let i = 0; i < 400 && left > 0; i++) {
    d = addDays(d, 1);
    const w = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (w !== 0 && w !== 6) left--;
  }
  return d;
}

/** Whole months between two dates (from the first's month to the second's, both included). */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let [y, m] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  for (let i = 0; i < 600 && (y < ty || (y === ty && m <= tm)); i++) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}

export const monthEnd = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
};

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

function minutesOf(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Another framework record of the company, with its fields. */
export async function getObj(db: D1Database, companyId: string, object: string, id: unknown): Promise<{ row: RecordRow; data: Data } | null> {
  if (typeof id !== 'string' || !id) return null;
  const row = await db.prepare('SELECT * FROM erp_objects WHERE company_id = ? AND object = ? AND id = ?').bind(companyId, object, id).first<RecordRow>();
  return row ? { row, data: parseJson<Data>(row.data_json, {}) } : null;
}

function order(a: unknown, b: unknown, msg: string) {
  if (typeof a === 'string' && typeof b === 'string' && b < a) throw new HttpError(400, msg);
}

/** A reference's label without its record number (EMP-00001 Riley Stone is Riley Stone), for summaries. */
const label = (ctx: HookCtx, k: string) => (ctx.labels[k] ?? '').replace(/^[A-Z]{1,6}-\d{3,}\s+/, '');
const opt = (ctx: HookCtx, k: string) => {
  const f = ctx.def.fields.find((x) => x.key === k);
  return f?.options?.[str(ctx.data[k])] ?? str(ctx.data[k]);
};

// ------------------------------------------------------------------ depreciation

export interface DepRow {
  month: string;
  depreciation: number;
  accumulated: number;
  bookValue: number;
}

/** Monthly depreciation from the start month to the end of the useful life, never below the residual value. */
export function depreciationSchedule(d: Data): DepRow[] {
  const cost = num(d.cost);
  const residual = Math.min(num(d.residualValue), cost);
  const life = Math.max(1, Math.round(num(d.usefulLifeMonths)));
  const start = str(d.depreciationStart) || str(d.acquisitionDate);
  if (!start || cost <= 0) return [];
  const base = cost - residual;
  const out: DepRow[] = [];
  let acc = 0;
  const months = monthsBetween(start, addMonths(start, life - 1));
  const dvRate = d.method === 'diminishing_value' ? (num(d.dvRatePct) > 0 ? num(d.dvRatePct) / 100 : 2 / (life / 12)) : 0;
  for (let i = 0; i < months.length; i++) {
    let dep: number;
    if (d.method === 'diminishing_value') dep = i === months.length - 1 ? base - acc : Math.round(((cost - acc) * dvRate) / 12);
    else dep = i === months.length - 1 ? base - acc : Math.round(base / life);
    dep = Math.max(0, Math.min(dep, base - acc));
    acc += dep;
    out.push({ month: months[i], depreciation: dep, accumulated: acc, bookValue: cost - acc });
  }
  return out;
}

/** Depreciation to the end of the month before a date (whole months). */
export function accumulatedAt(d: Data, date: string): number {
  const ym = date.slice(0, 7);
  let acc = 0;
  for (const r of depreciationSchedule(d)) if (r.month < ym) acc = r.accumulated;
  return acc;
}

// ------------------------------------------------------------------ computed fields (before every save)

type Compute = (ctx: HookCtx) => Promise<void> | void;

async function employeeOf(ctx: HookCtx, field = 'employee') {
  return getObj(ctx.db, ctx.a.companyId, 'hr_employee', ctx.data[field]);
}

const COMPUTE: Record<string, Compute> = {
  hr_leave: async (ctx) => {
    const d = ctx.data;
    order(d.fromDate, d.toDate, 'The leave ends before it starts');
    if (d.halfDay && d.fromDate !== d.toDate) throw new HttpError(400, 'Half a day is for leave of one day');
    const days = typeof d.fromDate === 'string' && typeof d.toDate === 'string' ? workingDays(d.fromDate, d.toDate) : 0;
    d.days = d.halfDay ? Math.min(days, 0.5) : days;
    if (!d.days) throw new HttpError(400, 'The leave has no working days (Monday to Friday)');
    const emp = await employeeOf(ctx);
    d.approver = (emp?.data.manager as string | null) ?? null;
    d.summary = `${label(ctx, 'employee')}: ${label(ctx, 'leaveType')}, ${d.fromDate}${d.toDate !== d.fromDate ? ` to ${d.toDate}` : ''}`;
  },
  hr_attendance: (ctx) => {
    const d = ctx.data;
    if (typeof d.clockIn === 'string' && typeof d.clockOut === 'string') {
      const mins = minutesOf(d.clockOut) - minutesOf(d.clockIn) - num(d.breakMinutes);
      if (minutesOf(d.clockOut) <= minutesOf(d.clockIn)) throw new HttpError(400, 'Clock out is before clock in');
      if (mins < 0) throw new HttpError(400, 'The break is longer than the time worked');
      d.hours = round2(mins / 60);
    } else d.hours = null;
    d.summary = `${label(ctx, 'employee')}: ${d.date}`;
  },
  ob_checklist: (ctx) => {
    const lines = ctx.lines ?? [];
    ctx.data.progress = lines.length ? Math.round((lines.filter((l) => l.done === true).length / lines.length) * 100) : 0;
    ctx.data.summary = `${opt(ctx, 'kind')}: ${label(ctx, 'employee')}`;
  },
  tr_record: async (ctx) => {
    const d = ctx.data;
    const course = await getObj(ctx.db, ctx.a.companyId, 'tr_course', d.course);
    const months = num(course?.data.validityMonths);
    d.expiryDate = typeof d.completedDate === 'string' && months > 0 && d.result !== 'failed' ? addMonths(d.completedDate, months) : null;
    d.summary = `${label(ctx, 'employee')}: ${label(ctx, 'course')}`;
  },
  pf_review: (ctx) => {
    const d = ctx.data;
    order(d.periodFrom, d.periodTo, 'The period ends before it starts');
    const lines = ctx.lines ?? [];
    // the person rates themselves and the reviewer rates: each changes only their own column, unless they hold an HR role
    if (ctx.before && ctx.beforeLines && !ctx.x.edit) {
      const own = ctx.before.owner_user_id === ctx.a.userId;
      const reviewer = ctx.before.approver_id === ctx.a.userId;
      const status = ctx.before.status;
      if (lines.length !== ctx.beforeLines.length) throw new HttpError(403, 'Only HR changes the objectives');
      lines.forEach((l, i) => {
        const b = ctx.beforeLines![i];
        for (const k of Object.keys(l)) {
          const mine = (own && status === 'self_assessment' && k === 'selfRating') || (reviewer && status === 'manager_review' && (k === 'managerRating' || k === 'comment'));
          if (!mine) l[k] = b[k] ?? null;
        }
      });
      if (own && !reviewer) d.comments = ctx.before ? (parseJson<Data>(ctx.before.data_json, {}).comments ?? null) : d.comments;
    }
    const rated = lines.filter((l) => typeof l.managerRating === 'number');
    const weight = rated.reduce((s, l) => s + num(l.weight), 0);
    d.overallScore = rated.length ? round1(weight > 0 ? rated.reduce((s, l) => s + num(l.managerRating) * num(l.weight), 0) / weight : rated.reduce((s, l) => s + num(l.managerRating), 0) / rated.length) : null;
    d.summary = `${label(ctx, 'employee')}: ${d.periodFrom} to ${d.periodTo}`;
  },
  py_run: (ctx) => {
    const d = ctx.data;
    order(d.periodStart, d.periodEnd, 'The period ends before it starts');
    const lines = ctx.lines ?? [];
    for (const l of lines) l.net = Math.max(0, num(l.gross) - num(l.withheld) - num(l.deductions));
    d.totalGross = lines.reduce((s, l) => s + num(l.gross), 0);
    d.totalNet = lines.reduce((s, l) => s + num(l.net), 0);
    d.summary = `${opt(ctx, 'frequency')} pay, ${d.periodStart} to ${d.periodEnd}`;
  },
  mk_campaign: (ctx) => {
    const d = ctx.data;
    order(d.startDate, d.endDate, 'The campaign ends before it starts');
    d.costPerLead = num(d.leadsGenerated) > 0 && d.actualCost !== null && d.actualCost !== undefined ? Math.round(num(d.actualCost) / num(d.leadsGenerated)) : null;
    d.roiPct = num(d.actualCost) > 0 ? round1(((num(d.revenueWon) - num(d.actualCost)) / num(d.actualCost)) * 100) : null;
  },
  ct_contract: (ctx) => {
    const d = ctx.data;
    order(d.startDate, d.endDate, 'The contract ends before it starts');
    if (d.partyType === 'customer' && !d.customer) throw new HttpError(400, 'Choose the customer');
    if (d.partyType === 'supplier' && !d.supplier) throw new HttpError(400, 'Choose the supplier');
    if (d.partyType === 'other' && !d.otherParty) throw new HttpError(400, 'Name the other party');
    d.noticeDate = typeof d.endDate === 'string' ? addDays(d.endDate, -num(d.noticeDays)) : null;
  },
  pr_pricelist: (ctx) => order(ctx.data.validFrom, ctx.data.validTo, 'The price list ends before it starts'),
  pr_promotion: (ctx) => {
    order(ctx.data.validFrom, ctx.data.validTo, 'The promotion ends before it starts');
    if (ctx.data.discountType === 'percent' && num(ctx.data.discountValue) > 100) throw new HttpError(400, 'A percentage discount is at most 100');
  },
  cm_statement: async (ctx) => {
    const d = ctx.data;
    order(d.periodFrom, d.periodTo, 'The period ends before it starts');
    const plan = await getObj(ctx.db, ctx.a.companyId, 'cm_plan', d.plan);
    d.salesperson = (plan?.data.salesperson as string | null) ?? null;
    d.total = (ctx.lines ?? []).reduce((s, l) => s + num(l.commission), 0);
    d.summary = `${label(ctx, 'plan')}: ${d.periodFrom} to ${d.periodTo}`;
  },
  sv_ticket: (ctx) => {
    const d = ctx.data;
    const days = { urgent: 0, high: 1, normal: 2, low: 5 }[str(d.priority)] ?? 2;
    const from = ctx.before ? new Date(ctx.before.created_at).toISOString().slice(0, 10) : ctx.today;
    d.responseDue = addWorkingDays(from, days);
  },
  sv_job: (ctx) => {
    const d = ctx.data;
    if (typeof d.startTime === 'string' && typeof d.endTime === 'string' && minutesOf(d.endTime) <= minutesOf(d.startTime)) throw new HttpError(400, 'The job ends before it starts');
    d.amount = d.chargeable === false ? 0 : Math.round(num(d.hoursWorked) * num(d.labourRate)) + num(d.partsCost);
  },
  sb_subscription: (ctx) => {
    const d = ctx.data;
    const months = { monthly: 1, quarterly: 3, yearly: 12 }[str(d.interval)] ?? 1;
    d.mrr = Math.round(num(d.amount) / months);
    order(d.startDate, d.endDate, 'The subscription ends before it starts');
  },
  fx_rate: (ctx) => {
    const d = ctx.data;
    if (d.fromCurrency && d.fromCurrency === d.toCurrency) throw new HttpError(400, 'Choose two different currencies');
    if (!(num(d.rate) > 0)) throw new HttpError(400, 'The rate is more than zero');
    d.summary = `1 ${d.fromCurrency} = ${d.rate} ${d.toCurrency} on ${d.date}`;
  },
  wf_rule: (ctx) => {
    const d = ctx.data;
    const target = OBJECT_BY_KEY[str(d.object)];
    if (!target || !target.statuses.some((s) => s.key === d.status)) throw new HttpError(400, `Status: use one of ${target ? target.statuses.map((s) => s.key).join(', ') : 'the module’s statuses'}`);
    if (!d.notifyRole && !d.notifyUser && !d.escalateRole) throw new HttpError(400, 'Say whom to tell: a role, a person or an escalation');
    if (d.escalateRole && !num(d.escalateDays)) throw new HttpError(400, 'Say after how many days to escalate');
  },
  doc_controlled: (ctx) => {
    if (!ctx.before) ctx.data.version = 1;
    order(ctx.data.effectiveDate, ctx.data.reviewDate, 'The review date is before the document takes effect');
  },
  fa_asset: async (ctx) => {
    const d = ctx.data;
    if (ctx.before && DEPRECIATION_INPUTS.some((k) => JSON.stringify(parseJson<Data>(ctx.before!.data_json, {})[k] ?? null) !== JSON.stringify(d[k] ?? null)) && (await postedParts(ctx.db, ctx.a.companyId, 'fa_asset', ctx.before.id)).length) {
      badState('Depreciation of this asset is posted to Finance: reverse the Finance postings before changing its cost, life, method or dates');
    }
    if (num(d.residualValue) > num(d.cost)) throw new HttpError(400, 'The residual value is more than the cost');
    order(d.acquisitionDate, d.disposalDate, 'The disposal is before the acquisition');
    const at = typeof d.disposalDate === 'string' ? d.disposalDate : ctx.today;
    d.accumulated = accumulatedAt(d, at);
    d.bookValue = num(d.cost) - num(d.accumulated);
    d.gainLoss = typeof d.disposalDate === 'string' ? num(d.disposalProceeds) - num(d.bookValue) : null;
  },
  ca_allocation: (ctx) => {
    order(ctx.data.periodFrom, ctx.data.periodTo, 'The period ends before it starts');
    ctx.data.totalPct = Math.round((ctx.lines ?? []).reduce((s, l) => s + num(l.percent), 0) * 1000) / 1000;
  },
  ic_transaction: (ctx) => {
    if (ctx.data.seller && ctx.data.seller === ctx.data.buyer) throw new HttpError(400, 'The seller and the buyer are the same entity');
    if (!(num(ctx.data.amount) > 0)) throw new HttpError(400, 'Give the amount');
  },
  rr_schedule: (ctx) => {
    const d = ctx.data;
    order(d.startDate, d.endDate, 'The schedule ends before it starts');
    if (typeof d.startDate !== 'string' || typeof d.endDate !== 'string') return;
    const months = monthsBetween(d.startDate, d.endDate);
    const total = num(d.total);
    const each = Math.floor(total / months.length);
    ctx.lines = months.map((m, i) => ({ month: m, amount: i === months.length - 1 ? total - each * (months.length - 1) : each, earned: monthEnd(m) <= ctx.today }));
    d.recognised = ctx.lines.filter((l) => l.earned).reduce((s, l) => s + num(l.amount), 0);
    d.deferred = total - num(d.recognised);
  },
  tc_declaration: (ctx) => {
    const d = ctx.data;
    for (const l of ctx.lines ?? []) if (l.hsCode && !/^\d{4}(\.?\d{2}){0,4}$/.test(str(l.hsCode))) throw new HttpError(400, `Tariff code ${str(l.hsCode)}: use digits such as 8471.30 or 847130`);
    d.customsValue = (ctx.lines ?? []).reduce((s, l) => s + Math.round(num(l.value) * (num(l.quantity) || 1)), 0);
    d.summary = `${opt(ctx, 'direction')} ${str(d.originCountry)} to ${str(d.destinationCountry)}`;
  },
  im_match: (ctx) => {
    const d = ctx.data;
    const tol = num(d.tolerancePct) / 100;
    let invoice = 0;
    let expected = 0;
    for (const l of ctx.lines ?? []) {
      const iq = num(l.invoicedQty);
      const ip = num(l.invoicedPrice);
      invoice += Math.round(iq * ip);
      expected += Math.round(num(l.receivedQty) * num(l.orderPrice));
      const qtyOk = Math.abs(iq - num(l.receivedQty)) <= Math.max(1e-9, num(l.receivedQty) * tol);
      const priceOk = Math.abs(ip - num(l.orderPrice)) <= Math.max(0.5, num(l.orderPrice) * tol);
      l.result = qtyOk && priceOk ? 'match' : !qtyOk && !priceOk ? 'both' : !qtyOk ? 'quantity' : 'price';
    }
    d.invoiceTotal = invoice;
    d.varianceTotal = invoice - expected;
    d.summary = `${label(ctx, 'purchaseOrder')} invoice ${str(d.invoiceNumber)}`;
  },
  sc_order: (ctx) => {
    const d = ctx.data;
    if (num(d.receivedQty) > num(d.quantity)) throw new HttpError(400, 'More received than was sent out');
    d.totalCost = Math.round(num(d.quantity) * num(d.unitCost));
    d.summary = `${str(d.operation)} by ${label(ctx, 'supplier')}`;
  },
  cal_instrument: (ctx) => {
    const d = ctx.data;
    d.nextDue = typeof d.lastCalibrated === 'string' ? addDays(d.lastCalibrated, num(d.intervalDays)) : ctx.before ? (d.nextDue ?? ctx.today) : ctx.today;
  },
  cal_record: async (ctx) => {
    const d = ctx.data;
    const lines = ctx.lines ?? [];
    for (const l of lines) l.result = typeof l.nominal === 'number' && typeof l.measured === 'number' ? (Math.abs(num(l.measured) - num(l.nominal)) <= num(l.tolerance) + 1e-12 ? 'pass' : 'fail') : null;
    const judged = lines.filter((l) => l.result);
    d.asLeft = judged.length ? (judged.every((l) => l.result === 'pass') ? 'pass' : 'fail') : null;
    d.summary = `${label(ctx, 'instrument')} on ${str(d.date)}`;
  },
  env_aspect: (ctx) => {
    const d = ctx.data;
    d.significance = num(d.severity) * num(d.likelihood);
    d.significant = num(d.significance) >= 12;
  },
  env_record: (ctx) => {
    const d = ctx.data;
    d.summary = `${opt(ctx, 'recordType')}: ${d.quantity} ${str(d.unit)}${label(ctx, 'location') ? ` at ${label(ctx, 'location')}` : ''}`;
  },
  fl_vehicle: (ctx) => {
    const d = ctx.data;
    const dates = [d.registrationExpiry, d.insuranceExpiry].filter((x): x is string => typeof x === 'string').sort();
    d.nextExpiry = dates[0] ?? null;
  },
  fl_fuel: async (ctx) => {
    const d = ctx.data;
    const prev = await ctx.db
      .prepare("SELECT MAX(CAST(json_extract(data_json, '$.odometer') AS INTEGER)) AS o FROM erp_objects WHERE company_id = ? AND object = 'fl_fuel' AND id <> ? AND archived_at IS NULL AND json_extract(data_json, '$.vehicle') = ? AND CAST(json_extract(data_json, '$.odometer') AS INTEGER) < ?")
      .bind(ctx.a.companyId, ctx.recordId, d.vehicle, num(d.odometer))
      .first<{ o: number | null }>();
    d.distance = prev?.o !== null && prev?.o !== undefined ? num(d.odometer) - prev.o : null;
    d.per100km = num(d.distance) > 0 ? round1((num(d.litres) / num(d.distance)) * 100) : null;
    d.summary = `${label(ctx, 'vehicle')}: ${d.litres} on ${d.date}`;
  },
  fl_trip: (ctx) => {
    const d = ctx.data;
    if (num(d.endOdometer) < num(d.startOdometer)) throw new HttpError(400, 'The odometer at the end is less than at the start');
    d.distance = num(d.endOdometer) - num(d.startOdometer);
    d.summary = `${label(ctx, 'vehicle')}: ${d.date}, ${d.distance} km`;
  },
  tm_run: (ctx) => {
    ctx.data.stops = (ctx.lines ?? []).length;
    ctx.data.summary = `${ctx.data.date}${label(ctx, 'vehicle') ? ` ${label(ctx, 'vehicle')}` : ''}`;
  },
  ts_sheet: async (ctx) => {
    const d = ctx.data;
    const start = str(d.weekStart);
    const end = start ? addDays(start, 6) : '';
    const perDay = new Map<string, number>();
    for (const l of ctx.lines ?? []) {
      if (start && (str(l.date) < start || str(l.date) > end)) throw new HttpError(400, `Hours on ${str(l.date)} are outside the week of ${start}`);
      perDay.set(str(l.date), (perDay.get(str(l.date)) ?? 0) + num(l.hours));
    }
    for (const [day, h] of perDay) if (h > 24) throw new HttpError(400, `More than 24 hours on ${day}`);
    d.totalHours = round2((ctx.lines ?? []).reduce((s, l) => s + num(l.hours), 0));
    d.billableHours = round2((ctx.lines ?? []).filter((l) => l.billable !== false).reduce((s, l) => s + num(l.hours), 0));
    const emp = await employeeOf(ctx);
    d.approver = (emp?.data.manager as string | null) ?? null;
    d.summary = `${label(ctx, 'employee')}: week of ${start}`;
  },
  rp_allocation: (ctx) => {
    order(ctx.data.fromDate, ctx.data.toDate, 'The allocation ends before it starts');
    ctx.data.summary = `${label(ctx, 'employee')}${label(ctx, 'project') ? ` on ${label(ctx, 'project')}` : ''}`;
  },
  rt_takings: (ctx) => {
    const d = ctx.data;
    d.netSales = num(d.grossSales) - num(d.refunds) - num(d.discounts);
    if (num(d.netSales) < 0) throw new HttpError(400, 'Refunds and discounts are more than the sales');
    d.variance = num(d.cash) + num(d.card) + num(d.other) - num(d.netSales);
    d.summary = `${label(ctx, 'store')}: ${d.date}`;
  },
  ws_account: (ctx) => {
    ctx.data.summary = `${label(ctx, 'customer')} (${opt(ctx, 'tier')})`;
  },
  cn_estimate: (ctx) => {
    const cost = (ctx.lines ?? []).reduce((s, l) => s + Math.round(num(l.quantity) * num(l.rate)), 0);
    ctx.data.cost = cost;
    ctx.data.total = Math.round(cost * (1 + num(ctx.data.marginPct) / 100));
  },
  cn_claim: async (ctx) => {
    const d = ctx.data;
    for (const l of ctx.lines ?? []) l.valueToDate = Math.round((num(l.contractValue) * num(l.percentComplete)) / 100);
    d.valueToDate = (ctx.lines ?? []).reduce((s, l) => s + num(l.valueToDate), 0);
    d.retention = Math.round((num(d.valueToDate) * num(d.retentionPct)) / 100);
    const prev = await ctx.db
      .prepare("SELECT COALESCE(SUM(CAST(json_extract(data_json, '$.thisClaim') AS INTEGER)), 0) AS s FROM erp_objects WHERE company_id = ? AND object = 'cn_claim' AND id <> ? AND status IN ('certified','invoiced') AND json_extract(data_json, '$.contract') = ? AND created_at < ?")
      .bind(ctx.a.companyId, ctx.recordId, d.contract, ctx.before?.created_at ?? Number.MAX_SAFE_INTEGER)
      .first<{ s: number }>();
    d.previouslyClaimed = num(prev?.s);
    d.thisClaim = num(d.valueToDate) - num(d.retention) - num(d.previouslyClaimed);
    d.summary = `${label(ctx, 'contract')}: work to ${str(d.periodEnd)}`;
  },
  cn_variation: (ctx) => {
    ctx.data.summary = `${opt(ctx, 'kind')}: ${label(ctx, 'contract')}`;
  },
  ps_engagement: async (ctx) => {
    const d = ctx.data;
    order(d.startDate, d.endDate, 'The engagement ends before it starts');
    if (!d.project) {
      d.hoursUsed = null;
      return;
    }
    const r = await ctx.db
      .prepare("SELECT COALESCE(SUM(CAST(json_extract(l.data_json, '$.hours') AS REAL)), 0) AS h FROM erp_object_lines l JOIN erp_objects e ON e.company_id = l.company_id AND e.id = l.record_id WHERE l.company_id = ? AND e.object = 'ts_sheet' AND e.status IN ('approved','billed') AND json_extract(l.data_json, '$.project') = ?")
      .bind(ctx.a.companyId, d.project)
      .first<{ h: number }>();
    d.hoursUsed = round2(num(r?.h));
  },
  hc_credential: (ctx) => {
    ctx.data.summary = `${label(ctx, 'employee')}: ${opt(ctx, 'credentialType')}`;
  },
  gr_grant: (ctx) => {
    const d = ctx.data;
    order(d.startDate, d.endDate, 'The grant ends before it starts');
    d.spent = (ctx.lines ?? []).reduce((s, l) => s + num(l.spentLine), 0);
    d.remaining = num(d.awarded) - num(d.spent);
  },
  rs_production: (ctx) => {
    const d = ctx.data;
    d.summary = `${label(ctx, 'site')} ${str(d.date)}: ${d.quantity} ${str(d.unit)} ${str(d.commodity)}`;
  },
};

export async function compute(ctx: HookCtx) {
  await COMPUTE[ctx.def.key]?.(ctx);
}

// ------------------------------------------------------------------ steps

type Before = (ctx: StepCtx) => Promise<void> | void;
type After = (ctx: StepCtx) => Promise<D1PreparedStatement[]>;

/** Leave left this year for the person and type (null when the type has no limit). */
export async function leaveLeft(db: D1Database, companyId: string, employeeId: string, leaveTypeId: string, year: string, exceptId: string | null) {
  const type = await getObj(db, companyId, 'hr_leave_type', leaveTypeId);
  const allowed = type?.data.annualDays;
  if (typeof allowed !== 'number') return { allowed: null as number | null, used: 0, left: null as number | null };
  const r = await db
    .prepare("SELECT COALESCE(SUM(CAST(json_extract(data_json, '$.days') AS REAL)), 0) AS d FROM erp_objects WHERE company_id = ? AND object = 'hr_leave' AND status IN ('submitted','approved') AND id <> ? AND json_extract(data_json, '$.employee') = ? AND json_extract(data_json, '$.leaveType') = ? AND substr(json_extract(data_json, '$.fromDate'), 1, 4) = ?")
    .bind(companyId, exceptId ?? '', employeeId, leaveTypeId, year)
    .first<{ d: number }>();
  const used = num(r?.d);
  return { allowed, used, left: allowed - used };
}

const BEFORE: Record<string, Before> = {
  hr_leave: async (ctx) => {
    if (ctx.t.key !== 'submit' && ctx.t.key !== 'approve') return;
    const d = ctx.data;
    const bal = await leaveLeft(ctx.db, ctx.a.companyId, str(d.employee), str(d.leaveType), str(d.fromDate).slice(0, 4), ctx.row.id);
    if (bal.left !== null && num(d.days) > bal.left + 1e-9) badState(`Only ${round2(Math.max(0, bal.left))} days of ${ctx.labels.leaveType || 'this leave'} are left in ${str(d.fromDate).slice(0, 4)}; this asks for ${d.days}`);
  },
  ob_checklist: (ctx) => {
    if (ctx.t.key === 'complete' && (ctx.lines ?? []).some((l) => l.done !== true)) badState('Tick every step before completing the checklist');
  },
  cal_record: (ctx) => {
    if (ctx.t.key === 'complete' && !ctx.data.asLeft) badState('Record at least one reading with its nominal, measured value and tolerance');
  },
  doc_controlled: (ctx) => {
    if (ctx.t.key === 'revise') ctx.data.version = num(ctx.data.version) + 1;
  },
  im_match: (ctx) => {
    if (!(ctx.lines ?? []).length) badState('Load the order lines first');
  },
  fa_asset: async (ctx) => {
    if (ctx.t.key === 'place' && !(num(ctx.data.cost) > 0)) badState('Give the asset’s cost');
    if (ctx.t.key === 'dispose' || ctx.t.key === 'write_off') {
      const from = str(ctx.data.disposalDate).slice(0, 7);
      if ((await postedParts(ctx.db, ctx.a.companyId, 'fa_asset', ctx.row.id)).some((m) => m >= from)) badState('Depreciation is posted to Finance for the month of the disposal or later: reverse the Finance postings first, then post again after recording the disposal');
    }
  },
  ca_allocation: (ctx) => {
    if (ctx.t.key === 'approve' && Math.abs(num(ctx.data.totalPct) - 100) > 0.001) badState(`The shares add up to ${num(ctx.data.totalPct)}%: they must add up to 100%`);
  },
  py_run: async (ctx) => {
    if (ctx.t.key === 'reopen' && (await postedParts(ctx.db, ctx.a.companyId, 'py_run', ctx.row.id)).length) badState('This pay run is posted to Finance: reverse the Finance posting before taking it back to worked out');
  },
  rr_schedule: async (ctx) => {
    if (ctx.t.key === 'cancel' && (await postedParts(ctx.db, ctx.a.companyId, 'rr_schedule', ctx.row.id)).length) badState('This schedule has journals in Finance: reverse the Finance postings before cancelling it');
  },
};

/** The fields a posted asset's depreciation follows. */
const DEPRECIATION_INPUTS = ['cost', 'residualValue', 'usefulLifeMonths', 'method', 'dvRatePct', 'depreciationStart', 'acquisitionDate', 'currency'];

/** The parts of a record posted to Finance and not reversed from here (months, 'whole', 'deferral'). */
async function postedParts(db: D1Database, companyId: string, object: string, id: string): Promise<string[]> {
  // a journal reversed in Finance itself no longer counts, though its key is freed only at the next post
  const rows = await db.prepare("SELECT ev.idempotency_key AS k FROM erp_integration_events ev WHERE ev.company_id = ? AND ev.source_type = ? AND ev.source_id = ? AND ev.kind = 'finance.journal' AND ev.status = 'done' AND NOT EXISTS (SELECT 1 FROM fin_journals j WHERE j.id = ev.target_ref AND j.org_id = ev.target_org_id AND j.reversed_by_id IS NOT NULL)").bind(companyId, object, id).all<{ k: string }>();
  return rows.results.map((r) => r.k.split(':').slice(4).join(':'));
}

const AFTER: Record<string, After> = {
  cal_record: async (ctx) => {
    if (ctx.t.key !== 'complete') return [];
    const ins = await getObj(ctx.db, ctx.a.companyId, 'cal_instrument', ctx.data.instrument);
    if (!ins) return [];
    const d = { ...ins.data };
    const date = str(ctx.data.date);
    // a pass moves the due date on; a fail takes the instrument out of service until it is put right
    if (ctx.data.asLeft === 'pass' && (!d.lastCalibrated || date >= str(d.lastCalibrated))) {
      d.lastCalibrated = date;
      d.nextDue = addDays(date, num(d.intervalDays) || 365);
    }
    const fail = ctx.data.asLeft === 'fail';
    const status = fail && ins.row.status === 'in_service' ? 'out_of_service' : ins.row.status;
    return [
      ctx.db
        .prepare('UPDATE erp_objects SET data_json = ?, due_date = ?, status = ?, status_at = CASE WHEN status <> ? THEN ? ELSE status_at END, version = version + 1, updated_at = ? WHERE company_id = ? AND id = ?')
        .bind(JSON.stringify(d), d.nextDue ?? null, status, status, Date.now(), Date.now(), ctx.a.companyId, ins.row.id),
    ];
  },
};

export async function beforeStep(ctx: StepCtx) {
  await BEFORE[ctx.def.key]?.(ctx);
}

export async function afterStep(ctx: StepCtx): Promise<D1PreparedStatement[]> {
  return (await AFTER[ctx.def.key]?.(ctx)) ?? [];
}

/** After a fuel purchase or trip, the vehicle's odometer moves on to the highest reading recorded. */
export function vehicleOdometerStmt(db: D1Database, companyId: string, def: ObjectDef, data: Data): D1PreparedStatement | null {
  const reading = def.key === 'fl_fuel' ? num(data.odometer) : def.key === 'fl_trip' ? num(data.endOdometer) : 0;
  if (!reading || typeof data.vehicle !== 'string') return null;
  return db
    .prepare("UPDATE erp_objects SET data_json = json_set(data_json, '$.odometer', ?), updated_at = ? WHERE company_id = ? AND object = 'fl_vehicle' AND id = ? AND COALESCE(CAST(json_extract(data_json, '$.odometer') AS INTEGER), 0) < ?")
    .bind(reading, Date.now(), companyId, data.vehicle, reading);
}
