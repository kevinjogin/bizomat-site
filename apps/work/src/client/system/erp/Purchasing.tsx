// BIZOMAT ERP, Release 2: purchasing screens inside Procurement (/erp/c/<company>/procurement/...): requisitions,
// requests for quotation with the quotation comparison, purchase orders with their live PDF preview, amendments and
// receiving, and goods receipts with the draft bill in Finance. The server decides what each person may do; these
// screens show only what it allows.
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, post, put } from '../../lib/api';
import { toolUrl } from '../../lib/base';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import { LivePreview } from '../../fin/sales-ui';
import '../../styles/fin.css';
import {
  PO_STATUS,
  REQ_STATUS,
  RFQ_STATUS,
  apiHref,
  dateText,
  dayText,
  dollars,
  erpPath,
  inventoryPage,
  money,
  procurementPage,
  productsPage,
  qty,
  qualityPage,
  toCents,
  type ErpEvent,
  type ErpMe,
  type Line,
  type Location,
  type PoLine,
  type Product,
  type PurchaseOrder,
  type Receipt,
  type RecordFile,
  type Requisition,
  type Rfq,
} from './api';
import { CsvLink, ErpFiles, FilterPanel, History, Pager, PoBadge, Props, RecordUpload, ReqBadge, RfqBadge, Section, options } from './common';
import { NoteDialog } from './Changes';

// ------------------------------------------------------------------ shared pieces

/** List filters kept in the address, so a list can be shared and comes back as it was. */
export function useListParams() {
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        if (v) n.set(k, v);
        else n.delete(k);
        if (k !== 'offset') n.delete('offset');
        return n;
      },
      { replace: true },
    );
  return { g, set, offset: Number(g('offset')) || 0 };
}

const useRefresh = (companyId: string) => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['erp', companyId] });
};

/** Runs an action, tells the person what happened, and refreshes the ERP's data. */
function useAct(companyId: string) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  return async (fn: () => Promise<unknown>, done?: string) => {
    try {
      const r = await fn();
      if (done) toast(done);
      await refresh();
      return r;
    } catch (err) {
      toast(errorMessage(err), 'error');
      return undefined;
    }
  };
}

interface ProductOption {
  id: string;
  number: string;
  name: string;
  uom: string;
  label: string;
}

/** The company's products for the line editors: typed by number or name, picked from a list. */
function useProducts(companyId: string) {
  const q = useQuery({ queryKey: ['erp', companyId, 'product-options'], queryFn: () => get<{ products: Product[] }>(erpPath(companyId, '/products?limit=500')), staleTime: 60_000 });
  return useMemo<ProductOption[]>(() => (q.data?.products ?? []).filter((p) => p.type !== 'service').map((p) => ({ id: p.id, number: p.number, name: p.name, uom: p.uom, label: `${p.number} ${p.name}` })), [q.data]);
}

interface SupplierOption {
  id: string;
  number: string;
  name: string;
  status: string;
  statusLabel: string;
  currency: string;
}

function useSuppliers(companyId: string) {
  const q = useQuery({ queryKey: ['erp', companyId, 'supplier-options'], queryFn: () => get<{ suppliers: SupplierOption[] }>(erpPath(companyId, '/supplier-options')) });
  return q.data?.suppliers ?? [];
}

export interface EditLine {
  key: string;
  id?: string;
  productId: string | null;
  text: string;
  item: string;
  specification: string;
  quantity: string;
  uom: string;
  price: string;
  discount: string;
  taxCode: string;
}

let lineSeq = 0;
export const newLine = (l: Partial<EditLine> = {}): EditLine => ({ key: `l${++lineSeq}`, productId: null, text: '', item: '', specification: '', quantity: '1', uom: 'each', price: '', discount: '', taxCode: '', ...l });
export const fromLine = (l: Line | PoLine, price?: number | null): EditLine =>
  newLine({
    id: l.id,
    productId: l.productId,
    text: l.productId ? `${l.productNumber ?? ''} ${l.item}`.trim() : l.item,
    item: l.item,
    specification: l.specification,
    quantity: String(l.quantity),
    uom: l.uom,
    price: price === null || price === undefined ? '' : dollars(price),
    discount: 'discountBp' in l && l.discountBp ? String(l.discountBp / 100) : '',
    taxCode: 'taxCode' in l ? l.taxCode : '',
  });

/**
 * The lines of a requisition, request for quotation or purchase order: a product of the company (typed by number or
 * name and picked from the list) or a free-text item, a specification, a quantity and unit, and the price columns the
 * record needs.
 */
