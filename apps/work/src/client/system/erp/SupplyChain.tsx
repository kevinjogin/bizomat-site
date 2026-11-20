// BIZOMAT ERP, Release 5 part A: Supply Chain at /erp/c/<company>/supply-chain: the hub (what waits), sales orders for
// the company's one customer record (allocation, make to order, amendments), the pick-and-dispatch queue and each
// shipment's screen made for a phone (pick, pack, dispatch, delivery confirmation with a photo, signature or document),
// shipments, the delivery schedule, returns and carriers. The server decides what each person may do; the screens only
// show it (src/worker/erp/sales.ts, logistics.ts, returns.ts).
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiError, api, get, patch, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { toolUrl } from '../../lib/base';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import {
  PACKAGE_KINDS,
  RMA_REASONS,
  RMA_STATUS,
  SHIPMENT_STATUS,
  SO_STATUS,
  dateText,
  dayText,
  dollars,
  erpPath,
  manufacturingPage,
  money,
  qty,
  qualityPage,
  reportPage,
  supplyPage,
  toCents,
  useCarriers,
  useErpMe,
  useSalesOrderOptions,
  type Carrier,
  type ErpMe,
  type Rma,
  type RmaView,
  type SalesOrder,
  type SalesOrderView,
  type Shipment,
  type ShipmentView,
  type SupplyCounts,
} from './api';
import { CsvLink, FilterPanel, History, Pager, Props, RecordUpload, Section, options, requestKey, useAct } from './common';
import { useListParams } from './Purchasing';

const tone = (map: Record<string, string>, v: string) => map[v] ?? '';
const SO_TONE: Record<string, string> = { draft: '', confirmed: 'accent', partially_allocated: 'warning', allocated: 'accent', partially_shipped: 'warning', shipped: 'success', invoiced: 'success', closed: '', cancelled: 'danger' };
const SHP_TONE: Record<string, string> = { planned: '', picking: 'warning', picked: 'accent', packed: 'accent', dispatched: 'warning', delivered: 'success', cancelled: 'danger' };
const RMA_TONE: Record<string, string> = { requested: 'warning', authorised: 'accent', received: 'success', closed: '', rejected: 'danger', cancelled: '' };
export const SoBadge = ({ value }: { value: string }) => <span className={`badge ${tone(SO_TONE, value)}`}>{SO_STATUS[value as keyof typeof SO_STATUS] ?? value}</span>;
export const ShipmentBadge = ({ value }: { value: string }) => <span className={`badge ${tone(SHP_TONE, value)}`}>{SHIPMENT_STATUS[value as keyof typeof SHIPMENT_STATUS] ?? value}</span>;
const RmaBadge = ({ value }: { value: string }) => <span className={`badge ${tone(RMA_TONE, value)}`}>{RMA_STATUS[value as keyof typeof RMA_STATUS] ?? value}</span>;
const windowText = (s: Pick<Shipment, 'windowStart' | 'windowEnd' | 'plannedDate'>) => (s.windowStart && s.windowEnd ? (s.windowStart === s.windowEnd ? dateText(s.windowStart) : `${dateText(s.windowStart)} to ${dateText(s.windowEnd)}`) : dateText(s.windowEnd ?? s.windowStart ?? s.plannedDate));
const financeUrl = (url: string | null) => (url ? toolUrl(url) : null);

