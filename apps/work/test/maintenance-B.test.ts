// BIZOMAT ERP Maintenance, the field release, stream B (src/worker/maintenance/routes-parts.ts and routes-stock.ts):
// required parts linked to ERP products with what is issued, reserved, free in the stores, short and on a requisition;
// reservations made through ERP Inventory's own records, issued from first and released on the work order, when it is
// completed or cancelled (once, even when two people complete it at the same moment), and never by Inventory; purchase
// requisitions through Procurement's own code for people with the ERP right; and the stocktakes of the maintenance
// stores, counted on a phone without an ERP role, started and submitted by someone who may move stock, and approved and
// posted only in Inventory. Nothing is posted to Finance, not even as planned, for reserving or releasing.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { closeCount, loadCount, type CountClosed } from '../src/worker/erp/inventory';
import { eventIfStmt } from '../src/worker/maintenance/m2util';
import stocktakesSrc from '../src/client/system/maintenance/Stocktakes.tsx?raw';
import extrasSrc from '../src/client/system/maintenance/WorkOrderExtras.tsx?raw';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registerCompany(c: Client, name: string) {
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

async function joinCompany(owner: Client, companyId: string, invitee: Client) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const mt = (co: string, path = '') => `/api/maintenance/c/${co}${path}`;
const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const DAY = 86_400_000;
const today = () => new Date().toISOString().slice(0, 10);
const day = (n: number) => new Date(Date.parse(`${today()}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

/** A registered company with an owner (administrator), a supervisor, two technicians and a requester. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const co = await registerCompany(owner, `${label} Plant`);
  const supervisor = await signup(`${label} Supervisor`);
  const tech = await signup(`${label} Technician`);
  const tech2 = await signup(`${label} Second Technician`);
  const requester = await signup(`${label} Operator`);
  for (const p of [supervisor, tech, tech2, requester]) await joinCompany(owner, co, p);
  await owner.json('PUT', mt(co, `/roles/${supervisor.userId}`), { role: 'supervisor' });
  await owner.json('PUT', mt(co, `/roles/${tech.userId}`), { role: 'technician' });
  await owner.json('PUT', mt(co, `/roles/${tech2.userId}`), { role: 'technician' });
  return { owner, supervisor, tech, tech2, requester, co };
}

/** A company of one: its owner is the maintenance and ERP administrator. */
async function solo(label: string) {
  const owner = await signup(`${label} Owner`);
  const co = await registerCompany(owner, `${label} Works`);
  return { owner, co };
}

/** A maintenance store (an ERP warehouse) with a bin, and a spare part with stock at a known cost. */
async function store(owner: Client, co: string, part = { name: 'Hydraulic filter', qty: 10, cost: 1250 }) {
  await owner.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, costingMethod: 'weighted_average' });
  const wh = await owner.json('POST', erp(co, '/warehouses'), { code: `MS${Math.floor(Math.random() * 1e6)}`, name: 'Maintenance store' });
  const bin = await owner.json('POST', erp(co, '/locations'), { warehouseId: wh.id, code: 'B1', name: 'Bin 1' });
  const product = await owner.json('POST', erp(co, '/products'), { name: part.name, type: 'consumable', standardCostCents: part.cost });
  if (part.qty) {
    const adj = await owner.json('POST', erp(co, '/adjustments'), { productId: product.id, locationId: bin.id, quantity: part.qty, unitCostCents: part.cost, reason: 'Opening stock' });
    expect(adj.status).toBe('posted');
  }
  await owner.json('PUT', mt(co, `/stores/${wh.id}`), { store: true });
  return { wh, bin, product };
}

const erpRole = (owner: Client, co: string, p: Client, role: string) => owner.json('PUT', erp(co, `/roles/${p.userId}`), { roles: [role] });
const switchOff = (module: string, co: string) =>
  env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, 'company', ?, 'off', 'test switch', 'test', ?)").bind(`module_${module}_enabled`, co, Date.now()).run();
const switchOn = (module: string, co: string) => env.DB.prepare('DELETE FROM feature_flags WHERE key = ? AND scope_id = ?').bind(`module_${module}_enabled`, co).run();
const onHand = async (c: Client, co: string, productId: string) => (await c.json('GET', erp(co, `/products/${productId}/stock`))).totals.onHand as number;
const stockRow = (co: string, productId: string) => env.DB.prepare('SELECT SUM(on_hand) AS on_hand, SUM(reserved) AS reserved FROM erp_stock WHERE company_id = ? AND product_id = ?').bind(co, productId).first<{ on_hand: number; reserved: number }>();
const reservation = (co: string, id: string) => env.DB.prepare('SELECT quantity, issued_qty, released_qty, status FROM erp_reservations WHERE company_id = ? AND id = ?').bind(co, id).first<any>();
const postings = async (co: string) => (await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_integration_events WHERE company_id = ?').bind(co).first<{ n: number }>())!.n;
const errorOf = async (res: Response) => ((await res.json()) as any) ?? {};

async function workOrder(by: Client, co: string, o: { description?: string; assignedTo?: string; dueStart?: string; parts?: unknown[] } = {}) {
  const asset = await by.json('POST', mt(co, '/assets'), { name: 'Hydraulic press' });
  const w = await by.json('POST', mt(co, '/work-orders'), { assetId: asset.id, description: o.description ?? 'Change the filter', ...(o.assignedTo ? { assignedTo: o.assignedTo } : {}), ...(o.dueStart ? { dueStart: o.dueStart } : {}), ...(o.parts ? { parts: o.parts } : {}) });
  return { asset, w };
}

describe('required parts linked to products', () => {
  it('links lines to products of the company, one line per product, and shows issued, outstanding, free in the stores and short', async () => {
    const { owner, supervisor, tech, tech2, requester, co } = await team('Papa');
    const { bin, product } = await store(owner, co);
    // The work order is made from the requester's request, so the requester may see it.
    const asset = await supervisor.json('POST', mt(co, '/assets'), { name: 'Hydraulic press' });
    const request = await requester.json('POST', mt(co, '/requests'), { assetId: asset.id, description: 'The press leaks oil' });
    const w = (await supervisor.json('POST', mt(co, `/requests/${request.id}/convert`), { assignedTo: tech.userId })).workOrder;
    const parts = mt(co, `/work-orders/${w.id}/parts`);
    const add = await tech.req('POST', parts, { productId: product.id, quantity: 3 });
    expect(add.status).toBe(201);
    const filterLine = ((await add.json()) as any).id as string;
    const again = await tech.req('POST', parts, { productId: product.id, quantity: 1 });
    expect(again.status).toBe(409);
    expect((await errorOf(again)).error).toBe(`${product.number} is already a required part of ${w.number}: change its quantity`);
    expect((await tech.req('POST', parts, { part: 'Gasket set', quantity: 1 })).status).toBe(201);
    const neither = await tech.req('POST', parts, { quantity: 1 });
    expect(neither.status).toBe(400);
    expect((await errorOf(neither)).error).toBe('Choose a product or write the part');
    // Another company's product is refused; requesters cannot add lines; a technician not assigned does not see the work order.
    const stranger = await signup('Papa Stranger');
    const co2 = await registerCompany(stranger, 'Papa Other Works');
    const foreign = await stranger.json('POST', erp(co2, '/products'), { name: 'Foreign part', type: 'consumable' });
    const cross = await tech.req('POST', parts, { productId: foreign.id, quantity: 1 });
    expect(cross.status).toBe(400);
    expect((await errorOf(cross)).error).toBe('Choose a product of this company');
    expect((await requester.req('POST', parts, { part: 'x', quantity: 1 })).status).toBe(403);
    expect((await tech2.req('POST', parts, { part: 'x', quantity: 1 })).status).toBe(404);

    let view = await tech.json('GET', mt(co, `/work-orders/${w.id}`));
    expect(view.requiredParts.lines).toEqual([
      expect.objectContaining({ id: filterLine, productId: product.id, productNumber: product.number, part: 'Hydraulic filter', quantity: 3, issued: 0, outstanding: 3, reserved: 0, available: 10, shortfall: 0, stocked: true, status: 'in_stores', statusLabel: 'In the stores' }),
      expect.objectContaining({ productId: null, part: 'Gasket set', quantity: 1, available: null, shortfall: null, stocked: false, status: 'not_stocked' }),
    ]);
    expect(view.history.map((e: any) => e.summary)).toContain(`Part added: 3 × ${product.number} Hydraulic filter`);
    // The view carries no costs (the job card prints it for anyone who may see the work order).
    expect(JSON.stringify(view.requiredParts)).not.toMatch(/cents/i);

    // One issued from the bin: issued 1, outstanding 2, 9 free.
    expect((await tech.req('POST', mt(co, `/work-orders/${w.id}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 1 }] })).status).toBe(201);
    view = await tech.json('GET', mt(co, `/work-orders/${w.id}`));
    expect(view.requiredParts.lines[0]).toMatchObject({ issued: 1, outstanding: 2, available: 9, status: 'in_stores' });
    // Needing 12: 11 outstanding, 2 short, 2 to order.
    expect((await tech.req('PATCH', `${parts}/${filterLine}`, { quantity: 12 })).status).toBe(200);
    view = await tech.json('GET', mt(co, `/work-orders/${w.id}`));
    expect(view.requiredParts.lines[0]).toMatchObject({ quantity: 12, outstanding: 11, shortfall: 2, toOrder: 2, status: 'short', statusLabel: 'Short' });
    // A requester sees no stock figures.
    const seen = await requester.json('GET', mt(co, `/work-orders/${w.id}`));
    expect(seen.requiredParts.lines[0]).toMatchObject({ available: null, shortfall: null, toOrder: null, status: 'needed' });
    expect(seen.requiredParts.can).toEqual({ reserve: false, raiseRequisition: false, requisitionNote: null });

    // The product search: no costs, free in the maintenance stores; technicians and above.
    const found = await tech.json('GET', mt(co, '/parts/products?q=hydraulic'));
    expect(found.products).toEqual([expect.objectContaining({ id: product.id, number: product.number, stocked: true, available: 9 })]);
    expect((await requester.req('GET', mt(co, '/parts/products?q=hydraulic'))).status).toBe(403);

    // A new work order takes product lines too, each product once.
    const made = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: w.assetId, description: 'Second job', parts: [{ productId: product.id, quantity: 2 }, { part: 'Rags', quantity: 1 }] });
    const madeView = await supervisor.json('GET', mt(co, `/work-orders/${made.id}`));
    expect(madeView.requiredParts.lines.map((l: any) => [l.productId, l.part, l.quantity])).toEqual([
      [product.id, 'Hydraulic filter', 2],
      [null, 'Rags', 1],
    ]);
    const twice = await supervisor.req('POST', mt(co, '/work-orders'), { assetId: w.assetId, description: 'Third job', parts: [{ productId: product.id, quantity: 2 }, { productId: product.id, quantity: 1 }] });
    expect(twice.status).toBe(400);
    expect((await errorOf(twice)).error).toBe(`Part 2: ${product.number} is listed twice: give one line its total quantity`);
  });
});

