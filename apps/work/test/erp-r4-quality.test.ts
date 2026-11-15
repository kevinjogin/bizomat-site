// BIZOMAT ERP, Release 4 part A (src/worker/erp/quality.ts, ncr.ts, quality-reports.ts): quality management. The owner's
// Scenario E (perform an inspection, record the failure, raise an NCR, take corrective action, verify closure) runs end
// to end; the rest checks each rule the brief sets: an incoming inspection from a goods receipt with quarantine and
// release, an in-process inspection from a Release 3 inspection point (whose simple pass or fail keeps working), the
// pass or fail worked out from the limits, isolation between companies and the roles, segregation of duties on
// corrective actions, a disposition carried out once under a double submission, the same NCR dispositioned at the same
// moment, plan versions, the reports with exact numbers, and the example company.
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
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5, 6, 7, 8]);
type Who = 'engineer' | 'approver' | 'qm' | 'qm2' | 'inspector' | 'storeman' | 'buyer' | 'manager' | 'pm' | 'op' | 'viewer';

/** A registered company with the roles Release 4's quality uses. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company } = await registerCompany(owner, `${label} Works`);
  const co = company.id;
  const people = {} as Record<Who, Client>;
  for (const [key, role] of [
    ['engineer', 'engineer'],
    ['approver', 'engineering_approver'],
    ['qm', 'quality_manager'],
    ['qm2', 'quality_manager'],
    ['inspector', 'quality_inspector'],
    ['storeman', 'warehouse_manager'],
    ['buyer', 'buyer'],
    ['manager', 'procurement_manager'],
    ['pm', 'production_manager'],
    ['op', 'production_operator'],
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
  return {
    wh,
    store,
    bin1: await loc({ code: 'B1', parentId: store.id }),
    bin2: await loc({ code: 'B2', parentId: store.id }),
    quar: await loc({ code: 'QUAR', level: 'zone', kind: 'quarantine', parentId: store.id }),
    fg: await loc({ code: 'FG', level: 'zone', kind: 'finished_goods', parentId: store.id }),
  };
}

const totals = async (c: Client, co: string, productId: string) => (await c.json('GET', erp(co, `/products/${productId}/stock`))).totals as { onHand: number; reserved: number; available: number; quarantine: number; valueCents: number };

async function photo(c: Client, co: string, kind: string, id: string) {
  const fd = new FormData();
  fd.set('file', new File([PNG], 'reading.png', { type: 'image/png' }));
  fd.set('kind', kind);
  fd.set('id', id);
  return c.req('POST', erp(co, '/record-files'), fd);
}

/** A purchased, lot-tracked product that needs inspection, an approved supplier, and an order of `qty` received in one lot. */
async function received(t: { co: string; engineer: Client; buyer: Client; manager: Client; storeman: Client }, bin: { id: string }, qty: number, lot: string) {
  const { co, engineer, buyer, manager, storeman } = t;
  const shaft = await engineer.json('POST', erp(co, '/products'), { name: 'Drive shaft', type: 'purchased_item', standardCostCents: 1000 });
  await storeman.json('PUT', erp(co, `/products/${shaft.id}/stock-settings`), { trackLots: true, inspectionRequired: true });
  const sup = await buyer.json('POST', erp(co, '/suppliers'), { legalName: `Shafts ${lot}` });
  await manager.json('POST', erp(co, `/suppliers/${sup.id}/status`), { status: 'approved' });
  const po = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: sup.id, lines: [{ productId: shaft.id, quantity: qty, unitPriceCents: 1000 }] });
  await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
  if ((await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`))).purchaseOrder.status === 'awaiting_approval') await manager.json('POST', erp(co, `/purchase-orders/${po.id}/approve`), {});
  const line = (await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`))).lines[0];
  const gr = await storeman.json('POST', erp(co, `/purchase-orders/${po.id}/receipts`), { lines: [{ poLineId: line.id, received: qty, locationId: bin.id, lot }] });
  const rl = (await storeman.json('GET', erp(co, `/receipts/${gr.id}`))).lines[0];
  return { shaft, sup, po, gr, rl };
}

const SHAFT_CHARS = [
  { name: 'Diameter', kind: 'dimension', unit: 'mm', nominal: 20, tolerance: 0.05, sampleSize: 3 },
  { name: 'Length', kind: 'dimension', unit: 'mm', min: 99.5, max: 100.5, sampleSize: 2 },
  { name: 'Surface free of scratches', kind: 'visual', sampleSize: 1, photoRequired: true },
];

