// Keeps BIZOMAT's billing records in step with Stripe. Every event or request is treated as "read this object from
// Stripe now and record it", so events may arrive late, twice or out of order (Stripe does not promise an order): the
// record always ends at Stripe's current state. Objects are matched to a company through Stripe's own links (the
// subscription's or invoice's customer), never through metadata.

import type { Env } from '../env';
import { now } from '../lib/util';
import type { BillingOn, Interval } from './config';
import { accountByCustomer, historyStmt, money, type AccountRow, type SubscriptionRow } from './store';
import { BillingError, checkMode, idOf, ms, stripeFor, type Stripe } from './stripe';

const STATUS_WORDS: Record<string, string> = {
  active: 'active',
  trialing: 'in its trial',
  past_due: 'past due: a payment failed and Stripe is retrying it',
  unpaid: 'unpaid: Stripe stopped retrying the payment',
  canceled: 'cancelled',
  incomplete: 'waiting for the first payment',
  incomplete_expired: 'not started: the first payment was not completed',
  paused: 'paused',
};

export const statusWords = (s: string) => STATUS_WORDS[s] ?? s;

/** The subscription's seat item: the item on one of the configured per-user prices, else the first item. */
function seatItem(cfg: BillingOn, sub: Stripe.Subscription): Stripe.SubscriptionItem | null {
  const items = sub.items?.data ?? [];
  const ours = new Set(Object.values(cfg.prices));
  return items.find((i) => ours.has(i.price?.id)) ?? items[0] ?? null;
}

