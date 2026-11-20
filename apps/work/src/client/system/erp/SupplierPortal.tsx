// The supplier portal (src/worker/erp/supplier-portal.ts; flag supplier_portal): for buyers, the portal panel of a
// supplier (invite one of the supplier's people by email, see who uses it, end their access) and the supplier's answers
// on a purchase order; for a supplier's own people, their portal at /erp/supplier-portal: the orders and requests for
// quotation of that supplier in that company, the answer to an order, a quotation and documents. The server decides
// every permission; these screens only show what it sends.
import { useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage, get, post, put } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { Section } from './common';
import { erpPath, money } from './api';

// ------------------------------------------------------------------ for buyers

interface PortalPerson {
  id: string;
  email: string;
  status: 'invited' | 'active' | 'revoked';
  name: string | null;
  invitedAt: number;
  acceptedAt: number | null;
  expired: boolean;
}

export function SupplierPortalPanel({ companyId, supplierId, canEdit }: { companyId: string; supplierId: string; canEdit: boolean }) {
  const key = ['erp', companyId, 'supplier-portal', supplierId];
  const q = useQuery({ queryKey: key, queryFn: () => get<{ enabled: boolean; people: PortalPerson[] }>(erpPath(companyId, `/suppliers/${supplierId}/portal`)), retry: false });
  const qc = useQueryClient();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!q.data?.enabled) return null;
  const invite = async () => {
    setBusy(true);
    try {
      const r = await post<{ url: string; delivery: string; people: PortalPerson[] }>(erpPath(companyId, `/suppliers/${supplierId}/portal/invitations`), { email });
      qc.setQueryData(key, { enabled: true, people: r.people });
      setLink(r.url);
      setEmail('');
      toast(r.delivery === 'queued' ? 'Invitation sent' : 'Invitation made: send the link');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const revoke = async (p: PortalPerson) => {
    try {
      const r = await post<{ people: PortalPerson[] }>(erpPath(companyId, `/suppliers/${supplierId}/portal/${p.id}/revoke`), {});
      qc.setQueryData(key, { enabled: true, people: r.people });
      toast(`Access of ${p.email} ended`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Section title="Supplier portal">
      <p className="muted small">The supplier’s own people, signed in with their own BIZOMAT account, see this supplier’s sent purchase orders and requests for quotation, answer orders, send quotations and add documents. They never see anything else of the company.</p>
      {q.data.people.length ? (
        <ul className="erp-list small">
          {q.data.people.map((p) => (
            <li key={p.id}>
              {p.name ? `${p.name}, ` : ''}{p.email} <span className="badge">{p.status === 'invited' ? (p.expired ? 'Invitation ended' : 'Invited') : p.status === 'active' ? 'Uses the portal' : 'Access ended'}</span>
              {canEdit && p.status !== 'revoked' ? <button className="btn sm ghost" onClick={() => void revoke(p)}>End access</button> : null}
            </li>
          ))}
        </ul>
      ) : <p className="muted small">Nobody uses the portal for this supplier yet.</p>}
      {canEdit ? (
        <div className="row wrap">
          <div className="field grow"><label htmlFor="sp-email">Invite by email</label><input id="sp-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@supplier.com" /></div>
          <button className="btn" disabled={busy || !email.includes('@')} onClick={() => void invite()}><Icon name="mail" /> Invite</button>
        </div>
      ) : null}
      {link ? <p className="small">Link for the invited person (it works for 14 days, once): <code>{link}</code></p> : null}
    </Section>
  );
}

export function PoPortalAnswers({ companyId, poId }: { companyId: string; poId: string }) {
  const q = useQuery({ queryKey: ['erp', companyId, 'po-portal', poId], queryFn: () => get<{ enabled: boolean; acknowledgements: { revision: number; decision: string; promisedDate: string | null; note: string; by: string | null; at: number }[] }>(erpPath(companyId, `/purchase-orders/${poId}/portal`)), retry: false });
  if (!q.data?.enabled) return null;
  return (
    <Section title="The supplier’s answer">
      {q.data.acknowledgements.length ? (
        <ul className="erp-list small">
          {q.data.acknowledgements.map((k) => (
            <li key={k.revision}>
              Revision {k.revision}: <strong>{k.decision === 'accepted' ? `Accepted, delivery promised for ${k.promisedDate}` : 'Declined'}</strong>{k.note ? `: ${k.note}` : ''} <span className="muted">({k.by ?? 'the supplier'}, through the supplier portal)</span>
            </li>
          ))}
        </ul>
      ) : <p className="muted small">The supplier has not answered through the portal.</p>}
    </Section>
  );
}

// ------------------------------------------------------------------ for a supplier's own people (/erp/supplier-portal)

const portalApi = (path: string) => `/supplier-portal${path}`;

export function SupplierPortalArea() {
  return (
    <Routes>
      <Route index element={<PortalList />} />
      <Route path="join/:token" element={<Join />} />
      <Route path=":company/:supplier" element={<PortalHome />} />
      <Route path=":company/:supplier/orders/:po" element={<PortalOrder />} />
      <Route path=":company/:supplier/rfqs/:rfq" element={<PortalRfq />} />
    </Routes>
  );
}

function Frame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  usePageTitle(title);
  return (
    <div className="page crm-page">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="stack">{children}</div>
    </div>
  );
}

function PortalList() {
  const q = useQuery({ queryKey: ['supplier-portal'], queryFn: () => get<{ portals: { companyId: string; companyName: string; supplierId: string; supplierName: string }[] }>(portalApi('')), retry: false });
  return (
    <Frame title="Supplier portal" subtitle="The companies you supply, and their orders and requests for quotation.">
      {q.error ? <ErrorBox error={q.error} /> : null}
      {!q.data && !q.error ? <Loading /> : null}
      {q.data ? (
        q.data.portals.length ? (
          <ul className="erp-list">{q.data.portals.map((p) => <li key={`${p.companyId}:${p.supplierId}`}><Link to={`/supplier-portal/${p.companyId}/${p.supplierId}`}>{p.companyName}</Link> <span className="muted small">as {p.supplierName}</span></li>)}</ul>
        ) : <EmptyState icon="briefcase" title="No supplier portal yet">A company you supply invites you by email; open the link in its invitation.</EmptyState>
      ) : null}
    </Frame>
  );
}

function Join() {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const q = useQuery({ queryKey: ['supplier-portal', 'invite', token], queryFn: () => get<{ companyName: string; supplierName: string; status: string; forYou: boolean; email: string | null }>(portalApi(`/invitations/${encodeURIComponent(token)}`)), retry: false });
  const accept = async () => {
    try {
      const r = await post<{ companyId: string; supplierId: string }>(portalApi(`/invitations/${encodeURIComponent(token)}/accept`), {});
      navigate(`/supplier-portal/${r.companyId}/${r.supplierId}`, { replace: true });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Frame title="Supplier portal invitation">
      {q.error ? <ErrorBox error={q.error} /> : null}
      {!q.data && !q.error ? <Loading /> : null}
      {q.data ? (
        <section className="card card-pad stack">
          <p>{q.data.companyName} invites you to its supplier portal, for {q.data.supplierName}.</p>
          {q.data.status !== 'pending' ? <p className="warning-text">This invitation has ended. Ask {q.data.companyName} for a new one.</p> : q.data.forYou ? (
            <button className="btn primary" onClick={() => void accept()}>Accept and open the portal</button>
          ) : <p className="warning-text">This invitation was sent to another email address. Sign out and sign in (or create an account) with the address it was sent to.</p>}
        </section>
      ) : null}
    </Frame>
  );
}

interface Home {
  company: { id: string; name: string };
  supplier: { id: string; number: string; name: string };
  orders: { id: string; number: string; status: string; revision: number; orderDate: string; requiredDate: string | null; currency: string; totalCents: number; acknowledged: string | null; needsAnswer: boolean }[];
  rfqs: { id: string; number: string; title: string; open: boolean; replyBy: string | null; requiredDate: string | null; currency: string; quotedCents: number | null }[];
}

const STATUS_WORDS: Record<string, string> = { approved: 'Approved', sent: 'Sent', partially_received: 'Partly received', received: 'Received', closed: 'Closed', cancelled: 'Cancelled' };

function PortalHome() {
  const { company = '', supplier = '' } = useParams();
  const q = useQuery({ queryKey: ['supplier-portal', company, supplier], queryFn: () => get<Home>(portalApi(`/${company}/${supplier}`)), retry: false });
  if (q.error) return <Frame title="Supplier portal"><ErrorBox error={q.error} /></Frame>;
  if (!q.data) return <Loading />;
  const h = q.data;
  const base = `/supplier-portal/${company}/${supplier}`;
  return (
    <Frame title={h.company.name} subtitle={`Supplier portal, as ${h.supplier.name}`}>
      <Section title="Purchase orders">
        {h.orders.length ? (
          <table className="data-table responsive">
            <thead><tr><th>Order</th><th>Status</th><th>Ordered</th><th>Needed by</th><th className="num">Total</th><th>Your answer</th></tr></thead>
            <tbody>{h.orders.map((o) => <tr key={o.id}><td data-label="Order"><Link to={`${base}/orders/${o.id}`}>{o.number}</Link>{o.revision > 1 ? <span className="muted small"> revision {o.revision}</span> : null}</td><td data-label="Status">{STATUS_WORDS[o.status] ?? o.status}</td><td data-label="Ordered">{o.orderDate}</td><td data-label="Needed by">{o.requiredDate ?? ''}</td><td className="num" data-label="Total">{money(o.totalCents, o.currency)}</td><td data-label="Your answer">{o.acknowledged === 'accepted' ? 'Accepted' : o.acknowledged === 'declined' ? 'Declined' : o.needsAnswer ? <strong>Waiting for your answer</strong> : ''}</td></tr>)}</tbody>
          </table>
        ) : <p className="muted small">No purchase orders yet.</p>}
      </Section>
      <Section title="Requests for quotation">
        {h.rfqs.length ? (
          <ul className="erp-list">{h.rfqs.map((r) => <li key={r.id}><Link to={`${base}/rfqs/${r.id}`}>{r.number} {r.title}</Link> <span className="muted small">{r.open ? `Open${r.replyBy ? `, reply by ${r.replyBy}` : ''}` : 'Closed for quotations'}{r.quotedCents !== null ? `, your quotation ${money(r.quotedCents, r.currency)}` : ''}</span></li>)}</ul>
        ) : <p className="muted small">No requests for quotation yet.</p>}
      </Section>
      <p className="small"><Link to="/supplier-portal">All your supplier portals</Link></p>
    </Frame>
  );
}

function PortalOrder() {
  const { company = '', supplier = '', po = '' } = useParams();
  const key = ['supplier-portal', company, supplier, 'po', po];
  const q = useQuery({ queryKey: key, queryFn: () => get<any>(portalApi(`/${company}/${supplier}/orders/${po}`)), retry: false });
  const qc = useQueryClient();
  const toast = useToast();
  const [decision, setDecision] = useState<'accepted' | 'declined'>('accepted');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  if (q.error) return <Frame title="Purchase order"><ErrorBox error={q.error} /></Frame>;
  if (!q.data) return <Loading />;
  const d = q.data;
  const o = d.order;
  const answer = async () => {
    setBusy(true);
    try {
      await post(portalApi(`/${company}/${supplier}/orders/${po}/acknowledge`), { decision, promisedDate: decision === 'accepted' ? date : null, note });
      toast('Your answer is sent');
      await qc.invalidateQueries({ queryKey: ['supplier-portal', company, supplier] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.set('file', file);
      try {
        await api(portalApi(`/${company}/${supplier}/orders/${po}/files`), { method: 'POST', form });
        toast(`${file.name} added`);
      } catch (e) {
        toast(errorMessage(e), 'error');
      }
    }
    await qc.invalidateQueries({ queryKey: key });
  };
  return (
    <Frame title={`Purchase order ${o.number}`} subtitle={`${STATUS_WORDS[o.status] ?? o.status}${o.revision > 1 ? `, revision ${o.revision}` : ''}`}>
      <p className="small"><Link to={`/supplier-portal/${company}/${supplier}`}>Back to the portal</Link></p>
      <Section title="Order">
        <ul className="erp-list small">
          <li>Ordered {o.orderDate}{o.requiredDate ? `, needed by ${o.requiredDate}` : ''}</li>
          {o.deliveryAddress ? <li>Deliver to {o.deliveryAddress}</li> : null}
          {o.paymentTermsDays !== null ? <li>Payment terms: {o.paymentTermsDays} days</li> : null}
          {o.terms ? <li>Terms: {o.terms}</li> : null}
        </ul>
        <table className="data-table responsive">
          <thead><tr><th>Item</th><th className="num">Quantity</th><th className="num">Unit price</th><th className="num">Amount</th><th className="num">Received</th></tr></thead>
          <tbody>{d.lines.map((l: any) => <tr key={l.id}><td data-label="Item">{l.productNumber ? `${l.productNumber} ` : ''}{l.item}{l.specification ? <div className="muted small">{l.specification}</div> : null}</td><td className="num" data-label="Quantity">{l.quantity} {l.uom}</td><td className="num" data-label="Unit price">{money(l.unitPriceCents, o.currency)}{l.discountBp ? <div className="muted small">less {l.discountBp / 100}%</div> : null}</td><td className="num" data-label="Amount">{money(l.netCents, o.currency)}</td><td className="num" data-label="Received">{l.receivedQty}</td></tr>)}</tbody>
        </table>
        <p className="small">Total {money(o.totalCents, o.currency)}{o.taxCents ? ` (tax ${money(o.taxCents, o.currency)})` : ''}</p>
      </Section>
      <Section title="Your answer">
        {d.acknowledgement ? <p>{d.acknowledgement.decision === 'accepted' ? `Accepted, delivery promised for ${d.acknowledgement.promisedDate}` : 'Declined'}{d.acknowledgement.note ? `: ${d.acknowledgement.note}` : ''}</p> : d.canAnswer ? (
          <div className="stack">
            <div className="row wrap">
              <label className="row small"><input type="radio" name="sp-dec" checked={decision === 'accepted'} onChange={() => setDecision('accepted')} /> Accept</label>
              <label className="row small"><input type="radio" name="sp-dec" checked={decision === 'declined'} onChange={() => setDecision('declined')} /> Decline</label>
            </div>
            {decision === 'accepted' ? <div className="field"><label htmlFor="sp-date">Delivery promised for</label><input id="sp-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div> : null}
            <div className="field"><label htmlFor="sp-note">{decision === 'declined' ? 'Why (required)' : 'Note'}</label><textarea id="sp-note" className="textarea" rows={2} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
            <button className="btn primary" disabled={busy || (decision === 'accepted' ? !date : !note.trim())} onClick={() => void answer()}>Send the answer</button>
          </div>
        ) : <p className="muted small">This order is no longer answered.</p>}
      </Section>
      <Section title="Your documents">
        {d.files.length ? <ul className="erp-list small">{d.files.map((f: any) => <li key={f.id}><a href={appUrl(f.url)}>{f.name}</a></li>)}</ul> : <p className="muted small">None yet. Add a delivery docket, a certificate or your invoice (PDF or a picture).</p>}
        {!o.cancelled ? <input type="file" accept="application/pdf,image/*" multiple aria-label="Add documents" onChange={(e) => void upload(e.target.files)} /> : null}
      </Section>
    </Frame>
  );
}

function PortalRfq() {
  const { company = '', supplier = '', rfq = '' } = useParams();
  const key = ['supplier-portal', company, supplier, 'rfq', rfq];
  const q = useQuery({ queryKey: key, queryFn: () => get<any>(portalApi(`/${company}/${supplier}/rfqs/${rfq}`)), retry: false });
  const qc = useQueryClient();
  const toast = useToast();
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [reference, setReference] = useState('');
  const [lead, setLead] = useState('');
  const [busy, setBusy] = useState(false);
  if (q.error) return <Frame title="Request for quotation"><ErrorBox error={q.error} /></Frame>;
  if (!q.data) return <Loading />;
  const d = q.data;
  const r = d.rfq;
  const given = (lineId: string) => prices[lineId] ?? (d.quotation?.lines.find((l: any) => l.rfqLineId === lineId)?.unitPriceCents != null ? String(d.quotation.lines.find((l: any) => l.rfqLineId === lineId).unitPriceCents / 100) : '');
  const send = async () => {
    setBusy(true);
    try {
      await put(portalApi(`/${company}/${supplier}/rfqs/${rfq}/quotation`), {
        reference: reference || d.quotation?.reference || '',
        leadTimeDays: lead ? Number(lead) : (d.quotation?.leadTimeDays ?? null),
        lines: d.lines.map((l: any) => ({ rfqLineId: l.id, unitPriceCents: given(l.id) === '' ? null : Math.round(Number(given(l.id)) * 100) })),
      });
      toast('Your quotation is sent');
      await qc.invalidateQueries({ queryKey: key });
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Frame title={`Request for quotation ${r.number}`} subtitle={r.open ? `Open${r.replyBy ? `, reply by ${r.replyBy}` : ''}` : 'Closed for quotations'}>
      <p className="small"><Link to={`/supplier-portal/${company}/${supplier}`}>Back to the portal</Link></p>
      <Section title={r.title || 'What is asked'}>
        {r.notes ? <p className="small">{r.notes}</p> : null}
        <table className="data-table responsive">
          <thead><tr><th>Item</th><th className="num">Quantity</th><th className="num">Your unit price ({r.currency})</th></tr></thead>
          <tbody>{d.lines.map((l: any) => <tr key={l.id}><td data-label="Item">{l.productNumber ? `${l.productNumber} ` : ''}{l.item}{l.specification ? <div className="muted small">{l.specification}</div> : null}</td><td className="num" data-label="Quantity">{l.quantity} {l.uom}</td><td className="num" data-label="Your unit price">{r.open ? <input className="input erp-qty-input" inputMode="decimal" aria-label={`Unit price of ${l.item}`} value={given(l.id)} onChange={(e) => setPrices((x) => ({ ...x, [l.id]: e.target.value }))} /> : given(l.id)}</td></tr>)}</tbody>
        </table>
        {r.open ? (
          <div className="row wrap">
            <div className="field"><label htmlFor="sq-ref">Your reference</label><input id="sq-ref" className="input" maxLength={100} value={reference || d.quotation?.reference || ''} onChange={(e) => setReference(e.target.value)} /></div>
            <div className="field"><label htmlFor="sq-lead">Lead time (days)</label><input id="sq-lead" className="input erp-qty-input" type="number" min={0} max={1000} value={lead || (d.quotation?.leadTimeDays ?? '')} onChange={(e) => setLead(e.target.value)} /></div>
            <button className="btn primary" disabled={busy} onClick={() => void send()}>{d.quotation ? 'Send the new quotation' : 'Send the quotation'}</button>
          </div>
        ) : null}
        {d.quotation ? <p className="small">Your quotation: {money(d.quotation.totalCents, d.quotation.currency)}{d.quotation.source === 'staff' ? ' (entered by the company)' : ''}</p> : null}
      </Section>
    </Frame>
  );
}
