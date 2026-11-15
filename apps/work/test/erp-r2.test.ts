// BIZOMAT ERP, Release 2 (src/worker/erp): purchasing and inventory. The owner's Scenario B (procure to stock to a draft
// bill) and Scenario C (warehouse operations, counts and valuation) run end to end; the rest checks each rule the brief
// sets: approval limits and segregation of duties, purchase order amendments with their revision history, receipt
// idempotency and concurrent receipts, the draft bill made once, stock never below zero and a concurrent issue of the
// last unit, weighted average and FIFO valuation, stocktake variance and approval, traceability, isolation, roles,
// numbering, CSV, PDFs, the QR labels, BOM availability and the example company.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { qrMatrix } from '../src/worker/erp/qr';

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
  return data as { company: { id: string }; tools: { tasks?: string; crm?: string; finance?: string } };
}

async function joinCompany(owner: Client, companyId: string, invitee: Client, role: 'admin' | 'member', finRole: string | null = null) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role, tasksRole: 'member', crmRole: null, finRole });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
/** A date some days from today (YYYY-MM-DD). */
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
type Who = 'engineer' | 'buyer' | 'buyer2' | 'manager' | 'manager2' | 'storeman' | 'storeman2' | 'operator' | 'viewer';

/** A registered company with every Release 2 role: buyers, procurement managers, warehouse managers and an operator. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company, tools } = await registerCompany(owner, `${label} Manufacturing`);
  const co = company.id;
  const people = {} as Record<Who, Client>;
  for (const [key, role, finRole] of [
    ['engineer', 'engineer', null],
    ['buyer', 'buyer', 'finance_manager'],
    ['buyer2', 'buyer', null],
    ['manager', 'procurement_manager', null],
    ['manager2', 'procurement_manager', null],
    ['storeman', 'warehouse_manager', null],
    ['storeman2', 'warehouse_manager', null],
    ['operator', 'warehouse_operator', null],
    ['viewer', null, null],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p, 'member', finRole);
    if (role) await owner.json('PUT', erp(co, `/roles/${p.userId}`), { roles: [role] });
    people[key] = p;
  }
  return { owner, co, tools, ...people };
}

/** A warehouse with a store, a bin, a second bin and a quarantine location. */
async function warehouse(c: Client, co: string, code = 'MAIN') {
  const wh = await c.json('POST', erp(co, '/warehouses'), { code, name: `${code} store` });
  const store = await c.json('POST', erp(co, '/locations'), { warehouseId: wh.id, code: 'S', name: 'Store', level: 'store' });
  const bin1 = await c.json('POST', erp(co, '/locations'), { warehouseId: wh.id, parentId: store.id, code: 'B1', level: 'bin' });
  const bin2 = await c.json('POST', erp(co, '/locations'), { warehouseId: wh.id, parentId: store.id, code: 'B2', level: 'bin' });
  const quar = await c.json('POST', erp(co, '/locations'), { warehouseId: wh.id, parentId: store.id, code: 'Q', level: 'zone', kind: 'quarantine' });
  return { wh, store, bin1, bin2, quar };
}

async function product(c: Client, co: string, body: Record<string, unknown>) {
  return c.json('POST', erp(co, '/products'), { type: 'purchased_item', ...body });
}

/** Stock in through an adjustment (posted at once: the company's threshold is set high for these tests). */
async function stockIn(c: Client, co: string, productId: string, locationId: string, quantity: number, unitCostCents: number, extra: Record<string, unknown> = {}) {
  const r = await c.json('POST', erp(co, '/adjustments'), { productId, locationId, quantity, unitCostCents, reason: 'Opening stock', ...extra });
  expect(r.status).toBe('posted');
  return r;
}

async function onHand(c: Client, co: string, productId: string) {
  return (await c.json('GET', erp(co, `/products/${productId}/stock`))).totals as { onHand: number; reserved: number; available: number; onOrder: number; valueCents: number; quarantine: number };
}

async function approvedSupplier(t: { buyer: Client; manager: Client; co: string }, legalName: string, extra: Record<string, unknown> = {}) {
  const s = await t.buyer.json('POST', erp(t.co, '/suppliers'), { legalName, paymentTermsDays: 30, ...extra });
  await t.manager.json('POST', erp(t.co, `/suppliers/${s.id}/status`), { status: 'approved' });
  return s;
}

const isPdf = async (res: Response) => {
  expect(res.status).toBe(200);
  expect(res.headers.get('Content-Type')).toBe('application/pdf');
  const b = new Uint8Array(await res.arrayBuffer());
  return String.fromCharCode(...b.slice(0, 5)) === '%PDF-' && b.length > 1000;
};

