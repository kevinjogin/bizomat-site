// BIZOMAT ERP, Release 2 reports, inside a company at /erp/c/<company>/erp-reports/<report>: purchase commitments,
// supplier spend, purchase price variance, supplier delivery performance, stock on hand, stock valuation, stock
// movements, stock ageing, slow-moving stock and shortages. Each filters by date, status, supplier or warehouse as fits
// it, links every row to its record and exports CSV (src/worker/erp/stock-reports.ts, inventory.ts).
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { PO_STATUS, dateText, dayText, erpPath, inventoryPage, money, procurementPage, qty } from './api';
import { CsvLink, PoBadge, Section } from './common';

export const STOCK_REPORTS: { key: string; label: string; what: string }[] = [
  { key: 'purchase-commitments', label: 'Purchase commitments', what: 'What open purchase orders still owe, at their net prices.' },
  { key: 'supplier-spend', label: 'Supplier spend', what: 'Orders placed and goods accepted per supplier, by date.' },
  { key: 'price-variance', label: 'Purchase price variance', what: 'Prices paid against standard costs, on goods accepted.' },
  { key: 'supplier-delivery', label: 'Supplier delivery', what: 'On time, in full and lead time, measured from goods receipts.' },
  { key: 'stock-on-hand', label: 'Stock on hand', what: 'Each product per warehouse: on hand, reserved, available and value.' },
  { key: 'stock-valuation', label: 'Stock valuation', what: 'Quantity, unit cost and value per product, by the company’s costing method.' },
  { key: 'stock-movements', label: 'Stock movements', what: 'The movement ledger with its documents, by date, kind and warehouse.' },
  { key: 'stock-ageing', label: 'Stock ageing', what: 'How long stock has been held, and lots that expire soon.' },
  { key: 'slow-moving', label: 'Slow-moving stock', what: 'Stock with no issue for the chosen number of days.' },
  { key: 'shortages', label: 'Shortages', what: 'Products below their reorder point or minimum, with what is on order.' },
];

function useFilters(keys: string[]) {
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const qs = new URLSearchParams();
  for (const k of keys) if (g(k)) qs.set(k, g(k));
  return { g, set, qs: qs.toString() };
}

function useData<T>(companyId: string, path: string) {
  return useQuery({ queryKey: ['erp', companyId, 'r2-report', path], queryFn: () => get<T>(erpPath(companyId, path)) });
}

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

function useWarehouseOptions(companyId: string) {
  const q = useQuery({ queryKey: ['erp', companyId, 'warehouses'], queryFn: () => get<{ warehouses: { id: string; code: string; name: string }[] }>(erpPath(companyId, '/warehouses')) });
  return q.data?.warehouses ?? [];
}

function useSupplierOptions(companyId: string) {
  const q = useQuery({ queryKey: ['erp', companyId, 'supplier-options'], queryFn: () => get<{ suppliers: { id: string; number: string; name: string }[] }>(erpPath(companyId, '/supplier-options')) });
  return q.data?.suppliers ?? [];
}

const DateRange = ({ f, label = 'From' }: { f: ReturnType<typeof useFilters>; label?: string }) => (
  <>
    <input className="input" type="date" aria-label={`${label} date`} value={f.g('from')} onChange={(e) => f.set('from', e.target.value)} />
    <input className="input" type="date" aria-label="To date" value={f.g('to')} onChange={(e) => f.set('to', e.target.value)} />
  </>
);

const SupplierFilter = ({ companyId, f }: { companyId: string; f: ReturnType<typeof useFilters> }) => {
  const s = useSupplierOptions(companyId);
  return <select className="select" aria-label="Supplier" value={f.g('supplierId')} onChange={(e) => f.set('supplierId', e.target.value)}><option value="">Every supplier</option>{s.map((x) => <option key={x.id} value={x.id}>{x.number} {x.name}</option>)}</select>;
};

const WarehouseFilter = ({ companyId, f }: { companyId: string; f: ReturnType<typeof useFilters> }) => {
  const w = useWarehouseOptions(companyId);
  return <select className="select" aria-label="Warehouse" value={f.g('warehouseId')} onChange={(e) => f.set('warehouseId', e.target.value)}><option value="">Every warehouse</option>{w.map((x) => <option key={x.id} value={x.id}>{x.code} {x.name}</option>)}</select>;
};

const Empty = ({ children }: { children: ReactNode }) => <p className="muted">{children}</p>;
const pct = (n: number | null) => (n === null ? '' : `${Math.round(n * 100)}%`);