describe('Scenario E: perform inspection, record failure, raise NCR, corrective action, verify closure', () => {
  it('runs an incoming inspection to a closed NCR with its corrective action, quarantine, disposition and reports', async () => {
    const t = await team('Epsilon');
    const { owner, co, engineer, qm, qm2, inspector, storeman, op, viewer } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000, costingMethod: 'weighted_average' });
    const { bin1, quar } = await warehouse(storeman, co);
    const journals = (await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_journals').first<{ n: number }>())!.n;
    const { shaft, sup, gr, rl } = await received(t, bin1, 20, 'L-100');
    expect((await storeman.json('GET', erp(co, `/receipts/${gr.id}`))).inspectionNote).toMatch(/Quality/);

    // An inspection plan: drafted by an engineer, released only by a quality manager.
    expect((await inspector.req('POST', erp(co, '/qc-plans'), { name: 'Nope', kind: 'incoming', productId: shaft.id })).status).toBe(403);
    expect((await engineer.req('POST', erp(co, '/qc-plans'), { name: 'No limits', kind: 'incoming', productId: shaft.id, characteristics: [{ name: 'Bore', kind: 'dimension', unit: 'mm' }] })).status).toBe(400);
    const plan = await engineer.json('POST', erp(co, '/qc-plans'), { name: 'Incoming shafts', kind: 'incoming', productId: shaft.id, supplierId: sup.id, characteristics: SHAFT_CHARS });
    expect(plan).toMatchObject({ number: 'QP-00001', version: 1, status: 'draft', characteristics: 3 });
    const denied = await engineer.req('POST', erp(co, `/qc-plans/${plan.id}/release`), {});
    expect(denied.status).toBe(403);
    expect(((await denied.json()) as any).error).toMatch(/quality managers/);
    expect(await qm.json('POST', erp(co, `/qc-plans/${plan.id}/release`), { note: 'Agreed' })).toMatchObject({ status: 'released' });
    expect((await engineer.req('POST', erp(co, `/qc-plans/${plan.id}/characteristics`), { name: 'Late', kind: 'visual' })).status).toBe(409);

    // The receipt line waits for an inspection, with a plan for it.
    let ov = await viewer.json('GET', erp(co, '/quality/overview'));
    expect(ov.queue).toMatchObject([{ sourceType: 'receipt_line', sourceId: rl.id, quantity: 20, lot: 'L-100', planAvailable: true }]);
    expect((await viewer.json('GET', erp(co, '/operations'))).quality).toMatchObject({ toInspect: 1, openInspections: 0, openNcrs: 0 });

    // 1. Perform the inspection: an inspector starts it from the receipt line (twice: the same inspection).
    expect((await viewer.req('POST', erp(co, '/inspections'), { sourceType: 'receipt_line', sourceId: rl.id })).status).toBe(403);
    const qi = await inspector.json('POST', erp(co, '/inspections'), { sourceType: 'receipt_line', sourceId: rl.id });
    expect(qi).toMatchObject({ number: 'QI-00001', planLabel: 'QP-00001 v1 Incoming shafts', characteristics: 3 });
    expect(await inspector.json('POST', erp(co, '/inspections'), { sourceType: 'receipt_line', sourceId: rl.id })).toMatchObject({ id: qi.id, existing: true });
    let v = await inspector.json('GET', erp(co, `/inspections/${qi.id}`));
    expect(v.inspection).toMatchObject({ kind: 'incoming', status: 'open', quantity: 20, lot: 'L-100', supplierId: sup.id, receiptNumber: gr.number, locationId: bin1.id });
    const [dia, len, surf] = v.characteristics;
    expect(dia).toMatchObject({ lowerLimit: 19.95, upperLimit: 20.05, sampleSize: 3, limits: '20 ± 0.05 mm' });
    expect(len).toMatchObject({ lowerLimit: 99.5, upperLimit: 100.5, limits: '99.5 to 100.5 mm' });

    // 2. Record the failure: the server compares each reading with the limits; what the client says is ignored.
    v = await inspector.json('PUT', erp(co, `/inspections/${qi.id}/readings`), {
      readings: [
        { charId: dia.id, sampleNo: 1, value: 20.01 },
        { charId: dia.id, sampleNo: 2, value: 19.95 },
        { charId: dia.id, sampleNo: 3, value: 20.07, ok: true, result: 'pass' },
        { charId: len.id, sampleNo: 1, value: 100 },
        { charId: len.id, sampleNo: 2, value: 100.5 },
        { charId: surf.id, sampleNo: 1, conforming: true },
      ],
    });
    expect(v.characteristics[0].readings.map((r: any) => r.ok)).toEqual([true, true, false]);
    expect(v.characteristics.map((c: any) => c.status)).toEqual(['fail', 'pass', 'pass']);
    expect(v.summary).toMatchObject({ needed: 6, recorded: 6, failing: 1, soFar: 'fail' });
    expect((await inspector.req('PUT', erp(co, `/inspections/${qi.id}/readings`), { readings: [{ charId: len.id, sampleNo: 3, value: 100 }] })).status).toBe(400);
    expect((await viewer.req('PUT', erp(co, `/inspections/${qi.id}/readings`), { readings: [{ charId: len.id, sampleNo: 1, value: 100 }] })).status).toBe(403);
    // The photo the plan asks for is needed before completing.
    const missing = await inspector.req('POST', erp(co, `/inspections/${qi.id}/complete`), {});
    expect(missing.status).toBe(409);
    expect(((await missing.json()) as any).error).toMatch(/Surface free of scratches: a photo is needed/);
    expect((await photo(inspector, co, 'inspection_char', surf.id)).status).toBe(201);
    // Completed as failed, and the lot goes into quarantine in the same transaction.
    expect((await inspector.req('POST', erp(co, `/inspections/${qi.id}/complete`), { quarantine: { toLocationId: bin1.id } })).status).toBe(400);
    const done = await inspector.json('POST', erp(co, `/inspections/${qi.id}/complete`), { notes: 'One diameter over size', quarantine: { toLocationId: quar.id } });
    expect(done).toMatchObject({ result: 'failed', quarantined: 20, failing: ['Diameter'] });
    expect((await inspector.req('POST', erp(co, `/inspections/${qi.id}/complete`), {})).status).toBe(409);
    expect((await inspector.req('PUT', erp(co, `/inspections/${qi.id}/readings`), { readings: [{ charId: dia.id, sampleNo: 3, value: 20 }] })).status).toBe(409);
    expect(await totals(viewer, co, shaft.id)).toMatchObject({ onHand: 0, quarantine: 20 });
    v = await viewer.json('GET', erp(co, `/inspections/${qi.id}`));
    expect(v.inspection).toMatchObject({ status: 'completed', result: 'failed', quarantinedQty: 20, inspectorName: inspector.name });
    expect(v.characteristics.map((c: any) => c.result)).toEqual(['fail', 'pass', 'pass']);
    expect(v.characteristics[2].photos).toHaveLength(1);
    expect(v.can).toMatchObject({ record: false, raiseNcr: false, concession: false });
    expect((await viewer.json('GET', erp(co, '/quality/overview'))).queue).toEqual([]);

    // 3. Raise the NCR from the failed inspection (anyone who operates or inspects; not a viewer).
    expect((await viewer.req('POST', erp(co, '/ncrs'), { title: 'x', description: 'y', severity: 'major' })).status).toBe(403);
    expect((await op.req('POST', erp(co, '/ncrs'), { title: 'x', description: 'y', severity: 'huge' })).status).toBe(400);
    const ncr = await inspector.json('POST', erp(co, '/ncrs'), { title: 'Shaft diameter over size', description: 'Sample 3 measured 20.07 mm against 20 ± 0.05 mm.', severity: 'major', inspectionIds: [qi.id], requestKey: 'epsilon-ncr-0001' });
    expect(ncr.number).toBe('NCR-00001');
    expect(await inspector.json('POST', erp(co, '/ncrs'), { title: 'again', description: 'again', severity: 'major', requestKey: 'epsilon-ncr-0001' })).toMatchObject({ id: ncr.id, replayed: true });
    let n = await viewer.json('GET', erp(co, `/ncrs/${ncr.id}`));
    expect(n.ncr).toMatchObject({ status: 'open', productId: shaft.id, lot: 'L-100', quantity: 20, supplierId: sup.id, receiptId: gr.id, locationId: quar.id, locationIsQuarantine: true });
    expect(n.inspections.map((i: any) => i.number)).toEqual(['QI-00001']);
    // Containment and root cause (five whys).
    expect((await inspector.json('POST', erp(co, `/ncrs/${ncr.id}/contain`), { containment: 'Lot L-100 held in quarantine' })).status).toBe('contained');
    expect((await inspector.json('POST', erp(co, `/ncrs/${ncr.id}/investigate`), { method: 'five_whys', whys: ['The bar stock was over size', 'The supplier changed mill', 'The new mill was not qualified'] })).status).toBe('investigating');
    // The disposition: a quality manager only, once.
    expect((await inspector.req('POST', erp(co, `/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 1 }] })).status).toBe(403);
    expect((await qm.req('POST', erp(co, `/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 21 }] })).status).toBe(400);
    await qm.json('POST', erp(co, `/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'return_to_supplier', quantity: 5 }, { kind: 'scrap', quantity: 2 }, { kind: 'use_as_is', quantity: 13, note: 'Sorted: within the limits' }], note: 'Sorted 100%' });
    expect((await qm2.req('POST', erp(co, `/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 20 }] })).status).toBe(409);
    n = await qm.json('GET', erp(co, `/ncrs/${ncr.id}`));
    expect(n.ncr.status).toBe('dispositioned');
    const disp = (k: string) => n.dispositions.find((d: any) => d.kind === k);
    // Carried out through the stock service: return 5, scrap 2 (the same submission twice: once), release 13.
    expect((await qm.req('POST', erp(co, `/ncrs/${ncr.id}/actions`), { dispositionId: disp('scrap').id, action: 'release', quantity: 2, toLocationId: bin1.id, requestKey: 'epsilon-wrong-1' })).status).toBe(400);
    await qm.json('POST', erp(co, `/ncrs/${ncr.id}/actions`), { dispositionId: disp('return_to_supplier').id, action: 'supplier_return', quantity: 5, requestKey: 'epsilon-return-1' });
    const scrap = { dispositionId: disp('scrap').id, action: 'scrap', quantity: 2, requestKey: 'epsilon-scrap-1' };
    expect((await qm.req('POST', erp(co, `/ncrs/${ncr.id}/actions`), scrap)).status).toBe(201);
    expect(await qm.json('POST', erp(co, `/ncrs/${ncr.id}/actions`), scrap)).toMatchObject({ replayed: true });
    expect((await qm.req('POST', erp(co, `/ncrs/${ncr.id}/actions`), { ...scrap, requestKey: 'epsilon-scrap-2' })).status).toBe(409);
    await qm.json('POST', erp(co, `/ncrs/${ncr.id}/actions`), { dispositionId: disp('use_as_is').id, action: 'release', quantity: 13, toLocationId: bin1.id, requestKey: 'epsilon-release-1' });
    expect(await totals(viewer, co, shaft.id)).toMatchObject({ onHand: 13, quarantine: 0, valueCents: 13_000 });
    n = await qm.json('GET', erp(co, `/ncrs/${ncr.id}`));
    expect(n.actions.map((x: any) => [x.action, x.quantity, x.valueCents])).toEqual([
      ['supplier_return', 5, -5000],
      ['scrap', 2, -2000],
      ['release', 13, 0],
    ]);
    expect(n.dispositions.every((d: any) => d.remaining === 0)).toBe(true);

    // 4. Corrective action: proposed by the inspector for the engineer, approved by a quality manager.
    expect((await viewer.req('POST', erp(co, '/capas'), { kind: 'corrective', title: 'x', responsibleId: engineer.userId })).status).toBe(403);
    const capa = await inspector.json('POST', erp(co, '/capas'), { kind: 'corrective', ncrId: ncr.id, title: 'Qualify the new mill', description: 'First-article check of the new mill’s bar stock', responsibleId: engineer.userId, dueDate: day(-2) });
    expect(capa).toMatchObject({ number: 'CA-00001', status: 'proposed', overdue: true, daysOverdue: 2 });
    expect((await viewer.json('GET', erp(co, `/ncrs/${ncr.id}`))).ncr.status).toBe('capa');
    ov = await viewer.json('GET', erp(co, '/quality/overview'));
    expect(ov.overdueCapas.map((x: any) => x.number)).toEqual(['CA-00001']);
    expect((await engineer.json('GET', erp(co, '/quality/overview'))).myCapas.map((x: any) => x.number)).toEqual(['CA-00001']);
    expect((await qm.req('POST', erp(co, `/ncrs/${ncr.id}/to-verification`), {})).status).toBe(409);
    expect((await engineer.req('POST', erp(co, `/capas/${capa.id}/approve`), {})).status).toBe(403);
    expect(await qm.json('POST', erp(co, `/capas/${capa.id}/approve`), { note: 'Go ahead' })).toMatchObject({ status: 'approved', sodException: false });
    expect((await viewer.req('POST', erp(co, `/capas/${capa.id}/start`), {})).status).toBe(403);
    await engineer.json('POST', erp(co, `/capas/${capa.id}/start`), {});
    expect((await photo(engineer, co, 'capa', capa.id)).status).toBe(201);
    await engineer.json('POST', erp(co, `/capas/${capa.id}/done`), { note: 'Three bars from the new mill measured and approved' });
    expect((await engineer.req('POST', erp(co, `/capas/${capa.id}/verify`), { effective: true, note: 'x' })).status).toBe(403);
    expect(await qm.json('POST', erp(co, `/capas/${capa.id}/verify`), { effective: false, note: 'Next delivery still over size' })).toMatchObject({ status: 'in_progress' });
    await engineer.json('POST', erp(co, `/capas/${capa.id}/done`), { note: 'Mill re-set; next delivery checked' });
    await qm.json('POST', erp(co, `/capas/${capa.id}/verify`), { effective: true, note: 'Two deliveries within the limits' });
    expect(await qm.json('POST', erp(co, `/capas/${capa.id}/close`), {})).toMatchObject({ status: 'closed', sodException: false });

    // 5. Verify closure: once the disposition is carried out and the action verified, a quality manager closes the NCR.
    await qm.json('POST', erp(co, `/ncrs/${ncr.id}/to-verification`), {});
    expect((await inspector.req('POST', erp(co, `/ncrs/${ncr.id}/close`), { verificationNote: 'x' })).status).toBe(403);
    expect((await qm.req('POST', erp(co, `/ncrs/${ncr.id}/close`), {})).status).toBe(400);
    await qm.json('POST', erp(co, `/ncrs/${ncr.id}/close`), { verificationNote: 'Two later deliveries passed incoming inspection' });
    n = await viewer.json('GET', erp(co, `/ncrs/${ncr.id}`));
    expect(n.ncr).toMatchObject({ status: 'closed', closedByName: qm.name, verificationNote: 'Two later deliveries passed incoming inspection' });
    expect(n.capas).toMatchObject([{ number: 'CA-00001', status: 'closed', effective: true }]);
    expect(n.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['ncr.raised', 'ncr.contained', 'ncr.investigated', 'ncr.dispositioned', 'ncr.supplier_return', 'ncr.scrap', 'ncr.release', 'ncr.capa', 'ncr.verification', 'ncr.closed']));
    const capaView = await viewer.json('GET', erp(co, `/capas/${capa.id}`));
    expect(capaView.files).toHaveLength(1);
    expect(capaView.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['capa.proposed', 'capa.approved', 'capa.started', 'capa.done', 'capa.not_effective', 'capa.verified', 'capa.closed']));

    // Traceability: the lot's inspections and NCRs with its movements.
    const tr = await viewer.json('GET', erp(co, `/trace?productId=${shaft.id}&lot=L-100`));
    expect(tr.quality.inspections.map((i: any) => [i.number, i.result])).toEqual([['QI-00001', 'failed']]);
    expect(tr.quality.ncrs.map((x: any) => [x.number, x.status])).toEqual([['NCR-00001', 'closed']]);
    expect(tr.moves.map((m: any) => m.type)).toEqual(['receipt', 'quarantine_out', 'quarantine_in', 'supplier_return', 'scrap', 'release_out', 'release_in']);

    // Reports with exact numbers, each with its CSV.
    const r1 = await viewer.json('GET', erp(co, '/reports/inspection-results'));
    expect(r1.totals).toEqual({ completed: 1, passed: 0, failed: 1, conditional: 0, passRatePct: 0 });
    expect(r1.rows).toMatchObject([{ number: 'QI-00001', resultLabel: 'Failed', failedCharacteristics: 1, quantity: 20 }]);
    const r2 = await viewer.json('GET', erp(co, '/reports/rejection-rates'));
    expect(r2.byProduct).toMatchObject([{ id: shaft.id, inspections: 1, failed: 1, inspectedQty: 20, rejectedQty: 20, rejectionRatePct: 100, quantityRatePct: 100 }]);
    expect(r2.bySupplier).toMatchObject([{ id: sup.id, inspections: 1, failed: 1, rejectionRatePct: 100 }]);
    const r3 = await viewer.json('GET', erp(co, '/reports/supplier-defects'));
    expect(r3.rows).toMatchObject([{ supplierId: sup.id, receipts: 1, receivedQty: 20, refusedAtReceiptQty: 0, inspections: 1, failedInspections: 1, rejectedQty: 20, defectRatePct: 100, ncrs: 1, openNcrs: 0, affectedQty: 20, returnedQty: 5, returnedValueCents: 5000 }]);
    const r4 = await viewer.json('GET', erp(co, '/reports/ncr-register'));
    expect(r4.rows).toMatchObject([{ number: 'NCR-00001', statusLabel: 'Closed', disposition: 'Return to supplier 5, Scrap 2, Use as is 13', capas: 1, ageDays: 0 }]);
    expect(r4.openCount).toBe(0);
    const r5 = await viewer.json('GET', erp(co, '/reports/capa-status'));
    expect(r5.byStatus.find((s: any) => s.status === 'closed').count).toBe(1);
    expect(r5.overdue).toEqual([]);
    const r6 = await viewer.json('GET', erp(co, '/reports/cost-of-poor-quality'));
    expect(r6.totals).toEqual({ scrapCents: 2000, reworkCents: 0, internalFailureCents: 2000 });
    expect(r6.scrap).toMatchObject([{ source: 'ncr', quantity: 2, valueCents: 2000 }]);
    expect(r6.returnedToSuppliers).toMatchObject({ quantity: 5, valueCents: 5000 });
    for (const [path, header] of [
      ['/reports/inspection-results', 'Date,Inspection,Kind,Result'],
      ['/reports/rejection-rates?by=supplier', 'Supplier,Name,Inspections'],
      ['/reports/supplier-defects', 'Supplier,Name,Receipts'],
      ['/reports/ncr-register', 'NCR,Title,Severity'],
      ['/reports/capa-status', 'Action,Kind,Title'],
      ['/reports/rework', 'Source,Date,Record'],
      ['/reports/cost-of-poor-quality', 'Element,Product,Name'],
      ['/inspections', 'Inspection,Kind,Status'],
      ['/ncrs', 'NCR,Title,Severity'],
      ['/capas', 'Action,Kind,Title'],
      ['/qc-plans', 'Plan,Version,Name'],
    ]) {
      const res = await viewer.req('GET', erp(co, `${path}${path.includes('?') ? '&' : '?'}format=csv`));
      expect(res.status, path).toBe(200);
      expect((await res.text()).split('\n')[0], path).toContain(header);
    }
    // Supplier performance shows quality read only.
    expect((await viewer.json('GET', erp(co, `/suppliers/${sup.id}`))).quality).toMatchObject({ inspections: 1, failedInspections: 1, ncrs: 1, openNcrs: 0, returnedQty: 5 });
    // Nothing is written to Finance.
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_journals').first<{ n: number }>())!.n).toBe(journals);
  });
});

