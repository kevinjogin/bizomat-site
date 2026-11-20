// BIZOMAT ERP, Release 1: Products and Engineering, inside a company at /erp/c/<company>/products. Tabs: Products (the
// product master), Changes (change requests and change orders), Documents (engineering documents) and CAD Automation
// (its setup and the company's computers). The server (src/worker/erp) decides who may see and do what.
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, del, errorMessage, get, patch, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import {
  LIFECYCLE,
  PRODUCT_TYPES,
  VARIANT_KEYS,
  dateText,
  dayText,
  dollars,
  erpPath,
  money,
  numOrNull,
  procurementPage,
  productsPage,
  qty,
  toCents,
  useErpMe,
  type BomLine,
  type ErpMe,
  type Product,
  type ProductView,
  type Revision,
} from './api';
import { CsvLink, DocBadge, ErpFiles, ErpUpload, FilterPanel, History, LifecycleBadge, Pager, Props, RevisionBadge, Section, SupplierBadge, options } from './common';
import { ChangeOrderDetail, ChangeRequestDetail, ChangesPage, NewChangeDialog } from './Changes';
import { DocumentDetail, DocumentsPage, NewDocumentDialog } from './Documents';
import { RevisionCadPanel } from '../cad/Cad';
import { SalesAnalysis, StockAnalysis } from './Analysis';

