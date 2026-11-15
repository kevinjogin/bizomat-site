// BIZOMAT ERP, Release 4 part A reports, inside a company at /erp/c/<company>/erp-reports/<report>: inspection results,
// rejection rates by product and by supplier, supplier defects, the NCR register and its ageing, corrective action
// status and overdue actions, rework, and the cost of poor quality. Each filters as fits it, links every row to its
// record and exports CSV (src/worker/erp/quality-reports.ts). Figures come only from the company's own records.
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { CAPA_STATUS, NCR_STATUS, PLAN_KINDS, RESULTS, SEVERITIES, dateText, erpPath, inventoryPage, manufacturingPage, money, procurementPage, qty, qualityPage } from './api';
import { CsvLink, NotYet, Section, options } from './common';

export const QUALITY_REPORTS: { key: string; label: string; what: string }[] = [
  { key: 'inspection-results', label: 'Inspection results', what: 'Completed inspections by result and kind.' },
  { key: 'rejection-rates', label: 'Rejection rates', what: 'Failed inspections and rejected quantities by product and by supplier.' },
  { key: 'supplier-defects', label: 'Supplier defects', what: 'Refused at receipt, failed inspections, NCRs and returns per supplier.' },
  { key: 'ncr-register', label: 'NCR register', what: 'Every nonconformance with its age, disposition and actions.' },
  { key: 'capa-status', label: 'Corrective actions', what: 'Corrective and preventive actions by status, and the overdue ones.' },
  { key: 'rework', label: 'Rework', what: 'Rework on the shop floor, its time and cost, and rework dispositions.' },
  { key: 'cost-of-poor-quality', label: 'Cost of poor quality', what: 'Scrap value and rework cost from the records.' },
];

function useFilters(keys: string[]) {
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const qs = new URLSearchParams();
  for (const k of keys) if (g(k)) qs.set(k, g(k));
  return { g, set, qs: qs.toString() };
}

const useData = <T,>(companyId: string, path: string) => useQuery({ queryKey: ['erp', companyId, 'r4q-report', path], queryFn: () => get<T>(erpPath(companyId, path)) });

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
const pct = (n: number | null) => (n === null ? '' : `${n}%`);
const qLink = (companyId: string, path: string, text: ReactNode) => <Link className="mt-num" to={qualityPage(companyId, path)}>{text}</Link>;

export function InspectionResults({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to', 'kind', 'result']);
  const q = useData<{ from: string; to: string; rows: { id: string; number: string; date: string; kindLabel: string; result: string; resultLabel: string; productId: string | null; productNumber: string; productName: string; supplierName: string; quantity: number | null; uom: string; lot: string; reference: string; failedCharacteristics: number; inspectorName: string }[]; totals: { completed: number; passed: number; failed: number; conditional: number; passRatePct: number | null }; byKind: { kind: string; label: string; completed: number; passed: number; failed: number; conditional: number }[]; note: string }>(companyId, `/reports/inspection-results?${f.qs}`);
  return (
    <Shell
      title="Inspection results"
      companyId={companyId}
      csv={`/reports/inspection-results?${f.qs}`}
      error={q.error}
      loading={!q.data}
      retry={() => q.refetch()}
      note={q.data?.note}
      filters={<><DateRange f={f} /><select className="select" aria-label="Kind" value={f.g('kind')} onChange={(e) => f.set('kind', e.target.value)}><option value="">Every kind</option>{options(PLAN_KINDS)}</select><select className="select" aria-label="Result" value={f.g('result')} onChange={(e) => f.set('result', e.target.value)}><option value="">Any result</option>{options(RESULTS)}</select></>}
    >
      {q.data && !q.data.rows.length ? <Empty>No inspection completed between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Completed</dt><dd>{q.data.totals.completed}</dd></div>
            <div><dt>Passed</dt><dd>{q.data.totals.passed}</dd></div>
            <div><dt>Failed</dt><dd className={q.data.totals.failed ? 'erp-neg' : ''}>{q.data.totals.failed}</dd></div>
            <div><dt>Accepted on condition</dt><dd>{q.data.totals.conditional}</dd></div>
            <div><dt>Pass rate</dt><dd>{pct(q.data.totals.passRatePct)}</dd></div>
          </dl>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Kind</th><th className="num">Completed</th><th className="num">Passed</th><th className="num">Failed</th><th className="num">On condition</th></tr></thead>
              <tbody>{q.data.byKind.map((k) => <tr key={k.kind}><td data-label="Kind">{k.label}</td><td data-label="Completed" className="num">{k.completed}</td><td data-label="Passed" className="num">{k.passed}</td><td data-label="Failed" className="num">{k.failed}</td><td data-label="On condition" className="num">{k.conditional}</td></tr>)}</tbody>
            </table>
          </div>
          <h3 className="erp-h3">Inspections</h3>
          <ul className="erp-list">{q.data.rows.map((r) => <li key={r.id} className="small">{dateText(r.date)} {qLink(companyId, `/inspections/${r.id}`, r.number)} {r.kindLabel.toLowerCase()}: {r.productNumber || r.supplierName} {r.productName}{r.quantity !== null ? `, ${qty(r.quantity)} ${r.uom}` : ''}{r.lot ? `, lot ${r.lot}` : ''} <span className={`badge ${r.result === 'failed' ? 'danger' : r.result === 'passed' ? 'success' : 'warning'}`}>{r.resultLabel}</span>{r.failedCharacteristics ? <span className="muted"> {r.failedCharacteristics} characteristic{r.failedCharacteristics === 1 ? '' : 's'} failed</span> : null}</li>)}</ul>
        </>
      ) : null}
    </Shell>
  );
}

