// Pieces shared by the sales documents (quotes, invoices, credit notes) and the other documents: the line editor
// (headings, item codes, units, optional lines), the editor's totals (the server's own rounding), the live preview
// (the PDF itself, drawn by the server's document engine, so the preview and the PDF cannot differ), sharing by secure
// link and email, and choosing a customer from the CRM.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { errorMessage, get, post, postForBlob, del } from '../lib/api';
import { useDebounced } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { Spinner } from '../components/ui/ui';
import { Modal, useToast } from '../components/ui/overlays';
import { lineTotal } from '../../shared/crm/money';
import { splitTax, type TaxMode } from '../../shared/fin/tax';
import { appUrl, dateTime, fin, useAccounts, useContacts, useRefresh, type FinOrgDTO, type TaxCodeDTO } from './lib';
import { AccountSelect, ContactSelect, Money, MoneyInput, TaxCodeSelect, TrackingSelect } from './ui';

// ------------------------------------------------------------------ lines

export interface SalesLine {
  key: number;
  lineKind: 'item' | 'heading';
  itemCode: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: number | null;
  discount: string;
  optional: boolean;
  accountId: string | null;
  taxCodeId: string | null;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
}

let lineKey = 1;
export const blankLine = (accountId: string | null = null, taxCodeId: string | null = null): SalesLine => ({ key: lineKey++, lineKind: 'item', itemCode: '', description: '', quantity: '1', unit: '', unitPrice: null, discount: '', optional: false, accountId, taxCodeId, departmentId: null, projectId: null, costCentreId: null });
export const headingLine = (): SalesLine => ({ ...blankLine(), lineKind: 'heading', quantity: '' });

/** A line as the API gives it, for the editor. */
export function lineFromDto(l: { lineKind?: string; itemCode?: string; description: string; quantity: number; unit?: string; unitPrice: number; discountBp: number; optional?: boolean; accountId: string | null; taxCodeId: string | null; departmentId?: string | null; projectId?: string | null; costCentreId?: string | null }): SalesLine {
  return {
    key: lineKey++,
    lineKind: l.lineKind === 'heading' ? 'heading' : 'item',
    itemCode: l.itemCode ?? '',
    description: l.description,
    quantity: l.lineKind === 'heading' ? '' : String(l.quantity),
    unit: l.unit ?? '',
    unitPrice: l.lineKind === 'heading' ? null : l.unitPrice,
    discount: l.discountBp ? String(l.discountBp / 100) : '',
    optional: !!l.optional,
    accountId: l.accountId,
    taxCodeId: l.taxCodeId,
    departmentId: l.departmentId ?? null,
    projectId: l.projectId ?? null,
    costCentreId: l.costCentreId ?? null,
  };
}

