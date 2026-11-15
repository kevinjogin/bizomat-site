// BIZOMAT ERP, Release 5 part A on the Node runtime (node:sqlite and the data folder's file store), over real HTTP:
// migration 0025 is additive (it only creates erp_ tables and indexes, lists no extensible kinds in a CHECK, has no
// foreign key to the CRM's or Finance's tables, and every earlier table is unchanged after it); Scenario G in a person's
// own company from a sales order to a delivered shipment and its draft invoice with exact quantities and values; a double
// dispatch made once and the draft invoice made once under three simultaneous requests; one of two dispatches of the
// last unit; the CHECKs on node:sqlite; and the example company, which sends no email even where email works.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-erp-r5-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

const R5_TABLES = ['erp_carriers', 'erp_packages', 'erp_pick_lines', 'erp_rma_lines', 'erp_rmas', 'erp_sales_orders', 'erp_shipment_lines', 'erp_shipments', 'erp_so_allocations', 'erp_so_lines', 'erp_so_mo_links', 'erp_so_revisions'];

describe('migration 0025', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0025_'))!;

  it('only creates erp_ tables and indexes, and lists no extensible kinds in a CHECK', () => {
    expect(m.name).toBe('0025_erp_supply_chain.sql');
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
    for (const s of statements) expect(s, s.slice(0, 80)).toMatch(/^CREATE (TABLE erp_\w+ \(|(UNIQUE )?INDEX erp_\w+ ON erp_\w+\()/);
    expect(sql.replace(/ON DELETE (CASCADE|SET NULL)/g, '')).not.toMatch(/\b(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/i);
    const checks = sql.match(/CHECK \((?:[^()]|\([^()]*\))*\)/g) ?? [];
    expect(checks.length).toBeGreaterThan(25);
    for (const kind of ['stock', 'make', 'box', 'carton', 'pallet', 'damaged', 'wrong_item', 'faulty', 'sales_dispatch', 'shipment', 'sales_manager', 'queued', 'not_configured']) {
      expect(checks.filter((c) => c.includes(`'${kind}'`)), kind).toEqual([]);
    }
    // The customer is a reference read through the CRM's and Finance's own access rules: no foreign key to them.
    expect(sql).not.toMatch(/REFERENCES (crm_|fin_|co_)/);
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
    expect(added.sort()).toEqual(R5_TABLES);
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
    body: JSON.stringify({ email: `node.erp5.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
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

/** A person's own company with a Finance business workspace (registered for GST), a CRM with a customer and a store. */
async function ownCompany(name: string) {
  const s = await signup(name);
  const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
  const e = (p: string) => `/api/erp/c/${own.id}${p}`;
  await json(s, 'PUT', e('/erp-settings'), { costingMethod: 'weighted_average', adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000 });
  const fin = await json(s, 'POST', '/api/fin/orgs', { name: `${name} Finance`, kind: 'business', currency: 'AUD', timezone: 'Australia/Sydney', gstRegistered: true });
  const crm = await json(s, 'POST', '/api/crm/orgs', { name: `${name} CRM`, currency: 'AUD', timezone: 'Australia/Sydney' });
  const crmCo = await json(s, 'POST', `/api/crm/orgs/${crm.id}/companies`, { name: 'Node Customer', email: 'accounts@node-customer.example.com' });
  const finContact = await json(s, 'POST', `/api/fin/orgs/${fin.id}/contacts`, { name: 'Node Customer', kind: 'customer', email: 'accounts@node-customer.example.com' });
  const wh = await json(s, 'POST', e('/warehouses'), { code: 'N', name: 'Node store' });
  const bin = await json(s, 'POST', e('/locations'), { warehouseId: wh.id, code: 'B1' });
  const quar = await json(s, 'POST', e('/locations'), { warehouseId: wh.id, code: 'Q', kind: 'quarantine' });
  return { s, own, e, fin, crm, crmCo, finContact, bin, quar };
}

async function shipAll(s: Session, e: (p: string) => string, shipmentId: string) {
  const sv = await json(s, 'GET', e(`/shipments/${shipmentId}`));
  await json(s, 'POST', e(`/shipments/${shipmentId}/pick`), { lines: sv.picks.map((k: any) => ({ pickLineId: k.id, pickedQty: k.suggestedQty })) });
  await json(s, 'POST', e(`/shipments/${shipmentId}/packages`), { kind: 'box', weightKg: 2 });
  await json(s, 'POST', e(`/shipments/${shipmentId}/packed`), {});
}

describe('ERP Release 5 supply chain on the Node runtime', () => {
  it('runs Scenario G in a person’s own company with exact values, dispatching once and invoicing once', async () => {
    const { s, own, e, fin, crmCo, finContact, bin, quar } = await ownCompany('Node Seller');
    const p = await json(s, 'POST', e('/products'), { name: 'Node lamp', type: 'finished_product', priceCents: 2500 });
    await json(s, 'POST', e('/adjustments'), { productId: p.id, locationId: bin.id, quantity: 5, unitCostCents: 1000, reason: 'Opening stock' });
    // the CRM company and the Finance customer it is billed as: references, nothing copied
    const so = await json(s, 'POST', e('/sales-orders'), { crmCompanyId: crmCo.id, finContactId: finContact.id, promisedDate: new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10), lines: [{ productId: p.id, quantity: 3, taxCode: 'GST' }], confirm: true });
    let v = await json(s, 'GET', e(`/sales-orders/${so.id}`));
    expect(v.order).toMatchObject({ status: 'confirmed', subtotalCents: 7500, taxCents: 750, totalCents: 8250, crmCompanyId: crmCo.id, finContactId: finContact.id });
    await json(s, 'POST', e(`/sales-orders/${so.id}/allocate`), {});
    const carrier = await json(s, 'POST', e('/carriers'), { code: 'NC', name: 'Node Couriers', trackingUrl: 'https://track.example.com/{tracking}' });
    const shp = await json(s, 'POST', e(`/sales-orders/${so.id}/shipments`), { carrierId: carrier.id, freightCostCents: 900, freightChargeCents: 1200 });
    await shipAll(s, e, shp.id);
    const both = await Promise.all([1, 2].map(() => call(s, 'POST', e(`/shipments/${shp.id}/dispatch`), { trackingNumber: 'NODE-1' })));
    expect(both.map((r) => r.status).sort()).toEqual([200, 201]);
    expect((await json(s, 'GET', e(`/products/${p.id}/stock`))).totals).toMatchObject({ onHand: 2, reserved: 0, valueCents: 2000 });
    await json(s, 'POST', e(`/shipments/${shp.id}/deliver`), { receivedBy: 'Node Receiver' });
    const three = await Promise.all([1, 2, 3].map(() => call(s, 'POST', e(`/shipments/${shp.id}/invoice`))));
    expect(three.filter((r) => r.status === 201)).toHaveLength(1);
    expect(three.every((r) => [200, 201, 409].includes(r.status))).toBe(true);
    v = await json(s, 'GET', e(`/sales-orders/${so.id}`));
    expect(v.order.status).toBe('invoiced');
    // a return of one lamp into quarantine, its credit note once
    const rma = await json(s, 'POST', e('/rmas'), { soId: so.id, shipmentId: shp.id, reason: 'faulty', lines: [{ soLineId: v.lines[0].id, quantity: 1 }] });
    await json(s, 'POST', e(`/rmas/${rma.id}/authorise`), {});
    const rl = (await json(s, 'GET', e(`/rmas/${rma.id}`))).lines[0];
    await json(s, 'POST', e(`/rmas/${rma.id}/receive`), { lines: [{ lineId: rl.id, quantity: 1, locationId: quar.id }] });
    await json(s, 'POST', e(`/rmas/${rma.id}/credit-note`));
    expect((await json(s, 'GET', e(`/products/${p.id}/stock`))).totals).toMatchObject({ onHand: 2, quarantine: 1, valueCents: 3000 });
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      const docs = db.prepare("SELECT status, subtotal, tax_total, total FROM fin_docs WHERE org_id = ? AND kind = 'invoice'").all(fin.id) as any[];
      // 3 x 25.00 + freight 12.00 = 87.00 before GST, GST 8.70
      expect(docs).toEqual([{ status: 'draft', subtotal: 8700, tax_total: 870, total: 9570 }]);
      const cn = db.prepare('SELECT status, total FROM fin_credit_notes WHERE org_id = ?').all(fin.id) as any[];
      expect(cn).toEqual([{ status: 'draft', total: 2750 }]);
      expect((db.prepare("SELECT COUNT(*) AS n FROM erp_stock_moves WHERE company_id = ? AND move_type = 'sales_dispatch'").get(own.id) as any).n).toBe(1);
      expect((db.prepare('SELECT COUNT(*) AS n FROM fin_journals WHERE org_id = ?').get(fin.id) as any).n).toBe(0);
      // the CHECKs hold here as on D1: never more shipped than ordered, nor more returned than shipped
      expect(() => db.prepare('UPDATE erp_so_lines SET shipped_qty = quantity + 1 WHERE so_id = ?').run(so.id)).toThrow(/CHECK constraint failed/);
      expect(() => db.prepare('UPDATE erp_so_lines SET returned_qty = shipped_qty + 1 WHERE so_id = ?').run(so.id)).toThrow(/CHECK constraint failed/);
      expect(() => db.prepare('UPDATE erp_shipment_lines SET shipped_qty = picked_qty + 1 WHERE shipment_id = ?').run(shp.id)).toThrow(/CHECK constraint failed/);
    } finally {
      db.close();
    }
  });

  it('lets one of two dispatches of the last unit through', async () => {
    const { s, own, e, crmCo, finContact, bin } = await ownCompany('Node Last');
    const p = await json(s, 'POST', e('/products'), { name: 'Last lamp', type: 'finished_product', priceCents: 2500 });
    await json(s, 'POST', e('/adjustments'), { productId: p.id, locationId: bin.id, quantity: 1, unitCostCents: 1000, reason: 'Opening stock' });
    const so = await json(s, 'POST', e('/sales-orders'), { crmCompanyId: crmCo.id, finContactId: finContact.id, lines: [{ productId: p.id, quantity: 1 }], confirm: true });
    await json(s, 'POST', e(`/sales-orders/${so.id}/allocate`), {});
    const a = await json(s, 'POST', e(`/sales-orders/${so.id}/shipments`), {});
    // a second shipment of the same unit, as two people planning at the same moment would leave it
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      const t = Date.now();
      db.prepare("INSERT INTO erp_shipments (id, company_id, number, so_id, status, created_at, updated_at) VALUES ('node-b', ?, 'SHP-09999', ?, 'planned', ?, ?)").run(own.id, so.id, t, t);
      db.prepare("INSERT INTO erp_shipment_lines (id, company_id, shipment_id, so_line_id, product_id, quantity) SELECT 'node-sl-b', company_id, 'node-b', so_line_id, product_id, quantity FROM erp_shipment_lines WHERE shipment_id = ?").run(a.id);
      db.prepare("INSERT INTO erp_pick_lines (id, company_id, shipment_id, shipment_line_id, position, product_id, location_id, lot, serial, reservation_id, suggested_qty) SELECT 'node-pk-b', company_id, 'node-b', 'node-sl-b', position, product_id, location_id, lot, serial, reservation_id, suggested_qty FROM erp_pick_lines WHERE shipment_id = ?").run(a.id);
    } finally {
      db.close();
    }
    await shipAll(s, e, a.id);
    await shipAll(s, e, 'node-b');
    const res = await Promise.all([call(s, 'POST', e(`/shipments/${a.id}/dispatch`), {}), call(s, 'POST', e('/shipments/node-b/dispatch'), {})]);
    expect(res.map((r) => r.status).sort()).toEqual([201, 409]);
    expect((await json(s, 'GET', e(`/products/${p.id}/stock`))).totals).toMatchObject({ onHand: 0, reserved: 0 });
  });

  it('makes the example company’s supply chain records and sends no email, even where email works', async () => {
    const s = await signup('Node Example Seller');
    const built = await json(s, 'POST', '/api/system/demo', {});
    expect(built.status).toBe('ready');
    const e = (p: string) => `/api/erp/c/${built.companyId}${p}`;
    const sos = (await json(s, 'GET', e('/sales-orders'))).orders;
    expect(sos).toMatchObject([{ number: 'SO-00001', status: 'partially_shipped' }]);
    const shipments = (await json(s, 'GET', e('/shipments'))).shipments;
    expect(shipments).toMatchObject([{ number: 'SHP-00001', status: 'delivered', notifyStatus: 'example', invoiceStatus: 'done' }]);
    expect((await json(s, 'GET', e('/rmas'))).returns).toMatchObject([{ number: 'RMA-00001', status: 'received', creditStatus: 'done' }]);
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      expect((db.prepare("SELECT COUNT(*) AS n FROM email_outbox WHERE template = 'erp_dispatch'").get() as any).n).toBe(0);
    } finally {
      db.close();
    }
  });
});
