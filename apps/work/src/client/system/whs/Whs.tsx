// BIZOMAT WHS, Release 1: Health and Safety inside BIZOMAT ERP, at /erp/c/<company>/whs. The dashboard (real counts with
// filters, monthly trends, site and department comparison, injury frequency rates only where hours worked are entered),
// reporting a hazard or an incident from a phone, the hazard register, risk assessments and the risk register,
// incidents with investigations and regulatory notification records, the actions register, the jurisdictions and the
// WHS settings. The server (src/worker/whs) decides who may see and do what; these screens follow its answers.
import { useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiError, get, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import '../../styles/whs.css';
import { dateTimeText, localToday, whsPage, whsPath, useWhsMe, type WhsAlert, type WhsMe } from './api';
import { FilterPanel, Section, options, useWhsAct } from './common';
import { ReportHazard, ReportIncident } from './Report';
import { HazardDetail, HazardsPage } from './Hazards';
import { IncidentDetail, IncidentsPage } from './Incidents';
import { NewRiskAssessment, RiskAssessmentDetail, RiskAssessmentsPage, RiskRegister } from './Risk';
import { ActionDetail, ActionsPage } from './Actions';
import { JurisdictionsPage, WhsSettings } from './Legal';

export function WhsArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const me = useWhsMe(companyId);
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Health and Safety" />
          <section className="co-prompt"><p>You do not have access to health and safety in {companyName}. People in the company have access; people who only share a tool with it do not.</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening Health and Safety…" />;
  const m = me.data;
  const tab = (to: string, icon: string, text: string, end = false) => (
    <NavLink key={to} to={whsPage(companyId, to)} end={end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name={icon} size={14} /> {text}</NavLink>
  );
  return (
    <div className="page crm-page whs-page">
      <PageHeader title="Health and Safety" subtitle={`BIZOMAT WHS for ${m.company.name}: hazards, risk assessments, incidents, regulatory notification records and actions. ${m.whsRoleLabels.length ? `Your WHS roles: ${m.whsRoleLabels.join(', ')}.` : m.can.view ? '' : 'You can report hazards and incidents and follow your own reports.'}`} />
      <nav className="tabs mt-tabs" aria-label="Health and Safety sections">
        {tab('', 'home', 'Overview', true)}
        {tab('/hazards', 'alert', 'Hazards')}
        {tab('/incidents', 'flag', 'Incidents')}
        {m.can.view ? tab('/risk', 'target', 'Risk assessments') : null}
        {tab('/actions', 'checkSquare', 'Actions')}
        {m.can.view ? tab('/jurisdictions', 'globe', 'Jurisdictions') : null}
        {m.can.view ? tab('/settings', 'settings', 'Settings') : null}
      </nav>
      <Routes>
        <Route index element={<Overview companyId={companyId} me={m} />} />
        <Route path="report/hazard" element={<ReportHazard companyId={companyId} me={m} />} />
        <Route path="report/incident" element={<ReportIncident companyId={companyId} me={m} />} />
        <Route path="hazards" element={<HazardsPage companyId={companyId} me={m} />} />
        <Route path="hazards/:id" element={<HazardDetail companyId={companyId} me={m} />} />
        <Route path="incidents" element={<IncidentsPage companyId={companyId} me={m} />} />
        <Route path="incidents/:id/*" element={<IncidentDetail companyId={companyId} me={m} />} />
        <Route path="risk" element={<RiskAssessmentsPage companyId={companyId} me={m} />} />
        <Route path="risk/new" element={<NewRiskAssessment companyId={companyId} me={m} />} />
        <Route path="risk/register" element={<RiskRegister companyId={companyId} me={m} />} />
        <Route path="risk/:id" element={<RiskAssessmentDetail companyId={companyId} me={m} />} />
        <Route path="actions" element={<ActionsPage companyId={companyId} me={m} />} />
        <Route path="actions/:id" element={<ActionDetail companyId={companyId} me={m} />} />
        <Route path="jurisdictions/*" element={<JurisdictionsPage companyId={companyId} me={m} />} />
        <Route path="settings" element={<WhsSettings companyId={companyId} me={m} />} />
        <Route path="*" element={<Navigate to={whsPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

/** The two buttons every overview starts with: large, first, and the same on a phone. */
function ReportButtons({ companyId }: { companyId: string }) {
  return (
    <div className="whs-report-buttons">
      <Link className="btn primary whs-big" to={whsPage(companyId, '/report/hazard')}><Icon name="alert" /> Report a hazard</Link>
      <Link className="btn primary whs-big" to={whsPage(companyId, '/report/incident')}><Icon name="flag" /> Report an incident</Link>
    </div>
  );
}

function Alerts({ companyId }: { companyId: string }) {
  const q = useQuery({ queryKey: ['whs', companyId, 'alerts'], queryFn: () => get<{ alerts: WhsAlert[]; unread: number }>(whsPath(companyId, '/alerts')) });
  const act = useWhsAct(companyId);
  if (!q.data?.alerts.length) return null;
  const unread = q.data.alerts.filter((x) => !x.read);
  if (!unread.length) return null;
  return (
    <Section title={`Alerts for you (${unread.length})`} actions={<button className="btn sm" onClick={() => void act(() => post(whsPath(companyId, '/alerts/read'), { all: true }), 'Alerts marked as read')}>Mark all as read</button>}>
      <ul className="whs-alerts">
        {unread.slice(0, 8).map((x) => (
          <li key={x.id} className={`whs-alert whs-alert-${x.kind}`}>
            <Icon name={x.kind === 'serious_incident' || x.kind === 'potentially_notifiable' ? 'alert' : x.kind === 'overdue_action' ? 'clock' : 'bell'} size={16} />
            <div className="grow">
              {x.link ? <Link to={x.link}><strong>{x.title}</strong></Link> : <strong>{x.title}</strong>}
              {x.body ? <div className="small muted">{x.body}</div> : null}
              <div className="small muted">{dateTimeText(x.at)}{x.emailed ? ' · also emailed' : ''}</div>
            </div>
            <button className="btn ghost sm" aria-label={`Mark "${x.title}" as read`} onClick={() => void act(() => post(whsPath(companyId, '/alerts/read'), { ids: [x.id] }), '')}><Icon name="check" size={14} /></button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ------------------------------------------------------------------ the dashboard

interface Dashboard {
  filters: { from: string; to: string };
  actual: string;
  hazards: { active: number; high: number; toAssess: number; reported: number; highLabel: string };
  incidents: { open: number; inPeriod: number; nearMisses: number; serious: number; toInvestigate: number; toDecide: number; toSubmit: number; lti: number; fatalities: number; recordable: number; submissions: number };
  actions: { open: number; overdue: number; toVerify: number; raised: number; completed: number; onTime: number; withDue: number; onTimePct: number | null };
  riskAssessments: { drafts: number; submitted: number; reviewDue: number; approved: number; outstanding: number };
  rates: {
    available: boolean;
    period: { from: string; to: string; months: number } | null;
    hours: number;
    lti: number;
    recordable: number;
    ltifr: number | null;
    trifr: number | null;
    missing: { month: string; siteId: string | null; siteName: string | null; reason: string }[];
    note: string;
    formula: { ltifr: string; trifr: string };
    counting: string;
    scope: string | null;
  };
  trend: { month: string; incidents: number; nearMisses: number; injuries: number; serious: number; lti: number; severity: Record<string, number>; hazards: number; actionsClosed: number }[];
  sites: { id: string; name: string; hazards: number; incidents: number; nearMisses: number; lti: number; rates: { available: boolean; ltifr: number | null; trifr: number | null; hours: number; note: string } | null }[];
  departments: { id: string; name: string; hazards: number; incidents: number; lti: number }[];
  levels: { key: string; label: string }[];
  planned: string[];
}

function Stat({ label, value, to, hint, tone }: { label: string; value: number; to?: string; hint?: string; tone?: 'danger' | 'warning' }) {
  const inner = (
    <>
      <span className="crm-stat-label">{label}</span>
      <span className={`crm-stat-value${tone && value ? ` ${tone}` : ''}`}>{value.toLocaleString()}</span>
      {hint ? <span className="crm-stat-hint">{hint}</span> : null}
    </>
  );
  return to ? <Link to={to} className="card crm-stat">{inner}</Link> : <div className="card crm-stat">{inner}</div>;
}

function Overview({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Health and Safety');
  if (!me.can.view) return <OwnOverview companyId={companyId} />;
  return <DashboardView companyId={companyId} me={me} />;
}

/** People who report and follow their own: the buttons, their reports and their actions. */
function OwnOverview({ companyId }: { companyId: string }) {
  const q = useQuery({ queryKey: ['whs', companyId, 'summary'], queryFn: () => get<{ openIncidents: number; activeHazards: number; myActions: number; overdueActions: number }>(whsPath(companyId, `/summary?today=${localToday()}`)) });
  return (
    <div className="stack">
      <ReportButtons companyId={companyId} />
      <Alerts companyId={companyId} />
      {q.data ? (
        <div className="erp-stats">
          <Stat label="Your hazard reports, open" value={q.data.activeHazards} to={whsPage(companyId, '/hazards')} />
          <Stat label="Your incident reports, open" value={q.data.openIncidents} to={whsPage(companyId, '/incidents')} />
          <Stat label="Actions for you" value={q.data.myActions} to={whsPage(companyId, '/actions?mine=1')} />
          <Stat label="Your actions overdue" value={q.data.overdueActions} to={whsPage(companyId, '/actions?mine=1&overdue=1')} tone="danger" />
        </div>
      ) : null}
      <p className="muted small">Anyone in the company can report. A WHS officer or manager follows up each report; you see where it stands here.</p>
    </div>
  );
}

function DashboardView({ companyId, me }: { companyId: string; me: WhsMe }) {
  const [f, setF] = useState({ site: '', department: '', from: '', to: '', kind: '', level: '' });
  const params = new URLSearchParams({ today: localToday(), ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) });
  const q = useQuery({ queryKey: ['whs', companyId, 'dashboard', params.toString()], queryFn: () => get<Dashboard>(whsPath(companyId, `/dashboard?${params}`)) });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const active = Object.values(f).filter(Boolean).length;
  const d = q.data;
  const list = (path: string) => whsPage(companyId, path);
  return (
    <div className="stack">
      <ReportButtons companyId={companyId} />
      <Alerts companyId={companyId} />
      <FilterPanel active={active}>
        <div className="field"><label htmlFor="wf-site">Site</label><select id="wf-site" className="select" value={f.site} onChange={set('site')}><option value="">All sites</option>{me.sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        {me.departments.length ? <div className="field"><label htmlFor="wf-dept">Department</label><select id="wf-dept" className="select" value={f.department} onChange={set('department')}><option value="">All departments</option>{me.departments.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div> : null}
        <div className="field"><label htmlFor="wf-from">From</label><input id="wf-from" type="date" className="input" value={f.from} onChange={set('from')} /></div>
        <div className="field"><label htmlFor="wf-to">To</label><input id="wf-to" type="date" className="input" value={f.to} onChange={set('to')} /></div>
        <div className="field"><label htmlFor="wf-kind">Incident type</label><select id="wf-kind" className="select" value={f.kind} onChange={set('kind')}><option value="">All types</option>{options(me.lists.incidentKinds)}</select></div>
        <div className="field"><label htmlFor="wf-level">Risk level</label><select id="wf-level" className="select" value={f.level} onChange={set('level')}><option value="">All levels</option>{me.matrix.levels.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}</select></div>
      </FilterPanel>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !d ? <Loading /> : (
        <>
          <p className="muted small whs-actual"><Icon name="info" size={14} /> {d.actual} Period: {d.filters.from} to {d.filters.to}.</p>
          <div className="erp-stats">
            <Stat label="Active hazards" value={d.hazards.active} to={list('/hazards?status=open')} hint={d.hazards.toAssess ? `${d.hazards.toAssess} to assess` : undefined} />
            <Stat label={`${d.hazards.highLabel.charAt(0).toUpperCase()}${d.hazards.highLabel.slice(1).toLowerCase()} risks`} value={d.hazards.high} to={list('/risk/register')} tone="warning" />
            <Stat label="Open incidents" value={d.incidents.open} to={list('/incidents?status=open')} hint={`${d.incidents.inPeriod} in the period`} />
            <Stat label="Near misses" value={d.incidents.nearMisses} to={list('/incidents?kind=near_miss')} hint="In the period" />
            <Stat label="Incidents to investigate" value={d.incidents.toInvestigate} to={list('/incidents?investigate=1')} tone="warning" />
            <Stat label="Notifications to decide or record" value={d.incidents.toDecide + d.incidents.toSubmit} to={list('/incidents?notifiable=1')} tone="danger" />
            <Stat label="Open actions" value={d.actions.open} to={list('/actions?status=open')} hint={d.actions.toVerify ? `${d.actions.toVerify} to verify` : undefined} />
            <Stat label="Overdue actions" value={d.actions.overdue} to={list('/actions?overdue=1')} tone="danger" />
            <Stat label="Risk assessments outstanding" value={d.riskAssessments.outstanding} to={list('/risk')} hint={`${d.riskAssessments.drafts} draft, ${d.riskAssessments.submitted} to approve, ${d.riskAssessments.reviewDue} review due`} />
          </div>
          <div className="qc-two">
            <Section title="Injuries">
              <dl className="co-figures">
                <div><dt>Lost-time injuries</dt><dd>{d.incidents.lti}</dd></div>
                <div><dt>Recordable injuries</dt><dd>{d.incidents.recordable}</dd></div>
                <div><dt>Serious incidents</dt><dd>{d.incidents.serious}</dd></div>
                <div><dt>Deaths</dt><dd>{d.incidents.fatalities}</dd></div>
              </dl>
            </Section>
            <Section title="Injury frequency rates">
              {d.rates.available ? (
                <dl className="co-figures">
                  <div><dt>LTIFR</dt><dd>{d.rates.ltifr}</dd></div>
                  <div><dt>TRIFR</dt><dd>{d.rates.trifr}</dd></div>
                  <div><dt>Hours worked</dt><dd>{d.rates.hours.toLocaleString()}</dd></div>
                  <div><dt>Lost time injuries counted</dt><dd>{d.rates.lti}</dd></div>
                  <div><dt>Recordable injuries counted</dt><dd>{d.rates.recordable}</dd></div>
                </dl>
              ) : <p className="small"><strong>LTIFR and TRIFR: not shown.</strong></p>}
              <p className={d.rates.available ? 'muted small' : 'small'}>{d.rates.note}</p>
              <p className="muted small">{d.rates.formula.ltifr}. {d.rates.formula.trifr}.</p>
              <p className="muted small">{d.rates.counting}</p>
              {d.rates.scope ? <p className="muted small">{d.rates.scope}</p> : null}
            </Section>
            <Section title="Corrective action completion">
              <dl className="co-figures">
                <div><dt>Raised in the period</dt><dd>{d.actions.raised}</dd></div>
                <div><dt>Completed in the period</dt><dd>{d.actions.completed}</dd></div>
                <div><dt>Completed on time</dt><dd>{d.actions.onTimePct === null ? 'No due dates' : `${d.actions.onTimePct}%`}</dd></div>
                <div><dt>Regulator submissions recorded</dt><dd>{d.incidents.submissions}</dd></div>
              </dl>
            </Section>
          </div>
          <Section title="Monthly trends">
            <div className="whs-charts">
              <MonthChart title="Incidents reported each month" rows={d.trend.map((t) => ({ month: t.month, value: t.incidents }))} />
              <MonthChart title="Hazards reported each month" rows={d.trend.map((t) => ({ month: t.month, value: t.hazards }))} />
            </div>
            <details className="whs-table-view">
              <summary>Show the numbers as a table</summary>
              <div className="crm-table-scroll">
                <table className="data-table whs-trend-table">
                  <thead><tr><th>Month</th><th className="num">Incidents</th><th className="num">Near misses</th><th className="num">Injuries and illnesses</th><th className="num">Serious</th><th className="num">Lost time</th><th className="num">Minor</th><th className="num">Moderate</th><th className="num">Serious severity</th><th className="num">Critical</th><th className="num">Hazards</th><th className="num">Actions closed</th></tr></thead>
                  <tbody>{d.trend.map((t) => <tr key={t.month}><td>{t.month}</td><td className="num">{t.incidents}</td><td className="num">{t.nearMisses}</td><td className="num">{t.injuries}</td><td className="num">{t.serious}</td><td className="num">{t.lti}</td><td className="num">{t.severity.minor}</td><td className="num">{t.severity.moderate}</td><td className="num">{t.severity.serious}</td><td className="num">{t.severity.critical}</td><td className="num">{t.hazards}</td><td className="num">{t.actionsClosed}</td></tr>)}</tbody>
                </table>
              </div>
            </details>
          </Section>
          <div className="qc-two">
            <Section title="Sites">
              {d.sites.length ? (
                <table className="data-table responsive">
                  <thead><tr><th>Site</th><th className="num">Active hazards</th><th className="num">Incidents</th><th className="num">Near misses</th><th className="num">Lost time</th><th className="num">LTIFR</th><th className="num">TRIFR</th></tr></thead>
                  <tbody>{d.sites.map((s) => <tr key={s.id}><td data-label="Site">{s.name}</td><td className="num" data-label="Active hazards">{s.hazards}</td><td className="num" data-label="Incidents">{s.incidents}</td><td className="num" data-label="Near misses">{s.nearMisses}</td><td className="num" data-label="Lost time">{s.lti}</td>{s.rates?.available ? <><td className="num" data-label="LTIFR">{s.rates.ltifr}</td><td className="num" data-label="TRIFR">{s.rates.trifr}</td></> : <td colSpan={2} className="muted small" data-label="Rates">{s.rates ? s.rates.note : ''}</td>}</tr>)}</tbody>
                </table>
              ) : <p className="muted small">No sites yet. Sites are added in Maintenance, Settings, and given their jurisdictions in WHS settings.</p>}
            </Section>
            <Section title="Departments">
              {d.departments.length ? (
                <table className="data-table responsive">
                  <thead><tr><th>Department</th><th className="num">Active hazards</th><th className="num">Incidents</th><th className="num">Lost time</th></tr></thead>
                  <tbody>{d.departments.map((s) => <tr key={s.id}><td data-label="Department">{s.name}</td><td className="num" data-label="Active hazards">{s.hazards}</td><td className="num" data-label="Incidents">{s.incidents}</td><td className="num" data-label="Lost time">{s.lti}</td></tr>)}</tbody>
                </table>
              ) : <p className="muted small">{me.company.kind === 'registered' ? 'No departments yet: they are made in the company area.' : 'Departments come with a registered company.'}</p>}
            </Section>
          </div>
          <Section title="Planned for later releases">
            <p className="muted small">These figures need modules that are not built yet, so they are not shown as numbers:</p>
            <ul className="whs-planned">{d.planned.map((p) => <li key={p}>{p} <span className="badge">Planned</span></li>)}</ul>
          </Section>
        </>
      )}
    </div>
  );
}

/** A column chart of one series by month: thin columns, a hairline baseline, the value of the highest labelled, a
 *  tooltip per column (its title) and the same numbers in the table under it. */
function MonthChart({ title, rows }: { title: string; rows: { month: string; value: number }[] }) {
  const W = 560;
  const H = 150;
  const top = 18;
  const base = H - 22;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const band = W / Math.max(rows.length, 1);
  const bar = Math.min(24, band - 2);
  const peak = rows.reduce((p, r, i) => (r.value > (rows[p]?.value ?? -1) ? i : p), 0);
  const total = rows.reduce((s, r) => s + r.value, 0);
  const label = `${title}: ${rows.map((r) => `${r.month} ${r.value}`).join(', ')}`;
  return (
    <figure className="whs-chart">
      <figcaption className="small"><strong>{title}</strong> <span className="muted">{total} in all</span></figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="whs-chart-svg">
        <line x1="0" x2={W} y1={base} y2={base} className="whs-chart-axis" />
        {rows.map((r, i) => {
          const h = r.value ? Math.max(2, ((base - top) * r.value) / max) : 0;
          const x = i * band + (band - bar) / 2;
          const y = base - h;
          const rr = Math.min(4, h / 2, bar / 2);
          const d = h ? `M${x},${base} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + bar - rr},${y} Q${x + bar},${y} ${x + bar},${y + rr} L${x + bar},${base} Z` : '';
          return (
            <g key={r.month}>
              <rect x={i * band} y={top - 10} width={band} height={base - top + 10} className="whs-chart-hit"><title>{`${r.month}: ${r.value}`}</title></rect>
              {h ? <path d={d} className="whs-chart-bar"><title>{`${r.month}: ${r.value}`}</title></path> : null}
              {i === peak && r.value ? <text x={x + bar / 2} y={y - 4} textAnchor="middle" className="whs-chart-value">{r.value}</text> : null}
              {rows.length <= 12 || i % 2 === 0 ? <text x={i * band + band / 2} y={H - 6} textAnchor="middle" className="whs-chart-month">{monthShort(r.month)}</text> : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthShort = (m: string) => MONTHS[Number(m.slice(5, 7)) - 1] ?? m;