describe('reserving through ERP Inventory', () => {
  it('reserves stock for a line, issues from the reservation first, releases it on the work order, and sends a requestKey once', async () => {
    const { owner, supervisor, tech, co } = await team('Romeo');
    const { wh, bin, product } = await store(owner, co);
    const { w } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const line = await tech.json('POST', mt(co, `/work-orders/${w.id}/parts`), { productId: product.id, quantity: 3 });
    const reserve = mt(co, `/work-orders/${w.id}/parts/${line.id}/reserve`);
    const res = await tech.req('POST', reserve, {});
    expect(res.status).toBe(201);
    const made = (await res.json()) as any;
    expect(made).toEqual({ reserved: [expect.objectContaining({ quantity: 3, location: `${wh.code}/B1`, locationId: bin.id })], short: 0 });
    const rid = made.reserved[0].reservationId;
    expect(await stockRow(co, product.id)).toEqual({ on_hand: 10, reserved: 3 });
    let view = await tech.json('GET', mt(co, `/work-orders/${w.id}`));
    expect(view.requiredParts.lines[0]).toMatchObject({ reserved: 3, available: 7, status: 'reserved' });
    expect(view.requiredParts.reservations).toEqual([expect.objectContaining({ id: rid, quantity: 3, open: 3, status: 'open', statusLabel: 'Reserved', partId: line.id, reference: `${w.number} (${product.number})`, byName: 'Romeo Technician' })]);
    expect(view.requiredParts.can).toMatchObject({ reserve: true });
    // Everything still needed is reserved.
    const more = await tech.req('POST', reserve, {});
    expect(more.status).toBe(409);
    expect((await errorOf(more)).error).toBe('Nothing is left to reserve: it is issued or reserved already');
    const ledger = async () => (await env.DB.prepare("SELECT move_type, reserved_delta FROM erp_stock_moves WHERE company_id = ? AND source_type = 'work_order' AND source_id = ? ORDER BY created_at, rowid").bind(co, w.id).all<any>()).results.map((m) => [m.move_type, m.reserved_delta]);
    expect(await ledger()).toEqual([['reserve', 3]]);
    // Reserving is not a part used.
    expect(view.stock.moves).toEqual([]);

    // Two issued from the bin come out of the reservation.
    expect((await tech.req('POST', mt(co, `/work-orders/${w.id}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 2 }] })).status).toBe(201);
    expect(await reservation(co, rid)).toEqual({ quantity: 3, issued_qty: 2, released_qty: 0, status: 'open' });
    expect(await stockRow(co, product.id)).toEqual({ on_hand: 8, reserved: 1 });
    view = await tech.json('GET', mt(co, `/work-orders/${w.id}`));
    expect(view.requiredParts.lines[0]).toMatchObject({ issued: 2, reserved: 1, outstanding: 1 });
    expect(view.stock.moves.map((m: any) => [m.type, m.quantity])).toEqual([['maintenance_issue', 2]]);

    // The rest is released on the work order.
    const unreserve = mt(co, `/work-orders/${w.id}/reservations/${rid}/unreserve`);
    expect((await tech.req('POST', unreserve, {})).status).toBe(200);
    expect(await reservation(co, rid)).toEqual({ quantity: 3, issued_qty: 2, released_qty: 1, status: 'released' });
    expect((await stockRow(co, product.id))!.reserved).toBe(0);
    expect((await ledger()).at(-1)).toEqual(['unreserve', -1]);
    expect((await tech.req('POST', unreserve, {})).status).toBe(409);

    // Needing 5 now: one more reserved with a requestKey, sent twice, is reserved once.
    expect((await tech.req('PATCH', mt(co, `/work-orders/${w.id}/parts/${line.id}`), { quantity: 5 })).status).toBe(200);
    const keyed = { quantity: 1, requestKey: 'reserve-key-01' };
    const first = await tech.req('POST', reserve, keyed);
    expect(first.status).toBe(201);
    const rid2 = ((await first.json()) as any).reserved[0].reservationId;
    expect((await tech.req('POST', reserve, keyed)).status).toBe(409);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_reservations WHERE company_id = ?').bind(co).first<{ n: number }>())!.n).toBe(2);
    // While stock is reserved for it, the line keeps its product and cannot go.
    const relink = await tech.req('PATCH', mt(co, `/work-orders/${w.id}/parts/${line.id}`), { productId: null });
    expect(relink.status).toBe(409);
    expect((await errorOf(relink)).error).toBe('Release the stock reserved for this part first');
    expect((await tech.req('DELETE', mt(co, `/work-orders/${w.id}/parts/${line.id}`))).status).toBe(409);
    // Issuing two takes the reserved one first, then one free.
    expect((await tech.req('POST', mt(co, `/work-orders/${w.id}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 2 }] })).status).toBe(201);
    expect(await reservation(co, rid2)).toEqual({ quantity: 1, issued_qty: 1, released_qty: 0, status: 'issued' });
    expect(await stockRow(co, product.id)).toEqual({ on_hand: 6, reserved: 0 });
    expect((await ledger()).slice(-2)).toEqual([
      ['maintenance_issue', -1],
      ['maintenance_issue', 0],
    ]);
    // Nothing reserved any more: the line can go, and its reservations keep their history without it.
    expect((await tech.req('DELETE', mt(co, `/work-orders/${w.id}/parts/${line.id}`))).status).toBe(200);
    const links = await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_wo_reservations WHERE company_id = ? AND work_order_id = ? AND part_id IS NULL').bind(co, w.id).first<{ n: number }>();
    expect(links!.n).toBe(2);
  });

  it('keeps Inventory from releasing or issuing a maintenance reservation', async () => {
    const { owner, supervisor, tech, co } = await team('Sierra');
    const { bin, product } = await store(owner, co);
    const { w } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const line = await tech.json('POST', mt(co, `/work-orders/${w.id}/parts`), { productId: product.id, quantity: 2 });
    const rid = (await tech.json('POST', mt(co, `/work-orders/${w.id}/parts/${line.id}/reserve`), {})).reserved[0].reservationId;
    const list = await owner.json('GET', erp(co, '/reservations'));
    expect(list.reservations).toEqual(expect.arrayContaining([expect.objectContaining({ id: rid, reference: `${w.number} (${product.number})` })]));
    const release = await owner.req('POST', erp(co, `/reservations/${rid}/release`), {});
    expect(release.status).toBe(409);
    expect((await errorOf(release)).error).toContain(w.number);
    expect((await owner.req('POST', erp(co, `/reservations/${rid}/issue`), {})).status).toBe(409);
    expect(await reservation(co, rid)).toMatchObject({ issued_qty: 0, released_qty: 0, status: 'open' });
    // A reservation made in Inventory itself still releases there.
    const own = await owner.json('POST', erp(co, '/reservations'), { productId: product.id, locationId: bin.id, quantity: 1, reference: 'Job 7' });
    expect((await owner.req('POST', erp(co, `/reservations/${own.id}/release`), {})).status).toBe(200);
  });

  it('reserves what is free and says what is short; refuses text lines, services, other warehouses, locked work orders and a switched-off Warehouse: stock', async () => {
    const { owner, supervisor, tech, requester, co } = await team('Tango');
    const { product } = await store(owner, co, { name: 'Drive belt', qty: 2, cost: 4200 });
    const { w } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const base = mt(co, `/work-orders/${w.id}`);
    const line = await tech.json('POST', `${base}/parts`, { productId: product.id, quantity: 5 });
    const r = await tech.json('POST', `${base}/parts/${line.id}/reserve`, {});
    expect(r.short).toBe(3);
    expect(r.reserved.reduce((n: number, x: any) => n + x.quantity, 0)).toBe(2);
    const view = await tech.json('GET', base);
    expect(view.requiredParts.lines[0]).toMatchObject({ reserved: 2, available: 0, shortfall: 3, toOrder: 3, status: 'short' });
    const none = await tech.req('POST', `${base}/parts/${line.id}/reserve`, {});
    expect(none.status).toBe(409);
    expect((await errorOf(none)).error).toBe(`No ${product.number} is free in the maintenance stores. Raise a requisition for it.`);
    const text = await tech.json('POST', `${base}/parts`, { part: 'Grease', quantity: 1 });
    const textRes = await tech.req('POST', `${base}/parts/${text.id}/reserve`, {});
    expect(textRes.status).toBe(400);
    expect((await errorOf(textRes)).error).toBe('Link this line to a product first: only products are kept in stock');
    const service = await owner.json('POST', erp(co, '/products'), { name: 'Calibration visit', type: 'service' });
    const serviceLine = await tech.json('POST', `${base}/parts`, { productId: service.id, quantity: 1 });
    expect((await tech.req('POST', `${base}/parts/${serviceLine.id}/reserve`, {})).status).toBe(400);
    expect((await requester.req('POST', `${base}/parts/${line.id}/reserve`, {})).status).toBe(403);
    // A location outside the maintenance stores.
    const other = await owner.json('POST', erp(co, '/warehouses'), { code: `WH${Math.floor(Math.random() * 1e6)}`, name: 'Main warehouse' });
    const shelf = await owner.json('POST', erp(co, '/locations'), { warehouseId: other.id, code: 'S1', name: 'Shelf 1' });
    const outside = await tech.req('POST', `${base}/parts/${line.id}/reserve`, { locationId: shelf.id, quantity: 1 });
    expect(outside.status).toBe(400);
    expect((await errorOf(outside)).error).toContain('is not in a maintenance store');
    // Warehouse: stock switched off for the company.
    expect((await tech.json('GET', mt(co, '/me'))).stockModule).toBe(true);
    await switchOff('inventory', co);
    const off = await tech.req('POST', `${base}/parts/${line.id}/reserve`, {});
    expect(off.status).toBe(403);
    expect((await errorOf(off)).details).toMatchObject({ code: 'MODULE_DISABLED', module: 'inventory' });
    expect((await tech.json('GET', mt(co, '/me'))).stockModule).toBe(false);
    expect((await tech.json('GET', base)).requiredParts.can.reserve).toBe(false);
    await switchOn('inventory', co);
    // A completed work order is locked.
    await tech.json('POST', `${base}/complete`, { notes: 'Done with what there was' });
    expect((await tech.req('POST', `${base}/parts/${line.id}/reserve`, {})).status).toBe(409);
  });

  it('gives the last unit to one of two work orders reserving at the same moment', async () => {
    const { owner, supervisor, tech, tech2, co } = await team('Uniform');
    const { product } = await store(owner, co, { name: 'Drive belt', qty: 1, cost: 4200 });
    const { w: w1 } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const { w: w2 } = await workOrder(supervisor, co, { assignedTo: tech2.userId });
    const l1 = await tech.json('POST', mt(co, `/work-orders/${w1.id}/parts`), { productId: product.id, quantity: 1 });
    const l2 = await tech2.json('POST', mt(co, `/work-orders/${w2.id}/parts`), { productId: product.id, quantity: 1 });
    const [a, b] = await Promise.all([tech.req('POST', mt(co, `/work-orders/${w1.id}/parts/${l1.id}/reserve`), {}), tech2.req('POST', mt(co, `/work-orders/${w2.id}/parts/${l2.id}/reserve`), {})]);
    expect([a.status, b.status].sort()).toEqual([201, 409]);
    expect((await stockRow(co, product.id))!.reserved).toBe(1);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_wo_reservations WHERE company_id = ?').bind(co).first<{ n: number }>())!.n).toBe(1);
  });
});

