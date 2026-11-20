// Exchange rates for the modules framework: the company's own rates (Organisation structure, fx_rate records in use),
// never fetched from a market. The rate between two currencies on a date is the latest rate on or before it, entered either
// way round (a rate from A to B, or the inverse of one from B to A).

export interface Rate {
  rate: number;
  /** The record the rate came from, as "FX-00003 on 2026-10-31". */
  source: string;
  date: string;
  inverse: boolean;
}

export async function rateFor(db: D1Database, companyId: string, from: string, to: string, date: string): Promise<Rate | null> {
  if (from === to) return { rate: 1, source: 'same currency', date, inverse: false };
  const rows = await db
    .prepare(
      `SELECT number, json_extract(data_json, '$.fromCurrency') AS f, json_extract(data_json, '$.toCurrency') AS t, CAST(json_extract(data_json, '$.rate') AS REAL) AS r, json_extract(data_json, '$.date') AS d
         FROM erp_objects WHERE company_id = ? AND object = 'fx_rate' AND status = 'active' AND archived_at IS NULL
          AND ((json_extract(data_json, '$.fromCurrency') = ? AND json_extract(data_json, '$.toCurrency') = ?) OR (json_extract(data_json, '$.fromCurrency') = ? AND json_extract(data_json, '$.toCurrency') = ?))
          AND json_extract(data_json, '$.date') <= ?
        ORDER BY json_extract(data_json, '$.date') DESC, (json_extract(data_json, '$.fromCurrency') = ?) DESC, updated_at DESC LIMIT 1`,
    )
    .bind(companyId, from, to, to, from, date, from)
    .first<{ number: string; f: string; t: string; r: number; d: string }>();
  if (!rows || !(rows.r > 0)) return null;
  const inverse = rows.f !== from;
  return { rate: inverse ? 1 / rows.r : rows.r, source: `${rows.number} on ${rows.d}`, date: rows.d, inverse };
}

/** Cents converted at a rate, to the cent. */
export const convert = (cents: number, rate: number) => Math.round(cents * rate);

/** A refusal that says which rate to add. */
export const noRate = (from: string, to: string, date: string) => `Add an exchange rate from ${from} to ${to} dated on or before ${date} (Organisation structure, Exchange rates)`;
