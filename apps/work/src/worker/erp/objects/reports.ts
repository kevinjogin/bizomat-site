// Reports of the modules framework: every kind of record counted (and its amount summed) by status, by a field or by
// month, and the reports a definition cannot say: leave balances, training expiring, the asset register with
// depreciation, earned and deferred revenue, instruments due, vehicle running costs, project hours and costs, and
// utilisation. Each only over the records the person may see, and never with sensitive values they may not read.

import { HttpError, parseJson } from '../../lib/util';
import type { ErpAccess } from '../access';
import type { ObjectDef, ReportDef } from '../../../shared/erp-objects';
import { visibleSql, type ObjAccess, type Data } from './engine';
import { accumulatedAt, addDays, depreciationSchedule, leaveLeft } from './hooks';

export interface ReportTable {
  key: string;
  label: string;
  what: string;
  columns: { key: string; label: string; kind?: 'money' | 'number' | 'text' | 'date' }[];
  rows: Record<string, unknown>[];
  note?: string;
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === 'string' ? v : '');

async function visibleRows(db: D1Database, a: ErpAccess, x: ObjAccess, object: string, extra = '', args: unknown[] = []) {
  const vis = visibleSql(x, a.userId);
  const rows = await db.prepare(`SELECT e.* FROM erp_objects e WHERE e.company_id = ? AND e.object = ? AND e.archived_at IS NULL AND ${vis.sql}${extra} LIMIT 5000`).bind(a.companyId, object, ...vis.args, ...args).all<any>();
  return rows.results;
}

async function labelsFor(db: D1Database, companyId: string, ids: string[], field: string) {
  const out = new Map<string, string>();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    if (!chunk.length) continue;
    const rows = await db.prepare(`SELECT record_id, label FROM erp_object_refs WHERE company_id = ? AND field = ? AND record_id IN (${chunk.map(() => '?').join(',')})`).bind(companyId, field, ...chunk).all<{ record_id: string; label: string }>();
    for (const r of rows.results) out.set(r.record_id, r.label);
  }
  return out;
}

/** A grouped report (by status, a field or a month), counted and summed. */
export async function groupedReport(db: D1Database, a: ErpAccess, x: ObjAccess, r: ReportDef): Promise<ReportTable> {
  const def = x.def;
  const rows = await visibleRows(db, a, x, def.key);
  const byMonth = r.by.startsWith('month:');
  const field = byMonth ? r.by.slice(6) : r.by;
  const f = def.fields.find((k) => k.key === field);
  const sumField = r.sum ? def.fields.find((k) => k.key === r.sum) : undefined;
  if (sumField?.sensitive && !x.admin && !sumField.sensitive.some((role) => a.roles.includes(role as never))) throw new HttpError(403, 'This report shows amounts your roles may not read');
  const labels = f?.type === 'ref' ? await labelsFor(db, a.companyId, rows.map((x) => x.id), field) : new Map<string, string>();
  const groups = new Map<string, { label: string; count: number; sum: number }>();
  for (const row of rows) {
    const d = parseJson<Data>(row.data_json, {});
    let key: string;
    let label: string;
    if (r.by === 'status') {
      key = row.status;
      label = def.statuses.find((s) => s.key === row.status)?.label ?? row.status;
    } else if (byMonth) {
      key = str(d[field]).slice(0, 7) || '(none)';
      label = key;
    } else if (f?.type === 'select') {
      key = str(d[field]) || '(none)';
      label = f.options?.[key] ?? '(none)';
    } else if (f?.type === 'bool') {
      key = d[field] === true ? 'yes' : 'no';
      label = key === 'yes' ? 'Yes' : 'No';
    } else if (f?.type === 'ref') {
      key = str(d[field]) || '(none)';
      label = labels.get(row.id) || '(none)';
    } else {
      key = String(d[field] ?? '(none)');
      label = key;
    }
    const g = groups.get(key) ?? { label, count: 0, sum: 0 };
    g.count++;
    if (sumField) g.sum += num(d[sumField.key]);
    groups.set(key, g);
  }
  const ordered = [...groups.entries()].sort((p, q) => (byMonth ? p[0].localeCompare(q[0]) : r.by === 'status' ? def.statuses.findIndex((s) => s.key === p[0]) - def.statuses.findIndex((s) => s.key === q[0]) : q[1].count - p[1].count));
  const kind = sumField?.type === 'money' ? ('money' as const) : ('number' as const);
  return {
    key: r.key,
    label: r.label,
    what: r.what,
    columns: [{ key: 'group', label: byMonth ? 'Month' : r.by === 'status' ? 'Status' : (f?.label ?? 'Group') }, { key: 'count', label: def.plural, kind: 'number' }, ...(sumField ? [{ key: 'sum', label: sumField.label, kind }] : [])],
    rows: ordered.map(([k, g]) => ({ key: k, group: g.label, count: g.count, ...(sumField ? { sum: kind === 'number' ? Math.round(g.sum * 100) / 100 : g.sum } : {}) })),
  };
}

