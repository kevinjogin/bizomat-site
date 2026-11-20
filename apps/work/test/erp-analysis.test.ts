// Product Management's sales and margin analysis (src/worker/erp/analysis.ts): the same dispatched goods as the supply
// chain's sales report, with the cost that left stock for them, by any dimension, drilled down, against a comparison
// period, by month, as CSV, with stock against sales and saved views. The rest checks the rules: another company's people
// get 404, a shared view is read only to others, a view stays private until it is shared, and the module switch.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { monthsBetween } from '../src/worker/erp/analysis';

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registered(c: Client, name: string) {
  const res = await c.req('POST', '/api/company/companies', {
    kind: 'business',
    name,
    legalName: '',
    abn: newAbn(),
    acn: '',
    email: uniqueEmail('accounts'),
    phone: '(02) 9876 5432',
    addressLine1: '12 Example Street',
    addressLine2: '',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    website: '',
  });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return data.company.id as string;
}

async function example() {
  const ex = await signup('Analysis Example');
  const built = (await (await ex.req('POST', '/api/system/demo', {})).json()) as any;
  expect(built.status).toBe('ready');
  return { ex, co: built.companyId as string };
}

const spec = (extra: Record<string, unknown> = {}) => ({ from: day(-365), to: day(0), ...extra });