describe('quarantine and release of an incoming lot', () => {
  it('quarantines a failed lot, accepts it on condition, and releases it once per key', async () => {
    const t = await team('Zeta');
    const { owner, co, engineer, qm, inspector, storeman, viewer } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000 });
    const { bin1, bin2, quar } = await warehouse(storeman, co);
    const { shaft, rl } = await received(t, bin1, 10, 'L-7');
    // No plan: the inspector adds a characteristic by hand.
    const qi = await inspector.json('POST', erp(co, '/inspections'), { sourceType: 'receipt_line', sourceId: rl.id });
    expect(qi).toMatchObject({ planLabel: null, characteristics: 0 });
    expect((await inspector.req('POST', erp(co, `/inspections/${qi.id}/complete`), {})).status).toBe(409);
    await inspector.json('POST', erp(co, `/inspections/${qi.id}/characteristics`), { name: 'Hardness', kind: 'measured', unit: 'HRC', min: 40, sampleSize: 2 });
    const ch = (await inspector.json('GET', erp(co, `/inspections/${qi.id}`))).characteristics[0];
    expect(ch).toMatchObject({ lowerLimit: 40, upperLimit: null, limits: 'at least 40 HRC' });
    // Quarantine while open, part of the lot, once per key.
    const q = { toLocationId: quar.id, quantity: 4, requestKey: 'zeta-quarantine-1' };
    expect((await inspector.req('POST', erp(co, `/inspections/${qi.id}/quarantine`), { ...q, toLocationId: bin2.id })).status).toBe(400);
    expect((await inspector.req('POST', erp(co, `/inspections/${qi.id}/quarantine`), q)).status).toBe(201);
    expect(await inspector.json('POST', erp(co, `/inspections/${qi.id}/quarantine`), q)).toMatchObject({ replayed: true });
    expect((await inspector.req('POST', erp(co, `/inspections/${qi.id}/quarantine`), { ...q, quantity: 7, requestKey: 'zeta-quarantine-2' })).status).toBe(409);
    await inspector.json('POST', erp(co, `/inspections/${qi.id}/quarantine`), { ...q, quantity: 6, requestKey: 'zeta-quarantine-3' });
    expect(await totals(viewer, co, shaft.id)).toMatchObject({ onHand: 0, quarantine: 10 });
    await inspector.json('PUT', erp(co, `/inspections/${qi.id}/readings`), { readings: [{ charId: ch.id, sampleNo: 1, value: 42 }, { charId: ch.id, sampleNo: 2, value: 39.5 }] });
    expect(await inspector.json('POST', erp(co, `/inspections/${qi.id}/complete`), {})).toMatchObject({ result: 'failed', quarantined: 0 });
    // A failed lot is released only through a disposition or a quality manager's conditional acceptance.
    expect((await qm.req('POST', erp(co, `/inspections/${qi.id}/release`), { fromLocationId: quar.id, toLocationId: bin2.id, quantity: 10, requestKey: 'zeta-release-0' })).status).toBe(409);
    expect((await inspector.req('POST', erp(co, `/inspections/${qi.id}/concession`), { note: 'x' })).status).toBe(403);
    await qm.json('POST', erp(co, `/inspections/${qi.id}/concession`), { note: 'Customer accepts 39.5 HRC for this batch' });
    const rel = { fromLocationId: quar.id, toLocationId: bin2.id, quantity: 10, requestKey: 'zeta-release-1' };
    expect((await engineer.req('POST', erp(co, `/inspections/${qi.id}/release`), rel)).status).toBe(403);
    expect((await qm.req('POST', erp(co, `/inspections/${qi.id}/release`), { ...rel, quantity: 11, requestKey: 'zeta-release-x' })).status).toBe(409);
    const [x1, x2] = await Promise.all([qm.req('POST', erp(co, `/inspections/${qi.id}/release`), rel), qm.req('POST', erp(co, `/inspections/${qi.id}/release`), rel)]);
    expect([x1.status, x2.status].sort()).toEqual([200, 201]);
    expect(await totals(viewer, co, shaft.id)).toMatchObject({ onHand: 10, quarantine: 0 });
    const v = await viewer.json('GET', erp(co, `/inspections/${qi.id}`));
    expect(v.inspection).toMatchObject({ result: 'conditional', resultLabel: 'Accepted on condition', quarantinedQty: 10, releasedQty: 10, concessionByName: qm.name });
    const moves = await viewer.json('GET', erp(co, `/movements?productId=${shaft.id}`));
    expect(moves.moves.filter((m: any) => m.type === 'release_in').map((m: any) => m.quantity)).toEqual([10]);
    const r = await viewer.json('GET', erp(co, '/reports/inspection-results'));
    expect(r.totals).toMatchObject({ completed: 1, failed: 0, conditional: 1 });
    expect((await viewer.json('GET', erp(co, '/reports/rejection-rates'))).byProduct[0]).toMatchObject({ conditional: 1, failed: 0, rejectedQty: 0, rejectionRatePct: 0 });
  });
});