export const quantityOf = (s: string) => {
  const n = Number(s.trim() === '' ? '1' : s.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
};
export const percentBpOf = (s: string) => {
  const n = Number(s.trim() === '' ? '0' : s.replace('%', '').replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
};
export const isEmptyLine = (l: SalesLine) => (l.lineKind === 'heading' ? !l.description.trim() : !l.description.trim() && !l.itemCode.trim() && (l.unitPrice === null || l.unitPrice === 0));

/** A line for the API. */
export function lineBody(l: SalesLine, gst: boolean, withOptional: boolean) {
  if (l.lineKind === 'heading') return { lineKind: 'heading', description: l.description.trim(), unitPrice: 0 };
  return {
    lineKind: 'item',
    itemCode: l.itemCode.trim(),
    description: l.description.trim(),
    quantity: quantityOf(l.quantity),
    unit: l.unit.trim(),
    unitPrice: l.unitPrice ?? 0,
    discountBp: percentBpOf(l.discount),
    accountId: l.accountId,
    taxCodeId: gst ? l.taxCodeId : null,
    departmentId: l.departmentId,
    projectId: l.projectId,
    costCentreId: l.costCentreId,
    ...(withOptional ? { optional: l.optional } : {}),
  };
}

/**
 * The editor's figures, with the server's rounding (lineTotal, then the whole-document discount on each line, then
 * splitTax), so what a person sees before saving is what is saved. Optional lines are priced but not counted.
 */
export function priceLines(lines: SalesLine[], o: { gst: boolean; mode: TaxMode; discountBp: number; taxCodes: TaxCodeDTO[] | undefined }) {
  const mode: TaxMode = o.gst ? o.mode : 'none';
  const docBp = Number.isFinite(o.discountBp) ? o.discountBp : 0;
  const out = lines.map((l) => {
    if (l.lineKind === 'heading') return { amount: 0, net: 0, tax: 0, discounted: 0, valid: true };
    const q = quantityOf(l.quantity);
    const d = percentBpOf(l.discount);
    if (!Number.isFinite(q) || !Number.isFinite(d) || d < 0 || d > 10_000) return { amount: 0, net: 0, tax: 0, discounted: 0, valid: false };
    const amount = lineTotal(l.unitPrice ?? 0, Math.round(q * 1000), d);
    const discounted = docBp ? amount - Math.round((amount * docBp) / 10_000) : amount;
    const rate = o.gst && l.taxCodeId ? (o.taxCodes?.find((t) => t.id === l.taxCodeId)?.rateBp ?? 0) : 0;
    const s = splitTax(discounted, rate, mode);
    return { amount, net: s.net, tax: s.tax, discounted, valid: true };
  });
  const counted = out.filter((_, i) => lines[i].lineKind === 'item' && !lines[i].optional);
  const subtotal = counted.reduce((n, x) => n + x.net, 0);
  const tax = counted.reduce((n, x) => n + x.tax, 0);
  const gross = counted.reduce((n, x) => n + x.amount, 0);
  const discountTotal = gross - counted.reduce((n, x) => n + x.discounted, 0);
  return { lines: out, subtotal, tax, total: subtotal + tax, gross, discountTotal, mode, valid: out.every((x) => x.valid) && Number.isFinite(o.discountBp) && o.discountBp >= 0 && o.discountBp <= 10_000 };
}

export type Priced = ReturnType<typeof priceLines>;

/** The line editor: items and headings, with item codes and units where `extended`, optional items where allowed. */
export function LinesEditor({ lines, setLines, priced, gst, direction, extended, allowOptional, tracking, defaults }: { lines: SalesLine[]; setLines: (f: (ls: SalesLine[]) => SalesLine[]) => void; priced: Priced; gst: boolean; direction: 'sales' | 'purchases'; extended: boolean; allowOptional?: boolean; tracking: boolean; defaults?: { accountId: string | null; taxCodeId: string | null } }) {
  const accounts = useAccounts().data ?? [];
  const lineDirection = direction === 'sales' ? 'in' : 'out';
  const setLine = (key: number, p: Partial<SalesLine>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...p } : l)));
  const remove = (key: number) => setLines((ls) => (ls.length > 1 ? ls.filter((l) => l.key !== key) : [blankLine()]));
  const move = (key: number, by: -1 | 1) =>
    setLines((ls) => {
      const i = ls.findIndex((l) => l.key === key);
      const j = i + by;
      if (i < 0 || j < 0 || j >= ls.length) return ls;
      const next = [...ls];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const cols = 6 + (extended ? 2 : 0) + (gst ? 1 : 0) + (allowOptional ? 1 : 0);
  return (
    <>
      <div className="crm-table-scroll">
        <table className="fin-lines">
          <thead>
            <tr>
              {extended ? <th className="fin-col-code">Code</th> : null}
              <th>Description</th>
              <th className="fin-col-qty">Quantity</th>
              {extended ? <th className="fin-col-unit">Unit</th> : null}
              <th>Unit price</th>
              <th className="fin-col-qty">Discount %</th>
              <th>Account</th>
              {gst ? <th>GST</th> : null}
              {allowOptional ? <th className="fin-col-qty">Optional</th> : null}
              <th className="fin-num">Amount</th>
              <th>
                <span className="sr-only">Arrange</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => {
              const n = i + 1;
              const tools = (
                <td className="fin-line-actions">
                  <div className="row nowrap">
                    <button type="button" className="btn ghost icon sm" aria-label={`Move line ${n} up`} disabled={i === 0} onClick={() => move(l.key, -1)}>
                      <Icon name="chevronLeft" className="fin-rot-up" />
                    </button>
                    <button type="button" className="btn ghost icon sm" aria-label={`Move line ${n} down`} disabled={i === lines.length - 1} onClick={() => move(l.key, 1)}>
                      <Icon name="chevronDown" />
                    </button>
                    <button type="button" className="btn ghost icon sm" aria-label={`Remove line ${n}`} onClick={() => remove(l.key)}>
                      <Icon name="trash" />
                    </button>
                  </div>
                </td>
              );
              if (l.lineKind === 'heading') {
                return (
                  <tr key={l.key} className="fin-heading-row">
                    <td colSpan={cols}>
                      <input className="input fin-heading-input" aria-label={`Line ${n} heading`} placeholder="Heading, for example: Stage 1" maxLength={1000} value={l.description} onChange={(e) => setLine(l.key, { description: e.target.value })} />
                    </td>
                    {tools}
                  </tr>
                );
              }
              return [
                <tr key={l.key} className={l.optional ? 'fin-optional-row' : undefined}>
                  {extended ? (
                    <td>
                      <input className="input fin-in-code" aria-label={`Line ${n} item code`} maxLength={40} value={l.itemCode} onChange={(e) => setLine(l.key, { itemCode: e.target.value })} />
                    </td>
                  ) : null}
                  <td>
                    <textarea className="input fin-desc" rows={1} aria-label={`Line ${n} description`} maxLength={1000} value={l.description} onChange={(e) => setLine(l.key, { description: e.target.value })} />
                  </td>
                  <td>
                    <input className="input crm-num fin-in-qty" aria-label={`Line ${n} quantity`} inputMode="decimal" value={l.quantity} onChange={(e) => setLine(l.key, { quantity: e.target.value })} />
                  </td>
                  {extended ? (
                    <td>
                      <input className="input fin-in-unit" aria-label={`Line ${n} unit`} maxLength={20} placeholder="ea" value={l.unit} onChange={(e) => setLine(l.key, { unit: e.target.value })} />
                    </td>
                  ) : null}
                  <td>
                    <MoneyInput ariaLabel={`Line ${n} unit price`} value={l.unitPrice} onChange={(v) => setLine(l.key, { unitPrice: v })} signed />
                  </td>
                  <td>
                    <input className="input crm-num fin-in-qty" aria-label={`Line ${n} discount percent`} inputMode="decimal" placeholder="0" value={l.discount} onChange={(e) => setLine(l.key, { discount: e.target.value })} />
                  </td>
                  <td>
                    <AccountSelect ariaLabel={`Line ${n} account`} kind="category" direction={lineDirection} allowEmpty emptyLabel="Choose an account" value={l.accountId} onChange={(v) => setLine(l.key, { accountId: v, ...(gst && !l.taxCodeId ? { taxCodeId: accounts.find((a) => a.id === v)?.taxCodeId ?? null } : {}) })} />
                  </td>
                  {gst ? (
                    <td>
                      <TaxCodeSelect ariaLabel={`Line ${n} GST code`} direction={direction} value={l.taxCodeId} onChange={(v) => setLine(l.key, { taxCodeId: v })} />
                    </td>
                  ) : null}
                  {allowOptional ? (
                    <td className="fin-center">
                      <input type="checkbox" aria-label={`Line ${n} is optional`} checked={l.optional} onChange={(e) => setLine(l.key, { optional: e.target.checked })} />
                    </td>
                  ) : null}
                  <td className="fin-num">{l.optional ? <span className="muted">(<Money value={priced.lines[i]?.amount ?? 0} />)</span> : <Money value={priced.lines[i]?.amount ?? 0} />}</td>
                  {tools}
                </tr>,
                tracking ? (
                  <tr key={`${l.key}-t`}>
                    <td colSpan={cols + 1}>
                      <div className="row wrap small">
                        <TrackingSelect kind="department" value={l.departmentId} onChange={(v) => setLine(l.key, { departmentId: v })} />
                        <TrackingSelect kind="project" value={l.projectId} onChange={(v) => setLine(l.key, { projectId: v })} />
                        <TrackingSelect kind="cost_centre" value={l.costCentreId} onChange={(v) => setLine(l.key, { costCentreId: v })} />
                      </div>
                    </td>
                  </tr>
                ) : null,
              ];
            })}
          </tbody>
        </table>
      </div>
      <div className="row wrap">
        <button type="button" className="btn sm" onClick={() => setLines((ls) => [...ls, blankLine(defaults?.accountId ?? null, gst ? (defaults?.taxCodeId ?? null) : null)])} disabled={lines.length >= 200}>
          <Icon name="plus" /> Add a line
        </button>
        <button type="button" className="btn sm" onClick={() => setLines((ls) => [...ls, headingLine()])} disabled={lines.length >= 200}>
          <Icon name="plus" /> Add a heading
        </button>
      </div>
    </>
  );
}

