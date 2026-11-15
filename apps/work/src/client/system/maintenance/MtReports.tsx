// Maintenance reports (stages M2 and M3), for supervisors and administrators: reliability (MTBF, MTTR, downtime and
// availability), backlog, PM compliance, breakdown trends and asset costs. Each figure links to the assets and work
// orders behind it, and each report downloads as CSV. The formulas are in docs/maintenance/README.md and on the screen.
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { PRIORITY_LABELS, WO_STATUS_LABELS, dateText, dateTimeText, localToday, minutesText, money, mtPage, mtPath, useSites, type MtMe, type Priority } from './api';
import { PriorityBadge, Section } from './common';

const REPORTS: [string, string, string][] = [
  ['reliability', 'Reliability', 'Failures are breakdown, emergency repair and corrective work orders (not cancelled) whose downtime started in the period and has ended. MTTR = downtime ÷ failures. MTBF = (hours in the period − downtime) ÷ failures. Availability = (hours in the period − downtime) ÷ hours in the period.'],
  ['backlog', 'Backlog', 'Open work now (open, assigned, in progress, on hold) by priority and by age since it was made. The period does not apply.'],
  ['pm-compliance', 'PM compliance', 'Preventive work due in the period up to today. On time: completed on or before its due date. Late: completed after it. Missed: still open past its due date. Skipped: cancelled. Compliance = on time ÷ due.'],
  ['breakdowns', 'Breakdown trends', 'Each month: breakdown and emergency repair work orders made, corrective work orders made, and failures with their downtime.'],
  ['costs', 'Asset costs', 'Labour (each line priced when it was recorded, by the date of the work) and parts (the stock ledger’s value of parts issued less returned, by the date of the movement). Posting these costs to Finance is planned, not built.'],
];

