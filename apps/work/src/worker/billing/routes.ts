// The company billing API (signed in, /api/billing), used by the billing page in BIZOMAT ERP Administration
// (/erp/c/<company>/billing). Only the owner and administrators of a registered company see or change its billing;
// actions that spend or change money need a signed-in browser session (an API token gets 403).

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { atLeast, loadAccess, type CompanyAccess } from '../company/access';
import { ERP_MOUNT } from '../mount';
import { body, HttpError, newId, now } from '../lib/util';
import { getPlatformRole } from '../services/platform-admin';
import { billingConfig, billingLocked, FREE_MESSAGE, type BillingOn, type Interval } from './config';
import { companyEntitled } from './entitlements';
import { accountOf, audience, currentSubscription, enforcement, historyStmt, money, OPEN_STATUSES, verifiedPrice, type AccountRow, type SubscriptionRow } from './store';
import { billablePeople, notBilled, prorationWords, syncSeats } from './seats';
import { BillingError, checkMode, idOf, ms, stripeFor, stripeMessage, type Stripe, type VerifiedPrice } from './stripe';
import { applySubscription, statusWords, syncCheckoutSession } from './sync';

export const billingRoutes = new Hono<AppEnv>();

// Tags BIZOMAT's Checkout sessions in Stripe's Dashboard (Stripe asks for a label with eight random letters at the end).
const INTEGRATION_ID = 'bizomat-erp-seats-qvkzrtwm';

const intervalSchema = z.object({ interval: z.enum(['month', 'year']) });

/** Billing settings for a change that involves Stripe. In free mode (billingLocked) every such change is refused with
 * 403 BILLING_LOCKED, for everyone, platform admins included; only cancelling an existing subscription stays possible,
 * because it can only stop charges. */
function on(c: Context<AppEnv>, opts: { evenWhenLocked?: boolean } = {}): BillingOn {
  if (billingLocked(c.env) && !opts.evenWhenLocked) throw new HttpError(403, FREE_MESSAGE, { code: 'BILLING_LOCKED' });
  const cfg = billingConfig(c.env);
  if (!cfg.enabled) throw new HttpError(503, 'Billing is not available yet.', { code: 'BILLING_OFF' });
  return cfg;
}

/** A registered company the caller may manage billing for (owner or administrator). */
async function manage(c: Context<AppEnv>, opts: { money?: boolean } = {}): Promise<CompanyAccess> {
  const a = await loadAccess(c.env.DB, c.req.param('company') ?? '', c.get('user'));
  if (!atLeast(a.role, 'admin')) throw new HttpError(403, 'Only the company owner and administrators can see and change billing.');
  if (opts.money && c.get('authKind') !== 'session') throw new HttpError(403, 'Billing changes are made in the browser, not with an API token.');
  return a;
}

/** The public address of a billing page (Stripe returns the person there after Checkout). */
function billingPage(c: Context<AppEnv>, companyId: string, query: string): string {
  const origin = new URL(c.env.APP_URL || c.req.url).origin;
  return `${origin}${ERP_MOUNT}/c/${encodeURIComponent(companyId)}/billing?${query}`;
}

function priceView(p: VerifiedPrice | null, cfg: BillingOn) {
  if (!p) return null;
  const per = p.interval === 'year' ? 'per user per year' : 'per user per month';
  const gst =
    p.taxBehavior === 'inclusive'
      ? 'GST is included in this price.'
      : p.taxBehavior === 'exclusive'
        ? 'GST is added to this price where it applies.'
        : 'How GST applies to this price is being confirmed. Subscriptions open once it is.';
  return {
    interval: p.interval,
    ok: p.ok,
    problem: p.problem,
    unitAmount: p.unitAmount,
    currency: p.currency,
    taxBehavior: p.taxBehavior,
    productName: p.productName,
    display: p.unitAmount ? `${money(p.unitAmount, p.currency ?? 'aud')} ${per}` : '',
    gst,
    gstCalculated: cfg.automaticTax,
  };
}