describe('sales and margin analysis', () => {
  it('analyses the example company’s dispatches by product, with the cost that left stock and its margin', async () => {
    const { ex, co } = await example();
    const meta = await ex.json('GET', erp(co, '/analysis/meta'));
    expect(meta.dimensions.map((d: any) => d.key)).toEqual(['product', 'category', 'family', 'customer', 'salesperson', 'warehouse', 'month']);
    expect(meta.currencies).toEqual(['AUD']);

    const out = await ex.json('POST', erp(co, '/analysis/query'), spec());
    // the same goods and values as the supply chain's sales report over the same dates
    const rep = await ex.json('GET', erp(co, `/reports/sales?from=${day(-365)}&to=${day(0)}`));
    expect(out.totals.salesCents).toBe(rep.totals.valueCents);
    expect(out.rows.map((r: any) => [r.label.split(' ')[0], r.qty, r.salesCents])).toEqual(rep.byProduct.map((p: any) => [p.number, p.quantity, p.valueCents]));
    // the cost is what the dispatch took out of stock, from the append-only ledger
    const ledger = await env.DB.prepare("SELECT COALESCE(SUM(-value_delta_cents), 0) AS v FROM erp_stock_moves WHERE company_id = ? AND move_type = 'sales_dispatch' AND source_type = 'shipment'").bind(co).first<{ v: number }>();
    expect(out.totals.costCents).toBe(ledger!.v);
    expect(out.totals.costCents).toBeGreaterThan(0);
    expect(out.totals.marginCents).toBe(out.totals.costedSalesCents - out.totals.costCents);
    expect(out.totals.marginPct).toBe(Math.round((out.totals.marginCents / out.totals.costedSalesCents) * 1000) / 10);
    expect(out.totals.uncostedSalesCents).toBe(0);
    expect(out.trend.length).toBe(monthsBetween(day(-365), day(0)).length);
    expect(out.trend.reduce((s: number, m: any) => s + m.salesCents, 0)).toBe(out.totals.salesCents);

    // by customer, then drilled into that customer by product
    const byCustomer = await ex.json('POST', erp(co, '/analysis/query'), spec({ dimension: 'customer' }));
    expect(byCustomer.rows).toMatchObject([{ label: 'Harbour Cafe', salesCents: out.totals.salesCents }]);
    const drilled = await ex.json('POST', erp(co, '/analysis/query'), spec({ dimension: 'product', filters: [{ dimension: 'customer', key: byCustomer.rows[0].key }] }));
    expect(drilled.totals).toEqual(out.totals);
    const nobody = await ex.json('POST', erp(co, '/analysis/query'), spec({ filters: [{ dimension: 'customer', key: 'no-such-customer' }] }));
    expect(nobody).toMatchObject({ rows: [], totals: { salesCents: 0, marginPct: null } });
    // by warehouse: where the goods left from; by salesperson: the order's maker (no deal in the example)
    const byWarehouse = await ex.json('POST', erp(co, '/analysis/query'), spec({ dimension: 'warehouse' }));
    expect(byWarehouse.rows.length).toBe(1);
    expect(byWarehouse.rows[0].label).not.toBe('No stock movement');
    const byPerson = await ex.json('POST', erp(co, '/analysis/query'), spec({ dimension: 'salesperson' }));
    expect(byPerson.rows).toMatchObject([{ label: 'Analysis Example' }]);
    const byMonth = await ex.json('POST', erp(co, '/analysis/query'), spec({ dimension: 'month' }));
    expect(byMonth.rows.map((r: any) => r.key)).toEqual([...byMonth.rows.map((r: any) => r.key)].sort());

    // against the same dates a year earlier: nothing then, so no change can be worked out
    const cmp = await ex.json('POST', erp(co, '/analysis/query'), spec({ compare: 'year' }));
    expect(cmp.compare).toEqual({ from: day(-365).replace(/^\d{4}/, (y) => String(Number(y) - 1)), to: day(0).replace(/^\d{4}/, (y) => String(Number(y) - 1)) });
    expect(cmp.compareTotals).toMatchObject({ salesCents: 0 });
    expect(cmp.rows[0]).toMatchObject({ compare: { salesCents: 0 }, changePct: null });
    // against the period just before: as long, ending the day before
    const prev = await ex.json('POST', erp(co, '/analysis/query'), { from: day(-9), to: day(0), compare: 'period' });
    expect(prev.compare).toEqual({ from: day(-19), to: day(-10) });

    // CSV, with the comparison's columns when there is one
    const csv = await ex.req('POST', erp(co, '/analysis/query?format=csv'), spec({ compare: 'year' }));
    expect(csv.headers.get('Content-Type')).toContain('text/csv');
    const text = await csv.text();
    expect(text.split('\n')[0].trim()).toBe('Product,Quantity,Sales before tax,Cost,Margin,Margin %,Sales without a cost,"Sales, comparison period",Change %');
    expect(text.trim().split('\n').at(-1)).toMatch(/^Total,/);

    // periods that make no sense are refused
    expect((await ex.req('POST', erp(co, '/analysis/query'), { from: day(0), to: day(-1) })).status).toBe(400);
    expect((await ex.req('POST', erp(co, '/analysis/query'), { from: day(-1200), to: day(0) })).status).toBe(400);
    expect((await ex.req('POST', erp(co, '/analysis/query'), { from: '2026-02-30', to: day(0) })).status).toBe(400);
    expect((await ex.req('POST', erp(co, '/analysis/query'), spec({ dimension: 'colour' }))).status).toBe(400);
  });

  it('shows stock against sales: available, value, reorder point and days of cover', async () => {
    const { ex, co } = await example();
    const st = await ex.json('GET', erp(co, '/analysis/stock?days=90'));
    expect(st.days).toBe(90);
    expect(st.rows.length).toBeGreaterThan(0);
    const arms = st.rows.find((r: any) => r.name === 'Bracket arm, laser cut');
    expect(arms).toMatchObject({ onHand: 40, reserved: 10, available: 30, valueCents: 15_200 });
    for (const r of st.rows) {
      expect(['ok', 'reorder', 'not_moving', 'slow']).toContain(r.status);
      if (r.soldQty > 0) expect(r.coverDays).toBe(Math.round(r.available / (r.soldQty / 90)));
      else expect(r.coverDays).toBeNull();
    }
    expect(st.totals.valueCents).toBe(st.rows.reduce((s: number, r: any) => s + (r.valueCents ?? 0), 0));
    const csv = await ex.req('GET', erp(co, '/analysis/stock?format=csv'));
    expect((await csv.text()).split('\n')[0].trim()).toBe('Product,Name,Category,On hand,Reserved,Available,Unit,Stock value,Reorder point,Dispatched in 90 days,Days of cover,Status');
  });

  it('saves views: one’s own, shared ones read only to others, and private ones unseen', async () => {
    const owner = await signup('Vera Views');
    const co = await registered(owner, 'Views Works');
    const member = await signup('Milo Member');
    const inv = await owner.json('POST', `/api/company/c/${co}/invitations`, { email: member.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
    await member.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
    const view = (name: string, shared: boolean) => ({ name, shared, spec: { period: 'last-12-months', compare: 'year', dimension: 'customer', filters: [], sort: 'margin' } });

    const shared = (await owner.json('POST', erp(co, '/analysis/views'), view('Margin by customer', true))).view;
    const mine = (await owner.json('POST', erp(co, '/analysis/views'), view('My working view', false))).view;
    expect(shared).toMatchObject({ name: 'Margin by customer', shared: true, mine: true, ownerName: 'Vera Views', spec: { dimension: 'customer', sort: 'margin' } });
    expect((await owner.json('GET', erp(co, '/analysis/views'))).views.map((v: any) => v.name)).toEqual(['Margin by customer', 'My working view']);
    // the member (an ERP viewer) sees the shared view only, and may not change or delete it
    const seen = (await member.json('GET', erp(co, '/analysis/views'))).views;
    expect(seen).toMatchObject([{ id: shared.id, mine: false, ownerName: 'Vera Views' }]);
    expect((await member.req('PATCH', erp(co, `/analysis/views/${shared.id}`), { name: 'Mine now' })).status).toBe(403);
    expect((await member.req('DELETE', erp(co, `/analysis/views/${shared.id}`))).status).toBe(403);
    expect((await member.req('PATCH', erp(co, `/analysis/views/${mine.id}`), { name: 'Found it' })).status).toBe(404);
    // the member saves their own; the owner renames and unshares theirs
    await member.json('POST', erp(co, '/analysis/views'), view('Milo’s view', false));
    await owner.json('PATCH', erp(co, `/analysis/views/${shared.id}`), { name: 'Margin by customer, this year', shared: false });
    expect((await member.json('GET', erp(co, '/analysis/views'))).views.map((v: any) => v.name)).toEqual(['Milo’s view']);
    await owner.json('DELETE', erp(co, `/analysis/views/${mine.id}`));
    expect((await owner.json('GET', erp(co, '/analysis/views'))).views.map((v: any) => v.name)).toEqual(['Margin by customer, this year']);
    expect((await owner.req('POST', erp(co, '/analysis/views'), { ...view('', false) })).status).toBe(400);

    // another company's people get the usual 404, for the analysis and the views
    const outsider = await signup('Otto Outsider');
    for (const [m, path, body] of [
      ['GET', '/analysis/meta', undefined],
      ['POST', '/analysis/query', spec()],
      ['GET', '/analysis/stock', undefined],
      ['GET', '/analysis/views', undefined],
      ['DELETE', `/analysis/views/${shared.id}`, undefined],
    ] as const) {
      expect((await outsider.req(m, erp(co, path), body)).status, path).toBe(404);
    }
    // an empty company analyses to nothing, without errors
    expect(await owner.json('POST', erp(co, '/analysis/query'), spec())).toMatchObject({ rows: [], rowCount: 0, totals: { salesCents: 0, marginPct: null } });
  });

  it('answers MODULE_DISABLED when the analysis or Products is switched off for the company', async () => {
    const { ex, co } = await example();
    for (const module of ['analysis', 'products']) {
      await env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, 'company', ?, 'off', 'test switch', 'test', ?)").bind(`module_${module}_enabled`, co, Date.now()).run();
      const res = await ex.req('POST', erp(co, '/analysis/query'), spec());
      expect(res.status, module).toBe(403);
      expect(((await res.json()) as any).details).toMatchObject({ code: 'MODULE_DISABLED', module });
      await env.DB.prepare('DELETE FROM feature_flags WHERE key = ? AND scope_id = ?').bind(`module_${module}_enabled`, co).run();
    }
    expect((await ex.req('GET', erp(co, '/analysis/meta'))).status).toBe(200);
  });
});

describe('months between two dates', () => {
  it('lists each month once, across a year end', () => {
    expect(monthsBetween('2025-11-15', '2026-02-01')).toEqual(['2025-11', '2025-12', '2026-01', '2026-02']);
    expect(monthsBetween('2026-03-01', '2026-03-31')).toEqual(['2026-03']);
  });
});