type RateRow = { id: string; number: string; name: string; uom: string; inspections: number; passed: number; failed: number; conditional: number; inspectedQty: number; rejectedQty: number; rejectionRatePct: number | null; quantityRatePct: number | null };

export function RejectionRates({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to', 'by']);
  const q = useData<{ from: string; to: string; byProduct: RateRow[]; bySupplier: RateRow[]; note: string }>(companyId, `/reports/rejection-rates?${f.qs}`);
  const bySupplier = f.g('by') === 'supplier';
  const rows = q.data ? (bySupplier ? q.data.bySupplier : q.data.byProduct) : [];
  return (
    <Shell
      title="Rejection rates"
      companyId={companyId}
      csv={`/reports/rejection-rates?${f.qs}`}
      error={q.error}
      loading={!q.data}
      retry={() => q.refetch()}
      note={q.data?.note}
      filters={<><DateRange f={f} /><select className="select" aria-label="By" value={f.g('by')} onChange={(e) => f.set('by', e.target.value)}><option value="">By product</option><option value="supplier">By supplier</option></select></>}
    >
      {q.data && !rows.length ? <Empty>No inspection completed between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>{bySupplier ? 'Supplier' : 'Product'}</th><th className="num">Inspections</th><th className="num">Failed</th><th className="num">On condition</th><th className="num">Rejection rate</th><th className="num">Inspected</th><th className="num">Rejected</th><th className="num">Quantity rate</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td data-label={bySupplier ? 'Supplier' : 'Product'}><Link to={bySupplier ? procurementPage(companyId, `/suppliers/${r.id}`) : inventoryPage(companyId, `/stock/${r.id}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td>
                  <td data-label="Inspections" className="num">{r.inspections}</td>
                  <td data-label="Failed" className="num">{r.failed}</td>
                  <td data-label="On condition" className="num">{r.conditional}</td>
                  <td data-label="Rejection rate" className="num"><strong className={r.failed ? 'erp-neg' : ''}>{pct(r.rejectionRatePct)}</strong></td>
                  <td data-label="Inspected" className="num">{qty(r.inspectedQty)} {r.uom}</td>
                  <td data-label="Rejected" className="num">{qty(r.rejectedQty)}</td>
                  <td data-label="Quantity rate" className="num">{pct(r.quantityRatePct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}

export function SupplierDefects({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ from: string; to: string; rows: { supplierId: string; number: string; name: string; receipts: number; receivedQty: number; refusedAtReceiptQty: number; inspections: number; failedInspections: number; conditional: number; rejectedQty: number; ncrs: number; openNcrs: number; affectedQty: number; returnedQty: number; returnedValueCents: number; defectRatePct: number | null }[]; note: string }>(companyId, `/reports/supplier-defects?${f.qs}`);
  return (
    <Shell title="Supplier defects" companyId={companyId} csv={`/reports/supplier-defects?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>Nothing received, inspected or raised against a supplier between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Supplier</th><th className="num">Received</th><th className="num">Refused at receipt</th><th className="num">Inspections failed</th><th className="num">Rejected by inspection</th><th className="num">Defect rate</th><th className="num">NCRs</th><th className="num">Returned</th></tr></thead>
            <tbody>
              {q.data.rows.map((r) => (
                <tr key={r.supplierId}>
                  <td data-label="Supplier"><Link to={procurementPage(companyId, `/suppliers/${r.supplierId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td>
                  <td data-label="Received" className="num">{qty(r.receivedQty)} <span className="muted small">in {r.receipts}</span></td>
                  <td data-label="Refused at receipt" className="num">{qty(r.refusedAtReceiptQty)}</td>
                  <td data-label="Inspections failed" className="num">{r.failedInspections} of {r.inspections}</td>
                  <td data-label="Rejected by inspection" className="num">{qty(r.rejectedQty)}</td>
                  <td data-label="Defect rate" className="num"><strong className={r.defectRatePct ? 'erp-neg' : ''}>{pct(r.defectRatePct)}</strong></td>
                  <td data-label="NCRs" className="num"><Link to={`${qualityPage(companyId, '/ncrs')}?q=${encodeURIComponent(r.name)}`}>{r.ncrs}</Link>{r.openNcrs ? <span className="muted small"> ({r.openNcrs} open)</span> : null}</td>
                  <td data-label="Returned" className="num">{qty(r.returnedQty)}{r.returnedValueCents ? <div className="muted small">{money(r.returnedValueCents)}</div> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}

export function NcrRegister({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to', 'status', 'severity']);
  const q = useData<{ rows: { id: string; number: string; title: string; severity: string; severityLabel: string; status: string; statusLabel: string; open: boolean; productNumber: string; productName: string; lot: string; quantity: number | null; supplierName: string; raised: string; closed: string; ageDays: number; disposition: string; capas: number }[]; ageing: { label: string; count: number }[]; bySeverity: { severity: string; label: string; count: number; open: number }[]; openCount: number; note: string }>(companyId, `/reports/ncr-register?${f.qs}`);
  return (
    <Shell
      title="NCR register"
      companyId={companyId}
      csv={`/reports/ncr-register?${f.qs}`}
      error={q.error}
      loading={!q.data}
      retry={() => q.refetch()}
      note={q.data?.note}
      filters={<><DateRange f={f} /><select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Every status</option><option value="open">Open</option>{options(NCR_STATUS)}</select><select className="select" aria-label="Severity" value={f.g('severity')} onChange={(e) => f.set('severity', e.target.value)}><option value="">Any severity</option>{options(SEVERITIES)}</select></>}
    >
      {q.data && !q.data.rows.length ? <Empty>No nonconformance matches.</Empty> : q.data ? (
        <>
          <h3 className="erp-h3">Ageing of the {q.data.openCount} open</h3>
          <dl className="co-figures">{q.data.ageing.map((a) => <div key={a.label}><dt>{a.label}</dt><dd className={a.label === 'Over 90 days' && a.count ? 'erp-neg' : ''}>{a.count}</dd></div>)}</dl>
          <dl className="co-figures">{q.data.bySeverity.map((s) => <div key={s.severity}><dt>{s.label}</dt><dd>{s.count} <span className="muted small">({s.open} open)</span></dd></div>)}</dl>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>NCR</th><th>Status</th><th>Severity</th><th>Product</th><th>Disposition</th><th className="num">Actions</th><th>Raised</th><th className="num">Age</th></tr></thead>
              <tbody>
                {q.data.rows.map((n) => (
                  <tr key={n.id}>
                    <td data-label="NCR">{qLink(companyId, `/ncrs/${n.id}`, n.number)} {n.title}</td>
                    <td data-label="Status">{n.statusLabel}</td>
                    <td data-label="Severity">{n.severityLabel}</td>
                    <td data-label="Product">{n.productNumber} {n.productName}{n.lot ? <div className="muted small">Lot {n.lot}</div> : null}</td>
                    <td data-label="Disposition">{n.disposition}</td>
                    <td data-label="Actions" className="num">{n.capas}</td>
                    <td data-label="Raised">{dateText(n.raised)}</td>
                    <td data-label="Age" className="num">{n.ageDays} d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function CapaStatus({ companyId }: { companyId: string }) {
  const f = useFilters(['status', 'overdue']);
  const q = useData<{ rows: { id: string; number: string; kindLabel: string; title: string; statusLabel: string; ncrId: string | null; ncrNumber: string; responsibleName: string; dueDate: string; overdue: boolean; daysOverdue: number }[]; byStatus: { status: string; label: string; count: number }[]; overdue: unknown[]; note: string }>(companyId, `/reports/capa-status?${f.qs}`);
  return (
    <Shell
      title="Corrective actions"
      companyId={companyId}
      csv={`/reports/capa-status?${f.qs}`}
      error={q.error}
      loading={!q.data}
      retry={() => q.refetch()}
      note={q.data?.note}
      filters={<><select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Every status</option>{options(CAPA_STATUS)}</select><label className="row small"><input type="checkbox" checked={f.g('overdue') === '1'} onChange={(e) => f.set('overdue', e.target.checked ? '1' : '')} /> Overdue only</label></>}
    >
      {q.data && !q.data.rows.length ? <Empty>No corrective or preventive action matches.</Empty> : q.data ? (
        <>
          <dl className="co-figures">{q.data.byStatus.filter((s) => s.count).map((s) => <div key={s.status}><dt>{s.label}</dt><dd>{s.count}</dd></div>)}<div><dt>Overdue</dt><dd className={q.data.overdue.length ? 'erp-neg' : ''}>{q.data.overdue.length}</dd></div></dl>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Action</th><th>Status</th><th>Responsible</th><th>Due</th><th>NCR</th></tr></thead>
              <tbody>
                {q.data.rows.map((x) => (
                  <tr key={x.id}>
                    <td data-label="Action">{qLink(companyId, `/capas/${x.id}`, x.number)} {x.title} <span className="muted small">{x.kindLabel}</span></td>
                    <td data-label="Status">{x.statusLabel} {x.overdue ? <span className="badge danger">{x.daysOverdue} d overdue</span> : null}</td>
                    <td data-label="Responsible">{x.responsibleName}</td>
                    <td data-label="Due">{dateText(x.dueDate)}</td>
                    <td data-label="NCR">{x.ncrId ? qLink(companyId, `/ncrs/${x.ncrId}`, x.ncrNumber) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function Rework({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ from: string; to: string; shopFloor: { id: string; date: string; moId: string; moNumber: string; opNo: number; operation: string; productNumber: string; quantity: number; uom: string; reason: string }[]; time: { moId: string; moNumber: string; hours: number; costCents: number }[]; ncrs: { ncrId: string; ncrNumber: string; title: string; date: string; kindLabel: string; productNumber: string; quantity: number; doneQty: number; uom: string }[]; totals: { reworkedQty: number; hours: number; costCents: number; ncrQty: number }; note: string }>(companyId, `/reports/rework?${f.qs}`);
  const empty = q.data && !q.data.shopFloor.length && !q.data.time.length && !q.data.ncrs.length;
  return (
    <Shell title="Rework" companyId={companyId} csv={`/reports/rework?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {empty && q.data ? <Empty>No rework between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Reworked on the shop floor</dt><dd>{qty(q.data.totals.reworkedQty)}</dd></div>
            <div><dt>Rework hours</dt><dd>{q.data.totals.hours}</dd></div>
            <div><dt>Rework cost</dt><dd>{money(q.data.totals.costCents)}</dd></div>
            <div><dt>Rework and repair dispositions</dt><dd>{qty(q.data.totals.ncrQty)}</dd></div>
          </dl>
          {q.data.shopFloor.length ? <><h3 className="erp-h3">On the shop floor</h3><ul className="erp-list">{q.data.shopFloor.map((x) => <li key={x.id} className="small">{dateText(x.date)} <Link className="mt-num" to={manufacturingPage(companyId, `/orders/${x.moId}`)}>{x.moNumber}</Link> operation {x.opNo} {x.operation}: {qty(x.quantity)} {x.uom} of {x.productNumber}{x.reason ? ` (${x.reason})` : ''}</li>)}</ul></> : null}
          {q.data.time.length ? <><h3 className="erp-h3">Rework time</h3><ul className="erp-list">{q.data.time.map((x) => <li key={x.moId} className="small"><Link className="mt-num" to={manufacturingPage(companyId, `/orders/${x.moId}`)}>{x.moNumber}</Link>: {x.hours} h, {money(x.costCents)}</li>)}</ul></> : null}
          {q.data.ncrs.length ? <><h3 className="erp-h3">From nonconformances</h3><ul className="erp-list">{q.data.ncrs.map((x) => <li key={`${x.ncrId}:${x.kindLabel}`} className="small">{dateText(x.date)} {qLink(companyId, `/ncrs/${x.ncrId}`, x.ncrNumber)} {x.kindLabel.toLowerCase()} {qty(x.quantity)} {x.uom} of {x.productNumber}: {x.title} ({qty(x.doneQty)} done)</li>)}</ul></> : null}
        </>
      ) : null}
    </Shell>
  );
}

export function CostOfPoorQuality({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ from: string; to: string; scrap: { source: string; sourceLabel: string; productId: string; productNumber: string; productName: string; uom: string; quantity: number; valueCents: number }[]; rework: { hours: number; costCents: number }; totals: { scrapCents: number; reworkCents: number; internalFailureCents: number }; returnedToSuppliers: { quantity: number; valueCents: number; note: string }; planned: string[]; note: string }>(companyId, `/reports/cost-of-poor-quality?${f.qs}`);
  return (
    <Shell title="Cost of poor quality" companyId={companyId} csv={`/reports/cost-of-poor-quality?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Scrap</dt><dd>{money(q.data.totals.scrapCents)}</dd></div>
            <div><dt>Rework ({q.data.rework.hours} h)</dt><dd>{money(q.data.totals.reworkCents)}</dd></div>
            <div><dt>Internal failure, in all</dt><dd><strong>{money(q.data.totals.internalFailureCents)}</strong></dd></div>
          </dl>
          {q.data.scrap.length ? (
            <div className="crm-table-scroll">
              <table className="data-table responsive">
                <thead><tr><th>Scrap</th><th>Product</th><th className="num">Quantity</th><th className="num">Value</th></tr></thead>
                <tbody>{q.data.scrap.map((x) => <tr key={`${x.source}:${x.productId}`}><td data-label="Scrap">{x.sourceLabel}</td><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${x.productId}`)}><span className="mt-num">{x.productNumber}</span> {x.productName}</Link></td><td data-label="Quantity" className="num">{qty(x.quantity)} {x.uom}</td><td data-label="Value" className="num">{money(x.valueCents)}</td></tr>)}</tbody>
              </table>
            </div>
          ) : <Empty>No scrap between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty>}
          {q.data.returnedToSuppliers.quantity ? <p className="small">Returned to suppliers: {qty(q.data.returnedToSuppliers.quantity)} at {money(q.data.returnedToSuppliers.valueCents)}. {q.data.returnedToSuppliers.note}</p> : null}
          {q.data.planned.map((x) => <NotYet key={x}>Planned. {x}</NotYet>)}
        </>
      ) : null}
    </Shell>
  );
}