describe('in-process and final inspections from manufacturing', () => {
  it('links a full inspection to a Release 3 inspection point, keeps the simple pass or fail working, and offers final inspections', async () => {
    const p = await signup('Eta Maker');
    const co = await ownCompany(p);
    await p.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, costingMethod: 'weighted_average' });
    const { bin1, fg } = await warehouse(p, co);
    const bracket = await p.json('POST', erp(co, '/products'), { name: 'Welded bracket', type: 'finished_product' });
    const plate = await p.json('POST', erp(co, '/products'), { name: 'Plate', type: 'raw_material', standardCostCents: 200 });
    const rev = (await p.json('GET', erp(co, `/products/${bracket.id}`))).revisions[0];
    await p.json('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId: plate.id, quantity: 1 });
    const eco = await p.json('POST', erp(co, '/change-orders'), { title: 'Release', reason: 'Ready', productIds: [bracket.id] });
    for (const step of ['submit', 'approve', 'release']) await p.json('POST', erp(co, `/change-orders/${eco.id}/${step}`), {});
    await p.json('POST', erp(co, '/adjustments'), { productId: plate.id, locationId: bin1.id, quantity: 10, unitCostCents: 200, reason: 'Opening stock' });
    const wc = await p.json('POST', erp(co, '/work-centres'), { code: 'WELD', name: 'Welding', labourRateCents: 6000 });
    const r = await p.json('POST', erp(co, '/routings'), { productId: bracket.id });
    await p.json('POST', erp(co, `/routings/${r.id}/operations`), { opNo: 10, name: 'Weld', workCentreId: wc.id, runMinutes: 5, inspection: true, inspectionNote: 'Weld size' });
    await p.json('POST', erp(co, `/routings/${r.id}/operations`), { opNo: 20, name: 'Check', workCentreId: wc.id, runMinutes: 1, inspection: true });
    await p.json('POST', erp(co, `/routings/${r.id}/release`), {});
    // An in-process plan for operation 10 of this routing; a final plan for the product.
    const ip = await p.json('POST', erp(co, '/qc-plans'), { name: 'Weld size', kind: 'in_process', productId: bracket.id, routingId: r.id, opNo: 10, characteristics: [{ name: 'Fillet size', kind: 'dimension', unit: 'mm', min: 4, max: 6, sampleSize: 2 }] });
    expect((await p.req('POST', erp(co, '/qc-plans'), { name: 'Bad op', kind: 'in_process', productId: bracket.id, routingId: r.id, opNo: 99 })).status).toBe(400);
    await p.json('POST', erp(co, `/qc-plans/${ip.id}/release`), {});
    const mo = await p.json('POST', erp(co, '/mos'), { productId: bracket.id, quantity: 5 });
    await p.json('POST', erp(co, `/mos/${mo.id}/release`), { reserve: true });
    let v = await p.json('GET', erp(co, `/mos/${mo.id}`));
    await p.json('POST', erp(co, `/mos/${mo.id}/issue`), { lines: [{ materialId: v.materials[0].id, locationId: bin1.id, quantity: 5 }] });
    const [op10, op20] = v.operations;
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/start`), {});
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/time`), { kind: 'labour', minutes: 30, rework: true, note: 'Re-weld one bracket' });
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/report`), { kind: 'good', quantity: 5 });
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/report`), { kind: 'rework', quantity: 1, reason: 'Undercut' });
    // The inspection point waits in the queue; the full inspection finds the plan for that routing operation.
    expect((await p.json('GET', erp(co, '/quality/overview'))).queue).toMatchObject([{ sourceType: 'mo_operation', sourceId: op10.id, planAvailable: true }]);
    expect((await p.req('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/complete`), {})).status).toBe(409);
    const qi = await p.json('POST', erp(co, '/inspections'), { sourceType: 'mo_operation', sourceId: op10.id });
    expect(qi).toMatchObject({ planLabel: 'QP-00001 v1 Weld size', characteristics: 1 });
    const ch = (await p.json('GET', erp(co, `/inspections/${qi.id}`))).characteristics[0];
    expect((await p.json('GET', erp(co, `/inspections/${qi.id}`))).inspection).toMatchObject({ kind: 'in_process', moNumber: mo.number, opNo: 10, quantity: 5 });
    await p.json('PUT', erp(co, `/inspections/${qi.id}/readings`), { readings: [{ charId: ch.id, sampleNo: 1, value: 4 }, { charId: ch.id, sampleNo: 2, value: 6 }] });
    expect(await p.json('POST', erp(co, `/inspections/${qi.id}/complete`), {})).toMatchObject({ result: 'passed' });
    v = await p.json('GET', erp(co, `/mos/${mo.id}`));
    expect(v.operations[0]).toMatchObject({ inspectionResult: 'pass', inspectionComment: `${qi.number}: passed` });
    expect(v.inspections).toMatchObject([{ number: qi.number, operationId: op10.id, result: 'passed' }]);
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op10.id}/complete`), {});
    // Release 3's simple pass or fail at operation 20 keeps working.
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op20.id}/start`), {});
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op20.id}/report`), { kind: 'good', quantity: 5 });
    expect((await p.req('POST', erp(co, `/mos/${mo.id}/operations/${op20.id}/inspection`), { result: 'fail' })).status).toBe(400);
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op20.id}/inspection`), { result: 'pass', comment: 'Visual' });
    await p.json('POST', erp(co, `/mos/${mo.id}/operations/${op20.id}/complete`), {});
    // A final plan: finished goods received after it is released wait for a final inspection.
    const fp = await p.json('POST', erp(co, '/qc-plans'), { name: 'Final bracket check', kind: 'final', productId: bracket.id, characteristics: [{ name: 'Square', kind: 'attribute', sampleSize: 1 }] });
    await p.json('POST', erp(co, `/qc-plans/${fp.id}/release`), {});
    const fgr = await p.json('POST', erp(co, `/mos/${mo.id}/receive`), { quantity: 5, locationId: fg.id });
    const ov = await p.json('GET', erp(co, '/quality/overview'));
    expect(ov.queue).toMatchObject([{ sourceType: 'fg_receipt', sourceId: fgr.id, kind: 'final', quantity: 5 }]);
    const fi = await p.json('POST', erp(co, '/inspections'), { sourceType: 'fg_receipt', sourceId: fgr.id });
    expect(fi).toMatchObject({ planLabel: 'QP-00002 v1 Final bracket check', characteristics: 1 });
    const fch = (await p.json('GET', erp(co, `/inspections/${fi.id}`))).characteristics[0];
    expect((await p.req('PUT', erp(co, `/inspections/${fi.id}/readings`), { readings: [{ charId: fch.id, sampleNo: 1, value: 1 }] })).status).toBe(400);
    await p.json('PUT', erp(co, `/inspections/${fi.id}/readings`), { readings: [{ charId: fch.id, sampleNo: 1, conforming: false }] });
    expect(await p.json('POST', erp(co, `/inspections/${fi.id}/complete`), { quarantine: { toLocationId: (await warehouseQuar(p, co)).id, quantity: 5 } })).toMatchObject({ result: 'failed', quarantined: 5 });
    // Rework from the shop floor in the rework report and the cost of poor quality: 30 minutes at 60.00 = 30.00.
    const rw = await p.json('GET', erp(co, '/reports/rework'));
    expect(rw.totals).toEqual({ reworkedQty: 1, hours: 0.5, costCents: 3000, ncrQty: 0 });
    expect(rw.shopFloor).toMatchObject([{ moNumber: mo.number, opNo: 10, quantity: 1, reason: 'Undercut' }]);
    expect((await p.json('GET', erp(co, '/reports/cost-of-poor-quality'))).totals).toEqual({ scrapCents: 0, reworkCents: 3000, internalFailureCents: 3000 });
    const res = await p.json('GET', erp(co, '/reports/inspection-results'));
    expect(res.byKind.map((k: any) => [k.kind, k.completed, k.passed, k.failed])).toEqual([
      ['in_process', 1, 1, 0],
      ['final', 1, 0, 1],
    ]);
  });
});

