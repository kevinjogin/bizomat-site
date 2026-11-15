// BIZOMAT ERP, Release 5 part A reports, inside a company at /erp/c/<company>/erp-reports/<report>: open orders and
// backlog, on-time and in-full delivery to customers, shipments by carrier, freight cost against charge, returns rate
// and reasons, sales by product and by customer, and job profitability. Each filters as fits it, links every row to its
// record and exports CSV (src/worker/erp/supply-reports.ts). Figures come only from the company's own records.
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { dateText, erpPath, manufacturingPage, money, qty, supplyPage, useCarriers } from './api';
import { CsvLink, Section } from './common';

export const SUPPLY_REPORTS: { key: string; label: string; what: string }[] = [
  { key: 'open-orders', label: 'Open orders', what: 'What confirmed sales orders still have to ship, its value and what is late.' },
  { key: 'customer-delivery', label: 'Delivery to customers', what: 'Orders delivered on time and in full.' },
  { key: 'shipments-by-carrier', label: 'Shipments by carrier', what: 'Shipments, packages, weight, transit time and freight per carrier.' },
  { key: 'freight', label: 'Freight cost and charge', what: 'What carriers charge against what customers are charged.' },
  { key: 'returns', label: 'Returns', what: 'Returns rate by product, and returns by reason.' },
  { key: 'sales', label: 'Sales by product and customer', what: 'What was dispatched, at its value before tax.' },
  { key: 'job-profitability', label: 'Job profitability', what: 'Orders made to order: revenue against actual cost.' },
];

function useFilters(keys: string[]) {
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const qs = new URLSearchParams();
  for (const k of keys) if (g(k)) qs.set(k, g(k));
  return { g, set, qs: qs.toString() };
}

const useData = <T,>(companyId: string, path: string) => useQuery({ queryKey: ['erp', companyId, 'r5-report', path], queryFn: () => get<T>(erpPath(companyId, path)) });