export function SupplyChainArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const me = useErpMe(companyId);
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Supply Chain" />
          <section className="co-prompt"><p>You do not have access to the supply chain of {companyName}. People in the company have access; people who only share a tool with it do not.</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening Supply Chain…" />;
  const m = me.data;
  const tab = (to: string, icon: Parameters<typeof Icon>[0]['name'], text: string, end = false) => (
    <NavLink to={supplyPage(companyId, to)} end={end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name={icon} size={14} /> {text}</NavLink>
  );
  return (
    <div className="page crm-page">
      <PageHeader title="Orders and dispatch" subtitle={`Warehouse: the sales orders, shipments and returns of ${m.company.name}, from the customer’s order to its delivery and the draft invoice in Finance.`} />
      <nav className="tabs mt-tabs erp-area-tabs" aria-label="Supply chain sections">
        {tab('', 'home', 'Overview', true)}
        {tab('/orders', 'briefcase', 'Sales orders')}
        {tab('/floor', 'check', 'Pick and dispatch')}
        {tab('/shipments', 'globe', 'Shipments')}
        {tab('/schedule', 'calendar', 'Delivery schedule')}
        {tab('/returns', 'refresh', 'Returns')}
        {tab('/carriers', 'map', 'Carriers')}
      </nav>
      <Routes>
        <Route index element={<Overview companyId={companyId} me={m} />} />
        <Route path="orders" element={<OrdersPage companyId={companyId} me={m} />} />
        <Route path="orders/new" element={<OrderEditor companyId={companyId} />} />
        <Route path="orders/:id" element={<OrderDetail companyId={companyId} />} />
        <Route path="orders/:id/edit" element={<OrderEditor companyId={companyId} />} />
        <Route path="floor" element={<Floor companyId={companyId} />} />
        <Route path="shipments" element={<ShipmentsPage companyId={companyId} />} />
        <Route path="shipments/:id" element={<ShipmentDetail companyId={companyId} />} />
        <Route path="schedule" element={<Schedule companyId={companyId} />} />
        <Route path="returns" element={<ReturnsPage companyId={companyId} />} />
        <Route path="returns/:id" element={<ReturnDetail companyId={companyId} />} />
        <Route path="carriers" element={<CarriersPage companyId={companyId} me={m} />} />
        <Route path="*" element={<Navigate to={supplyPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

// ------------------------------------------------------------------ the hub

function Overview({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Supply Chain');
  const q = useQuery({ queryKey: ['erp', companyId, 'supply-overview'], queryFn: () => get<{ counts: SupplyCounts; empty: boolean; carriers: number; can: Record<string, boolean> }>(erpPath(companyId, '/supply-chain/overview')) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const c = q.data.counts;
  const stat = (n: number, text: string, to: string, warn = false) => (
    <Link to={supplyPage(companyId, to)} className="card card-pad erp-stat">
      <strong className={warn && n ? 'erp-neg' : ''}>{n}</strong>
      <span className="muted small">{text}</span>
    </Link>
  );
  return (
    <div className="stack">
      <div className="erp-stats">
        {stat(c.ordersDraft, 'Orders to confirm', '/orders?status=draft')}
        {stat(c.ordersToAllocate, 'Orders to allocate', '/orders?status=confirmed')}
        {stat(c.ordersLate, 'Orders late', '/orders?late=1', true)}
        {stat(c.toPick, 'Shipments to pick', '/floor')}
        {stat(c.toPack, 'Shipments to pack', '/floor')}
        {stat(c.toDispatch, 'Shipments to dispatch', '/floor')}
        {stat(c.inTransit, 'In transit', '/shipments?status=dispatched')}
        {stat(c.toInvoice, 'Shipments to invoice', '/shipments?uninvoiced=1')}
        {stat(c.returnsToAuthorise, 'Returns to authorise', '/returns?status=requested')}
        {stat(c.returnsToReceive, 'Returns to receive', '/returns?status=authorised')}
      </div>
      <div className="row wrap">
        <div className="grow" />
        <Link className="btn" to={reportPage(companyId, 'open-orders')}><Icon name="chart" /> Supply chain reports</Link>
        {me.can['carriers.setup'] ? <Link className="btn" to={supplyPage(companyId, '/carriers')}><Icon name="map" /> Carriers</Link> : null}
        {me.can['sales.edit'] ? <Link className="btn primary" to={supplyPage(companyId, '/orders/new')}><Icon name="plus" /> New sales order</Link> : null}
      </div>
      {q.data.empty ? (
        <Section title="How the supply chain works">
          <ol className="small">
            <li>A sales manager makes a sales order for a customer: a CRM company and the Finance customer it is billed as. Nothing about the customer is copied.</li>
            <li>The order is confirmed, and its stock is allocated (soonest expiry first, then the oldest). A line can be made to order: a production manager makes a manufacturing order from it.</li>
            <li>A shipment carries the allocated stock. The warehouse picks it, packs it into packages and dispatches it, from a phone.</li>
            <li>The delivery is confirmed with who received it, and a photo, signature or document.</li>
            <li>A sales manager asks Finance for the draft invoice: once per shipment, with the freight charge.</li>
            <li>Returns are authorised by a sales manager, received back into stock (into quarantine to inspect them), and credited in Finance.</li>
          </ol>
          {!q.data.carriers && me.can['carriers.setup'] ? <p className="small">Start with a carrier, then a sales order.</p> : null}
        </Section>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ sales orders: list

function OrdersPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Sales orders');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'sort', 'late']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'sales-orders', filters.toString(), offset], queryFn: () => get<{ orders: SalesOrder[]; total: number }>(erpPath(companyId, `/sales-orders?${filters}&limit=${limit}&offset=${offset}`)) });
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/sales-orders?${filters}`} />
        {me.can['sales.edit'] ? <Link className="btn primary" to={supplyPage(companyId, '/orders/new')}><Icon name="plus" /> New sales order</Link> : null}
      </div>
      <FilterPanel active={['q', 'status', 'late'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="so-q">Search</label><input id="so-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, customer, their order number or product" /></div>
        <div className="field"><label htmlFor="so-s">Status</label><select id="so-s" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Every status</option><option value="open">Open (confirmed, not shipped in full)</option>{options(SO_STATUS)}</select></div>
        <div className="field"><label htmlFor="so-l">Late</label><select id="so-l" className="select" value={g('late')} onChange={(e) => set('late', e.target.value)}><option value="">Any</option><option value="1">Late only</option></select></div>
        <div className="field"><label htmlFor="so-o">Sort by</label><select id="so-o" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Newest</option><option value="due">Due date</option><option value="customer">Customer</option><option value="total">Total</option><option value="number">Number</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.orders.length ? (
          <EmptyState icon="briefcase" title={filters.toString() ? 'Nothing matches' : 'No sales orders yet'}>
            {filters.toString() ? 'Change the filters to see more.' : 'A sales order is made for a customer of the company’s CRM and Finance. Confirm it, allocate its stock and ship it.'}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Due</th><th className="num">Total</th></tr></thead>
              <tbody>
                {list.data.orders.map((o) => (
                  <tr key={o.id}>
                    <td data-label="Order"><Link className="mt-primary" to={supplyPage(companyId, `/orders/${o.id}`)}><span className="mt-num">{o.number}</span></Link>{o.customerPo ? <div className="muted small">Their order {o.customerPo}</div> : null}</td>
                    <td data-label="Customer">{o.customerName}{o.contactName ? <div className="muted small">{o.contactName}</div> : null}</td>
                    <td data-label="Status"><SoBadge value={o.status} />{o.late ? <span className="badge danger">Late</span> : null}</td>
                    <td data-label="Due">{dateText(o.promisedDate ?? o.requestedDate)}</td>
                    <td data-label="Total" className="num">{money(o.totalCents, o.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(x) => set('offset', x ? String(x) : '')} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ sales orders: the editor (new, draft, amendment)

interface LineDraft {
  id?: string;
  productId: string;
  description: string;
  quantity: string;
  price: string;
  discount: string;
  taxCode: string;
  promisedDate: string;
  fulfil: 'stock' | 'make';
  /** Where the suggested price came from (the price lists and promotions). */
  note?: string;
}

function OrderEditor({ companyId }: { companyId: string }) {
  const { id } = useParams();
  const opts = useSalesOrderOptions(companyId);
  const existing = useQuery({ queryKey: ['erp', companyId, 'sales-order', id], queryFn: () => get<SalesOrderView>(erpPath(companyId, `/sales-orders/${id}`)), enabled: !!id });
  usePageTitle(id ? 'Change a sales order' : 'New sales order');
  if (opts.error) return <ErrorBox error={opts.error} retry={() => opts.refetch()} />;
  if (!opts.data || (id && !existing.data)) return <Loading />;
  return <OrderForm companyId={companyId} opts={opts.data} view={existing.data ?? null} />;
}

function OrderForm({ companyId, opts, view }: { companyId: string; opts: NonNullable<ReturnType<typeof useSalesOrderOptions>['data']>; view: SalesOrderView | null }) {
  const navigate = useNavigate();
  const act = useAct(companyId);
  const o = view?.order;
  const amend = !!o && o.status !== 'draft';
  const companies = opts.crm.flatMap((x) => x.companies);
  const [cust, setCust] = useState(o ? (o.crmCompanyId ? `crm:${o.crmCompanyId}` : `fin:${o.finContactId}`) : '');
  const [contactId, setContactId] = useState(o?.crmContactId ?? '');
  const [billedAs, setBilledAs] = useState(o?.finContactId ?? '');
  const [h, setH] = useState({ requestedDate: o?.requestedDate ?? '', promisedDate: o?.promisedDate ?? '', customerPo: o?.customerPo ?? '', shippingTerms: o?.shippingTerms ?? '', deliveryAddress: o?.deliveryAddress ?? '', notes: o?.notes ?? '', reason: '' });
  const blank = (): LineDraft => ({ productId: '', description: '', quantity: '1', price: '', discount: '', taxCode: opts.defaultTaxCode, promisedDate: '', fulfil: 'stock' });
  const [lines, setLines] = useState<LineDraft[]>(view ? view.lines.map((l) => ({ id: l.id, productId: l.productId, description: l.description, quantity: String(l.quantity), price: dollars(l.unitPriceCents), discount: l.discountBp ? String(l.discountBp / 100) : '', taxCode: l.taxCode, promisedDate: l.promisedDate ?? '', fulfil: l.fulfil })) : [blank()]);
  const [busy, setBusy] = useState(false);
  const chosen = cust.startsWith('crm:') ? companies.find((x) => x.id === cust.slice(4)) : null;
  const setLine = (i: number, patch_: Partial<LineDraft>) => setLines(lines.map((l, j) => (j === i ? { ...l, ...patch_ } : l)));
  // The price the price lists and promotions give for this customer and quantity (the server's rule, pricing.ts).
  const suggestPrice = async (i: number, productId: string, quantity: string) => {
    if (!productId) return;
    const refs = [cust, chosen?.finContactId ? `fin:${chosen.finContactId}` : ''].filter(Boolean).join(',');
    try {
      const s = await get<{ unitPriceCents: number | null; discountBp: number; note: string }>(erpPath(companyId, `/sales-orders/price?productId=${encodeURIComponent(productId)}&customer=${encodeURIComponent(refs)}&qty=${encodeURIComponent(quantity || '1')}`));
      setLines((all) => all.map((l, j) => (j === i && l.productId === productId ? { ...l, ...(s.unitPriceCents !== null ? { price: dollars(s.unitPriceCents), discount: s.discountBp ? String(s.discountBp / 100) : '' } : {}), note: s.note } : l)));
    } catch {
      // the product's standard price stays
    }
  };
  const pickProduct = (i: number, productId: string) => {
    const p = opts.products.find((x) => x.id === productId);
    setLine(i, { productId, price: p?.priceCents !== null && p?.priceCents !== undefined ? dollars(p.priceCents) : lines[i].price, note: undefined });
    void suggestPrice(i, productId, lines[i].quantity);
  };
  const bad = lines.some((l) => !l.productId || !(Number(l.quantity) > 0) || toCents(l.price) === 'bad' || toCents(l.price) === null) || !cust || (amend && !h.reason.trim());
  const estimate = lines.reduce((s, l) => {
    const c = toCents(l.price);
    return s + (typeof c === 'number' ? Math.round(c * Number(l.quantity || 0) * (1 - (Number(l.discount) || 0) / 100)) : 0);
  }, 0);
  const save = async (confirm: boolean) => {
    setBusy(true);
    const body = {
      ...(amend ? {} : cust.startsWith('crm:') ? { crmCompanyId: cust.slice(4), crmContactId: contactId || null, finContactId: opts.linkKind === 'separate' ? billedAs || null : undefined } : { finContactId: cust.slice(4), crmCompanyId: null }),
      requestedDate: h.requestedDate || null,
      promisedDate: h.promisedDate || null,
      customerPo: h.customerPo,
      shippingTerms: h.shippingTerms,
      deliveryAddress: h.deliveryAddress,
      notes: h.notes,
      lines: lines.map((l) => ({ id: l.id, productId: l.productId, description: l.description, quantity: Number(l.quantity), unitPriceCents: toCents(l.price) as number, discountBp: Math.round((Number(l.discount) || 0) * 100), taxCode: l.taxCode, promisedDate: l.promisedDate || null, fulfil: l.fulfil })),
    };
    const r = (await act(
      () => (o ? (amend ? post(erpPath(companyId, `/sales-orders/${o.id}/amend`), { ...body, reason: h.reason }) : put(erpPath(companyId, `/sales-orders/${o.id}`), body)) : post<{ id: string }>(erpPath(companyId, '/sales-orders'), { ...body, confirm })),
      o ? (amend ? 'Order amended' : 'Order saved') : confirm ? 'Order made and confirmed' : 'Draft order made',
    )) as { id?: string } | null;
    setBusy(false);
    if (r) navigate(supplyPage(companyId, `/orders/${o?.id ?? r.id}`));
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={supplyPage(companyId, '/orders')}>Sales orders</Link><span className="sep">/</span><span>{o ? `${amend ? 'Amend' : 'Change'} ${o.number}` : 'New sales order'}</span></div>
      <Section title="Customer">
        {amend ? <p>{o!.customerName}{o!.contactName ? `, ${o!.contactName}` : ''} <span className="muted small">(the customer of a confirmed order does not change)</span></p> : (
          <div className="form-grid">
            <div className="field span-2">
              <label htmlFor="so-cust">Customer</label>
              <select id="so-cust" className="select" value={cust} onChange={(e) => { setCust(e.target.value); setContactId(''); }}>
                <option value="">Choose the customer</option>
                {companies.length ? <optgroup label="CRM companies">{companies.map((x) => <option key={x.id} value={`crm:${x.id}`}>{x.name}</option>)}</optgroup> : null}
                {opts.finance?.contacts.length ? <optgroup label="Finance customers">{opts.finance.contacts.filter((x) => opts.linkKind === 'separate' || !companies.some((cc) => cc.finContactId === x.id)).map((x) => <option key={x.id} value={`fin:${x.id}`}>{x.name}</option>)}</optgroup> : null}
              </select>
            </div>
            {chosen ? (
              <>
                <div className="field"><label htmlFor="so-ct">Contact</label><select id="so-ct" className="select" value={contactId} onChange={(e) => setContactId(e.target.value)}><option value="">None</option>{chosen.contacts.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
                {opts.linkKind === 'separate' ? (
                  <div className="field"><label htmlFor="so-bill">Billed as in Finance</label><select id="so-bill" className="select" value={billedAs} onChange={(e) => setBilledAs(e.target.value)}><option value="">Not chosen (needed to invoice)</option>{opts.finance?.contacts.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
                ) : (
                  <p className="small field">{chosen.finContactId ? `Billed in Finance as ${opts.finance?.contacts.find((x) => x.id === chosen.finContactId)?.name ?? 'its linked customer'}.` : 'Not linked to a Finance customer yet: link it in the CRM (In Finance) before invoicing.'}</p>
                )}
              </>
            ) : null}
          </div>
        )}
        <p className="muted small">{opts.note}</p>
        {!opts.crm.some((x) => x.access) && !opts.finance?.access ? <p className="small erp-neg">You have no access to the company’s CRM or Finance customers, so you cannot choose a customer.</p> : null}
      </Section>
      <Section title="Order">
        <div className="form-grid">
          <div className="field"><label htmlFor="so-req">Requested by the customer</label><input id="so-req" className="input" type="date" value={h.requestedDate} onChange={(e) => setH({ ...h, requestedDate: e.target.value })} /></div>
          <div className="field"><label htmlFor="so-pro">Promised</label><input id="so-pro" className="input" type="date" value={h.promisedDate} onChange={(e) => setH({ ...h, promisedDate: e.target.value })} /></div>
          <div className="field"><label htmlFor="so-po">Customer’s order number</label><input id="so-po" className="input" maxLength={100} value={h.customerPo} onChange={(e) => setH({ ...h, customerPo: e.target.value })} /></div>
          <div className="field"><label htmlFor="so-terms">Shipping terms</label><input id="so-terms" className="input" maxLength={200} value={h.shippingTerms} onChange={(e) => setH({ ...h, shippingTerms: e.target.value })} placeholder="For example: delivered to site" /></div>
          <div className="field span-2"><label htmlFor="so-addr">Delivery address</label><textarea id="so-addr" className="textarea" rows={2} maxLength={500} value={h.deliveryAddress} onChange={(e) => setH({ ...h, deliveryAddress: e.target.value })} placeholder={chosen?.address || 'The customer’s address when left empty'} /></div>
          <div className="field span-2"><label htmlFor="so-notes">Notes</label><textarea id="so-notes" className="textarea" rows={2} maxLength={4000} value={h.notes} onChange={(e) => setH({ ...h, notes: e.target.value })} /></div>
        </div>
      </Section>
      <Section title="Lines">
        {opts.taxNote ? <p className="small">{opts.taxNote}</p> : null}
        <div className="stack">
          {lines.map((l, i) => (
            <fieldset key={l.id ?? i} className="card card-pad erp-receive-line">
              <legend className="small">Line {i + 1}</legend>
              <div className="form-grid">
                <div className="field span-2"><label htmlFor={`sl-p-${i}`}>Product</label><select id={`sl-p-${i}`} className="select" value={l.productId} onChange={(e) => pickProduct(i, e.target.value)}><option value="">Choose a product</option>{opts.products.map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}</option>)}</select></div>
                <div className="field"><label htmlFor={`sl-q-${i}`}>Quantity</label><input id={`sl-q-${i}`} className="input" type="number" min="0" step="any" inputMode="decimal" value={l.quantity} onChange={(e) => setLine(i, { quantity: e.target.value })} onBlur={() => void suggestPrice(i, l.productId, l.quantity)} /></div>
                <div className="field"><label htmlFor={`sl-pr-${i}`}>Unit price ({opts.currency})</label><input id={`sl-pr-${i}`} className="input" inputMode="decimal" value={l.price} onChange={(e) => setLine(i, { price: e.target.value, note: undefined })} />{l.note ? <span className="muted small">{l.note}</span> : null}</div>
                <div className="field"><label htmlFor={`sl-d-${i}`}>Discount %</label><input id={`sl-d-${i}`} className="input" type="number" min="0" max="100" step="any" value={l.discount} onChange={(e) => setLine(i, { discount: e.target.value })} /></div>
                <div className="field"><label htmlFor={`sl-t-${i}`}>Tax code</label><select id={`sl-t-${i}`} className="select" value={l.taxCode} onChange={(e) => setLine(i, { taxCode: e.target.value })}>{opts.taxCodes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                <div className="field"><label htmlFor={`sl-f-${i}`}>Fulfil</label><select id={`sl-f-${i}`} className="select" value={l.fulfil} onChange={(e) => setLine(i, { fulfil: e.target.value as 'stock' | 'make' })}><option value="stock">From stock</option><option value="make">Make to order</option></select></div>
                <div className="field"><label htmlFor={`sl-pd-${i}`}>Promised (this line)</label><input id={`sl-pd-${i}`} className="input" type="date" value={l.promisedDate} onChange={(e) => setLine(i, { promisedDate: e.target.value })} /></div>
                <div className="field span-2"><label htmlFor={`sl-de-${i}`}>Description</label><input id={`sl-de-${i}`} className="input" maxLength={1000} value={l.description} onChange={(e) => setLine(i, { description: e.target.value })} placeholder="The product’s name when left empty" /></div>
              </div>
              {lines.length > 1 ? <div className="row"><button type="button" className="btn sm" onClick={() => setLines(lines.filter((_, j) => j !== i))}><Icon name="trash" size={14} /> Remove the line</button></div> : null}
            </fieldset>
          ))}
          <div className="row wrap">
            <button type="button" className="btn" onClick={() => setLines([...lines, blank()])}><Icon name="plus" /> Add a line</button>
            <span className="grow" />
            <span className="small">About {money(estimate, opts.currency)} before tax. The totals are worked out on saving, as Finance prices lines.</span>
          </div>
        </div>
      </Section>
      {amend ? <Section title="Why it changes"><div className="field"><label htmlFor="so-reason">Reason</label><input id="so-reason" className="input" maxLength={500} value={h.reason} onChange={(e) => setH({ ...h, reason: e.target.value })} /></div><p className="muted small">The order as it is now is kept in its history.</p></Section> : null}
      <div className="row wrap">
        <span className="grow" />
        <Link className="btn" to={o ? supplyPage(companyId, `/orders/${o.id}`) : supplyPage(companyId, '/orders')}>Cancel</Link>
        {!o ? <button className="btn" disabled={busy || bad} onClick={() => void save(false)}>Save as a draft</button> : null}
        <button className="btn primary" disabled={busy || bad} onClick={() => void save(!o)}>{busy ? 'Saving…' : o ? (amend ? 'Amend the order' : 'Save') : 'Save and confirm'}</button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ sales orders: one order

type OrderDialog = null | 'ship' | 'return' | 'cancel' | 'close';

function OrderDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'sales-order', id], queryFn: () => get<SalesOrderView>(erpPath(companyId, `/sales-orders/${id}`)), retry: false });
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<OrderDialog>(null);
  usePageTitle(q.data ? q.data.order.number : 'Sales order');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const o = v.order;
  const canMake = (l: SalesOrderView['lines'][number]) => v.can.make && l.quantity - l.shippedQty - l.allocatedQty - l.makingQty > 1e-9;
  return (
    <div className="stack">
      <div className="mt-path"><Link to={supplyPage(companyId, '/orders')}>Sales orders</Link><span className="sep">/</span><span>{o.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{o.number}</span> {o.customerName}</h2>
          <div className="mt-badges"><SoBadge value={o.status} />{o.late ? <span className="badge danger">Late</span> : null}{o.revision > 1 ? <span className="badge">Revision {o.revision}</span> : null}</div>
        </div>
        <div className="mt-head-actions row wrap">
          {v.can.edit ? <Link className="btn" to={supplyPage(companyId, `/orders/${o.id}/edit`)}><Icon name="edit" /> Change</Link> : null}
          {v.can.confirm ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/sales-orders/${o.id}/confirm`)), 'Order confirmed')}>Confirm</button> : null}
          {v.can.allocate && v.lines.some((l) => l.toAllocateQty > 0) ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/sales-orders/${o.id}/allocate`), { requestKey: requestKey() }), 'Allocation done')}>Allocate stock</button> : null}
          {v.can.allocate && v.lines.some((l) => l.allocatedQty > 0) ? <button className="btn" onClick={() => void act(() => post(erpPath(companyId, `/sales-orders/${o.id}/deallocate`)), 'Allocation released')}>Release the allocation</button> : null}
          {v.can.ship && v.lines.some((l) => l.allocations.some((x) => x.quantity - x.onShipment > 1e-9)) ? <button className="btn" onClick={() => setDialog('ship')}><Icon name="globe" /> Plan a shipment</button> : null}
          {v.can.amend ? <Link className="btn" to={supplyPage(companyId, `/orders/${o.id}/edit`)}>Amend</Link> : null}
          {v.can.returns ? <button className="btn" onClick={() => setDialog('return')}>Record a return</button> : null}
          {v.can.close ? <button className="btn" onClick={() => setDialog('close')}>Close</button> : null}
          {v.can.cancel ? <button className="btn" onClick={() => setDialog('cancel')}>Cancel the order</button> : null}
        </div>
      </div>
      <Section title="Order">
        <Props
          items={[
            ['Customer', o.customerName],
            ['Contact', o.contactName],
            ['Customer’s order number', o.customerPo],
            ['Order date', dateText(o.orderDate)],
            ['Requested', dateText(o.requestedDate)],
            ['Promised', dateText(o.promisedDate)],
            ['Delivery address', o.deliveryAddress],
            ['Shipping terms', o.shippingTerms],
            ['Subtotal', money(o.subtotalCents, o.currency)],
            ['Tax', money(o.taxCents, o.currency)],
            ['Total', money(o.totalCents, o.currency)],
            ['Confirmed', o.confirmedAt ? `${dayText(o.confirmedAt)} by ${o.confirmedByName ?? ''}` : ''],
            ['From a won deal in the CRM', o.crmDealId && o.crmOrgId ? <a href={toolUrl(`/crm/o/${o.crmOrgId}/deals/${o.crmDealId}`)}>Open the deal</a> : ''],
            ['Customer in the CRM', o.crmCompanyId && o.crmOrgId ? <a href={toolUrl(`/crm/o/${o.crmOrgId}/companies/${o.crmCompanyId}`)}>Open the company</a> : ''],
            ['Cancelled', o.cancelReason],
            ['Closed', o.closeReason],
            ['Notes', o.notes],
          ]}
        />
        {v.finance.note ? <p className="small">{v.finance.note}</p> : null}
      </Section>
      <Section title="Lines">
        <div className="crm-table-scroll">
          <table className="data-table responsive erp-lines">
            <thead><tr><th>Product</th><th className="num">Ordered</th><th className="num">Allocated</th><th className="num">Shipped</th><th className="num">Returned</th><th className="num">Available</th><th className="num">Short</th><th className="num">Price</th><th className="num">Before tax</th><th /></tr></thead>
            <tbody>
              {v.lines.map((l) => (
                <tr key={l.id}>
                  <td data-label="Product">
                    <strong>{l.productNumber}</strong> {l.description}
                    <div className="muted small">{l.fulfilLabel}{l.promisedDate ? `, promised ${dateText(l.promisedDate)}` : ''}</div>
                    {l.allocations.length ? <div className="small">{l.allocations.map((x) => `${qty(x.quantity)} at ${x.location}${x.lot ? ` lot ${x.lot}` : ''}${x.serial ? ` serial ${x.serial}` : ''}`).join('; ')}</div> : null}
                    {l.manufacturingOrders.map((m) => <div key={m.id} className="small"><Link to={manufacturingPage(companyId, `/orders/${m.id}`)}>{m.number}</Link> {m.statusLabel.toLowerCase()}: {qty(m.quantity)} made to order, {qty(m.completedQty)} done</div>)}
                  </td>
                  <td data-label="Ordered" className="num">{qty(l.quantity)} {l.uom}</td>
                  <td data-label="Allocated" className="num">{qty(l.allocatedQty)}</td>
                  <td data-label="Shipped" className="num">{qty(l.shippedQty)}</td>
                  <td data-label="Returned" className="num">{l.returnedQty ? qty(l.returnedQty) : ''}</td>
                  <td data-label="Available" className="num">{qty(l.availableQty)}</td>
                  <td data-label="Short" className={`num${l.shortQty ? ' erp-neg' : ''}`}>{l.shortQty ? qty(l.shortQty) : ''}</td>
                  <td data-label="Price" className="num">{money(l.unitPriceCents, o.currency)}{l.discountBp ? <div className="muted small">less {l.discountBp / 100}%</div> : null}{l.priceNote ? <div className="muted small">{l.priceNote}</div> : null}</td>
                  <td data-label="Before tax" className="num">{money(l.netCents, o.currency)}</td>
                  <td className="erp-actions">{canMake(l) ? <button className="btn sm" onClick={async () => { const r = (await act(() => post<{ id: string }>(erpPath(companyId, `/sales-orders/${o.id}/lines/${l.id}/make`), { requestKey: requestKey() }), 'Manufacturing order made')) as { id: string } | null; if (r && typeof r === 'object') navigate(manufacturingPage(companyId, `/orders/${r.id}`)); }}>Make to order</button> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Shipments">
        {!v.shipments.length ? <p className="muted small">No shipment yet. Allocate the stock, then plan a shipment.</p> : (
          <ul className="erp-list">{v.shipments.map((s) => <li key={s.id} className="small"><Link className="mt-num" to={supplyPage(companyId, `/shipments/${s.id}`)}>{s.number}</Link> <ShipmentBadge value={s.status} /> {s.carrierName ?? 'No carrier'}{s.trackingNumber ? `, tracking ${s.trackingNumber}` : ''}{s.plannedDate ? `, planned ${dateText(s.plannedDate)}` : ''}{s.invoice?.status === 'done' ? <span className="badge success">Invoice drafted</span> : null}</li>)}</ul>
        )}
      </Section>
      {v.returns.length ? <Section title="Returns"><ul className="erp-list">{v.returns.map((r) => <li key={r.id} className="small"><Link className="mt-num" to={supplyPage(companyId, `/returns/${r.id}`)}>{r.number}</Link> <RmaBadge value={r.status} /> {RMA_REASONS[r.reason as keyof typeof RMA_REASONS] ?? r.reason}</li>)}</ul></Section> : null}
      {v.revisions.length ? (
        <Section title="Earlier versions">
          <ul className="erp-versions">{v.revisions.map((r) => <li key={r.revision} className="small"><strong>Revision {r.revision}</strong> changed {dayText(r.changedAt)} by {r.byName ?? 'someone'}: {r.reason}{r.snapshot.lines ? <div className="muted">{r.snapshot.lines.map((l) => `${l.product} x ${qty(l.quantity)}`).join(', ')}</div> : null}</li>)}</ul>
        </Section>
      ) : null}
      <Section title="Files" actions={v.can.edit || v.can.amend ? <RecordUpload companyId={companyId} kind="sales_order" id={o.id} onDone={() => void q.refetch()} /> : undefined}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a></li>)}</ul> : <p className="muted small">No files.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {dialog === 'ship' ? <ShipDialog companyId={companyId} order={o} onClose={() => setDialog(null)} /> : null}
      {dialog === 'return' ? <ReturnDialog companyId={companyId} view={v} onClose={() => setDialog(null)} /> : null}
      {dialog === 'cancel' || dialog === 'close' ? <ReasonDialog title={dialog === 'cancel' ? `Cancel ${o.number}` : `Close ${o.number}`} label={dialog === 'cancel' ? 'Why is it cancelled?' : 'Why is it closed? (needed when not everything is shipped)'} button={dialog === 'cancel' ? 'Cancel the order' : 'Close the order'} onClose={() => setDialog(null)} onSave={(reason) => act(() => post(erpPath(companyId, `/sales-orders/${o.id}/${dialog}`), { reason }), dialog === 'cancel' ? 'Order cancelled; its stock is released' : 'Order closed')} /> : null}
    </div>
  );
}

function ReasonDialog({ title, label, button, onClose, onSave, required }: { title: string; label: string; button: string; onClose: () => void; onSave: (reason: string) => Promise<unknown>; required?: boolean }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={busy || (required && !reason.trim())} onClick={async () => { setBusy(true); const r = await onSave(reason.trim()); setBusy(false); if (r) onClose(); }}>{button}</button></>}>
      <div className="field"><label htmlFor="rd-r">{label}</label><textarea id="rd-r" className="textarea" rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
    </Modal>
  );
}

function ShipDialog({ companyId, order, onClose }: { companyId: string; order: SalesOrder; onClose: () => void }) {
  const carriers = useCarriers(companyId);
  const act = useAct(companyId);
  const navigate = useNavigate();
  const [f, setF] = useState({ carrierId: '', service: '', plannedDate: order.promisedDate ?? '', windowStart: '', windowEnd: '', freightCost: '', freightCharge: '', notify: false, notifyEmail: '', notes: '' });
  const [key] = useState(requestKey);
  const [busy, setBusy] = useState(false);
  const carrier = carriers.data?.carriers.find((x) => x.id === f.carrierId);
  const cost = toCents(f.freightCost);
  const charge = toCents(f.freightCharge);
  const save = async () => {
    setBusy(true);
    const r = (await act(() => post<{ id: string }>(erpPath(companyId, `/sales-orders/${order.id}/shipments`), { carrierId: f.carrierId || null, service: f.service || undefined, plannedDate: f.plannedDate || null, windowStart: f.windowStart || null, windowEnd: f.windowEnd || null, freightCostCents: typeof cost === 'number' ? cost : 0, freightChargeCents: typeof charge === 'number' ? charge : 0, notify: f.notify, notifyEmail: f.notifyEmail, notes: f.notes, requestKey: key }), 'Shipment planned')) as { id: string } | null;
    setBusy(false);
    if (r && typeof r === 'object') navigate(supplyPage(companyId, `/shipments/${r.id}`));
  };
  return (
    <Modal title={`Plan a shipment of ${order.number}`} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || cost === 'bad' || charge === 'bad'} onClick={() => void save()}>{busy ? 'Planning…' : 'Plan the shipment'}</button></>}>
      <p className="small">The shipment carries everything allocated to the order that is not on another shipment. Its pick list comes from the allocations.</p>
      <div className="form-grid">
        <div className="field"><label htmlFor="sh-c">Carrier</label><select id="sh-c" className="select" value={f.carrierId} onChange={(e) => setF({ ...f, carrierId: e.target.value, service: '' })}><option value="">None yet</option>{carriers.data?.carriers.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div className="field"><label htmlFor="sh-s">Service</label>{carrier?.services.length ? <select id="sh-s" className="select" value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}><option value="">None</option>{carrier.services.map((x) => <option key={x} value={x}>{x}</option>)}</select> : <input id="sh-s" className="input" maxLength={80} value={f.service} disabled={!carrier} onChange={(e) => setF({ ...f, service: e.target.value })} />}</div>
        <div className="field"><label htmlFor="sh-p">Ship on</label><input id="sh-p" className="input" type="date" value={f.plannedDate} onChange={(e) => setF({ ...f, plannedDate: e.target.value })} /></div>
        <div className="field"><label htmlFor="sh-w1">Delivery window from</label><input id="sh-w1" className="input" type="date" value={f.windowStart} onChange={(e) => setF({ ...f, windowStart: e.target.value })} /></div>
        <div className="field"><label htmlFor="sh-w2">Delivery window to</label><input id="sh-w2" className="input" type="date" value={f.windowEnd} onChange={(e) => setF({ ...f, windowEnd: e.target.value })} /></div>
        <div className="field"><label htmlFor="sh-fc">Freight cost ({order.currency})</label><input id="sh-fc" className="input" inputMode="decimal" value={f.freightCost} onChange={(e) => setF({ ...f, freightCost: e.target.value })} placeholder="What the carrier charges you" /></div>
        <div className="field"><label htmlFor="sh-fch">Freight charge ({order.currency})</label><input id="sh-fch" className="input" inputMode="decimal" value={f.freightCharge} onChange={(e) => setF({ ...f, freightCharge: e.target.value })} placeholder="A line on the invoice" /></div>
        <label className="row erp-toggle span-2"><input type="checkbox" checked={f.notify} onChange={(e) => setF({ ...f, notify: e.target.checked })} /> Email the customer when it is dispatched, with the tracking link</label>
        {f.notify ? <div className="field span-2"><label htmlFor="sh-ne">Email to</label><input id="sh-ne" className="input" type="email" maxLength={254} value={f.notifyEmail} onChange={(e) => setF({ ...f, notifyEmail: e.target.value })} placeholder="The customer’s address in the CRM when left empty" /></div> : null}
        <div className="field span-2"><label htmlFor="sh-n">Notes</label><textarea id="sh-n" className="textarea" rows={2} maxLength={2000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

function ReturnDialog({ companyId, view, onClose }: { companyId: string; view: SalesOrderView; onClose: () => void }) {
  const act = useAct(companyId);
  const navigate = useNavigate();
  const shipped = view.shipments.filter((s) => s.status === 'dispatched' || s.status === 'delivered');
  const [f, setF] = useState({ shipmentId: shipped[0]?.id ?? '', reason: 'damaged', details: '' });
  const [q, setQ] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const lines = view.lines.filter((l) => l.shippedQty - l.returnedQty > 1e-9);
  const chosen = lines.filter((l) => Number(q[l.id]) > 0).map((l) => ({ soLineId: l.id, quantity: Number(q[l.id]) }));
  const save = async () => {
    setBusy(true);
    const r = (await act(() => post<{ id: string }>(erpPath(companyId, '/rmas'), { soId: view.order.id, shipmentId: f.shipmentId || null, reason: f.reason, details: f.details, lines: chosen }), 'Return recorded')) as { id: string } | null;
    setBusy(false);
    if (r && typeof r === 'object') navigate(supplyPage(companyId, `/returns/${r.id}`));
  };
  return (
    <Modal title={`Record a return of ${view.order.number}`} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !chosen.length} onClick={() => void save()}>Record the return</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="rt-s">Shipment</label><select id="rt-s" className="select" value={f.shipmentId} onChange={(e) => setF({ ...f, shipmentId: e.target.value })}><option value="">Not said</option>{shipped.map((s) => <option key={s.id} value={s.id}>{s.number}</option>)}</select></div>
        <div className="field"><label htmlFor="rt-r">Reason</label><select id="rt-r" className="select" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })}>{options(RMA_REASONS)}</select></div>
        <div className="field span-2"><label htmlFor="rt-d">Details</label><textarea id="rt-d" className="textarea" rows={2} maxLength={2000} value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} /></div>
        {lines.map((l) => (
          <div key={l.id} className="field"><label htmlFor={`rt-q-${l.id}`}>{l.productNumber}: up to {qty(l.shippedQty - l.returnedQty)}</label><input id={`rt-q-${l.id}`} className="input" type="number" min="0" step="any" inputMode="decimal" value={q[l.id] ?? ''} onChange={(e) => setQ({ ...q, [l.id]: e.target.value })} /></div>
        ))}
      </div>
      <p className="muted small">A sales manager authorises it; the warehouse receives it back into stock.</p>
    </Modal>
  );
}

// ------------------------------------------------------------------ pick and dispatch: the queue (made for a phone)

function Floor({ companyId }: { companyId: string }) {
  usePageTitle('Pick and dispatch');
  const q = useQuery({ queryKey: ['erp', companyId, 'floor'], queryFn: () => get<{ shipments: Shipment[] }>(erpPath(companyId, '/shipments?status=open&sort=planned&limit=200')), refetchInterval: 30_000 });
  const t = useQuery({ queryKey: ['erp', companyId, 'floor-transit'], queryFn: () => get<{ shipments: Shipment[] }>(erpPath(companyId, '/shipments?status=in_transit&sort=planned&limit=200')), refetchInterval: 30_000 });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data || !t.data) return <Loading />;
  const groups: [string, string, Shipment[]][] = [
    ['To pick', 'Take each line from its location.', q.data.shipments.filter((s) => s.status === 'planned' || s.status === 'picking')],
    ['To pack', 'Put it in packages with their weight and size.', q.data.shipments.filter((s) => s.status === 'picked')],
    ['To dispatch', 'Hand it to the carrier.', q.data.shipments.filter((s) => s.status === 'packed')],
    ['To deliver', 'Confirm who received it, with a photo or signature.', t.data.shipments],
  ];
  return (
    <div className="stack erp-floor">
      {groups.map(([title, help, list]) => (
        <section key={title} className="stack">
          <h2 className="crm-subhead">{title} <span className="badge">{list.length}</span></h2>
          {!list.length ? <p className="muted small">Nothing {title.toLowerCase()}.</p> : (
            <>
              <p className="muted small">{help}</p>
              {list.map((s) => (
                <Link key={s.id} to={supplyPage(companyId, `/shipments/${s.id}`)} className={`card card-pad erp-job stack${s.late ? ' erp-job-late' : ''}`}>
                  <span className="erp-job-title">{s.number} for {s.customerName}</span>
                  <span className="small">{s.salesOrderNumber} · {s.carrierName ?? 'No carrier'}{s.service ? ` ${s.service}` : ''} · {windowText(s) || 'No date'}</span>
                  <span><ShipmentBadge value={s.status} />{s.late ? <span className="badge danger">Late</span> : null}</span>
                </Link>
              ))}
            </>
          )}
        </section>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ shipments: list

function ShipmentsPage({ companyId }: { companyId: string }) {
  usePageTitle('Shipments');
  const { g, set, offset } = useListParams();
  const carriers = useCarriers(companyId, true);
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'carrierId', 'from', 'to', 'uninvoiced', 'sort']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'shipments', filters.toString(), offset], queryFn: () => get<{ shipments: Shipment[]; total: number }>(erpPath(companyId, `/shipments?${filters}&limit=${limit}&offset=${offset}`)) });
  return (
    <div className="stack">
      <div className="row wrap"><div className="grow" /><CsvLink companyId={companyId} path={`/shipments?${filters}`} /></div>
      <FilterPanel active={['q', 'status', 'carrierId', 'from', 'to', 'uninvoiced'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="sp-q">Search</label><input id="sp-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, order, customer or tracking number" /></div>
        <div className="field"><label htmlFor="sp-s">Status</label><select id="sp-s" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Every status</option><option value="open">Not dispatched</option>{options(SHIPMENT_STATUS)}</select></div>
        <div className="field"><label htmlFor="sp-c">Carrier</label><select id="sp-c" className="select" value={g('carrierId')} onChange={(e) => set('carrierId', e.target.value)}><option value="">Any</option>{carriers.data?.carriers.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div className="field"><label htmlFor="sp-f">Planned from</label><input id="sp-f" className="input" type="date" value={g('from')} onChange={(e) => set('from', e.target.value)} /></div>
        <div className="field"><label htmlFor="sp-t">Planned to</label><input id="sp-t" className="input" type="date" value={g('to')} onChange={(e) => set('to', e.target.value)} /></div>
        <div className="field"><label htmlFor="sp-i">Invoice</label><select id="sp-i" className="select" value={g('uninvoiced')} onChange={(e) => set('uninvoiced', e.target.value)}><option value="">Any</option><option value="1">Dispatched, not invoiced</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.shipments.length ? (
          <EmptyState icon="globe" title={filters.toString() ? 'Nothing matches' : 'No shipments yet'}>{filters.toString() ? 'Change the filters to see more.' : 'Plan a shipment from a sales order once its stock is allocated.'}</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Shipment</th><th>Customer</th><th>Status</th><th>Carrier</th><th>Delivery</th><th className="num">Packages</th></tr></thead>
              <tbody>
                {list.data.shipments.map((s) => (
                  <tr key={s.id}>
                    <td data-label="Shipment"><Link className="mt-primary" to={supplyPage(companyId, `/shipments/${s.id}`)}><span className="mt-num">{s.number}</span></Link><div className="muted small">{s.salesOrderNumber}</div></td>
                    <td data-label="Customer">{s.customerName}</td>
                    <td data-label="Status"><ShipmentBadge value={s.status} />{s.late ? <span className="badge danger">Late</span> : null}</td>
                    <td data-label="Carrier">{s.carrierName ?? ''}{s.trackingNumber ? <div className="muted small">{s.trackingNumber}</div> : null}</td>
                    <td data-label="Delivery">{windowText(s)}</td>
                    <td data-label="Packages" className="num">{s.packages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(x) => set('offset', x ? String(x) : '')} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ one shipment: pick, pack, dispatch, deliver, invoice

function ShipmentDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'shipment', id], queryFn: () => get<ShipmentView>(erpPath(companyId, `/shipments/${id}`)), retry: false });
  const act = useAct(companyId);
  const [editing, setEditing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  usePageTitle(q.data ? q.data.shipment.number : 'Shipment');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const s = v.shipment;
  const steps = ['planned', 'picking', 'picked', 'packed', 'dispatched', 'delivered'];
  const at = steps.indexOf(s.status);
  return (
    <div className="stack erp-shipment">
      <div className="mt-path"><Link to={supplyPage(companyId, '/shipments')}>Shipments</Link><span className="sep">/</span><span>{s.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{s.number}</span> {s.customerName}</h2>
          <div className="mt-badges"><ShipmentBadge value={s.status} />{s.late ? <span className="badge danger">Late</span> : null}<Link className="badge" to={supplyPage(companyId, `/orders/${s.salesOrderId}`)}>{s.salesOrderNumber}</Link></div>
        </div>
        <div className="mt-head-actions row wrap">
          {v.can.plan || v.can.tracking ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Change</button> : null}
          {v.can.cancel ? <button className="btn" onClick={() => setCancelling(true)}>Cancel</button> : null}
        </div>
      </div>
      {s.status !== 'cancelled' ? <ol className="erp-steps" aria-label="Progress">{['Planned', 'Picking', 'Picked', 'Packed', 'Dispatched', 'Delivered'].map((label, i) => <li key={label} className={i <= at ? 'done' : ''}>{label}</li>)}</ol> : null}
      <Section title="Delivery">
        <Props
          items={[
            ['Ship to', s.shipTo],
            ['Their order number', s.customerPo],
            ['Carrier', s.carrierName ? `${s.carrierName}${s.service ? `, ${s.service}` : ''}` : ''],
            ['Tracking number', s.trackingUrl ? <a href={s.trackingUrl} target="_blank" rel="noopener noreferrer">{s.trackingNumber}</a> : s.trackingNumber],
            ['Ship on', dateText(s.plannedDate)],
            ['Delivery window', s.windowStart || s.windowEnd ? windowText(s) : ''],
            ['Freight cost', s.freightCostCents ? money(s.freightCostCents, s.currency) : ''],
            ['Freight charge', s.freightChargeCents ? money(s.freightChargeCents, s.currency) : ''],
            ['Packages', s.packages ? `${s.packages}${s.weightKg ? `, ${s.weightKg} kg` : ''}` : ''],
            ['Dispatched', s.dispatchedAt ? `${dayText(s.dispatchedAt)} by ${s.dispatchedByName ?? ''}` : ''],
            ['Delivered', s.deliveredAt ? `${new Date(s.deliveredAt).toLocaleString('en-AU')}, received by ${s.receivedBy}` : ''],
            ['Delivery note', s.deliveryNote],
            ['Dispatch email', s.notify ? `${s.notifyEmail || 'To the customer’s address'}${s.notifyLabel ? `. ${s.notifyLabel}` : ''}` : 'Not asked for'],
            ['Cancelled', s.cancelReason],
            ['Notes', s.notes],
          ]}
        />
        {s.notify && v.notifyNote ? <p className="small">{v.notifyNote}</p> : null}
      </Section>
      {v.picks.length && s.status !== 'cancelled' ? <PickList companyId={companyId} view={v} /> : null}
      {['picked', 'packed', 'dispatched', 'delivered'].includes(s.status) ? <Packing companyId={companyId} view={v} /> : null}
      {v.can.dispatch ? <Dispatch companyId={companyId} view={v} /> : null}
      {v.can.deliver || v.can.proof || v.proofOfDelivery.length ? <Delivery companyId={companyId} view={v} onDone={() => void q.refetch()} /> : null}
      <Section title="Lines">
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Product</th><th className="num">On the shipment</th><th className="num">Picked</th><th className="num">Shipped</th></tr></thead>
            <tbody>{v.lines.map((l) => <tr key={l.id}><td data-label="Product"><strong>{l.productNumber}</strong> {l.description}</td><td data-label="On the shipment" className="num">{qty(l.quantity)} {l.uom}</td><td data-label="Picked" className="num">{qty(l.pickedQty)}</td><td data-label="Shipped" className="num">{qty(l.shippedQty)}</td></tr>)}</tbody>
          </table>
        </div>
      </Section>
      {['dispatched', 'delivered'].includes(s.status) ? (
        <Section title="Invoice in Finance">
          {v.invoice.status === 'done' ? (
            <p>The draft invoice is in Finance. {v.invoice.url ? <a href={financeUrl(v.invoice.url)!}>Open it</a> : null} Check it and approve it there.</p>
          ) : (
            <>
              {v.invoice.lastError ? <p className="small erp-neg">The last try failed: {v.invoice.lastError}. Fix it and try again.</p> : null}
              {v.invoice.canCreate ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/shipments/${s.id}/invoice`)), 'Draft invoice made in Finance')}>Make the draft invoice in Finance</button> : <p className="muted small">{v.invoice.reason}</p>}
              <p className="muted small">One draft invoice per shipment: what was shipped at the order’s prices, and the freight charge. Finance’s approval posts it.</p>
            </>
          )}
        </Section>
      ) : null}
      {v.integration.length ? <Section title="Finance"><ul className="erp-list">{v.integration.map((e) => <li key={e.id} className="small">{e.kindLabel}: {e.status === 'planned' ? 'planned, not posted' : e.status}{e.amountCents !== null ? `, ${money(Math.abs(e.amountCents), s.currency)}` : ''}</li>)}</ul></Section> : null}
      <Section title="Files" actions={v.can.plan ? <RecordUpload companyId={companyId} kind="shipment" id={s.id} onDone={() => void q.refetch()} /> : undefined}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a></li>)}</ul> : <p className="muted small">No files.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {editing ? <ShipmentEdit companyId={companyId} view={v} onClose={() => setEditing(false)} /> : null}
      {cancelling ? <ReasonDialog title={`Cancel ${s.number}`} label="Why is it cancelled? Its stock stays allocated to the order." button="Cancel the shipment" onClose={() => setCancelling(false)} onSave={(reason) => act(() => post(erpPath(companyId, `/shipments/${s.id}/cancel`), { reason }), 'Shipment cancelled')} /> : null}
    </div>
  );
}

