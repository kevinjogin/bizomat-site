// BIZOMAT billing (src/worker/billing, docs/billing/README.md): per-user Stripe subscriptions for registered companies.
//
// No call leaves the test: api.stripe.com is answered by an in-memory stand-in (below) that keeps customers, Checkout
// sessions, subscriptions and invoices, honours idempotency keys like Stripe and records every request. The official
// Stripe SDK runs unchanged, and webhook signatures are made with its own test helper. Billing is switched on only for
// the requests in this file (the worker is called with the billing settings added to its environment), so every other
// test runs with billing off, as production does today.

import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import Stripe from 'stripe';
import worker from '../src/worker/index';
import { ORIGIN, PASSWORD, randomIp, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { billingConfig, redact } from '../src/worker/billing/config';
import { countBillableSeats, syncSeats } from '../src/worker/billing/seats';
import { registeredCompanyOf } from '../src/worker/billing/entitlements';
import { processDueEvents } from '../src/worker/billing/webhook';
import { BILLING_CSP } from '../src/worker/app';

// Not keys: shaped like Stripe's so the configuration checks accept them, and useless anywhere else. Built at run time
// so no key-shaped text sits in the source (secret scanners read this public repository).
const fakeKey = (kind: 'sk' | 'rk' | 'pk', mode: 'test' | 'live') => [kind, mode, 'vitestNotAKey'].join('_');
const fakeWhsec = (name: string) => ['whsec', name].join('_');
const BILLING = {
  STRIPE_ENVIRONMENT: 'test',
  STRIPE_SECRET_KEY: fakeKey('rk', 'test'),
  STRIPE_PUBLISHABLE_KEY: fakeKey('pk', 'test'),
  STRIPE_WEBHOOK_SECRET: fakeWhsec('vitestNotASecret'),
  STRIPE_PRICE_SEAT_MONTHLY: 'price_vitestSeatMonth',
  STRIPE_PRICE_SEAT_ANNUAL: 'price_vitestSeatYear',
};
const billingEnv = (over: Record<string, string> = {}) => ({ ...env, ...BILLING, ...over }) as any;

// ---------------------------------------------------------------------------------------------- Stripe stand-in

type Obj = Record<string, any>;
interface Call {
  method: string;
  path: string;
  params: URLSearchParams;
  idempotencyKey: string | null;
}

const fake = {
  calls: [] as Call[],
  idem: new Map<string, { status: number; body: string }>(),
  customers: new Map<string, Obj>(),
  sessions: new Map<string, Obj>(),
  subs: new Map<string, Obj>(),
  invoices: new Map<string, Obj>(),
  setupIntents: new Map<string, Obj>(),
  prices: new Map<string, Obj>(),
  n: 0,
  live: false,
};
const sid = (p: string) => `${p}_t${(++fake.n).toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const nowS = () => Math.floor(Date.now() / 1000);

function price(id: string, interval: 'month' | 'year', amount: number, over: Obj = {}): Obj {
  return {
    id,
    object: 'price',
    livemode: false,
    active: true,
    type: 'recurring',
    billing_scheme: 'per_unit',
    currency: 'aud',
    unit_amount: amount,
    tax_behavior: 'exclusive',
    recurring: { interval, interval_count: 1, usage_type: 'licensed' },
    product: { id: 'prod_vitestSeats', object: 'product', active: true, name: 'BIZOMAT ERP (per user)' },
    ...over,
  };
}

function resetPrices() {
  fake.prices.set('price_vitestSeatMonth', price('price_vitestSeatMonth', 'month', 1000));
  fake.prices.set('price_vitestSeatYear', price('price_vitestSeatYear', 'year', 12000));
}

function subscriptionObj(customer: string, priceId: string, quantity: number, over: Obj = {}): Obj {
  const p = fake.prices.get(priceId)!;
  const start = nowS();
  const end = start + (p.recurring.interval === 'year' ? 365 : 30) * 86400;
  const id = sid('sub');
  const s = {
    id,
    object: 'subscription',
    livemode: fake.live,
    customer,
    status: 'active',
    cancel_at_period_end: false,
    cancel_at: null,
    canceled_at: null,
    ended_at: null,
    trial_end: null,
    created: start,
    latest_invoice: null,
    default_payment_method: { id: 'pm_vitestCard', object: 'payment_method', type: 'card', card: { brand: 'visa', last4: '4242', exp_month: 12, exp_year: 2030 } },
    items: { object: 'list', data: [{ id: sid('si'), object: 'subscription_item', quantity, price: p, current_period_start: start, current_period_end: end }] },
    ...over,
  };
  fake.subs.set(id, s);
  return s;
}

function invoiceObj(sub: Obj, over: Obj = {}): Obj {
  const item = sub.items.data[0];
  const subtotal = item.price.unit_amount * item.quantity;
  const id = sid('in');
  const inv = {
    id,
    object: 'invoice',
    livemode: fake.live,
    customer: sub.customer,
    number: `VIT-${fake.n}`,
    status: 'paid',
    billing_reason: 'subscription_cycle',
    currency: 'aud',
    subtotal,
    total: subtotal,
    total_taxes: [],
    amount_due: subtotal,
    amount_paid: subtotal,
    amount_remaining: 0,
    attempt_count: 1,
    period_start: item.current_period_start,
    period_end: item.current_period_end,
    created: nowS(),
    status_transitions: { paid_at: nowS() },
    hosted_invoice_url: 'https://invoice.stripe.com/i/vitest',
    invoice_pdf: 'https://pay.stripe.com/invoice/vitest/pdf',
    parent: { type: 'subscription_details', subscription_details: { subscription: sub.id, metadata: {} } },
    lines: { object: 'list', data: [{ id: sid('il'), description: `${item.quantity} × BIZOMAT ERP (per user)`, amount: subtotal, quantity: item.quantity, parent: { subscription_item_details: { proration: false } } }] },
    ...over,
  };
  fake.invoices.set(id, inv);
  return inv;
}

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Request-Id': 'req_vitest' } });
const missing = (what: string) => json(404, { error: { type: 'invalid_request_error', code: 'resource_missing', message: `No such ${what}` } });

function stripeApi(method: string, path: string, q: URLSearchParams): Response {
  const parts = path.replace(/^\/v1\//, '').split('/');
  const [res, id, sub2] = parts;
  if (res === 'prices' && method === 'GET') return fake.prices.has(id) ? json(200, fake.prices.get(id)) : missing('price');
  if (res === 'customers' && method === 'POST' && !id) {
    const c = { id: sid('cus'), object: 'customer', livemode: fake.live, name: q.get('name'), email: q.get('email'), invoice_settings: { default_payment_method: null } };
    fake.customers.set(c.id, c);
    return json(200, c);
  }
  if (res === 'customers' && method === 'POST' && id) {
    const c = fake.customers.get(id);
    if (!c) return missing('customer');
    if (q.get('invoice_settings[default_payment_method]')) c.invoice_settings.default_payment_method = q.get('invoice_settings[default_payment_method]');
    return json(200, c);
  }
  if (res === 'checkout' && id === 'sessions') {
    const sessionId = parts[2];
    if (method === 'POST' && !sessionId) {
      const s = {
        id: sid('cs_test'),
        object: 'checkout.session',
        livemode: fake.live,
        mode: q.get('mode'),
        ui_mode: q.get('ui_mode'),
        customer: q.get('customer'),
        status: 'open',
        client_secret: `cs_secret_${fake.n}`,
        expires_at: nowS() + 86400,
        subscription: null,
        setup_intent: null,
        line_items_requested: { price: q.get('line_items[0][price]'), quantity: Number(q.get('line_items[0][quantity]')) },
      };
      fake.sessions.set(s.id, s);
      return json(200, s);
    }
    const s = fake.sessions.get(sessionId);
    if (!s) return missing('checkout session');
    if (method === 'POST' && parts[3] === 'expire') {
      if (s.status === 'open') s.status = 'expired';
      return json(200, s);
    }
    return json(200, s);
  }
  if (res === 'subscriptions') {
    const s = fake.subs.get(id);
    if (!s) return missing('subscription');
    if (method === 'POST') {
      const qty = q.get('items[0][quantity]');
      const newPrice = q.get('items[0][price]');
      if (newPrice) s.items.data[0].price = fake.prices.get(newPrice);
      if (qty !== null) s.items.data[0].quantity = Number(qty);
      if (q.get('cancel_at_period_end') !== null) {
        s.cancel_at_period_end = q.get('cancel_at_period_end') === 'true';
        s.cancel_at = s.cancel_at_period_end ? s.items.data[0].current_period_end : null;
      }
      if (q.get('default_payment_method')) s.default_payment_method = { id: q.get('default_payment_method'), object: 'payment_method', type: 'card', card: { brand: 'mastercard', last4: '4444', exp_month: 1, exp_year: 2031 } };
    }
    return json(200, s);
  }
  if (res === 'invoices' && id === 'create_preview' && method === 'POST') {
    const s = fake.subs.get(q.get('subscription') ?? '');
    if (!s) return missing('subscription');
    const qty = Number(q.get('subscription_details[items][0][quantity]') ?? s.items.data[0].quantity);
    const p = fake.prices.get(q.get('subscription_details[items][0][price]') ?? s.items.data[0].price.id)!;
    const subtotal = qty * p.unit_amount;
    return json(200, { object: 'invoice', livemode: fake.live, currency: 'aud', subtotal, total: subtotal, total_taxes: [], amount_due: subtotal, period_start: nowS(), period_end: nowS() + 86400 * 30, next_payment_attempt: nowS() + 86400 * 30, lines: { data: [{ description: `${qty} × BIZOMAT ERP (per user)`, amount: subtotal, quantity: qty, parent: { subscription_item_details: { proration: false } } }] } });
  }
  if (res === 'invoices' && method === 'GET') return fake.invoices.has(id) ? json(200, fake.invoices.get(id)) : missing('invoice');
  if (res === 'invoices' && method === 'POST' && sub2 === 'pay') return fake.invoices.has(id) ? json(200, { ...fake.invoices.get(id), status: 'paid' }) : missing('invoice');
  if (res === 'setup_intents') return fake.setupIntents.has(id) ? json(200, fake.setupIntents.get(id)) : missing('setup intent');
  return json(400, { error: { type: 'invalid_request_error', message: `Not in the stand-in: ${method} ${path}` } });
}

const realFetch = globalThis.fetch;
beforeAll(() => {
  resetPrices();
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: any, init?: any) => {
    const req = input instanceof Request ? input : new Request(String(input), init);
    const url = new URL(req.url);
    if (url.hostname !== 'api.stripe.com') return realFetch(input, init);
    const method = req.method.toUpperCase();
    const text = method === 'GET' ? url.search.slice(1) : new TextDecoder().decode(await req.arrayBuffer());
    const q = new URLSearchParams(text);
    const key = req.headers.get('Idempotency-Key');
    fake.calls.push({ method, path: url.pathname, params: q, idempotencyKey: key });
    if (key && method === 'POST' && fake.idem.has(key)) {
      const r = fake.idem.get(key)!;
      return new Response(r.body, { status: r.status, headers: { 'Content-Type': 'application/json', 'Idempotent-Replayed': 'true' } });
    }
    const res = stripeApi(method, url.pathname, q);
    if (key && method === 'POST') fake.idem.set(key, { status: res.status, body: await res.clone().text() });
    return res;
  });
});
afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------------------------- helpers

/** A request to the worker with billing switched on (or other settings), as the given person. */
async function call(c: Client | null, method: string, path: string, body?: unknown, over: Record<string, string> = {}, headers: Record<string, string> = {}) {
  const h: Record<string, string> = { Origin: ORIGIN, 'CF-Connecting-IP': randomIp(), Accept: 'application/json', ...headers };
  if (c) {
    h.Cookie = c.cookie;
    h['X-CSRF-Token'] = c.csrf;
  }
  let b: BodyInit | undefined;
  if (typeof body === 'string') b = body;
  else if (body !== undefined) {
    h['Content-Type'] = 'application/json';
    b = JSON.stringify(body);
  }
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, { method, headers: h, body: b, redirect: 'manual' }), billingEnv(over), ctx);
  await waitOnExecutionContext(ctx);
  return res;
}
async function okJson<T = any>(res: Response): Promise<T> {
  const text = await res.text();
  if (res.status >= 400) throw new Error(`${res.status}: ${text}`);
  return JSON.parse(text) as T;
}

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function company(owner: Client) {
  const res = await owner.req('POST', '/api/company/companies', {
    kind: 'business',
    name: 'Harbour Fabrication',
    legalName: '',
    abn: newAbn(),
    acn: '',
    email: uniqueEmail('accounts'),
    phone: '(02) 9876 5432',
    addressLine1: '12 Example Street',
    addressLine2: '',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    website: '',
    tools: { tasks: { create: true }, crm: { create: true }, finance: { create: true } },
  });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return data as { company: { id: string }; tools: { tasks: string; crm: string; finance: string } };
}

async function join(owner: Client, companyId: string, role: 'admin' | 'member' = 'member') {
  const person = await signup('Team Member', uniqueEmail('member'));
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: person.email, role });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  // Accepted through the billing-enabled worker, so the seat change runs here.
  await okJson(await call(person, 'POST', `/api/company/invitations/${token}/accept`, {}));
  return person;
}

async function setSetting(key: string, value: string) {
  await env.DB.prepare('INSERT INTO billing_settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(key, value, Date.now()).run();
}

async function signedEvent(type: string, object: Obj, opts: { id?: string; livemode?: boolean; secret?: string } = {}) {
  const payload = JSON.stringify({ id: opts.id ?? sid('evt'), object: 'event', type, livemode: opts.livemode ?? false, created: nowS(), api_version: '2026-10-28.endive', data: { object } });
  const header = await Stripe.webhooks.generateTestHeaderStringAsync({ payload, secret: opts.secret ?? BILLING.STRIPE_WEBHOOK_SECRET, cryptoProvider: Stripe.createSubtleCryptoProvider() });
  return { payload, header };
}
const deliver = async (e: { payload: string; header: string }, over: Record<string, string> = {}) => call(null, 'POST', '/api/billing/stripe-webhook', e.payload, over, { 'Stripe-Signature': e.header, 'Content-Type': 'application/json' });

/** A company with an active subscription for its current members, made through the real Checkout path and webhook. */
async function subscribed(owner: Client, interval: 'month' | 'year' = 'month') {
  const co = await company(owner);
  await setSetting('audience', 'everyone');
  const out = await okJson(await call(owner, 'POST', `/api/billing/c/${co.company.id}/checkout`, { interval }));
  const session = fake.sessions.get(out.sessionId)!;
  const sub = subscriptionObj(session.customer, session.line_items_requested.price, session.line_items_requested.quantity);
  session.status = 'complete';
  session.subscription = sub.id;
  const res = await deliver(await signedEvent('checkout.session.completed', { id: session.id, object: 'checkout.session' }));
  expect(res.status).toBe(200);
  return { co, sub, session };
}

// ---------------------------------------------------------------------------------------------- tests

describe('billing configuration', () => {
  it('is off, with a reason and never a key, unless every setting is right for its environment', () => {
    expect(billingConfig({} as any)).toMatchObject({ enabled: false });
    const ok = billingConfig(BILLING as any);
    expect(ok).toMatchObject({ enabled: true, environment: 'test', keyKind: 'rk', proration: 'create_prorations', automaticTax: false, graceDays: 14 });
    const bad = (over: Record<string, string>) => billingConfig({ ...BILLING, ...over } as any) as any;
    expect(bad({ STRIPE_ENVIRONMENT: 'production' }).enabled).toBe(false);
    expect(bad({ STRIPE_SECRET_KEY: fakeKey('sk', 'live') }).reason).toMatch(/live Stripe key is set in the test environment/);
    expect(bad({ STRIPE_ENVIRONMENT: 'live', STRIPE_PUBLISHABLE_KEY: fakeKey('pk', 'live') }).reason).toMatch(/test Stripe key is set in the live environment/);
    expect(bad({ STRIPE_PUBLISHABLE_KEY: fakeKey('pk', 'live') }).reason).toMatch(/publishable key is for the other/);
    expect(bad({ STRIPE_WEBHOOK_SECRET: '' }).reason).toMatch(/no Stripe webhook signing secret/);
    expect(bad({ STRIPE_PRICE_SEAT_MONTHLY: '1000' }).reason).toMatch(/not a Stripe Price id/);
    expect(bad({ STRIPE_PRICE_SEAT_ANNUAL: 'price_vitestSeatMonth' }).reason).toMatch(/same Price/);
    expect(bad({ STRIPE_PRORATION: 'sometimes' }).enabled).toBe(false);
    expect(bad({ STRIPE_API_BASE: 'http://127.0.0.1:12111', ENVIRONMENT: 'production' }).reason).toMatch(/only for development/);
    for (const over of [{ STRIPE_SECRET_KEY: fakeKey('sk', 'live') }, { STRIPE_WEBHOOK_SECRET: '' }, {}] as Record<string, string>[]) {
      const r = JSON.stringify(bad(over).reason ?? '');
      expect(r).not.toMatch(/vitestNotA/);
    }
    expect(redact(`Invalid API Key provided: ${fakeKey('rk', 'test')} and ${fakeWhsec('abcDEF=')} Bearer abc.def`)).toBe('Invalid API Key provided: rk_test_[redacted] and whsec_[redacted] Bearer [redacted]');
  });

  it('sends the browser the publishable key only, and the reason billing is off only to platform admins', async () => {
    const someone = await signup();
    const on = await okJson(await call(someone, 'GET', '/api/billing/config'));
    expect(on).toEqual({ enabled: true, environment: 'test', publishableKey: fakeKey('pk', 'test') });
    const offRes = await call(someone, 'GET', '/api/billing/config', undefined, { STRIPE_ENVIRONMENT: '' });
    const off = await okJson(offRes);
    expect(off.enabled).toBe(false);
    expect(off.reason).toBeUndefined();
  });
});

describe('billable users', () => {
  it('counts active members once (owner and administrators included), and not pending invitations or disabled accounts', async () => {
    const owner = await signup('Olive Owner', uniqueEmail('owner'));
    const { company: co } = await company(owner);
    expect(await countBillableSeats(env.DB, co.id)).toBe(1);
    const admin = await join(owner, co.id, 'admin');
    await join(owner, co.id, 'member');
    expect(await countBillableSeats(env.DB, co.id)).toBe(3);
    await owner.json('POST', `/api/company/c/${co.id}/invitations`, { email: uniqueEmail('pending') });
    expect(await countBillableSeats(env.DB, co.id)).toBe(3);
    await env.DB.prepare('UPDATE users SET disabled_at = ? WHERE id = ?').bind(Date.now(), admin.userId).run();
    expect(await countBillableSeats(env.DB, co.id)).toBe(2);
    const summary = await okJson(await call(owner, 'GET', `/api/billing/c/${co.id}`));
    expect(summary.seats).toMatchObject({ count: 2, pendingInvitations: 1, disabledMembers: 1 });
    expect(summary.seats.people.map((p: any) => p.role)).toEqual(['owner', 'member']);
  });

  it('shows billing to the owner and administrators only', async () => {
    const owner = await signup();
    const { company: co } = await company(owner);
    const member = await join(owner, co.id, 'member');
    expect((await call(member, 'GET', `/api/billing/c/${co.id}`)).status).toBe(403);
    const stranger = await signup();
    expect((await call(stranger, 'GET', `/api/billing/c/${co.id}`)).status).toBe(404);
    const summary = await okJson(await call(owner, 'GET', `/api/billing/c/${co.id}`));
    expect(summary.prices.month).toMatchObject({ ok: true, display: 'A$10.00 per user per month', taxBehavior: 'exclusive', gst: 'GST is added to this price where it applies.', gstCalculated: false });
    expect(summary.prices.year).toMatchObject({ ok: true, display: 'A$120.00 per user per year' });
    expect(summary.explanations.gstCalculated).toMatch(/does not calculate GST/);
    expect(JSON.stringify(summary)).not.toMatch(/rk_test|whsec_/);
  });
});

describe('starting a subscription', () => {
  it('is closed until the founder opens it, and uses the server’s seat count, never the browser’s', async () => {
    const owner = await signup();
    const { company: co } = await company(owner);
    await join(owner, co.id);
    await setSetting('audience', 'off');
    expect((await call(owner, 'POST', `/api/billing/c/${co.id}/checkout`, { interval: 'month' })).status).toBe(403);
    await setSetting('audience', 'everyone');
    const before = fake.calls.length;
    const out = await okJson(await call(owner, 'POST', `/api/billing/c/${co.id}/checkout`, { interval: 'month', quantity: 999 }));
    expect(out.clientSecret).toMatch(/^cs_secret_/);
    const create = fake.calls.slice(before).find((x) => x.path === '/v1/checkout/sessions' && x.method === 'POST')!;
    expect(create.params.get('mode')).toBe('subscription');
    expect(create.params.get('ui_mode')).toBe('embedded_page');
    expect(create.params.get('line_items[0][price]')).toBe('price_vitestSeatMonth');
    expect(create.params.get('line_items[0][quantity]')).toBe('2');
    expect(create.params.get('payment_method_types[0]')).toBeNull();
    expect(create.params.get('automatic_tax[enabled]')).toBeNull();
    expect(create.idempotencyKey).toMatch(/^checkout:test:/);
    expect(create.params.get('return_url')).toContain(`/erp/c/${co.id}/billing?checkout={CHECKOUT_SESSION_ID}`);
    // The same request again shows the same open session; one Stripe customer per company.
    const again = await okJson(await call(owner, 'POST', `/api/billing/c/${co.id}/checkout`, { interval: 'month' }));
    expect(again.sessionId).toBe(out.sessionId);
    const customers = fake.calls.filter((x) => x.path === '/v1/customers' && x.method === 'POST' && x.params.get('metadata[bizomat_company_id]') === co.id);
    expect(new Set(customers.map((x) => x.idempotencyKey)).size).toBe(1);
    const rows = await env.DB.prepare('SELECT COUNT(*) AS n FROM billing_accounts WHERE company_id = ?').bind(co.id).first<{ n: number }>();
    expect(rows!.n).toBe(1);
  });

  it('refuses members, API tokens, a price that is wrong in Stripe, and a second subscription', async () => {
    const owner = await signup();
    const { company: co } = await company(owner);
    const member = await join(owner, co.id);
    await setSetting('audience', 'everyone');
    expect((await call(member, 'POST', `/api/billing/c/${co.id}/checkout`, { interval: 'month' })).status).toBe(403);
    const token = await owner.json('POST', '/api/me/tokens', { name: 'billing test' });
    expect(token.token).toMatch(/^wos_/);
    const viaToken = await call(null, 'POST', `/api/billing/c/${co.id}/checkout`, { interval: 'month' }, {}, { Authorization: `Bearer ${token.token}` });
    expect(viaToken.status).toBe(403);
    expect(await viaToken.text()).toMatch(/not with an API token/);
    // A price that is not per unit is refused (checked fresh: the cache is cleared first).
    await env.DB.prepare("DELETE FROM billing_settings WHERE key LIKE 'price:%'").run();
    fake.prices.set('price_vitestSeatMonth', price('price_vitestSeatMonth', 'month', 1000, { billing_scheme: 'tiered' }));
    const tiered = await call(owner, 'POST', `/api/billing/c/${co.id}/checkout`, { interval: 'month' });
    expect(tiered.status).toBe(409);
    expect(await tiered.text()).toMatch(/per unit/);
    await env.DB.prepare("DELETE FROM billing_settings WHERE key LIKE 'price:%'").run();
    resetPrices();
    const { co: paid } = await subscribed(owner);
    const second = await call(owner, 'POST', `/api/billing/c/${paid.company.id}/checkout`, { interval: 'month' });
    expect(second.status).toBe(409);
  });
});

describe('the Stripe webhook', () => {
  it('refuses unsigned, wrongly signed and other-environment events, and answers 503 while billing is off', async () => {
    const e = await signedEvent('customer.subscription.updated', { id: 'sub_unknown', object: 'subscription' });
    expect((await call(null, 'POST', '/api/billing/stripe-webhook', e.payload, {}, { 'Content-Type': 'application/json' })).status).toBe(400);
    expect((await deliver({ payload: e.payload, header: e.header.replace(/v1=[0-9a-f]+/, 'v1=' + '0'.repeat(64)) })).status).toBe(400);
    const other = await signedEvent('customer.subscription.updated', { id: 'sub_unknown' }, { secret: fakeWhsec('someoneElse') });
    expect((await deliver(other)).status).toBe(400);
    const live = await signedEvent('customer.subscription.updated', { id: 'sub_unknown' }, { livemode: true });
    expect((await deliver(live)).status).toBe(400);
    expect((await deliver(e, { STRIPE_SECRET_KEY: '' })).status).toBe(503);
    // During a roll, the previous secret still verifies.
    const rolled = await signedEvent('customer.subscription.updated', { id: 'sub_unknown' }, { secret: fakeWhsec('previousOne') });
    expect((await deliver(rolled, { STRIPE_WEBHOOK_SECRET_PREVIOUS: fakeWhsec('previousOne') })).status).toBe(200);
  });

  it('records a completed Checkout once, however many times Stripe delivers it', async () => {
    const owner = await signup();
    const { co, sub, session } = await subscribed(owner);
    const row = await env.DB.prepare('SELECT * FROM billing_subscriptions WHERE company_id = ?').bind(co.company.id).first<any>();
    expect(row).toMatchObject({ id: sub.id, status: 'active', quantity: 1, interval: 'month', pm_brand: 'visa', pm_last4: '4242', unit_amount: 1000 });
    const e = await signedEvent('checkout.session.completed', { id: session.id }, { id: 'evt_vitestDuplicate' + co.company.id.slice(0, 6) });
    expect((await deliver(e)).status).toBe(200);
    const reads = fake.calls.filter((x) => x.path === `/v1/checkout/sessions/${session.id}`).length;
    expect((await deliver(e)).status).toBe(200);
    expect(fake.calls.filter((x) => x.path === `/v1/checkout/sessions/${session.id}`).length).toBe(reads);
    const ev = await env.DB.prepare('SELECT status, attempts FROM billing_events WHERE id = ?').bind('evt_vitestDuplicate' + co.company.id.slice(0, 6)).first<any>();
    expect(ev).toMatchObject({ status: 'processed', attempts: 1 });
    const started = await env.DB.prepare("SELECT COUNT(*) AS n FROM billing_history WHERE company_id = ? AND kind = 'subscription.active'").bind(co.company.id).first<{ n: number }>();
    expect(started!.n).toBe(1);
    // A sweep afterwards finds nothing to do for it.
    const cfg = billingConfig(billingEnv()) as any;
    await processDueEvents(billingEnv(), cfg);
    expect((await env.DB.prepare('SELECT attempts FROM billing_events WHERE id = ?').bind('evt_vitestDuplicate' + co.company.id.slice(0, 6)).first<any>()).attempts).toBe(1);
  });

  it('records failed payments and recovery, and an invoice’s amounts and tax', async () => {
    const owner = await signup();
    const { co, sub } = await subscribed(owner);
    const failed = invoiceObj(sub, { status: 'open', amount_paid: 0, amount_remaining: 1000, attempt_count: 1, status_transitions: { paid_at: null } });
    sub.status = 'past_due';
    sub.latest_invoice = failed.id;
    expect((await deliver(await signedEvent('invoice.payment_failed', { id: failed.id }))).status).toBe(200);
    const row = await env.DB.prepare('SELECT status, past_due_since FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<any>();
    expect(row.status).toBe('past_due');
    expect(row.past_due_since).toBeGreaterThan(0);
    const hist = await env.DB.prepare('SELECT kind, summary FROM billing_history WHERE company_id = ? ORDER BY created_at').bind(co.company.id).all<any>();
    expect(hist.results.some((h) => h.kind === 'invoice.payment_failed' && /failed, attempt 1/.test(h.summary))).toBe(true);
    // Paid on a retry: the subscription is active again and the invoice is recorded as paid, with its tax.
    Object.assign(failed, { status: 'paid', amount_paid: 1100, amount_remaining: 0, total: 1100, total_taxes: [{ amount: 100 }], status_transitions: { paid_at: nowS() } });
    sub.status = 'active';
    expect((await deliver(await signedEvent('invoice.paid', { id: failed.id }))).status).toBe(200);
    expect((await env.DB.prepare('SELECT status, past_due_since FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<any>())).toMatchObject({ status: 'active', past_due_since: null });
    expect(await env.DB.prepare('SELECT status, total, tax, amount_paid FROM billing_invoices WHERE id = ?').bind(failed.id).first<any>()).toMatchObject({ status: 'paid', total: 1100, tax: 100, amount_paid: 1100 });
    const summary = await okJson(await call(owner, 'GET', `/api/billing/c/${co.company.id}`));
    expect(summary.invoices[0]).toMatchObject({ id: failed.id, status: 'paid', tax: 100 });
  });
});

describe('seat changes', () => {
  it('follows people joining and leaving, with Stripe’s proration, once per change', async () => {
    const owner = await signup();
    const { co, sub } = await subscribed(owner);
    const person = await join(owner, co.company.id);
    expect(sub.items.data[0].quantity).toBe(2);
    const update = fake.calls.filter((x) => x.path === `/v1/subscriptions/${sub.id}` && x.method === 'POST').at(-1)!;
    expect(update.params.get('items[0][quantity]')).toBe('2');
    expect(update.params.get('proration_behavior')).toBe('create_prorations');
    expect(update.idempotencyKey).toMatch(new RegExp(`^seats:${sub.id}:v0:2:0$`));
    expect((await env.DB.prepare('SELECT quantity, seat_version FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<any>())).toMatchObject({ quantity: 2, seat_version: 1 });
    const hist = await env.DB.prepare("SELECT summary FROM billing_history WHERE company_id = ? AND kind = 'seats.changed'").bind(co.company.id).all<any>();
    expect(hist.results.map((h) => h.summary)).toEqual([expect.stringMatching(/from 1 to 2 \(a person accepted an invitation\)\. Stripe adds a charge for the time left/)]);
    // Removed: the quantity goes down, and the credit is explained.
    await okJson(await call(owner, 'DELETE', `/api/company/c/${co.company.id}/members/${person.userId}`));
    expect(sub.items.data[0].quantity).toBe(1);
    const hist2 = await env.DB.prepare("SELECT summary FROM billing_history WHERE company_id = ? AND kind = 'seats.changed' ORDER BY created_at DESC LIMIT 1").bind(co.company.id).first<any>();
    expect(hist2.summary).toMatch(/from 2 to 1 \(a person was removed from the company\)\. Stripe credits the unused time/);
  });

  it('never applies the same change twice when two requests race', async () => {
    const owner = await signup();
    const { co, sub } = await subscribed(owner);
    // A second member added without the hook (as if the background sync were still to run).
    const person = await signup();
    await env.DB.prepare("INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES (?, ?, 'member', ?)").bind(co.company.id, person.userId, Date.now()).run();
    const benv = billingEnv();
    const [a, b] = await Promise.all([syncSeats(benv, co.company.id, { reason: 'reconcile' }), syncSeats(benv, co.company.id, { reason: 'manual' })]);
    expect([a.status, b.status].sort()).toEqual(['applied', 'raced']);
    const changes = await env.DB.prepare('SELECT COUNT(*) AS n FROM billing_seat_changes WHERE subscription_id = ?').bind(sub.id).first<{ n: number }>();
    expect(changes!.n).toBe(1);
    const keys = fake.calls.filter((x) => x.path === `/v1/subscriptions/${sub.id}` && x.method === 'POST').map((x) => x.idempotencyKey);
    expect(new Set(keys).size).toBe(1);
    expect((await env.DB.prepare('SELECT quantity, seat_version FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<any>())).toMatchObject({ quantity: 2, seat_version: 1 });
    const hist = await env.DB.prepare("SELECT COUNT(*) AS n FROM billing_history WHERE company_id = ? AND kind = 'seats.changed'").bind(co.company.id).first<{ n: number }>();
    expect(hist!.n).toBe(1);
    expect((await syncSeats(benv, co.company.id, { reason: 'reconcile' })).status).toBe('in-step');
  });

  it('retries a failed change with a new key, and leaves a company with nobody billable for a person to look at', async () => {
    const owner = await signup();
    const { co, sub } = await subscribed(owner);
    const person = await signup();
    await env.DB.prepare("INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES (?, ?, 'member', ?)").bind(co.company.id, person.userId, Date.now()).run();
    const saved = fake.subs.get(sub.id)!;
    fake.subs.delete(sub.id);
    const failed = await syncSeats(billingEnv(), co.company.id, { reason: 'reconcile' });
    expect(failed.status).toBe('failed');
    expect((failed as any).error).toMatch(/No such subscription/);
    fake.subs.set(sub.id, saved);
    const ok = await syncSeats(billingEnv(), co.company.id, { reason: 'reconcile' });
    expect(ok.status).toBe('applied');
    const keys = fake.calls.filter((x) => x.path === `/v1/subscriptions/${sub.id}` && x.method === 'POST').map((x) => x.idempotencyKey);
    expect(keys.slice(-2)).toEqual([`seats:${sub.id}:v0:2:0`, `seats:${sub.id}:v0:2:1`]);
    await env.DB.prepare('UPDATE users SET disabled_at = ? WHERE id IN (?, ?)').bind(Date.now(), owner.userId, person.userId).run();
    expect((await syncSeats(billingEnv(), co.company.id, { reason: 'reconcile' })).status).toBe('no-users');
    await env.DB.prepare('UPDATE users SET disabled_at = NULL WHERE id IN (?, ?)').bind(owner.userId, person.userId).run();
  });

  it('estimates the next invoice, switches to annual billing and cancels at the period end', async () => {
    const owner = await signup();
    const { co, sub } = await subscribed(owner);
    const prev = await okJson(await call(owner, 'GET', `/api/billing/c/${co.company.id}/preview`));
    expect(prev.preview).toMatchObject({ currency: 'aud', subtotal: 1000, amountDue: 1000 });
    const preview = await okJson(await call(owner, 'POST', `/api/billing/c/${co.company.id}/interval/preview`, { interval: 'year' }));
    expect(preview.preview.subtotal).toBe(12000);
    await okJson(await call(owner, 'POST', `/api/billing/c/${co.company.id}/interval`, { interval: 'year' }));
    expect(sub.items.data[0].price.id).toBe('price_vitestSeatYear');
    expect((await env.DB.prepare('SELECT interval FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<any>()).interval).toBe('year');
    await okJson(await call(owner, 'POST', `/api/billing/c/${co.company.id}/cancel`, {}));
    expect(sub.cancel_at_period_end).toBe(true);
    const summary = await okJson(await call(owner, 'GET', `/api/billing/c/${co.company.id}`));
    expect(summary.subscription).toMatchObject({ cancelAtPeriodEnd: true, interval: 'year', status: 'active' });
    expect(summary.history.map((h: any) => h.kind)).toEqual(expect.arrayContaining(['subscription.cancel_scheduled', 'subscription.interval']));
    // A company that still pays cannot be deleted.
    const del = await owner.req('DELETE', `/api/company/c/${co.company.id}`, { confirm: 'Harbour Fabrication' });
    expect(del.status).toBe(409);
    await okJson(await call(owner, 'POST', `/api/billing/c/${co.company.id}/resume`, {}));
    expect(sub.cancel_at_period_end).toBe(false);
    // Ended in Stripe: recorded as cancelled.
    sub.status = 'canceled';
    sub.ended_at = nowS();
    expect((await deliver(await signedEvent('customer.subscription.deleted', { id: sub.id }))).status).toBe(200);
    expect((await env.DB.prepare('SELECT status FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<any>()).status).toBe('canceled');
  });

  it('saves a new payment method through embedded Checkout and makes it the subscription’s default', async () => {
    const owner = await signup();
    const { co, sub } = await subscribed(owner);
    const out = await okJson(await call(owner, 'POST', `/api/billing/c/${co.company.id}/payment-method`, {}));
    const s = fake.sessions.get(out.sessionId)!;
    expect(s.mode).toBe('setup');
    expect(s.ui_mode).toBe('embedded_page');
    fake.setupIntents.set('seti_vitest', { id: 'seti_vitest', object: 'setup_intent', livemode: false, payment_method: 'pm_vitestNew' });
    s.status = 'complete';
    s.setup_intent = 'seti_vitest';
    const status = await okJson(await call(owner, 'GET', `/api/billing/c/${co.company.id}/checkout/${s.id}`));
    expect(status.status).toBe('complete');
    expect(fake.customers.get(s.customer)!.invoice_settings.default_payment_method).toBe('pm_vitestNew');
    expect(sub.default_payment_method.id).toBe('pm_vitestNew');
    expect((await env.DB.prepare('SELECT pm_brand, pm_last4 FROM billing_subscriptions WHERE id = ?').bind(sub.id).first<any>())).toMatchObject({ pm_brand: 'mastercard', pm_last4: '4444' });
  });
});

describe('entitlements', () => {
  it('finds the registered company behind each paid tool’s address', async () => {
    const owner = await signup();
    const { company: co, tools } = await company(owner);
    expect(await registeredCompanyOf(env.DB, `erp/c/${co.id}/products`)).toBe(co.id);
    expect(await registeredCompanyOf(env.DB, `maintenance/c/${co.id}/assets`)).toBe(co.id);
    expect(await registeredCompanyOf(env.DB, `whs/c/${co.id}/hazards`)).toBe(co.id);
    expect(await registeredCompanyOf(env.DB, `crm/orgs/${tools.crm}/companies`)).toBe(co.id);
    expect(await registeredCompanyOf(env.DB, `fin/orgs/${tools.finance}/contacts`)).toBe(co.id);
    expect(await registeredCompanyOf(env.DB, `workspaces/${tools.tasks}`)).toBe(co.id);
    const board = await owner.json('POST', `/api/workspaces/${tools.tasks}/boards`, { name: 'Plan' });
    expect(await registeredCompanyOf(env.DB, `boards/${board.board?.id ?? board.id}`)).toBe(co.id);
    // Not paid: a personal workspace, company administration, billing, a person's own settings.
    expect(await registeredCompanyOf(env.DB, `workspaces/${owner.workspaceId}`)).toBeNull();
    expect(await registeredCompanyOf(env.DB, `company/c/${co.id}/members`)).toBeNull();
    expect(await registeredCompanyOf(env.DB, `billing/c/${co.id}/checkout`)).toBeNull();
    expect(await registeredCompanyOf(env.DB, 'me/tokens')).toBeNull();
  });

  it('refuses writes (never reads) to an unpaid company only when enforcement is on and billing is configured', async () => {
    const owner = await signup();
    const { company: co, tools } = await company(owner);
    const write = (over: Record<string, string> = {}) => call(owner, 'POST', `/api/crm/orgs/${tools.crm}/companies`, { name: 'Acme Customer' }, over);
    await setSetting('enforcement', 'off');
    expect((await write()).status).not.toBe(402);
    await setSetting('enforcement', 'on');
    const refused = await write();
    expect(refused.status).toBe(402);
    expect(((await refused.json()) as any).details.code).toBe('PLAN_REQUIRED');
    expect((await call(owner, 'GET', `/api/crm/orgs/${tools.crm}/companies`)).status).toBe(200);
    expect((await call(owner, 'POST', `/api/erp/c/${co.id}/products`, {})).status).toBe(402);
    // Company administration and billing stay open, so people can be managed and the company can subscribe.
    expect((await call(owner, 'POST', `/api/company/c/${co.id}/invitations`, { email: uniqueEmail() })).status).toBe(201);
    // Billing not configured: nothing can be sold, so nothing is refused.
    expect((await write({ STRIPE_SECRET_KEY: '' })).status).not.toBe(402);
    // A person's own (unregistered) workspace is never refused.
    expect((await call(owner, 'POST', `/api/workspaces/${owner.workspaceId}/boards`, { name: 'Mine' })).status).not.toBe(402);
    // A founding grant opens it.
    await env.DB.prepare("INSERT INTO billing_grants (id, company_id, kind, reason, starts_at, granted_by, created_at) VALUES (?, ?, 'founding', 'Founding customer', ?, ?, ?)").bind(`g-${co.id}`, co.id, Date.now() - 1000, owner.userId, Date.now()).run();
    expect((await write()).status).not.toBe(402);
    await env.DB.prepare('UPDATE billing_grants SET revoked_at = ? WHERE id = ?').bind(Date.now(), `g-${co.id}`).run();
    // Shadow: allowed, and counted.
    await setSetting('enforcement', 'shadow');
    expect((await write()).status).not.toBe(402);
    const counted = await env.DB.prepare('SELECT SUM(count) AS n FROM billing_shadow_denials WHERE company_id = ?').bind(co.id).first<{ n: number }>();
    expect(counted!.n).toBeGreaterThanOrEqual(1);
    await setSetting('enforcement', 'off');
  });

  it('keeps a paying company open, through the grace period after a failed payment, and closes it after', async () => {
    const owner = await signup();
    const { co, sub } = await subscribed(owner);
    const crm = (await owner.json('GET', `/api/company/c/${co.company.id}`)).tools?.find?.((t: any) => t.app === 'crm')?.id ?? co.tools.crm;
    const write = () => call(owner, 'POST', `/api/crm/orgs/${crm}/companies`, { name: 'Paid Customer' });
    await setSetting('enforcement', 'on');
    expect((await write()).status).not.toBe(402);
    await env.DB.prepare("UPDATE billing_subscriptions SET status = 'past_due', past_due_since = ? WHERE id = ?").bind(Date.now() - 86_400_000, sub.id).run();
    expect((await write()).status).not.toBe(402);
    await env.DB.prepare('UPDATE billing_subscriptions SET past_due_since = ? WHERE id = ?').bind(Date.now() - 20 * 86_400_000, sub.id).run();
    expect((await write()).status).toBe(402);
    await setSetting('enforcement', 'off');
  });
});

describe('safety', () => {
  it('never bills an example company: it is not a registered company, so billing does not reach it', async () => {
    const someone = await signup();
    const res = await someone.req('POST', '/api/system/demo', {});
    expect(res.status).toBe(201);
    const id = ((await res.json()) as { companyId: string }).companyId;
    expect((await env.DB.prepare('SELECT company_id FROM sys_demo WHERE user_id = ?').bind(someone.userId).first<{ company_id: string }>())?.company_id).toBe(id);
    expect((await call(someone, 'GET', `/api/billing/c/${id}`)).status).toBe(404);
    expect((await call(someone, 'POST', `/api/billing/c/${id}/checkout`, { interval: 'month' })).status).toBe(404);
    expect(await registeredCompanyOf(env.DB, `erp/c/${id}/products`)).toBeNull();
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM billing_accounts WHERE company_id = ?').bind(id).first<{ n: number }>())!.n).toBe(0);
  });

  it('keeps billing history append only', async () => {
    const owner = await signup();
    const { co } = await subscribed(owner);
    await expect(env.DB.prepare('DELETE FROM billing_history WHERE company_id = ?').bind(co.company.id).run()).rejects.toThrow(/append only/);
    await expect(env.DB.prepare("UPDATE billing_history SET summary = 'x' WHERE company_id = ?").bind(co.company.id).run()).rejects.toThrow(/append only/);
  });

  it('gives the billing page, and only it, the policy that lets Stripe’s embedded Checkout load', async () => {
    const owner = await signup();
    const page = await call(owner, 'GET', '/erp/c/abc/billing', undefined, {}, { Accept: 'text/html' });
    expect(page.headers.get('Content-Security-Policy')).toBe(BILLING_CSP);
    expect(page.headers.get('Permissions-Policy')).toContain('payment=(self "https://js.stripe.com"');
    const other = await call(owner, 'GET', '/erp/c/abc/home', undefined, {}, { Accept: 'text/html' });
    expect(other.headers.get('Content-Security-Policy')).not.toContain('stripe');
    expect(other.headers.get('Permissions-Policy')).toContain('payment=()');
  });

  it('does nothing in the cron while billing is off', async () => {
    const { runBillingScheduled } = await import('../src/worker/billing/admin');
    expect(await runBillingScheduled(env as any)).toEqual({ billing: 'off' });
    const r = await runBillingScheduled(billingEnv());
    expect(r).toHaveProperty('seats');
  });

  it('lets only platform admins see the console, and only the founder change it', async () => {
    const someone = await signup();
    expect((await call(someone, 'GET', '/api/admin/billing/overview')).status).toBe(404);
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_at) VALUES (?, 'admin', ?)").bind(someone.userId, Date.now()).run();
    const overview = await call(someone, 'GET', '/api/admin/billing/overview');
    expect(overview.status).toBe(200);
    const o = (await overview.json()) as any;
    expect(o.config).toMatchObject({ enabled: true, environment: 'test', keyKind: 'rk', webhookSecrets: 1 });
    expect(o.settings).toHaveProperty('enforcement');
    expect(JSON.stringify(o)).not.toMatch(/vitestNotA/);
    expect((await call(someone, 'PUT', '/api/admin/billing/settings', { enforcement: 'on' })).status).toBe(403);
    await env.DB.prepare("UPDATE platform_admins SET role = 'founder' WHERE user_id = ?").bind(someone.userId).run();
    const changed = await okJson(await call(someone, 'PUT', '/api/admin/billing/settings', { audience: 'admins' }));
    expect(changed.audience).toBe('admins');
    const audited = await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'billing.audience_changed' AND actor_id = ?").bind(someone.userId).first<{ n: number }>();
    expect(audited!.n).toBe(1);
    await env.DB.prepare('DELETE FROM platform_admins WHERE user_id = ?').bind(someone.userId).run();
  });
});

void PASSWORD;
