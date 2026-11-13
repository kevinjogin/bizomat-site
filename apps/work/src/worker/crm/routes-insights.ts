// The CRM dashboard and reports. Every figure is computed in SQL from the organisation's records at the time of the
// request, within the caller's visibility (scopeSql) and the chosen filters (dates, owner, team, pipeline). Dates are
// grouped in UTC. Nothing is cached or estimated.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { badRequest, placeholders } from '../lib/util';
import { optionLabel, statusesOfKind } from '../../shared/crm/defaults';
import { toCsv } from '../../shared/crm/csv';
import { fromMinor } from '../../shared/crm/money';
import { type OrgAccess, requireOrg, requirePerm, scopeSql } from './access';
import { addDays, auditStmt, todayIn } from './util';
import { clientIp } from '../lib/util';

export const insightRoutes = new Hono<AppEnv>();

const DAY = 86_400_000;
const WEEK = 7 * DAY;

interface Filters {
  from: number;
  to: number;
  fromDate: string;
  toDate: string;
  ownerIds: string[] | null;
  pipelineId: string | null;
}

async function filters(c: any, a: OrgAccess): Promise<Filters> {
  const today = todayIn(a.org.timezone);
  const fromDate = c.req.query('from') || addDays(today, -89);
  const toDate = c.req.query('to') || today;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate) || !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) throw badRequest('Dates must be YYYY-MM-DD');
  const from = Date.parse(`${fromDate}T00:00:00Z`);
  const to = Date.parse(`${toDate}T00:00:00Z`) + DAY;
  if (!(to > from) || to - from > 3 * 366 * DAY) throw badRequest('Choose a date range of up to three years');
  let ownerIds: string[] | null = null;
  const owner = c.req.query('owner');
  const team = c.req.query('team');
  if (owner) ownerIds = [owner === 'me' ? a.userId : owner];
  if (team) {
    const rows = await c.env.DB.prepare('SELECT user_id FROM crm_team_members WHERE org_id = ? AND team_id = ?').bind(a.orgId, team).all();
    const ids = rows.results.map((r: any) => r.user_id as string);
    const inTeam: string[] = ownerIds ? ownerIds.filter((x) => ids.includes(x)) : ids;
    ownerIds = inTeam.length ? inTeam : ['-'];
  }
  return { from, to, fromDate, toDate, ownerIds, pipelineId: c.req.query('pipeline') || null };
}

/** WHERE for one table alias: organisation, not deleted, visibility, owner/team (and pipeline for deals). */
function where(a: OrgAccess, f: Filters, alias: string, module: 'leads' | 'contacts' | 'companies' | 'deals' | 'activities'): { sql: string; args: unknown[] } {
  const parts = [`${alias}.org_id = ?`, `${alias}.deleted_at IS NULL`];
  const args: unknown[] = [a.orgId];
  const s = scopeSql(a, module, alias);
  parts.push(s.sql);
  args.push(...s.args);
  const ownerCol = module === 'activities' ? 'assigned_to' : 'owner_id';
  if (f.ownerIds) {
    parts.push(`${alias}.${ownerCol} IN (${placeholders(f.ownerIds.length)})`);
    args.push(...f.ownerIds);
  }
  if (module === 'deals' && f.pipelineId) {
    parts.push(`${alias}.pipeline_id = ?`);
    args.push(f.pipelineId);
  }
  return { sql: parts.join(' AND '), args };
}

const one = async <T = any>(db: D1Database, sql: string, args: unknown[]) => (await db.prepare(sql).bind(...args).first<T>()) as T;
const all = async <T = any>(db: D1Database, sql: string, args: unknown[]) => (await db.prepare(sql).bind(...args).all<T>()).results;

function months(fromDate: string, toDate: string): string[] {
  const out: string[] = [];
  let y = Number(fromDate.slice(0, 4));
  let m = Number(fromDate.slice(5, 7));
  const end = toDate.slice(0, 7);
  for (let i = 0; i < 40; i++) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    out.push(key);
    if (key >= end) break;
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}

const monthLabel = (k: string) => new Date(`${k}-01T00:00:00Z`).toLocaleDateString('en-AU', { month: 'short', year: '2-digit', timeZone: 'UTC' });

// ------------------------------------------------------------------ dashboard

