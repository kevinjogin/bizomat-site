// Maintenance stages M2 and M3 on the Node runtime (node:sqlite and the data folder), over real HTTP: migration 0024 is
// additive (it only creates mt_ tables and indexes, and every earlier table is unchanged after it); Scenario F from an
// asset to a completed preventive work order with exact costs and its next due date moved on; generation run three
// times at once makes one work order; two simultaneous issues of the last unit let exactly one through; a prestart
// failure sets the asset out of service; and the example company gets its M2 and M3 records.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-mt-m2m3-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

describe('migration 0024', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0024_'))!;

  it('only creates mt_ tables and indexes, with no CHECK list of extensible kinds', () => {
    expect(m.name).toBe('0024_maintenance_m2_m3.sql');
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
    for (const s of statements) expect(s, s.slice(0, 80)).toMatch(/^CREATE (TABLE mt_\w+ \(|(UNIQUE )?INDEX mt_\w+ ON mt_\w+\()/);
    expect(sql.replace(/ON DELETE (CASCADE|SET NULL)/g, '')).not.toMatch(/\b(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/i);
    const checks = sql.match(/CHECK \((?:[^()]|\([^()]*\))*\)/g) ?? [];
    expect(checks.length).toBeGreaterThan(20);
    for (const kind of ['time', 'meter', 'condition', 'day', 'month', 'fixed', 'completion', 'pass_fail', 'number', 'work_order', 'request', 'manual', 'prestart', 'timer', 'passed', 'failed', 'open']) {
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
    expect(after.filter((r) => !old.has(`${r.type}:${r.name}`)).every((r) => r.name.startsWith('mt_'))).toBe(true);
    const added = after.filter((r) => r.type === 'table' && !old.has(`table:${r.name}`)).map((r) => r.name);
    expect(added.sort()).toEqual(
      [
        'mt_asset_prestart',
        'mt_asset_sites',
        'mt_done',
        'mt_downtime',
        'mt_insp_items',
        'mt_insp_results',
        'mt_insp_templates',
        'mt_labour_costs',
        'mt_meters',
        'mt_pm_occurrences',
        'mt_pm_schedules',
        'mt_pm_templates',
        'mt_prestarts',
        'mt_readings',
        'mt_sites',
        'mt_stores',
        'mt_technician_trades',
        'mt_technicians',
        'mt_trades',
        'mt_wo_inspections',
        'mt_wo_stock',
      ].sort(),
    );
    expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([]);
    expect((db.prepare('PRAGMA integrity_check').get() as any).integrity_check).toBe('ok');
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
    body: JSON.stringify({ email: `node.m2m3.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
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

const today = () => new Date().toISOString().slice(0, 10);
const day = (n: number) => new Date(Date.parse(`${today()}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

describe('maintenance M2 and M3 on the Node runtime', () => {
  it('runs Scenario F with exact costs, generates once under concurrency, refuses a second last-unit issue, and handles a prestart failure', async () => {
    const s = await signup('Node Planner');
    const co = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own').id;
    const mt = (p: string) => `/api/maintenance/c/${co}${p}`;
    const erp = (p: string) => `/api/erp/c/${co}${p}`;
    await json(s, 'PUT', erp('/erp-settings'), { adjustmentApprovalCents: 100_000_000, costingMethod: 'weighted_average' });
    const wh = await json(s, 'POST', erp('/warehouses'), { code: 'MS', name: 'Maintenance store' });
    const bin = await json(s, 'POST', erp('/locations'), { warehouseId: wh.id, code: 'B1' });
    const filter = await json(s, 'POST', erp('/products'), { name: 'Oil filter', type: 'consumable', standardCostCents: 1500 });
    await json(s, 'POST', erp('/adjustments'), { productId: filter.id, locationId: bin.id, quantity: 3, unitCostCents: 1500, reason: 'Opening stock' });
    await json(s, 'PUT', mt(`/stores/${wh.id}`), { store: true });
    await json(s, 'PUT', mt(`/technicians/${(await json(s, 'GET', '/api/auth/me')).user.id}`), { rateCents: 8000 });

    // Scenario F.
    const site = await json(s, 'POST', mt('/sites'), { code: 'YARD', name: 'Main yard' });
    const genset = await json(s, 'POST', mt('/assets'), { name: 'Generator set', category: 'Power', siteId: site.id });
    expect(genset.siteId).toBe(site.id);
    const pm = await json(s, 'POST', mt('/pm/schedules'), { assetId: genset.id, name: 'Generator service', triggerKind: 'time', intervalN: 2, intervalUnit: 'week', startDate: today(), tasks: ['Change the oil filter'], parts: [{ part: 'Oil filter', quantity: 1 }], estimatedHours: 1 });
    const made = await Promise.all([json(s, 'POST', mt('/pm/generate'), { today: today() }), json(s, 'POST', mt('/pm/generate'), { today: today() }), json(s, 'POST', mt('/pm/generate'), { today: today() })]);
    const all = made.flatMap((r: any) => r.made);
    expect(all).toHaveLength(1);
    const woId = all[0].workOrderId;
    await json(s, 'POST', mt(`/work-orders/${woId}/labour`), { date: today(), minutes: 45 });
    expect((await call(s, 'POST', mt(`/work-orders/${woId}/stock/issue`), { lines: [{ productId: filter.id, locationId: bin.id, quantity: 1 }] })).status).toBe(201);
    await json(s, 'POST', mt(`/work-orders/${woId}/complete`), { notes: 'Oil and filter changed' });
    const d = await json(s, 'GET', mt(`/work-orders/${woId}`));
    expect(d.costs).toEqual({ labourCents: 6000, labourUnpricedMinutes: 0, partsCents: 1500, totalCents: 7500 });
    expect((await json(s, 'GET', mt(`/pm/schedules/${pm.id}`))).schedule.nextDueDate).toBe(day(14));
    const costs = await json(s, 'GET', mt(`/reports/costs?from=${today()}&to=${today()}&siteId=${site.id}`));
    expect(costs.totals).toEqual({ labourCents: 6000, partsCents: 1500, totalCents: 7500, unpricedMinutes: 0 });

    // Two work orders ask for the last of the stock at the same moment: exactly one gets it.
    const w1 = await json(s, 'POST', mt('/work-orders'), { assetId: genset.id, description: 'Spare filter 1' });
    const w2 = await json(s, 'POST', mt('/work-orders'), { assetId: genset.id, description: 'Spare filter 2' });
    const [r1, r2] = await Promise.all([call(s, 'POST', mt(`/work-orders/${w1.id}/stock/issue`), { lines: [{ productId: filter.id, locationId: bin.id, quantity: 2 }] }), call(s, 'POST', mt(`/work-orders/${w2.id}/stock/issue`), { lines: [{ productId: filter.id, locationId: bin.id, quantity: 2 }] })]);
    expect([r1.status, r2.status].sort()).toEqual([201, 409]);
    expect((await json(s, 'GET', erp(`/products/${filter.id}/stock`))).totals.onHand).toBe(0);

    // A prestart with a failed critical item.
    const tpl = await json(s, 'POST', mt('/inspection-templates'), { name: 'Generator prestart', items: [{ label: 'Oil level', kind: 'pass_fail', critical: true }] });
    await json(s, 'PUT', mt(`/assets/${genset.id}/prestart`), { templateId: tpl.id });
    const form = await json(s, 'GET', mt(`/assets/${genset.id}/prestart`));
    const p = await json(s, 'POST', mt('/prestarts'), { assetId: genset.id, results: [{ itemId: form.template.items[0].id, passed: false }] });
    expect(p).toMatchObject({ outOfService: true, prestart: { result: 'failed' } });
    expect(p.request.number).toMatch(/^MR-/);
    expect((await json(s, 'GET', mt(`/assets/${genset.id}`))).asset.status).toBe('out_of_service');
  });

  it('gives the example company its M2 and M3 records', async () => {
    const s = await signup('Node Example');
    const built = (await (await call(s, 'POST', '/api/system/demo', {})).json()) as any;
    expect(built.status).toBe('ready');
    const mt = (p: string) => `/api/maintenance/c/${built.companyId}${p}`;
    const overview = await json(s, 'GET', mt('/overview'));
    expect(overview).toMatchObject({ assets: 7, openWorkOrders: 2, preventiveOpen: 0 });
    expect((await json(s, 'GET', mt('/pm/schedules'))).schedules.length).toBeGreaterThanOrEqual(3);
    expect((await json(s, 'GET', mt('/prestarts'))).prestarts).toHaveLength(1);
    const rel = await json(s, 'GET', mt(`/reports/reliability?from=${day(-30)}&to=${today()}`));
    expect(rel.assets[0]).toMatchObject({ failures: 1, downtimeHours: 3.5 });
    expect(rel.downNow).toHaveLength(1);
  });
});