function Shell({ title, companyId, csv, children, error, loading, retry, filters, note, extraCsv }: { title: string; companyId: string; csv: string; children: ReactNode; error: unknown; loading: boolean; retry: () => void; filters?: ReactNode; note?: string; extraCsv?: ReactNode }) {
  usePageTitle(title);
  return (
    <Section title={title} actions={<div className="row wrap">{extraCsv}<CsvLink companyId={companyId} path={csv} /></div>}>
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
const soLink = (companyId: string, id: string, text: ReactNode) => <Link className="mt-num" to={supplyPage(companyId, `/orders/${id}`)}>{text}</Link>;
const shpLink = (companyId: string, id: string, text: ReactNode) => <Link className="mt-num" to={supplyPage(companyId, `/shipments/${id}`)}>{text}</Link>;

export function OpenOrders({ companyId }: { companyId: string }) {
  const f = useFilters(['late']);
  const q = useData<{ rows: { orderId: string; number: string; customerName: string; statusLabel: string; due: string | null; late: boolean; line: number; productNumber: string; productName: string; uom: string; ordered: number; shipped: number; allocated: number; openQty: number; openValueCents: number; currency: string }[]; byCustomer: { customerName: string; orders: number; openValueCents: number; lateValueCents: number }[]; totals: { orders: number; lines: number; openValueCents: number; lateLines: number; lateValueCents: number }; note: string }>(companyId, `/reports/open-orders?${f.qs}`);
  const cur = q.data?.rows[0]?.currency ?? 'AUD';
  return (
    <Shell title="Open orders and backlog" companyId={companyId} csv={`/reports/open-orders?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<label className="row erp-toggle"><input type="checkbox" checked={f.g('late') === '1'} onChange={(e) => f.set('late', e.target.checked ? '1' : '')} /> Late only</label>}>
      {q.data && !q.data.rows.length ? <Empty>Nothing confirmed is waiting to ship.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Orders</dt><dd>{q.data.totals.orders}</dd></div>
            <div><dt>Lines</dt><dd>{q.data.totals.lines}</dd></div>
            <div><dt>Open value</dt><dd>{money(q.data.totals.openValueCents, cur)}</dd></div>
            <div><dt>Late</dt><dd className={q.data.totals.lateLines ? 'erp-neg' : ''}>{money(q.data.totals.lateValueCents, cur)}</dd></div>
          </dl>
          <h3 className="erp-h3">By customer</h3>
          <ul className="erp-list">{q.data.byCustomer.map((c) => <li key={c.customerName} className="small">{c.customerName}: {c.orders} order{c.orders === 1 ? '' : 's'}, {money(c.openValueCents, cur)}{c.lateValueCents ? <span className="erp-neg"> ({money(c.lateValueCents, cur)} late)</span> : null}</li>)}</ul>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th className="num">Open</th><th className="num">Allocated</th><th className="num">Open value</th><th>Due</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={`${r.orderId}-${r.line}`}><td data-label="Order">{soLink(companyId, r.orderId, r.number)}</td><td data-label="Customer">{r.customerName}</td><td data-label="Product">{r.productNumber} {r.productName}</td><td data-label="Open" className="num">{qty(r.openQty)} {r.uom}</td><td data-label="Allocated" className="num">{qty(r.allocated)}</td><td data-label="Open value" className="num">{money(r.openValueCents, r.currency)}</td><td data-label="Due">{dateText(r.due)} {r.late ? <span className="badge danger">Late</span> : null}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function CustomerDelivery({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ from: string; to: string; rows: { id: string; number: string; customerName: string; due: string | null; firstDispatch: string; completedOn: string | null; shipments: number; ordered: number; shipped: number; onTime: boolean; inFull: boolean; otif: boolean }[]; totals: { orders: number; onTime: number; inFull: number; otif: number; onTimePct: number | null; inFullPct: number | null; otifPct: number | null }; note: string }>(companyId, `/reports/customer-delivery?${f.qs}`);
  const yes = (b: boolean) => (b ? <span className="badge success">Yes</span> : <span className="badge danger">No</span>);
  return (
    <Shell title="Delivery to customers" companyId={companyId} csv={`/reports/customer-delivery?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>No order was first dispatched between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Orders</dt><dd>{q.data.totals.orders}</dd></div>
            <div><dt>On time</dt><dd>{pct(q.data.totals.onTimePct)}</dd></div>
            <div><dt>In full</dt><dd>{pct(q.data.totals.inFullPct)}</dd></div>
            <div><dt>On time and in full</dt><dd>{pct(q.data.totals.otifPct)}</dd></div>
          </dl>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Order</th><th>Customer</th><th>Due</th><th>Completed</th><th className="num">Shipments</th><th>On time</th><th>In full</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={r.id}><td data-label="Order">{soLink(companyId, r.id, r.number)}</td><td data-label="Customer">{r.customerName}</td><td data-label="Due">{dateText(r.due)}</td><td data-label="Completed">{r.completedOn ? dateText(r.completedOn) : 'Not yet'}</td><td data-label="Shipments" className="num">{r.shipments}</td><td data-label="On time">{yes(r.onTime)}</td><td data-label="In full">{yes(r.inFull)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function ShipmentsByCarrier({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to', 'carrierId']);
  const carriers = useCarriers(companyId, true);
  const q = useData<{ from: string; to: string; carriers: { carrierId: string | null; carrierCode: string; carrierName: string; shipments: number; packages: number; weightKg: number; delivered: number; averageTransitDays: number | null; freightCostCents: number; freightChargeCents: number }[]; shipments: { id: string; number: string; salesOrderNumber: string; customerName: string; carrierName: string; service: string; trackingNumber: string; dispatchedOn: string; deliveredOn: string; packages: number; weightKg: number }[]; note: string }>(companyId, `/reports/shipments-by-carrier?${f.qs}`);
  return (
    <Shell title="Shipments by carrier" companyId={companyId} csv={`/reports/shipments-by-carrier?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<><DateRange f={f} /><select className="select" aria-label="Carrier" value={f.g('carrierId')} onChange={(e) => f.set('carrierId', e.target.value)}><option value="">Every carrier</option>{carriers.data?.carriers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></>}>
      {q.data && !q.data.shipments.length ? <Empty>No shipment was dispatched between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Carrier</th><th className="num">Shipments</th><th className="num">Packages</th><th className="num">Weight (kg)</th><th className="num">Delivered</th><th className="num">Transit (days)</th><th className="num">Freight cost</th><th className="num">Freight charge</th></tr></thead>
              <tbody>{q.data.carriers.map((c) => <tr key={c.carrierId ?? 'none'}><td data-label="Carrier">{c.carrierName}</td><td data-label="Shipments" className="num">{c.shipments}</td><td data-label="Packages" className="num">{c.packages}</td><td data-label="Weight (kg)" className="num">{c.weightKg}</td><td data-label="Delivered" className="num">{c.delivered}</td><td data-label="Transit (days)" className="num">{c.averageTransitDays ?? ''}</td><td data-label="Freight cost" className="num">{money(c.freightCostCents)}</td><td data-label="Freight charge" className="num">{money(c.freightChargeCents)}</td></tr>)}</tbody>
            </table>
          </div>
          <h3 className="erp-h3">Shipments</h3>
          <ul className="erp-list">{q.data.shipments.map((s) => <li key={s.id} className="small">{dateText(s.dispatchedOn)} {shpLink(companyId, s.id, s.number)} {s.customerName} ({s.salesOrderNumber}) · {s.carrierName}{s.service ? ` ${s.service}` : ''}{s.trackingNumber ? `, ${s.trackingNumber}` : ''}{s.deliveredOn ? `, delivered ${dateText(s.deliveredOn)}` : ''}</li>)}</ul>
        </>
      ) : null}
    </Shell>
  );
}

export function Freight({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to', 'carrierId']);
  const q = useData<{ from: string; to: string; rows: { id: string; number: string; salesOrderNumber: string; customerName: string; carrierName: string; dispatchedOn: string; costCents: number; chargeCents: number; differenceCents: number; currency: string }[]; totals: { shipments: number; costCents: number; chargeCents: number; differenceCents: number; recoveryPct: number | null; underCharged: number }; note: string }>(companyId, `/reports/freight?${f.qs}`);
  return (
    <Shell title="Freight cost and charge" companyId={companyId} csv={`/reports/freight?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>No shipment was dispatched between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Freight cost</dt><dd>{money(q.data.totals.costCents)}</dd></div>
            <div><dt>Freight charged</dt><dd>{money(q.data.totals.chargeCents)}</dd></div>
            <div><dt>Charge less cost</dt><dd className={q.data.totals.differenceCents < 0 ? 'erp-neg' : ''}>{money(q.data.totals.differenceCents)}</dd></div>
            <div><dt>Recovered</dt><dd>{pct(q.data.totals.recoveryPct)}</dd></div>
          </dl>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Shipment</th><th>Customer</th><th>Carrier</th><th className="num">Cost</th><th className="num">Charge</th><th className="num">Difference</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={r.id}><td data-label="Shipment">{shpLink(companyId, r.id, r.number)}<div className="muted small">{dateText(r.dispatchedOn)}</div></td><td data-label="Customer">{r.customerName}</td><td data-label="Carrier">{r.carrierName}</td><td data-label="Cost" className="num">{money(r.costCents, r.currency)}</td><td data-label="Charge" className="num">{money(r.chargeCents, r.currency)}</td><td data-label="Difference" className={`num${r.differenceCents < 0 ? ' erp-neg' : ''}`}>{money(r.differenceCents, r.currency)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function ReturnsReport({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ from: string; to: string; rows: { id: string; number: string; salesOrderNumber: string; customerName: string; status: string; reasonLabel: string; quantity: number; receivedQty: number; raisedOn: string }[]; byReason: { reason: string; label: string; returns: number; units: number }[]; byProduct: { productId: string; number: string; name: string; shipped: number; returned: number; ratePct: number | null }[]; totals: { returns: number; shippedUnits: number; returnedUnits: number; ratePct: number | null }; note: string }>(companyId, `/reports/returns?${f.qs}`);
  return (
    <Shell title="Returns" companyId={companyId} csv={`/reports/returns?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length && !q.data.byProduct.length ? <Empty>No shipment or return between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Returns raised</dt><dd>{q.data.totals.returns}</dd></div>
            <div><dt>Units shipped</dt><dd>{qty(q.data.totals.shippedUnits)}</dd></div>
            <div><dt>Units back</dt><dd>{qty(q.data.totals.returnedUnits)}</dd></div>
            <div><dt>Returns rate</dt><dd>{pct(q.data.totals.ratePct)}</dd></div>
          </dl>
          {q.data.byReason.length ? <><h3 className="erp-h3">By reason</h3><ul className="erp-list">{q.data.byReason.map((r) => <li key={r.reason} className="small">{r.label}: {r.returns} return{r.returns === 1 ? '' : 's'}, {qty(r.units)} unit{r.units === 1 ? '' : 's'}</li>)}</ul></> : null}
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th className="num">Shipped</th><th className="num">Back</th><th className="num">Rate</th></tr></thead>
              <tbody>{q.data.byProduct.map((p) => <tr key={p.productId}><td data-label="Product">{p.number} {p.name}</td><td data-label="Shipped" className="num">{qty(p.shipped)}</td><td data-label="Back" className="num">{qty(p.returned)}</td><td data-label="Rate" className="num">{pct(p.ratePct)}</td></tr>)}</tbody>
            </table>
          </div>
          {q.data.rows.length ? <><h3 className="erp-h3">Returns raised</h3><ul className="erp-list">{q.data.rows.map((r) => <li key={r.id} className="small">{dateText(r.raisedOn)} <Link className="mt-num" to={supplyPage(companyId, `/returns/${r.id}`)}>{r.number}</Link> {r.customerName} ({r.salesOrderNumber}): {r.reasonLabel}, {qty(r.quantity)}{r.receivedQty ? `, ${qty(r.receivedQty)} received` : ''}</li>)}</ul></> : null}
        </>
      ) : null}
    </Shell>
  );
}

export function SalesReport({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to', 'by']);
  const q = useData<{ from: string; to: string; byProduct: { productId: string; number: string; name: string; uom: string; quantity: number; valueCents: number; orders: number }[]; byCustomer: { customerName: string; quantity: number; valueCents: number; orders: number }[]; totals: { valueCents: number; shipments: number }; note: string }>(companyId, `/reports/sales?${f.qs}`);
  const byCustomer = f.g('by') === 'customer';
  return (
    <Shell
      title="Sales by product and customer"
      companyId={companyId}
      csv={`/reports/sales?${f.qs}`}
      error={q.error}
      loading={!q.data}
      retry={() => q.refetch()}
      note={q.data?.note}
      filters={<><DateRange f={f} /><select className="select" aria-label="By" value={f.g('by')} onChange={(e) => f.set('by', e.target.value)}><option value="">By product</option><option value="customer">By customer</option></select></>}
    >
      {q.data && !q.data.byProduct.length ? <Empty>Nothing was dispatched between {dateText(q.data.from)} and {dateText(q.data.to)}.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Shipments</dt><dd>{q.data.totals.shipments}</dd></div>
            <div><dt>Value before tax</dt><dd>{money(q.data.totals.valueCents)}</dd></div>
          </dl>
          <div className="crm-table-scroll">
            {byCustomer ? (
              <table className="data-table responsive">
                <thead><tr><th>Customer</th><th className="num">Orders</th><th className="num">Units</th><th className="num">Value before tax</th></tr></thead>
                <tbody>{q.data.byCustomer.map((c) => <tr key={c.customerName}><td data-label="Customer">{c.customerName}</td><td data-label="Orders" className="num">{c.orders}</td><td data-label="Units" className="num">{qty(c.quantity)}</td><td data-label="Value before tax" className="num">{money(c.valueCents)}</td></tr>)}</tbody>
              </table>
            ) : (
              <table className="data-table responsive">
                <thead><tr><th>Product</th><th className="num">Orders</th><th className="num">Quantity</th><th className="num">Value before tax</th></tr></thead>
                <tbody>{q.data.byProduct.map((p) => <tr key={p.productId}><td data-label="Product"><Link to={supplyPage(companyId, `/orders?q=${encodeURIComponent(p.number)}`)}>{p.number}</Link> {p.name}</td><td data-label="Orders" className="num">{p.orders}</td><td data-label="Quantity" className="num">{qty(p.quantity)} {p.uom}</td><td data-label="Value before tax" className="num">{money(p.valueCents)}</td></tr>)}</tbody>
              </table>
            )}
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function JobProfitability({ companyId }: { companyId: string }) {
  const f = useFilters(['status']);
  const q = useData<{ rows: { id: string; number: string; status: string; final: boolean; productNumber: string; productName: string; quantity: number; completedQty: number; salesOrderId: string; salesOrderNumber: string; line: number; customerName: string; revenueCents: number; costCents: number; marginCents: number; marginPct: number | null; currency: string }[]; totals: { orders: number; revenueCents: number; costCents: number; marginCents: number; marginPct: number | null }; note: string }>(companyId, `/reports/job-profitability?${f.qs}`);
  return (
    <Shell title="Job profitability" companyId={companyId} csv={`/reports/job-profitability?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Open and closed</option><option value="open">Open (cost so far)</option><option value="closed">Closed (final)</option></select>}>
      {q.data && !q.data.rows.length ? <Empty>No manufacturing order is made to order for a sales order line yet.</Empty> : q.data ? (
        <>
          <dl className="co-figures">
            <div><dt>Orders</dt><dd>{q.data.totals.orders}</dd></div>
            <div><dt>Revenue</dt><dd>{money(q.data.totals.revenueCents)}</dd></div>
            <div><dt>Actual cost</dt><dd>{money(q.data.totals.costCents)}</dd></div>
            <div><dt>Margin</dt><dd className={q.data.totals.marginCents < 0 ? 'erp-neg' : ''}>{money(q.data.totals.marginCents)} {pct(q.data.totals.marginPct)}</dd></div>
          </dl>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Order</th><th>Sales order</th><th>Product</th><th className="num">Revenue</th><th className="num">Cost</th><th className="num">Margin</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={r.id}><td data-label="Order"><Link className="mt-num" to={manufacturingPage(companyId, `/orders/${r.id}`)}>{r.number}</Link>{r.final ? null : <div className="muted small">Open: cost so far</div>}</td><td data-label="Sales order">{soLink(companyId, r.salesOrderId, r.salesOrderNumber)} line {r.line}<div className="muted small">{r.customerName}</div></td><td data-label="Product">{r.productNumber} {r.productName}, {qty(r.quantity)}</td><td data-label="Revenue" className="num">{money(r.revenueCents, r.currency)}</td><td data-label="Cost" className="num">{money(r.costCents, r.currency)}</td><td data-label="Margin" className={`num${r.marginCents < 0 ? ' erp-neg' : ''}`}>{money(r.marginCents, r.currency)} {pct(r.marginPct)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}
