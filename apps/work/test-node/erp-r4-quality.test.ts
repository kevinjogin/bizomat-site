// BIZOMAT ERP, Release 4 part A on the Node runtime (node:sqlite and the data folder's file store), over real HTTP:
// migration 0023 is additive (it only creates erp_ tables and indexes, lists no extensible kinds in a CHECK, and every
// earlier table is unchanged after it); Scenario E from an incoming inspection to a closed NCR with exact quantities and
// values; the same disposition action sent twice at once is done once; one of two simultaneous dispositions of an NCR
// stands; the CHECKs hold on node:sqlite; and the example company gets its quality records.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-erp-r4q-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

describe('migration 0023', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0023_'))!;

  it('only creates erp_ tables and indexes, and lists no extensible kinds in a CHECK', () => {
    expect(m.name).toBe('0023_erp_quality.sql');
    const sql = m.sql
      .split('\n')
      .map((l) => l.replace(/--.*$/, ''))
      .join('\n');
    expect(sql).not.toMatch(/CREATE TRIGGER/);
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    expect(statements.length).toBeGreaterThan(25);
    for (const s of statements) expect(s, s.slice(0, 80)).toMatch(/^CREATE (TABLE erp_qc_\w+ \(|(UNIQUE )?INDEX erp_qc_\w+ ON erp_qc_\w+\()/);
    expect(sql.replace(/ON DELETE (CASCADE|SET NULL)/g, '')).not.toMatch(/\b(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/i);
    const checks = sql.match(/CHECK \((?:[^()]|\([^()]*\))*\)/g) ?? [];
    expect(checks.length).toBeGreaterThan(30);
    for (const kind of ['incoming', 'first_article', 'in_process', 'final', 'supplier', 'dimension', 'attribute', 'visual', 'receipt_line', 'mo_operation', 'manual', 'minor', 'major', 'critical', 'scrap', 'rework', 'use_as_is', 'return_to_supplier', 'supplier_return', 'release', 'corrective', 'preventive', 'five_whys', 'quality_manager']) {
      expect(checks.filter((c) => c.includes(`'${kind}'`)), kind).toEqual([]);
    }
    // No foreign key to Maintenance's tables: an NCR's asset is only read.
    expect(sql).not.toMatch(/REFERENCES mt_/);
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
    expect(after.filter((r) => !old.has(`${r.type}:${r.name}`)).every((r) => r.name.startsWith('erp_qc_'))).toBe(true);
    const added = after.filter((r) => r.type === 'table' && !old.has(`table:${r.name}`)).map((r) => r.name);
    expect(added.sort()).toEqual(['erp_qc_capas', 'erp_qc_dispositions', 'erp_qc_insp_chars', 'erp_qc_inspections', 'erp_qc_ncr_actions', 'erp_qc_ncr_inspections', 'erp_qc_ncrs', 'erp_qc_plan_chars', 'erp_qc_plans', 'erp_qc_readings']);
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
    body: JSON.stringify({ email: `node.erp4q.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
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

describe('ERP Release 4 quality on the Node runtime', () => {
  it('runs Scenario E with exact quantities and values, and does each disposition once under simultaneous requests', async () => {
    const s = await signup('Node Inspector');
    const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const e = (p: string) => `/api/erp/c/${own.id}${p}`;
    await json(s, 'PUT', e('/erp-settings'), { costingMethod: 'weighted_average', adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000 });
    const wh = await json(s, 'POST', e('/warehouses'), { code: 'N', name: 'Node store' });
    const bin = await json(s, 'POST', e('/locations'), { warehouseId: wh.id, code: 'B1' });
    const quar = await json(s, 'POST', e('/locations'), { warehouseId: wh.id, code: 'Q', kind: 'quarantine' });
    const part = await json(s, 'POST', e('/products'), { name: 'Node pin', type: 'purchased_item' });
    await json(s, 'PUT', e(`/products/${part.id}/stock-settings`), { trackLots: true, inspectionRequired: true });
    const sup = await json(s, 'POST', e('/suppliers'), { legalName: 'Node Pins' });
    await json(s, 'POST', e(`/suppliers/${sup.id}/status`), { status: 'approved' });
    const po = await json(s, 'POST', e('/purchase-orders'), { supplierId: sup.id, lines: [{ productId: part.id, quantity: 10, unitPriceCents: 250 }] });
    await json(s, 'POST', e(`/purchase-orders/${po.id}/submit`), {});
    const line = (await json(s, 'GET', e(`/purchase-orders/${po.id}`))).lines[0];
    const gr = await json(s, 'POST', e(`/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: line.id, received: 10, locationId: bin.id, lot: 'N-1' }] });
    const rl = (await json(s, 'GET', e(`/receipts/${gr.id}`))).lines[0];
    const plan = await json(s, 'POST', e('/qc-plans'), { name: 'Pins', kind: 'incoming', productId: part.id, characteristics: [{ name: 'Diameter', kind: 'dimension', unit: 'mm', nominal: 6, tolerance: 0.02, sampleSize: 2 }] });
    await json(s, 'POST', e(`/qc-plans/${plan.id}/release`), {});

    // Perform the inspection and record the failure (6.03 is outside 6 ± 0.02); quarantine the lot.
    const qi = await json(s, 'POST', e('/inspections'), { sourceType: 'receipt_line', sourceId: rl.id });
    const ch = (await json(s, 'GET', e(`/inspections/${qi.id}`))).characteristics[0];
    const rv = await json(s, 'PUT', e(`/inspections/${qi.id}/readings`), { readings: [{ charId: ch.id, sampleNo: 1, value: 6.01 }, { charId: ch.id, sampleNo: 2, value: 6.03, ok: true }] });
    expect(rv.characteristics[0].readings.map((r: any) => r.ok)).toEqual([true, false]);
    // Completed twice at the same moment: once.
    const both = await Promise.all([1, 2].map(() => call(s, 'POST', e(`/inspections/${qi.id}/complete`), { quarantine: { toLocationId: quar.id } })));
    expect(both.map((r) => r.status).sort()).toEqual([200, 409]);
    expect((await json(s, 'GET', e(`/products/${part.id}/stock`))).totals).toMatchObject({ onHand: 0, quarantine: 10 });

    // Raise the NCR; two dispositions at the same moment: one stands.
    const ncr = await json(s, 'POST', e('/ncrs'), { title: 'Pins over size', description: 'Sample 2 at 6.03 mm', severity: 'major', inspectionIds: [qi.id] });
    await json(s, 'POST', e(`/ncrs/${ncr.id}/contain`), { containment: 'Lot N-1 in quarantine' });
    const decide = await Promise.all([
      call(s, 'POST', e(`/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 4 }, { kind: 'use_as_is', quantity: 6 }] }),
      call(s, 'POST', e(`/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 10 }] }),
    ]);
    expect(decide.map((r) => r.status).sort()).toEqual([200, 409]);
    const view = await json(s, 'GET', e(`/ncrs/${ncr.id}`));
    const scrapLine = view.dispositions.find((d: any) => d.kind === 'scrap');
    // The same scrap sent twice at once is done once; then the rest.
    const body = { dispositionId: scrapLine.id, action: 'scrap', quantity: Math.min(scrapLine.quantity, 4), requestKey: 'node-scrap-0001' };
    const twice = await Promise.all([call(s, 'POST', e(`/ncrs/${ncr.id}/actions`), body), call(s, 'POST', e(`/ncrs/${ncr.id}/actions`), body)]);
    expect(twice.map((r) => r.status).sort()).toEqual([200, 201]);
    if (scrapLine.quantity > 4) await json(s, 'POST', e(`/ncrs/${ncr.id}/actions`), { dispositionId: scrapLine.id, action: 'scrap', quantity: scrapLine.quantity - 4, requestKey: 'node-scrap-0002' });
    const useLine = view.dispositions.find((d: any) => d.kind === 'use_as_is');
    if (useLine) await json(s, 'POST', e(`/ncrs/${ncr.id}/actions`), { dispositionId: useLine.id, action: 'release', quantity: useLine.quantity, toLocationId: bin.id, requestKey: 'node-release-0001' });
    const scrapped = scrapLine.quantity;
    expect((await json(s, 'GET', e(`/products/${part.id}/stock`))).totals).toMatchObject({ onHand: 10 - scrapped, quarantine: 0, valueCents: (10 - scrapped) * 250 });

    // Corrective action (the one-person exception recorded), then verify and close.
    const capa = await json(s, 'POST', e('/capas'), { kind: 'corrective', ncrId: ncr.id, title: 'Tighter supplier check', responsibleId: (await json(s, 'GET', e('/me'))).user.id });
    expect(await json(s, 'POST', e(`/capas/${capa.id}/approve`), {})).toMatchObject({ sodException: true });
    await json(s, 'POST', e(`/capas/${capa.id}/done`), { note: 'Supplier now checks 5 per batch' });
    await json(s, 'POST', e(`/capas/${capa.id}/verify`), { effective: true, note: 'Next lot passed' });
    await json(s, 'POST', e(`/capas/${capa.id}/close`), {});
    await json(s, 'POST', e(`/ncrs/${ncr.id}/to-verification`), {});
    await json(s, 'POST', e(`/ncrs/${ncr.id}/close`), { verificationNote: 'Next lot passed incoming inspection' });
    expect((await json(s, 'GET', e(`/ncrs/${ncr.id}`))).ncr.status).toBe('closed');
    const copq = await json(s, 'GET', e('/reports/cost-of-poor-quality'));
    expect(copq.totals).toEqual({ scrapCents: scrapped * 250, reworkCents: 0, internalFailureCents: scrapped * 250 });
    expect((await json(s, 'GET', e('/reports/rejection-rates'))).byProduct).toMatchObject([{ inspections: 1, failed: 1, inspectedQty: 10, rejectedQty: 10, rejectionRatePct: 100 }]);

    // The database refuses doing more than was decided, or releasing more than was quarantined, here as on D1.
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      expect(() => db.prepare('UPDATE erp_qc_dispositions SET done_qty = quantity + 1 WHERE id = ?').run(scrapLine.id)).toThrow(/CHECK constraint failed/);
      expect(() => db.prepare('UPDATE erp_qc_inspections SET released_qty = quarantined_qty + 1 WHERE id = ?').run(qi.id)).toThrow(/CHECK constraint failed/);
      const scraps = db.prepare("SELECT COUNT(*) AS n FROM erp_stock_moves WHERE move_type = 'scrap' AND source_id = ?").get(ncr.id) as { n: number };
      expect(scraps.n).toBe(scrapped > 4 ? 2 : 1);
      const fin = db.prepare('SELECT COUNT(*) AS n FROM fin_journals').get() as { n: number };
      expect(fin.n).toBe(0);
    } finally {
      db.close();
    }
  });

  it('makes the example company’s plan, failed inspection, NCR and corrective action', async () => {
    const s = await signup('Node Example Inspector');
    const built = await json(s, 'POST', '/api/system/demo', {});
    expect(built.status).toBe('ready');
    const e = (p: string) => `/api/erp/c/${built.companyId}${p}`;
    expect((await json(s, 'GET', e('/qc-plans'))).plans).toMatchObject([{ number: 'QP-00001', status: 'released' }]);
    expect((await json(s, 'GET', e('/inspections'))).inspections).toMatchObject([{ number: 'QI-00001', result: 'failed' }]);
    expect((await json(s, 'GET', e('/ncrs'))).ncrs).toMatchObject([{ number: 'NCR-00001', status: 'investigating' }]);
    expect((await json(s, 'GET', e('/capas'))).capas).toMatchObject([{ number: 'CA-00001', status: 'in_progress' }]);
    const ov = await json(s, 'GET', e('/quality/overview'));
    expect(ov.counts).toMatchObject({ openNcrs: 1, openCapas: 1, plansReleased: 1, failedLast30Days: 1 });
  });
});
