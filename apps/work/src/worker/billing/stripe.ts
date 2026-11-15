// The one place BIZOMAT talks to Stripe (docs/billing/README.md). The official SDK with its fetch client, so it runs
// on Node and in workerd; the API version is the one the SDK pins. Every object read back is checked against the
// configured environment (test or live): a live object in test, or the reverse, is refused, which also catches a key
// for the wrong environment swapped in somewhere between this server and Stripe.

import Stripe from 'stripe';
import type { BillingOn, Interval } from './config';
import { redact } from './config';

export type { Stripe };

export class BillingError extends Error {
  constructor(
    message: string,
    readonly code: 'mode' | 'price' | 'stripe' | 'state' = 'stripe',
  ) {
    super(message);
  }
}

/** A Stripe client for this request. The global fetch is looked up at call time (tests replace it). */
export function stripeFor(cfg: BillingOn): Stripe {
  const opts: NonNullable<ConstructorParameters<typeof Stripe>[1]> = {
    httpClient: Stripe.createFetchHttpClient((input: any, init?: any) => fetch(input, init)),
    maxNetworkRetries: 2,
    timeout: 20_000,
    telemetry: false,
    appInfo: { name: 'BIZOMAT ERP billing', url: 'https://bizomat.ai' },
  };
  if (cfg.apiBase) {
    const protocol = cfg.apiBase.protocol.replace(':', '') as 'http' | 'https';
    opts.host = cfg.apiBase.hostname;
    opts.port = Number(cfg.apiBase.port || (protocol === 'https' ? 443 : 80));
    opts.protocol = protocol;
  }
  return new Stripe(cfg.secretKey, opts);
}

/** Web Crypto for webhook signatures (the same on Node and in workerd). */
export const subtleCrypto = () => Stripe.createSubtleCryptoProvider();

/** Refuses an object from the other Stripe environment. */
export function checkMode<T extends { livemode?: boolean | null }>(cfg: BillingOn, obj: T): T {
  if (typeof obj?.livemode === 'boolean' && obj.livemode !== (cfg.environment === 'live')) {
    throw new BillingError(cfg.environment === 'test' ? 'Stripe answered with a live object while billing is in test mode.' : 'Stripe answered with a test object while billing is in live mode.', 'mode');
  }
  return obj;
}

/** A short, safe message for a failed Stripe call: never a key, never request contents. */
export function stripeMessage(e: unknown): string {
  if (e instanceof BillingError) return e.message;
  const anyE = e as { type?: string; message?: string; code?: string; statusCode?: number };
  if (anyE && typeof anyE.message === 'string') return redact(`${anyE.code ? `${anyE.code}: ` : ''}${anyE.message}`);
  return 'Stripe could not be reached.';
}

export const idOf = (v: string | { id: string } | null | undefined): string | null => (typeof v === 'string' ? v : v?.id ?? null);
export const ms = (seconds: number | null | undefined): number | null => (typeof seconds === 'number' ? seconds * 1000 : null);

/** The per-user price as Stripe defines it, checked. ok is false (with a reason) when it cannot be sold as a per-user
 * recurring AUD price in this environment. */
export interface VerifiedPrice {
  id: string;
  interval: Interval;
  ok: boolean;
  problem: string | null;
  unitAmount: number | null;
  currency: string | null;
  /** Stripe's tax behaviour: 'inclusive' (GST in the price), 'exclusive' (GST added), 'unspecified'. */
  taxBehavior: string | null;
  productName: string | null;
  verifiedAt: number;
}

export function checkPrice(cfg: BillingOn, interval: Interval, p: Stripe.Price): VerifiedPrice {
  const product = typeof p.product === 'object' && p.product && !('deleted' in p.product && p.product.deleted) ? (p.product as Stripe.Product) : null;
  const base = {
    id: p.id,
    interval,
    unitAmount: p.unit_amount ?? null,
    currency: p.currency ?? null,
    taxBehavior: p.tax_behavior ?? null,
    productName: product?.name ?? null,
    verifiedAt: Date.now(),
  };
  const problem =
    p.livemode !== (cfg.environment === 'live')
      ? `This price belongs to the other Stripe environment.`
      : !p.active
        ? 'This price is archived in Stripe.'
        : p.type !== 'recurring' || !p.recurring
          ? 'This price is not a recurring price.'
          : p.recurring.interval !== interval || (p.recurring.interval_count ?? 1) !== 1
            ? `This price is not billed every ${interval}.`
            : p.recurring.usage_type !== 'licensed'
              ? 'This price is metered; a per-user price must be licensed (charged by quantity).'
              : p.billing_scheme !== 'per_unit'
                ? 'This price is tiered; a per-user price must be "per unit".'
                : p.currency !== 'aud'
                  ? 'This price is not in Australian dollars (AUD).'
                  : typeof p.unit_amount !== 'number' || p.unit_amount <= 0
                    ? 'This price has no amount per user.'
                    : product && !product.active
                      ? 'The product of this price is archived in Stripe.'
                      : // Nobody is charged real money until the owner has decided how GST applies: a live price must say
                        // whether GST is included in it or added to it (Stripe's tax behaviour; set once, then fixed).
                        cfg.environment === 'live' && p.tax_behavior !== 'inclusive' && p.tax_behavior !== 'exclusive'
                        ? 'This price does not say whether GST is included or added (its tax behaviour in Stripe is not set).'
                        : null;
  return { ...base, ok: !problem, problem };
}
