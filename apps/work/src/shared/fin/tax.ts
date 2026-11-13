// Australian GST for BIZOMAT Finance: the tax codes a business workspace starts with, the BAS labels each counts
// toward, and the arithmetic. Checked against the ATO's guidance on 13 Nov 2026:
//   * GST is 10%; a GST-inclusive price contains one-eleventh GST;
//   * Simpler BAS (the default for GST turnover under $10 million) reports G1, 1A and 1B; full reporting adds G2, G3,
//     G10 and G11 (ato.gov.au, "GST reporting methods");
//   * G1 total sales and G10/G11 purchases include GST; 1A is GST on sales, 1B GST on purchases.
// The figures help a person prepare a BAS. BIZOMAT does not lodge it, and this is not certified tax software.

export const BAS_LABELS = {
  G1: 'Total sales (including any GST)',
  G2: 'Export sales',
  G3: 'Other GST-free sales',
  G10: 'Capital purchases (including any GST)',
  G11: 'Non-capital purchases (including any GST)',
  '1A': 'GST on sales',
  '1B': 'GST on purchases',
} as const;
export type BasLabel = keyof typeof BAS_LABELS;
export const BAS_ORDER: BasLabel[] = ['G1', 'G2', 'G3', 'G10', 'G11', '1A', '1B'];
/** Simpler BAS reports only these. */
export const SIMPLER_BAS: BasLabel[] = ['G1', '1A', '1B'];

export type TaxDirection = 'sales' | 'purchases' | 'both';

export interface TaxCodeDef {
  key: string;
  code: string;
  name: string;
  rateBp: number;
  direction: TaxDirection;
  bas: BasLabel[];
}

/** Tax codes a business workspace starts with. Each can be renamed or archived, and more added. */
export const DEFAULT_TAX_CODES: TaxCodeDef[] = [
  { key: 'gst_sales', code: 'GST', name: 'GST on income', rateBp: 1000, direction: 'sales', bas: ['G1', '1A'] },
  { key: 'free_sales', code: 'FRE', name: 'GST-free income', rateBp: 0, direction: 'sales', bas: ['G1', 'G3'] },
  { key: 'export', code: 'EXP', name: 'GST-free exports', rateBp: 0, direction: 'sales', bas: ['G1', 'G2'] },
  { key: 'input_sales', code: 'ITS', name: 'Input-taxed income', rateBp: 0, direction: 'sales', bas: ['G1'] },
  { key: 'gst_purchases', code: 'GSTP', name: 'GST on expenses', rateBp: 1000, direction: 'purchases', bas: ['G11', '1B'] },
  { key: 'capital', code: 'CAP', name: 'GST on capital purchases', rateBp: 1000, direction: 'purchases', bas: ['G10', '1B'] },
  { key: 'free_purchases', code: 'FREP', name: 'GST-free expenses', rateBp: 0, direction: 'purchases', bas: ['G11'] },
  { key: 'capital_free', code: 'CAPF', name: 'GST-free capital purchases', rateBp: 0, direction: 'purchases', bas: ['G10'] },
  { key: 'input_purchases', code: 'ITP', name: 'Input-taxed expenses (no GST credit)', rateBp: 0, direction: 'purchases', bas: ['G11'] },
  { key: 'bas_excluded', code: 'BASX', name: 'BAS excluded', rateBp: 0, direction: 'both', bas: [] },
];

export type TaxMode = 'inclusive' | 'exclusive' | 'none';
export const TAX_MODES: TaxMode[] = ['inclusive', 'exclusive', 'none'];
export const TAX_MODE_LABELS: Record<TaxMode, string> = { inclusive: 'Amounts include GST', exclusive: 'Amounts exclude GST', none: 'No GST' };

/** a / b rounded to the nearest whole number, halves away from zero (cents: the ATO rounds to the nearest cent). */
export function divRound(a: bigint, b: bigint): bigint {
  const neg = a < 0n !== b < 0n;
  const x = a < 0n ? -a : a;
  const y = b < 0n ? -b : b;
  const q = (2n * x + y) / (2n * y);
  return neg ? -q : q;
}

/**
 * One amount split into net and tax at a rate (basis points): an inclusive amount holds rate/(1+rate) of tax (1/11
 * at 10%), an exclusive one adds rate on top. Whole cents, rounded once per line.
 */
export function splitTax(amount: number, rateBp: number, mode: TaxMode): { net: number; tax: number; gross: number } {
  if (!Number.isSafeInteger(amount)) throw new Error('Amount must be whole cents');
  if (mode === 'none' || !rateBp) return { net: amount, tax: 0, gross: amount };
  const a = BigInt(amount);
  const r = BigInt(rateBp);
  if (mode === 'inclusive') {
    const tax = Number(divRound(a * r, 10_000n + r));
    return { net: amount - tax, tax, gross: amount };
  }
  const tax = Number(divRound(a * r, 10_000n));
  return { net: amount, tax, gross: amount + tax };
}

/** Whether a tax code may be used on a sale (money in) or a purchase (money out). */
export function codeFits(direction: TaxDirection, use: 'sales' | 'purchases'): boolean {
  return direction === 'both' || direction === use;
}

/** BAS label list as stored (JSON) to a clean list. */
export function basOf(json: string | null | undefined): BasLabel[] {
  try {
    const v = JSON.parse(json ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is BasLabel => typeof x === 'string' && x in BAS_LABELS) : [];
  } catch {
    return [];
  }
}
