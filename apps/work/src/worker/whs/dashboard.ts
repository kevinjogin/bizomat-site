// BIZOMAT WHS, Release 1: the WHS dashboard (brief section 4). Real counts only, from the company's own records, with
// filters for site, department, dates, incident type and risk level, monthly trends and site and department comparison.
// Every figure is an actual: BIZOMAT WHS makes no forecasts. Injury frequency rates need hours worked, which BIZOMAT does
// not track: a WHS manager enters hours worked per site and month (WHS settings), and a rate is shown only over whole
// months whose every site has hours entered; otherwise the counts are shown and the screen says which months and sites
// lack hours (hours.ts).

import type { WhsAccess } from './access';
import { actionScope, hazardScope, incidentScope } from './access';
import { INCIDENT_KINDS, SEVERITIES, currentMatrix, isoDate, levelLabel, monthsBetween, validDate } from './util';
import { frequencyRates } from './hours';

export interface DashboardFilters {
  from: string;
  to: string;
  site?: string;
  department?: string;
  kind?: string;
  level?: string;
  today: string;
}

/** Filters from the query, defaulting to the last twelve months to today. */
export function filtersFrom(q: (k: string) => string | undefined, today: string): DashboardFilters {
  const to = q('to') && validDate(q('to')!) ? q('to')! : today;
  // the default period: the twelve calendar months to the month of `to`
  const t = new Date(`${to}T00:00:00Z`);
  const from = q('from') && validDate(q('from')!) ? q('from')! : isoDate(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() - 11, 1));
  const kind = q('kind');
  return { from: from > to ? to : from, to, site: q('site') || undefined, department: q('department') || undefined, kind: kind && Object.hasOwn(INCIDENT_KINDS, kind) ? kind : undefined, level: q('level') || undefined, today };
}

const n = (r: any, k: string) => Number(r?.[k] ?? 0);
const msOf = (date: string, end = false) => Date.parse(`${date}T${end ? '23:59:59.999' : '00:00:00.000'}Z`);

