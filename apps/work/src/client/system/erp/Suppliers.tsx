// BIZOMAT ERP: Procurement at /erp/c/<company>/procurement. Release 1: the supplier master. Suppliers are approved, put
// on hold or blocked by a procurement manager who did not create them; an ABN's form and check digits are checked,
// nothing more. Payment stays in Finance: a supplier links to the Finance supplier contact it is paid as. Release 2
// (Purchasing.tsx): requisitions, requests for quotation, purchase orders, goods receipts and supplier performance.
import { useState, type FormEvent } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, del, errorMessage, get, patch, post } from '../../lib/api';
import { toolUrl } from '../../lib/base';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import { SUPPLIER_STATUS, dayText, erpPath, money, numOrNull, procurementPage, productsPage, qualityPage, useErpMe, type ErpEvent, type ErpFile, type ErpMe, type Supplier } from './api';
import { CsvLink, ErpFiles, ErpUpload, FilterPanel, History, Pager, Props, Section, SupplierBadge, options } from './common';
import { NoteDialog } from './Changes';
import { SupplierPortalPanel } from './SupplierPortal';
import { PoEditor, PurchaseOrderDetail, PurchaseOrdersPage, ReceiptDetail, ReceiptsPage, RequisitionDetail, RequisitionsPage, RfqDetail, RfqsPage } from './Purchasing';

