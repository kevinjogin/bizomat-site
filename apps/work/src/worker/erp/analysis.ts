// Product Management's sales and margin analysis (owner, 20 Nov 2026: "Product Management ... like Phocas software in
// all features"; Phocas a functional reference only). Phocas analyses a business's own data by dimensions (product,
// customer, rep, branch) against periods, with drill-down, comparisons, saved views and dashboards; BIZOMAT does the same
// over the ERP's own records, read only, and never changes them.
//
// The facts are goods dispatched to customers (Supply Chain): each shipment line's quantity, its share of the sales
// order line's value before tax, and the cost that left stock for it (the dispatch movements' value in the append-only
// stock ledger, StockOps `sales_dispatch`). Returns are not deducted (the returns report has them); goods invoiced in
// Finance without a sales order and freight are not in the facts; a dispatch with no stock movement (a service or
// non-stocked product) has no cost, so its margin is left out and the share of sales without a cost is reported.
//
//   GET    /c/:company/analysis/meta            dimensions, measures, currencies, the default period
//   POST   /c/:company/analysis/query           rows by one dimension, with drill-down filters, a period and a comparison
//   GET    /c/:company/analysis/stock           stock against sales: on hand, value, reorder point, days of cover
//   GET    /c/:company/analysis/views           saved views: the person's own and those shared in the company
//   POST   /c/:company/analysis/views           save a view
//   PATCH  /c/:company/analysis/views/:id       rename, share or update one's own view
//   DELETE /c/:company/analysis/views/:id       delete one's own view (an ERP administrator may delete any)
//
// Everyone with `reports.view` may analyse (the same as the supply chain and job profitability reports, which show
// value and cost; under company_members_v2 the member module Reports). The module switch `module_analysis_enabled` (on,
// like every module; owner, 20 Nov 2026: released on for everyone) and Products' own switch turn it off for a company.
import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body as readBody, newId } from '../lib/util';
import { MODULES, moduleEnabled } from '../platform/flags';
import { can, requireErp, type ErpAccess } from './access';
import { csvResponse, dollars, validDate, wantsCsv } from './util';
import { q6 } from './stock';
import { todayIso } from './manufacturing';

export const analysisRoutes = new Hono<AppEnv>();

export const DIMENSIONS = ['product', 'category', 'family', 'customer', 'salesperson', 'warehouse', 'month'] as const;
export type Dimension = (typeof DIMENSIONS)[number];
export const DIMENSION_LABELS: Record<Dimension, string> = {
  product: 'Product',
  category: 'Category',
  family: 'Family',
  customer: 'Customer',
  salesperson: 'Salesperson',
  warehouse: 'Warehouse',
  month: 'Month',
};
export const MEASURES = ['sales', 'quantity', 'cost', 'margin', 'marginPct'] as const;
export type Measure = (typeof MEASURES)[number];

const DAY = 86_400_000;
const MAX_FACTS = 100_000;
const startMs = (d: string) => Date.parse(`${d}T00:00:00Z`);
const isoOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** One shipment line, with what it is, who bought it and what it was worth and cost. */
interface Fact {
  ms: number;
  month: string;
  qty: number;
  salesCents: number;
  /** Null: no stock left for it (a service or a non-stocked product), so no margin. */
  costCents: number | null;
  currency: string;
  keys: Record<Dimension, string>;
  labels: Record<Dimension, string>;
  uom: string;
}

async function requireAnalysis(c: Context<AppEnv>): Promise<ErpAccess> {
  const a = await requireErp(c, 'reports.view');
  for (const m of ['products', 'analysis'] as const) {
    if (!(await moduleEnabled(c.env.DB, m, a.companyId))) {
      throw new HttpError(403, `${MODULES[m].label} is switched off for this company. Ask BIZOMAT support if you need it.`, { code: 'MODULE_DISABLED', module: m });
    }
  }
  return a;
}