insightRoutes.get('/orgs/:org/dashboard', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'reports', 'view', 'You cannot see the dashboard');
  const db = c.env.DB;
  const f = await filters(c, a);
  const today = todayIn(a.org.timezone);
  const L = where(a, f, 'l', 'leads');
  const D = where(a, f, 'd', 'deals');
  const A = where(a, f, 'x', 'activities');
  const C = where(a, f, 'ct', 'contacts');
  const CO = where(a, f, 'co', 'companies');
  const qualified = [...statusesOfKind(a.settings, 'qualified'), ...statusesOfKind(a.settings, 'converted')];
  const converted = statusesOfKind(a.settings, 'converted');
  const q = placeholders(Math.max(1, qualified.length));
  const cv = placeholders(Math.max(1, converted.length));
  // The activity trend's twelve weeks start on the Monday eleven weeks before this one, 00:00 UTC.
  const midnight = Math.floor(Date.now() / DAY) * DAY;
  const weeksFrom = midnight - ((new Date(midnight).getUTCDay() + 6) % 7) * DAY - 11 * WEEK;

  const [leads, contacts, companies, deals, period, monthly, stages, sources, team, overdue, meetings, recent, trend] = await Promise.all([
    one(
      db,
      `SELECT COUNT(*) AS total,
        SUM(CASE WHEN l.created_at >= ? AND l.created_at < ? THEN 1 ELSE 0 END) AS new_leads,
        SUM(CASE WHEN l.status IN (${q}) THEN 1 ELSE 0 END) AS qualified,
        SUM(CASE WHEN l.created_at >= ? AND l.created_at < ? AND l.status IN (${cv}) THEN 1 ELSE 0 END) AS converted_new,
        SUM(CASE WHEN l.converted_at >= ? AND l.converted_at < ? THEN 1 ELSE 0 END) AS converted
       FROM crm_leads l WHERE ${L.sql} AND l.archived_at IS NULL`,
      [f.from, f.to, ...(qualified.length ? qualified : ['-']), f.from, f.to, ...(converted.length ? converted : ['-']), f.from, f.to, ...L.args],
    ),
    one(db, `SELECT COUNT(*) AS n FROM crm_contacts ct WHERE ${C.sql} AND ct.archived_at IS NULL`, C.args),
    one(db, `SELECT COUNT(*) AS n FROM crm_companies co WHERE ${CO.sql} AND co.archived_at IS NULL`, CO.args),
    one(
      db,
      `SELECT SUM(CASE WHEN d.status = 'open' THEN 1 ELSE 0 END) AS open_count,
        COALESCE(SUM(CASE WHEN d.status = 'open' THEN d.value ELSE 0 END), 0) AS open_value,
        COALESCE(SUM(CASE WHEN d.status = 'open' THEN d.value * COALESCE(d.probability, s.probability, 0) / 100.0 ELSE 0 END), 0) AS weighted
       FROM crm_deals d LEFT JOIN crm_stages s ON s.id = d.stage_id WHERE ${D.sql} AND d.archived_at IS NULL`,
      D.args,
    ),
    one(
      db,
      `SELECT SUM(CASE WHEN d.status = 'won' AND d.won_at >= ? AND d.won_at < ? THEN 1 ELSE 0 END) AS won_count,
        COALESCE(SUM(CASE WHEN d.status = 'won' AND d.won_at >= ? AND d.won_at < ? THEN d.value ELSE 0 END), 0) AS won_value,
        SUM(CASE WHEN d.status = 'lost' AND d.lost_at >= ? AND d.lost_at < ? THEN 1 ELSE 0 END) AS lost_count,
        COALESCE(SUM(CASE WHEN d.status = 'lost' AND d.lost_at >= ? AND d.lost_at < ? THEN d.value ELSE 0 END), 0) AS lost_value,
        SUM(CASE WHEN d.created_at >= ? AND d.created_at < ? THEN 1 ELSE 0 END) AS created_count
       FROM crm_deals d WHERE ${D.sql}`,
      [f.from, f.to, f.from, f.to, f.from, f.to, f.from, f.to, f.from, f.to, ...D.args],
    ),
    all(db, `SELECT strftime('%Y-%m', d.won_at / 1000, 'unixepoch') AS m, COUNT(*) AS n, SUM(d.value) AS v FROM crm_deals d WHERE ${D.sql} AND d.status = 'won' AND d.won_at >= ? AND d.won_at < ? GROUP BY m`, [...D.args, Date.parse(`${addDays(today, -365).slice(0, 7)}-01T00:00:00Z`), f.to]),
    (async () => {
      const pid = f.pipelineId ?? (await one<{ id: string }>(db, 'SELECT id FROM crm_pipelines WHERE org_id = ? AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1', [a.orgId]))?.id;
      if (!pid) return { pipelineId: null, rows: [] };
      // The stages give the pipeline, so the deals here are filtered without it.
      const DS = where(a, { ...f, pipelineId: null }, 'd', 'deals');
      const rows = await all(
        db,
        `SELECT s.id, s.name, s.probability, COUNT(d.id) AS n, COALESCE(SUM(d.value), 0) AS v FROM crm_stages s
         LEFT JOIN crm_deals d ON d.stage_id = s.id AND d.status = 'open' AND d.archived_at IS NULL AND ${DS.sql}
         WHERE s.org_id = ? AND s.pipeline_id = ? GROUP BY s.id ORDER BY s.position`,
        [...DS.args, a.orgId, pid],
      );
      return { pipelineId: pid, rows };
    })(),
    all(db, `SELECT COALESCE(NULLIF(l.source, ''), 'unknown') AS source, COUNT(*) AS n, SUM(CASE WHEN l.converted_at IS NOT NULL THEN 1 ELSE 0 END) AS converted FROM crm_leads l WHERE ${L.sql} AND l.created_at >= ? AND l.created_at < ? GROUP BY source ORDER BY n DESC LIMIT 12`, [...L.args, f.from, f.to]),
    all(
      db,
      `SELECT m.user_id, u.name,
        (SELECT COUNT(*) FROM crm_deals d WHERE ${D.sql} AND d.owner_id = m.user_id AND d.status = 'won' AND d.won_at >= ? AND d.won_at < ?) AS won_count,
        (SELECT COALESCE(SUM(d.value), 0) FROM crm_deals d WHERE ${D.sql} AND d.owner_id = m.user_id AND d.status = 'won' AND d.won_at >= ? AND d.won_at < ?) AS won_value,
        (SELECT COUNT(*) FROM crm_deals d WHERE ${D.sql} AND d.owner_id = m.user_id AND d.status = 'lost' AND d.lost_at >= ? AND d.lost_at < ?) AS lost_count,
        (SELECT COALESCE(SUM(d.value), 0) FROM crm_deals d WHERE ${D.sql} AND d.owner_id = m.user_id AND d.status = 'open') AS open_value,
        (SELECT COUNT(*) FROM crm_activities x WHERE ${A.sql} AND x.assigned_to = m.user_id AND x.status = 'done' AND x.done_at >= ? AND x.done_at < ?) AS activities_done
       FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ?${f.ownerIds ? ` AND m.user_id IN (${placeholders(f.ownerIds.length)})` : ''} ORDER BY won_value DESC, open_value DESC LIMIT 50`,
      [...D.args, f.from, f.to, ...D.args, f.from, f.to, ...D.args, f.from, f.to, ...D.args, ...A.args, f.from, f.to, a.orgId, ...(f.ownerIds ?? [])],
    ),
    one(db, `SELECT COUNT(*) AS n FROM crm_activities x WHERE ${A.sql} AND x.status = 'open' AND x.due_date < ?`, [...A.args, today]),
    all(
      db,
      `SELECT x.id, x.title, x.type, x.due_date, x.due_time, x.assigned_to, x.location, TRIM(ct.first_name || ' ' || ct.last_name) AS contact_name, co.name AS company_name, dl.title AS deal_title
       FROM crm_activities x LEFT JOIN crm_contacts ct ON ct.id = x.contact_id LEFT JOIN crm_companies co ON co.id = x.company_id LEFT JOIN crm_deals dl ON dl.id = x.deal_id
       WHERE ${A.sql} AND x.status = 'open' AND x.type IN ('meeting','appointment','demo','presentation','visit','call') AND x.due_date BETWEEN ? AND ? ORDER BY x.due_date, x.due_time LIMIT 8`,
      [...A.args, today, addDays(today, 14)],
    ),
    all(
      db,
      `SELECT x.id, x.title, x.type, x.status, x.done_at, x.created_at, x.assigned_to, COALESCE(x.done_by, x.created_by) AS actor_id, TRIM(ct.first_name || ' ' || ct.last_name) AS contact_name, co.name AS company_name, dl.title AS deal_title
       FROM crm_activities x LEFT JOIN crm_contacts ct ON ct.id = x.contact_id LEFT JOIN crm_companies co ON co.id = x.company_id LEFT JOIN crm_deals dl ON dl.id = x.deal_id
       WHERE ${A.sql} ORDER BY COALESCE(x.done_at, x.created_at) DESC LIMIT 10`,
      A.args,
    ),
    // Completed activities per week for the last twelve weeks (Monday to Sunday, UTC), counted by week number from the first.
    all(db, `SELECT CAST((x.done_at - ?) / ? AS INTEGER) AS b, COUNT(*) AS n FROM crm_activities x WHERE ${A.sql} AND x.status = 'done' AND x.done_at >= ? GROUP BY b`, [weeksFrom, WEEK, ...A.args, weeksFrom]),
  ]);
  const won = period?.won_count ?? 0;
  const lost = period?.lost_count ?? 0;
  const mlist = months(addDays(today, -334), today);
  const byMonth = new Map((monthly as any[]).map((r) => [r.m, r]));
  return c.json({
    range: { from: f.fromDate, to: f.toDate },
    currency: a.org.currency,
    kpis: {
      totalLeads: leads?.total ?? 0,
      newLeads: leads?.new_leads ?? 0,
      qualifiedLeads: leads?.qualified ?? 0,
      convertedLeads: leads?.converted ?? 0,
      leadConversionRate: leads?.new_leads ? Math.round(((leads.converted_new ?? 0) / leads.new_leads) * 1000) / 10 : null,
      totalContacts: contacts?.n ?? 0,
      totalCompanies: companies?.n ?? 0,
      openDeals: deals?.open_count ?? 0,
      pipelineValue: deals?.open_value ?? 0,
      weightedForecast: Math.round(deals?.weighted ?? 0),
      wonDeals: won,
      wonValue: period?.won_value ?? 0,
      lostDeals: lost,
      lostValue: period?.lost_value ?? 0,
      newDeals: period?.created_count ?? 0,
      winRate: won + lost ? Math.round((won / (won + lost)) * 1000) / 10 : null,
      overdueFollowUps: overdue?.n ?? 0,
    },
    revenueByMonth: mlist.map((m) => ({ month: m, label: monthLabel(m), value: byMonth.get(m)?.v ?? 0, count: byMonth.get(m)?.n ?? 0 })),
    dealsByStage: { pipelineId: stages.pipelineId, stages: stages.rows.map((s: any) => ({ id: s.id, name: s.name, probability: s.probability, count: s.n, value: s.v })) },
    leadSources: (sources as any[]).map((s) => ({ source: s.source, label: s.source === 'unknown' ? 'Not recorded' : optionLabel(a.settings.sources, s.source) || s.source, count: s.n, converted: s.converted })),
    funnel: [
      { label: 'New leads', value: leads?.new_leads ?? 0 },
      { label: 'Qualified', value: leads?.qualified ?? 0 },
      { label: 'Converted', value: leads?.converted ?? 0 },
      { label: 'Deals created', value: period?.created_count ?? 0 },
      { label: 'Deals won', value: won },
    ],
    team: (team as any[]).map((t) => ({ userId: t.user_id, name: t.name, wonCount: t.won_count, wonValue: t.won_value, lostCount: t.lost_count, openValue: t.open_value, activitiesDone: t.activities_done, winRate: t.won_count + t.lost_count ? Math.round((t.won_count / (t.won_count + t.lost_count)) * 1000) / 10 : null })),
    upcomingMeetings: meetings,
    recentActivities: recent,
    // Every week appears, an empty one as 0, so the line shows the gaps.
    activityTrend: Array.from({ length: 12 }, (_, i) => {
      const start = weeksFrom + i * WEEK;
      return { week: new Date(start).toISOString().slice(0, 10), label: new Date(start).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' }), count: (trend as any[]).find((t) => t.b === i)?.n ?? 0 };
    }),
  });
});