function PickList({ companyId, view }: { companyId: string; view: ShipmentView }) {
  const act = useAct(companyId);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const can = view.can.pick;
  const value = (k: ShipmentView['picks'][number]) => picked[k.id] ?? String(k.pickedQty ?? k.suggestedQty);
  const save = (lines: ShipmentView['picks']) => act(() => post(erpPath(companyId, `/shipments/${view.shipment.id}/pick`), { lines: lines.map((k) => ({ pickLineId: k.id, pickedQty: Number(value(k)) || 0 })) }), lines.length === 1 ? 'Picked' : 'Pick list recorded');
  return (
    <Section title="Pick list">
      <p className="muted small">Soonest expiry first, then the oldest. Type what you took if it was less.</p>
      <div className="stack">
        {view.picks.map((k) => (
          <div key={k.id} className="card card-pad erp-pick stack">
            <div className="row wrap"><strong className="erp-pick-loc">{k.location}</strong><span className="grow" />{k.pickedQty !== null ? <span className="badge success">Picked {qty(k.pickedQty)}</span> : <span className="badge">To pick</span>}</div>
            <span><strong>{k.productNumber}</strong> {k.productName}</span>
            <span className="small">{k.lot ? `Lot ${k.lot}` : ''}{k.serial ? ` Serial ${k.serial}` : ''}{k.expiry ? ` · expires ${dateText(k.expiry)}` : ''} · take {qty(k.suggestedQty)} {k.uom}</span>
            {can ? (
              <div className="row erp-scan-row">
                <div className="field grow"><label htmlFor={`pk-${k.id}`}>Picked</label><input id={`pk-${k.id}`} className="input erp-scan-input" type="number" min="0" max={k.suggestedQty} step="any" inputMode="decimal" value={value(k)} onChange={(e) => setPicked({ ...picked, [k.id]: e.target.value })} /></div>
                <button className="btn" onClick={() => void save([k])}>Save</button>
              </div>
            ) : null}
          </div>
        ))}
        {can ? <button className="btn primary erp-big" onClick={() => void save(view.picks)}>Picked as listed</button> : null}
      </div>
    </Section>
  );
}