function LinesEditor({ companyId, lines, setLines, price, taxCodes }: { companyId: string; lines: EditLine[]; setLines: (l: EditLine[]) => void; price?: 'estimate' | 'order'; taxCodes?: { value: string; label: string }[] }) {
  const products = useProducts(companyId);
  const listId = `erp-products-${companyId}`;
  const update = (key: string, patch: Partial<EditLine>) => setLines(lines.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const typed = (l: EditLine, text: string) => {
    const p = products.find((x) => x.label === text);
    update(l.key, p ? { text, productId: p.id, item: p.name, uom: l.productId === p.id ? l.uom : p.uom || 'each' } : { text, productId: null, item: text });
  };
  return (
    <div className="stack">
      <datalist id={listId}>{products.map((p) => <option key={p.id} value={p.label} />)}</datalist>
      <div className="crm-table-scroll">
        <table className="data-table responsive erp-lines">
          <thead>
            <tr>
              <th>Product or item</th>
              <th>Specification</th>
              <th className="num">Quantity</th>
              <th>Unit</th>
              {price ? <th className="num">{price === 'estimate' ? 'Estimated unit cost' : 'Unit price'}</th> : null}
              {price === 'order' ? <th className="num">Discount %</th> : null}
              {price === 'order' && taxCodes ? <th>Tax</th> : null}
              <th><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={l.key}>
                <td data-label="Product or item">
                  <input className="input" list={listId} aria-label={`Line ${i + 1}: product or item`} placeholder="Product number or name, or describe the item" value={l.text} onChange={(e) => typed(l, e.target.value)} maxLength={300} />
                  {l.productId ? <span className="badge small">Product</span> : l.text ? <span className="muted small">Free-text item</span> : null}
                </td>
                <td data-label="Specification"><input className="input" aria-label={`Line ${i + 1}: specification`} value={l.specification} onChange={(e) => update(l.key, { specification: e.target.value })} maxLength={2000} /></td>
                <td data-label="Quantity" className="num"><input className="input erp-qty-input" type="number" min="0" step="any" inputMode="decimal" aria-label={`Line ${i + 1}: quantity`} value={l.quantity} onChange={(e) => update(l.key, { quantity: e.target.value })} /></td>
                <td data-label="Unit"><input className="input erp-unit-input" aria-label={`Line ${i + 1}: unit`} value={l.uom} onChange={(e) => update(l.key, { uom: e.target.value })} maxLength={20} /></td>
                {price ? <td data-label={price === 'estimate' ? 'Estimated unit cost' : 'Unit price'} className="num"><input className="input erp-money-input" inputMode="decimal" aria-label={`Line ${i + 1}: ${price === 'estimate' ? 'estimated unit cost' : 'unit price'}`} value={l.price} onChange={(e) => update(l.key, { price: e.target.value })} placeholder="0.00" /></td> : null}
                {price === 'order' ? <td data-label="Discount %" className="num"><input className="input erp-qty-input" type="number" min="0" max="100" step="any" aria-label={`Line ${i + 1}: discount percent`} value={l.discount} onChange={(e) => update(l.key, { discount: e.target.value })} /></td> : null}
                {price === 'order' && taxCodes ? (
                  <td data-label="Tax">
                    <select className="select" aria-label={`Line ${i + 1}: tax`} value={l.taxCode} onChange={(e) => update(l.key, { taxCode: e.target.value })}>
                      <option value="">Default</option>
                      {taxCodes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </td>
                ) : null}
                <td className="erp-actions"><button type="button" className="btn ghost icon sm" aria-label={`Remove line ${i + 1}`} disabled={lines.length === 1} onClick={() => setLines(lines.filter((x) => x.key !== l.key))}><Icon name="trash" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div><button type="button" className="btn sm" onClick={() => setLines([...lines, newLine()])}><Icon name="plus" size={14} /> Add a line</button></div>
    </div>
  );
}

/** The lines as the API takes them, or an error message. */
function linesBody(lines: EditLine[], price?: 'estimate' | 'order'): { lines: Record<string, unknown>[] } | { error: string } {
  const out: Record<string, unknown>[] = [];
  for (const [i, l] of lines.entries()) {
    if (!l.productId && !l.item.trim()) return { error: `Line ${i + 1}: choose a product or describe the item` };
    const q = Number(l.quantity);
    if (!(q > 0)) return { error: `Line ${i + 1}: use a quantity above zero` };
    const row: Record<string, unknown> = { productId: l.productId, item: l.productId ? undefined : l.item.trim(), specification: l.specification, quantity: q, uom: l.uom };
    if (l.id) row.id = l.id;
    if (price) {
      const c = toCents(l.price);
      if (c === 'bad') return { error: `Line ${i + 1}: use a price like 12.50` };
      if (price === 'estimate') row.estUnitCostCents = c;
      else {
        row.unitPriceCents = c ?? 0;
        const d = l.discount.trim() ? Math.round(Number(l.discount) * 100) : 0;
        if (!(d >= 0 && d <= 10_000)) return { error: `Line ${i + 1}: a discount is 0 to 100%` };
        row.discountBp = d;
        if (l.taxCode) row.taxCode = l.taxCode;
      }
    }
    out.push(row);
  }
  return { lines: out };
}

function Files({ companyId, kind, id, files, canAdd }: { companyId: string; kind: 'requisition' | 'rfq' | 'quotation' | 'purchase_order' | 'receipt'; id: string; files: RecordFile[]; canAdd: boolean }) {
  const act = useAct(companyId);
  const confirm = useConfirm();
  const refresh = useRefresh(companyId);
  return (
    <Section title="Attachments" actions={canAdd ? <RecordUpload companyId={companyId} kind={kind} id={id} onDone={() => void refresh()} /> : undefined}>
      {files.length ? (
        <ErpFiles
          files={files}
          canRemove={canAdd}
          onRemove={async (f) => {
            if (await confirm({ title: `Remove ${f.name}?`, message: 'The file is deleted. The history keeps a note that it was removed.', confirmLabel: 'Remove', danger: true })) await act(() => del(erpPath(companyId, `/record-files/${f.id}`)), 'File removed');
          }}
        />
      ) : <p className="muted small">No attachments.</p>}
    </Section>
  );
}

const Crumbs = ({ companyId, list, label, here }: { companyId: string; list: string; label: string; here: string }) => (
  <div className="mt-path"><Link to={procurementPage(companyId, list)}>{label}</Link><span className="sep">/</span><span>{here}</span></div>
);

// ------------------------------------------------------------------ requisitions

export function RequisitionsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Requisitions');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'mine', 'sort']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'requisitions', filters.toString(), offset], queryFn: () => get<{ requisitions: Requisition[]; total: number; can: { raise: boolean } }>(erpPath(companyId, `/requisitions?${filters}&limit=${limit}&offset=${offset}`)) });
  const [creating, setCreating] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Ask for goods. A procurement manager approves each requisition before it is bought.</p>
        <CsvLink companyId={companyId} path={`/requisitions?${filters}`} />
        {me.can['requisitions.raise'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New requisition</button> : null}
      </div>
      <FilterPanel active={['q', 'status', 'mine'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="req-q">Search</label><input id="req-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, title, item" /></div>
        <div className="field"><label htmlFor="req-st">Status</label><select id="req-st" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Any</option><option value="open">Open</option>{options(REQ_STATUS)}</select></div>
        <div className="field"><label htmlFor="req-mine">Raised by</label><select id="req-mine" className="select" value={g('mine')} onChange={(e) => set('mine', e.target.value)}><option value="">Anyone</option><option value="1">Me</option></select></div>
        <div className="field"><label htmlFor="req-sort">Sort by</label><select id="req-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Newest</option><option value="number">Number</option><option value="required">Required date</option><option value="status">Status</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.requisitions.length ? (
          <EmptyState icon="doc" title={filters.toString() ? 'No requisitions match' : 'No requisitions yet'} action={!filters.toString() && me.can['requisitions.raise'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New requisition</button> : undefined}>
            {filters.toString() ? 'Try other words or remove a filter.' : 'A requisition asks for goods: what, how many, by when and why.'}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Title</th><th>Status</th><th>Raised by</th><th>Required</th><th className="num">Estimate</th></tr></thead>
              <tbody>
                {list.data.requisitions.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={procurementPage(companyId, `/requisitions/${r.id}`)}>{r.number}</Link></td>
                    <td data-label="Title">{r.title || <span className="muted">{r.lineCount} line{r.lineCount === 1 ? '' : 's'}</span>}</td>
                    <td data-label="Status"><ReqBadge value={r.status} /></td>
                    <td data-label="Raised by">{r.requesterName}{r.departmentName ? <div className="muted small">{r.departmentName}</div> : null}</td>
                    <td data-label="Required">{dateText(r.requiredDate)}</td>
                    <td data-label="Estimate" className="num">{r.estimatedTotalCents ? money(r.estimatedTotalCents, r.currency) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {creating ? <RequisitionDialog companyId={companyId} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}

function RequisitionDialog({ companyId, req, lines: initial, onClose }: { companyId: string; req?: Requisition; lines?: Line[]; onClose: () => void }) {
  const navigate = useNavigate();
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const opts = useQuery({ queryKey: ['erp', companyId, 'requisition-options'], queryFn: () => get<{ departments: { id: string; name: string }[]; budgets: { value: string; label: string }[] }>(erpPath(companyId, '/requisition-options')) });
  const [f, setF] = useState({ title: req?.title ?? '', departmentId: req?.departmentId ?? '', requiredDate: req?.requiredDate ?? '', budgetRef: req?.budgetRef ?? '', reason: req?.reason ?? '' });
  const [lines, setLines] = useState<EditLine[]>(initial?.length ? initial.map((l) => fromLine(l, l.estUnitCostCents)) : [newLine()]);
  const [busy, setBusy] = useState(false);
  const save = async (submit: boolean) => {
    const b = linesBody(lines, 'estimate');
    if ('error' in b) return toast(b.error, 'error');
    setBusy(true);
    try {
      const body = { title: f.title, departmentId: f.departmentId || null, requiredDate: f.requiredDate || null, budgetRef: f.budgetRef, reason: f.reason, lines: b.lines };
      if (req) {
        await put(erpPath(companyId, `/requisitions/${req.id}`), body);
        if (submit) await post(erpPath(companyId, `/requisitions/${req.id}/submit`), {});
        toast(`${req.number} saved`);
        await refresh();
        onClose();
      } else {
        const r = await post<{ id: string; number: string }>(erpPath(companyId, '/requisitions'), { ...body, submit });
        toast(`${r.number} ${submit ? 'submitted for approval' : 'saved as a draft'}`);
        await refresh();
        navigate(procurementPage(companyId, `/requisitions/${r.id}`));
      }
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={req ? `Edit ${req.number}` : 'New requisition'} onClose={onClose} wide footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn" disabled={busy} onClick={() => void save(false)}>Save draft</button><button className="btn primary" disabled={busy} onClick={() => void save(true)}>{busy ? 'Saving…' : 'Submit for approval'}</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="rq-title">Title</label><input id="rq-title" className="input" value={f.title} maxLength={200} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="What it is for" /></div>
        {opts.data?.departments.length ? <div className="field"><label htmlFor="rq-dep">Department</label><select id="rq-dep" className="select" value={f.departmentId} onChange={(e) => setF({ ...f, departmentId: e.target.value })}><option value="">None</option>{opts.data.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div> : null}
        <div className="field"><label htmlFor="rq-date">Required by</label><input id="rq-date" className="input" type="date" value={f.requiredDate} onChange={(e) => setF({ ...f, requiredDate: e.target.value })} /></div>
        <div className="field"><label htmlFor="rq-budget">Budget reference</label><input id="rq-budget" className="input" list="rq-budgets" value={f.budgetRef} maxLength={200} onChange={(e) => setF({ ...f, budgetRef: e.target.value })} /><datalist id="rq-budgets">{(opts.data?.budgets ?? []).map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</datalist>{opts.data?.budgets.length ? <span className="muted small">Pick a Finance budget, project or cost centre, or type a reference.</span> : null}</div>
        <div className="field span-2"><label htmlFor="rq-reason">Reason</label><textarea id="rq-reason" className="textarea" rows={2} maxLength={2000} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></div>
      </div>
      <h3 className="crm-subhead">Lines</h3>
      <LinesEditor companyId={companyId} lines={lines} setLines={setLines} price="estimate" />
    </Modal>
  );
}

interface RequisitionView {
  requisition: Requisition;
  lines: Line[];
  rfqs: { id: string; number: string; status: string; statusLabel: string }[];
  purchaseOrders: { id: string; number: string; status: string }[];
  files: RecordFile[];
  history: ErpEvent[];
  can: { edit: boolean; submit: boolean; approve: boolean; cancel: boolean; rfq: boolean; order: boolean; files: boolean; segregation: string | null };
}

export function RequisitionDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const act = useAct(companyId);
  const q = useQuery({ queryKey: ['erp', companyId, 'requisition', id], queryFn: () => get<RequisitionView>(erpPath(companyId, `/requisitions/${id}`)), retry: false });
  const [ask, setAsk] = useState<'' | 'edit' | 'approve' | 'reject' | 'cancel' | 'rfq' | 'order'>('');
  usePageTitle(q.data ? q.data.requisition.number : 'Requisition');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const r = v.requisition;
  const decide = (action: 'approve' | 'reject' | 'cancel') => async (note: string) => {
    await act(() => post(erpPath(companyId, `/requisitions/${r.id}/${action}`), { note }), `${r.number} ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'cancelled'}`);
    setAsk('');
  };
  const order = async (supplierId: string) => {
    const po = (await act(() => post<{ id: string }>(erpPath(companyId, '/purchase-orders'), { fromRequisitionId: r.id, supplierId }), 'Purchase order drafted')) as { id: string } | undefined;
    if (po) navigate(procurementPage(companyId, `/purchase-orders/${po.id}`));
  };
  return (
    <div className="stack">
      <Crumbs companyId={companyId} list="/requisitions" label="Requisitions" here={r.number} />
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{r.number}</span> {r.title}</h2>
          <div className="mt-badges"><ReqBadge value={r.status} />{r.sodException ? <span className="badge warning">Recorded exception: approved by the person who raised it (one-person company)</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          {v.can.edit ? <button className="btn" onClick={() => setAsk('edit')}><Icon name="edit" /> Edit</button> : null}
          {v.can.submit ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/requisitions/${r.id}/submit`), {}), `${r.number} submitted`)}>Submit for approval</button> : null}
          {v.can.approve ? <button className="btn primary" onClick={() => setAsk('approve')}><Icon name="check" /> Approve</button> : null}
          {v.can.approve ? <button className="btn" onClick={() => setAsk('reject')}>Reject</button> : null}
          {v.can.rfq ? <button className="btn primary" onClick={() => setAsk('rfq')}>Request quotations</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setAsk('cancel')}>Cancel</button> : null}
        </div>
      </div>
      {v.can.segregation ? <p className="warn-box small"><Icon name="info" size={14} /> {v.can.segregation}</p> : null}
      <div className="mt-grid">
        <div className="stack">
          <Section title="Details">
            <Props items={[['Raised by', r.requesterName ?? ''], ['Department', r.departmentName ?? ''], ['Required by', dateText(r.requiredDate)], ['Budget', r.budgetRef], ['Reason', r.reason], ['Estimate', r.estimatedTotalCents ? money(r.estimatedTotalCents, r.currency) : ''], ['Decision', r.decidedAt ? `${REQ_STATUS[r.status]} ${dayText(r.decidedAt)}${r.decidedByName ? ` by ${r.decidedByName}` : ''}${r.decisionNote ? `: ${r.decisionNote}` : ''}` : ''], ['Raised', dayText(r.createdAt)]]} />
          </Section>
          <Section title="Lines">
            <LinesTable lines={v.lines} companyId={companyId} estimate currency={r.currency} />
          </Section>
          {v.can.order ? <p className="small muted">Or skip quotations: <button className="btn sm" onClick={() => setAsk('order')}>Make a purchase order from it</button></p> : null}
        </div>
        <div className="stack">
          <Section title="Made from it">
            {!v.rfqs.length && !v.purchaseOrders.length ? <p className="muted small">Nothing yet.</p> : (
              <ul className="erp-list">
                {v.rfqs.map((x) => <li key={x.id}><Link to={procurementPage(companyId, `/rfqs/${x.id}`)}><span className="mt-num">{x.number}</span></Link> <RfqBadge value={x.status} /></li>)}
                {v.purchaseOrders.map((x) => <li key={x.id}><Link to={procurementPage(companyId, `/purchase-orders/${x.id}`)}><span className="mt-num">{x.number}</span></Link> <PoBadge value={x.status} /></li>)}
              </ul>
            )}
          </Section>
          <Files companyId={companyId} kind="requisition" id={r.id} files={v.files} canAdd={v.can.files} />
          <Section title="History"><History events={v.history} /></Section>
        </div>
      </div>
      {ask === 'edit' ? <RequisitionDialog companyId={companyId} req={r} lines={v.lines} onClose={() => setAsk('')} /> : null}
      {ask === 'approve' ? <NoteDialog title={`Approve ${r.number}`} label="Note (optional)" confirm="Approve" onClose={() => setAsk('')} onSave={decide('approve')} /> : null}
      {ask === 'reject' ? <NoteDialog title={`Reject ${r.number}`} label="Why it is rejected" confirm="Reject" required danger onClose={() => setAsk('')} onSave={decide('reject')} /> : null}
      {ask === 'cancel' ? <NoteDialog title={`Cancel ${r.number}`} label="Note (optional)" confirm="Cancel the requisition" danger onClose={() => setAsk('')} onSave={decide('cancel')} /> : null}
      {ask === 'rfq' ? <RfqDialog companyId={companyId} fromRequisition={r} onClose={() => setAsk('')} /> : null}
      {ask === 'order' ? <SupplierPickDialog companyId={companyId} title={`Purchase order from ${r.number}`} onClose={() => setAsk('')} onPick={(id) => void order(id)} /> : null}
    </div>
  );
}

function SupplierPickDialog({ companyId, title, onClose, onPick }: { companyId: string; title: string; onClose: () => void; onPick: (supplierId: string) => void }) {
  const suppliers = useSuppliers(companyId).filter((s) => s.status === 'approved');
  const [id, setId] = useState('');
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!id} onClick={() => { onPick(id); onClose(); }}>Draft the order</button></>}>
      <div className="field"><label htmlFor="pick-sup">Supplier (approved only)</label><select id="pick-sup" className="select" value={id} onChange={(e) => setId(e.target.value)}><option value="">Choose…</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div>
      <p className="muted small">The lines come from the requisition, priced at its estimates. Change them on the draft before submitting it.</p>
    </Modal>
  );
}

function LinesTable({ companyId, lines, estimate, currency }: { companyId: string; lines: Line[]; estimate?: boolean; currency: string }) {
  if (!lines.length) return <p className="muted small">No lines.</p>;
  return (
    <div className="crm-table-scroll">
      <table className="data-table responsive">
        <thead><tr><th>#</th><th>Product or item</th><th>Specification</th><th className="num">Quantity</th>{estimate ? <th className="num">Estimated unit cost</th> : null}</tr></thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.id}>
              <td data-label="#">{l.position}</td>
              <td data-label="Product or item">{l.productId ? <Link to={productsPage(companyId, `/${l.productId}`)}><span className="mt-num">{l.productNumber}</span> {l.item}</Link> : l.item}</td>
              <td data-label="Specification" className="small">{l.specification}</td>
              <td data-label="Quantity" className="num">{qty(l.quantity)} {l.uom}</td>
              {estimate ? <td data-label="Estimated unit cost" className="num">{money(l.estUnitCostCents ?? null, currency)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------------------ requests for quotation

export function RfqsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Requests for quotation');
  const { g, set, offset } = useListParams();
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'sort']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'rfqs', filters.toString(), offset], queryFn: () => get<{ rfqs: Rfq[]; total: number }>(erpPath(companyId, `/rfqs?${filters}&limit=${limit}&offset=${offset}`)) });
  const [creating, setCreating] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Ask approved suppliers for prices, record their quotations, and compare them side by side.</p>
        <CsvLink companyId={companyId} path={`/rfqs?${filters}`} />
        {me.can['purchasing.edit'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New request</button> : null}
      </div>
      <FilterPanel active={['q', 'status'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="rfq-q">Search</label><input id="rfq-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, title, item, supplier" /></div>
        <div className="field"><label htmlFor="rfq-st">Status</label><select id="rfq-st" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Any</option><option value="open">Open</option>{options(RFQ_STATUS)}</select></div>
        <div className="field"><label htmlFor="rfq-sort">Sort by</label><select id="rfq-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Newest</option><option value="number">Number</option><option value="reply">Reply by</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.rfqs.length ? (
          <EmptyState icon="message" title={filters.toString() ? 'No requests match' : 'No requests for quotation yet'}>{filters.toString() ? 'Try other words or remove a filter.' : 'Make one from an approved requisition, or start one here.'}</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Title</th><th>Status</th><th>Reply by</th><th className="num">Suppliers</th><th className="num">Quotations</th></tr></thead>
              <tbody>
                {list.data.rfqs.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={procurementPage(companyId, `/rfqs/${r.id}`)}>{r.number}</Link></td>
                    <td data-label="Title">{r.title}{r.requisitionNumber ? <div className="muted small">From {r.requisitionNumber}</div> : null}</td>
                    <td data-label="Status"><RfqBadge value={r.status} /></td>
                    <td data-label="Reply by">{dateText(r.replyBy)}</td>
                    <td data-label="Suppliers" className="num">{r.supplierCount}</td>
                    <td data-label="Quotations" className="num">{r.quotationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {creating ? <RfqDialog companyId={companyId} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}

function SupplierChecks({ suppliers, chosen, setChosen }: { suppliers: SupplierOption[]; chosen: string[]; setChosen: (ids: string[]) => void }) {
  const approved = suppliers.filter((s) => s.status === 'approved');
  if (!approved.length) return <p className="muted small">No approved suppliers yet. A procurement manager approves suppliers on their page.</p>;
  return (
    <fieldset className="erp-checks">
      <legend className="label">Suppliers (approved only)</legend>
      {approved.map((s) => (
        <label key={s.id} className="row">
          <input type="checkbox" checked={chosen.includes(s.id)} onChange={(e) => setChosen(e.target.checked ? [...chosen, s.id] : chosen.filter((x) => x !== s.id))} /> <span className="mt-num">{s.number}</span> {s.name}
        </label>
      ))}
    </fieldset>
  );
}

function RfqDialog({ companyId, fromRequisition, onClose }: { companyId: string; fromRequisition?: Requisition; onClose: () => void }) {
  const navigate = useNavigate();
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const suppliers = useSuppliers(companyId);
  const [f, setF] = useState({ title: fromRequisition?.title ?? '', replyBy: '', requiredDate: fromRequisition?.requiredDate ?? '', deliveryAddress: '', notes: '' });
  const [chosen, setChosen] = useState<string[]>([]);
  const [lines, setLines] = useState<EditLine[]>([newLine()]);
  const [busy, setBusy] = useState(false);
  const b = fromRequisition ? { lines: [] } : linesBody(lines);
  const preview = 'error' in b ? null : { ...f, replyBy: f.replyBy || null, requiredDate: f.requiredDate || null, lines: b.lines };
  const save = async () => {
    if ('error' in b) return toast(b.error, 'error');
    setBusy(true);
    try {
      const r = await post<{ id: string; number: string }>(erpPath(companyId, '/rfqs'), { ...f, replyBy: f.replyBy || null, requiredDate: f.requiredDate || null, requisitionId: fromRequisition?.id, lines: fromRequisition ? undefined : b.lines, supplierIds: chosen });
      toast(`${r.number} created`);
      await refresh();
      navigate(procurementPage(companyId, `/rfqs/${r.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={fromRequisition ? `Request quotations for ${fromRequisition.number}` : 'New request for quotation'} onClose={onClose} wide footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Create'}</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="rfq-title">Title</label><input id="rfq-title" className="input" value={f.title} maxLength={200} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div className="field"><label htmlFor="rfq-reply">Reply by</label><input id="rfq-reply" className="input" type="date" value={f.replyBy} onChange={(e) => setF({ ...f, replyBy: e.target.value })} /></div>
        <div className="field"><label htmlFor="rfq-req">Goods needed by</label><input id="rfq-req" className="input" type="date" value={f.requiredDate} onChange={(e) => setF({ ...f, requiredDate: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="rfq-addr">Deliver to</label><textarea id="rfq-addr" className="textarea" rows={2} maxLength={500} value={f.deliveryAddress} onChange={(e) => setF({ ...f, deliveryAddress: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="rfq-notes">Notes for suppliers</label><textarea id="rfq-notes" className="textarea" rows={2} maxLength={4000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      <SupplierChecks suppliers={suppliers} chosen={chosen} setChosen={setChosen} />
      {fromRequisition ? <p className="muted small">The lines come from {fromRequisition.number}.</p> : (
        <>
          <h3 className="crm-subhead">Lines</h3>
          <LinesEditor companyId={companyId} lines={lines} setLines={setLines} />
          <LivePreview path={erpPath(companyId, '/rfqs/preview')} body={preview} label="Request for quotation" />
        </>
      )}
    </Modal>
  );
}

interface Comparison {
  quotations: {
    quotationId: string;
    supplierId: string;
    supplierNumber: string;
    supplierName: string;
    reference: string;
    receivedDate: string | null;
    validUntil: string | null;
    expired: boolean;
    leadTimeDays: number | null;
    freightCents: number;
    paymentTermsDays: number | null;
    currency: string;
    otherCurrency: boolean;
    notes: string;
    lines: { lineId: string; unitPriceCents: number | null; totalCents: number | null; leadTimeDays: number | null; note: string }[];
    complete: boolean;
    subtotalCents: number;
    totalCents: number;
    cheapest: boolean;
    fastest: boolean;
  }[];
  lineBest: { lineId: string; lowestUnitPriceCents: number | null }[];
  note: string;
}

interface RfqView {
  rfq: Rfq;
  lines: Line[];
  suppliers: { supplierId: string; number: string; name: string; email: string; status: string; sentAt: number | null; sentByName: string | null; quoted: boolean }[];
  comparison: Comparison;
  quotationFiles: (RecordFile & { quotationId: string })[];
  purchaseOrders: { id: string; number: string; status: string }[];
  files: RecordFile[];
  history: ErpEvent[];
  email: { available: boolean; note: string };
  can: { edit: boolean; suppliers: boolean; send: boolean; quote: boolean; select: boolean; unselect: boolean; approve: boolean; order: boolean; cancel: boolean; segregation: string | null };
}

export function RfqDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const act = useAct(companyId);
  const suppliers = useSuppliers(companyId);
  const q = useQuery({ queryKey: ['erp', companyId, 'rfq', id], queryFn: () => get<RfqView>(erpPath(companyId, `/rfqs/${id}`)), retry: false });
  const [ask, setAsk] = useState<string>('');
  const [adding, setAdding] = useState('');
  usePageTitle(q.data ? q.data.rfq.number : 'Request for quotation');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const r = v.rfq;
  const c = v.comparison;
  const selected = c.quotations.find((x) => x.quotationId === r.selectedQuotationId);
  const order = async () => {
    const po = (await act(() => post<{ id: string; number: string }>(erpPath(companyId, '/purchase-orders'), { fromQuotationId: r.selectedQuotationId }), 'Purchase order drafted')) as { id: string } | undefined;
    if (po) navigate(procurementPage(companyId, `/purchase-orders/${po.id}`));
  };
  const onRfq = new Set(v.suppliers.map((s) => s.supplierId));
  const addable = suppliers.filter((s) => s.status === 'approved' && !onRfq.has(s.id));
  return (
    <div className="stack">
      <Crumbs companyId={companyId} list="/rfqs" label="Requests for quotation" here={r.number} />
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{r.number}</span> {r.title}</h2>
          <div className="mt-badges"><RfqBadge value={r.status} />{r.requisitionNumber ? <Link className="badge" to={procurementPage(companyId, `/requisitions/${r.requisitionId}`)}>From {r.requisitionNumber}</Link> : null}{r.sodException ? <span className="badge warning">Recorded exception: choice approved by the person who made it (one-person company)</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          <a className="btn" href={apiHref(companyId, `/rfqs/${r.id}/pdf`)} target="_blank" rel="noopener"><Icon name="file" /> PDF</a>
          {v.can.select ? <button className="btn primary" onClick={() => setAsk('select')}>Select a supplier</button> : null}
          {v.can.approve ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/rfqs/${r.id}/approve`), {}), 'Choice approved')}><Icon name="check" /> Approve the choice</button> : null}
          {v.can.unselect ? <button className="btn" onClick={() => setAsk('unselect')}>Return the choice</button> : null}
          {v.can.order ? <button className="btn primary" onClick={() => void order()}>Make the purchase order</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setAsk('cancel')}>Cancel</button> : null}
        </div>
      </div>
      {v.can.segregation ? <p className="warn-box small"><Icon name="info" size={14} /> {v.can.segregation}</p> : null}
      {selected ? <p className="small"><strong>Selected:</strong> {selected.supplierName}, {money(selected.totalCents, selected.currency)}. {r.selectionReason}{r.selectedByName ? ` (${r.selectedByName})` : ''}{r.approvedByName ? `. Approved by ${r.approvedByName} ${dayText(r.approvedAt)}.` : ''}</p> : null}
      <Section title="Suppliers" actions={v.can.suppliers && addable.length ? (
        <div className="row"><select className="select" aria-label="Add a supplier" value={adding} onChange={(e) => setAdding(e.target.value)}><option value="">Add a supplier…</option>{addable.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select><button className="btn sm" disabled={!adding} onClick={() => void act(() => post(erpPath(companyId, `/rfqs/${r.id}/suppliers`), { supplierId: adding }), 'Supplier added').then(() => setAdding(''))}>Add</button></div>
      ) : undefined}>
        <p className="muted small">{v.email.note}</p>
        {!v.suppliers.length ? <p className="muted small">No suppliers yet.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Supplier</th><th>Sent</th><th>Quotation</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {v.suppliers.map((s) => (
                  <tr key={s.supplierId}>
                    <td data-label="Supplier"><Link to={procurementPage(companyId, `/suppliers/${s.supplierId}`)}><span className="mt-num">{s.number}</span> {s.name}</Link>{s.email ? <div className="muted small">{s.email}</div> : null}</td>
                    <td data-label="Sent">{s.sentAt ? `${dayText(s.sentAt)}, by hand${s.sentByName ? ` (${s.sentByName})` : ''}` : <span className="muted">Not yet</span>}</td>
                    <td data-label="Quotation">{s.quoted ? <span className="badge success">Recorded</span> : <span className="muted">None</span>}</td>
                    <td className="erp-actions">
                      <a className="btn ghost sm" href={apiHref(companyId, `/rfqs/${r.id}/pdf?supplierId=${s.supplierId}`)} download><Icon name="download" size={14} /> PDF</a>
                      {v.can.send ? <button className="btn ghost sm" onClick={() => void act(() => post(erpPath(companyId, `/rfqs/${r.id}/sent`), { supplierId: s.supplierId }), 'Recorded as sent')}>Record as sent</button> : null}
                      {v.can.quote ? <button className="btn sm" onClick={() => setAsk(`quote:${s.supplierId}`)}>{s.quoted ? 'Change quotation' : 'Record quotation'}</button> : null}
                      {v.can.suppliers && !s.quoted ? <button className="btn ghost icon sm" aria-label={`Remove ${s.name}`} onClick={() => void act(() => del(erpPath(companyId, `/rfqs/${r.id}/suppliers/${s.supplierId}`)), 'Supplier removed')}><Icon name="trash" size={14} /></button> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <Section title="Comparison" actions={c.quotations.length ? <CsvLink companyId={companyId} path={`/rfqs/${r.id}`} /> : undefined}>
        {!c.quotations.length ? <p className="muted small">Record the suppliers’ quotations to compare them here.</p> : (
          <>
            <div className="crm-table-scroll">
              <table className="data-table erp-compare">
                <thead>
                  <tr>
                    <th>Line</th>
                    {c.quotations.map((x) => (
                      <th key={x.quotationId} className="num">
                        {x.supplierName}
                        <div className="mt-badges">{x.cheapest ? <span className="badge success">Cheapest</span> : null}{x.fastest ? <span className="badge accent">Fastest</span> : null}{x.quotationId === r.selectedQuotationId ? <span className="badge warning">Selected</span> : null}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {v.lines.map((l, i) => (
                    <tr key={l.id}>
                      <th scope="row" className="small">{l.productNumber ? <span className="mt-num">{l.productNumber} </span> : null}{l.item}<div className="muted small">{qty(l.quantity)} {l.uom}</div></th>
                      {c.quotations.map((x) => {
                        const p = x.lines[i];
                        const best = c.lineBest[i]?.lowestUnitPriceCents;
                        return (
                          <td key={x.quotationId} className="num">
                            {p.unitPriceCents === null ? <span className="muted">Not quoted</span> : <><span className={!x.otherCurrency && best === p.unitPriceCents ? 'erp-best' : undefined}>{money(p.unitPriceCents, x.currency)}</span><div className="muted small">{money(p.totalCents, x.currency)}</div></>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr><th scope="row">Freight</th>{c.quotations.map((x) => <td key={x.quotationId} className="num">{money(x.freightCents, x.currency)}</td>)}</tr>
                  <tr className="erp-total"><th scope="row">Total</th>{c.quotations.map((x) => <td key={x.quotationId} className="num"><strong>{money(x.totalCents, x.currency)}</strong>{!x.complete ? <div className="muted small">Incomplete</div> : null}{x.otherCurrency ? <div className="muted small">Other currency</div> : null}</td>)}</tr>
                  <tr><th scope="row">Lead time</th>{c.quotations.map((x) => <td key={x.quotationId} className="num">{x.leadTimeDays !== null ? `${x.leadTimeDays} days` : ''}</td>)}</tr>
                  <tr><th scope="row">Payment terms</th>{c.quotations.map((x) => <td key={x.quotationId} className="num">{x.paymentTermsDays !== null ? `${x.paymentTermsDays} days` : ''}</td>)}</tr>
                  <tr><th scope="row">Valid until</th>{c.quotations.map((x) => <td key={x.quotationId} className="num">{dateText(x.validUntil)}{x.expired ? <div className="badge danger">Expired</div> : null}</td>)}</tr>
                  <tr><th scope="row">Reference</th>{c.quotations.map((x) => <td key={x.quotationId} className="num small">{x.reference}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <p className="muted small">{c.note}</p>
            {v.quotationFiles.length ? <><h3 className="crm-subhead">Quotation documents</h3><ErpFiles files={v.quotationFiles} canRemove={false} onRemove={() => undefined} /></> : null}
          </>
        )}
      </Section>
      <div className="mt-grid">
        <Section title="Lines"><LinesTable companyId={companyId} lines={v.lines} currency={r.currency} /></Section>
        <div className="stack">
          <Section title="Details">
            <Props items={[['Reply by', dateText(r.replyBy)], ['Goods needed by', dateText(r.requiredDate)], ['Currency', r.currency], ['Deliver to', r.deliveryAddress], ['Notes', r.notes], ['Created', `${dayText(r.createdAt)}${r.createdByName ? ` by ${r.createdByName}` : ''}`]]} />
            {v.purchaseOrders.length ? <p className="small">Purchase order: {v.purchaseOrders.map((p) => <Link key={p.id} to={procurementPage(companyId, `/purchase-orders/${p.id}`)} className="mt-num">{p.number} </Link>)}</p> : null}
          </Section>
          <Files companyId={companyId} kind="rfq" id={r.id} files={v.files} canAdd={v.can.edit || v.can.quote} />
          <Section title="History"><History events={v.history} /></Section>
        </div>
      </div>
      {ask.startsWith('quote:') ? <QuotationDialog companyId={companyId} view={v} supplierId={ask.slice(6)} onClose={() => setAsk('')} /> : null}
      {ask === 'select' ? <SelectDialog companyId={companyId} view={v} onClose={() => setAsk('')} /> : null}
      {ask === 'unselect' ? <NoteDialog title="Return the choice" label="Why (optional)" confirm="Return it" onClose={() => setAsk('')} onSave={async (note) => { await act(() => post(erpPath(companyId, `/rfqs/${r.id}/unselect`), { note }), 'Choice returned'); setAsk(''); }} /> : null}
      {ask === 'cancel' ? <NoteDialog title={`Cancel ${r.number}`} label="Why (optional)" confirm="Cancel the request" danger onClose={() => setAsk('')} onSave={async (note) => { await act(() => post(erpPath(companyId, `/rfqs/${r.id}/cancel`), { note }), `${r.number} cancelled`); setAsk(''); }} /> : null}
    </div>
  );
}

function QuotationDialog({ companyId, view, supplierId, onClose }: { companyId: string; view: RfqView; supplierId: string; onClose: () => void }) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const sup = view.suppliers.find((s) => s.supplierId === supplierId)!;
  const existing = view.comparison.quotations.find((x) => x.supplierId === supplierId);
  const [f, setF] = useState({
    reference: existing?.reference ?? '',
    receivedDate: existing?.receivedDate ?? '',
    validUntil: existing?.validUntil ?? '',
    leadTimeDays: existing?.leadTimeDays?.toString() ?? '',
    freight: existing ? dollars(existing.freightCents) : '',
    paymentTermsDays: existing?.paymentTermsDays?.toString() ?? '',
    currency: existing?.currency ?? view.rfq.currency,
    notes: existing?.notes ?? '',
  });
  const [prices, setPrices] = useState<Record<string, string>>(() => Object.fromEntries(view.lines.map((l, i) => [l.id, existing?.lines[i]?.unitPriceCents != null ? dollars(existing.lines[i].unitPriceCents) : ''])));
  const [busy, setBusy] = useState(false);
  const save = async () => {
    const freight = toCents(f.freight);
    if (freight === 'bad') return toast('Use a freight amount like 25.00', 'error');
    const lines = [];
    for (const l of view.lines) {
      const c = toCents(prices[l.id] ?? '');
      if (c === 'bad') return toast(`${l.item}: use a price like 12.50`, 'error');
      lines.push({ rfqLineId: l.id, unitPriceCents: c });
    }
    setBusy(true);
    try {
      await put(erpPath(companyId, `/rfqs/${view.rfq.id}/quotations/${supplierId}`), {
        reference: f.reference,
        receivedDate: f.receivedDate || null,
        validUntil: f.validUntil || null,
        leadTimeDays: f.leadTimeDays.trim() ? Number(f.leadTimeDays) : null,
        freightCents: freight ?? 0,
        paymentTermsDays: f.paymentTermsDays.trim() ? Number(f.paymentTermsDays) : null,
        currency: f.currency,
        notes: f.notes,
        lines,
      });
      toast('Quotation recorded');
      await refresh();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`Quotation from ${sup.name}`} onClose={onClose} wide footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="qt-ref">Their reference</label><input id="qt-ref" className="input" value={f.reference} maxLength={100} onChange={(e) => setF({ ...f, reference: e.target.value })} /></div>
        <div className="field"><label htmlFor="qt-rec">Received</label><input id="qt-rec" className="input" type="date" value={f.receivedDate} onChange={(e) => setF({ ...f, receivedDate: e.target.value })} /></div>
        <div className="field"><label htmlFor="qt-valid">Valid until</label><input id="qt-valid" className="input" type="date" value={f.validUntil} onChange={(e) => setF({ ...f, validUntil: e.target.value })} /></div>
        <div className="field"><label htmlFor="qt-lead">Lead time (days)</label><input id="qt-lead" className="input" type="number" min="0" max="1000" value={f.leadTimeDays} onChange={(e) => setF({ ...f, leadTimeDays: e.target.value })} /></div>
        <div className="field"><label htmlFor="qt-freight">Freight</label><input id="qt-freight" className="input" inputMode="decimal" value={f.freight} onChange={(e) => setF({ ...f, freight: e.target.value })} placeholder="0.00" /></div>
        <div className="field"><label htmlFor="qt-terms">Payment terms (days)</label><input id="qt-terms" className="input" type="number" min="0" max="365" value={f.paymentTermsDays} onChange={(e) => setF({ ...f, paymentTermsDays: e.target.value })} /></div>
        <div className="field"><label htmlFor="qt-cur">Currency</label><input id="qt-cur" className="input" maxLength={3} value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value.toUpperCase() })} /></div>
        <div className="field span-2"><label htmlFor="qt-notes">Notes</label><textarea id="qt-notes" className="textarea" rows={2} maxLength={4000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      <h3 className="crm-subhead">Unit prices</h3>
      <div className="crm-table-scroll">
        <table className="data-table responsive">
          <thead><tr><th>Line</th><th className="num">Quantity</th><th className="num">Unit price</th></tr></thead>
          <tbody>
            {view.lines.map((l) => (
              <tr key={l.id}>
                <td data-label="Line">{l.productNumber ? <span className="mt-num">{l.productNumber} </span> : null}{l.item}</td>
                <td data-label="Quantity" className="num">{qty(l.quantity)} {l.uom}</td>
                <td data-label="Unit price" className="num"><input className="input erp-money-input" inputMode="decimal" aria-label={`Unit price for ${l.item}`} value={prices[l.id] ?? ''} onChange={(e) => setPrices({ ...prices, [l.id]: e.target.value })} placeholder="Not quoted" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {existing ? <div className="row"><span className="muted small grow">Attach the supplier’s quotation document:</span><RecordUpload companyId={companyId} kind="quotation" id={existing.quotationId} onDone={() => void refresh()} /></div> : <p className="muted small">Save first, then attach the supplier’s document.</p>}
    </Modal>
  );
}

function SelectDialog({ companyId, view, onClose }: { companyId: string; view: RfqView; onClose: () => void }) {
  const act = useAct(companyId);
  const cheapest = view.comparison.quotations.find((x) => x.cheapest);
  const [choice, setChoice] = useState(cheapest?.quotationId ?? '');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal title="Select a supplier" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !choice || reason.trim().length < 3} onClick={async () => { setBusy(true); const ok = await act(() => post(erpPath(companyId, `/rfqs/${view.rfq.id}/select`), { quotationId: choice, reason }), 'Supplier selected: a procurement manager approves the choice'); setBusy(false); if (ok) onClose(); }}>{busy ? 'Saving…' : 'Select'}</button></>}>
      <fieldset className="erp-checks">
        <legend className="label">Quotation</legend>
        {view.comparison.quotations.map((x) => (
          <label key={x.quotationId} className="row"><input type="radio" name="qsel" checked={choice === x.quotationId} onChange={() => setChoice(x.quotationId)} /> {x.supplierName}: {money(x.totalCents, x.currency)}{x.leadTimeDays !== null ? `, ${x.leadTimeDays} days` : ''}{x.cheapest ? ' (cheapest)' : ''}{x.fastest ? ' (fastest)' : ''}{!x.complete ? ' (incomplete)' : ''}</label>
        ))}
      </fieldset>
      <div className="field"><label htmlFor="sel-reason">Why this supplier</label><textarea id="sel-reason" className="textarea" rows={3} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
    </Modal>
  );
}

// ------------------------------------------------------------------ purchase orders

export function PurchaseOrdersPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Purchase orders');
  const { g, set, offset } = useListParams();
  const suppliers = useSuppliers(companyId);
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'status', 'supplierId', 'from', 'to', 'sort']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'pos', filters.toString(), offset], queryFn: () => get<{ purchaseOrders: PurchaseOrder[]; total: number }>(erpPath(companyId, `/purchase-orders?${filters}&limit=${limit}&offset=${offset}`)) });
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Orders to approved suppliers. Within the company’s approval limit a buyer’s order is approved on submit; above it a procurement manager approves.</p>
        <CsvLink companyId={companyId} path={`/purchase-orders?${filters}`} />
        {me.can['purchasing.edit'] ? <Link className="btn primary" to={procurementPage(companyId, '/purchase-orders/new')}><Icon name="plus" /> New purchase order</Link> : null}
      </div>
      <FilterPanel active={['q', 'status', 'supplierId', 'from', 'to'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="po-q">Search</label><input id="po-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, supplier, item" /></div>
        <div className="field"><label htmlFor="po-st">Status</label><select id="po-st" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Any</option><option value="open">Open</option><option value="to_receive">To receive</option>{options(PO_STATUS)}</select></div>
        <div className="field"><label htmlFor="po-sup">Supplier</label><select id="po-sup" className="select" value={g('supplierId')} onChange={(e) => set('supplierId', e.target.value)}><option value="">Any</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div>
        <div className="field"><label htmlFor="po-from">Ordered from</label><input id="po-from" className="input" type="date" value={g('from')} onChange={(e) => set('from', e.target.value)} /></div>
        <div className="field"><label htmlFor="po-to">to</label><input id="po-to" className="input" type="date" value={g('to')} onChange={(e) => set('to', e.target.value)} /></div>
        <div className="field"><label htmlFor="po-sort">Sort by</label><select id="po-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Order date</option><option value="number">Number</option><option value="required">Required date</option><option value="total">Total</option><option value="supplier">Supplier</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.purchaseOrders.length ? (
          <EmptyState icon="briefcase" title={filters.toString() ? 'No purchase orders match' : 'No purchase orders yet'}>{filters.toString() ? 'Try other words or remove a filter.' : 'Make one from an approved quotation choice, a requisition, or start one here.'}</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Supplier</th><th>Status</th><th>Ordered</th><th>Required</th><th className="num">Total</th></tr></thead>
              <tbody>
                {list.data.purchaseOrders.map((o) => (
                  <tr key={o.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={procurementPage(companyId, `/purchase-orders/${o.id}`)}>{o.number}</Link>{o.revision > 1 ? <span className="muted small"> rev {o.revision}</span> : null}</td>
                    <td data-label="Supplier">{o.supplierName}</td>
                    <td data-label="Status"><PoBadge value={o.status} /></td>
                    <td data-label="Ordered">{dateText(o.orderDate)}</td>
                    <td data-label="Required">{dateText(o.requiredDate)}</td>
                    <td data-label="Total" className="num">{money(o.totalCents, o.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
    </div>
  );
}

interface PoOptions {
  financeOrg: { id: string; name: string } | null;
  taxCodes: { value: string; label: string; rateBp: number }[];
  defaultTaxCode: string;
  currency: string;
  paymentTermsDays: number | null;
  approvalLimitCents: number | null;
  companyCurrency: string;
  email: { available: boolean; note: string };
}

/** A new purchase order, or a draft's changes, with the PDF drawn beside it as it is typed. */
export function PoEditor({ companyId }: { companyId: string }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const suppliers = useSuppliers(companyId);
  const existing = useQuery({ queryKey: ['erp', companyId, 'po', id], queryFn: () => get<PoView>(erpPath(companyId, `/purchase-orders/${id}`)), enabled: !!id });
  const [f, setF] = useState<null | { supplierId: string; orderDate: string; requiredDate: string; deliveryAddress: string; paymentTermsDays: string; currency: string; taxMode: string; notes: string; terms: string }>(null);
  const [lines, setLines] = useState<EditLine[] | null>(null);
  const [busy, setBusy] = useState(false);
  if (id && existing.data && !f) {
    const o = existing.data.purchaseOrder;
    setF({ supplierId: o.supplierId, orderDate: o.orderDate, requiredDate: o.requiredDate ?? '', deliveryAddress: o.deliveryAddress, paymentTermsDays: o.paymentTermsDays?.toString() ?? '', currency: o.currency, taxMode: o.taxMode, notes: o.notes, terms: o.terms });
    setLines(existing.data.lines.map((l) => fromLine(l, l.unitPriceCents)));
  }
  if (!id && !f) {
    setF({ supplierId: '', orderDate: new Date().toISOString().slice(0, 10), requiredDate: '', deliveryAddress: '', paymentTermsDays: '', currency: '', taxMode: 'exclusive', notes: '', terms: '' });
    setLines([newLine()]);
  }
  const opts = useQuery({ queryKey: ['erp', companyId, 'po-options', f?.supplierId ?? ''], queryFn: () => get<PoOptions>(erpPath(companyId, `/purchase-order-options${f?.supplierId ? `?supplierId=${f.supplierId}` : ''}`)), enabled: !!f });
  usePageTitle(id ? 'Edit purchase order' : 'New purchase order');
  if (id && existing.error) return <ErrorBox error={existing.error} retry={() => existing.refetch()} />;
  if (!f || !lines) return <Loading />;
  const b = linesBody(lines, 'order');
  const header = { orderDate: f.orderDate || undefined, requiredDate: f.requiredDate || null, deliveryAddress: f.deliveryAddress, paymentTermsDays: f.paymentTermsDays.trim() ? Number(f.paymentTermsDays) : null, currency: f.currency || opts.data?.currency || undefined, taxMode: f.taxMode as 'exclusive', notes: f.notes, terms: f.terms };
  const preview = 'error' in b ? null : { ...header, supplierId: f.supplierId || undefined, number: existing.data?.purchaseOrder.number, revision: existing.data?.purchaseOrder.revision, lines: b.lines };
  const save = async () => {
    if ('error' in b) return toast(b.error, 'error');
    if (!id && !f.supplierId) return toast('Choose the supplier', 'error');
    setBusy(true);
    try {
      if (id) {
        await put(erpPath(companyId, `/purchase-orders/${id}`), { ...header, lines: b.lines });
        toast('Saved');
        await refresh();
        navigate(procurementPage(companyId, `/purchase-orders/${id}`));
      } else {
        const r = await post<{ id: string; number: string }>(erpPath(companyId, '/purchase-orders'), { ...header, supplierId: f.supplierId, lines: b.lines });
        toast(`${r.number} saved as a draft`);
        await refresh();
        navigate(procurementPage(companyId, `/purchase-orders/${r.id}`));
      }
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const approved = suppliers.filter((s) => s.status === 'approved');
  const o = existing.data?.purchaseOrder;
  return (
    <div className="stack">
      <Crumbs companyId={companyId} list="/purchase-orders" label="Purchase orders" here={o ? `Edit ${o.number}${o.revision > 1 ? ` rev ${o.revision}` : ''}` : 'New'} />
      <div className="fin-editor-split">
        <div className="stack">
          <section className="card card-pad stack">
            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="po-supplier">Supplier (approved only)</label>
                {o ? <input id="po-supplier" className="input" value={`${o.supplierNumber} ${o.supplierName}`} disabled /> : (
                  <select id="po-supplier" className="select" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value, currency: '', paymentTermsDays: '' })}><option value="">Choose…</option>{approved.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select>
                )}
              </div>
              <div className="field"><label htmlFor="po-date">Order date</label><input id="po-date" className="input" type="date" value={f.orderDate} onChange={(e) => setF({ ...f, orderDate: e.target.value })} /></div>
              <div className="field"><label htmlFor="po-req">Required by</label><input id="po-req" className="input" type="date" value={f.requiredDate} onChange={(e) => setF({ ...f, requiredDate: e.target.value })} /></div>
              <div className="field"><label htmlFor="po-terms-days">Payment terms (days)</label><input id="po-terms-days" className="input" type="number" min="0" max="365" placeholder={opts.data?.paymentTermsDays?.toString() ?? ''} value={f.paymentTermsDays} onChange={(e) => setF({ ...f, paymentTermsDays: e.target.value })} /></div>
              <div className="field"><label htmlFor="po-cur">Currency</label><input id="po-cur" className="input" maxLength={3} placeholder={opts.data?.currency ?? 'AUD'} value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value.toUpperCase() })} /></div>
              <div className="field"><label htmlFor="po-tax">Prices</label><select id="po-tax" className="select" value={f.taxMode} onChange={(e) => setF({ ...f, taxMode: e.target.value })}><option value="exclusive">Before GST</option><option value="inclusive">Including GST</option><option value="none">No GST</option></select></div>
              <div className="field span-2"><label htmlFor="po-addr">Deliver to</label><textarea id="po-addr" className="textarea" rows={2} maxLength={500} value={f.deliveryAddress} onChange={(e) => setF({ ...f, deliveryAddress: e.target.value })} /></div>
            </div>
            {opts.data ? <p className="muted small">{opts.data.financeOrg ? `Tax codes from ${opts.data.financeOrg.name} (Finance).` : 'GST or none: the company has no Finance business workspace for these tax codes.'} {opts.data.approvalLimitCents !== null ? `Orders up to ${money(opts.data.approvalLimitCents, opts.data.companyCurrency)} are approved when a buyer submits them.` : 'Every order is approved by a procurement manager (no approval limit is set).'}</p> : null}
          </section>
          <section className="card card-pad stack">
            <h2 className="crm-subhead">Lines</h2>
            <LinesEditor companyId={companyId} lines={lines} setLines={setLines} price="order" taxCodes={opts.data?.taxCodes} />
          </section>
          <section className="card card-pad stack">
            <div className="field"><label htmlFor="po-notes">Notes for the supplier</label><textarea id="po-notes" className="textarea" rows={2} maxLength={4000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
            <div className="field"><label htmlFor="po-terms">Terms</label><textarea id="po-terms" className="textarea" rows={2} maxLength={2000} value={f.terms} onChange={(e) => setF({ ...f, terms: e.target.value })} /></div>
          </section>
          <div className="row"><div className="grow" /><Link className="btn" to={procurementPage(companyId, id ? `/purchase-orders/${id}` : '/purchase-orders')}>Cancel</Link><button className="btn primary" disabled={busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Save draft'}</button></div>
        </div>
        <LivePreview path={erpPath(companyId, '/purchase-orders/preview')} body={preview} label="Purchase order" />
      </div>
    </div>
  );
}

interface PoView {
  purchaseOrder: PurchaseOrder;
  lines: PoLine[];
  taxCodes: { value: string; label: string; rateBp: number }[];
  receipts: { id: string; number: string; receivedDate: string; deliveryRef: string; onTime: boolean | null; inspectionRequired: boolean; byName: string | null }[];
  revisions: { revision: number; reason: string; changedAt: number; byName: string | null; snapshot: PurchaseOrder & { lines: PoLine[] } }[];
  files: RecordFile[];
  history: ErpEvent[];
  approvalLimitCents: number | null;
  companyCurrency: string;
  email: { available: boolean; note: string };
  can: { edit: boolean; submit: boolean; approve: boolean; reject: boolean; send: boolean; receive: boolean; amend: boolean; cancel: boolean; close: boolean; files: boolean; segregation: string | null };
}

export function PurchaseOrderDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const act = useAct(companyId);
  const q = useQuery({ queryKey: ['erp', companyId, 'po', id], queryFn: () => get<PoView>(erpPath(companyId, `/purchase-orders/${id}`)), retry: false });
  const [ask, setAsk] = useState('');
  usePageTitle(q.data ? q.data.purchaseOrder.number : 'Purchase order');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const o = v.purchaseOrder;
  const run = (action: string, body: Record<string, unknown>, done: string) => act(() => post(erpPath(companyId, `/purchase-orders/${o.id}/${action}`), body), done).then(() => setAsk(''));
  const pdf = apiHref(companyId, `/purchase-orders/${o.id}/pdf`);
  return (
    <div className="stack">
      <Crumbs companyId={companyId} list="/purchase-orders" label="Purchase orders" here={o.number} />
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{o.number}</span>{o.revision > 1 ? <span className="muted"> rev {o.revision}</span> : null} {o.supplierName}</h2>
          <div className="mt-badges"><PoBadge value={o.status} />{o.approvalRuleLabel ? <span className="badge">{o.approvalRuleLabel}</span> : null}{o.sodException ? <span className="badge warning">Recorded exception (one-person company)</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          <a className="btn" href={`${pdf}?inline=1`} target="_blank" rel="noopener"><Icon name="eye" /> View PDF</a>
          <a className="btn ghost" href={pdf} download><Icon name="download" /> Download</a>
          {v.can.edit ? <Link className="btn" to={procurementPage(companyId, `/purchase-orders/${o.id}/edit`)}><Icon name="edit" /> Edit</Link> : null}
          {v.can.submit ? <button className="btn primary" onClick={() => void run('submit', {}, 'Submitted')}>Submit</button> : null}
          {v.can.approve ? <button className="btn primary" onClick={() => void run('approve', {}, `${o.number} approved`)}><Icon name="check" /> Approve</button> : null}
          {v.can.reject ? <button className="btn" onClick={() => setAsk('reject')}>Return to draft</button> : null}
          {v.can.send ? <button className="btn" onClick={() => void run('sent', {}, 'Recorded as sent')}>Record as sent</button> : null}
          {v.can.receive ? <button className="btn primary" onClick={() => setAsk('receive')}><Icon name="inbox" /> Receive goods</button> : null}
          {v.can.amend ? <button className="btn" onClick={() => setAsk('amend')}>Amend</button> : null}
          {v.can.close ? <button className="btn ghost" onClick={() => setAsk('close')}>Close</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setAsk('cancel')}>Cancel</button> : null}
        </div>
      </div>
      {v.can.segregation ? <p className="warn-box small"><Icon name="info" size={14} /> {v.can.segregation}</p> : null}
      {v.can.send ? <p className="muted small">{v.email.note}</p> : null}
      <Section title="Lines">
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>#</th><th>Product or item</th><th className="num">Ordered</th><th className="num">Unit price</th><th className="num">Net</th><th className="num">Tax</th><th className="num">Received</th><th className="num">Outstanding</th></tr></thead>
            <tbody>
              {v.lines.map((l) => (
                <tr key={l.id}>
                  <td data-label="#">{l.position}</td>
                  <td data-label="Product or item">{l.productId ? <Link to={productsPage(companyId, `/${l.productId}`)}><span className="mt-num">{l.productNumber}</span> {l.item}</Link> : l.item}{l.specification ? <div className="muted small">{l.specification}</div> : null}</td>
                  <td data-label="Ordered" className="num">{qty(l.quantity)} {l.uom}</td>
                  <td data-label="Unit price" className="num">{money(l.unitPriceCents, o.currency)}{l.discountBp ? <div className="muted small">less {l.discountBp / 100}%</div> : null}</td>
                  <td data-label="Net" className="num">{money(l.netCents, o.currency)}</td>
                  <td data-label="Tax" className="num">{money(l.taxCents, o.currency)}</td>
                  <td data-label="Received" className="num">{qty(l.received)}{l.rejected ? <div className="muted small">{qty(l.rejected)} refused</div> : null}</td>
                  <td data-label="Outstanding" className="num">{l.outstanding ? qty(l.outstanding) : <span className="badge success">Done</span>}</td>
                </tr>
              ))}
              <tr className="erp-total"><th colSpan={4} scope="row">Total</th><td className="num">{money(o.subtotalCents, o.currency)}</td><td className="num">{money(o.taxCents, o.currency)}</td><td colSpan={2} className="num"><strong>{money(o.totalCents, o.currency)}</strong></td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <div className="mt-grid">
        <div className="stack">
          <Section title="Details">
            <Props
              items={[
                ['Supplier', <Link key="s" to={procurementPage(companyId, `/suppliers/${o.supplierId}`)}>{o.supplierNumber} {o.supplierName}</Link>],
                ['Order date', dateText(o.orderDate)],
                ['Required by', dateText(o.requiredDate)],
                ['Payment terms', o.paymentTermsDays !== null ? `${o.paymentTermsDays} days` : ''],
                ['Prices', o.taxMode === 'exclusive' ? 'Before GST' : o.taxMode === 'inclusive' ? 'Including GST' : 'No GST'],
                ['Deliver to', o.deliveryAddress],
                ['From', o.rfqNumber ? <Link key="r" to={procurementPage(companyId, `/rfqs/${o.rfqId}`)}>{o.rfqNumber}</Link> : o.requisitionNumber ? <Link key="q" to={procurementPage(companyId, `/requisitions/${o.requisitionId}`)}>{o.requisitionNumber}</Link> : ''],
                ['Approval', o.approvedAt ? `${dayText(o.approvedAt)}${o.approvedByName ? ` by ${o.approvedByName}` : ''}${o.approvalLimitCents !== null ? `, limit ${money(o.approvalLimitCents, v.companyCurrency)}` : ''}` : ''],
                ['Sent', o.sentAt ? `${dayText(o.sentAt)}, by hand` : ''],
                ['Cancelled', o.cancelReason],
                ['Notes', o.notes],
                ['Terms', o.terms],
                ['Created', `${dayText(o.createdAt)}${o.createdByName ? ` by ${o.createdByName}` : ''}`],
              ]}
            />
          </Section>
          <Section title="Receipts">
            {!v.receipts.length ? <p className="muted small">Nothing received yet.</p> : (
              <ul className="erp-list">
                {v.receipts.map((r) => <li key={r.id}><Link to={procurementPage(companyId, `/receipts/${r.id}`)}><span className="mt-num">{r.number}</span></Link> {dateText(r.receivedDate)}{r.deliveryRef ? ` · ${r.deliveryRef}` : ''} {r.onTime === false ? <span className="badge warning">Late</span> : r.onTime ? <span className="badge success">On time</span> : null}{r.inspectionRequired ? <> <span className="badge warning">Inspection required</span></> : null}</li>)}
              </ul>
            )}
          </Section>
          {v.revisions.length ? (
            <Section title="Earlier versions">
              <ul className="erp-list">
                {v.revisions.map((r) => (
                  <li key={r.revision}>
                    <strong>Revision {r.revision}</strong>: {money(r.snapshot.totalCents, r.snapshot.currency)}, {r.snapshot.lines.length} line{r.snapshot.lines.length === 1 ? '' : 's'}. Amended {dayText(r.changedAt)}{r.byName ? ` by ${r.byName}` : ''}: {r.reason}
                    <details><summary className="small">Its lines</summary><ul className="small">{r.snapshot.lines.map((l) => <li key={l.id}>{l.item}: {qty(l.quantity)} {l.uom} at {money(l.unitPriceCents, r.snapshot.currency)}</li>)}</ul></details>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
        <div className="stack">
          <Files companyId={companyId} kind="purchase_order" id={o.id} files={v.files} canAdd={v.can.files} />
          <Section title="History"><History events={v.history} /></Section>
        </div>
      </div>
      {ask === 'receive' ? <ReceiveDialog companyId={companyId} view={v} onClose={() => setAsk('')} /> : null}
      {ask === 'reject' ? <NoteDialog title={`Return ${o.number} to draft`} label="Why" confirm="Return it" required onClose={() => setAsk('')} onSave={(note) => run('reject', { note }, 'Returned to draft')} /> : null}
      {ask === 'amend' ? <NoteDialog title={`Amend ${o.number}`} label="Why it changes (this version is kept, and the order goes back to approval)" confirm="Amend" required onClose={() => setAsk('')} onSave={(reason) => run('amend', { reason }, 'Amended: change it, then submit it again')} /> : null}
      {ask === 'cancel' ? <NoteDialog title={`Cancel ${o.number}`} label="Why" confirm="Cancel the order" required danger onClose={() => setAsk('')} onSave={(reason) => run('cancel', { reason }, `${o.number} cancelled`)} /> : null}
      {ask === 'close' ? <NoteDialog title={`Close ${o.number}`} label="Note (optional): anything still outstanding is no longer expected" confirm="Close" onClose={() => setAsk('')} onSave={(reason) => run('close', { reason }, `${o.number} closed`)} /> : null}
    </div>
  );
}

interface ReceiveRow {
  received: string;
  damaged: string;
  rejected: string;
  reason: string;
  locationId: string;
  lot: string;
  serials: string;
  expiry: string;
}

function ReceiveDialog({ companyId, view, onClose }: { companyId: string; view: PoView; onClose: () => void }) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const navigate = useNavigate();
  const locs = useQuery({ queryKey: ['erp', companyId, 'locations', 'all'], queryFn: () => get<{ locations: Location[] }>(erpPath(companyId, '/locations')) });
  const open = view.lines.filter((l) => l.outstanding > 0);
  const [rows, setRows] = useState<Record<string, ReceiveRow>>(() => Object.fromEntries(open.map((l) => [l.id, { received: String(l.outstanding), damaged: '', rejected: '', reason: '', locationId: '', lot: '', serials: '', expiry: '' }])));
  const [head, setHead] = useState({ receivedDate: new Date().toISOString().slice(0, 10), deliveryRef: '', notes: '' });
  // one key per opening of the dialog: a double click or a retry finds the first receipt
  const [requestKey] = useState(() => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`));
  const [busy, setBusy] = useState(false);
  const upd = (id: string, p: Partial<ReceiveRow>) => setRows({ ...rows, [id]: { ...rows[id], ...p } });
  const save = async () => {
    const lines = [];
    for (const l of open) {
      const r = rows[l.id];
      const received = Number(r.received || 0);
      if (!(received > 0)) continue;
      lines.push({ poLineId: l.id, received, damaged: Number(r.damaged || 0), rejected: Number(r.rejected || 0), reason: r.reason, locationId: r.locationId || null, lot: r.lot, serials: r.serials.split(/[\s,]+/).filter(Boolean), expiry: r.expiry || null });
    }
    if (!lines.length) return toast('Give the quantity received on at least one line', 'error');
    setBusy(true);
    try {
      const res = await post<{ id: string; number: string; inspectionRequired: boolean }>(erpPath(companyId, `/purchase-orders/${view.purchaseOrder.id}/receipts`), { requestKey, ...head, lines });
      toast(`${res.number} received${res.inspectionRequired ? ': inspection required' : ''}`);
      await refresh();
      navigate(procurementPage(companyId, `/receipts/${res.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const usable = (locs.data?.locations ?? []).filter((l) => !l.archived);
  return (
    <Modal title={`Receive against ${view.purchaseOrder.number}`} onClose={onClose} wide footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Receive'}</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="gr-date">Received</label><input id="gr-date" className="input" type="date" value={head.receivedDate} onChange={(e) => setHead({ ...head, receivedDate: e.target.value })} /></div>
        <div className="field"><label htmlFor="gr-ref">Delivery reference</label><input id="gr-ref" className="input" value={head.deliveryRef} maxLength={200} onChange={(e) => setHead({ ...head, deliveryRef: e.target.value })} placeholder="Delivery note or consignment number" /></div>
        <div className="field span-2"><label htmlFor="gr-notes">Notes</label><input id="gr-notes" className="input" value={head.notes} maxLength={2000} onChange={(e) => setHead({ ...head, notes: e.target.value })} /></div>
      </div>
      {!usable.length && open.some((l) => l.productId) ? <p className="warn-box small">No warehouse locations yet: <Link to={inventoryPage(companyId, '/warehouses')}>set up a warehouse</Link> before receiving products into stock.</p> : null}
      <div className="stack">
        {open.map((l) => {
          const r = rows[l.id];
          return (
            <fieldset key={l.id} className="card card-pad erp-receive-line">
              <legend><strong>{l.productNumber ? `${l.productNumber} ` : ''}{l.item}</strong> <span className="muted small">{qty(l.outstanding)} {l.uom} outstanding</span></legend>
              <div className="form-grid">
                <div className="field"><label htmlFor={`gr-q-${l.id}`}>Received</label><input id={`gr-q-${l.id}`} className="input" type="number" min="0" step="any" inputMode="decimal" value={r.received} onChange={(e) => upd(l.id, { received: e.target.value })} /></div>
                <div className="field"><label htmlFor={`gr-d-${l.id}`}>Damaged</label><input id={`gr-d-${l.id}`} className="input" type="number" min="0" step="any" value={r.damaged} onChange={(e) => upd(l.id, { damaged: e.target.value })} /></div>
                <div className="field"><label htmlFor={`gr-r-${l.id}`}>Rejected</label><input id={`gr-r-${l.id}`} className="input" type="number" min="0" step="any" value={r.rejected} onChange={(e) => upd(l.id, { rejected: e.target.value })} /></div>
                {Number(r.damaged) > 0 || Number(r.rejected) > 0 ? <div className="field"><label htmlFor={`gr-why-${l.id}`}>Why</label><input id={`gr-why-${l.id}`} className="input" value={r.reason} maxLength={500} onChange={(e) => upd(l.id, { reason: e.target.value })} /></div> : null}
                {l.productId ? (
                  <>
                    <div className="field"><label htmlFor={`gr-loc-${l.id}`}>Put away at</label><select id={`gr-loc-${l.id}`} className="select" value={r.locationId} onChange={(e) => upd(l.id, { locationId: e.target.value })}><option value="">The product’s default</option>{usable.map((x) => <option key={x.id} value={x.id}>{x.fullCode}{x.name ? ` ${x.name}` : ''}{x.kind !== 'normal' ? ` (${x.kindLabel})` : ''}</option>)}</select></div>
                    <div className="field"><label htmlFor={`gr-lot-${l.id}`}>Lot</label><input id={`gr-lot-${l.id}`} className="input" value={r.lot} maxLength={80} onChange={(e) => upd(l.id, { lot: e.target.value })} placeholder="If tracked" /></div>
                    <div className="field"><label htmlFor={`gr-exp-${l.id}`}>Expiry</label><input id={`gr-exp-${l.id}`} className="input" type="date" value={r.expiry} onChange={(e) => upd(l.id, { expiry: e.target.value })} /></div>
                    <div className="field span-2"><label htmlFor={`gr-sn-${l.id}`}>Serial numbers</label><textarea id={`gr-sn-${l.id}`} className="textarea" rows={2} value={r.serials} onChange={(e) => upd(l.id, { serials: e.target.value })} placeholder="If tracked: one per unit accepted, separated by spaces or new lines" /></div>
                  </>
                ) : null}
              </div>
            </fieldset>
          );
        })}
      </div>
      <p className="muted small">Accepted = received less damaged and rejected; only accepted products go into stock. Products marked “inspection required” are flagged on the receipt.</p>
    </Modal>
  );
}

// ------------------------------------------------------------------ receipts

export function ReceiptsPage({ companyId }: { companyId: string }) {
  usePageTitle('Goods receipts');
  const { g, set, offset } = useListParams();
  const suppliers = useSuppliers(companyId);
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'supplierId', 'from', 'to', 'inspection', 'sort']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'receipts', filters.toString(), offset], queryFn: () => get<{ receipts: Receipt[]; total: number }>(erpPath(companyId, `/receipts?${filters}&limit=${limit}&offset=${offset}`)) });
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Goods received against purchase orders. Receive from the order’s page or the warehouse screen.</p>
        <CsvLink companyId={companyId} path={`/receipts?${filters}`} />
        <Link className="btn" to={procurementPage(companyId, '/purchase-orders?status=to_receive')}>Orders to receive</Link>
      </div>
      <FilterPanel active={['q', 'supplierId', 'from', 'to', 'inspection'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="gr-q">Search</label><input id="gr-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Receipt, order, supplier, delivery reference" /></div>
        <div className="field"><label htmlFor="gr-sup">Supplier</label><select id="gr-sup" className="select" value={g('supplierId')} onChange={(e) => set('supplierId', e.target.value)}><option value="">Any</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div>
        <div className="field"><label htmlFor="gr-from">Received from</label><input id="gr-from" className="input" type="date" value={g('from')} onChange={(e) => set('from', e.target.value)} /></div>
        <div className="field"><label htmlFor="gr-to">to</label><input id="gr-to" className="input" type="date" value={g('to')} onChange={(e) => set('to', e.target.value)} /></div>
        <div className="field"><label htmlFor="gr-insp">Inspection</label><select id="gr-insp" className="select" value={g('inspection')} onChange={(e) => set('inspection', e.target.value)}><option value="">Any</option><option value="1">Required</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.receipts.length ? <EmptyState icon="inbox" title={filters.toString() ? 'No receipts match' : 'Nothing received yet'}>{filters.toString() ? 'Try other words or remove a filter.' : 'Goods are received against approved purchase orders.'}</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Order</th><th>Supplier</th><th>Received</th><th>Delivery</th><th>Flags</th></tr></thead>
              <tbody>
                {list.data.receipts.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={procurementPage(companyId, `/receipts/${r.id}`)}>{r.number}</Link></td>
                    <td data-label="Order"><Link className="mt-num" to={procurementPage(companyId, `/purchase-orders/${r.poId}`)}>{r.poNumber}</Link></td>
                    <td data-label="Supplier">{r.supplierName}</td>
                    <td data-label="Received">{dateText(r.receivedDate)}</td>
                    <td data-label="Delivery">{r.deliveryRef}</td>
                    <td data-label="Flags">{r.onTime === false ? <span className="badge warning">Late</span> : r.onTime ? <span className="badge success">On time</span> : null} {r.inspectionRequired ? <span className="badge warning">Inspection required</span> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
    </div>
  );
}

interface ReceiptView {
  receipt: Receipt;
  lines: { id: string; productId: string | null; productNumber: string | null; item: string; uom: string; ordered: number; received: number; accepted: number; damaged: number; rejected: number; reason: string; location: string | null; lot: string; serials: string[]; expiry: string | null; unitCostCents: number | null; inspectionRequired: boolean }[];
  integration: { id: string; kind: string; kindLabel: string; status: string; attempts: number; lastError: string; amountCents: number | null; createdAt: number }[];
  bill: { status: string; billId: string | null; url: string | null; canCreate: boolean; reason: string | null; lastError: string | null };
  files: RecordFile[];
  history: ErpEvent[];
  inspectionNote: string | null;
  // Release 4: inspections of this receipt's lines
  inspections?: { id: string; number: string; status: string; result: string | null; receiptLineId: string | null }[];
}

/** Release 4: a receipt line's inspection: its result, or a button to start it where the product needs inspection. */
function LineInspection({ companyId, me, line, found, onStart }: { companyId: string; me: ErpMe; line: ReceiptView['lines'][number]; found?: NonNullable<ReceiptView['inspections']>[number]; onStart: () => void }) {
  if (found) return <> <Link className={`badge ${found.result === 'failed' ? 'danger' : found.result ? 'success' : 'accent'}`} to={qualityPage(companyId, `/inspections/${found.id}`)}>{found.number}{found.result ? `: ${found.result === 'conditional' ? 'accepted on condition' : found.result}` : ': open'}</Link></>;
  if (!line.inspectionRequired) return null;
  return <> <span className="badge warning">Inspect</span>{me.can['quality.inspect'] && line.accepted > 0 ? <> <button type="button" className="btn sm" onClick={onStart}>Start inspection</button></> : null}</>;
}

export function ReceiptDetail({ companyId, me }: { companyId: string; me: ErpMe }) {
  const { id = '' } = useParams();
  const act = useAct(companyId);
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ['erp', companyId, 'receipt', id], queryFn: () => get<ReceiptView>(erpPath(companyId, `/receipts/${id}`)), retry: false });
  usePageTitle(q.data ? q.data.receipt.number : 'Goods receipt');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const r = v.receipt;
  const integrationStatus = (s: string): ReactNode => (s === 'done' ? <span className="badge success">Done</span> : s === 'planned' ? <span className="badge">Planned</span> : s === 'failed' ? <span className="badge danger">Failed</span> : <span className="badge warning">Pending</span>);
  return (
    <div className="stack">
      <Crumbs companyId={companyId} list="/receipts" label="Receipts" here={r.number} />
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{r.number}</span> {r.supplierName}</h2>
          <div className="mt-badges"><Link className="badge" to={procurementPage(companyId, `/purchase-orders/${r.poId}`)}>{r.poNumber}</Link>{r.onTime === false ? <span className="badge warning">Late</span> : r.onTime ? <span className="badge success">On time</span> : null}{r.inspectionRequired ? <span className="badge warning">Inspection required</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          {v.bill.canCreate ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/receipts/${r.id}/bill`)), 'Draft bill made in Finance')}><Icon name="dollar" /> Make a draft bill in Finance</button> : null}
          {v.bill.url ? <a className="btn" href={toolUrl(v.bill.url)}><Icon name="dollar" /> Open the draft bill</a> : null}
        </div>
      </div>
      {v.inspectionNote ? <p className="warn-box small"><Icon name="info" size={14} /> {v.inspectionNote}</p> : null}
      <Section title="Lines">
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Product or item</th><th className="num">Received</th><th className="num">Accepted</th><th className="num">Damaged</th><th className="num">Rejected</th><th>Put away at</th><th>Lot, serials, expiry</th></tr></thead>
            <tbody>
              {v.lines.map((l) => (
                <tr key={l.id}>
                  <td data-label="Product or item">{l.productId ? <Link to={inventoryPage(companyId, `/stock/${l.productId}`)}><span className="mt-num">{l.productNumber}</span> {l.item}</Link> : l.item}<LineInspection companyId={companyId} me={me} line={l} found={v.inspections?.find((i) => i.receiptLineId === l.id)} onStart={async () => { const res = (await act(() => post<{ id: string }>(erpPath(companyId, '/inspections'), { sourceType: 'receipt_line', sourceId: l.id }), 'Inspection started')) as { id: string } | null; if (res) navigate(qualityPage(companyId, `/inspections/${res.id}`)); }} />{l.reason ? <div className="muted small">{l.reason}</div> : null}</td>
                  <td data-label="Received" className="num">{qty(l.received)} {l.uom}</td>
                  <td data-label="Accepted" className="num">{qty(l.accepted)}</td>
                  <td data-label="Damaged" className="num">{l.damaged ? qty(l.damaged) : ''}</td>
                  <td data-label="Rejected" className="num">{l.rejected ? qty(l.rejected) : ''}</td>
                  <td data-label="Put away at">{l.location ?? ''}</td>
                  <td data-label="Lot, serials, expiry" className="small">{[l.lot ? `Lot ${l.lot}` : '', l.serials.length ? `Serials ${l.serials.join(', ')}` : '', l.expiry ? `Expires ${dateText(l.expiry)}` : ''].filter(Boolean).join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <div className="mt-grid">
        <div className="stack">
          <Section title="Details"><Props items={[['Received', dateText(r.receivedDate)], ['Delivery reference', r.deliveryRef], ['Notes', r.notes], ['Recorded by', r.byName ?? '']]} /></Section>
          <Section title="Finance">
            {v.bill.status === 'done' ? <p className="small">A draft bill was made in Finance for this receipt. It is made once: asking again opens the same bill.</p> : v.bill.reason ? <p className="muted small">{v.bill.reason}</p> : <p className="muted small">Make the supplier’s draft bill in Finance from what was accepted. Finance approves and pays it.</p>}
            {v.bill.lastError ? <p className="warn-box small">The last attempt failed: {v.bill.lastError}</p> : null}
            {v.integration.length ? (
              <ul className="erp-list">
                {v.integration.map((e) => <li key={e.id} className="small">{e.kindLabel}: {integrationStatus(e.status)}{e.amountCents !== null && e.kind === 'finance.inventory_posting' ? ` ${money(e.amountCents)}` : ''}{e.status === 'planned' ? <span className="muted"> Inventory postings to Finance’s ledger are not built: nothing is posted.</span> : null}</li>)}
              </ul>
            ) : null}
          </Section>
        </div>
        <div className="stack">
          <Files companyId={companyId} kind="receipt" id={r.id} files={v.files} canAdd={me.can['receiving.post']} />
          <Section title="History"><History events={v.history} /></Section>
        </div>
      </div>
    </div>
  );
}