/** The facts of a period: every shipment line dispatched in [fromMs, toMs), with its cost and warehouse. */
async function loadFacts(db: D1Database, companyId: string, fromMs: number, toMs: number): Promise<Fact[]> {
  const lines = (
    await db
      .prepare(
        `SELECT x.shipped_qty, l.quantity, l.net_cents, l.uom, l.product_id, p.number AS product_number, p.name AS product_name,
                p.category, p.family, o.currency, o.customer_name, COALESCE(o.crm_company_id, o.fin_contact_id, o.customer_name) AS customer_key,
                COALESCE(d.owner_id, o.created_by) AS person_id, u.name AS person_name, s.id AS shipment_id, s.dispatched_at
           FROM erp_shipment_lines x
           JOIN erp_shipments s ON s.company_id = x.company_id AND s.id = x.shipment_id
           JOIN erp_so_lines l ON l.company_id = x.company_id AND l.id = x.so_line_id
           JOIN erp_sales_orders o ON o.company_id = l.company_id AND o.id = l.so_id
           JOIN erp_products p ON p.company_id = l.company_id AND p.id = l.product_id
           LEFT JOIN crm_deals d ON d.id = o.crm_deal_id
           LEFT JOIN users u ON u.id = COALESCE(d.owner_id, o.created_by)
          WHERE x.company_id = ? AND s.status IN ('dispatched','delivered') AND s.dispatched_at >= ? AND s.dispatched_at < ? AND x.shipped_qty > 0
          LIMIT ${MAX_FACTS}`,
      )
      .bind(companyId, fromMs, toMs)
      .all<any>()
  ).results;
  if (!lines.length) return [];
  // The cost that left stock for each shipment and product, and the warehouse it left from.
  const moves = (
    await db
      .prepare(
        `SELECT m.source_id AS shipment_id, m.product_id, SUM(-m.value_delta_cents) AS value, SUM(-m.on_hand_delta) AS qty, MIN(w.id) AS warehouse_id, MIN(w.name) AS warehouse_name
           FROM erp_stock_moves m
           JOIN erp_locations l ON l.company_id = m.company_id AND l.id = m.location_id
           LEFT JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
          WHERE m.company_id = ? AND m.move_type = 'sales_dispatch' AND m.source_type = 'shipment'
            AND m.source_id IN (SELECT s.id FROM erp_shipments s WHERE s.company_id = ? AND s.dispatched_at >= ? AND s.dispatched_at < ?)
          GROUP BY m.source_id, m.product_id`,
      )
      .bind(companyId, companyId, fromMs, toMs)
      .all<{ shipment_id: string; product_id: string; value: number | null; qty: number | null; warehouse_id: string | null; warehouse_name: string | null }>()
  ).results;
  const byKey = new Map(moves.map((m) => [`${m.shipment_id}|${m.product_id}`, m]));
  return lines.map((r) => {
    const m = byKey.get(`${r.shipment_id}|${r.product_id}`);
    const unitCost = m && m.qty && m.qty > 1e-9 ? Number(m.value ?? 0) / Number(m.qty) : null;
    const qty = Number(r.shipped_qty);
    const salesCents = r.quantity > 0 ? Math.round((Number(r.net_cents) * qty) / Number(r.quantity)) : 0;
    const month = isoOf(Number(r.dispatched_at)).slice(0, 7);
    const category = String(r.category ?? '').trim();
    const family = String(r.family ?? '').trim();
    return {
      ms: Number(r.dispatched_at),
      month,
      qty,
      salesCents,
      costCents: unitCost === null ? null : Math.round(unitCost * qty),
      currency: r.currency || 'AUD',
      uom: r.uom ?? '',
      keys: {
        product: r.product_id,
        category: category.toLowerCase() || '-',
        family: family.toLowerCase() || '-',
        customer: String(r.customer_key ?? r.customer_name),
        salesperson: r.person_id ?? '-',
        warehouse: m?.warehouse_id ?? '-',
        month,
      },
      labels: {
        product: `${r.product_number} ${r.product_name}`,
        category: category || 'No category',
        family: family || 'No family',
        customer: r.customer_name || 'No customer',
        salesperson: r.person_name || 'Not recorded',
        warehouse: m?.warehouse_name ?? 'No stock movement',
        month,
      },
    };
  });
}

