// BIZOMAT ERP, Release 3 reports, inside a company at /erp/c/<company>/erp-reports/<report>: production output, work
// order progress, material consumption, labour utilisation, production variance, machine downtime, MRP suggestions and
// capacity load. Each filters as fits it, links every row to its record and exports CSV (src/worker/erp/mfg-reports.ts).
// Job profitability (Release 5) is its own report: SupplyReports.tsx.
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { MESSAGE_LABELS, dateText, erpPath, inventoryPage, manufacturingPage, money, qty, type Suggestion } from './api';
import { CsvLink, Section } from './common';

export const MFG_REPORTS: { key: string; label: string; what: string }[] = [
  { key: 'production-output', label: 'Production output', what: 'Finished goods received from manufacturing orders, at actual cost.' },
  { key: 'work-order-progress', label: 'Work order progress', what: 'Open manufacturing orders: operations done, quantities and dates.' },
  { key: 'material-consumption', label: 'Material consumption', what: 'Materials issued, returned and scrapped against orders.' },
  { key: 'labour-utilisation', label: 'Labour utilisation', what: 'Hours recorded per work centre and person against available hours.' },
  { key: 'production-variance', label: 'Production variance', what: 'Closed orders: estimated against actual cost by element.' },
  { key: 'machine-downtime', label: 'Machine downtime', what: 'Downtime reported on the shop floor, by machine and reason.' },
  { key: 'oee', label: 'Overall equipment effectiveness (OEE)', what: 'Availability, performance and quality by work centre and machine, from what the shop floor recorded.' },
  { key: 'mrp-suggestions', label: 'MRP suggestions', what: 'What the latest MRP run suggests to make, buy or expedite.' },
  { key: 'capacity-load', label: 'Capacity load', what: 'Load per work centre per week against its available hours.' },
];

function useFilters(keys: string[]) {
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const qs = new URLSearchParams();
  for (const k of keys) if (g(k)) qs.set(k, g(k));
  return { g, set, qs: qs.toString() };
}

const useData = <T,>(companyId: string, path: string) => useQuery({ queryKey: ['erp', companyId, 'r3-report', path], queryFn: () => get<T>(erpPath(companyId, path)) });

function Shell({ title, companyId, csv, children, error, loading, retry, filters, note }: { title: string; companyId: string; csv: string; children: ReactNode; error: unknown; loading: boolean; retry: () => void; filters?: ReactNode; note?: string }) {
  usePageTitle(title);
  return (
    <Section title={title} actions={<CsvLink companyId={companyId} path={csv} />}>
      {filters ? <div className="row wrap mt-toolbar">{filters}</div> : null}
      {error ? <ErrorBox error={error} retry={retry} /> : loading ? <Loading /> : children}
      {note ? <p className="muted small">{note}</p> : null}
    </Section>
  );
}

const DateRange = ({ f }: { f: ReturnType<typeof useFilters> }) => (
  <>
    <input className="input" type="date" aria-label="From date" value={f.g('from')} onChange={(e) => f.set('from', e.target.value)} />
    <input className="input" type="date" aria-label="To date" value={f.g('to')} onChange={(e) => f.set('to', e.target.value)} />
  </>
);
const Empty = ({ children }: { children: ReactNode }) => <p className="muted">{children}</p>;
const moLink = (companyId: string, id: string, number: string) => <Link className="mt-num" to={manufacturingPage(companyId, `/orders/${id}`)}>{number}</Link>;

export function ProductionOutput({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ from: string; to: string; rows: { id: string; number: string; date: string; moId: string; moNumber: string; productId: string; productNumber: string; productName: string; uom: string; quantity: number; valueCents: number }[]; byProduct: { productId: string; number: string; name: string; uom: string; quantity: number; valueCents: number; receipts: number }[]; note: string }>(companyId, `/reports/production-output?${f.qs}`);
  return (
    <Shell title="Production output" companyId={companyId} csv={`/reports/production-output?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>Nothing received from production between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th className="num">Received</th><th className="num">Value</th><th className="num">Receipts</th></tr></thead>
              <tbody>{q.data.byProduct.map((p) => <tr key={p.productId}><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${p.productId}`)}><span className="mt-num">{p.number}</span> {p.name}</Link></td><td data-label="Received" className="num">{qty(p.quantity)} <span className="muted small">{p.uom}</span></td><td data-label="Value" className="num">{money(p.valueCents)}</td><td data-label="Receipts" className="num">{p.receipts}</td></tr>)}</tbody>
            </table>
          </div>
          <h3 className="erp-h3">Receipts</h3>
          <ul className="erp-list">{q.data.rows.map((r) => <li key={r.id} className="small">{dateText(r.date)} <span className="mt-num">{r.number}</span> from {moLink(companyId, r.moId, r.moNumber)}: {qty(r.quantity)} {r.uom} of {r.productNumber}, {money(r.valueCents)}</li>)}</ul>
        </>
      ) : null}
    </Shell>
  );
}