describe('completing or cancelling a work order', () => {
  it('releases what is still reserved, once, and reopening does not reserve again', async () => {
    const { owner, supervisor, tech, co } = await team('Victor');
    const { bin, product } = await store(owner, co);
    const reserveFor = async (wo: any, qty: number) => {
      const line = await tech.json('POST', mt(co, `/work-orders/${wo.id}/parts`), { productId: product.id, quantity: qty });
      return (await tech.json('POST', mt(co, `/work-orders/${wo.id}/parts/${line.id}/reserve`), {})).reserved[0].reservationId as string;
    };
    // A: four reserved, one issued, then completed.
    const { w: a } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const ra = await reserveFor(a, 4);
    await tech.json('POST', mt(co, `/work-orders/${a.id}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 1 }] });
    expect((await tech.req('POST', mt(co, `/work-orders/${a.id}/complete`), { notes: 'Filter changed' })).status).toBe(200);
    expect(await reservation(co, ra)).toEqual({ quantity: 4, issued_qty: 1, released_qty: 3, status: 'released' });
    expect((await stockRow(co, product.id))!.reserved).toBe(0);
    const events = await env.DB.prepare("SELECT COUNT(*) AS n FROM mt_events WHERE company_id = ? AND work_order_id = ? AND action = 'parts.reservations_released'").bind(co, a.id).first<{ n: number }>();
    expect(events!.n).toBe(1);
    await supervisor.json('POST', mt(co, `/work-orders/${a.id}/reopen`), { reason: 'Check the seal again' });
    const reopened = await supervisor.json('GET', mt(co, `/work-orders/${a.id}`));
    expect(reopened.requiredParts.lines[0].reserved).toBe(0);
    expect((await reservation(co, ra)).status).toBe('released');
    // B: two reserved, then cancelled.
    const { w: b } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const rb = await reserveFor(b, 2);
    expect((await supervisor.req('POST', mt(co, `/work-orders/${b.id}/cancel`), { reason: 'Not needed' })).status).toBe(200);
    expect(await reservation(co, rb)).toMatchObject({ released_qty: 2, status: 'released' });
    expect((await stockRow(co, product.id))!.reserved).toBe(0);
    // C: completed by two people at the same moment: one completes it, and the stock is released once.
    const { w: cWo } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    await reserveFor(cWo, 1);
    const [x, y] = await Promise.all([tech.req('POST', mt(co, `/work-orders/${cWo.id}/complete`), { notes: 'Done' }), supervisor.req('POST', mt(co, `/work-orders/${cWo.id}/complete`), { notes: 'Done too' })]);
    expect([x.status, y.status].sort()).toEqual([200, 409]);
    const unreserved = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_stock_moves WHERE company_id = ? AND source_id = ? AND move_type = 'unreserve'").bind(co, cWo.id).first<{ n: number }>();
    expect(unreserved!.n).toBe(1);
    expect((await stockRow(co, product.id))!.reserved).toBe(0);
    // A work order with nothing reserved completes as before.
    const { w: d } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    expect((await tech.req('POST', mt(co, `/work-orders/${d.id}/complete`), { notes: 'Nothing needed' })).status).toBe(200);
  });

  it('records no Finance posting, not even as planned, for reserving and releasing', async () => {
    const { owner, co } = await solo('Whiskey');
    const { product } = await store(owner, co);
    const { w } = await workOrder(owner, co);
    const before = await postings(co);
    const line = await owner.json('POST', mt(co, `/work-orders/${w.id}/parts`), { productId: product.id, quantity: 2 });
    const rid = (await owner.json('POST', mt(co, `/work-orders/${w.id}/parts/${line.id}/reserve`), {})).reserved[0].reservationId;
    expect(await postings(co)).toBe(before);
    await owner.json('POST', mt(co, `/work-orders/${w.id}/reservations/${rid}/unreserve`), { quantity: 1 });
    expect(await postings(co)).toBe(before);
    await owner.json('POST', mt(co, `/work-orders/${w.id}/complete`), { notes: 'Done' });
    expect(await postings(co)).toBe(before);
    expect(await reservation(co, rid)).toMatchObject({ released_qty: 2, status: 'released' });
    const { w: w2 } = await workOrder(owner, co, { description: 'Second' });
    const line2 = await owner.json('POST', mt(co, `/work-orders/${w2.id}/parts`), { productId: product.id, quantity: 1 });
    await owner.json('POST', mt(co, `/work-orders/${w2.id}/parts/${line2.id}/reserve`), {});
    await owner.json('POST', mt(co, `/work-orders/${w2.id}/cancel`), { reason: 'Not needed' });
    expect(await postings(co)).toBe(before);
    expect((await stockRow(co, product.id))!.reserved).toBe(0);
  });
});

describe('requisitions from a work order', () => {
  it('needs the ERP right, goes through Procurement, links back and shows its status', async () => {
    const { owner, supervisor, tech, requester, co } = await team('Xray');
    const { product } = await store(owner, co, { name: 'Hydraulic filter', qty: 1, cost: 1250 });
    const { asset, w } = await workOrder(supervisor, co, { assignedTo: tech.userId, dueStart: day(5) });
    const base = mt(co, `/work-orders/${w.id}`);
    const pLine = (await tech.json('POST', `${base}/parts`, { productId: product.id, quantity: 5 })).id;
    const tLine = (await tech.json('POST', `${base}/parts`, { part: 'Hose crimping by contractor', quantity: 1 })).id;
    let view = await tech.json('GET', base);
    expect(view.requiredParts.can).toMatchObject({ reserve: true, raiseRequisition: false });
    expect(view.requiredParts.can.requisitionNote).toContain('needs an ERP role that may raise requisitions');
    const refused = await tech.req('POST', `${base}/requisition`, { lines: [{ partId: pLine, quantity: 4 }] });
    expect(refused.status).toBe(403);
    expect((await errorOf(refused)).details).toMatchObject({ code: 'ERP_RIGHT_NEEDED', capability: 'requisitions.raise' });
    await erpRole(owner, co, tech, 'warehouse_operator');
    const res = await tech.req('POST', `${base}/requisition`, { lines: [{ partId: pLine, quantity: 4 }, { partId: tLine, quantity: 1 }] });
    expect(res.status).toBe(201);
    const req = (await res.json()) as any;
    expect(req).toMatchObject({ number: expect.stringMatching(/^REQ-\d{5}$/), status: 'draft' });
    const row = await env.DB.prepare('SELECT title, required_date, requester_id FROM erp_requisitions WHERE company_id = ? AND id = ?').bind(co, req.id).first<any>();
    expect(row).toEqual({ title: `For ${w.number} on ${asset.number} ${asset.name}`, required_date: day(5), requester_id: tech.userId });
    const rlines = await env.DB.prepare('SELECT product_id, item, quantity FROM erp_requisition_lines WHERE company_id = ? AND requisition_id = ? ORDER BY position').bind(co, req.id).all<any>();
    expect(rlines.results).toEqual([
      { product_id: product.id, item: 'Hydraulic filter', quantity: 4 },
      { product_id: null, item: 'Hose crimping by contractor', quantity: 1 },
    ]);
    const link = await env.DB.prepare('SELECT work_order_id FROM mt_wo_requisitions WHERE company_id = ? AND requisition_id = ?').bind(co, req.id).all<any>();
    expect(link.results).toEqual([{ work_order_id: w.id }]);
    view = await tech.json('GET', base);
    expect(view.requiredParts.requisitions).toEqual([expect.objectContaining({ id: req.id, number: req.number, status: 'draft', statusLabel: 'Draft', lineCount: 2, purchaseOrders: [], byName: 'Xray Technician' })]);
    expect(view.requiredParts.lines[0]).toMatchObject({ shortfall: 4, onRequisition: 4, toOrder: 0, status: 'on_requisition' });
    expect(view.requiredParts.lines[1]).toMatchObject({ onRequisition: 1, toOrder: 0, status: 'on_requisition' });
    expect(view.requiredParts.can.raiseRequisition).toBe(true);
    expect(JSON.stringify(view.requiredParts)).not.toMatch(/cents/i);
    // Approved in Procurement under its own rules.
    await tech.json('POST', erp(co, `/requisitions/${req.id}/submit`), {});
    await owner.json('POST', erp(co, `/requisitions/${req.id}/approve`), { note: 'ok' });
    expect((await tech.json('GET', base)).requiredParts.requisitions[0]).toMatchObject({ status: 'approved', statusLabel: 'Approved' });
    // A line of another work order; the same requestKey twice; Procurement switched off; requesters; a locked work order.
    const { w: w2 } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const otherLine = (await tech.json('POST', mt(co, `/work-orders/${w2.id}/parts`), { part: 'Bolt', quantity: 1 })).id;
    const wrong = await tech.req('POST', `${base}/requisition`, { lines: [{ partId: otherLine, quantity: 1 }] });
    expect(wrong.status).toBe(400);
    expect((await errorOf(wrong)).error).toBe(`Line 1 is not a required part of ${w.number}`);
    expect((await tech.req('POST', `${base}/requisition`, { lines: [{ partId: tLine, quantity: 1 }, { partId: tLine, quantity: 1 }] })).status).toBe(400);
    const count = async () => (await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_requisitions WHERE company_id = ?').bind(co).first<{ n: number }>())!.n;
    const n0 = await count();
    const keyed = { lines: [{ partId: tLine, quantity: 1 }], requestKey: 'req-key-0001' };
    expect((await tech.req('POST', `${base}/requisition`, keyed)).status).toBe(201);
    expect((await tech.req('POST', `${base}/requisition`, keyed)).status).toBe(409);
    expect(await count()).toBe(n0 + 1);
    await switchOff('procurement', co);
    const off = await tech.req('POST', `${base}/requisition`, { lines: [{ partId: tLine, quantity: 1 }] });
    expect(off.status).toBe(403);
    expect((await errorOf(off)).details).toMatchObject({ code: 'MODULE_DISABLED', module: 'procurement' });
    await switchOn('procurement', co);
    expect((await requester.req('POST', `${base}/requisition`, { lines: [{ partId: tLine, quantity: 1 }] })).status).toBe(403);
    await tech.json('POST', `${base}/complete`, { notes: 'Done' });
    expect((await tech.req('POST', `${base}/requisition`, { lines: [{ partId: tLine, quantity: 1 }] })).status).toBe(409);
  });
});

describe('stocktakes of the maintenance stores', () => {
  it('are started by someone who may move stock, counted by technicians without an ERP role, and approved only in Inventory', async () => {
    const { owner, supervisor, tech, requester, co } = await team('Yankee');
    const { wh, bin, product: filter } = await store(owner, co);
    const belt = await owner.json('POST', erp(co, '/products'), { name: 'Drive belt', type: 'consumable', standardCostCents: 4200 });
    await owner.json('POST', erp(co, '/adjustments'), { productId: belt.id, locationId: bin.id, quantity: 2, unitCostCents: 4200, reason: 'Opening stock' });
    const other = await owner.json('POST', erp(co, '/warehouses'), { code: `WH${Math.floor(Math.random() * 1e6)}`, name: 'Main warehouse' });
    const shelf = await owner.json('POST', erp(co, '/locations'), { warehouseId: other.id, code: 'S1', name: 'Shelf 1' });
    await owner.json('POST', erp(co, '/adjustments'), { productId: belt.id, locationId: shelf.id, quantity: 1, unitCostCents: 4200, reason: 'Opening stock' });
    const st = mt(co, '/stocktakes');

    // Starting one needs the ERP right to move stock; a maintenance role alone gives none.
    const techStart = await tech.req('POST', st, { warehouseId: wh.id });
    expect(techStart.status).toBe(403);
    expect((await errorOf(techStart)).details).toMatchObject({ code: 'ERP_RIGHT_NEEDED', capability: 'inventory.operate' });
    expect((await supervisor.req('POST', st, { warehouseId: wh.id })).status).toBe(403);
    expect((await requester.req('GET', st)).status).toBe(403);
    expect((await tech.json('GET', st)).can).toEqual({ start: false, approveInInventory: false });
    await erpRole(owner, co, supervisor, 'warehouse_operator');
    expect((await supervisor.json('GET', st)).can).toEqual({ start: true, approveInInventory: false });
    const notStore = await supervisor.req('POST', st, { warehouseId: other.id });
    expect(notStore.status).toBe(400);
    expect((await errorOf(notStore)).error).toBe(`${other.code} is not a maintenance store. An administrator marks maintenance stores in Maintenance settings.`);
    const started = await supervisor.req('POST', st, { warehouseId: wh.id, dueDate: day(7) });
    expect(started.status).toBe(201);
    const count = (await started.json()) as any;
    expect(count).toMatchObject({ number: expect.stringMatching(/^CNT-\d{5}$/), lines: 2 });
    const twice = await supervisor.req('POST', st, { warehouseId: wh.id });
    expect(twice.status).toBe(409);
    expect((await errorOf(twice)).error).toContain('still open');
    const empty = await owner.json('POST', erp(co, '/warehouses'), { code: `EM${Math.floor(Math.random() * 1e6)}`, name: 'Empty store' });
    await owner.json('PUT', mt(co, `/stores/${empty.id}`), { store: true });
    const nothing = await supervisor.req('POST', st, { warehouseId: empty.id });
    expect(nothing.status).toBe(400);
    expect((await errorOf(nothing)).error).toBe(`There is no stock in ${empty.code} to count. A part found on the shelves is added to a count in Inventory.`);
    const list = await tech.json('GET', st);
    expect(list.stocktakes).toEqual([expect.objectContaining({ id: count.id, number: count.number, status: 'open', statusLabel: 'Counting', dueDate: day(7), overdue: false, lines: 2, counted: 0, store: expect.objectContaining({ id: wh.id, code: wh.code }) })]);
    expect(list.stores.map((s: any) => s.id).sort()).toEqual([wh.id, empty.id].sort());
    expect((await env.DB.prepare('SELECT due_date FROM erp_counts WHERE company_id = ? AND id = ?').bind(co, count.id).first<any>())!.due_date).toBe(day(7));
    expect((await owner.json('GET', erp(co, `/counts/${count.id}`))).count.dueDate).toBe(day(7));
    const opened = await env.DB.prepare("SELECT actor_id FROM erp_events WHERE company_id = ? AND action = 'count.opened' AND entity_id = ?").bind(co, count.id).first<any>();
    expect(opened!.actor_id).toBe(supervisor.userId);
    // A count Inventory opens for another warehouse is Inventory's alone.
    const inv = await owner.json('POST', erp(co, '/counts'), { warehouseId: other.id });
    expect((await tech.json('GET', `${st}?status=all`)).stocktakes.map((s: any) => s.id)).toEqual([count.id]);
    expect((await tech.req('GET', `${st}/${inv.id}`)).status).toBe(404);

    // Counting on a phone.
    let detail = await tech.json('GET', `${st}/${count.id}`);
    expect(detail.lines).toHaveLength(2);
    expect(detail.can).toMatchObject({ count: true, submit: false, cancel: false, approveInInventory: false });
    const filterLine = detail.lines.find((l: any) => l.productId === filter.id);
    const beltLine = detail.lines.find((l: any) => l.productId === belt.id);
    expect(await tech.json('PUT', `${st}/${count.id}/counted`, { lines: [{ id: filterLine.id, counted: 9 }] })).toEqual({ ok: true, counted: 1, lines: 2 });
    detail = await tech.json('GET', `${st}/${count.id}`);
    expect(detail.lines.find((l: any) => l.id === filterLine.id)).toMatchObject({ expected: 10, counted: 9, variance: -1, countedByName: 'Yankee Technician' });
    const early = await supervisor.req('POST', `${st}/${count.id}/submit`, {});
    expect(early.status).toBe(409);
    expect((await errorOf(early)).error).toContain('1 of 2');
    expect((await tech.req('POST', `${st}/${count.id}/submit`, {})).status).toBe(403);
    await tech.json('PUT', `${st}/${count.id}/counted`, { lines: [{ id: beltLine.id, counted: 2 }] });
    expect((await supervisor.json('GET', `${st}/${count.id}`)).can).toMatchObject({ submit: true, cancel: true });
    expect((await supervisor.req('POST', `${st}/${count.id}/submit`, {})).status).toBe(200);
    detail = await tech.json('GET', `${st}/${count.id}`);
    expect(detail.stocktake).toMatchObject({ status: 'submitted', statusLabel: 'Waiting for approval in Inventory' });
    expect((await tech.req('PUT', `${st}/${count.id}/counted`, { lines: [{ id: beltLine.id, counted: 3 }] })).status).toBe(409);
    // Approval and posting are Inventory's alone, by someone who did not submit it.
    expect((await tech.req('POST', `${st}/${count.id}/approve`, {})).status).toBe(404);
    expect((await supervisor.req('POST', erp(co, `/counts/${count.id}/approve`), {})).status).toBe(403);
    expect((await owner.json('GET', `${st}/${count.id}`)).can.approveInInventory).toBe(true);
    expect(await owner.json('POST', erp(co, `/counts/${count.id}/approve`), {})).toMatchObject({ ok: true, variances: 1 });
    expect(await onHand(owner, co, filter.id)).toBe(9);
    expect((await tech.json('GET', st)).stocktakes).toEqual([]);
    expect((await tech.json('GET', `${st}?status=posted`)).stocktakes).toEqual([expect.objectContaining({ id: count.id, status: 'posted', statusLabel: 'Posted' })]);
    // The only ERP role given in this company is the supervisor's.
    const grants = await env.DB.prepare('SELECT user_id, role FROM erp_role_grants WHERE company_id = ?').bind(co).all<any>();
    expect(grants.results).toEqual([{ user_id: supervisor.userId, role: 'warehouse_operator' }]);
  });

  it('sort by due date or number, show overdue ones, cancel with a reason, and stay inside the company', async () => {
    const { owner, supervisor, tech, co } = await team('Zulu');
    await erpRole(owner, co, supervisor, 'warehouse_operator');
    const st = mt(co, '/stocktakes');
    const made: any[] = [];
    for (const due of [3, 10, -1]) {
      const { wh } = await store(owner, co, { name: `Part due ${due}`, qty: 1, cost: 100 });
      made.push({ ...(await supervisor.json('POST', st, { warehouseId: wh.id, dueDate: day(due) })), due: day(due) });
    }
    const dues = async (q: string) => (await tech.json('GET', `${st}?${q}`)).stocktakes.map((s: any) => s.dueDate);
    expect(await dues('sort=due_asc')).toEqual([day(-1), day(3), day(10)]);
    expect(await dues('sort=due_desc')).toEqual([day(10), day(3), day(-1)]);
    expect((await tech.json('GET', `${st}?sort=number_asc`)).stocktakes.map((s: any) => s.number)).toEqual(made.map((m) => m.number));
    const list = (await tech.json('GET', st)).stocktakes;
    expect(list.filter((s: any) => s.overdue).map((s: any) => s.id)).toEqual([made[2].id]);
    // Cancelling needs a reason; a submitted one is cancelled in Inventory.
    expect((await supervisor.req('POST', `${st}/${made[2].id}/cancel`, {})).status).toBe(400);
    expect((await supervisor.req('POST', `${st}/${made[2].id}/cancel`, { reason: 'Store moved' })).status).toBe(200);
    expect((await tech.json('GET', `${st}/${made[2].id}`)).stocktake.status).toBe('cancelled');
    const lines = (await tech.json('GET', `${st}/${made[1].id}`)).lines;
    await tech.json('PUT', `${st}/${made[1].id}/counted`, { lines: lines.map((l: any) => ({ id: l.id, counted: l.expected })) });
    await supervisor.json('POST', `${st}/${made[1].id}/submit`, {});
    const late = await supervisor.req('POST', `${st}/${made[1].id}/cancel`, { reason: 'Changed my mind' });
    expect(late.status).toBe(409);
    expect((await errorOf(late)).error).toBe(`${made[1].number} is waiting for approval: a warehouse manager cancels it in Inventory`);
    // Another company's people see nothing of it.
    const stranger = await signup('Zulu Stranger');
    await registerCompany(stranger, 'Zulu Other Works');
    expect((await stranger.req('GET', `${st}/${made[0].id}`)).status).toBe(404);
    // Warehouse: stock switched off.
    await switchOff('inventory', co);
    const off = await tech.req('GET', st);
    expect(off.status).toBe(403);
    expect((await errorOf(off)).details).toMatchObject({ code: 'MODULE_DISABLED', module: 'inventory' });
    await switchOn('inventory', co);
  });
});

describe('preventive maintenance parts with products', () => {
  it('names products on schedules, carries them to the work orders made, and keeps an archived product as text', async () => {
    const { owner, supervisor, tech, co } = await team('Mike');
    const { product } = await store(owner, co);
    const asset = await supervisor.json('POST', mt(co, '/assets'), { name: 'Hydraulic press' });
    const def = { assetId: asset.id, name: 'Daily filter check', triggerKind: 'time', intervalN: 1, intervalUnit: 'day', startDate: today(), assignedTo: tech.userId };
    const pm = await supervisor.json('POST', mt(co, `/pm/schedules?today=${today()}`), { ...def, parts: [{ part: 'Hydraulic filter', quantity: 2, productId: product.id }, { part: 'Rags', quantity: 1 }] });
    expect(pm.parts).toEqual([{ part: 'Hydraulic filter', quantity: 2, productId: product.id, productNumber: product.number }, { part: 'Rags', quantity: 1 }]);
    const twice = await supervisor.req('POST', mt(co, '/pm/schedules'), { ...def, parts: [{ productId: product.id, quantity: 1 }, { productId: product.id, quantity: 1 }] });
    expect(twice.status).toBe(400);
    const stranger = await signup('Mike Stranger');
    const co2 = await registerCompany(stranger, 'Mike Other Works');
    const foreign = await stranger.json('POST', erp(co2, '/products'), { name: 'Foreign part', type: 'consumable' });
    expect((await supervisor.req('POST', mt(co, '/pm/schedules'), { ...def, parts: [{ productId: foreign.id, quantity: 1 }] })).status).toBe(400);
    const gen = await supervisor.json('POST', mt(co, '/pm/generate'), { today: today() });
    const woId = gen.made.find((m: any) => m.scheduleId === pm.id).workOrderId;
    const view = await tech.json('GET', mt(co, `/work-orders/${woId}`));
    expect(view.requiredParts.lines.map((l: any) => l.productId)).toEqual([product.id, null]);
    await tech.json('POST', mt(co, `/work-orders/${woId}/complete`), { notes: 'Checked' });
    await env.DB.prepare('UPDATE erp_products SET archived_at = ? WHERE company_id = ? AND id = ?').bind(Date.now(), co, product.id).run();
    const next = await supervisor.json('POST', mt(co, '/pm/generate'), { today: day(1) });
    const nextId = next.made.find((m: any) => m.scheduleId === pm.id).workOrderId;
    const nextView = await tech.json('GET', mt(co, `/work-orders/${nextId}`));
    expect(nextView.requiredParts.lines[0]).toMatchObject({ productId: null, part: 'Hydraulic filter', quantity: 2, status: 'not_stocked' });
  });
});

describe('returning parts tracked by lot', () => {
  it('needs the lot it came from, and puts it back there', async () => {
    const { owner, co } = await solo('Lima Lot');
    const { bin, product } = await store(owner, co, { name: 'Seal kit', qty: 0, cost: 900 });
    await owner.json('PUT', erp(co, `/products/${product.id}/stock-settings`), { trackLots: true });
    await owner.json('POST', erp(co, '/adjustments'), { productId: product.id, locationId: bin.id, lot: 'L1', quantity: 3, unitCostCents: 900, reason: 'Opening stock' });
    const { w } = await workOrder(owner, co);
    expect((await owner.req('POST', mt(co, `/work-orders/${w.id}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, lot: 'L1', quantity: 1 }] })).status).toBe(201);
    expect((await owner.req('POST', mt(co, `/work-orders/${w.id}/stock/return`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 1 }] })).status).toBe(400);
    expect((await owner.req('POST', mt(co, `/work-orders/${w.id}/stock/return`), { lines: [{ productId: product.id, locationId: bin.id, lot: 'L1', quantity: 1 }] })).status).toBe(201);
    const lot = await env.DB.prepare("SELECT on_hand FROM erp_stock WHERE company_id = ? AND product_id = ? AND lot = 'L1'").bind(co, product.id).first<{ on_hand: number }>();
    expect(lot!.on_hand).toBe(3);
  });
});

