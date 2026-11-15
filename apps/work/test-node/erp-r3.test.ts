// BIZOMAT ERP, Release 3 on the Node runtime (node:sqlite and the data folder's file store), over real HTTP: migration
// 0022 is additive (it only creates erp_ tables and indexes, and every earlier table is unchanged after it); Scenario D
// from a draft order to a closed one with exact costs; two simultaneous issues of the last unit to two orders let
// exactly one through; a finished-goods receipt sent twice at once is made once; the over-completion CHECK holds; and
// the example company gets its manufacturing records and MRP suggestions.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-erp-r3-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

describe('migration 0022', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0022_'))!;

  it('only creates erp_ tables and indexes', () => {
    expect(m.name).toBe('0022_erp_manufacturing.sql');
    const sql = m.sql
      .split('\n')
      .map((l) => l.replace(/--.*$/, ''))
      .join('\n');
    expect(sql).not.toMatch(/CREATE TRIGGER/);
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    expect(statements.length).toBeGreaterThan(30);
    for (const s of statements) expect(s, s.slice(0, 80)).toMatch(/^CREATE (TABLE erp_\w+ \(|(UNIQUE )?INDEX erp_\w+ ON erp_\w+\()/);
    expect(sql.replace(/ON DELETE (CASCADE|SET NULL)/g, '')).not.toMatch(/\b(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/i);
    // Kinds later releases may extend are checked by the code, never listed in a CHECK.
    const checks = sql.match(/CHECK \((?:[^()]|\([^()]*\))*\)/g) ?? [];
    expect(checks.length).toBeGreaterThan(40);
    for (const kind of ['make_to_stock', 'discrete', 'normal', 'labour', 'good', 'downtime', 'forecast', 'confirmed', 'buy', 'expedite', 'materials', 'production_issue']) {
      expect(checks.filter((c) => c.includes(`'${kind}'`)), kind).toEqual([]);
    }
  });

  it('leaves every earlier table exactly as it was', () => {
    const db = openDatabase(join(root, 'additive.sqlite'));
    applyMigrations(db, all.filter((x) => x.name < m.name));
    const schema = () => db.prepare("SELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name").all() as any[];
    const before = schema();
    expect(applyMigrations(db, all.filter((x) => x.name <= m.name))).toContain(m.name);
    const after = schema();
    const old = new Set(before.map((r) => `${r.type}:${r.name}`));
    expect(after.filter((r) => old.has(`${r.type}:${r.name}`))).toEqual(before);
    expect(after.filter((r) => !old.has(`${r.type}:${r.name}`)).every((r) => r.name.startsWith('erp_'))).toBe(true);
    const added = after.filter((r) => r.type === 'table' && !old.has(`table:${r.name}`)).map((r) => r.name);
    expect(added.sort()).toEqual(
      [
        'erp_machines',
        'erp_mfg_orders',
        'erp_mfg_settings',
        'erp_mo_assignees',
        'erp_mo_costs',
        'erp_mo_materials',
        'erp_mo_operations',
        'erp_mo_receipts',
        'erp_mo_reports',
        'erp_mo_reservations',
        'erp_mo_revisions',
        'erp_mo_time',
        'erp_mps_entries',
        'erp_mrp_lines',
        'erp_mrp_runs',
        'erp_mrp_suggestions',
        'erp_product_planning',
        'erp_routing_operations',
        'erp_routings',
        'erp_work_centres',
      ].sort(),
    );
    db.close();
  });
});

let server: RunningServer;
beforeAll(async () => {
  server = await startServer(testConfig(join(root, 'data'), staticDir));
});
afterAll(async () => {
  await server?.close();
});

interface Session {
  cookie: string;
  csrf: string;
}

async function signup(name: string): Promise<Session> {
  const res = await fetch(`${server.url}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: server.url },
    body: JSON.stringify({ email: `node.erp3.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
  });
  expect(res.status).toBe(201);
  const data = (await res.json()) as { csrfToken: string };
  return { cookie: res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.includes('workos_sid='))!, csrf: data.csrfToken };
}