function Packing({ companyId, view }: { companyId: string; view: ShipmentView }) {
  const act = useAct(companyId);
  const s = view.shipment;
  const canPack = view.can.pack;
  const [f, setF] = useState({ kind: 'box', weight: '', length: '', width: '', height: '', notes: '' });
  const [contents, setContents] = useState<Record<string, string>>({});
  const add = async () => {
    const r = await act(
      () =>
        post(erpPath(companyId, `/shipments/${s.id}/packages`), {
          kind: f.kind,
          weightKg: f.weight ? Number(f.weight) : null,
          lengthCm: f.length ? Number(f.length) : null,
          widthCm: f.width ? Number(f.width) : null,
          heightCm: f.height ? Number(f.height) : null,
          contents: view.lines.filter((l) => Number(contents[l.soLineId]) > 0).map((l) => ({ soLineId: l.soLineId, quantity: Number(contents[l.soLineId]) })),
          notes: f.notes,
        }),
      'Package added',
    );
    if (r) {
      setF({ kind: 'box', weight: '', length: '', width: '', height: '', notes: '' });
      setContents({});
    }
  };
  return (
    <Section title="Packages">
      {view.packages.length ? (
        <ul className="erp-list">
          {view.packages.map((p) => (
            <li key={p.id} className="card card-pad small">
              <div className="row wrap"><strong>{p.kindLabel} {p.seq}</strong><span className="grow" />{canPack && s.status !== 'dispatched' && s.status !== 'delivered' ? <button className="btn sm" onClick={() => void act(() => api(erpPath(companyId, `/shipments/${s.id}/packages/${p.id}`), { method: 'DELETE' }), 'Package removed')}><Icon name="trash" size={14} /> Remove</button> : null}</div>
              {[p.weightKg !== null ? `${p.weightKg} kg` : '', p.lengthCm && p.widthCm && p.heightCm ? `${p.lengthCm} x ${p.widthCm} x ${p.heightCm} cm` : ''].filter(Boolean).join(', ')}
              {p.contents.length ? <div>{p.contents.map((c) => `${qty(c.quantity)} of ${c.productNumber}`).join(', ')}</div> : null}
              {p.notes ? <div className="muted">{p.notes}</div> : null}
            </li>
          ))}
        </ul>
      ) : <p className="muted small">No packages yet.</p>}
      {canPack && (s.status === 'picked' || s.status === 'packed') ? (
        <div className="stack">
          <div className="form-grid">
            <div className="field"><label htmlFor="pkg-k">Kind</label><select id="pkg-k" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{options(PACKAGE_KINDS)}</select></div>
            <div className="field"><label htmlFor="pkg-w">Weight (kg)</label><input id="pkg-w" className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} /></div>
            <div className="field"><label htmlFor="pkg-l">Length (cm)</label><input id="pkg-l" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.length} onChange={(e) => setF({ ...f, length: e.target.value })} /></div>
            <div className="field"><label htmlFor="pkg-wi">Width (cm)</label><input id="pkg-wi" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.width} onChange={(e) => setF({ ...f, width: e.target.value })} /></div>
            <div className="field"><label htmlFor="pkg-h">Height (cm)</label><input id="pkg-h" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.height} onChange={(e) => setF({ ...f, height: e.target.value })} /></div>
            {view.lines.filter((l) => l.pickedQty > 0).map((l) => <div key={l.id} className="field"><label htmlFor={`pkg-c-${l.id}`}>{l.productNumber} in it (picked {qty(l.pickedQty)})</label><input id={`pkg-c-${l.id}`} className="input" type="number" min="0" step="any" inputMode="decimal" value={contents[l.soLineId] ?? ''} onChange={(e) => setContents({ ...contents, [l.soLineId]: e.target.value })} /></div>)}
            <div className="field span-2"><label htmlFor="pkg-n">Notes</label><input id="pkg-n" className="input" maxLength={500} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
          </div>
          <div className="row wrap">
            <button className="btn" onClick={() => void add()}><Icon name="plus" /> Add the package</button>
            <span className="grow" />
            {s.status === 'picked' ? <button className="btn primary" disabled={!view.packages.length} onClick={() => void act(() => post(erpPath(companyId, `/shipments/${s.id}/packed`)), 'Packed')}>Packed</button> : null}
          </div>
        </div>
      ) : null}
    </Section>
  );
}