/** The editor's totals, as the document will show them. */
export function Totals({ priced, gst, discountBp, labels }: { priced: Priced; gst: boolean; discountBp: number; labels?: { total?: string } }) {
  const inclusive = priced.mode === 'inclusive';
  return (
    <dl className="fin-totals">
      {discountBp > 0 ? (
        <>
          <dt>{inclusive ? 'Subtotal (including GST)' : 'Subtotal'}</dt>
          <dd>
            <Money value={priced.gross} />
          </dd>
          <dt>Discount {discountBp / 100}%</dt>
          <dd>
            <Money value={-priced.discountTotal} />
          </dd>
        </>
      ) : null}
      <dt>{gst && priced.mode !== 'none' ? 'Net (excluding GST)' : discountBp > 0 ? 'Net' : 'Subtotal'}</dt>
      <dd>
        <Money value={priced.subtotal} />
      </dd>
      {gst ? (
        <>
          <dt>GST</dt>
          <dd>
            <Money value={priced.tax} />
          </dd>
        </>
      ) : null}
      <dt className="total">{labels?.total ?? 'Total'}</dt>
      <dd className="total">
        <Money value={priced.total} />
      </dd>
    </dl>
  );
}

// ------------------------------------------------------------------ the live preview

/** Whether the screen is wide enough to show an editor and its preview side by side. */
function useWide(query = '(min-width: 1600px)') {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setWide(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return wide;
}

/**
 * The document as it will be saved, drawn by the server's document engine: the same bytes as its PDF, so the preview
 * cannot differ from the PDF. Redrawn a moment after each change; nothing is saved. On a wide screen it sits beside the
 * form; otherwise a bar at the foot of the form opens it.
 */
export function LivePreview({ path, body, label }: { path: string; body: unknown | null; label: string }) {
  const wide = useWide();
  const [open, setOpen] = useState(false);
  const active = wide || open;
  const key = useDebounced(body ? JSON.stringify(body) : '', 700);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const current = useRef<string | null>(null);
  useEffect(() => {
    if (!key || !active) return;
    const ctl = new AbortController();
    setLoading(true);
    postForBlob(path, JSON.parse(key), ctl.signal)
      .then((blob) => {
        const next = URL.createObjectURL(blob);
        if (current.current) URL.revokeObjectURL(current.current);
        current.current = next;
        setUrl(next);
        setError(null);
      })
      .catch((e) => {
        if ((e as Error).name !== 'AbortError') setError(errorMessage(e));
      })
      .finally(() => setLoading(false));
    return () => ctl.abort();
  }, [key, path, active]);
  useEffect(
    () => () => {
      if (current.current) URL.revokeObjectURL(current.current);
    },
    [],
  );
  const tools = (
    <>
      {loading ? <Spinner /> : null}
      {url ? (
        <a className="btn sm" href={url} target="_blank" rel="noopener">
          <Icon name="eye" /> Open full size
        </a>
      ) : null}
    </>
  );
  const frame = (
    <>
      {error ? <div className="error-box">{error}</div> : null}
      {url ? <iframe className="fin-preview-frame" src={url} title={`${label} preview`} /> : !error ? <div className="fin-preview-frame fin-preview-empty muted small">{body ? `Drawing the ${label.toLowerCase()}…` : `Fill in the form to see the ${label.toLowerCase()}.`}</div> : null}
    </>
  );
  if (!wide) {
    return (
      <>
        <div className="fin-preview-bar">
          <span className="grow small">See the {label.toLowerCase()} exactly as its PDF, as you type.</span>
          <button type="button" className="btn sm" onClick={() => setOpen(true)} disabled={!body}>
            <Icon name="eye" /> Preview
          </button>
        </div>
        {open ? (
          <Modal title={`${label} preview`} onClose={() => setOpen(false)} wide>
            <div className="row">
              <p className="muted small grow">The {label.toLowerCase()} exactly as its PDF, A4. Nothing is saved until you save.</p>
              {tools}
            </div>
            {frame}
          </Modal>
        ) : null}
      </>
    );
  }
  return (
    <section className="card card-pad fin-preview" aria-label={`${label} preview`}>
      <div className="row">
        <h2 className="crm-subhead grow">Preview</h2>
        {tools}
      </div>
      <p className="muted small">The {label.toLowerCase()} exactly as its PDF, A4. It updates as you type; nothing is saved until you save.</p>
      {frame}
    </section>
  );
}

/** A saved document's PDF, shown on its page (the same file as the download). */
export function DocumentFrame({ src, label, stamp }: { src: string; label: string; stamp: string | number }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">The {label.toLowerCase()}</h2>
        <button className="btn sm" onClick={() => setOpen(!open)} aria-expanded={open}>
          <Icon name={open ? 'eyeOff' : 'eye'} /> {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open ? <iframe className="fin-preview-frame" src={`${src}${src.includes('?') ? '&' : '?'}v=${stamp}`} title={label} /> : <p className="muted small">See the {label.toLowerCase()} as the customer receives it.</p>}
    </section>
  );
}