// ------------------------------------------------------------------ reports

export const REPORTS = {
  'lead-conversion': 'Lead conversion',
  pipeline: 'Sales pipeline',
  revenue: 'Revenue',
  'win-loss': 'Won and lost deals',
  performance: 'Salesperson performance',
  sources: 'Lead source performance',
  activities: 'Activities',
  trends: 'Monthly and quarterly trends',
  forecast: 'Forecast revenue',
  ageing: 'Deal ageing',
  cycle: 'Sales cycle duration',
} as const;
export type ReportKey = keyof typeof REPORTS;

type Kind = 'text' | 'number' | 'money' | 'percent' | 'days';
interface Report {
  key: ReportKey;
  title: string;
  description: string;
  summary: { label: string; value: number | null; kind: Kind }[];
  chart: { type: 'bar' | 'line' | 'donut'; label: string; kind: Kind; series: { label: string; value: number }[] } | null;
  columns: { key: string; label: string; kind: Kind }[];
  rows: Record<string, unknown>[];
}

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : null);
const days = (ms: number | null) => (ms === null || ms === undefined ? null : Math.round((ms / DAY) * 10) / 10);

async function buildReport(db: D1Database, a: OrgAccess, f: Filters, key: ReportKey): Promise<Report> {
  const L = where(a, f, 'l', 'leads');
  const D = where(a, f, 'd', 'deals');
  const A = where(a, f, 'x', 'activities');
  const today = todayIn(a.org.timezone);
  const base = { key, title: REPORTS[key] };
  const qualified = [...statusesOfKind(a.settings, 'qualified'), ...statusesOfKind(a.settings, 'converted')];
  const ownerNames = new Map((await all<{ id: string; name: string }>(db, 'SELECT u.id, u.name FROM users u JOIN crm_members m ON m.user_id = u.id WHERE m.org_id = ? UNION SELECT u.id, u.name FROM users u WHERE u.id IN (SELECT owner_id FROM crm_deals WHERE org_id = ?)', [a.orgId, a.orgId])).map((r) => [r.id, r.name]));
  const owner = (id: string | null) => (id ? (ownerNames.get(id) ?? 'Former member') : 'Unassigned');
  switch (key) {
    case 'lead-conversion': {
      const rows = await all(db, `SELECT strftime('%Y-%m', l.created_at / 1000, 'unixepoch') AS m, COUNT(*) AS created, SUM(CASE WHEN l.status IN (${placeholders(Math.max(1, qualified.length))}) THEN 1 ELSE 0 END) AS qualified, SUM(CASE WHEN l.converted_at IS NOT NULL THEN 1 ELSE 0 END) AS converted, SUM(CASE WHEN l.status IN (${placeholders(Math.max(1, statusesOfKind(a.settings, 'unqualified').length))}) THEN 1 ELSE 0 END) AS unqualified FROM crm_leads l WHERE ${L.sql} AND l.created_at >= ? AND l.created_at < ? GROUP BY m ORDER BY m`, [
        ...(qualified.length ? qualified : ['-']),
        ...(statusesOfKind(a.settings, 'unqualified').length ? statusesOfKind(a.settings, 'unqualified') : ['-']),
        ...L.args,
        f.from,
        f.to,
      ]);
      const tot = rows.reduce((s: any, r: any) => ({ created: s.created + r.created, converted: s.converted + r.converted, qualified: s.qualified + r.qualified }), { created: 0, converted: 0, qualified: 0 });
      return {
        ...base,
        description: 'Leads created in the period, and how many of them were qualified and converted.',
        summary: [
          { label: 'Leads created', value: tot.created, kind: 'number' },
          { label: 'Qualified', value: tot.qualified, kind: 'number' },
          { label: 'Converted', value: tot.converted, kind: 'number' },
          { label: 'Conversion rate', value: pct(tot.converted, tot.created), kind: 'percent' },
        ],
        chart: { type: 'bar', label: 'Converted leads by month created', kind: 'number', series: rows.map((r: any) => ({ label: monthLabel(r.m), value: r.converted })) },
        columns: [
          { key: 'month', label: 'Month', kind: 'text' },
          { key: 'created', label: 'Created', kind: 'number' },
          { key: 'qualified', label: 'Qualified', kind: 'number' },
          { key: 'unqualified', label: 'Unqualified', kind: 'number' },
          { key: 'converted', label: 'Converted', kind: 'number' },
          { key: 'rate', label: 'Conversion rate', kind: 'percent' },
        ],
        rows: rows.map((r: any) => ({ month: monthLabel(r.m), created: r.created, qualified: r.qualified, unqualified: r.unqualified, converted: r.converted, rate: pct(r.converted, r.created) })),
      };
    }
    case 'pipeline': {
      const rows = await all(
        db,
        `SELECT p.name AS pipeline, s.name AS stage, s.probability, COUNT(d.id) AS n, COALESCE(SUM(d.value), 0) AS v, COALESCE(SUM(d.value * COALESCE(d.probability, s.probability) / 100.0), 0) AS w, AVG(? - d.stage_entered_at) AS age
         FROM crm_stages s JOIN crm_pipelines p ON p.id = s.pipeline_id LEFT JOIN crm_deals d ON d.stage_id = s.id AND d.status = 'open' AND d.archived_at IS NULL AND ${D.sql}
         WHERE s.org_id = ? AND p.archived_at IS NULL${f.pipelineId ? ' AND p.id = ?' : ''} GROUP BY s.id ORDER BY p.position, s.position`,
        [Date.now(), ...D.args, a.orgId, ...(f.pipelineId ? [f.pipelineId] : [])],
      );
      const tot = rows.reduce((s: any, r: any) => ({ n: s.n + r.n, v: s.v + r.v, w: s.w + r.w }), { n: 0, v: 0, w: 0 });
      return {
        ...base,
        description: 'Open deals by pipeline and stage today: count, value, weighted value and how long they have been in the stage.',
        summary: [
          { label: 'Open deals', value: tot.n, kind: 'number' },
          { label: 'Pipeline value', value: tot.v, kind: 'money' },
          { label: 'Weighted value', value: Math.round(tot.w), kind: 'money' },
        ],
        chart: { type: 'bar', label: 'Value by stage', kind: 'money', series: rows.map((r: any) => ({ label: r.stage, value: r.v })) },
        columns: [
          { key: 'pipeline', label: 'Pipeline', kind: 'text' },
          { key: 'stage', label: 'Stage', kind: 'text' },
          { key: 'probability', label: 'Probability', kind: 'percent' },
          { key: 'count', label: 'Deals', kind: 'number' },
          { key: 'value', label: 'Value', kind: 'money' },
          { key: 'weighted', label: 'Weighted', kind: 'money' },
          { key: 'age', label: 'Average days in stage', kind: 'days' },
        ],
        rows: rows.map((r: any) => ({ pipeline: r.pipeline, stage: r.stage, probability: r.probability, count: r.n, value: r.v, weighted: Math.round(r.w), age: r.n ? days(r.age) : null })),
      };
    }
    case 'revenue':
    case 'trends': {
      const rows = await all(db, `SELECT strftime('%Y-%m', d.won_at / 1000, 'unixepoch') AS m, COUNT(*) AS n, SUM(d.value) AS v FROM crm_deals d WHERE ${D.sql} AND d.status = 'won' AND d.won_at >= ? AND d.won_at < ? GROUP BY m`, [...D.args, f.from, f.to]);
      const created = await all(db, `SELECT strftime('%Y-%m', d.created_at / 1000, 'unixepoch') AS m, COUNT(*) AS n, SUM(d.value) AS v FROM crm_deals d WHERE ${D.sql} AND d.created_at >= ? AND d.created_at < ? GROUP BY m`, [...D.args, f.from, f.to]);
      const byM = new Map(rows.map((r: any) => [r.m, r]));
      const byC = new Map(created.map((r: any) => [r.m, r]));
      const ms = months(f.fromDate, f.toDate);
      const monthRows = ms.map((m) => ({ period: monthLabel(m), won: byM.get(m)?.n ?? 0, revenue: byM.get(m)?.v ?? 0, created: byC.get(m)?.n ?? 0, createdValue: byC.get(m)?.v ?? 0, average: byM.get(m)?.n ? Math.round(byM.get(m).v / byM.get(m).n) : null }));
      const total = monthRows.reduce((s, r) => s + r.revenue, 0);
      const count = monthRows.reduce((s, r) => s + r.won, 0);
      if (key === 'revenue') {
        return {
          ...base,
          description: 'Revenue from deals won in the period, by month.',
          summary: [
            { label: 'Revenue', value: total, kind: 'money' },
            { label: 'Deals won', value: count, kind: 'number' },
            { label: 'Average deal size', value: count ? Math.round(total / count) : null, kind: 'money' },
          ],
          chart: { type: 'bar', label: 'Revenue by month', kind: 'money', series: monthRows.map((r) => ({ label: r.period, value: r.revenue })) },
          columns: [
            { key: 'period', label: 'Month', kind: 'text' },
            { key: 'won', label: 'Deals won', kind: 'number' },
            { key: 'revenue', label: 'Revenue', kind: 'money' },
            { key: 'average', label: 'Average deal', kind: 'money' },
          ],
          rows: monthRows,
        };
      }
      const quarters = new Map<string, { won: number; revenue: number; created: number }>();
      for (const m of ms) {
        const qk = `Q${Math.ceil(Number(m.slice(5)) / 3)} ${m.slice(0, 4)}`;
        const cur = quarters.get(qk) ?? { won: 0, revenue: 0, created: 0 };
        cur.won += byM.get(m)?.n ?? 0;
        cur.revenue += byM.get(m)?.v ?? 0;
        cur.created += byC.get(m)?.n ?? 0;
        quarters.set(qk, cur);
      }
      return {
        ...base,
        description: 'Deals created and won per month and per quarter.',
        summary: [
          { label: 'Revenue', value: total, kind: 'money' },
          { label: 'Deals won', value: count, kind: 'number' },
          { label: 'Deals created', value: monthRows.reduce((s, r) => s + r.created, 0), kind: 'number' },
        ],
        chart: { type: 'line', label: 'Revenue by month', kind: 'money', series: monthRows.map((r) => ({ label: r.period, value: r.revenue })) },
        columns: [
          { key: 'period', label: 'Period', kind: 'text' },
          { key: 'created', label: 'Deals created', kind: 'number' },
          { key: 'won', label: 'Deals won', kind: 'number' },
          { key: 'revenue', label: 'Revenue', kind: 'money' },
        ],
        rows: [...monthRows.map((r) => ({ period: r.period, created: r.created, won: r.won, revenue: r.revenue })), ...[...quarters.entries()].map(([k, v]) => ({ period: k, ...v }))],
      };
    }
    case 'win-loss': {
      const tot = await one(db, `SELECT SUM(CASE WHEN d.status = 'won' THEN 1 ELSE 0 END) AS won, SUM(CASE WHEN d.status = 'lost' THEN 1 ELSE 0 END) AS lost, COALESCE(SUM(CASE WHEN d.status = 'won' THEN d.value END), 0) AS won_value, COALESCE(SUM(CASE WHEN d.status = 'lost' THEN d.value END), 0) AS lost_value FROM crm_deals d WHERE ${D.sql} AND ((d.status = 'won' AND d.won_at >= ? AND d.won_at < ?) OR (d.status = 'lost' AND d.lost_at >= ? AND d.lost_at < ?))`, [
        ...D.args,
        f.from,
        f.to,
        f.from,
        f.to,
      ]);
      const reasons = await all(db, `SELECT COALESCE(NULLIF(d.lost_reason, ''), 'not given') AS r, COUNT(*) AS n, SUM(d.value) AS v FROM crm_deals d WHERE ${D.sql} AND d.status = 'lost' AND d.lost_at >= ? AND d.lost_at < ? GROUP BY r ORDER BY n DESC`, [...D.args, f.from, f.to]);
      return {
        ...base,
        description: 'Deals closed in the period: won against lost, and why deals were lost.',
        summary: [
          { label: 'Won', value: tot?.won ?? 0, kind: 'number' },
          { label: 'Lost', value: tot?.lost ?? 0, kind: 'number' },
          { label: 'Win rate', value: pct(tot?.won ?? 0, (tot?.won ?? 0) + (tot?.lost ?? 0)), kind: 'percent' },
          { label: 'Value won', value: tot?.won_value ?? 0, kind: 'money' },
          { label: 'Value lost', value: tot?.lost_value ?? 0, kind: 'money' },
        ],
        chart: { type: 'donut', label: 'Lost reasons', kind: 'number', series: reasons.map((r: any) => ({ label: optionLabel(a.settings.lostReasons, r.r) || r.r, value: r.n })) },
        columns: [
          { key: 'reason', label: 'Lost reason', kind: 'text' },
          { key: 'count', label: 'Deals', kind: 'number' },
          { key: 'value', label: 'Value', kind: 'money' },
          { key: 'share', label: 'Share of lost deals', kind: 'percent' },
        ],
        rows: reasons.map((r: any) => ({ reason: r.r === 'not given' ? 'Not given' : optionLabel(a.settings.lostReasons, r.r) || r.r, count: r.n, value: r.v, share: pct(r.n, tot?.lost ?? 0) })),
      };
    }
    case 'performance': {
      const per = await all(
        db,
        `SELECT d.owner_id,
          SUM(CASE WHEN d.status = 'won' AND d.won_at >= ? AND d.won_at < ? THEN 1 ELSE 0 END) AS won,
          COALESCE(SUM(CASE WHEN d.status = 'won' AND d.won_at >= ? AND d.won_at < ? THEN d.value END), 0) AS won_value,
          SUM(CASE WHEN d.status = 'lost' AND d.lost_at >= ? AND d.lost_at < ? THEN 1 ELSE 0 END) AS lost,
          SUM(CASE WHEN d.status = 'open' THEN 1 ELSE 0 END) AS open,
          COALESCE(SUM(CASE WHEN d.status = 'open' THEN d.value END), 0) AS open_value,
          AVG(CASE WHEN d.status = 'won' AND d.won_at >= ? AND d.won_at < ? THEN d.won_at - d.created_at END) AS cycle
         FROM crm_deals d WHERE ${D.sql} GROUP BY d.owner_id`,
        [f.from, f.to, f.from, f.to, f.from, f.to, f.from, f.to, ...D.args],
      );
      const acts = await all(db, `SELECT x.assigned_to AS owner_id, COUNT(*) AS n FROM crm_activities x WHERE ${A.sql} AND x.status = 'done' AND x.done_at >= ? AND x.done_at < ? GROUP BY x.assigned_to`, [...A.args, f.from, f.to]);
      const actMap = new Map(acts.map((r: any) => [r.owner_id, r.n]));
      const ids = new Set([...per.map((r: any) => r.owner_id), ...acts.map((r: any) => r.owner_id)]);
      const out = [...ids].map((id) => {
        const r: any = per.find((x: any) => x.owner_id === id) ?? { won: 0, won_value: 0, lost: 0, open: 0, open_value: 0, cycle: null };
        return { person: owner(id), won: r.won, wonValue: r.won_value, lost: r.lost, winRate: pct(r.won, r.won + r.lost), averageDeal: r.won ? Math.round(r.won_value / r.won) : null, open: r.open, openValue: r.open_value, cycle: days(r.cycle), activities: actMap.get(id) ?? 0 };
      });
      out.sort((x, y) => y.wonValue - x.wonValue || y.openValue - x.openValue);
      return {
        ...base,
        description: 'Each owner: deals won and lost in the period, win rate, average deal, open pipeline, sales cycle and completed activities.',
        summary: [
          { label: 'People', value: out.length, kind: 'number' },
          { label: 'Revenue', value: out.reduce((s, r) => s + r.wonValue, 0), kind: 'money' },
        ],
        chart: { type: 'bar', label: 'Revenue by owner', kind: 'money', series: out.slice(0, 12).map((r) => ({ label: r.person, value: r.wonValue })) },
        columns: [
          { key: 'person', label: 'Owner', kind: 'text' },
          { key: 'won', label: 'Won', kind: 'number' },
          { key: 'wonValue', label: 'Revenue', kind: 'money' },
          { key: 'lost', label: 'Lost', kind: 'number' },
          { key: 'winRate', label: 'Win rate', kind: 'percent' },
          { key: 'averageDeal', label: 'Average deal', kind: 'money' },
          { key: 'open', label: 'Open deals', kind: 'number' },
          { key: 'openValue', label: 'Open value', kind: 'money' },
          { key: 'cycle', label: 'Sales cycle (days)', kind: 'days' },
          { key: 'activities', label: 'Activities done', kind: 'number' },
        ],
        rows: out,
      };
    }
    case 'sources': {
      const leads = await all(db, `SELECT COALESCE(NULLIF(l.source, ''), 'unknown') AS s, COUNT(*) AS n, SUM(CASE WHEN l.converted_at IS NOT NULL THEN 1 ELSE 0 END) AS converted FROM crm_leads l WHERE ${L.sql} AND l.created_at >= ? AND l.created_at < ? GROUP BY s`, [...L.args, f.from, f.to]);
      const deals = await all(db, `SELECT COALESCE(NULLIF(d.source, ''), 'unknown') AS s, SUM(CASE WHEN d.status = 'won' THEN 1 ELSE 0 END) AS won, COALESCE(SUM(CASE WHEN d.status = 'won' THEN d.value END), 0) AS v FROM crm_deals d WHERE ${D.sql} AND d.status = 'won' AND d.won_at >= ? AND d.won_at < ? GROUP BY s`, [...D.args, f.from, f.to]);
      const keys = new Set([...leads.map((r: any) => r.s), ...deals.map((r: any) => r.s)]);
      const rows = [...keys].map((k) => {
        const l: any = leads.find((x: any) => x.s === k) ?? { n: 0, converted: 0 };
        const d: any = deals.find((x: any) => x.s === k) ?? { won: 0, v: 0 };
        return { source: k === 'unknown' ? 'Not recorded' : optionLabel(a.settings.sources, k) || k, leads: l.n, converted: l.converted, rate: pct(l.converted, l.n), won: d.won, revenue: d.v };
      });
      rows.sort((x, y) => y.leads - x.leads || y.revenue - x.revenue);
      return {
        ...base,
        description: 'For each source: leads created in the period, how many converted, and revenue from deals won from that source.',
        summary: [
          { label: 'Leads', value: rows.reduce((s, r) => s + r.leads, 0), kind: 'number' },
          { label: 'Converted', value: rows.reduce((s, r) => s + r.converted, 0), kind: 'number' },
          { label: 'Revenue', value: rows.reduce((s, r) => s + r.revenue, 0), kind: 'money' },
        ],
        chart: { type: 'donut', label: 'Leads by source', kind: 'number', series: rows.map((r) => ({ label: r.source, value: r.leads })) },
        columns: [
          { key: 'source', label: 'Source', kind: 'text' },
          { key: 'leads', label: 'Leads', kind: 'number' },
          { key: 'converted', label: 'Converted', kind: 'number' },
          { key: 'rate', label: 'Conversion rate', kind: 'percent' },
          { key: 'won', label: 'Deals won', kind: 'number' },
          { key: 'revenue', label: 'Revenue', kind: 'money' },
        ],
        rows,
      };
    }
    case 'activities': {
      const rows = await all(
        db,
        `SELECT x.type, x.assigned_to, SUM(CASE WHEN x.created_at >= ? AND x.created_at < ? THEN 1 ELSE 0 END) AS created, SUM(CASE WHEN x.status = 'done' AND x.done_at >= ? AND x.done_at < ? THEN 1 ELSE 0 END) AS done, SUM(CASE WHEN x.status = 'open' AND x.due_date < ? THEN 1 ELSE 0 END) AS overdue
         FROM crm_activities x WHERE ${A.sql} GROUP BY x.type, x.assigned_to`,
        [f.from, f.to, f.from, f.to, today, ...A.args],
      );
      const byType = new Map<string, { created: number; done: number; overdue: number }>();
      for (const r of rows as any[]) {
        const cur = byType.get(r.type) ?? { created: 0, done: 0, overdue: 0 };
        cur.created += r.created;
        cur.done += r.done;
        cur.overdue += r.overdue;
        byType.set(r.type, cur);
      }
      return {
        ...base,
        description: 'Activities created and completed in the period, and those overdue today, by type and person.',
        summary: [
          { label: 'Created', value: [...byType.values()].reduce((s, r) => s + r.created, 0), kind: 'number' },
          { label: 'Completed', value: [...byType.values()].reduce((s, r) => s + r.done, 0), kind: 'number' },
          { label: 'Overdue now', value: [...byType.values()].reduce((s, r) => s + r.overdue, 0), kind: 'number' },
        ],
        chart: { type: 'bar', label: 'Completed by type', kind: 'number', series: [...byType.entries()].map(([t, v]) => ({ label: optionLabel(a.settings.activityTypes, t) || t, value: v.done })) },
        columns: [
          { key: 'type', label: 'Type', kind: 'text' },
          { key: 'person', label: 'Assigned to', kind: 'text' },
          { key: 'created', label: 'Created', kind: 'number' },
          { key: 'done', label: 'Completed', kind: 'number' },
          { key: 'overdue', label: 'Overdue now', kind: 'number' },
        ],
        rows: (rows as any[]).filter((r) => r.created || r.done || r.overdue).map((r) => ({ type: optionLabel(a.settings.activityTypes, r.type) || r.type, person: owner(r.assigned_to), created: r.created, done: r.done, overdue: r.overdue })),
      };
    }
    case 'forecast': {
      const rows = await all(
        db,
        `SELECT COALESCE(substr(d.expected_close_date, 1, 7), 'none') AS m, COUNT(*) AS n, SUM(d.value) AS v, SUM(d.value * COALESCE(d.probability, s.probability, 0) / 100.0) AS w,
          SUM(CASE WHEN COALESCE(d.probability, s.probability, 0) >= 75 THEN d.value ELSE 0 END) AS commit_v
         FROM crm_deals d LEFT JOIN crm_stages s ON s.id = d.stage_id WHERE ${D.sql} AND d.status = 'open' AND d.archived_at IS NULL GROUP BY m ORDER BY m`,
        D.args,
      );
      const past = rows.filter((r: any) => r.m !== 'none' && r.m < today.slice(0, 7));
      const ahead = rows.filter((r: any) => r.m !== 'none' && r.m >= today.slice(0, 7));
      const none = rows.find((r: any) => r.m === 'none');
      const out = [
        ...(past.length ? [{ period: 'Past due', count: past.reduce((s: number, r: any) => s + r.n, 0), value: past.reduce((s: number, r: any) => s + r.v, 0), weighted: Math.round(past.reduce((s: number, r: any) => s + r.w, 0)), commit: past.reduce((s: number, r: any) => s + r.commit_v, 0) }] : []),
        ...ahead.map((r: any) => ({ period: monthLabel(r.m), count: r.n, value: r.v, weighted: Math.round(r.w), commit: r.commit_v })),
        ...(none ? [{ period: 'No close date', count: none.n, value: none.v, weighted: Math.round(none.w), commit: none.commit_v }] : []),
      ];
      return {
        ...base,
        description: 'Open deals by expected close month: total value, weighted value (value x probability) and commit (deals at 75% or more).',
        summary: [
          { label: 'Open value', value: out.reduce((s, r) => s + r.value, 0), kind: 'money' },
          { label: 'Weighted forecast', value: out.reduce((s, r) => s + r.weighted, 0), kind: 'money' },
          { label: 'Commit', value: out.reduce((s, r) => s + r.commit, 0), kind: 'money' },
        ],
        chart: { type: 'bar', label: 'Weighted forecast by month', kind: 'money', series: out.map((r) => ({ label: r.period, value: r.weighted })) },
        columns: [
          { key: 'period', label: 'Expected close', kind: 'text' },
          { key: 'count', label: 'Deals', kind: 'number' },
          { key: 'value', label: 'Value', kind: 'money' },
          { key: 'weighted', label: 'Weighted', kind: 'money' },
          { key: 'commit', label: 'Commit (75%+)', kind: 'money' },
        ],
        rows: out,
      };
    }
    case 'ageing': {
      const rows = await all(
        db,
        `SELECT d.id, d.title, d.value, d.owner_id, d.created_at, d.stage_entered_at, d.expected_close_date, s.name AS stage, co.name AS company FROM crm_deals d LEFT JOIN crm_stages s ON s.id = d.stage_id LEFT JOIN crm_companies co ON co.id = d.company_id
         WHERE ${D.sql} AND d.status = 'open' AND d.archived_at IS NULL ORDER BY d.created_at LIMIT 500`,
        D.args,
      );
      const t = Date.now();
      const buckets = [
        { label: 'Under 30 days', max: 30 },
        { label: '30 to 60 days', max: 60 },
        { label: '60 to 90 days', max: 90 },
        { label: '90 to 180 days', max: 180 },
        { label: 'Over 180 days', max: Infinity },
      ].map((b) => ({ ...b, value: 0 }));
      const out = (rows as any[]).map((r) => {
        const age = (t - r.created_at) / DAY;
        buckets.find((b) => age < b.max)!.value++;
        return { deal: r.title, company: r.company ?? '', stage: r.stage ?? '', owner: owner(r.owner_id), value: r.value, age: Math.floor(age), inStage: Math.floor((t - r.stage_entered_at) / DAY), closeDate: r.expected_close_date ?? '', overdue: r.expected_close_date && r.expected_close_date < today ? 'Yes' : '' };
      });
      return {
        ...base,
        description: 'Open deals by age (days since created) and days in their current stage; oldest first.',
        summary: [
          { label: 'Open deals', value: out.length, kind: 'number' },
          { label: 'Average age', value: out.length ? Math.round(out.reduce((s, r) => s + r.age, 0) / out.length) : null, kind: 'days' },
          { label: 'Past their close date', value: out.filter((r) => r.overdue).length, kind: 'number' },
        ],
        chart: { type: 'bar', label: 'Open deals by age', kind: 'number', series: buckets.map((b) => ({ label: b.label, value: b.value })) },
        columns: [
          { key: 'deal', label: 'Deal', kind: 'text' },
          { key: 'company', label: 'Company', kind: 'text' },
          { key: 'stage', label: 'Stage', kind: 'text' },
          { key: 'owner', label: 'Owner', kind: 'text' },
          { key: 'value', label: 'Value', kind: 'money' },
          { key: 'age', label: 'Age (days)', kind: 'days' },
          { key: 'inStage', label: 'Days in stage', kind: 'days' },
          { key: 'closeDate', label: 'Expected close', kind: 'text' },
          { key: 'overdue', label: 'Past close date', kind: 'text' },
        ],
        rows: out,
      };
    }
    case 'cycle': {
      const rows = await all(db, `SELECT d.owner_id, p.name AS pipeline, d.won_at - d.created_at AS ms, d.value FROM crm_deals d JOIN crm_pipelines p ON p.id = d.pipeline_id WHERE ${D.sql} AND d.status = 'won' AND d.won_at >= ? AND d.won_at < ?`, [...D.args, f.from, f.to]);
      const groups = new Map<string, { n: number; total: number; min: number; max: number; value: number }>();
      for (const r of rows as any[]) {
        for (const k of [`Pipeline: ${r.pipeline}`, `Owner: ${owner(r.owner_id)}`]) {
          const g = groups.get(k) ?? { n: 0, total: 0, min: Infinity, max: 0, value: 0 };
          g.n++;
          g.total += r.ms;
          g.min = Math.min(g.min, r.ms);
          g.max = Math.max(g.max, r.ms);
          g.value += r.value;
          groups.set(k, g);
        }
      }
      const all_ = (rows as any[]).map((r) => r.ms).sort((x, y) => x - y);
      const median = all_.length ? all_[Math.floor(all_.length / 2)] : null;
      return {
        ...base,
        description: 'Days from a deal being created to being won, for deals won in the period.',
        summary: [
          { label: 'Deals won', value: all_.length, kind: 'number' },
          { label: 'Average cycle', value: all_.length ? days(all_.reduce((s, x) => s + x, 0) / all_.length) : null, kind: 'days' },
          { label: 'Median cycle', value: days(median), kind: 'days' },
        ],
        chart: { type: 'bar', label: 'Average days to win', kind: 'days', series: [...groups.entries()].filter(([k]) => k.startsWith('Owner')).map(([k, g]) => ({ label: k.slice(7), value: days(g.total / g.n) ?? 0 })) },
        columns: [
          { key: 'group', label: 'Group', kind: 'text' },
          { key: 'won', label: 'Deals won', kind: 'number' },
          { key: 'average', label: 'Average days', kind: 'days' },
          { key: 'shortest', label: 'Shortest', kind: 'days' },
          { key: 'longest', label: 'Longest', kind: 'days' },
          { key: 'revenue', label: 'Revenue', kind: 'money' },
        ],
        rows: [...groups.entries()].map(([k, g]) => ({ group: k, won: g.n, average: days(g.total / g.n), shortest: days(g.min), longest: days(g.max), revenue: g.value })),
      };
    }
  }
}