function Dispatch({ companyId, view }: { companyId: string; view: ShipmentView }) {
  const act = useAct(companyId);
  const s = view.shipment;
  const [tracking, setTracking] = useState(s.trackingNumber);
  const [key] = useState(requestKey);
  const [busy, setBusy] = useState(false);
  return (
    <Section title="Dispatch">
      <div className="field"><label htmlFor="dp-t">Tracking number</label><input id="dp-t" className="input erp-scan-input" maxLength={100} value={tracking} onChange={(e) => setTracking(e.target.value)} /></div>
      {s.notify ? <p className="small">{view.notifyNote ?? 'The customer gets an email with the tracking link.'}</p> : null}
      <button className="btn primary erp-big" disabled={busy} onClick={async () => { setBusy(true); await act(() => post(erpPath(companyId, `/shipments/${s.id}/dispatch`), { trackingNumber: tracking, requestKey: key }), 'Dispatched'); setBusy(false); }}>{busy ? 'Dispatching…' : 'Dispatch'}</button>
      <p className="muted small">The stock leaves the warehouse now, once, and its allocation is used up.</p>
    </Section>
  );
}

/** A signature drawn with a finger or a mouse, uploaded as an image (proof of delivery). */
function SignaturePad({ onSave }: { onSave: (blob: Blob) => Promise<unknown> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = Math.max(280, Math.round(c.clientWidth || 320));
    c.height = 160;
    const g = c.getContext('2d');
    if (g) {
      g.fillStyle = '#ffffff';
      g.fillRect(0, 0, c.width, c.height);
      g.lineWidth = 2.5;
      g.lineCap = 'round';
      g.strokeStyle = '#0a1f33';
    }
  }, []);
  const at = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * e.currentTarget.width) / r.width, y: ((e.clientY - r.top) * e.currentTarget.height) / r.height };
  };
  const clear = () => {
    const c = ref.current;
    const g = c?.getContext('2d');
    if (c && g) {
      g.fillStyle = '#ffffff';
      g.fillRect(0, 0, c.width, c.height);
    }
    setDrawn(false);
  };
  return (
    <div className="stack">
      <canvas
        ref={ref}
        className="erp-signature"
        aria-label="Signature: draw here"
        onPointerDown={(e) => {
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          const g = e.currentTarget.getContext('2d');
          const p = at(e);
          g?.beginPath();
          g?.moveTo(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const g = e.currentTarget.getContext('2d');
          const p = at(e);
          g?.lineTo(p.x, p.y);
          g?.stroke();
          setDrawn(true);
        }}
        onPointerUp={() => {
          drawing.current = false;
        }}
      />
      <div className="row wrap">
        <button type="button" className="btn" onClick={clear}>Clear</button>
        <button type="button" className="btn" disabled={!drawn} onClick={() => ref.current?.toBlob((b) => { if (b) void onSave(b).then((r) => { if (r) clear(); }); }, 'image/png')}>Add the signature</button>
      </div>
    </div>
  );
}