describe('Scenario B: requisition, quotations, purchase order, receipts and the draft bill', () => {
  it('runs from a requisition to stock and one draft bill in Finance', async () => {
    const t = await team('Borealis');
    const { owner, co, engineer, buyer, buyer2, manager, operator, storeman, viewer, tools } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { poApprovalLimitCents: 100_000, adjustmentApprovalCents: 10_000_000 });
    const { bin1 } = await warehouse(storeman, co);
    const bolt = await product(engineer, co, { name: 'Hex bolt M10', standardCostCents: 20 });
    const plate = await product(engineer, co, { name: 'Base plate', type: 'component', standardCostCents: 900 });
    await storeman.json('PUT', erp(co, `/products/${plate.id}/stock-settings`), { trackLots: true, inspectionRequired: true, defaultLocationId: bin1.id });
    const a = await approvedSupplier(t, 'Alpha Fasteners');
    const b = await approvedSupplier(t, 'Beta Metals');
    const pending = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Pending Co' });

    // 1. A requisition, raised by an engineer and approved by a procurement manager (not the engineer, not a buyer).
    const req = await engineer.json('POST', erp(co, '/requisitions'), {
      title: 'Parts for the next build',
      requiredDate: day(20),
      budgetRef: 'Production materials',
      reason: 'Stock is low',
      lines: [
        { productId: bolt.id, quantity: 1000, estUnitCostCents: 20 },
        { productId: plate.id, quantity: 50, estUnitCostCents: 900, specification: '10 mm, galvanised' },
      ],
      submit: true,
    });
    expect(req).toMatchObject({ number: 'REQ-00001', status: 'submitted' });
    expect((await buyer.req('POST', erp(co, `/requisitions/${req.id}/approve`), {})).status).toBe(403);
    expect((await viewer.req('POST', erp(co, '/requisitions'), { lines: [{ item: 'x', quantity: 1 }] })).status).toBe(403);
    await manager.json('POST', erp(co, `/requisitions/${req.id}/approve`), { note: 'Within budget' });
    const reqView = await engineer.json('GET', erp(co, `/requisitions/${req.id}`));
    expect(reqView.requisition).toMatchObject({ status: 'approved', estimatedTotalCents: 65_000, sodException: false });

    // 2. A request for quotation from it, to approved suppliers only.
    expect((await buyer.req('POST', erp(co, '/rfqs'), { requisitionId: req.id, supplierIds: [a.id, pending.id] })).status).toBe(400);
    const rfq = await buyer.json('POST', erp(co, '/rfqs'), { requisitionId: req.id, supplierIds: [a.id, b.id], replyBy: '2026-11-20', deliveryAddress: '12 Example Street' });
    expect(rfq.number).toBe('RFQ-00001');
    expect((await engineer.json('GET', erp(co, `/requisitions/${req.id}`))).requisition.status).toBe('converted');
    expect(await isPdf(await buyer.req('GET', erp(co, `/rfqs/${rfq.id}/pdf?supplierId=${a.id}`)))).toBe(true);
    expect(await isPdf(await buyer.req('POST', erp(co, '/rfqs/preview'), { lines: [{ item: 'Washers', quantity: 10 }], replyBy: '2026-11-20' }))).toBe(true);
    let view = await buyer.json('GET', erp(co, `/rfqs/${rfq.id}`));
    expect(view.email.available).toBe(false);
    for (const s of [a, b]) await buyer.json('POST', erp(co, `/rfqs/${rfq.id}/sent`), { supplierId: s.id });
    const [boltLine, plateLine] = view.lines;
    // Alpha: cheaper, slower. Beta: dearer, faster.
    await buyer.json('PUT', erp(co, `/rfqs/${rfq.id}/quotations/${a.id}`), { reference: 'A-1', validUntil: '2099-01-01', leadTimeDays: 14, freightCents: 5000, paymentTermsDays: 30, lines: [{ rfqLineId: boltLine.id, unitPriceCents: 18 }, { rfqLineId: plateLine.id, unitPriceCents: 850 }] });
    await buyer.json('PUT', erp(co, `/rfqs/${rfq.id}/quotations/${b.id}`), { reference: 'B-9', validUntil: '2099-01-01', leadTimeDays: 4, freightCents: 0, paymentTermsDays: 14, lines: [{ rfqLineId: boltLine.id, unitPriceCents: 22 }, { rfqLineId: plateLine.id, unitPriceCents: 950 }] });
    view = await buyer.json('GET', erp(co, `/rfqs/${rfq.id}`));
    const qa = view.comparison.quotations.find((q: any) => q.supplierId === a.id);
    const qb = view.comparison.quotations.find((q: any) => q.supplierId === b.id);
    // Alpha 1000 x 18 + 50 x 850 + 5000 freight = 65,500; Beta 1000 x 22 + 50 x 950 = 69,500
    expect(qa).toMatchObject({ totalCents: 65_500, cheapest: true, fastest: false, complete: true });
    expect(qb).toMatchObject({ totalCents: 69_500, cheapest: false, fastest: true });
    expect((await buyer.req('GET', erp(co, `/rfqs/${rfq.id}?format=csv`))).headers.get('Content-Type')).toMatch(/text\/csv/);

    // 3. A buyer selects Alpha with a reason; a procurement manager approves the choice.
    expect((await buyer.req('POST', erp(co, `/rfqs/${rfq.id}/select`), { quotationId: qa.quotationId, reason: '' })).status).toBe(400);
    await buyer.json('POST', erp(co, `/rfqs/${rfq.id}/select`), { quotationId: qa.quotationId, reason: 'Cheapest, and the lead time suits the build' });
    expect((await buyer.req('POST', erp(co, `/rfqs/${rfq.id}/approve`), {})).status).toBe(403);
    await manager.json('POST', erp(co, `/rfqs/${rfq.id}/approve`), {});

    // 4. The purchase order from the approved quotation: over the limit, so a procurement manager approves it.
    const po = await buyer.json('POST', erp(co, '/purchase-orders'), { fromQuotationId: qa.quotationId });
    expect(po.number).toBe('PO-00001');
    expect((await buyer.json('GET', erp(co, `/rfqs/${rfq.id}`))).rfq.status).toBe('ordered');
    let pov = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`));
    // 18,000 + 42,500 + 5,000 freight = 65,500 net, GST 6,550, total 72,050
    expect(pov.purchaseOrder).toMatchObject({ subtotalCents: 65_500, taxCents: 6_550, totalCents: 72_050, paymentTermsDays: 30, rfqNumber: 'RFQ-00001', requisitionNumber: 'REQ-00001' });
    expect(pov.lines.map((l: any) => l.item)).toEqual(['Hex bolt M10', 'Base plate', 'Freight']);
    await owner.json('PUT', erp(co, '/erp-settings'), { poApprovalLimitCents: 50_000 });
    const sub = await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    expect(sub).toMatchObject({ status: 'awaiting_approval', rule: null });
    expect((await buyer2.req('POST', erp(co, `/purchase-orders/${po.id}/approve`), {})).status).toBe(403);
    expect((await operator.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: pov.lines[0].id, received: 1 }] })).status).toBe(409);
    await manager.json('POST', erp(co, `/purchase-orders/${po.id}/approve`), {});
    pov = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`));
    expect(pov.purchaseOrder).toMatchObject({ status: 'approved', approvalRule: 'manager', approvalLimitCents: 50_000 });
    expect(await isPdf(await buyer.req('GET', erp(co, `/purchase-orders/${po.id}/pdf`)))).toBe(true);
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/sent`), {});
    expect((await viewer.json('GET', erp(co, `/products/${bolt.id}/stock`))).totals.onOrder).toBe(1000);

    // 5. Receive part: a buyer cannot; the warehouse operator can. A double submission returns the first receipt.
    const [lb, lp, lf] = pov.lines;
    expect((await buyer.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lb.id, received: 1, locationId: bin1.id }] })).status).toBe(403);
    expect((await operator.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lp.id, received: 10, locationId: bin1.id }] })).status).toBe(400); // lot needed
    const key = crypto.randomUUID();
    const first = { requestKey: key, receivedDate: day(2), deliveryRef: 'DN-1', lines: [{ poLineId: lb.id, received: 600, locationId: bin1.id }, { poLineId: lp.id, received: 22, damaged: 2, reason: 'Bent in transit', lot: 'L-77' }, { poLineId: lf.id, received: 1 }] };
    const r1 = await operator.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), first);
    expect(r1).toMatchObject({ number: 'GR-00001', inspectionRequired: true });
    const again = await operator.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), first);
    expect(again).toMatchObject({ id: r1.id, replayed: true });
    expect((await onHand(viewer, co, bolt.id)).onHand).toBe(600);
    expect((await onHand(viewer, co, plate.id)).onHand).toBe(20);
    pov = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`));
    expect(pov.purchaseOrder.status).toBe('partially_received');
    expect(pov.lines.map((l: any) => [l.received, l.rejected, l.outstanding])).toEqual([
      [600, 0, 400],
      [20, 2, 30],
      [1, 0, 0],
    ]);
    // Too much is refused, then the rest arrives.
    expect((await operator.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lb.id, received: 401, locationId: bin1.id }] })).status).toBe(400);
    const r2 = await operator.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { receivedDate: day(25), lines: [{ poLineId: lb.id, received: 400, locationId: bin1.id }, { poLineId: lp.id, received: 30, lot: 'L-78' }] });
    expect(r2.number).toBe('GR-00002');
    pov = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`));
    expect(pov.purchaseOrder.status).toBe('received');
    expect((await onHand(viewer, co, bolt.id)).onOrder).toBe(0);
    // Stock value at the order's net price: 1000 x 18 = 18,000; plates 50 x 850 = 42,500.
    expect((await onHand(viewer, co, bolt.id)).valueCents).toBe(18_000);
    expect((await onHand(viewer, co, plate.id)).valueCents).toBe(42_500);
    const rv = await buyer.json('GET', erp(co, `/receipts/${r1.id}`));
    // Release 4 made the inspection real: the note points at Quality (test/erp-r4-quality.test.ts covers it).
    expect(rv.inspectionNote).toMatch(/inspect the flagged lines in Quality/);
    expect(rv.integration.find((e: any) => e.kind === 'finance.inventory_posting')).toMatchObject({ status: 'planned', lastError: 'Planned: Finance posting, not built yet' });

    // 6. Supplier performance, measured from the receipts: the first on time (day 2, required day 20), the second late
    // (day 25); not in full (damaged plates, and a second delivery); two days from the order to its first receipt.
    const sup = await viewer.json('GET', erp(co, `/suppliers/${a.id}`));
    expect(sup.performance).toMatchObject({ measured: true, orders: 1, receipts: 2, onTimeRate: 0.5, inFullRate: 0, avgLeadTimeDays: 2, rejectedQty: 2 });

    // 7. The draft bill: refused without Finance, made once by a buyer whose Finance role may create bills.
    expect((await buyer.req('POST', erp(co, `/receipts/${r1.id}/bill`))).status).toBe(409); // supplier not linked to Finance
    await owner.json('POST', erp(co, `/suppliers/${a.id}/finance`), { finOrgId: tools.finance, create: true });
    expect((await buyer2.req('POST', erp(co, `/receipts/${r1.id}/bill`))).status).toBe(403); // no Finance role
    expect((await viewer.req('POST', erp(co, `/receipts/${r1.id}/bill`))).status).toBe(403);
    const bill = await buyer.json('POST', erp(co, `/receipts/${r1.id}/bill`));
    expect(bill.existing).toBe(false);
    const twice = await buyer.json('POST', erp(co, `/receipts/${r1.id}/bill`));
    expect(twice).toMatchObject({ billId: bill.billId, existing: true });
    const bills = await env.DB.prepare("SELECT id, status, total, reference FROM fin_docs WHERE org_id = ? AND kind = 'bill'").bind(tools.finance).all<any>();
    expect(bills.results).toHaveLength(1);
    // 600 x 18 + 20 x 850 + 5,000 freight = 32,800 net + 10% GST = 36,080
    expect(bills.results[0]).toMatchObject({ status: 'draft', total: 36_080, reference: 'GR-00001 PO-00001' });
    // Two requests at the same moment for the other receipt: still one bill.
    const both = await Promise.all([buyer.req('POST', erp(co, `/receipts/${r2.id}/bill`)), buyer.req('POST', erp(co, `/receipts/${r2.id}/bill`))]);
    expect(both.map((r) => r.status).sort()).toEqual(expect.arrayContaining([201]));
    const after = await env.DB.prepare("SELECT COUNT(*) AS n FROM fin_docs WHERE org_id = ? AND kind = 'bill'").bind(tools.finance).first<{ n: number }>();
    expect(after!.n).toBe(2);
    const events = await env.DB.prepare("SELECT status FROM erp_integration_events WHERE company_id = ? AND kind = 'finance.draft_bill'").bind(co).all<any>();
    expect(events.results.map((e) => e.status)).toEqual(['done', 'done']);

    // 8. History: each step is recorded.
    const h = (await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`))).history.map((e: any) => e.action);
    expect(h).toEqual(expect.arrayContaining(['po.created', 'po.submitted', 'po.approved', 'po.sent', 'po.received']));
  });
});