/** The quarantine location of the warehouse made by warehouse() (a person's own company). */
async function warehouseQuar(c: Client, co: string) {
  return (await c.json('GET', erp(co, '/quality-options'))).locations.find((l: any) => l.quarantine) as { id: string };
}

describe('dispositions under concurrency and repeated requests', () => {
  it('lets one of two simultaneous dispositions through and carries out a disposition once per key and never beyond it', async () => {
    const t = await team('Theta');
    const { owner, co, qm, qm2, inspector, storeman } = t;
    await owner.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, poApprovalLimitCents: 100_000_000 });
    const { bin1, quar } = await warehouse(storeman, co);
    const { shaft } = await received(t, bin1, 6, 'L-9');
    const ncr = await inspector.json('POST', erp(co, '/ncrs'), { title: 'Dented', description: 'Six dented in transit', severity: 'minor', productId: shaft.id, lot: 'L-9', quantity: 6, locationId: bin1.id });
    await inspector.json('POST', erp(co, `/ncrs/${ncr.id}/contain`), { containment: 'Moved to quarantine', quarantine: { toLocationId: quar.id, quantity: 6 }, requestKey: 'theta-contain-1' });
    expect(await totals(qm, co, shaft.id)).toMatchObject({ onHand: 0, quarantine: 6 });
    // Two quality managers decide the disposition at the same moment: one decision stands.
    const [a, b] = await Promise.all([
      qm.req('POST', erp(co, `/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 3 }, { kind: 'use_as_is', quantity: 3 }] }),
      qm2.req('POST', erp(co, `/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 6 }] }),
    ]);
    expect([a.status, b.status].sort()).toEqual([200, 409]);
    const n = await qm.json('GET', erp(co, `/ncrs/${ncr.id}`));
    expect(n.dispositions.length).toBe(a.status === 200 ? 2 : 1);
    const scrapLine = n.dispositions.find((d: any) => d.kind === 'scrap');
    // The same scrap submitted twice at once: one scrap.
    const body = { dispositionId: scrapLine.id, action: 'scrap', quantity: 2, requestKey: 'theta-scrap-double' };
    const twice = await Promise.all([qm.req('POST', erp(co, `/ncrs/${ncr.id}/actions`), body), qm.req('POST', erp(co, `/ncrs/${ncr.id}/actions`), body)]);
    expect(twice.map((r) => r.status).sort()).toEqual([200, 201]);
    const scraps = await env.DB.prepare("SELECT COUNT(*) AS n, SUM(on_hand_delta) AS q FROM erp_stock_moves WHERE company_id = ? AND move_type = 'scrap' AND source_id = ?").bind(co, ncr.id).first<{ n: number; q: number }>();
    expect(scraps).toEqual({ n: 1, q: -2 });
    // Two different submissions for more than is left at the same moment: one goes through.
    const left = scrapLine.quantity - 2;
    const race = await Promise.all([1, 2].map((i) => (i === 1 ? qm : qm2).req('POST', erp(co, `/ncrs/${ncr.id}/actions`), { dispositionId: scrapLine.id, action: 'scrap', quantity: left, requestKey: `theta-scrap-race-${i}` })));
    expect(race.map((r) => r.status).sort()).toEqual([201, 409]);
    const d = (await qm.json('GET', erp(co, `/ncrs/${ncr.id}`))).dispositions.find((x: any) => x.kind === 'scrap');
    expect(d).toMatchObject({ doneQty: scrapLine.quantity, remaining: 0 });
    expect(await totals(qm, co, shaft.id)).toMatchObject({ quarantine: 6 - scrapLine.quantity });
    // The database itself refuses doing more than was decided.
    await expect(env.DB.prepare('UPDATE erp_qc_dispositions SET done_qty = quantity + 1 WHERE company_id = ? AND id = ?').bind(co, scrapLine.id).run()).rejects.toThrow(/CHECK constraint failed/);
    // An inspection completed twice at the same moment is completed once.
    const plan = await qm.json('POST', erp(co, '/qc-plans'), { name: 'Visual', kind: 'product', productId: shaft.id, characteristics: [{ name: 'Clean', kind: 'visual' }] });
    await qm.json('POST', erp(co, `/qc-plans/${plan.id}/release`), {});
    const qi = await inspector.json('POST', erp(co, '/inspections'), { sourceType: 'manual', kind: 'product', productId: shaft.id, requestKey: 'theta-manual-qi-1' });
    expect(await inspector.json('POST', erp(co, '/inspections'), { sourceType: 'manual', kind: 'product', productId: shaft.id, requestKey: 'theta-manual-qi-1' })).toMatchObject({ id: qi.id, existing: true });
    const ch = (await inspector.json('GET', erp(co, `/inspections/${qi.id}`))).characteristics[0];
    await inspector.json('PUT', erp(co, `/inspections/${qi.id}/readings`), { readings: [{ charId: ch.id, sampleNo: 1, conforming: true }] });
    const both = await Promise.all([inspector.req('POST', erp(co, `/inspections/${qi.id}/complete`), {}), qm.req('POST', erp(co, `/inspections/${qi.id}/complete`), {})]);
    expect(both.map((r) => r.status).sort()).toEqual([200, 409]);
    const events = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_events WHERE company_id = ? AND entity_id = ? AND action = 'inspection.completed'").bind(co, qi.id).first<{ n: number }>();
    expect(events!.n).toBe(1);
  });
});