insightRoutes.get('/orgs/:org/reports', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'reports', 'view', 'You cannot see reports');
  return c.json(Object.entries(REPORTS).map(([key, title]) => ({ key, title })));
});

insightRoutes.get('/orgs/:org/reports/:key', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'reports', 'view', 'You cannot see reports');
  const key = c.req.param('key') as ReportKey;
  if (!(key in REPORTS)) throw badRequest('Unknown report');
  const f = await filters(c, a);
  const report = await buildReport(c.env.DB, a, f, key);
  if (c.req.query('format') === 'csv') {
    requirePerm(a, 'reports', 'export', 'You cannot export reports');
    const cell = (v: unknown, kind: Kind) => (v === null || v === undefined ? '' : kind === 'money' ? fromMinor(Number(v), a.org.currency) : (v as string | number));
    const csv = toCsv(
      report.columns.map((col) => (col.kind === 'money' ? `${col.label} (${a.org.currency})` : col.kind === 'percent' ? `${col.label} (%)` : col.label)),
      report.rows.map((r) => report.columns.map((col) => cell(r[col.key], col.kind))),
    );
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'report.exported', targetType: 'report', targetId: key, metadata: { from: f.fromDate, to: f.toDate }, ip: clientIp(c) }).run();
    return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${key}-${f.fromDate}-to-${f.toDate}.csv"`, 'Cache-Control': 'no-store' } });
  }
  return c.json({ ...report, range: { from: f.fromDate, to: f.toDate }, currency: a.org.currency });
});