describe('Scenario C: warehouse operations, counts and valuation', () => {
  it('moves stock between locations, reserves, issues, quarantines, returns, scraps, counts and values it', async () => {
    const t = await team('Cygnus');
    const { owner, co, engineer, storeman, storeman2, operator, viewer, buyer } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { costingMethod: 'weighted_average', adjustmentApprovalCents: 5_000 });
    const { wh, bin1, bin2, quar } = await warehouse(storeman, co);
    const resin = await product(engineer, co, { name: 'Epoxy resin', type: 'consumable', uom: 'litre', standardCostCents: 1500 });
    await storeman.json('PUT', erp(co, `/products/${resin.id}/stock-settings`), { trackLots: true, trackExpiry: true, reorderPoint: 30, minQty: 20 });
    // Opening stock: two lots (adjustments within the threshold by value post at once? 40 x 1500 = 60,000: over 5,000, so approved).
    const adj = await operator.json('POST', erp(co, '/adjustments'), { productId: resin.id, locationId: bin1.id, lot: 'R1', expiry: '2027-03-01', quantity: 40, unitCostCents: 1500, reason: 'Opening stock' });
    expect(adj).toMatchObject({ number: 'ADJ-00001', status: 'pending' });
    expect((await operator.req('POST', erp(co, `/adjustments/${adj.id}/approve`), {})).status).toBe(403);
    await storeman.json('POST', erp(co, `/adjustments/${adj.id}/approve`), { note: 'Checked the delivery note' });
    const adj2 = await operator.json('POST', erp(co, '/adjustments'), { productId: resin.id, locationId: bin1.id, lot: 'R2', expiry: '2027-06-01', quantity: 20, unitCostCents: 1800, reason: 'Opening stock' });
    // A warehouse manager cannot approve their own adjustment in a company of several.
    const own = await storeman.json('POST', erp(co, '/adjustments'), { productId: resin.id, locationId: bin1.id, lot: 'R2', expiry: '2027-06-01', quantity: 5, unitCostCents: 1800, reason: 'Found more' });
    expect(own.status).toBe('pending');
    expect((await storeman.req('POST', erp(co, `/adjustments/${own.id}/approve`), {})).status).toBe(403);
    await storeman2.json('POST', erp(co, `/adjustments/${adj2.id}/approve`), {});
    await storeman2.json('POST', erp(co, `/adjustments/${own.id}/reject`), { note: 'Not found on recount' });
    let s = await onHand(viewer, co, resin.id);
    // 40 x 1500 + 20 x 1800 = 96,000 over 60 litres: average 1,600
    expect(s).toMatchObject({ onHand: 60, available: 60, valueCents: 96_000 });

    // Transfer, reserve and issue against the reservation.
    await operator.json('POST', erp(co, '/stock/transfer'), { productId: resin.id, locationId: bin1.id, lot: 'R1', quantity: 15, toLocationId: bin2.id });
    const res = await operator.json('POST', erp(co, '/reservations'), { productId: resin.id, locationId: bin2.id, lot: 'R1', quantity: 10, reference: 'Job 42' });
    s = await onHand(viewer, co, resin.id);
    expect(s).toMatchObject({ onHand: 60, reserved: 10, available: 50 });
    // The reserved units cannot be issued as free stock: 15 at B2, 10 reserved, so 6 is refused.
    expect((await operator.req('POST', erp(co, '/stock/issue'), { productId: resin.id, locationId: bin2.id, lot: 'R1', quantity: 6 })).status).toBe(409);
    await operator.json('POST', erp(co, `/reservations/${res.id}/issue`), { quantity: 10 });
    s = await onHand(viewer, co, resin.id);
    // issued 10 at the average 1,600
    expect(s).toMatchObject({ onHand: 50, reserved: 0, available: 50, valueCents: 80_000 });

    // Quarantine and release; quarantined stock is not available.
    expect((await operator.req('POST', erp(co, '/stock/quarantine'), { productId: resin.id, locationId: bin1.id, lot: 'R2', quantity: 5, toLocationId: bin2.id, reason: 'Cloudy' })).status).toBe(400);
    await operator.json('POST', erp(co, '/stock/quarantine'), { productId: resin.id, locationId: bin1.id, lot: 'R2', quantity: 5, toLocationId: quar.id, reason: 'Cloudy' });
    s = await onHand(viewer, co, resin.id);
    expect(s).toMatchObject({ onHand: 45, quarantine: 5, available: 45 });
    await operator.json('POST', erp(co, '/stock/release'), { productId: resin.id, locationId: quar.id, lot: 'R2', quantity: 2, toLocationId: bin1.id, reason: 'Tested good' });
    await operator.json('POST', erp(co, '/stock/scrap'), { productId: resin.id, locationId: quar.id, lot: 'R2', quantity: 3, reason: 'Failed test' }).catch(async () => {
      // over the 50-dollar threshold: an operator cannot scrap it; a warehouse manager can
      await storeman.json('POST', erp(co, '/stock/scrap'), { productId: resin.id, locationId: quar.id, lot: 'R2', quantity: 3, reason: 'Failed test' });
    });
    // Customer and supplier returns.
    await operator.json('POST', erp(co, '/stock/customer-return'), { productId: resin.id, locationId: bin1.id, lot: 'R1', expiry: '2027-03-01', quantity: 1, reason: 'Unopened, returned' });
    const supplier = await approvedSupplier({ buyer, manager: t.manager, co }, 'Resin Supplies');
    await operator.json('POST', erp(co, '/stock/supplier-return'), { productId: resin.id, locationId: bin1.id, lot: 'R1', quantity: 1, supplierId: supplier.id, reason: 'Damaged seal' });
    s = await onHand(viewer, co, resin.id);
    expect(s.onHand).toBe(47);

    // A stocktake: one variance, submitted by the operator and approved by a warehouse manager.
    const cnt = await operator.json('POST', erp(co, '/counts'), { warehouseId: wh.id, kind: 'stocktake' });
    expect(cnt.number).toBe('CNT-00001');
    let cv = await operator.json('GET', erp(co, `/counts/${cnt.id}`));
    const lines = cv.lines as any[];
    expect(lines.length).toBeGreaterThanOrEqual(3);
    const r1b1 = lines.find((l) => l.lot === 'R1' && l.locationCode === 'B1');
    await operator.json('PUT', erp(co, `/counts/${cnt.id}/counted`), { lines: lines.map((l) => ({ id: l.id, counted: l.id === r1b1.id ? l.expected - 2 : l.expected })) });
    expect((await operator.req('POST', erp(co, `/counts/${cnt.id}/approve`), {})).status).toBe(403);
    await operator.json('POST', erp(co, `/counts/${cnt.id}/submit`), {});
    cv = await operator.json('GET', erp(co, `/counts/${cnt.id}`));
    expect(cv.count).toMatchObject({ status: 'submitted', variances: 1 });
    const approved = await storeman.json('POST', erp(co, `/counts/${cnt.id}/approve`), {});
    expect(approved.variances).toBe(1);
    // A second approval of the same count changes nothing.
    expect((await storeman2.req('POST', erp(co, `/counts/${cnt.id}/approve`), {})).status).toBe(409);
    s = await onHand(viewer, co, resin.id);
    expect(s.onHand).toBe(45);
    const moves = await viewer.json('GET', erp(co, `/movements?productId=${resin.id}&source=count`));
    expect(moves.moves).toHaveLength(1);
    expect(moves.moves[0]).toMatchObject({ type: 'count_out', quantity: -2, reference: 'CNT-00001' });

    // Valuation, traceability and the ledger.
    const val = await viewer.json('GET', erp(co, '/valuation'));
    expect(val).toMatchObject({ method: 'weighted_average', locked: true });
    expect(val.rows.find((r: any) => r.productId === resin.id).quantity).toBe(45);
    expect(val.totalCents).toBe(val.rows.reduce((n: number, r: any) => n + r.valueCents, 0));
    const trace = await viewer.json('GET', erp(co, `/trace?productId=${resin.id}&lot=R2`));
    expect(trace.moves.map((m: any) => m.type)).toEqual(expect.arrayContaining(['adjust_in', 'quarantine_out', 'quarantine_in', 'release_out', 'release_in', 'scrap']));
    expect(trace.current.map((r: any) => r.locationCode).sort()).toEqual(['B1']);
    await expect(env.DB.prepare('UPDATE erp_stock_moves SET on_hand_delta = 99 WHERE company_id = ?').bind(co).run()).rejects.toThrow(/append-only/);
    await expect(env.DB.prepare('DELETE FROM erp_stock_moves WHERE company_id = ?').bind(co).run()).rejects.toThrow(/append-only/);
    // The costing method is locked by the first movement.
    expect((await owner.req('PUT', erp(co, '/erp-settings'), { costingMethod: 'fifo' })).status).toBe(409);

    // QR labels as SVG, and the scan lookup the warehouse screen uses.
    const svg = await viewer.req('GET', erp(co, `/locations/${bin1.id}/qr.svg`));
    expect(svg.headers.get('Content-Type')).toMatch(/image\/svg\+xml/);
    expect(await svg.text()).toMatch(/^<svg [^>]*viewBox="0 0 \d+ \d+"/);
    expect((await viewer.json('GET', erp(co, `/scan?code=${encodeURIComponent('LOC:MAIN/B1')}`))).location.id).toBe(bin1.id);
    expect((await viewer.json('GET', erp(co, '/scan?code=MAIN/B2'))).location.id).toBe(bin2.id);
    expect((await viewer.json('GET', erp(co, `/scan?code=${resin.number}`))).product.id).toBe(resin.id);
    expect((await viewer.req('GET', erp(co, '/scan?code=NOPE'))).status).toBe(404);
    // Below the reorder point: 45 available against 30? no. Issue 20, then it is.
    await operator.json('POST', erp(co, '/stock/issue'), { productId: resin.id, locationId: bin1.id, lot: 'R1', quantity: 20, reference: 'Job 43' });
    const short = await viewer.json('GET', erp(co, '/reports/shortages'));
    expect(short.rows.find((r: any) => r.productId === resin.id)).toMatchObject({ available: 25, shortfall: 5 });
    // Viewers read but do not move stock.
    expect((await viewer.req('POST', erp(co, '/stock/issue'), { productId: resin.id, locationId: bin1.id, lot: 'R1', quantity: 1 })).status).toBe(403);
  });
});

