// Billing settings (docs/billing/README.md). Every value comes from the environment (Fly secrets WORK_STRIPE_* mapped to
// these names by infrastructure/fly/entrypoint.sh); nothing about prices is written in the code. This module never
// returns, logs or throws a key's value: only whether billing is on, and why not.

import type { Env } from '../env';

export type StripeEnvironment = 'test' | 'live';
export type Interval = 'month' | 'year';
export type Proration = 'create_prorations' | 'always_invoice' | 'none';

export interface BillingOn {
  enabled: true;
  environment: StripeEnvironment;
  secretKey: string;
  /** 'rk' (a restricted key, recommended) or 'sk' (a secret key): shown to platform admins, never the key. */
  keyKind: 'rk' | 'sk';
  publishableKey: string;
  /** The current webhook signing secret first, then the previous one during a roll (Stripe signs with both). */
  webhookSecrets: string[];
  /** The Stripe Price ids of the per-user price: monthly (required) and annual (optional). */
  prices: Partial<Record<Interval, string>>;
  proration: Proration;
  /** Stripe Tax on Checkout and invoices: only after the owner confirms an active GST registration in Stripe. */
  automaticTax: boolean;
  /** Days a company keeps full access after a failed payment while enforcement is on. */
  graceDays: number;
  /** Development and tests only (never with ENVIRONMENT=production): a local stand-in for api.stripe.com. */
  apiBase: URL | null;
}

export interface BillingOff {
  enabled: false;
  /** A plain reason, safe to show to platform admins. Never contains a key. */
  reason: string;
  environment: StripeEnvironment | null;
}

export type BillingConfig = BillingOn | BillingOff;

const SECRET = /^(sk|rk)_(test|live)_[A-Za-z0-9]{8,}$/;
const PUBLISHABLE = /^pk_(test|live)_[A-Za-z0-9]{8,}$/;
const WEBHOOK = /^whsec_[A-Za-z0-9+/=_-]{8,}$/;
export const PRICE_ID = /^price_[A-Za-z0-9]{6,}$/;

type BillingEnv = Pick<
  Env,
  | 'ENVIRONMENT'
  | 'STRIPE_ENVIRONMENT'
  | 'STRIPE_SECRET_KEY'
  | 'STRIPE_PUBLISHABLE_KEY'
  | 'STRIPE_WEBHOOK_SECRET'
  | 'STRIPE_WEBHOOK_SECRET_PREVIOUS'
  | 'STRIPE_PRICE_SEAT_MONTHLY'
  | 'STRIPE_PRICE_SEAT_ANNUAL'
  | 'STRIPE_PRORATION'
  | 'STRIPE_AUTOMATIC_TAX'
  | 'STRIPE_GRACE_DAYS'
  | 'STRIPE_API_BASE'
>;

const off = (reason: string, environment: StripeEnvironment | null = null): BillingOff => ({ enabled: false, reason, environment });

/** Reads and checks the billing settings. Billing is off (and says why) unless every required value is present and of
 * the right kind for the environment: a live key in a test environment, or the reverse, turns billing off. */
export function billingConfig(env: BillingEnv): BillingConfig {
  const environment = (env.STRIPE_ENVIRONMENT ?? '').trim();
  if (!environment) return off('Billing is not set up: STRIPE_ENVIRONMENT is not set.');
  if (environment !== 'test' && environment !== 'live') return off('Billing is off: STRIPE_ENVIRONMENT must be "test" or "live".');
  const mode = environment as StripeEnvironment;
  const secretKey = (env.STRIPE_SECRET_KEY ?? '').trim();
  if (!secretKey) return off('Billing is off: no Stripe API key is set.', mode);
  const s = SECRET.exec(secretKey);
  if (!s) return off('Billing is off: the Stripe API key is not a secret or restricted key.', mode);
  if (s[2] !== mode) return off(mode === 'test' ? 'Billing is off: a live Stripe key is set in the test environment.' : 'Billing is off: a test Stripe key is set in the live environment.', mode);
  const publishableKey = (env.STRIPE_PUBLISHABLE_KEY ?? '').trim();
  const p = PUBLISHABLE.exec(publishableKey);
  if (!p) return off('Billing is off: the Stripe publishable key is missing or not a publishable key.', mode);
  if (p[1] !== mode) return off('Billing is off: the publishable key is for the other Stripe environment.', mode);
  const webhookSecrets = [env.STRIPE_WEBHOOK_SECRET, env.STRIPE_WEBHOOK_SECRET_PREVIOUS].map((v) => (v ?? '').trim()).filter(Boolean);
  if (!webhookSecrets.length) return off('Billing is off: no Stripe webhook signing secret is set.', mode);
  if (webhookSecrets.some((w) => !WEBHOOK.test(w))) return off('Billing is off: a webhook signing secret is not a Stripe signing secret.', mode);
  const monthly = (env.STRIPE_PRICE_SEAT_MONTHLY ?? '').trim();
  const annual = (env.STRIPE_PRICE_SEAT_ANNUAL ?? '').trim();
  if (!monthly) return off('Billing is off: no monthly per-user price (STRIPE_PRICE_SEAT_MONTHLY) is set.', mode);
  if (!PRICE_ID.test(monthly)) return off('Billing is off: STRIPE_PRICE_SEAT_MONTHLY is not a Stripe Price id.', mode);
  if (annual && !PRICE_ID.test(annual)) return off('Billing is off: STRIPE_PRICE_SEAT_ANNUAL is not a Stripe Price id.', mode);
  if (annual && annual === monthly) return off('Billing is off: the monthly and annual prices are the same Price.', mode);
  const prorationRaw = (env.STRIPE_PRORATION ?? '').trim() || 'create_prorations';
  if (!['create_prorations', 'always_invoice', 'none'].includes(prorationRaw)) return off('Billing is off: STRIPE_PRORATION must be create_prorations, always_invoice or none.', mode);
  const graceRaw = (env.STRIPE_GRACE_DAYS ?? '').trim() || '14';
  const graceDays = Number(graceRaw);
  if (!Number.isInteger(graceDays) || graceDays < 0 || graceDays > 60) return off('Billing is off: STRIPE_GRACE_DAYS must be a whole number from 0 to 60.', mode);
  let apiBase: URL | null = null;
  const base = (env.STRIPE_API_BASE ?? '').trim();
  if (base) {
    if (env.ENVIRONMENT === 'production' || mode === 'live') return off('Billing is off: STRIPE_API_BASE is only for development and tests.', mode);
    try {
      apiBase = new URL(base);
    } catch {
      return off('Billing is off: STRIPE_API_BASE is not an address.', mode);
    }
  }
  return {
    enabled: true,
    environment: mode,
    secretKey,
    keyKind: s[1] as 'rk' | 'sk',
    publishableKey,
    webhookSecrets,
    prices: { month: monthly, ...(annual ? { year: annual } : {}) },
    proration: prorationRaw as Proration,
    automaticTax: (env.STRIPE_AUTOMATIC_TAX ?? '').trim() === 'on',
    graceDays,
    apiBase,
  };
}

/** Removes anything shaped like a Stripe key, a signing secret or a bearer token from a message before it is stored or
 * shown. Stripe's own error messages can quote part of a key. */
export function redact(message: string): string {
  return message
    .replace(/\b(sk|rk|pk)_(test|live)_[A-Za-z0-9]+/g, '$1_$2_[redacted]')
    .replace(/\bwhsec_[A-Za-z0-9+/=_-]+/g, 'whsec_[redacted]')
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, 'Bearer [redacted]')
    .slice(0, 300);
}