function subView(s: SubscriptionRow | null) {
  if (!s) return null;
  return {
    id: s.id,
    status: s.status,
    statusWords: statusWords(s.status),
    interval: s.interval,
    quantity: s.quantity,
    unitAmount: s.unit_amount,
    currency: s.currency,
    taxBehavior: s.tax_behavior,
    currentPeriodStart: s.current_period_start,
    currentPeriodEnd: s.current_period_end,
    cancelAtPeriodEnd: s.cancel_at_period_end === 1,
    cancelAt: s.cancel_at,
    canceledAt: s.canceled_at,
    endedAt: s.ended_at,
    trialEnd: s.trial_end,
    pastDueSince: s.past_due_since,
    paymentMethod: s.pm_brand ? { brand: s.pm_brand, last4: s.pm_last4, expMonth: s.pm_exp_month, expYear: s.pm_exp_year } : null,
    syncedAt: s.synced_at,
  };
}

/** Whether this person may start a subscription for this company now, and if not, why. */
async function mayStart(c: Context<AppEnv>, cfg: BillingOn): Promise<{ ok: boolean; why: string | null }> {
  const who = await audience(c.env.DB);
  if (who === 'everyone') return { ok: true, why: null };
  if (who === 'admins') {
    const role = c.get('authKind') === 'session' ? await getPlatformRole(c.env.DB, c.get('user').id) : null;
    return role ? { ok: true, why: null } : { ok: false, why: 'Subscriptions are being tested by BIZOMAT and are not open to companies yet.' };
  }
  void cfg;
  return { ok: false, why: 'Subscriptions are not open yet.' };
}

billingRoutes.get('/config', async (c) => {
  const cfg = billingConfig(c.env);
  const role = c.get('authKind') === 'session' ? await getPlatformRole(c.env.DB, c.get('user').id) : null;
  if (billingLocked(c.env)) return c.json({ enabled: false, free: true, environment: cfg.environment, ...(role ? { reason: 'Free mode: BIZOMAT_BILLING_LOCK is set, so billing is locked.' } : {}) });
  if (!cfg.enabled) return c.json({ enabled: false, environment: cfg.environment, ...(role ? { reason: cfg.reason } : {}) });
  return c.json({ enabled: true, environment: cfg.environment, publishableKey: cfg.publishableKey });
});

