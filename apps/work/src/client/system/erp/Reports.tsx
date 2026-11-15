// BIZOMAT ERP reports, inside a company at /erp/c/<company>/erp-reports/<report>. Release 1: product catalogue,
// lifecycle, bill of materials cost, where-used, revisions and changes, and suppliers. Release 2 (StockReports.tsx):
// purchasing and stock. Release 3 (MfgReports.tsx): manufacturing. Release 4 (QualityReports.tsx): quality. Release 5
// (SupplyReports.tsx): supply chain. Each filters, links every row to its record and
// exports CSV. Figures come only from the company's own records.
import type { ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import { ECO_STATUS, LIFECYCLE, PRODUCT_TYPES, SUPPLIER_STATUS, dateText, dayText, erpPath, money, procurementPage, productsPage, reportPage } from './api';
import { CsvLink, EcoBadge, LifecycleBadge, Section, SupplierBadge, options } from './common';
import { PriceVariance, PurchaseCommitments, STOCK_REPORTS, Shortages, SlowMoving, StockAgeing, StockMovementsReport, StockOnHand, StockValuationReport, SupplierDelivery, SupplierSpend } from './StockReports';
import { CapacityLoad, LabourUtilisation, MFG_REPORTS, MachineDowntime, MaterialConsumption, MrpSuggestions, ProductionOutput, ProductionVariance, WorkOrderProgress } from './MfgReports';
// Release 4 part A: quality
import { CapaStatus, CostOfPoorQuality, InspectionResults, NcrRegister, QUALITY_REPORTS, RejectionRates, Rework, SupplierDefects } from './QualityReports';
// Release 5 part A: supply chain
import { CustomerDelivery, Freight, JobProfitability, OpenOrders, ReturnsReport, SUPPLY_REPORTS, SalesReport, ShipmentsByCarrier } from './SupplyReports';

export const ERP_REPORTS: { key: string; label: string; what: string }[] = [
  { key: 'catalogue', label: 'Product catalogue', what: 'Every product by type and category, with its released revision, costs and suppliers.' },
  { key: 'lifecycle', label: 'Product lifecycle', what: 'Products by lifecycle stage, and those whose effective end date is near or past.' },
  { key: 'bom-cost', label: 'Bill of materials cost', what: 'Rolled-up material cost of each released product, with missing costs and other currencies flagged.' },
  { key: 'where-used', label: 'Where used', what: 'Each component and the products that use it.' },
  { key: 'changes', label: 'Revisions and changes', what: 'Change orders with who drafted, approved and released them, change requests and revisions by status.' },
  { key: 'suppliers', label: 'Supplier list', what: 'Suppliers by status and category, the products they supply and their Finance link.' },
];

export function ErpReportsArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  return (
    <div className="page crm-page">
      <PageHeader title="ERP reports" subtitle={`${companyName}: products, engineering, suppliers, purchasing, stock, manufacturing, quality and supply chain. Each row opens its record; each report exports CSV.`} />
      <nav className="tabs mt-tabs erp-report-tabs" aria-label="Products and engineering reports">
        {ERP_REPORTS.map((r) => <NavLink key={r.key} to={reportPage(companyId, r.key)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{r.label}</NavLink>)}
      </nav>
      <nav className="tabs mt-tabs erp-report-tabs" aria-label="Purchasing and stock reports">
        {STOCK_REPORTS.map((r) => <NavLink key={r.key} to={reportPage(companyId, r.key)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{r.label}</NavLink>)}
      </nav>
      <nav className="tabs mt-tabs erp-report-tabs" aria-label="Manufacturing reports">
        {MFG_REPORTS.map((r) => <NavLink key={r.key} to={reportPage(companyId, r.key)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{r.label}</NavLink>)}
      </nav>
      <nav className="tabs mt-tabs erp-report-tabs" aria-label="Quality reports">
        {QUALITY_REPORTS.map((r) => <NavLink key={r.key} to={reportPage(companyId, r.key)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{r.label}</NavLink>)}
      </nav>
      <nav className="tabs mt-tabs erp-report-tabs" aria-label="Supply chain reports">
        {SUPPLY_REPORTS.map((r) => <NavLink key={r.key} to={reportPage(companyId, r.key)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{r.label}</NavLink>)}
      </nav>
      <Routes>
        <Route path="catalogue" element={<Catalogue companyId={companyId} />} />
        <Route path="lifecycle" element={<Lifecycle companyId={companyId} />} />
        <Route path="bom-cost" element={<BomCost companyId={companyId} />} />
        <Route path="where-used" element={<WhereUsedReport companyId={companyId} />} />
        <Route path="changes" element={<Changes companyId={companyId} />} />
        <Route path="suppliers" element={<Suppliers companyId={companyId} />} />
        <Route path="purchase-commitments" element={<PurchaseCommitments companyId={companyId} />} />
        <Route path="supplier-spend" element={<SupplierSpend companyId={companyId} />} />
        <Route path="price-variance" element={<PriceVariance companyId={companyId} />} />
        <Route path="supplier-delivery" element={<SupplierDelivery companyId={companyId} />} />
        <Route path="stock-on-hand" element={<StockOnHand companyId={companyId} />} />
        <Route path="stock-valuation" element={<StockValuationReport companyId={companyId} />} />
        <Route path="stock-movements" element={<StockMovementsReport companyId={companyId} />} />
        <Route path="stock-ageing" element={<StockAgeing companyId={companyId} />} />
        <Route path="slow-moving" element={<SlowMoving companyId={companyId} />} />
        <Route path="shortages" element={<Shortages companyId={companyId} />} />
        <Route path="production-output" element={<ProductionOutput companyId={companyId} />} />
        <Route path="work-order-progress" element={<WorkOrderProgress companyId={companyId} />} />
        <Route path="material-consumption" element={<MaterialConsumption companyId={companyId} />} />
        <Route path="labour-utilisation" element={<LabourUtilisation companyId={companyId} />} />
        <Route path="production-variance" element={<ProductionVariance companyId={companyId} />} />
        <Route path="machine-downtime" element={<MachineDowntime companyId={companyId} />} />
        <Route path="mrp-suggestions" element={<MrpSuggestions companyId={companyId} />} />
        <Route path="capacity-load" element={<CapacityLoad companyId={companyId} />} />
        <Route path="inspection-results" element={<InspectionResults companyId={companyId} />} />
        <Route path="rejection-rates" element={<RejectionRates companyId={companyId} />} />
        <Route path="supplier-defects" element={<SupplierDefects companyId={companyId} />} />
        <Route path="ncr-register" element={<NcrRegister companyId={companyId} />} />
        <Route path="capa-status" element={<CapaStatus companyId={companyId} />} />
        <Route path="rework" element={<Rework companyId={companyId} />} />
        <Route path="cost-of-poor-quality" element={<CostOfPoorQuality companyId={companyId} />} />
        <Route path="open-orders" element={<OpenOrders companyId={companyId} />} />
        <Route path="customer-delivery" element={<CustomerDelivery companyId={companyId} />} />
        <Route path="shipments-by-carrier" element={<ShipmentsByCarrier companyId={companyId} />} />
        <Route path="freight" element={<Freight companyId={companyId} />} />
        <Route path="returns" element={<ReturnsReport companyId={companyId} />} />
        <Route path="sales" element={<SalesReport companyId={companyId} />} />
        <Route path="job-profitability" element={<JobProfitability companyId={companyId} />} />
        <Route path="*" element={<Navigate to={reportPage(companyId, 'catalogue')} replace />} />
      </Routes>
    </div>
  );
}

/** Filters kept in the address, so a report can be shared and its CSV matches the screen. */
function useFilters(keys: string[]) {
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const qs = new URLSearchParams();
  for (const k of keys) if (g(k)) qs.set(k, g(k));
  return { g, set, qs: qs.toString() };
}

function useReport<T>(companyId: string, key: string, qs: string) {
  return useQuery({ queryKey: ['erp', companyId, 'report', key, qs], queryFn: () => get<T>(erpPath(companyId, `/reports/${key}?${qs}`)) });
}

function ProductFilters({ f }: { f: ReturnType<typeof useFilters> }) {
  return (
    <div className="row wrap mt-toolbar">
      <input className="input" type="search" aria-label="Search" placeholder="Number or name" value={f.g('q')} onChange={(e) => f.set('q', e.target.value)} />
      <select className="select" aria-label="Type" value={f.g('type')} onChange={(e) => f.set('type', e.target.value)}><option value="">Any type</option>{options(PRODUCT_TYPES)}</select>
      <select className="select" aria-label="Lifecycle" value={f.g('lifecycle')} onChange={(e) => f.set('lifecycle', e.target.value)}><option value="">Any lifecycle</option>{options(LIFECYCLE)}</select>
      <input className="input" aria-label="Category" placeholder="Category" value={f.g('category')} onChange={(e) => f.set('category', e.target.value)} />
    </div>
  );
}

const P_KEYS = ['q', 'type', 'lifecycle', 'category'];

function Shell({ title, companyId, csv, children, error, loading, retry }: { title: string; companyId: string; csv: string; children: ReactNode; error: unknown; loading: boolean; retry: () => void }) {
  usePageTitle(title);
  return (
    <Section title={title} actions={<CsvLink companyId={companyId} path={csv} />}>
      {error ? <ErrorBox error={error} retry={retry} /> : loading ? <Loading /> : children}
    </Section>
  );
}

function Counts({ items }: { items: { label: string; n: number }[] }) {
  return <div className="erp-stats">{items.map((i) => <div key={i.label} className="card crm-stat"><span className="crm-stat-label">{i.label}</span><span className="crm-stat-value">{i.n.toLocaleString()}</span></div>)}</div>;
}

function Catalogue({ companyId }: { companyId: string }) {
  const f = useFilters(P_KEYS);
  const q = useReport<{ total: number; byType: { value: string; label: string; n: number }[]; withoutRelease: number; withoutCost: number; rows: { id: string; number: string; name: string; typeLabel: string; category: string; lifecycle: string; released: string | null; standardCostCents: number | null; priceCents: number | null; currency: string; suppliers: number }[]; truncated: boolean }>(companyId, 'catalogue', f.qs);
  return (
    <div className="stack">
      <ProductFilters f={f} />
      <Shell title="Product catalogue" companyId={companyId} csv={`/reports/catalogue?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()}>
        {q.data ? (
          <>
            <Counts items={[{ label: 'Products', n: q.data.total }, { label: 'Without a released revision', n: q.data.withoutRelease }, { label: 'Without a standard cost', n: q.data.withoutCost }, ...q.data.byType.slice(0, 3).map((t) => ({ label: t.label, n: t.n }))]} />
            <Table head={['Number', 'Name', 'Type', 'Category', 'Lifecycle', 'Released', 'Standard cost', 'Price', 'Suppliers']} empty={!q.data.rows.length}>
              {q.data.rows.map((p) => (
                <tr key={p.id}>
                  <td data-label="Number"><Link className="mt-num mt-primary" to={productsPage(companyId, `/${p.id}`)}>{p.number}</Link></td>
                  <td data-label="Name">{p.name}</td>
                  <td data-label="Type">{p.typeLabel}</td>
                  <td data-label="Category">{p.category}</td>
                  <td data-label="Lifecycle"><LifecycleBadge value={p.lifecycle} /></td>
                  <td data-label="Released">{p.released ?? <span className="muted">None</span>}</td>
                  <td data-label="Standard cost" className="num">{money(p.standardCostCents, p.currency)}</td>
                  <td data-label="Price" className="num">{money(p.priceCents, p.currency)}</td>
                  <td data-label="Suppliers" className="num">{p.suppliers}</td>
                </tr>
              ))}
            </Table>
            {q.data.truncated ? <p className="muted small">The first 500 rows are shown; the CSV has them all.</p> : null}
          </>
        ) : null}
      </Shell>
    </div>
  );
}

function Lifecycle({ companyId }: { companyId: string }) {
  const f = useFilters(['q', 'type', 'category']);
  const q = useReport<{ stages: { value: string; label: string; n: number }[]; ending: { id: string; number: string; name: string; lifecycle: string; effectiveTo: string; passed: boolean }[]; rows: { id: string; number: string; name: string; typeLabel: string; lifecycle: string; effectiveFrom: string | null; effectiveTo: string | null; updatedAt: number }[] }>(companyId, 'lifecycle', f.qs);
  return (
    <div className="stack">
      <div className="row wrap mt-toolbar">
        <input className="input" type="search" aria-label="Search" placeholder="Number or name" value={f.g('q')} onChange={(e) => f.set('q', e.target.value)} />
        <select className="select" aria-label="Type" value={f.g('type')} onChange={(e) => f.set('type', e.target.value)}><option value="">Any type</option>{options(PRODUCT_TYPES)}</select>
      </div>
      <Shell title="Product lifecycle" companyId={companyId} csv={`/reports/lifecycle?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()}>
        {q.data ? (
          <>
            <Counts items={q.data.stages.map((s) => ({ label: s.label, n: s.n }))} />
            {q.data.ending.length ? (
              <div className="warn-box small">
                <strong>Effective end date within 90 days, or passed, while still draft or active:</strong>{' '}
                {q.data.ending.map((e, i) => <span key={e.id}>{i ? ', ' : ''}<Link to={productsPage(companyId, `/${e.id}`)}>{e.number}</Link> ({dateText(e.effectiveTo)}{e.passed ? ', passed' : ''})</span>)}
              </div>
            ) : null}
            <Table head={['Number', 'Name', 'Type', 'Lifecycle', 'Effective from', 'Effective to', 'Last changed']} empty={!q.data.rows.length}>
              {q.data.rows.map((p) => (
                <tr key={p.id}>
                  <td data-label="Number"><Link className="mt-num mt-primary" to={productsPage(companyId, `/${p.id}`)}>{p.number}</Link></td>
                  <td data-label="Name">{p.name}</td>
                  <td data-label="Type">{p.typeLabel}</td>
                  <td data-label="Lifecycle"><LifecycleBadge value={p.lifecycle} /></td>
                  <td data-label="Effective from">{dateText(p.effectiveFrom)}</td>
                  <td data-label="Effective to">{dateText(p.effectiveTo)}</td>
                  <td data-label="Last changed">{dayText(p.updatedAt)}</td>
                </tr>
              ))}
            </Table>
          </>
        ) : null}
      </Shell>
    </div>
  );
}

function BomCost({ companyId }: { companyId: string }) {
  const f = useFilters(P_KEYS);
  const q = useReport<{ rows: { id: string; number: string; name: string; typeLabel: string; revision: string; revisionId: string; currency: string; rolledUpCents: number | null; complete: boolean; missing: string[]; mixedCurrency: string[]; standardCostCents: number | null; priceCents: number | null; marginCents: number | null }[]; truncated: boolean; incomplete: number }>(companyId, 'bom-cost', f.qs);
  return (
    <div className="stack">
      <ProductFilters f={f} />
      <Shell title="Bill of materials cost" companyId={companyId} csv={`/reports/bom-cost?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()}>
        {q.data ? (
          <>
            <p className="muted small">Material cost of one, rolled up through every level of the released bills of materials. Labour and overheads are not included. Missing costs and other currencies are listed, never guessed or converted.</p>
            {q.data.incomplete ? <p className="warn-box small">{q.data.incomplete} {q.data.incomplete === 1 ? 'product has' : 'products have'} an incomplete cost.</p> : null}
            <Table head={['Product', 'Revision', 'Rolled-up cost', 'Standard cost', 'Price', 'Margin', 'Flags']} empty={!q.data.rows.length} emptyText="No product has a released bill of materials yet.">
              {q.data.rows.map((p) => (
                <tr key={p.id}>
                  <td data-label="Product"><Link to={productsPage(companyId, `/${p.id}?tab=structure&view=cost&revision=${p.revisionId}`)}><span className="mt-num">{p.number}</span> {p.name}</Link></td>
                  <td data-label="Revision">{p.revision}</td>
                  <td data-label="Rolled-up cost" className="num">{money(p.rolledUpCents, p.currency)}</td>
                  <td data-label="Standard cost" className="num">{money(p.standardCostCents, p.currency)}</td>
                  <td data-label="Price" className="num">{money(p.priceCents, p.currency)}</td>
                  <td data-label="Margin" className="num">{money(p.marginCents, p.currency)}</td>
                  <td data-label="Flags" className="small">{p.complete ? <span className="badge success">Complete</span> : <>{p.missing.length ? <div>No cost: {p.missing.join(', ')}</div> : null}{p.mixedCurrency.length ? <div>Other currency: {p.mixedCurrency.join(', ')}</div> : null}{!p.missing.length && !p.mixedCurrency.length ? 'Incomplete' : null}</>}</td>
                </tr>
              ))}
            </Table>
            {q.data.truncated ? <p className="muted small">The first 200 products are shown. Narrow the filters to see the rest.</p> : null}
          </>
        ) : null}
      </Shell>
    </div>
  );
}

function WhereUsedReport({ companyId }: { companyId: string }) {
  const f = useFilters(P_KEYS);
  const q = useReport<{ rows: { id: string; number: string; name: string; typeLabel: string; releasedParents: number; openParents: number; parentNumbers: string[] }[]; unusedParts: number }>(companyId, 'where-used', f.qs);
  return (
    <div className="stack">
      <ProductFilters f={f} />
      <Shell title="Where used" companyId={companyId} csv={`/reports/where-used?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()}>
        {q.data ? (
          <>
            {q.data.unusedParts ? <p className="muted small">{q.data.unusedParts} parts and materials are not used in any bill of materials.</p> : null}
            <Table head={['Component', 'Type', 'Used in released products', 'Used in open revisions', 'Released parents']} empty={!q.data.rows.length} emptyText="No component is used in a bill of materials yet.">
              {q.data.rows.map((p) => (
                <tr key={p.id}>
                  <td data-label="Component"><Link to={productsPage(companyId, `/${p.id}?tab=where-used`)}><span className="mt-num">{p.number}</span> {p.name}</Link></td>
                  <td data-label="Type">{p.typeLabel}</td>
                  <td data-label="Used in released products" className="num">{p.releasedParents}</td>
                  <td data-label="Used in open revisions" className="num">{p.openParents}</td>
                  <td data-label="Released parents" className="small">{p.parentNumbers.join(', ')}</td>
                </tr>
              ))}
            </Table>
          </>
        ) : null}
      </Shell>
    </div>
  );
}

function Changes({ companyId }: { companyId: string }) {
  const f = useFilters(['status', 'from', 'to']);
  const q = useReport<{ requests: Record<string, number>; revisions: Record<string, number>; averageDaysToRelease: number | null; exceptions: number; rows: { id: string; number: string; title: string; status: string; requestNumber: string | null; revisions: string; createdByName: string | null; approvedByName: string | null; releasedByName: string | null; createdAt: number; releasedAt: number | null; sodException: boolean }[] }>(companyId, 'changes', f.qs);
  return (
    <div className="stack">
      <div className="row wrap mt-toolbar">
        <select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Any status</option>{options(ECO_STATUS)}</select>
        <label className="small">Drafted from <input className="input" type="date" value={f.g('from')} onChange={(e) => f.set('from', e.target.value)} /></label>
        <label className="small">to <input className="input" type="date" value={f.g('to')} onChange={(e) => f.set('to', e.target.value)} /></label>
      </div>
      <Shell title="Revisions and changes" companyId={companyId} csv={`/reports/changes?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()}>
        {q.data ? (
          <>
            <Counts
              items={[
                { label: 'Released revisions', n: q.data.revisions.released ?? 0 },
                { label: 'Revisions in change', n: q.data.revisions.in_change ?? 0 },
                { label: 'Draft revisions', n: q.data.revisions.draft ?? 0 },
                { label: 'Open change requests', n: (q.data.requests.submitted ?? 0) + (q.data.requests.under_review ?? 0) },
                { label: 'Recorded exceptions', n: q.data.exceptions },
              ]}
            />
            {q.data.averageDaysToRelease !== null ? <p className="muted small">From submission to release: {q.data.averageDaysToRelease} days on average, for the change orders listed.</p> : null}
            <Table head={['Change order', 'Status', 'Revisions', 'Drafted by', 'Approved by', 'Released']} empty={!q.data.rows.length}>
              {q.data.rows.map((o) => (
                <tr key={o.id}>
                  <td data-label="Change order"><Link to={productsPage(companyId, `/changes/orders/${o.id}`)}><span className="mt-num">{o.number}</span> {o.title}</Link>{o.requestNumber ? <span className="muted small"> · {o.requestNumber}</span> : null}</td>
                  <td data-label="Status"><EcoBadge value={o.status} />{o.sodException ? <span className="badge warning">Exception</span> : null}</td>
                  <td data-label="Revisions" className="small">{o.revisions}</td>
                  <td data-label="Drafted by">{o.createdByName}<div className="muted small">{dayText(o.createdAt)}</div></td>
                  <td data-label="Approved by">{o.approvedByName}</td>
                  <td data-label="Released">{o.releasedByName}{o.releasedAt ? <div className="muted small">{dayText(o.releasedAt)}</div> : null}</td>
                </tr>
              ))}
            </Table>
          </>
        ) : null}
      </Shell>
    </div>
  );
}

function Suppliers({ companyId }: { companyId: string }) {
  const f = useFilters(['q', 'status', 'category']);
  const q = useReport<{ byStatus?: { value: string; label: string; n: number }[]; rows: { id: string; number: string; name: string; category: string; status: string; products: number; preferred: number; financeLinked: boolean; leadTimeDays: number | null; paymentTermsDays: number | null }[]; performance?: string }>(companyId, 'suppliers', f.qs);
  return (
    <div className="stack">
      <div className="row wrap mt-toolbar">
        <input className="input" type="search" aria-label="Search" placeholder="Number, name or ABN" value={f.g('q')} onChange={(e) => f.set('q', e.target.value)} />
        <select className="select" aria-label="Status" value={f.g('status')} onChange={(e) => f.set('status', e.target.value)}><option value="">Any status</option>{options(SUPPLIER_STATUS)}</select>
        <input className="input" aria-label="Category" placeholder="Category" value={f.g('category')} onChange={(e) => f.set('category', e.target.value)} />
      </div>
      <Shell title="Supplier list" companyId={companyId} csv={`/reports/suppliers?${f.qs}`} error={q.error} loading={!q.data} retry={() => q.refetch()}>
        {q.data ? (
          <>
            {q.data.byStatus ? <Counts items={q.data.byStatus.map((s) => ({ label: s.label, n: s.n }))} /> : null}
            <Table head={['Supplier', 'Category', 'Status', 'Products', 'Preferred for', 'Lead time', 'Finance']} empty={!q.data.rows.length}>
              {q.data.rows.map((s) => (
                <tr key={s.id}>
                  <td data-label="Supplier"><Link to={procurementPage(companyId, `/suppliers/${s.id}`)}><span className="mt-num">{s.number}</span> {s.name}</Link></td>
                  <td data-label="Category">{s.category}</td>
                  <td data-label="Status"><SupplierBadge value={s.status} /></td>
                  <td data-label="Products" className="num">{s.products}</td>
                  <td data-label="Preferred for" className="num">{s.preferred}</td>
                  <td data-label="Lead time">{s.leadTimeDays !== null ? `${s.leadTimeDays} days` : ''}</td>
                  <td data-label="Finance">{s.financeLinked ? 'Linked' : ''}</td>
                </tr>
              ))}
            </Table>
            <p className="muted small">Supplier performance: {q.data.performance} <Link to={reportPage(companyId, 'supplier-delivery')}>Supplier delivery performance</Link>.</p>
          </>
        ) : null}
      </Shell>
    </div>
  );
}

function Table({ head, empty, emptyText = 'Nothing matches.', children }: { head: string[]; empty: boolean; emptyText?: string; children: ReactNode }) {
  if (empty) return <p className="muted">{emptyText}</p>;
  return (
    <div className="crm-table-scroll">
      <table className="data-table responsive">
        <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