export function ProductsArea({ companyId, companyName, cad }: { companyId: string; companyName: string; cad: ReactNode }) {
  const me = useErpMe(companyId);
  const location = useLocation();
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Product Management" />
          <section className="co-prompt"><p>You do not have access to products and engineering in {companyName}. People in the company have access; people who only share a tool with it do not.</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening Product Management…" />;
  const m = me.data;
  // Product Management is the products themselves; their engineering changes, documents and CAD Automation are
  // Engineering's Design (owner, 20 Nov 2026), at the same addresses.
  const design = /\/products\/(changes|documents|cad)(\/|$)/.test(location.pathname);
  const analysis = /\/products\/analysis(\/|$)/.test(location.pathname);
  const tabs: [string, string, string][] = design
    ? [
        ['/changes', 'Engineering changes', 'history'],
        ['/documents', 'Documents', 'file'],
        ['/cad', 'CAD Automation', 'bolt'],
      ]
    : [];
  return (
    <div className="page crm-page">
      {design ? (
        <PageHeader title="Engineering" subtitle={`Design for ${m.company.name}: engineering changes, documents and CAD Automation. Your ERP roles: ${m.roleLabels.join(', ')}.`} />
      ) : (
        <PageHeader
          title="Product Management"
          subtitle={
            analysis
              ? `What ${m.company.name} sold, what it cost and the margin, by product, customer and more, from the goods dispatched in Warehouse. Read only. Your ERP roles: ${m.roleLabels.join(', ')}.`
              : `Products and variants of ${m.company.name}, with their bills of materials and revisions. Your ERP roles: ${m.roleLabels.join(', ')}.`
          }
        />
      )}
      <nav className="tabs mt-tabs erp-area-tabs" aria-label={design ? 'Design sections' : 'Product Management sections'} hidden={!tabs.length}>
        {tabs.map(([to, label, icon]) => (
          <NavLink key={label} end={to === ''} to={productsPage(companyId, to)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
            <Icon name={icon} size={14} /> {label}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<ProductsPage companyId={companyId} me={m} />} />
        <Route path="changes" element={<ChangesPage companyId={companyId} me={m} />} />
        <Route path="changes/orders/:orderId" element={<ChangeOrderDetail companyId={companyId} me={m} />} />
        <Route path="changes/requests/:requestId" element={<ChangeRequestDetail companyId={companyId} me={m} />} />
        <Route path="documents" element={<DocumentsPage companyId={companyId} me={m} />} />
        <Route path="documents/:documentId" element={<DocumentDetail companyId={companyId} me={m} />} />
        <Route path="cad" element={<>{cad}</>} />
        <Route path="analysis" element={<SalesAnalysis companyId={companyId} />} />
        <Route path="analysis/stock" element={<StockAnalysis companyId={companyId} />} />
        <Route path=":productId" element={<ProductDetail companyId={companyId} me={m} />} />
        <Route path="*" element={<Navigate to={productsPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

// ------------------------------------------------------------------ the list

interface Overview {
  products: { total: number; active: number; unreleased: number };
  changeOrders: { draft: number; submitted: number; approved: number };
  changeRequests: { open: number };
  documents: { total: number; draft: number };
  suppliers: { total: number; pending: number; approved: number } | null;
}

function ProductsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Products');
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
  const limit = 50;
  const offset = Number(g('offset')) || 0;
  const filters = new URLSearchParams();
  for (const k of ['q', 'type', 'lifecycle', 'category', 'archived', 'sort', 'dir']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'products', filters.toString(), offset], queryFn: () => get<{ products: Product[]; total: number; categories: string[] }>(erpPath(companyId, `/products?${filters}&limit=${limit}&offset=${offset}`)) });
  const overview = useQuery({ queryKey: ['erp', companyId, 'overview'], queryFn: () => get<Overview>(erpPath(companyId, '/overview')) });
  const [creating, setCreating] = useState(false);
  const o = overview.data;
  return (
    <div className="stack">
      {o ? (
        <div className="erp-stats">
          <Stat label="Products" value={o.products.total} hint={`${o.products.active} active`} />
          <Stat label="Without a released revision" value={o.products.unreleased} />
          <Stat label="Change orders waiting" value={o.changeOrders.submitted + o.changeOrders.approved} hint={`${o.changeOrders.draft} in draft`} to={productsPage(companyId, '/changes')} />
          <Stat label="Open change requests" value={o.changeRequests.open} to={productsPage(companyId, '/changes?view=requests')} />
          {o.suppliers ? <Stat label="Suppliers" value={o.suppliers.total} hint={`${o.suppliers.pending} pending approval`} to={procurementPage(companyId)} /> : null}
        </div>
      ) : null}
      <div className="row wrap">
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/products?${filters}`} />
        {me.can['products.edit'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New product</button> : null}
      </div>
      <FilterPanel active={['q', 'type', 'lifecycle', 'category', 'archived'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="erp-q">Search</label><input id="erp-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, name, SKU, material" /></div>
        <div className="field"><label htmlFor="erp-type">Type</label><select id="erp-type" className="select" value={g('type')} onChange={(e) => set('type', e.target.value)}><option value="">Any</option>{options(PRODUCT_TYPES)}</select></div>
        <div className="field"><label htmlFor="erp-life">Lifecycle</label><select id="erp-life" className="select" value={g('lifecycle')} onChange={(e) => set('lifecycle', e.target.value)}><option value="">Any</option>{options(LIFECYCLE)}</select></div>
        <div className="field"><label htmlFor="erp-cat">Category</label><select id="erp-cat" className="select" value={g('category')} onChange={(e) => set('category', e.target.value)}><option value="">Any</option>{(list.data?.categories ?? []).map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="field"><label htmlFor="erp-arch">Show</label><select id="erp-arch" className="select" value={g('archived')} onChange={(e) => set('archived', e.target.value)}><option value="">In use</option><option value="1">Archived</option></select></div>
        <div className="field">
          <label htmlFor="erp-sort">Sort by</label>
          <select id="erp-sort" className="select" value={`${g('sort')}:${g('dir')}`} onChange={(e) => { const [s, d] = e.target.value.split(':'); setParams((p) => { const n = new URLSearchParams(p); if (s) n.set('sort', s); else n.delete('sort'); if (d) n.set('dir', d); else n.delete('dir'); n.delete('offset'); return n; }, { replace: true }); }}>
            <option value=":">Number</option>
            <option value="name:">Name</option>
            <option value="type:">Type</option>
            <option value="lifecycle:">Lifecycle</option>
            <option value="cost:desc">Standard cost, highest first</option>
            <option value="updated:desc">Recently changed</option>
            <option value="created:desc">Newest</option>
          </select>
        </div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.products.length ? (
          filters.toString() ? <EmptyState icon="diamond" title="No products match">Try other words or remove a filter.</EmptyState> : (
            <EmptyState icon="diamond" title="No products yet" action={me.can['products.edit'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New product</button> : undefined}>
              Add your finished products, assemblies, parts and materials. Each gets a number, a first revision and its bill of materials.
            </EmptyState>
          )
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table mt-table responsive">
              <thead><tr><th>Number</th><th>Name</th><th>Type</th><th>Category</th><th>Lifecycle</th><th>Released</th><th className="num">Standard cost</th></tr></thead>
              <tbody>
                {list.data.products.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={productsPage(companyId, `/${p.id}`)}>{p.number}</Link></td>
                    <td data-label="Name">{p.name}{p.variantOf ? <span className="muted small"> · variant of {p.variantOfNumber}</span> : null}{p.archived ? <> <span className="badge">Archived</span></> : null}</td>
                    <td data-label="Type">{p.typeLabel}</td>
                    <td data-label="Category">{p.category}</td>
                    <td data-label="Lifecycle"><LifecycleBadge value={p.lifecycle} /></td>
                    <td data-label="Released">{p.releasedRevision ? `Revision ${p.releasedRevision}` : <span className="muted">None yet</span>}</td>
                    <td data-label="Standard cost" className="num">{money(p.standardCostCents, p.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {creating ? <ProductFormDialog companyId={companyId} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}

function Stat({ label, value, hint, to }: { label: string; value: number; hint?: string; to?: string }) {
  const inner = (
    <>
      <span className="crm-stat-label">{label}</span>
      <span className="crm-stat-value">{value.toLocaleString()}</span>
      {hint ? <span className="crm-stat-hint">{hint}</span> : null}
    </>
  );
  return to ? <Link to={to} className="card crm-stat">{inner}</Link> : <div className="card crm-stat">{inner}</div>;
}

// ------------------------------------------------------------------ the product form

function ProductFormDialog({ companyId, product, onClose }: { companyId: string; product?: Product; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const p = product;
  const [f, setF] = useState({
    number: p?.number ?? '',
    sku: p?.sku ?? '',
    name: p?.name ?? '',
    description: p?.description ?? '',
    category: p?.category ?? '',
    subcategory: p?.subcategory ?? '',
    family: p?.family ?? '',
    type: p?.type ?? 'component',
    uom: p?.uom ?? 'each',
    manufacturer: p?.manufacturer ?? '',
    standardCost: dollars(p?.standardCostCents),
    currentCost: dollars(p?.currentCostCents),
    price: dollars(p?.priceCents),
    currency: p?.currency ?? 'AUD',
    weight: p?.weight?.toString() ?? '',
    weightUnit: p?.weightUnit ?? 'kg',
    length: p?.length?.toString() ?? '',
    width: p?.width?.toString() ?? '',
    height: p?.height?.toString() ?? '',
    dimensionUnit: p?.dimensionUnit ?? 'mm',
    material: p?.material ?? '',
    lifecycle: p?.lifecycle ?? 'draft',
    effectiveFrom: p?.effectiveFrom ?? '',
    effectiveTo: p?.effectiveTo ?? '',
  });
  const [props, setProps] = useState<{ key: string; value: string }[]>(p?.properties ?? []);
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const text = (k: keyof typeof f, label: string, max: number, extra: Record<string, unknown> = {}) => (
    <div className="field">
      <label htmlFor={`erpf-${k}`}>{label}</label>
      <input id={`erpf-${k}`} className="input" maxLength={max} value={f[k]} onChange={field(k)} {...extra} />
    </div>
  );
  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    const costs = [toCents(f.standardCost), toCents(f.currentCost), toCents(f.price)];
    if (costs.includes('bad')) return toast('Write amounts as numbers, for example 12.50', 'error');
    setBusy(true);
    const body = {
      ...(f.number.trim() ? { number: f.number.trim() } : {}),
      sku: f.sku,
      name: f.name,
      description: f.description,
      category: f.category,
      subcategory: f.subcategory,
      family: f.family,
      type: f.type,
      uom: f.uom || 'each',
      manufacturer: f.manufacturer,
      standardCostCents: costs[0],
      currentCostCents: costs[1],
      priceCents: costs[2],
      currency: f.currency,
      weight: numOrNull(f.weight),
      weightUnit: f.weightUnit,
      length: numOrNull(f.length),
      width: numOrNull(f.width),
      height: numOrNull(f.height),
      dimensionUnit: f.dimensionUnit,
      material: f.material,
      properties: props.filter((x) => x.key.trim()).map((x) => ({ key: x.key.trim(), value: x.value.trim() })),
      lifecycle: f.lifecycle,
      effectiveFrom: f.effectiveFrom || null,
      effectiveTo: f.effectiveTo || null,
    };
    try {
      const saved = p ? await patch<Product>(erpPath(companyId, `/products/${p.id}`), body) : await post<Product>(erpPath(companyId, '/products'), body);
      toast(p ? 'Saved' : `Product ${saved.number} added with revision A as a draft`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      onClose();
      if (!p) navigate(productsPage(companyId, `/${saved.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={p ? `Edit ${p.number}` : 'New product'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.name.trim()} onClick={() => void save()}>{busy ? 'Saving…' : p ? 'Save' : 'Add the product'}</button></>}>
      <form onSubmit={save} className="stack">
        <fieldset className="mt-form-section">
          <legend>The product</legend>
          <div className="crm-form-grid">
            {text('name', 'Name (required)', 200, { required: true })}
            {text('number', 'Product number', 40, { placeholder: p ? '' : 'Leave blank for the next number' })}
            {text('sku', 'SKU', 80)}
            <div className="field"><label htmlFor="erpf-type">Type</label><select id="erpf-type" className="select" value={f.type} onChange={field('type')}>{options(PRODUCT_TYPES)}</select></div>
            {text('category', 'Category', 80)}
            {text('subcategory', 'Subcategory', 80)}
            {text('family', 'Product family', 80)}
            {text('uom', 'Unit of measure', 20, { placeholder: 'each, m, kg, kit' })}
            <div className="field crm-span"><label htmlFor="erpf-description">Description</label><textarea id="erpf-description" className="textarea" rows={2} maxLength={5000} value={f.description} onChange={field('description')} /></div>
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Lifecycle</legend>
          <div className="crm-form-grid">
            <div className="field"><label htmlFor="erpf-life">Lifecycle</label><select id="erpf-life" className="select" value={f.lifecycle} onChange={field('lifecycle')}>{options(LIFECYCLE)}</select></div>
            <div className="field"><label htmlFor="erpf-from">Effective from</label><input id="erpf-from" className="input" type="date" value={f.effectiveFrom} onChange={field('effectiveFrom')} /></div>
            <div className="field"><label htmlFor="erpf-to">Effective to</label><input id="erpf-to" className="input" type="date" value={f.effectiveTo} onChange={field('effectiveTo')} /></div>
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Costs and price</legend>
          <div className="crm-form-grid">
            {text('standardCost', 'Standard cost', 20, { inputMode: 'decimal', placeholder: '0.00' })}
            {text('currentCost', 'Current cost', 20, { inputMode: 'decimal', placeholder: '0.00' })}
            {text('price', 'Selling price', 20, { inputMode: 'decimal', placeholder: '0.00' })}
            {text('currency', 'Currency', 3, { placeholder: 'AUD' })}
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Make and physical details</legend>
          <div className="crm-form-grid">
            {text('manufacturer', 'Manufacturer', 120)}
            {text('material', 'Material', 120)}
            {text('weight', 'Weight', 20, { inputMode: 'decimal' })}
            <div className="field"><label htmlFor="erpf-wu">Weight unit</label><select id="erpf-wu" className="select" value={f.weightUnit} onChange={field('weightUnit')}>{['g', 'kg', 't', 'lb'].map((u) => <option key={u}>{u}</option>)}</select></div>
            {text('length', 'Length', 20, { inputMode: 'decimal' })}
            {text('width', 'Width', 20, { inputMode: 'decimal' })}
            {text('height', 'Height', 20, { inputMode: 'decimal' })}
            <div className="field"><label htmlFor="erpf-du">Dimension unit</label><select id="erpf-du" className="select" value={f.dimensionUnit} onChange={field('dimensionUnit')}>{['mm', 'cm', 'm', 'in', 'ft'].map((u) => <option key={u}>{u}</option>)}</select></div>
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Other properties</legend>
          {props.map((x, i) => (
            <div key={i} className="row mt-spec-line">
              <input className="input" aria-label="Property" placeholder="Property, for example Finish" maxLength={80} value={x.key} onChange={(e) => setProps((ps) => ps.map((y, j) => (j === i ? { ...y, key: e.target.value } : y)))} />
              <input className="input" aria-label="Value" placeholder="Value" maxLength={500} value={x.value} onChange={(e) => setProps((ps) => ps.map((y, j) => (j === i ? { ...y, value: e.target.value } : y)))} />
              <button type="button" className="btn ghost icon sm" aria-label="Remove property" onClick={() => setProps((ps) => ps.filter((_, j) => j !== i))}><Icon name="trash" size={14} /></button>
            </div>
          ))}
          <div className="row"><button type="button" className="btn sm" onClick={() => setProps((ps) => [...ps, { key: '', value: '' }])}><Icon name="plus" size={14} /> Add a property</button></div>
        </fieldset>
      </form>
    </Modal>
  );
}

function VariantDialog({ companyId, base, onClose }: { companyId: string; base: Product; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const [attrs, setAttrs] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      const v = await post<Product>(erpPath(companyId, `/products/${base.id}/variants`), { variantAttributes: Object.fromEntries(Object.entries(attrs).filter(([, x]) => x.trim())), ...(name.trim() ? { name } : {}), sku });
      toast(`Variant ${v.number} added`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      onClose();
      navigate(productsPage(companyId, `/${v.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`New variant of ${base.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !Object.values(attrs).some((x) => x.trim())} onClick={() => void save()}>{busy ? 'Saving…' : 'Add the variant'}</button></>}>
      <div className="stack">
        <p className="muted small">A variant is a product of its own (its own number, revisions and bill of materials) that shares the base product’s details. Give what sets it apart.</p>
        <div className="crm-form-grid">
          {Object.entries(VARIANT_KEYS).map(([k, label]) => (
            <div key={k} className="field"><label htmlFor={`erpv-${k}`}>{label}</label><input id={`erpv-${k}`} className="input" maxLength={120} value={attrs[k] ?? ''} onChange={(e) => setAttrs((a) => ({ ...a, [k]: e.target.value }))} /></div>
          ))}
          <div className="field"><label htmlFor="erpv-name">Name</label><input id="erpv-name" className="input" maxLength={200} value={name} placeholder={`${base.name} (…)`} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field"><label htmlFor="erpv-sku">SKU</label><input id="erpv-sku" className="input" maxLength={80} value={sku} onChange={(e) => setSku(e.target.value)} /></div>
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ pickers

export interface PickedProduct {
  id: string;
  number: string;
  name: string;
}

/** Search the company's products and pick one. */
export function ProductPicker({ companyId, id, label, value, onChange, exclude }: { companyId: string; id: string; label: string; value: PickedProduct | null; onChange: (p: PickedProduct | null) => void; exclude?: string[] }) {
  const [q, setQ] = useState('');
  const results = useQuery({ queryKey: ['erp', companyId, 'pick', q], queryFn: () => get<{ products: Product[] }>(erpPath(companyId, `/products?limit=12&q=${encodeURIComponent(q)}`)), enabled: !value });
  if (value) {
    return (
      <div className="field">
        <span className="label">{label}</span>
        <div className="row mt-picked"><span className="mt-num">{value.number}</span> <span className="grow">{value.name}</span><button type="button" className="btn ghost sm" onClick={() => onChange(null)}>Change</button></div>
      </div>
    );
  }
  const list = (results.data?.products ?? []).filter((p) => !exclude?.includes(p.id));
  return (
    <div className="field mt-picker">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="input" type="search" placeholder="Search by number or name" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <ul className="mt-picker-list" role="listbox" aria-label={label}>
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" role="option" aria-selected={false} onClick={() => onChange({ id: p.id, number: p.number, name: p.name })}>
              <span className="mt-num">{p.number}</span> {p.name} <span className="muted small">{p.typeLabel}</span>
            </button>
          </li>
        ))}
        {results.data && !list.length ? <li className="muted small">No product matches.</li> : null}
      </ul>
    </div>
  );
}

// ------------------------------------------------------------------ one product

const DETAIL_TABS: [string, string][] = [
  ['', 'Overview'],
  ['structure', 'Bill of materials'],
  ['revisions', 'Revisions'],
  ['where-used', 'Where used'],
  ['documents', 'Documents'],
  ['suppliers', 'Suppliers'],
  ['history', 'History'],
];

function ProductDetail({ companyId, me }: { companyId: string; me: ErpMe }) {
  const { productId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? '';
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ['erp', companyId, 'product', productId], queryFn: () => get<ProductView>(erpPath(companyId, `/products/${productId}`)), retry: false });
  const [dialog, setDialog] = useState<'' | 'edit' | 'variant' | 'eco' | 'ecr'>('');
  usePageTitle(q.data ? `${q.data.product.number} ${q.data.product.name}` : 'Product');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const p = v.product;
  const refresh = () => qc.invalidateQueries({ queryKey: ['erp', companyId] });
  const open = v.revisions.find((r) => r.status === 'draft' || r.status === 'in_change');
  const archive = async () => {
    if (!p.archived && !(await confirm({ title: `Archive ${p.number}?`, message: 'It leaves the product list and the pickers. Its revisions, documents and history stay, and you can restore it.', confirmLabel: 'Archive' }))) return;
    try {
      await post(erpPath(companyId, `/products/${p.id}/${p.archived ? 'restore' : 'archive'}`), {});
      toast(p.archived ? 'Restored' : 'Archived');
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const newRevision = async () => {
    try {
      const r = await post<Revision>(erpPath(companyId, `/products/${p.id}/revisions`), {});
      toast(`Revision ${r.label} started as a draft${p.releasedRevision ? ` with the lines of revision ${p.releasedRevision}` : ''}`);
      await refresh();
      setParams({ tab: 'structure', revision: r.id });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={productsPage(companyId)}>Products</Link>{p.variantOf ? <><span className="sep">/</span><Link to={productsPage(companyId, `/${p.variantOf}`)}>{p.variantOfNumber}</Link></> : null}<span className="sep">/</span><span>{p.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{p.number}</span> {p.name}</h2>
          <div className="mt-badges">
            <span className="badge">{p.typeLabel}</span>
            <LifecycleBadge value={p.lifecycle} />
            {p.releasedRevision ? <span className="badge success">Released revision {p.releasedRevision}</span> : <span className="badge warning">No released revision</span>}
            {open ? <RevisionBadge value={open.status} /> : null}
            {p.archived ? <span className="badge">Archived</span> : null}
          </div>
        </div>
        <div className="mt-head-actions">
          {v.can.edit ? <button className="btn" onClick={() => setDialog('edit')}><Icon name="edit" /> Edit</button> : null}
          {v.can.edit && !p.variantOf ? <button className="btn" onClick={() => setDialog('variant')}><Icon name="copy" /> New variant</button> : null}
          {v.can.edit && !open ? <button className="btn" onClick={() => void newRevision()}><Icon name="plus" /> New revision</button> : null}
          {v.can.raiseChange ? <button className="btn" onClick={() => setDialog('ecr')}><Icon name="flag" /> Request a change</button> : null}
          {v.can.raiseChange && open && !open.ecoId ? <button className="btn" onClick={() => setDialog('eco')}><Icon name="history" /> Change order</button> : null}
          {me.can['products.edit'] ? <button className="btn ghost" onClick={() => void archive()}><Icon name={p.archived ? 'restore' : 'archive'} /> {p.archived ? 'Restore' : 'Archive'}</button> : null}
        </div>
      </div>
      <nav className="tabs" aria-label="Product sections">
        {DETAIL_TABS.map(([key, label]) => (
          <button key={key} className={`tab${tab === key ? ' active' : ''}`} aria-current={tab === key ? 'page' : undefined} onClick={() => setParams(key ? { tab: key } : {})}>{label}</button>
        ))}
      </nav>
      {tab === '' ? <ProductOverview companyId={companyId} v={v} refresh={refresh} /> : null}
      {tab === 'structure' ? <Structure companyId={companyId} v={v} /> : null}
      {tab === 'revisions' ? <Revisions companyId={companyId} v={v} /> : null}
      {tab === 'where-used' ? <WhereUsed companyId={companyId} productId={p.id} /> : null}
      {tab === 'documents' ? <ProductDocuments companyId={companyId} me={me} v={v} /> : null}
      {tab === 'suppliers' ? <ProductSuppliers companyId={companyId} v={v} refresh={refresh} /> : null}
      {tab === 'history' ? <Section title="History"><History events={v.history as any} /></Section> : null}
      {dialog === 'edit' ? <ProductFormDialog companyId={companyId} product={p} onClose={() => setDialog('')} /> : null}
      {dialog === 'variant' ? <VariantDialog companyId={companyId} base={p} onClose={() => setDialog('')} /> : null}
      {dialog === 'ecr' || dialog === 'eco' ? (
        <NewChangeDialog companyId={companyId} kind={dialog} products={[{ id: p.id, number: p.number, name: p.name }]} onClose={() => setDialog('')} onDone={(path) => navigate(productsPage(companyId, path))} />
      ) : null}
    </div>
  );
}

function ProductOverview({ companyId, v, refresh }: { companyId: string; v: ProductView; refresh: () => void }) {
  const p = v.product;
  const toast = useToast();
  const confirm = useConfirm();
  const dims = [p.length, p.width, p.height].some((x) => x !== null) ? `${[p.length, p.width, p.height].map((x) => (x === null ? '?' : x)).join(' x ')} ${p.dimensionUnit}` : '';
  const removeFile = async (f: { id: string; name: string }) => {
    if (!(await confirm({ title: `Remove ${f.name}?`, message: 'The file is deleted. The history keeps a note that it was removed.', confirmLabel: 'Remove', danger: true }))) return;
    try {
      await del(erpPath(companyId, `/files/${f.id}`));
      refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="mt-grid">
      <div className="stack">
        <Section title="Details">
          <Props
            items={[
              ['SKU', p.sku],
              ['Category', [p.category, p.subcategory].filter(Boolean).join(' / ')],
              ['Product family', p.family],
              ['Unit of measure', p.uom],
              ['Standard cost', money(p.standardCostCents, p.currency)],
              ['Current cost', money(p.currentCostCents, p.currency)],
              ['Selling price', money(p.priceCents, p.currency)],
              ['Manufacturer', p.manufacturer],
              ['Material', p.material],
              ['Weight', p.weight !== null ? `${p.weight} ${p.weightUnit}` : ''],
              ['Dimensions', dims],
              ['Effective', [dateText(p.effectiveFrom), dateText(p.effectiveTo)].some(Boolean) ? `${dateText(p.effectiveFrom) || 'any time'} to ${dateText(p.effectiveTo) || 'no end'}` : ''],
              ...(p.variantOf ? ([['Variant of', <Link key="v" to={productsPage(companyId, `/${p.variantOf}`)}>{p.variantOfNumber} {p.variantOfName}</Link>]] as [string, ReactNode][]) : []),
              ...Object.entries(p.variantAttributes).map(([k, x]) => [VARIANT_KEYS[k as keyof typeof VARIANT_KEYS] ?? k, x] as [string, ReactNode]),
              ...p.properties.map((x) => [x.key, x.value] as [string, ReactNode]),
              ['Created', `${dayText(p.createdAt)}${p.createdByName ? ` by ${p.createdByName}` : ''}`],
            ]}
          />
          {p.description ? <p className="mt-pre small">{p.description}</p> : null}
        </Section>
      </div>
      <div className="stack">
        {!p.variantOf ? (
          <Section title="Variants">
            {v.variants.length ? (
              <ul className="erp-list">
                {v.variants.map((x) => (
                  <li key={x.id}><Link to={productsPage(companyId, `/${x.id}`)}><span className="mt-num">{x.number}</span> {x.name}</Link> <span className="muted small">{Object.values(x.variantAttributes).join(', ')}</span></li>
                ))}
              </ul>
            ) : <p className="muted small">No variants. A variant is its own product with the size, model, configuration, material, finish or options that set it apart.</p>}
          </Section>
        ) : null}
        <Section title="Images and attachments" actions={v.can.edit ? <ErpUpload companyId={companyId} target={{ productId: p.id }} onDone={refresh} /> : undefined}>
          <ErpFiles files={v.files} canRemove={v.can.edit} onRemove={(f) => void removeFile(f)} />
        </Section>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ bill of materials

interface RevisionView {
  revision: Revision;
  product: { id: string; number: string; name: string };
  lines: (BomLine & { available?: number | null })[];
  /** The person's ERP roles include stock: each line carries its component's available stock. */
  showsStock?: boolean;
  editable: boolean;
  can: { edit: boolean };
}

function Structure({ companyId, v }: { companyId: string; v: ProductView }) {
  const [params, setParams] = useSearchParams();
  const fallback = v.revisions.find((r) => r.status === 'draft' || r.status === 'in_change') ?? v.revisions.find((r) => r.status === 'released') ?? v.revisions[v.revisions.length - 1];
  const revId = params.get('revision') ?? fallback?.id ?? '';
  const view = params.get('view') ?? 'tree';
  const setView = (k: string, val: string) => setParams((ps) => { const n = new URLSearchParams(ps); n.set(k, val); return n; }, { replace: true });
  if (!revId) return <EmptyState icon="layers" title="No revisions">Start a revision to give the product a bill of materials.</EmptyState>;
  return (
    <div className="stack">
      <div className="row wrap mt-toolbar">
        <div className="field">
          <label htmlFor="erp-rev">Revision</label>
          <select id="erp-rev" className="select" value={revId} onChange={(e) => setView('revision', e.target.value)}>
            {v.revisions.map((r) => <option key={r.id} value={r.id}>Revision {r.label}: {r.status === 'in_change' ? `in ${r.ecoNumber}` : r.status}</option>)}
          </select>
        </div>
        <nav className="tabs grow" aria-label="Bill of materials views">
          {[['tree', 'Structure'], ['explosion', 'All levels'], ['cost', 'Cost roll-up']].map(([k, label]) => (
            <button key={k} className={`tab${view === k ? ' active' : ''}`} aria-current={view === k ? 'page' : undefined} onClick={() => setView('view', k)}>{label}</button>
          ))}
        </nav>
      </div>
      {view === 'tree' ? <BomEditor companyId={companyId} revisionId={revId} productId={v.product.id} /> : null}
      {view === 'tree' ? <RevisionCadPanel companyId={companyId} revisionId={revId} editable={['draft', 'in_change'].includes(v.revisions.find((r) => r.id === revId)?.status ?? '')} /> : null}
      {view === 'explosion' ? <Explosion companyId={companyId} revisionId={revId} /> : null}
      {view === 'cost' ? <CostRollUp companyId={companyId} revisionId={revId} /> : null}
    </div>
  );
}

function BomEditor({ companyId, revisionId, productId }: { companyId: string; revisionId: string; productId: string }) {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['erp', companyId, 'revision', revisionId], queryFn: () => get<RevisionView>(erpPath(companyId, `/revisions/${revisionId}`)) });
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<BomLine | 'new' | null>(null);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const r = q.data.revision;
  const canEdit = q.data.can.edit;
  const refresh = () => qc.invalidateQueries({ queryKey: ['erp', companyId] });
  const remove = async (l: BomLine) => {
    if (!(await confirm({ title: `Remove ${l.componentNumber}?`, message: `It comes out of revision ${r.label}. The history keeps a note of it.`, confirmLabel: 'Remove', danger: true }))) return;
    try {
      await del(erpPath(companyId, `/revisions/${revisionId}/lines/${l.id}`));
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <Section
      title={`Revision ${r.label}`}
      actions={
        <div className="row wrap">
          <RevisionBadge value={r.status} />
          {r.ecoNumber ? <Link className="badge" to={productsPage(companyId, `/changes/orders/${r.ecoId}`)}>{r.ecoNumber}: {r.ecoStatus}</Link> : null}
          <button className="btn ghost sm" onClick={() => setOpen(new Set(q.data!.lines.filter((l) => l.hasStructure).map((l) => l.id)))}>Expand all</button>
          <button className="btn ghost sm" onClick={() => setOpen(new Set())}>Collapse all</button>
          {canEdit ? <button className="btn primary sm" onClick={() => setEditing('new')}><Icon name="plus" size={14} /> Add a line</button> : null}
        </div>
      }
    >
      {!q.data.editable ? (
        <p className="muted small mt-locked"><Icon name="lock" size={14} /> {r.status === 'released' ? 'Released revisions are locked. Start a new revision, through a change order, to change it.' : r.status === 'superseded' ? 'A superseded revision is kept as it was released.' : `Locked while ${r.ecoNumber} is ${r.ecoStatus}.`}</p>
      ) : null}
      {r.description || r.changeReason ? <p className="small">{[r.description, r.changeReason ? `Reason: ${r.changeReason}` : ''].filter(Boolean).join('. ')}</p> : null}
      {!q.data.lines.length ? (
        <p className="muted">No lines yet.{canEdit ? ' Add the parts and materials that go into one of these.' : ''}</p>
      ) : (
        <div className="crm-table-scroll">
          <table className="data-table erp-bom responsive">
            <thead><tr><th>Component</th><th className="num">Quantity</th><th>Unit</th><th className="num">Scrap</th><th>Reference</th><th>Notes</th>{q.data.showsStock ? <th className="num">Available</th> : null}{canEdit ? <th><span className="sr-only">Actions</span></th> : null}</tr></thead>
            <tbody>
              {q.data.lines.map((l) => (
                <BomRow key={l.id} companyId={companyId} line={l} depth={0} open={open} toggle={toggle} stock={!!q.data!.showsStock} actions={canEdit ? (
                  <td className="erp-actions">
                    <button className="btn ghost icon sm" aria-label={`Edit ${l.componentNumber}`} onClick={() => setEditing(l)}><Icon name="edit" size={14} /></button>
                    <button className="btn ghost icon sm" aria-label={`Remove ${l.componentNumber}`} onClick={() => void remove(l)}><Icon name="trash" size={14} /></button>
                  </td>
                ) : canEdit ? <td /> : null} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {q.data.showsStock ? <p className="muted small">Available: each component’s stock on hand outside quarantine, less reservations, in every warehouse. See the explosion for a build quantity and shortages.</p> : null}
      {editing ? <LineDialog companyId={companyId} revisionId={revisionId} productId={productId} line={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} /> : null}
    </Section>
  );
}

/** One line, with the component's released structure underneath when expanded (read from its released revision). */
function BomRow({ companyId, line: l, depth, open, toggle, actions, stock }: { companyId: string; line: BomLine & { available?: number | null }; depth: number; open: Set<string>; toggle: (id: string) => void; actions?: ReactNode; stock?: boolean }) {
  const key = depth ? `${l.id}@${depth}` : l.id;
  const expanded = open.has(key);
  const sub = useQuery({ queryKey: ['erp', companyId, 'revision', l.componentReleasedId], queryFn: () => get<RevisionView>(erpPath(companyId, `/revisions/${l.componentReleasedId}`)), enabled: expanded && !!l.componentReleasedId });
  return (
    <>
      <tr className={depth ? 'erp-sub' : undefined}>
        <td data-label="Component">
          <div className={`erp-indent erp-d${Math.min(depth, 6)}`}>
            {l.hasStructure && depth < 12 ? (
              <button type="button" className="btn ghost icon sm mt-toggle" aria-expanded={expanded} aria-label={`${expanded ? 'Collapse' : 'Expand'} ${l.componentNumber}`} onClick={() => toggle(key)}>
                <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={14} />
              </button>
            ) : <span className="mt-toggle-gap" aria-hidden />}
            <Link to={productsPage(companyId, `/${l.componentId}`)}><span className="mt-num">{l.componentNumber}</span> {l.componentName}</Link>
            <span className="muted small">{l.componentTypeLabel}{l.componentReleased ? ` · rev ${l.componentReleased}` : ''}</span>
            {l.optional ? <span className="badge">Optional</span> : null}
            {l.altGroup ? <span className="badge accent">Alternative {l.altGroup}</span> : null}
          </div>
        </td>
        <td data-label="Quantity" className="num">{qty(l.quantity)}</td>
        <td data-label="Unit">{l.uom}</td>
        <td data-label="Scrap" className="num">{l.scrapPct ? `${l.scrapPct}%` : ''}</td>
        <td data-label="Reference">{l.refDesignator}{l.effectiveFrom || l.effectiveTo ? <div className="muted small">{dateText(l.effectiveFrom) || 'any time'} to {dateText(l.effectiveTo) || 'no end'}</div> : null}</td>
        <td data-label="Notes" className="small">{l.notes}</td>
        {stock ? <td data-label="Available" className="num">{l.available === null || l.available === undefined ? '' : qty(l.available)}</td> : null}
        {actions ?? null}
      </tr>
      {expanded && sub.data
        ? sub.data.lines.map((c) => <BomRow key={`${key}/${c.id}`} companyId={companyId} line={c} depth={depth + 1} open={open} toggle={toggle} stock={stock} actions={actions ? <td /> : undefined} />)
        : null}
      {expanded && !sub.data && l.componentReleasedId ? <tr className="erp-sub"><td colSpan={8}><Loading /></td></tr> : null}
    </>
  );
}

function LineDialog({ companyId, revisionId, productId, line, onClose }: { companyId: string; revisionId: string; productId: string; line?: BomLine; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [component, setComponent] = useState<PickedProduct | null>(line ? { id: line.componentId, number: line.componentNumber, name: line.componentName } : null);
  const [f, setF] = useState({
    quantity: line ? String(line.quantity) : '1',
    uom: line?.uom ?? '',
    scrapPct: line ? String(line.scrapPct) : '0',
    refDesignator: line?.refDesignator ?? '',
    position: line ? String(line.position) : '',
    effectiveFrom: line?.effectiveFrom ?? '',
    effectiveTo: line?.effectiveTo ?? '',
    altGroup: line?.altGroup ?? '',
    notes: line?.notes ?? '',
  });
  const [optional, setOptional] = useState(line?.optional ?? false);
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const save = async () => {
    if (!component) return;
    setBusy(true);
    const body = {
      componentId: component.id,
      quantity: Number(f.quantity),
      ...(f.uom.trim() ? { uom: f.uom.trim() } : {}),
      scrapPct: Number(f.scrapPct || 0),
      refDesignator: f.refDesignator,
      ...(f.position.trim() ? { position: Number(f.position) } : {}),
      effectiveFrom: f.effectiveFrom || null,
      effectiveTo: f.effectiveTo || null,
      optional,
      altGroup: f.altGroup,
      notes: f.notes,
    };
    try {
      if (line) await patch(erpPath(companyId, `/revisions/${revisionId}/lines/${line.id}`), body);
      else await post(erpPath(companyId, `/revisions/${revisionId}/lines`), body);
      toast(line ? 'Line saved' : `${component.number} added`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={line ? `Edit the line for ${line.componentNumber}` : 'Add a line'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !component || !(Number(f.quantity) > 0)} onClick={() => void save()}>{busy ? 'Saving…' : 'Save the line'}</button></>}>
      <div className="stack">
        <ProductPicker companyId={companyId} id="erpl-comp" label="Component" value={component} onChange={setComponent} exclude={[productId]} />
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="erpl-q">Quantity per one</label><input id="erpl-q" className="input" inputMode="decimal" value={f.quantity} onChange={field('quantity')} /></div>
          <div className="field"><label htmlFor="erpl-u">Unit</label><input id="erpl-u" className="input" maxLength={20} placeholder="The component’s own unit" value={f.uom} onChange={field('uom')} /></div>
          <div className="field"><label htmlFor="erpl-s">Scrap allowance (%)</label><input id="erpl-s" className="input" inputMode="decimal" value={f.scrapPct} onChange={field('scrapPct')} /></div>
          <div className="field"><label htmlFor="erpl-r">Reference designator</label><input id="erpl-r" className="input" maxLength={200} placeholder="For example R1, R2" value={f.refDesignator} onChange={field('refDesignator')} /></div>
          <div className="field"><label htmlFor="erpl-p">Position</label><input id="erpl-p" className="input" inputMode="numeric" placeholder="After the last line" value={f.position} onChange={field('position')} /></div>
          <div className="field"><label htmlFor="erpl-a">Alternative group</label><input id="erpl-a" className="input" maxLength={40} placeholder="Lines sharing a group replace each other" value={f.altGroup} onChange={field('altGroup')} /></div>
          <div className="field"><label htmlFor="erpl-f">Effective from</label><input id="erpl-f" className="input" type="date" value={f.effectiveFrom} onChange={field('effectiveFrom')} /></div>
          <div className="field"><label htmlFor="erpl-t">Effective to</label><input id="erpl-t" className="input" type="date" value={f.effectiveTo} onChange={field('effectiveTo')} /></div>
          <div className="field crm-span"><label htmlFor="erpl-n">Notes</label><input id="erpl-n" className="input" maxLength={1000} value={f.notes} onChange={field('notes')} /></div>
        </div>
        <label className="checkbox"><input type="checkbox" checked={optional} onChange={(e) => setOptional(e.target.checked)} /> Optional (left out of the cost roll-up)</label>
      </div>
    </Modal>
  );
}

interface ExplosionNode {
  level: number;
  path: string;
  lineId: string;
  componentId: string;
  number: string;
  name: string;
  typeLabel: string;
  uom: string;
  revision: string | null;
  quantity: number;
  scrapPct: number;
  extendedQuantity: number;
  optional: boolean;
  altGroup: string;
  refDesignator: string;
  noRelease: boolean;
  required: number | null;
  available: number | null;
  shortage: boolean | null;
}

function Explosion({ companyId, revisionId }: { companyId: string; revisionId: string }) {
  const [asOf, setAsOf] = useState('');
  const [build, setBuild] = useState('1');
  const buildQty = Number(build) > 0 ? Number(build) : 1;
  const qs = new URLSearchParams();
  if (asOf) qs.set('asOf', asOf);
  if (buildQty !== 1) qs.set('quantity', String(buildQty));
  const query = qs.toString() ? `?${qs}` : '';
  const q = useQuery({ queryKey: ['erp', companyId, 'explosion', revisionId, asOf, buildQty], queryFn: () => get<{ nodes: ExplosionNode[]; truncated: boolean; availability: string; buildQuantity: number; shortages: number }>(erpPath(companyId, `/revisions/${revisionId}/explosion${query}`)) });
  const stock = !!q.data?.nodes.some((n) => n.available !== null);
  return (
    <Section
      title="Every level"
      actions={
        <div className="row wrap">
          <div className="field"><label htmlFor="erp-build">Build quantity</label><input id="erp-build" className="input erp-qty-input" type="number" min="0.001" step="any" inputMode="decimal" value={build} onChange={(e) => setBuild(e.target.value)} /></div>
          <div className="field"><label htmlFor="erp-asof">In effect on</label><input id="erp-asof" className="input" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} /></div>
          <CsvLink companyId={companyId} path={`/revisions/${revisionId}/explosion${query}`} />
        </div>
      }
    >
      <p className="muted small">Each component is read at its released revision. Extended quantities include scrap allowances, for one of the top product.{stock ? ` Required: for ${qty(buildQty)}.` : ''}</p>
      {stock && q.data?.shortages ? <p className="warn-box small"><Icon name="alert" size={14} /> {q.data.shortages} line{q.data.shortages === 1 ? '' : 's'} short for {qty(buildQty)}.</p> : null}
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : !q.data.nodes.length ? <p className="muted">No lines.</p> : (
        <div className="crm-table-scroll">
          <table className="data-table erp-bom responsive">
            <thead><tr><th>Level</th><th>Component</th><th>Revision</th><th className="num">Quantity</th><th className="num">Extended</th><th>Unit</th>{stock ? <><th className="num">Required</th><th className="num">Available</th><th>Stock</th></> : null}</tr></thead>
            <tbody>
              {q.data.nodes.map((n) => (
                <tr key={`${n.path}-${n.lineId}`}>
                  <td data-label="Level" className="mt-num">{n.path}</td>
                  <td data-label="Component">
                    <div className={`erp-indent erp-d${Math.min(n.level - 1, 6)}`}>
                      <Link to={productsPage(companyId, `/${n.componentId}`)}><span className="mt-num">{n.number}</span> {n.name}</Link>
                      {n.optional ? <span className="badge">Optional</span> : null}
                      {n.altGroup ? <span className="badge accent">Alternative {n.altGroup}</span> : null}
                    </div>
                  </td>
                  <td data-label="Revision">{n.revision ?? (n.noRelease ? <span className="badge warning">No released revision</span> : <span className="muted">None</span>)}</td>
                  <td data-label="Quantity" className="num">{qty(n.quantity)}{n.scrapPct ? <span className="muted small"> +{n.scrapPct}%</span> : null}</td>
                  <td data-label="Extended" className="num">{qty(n.extendedQuantity)}</td>
                  <td data-label="Unit">{n.uom}</td>
                  {stock ? (
                    <>
                      <td data-label="Required" className="num">{n.required === null ? '' : qty(n.required)}</td>
                      <td data-label="Available" className="num">{n.available === null ? '' : qty(n.available)}</td>
                      <td data-label="Stock">{n.optional ? <span className="muted small">Optional</span> : n.shortage ? <span className="badge danger">Short</span> : <span className="badge success">Enough</span>}</td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {q.data?.truncated ? <p className="warn-box small">The structure is very large: only part of it is shown.</p> : null}
      {q.data?.availability ? <p className="muted small">{q.data.availability}</p> : null}
    </Section>
  );
}

interface Cost {
  unitCostCents: number | null;
  currency: string;
  complete: boolean;
  missing: string[];
  mixedCurrency: string[];
  lines: { lineId: string; number: string; name: string; quantity: number; scrapPct: number; unitCostCents: number | null; extendedCents: number | null; source: string }[];
}

const SOURCE_LABELS: Record<string, string> = { rolled_up: 'Rolled up from its bill of materials', standard: 'Standard cost', missing: 'No cost recorded', optional: 'Optional: not counted', alternative: 'Alternative: not counted', other_currency: 'Another currency: not counted' };

function CostRollUp({ companyId, revisionId }: { companyId: string; revisionId: string }) {
  const q = useQuery({ queryKey: ['erp', companyId, 'cost', revisionId], queryFn: () => get<Cost>(erpPath(companyId, `/revisions/${revisionId}/cost`)) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const c = q.data;
  return (
    <Section title="Cost roll-up">
      <div className="row wrap">
        <div className="card crm-stat"><span className="crm-stat-label">Material cost of one</span><span className="crm-stat-value">{c.unitCostCents === null ? 'None' : money(c.unitCostCents, c.currency)}</span><span className="crm-stat-hint">{c.complete ? 'Complete' : 'Incomplete: see below'}</span></div>
      </div>
      {c.missing.length ? <p className="warn-box small">No cost recorded for {c.missing.join(', ')}. The total leaves them out.</p> : null}
      {c.mixedCurrency.length ? <p className="warn-box small">{c.mixedCurrency.join(', ')} {c.mixedCurrency.length === 1 ? 'is' : 'are'} costed in another currency than {c.currency}, so {c.mixedCurrency.length === 1 ? 'it is' : 'they are'} left out. Nothing is converted.</p> : null}
      <div className="crm-table-scroll">
        <table className="data-table">
          <thead><tr><th>Component</th><th className="num">Quantity</th><th className="num">Unit cost</th><th className="num">Extended</th><th>Source</th></tr></thead>
          <tbody>
            {c.lines.map((l) => (
              <tr key={l.lineId}>
                <td data-label="Component"><span className="mt-num">{l.number}</span> {l.name}</td>
                <td data-label="Quantity" className="num">{qty(l.quantity)}{l.scrapPct ? <span className="muted small"> +{l.scrapPct}%</span> : null}</td>
                <td data-label="Unit cost" className="num">{money(l.unitCostCents, c.currency)}</td>
                <td data-label="Extended" className="num">{money(l.extendedCents, c.currency)}</td>
                <td data-label="Source" className="small">{SOURCE_LABELS[l.source] ?? l.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">Labour, overheads and routings are not included: routings are planned for a later release.</p>
    </Section>
  );
}

// ------------------------------------------------------------------ revisions and comparison

interface Comparison {
  a: Revision & { productNumber: string };
  b: Revision & { productNumber: string };
  fields: { field: string; from: unknown; to: unknown }[];
  added: BomLine[];
  removed: BomLine[];
  changed: { component: BomLine; diffs: { field: string; from: unknown; to: unknown }[] }[];
  same: number;
}

function Revisions({ companyId, v }: { companyId: string; v: ProductView }) {
  const [params, setParams] = useSearchParams();
  const released = v.revisions.find((r) => r.status === 'released');
  const latest = v.revisions[v.revisions.length - 1];
  const a = params.get('a') ?? (released && released.id !== latest?.id ? released.id : v.revisions[v.revisions.length - 2]?.id) ?? '';
  const b = params.get('b') ?? latest?.id ?? '';
  const set = (k: string, val: string) => setParams((ps) => { const n = new URLSearchParams(ps); n.set(k, val); return n; }, { replace: true });
  const cmp = useQuery({ queryKey: ['erp', companyId, 'compare', a, b], queryFn: () => get<Comparison>(erpPath(companyId, `/revision-compare?a=${a}&b=${b}`)), enabled: !!a && !!b && a !== b });
  const show = (x: unknown) => (x === null || x === undefined || x === '' ? '(empty)' : typeof x === 'number' ? qty(x) : String(x));
  return (
    <div className="stack">
      <Section title="Revisions">
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Revision</th><th>Status</th><th>Change order</th><th className="num">Lines</th><th>Released</th><th>Description</th></tr></thead>
            <tbody>
              {[...v.revisions].reverse().map((r) => (
                <tr key={r.id}>
                  <td data-label="Revision"><Link to={`?tab=structure&revision=${r.id}`} className="mt-primary">{r.label}</Link></td>
                  <td data-label="Status"><RevisionBadge value={r.status} /></td>
                  <td data-label="Change order">{r.ecoId ? <Link to={productsPage(companyId, `/changes/orders/${r.ecoId}`)}>{r.ecoNumber}</Link> : <span className="muted">None</span>}</td>
                  <td data-label="Lines" className="num">{r.lines ?? ''}</td>
                  <td data-label="Released">{r.releasedAt ? `${dayText(r.releasedAt)}${r.releasedByName ? ` by ${r.releasedByName}` : ''}` : ''}{r.supersededAt ? <div className="muted small">Superseded {dayText(r.supersededAt)}</div> : null}</td>
                  <td data-label="Description" className="small">{r.description}{r.changeReason ? <div className="muted">{r.changeReason}</div> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="Compare two revisions">
        {v.revisions.length < 2 ? <p className="muted small">There is one revision so far. Start a new one to compare.</p> : (
          <>
            <div className="row wrap">
              <div className="field"><label htmlFor="erp-ca">From</label><select id="erp-ca" className="select" value={a} onChange={(e) => set('a', e.target.value)}>{v.revisions.map((r) => <option key={r.id} value={r.id}>Revision {r.label} ({r.status})</option>)}</select></div>
              <div className="field"><label htmlFor="erp-cb">To</label><select id="erp-cb" className="select" value={b} onChange={(e) => set('b', e.target.value)}>{v.revisions.map((r) => <option key={r.id} value={r.id}>Revision {r.label} ({r.status})</option>)}</select></div>
            </div>
            {a === b ? <p className="muted small">Pick two different revisions.</p> : cmp.error ? <ErrorBox error={cmp.error} /> : !cmp.data ? <Loading /> : (
              <div className="stack">
                {cmp.data.fields.length ? <ul className="small erp-diff">{cmp.data.fields.map((f) => <li key={f.field}>{f.field}: {show(f.from)} → {show(f.to)}</li>)}</ul> : null}
                {!cmp.data.added.length && !cmp.data.removed.length && !cmp.data.changed.length ? <p className="muted">The bills of materials are the same ({cmp.data.same} lines).</p> : null}
                {cmp.data.added.length ? <div><h3 className="erp-h3">Added in {cmp.data.b.label}</h3><ul className="erp-diff added">{cmp.data.added.map((l) => <li key={l.id}><span className="mt-num">{l.componentNumber}</span> {l.componentName}: {qty(l.quantity)} {l.uom}</li>)}</ul></div> : null}
                {cmp.data.removed.length ? <div><h3 className="erp-h3">Removed from {cmp.data.a.label}</h3><ul className="erp-diff removed">{cmp.data.removed.map((l) => <li key={l.id}><span className="mt-num">{l.componentNumber}</span> {l.componentName}: {qty(l.quantity)} {l.uom}</li>)}</ul></div> : null}
                {cmp.data.changed.length ? <div><h3 className="erp-h3">Changed</h3><ul className="erp-diff">{cmp.data.changed.map((c) => <li key={c.component.id}><span className="mt-num">{c.component.componentNumber}</span> {c.component.componentName}: {c.diffs.map((d) => `${d.field} ${show(d.from)} → ${show(d.to)}`).join('; ')}</li>)}</ul></div> : null}
                {cmp.data.same ? <p className="muted small">{cmp.data.same} lines are the same.</p> : null}
              </div>
            )}
          </>
        )}
      </Section>
    </div>
  );
}

// ------------------------------------------------------------------ where used, documents, suppliers

function WhereUsed({ companyId, productId }: { companyId: string; productId: string }) {
  const q = useQuery({ queryKey: ['erp', companyId, 'where-used', productId], queryFn: () => get<{ parents: { lineId: string; productId: string; number: string; name: string; typeLabel: string; revision: string; revisionStatus: string; quantity: number; uom: string; optional: boolean }[]; topLevel: { id: string; number: string; name: string }[] }>(erpPath(companyId, `/products/${productId}/where-used`)) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <Section title="Used in" actions={<CsvLink companyId={companyId} path={`/products/${productId}/where-used`} />}>
        {!q.data.parents.length ? <p className="muted">Not used in any bill of materials.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th>Revision</th><th className="num">Quantity</th></tr></thead>
              <tbody>
                {q.data.parents.map((x) => (
                  <tr key={x.lineId}>
                    <td data-label="Product"><Link to={productsPage(companyId, `/${x.productId}`)}><span className="mt-num">{x.number}</span> {x.name}</Link> <span className="muted small">{x.typeLabel}</span>{x.optional ? <> <span className="badge">Optional</span></> : null}</td>
                    <td data-label="Revision">{x.revision} <RevisionBadge value={x.revisionStatus} /></td>
                    <td data-label="Quantity" className="num">{qty(x.quantity)} {x.uom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <Section title="Top-level products that use it (released structures)">
        {q.data.topLevel.length ? <ul className="erp-list">{q.data.topLevel.map((t) => <li key={t.id}><Link to={productsPage(companyId, `/${t.id}`)}><span className="mt-num">{t.number}</span> {t.name}</Link></li>)}</ul> : <p className="muted small">None.</p>}
      </Section>
    </div>
  );
}

function ProductDocuments({ companyId, me, v }: { companyId: string; me: ErpMe; v: ProductView }) {
  const [adding, setAdding] = useState(false);
  return (
    <Section title="Engineering documents" actions={v.can.editDocuments ? <button className="btn primary sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add a document</button> : undefined}>
      {!v.documents.length ? <p className="muted">No documents yet. Add drawings, models, PDFs or specifications, as files or as references to CAD files on your computer.</p> : (
        <ul className="erp-list">
          {v.documents.map((d) => (
            <li key={d.id}>
              <Link to={productsPage(companyId, `/documents/${d.id}`)}><span className="mt-num">{d.number}</span> {d.title}</Link> <DocBadge value={d.status} /> <span className="muted small">{d.kindLabel}{d.revisionLabel ? ` · product revision ${d.revisionLabel}` : ''}{d.latestVersion ? ` · version ${d.latestVersion}${d.latestDocRevision ? ` (${d.latestDocRevision})` : ''}` : ''}{d.latestSource === 'cad_reference' ? ' · CAD reference' : ''}</span>
            </li>
          ))}
        </ul>
      )}
      {adding ? <NewDocumentDialog companyId={companyId} me={me} product={{ id: v.product.id, number: v.product.number, name: v.product.name }} revisions={v.revisions} onClose={() => setAdding(false)} /> : null}
    </Section>
  );
}

function ProductSuppliers({ companyId, v, refresh }: { companyId: string; v: ProductView; refresh: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [adding, setAdding] = useState(false);
  if (!v.can.viewSuppliers) return <p className="muted">Your ERP roles do not include suppliers.</p>;
  const remove = async (s: { supplierId: string; supplierName: string | null }) => {
    if (!(await confirm({ title: `Remove ${s.supplierName ?? 'this supplier'}?`, message: 'It no longer supplies this product. The supplier record stays.', confirmLabel: 'Remove', danger: true }))) return;
    try {
      await del(erpPath(companyId, `/products/${v.product.id}/suppliers/${s.supplierId}`));
      refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Section title="Suppliers" actions={v.can.editSuppliers ? <button className="btn primary sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add a supplier</button> : undefined}>
      {!v.suppliers.length ? <p className="muted">No suppliers for this product yet.</p> : (
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Supplier</th><th>Their part number</th><th className="num">Price</th><th className="num">Lead time</th><th className="num">Minimum order</th>{v.can.editSuppliers ? <th><span className="sr-only">Actions</span></th> : null}</tr></thead>
            <tbody>
              {v.suppliers.map((s) => (
                <tr key={s.supplierId}>
                  <td data-label="Supplier"><Link to={procurementPage(companyId, `/suppliers/${s.supplierId}`)}><span className="mt-num">{s.supplierNumber}</span> {s.supplierName}</Link> {s.preferred ? <span className="badge success">Preferred</span> : null} {s.supplierStatus && s.supplierStatus !== 'approved' ? <SupplierBadge value={s.supplierStatus} /> : null}</td>
                  <td data-label="Their part number">{s.supplierPartNumber}</td>
                  <td data-label="Price" className="num">{money(s.priceCents, s.currency)}</td>
                  <td data-label="Lead time" className="num">{s.leadTimeDays !== null ? `${s.leadTimeDays} days` : ''}</td>
                  <td data-label="Minimum order" className="num">{s.moq ?? ''}</td>
                  {v.can.editSuppliers ? <td className="erp-actions"><button className="btn ghost icon sm" aria-label={`Remove ${s.supplierName}`} onClick={() => void remove(s)}><Icon name="trash" size={14} /></button></td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {adding ? <SupplierLinkDialog companyId={companyId} productId={v.product.id} onClose={() => { setAdding(false); refresh(); }} /> : null}
    </Section>
  );
}

function SupplierLinkDialog({ companyId, productId, onClose }: { companyId: string; productId: string; onClose: () => void }) {
  const toast = useToast();
  const opts = useQuery({ queryKey: ['erp', companyId, 'supplier-options'], queryFn: () => get<{ suppliers: { id: string; number: string; name: string; statusLabel: string; currency: string }[] }>(erpPath(companyId, '/supplier-options')) });
  const [f, setF] = useState({ supplierId: '', supplierPartNumber: '', price: '', currency: '', leadTimeDays: '', moq: '' });
  const [preferred, setPreferred] = useState(false);
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const list = useMemo(() => opts.data?.suppliers ?? [], [opts.data]);
  const save = async () => {
    const price = toCents(f.price);
    if (price === 'bad') return toast('Write the price as a number, for example 12.50', 'error');
    setBusy(true);
    try {
      await put(erpPath(companyId, `/products/${productId}/suppliers/${f.supplierId}`), {
        supplierPartNumber: f.supplierPartNumber,
        priceCents: price,
        ...(f.currency.trim() ? { currency: f.currency.trim() } : {}),
        leadTimeDays: numOrNull(f.leadTimeDays),
        moq: numOrNull(f.moq),
        preferred,
      });
      toast('Supplier added');
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title="Add a supplier" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.supplierId} onClick={() => void save()}>{busy ? 'Saving…' : 'Add'}</button></>}>
      <div className="stack">
        {opts.data && !list.length ? <p className="muted">No suppliers yet. Add them under Procurement first.</p> : null}
        <div className="crm-form-grid">
          <div className="field crm-span"><label htmlFor="erps-s">Supplier</label><select id="erps-s" className="select" value={f.supplierId} onChange={field('supplierId')}><option value="">Choose</option>{list.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name} ({s.statusLabel})</option>)}</select></div>
          <div className="field"><label htmlFor="erps-pn">Their part number</label><input id="erps-pn" className="input" maxLength={80} value={f.supplierPartNumber} onChange={field('supplierPartNumber')} /></div>
          <div className="field"><label htmlFor="erps-p">Price</label><input id="erps-p" className="input" inputMode="decimal" value={f.price} onChange={field('price')} /></div>
          <div className="field"><label htmlFor="erps-c">Currency</label><input id="erps-c" className="input" maxLength={3} placeholder="The supplier’s" value={f.currency} onChange={field('currency')} /></div>
          <div className="field"><label htmlFor="erps-l">Lead time (days)</label><input id="erps-l" className="input" inputMode="numeric" value={f.leadTimeDays} onChange={field('leadTimeDays')} /></div>
          <div className="field"><label htmlFor="erps-m">Minimum order quantity</label><input id="erps-m" className="input" inputMode="decimal" value={f.moq} onChange={field('moq')} /></div>
        </div>
        <label className="checkbox"><input type="checkbox" checked={preferred} onChange={(e) => setPreferred(e.target.checked)} /> Preferred supplier for this product</label>
      </div>
    </Modal>
  );
}