interface Totals {
  qty: number;
  salesCents: number;
  costCents: number;
  /** Sales whose cost is known: the base of margin and margin %. */
  costedSalesCents: number;
  marginCents: number;
  marginPct: number | null;
  uncostedSalesCents: number;
  lines: number;
}
const empty = (): Totals => ({ qty: 0, salesCents: 0, costCents: 0, costedSalesCents: 0, marginCents: 0, marginPct: null, uncostedSalesCents: 0, lines: 0 });
function add(t: Totals, f: Fact) {
  t.qty = q6(t.qty + f.qty);
  t.salesCents += f.salesCents;
  t.lines++;
  if (f.costCents === null) t.uncostedSalesCents += f.salesCents;
  else {
    t.costCents += f.costCents;
    t.costedSalesCents += f.salesCents;
  }
}
function finish(t: Totals): Totals {
  t.marginCents = t.costedSalesCents - t.costCents;
  t.marginPct = t.costedSalesCents > 0 ? Math.round((t.marginCents / t.costedSalesCents) * 1000) / 10 : null;
  return t;
}
const value = (t: Totals, m: Measure) => (m === 'sales' ? t.salesCents : m === 'quantity' ? t.qty : m === 'cost' ? t.costCents : m === 'margin' ? t.marginCents : (t.marginPct ?? -Infinity));

/** The period to compare with: the same dates a year earlier, or the same length just before. */
function comparePeriod(from: string, to: string, kind: 'none' | 'year' | 'period'): { from: string; to: string } | null {
  if (kind === 'none') return null;
  if (kind === 'year') {
    const shift = (d: string) => {
      const [y, m, day] = d.split('-').map(Number);
      const last = new Date(Date.UTC(y - 1, m, 0)).getUTCDate();
      return `${y - 1}-${String(m).padStart(2, '0')}-${String(Math.min(day, last)).padStart(2, '0')}`;
    };
    return { from: shift(from), to: shift(to) };
  }
  const days = Math.round((startMs(to) - startMs(from)) / DAY) + 1;
  return { from: isoOf(startMs(from) - days * DAY), to: isoOf(startMs(from) - DAY) };
}

const zSpec = z.object({
  from: z.string().refine((v) => validDate(v), 'Use a date such as 2026-07-01'),
  to: z.string().refine((v) => validDate(v), 'Use a date such as 2026-11-20'),
  compare: z.enum(['none', 'year', 'period']).default('none'),
  dimension: z.enum(DIMENSIONS).default('product'),
  filters: z.array(z.object({ dimension: z.enum(DIMENSIONS), key: z.string().min(1).max(200), label: z.string().max(300).optional() })).max(6).default([]),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  sort: z.enum(MEASURES).default('sales'),
  limit: z.number().int().min(1).max(5000).default(200),
});
export type AnalysisSpec = z.infer<typeof zSpec>;

function checkRange(from: string, to: string) {
  if (startMs(from) > startMs(to)) throw new HttpError(400, 'The period starts after it ends.', { code: 'BAD_PERIOD' });
  if (startMs(to) - startMs(from) > 3 * 366 * DAY) throw new HttpError(400, 'Choose a period of three years or less.', { code: 'PERIOD_TOO_LONG' });
}

