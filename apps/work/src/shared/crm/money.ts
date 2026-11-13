// Money in the CRM: integer minor units of the organisation's currency (cents for AUD, yen for JPY) in the database
// and the API. People type and read decimal amounts; these helpers convert without floating-point error.

import { currencyInfo, decimalText } from '../money';

export function minorDigits(currency: string): number {
  return currencyInfo(currency)?.minor ?? 2;
}

/** "1,234.5" or 1234.5 in AUD -> 123450. Null for an empty value; throws on an invalid amount. */
export function toMinor(value: unknown, currency: string): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'number' && typeof value !== 'string') throw new Error('Amount must be a number');
  const text = decimalText(value);
  if (text === null) throw new Error('Amount must be a number');
  const neg = text.startsWith('-');
  const [int, frac = ''] = (neg ? text.slice(1) : text).split('.');
  const digits = minorDigits(currency);
  const kept = frac.slice(0, digits).padEnd(digits, '0');
  let units = BigInt(int || '0') * 10n ** BigInt(digits) + BigInt(kept || '0');
  // half away from zero on the first dropped digit
  if (frac.length > digits && Number(frac[digits]) >= 5) units += 1n;
  const out = Number(neg ? -units : units);
  if (!Number.isSafeInteger(out) || Math.abs(out) > 1e15) throw new Error('Amount is too large');
  return out;
}

/** 123450 in AUD -> "1234.50". */
export function fromMinor(minor: number | null | undefined, currency: string): string {
  if (minor === null || minor === undefined) return '';
  const digits = minorDigits(currency);
  const neg = minor < 0;
  const s = String(Math.abs(Math.trunc(minor))).padStart(digits + 1, '0');
  const out = digits ? `${s.slice(0, -digits)}.${s.slice(-digits)}` : s;
  return neg ? `-${out}` : out;
}

/** For screens: "$1,234.50", "$76,000" (whole amounts without cents, at any size), or "$1.2M" when compact. */
export function formatMoney(minor: number | null | undefined, currency: string, opts: { compact?: boolean } = {}): string {
  if (minor === null || minor === undefined) return '';
  const digits = minorDigits(currency);
  const major = minor / 10 ** digits;
  try {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      notation: opts.compact ? 'compact' : 'standard',
      maximumFractionDigits: opts.compact ? 1 : digits,
      minimumFractionDigits: opts.compact || minor % 10 ** digits === 0 ? 0 : digits,
    }).format(major);
  } catch {
    return `${currency} ${fromMinor(minor, currency)}`;
  }
}

/** A line item total in minor units: unit price x quantity (thousandths) less the discount (basis points). */
export function lineTotal(unitPrice: number, quantityMilli: number, discountBp: number): number {
  const gross = BigInt(Math.trunc(unitPrice)) * BigInt(Math.trunc(quantityMilli));
  const net = gross * BigInt(10_000 - Math.trunc(discountBp));
  // divide by 1000 (quantity) * 10000 (basis points), rounding half away from zero
  const div = 10_000_000n;
  const q = net / div;
  const r = net % div;
  const abs = r < 0n ? -r : r;
  return Number(abs * 2n >= div ? q + (net < 0n ? -1n : 1n) : q);
}

/** Weighted value: value x probability%, rounded to the minor unit. */
export function weighted(value: number, probability: number): number {
  return Math.round((value * probability) / 100);
}
