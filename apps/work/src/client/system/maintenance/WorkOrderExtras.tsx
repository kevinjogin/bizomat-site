// What a work order shows from stages M2 and M3: the preventive schedule behind it, its inspections (record each item,
// complete it; a failure makes its follow-up once), parts used from the maintenance stores (issued and returned through
// ERP Inventory), labour with time entered by hand and its cost, downtime, and meter readings. The field release adds
// required parts linked to ERP products, stock reserved for them in ERP Inventory, and purchase requisitions raised
// from them in Procurement (src/worker/maintenance/routes-parts.ts and routes-stock.ts).
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { del, get, patch, post, put } from '../../lib/api';
import { useDebounced } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import { dateText, dateTimeText, localToday, localToMs, minutesText, money, msToLocal, mtPage, mtPath, requestKey, type InspItem, type InspResult, type Meter, type MtMe, type WorkOrder } from './api';
import { Section } from './common';
import { PersonSelect } from './pickers';

export interface WoExtras {
  inspections: { id: string; templateId: string; templateName: string; status: 'open' | 'passed' | 'failed'; completedAt: number | null; completedByName: string | null; followUp: { kind: 'work_order' | 'request'; id: string; number: string } | null; items: InspItem[]; results: InspResult[]; failed: number }[];
  stock: {
    moves: { id: string; type: string; typeLabel: string; productId: string; productNumber: string; productName: string; uom: string; locationId: string; location: string; lot: string; serial: string; quantity: number; unitCostCents?: number | null; valueCents?: number; byName: string | null; at: number }[];
    byProduct: { productId: string; number: string; name: string; uom: string; issued: number; costCents?: number }[];
    costCents?: number;
    financePosting: string;
  };
  labourCosts: { labourId: string; entry: 'timer' | 'manual'; workDate: string; minutes: number; userId: string | null; userName: string | null; note: string; rateCents?: number | null; rateSource?: string; costCents?: number | null }[];
  costs: { labourCents: number; labourUnpricedMinutes: number; partsCents: number; totalCents: number } | null;
  downtime: { startedAt: number; endedAt: number | null; minutes: number | null; cause: string; recordedByName: string | null } | null;
  readings: { id: string; meterId: string; meterName: string; unit: string; value: number; reset: boolean; outOfRange: boolean; readAt: number }[];
  preventive: { scheduleId: string; name: string; triggerKind: string; dueDate: string; dueMeter: number | null } | null;
  requiredParts: {
    lines: {
      id: string;
      position: number;
      part: string;
      quantity: number;
      productId: string | null;
      productNumber: string | null;
      productName: string | null;
      uom: string | null;
      productType: string | null;
      productArchived: boolean;
      stocked: boolean;
      issued: number;
      outstanding: number;
      reserved: number;
      available: number | null;
      shortfall: number | null;
      onRequisition: number;
      toOrder: number | null;
      status: 'issued' | 'reserved' | 'in_stores' | 'on_requisition' | 'short' | 'not_stocked' | 'service' | 'needed';
      statusLabel: string;
    }[];
    reservations: { id: string; partId: string | null; productId: string; productNumber: string; productName: string; uom: string; locationId: string; location: string; lot: string; serial: string; quantity: number; issued: number; released: number; open: number; status: 'open' | 'issued' | 'released'; statusLabel: string; reference: string; byName: string | null; createdAt: number }[];
    requisitions: { id: string; number: string; title: string; status: string; statusLabel: string; requiredDate: string | null; lineCount: number; purchaseOrders: { id: string; number: string; status: string; statusLabel: string }[]; byName: string | null; createdAt: number }[];
    can: { reserve: boolean; raiseRequisition: boolean; requisitionNote: string | null };
  };
}

type Act = (fn: () => Promise<unknown>, done?: string) => Promise<boolean>;
interface Props {
  companyId: string;
  me: MtMe;
  woId: string;
  assetId: string;
  d: WoExtras;
  canWork: boolean;
  seeCosts: boolean;
  act: Act;
}

const RATE_SOURCE: Record<string, string> = { person: 'person’s rate', work_order_trade: 'trade’s rate', person_trade: 'their trade’s rate', '': 'no rate set' };

export function PreventiveNote({ companyId, d }: { companyId: string; d: WoExtras }) {
  if (!d.preventive) return null;
  return (
    <p className="small mt-pm-note">
      <Icon name="calendar" size={14} /> Made by preventive maintenance <Link to={mtPage(companyId, `/preventive/${d.preventive.scheduleId}`)}>{d.preventive.name}</Link>, due {dateText(d.preventive.dueDate)}
      {d.preventive.dueMeter != null ? ` (meter at ${d.preventive.dueMeter})` : ''}. Completing it moves the schedule on.
    </p>
  );
}

// ------------------------------------------------------------------ inspections

export function InspectionsSection({ companyId, woId, d, canWork, act }: Props) {
  const templates = useQuery({ queryKey: ['mt', companyId, 'insp-templates'], queryFn: () => get<{ templates: { id: string; name: string }[] }>(mtPath(companyId, '/inspection-templates')), enabled: canWork });
  const [adding, setAdding] = useState('');
  const base = mtPath(companyId, `/work-orders/${woId}/inspections`);
  if (!d.inspections.length && !canWork) return null;
  return (
    <Section title={`Inspections (${d.inspections.length})`}>
      {d.inspections.map((i) => <Inspection key={i.id} insp={i} base={`${base}/${i.id}`} canWork={canWork} act={act} companyId={companyId} />)}
      {!d.inspections.length ? <p className="muted small">No inspection on this work order.</p> : null}
      {canWork ? (
        <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); if (adding) void act(() => post(base, { templateId: adding }), 'Inspection added').then((ok) => ok && setAdding('')); }}>
          <label className="sr-only" htmlFor="wo-add-insp">Add an inspection</label>
          <select id="wo-add-insp" className="select" value={adding} onChange={(e) => setAdding(e.target.value)}>
            <option value="">Add an inspection…</option>
            {(templates.data?.templates ?? []).filter((t) => !d.inspections.some((x) => x.templateId === t.id)).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="btn" disabled={!adding}>Add</button>
        </form>
      ) : null}
    </Section>
  );
}