/** Rows for one dimension of the facts that pass the filters, in the chosen currency. */
function group(facts: Fact[], spec: AnalysisSpec, currency: string) {
  const keep = facts.filter((f) => f.currency === currency && spec.filters.every((x) => f.keys[x.dimension] === x.key));
  const rows = new Map<string, { key: string; label: string; uom: Set<string>; t: Totals }>();
  const total = empty();
  for (const f of keep) {
    const k = f.keys[spec.dimension];
    const r = rows.get(k) ?? { key: k, label: f.labels[spec.dimension], uom: new Set<string>(), t: empty() };
    add(r.t, f);
    if (f.uom) r.uom.add(f.uom);
    rows.set(k, r);
    add(total, f);
  }
  return { rows, total: finish(total), kept: keep };
}

analysisRoutes.get('/c/:company/analysis/meta', async (c) => {
  const a = await requireAnalysis(c);
  const today = todayIso();
  // The currencies of the last three years' dispatches, most valuable first (one is analysed at a time).
  const cur = (
    await c.env.DB.prepare(
      `SELECT o.currency, SUM(l.net_cents) AS v FROM erp_shipment_lines x JOIN erp_shipments s ON s.company_id = x.company_id AND s.id = x.shipment_id
         JOIN erp_so_lines l ON l.company_id = x.company_id AND l.id = x.so_line_id JOIN erp_sales_orders o ON o.company_id = l.company_id AND o.id = l.so_id
        WHERE x.company_id = ? AND s.status IN ('dispatched','delivered') AND s.dispatched_at >= ? GROUP BY o.currency ORDER BY v DESC`,
    )
      .bind(a.companyId, startMs(today) - 3 * 366 * DAY)
      .all<{ currency: string }>()
  ).results.map((r) => r.currency || 'AUD');
  return c.json({
    dimensions: DIMENSIONS.map((d) => ({ key: d, label: DIMENSION_LABELS[d] })),
    measures: MEASURES,
    currencies: cur.length ? cur : ['AUD'],
    today,
    canManageViews: can(a, 'roles.manage'),
    source:
      'Goods dispatched to customers (Warehouse, Orders and dispatch), at each sales order line’s value before tax, and the cost that left stock for them. Returns are not deducted; freight and goods invoiced in Finance without a sales order are not included.',
  });
});