export function PurchaseCommitments({ companyId }: { companyId: string }) {
  const f = useFilters(['status', 'supplierId', 'from', 'to']);
  const q = useData<{ rows: { id: string; number: string; status: string; orderDate: string; requiredDate: string | null; supplier: string; supplierId: string; currency: string; totalCents: number; outstandingCents: number; outstandingQty: number }[]; totals: { currency: string; cents: number }[]; note: string }>(companyId, `/reports/purchase-commitments?${f.qs}`);
  return (
    <Shell title="Purchase commitments" companyId={companyId} csv={`/reports/purchase-commitments?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note}
      filters={<><select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Every open order</option><option value="approved">{PO_STATUS.approved}</option><option value="sent">{PO_STATUS.sent}</option><option value="partially_received">{PO_STATUS.partially_received}</option></select><SupplierFilter companyId={companyId} f={f} /><DateRange f={f} label="Ordered from" /></>}>
      {q.data && !q.data.rows.length ? <Empty>No open purchase orders.</Empty> : q.data ? (
        <>
          <p><strong>{q.data.totals.map((t) => money(t.cents, t.currency)).join(' + ')}</strong> <span className="muted small">still to come</span></p>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Order</th><th>Supplier</th><th>Status</th><th>Required</th><th className="num">Order total</th><th className="num">Outstanding</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={r.id}><td data-label="Order"><Link className="mt-num" to={procurementPage(companyId, `/purchase-orders/${r.id}`)}>{r.number}</Link></td><td data-label="Supplier"><Link to={procurementPage(companyId, `/suppliers/${r.supplierId}`)}>{r.supplier}</Link></td><td data-label="Status"><PoBadge value={r.status} /></td><td data-label="Required">{dateText(r.requiredDate)}</td><td data-label="Order total" className="num">{money(r.totalCents, r.currency)}</td><td data-label="Outstanding" className="num">{money(r.outstandingCents, r.currency)}<div className="muted small">{qty(r.outstandingQty)} units</div></td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function SupplierSpend({ companyId }: { companyId: string }) {
  const f = useFilters(['from', 'to']);
  const q = useData<{ rows: { supplierId: string; number: string; name: string; currency: string; orders: number; orderedCents: number; receivedCents: number }[]; note: string }>(companyId, `/reports/supplier-spend?${f.qs}`);
  return (
    <Shell title="Supplier spend" companyId={companyId} csv={`/reports/supplier-spend?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<DateRange f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>No approved purchase orders in this period.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Supplier</th><th className="num">Orders</th><th className="num">Ordered</th><th className="num">Accepted</th></tr></thead>
            <tbody>{q.data.rows.map((r) => <tr key={`${r.supplierId}-${r.currency}`}><td data-label="Supplier"><Link to={procurementPage(companyId, `/suppliers/${r.supplierId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="Orders" className="num"><Link to={procurementPage(companyId, `/purchase-orders?supplierId=${r.supplierId}`)}>{r.orders}</Link></td><td data-label="Ordered" className="num">{money(r.orderedCents, r.currency)}</td><td data-label="Accepted" className="num">{money(r.receivedCents, r.currency)}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}

export function PriceVariance({ companyId }: { companyId: string }) {
  const f = useFilters(['supplierId', 'from', 'to']);
  const q = useData<{ rows: { receiptId: string; receiptNumber: string; receivedDate: string; poId: string; poNumber: string; supplier: string; productId: string; productNumber: string; productName: string; quantity: number; unitPaidCents: number; standardCostCents: number | null; currency: string; varianceCents: number | null; flag: string | null }[]; totalVarianceCents: number; currency: string; note: string }>(companyId, `/reports/price-variance?${f.qs}`);
  return (
    <Shell title="Purchase price variance" companyId={companyId} csv={`/reports/price-variance?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<><SupplierFilter companyId={companyId} f={f} /><DateRange f={f} label="Received from" /></>}>
      {q.data && !q.data.rows.length ? <Empty>No products received in this period.</Empty> : q.data ? (
        <>
          <p><strong>{money(q.data.totalVarianceCents, q.data.currency)}</strong> <span className="muted small">in all (above zero: paid more than standard)</span></p>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Receipt</th><th>Product</th><th className="num">Quantity</th><th className="num">Paid a unit</th><th className="num">Standard</th><th className="num">Variance</th></tr></thead>
              <tbody>{q.data.rows.map((r, i) => <tr key={`${r.receiptId}-${i}`}><td data-label="Receipt"><Link className="mt-num" to={procurementPage(companyId, `/receipts/${r.receiptId}`)}>{r.receiptNumber}</Link><div className="muted small">{dateText(r.receivedDate)} · {r.supplier}</div></td><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.productNumber}</span> {r.productName}</Link></td><td data-label="Quantity" className="num">{qty(r.quantity)}</td><td data-label="Paid a unit" className="num">{money(Math.round(r.unitPaidCents), r.currency)}</td><td data-label="Standard" className="num">{money(r.standardCostCents, r.currency)}</td><td data-label="Variance" className="num">{r.varianceCents === null ? <span className="muted small">{r.flag}</span> : <strong className={r.varianceCents > 0 ? 'erp-neg' : undefined}>{money(r.varianceCents, r.currency)}</strong>}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function SupplierDelivery({ companyId }: { companyId: string }) {
  const f = useFilters(['supplierId', 'from', 'to']);
  const q = useData<{ rows: { supplierId: string; number: string; name: string; orders: number; receipts: number; onTimeRate: number | null; onTimeMeasured: number; inFullRate: number | null; inFullMeasured: number; avgLeadTimeDays: number | null; rejectedQty: number; receivedQty: number }[]; note: string }>(companyId, `/reports/supplier-delivery?${f.qs}`);
  return (
    <Shell title="Supplier delivery performance" companyId={companyId} csv={`/reports/supplier-delivery?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<><SupplierFilter companyId={companyId} f={f} /><DateRange f={f} label="Received from" /></>}>
      {q.data && !q.data.rows.length ? <Empty>No goods received in this period: nothing to measure.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Supplier</th><th className="num">Receipts</th><th className="num">On time</th><th className="num">In full</th><th className="num">Lead time</th><th className="num">Damaged or rejected</th></tr></thead>
            <tbody>{q.data.rows.map((r) => <tr key={r.supplierId}><td data-label="Supplier"><Link to={procurementPage(companyId, `/suppliers/${r.supplierId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="Receipts" className="num"><Link to={procurementPage(companyId, `/receipts?supplierId=${r.supplierId}`)}>{r.receipts}</Link></td><td data-label="On time" className="num">{pct(r.onTimeRate)}<div className="muted small">of {r.onTimeMeasured}</div></td><td data-label="In full" className="num">{pct(r.inFullRate)}<div className="muted small">of {r.inFullMeasured} orders</div></td><td data-label="Lead time" className="num">{r.avgLeadTimeDays === null ? '' : `${r.avgLeadTimeDays} days`}</td><td data-label="Damaged or rejected" className="num">{qty(r.rejectedQty)} of {qty(r.receivedQty)}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}

export function StockOnHand({ companyId }: { companyId: string }) {
  const f = useFilters(['warehouseId', 'q']);
  const q = useData<{ rows: { productId: string; number: string; name: string; uom: string; warehouse: string; onHand: number; reserved: number; available: number; quarantine: number; valueCents: number }[]; currency: string; totalCents: number }>(companyId, `/reports/stock-on-hand?${f.qs}`);
  return (
    <Shell title="Stock on hand" companyId={companyId} csv={`/reports/stock-on-hand?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} filters={<><input className="input" type="search" aria-label="Search" placeholder="Number or name" value={f.g('q')} onChange={(e) => f.set('q', e.target.value)} /><WarehouseFilter companyId={companyId} f={f} /></>}>
      {q.data && !q.data.rows.length ? <Empty>No stock.</Empty> : q.data ? (
        <>
          <p><strong>{money(q.data.totalCents, q.data.currency)}</strong> <span className="muted small">of stock</span></p>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th>Warehouse</th><th className="num">On hand</th><th className="num">Reserved</th><th className="num">Available</th><th className="num">Quarantine</th><th className="num">Value</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={`${r.productId}-${r.warehouse}`}><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="Warehouse">{r.warehouse}</td><td data-label="On hand" className="num">{qty(r.onHand)} <span className="muted small">{r.uom}</span></td><td data-label="Reserved" className="num">{r.reserved ? qty(r.reserved) : ''}</td><td data-label="Available" className="num">{qty(r.available)}</td><td data-label="Quarantine" className="num">{r.quarantine ? qty(r.quarantine) : ''}</td><td data-label="Value" className="num">{money(r.valueCents, q.data!.currency)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function StockValuationReport({ companyId }: { companyId: string }) {
  const f = useFilters(['warehouseId']);
  const q = useData<{ methodLabel: string; locked: boolean; currency: string; rows: { productId: string; number: string; name: string; uom: string; quantity: number; unitCostCents: number | null; valueCents: number }[]; totalCents: number; note: string | null; financePosting: string }>(companyId, `/valuation?${f.qs}`);
  return (
    <Shell title="Stock valuation" companyId={companyId} csv={`/valuation?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={[q.data?.note, q.data?.financePosting].filter(Boolean).join(' ')} filters={<WarehouseFilter companyId={companyId} f={f} />}>
      {q.data ? (
        <>
          <p><strong>{money(q.data.totalCents, q.data.currency)}</strong> <span className="muted small">by {q.data.methodLabel.toLowerCase()}{q.data.locked ? ' (locked)' : ''}</span></p>
          {!q.data.rows.length ? <Empty>No stock to value.</Empty> : (
            <div className="crm-table-scroll">
              <table className="data-table responsive">
                <thead><tr><th>Product</th><th className="num">Quantity</th><th className="num">Unit cost</th><th className="num">Value</th></tr></thead>
                <tbody>{q.data.rows.map((r) => <tr key={r.productId}><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="Quantity" className="num">{qty(r.quantity)} <span className="muted small">{r.uom}</span></td><td data-label="Unit cost" className="num">{r.unitCostCents === null ? '' : money(Math.round(r.unitCostCents), q.data!.currency)}</td><td data-label="Value" className="num">{money(r.valueCents, q.data!.currency)}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </Shell>
  );
}

export function StockMovementsReport({ companyId }: { companyId: string }) {
  const f = useFilters(['warehouseId', 'type', 'from', 'to']);
  const q = useData<{ moves: { id: string; typeLabel: string; productId: string; productNumber: string; productName: string; warehouseCode: string; locationCode: string; lot: string; quantity: number; valueCents: number; sourceType: string; sourceId: string | null; reference: string; at: number }[]; total: number; types: { value: string; label: string }[] }>(companyId, `/movements?${f.qs}&limit=200`);
  return (
    <Shell title="Stock movements" companyId={companyId} csv={`/movements?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data && q.data.total > 200 ? `The latest 200 of ${q.data.total} are shown; the CSV has them all.` : undefined}
      filters={<><select className="select" aria-label="Movement" value={f.g('type')} onChange={(e) => f.set('type', e.target.value)}><option value="">Every movement</option>{(q.data?.types ?? []).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select><WarehouseFilter companyId={companyId} f={f} /><DateRange f={f} /></>}>
      {q.data && !q.data.moves.length ? <Empty>No movements.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>When</th><th>Movement</th><th>Product</th><th>Location</th><th className="num">Quantity</th><th className="num">Value</th><th>Document</th></tr></thead>
            <tbody>{q.data.moves.map((m) => <tr key={m.id}><td data-label="When">{dayText(m.at)}</td><td data-label="Movement">{m.typeLabel}</td><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${m.productId}`)}><span className="mt-num">{m.productNumber}</span> {m.productName}</Link></td><td data-label="Location">{m.warehouseCode}/{m.locationCode}{m.lot ? <div className="muted small">Lot {m.lot}</div> : null}</td><td data-label="Quantity" className="num">{m.quantity ? qty(m.quantity) : ''}</td><td data-label="Value" className="num">{m.valueCents ? money(m.valueCents) : ''}</td><td data-label="Document">{m.sourceType === 'receipt' && m.sourceId ? <Link to={procurementPage(companyId, `/receipts/${m.sourceId}`)}>{m.reference}</Link> : m.sourceType === 'count' && m.sourceId ? <Link to={inventoryPage(companyId, `/counts/${m.sourceId}`)}>{m.reference}</Link> : m.reference}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}

export function StockAgeing({ companyId }: { companyId: string }) {
  const f = useFilters(['warehouseId']);
  const q = useData<{ buckets: { key: string; label: string }[]; rows: ({ productId: string; number: string; name: string; uom: string; onHand: number } & Record<string, number | string>)[]; expiring: { productId: string; number: string; name: string; lot: string; serial: string; expiry: string; onHand: number; location: string }[]; note: string }>(companyId, `/reports/stock-ageing?${f.qs}`);
  return (
    <Shell title="Stock ageing" companyId={companyId} csv={`/reports/stock-ageing?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note} filters={<WarehouseFilter companyId={companyId} f={f} />}>
      {q.data && !q.data.rows.length ? <Empty>No stock.</Empty> : q.data ? (
        <>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th className="num">On hand</th>{q.data.buckets.map((b) => <th key={b.key} className="num">{b.label}</th>)}</tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={r.productId}><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="On hand" className="num">{qty(r.onHand)}</td>{q.data!.buckets.map((b) => <td key={b.key} data-label={b.label} className="num">{Number(r[b.key]) ? qty(Number(r[b.key])) : ''}</td>)}</tr>)}</tbody>
            </table>
          </div>
          {q.data.expiring.length ? (
            <>
              <h3 className="crm-subhead">Expiring within 30 days, or expired</h3>
              <ul className="erp-list">{q.data.expiring.map((e, i) => <li key={i}><Link to={inventoryPage(companyId, `/trace?productId=${e.productId}&lot=${encodeURIComponent(e.lot)}`)}><span className="mt-num">{e.number}</span> lot {e.lot || e.serial}</Link>: {qty(e.onHand)} at {e.location}, expires {dateText(e.expiry)}</li>)}</ul>
            </>
          ) : null}
        </>
      ) : null}
    </Shell>
  );
}

export function SlowMoving({ companyId }: { companyId: string }) {
  const f = useFilters(['warehouseId', 'days']);
  const q = useData<{ days: number; rows: { productId: string; number: string; name: string; uom: string; onHand: number; valueCents: number; lastIssued: string; lastReceived: string; daysSinceIssue: number | null }[]; currency: string; totalCents: number; note: string }>(companyId, `/reports/slow-moving?${f.qs}`);
  return (
    <Shell title="Slow-moving stock" companyId={companyId} csv={`/reports/slow-moving?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note}
      filters={<><select className="select" aria-label="No issue for" value={f.g('days') || '90'} onChange={(e) => f.set('days', e.target.value === '90' ? '' : e.target.value)}>{[30, 60, 90, 180, 365].map((d) => <option key={d} value={d}>No issue for {d} days</option>)}</select><WarehouseFilter companyId={companyId} f={f} /></>}>
      {q.data && !q.data.rows.length ? <Empty>Nothing slow-moving.</Empty> : q.data ? (
        <>
          <p><strong>{money(q.data.totalCents, q.data.currency)}</strong> <span className="muted small">held in slow-moving stock</span></p>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th className="num">On hand</th><th className="num">Value</th><th>Last issued</th><th>Last received</th></tr></thead>
              <tbody>{q.data.rows.map((r) => <tr key={r.productId}><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="On hand" className="num">{qty(r.onHand)} <span className="muted small">{r.uom}</span></td><td data-label="Value" className="num">{money(r.valueCents, q.data!.currency)}</td><td data-label="Last issued">{r.lastIssued ? dateText(r.lastIssued) : 'Never'}</td><td data-label="Last received">{dateText(r.lastReceived)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : null}
    </Shell>
  );
}

export function Shortages({ companyId }: { companyId: string }) {
  const q = useData<{ rows: { productId: string; number: string; name: string; uom: string; available: number; onOrder: number; reorderPoint: number | null; minQty: number | null; maxQty: number | null; shortfall: number; suggestedOrder: number; nextDue: string | null }[]; note: string }>(companyId, '/reports/shortages');
  return (
    <Shell title="Shortages" companyId={companyId} csv="/reports/shortages" error={q.error} loading={!q.data} retry={() => q.refetch()} note={q.data?.note}>
      {q.data && !q.data.rows.length ? <Empty>No product is below its reorder point or minimum. Set them on each product’s stock page.</Empty> : q.data ? (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Product</th><th className="num">Available</th><th className="num">On order</th><th className="num">Reorder point</th><th className="num">Minimum</th><th className="num">Short by</th><th className="num">Suggested order</th><th>Next order due</th></tr></thead>
            <tbody>{q.data.rows.map((r) => <tr key={r.productId}><td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td><td data-label="Available" className="num">{qty(r.available)} <span className="muted small">{r.uom}</span></td><td data-label="On order" className="num">{r.onOrder ? qty(r.onOrder) : ''}</td><td data-label="Reorder point" className="num">{r.reorderPoint ?? ''}</td><td data-label="Minimum" className="num">{r.minQty ?? ''}</td><td data-label="Short by" className="num"><strong>{qty(r.shortfall)}</strong></td><td data-label="Suggested order" className="num">{qty(r.suggestedOrder)}</td><td data-label="Next order due">{dateText(r.nextDue)}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </Shell>
  );
}
