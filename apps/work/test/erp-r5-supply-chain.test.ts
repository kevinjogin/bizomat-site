// BIZOMAT ERP, Release 5 part A (src/worker/erp/sales.ts, logistics.ts, returns.ts, supply-reports.ts): supply chain and
// logistics. The owner's Scenario G (complete a customer order, manufacture or allocate stock, dispatch, make the Finance
// invoice) runs end to end: a sales order for the company's one customer record, stock allocated (soonest expiry first),
// a line made to order through a linked manufacturing order with its job profitability, a pick list, packages, a double
// dispatch made once, delivery confirmed with a proof of delivery, the draft invoice made once, a return received into
// quarantine with its draft credit note, traceability from the supplier to the delivery, and the reports with exact
// numbers. The rest checks each rule: isolation between companies and the roles, a concurrent dispatch of the last unit,
// a failed invoice integration retried, MRP with sales order demand, and the example company.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';

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
  return data as { company: { id: string }; tools: { tasks: string; crm: string; finance: string } };
}

async function joinCompany(owner: Client, companyId: string, invitee: Client, crmRole: string | null, finRole: string | null) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole, finRole });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5, 6, 7, 8]);
type Who = 'sales' | 'sales2' | 'storeman' | 'picker' | 'pm' | 'op' | 'engineer' | 'approver' | 'buyer' | 'manager' | 'viewer';

/** A registered company with the roles Release 5 uses (the first sales manager may see the CRM and invoice in Finance). */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company, tools } = await registerCompany(owner, `${label} Works`);
  const co = company.id;
  const people = {} as Record<Who, Client>;
  for (const [key, role, crmRole, finRole] of [
    ['sales', 'sales_manager', 'manager', 'finance_manager'],
    ['sales2', 'sales_manager', null, null],
    ['storeman', 'warehouse_manager', null, null],
    ['picker', 'warehouse_operator', null, null],
    ['pm', 'production_manager', null, null],
    ['op', 'production_operator', null, null],
    ['engineer', 'engineer', null, null],
    ['approver', 'engineering_approver', null, null],
    ['buyer', 'buyer', null, null],
    ['manager', 'procurement_manager', null, null],
    ['viewer', null, null, null],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p, crmRole, finRole);
    if (role) await owner.json('PUT', erp(co, `/roles/${p.userId}`), { roles: [role] });
    people[key] = p;
  }
  await owner.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000, costingMethod: 'weighted_average' });
  // the company's Finance business workspace is registered for GST, so orders and invoices carry it
  await owner.json('PATCH', `/api/fin/orgs/${tools.finance}`, { gstRegistered: true });
  return { owner, co, tools, ...people };
}

async function warehouse(c: Client, co: string) {
  const wh = await c.json('POST', erp(co, '/warehouses'), { code: 'MAIN', name: 'Main store' });
  const loc = (b: Record<string, unknown>) => c.json('POST', erp(co, '/locations'), { warehouseId: wh.id, ...b });
  const store = await loc({ code: 'S', name: 'Store', level: 'store' });
  return {
    wh,
    bin1: await loc({ code: 'B1', parentId: store.id }),
    bin2: await loc({ code: 'B2', parentId: store.id }),
    fg: await loc({ code: 'FG', level: 'zone', kind: 'finished_goods', parentId: store.id }),
    quar: await loc({ code: 'QUAR', level: 'zone', kind: 'quarantine', parentId: store.id }),
  };
}

const totals = async (c: Client, co: string, productId: string) => (await c.json('GET', erp(co, `/products/${productId}/stock`))).totals as { onHand: number; reserved: number; available: number; quarantine: number; valueCents: number };

/** A CRM company with a contact, linked to its Finance customer (the company's one customer record). */
async function customer(owner: Client, tools: { crm: string }, name: string) {
  const crmCo = await owner.json('POST', `/api/crm/orgs/${tools.crm}/companies`, { name, email: `accounts@${name.toLowerCase().replace(/\W+/g, '')}.example.com` });
  const contact = await owner.json('POST', `/api/crm/orgs/${tools.crm}/contacts`, { firstName: 'Dana', lastName: 'Webb', email: 'dana@harbour.example.com', companyId: crmCo.id });
  const link = await owner.json('POST', `/api/company/links/crm/${tools.crm}/companies/${crmCo.id}/customer`, {});
  return { crmCo, contact, finContactId: link.contactId as string };
}

