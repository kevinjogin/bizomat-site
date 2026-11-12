// Money without floating point. Amounts are stored as they always were (JSON numbers in items.values_json, which keep
// the decimal text the person entered), but every total, difference and percentage is computed on integers: each
// amount is read from its decimal text into BigInt units of 1/10000 (four decimal places), and only the final figure is
// rounded, half away from zero, to the currency's minor unit for display.
//
// Different currencies are never added together: totals are kept per currency code.

export interface CurrencyInfo {
  code: string;
  name: string;
  /** Digits after the decimal point (ISO 4217 minor unit). */
  minor: number;
  /** Symbol for screens; reports always show the ISO code too. */
  symbol: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'AUD', name: 'Australian Dollar', minor: 2, symbol: 'A$' },
  { code: 'USD', name: 'US Dollar', minor: 2, symbol: 'US$' },
  { code: 'INR', name: 'Indian Rupee', minor: 2, symbol: '₹' },
  { code: 'EUR', name: 'Euro', minor: 2, symbol: '€' },
  { code: 'GBP', name: 'British Pound', minor: 2, symbol: '£' },
  { code: 'NZD', name: 'New Zealand Dollar', minor: 2, symbol: 'NZ$' },
  { code: 'CAD', name: 'Canadian Dollar', minor: 2, symbol: 'CA$' },
  { code: 'SGD', name: 'Singapore Dollar', minor: 2, symbol: 'S$' },
  { code: 'JPY', name: 'Japanese Yen', minor: 0, symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', minor: 2, symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', minor: 2, symbol: 'CN¥' },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export function isSupportedCurrency(code: unknown): code is string {
  return typeof code === 'string' && CURRENCY_CODES.includes(code);
}

export function currencyInfo(code: string | null | undefined): CurrencyInfo | null {
  return CURRENCIES.find((c) => c.code === code) ?? null;
}

/** Internal fixed scale: 4 decimal places. */
export const SCALE = 4;

/**
 * The exact decimal text of a number or numeric string, without exponent. JavaScript prints a JSON number with the
 * shortest text that reads back to the same double, which for amounts entered by people (up to 15 significant digits)
 * is exactly the text they typed.
 */
export function decimalText(value: number | string): string | null {
  let s = typeof value === 'number' ? (Number.isFinite(value) ? String(value) : '') : String(value).trim().replace(/[,\s_]/g, '');
  if (!s) return null;
  const m = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(s);
  if (!m || (!m[2] && !m[3])) return null;
  const sign = m[1] === '-' ? '-' : '';
  let int = m[2] || '0';
  let frac = m[3] || '';
  const exp = m[4] ? Number.parseInt(m[4], 10) : 0;
  if (exp > 0) {
    frac = frac.padEnd(exp, '0');
    int = int + frac.slice(0, exp);
    frac = frac.slice(exp);
  } else if (exp < 0) {
    const pad = int.padStart(-exp + 1, '0');
    frac = pad.slice(pad.length + exp) + frac;
    int = pad.slice(0, pad.length + exp);
  }
  int = int.replace(/^0+(?=\d)/, '');
  frac = frac.replace(/0+$/, '');
  s = sign + int + (frac ? `.${frac}` : '');
  return s === '-0' ? '0' : s;
}

/** Round a decimal string half away from zero to `digits` places and return BigInt units of 10^-digits. */
function toUnits(text: string, digits: number): bigint {
  const neg = text.startsWith('-');
  const t = neg ? text.slice(1) : text;
  const [int, frac = ''] = t.split('.');
  const kept = frac.slice(0, digits).padEnd(digits, '0');
  let units = BigInt((int || '0') + kept);
  const next = frac.charCodeAt(digits);
  if (next >= 53 /* '5' */ && next <= 57) units += 1n;
  return neg ? -units : units;
}

/** An amount in internal units (1/10000), or null when the value is not a number. */
export function toScaled(value: unknown): bigint | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const text = decimalText(value);
  if (text == null) return null;
  return toUnits(text, SCALE);
}

