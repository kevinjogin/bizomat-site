// BIZOMAT ERP, Release 2 on the Node runtime (node:sqlite and the data folder's file store), over real HTTP:
// migration 0021 is additive (it only creates erp_ tables, indexes and the ledger's append-only triggers, and every
// earlier table is unchanged after it); two simultaneous issues of the last unit let exactly one through; a receipt
// sent twice is made once and two simultaneous receipts of the last units let one through; FIFO values an issue from the
// oldest layers; the ledger refuses changes; the draft bill in Finance is made once; and the example company gets its
// warehouse, purchase order and stock.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-erp-r2-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

describe('migration 0021', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0021_'))!;

  it('only creates erp_ tables, indexes and the ledger triggers', () => {
    expect(m.name).toBe('0021_erp_purchasing_inventory.sql');
    const sql = m.sql
      .split('\n')
      .map((l) => l.replace(/--.*$/, ''))
      .join('\n');
    // The two triggers are one line each; their bodies hold semicolons of their own.
    const triggers = sql.split('\n').filter((l) => l.startsWith('CREATE TRIGGER'));
    expect(triggers).toHaveLength(2);
    for (const t of triggers) expect(t).toMatch(/^CREATE TRIGGER erp_stock_moves_\w+ BEFORE (UPDATE OF [\w, ]+|DELETE) ON erp_stock_moves .*BEGIN SELECT RAISE\(ABORT, 'ERP_LEDGER: [^']+'\); END;$/);
    const rest = sql
      .split('\n')
      .filter((l) => !l.startsWith('CREATE TRIGGER'))
      .join('\n');
    const statements = rest
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    expect(statements.length).toBeGreaterThan(40);
    for (const s of statements) expect(s, s.slice(0, 80)).toMatch(/^CREATE (TABLE erp_\w+ \(|(UNIQUE )?INDEX erp_\w+ ON erp_\w+\()/);
    expect(rest.replace(/ON DELETE (CASCADE|SET NULL)/g, '')).not.toMatch(/\b(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/i);
  });

  it('leaves every earlier table exactly as it was', () => {
    const db = openDatabase(join(root, 'additive.sqlite'));
    applyMigrations(db, all.filter((x) => x.name < m.name));
    const schema = () => db.prepare("SELECT type, name, sql FROM sqlite_master WHERE type <> 'trigger' AND name NOT LIKE 'sqlite_%' ORDER BY type, name").all() as any[];
    const before = schema();
    expect(applyMigrations(db, all.filter((x) => x.name <= m.name))).toContain(m.name);
    const after = schema();
    const old = new Set(before.map((r) => `${r.type}:${r.name}`));
    // every earlier table and index is unchanged; everything new is erp_
    expect(after.filter((r) => old.has(`${r.type}:${r.name}`))).toEqual(before);
    expect(after.filter((r) => !old.has(`${r.type}:${r.name}`)).every((r) => r.name.startsWith('erp_'))).toBe(true);
    const added = after.filter((r) => r.type === 'table' && !old.has(`table:${r.name}`)).map((r) => r.name);
    expect(added.sort()).toEqual(
      [
        'erp_adjustments',
        'erp_cost_layers',
        'erp_count_lines',
        'erp_counts',
        'erp_done',
        'erp_integration_events',
        'erp_locations',
        'erp_po_lines',
        'erp_po_revisions',
        'erp_product_stock',
        'erp_purchase_orders',
        'erp_purges',
        'erp_quotation_lines',
        'erp_quotations',
        'erp_receipt_lines',
        'erp_receipts',
        'erp_record_files',
        'erp_requisition_lines',
        'erp_requisitions',
        'erp_reservations',
        'erp_rfq_lines',
        'erp_rfq_suppliers',
        'erp_rfqs',
        'erp_role_grants',
        'erp_sequences',
        'erp_settings',
        'erp_stock',
        'erp_stock_moves',
        'erp_valuation',
        'erp_warehouses',
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
    body: JSON.stringify({ email: `node.erp2.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
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

describe('ERP Release 2 on the Node runtime', () => {
  it('keeps stock at or above zero under concurrency, receives once, values FIFO and keeps the ledger append-only', async () => {
    const s = await signup('Node Storeman');
    const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const e = (p: string) => `/api/erp/c/${own.id}${p}`;
    await json(s, 'PUT', e('/erp-settings'), { costingMethod: 'fifo', adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000 });
    const wh = await json(s, 'POST', e('/warehouses'), { code: 'N', name: 'Node store' });
    const bin = await json(s, 'POST', e('/locations'), { warehouseId: wh.id, code: 'B1' });
    const item = await json(s, 'POST', e('/products'), { name: 'Node part', type: 'purchased_item' });
    const sup = await json(s, 'POST', e('/suppliers'), { legalName: 'Node Supplies' });
    await json(s, 'POST', e(`/suppliers/${sup.id}/status`), { status: 'approved' });

    // Two layers in by a purchase order received twice (the second request is a replay), then FIFO issues.
    const po = await json(s, 'POST', e('/purchase-orders'), { supplierId: sup.id, lines: [{ productId: item.id, quantity: 4, unitPriceCents: 100 }] });
    expect(await json(s, 'POST', e(`/purchase-orders/${po.id}/submit`), {})).toMatchObject({ status: 'approved', rule: 'within_limit' });
    const lineId = (await json(s, 'GET', e(`/purchase-orders/${po.id}`))).lines[0].id;
    const body = { requestKey: 'node-receipt-0001', lines: [{ poLineId: lineId, received: 2, locationId: bin.id }] };
    const [a, b] = await Promise.all([call(s, 'POST', e(`/purchase-orders/${po.id}/receipts`), body), call(s, 'POST', e(`/purchase-orders/${po.id}/receipts`), body)]);
    const ra = (await a.json()) as any;
    const rb = (await b.json()) as any;
    expect(ra.id).toBe(rb.id);
    expect([a.status, b.status].sort()).toEqual([200, 201]);
    // The last two units, received twice at the same moment: one gets them.
    const two = await Promise.all([1, 2].map(() => call(s, 'POST', e(`/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lineId, received: 2, locationId: bin.id }] })));
    expect(two.map((r) => r.status).sort()).toEqual([201, 409]);
    await json(s, 'POST', e('/adjustments'), { productId: item.id, locationId: bin.id, quantity: 2, unitCostCents: 400, reason: 'Found' });
    // FIFO: 4 at 100, then 2 at 400. Issue 5: 4 x 100 + 1 x 400 = 800.
    await json(s, 'POST', e('/stock/issue'), { productId: item.id, locationId: bin.id, quantity: 5 });
    const st = await json(s, 'GET', e(`/products/${item.id}/stock`));
    expect(st.totals).toMatchObject({ onHand: 1, valueCents: 400 });
    // The last unit, issued twice at the same moment: one goes through.
    const last = await Promise.all([1, 2].map(() => call(s, 'POST', e('/stock/issue'), { productId: item.id, locationId: bin.id, quantity: 1 })));
    expect(last.map((r) => r.status).sort()).toEqual([201, 409]);
    expect((await json(s, 'GET', e(`/products/${item.id}/stock`))).totals).toMatchObject({ onHand: 0, valueCents: 0 });

    // The ledger refuses changes and deletions, here as on D1.
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      expect(() => db.prepare('UPDATE erp_stock_moves SET on_hand_delta = 1 WHERE company_id = ?').run(own.id)).toThrow(/append-only/);
      expect(() => db.prepare('DELETE FROM erp_stock_moves WHERE company_id = ?').run(own.id)).toThrow(/append-only/);
    } finally {
      db.close();
    }
  });

  it('makes the example company’s purchasing and stock, and one draft bill in Finance however often it is asked', async () => {
    const s = await signup('Node Example');
    const built = await json(s, 'POST', '/api/system/demo', {});
    expect(built.status).toBe('ready');
    const e = (p: string) => `/api/erp/c/${built.companyId}${p}`;
    const pos = await json(s, 'GET', e('/purchase-orders'));
    expect(pos.purchaseOrders).toMatchObject([{ number: 'PO-00001', status: 'received' }]);
    const receipt = (await json(s, 'GET', e('/receipts'))).receipts[0];
    const steel = (await json(s, 'GET', e('/suppliers'))).suppliers.find((x: any) => x.legalName === 'Example Steel Supplies');
    const finOrg = (await json(s, 'GET', e(`/suppliers/${steel.id}`))).finance.orgs[0].id;
    await json(s, 'POST', e(`/suppliers/${steel.id}/finance`), { finOrgId: finOrg, create: true });
    const res = await Promise.all([1, 2, 3].map(() => call(s, 'POST', e(`/receipts/${receipt.id}/bill`))));
    expect(res.map((r) => r.status)).toContain(201);
    const again = await json(s, 'POST', e(`/receipts/${receipt.id}/bill`));
    expect(again.existing).toBe(true);
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      const bills = db.prepare("SELECT COUNT(*) AS n FROM fin_docs WHERE org_id = ? AND kind = 'bill' AND reference LIKE 'GR-00001%'").get(finOrg) as { n: number };
      expect(bills.n).toBe(1);
    } finally {
      db.close();
    }
  });
});