analysisRoutes.post('/c/:company/analysis/query', async (c) => {
  const a = await requireAnalysis(c);
  const spec = await readBody(c, zSpec);
  checkRange(spec.from, spec.to);
  const db = c.env.DB;
  const facts = await loadFacts(db, a.companyId, startMs(spec.from), startMs(spec.to) + DAY);
  const cmp = comparePeriod(spec.from, spec.to, spec.compare);
  const cmpFacts = cmp ? await loadFacts(db, a.companyId, startMs(cmp.from), startMs(cmp.to) + DAY) : [];
  const currencies = [...new Set([...facts, ...cmpFacts].map((f) => f.currency))];
  const currency = spec.currency ?? (currencies.sort((x, y) => facts.filter((f) => f.currency === y).length - facts.filter((f) => f.currency === x).length)[0] || 'AUD');
  const now = group(facts, spec, currency);
  const before = cmp ? group(cmpFacts, spec, currency) : null;
  const keys = new Set([...now.rows.keys(), ...(before ? before.rows.keys() : [])]);
  const rows = [...keys]
    .map((k) => {
      const r = now.rows.get(k);
      const b = before?.rows.get(k);
      const t = r ? finish(r.t) : empty();
      const bt = b ? finish(b.t) : before ? empty() : null;
      const change = bt && bt.salesCents !== 0 ? Math.round(((t.salesCents - bt.salesCents) / Math.abs(bt.salesCents)) * 1000) / 10 : null;
      return {
        key: k,
        label: r?.label ?? b?.label ?? k,
        uom: r && r.uom.size === 1 ? [...r.uom][0] : '',
        ...t,
        compare: bt ? { qty: bt.qty, salesCents: bt.salesCents, marginCents: bt.marginCents, marginPct: bt.marginPct } : null,
        changePct: change,
      };
    })
    .sort((x, y) => (spec.dimension === 'month' ? x.key.localeCompare(y.key) : value(y, spec.sort) - value(x, spec.sort)));
  // The trend: the filtered facts by month, and the comparison period's months beside them.
  const months = new Map<string, { month: string; salesCents: number; marginCents: number; costedSalesCents: number; costCents: number }>();
  for (const f of now.kept) {
    const m = months.get(f.month) ?? { month: f.month, salesCents: 0, marginCents: 0, costedSalesCents: 0, costCents: 0 };
    m.salesCents += f.salesCents;
    if (f.costCents !== null) {
      m.costedSalesCents += f.salesCents;
      m.costCents += f.costCents;
    }
    months.set(f.month, m);
  }
  const compareMonths = new Map<string, number>();
  for (const f of before?.kept ?? []) compareMonths.set(f.month, (compareMonths.get(f.month) ?? 0) + f.salesCents);
  const trend = monthsBetween(spec.from, spec.to).map((month, i) => {
    const m = months.get(month);
    const cm = cmp ? monthsBetween(cmp.from, cmp.to)[i] : undefined;
    return { month, salesCents: m?.salesCents ?? 0, marginCents: m ? m.costedSalesCents - m.costCents : 0, compareMonth: cm ?? null, compareSalesCents: cm ? (compareMonths.get(cm) ?? 0) : null };
  });
  const out = {
    from: spec.from,
    to: spec.to,
    compare: cmp,
    currency,
    currencies,
    dimension: spec.dimension,
    filters: spec.filters,
    rows: rows.slice(0, spec.limit),
    rowCount: rows.length,
    totals: now.total,
    compareTotals: before?.total ?? null,
    trend,
    truncated: facts.length >= MAX_FACTS,
  };
  if (wantsCsv(c)) {
    const head = [DIMENSION_LABELS[spec.dimension], 'Quantity', 'Sales before tax', 'Cost', 'Margin', 'Margin %', 'Sales without a cost', ...(cmp ? ['Sales, comparison period', 'Change %'] : [])];
    return csvResponse(`sales-analysis-${spec.dimension}`, [
      head,
      ...rows.map((r) => [r.label, r.qty, dollars(r.salesCents), dollars(r.costCents), dollars(r.marginCents), r.marginPct ?? '', dollars(r.uncostedSalesCents), ...(cmp ? [dollars(r.compare?.salesCents ?? 0), r.changePct ?? ''] : [])]),
      ['Total', now.total.qty, dollars(now.total.salesCents), dollars(now.total.costCents), dollars(now.total.marginCents), now.total.marginPct ?? '', dollars(now.total.uncostedSalesCents), ...(cmp ? [dollars(before?.total.salesCents ?? 0), ''] : [])],
    ]);
  }
  return c.json(out);
});

/** Every month (YYYY-MM) from one date's month to another's, at most 37. */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let [y, m] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  while ((y < ty || (y === ty && m <= tm)) && out.length < 37) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}

// ------------------------------------------------------------------ stock against sales

