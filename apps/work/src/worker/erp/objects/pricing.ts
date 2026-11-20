// Prices from the Pricing module (price lists and promotions in use), for the price check and for sales orders: one rule
// in one place (batch 2, item 4). A product's price for a customer, quantity, date and currency is the customer's own
// active list first, then the lowest list price whose quantity break is met, else the product's standard price; the best
// active promotion for the product (or for every product) whose minimum order is met then takes a percentage or an amount
// per unit off. Lists in another currency than the order's are not used. Nothing here changes a record.

import { parseJson } from '../../lib/util';
import type { Data } from './engine';

interface ListLine {
  listId: string;
  label: string;
  product: string;
  price: number;
  minQty: number;
  customer: string | null;
  currency: string;
  from: string | null;
  to: string | null;
}

interface Promo {
  id: string;
  label: string;
  product: string | null;
  type: 'percent' | 'amount';
  value: number;
  minOrder: number | null;
  from: string;
  to: string;
}

export interface Pricing {
  lists: ListLine[];
  promos: Promo[];
}

export interface Suggestion {
  /** The unit price before the promotion (the list's, or the standard price), or null when there is none. */
  listUnit: number | null;
  /** The unit price to charge (after an amount off), and the discount (basis points) for a percentage off. */
  unit: number | null;
  discountBp: number;
  priceList: { id: string; label: string; price: number; minQty: number; customer: boolean } | null;
  promotion: { id: string; label: string; type: 'percent' | 'amount'; value: number; offPerUnit: number } | null;
  /** In plain words, for the line: where its price came from. */
  note: string;
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** The active price lists' lines for these products and the active promotions, read once. */
export async function loadPricing(db: D1Database, companyId: string, productIds: string[]): Promise<Pricing> {
  const ids = [...new Set(productIds)].filter(Boolean);
  const lists: ListLine[] = [];
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const rows = await db
      .prepare(`SELECT e.id, e.number, e.title, e.data_json, l.data_json AS line FROM erp_objects e JOIN erp_object_lines l ON l.company_id = e.company_id AND l.record_id = e.id WHERE e.company_id = ? AND e.object = 'pr_pricelist' AND e.status = 'active' AND e.archived_at IS NULL AND json_extract(l.data_json, '$.product') IN (${chunk.map(() => '?').join(',')})`)
      .bind(companyId, ...chunk)
      .all<any>();
    for (const r of rows.results) {
      const d = parseJson<Data>(r.data_json, {});
      const l = parseJson<Data>(r.line, {});
      if (typeof l.unitPrice !== 'number') continue;
      lists.push({ listId: r.id, label: `${r.number} ${r.title}`.trim(), product: str(l.product), price: Math.round(l.unitPrice), minQty: typeof l.minQty === 'number' ? l.minQty : 1, customer: str(d.customer) || null, currency: str(d.currency) || 'AUD', from: str(d.validFrom) || null, to: str(d.validTo) || null });
    }
  }
  const promoRows = await db.prepare("SELECT id, number, title, data_json FROM erp_objects WHERE company_id = ? AND object = 'pr_promotion' AND status = 'active' AND archived_at IS NULL").bind(companyId).all<any>();
  const promos: Promo[] = promoRows.results.map((r) => {
    const d = parseJson<Data>(r.data_json, {});
    return { id: r.id, label: `${r.number} ${r.title}`.trim(), product: str(d.product) || null, type: d.discountType === 'amount' ? 'amount' : 'percent', value: Number(d.discountValue) || 0, minOrder: typeof d.minOrder === 'number' ? d.minOrder : null, from: str(d.validFrom), to: str(d.validTo) || '9999-12-31' };
  });
  return { lists, promos };
}

export function suggest(p: Pricing, q: { productId: string; standard: number | null; customerRefs: string[]; qty: number; date: string; currency: string }): Suggestion {
  const hits = p.lists.filter((l) => l.product === q.productId && l.currency === q.currency && (!l.from || l.from <= q.date) && (!l.to || l.to >= q.date) && (!l.customer || q.customerRefs.includes(l.customer)) && l.minQty <= q.qty + 1e-9);
  // the customer's own list first, then the lowest price
  hits.sort((a, b) => Number(!!b.customer) - Number(!!a.customer) || a.price - b.price);
  const best = hits[0] ?? null;
  const listUnit = best ? best.price : q.standard;
  let promotion: Suggestion['promotion'] = null;
  if (listUnit !== null) {
    for (const pr of p.promos) {
      if (pr.from > q.date || pr.to < q.date) continue;
      if (pr.product && pr.product !== q.productId) continue;
      if (pr.minOrder !== null && pr.minOrder > listUnit * q.qty) continue;
      const off = pr.type === 'amount' ? Math.min(listUnit, Math.round(pr.value)) : Math.round((listUnit * Math.min(100, Math.max(0, pr.value))) / 100);
      if (off > 0 && (!promotion || off > promotion.offPerUnit)) promotion = { id: pr.id, label: pr.label, type: pr.type, value: pr.value, offPerUnit: off };
    }
  }
  const unit = listUnit === null ? null : promotion?.type === 'amount' ? listUnit - promotion.offPerUnit : listUnit;
  const discountBp = promotion?.type === 'percent' ? Math.round(Math.min(100, promotion.value) * 100) : 0;
  const parts = [best ? `Price list ${best.label}${best.minQty > 1 ? ` (from ${best.minQty})` : ''}` : listUnit !== null ? 'Standard price' : ''];
  if (promotion) parts.push(`promotion ${promotion.label} (${promotion.type === 'percent' ? `${promotion.value}% off` : 'an amount off each'})`);
  return { listUnit, unit, discountBp, priceList: best ? { id: best.listId, label: best.label, price: best.price, minQty: best.minQty, customer: !!best.customer } : null, promotion, note: parts.filter(Boolean).join(', ') };
}
