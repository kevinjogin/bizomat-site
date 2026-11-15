// BIZOMAT ERP, Release 3: Manufacturing at /erp/c/<company>/manufacturing: manufacturing orders (a list with search,
// filters, sort, paging and CSV; each order with its materials, operations, time, output, inspections, finished-goods
// receipts, costs, amendments, files and history), the shop floor (ShopFloor.tsx, made for a phone), planning (the
// master production schedule, MRP and rough-cut capacity, and each product's planning data), work centres with their
// machines, and routings with their revisions. The server decides what each person may do; the screens only show it.
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
  DAY_NAMES,
  MESSAGE_LABELS,
  MO_STATUS,
  dateText,
  dayText,
  dollars,
  erpPath,
  inventoryPage,
  manufacturingPage,
  money,
  procurementPage,
  productsPage,
  qty,
  toCents,
  useErpMe,
  type CostView,
  type ErpEvent,
  type ErpMe,
  type Machine,
  type ManufacturingOrder,
  type MoOperation,
  type Operation,
  type RecordFile,
  type Routing,
  type Suggestion,
  type WorkCentre,
} from './api';
import { CsvLink, FilterPanel, History, Pager, Props, RecordUpload, Section, options, requestKey, useAct } from './common';
import { NoteDialog } from './Changes';
import { useListParams } from './Purchasing';
import { ShopFloor } from './ShopFloor';

const tone = (map: Record<string, string>, v: string) => map[v] ?? '';
const MO_TONE: Record<string, string> = { draft: '', released: 'accent', in_progress: 'warning', completed: 'success', closed: '', cancelled: 'danger' };
const OP_TONE: Record<string, string> = { pending: '', in_progress: 'warning', paused: 'accent', completed: 'success' };
const RT_TONE: Record<string, string> = { draft: '', released: 'success', superseded: '' };
const WC_TONE: Record<string, string> = { active: 'success', on_hold: 'warning', inactive: '' };
export const MoBadge = ({ value, label }: { value: string; label?: string }) => <span className={`badge ${tone(MO_TONE, value)}`}>{label ?? MO_STATUS[value as keyof typeof MO_STATUS] ?? value}</span>;
export const OpBadge = ({ value, label }: { value: string; label: string }) => <span className={`badge ${tone(OP_TONE, value)}`}>{label}</span>;
const RoutingBadge = ({ value, label }: { value: string; label: string }) => <span className={`badge ${tone(RT_TONE, value)}`}>{label}</span>;
const WcBadge = ({ value, label }: { value: string; label: string }) => <span className={`badge ${tone(WC_TONE, value)}`}>{label}</span>;
const Messages = ({ list }: { list: string[] }) => <>{list.map((m) => <span key={m} className={`badge ${m === 'overdue' ? 'danger' : 'warning'}`}>{MESSAGE_LABELS[m] ?? m}</span>)}</>;
const hours = (h: number) => `${Math.round(h * 100) / 100} h`;