// ------------------------------------------------------------------ sharing: secure link and email

export type ShareKind = 'quote' | 'invoice' | 'credit_note';
const SHARE_PATH: Record<ShareKind, string> = { quote: 'quotes', invoice: 'docs', credit_note: 'credit-notes' };
const SHARE_LABEL: Record<ShareKind, string> = { quote: 'quote', invoice: 'invoice', credit_note: 'credit note' };

/** Get the online link, email it to the customer, or withdraw it. */
export function ShareActions({ org, kind, id, online, customerEmail, disabled, onChange }: { org: FinOrgDTO; kind: ShareKind; id: string; online: boolean; customerEmail: string | null; disabled?: boolean; onChange: () => void }) {
  const toast = useToast();
  const [link, setLink] = useState<string | null>(null);
  const [emailing, setEmailing] = useState(false);
  const [busy, setBusy] = useState(false);
  const base = fin(org.id, `/${SHARE_PATH[kind]}/${id}`);
  const getLink = async () => {
    setBusy(true);
    try {
      const r = await post<{ url: string }>(`${base}/link`);
      setLink(r.url);
      onChange();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button className="btn" disabled={disabled || busy} onClick={getLink}>
        <Icon name="link" /> {online ? 'Online link' : 'Get a link'}
      </button>
      <button className="btn" disabled={disabled || busy} onClick={() => setEmailing(true)}>
        <Icon name="mail" /> Email
      </button>
      {link ? (
        <Modal
          title={`Online ${SHARE_LABEL[kind]}`}
          onClose={() => setLink(null)}
          footer={
            <>
              <button
                className="btn danger"
                onClick={async () => {
                  try {
                    await del(`${base}/link`);
                    toast('Link withdrawn: it no longer works');
                    setLink(null);
                    onChange();
                  } catch (e) {
                    toast(errorMessage(e), 'error');
                  }
                }}
              >
                Withdraw the link
              </button>
              <span className="grow" />
              <button
                className="btn primary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(link);
                    toast('Link copied');
                  } catch {
                    toast('Select the link and copy it', 'error');
                  }
                }}
              >
                <Icon name="copy" /> Copy the link
              </button>
            </>
          }
        >
          <p>Anyone with this link can read and download the {SHARE_LABEL[kind]}{kind === 'quote' ? ', and accept or decline it' : ''}, without signing in. Send it only to the customer.</p>
          <input className="input mono" readOnly value={link} aria-label="Online link" onFocus={(e) => e.target.select()} />
          {kind === 'invoice' ? <p className="muted small">Opening the link never marks the invoice paid. Record payments as they arrive.</p> : null}
        </Modal>
      ) : null}
      {emailing ? <EmailDialog org={org} kind={kind} base={base} to={customerEmail ?? ''} onClose={() => setEmailing(false)} onSent={() => { setEmailing(false); onChange(); }} /> : null}
    </>
  );
}