type Custom = (db: D1Database, a: ErpAccess, x: ObjAccess, today: string) => Promise<ReportTable>;

const CUSTOM: Record<string, Custom> = {
  'hr_leave.balances': async (db, a, x, today) => {
    const year = today.slice(0, 4);
    const types = await db.prepare("SELECT id, title, data_json FROM erp_objects WHERE company_id = ? AND object = 'hr_leave_type' AND status = 'active' AND archived_at IS NULL").bind(a.companyId).all<any>();
    const vis = x.view ? '' : ' AND e.owner_user_id = ?';
    const emps = await db.prepare(`SELECT e.id, e.title FROM erp_objects e WHERE e.company_id = ? AND e.object = 'hr_employee' AND e.status IN ('onboarding','active','on_leave') AND e.archived_at IS NULL${vis} ORDER BY e.title LIMIT 1000`).bind(a.companyId, ...(x.view ? [] : [a.userId])).all<any>();
    const rows: Record<string, unknown>[] = [];
    for (const e of emps.results) {
      for (const t of types.results) {
        const allowed = parseJson<Data>(t.data_json, {}).annualDays;
        if (typeof allowed !== 'number') continue;
        const approved = await db.prepare("SELECT COALESCE(SUM(CASE WHEN status = 'approved' THEN CAST(json_extract(data_json, '$.days') AS REAL) ELSE 0 END), 0) AS taken, COALESCE(SUM(CASE WHEN status = 'submitted' THEN CAST(json_extract(data_json, '$.days') AS REAL) ELSE 0 END), 0) AS booked FROM erp_objects WHERE company_id = ? AND object = 'hr_leave' AND json_extract(data_json, '$.employee') = ? AND json_extract(data_json, '$.leaveType') = ? AND substr(json_extract(data_json, '$.fromDate'), 1, 4) = ?").bind(a.companyId, e.id, t.id, year).first<any>();
        const bal = await leaveLeft(db, a.companyId, e.id, t.id, year, null);
        rows.push({ employee: e.title, leaveType: t.title, allowed, taken: num(approved?.taken), waiting: num(approved?.booked), left: bal.left });
      }
    }
    return { key: 'balances', label: 'Leave balances', what: `Days given, taken, waiting for approval and left in ${year}.`, columns: [{ key: 'employee', label: 'Employee' }, { key: 'leaveType', label: 'Leave type' }, { key: 'allowed', label: 'Days a year', kind: 'number' }, { key: 'taken', label: 'Taken', kind: 'number' }, { key: 'waiting', label: 'Waiting', kind: 'number' }, { key: 'left', label: 'Left', kind: 'number' }], rows };
  },
  'tr_record.expiring': async (db, a, x, today) => {
    const horizon = addDays(today, 60);
    const rows = await visibleRows(db, a, x, 'tr_record', " AND e.status = 'completed' AND e.due_date IS NOT NULL AND e.due_date <= ? ORDER BY e.due_date", [horizon]);
    return { key: 'expiring', label: 'Expiring and expired', what: 'Training that has expired or expires in the next 60 days.', columns: [{ key: 'record', label: 'Training' }, { key: 'expires', label: 'Expires', kind: 'date' }, { key: 'state', label: '' }], rows: rows.map((r) => ({ id: r.id, record: r.title, expires: r.due_date, state: r.due_date < today ? 'Expired' : 'Expiring' })) };
  },
  'fa_asset.register': async (db, a, x, today) => {
    const rows = await visibleRows(db, a, x, 'fa_asset', ' ORDER BY e.number');
    const yearStart = `${today.slice(0, 4)}-01-01`;
    const out = rows.map((r) => {
      const d = parseJson<Data>(r.data_json, {});
      const acc = r.status === 'in_service' ? accumulatedAt(d, today) : num(d.accumulated);
      const thisYear = r.status === 'in_service' ? acc - accumulatedAt(d, yearStart) : 0;
      return { id: r.id, asset: `${r.number} ${r.title}`, status: r.status, cost: num(d.cost), accumulated: acc, bookValue: num(d.cost) - acc, thisYear };
    });
    return { key: 'register', label: 'Asset register and depreciation', what: `Cost, depreciation to date and book value of every asset, and depreciation since ${yearStart}.`, columns: [{ key: 'asset', label: 'Asset' }, { key: 'cost', label: 'Cost', kind: 'money' }, { key: 'accumulated', label: 'Depreciation to date', kind: 'money' }, { key: 'bookValue', label: 'Book value', kind: 'money' }, { key: 'thisYear', label: 'This year', kind: 'money' }], rows: out, note: 'Not posted to Finance’s ledger: enter the depreciation journal in Finance.' };
  },
  'rr_schedule.deferred': async (db, a, x) => {
    const rows = await visibleRows(db, a, x, 'rr_schedule', " AND e.status IN ('active','completed') ORDER BY e.number");
    return { key: 'deferred', label: 'Earned and deferred', what: 'Earned to date and still deferred by schedule.', columns: [{ key: 'schedule', label: 'Schedule' }, { key: 'total', label: 'Amount', kind: 'money' }, { key: 'recognised', label: 'Earned', kind: 'money' }, { key: 'deferred', label: 'Deferred', kind: 'money' }], rows: rows.map((r) => ({ id: r.id, schedule: `${r.number} ${r.title}`, ...pickNums(parseJson<Data>(r.data_json, {}), ['total', 'recognised', 'deferred']) })), note: 'Not posted to Finance’s ledger.' };
  },
  'cal_instrument.due': async (db, a, x, today) => {
    const rows = await visibleRows(db, a, x, 'cal_instrument', " AND e.status = 'in_service' AND e.due_date IS NOT NULL AND e.due_date <= ? ORDER BY e.due_date", [addDays(today, 30)]);
    return { key: 'due', label: 'Due and overdue', what: 'Instruments overdue or due in the next 30 days.', columns: [{ key: 'instrument', label: 'Instrument' }, { key: 'due', label: 'Due', kind: 'date' }, { key: 'state', label: '' }], rows: rows.map((r) => ({ id: r.id, instrument: `${r.number} ${r.title}`, due: r.due_date, state: r.due_date < today ? 'Overdue' : 'Due soon' })) };
  },
  'fl_vehicle.costs': async (db, a, x) => {
    const vehicles = await visibleRows(db, a, x, 'fl_vehicle', ' ORDER BY e.number');
    const fuel = await db.prepare("SELECT json_extract(data_json, '$.vehicle') AS v, COUNT(*) AS n, COALESCE(SUM(CAST(json_extract(data_json, '$.litres') AS REAL)), 0) AS litres, COALESCE(SUM(CAST(json_extract(data_json, '$.cost') AS INTEGER)), 0) AS cost, MIN(CAST(json_extract(data_json, '$.odometer') AS INTEGER)) AS lo, MAX(CAST(json_extract(data_json, '$.odometer') AS INTEGER)) AS hi FROM erp_objects WHERE company_id = ? AND object = 'fl_fuel' AND archived_at IS NULL GROUP BY json_extract(data_json, '$.vehicle')").bind(a.companyId).all<any>();
    const by = new Map(fuel.results.map((f) => [f.v, f]));
    return {
      key: 'costs',
      label: 'Running costs',
      what: 'Fuel bought, its cost, the distance between the first and last fill, and consumption.',
      columns: [{ key: 'vehicle', label: 'Vehicle' }, { key: 'fills', label: 'Fills', kind: 'number' }, { key: 'litres', label: 'Litres', kind: 'number' }, { key: 'cost', label: 'Fuel cost', kind: 'money' }, { key: 'km', label: 'Distance (km)', kind: 'number' }, { key: 'per100', label: 'Per 100 km', kind: 'number' }],
      rows: vehicles.map((v) => {
        const f = by.get(v.id);
        const km = f ? num(f.hi) - num(f.lo) : 0;
        return { id: v.id, vehicle: `${v.number} ${v.title}`, fills: num(f?.n), litres: Math.round(num(f?.litres) * 10) / 10, cost: num(f?.cost), km, per100: km > 0 && f && f.n > 1 ? Math.round((num(f.litres) / km) * 1000) / 10 : null };
      }),
      note: 'Consumption counts the fuel after the first fill over the distance between fills only roughly: keep filling to full for the best figure.',
    };
  },
  'ts_sheet.project-costs': async (db, a, x) => {
    const vis = visibleSql(x, a.userId);
    const lines = await db
      .prepare(
        `SELECT json_extract(l.data_json, '$.project') AS project, json_extract(e.data_json, '$.employee') AS emp, e.status, CAST(json_extract(l.data_json, '$.hours') AS REAL) AS hours, json_extract(l.data_json, '$.billable') AS billable
           FROM erp_object_lines l JOIN erp_objects e ON e.company_id = l.company_id AND e.id = l.record_id
          WHERE l.company_id = ? AND e.object = 'ts_sheet' AND e.archived_at IS NULL AND e.status IN ('approved','billed') AND ${vis.sql} LIMIT 20000`,
      )
      .bind(a.companyId, ...vis.args)
      .all<any>();
    const cost = new Map<string, number>();
    const seesCost = x.admin || ['hr_manager', 'payroll_officer', 'project_manager', 'finance_controller', 'executive'].some((r) => a.roles.includes(r as never));
    if (seesCost) {
      const emps = await db.prepare("SELECT id, data_json FROM erp_objects WHERE company_id = ? AND object = 'hr_employee'").bind(a.companyId).all<any>();
      for (const e of emps.results) cost.set(e.id, num(parseJson<Data>(e.data_json, {}).costRate));
    }
    const names = new Map<string, string>();
    const refs = await db.prepare("SELECT target_id, label FROM erp_object_refs WHERE company_id = ? AND kind = 'project'").bind(a.companyId).all<any>();
    for (const r of refs.results) names.set(r.target_id, r.label);
    const groups = new Map<string, { hours: number; billable: number; billed: number; cost: number }>();
    for (const l of lines.results) {
      const k = l.project ?? '';
      const g = groups.get(k) ?? { hours: 0, billable: 0, billed: 0, cost: 0 };
      g.hours += num(l.hours);
      if (l.billable !== 0 && l.billable !== false) g.billable += num(l.hours);
      if (l.status === 'billed' && l.billable !== 0 && l.billable !== false) g.billed += num(l.hours);
      g.cost += Math.round(num(l.hours) * (cost.get(l.emp) ?? 0));
      groups.set(k, g);
    }
    const r2 = (n: number) => Math.round(n * 100) / 100;
    return {
      key: 'project-costs',
      label: 'Project hours and costs',
      what: 'Approved hours by project, billable and invoiced hours, and their cost from each person’s cost of an hour.',
      columns: [{ key: 'project', label: 'Project' }, { key: 'hours', label: 'Hours', kind: 'number' }, { key: 'billable', label: 'Billable', kind: 'number' }, { key: 'billed', label: 'Invoiced', kind: 'number' }, ...(seesCost ? [{ key: 'cost', label: 'Cost', kind: 'money' as const }] : [])],
      rows: [...groups.entries()].map(([k, g]) => ({ project: k ? (names.get(k) ?? 'A project') : '(no project)', hours: r2(g.hours), billable: r2(g.billable), billed: r2(g.billed), ...(seesCost ? { cost: g.cost } : {}) })).sort((p, q) => q.hours - p.hours),
    };
  },
  'rp_allocation.utilisation': async (db, a, x, today) => {
    const weeks = Array.from({ length: 12 }, (_, i) => addDays(today, i * 7));
    const allocs = await visibleRows(db, a, x, 'rp_allocation', " AND e.status IN ('planned','confirmed')");
    const emps = await db.prepare("SELECT id, title, data_json FROM erp_objects WHERE company_id = ? AND object = 'hr_employee' AND archived_at IS NULL").bind(a.companyId).all<any>();
    const std = new Map(emps.results.map((e) => [e.id, { name: e.title as string, hours: num(parseJson<Data>(e.data_json, {}).hoursPerWeek) || 38 }]));
    const rows: Record<string, unknown>[] = [];
    const per = new Map<string, number[]>();
    for (const al of allocs) {
      const d = parseJson<Data>(al.data_json, {});
      const list = per.get(str(d.employee)) ?? weeks.map(() => 0);
      weeks.forEach((w, i) => {
        const end = addDays(w, 6);
        if (str(d.fromDate) <= end && str(d.toDate) >= w) list[i] += num(d.hoursPerWeek);
      });
      per.set(str(d.employee), list);
    }
    for (const [emp, list] of per) {
      const s = std.get(emp);
      const peak = Math.max(...list);
      rows.push({ employee: s?.name ?? 'An employee', standard: s?.hours ?? 38, peak, average: Math.round((list.reduce((p, q) => p + q, 0) / list.length) * 10) / 10, utilisation: s ? Math.round((peak / s.hours) * 100) : null, over: s && peak > s.hours ? 'Over-allocated' : '' });
    }
    return { key: 'utilisation', label: 'Utilisation', what: `Hours allocated a week from ${today} for 12 weeks against each person’s standard hours.`, columns: [{ key: 'employee', label: 'Employee' }, { key: 'standard', label: 'Standard hours', kind: 'number' }, { key: 'average', label: 'Average allocated', kind: 'number' }, { key: 'peak', label: 'Busiest week', kind: 'number' }, { key: 'utilisation', label: 'Busiest week (%)', kind: 'number' }, { key: 'over', label: '' }], rows: rows.sort((p, q) => num(q.utilisation) - num(p.utilisation)) };
  },
};

function pickNums(d: Data, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, num(d[k])]));
}

export async function runReport(db: D1Database, a: ErpAccess, x: ObjAccess, key: string, today: string): Promise<ReportTable> {
  const r = x.def.reports?.find((k) => k.key === key);
  if (!r) throw new HttpError(404, 'Report not found');
  if (r.by === 'custom') {
    const fn = CUSTOM[`${x.def.key}.${key}`];
    if (!fn) throw new HttpError(404, 'Report not found');
    return fn(db, a, x, today);
  }
  return groupedReport(db, a, x, r);
}

export function reportsOf(def: ObjectDef) {
  return (def.reports ?? []).map((r) => ({ key: r.key, label: r.label, what: r.what }));
}

export { depreciationSchedule };
