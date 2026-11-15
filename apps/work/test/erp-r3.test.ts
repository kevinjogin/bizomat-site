// BIZOMAT ERP, Release 3 (src/worker/erp): manufacturing. The owner's Scenario D (production order, routing, materials,
// labour, output, completion) runs end to end with exact costs; Scenario C's last step issues received, reserved and
// transferred stock to a manufacturing order; the rest checks each rule the brief sets: production roles, isolation,
// segregation of duties on routing release, concurrent last-unit issues to two orders, a finished-goods receipt sent
// twice, over-completion, MRP with exact numbers (levels, lead times, an open purchase order, a reservation, an open
// manufacturing order, safety stock, lot sizes, late, overdue and expedite), conversion of suggestions, rough-cut
// capacity, the reports and the example company.
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
  return data as { company: { id: string } };
}

async function joinCompany(owner: Client, companyId: string, invitee: Client) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
type Who = 'engineer' | 'approver' | 'approver2' | 'pm' | 'op' | 'op2' | 'storeman' | 'wop' | 'buyer' | 'manager' | 'viewer';

/** A registered company with every role Release 3 uses. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company } = await registerCompany(owner, `${label} Works`);
  const co = company.id;
  const people = {} as Record<Who, Client>;
  for (const [key, role] of [
    ['engineer', 'engineer'],
    ['approver', 'engineering_approver'],
    ['approver2', 'engineering_approver'],
    ['pm', 'production_manager'],
    ['op', 'production_operator'],
    ['op2', 'production_operator'],
    ['storeman', 'warehouse_manager'],
    ['wop', 'warehouse_operator'],
    ['buyer', 'buyer'],
    ['manager', 'procurement_manager'],
    ['viewer', null],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p);
    if (role) await owner.json('PUT', erp(co, `/roles/${p.userId}`), { roles: [role] });
    people[key] = p;
  }
  return { owner, co, ...people };
}

async function ownCompany(c: Client) {
  return (await c.json('GET', '/api/maintenance/companies')).companies.find((x: any) => x.kind === 'own').id as string;
}

async function warehouse(c: Client, co: string) {
  const wh = await c.json('POST', erp(co, '/warehouses'), { code: 'MAIN', name: 'Main store' });
  const loc = (b: Record<string, unknown>) => c.json('POST', erp(co, '/locations'), { warehouseId: wh.id, ...b });
  const store = await loc({ code: 'S', name: 'Store', level: 'store' });
  return { wh, store, bin1: await loc({ code: 'B1', parentId: store.id }), bin2: await loc({ code: 'B2', parentId: store.id }), fg: await loc({ code: 'FG', level: 'zone', kind: 'finished_goods', parentId: store.id }) };
}

async function stockIn(c: Client, co: string, productId: string, locationId: string, quantity: number, unitCostCents: number) {
  const r = await c.json('POST', erp(co, '/adjustments'), { productId, locationId, quantity, unitCostCents, reason: 'Opening stock' });
  expect(r.status).toBe('posted');
}

const totals = async (c: Client, co: string, productId: string) => (await c.json('GET', erp(co, `/products/${productId}/stock`))).totals as { onHand: number; reserved: number; available: number; valueCents: number };

/** Adds lines to each product's first draft revision and releases them through one change order. */
async function releaseBoms(drafter: Client, approver: Client, co: string, boms: [string, [string, number, number?][]][]) {
  for (const [productId, lines] of boms) {
    const rev = (await drafter.json('GET', erp(co, `/products/${productId}`))).revisions[0];
    for (const [componentId, quantity, scrapPct] of lines) await drafter.json('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId, quantity, scrapPct: scrapPct ?? 0 });
  }
  const eco = await drafter.json('POST', erp(co, '/change-orders'), { title: 'First release', reason: 'Ready to make', productIds: boms.map((b) => b[0]) });
  await drafter.json('POST', erp(co, `/change-orders/${eco.id}/submit`), {});
  await approver.json('POST', erp(co, `/change-orders/${eco.id}/approve`), { note: 'Checked' });
  await approver.json('POST', erp(co, `/change-orders/${eco.id}/release`), {});
}

/** A released routing of `ops`, drafted by `drafter` and released by `releaser`. */
async function routing(drafter: Client, releaser: Client, co: string, productId: string, ops: Record<string, unknown>[], leadTimeDays: number | null = null) {
  const r = await drafter.json('POST', erp(co, '/routings'), { productId, leadTimeDays });
  for (const op of ops) await drafter.json('POST', erp(co, `/routings/${r.id}/operations`), op);
  await releaser.json('POST', erp(co, `/routings/${r.id}/release`), { note: 'Released' });
  return r;
}

describe('Scenario D: production order, routing, materials, labour, output and completion', () => {
  it('runs a manufacturing order from draft to closed with exact estimated and actual costs', async () => {
    const t = await team('Gamma');
    const { owner, co, engineer, approver, approver2, pm, op, op2, storeman, wop, buyer, manager, viewer } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, costingMethod: 'weighted_average' });
    const { bin1, fg } = await warehouse(storeman, co);
    const widget = await engineer.json('POST', erp(co, '/products'), { name: 'Widget', type: 'finished_product' });
    const frame = await engineer.json('POST', erp(co, '/products'), { name: 'Frame', type: 'subassembly', standardCostCents: 500 });
    const bolt = await engineer.json('POST', erp(co, '/products'), { name: 'Bolt', type: 'purchased_item', standardCostCents: 10 });
    await releaseBoms(engineer, approver, co, [[widget.id, [[frame.id, 1], [bolt.id, 4, 5]]]]);
    await stockIn(storeman, co, frame.id, bin1.id, 12, 500);
    await stockIn(storeman, co, bolt.id, bin1.id, 100, 10);

    // Work centres, a machine and an outsourcing supplier; the routing drafted by the production manager.
    expect((await op.req('POST', erp(co, '/work-centres'), { code: 'X', name: 'Nope' })).status).toBe(403);
    const cut = await pm.json('POST', erp(co, '/work-centres'), { code: 'CUT', name: 'Cutting', labourRateCents: 6000, machineRateCents: 3000, overheadRateCents: 2000 });
    const assy = await pm.json('POST', erp(co, '/work-centres'), { code: 'ASSY', name: 'Assembly', labourRateCents: 5000, overheadPct: 50 });
    expect(cut).toMatchObject({ weeklyHours: 40, workingDaysText: 'Mon, Tue, Wed, Thu, Fri' });
    expect((await pm.req('POST', erp(co, '/work-centres'), { code: 'BAD', name: 'Both', overheadRateCents: 100, overheadPct: 10 })).status).toBe(400);
    const laser = await pm.json('POST', erp(co, '/machines'), { workCentreId: cut.id, code: 'LASER-1', name: 'Laser' });
    const coater = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Gamma Coaters' });
    await manager.json('POST', erp(co, `/suppliers/${coater.id}/status`), { status: 'approved' });
    const r = await pm.json('POST', erp(co, '/routings'), { productId: widget.id });
    expect(r.revision).toBe('A');
    await pm.json('POST', erp(co, `/routings/${r.id}/operations`), { opNo: 10, name: 'Cut and weld', workCentreId: cut.id, machineId: laser.id, setupMinutes: 30, runMinutes: 6, crew: 1 });
    await pm.json('POST', erp(co, `/routings/${r.id}/operations`), { opNo: 20, name: 'Assemble and inspect', workCentreId: assy.id, runMinutes: 9, crew: 2, inspection: true });
    await pm.json('POST', erp(co, `/routings/${r.id}/operations`), { opNo: 30, name: 'Powder coat', outsourced: true, supplierId: coater.id, outsourceCostCents: 150, outsourceDays: 3 });
    expect((await pm.req('POST', erp(co, `/routings/${r.id}/operations`), { opNo: 40, name: 'Loop', workCentreId: assy.id, predecessors: [50] })).status).toBe(400);
    // The production manager may not release a routing; an engineering approver who did not draft it does.
    expect((await pm.req('POST', erp(co, `/routings/${r.id}/release`), {})).status).toBe(403);
    expect(await approver.json('POST', erp(co, `/routings/${r.id}/release`), { note: 'Checked against the drawings' })).toMatchObject({ status: 'released', sodException: false });
    expect((await pm.req('POST', erp(co, `/routings/${r.id}/operations`), { name: 'Late', workCentreId: assy.id })).status).toBe(409);

    // 1. Create the production order: only a production manager (or an ERP administrator) may.
    for (const who of [op, viewer, buyer, wop]) expect((await who.req('POST', erp(co, '/mos'), { productId: widget.id, quantity: 1 })).status).toBe(403);
    const before = (await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_journals').first<{ n: number }>())!.n;
    const mo = await pm.json('POST', erp(co, '/mos'), { productId: widget.id, quantity: 10, requiredDate: day(14), startDate: day(0), customerRef: 'Job 42', assignees: [op.userId, op2.userId] });
    expect(mo.number).toBe('MO-00001');
    let v = await viewer.json('GET', erp(co, `/mos/${mo.id}`));
    expect(v.order).toMatchObject({ status: 'draft', quantity: 10, maxQty: 10, bomRevision: 'A', routingRevision: 'A', customerRef: 'Job 42' });
    expect(v.materials.map((m: any) => [m.productNumber, m.requiredQty])).toEqual([[frame.number, 10], [bolt.number, 42]]);
    // Estimate: materials 10 frames at 5.00 and 40 bolts at 0.10 = 54.00, the 5% bolt scrap allowance 0.20; labour
    // 1.5 h x 60.00 (cutting) + 3 h x 50.00 (two people assembling) = 240.00; machine 1.5 h x 30.00 = 45.00; outsourcing
    // 10 x 1.50 = 15.00; overheads 1.5 labour hours x 20.00 + 50% of 150.00 = 105.00. Total 459.20.
    expect(v.order.estimate).toEqual({ materials: 5400, labour: 24000, machine: 4500, outsourcing: 1500, overheads: 10500, scrap: 20, rework: 0, total: 45920 });
    expect(v.assignees.map((x: any) => x.id).sort()).toEqual([op.userId, op2.userId].sort());

    // 2. Release: the routing's operations are scheduled; materials reserved; no shortages.
    const rel = await pm.json('POST', erp(co, `/mos/${mo.id}/release`), { reserve: true });
    expect(rel.shortages).toEqual([]);
    expect(rel.reserved.map((x: any) => x.quantity).sort((a: number, b: number) => a - b)).toEqual([10, 42]);
    expect((await pm.req('POST', erp(co, `/mos/${mo.id}/release`), {})).status).toBe(409);
    expect(await totals(viewer, co, frame.id)).toMatchObject({ onHand: 12, reserved: 10, available: 2 });
    v = await viewer.json('GET', erp(co, `/mos/${mo.id}`));
    const [op10, op20, op30] = v.operations;
    expect(op10.plannedStart).toBeTruthy();
    expect(op20.plannedStart > op10.plannedFinish).toBe(true);

    // Predecessors are enforced: operation 20 waits for 10.
    expect((await op.req('POST', erp(co, `/mos/${mo.id}/operations/${op20.id}/start`), {})).status).toBe(409);
    expect((await wop.req('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/start`), {})).status).toBe(403);

    // 3. Issue materials (a warehouse operator), from the order's reservations; return two unused bolts.
    await wop.json('POST', erp(co, `/mos/${mo.id}/issue`), { lines: [{ materialId: v.materials[0].id, locationId: bin1.id, quantity: 10 }, { materialId: v.materials[1].id, locationId: bin1.id, quantity: 42 }] });
    expect(await totals(viewer, co, frame.id)).toMatchObject({ onHand: 2, reserved: 0 });
    expect(await totals(viewer, co, bolt.id)).toMatchObject({ onHand: 58, reserved: 0 });
    await op.json('POST', erp(co, `/mos/${mo.id}/return`), { lines: [{ materialId: v.materials[1].id, locationId: bin1.id, quantity: 2 }] });
    expect((await op.req('POST', erp(co, `/mos/${mo.id}/return`), { lines: [{ materialId: v.materials[1].id, locationId: bin1.id, quantity: 41 }] })).status).toBe(400);
    expect(await totals(viewer, co, bolt.id)).toMatchObject({ onHand: 60 });

    // 4. Record labour and machine time, and report output, operation by operation.
    const opPath = (o: any, x: string) => erp(co, `/mos/${mo.id}/operations/${o.id}/${x}`);
    await op.json('POST', opPath(op10, 'start'), {});
    await op.json('POST', opPath(op10, 'time'), { kind: 'labour', minutes: 100 });
    await op.json('POST', opPath(op10, 'time'), { kind: 'machine', minutes: 90 });
    await op.json('POST', opPath(op10, 'report'), { kind: 'good', quantity: 10, requestKey: 'gamma-op10-good-1' });
    expect(await op.json('POST', opPath(op10, 'report'), { kind: 'good', quantity: 10, requestKey: 'gamma-op10-good-1' })).toMatchObject({ replayed: true });
    expect((await op.req('POST', opPath(op10, 'report'), { kind: 'good', quantity: 1 })).status).toBe(400);
    await op.json('POST', opPath(op10, 'complete'), {});
    await op.json('POST', opPath(op20, 'start'), {});
    await op.json('POST', opPath(op20, 'time'), { kind: 'labour', minutes: 60 });
    await op2.json('POST', opPath(op20, 'time'), { kind: 'labour', minutes: 60 });
    await op2.json('POST', opPath(op20, 'time'), { kind: 'labour', minutes: 30, rework: true, note: 'Re-fit one bracket' });
    await op.json('POST', opPath(op20, 'report'), { kind: 'good', quantity: 10 });
    expect((await op.req('POST', opPath(op20, 'report'), { kind: 'downtime', minutes: 15 })).status).toBe(400);
    await op.json('POST', opPath(op20, 'report'), { kind: 'downtime', minutes: 15, reason: 'Jig adjustment' });
    // An inspection point needs its result before the operation completes (full Quality is Release 4).
    expect((await op.req('POST', opPath(op20, 'complete'), {})).status).toBe(409);
    expect((await op.req('POST', opPath(op20, 'inspection'), { result: 'fail' })).status).toBe(400);
    await op.json('POST', opPath(op20, 'inspection'), { result: 'pass', comment: 'Square and tight' });
    await op.json('POST', opPath(op20, 'complete'), {});
    expect((await op.req('POST', opPath(op30, 'complete'), {})).status).toBe(400);
    await pm.json('POST', opPath(op30, 'complete'), { actualOutsourceCents: 1800 });

    // 5. Report output into stock: finished goods at actual cost, partly, once per key, never beyond the order.
    expect((await wop.req('POST', erp(co, `/mos/${mo.id}/receive`), { quantity: 11, locationId: fg.id })).status).toBe(400);
    const r1 = await wop.json('POST', erp(co, `/mos/${mo.id}/receive`), { quantity: 4, locationId: fg.id, requestKey: 'gamma-fg-0001' });
    expect(r1).toMatchObject({ number: 'FGR-00001', valueCents: 17_513 });
    const again = await wop.json('POST', erp(co, `/mos/${mo.id}/receive`), { quantity: 4, locationId: fg.id, requestKey: 'gamma-fg-0001' });
    expect(again).toMatchObject({ id: r1.id, replayed: true });
    const r2 = await wop.json('POST', erp(co, `/mos/${mo.id}/receive`), { quantity: 6, locationId: fg.id });
    expect(r2.valueCents).toBe(26_270);
    expect(await totals(viewer, co, widget.id)).toMatchObject({ onHand: 10, valueCents: 43_783 });
    expect((await wop.req('POST', erp(co, `/mos/${mo.id}/receive`), { quantity: 1, locationId: fg.id })).status).toBe(400);

    // 6. Complete and close: costs final by element, variances recorded, nothing posted to Finance.
    expect((await op.req('POST', erp(co, `/mos/${mo.id}/complete`), {})).status).toBe(403);
    await pm.json('POST', erp(co, `/mos/${mo.id}/complete`), {});
    const closed = await pm.json('POST', erp(co, `/mos/${mo.id}/close`), {});
    expect(closed).toMatchObject({ status: 'closed', actualCents: 43_783, varianceCents: -2_137 });
    expect((await pm.req('POST', erp(co, `/mos/${mo.id}/close`), {})).status).toBe(409);
    const costs = await viewer.json('GET', erp(co, `/mos/${mo.id}/costs`));
    expect(costs.final).toBe(true);
    expect(Object.fromEntries(costs.elements.map((e: any) => [e.element, [e.estimatedCents, e.actualCents, e.varianceCents]]))).toEqual({
      materials: [5400, 5400, 0],
      labour: [24_000, 20_000, -4_000],
      machine: [4500, 4500, 0],
      outsourcing: [1500, 1800, 300],
      overheads: [10_500, 9583, -917],
      scrap: [20, 0, -20],
      rework: [0, 2500, 2500],
    });
    expect(costs).toMatchObject({ actualCents: 43_783, receivedValueCents: 43_783, unabsorbedCents: 0, actualUnitCents: 4378 });
    // Release 5: job profitability is real for orders made to order; this one was made to stock, so it has no revenue.
    expect(costs.profitability).toMatchObject({ linked: false });
    v = await viewer.json('GET', erp(co, `/mos/${mo.id}`));
    expect(v.integration.find((e: any) => e.kind === 'finance.production_variance')).toMatchObject({ status: 'planned', amountCents: 0 });
    expect(v.integration.filter((e: any) => e.kind === 'finance.production_posting').every((e: any) => e.status === 'planned')).toBe(true);
    expect(v.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['mo.created', 'mo.released', 'mo.issued', 'mo.returned', 'mo.inspection', 'mo.received', 'mo.completed', 'mo.closed']));
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_journals').first<{ n: number }>())!.n).toBe(before);
    expect((await op.req('POST', opPath(op20, 'time'), { kind: 'labour', minutes: 5 })).status).toBe(409);

    // Reports from the same records.
    const out = await viewer.json('GET', erp(co, '/reports/production-output'));
    expect(out.byProduct).toMatchObject([{ number: widget.number, quantity: 10, valueCents: 43_783, receipts: 2 }]);
    const mat = await viewer.json('GET', erp(co, '/reports/material-consumption'));
    expect(mat.rows.find((x: any) => x.productId === bolt.id)).toMatchObject({ issued: 42, returned: 2, net: 40, valueCents: 400 });
    const varr = await viewer.json('GET', erp(co, '/reports/production-variance'));
    expect(varr.rows).toMatchObject([{ number: 'MO-00001', estimatedCents: 45_920, actualCents: 43_783, varianceCents: -2_137 }]);
    const down = await viewer.json('GET', erp(co, '/reports/machine-downtime'));
    expect(down.byReason).toEqual([{ reason: 'Jig adjustment', minutes: 15 }]);
    const lab = await viewer.json('GET', erp(co, '/reports/labour-utilisation'));
    expect(lab.workCentres.find((w: any) => w.code === 'ASSY')).toMatchObject({ labourHours: 2.5, reworkHours: 0.5 });
    expect(lab.people.find((p: any) => p.userId === op2.userId)).toMatchObject({ labourHours: 1.5, reworkHours: 0.5 });
    const prog = await viewer.json('GET', erp(co, '/reports/work-order-progress?status=closed'));
    expect(prog.rows).toMatchObject([{ number: 'MO-00001', completedQty: 10, progressPct: 100, operations: '3 of 3' }]);
    for (const [path, header] of [
      ['/reports/production-output', 'Date,Receipt,Manufacturing order'],
      ['/reports/work-order-progress', 'Order,Product,Name,Status'],
      ['/reports/material-consumption', 'Product,Name,Unit,Issued'],
      ['/reports/labour-utilisation', 'Work centre,Name,Available hours'],
      ['/reports/production-variance', 'Order,Product,Name,Quantity'],
      ['/reports/machine-downtime', 'Date,Work centre,Machine'],
      ['/reports/mrp-suggestions', 'Kind,Product,Name,Quantity'],
      ['/reports/capacity-load', 'Work centre,Name,Week starting'],
      ['/mos', 'Number,Product,Name,Status'],
      ['/work-centres', 'Code,Name,Status'],
      ['/routings', 'Product,Name,Revision'],
      ['/mps?status=all', 'Product,Name,Quantity'],
      [`/mos/${mo.id}/costs`, 'Element,Estimated'],
    ]) {
      const res = await viewer.req('GET', erp(co, `${path}${path.includes('?') ? '&' : '?'}format=csv`));
      expect(res.status, path).toBe(200);
      expect((await res.text()).split('\n')[0], path).toContain(header);
    }

    // Segregation of duties on routing release: the author may not release their own routing in a company of many.
    const r2b = await approver.json('POST', erp(co, '/routings'), { productId: frame.id });
    await approver.json('POST', erp(co, `/routings/${r2b.id}/operations`), { name: 'Weld frame', workCentreId: cut.id, runMinutes: 4 });
    const own = await approver.req('POST', erp(co, `/routings/${r2b.id}/release`), {});
    expect(own.status).toBe(403);
    expect(((await own.json()) as any).error).toMatch(/segregation of duties/);
    expect(await approver2.json('POST', erp(co, `/routings/${r2b.id}/release`), {})).toMatchObject({ status: 'released' });
    // A copy of a released routing is a new draft; releasing it supersedes the earlier revision.
    const copy = await pm.json('POST', erp(co, `/routings/${r.id}/copy`), {});
    expect(copy.revision).toBe('B');
    await approver.json('POST', erp(co, `/routings/${copy.id}/release`), {});
    expect((await viewer.json('GET', erp(co, `/routings/${r.id}`))).routing.status).toBe('superseded');

    // MRP roles: buyers convert purchase suggestions, not manufacturing ones; operators run nothing.
    await pm.json('POST', erp(co, '/mps'), { productId: widget.id, quantity: 25, dueDate: day(30), kind: 'confirmed', reference: 'Order 7' });
    expect((await op.req('POST', erp(co, '/mrp/runs'), {})).status).toBe(403);
    expect((await buyer.req('POST', erp(co, '/mrp/runs'), {})).status).toBe(403);
    await pm.json('POST', erp(co, '/mrp/runs'), {});
    const run = await viewer.json('GET', erp(co, '/mrp/runs/latest'));
    const make = run.suggestions.find((s: any) => s.kind === 'make' && s.productId === widget.id);
    const buy = run.suggestions.find((s: any) => s.kind === 'buy' && s.productId === frame.id);
    expect(make).toMatchObject({ quantity: 15 });
    expect(buy).toMatchObject({ quantity: 13 });
    expect((await buyer.req('POST', erp(co, `/mrp/suggestions/${make.id}/convert`), {})).status).toBe(403);
    expect((await op.req('POST', erp(co, `/mrp/suggestions/${buy.id}/convert`), {})).status).toBe(403);
    expect(await buyer.json('POST', erp(co, `/mrp/suggestions/${buy.id}/convert`), {})).toMatchObject({ type: 'requisition', number: 'REQ-00001' });
    expect(await pm.json('POST', erp(co, `/mrp/suggestions/${make.id}/convert`), {})).toMatchObject({ type: 'manufacturing_order', number: 'MO-00002' });
  });
});

describe('Scenario C, last step: received, reserved and transferred stock issued to manufacturing', () => {
  it('receives goods, reserves them for an order, moves the rest and issues to the order', async () => {
    const p = await signup('Delta Maker');
    const co = await ownCompany(p);
    await p.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000 });
    const { bin1, bin2 } = await warehouse(p, co);
    const kit = await p.json('POST', erp(co, '/products'), { name: 'Kit', type: 'assembly' });
    const part = await p.json('POST', erp(co, '/products'), { name: 'Part', type: 'component' });
    await releaseBoms(p, p, co, [[kit.id, [[part.id, 1]]]]);
    const wc = await p.json('POST', erp(co, '/work-centres'), { code: 'W', name: 'Bench', labourRateCents: 4000 });
    await routing(p, p, co, kit.id, [{ name: 'Assemble', workCentreId: wc.id, runMinutes: 5 }]);
    const sup = await p.json('POST', erp(co, '/suppliers'), { legalName: 'Delta Supplies' });
    await p.json('POST', erp(co, `/suppliers/${sup.id}/status`), { status: 'approved' });
    // Receive stock.
    const po = await p.json('POST', erp(co, '/purchase-orders'), { supplierId: sup.id, lines: [{ productId: part.id, quantity: 10, unitPriceCents: 100 }] });
    await p.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    const line = (await p.json('GET', erp(co, `/purchase-orders/${po.id}`))).lines[0];
    await p.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: line.id, received: 10, locationId: bin1.id }] });
    // Reserve materials for a manufacturing order.
    const mo = await p.json('POST', erp(co, '/mos'), { productId: kit.id, quantity: 4 });
    await p.json('POST', erp(co, `/mos/${mo.id}/release`), { reserve: true });
    expect(await totals(p, co, part.id)).toMatchObject({ onHand: 10, reserved: 4, available: 6 });
    // Transfer stock: the unreserved six move; seven would take reserved stock with them.
    expect((await p.req('POST', erp(co, '/stock/transfer'), { productId: part.id, locationId: bin1.id, toLocationId: bin2.id, quantity: 7 })).status).toBe(409);
    await p.json('POST', erp(co, '/stock/transfer'), { productId: part.id, locationId: bin1.id, toLocationId: bin2.id, quantity: 6 });
    // Issue materials to manufacturing: the reserved four from the first bin, two more from the second.
    const v = await p.json('GET', erp(co, `/mos/${mo.id}`));
    await p.json('POST', erp(co, `/mos/${mo.id}/issue`), { lines: [{ materialId: v.materials[0].id, locationId: bin1.id, quantity: 4 }, { materialId: v.materials[0].id, locationId: bin2.id, quantity: 2 }] });
    expect(await totals(p, co, part.id)).toMatchObject({ onHand: 4, reserved: 0 });
    const after = await p.json('GET', erp(co, `/mos/${mo.id}`));
    expect(after.order.status).toBe('in_progress');
    expect(after.materials[0]).toMatchObject({ issuedQty: 6, reservedQty: 0, outstandingQty: 0 });
    const moves = await p.json('GET', erp(co, `/movements?source=manufacturing_order&sourceId=${mo.id}`));
    expect(moves.moves.filter((m: any) => m.type === 'production_issue').map((m: any) => m.quantity).sort()).toEqual([-2, -4]);
    expect(moves.moves.find((m: any) => m.type === 'production_issue').typeLabel).toBe('Issued to production');
  });
});

