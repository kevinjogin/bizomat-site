// Stripe's webhook (docs/billing/README.md): POST /api/billing/stripe-webhook, outside the signed-in API (no session,
// no CSRF), authenticated only by Stripe's signature over the exact bytes received.
//
//   1. Billing off: 503 (Stripe retries; nothing is lost while it is being set up).
//   2. The signature is checked with the current signing secret, then the previous one during a roll; a bad or old
//      signature: 400. An event from the other Stripe environment: 400.
//   3. The event is stored once by its id (a repeated delivery finds the row: 200, not processed again) and the answer
//      is sent at once; processing follows in the background and in the 15-minute sweep, with a lease so two runs never
//      process one event, retries with back-off, and "dead" after 8 failures (shown in the console).
//   4. Processing reads the object from Stripe again (src/worker/billing/sync.ts), so order does not matter.

import { Hono } from 'hono';
import type { AppEnv, Env } from '../env';
import { now } from '../lib/util';
import { billingConfig, redact, type BillingOn } from './config';
import { stripeFor, stripeMessage, subtleCrypto, type Stripe } from './stripe';
import { recordRiskEvent, syncCheckoutSession, syncInvoice, syncSubscription } from './sync';

export const billingWebhookRoutes = new Hono<AppEnv>();

const MAX_BODY = 512 * 1024;
const MAX_ATTEMPTS = 8;
const LEASE = 2 * 60_000;

/** The events BIZOMAT acts on. Subscribe the webhook destination to exactly these. */
export const HANDLED_EVENTS = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'customer.subscription.trial_will_end',
  'customer.subscription.pending_update_applied',
  'customer.subscription.pending_update_expired',
  'invoice.created',
  'invoice.finalized',
  'invoice.finalization_failed',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.payment_action_required',
  'invoice.marked_uncollectible',
  'invoice.voided',
  'invoice.updated',
  'charge.refunded',
  'charge.dispute.created',
  'charge.dispute.closed',
  'radar.early_fraud_warning.created',
] as const;

billingWebhookRoutes.post('/', async (c) => {
  const cfg = billingConfig(c.env);
  if (!cfg.enabled) return c.json({ error: 'Billing is not configured' }, 503);
  const signature = c.req.header('stripe-signature') ?? '';
  if (!signature) return c.json({ error: 'Missing signature' }, 400);
  const length = Number(c.req.header('content-length') ?? '0');
  if (length > MAX_BODY) return c.json({ error: 'Too large' }, 413);
  // The exact bytes Stripe signed: read once, before anything parses them.
  const raw = await c.req.text();
  if (raw.length > MAX_BODY) return c.json({ error: 'Too large' }, 413);
  const event = await verify(cfg, raw, signature);
  if (!event) return c.json({ error: 'Invalid signature' }, 400);
  if (event.livemode !== (cfg.environment === 'live')) return c.json({ error: 'Event from the other Stripe environment' }, 400);
  const obj = (event.data?.object ?? {}) as { id?: string };
  const t = now();
  const stored = await c.env.DB.prepare(
    "INSERT OR IGNORE INTO billing_events (id, livemode, type, object_id, status, attempts, next_attempt_at, stripe_created, received_at) VALUES (?, ?, ?, ?, 'received', 0, ?, ?, ?)",
  )
    .bind(event.id, event.livemode ? 1 : 0, event.type.slice(0, 100), typeof obj.id === 'string' ? obj.id.slice(0, 255) : null, t, (event.created ?? 0) * 1000, t)
    .run();
  if ((stored.meta?.changes ?? 0) > 0) {
    const p = processEvent(c.env, cfg, event.id).catch(() => undefined);
    try {
      c.executionCtx.waitUntil(p);
    } catch {
      void p;
    }
  }
  return c.json({ received: true });
});

async function verify(cfg: BillingOn, raw: string, signature: string): Promise<Stripe.Event | null> {
  const stripe = stripeFor(cfg);
  const crypto = subtleCrypto();
  for (const secret of cfg.webhookSecrets) {
    try {
      // Stripe's default tolerance: 300 seconds between signing and receipt.
      return await stripe.webhooks.constructEventAsync(raw, signature, secret, 300, crypto);
    } catch {
      // try the previous secret, if any
    }
  }
  return null;
}

