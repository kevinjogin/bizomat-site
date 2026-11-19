// BIZOMAT ERP, Administration > Billing (/erp/c/<company>/billing): the company's subscription, priced per active user.
// Owners and administrators of a registered company see who is billed and why, the price per user and how GST is
// treated, the estimated next invoice, payments and the billing history, and start, change or cancel the subscription.
// Payments use Stripe's embedded Checkout on this page; card details go to Stripe, never to BIZOMAT. Every number here
// comes from the server, which reads Stripe; the seat count is the company's own membership list.
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { ApiError, errorMessage, get, post } from '../../lib/api';
import { appUrl, toolUrl } from '../../lib/base';
import { usePageTitle } from '../../lib/hooks';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import '../../styles/billing.css';

type Interval = 'month' | 'year';

interface PriceView {
  interval: Interval;
  ok: boolean;
  problem: string | null;
  unitAmount: number | null;
  currency: string | null;
  taxBehavior: string | null;
  productName: string | null;
  display: string;
  gst: string;
  gstCalculated: boolean;
}

interface SubView {
  id: string;
  status: string;
  statusWords: string;
  interval: Interval | null;
  quantity: number;
  unitAmount: number | null;
  currency: string | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  cancelAt: number | null;
  endedAt: number | null;
  trialEnd: number | null;
  pastDueSince: number | null;
  paymentMethod: { brand: string; last4: string | null; expMonth: number | null; expYear: number | null } | null;
}

interface Summary {
  company: { id: string; name: string; legalName: string; abn: string | null; abnStatus: string; gstFrom: string | null };
  role: 'owner' | 'admin' | 'member';
  seats: { count: number; people: { id: string; name: string; email: string; role: string }[]; pendingInvitations: number; disabledMembers: number };
  enforcement: 'off' | 'shadow' | 'on';
  billing: { enabled: boolean; free?: boolean; environment: 'test' | 'live' | null; reason: string | null; canSubscribe: boolean; whyNot: string | null; duplicateSubscriptions?: boolean; priceError?: string | null };
  prices: { month: PriceView | null; year: PriceView | null };
  subscription: SubView | null;
  invoices: { id: string; number: string | null; status: string; currency: string; subtotal: number; tax: number; total: number; amount_due: number; amount_paid: number; amount_remaining: number; period_start: number | null; period_end: number | null; hosted_invoice_url: string | null; invoice_pdf: string | null; stripe_created: number }[];
  history: { kind: string; summary: string; created_at: number; actor: string | null }[];
  explanations: { seatsAdded: string; seatsRemoved: string; gstCalculated: string } | null;
  entitled: { allowed: boolean; why: string };
}

interface Preview {
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  amountDue: number;
  periodStart: number | null;
  periodEnd: number | null;
  nextPaymentAttempt: number | null;
  lines: { description: string; amount: number; quantity: number | null; proration: boolean }[];
}

