// The ERP console's Billing tab (/erp/admin/billing, platform admins; changes are the founder's). Whether billing is on
// and why not (never a key), the per-user prices as Stripe defines them, who may subscribe, enforcement, grants,
// subscriptions, webhook events that failed, and reconciliation with Stripe.
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post, put } from '../../lib/api';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { aud } from './Billing';
import '../../styles/billing.css';

interface Overview {
  config: { enabled: true; environment: 'test' | 'live'; keyKind: 'rk' | 'sk'; webhookSecrets: number; proration: string; automaticTax: boolean; graceDays: number; annualOffered: boolean } | { enabled: false; environment: string | null; reason: string };
  settings: { audience: 'off' | 'admins' | 'everyone'; enforcement: 'off' | 'shadow' | 'on' };
  /** Free mode: BIZOMAT_BILLING_LOCK is set on the server. */
  locked?: boolean;
  prices: Record<'month' | 'year', any> | null;
  handledEvents: string[];
  companies: { company_id: string; company: string | null; environment: string; status: string; interval: string | null; quantity: number; billable: number; cancel_at_period_end: number; current_period_end: number | null; synced_at: number }[];
  events: { status: string; n: number }[];
  problems: { id: string; type: string; status: string; attempts: number; last_error: string | null; received_at: number }[];
  seatFailures: { company_id: string; company: string | null; from_quantity: number; to_quantity: number; error: string | null; created_at: number }[];
  grants: { id: string; company_id: string; company: string | null; kind: string; reason: string; starts_at: number; ends_at: number | null; revoked_at: number | null; granted_by: string | null }[];
  shadow: { company_id: string; company: string | null; writes: number }[];
}

const AUDIENCE = { off: 'Nobody (closed)', admins: 'Platform admins only (testing)', everyone: 'Every company owner and administrator' };
const ENFORCEMENT = { off: 'Off: nothing is refused', shadow: 'Shadow: nothing is refused, unpaid writes are counted', on: 'On: unpaid registered companies can read but not change records' };
const when = (ms: number | null) => (ms ? new Date(ms).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }) : '');