function Delivery({ companyId, view, onDone }: { companyId: string; view: ShipmentView; onDone: () => void }) {
  const act = useAct(companyId);
  const toast = useToast();
  const s = view.shipment;
  const [f, setF] = useState({ receivedBy: '', note: '' });
  const [busy, setBusy] = useState(false);
  const uploadSignature = async (blob: Blob) => {
    const fd = new FormData();
    fd.set('file', new File([blob], `signature-${s.number}.png`, { type: 'image/png' }));
    fd.set('kind', 'delivery');
    fd.set('id', s.id);
    try {
      await api(erpPath(companyId, '/record-files'), { method: 'POST', form: fd });
      toast('Signature added');
      onDone();
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : 'The signature could not be added', 'error');
      return false;
    }
  };
  return (
    <Section title="Delivery confirmation">
      {view.proofOfDelivery.length ? (
        <ul className="erp-pod">{view.proofOfDelivery.map((f_) => <li key={f_.id}>{f_.isImage ? <a href={f_.url}><img src={f_.url} alt={`Proof of delivery: ${f_.name}`} /></a> : <a href={f_.url}>{f_.name}</a>}</li>)}</ul>
      ) : view.can.proof ? <p className="muted small">Add a photo of the goods where they were left, the receiver’s signature, or a signed document.</p> : null}
      {view.can.proof ? (
        <div className="stack">
          <div className="row wrap">
            <RecordUpload companyId={companyId} kind="delivery" id={s.id} onDone={onDone} label="Take or add a photo" accept="image/*" big />
            <RecordUpload companyId={companyId} kind="delivery" id={s.id} onDone={onDone} label="Add a document" accept=".pdf,image/*" />
          </div>
          <SignaturePad onSave={uploadSignature} />
        </div>
      ) : null}
      {view.can.deliver ? (
        <div className="stack">
          <div className="field"><label htmlFor="dl-r">Received by</label><input id="dl-r" className="input erp-scan-input" maxLength={200} value={f.receivedBy} onChange={(e) => setF({ ...f, receivedBy: e.target.value })} /></div>
          <div className="field"><label htmlFor="dl-n">Note</label><input id="dl-n" className="input" maxLength={1000} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="For example: left at reception" /></div>
          <button className="btn primary erp-big" disabled={busy || !f.receivedBy.trim()} onClick={async () => { setBusy(true); await act(() => post(erpPath(companyId, `/shipments/${s.id}/deliver`), { receivedBy: f.receivedBy, note: f.note }), 'Delivery confirmed'); setBusy(false); }}>Confirm the delivery</button>
        </div>
      ) : null}
    </Section>
  );
}