describe('Scenario G: customer order, manufacture or allocate stock, dispatch, Finance invoice', () => {
  it('runs a sales order from the customer record to a delivered shipment, its draft invoice and a return', async () => {
    const t = await team('Delta');
    const { owner, co, tools, sales, sales2, storeman, picker, pm, op, engineer, approver, buyer, manager, viewer } = t;
    const { bin1, bin2, fg, quar } = await warehouse(storeman, co);
    const cust = await customer(owner, tools, 'Harbour Builders');

    // Products: a lot-tracked shelf with expiry from stock; a bracket made to order from a lot-tracked steel plate.
    const shelf = await engineer.json('POST', erp(co, '/products'), { name: 'Wall shelf', type: 'finished_product', priceCents: 12_000, sku: 'SHELF-1' });
    const bracket = await engineer.json('POST', erp(co, '/products'), { name: 'Heavy bracket', type: 'manufactured_part', priceCents: 30_000 });
    const plate = await engineer.json('POST', erp(co, '/products'), { name: 'Steel plate', type: 'raw_material', standardCostCents: 1000 });
    await storeman.json('PUT', erp(co, `/products/${shelf.id}/stock-settings`), { trackLots: true, trackExpiry: true });
    await storeman.json('PUT', erp(co, `/products/${plate.id}/stock-settings`), { trackLots: true });
    await storeman.json('POST', erp(co, '/adjustments'), { productId: shelf.id, locationId: bin1.id, lot: 'L1', expiry: '2027-06-01', quantity: 4, unitCostCents: 5000, reason: 'Opening stock' });
    await storeman.json('POST', erp(co, '/adjustments'), { productId: shelf.id, locationId: bin2.id, lot: 'L2', expiry: '2027-03-01', quantity: 6, unitCostCents: 5000, reason: 'Opening stock' });
    // The plate comes from an approved supplier on a purchase order, received in lot HEAT-77 (for the trace).
    const steel = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Delta Steel' });
    await manager.json('POST', erp(co, `/suppliers/${steel.id}/status`), { status: 'approved' });
    const po = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: steel.id, lines: [{ productId: plate.id, quantity: 20, unitPriceCents: 1000 }] });
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    const poLine = (await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`))).lines[0];
    await storeman.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: poLine.id, received: 20, locationId: bin1.id, lot: 'HEAT-77' }] });
    // The bracket's bill of materials (two plates) and routing (12 minutes a bracket at 60.00 an hour).
    const rev = (await engineer.json('GET', erp(co, `/products/${bracket.id}`))).revisions[0];
    await engineer.json('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId: plate.id, quantity: 2 });
    const eco = await engineer.json('POST', erp(co, '/change-orders'), { title: 'Bracket release', reason: 'Ready', productIds: [bracket.id] });
    await engineer.json('POST', erp(co, `/change-orders/${eco.id}/submit`), {});
    await approver.json('POST', erp(co, `/change-orders/${eco.id}/approve`), { note: 'Checked' });
    await approver.json('POST', erp(co, `/change-orders/${eco.id}/release`), {});
    const fab = await pm.json('POST', erp(co, '/work-centres'), { code: 'FAB', name: 'Fabrication', labourRateCents: 6000 });
    const routing = await pm.json('POST', erp(co, '/routings'), { productId: bracket.id });
    await pm.json('POST', erp(co, `/routings/${routing.id}/operations`), { opNo: 10, name: 'Cut and weld', workCentreId: fab.id, runMinutes: 12, crew: 1 });
    await approver.json('POST', erp(co, `/routings/${routing.id}/release`), { note: 'Released' });

    // 1. The sales order, for the CRM company and the Finance customer it is billed as. Only sales managers make one.
    const opts = await sales.json('GET', erp(co, '/sales-order-options'));
    expect(opts.linkKind).toBe('link');
    expect(opts.crm[0].companies.find((x: any) => x.id === cust.crmCo.id)).toMatchObject({ name: 'Harbour Builders', finContactId: cust.finContactId });
    const order = {
      crmCompanyId: cust.crmCo.id,
      crmContactId: cust.contact.id,
      requestedDate: day(10),
      promisedDate: day(12),
      customerPo: 'PO-7781',
      shippingTerms: 'Delivered at place',
      deliveryAddress: '5 Harbour Road, Sydney NSW 2000',
      lines: [
        { productId: shelf.id, quantity: 8, discountBp: 1000, taxCode: 'GST' },
        { productId: bracket.id, quantity: 5, taxCode: 'GST', fulfil: 'make' },
      ],
    };
    for (const who of [viewer, storeman, pm]) expect((await who.req('POST', erp(co, '/sales-orders'), order)).status).toBe(403);
    // sales2 has no CRM role: it cannot choose a CRM customer
    expect((await sales2.req('POST', erp(co, '/sales-orders'), order)).status).toBe(403);
    // one customer record: the CRM company's own Finance customer only
    const other = await owner.json('POST', `/api/fin/orgs/${tools.finance}/contacts`, { name: 'Somebody Else', kind: 'customer' });
    expect((await sales.req('POST', erp(co, '/sales-orders'), { ...order, finContactId: other.id })).status).toBe(400);
    const so = await sales.json('POST', erp(co, '/sales-orders'), order);
    expect(so.number).toBe('SO-00001');
    let v = await viewer.json('GET', erp(co, `/sales-orders/${so.id}`));
    // 8 x 120.00 less 10% = 864.00; 5 x 300.00 = 1,500.00; GST 10%.
    expect(v.order).toMatchObject({ status: 'draft', customerName: 'Harbour Builders', contactName: 'Dana Webb', crmCompanyId: cust.crmCo.id, finContactId: cust.finContactId, subtotalCents: 236_400, taxCents: 23_640, totalCents: 260_040, customerPo: 'PO-7781' });
    expect(v.lines.map((l: any) => [l.productNumber, l.quantity, l.netCents, l.taxCents, l.fulfil])).toEqual([[shelf.number, 8, 86_400, 8640, 'stock'], [bracket.number, 5, 150_000, 15_000, 'make']]);
    // nothing about the customer is copied: no new CRM company or Finance contact
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_contacts WHERE org_id = ?').bind(tools.finance).first<any>()).n).toBe(2);
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/allocate`), {})).status).toBe(409); // a draft
    expect((await sales2.req('POST', erp(co, `/sales-orders/${so.id}/confirm`), {})).status).toBe(200);
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/confirm`), {})).status).toBe(409);

    // 2. Allocate: soonest expiry first (L2, then L1); the bracket is not in stock.
    expect((await viewer.req('POST', erp(co, `/sales-orders/${so.id}/allocate`), {})).status).toBe(403);
    const alloc = await storeman.json('POST', erp(co, `/sales-orders/${so.id}/allocate`), { requestKey: 'delta-alloc-0001' });
    expect(alloc.allocated.map((x: any) => [x.productNumber, x.allocated, x.short])).toEqual([[shelf.number, 8, 0], [bracket.number, 0, 5]]);
    // asked again: nothing more is allocated (the shelf line is allocated in full, the bracket is not in stock)
    expect((await storeman.json('POST', erp(co, `/sales-orders/${so.id}/allocate`), { requestKey: 'delta-alloc-0001' })).allocated.every((x: any) => x.allocated === 0)).toBe(true);
    v = await viewer.json('GET', erp(co, `/sales-orders/${so.id}`));
    expect(v.order.status).toBe('partially_allocated');
    expect(v.lines[0].allocations.map((x: any) => [x.location, x.lot, x.quantity])).toEqual([['MAIN/B2', 'L2', 6], ['MAIN/B1', 'L1', 2]]);
    expect(await totals(viewer, co, shelf.id)).toMatchObject({ onHand: 10, reserved: 8, available: 2 });
    // Inventory's reservation screen does not release stock allocated to an order
    const res = (await storeman.json('GET', erp(co, '/reservations'))).reservations.find((r: any) => r.reference.startsWith('SO-00001'));
    expect((await storeman.req('POST', erp(co, `/reservations/${res.id}/release`), {})).status).toBe(409);

    // 3. Make to order: a manufacturing order from the bracket line, linked both ways (production managers only).
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/lines/${v.lines[1].id}/make`), {})).status).toBe(403);
    const mo = await pm.json('POST', erp(co, `/sales-orders/${so.id}/lines/${v.lines[1].id}/make`), { startDate: day(0), requestKey: 'delta-make-0001' });
    expect((await pm.req('POST', erp(co, `/sales-orders/${so.id}/lines/${v.lines[1].id}/make`), { requestKey: 'delta-make-0001' })).status).toBe(409);
    let mv = await viewer.json('GET', erp(co, `/mos/${mo.id}`));
    expect(mv.order).toMatchObject({ number: 'MO-00001', method: 'make_to_order', quantity: 5, customerRef: 'SO-00001 Harbour Builders', requiredDate: day(12) });
    expect(mv.salesOrders).toEqual([{ id: so.id, number: 'SO-00001', customerName: 'Harbour Builders', status: 'partially_allocated', linePosition: 2, quantity: 5 }]);
    v = await viewer.json('GET', erp(co, `/sales-orders/${so.id}`));
    expect(v.lines[1].manufacturingOrders).toMatchObject([{ number: 'MO-00001', quantity: 5 }]);
    expect(v.lines[1].shortQty).toBe(0);
    // run it: release, issue ten plates of HEAT-77, an hour of labour, five good, finished goods received, closed
    await pm.json('POST', erp(co, `/mos/${mo.id}/release`), { reserve: true });
    mv = await viewer.json('GET', erp(co, `/mos/${mo.id}`));
    await picker.json('POST', erp(co, `/mos/${mo.id}/issue`), { lines: [{ materialId: mv.materials[0].id, locationId: bin1.id, lot: 'HEAT-77', quantity: 10 }] });
    const op10 = mv.operations[0];
    await op.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/start`), {});
    await op.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/time`), { kind: 'labour', minutes: 60 });
    await op.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/report`), { kind: 'good', quantity: 5 });
    await op.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/complete`), {});
    await picker.json('POST', erp(co, `/mos/${mo.id}/receive`), { quantity: 5, locationId: fg.id });
    await pm.json('POST', erp(co, `/mos/${mo.id}/complete`), {});
    await pm.json('POST', erp(co, `/mos/${mo.id}/close`), {});
    // Job profitability: revenue 1,500.00 (the line before tax) less actual cost 160.00 (100.00 plates + 60.00 labour).
    const costs = await viewer.json('GET', erp(co, `/mos/${mo.id}/costs`));
    expect(costs.profitability).toMatchObject({ linked: true, revenueCents: 150_000, costCents: 16_000, marginCents: 134_000, marginPct: 89.3 });
    expect(costs.profitability.lines).toEqual([{ salesOrderId: so.id, salesOrderNumber: 'SO-00001', customerName: 'Harbour Builders', linePosition: 2, quantity: 5, revenueCents: 150_000 }]);
    // the finished brackets are allocated to the line
    await sales.json('POST', erp(co, `/sales-orders/${so.id}/allocate`), {});
    v = await viewer.json('GET', erp(co, `/sales-orders/${so.id}`));
    expect(v.order.status).toBe('allocated');
    expect(v.lines[1]).toMatchObject({ allocatedQty: 5, toAllocateQty: 0 });

    // 4. A carrier, and the shipment of everything allocated with its pick list (by location).
    expect((await picker.req('POST', erp(co, '/carriers'), { code: 'FF', name: 'Fast Freight' })).status).toBe(403);
    expect((await sales.req('POST', erp(co, '/carriers'), { code: 'FF', name: 'Fast Freight', trackingUrl: 'http://track.example.com/{tracking}' })).status).toBe(400);
    const carrier = await sales.json('POST', erp(co, '/carriers'), { code: 'FF', name: 'Fast Freight', services: ['Road', 'Express'], trackingUrl: 'https://track.example.com/?n={tracking}' });
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/shipments`), { carrierId: carrier.id, service: 'Rail' })).status).toBe(400);
    expect((await picker.req('POST', erp(co, `/sales-orders/${so.id}/shipments`), {})).status).toBe(403);
    const shp = await sales.json('POST', erp(co, `/sales-orders/${so.id}/shipments`), { carrierId: carrier.id, service: 'Road', freightCostCents: 4500, freightChargeCents: 6000, plannedDate: day(1), windowStart: day(1), windowEnd: day(2), notify: true, requestKey: 'delta-ship-0001' });
    expect(shp.number).toBe('SHP-00001');
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/shipments`), {})).status).toBe(409); // nothing left to ship
    let sv = await viewer.json('GET', erp(co, `/shipments/${shp.id}`));
    expect(sv.shipment).toMatchObject({ status: 'planned', carrierName: 'Fast Freight', service: 'Road', freightCostCents: 4500, freightChargeCents: 6000, shipTo: '5 Harbour Road, Sydney NSW 2000' });
    expect(sv.picks.map((k: any) => [k.location, k.productNumber, k.lot, k.suggestedQty])).toEqual([['MAIN/B1', shelf.number, 'L1', 2], ['MAIN/B2', shelf.number, 'L2', 6], ['MAIN/FG', bracket.number, '', 5]]);
    expect(sv.notifyNote).toMatch(/not set up/);
    // proof of delivery waits for the dispatch
    const pod = (who: Client) => {
      const fd = new FormData();
      fd.set('file', new File([PNG], 'signature.png', { type: 'image/png' }));
      fd.set('kind', 'delivery');
      fd.set('id', shp.id);
      return who.req('POST', erp(co, '/record-files'), fd);
    };
    expect((await pod(picker)).status).toBe(409);

    // 5. Pick (the warehouse), pack with packages, contents and weights; dispatch twice at the same moment: once.
    expect((await sales.req('POST', erp(co, `/shipments/${shp.id}/pick`), { lines: [{ pickLineId: sv.picks[0].id, pickedQty: 2 }] })).status).toBe(403);
    expect((await picker.req('POST', erp(co, `/shipments/${shp.id}/pick`), { lines: [{ pickLineId: sv.picks[0].id, pickedQty: 3 }] })).status).toBe(400);
    expect((await picker.json('POST', erp(co, `/shipments/${shp.id}/pick`), { lines: [{ pickLineId: sv.picks[0].id, pickedQty: 2 }] })).status).toBe('picking');
    expect((await picker.req('POST', erp(co, `/shipments/${shp.id}/packages`), { kind: 'box', weightKg: 1 })).status).toBe(409);
    expect((await picker.json('POST', erp(co, `/shipments/${shp.id}/pick`), { lines: sv.picks.slice(1).map((k: any) => ({ pickLineId: k.id, pickedQty: k.suggestedQty })) })).status).toBe('picked');
    expect((await picker.req('POST', erp(co, `/shipments/${shp.id}/packed`), {})).status).toBe(409); // no package yet
    const shelfLine = sv.lines.find((l: any) => l.productId === shelf.id);
    const bracketLine = sv.lines.find((l: any) => l.productId === bracket.id);
    expect((await picker.req('POST', erp(co, `/shipments/${shp.id}/packages`), { kind: 'box', contents: [{ soLineId: shelfLine.soLineId, quantity: 9 }] })).status).toBe(400);
    await picker.json('POST', erp(co, `/shipments/${shp.id}/packages`), { kind: 'box', weightKg: 12.5, lengthCm: 60, widthCm: 40, heightCm: 30, contents: [{ soLineId: shelfLine.soLineId, quantity: 8 }] });
    await picker.json('POST', erp(co, `/shipments/${shp.id}/packages`), { kind: 'carton', weightKg: 8, contents: [{ soLineId: bracketLine.soLineId, quantity: 5 }] });
    await picker.json('POST', erp(co, `/shipments/${shp.id}/packed`), {});
    expect((await sales.req('POST', erp(co, `/shipments/${shp.id}/dispatch`), {})).status).toBe(403);
    const before = (await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_journals').first<{ n: number }>())!.n;
    const both = await Promise.all([picker.req('POST', erp(co, `/shipments/${shp.id}/dispatch`), { trackingNumber: 'FF123456', requestKey: 'delta-dispatch-1' }), picker.req('POST', erp(co, `/shipments/${shp.id}/dispatch`), { trackingNumber: 'FF123456', requestKey: 'delta-dispatch-2' })]);
    expect(both.map((r) => r.status).sort()).toEqual([200, 201]);
    const moves = await env.DB.prepare("SELECT COUNT(*) AS n, SUM(on_hand_delta) AS q, SUM(value_delta_cents) AS v FROM erp_stock_moves WHERE company_id = ? AND move_type = 'sales_dispatch' AND source_type = 'shipment' AND source_id = ?").bind(co, shp.id).first<any>();
    expect(moves).toMatchObject({ n: 3, q: -13, v: -(8 * 5000 + 16_000) });
    expect(await totals(viewer, co, shelf.id)).toMatchObject({ onHand: 2, reserved: 0, available: 2, valueCents: 10_000 });
    expect(await totals(viewer, co, bracket.id)).toMatchObject({ onHand: 0, reserved: 0 });
    sv = await viewer.json('GET', erp(co, `/shipments/${shp.id}`));
    expect(sv.shipment).toMatchObject({ status: 'dispatched', trackingNumber: 'FF123456', trackingUrl: 'https://track.example.com/?n=FF123456', packages: 2, weightKg: 20.5, notifyStatus: 'not_configured' });
    expect(sv.lines.map((l: any) => l.shippedQty)).toEqual([8, 5]);
    // the dispatch email was asked for, but email is not set up in tests: nothing is queued, and the shipment says so
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM email_outbox WHERE template = 'erp_dispatch'").first<any>()).n).toBe(0);
    // stock value is recorded as a planned Finance posting; nothing is posted
    expect(sv.integration.filter((e: any) => e.kind === 'finance.inventory_posting').every((e: any) => e.status === 'planned')).toBe(true);
    v = await viewer.json('GET', erp(co, `/sales-orders/${so.id}`));
    expect(v.order.status).toBe('shipped');
    expect(v.lines.map((l: any) => [l.shippedQty, l.allocatedQty])).toEqual([[8, 0], [5, 0]]);

    // 6. Delivery confirmed on a phone, with a signature image as proof of delivery.
    expect((await viewer.req('POST', erp(co, `/shipments/${shp.id}/deliver`), { receivedBy: 'Dana Webb' })).status).toBe(403);
    expect((await picker.req('POST', erp(co, `/shipments/${shp.id}/deliver`), {})).status).toBe(400);
    expect((await pod(picker)).status).toBe(201);
    expect((await picker.json('POST', erp(co, `/shipments/${shp.id}/deliver`), { receivedBy: 'Dana Webb', note: 'Left at reception' })).status).toBe('delivered');
    sv = await viewer.json('GET', erp(co, `/shipments/${shp.id}`));
    expect(sv.shipment).toMatchObject({ status: 'delivered', receivedBy: 'Dana Webb', deliveryNote: 'Left at reception' });
    expect(sv.proofOfDelivery).toMatchObject([{ name: 'signature.png', isImage: true }]);

    // 7. The draft invoice in Finance: once, for the customer record, with the freight charge as a line.
    expect((await sales2.req('POST', erp(co, `/shipments/${shp.id}/invoice`))).status).toBe(403); // no Finance role
    expect((await picker.req('POST', erp(co, `/shipments/${shp.id}/invoice`))).status).toBe(403);
    const two = await Promise.all([sales.req('POST', erp(co, `/shipments/${shp.id}/invoice`)), sales.req('POST', erp(co, `/shipments/${shp.id}/invoice`))]);
    expect(two.some((r) => r.status === 201)).toBe(true);
    expect(two.every((r) => [200, 201, 409].includes(r.status))).toBe(true);
    const inv = await sales.json('POST', erp(co, `/shipments/${shp.id}/invoice`));
    expect(inv.existing).toBe(true);
    const docs = await env.DB.prepare("SELECT id, status, contact_id, subtotal, tax_total, total, reference FROM fin_docs WHERE org_id = ? AND kind = 'invoice' AND reference = ?").bind(tools.finance, 'SHP-00001 SO-00001').all<any>();
    expect(docs.results).toHaveLength(1);
    // 864.00 + 1,500.00 + freight 60.00 = 2,424.00 before GST; GST 242.40
    expect(docs.results[0]).toMatchObject({ id: inv.invoiceId, status: 'draft', contact_id: cust.finContactId, subtotal: 242_400, tax_total: 24_240, total: 266_640 });
    const lines = await env.DB.prepare('SELECT description, quantity_milli, unit_price, discount_bp, net FROM fin_doc_lines WHERE doc_id = ? ORDER BY line_no').bind(inv.invoiceId).all<any>();
    expect(lines.results.map((l: any) => [l.quantity_milli, l.unit_price, l.discount_bp, l.net])).toEqual([[8000, 12_000, 1000, 86_400], [5000, 30_000, 0, 150_000], [1000, 6000, 0, 6000]]);
    expect(lines.results[2].description).toMatch(/^Freight: Fast Freight Road/);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_journals').first<{ n: number }>())!.n).toBe(before);
    expect((await viewer.json('GET', erp(co, `/sales-orders/${so.id}`))).order.status).toBe('invoiced');

    // 8. A return: raised, authorised by a sales manager, received into quarantine, its draft credit note made once.
    expect((await sales.req('POST', erp(co, '/rmas'), { soId: so.id, reason: 'damaged', lines: [{ soLineId: v.lines[0].id, quantity: 9 }] })).status).toBe(400);
    expect((await viewer.req('POST', erp(co, '/rmas'), { soId: so.id, reason: 'damaged', lines: [{ soLineId: v.lines[0].id, quantity: 1 }] })).status).toBe(403);
    const rma = await sales.json('POST', erp(co, '/rmas'), { soId: so.id, shipmentId: shp.id, reason: 'damaged', details: 'One shelf bent in transit', lines: [{ soLineId: v.lines[0].id, quantity: 1 }] });
    expect(rma.number).toBe('RMA-00001');
    const rl = (await viewer.json('GET', erp(co, `/rmas/${rma.id}`))).lines[0];
    expect((await picker.req('POST', erp(co, `/rmas/${rma.id}/receive`), { lines: [{ lineId: rl.id, quantity: 1, locationId: quar.id, lot: 'L2' }] })).status).toBe(409); // not authorised
    expect((await picker.req('POST', erp(co, `/rmas/${rma.id}/authorise`), {})).status).toBe(403);
    await sales2.json('POST', erp(co, `/rmas/${rma.id}/authorise`), { note: 'Photo checked' });
    expect((await sales.req('POST', erp(co, `/rmas/${rma.id}/credit-note`))).status).toBe(409); // not received
    expect((await picker.req('POST', erp(co, `/rmas/${rma.id}/receive`), { lines: [{ lineId: rl.id, quantity: 2, locationId: quar.id, lot: 'L2' }] })).status).toBe(400);
    await picker.json('POST', erp(co, `/rmas/${rma.id}/receive`), { lines: [{ lineId: rl.id, quantity: 1, locationId: quar.id, lot: 'L2' }], requestKey: 'delta-rma-0001' });
    expect(await picker.json('POST', erp(co, `/rmas/${rma.id}/receive`), { lines: [{ lineId: rl.id, quantity: 1, locationId: quar.id, lot: 'L2' }] })).toMatchObject({ existing: true });
    expect(await totals(viewer, co, shelf.id)).toMatchObject({ onHand: 2, quarantine: 1, valueCents: 15_000 });
    const back = await env.DB.prepare("SELECT on_hand_delta, unit_cost_cents, value_delta_cents, source_type FROM erp_stock_moves WHERE company_id = ? AND move_type = 'customer_return'").bind(co).first<any>();
    expect(back).toMatchObject({ on_hand_delta: 1, unit_cost_cents: 5000, value_delta_cents: 5000, source_type: 'rma' });
    expect((await viewer.json('GET', erp(co, `/sales-orders/${so.id}`))).lines[0].returnedQty).toBe(1);
    // a nonconformance of the company can be linked; another company's id cannot
    const credit = await sales.json('POST', erp(co, `/rmas/${rma.id}/credit-note`));
    expect(await sales.json('POST', erp(co, `/rmas/${rma.id}/credit-note`))).toMatchObject({ existing: true, creditNoteId: credit.creditNoteId });
    const cn = await env.DB.prepare('SELECT status, contact_id, invoice_id, subtotal, tax_total, total, reference FROM fin_credit_notes WHERE id = ?').bind(credit.creditNoteId).first<any>();
    // one shelf at 120.00 less 10% = 108.00 plus GST 10.80; the invoice is a draft, so the credit stands on its own
    expect(cn).toMatchObject({ status: 'draft', contact_id: cust.finContactId, invoice_id: null, subtotal: 10_800, tax_total: 1080, total: 11_880, reference: 'RMA-00001 SO-00001' });
    await sales.json('POST', erp(co, `/rmas/${rma.id}/close`), {});
    expect((await viewer.json('GET', erp(co, `/rmas/${rma.id}`))).rma).toMatchObject({ status: 'closed', reasonLabel: 'Damaged in transit', creditStatus: 'done' });

    // 9. Traceability: the steel's lot from the supplier and order, into the manufacturing order, to the delivery.
    const trace = await viewer.json('GET', erp(co, `/trace?productId=${plate.id}&lot=HEAT-77`));
    expect(trace.origins).toMatchObject([{ supplierName: 'Delta Steel' }]);
    expect(trace.downstream).toMatchObject([{ moNumber: 'MO-00001', productNumber: bracket.number, shipments: [{ number: 'SHP-00001', salesOrderNumber: 'SO-00001', customerName: 'Harbour Builders', receivedBy: 'Dana Webb' }] }]);
    const shelfTrace = await viewer.json('GET', erp(co, `/trace?productId=${shelf.id}&lot=L2`));
    expect(shelfTrace.deliveries).toMatchObject([{ number: 'SHP-00001', customerName: 'Harbour Builders', carrierName: 'Fast Freight', trackingNumber: 'FF123456' }]);

    // 10. Reports from the same records, with exact numbers.
    const salesRep = await viewer.json('GET', erp(co, '/reports/sales'));
    expect(salesRep.byProduct.map((x: any) => [x.number, x.quantity, x.valueCents])).toEqual([[bracket.number, 5, 150_000], [shelf.number, 8, 86_400]]);
    expect(salesRep.byCustomer).toEqual([{ customerName: 'Harbour Builders', quantity: 13, valueCents: 236_400, orders: 1 }]);
    const freight = await viewer.json('GET', erp(co, '/reports/freight'));
    expect(freight.totals).toEqual({ shipments: 1, costCents: 4500, chargeCents: 6000, differenceCents: 1500, recoveryPct: 133.3, underCharged: 0 });
    const byCarrier = await viewer.json('GET', erp(co, '/reports/shipments-by-carrier'));
    expect(byCarrier.carriers).toMatchObject([{ carrierCode: 'FF', shipments: 1, packages: 2, weightKg: 20.5, delivered: 1, freightCostCents: 4500, freightChargeCents: 6000 }]);
    const ret = await viewer.json('GET', erp(co, '/reports/returns'));
    expect(ret.totals).toEqual({ returns: 1, shippedUnits: 13, returnedUnits: 1, ratePct: 7.7 });
    expect(ret.byReason).toEqual([{ reason: 'damaged', label: 'Damaged in transit', returns: 1, units: 1 }]);
    expect(ret.byProduct.find((p: any) => p.productId === shelf.id)).toMatchObject({ shipped: 8, returned: 1, ratePct: 12.5 });
    const otif = await viewer.json('GET', erp(co, '/reports/customer-delivery'));
    expect(otif.totals).toMatchObject({ orders: 1, onTime: 1, inFull: 1, otif: 1, otifPct: 100 });
    const open = await viewer.json('GET', erp(co, '/reports/open-orders'));
    expect(open.totals).toMatchObject({ orders: 0, openValueCents: 0 });
    const jp = await viewer.json('GET', erp(co, '/reports/job-profitability'));
    expect(jp.rows).toMatchObject([{ number: 'MO-00001', final: true, revenueCents: 150_000, costCents: 16_000, marginCents: 134_000, marginPct: 89.3, salesOrderNumber: 'SO-00001' }]);
    for (const [path, header] of [
      ['/reports/sales?format=csv', 'Product,Name,Orders,Quantity,Unit,Value before tax'],
      ['/reports/sales?by=customer&format=csv', 'Customer,Orders,Units,Value before tax'],
      ['/reports/freight?format=csv', 'Shipment,Sales order,Customer,Carrier,Dispatched,Freight cost,Freight charge,Charge less cost'],
      ['/reports/shipments-by-carrier?format=csv', 'Carrier,Name,Shipments,Packages,Weight (kg),Delivered,Average transit (days),Freight cost,Freight charge'],
      ['/reports/returns?format=csv', 'Return,Sales order,Customer,Status,Reason,Quantity,Received,Raised,Received on'],
      ['/reports/customer-delivery?format=csv', 'Order,Customer,Status,Due,First dispatch,Completed,Shipments,Ordered,Shipped,On time,In full,On time and in full'],
      ['/reports/open-orders?format=csv', 'Order,Customer,Status,Line,Product,Name,Ordered,Shipped,Allocated,Open,Unit,Open value,Due,Late'],
      ['/reports/job-profitability?format=csv', 'Order,Status,Product,Name,Quantity,Completed,Sales order,Line,Customer,Revenue,Actual cost,Margin,Margin %'],
      ['/sales-orders?format=csv', 'Number,Customer,Contact,Status,Order date,Requested,Promised,Customer PO,Currency,Subtotal,Tax,Total,Late'],
      ['/shipments?format=csv', 'Number,Sales order,Customer,Status,Carrier,Service,Tracking number,Planned,Window from,Window to,Packages,Weight (kg),Freight cost,Freight charge,Dispatched,Delivered,Received by'],
      ['/rmas?format=csv', 'Number,Sales order,Shipment,Customer,Status,Reason,Details,Raised,Received,Credit note'],
      ['/delivery-schedule?format=csv', 'Planned,Window from,Window to,Shipment,Sales order,Customer,Status,Carrier,Tracking number,Late'],
    ] as const) {
      const res = await viewer.req('GET', erp(co, path));
      expect(res.status, path).toBe(200);
      expect((await res.text()).split('\n')[0].replace(/^\uFEFF/, '').trim(), path).toBe(header);
    }
    // the hub and the Operations page count what waits
    const ops = await viewer.json('GET', erp(co, '/operations'));
    expect(ops.supplyChain).toMatchObject({ ordersOpen: 0, toInvoice: 0, inTransit: 0, returnsToAuthorise: 0 });
    // the history of each record
    expect((await viewer.json('GET', erp(co, `/sales-orders/${so.id}`))).history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['so.created', 'so.confirmed', 'so.allocated', 'so.made_to_order', 'so.shipment_planned', 'so.dispatched', 'so.delivered', 'so.invoice_drafted', 'so.return_raised', 'so.return_received']));
    expect(sv.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['shipment.planned', 'shipment.picked', 'shipment.package_added', 'shipment.packed', 'shipment.dispatched', 'shipment.notified', 'shipment.delivered']));
  });
});