function Inspection({ insp, base, canWork, act, companyId }: { insp: WoExtras['inspections'][number]; base: string; canWork: boolean; act: Act; companyId: string }) {
  const recorded = new Map(insp.results.map((r) => [r.itemId, r]));
  const [values, setValues] = useState<Record<string, { passed?: boolean; value?: string; text?: string; note?: string }>>({});
  const open = insp.status === 'open' && canWork;
  const val = (id: string) => values[id] ?? {};
  const set = (id: string, v: { passed?: boolean; value?: string; text?: string; note?: string }) => setValues((x) => ({ ...x, [id]: { ...x[id], ...v } }));
  const save = async () => {
    const results = Object.entries(values)
      .map(([itemId, v]) => {
        const item = insp.items.find((x) => x.id === itemId);
        if (!item) return null;
        if (item.kind === 'pass_fail') return v.passed === undefined ? null : { itemId, passed: v.passed, note: v.note };
        if (item.kind === 'number') return v.value === undefined || v.value === '' ? null : { itemId, value: Number(v.value), note: v.note };
        return { itemId, text: v.text ?? '', note: v.note };
      })
      .filter(Boolean);
    if (!results.length) return;
    if (await act(() => put(`${base}/results`, { results }), 'Results saved')) setValues({});
  };
  return (
    <div className={`mt-insp ${insp.status}`}>
      <div className="row wrap">
        <strong className="grow">{insp.templateName}</strong>
        <span className={`badge ${insp.status === 'passed' ? 'success' : insp.status === 'failed' ? 'danger' : 'accent'}`}>{insp.status === 'open' ? 'Open' : insp.status === 'passed' ? 'Passed' : `Failed (${insp.failed})`}</span>
      </div>
      {insp.completedAt ? <p className="muted small">Completed {dateTimeText(insp.completedAt)}{insp.completedByName ? ` by ${insp.completedByName}` : ''}.</p> : null}
      {insp.followUp ? <p className="small">Follow-up: <Link to={mtPage(companyId, `/${insp.followUp.kind === 'work_order' ? 'work-orders' : 'requests'}/${insp.followUp.id}`)}>{insp.followUp.kind === 'work_order' ? 'work order' : 'request'} {insp.followUp.number}</Link></p> : null}
      <ol className="mt-insp-items">
        {insp.items.map((it) => {
          const r = recorded.get(it.id);
          const v = val(it.id);
          return (
            <li key={it.id} className={r?.passed === false ? 'failed' : ''}>
              <div className="row wrap">
                <span className="grow">{it.label}{it.critical ? <span className="badge danger"> Critical</span> : null}{it.kind === 'number' && (it.min != null || it.max != null) ? <span className="muted small"> ({it.min ?? '…'} to {it.max ?? '…'}{it.unit ? ` ${it.unit}` : ''})</span> : null}</span>
                {r ? <span className="small">{r.kind === 'pass_fail' ? (r.passed ? 'Pass' : 'Fail') : r.kind === 'number' ? `${r.value}${r.unit ? ` ${r.unit}` : ''}${r.passed === false ? ' (outside the limits)' : ''}` : r.text}</span> : <span className="muted small">Not recorded</span>}
              </div>
              {r?.note ? <div className="muted small">{r.note}</div> : null}
              {open ? (
                <div className="mt-add-line">
                  {it.kind === 'pass_fail' ? (
                    <span className="mt-passfail" role="group" aria-label={it.label}>
                      <button type="button" className={`btn sm${v.passed === true ? ' primary' : ''}`} aria-pressed={v.passed === true} onClick={() => set(it.id, { passed: true })}>Pass</button>
                      <button type="button" className={`btn sm${v.passed === false ? ' danger' : ''}`} aria-pressed={v.passed === false} onClick={() => set(it.id, { passed: false })}>Fail</button>
                    </span>
                  ) : it.kind === 'number' ? (
                    <input className="input mt-qty" type="number" step="any" inputMode="decimal" aria-label={`${it.label} value`} value={v.value ?? ''} onChange={(e) => set(it.id, { value: e.target.value })} />
                  ) : (
                    <input className="input" maxLength={2000} aria-label={it.label} value={v.text ?? ''} onChange={(e) => set(it.id, { text: e.target.value })} />
                  )}
                  {it.kind !== 'text' ? <input className="input" maxLength={1000} aria-label={`Note on ${it.label}`} placeholder="Note (optional)" value={v.note ?? ''} onChange={(e) => set(it.id, { note: e.target.value })} /> : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {open ? (
        <div className="row wrap">
          <button className="btn" disabled={!Object.keys(values).length} onClick={save}>Save results</button>
          <button className="btn primary" onClick={() => act(() => post(`${base}/complete`, {}), 'Inspection completed')}>Complete the inspection</button>
        </div>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ required parts, reservations and requisitions

/** A required part line as a form holds it: a product of the company (productId) or the part in words. */
export interface PartLine {
  part: string;
  quantity: string;
  productId: string | null;
  /** The chosen product's number and name, for the chip. */
  productLabel: string;
}

interface PartProduct {
  id: string;
  number: string;
  name: string;
  uom: string;
  type: string;
  stocked: boolean;
  available: number;
}

export const blankPartLine = (): PartLine => ({ part: '', quantity: '1', productId: null, productLabel: '' });

/** The lines as the server takes them; empty lines and lines without a quantity are left out. */
export function partLinesBody(lines: PartLine[]) {
  return lines
    .filter((p) => (p.productId || p.part.trim()) && Number(p.quantity) > 0)
    .map((p) => (p.productId ? { productId: p.productId, part: p.part.trim() || undefined, quantity: Number(p.quantity) } : { part: p.part.trim(), quantity: Number(p.quantity) }));
}

/** Choose a product from ERP Inventory (from two characters typed), or keep the words typed as the part. */
export function ProductOrText({ companyId, value, onChange, id, label = 'Part' }: { companyId: string; value: PartLine; onChange: (v: PartLine) => void; id: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const term = useDebounced(value.part.trim(), 250);
  const search = useQuery({
    queryKey: ['mt', companyId, 'part-products', term],
    queryFn: () => get<{ products: PartProduct[] }>(mtPath(companyId, `/parts/products?q=${encodeURIComponent(term)}`)),
    enabled: open && !value.productId && term.length >= 2,
  });
  if (value.productId) {
    return (
      <span className="mt-picked">
        <span className="grow">{value.productLabel || value.part}</span>
        <button type="button" className="btn ghost sm" aria-label={`Change the product of ${label.toLowerCase()}`} onClick={() => onChange({ ...value, productId: null, productLabel: '' })}>Change</button>
      </span>
    );
  }
  const found = open && term.length >= 2 ? (search.data?.products ?? []) : [];
  return (
    <div className="mt-part-pick">
      <label className="sr-only" htmlFor={id}>{label}</label>
      <input id={id} className="input" maxLength={200} autoComplete="off" value={value.part} placeholder="Product number or name, or describe the part" onFocus={() => setOpen(true)} onChange={(e) => { onChange({ ...value, part: e.target.value }); setOpen(true); }} />
      {found.length ? (
        <ul className="mt-picker-list" aria-label="Products">
          {found.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => { onChange({ ...value, productId: p.id, productLabel: `${p.number} ${p.name}`, part: p.name }); setOpen(false); }}>
                <span className="mt-num">{p.number}</span>
                <span className="grow">{p.name}</span>
                <span className="muted small">{p.stocked ? `${p.available} ${p.uom} in the stores` : 'Service'}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Rows of required parts (a product or words, and a quantity), with "Add a part". */
export function PartLinesEditor({ companyId, value, onChange, idPrefix }: { companyId: string; value: PartLine[]; onChange: (v: PartLine[]) => void; idPrefix: string }) {
  const set = (i: number, v: PartLine) => onChange(value.map((x, j) => (j === i ? v : x)));
  return (
    <>
      {value.length ? (
        <div className="mt-lines">
          {value.map((p, i) => (
            <div key={i} className="mt-line">
              <ProductOrText companyId={companyId} id={`${idPrefix}-${i}`} label={`Part ${i + 1}`} value={p} onChange={(v) => set(i, v)} />
              <input className="input mt-qty" aria-label={`Quantity of part ${i + 1}`} type="number" inputMode="decimal" min="0" step="any" value={p.quantity} onChange={(e) => set(i, { ...p, quantity: e.target.value })} />
              <button type="button" className="btn ghost icon" aria-label={`Remove part ${i + 1}`} onClick={() => onChange(value.filter((_, j) => j !== i))}><Icon name="x" /></button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="row"><button type="button" className="btn sm" onClick={() => onChange([...value, blankPartLine()])}><Icon name="plus" size={14} /> Add a part</button></div>
    </>
  );
}

type RequiredParts = WoExtras['requiredParts'];
type RequiredLine = RequiredParts['lines'][number];

/** What "Issue" on a required part or a reservation fills in on the issue form. */
export interface IssuePrefill {
  productId: string;
  productNumber: string;
  locationId?: string;
  lot?: string;
  serial?: string;
  quantity: number;
  nonce: number;
}

const PART_TONE: Record<string, string> = { issued: 'success', reserved: 'success', in_stores: 'accent', on_requisition: 'warning', short: 'danger', not_stocked: '', service: '', needed: '' };

/** Required parts, what is reserved for them, the requisitions raised for them, and the parts used, on a work order. */
export function PartsArea(props: Props & { wo: WorkOrder; locked: boolean }) {
  const [prefill, setPrefill] = useState<IssuePrefill | null>(null);
  return (
    <>
      <RequiredPartsSection {...props} onIssue={(p) => setPrefill({ ...p, nonce: Date.now() })} />
      <PartsSection {...props} prefill={prefill} />
    </>
  );
}

function RequiredPartsSection({ companyId, me, woId, d, canWork, act, wo, locked, onIssue }: Props & { wo: WorkOrder; locked: boolean; onIssue: (p: Omit<IssuePrefill, 'nonce'>) => void }) {
  const rp = d.requiredParts;
  const toast = useToast();
  const confirm = useConfirm();
  const base = mtPath(companyId, `/work-orders/${woId}`);
  const [adding, setAdding] = useState<PartLine>(blankPartLine);
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);
  const [linking, setLinking] = useState<{ id: string; line: PartLine } | null>(null);
  const [raising, setRaising] = useState(false);
  const work = canWork && !locked;
  const showStock = rp.lines.some((l) => l.available !== null);
  const openFor = (l: RequiredLine) => rp.reservations.filter((r) => r.partId === l.id && r.status === 'open' && r.open > 1e-9);
  const reserve = (l: RequiredLine) =>
    act(async () => {
      const r = await post<{ reserved: { quantity: number }[]; short: number }>(`${base}/parts/${l.id}/reserve`, { requestKey: requestKey() });
      const total = Math.round(r.reserved.reduce((n, x) => n + x.quantity, 0) * 1e6) / 1e6;
      const unit = l.uom ? ` ${l.uom}` : '';
      toast(r.short ? `Reserved ${total}${unit}; ${r.short} short` : `Reserved ${total}${unit}`);
    });
  const issue = (l: RequiredLine) => {
    const held = openFor(l)[0];
    onIssue(held ? { productId: l.productId!, productNumber: l.productNumber ?? '', locationId: held.locationId, lot: held.lot, serial: held.serial, quantity: Math.min(held.open, l.outstanding) } : { productId: l.productId!, productNumber: l.productNumber ?? '', quantity: l.outstanding });
  };
  const addLine = async () => {
    const [line] = partLinesBody([adding]);
    if (!line) return;
    if (await act(() => post(`${base}/parts`, line), 'Part added')) setAdding(blankPartLine());
  };
  return (
    <Section title="Required parts" actions={rp.can.raiseRequisition && rp.lines.some((l) => (l.toOrder ?? 0) > 1e-9) ? <button className="btn sm" onClick={() => setRaising(true)}><Icon name="doc" size={14} /> Raise a requisition</button> : null}>
      {rp.lines.length ? (
        <table className="data-table mt-table">
          <thead>
            <tr><th>Part</th><th>Required</th><th>Issued</th><th>Reserved</th>{showStock ? <th>In the stores</th> : null}<th>Status</th><th><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody>
            {rp.lines.map((l) => {
              const toFind = Math.max(0, l.outstanding - l.reserved);
              return (
                <tr key={l.id}>
                  <td data-label="Part">
                    {l.productNumber ? <span className="mt-num">{l.productNumber} </span> : null}
                    {l.part}
                    {l.productArchived ? <span className="badge"> Archived</span> : null}
                    {linking?.id === l.id ? (
                      <div className="mt-add-line">
                        <ProductOrText companyId={companyId} id={`wo-link-${l.id}`} label="Product" value={linking.line} onChange={(v) => { if (v.productId) { setLinking(null); void act(() => patch(`${base}/parts/${l.id}`, { productId: v.productId }), 'Linked to the product'); } else setLinking({ id: l.id, line: v }); }} />
                        <button type="button" className="btn ghost sm" onClick={() => setLinking(null)}>Cancel</button>
                      </div>
                    ) : null}
                  </td>
                  <td data-label="Required" className="mt-num">
                    {editing?.id === l.id ? (
                      <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); if (Number(editing.value) > 0) void act(() => patch(`${base}/parts/${l.id}`, { quantity: Number(editing.value) }), 'Quantity changed').then((ok) => ok && setEditing(null)); }}>
                        <label className="sr-only" htmlFor={`wo-qty-${l.id}`}>Quantity of {l.part}</label>
                        <input id={`wo-qty-${l.id}`} className="input mt-qty" type="number" inputMode="decimal" min="0" step="any" value={editing.value} onChange={(e) => setEditing({ id: l.id, value: e.target.value })} />
                        <button className="btn sm" disabled={!(Number(editing.value) > 0)}>Save</button>
                        <button type="button" className="btn ghost sm" onClick={() => setEditing(null)}>Cancel</button>
                      </form>
                    ) : work ? (
                      <button type="button" className="btn ghost sm" aria-label={`Change the quantity of ${l.part}`} onClick={() => setEditing({ id: l.id, value: String(l.quantity) })}>{l.quantity} {l.uom ?? ''}</button>
                    ) : `${l.quantity} ${l.uom ?? ''}`}
                  </td>
                  <td data-label="Issued" className="mt-num">{l.productId ? l.issued : ''}</td>
                  <td data-label="Reserved" className="mt-num">{l.stocked ? l.reserved : ''}</td>
                  {showStock ? <td data-label="In the stores" className="mt-num">{l.available ?? ''}</td> : null}
                  <td data-label="Status">
                    <span className={`badge mt-part-status ${PART_TONE[l.status] ?? ''}`}>{l.statusLabel}</span>
                    {l.status === 'short' && l.shortfall ? <div className="muted small">{l.shortfall} short{l.onRequisition ? `, ${l.onRequisition} on a requisition` : ''}</div> : null}
                  </td>
                  <td>
                    {work ? (
                      <span className="row wrap">
                        {rp.can.reserve && l.stocked && toFind > 1e-9 && (l.available ?? 0) > 1e-9 ? <button className="btn sm" onClick={() => void reserve(l)}>Reserve</button> : null}
                        {l.stocked && l.outstanding > 1e-9 ? <button className="btn sm" onClick={() => issue(l)}>Issue</button> : null}
                        {!l.productId && linking?.id !== l.id ? <button className="btn ghost sm" onClick={() => setLinking({ id: l.id, line: { part: '', quantity: String(l.quantity), productId: null, productLabel: '' } })}>Link to a product</button> : null}
                        <button className="btn ghost icon sm" aria-label={`Remove ${l.part}`} onClick={async () => { if (await confirm({ title: 'Remove this part line?', message: `${l.quantity} × ${l.productNumber ? `${l.productNumber} ` : ''}${l.part}`, confirmLabel: 'Remove', danger: true })) await act(() => del(`${base}/parts/${l.id}`), 'Part line removed'); }}><Icon name="trash" size={14} /></button>
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : <p className="muted small">No parts listed.</p>}
      {work ? (
        <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void addLine(); }}>
          <ProductOrText companyId={companyId} id="wo-add-part" label="Add a part" value={adding} onChange={setAdding} />
          <label className="sr-only" htmlFor="wo-add-part-qty">Quantity</label>
          <input id="wo-add-part-qty" className="input mt-qty" type="number" inputMode="decimal" min="0" step="any" value={adding.quantity} onChange={(e) => setAdding((x) => ({ ...x, quantity: e.target.value }))} />
          <button className="btn" disabled={!(adding.productId || adding.part.trim()) || !(Number(adding.quantity) > 0)}>Add</button>
        </form>
      ) : null}

      {rp.reservations.length ? (
        <>
          <h3 className="crm-subhead">Reserved in the stores</h3>
          <table className="data-table mt-table">
            <thead><tr><th>Part</th><th>Store location</th><th>Reserved</th><th>Issued</th><th>Released</th><th>Open</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {rp.reservations.map((r) => (
                <tr key={r.id}>
                  <td data-label="Part"><span className="mt-num">{r.productNumber}</span> {r.productName}<div className="muted small">{r.byName ?? ''} · {dateTimeText(r.createdAt)}</div></td>
                  <td data-label="Store location">{r.location}{r.lot ? <div className="muted small">Lot {r.lot}</div> : null}{r.serial ? <div className="muted small">Serial {r.serial}</div> : null}</td>
                  <td data-label="Reserved" className="mt-num">{r.quantity} {r.uom}</td>
                  <td data-label="Issued" className="mt-num">{r.issued}</td>
                  <td data-label="Released" className="mt-num">{r.released}</td>
                  <td data-label="Open" className="mt-num">{r.open}</td>
                  <td data-label="Status"><span className={`badge ${r.status === 'open' ? 'success' : ''}`}>{r.statusLabel}</span></td>
                  <td>
                    {work && r.status === 'open' && r.open > 1e-9 ? (
                      <span className="row wrap">
                        <button className="btn sm" onClick={() => onIssue({ productId: r.productId, productNumber: r.productNumber, locationId: r.locationId, lot: r.lot, serial: r.serial, quantity: r.open })}>Issue</button>
                        <button className="btn ghost sm" onClick={async () => { if (await confirm({ title: 'Release this reservation?', message: `${r.open} ${r.uom} of ${r.productNumber} at ${r.location} go back to free stock.`, confirmLabel: 'Release' })) await act(() => post(`${base}/reservations/${r.id}/unreserve`, { requestKey: requestKey() }), 'Reservation released'); }}>Release</button>
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {rp.requisitions.length ? (
        <>
          <h3 className="crm-subhead">Requisitions for this work order</h3>
          <ul className="mt-docs">
            {rp.requisitions.map((q) => (
              <li key={q.id} className="row wrap">
                <Link className="mt-num mt-primary" to={`/c/${encodeURIComponent(companyId)}/procurement/requisitions/${q.id}`}>{q.number}</Link>
                <span className="grow small">{q.title}{q.requiredDate ? ` · needed by ${dateText(q.requiredDate)}` : ''}{q.byName ? ` · raised by ${q.byName}` : ''}</span>
                <span className={`badge ${q.status === 'approved' || q.status === 'converted' ? 'success' : q.status === 'rejected' || q.status === 'cancelled' ? 'danger' : 'accent'}`}>{q.statusLabel}</span>
                {q.purchaseOrders.map((o) => (
                  <span key={o.id} className="small">
                    <Link to={`/c/${encodeURIComponent(companyId)}/procurement/purchase-orders/${o.id}`}>{o.number}</Link> {o.statusLabel}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {rp.can.requisitionNote ? <p className="muted small">{rp.can.requisitionNote}</p> : null}
      <p className="muted small">Reserving holds the stock in ERP Inventory for this work order. Completing or cancelling the work order releases what is still reserved. Requisitions are approved and ordered in Procurement. Nothing here is posted to Finance.</p>
      {raising ? <RaiseRequisitionDialog companyId={companyId} me={me} wo={wo} lines={rp.lines} act={act} onClose={() => setRaising(false)} /> : null}
    </Section>
  );
}

function RaiseRequisitionDialog({ companyId, me, wo, lines, act, onClose }: { companyId: string; me: MtMe; wo: WorkOrder; lines: RequiredLine[]; act: Act; onClose: () => void }) {
  const toast = useToast();
  const candidates = lines.filter((l) => (l.toOrder ?? 0) > 1e-9);
  const [pick, setPick] = useState<Record<string, { on: boolean; qty: string }>>(() => Object.fromEntries(candidates.map((l) => [l.id, { on: true, qty: String(l.toOrder) }])));
  const today = localToday();
  const [f, setF] = useState({ requiredDate: wo.dueStart && wo.dueStart >= today ? wo.dueStart : today, departmentId: wo.departmentId ?? '', reason: '', submit: false });
  const [key] = useState(requestKey);
  const [busy, setBusy] = useState(false);
  const chosen = candidates.filter((l) => pick[l.id]?.on && Number(pick[l.id].qty) > 0);
  const go = async () => {
    setBusy(true);
    try {
      const ok = await act(async () => {
        const r = await post<{ number: string }>(mtPath(companyId, `/work-orders/${wo.id}/requisition`), {
          lines: chosen.map((l) => ({ partId: l.id, quantity: Number(pick[l.id].qty) })),
          requiredDate: f.requiredDate || undefined,
          departmentId: f.departmentId || null,
          reason: f.reason.trim() || undefined,
          submit: f.submit,
          requestKey: key,
        });
        toast(`Requisition ${r.number} raised`);
      });
      if (ok) onClose();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`Raise a requisition for ${wo.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !chosen.length} onClick={go}>{busy ? 'Raising…' : 'Raise the requisition'}</button></>}>
      <p className="muted small">The requisition goes to Procurement, where it is approved and ordered under Procurement’s own rules.</p>
      <ul className="mt-docs">
        {candidates.map((l) => (
          <li key={l.id} className="row wrap">
            <label className="checkbox grow">
              <input type="checkbox" checked={!!pick[l.id]?.on} onChange={(e) => setPick((x) => ({ ...x, [l.id]: { ...x[l.id], on: e.target.checked } }))} /> {l.productNumber ? `${l.productNumber} ` : ''}{l.part}
            </label>
            <label className="sr-only" htmlFor={`rq-qty-${l.id}`}>Quantity of {l.part}</label>
            <input id={`rq-qty-${l.id}`} className="input mt-qty" type="number" inputMode="decimal" min="0" step="any" value={pick[l.id]?.qty ?? ''} onChange={(e) => setPick((x) => ({ ...x, [l.id]: { ...x[l.id], qty: e.target.value } }))} />
            <span className="muted small">{l.uom ?? ''}</span>
          </li>
        ))}
      </ul>
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="rq-date">Needed by</label><input id="rq-date" className="input" type="date" value={f.requiredDate} onChange={(e) => setF((x) => ({ ...x, requiredDate: e.target.value }))} /></div>
        {me.departments.length ? (
          <div className="field">
            <label htmlFor="rq-dept">Department</label>
            <select id="rq-dept" className="select" value={f.departmentId} onChange={(e) => setF((x) => ({ ...x, departmentId: e.target.value }))}>
              <option value="">None</option>
              {me.departments.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
        ) : null}
        <div className="field crm-span"><label htmlFor="rq-reason">Reason (optional)</label><textarea id="rq-reason" className="textarea" rows={2} maxLength={2000} value={f.reason} placeholder={`Parts for maintenance work order ${wo.number}`} onChange={(e) => setF((x) => ({ ...x, reason: e.target.value }))} /></div>
      </div>
      <label className="checkbox"><input type="checkbox" checked={f.submit} onChange={(e) => setF((x) => ({ ...x, submit: e.target.checked }))} /> Submit it for approval now</label>
    </Modal>
  );
}

// ------------------------------------------------------------------ parts used

interface StoreStock {
  productId: string;
  productNumber: string;
  productName: string;
  uom: string;
  locationId: string;
  location: string;
  lot: string;
  serial: string;
  onHand: number;
  available: number;
  unitCostCents: number | null;
}

export function PartsSection({ companyId, woId, d, canWork, seeCosts, act, prefill }: Props & { prefill?: IssuePrefill | null }) {
  const [q, setQ] = useState('');
  const term = useDebounced(q, 200);
  const [onlyProduct, setOnlyProduct] = useState('');
  const [pick, setPick] = useState<StoreStock | null>(null);
  const [qty, setQty] = useState('1');
  const [ret, setRet] = useState<{ productId: string; from: string; qty: string }>({ productId: '', from: '', qty: '1' });
  const [key, setKey] = useState(requestKey);
  const issueQty = useRef<HTMLInputElement>(null);
  const issueForm = useRef<HTMLDivElement>(null);
  // One product's rows when the form was filled in from a required part; else what the search matches.
  const stockQuery = onlyProduct ? `productId=${encodeURIComponent(onlyProduct)}` : `q=${encodeURIComponent(term)}`;
  const stock = useQuery({ queryKey: ['mt', companyId, 'store-stock', stockQuery], queryFn: () => get<{ stock: StoreStock[] }>(mtPath(companyId, `/stores/stock?${stockQuery}`)), enabled: canWork });
  const base = mtPath(companyId, `/work-orders/${woId}/stock`);
  const issued = d.stock.byProduct.filter((p) => p.issued > 1e-9);
  // Each place the part was issued from (location, lot and serial), so a part tracked by lot or serial goes back where it came from.
  const returnFrom = [...new Map(d.stock.moves.filter((m) => m.productId === ret.productId && m.type === 'maintenance_issue').map((m) => [`${m.locationId}|${m.lot}|${m.serial}`, m])).values()];
  const heldHere = (s: StoreStock) => d.requiredParts.reservations.filter((r) => r.status === 'open' && r.productId === s.productId && r.locationId === s.locationId && r.lot === s.lot && r.serial === s.serial).reduce((n, r) => n + r.open, 0);

  // "Issue" on a required part or a reservation: this form, filled in. The matching stock row is picked once the list
  // for that product has loaded (the one at the reservation's location, lot and serial, or the only one).
  const [pending, setPending] = useState<IssuePrefill | null>(null);
  useEffect(() => {
    if (!prefill) return;
    setQ(prefill.productNumber);
    setOnlyProduct(prefill.productId);
    setPick(null);
    setQty(String(prefill.quantity));
    setPending(prefill);
    issueForm.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [prefill]);
  useEffect(() => {
    if (!pending || onlyProduct !== pending.productId || !stock.data || stock.isFetching) return;
    const rows = stock.data.stock.filter((s) => s.productId === pending.productId);
    const match = rows.find((s) => (!pending.locationId || s.locationId === pending.locationId) && (pending.lot === undefined || s.lot === pending.lot) && (pending.serial === undefined || s.serial === pending.serial)) ?? (rows.length === 1 ? rows[0] : null);
    setPending(null);
    if (match) {
      setPick(match);
      setQty(String(pending.quantity));
      setTimeout(() => issueQty.current?.focus(), 0);
    }
  }, [pending, onlyProduct, stock.data, stock.isFetching]);

  return (
    <Section title="Parts used">
      {d.stock.moves.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Part</th><th>Movement</th><th>Quantity</th><th>Store location</th>{seeCosts ? <th>Cost</th> : null}</tr></thead>
          <tbody>
            {d.stock.moves.map((m) => (
              <tr key={m.id}>
                <td data-label="Part"><span className="mt-num">{m.productNumber}</span> {m.productName}{m.lot ? <div className="muted small">Lot {m.lot}</div> : null}{m.serial ? <div className="muted small">Serial {m.serial}</div> : null}</td>
                <td data-label="Movement">{m.typeLabel}<div className="muted small">{m.byName ?? ''} · {dateTimeText(m.at)}</div></td>
                <td data-label="Quantity" className="mt-num">{m.quantity} {m.uom}</td>
                <td data-label="Store location">{m.location}</td>
                {seeCosts ? <td data-label="Cost" className="mt-num">{money(m.valueCents)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted small">No parts issued from the stores yet.</p>}
      {seeCosts && d.stock.moves.length ? <p className="small"><strong>Parts cost: {money(d.stock.costCents)}</strong> (issued less returned, at the stock value of each movement). {d.stock.financePosting}</p> : null}
      {canWork ? (
        <div className="mt-issue" ref={issueForm}>
          <div className="field">
            <label htmlFor="wo-part-q">Issue a part from a maintenance store</label>
            <input id="wo-part-q" className="input" type="search" value={q} onChange={(e) => { setQ(e.target.value); setOnlyProduct(''); setPick(null); }} placeholder="Part number or name" />
          </div>
          {!pick && stock.data ? (
            stock.data.stock.length ? (
              <ul className="mt-picker-list" aria-label="Parts in the maintenance stores">
                {stock.data.stock.slice(0, 30).map((s) => {
                  const held = heldHere(s);
                  return (
                    <li key={`${s.productId}-${s.locationId}-${s.lot}-${s.serial}`}>
                      <button type="button" onClick={() => { setPick(s); setQty('1'); }}>
                        <span className="mt-num">{s.productNumber}</span>
                        <span className="grow">{s.productName}</span>
                        <span className="muted small">{s.location}{s.lot ? ` lot ${s.lot}` : ''}{s.serial ? ` serial ${s.serial}` : ''}: {s.available} free{held > 1e-9 ? `, ${held} reserved for this work order` : ''}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="muted small">Nothing in the maintenance stores matches. An administrator marks warehouses as maintenance stores in Settings; stock is received in Inventory.</p>
          ) : null}
          {pick ? (
            <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void act(() => post(`${base}/issue`, { lines: [{ productId: pick.productId, locationId: pick.locationId, lot: pick.lot || undefined, serial: pick.serial || undefined, quantity: Number(qty) }], requestKey: key }), 'Part issued').then((ok) => { if (ok) { setPick(null); setQ(''); setOnlyProduct(''); setKey(requestKey()); } }); }}>
              <span className="mt-picked grow"><span className="mt-num">{pick.productNumber}</span> {pick.productName} from {pick.location} ({pick.available} {pick.uom} free{heldHere(pick) > 1e-9 ? `, ${heldHere(pick)} reserved for this work order` : ''})</span>
              <label className="sr-only" htmlFor="wo-part-qty">Quantity</label>
              <input id="wo-part-qty" ref={issueQty} className="input mt-qty" type="number" inputMode="decimal" min="0" step="any" value={qty} onChange={(e) => setQty(e.target.value)} />
              <button className="btn primary" disabled={!(Number(qty) > 0)}>Issue</button>
              <button type="button" className="btn ghost" onClick={() => setPick(null)}>Cancel</button>
            </form>
          ) : null}
          {issued.length ? (
            <form
              className="mt-add-line"
              onSubmit={(e) => {
                e.preventDefault();
                const [locationId, lot, serial] = ret.from.split('|');
                void act(() => post(`${base}/return`, { lines: [{ productId: ret.productId, locationId, lot: lot || undefined, serial: serial || undefined, quantity: Number(ret.qty) }], requestKey: key }), 'Part returned').then((ok) => { if (ok) { setRet({ productId: '', from: '', qty: '1' }); setKey(requestKey()); } });
              }}
            >
              <label className="sr-only" htmlFor="wo-ret-part">Return a part</label>
              <select id="wo-ret-part" className="select" value={ret.productId} onChange={(e) => setRet({ productId: e.target.value, from: '', qty: '1' })}>
                <option value="">Return a part not used…</option>
                {issued.map((p) => <option key={p.productId} value={p.productId}>{p.number} {p.name} ({p.issued} {p.uom} issued)</option>)}
              </select>
              {ret.productId ? (
                <>
                  <label className="sr-only" htmlFor="wo-ret-loc">To</label>
                  <select id="wo-ret-loc" className="select" value={ret.from} onChange={(e) => setRet((x) => ({ ...x, from: e.target.value }))}>
                    <option value="">To the store location…</option>
                    {returnFrom.map((m) => <option key={`${m.locationId}|${m.lot}|${m.serial}`} value={`${m.locationId}|${m.lot}|${m.serial}`}>{`${m.location}${m.lot ? ` lot ${m.lot}` : ''}${m.serial ? ` serial ${m.serial}` : ''}`}</option>)}
                  </select>
                  <label className="sr-only" htmlFor="wo-ret-qty">Quantity</label>
                  <input id="wo-ret-qty" className="input mt-qty" type="number" min="0" step="any" value={ret.qty} onChange={(e) => setRet((x) => ({ ...x, qty: e.target.value }))} />
                  <button className="btn" disabled={!ret.from || !(Number(ret.qty) > 0)}>Return</button>
                </>
              ) : null}
            </form>
          ) : null}
        </div>
      ) : null}
    </Section>
  );
}

// ------------------------------------------------------------------ labour

export function LabourSection({ companyId, me, woId, d, canWork, seeCosts, act }: Props) {
  const [f, setF] = useState({ date: localToday(), hours: '', minutes: '', note: '', userId: '' });
  const base = mtPath(companyId, `/work-orders/${woId}/labour`);
  const total = Math.round((Number(f.hours) || 0) * 60 + (Number(f.minutes) || 0));
  return (
    <Section title="Labour and costs">
      {d.labourCosts.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Date</th><th>Person</th><th>Time</th><th>How</th>{seeCosts ? <th>Rate</th> : null}{seeCosts ? <th>Cost</th> : null}<th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {d.labourCosts.map((l) => (
              <tr key={l.labourId}>
                <td data-label="Date">{dateText(l.workDate)}</td>
                <td data-label="Person">{l.userName ?? 'Someone'}{l.note ? <div className="muted small">{l.note}</div> : null}</td>
                <td data-label="Time" className="mt-num">{minutesText(l.minutes)}</td>
                <td data-label="How">{l.entry === 'timer' ? 'Timer' : 'Entered'}</td>
                {seeCosts ? <td data-label="Rate">{l.rateCents != null ? `${money(l.rateCents)} an hour (${RATE_SOURCE[l.rateSource ?? '']})` : <span className="muted">{RATE_SOURCE['']}</span>}</td> : null}
                {seeCosts ? <td data-label="Cost" className="mt-num">{money(l.costCents)}</td> : null}
                <td>{canWork && l.entry === 'manual' && (l.userId === me.user.id || me.can.manageWork) ? <button className="btn ghost icon sm" aria-label="Remove this time entry" onClick={() => act(() => del(`${base}/${l.labourId}`), 'Time entry removed')}><Icon name="trash" size={14} /></button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted small">No time with a cost line yet. Time from the timer is priced when it stops; time can also be entered by hand.</p>}
      {seeCosts && d.costs ? (
        <p className="small">
          <strong>Labour {money(d.costs.labourCents)} + parts {money(d.costs.partsCents)} = {money(d.costs.totalCents)}</strong>
          {d.costs.labourUnpricedMinutes ? ` (${minutesText(d.costs.labourUnpricedMinutes)} without a rate)` : ''}. Rates are set in Settings; past lines keep the rate they were priced at.
        </p>
      ) : null}
      {canWork ? (
        <form className="mt-labour-form" onSubmit={(e) => { e.preventDefault(); void act(() => post(base, { date: f.date, minutes: total, note: f.note || undefined, ...(f.userId ? { userId: f.userId } : {}) }), 'Time entered').then((ok) => ok && setF((x) => ({ ...x, hours: '', minutes: '', note: '' }))); }}>
          <div className="field"><label htmlFor="lab-date">Date</label><input id="lab-date" className="input" type="date" value={f.date} max={localToday()} onChange={(e) => setF((x) => ({ ...x, date: e.target.value }))} /></div>
          <div className="field"><label htmlFor="lab-h">Hours</label><input id="lab-h" className="input" type="number" inputMode="numeric" min="0" max="24" step="1" value={f.hours} onChange={(e) => setF((x) => ({ ...x, hours: e.target.value }))} /></div>
          <div className="field"><label htmlFor="lab-m">Minutes</label><input id="lab-m" className="input" type="number" inputMode="numeric" min="0" max="59" step="1" value={f.minutes} onChange={(e) => setF((x) => ({ ...x, minutes: e.target.value }))} /></div>
          {me.can.manageWork ? <PersonSelect me={me} id="lab-who" label="For" minRole="technician" value={f.userId} onChange={(v) => setF((x) => ({ ...x, userId: v }))} empty="Me" /> : null}
          <div className="field mt-labour-note"><label htmlFor="lab-note">Note</label><input id="lab-note" className="input" maxLength={500} value={f.note} onChange={(e) => setF((x) => ({ ...x, note: e.target.value }))} /></div>
          <button className="btn" disabled={total < 1 || total > 1440 || !f.date}>Enter time</button>
        </form>
      ) : null}
    </Section>
  );
}

// ------------------------------------------------------------------ downtime and readings

export function DowntimeSection({ companyId, woId, d, canWork, act }: Props) {
  const [f, setF] = useState({ start: msToLocal(d.downtime?.startedAt), end: msToLocal(d.downtime?.endedAt), cause: d.downtime?.cause ?? '' });
  const base = mtPath(companyId, `/work-orders/${woId}/downtime`);
  if (!d.downtime && !canWork) return null;
  const save = (end: number | null) => act(() => put(base, { startedAt: localToMs(f.start), endedAt: end, cause: f.cause }), end ? 'Downtime recorded' : 'Downtime started');
  return (
    <Section title="Downtime">
      {d.downtime ? (
        <p className="small">
          {d.downtime.endedAt ? `Down from ${dateTimeText(d.downtime.startedAt)} to ${dateTimeText(d.downtime.endedAt)}: ${minutesText(d.downtime.minutes)}.` : `Down since ${dateTimeText(d.downtime.startedAt)}.`}
          {d.downtime.cause ? ` ${d.downtime.cause}.` : ''}
        </p>
      ) : <p className="muted small">No downtime recorded. Record when the asset stopped and started again: breakdowns and corrective work with downtime count in the reliability reports.</p>}
      {canWork ? (
        <form className="mt-labour-form" onSubmit={(e) => { e.preventDefault(); void save(localToMs(f.end)); }}>
          <div className="field"><label htmlFor="dt-start">Down from</label><input id="dt-start" className="input" type="datetime-local" value={f.start} onChange={(e) => setF((x) => ({ ...x, start: e.target.value }))} /></div>
          <div className="field"><label htmlFor="dt-end">Back up at</label><input id="dt-end" className="input" type="datetime-local" value={f.end} onChange={(e) => setF((x) => ({ ...x, end: e.target.value }))} /></div>
          <div className="field mt-labour-note"><label htmlFor="dt-cause">Cause</label><input id="dt-cause" className="input" maxLength={500} value={f.cause} onChange={(e) => setF((x) => ({ ...x, cause: e.target.value }))} /></div>
          <button className="btn" disabled={!f.start}>Save downtime</button>
          {d.downtime && !d.downtime.endedAt ? <button type="button" className="btn primary" onClick={() => void save(Date.now())}>Back up now</button> : null}
        </form>
      ) : null}
    </Section>
  );
}

export function ReadingsSection({ companyId, woId, assetId, d, canWork, act }: Props) {
  const meters = useQuery({ queryKey: ['mt', companyId, 'meters', assetId], queryFn: () => get<{ meters: Meter[] }>(mtPath(companyId, `/meters?assetId=${assetId}`)), enabled: canWork });
  const [f, setF] = useState({ meterId: '', value: '', reset: false });
  const toast = useToast();
  if (!d.readings.length && !(canWork && meters.data?.meters.length)) return null;
  return (
    <Section title="Readings">
      {d.readings.length ? (
        <ul className="mt-docs small">
          {d.readings.map((r) => <li key={r.id}>{r.meterName}: <strong>{r.value}{r.unit ? ` ${r.unit}` : ''}</strong>{r.reset ? ' (reset)' : ''}{r.outOfRange ? <span className="mt-overdue"> outside the expected range</span> : null} · {dateTimeText(r.readAt)}</li>)}
        </ul>
      ) : null}
      {canWork && meters.data?.meters.length ? (
        <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void act(async () => { const r = await post<{ generated: { number: string }[] }>(mtPath(companyId, `/meters/${f.meterId}/readings`), { value: Number(f.value), reset: f.reset || undefined, workOrderId: woId, today: localToday() }); if (r.generated.length) toast(`Preventive work order made: ${r.generated.map((g) => g.number).join(', ')}`); }, 'Reading saved').then((ok) => ok && setF((x) => ({ ...x, value: '', reset: false }))); }}>
          <label className="sr-only" htmlFor="wo-meter">Meter</label>
          <select id="wo-meter" className="select" value={f.meterId} onChange={(e) => setF((x) => ({ ...x, meterId: e.target.value }))}>
            <option value="">Enter a reading…</option>
            {meters.data.meters.filter((m) => !m.archived).map((m) => <option key={m.id} value={m.id}>{m.name}{m.lastValue != null ? ` (last ${m.lastValue}${m.unit ? ` ${m.unit}` : ''})` : ''}</option>)}
          </select>
          <label className="sr-only" htmlFor="wo-reading">Reading</label>
          <input id="wo-reading" className="input mt-qty" type="number" inputMode="decimal" step="any" value={f.value} onChange={(e) => setF((x) => ({ ...x, value: e.target.value }))} />
          <label className="checkbox small"><input type="checkbox" checked={f.reset} onChange={(e) => setF((x) => ({ ...x, reset: e.target.checked }))} /> Meter reset or replaced</label>
          <button className="btn" disabled={!f.meterId || f.value === ''}>Save</button>
        </form>
      ) : null}
    </Section>
  );
}