describe('valuation: weighted average and FIFO', () => {
  async function solo(method: 'weighted_average' | 'fifo') {
    const p = await signup(`Valuer ${method}`);
    const own = (await p.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    await p.json('PUT', erp(own.id, '/erp-settings'), { costingMethod: method, adjustmentApprovalCents: 100_000_000 });
    const { bin1 } = await warehouse(p, own.id);
    const item = await product(p, own.id, { name: 'Widget' });
    return { p, co: own.id, bin1, item };
  }

  it('weighted average: issues at the average held at that moment, and the last unit takes the last cent', async () => {
    const { p, co, bin1, item } = await solo('weighted_average');
    await stockIn(p, co, item.id, bin1.id, 10, 100);
    await stockIn(p, co, item.id, bin1.id, 10, 200);
    await stockIn(p, co, item.id, bin1.id, 1, 333);
    // 1000 + 2000 + 333 = 3333 over 21
    expect((await onHand(p, co, item.id)).valueCents).toBe(3333);
    await p.json('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 7 });
    // 7 x 3333 / 21 = 1111
    expect((await onHand(p, co, item.id)).valueCents).toBe(2222);
    await p.json('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 14 });
    expect(await onHand(p, co, item.id)).toMatchObject({ onHand: 0, valueCents: 0 });
    const moves = await p.json('GET', erp(co, `/movements?productId=${item.id}&type=issue&sort=oldest`));
    expect(moves.moves.map((m: any) => m.valueCents)).toEqual([-1111, -2222]);
  });

  it('FIFO: issues take the oldest layers first', async () => {
    const { p, co, bin1, item } = await solo('fifo');
    await stockIn(p, co, item.id, bin1.id, 10, 100);
    await stockIn(p, co, item.id, bin1.id, 10, 200);
    await p.json('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 15 });
    // 10 x 100 + 5 x 200 = 2000 out; 5 x 200 = 1000 left
    expect((await onHand(p, co, item.id)).valueCents).toBe(1000);
    const moves = await p.json('GET', erp(co, `/movements?productId=${item.id}&type=issue`));
    expect(moves.moves[0]).toMatchObject({ valueCents: -2000 });
    await stockIn(p, co, item.id, bin1.id, 5, 300);
    await p.json('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 6 });
    // 5 x 200 + 1 x 300 = 1300 out; 4 x 300 = 1200 left
    expect((await onHand(p, co, item.id)).valueCents).toBe(1200);
    const layers = await env.DB.prepare('SELECT qty_remaining, unit_cost_cents FROM erp_cost_layers WHERE company_id = ? AND product_id = ? ORDER BY received_at, seq').bind(co, item.id).all<any>();
    expect(layers.results.map((l) => [l.qty_remaining, l.unit_cost_cents])).toEqual([
      [0, 100],
      [0, 200],
      [4, 300],
    ]);
    const val = await p.json('GET', erp(co, '/valuation'));
    expect(val).toMatchObject({ method: 'fifo', totalCents: 1200 });
  });
});

describe('stock never below zero', () => {
  it('refuses an issue beyond stock, lets exactly one of two simultaneous issues of the last unit through, and allows negative stock only when set', async () => {
    const p = await signup('Last unit');
    const co = (await p.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own').id;
    await p.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000 });
    const { bin1 } = await warehouse(p, co);
    const item = await product(p, co, { name: 'Last widget' });
    await stockIn(p, co, item.id, bin1.id, 1, 500);
    expect((await p.req('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 2 })).status).toBe(409);
    const both = await Promise.all([p.req('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 1 }), p.req('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 1 })]);
    expect(both.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(await onHand(p, co, item.id)).toMatchObject({ onHand: 0, valueCents: 0 });
    const issues = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_stock_moves WHERE company_id = ? AND move_type = 'issue'").bind(co).first<{ n: number }>();
    expect(issues!.n).toBe(1);
    // An issue from a location that never held it is refused too.
    const other = await p.json('POST', erp(co, '/locations'), { warehouseId: (await p.json('GET', erp(co, '/warehouses'))).warehouses[0].id, code: 'EMPTY' });
    expect((await p.req('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: other.id, quantity: 1 })).status).toBe(409);
    // Allowed once the company allows negative stock; turning it off again is refused while stock is below zero.
    await p.json('PUT', erp(co, '/erp-settings'), { allowNegativeStock: true });
    await p.json('POST', erp(co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 2 });
    expect((await onHand(p, co, item.id)).onHand).toBe(-2);
    expect((await p.req('PUT', erp(co, '/erp-settings'), { allowNegativeStock: false })).status).toBe(409);
    await stockIn(p, co, item.id, bin1.id, 2, 500);
    await p.json('PUT', erp(co, '/erp-settings'), { allowNegativeStock: false });
    // Reservations cannot go beyond stock either.
    expect((await p.req('POST', erp(co, '/reservations'), { productId: item.id, locationId: bin1.id, quantity: 1, reference: 'x' })).status).toBe(409);
  });
});

describe('purchase orders: approval limits, segregation of duties and amendments', () => {
  it('approves within the limit on submit, sends others to a procurement manager, and records the rule', async () => {
    const t = await team('Draco');
    const { owner, co, buyer, manager, manager2, engineer } = t;
    const s = await approvedSupplier(t, 'Draco Supplies');
    const usd = await approvedSupplier(t, 'Overseas Parts', { currency: 'USD' });
    const item = await product(engineer, co, { name: 'Bearing' });
    // No limit set: every order goes to a procurement manager.
    const p0 = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: item.id, quantity: 1, unitPriceCents: 100 }] });
    expect((await buyer.json('POST', erp(co, `/purchase-orders/${p0.id}/submit`), {})).status).toBe('awaiting_approval');
    await owner.json('PUT', erp(co, '/erp-settings'), { poApprovalLimitCents: 10_000 });
    const small = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: item.id, quantity: 10, unitPriceCents: 900, taxCode: 'GST' }] });
    // 9,000 + 900 GST = 9,900: within 10,000
    expect(await buyer.json('POST', erp(co, `/purchase-orders/${small.id}/submit`), {})).toMatchObject({ status: 'approved', rule: 'within_limit' });
    const big = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: item.id, quantity: 10, unitPriceCents: 1000 }] });
    expect(await buyer.json('POST', erp(co, `/purchase-orders/${big.id}/submit`), {})).toMatchObject({ status: 'awaiting_approval' });
    const foreign = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: usd.id, lines: [{ productId: item.id, quantity: 1, unitPriceCents: 100 }] });
    expect((await buyer.json('GET', erp(co, `/purchase-orders/${foreign.id}`))).purchaseOrder.currency).toBe('USD');
    expect(await buyer.json('POST', erp(co, `/purchase-orders/${foreign.id}/submit`), {})).toMatchObject({ status: 'awaiting_approval' });
    // A procurement manager's own order over the limit needs another procurement manager.
    const mine = await manager.json('POST', erp(co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: item.id, quantity: 100, unitPriceCents: 1000 }] });
    await manager.json('POST', erp(co, `/purchase-orders/${mine.id}/submit`), {});
    const refused = await manager.req('POST', erp(co, `/purchase-orders/${mine.id}/approve`), {});
    expect(refused.status).toBe(403);
    expect(((await refused.json()) as any).error).toMatch(/segregation of duties/);
    await manager2.json('POST', erp(co, `/purchase-orders/${mine.id}/approve`), {});
    expect((await buyer.json('GET', erp(co, `/purchase-orders/${mine.id}`))).purchaseOrder).toMatchObject({ status: 'approved', approvalRule: 'manager', sodException: false });
    // Returned to draft with a reason.
    await manager.json('POST', erp(co, `/purchase-orders/${big.id}/reject`), { note: 'Ask for a better price' });
    expect((await buyer.json('GET', erp(co, `/purchase-orders/${big.id}`))).purchaseOrder.status).toBe('draft');
    // A pending supplier cannot be ordered from.
    const pend = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Not approved yet' });
    expect((await buyer.req('POST', erp(co, '/purchase-orders'), { supplierId: pend.id, lines: [{ item: 'x', quantity: 1, unitPriceCents: 1 }] })).status).toBe(400);

    // In a company of one, the submitter's own approval over the limit is the recorded exception.
    const soloP = await signup('Solo buyer');
    const own = (await soloP.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own').id;
    const so = await soloP.json('POST', erp(own, '/suppliers'), { legalName: 'Solo supplier' });
    await soloP.json('POST', erp(own, `/suppliers/${so.id}/status`), { status: 'approved' });
    const sp = await soloP.json('POST', erp(own, '/purchase-orders'), { supplierId: so.id, lines: [{ item: 'Service kit', quantity: 1, unitPriceCents: 500_000 }] });
    expect(await soloP.json('POST', erp(own, `/purchase-orders/${sp.id}/submit`), {})).toMatchObject({ status: 'approved', rule: 'solo' });
    const spv = await soloP.json('GET', erp(own, `/purchase-orders/${sp.id}`));
    expect(spv.purchaseOrder).toMatchObject({ approvalRule: 'solo', sodException: true });
    expect(spv.history.find((e: any) => e.action === 'po.submitted').summary).toMatch(/recorded exception/);
  });

  it('keeps each version of an amended order, sends it back to approval, and protects what was received', async () => {
    const t = await team('Eridanus');
    const { owner, co, buyer, manager, operator, storeman, engineer } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { poApprovalLimitCents: 1_000_000 });
    const { bin1 } = await warehouse(storeman, co);
    const s = await approvedSupplier(t, 'Eridanus Steel');
    const item = await product(engineer, co, { name: 'Steel bar' });
    const po = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: item.id, quantity: 10, unitPriceCents: 1000 }] });
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/sent`), {});
    let v = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`));
    await operator.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: v.lines[0].id, received: 4, locationId: bin1.id }] });
    expect((await buyer.req('POST', erp(co, `/purchase-orders/${po.id}/cancel`), { reason: 'x' })).status).toBe(409);
    expect((await buyer.req('POST', erp(co, `/purchase-orders/${po.id}/amend`), {})).status).toBe(400);
    expect(await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/amend`), { reason: 'Supplier raised the price' })).toMatchObject({ status: 'draft', revision: 2 });
    expect((await operator.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: v.lines[0].id, received: 1, locationId: bin1.id }] })).status).toBe(409);
    expect((await buyer.req('PUT', erp(co, `/purchase-orders/${po.id}`), { lines: [{ id: v.lines[0].id, productId: item.id, quantity: 3, unitPriceCents: 1100 }] })).status).toBe(400);
    await buyer.json('PUT', erp(co, `/purchase-orders/${po.id}`), { lines: [{ id: v.lines[0].id, productId: item.id, quantity: 12, unitPriceCents: 1100 }] });
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    v = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`));
    // Re-approved within the limit: it picks up where receiving left off.
    expect(v.purchaseOrder).toMatchObject({ status: 'partially_received', revision: 2, approvalRule: 'within_limit', totalCents: 14_520 });
    expect(v.lines[0]).toMatchObject({ quantity: 12, received: 4, outstanding: 8 });
    expect(v.revisions).toHaveLength(1);
    expect(v.revisions[0]).toMatchObject({ revision: 1, reason: 'Supplier raised the price' });
    expect(v.revisions[0].snapshot).toMatchObject({ totalCents: 11_000, lines: [{ quantity: 10, unitPriceCents: 1000, received: 4 }] });
    expect(await isPdf(await buyer.req('GET', erp(co, `/purchase-orders/${po.id}/pdf`)))).toBe(true);
    void manager;
  });
});