describe('manufacturing under concurrency', () => {
  it('lets one of two orders take the last unit, keeps reserved stock for its order, and stops over-completion', async () => {
    const p = await signup('Epsilon Maker');
    const co = await ownCompany(p);
    await p.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000 });
    await p.json('PUT', erp(co, '/mfg-settings'), { overCompletionPct: 10 });
    const { bin1, fg } = await warehouse(p, co);
    const prod = await p.json('POST', erp(co, '/products'), { name: 'Bracket', type: 'finished_product' });
    const z = await p.json('POST', erp(co, '/products'), { name: 'Last part', type: 'component', standardCostCents: 100 });
    await releaseBoms(p, p, co, [[prod.id, [[z.id, 1]]]]);
    const wc = await p.json('POST', erp(co, '/work-centres'), { code: 'W', name: 'Bench' });
    await routing(p, p, co, prod.id, [{ name: 'Make', workCentreId: wc.id, runMinutes: 1 }]);
    await stockIn(p, co, z.id, bin1.id, 1, 100);

    // Two orders, the last unit issued to both at the same moment: exactly one gets it.
    const a = await p.json('POST', erp(co, '/mos'), { productId: prod.id, quantity: 1 });
    const b = await p.json('POST', erp(co, '/mos'), { productId: prod.id, quantity: 1 });
    for (const m of [a, b]) await p.json('POST', erp(co, `/mos/${m.id}/release`), { reserve: false });
    const mat = async (m: any) => (await p.json('GET', erp(co, `/mos/${m.id}`))).materials[0].id;
    const both = await Promise.all([a, b].map(async (m) => p.req('POST', erp(co, `/mos/${m.id}/issue`), { lines: [{ materialId: await mat(m), locationId: bin1.id, quantity: 1 }] })));
    expect(both.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(await totals(p, co, z.id)).toMatchObject({ onHand: 0 });

    // Stock reserved for one order cannot be issued to another.
    await stockIn(p, co, z.id, bin1.id, 1, 100);
    const c1 = await p.json('POST', erp(co, '/mos'), { productId: prod.id, quantity: 1 });
    const c2 = await p.json('POST', erp(co, '/mos'), { productId: prod.id, quantity: 1 });
    await p.json('POST', erp(co, `/mos/${c1.id}/release`), { reserve: true });
    await p.json('POST', erp(co, `/mos/${c2.id}/release`), { reserve: false });
    expect((await p.req('POST', erp(co, `/mos/${c2.id}/issue`), { lines: [{ materialId: await mat(c2), locationId: bin1.id, quantity: 1 }] })).status).toBe(409);
    await p.json('POST', erp(co, `/mos/${c1.id}/issue`), { lines: [{ materialId: await mat(c1), locationId: bin1.id, quantity: 1 }] });

    // Over-completion: an order of 10 with a 10% tolerance completes at most 11, also when two receive at once.
    await stockIn(p, co, z.id, bin1.id, 20, 100);
    const big = await p.json('POST', erp(co, '/mos'), { productId: prod.id, quantity: 10 });
    expect((await p.json('GET', erp(co, `/mos/${big.id}`))).order.maxQty).toBe(11);
    await p.json('POST', erp(co, `/mos/${big.id}/release`), {});
    const o = (await p.json('GET', erp(co, `/mos/${big.id}`))).operations[0];
    await p.json('POST', erp(co, `/mos/${big.id}/operations/${o.id}/start`), {});
    await p.json('POST', erp(co, `/mos/${big.id}/operations/${o.id}/report`), { kind: 'good', quantity: 11 });
    expect((await p.req('POST', erp(co, `/mos/${big.id}/operations/${o.id}/report`), { kind: 'good', quantity: 1 })).status).toBe(400);
    const two = await Promise.all([1, 2].map(() => p.req('POST', erp(co, `/mos/${big.id}/receive`), { quantity: 6, locationId: fg.id })));
    // exactly one gets through: the other is refused by the check before it, or by the database's CHECK when both read at once
    expect(two.filter((r) => r.status === 201)).toHaveLength(1);
    expect([400, 409]).toContain(two.find((r) => r.status !== 201)!.status);
    await expect(env.DB.prepare('UPDATE erp_mfg_orders SET completed_qty = 12 WHERE id = ?').bind(big.id).run()).rejects.toThrow(/CHECK constraint failed/);
    await p.json('POST', erp(co, `/mos/${big.id}/receive`), { quantity: 5, locationId: fg.id });
    expect((await p.req('POST', erp(co, `/mos/${big.id}/receive`), { quantity: 1, locationId: fg.id })).status).toBe(400);
    expect((await p.json('GET', erp(co, `/mos/${big.id}`))).order.completedQty).toBe(11);
    // An order with work recorded cannot be cancelled.
    expect((await p.req('POST', erp(co, `/mos/${big.id}/cancel`), { reason: 'Changed plans' })).status).toBe(409);
    // A draft can be cancelled with a reason, and is then never released.
    const d = await p.json('POST', erp(co, '/mos'), { productId: prod.id, quantity: 3 });
    expect((await p.req('POST', erp(co, `/mos/${d.id}/cancel`), {})).status).toBe(400);
    expect(await p.json('POST', erp(co, `/mos/${d.id}/cancel`), { reason: 'Not needed' })).toMatchObject({ status: 'cancelled', cancelReason: 'Not needed' });
    expect((await p.req('POST', erp(co, `/mos/${d.id}/release`), {})).status).toBe(409);
  });
});