export function ProcurementArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const me = useErpMe(companyId);
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Procurement" />
          <section className="co-prompt"><p>You do not have access to procurement in {companyName}. People in the company have access; people who only share a tool with it do not.</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening Procurement…" />;
  const m = me.data;
  return (
    <div className="page crm-page">
      <PageHeader title="Procurement" subtitle={`Buying for ${m.company.name}: suppliers, requisitions, requests for quotation, purchase orders and goods receipts.`} />
      <nav className="tabs mt-tabs erp-area-tabs" aria-label="Procurement sections">
        <NavLink to={procurementPage(companyId)} end className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="building" size={14} /> Suppliers</NavLink>
        <NavLink to={procurementPage(companyId, '/requisitions')} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="doc" size={14} /> Requisitions</NavLink>
        <NavLink to={procurementPage(companyId, '/rfqs')} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="message" size={14} /> Quotations</NavLink>
        <NavLink to={procurementPage(companyId, '/purchase-orders')} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="briefcase" size={14} /> Purchase orders</NavLink>
        <NavLink to={procurementPage(companyId, '/receipts')} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="inbox" size={14} /> Receipts</NavLink>
      </nav>
      <Routes>
        <Route index element={<SuppliersPage companyId={companyId} me={m} />} />
        <Route path="suppliers/:supplierId" element={<SupplierDetail companyId={companyId} me={m} />} />
        <Route path="requisitions" element={<RequisitionsPage companyId={companyId} me={m} />} />
        <Route path="requisitions/:id" element={<RequisitionDetail companyId={companyId} />} />
        <Route path="rfqs" element={<RfqsPage companyId={companyId} me={m} />} />
        <Route path="rfqs/:id" element={<RfqDetail companyId={companyId} />} />
        <Route path="purchase-orders" element={<PurchaseOrdersPage companyId={companyId} me={m} />} />
        <Route path="purchase-orders/new" element={<PoEditor companyId={companyId} />} />
        <Route path="purchase-orders/:id/edit" element={<PoEditor companyId={companyId} />} />
        <Route path="purchase-orders/:id" element={<PurchaseOrderDetail companyId={companyId} />} />
        <Route path="receipts" element={<ReceiptsPage companyId={companyId} />} />
        <Route path="receipts/:id" element={<ReceiptDetail companyId={companyId} me={m} />} />
        <Route path="*" element={<Navigate to={procurementPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

function SuppliersPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Suppliers');
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) =>
    setParams((p) => {
      const n = new URLSearchParams(p);
      if (v) n.set(k, v);
      else n.delete(k);
      if (k !== 'offset') n.delete('offset');
      return n;
    }, { replace: true });
  const offset = Number(g('offset')) || 0;
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'category', 'archived', 'sort', 'dir']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'suppliers', filters.toString(), offset], queryFn: () => get<{ suppliers: Supplier[]; total: number; categories: string[]; can: { create: boolean } }>(erpPath(companyId, `/suppliers?${filters}&limit=${limit}&offset=${offset}`)) });
  const [creating, setCreating] = useState(false);
  if (!me.can['suppliers.view']) return <p className="muted">Your ERP roles do not include suppliers.</p>;
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/suppliers?${filters}`} />
        {me.can['suppliers.edit'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New supplier</button> : null}
      </div>
      <FilterPanel active={['q', 'status', 'category', 'archived'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="erps-q">Search</label><input id="erps-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, name, ABN, email" /></div>
        <div className="field"><label htmlFor="erps-st">Status</label><select id="erps-st" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Any</option>{options(SUPPLIER_STATUS)}</select></div>
        <div className="field"><label htmlFor="erps-cat">Category</label><select id="erps-cat" className="select" value={g('category')} onChange={(e) => set('category', e.target.value)}><option value="">Any</option>{(list.data?.categories ?? []).map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="field"><label htmlFor="erps-arch">Show</label><select id="erps-arch" className="select" value={g('archived')} onChange={(e) => set('archived', e.target.value)}><option value="">In use</option><option value="1">Archived</option></select></div>
        <div className="field"><label htmlFor="erps-sort">Sort by</label><select id="erps-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Number</option><option value="name">Name</option><option value="status">Status</option><option value="category">Category</option><option value="updated">Recently changed</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.suppliers.length ? (
          <EmptyState icon="building" title={filters.toString() ? 'No suppliers match' : 'No suppliers yet'} action={!filters.toString() && me.can['suppliers.edit'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New supplier</button> : undefined}>
            {filters.toString() ? 'Try other words or remove a filter.' : 'Add the businesses you buy from. A procurement manager approves each one before it is used.'}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Name</th><th>Category</th><th>Status</th><th className="num">Products</th><th>Payment terms</th><th>Finance</th></tr></thead>
              <tbody>
                {list.data.suppliers.map((s) => (
                  <tr key={s.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={procurementPage(companyId, `/suppliers/${s.id}`)}>{s.number}</Link></td>
                    <td data-label="Name">{s.name}{s.tradingName && s.tradingName !== s.legalName ? <div className="muted small">{s.legalName}</div> : null}</td>
                    <td data-label="Category">{s.category}</td>
                    <td data-label="Status"><SupplierBadge value={s.status} /></td>
                    <td data-label="Products" className="num">{s.productCount}</td>
                    <td data-label="Payment terms">{s.paymentTermsDays !== null ? `${s.paymentTermsDays} days` : ''}</td>
                    <td data-label="Finance">{s.financeLinked ? <span className="badge success">Linked</span> : <span className="muted small">Not linked</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {creating ? <SupplierFormDialog companyId={companyId} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}

function SupplierFormDialog({ companyId, supplier, onClose }: { companyId: string; supplier?: Supplier; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const s = supplier;
  const [f, setF] = useState({
    number: s?.number ?? '',
    legalName: s?.legalName ?? '',
    tradingName: s?.tradingName ?? '',
    abn: s?.abn ?? '',
    category: s?.category ?? '',
    email: s?.email ?? '',
    phone: s?.phone ?? '',
    website: s?.website ?? '',
    postalAddress: s?.postalAddress ?? '',
    deliveryAddress: s?.deliveryAddress ?? '',
    paymentTermsDays: s?.paymentTermsDays?.toString() ?? '',
    currency: s?.currency ?? 'AUD',
    deliveryTerms: s?.deliveryTerms ?? '',
    leadTimeDays: s?.leadTimeDays?.toString() ?? '',
    notes: s?.notes ?? '',
  });
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const text = (k: keyof typeof f, label: string, max: number, extra: Record<string, unknown> = {}) => (
    <div className="field">
      <label htmlFor={`erpsf-${k}`}>{label}</label>
      <input id={`erpsf-${k}`} className="input" maxLength={max} value={f[k]} onChange={field(k)} {...extra} />
    </div>
  );
  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    const body = { ...f, number: f.number.trim() || undefined, paymentTermsDays: numOrNull(f.paymentTermsDays), leadTimeDays: numOrNull(f.leadTimeDays) };
    try {
      const saved = s ? await patch<Supplier>(erpPath(companyId, `/suppliers/${s.id}`), body) : await post<Supplier>(erpPath(companyId, '/suppliers'), body);
      toast(s ? (saved.status === 'pending' && s.status === 'approved' ? 'Saved. The legal name or ABN changed, so it needs approval again.' : 'Saved') : `Supplier ${saved.number} added: it needs approval before it is used`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      onClose();
      if (!s) navigate(procurementPage(companyId, `/suppliers/${saved.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={s ? `Edit ${s.number}` : 'New supplier'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.legalName.trim()} onClick={() => void save()}>{busy ? 'Saving…' : s ? 'Save' : 'Add the supplier'}</button></>}>
      <form onSubmit={save} className="stack">
        <fieldset className="mt-form-section">
          <legend>The business</legend>
          <div className="crm-form-grid">
            {text('legalName', 'Legal name (required)', 200, { required: true })}
            {text('tradingName', 'Trading name', 200)}
            {text('number', 'Supplier number', 40, { placeholder: s ? '' : 'Leave blank for the next number' })}
            {text('abn', 'ABN', 20, { inputMode: 'numeric', placeholder: '11 digits' })}
            {text('category', 'Category', 80, { placeholder: 'For example: Steel, Fasteners' })}
          </div>
          <p className="muted small">An ABN is checked for its form and check digits only. It is not looked up on the Australian Business Register.</p>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Contact</legend>
          <div className="crm-form-grid">
            {text('email', 'Email', 320, { type: 'email' })}
            {text('phone', 'Phone', 40)}
            {text('website', 'Website', 300, { placeholder: 'https://' })}
            <div className="field crm-span"><label htmlFor="erpsf-post">Postal address</label><textarea id="erpsf-post" className="textarea" rows={2} maxLength={500} value={f.postalAddress} onChange={field('postalAddress')} /></div>
            <div className="field crm-span"><label htmlFor="erpsf-del">Delivery address</label><textarea id="erpsf-del" className="textarea" rows={2} maxLength={500} value={f.deliveryAddress} onChange={field('deliveryAddress')} /></div>
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Terms</legend>
          <div className="crm-form-grid">
            {text('paymentTermsDays', 'Payment terms (days)', 3, { inputMode: 'numeric' })}
            {text('currency', 'Currency', 3)}
            {text('leadTimeDays', 'Usual lead time (days)', 4, { inputMode: 'numeric' })}
            {text('deliveryTerms', 'Delivery terms', 200)}
            <div className="field crm-span"><label htmlFor="erpsf-notes">Notes</label><textarea id="erpsf-notes" className="textarea" rows={2} maxLength={5000} value={f.notes} onChange={field('notes')} /></div>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}