function ShipmentEdit({ companyId, view, onClose }: { companyId: string; view: ShipmentView; onClose: () => void }) {
  const carriers = useCarriers(companyId);
  const act = useAct(companyId);
  const s = view.shipment;
  const left = s.status === 'dispatched' || s.status === 'delivered';
  const [f, setF] = useState({ carrierId: s.carrierId ?? '', service: s.service, trackingNumber: s.trackingNumber, plannedDate: s.plannedDate ?? '', windowStart: s.windowStart ?? '', windowEnd: s.windowEnd ?? '', freightCost: dollars(s.freightCostCents), freightCharge: dollars(s.freightChargeCents), notify: s.notify, notifyEmail: s.notifyEmail, notes: s.notes });
  const carrier = carriers.data?.carriers.find((x) => x.id === f.carrierId);
  const plan = view.can.plan || left;
  const save = async () => {
    const cost = toCents(f.freightCost);
    const charge = toCents(f.freightCharge);
    const body: Record<string, unknown> = { trackingNumber: f.trackingNumber, notes: f.notes };
    if (plan) Object.assign(body, { freightCostCents: typeof cost === 'number' ? cost : 0, freightChargeCents: typeof charge === 'number' ? charge : 0, windowStart: f.windowStart || null, windowEnd: f.windowEnd || null });
    if (view.can.plan && !left) Object.assign(body, { carrierId: f.carrierId || null, service: f.service, plannedDate: f.plannedDate || null, notify: f.notify, notifyEmail: f.notifyEmail });
    const r = await act(() => patch(erpPath(companyId, `/shipments/${s.id}`), body), 'Shipment saved');
    if (r) onClose();
  };
  return (
    <Modal title={`Change ${s.number}`} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        {view.can.plan && !left ? (
          <>
            <div className="field"><label htmlFor="se-c">Carrier</label><select id="se-c" className="select" value={f.carrierId} onChange={(e) => setF({ ...f, carrierId: e.target.value, service: '' })}><option value="">None</option>{carriers.data?.carriers.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
            <div className="field"><label htmlFor="se-s">Service</label>{carrier?.services.length ? <select id="se-s" className="select" value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}><option value="">None</option>{carrier.services.map((x) => <option key={x} value={x}>{x}</option>)}</select> : <input id="se-s" className="input" value={f.service} disabled={!carrier} onChange={(e) => setF({ ...f, service: e.target.value })} />}</div>
            <div className="field"><label htmlFor="se-p">Ship on</label><input id="se-p" className="input" type="date" value={f.plannedDate} onChange={(e) => setF({ ...f, plannedDate: e.target.value })} /></div>
          </>
        ) : null}
        <div className="field"><label htmlFor="se-t">Tracking number</label><input id="se-t" className="input" maxLength={100} value={f.trackingNumber} onChange={(e) => setF({ ...f, trackingNumber: e.target.value })} /></div>
        {plan && view.can.plan !== undefined ? (
          <>
            <div className="field"><label htmlFor="se-w1">Delivery window from</label><input id="se-w1" className="input" type="date" value={f.windowStart} onChange={(e) => setF({ ...f, windowStart: e.target.value })} /></div>
            <div className="field"><label htmlFor="se-w2">Delivery window to</label><input id="se-w2" className="input" type="date" value={f.windowEnd} onChange={(e) => setF({ ...f, windowEnd: e.target.value })} /></div>
            <div className="field"><label htmlFor="se-fc">Freight cost ({s.currency})</label><input id="se-fc" className="input" inputMode="decimal" value={f.freightCost} onChange={(e) => setF({ ...f, freightCost: e.target.value })} /></div>
            <div className="field"><label htmlFor="se-fch">Freight charge ({s.currency})</label><input id="se-fch" className="input" inputMode="decimal" value={f.freightCharge} disabled={s.invoiceStatus === 'done'} onChange={(e) => setF({ ...f, freightCharge: e.target.value })} /></div>
          </>
        ) : null}
        {view.can.plan && !left ? (
          <>
            <label className="row erp-toggle span-2"><input type="checkbox" checked={f.notify} onChange={(e) => setF({ ...f, notify: e.target.checked })} /> Email the customer when it is dispatched</label>
            {f.notify ? <div className="field span-2"><label htmlFor="se-ne">Email to</label><input id="se-ne" className="input" type="email" value={f.notifyEmail} onChange={(e) => setF({ ...f, notifyEmail: e.target.value })} placeholder="The customer’s address when left empty" /></div> : null}
          </>
        ) : null}
        <div className="field span-2"><label htmlFor="se-n">Notes</label><textarea id="se-n" className="textarea" rows={2} maxLength={2000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ the delivery schedule

function Schedule({ companyId }: { companyId: string }) {
  usePageTitle('Delivery schedule');
  const { g, set } = useListParams();
  const qs = new URLSearchParams();
  if (g('from')) qs.set('from', g('from'));
  if (g('to')) qs.set('to', g('to'));
  const q = useQuery({ queryKey: ['erp', companyId, 'schedule', qs.toString()], queryFn: () => get<{ from: string; to: string; days: { date: string; shipments: Shipment[] }[]; toPlan: { id: string; number: string; customerName: string; status: string; due: string | null; toShip: number; allocated: number; late: boolean }[] }>(erpPath(companyId, `/delivery-schedule?${qs}`)) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <div className="row wrap mt-toolbar">
        <input className="input" type="date" aria-label="From date" value={g('from') || q.data.from} onChange={(e) => set('from', e.target.value)} />
        <input className="input" type="date" aria-label="To date" value={g('to') || q.data.to} onChange={(e) => set('to', e.target.value)} />
        <span className="grow" />
        <CsvLink companyId={companyId} path={`/delivery-schedule?${qs}`} />
      </div>
      {q.data.toPlan.length ? (
        <Section title="Orders due without a shipment">
          <ul className="erp-list">{q.data.toPlan.map((o) => <li key={o.id} className="small"><Link className="mt-num" to={supplyPage(companyId, `/orders/${o.id}`)}>{o.number}</Link> {o.customerName}: {qty(o.toShip)} to ship, {qty(o.allocated)} allocated, due {dateText(o.due)} {o.late ? <span className="badge danger">Late</span> : null}</li>)}</ul>
        </Section>
      ) : null}
      {!q.data.days.length ? <p className="muted">No shipment planned between {dateText(q.data.from)} and {dateText(q.data.to)}.</p> : q.data.days.map((d) => (
        <Section key={d.date} title={d.date === 'unscheduled' ? 'No date yet' : dateText(d.date)}>
          <ul className="erp-list">
            {d.shipments.map((s) => <li key={s.id} className="small"><Link className="mt-num" to={supplyPage(companyId, `/shipments/${s.id}`)}>{s.number}</Link> <ShipmentBadge value={s.status} /> {s.customerName} ({s.salesOrderNumber}) · {s.carrierName ?? 'No carrier'}{s.windowStart || s.windowEnd ? ` · window ${windowText(s)}` : ''}{s.late ? <span className="badge danger">Late</span> : null}</li>)}
          </ul>
        </Section>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ returns

function ReturnsPage({ companyId }: { companyId: string }) {
  usePageTitle('Returns');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'reason']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'rmas', filters.toString(), offset], queryFn: () => get<{ returns: Rma[]; total: number }>(erpPath(companyId, `/rmas?${filters}&limit=${limit}&offset=${offset}`)) });
  return (
    <div className="stack">
      <div className="row wrap"><p className="muted small grow">A return is recorded from its sales order.</p><CsvLink companyId={companyId} path={`/rmas?${filters}`} /></div>
      <FilterPanel active={['q', 'status', 'reason'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="rm-q">Search</label><input id="rm-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, order or customer" /></div>
        <div className="field"><label htmlFor="rm-s">Status</label><select id="rm-s" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Every status</option><option value="open">Open</option>{options(RMA_STATUS)}</select></div>
        <div className="field"><label htmlFor="rm-r">Reason</label><select id="rm-r" className="select" value={g('reason')} onChange={(e) => set('reason', e.target.value)}><option value="">Any</option>{options(RMA_REASONS)}</select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.returns.length ? (
          <EmptyState icon="refresh" title={filters.toString() ? 'Nothing matches' : 'No returns yet'}>{filters.toString() ? 'Change the filters to see more.' : 'When a customer sends goods back, record the return on its sales order.'}</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Return</th><th>Customer</th><th>Status</th><th>Reason</th><th>Raised</th></tr></thead>
              <tbody>{list.data.returns.map((r) => <tr key={r.id}><td data-label="Return"><Link className="mt-primary" to={supplyPage(companyId, `/returns/${r.id}`)}><span className="mt-num">{r.number}</span></Link><div className="muted small">{r.salesOrderNumber}</div></td><td data-label="Customer">{r.customerName}</td><td data-label="Status"><RmaBadge value={r.status} /></td><td data-label="Reason">{r.reasonLabel}</td><td data-label="Raised">{dayText(r.createdAt)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(x) => set('offset', x ? String(x) : '')} /> : null}
    </div>
  );
}

function ReturnDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'rma', id], queryFn: () => get<RmaView>(erpPath(companyId, `/rmas/${id}`)), retry: false });
  const act = useAct(companyId);
  const [dialog, setDialog] = useState<null | 'reject' | 'receive' | 'quality' | 'cancel'>(null);
  usePageTitle(q.data ? q.data.rma.number : 'Return');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const r = v.rma;
  return (
    <div className="stack">
      <div className="mt-path"><Link to={supplyPage(companyId, '/returns')}>Returns</Link><span className="sep">/</span><span>{r.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{r.number}</span> {r.customerName}</h2>
          <div className="mt-badges"><RmaBadge value={r.status} /><span className="badge">{r.reasonLabel}</span><Link className="badge" to={supplyPage(companyId, `/orders/${r.salesOrderId}`)}>{r.salesOrderNumber}</Link></div>
        </div>
        <div className="mt-head-actions row wrap">
          {v.can.authorise ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/rmas/${r.id}/authorise`)), 'Return authorised')}>Authorise</button> : null}
          {v.can.authorise ? <button className="btn" onClick={() => setDialog('reject')}>Reject</button> : null}
          {v.can.receive ? <button className="btn primary" onClick={() => setDialog('receive')}>Receive it back</button> : null}
          {v.can.quality ? <button className="btn" onClick={() => setDialog('quality')}>Link to Quality</button> : null}
          {v.can.close ? <button className="btn" onClick={() => void act(() => post(erpPath(companyId, `/rmas/${r.id}/close`)), 'Return closed')}>Close</button> : null}
          {v.can.cancel ? <button className="btn" onClick={() => setDialog('cancel')}>Cancel</button> : null}
        </div>
      </div>
      <Section title="Return">
        <Props
          items={[
            ['Shipment', r.shipmentNumber && r.shipmentId ? <Link to={supplyPage(companyId, `/shipments/${r.shipmentId}`)}>{r.shipmentNumber}</Link> : ''],
            ['Details', r.details],
            ['Raised', `${dayText(r.createdAt)} by ${r.createdByName ?? ''}`],
            ['Authorised', r.authorisedAt && r.status !== 'rejected' ? `${dayText(r.authorisedAt)} by ${r.authorisedByName ?? ''}` : ''],
            ['Decision note', r.decisionNote],
            ['Received', r.receivedAt ? `${dayText(r.receivedAt)} by ${r.receivedByName ?? ''}` : ''],
            ['Inspection', r.inspectionNumber && r.inspectionId ? <Link to={qualityPage(companyId, `/inspections/${r.inspectionId}`)}>{r.inspectionNumber}</Link> : ''],
            ['Nonconformance', r.ncrNumber && r.ncrId ? <Link to={qualityPage(companyId, `/ncrs/${r.ncrId}`)}>{r.ncrNumber}</Link> : ''],
          ]}
        />
      </Section>
      <Section title="Lines">
        <ul className="erp-list">{v.lines.map((l) => <li key={l.id} className="small"><strong>{l.productNumber}</strong> {l.productName}: {qty(l.quantity)} {l.uom} to come back{l.receivedQty ? `, ${qty(l.receivedQty)} received into ${l.location}${l.quarantine ? ' (quarantine)' : ''}${l.lot ? ` lot ${l.lot}` : ''}` : ''}</li>)}</ul>
      </Section>
      {['received', 'closed'].includes(r.status) ? (
        <Section title="Credit note in Finance">
          {v.credit.status === 'done' ? <p>The draft credit note is in Finance. {v.credit.url ? <a href={financeUrl(v.credit.url)!}>Open it</a> : null} Check it and approve it there.</p> : (
            <>
              {v.credit.lastError ? <p className="small erp-neg">The last try failed: {v.credit.lastError}.</p> : null}
              {v.credit.canCreate ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/rmas/${r.id}/credit-note`)), 'Draft credit note made in Finance')}>Make the draft credit note in Finance</button> : <p className="muted small">{v.credit.reason}</p>}
            </>
          )}
        </Section>
      ) : null}
      <Section title="Files" actions={v.can.receive || v.can.authorise || v.can.cancel ? <RecordUpload companyId={companyId} kind="rma" id={r.id} onDone={() => void q.refetch()} /> : undefined}>
        {v.files.length ? <ul className="erp-list">{v.files.map((f) => <li key={f.id} className="small"><a href={f.url}>{f.name}</a></li>)}</ul> : <p className="muted small">No files.</p>}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {dialog === 'reject' ? <ReasonDialog title={`Reject ${r.number}`} label="Why is it rejected?" button="Reject" required onClose={() => setDialog(null)} onSave={(note) => act(() => post(erpPath(companyId, `/rmas/${r.id}/reject`), { note }), 'Return rejected')} /> : null}
      {dialog === 'cancel' ? <ReasonDialog title={`Cancel ${r.number}`} label="Note (optional)" button="Cancel the return" onClose={() => setDialog(null)} onSave={(note) => act(() => post(erpPath(companyId, `/rmas/${r.id}/cancel`), { note }), 'Return cancelled')} /> : null}
      {dialog === 'receive' ? <ReceiveDialog companyId={companyId} view={v} onClose={() => setDialog(null)} /> : null}
      {dialog === 'quality' ? <QualityLinkDialog companyId={companyId} rma={r} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

function ReceiveDialog({ companyId, view, onClose }: { companyId: string; view: RmaView; onClose: () => void }) {
  const locs = useQuery({ queryKey: ['erp', companyId, 'locations-all'], queryFn: () => get<{ locations: { id: string; fullCode: string; name: string; kind: string; kindLabel: string }[] }>(erpPath(companyId, '/locations')) });
  const act = useAct(companyId);
  const [rows, setRows] = useState(view.lines.map((l) => ({ lineId: l.id, quantity: String(l.quantity), locationId: '', lot: '' })));
  const [note, setNote] = useState('');
  const [key] = useState(requestKey);
  const quar = locs.data?.locations.filter((l) => l.kind === 'quarantine') ?? [];
  const save = async () => {
    const r = await act(() => post(erpPath(companyId, `/rmas/${view.rma.id}/receive`), { lines: rows.map((x) => ({ lineId: x.lineId, quantity: Number(x.quantity) || 0, locationId: x.locationId, lot: x.lot || undefined })), note, requestKey: key }), 'Return received into stock');
    if (r) onClose();
  };
  return (
    <Modal title={`Receive ${view.rma.number}`} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={rows.some((x) => !x.locationId)} onClick={() => void save()}>Receive</button></>}>
      {!locs.data ? <Loading /> : (
        <div className="stack">
          {quar.length ? <p className="small">To inspect it before it is used again, receive it into a quarantine location: {quar.map((l) => l.fullCode).join(', ')}.</p> : null}
          {view.lines.map((l, i) => (
            <fieldset key={l.id} className="card card-pad erp-receive-line">
              <legend className="small">{l.productNumber} {l.productName}</legend>
              <div className="form-grid">
                <div className="field"><label htmlFor={`rc-q-${l.id}`}>Quantity (up to {qty(l.quantity)})</label><input id={`rc-q-${l.id}`} className="input" type="number" min="0" max={l.quantity} step="any" inputMode="decimal" value={rows[i].quantity} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, quantity: e.target.value } : x)))} /></div>
                <div className="field"><label htmlFor={`rc-l-${l.id}`}>Into</label><select id={`rc-l-${l.id}`} className="select" value={rows[i].locationId} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, locationId: e.target.value } : x)))}><option value="">Choose a location</option>{locs.data!.locations.map((x) => <option key={x.id} value={x.id}>{x.fullCode} {x.name}{x.kind === 'quarantine' ? ' (quarantine)' : ''}</option>)}</select></div>
                <div className="field"><label htmlFor={`rc-lot-${l.id}`}>Lot (if tracked)</label><input id={`rc-lot-${l.id}`} className="input" maxLength={80} value={rows[i].lot} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, lot: e.target.value } : x)))} /></div>
              </div>
            </fieldset>
          ))}
          <div className="field"><label htmlFor="rc-n">Note</label><input id="rc-n" className="input" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} /></div>
          <p className="muted small">Valued at the cost the goods left at. Recorded once.</p>
        </div>
      )}
    </Modal>
  );
}