/** Internal units rounded to `digits` decimal places, as a decimal string. */
export function scaledToDecimal(scaled: bigint, digits: number): string {
  const drop = SCALE - digits;
  let v = scaled;
  if (drop > 0) {
    const f = 10n ** BigInt(drop);
    const neg = v < 0n;
    const abs = neg ? -v : v;
    let q = abs / f;
    if ((abs % f) * 2n >= f) q += 1n;
    v = neg ? -q : q;
  } else if (drop < 0) v = v * 10n ** BigInt(-drop);
  const neg = v < 0n;
  const abs = (neg ? -v : v).toString().padStart(digits + 1, '0');
  const int = digits ? abs.slice(0, -digits) : abs;
  const frac = digits ? abs.slice(-digits) : '';
  const out = frac ? `${int}.${frac}` : int;
  return neg && /[1-9]/.test(out) ? `-${out}` : out;
}

export function sumScaled(values: Iterable<unknown>): { total: bigint; count: number } {
  let total = 0n;
  let count = 0;
  for (const v of values) {
    const s = toScaled(v);
    if (s == null) continue;
    total += s;
    count++;
  }
  return { total, count };
}

/** a / b as a percentage with one decimal, or null when b is zero. Integer arithmetic throughout. */
export function percent(a: bigint, b: bigint): string | null {
  if (b === 0n) return null;
  const tenths = (a * 1000n) / b;
  const rem = (a * 1000n) % b;
  const rounded = rem * 2n >= b ? tenths + 1n : tenths;
  const neg = rounded < 0n;
  const abs = neg ? -rounded : rounded;
  return `${neg ? '-' : ''}${abs / 10n}.${abs % 10n}`;
}

function groupThousands(int: string): string {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * "AUD 1,234.50": code first, so a figure is never mistaken for another currency. Without a currency the number is
 * shown with two decimals and no code.
 */
export function formatScaled(scaled: bigint, code: string | null | undefined, opts: { symbol?: boolean; digits?: number } = {}): string {
  const info = currencyInfo(code ?? null);
  const digits = opts.digits ?? info?.minor ?? 2;
  const dec = scaledToDecimal(scaled, digits);
  const neg = dec.startsWith('-');
  const [int, frac] = (neg ? dec.slice(1) : dec).split('.');
  const body = groupThousands(int) + (frac ? `.${frac}` : '');
  if (!info) return `${neg ? '-' : ''}${body}`;
  const prefix = opts.symbol ? info.symbol : info.code;
  return `${neg ? '-' : ''}${prefix}${opts.symbol && info.symbol.length === 1 ? '' : ' '}${body}`;
}

export function formatMoney(value: unknown, code: string | null | undefined, opts: { symbol?: boolean; digits?: number } = {}): string {
  const s = toScaled(value);
  return s == null ? '' : formatScaled(s, code, opts);
}

/** Totals per currency, never mixed. */
export class MoneyTotals {
  private totals = new Map<string, bigint>();
  add(code: string | null | undefined, value: unknown) {
    const s = toScaled(value);
    if (s == null) return;
    const k = code || '';
    this.totals.set(k, (this.totals.get(k) ?? 0n) + s);
  }
  get(code: string | null | undefined): bigint {
    return this.totals.get(code || '') ?? 0n;
  }
  entries(): { currency: string | null; scaled: bigint }[] {
    return Array.from(this.totals.entries()).map(([k, v]) => ({ currency: k || null, scaled: v }));
  }
  get size() {
    return this.totals.size;
  }
}

/**
 * Normalise a money input for storage: a finite number with at most 4 decimal places and 15 significant digits, so
 * the stored JSON number keeps exactly the decimal text that was entered.
 */
export function normalizeAmount(value: unknown): { ok: true; value: number | null } | { ok: false; error: string } {
  if (value == null || value === '') return { ok: true, value: null };
  if (typeof value !== 'number' && typeof value !== 'string') return { ok: false, error: 'Expected an amount' };
  const text = decimalText(value);
  if (text == null) return { ok: false, error: 'Expected an amount' };
  const [int, frac = ''] = text.replace('-', '').split('.');
  if (frac.length > SCALE) return { ok: false, error: `Use at most ${SCALE} decimal places` };
  if ((int.replace(/^0+/, '') + frac).length > 15) return { ok: false, error: 'Amount is too large' };
  return { ok: true, value: Number(text) };
}
