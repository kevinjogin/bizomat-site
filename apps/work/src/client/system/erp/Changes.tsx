// BIZOMAT ERP, Release 1: engineering change control. Change requests (what should change and why) and change orders
// (the revisions that carry the change, drafted, submitted, approved and released). Releasing a change order releases
// its revisions and supersedes the earlier ones in one step. The server enforces who may approve and release
// (segregation of duties); the screens show the reason when a button is missing.
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import { ECO_STATUS, ECR_STATUS, dayText, erpPath, productsPage, type ChangeOrder, type ChangeRequest, type ErpEvent, type ErpMe, type Revision } from './api';
import { CsvLink, EcoBadge, EcrBadge, History, Pager, Props, RevisionBadge, Section, options } from './common';
import { ProductPicker, type PickedProduct } from './Products';

// ------------------------------------------------------------------ the lists

export function ChangesPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Engineering changes');
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'requests' ? 'requests' : 'orders';
  const status = params.get('status') ?? '';
  const q = params.get('q') ?? '';
  const offset = Number(params.get('offset')) || 0;
  const limit = 50;
  const set = (k: string, v: string) =>
    setParams((p) => {
      const n = new URLSearchParams(p);
      if (v) n.set(k, v);
      else n.delete(k);
      if (k !== 'offset') n.delete('offset');
      if (k === 'view') n.delete('status');
      return n;
    }, { replace: true });
  const filters = new URLSearchParams();
  if (status) filters.set('status', status);
  if (q) filters.set('q', q);
  const path = view === 'orders' ? '/change-orders' : '/change-requests';
  const list = useQuery({ queryKey: ['erp', companyId, view, filters.toString(), offset], queryFn: () => get<{ orders?: ChangeOrder[]; requests?: ChangeRequest[]; total: number }>(erpPath(companyId, `${path}?${filters}&limit=${limit}&offset=${offset}`)) });
  const [creating, setCreating] = useState<'' | 'eco' | 'ecr'>('');
  const navigate = useNavigate();
  const rows = view === 'orders' ? list.data?.orders : list.data?.requests;
  return (
    <div className="stack">
      <div className="row wrap">
        <nav className="tabs grow" aria-label="Change views">
          <button className={`tab${view === 'orders' ? ' active' : ''}`} aria-current={view === 'orders' ? 'page' : undefined} onClick={() => set('view', '')}>Change orders</button>
          <button className={`tab${view === 'requests' ? ' active' : ''}`} aria-current={view === 'requests' ? 'page' : undefined} onClick={() => set('view', 'requests')}>Change requests</button>
        </nav>
        <CsvLink companyId={companyId} path={`${path}?${filters}`} />
        {me.can['changes.raise'] ? <button className="btn" onClick={() => setCreating('ecr')}><Icon name="flag" /> New change request</button> : null}
        {me.can['changes.raise'] ? <button className="btn primary" onClick={() => setCreating('eco')}><Icon name="plus" /> New change order</button> : null}
      </div>
      <div className="row wrap mt-toolbar">
        <div className="crm-search"><Icon name="search" /><input className="input" type="search" aria-label="Search changes" placeholder="Number or title" value={q} onChange={(e) => set('q', e.target.value)} /></div>
        <select className="select" aria-label="Status" value={status} onChange={(e) => set('status', e.target.value)}>
          <option value="">Any status</option>
          <option value="open">Open</option>
          {options(view === 'orders' ? ECO_STATUS : ECR_STATUS)}
        </select>
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!rows ? <Loading /> : !rows.length ? (
          <EmptyState icon="history" title={view === 'orders' ? 'No change orders' : 'No change requests'}>
            {view === 'orders' ? 'A change order carries new revisions of products to release: drafted by an engineer, approved and released by an engineering approver.' : 'A change request says what should change and why. An engineering approver reviews it; an approved request becomes a change order.'}
          </EmptyState>
        ) : view === 'orders' ? (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Title</th><th>Status</th><th className="num">Revisions</th><th>Drafted by</th><th>Released</th></tr></thead>
              <tbody>
                {(rows as ChangeOrder[]).map((o) => (
                  <tr key={o.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={productsPage(companyId, `/changes/orders/${o.id}`)}>{o.number}</Link></td>
                    <td data-label="Title">{o.title}{o.requestNumber ? <span className="muted small"> · from {o.requestNumber}</span> : null}</td>
                    <td data-label="Status"><EcoBadge value={o.status} />{o.sodException ? <span className="badge warning" title="Approved by the person who drafted it: allowed in a one-person company, and recorded">Exception</span> : null}</td>
                    <td data-label="Revisions" className="num">{o.revisionCount}</td>
                    <td data-label="Drafted by">{o.createdByName}</td>
                    <td data-label="Released">{o.releasedAt ? dayText(o.releasedAt) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Title</th><th>Status</th><th className="num">Products</th><th>Raised by</th><th>Raised</th></tr></thead>
              <tbody>
                {(rows as ChangeRequest[]).map((r) => (
                  <tr key={r.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={productsPage(companyId, `/changes/requests/${r.id}`)}>{r.number}</Link></td>
                    <td data-label="Title">{r.title}</td>
                    <td data-label="Status"><EcrBadge value={r.status} /></td>
                    <td data-label="Products" className="num">{r.productCount}</td>
                    <td data-label="Raised by">{r.requestedByName}</td>
                    <td data-label="Raised">{dayText(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {creating ? <NewChangeDialog companyId={companyId} kind={creating} onClose={() => setCreating('')} onDone={(p) => navigate(productsPage(companyId, p))} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ new request or order

export function NewChangeDialog({ companyId, kind, products: preset = [], requestId, onClose, onDone }: { companyId: string; kind: 'eco' | 'ecr'; products?: PickedProduct[]; requestId?: string; onClose: () => void; onDone: (path: string) => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [f, setF] = useState({ title: '', description: '', reason: '' });
  const [products, setProducts] = useState<PickedProduct[]>(preset);
  const [picking, setPicking] = useState<PickedProduct | null>(null);
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const add = (p: PickedProduct | null) => {
    if (p && !products.some((x) => x.id === p.id)) setProducts((ps) => [...ps, p]);
    setPicking(null);
  };
  const save = async () => {
    setBusy(true);
    try {
      const body = { ...f, ...(requestId ? { requestId } : {}), ...(products.length || !requestId ? { productIds: products.map((p) => p.id) } : {}) };
      const made = await post<{ id: string; number: string }>(erpPath(companyId, kind === 'eco' ? '/change-orders' : '/change-requests'), body);
      toast(kind === 'eco' ? `Change order ${made.number} drafted` : `Change request ${made.number} raised`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      onClose();
      onDone(kind === 'eco' ? `/changes/orders/${made.id}` : `/changes/requests/${made.id}`);
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={kind === 'eco' ? 'New change order' : 'New change request'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.title.trim()} onClick={() => void save()}>{busy ? 'Saving…' : kind === 'eco' ? 'Draft the change order' : 'Raise the request'}</button></>}>
      <div className="stack">
        <p className="muted small">
          {kind === 'eco'
            ? 'Each product gets a new revision in this change order (or its open draft revision), with the lines of its released revision to change. Revisions can change while the order is a draft; they lock when it is submitted.'
            : 'Say what should change and why. An engineering approver reviews it. Nothing changes until a change order is released.'}
        </p>
        <div className="crm-form-grid">
          <div className="field crm-span"><label htmlFor="erpc-t">Title (required)</label><input id="erpc-t" className="input" maxLength={200} value={f.title} onChange={field('title')} /></div>
          <div className="field crm-span"><label htmlFor="erpc-r">Reason</label><input id="erpc-r" className="input" maxLength={2000} value={f.reason} onChange={field('reason')} /></div>
          <div className="field crm-span"><label htmlFor="erpc-d">Description</label><textarea id="erpc-d" className="textarea" rows={3} maxLength={5000} value={f.description} onChange={field('description')} /></div>
        </div>
        <div className="stack">
          <strong className="small">{kind === 'eco' ? 'Products it changes' : 'Products concerned'}</strong>
          {products.length ? (
            <ul className="erp-list">
              {products.map((p) => <li key={p.id} className="row"><span className="mt-num">{p.number}</span> <span className="grow">{p.name}</span><button type="button" className="btn ghost icon sm" aria-label={`Remove ${p.number}`} onClick={() => setProducts((ps) => ps.filter((x) => x.id !== p.id))}><Icon name="x" size={14} /></button></li>)}
            </ul>
          ) : requestId ? <p className="muted small">The products of the change request.</p> : <p className="muted small">None yet.</p>}
          <ProductPicker companyId={companyId} id="erpc-p" label="Add a product" value={picking} onChange={add} exclude={products.map((p) => p.id)} />
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ one change order

interface EcoRevision extends Revision {
  productNumber: string;
  productName: string;
  lineCount: number;
  previousId: string | null;
  previousLabel: string | null;
}
interface EcoView {
  order: ChangeOrder;
  revisions: EcoRevision[];
  history: ErpEvent[];
  can: { edit: boolean; submit: boolean; approve: boolean; returnToDraft: boolean; release: boolean; cancel: boolean; segregation: string | null };
}

export function ChangeOrderDetail({ companyId, me }: { companyId: string; me: ErpMe }) {
  const { orderId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['erp', companyId, 'eco', orderId], queryFn: () => get<EcoView>(erpPath(companyId, `/change-orders/${orderId}`)), retry: false });
  const [ask, setAsk] = useState<'' | 'return' | 'cancel' | 'approve' | 'edit'>('');
  const [picking, setPicking] = useState<PickedProduct | null>(null);
  usePageTitle(q.data ? `${q.data.order.number} ${q.data.order.title}` : 'Change order');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { order: o, revisions, can } = q.data;
  const refresh = () => qc.invalidateQueries({ queryKey: ['erp', companyId] });
  const act = async (path: string, body: unknown, done: string) => {
    try {
      await post(erpPath(companyId, `/change-orders/${o.id}/${path}`), body);
      toast(done);
      setAsk('');
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const release = async () => {
    if (!(await confirm({ title: `Release ${o.number}?`, message: `${revisions.map((r) => `${r.productNumber} revision ${r.label}`).join(', ')} become released and locked; each product’s earlier released revision becomes superseded. This cannot be undone: later changes need a new change order.`, confirmLabel: 'Release' }))) return;
    await act('release', {}, `${o.number} released`);
  };
  const addProduct = async (p: PickedProduct | null) => {
    setPicking(null);
    if (!p) return;
    try {
      await post(erpPath(companyId, `/change-orders/${o.id}/products`), { productId: p.id });
      toast(`${p.number} added`);
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const removeRevision = async (r: EcoRevision) => {
    if (!(await confirm({ title: `Take ${r.productNumber} revision ${r.label} out?`, message: 'The revision stays as a draft of the product, with its lines.', confirmLabel: 'Take it out' }))) return;
    try {
      await del(erpPath(companyId, `/change-orders/${o.id}/revisions/${r.id}`));
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={productsPage(companyId, '/changes')}>Changes</Link><span className="sep">/</span><span>{o.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{o.number}</span> {o.title}</h2>
          <div className="mt-badges">
            <EcoBadge value={o.status} />
            {o.requestNumber ? <Link className="badge" to={productsPage(companyId, `/changes/requests/${o.requestId}`)}>From {o.requestNumber}</Link> : null}
            {o.sodException ? <span className="badge warning">Recorded exception: approved by the person who drafted it (one-person company)</span> : null}
          </div>
        </div>
        <div className="mt-head-actions">
          {can.edit ? <button className="btn" onClick={() => setAsk('edit')}><Icon name="edit" /> Edit</button> : null}
          {can.submit ? <button className="btn primary" disabled={!revisions.length} onClick={() => void act('submit', {}, `${o.number} submitted for approval`)}><Icon name="check" /> Submit for approval</button> : null}
          {can.approve ? <button className="btn primary" onClick={() => setAsk('approve')}><Icon name="check" /> Approve</button> : null}
          {can.release ? <button className="btn primary" onClick={() => void release()}><Icon name="flag" /> Release</button> : null}
          {can.returnToDraft ? <button className="btn" onClick={() => setAsk('return')}><Icon name="undo" /> Return to draft</button> : null}
          {can.cancel ? <button className="btn ghost" onClick={() => setAsk('cancel')}><Icon name="x" /> Cancel</button> : null}
        </div>
      </div>
      {can.segregation ? <p className="warn-box small"><Icon name="info" size={14} /> {can.segregation}</p> : null}
      {o.status === 'draft' && !me.can['changes.approve'] ? <p className="muted small">Submit it when the revisions are ready. An engineering approver then approves and releases it.</p> : null}
      <div className="mt-grid">
        <div className="stack">
          <Section title="Details">
            <Props
              items={[
                ['Reason', o.reason],
                ['Drafted', `${dayText(o.createdAt)}${o.createdByName ? ` by ${o.createdByName}` : ''}`],
                ['Submitted', dayText(o.submittedAt)],
                ['Approved', o.approvedAt ? `${dayText(o.approvedAt)}${o.approvedByName ? ` by ${o.approvedByName}` : ''}` : ''],
                ['Released', o.releasedAt ? `${dayText(o.releasedAt)}${o.releasedByName ? ` by ${o.releasedByName}` : ''}` : ''],
                ['Cancelled', dayText(o.cancelledAt)],
                ['Decision note', o.decisionNote],
              ]}
            />
            {o.description ? <p className="mt-pre small">{o.description}</p> : null}
          </Section>
        </div>
        <div className="stack">
          <Section title="Revisions in this change order">
            {!revisions.length ? <p className="muted">No revisions yet. Add the products this change order changes.</p> : (
              <div className="crm-table-scroll">
                <table className="data-table responsive">
                  <thead><tr><th>Product</th><th>Revision</th><th className="num">Lines</th><th>Replaces</th>{can.edit ? <th><span className="sr-only">Actions</span></th> : null}</tr></thead>
                  <tbody>
                    {revisions.map((r) => (
                      <tr key={r.id}>
                        <td data-label="Product"><Link to={productsPage(companyId, `/${r.productId}`)}><span className="mt-num">{r.productNumber}</span> {r.productName}</Link></td>
                        <td data-label="Revision"><Link to={productsPage(companyId, `/${r.productId}?tab=structure&revision=${r.id}`)}>{r.label}</Link> <RevisionBadge value={r.status} /></td>
                        <td data-label="Lines" className="num">{r.lineCount}</td>
                        <td data-label="Replaces">{r.previousId ? <Link to={productsPage(companyId, `/${r.productId}?tab=revisions&a=${r.previousId}&b=${r.id}`)}>Revision {r.previousLabel}: compare</Link> : <span className="muted">First release</span>}</td>
                        {can.edit ? <td className="erp-actions"><button className="btn ghost icon sm" aria-label={`Take ${r.productNumber} out`} onClick={() => void removeRevision(r)}><Icon name="trash" size={14} /></button></td> : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {can.edit ? <ProductPicker companyId={companyId} id="erpo-add" label="Add a product" value={picking} onChange={(p) => void addProduct(p)} exclude={revisions.map((r) => r.productId)} /> : null}
          </Section>
          <Section title="History"><History events={q.data.history as any} /></Section>
        </div>
      </div>
      {ask === 'approve' ? <NoteDialog title={`Approve ${o.number}`} label="Note (optional)" confirm="Approve" onClose={() => setAsk('')} onSave={(note) => act('approve', { note }, `${o.number} approved`)} /> : null}
      {ask === 'return' ? <NoteDialog title={`Return ${o.number} to draft`} label="What needs to change (required)" required confirm="Return to draft" onClose={() => setAsk('')} onSave={(note) => act('return', { note }, `${o.number} returned to draft`)} /> : null}
      {ask === 'cancel' ? <NoteDialog title={`Cancel ${o.number}`} label="Why (optional)" confirm="Cancel the change order" danger onClose={() => setAsk('')} onSave={(note) => act('cancel', { note }, `${o.number} cancelled; its revisions stay as drafts`)} /> : null}
      {ask === 'edit' ? <EditOrderDialog companyId={companyId} order={o} onClose={() => { setAsk(''); void refresh(); }} /> : null}
    </div>
  );
}

function EditOrderDialog({ companyId, order, onClose }: { companyId: string; order: ChangeOrder; onClose: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ title: order.title, reason: order.reason, description: order.description });
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const save = async () => {
    setBusy(true);
    try {
      await patch(erpPath(companyId, `/change-orders/${order.id}`), f);
      toast('Saved');
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`Edit ${order.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.title.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="erpe-t">Title</label><input id="erpe-t" className="input" maxLength={200} value={f.title} onChange={field('title')} /></div>
        <div className="field"><label htmlFor="erpe-r">Reason</label><input id="erpe-r" className="input" maxLength={2000} value={f.reason} onChange={field('reason')} /></div>
        <div className="field"><label htmlFor="erpe-d">Description</label><textarea id="erpe-d" className="textarea" rows={4} maxLength={5000} value={f.description} onChange={field('description')} /></div>
      </div>
    </Modal>
  );
}

export function NoteDialog({ title, label, confirm, required, danger, onClose, onSave }: { title: string; label: string; confirm: string; required?: boolean; danger?: boolean; onClose: () => void; onSave: (note: string) => Promise<void> }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await onSave(note.trim());
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className={`btn ${danger ? 'danger' : 'primary'}`} disabled={busy || (required && !note.trim())} onClick={() => void save()}>{busy ? 'Saving…' : confirm}</button></>}>
      <div className="field"><label htmlFor="erp-note">{label}</label><textarea id="erp-note" className="textarea" rows={3} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
    </Modal>
  );
}

// ------------------------------------------------------------------ one change request

interface EcrView {
  request: ChangeRequest;
  products: { id: string; number: string; name: string; type: string }[];
  changeOrders: { id: string; number: string; title: string; status: string; statusLabel: string }[];
  history: ErpEvent[];
  can: { review: boolean; decide: boolean; raiseOrder: boolean };
}

export function ChangeRequestDetail({ companyId }: { companyId: string; me: ErpMe }) {
  const { requestId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ['erp', companyId, 'ecr', requestId], queryFn: () => get<EcrView>(erpPath(companyId, `/change-requests/${requestId}`)), retry: false });
  const [ask, setAsk] = useState<'' | 'approve' | 'reject' | 'order'>('');
  usePageTitle(q.data ? `${q.data.request.number} ${q.data.request.title}` : 'Change request');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { request: r, can } = q.data;
  const act = async (path: string, body: unknown, done: string) => {
    try {
      await post(erpPath(companyId, `/change-requests/${r.id}/${path}`), body);
      toast(done);
      setAsk('');
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={productsPage(companyId, '/changes?view=requests')}>Change requests</Link><span className="sep">/</span><span>{r.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{r.number}</span> {r.title}</h2>
          <div className="mt-badges"><EcrBadge value={r.status} /></div>
        </div>
        <div className="mt-head-actions">
          {can.review ? <button className="btn" onClick={() => void act('review', {}, `${r.number} taken under review`)}>Take under review</button> : null}
          {can.decide ? <button className="btn primary" onClick={() => setAsk('approve')}><Icon name="check" /> Approve</button> : null}
          {can.decide ? <button className="btn ghost" onClick={() => setAsk('reject')}><Icon name="x" /> Reject</button> : null}
          {can.raiseOrder ? <button className="btn primary" onClick={() => setAsk('order')}><Icon name="plus" /> Make a change order</button> : null}
        </div>
      </div>
      <div className="mt-grid">
        <Section title="Details">
          <Props items={[['Reason', r.reason], ['Raised', `${dayText(r.createdAt)}${r.requestedByName ? ` by ${r.requestedByName}` : ''}`], ['Decided', r.decidedAt ? `${dayText(r.decidedAt)}${r.decidedByName ? ` by ${r.decidedByName}` : ''}` : ''], ['Decision note', r.decisionNote]]} />
          {r.description ? <p className="mt-pre small">{r.description}</p> : null}
        </Section>
        <div className="stack">
          <Section title="Products concerned">
            {q.data.products.length ? <ul className="erp-list">{q.data.products.map((p) => <li key={p.id}><Link to={productsPage(companyId, `/${p.id}`)}><span className="mt-num">{p.number}</span> {p.name}</Link></li>)}</ul> : <p className="muted small">None named.</p>}
          </Section>
          <Section title="Change orders">
            {q.data.changeOrders.length ? <ul className="erp-list">{q.data.changeOrders.map((o) => <li key={o.id}><Link to={productsPage(companyId, `/changes/orders/${o.id}`)}><span className="mt-num">{o.number}</span> {o.title}</Link> <EcoBadge value={o.status} /></li>)}</ul> : <p className="muted small">None yet.{r.status === 'approved' ? '' : ' An approved request becomes a change order.'}</p>}
          </Section>
          <Section title="History"><History events={q.data.history as any} /></Section>
        </div>
      </div>
      {ask === 'approve' ? <NoteDialog title={`Approve ${r.number}`} label="Note (optional)" confirm="Approve" onClose={() => setAsk('')} onSave={(note) => act('decide', { decision: 'approved', note }, `${r.number} approved`)} /> : null}
      {ask === 'reject' ? <NoteDialog title={`Reject ${r.number}`} label="Why (required)" required danger confirm="Reject" onClose={() => setAsk('')} onSave={(note) => act('decide', { decision: 'rejected', note }, `${r.number} rejected`)} /> : null}
      {ask === 'order' ? <NewChangeDialog companyId={companyId} kind="eco" requestId={r.id} onClose={() => setAsk('')} onDone={(p) => navigate(productsPage(companyId, p))} /> : null}
    </div>
  );
}