describe('the example company', () => {
  it('keeps its figures, and its owner reserves and orders parts for a work order', async () => {
    const a = await signup('Example Parts');
    const built = (await a.json('POST', '/api/system/demo', {})) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const overview = await a.json('GET', mt(co, '/overview'));
    expect(overview.assets).toBe(7);
    expect(overview.openWorkOrders).toBe(2);
    const bolt = await env.DB.prepare("SELECT id, number FROM erp_products WHERE company_id = ? AND name = 'Hex bolt M8 x 30'").bind(co).first<{ id: string; number: string }>();
    const spares = await env.DB.prepare("SELECT id FROM erp_locations WHERE company_id = ? AND code = 'MNT'").bind(co).first<{ id: string }>();
    const chiller = await env.DB.prepare('SELECT work_order_id FROM mt_wo_stock WHERE company_id = ? AND product_id = ?').bind(co, bolt!.id).first<{ work_order_id: string }>();
    const open = await env.DB.prepare("SELECT id FROM mt_work_orders WHERE company_id = ? AND status IN ('open','assigned','in_progress','on_hold') AND id <> ? ORDER BY created_at LIMIT 1").bind(co, chiller!.work_order_id).first<{ id: string }>();
    const adj = await a.json('POST', erp(co, '/adjustments'), { productId: bolt!.id, locationId: spares!.id, quantity: 2, unitCostCents: 18, reason: 'More spare bolts' });
    expect(adj.status).toBe('posted');
    const line = await a.json('POST', mt(co, `/work-orders/${open!.id}/parts`), { productId: bolt!.id, quantity: 6 });
    const r = await a.json('POST', mt(co, `/work-orders/${open!.id}/parts/${line.id}/reserve`), {});
    expect(r).toMatchObject({ short: 4, reserved: [expect.objectContaining({ quantity: 2, locationId: spares!.id })] });
    const req = await a.req('POST', mt(co, `/work-orders/${open!.id}/requisition`), { lines: [{ partId: line.id, quantity: 4 }] });
    expect(req.status).toBe(201);
    const view = await a.json('GET', mt(co, `/work-orders/${open!.id}`));
    expect(view.requiredParts.lines[0]).toMatchObject({ productNumber: bolt!.number, reserved: 2, shortfall: 4, onRequisition: 4, status: 'on_requisition' });
  });

  // Needs system/example.ts to carry this stream's hunk (the chiller work order's bolt line, and mt_wo_reservations and
  // mt_wo_requisitions at the head of removeExample's stages M2 and M3 list): the integration commit adds it and drops
  // the skip.
  it('lists the chiller work order’s bolts as a required part, and is removed with its reservations and requisitions', async () => {
    const a = await signup('Example Parts Removed');
    const built = (await a.json('POST', '/api/system/demo', {})) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const withProduct = await env.DB.prepare('SELECT work_order_id, quantity FROM mt_wo_parts WHERE company_id = ? AND product_id IS NOT NULL').bind(co).all<any>();
    expect(withProduct.results).toEqual([expect.objectContaining({ quantity: 4 })]);
    const bolt = await env.DB.prepare("SELECT id, number FROM erp_products WHERE company_id = ? AND name = 'Hex bolt M8 x 30'").bind(co).first<{ id: string; number: string }>();
    const chillerId = withProduct.results[0].work_order_id;
    let view = await a.json('GET', mt(co, `/work-orders/${chillerId}`));
    expect(view.requiredParts.lines).toEqual(expect.arrayContaining([expect.objectContaining({ productNumber: bolt!.number, quantity: 4, issued: 4, outstanding: 0, reserved: 0, status: 'issued' })]));
    const overview = await a.json('GET', mt(co, '/overview'));
    expect(overview.assets).toBe(7);
    expect(overview.openWorkOrders).toBe(2);
    const spares = await env.DB.prepare("SELECT id FROM erp_locations WHERE company_id = ? AND code = 'MNT'").bind(co).first<{ id: string }>();
    await a.json('POST', erp(co, '/adjustments'), { productId: bolt!.id, locationId: spares!.id, quantity: 2, unitCostCents: 18, reason: 'More spare bolts' });
    const line = view.requiredParts.lines.find((l: any) => l.productId === bolt!.id);
    await a.json('PATCH', mt(co, `/work-orders/${chillerId}/parts/${line.id}`), { quantity: 6 });
    expect((await a.req('POST', mt(co, `/work-orders/${chillerId}/parts/${line.id}/reserve`), {})).status).toBe(201);
    expect((await a.req('POST', mt(co, `/work-orders/${chillerId}/requisition`), { lines: [{ partId: line.id, quantity: 2 }] })).status).toBe(201);
    view = await a.json('GET', mt(co, `/work-orders/${chillerId}`));
    expect(view.requiredParts.lines.find((l: any) => l.id === line.id)).toMatchObject({ reserved: 2 });
    expect((await a.req('POST', '/api/system/demo/remove', {})).status).toBe(200);
    const left = await env.DB.prepare(
      'SELECT (SELECT COUNT(*) FROM mt_wo_reservations WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_wo_requisitions WHERE company_id = ?1) + (SELECT COUNT(*) FROM erp_reservations WHERE company_id = ?1) + (SELECT COUNT(*) FROM erp_requisitions WHERE company_id = ?1) AS n',
    )
      .bind(co)
      .first<{ n: number }>();
    expect(left!.n).toBe(0);
  });
});