export async function dashboard(db: D1Database, a: WhsAccess, f: DashboardFilters) {
  const { matrix } = await currentMatrix(db, a.companyId, a.userId);
  const hs = hazardScope(a, 'h');
  const is = incidentScope(a, 'i');
  const xs = actionScope(a, 'x');
  const hWhere = ['h.company_id = ?', hs.sql];
  const hArgs: unknown[] = [a.companyId, ...hs.args];
  const iWhere = ['i.company_id = ?', is.sql];
  const iArgs: unknown[] = [a.companyId, ...is.args];
  const add = (where: string[], args: unknown[], sql: string, v: unknown) => {
    where.push(sql);
    args.push(v);
  };
  if (f.site) add(hWhere, hArgs, 'h.site_id = ?', f.site);
  if (f.department) add(hWhere, hArgs, 'h.department_id = ?', f.department);
  if (f.level) add(hWhere, hArgs, 'h.risk_level = ?', f.level);
  if (f.site) add(iWhere, iArgs, 'i.site_id = ?', f.site);
  if (f.department) add(iWhere, iArgs, 'i.department_id = ?', f.department);
  if (f.kind) add(iWhere, iArgs, 'i.kind = ?', f.kind);
  const inPeriod = 'i.occurred_date >= ? AND i.occurred_date <= ?';
  const fromMs = msOf(f.from);
  const toMs = msOf(f.to, true);

  const [hz, inc, act, ras, hzMonth, incMonth, actMonth, sites, depts, notices] = await db.batch([
    db
      .prepare(
        `SELECT SUM(CASE WHEN h.status NOT IN ('closed','cancelled') THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN h.status NOT IN ('closed','cancelled') AND h.risk_rank >= ? THEN 1 ELSE 0 END) AS high,
                SUM(CASE WHEN h.status = 'reported' THEN 1 ELSE 0 END) AS to_assess,
                SUM(CASE WHEN h.created_at BETWEEN ? AND ? THEN 1 ELSE 0 END) AS reported
           FROM whs_hazards h WHERE ${hWhere.join(' AND ')}`,
      )
      .bind(matrix.highFrom, fromMs, toMs, ...hArgs),
    db
      .prepare(
        `SELECT SUM(CASE WHEN i.status <> 'closed' THEN 1 ELSE 0 END) AS open,
                SUM(CASE WHEN ${inPeriod} THEN 1 ELSE 0 END) AS in_period,
                SUM(CASE WHEN ${inPeriod} AND i.kind = 'near_miss' THEN 1 ELSE 0 END) AS near_misses,
                SUM(CASE WHEN ${inPeriod} AND i.serious = 1 THEN 1 ELSE 0 END) AS serious,
                SUM(CASE WHEN i.status <> 'closed' AND i.investigation_required = 1 AND NOT EXISTS (SELECT 1 FROM whs_investigations v WHERE v.company_id = i.company_id AND v.incident_id = i.id AND v.status = 'approved') THEN 1 ELSE 0 END) AS to_investigate,
                SUM(CASE WHEN i.potentially_notifiable = 1 AND i.notification_status IN ('not_assessed','assessing') THEN 1 ELSE 0 END) AS to_decide,
                SUM(CASE WHEN i.notification_status = 'notifiable' THEN 1 ELSE 0 END) AS to_submit,
                SUM(CASE WHEN ${inPeriod} AND i.outcome = 'lost_time' THEN 1 ELSE 0 END) AS lti,
                SUM(CASE WHEN ${inPeriod} AND i.outcome = 'fatality' THEN 1 ELSE 0 END) AS fatalities,
                SUM(CASE WHEN ${inPeriod} AND i.outcome IN ('medical_treatment','restricted_duties','lost_time','hospital_inpatient','fatality') THEN 1 ELSE 0 END) AS recordable
           FROM whs_incidents i WHERE ${iWhere.join(' AND ')}`,
      )
      .bind(f.from, f.to, f.from, f.to, f.from, f.to, f.from, f.to, f.from, f.to, f.from, f.to, ...iArgs),
    db
      .prepare(
        `SELECT SUM(CASE WHEN x.status IN ('open','in_progress') THEN 1 ELSE 0 END) AS open,
                SUM(CASE WHEN x.status IN ('open','in_progress') AND x.due_date IS NOT NULL AND x.due_date < ? THEN 1 ELSE 0 END) AS overdue,
                SUM(CASE WHEN x.status = 'completed' THEN 1 ELSE 0 END) AS to_verify,
                SUM(CASE WHEN x.created_at BETWEEN ? AND ? THEN 1 ELSE 0 END) AS raised,
                SUM(CASE WHEN x.completed_at BETWEEN ? AND ? AND x.status IN ('completed','verified','closed') THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN x.completed_at BETWEEN ? AND ? AND x.status IN ('completed','verified','closed') AND x.due_date IS NOT NULL AND strftime('%Y-%m-%d', x.completed_at / 1000, 'unixepoch') <= x.due_date THEN 1 ELSE 0 END) AS on_time,
                SUM(CASE WHEN x.completed_at BETWEEN ? AND ? AND x.status IN ('completed','verified','closed') AND x.due_date IS NOT NULL THEN 1 ELSE 0 END) AS with_due
           FROM whs_actions x WHERE x.company_id = ? AND ${xs.sql}`,
      )
      .bind(f.today, fromMs, toMs, fromMs, toMs, fromMs, toMs, fromMs, toMs, a.companyId, ...xs.args),
    db
      .prepare(
        `SELECT SUM(CASE WHEN r.status = 'draft' THEN 1 ELSE 0 END) AS drafts, SUM(CASE WHEN r.status = 'submitted' THEN 1 ELSE 0 END) AS submitted,
                SUM(CASE WHEN r.status = 'approved' AND r.review_date IS NOT NULL AND r.review_date < ? THEN 1 ELSE 0 END) AS review_due,
                SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END) AS approved
           FROM whs_risk_assessments r WHERE r.company_id = ? ${a.can.confidential ? '' : 'AND r.confidential = 0'} ${f.site ? 'AND r.site_id = ?' : ''}`,
      )
      .bind(...(f.site ? [f.today, a.companyId, f.site] : [f.today, a.companyId])),
    db.prepare(`SELECT strftime('%Y-%m', h.created_at / 1000, 'unixepoch') AS m, COUNT(*) AS n FROM whs_hazards h WHERE ${hWhere.join(' AND ')} AND h.created_at BETWEEN ? AND ? GROUP BY m`).bind(...hArgs, fromMs, toMs),
    db
      .prepare(
        `SELECT substr(i.occurred_date, 1, 7) AS m, COUNT(*) AS total, SUM(CASE WHEN i.kind = 'near_miss' THEN 1 ELSE 0 END) AS near_misses, SUM(CASE WHEN i.kind IN ('injury','illness') THEN 1 ELSE 0 END) AS injuries,
                SUM(CASE WHEN i.serious = 1 THEN 1 ELSE 0 END) AS serious, SUM(CASE WHEN i.outcome = 'lost_time' THEN 1 ELSE 0 END) AS lti,
                SUM(CASE WHEN i.severity = 'minor' THEN 1 ELSE 0 END) AS minor, SUM(CASE WHEN i.severity = 'moderate' THEN 1 ELSE 0 END) AS moderate, SUM(CASE WHEN i.severity = 'serious' THEN 1 ELSE 0 END) AS sev_serious, SUM(CASE WHEN i.severity = 'critical' THEN 1 ELSE 0 END) AS critical
           FROM whs_incidents i WHERE ${iWhere.join(' AND ')} AND ${inPeriod} GROUP BY m`,
      )
      .bind(...iArgs, f.from, f.to),
    db.prepare(`SELECT strftime('%Y-%m', x.closed_at / 1000, 'unixepoch') AS m, COUNT(*) AS n FROM whs_actions x WHERE x.company_id = ? AND ${xs.sql} AND x.status = 'closed' AND x.closed_at BETWEEN ? AND ? GROUP BY m`).bind(a.companyId, ...xs.args, fromMs, toMs),
    db
      .prepare(
        `SELECT s.id, s.name,
                (SELECT COUNT(*) FROM whs_hazards h WHERE ${hWhere.join(' AND ')} AND h.site_id = s.id AND h.status NOT IN ('closed','cancelled')) AS hazards,
                (SELECT COUNT(*) FROM whs_incidents i WHERE ${iWhere.join(' AND ')} AND i.site_id = s.id AND ${inPeriod}) AS incidents,
                (SELECT COUNT(*) FROM whs_incidents i WHERE ${iWhere.join(' AND ')} AND i.site_id = s.id AND ${inPeriod} AND i.kind = 'near_miss') AS near_misses,
                (SELECT COUNT(*) FROM whs_incidents i WHERE ${iWhere.join(' AND ')} AND i.site_id = s.id AND ${inPeriod} AND i.outcome = 'lost_time') AS lti
           FROM mt_sites s WHERE s.company_id = ? AND s.archived_at IS NULL ORDER BY s.name`,
      )
      .bind(...hArgs, ...iArgs, f.from, f.to, ...iArgs, f.from, f.to, ...iArgs, f.from, f.to, a.companyId),
    db
      .prepare(
        `SELECT d.id, d.name,
                (SELECT COUNT(*) FROM whs_hazards h WHERE ${hWhere.join(' AND ')} AND h.department_id = d.id AND h.status NOT IN ('closed','cancelled')) AS hazards,
                (SELECT COUNT(*) FROM whs_incidents i WHERE ${iWhere.join(' AND ')} AND i.department_id = d.id AND ${inPeriod}) AS incidents,
                (SELECT COUNT(*) FROM whs_incidents i WHERE ${iWhere.join(' AND ')} AND i.department_id = d.id AND ${inPeriod} AND i.outcome = 'lost_time') AS lti
           FROM co_departments d WHERE d.company_id = ? AND d.archived_at IS NULL ORDER BY d.name`,
      )
      .bind(...hArgs, ...iArgs, f.from, f.to, ...iArgs, f.from, f.to, a.companyId),
    db.prepare("SELECT COUNT(*) AS n FROM whs_reg_notices n WHERE n.company_id = ? AND n.status = 'submitted' AND n.recorded_at BETWEEN ? AND ?").bind(a.companyId, fromMs, toMs),
  ]);
  const H = hz.results[0] as any;
  const I = inc.results[0] as any;
  const X = act.results[0] as any;
  const R = ras.results[0] as any;
  const months = monthsBetween(f.from, f.to);
  const pick = (rows: any[], m: string) => rows.find((r) => r.m === m) ?? {};
  const trend = months.map((m) => {
    const ir = pick(incMonth.results as any[], m);
    return {
      month: m,
      incidents: n(ir, 'total'),
      nearMisses: n(ir, 'near_misses'),
      injuries: n(ir, 'injuries'),
      serious: n(ir, 'serious'),
      lti: n(ir, 'lti'),
      severity: { minor: n(ir, 'minor'), moderate: n(ir, 'moderate'), serious: n(ir, 'sev_serious'), critical: n(ir, 'critical') },
      hazards: n(pick(hzMonth.results as any[], m), 'n'),
      actionsClosed: n(pick(actMonth.results as any[], m), 'n'),
    };
  });

  // Frequency rates: over whole months only, with hours worked for every site that worked in each of them (hours.ts).
  const fr = await frequencyRates(db, a, f);
  const rates = { ...fr.company, formula: fr.formula, counting: fr.counting, scope: fr.scope };

  return {
    filters: f,
    actual: 'Actual figures from your records. BIZOMAT WHS makes no forecasts.',
    hazards: { active: n(H, 'active'), high: n(H, 'high'), toAssess: n(H, 'to_assess'), reported: n(H, 'reported'), highLabel: matrix.levels.filter((l) => l.rank >= matrix.highFrom).map((l) => l.label).join(' and ') },
    incidents: { open: n(I, 'open'), inPeriod: n(I, 'in_period'), nearMisses: n(I, 'near_misses'), serious: n(I, 'serious'), toInvestigate: n(I, 'to_investigate'), toDecide: n(I, 'to_decide'), toSubmit: n(I, 'to_submit'), lti: n(I, 'lti'), fatalities: n(I, 'fatalities'), recordable: n(I, 'recordable'), submissions: n(notices.results[0], 'n') },
    actions: { open: n(X, 'open'), overdue: n(X, 'overdue'), toVerify: n(X, 'to_verify'), raised: n(X, 'raised'), completed: n(X, 'completed'), onTime: n(X, 'on_time'), withDue: n(X, 'with_due'), onTimePct: n(X, 'with_due') ? Math.round((n(X, 'on_time') / n(X, 'with_due')) * 100) : null },
    riskAssessments: { drafts: n(R, 'drafts'), submitted: n(R, 'submitted'), reviewDue: n(R, 'review_due'), approved: n(R, 'approved'), outstanding: n(R, 'drafts') + n(R, 'submitted') + n(R, 'review_due') },
    rates,
    trend,
    sites: (sites.results as any[]).map((s) => {
      const r = fr.sites[s.id];
      return { id: s.id, name: s.name, hazards: n(s, 'hazards'), incidents: n(s, 'incidents'), nearMisses: n(s, 'near_misses'), lti: n(s, 'lti'), rates: r ? { available: r.available, ltifr: r.ltifr, trifr: r.trifr, hours: r.hours, note: r.available ? '' : r.note } : null };
    }),
    departments: (depts.results as any[]).map((d) => ({ id: d.id, name: d.name, hazards: n(d, 'hazards'), incidents: n(d, 'incidents'), lti: n(d, 'lti') })),
    levels: matrix.levels.map((l) => ({ key: l.key, label: levelLabel(matrix, l.key) })),
    severities: SEVERITIES,
    // the brief's other dashboard figures come with later releases: shown as planned, never as numbers
    planned: ['Outstanding inspections', 'Expired safety training', 'Contractor compliance', 'Active permits to work', 'Upcoming compliance obligations', 'Emergency equipment inspection status', 'Audit performance'],
  };
}
