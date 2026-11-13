// The CRM overview (dashboard) and reports. Every figure comes from the server, computed from the organisation's
// records for the chosen dates, owner, team and pipeline.
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { appUrl } from '../lib/base';
import { usePageTitle } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { BarChart, DonutChart, LineChart, type ChartDatum } from '../components/charts/Charts';
import { BRAND } from '../lib/brand';
import { Stat, PersonChip } from './ui';
import { activityIcon } from './Activities';
import { addDaysIso, crm, download, labelOf, major, recordPath, seriesColor, shortDate, todayLocal, useCurrentOrg, useMoney, usePipelines } from './lib';

interface Range {
  from: string;
  to: string;
  owner: string;
  team: string;
  pipeline: string;
}

const PRESETS: { key: string; label: string; days: number }[] = [
  { key: '30', label: 'Last 30 days', days: 29 },
  { key: '90', label: 'Last 90 days', days: 89 },
  { key: '365', label: 'Last 12 months', days: 364 },
];

function useRange(): [Range, (r: Partial<Range>) => void] {
  const today = todayLocal();
  const [r, setR] = useState<Range>({ from: addDaysIso(today, -89), to: today, owner: '', team: '', pipeline: '' });
  return [r, (p) => setR((x) => ({ ...x, ...p }))];
}

function qs(r: Range) {
  const p = new URLSearchParams({ from: r.from, to: r.to });
  if (r.owner) p.set('owner', r.owner);
  if (r.team) p.set('team', r.team);
  if (r.pipeline) p.set('pipeline', r.pipeline);
  return p.toString();
}