describe('isolation, roles and amendments', () => {
  it('keeps each company’s supply chain to itself and checks every role on the server', async () => {
    const t = await team('Echo');
    const { owner, co, tools, sales, storeman, picker, viewer, engineer } = t;
    const other = await signup('Echo Outsider');
    const { company: theirs } = await registerCompany(other, 'Outsider Works');
    const { bin1 } = await warehouse(storeman, co);
    const cust = await customer(owner, tools, 'Echo Customer');
    const p = await engineer.json('POST', erp(co, '/products'), { name: 'Echo widget', type: 'finished_product', priceCents: 1000 });
    await storeman.json('POST', erp(co, '/adjustments'), { productId: p.id, locationId: bin1.id, quantity: 5, unitCostCents: 400, reason: 'Opening stock' });
    const so = await sales.json('POST', erp(co, '/sales-orders'), { crmCompanyId: cust.crmCo.id, lines: [{ productId: p.id, quantity: 3 }], confirm: true });
    const carrier = await sales.json('POST', erp(co, '/carriers'), { code: 'EC', name: 'Echo Couriers' });
    await sales.json('POST', erp(co, `/sales-orders/${so.id}/allocate`), {});
    const shp = await storeman.json('POST', erp(co, `/sales-orders/${so.id}/shipments`), { carrierId: carrier.id });
    const rmaBad = await sales.req('POST', erp(co, '/rmas'), { soId: so.id, reason: 'damaged', lines: [{ soLineId: (await sales.json('GET', erp(co, `/sales-orders/${so.id}`))).lines[0].id, quantity: 1 }] });
    expect(rmaBad.status).toBe(400); // nothing shipped yet
    // another company's people get 404 for every record and route; their own company cannot name these records
    for (const path of [`/sales-orders/${so.id}`, '/sales-orders', `/shipments/${shp.id}`, '/shipments', '/carriers', '/rmas', '/delivery-schedule', '/supply-chain/overview', '/reports/sales', '/sales-order-options']) {
      expect((await other.req('GET', erp(co, path))).status, path).toBe(404);
    }
    expect((await other.req('GET', erp(theirs.id, `/sales-orders/${so.id}`))).status).toBe(404);
    expect((await other.req('GET', erp(theirs.id, `/shipments/${shp.id}`))).status).toBe(404);
    expect((await other.req('POST', erp(theirs.id, `/sales-orders/${so.id}/allocate`), {})).status).toBe(404);
    expect((await other.req('POST', erp(theirs.id, `/shipments/${shp.id}/dispatch`), {})).status).toBe(404);
    expect((await other.req('POST', erp(theirs.id, '/sales-orders'), { crmCompanyId: cust.crmCo.id, lines: [{ productId: p.id, quantity: 1 }] })).status).toBe(400);
    // capabilities per role
    const me = async (c: Client) => (await c.json('GET', erp(co, '/me'))).can;
    expect(await me(sales)).toMatchObject({ 'sales.view': true, 'sales.edit': true, 'sales.confirm': true, 'sales.allocate': true, 'shipping.plan': true, 'shipping.pick': false, 'shipping.dispatch': false, 'shipping.deliver': true, 'carriers.setup': true, 'returns.authorise': true, 'returns.receive': false });
    expect(await me(picker)).toMatchObject({ 'sales.edit': false, 'sales.allocate': true, 'shipping.plan': false, 'shipping.pick': true, 'shipping.pack': true, 'shipping.dispatch': true, 'returns.authorise': false, 'returns.receive': true });
    expect(await me(storeman)).toMatchObject({ 'shipping.plan': true, 'carriers.setup': true, 'returns.raise': true, 'returns.authorise': false });
    expect(await me(viewer)).toMatchObject({ 'sales.view': true, 'sales.edit': false, 'shipping.pick': false, 'returns.raise': false });
    const roles = await owner.json('GET', erp(co, '/roles'));
    expect(roles.roles.find((r: any) => r.value === 'sales_manager')).toMatchObject({ label: 'Sales manager' });
    // amend a confirmed order with a reason: the version before is kept; never below what is allocated
    const line = (await sales.json('GET', erp(co, `/sales-orders/${so.id}`))).lines[0];
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/amend`), { reason: 'Customer asked for fewer', lines: [{ id: line.id, productId: p.id, quantity: 2, unitPriceCents: 1000 }] })).status).toBe(400);
    expect((await viewer.req('POST', erp(co, `/sales-orders/${so.id}/amend`), { reason: 'x', lines: [{ id: line.id, productId: p.id, quantity: 4 }] })).status).toBe(403);
    await sales.json('POST', erp(co, `/sales-orders/${so.id}/amend`), { reason: 'Customer asked for one more', promisedDate: day(5), lines: [{ id: line.id, productId: p.id, quantity: 4, unitPriceCents: 1000 }] });
    const after = await sales.json('GET', erp(co, `/sales-orders/${so.id}`));
    expect(after.order).toMatchObject({ revision: 2, status: 'partially_allocated', subtotalCents: 4000, promisedDate: day(5) });
    expect(after.revisions).toMatchObject([{ revision: 1, reason: 'Customer asked for one more' }]);
    expect(after.revisions[0].snapshot.lines[0]).toMatchObject({ quantity: 3, netCents: 3000 });
    // cancelling refuses while a shipment is open; the shipment cancelled, the order is cancelled and its stock released
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/cancel`), {})).status).toBe(409);
    await storeman.json('POST', erp(co, `/shipments/${shp.id}/cancel`), { reason: 'Customer will collect' });
    await sales.json('POST', erp(co, `/sales-orders/${so.id}/cancel`), { reason: 'Order withdrawn' });
    expect(await totals(viewer, co, p.id)).toMatchObject({ onHand: 5, reserved: 0 });
    // draft orders are not demand; the cancelled one is not either
    expect((await sales.req('POST', erp(co, `/sales-orders/${so.id}/allocate`), {})).status).toBe(409);
  });
});