function QualityLinkDialog({ companyId, rma, onClose }: { companyId: string; rma: Rma; onClose: () => void }) {
  const ncrs = useQuery({ queryKey: ['erp', companyId, 'ncrs-pick'], queryFn: () => get<{ ncrs: { id: string; number: string; title: string }[] }>(erpPath(companyId, '/ncrs?limit=200')) });
  const insp = useQuery({ queryKey: ['erp', companyId, 'inspections-pick'], queryFn: () => get<{ inspections: { id: string; number: string; kindLabel?: string; productNumber?: string }[] }>(erpPath(companyId, '/inspections?limit=200')) });
  const act = useAct(companyId);
  const [f, setF] = useState({ inspectionId: rma.inspectionId ?? '', ncrId: rma.ncrId ?? '' });
  return (
    <Modal title={`Link ${rma.number} to Quality`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={async () => { const r = await act(() => put(erpPath(companyId, `/rmas/${rma.id}/quality`), { inspectionId: f.inspectionId || null, ncrId: f.ncrId || null }), 'Linked'); if (r) onClose(); }}>Save</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="ql-i">Inspection</label><select id="ql-i" className="select" value={f.inspectionId} onChange={(e) => setF({ ...f, inspectionId: e.target.value })}><option value="">None</option>{insp.data?.inspections.map((x) => <option key={x.id} value={x.id}>{x.number} {x.productNumber ?? ''}</option>)}</select></div>
        <div className="field span-2"><label htmlFor="ql-n">Nonconformance</label><select id="ql-n" className="select" value={f.ncrId} onChange={(e) => setF({ ...f, ncrId: e.target.value })}><option value="">None</option>{ncrs.data?.ncrs.map((x) => <option key={x.id} value={x.id}>{x.number} {x.title}</option>)}</select></div>
      </div>
      <p className="muted small">Start an inspection or raise a nonconformance in <Link to={qualityPage(companyId)}>Quality</Link>, then link it here.</p>
    </Modal>
  );
}

// ------------------------------------------------------------------ carriers

function CarriersPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Carriers');
  const [archived, setArchived] = useState(false);
  const q = useCarriers(companyId, archived);
  const [edit, setEdit] = useState<Carrier | 'new' | null>(null);
  const act = useAct(companyId);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <div className="row wrap">
        <label className="row erp-toggle"><input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} /> Show archived</label>
        <div className="grow" />
        {me.can['carriers.setup'] ? <button className="btn primary" onClick={() => setEdit('new')}><Icon name="plus" /> New carrier</button> : null}
      </div>
      {!q.data.carriers.length ? <EmptyState icon="map" title="No carriers yet">Add the carriers you ship with: their services and the address of their tracking page.</EmptyState> : (
        <div className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Carrier</th><th>Services</th><th>Tracking page</th><th className="num">Shipments</th><th /></tr></thead>
              <tbody>
                {q.data.carriers.map((c) => (
                  <tr key={c.id}>
                    <td data-label="Carrier"><span className="mt-num">{c.code}</span> {c.name}{c.archived ? <span className="badge">Archived</span> : null}{c.email ? <div className="muted small">{c.email}</div> : null}</td>
                    <td data-label="Services">{c.services.join(', ')}</td>
                    <td data-label="Tracking page" className="small">{c.trackingUrl ? <span className="erp-path">{c.trackingUrl}</span> : ''}</td>
                    <td data-label="Shipments" className="num">{c.shipments ?? 0}</td>
                    <td className="erp-actions">{me.can['carriers.setup'] ? <><button className="btn sm" onClick={() => setEdit(c)}>Change</button> <button className="btn sm" onClick={() => void act(() => patch(erpPath(companyId, `/carriers/${c.id}`), { archived: !c.archived }), c.archived ? 'Carrier restored' : 'Carrier archived')}>{c.archived ? 'Restore' : 'Archive'}</button></> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {edit ? <CarrierDialog companyId={companyId} carrier={edit === 'new' ? null : edit} onClose={() => setEdit(null)} /> : null}
    </div>
  );
}

function CarrierDialog({ companyId, carrier, onClose }: { companyId: string; carrier: Carrier | null; onClose: () => void }) {
  const act = useAct(companyId);
  const [f, setF] = useState({ code: carrier?.code ?? '', name: carrier?.name ?? '', services: carrier?.services.join(', ') ?? '', trackingUrl: carrier?.trackingUrl ?? '', phone: carrier?.phone ?? '', email: carrier?.email ?? '', accountRef: carrier?.accountRef ?? '', notes: carrier?.notes ?? '' });
  const save = async () => {
    const body = { ...f, services: f.services.split(',').map((x) => x.trim()).filter(Boolean) };
    const r = await act(() => (carrier ? patch(erpPath(companyId, `/carriers/${carrier.id}`), body) : post(erpPath(companyId, '/carriers'), body)), carrier ? 'Carrier saved' : 'Carrier added');
    if (r) onClose();
  };
  return (
    <Modal title={carrier ? `Change ${carrier.name}` : 'New carrier'} wide onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.code.trim() || !f.name.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="ca-c">Code</label><input id="ca-c" className="input" maxLength={40} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></div>
        <div className="field"><label htmlFor="ca-n">Name</label><input id="ca-n" className="input" maxLength={200} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="ca-s">Services, separated by commas</label><input id="ca-s" className="input" value={f.services} onChange={(e) => setF({ ...f, services: e.target.value })} placeholder="Road, Overnight" /></div>
        <div className="field span-2"><label htmlFor="ca-t">Tracking page</label><input id="ca-t" className="input" maxLength={500} value={f.trackingUrl} onChange={(e) => setF({ ...f, trackingUrl: e.target.value })} placeholder="https://carrier.example.com/track?n={tracking}" /></div>
        <div className="field"><label htmlFor="ca-e">Email</label><input id="ca-e" className="input" type="email" maxLength={254} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="field"><label htmlFor="ca-p">Phone</label><input id="ca-p" className="input" maxLength={50} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        <div className="field"><label htmlFor="ca-a">Account number</label><input id="ca-a" className="input" maxLength={100} value={f.accountRef} onChange={(e) => setF({ ...f, accountRef: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="ca-no">Notes</label><textarea id="ca-no" className="textarea" rows={2} maxLength={2000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      <p className="muted small">The tracking page needs https and {'{tracking}'} where the tracking number goes.</p>
    </Modal>
  );
}