describe('segregation of duties on corrective actions', () => {
  it('never lets the proposer or the responsible person approve, nor the person who did it close, except in a company of one', async () => {
    const t = await team('Iota');
    const { co, qm, qm2, engineer } = t;
    // Proposed by one quality manager for the other: neither may approve; a third person (the owner) may.
    const x = await qm.json('POST', erp(co, '/capas'), { kind: 'preventive', title: 'Add a go/no-go gauge', responsibleId: qm2.userId, dueDate: day(5) });
    const r1 = await qm.req('POST', erp(co, `/capas/${x.id}/approve`), {});
    expect(r1.status).toBe(403);
    expect(((await r1.json()) as any).error).toMatch(/proposed this action.*segregation of duties/);
    const r2 = await qm2.req('POST', erp(co, `/capas/${x.id}/approve`), {});
    expect(((await r2.json()) as any).error).toMatch(/responsible for carrying out this action/);
    await t.owner.json('POST', erp(co, `/capas/${x.id}/approve`), {});
    await qm2.json('POST', erp(co, `/capas/${x.id}/done`), { note: 'Gauge in use at the lathe' });
    await qm.json('POST', erp(co, `/capas/${x.id}/verify`), { effective: true, note: 'No escapes in two weeks' });
    // The person who carried it out may not close it.
    expect(((await (await qm2.req('POST', erp(co, `/capas/${x.id}/close`), {})).json()) as any).error).toMatch(/carried out this action/);
    expect(await qm.json('POST', erp(co, `/capas/${x.id}/close`), {})).toMatchObject({ status: 'closed', sodException: false });
    // Somebody else's action: an engineer cannot verify, approve or close.
    const y = await engineer.json('POST', erp(co, '/capas'), { kind: 'corrective', title: 'Fix the jig', responsibleId: engineer.userId });
    for (const step of ['approve', 'verify', 'close', 'cancel']) expect((await engineer.req('POST', erp(co, `/capas/${y.id}/${step}`), { effective: true, note: 'x', reason: 'x' })).status, step).toBe(403);
    expect((await qm.req('POST', erp(co, '/capas'), { kind: 'corrective', title: 'Outsider', responsibleId: (await signup('Iota Stranger')).userId })).status).toBe(400);
    // In a company of one the owner approves and closes their own action; the exception is recorded.
    const solo = await signup('Iota Solo');
    const own = await ownCompany(solo);
    const z = await solo.json('POST', erp(own, '/capas'), { kind: 'corrective', title: 'Label the bins', responsibleId: solo.userId });
    expect(await solo.json('POST', erp(own, `/capas/${z.id}/approve`), {})).toMatchObject({ sodException: true });
    await solo.json('POST', erp(own, `/capas/${z.id}/done`), { note: 'Labelled' });
    await solo.json('POST', erp(own, `/capas/${z.id}/verify`), { effective: true, note: 'Checked' });
    expect(await solo.json('POST', erp(own, `/capas/${z.id}/close`), {})).toMatchObject({ sodException: true });
    const zv = await solo.json('GET', erp(own, `/capas/${z.id}`));
    expect(zv.capa).toMatchObject({ approvalSodException: true, closureSodException: true });
    expect(zv.history.find((e: any) => e.action === 'capa.approved').summary).toMatch(/exception is recorded/);
  });
});