analysisRoutes.get('/c/:company/analysis/stock', async (c) => {
  const a = await requireAnalysis(c);
  const days = Math.min(365, Math.max(7, Number(c.req.query('days')) || 90));
  const since = Date.now() - days * DAY;
  const db = c.env.DB;
  const [stock, sold, settings] = await db.batch([
    db.prepare(
      `SELECT p.id, p.number, p.name, p.category, p.uom, COALESCE(SUM(CASE WHEN l.kind <> 'quarantine' THEN s.on_hand ELSE 0 END), 0) AS on_hand,
              COALESCE(SUM(CASE WHEN l.kind <> 'quarantine' THEN s.reserved ELSE 0 END), 0) AS reserved,
              (SELECT v.value_cents FROM erp_valuation v WHERE v.company_id = p.company_id AND v.product_id = p.id) AS value_cents
         FROM erp_products p
         LEFT JOIN erp_stock s ON s.company_id = p.company_id AND s.product_id = p.id
         LEFT JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id
        WHERE p.company_id = ? AND p.archived_at IS NULL AND p.type <> 'service'
        GROUP BY p.id`,
    ).bind(a.companyId),
    db.prepare(`SELECT m.product_id, SUM(-m.on_hand_delta) AS qty, SUM(-m.value_delta_cents) AS value FROM erp_stock_moves m WHERE m.company_id = ? AND m.move_type = 'sales_dispatch' AND m.created_at >= ? GROUP BY m.product_id`).bind(a.companyId, since),
    db.prepare('SELECT product_id, reorder_point FROM erp_product_stock WHERE company_id = ?').bind(a.companyId),
  ]);
  const soldBy = new Map((sold.results as any[]).map((r) => [r.product_id, { qty: Number(r.qty ?? 0), value: Number(r.value ?? 0) }]));
  const reorderBy = new Map((settings.results as any[]).map((r) => [r.product_id, r.reorder_point as number | null]));
  const rows = (stock.results as any[])
    .map((p) => {
      const available = q6(Number(p.on_hand) - Number(p.reserved));
      const s = soldBy.get(p.id) ?? { qty: 0, value: 0 };
      const perDay = s.qty / days;
      const cover = perDay > 1e-9 ? Math.round(available / perDay) : null;
      const reorder = reorderBy.get(p.id) ?? null;
      const status = reorder !== null && available <= reorder ? 'reorder' : s.qty <= 0 && Number(p.on_hand) > 0 ? 'not_moving' : cover !== null && cover > 180 ? 'slow' : Number(p.on_hand) <= 0 && s.qty <= 0 ? 'none' : 'ok';
      return {
        productId: p.id,
        number: p.number,
        name: p.name,
        category: p.category || '',
        uom: p.uom,
        onHand: q6(Number(p.on_hand)),
        reserved: q6(Number(p.reserved)),
        available,
        valueCents: p.value_cents === null ? null : Number(p.value_cents),
        reorderPoint: reorder,
        soldQty: q6(s.qty),
        costOfSalesCents: Math.round(s.value),
        coverDays: cover,
        status,
      };
    })
    .filter((r) => r.status !== 'none')
    .sort((x, y) => (y.valueCents ?? 0) - (x.valueCents ?? 0));
  if (wantsCsv(c)) {
    return csvResponse('stock-analysis', [
      ['Product', 'Name', 'Category', 'On hand', 'Reserved', 'Available', 'Unit', 'Stock value', 'Reorder point', `Dispatched in ${days} days`, 'Days of cover', 'Status'],
      ...rows.map((r) => [r.number, r.name, r.category, r.onHand, r.reserved, r.available, r.uom, dollars(r.valueCents), r.reorderPoint ?? '', r.soldQty, r.coverDays ?? '', r.status]),
    ]);
  }
  return c.json({
    days,
    rows,
    totals: { valueCents: rows.reduce((t, r) => t + (r.valueCents ?? 0), 0), toReorder: rows.filter((r) => r.status === 'reorder').length, notMoving: rows.filter((r) => r.status === 'not_moving').length, slow: rows.filter((r) => r.status === 'slow').length },
    note: `Days of cover: stock available now over the average dispatched per day in the last ${days} days. Not moving: stock on hand and nothing dispatched in that time. Slow: more than 180 days of cover.`,
  });
});

// ------------------------------------------------------------------ saved views

const zView = z.object({
  name: z.string().trim().min(1).max(120),
  shared: z.boolean().default(false),
  spec: z.object({
    period: z.string().max(40),
    from: z.string().max(10).optional(),
    to: z.string().max(10).optional(),
    compare: z.enum(['none', 'year', 'period']),
    dimension: z.enum(DIMENSIONS),
    filters: z.array(z.object({ dimension: z.enum(DIMENSIONS), key: z.string().min(1).max(200), label: z.string().max(300).optional() })).max(6),
    sort: z.enum(MEASURES),
    currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  }),
});