describe('receipts: idempotent and safe under concurrency', () => {
  it('lets only one of two simultaneous receipts of the last units through, and keeps serial numbers unique', async () => {
    const t = await team('Fornax');
    const { owner, co, buyer, operator, storeman, engineer } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { poApprovalLimitCents: 1_000_000 });
    const { bin1 } = await warehouse(storeman, co);
    const s = await approvedSupplier(t, 'Fornax Pumps');
    const pump = await product(engineer, co, { name: 'Pump' });
    await storeman.json('PUT', erp(co, `/products/${pump.id}/stock-settings`), { trackSerials: true });
    const po = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: pump.id, quantity: 3, unitPriceCents: 10_000 }] });
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    const lineId = (await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`))).lines[0].id;
    expect((await operator.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lineId, received: 2, locationId: bin1.id, serials: ['SN1'] }] })).status).toBe(400);
    await operator.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lineId, received: 1, locationId: bin1.id, serials: ['SN1'] }] });
    const two = await Promise.all([
      operator.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lineId, received: 2, locationId: bin1.id, serials: ['SN2', 'SN3'] }] }),
      operator.req('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: lineId, received: 2, locationId: bin1.id, serials: ['SN4', 'SN5'] }] }),
    ]);
    expect(two.map((r) => r.status).sort()).toEqual([201, 409]);
    const v = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`));
    expect(v.lines[0]).toMatchObject({ received: 3, outstanding: 0 });
    expect(v.purchaseOrder.status).toBe('received');
    expect((await onHand(buyer, co, pump.id)).onHand).toBe(3);
    // The same serial number cannot be in stock twice.
    const again = await operator.req('POST', erp(co, '/stock/customer-return'), { productId: pump.id, locationId: bin1.id, serial: 'SN1', quantity: 1, reason: 'test' });
    expect(again.status).toBe(409);
    const trace = await buyer.json('GET', erp(co, `/trace?productId=${pump.id}&serial=SN1`));
    expect(trace.origins[0]).toMatchObject({ poNumber: po.number, supplierNumber: s.number });
  });
});