export function ReportsPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Maintenance reports');
  const [params, setParams] = useSearchParams();
  const name = params.get('report') ?? 'reliability';
  const today = localToday();
  const back = (n: number) => { const d = new Date(`${today}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
  const [from, setFrom] = useState(params.get('from') ?? back(89));
  const [to, setTo] = useState(params.get('to') ?? today);
  const [site, setSite] = useState(params.get('siteId') ?? '');
  const sites = useSites(companyId);
  const qs = `from=${from}&to=${to}&today=${today}${site ? `&siteId=${site}` : ''}`;
  const q = useQuery({ queryKey: ['mt', companyId, 'report', name, qs], queryFn: () => get<any>(mtPath(companyId, `/reports/${name}?${qs}`)), enabled: me.can.reports });
  if (!me.can.reports) return <p className="muted">Maintenance reports are for supervisors and administrators.</p>;
  const meta = REPORTS.find((r) => r[0] === name) ?? REPORTS[0];
  return (
    <div className="stack">
      <nav className="tabs" aria-label="Reports">
        {REPORTS.map(([k, label]) => <button key={k} className={`tab${name === k ? ' active' : ''}`} aria-current={name === k ? 'page' : undefined} onClick={() => setParams((p) => { const n = new URLSearchParams(p); n.set('report', k); return n; }, { replace: true })}>{label}</button>)}
      </nav>
      <div className="mt-filters">
        {name !== 'backlog' ? (
          <>
            <div className="field"><label htmlFor="rp-from">From</label><input id="rp-from" className="input" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value || back(89))} /></div>
            <div className="field"><label htmlFor="rp-to">To</label><input id="rp-to" className="input" type="date" value={to} onChange={(e) => setTo(e.target.value || today)} /></div>
          </>
        ) : null}
        <div className="field"><label htmlFor="rp-site">Site</label><select id="rp-site" className="select" value={site} onChange={(e) => setSite(e.target.value)}><option value="">All sites</option>{(sites.data?.sites ?? []).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}</select></div>
        <div className="field mt-field-end"><a className="btn" href={appUrl(`/api${mtPath(companyId, `/reports/${name}?${qs}&format=csv`)}`)}><Icon name="download" /> CSV</a></div>
      </div>
      <p className="muted small">{meta[2]}</p>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : (
        name === 'reliability' ? <Reliability companyId={companyId} r={q.data} /> : name === 'backlog' ? <Backlog companyId={companyId} r={q.data} /> : name === 'pm-compliance' ? <Compliance companyId={companyId} r={q.data} /> : name === 'breakdowns' ? <Breakdowns companyId={companyId} r={q.data} /> : <Costs companyId={companyId} r={q.data} />
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card crm-stat">
      <span className="crm-stat-label">{label}</span>
      <span className="crm-stat-value">{value}</span>
      {hint ? <span className="crm-stat-hint">{hint}</span> : null}
    </div>
  );
}

const h = (n: number | null | undefined) => (n == null ? '' : `${n} h`);

function Reliability({ companyId, r }: { companyId: string; r: any }) {
  return (
    <div className="stack">
      <div className="crm-stats">
        <Stat label="Failures" value={r.totals.failures} hint={`${r.periodHours} hours in the period`} />
        <Stat label="Downtime" value={h(r.totals.downtimeHours) || '0 h'} />
        <Stat label="MTTR, all assets" value={r.totals.mttrHours == null ? 'No failures' : h(r.totals.mttrHours)} />
        <Stat label="Down now" value={r.downNow.length} />
      </div>
      {r.assets.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Asset</th><th>Failures</th><th>Downtime</th><th>MTTR</th><th>MTBF</th><th>Availability</th><th>Work orders</th></tr></thead>
          <tbody>
            {r.assets.map((x: any) => (
              <tr key={x.assetId}>
                <td data-label="Asset"><Link to={mtPage(companyId, `/assets/${x.assetId}`)}>{x.assetNumber} {x.assetName}</Link></td>
                <td data-label="Failures" className="mt-num">{x.failures}</td>
                <td data-label="Downtime" className="mt-num">{h(x.downtimeHours)}</td>
                <td data-label="MTTR" className="mt-num">{h(x.mttrHours)}</td>
                <td data-label="MTBF" className="mt-num">{h(x.mtbfHours)}</td>
                <td data-label="Availability" className="mt-num">{x.availabilityPct}%</td>
                <td data-label="Work orders">{x.workOrders.map((w: any, i: number) => <span key={w.id}>{i ? ', ' : ''}<Link className="mt-num" to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link> ({minutesText(Math.round(w.minutes))})</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted">No failures with recorded downtime in this period. Record downtime on breakdown and corrective work orders.</p>}
      {r.downNow.length ? (
        <Section title="Down now">
          <ul className="mt-docs small">{r.downNow.map((d: any) => <li key={d.workOrderId}><Link to={mtPage(companyId, `/assets/${d.assetId}`)}>{d.assetNumber} {d.assetName}</Link> since {dateTimeText(d.since)}, <Link to={mtPage(companyId, `/work-orders/${d.workOrderId}`)}>{d.workOrderNumber}</Link></li>)}</ul>
        </Section>
      ) : null}
    </div>
  );
}

function Backlog({ companyId, r }: { companyId: string; r: any }) {
  const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];
  return (
    <div className="stack">
      <div className="crm-stats">
        <Stat label="Open work orders" value={r.totals.count} />
        <Stat label="Overdue" value={r.totals.overdue} />
        <Stat label="Estimated work" value={h(r.totals.estimatedHours) || '0 h'} />
      </div>
      <table className="data-table mt-table">
        <thead><tr><th>Priority</th>{r.bands.map((b: any) => <th key={b.key}>{b.label}</th>)}</tr></thead>
        <tbody>
          {priorities.map((p) => (
            <tr key={p}>
              <td data-label="Priority"><PriorityBadge priority={p} /></td>
              {r.bands.map((b: any) => <td key={b.key} data-label={b.label} className="mt-num">{r.matrix[p][b.key].count}{r.matrix[p][b.key].estimatedHours ? <span className="muted small"> ({r.matrix[p][b.key].estimatedHours} h)</span> : ''}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <Section title="The work orders">
        {r.workOrders.length ? (
          <table className="data-table mt-table">
            <thead><tr><th>Work order</th><th>Asset</th><th>Priority</th><th>Status</th><th>Age</th><th>Due</th></tr></thead>
            <tbody>
              {r.workOrders.map((w: any) => (
                <tr key={w.id}>
                  <td data-label="Work order"><Link className="mt-num" to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link><div className="small">{w.description}</div></td>
                  <td data-label="Asset">{w.assetNumber}</td>
                  <td data-label="Priority">{PRIORITY_LABELS[w.priority as Priority]}</td>
                  <td data-label="Status">{WO_STATUS_LABELS[w.status as keyof typeof WO_STATUS_LABELS]}</td>
                  <td data-label="Age" className="mt-num">{w.ageDays} days</td>
                  <td data-label="Due" className={w.overdue ? 'mt-overdue' : ''}>{dateText(w.dueFinish)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="muted">No open work.</p>}
      </Section>
    </div>
  );
}

const OUTCOME: Record<string, [string, string]> = { on_time: ['On time', 'success'], late: ['Late', 'warning'], missed: ['Missed', 'danger'], skipped: ['Skipped', ''] };

function Compliance({ companyId, r }: { companyId: string; r: any }) {
  return (
    <div className="stack">
      <div className="crm-stats">
        <Stat label="PM compliance" value={r.compliancePct == null ? 'Nothing due' : `${r.compliancePct}%`} hint={`Due up to ${dateText(r.upTo)}`} />
        <Stat label="Due" value={r.due} />
        <Stat label="On time" value={r.onTime} />
        <Stat label="Late" value={r.late} />
        <Stat label="Missed" value={r.missed} />
        <Stat label="Skipped" value={r.skipped} />
      </div>
      {r.occurrences.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Due</th><th>Schedule</th><th>Asset</th><th>Work order</th><th>Completed</th><th>Outcome</th></tr></thead>
          <tbody>
            {r.occurrences.map((o: any) => (
              <tr key={o.workOrderId}>
                <td data-label="Due">{dateText(o.dueDate)}</td>
                <td data-label="Schedule"><Link to={mtPage(companyId, `/preventive/${o.scheduleId}`)}>{o.scheduleName}</Link></td>
                <td data-label="Asset"><Link to={mtPage(companyId, `/assets/${o.assetId}`)}>{o.assetNumber}</Link></td>
                <td data-label="Work order"><Link className="mt-num" to={mtPage(companyId, `/work-orders/${o.workOrderId}`)}>{o.workOrderNumber}</Link></td>
                <td data-label="Completed">{dateText(o.completedDate)}</td>
                <td data-label="Outcome"><span className={`badge ${OUTCOME[o.outcome][1]}`}>{OUTCOME[o.outcome][0]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted">No preventive work was due in this period.</p>}
    </div>
  );
}

function Breakdowns({ companyId, r }: { companyId: string; r: any }) {
  const max = Math.max(1, ...r.months.map((m: any) => m.breakdowns + m.corrective));
  return (
    <div className="stack">
      <div className="crm-stats">
        <Stat label="Breakdowns and emergency repairs" value={r.totals.breakdowns} />
        <Stat label="Corrective work orders" value={r.totals.corrective} />
        <Stat label="Failures with downtime" value={r.totals.failures} hint={`${r.totals.downtimeHours} h down`} />
      </div>
      <table className="data-table mt-table">
        <thead><tr><th>Month</th><th>Breakdowns</th><th>Corrective</th><th>Failures</th><th>Downtime</th><th>Work orders</th></tr></thead>
        <tbody>
          {r.months.map((m: any) => (
            <tr key={m.month}>
              <td data-label="Month">{new Date(`${m.month}-01T00:00:00Z`).toLocaleDateString('en-AU', { month: 'short', year: 'numeric', timeZone: 'UTC' })}</td>
              <td data-label="Breakdowns" className="mt-num"><meter className="mt-bar" min={0} max={max} value={m.breakdowns} aria-label={`${m.breakdowns} breakdowns`} /> {m.breakdowns}</td>
              <td data-label="Corrective" className="mt-num">{m.corrective}</td>
              <td data-label="Failures" className="mt-num">{m.failures}</td>
              <td data-label="Downtime" className="mt-num">{h(m.downtimeHours)}</td>
              <td data-label="Work orders">{m.workOrders.slice(0, 12).map((w: any, i: number) => <span key={w.id}>{i ? ', ' : ''}<Link className="mt-num" to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link></span>)}{m.workOrders.length > 12 ? ` and ${m.workOrders.length - 12} more` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Costs({ companyId, r }: { companyId: string; r: any }) {
  return (
    <div className="stack">
      <div className="crm-stats">
        <Stat label="Labour" value={money(r.totals.labourCents) || '$0.00'} hint={r.totals.unpricedMinutes ? `${minutesText(r.totals.unpricedMinutes)} without a rate` : undefined} />
        <Stat label="Parts" value={money(r.totals.partsCents) || '$0.00'} />
        <Stat label="Total" value={money(r.totals.totalCents) || '$0.00'} />
      </div>
      {r.assets.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Asset</th><th>Labour</th><th>Parts</th><th>Total</th><th>Work orders</th></tr></thead>
          <tbody>
            {r.assets.map((x: any) => (
              <tr key={x.assetId}>
                <td data-label="Asset"><Link to={mtPage(companyId, `/assets/${x.assetId}`)}>{x.assetNumber} {x.assetName}</Link></td>
                <td data-label="Labour" className="mt-num">{money(x.labourCents)}<div className="muted small">{minutesText(x.labourMinutes)}{x.unpricedMinutes ? `, ${minutesText(x.unpricedMinutes)} without a rate` : ''}</div></td>
                <td data-label="Parts" className="mt-num">{money(x.partsCents)}</td>
                <td data-label="Total" className="mt-num"><strong>{money(x.totalCents)}</strong></td>
                <td data-label="Work orders"><Link to={mtPage(companyId, `/work-orders?view=all&assetId=${x.assetId}`)}>See them</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted">No labour or parts recorded in this period.</p>}
      <p className="muted small">{r.financePosting}</p>
    </div>
  );
}