/** Claims one stored event and processes it. Returns its final status, or null when someone else holds it. */
export async function processEvent(env: Env, cfg: BillingOn, id: string): Promise<string | null> {
  const db = env.DB;
  const t = now();
  const claim = await db
    .prepare(
      `UPDATE billing_events SET status = 'processing', lease_until = ?, attempts = attempts + 1
        WHERE id = ? AND ((status IN ('received', 'failed') AND next_attempt_at <= ?) OR (status = 'processing' AND lease_until < ?))`,
    )
    .bind(t + LEASE, id, t, t)
    .run();
  if ((claim.meta?.changes ?? 0) === 0) return null;
  const row = await db.prepare('SELECT id, type, object_id, attempts FROM billing_events WHERE id = ?').bind(id).first<{ id: string; type: string; object_id: string | null; attempts: number }>();
  if (!row) return null;
  try {
    const handled = await handle(env, cfg, row.id, row.type, row.object_id);
    const status = handled ? 'processed' : 'ignored';
    await db.prepare('UPDATE billing_events SET status = ?, lease_until = NULL, last_error = NULL, processed_at = ? WHERE id = ?').bind(status, now(), id).run();
    return status;
  } catch (e) {
    const dead = row.attempts >= MAX_ATTEMPTS;
    // Back-off: 1, 2, 4, ... minutes, at most an hour.
    const wait = Math.min(60, 2 ** Math.max(0, row.attempts - 1)) * 60_000;
    await db
      .prepare('UPDATE billing_events SET status = ?, lease_until = NULL, last_error = ?, next_attempt_at = ? WHERE id = ?')
      .bind(dead ? 'dead' : 'failed', redact(stripeMessage(e)), now() + wait, id)
      .run();
    return dead ? 'dead' : 'failed';
  }
}

/** One event: true when it concerned a BIZOMAT company and was recorded, false when it was not ours or not handled. */
async function handle(env: Env, cfg: BillingOn, eventId: string, type: string, objectId: string | null): Promise<boolean> {
  if (!objectId) return false;
  if (type.startsWith('checkout.session.')) return (await syncCheckoutSession(env, cfg, objectId)).companyId !== null;
  if (type.startsWith('customer.subscription.')) return (await syncSubscription(env, cfg, objectId)) !== null;
  if (type.startsWith('invoice.')) {
    await syncInvoice(env, cfg, objectId);
    return true;
  }
  if (type === 'charge.refunded' || type === 'charge.dispute.created' || type === 'charge.dispute.closed' || type === 'radar.early_fraud_warning.created') {
    // The current object, read again: a dispute or a warning names its charge, a charge names its customer.
    const stripe = stripeFor(cfg);
    const obj =
      type === 'charge.refunded'
        ? await stripe.charges.retrieve(objectId)
        : type === 'radar.early_fraud_warning.created'
          ? await stripe.radar.earlyFraudWarnings.retrieve(objectId)
          : await stripe.disputes.retrieve(objectId);
    return recordRiskEvent(env, cfg, type, obj as any);
  }
  void eventId;
  return false;
}

/** The sweep: events still to process (new, failed and due, or a lease that ran out). */
export async function processDueEvents(env: Env, cfg: BillingOn, max = 50): Promise<{ processed: number; failed: number }> {
  const t = now();
  const due = await env.DB.prepare(
    "SELECT id FROM billing_events WHERE (status IN ('received', 'failed') AND next_attempt_at <= ?) OR (status = 'processing' AND lease_until < ?) ORDER BY received_at LIMIT ?",
  )
    .bind(t, t, max)
    .all<{ id: string }>();
  let processed = 0;
  let failed = 0;
  for (const r of due.results) {
    const s = await processEvent(env, cfg, r.id);
    if (s === 'processed' || s === 'ignored') processed++;
    else if (s) failed++;
  }
  return { processed, failed };
}