interface FinanceView {
  linked: boolean;
  orgName?: string | null;
  contact: { id: string; name: string; url: string } | null;
  hidden?: boolean;
  orgs: { id: string; name: string; access: boolean; canPick: boolean; canCreate: boolean }[];
  canLink: boolean;
}

interface SupplierView {
  supplier: Supplier;
  abnNote: string | null;
  contacts: { id: string; name: string; role: string; email: string; phone: string; isPrimary: boolean }[];
  products: { productId: string; number: string; name: string; supplierPartNumber: string; priceCents: number | null; currency: string; leadTimeDays: number | null; preferred: boolean }[];
  files: ErpFile[];
  finance: FinanceView;
  // Release 4: quality figures over the last year, read only (null without quality access)
  quality?: { inspections: number; failedInspections: number; inspectionFailRatePct: number | null; rejectedQty: number; ncrs: number; openNcrs: number; returnedQty: number; note: string } | null;
  performance: { measured: true; note: string; orders: number; receipts: number; onTimeRate: number | null; onTimeMeasured: number; inFullRate: number | null; inFullMeasured: number; avgLeadTimeDays: number | null; rejectedQty: number; receivedQty: number };
  history: ErpEvent[];
  can: { edit: boolean; approve: boolean; hold: boolean; block: boolean; segregation: string | null };
}