/** Everything the billing page shows. Reads Stripe only for the price check (cached); the estimate is /preview. */
billingRoutes.get('/c/:company', async (c) => {
  const a = await manage(c);
  const db = c.env.DB;
  const cfg = billingConfig(c.env);
  const people = await billablePeople(db, a.companyId);
  const excluded = await notBilled(db, a.companyId);
  const platformRole = c.get('authKind') === 'session' ? await getPlatformRole(db, a.userId) : null;
  const base = {
    company: { id: a.company.id, name: a.company.name, legalName: a.company.legal_name, abn: a.company.abn, abnStatus: a.company.abn_status, gstFrom: a.company.abr_gst_from },
    role: a.role,
    seats: { count: people.length, people, ...excluded },
    enforcement: await enforcement(db),
  };
  if (billingLocked(c.env)) {
    // Free mode: no price, no way to subscribe. A subscription made before free mode (there were none on 19 Nov 2026)
    // is still shown, so nobody is charged without seeing it, and can be cancelled.
    const earlier = cfg.enabled ? await currentSubscription(db, a.companyId, cfg.environment) : null;
    return c.json({
      ...base,
      billing: { enabled: false, free: true, environment: cfg.environment, reason: platformRole ? 'Free mode: BIZOMAT_BILLING_LOCK is set, so billing is locked.' : null, canSubscribe: false, whyNot: FREE_MESSAGE },
      prices: { month: null, year: null },
      subscription: subView(earlier),
      invoices: [],
      history: [],
      explanations: null,
      entitled: { allowed: true, why: 'free' },
    });
  }
  if (!cfg.enabled) {
    return c.json({ ...base, billing: { enabled: false, environment: cfg.environment, reason: platformRole ? cfg.reason : null, canSubscribe: false, whyNot: 'Billing is not available yet.' }, prices: { month: null, year: null }, subscription: null, invoices: [], history: [], explanations: null, entitled: { allowed: true, why: 'off' } });
  }
  let month: VerifiedPrice | null = null;
  let year: VerifiedPrice | null = null;
  let priceError: string | null = null;
  try {
    month = await verifiedPrice(c.env, cfg, 'month');
    year = await verifiedPrice(c.env, cfg, 'year');
  } catch (e) {
    priceError = stripeMessage(e);
  }
  const sub = await currentSubscription(db, a.companyId, cfg.environment);
  const open = sub && (OPEN_STATUSES as readonly string[]).includes(sub.status);
  const openCount = await db.prepare(`SELECT COUNT(*) AS n FROM billing_subscriptions WHERE company_id = ? AND environment = ? AND status IN (${OPEN_STATUSES.map(() => '?').join(',')})`).bind(a.companyId, cfg.environment, ...OPEN_STATUSES).first<{ n: number }>();
  const start = await mayStart(c, cfg);
  const invoices = await db
    .prepare('SELECT id, number, status, billing_reason, currency, subtotal, tax, total, amount_due, amount_paid, amount_remaining, period_start, period_end, hosted_invoice_url, invoice_pdf, stripe_created, paid_at FROM billing_invoices WHERE company_id = ? AND environment = ? ORDER BY stripe_created DESC LIMIT 36')
    .bind(a.companyId, cfg.environment)
    .all();
  const history = await db
    .prepare('SELECT h.kind, h.summary, h.created_at, u.name AS actor FROM billing_history h LEFT JOIN users u ON u.id = h.actor_id WHERE h.company_id = ? AND h.environment = ? ORDER BY h.created_at DESC LIMIT 60')
    .bind(a.companyId, cfg.environment)
    .all();
  const blockers = [
    open ? 'This company already has a subscription.' : null,
    people.length === 0 ? 'Nobody in this company can be billed yet.' : null,
    !month?.ok ? 'The per-user price is not ready in Stripe yet.' : null,
    start.ok ? null : start.why,
  ].filter((x): x is string => !!x);
  return c.json({
    ...base,
    billing: {
      enabled: true,
      environment: cfg.environment,
      reason: null,
      canSubscribe: blockers.length === 0,
      whyNot: blockers[0] ?? null,
      duplicateSubscriptions: Number(openCount?.n ?? 0) > 1,
      priceError: platformRole ? priceError : priceError ? 'The price could not be checked with Stripe just now.' : null,
    },
    prices: { month: priceView(month, cfg), year: priceView(year, cfg) },
    subscription: subView(sub),
    invoices: invoices.results,
    history: history.results,
    explanations: {
      seatsAdded: prorationWords(cfg.proration, true),
      seatsRemoved: prorationWords(cfg.proration, false),
      gstCalculated: cfg.automaticTax
        ? 'Stripe calculates GST on each invoice from BIZOMAT’s GST registration recorded in Stripe.'
        : 'Stripe does not calculate GST on these invoices yet: tax calculation stays off until BIZOMAT’s GST registration is confirmed and recorded in Stripe. Invoices show the GST Stripe charged, which is none until then.',
    },
    entitled: await companyEntitled(c.env, a.companyId),
  });
});

