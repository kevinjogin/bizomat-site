// The platform console's billing API (/api/admin/billing, platform admins; changes are founder only and audited).
// It shows whether billing is on and why not (never a key), the configured prices as Stripe defines them, the
// switches (who may subscribe; enforcement), grants, subscriptions and webhook events, and runs reconciliation.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { body, clientIp, HttpError, newId, notFound, now } from '../lib/util';
import { auditStmt } from '../services/audit';
import { billingConfig, billingLocked, FREE_MESSAGE, type BillingOn } from './config';
import { audience, enforcement, getSetting, SEAT_STATUSES, setSettingStmt, verifiedPrice } from './store';
import { syncSeats } from './seats';
import { stripeMessage } from './stripe';
import { syncCheckoutSession, syncSubscription } from './sync';
import { HANDLED_EVENTS, processDueEvents, processEvent } from './webhook';

export const adminBillingRoutes = new Hono<AppEnv>();

const founderOnly = (c: Context<AppEnv>) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can do this.');
};

adminBillingRoutes.get('/overview', async (c) => {
  const db = c.env.DB;
  const cfg = billingConfig(c.env);
  let prices: unknown = null;
  if (cfg.enabled) {
    const out: Record<string, unknown> = {};
    for (const interval of ['month', 'year'] as const) {
      try {
        out[interval] = await verifiedPrice(c.env, cfg, interval);
      } catch (e) {
        out[interval] = { error: stripeMessage(e) };
      }
    }
    prices = out;
  }
  const subs = await db.prepare('SELECT environment, status, COUNT(*) AS n, SUM(quantity) AS seats FROM billing_subscriptions GROUP BY environment, status ORDER BY environment, status').all();
  const events = await db.prepare('SELECT status, COUNT(*) AS n FROM billing_events GROUP BY status').all();
  const problems = await db.prepare("SELECT id, type, status, attempts, last_error, received_at FROM billing_events WHERE status IN ('failed', 'dead') ORDER BY received_at DESC LIMIT 50").all();
  const seatFailures = await db.prepare("SELECT s.company_id, co.name AS company, s.from_quantity, s.to_quantity, s.error, s.created_at FROM billing_seat_changes s LEFT JOIN co_companies co ON co.id = s.company_id WHERE s.status = 'failed' ORDER BY s.created_at DESC LIMIT 20").all();
  const companies = await db
    .prepare(
      `SELECT s.company_id, co.name AS company, s.environment, s.status, s.interval, s.quantity, s.cancel_at_period_end, s.current_period_end, s.synced_at,
              (SELECT COUNT(*) FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = s.company_id AND u.disabled_at IS NULL) AS billable
         FROM billing_subscriptions s LEFT JOIN co_companies co ON co.id = s.company_id
        ORDER BY s.created_at DESC LIMIT 200`,
    )
    .all();
  const grants = await db
    .prepare('SELECT g.id, g.company_id, co.name AS company, g.kind, g.reason, g.starts_at, g.ends_at, g.revoked_at, u.name AS granted_by FROM billing_grants g LEFT JOIN co_companies co ON co.id = g.company_id LEFT JOIN users u ON u.id = g.granted_by ORDER BY g.created_at DESC LIMIT 200')
    .all();
  const shadow = await db.prepare('SELECT d.company_id, co.name AS company, SUM(d.count) AS writes FROM billing_shadow_denials d LEFT JOIN co_companies co ON co.id = d.company_id WHERE d.day >= ? GROUP BY d.company_id ORDER BY writes DESC LIMIT 50').bind(new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)).all();
  return c.json({
    config: cfg.enabled
      ? { enabled: true, environment: cfg.environment, keyKind: cfg.keyKind, webhookSecrets: cfg.webhookSecrets.length, proration: cfg.proration, automaticTax: cfg.automaticTax, graceDays: cfg.graceDays, annualOffered: !!cfg.prices.year }
      : { enabled: false, environment: cfg.environment, reason: cfg.reason },
    settings: { audience: await audience(db), enforcement: await enforcement(db) },
    // Free mode (BIZOMAT_BILLING_LOCK): the switches below are stored but have no effect, and cannot be turned on.
    locked: billingLocked(c.env),
    prices,
    handledEvents: HANDLED_EVENTS,
    subscriptions: subs.results,
    companies: companies.results,
    events: events.results,
    problems: problems.results,
    seatFailures: seatFailures.results,
    grants: grants.results,
    shadow: shadow.results,
  });
});