const ROLE: Record<string, string> = { owner: 'Owner', admin: 'Administrator', member: 'Member' };
const day = (ms: number | null | undefined) => (ms ? new Date(ms).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export function aud(cents: number | null | undefined, currency = 'aud'): string {
  if (typeof cents !== 'number') return '';
  const s = (Math.abs(cents) / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${cents < 0 ? '-' : ''}${currency.toLowerCase() === 'aud' ? 'A$' : `${currency.toUpperCase()} `}${s}`;
}
const per = (i: Interval | null) => (i === 'year' ? 'year' : 'month');
const STATUS_TONE: Record<string, string> = { active: 'success', trialing: 'success', past_due: 'warning', unpaid: 'danger', incomplete: 'warning', canceled: '', paused: 'warning' };
const statusLabel = (s: string) => ({ active: 'Active', trialing: 'Trial', past_due: 'Past due', unpaid: 'Unpaid', incomplete: 'Awaiting first payment', incomplete_expired: 'Not started', canceled: 'Cancelled', paused: 'Paused' })[s] ?? s;

export function BillingPage({ companyId }: { companyId: string; companyName: string }) {
  usePageTitle('Billing');
  const qc = useQueryClient();
  const toast = useToast();
  const path = `/api/billing/c/${encodeURIComponent(companyId)}`;
  const q = useQuery({ queryKey: ['billing', companyId], queryFn: () => get<Summary>(path) });
  const [checkout, setCheckout] = useState<null | { kind: 'subscription'; interval: Interval } | { kind: 'setup' }>(null);
  const [interval, setInterval] = useState<Interval>('month');
  const [returning, setReturning] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [switchTo, setSwitchTo] = useState<Interval | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ['billing', companyId] });

  // Back from Stripe's embedded Checkout (?checkout=cs_... or ?setup=cs_...): the server reads the session from Stripe.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session = params.get('checkout') ?? params.get('setup');
    if (!session || !/^cs_[A-Za-z0-9_]+$/.test(session)) return;
    setReturning('Checking the payment with Stripe…');
    get<{ status: string; mode: string }>(`${path}/checkout/${encodeURIComponent(session)}`)
      .then((r) => {
        setReturning(
          r.status === 'complete'
            ? r.mode === 'setup'
              ? 'The new payment method is saved.'
              : 'Thank you. The subscription has started; it may take a moment to show here.'
            : 'The payment was not completed. Nothing was charged.',
        );
        refresh();
      })
      .catch((e) => setReturning(errorMessage(e)))
      .finally(() => history.replaceState(null, '', location.pathname));
  }, [companyId]);

  if (q.error) {
    if (q.error instanceof ApiError && (q.error.status === 403 || q.error.status === 404)) {
      return (
        <div className="page">
          <PageHeader title="Billing" />
          <EmptyState icon="shield" title="Billing is for the company’s owner and administrators">
            Billing belongs to a registered company. Ask its owner or an administrator. A company of your own that is not registered, and the example company, are not billed.
          </EmptyState>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  }
  if (!q.data) return <Loading label="Loading billing…" />;
  const d = q.data;
  const sub = d.subscription;
  const open = !!sub && ['active', 'trialing', 'past_due', 'unpaid', 'incomplete', 'paused'].includes(sub.status);
  const price = d.prices[open && sub?.interval ? sub.interval : interval] ?? d.prices.month;

  const act = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await fn();
      toast(done);
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  // Free mode (BIZOMAT_BILLING_LOCK on the server): no price, nothing to subscribe to, nothing to pay.
  if (d.billing.free) {
    return (
      <div className="page crm-page billing-page">
        <PageHeader title="Billing" subtitle={`${d.company.name}: BIZOMAT is free.`} />
        <section className="card card-pad stack">
          <h2 className="crm-subhead">BIZOMAT is free for every company</h2>
          <p>Your company uses BIZOMAT ERP and every tool in it without charge. There is no subscription to start and nothing to pay.</p>
          {d.billing.reason ? <p className="small muted">For platform administrators: {d.billing.reason}</p> : null}
        </section>
        {open && sub ? (
          <section className="card card-pad stack">
            <p className="billing-banner warning">A subscription from before BIZOMAT became free is still open in Stripe ({statusLabel(sub.status)}). Cancel it so nothing more is charged; the company keeps full use either way.</p>
            {sub.cancelAtPeriodEnd ? (
              <p className="small muted">Cancellation is scheduled for the end of the paid period.</p>
            ) : (
              <div className="row">
                <button className="btn danger" disabled={busy} onClick={() => { if (confirm('Cancel the subscription at the end of the paid period?')) void act(() => post(`${path}/cancel`, {}), 'Cancellation scheduled'); }}>Cancel subscription</button>
              </div>
            )}
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="page crm-page billing-page">
      <PageHeader
        title="Billing"
        subtitle={`${d.company.name}: one subscription for the company, charged per active user. Payments are made through Stripe; card details never reach BIZOMAT.`}
        actions={<a className="btn" href={toolUrl(`/company/c/${encodeURIComponent(companyId)}/people`)}>People and invitations</a>}
      />
      {d.billing.environment === 'test' ? <p className="billing-banner info">Test mode: payments use Stripe’s test cards and nothing is charged.</p> : null}
      {returning ? <p className="billing-banner info" role="status">{returning}</p> : null}
      {!d.billing.enabled ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Subscriptions are not open yet</h2>
          <p>Nothing is charged today: your company keeps using BIZOMAT ERP as it does now. The price per user, and how GST applies, would be shown here before anyone could subscribe.</p>
          <ul className="billing-notes">
            <li>One subscription per registered company, priced per active user, billed monthly in Australian dollars.</li>
            <li>Every active member counts once, the owner and administrators included. Pending invitations and disabled or removed accounts are not counted.</li>
            <li>When someone joins, the time left in the month is charged on the next invoice; when someone leaves, the unused time is credited.</li>
            <li>Owners and administrators can cancel at any time; the company keeps full use until the end of the paid month.</li>
          </ul>
          <p className="small muted">The example company, CAD Automation and the public Resources stay free. <a href="https://bizomat.ai/contact/">Questions about billing</a></p>
          {d.billing.reason ? <p className="small muted">For platform administrators: {d.billing.reason}</p> : null}
        </section>
      ) : null}
      {d.billing.duplicateSubscriptions ? <p className="billing-banner warning">Stripe reports more than one open subscription for this company. BIZOMAT has been told and will sort it out; nothing more is charged for it.</p> : null}
      {sub?.status === 'past_due' || sub?.status === 'unpaid' ? (
        <p className="billing-banner warning">A payment failed{sub.pastDueSince ? ` on ${day(sub.pastDueSince)}` : ''}. Stripe is retrying it. Update the payment method below if the card has changed.</p>
      ) : null}

      <div className="crm-stats">
        <div className="card crm-stat">
          <span className="crm-stat-label">Billable users</span>
          <span className="crm-stat-value">{d.seats.count}</span>
          <span className="crm-stat-hint">{open && sub && sub.quantity !== d.seats.count ? `Stripe bills ${sub.quantity}: being updated` : 'Active members of the company'}</span>
        </div>
        <div className="card crm-stat">
          <span className="crm-stat-label">Price per user</span>
          <span className="crm-stat-value billing-stat-text">{open && sub?.unitAmount ? `${aud(sub.unitAmount, sub.currency ?? 'aud')}` : price?.unitAmount ? aud(price.unitAmount, price.currency ?? 'aud') : 'Not set'}</span>
          <span className="crm-stat-hint">per user per {per(open ? sub!.interval : interval)}{price ? `; ${price.taxBehavior === 'inclusive' ? 'GST included' : price.taxBehavior === 'exclusive' ? 'plus GST where it applies' : 'GST being confirmed'}` : ''}</span>
        </div>
        <div className="card crm-stat">
          <span className="crm-stat-label">Billing frequency</span>
          <span className="crm-stat-value billing-stat-text">{open && sub?.interval ? (sub.interval === 'year' ? 'Annual' : 'Monthly') : 'No subscription'}</span>
          <span className="crm-stat-hint">{open && sub?.currentPeriodEnd ? `${sub.cancelAtPeriodEnd ? 'Ends' : 'Renews'} ${day(sub.cancelAtPeriodEnd ? sub.cancelAt ?? sub.currentPeriodEnd : sub.currentPeriodEnd)}` : ' '}</span>
        </div>
        <div className="card crm-stat">
          <span className="crm-stat-label">Subscription</span>
          <span className="crm-stat-value billing-stat-text">{sub ? statusLabel(sub.status) : 'None'}</span>
          <span className="crm-stat-hint">{sub ? sub.statusWords : d.billing.enabled ? 'Not subscribed yet' : 'Billing is off'}</span>
        </div>
      </div>

      {d.billing.enabled && !open ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Start the subscription</h2>
          <p className="muted">The company is billed for each active member: the owner, administrators and members. Pending invitations and disabled accounts are not billed. When people join or leave, the number of users billed follows by itself.</p>
          {d.prices.year ? (
            <div className="row wrap billing-choice" role="radiogroup" aria-label="Billing frequency">
              {(['month', 'year'] as const).map((i) => d.prices[i] ? (
                <label key={i} className={`billing-option${interval === i ? ' selected' : ''}`}>
                  <input type="radio" name="interval" checked={interval === i} onChange={() => setInterval(i)} />
                  <span><strong>{i === 'month' ? 'Monthly' : 'Annual'}</strong><br /><span className="small">{d.prices[i]!.display}</span></span>
                </label>
              ) : null)}
            </div>
          ) : null}
          {price?.unitAmount ? (
            <p>
              <strong>{d.seats.count} {d.seats.count === 1 ? 'user' : 'users'} × {aud(price.unitAmount, price.currency ?? 'aud')} = {aud(price.unitAmount * d.seats.count, price.currency ?? 'aud')} per {per(interval)}</strong>{' '}
              <span className="muted">{price.taxBehavior === 'inclusive' ? '(GST included)' : price.taxBehavior === 'exclusive' ? '(before GST, where it applies)' : ''}</span>
            </p>
          ) : null}
          {price ? <p className="small muted">{price.gst} {d.explanations?.gstCalculated}</p> : null}
          {checkout?.kind === 'subscription' ? (
            <EmbeddedCheckout fetchSecret={() => post<{ clientSecret: string }>(`${path}/checkout`, { interval: checkout.interval }).then((r) => r.clientSecret)} onClose={() => setCheckout(null)} />
          ) : (
            <div className="row wrap">
              <button className="btn primary" disabled={!d.billing.canSubscribe} onClick={() => setCheckout({ kind: 'subscription', interval })}>Start subscription</button>
              {d.billing.whyNot ? <span className="muted small">{d.billing.whyNot}</span> : null}
            </div>
          )}
        </section>
      ) : null}

      {open && sub ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Subscription</h2>
          <dl className="billing-facts">
            <dt>Status</dt><dd><span className={`badge ${STATUS_TONE[sub.status] ?? ''}`}>{statusLabel(sub.status)}</span> {sub.statusWords}</dd>
            <dt>Users billed</dt><dd>{sub.quantity}</dd>
            <dt>Price</dt><dd>{aud(sub.unitAmount, sub.currency ?? 'aud')} per user per {per(sub.interval)}</dd>
            <dt>{sub.cancelAtPeriodEnd ? 'Ends' : 'Current period ends'}</dt><dd>{day(sub.cancelAtPeriodEnd ? sub.cancelAt ?? sub.currentPeriodEnd : sub.currentPeriodEnd)}</dd>
            <dt>Payment method</dt><dd>{sub.paymentMethod ? `${sub.paymentMethod.brand.toUpperCase()}${sub.paymentMethod.last4 ? ` ending ${sub.paymentMethod.last4}` : ''}${sub.paymentMethod.expMonth ? `, expires ${String(sub.paymentMethod.expMonth).padStart(2, '0')}/${sub.paymentMethod.expYear}` : ''}` : 'Held by Stripe'}</dd>
          </dl>
          {sub.cancelAtPeriodEnd ? <p className="billing-banner info">The subscription is cancelled and ends on {day(sub.cancelAt ?? sub.currentPeriodEnd)}. The company keeps full use until then; its records are kept after it.</p> : null}
          {checkout?.kind === 'setup' ? (
            <EmbeddedCheckout fetchSecret={() => post<{ clientSecret: string }>(`${path}/payment-method`, {}).then((r) => r.clientSecret)} onClose={() => setCheckout(null)} />
          ) : (
            <div className="row wrap">
              <button className="btn" disabled={busy} onClick={() => setCheckout({ kind: 'setup' })}>Update payment method</button>
              {d.prices.year && d.prices.month && sub.interval ? <button className="btn" disabled={busy} onClick={() => setSwitchTo(sub.interval === 'year' ? 'month' : 'year')}>Switch to {sub.interval === 'year' ? 'monthly' : 'annual'} billing</button> : null}
              <button className="btn" disabled={busy} onClick={() => act(() => post(`${path}/sync-seats`, {}), 'Users billed are up to date')}>Update users billed now</button>
              {sub.cancelAtPeriodEnd ? (
                <button className="btn primary" disabled={busy} onClick={() => act(() => post(`${path}/resume`, {}), 'The subscription continues')}>Keep the subscription</button>
              ) : (
                <button className="btn danger" disabled={busy} onClick={() => { if (confirm('Cancel the subscription at the end of the paid period? The company keeps full use until then.')) void act(() => post(`${path}/cancel`, {}), 'Cancellation scheduled'); }}>Cancel subscription</button>
              )}
            </div>
          )}
          <NextInvoice path={path} />
        </section>
      ) : null}

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Who is billed</h2>
        <p className="muted small">
          {d.seats.count} active {d.seats.count === 1 ? 'member' : 'members'}, counted once each.
          {d.seats.pendingInvitations ? ` ${d.seats.pendingInvitations} pending ${d.seats.pendingInvitations === 1 ? 'invitation is' : 'invitations are'} not billed until accepted.` : ''}
          {d.seats.disabledMembers ? ` ${d.seats.disabledMembers} disabled ${d.seats.disabledMembers === 1 ? 'account is' : 'accounts are'} not billed.` : ''}
        </p>
        <div className="crm-table-scroll">
          <table className="data-table responsive">
            <thead><tr><th>Name</th><th>Email</th><th>Company role</th></tr></thead>
            <tbody>
              {d.seats.people.map((p) => <tr key={p.id}><td data-label="Name">{p.name}</td><td data-label="Email">{p.email}</td><td data-label="Company role">{ROLE[p.role] ?? p.role}</td></tr>)}
            </tbody>
          </table>
        </div>
        {d.explanations ? (
          <ul className="small muted billing-notes">
            <li>When someone joins: {d.explanations.seatsAdded}</li>
            <li>When someone leaves or their account is disabled: {d.explanations.seatsRemoved}</li>
          </ul>
        ) : null}
      </section>

      {d.billing.enabled ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Payments and invoices</h2>
          <p className="small muted">Invoices are issued by Stripe for BIZOMAT. {d.explanations?.gstCalculated}</p>
          {d.invoices.length ? (
            <div className="crm-table-scroll">
              <table className="data-table responsive">
                <thead><tr><th>Date</th><th>Invoice</th><th>Period</th><th>Total</th><th>GST</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {d.invoices.map((i) => (
                    <tr key={i.id}>
                      <td data-label="Date">{day(i.stripe_created)}</td>
                      <td data-label="Invoice">{i.number ?? 'Draft'}</td>
                      <td data-label="Period">{i.period_start ? `${day(i.period_start)} to ${day(i.period_end)}` : ''}</td>
                      <td data-label="Total">{aud(i.total, i.currency)}</td>
                      <td data-label="GST">{aud(i.tax, i.currency)}</td>
                      <td data-label="Status"><span className={`badge ${i.status === 'paid' ? 'success' : i.status === 'open' ? 'warning' : ''}`}>{i.status === 'paid' ? 'Paid' : i.status === 'open' ? (i.amount_remaining ? 'Due' : 'Open') : i.status === 'void' ? 'Void' : i.status === 'uncollectible' ? 'Uncollectible' : 'Draft'}</span></td>
                      <td data-label="">{i.hosted_invoice_url ? <a href={i.hosted_invoice_url} target="_blank" rel="noopener noreferrer">View at Stripe</a> : null}{i.invoice_pdf ? <> · <a href={i.invoice_pdf} target="_blank" rel="noopener noreferrer">PDF</a></> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="muted">No invoices yet.</p>}
        </section>
      ) : null}

      {d.history.length ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Billing history</h2>
          <ul className="billing-history">
            {d.history.map((h, n) => <li key={n}><span className="muted small">{new Date(h.created_at).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}</span> {h.summary}{h.actor ? <span className="muted small"> ({h.actor})</span> : null}</li>)}
          </ul>
        </section>
      ) : null}

      {switchTo && sub ? <SwitchInterval path={path} to={switchTo} onClose={() => setSwitchTo(null)} onDone={() => { setSwitchTo(null); void refresh(); }} /> : null}
    </div>
  );
}

/** Stripe's embedded Checkout, mounted in this page. Stripe.js comes from js.stripe.com, allowed only on billing pages
 * (the server's BILLING_CSP); arriving here by an in-app link keeps the page's earlier policy, so a reload is offered. */
function EmbeddedCheckout({ fetchSecret, onClose }: { fetchSecret: () => Promise<string>; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let instance: StripeEmbeddedCheckout | null = null;
    let cancelled = false;
    (async () => {
      try {
        const cfg = await get<{ enabled: boolean; publishableKey?: string }>('/api/billing/config');
        if (!cfg.enabled || !cfg.publishableKey) throw new Error('Billing is not available yet.');
        const { loadStripe } = await import('@stripe/stripe-js/pure');
        const stripe = await loadStripe(cfg.publishableKey).catch(() => null);
        if (!stripe) throw new Error('reload');
        instance = await stripe.createEmbeddedCheckoutPage({ fetchClientSecret: fetchSecret });
        if (cancelled) {
          instance.destroy();
          return;
        }
        if (ref.current) instance.mount(ref.current);
      } catch (e) {
        setError(e instanceof Error && e.message === 'reload' ? 'reload' : errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);
  return (
    <div className="billing-checkout stack">
      {loading ? <Loading label="Opening Stripe’s secure payment form…" /> : null}
      {error ? (
        error === 'reload' ? (
          <p className="billing-banner warning">Stripe’s payment form could not load on this page. <a href={location.href}>Reload the page</a> and try again.</p>
        ) : <p className="billing-banner warning">{error}</p>
      ) : null}
      <div ref={ref} className="billing-checkout-frame" />
      <div className="row"><button className="btn" onClick={onClose}>Close</button></div>
    </div>
  );
}

function NextInvoice({ path }: { path: string }) {
  const q = useQuery({ queryKey: ['billing-preview', path], queryFn: () => get<{ preview: Preview | null; note?: string; error?: string }>(`${path}/preview`) });
  if (q.error) return null;
  if (!q.data) return <Loading label="Asking Stripe for the next invoice…" />;
  if (!q.data.preview) return q.data.note || q.data.error ? <p className="small muted">{q.data.note ?? `The next invoice could not be estimated: ${q.data.error}`}</p> : null;
  const p = q.data.preview;
  return (
    <div className="billing-preview stack">
      <h3 className="crm-subhead">Estimated next invoice</h3>
      <p><strong>{aud(p.amountDue, p.currency)}</strong>{p.nextPaymentAttempt ? <span className="muted"> on {day(p.nextPaymentAttempt)}</span> : null}</p>
      <ul className="small billing-notes">
        {p.lines.map((l, n) => <li key={n}>{l.description}: {aud(l.amount, p.currency)}{l.proration ? ' (proration for a change during the period)' : ''}</li>)}
        <li>GST: {aud(p.tax, p.currency)}</li>
      </ul>
      <p className="small muted">An estimate from Stripe for the company’s users today. People joining or leaving before then change it.</p>
    </div>
  );
}

function SwitchInterval({ path, to, onClose, onDone }: { path: string; to: Interval; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const q = useQuery({ queryKey: ['billing-switch', path, to], queryFn: () => post<{ preview: Preview; quantity: number; price: PriceView }>(`${path}/interval/preview`, { interval: to }) });
  const [busy, setBusy] = useState(false);
  const apply = async () => {
    setBusy(true);
    try {
      await post(`${path}/interval`, { interval: to });
      toast(`Billing changed to ${to === 'year' ? 'annual' : 'monthly'}`);
      onDone();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`Switch to ${to === 'year' ? 'annual' : 'monthly'} billing`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Keep as it is</button><button className="btn primary" disabled={busy || !q.data} onClick={apply}>Switch</button></>}>
      {q.error ? <ErrorBox error={q.error} /> : !q.data ? <Loading label="Asking Stripe what the change costs…" /> : (
        <div className="stack">
          <p>{q.data.quantity} {q.data.quantity === 1 ? 'user' : 'users'} at {q.data.price.display}.</p>
          <p>Stripe’s calculation of the next invoice after the switch: <strong>{aud(q.data.preview.amountDue, q.data.preview.currency)}</strong>, including any credit for the unused part of the current period.</p>
          <ul className="small billing-notes">{q.data.preview.lines.map((l, n) => <li key={n}>{l.description}: {aud(l.amount, q.data!.preview.currency)}</li>)}</ul>
        </div>
      )}
    </Modal>
  );
}

/** Links into billing load a full page so the billing page's security policy (which allows Stripe) applies. */
export const billingHref = (companyId: string) => appUrl(`/c/${encodeURIComponent(companyId)}/billing`);