export function WorkOrderProgress({ companyId }: { companyId: string }) {
  const f = useFilters(['status']);
  const q = useData<{ rows: { id: string; number: string; statusLabel: string; productNumber: string; productName: string; uom: string; quantity: number; completedQty: number; progressPct: number; operations: string; currentOperation: string; requiredDate: string | null; finishDate: string | null; late: boolean }[]; note: string }>(companyId, `/reports/work-order-progress?${f.qs}`);
  return (
    <Shell title="Work order progress" companyId={companyId} csv={`/reports/work-order-progress?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Open and completed</option><option value="draft">Draft</option><option value="released">Released</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="closed">Closed</option></select>}>
      {q.data && !q.data.rows.length ? <Empty>No manufacturing orders.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Order</th><th>Status</th><th>Progress</th><th>Operations</th><th>Required</th><th>Planned finish</th></tr></thead>
            <tbody>{q.data.rows.map((m) => <tr key={m.id}><td data-label="Order">{moLink(companyId, m.id, m.number)} {m.productNumber} {m.productName}</td><td data-label="Status">{m.statusLabel} {m.late ? <span className="badge danger">Late</span> : null}</td><td data-label="Progress"><progress className="erp-progress" max={100} value={m.progressPct} aria-label={`${m.progressPct}%`} /> <span className="small">{qty(m.completedQty)} of {qty(m.quantity)}</span></td><td data-label="Operations">{m.operations}{m.currentOperation ? <div className="muted small">{m.currentOperation}</div> : null}</td><td data-label="Required">{dateText(m.requiredDate)}</td><td data-label="Planned finish">{dateText(m.finishDate)}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}

export function MaterialConsumption({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ rows: { productId: string; number: string; name: string; uom: string; issued: number; returned: number; scrapped: number; net: number; valueCents: number; orders: number; references: string[] }[]; note: string }>(companyId, `/reports/material-consumption?${f.qs}`);
  return (
    <Shell title="Material consumption" companyId={companyId} csv={`/reports/material-consumption?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>No materials issued to production in this period.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Material</th><th className="num">Issued</th><th className="num">Returned</th><th className="num">Scrapped</th><th className="num">Net used</th><th className="num">Value</th><th>Orders</th></tr></thead>
            <tbody>{q.data.rows.map((r) => <tr key={r.productId}><td data-label="Material"><Link to={inventoryPage(companyId, `/movements?productId=${r.productId}&source=manufacturing_order`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="Issued" className="num">{qty(r.issued)}</td><td data-label="Returned" className="num">{r.returned ? qty(r.returned) : ''}</td><td data-label="Scrapped" className="num">{r.scrapped ? qty(r.scrapped) : ''}</td><td data-label="Net used" className="num">{qty(r.net)} <span className="muted small">{r.uom}</span></td><td data-label="Value" className="num">{money(r.valueCents)}</td><td data-label="Orders" className="small">{r.references.join(', ')}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}

export function LabourUtilisation({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ workCentres: { id: string; code: string; name: string; availableHours: number; labourHours: number; machineHours: number; reworkHours: number; labourCostCents: number; utilisationPct: number | null }[]; people: { userId: string; name: string; labourHours: number; reworkHours: number }[]; note: string }>(companyId, `/reports/labour-utilisation?${f.qs}`);
  return (
    <Shell title="Labour utilisation" companyId={companyId} csv={`/reports/labour-utilisation?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data ? (
        <>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Work centre</th><th className="num">Available</th><th className="num">Labour</th><th className="num">Machine</th><th className="num">Rework</th><th className="num">Labour cost</th><th className="num">Utilisation</th></tr></thead>
              <tbody>{q.data.workCentres.map((w) => <tr key={w.id}><td data-label="Work centre"><Link to={manufacturingPage(companyId, `/work-centres/${w.id}`)}><span className="mt-num">{w.code}</span> {w.name}</Link></td><td data-label="Available" className="num">{w.availableHours} h</td><td data-label="Labour" className="num">{w.labourHours} h</td><td data-label="Machine" className="num">{w.machineHours} h</td><td data-label="Rework" className="num">{w.reworkHours ? `${w.reworkHours} h` : ''}</td><td data-label="Labour cost" className="num">{money(w.labourCostCents)}</td><td data-label="Utilisation" className="num">{w.utilisationPct === null ? '' : `${w.utilisationPct}%`}</td></tr>)}</tbody>
            </table>
          </div>
          {q.data.people.length ? <><h3 className="erp-h3">People</h3><ul className="erp-list">{q.data.people.map((p) => <li key={p.userId} className="small">{p.name}: {p.labourHours} h{p.reworkHours ? `, of which ${p.reworkHours} h rework` : ''}</li>)}</ul></> : null}
        </>
      ) : null}
    </Shell>
  );
}

export function ProductionVariance({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ rows: { id: string; number: string; productNumber: string; productName: string; quantity: number; completedQty: number; closedAt: number; currency: string; estimatedCents: number; actualCents: number; varianceCents: number }[]; totals: { element: string; label: string; estimatedCents: number; actualCents: number; varianceCents: number }[]; note: string; profitability: string }>(companyId, `/reports/production-variance?${f.qs}`);
  return (
    <Shell title="Production variance" companyId={companyId} csv={`/reports/production-variance?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>No orders closed in this period.</Empty> : q.data ? (
        <>
          <div className="crm-table-scroll">
            <table className="data-table">
              <thead><tr><th>Element</th><th className="num">Estimated</th><th className="num">Actual</th><th className="num">Variance</th></tr></thead>
              <tbody>{q.data.totals.map((t) => <tr key={t.element}><td>{t.label}</td><td className="num">{money(t.estimatedCents)}</td><td className="num">{money(t.actualCents)}</td><td className={`num${t.varianceCents > 0 ? ' erp-neg' : ''}`}>{money(t.varianceCents)}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Order</th><th className="num">Completed</th><th className="num">Estimated</th><th className="num">Actual</th><th className="num">Variance</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={r.id}><td data-label="Order">{moLink(companyId, r.id, r.number)} {r.productNumber} {r.productName}</td><td data-label="Completed" className="num">{qty(r.completedQty)} of {qty(r.quantity)}</td><td data-label="Estimated" className="num">{money(r.estimatedCents, r.currency)}</td><td data-label="Actual" className="num">{money(r.actualCents, r.currency)}</td><td data-label="Variance" className={`num${r.varianceCents > 0 ? ' erp-neg' : ''}`}>{money(r.varianceCents, r.currency)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
      <p className="muted small">{q.data?.profitability}</p>
    </Shell>
  );
}

export function MachineDowntime({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ rows: { id: string; date: string; minutes: number; reason: string; moId: string; moNumber: string; operation: string; workCentre: string; machine: string; byName: string | null }[]; byMachine: { key: string; workCentre: string; machine: string; minutes: number; events: number }[]; byReason: { reason: string; minutes: number }[]; note: string }>(companyId, `/reports/machine-downtime?${f.qs}`);
  return (
    <Shell title="Machine downtime" companyId={companyId} csv={`/reports/machine-downtime?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>No downtime reported in this period.</Empty> : q.data ? (
        <>
          <ul className="erp-list">{q.data.byMachine.map((m) => <li key={m.key} className="small"><strong>{m.workCentre}{m.machine ? ` / ${m.machine}` : ''}</strong>: {m.minutes} minutes in {m.events} report{m.events === 1 ? '' : 's'}</li>)}</ul>
          <h3 className="erp-h3">By reason</h3>
          <ul className="erp-list">{q.data.byReason.map((r) => <li key={r.reason} className="small">{r.reason}: {r.minutes} minutes</li>)}</ul>
          <h3 className="erp-h3">Each report</h3>
          <ul className="erp-list">{q.data.rows.map((r) => <li key={r.id} className="small">{dateText(r.date)} {moLink(companyId, r.moId, r.moNumber)} {r.operation}: {r.minutes} min, {r.reason}{r.byName ? ` (${r.byName})` : ''}</li>)}</ul>
        </>
      ) : null}
    </Shell>
  );
}

export function Oee({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ rows: { workCentre: string; machine: string; machineHours: number; downtimeHours: number; good: number; scrap: number; availabilityPct: number | null; performancePct: number | null; qualityPct: number | null; oeePct: number | null; note: string }[]; note: string }>(companyId, `/reports/oee?${f.qs}`);
  const p = (v: number | null) => (v === null ? '' : `${v}%`);
  return (
    <Shell title="Overall equipment effectiveness (OEE)" companyId={companyId} csv={`/reports/oee?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>Nothing was recorded on the shop floor in this period.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Work centre</th><th className="num">Machine hours</th><th className="num">Downtime hours</th><th className="num">Good</th><th className="num">Scrap</th><th className="num">Availability</th><th className="num">Performance</th><th className="num">Quality</th><th className="num">OEE</th></tr></thead>
            <tbody>{q.data.rows.map((r, i) => <tr key={i}><td data-label="Work centre">{r.workCentre}{r.machine ? ` / ${r.machine}` : ''}{r.note ? <div className="muted small">{r.note}</div> : null}</td><td data-label="Machine hours" className="num">{r.machineHours}</td><td data-label="Downtime hours" className="num">{r.downtimeHours}</td><td data-label="Good" className="num">{qty(r.good)}</td><td data-label="Scrap" className="num">{qty(r.scrap)}</td><td data-label="Availability" className="num">{p(r.availabilityPct)}</td><td data-label="Performance" className="num">{p(r.performancePct)}</td><td data-label="Quality" className="num">{p(r.qualityPct)}</td><td data-label="OEE" className="num"><strong>{r.oeePct === null ? 'Cannot be calculated' : `${r.oeePct}%`}</strong></td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}

export function MrpSuggestions({ companyId }: { companyId: string }) {
  const f = useFilters(['kind', 'status']);
  const q = useData<{ run: { id: string; number: string; runDate: string } | null; rows: Suggestion[] }>(companyId, `/reports/mrp-suggestions?${f.qs}`);
  return (
    <Shell title="MRP suggestions" companyId={companyId} csv={`/reports/mrp-suggestions?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} filters={<><select className="select" aria-label="Kind" value={f.g('kind')} onChange={(e) => f.set('kind', e.target.value)}><option value="">Every kind</option><option value="make">Make</option><option value="buy">Buy</option><option value="expedite">Expedite</option></select><select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Every status</option><option value="open">Open</option><option value="converted">Converted</option><option value="dismissed">Dismissed</option></select></>}>
      {q.data && !q.data.run ? <Empty>MRP has not run yet. Run it under Manufacturing, Planning.</Empty> : q.data ? (
        <>
          <p className="small">From {q.data.run!.number}, run on {dateText(q.data.run!.runDate)}. <Link to={manufacturingPage(companyId, '/planning')}>Open planning</Link></p>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Suggestion</th><th className="num">Quantity</th><th>Needed</th><th>Order or start by</th><th>Messages</th><th>Status</th></tr></thead>
              <tbody>{q.data.rows.map((s) => <tr key={s.id}><td data-label="Suggestion">{s.kindLabel} <span className="mt-num">{s.productNumber}</span> {s.productName}{s.refNumber ? ` (${s.refNumber})` : ''}</td><td data-label="Quantity" className="num">{qty(s.quantity)} <span className="muted small">{s.uom}</span></td><td data-label="Needed">{dateText(s.needDate)}</td><td data-label="Order or start by">{dateText(s.orderDate)}</td><td data-label="Messages">{s.messages.map((m) => MESSAGE_LABELS[m] ?? m).join(', ')}</td><td data-label="Status">{s.status === 'converted' ? s.convertedNumber : s.status}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function CapacityLoad({ companyId }: { companyId: string }) {
  const q = useData<{ weeks: string[]; workCentres: { id: string; code: string; name: string; weeks: { week: string; availableHours: number; loadHours: number; loadPct: number | null; overload: boolean }[] }[] }>(companyId, '/reports/capacity-load?weeks=8');
  return (
    <Shell title="Capacity load" companyId={companyId} csv="/reports/capacity-load?weeks=8" error={q.error} loading={!q.data} retry={() => q.refetch()} note="Rough-cut: each operation’s hours in the week it is planned to start, with MRP’s planned orders.">
      {q.data && !q.data.workCentres.length ? <Empty>No work centres yet.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table erp-capacity">
            <thead><tr><th>Work centre</th>{q.data.weeks.map((w) => <th key={w} className="num">{dateText(w)}</th>)}</tr></thead>
            <tbody>{q.data.workCentres.map((w) => <tr key={w.id}><th scope="row"><Link to={manufacturingPage(companyId, `/work-centres/${w.id}`)}><span className="mt-num">{w.code}</span> {w.name}</Link></th>{w.weeks.map((x) => <td key={x.week} className={`num${x.overload ? ' erp-over' : ''}`}>{Math.round(x.loadHours * 10) / 10} / {x.availableHours} h{x.overload ? <div><span className="badge danger">{x.loadPct}%</span></div> : null}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}