describe('MRP', () => {
  it('plans level by level with lead times, an open purchase order, a reservation, an open order, safety stock and lot sizes', async () => {
    const p = await signup('Zeta Planner');
    const co = await ownCompany(p);
    await p.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000 });
    const { bin1 } = await warehouse(p, co);
    const table = await p.json('POST', erp(co, '/products'), { name: 'Table', type: 'finished_product' });
    const top = await p.json('POST', erp(co, '/products'), { name: 'Top', type: 'subassembly' });
    const leg = await p.json('POST', erp(co, '/products'), { name: 'Leg', type: 'purchased_item' });
    const board = await p.json('POST', erp(co, '/products'), { name: 'Board', type: 'raw_material' });
    await releaseBoms(p, p, co, [
      [table.id, [[top.id, 1], [leg.id, 4]]],
      [top.id, [[board.id, 2, 10]]],
    ]);
    const wc = await p.json('POST', erp(co, '/work-centres'), { code: 'W', name: 'Workshop' });
    await routing(p, p, co, table.id, [{ name: 'Assemble', workCentreId: wc.id, runMinutes: 10 }], 2);
    await routing(p, p, co, top.id, [{ name: 'Glue up', workCentreId: wc.id, runMinutes: 20 }]);
    await p.json('PUT', erp(co, `/products/${top.id}/planning`), { mfgLeadDays: 1, orderMultiple: 5 });
    await p.json('PUT', erp(co, `/products/${board.id}/planning`), { purchaseLeadDays: 3, safetyStock: 5 });
    const sup = await p.json('POST', erp(co, '/suppliers'), { legalName: 'Zeta Legs' });
    await p.json('POST', erp(co, `/suppliers/${sup.id}/status`), { status: 'approved' });
    await p.json('PUT', erp(co, `/products/${leg.id}/suppliers/${sup.id}`), { leadTimeDays: 5, moq: 50, priceCents: 300, preferred: true });
    await stockIn(p, co, table.id, bin1.id, 2, 1000);
    await stockIn(p, co, leg.id, bin1.id, 10, 300);
    await stockIn(p, co, board.id, bin1.id, 3, 200);
    await p.json('POST', erp(co, '/reservations'), { productId: leg.id, locationId: bin1.id, quantity: 4, reference: 'Spares' });
    const po = await p.json('POST', erp(co, '/purchase-orders'), { supplierId: sup.id, requiredDate: day(25), lines: [{ productId: leg.id, quantity: 20, unitPriceCents: 300 }] });
    await p.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    await p.json('POST', erp(co, '/mos'), { productId: top.id, quantity: 1, requiredDate: day(4), startDate: day(1) });
    await p.json('POST', erp(co, '/mps'), { productId: table.id, quantity: 10, dueDate: day(20), kind: 'confirmed', reference: 'Cafe order' });
    await p.json('POST', erp(co, '/mps'), { productId: table.id, quantity: 5, dueDate: day(25), kind: 'forecast', reference: 'Next month' });
    await p.json('POST', erp(co, '/mps'), { productId: board.id, quantity: 1, dueDate: day(-1), kind: 'confirmed', reference: 'Spare board' });

    const run = await p.json('POST', erp(co, '/mrp/runs'), {});
    expect(run).toMatchObject({ number: 'MRP-00001', summary: { make: 2, buy: 5, expedite: 1, late: 3, overdue: 1 } });
    const v = await p.json('GET', erp(co, `/mrp/runs/${run.id}`));
    const pick = (s: any) => [s.kind, s.productNumber, s.quantity, s.needDate, s.orderDate, s.messages.join(' ')];
    expect(v.suggestions.map(pick)).toEqual([
      ['expedite', leg.number, 20, day(18), null, 'expedite'],
      ['make', top.number, 10, day(18), day(17), ''],
      ['make', table.number, 8, day(20), day(18), ''],
      ['buy', board.number, 1, day(-1), day(-4), 'late overdue'],
      ['buy', board.number, 2, day(0), day(-3), 'late'],
      ['buy', board.number, 2.2, day(1), day(-2), 'late'],
      ['buy', board.number, 22, day(17), day(14), ''],
      ['buy', leg.number, 50, day(18), day(13), ''],
    ]);
    expect(v.suggestions.find((s: any) => s.kind === 'expedite')).toMatchObject({ refNumber: po.number, refType: 'purchase_order' });
    expect(v.suggestions.find((s: any) => s.productId === leg.id && s.kind === 'buy')).toMatchObject({ supplierId: sup.id, leadTimeDays: 5 });
    const line = (id: string) => v.lines.find((l: any) => l.productId === id);
    expect(line(table.id)).toMatchObject({ level: 0, source: 'make', available: 2, grossRequirements: 10, plannedQty: 8, projectedEnd: 0 });
    expect(line(top.id)).toMatchObject({ level: 1, scheduledReceipts: 1, grossRequirements: 8, plannedQty: 10, projectedEnd: 3 });
    expect(line(leg.id)).toMatchObject({ level: 1, source: 'buy', onHand: 10, reserved: 4, available: 6, scheduledReceipts: 20, grossRequirements: 32, plannedQty: 50, projectedEnd: 44 });
    expect(line(board.id)).toMatchObject({ level: 2, available: 3, safetyStock: 5, grossRequirements: 25.2, plannedQty: 27.2, projectedEnd: 5 });
    // Each run is stored with its inputs: confirmed demand only (forecasts were not asked for).
    expect(v.run.inputs.demand).toHaveLength(2);
    expect(v.run.inputs.includeForecast).toBe(false);
    expect(v.run.inputs.purchaseOrders).toMatchObject([{ order: po.number, outstanding: 20, expected: day(25) }]);

    // Convert: the make suggestion to a draft order, the purchase suggestion to a submitted requisition; once each.
    const make = v.suggestions.find((s: any) => s.kind === 'make' && s.productId === top.id);
    const conv = await p.json('POST', erp(co, `/mrp/suggestions/${make.id}/convert`), {});
    expect(conv).toMatchObject({ type: 'manufacturing_order', number: 'MO-00002' });
    expect((await p.json('GET', erp(co, `/mos/${conv.id}`))).order).toMatchObject({ status: 'draft', quantity: 10, requiredDate: day(18), mrpSuggestionId: make.id });
    expect((await p.req('POST', erp(co, `/mrp/suggestions/${make.id}/convert`), {})).status).toBe(409);
    const buy = v.suggestions.find((s: any) => s.kind === 'buy' && s.productId === leg.id);
    const req = await p.json('POST', erp(co, `/mrp/suggestions/${buy.id}/convert`), {});
    const rv = await p.json('GET', erp(co, `/requisitions/${req.id}`));
    expect(rv.requisition).toMatchObject({ status: 'submitted', requiredDate: day(18), estimatedTotalCents: 15_000 });
    expect(rv.lines).toMatchObject([{ productId: leg.id, quantity: 50 }]);
    const exp = v.suggestions.find((s: any) => s.kind === 'expedite');
    expect((await p.req('POST', erp(co, `/mrp/suggestions/${exp.id}/convert`), {})).status).toBe(409);
    await p.json('POST', erp(co, `/mrp/suggestions/${exp.id}/dismiss`), { note: 'Asked the supplier to deliver earlier' });

    // With forecasts the next run plans five more tables; the earlier run's open suggestions give way to it.
    const second = await p.json('POST', erp(co, '/mrp/runs'), { includeForecast: true });
    const v2 = await p.json('GET', erp(co, `/mrp/runs/${second.id}`));
    expect(v2.run.inputs.demand).toHaveLength(3);
    expect(v2.suggestions.find((s: any) => s.kind === 'make' && s.productId === table.id && s.needDate === day(25))).toMatchObject({ quantity: 5 });
    const old = await p.json('GET', erp(co, `/mrp/runs/${run.id}`));
    expect(old.suggestions.filter((s: any) => s.status === 'open')).toHaveLength(0);
    expect(old.suggestions.filter((s: any) => s.status === 'converted')).toHaveLength(2);
  });
});