describe('concurrency and failure', () => {
  it('lets one of two dispatches of the last unit through and retries a failed invoice integration', async () => {
    const t = await team('Foxtrot');
    const { owner, co, tools, sales, storeman, picker, engineer } = t;
    const { bin1 } = await warehouse(storeman, co);
    const cust = await customer(owner, tools, 'Foxtrot Customer');
    const p = await engineer.json('POST', erp(co, '/products'), { name: 'Last unit', type: 'finished_product', priceCents: 5000 });
    await storeman.json('POST', erp(co, '/adjustments'), { productId: p.id, locationId: bin1.id, quantity: 1, unitCostCents: 2000, reason: 'Opening stock' });
    const so = await sales.json('POST', erp(co, '/sales-orders'), { crmCompanyId: cust.crmCo.id, lines: [{ productId: p.id, quantity: 1 }], confirm: true });
    await sales.json('POST', erp(co, `/sales-orders/${so.id}/allocate`), {});
    const a = await sales.json('POST', erp(co, `/sales-orders/${so.id}/shipments`), {});
    // A second shipment of the same last unit, as two people planning at the same moment would leave it (the shipment
    // screen refuses a second one once the first is planned): its rows copied from the first.
    const b = 'test-shipment-b';
    await env.DB.batch([
      env.DB.prepare("INSERT INTO erp_shipments (id, company_id, number, so_id, status, created_at, updated_at) VALUES (?, ?, 'SHP-09999', ?, 'planned', ?, ?)").bind(b, co, so.id, Date.now(), Date.now()),
      env.DB.prepare("INSERT INTO erp_shipment_lines (id, company_id, shipment_id, so_line_id, product_id, quantity) SELECT 'test-sl-b', company_id, ?, so_line_id, product_id, quantity FROM erp_shipment_lines WHERE company_id = ? AND shipment_id = ?").bind(b, co, a.id),
      env.DB.prepare("INSERT INTO erp_pick_lines (id, company_id, shipment_id, shipment_line_id, position, product_id, location_id, lot, serial, reservation_id, suggested_qty) SELECT 'test-pk-b', company_id, ?, 'test-sl-b', position, product_id, location_id, lot, serial, reservation_id, suggested_qty FROM erp_pick_lines WHERE company_id = ? AND shipment_id = ?").bind(b, co, a.id),
    ]);
    for (const id of [a.id, b]) {
      const sv = await picker.json('GET', erp(co, `/shipments/${id}`));
      await picker.json('POST', erp(co, `/shipments/${id}/pick`), { lines: [{ pickLineId: sv.picks[0].id, pickedQty: 1 }] });
      await picker.json('POST', erp(co, `/shipments/${id}/packages`), { kind: 'box', weightKg: 1 });
      await picker.json('POST', erp(co, `/shipments/${id}/packed`), {});
    }
    const res = await Promise.all([picker.req('POST', erp(co, `/shipments/${a.id}/dispatch`), {}), picker.req('POST', erp(co, `/shipments/${b}/dispatch`), {})]);
    expect(res.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(await totals(picker, co, p.id)).toMatchObject({ onHand: 0, reserved: 0 });
    const line = await env.DB.prepare('SELECT shipped_qty, allocated_qty FROM erp_so_lines WHERE company_id = ? AND so_id = ?').bind(co, so.id).first<any>();
    expect(line).toEqual({ shipped_qty: 1, allocated_qty: 0 });
    // the database itself refuses shipping more than ordered
    await expect(env.DB.prepare('UPDATE erp_so_lines SET shipped_qty = 2 WHERE company_id = ? AND so_id = ?').bind(co, so.id).run()).rejects.toThrow(/CHECK/);
    const shipped = (await picker.json('GET', erp(co, '/shipments?status=dispatched'))).shipments[0];

    // A failed invoice integration: Finance refuses (the customer is not in the workspace), the failure is recorded,
    // and a retry once it is fixed makes the invoice, once.
    await env.DB.prepare("UPDATE erp_sales_orders SET fin_contact_id = 'missing-contact' WHERE id = ?").bind(so.id).run();
    expect((await sales.req('POST', erp(co, `/shipments/${shipped.id}/invoice`))).status).toBe(400);
    let sv = await sales.json('GET', erp(co, `/shipments/${shipped.id}`));
    expect(sv.invoice).toMatchObject({ status: 'failed', canCreate: true, attempts: 1 });
    expect(sv.invoice.lastError).toMatch(/contact/i);
    await env.DB.prepare('UPDATE erp_sales_orders SET fin_contact_id = ? WHERE id = ?').bind(cust.finContactId, so.id).run();
    const made = await sales.json('POST', erp(co, `/shipments/${shipped.id}/invoice`));
    sv = await sales.json('GET', erp(co, `/shipments/${shipped.id}`));
    expect(sv.invoice).toMatchObject({ status: 'done', invoiceId: made.invoiceId, attempts: 2 });
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM fin_docs WHERE org_id = ? AND kind = 'invoice'").bind(tools.finance).first<any>()).n).toBe(1);
  });
});

describe('MRP with sales order demand', () => {
  it('plans for what confirmed orders still need, with exact quantities and dates', async () => {
    const t = await team('Golf');
    const { owner, co, tools, sales, storeman, engineer, buyer, manager, pm } = t;
    const { bin1 } = await warehouse(storeman, co);
    const cust = await customer(owner, tools, 'Golf Customer');
    const w = await engineer.json('POST', erp(co, '/products'), { name: 'Bought widget', type: 'purchased_item', priceCents: 2000, standardCostCents: 800 });
    const sup = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Golf Supplies' });
    await manager.json('POST', erp(co, `/suppliers/${sup.id}/status`), { status: 'approved' });
    await buyer.json('PUT', erp(co, `/products/${w.id}/suppliers/${sup.id}`), { priceCents: 700, leadTimeDays: 7, preferred: true });
    await storeman.json('POST', erp(co, '/adjustments'), { productId: w.id, locationId: bin1.id, quantity: 6, unitCostCents: 800, reason: 'Opening stock' });
    // SO-A: 10 promised in 20 days, 6 of it allocated; SO-B: 5 requested in 30 days; a draft order is not demand.
    const soA = await sales.json('POST', erp(co, '/sales-orders'), { crmCompanyId: cust.crmCo.id, promisedDate: day(20), lines: [{ productId: w.id, quantity: 10 }], confirm: true });
    await sales.json('POST', erp(co, `/sales-orders/${soA.id}/allocate`), {});
    await sales.json('POST', erp(co, '/sales-orders'), { crmCompanyId: cust.crmCo.id, requestedDate: day(30), lines: [{ productId: w.id, quantity: 5 }], confirm: true });
    await sales.json('POST', erp(co, '/sales-orders'), { crmCompanyId: cust.crmCo.id, requestedDate: day(15), lines: [{ productId: w.id, quantity: 100 }] });
    const run = await pm.json('POST', erp(co, '/mrp/runs'), {});
    const latest = await pm.json('GET', erp(co, `/mrp/runs/${run.id}`));
    const sugs = latest.suggestions.filter((s: any) => s.productId === w.id).map((s: any) => [s.kind, s.quantity, s.needDate, s.orderDate]);
    expect(sugs).toEqual([
      ['buy', 4, day(20), day(13)],
      ['buy', 5, day(30), day(23)],
    ]);
    const line = latest.lines.find((l: any) => l.productId === w.id);
    expect(line).toMatchObject({ onHand: 6, reserved: 6, available: 0, grossRequirements: 9, plannedQty: 9 });
    expect(latest.run.inputs.salesOrders).toEqual([
      { order: 'SO-00001', line: 1, product: w.number, quantity: 4, due: day(20), customer: 'Golf Customer' },
      { order: 'SO-00002', line: 1, product: w.number, quantity: 5, due: day(30), customer: 'Golf Customer' },
    ]);
  });
});

describe('a won deal and the example company', () => {
  it('makes a draft sales order from a won CRM deal, once', async () => {
    const t = await team('Hotel');
    const { owner, co, tools, sales, engineer } = t;
    const cust = await customer(owner, tools, 'Hotel Customer');
    const p = await engineer.json('POST', erp(co, '/products'), { name: 'Deal product', type: 'finished_product', priceCents: 9000, sku: 'DEAL-1' });
    const crmProduct = await owner.json('POST', `/api/crm/orgs/${tools.crm}/products`, { name: 'Deal product', sku: 'DEAL-1', unitPrice: 8500 });
    const deal = await owner.json('POST', `/api/crm/orgs/${tools.crm}/deals`, { title: 'Fit-out', value: 170_000, companyId: cust.crmCo.id });
    await owner.json('PUT', `/api/crm/orgs/${tools.crm}/deals/${deal.id}/items`, { items: [{ productId: crmProduct.id, name: 'Deal product', quantity: 2, unitPrice: 8500 }, { name: 'Installation', quantity: 1, unitPrice: 0 }] });
    expect((await sales.req('POST', erp(co, '/sales-orders/from-deal'), { crmDealId: deal.id })).status).toBe(400); // not won
    await owner.json('POST', `/api/crm/orgs/${tools.crm}/deals/${deal.id}/close`, { outcome: 'won' });
    const made = await sales.json('POST', erp(co, '/sales-orders/from-deal'), { crmDealId: deal.id });
    const v = await sales.json('GET', erp(co, `/sales-orders/${made.id}`));
    expect(v.order).toMatchObject({ status: 'draft', crmDealId: deal.id, customerName: 'Hotel Customer', finContactId: cust.finContactId });
    expect(v.lines.map((l: any) => [l.productId, l.quantity, l.unitPriceCents])).toEqual([[p.id, 2, 8500]]);
    expect(made.unmatched).toEqual(['Installation']);
    expect(await sales.json('POST', erp(co, '/sales-orders/from-deal'), { crmDealId: deal.id })).toMatchObject({ id: made.id, existing: true });
  });

  it('gives the example company a carrier, a shipped order with its draft invoice, a made-to-order line and a return, and sends no email', async () => {
    const ex = await signup('Example seller');
    const built = (await (await ex.req('POST', '/api/system/demo', {})).json()) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    expect((await ex.json('GET', erp(co, '/carriers'))).carriers).toMatchObject([{ code: 'EXFR', services: ['Road', 'Overnight'] }]);
    const sos = (await ex.json('GET', erp(co, '/sales-orders'))).orders;
    expect(sos).toMatchObject([{ number: 'SO-00001', status: 'partially_shipped', customerName: 'Harbour Cafe' }]);
    const so = await ex.json('GET', erp(co, `/sales-orders/${sos[0].id}`));
    expect(so.lines.map((l: any) => [l.quantity, l.shippedQty, l.fulfil])).toEqual([[6, 6, 'stock'], [10, 0, 'make']]);
    expect(so.lines[1].manufacturingOrders).toMatchObject([{ number: 'MO-00002', quantity: 10 }]);
    expect(so.shipments).toMatchObject([{ number: 'SHP-00001', status: 'delivered', invoice: { status: 'done' } }]);
    expect(so.returns).toMatchObject([{ number: 'RMA-00001', status: 'received' }]);
    const shp = await ex.json('GET', erp(co, `/shipments/${so.shipments[0].id}`));
    expect(shp.shipment).toMatchObject({ notify: true, notifyStatus: 'example', trackingUrl: expect.stringMatching(/^https:\/\/track\.example\.com/) });
    expect(shp.notifyNote).toBeTruthy();
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM email_outbox WHERE user_id = ? OR template = 'erp_dispatch'").bind(ex.userId).first<any>()).n).toBe(0);
    const inv = await env.DB.prepare("SELECT d.status FROM fin_docs d JOIN sys_demo s ON s.fin_org_id = d.org_id WHERE s.user_id = ? AND d.kind = 'invoice' AND d.reference = 'SHP-00001 SO-00001'").bind(ex.userId).first<any>();
    expect(inv).toMatchObject({ status: 'draft' });
    // the earlier releases' figures hold: the bracket arms as they were
    const arms = (await ex.json('GET', erp(co, '/stock?filter=in_stock'))).rows.find((r: any) => r.name === 'Bracket arm, laser cut');
    expect(arms).toMatchObject({ onHand: 40, reserved: 10, valueCents: 15_200 });
    await ex.json('POST', '/api/system/demo/remove', {});
    for (const table of ['erp_sales_orders', 'erp_so_lines', 'erp_so_allocations', 'erp_so_mo_links', 'erp_shipments', 'erp_shipment_lines', 'erp_pick_lines', 'erp_packages', 'erp_rmas', 'erp_rma_lines', 'erp_carriers', 'erp_so_revisions']) {
      const n = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE company_id = ?`).bind(co).first<{ n: number }>();
      expect(n!.n, table).toBe(0);
    }
  });
});