/** The estimated next invoice, from Stripe (with any prorations from seat changes). */
billingRoutes.get('/c/:company/preview', async (c) => {
  const a = await manage(c);
  const cfg = on(c);
  const sub = await currentSubscription(c.env.DB, a.companyId, cfg.environment);
  const account = await accountOf(c.env.DB, a.companyId, cfg.environment);
  if (!sub || !account || !(OPEN_STATUSES as readonly string[]).includes(sub.status) || sub.status === 'incomplete') return c.json({ preview: null });
  if (sub.cancel_at_period_end) return c.json({ preview: null, note: 'The subscription ends at the end of this period, so there is no next invoice.' });
  try {
    const inv = checkMode(cfg, await stripeFor(cfg).invoices.createPreview({ customer: account.stripe_customer_id, subscription: sub.id }));
    return c.json({ preview: previewView(inv) });
  } catch (e) {
    return c.json({ preview: null, error: stripeMessage(e) });
  }
});

function previewView(inv: Stripe.Invoice) {
  const tax = (inv.total_taxes ?? []).reduce((s, t) => s + (t.amount ?? 0), 0);
  return {
    currency: inv.currency,
    subtotal: inv.subtotal,
    tax,
    total: inv.total,
    amountDue: inv.amount_due,
    periodStart: ms(inv.period_start),
    periodEnd: ms(inv.period_end),
    nextPaymentAttempt: ms(inv.next_payment_attempt),
    lines: (inv.lines?.data ?? []).slice(0, 20).map((l) => ({
      description: l.description ?? '',
      amount: l.amount,
      quantity: (l as any).quantity ?? null,
      proration: !!(l as any).parent?.subscription_item_details?.proration,
    })),
  };
}

/** The company's Stripe customer, made once (Stripe's idempotency key makes two concurrent first requests one). */
async function ensureAccount(c: Context<AppEnv>, cfg: BillingOn, a: CompanyAccess): Promise<AccountRow> {
  const db = c.env.DB;
  const existing = await accountOf(db, a.companyId, cfg.environment);
  if (existing) return existing;
  // Never an example company, whatever reached here (they are not registered companies, so this is a second lock).
  if (await db.prepare('SELECT 1 FROM sys_demo WHERE company_id = ?').bind(a.companyId).first()) throw new HttpError(409, 'The example company is never billed.', { code: 'EXAMPLE_COMPANY' });
  const co = a.company;
  const customer = checkMode(
    cfg,
    await stripeFor(cfg).customers.create(
      {
        name: co.legal_name || co.name,
        email: co.email,
        phone: co.phone || undefined,
        address: { line1: co.address_line1, line2: co.address_line2 || undefined, city: co.suburb, state: co.state, postal_code: co.postcode, country: 'AU' },
        preferred_locales: ['en-AU'],
        metadata: { bizomat_company_id: co.id },
        ...(co.abn ? { tax_id_data: [{ type: 'au_abn' as const, value: co.abn }] } : {}),
      },
      { idempotencyKey: `customer:${cfg.environment}:${co.id}` },
    ),
  );
  const t = now();
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO billing_accounts (id, company_id, environment, stripe_customer_id, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId(), co.id, cfg.environment, customer.id, a.userId, t, t),
  ]);
  const acc = await accountOf(db, a.companyId, cfg.environment);
  if (!acc) throw new HttpError(500, 'The billing account could not be recorded.');
  return acc;
}