describe('rough-cut capacity', () => {
  it('loads each work centre per week with orders and planned orders against its available hours', async () => {
    const p = await signup('Eta Planner');
    const co = await ownCompany(p);
    const a = await p.json('POST', erp(co, '/products'), { name: 'Product A', type: 'finished_product' });
    const b = await p.json('POST', erp(co, '/products'), { name: 'Product B', type: 'finished_product' });
    const x = await p.json('POST', erp(co, '/products'), { name: 'Component X', type: 'component', standardCostCents: 50 });
    await releaseBoms(p, p, co, [
      [a.id, [[x.id, 1]]],
      [b.id, [[x.id, 1]]],
    ]);
    // Seven working days of 8 hours, one machine at full efficiency: 56 hours a week.
    const cap = await p.json('POST', erp(co, '/work-centres'), { code: 'CAP', name: 'Capacity cell', workingDays: [1, 2, 3, 4, 5, 6, 7], hoursPerDay: 8 });
    const idle = await p.json('POST', erp(co, '/work-centres'), { code: 'IDLE', name: 'Idle cell', hoursPerDay: 7.5, machines: 2, efficiencyPct: 80 });
    await routing(p, p, co, a.id, [{ name: 'Machine A', workCentreId: cap.id, setupMinutes: 60, runMinutes: 60 }]);
    await routing(p, p, co, b.id, [{ name: 'Machine B', workCentreId: cap.id, runMinutes: 60 }], 0);
    // An order of 60: (60 + 60 x 60) / 60 = 61 hours this week; MRP plans 6 of B: 6 hours.
    await p.json('POST', erp(co, '/mos'), { productId: a.id, quantity: 60, startDate: day(0), requiredDate: day(30) });
    await p.json('POST', erp(co, '/mps'), { productId: b.id, quantity: 6, dueDate: day(0), kind: 'confirmed' });
    await p.json('POST', erp(co, '/mrp/runs'), {});
    const load = await p.json('GET', erp(co, '/capacity?weeks=2'));
    const c = load.workCentres.find((w: any) => w.code === 'CAP');
    expect(c.weeks[0]).toMatchObject({ availableHours: 56, firmHours: 61, plannedHours: 6, loadHours: 67, loadPct: 120, overload: true });
    expect(c.weeks[1]).toMatchObject({ availableHours: 56, loadHours: 0, overload: false });
    // Five days of 7.5 hours, two machines at 80%: 60 hours.
    expect(load.workCentres.find((w: any) => w.id === idle.id).weeks[0]).toMatchObject({ availableHours: 60, loadHours: 0 });
    const rep = await p.json('GET', erp(co, '/reports/capacity-load?weeks=1'));
    expect(rep.workCentres.find((w: any) => w.code === 'CAP').weeks[0].overload).toBe(true);
  });
});