describe('isolation, roles and plan versions', () => {
  it('keeps each company’s quality to itself, checks roles, and versions plans', async () => {
    const t = await team('Kappa');
    const { owner, co, engineer, qm, inspector, viewer, op, storeman } = t;
    const prod = await engineer.json('POST', erp(co, '/products'), { name: 'Gear', type: 'manufactured_part' });
    const plan = await engineer.json('POST', erp(co, '/qc-plans'), { name: 'Gear check', kind: 'product', productId: prod.id, characteristics: [{ name: 'Teeth', kind: 'attribute' }] });
    await qm.json('POST', erp(co, `/qc-plans/${plan.id}/release`), {});
    const qi = await inspector.json('POST', erp(co, '/inspections'), { sourceType: 'manual', kind: 'product', productId: prod.id });
    const ncr = await op.json('POST', erp(co, '/ncrs'), { title: 'Chipped tooth', description: 'One tooth chipped', severity: 'minor', productId: prod.id, process: 'Hobbing' });
    const capa = await qm.json('POST', erp(co, '/capas'), { kind: 'corrective', title: 'New hob', responsibleId: engineer.userId });

    // Roles and what each may do.
    const roles = await owner.json('GET', erp(co, '/roles'));
    expect(roles.roles.map((r: any) => r.value)).toEqual(expect.arrayContaining(['quality_manager', 'quality_inspector']));
    expect((await viewer.json('GET', erp(co, '/me'))).can).toMatchObject({ 'quality.view': true, 'quality.inspect': false, 'quality.raise': false, 'quality.disposition': false });
    expect((await inspector.json('GET', erp(co, '/me'))).can).toMatchObject({ 'quality.inspect': true, 'quality.raise': true, 'quality.disposition': false, 'quality.plan': false, 'capa.propose': true, 'capa.approve': false });
    expect((await qm.json('GET', erp(co, '/me'))).can).toMatchObject({ 'quality.plan': true, 'quality.plan_release': true, 'quality.disposition': true, 'capa.approve': true });
    expect((await storeman.json('GET', erp(co, '/me'))).can).toMatchObject({ 'quality.raise': true, 'quality.inspect': false });
    expect((await viewer.json('GET', erp(co, '/quality/overview'))).can).toMatchObject({ inspect: false, raise: false });

    // An NCR may name a Maintenance asset of its own company, never another's.
    const asset = await owner.json('POST', `/api/maintenance/c/${co}/assets`, { number: 'HOB-1', name: 'Hobbing machine', category: 'Machine' });
    expect((await op.json('PATCH', erp(co, `/ncrs/${ncr.id}`), { assetId: asset.id })).assetNumber).toBe('HOB-1');
    const other = await signup('Kappa Outsider');
    const otherCo = await ownCompany(other);
    const otherAsset = await other.json('POST', `/api/maintenance/c/${otherCo}/assets`, { number: 'X-1', name: 'Mill', category: 'Machine' });
    expect((await op.req('PATCH', erp(co, `/ncrs/${ncr.id}`), { assetId: otherAsset.id })).status).toBe(400);

    // Another company sees none of it: 404 on the company, and on these records from its own company.
    for (const path of ['/qc-plans', `/qc-plans/${plan.id}`, '/inspections', `/inspections/${qi.id}`, '/ncrs', `/ncrs/${ncr.id}`, '/capas', `/capas/${capa.id}`, '/quality/overview', '/quality-options', '/reports/ncr-register', '/reports/inspection-results']) {
      expect((await other.req('GET', erp(co, path))).status, path).toBe(404);
    }
    for (const path of [`/qc-plans/${plan.id}`, `/inspections/${qi.id}`, `/ncrs/${ncr.id}`, `/capas/${capa.id}`]) expect((await other.req('GET', erp(otherCo, path))).status, path).toBe(404);
    expect((await other.req('POST', erp(otherCo, `/ncrs/${ncr.id}/disposition`), { lines: [{ kind: 'scrap', quantity: 1 }] })).status).toBe(404);
    expect((await other.req('POST', erp(otherCo, `/capas/${capa.id}/approve`), {})).status).toBe(404);
    expect((await other.req('POST', erp(otherCo, '/inspections'), { sourceType: 'manual', kind: 'product', productId: prod.id })).status).toBe(400);
    expect((await other.req('POST', erp(otherCo, '/ncrs'), { title: 'x', description: 'y', severity: 'minor', inspectionIds: [qi.id] })).status).toBe(400);
    expect((await other.req('POST', erp(otherCo, '/qc-plans'), { name: 'x', kind: 'product', productId: prod.id })).status).toBe(400);

    // Plan versions: a copy is the next version; releasing it supersedes the first; past inspections keep theirs.
    const v2 = await engineer.json('POST', erp(co, `/qc-plans/${plan.id}/copy`), {});
    expect(v2).toMatchObject({ number: 'QP-00001', version: 2, status: 'draft', characteristics: 1 });
    expect((await engineer.req('POST', erp(co, `/qc-plans/${plan.id}/copy`), {})).status).toBe(409);
    await engineer.json('POST', erp(co, `/qc-plans/${v2.id}/characteristics`), { name: 'Bore', kind: 'dimension', unit: 'mm', nominal: 12, tolerance: 0.02 });
    await qm.json('POST', erp(co, `/qc-plans/${v2.id}/release`), { note: 'Bore added' });
    const pv = await viewer.json('GET', erp(co, `/qc-plans/${plan.id}`));
    expect(pv.plan.status).toBe('superseded');
    expect(pv.versions.map((x: any) => [x.version, x.status])).toEqual([
      [2, 'released'],
      [1, 'superseded'],
    ]);
    const qi2 = await inspector.json('POST', erp(co, '/inspections'), { sourceType: 'manual', kind: 'product', productId: prod.id });
    expect(qi2).toMatchObject({ planLabel: 'QP-00001 v2 Gear check', characteristics: 2 });
    expect((await viewer.json('GET', erp(co, `/inspections/${qi.id}`))).inspection.planLabel).toBe('QP-00001 v1 Gear check');
    expect((await qm.req('DELETE', erp(co, `/qc-plans/${v2.id}`))).status).toBe(409);
  });
});