billingRoutes.post('/c/:company/checkout', async (c) => {
  const a = await manage(c, { money: true });
  const cfg = on(c);
  const { interval } = await body(c, intervalSchema);
  const db = c.env.DB;
  const start = await mayStart(c, cfg);
  if (!start.ok) throw new HttpError(403, start.why ?? 'Subscriptions are not open yet.');
  const sub = await currentSubscription(db, a.companyId, cfg.environment);
  if (sub && (OPEN_STATUSES as readonly string[]).includes(sub.status)) throw new HttpError(409, 'This company already has a subscription. Change it on the billing page instead of starting another.', { code: 'SUBSCRIPTION_EXISTS' });
  let price: VerifiedPrice | null;
  try {
    price = await verifiedPrice(c.env, cfg, interval as Interval);
  } catch (e) {
    throw new HttpError(502, `Stripe could not be reached to check the price: ${stripeMessage(e)}`);
  }
  if (!price) throw new HttpError(400, interval === 'year' ? 'Annual billing is not offered yet.' : 'Monthly billing is not set up.');
  if (!price.ok) throw new HttpError(409, `The per-user price is not ready in Stripe: ${price.problem}`, { code: 'PRICE_NOT_READY' });
  // The seat count comes from the company's members, never from the browser.
  const quantity = (await billablePeople(db, a.companyId)).length;
  if (quantity < 1) throw new HttpError(409, 'Nobody in this company can be billed yet.');
  const stripe = stripeFor(cfg);
  try {
    const account = await ensureAccount(c, cfg, a);
    // The same company, frequency and number of users within the last day: the open session is shown again.
    const recent = await db
      .prepare("SELECT id FROM billing_checkout_sessions WHERE company_id = ? AND environment = ? AND mode = 'subscription' AND status = 'open' AND interval = ? AND quantity = ? AND created_at > ? ORDER BY created_at DESC LIMIT 1")
      .bind(a.companyId, cfg.environment, interval, quantity, now() - 23 * 3600_000)
      .first<{ id: string }>();
    if (recent) {
      const s = checkMode(cfg, await stripe.checkout.sessions.retrieve(recent.id));
      if (s.status === 'open' && s.client_secret) return c.json({ clientSecret: s.client_secret, sessionId: s.id, reused: true });
      await db.prepare('UPDATE billing_checkout_sessions SET status = ? WHERE id = ?').bind(s.status ?? 'expired', s.id).run();
    }
    // Any other open session for this company is closed, so only one can be completed.
    const others = await db.prepare("SELECT id FROM billing_checkout_sessions WHERE company_id = ? AND environment = ? AND mode = 'subscription' AND status = 'open'").bind(a.companyId, cfg.environment).all<{ id: string }>();
    for (const o of others.results) {
      try {
        await stripe.checkout.sessions.expire(o.id);
      } catch {
        // already completed or expired: the sync below records which
      }
      await db.prepare("UPDATE billing_checkout_sessions SET status = 'expired' WHERE id = ? AND status = 'open'").bind(o.id).run();
    }
    const session = checkMode(
      cfg,
      await stripe.checkout.sessions.create(
        {
          mode: 'subscription',
          ui_mode: 'embedded_page',
          customer: account.stripe_customer_id,
          line_items: [{ price: price.id, quantity }],
          return_url: billingPage(c, a.companyId, 'checkout={CHECKOUT_SESSION_ID}'),
          client_reference_id: a.companyId,
          subscription_data: { metadata: { bizomat_company_id: a.companyId } },
          customer_update: { address: 'auto', name: 'auto' },
          billing_address_collection: 'required',
          ...(cfg.automaticTax ? { automatic_tax: { enabled: true } } : {}),
          integration_identifier: INTEGRATION_ID,
          metadata: { bizomat_company_id: a.companyId },
        },
        // A double click within two minutes is the same request to Stripe.
        { idempotencyKey: `checkout:${cfg.environment}:${a.companyId}:${interval}:${quantity}:${Math.floor(Date.now() / 120_000)}` },
      ),
    );
    if (!session.client_secret) throw new BillingError('Stripe did not return an embedded Checkout session.', 'state');
    await db
      .prepare("INSERT OR IGNORE INTO billing_checkout_sessions (id, company_id, account_id, environment, mode, interval, quantity, status, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, 'subscription', ?, ?, 'open', ?, ?, ?)")
      .bind(session.id, a.companyId, account.id, cfg.environment, interval, quantity, a.userId, now(), ms(session.expires_at))
      .run();
    return c.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(502, `Stripe could not start checkout: ${stripeMessage(e)}`);
  }
});