describe('isolation, roles and the shop floor', () => {
  it('keeps each company’s manufacturing to itself and shows the shop floor to every role', async () => {
    const t = await team('Theta');
    const { co, engineer, approver, pm, op, viewer } = t;
    const prod = await engineer.json('POST', erp(co, '/products'), { name: 'Panel', type: 'finished_product' });
    const sheet = await engineer.json('POST', erp(co, '/products'), { name: 'Sheet', type: 'raw_material', standardCostCents: 900 });
    await releaseBoms(engineer, approver, co, [[prod.id, [[sheet.id, 1]]]]);
    const wc = await pm.json('POST', erp(co, '/work-centres'), { code: 'PRS', name: 'Press' });
    await routing(pm, approver, co, prod.id, [{ name: 'Press', workCentreId: wc.id, runMinutes: 2, inspection: true }]);
    const mo = await pm.json('POST', erp(co, '/mos'), { productId: prod.id, quantity: 5 });
    await pm.json('POST', erp(co, `/mos/${mo.id}/release`), { reserve: false });

    const roles = await t.owner.json('GET', erp(co, '/roles'));
    expect(roles.roles.map((r: any) => r.value)).toEqual(expect.arrayContaining(['production_manager', 'production_operator']));
    expect((await viewer.json('GET', erp(co, '/me'))).can).toMatchObject({ 'manufacturing.view': true, 'production.plan': false, 'production.execute': false });
    expect((await op.json('GET', erp(co, '/me'))).can).toMatchObject({ 'production.execute': true, 'production.issue': true, 'production.plan': false, 'mrp.run': false });
    const denied = await viewer.req('POST', erp(co, '/mps'), { productId: prod.id, quantity: 1, dueDate: day(3), kind: 'confirmed' });
    expect(denied.status).toBe(403);
    expect(((await denied.json()) as any).error).toMatch(/production managers/);

    // Another company sees none of it: 404 on the company, and on these records from its own company.
    const other = await signup('Iota Outsider');
    const otherCo = await ownCompany(other);
    for (const path of [`/mos/${mo.id}`, '/mos', '/work-centres', '/shop-floor', '/mrp/runs/latest']) expect((await other.req('GET', erp(co, path))).status, path).toBe(404);
    expect((await other.req('GET', erp(otherCo, `/mos/${mo.id}`))).status).toBe(404);
    expect((await other.req('POST', erp(otherCo, `/mos/${mo.id}/release`), {})).status).toBe(404);
    expect((await other.req('GET', erp(otherCo, `/work-centres/${wc.id}`))).status).toBe(404);
    expect((await other.req('POST', erp(otherCo, '/mos'), { productId: prod.id, quantity: 1 })).status).toBe(404);

    // The shop floor: the job is ready at the press; once started it is current, with its inspection outstanding.
    let sf = await op.json('GET', erp(co, '/shop-floor'));
    let press = sf.workCentres.find((w: any) => w.code === 'PRS');
    expect(press.available).toMatchObject([{ moNumber: mo.number, opNo: 10, ready: true, planned: 5, goodQty: 0 }]);
    expect(sf.shortages).toMatchObject([{ moNumber: mo.number, items: [{ product: sheet.number, short: 5 }] }]);
    const opId = press.available[0].operationId;
    await op.json('POST', erp(co, `/mos/${mo.id}/operations/${opId}/start`), { timer: true });
    await op.json('POST', erp(co, `/mos/${mo.id}/operations/${opId}/report`), { kind: 'good', quantity: 2 });
    sf = await viewer.json('GET', erp(co, '/shop-floor'));
    press = sf.workCentres.find((w: any) => w.code === 'PRS');
    expect(press.current).toMatchObject([{ moNumber: mo.number, goodQty: 2, progressPct: 40 }]);
    expect(press.inspections).toHaveLength(1);
    expect(press.goodToday).toBe(2);
    expect((await op.json('GET', erp(co, '/shop-floor'))).workCentres.find((w: any) => w.code === 'PRS').current[0].myTimerRunning).toBe(true);
    // A second timer for the same person on the same operation is refused.
    expect((await op.req('POST', erp(co, `/mos/${mo.id}/operations/${opId}/time`), { kind: 'labour', action: 'start' })).status).toBe(409);
    await op.json('POST', erp(co, `/mos/${mo.id}/operations/${opId}/pause`), {});
    const v = await pm.json('GET', erp(co, `/mos/${mo.id}`));
    expect(v.time.filter((x: any) => x.running)).toHaveLength(0);
    // An amendment keeps the version before with its reason.
    expect((await pm.req('PATCH', erp(co, `/mos/${mo.id}`), { quantity: 8 })).status).toBe(400);
    const am = await pm.json('PATCH', erp(co, `/mos/${mo.id}`), { quantity: 8, reason: 'Customer added three' });
    expect(am).toMatchObject({ quantity: 8, revision: 2 });
    const v2 = await pm.json('GET', erp(co, `/mos/${mo.id}`));
    expect(v2.revisions).toMatchObject([{ revision: 1, reason: 'Customer added three', snapshot: { quantity: 5 } }]);
    expect(v2.materials[0].requiredQty).toBe(8);
  });
});