describe('the example company', () => {
  it('gets a released plan, a failed inspection, an NCR with containment and a corrective action, and loses them on removal', async () => {
    const ex = await signup('Example inspector');
    const built = (await (await ex.req('POST', '/api/system/demo', {})).json()) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const plans = await ex.json('GET', erp(co, '/qc-plans?status=released'));
    expect(plans.plans).toMatchObject([{ number: 'QP-00001', kind: 'incoming', characteristics: 3 }]);
    const insp = await ex.json('GET', erp(co, '/inspections'));
    expect(insp.inspections).toMatchObject([{ number: 'QI-00001', status: 'completed', result: 'failed', quantity: 40 }]);
    const ncrs = await ex.json('GET', erp(co, '/ncrs'));
    expect(ncrs.ncrs).toMatchObject([{ number: 'NCR-00001', status: 'investigating', severity: 'major' }]);
    expect(ncrs.ncrs[0].containment).toMatch(/measured/);
    const capas = await ex.json('GET', erp(co, '/capas'));
    expect(capas.capas).toMatchObject([{ number: 'CA-00001', status: 'in_progress', approvalSodException: true, ncrNumber: 'NCR-00001' }]);
    // Release 2's and 3's example figures hold: no stock moved.
    const stock = await ex.json('GET', erp(co, '/stock?filter=in_stock'));
    // Release 5 adds packed kits (shipped, one back in quarantine): the bracket arms are as before.
    expect(stock.rows.find((r: any) => r.name === 'Bracket arm, laser cut')).toMatchObject({ onHand: 40, reserved: 10, valueCents: 15_200 });
    await ex.json('POST', '/api/system/demo/remove', {});
    for (const table of ['erp_qc_plans', 'erp_qc_plan_chars', 'erp_qc_inspections', 'erp_qc_insp_chars', 'erp_qc_readings', 'erp_qc_ncrs', 'erp_qc_ncr_inspections', 'erp_qc_capas', 'erp_qc_dispositions', 'erp_qc_ncr_actions']) {
      const n = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE company_id = ?`).bind(co).first<{ n: number }>();
      expect(n!.n, table).toBe(0);
    }
  });
});