/** The return page asks here; the server reads the session from Stripe itself (the browser's word grants nothing). */
billingRoutes.get('/c/:company/checkout/:session', async (c) => {
  const a = await manage(c);
  const cfg = on(c);
  const id = c.req.param('session');
  const row = await c.env.DB.prepare('SELECT id FROM billing_checkout_sessions WHERE id = ? AND company_id = ? AND environment = ?').bind(id, a.companyId, cfg.environment).first();
  if (!row) throw new HttpError(404, 'Checkout session not found');
  try {
    const r = await syncCheckoutSession(c.env, cfg, id);
    const sub = await currentSubscription(c.env.DB, a.companyId, cfg.environment);
    return c.json({ status: r.status, mode: r.mode, subscription: subView(sub) });
  } catch (e) {
    throw new HttpError(502, `Stripe could not be reached: ${stripeMessage(e)}`);
  }
});

/** Embedded Checkout in setup mode: the person saves a new payment method; the webhook (or the return page) makes it
 * the default for the subscription. */
billingRoutes.post('/c/:company/payment-method', async (c) => {
  const a = await manage(c, { money: true });
  const cfg = on(c);
  const db = c.env.DB;
  const account = await accountOf(db, a.companyId, cfg.environment);
  if (!account) throw new HttpError(409, 'This company has no billing account yet. Start a subscription first.');
  try {
    const session = checkMode(
      cfg,
      await stripeFor(cfg).checkout.sessions.create(
        {
          mode: 'setup',
          ui_mode: 'embedded_page',
          customer: account.stripe_customer_id,
          currency: 'aud',
          return_url: billingPage(c, a.companyId, 'setup={CHECKOUT_SESSION_ID}'),
          client_reference_id: a.companyId,
          setup_intent_data: { metadata: { bizomat_company_id: a.companyId } },
          integration_identifier: INTEGRATION_ID,
          metadata: { bizomat_company_id: a.companyId },
        },
        { idempotencyKey: `setup:${cfg.environment}:${a.companyId}:${Math.floor(Date.now() / 120_000)}` },
      ),
    );
    if (!session.client_secret) throw new BillingError('Stripe did not return an embedded Checkout session.', 'state');
    await db
      .prepare("INSERT OR IGNORE INTO billing_checkout_sessions (id, company_id, account_id, environment, mode, status, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, 'setup', 'open', ?, ?, ?)")
      .bind(session.id, a.companyId, account.id, cfg.environment, a.userId, now(), ms(session.expires_at))
      .run();
    return c.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(502, `Stripe could not start the payment method update: ${stripeMessage(e)}`);
  }
});

async function liveSubscription(c: Context<AppEnv>, cfg: BillingOn, a: CompanyAccess) {
  const sub = await currentSubscription(c.env.DB, a.companyId, cfg.environment);
  if (!sub || !(OPEN_STATUSES as readonly string[]).includes(sub.status)) throw new HttpError(409, 'This company has no subscription to change.');
  const account = await accountOf(c.env.DB, a.companyId, cfg.environment);
  if (!account) throw new HttpError(409, 'This company has no billing account.');
  return { sub, account };
}

/** Switching between monthly and annual billing: what Stripe would charge now (preview), then the change. */
billingRoutes.post('/c/:company/interval/preview', async (c) => {
  const a = await manage(c, { money: true });
  const cfg = on(c);
  const { interval } = await body(c, intervalSchema);
  const { sub, account } = await liveSubscription(c, cfg, a);
  if (sub.interval === interval) throw new HttpError(400, `The subscription is already billed ${interval === 'year' ? 'annually' : 'monthly'}.`);
  const price = await verifiedPrice(c.env, cfg, interval as Interval);
  if (!price?.ok) throw new HttpError(409, price ? `That price is not ready in Stripe: ${price.problem}` : 'That billing frequency is not offered.');
  const quantity = (await billablePeople(c.env.DB, a.companyId)).length;
  try {
    const inv = checkMode(
      cfg,
      await stripeFor(cfg).invoices.createPreview({
        customer: account.stripe_customer_id,
        subscription: sub.id,
        subscription_details: { items: [{ id: sub.item_id!, price: price.id, quantity }], proration_behavior: cfg.proration === 'none' ? 'none' : 'create_prorations' },
      }),
    );
    return c.json({ preview: previewView(inv), quantity, price: priceView(price, cfg) });
  } catch (e) {
    throw new HttpError(502, `Stripe could not preview the change: ${stripeMessage(e)}`);
  }
});