describe('a machine linked to a Maintenance asset', () => {
  it('shows the machine as down while its asset has an open breakdown work order', async () => {
    const p = await signup('Kappa Maker');
    const co = await ownCompany(p);
    const asset = await p.json('POST', `/api/maintenance/c/${co}/assets`, { number: 'MC-1', name: 'Lathe', category: 'Machine' });
    const wc = await p.json('POST', erp(co, '/work-centres'), { code: 'TURN', name: 'Turning' });
    const m = await p.json('POST', erp(co, '/machines'), { workCentreId: wc.id, code: 'LATHE-1', name: 'Lathe', assetId: asset.id });
    expect(m).toMatchObject({ down: false, asset: { number: 'MC-1' } });
    const wo = await p.json('POST', `/api/maintenance/c/${co}/work-orders`, { assetId: asset.id, description: 'Spindle seized', jobType: 'breakdown', priority: 'urgent' });
    const list = await p.json('GET', erp(co, '/work-centres'));
    expect(list.machines.find((x: any) => x.id === m.id)).toMatchObject({ down: true, breakdown: { id: wo.id } });
    const sf = await p.json('GET', erp(co, '/shop-floor'));
    expect(sf.workCentres.find((w: any) => w.code === 'TURN')).toMatchObject({ down: true });
    // Only this company's assets can be linked.
    const other = await signup('Lambda Outsider');
    const otherAsset = await other.json('POST', `/api/maintenance/c/${await ownCompany(other)}/assets`, { number: 'MC-9', name: 'Mill', category: 'Machine' });
    expect((await p.req('POST', erp(co, '/machines'), { workCentreId: wc.id, code: 'MILL', name: 'Mill', assetId: otherAsset.id })).status).toBe(400);
  });
});