adminBillingRoutes.put('/settings', async (c) => {
  founderOnly(c);
  const input = await body(c, z.object({ audience: z.enum(['off', 'admins', 'everyone']).optional(), enforcement: z.enum(['off', 'shadow', 'on']).optional() }));
  // Free mode: subscriptions cannot be opened and enforcement cannot be turned on; switching either off is allowed.
  if (billingLocked(c.env) && ((input.audience && input.audience !== 'off') || (input.enforcement && input.enforcement !== 'off'))) {
    throw new HttpError(403, `${FREE_MESSAGE} The lock (BIZOMAT_BILLING_LOCK) is set on the server, so subscriptions and enforcement stay off.`, { code: 'BILLING_LOCKED' });
  }
  const db = c.env.DB;
  const me = c.get('user').id;
  const stmts = [];
  for (const key of ['audience', 'enforcement'] as const) {
    const v = input[key];
    if (v === undefined) continue;
    const before = (await getSetting(db, key)) ?? 'off';
    if (before === v) continue;
    stmts.push(setSettingStmt(db, key, v, me), auditStmt(db, { actorId: me, action: `billing.${key}_changed`, targetType: 'billing', targetId: key, metadata: { from: before, to: v }, ip: clientIp(c) }));
  }
  if (stmts.length) await db.batch(stmts);
  return c.json({ audience: await audience(db), enforcement: await enforcement(db) });
});

