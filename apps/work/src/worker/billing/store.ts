// BIZOMAT's own billing records (migrations/0027_billing.sql): settings, the company's Stripe customer, its
// subscription as Stripe last reported it, invoices and the append-only history. Stripe is the source of truth for
// money; these rows are kept in step by src/worker/billing/sync.ts.

import type { Env } from '../env';
import { newId, now } from '../lib/util';
import type { BillingOn, Interval, StripeEnvironment } from './config';
import { checkPrice, stripeFor, type VerifiedPrice } from './stripe';

export type Audience = 'off' | 'admins' | 'everyone';
export type Enforcement = 'off' | 'shadow' | 'on';

/** Statuses in which a subscription bills seats and may change them. */
export const SEAT_STATUSES = ['active', 'trialing', 'past_due', 'unpaid'] as const;
/** Statuses that still count as "the company's subscription" (no new checkout while one of these exists). */
export const OPEN_STATUSES = ['active', 'trialing', 'past_due', 'unpaid', 'incomplete', 'paused'] as const;

export interface SubscriptionRow {
  id: string;
  account_id: string;
  company_id: string;
  environment: StripeEnvironment;
  status: string;
  item_id: string | null;
  price_id: string | null;
  interval: Interval | null;
  quantity: number;
  seat_version: number;
  unit_amount: number | null;
  currency: string | null;
  tax_behavior: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: number;
  cancel_at: number | null;
  canceled_at: number | null;
  ended_at: number | null;
  trial_end: number | null;
  past_due_since: number | null;
  latest_invoice_id: string | null;
  pm_brand: string | null;
  pm_last4: string | null;
  pm_exp_month: number | null;
  pm_exp_year: number | null;
  stripe_created: number | null;
  synced_at: number;
  created_at: number;
}

export interface AccountRow {
  id: string;
  company_id: string;
  environment: StripeEnvironment;
  stripe_customer_id: string;
  created_by: string | null;
  created_at: number;
  updated_at: number;
}

export async function getSetting(db: D1Database, key: string): Promise<string | null> {
  const r = await db.prepare('SELECT value FROM billing_settings WHERE key = ?').bind(key).first<{ value: string }>();
  return r?.value ?? null;
}

export function setSettingStmt(db: D1Database, key: string, value: string, by: string | null) {
  return db
    .prepare('INSERT INTO billing_settings (key, value, updated_by, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at')
    .bind(key, value, by, now());
}

export async function audience(db: D1Database): Promise<Audience> {
  const v = await getSetting(db, 'audience');
  return v === 'admins' || v === 'everyone' ? v : 'off';
}

export async function enforcement(db: D1Database): Promise<Enforcement> {
  const v = await getSetting(db, 'enforcement');
  return v === 'shadow' || v === 'on' ? v : 'off';
}

export async function accountOf(db: D1Database, companyId: string, environment: StripeEnvironment): Promise<AccountRow | null> {
  return db.prepare('SELECT * FROM billing_accounts WHERE company_id = ? AND environment = ?').bind(companyId, environment).first<AccountRow>();
}

export async function accountByCustomer(db: D1Database, customerId: string): Promise<AccountRow | null> {
  return db.prepare('SELECT * FROM billing_accounts WHERE stripe_customer_id = ?').bind(customerId).first<AccountRow>();
}

/** The company's subscription: the newest one that is still open, else the newest one at all. */
export async function currentSubscription(db: D1Database, companyId: string, environment: StripeEnvironment): Promise<SubscriptionRow | null> {
  const open = await db
    .prepare(`SELECT * FROM billing_subscriptions WHERE company_id = ? AND environment = ? AND status IN (${OPEN_STATUSES.map(() => '?').join(',')}) ORDER BY created_at DESC LIMIT 1`)
    .bind(companyId, environment, ...OPEN_STATUSES)
    .first<SubscriptionRow>();
  if (open) return open;
  return db.prepare('SELECT * FROM billing_subscriptions WHERE company_id = ? AND environment = ? ORDER BY created_at DESC LIMIT 1').bind(companyId, environment).first<SubscriptionRow>();
}

/** One line of the company's billing history; written once per (kind, ref). */
export function historyStmt(db: D1Database, e: { companyId: string; environment: StripeEnvironment; kind: string; summary: string; ref?: string | null; actorId?: string | null }) {
  return db
    .prepare('INSERT OR IGNORE INTO billing_history (id, company_id, environment, kind, summary, ref, actor_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), e.companyId, e.environment, e.kind.slice(0, 40), e.summary.slice(0, 300), e.ref ?? null, e.actorId ?? null, now());
}

const PRICE_TTL = 6 * 60 * 60 * 1000;

/** The configured per-user price for an interval, checked against Stripe (cached for six hours; `fresh` reads Stripe
 * again). null when no price is configured for that interval. */
export async function verifiedPrice(env: Env, cfg: BillingOn, interval: Interval, opts: { fresh?: boolean } = {}): Promise<VerifiedPrice | null> {
  const id = cfg.prices[interval];
  if (!id) return null;
  const key = `price:${cfg.environment}:${id}`;
  if (!opts.fresh) {
    const cached = await getSetting(env.DB, key);
    if (cached) {
      try {
        const v = JSON.parse(cached) as VerifiedPrice;
        if (v.id === id && v.interval === interval && Date.now() - v.verifiedAt < PRICE_TTL) return v;
      } catch {
        // read again below
      }
    }
  }
  const price = await stripeFor(cfg).prices.retrieve(id, { expand: ['product'] });
  const v = checkPrice(cfg, interval, price);
  await setSettingStmt(env.DB, key, JSON.stringify(v), null).run();
  return v;
}

/** Money for people: "A$10.00". Amounts are Stripe's, in cents. */
export function money(cents: number | null | undefined, currency = 'aud'): string {
  if (typeof cents !== 'number') return '';
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const prefix = currency.toLowerCase() === 'aud' ? 'A$' : `${currency.toUpperCase()} `;
  return `${sign}${prefix}${(abs / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