export function ManufacturingArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const me = useErpMe(companyId);
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Manufacturing" />
          <section className="co-prompt"><p>You do not have access to manufacturing in {companyName}. People in the company have access; people who only share a tool with it do not.</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening Manufacturing…" />;
  const m = me.data;
  const tab = (to: string, icon: Parameters<typeof Icon>[0]['name'], label: string, end = false) => (
    <NavLink to={manufacturingPage(companyId, to)} end={end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name={icon} size={14} /> {label}</NavLink>
  );
  return (
    <div className="page crm-page">
      <PageHeader title="Manufacturing" subtitle={`Production of ${m.company.name}: orders from release to close, the shop floor, planning and capacity, work centres and routings.`} />
      <nav className="tabs mt-tabs" aria-label="Manufacturing sections">
        {tab('', 'layers', 'Orders', true)}
        {tab('/shop-floor', 'play', 'Shop floor')}
        {tab('/planning', 'calendar', 'Planning')}
        {tab('/work-centres', 'settings', 'Work centres')}
        {tab('/routings', 'list', 'Routings')}
      </nav>
      <Routes>
        <Route index element={<OrdersPage companyId={companyId} me={m} />} />
        <Route path="orders/:id" element={<OrderDetail companyId={companyId} me={m} />} />
        <Route path="shop-floor" element={<ShopFloor companyId={companyId} me={m} />} />
        <Route path="planning" element={<PlanningPage companyId={companyId} me={m} />} />
        <Route path="work-centres" element={<WorkCentresPage companyId={companyId} me={m} />} />
        <Route path="work-centres/:id" element={<WorkCentreDetail companyId={companyId} />} />
        <Route path="routings" element={<RoutingsPage companyId={companyId} me={m} />} />
        <Route path="routings/:id" element={<RoutingDetail companyId={companyId} />} />
        <Route path="*" element={<Navigate to={manufacturingPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

// ------------------------------------------------------------------ orders

interface MoOptions {
  products: { id: string; number: string; name: string; uom: string; bomRevision: string; routingId: string | null; routingRevision: string | null }[];
  locations: { id: string; code: string; name: string; kind: string }[];
  people: { id: string; name: string }[];
  methods: { value: string; label: string }[];
  productionTypes: { value: string; label: string }[];
  priorities: { value: string; label: string }[];
}

const useMoOptions = (companyId: string) => useQuery({ queryKey: ['erp', companyId, 'mo-options'], queryFn: () => get<MoOptions>(erpPath(companyId, '/mo-options')) });

function OrdersPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Manufacturing orders');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'priority', 'late', 'mine', 'sort']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'mos', filters.toString(), offset], queryFn: () => get<{ orders: ManufacturingOrder[]; total: number }>(erpPath(companyId, `/mos?${filters}&limit=${limit}&offset=${offset}`)) });
  const ops = useQuery({ queryKey: ['erp', companyId, 'operations'], queryFn: () => get<{ manufacturing: { draft: number; released: number; inProgress: number; toClose: number; late: number; inspections: number; suggestions: { make: number; buy: number; expedite: number } } }>(erpPath(companyId, '/operations')) });
  const [adding, setAdding] = useState(false);
  const x = ops.data?.manufacturing;
  const stat = (n: number, label: string, onClick: () => void) => (
    <button type="button" className="card card-pad erp-stat" onClick={onClick}><strong>{n}</strong><span className="muted small">{label}</span></button>
  );
  return (
    <div className="stack">
      {x ? (
        <div className="erp-stats">
          {stat(x.released + x.inProgress, 'Released and in progress', () => set('status', 'active'))}
          {stat(x.draft, 'Drafts to release', () => set('status', 'draft'))}
          {stat(x.late, 'Late', () => set('late', '1'))}
          {stat(x.toClose, 'Completed, to close', () => set('status', 'completed'))}
          {stat(x.inspections, 'Inspections outstanding', () => set('status', 'in_progress'))}
          {stat(x.suggestions.make + x.suggestions.buy + x.suggestions.expedite, 'MRP suggestions open', () => undefined)}
        </div>
      ) : null}
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/mos?${filters}`} />
        <Link className="btn" to={manufacturingPage(companyId, '/shop-floor')}><Icon name="play" /> Shop floor</Link>
        {me.can['production.plan'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> New order</button> : null}
      </div>
      <FilterPanel active={['q', 'status', 'priority', 'late', 'mine'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="mo-q">Search</label><input id="mo-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, product, customer or job" /></div>
        <div className="field"><label htmlFor="mo-s">Status</label><select id="mo-s" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Every status</option><option value="open">Open (draft, released, in progress)</option><option value="active">Released and in progress</option>{options(MO_STATUS)}</select></div>
        <div className="field"><label htmlFor="mo-p">Priority</label><select id="mo-p" className="select" value={g('priority')} onChange={(e) => set('priority', e.target.value)}><option value="">Any</option><option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
        <div className="field"><label htmlFor="mo-sort">Sort by</label><select id="mo-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Newest</option><option value="required">Required date</option><option value="priority">Priority</option><option value="number">Number</option></select></div>
        <label className="row"><input type="checkbox" checked={g('late') === '1'} onChange={(e) => set('late', e.target.checked ? '1' : '')} /> Late only</label>
        <label className="row"><input type="checkbox" checked={g('mine') === '1'} onChange={(e) => set('mine', e.target.checked ? '1' : '')} /> Assigned to me</label>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.orders.length ? (
          <EmptyState icon="layers" title={filters.toString() ? 'Nothing matches' : 'No manufacturing orders yet'}>
            {filters.toString() ? 'Change the filters to see more.' : <>An order makes a product from its released bill of materials and routing. Set up <Link to={manufacturingPage(companyId, '/work-centres')}>work centres</Link> and <Link to={manufacturingPage(companyId, '/routings')}>routings</Link> first, then start an order here or from an MRP suggestion.</>}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Order</th><th>Status</th><th className="num">Quantity</th><th>Progress</th><th>Required</th><th>Priority</th><th className="num">Estimated cost</th></tr></thead>
              <tbody>
                {list.data.orders.map((o) => (
                  <tr key={o.id}>
                    <td data-label="Order"><Link className="mt-primary" to={manufacturingPage(companyId, `/orders/${o.id}`)}><span className="mt-num">{o.number}</span> {o.productNumber} {o.productName}</Link>{o.customerRef ? <div className="muted small">{o.customerRef}</div> : null}</td>
                    <td data-label="Status"><MoBadge value={o.status} label={o.statusLabel} /> {o.late ? <span className="badge danger">Late</span> : null}</td>
                    <td data-label="Quantity" className="num">{qty(o.quantity)} <span className="muted small">{o.uom}</span></td>
                    <td data-label="Progress"><progress className="erp-progress" max={100} value={o.progressPct} aria-label={`${o.progressPct}% received`} /> <span className="small">{qty(o.completedQty)} received{o.operations ? `, ${o.operations.done} of ${o.operations.total} operations` : ''}</span></td>
                    <td data-label="Required">{dateText(o.requiredDate)}</td>
                    <td data-label="Priority">{o.priorityLabel}</td>
                    <td data-label="Estimated cost" className="num">{money(o.estimate.total, o.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {adding ? <NewOrderDialog companyId={companyId} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function NewOrderDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const opts = useMoOptions(companyId);
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [f, setF] = useState({ productId: '', quantity: '1', requiredDate: '', startDate: '', method: 'make_to_stock', productionType: 'discrete', priority: 'normal', customerRef: '', fgLocationId: '', notes: '' });
  const [assignees, setAssignees] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const product = opts.data?.products.find((p) => p.id === f.productId);
  const save = async () => {
    setBusy(true);
    const r = (await act(
      () => post<{ id: string; number: string }>(erpPath(companyId, '/mos'), { productId: f.productId, quantity: Number(f.quantity), requiredDate: f.requiredDate || undefined, startDate: f.startDate || undefined, method: f.method, productionType: f.productionType, priority: f.priority, customerRef: f.customerRef, fgLocationId: f.fgLocationId || null, notes: f.notes, assignees }),
      'Order drafted',
    )) as { id: string } | null;
    setBusy(false);
    if (r) navigate(manufacturingPage(companyId, `/orders/${r.id}`));
  };
  return (
    <Modal title="New manufacturing order" wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.productId || !(Number(f.quantity) > 0)} onClick={() => void save()}>{busy ? 'Saving…' : 'Draft the order'}</button></>}>
      {!opts.data ? <Loading /> : !opts.data.products.length ? (
        <p className="muted">No product can be made yet: a product needs a released bill of materials (Products and Engineering) and a released routing (Routings).</p>
      ) : (
        <div className="form-grid">
          <div className="field span-2"><label htmlFor="no-p">Product</label><select id="no-p" className="select" value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value })}><option value="">Choose a product</option>{opts.data.products.map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}{p.routingId ? '' : ' (no released routing)'}</option>)}</select>{product ? <span className="muted small">Bill of materials revision {product.bomRevision}; {product.routingRevision ? `routing revision ${product.routingRevision}` : 'no released routing: release one first'}.</span> : null}</div>
          <div className="field"><label htmlFor="no-q">Quantity{product ? ` (${product.uom})` : ''}</label><input id="no-q" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
          <div className="field"><label htmlFor="no-r">Required by</label><input id="no-r" className="input" type="date" value={f.requiredDate} onChange={(e) => setF({ ...f, requiredDate: e.target.value })} /></div>
          <div className="field"><label htmlFor="no-st">Start (empty: worked out from the lead time)</label><input id="no-st" className="input" type="date" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} /></div>
          <div className="field"><label htmlFor="no-pr">Priority</label><select id="no-pr" className="select" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })}>{opts.data.priorities.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select></div>
          <div className="field"><label htmlFor="no-m">Method</label><select id="no-m" className="select" value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>{opts.data.methods.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select></div>
          <div className="field"><label htmlFor="no-t">Production type</label><select id="no-t" className="select" value={f.productionType} onChange={(e) => setF({ ...f, productionType: e.target.value })}>{opts.data.productionTypes.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select></div>
          <div className="field"><label htmlFor="no-c">Customer or job reference</label><input id="no-c" className="input" maxLength={200} value={f.customerRef} onChange={(e) => setF({ ...f, customerRef: e.target.value })} /></div>
          <div className="field"><label htmlFor="no-l">Finished goods go to</label><select id="no-l" className="select" value={f.fgLocationId} onChange={(e) => setF({ ...f, fgLocationId: e.target.value })}><option value="">The company’s default</option>{opts.data.locations.map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select></div>
          <fieldset className="erp-checks span-2"><legend className="small">Assigned people</legend><div className="erp-role-grid">{opts.data.people.map((p) => <label key={p.id} className="row"><input type="checkbox" checked={assignees.includes(p.id)} onChange={(e) => setAssignees(e.target.checked ? [...assignees, p.id] : assignees.filter((x) => x !== p.id))} /> {p.name}</label>)}</div></fieldset>
          <div className="field span-2"><label htmlFor="no-n">Notes</label><textarea id="no-n" className="textarea" rows={2} maxLength={4000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        </div>
      )}
    </Modal>
  );
}

interface MaterialRow {
  id: string;
  productId: string;
  productNumber: string;
  productName: string;
  uom: string;
  qtyPer: number;
  scrapPct: number;
  requiredQty: number;
  issuedQty: number;
  scrappedQty: number;
  outstandingQty: number;
  reservedQty: number;
  availableQty: number;
  shortageQty: number;
}

export interface OrderView {
  order: ManufacturingOrder;
  assignees: { id: string; name: string }[];
  materials: MaterialRow[];
  operations: MoOperation[];
  time: { id: string; opNo: number; kindLabel: string; userName: string | null; machineCode: string | null; minutes: number | null; running: boolean; rework: boolean; costCents: number; overheadCents: number; note: string; createdAt: number }[];
  reports: { id: string; opNo: number; kind: string; kindLabel: string; quantity: number; minutes: number; reason: string; byName: string | null; createdAt: number }[];
  receipts: { id: string; number: string; quantity: number; locationCode: string; lot: string; serials: string[]; valueCents: number; byName: string | null; createdAt: number }[];
  revisions: { revision: number; reason: string; byName: string | null; changedAt: number; snapshot: Record<string, unknown> }[];
  costs: CostView;
  integration: { id: string; kind: string; kindLabel: string; status: string; note: string; amountCents: number | null; createdAt: number }[];
  files: RecordFile[];
  history: ErpEvent[];
  qualityNote: string;
  can: { plan: boolean; edit: boolean; release: boolean; execute: boolean; issue: boolean; returnMaterials: boolean; receive: boolean; complete: boolean; close: boolean; cancel: boolean };
}

type Dialog = null | { kind: 'issue' | 'return' | 'receive' | 'amend' | 'cancel' | 'release' | 'close' } | { kind: 'report' | 'time' | 'inspection' | 'complete'; op: MoOperation };

function OrderDetail({ companyId }: { companyId: string; me: ErpMe }) {
  const { id = '' } = useParams();
  const act = useAct(companyId);
  const q = useQuery({ queryKey: ['erp', companyId, 'mo', id], queryFn: () => get<OrderView>(erpPath(companyId, `/mos/${id}`)), retry: false });
  const [dialog, setDialog] = useState<Dialog>(null);
  usePageTitle(q.data ? q.data.order.number : 'Manufacturing order');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const o = v.order;
  const cur = o.currency;
  const close = () => setDialog(null);
  const opAct = (op: MoOperation, action: string, body: object, done: string) => act(() => post(erpPath(companyId, `/mos/${o.id}/operations/${op.id}/${action}`), body), done);
  return (
    <div className="stack">
      <div className="mt-path"><Link to={manufacturingPage(companyId)}>Orders</Link><span className="sep">/</span><span>{o.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{o.number}</span> {qty(o.quantity)} {o.uom} of <Link to={productsPage(companyId, `/${o.productId}`)}>{o.productNumber} {o.productName}</Link></h2>
          <div className="mt-badges">
            <MoBadge value={o.status} label={o.statusLabel} />
            <span className="badge">{o.priorityLabel} priority</span>
            {o.late ? <span className="badge danger">{o.overdue ? 'Overdue' : 'Late'}</span> : null}
            {o.revision > 1 ? <span className="badge">Revision {o.revision}</span> : null}
            {o.mrpSuggestionId ? <span className="badge accent">From MRP</span> : null}
          </div>
        </div>
        <div className="mt-head-actions">
          {v.can.release ? <button className="btn primary" onClick={() => setDialog({ kind: 'release' })}><Icon name="play" /> Release</button> : null}
          {v.can.issue ? <button className="btn" onClick={() => setDialog({ kind: 'issue' })}>Issue materials</button> : null}
          {v.can.receive ? <button className="btn" onClick={() => setDialog({ kind: 'receive' })}>Receive finished goods</button> : null}
          {v.can.edit ? <button className="btn" onClick={() => setDialog({ kind: 'amend' })}><Icon name="edit" /> {o.status === 'draft' ? 'Edit' : 'Amend'}</button> : null}
          {v.can.complete ? <button className="btn" onClick={() => void act(() => post(erpPath(companyId, `/mos/${o.id}/complete`), {}), 'Order completed')}><Icon name="check" /> Complete</button> : null}
          {v.can.close ? <button className="btn primary" onClick={() => setDialog({ kind: 'close' })}>Close and finalise costs</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setDialog({ kind: 'cancel' })}>Cancel</button> : null}
        </div>
      </div>
      <Section title="Order">
        <Props
          items={[
            ['Product', `${o.productNumber} ${o.productName}`],
            ['Bill of materials', `Revision ${o.bomRevision}`],
            ['Routing', o.routingRevision ? <Link to={manufacturingPage(companyId, `/routings/${o.routingId}`)}>Revision {o.routingRevision}</Link> : 'None'],
            ['Quantity', `${qty(o.quantity)} ${o.uom}${o.maxQty > o.quantity ? ` (up to ${qty(o.maxQty)} with the over-completion tolerance)` : ''}`],
            ['Received', `${qty(o.completedQty)} ${o.uom} (${o.progressPct}%)`],
            ['Start', dateText(o.startDate)],
            ['Planned finish', dateText(o.finishDate)],
            ['Required by', dateText(o.requiredDate)],
            ['Method', `${o.methodLabel}, ${o.productionTypeLabel.toLowerCase()}`],
            ['Customer or job', o.customerRef],
            ['Finished goods go to', o.fgLocationCode ?? 'The company’s default location'],
            ['Assigned', v.assignees.map((x) => x.name).join(', ')],
            ['Notes', o.notes],
            ['Released', o.releasedAt ? `${dayText(o.releasedAt)} by ${o.releasedByName ?? 'someone'}` : ''],
            ['Cancelled', o.cancelledAt ? `${dayText(o.cancelledAt)}: ${o.cancelReason}` : ''],
          ]}
        />
      </Section>
      <Section title="Materials" actions={v.can.returnMaterials ? <button className="btn sm" onClick={() => setDialog({ kind: 'return' })}>Return unused</button> : null}>
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Material</th><th className="num">Per unit</th><th className="num">Required</th><th className="num">Issued</th><th className="num">Reserved</th><th className="num">Available</th><th className="num">Short</th></tr></thead>
            <tbody>
              {v.materials.map((m) => (
                <tr key={m.id}>
                  <td data-label="Material"><Link to={inventoryPage(companyId, `/stock/${m.productId}`)}><span className="mt-num">{m.productNumber}</span> {m.productName}</Link></td>
                  <td data-label="Per unit" className="num">{qty(m.qtyPer)}{m.scrapPct ? <span className="muted small"> +{m.scrapPct}% scrap</span> : null}</td>
                  <td data-label="Required" className="num">{qty(m.requiredQty)} <span className="muted small">{m.uom}</span></td>
                  <td data-label="Issued" className="num">{qty(m.issuedQty)}{m.scrappedQty ? <div className="muted small">{qty(m.scrappedQty)} scrapped</div> : null}</td>
                  <td data-label="Reserved" className="num">{m.reservedQty ? qty(m.reservedQty) : ''}</td>
                  <td data-label="Available" className="num">{qty(m.availableQty)}</td>
                  <td data-label="Short" className="num">{m.shortageQty ? <strong className="erp-neg">{qty(m.shortageQty)}</strong> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Operations">
        {!v.operations.length ? <p className="muted small">No operations.</p> : (
          <ol className="erp-list erp-ops">
            {v.operations.map((op) => (
              <li key={op.id} className="card card-pad stack erp-op">
                <div className="row wrap">
                  <strong className="grow"><span className="mt-num">{op.opNo}</span> {op.name}</strong>
                  <OpBadge value={op.status} label={op.statusLabel} />
                  {op.inspection ? <span className={`badge ${op.inspectionResult === 'pass' ? 'success' : op.inspectionResult === 'fail' ? 'danger' : 'warning'}`}>{op.inspectionResult ? `Inspection: ${op.inspectionResult}` : 'Inspection point'}</span> : null}
                  {op.machineDown ? <span className="badge danger">Machine down{op.breakdown ? ` (${op.breakdown.number})` : ''}</span> : null}
                </div>
                <p className="small muted">
                  {op.outsourced ? `Outsourced to ${op.supplierName ?? 'a supplier'}${op.outsourceCostCents !== null ? `, estimated ${money(op.outsourceCostCents, cur)} each` : ''}` : `${op.workCentreCode ?? ''} ${op.workCentreName ?? ''}${op.machineCode ? `, machine ${op.machineCode}` : ''}; set-up ${op.setupMinutes} min, ${op.runMinutes} min each, crew ${op.crew}`}
                  {op.effectivePredecessors.length ? `; after ${op.effectivePredecessors.join(', ')}${op.overlap ? ' (may overlap)' : ''}` : ''}
                  {op.plannedStart ? `; planned ${dateText(op.plannedStart)} to ${dateText(op.plannedFinish)}` : ''}
                </p>
                <div className="row wrap small">
                  <span>Good <strong>{qty(op.goodQty)}</strong> of {qty(o.quantity)}</span>
                  {op.scrapQty ? <span>Scrap <strong>{qty(op.scrapQty)}</strong></span> : null}
                  {op.reworkQty ? <span>Rework <strong>{qty(op.reworkQty)}</strong></span> : null}
                  {op.downtimeMinutes ? <span>Downtime <strong>{op.downtimeMinutes} min</strong></span> : null}
                  {op.actualOutsourceCents !== null ? <span>Outsourced cost <strong>{money(op.actualOutsourceCents, cur)}</strong></span> : null}
                  {op.inspectionComment ? <span className="muted">“{op.inspectionComment}”</span> : null}
                </div>
                {v.can.execute && op.status !== 'completed' ? (
                  <div className="row wrap">
                    {(op.status === 'pending' || op.status === 'paused') && !op.outsourced ? <button className="btn sm primary" disabled={op.status === 'pending' && op.ready === false} title={op.ready === false ? 'Waiting for the operations before it' : undefined} onClick={() => void opAct(op, 'start', {}, op.status === 'paused' ? 'Resumed' : 'Started')}><Icon name="play" size={14} /> {op.status === 'paused' ? 'Resume' : 'Start'}</button> : null}
                    {op.status === 'in_progress' ? <button className="btn sm" onClick={() => void opAct(op, 'pause', {}, 'Paused')}><Icon name="stop" size={14} /> Pause</button> : null}
                    {op.status !== 'pending' ? <button className="btn sm" onClick={() => setDialog({ kind: 'report', op })}>Report</button> : null}
                    {op.status !== 'pending' && !op.outsourced ? <button className="btn sm" onClick={() => setDialog({ kind: 'time', op })}><Icon name="clock" size={14} /> Time</button> : null}
                    {op.inspection && op.status !== 'pending' ? <button className="btn sm" onClick={() => setDialog({ kind: 'inspection', op })}>Inspection</button> : null}
                    {op.status !== 'pending' || op.outsourced ? <button className="btn sm" onClick={() => setDialog({ kind: 'complete', op })}><Icon name="check" size={14} /> Complete</button> : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        )}
        <p className="muted small"><Icon name="info" size={14} /> {v.qualityNote}</p>
      </Section>
      <Section title="Costs" actions={<CsvLink companyId={companyId} path={`/mos/${o.id}/costs`} />}>
        <CostTable costs={v.costs} />
      </Section>
      <Section title="Finished goods received">
        {!v.receipts.length ? <p className="muted small">None yet. Finished goods are received once the last operation reports them good.</p> : (
          <ul className="erp-list">{v.receipts.map((r) => <li key={r.id} className="small"><span className="mt-num">{r.number}</span> {qty(r.quantity)} {o.uom} into {r.locationCode}{r.lot ? `, lot ${r.lot}` : ''}{r.serials.length ? `, serials ${r.serials.join(', ')}` : ''}, valued at {money(r.valueCents, cur)} <span className="muted">{dayText(r.createdAt)}{r.byName ? ` by ${r.byName}` : ''}</span></li>)}</ul>
        )}
      </Section>
      <Section title="Time and reports">
        {!v.time.length && !v.reports.length ? <p className="muted small">Nothing recorded yet.</p> : (
          <ul className="erp-list">
            {v.time.map((t) => <li key={t.id} className="small">Op {t.opNo}: {t.kindLabel.toLowerCase()} {t.running ? <span className="badge warning">Timer running</span> : `${t.minutes} min`}{t.userName ? ` by ${t.userName}` : ''}{t.machineCode ? ` on ${t.machineCode}` : ''}{t.rework ? ' (rework)' : ''}{!t.running ? `, ${money(t.costCents + t.overheadCents, cur)} with overheads` : ''}{t.note ? `: ${t.note}` : ''} <span className="muted">{dayText(t.createdAt)}</span></li>)}
            {v.reports.map((r) => <li key={r.id} className="small">Op {r.opNo}: {r.kind === 'downtime' ? `${r.minutes} min downtime` : `${qty(r.quantity)} ${r.kindLabel.toLowerCase()}`}{r.reason ? ` (${r.reason})` : ''}{r.byName ? ` by ${r.byName}` : ''} <span className="muted">{dayText(r.createdAt)}</span></li>)}
          </ul>
        )}
      </Section>
      {v.revisions.length ? (
        <Section title="Amendments">
          <ul className="erp-list">{v.revisions.map((r) => <li key={r.revision} className="small">Revision {r.revision} replaced {dayText(r.changedAt)}{r.byName ? ` by ${r.byName}` : ''}: {r.reason}. It said {String(r.snapshot.quantity ?? '')} {o.uom}{r.snapshot.requiredDate ? `, required ${dateText(String(r.snapshot.requiredDate))}` : ''}.</li>)}</ul>
        </Section>
      ) : null}
      <Section title="Link to Finance">
        <p className="muted small">Production value is not posted to Finance’s ledger. Each posting it would need is recorded here as planned.</p>
        {v.integration.length ? <ul className="erp-list">{v.integration.map((e) => <li key={e.id} className="small">{e.kindLabel}: <span className="badge">Planned</span> {e.amountCents !== null ? money(e.amountCents, cur) : ''} <span className="muted">{dayText(e.createdAt)}</span></li>)}</ul> : null}
      </Section>
      <Section title="Files" actions={v.can.plan ? <RecordUpload companyId={companyId} kind="manufacturing_order" id={o.id} onDone={() => void q.refetch()} /> : null}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a> <span className="muted">{dayText(f.createdAt)}</span></li>)}</ul> : <p className="muted small">No files.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {dialog?.kind === 'release' ? <ReleaseDialog companyId={companyId} view={v} onClose={close} /> : null}
      {dialog?.kind === 'issue' || dialog?.kind === 'return' ? <MaterialsDialog companyId={companyId} view={v} mode={dialog.kind} onClose={close} /> : null}
      {dialog?.kind === 'receive' ? <ReceiveDialog companyId={companyId} view={v} onClose={close} /> : null}
      {dialog?.kind === 'amend' ? <AmendDialog companyId={companyId} view={v} onClose={close} /> : null}
      {dialog?.kind === 'cancel' ? <NoteDialog title={`Cancel ${o.number}`} label="Why is it cancelled?" confirm="Cancel the order" required danger onClose={close} onSave={async (note) => { if (await act(() => post(erpPath(companyId, `/mos/${o.id}/cancel`), { reason: note }), 'Order cancelled')) close(); }} /> : null}
      {dialog?.kind === 'close' ? <NoteDialog title={`Close ${o.number}`} label="Closing makes the costs final and records the variances. Nothing more can be recorded on it. Note (optional)" confirm="Close the order" onClose={close} onSave={async () => { if (await act(() => post(erpPath(companyId, `/mos/${o.id}/close`), {}), 'Order closed: costs final')) close(); }} /> : null}
      {dialog && 'op' in dialog ? <OperationDialog companyId={companyId} view={v} kind={dialog.kind} op={dialog.op} onClose={close} /> : null}
    </div>
  );
}

export function CostTable({ costs }: { costs: CostView }) {
  const cur = costs.currency;
  return (
    <div className="stack">
      <div className="crm-table-scroll">
        <table className="data-table">
          <thead><tr><th>Element</th><th className="num">Estimated</th><th className="num">Actual{costs.final ? ' (final)' : ' so far'}</th><th className="num">Variance</th></tr></thead>
          <tbody>
            {costs.elements.map((e) => <tr key={e.element}><td>{e.label}</td><td className="num">{money(e.estimatedCents, cur)}</td><td className="num">{money(e.actualCents, cur)}</td><td className={`num${e.varianceCents > 0 ? ' erp-neg' : ''}`}>{e.varianceCents > 0 ? '+' : ''}{money(e.varianceCents, cur)}</td></tr>)}
            <tr className="erp-total"><th>Total</th><td className="num"><strong>{money(costs.estimatedCents, cur)}</strong></td><td className="num"><strong>{money(costs.actualCents, cur)}</strong></td><td className={`num${costs.varianceCents > 0 ? ' erp-neg' : ''}`}><strong>{costs.varianceCents > 0 ? '+' : ''}{money(costs.varianceCents, cur)}</strong></td></tr>
          </tbody>
        </table>
      </div>
      <Props items={[['Estimated per unit', costs.estimatedUnitCents === null ? '' : money(costs.estimatedUnitCents, cur)], ['Actual per good unit', costs.actualUnitCents === null ? '' : money(costs.actualUnitCents, cur)], ['Taken into stock', money(costs.receivedValueCents, cur)], ['Not taken into stock', costs.unabsorbedCents ? money(costs.unabsorbedCents, cur) : ''], ['Job profitability', costs.profitability]]} />
      {costs.missing.length ? <p className="warn-box small"><Icon name="alert" size={14} /> No cost for {costs.missing.join(', ')}: the estimate counts them at zero.</p> : null}
      <p className="muted small">{costs.note}</p>
    </div>
  );
}

function ReleaseDialog({ companyId, view, onClose }: { companyId: string; view: OrderView; onClose: () => void }) {
  const act = useAct(companyId);
  const [reserve, setReserve] = useState(true);
  const [result, setResult] = useState<null | { shortages: { number: string; name: string; short: number }[]; reserved: { product: string; quantity: number }[] }>(null);
  const short = view.materials.filter((m) => m.shortageQty > 0);
  return (
    <Modal title={`Release ${view.order.number}`} onClose={onClose} footer={result ? <button className="btn primary" onClick={onClose}>Done</button> : <><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={async () => { const r = (await act(() => post(erpPath(companyId, `/mos/${view.order.id}/release`), { reserve }), 'Order released')) as any; if (r) setResult(r); }}>Release</button></>}>
      {result ? (
        <div className="stack">
          <p>Released. {result.reserved.length ? `Reserved: ${result.reserved.map((r) => `${qty(r.quantity)} ${r.product}`).join(', ')}.` : 'Nothing was reserved.'}</p>
          {result.shortages.length ? <p className="warn-box small">Short: {result.shortages.map((s) => `${qty(s.short)} ${s.number}`).join(', ')}. Buy or make them, or issue them as they arrive.</p> : <p className="muted small">No shortages.</p>}
        </div>
      ) : (
        <div className="stack">
          <p>Releasing schedules the operations from today over each work centre’s calendar and opens the order to the shop floor.</p>
          {short.length ? <p className="warn-box small"><Icon name="alert" size={14} /> Short: {short.map((m) => `${qty(m.shortageQty)} ${m.productNumber}`).join(', ')}.</p> : <p className="muted small">Every material is available.</p>}
          <label className="row"><input type="checkbox" checked={reserve} onChange={(e) => setReserve(e.target.checked)} /> Reserve the materials now, as far as stock allows</label>
        </div>
      )}
    </Modal>
  );
}

interface StockPlace { id: string; productId: string; locationId: string; locationCode: string; warehouseCode: string; lot: string; serial: string; available: number; onHand: number; locationKind: string }

function MaterialsDialog({ companyId, view, mode, onClose }: { companyId: string; view: OrderView; mode: 'issue' | 'return'; onClose: () => void }) {
  const act = useAct(companyId);
  const o = view.order;
  const [materialId, setMaterialId] = useState(view.materials[0]?.id ?? '');
  const m = view.materials.find((x) => x.id === materialId);
  const places = useQuery({ queryKey: ['erp', companyId, 'stock-places', m?.productId], enabled: !!m, queryFn: () => get<{ rows: StockPlace[] }>(erpPath(companyId, `/stock?view=detail&q=${encodeURIComponent(m!.productNumber)}&limit=200`)) });
  const locs = useQuery({ queryKey: ['erp', companyId, 'mo-options'], queryFn: () => get<MoOptions>(erpPath(companyId, '/mo-options')) });
  const [place, setPlace] = useState('');
  const [locationId, setLocationId] = useState('');
  const [lot, setLot] = useState('');
  const [quantity, setQuantity] = useState('');
  const [key] = useState(requestKey);
  const rows = (places.data?.rows ?? []).filter((r) => r.productId === m?.productId && r.locationKind !== 'quarantine' && r.onHand > 0);
  const chosen = rows.find((r) => r.id === place);
  const default_ = m ? (mode === 'issue' ? m.outstandingQty : m.issuedQty) : 0;
  const save = async () => {
    const n = Number(quantity || default_);
    const line = mode === 'issue' ? { materialId, locationId: chosen?.locationId ?? '', lot: chosen?.lot || undefined, serial: chosen?.serial || undefined, quantity: n } : { materialId, locationId, lot: lot || undefined, quantity: n };
    if (await act(() => post(erpPath(companyId, `/mos/${o.id}/${mode}`), { requestKey: key, lines: [line] }), mode === 'issue' ? 'Issued to the order' : 'Returned to stock')) onClose();
  };
  return (
    <Modal title={mode === 'issue' ? `Issue materials to ${o.number}` : `Return unused materials from ${o.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!materialId || !(Number(quantity || default_) > 0) || (mode === 'issue' ? !chosen : !locationId)} onClick={() => void save()}>{mode === 'issue' ? 'Issue' : 'Return'}</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="md-m">Material</label><select id="md-m" className="select" value={materialId} onChange={(e) => { setMaterialId(e.target.value); setPlace(''); setQuantity(''); }}>{view.materials.map((x) => <option key={x.id} value={x.id}>{x.productNumber} {x.productName}: {mode === 'issue' ? `${qty(x.outstandingQty)} to issue${x.reservedQty ? `, ${qty(x.reservedQty)} reserved` : ''}` : `${qty(x.issuedQty)} issued`}</option>)}</select></div>
        {mode === 'issue' ? (
          <div className="field"><label htmlFor="md-p">From</label><select id="md-p" className="select" value={place} onChange={(e) => setPlace(e.target.value)}><option value="">Choose where it is taken from</option>{rows.map((r) => <option key={r.id} value={r.id}>{r.warehouseCode}/{r.locationCode}{r.lot ? ` lot ${r.lot}` : ''}{r.serial ? ` serial ${r.serial}` : ''}: {qty(r.onHand)} on hand</option>)}</select>{m && !rows.length && places.data ? <span className="warning-text small">None of {m.productNumber} is in stock.</span> : null}</div>
        ) : (
          <>
            <div className="field"><label htmlFor="md-l">Back to</label><select id="md-l" className="select" value={locationId} onChange={(e) => setLocationId(e.target.value)}><option value="">Choose a location</option>{(locs.data?.locations ?? []).map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select></div>
            <div className="field"><label htmlFor="md-lot">Lot (if tracked)</label><input id="md-lot" className="input" value={lot} onChange={(e) => setLot(e.target.value)} /></div>
          </>
        )}
        <div className="field"><label htmlFor="md-q">Quantity{m ? ` (${m.uom})` : ''}</label><input id="md-q" className="input" type="number" min="0" step="any" inputMode="decimal" placeholder={String(default_)} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
        <p className="muted small">{mode === 'issue' ? 'Stock reserved for this order is taken first. Two people cannot both take the last unit: one of them is refused.' : 'Comes back at the cost it was issued at.'}</p>
      </div>
    </Modal>
  );
}

function ReceiveDialog({ companyId, view, onClose }: { companyId: string; view: OrderView; onClose: () => void }) {
  const act = useAct(companyId);
  const o = view.order;
  const finals = view.operations.filter((op) => !view.operations.some((x) => x.effectivePredecessors.includes(op.opNo)));
  const ready = finals.length ? Math.min(...finals.map((x) => x.goodQty)) : o.maxQty;
  const left = Math.max(0, Math.min(ready, o.maxQty) - o.completedQty);
  const locs = useMoOptions(companyId);
  const [f, setF] = useState({ quantity: String(left || ''), locationId: o.fgLocationId ?? '', lot: '', serials: '' });
  const [key] = useState(requestKey);
  const save = async () => {
    const serials = f.serials.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean);
    if (await act(() => post(erpPath(companyId, `/mos/${o.id}/receive`), { requestKey: key, quantity: Number(f.quantity), locationId: f.locationId || undefined, lot: f.lot || undefined, serials: serials.length ? serials : undefined }), 'Finished goods received')) onClose();
  };
  return (
    <Modal title={`Receive finished goods from ${o.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!(Number(f.quantity) > 0)} onClick={() => void save()}>Receive</button></>}>
      <div className="stack">
        <p className="small">{qty(left)} {o.uom} can be received now: the last operation reported {qty(ready)} good and {qty(o.completedQty)} is already in.</p>
        <div className="field"><label htmlFor="rc-q">Quantity ({o.uom})</label><input id="rc-q" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
        <div className="field"><label htmlFor="rc-l">Into</label><select id="rc-l" className="select" value={f.locationId} onChange={(e) => setF({ ...f, locationId: e.target.value })}><option value="">The company’s finished goods location</option>{(locs.data?.locations ?? []).map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select></div>
        <div className="field"><label htmlFor="rc-lot">Lot (if tracked)</label><input id="rc-lot" className="input" value={f.lot} onChange={(e) => setF({ ...f, lot: e.target.value })} /></div>
        <div className="field"><label htmlFor="rc-s">Serial numbers (if tracked, one per unit)</label><textarea id="rc-s" className="textarea" rows={2} value={f.serials} onChange={(e) => setF({ ...f, serials: e.target.value })} /></div>
        <p className="muted small">Valued at the order’s actual cost: the cost not yet taken into stock, spread over the units still expected.</p>
      </div>
    </Modal>
  );
}

function AmendDialog({ companyId, view, onClose }: { companyId: string; view: OrderView; onClose: () => void }) {
  const act = useAct(companyId);
  const o = view.order;
  const draft = o.status === 'draft';
  const [f, setF] = useState({ quantity: String(o.quantity), requiredDate: o.requiredDate ?? '', startDate: o.startDate ?? '', priority: o.priority, customerRef: o.customerRef, notes: o.notes, reason: '' });
  const save = async () => {
    if (await act(() => patch(erpPath(companyId, `/mos/${o.id}`), { quantity: Number(f.quantity), requiredDate: f.requiredDate || null, startDate: f.startDate || null, priority: f.priority, customerRef: f.customerRef, notes: f.notes, reason: draft ? undefined : f.reason }), draft ? 'Order changed' : 'Order amended')) onClose();
  };
  return (
    <Modal title={draft ? `Edit ${o.number}` : `Amend ${o.number}`} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!draft && !f.reason.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="am-q">Quantity ({o.uom})</label><input id="am-q" className="input" type="number" min="0" step="any" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
        <div className="field"><label htmlFor="am-p">Priority</label><select id="am-p" className="select" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })}><option value="urgent">Urgent</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
        <div className="field"><label htmlFor="am-r">Required by</label><input id="am-r" className="input" type="date" value={f.requiredDate} onChange={(e) => setF({ ...f, requiredDate: e.target.value })} /></div>
        <div className="field"><label htmlFor="am-s">Start</label><input id="am-s" className="input" type="date" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="am-c">Customer or job reference</label><input id="am-c" className="input" value={f.customerRef} onChange={(e) => setF({ ...f, customerRef: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="am-n">Notes</label><textarea id="am-n" className="textarea" rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
        {!draft ? <div className="field span-2"><label htmlFor="am-why">Why is it amended?</label><input id="am-why" className="input" maxLength={1000} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /><span className="muted small">The version before is kept with this reason.</span></div> : <p className="muted small span-2">A draft follows the product’s released bill of materials and routing: saving takes their latest released revisions.</p>}
      </div>
    </Modal>
  );
}

function OperationDialog({ companyId, view, kind, op, onClose }: { companyId: string; view: OrderView; kind: 'report' | 'time' | 'inspection' | 'complete'; op: MoOperation; onClose: () => void }) {
  const act = useAct(companyId);
  const o = view.order;
  const [f, setF] = useState({ kind: 'good', quantity: '', minutes: '', reason: '', timeKind: 'labour', rework: false, note: '', result: 'pass', comment: '', cost: op.outsourceCostCents !== null ? dollars(op.outsourceCostCents * o.quantity) : '' });
  const [key] = useState(requestKey);
  const path = (x: string) => erpPath(companyId, `/mos/${o.id}/operations/${op.id}/${x}`);
  const title = { report: `Report on operation ${op.opNo}`, time: `Time on operation ${op.opNo}`, inspection: `Inspection at operation ${op.opNo}`, complete: `Complete operation ${op.opNo}` }[kind];
  const save = async () => {
    let ok: unknown = null;
    if (kind === 'report') ok = await act(() => post(path('report'), { kind: f.kind, quantity: f.kind === 'downtime' ? undefined : Number(f.quantity), minutes: f.kind === 'downtime' ? Number(f.minutes) : undefined, reason: f.reason || undefined, requestKey: key }), 'Reported');
    else if (kind === 'time') ok = await act(() => post(path('time'), { kind: f.timeKind, action: 'enter', minutes: Number(f.minutes), rework: f.rework, note: f.note || undefined }), 'Time recorded');
    else if (kind === 'inspection') ok = await act(() => post(path('inspection'), { result: f.result, comment: f.comment || undefined }), 'Inspection recorded');
    else {
      const cents = op.outsourced ? toCents(f.cost) : null;
      if (cents === 'bad') return;
      ok = await act(() => post(path('complete'), op.outsourced ? { actualOutsourceCents: cents ?? 0 } : {}), 'Operation completed');
    }
    if (ok) onClose();
  };
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="stack">
        {kind === 'report' ? (
          <>
            <div className="row wrap erp-modes" role="group" aria-label="What to report">{(['good', 'scrap', 'rework', 'downtime'] as const).map((k) => <button key={k} type="button" className={`btn${f.kind === k ? ' primary' : ''}`} aria-pressed={f.kind === k} onClick={() => setF({ ...f, kind: k })}>{{ good: 'Good output', scrap: 'Scrap', rework: 'Rework', downtime: 'Downtime' }[k]}</button>)}</div>
            {f.kind === 'downtime' ? <div className="field"><label htmlFor="od-m">Minutes</label><input id="od-m" className="input erp-big" type="number" min="0" inputMode="decimal" value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} /></div> : <div className="field"><label htmlFor="od-q">Quantity ({o.uom})</label><input id="od-q" className="input erp-big" type="number" min="0" step="any" inputMode="decimal" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /><span className="muted small">{qty(op.goodQty)} good so far; {qty(op.unitsIn)} came in.</span></div>}
            {f.kind !== 'good' ? <div className="field"><label htmlFor="od-r">Reason</label><input id="od-r" className="input" maxLength={500} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></div> : null}
          </>
        ) : kind === 'time' ? (
          <>
            <div className="field"><label htmlFor="od-k">Kind</label><select id="od-k" className="select" value={f.timeKind} onChange={(e) => setF({ ...f, timeKind: e.target.value })}><option value="labour">Labour (mine)</option><option value="machine">Machine</option></select></div>
            <div className="field"><label htmlFor="od-tm">Minutes</label><input id="od-tm" className="input erp-big" type="number" min="0" inputMode="decimal" value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} /></div>
            <label className="row"><input type="checkbox" checked={f.rework} onChange={(e) => setF({ ...f, rework: e.target.checked })} /> Rework</label>
            <div className="field"><label htmlFor="od-n">Note</label><input id="od-n" className="input" maxLength={500} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></div>
            <p className="muted small">Or use the timer on the shop floor.</p>
          </>
        ) : kind === 'inspection' ? (
          <>
            {op.inspectionNote ? <p className="small">Check: {op.inspectionNote}</p> : null}
            <div className="row erp-modes" role="group" aria-label="Result">{(['pass', 'fail'] as const).map((r) => <button key={r} type="button" className={`btn${f.result === r ? (r === 'pass' ? ' primary' : ' danger') : ''}`} aria-pressed={f.result === r} onClick={() => setF({ ...f, result: r })}>{r === 'pass' ? 'Pass' : 'Fail'}</button>)}</div>
            <div className="field"><label htmlFor="od-c">Note{f.result === 'fail' ? ' (what failed)' : ''}</label><textarea id="od-c" className="textarea" rows={2} maxLength={1000} value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })} /></div>
            <p className="muted small">{view.qualityNote}</p>
          </>
        ) : (
          <>
            <p className="small">{qty(op.goodQty)} good{op.scrapQty ? `, ${qty(op.scrapQty)} scrapped` : ''}. Running timers on it stop.</p>
            {op.outsourced ? <div className="field"><label htmlFor="od-cost">What it actually cost ({o.currency})</label><input id="od-cost" className="input" inputMode="decimal" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} /></div> : null}
          </>
        )}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ work centres

const useWorkCentres = (companyId: string) => useQuery({ queryKey: ['erp', companyId, 'work-centres'], queryFn: () => get<{ workCentres: WorkCentre[]; machines: Machine[]; can: { setup: boolean } }>(erpPath(companyId, '/work-centres')) });

function WorkCentresPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Work centres');
  const q = useWorkCentres(companyId);
  const [adding, setAdding] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap"><p className="muted small grow">Where work is done: each has a capacity calendar and cost rates. A machine can be linked to its Maintenance asset; it shows as down while that asset has an open breakdown work order.</p><CsvLink companyId={companyId} path="/work-centres" />{me.can['manufacturing.setup'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> New work centre</button> : null}</div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      <div className="card crm-table-card">
        {!q.data ? <Loading /> : !q.data.workCentres.length ? <EmptyState icon="settings" title="No work centres yet">Add the places where work is done, such as cutting, welding or assembly, with their hours and rates.</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Work centre</th><th>Status</th><th>Calendar</th><th className="num">Hours a week</th><th className="num">Labour</th><th className="num">Machine</th><th>Machines</th><th className="num">Open operations</th></tr></thead>
              <tbody>
                {q.data.workCentres.map((w) => {
                  const ms = q.data!.machines.filter((m) => m.workCentreId === w.id);
                  return (
                    <tr key={w.id}>
                      <td data-label="Work centre"><Link className="mt-primary" to={manufacturingPage(companyId, `/work-centres/${w.id}`)}><span className="mt-num">{w.code}</span> {w.name}</Link></td>
                      <td data-label="Status"><WcBadge value={w.status} label={w.statusLabel} /></td>
                      <td data-label="Calendar" className="small">{w.workingDaysText}, {w.hoursPerDay} h, {w.efficiencyPct}%{w.machines > 1 ? `, ${w.machines} in parallel` : ''}</td>
                      <td data-label="Hours a week" className="num">{w.weeklyHours}</td>
                      <td data-label="Labour" className="num">{money(w.labourRateCents)}/h</td>
                      <td data-label="Machine" className="num">{w.machineRateCents ? `${money(w.machineRateCents)}/h` : ''}</td>
                      <td data-label="Machines">{ms.map((m) => <span key={m.id} className={`badge${m.down ? ' danger' : ''}`}>{m.code}{m.down ? ' down' : ''}</span>)}</td>
                      <td data-label="Open operations" className="num">{w.openOperations ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {adding ? <WorkCentreDialog companyId={companyId} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function WorkCentreDialog({ companyId, current, onClose }: { companyId: string; current?: WorkCentre; onClose: () => void }) {
  const act = useAct(companyId);
  const navigate = useNavigate();
  const c = current;
  const [f, setF] = useState({
    code: c?.code ?? '',
    name: c?.name ?? '',
    description: c?.description ?? '',
    status: c?.status ?? 'active',
    days: c?.workingDays ?? [1, 2, 3, 4, 5],
    hoursPerDay: String(c?.hoursPerDay ?? 8),
    efficiencyPct: String(c?.efficiencyPct ?? 100),
    machines: String(c?.machines ?? 1),
    labour: c ? dollars(c.labourRateCents) : '',
    machine: c ? dollars(c.machineRateCents) : '',
    overheadMode: c && c.overheadPct ? 'pct' : 'rate',
    overhead: c ? (c.overheadPct ? String(c.overheadPct) : dollars(c.overheadRateCents)) : '',
  });
  const save = async () => {
    const labour = toCents(f.labour);
    const machine = toCents(f.machine);
    const rate = f.overheadMode === 'rate' ? toCents(f.overhead) : 0;
    if (labour === 'bad' || machine === 'bad' || rate === 'bad') return;
    const bodyIn = { code: f.code, name: f.name, description: f.description, status: f.status, workingDays: f.days, hoursPerDay: Number(f.hoursPerDay), efficiencyPct: Number(f.efficiencyPct), machines: Number(f.machines), labourRateCents: labour ?? 0, machineRateCents: machine ?? 0, overheadRateCents: f.overheadMode === 'rate' ? rate ?? 0 : 0, overheadPct: f.overheadMode === 'pct' ? Number(f.overhead || 0) : 0 };
    const r = (await act(() => (c ? patch(erpPath(companyId, `/work-centres/${c.id}`), bodyIn) : post(erpPath(companyId, '/work-centres'), bodyIn)), c ? 'Work centre saved' : 'Work centre added')) as { id: string } | null;
    if (r) {
      onClose();
      if (!c) navigate(manufacturingPage(companyId, `/work-centres/${r.id}`));
    }
  };
  return (
    <Modal title={c ? `Edit ${c.code}` : 'New work centre'} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.code.trim() || !f.name.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="wc-c">Code</label><input id="wc-c" className="input" maxLength={40} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></div>
        <div className="field"><label htmlFor="wc-n">Name</label><input id="wc-n" className="input" maxLength={200} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <fieldset className="erp-checks span-2"><legend className="small">Working days</legend><div className="row wrap">{[1, 2, 3, 4, 5, 6, 7].map((d) => <label key={d} className="row"><input type="checkbox" checked={f.days.includes(d)} onChange={(e) => setF({ ...f, days: e.target.checked ? [...f.days, d].sort() : f.days.filter((x) => x !== d) })} /> {DAY_NAMES[d]}</label>)}</div></fieldset>
        <div className="field"><label htmlFor="wc-h">Hours a day</label><input id="wc-h" className="input" type="number" min="0" max="24" step="any" value={f.hoursPerDay} onChange={(e) => setF({ ...f, hoursPerDay: e.target.value })} /></div>
        <div className="field"><label htmlFor="wc-e">Efficiency (%)</label><input id="wc-e" className="input" type="number" min="1" max="200" value={f.efficiencyPct} onChange={(e) => setF({ ...f, efficiencyPct: e.target.value })} /></div>
        <div className="field"><label htmlFor="wc-m">Machines or stations in parallel</label><input id="wc-m" className="input" type="number" min="1" value={f.machines} onChange={(e) => setF({ ...f, machines: e.target.value })} /></div>
        <div className="field"><label htmlFor="wc-st">Status</label><select id="wc-st" className="select" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as WorkCentre['status'] })}><option value="active">Active</option><option value="on_hold">On hold</option><option value="inactive">Inactive</option></select></div>
        <div className="field"><label htmlFor="wc-l">Labour rate per hour</label><input id="wc-l" className="input" inputMode="decimal" value={f.labour} onChange={(e) => setF({ ...f, labour: e.target.value })} /></div>
        <div className="field"><label htmlFor="wc-mr">Machine rate per hour</label><input id="wc-mr" className="input" inputMode="decimal" value={f.machine} onChange={(e) => setF({ ...f, machine: e.target.value })} /></div>
        <div className="field"><label htmlFor="wc-om">Overhead</label><select id="wc-om" className="select" value={f.overheadMode} onChange={(e) => setF({ ...f, overheadMode: e.target.value })}><option value="rate">An amount per labour hour</option><option value="pct">A percentage of labour and machine cost</option></select></div>
        <div className="field"><label htmlFor="wc-o">{f.overheadMode === 'rate' ? 'Overhead per labour hour' : 'Overhead (%)'}</label><input id="wc-o" className="input" inputMode="decimal" value={f.overhead} onChange={(e) => setF({ ...f, overhead: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="wc-d">Description</label><textarea id="wc-d" className="textarea" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

function WorkCentreDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const act = useAct(companyId);
  const q = useQuery({ queryKey: ['erp', companyId, 'work-centre', id], queryFn: () => get<{ workCentre: WorkCentre; machines: Machine[]; operations: { id: string; opNo: number; name: string; statusLabel: string; status: string; plannedStart: string | null; plannedFinish: string | null; goodQty: number; quantity: number; moId: string; moNumber: string; productNumber: string; productName: string }[]; history: ErpEvent[]; can: { setup: boolean } }>(erpPath(companyId, `/work-centres/${id}`)), retry: false });
  const [editing, setEditing] = useState(false);
  const [machine, setMachine] = useState<Machine | 'new' | null>(null);
  usePageTitle(q.data ? q.data.workCentre.code : 'Work centre');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const w = q.data.workCentre;
  return (
    <div className="stack">
      <div className="mt-path"><Link to={manufacturingPage(companyId, '/work-centres')}>Work centres</Link><span className="sep">/</span><span>{w.code}</span></div>
      <div className="mt-head">
        <div><h2 className="mt-title"><span className="mt-num">{w.code}</span> {w.name}</h2><div className="mt-badges"><WcBadge value={w.status} label={w.statusLabel} />{w.archived ? <span className="badge">Archived</span> : null}</div></div>
        <div className="mt-head-actions">
          {q.data.can.setup ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Edit</button> : null}
          {q.data.can.setup ? <button className="btn ghost" onClick={() => void act(() => patch(erpPath(companyId, `/work-centres/${w.id}`), { archived: !w.archived }), w.archived ? 'Restored' : 'Archived')}>{w.archived ? 'Restore' : 'Archive'}</button> : null}
        </div>
      </div>
      <Section title="Capacity and rates">
        <Props items={[['Working days', w.workingDaysText], ['Hours a day', `${w.hoursPerDay} h at ${w.efficiencyPct}% efficiency`], ['In parallel', String(w.machines)], ['Available', `${w.dailyHours} h a day, ${w.weeklyHours} h a week`], ['Labour', `${money(w.labourRateCents)} an hour`], ['Machine', w.machineRateCents ? `${money(w.machineRateCents)} an hour` : ''], ['Overhead', w.overheadPct ? `${w.overheadPct}% of labour and machine cost` : w.overheadRateCents ? `${money(w.overheadRateCents)} per labour hour` : 'None'], ['Description', w.description]]} />
      </Section>
      <Section title="Machines" actions={q.data.can.setup ? <button className="btn sm" onClick={() => setMachine('new')}><Icon name="plus" size={14} /> Add a machine</button> : null}>
        {!q.data.machines.length ? <p className="muted small">No machines. A machine can carry its own rate and be linked to its Maintenance asset.</p> : (
          <ul className="erp-list">
            {q.data.machines.map((m) => (
              <li key={m.id} className="row wrap">
                <span className="grow"><span className="mt-num">{m.code}</span> {m.name}{m.machineRateCents !== null ? `, ${money(m.machineRateCents)}/h` : ''}{m.asset ? <> · Maintenance asset <span className="mt-num">{m.asset.number}</span> {m.asset.name}</> : null}</span>
                {m.down ? <span className="badge danger">Down: breakdown {m.breakdown?.number}</span> : m.status === 'inactive' ? <span className="badge">Inactive</span> : <span className="badge success">Up</span>}
                {q.data!.can.setup ? <button className="btn sm" onClick={() => setMachine(m)}>Edit</button> : null}
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Open operations">
        {!q.data.operations.length ? <p className="muted small">Nothing planned here.</p> : (
          <ul className="erp-list">{q.data.operations.map((o) => <li key={o.id} className="small"><Link to={manufacturingPage(companyId, `/orders/${o.moId}`)}><span className="mt-num">{o.moNumber}</span> op {o.opNo} {o.name}</Link> ({o.productNumber}) <OpBadge value={o.status} label={o.statusLabel} /> {qty(o.goodQty)} of {qty(o.quantity)}{o.plannedStart ? `, planned ${dateText(o.plannedStart)}` : ''}</li>)}</ul>
        )}
      </Section>
      <Section title="History"><History events={q.data.history} /></Section>
      {editing ? <WorkCentreDialog companyId={companyId} current={w} onClose={() => setEditing(false)} /> : null}
      {machine ? <MachineDialog companyId={companyId} workCentreId={w.id} current={machine === 'new' ? undefined : machine} onClose={() => setMachine(null)} /> : null}
    </div>
  );
}

function MachineDialog({ companyId, workCentreId, current, onClose }: { companyId: string; workCentreId: string; current?: Machine; onClose: () => void }) {
  const act = useAct(companyId);
  const assets = useQuery({ queryKey: ['erp', companyId, 'mfg-assets'], queryFn: () => get<{ assets: { id: string; number: string; name: string }[] }>(erpPath(companyId, '/mfg-assets')) });
  const [f, setF] = useState({ code: current?.code ?? '', name: current?.name ?? '', rate: current?.machineRateCents !== null && current?.machineRateCents !== undefined ? dollars(current.machineRateCents) : '', assetId: current?.assetId ?? '', status: current?.status ?? 'active', notes: current?.notes ?? '' });
  const save = async () => {
    const rate = toCents(f.rate);
    if (rate === 'bad') return;
    const b = { workCentreId, code: f.code, name: f.name, machineRateCents: rate, assetId: f.assetId || null, status: f.status, notes: f.notes };
    if (await act(() => (current ? patch(erpPath(companyId, `/machines/${current.id}`), b) : post(erpPath(companyId, '/machines'), b)), current ? 'Machine saved' : 'Machine added')) onClose();
  };
  return (
    <Modal title={current ? `Edit ${current.code}` : 'Add a machine'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.code.trim() || !f.name.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="ma-c">Code</label><input id="ma-c" className="input" maxLength={40} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></div>
        <div className="field"><label htmlFor="ma-n">Name</label><input id="ma-n" className="input" maxLength={200} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="field"><label htmlFor="ma-r">Own rate per hour (empty: the work centre’s)</label><input id="ma-r" className="input" inputMode="decimal" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value })} /></div>
        <div className="field"><label htmlFor="ma-a">Maintenance asset</label><select id="ma-a" className="select" value={f.assetId} onChange={(e) => setF({ ...f, assetId: e.target.value })}><option value="">Not linked</option>{(assets.data?.assets ?? []).map((x) => <option key={x.id} value={x.id}>{x.number} {x.name}</option>)}</select><span className="muted small">Read only: Maintenance is not changed. An open breakdown work order on the asset shows the machine as down.</span></div>
        <div className="field"><label htmlFor="ma-s">Status</label><select id="ma-s" className="select" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Machine['status'] })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ routings

function RoutingsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Routings');
  const { g, set } = useListParams();
  const qs = new URLSearchParams();
  for (const k of ['q', 'status']) if (g(k)) qs.set(k, g(k));
  const q = useQuery({ queryKey: ['erp', companyId, 'routings', qs.toString()], queryFn: () => get<{ routings: Routing[] }>(erpPath(companyId, `/routings?${qs}`)) });
  const [adding, setAdding] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <input className="input grow" type="search" aria-label="Search routings" placeholder="Product number or name" value={g('q')} onChange={(e) => set('q', e.target.value)} />
        <select className="select" aria-label="Status" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Draft and released</option><option value="draft">Draft</option><option value="released">Released</option><option value="superseded">Superseded</option></select>
        <CsvLink companyId={companyId} path={`/routings?${qs}`} />
        {me.can['manufacturing.setup'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> New routing</button> : null}
      </div>
      <p className="muted small">A routing is how a product is made: its operations in order, at work centres, with times. Revisions are drafted, then released by an engineering approver who did not draft them.</p>
      <div className="card crm-table-card">
        {!q.data ? <Loading /> : !q.data.routings.length ? <EmptyState icon="list" title="No routings yet">Start one for a product with a released bill of materials.</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th>Revision</th><th>Status</th><th className="num">Operations</th><th className="num">Lead time</th><th>Released</th></tr></thead>
              <tbody>
                {q.data.routings.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Product"><Link className="mt-primary" to={manufacturingPage(companyId, `/routings/${r.id}`)}><span className="mt-num">{r.productNumber}</span> {r.productName}</Link></td>
                    <td data-label="Revision">{r.revision}</td>
                    <td data-label="Status"><RoutingBadge value={r.status} label={r.statusLabel} />{r.sodException ? <> <span className="badge warning">Recorded exception</span></> : null}</td>
                    <td data-label="Operations" className="num">{r.operationCount ?? 0}</td>
                    <td data-label="Lead time" className="num">{r.leadTimeDays === null ? '' : `${r.leadTimeDays} days`}</td>
                    <td data-label="Released">{r.releasedAt ? `${dayText(r.releasedAt)}${r.releasedByName ? ` by ${r.releasedByName}` : ''}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {adding ? <NewRoutingDialog companyId={companyId} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function useProductOptions(companyId: string) {
  return useQuery({ queryKey: ['erp', companyId, 'product-options'], queryFn: () => get<{ products: { id: string; number: string; name: string; type: string; uom: string }[] }>(erpPath(companyId, '/products?limit=500&sort=number')) });
}

function NewRoutingDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const act = useAct(companyId);
  const navigate = useNavigate();
  const products = useProductOptions(companyId);
  const [f, setF] = useState({ productId: '', description: '', leadTimeDays: '' });
  const save = async () => {
    const r = (await act(() => post(erpPath(companyId, '/routings'), { productId: f.productId, description: f.description, leadTimeDays: f.leadTimeDays === '' ? null : Number(f.leadTimeDays) }), 'Draft routing started')) as { id: string } | null;
    if (r) navigate(manufacturingPage(companyId, `/routings/${r.id}`));
  };
  return (
    <Modal title="New routing" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.productId} onClick={() => void save()}>Start the draft</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="nr-p">Product</label><select id="nr-p" className="select" value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value })}><option value="">Choose a product</option>{(products.data?.products ?? []).filter((p) => p.type !== 'service').map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}</option>)}</select></div>
        <div className="field"><label htmlFor="nr-d">Description</label><input id="nr-d" className="input" maxLength={2000} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="field"><label htmlFor="nr-l">Manufacturing lead time in days (empty: worked out from the operations)</label><input id="nr-l" className="input" type="number" min="0" value={f.leadTimeDays} onChange={(e) => setF({ ...f, leadTimeDays: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

interface RoutingView {
  routing: Routing;
  operations: Operation[];
  revisions: { id: string; revision: string; status: string; statusLabel: string; releasedAt: number | null }[];
  estimate: { labourCents: number; machineCents: number; outsourceCents: number; overheadCents: number; labourHours: number; machineHours: number; note: string };
  files: RecordFile[];
  history: ErpEvent[];
  can: { edit: boolean; release: boolean; copy: boolean };
}

function RoutingDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const act = useAct(companyId);
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ['erp', companyId, 'routing', id], queryFn: () => get<RoutingView>(erpPath(companyId, `/routings/${id}`)), retry: false });
  const [op, setOp] = useState<Operation | 'new' | null>(null);
  const [ask, setAsk] = useState('');
  usePageTitle(q.data ? `Routing ${q.data.routing.productNumber} ${q.data.routing.revision}` : 'Routing');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const r = v.routing;
  return (
    <div className="stack">
      <div className="mt-path"><Link to={manufacturingPage(companyId, '/routings')}>Routings</Link><span className="sep">/</span><span>{r.productNumber} revision {r.revision}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title">Routing of <Link to={productsPage(companyId, `/${r.productId}`)}><span className="mt-num">{r.productNumber}</span> {r.productName}</Link>, revision {r.revision}</h2>
          <div className="mt-badges"><RoutingBadge value={r.status} label={r.statusLabel} />{r.sodException ? <span className="badge warning">Released by its author: company of one (recorded exception)</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          {v.can.release ? <button className="btn primary" onClick={() => setAsk('release')}><Icon name="check" /> Release</button> : null}
          {v.can.edit ? <button className="btn" onClick={() => setOp('new')}><Icon name="plus" /> Add an operation</button> : null}
          {v.can.copy && r.status !== 'draft' ? <button className="btn" onClick={async () => { const x = (await act(() => post(erpPath(companyId, `/routings/${r.id}/copy`), {}), 'Copied to a new draft')) as { id: string } | null; if (x) navigate(manufacturingPage(companyId, `/routings/${x.id}`)); }}><Icon name="copy" /> Copy to a new draft</button> : null}
          {v.can.edit ? <button className="btn ghost" onClick={() => setAsk('delete')}>Delete draft</button> : null}
        </div>
      </div>
      {r.status === 'draft' && !v.can.release ? <p className="muted small"><Icon name="info" size={14} /> An engineering approver who did not draft it releases it (segregation of duties).</p> : null}
      <Section title="Routing">
        <Props items={[['Description', r.description], ['Lead time', r.leadTimeDays === null ? 'Worked out from the operations' : `${r.leadTimeDays} days`], ['Drafted by', r.createdByName ?? ''], ['Released', r.releasedAt ? `${dayText(r.releasedAt)}${r.releasedByName ? ` by ${r.releasedByName}` : ''}${r.releaseNote ? `: ${r.releaseNote}` : ''}` : '']]} />
      </Section>
      <Section title="Operations">
        {!v.operations.length ? <p className="muted small">No operations yet.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>No.</th><th>Operation</th><th>Where</th><th className="num">Set-up</th><th className="num">Per unit</th><th className="num">Crew</th><th>After</th><th /></tr></thead>
              <tbody>
                {v.operations.map((o) => (
                  <tr key={o.id}>
                    <td data-label="No." className="mt-num">{o.opNo}</td>
                    <td data-label="Operation">{o.name}{o.inspection ? <> <span className="badge warning">Inspection</span></> : null}{o.instructions ? <div className="muted small">{o.instructions}</div> : null}</td>
                    <td data-label="Where">{o.outsourced ? `Outsourced: ${o.supplierName ?? ''}${o.outsourceCostCents !== null ? `, ${money(o.outsourceCostCents)} each` : ''}${o.outsourceDays !== null ? `, ${o.outsourceDays} days` : ''}` : `${o.workCentreCode ?? ''}${o.machineCode ? ` / ${o.machineCode}` : ''}`}</td>
                    <td data-label="Set-up" className="num">{o.outsourced ? '' : `${o.setupMinutes} min`}</td>
                    <td data-label="Per unit" className="num">{o.outsourced ? '' : `${o.runMinutes} min`}</td>
                    <td data-label="Crew" className="num">{o.outsourced ? '' : o.crew}</td>
                    <td data-label="After">{o.effectivePredecessors.join(', ')}{o.overlap ? ' (overlap)' : ''}</td>
                    <td className="erp-actions">{v.can.edit ? <><button className="btn sm" onClick={() => setOp(o)}>Edit</button> <button className="btn sm ghost" aria-label={`Remove operation ${o.opNo}`} onClick={() => void act(() => del(erpPath(companyId, `/routings/${r.id}/operations/${o.id}`)), 'Operation removed')}><Icon name="trash" size={14} /></button></> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="muted small">For one unit: labour {money(v.estimate.labourCents)}, machine {money(v.estimate.machineCents)}, outsourcing {money(v.estimate.outsourceCents)}, overheads {money(v.estimate.overheadCents)} ({hours(v.estimate.labourHours)} of labour). {v.estimate.note}</p>
      </Section>
      <Section title="Revisions">
        <ul className="erp-list">{v.revisions.map((x) => <li key={x.id} className="small">{x.id === r.id ? <strong>Revision {x.revision}</strong> : <Link to={manufacturingPage(companyId, `/routings/${x.id}`)}>Revision {x.revision}</Link>} <RoutingBadge value={x.status} label={x.statusLabel} />{x.releasedAt ? ` released ${dayText(x.releasedAt)}` : ''}</li>)}</ul>
      </Section>
      <Section title="Files" actions={v.can.edit || v.can.copy ? <RecordUpload companyId={companyId} kind="routing" id={r.id} onDone={() => void q.refetch()} /> : null}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a></li>)}</ul> : <p className="muted small">No files.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {op ? <OperationEditDialog companyId={companyId} routingId={r.id} current={op === 'new' ? undefined : op} operations={v.operations} onClose={() => setOp(null)} /> : null}
      {ask === 'release' ? <NoteDialog title={`Release revision ${r.revision}`} label="Note (optional). The released revision before it is superseded." confirm="Release" onClose={() => setAsk('')} onSave={async (note) => { if (await act(() => post(erpPath(companyId, `/routings/${r.id}/release`), { note }), 'Routing released')) setAsk(''); }} /> : null}
      {ask === 'delete' ? <NoteDialog title={`Delete draft revision ${r.revision}`} label="Note (optional)" confirm="Delete" danger onClose={() => setAsk('')} onSave={async () => { if (await act(() => del(erpPath(companyId, `/routings/${r.id}`)), 'Draft deleted')) navigate(manufacturingPage(companyId, '/routings')); }} /> : null}
    </div>
  );
}

function OperationEditDialog({ companyId, routingId, current, operations, onClose }: { companyId: string; routingId: string; current?: Operation; operations: Operation[]; onClose: () => void }) {
  const act = useAct(companyId);
  const wcs = useWorkCentres(companyId);
  const suppliers = useQuery({ queryKey: ['erp', companyId, 'supplier-options'], queryFn: () => get<{ suppliers: { id: string; number: string; name: string }[] }>(erpPath(companyId, '/supplier-options')) });
  const c = current;
  const [f, setF] = useState({
    opNo: c ? String(c.opNo) : '',
    name: c?.name ?? '',
    instructions: c?.instructions ?? '',
    outsourced: c?.outsourced ?? false,
    workCentreId: c?.workCentreId ?? '',
    machineId: c?.machineId ?? '',
    setupMinutes: String(c?.setupMinutes ?? 0),
    runMinutes: String(c?.runMinutes ?? 0),
    crew: String(c?.crew ?? 1),
    inspection: c?.inspection ?? false,
    inspectionNote: c?.inspectionNote ?? '',
    supplierId: c?.supplierId ?? '',
    cost: c?.outsourceCostCents !== null && c?.outsourceCostCents !== undefined ? dollars(c.outsourceCostCents) : '',
    days: c?.outsourceDays !== null && c?.outsourceDays !== undefined ? String(c.outsourceDays) : '',
    predecessors: c?.predecessors ? c.predecessors.join(', ') : '',
    overlap: c?.overlap ?? false,
  });
  const machines = (wcs.data?.machines ?? []).filter((m) => m.workCentreId === f.workCentreId);
  const save = async () => {
    const cost = toCents(f.cost);
    if (cost === 'bad') return;
    const preds = f.predecessors.trim() ? f.predecessors.split(/[\s,]+/).filter(Boolean).map(Number) : null;
    const b = {
      opNo: f.opNo ? Number(f.opNo) : undefined,
      name: f.name,
      instructions: f.instructions,
      outsourced: f.outsourced,
      workCentreId: f.outsourced ? null : f.workCentreId || null,
      machineId: f.outsourced ? null : f.machineId || null,
      setupMinutes: Number(f.setupMinutes || 0),
      runMinutes: Number(f.runMinutes || 0),
      crew: Number(f.crew || 0),
      inspection: f.inspection,
      inspectionNote: f.inspectionNote,
      supplierId: f.outsourced ? f.supplierId || null : null,
      outsourceCostCents: f.outsourced ? cost : null,
      outsourceDays: f.outsourced && f.days ? Number(f.days) : null,
      predecessors: preds,
      overlap: f.overlap,
    };
    if (await act(() => (c ? patch(erpPath(companyId, `/routings/${routingId}/operations/${c.id}`), b) : post(erpPath(companyId, `/routings/${routingId}/operations`), b)), c ? 'Operation saved' : 'Operation added')) onClose();
  };
  return (
    <Modal title={c ? `Operation ${c.opNo}` : 'Add an operation'} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.name.trim() || (f.outsourced ? !f.supplierId : !f.workCentreId)} onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="op-no">Number (empty: the next ten)</label><input id="op-no" className="input" type="number" min="1" max="9999" value={f.opNo} onChange={(e) => setF({ ...f, opNo: e.target.value })} /></div>
        <div className="field"><label htmlFor="op-n">Name</label><input id="op-n" className="input" maxLength={200} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <label className="row span-2"><input type="checkbox" checked={f.outsourced} onChange={(e) => setF({ ...f, outsourced: e.target.checked })} /> Outsourced to a supplier</label>
        {f.outsourced ? (
          <>
            <div className="field"><label htmlFor="op-s">Supplier</label><select id="op-s" className="select" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value })}><option value="">Choose a supplier</option>{(suppliers.data?.suppliers ?? []).map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div>
            <div className="field"><label htmlFor="op-c">Estimated cost per unit</label><input id="op-c" className="input" inputMode="decimal" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} /></div>
            <div className="field"><label htmlFor="op-d">Supplier’s days</label><input id="op-d" className="input" type="number" min="0" value={f.days} onChange={(e) => setF({ ...f, days: e.target.value })} /></div>
          </>
        ) : (
          <>
            <div className="field"><label htmlFor="op-w">Work centre</label><select id="op-w" className="select" value={f.workCentreId} onChange={(e) => setF({ ...f, workCentreId: e.target.value, machineId: '' })}><option value="">Choose a work centre</option>{(wcs.data?.workCentres ?? []).map((w) => <option key={w.id} value={w.id}>{w.code} {w.name}</option>)}</select></div>
            <div className="field"><label htmlFor="op-m">Machine</label><select id="op-m" className="select" value={f.machineId} onChange={(e) => setF({ ...f, machineId: e.target.value })}><option value="">Any</option>{machines.map((m) => <option key={m.id} value={m.id}>{m.code} {m.name}</option>)}</select></div>
            <div className="field"><label htmlFor="op-su">Set-up (minutes)</label><input id="op-su" className="input" type="number" min="0" step="any" value={f.setupMinutes} onChange={(e) => setF({ ...f, setupMinutes: e.target.value })} /></div>
            <div className="field"><label htmlFor="op-r">Run time per unit (minutes)</label><input id="op-r" className="input" type="number" min="0" step="any" value={f.runMinutes} onChange={(e) => setF({ ...f, runMinutes: e.target.value })} /></div>
            <div className="field"><label htmlFor="op-cr">Crew (people)</label><input id="op-cr" className="input" type="number" min="0" step="any" value={f.crew} onChange={(e) => setF({ ...f, crew: e.target.value })} /></div>
          </>
        )}
        <div className="field"><label htmlFor="op-pr">Waits for operations (empty: the one before it)</label><input id="op-pr" className="input" placeholder={operations.length ? `For example ${operations[0].opNo}` : ''} value={f.predecessors} onChange={(e) => setF({ ...f, predecessors: e.target.value })} /></div>
        <label className="row"><input type="checkbox" checked={f.overlap} onChange={(e) => setF({ ...f, overlap: e.target.checked })} /> May overlap them (start once they have started)</label>
        <label className="row"><input type="checkbox" checked={f.inspection} onChange={(e) => setF({ ...f, inspection: e.target.checked })} /> Inspection point</label>
        {f.inspection ? <div className="field span-2"><label htmlFor="op-in">What to check</label><input id="op-in" className="input" maxLength={1000} value={f.inspectionNote} onChange={(e) => setF({ ...f, inspectionNote: e.target.value })} /></div> : null}
        <div className="field span-2"><label htmlFor="op-i">Instructions</label><textarea id="op-i" className="textarea" rows={2} value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ planning

interface MpsEntry { id: string; productId: string; productNumber: string; productName: string; uom: string; quantity: number; dueDate: string; kind: string; kindLabel: string; reference: string; status: string; statusLabel: string }
interface RunView {
  run: null | { id: string; number: string; runDate: string; horizonDays: number; includeForecast: boolean; summary: Record<string, number>; byName: string | null; createdAt: number };
  lines: { productId: string; number: string; name: string; uom: string; level: number; sourceLabel: string; onHand: number; reserved: number; available: number; safetyStock: number; scheduledReceipts: number; grossRequirements: number; plannedQty: number; projectedEnd: number; leadTimeDays: number }[];
  suggestions: Suggestion[];
  can: { run: boolean; buy: boolean };
}
interface CapacityView { weeks: string[]; run: { number: string } | null; workCentres: (WorkCentre & { weeks: { week: string; availableHours: number; firmHours: number; plannedHours: number; loadHours: number; loadPct: number | null; overload: boolean; orders: string[] }[] })[]; note: string }

function PlanningPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Planning');
  const act = useAct(companyId);
  const mps = useQuery({ queryKey: ['erp', companyId, 'mps'], queryFn: () => get<{ entries: MpsEntry[]; note: string; can: { edit: boolean } }>(erpPath(companyId, '/mps')) });
  const run = useQuery({ queryKey: ['erp', companyId, 'mrp-latest'], queryFn: () => get<RunView>(erpPath(companyId, '/mrp/runs/latest')) });
  const cap = useQuery({ queryKey: ['erp', companyId, 'capacity'], queryFn: () => get<CapacityView>(erpPath(companyId, '/capacity?weeks=6')) });
  const [adding, setAdding] = useState(false);
  const [forecast, setForecast] = useState(false);
  const [showLines, setShowLines] = useState(false);
  const r = run.data;
  const sug = (s: Suggestion): ReactNode => {
    const canConvert = s.status === 'open' && s.kind !== 'expedite' && (s.kind === 'buy' ? r?.can.buy : r?.can.run);
    return (
      <tr key={s.id}>
        <td data-label="Suggestion"><span className={`badge${s.kind === 'expedite' ? ' warning' : s.kind === 'make' ? ' accent' : ''}`}>{s.kindLabel}</span> <Link to={productsPage(companyId, `/${s.productId}`)}><span className="mt-num">{s.productNumber}</span> {s.productName}</Link>{s.refNumber ? <div className="small">{s.refType === 'purchase_order' ? <Link to={procurementPage(companyId, `/purchase-orders/${s.refId}`)}>{s.refNumber}</Link> : <Link to={manufacturingPage(companyId, `/orders/${s.refId}`)}>{s.refNumber}</Link>}</div> : null}</td>
        <td data-label="Quantity" className="num">{qty(s.quantity)} <span className="muted small">{s.uom}</span></td>
        <td data-label="Needed">{dateText(s.needDate)}</td>
        <td data-label="Order or start by">{dateText(s.orderDate)}{s.leadTimeDays ? <span className="muted small"> ({s.leadTimeDays} days)</span> : null}</td>
        <td data-label="Messages"><Messages list={s.messages} /></td>
        <td data-label="Why" className="small">{s.reason}{s.supplierName ? ` · ${s.supplierName}` : ''}</td>
        <td className="erp-actions">
          {s.status === 'converted' ? <span className="small">{s.convertedType === 'requisition' ? <Link to={procurementPage(companyId, `/requisitions/${s.convertedId}`)}>{s.convertedNumber}</Link> : <Link to={manufacturingPage(companyId, `/orders/${s.convertedId}`)}>{s.convertedNumber}</Link>}</span> : s.status === 'dismissed' ? <span className="muted small">Dismissed</span> : null}
          {canConvert ? <button className="btn sm primary" onClick={() => void act(() => post(erpPath(companyId, `/mrp/suggestions/${s.id}/convert`), {}), s.kind === 'buy' ? 'Requisition raised' : 'Draft order made')}>{s.kind === 'buy' ? 'Raise requisition' : 'Make draft order'}</button> : null}
          {s.status === 'open' && (s.kind === 'buy' ? r?.can.buy : r?.can.run) ? <button className="btn sm ghost" onClick={() => void act(() => post(erpPath(companyId, `/mrp/suggestions/${s.id}/dismiss`), {}), 'Dismissed')}>Dismiss</button> : null}
        </td>
      </tr>
    );
  };
  return (
    <div className="stack">
      <Section title="Master production schedule" actions={<><CsvLink companyId={companyId} path="/mps?status=all" />{mps.data?.can.edit ? <button className="btn sm primary" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add demand</button> : null}</>}>
        <p className="muted small">{mps.data?.note ?? ''}</p>
        {!mps.data ? <Loading /> : !mps.data.entries.length ? <p className="muted small">No open demand. Add confirmed orders or forecasts for the products you make.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th className="num">Quantity</th><th>Due</th><th>Kind</th><th>Reference</th><th /></tr></thead>
              <tbody>{mps.data.entries.map((e) => <tr key={e.id}><td data-label="Product"><span className="mt-num">{e.productNumber}</span> {e.productName}</td><td data-label="Quantity" className="num">{qty(e.quantity)} <span className="muted small">{e.uom}</span></td><td data-label="Due">{dateText(e.dueDate)}</td><td data-label="Kind"><span className={`badge${e.kind === 'confirmed' ? ' success' : ''}`}>{e.kindLabel}</span></td><td data-label="Reference">{e.reference}</td><td className="erp-actions">{mps.data!.can.edit ? <><button className="btn sm" onClick={() => void act(() => patch(erpPath(companyId, `/mps/${e.id}`), { status: 'closed' }), 'Closed')}>Close</button> <button className="btn sm ghost" onClick={() => void act(() => patch(erpPath(companyId, `/mps/${e.id}`), { status: 'cancelled' }), 'Cancelled')}>Cancel</button></> : null}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </Section>
      <Section title="MRP" actions={<>{r?.run ? <CsvLink companyId={companyId} path={`/mrp/runs/${r.run.id}`} /> : null}{me.can['mrp.run'] ? <><label className="row small"><input type="checkbox" checked={forecast} onChange={(e) => setForecast(e.target.checked)} /> Include forecasts</label><button className="btn sm primary" onClick={() => void act(() => post(erpPath(companyId, '/mrp/runs'), { includeForecast: forecast }), 'MRP run')}><Icon name="refresh" size={14} /> Run MRP</button></> : null}</>}>
        {!r ? <Loading /> : !r.run ? <p className="muted small">MRP has not run yet. It plans from confirmed demand, stock less reservations, open purchase orders and manufacturing orders, the released bills of materials, lead times, reorder points and safety stock.</p> : (
          <>
            <p className="small"><strong>{r.run.number}</strong>, {dayText(r.run.createdAt)}{r.run.byName ? ` by ${r.run.byName}` : ''}: {r.run.summary.make ?? 0} to make, {r.run.summary.buy ?? 0} to buy, {r.run.summary.expedite ?? 0} to expedite; {r.run.summary.late ?? 0} late, {r.run.summary.overdue ?? 0} overdue. Horizon {r.run.horizonDays} days{r.run.includeForecast ? ', forecasts included' : ', confirmed demand only'}.</p>
            {!r.suggestions.length ? <p className="muted small">Nothing to suggest: demand is covered.</p> : (
              <div className="crm-table-scroll">
                <table className="data-table responsive">
                  <thead><tr><th>Suggestion</th><th className="num">Quantity</th><th>Needed</th><th>Order or start by</th><th>Messages</th><th>Why</th><th /></tr></thead>
                  <tbody>{r.suggestions.map(sug)}</tbody>
                </table>
              </div>
            )}
            <button type="button" className="btn sm ghost" aria-expanded={showLines} onClick={() => setShowLines((x) => !x)}>{showLines ? 'Hide' : 'Show'} the netting per product</button>
            {showLines ? (
              <div className="crm-table-scroll">
                <table className="data-table responsive">
                  <thead><tr><th>Product</th><th>Level</th><th>Source</th><th className="num">Available</th><th className="num">Safety</th><th className="num">Receipts</th><th className="num">Requirements</th><th className="num">Planned</th><th className="num">End</th><th className="num">Lead time</th></tr></thead>
                  <tbody>{r.lines.map((l) => <tr key={l.productId}><td data-label="Product"><span className="mt-num">{l.number}</span> {l.name}</td><td data-label="Level">{l.level}</td><td data-label="Source">{l.sourceLabel}</td><td data-label="Available" className="num">{qty(l.available)}{l.reserved ? <div className="muted small">{qty(l.reserved)} reserved</div> : null}</td><td data-label="Safety" className="num">{l.safetyStock ? qty(l.safetyStock) : ''}</td><td data-label="Receipts" className="num">{qty(l.scheduledReceipts)}</td><td data-label="Requirements" className="num">{qty(l.grossRequirements)}</td><td data-label="Planned" className="num">{qty(l.plannedQty)}</td><td data-label="End" className="num">{qty(l.projectedEnd)}</td><td data-label="Lead time" className="num">{l.leadTimeDays} d</td></tr>)}</tbody>
                </table>
              </div>
            ) : null}
          </>
        )}
      </Section>
      <Section title="Capacity" actions={<CsvLink companyId={companyId} path="/capacity?weeks=6" />}>
        {!cap.data ? <Loading /> : !cap.data.workCentres.length ? <p className="muted small">No work centres yet.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table erp-capacity">
              <thead><tr><th>Work centre</th>{cap.data.weeks.map((w) => <th key={w} className="num">Week of {dateText(w)}</th>)}</tr></thead>
              <tbody>{cap.data.workCentres.map((w) => <tr key={w.id}><th scope="row"><span className="mt-num">{w.code}</span> {w.name}</th>{w.weeks.map((x) => <td key={x.week} className={`num${x.overload ? ' erp-over' : ''}`} title={x.orders.join(', ')}>{hours(x.loadHours)} <span className="muted small">of {x.availableHours}</span>{x.overload ? <div><span className="badge danger">Overloaded {x.loadPct}%</span></div> : x.loadPct ? <div className="muted small">{x.loadPct}%</div> : null}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}
        <p className="muted small">{cap.data?.note} {cap.data?.run ? `Planned orders from ${cap.data.run.number} are included.` : ''}</p>
      </Section>
      <PlanningData companyId={companyId} canEdit={me.can['production.plan']} />
      {adding ? <MpsDialog companyId={companyId} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

function MpsDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const act = useAct(companyId);
  const products = useProductOptions(companyId);
  const [f, setF] = useState({ productId: '', quantity: '', dueDate: '', kind: 'confirmed', reference: '' });
  const save = async () => {
    if (await act(() => post(erpPath(companyId, '/mps'), { productId: f.productId, quantity: Number(f.quantity), dueDate: f.dueDate, kind: f.kind, reference: f.reference }), 'Demand added')) onClose();
  };
  return (
    <Modal title="Add demand to the schedule" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.productId || !(Number(f.quantity) > 0) || !f.dueDate} onClick={() => void save()}>Add</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="mp-p">Product</label><select id="mp-p" className="select" value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value })}><option value="">Choose a product</option>{(products.data?.products ?? []).filter((p) => p.type !== 'service').map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}</option>)}</select></div>
        <div className="field"><label htmlFor="mp-q">Quantity</label><input id="mp-q" className="input" type="number" min="0" step="any" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
        <div className="field"><label htmlFor="mp-d">Due</label><input id="mp-d" className="input" type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /></div>
        <div className="field"><label htmlFor="mp-k">Kind</label><select id="mp-k" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}><option value="confirmed">Confirmed (a customer order or a firm need)</option><option value="forecast">Forecast</option></select></div>
        <div className="field"><label htmlFor="mp-r">Reference (customer, job or order)</label><input id="mp-r" className="input" maxLength={200} value={f.reference} onChange={(e) => setF({ ...f, reference: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

function PlanningData({ companyId, canEdit }: { companyId: string; canEdit: boolean }) {
  const act = useAct(companyId);
  const products = useProductOptions(companyId);
  const [productId, setProductId] = useState('');
  const q = useQuery({ queryKey: ['erp', companyId, 'planning', productId], enabled: !!productId, queryFn: () => get<{ planning: { source: string; purchaseLeadDays: number | null; mfgLeadDays: number | null; safetyStock: number; minOrderQty: number | null; orderMultiple: number | null }; releasedRouting: { revision: string; leadTimeDays: number | null } | null }>(erpPath(companyId, `/products/${productId}/planning`)) });
  const [f, setF] = useState<Record<string, string> | null>(null);
  const p = q.data?.planning;
  const form = f ?? (p ? { source: p.source, purchaseLeadDays: p.purchaseLeadDays === null ? '' : String(p.purchaseLeadDays), mfgLeadDays: p.mfgLeadDays === null ? '' : String(p.mfgLeadDays), safetyStock: String(p.safetyStock), minOrderQty: p.minOrderQty === null ? '' : String(p.minOrderQty), orderMultiple: p.orderMultiple === null ? '' : String(p.orderMultiple) } : null);
  const num = (v: string) => (v.trim() === '' ? null : Number(v));
  const save = async () => {
    if (!form) return;
    if (await act(() => put(erpPath(companyId, `/products/${productId}/planning`), { source: form.source, purchaseLeadDays: num(form.purchaseLeadDays), mfgLeadDays: num(form.mfgLeadDays), safetyStock: Number(form.safetyStock || 0), minOrderQty: num(form.minOrderQty), orderMultiple: num(form.orderMultiple) }), 'Planning data saved')) setF(null);
  };
  return (
    <Section title="A product’s planning data">
      <div className="field"><label htmlFor="pd-p">Product</label><select id="pd-p" className="select" value={productId} onChange={(e) => { setProductId(e.target.value); setF(null); }}><option value="">Choose a product</option>{(products.data?.products ?? []).filter((x) => x.type !== 'service').map((x) => <option key={x.id} value={x.id}>{x.number} {x.name}</option>)}</select></div>
      {productId && form ? (
        <>
          <div className="form-grid">
            <div className="field"><label htmlFor="pd-s">Made or bought</label><select id="pd-s" className="select" disabled={!canEdit} value={form.source} onChange={(e) => setF({ ...form, source: e.target.value })}><option value="">Worked out (made when it has a released bill of materials and routing)</option><option value="make">Made</option><option value="buy">Bought</option></select></div>
            <div className="field"><label htmlFor="pd-ss">Safety stock</label><input id="pd-ss" className="input" type="number" min="0" step="any" disabled={!canEdit} value={form.safetyStock} onChange={(e) => setF({ ...form, safetyStock: e.target.value })} /></div>
            <div className="field"><label htmlFor="pd-pl">Purchase lead time (days; a product supplier’s comes first)</label><input id="pd-pl" className="input" type="number" min="0" disabled={!canEdit} value={form.purchaseLeadDays} onChange={(e) => setF({ ...form, purchaseLeadDays: e.target.value })} /></div>
            <div className="field"><label htmlFor="pd-ml">Manufacturing lead time (days; the routing’s comes first)</label><input id="pd-ml" className="input" type="number" min="0" disabled={!canEdit} value={form.mfgLeadDays} onChange={(e) => setF({ ...form, mfgLeadDays: e.target.value })} /></div>
            <div className="field"><label htmlFor="pd-mo">Minimum order</label><input id="pd-mo" className="input" type="number" min="0" step="any" disabled={!canEdit} value={form.minOrderQty} onChange={(e) => setF({ ...form, minOrderQty: e.target.value })} /></div>
            <div className="field"><label htmlFor="pd-om">Order multiple</label><input id="pd-om" className="input" type="number" min="0" step="any" disabled={!canEdit} value={form.orderMultiple} onChange={(e) => setF({ ...form, orderMultiple: e.target.value })} /></div>
          </div>
          <p className="muted small">{q.data?.releasedRouting ? `Released routing: revision ${q.data.releasedRouting.revision}${q.data.releasedRouting.leadTimeDays !== null ? `, ${q.data.releasedRouting.leadTimeDays} days` : ''}.` : 'No released routing.'} Reorder points, minimums and maximums are in Inventory, on the product’s stock page.</p>
          {canEdit ? <div className="row"><div className="grow" /><button className="btn primary" onClick={() => void save()}>Save</button></div> : null}
        </>
      ) : null}
    </Section>
  );
}