export function BillingAdmin({ founder }: { founder: boolean }) {
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['admin-billing'], queryFn: () => get<Overview>('/api/admin/billing/overview') });
  const [grant, setGrant] = useState({ companyId: '', kind: 'founding', reason: '', ends: '' });
  const [busy, setBusy] = useState(false);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const o = q.data;
  const run = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await fn();
      toast(done);
      await qc.invalidateQueries({ queryKey: ['admin-billing'] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const setSetting = (key: 'audience' | 'enforcement', value: string) => {
    if (key === 'enforcement' && value === 'on' && !confirm('Turn enforcement on? Registered companies without an active subscription or a grant will no longer be able to change their records (they can still read them).')) return;
    void run(() => put('/api/admin/billing/settings', { [key]: value }), 'Saved');
  };
  return (
    <div className="stack billing-page">
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Status</h2>
        {o.config.enabled ? (
          <dl className="billing-facts">
            <dt>Billing</dt><dd><span className="badge success">On</span> Stripe {o.config.environment === 'live' ? 'live' : 'test'} mode</dd>
            <dt>API key</dt><dd>{o.config.keyKind === 'rk' ? 'Restricted key (recommended)' : 'Secret key: replace it with a restricted key'}</dd>
            <dt>Webhook signing secrets</dt><dd>{o.config.webhookSecrets}</dd>
            <dt>Seat changes</dt><dd>{o.config.proration}</dd>
            <dt>GST (Stripe Tax)</dt><dd>{o.config.automaticTax ? 'Calculated by Stripe' : 'Off until BIZOMAT’s GST registration is recorded in Stripe'}</dd>
            <dt>Grace after a failed payment</dt><dd>{o.config.graceDays} days</dd>
          </dl>
        ) : (
          <p><span className="badge">Off</span> {o.config.reason}</p>
        )}
        {o.prices ? (
          <div className="stack">
            {(['month', 'year'] as const).map((i) => {
              const p = o.prices![i];
              if (!p) return <p key={i} className="small muted">{i === 'month' ? 'Monthly' : 'Annual'} price: not configured.</p>;
              if (p.error) return <p key={i} className="billing-banner warning">{i === 'month' ? 'Monthly' : 'Annual'} price could not be read: {p.error}</p>;
              return <p key={i} className={p.ok ? 'small' : 'billing-banner warning'}>{i === 'month' ? 'Monthly' : 'Annual'} price {p.id}: {p.unitAmount ? aud(p.unitAmount, p.currency) : ''} per user, tax {p.taxBehavior ?? 'not set'}{p.productName ? `, product "${p.productName}"` : ''}. {p.ok ? 'Checked with Stripe.' : p.problem}</p>;
            })}
            <div className="row"><button className="btn" disabled={busy} onClick={() => run(() => post('/api/admin/billing/prices/verify', {}), 'Prices checked with Stripe')}>Check prices with Stripe again</button></div>
          </div>
        ) : null}
      </section>

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Switches {founder ? '' : '(the founder changes these)'}</h2>
        {o.locked ? <p className="billing-banner info">Free mode: billing is locked on the server (BIZOMAT_BILLING_LOCK). Nobody can subscribe or be refused for not paying, whatever these switches say, and they cannot be turned on. The Stripe settings and webhook stay as they are.</p> : null}
        <label className="field">
          <span>Who may start a subscription</span>
          <select value={o.settings.audience} disabled={!founder || busy || !!o.locked} onChange={(e) => setSetting('audience', e.target.value)}>
            {Object.entries(AUDIENCE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Enforcement</span>
          <select value={o.settings.enforcement} disabled={!founder || busy || !!o.locked} onChange={(e) => setSetting('enforcement', e.target.value)}>
            {Object.entries(ENFORCEMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <p className="small muted">Never paid for: the example company, people’s own unregistered companies, CAD Automation and the public Resources. Company administration and billing stay open in every mode, and billing never hides or deletes records.</p>
      </section>

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Subscriptions</h2>
        {o.companies.length ? (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Company</th><th>Mode</th><th>Status</th><th>Frequency</th><th>Billed users</th><th>Members now</th><th>Period ends</th><th>Read from Stripe</th></tr></thead>
              <tbody>{o.companies.map((s, n) => (
                <tr key={n}>
                  <td data-label="Company">{s.company ?? s.company_id}</td><td data-label="Mode">{s.environment}</td><td data-label="Status">{s.status}{s.cancel_at_period_end ? ' (ends at period end)' : ''}</td>
                  <td data-label="Frequency">{s.interval ?? ''}</td><td data-label="Billed users">{s.quantity}</td><td data-label="Members now">{s.billable}{s.billable !== s.quantity && ['active', 'trialing', 'past_due', 'unpaid'].includes(s.status) ? ' (to update)' : ''}</td>
                  <td data-label="Period ends">{when(s.current_period_end)}</td><td data-label="Read from Stripe">{when(s.synced_at)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="muted">No subscriptions yet.</p>}
        {founder && o.config.enabled ? <div className="row"><button className="btn" disabled={busy} onClick={() => run(() => post('/api/admin/billing/reconcile', {}), 'Reconciled with Stripe')}>Reconcile with Stripe now</button></div> : null}
      </section>

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Webhook events</h2>
        <p className="small muted">{o.events.length ? o.events.map((e) => `${e.status}: ${e.n}`).join(' · ') : 'None received yet.'} Subscribe the Stripe webhook destination to: {o.handledEvents.join(', ')}.</p>
        {o.problems.length ? (
          <ul className="billing-history">{o.problems.map((p) => (
            <li key={p.id}><strong>{p.type}</strong> {p.status} after {p.attempts} {p.attempts === 1 ? 'try' : 'tries'}: {p.last_error ?? ''} <span className="muted small">{when(p.received_at)}</span>{founder ? <> <button className="btn small" disabled={busy} onClick={() => run(() => post(`/api/admin/billing/events/${encodeURIComponent(p.id)}/reprocess`, {}), 'Processed again')}>Process again</button></> : null}</li>
          ))}</ul>
        ) : null}
        {o.seatFailures.length ? (
          <ul className="billing-history">{o.seatFailures.map((f, n) => <li key={n}>Seat change for {f.company ?? f.company_id} from {f.from_quantity} to {f.to_quantity} failed: {f.error} <span className="muted small">{when(f.created_at)}</span></li>)}</ul>
        ) : null}
      </section>

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Grants (free access)</h2>
        {o.grants.length ? (
          <ul className="billing-history">{o.grants.map((g) => (
            <li key={g.id}>{g.company ?? g.company_id}: {g.kind}, {g.reason}{g.ends_at ? `, until ${when(g.ends_at)}` : ', no end date'}{g.revoked_at ? ` (revoked ${when(g.revoked_at)})` : ''} <span className="muted small">by {g.granted_by ?? 'unknown'}</span>{founder && !g.revoked_at ? <> <button className="btn small" disabled={busy} onClick={() => run(() => post(`/api/admin/billing/grants/${encodeURIComponent(g.id)}/revoke`, {}), 'Grant revoked')}>Revoke</button></> : null}</li>
          ))}</ul>
        ) : <p className="muted">No grants.</p>}
        {founder ? (
          <form className="row wrap" onSubmit={(e) => { e.preventDefault(); void run(() => post('/api/admin/billing/grants', { companyId: grant.companyId.trim(), kind: grant.kind, reason: grant.reason, endsAt: grant.ends ? new Date(`${grant.ends}T23:59:59`).getTime() : null }), 'Grant added').then(() => setGrant({ companyId: '', kind: 'founding', reason: '', ends: '' })); }}>
            <input className="input" placeholder="Registered company id" value={grant.companyId} onChange={(e) => setGrant({ ...grant, companyId: e.target.value })} required />
            <select value={grant.kind} onChange={(e) => setGrant({ ...grant, kind: e.target.value })}><option value="founding">Founding</option><option value="comp">Complimentary</option><option value="manual">Other</option></select>
            <input className="input" placeholder="Reason" value={grant.reason} onChange={(e) => setGrant({ ...grant, reason: e.target.value })} required minLength={3} />
            <input className="input" type="date" aria-label="Ends on (optional)" value={grant.ends} onChange={(e) => setGrant({ ...grant, ends: e.target.value })} />
            <button className="btn" disabled={busy}>Add grant</button>
          </form>
        ) : null}
        {o.shadow.length ? <p className="small muted">Shadow counts, last 30 days (writes "on" would refuse): {o.shadow.map((s) => `${s.company ?? s.company_id} ${s.writes}`).join(' · ')}</p> : null}
      </section>
    </div>
  );
}