function EmailDialog({ org, kind, base, to: initialTo, onClose, onSent }: { org: FinOrgDTO; kind: ShareKind; base: string; to: string; onClose: () => void; onSent: () => void }) {
  const toast = useToast();
  const [to, setTo] = useState(initialTo);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={`Email the ${SHARE_LABEL[kind]}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy || !org.emailConnected || !to.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                const r = await post<{ to: string }>(`${base}/email`, { to: to.trim(), message: message.trim() || undefined });
                toast(`Sent to ${r.to}`);
                onSent();
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Sending…' : 'Send'}
          </button>
        </>
      }
    >
      {!org.emailConnected ? <div className="error-box">Email is not set up on this service yet. Use “Get a link”, copy it and send it from your own email.</div> : null}
      <div className="field">
        <label htmlFor="share-to">To</label>
        <input id="share-to" className="input" type="email" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="share-msg">Message (optional)</label>
        <textarea id="share-msg" className="input" rows={4} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <p className="muted small">The email carries the secure online link, where the customer reads and downloads the {SHARE_LABEL[kind]}. It comes from BIZOMAT and names {org.legalName || org.name}.</p>
    </Modal>
  );
}

// ------------------------------------------------------------------ customers, including the CRM's

interface CrmPick {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactId: string | null;
}

/**
 * The customer of a sales document. When the workspace belongs to a company that runs the CRM, its companies can be
 * chosen too: each is billed as one Finance customer (linked once), so no second customer record is made.
 */
export function CustomerField({ org, id, value, onChange, required }: { org: FinOrgDTO; id: string; value: string | null; onChange: (v: string | null) => void; required?: boolean }) {
  const [picking, setPicking] = useState(false);
  const crm = useQuery({ queryKey: ['fin', org.id, 'crm-customers', ''], queryFn: () => get<{ available: boolean; access?: boolean }>(`/company/links/finance/${org.id}/crm-customers?q=`), retry: false, staleTime: 60_000 });
  const contacts = useContacts().data ?? [];
  return (
    <>
      <div className="row nowrap">
        <ContactSelect id={id} value={value} onChange={onChange} kind="customer" emptyLabel={required ? 'Choose a customer' : 'No customer yet'} />
        {crm.data?.available && crm.data.access ? (
          <button type="button" className="btn sm" onClick={() => setPicking(true)} title="Choose a company from the CRM">
            <Icon name="building" /> From the CRM
          </button>
        ) : null}
      </div>
      {!contacts.length && !crm.data?.available ? <span className="muted small">No customers yet: add one under Customers and suppliers.</span> : null}
      {picking ? (
        <CrmCustomerDialog
          org={org}
          onClose={() => setPicking(false)}
          onPicked={(contactId) => {
            setPicking(false);
            onChange(contactId);
          }}
        />
      ) : null}
    </>
  );
}

function CrmCustomerDialog({ org, onClose, onPicked }: { org: FinOrgDTO; onClose: () => void; onPicked: (contactId: string) => void }) {
  const toast = useToast();
  const refresh = useRefresh();
  const [q, setQ] = useState('');
  const dq = useDebounced(q, 250);
  const list = useQuery({ queryKey: ['fin', org.id, 'crm-customers', dq], queryFn: () => get<{ rows: CrmPick[]; canCreate?: boolean }>(`/company/links/finance/${org.id}/crm-customers?q=${encodeURIComponent(dq)}`) });
  const [busy, setBusy] = useState<string | null>(null);
  const rows = useMemo(() => list.data?.rows ?? [], [list.data]);
  return (
    <Modal title="Choose a customer from the CRM" onClose={onClose}>
      <p className="muted small">Each CRM company is one customer in Finance. Choosing one that is not in Finance yet adds it from the CRM’s details and links the two.</p>
      <input className="input" type="search" placeholder="Search the CRM’s companies" aria-label="Search the CRM’s companies" value={q} onChange={(e) => setQ(e.target.value)} />
      {list.isLoading ? <Spinner /> : null}
      <ul className="crm-mini-list">
        {rows.map((r) => (
          <li key={r.id}>
            <Icon name="building" size={14} />
            <div className="grow">
              <strong>{r.name}</strong>
              <div className="muted small">{[r.email, r.phone].filter(Boolean).join(' · ') || 'No email or phone in the CRM'}</div>
            </div>
            <button
              className="btn sm"
              disabled={!!busy || (!r.contactId && !list.data?.canCreate)}
              title={!r.contactId && !list.data?.canCreate ? 'Your Finance role cannot add customers' : undefined}
              onClick={async () => {
                setBusy(r.id);
                try {
                  const res = await post<{ contactId: string }>(`/company/links/finance/${org.id}/crm-customers/${r.id}`);
                  await refresh('contacts');
                  onPicked(res.contactId);
                } catch (e) {
                  toast(errorMessage(e), 'error');
                } finally {
                  setBusy(null);
                }
              }}
            >
              {r.contactId ? 'Choose' : 'Add and choose'}
            </button>
          </li>
        ))}
        {!list.isLoading && !rows.length ? <li className="muted small">No CRM companies match.</li> : null}
      </ul>
    </Modal>
  );
}

/** A quote's or credit note's history line. */
export function when(ms: number | null | undefined) {
  return ms ? dateTime(ms) : '';
}

export { appUrl };