function SupplierDetail({ companyId, me }: { companyId: string; me: ErpMe }) {
  const { supplierId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['erp', companyId, 'supplier', supplierId], queryFn: () => get<SupplierView>(erpPath(companyId, `/suppliers/${supplierId}`)), retry: false });
  const [ask, setAsk] = useState<'' | 'edit' | 'approved' | 'on_hold' | 'blocked' | 'contact'>('');
  usePageTitle(q.data ? `${q.data.supplier.number} ${q.data.supplier.name}` : 'Supplier');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const s = v.supplier;
  const refresh = () => qc.invalidateQueries({ queryKey: ['erp', companyId] });
  const status = async (to: 'approved' | 'on_hold' | 'blocked', note: string) => {
    try {
      await post(erpPath(companyId, `/suppliers/${s.id}/status`), { status: to, note });
      toast(`${s.number}: ${SUPPLIER_STATUS[to].toLowerCase()}`);
      setAsk('');
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const archive = async () => {
    if (!s.archivedAt && !(await confirm({ title: `Archive ${s.number}?`, message: 'It leaves the supplier list and the pickers. Its history stays, and you can restore it.', confirmLabel: 'Archive' }))) return;
    try {
      await post(erpPath(companyId, `/suppliers/${s.id}/${s.archivedAt ? 'restore' : 'archive'}`), {});
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const removeContact = async (c: { id: string; name: string }) => {
    if (!(await confirm({ title: `Remove ${c.name}?`, message: 'The contact is removed from this supplier.', confirmLabel: 'Remove', danger: true }))) return;
    try {
      await del(erpPath(companyId, `/suppliers/${s.id}/contacts/${c.id}`));
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const makePrimary = async (c: { id: string }) => {
    try {
      await patch(erpPath(companyId, `/suppliers/${s.id}/contacts/${c.id}`), { isPrimary: true });
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const removeFile = async (f: { id: string; name: string }) => {
    if (!(await confirm({ title: `Remove ${f.name}?`, message: 'The file is deleted. The history keeps a note that it was removed.', confirmLabel: 'Remove', danger: true }))) return;
    try {
      await del(erpPath(companyId, `/files/${f.id}`));
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={procurementPage(companyId)}>Suppliers</Link><span className="sep">/</span><span>{s.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{s.number}</span> {s.name}</h2>
          <div className="mt-badges">
            <SupplierBadge value={s.status} />
            {s.category ? <span className="badge">{s.category}</span> : null}
            {s.sodException ? <span className="badge warning">Recorded exception: approved by the person who created it (one-person company)</span> : null}
            {s.archivedAt ? <span className="badge">Archived</span> : null}
          </div>
        </div>
        <div className="mt-head-actions">
          {v.can.edit ? <button className="btn" onClick={() => setAsk('edit')}><Icon name="edit" /> Edit</button> : null}
          {v.can.approve ? <button className="btn primary" onClick={() => setAsk('approved')}><Icon name="check" /> Approve</button> : null}
          {v.can.hold ? <button className="btn" onClick={() => setAsk('on_hold')}>Put on hold</button> : null}
          {v.can.block ? <button className="btn ghost" onClick={() => setAsk('blocked')}>Block</button> : null}
          {me.can['suppliers.edit'] ? <button className="btn ghost" onClick={() => void archive()}><Icon name={s.archivedAt ? 'restore' : 'archive'} /> {s.archivedAt ? 'Restore' : 'Archive'}</button> : null}
        </div>
      </div>
      {v.can.segregation ? <p className="warn-box small"><Icon name="info" size={14} /> {v.can.segregation}</p> : null}
      {s.statusNote ? <p className="small"><strong>{s.statusLabel}:</strong> {s.statusNote}</p> : null}
      <div className="mt-grid">
        <div className="stack">
          <Section title="Details">
            <Props
              items={[
                ['Legal name', s.legalName],
                ['Trading name', s.tradingName],
                ['ABN', s.abn ? <span key="abn">{s.abn} <span className="badge">Format checked</span></span> : ''],
                ['Email', s.email ? <a key="e" href={`mailto:${s.email}`}>{s.email}</a> : ''],
                ['Phone', s.phone],
                ['Website', s.website ? <a key="w" href={s.website} target="_blank" rel="noopener noreferrer">{s.website}</a> : ''],
                ['Postal address', s.postalAddress],
                ['Delivery address', s.deliveryAddress],
                ['Payment terms', s.paymentTermsDays !== null ? `${s.paymentTermsDays} days` : ''],
                ['Currency', s.currency],
                ['Usual lead time', s.leadTimeDays !== null ? `${s.leadTimeDays} days` : ''],
                ['Delivery terms', s.deliveryTerms],
                ['Approved', s.approvedAt ? `${dayText(s.approvedAt)}${s.approvedByName ? ` by ${s.approvedByName}` : ''}` : ''],
                ['Created', `${dayText(s.createdAt)}${s.createdByName ? ` by ${s.createdByName}` : ''}`],
              ]}
            />
            {v.abnNote ? <p className="muted small">{v.abnNote}</p> : null}
            {s.notes ? <p className="mt-pre small">{s.notes}</p> : null}
          </Section>
          <FinancePanel companyId={companyId} supplier={s} finance={v.finance} refresh={refresh} />
          <Section title="Performance">
            {!v.performance.receipts ? <p className="muted small">No goods received from this supplier yet: nothing to measure.</p> : (
              <Props
                items={[
                  ['On time', v.performance.onTimeRate === null ? 'No required dates to measure against' : `${Math.round(v.performance.onTimeRate * 100)}% of ${v.performance.onTimeMeasured} receipt${v.performance.onTimeMeasured === 1 ? '' : 's'}`],
                  ['In full', v.performance.inFullRate === null ? '' : `${Math.round(v.performance.inFullRate * 100)}% of ${v.performance.inFullMeasured} order${v.performance.inFullMeasured === 1 ? '' : 's'}`],
                  ['Average lead time', v.performance.avgLeadTimeDays === null ? '' : `${v.performance.avgLeadTimeDays} days`],
                  ['Damaged or rejected', `${v.performance.rejectedQty} of ${v.performance.receivedQty} received`],
                ]}
              />
            )}
            <p className="muted small">{v.performance.note}</p>
            {v.quality ? (
              <>
                <h3 className="erp-h3">Quality</h3>
                {!v.quality.inspections && !v.quality.ncrs ? <p className="muted small">No inspections or nonconformances in the last year.</p> : (
                  <Props
                    items={[
                      ['Inspections failed', `${v.quality.failedInspections} of ${v.quality.inspections}${v.quality.inspectionFailRatePct !== null ? ` (${v.quality.inspectionFailRatePct}%)` : ''}`],
                      ['Quantity rejected', v.quality.rejectedQty ? String(v.quality.rejectedQty) : ''],
                      ['Nonconformances', v.quality.ncrs ? <Link to={`${qualityPage(companyId, '/ncrs')}?q=${encodeURIComponent(s.legalName)}`}>{v.quality.ncrs}{v.quality.openNcrs ? ` (${v.quality.openNcrs} open)` : ''}</Link> : ''],
                      ['Returned to the supplier', v.quality.returnedQty ? String(v.quality.returnedQty) : ''],
                    ]}
                  />
                )}
                <p className="muted small">{v.quality.note}</p>
              </>
            ) : null}
          </Section>
        </div>
        <div className="stack">
          <Section title="Contacts" actions={v.can.edit ? <button className="btn sm" onClick={() => setAsk('contact')}><Icon name="plus" size={14} /> Add a contact</button> : undefined}>
            {!v.contacts.length ? <p className="muted small">No contacts yet.</p> : (
              <ul className="erp-list">
                {v.contacts.map((c) => (
                  <li key={c.id} className="row wrap">
                    <span className="grow"><strong>{c.name}</strong>{c.role ? <span className="muted small"> · {c.role}</span> : null}{c.isPrimary ? <> <span className="badge success">Primary</span></> : null}<div className="small">{[c.email, c.phone].filter(Boolean).join(' · ')}</div></span>
                    {v.can.edit && !c.isPrimary ? <button className="btn ghost sm" onClick={() => void makePrimary(c)}>Make primary</button> : null}
                    {v.can.edit ? <button className="btn ghost icon sm" aria-label={`Remove ${c.name}`} onClick={() => void removeContact(c)}><Icon name="trash" size={14} /></button> : null}
                  </li>
                ))}
              </ul>
            )}
          </Section>
          <Section title="Products it supplies">
            {!v.products.length ? <p className="muted small">None yet. Add suppliers to a product from its Suppliers tab.</p> : (
              <ul className="erp-list">
                {v.products.map((p) => (
                  <li key={p.productId}><Link to={productsPage(companyId, `/${p.productId}?tab=suppliers`)}><span className="mt-num">{p.number}</span> {p.name}</Link> <span className="muted small">{[p.supplierPartNumber, money(p.priceCents, p.currency), p.leadTimeDays !== null ? `${p.leadTimeDays} days` : ''].filter(Boolean).join(' · ')}</span>{p.preferred ? <> <span className="badge success">Preferred</span></> : null}</li>
                ))}
              </ul>
            )}
          </Section>
          <Section title="Documents" actions={v.can.edit ? <ErpUpload companyId={companyId} target={{ supplierId: s.id }} onDone={refresh} label="Add documents" /> : undefined}>
            <ErpFiles files={v.files} canRemove={v.can.edit} onRemove={(f) => void removeFile(f)} />
          </Section>
          <SupplierPortalPanel companyId={companyId} supplierId={s.id} canEdit={v.can.edit} />
          <Section title="History"><History events={v.history as any} /></Section>
        </div>
      </div>
      {ask === 'edit' ? <SupplierFormDialog companyId={companyId} supplier={s} onClose={() => setAsk('')} /> : null}
      {ask === 'approved' ? <NoteDialog title={`Approve ${s.number}`} label="Note (optional)" confirm="Approve" onClose={() => setAsk('')} onSave={(n) => status('approved', n)} /> : null}
      {ask === 'on_hold' ? <NoteDialog title={`Put ${s.number} on hold`} label="Why (required)" required confirm="Put on hold" onClose={() => setAsk('')} onSave={(n) => status('on_hold', n)} /> : null}
      {ask === 'blocked' ? <NoteDialog title={`Block ${s.number}`} label="Why (required)" required danger confirm="Block" onClose={() => setAsk('')} onSave={(n) => status('blocked', n)} /> : null}
      {ask === 'contact' ? <ContactDialog companyId={companyId} supplierId={s.id} onClose={() => { setAsk(''); void refresh(); }} /> : null}
    </div>
  );
}

function ContactDialog({ companyId, supplierId, onClose }: { companyId: string; supplierId: string; onClose: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ name: '', role: '', email: '', phone: '' });
  const [primary, setPrimary] = useState(false);
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const save = async () => {
    setBusy(true);
    try {
      await post(erpPath(companyId, `/suppliers/${supplierId}/contacts`), { ...f, isPrimary: primary });
      toast('Contact added');
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title="Add a contact" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.name.trim()} onClick={() => void save()}>Add</button></>}>
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="erpct-n">Name (required)</label><input id="erpct-n" className="input" maxLength={120} value={f.name} onChange={field('name')} /></div>
        <div className="field"><label htmlFor="erpct-r">Role</label><input id="erpct-r" className="input" maxLength={80} value={f.role} onChange={field('role')} /></div>
        <div className="field"><label htmlFor="erpct-e">Email</label><input id="erpct-e" className="input" type="email" maxLength={320} value={f.email} onChange={field('email')} /></div>
        <div className="field"><label htmlFor="erpct-p">Phone</label><input id="erpct-p" className="input" maxLength={40} value={f.phone} onChange={field('phone')} /></div>
      </div>
      <label className="checkbox"><input type="checkbox" checked={primary} onChange={(e) => setPrimary(e.target.checked)} /> Primary contact</label>
    </Modal>
  );
}

/** The link to Finance's supplier contact: shown, made (pick or create) or removed, with Finance's own permissions. */
function FinancePanel({ companyId, supplier: s, finance: f, refresh }: { companyId: string; supplier: Supplier; finance: FinanceView; refresh: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [org, setOrg] = useState(f.orgs.find((o) => o.canPick || o.canCreate)?.id ?? f.orgs[0]?.id ?? '');
  const [picking, setPicking] = useState(false);
  const [q, setQ] = useState('');
  const chosen = f.orgs.find((o) => o.id === org);
  const options = useQuery({ queryKey: ['erp', companyId, 'fin-contacts', s.id, org, q], queryFn: () => get<{ contacts: { id: string; name: string; email: string; abn: string }[] }>(erpPath(companyId, `/suppliers/${s.id}/finance/contacts?org=${encodeURIComponent(org)}&q=${encodeURIComponent(q)}`)), enabled: picking && !!chosen?.canPick });
  const link = async (body: Record<string, unknown>) => {
    try {
      await post(erpPath(companyId, `/suppliers/${s.id}/finance`), { finOrgId: org, ...body });
      toast(body.create ? 'Created in Finance and linked' : 'Linked to Finance');
      setPicking(false);
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const unlink = async () => {
    if (!(await confirm({ title: 'Unlink from Finance?', message: 'The link is removed. The supplier in Finance, and its bills, stay as they are.', confirmLabel: 'Unlink' }))) return;
    try {
      await del(erpPath(companyId, `/suppliers/${s.id}/finance`));
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Section title="Finance">
      <p className="muted small">Bills and payments are kept in Finance and Accounting. The supplier is linked to the Finance supplier it is paid as; nothing is copied.</p>
      {f.linked ? (
        <div className="stack">
          {f.contact ? <p>Linked to <a href={toolUrl(f.contact.url)}>{f.contact.name}</a>{f.orgName ? <span className="muted small"> in {f.orgName}</span> : null}.</p> : <p>Linked to a supplier in Finance{f.orgName ? ` (${f.orgName})` : ''}. Your Finance role does not show its details.</p>}
          {f.canLink ? <div className="row"><button className="btn ghost sm" onClick={() => void unlink()}>Unlink</button></div> : null}
        </div>
      ) : !f.orgs.length ? (
        <p className="small">{`${s.name} is not linked. This company has no Finance business workspace to link to yet.`}</p>
      ) : !f.canLink ? (
        <p className="small">Not linked yet. {f.orgs.some((o) => !o.access) ? 'Linking needs a role in the company’s Finance and a buyer or procurement role here.' : 'Linking needs a buyer or procurement role here.'}</p>
      ) : (
        <div className="stack">
          {f.orgs.length > 1 ? <div className="field"><label htmlFor="erpf-org">Finance workspace</label><select id="erpf-org" className="select" value={org} onChange={(e) => setOrg(e.target.value)}>{f.orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div> : null}
          {chosen && !chosen.access ? <p className="small">You have no role in {chosen.name}, so you cannot link to it.</p> : null}
          <div className="row wrap">
            {chosen?.canPick ? <button className="btn sm" onClick={() => setPicking((p) => !p)}>Link an existing Finance supplier</button> : null}
            {chosen?.canCreate ? <button className="btn primary sm" onClick={() => void link({ create: true })}>Create it in Finance and link</button> : null}
          </div>
          {chosen?.access && !chosen.canCreate ? <p className="muted small">Your Finance role cannot add suppliers there, so you can only link one that exists.</p> : null}
          {picking ? (
            <div className="stack">
              <input className="input" type="search" aria-label="Search Finance suppliers" placeholder="Search Finance suppliers" value={q} onChange={(e) => setQ(e.target.value)} />
              {options.error ? <ErrorBox error={options.error} /> : !options.data ? <Loading /> : !options.data.contacts.length ? <p className="muted small">No Finance supplier to link (each can back one supplier here).</p> : (
                <ul className="erp-list">
                  {options.data.contacts.map((c) => <li key={c.id} className="row"><span className="grow">{c.name} <span className="muted small">{[c.email, c.abn].filter(Boolean).join(' · ')}</span></span><button className="btn sm" onClick={() => void link({ finContactId: c.id })}>Link</button></li>)}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      )}
    </Section>
  );
}