// The review of the field release: races that must fail cleanly, never leave stuck state. A D1 batch commits every
// statement it holds, so each side's own transaction checks the other. The losing order is reproduced with a trigger:
// the competing change lands inside the transaction it races, after the reads that transaction made first.
async function withTrigger(name: string, sql: string, fn: () => Promise<void>) {
  await env.DB.prepare(sql).run();
  try {
    await fn();
  } finally {
    await env.DB.prepare(`DROP TRIGGER IF EXISTS ${name}`).run();
  }
}

describe('a reservation and a completion or cancel at the same moment', () => {
  it('refuses the completion or cancel that missed a reservation made after it read them, and nothing is left stuck', async () => {
    const { owner, supervisor, tech, co } = await team('Race Res');
    const { product } = await store(owner, co);
    for (const how of ['complete', 'cancel'] as const) {
      const { w } = await workOrder(supervisor, co, { assignedTo: tech.userId });
      const line = await tech.json('POST', mt(co, `/work-orders/${w.id}/parts`), { productId: product.id, quantity: 2 });
      const rid = (await tech.json('POST', mt(co, `/work-orders/${w.id}/parts/${line.id}/reserve`), {})).reserved[0].reservationId as string;
      const link = (await env.DB.prepare('SELECT id FROM mt_wo_reservations WHERE company_id = ? AND reservation_id = ?').bind(co, rid).first<{ id: string }>())!;
      // The completion (or cancel) reads no reservation; the reservation's link is committed just before its transaction.
      await env.DB.prepare('DELETE FROM mt_wo_reservations WHERE company_id = ? AND id = ?').bind(co, link.id).run();
      const status = how === 'complete' ? 'completed' : 'cancelled';
      const trig = `t_race_res_${how}`;
      await withTrigger(
        trig,
        `CREATE TRIGGER ${trig} AFTER UPDATE OF status ON mt_work_orders WHEN NEW.id = '${w.id}' AND NEW.status = '${status}'
         BEGIN INSERT INTO mt_wo_reservations (id, company_id, reservation_id, work_order_id, part_id, created_by, created_at) VALUES ('${link.id}', '${co}', '${rid}', '${w.id}', '${line.id}', NULL, 1); END`,
        async () => {
          const res = how === 'complete' ? await tech.req('POST', mt(co, `/work-orders/${w.id}/complete`), { notes: 'Done' }) : await supervisor.req('POST', mt(co, `/work-orders/${w.id}/cancel`), { reason: 'Not needed' });
          expect(res.status).toBe(409);
          expect((await errorOf(res)).error).toBe(`${w.number} changed at the same moment: refresh and try again`);
        },
      );
      // Nothing of it was kept: the work order is open, the reservation open and still Maintenance's to release.
      expect((await env.DB.prepare('SELECT status FROM mt_work_orders WHERE company_id = ? AND id = ?').bind(co, w.id).first<any>())!.status).toBe('assigned');
      const lines = await env.DB.prepare("SELECT COUNT(*) AS n FROM mt_events WHERE company_id = ? AND work_order_id = ? AND action IN ('work_order.completed','work_order.cancelled')").bind(co, w.id).first<{ n: number }>();
      expect(lines!.n).toBe(0);
      expect(await reservation(co, rid)).toMatchObject({ released_qty: 0, status: 'open' });
      // Tried again, it sees the reservation and releases it.
      await env.DB.prepare('INSERT INTO mt_wo_reservations (id, company_id, reservation_id, work_order_id, part_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, NULL, 1)').bind(link.id, co, rid, w.id, line.id).run();
      const again = how === 'complete' ? await tech.req('POST', mt(co, `/work-orders/${w.id}/complete`), { notes: 'Done' }) : await supervisor.req('POST', mt(co, `/work-orders/${w.id}/cancel`), { reason: 'Not needed' });
      expect(again.status).toBe(200);
      expect(await reservation(co, rid)).toMatchObject({ released_qty: 2, status: 'released' });
    }
    expect((await stockRow(co, product.id))!.reserved).toBe(0);
  });

  it('refuses a reservation or an issue on a work order completed or cancelled after it was read', async () => {
    const { owner, supervisor, tech, co } = await team('Race Late');
    const { bin, product } = await store(owner, co);
    const { w } = await workOrder(supervisor, co, { assignedTo: tech.userId });
    const line = await tech.json('POST', mt(co, `/work-orders/${w.id}/parts`), { productId: product.id, quantity: 2 });
    // The completion commits after the reserve read the work order and before its transaction.
    await withTrigger(
      't_race_late_reserve',
      `CREATE TRIGGER t_race_late_reserve AFTER INSERT ON mt_wo_reservations WHEN NEW.work_order_id = '${w.id}'
       BEGIN UPDATE mt_work_orders SET status = 'completed' WHERE company_id = '${co}' AND id = '${w.id}'; END`,
      async () => {
        const res = await tech.req('POST', mt(co, `/work-orders/${w.id}/parts/${line.id}/reserve`), {});
        expect(res.status).toBe(409);
        expect((await errorOf(res)).error).toBe(`${w.number} was completed or cancelled at the same moment: nothing was reserved. Refresh to see it.`);
      },
    );
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_reservations WHERE company_id = ?').bind(co).first<{ n: number }>())!.n).toBe(0);
    expect(await stockRow(co, product.id)).toEqual({ on_hand: 10, reserved: 0 });
    await withTrigger(
      't_race_late_issue',
      `CREATE TRIGGER t_race_late_issue AFTER INSERT ON mt_wo_stock WHEN NEW.work_order_id = '${w.id}'
       BEGIN UPDATE mt_work_orders SET status = 'cancelled' WHERE company_id = '${co}' AND id = '${w.id}'; END`,
      async () => {
        const res = await tech.req('POST', mt(co, `/work-orders/${w.id}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 1 }] });
        expect(res.status).toBe(409);
        expect((await errorOf(res)).error).toBe(`${w.number} was completed or cancelled at the same moment: nothing was issued. Refresh to see it.`);
      },
    );
    expect(await stockRow(co, product.id)).toEqual({ on_hand: 10, reserved: 0 });
    // Without a race both work as before.
    expect((await tech.req('POST', mt(co, `/work-orders/${w.id}/parts/${line.id}/reserve`), {})).status).toBe(201);
  });
});

describe('the review of the field release: requisitions and stocktakes', () => {
  it('raises a requisition from a work order whose department was archived since, without that department', async () => {
    const { owner, supervisor, tech, co } = await team('Dept Gone');
    await store(owner, co);
    await erpRole(owner, co, tech, 'warehouse_operator');
    const dept = (await owner.json('POST', `/api/company/c/${co}/departments`, { name: 'Workshop' })).id as string;
    const asset = await supervisor.json('POST', mt(co, '/assets'), { name: 'Press' });
    const w = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: asset.id, description: 'Change the seal', assignedTo: tech.userId, departmentId: dept });
    const part = (await tech.json('POST', mt(co, `/work-orders/${w.id}/parts`), { part: 'Seal kit', quantity: 1 })).id;
    expect((await owner.req('POST', `/api/company/c/${co}/departments/${dept}/archive`, {})).status).toBe(200);
    // What the form sent before the fix (the archived id), and the default (nothing sent): both work, with no department.
    for (const sent of [{ departmentId: dept }, {}]) {
      const res = await tech.req('POST', mt(co, `/work-orders/${w.id}/requisition`), { lines: [{ partId: part, quantity: 1 }], ...sent });
      expect(res.status).toBe(201);
      const id = ((await res.json()) as any).id;
      expect((await env.DB.prepare('SELECT department_id FROM erp_requisitions WHERE company_id = ? AND id = ?').bind(co, id).first<any>())!.department_id).toBeNull();
    }
    // A department in use is kept.
    const live = (await owner.json('POST', `/api/company/c/${co}/departments`, { name: 'Stores' })).id as string;
    const kept = await tech.json('POST', mt(co, `/work-orders/${w.id}/requisition`), { lines: [{ partId: part, quantity: 1 }], departmentId: live });
    expect((await env.DB.prepare('SELECT department_id FROM erp_requisitions WHERE company_id = ? AND id = ?').bind(co, kept.id).first<any>())!.department_id).toBe(live);
  });

  it('refuses a count other than 0 or 1 on a serial line, with a clear message, and keeps the line uncounted', async () => {
    const { owner, supervisor, tech, co } = await team('Serial Count');
    const { wh, bin, product } = await store(owner, co, { name: 'Pump motor', qty: 0, cost: 50_000 });
    await owner.json('PUT', erp(co, `/products/${product.id}/stock-settings`), { trackSerials: true });
    await owner.json('POST', erp(co, '/adjustments'), { productId: product.id, locationId: bin.id, serial: 'SN-77', quantity: 1, unitCostCents: 50_000, reason: 'Opening stock' });
    await erpRole(owner, co, supervisor, 'warehouse_operator');
    const count = await supervisor.json('POST', mt(co, '/stocktakes'), { warehouseId: wh.id });
    const st = mt(co, `/stocktakes/${count.id}`);
    const line = (await tech.json('GET', st)).lines[0];
    expect(line.serial).toBe('SN-77');
    for (const counted of [2, 0.5]) {
      const res = await tech.req('PUT', `${st}/counted`, { lines: [{ id: line.id, counted }] });
      expect(res.status).toBe(400);
      expect(await errorOf(res)).toMatchObject({ error: 'Serial SN-77 is one item: count it as 0 or 1', details: { code: 'SERIAL_COUNT' } });
    }
    expect((await tech.json('GET', st)).lines[0].counted).toBeNull();
    expect(await tech.json('PUT', `${st}/counted`, { lines: [{ id: line.id, counted: 1 }] })).toMatchObject({ ok: true, counted: 1 });
  });

  it('says on the screens what the stocktake kind and the requisition department do, and stops a serial count above 1', () => {
    // src/client/system/maintenance: no DOM here, so their source is checked.
    expect(stocktakesSrc).toContain('<option value="stocktake">Stocktake</option>');
    expect(stocktakesSrc).toContain('<option value="cycle">Cycle count</option>');
    expect(stocktakesSrc).not.toMatch(/every part in the store|one part of the store/);
    expect(stocktakesSrc).toContain('This decides what is counted: the whole store, or one location and everything in it.');
    expect(stocktakesSrc).toContain("if (line.serial && counted !== null && counted !== 0 && counted !== 1) {");
    expect(extrasSrc).toContain("departmentId: woDeptActive ? wo.departmentId! : ''");
    expect(extrasSrc).toContain('is no longer in use, so the requisition has no department');
  });

  it('writes no history line in Maintenance or Inventory for a submit or cancel that lost a race', async () => {
    const { owner, supervisor, tech, co } = await team('Count Race');
    const { wh } = await store(owner, co);
    await erpRole(owner, co, supervisor, 'warehouse_operator');
    const lines = async (countId: string) => {
      const mtLines = await env.DB.prepare("SELECT action FROM mt_events WHERE company_id = ? AND action IN ('stocktake.submitted','stocktake.cancelled') AND after_json LIKE ?").bind(co, `%${countId}%`).all<{ action: string }>();
      const erpLines = await env.DB.prepare("SELECT action FROM erp_events WHERE company_id = ? AND entity_id = ? AND action IN ('count.submitted','count.cancelled')").bind(co, countId).all<{ action: string }>();
      return [...mtLines.results.map((r) => r.action), ...erpLines.results.map((r) => r.action)].sort();
    };
    const count = await supervisor.json('POST', mt(co, '/stocktakes'), { warehouseId: wh.id });
    const st = mt(co, `/stocktakes/${count.id}`);
    const all = (await tech.json('GET', st)).lines;
    await tech.json('PUT', `${st}/counted`, { lines: all.map((l: any) => ({ id: l.id, counted: l.expected })) });
    // Both read the count while it was open; the first submit wins, the second (on the same stale state) changes nothing.
    const n = await loadCount(env.DB, co, count.id);
    const extra = (what: string) => (done: CountClosed) => [eventIfStmt(env.DB, { companyId: co, actorId: supervisor.userId, action: what, summary: `Stocktake ${n.number} ${what}`, after: { countId: n.id }, at: done.t }, done.sql, done.args)];
    expect((await closeCount(env.DB, { companyId: co, userId: supervisor.userId }, n, 'submit', extra('stocktake.submitted'))).changed).toBe(true);
    expect((await closeCount(env.DB, { companyId: co, userId: owner.userId }, n, 'submit', extra('stocktake.submitted'))).changed).toBe(false);
    // A cancel that read it open too loses as well.
    expect((await closeCount(env.DB, { companyId: co, userId: owner.userId }, n, 'cancel', extra('stocktake.cancelled'))).changed).toBe(false);
    expect(await lines(count.id)).toEqual(['count.submitted', 'stocktake.submitted']);
    // Through the route, a lost submit answers 409 and adds nothing either.
    const second = await supervisor.req('POST', `${st}/submit`, {});
    expect(second.status).toBe(409);
    expect(await lines(count.id)).toEqual(['count.submitted', 'stocktake.submitted']);
  });
});