adminBillingRoutes.post('/grants', async (c) => {
  founderOnly(c);
  const input = await body(c, z.object({ companyId: z.string().min(1).max(64), kind: z.enum(['founding', 'comp', 'manual']), reason: z.string().trim().min(3).max(300), endsAt: z.number().int().positive().nullable().optional() }));
  const db = c.env.DB;
  const co = await db.prepare('SELECT id FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(input.companyId).first();
  if (!co) throw notFound('Registered company');
  if (input.endsAt && input.endsAt <= now()) throw new HttpError(400, 'The end date must be in the future.');
  const id = newId();
  const me = c.get('user').id;
  await db.batch([
    db.prepare('INSERT INTO billing_grants (id, company_id, kind, reason, starts_at, ends_at, granted_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, input.companyId, input.kind, input.reason, now(), input.endsAt ?? null, me, now()),
    auditStmt(db, { actorId: me, action: 'billing.grant_added', targetType: 'company', targetId: input.companyId, metadata: { kind: input.kind, endsAt: input.endsAt ?? null }, ip: clientIp(c) }),
  ]);
  return c.json({ id }, 201);
});

adminBillingRoutes.post('/grants/:id/revoke', async (c) => {
  founderOnly(c);
  const db = c.env.DB;
  const g = await db.prepare('SELECT id, company_id FROM billing_grants WHERE id = ? AND revoked_at IS NULL').bind(c.req.param('id')).first<{ id: string; company_id: string }>();
  if (!g) throw notFound('Grant');
  const me = c.get('user').id;
  await db.batch([
    db.prepare('UPDATE billing_grants SET revoked_at = ?, revoked_by = ? WHERE company_id = ? AND id = ? AND revoked_at IS NULL').bind(now(), me, g.company_id, g.id),
    auditStmt(db, { actorId: me, action: 'billing.grant_revoked', targetType: 'company', targetId: g.company_id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

function requireOn(c: Context<AppEnv>): BillingOn {
  const cfg = billingConfig(c.env);
  if (!cfg.enabled) throw new HttpError(409, cfg.reason);
  return cfg;
}

adminBillingRoutes.post('/events/:id/reprocess', async (c) => {
  founderOnly(c);
  const cfg = requireOn(c);
  const db = c.env.DB;
  const id = c.req.param('id');
  const r = await db.prepare("UPDATE billing_events SET status = 'failed', next_attempt_at = 0, lease_until = NULL WHERE id = ? AND status IN ('failed', 'dead', 'ignored', 'processed')").bind(id).run();
  if ((r.meta?.changes ?? 0) === 0) throw notFound('Event');
  await auditStmt(db, { actorId: c.get('user').id, action: 'billing.event_reprocessed', targetType: 'billing_event', targetId: id, ip: clientIp(c) }).run();
  return c.json({ status: await processEvent(c.env, cfg, id) });
});

adminBillingRoutes.post('/prices/verify', async (c) => {
  const cfg = requireOn(c);
  const out: Record<string, unknown> = {};
  for (const interval of ['month', 'year'] as const) {
    try {
      out[interval] = await verifiedPrice(c.env, cfg, interval, { fresh: true });
    } catch (e) {
      out[interval] = { error: stripeMessage(e) };
    }
  }
  return c.json(out);
});

adminBillingRoutes.post('/reconcile', async (c) => {
  founderOnly(c);
  const cfg = requireOn(c);
  const r = await reconcile(c.env, cfg, { full: true });
  await auditStmt(c.env.DB, { actorId: c.get('user').id, action: 'billing.reconciled', targetType: 'billing', targetId: cfg.environment, metadata: r, ip: clientIp(c) }).run();
  return c.json(r);
});

/**
 * Reconciliation (the 15-minute cron, and the console's button): events still to process; every subscription's seats
 * against the members (a missed membership change is caught here); subscriptions not read from Stripe for a day (a
 * missed webhook is repaired even after Stripe stops retrying); and open Checkout sessions older than an hour.
 */
export async function reconcile(env: Env, cfg: BillingOn, opts: { full?: boolean } = {}) {
  const db = env.DB;
  const events = await processDueEvents(env, cfg, opts.full ? 200 : 50);
  const seats = { applied: 0, failed: 0, checked: 0 };
  const subs = await db
    .prepare(`SELECT DISTINCT company_id FROM billing_subscriptions WHERE environment = ? AND status IN (${SEAT_STATUSES.map(() => '?').join(',')}) LIMIT ?`)
    .bind(cfg.environment, ...SEAT_STATUSES, opts.full ? 1000 : 200)
    .all<{ company_id: string }>();
  for (const s of subs.results) {
    seats.checked++;
    const r = await syncSeats(env, s.company_id, { reason: 'reconcile', cfg });
    if (r.status === 'applied') seats.applied++;
    if (r.status === 'failed') seats.failed++;
  }
  let refreshed = 0;
  let refreshFailed = 0;
  const stale = await db
    .prepare("SELECT id FROM billing_subscriptions WHERE environment = ? AND status NOT IN ('canceled', 'incomplete_expired') AND synced_at < ? ORDER BY synced_at LIMIT ?")
    .bind(cfg.environment, now() - 86_400_000, opts.full ? 200 : 20)
    .all<{ id: string }>();
  for (const s of stale.results) {
    try {
      await syncSubscription(env, cfg, s.id);
      refreshed++;
    } catch {
      refreshFailed++;
    }
  }
  const sessions = await db
    .prepare("SELECT id FROM billing_checkout_sessions WHERE environment = ? AND status = 'open' AND created_at < ? ORDER BY created_at LIMIT ?")
    .bind(cfg.environment, now() - 3600_000, opts.full ? 100 : 20)
    .all<{ id: string }>();
  let sessionsChecked = 0;
  for (const s of sessions.results) {
    try {
      await syncCheckoutSession(env, cfg, s.id);
      sessionsChecked++;
    } catch {
      // tried again next run
    }
  }
  return { events, seats, refreshed, refreshFailed, sessionsChecked };
}

/** The cron's billing step: nothing at all while billing is off. */
export async function runBillingScheduled(env: Env) {
  const cfg = billingConfig(env);
  if (!cfg.enabled) return { billing: 'off' };
  return reconcile(env, cfg);
}