async function call(s: Session, method: string, path: string, body?: unknown) {
  return fetch(`${server.url}${path}`, {
    method,
    headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function json<T = any>(s: Session, method: string, path: string, body?: unknown): Promise<T> {
  const res = await call(s, method, path, body);
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return JSON.parse(text) as T;
}

/** The person's own company, set up with a warehouse, a product made from one component, a work centre and a routing. */
async function factory(name: string) {
  const s = await signup(name);
  const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
  const e = (p: string) => `/api/erp/c/${own.id}${p}`;
  await json(s, 'PUT', e('/erp-settings'), { costingMethod: 'weighted_average', adjustmentApprovalCents: 100_000_000 });
  const wh = await json(s, 'POST', e('/warehouses'), { code: 'N', name: 'Node store' });
  const bin = await json(s, 'POST', e('/locations'), { warehouseId: wh.id, code: 'B1' });
  const fg = await json(s, 'POST', e('/locations'), { warehouseId: wh.id, code: 'FG', kind: 'finished_goods' });
  const prod = await json(s, 'POST', e('/products'), { name: 'Node bracket', type: 'finished_product' });
  const part = await json(s, 'POST', e('/products'), { name: 'Node plate', type: 'component' });
  const rev = (await json(s, 'GET', e(`/products/${prod.id}`))).revisions[0];
  await json(s, 'POST', e(`/revisions/${rev.id}/lines`), { componentId: part.id, quantity: 2 });
  const eco = await json(s, 'POST', e('/change-orders'), { title: 'Release', reason: 'Ready', productIds: [prod.id] });
  for (const step of ['submit', 'approve', 'release']) await json(s, 'POST', e(`/change-orders/${eco.id}/${step}`), {});
  const wc = await json(s, 'POST', e('/work-centres'), { code: 'W', name: 'Bench', labourRateCents: 6000, overheadPct: 25 });
  const r = await json(s, 'POST', e('/routings'), { productId: prod.id });
  await json(s, 'POST', e(`/routings/${r.id}/operations`), { name: 'Bend and drill', workCentreId: wc.id, setupMinutes: 12, runMinutes: 3 });
  await json(s, 'POST', e(`/routings/${r.id}/release`), {});
  return { s, e, bin, fg, prod, part };
}

describe('ERP Release 3 on the Node runtime', () => {
  it('runs Scenario D with exact costs, issues the last unit once and receives finished goods once', async () => {
    const { s, e, bin, fg, prod, part } = await factory('Node Maker');
    await json(s, 'POST', e('/adjustments'), { productId: part.id, locationId: bin.id, quantity: 20, unitCostCents: 250, reason: 'Opening stock' });
    // Estimate for 8: materials 16 x 2.50 = 40.00; labour (12 + 24) minutes = 0.6 h x 60.00 = 36.00; overheads 25% = 9.00.
    const mo = await json(s, 'POST', e('/mos'), { productId: prod.id, quantity: 8, requiredDate: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10) });
    let v = await json(s, 'GET', e(`/mos/${mo.id}`));
    expect(v.order.estimate).toMatchObject({ materials: 4000, labour: 3600, overheads: 900, total: 8500 });
    await json(s, 'POST', e(`/mos/${mo.id}/release`), { reserve: true });
    await json(s, 'POST', e(`/mos/${mo.id}/issue`), { lines: [{ materialId: v.materials[0].id, locationId: bin.id, quantity: 16 }] });
    const op = v.operations[0];
    await json(s, 'POST', e(`/mos/${mo.id}/operations/${op.id}/start`), {});
    await json(s, 'POST', e(`/mos/${mo.id}/operations/${op.id}/time`), { kind: 'labour', minutes: 45 });
    await json(s, 'POST', e(`/mos/${mo.id}/operations/${op.id}/report`), { kind: 'good', quantity: 8 });
    await json(s, 'POST', e(`/mos/${mo.id}/operations/${op.id}/complete`), {});
    // Actual: 40.00 + 45 minutes at 60.00 (45.00) + 25% overhead (11.25) = 96.25, received twice at the same moment once.
    const body = { quantity: 8, locationId: fg.id, requestKey: 'node-fg-receipt-0001' };
    const [a, b] = await Promise.all([call(s, 'POST', e(`/mos/${mo.id}/receive`), body), call(s, 'POST', e(`/mos/${mo.id}/receive`), body)]);
    const ra = (await a.json()) as any;
    const rb = (await b.json()) as any;
    expect(ra.id).toBe(rb.id);
    expect([a.status, b.status].sort()).toEqual([200, 201]);
    expect((await json(s, 'GET', e(`/products/${prod.id}/stock`))).totals).toMatchObject({ onHand: 8, valueCents: 9625 });
    await json(s, 'POST', e(`/mos/${mo.id}/complete`), {});
    expect(await json(s, 'POST', e(`/mos/${mo.id}/close`), {})).toMatchObject({ status: 'closed', actualCents: 9625, varianceCents: 1125 });
    v = await json(s, 'GET', e(`/mos/${mo.id}/costs`));
    expect(v).toMatchObject({ final: true, unabsorbedCents: 0 });

    // The last two plates (one unit's worth), issued to two orders at the same moment: one goes through.
    const o1 = await json(s, 'POST', e('/mos'), { productId: prod.id, quantity: 2 });
    const o2 = await json(s, 'POST', e('/mos'), { productId: prod.id, quantity: 2 });
    for (const o of [o1, o2]) await json(s, 'POST', e(`/mos/${o.id}/release`), { reserve: false });
    const mats = await Promise.all([o1, o2].map(async (o) => (await json(s, 'GET', e(`/mos/${o.id}`))).materials[0].id));
    const both = await Promise.all([o1, o2].map((o, i) => call(s, 'POST', e(`/mos/${o.id}/issue`), { lines: [{ materialId: mats[i], locationId: bin.id, quantity: 4 }] })));
    expect(both.map((r) => r.status).sort()).toEqual([201, 409]);
    expect((await json(s, 'GET', e(`/products/${part.id}/stock`))).totals).toMatchObject({ onHand: 0 });

    // The database refuses completing beyond the order (and its tolerance), here as on D1.
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      expect(() => db.prepare('UPDATE erp_mfg_orders SET completed_qty = 9 WHERE id = ?').run(mo.id)).toThrow(/CHECK constraint failed/);
      expect(() => db.prepare('UPDATE erp_mo_materials SET issued_qty = -1 WHERE mo_id = ?').run(mo.id)).toThrow(/CHECK constraint failed/);
      const n = db.prepare("SELECT COUNT(*) AS n FROM erp_integration_events WHERE source_type = 'manufacturing_order' AND source_id = ? AND status = 'planned'").get(mo.id) as { n: number };
      expect(n.n).toBeGreaterThanOrEqual(3);
    } finally {
      db.close();
    }
  });

  it('makes the example company’s work centres, an order in progress and MRP suggestions', async () => {
    const s = await signup('Node Example Maker');
    const built = await json(s, 'POST', '/api/system/demo', {});
    expect(built.status).toBe('ready');
    const e = (p: string) => `/api/erp/c/${built.companyId}${p}`;
    expect((await json(s, 'GET', e('/work-centres'))).workCentres).toHaveLength(3);
    expect((await json(s, 'GET', e('/mos'))).orders).toMatchObject([{ number: 'MO-00001', status: 'in_progress' }]);
    const run = await json(s, 'GET', e('/mrp/runs/latest'));
    expect(run.run.number).toBe('MRP-00001');
    expect(run.suggestions.length).toBeGreaterThan(0);
    const sf = await json(s, 'GET', e('/shop-floor'));
    expect(sf.workCentres.find((w: any) => w.code === 'FAB').current).toHaveLength(1);
  });
});