/** Records a subscription Stripe returned. Returns the stored row, or null when its customer is not a BIZOMAT company. */
export async function applySubscription(env: Env, cfg: BillingOn, sub: Stripe.Subscription): Promise<SubscriptionRow | null> {
  checkMode(cfg, sub);
  const db = env.DB;
  const customerId = idOf(sub.customer as any);
  const account = customerId ? await accountByCustomer(db, customerId) : null;
  if (!account || account.environment !== cfg.environment) return null;
  const item = seatItem(cfg, sub);
  const price = item?.price;
  const interval = (price?.recurring?.interval === 'year' ? 'year' : price?.recurring?.interval === 'month' ? 'month' : null) as Interval | null;
  const pm = typeof sub.default_payment_method === 'object' && sub.default_payment_method ? (sub.default_payment_method as Stripe.PaymentMethod) : null;
  const card = pm?.card ?? null;
  const existing = await db.prepare('SELECT * FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<SubscriptionRow>();
  const t = now();
  const behind = sub.status === 'past_due' || sub.status === 'unpaid';
  const pastDueSince = behind ? (existing?.past_due_since ?? t) : null;
  const row = {
    status: sub.status,
    item_id: item?.id ?? null,
    price_id: price?.id ?? null,
    interval,
    quantity: Math.max(0, item?.quantity ?? 0),
    unit_amount: price?.unit_amount ?? null,
    currency: price?.currency ?? null,
    tax_behavior: price?.tax_behavior ?? null,
    current_period_start: ms(item?.current_period_start),
    current_period_end: ms(item?.current_period_end),
    cancel_at_period_end: sub.cancel_at_period_end ? 1 : 0,
    cancel_at: ms(sub.cancel_at),
    canceled_at: ms(sub.canceled_at),
    ended_at: ms(sub.ended_at),
    trial_end: ms(sub.trial_end),
    past_due_since: pastDueSince,
    latest_invoice_id: idOf(sub.latest_invoice as any),
    pm_brand: card?.brand ?? (pm ? pm.type : existing?.pm_brand ?? null),
    pm_last4: card?.last4 ?? (pm ? null : existing?.pm_last4 ?? null),
    pm_exp_month: card?.exp_month ?? (pm ? null : existing?.pm_exp_month ?? null),
    pm_exp_year: card?.exp_year ?? (pm ? null : existing?.pm_exp_year ?? null),
    stripe_created: ms(sub.created),
  };
  const stmts = [
    db
      .prepare(
        `INSERT INTO billing_subscriptions (id, account_id, company_id, environment, status, item_id, price_id, interval, quantity, seat_version, unit_amount, currency, tax_behavior,
           current_period_start, current_period_end, cancel_at_period_end, cancel_at, canceled_at, ended_at, trial_end, past_due_since, latest_invoice_id,
           pm_brand, pm_last4, pm_exp_month, pm_exp_year, stripe_created, synced_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET status = excluded.status, item_id = excluded.item_id, price_id = excluded.price_id, interval = excluded.interval,
           quantity = excluded.quantity, unit_amount = excluded.unit_amount, currency = excluded.currency, tax_behavior = excluded.tax_behavior,
           current_period_start = excluded.current_period_start, current_period_end = excluded.current_period_end,
           cancel_at_period_end = excluded.cancel_at_period_end, cancel_at = excluded.cancel_at, canceled_at = excluded.canceled_at,
           ended_at = excluded.ended_at, trial_end = excluded.trial_end, past_due_since = excluded.past_due_since,
           latest_invoice_id = excluded.latest_invoice_id, pm_brand = excluded.pm_brand, pm_last4 = excluded.pm_last4,
           pm_exp_month = excluded.pm_exp_month, pm_exp_year = excluded.pm_exp_year, synced_at = excluded.synced_at`,
      )
      .bind(
        sub.id, account.id, account.company_id, account.environment, row.status, row.item_id, row.price_id, row.interval, row.quantity,
        row.unit_amount, row.currency, row.tax_behavior, row.current_period_start, row.current_period_end, row.cancel_at_period_end,
        row.cancel_at, row.canceled_at, row.ended_at, row.trial_end, row.past_due_since, row.latest_invoice_id,
        row.pm_brand, row.pm_last4, row.pm_exp_month, row.pm_exp_year, row.stripe_created, t, existing?.created_at ?? t,
      ),
  ];
  const h = (kind: string, summary: string, ref: string) => stmts.push(historyStmt(db, { companyId: account.company_id, environment: account.environment, kind, summary, ref }));
  // Two runs reading the same stored row write the same ref, so a change is recorded once.
  const prevKey = `${existing?.status ?? 'new'}:${existing?.synced_at ?? 0}`;
  if (!existing || existing.status !== sub.status) {
    const users = `${row.quantity} ${row.quantity === 1 ? 'user' : 'users'}`;
    h(`subscription.${sub.status}`.slice(0, 40), !existing ? `Subscription started for ${users}, ${interval === 'year' ? 'billed annually' : 'billed monthly'}. It is ${statusWords(sub.status)}.` : `Subscription is now ${statusWords(sub.status)}.`, `${sub.id}:${prevKey}`);
  }
  if (existing && existing.cancel_at_period_end !== row.cancel_at_period_end) {
    h(row.cancel_at_period_end ? 'subscription.cancel_scheduled' : 'subscription.cancel_withdrawn', row.cancel_at_period_end ? `Cancellation scheduled: the subscription ends on ${new Date(row.cancel_at ?? row.current_period_end ?? t).toISOString().slice(0, 10)}.` : 'Cancellation withdrawn: the subscription continues.', `${sub.id}:cancel:${prevKey}`);
  }
  if (existing && existing.interval && interval && existing.interval !== interval) {
    h('subscription.interval', `Billing frequency changed to ${interval === 'year' ? 'annual' : 'monthly'}.`, `${sub.id}:interval:${prevKey}`);
  }
  await db.batch(stmts);
  return db.prepare('SELECT * FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<SubscriptionRow>();
}

export async function syncSubscription(env: Env, cfg: BillingOn, id: string): Promise<SubscriptionRow | null> {
  const sub = await stripeFor(cfg).subscriptions.retrieve(id, { expand: ['default_payment_method'] });
  return applySubscription(env, cfg, sub);
}

function invoiceSubscription(inv: Stripe.Invoice): string | null {
  return idOf((inv.parent as any)?.subscription_details?.subscription ?? null);
}

/** Records an invoice Stripe returned (and the history line for a payment or a failed payment). */
export async function applyInvoice(env: Env, cfg: BillingOn, inv: Stripe.Invoice): Promise<AccountRow | null> {
  checkMode(cfg, inv);
  const db = env.DB;
  const customerId = idOf(inv.customer as any);
  const account = customerId ? await accountByCustomer(db, customerId) : null;
  if (!account || account.environment !== cfg.environment || !inv.id) return null;
  const tax = (inv.total_taxes ?? []).reduce((s, t) => s + (t.amount ?? 0), 0);
  const t = now();
  const paidAt = ms(inv.status_transitions?.paid_at);
  const stmts = [
    db
      .prepare(
        `INSERT INTO billing_invoices (id, account_id, company_id, environment, subscription_id, number, status, billing_reason, currency, subtotal, tax, total,
           amount_due, amount_paid, amount_remaining, period_start, period_end, hosted_invoice_url, invoice_pdf, stripe_created, paid_at, synced_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET subscription_id = excluded.subscription_id, number = excluded.number, status = excluded.status,
           billing_reason = excluded.billing_reason, subtotal = excluded.subtotal, tax = excluded.tax, total = excluded.total,
           amount_due = excluded.amount_due, amount_paid = excluded.amount_paid, amount_remaining = excluded.amount_remaining,
           period_start = excluded.period_start, period_end = excluded.period_end, hosted_invoice_url = excluded.hosted_invoice_url,
           invoice_pdf = excluded.invoice_pdf, paid_at = excluded.paid_at, synced_at = excluded.synced_at`,
      )
      .bind(
        inv.id, account.id, account.company_id, account.environment, invoiceSubscription(inv), inv.number ?? null, inv.status ?? 'draft', inv.billing_reason ?? null,
        inv.currency, inv.subtotal ?? 0, tax, inv.total ?? 0, inv.amount_due ?? 0, inv.amount_paid ?? 0, inv.amount_remaining ?? 0,
        ms(inv.period_start), ms(inv.period_end), inv.hosted_invoice_url ?? null, inv.invoice_pdf ?? null, ms(inv.created) ?? t, paidAt, t,
      ),
  ];
  const label = inv.number ? `Invoice ${inv.number}` : 'An invoice';
  if (inv.status === 'paid' && (inv.amount_paid ?? 0) > 0) {
    stmts.push(historyStmt(db, { companyId: account.company_id, environment: account.environment, kind: 'invoice.paid', summary: `${label} paid: ${money(inv.amount_paid, inv.currency)}.`, ref: inv.id }));
  } else if (inv.status === 'paid') {
    stmts.push(historyStmt(db, { companyId: account.company_id, environment: account.environment, kind: 'invoice.paid', summary: `${label} closed with nothing to pay.`, ref: inv.id }));
  }
  if (inv.status === 'open' && (inv.attempt_count ?? 0) > 0) {
    stmts.push(historyStmt(db, { companyId: account.company_id, environment: account.environment, kind: 'invoice.payment_failed', summary: `Payment of ${label.toLowerCase()} (${money(inv.amount_remaining, inv.currency)}) failed, attempt ${inv.attempt_count}. Stripe will retry it; update the payment method if the card has changed.`, ref: `${inv.id}:${inv.attempt_count}` }));
  }
  if (inv.status === 'uncollectible' || inv.status === 'void') {
    stmts.push(historyStmt(db, { companyId: account.company_id, environment: account.environment, kind: `invoice.${inv.status}`, summary: `${label} was ${inv.status === 'void' ? 'voided' : 'marked uncollectible'} in Stripe.`, ref: inv.id }));
  }
  await db.batch(stmts);
  return account;
}

export async function syncInvoice(env: Env, cfg: BillingOn, id: string): Promise<void> {
  const inv = await stripeFor(cfg).invoices.retrieve(id);
  const account = await applyInvoice(env, cfg, inv);
  const subId = account ? invoiceSubscription(inv) : null;
  if (subId) await syncSubscription(env, cfg, subId);
}

/** A finished embedded Checkout: the new subscription is recorded, or the saved payment method becomes the default
 * for the customer's invoices and for the subscription (Stripe retries a failed payment with the subscription's own
 * default, so both are set). Returns the session's status. */
export async function syncCheckoutSession(env: Env, cfg: BillingOn, id: string): Promise<{ status: string; mode: string; companyId: string | null }> {
  const stripe = stripeFor(cfg);
  const session = checkMode(cfg, await stripe.checkout.sessions.retrieve(id));
  const db = env.DB;
  const customerId = idOf(session.customer as any);
  const account = customerId ? await accountByCustomer(db, customerId) : null;
  if (!account || account.environment !== cfg.environment) return { status: session.status ?? 'open', mode: session.mode, companyId: null };
  const t = now();
  const status = session.status ?? 'open';
  if (status === 'complete' && session.mode === 'subscription') {
    const subId = idOf(session.subscription as any);
    if (subId) await syncSubscription(env, cfg, subId);
    await db.prepare("UPDATE billing_checkout_sessions SET status = 'complete', subscription_id = ?, completed_at = COALESCE(completed_at, ?) WHERE id = ?").bind(subId, t, id).run();
  } else if (status === 'complete' && session.mode === 'setup') {
    const setupId = idOf(session.setup_intent as any);
    const row = await db.prepare('SELECT status FROM billing_checkout_sessions WHERE id = ?').bind(id).first<{ status: string }>();
    if (setupId && row?.status !== 'complete') {
      const intent = checkMode(cfg, await stripe.setupIntents.retrieve(setupId));
      const pmId = idOf(intent.payment_method as any);
      if (pmId) {
        await stripe.customers.update(account.stripe_customer_id, { invoice_settings: { default_payment_method: pmId } }, { idempotencyKey: `pm-customer:${id}` });
        const sub = await db
          .prepare("SELECT * FROM billing_subscriptions WHERE company_id = ? AND environment = ? AND status IN ('active','trialing','past_due','unpaid','incomplete','paused') ORDER BY created_at DESC LIMIT 1")
          .bind(account.company_id, account.environment)
          .first<SubscriptionRow>();
        if (sub) {
          const updated = await stripe.subscriptions.update(sub.id, { default_payment_method: pmId, expand: ['default_payment_method'] }, { idempotencyKey: `pm-subscription:${id}` });
          await applySubscription(env, cfg, updated);
          // A payment that failed is tried again at once with the new method (Stripe would otherwise wait for its next retry).
          if ((updated.status === 'past_due' || updated.status === 'unpaid') && updated.latest_invoice) {
            const invId = idOf(updated.latest_invoice as any)!;
            try {
              const inv = await stripe.invoices.retrieve(invId);
              if (inv.status === 'open') await stripe.invoices.pay(invId, { payment_method: pmId }, { idempotencyKey: `pm-pay:${id}` });
              await syncInvoice(env, cfg, invId);
            } catch {
              await historyStmt(db, { companyId: account.company_id, environment: account.environment, kind: 'invoice.retry_failed', summary: 'The open invoice could not be paid with the new payment method yet. Stripe will retry it.', ref: `${id}:retry` }).run();
            }
          }
        }
        await historyStmt(db, { companyId: account.company_id, environment: account.environment, kind: 'payment_method.updated', summary: 'Payment method updated.', ref: id }).run();
      }
    }
    await db.prepare("UPDATE billing_checkout_sessions SET status = 'complete', completed_at = COALESCE(completed_at, ?) WHERE id = ?").bind(t, id).run();
  } else if (status === 'expired') {
    await db.prepare("UPDATE billing_checkout_sessions SET status = 'expired' WHERE id = ? AND status = 'open'").bind(id).run();
  }
  return { status, mode: session.mode, companyId: account.company_id };
}

/** Risk events (refunds, disputes, early fraud warnings) are recorded on the company's history so they are seen; the
 * decision (refund, respond to a dispute) is made by the owner in Stripe. */
export async function recordRiskEvent(env: Env, cfg: BillingOn, type: string, obj: { id: string; customer?: unknown; charge?: unknown; amount?: number; currency?: string; amount_refunded?: number }): Promise<boolean> {
  const stripe = stripeFor(cfg);
  let customerId = idOf(obj.customer as any);
  if (!customerId && obj.charge) {
    const charge = checkMode(cfg, await stripe.charges.retrieve(idOf(obj.charge as any)!));
    customerId = idOf(charge.customer as any);
  }
  const account = customerId ? await accountByCustomer(env.DB, customerId) : null;
  if (!account || account.environment !== cfg.environment) return false;
  const words: Record<string, string> = {
    'charge.refunded': `A payment was refunded${typeof obj.amount_refunded === 'number' ? ` (${money(obj.amount_refunded, obj.currency)})` : ''}.`,
    'charge.dispute.created': 'The card holder disputed a payment. BIZOMAT will respond through Stripe.',
    'charge.dispute.closed': 'A disputed payment was closed in Stripe.',
    'radar.early_fraud_warning.created': 'The card issuer warned of possible fraud on a payment. BIZOMAT is reviewing it in Stripe.',
  };
  await historyStmt(env.DB, { companyId: account.company_id, environment: account.environment, kind: type.slice(0, 40), summary: words[type] ?? type, ref: obj.id }).run();
  return true;
}

export { BillingError };