/** Filters in one row above the figures. */
function RangeBar({ r, set, showPipeline = true }: { r: Range; set: (p: Partial<Range>) => void; showPipeline?: boolean }) {
  const org = useCurrentOrg();
  const pipelines = usePipelines().data ?? [];
  const teams = useQuery({ queryKey: ['crm', org.id, 'teams'], queryFn: () => get<{ id: string; name: string }[]>(crm(org.id, '/teams')) });
  const members = useQuery({ queryKey: ['crm', org.id, 'members'], queryFn: () => get<{ userId: string; name: string }[]>(crm(org.id, '/members')) });
  const today = todayLocal();
  const preset = PRESETS.find((p) => r.to === today && r.from === addDaysIso(today, -p.days))?.key ?? '';
  return (
    <div className="row wrap crm-toolbar crm-rangebar" role="group" aria-label="Filters">
      <select className="select" aria-label="Period" value={preset} onChange={(e) => { const p = PRESETS.find((x) => x.key === e.target.value); if (p) set({ from: addDaysIso(today, -p.days), to: today }); }}>
        {PRESETS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        {!preset ? <option value="">Chosen dates</option> : null}
      </select>
      <label className="row small">From <input className="input" type="date" value={r.from} max={r.to} onChange={(e) => e.target.value && set({ from: e.target.value })} /></label>
      <label className="row small">to <input className="input" type="date" value={r.to} min={r.from} onChange={(e) => e.target.value && set({ to: e.target.value })} /></label>
      <select className="select" aria-label="Owner" value={r.owner} onChange={(e) => set({ owner: e.target.value })}>
        <option value="">Everyone</option>
        <option value="me">Me</option>
        {(members.data ?? []).map((m) => <option key={m.userId} value={m.userId}>{m.name}</option>)}
      </select>
      {teams.data?.length ? (
        <select className="select" aria-label="Team" value={r.team} onChange={(e) => set({ team: e.target.value })}>
          <option value="">All teams</option>
          {teams.data.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      ) : null}
      {showPipeline && pipelines.length > 1 ? (
        <select className="select" aria-label="Pipeline" value={r.pipeline} onChange={(e) => set({ pipeline: e.target.value })}>
          <option value="">All pipelines</option>
          {pipelines.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      ) : null}
    </div>
  );
}

interface Dashboard {
  range: { from: string; to: string };
  currency: string;
  kpis: Record<string, number | null>;
  revenueByMonth: { month: string; label: string; value: number; count: number }[];
  dealsByStage: { pipelineId: string | null; stages: { id: string; name: string; probability: number; count: number; value: number }[] };
  leadSources: { source: string; label: string; count: number; converted: number }[];
  funnel: { label: string; value: number }[];
  team: { userId: string; name: string; wonCount: number; wonValue: number; lostCount: number; openValue: number; activitiesDone: number; winRate: number | null }[];
  upcomingMeetings: any[];
  recentActivities: any[];
  activityTrend: { week: string; label: string; count: number }[];
}

const single = (label: string, value: number, key = label): ChartDatum => ({ key, label, value, color: BRAND.colors.teal });

export function Overview() {
  const org = useCurrentOrg();
  const { fmt, currency } = useMoney();
  const [r, set] = useRange();
  usePageTitle('Overview');
  const q = useQuery({ queryKey: ['crm', org.id, 'dashboard', qs(r)], queryFn: () => get<Dashboard>(`${crm(org.id, '/dashboard')}?${qs(r)}`), enabled: org.perms.reports.view, placeholderData: keepPreviousData });
  const base = `/o/${org.id}`;
  if (!org.perms.reports.view) return <div className="page"><EmptyState icon="chart" title="Your role does not include the dashboard">Open your leads, contacts and deals from the menu.</EmptyState></div>;
  const d = q.data;
  const k = d?.kpis ?? {};
  const pct = (v: number | null | undefined) => (v === null || v === undefined ? 'No data' : `${v}%`);
  return (
    <div className="page crm-page crm-dashboard">
      <PageHeader title="Overview" icon="chart" subtitle={`${org.name}: sales and customer activity`} actions={q.isFetching ? <Spinner /> : null} />
      <RangeBar r={r} set={set} />
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!d ? (
        <Loading />
      ) : (
        <>
          <div className="crm-stats">
            <Stat label="Open pipeline" value={fmt(k.pipelineValue ?? 0)} hint={`${k.openDeals} open deals`} to={`${base}/deals`} />
            <Stat label="Weighted forecast" value={fmt(k.weightedForecast ?? 0)} hint="Value x probability" to={`${base}/reports/forecast`} />
            <Stat label="Won" value={fmt(k.wonValue ?? 0)} hint={`${k.wonDeals} deals in the period`} to={`${base}/deals?view=won`} />
            <Stat label="Win rate" value={pct(k.winRate)} hint={`${k.wonDeals} won, ${k.lostDeals} lost (${fmt(k.lostValue ?? 0, true)})`} to={`${base}/reports/win-loss`} />
            <Stat label="New leads" value={String(k.newLeads ?? 0)} hint={`${k.totalLeads} leads in total, ${k.qualifiedLeads} qualified`} to={`${base}/leads?view=new`} />
            <Stat label="Lead conversion" value={pct(k.leadConversionRate)} hint={`${k.convertedLeads} converted in the period`} to={`${base}/reports/lead-conversion`} />
            <Stat label="Contacts and companies" value={`${k.totalContacts} / ${k.totalCompanies}`} hint="Active records" to={`${base}/contacts`} />
            <Stat label="Overdue follow-ups" value={String(k.overdueFollowUps ?? 0)} tone={(k.overdueFollowUps ?? 0) > 0 ? 'danger' : undefined} hint="Open activities past their date" to={`${base}/activities?view=overdue`} />
          </div>
          <div className="crm-dash-grid">
            <section className="card card-pad crm-span-2">
              <h2 className="crm-subhead">Revenue by month <span className="muted small">(deals won, {currency})</span></h2>
              <BarChart data={d.revenueByMonth.map((m) => single(m.label.split(' ')[0], major(m.value, currency), m.month))} height={200} />
            </section>
            <section className="card card-pad">
              <h2 className="crm-subhead">Open deals by stage</h2>
              {d.dealsByStage.stages.length ? (
                <ul className="crm-funnel">
                  {d.dealsByStage.stages.map((s) => {
                    const max = Math.max(1, ...d.dealsByStage.stages.map((x) => x.value));
                    return (
                      <li key={s.id}>
                        <span className="crm-funnel-label">{s.name} <span className="muted small">{s.count}</span></span>
                        <span className="crm-funnel-bar"><span style={{ width: `${Math.max(2, (s.value / max) * 100)}%` }} /></span>
                        <span className="crm-funnel-value">{fmt(s.value, true)}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : <p className="muted">No pipeline.</p>}
            </section>
            <section className="card card-pad">
              <h2 className="crm-subhead">Conversion funnel <span className="muted small">(in the period)</span></h2>
              <ul className="crm-funnel">
                {d.funnel.map((f) => {
                  const max = Math.max(1, ...d.funnel.map((x) => x.value));
                  return (
                    <li key={f.label}>
                      <span className="crm-funnel-label">{f.label}</span>
                      <span className="crm-funnel-bar"><span style={{ width: `${Math.max(2, (f.value / max) * 100)}%` }} /></span>
                      <span className="crm-funnel-value">{f.value}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="card card-pad">
              <h2 className="crm-subhead">Lead sources <span className="muted small">(leads created in the period)</span></h2>
              {d.leadSources.length ? <DonutChart data={d.leadSources.map((s, i) => ({ key: s.source, label: s.label, value: s.count, color: seriesColor(i) }))} centerLabel="leads" /> : <p className="muted">No leads in the period.</p>}
            </section>
            <section className="card card-pad">
              <h2 className="crm-subhead">Completed activities per week</h2>
              {d.activityTrend.length ? <LineChart data={d.activityTrend.map((t) => single(t.label, t.count, t.week))} height={180} /> : <p className="muted">No completed activities in the last twelve weeks.</p>}
            </section>
            <section className="card card-pad crm-span-2">
              <h2 className="crm-subhead">Team performance <span className="muted small">(in the period)</span></h2>
              <div className="crm-table-scroll">
                <table className="data-table">
                  <thead><tr><th>Person</th><th>Won</th><th>Revenue</th><th>Lost</th><th>Win rate</th><th>Open pipeline</th><th>Activities done</th></tr></thead>
                  <tbody>
                    {d.team.map((t) => (
                      <tr key={t.userId}>
                        <td><PersonChip id={t.userId} small /></td>
                        <td>{t.wonCount}</td>
                        <td className="crm-num-cell">{fmt(t.wonValue)}</td>
                        <td>{t.lostCount}</td>
                        <td>{pct(t.winRate)}</td>
                        <td className="crm-num-cell">{fmt(t.openValue)}</td>
                        <td>{t.activitiesDone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="card card-pad">
              <div className="row"><h2 className="crm-subhead grow">Upcoming meetings and calls</h2><Link to={`${base}/calendar`} className="small">Calendar</Link></div>
              {d.upcomingMeetings.length ? (
                <ul className="crm-mini-list">
                  {d.upcomingMeetings.map((m) => (
                    <li key={m.id}>
                      <Icon name={activityIcon(m.type)} size={14} />
                      <div className="grow">
                        <Link to={recordPath(org.id, 'activity', m.id)}>{m.title}</Link>
                        <div className="muted small">{shortDate(m.due_date)}{m.due_time ? ` ${m.due_time}` : ''} · {[m.contact_name, m.company_name, m.deal_title].filter(Boolean).join(', ')}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="muted">Nothing planned in the next two weeks.</p>}
            </section>
            <section className="card card-pad">
              <div className="row"><h2 className="crm-subhead grow">Recent activities</h2><Link to={`${base}/activities?view=team`} className="small">All</Link></div>
              {d.recentActivities.length ? (
                <ul className="crm-mini-list">
                  {d.recentActivities.map((m) => (
                    <li key={m.id}>
                      <Icon name={activityIcon(m.type)} size={14} />
                      <div className="grow">
                        <Link to={recordPath(org.id, 'activity', m.id)}>{m.title}</Link>
                        <div className="muted small">{labelOf(org.settings.activityTypes, m.type)} · {m.status === 'done' ? 'done' : 'planned'} {timeAgo(m.done_at ?? m.created_at)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="muted">No activities yet.</p>}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ reports

interface Report {
  key: string;
  title: string;
  description: string;
  summary: { label: string; value: number | null; kind: string }[];
  chart: { type: 'bar' | 'line' | 'donut'; label: string; kind: string; series: { label: string; value: number }[] } | null;
  columns: { key: string; label: string; kind: string }[];
  rows: Record<string, unknown>[];
  range: { from: string; to: string };
}

const REPORT_LIST = [
  { key: 'pipeline', title: 'Sales pipeline', icon: 'kanban' },
  { key: 'forecast', title: 'Forecast revenue', icon: 'chart' },
  { key: 'revenue', title: 'Revenue', icon: 'dollar' },
  { key: 'trends', title: 'Monthly and quarterly trends', icon: 'timeline' },
  { key: 'win-loss', title: 'Won and lost deals', icon: 'trophy' },
  { key: 'performance', title: 'Salesperson performance', icon: 'users' },
  { key: 'lead-conversion', title: 'Lead conversion', icon: 'funnel' },
  { key: 'sources', title: 'Lead source performance', icon: 'target' },
  { key: 'activities', title: 'Activities', icon: 'activity' },
  { key: 'ageing', title: 'Deal ageing', icon: 'clock' },
  { key: 'cycle', title: 'Sales cycle duration', icon: 'refresh' },
];

export function Reports() {
  const org = useCurrentOrg();
  const { key = 'pipeline' } = useParams();
  const navigate = useNavigate();
  const { fmt, currency } = useMoney();
  const [r, set] = useRange();
  usePageTitle('Reports');
  const q = useQuery({ queryKey: ['crm', org.id, 'report', key, qs(r)], queryFn: () => get<Report>(`${crm(org.id, `/reports/${key}`)}?${qs(r)}`), enabled: org.perms.reports.view, placeholderData: keepPreviousData });
  if (!org.perms.reports.view) return <div className="page"><EmptyState icon="chart" title="Your role does not include reports" /></div>;
  const value = (v: unknown, kind: string) => (v === null || v === undefined || v === '' ? '' : kind === 'money' ? fmt(Number(v)) : kind === 'percent' ? `${v}%` : kind === 'days' ? `${v} d` : String(v));
  const rep = q.data;
  return (
    <div className="page crm-page">
      <PageHeader
        title="Reports"
        icon="chart"
        subtitle="Calculated from your organisation's records when you open them."
        actions={org.perms.reports.export && rep ? <button className="btn" onClick={() => download(appUrl(`/api${crm(org.id, `/reports/${key}`)}?${qs(r)}&format=csv`))}><Icon name="download" /> Export CSV</button> : null}
      />
      <div className="crm-report-layout">
        <nav className="crm-report-nav card" aria-label="Reports">
          {REPORT_LIST.map((x) => (
            <button key={x.key} className={`nav-item${x.key === key ? ' active' : ''}`} aria-current={x.key === key ? 'page' : undefined} onClick={() => navigate(`/o/${org.id}/reports/${x.key}`)}>
              <Icon name={x.icon} /> {x.title}
            </button>
          ))}
        </nav>
        <div className="stack">
          <RangeBar r={r} set={set} />
          {q.error ? <ErrorBox error={q.error} /> : null}
          {!rep ? (
            <Loading />
          ) : (
            <>
              <div>
                <h2 className="crm-report-title">{rep.title} {q.isFetching ? <Spinner /> : null}</h2>
                <p className="muted">{rep.description}</p>
              </div>
              <div className="crm-stats">
                {rep.summary.map((s) => <Stat key={s.label} label={s.label} value={value(s.value, s.kind) || 'No data'} />)}
              </div>
              {rep.chart && rep.chart.series.length ? (
                <section className="card card-pad">
                  <h3 className="crm-subhead">{rep.chart.label}{rep.chart.kind === 'money' ? ` (${currency})` : ''}</h3>
                  {rep.chart.type === 'donut' ? (
                    <DonutChart data={rep.chart.series.map((s, i) => ({ key: s.label, label: s.label, value: s.value, color: seriesColor(i) }))} />
                  ) : rep.chart.type === 'line' ? (
                    <LineChart data={rep.chart.series.map((s) => single(s.label, rep.chart!.kind === 'money' ? major(s.value, currency) : s.value))} height={220} />
                  ) : (
                    <BarChart horizontal={rep.chart.series.length > 8} data={rep.chart.series.map((s) => single(s.label, rep.chart!.kind === 'money' ? major(s.value, currency) : s.value))} height={rep.chart.series.length > 8 ? Math.max(200, rep.chart.series.length * 26) : 220} />
                  )}
                </section>
              ) : null}
              <section className="card">
                <div className="crm-table-scroll">
                  <table className="data-table">
                    <thead><tr>{rep.columns.map((c) => <th key={c.key} className={['money', 'number', 'percent', 'days'].includes(c.kind) ? 'crm-num-cell' : undefined}>{c.label}</th>)}</tr></thead>
                    <tbody>
                      {rep.rows.map((row, i) => (
                        <tr key={i}>{rep.columns.map((c) => <td key={c.key} className={['money', 'number', 'percent', 'days'].includes(c.kind) ? 'crm-num-cell' : undefined}>{value(row[c.key], c.kind)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                  {!rep.rows.length ? <p className="muted card-pad">No records in this period.</p> : null}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