function viewDTO(r: any, userId: string) {
  return { id: r.id, name: r.name, shared: !!r.shared, mine: r.owner_id === userId, ownerName: r.owner_name ?? '', spec: JSON.parse(r.spec_json), updatedAt: r.updated_at };
}

analysisRoutes.get('/c/:company/analysis/views', async (c) => {
  const a = await requireAnalysis(c);
  const rows = (
    await c.env.DB.prepare(
      `SELECT v.*, u.name AS owner_name FROM erp_analysis_views v LEFT JOIN users u ON u.id = v.owner_id
        WHERE v.company_id = ? AND (v.owner_id = ? OR v.shared = 1) ORDER BY v.name COLLATE NOCASE LIMIT 200`,
    )
      .bind(a.companyId, a.userId)
      .all<any>()
  ).results;
  return c.json({ views: rows.map((r) => viewDTO(r, a.userId)) });
});

analysisRoutes.post('/c/:company/analysis/views', async (c) => {
  const a = await requireAnalysis(c);
  const body = await readBody(c, zView);
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM erp_analysis_views WHERE company_id = ? AND owner_id = ?').bind(a.companyId, a.userId).first<{ n: number }>();
  if ((count?.n ?? 0) >= 100) throw new HttpError(400, 'You have 100 saved views in this company. Delete one first.', { code: 'TOO_MANY_VIEWS' });
  const id = newId();
  const now = Date.now();
  await c.env.DB.prepare('INSERT INTO erp_analysis_views (id, company_id, owner_id, name, shared, spec_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, a.companyId, a.userId, body.name, body.shared ? 1 : 0, JSON.stringify(body.spec), now, now)
    .run();
  const r = await c.env.DB.prepare('SELECT v.*, u.name AS owner_name FROM erp_analysis_views v LEFT JOIN users u ON u.id = v.owner_id WHERE v.company_id = ? AND v.id = ?').bind(a.companyId, id).first<any>();
  return c.json({ view: viewDTO(r, a.userId) }, 201);
});

analysisRoutes.patch('/c/:company/analysis/views/:id', async (c) => {
  const a = await requireAnalysis(c);
  const body = await readBody(c, zView.partial());
  const r = await c.env.DB.prepare('SELECT * FROM erp_analysis_views WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!r || (r.owner_id !== a.userId && !r.shared)) throw new HttpError(404, 'That view was not found.');
  if (r.owner_id !== a.userId) throw new HttpError(403, 'Only the person who saved a view can change it. Save your own copy instead.', { code: 'NOT_OWNER' });
  await c.env.DB.prepare('UPDATE erp_analysis_views SET name = ?, shared = ?, spec_json = ?, updated_at = ? WHERE company_id = ? AND id = ?')
    .bind(body.name ?? r.name, body.shared === undefined ? r.shared : body.shared ? 1 : 0, body.spec ? JSON.stringify(body.spec) : r.spec_json, Date.now(), a.companyId, r.id)
    .run();
  const out = await c.env.DB.prepare('SELECT v.*, u.name AS owner_name FROM erp_analysis_views v LEFT JOIN users u ON u.id = v.owner_id WHERE v.company_id = ? AND v.id = ?').bind(a.companyId, r.id).first<any>();
  return c.json({ view: viewDTO(out, a.userId) });
});

analysisRoutes.delete('/c/:company/analysis/views/:id', async (c) => {
  const a = await requireAnalysis(c);
  const r = await c.env.DB.prepare('SELECT * FROM erp_analysis_views WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!r || (r.owner_id !== a.userId && !r.shared)) throw new HttpError(404, 'That view was not found.');
  if (r.owner_id !== a.userId && !can(a, 'roles.manage')) throw new HttpError(403, 'Only the person who saved a view, or an ERP administrator, can delete it.', { code: 'NOT_OWNER' });
  await c.env.DB.prepare('DELETE FROM erp_analysis_views WHERE company_id = ? AND id = ?').bind(a.companyId, r.id).run();
  return c.json({ ok: true });
});
