// BIZOMAT ERP, Release 1 on the Node runtime (node:sqlite and the data folder's file store), over real HTTP:
// migration 0020 is additive (it only creates erp_ tables and indexes, and every earlier table is unchanged after it), a
// product goes from a bill of materials through a change order to release, two simultaneous releases let exactly one
// through on node:sqlite, a STEP document is stored on disk and served back as a download, and a supplier is approved.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-erp-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

describe('migration 0020', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0020_'))!;

  it('only creates erp_ tables and indexes', () => {
    expect(m.name).toBe('0020_erp_engineering_procurement.sql');
    const sql = m.sql
      .split('\n')
      .map((l) => l.replace(/--.*$/, ''))
      .join('\n');
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    expect(statements.length).toBeGreaterThan(20);
    for (const s of statements) {
      expect(s, s.slice(0, 80)).toMatch(/^CREATE (TABLE erp_\w+ \(|(UNIQUE )?INDEX erp_\w+ ON erp_\w+\()/);
    }
    // No statement changes data or an existing table (foreign keys' ON DELETE actions aside).
    expect(sql.replace(/ON DELETE (CASCADE|SET NULL)/g, '')).not.toMatch(/\b(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/i);
  });

  it('leaves every earlier table exactly as it was', () => {
    const db = openDatabase(join(root, 'additive.sqlite'));
    applyMigrations(db, all.filter((x) => x.name < '0020'));
    const schema = () => db.prepare("SELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE 'erp_%' AND name NOT LIKE 'sqlite_%' ORDER BY type, name").all();
    const before = schema();
    expect(applyMigrations(db, all)).toContain(m.name);
    expect(schema()).toEqual(before);
    const erpTables = (db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'erp_%' ORDER BY name").all() as { name: string }[]).map((r) => r.name);
    expect(erpTables).toEqual([
      'erp_bom_lines',
      'erp_change_orders',
      'erp_change_request_products',
      'erp_change_requests',
      'erp_counters',
      'erp_document_versions',
      'erp_documents',
      'erp_events',
      'erp_files',
      'erp_product_suppliers',
      'erp_products',
      'erp_revisions',
      'erp_supplier_contacts',
      'erp_suppliers',
      'erp_user_roles',
    ]);
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
    body: JSON.stringify({ email: `node.erp.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
  });
  expect(res.status).toBe(201);
  const data = (await res.json()) as { csrfToken: string };
  return { cookie: res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.includes('workos_sid='))!, csrf: data.csrfToken };
}

async function call(s: Session, method: string, path: string, body?: unknown) {
  const isForm = body instanceof FormData;
  return fetch(`${server.url}${path}`, {
    method,
    headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url, ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
}

async function json<T = any>(s: Session, method: string, path: string, body?: unknown): Promise<T> {
  const res = await call(s, method, path, body);
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return JSON.parse(text) as T;
}

describe('ERP Release 1 on the Node runtime', () => {
  it('releases a bill of materials through a change order, refuses a second simultaneous release and stores a STEP file', async () => {
    const s = await signup('Node Engineer');
    const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const e = (p: string) => `/api/erp/c/${own.id}${p}`;
    const asm = await json(s, 'POST', e('/products'), { name: 'Frame', type: 'assembly' });
    const tube = await json(s, 'POST', e('/products'), { name: 'Tube', type: 'raw_material', standardCostCents: 250 });
    const pin = await json(s, 'POST', e('/products'), { name: 'Pin', type: 'component', standardCostCents: 15 });
    expect([asm.number, tube.number, pin.number]).toEqual(['PRD-00001', 'PRD-00002', 'PRD-00003']);
    const rev = (await json(s, 'GET', e(`/products/${asm.id}`))).revisions[0];
    await json(s, 'POST', e(`/revisions/${rev.id}/lines`), { componentId: tube.id, quantity: 4, scrapPct: 2.5 });
    await json(s, 'POST', e(`/revisions/${rev.id}/lines`), { componentId: pin.id, quantity: 6 });
    expect((await call(s, 'POST', e(`/revisions/${rev.id}/lines`), { componentId: asm.id, quantity: 1 })).status).toBe(400);

    const eco = await json(s, 'POST', e('/change-orders'), { title: 'Frame A', productIds: [asm.id] });
    await json(s, 'POST', e(`/change-orders/${eco.id}/submit`), {});
    await json(s, 'POST', e(`/change-orders/${eco.id}/approve`), {});
    const [r1, r2] = await Promise.all([call(s, 'POST', e(`/change-orders/${eco.id}/release`), {}), call(s, 'POST', e(`/change-orders/${eco.id}/release`), {})]);
    expect([r1.status, r2.status].sort()).toEqual([200, 409]);
    const detail = await json(s, 'GET', e(`/change-orders/${eco.id}`));
    expect(detail.order).toMatchObject({ status: 'released', sodException: true });
    expect(detail.history.filter((h: any) => h.action === 'change_order.released')).toHaveLength(1);
    // 4 x 1.025 x 250 + 6 x 15 = 1025 + 90 = 1115 cents
    expect((await json(s, 'GET', e(`/revisions/${rev.id}/cost`))).unitCostCents).toBe(1115);
    expect((await call(s, 'POST', e(`/revisions/${rev.id}/lines`), { componentId: pin.id, quantity: 1 })).status).toBe(409);
    const csv = await call(s, 'GET', e(`/revisions/${rev.id}/explosion?format=csv`));
    expect(csv.headers.get('content-type')).toMatch(/text\/csv/);
    expect((await csv.text()).split('\n').length).toBeGreaterThanOrEqual(3);

    const fd = new FormData();
    const step = 'ISO-10303-21;\nHEADER;\nFILE_NAME(\'frame.step\');\nENDSEC;\nEND-ISO-10303-21;\n';
    fd.set('file', new File([step], 'frame.step'));
    fd.set('productId', asm.id);
    fd.set('revisionId', rev.id);
    fd.set('title', 'Frame model');
    fd.set('kind', 'step');
    const up = await call(s, 'POST', e('/documents'), fd);
    expect(up.status).toBe(201);
    const doc = (await up.json()) as any;
    const versions = (await json(s, 'GET', e(`/documents/${doc.id}`))).versions;
    const dl = await call(s, 'GET', versions[0].url);
    expect(dl.status).toBe(200);
    expect(dl.headers.get('content-type')).toBe('application/octet-stream');
    expect(dl.headers.get('content-disposition')).toMatch(/^attachment/);
    expect(Buffer.from(await dl.arrayBuffer()).toString('utf8')).toBe(step);

    const sup = await json(s, 'POST', e('/suppliers'), { legalName: 'Node Supplies' });
    expect(sup.number).toBe('SUP-0001');
    expect((await json(s, 'POST', e(`/suppliers/${sup.id}/status`), { status: 'approved' })).sodException).toBe(true);
    await json(s, 'PUT', e(`/products/${tube.id}/suppliers/${sup.id}`), { priceCents: 230, preferred: true });
    const report = await json(s, 'GET', e('/reports/suppliers'));
    expect(report.rows).toMatchObject([{ number: 'SUP-0001', status: 'approved', products: 1, preferred: 1 }]);

    // Another person: 404 on this company.
    const other = await signup('Node Outsider');
    expect((await call(other, 'GET', e('/products'))).status).toBe(404);
  });
});