describe('isolation, roles, numbering, lists and CSV', () => {
  it('keeps each company’s purchasing and stock to itself and gives each role what it may do', async () => {
    const one = await team('Gemini');
    const two = await team('Hydra');
    const { bin1, wh } = await warehouse(one.storeman, one.co);
    const s = await approvedSupplier(one, 'Gemini Supplies');
    const item = await product(one.engineer, one.co, { name: 'Gemini part' });
    await one.owner.json('PUT', erp(one.co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000 });
    await stockIn(one.owner, one.co, item.id, bin1.id, 5, 100);
    const req = await one.engineer.json('POST', erp(one.co, '/requisitions'), { lines: [{ productId: item.id, quantity: 1 }] });
    const po = await one.buyer.json('POST', erp(one.co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: item.id, quantity: 1, unitPriceCents: 1 }] });
    for (const path of ['/requisitions', `/requisitions/${req.id}`, `/purchase-orders/${po.id}`, '/stock', `/locations/${bin1.id}/qr.svg`, '/valuation', '/reports/shortages', '/operations']) {
      expect((await two.owner.req('GET', erp(one.co, path))).status, path).toBe(404);
    }
    for (const path of [`/purchase-orders/${po.id}`, `/requisitions/${req.id}`, `/products/${item.id}/stock`, `/locations/${bin1.id}/qr.svg`]) {
      expect((await two.owner.req('GET', erp(two.co, path))).status, path).toBe(404);
    }
    const { bin1: theirs } = await warehouse(two.storeman, two.co, 'TWO');
    expect((await two.owner.req('POST', erp(two.co, '/stock/issue'), { productId: item.id, locationId: theirs.id, quantity: 1 })).status).toBe(404);
    expect((await two.buyer.req('POST', erp(two.co, '/purchase-orders'), { supplierId: s.id, lines: [{ item: 'x', quantity: 1, unitPriceCents: 1 }] })).status).toBe(404);
    expect((await two.owner.req('POST', erp(two.co, '/counts'), { warehouseId: wh.id })).status).toBe(404);
    await expect(env.DB.prepare("INSERT INTO erp_stock (id, company_id, product_id, location_id, on_hand, updated_at) VALUES ('x9', ?, ?, ?, 1, 0)").bind(two.co, item.id, theirs.id).run()).rejects.toThrow();

    // Roles: viewers read; operators move stock but neither buy nor approve; buyers buy but do not receive.
    const me = await one.operator.json('GET', erp(one.co, '/me'));
    expect(me.can).toMatchObject({ 'inventory.operate': true, 'inventory.approve': false, 'receiving.post': true, 'purchasing.edit': false, 'settings.manage': false });
    expect((await one.viewer.json('GET', erp(one.co, '/me'))).can).toMatchObject({ 'purchasing.view': true, 'inventory.view': true, 'inventory.operate': false, 'requisitions.raise': false });
    expect((await one.operator.req('POST', erp(one.co, '/purchase-orders'), { supplierId: s.id, lines: [{ item: 'x', quantity: 1, unitPriceCents: 1 }] })).status).toBe(403);
    expect((await one.buyer.req('POST', erp(one.co, '/stock/issue'), { productId: item.id, locationId: bin1.id, quantity: 1 })).status).toBe(403);
    expect((await one.operator.req('POST', erp(one.co, '/warehouses'), { code: 'X', name: 'X' })).status).toBe(403);
    expect((await one.storeman.req('PUT', erp(one.co, '/erp-settings'), { poApprovalLimitCents: 1 })).status).toBe(403);
    const roles = await one.owner.json('GET', erp(one.co, '/roles'));
    expect(roles.roles.map((r: any) => r.value)).toEqual(expect.arrayContaining(['warehouse_manager', 'warehouse_operator']));
    expect(roles.people.find((p: any) => p.id === one.operator.userId).roles).toEqual(['warehouse_operator']);
  });

  it('numbers each kind in turn under concurrency and exports CSV from lists and reports', async () => {
    const t = await team('Indus');
    const { owner, co, buyer, engineer, storeman, viewer } = t;
    const s = await approvedSupplier(t, 'Indus Supplies');
    const item = await product(engineer, co, { name: 'Indus part', standardCostCents: 100 });
    const made = await Promise.all(Array.from({ length: 5 }, () => buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: s.id, lines: [{ productId: item.id, quantity: 1, unitPriceCents: 120 }] })));
    expect(made.map((m) => m.number).sort()).toEqual(['PO-00001', 'PO-00002', 'PO-00003', 'PO-00004', 'PO-00005']);
    const list = await viewer.json('GET', erp(co, '/purchase-orders?limit=2&sort=number'));
    expect(list).toMatchObject({ total: 5, limit: 2 });
    expect(list.purchaseOrders.map((o: any) => o.number)).toEqual(['PO-00005', 'PO-00004']);
    expect((await viewer.json('GET', erp(co, '/purchase-orders?q=PO-00003'))).total).toBe(1);
    await owner.json('PUT', erp(co, '/erp-settings'), { poApprovalLimitCents: 1_000_000, adjustmentApprovalCents: 100_000_000 });
    const { bin1 } = await warehouse(storeman, co);
    await buyer.json('POST', erp(co, `/purchase-orders/${made[0].id}/submit`), {});
    const line = (await buyer.json('GET', erp(co, `/purchase-orders/${made[0].id}`))).lines[0];
    await t.operator.json('POST', erp(co, `/purchase-orders/${made[0].id}/receipts`), { lines: [{ poLineId: line.id, received: 1, locationId: bin1.id }] });
    for (const [path, header] of [
      ['/requisitions?format=csv', 'Number,Title,Status'],
      ['/rfqs?format=csv', 'Number,Title,Status'],
      ['/purchase-orders?format=csv', 'Number,Revision,Supplier'],
      ['/receipts?format=csv', 'Number,Purchase order,Supplier'],
      ['/stock?format=csv', 'Product,Name,Unit,On hand'],
      ['/stock?view=detail&format=csv', 'Product,Name,Warehouse,Location'],
      ['/movements?format=csv', 'Date,Type,Product'],
      ['/valuation?format=csv', 'Product,Name,Quantity'],
      ['/reports/purchase-commitments?format=csv', 'Order,Supplier,Status'],
      ['/reports/supplier-spend?format=csv', 'Supplier,Name,Currency'],
      ['/reports/price-variance?format=csv', 'Receipt,Received,Order'],
      ['/reports/supplier-delivery?format=csv', 'Supplier,Name,Orders received'],
      ['/reports/stock-on-hand?format=csv', 'Product,Name,Warehouse'],
      ['/reports/stock-ageing?format=csv', 'Product,Name,On hand'],
      ['/reports/slow-moving?format=csv', 'Product,Name,On hand'],
      ['/reports/shortages?format=csv', 'Product,Name,Available'],
    ] as const) {
      const res = await viewer.req('GET', erp(co, path));
      expect(res.status, path).toBe(200);
      expect(res.headers.get('Content-Type'), path).toMatch(/text\/csv/);
      expect((await res.text()).split('\n')[0], path).toContain(header);
    }
    const variance = await viewer.json('GET', erp(co, '/reports/price-variance'));
    // paid 120 against a standard cost of 100 on one unit
    expect(variance.rows[0]).toMatchObject({ varianceCents: 20, quantity: 1 });
    const commitments = await viewer.json('GET', erp(co, '/reports/purchase-commitments'));
    expect(commitments.rows).toHaveLength(0);
    const ageing = await viewer.json('GET', erp(co, '/reports/stock-ageing'));
    expect(ageing.rows[0]).toMatchObject({ onHand: 1, d30: 1 });
  });
});