describe('the example company', () => {
  it('gets work centres, released routings, an order in progress, a schedule and MRP suggestions, and loses them on removal', async () => {
    const ex = await signup('Example maker');
    const built = (await (await ex.req('POST', '/api/system/demo', {})).json()) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const wcs = await ex.json('GET', erp(co, '/work-centres'));
    expect(wcs.workCentres.map((w: any) => w.code)).toEqual(['ASSY', 'CUT', 'FAB']);
    expect(wcs.machines.filter((m: any) => m.asset)).toHaveLength(2);
    const routings = await ex.json('GET', erp(co, '/routings?status=released'));
    expect(routings.routings).toHaveLength(2);
    expect(routings.routings.every((r: any) => r.sodException)).toBe(true);
    const mos = await ex.json('GET', erp(co, '/mos'));
    expect(mos.orders).toMatchObject([{ number: 'MO-00001', status: 'in_progress', quantity: 10 }]);
    const mo = await ex.json('GET', erp(co, `/mos/${mos.orders[0].id}`));
    expect(mo.time.length).toBeGreaterThanOrEqual(3);
    expect(mo.materials.find((m: any) => m.issuedQty > 0)).toMatchObject({ issuedQty: 21 });
    expect(mo.operations.map((o: any) => o.status)).toEqual(['completed', 'in_progress', 'pending']);
    expect((await ex.json('GET', erp(co, '/mps'))).entries).toHaveLength(2);
    const run = await ex.json('GET', erp(co, '/mrp/runs/latest'));
    expect(run.suggestions.filter((s: any) => s.kind === 'make').length).toBeGreaterThan(0);
    expect(run.suggestions.filter((s: any) => s.kind === 'buy').length).toBeGreaterThan(0);
    // Release 2's example records are as they were: the bracket arms are still all on hand (ten reserved for the order).
    const stock = await ex.json('GET', erp(co, '/stock?filter=in_stock'));
    expect(stock.rows).toMatchObject([{ onHand: 40, reserved: 10, valueCents: 15_200 }]);
    await ex.json('POST', '/api/system/demo/remove', {});
    for (const table of ['erp_work_centres', 'erp_machines', 'erp_routings', 'erp_routing_operations', 'erp_mfg_orders', 'erp_mo_materials', 'erp_mo_operations', 'erp_mo_time', 'erp_mo_reports', 'erp_mo_reservations', 'erp_mps_entries', 'erp_mrp_runs', 'erp_mrp_suggestions', 'erp_mfg_settings', 'erp_product_planning', 'erp_stock_moves', 'erp_reservations']) {
      const n = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE company_id = ?`).bind(co).first<{ n: number }>();
      expect(n!.n, table).toBe(0);
    }
  });
});
