// BIZOMAT ERP, Release 4 part A: Quality at /erp/c/<company>/quality: the hub (what waits for inspection, open
// nonconformances, corrective actions due and overdue), inspections (a list with search, filters, paging and CSV; each
// inspection a screen made for a phone to record readings and photos per characteristic and sample, with the result
// worked out on the server), nonconformance reports with containment, root cause, disposition and the actions that carry
// it out, corrective and preventive actions, and inspection plans with their versions and characteristics. The server
// decides what each person may do; the screens only show it.
import { useState, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiError, del, get, patch, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { Modal } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import {
  ACTIONS,
  CAPA_KINDS,
  CAPA_STATUS,
  DISPOSITIONS,
  INSPECTION_STATUS,
  NCR_STATUS,
  PLAN_KINDS,
  PLAN_STATUS,
  RESULTS,
  SEVERITIES,
  dateText,
  dayText,
  erpPath,
  inventoryPage,
  manufacturingPage,
  money,
  procurementPage,
  productsPage,
  qty,
  qualityPage,
  reportPage,
  useErpMe,
  useQualityOptions,
  type Capa,
  type ErpEvent,
  type ErpMe,
  type Inspection,
  type Ncr,
  type QcChar,
  type QcPlan,
  type QcReading,
  type RecordFile,
} from './api';
import { CsvLink, FilterPanel, History, Pager, Props, RecordUpload, Section, options, requestKey, useAct } from './common';
import { NoteDialog } from './Changes';
import { useListParams } from './Purchasing';

const tone = (map: Record<string, string>, v: string | null | undefined) => (v ? (map[v] ?? '') : '');
const RESULT_TONE: Record<string, string> = { passed: 'success', failed: 'danger', conditional: 'warning' };
const INSP_TONE: Record<string, string> = { open: 'accent', completed: '', cancelled: '' };
const NCR_TONE: Record<string, string> = { open: 'danger', contained: 'warning', investigating: 'warning', dispositioned: 'accent', capa: 'accent', verification: 'accent', closed: 'success', cancelled: '' };
const SEV_TONE: Record<string, string> = { minor: '', major: 'warning', critical: 'danger' };
const CAPA_TONE: Record<string, string> = { proposed: 'warning', approved: 'accent', in_progress: 'accent', done: 'accent', verified: 'success', closed: 'success', cancelled: '' };
const PLAN_TONE: Record<string, string> = { draft: '', released: 'success', superseded: '' };
const label = (map: Record<string, string>, v: string) => map[v] ?? v;

export const ResultBadge = ({ value }: { value: string | null }) => (value ? <span className={`badge ${tone(RESULT_TONE, value)}`}>{label(RESULTS, value)}</span> : null);
export const NcrBadge = ({ value }: { value: string }) => <span className={`badge ${tone(NCR_TONE, value)}`}>{label(NCR_STATUS, value)}</span>;
const SevBadge = ({ value }: { value: string }) => <span className={`badge ${tone(SEV_TONE, value)}`}>{label(SEVERITIES, value)}</span>;
const CapaBadge = ({ value }: { value: string }) => <span className={`badge ${tone(CAPA_TONE, value)}`}>{label(CAPA_STATUS, value)}</span>;
const PlanBadge = ({ value }: { value: string }) => <span className={`badge ${tone(PLAN_TONE, value)}`}>{label(PLAN_STATUS, value)}</span>;
const InspBadge = ({ i }: { i: Pick<Inspection, 'status' | 'result'> }) => (i.result ? <ResultBadge value={i.result} /> : <span className={`badge ${tone(INSP_TONE, i.status)}`}>{label(INSPECTION_STATUS, i.status)}</span>);

export function QualityArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const me = useErpMe(companyId);
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Quality" />
          <section className="co-prompt"><p>You do not have access to quality in {companyName}. People in the company have access; people who only share a tool with it do not.</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening Quality…" />;
  const m = me.data;
  const tab = (to: string, icon: Parameters<typeof Icon>[0]['name'], text: string, end = false) => (
    <NavLink to={qualityPage(companyId, to)} end={end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name={icon} size={14} /> {text}</NavLink>
  );
  return (
    <div className="page crm-page">
      <PageHeader title="Quality" subtitle={`Quality of ${m.company.name}: inspections from receipt to finished goods, nonconformances and corrective actions.`} />
      <nav className="tabs mt-tabs" aria-label="Quality sections">
        {tab('', 'home', 'Overview', true)}
        {tab('/inspections', 'checkSquare', 'Inspections')}
        {tab('/ncrs', 'alert', 'Nonconformances')}
        {tab('/capas', 'target', 'Corrective actions')}
        {tab('/plans', 'list', 'Inspection plans')}
      </nav>
      <Routes>
        <Route index element={<Overview companyId={companyId} me={m} />} />
        <Route path="inspections" element={<InspectionsPage companyId={companyId} me={m} />} />
        <Route path="inspections/:id" element={<InspectionDetail companyId={companyId} />} />
        <Route path="ncrs" element={<NcrsPage companyId={companyId} me={m} />} />
        <Route path="ncrs/:id" element={<NcrDetail companyId={companyId} />} />
        <Route path="capas" element={<CapasPage companyId={companyId} me={m} />} />
        <Route path="capas/:id" element={<CapaDetail companyId={companyId} />} />
        <Route path="plans" element={<PlansPage companyId={companyId} me={m} />} />
        <Route path="plans/:id" element={<PlanDetail companyId={companyId} />} />
        <Route path="*" element={<Navigate to={qualityPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

// ------------------------------------------------------------------ the hub

interface QueueItem {
  sourceType: 'receipt_line' | 'mo_operation' | 'fg_receipt';
  sourceId: string;
  kind: string;
  title: string;
  reference: string;
  link: { kind: 'receipt' | 'mo'; id: string };
  supplierName: string | null;
  quantity: number;
  uom: string;
  lot: string;
  date: string | null;
  note?: string;
  planAvailable: boolean;
}

interface CapaBrief {
  id: string;
  number: string;
  title: string;
  status: string;
  dueDate: string | null;
  responsibleName: string | null;
  overdue: boolean;
  ncrNumber: string | null;
}

interface OverviewView {
  counts: { toInspect: number; openInspections: number; failedLast30Days: number; completedLast30Days: number; openNcrs: number; ncrsToDisposition: number; ncrsToClose: number; openCapas: number; capasToApprove: number; overdueCapas: number; plansReleased: number; plansDraft: number };
  queue: QueueItem[];
  overdueCapas: CapaBrief[];
  myCapas: CapaBrief[];
  recentFailures: Inspection[];
  openNcrs: { id: string; number: string; title: string; status: string; severity: string; createdAt: number }[];
  myWorkNote: string;
  can: { inspect: boolean; raise: boolean; plan: boolean; propose: boolean; disposition: boolean };
}

/** Starts the inspection of a waiting record (the server returns the one already started, if any) and opens it. */
function useStartInspection(companyId: string) {
  const act = useAct(companyId);
  const navigate = useNavigate();
  return async (body: Record<string, unknown>) => {
    const r = (await act(() => post<{ id: string }>(erpPath(companyId, '/inspections'), { ...body, requestKey: requestKey() }), 'Inspection started')) as { id: string } | null;
    if (r) navigate(qualityPage(companyId, `/inspections/${r.id}`));
  };
}

function Overview({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Quality');
  const q = useQuery({ queryKey: ['erp', companyId, 'quality-overview'], queryFn: () => get<OverviewView>(erpPath(companyId, '/quality/overview')) });
  const start = useStartInspection(companyId);
  const [dialog, setDialog] = useState<null | 'inspection' | 'ncr' | 'capa' | 'plan'>(null);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const c = v.counts;
  const stat = (n: number, text: string, to: string, warn = false) => (
    <Link to={qualityPage(companyId, to)} className="card card-pad erp-stat">
      <strong className={warn && n ? 'erp-neg' : ''}>{n}</strong>
      <span className="muted small">{text}</span>
    </Link>
  );
  const link = (x: QueueItem) => (x.link.kind === 'receipt' ? procurementPage(companyId, `/receipts/${x.link.id}`) : manufacturingPage(companyId, `/orders/${x.link.id}`));
  const empty = !c.plansReleased && !c.plansDraft && !c.openInspections && !c.completedLast30Days && !c.openNcrs && !c.openCapas && !v.queue.length;
  return (
    <div className="stack">
      <div className="erp-stats">
        {stat(c.toInspect, 'Waiting for inspection', '')}
        {stat(c.openInspections, 'Inspections open', '/inspections?status=open')}
        {stat(c.failedLast30Days, 'Failed in the last 30 days', '/inspections?result=failed', true)}
        {stat(c.openNcrs, 'Nonconformances open', '/ncrs?status=open')}
        {stat(c.ncrsToDisposition, 'Waiting for a disposition', '/ncrs?status=open')}
        {stat(c.capasToApprove, 'Actions to approve', '/capas?status=proposed')}
        {stat(c.overdueCapas, 'Actions overdue', '/capas?overdue=1', true)}
      </div>
      <div className="row wrap">
        <div className="grow" />
        <Link className="btn" to={reportPage(companyId, 'inspection-results')}><Icon name="chart" /> Quality reports</Link>
        {v.can.plan ? <button className="btn" onClick={() => setDialog('plan')}><Icon name="list" /> New inspection plan</button> : null}
        {v.can.propose ? <button className="btn" onClick={() => setDialog('capa')}><Icon name="target" /> Propose an action</button> : null}
        {v.can.raise ? <button className="btn" onClick={() => setDialog('ncr')}><Icon name="alert" /> Raise a nonconformance</button> : null}
        {v.can.inspect ? <button className="btn primary" onClick={() => setDialog('inspection')}><Icon name="plus" /> New inspection</button> : null}
      </div>
      {empty ? (
        <section className="co-prompt">
          <p>
            <strong>Getting started.</strong> Write an inspection plan for a product or a supplier: what to measure, its limits and how many samples. Mark the products that need checking on arrival in Inventory (inspection required). Their goods receipts, the inspection points of manufacturing orders, and finished goods with a final plan then wait here. When an inspection fails, raise a nonconformance from it, decide what happens to the stock, and follow up with a corrective action.
          </p>
        </section>
      ) : null}
      <Section title="Waiting for inspection">
        {!v.queue.length ? (
          <p className="muted small">Nothing waits. Goods received for products marked “inspection required”, inspection points of operations in progress, and finished goods of products with a released final plan appear here.</p>
        ) : (
          <ul className="erp-list">
            {v.queue.map((x) => (
              <li key={`${x.sourceType}:${x.sourceId}`} className="card card-pad stack qc-queue-item">
                <div className="row wrap">
                  <strong className="grow">{x.title}</strong>
                  <span className="badge">{label(PLAN_KINDS, x.kind)}</span>
                  {x.planAvailable ? <span className="badge success">Plan ready</span> : <span className="badge warning">No plan: add checks by hand</span>}
                </div>
                <p className="small">
                  <Link to={link(x)}>{x.reference}</Link> · {qty(x.quantity)} {x.uom}
                  {x.lot ? ` · lot ${x.lot}` : ''}
                  {x.supplierName ? ` · ${x.supplierName}` : ''}
                  {x.date ? ` · ${dateText(x.date)}` : ''}
                </p>
                {x.note ? <p className="muted small">Check: {x.note}</p> : null}
                {v.can.inspect ? <div className="row"><button className="btn primary" onClick={() => void start({ sourceType: x.sourceType, sourceId: x.sourceId })}><Icon name="play" size={14} /> Start inspection</button></div> : null}
              </li>
            ))}
          </ul>
        )}
      </Section>
      <div className="qc-two">
        <Section title="Corrective actions overdue">
          {!v.overdueCapas.length ? <p className="muted small">None overdue.</p> : <CapaBriefs companyId={companyId} list={v.overdueCapas} />}
          <p className="muted small"><Icon name="info" size={14} /> {v.myWorkNote}</p>
        </Section>
        <Section title="Your corrective actions">
          {!v.myCapas.length ? <p className="muted small">No action is assigned to you.</p> : <CapaBriefs companyId={companyId} list={v.myCapas} />}
        </Section>
      </div>
      <div className="qc-two">
        <Section title="Open nonconformances">
          {!v.openNcrs.length ? <p className="muted small">None open.</p> : (
            <ul className="erp-list">{v.openNcrs.map((n) => <li key={n.id} className="small"><Link to={qualityPage(companyId, `/ncrs/${n.id}`)}><span className="mt-num">{n.number}</span> {n.title}</Link> <SevBadge value={n.severity} /> <NcrBadge value={n.status} /> <span className="muted">{dayText(n.createdAt)}</span></li>)}</ul>
          )}
        </Section>
        <Section title="Recent failed inspections">
          {!v.recentFailures.length ? <p className="muted small">No failed inspection.</p> : (
            <ul className="erp-list">{v.recentFailures.map((i) => <li key={i.id} className="small"><Link to={qualityPage(companyId, `/inspections/${i.id}`)}><span className="mt-num">{i.number}</span> {i.productNumber} {i.productName}</Link> <ResultBadge value={i.result} /> <span className="muted">{dayText(i.completedAt)}</span></li>)}</ul>
          )}
        </Section>
      </div>
      {dialog === 'inspection' ? <NewInspectionDialog companyId={companyId} onClose={() => setDialog(null)} /> : null}
      {dialog === 'ncr' ? <NewNcrDialog companyId={companyId} onClose={() => setDialog(null)} /> : null}
      {dialog === 'capa' ? <NewCapaDialog companyId={companyId} me={me} onClose={() => setDialog(null)} /> : null}
      {dialog === 'plan' ? <NewPlanDialog companyId={companyId} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

function CapaBriefs({ companyId, list }: { companyId: string; list: CapaBrief[] }) {
  return (
    <ul className="erp-list">
      {list.map((x) => (
        <li key={x.id} className="small">
          <Link to={qualityPage(companyId, `/capas/${x.id}`)}><span className="mt-num">{x.number}</span> {x.title}</Link> <CapaBadge value={x.status} />
          {x.overdue ? <span className="badge danger">Overdue</span> : null}
          <span className="muted"> {x.responsibleName ?? ''}{x.dueDate ? `, due ${dateText(x.dueDate)}` : ''}{x.ncrNumber ? `, ${x.ncrNumber}` : ''}</span>
        </li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------------ inspections

function InspectionsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Inspections');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'result', 'kind']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'inspections', filters.toString(), offset], queryFn: () => get<{ inspections: Inspection[]; total: number }>(erpPath(companyId, `/inspections?${filters}&limit=${limit}&offset=${offset}`)) });
  const [adding, setAdding] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/inspections?${filters}`} />
        {me.can['quality.inspect'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> New inspection</button> : null}
      </div>
      <FilterPanel active={['q', 'status', 'result', 'kind'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="qi-q">Search</label><input id="qi-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, product, supplier, lot or order" /></div>
        <div className="field"><label htmlFor="qi-s">Status</label><select id="qi-s" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Every status</option>{options(INSPECTION_STATUS)}</select></div>
        <div className="field"><label htmlFor="qi-r">Result</label><select id="qi-r" className="select" value={g('result')} onChange={(e) => set('result', e.target.value)}><option value="">Any result</option>{options(RESULTS)}</select></div>
        <div className="field"><label htmlFor="qi-k">Kind</label><select id="qi-k" className="select" value={g('kind')} onChange={(e) => set('kind', e.target.value)}><option value="">Every kind</option>{options(PLAN_KINDS)}</select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.inspections.length ? (
          <EmptyState icon="checkSquare" title={filters.toString() ? 'Nothing matches' : 'No inspections yet'}>
            {filters.toString() ? 'Change the filters to see more.' : 'Start one from the Overview, where goods receipts, inspection points and finished goods wait, or make one by hand.'}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Inspection</th><th>Result</th><th>Kind</th><th>From</th><th className="num">Quantity</th><th>Inspector</th><th>Date</th></tr></thead>
              <tbody>
                {list.data.inspections.map((i) => (
                  <tr key={i.id}>
                    <td data-label="Inspection"><Link className="mt-primary" to={qualityPage(companyId, `/inspections/${i.id}`)}><span className="mt-num">{i.number}</span> {i.productNumber ?? i.supplierName} {i.productName ?? ''}</Link>{i.lot ? <div className="muted small">Lot {i.lot}</div> : null}</td>
                    <td data-label="Result"><InspBadge i={i} /></td>
                    <td data-label="Kind">{i.kindLabel}</td>
                    <td data-label="From">{i.receiptNumber ?? (i.moNumber ? `${i.moNumber}${i.opNo ? ` op ${i.opNo}` : ''}` : i.sourceLabel)}</td>
                    <td data-label="Quantity" className="num">{i.quantity !== null ? `${qty(i.quantity)} ${i.uom}` : ''}</td>
                    <td data-label="Inspector">{i.inspectorName ?? ''}</td>
                    <td data-label="Date">{dayText(i.completedAt ?? i.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {adding ? <NewInspectionDialog companyId={companyId} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function NewInspectionDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const opts = useQualityOptions(companyId);
  const start = useStartInspection(companyId);
  const [f, setF] = useState({ source: 'manual', kind: 'product', productId: '', supplierId: '', planId: '', quantity: '', lot: '', serial: '', locationId: '' });
  const [busy, setBusy] = useState(false);
  const supplierKind = f.source === 'supplier';
  const plans = (opts.data?.plans ?? []).filter((p) => (supplierKind ? p.kind === 'supplier' && (!f.supplierId || p.supplierId === f.supplierId) : !f.productId || p.productId === f.productId));
  const ok = supplierKind ? !!f.supplierId : !!f.productId;
  const save = async () => {
    setBusy(true);
    await start({
      sourceType: f.source,
      kind: supplierKind ? 'supplier' : f.kind,
      productId: f.productId || null,
      supplierId: f.supplierId || null,
      planId: f.planId || undefined,
      quantity: f.quantity ? Number(f.quantity) : null,
      lot: f.lot || undefined,
      serial: f.serial || undefined,
      locationId: f.locationId || null,
    });
    setBusy(false);
  };
  return (
    <Modal title="New inspection" wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !ok} onClick={() => void save()}>{busy ? 'Starting…' : 'Start the inspection'}</button></>}>
      {!opts.data ? <Loading /> : (
        <div className="form-grid">
          <p className="muted small span-2">Goods receipts, inspection points and finished goods are inspected from the Overview, where they wait. Here: a first article, a product check, or a supplier inspection.</p>
          <div className="field"><label htmlFor="ni-s">What</label><select id="ni-s" className="select" value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })}><option value="manual">A product</option><option value="supplier">A supplier</option></select></div>
          {!supplierKind ? <div className="field"><label htmlFor="ni-k">Kind</label><select id="ni-k" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{Object.entries(PLAN_KINDS).filter(([k]) => k !== 'supplier').map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div> : <div />}
          <div className="field"><label htmlFor="ni-p">Product{supplierKind ? ' (optional)' : ''}</label><select id="ni-p" className="select" value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value, planId: '' })}><option value="">{supplierKind ? 'None' : 'Choose a product'}</option>{opts.data.products.map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}</option>)}</select></div>
          <div className="field"><label htmlFor="ni-sup">Supplier{supplierKind ? '' : ' (optional)'}</label><select id="ni-sup" className="select" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value, planId: '' })}><option value="">{supplierKind ? 'Choose a supplier' : 'None'}</option>{opts.data.suppliers.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div>
          <div className="field span-2"><label htmlFor="ni-pl">Plan</label><select id="ni-pl" className="select" value={f.planId} onChange={(e) => setF({ ...f, planId: e.target.value })}><option value="">The best released plan, if one applies</option>{plans.map((p) => <option key={p.id} value={p.id}>{p.label} {p.name} ({p.kindLabel})</option>)}</select></div>
          <div className="field"><label htmlFor="ni-q">Quantity inspected</label><input id="ni-q" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
          <div className="field"><label htmlFor="ni-l">Where it is</label><select id="ni-l" className="select" value={f.locationId} onChange={(e) => setF({ ...f, locationId: e.target.value })}><option value="">Not in stock, or not said</option>{opts.data.locations.map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select></div>
          <div className="field"><label htmlFor="ni-lot">Lot</label><input id="ni-lot" className="input" maxLength={80} value={f.lot} onChange={(e) => setF({ ...f, lot: e.target.value })} /></div>
          <div className="field"><label htmlFor="ni-ser">Serial</label><input id="ni-ser" className="input" maxLength={80} value={f.serial} onChange={(e) => setF({ ...f, serial: e.target.value })} /></div>
        </div>
      )}
    </Modal>
  );
}

interface InspChar extends QcChar {
  result: 'pass' | 'fail' | null;
  status: 'pass' | 'fail' | 'incomplete';
  readings: QcReading[];
  photos: RecordFile[];
}

interface InspectionView {
  inspection: Inspection;
  characteristics: InspChar[];
  summary: { needed: number; recorded: number; failing: number; missing: string[]; soFar: 'pass' | 'fail' | 'incomplete' };
  ncrs: { id: string; number: string; title: string; status: string }[];
  stock: { locationId: string; locationCode: string; quarantine: boolean; lot: string; serial: string; onHand: number; reserved: number; available: number }[];
  files: RecordFile[];
  history: ErpEvent[];
  can: { record: boolean; addCharacteristic: boolean; complete: boolean; cancel: boolean; quarantine: boolean; concession: boolean; release: boolean; raiseNcr: boolean };
}

type Entry = { value: string; conforming: boolean | null; note: string };
const entryKey = (charId: string, sample: number) => `${charId}:${sample}`;

/** One inspection: made for a phone. Each characteristic is a card with an input per sample. */
function InspectionDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'inspection', id], queryFn: () => get<InspectionView>(erpPath(companyId, `/inspections/${id}`)), retry: false });
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [dialog, setDialog] = useState<null | 'complete' | 'char' | 'quarantine' | 'concession' | 'release' | 'cancel'>(null);
  const [saving, setSaving] = useState(false);
  usePageTitle(q.data ? q.data.inspection.number : 'Inspection');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const i = v.inspection;
  const recorded = (ch: InspChar, n: number) => ch.readings.find((r) => r.sampleNo === n);
  const entry = (ch: InspChar, n: number): Entry => {
    const e = entries[entryKey(ch.id, n)];
    if (e) return e;
    const r = recorded(ch, n);
    return { value: r?.value !== null && r?.value !== undefined ? String(r.value) : '', conforming: r?.conforming ?? null, note: r?.note ?? '' };
  };
  const setEntry = (ch: InspChar, n: number, patchE: Partial<Entry>) => setEntries((prev) => ({ ...prev, [entryKey(ch.id, n)]: { ...entry(ch, n), ...patchE } }));
  const dirty = Object.keys(entries).length;
  const saveReadings = async () => {
    const readings = Object.entries(entries)
      .map(([k, e]) => {
        const [charId, sample] = k.split(':');
        const ch = v.characteristics.find((c) => c.id === charId)!;
        if (ch.measured) return e.value.trim() === '' ? null : { charId, sampleNo: Number(sample), value: Number(e.value), note: e.note || undefined };
        return e.conforming === null ? null : { charId, sampleNo: Number(sample), conforming: e.conforming, note: e.note || undefined };
      })
      .filter((x): x is NonNullable<typeof x> => !!x);
    if (!readings.length) return;
    setSaving(true);
    const ok = await act(() => put(erpPath(companyId, `/inspections/${i.id}/readings`), { readings }), 'Readings saved');
    setSaving(false);
    if (ok) setEntries({});
  };
  const raiseNcr = async () => {
    const r = (await act(
      () => post<{ id: string }>(erpPath(companyId, '/ncrs'), { title: `${i.productNumber ?? i.supplierName ?? 'Inspection'}: failed ${i.kindLabel.toLowerCase()} inspection`, description: `${i.number} failed: ${v.characteristics.filter((c) => c.status === 'fail').map((c) => c.name).join(', ')} outside the limits or not conforming.`, severity: 'major', inspectionIds: [i.id], requestKey: requestKey() }),
      'Nonconformance raised',
    )) as { id: string } | null;
    if (r) navigate(qualityPage(companyId, `/ncrs/${r.id}`));
  };
  const close = () => setDialog(null);
  return (
    <div className="stack qc-inspection">
      <div className="mt-path"><Link to={qualityPage(companyId, '/inspections')}>Inspections</Link><span className="sep">/</span><span>{i.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{i.number}</span> {i.productNumber ? `${i.productNumber} ${i.productName}` : i.supplierName}</h2>
          <div className="mt-badges">
            <InspBadge i={i} />
            <span className="badge">{i.kindLabel}</span>
            {i.status === 'open' ? <span className={`badge ${v.summary.soFar === 'fail' ? 'danger' : v.summary.soFar === 'pass' ? 'success' : ''}`}>{v.summary.recorded} of {v.summary.needed} readings{v.summary.failing ? `, ${v.summary.failing} failing` : ''}</span> : null}
            {i.quarantinedQty - i.releasedQty > 0 ? <span className="badge warning">{qty(i.quarantinedQty - i.releasedQty)} in quarantine</span> : null}
          </div>
        </div>
        <div className="mt-head-actions">
          {v.can.raiseNcr && !v.ncrs.length ? <button className="btn primary" onClick={() => void raiseNcr()}><Icon name="alert" /> Raise a nonconformance</button> : null}
          {v.can.quarantine ? <button className="btn" onClick={() => setDialog('quarantine')}>Put into quarantine</button> : null}
          {v.can.concession ? <button className="btn" onClick={() => setDialog('concession')}>Accept on condition</button> : null}
          {v.can.release ? <button className="btn" onClick={() => setDialog('release')}>Release from quarantine</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setDialog('cancel')}>Cancel</button> : null}
        </div>
      </div>
      <Section title="Inspection">
        <Props
          items={[
            ['From', i.receiptNumber ? <Link to={procurementPage(companyId, `/receipts/${i.receiptId}`)}>Goods receipt {i.receiptNumber}</Link> : i.moNumber ? <Link to={manufacturingPage(companyId, `/orders/${i.moId}`)}>{i.moNumber}{i.opNo ? ` operation ${i.opNo} ${i.opName ?? ''}` : ''}{i.fgNumber ? `, finished goods ${i.fgNumber}` : ''}</Link> : i.sourceLabel],
            ['Product', i.productId ? <Link to={productsPage(companyId, `/${i.productId}`)}>{i.productNumber} {i.productName}</Link> : ''],
            ['Supplier', i.supplierId ? <Link to={procurementPage(companyId, `/suppliers/${i.supplierId}`)}>{i.supplierName}</Link> : ''],
            ['Quantity', i.quantity !== null ? `${qty(i.quantity)} ${i.uom}` : ''],
            ['Lot', i.lot],
            ['Serial', i.serial],
            ['Where it was', i.locationCode ?? ''],
            ['Plan', i.planLabel || 'None: characteristics added by hand'],
            ['Inspector', i.inspectorName ? `${i.inspectorName}${i.completedAt ? `, ${new Date(i.completedAt).toLocaleString('en-AU')}` : ''}` : ''],
            ['Notes', i.notes],
            ['Accepted on condition', i.concessionNote ? `${i.concessionNote} (${i.concessionByName ?? 'a quality manager'})` : ''],
            ['Cancelled', i.cancelReason],
          ]}
        />
      </Section>
      <Section title="Characteristics" actions={v.can.addCharacteristic ? <button className="btn sm" onClick={() => setDialog('char')}><Icon name="plus" size={14} /> Add a check</button> : null}>
        {!v.characteristics.length ? <p className="muted small">No characteristics yet. {v.can.addCharacteristic ? 'Add what to check, with its limits.' : ''}</p> : (
          <ol className="erp-list qc-chars">
            {v.characteristics.map((ch) => (
              <li key={ch.id} className={`card card-pad stack qc-char qc-${ch.status}`}>
                <div className="row wrap">
                  <strong className="grow">{ch.name}</strong>
                  <span className={`badge ${ch.status === 'fail' ? 'danger' : ch.status === 'pass' ? 'success' : ''}`}>{ch.status === 'fail' ? 'Fail' : ch.status === 'pass' ? 'Pass' : 'To record'}</span>
                </div>
                <p className="small"><span className="qc-limits">{ch.limits}</span> · {ch.sampleSize} sample{ch.sampleSize === 1 ? '' : 's'}{ch.photoRequired ? ' · photo needed' : ''}</p>
                {ch.instructions ? <p className="muted small">{ch.instructions}</p> : null}
                <div className="qc-samples">
                  {Array.from({ length: ch.sampleSize }, (_, k) => k + 1).map((n) => {
                    const r = recorded(ch, n);
                    const e = entry(ch, n);
                    const edited = !!entries[entryKey(ch.id, n)];
                    return (
                      <div key={n} className={`qc-sample${r && !edited ? (r.ok ? ' qc-ok' : ' qc-out') : ''}`}>
                        <span className="small qc-sample-no">Sample {n}</span>
                        {ch.measured ? (
                          <label className="qc-reading">
                            <span className="sr-only">{ch.name}, sample {n}{ch.unit ? ` (${ch.unit})` : ''}</span>
                            <input className="input erp-scan-input" type="number" step="any" inputMode="decimal" disabled={!v.can.record} value={e.value} onChange={(x) => setEntry(ch, n, { value: x.target.value })} />
                            {ch.unit ? <span className="muted small">{ch.unit}</span> : null}
                          </label>
                        ) : (
                          <div className="qc-choice" role="group" aria-label={`${ch.name}, sample ${n}`}>
                            <button type="button" className={`btn${e.conforming === true ? ' primary' : ''}`} aria-pressed={e.conforming === true} disabled={!v.can.record} onClick={() => setEntry(ch, n, { conforming: true })}>Conforms</button>
                            <button type="button" className={`btn${e.conforming === false ? ' danger' : ''}`} aria-pressed={e.conforming === false} disabled={!v.can.record} onClick={() => setEntry(ch, n, { conforming: false })}>Does not</button>
                          </div>
                        )}
                        {r && !edited ? <span className={`small ${r.ok ? 'qc-ok-text' : 'erp-neg'}`}>{r.ok ? 'Within the limits' : ch.measured ? 'Outside the limits' : 'Not conforming'}{r.byName ? ` · ${r.byName}` : ''}</span> : edited ? <span className="small muted">Not saved</span> : null}
                      </div>
                    );
                  })}
                </div>
                {ch.photos.length ? <ul className="erp-list qc-photos">{ch.photos.map((f) => <li key={f.id}><a href={f.url} target="_blank" rel="noreferrer"><img src={f.url} alt={`Photo of ${ch.name}`} loading="lazy" /></a></li>)}</ul> : null}
                {v.can.record ? <RecordUpload companyId={companyId} kind="inspection_char" id={ch.id} onDone={() => void q.refetch()} label={ch.photoRequired ? 'Add the photo' : 'Add a photo'} accept="image/*" big /> : null}
              </li>
            ))}
          </ol>
        )}
        {v.can.record && v.characteristics.length ? (
          <div className="qc-save-bar">
            <button className="btn erp-big" disabled={!dirty || saving} onClick={() => void saveReadings()}>{saving ? 'Saving…' : dirty ? `Save ${dirty} reading${dirty === 1 ? '' : 's'}` : 'Readings saved'}</button>
            <button className="btn primary erp-big" disabled={!!dirty} title={dirty ? 'Save the readings first' : undefined} onClick={() => setDialog('complete')}><Icon name="check" /> Complete</button>
          </div>
        ) : null}
        <p className="muted small"><Icon name="info" size={14} /> Each reading is compared with its limits on the server when it is saved; the result is worked out from them.</p>
      </Section>
      {v.ncrs.length ? (
        <Section title="Nonconformances">
          <ul className="erp-list">{v.ncrs.map((n) => <li key={n.id} className="small"><Link to={qualityPage(companyId, `/ncrs/${n.id}`)}><span className="mt-num">{n.number}</span> {n.title}</Link> <NcrBadge value={n.status} /></li>)}</ul>
        </Section>
      ) : null}
      {i.productId ? (
        <Section title="Where it is in stock">
          {!v.stock.length ? <p className="muted small">None in stock{i.lot ? ` for lot ${i.lot}` : ''}.</p> : (
            <ul className="erp-list">{v.stock.map((s) => <li key={`${s.locationId}:${s.lot}:${s.serial}`} className="small"><Link to={inventoryPage(companyId, `/stock/${i.productId}`)}>{s.locationCode}</Link> {s.quarantine ? <span className="badge warning">Quarantine</span> : null} {qty(s.onHand)} {i.uom}{s.reserved ? `, ${qty(s.reserved)} reserved` : ''}{s.lot ? `, lot ${s.lot}` : ''}{s.serial ? `, serial ${s.serial}` : ''}</li>)}</ul>
          )}
        </Section>
      ) : null}
      <Section title="Files" actions={v.can.record ? <RecordUpload companyId={companyId} kind="inspection" id={i.id} onDone={() => void q.refetch()} /> : null}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a> <span className="muted">{dayText(f.createdAt)}</span></li>)}</ul> : <p className="muted small">No files.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {dialog === 'complete' ? <CompleteDialog companyId={companyId} view={v} onClose={close} /> : null}
      {dialog === 'char' ? <CharDialog title={`Add a check to ${i.number}`} onClose={close} onSave={async (body) => { if (await act(() => post(erpPath(companyId, `/inspections/${i.id}/characteristics`), body), 'Check added')) close(); }} /> : null}
      {dialog === 'quarantine' ? <MoveDialog companyId={companyId} title="Put into quarantine" mode="quarantine" stock={v.stock} defaultFrom={i.locationId} defaultQty={i.quantity} uom={i.uom} onClose={close} onSave={async (m) => { if (await act(() => post(erpPath(companyId, `/inspections/${i.id}/quarantine`), { fromLocationId: m.fromLocationId, toLocationId: m.toLocationId, quantity: m.quantity, requestKey: m.key }), 'Put into quarantine')) close(); }} /> : null}
      {dialog === 'release' ? <MoveDialog companyId={companyId} title="Release from quarantine" mode="release" stock={v.stock} defaultQty={i.quarantinedQty - i.releasedQty} uom={i.uom} onClose={close} onSave={async (m) => { if (await act(() => post(erpPath(companyId, `/inspections/${i.id}/release`), { fromLocationId: m.fromLocationId, toLocationId: m.toLocationId, quantity: m.quantity, requestKey: m.key }), 'Released')) close(); }} /> : null}
      {dialog === 'concession' ? <NoteDialog title={`Accept ${i.number} on condition`} label="Why is the lot accepted, and on what condition?" confirm="Accept on condition" required onClose={close} onSave={async (note) => { if (await act(() => post(erpPath(companyId, `/inspections/${i.id}/concession`), { note }), 'Accepted on condition')) close(); }} /> : null}
      {dialog === 'cancel' ? <NoteDialog title={`Cancel ${i.number}`} label="Why is it cancelled?" confirm="Cancel the inspection" required danger onClose={close} onSave={async (reason) => { if (await act(() => post(erpPath(companyId, `/inspections/${i.id}/cancel`), { reason }), 'Inspection cancelled')) close(); }} /> : null}
    </div>
  );
}

function CompleteDialog({ companyId, view, onClose }: { companyId: string; view: InspectionView; onClose: () => void }) {
  const act = useAct(companyId);
  const i = view.inspection;
  const opts = useQualityOptions(companyId);
  const failing = view.summary.soFar === 'fail';
  const [notes, setNotes] = useState('');
  const [quarantine, setQuarantine] = useState(failing && !!i.productId);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState(i.locationId ?? '');
  const [amount, setAmount] = useState(i.quantity !== null ? String(i.quantity) : '');
  const [busy, setBusy] = useState(false);
  const quarantines = (opts.data?.locations ?? []).filter((l) => l.quarantine);
  const save = async () => {
    setBusy(true);
    const ok = await act(() => post(erpPath(companyId, `/inspections/${i.id}/complete`), { notes: notes || undefined, quarantine: failing && quarantine ? { toLocationId: to, fromLocationId: from || undefined, quantity: Number(amount) || undefined } : undefined }), failing ? 'Completed: failed' : 'Completed: passed');
    setBusy(false);
    if (ok) onClose();
  };
  return (
    <Modal title={`Complete ${i.number}`} onClose={onClose} footer={<><button className="btn erp-big" onClick={onClose}>Back</button><button className={`btn erp-big ${failing ? 'danger' : 'primary'}`} disabled={busy || !!view.summary.missing.length || (failing && quarantine && (!to || !from))} onClick={() => void save()}>{busy ? 'Saving…' : failing ? 'Complete as failed' : 'Complete as passed'}</button></>}>
      <div className="stack">
        {view.summary.missing.length ? <div className="warn-box small"><strong>Not finished:</strong><ul>{view.summary.missing.map((m) => <li key={m}>{m}</li>)}</ul></div> : <p className={failing ? 'erp-neg' : 'qc-ok-text'}><strong>{failing ? `Fails: ${view.characteristics.filter((c) => c.status === 'fail').map((c) => c.name).join(', ')}` : 'Every reading is within its limits'}</strong></p>}
        <div className="field"><label htmlFor="qc-notes">Notes (optional)</label><textarea id="qc-notes" className="textarea" rows={2} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        {failing && i.productId ? (
          <fieldset className="erp-checks">
            <label className="row"><input type="checkbox" checked={quarantine} onChange={(e) => setQuarantine(e.target.checked)} /> Put the lot into quarantine now</label>
            {quarantine ? (
              <>
                <div className="field"><label htmlFor="qc-from">From</label><select id="qc-from" className="select" value={from} onChange={(e) => setFrom(e.target.value)}><option value="">Choose where it is</option>{view.stock.filter((s) => !s.quarantine).map((s) => <option key={`${s.locationId}:${s.lot}:${s.serial}`} value={s.locationId}>{s.locationCode} ({qty(s.available)} free)</option>)}</select></div>
                <div className="field"><label htmlFor="qc-to">Into</label><select id="qc-to" className="select" value={to} onChange={(e) => setTo(e.target.value)}><option value="">Choose a quarantine location</option>{quarantines.map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select>{opts.data && !quarantines.length ? <span className="muted small">No quarantine location yet: add one in Inventory, Warehouses.</span> : null}</div>
                <div className="field"><label htmlFor="qc-qty">Quantity ({i.uom})</label><input id="qc-qty" className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
              </>
            ) : null}
          </fieldset>
        ) : null}
      </div>
    </Modal>
  );
}

type CharBody = { name: string; kind: string; unit?: string; nominal?: number | null; tolerance?: number | null; min?: number | null; max?: number | null; sampleSize: number; photoRequired: boolean; instructions?: string };

function CharDialog({ title, initial, onClose, onSave }: { title: string; initial?: QcChar; onClose: () => void; onSave: (body: CharBody) => Promise<void> }) {
  const num = (x: number | null | undefined) => (x === null || x === undefined ? '' : String(x));
  const [f, setF] = useState({ name: initial?.name ?? '', kind: initial?.kind ?? 'dimension', unit: initial?.unit ?? 'mm', nominal: num(initial?.nominal), tolerance: num(initial?.tolerance), min: num(initial?.min), max: num(initial?.max), sampleSize: String(initial?.sampleSize ?? 1), photoRequired: initial?.photoRequired ?? false, instructions: initial?.instructions ?? '' });
  const [busy, setBusy] = useState(false);
  const measured = f.kind === 'dimension' || f.kind === 'measured';
  const n = (x: string) => (x.trim() === '' ? null : Number(x));
  const save = async () => {
    setBusy(true);
    try {
      await onSave({ name: f.name, kind: f.kind, unit: measured ? f.unit : undefined, nominal: measured ? n(f.nominal) : null, tolerance: measured ? n(f.tolerance) : null, min: measured ? n(f.min) : null, max: measured ? n(f.max) : null, sampleSize: Math.max(1, Math.round(Number(f.sampleSize) || 1)), photoRequired: f.photoRequired, instructions: f.instructions });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={title} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.name.trim()} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="qc-cn">What to check</label><input id="qc-cn" className="input" maxLength={200} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="field"><label htmlFor="qc-ck">Type</label><select id="qc-ck" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}><option value="dimension">Dimension</option><option value="measured">Measured value</option><option value="attribute">Attribute (pass or fail)</option><option value="visual">Visual</option></select></div>
        {measured ? (
          <>
            <div className="field"><label htmlFor="qc-cu">Unit</label><input id="qc-cu" className="input" maxLength={20} value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} /></div>
            <div className="field"><label htmlFor="qc-cnom">Nominal</label><input id="qc-cnom" className="input" type="number" step="any" inputMode="decimal" value={f.nominal} onChange={(e) => setF({ ...f, nominal: e.target.value })} /></div>
            <div className="field"><label htmlFor="qc-ctol">Tolerance (plus or minus)</label><input id="qc-ctol" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.tolerance} onChange={(e) => setF({ ...f, tolerance: e.target.value })} /></div>
            <div className="field"><label htmlFor="qc-cmin">Minimum</label><input id="qc-cmin" className="input" type="number" step="any" inputMode="decimal" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} /></div>
            <div className="field"><label htmlFor="qc-cmax">Maximum</label><input id="qc-cmax" className="input" type="number" step="any" inputMode="decimal" value={f.max} onChange={(e) => setF({ ...f, max: e.target.value })} /></div>
            <p className="muted small span-2">Give a minimum, a maximum, or a nominal value with a tolerance. A minimum or maximum given is used instead of the tolerance on that side.</p>
          </>
        ) : null}
        <div className="field"><label htmlFor="qc-cs">Samples</label><input id="qc-cs" className="input" type="number" min="1" max="200" step="1" inputMode="numeric" value={f.sampleSize} onChange={(e) => setF({ ...f, sampleSize: e.target.value })} /></div>
        <label className="row"><input type="checkbox" checked={f.photoRequired} onChange={(e) => setF({ ...f, photoRequired: e.target.checked })} /> A photo is needed</label>
        <div className="field span-2"><label htmlFor="qc-ci">How to check (optional)</label><input id="qc-ci" className="input" maxLength={1000} value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

type StockRow = InspectionView['stock'][number];

/** Moves stock into or out of quarantine: from where it is, to a location of the right kind, a quantity, once per key. */
function MoveDialog({ companyId, title, mode, stock, defaultFrom, defaultQty, uom, onClose, onSave, extra, before, after }: { companyId: string; title: string; mode: 'quarantine' | 'release' | 'out'; stock: StockRow[]; defaultFrom?: string | null; defaultQty?: number | null; uom: string; onClose: () => void; onSave: (m: { fromLocationId: string; toLocationId: string; quantity: number; key: string }) => Promise<void>; extra?: string; before?: ReactNode; after?: ReactNode }) {
  const opts = useQualityOptions(companyId);
  const sources = stock.filter((s) => (mode === 'quarantine' ? !s.quarantine : mode === 'release' ? s.quarantine : true));
  const [from, setFrom] = useState(defaultFrom && sources.some((s) => s.locationId === defaultFrom) ? defaultFrom : (sources[0]?.locationId ?? ''));
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(defaultQty ? String(defaultQty) : '');
  const [key] = useState(requestKey);
  const [busy, setBusy] = useState(false);
  const targets = (opts.data?.locations ?? []).filter((l) => (mode === 'quarantine' ? l.quarantine : !l.quarantine));
  const save = async () => {
    setBusy(true);
    try {
      await onSave({ fromLocationId: from, toLocationId: to, quantity: Number(amount), key });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn erp-big" onClick={onClose}>Back</button><button className="btn primary erp-big" disabled={busy || !from || (mode !== 'out' && !to) || !(Number(amount) > 0)} onClick={() => void save()}>{busy ? 'Saving…' : title}</button></>}>
      <div className="stack">
        {before}
        {extra ? <p className="small">{extra}</p> : null}
        <div className="field"><label htmlFor="mv-from">From</label><select id="mv-from" className="select" value={from} onChange={(e) => setFrom(e.target.value)}><option value="">Choose where it is</option>{sources.map((s) => <option key={`${s.locationId}:${s.lot}:${s.serial}`} value={s.locationId}>{s.locationCode}: {qty(s.onHand)} {uom}{s.reserved ? ` (${qty(s.reserved)} reserved)` : ''}</option>)}</select>{!sources.length ? <span className="muted small">{mode === 'release' ? 'Nothing of it is in quarantine.' : 'None of it is in stock.'}</span> : null}</div>
        {mode !== 'out' ? <div className="field"><label htmlFor="mv-to">To</label><select id="mv-to" className="select" value={to} onChange={(e) => setTo(e.target.value)}><option value="">{mode === 'quarantine' ? 'Choose a quarantine location' : 'Choose a location'}</option>{targets.map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select>{opts.data && mode === 'quarantine' && !targets.length ? <span className="muted small">No quarantine location yet: add one in Inventory, Warehouses.</span> : null}</div> : null}
        <div className="field"><label htmlFor="mv-q">Quantity ({uom})</label><input id="mv-q" className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        {after}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ nonconformances

function NcrsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Nonconformances');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'severity', 'sort']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'ncrs', filters.toString(), offset], queryFn: () => get<{ ncrs: Ncr[]; total: number }>(erpPath(companyId, `/ncrs?${filters}&limit=${limit}&offset=${offset}`)) });
  const [adding, setAdding] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/ncrs?${filters}`} />
        {me.can['quality.raise'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> Raise a nonconformance</button> : null}
      </div>
      <FilterPanel active={['q', 'status', 'severity'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="nc-q">Search</label><input id="nc-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, title, product, supplier or lot" /></div>
        <div className="field"><label htmlFor="nc-s">Status</label><select id="nc-s" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Every status</option><option value="open">Open (not closed or cancelled)</option>{options(NCR_STATUS)}</select></div>
        <div className="field"><label htmlFor="nc-v">Severity</label><select id="nc-v" className="select" value={g('severity')} onChange={(e) => set('severity', e.target.value)}><option value="">Any</option>{options(SEVERITIES)}</select></div>
        <div className="field"><label htmlFor="nc-o">Sort by</label><select id="nc-o" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Newest</option><option value="age">Oldest</option><option value="severity">Severity</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.ncrs.length ? (
          <EmptyState icon="alert" title={filters.toString() ? 'Nothing matches' : 'No nonconformances yet'}>
            {filters.toString() ? 'Change the filters to see more.' : 'Raise one from a failed inspection, or by hand for anything that does not conform: a product, a lot, a supplier’s delivery or a process.'}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>NCR</th><th>Status</th><th>Severity</th><th>Product</th><th className="num">Quantity</th><th>Supplier</th><th className="num">Age</th></tr></thead>
              <tbody>
                {list.data.ncrs.map((n) => (
                  <tr key={n.id}>
                    <td data-label="NCR"><Link className="mt-primary" to={qualityPage(companyId, `/ncrs/${n.id}`)}><span className="mt-num">{n.number}</span> {n.title}</Link></td>
                    <td data-label="Status"><NcrBadge value={n.status} /></td>
                    <td data-label="Severity"><SevBadge value={n.severity} /></td>
                    <td data-label="Product">{n.productNumber ?? n.process}{n.lot ? <div className="muted small">Lot {n.lot}</div> : null}</td>
                    <td data-label="Quantity" className="num">{n.quantity !== null ? `${qty(n.quantity)} ${n.uom}` : ''}</td>
                    <td data-label="Supplier">{n.supplierName ?? ''}</td>
                    <td data-label="Age" className="num">{n.ageDays} d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(x) => set('offset', x ? String(x) : '')} /> : null}
      {adding ? <NewNcrDialog companyId={companyId} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function NewNcrDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const opts = useQualityOptions(companyId);
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [f, setF] = useState({ title: '', description: '', severity: 'major', productId: '', lot: '', serial: '', quantity: '', supplierId: '', assetId: '', process: '', locationId: '' });
  const [key] = useState(requestKey);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const r = (await act(
      () => post<{ id: string }>(erpPath(companyId, '/ncrs'), { title: f.title, description: f.description, severity: f.severity, productId: f.productId || null, lot: f.lot, serial: f.serial, quantity: f.quantity ? Number(f.quantity) : null, supplierId: f.supplierId || null, assetId: f.assetId || null, process: f.process, locationId: f.locationId || null, requestKey: key }),
      'Nonconformance raised',
    )) as { id: string } | null;
    setBusy(false);
    if (r) navigate(qualityPage(companyId, `/ncrs/${r.id}`));
  };
  return (
    <Modal title="Raise a nonconformance" wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.title.trim() || !f.description.trim()} onClick={() => void save()}>{busy ? 'Saving…' : 'Raise it'}</button></>}>
      {!opts.data ? <Loading /> : (
        <div className="form-grid">
          <div className="field span-2"><label htmlFor="nn-t">Title</label><input id="nn-t" className="input" maxLength={200} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div className="field span-2"><label htmlFor="nn-d">What is wrong</label><textarea id="nn-d" className="textarea" rows={3} maxLength={4000} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
          <div className="field"><label htmlFor="nn-s">Severity</label><select id="nn-s" className="select" value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}>{options(SEVERITIES)}</select></div>
          <div className="field"><label htmlFor="nn-p">Product</label><select id="nn-p" className="select" value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value })}><option value="">None</option>{opts.data.products.map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}</option>)}</select></div>
          <div className="field"><label htmlFor="nn-q">Quantity affected</label><input id="nn-q" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
          <div className="field"><label htmlFor="nn-lot">Lot</label><input id="nn-lot" className="input" maxLength={80} value={f.lot} onChange={(e) => setF({ ...f, lot: e.target.value })} /></div>
          <div className="field"><label htmlFor="nn-ser">Serial</label><input id="nn-ser" className="input" maxLength={80} value={f.serial} onChange={(e) => setF({ ...f, serial: e.target.value })} /></div>
          <div className="field"><label htmlFor="nn-l">Where it is</label><select id="nn-l" className="select" value={f.locationId} onChange={(e) => setF({ ...f, locationId: e.target.value })}><option value="">Not in stock, or not said</option>{opts.data.locations.map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select></div>
          <div className="field"><label htmlFor="nn-sup">Supplier</label><select id="nn-sup" className="select" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value })}><option value="">None</option>{opts.data.suppliers.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div>
          <div className="field"><label htmlFor="nn-a">Asset (Maintenance)</label><select id="nn-a" className="select" value={f.assetId} onChange={(e) => setF({ ...f, assetId: e.target.value })}><option value="">None</option>{opts.data.assets.map((x) => <option key={x.id} value={x.id}>{x.number} {x.name}</option>)}</select></div>
          <div className="field"><label htmlFor="nn-pr">Process</label><input id="nn-pr" className="input" maxLength={200} value={f.process} onChange={(e) => setF({ ...f, process: e.target.value })} placeholder="For example: welding, packing" /></div>
        </div>
      )}
    </Modal>
  );
}

interface NcrView {
  ncr: Ncr;
  inspections: Inspection[];
  dispositions: { id: string; kind: string; kindLabel: string; quantity: number; doneQty: number; remaining: number; note: string; actions: string[] }[];
  actions: { id: string; action: string; actionLabel: string; dispositionKind: string; quantity: number; from: string | null; to: string | null; lot: string; serial: string; valueCents: number; note: string; byName: string | null; createdAt: number }[];
  capas: Capa[];
  stock: StockRow[];
  files: RecordFile[];
  history: ErpEvent[];
  ready: { dispositionsDone: boolean; capasSettled: boolean };
  can: { edit: boolean; contain: boolean; investigate: boolean; disposition: boolean; act: boolean; raiseCapa: boolean; toVerification: boolean; close: boolean; cancel: boolean; attach: boolean };
}

type NcrDialogKind = null | 'contain' | 'investigate' | 'disposition' | 'capa' | 'close' | 'cancel' | 'edit' | { action: NcrView['dispositions'][number] };

function NcrDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'ncr', id], queryFn: () => get<NcrView>(erpPath(companyId, `/ncrs/${id}`)), retry: false });
  const me = useErpMe(companyId);
  const act = useAct(companyId);
  const [dialog, setDialog] = useState<NcrDialogKind>(null);
  usePageTitle(q.data ? q.data.ncr.number : 'Nonconformance');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data || !me.data) return <Loading />;
  const v = q.data;
  const n = v.ncr;
  const close = () => setDialog(null);
  const steps = ['open', 'contained', 'investigating', 'dispositioned', 'capa', 'verification', 'closed'];
  const at = steps.indexOf(n.status);
  return (
    <div className="stack">
      <div className="mt-path"><Link to={qualityPage(companyId, '/ncrs')}>Nonconformances</Link><span className="sep">/</span><span>{n.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{n.number}</span> {n.title}</h2>
          <div className="mt-badges"><NcrBadge value={n.status} /><SevBadge value={n.severity} /><span className="badge">{n.ageDays} day{n.ageDays === 1 ? '' : 's'} old</span></div>
        </div>
        <div className="mt-head-actions">
          {v.can.toVerification ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/ncrs/${n.id}/to-verification`), {}), 'Ready for verification')}>Ready for verification</button> : null}
          {v.can.close ? <button className="btn primary" onClick={() => setDialog('close')}><Icon name="check" /> Verify and close</button> : null}
          {v.can.edit ? <button className="btn" onClick={() => setDialog('edit')}><Icon name="edit" /> Edit</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setDialog('cancel')}>Cancel</button> : null}
        </div>
      </div>
      {n.status !== 'cancelled' ? (
        <ol className="qc-steps" aria-label="Progress">
          {['Raised', 'Contained', 'Investigated', 'Dispositioned', 'Corrective action', 'Verification', 'Closed'].map((s, k) => <li key={s} className={k < at ? 'done' : k === at ? 'current' : ''} aria-current={k === at ? 'step' : undefined}>{s}</li>)}
        </ol>
      ) : null}
      <Section title="Nonconformance">
        <Props
          items={[
            ['What is wrong', n.description],
            ['Product', n.productId ? <Link to={productsPage(companyId, `/${n.productId}`)}>{n.productNumber} {n.productName}</Link> : ''],
            ['Quantity affected', n.quantity !== null ? `${qty(n.quantity)} ${n.uom}` : ''],
            ['Lot', n.lot ? <Link to={inventoryPage(companyId, `/trace?productId=${n.productId ?? ''}&lot=${encodeURIComponent(n.lot)}`)}>{n.lot}</Link> : ''],
            ['Serial', n.serial],
            ['Where it is', n.locationCode ? `${n.locationCode}${n.locationIsQuarantine ? ' (quarantine)' : ''}` : ''],
            ['Supplier', n.supplierId ? <Link to={procurementPage(companyId, `/suppliers/${n.supplierId}`)}>{n.supplierName}</Link> : ''],
            ['Goods receipt', n.receiptId ? <Link to={procurementPage(companyId, `/receipts/${n.receiptId}`)}>{n.receiptNumber}</Link> : ''],
            ['Manufacturing order', n.moId ? <Link to={manufacturingPage(companyId, `/orders/${n.moId}`)}>{n.moNumber}</Link> : ''],
            ['Asset', n.assetId ? `${n.assetNumber} ${n.assetName}` : ''],
            ['Process', n.process],
            ['Raised', `${dayText(n.createdAt)}${n.raisedByName ? ` by ${n.raisedByName}` : ''}`],
            ['Cancelled', n.cancelReason],
          ]}
        />
        {v.inspections.length ? <p className="small">From {v.inspections.map((i) => <Link key={i.id} to={qualityPage(companyId, `/inspections/${i.id}`)} className="qc-inline"><span className="mt-num">{i.number}</span> <ResultBadge value={i.result} /></Link>)}</p> : null}
      </Section>
      <Section title="Containment" actions={v.can.contain ? <button className="btn sm" onClick={() => setDialog('contain')}>{n.containment ? 'Update' : 'Record containment'}</button> : null}>
        {n.containment ? <p className="small">{n.containment} <span className="muted">{n.containedByName ? `(${n.containedByName})` : ''}</span></p> : <p className="muted small">Not recorded yet. Say what was done to stop the problem spreading, and put stock into quarantine if needed.</p>}
      </Section>
      <Section title="Root cause" actions={v.can.investigate ? <button className="btn sm" onClick={() => setDialog('investigate')}>{n.rootCause ? 'Update' : 'Record the root cause'}</button> : null}>
        {n.rootCause ? (
          <>
            {n.whys.length ? <ol className="qc-whys small">{n.whys.map((w, k) => <li key={k}><span className="muted">Why {k + 1}:</span> {w}</li>)}</ol> : null}
            <p className="small"><strong>Root cause:</strong> {n.rootCause} <span className="muted">{n.investigatedByName ? `(${n.investigatedByName})` : ''}</span></p>
          </>
        ) : <p className="muted small">Not found yet. Use five whys, or write it in your own words.</p>}
      </Section>
      <Section title="Disposition" actions={v.can.disposition ? <button className="btn sm primary" onClick={() => setDialog('disposition')}>Decide the disposition</button> : null}>
        {!v.dispositions.length ? <p className="muted small">Not decided yet. A quality manager decides how much is used as is, reworked, repaired, scrapped, returned to the supplier or regraded.</p> : (
          <>
            {n.dispositionNote ? <p className="small">{n.dispositionNote}</p> : null}
            <ul className="erp-list">
              {v.dispositions.map((d) => (
                <li key={d.id} className="card card-pad stack">
                  <div className="row wrap">
                    <strong className="grow">{d.kindLabel}: {qty(d.quantity)} {n.uom}</strong>
                    <span className={`badge ${d.remaining > 0 ? 'warning' : 'success'}`}>{d.remaining > 0 ? `${qty(d.remaining)} to do` : 'Done'}</span>
                  </div>
                  {d.note ? <p className="muted small">{d.note}</p> : null}
                  {v.can.act && (d.remaining > 0 || d.actions.includes('rework_note')) ? <div className="row"><button className="btn sm" onClick={() => setDialog({ action: d })}>Carry it out</button></div> : null}
                </li>
              ))}
            </ul>
            <p className="muted small">Decided {dayText(n.dispositionedAt)}{n.dispositionedByName ? ` by ${n.dispositionedByName}` : ''}.</p>
          </>
        )}
        {v.actions.length ? (
          <>
            <h3 className="erp-h3">Done</h3>
            <ul className="erp-list">{v.actions.map((x) => <li key={x.id} className="small">{x.actionLabel}{x.quantity ? `: ${qty(x.quantity)} ${n.uom}` : ''}{x.from ? ` from ${x.from}` : ''}{x.to ? ` to ${x.to}` : ''}{x.valueCents ? `, ${money(Math.abs(x.valueCents))} of stock` : ''}{x.note ? `. ${x.note}` : ''} <span className="muted">{dayText(x.createdAt)}{x.byName ? ` by ${x.byName}` : ''}</span></li>)}</ul>
          </>
        ) : null}
      </Section>
      <Section title="Corrective and preventive actions" actions={v.can.raiseCapa ? <button className="btn sm" onClick={() => setDialog('capa')}><Icon name="plus" size={14} /> Propose an action</button> : null}>
        {!v.capas.length ? <p className="muted small">None yet. Propose one to stop it happening again.</p> : (
          <ul className="erp-list">{v.capas.map((x) => <li key={x.id} className="small"><Link to={qualityPage(companyId, `/capas/${x.id}`)}><span className="mt-num">{x.number}</span> {x.title}</Link> <CapaBadge value={x.status} />{x.overdue ? <span className="badge danger">Overdue</span> : null} <span className="muted">{x.responsibleName ?? ''}{x.dueDate ? `, due ${dateText(x.dueDate)}` : ''}</span></li>)}</ul>
        )}
      </Section>
      <Section title="Verification">
        {n.status === 'closed' ? <p className="small">{n.verificationNote} <span className="muted">Verified and closed {dayText(n.closedAt)}{n.closedByName ? ` by ${n.closedByName}` : ''}.</span></p> : (
          <p className="muted small">
            {!v.dispositions.length ? 'After the disposition.' : !v.ready.dispositionsDone ? 'Carry out the disposition first.' : !v.ready.capasSettled ? 'Its corrective actions are verified first.' : n.status === 'verification' ? 'Ready: a quality manager records how the fix was verified and closes it.' : 'Ready for verification.'}
          </p>
        )}
      </Section>
      {n.productId ? (
        <Section title="Where it is in stock">
          {!v.stock.length ? <p className="muted small">None in stock{n.lot ? ` for lot ${n.lot}` : ''}.</p> : <ul className="erp-list">{v.stock.map((s) => <li key={`${s.locationId}:${s.lot}:${s.serial}`} className="small">{s.locationCode} {s.quarantine ? <span className="badge warning">Quarantine</span> : null} {qty(s.onHand)} {n.uom}{s.reserved ? `, ${qty(s.reserved)} reserved` : ''}</li>)}</ul>}
        </Section>
      ) : null}
      <Section title="Files" actions={v.can.attach ? <RecordUpload companyId={companyId} kind="ncr" id={n.id} onDone={() => void q.refetch()} /> : null}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a> <span className="muted">{dayText(f.createdAt)}</span></li>)}</ul> : <p className="muted small">No files.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {dialog === 'contain' ? <ContainDialog companyId={companyId} view={v} onClose={close} /> : null}
      {dialog === 'investigate' ? <InvestigateDialog companyId={companyId} ncr={n} onClose={close} /> : null}
      {dialog === 'disposition' ? <DispositionDialog companyId={companyId} ncr={n} onClose={close} /> : null}
      {dialog === 'capa' ? <NewCapaDialog companyId={companyId} me={me.data} ncr={n} onClose={close} /> : null}
      {dialog === 'edit' ? <EditNcrDialog companyId={companyId} ncr={n} onClose={close} /> : null}
      {dialog === 'close' ? <NoteDialog title={`Verify and close ${n.number}`} label="How was the fix verified?" confirm="Close the nonconformance" required onClose={close} onSave={async (note) => { if (await act(() => post(erpPath(companyId, `/ncrs/${n.id}/close`), { verificationNote: note }), 'Verified and closed')) close(); }} /> : null}
      {dialog === 'cancel' ? <NoteDialog title={`Cancel ${n.number}`} label="Why is it cancelled?" confirm="Cancel it" required danger onClose={close} onSave={async (reason) => { if (await act(() => post(erpPath(companyId, `/ncrs/${n.id}/cancel`), { reason }), 'Cancelled')) close(); }} /> : null}
      {dialog && typeof dialog === 'object' ? <ActionDialog companyId={companyId} view={v} disposition={dialog.action} onClose={close} /> : null}
    </div>
  );
}

function ContainDialog({ companyId, view, onClose }: { companyId: string; view: NcrView; onClose: () => void }) {
  const n = view.ncr;
  const act = useAct(companyId);
  const opts = useQualityOptions(companyId);
  const [text, setText] = useState(n.containment);
  const [hold, setHold] = useState(false);
  const free = view.stock.filter((s) => !s.quarantine);
  const [from, setFrom] = useState(n.locationId && free.some((s) => s.locationId === n.locationId) ? n.locationId : (free[0]?.locationId ?? ''));
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(n.quantity !== null ? String(n.quantity) : '');
  const [key] = useState(requestKey);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const ok = await act(() => post(erpPath(companyId, `/ncrs/${n.id}/contain`), { containment: text, quarantine: hold ? { fromLocationId: from, toLocationId: to, quantity: Number(amount) } : undefined, requestKey: key }), 'Containment recorded');
    setBusy(false);
    if (ok) onClose();
  };
  return (
    <Modal title={`Contain ${n.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={busy || !text.trim() || (hold && (!from || !to || !(Number(amount) > 0)))} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="ct-t">What was done to contain it</label><textarea id="ct-t" className="textarea" rows={3} maxLength={4000} value={text} onChange={(e) => setText(e.target.value)} /></div>
        {n.productId && free.length ? (
          <fieldset className="erp-checks">
            <label className="row"><input type="checkbox" checked={hold} onChange={(e) => setHold(e.target.checked)} /> Put stock into quarantine</label>
            {hold ? (
              <>
                <div className="field"><label htmlFor="ct-f">From</label><select id="ct-f" className="select" value={from} onChange={(e) => setFrom(e.target.value)}>{free.map((s) => <option key={`${s.locationId}:${s.lot}`} value={s.locationId}>{s.locationCode}: {qty(s.available)} free</option>)}</select></div>
                <div className="field"><label htmlFor="ct-to">Into</label><select id="ct-to" className="select" value={to} onChange={(e) => setTo(e.target.value)}><option value="">Choose a quarantine location</option>{(opts.data?.locations ?? []).filter((l) => l.quarantine).map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select></div>
                <div className="field"><label htmlFor="ct-q">Quantity ({n.uom})</label><input id="ct-q" className="input" type="number" min="0" step="any" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
              </>
            ) : null}
          </fieldset>
        ) : null}
      </div>
    </Modal>
  );
}

function InvestigateDialog({ companyId, ncr, onClose }: { companyId: string; ncr: Ncr; onClose: () => void }) {
  const act = useAct(companyId);
  const [method, setMethod] = useState(ncr.rootCauseMethod || 'five_whys');
  const [whys, setWhys] = useState<string[]>([0, 1, 2, 3, 4].map((k) => ncr.whys[k] ?? ''));
  const [root, setRoot] = useState(ncr.rootCause);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const ok = await act(() => post(erpPath(companyId, `/ncrs/${ncr.id}/investigate`), { method, whys: method === 'five_whys' ? whys.map((w) => w.trim()).filter(Boolean) : undefined, rootCause: root || undefined }), 'Root cause recorded');
    setBusy(false);
    if (ok) onClose();
  };
  return (
    <Modal title={`Root cause of ${ncr.number}`} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={busy || (method === 'five_whys' ? !whys[0].trim() : !root.trim())} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="stack">
        <div className="row wrap erp-modes" role="group" aria-label="Method">
          <button type="button" className={`btn${method === 'five_whys' ? ' primary' : ''}`} aria-pressed={method === 'five_whys'} onClick={() => setMethod('five_whys')}>Five whys</button>
          <button type="button" className={`btn${method === 'free_text' ? ' primary' : ''}`} aria-pressed={method === 'free_text'} onClick={() => setMethod('free_text')}>Free text</button>
        </div>
        {method === 'five_whys' ? whys.map((w, k) => <div key={k} className="field"><label htmlFor={`why-${k}`}>Why {k + 1}{k === 0 ? `: why did it happen?` : ''}</label><input id={`why-${k}`} className="input" maxLength={1000} value={w} onChange={(e) => setWhys(whys.map((x, j) => (j === k ? e.target.value : x)))} /></div>) : null}
        <div className="field"><label htmlFor="rc-r">Root cause{method === 'five_whys' ? ' (empty: the last why)' : ''}</label><textarea id="rc-r" className="textarea" rows={2} maxLength={4000} value={root} onChange={(e) => setRoot(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function DispositionDialog({ companyId, ncr, onClose }: { companyId: string; ncr: Ncr; onClose: () => void }) {
  const act = useAct(companyId);
  const [lines, setLines] = useState<Record<string, string>>({});
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const chosen = Object.entries(lines).filter(([, v]) => Number(v) > 0);
  const total = chosen.reduce((s, [, v]) => s + Number(v), 0);
  const over = ncr.quantity !== null && total > ncr.quantity + 1e-9;
  const save = async () => {
    setBusy(true);
    const ok = await act(() => post(erpPath(companyId, `/ncrs/${ncr.id}/disposition`), { lines: chosen.map(([kind, v]) => ({ kind, quantity: Number(v) })), note: note || undefined }), 'Disposition decided');
    setBusy(false);
    if (ok) onClose();
  };
  return (
    <Modal title={`Disposition of ${ncr.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={busy || !chosen.length || over} onClick={() => void save()}>{busy ? 'Saving…' : 'Decide'}</button></>}>
      <div className="stack">
        <p className="small">How much of the {ncr.quantity !== null ? `${qty(ncr.quantity)} ${ncr.uom}` : 'quantity'} affected goes each way. It is decided once; each part is then carried out.</p>
        {Object.entries(DISPOSITIONS).map(([k, l]) => (
          <div key={k} className="field qc-disp-line">
            <label htmlFor={`dp-${k}`}>{l}{k === 'return_to_supplier' && !ncr.supplierId ? ' (name the supplier first)' : ''}</label>
            <input id={`dp-${k}`} className="input erp-qty-input" type="number" min="0" step="any" inputMode="decimal" disabled={k === 'return_to_supplier' && !ncr.supplierId} value={lines[k] ?? ''} onChange={(e) => setLines({ ...lines, [k]: e.target.value })} />
          </div>
        ))}
        {over ? <p className="erp-neg small">That is more than the quantity affected.</p> : null}
        <div className="field"><label htmlFor="dp-n">Note (optional)</label><textarea id="dp-n" className="textarea" rows={2} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function ActionDialog({ companyId, view, disposition, onClose }: { companyId: string; view: NcrView; disposition: NcrView['dispositions'][number]; onClose: () => void }) {
  const act = useAct(companyId);
  const n = view.ncr;
  const [action, setAction] = useState(disposition.actions.find((a) => a !== 'rework_note' || disposition.remaining <= 0) ?? disposition.actions[0]);
  const [note, setNote] = useState('');
  const save = async (m: { fromLocationId?: string; toLocationId?: string; quantity?: number; key: string }) => {
    if (await act(() => post(erpPath(companyId, `/ncrs/${n.id}/actions`), { dispositionId: disposition.id, action, quantity: m.quantity, fromLocationId: m.fromLocationId, toLocationId: m.toLocationId, note: note || undefined, requestKey: m.key }), `${label(ACTIONS, action)}: done`)) onClose();
  };
  const picker = disposition.actions.length > 1 ? (
    <div className="row wrap erp-modes" role="group" aria-label="Action">
      {disposition.actions.map((a) => <button key={a} type="button" className={`btn${a === action ? ' primary' : ''}`} aria-pressed={a === action} onClick={() => setAction(a)}>{label(ACTIONS, a)}</button>)}
    </div>
  ) : null;
  const noteField = <div className="field"><label htmlFor="ac-n">{action === 'rework_note' ? 'What is to be reworked or repaired, and how' : 'Note (optional)'}</label><textarea id="ac-n" className="textarea" rows={2} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} /></div>;
  if (action === 'scrap' || action === 'supplier_return' || action === 'release') {
    return (
      <MoveDialog
        key={action}
        companyId={companyId}
        title={label(ACTIONS, action)}
        mode={action === 'release' ? 'release' : 'out'}
        stock={view.stock}
        defaultFrom={n.locationId}
        defaultQty={disposition.remaining}
        uom={n.uom}
        extra={`${disposition.kindLabel}: ${qty(disposition.remaining)} ${n.uom} left to carry out.${action === 'supplier_return' && n.supplierName ? ` Back to ${n.supplierName}.` : ''}`}
        before={picker}
        after={noteField}
        onClose={onClose}
        onSave={(m) => save(m)}
      />
    );
  }
  return <SimpleActionDialog title={`${disposition.kindLabel}: ${label(ACTIONS, action)}`} picker={picker} noteField={noteField} needsQty={action === 'done'} needsNote={action === 'rework_note'} note={note} remaining={disposition.remaining} uom={n.uom} onClose={onClose} onSave={(quantity) => save({ quantity, key: requestKey() })} />;
}

function SimpleActionDialog({ title, picker, noteField, needsQty, needsNote, note, remaining, uom, onClose, onSave }: { title: string; picker: ReactNode; noteField: ReactNode; needsQty: boolean; needsNote: boolean; note: string; remaining: number; uom: string; onClose: () => void; onSave: (quantity: number | undefined) => Promise<void> }) {
  const [amount, setAmount] = useState(remaining > 0 ? String(remaining) : '');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await onSave(amount ? Number(amount) : undefined);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn erp-big" onClick={onClose}>Back</button><button className="btn primary erp-big" disabled={busy || (needsQty && !(Number(amount) > 0)) || (needsNote && !note.trim())} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="stack">
        {picker}
        <div className="field"><label htmlFor="sa-q">Quantity ({uom}){needsQty ? '' : ' (optional)'}</label><input id="sa-q" className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        {noteField}
      </div>
    </Modal>
  );
}

function EditNcrDialog({ companyId, ncr, onClose }: { companyId: string; ncr: Ncr; onClose: () => void }) {
  const act = useAct(companyId);
  const opts = useQualityOptions(companyId);
  const [f, setF] = useState({ title: ncr.title, description: ncr.description, severity: ncr.severity, quantity: ncr.quantity !== null ? String(ncr.quantity) : '', assetId: ncr.assetId ?? '', process: ncr.process });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const ok = await act(() => patch(erpPath(companyId, `/ncrs/${ncr.id}`), { title: f.title, description: f.description, severity: f.severity, quantity: f.quantity ? Number(f.quantity) : null, assetId: f.assetId || null, process: f.process }), 'Saved');
    setBusy(false);
    if (ok) onClose();
  };
  return (
    <Modal title={`Edit ${ncr.number}`} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.title.trim() || !f.description.trim()} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="en-t">Title</label><input id="en-t" className="input" maxLength={200} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="en-d">What is wrong</label><textarea id="en-d" className="textarea" rows={3} maxLength={4000} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="field"><label htmlFor="en-s">Severity</label><select id="en-s" className="select" value={f.severity} onChange={(e) => setF({ ...f, severity: e.target.value })}>{options(SEVERITIES)}</select></div>
        <div className="field"><label htmlFor="en-q">Quantity affected</label><input id="en-q" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
        <div className="field"><label htmlFor="en-a">Asset (Maintenance)</label><select id="en-a" className="select" value={f.assetId} onChange={(e) => setF({ ...f, assetId: e.target.value })}><option value="">None</option>{(opts.data?.assets ?? []).map((x) => <option key={x.id} value={x.id}>{x.number} {x.name}</option>)}</select></div>
        <div className="field"><label htmlFor="en-p">Process</label><input id="en-p" className="input" maxLength={200} value={f.process} onChange={(e) => setF({ ...f, process: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ corrective and preventive actions

function CapasPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Corrective actions');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'kind', 'overdue', 'mine']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'capas', filters.toString(), offset], queryFn: () => get<{ capas: Capa[]; total: number }>(erpPath(companyId, `/capas?${filters}&limit=${limit}&offset=${offset}`)) });
  const [adding, setAdding] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/capas?${filters}`} />
        {me.can['capa.propose'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> Propose an action</button> : null}
      </div>
      <FilterPanel active={['q', 'status', 'kind', 'overdue', 'mine'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="ca-q">Search</label><input id="ca-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, title or NCR" /></div>
        <div className="field"><label htmlFor="ca-s">Status</label><select id="ca-s" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Every status</option><option value="open">Not closed</option>{options(CAPA_STATUS)}</select></div>
        <div className="field"><label htmlFor="ca-k">Kind</label><select id="ca-k" className="select" value={g('kind')} onChange={(e) => set('kind', e.target.value)}><option value="">Both</option>{options(CAPA_KINDS)}</select></div>
        <label className="row"><input type="checkbox" checked={g('overdue') === '1'} onChange={(e) => set('overdue', e.target.checked ? '1' : '')} /> Overdue only</label>
        <label className="row"><input type="checkbox" checked={g('mine') === '1'} onChange={(e) => set('mine', e.target.checked ? '1' : '')} /> Mine</label>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.capas.length ? (
          <EmptyState icon="target" title={filters.toString() ? 'Nothing matches' : 'No corrective or preventive actions yet'}>
            {filters.toString() ? 'Change the filters to see more.' : 'Propose one from a nonconformance, or on its own to prevent a problem before it happens.'}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Action</th><th>Status</th><th>Kind</th><th>Responsible</th><th>Due</th><th>NCR</th></tr></thead>
              <tbody>
                {list.data.capas.map((x) => (
                  <tr key={x.id}>
                    <td data-label="Action"><Link className="mt-primary" to={qualityPage(companyId, `/capas/${x.id}`)}><span className="mt-num">{x.number}</span> {x.title}</Link></td>
                    <td data-label="Status"><CapaBadge value={x.status} /> {x.overdue ? <span className="badge danger">{x.daysOverdue} d overdue</span> : null}</td>
                    <td data-label="Kind">{x.kindLabel}</td>
                    <td data-label="Responsible">{x.responsibleName ?? ''}</td>
                    <td data-label="Due">{dateText(x.dueDate)}</td>
                    <td data-label="NCR">{x.ncrId ? <Link to={qualityPage(companyId, `/ncrs/${x.ncrId}`)}>{x.ncrNumber}</Link> : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(x) => set('offset', x ? String(x) : '')} /> : null}
      {adding ? <NewCapaDialog companyId={companyId} me={me} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function NewCapaDialog({ companyId, me, ncr, onClose }: { companyId: string; me: ErpMe; ncr?: Ncr; onClose: () => void }) {
  const opts = useQualityOptions(companyId);
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [f, setF] = useState({ kind: 'corrective', title: '', description: '', responsibleId: me.user.id, dueDate: '' });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const r = (await act(() => post<Capa>(erpPath(companyId, '/capas'), { kind: f.kind, title: f.title, description: f.description, ncrId: ncr?.id ?? null, responsibleId: f.responsibleId, dueDate: f.dueDate || null }), 'Action proposed')) as Capa | null;
    setBusy(false);
    if (r) navigate(qualityPage(companyId, `/capas/${r.id}`));
  };
  return (
    <Modal title={ncr ? `Propose an action for ${ncr.number}` : 'Propose an action'} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.title.trim() || !f.responsibleId} onClick={() => void save()}>{busy ? 'Saving…' : 'Propose'}</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="nc-k">Kind</label><select id="nc-k" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}><option value="corrective">Corrective: fix the cause</option><option value="preventive">Preventive: stop it before it happens</option></select></div>
        <div className="field"><label htmlFor="nc-due">Due</label><input id="nc-due" className="input" type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="nc-ti">Action</label><input id="nc-ti" className="input" maxLength={200} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="nc-de">Details (optional)</label><textarea id="nc-de" className="textarea" rows={3} maxLength={4000} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="nc-r">Responsible</label><select id="nc-r" className="select" value={f.responsibleId} onChange={(e) => setF({ ...f, responsibleId: e.target.value })}>{(opts.data?.people ?? [{ id: me.user.id, name: me.user.name }]).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <p className="muted small span-2">A quality manager who neither proposed it nor is to carry it out approves it.</p>
      </div>
    </Modal>
  );
}

interface CapaView {
  capa: Capa;
  files: RecordFile[];
  history: ErpEvent[];
  can: { edit: boolean; approve: boolean; start: boolean; done: boolean; verify: boolean; close: boolean; cancel: boolean; attach: boolean };
}

function CapaDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'capa', id], queryFn: () => get<CapaView>(erpPath(companyId, `/capas/${id}`)), retry: false });
  const act = useAct(companyId);
  const [dialog, setDialog] = useState<null | 'approve' | 'done' | 'verify' | 'close' | 'cancel'>(null);
  usePageTitle(q.data ? q.data.capa.number : 'Corrective action');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const x = v.capa;
  const close = () => setDialog(null);
  const path = (s: string) => erpPath(companyId, `/capas/${x.id}/${s}`);
  return (
    <div className="stack">
      <div className="mt-path"><Link to={qualityPage(companyId, '/capas')}>Corrective actions</Link><span className="sep">/</span><span>{x.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{x.number}</span> {x.title}</h2>
          <div className="mt-badges"><CapaBadge value={x.status} /><span className="badge">{x.kindLabel}</span>{x.overdue ? <span className="badge danger">{x.daysOverdue} day{x.daysOverdue === 1 ? '' : 's'} overdue</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          {v.can.approve ? <button className="btn primary" onClick={() => setDialog('approve')}>Approve</button> : null}
          {v.can.start ? <button className="btn" onClick={() => void act(() => post(path('start'), {}), 'Started')}><Icon name="play" /> Start</button> : null}
          {v.can.done ? <button className="btn primary" onClick={() => setDialog('done')}><Icon name="check" /> Done</button> : null}
          {v.can.verify ? <button className="btn primary" onClick={() => setDialog('verify')}>Check effectiveness</button> : null}
          {v.can.close ? <button className="btn primary" onClick={() => setDialog('close')}>Close</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setDialog('cancel')}>Cancel</button> : null}
        </div>
      </div>
      <Section title="Action">
        <Props
          items={[
            ['Details', x.description],
            ['Nonconformance', x.ncrId ? <Link to={qualityPage(companyId, `/ncrs/${x.ncrId}`)}>{x.ncrNumber}</Link> : ''],
            ['Responsible', x.responsibleName ?? ''],
            ['Due', dateText(x.dueDate)],
            ['Proposed', `${dayText(x.createdAt)}${x.createdByName ? ` by ${x.createdByName}` : ''}`],
            ['Approved', x.approvedAt ? `${dayText(x.approvedAt)} by ${x.approvedByName ?? 'someone'}${x.approvalNote ? `: ${x.approvalNote}` : ''}${x.approvalSodException ? ' (one-person company: the segregation-of-duties exception is recorded)' : ''}` : ''],
            ['Done', x.doneAt ? `${dayText(x.doneAt)} by ${x.doneByName ?? 'someone'}: ${x.doneNote}` : ''],
            ['Effectiveness', x.verifiedAt ? `${x.effective ? 'Effective' : 'Not effective'}: ${x.verificationNote} (${x.verifiedByName ?? 'a quality manager'}, ${dayText(x.verifiedAt)})` : ''],
            ['Closed', x.closedAt ? `${dayText(x.closedAt)} by ${x.closedByName ?? 'someone'}${x.closureNote ? `: ${x.closureNote}` : ''}${x.closureSodException ? ' (one-person company: the segregation-of-duties exception is recorded)' : ''}` : ''],
            ['Cancelled', x.cancelReason],
          ]}
        />
      </Section>
      <Section title="Evidence" actions={v.can.attach ? <RecordUpload companyId={companyId} kind="capa" id={x.id} onDone={() => void q.refetch()} label="Add evidence" /> : null}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a> <span className="muted">{dayText(f.createdAt)}{f.uploadedByName ? ` by ${f.uploadedByName}` : ''}</span></li>)}</ul> : <p className="muted small">No evidence yet: photos, records or documents that show the action was carried out.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {dialog === 'approve' ? <NoteDialog title={`Approve ${x.number}`} label="Note (optional)" confirm="Approve" onClose={close} onSave={async (note) => { if (await act(() => post(path('approve'), { note: note || undefined }), 'Approved')) close(); }} /> : null}
      {dialog === 'done' ? <NoteDialog title={`${x.number} done`} label="What was done?" confirm="Mark done" required onClose={close} onSave={async (note) => { if (await act(() => post(path('done'), { note }), 'Done')) close(); }} /> : null}
      {dialog === 'verify' ? <VerifyDialog onClose={close} onSave={async (effective, note) => { if (await act(() => post(path('verify'), { effective, note }), effective ? 'Verified effective' : 'Back in progress')) close(); }} /> : null}
      {dialog === 'close' ? <NoteDialog title={`Close ${x.number}`} label="Note (optional)" confirm="Close" onClose={close} onSave={async (note) => { if (await act(() => post(path('close'), { note: note || undefined }), 'Closed')) close(); }} /> : null}
      {dialog === 'cancel' ? <NoteDialog title={`Cancel ${x.number}`} label="Why is it cancelled?" confirm="Cancel the action" required danger onClose={close} onSave={async (reason) => { if (await act(() => post(path('cancel'), { reason }), 'Cancelled')) close(); }} /> : null}
    </div>
  );
}

function VerifyDialog({ onClose, onSave }: { onClose: () => void; onSave: (effective: boolean, note: string) => Promise<void> }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async (effective: boolean) => {
    setBusy(true);
    try {
      await onSave(effective, note.trim());
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title="Check effectiveness" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn danger" disabled={busy || !note.trim()} onClick={() => void save(false)}>Not effective</button><button className="btn primary" disabled={busy || !note.trim()} onClick={() => void save(true)}>Effective</button></>}>
      <div className="field"><label htmlFor="vf-n">How was it checked?</label><textarea id="vf-n" className="textarea" rows={3} maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
      <p className="muted small">Not effective sends it back to in progress.</p>
    </Modal>
  );
}

// ------------------------------------------------------------------ inspection plans

function PlansPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Inspection plans');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'kind']) if (g(k)) filters.set(k, g(k));
  filters.set('status', g('status') || 'current');
  const list = useQuery({ queryKey: ['erp', companyId, 'qc-plans', filters.toString(), offset], queryFn: () => get<{ plans: QcPlan[]; total: number }>(erpPath(companyId, `/qc-plans?${filters}&limit=${limit}&offset=${offset}`)) });
  const [adding, setAdding] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/qc-plans?${filters}`} />
        {me.can['quality.plan'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> New inspection plan</button> : null}
      </div>
      <FilterPanel active={['q', 'kind'].filter((k) => g(k)).length + (g('status') && g('status') !== 'current' ? 1 : 0)}>
        <div className="field"><label htmlFor="pl-q">Search</label><input id="pl-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, name, product or supplier" /></div>
        <div className="field"><label htmlFor="pl-s">Versions</label><select id="pl-s" className="select" value={g('status') || 'current'} onChange={(e) => set('status', e.target.value)}><option value="current">Drafts and released</option>{options(PLAN_STATUS)}</select></div>
        <div className="field"><label htmlFor="pl-k">Kind</label><select id="pl-k" className="select" value={g('kind')} onChange={(e) => set('kind', e.target.value)}><option value="">Every kind</option>{options(PLAN_KINDS)}</select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.plans.length ? (
          <EmptyState icon="list" title="No inspection plans">A plan says what to check for a kind of inspection: each characteristic with its limits, how many samples and whether a photo is needed. Released plans are used for inspections.</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Plan</th><th>Status</th><th>Kind</th><th>Applies to</th><th className="num">Checks</th></tr></thead>
              <tbody>
                {list.data.plans.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Plan"><Link className="mt-primary" to={qualityPage(companyId, `/plans/${p.id}`)}><span className="mt-num">{p.label}</span> {p.name}</Link></td>
                    <td data-label="Status"><PlanBadge value={p.status} /></td>
                    <td data-label="Kind">{p.kindLabel}</td>
                    <td data-label="Applies to">{p.appliesTo}</td>
                    <td data-label="Checks" className="num">{p.characteristics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(x) => set('offset', x ? String(x) : '')} /> : null}
      {adding ? <NewPlanDialog companyId={companyId} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function NewPlanDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const opts = useQualityOptions(companyId);
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', kind: 'incoming', productId: '', supplierId: '', routingId: '', opNo: '', description: '' });
  const [busy, setBusy] = useState(false);
  const routings = (opts.data?.routings ?? []).filter((r) => r.productId === f.productId);
  const ops = routings.find((r) => r.id === f.routingId)?.operations ?? [];
  const opKind = f.kind === 'in_process' || f.kind === 'first_article';
  const ok = f.name.trim() && (f.kind === 'supplier' ? f.supplierId : f.productId);
  const save = async () => {
    setBusy(true);
    const r = (await act(() => post<QcPlan>(erpPath(companyId, '/qc-plans'), { name: f.name, kind: f.kind, productId: f.productId || null, supplierId: f.supplierId || null, routingId: opKind && f.routingId ? f.routingId : null, opNo: opKind && f.opNo ? Number(f.opNo) : null, description: f.description }), 'Plan drafted')) as QcPlan | null;
    setBusy(false);
    if (r) navigate(qualityPage(companyId, `/plans/${r.id}`));
  };
  return (
    <Modal title="New inspection plan" wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !ok} onClick={() => void save()}>{busy ? 'Saving…' : 'Draft the plan'}</button></>}>
      {!opts.data ? <Loading /> : (
        <div className="form-grid">
          <div className="field span-2"><label htmlFor="np-n">Name</label><input id="np-n" className="input" maxLength={200} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="field"><label htmlFor="np-k">Kind</label><select id="np-k" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{options(PLAN_KINDS)}</select></div>
          <div className="field"><label htmlFor="np-p">Product{f.kind === 'supplier' ? ' (optional)' : ''}</label><select id="np-p" className="select" value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value, routingId: '', opNo: '' })}><option value="">{f.kind === 'supplier' ? 'Any' : 'Choose a product'}</option>{opts.data.products.map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}</option>)}</select></div>
          <div className="field"><label htmlFor="np-s">Supplier{f.kind === 'supplier' ? '' : ' (optional)'}</label><select id="np-s" className="select" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value })}><option value="">{f.kind === 'supplier' ? 'Choose a supplier' : 'Any'}</option>{opts.data.suppliers.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div>
          {opKind ? (
            <>
              <div className="field"><label htmlFor="np-r">Routing (optional)</label><select id="np-r" className="select" value={f.routingId} onChange={(e) => setF({ ...f, routingId: e.target.value, opNo: '' })}><option value="">Any routing</option>{routings.map((r) => <option key={r.id} value={r.id}>Revision {r.revision} ({r.status})</option>)}</select></div>
              <div className="field"><label htmlFor="np-o">Operation (optional)</label>{ops.length ? <select id="np-o" className="select" value={f.opNo} onChange={(e) => setF({ ...f, opNo: e.target.value })}><option value="">Any operation</option>{ops.map((o) => <option key={o.opNo} value={o.opNo}>{o.opNo} {o.name}</option>)}</select> : <input id="np-o" className="input" type="number" min="1" step="1" inputMode="numeric" value={f.opNo} onChange={(e) => setF({ ...f, opNo: e.target.value })} />}</div>
            </>
          ) : null}
          <div className="field span-2"><label htmlFor="np-d">Description (optional)</label><textarea id="np-d" className="textarea" rows={2} maxLength={4000} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
          <p className="muted small span-2">Add the characteristics to check on the next screen. A quality manager releases the plan.</p>
        </div>
      )}
    </Modal>
  );
}

interface PlanView {
  plan: QcPlan;
  characteristics: QcChar[];
  versions: QcPlan[];
  inspections: number;
  files: RecordFile[];
  history: ErpEvent[];
  can: { edit: boolean; release: boolean; copy: boolean; remove: boolean };
}

function PlanDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'qc-plan', id], queryFn: () => get<PlanView>(erpPath(companyId, `/qc-plans/${id}`)), retry: false });
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<null | 'add' | 'release' | 'remove' | { edit: QcChar }>(null);
  usePageTitle(q.data ? q.data.plan.label : 'Inspection plan');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const p = v.plan;
  const close = () => setDialog(null);
  const copy = async () => {
    const r = (await act(() => post<QcPlan>(erpPath(companyId, `/qc-plans/${p.id}/copy`), {}), 'New version drafted')) as QcPlan | null;
    if (r) navigate(qualityPage(companyId, `/plans/${r.id}`));
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={qualityPage(companyId, '/plans')}>Inspection plans</Link><span className="sep">/</span><span>{p.label}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{p.label}</span> {p.name}</h2>
          <div className="mt-badges"><PlanBadge value={p.status} /><span className="badge">{p.kindLabel}</span></div>
        </div>
        <div className="mt-head-actions">
          {v.can.release ? <button className="btn primary" onClick={() => setDialog('release')}>Release</button> : null}
          {v.can.copy ? <button className="btn" onClick={() => void copy()}><Icon name="copy" /> New version</button> : null}
          {v.can.remove ? <button className="btn ghost" onClick={() => setDialog('remove')}><Icon name="trash" /> Remove draft</button> : null}
        </div>
      </div>
      <Section title="Plan">
        <Props
          items={[
            ['Applies to', p.appliesTo],
            ['Description', p.description],
            ['Released', p.releasedAt ? `${dayText(p.releasedAt)} by ${p.releasedByName ?? 'someone'}${p.releaseNote ? `: ${p.releaseNote}` : ''}` : ''],
            ['Drafted', `${dayText(p.createdAt)}${p.createdByName ? ` by ${p.createdByName}` : ''}`],
            ['Used by', v.inspections ? `${v.inspections} inspection${v.inspections === 1 ? '' : 's'}` : ''],
          ]}
        />
        {p.status === 'draft' && !v.can.release && !v.characteristics.length ? <p className="muted small">Add at least one characteristic; a quality manager then releases it.</p> : null}
      </Section>
      <Section title="Characteristics" actions={v.can.edit ? <button className="btn sm" onClick={() => setDialog('add')}><Icon name="plus" size={14} /> Add</button> : null}>
        {!v.characteristics.length ? <p className="muted small">None yet.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Characteristic</th><th>Type</th><th>Limits</th><th className="num">Samples</th><th>Photo</th>{v.can.edit ? <th /> : null}</tr></thead>
              <tbody>
                {v.characteristics.map((c) => (
                  <tr key={c.id}>
                    <td data-label="Characteristic">{c.name}{c.instructions ? <div className="muted small">{c.instructions}</div> : null}</td>
                    <td data-label="Type">{c.kindLabel}</td>
                    <td data-label="Limits">{c.limits}</td>
                    <td data-label="Samples" className="num">{c.sampleSize}</td>
                    <td data-label="Photo">{c.photoRequired ? 'Needed' : ''}</td>
                    {v.can.edit ? <td className="erp-actions"><button className="btn sm" onClick={() => setDialog({ edit: c })}>Edit</button> <button className="btn sm ghost" aria-label={`Remove ${c.name}`} onClick={() => void act(() => del(erpPath(companyId, `/qc-plans/${p.id}/characteristics/${c.id}`)), 'Removed')}><Icon name="trash" size={14} /></button></td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <Section title="Versions">
        <ul className="erp-list">{v.versions.map((x) => <li key={x.id} className="small">{x.id === p.id ? <strong>Version {x.version}</strong> : <Link to={qualityPage(companyId, `/plans/${x.id}`)}>Version {x.version}</Link>} <PlanBadge value={x.status} /> <span className="muted">{x.releasedAt ? `released ${dayText(x.releasedAt)}` : `drafted ${dayText(x.createdAt)}`}</span></li>)}</ul>
      </Section>
      <Section title="Files" actions={v.can.edit ? <RecordUpload companyId={companyId} kind="qc_plan" id={p.id} onDone={() => void q.refetch()} /> : null}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a></li>)}</ul> : <p className="muted small">No files: drawings or standards the inspector needs can be attached.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {dialog === 'add' ? <CharDialog title={`Add a characteristic to ${p.label}`} onClose={close} onSave={async (body) => { if (await act(() => post(erpPath(companyId, `/qc-plans/${p.id}/characteristics`), body), 'Characteristic added')) close(); }} /> : null}
      {dialog && typeof dialog === 'object' ? <CharDialog title={`Edit ${dialog.edit.name}`} initial={dialog.edit} onClose={close} onSave={async (body) => { if (await act(() => patch(erpPath(companyId, `/qc-plans/${p.id}/characteristics/${dialog.edit.id}`), body), 'Saved')) close(); }} /> : null}
      {dialog === 'release' ? <NoteDialog title={`Release ${p.label}`} label={p.version > 1 ? 'Releasing supersedes the version released now. Note (optional)' : 'Note (optional)'} confirm="Release" onClose={close} onSave={async (note) => { if (await act(() => post(erpPath(companyId, `/qc-plans/${p.id}/release`), { note: note || undefined }), 'Released')) close(); }} /> : null}
      {dialog === 'remove' ? <NoteDialog title={`Remove draft ${p.label}`} label="The draft and its characteristics are removed. Note (optional)" confirm="Remove" danger onClose={close} onSave={async () => { if (await act(() => del(erpPath(companyId, `/qc-plans/${p.id}`)), 'Draft removed')) navigate(qualityPage(companyId, '/plans')); }} /> : null}
    </div>
  );
}