describe('bills of materials: stock availability', () => {
  it('shows each component’s available stock against a build quantity and flags shortages', async () => {
    const p = await signup('Builder');
    const co = (await p.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own').id;
    await p.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000 });
    const { bin1 } = await warehouse(p, co);
    const asm = await p.json('POST', erp(co, '/products'), { name: 'Assembly', type: 'assembly' });
    const leg = await p.json('POST', erp(co, '/products'), { name: 'Leg', type: 'component' });
    const top = await p.json('POST', erp(co, '/products'), { name: 'Top', type: 'component' });
    const rev = (await p.json('GET', erp(co, `/products/${asm.id}`))).revisions[0];
    await p.json('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId: leg.id, quantity: 4 });
    await p.json('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId: top.id, quantity: 1 });
    await stockIn(p, co, leg.id, bin1.id, 10, 50);
    await stockIn(p, co, top.id, bin1.id, 5, 300);
    const ex = await p.json('GET', erp(co, `/revisions/${rev.id}/explosion?quantity=3`));
    const byName = (n: string) => ex.nodes.find((x: any) => x.name === n);
    expect(byName('Leg')).toMatchObject({ required: 12, available: 10, shortage: true });
    expect(byName('Top')).toMatchObject({ required: 3, available: 5, shortage: false });
    expect(ex.shortages).toBe(1);
    const tree = await p.json('GET', erp(co, `/revisions/${rev.id}`));
    expect(tree.lines.map((l: any) => l.available).sort()).toEqual([10, 5].sort());
    const csv = await (await p.req('GET', erp(co, `/revisions/${rev.id}/explosion?quantity=3&format=csv`))).text();
    expect(csv.split('\n')[0]).toContain('Required for 3,Available,Shortage');
  });
});

describe('QR codes', () => {
  it('matches a reference encoder’s symbols (python-qrcode, level M, byte mode)', () => {
    // Made with python-qrcode 8 (error correction M, the mask given), border 0.
    const q = qrMatrix('PRD-00001', 0);
    expect(q.version).toBe(1);
    expect(q.modules.map((r) => r.map((v) => (v ? '1' : '0')).join(''))).toEqual(QR_PRD_00001_MASK0);
    const big = qrMatrix('B'.repeat(213));
    expect(big.version).toBe(10);
    expect(() => qrMatrix('B'.repeat(214))).toThrow(/too long/);
  });
});

describe('the example company', () => {
  it('gets a warehouse, received stock from a purchase order, a requisition and a request for quotation with two quotations, and loses them on removal', async () => {
    const ex = await signup('Example buyer');
    const built = (await (await ex.req('POST', '/api/system/demo', {})).json()) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const wh = await ex.json('GET', erp(co, '/warehouses'));
    expect(wh.warehouses).toHaveLength(1);
    expect((await ex.json('GET', erp(co, `/locations?warehouseId=${wh.warehouses[0].id}`))).locations.length).toBeGreaterThanOrEqual(8);
    const pos = await ex.json('GET', erp(co, '/purchase-orders'));
    expect(pos.purchaseOrders).toMatchObject([{ status: 'received', approvalRule: 'within_limit' }]);
    const stock = await ex.json('GET', erp(co, '/stock?filter=in_stock'));
    // Release 5 adds packed kits (shipped, one back in quarantine): the bracket arms are as Release 2 left them.
    expect(stock.rows.find((r: any) => r.name === 'Bracket arm, laser cut')).toMatchObject({ onHand: 40, valueCents: 15_200 });
    expect((await ex.json('GET', erp(co, '/requisitions'))).requisitions).toMatchObject([{ status: 'converted' }]);
    const rfqs = await ex.json('GET', erp(co, '/rfqs'));
    expect(rfqs.rfqs).toMatchObject([{ status: 'sent', quotationCount: 2 }]);
    const rv = await ex.json('GET', erp(co, `/rfqs/${rfqs.rfqs[0].id}`));
    expect(rv.comparison.quotations.filter((q: any) => q.cheapest)).toHaveLength(1);
    expect(rv.comparison.quotations.filter((q: any) => q.fastest)).toHaveLength(1);
    await ex.json('POST', '/api/system/demo/remove', {});
    for (const table of ['erp_warehouses', 'erp_locations', 'erp_stock', 'erp_stock_moves', 'erp_purchase_orders', 'erp_receipts', 'erp_requisitions', 'erp_rfqs', 'erp_quotations', 'erp_valuation', 'erp_settings', 'erp_sequences', 'erp_integration_events', 'erp_purges']) {
      const n = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE company_id = ?`).bind(co).first<{ n: number }>();
      expect(n!.n, table).toBe(0);
    }
  });
});

const QR_PRD_00001_MASK0 = [
  '111111100000001111111',
  '100000101011101000001',
  '101110100111001011101',
  '101110100010101011101',
  '101110101000101011101',
  '100000100000101000001',
  '111111101010101111111',
  '000000000101100000000',
  '101010100101000010010',
  '100001010000010011000',
  '000010110110101010011',
  '010110001010010100010',
  '111101100110110010101',
  '000000001101010010000',
  '111111100101011010111',
  '100000100001110101000',
  '101110101101001010000',
  '101110100010001010110',
  '101110101010100011101',
  '100000100110001101010',
  '111111101000101011011',
];