billingRoutes.post('/c/:company/interval', async (c) => {
  const a = await manage(c, { money: true });
  const cfg = on(c);
  const { interval } = await body(c, intervalSchema);
  const { sub } = await liveSubscription(c, cfg, a);
  if (sub.interval === interval) return c.json({ ok: true, unchanged: true });
  const price = await verifiedPrice(c.env, cfg, interval as Interval);
  if (!price?.ok) throw new HttpError(409, price ? `That price is not ready in Stripe: ${price.problem}` : 'That billing frequency is not offered.');
  const quantity = (await billablePeople(c.env.DB, a.companyId)).length;
  if (quantity < 1) throw new HttpError(409, 'Nobody in this company can be billed.');
  try {
    const updated = await stripeFor(cfg).subscriptions.update(
      sub.id,
      { items: [{ id: sub.item_id!, price: price.id, quantity }], proration_behavior: cfg.proration, expand: ['default_payment_method'] },
      { idempotencyKey: `interval:${sub.id}:v${sub.seat_version}:${interval}:${quantity}` },
    );
    await c.env.DB.prepare('UPDATE billing_subscriptions SET seat_version = seat_version + 1 WHERE id = ? AND seat_version = ?').bind(sub.id, sub.seat_version).run();
    const row = await applySubscription(c.env, cfg, updated);
    await historyStmt(c.env.DB, { companyId: a.companyId, environment: cfg.environment, kind: 'subscription.interval_request', summary: `${a.userName} changed billing to ${interval === 'year' ? 'annual' : 'monthly'}.`, ref: `${sub.id}:v${sub.seat_version}:${interval}`, actorId: a.userId }).run();
    return c.json({ ok: true, subscription: subView(row) });
  } catch (e) {
    throw new HttpError(502, `Stripe could not change the billing frequency: ${stripeMessage(e)}`);
  }
});

/** Cancel at the end of the paid period (access continues until then), or withdraw that cancellation. */
for (const action of ['cancel', 'resume'] as const) {
  billingRoutes.post(`/c/:company/${action}`, async (c) => {
    const a = await manage(c, { money: true });
    const cfg = on(c, { evenWhenLocked: action === 'cancel' });
    const { sub } = await liveSubscription(c, cfg, a);
    const want = action === 'cancel';
    if ((sub.cancel_at_period_end === 1) === want) return c.json({ ok: true, unchanged: true });
    try {
      const updated = await stripeFor(cfg).subscriptions.update(sub.id, { cancel_at_period_end: want, expand: ['default_payment_method'] }, { idempotencyKey: `${action}:${sub.id}:${sub.synced_at}` });
      const row = await applySubscription(c.env, cfg, updated);
      await historyStmt(c.env.DB, { companyId: a.companyId, environment: cfg.environment, kind: `subscription.${action}_request`, summary: want ? `${a.userName} asked to cancel the subscription at the end of the paid period.` : `${a.userName} withdrew the cancellation.`, ref: `${sub.id}:${action}:${sub.synced_at}`, actorId: a.userId }).run();
      return c.json({ ok: true, subscription: subView(row) });
    } catch (e) {
      throw new HttpError(502, `Stripe could not ${want ? 'cancel' : 'resume'} the subscription: ${stripeMessage(e)}`);
    }
  });
}

/** "Update users now": the seat count is brought up to date at once (it also happens after every membership change
 * and in the scheduled check). */
billingRoutes.post('/c/:company/sync-seats', async (c) => {
  const a = await manage(c, { money: true });
  const cfg = on(c);
  const r = await syncSeats(c.env, a.companyId, { reason: 'manual', actorId: a.userId, cfg });
  return c.json(r);
});

void idOf;
