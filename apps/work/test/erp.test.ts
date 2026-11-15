// BIZOMAT ERP, Release 1 (src/worker/erp): products and engineering, change control, multi-level bills of materials,
// engineering documents and the supplier master. The owner's Scenario A runs end to end; the rest checks each rule the
// brief sets: cycles refused, explosion, where-used, cost roll-up with missing costs and other currencies, revision
// comparison, segregation of duties, a concurrent release refused, the supplier lifecycle and its Finance link (refused
// without a Finance role), the ABN checksum, isolation between companies, roles, numbering under concurrency and CSV.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { createOrg, joinOrg } from './crm-helpers';
import { abnValid } from '../src/worker/company/verify';

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5, 6, 7, 8]);

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}
/** An 11-digit number whose check digits are wrong. */
function badAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (!abnValid(n)) return n;
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

/** A registered company: the owner (ERP administrator), an engineer, an engineering approver, a buyer, a procurement
 * manager, an executive and a member left at the default (viewer). */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company, tools } = await registerCompany(owner, `${label} Industries`);
  const co = company.id;
  const people: Record<string, Client> = {};
  for (const [key, role] of [
    ['engineer', 'engineer'],
    ['approver', 'engineering_approver'],
    ['buyer', 'buyer'],
    ['manager', 'procurement_manager'],
    ['executive', 'executive'],
    ['viewer', null],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p, 'member');
    if (role) await owner.json('PUT', erp(co, `/roles/${p.userId}`), { roles: [role] });
    people[key] = p;
  }
  return { owner, co, tools, ...(people as Record<'engineer' | 'approver' | 'buyer' | 'manager' | 'executive' | 'viewer', Client>) };
}

async function product(c: Client, co: string, body: Record<string, unknown>) {
  return c.json('POST', erp(co, '/products'), { type: 'component', ...body });
}

/** The draft revision a new product starts with (A). */
async function firstRevision(c: Client, co: string, productId: string) {
  const d = await c.json('GET', erp(co, `/products/${productId}`));
  return d.revisions[0] as { id: string; label: string; status: string };
}

async function line(c: Client, co: string, revisionId: string, body: Record<string, unknown>) {
  return c.json('POST', erp(co, `/revisions/${revisionId}/lines`), body);
}

/** Draft, submit, approve (approver) and release (approver) a change order for some products. */
async function releaseThrough(t: { engineer: Client; approver: Client; co: string }, productIds: string[], title = 'Release') {
  const eco = await t.engineer.json('POST', erp(t.co, '/change-orders'), { title, productIds });
  await t.engineer.json('POST', erp(t.co, `/change-orders/${eco.id}/submit`), {});
  await t.approver.json('POST', erp(t.co, `/change-orders/${eco.id}/approve`), {});
  const rel = await t.approver.json('POST', erp(t.co, `/change-orders/${eco.id}/release`), {});
  expect(rel.order.status).toBe('released');
  return eco;
}

describe('Scenario A: product, bill of materials, change control and release', () => {
  it('runs from a new product to a second released revision with history, locking and comparison', async () => {
    const t = await team('Atlas');
    const { owner, engineer, approver, viewer, co } = t;

    // 1. Product master: a finished product, a subassembly and its parts.
    const pump = await product(engineer, co, {
      name: 'Centrifugal pump',
      type: 'finished_product',
      category: 'Pumps',
      sku: 'CP-100',
      description: 'Example pump for testing',
      uom: 'each',
      priceCents: 25000,
      weight: 12.5,
      weightUnit: 'kg',
      material: 'Cast iron',
      properties: [{ key: 'Flow', value: '120 L/min' }],
      lifecycle: 'active',
      effectiveFrom: '2026-01-01',
    });
    expect(pump.number).toBe('PRD-00001');
    expect(pump).toMatchObject({ type: 'finished_product', typeLabel: 'Finished product', lifecycle: 'active', sku: 'CP-100', releasedRevision: null });
    const motorSub = await product(engineer, co, { name: 'Motor subassembly', type: 'subassembly' });
    const housing = await product(engineer, co, { name: 'Pump housing', type: 'manufactured_part', standardCostCents: 2500 });
    const impeller = await product(engineer, co, { name: 'Impeller', standardCostCents: 1200 });
    const motor = await product(engineer, co, { name: 'Electric motor 1.5 kW', type: 'purchased_item', standardCostCents: 4500 });
    const bearing = await product(engineer, co, { name: 'Ball bearing 6204', standardCostCents: 300 });
    const screw = await product(engineer, co, { name: 'Screw M6 x 20', standardCostCents: 10 });
    expect(screw.number).toBe('PRD-00007');

    // Variants: a product of their own with the attributes that set them apart.
    const big = await engineer.json('POST', erp(co, `/products/${pump.id}/variants`), { variantAttributes: { size: 'Large' } });
    expect(big).toMatchObject({ variantOf: pump.id, variantOfNumber: 'PRD-00001', variantAttributes: { size: 'Large' }, name: 'Centrifugal pump (Large)' });
    expect((await engineer.req('POST', erp(co, `/products/${big.id}/variants`), { variantAttributes: { size: 'XL' } })).status).toBe(400);
    expect((await engineer.req('POST', erp(co, `/products/${pump.id}/variants`), { variantAttributes: {} })).status).toBe(400);

    // 2. Two-level bill of materials on revision A (drafts).
    const subA = await firstRevision(engineer, co, motorSub.id);
    expect(subA).toMatchObject({ label: 'A', status: 'draft' });
    await line(engineer, co, subA.id, { componentId: motor.id, quantity: 1 });
    await line(engineer, co, subA.id, { componentId: bearing.id, quantity: 2, scrapPct: 5, refDesignator: 'B1,B2' });
    const pumpA = await firstRevision(engineer, co, pump.id);
    await line(engineer, co, pumpA.id, { componentId: housing.id, quantity: 1 });
    await line(engineer, co, pumpA.id, { componentId: impeller.id, quantity: 1 });
    await line(engineer, co, pumpA.id, { componentId: motorSub.id, quantity: 1 });
    const screwLine = await line(engineer, co, pumpA.id, { componentId: screw.id, quantity: 8, scrapPct: 10 });
    expect(screwLine).toMatchObject({ componentNumber: screw.number, quantity: 8, scrapPct: 10, uom: 'each' });

    // Cycles are refused at any depth, and a product cannot contain itself.
    expect((await engineer.req('POST', erp(co, `/revisions/${pumpA.id}/lines`), { componentId: pump.id, quantity: 1 })).status).toBe(400);
    const loop = await engineer.req('POST', erp(co, `/revisions/${subA.id}/lines`), { componentId: pump.id, quantity: 1 });
    expect(loop.status).toBe(400);
    expect(((await loop.json()) as any).error).toMatch(/loop/i);
    // A viewer reads but cannot change the structure.
    expect((await viewer.req('GET', erp(co, `/revisions/${pumpA.id}`))).status).toBe(200);
    expect((await viewer.req('POST', erp(co, `/revisions/${pumpA.id}/lines`), { componentId: bearing.id, quantity: 1 })).status).toBe(403);

    // 3. A change request, reviewed and approved, becomes a change order carrying both revisions.
    const ecr = await engineer.json('POST', erp(co, '/change-requests'), { title: 'First release of the pump', reason: 'Production start', productIds: [pump.id, motorSub.id] });
    expect(ecr).toMatchObject({ number: 'ECR-0001', status: 'submitted' });
    expect((await viewer.req('POST', erp(co, '/change-requests'), { title: 'No' })).status).toBe(403);
    expect((await engineer.req('POST', erp(co, `/change-requests/${ecr.id}/review`), {})).status).toBe(403);
    await approver.json('POST', erp(co, `/change-requests/${ecr.id}/review`), {});
    expect((await engineer.req('POST', erp(co, '/change-orders'), { title: 'Too early', requestId: ecr.id })).status).toBe(409);
    expect((await approver.req('POST', erp(co, `/change-requests/${ecr.id}/decide`), { decision: 'rejected' })).status).toBe(400);
    expect((await approver.json('POST', erp(co, `/change-requests/${ecr.id}/decide`), { decision: 'approved', note: 'Go ahead' })).status).toBe('approved');

    const eco = await engineer.json('POST', erp(co, '/change-orders'), { title: 'Release revision A', requestId: ecr.id });
    expect(eco).toMatchObject({ number: 'ECO-0001', status: 'draft', requestNumber: 'ECR-0001', revisionCount: 2 });
    const detail = await engineer.json('GET', erp(co, `/change-orders/${eco.id}`));
    expect(detail.revisions.map((r: any) => r.status)).toEqual(['in_change', 'in_change']);
    // While the change order is a draft its revisions still change.
    await line(engineer, co, pumpA.id, { componentId: bearing.id, quantity: 1, optional: true });

    await engineer.json('POST', erp(co, `/change-orders/${eco.id}/submit`), {});
    // Submitted: the revisions are locked.
    expect((await engineer.req('POST', erp(co, `/revisions/${pumpA.id}/lines`), { componentId: bearing.id, quantity: 1 })).status).toBe(409);
    // 4. Segregation of duties: the engineer who drafted it cannot approve (no role), nor can an approver approve their own.
    expect((await engineer.req('POST', erp(co, `/change-orders/${eco.id}/approve`), {})).status).toBe(403);
    expect((await approver.req('POST', erp(co, `/change-orders/${eco.id}/release`), {})).status).toBe(409);
    await approver.json('POST', erp(co, `/change-orders/${eco.id}/approve`), { note: 'Checked against the drawings' });
    const released = await approver.json('POST', erp(co, `/change-orders/${eco.id}/release`), {});
    expect(released.order).toMatchObject({ status: 'released', releasedByName: 'Atlas approver', sodException: false });
    expect(released.revisions.map((r: any) => r.status)).toEqual(['released', 'released']);
    expect((await approver.req('POST', erp(co, `/change-orders/${eco.id}/release`), {})).status).toBe(409);

    // 5. The released revision is locked.
    for (const [m, p, b] of [
      ['POST', `/revisions/${pumpA.id}/lines`, { componentId: bearing.id, quantity: 1 }],
      ['PATCH', `/revisions/${pumpA.id}/lines/${screwLine.id}`, { quantity: 9 }],
      ['DELETE', `/revisions/${pumpA.id}/lines/${screwLine.id}`, undefined],
      ['PATCH', `/revisions/${pumpA.id}`, { description: 'Changed' }],
    ] as const) {
      expect((await owner.req(m, erp(co, p), b)).status, `${m} ${p}`).toBe(409);
    }
    expect((await engineer.json('GET', erp(co, `/products/${pump.id}`))).product.releasedRevision).toBe('A');

    // 6. Multi-level explosion: components use their released revision; extended quantities carry scrap.
    const ex = await viewer.json('GET', erp(co, `/revisions/${pumpA.id}/explosion`));
    const byNumber = (n: string) => ex.nodes.find((x: any) => x.number === n);
    expect(ex.nodes.map((n: any) => [n.level, n.number])).toEqual([
      [1, housing.number],
      [1, impeller.number],
      [1, motorSub.number],
      [2, motor.number],
      [2, bearing.number],
      [1, screw.number],
      [1, bearing.number],
    ]);
    expect(byNumber(motorSub.number)).toMatchObject({ revision: 'A', noRelease: false });
    expect(ex.nodes[4]).toMatchObject({ path: '3.2', extendedQuantity: 2.1 });
    expect(byNumber(screw.number).extendedQuantity).toBeCloseTo(8.8);
    // A manufactured part without a released revision is flagged.
    expect(byNumber(housing.number).noRelease).toBe(true);
    // Release 2: each component's available stock against the build quantity (none in stock here).
    expect(ex.availability).toMatch(/Available: on hand outside quarantine/);
    expect(byNumber(screw.number)).toMatchObject({ available: 0, shortage: true });

    // 7. Cost roll-up: 2500 + 1200 + (4500 + 2 x 1.05 x 300) + 8 x 1.1 x 10 = 8918 cents; the optional bearing is left out.
    const cost = await viewer.json('GET', erp(co, `/revisions/${pumpA.id}/cost`));
    expect(cost).toMatchObject({ unitCostCents: 8918, currency: 'AUD', complete: true, missing: [], mixedCurrency: [] });
    expect(cost.lines.find((l: any) => l.number === motorSub.number)).toMatchObject({ source: 'rolled_up', extendedCents: 5130 });
    expect(cost.lines.find((l: any) => l.optional || l.source === 'optional')).toBeTruthy();

    // 8. Where-used: the bearing is in the subassembly (released) and in the pump (optional line); top level: the pump.
    const wu = await viewer.json('GET', erp(co, `/products/${bearing.id}/where-used`));
    expect(wu.parents.map((p: any) => p.number).sort()).toEqual([pump.number, motorSub.number].sort());
    expect(wu.topLevel.map((p: any) => p.number)).toEqual([pump.number]);

    // 9. Revision B through a second change order: copied from A, changed, compared and released.
    const eco2 = await engineer.json('POST', erp(co, '/change-orders'), { title: 'Fewer screws, no impeller line', productIds: [pump.id] });
    expect(eco2.number).toBe('ECO-0002');
    const d2 = await engineer.json('GET', erp(co, `/change-orders/${eco2.id}`));
    const pumpB = d2.revisions[0];
    expect(pumpB).toMatchObject({ label: 'B', status: 'in_change', previousLabel: 'A', lineCount: 5 });
    const bLines = (await engineer.json('GET', erp(co, `/revisions/${pumpB.id}`))).lines;
    await engineer.json('PATCH', erp(co, `/revisions/${pumpB.id}/lines/${bLines.find((l: any) => l.componentId === screw.id).id}`), { quantity: 6 });
    await engineer.json('DELETE', erp(co, `/revisions/${pumpB.id}/lines/${bLines.find((l: any) => l.componentId === impeller.id).id}`));
    const gasket = await product(engineer, co, { name: 'Gasket', standardCostCents: 40 });
    await line(engineer, co, pumpB.id, { componentId: gasket.id, quantity: 1 });
    const cmp = await viewer.json('GET', erp(co, `/revision-compare?a=${pumpA.id}&b=${pumpB.id}`));
    expect(cmp.added.map((l: any) => l.componentNumber)).toEqual([gasket.number]);
    expect(cmp.removed.map((l: any) => l.componentNumber)).toEqual([impeller.number]);
    expect(cmp.changed).toHaveLength(1);
    expect(cmp.changed[0].diffs).toEqual([{ field: 'Quantity', from: 8, to: 6 }]);
    expect(cmp.fields.find((f: any) => f.field === 'Status')).toMatchObject({ from: 'released', to: 'in_change' });

    // The owner (an ERP administrator who did not draft it) approves and releases it.
    await engineer.json('POST', erp(co, `/change-orders/${eco2.id}/submit`), {});
    await owner.json('POST', erp(co, `/change-orders/${eco2.id}/approve`), {});
    await owner.json('POST', erp(co, `/change-orders/${eco2.id}/release`), {});
    const after = await viewer.json('GET', erp(co, `/products/${pump.id}`));
    expect(after.product.releasedRevision).toBe('B');
    expect(after.revisions.map((r: any) => [r.label, r.status])).toEqual([
      ['A', 'superseded'],
      ['B', 'released'],
    ]);
    expect(after.revisions[0].supersededBy).toBe(pumpB.id);
    // Historical comparison still reads the superseded revision.
    expect((await viewer.json('GET', erp(co, `/revision-compare?a=${pumpA.id}&b=${pumpB.id}`))).removed).toHaveLength(1);
    // The history records the release, the superseded revision and who did each step.
    const actions = after.history.map((h: any) => h.action);
    expect(actions).toEqual(expect.arrayContaining(['product.created', 'revision.created', 'bom.line_added', 'revision.in_change', 'revision.released']));
    const eh = (await viewer.json('GET', erp(co, `/change-orders/${eco.id}`))).history.map((h: any) => [h.action, h.actorName]);
    expect(eh).toEqual(expect.arrayContaining([['change_order.created', 'Atlas engineer'], ['change_order.submitted', 'Atlas engineer'], ['change_order.approved', 'Atlas approver'], ['change_order.released', 'Atlas approver']]));

    // 10. CSV of the explosion.
    const csv = await viewer.req('GET', erp(co, `/revisions/${pumpB.id}/explosion?format=csv`));
    expect(csv.status).toBe(200);
    expect(csv.headers.get('Content-Type')).toMatch(/text\/csv/);
    const text = await csv.text();
    expect(text.split('\n')[0]).toContain('Extended quantity');
    expect(text).toContain(motor.number);
  });
});

describe('bills of materials: roll-up flags, alternatives, effective dates and archive rules', () => {
  it('flags missing costs and other currencies instead of guessing, and counts one line of an alternative group', async () => {
    const t = await team('Beta');
    const { engineer, co } = t;
    const kit = await product(engineer, co, { name: 'Kit', type: 'assembly' });
    const a1 = await product(engineer, co, { name: 'Part with cost', standardCostCents: 100 });
    const a2 = await product(engineer, co, { name: 'Alternative part', standardCostCents: 999 });
    const nocost = await product(engineer, co, { name: 'Part without cost' });
    const usd = await product(engineer, co, { name: 'Imported part', standardCostCents: 500, currency: 'USD' });
    const rev = await firstRevision(engineer, co, kit.id);
    await line(engineer, co, rev.id, { componentId: a1.id, quantity: 2, altGroup: 'G1' });
    await line(engineer, co, rev.id, { componentId: a2.id, quantity: 2, altGroup: 'G1' });
    let cost = await engineer.json('GET', erp(co, `/revisions/${rev.id}/cost`));
    expect(cost).toMatchObject({ unitCostCents: 200, complete: true });
    expect(cost.lines.map((l: any) => l.source)).toEqual(['standard', 'alternative']);
    await line(engineer, co, rev.id, { componentId: nocost.id, quantity: 1 });
    await line(engineer, co, rev.id, { componentId: usd.id, quantity: 1 });
    cost = await engineer.json('GET', erp(co, `/revisions/${rev.id}/cost`));
    expect(cost.complete).toBe(false);
    expect(cost.missing).toEqual([nocost.number]);
    expect(cost.mixedCurrency).toEqual([usd.number]);
    expect(cost.unitCostCents).toBe(200);
    // Effective dates: a line not yet in effect is left out of an explosion "as of" a date.
    await line(engineer, co, rev.id, { componentId: a1.id, quantity: 1, effectiveFrom: '2027-01-01', refDesignator: 'later' });
    expect((await engineer.json('GET', erp(co, `/revisions/${rev.id}/explosion?asOf=2026-06-01`))).nodes).toHaveLength(4);
    expect((await engineer.json('GET', erp(co, `/revisions/${rev.id}/explosion?asOf=2027-06-01`))).nodes).toHaveLength(5);
    expect((await engineer.req('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId: a1.id, quantity: 1, effectiveFrom: '2027-01-02', effectiveTo: '2027-01-01' })).status).toBe(400);
    expect((await engineer.req('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId: a1.id, quantity: 0 })).status).toBe(400);
    // A part used in a bill of materials cannot be archived; an archived part cannot be added.
    expect((await engineer.req('POST', erp(co, `/products/${a1.id}/archive`), {})).status).toBe(409);
    const spare = await product(engineer, co, { name: 'Spare' });
    await engineer.json('POST', erp(co, `/products/${spare.id}/archive`), {});
    expect((await engineer.req('POST', erp(co, `/revisions/${rev.id}/lines`), { componentId: spare.id, quantity: 1 })).status).toBe(409);
    // One open revision at a time.
    expect((await engineer.req('POST', erp(co, `/products/${kit.id}/revisions`), {})).status).toBe(409);
  });

  it('refuses a deeper loop through released revisions and keeps cancelled change orders’ revisions as drafts', async () => {
    const t = await team('Gamma');
    const { engineer, approver, co } = t;
    const top = await product(engineer, co, { name: 'Top', type: 'assembly' });
    const mid = await product(engineer, co, { name: 'Middle', type: 'subassembly' });
    const low = await product(engineer, co, { name: 'Low', type: 'subassembly' });
    await line(engineer, co, (await firstRevision(engineer, co, top.id)).id, { componentId: mid.id, quantity: 1 });
    await line(engineer, co, (await firstRevision(engineer, co, mid.id)).id, { componentId: low.id, quantity: 1 });
    await releaseThrough({ engineer, approver, co }, [top.id, mid.id]);
    // Low's draft would contain Top, which contains Middle, which contains Low.
    const lowA = await firstRevision(engineer, co, low.id);
    expect((await engineer.req('POST', erp(co, `/revisions/${lowA.id}/lines`), { componentId: top.id, quantity: 1 })).status).toBe(400);

    const eco = await engineer.json('POST', erp(co, '/change-orders'), { title: 'Not needed', productIds: [low.id] });
    expect((await engineer.json('GET', erp(co, `/revisions/${lowA.id}`))).revision.status).toBe('in_change');
    // Another change order cannot take the same revision.
    expect((await engineer.req('POST', erp(co, '/change-orders'), { title: 'Twice', productIds: [low.id] })).status).toBe(409);
    await engineer.json('POST', erp(co, `/change-orders/${eco.id}/cancel`), { note: 'Superseded by another plan' });
    const r = await engineer.json('GET', erp(co, `/revisions/${lowA.id}`));
    expect(r.revision).toMatchObject({ status: 'draft', ecoId: null });
    expect(r.editable).toBe(true);
    // Submitting needs revisions; an empty draft is refused.
    const empty = await engineer.json('POST', erp(co, '/change-orders'), { title: 'Empty' });
    expect((await engineer.req('POST', erp(co, `/change-orders/${empty.id}/submit`), {})).status).toBe(409);
    // Returned to draft: the revision unlocks again.
    const eco3 = await engineer.json('POST', erp(co, '/change-orders'), { title: 'Again', productIds: [low.id] });
    await engineer.json('POST', erp(co, `/change-orders/${eco3.id}/submit`), {});
    expect((await engineer.json('GET', erp(co, `/revisions/${lowA.id}`))).editable).toBe(false);
    expect((await approver.req('POST', erp(co, `/change-orders/${eco3.id}/return`), {})).status).toBe(400);
    await approver.json('POST', erp(co, `/change-orders/${eco3.id}/return`), { note: 'Add the drawing first' });
    expect((await engineer.json('GET', erp(co, `/revisions/${lowA.id}`))).editable).toBe(true);
  });
});

describe('change orders: segregation of duties and a concurrent release', () => {
  it('refuses the drafter as approver in a company of several, and lets only one of two simultaneous releases through', async () => {
    const t = await team('Delta');
    const { approver, engineer, owner, co } = t;
    const p = await product(approver, co, { name: 'Bracket' });
    const q = await product(approver, co, { name: 'Plate' });
    // The approver drafts it, so another approver (the owner, an ERP administrator) must approve and release it.
    const eco = await approver.json('POST', erp(co, '/change-orders'), { title: 'Bracket release', productIds: [p.id, q.id] });
    await approver.json('POST', erp(co, `/change-orders/${eco.id}/submit`), {});
    const own = await approver.req('POST', erp(co, `/change-orders/${eco.id}/approve`), {});
    expect(own.status).toBe(403);
    expect(((await own.json()) as any).error).toMatch(/segregation of duties/);
    expect((await approver.json('GET', erp(co, `/change-orders/${eco.id}`))).can).toMatchObject({ approve: false, segregation: expect.stringMatching(/another engineering approver/) });
    await owner.json('POST', erp(co, `/change-orders/${eco.id}/approve`), {});
    expect((await approver.req('POST', erp(co, `/change-orders/${eco.id}/release`), {})).status).toBe(403);

    // Two releases at the same moment: exactly one succeeds, the other is refused and changes nothing.
    const [r1, r2] = await Promise.all([owner.req('POST', erp(co, `/change-orders/${eco.id}/release`), {}), owner.req('POST', erp(co, `/change-orders/${eco.id}/release`), {})]);
    expect([r1.status, r2.status].sort()).toEqual([200, 409]);
    const events = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_events WHERE company_id = ? AND action = 'change_order.released'").bind(co).first<{ n: number }>();
    expect(events!.n).toBe(1);
    const revEvents = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_events WHERE company_id = ? AND action = 'revision.released'").bind(co).first<{ n: number }>();
    expect(revEvents!.n).toBe(2);
    const released = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_revisions WHERE company_id = ? AND status = 'released'").bind(co).first<{ n: number }>();
    expect(released!.n).toBe(2);

    // A second change order superseding while another tries: still one released revision per product.
    const e2 = await engineer.json('POST', erp(co, '/change-orders'), { title: 'Bracket B', productIds: [p.id] });
    await engineer.json('POST', erp(co, `/change-orders/${e2.id}/submit`), {});
    await approver.json('POST', erp(co, `/change-orders/${e2.id}/approve`), {});
    const [x1, x2] = await Promise.all([approver.req('POST', erp(co, `/change-orders/${e2.id}/release`), {}), owner.req('POST', erp(co, `/change-orders/${e2.id}/release`), {})]);
    expect([x1.status, x2.status].sort()).toEqual([200, 409]);
    const per = await env.DB.prepare("SELECT status, COUNT(*) AS n FROM erp_revisions WHERE company_id = ? AND product_id = ? GROUP BY status").bind(co, p.id).all<{ status: string; n: number }>();
    expect(Object.fromEntries(per.results.map((r) => [r.status, r.n]))).toEqual({ superseded: 1, released: 1 });
  });

  it('records the exception when the only person in the company approves their own change order', async () => {
    const solo = await signup('Sole Trader');
    const own = (await solo.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const me = await solo.json('GET', erp(own.id, '/me'));
    expect(me).toMatchObject({ roles: ['erp_admin'], solo: true });
    expect(me.can['roles.manage']).toBe(true);
    const p = await product(solo, own.id, { name: 'Widget' });
    const eco = await solo.json('POST', erp(own.id, '/change-orders'), { title: 'Widget A', productIds: [p.id] });
    await solo.json('POST', erp(own.id, `/change-orders/${eco.id}/submit`), {});
    const approved = await solo.json('POST', erp(own.id, `/change-orders/${eco.id}/approve`), {});
    expect(approved.sodException).toBe(true);
    const rel = await solo.json('POST', erp(own.id, `/change-orders/${eco.id}/release`), {});
    expect(rel.order).toMatchObject({ status: 'released', sodException: true });
    const h = (await solo.json('GET', erp(own.id, `/change-orders/${eco.id}`))).history;
    expect(h.find((e: any) => e.action === 'change_order.approved').summary).toMatch(/recorded exception/);
    const report = await solo.json('GET', erp(own.id, '/reports/changes'));
    expect(report.exceptions).toBe(1);
  });
});

describe('engineering documents', () => {
  it('keeps versions of files and CAD references, approves them and accepts DXF and STEP only when their content checks out', async () => {
    const t = await team('Epsilon');
    const { engineer, approver, viewer, co } = t;
    const p = await product(engineer, co, { name: 'Flange', type: 'manufactured_part' });
    const rev = await firstRevision(engineer, co, p.id);
    // A CAD reference: the file stays on the engineer's computer; the record says where.
    const doc = await engineer.json('POST', erp(co, '/documents'), {
      productId: p.id,
      revisionId: rev.id,
      title: 'Flange model',
      kind: 'model',
      docRevision: 'A',
      cadPath: 'C:\\Users\\Engineer\\Documents\\Parts\\Flange.SLDPRT',
      cadConfig: 'Default',
    });
    expect(doc).toMatchObject({ number: 'DOC-0001', status: 'draft', latestVersion: 1, latestSource: 'cad_reference', revisionLabel: 'A' });
    let d = await viewer.json('GET', erp(co, `/documents/${doc.id}`));
    expect(d.versions[0]).toMatchObject({ source: 'cad_reference', cadFileName: 'Flange.SLDPRT', cadConfig: 'Default', url: null });
    expect(d.can).toMatchObject({ edit: false, approve: false });
    expect((await engineer.req('POST', erp(co, '/documents'), { productId: p.id, title: 'No path', kind: 'model' })).status).toBe(400);

    // A STEP file is accepted only when it starts as STEP must; then it is only ever downloaded.
    const stepOk = new FormData();
    stepOk.set('file', new File(['ISO-10303-21;\nHEADER;\nENDSEC;\nEND-ISO-10303-21;\n'], 'flange.step', { type: 'application/octet-stream' }));
    stepOk.set('docRevision', 'B');
    const v2 = await engineer.req('POST', erp(co, `/documents/${doc.id}/versions`), stepOk);
    expect(v2.status).toBe(201);
    d = await viewer.json('GET', erp(co, `/documents/${doc.id}`));
    expect(d.versions.map((v: any) => v.version)).toEqual([2, 1]);
    const dl = await viewer.req('GET', d.versions[0].url);
    expect(dl.status).toBe(200);
    expect(dl.headers.get('Content-Type')).toBe('application/octet-stream');
    expect(dl.headers.get('Content-Disposition')).toMatch(/^attachment/);
    expect(new TextDecoder().decode(await dl.arrayBuffer())).toContain('ISO-10303-21');
    const stepBad = new FormData();
    stepBad.set('file', new File(['<html><script>alert(1)</script>'], 'fake.step'));
    expect((await engineer.req('POST', erp(co, `/documents/${doc.id}/versions`), stepBad)).status).toBe(400);
    const dxf = new FormData();
    dxf.set('file', new File(['  0\nSECTION\n  2\nHEADER\n  0\nENDSEC\n  0\nEOF\n'], 'flange.dxf'));
    dxf.set('productId', p.id);
    dxf.set('title', 'Flange profile');
    dxf.set('kind', 'dxf');
    expect((await engineer.req('POST', erp(co, '/documents'), dxf)).status).toBe(201);
    const exe = new FormData();
    exe.set('file', new File(['MZ'], 'tool.exe'));
    exe.set('productId', p.id);
    exe.set('title', 'Nope');
    exe.set('kind', 'other');
    expect((await engineer.req('POST', erp(co, '/documents'), exe)).status).toBe(400);

    // Approval by an engineering approver; a new version sends it back to draft; obsolete takes no more versions.
    expect((await engineer.req('POST', erp(co, `/documents/${doc.id}/approve`), {})).status).toBe(403);
    expect((await approver.json('POST', erp(co, `/documents/${doc.id}/approve`), {})).status).toBe('approved');
    await engineer.json('POST', erp(co, `/documents/${doc.id}/versions`), { cadPath: 'C:\\Parts\\Flange-v3.SLDPRT', docRevision: 'C' });
    expect((await viewer.json('GET', erp(co, `/documents/${doc.id}`))).document).toMatchObject({ status: 'draft', latestVersion: 3 });
    await approver.json('POST', erp(co, `/documents/${doc.id}/obsolete`), {});
    expect((await engineer.req('POST', erp(co, `/documents/${doc.id}/versions`), { cadPath: 'C:\\x.SLDPRT' })).status).toBe(409);
    const list = await viewer.json('GET', erp(co, `/documents?productId=${p.id}`));
    expect(list.total).toBe(2);
    expect((await viewer.json('GET', erp(co, `/products/${p.id}`))).documents).toHaveLength(2);
  });
});

describe('the supplier master', () => {
  it('runs pending, approved, on hold and blocked with segregation of duties, and checks the ABN’s form only', async () => {
    const t = await team('Zeta');
    const { buyer, manager, owner, engineer, viewer, co } = t;
    const abn = newAbn();
    const s1 = await buyer.json('POST', erp(co, '/suppliers'), {
      legalName: 'Example Castings Pty Ltd',
      tradingName: 'Example Castings',
      abn: `${abn.slice(0, 2)} ${abn.slice(2, 5)} ${abn.slice(5, 8)} ${abn.slice(8)}`,
      category: 'Castings',
      email: 'orders@example.com',
      phone: '02 9000 0000',
      website: 'https://example.com',
      postalAddress: '1 Example Road, Sydney NSW 2000',
      paymentTermsDays: 30,
      currency: 'AUD',
      leadTimeDays: 21,
    });
    expect(s1).toMatchObject({ number: 'SUP-0001', status: 'pending', abnCheck: 'format_checked', name: 'Example Castings' });
    expect(s1.abn.replace(/\s/g, '')).toBe(abn);
    const bad = await buyer.req('POST', erp(co, '/suppliers'), { legalName: 'Wrong ABN', abn: badAbn() });
    expect(bad.status).toBe(400);
    expect(((await bad.json()) as any).error).toMatch(/check digits/);
    expect((await buyer.req('POST', erp(co, '/suppliers'), { legalName: 'Same ABN', abn })).status).toBe(409);
    const detail = await viewer.json('GET', erp(co, `/suppliers/${s1.id}`));
    expect(detail.abnNote).toMatch(/not looked up/);
    expect(detail.abnNote).not.toMatch(/verified/i);
    // Release 2: measured from goods receipts; none yet.
    expect(detail.performance).toMatchObject({ measured: true, receipts: 0, onTimeRate: null, inFullRate: null, avgLeadTimeDays: null });

    // Who may act: buyers create, procurement managers approve; nobody else.
    expect((await engineer.req('POST', erp(co, '/suppliers'), { legalName: 'No' })).status).toBe(403);
    expect((await viewer.req('PATCH', erp(co, `/suppliers/${s1.id}`), { category: 'x' })).status).toBe(403);
    expect((await buyer.req('POST', erp(co, `/suppliers/${s1.id}/status`), { status: 'approved' })).status).toBe(403);
    const ok = await manager.json('POST', erp(co, `/suppliers/${s1.id}/status`), { status: 'approved' });
    expect(ok).toMatchObject({ status: 'approved', approvedByName: 'Zeta manager', sodException: false });
    // The procurement manager cannot approve a supplier they created; the owner (an ERP administrator) can.
    const s2 = await manager.json('POST', erp(co, '/suppliers'), { legalName: 'Second Supplier Pty Ltd' });
    const sod = await manager.req('POST', erp(co, `/suppliers/${s2.id}/status`), { status: 'approved' });
    expect(sod.status).toBe(403);
    expect(((await sod.json()) as any).error).toMatch(/segregation of duties/);
    await owner.json('POST', erp(co, `/suppliers/${s2.id}/status`), { status: 'approved' });
    // Hold and block need a reason; on hold only from approved.
    expect((await manager.req('POST', erp(co, `/suppliers/${s1.id}/status`), { status: 'on_hold' })).status).toBe(400);
    await manager.json('POST', erp(co, `/suppliers/${s1.id}/status`), { status: 'on_hold', note: 'Late deliveries under review' });
    await manager.json('POST', erp(co, `/suppliers/${s1.id}/status`), { status: 'approved', note: 'Resolved' });
    await manager.json('POST', erp(co, `/suppliers/${s2.id}/status`), { status: 'blocked', note: 'Quality failure' });
    // A blocked supplier cannot supply a product; an approved one can, with one preferred supplier per product.
    const p = await product(engineer, co, { name: 'Casting' });
    expect((await buyer.req('PUT', erp(co, `/products/${p.id}/suppliers/${s2.id}`), { priceCents: 100 })).status).toBe(409);
    await buyer.json('PUT', erp(co, `/products/${p.id}/suppliers/${s1.id}`), { supplierPartNumber: 'EC-55', priceCents: 1850, leadTimeDays: 14, preferred: true });
    expect((await viewer.json('GET', erp(co, `/suppliers/${s1.id}`))).products).toMatchObject([{ productId: p.id, supplierPartNumber: 'EC-55', preferred: true }]);
    // Changing the legal name of an approved supplier sends it back for approval.
    expect((await buyer.json('PATCH', erp(co, `/suppliers/${s1.id}`), { legalName: 'Example Castings Holdings Pty Ltd' })).status).toBe('pending');
    // Contacts: the first is primary.
    const c1 = await buyer.json('POST', erp(co, `/suppliers/${s1.id}/contacts`), { name: 'Sam Sales', role: 'Sales', email: 'sam@example.com' });
    expect(c1.contacts[0]).toMatchObject({ name: 'Sam Sales', isPrimary: true });
    const c2 = await buyer.json('POST', erp(co, `/suppliers/${s1.id}/contacts`), { name: 'Alex Accounts', isPrimary: true });
    expect(c2.contacts.filter((x: any) => x.isPrimary).map((x: any) => x.name)).toEqual(['Alex Accounts']);
    // A supplier document.
    const fd = new FormData();
    fd.set('file', new File([PNG], 'certificate.png', { type: 'image/png' }));
    fd.set('supplierId', s1.id);
    expect((await buyer.req('POST', erp(co, '/files'), fd)).status).toBe(201);
    expect((await viewer.json('GET', erp(co, `/suppliers/${s1.id}`))).files).toHaveLength(1);
    const h = (await viewer.json('GET', erp(co, `/suppliers/${s1.id}`))).history.map((e: any) => e.action);
    expect(h).toEqual(expect.arrayContaining(['supplier.created', 'supplier.approved', 'supplier.on_hold', 'supplier.updated', 'supplier.contact_added', 'file.uploaded']));
  });

  it('links a supplier to Finance’s supplier contact without copying it, and refuses people without a Finance role', async () => {
    const t = await team('Eta');
    const { buyer, owner, viewer, co, tools } = t;
    const s = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Linked Supplies Pty Ltd', email: 'ap@example.com', paymentTermsDays: 30 });
    // The buyer has no role in the company's Finance: refused, with nothing created there.
    const before = await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_contacts WHERE org_id = ?').bind(tools.finance).first<{ n: number }>();
    const refused = await buyer.req('POST', erp(co, `/suppliers/${s.id}/finance`), { finOrgId: tools.finance, create: true });
    expect(refused.status).toBe(403);
    expect((await buyer.json('GET', erp(co, `/suppliers/${s.id}`))).finance).toMatchObject({ linked: false, orgs: [{ id: tools.finance, access: false }] });
    // A viewer cannot link at all.
    expect((await viewer.req('POST', erp(co, `/suppliers/${s.id}/finance`), { finOrgId: tools.finance, create: true })).status).toBe(403);
    // The owner (Finance owner) creates the Finance supplier once and links it.
    const linked = await owner.json('POST', erp(co, `/suppliers/${s.id}/finance`), { finOrgId: tools.finance, create: true });
    expect(linked).toMatchObject({ linked: true, contact: { name: 'Linked Supplies Pty Ltd' } });
    const fin = await env.DB.prepare("SELECT id, kind, terms_days FROM fin_contacts WHERE org_id = ? AND name = 'Linked Supplies Pty Ltd'").bind(tools.finance).all<any>();
    expect(fin.results).toHaveLength(1);
    expect(fin.results[0]).toMatchObject({ kind: 'supplier', terms_days: 30 });
    const after = await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_contacts WHERE org_id = ?').bind(tools.finance).first<{ n: number }>();
    expect(after!.n).toBe(before!.n + 1);
    expect((await owner.req('POST', erp(co, `/suppliers/${s.id}/finance`), { finOrgId: tools.finance, create: true })).status).toBe(409);
    // The buyer sees that it is linked, but not Finance's record.
    expect((await buyer.json('GET', erp(co, `/suppliers/${s.id}`))).finance).toMatchObject({ linked: true, contact: null, hidden: true });

    // Link an existing Finance supplier contact; the same contact cannot back two suppliers.
    const existing = await owner.json('POST', `/api/fin/orgs/${tools.finance}/contacts`, { name: 'Existing Vendor', kind: 'supplier' });
    const s2 = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Existing Vendor Pty Ltd' });
    const s3 = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Another Vendor' });
    const options = await owner.json('GET', erp(co, `/suppliers/${s2.id}/finance/contacts?org=${tools.finance}`));
    expect(options.contacts.map((x: any) => x.id)).toContain(existing.id);
    expect(options.contacts.map((x: any) => x.name)).not.toContain('Linked Supplies Pty Ltd');
    await owner.json('POST', erp(co, `/suppliers/${s2.id}/finance`), { finOrgId: tools.finance, finContactId: existing.id });
    expect((await owner.req('POST', erp(co, `/suppliers/${s3.id}/finance`), { finOrgId: tools.finance, finContactId: existing.id })).status).toBe(409);
    // Another company's Finance workspace is not offered and not accepted.
    const other = await team('Theta');
    expect((await owner.req('POST', erp(co, `/suppliers/${s3.id}/finance`), { finOrgId: other.tools.finance, create: true })).status).toBe(404);
    // Unlinking keeps Finance's contact.
    await owner.json('DELETE', erp(co, `/suppliers/${s2.id}/finance`));
    expect(await env.DB.prepare('SELECT id FROM fin_contacts WHERE id = ?').bind(existing.id).first()).toBeTruthy();
    // A Finance role that may see contacts but not create them can link an existing one but not create.
    const clerk = await signup('Eta clerk');
    await joinCompany(owner, co, clerk, 'member', 'viewer');
    await owner.json('PUT', erp(co, `/roles/${clerk.userId}`), { roles: ['buyer'] });
    const s4 = await clerk.json('POST', erp(co, '/suppliers'), { legalName: 'Clerk Supplies' });
    const noCreate = await clerk.req('POST', erp(co, `/suppliers/${s4.id}/finance`), { finOrgId: tools.finance, create: true });
    expect(noCreate.status).toBe(403);
    expect(((await noCreate.json()) as any).error).toMatch(/Finance role/);
    expect((await clerk.req('POST', erp(co, `/suppliers/${s4.id}/finance`), { finOrgId: tools.finance, finContactId: existing.id })).status).toBe(201);
  });
});

describe('isolation and roles', () => {
  it('keeps each company’s records to itself: other companies, guests, outsiders and the example company get 404', async () => {
    const one = await team('Iota');
    const two = await team('Kappa');
    const p1 = await product(one.engineer, one.co, { name: 'Secret part' });
    const r1 = await firstRevision(one.engineer, one.co, p1.id);
    const s1 = await one.buyer.json('POST', erp(one.co, '/suppliers'), { legalName: 'Iota Supplier' });
    const d1 = await one.engineer.json('POST', erp(one.co, '/documents'), { productId: p1.id, title: 'Model', kind: 'model', cadPath: 'C:\\a.SLDPRT' });
    const e1 = await one.engineer.json('POST', erp(one.co, '/change-orders'), { title: 'x', productIds: [p1.id] });
    // Another company's people: 404 on the company and on its records.
    for (const path of ['/me', '/products', `/products/${p1.id}`, `/revisions/${r1.id}`, `/suppliers/${s1.id}`, `/documents/${d1.id}`, `/change-orders/${e1.id}`, '/reports/catalogue']) {
      expect((await two.owner.req('GET', erp(one.co, path))).status, path).toBe(404);
    }
    // The first company's ids at the second company's address: 404 too, and never linkable.
    for (const path of [`/products/${p1.id}`, `/revisions/${r1.id}`, `/suppliers/${s1.id}`, `/documents/${d1.id}`, `/change-orders/${e1.id}`, `/products/${p1.id}/where-used`]) {
      expect((await two.owner.req('GET', erp(two.co, path))).status, path).toBe(404);
    }
    const p2 = await product(two.engineer, two.co, { name: 'Kappa part' });
    const r2 = await firstRevision(two.engineer, two.co, p2.id);
    expect((await two.engineer.req('POST', erp(two.co, `/revisions/${r2.id}/lines`), { componentId: p1.id, quantity: 1 })).status).toBe(404);
    expect((await two.buyer.req('PUT', erp(two.co, `/products/${p2.id}/suppliers/${s1.id}`), {})).status).toBe(404);
    expect((await two.engineer.req('POST', erp(two.co, '/change-orders'), { title: 'x', productIds: [p1.id] })).status).toBe(404);
    expect((await two.engineer.req('POST', erp(two.co, '/documents'), { productId: p1.id, title: 'x', kind: 'model', cadPath: 'C:\\b' })).status).toBe(404);
    // The database itself refuses a cross-company link.
    await expect(
      env.DB.prepare("INSERT INTO erp_bom_lines (id, company_id, revision_id, component_id, quantity, created_at, updated_at) VALUES ('x1', ?, ?, ?, 1, 0, 0)").bind(two.co, r2.id, p1.id).run(),
    ).rejects.toThrow();

    // A guest (shares only a CRM organisation with the company) and an outsider: 404.
    const guest = await signup('Iota guest');
    await joinOrg(one.owner, one.tools.crm!, guest, 'member');
    expect((await guest.req('GET', erp(one.co, '/me'))).status).toBe(404);
    const outsider = await signup('Outsider');
    expect((await outsider.req('GET', erp(one.co, '/products'))).status).toBe(404);
    expect((await outsider.req('POST', erp(one.co, '/products'), { name: 'x', type: 'component' })).status).toBe(404);

    // A person's own company: theirs alone.
    const solo = await signup('Solo person');
    const own = (await solo.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    await product(solo, own.id, { name: 'Own part' });
    expect((await one.owner.req('GET', erp(own.id, '/products'))).status).toBe(404);
    const crm = await createOrg(solo, 'Solo leads');
    await joinOrg(solo, crm, one.viewer, 'member');
    expect((await one.viewer.req('GET', erp(own.id, '/me'))).status).toBe(404);

    // Example companies: the owner's own invented data; nobody else gets in.
    const ex = await signup('Example owner');
    const built = (await (await ex.req('POST', '/api/system/demo', {})).json()) as any;
    expect(built.status).toBe('ready');
    expect((await ex.json('GET', erp(built.companyId, '/me'))).roles).toEqual(['erp_admin']);
    expect((await one.owner.req('GET', erp(built.companyId, '/products'))).status).toBe(404);
    expect((await ex.req('PUT', erp(built.companyId, `/roles/${one.owner.userId}`), { roles: ['viewer'] })).status).toBe(400);
  });

  it('gives each ERP role what it may do and refuses the rest (403)', async () => {
    const t = await team('Lambda');
    const { owner, engineer, approver, buyer, manager, executive, viewer, co } = t;
    const roles = async (c: Client) => (await c.json('GET', erp(co, '/me'))).roles;
    expect(await roles(owner)).toEqual(['erp_admin']);
    expect(await roles(viewer)).toEqual(['viewer']);
    expect(await roles(engineer)).toEqual(['engineer']);
    // A company administrator is an ERP administrator.
    const admin = await signup('Lambda admin');
    await joinCompany(owner, co, admin, 'admin');
    expect(await roles(admin)).toEqual(['erp_admin']);
    expect((await owner.req('PUT', erp(co, `/roles/${admin.userId}`), { roles: ['viewer'] })).status).toBe(400);
    // Several roles at once.
    const both = await owner.json('PUT', erp(co, `/roles/${buyer.userId}`), { roles: ['buyer', 'engineer'] });
    expect(both.roles.sort()).toEqual(['buyer', 'engineer']);
    await owner.json('PUT', erp(co, `/roles/${buyer.userId}`), { roles: ['buyer'] });

    const p = await product(engineer, co, { name: 'Part' });
    const s = await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Supplier' });
    const checks: [Client, string, string, unknown, number][] = [
      [viewer, 'GET', '/products', undefined, 200],
      [viewer, 'GET', '/suppliers', undefined, 200],
      [viewer, 'GET', '/reports/bom-cost', undefined, 200],
      [viewer, 'POST', '/products', { name: 'x', type: 'component' }, 403],
      [viewer, 'POST', '/suppliers', { legalName: 'x' }, 403],
      [viewer, 'GET', '/roles', undefined, 403],
      [viewer, 'GET', '/events', undefined, 403],
      [executive, 'GET', '/events', undefined, 200],
      [executive, 'GET', '/reports/changes', undefined, 200],
      [executive, 'PATCH', `/products/${p.id}`, { name: 'y' }, 403],
      [buyer, 'POST', '/products', { name: 'x', type: 'component' }, 403],
      [buyer, 'PUT', `/products/${p.id}/suppliers/${s.id}`, { priceCents: 10 }, 200],
      [buyer, 'POST', `/suppliers/${s.id}/status`, { status: 'approved' }, 403],
      [engineer, 'POST', `/suppliers/${s.id}/status`, { status: 'approved' }, 403],
      [engineer, 'POST', '/suppliers', { legalName: 'x' }, 403],
      [engineer, 'PUT', `/roles/${viewer.userId}`, { roles: ['engineer'] }, 403],
      [manager, 'POST', `/suppliers/${s.id}/status`, { status: 'approved' }, 200],
      [approver, 'POST', '/products', { name: 'Approver part', type: 'component' }, 201],
    ];
    for (const [who, m, path, b, status] of checks) expect((await who.req(m, erp(co, path), b)).status, `${who.name} ${m} ${path}`).toBe(status);
    const rolesView = await owner.json('GET', erp(co, '/roles'));
    expect(rolesView.roles.map((r: any) => r.value)).toEqual(['erp_admin', 'executive', 'engineer', 'engineering_approver', 'buyer', 'procurement_manager', 'warehouse_manager', 'warehouse_operator', 'production_manager', 'production_operator', 'quality_manager', 'quality_inspector', 'sales_manager', 'whs_manager', 'whs_officer', 'whs_investigator', 'whs_hsr', 'health_officer', 'viewer']);
    expect(rolesView.people.find((x: any) => x.id === viewer.userId)).toMatchObject({ roles: ['viewer'], rolesAreDefault: true });
    const ev = (await owner.json('GET', erp(co, '/events'))).events.find((e: any) => e.action === 'role.changed');
    expect(ev.before).toBeTruthy();
    expect(ev.after).toBeTruthy();
  });
});

describe('numbering, lists, reports and CSV', () => {
  it('gives unique numbers under concurrency and moves past numbers typed by hand', async () => {
    const t = await team('Mu');
    const { engineer, co } = t;
    await product(engineer, co, { number: 'PRD-00005', name: 'Typed by hand' });
    const made = await Promise.all(Array.from({ length: 8 }, (_, i) => product(engineer, co, { name: `Part ${i}` })));
    const numbers = made.map((p) => p.number).sort();
    expect(new Set(numbers).size).toBe(8);
    expect(numbers[0]).toBe('PRD-00006');
    expect(numbers[7]).toBe('PRD-00013');
    expect((await engineer.req('POST', erp(co, '/products'), { number: 'prd-00005', name: 'Duplicate', type: 'component' })).status).toBe(409);
    const ecos = await Promise.all(Array.from({ length: 4 }, (_, i) => engineer.json('POST', erp(co, '/change-orders'), { title: `ECO ${i}` })));
    expect(ecos.map((e) => e.number).sort()).toEqual(['ECO-0001', 'ECO-0002', 'ECO-0003', 'ECO-0004']);
  });

  it('lists with search, filters, sort and paging, and exports CSV from lists and reports', async () => {
    const t = await team('Nu');
    const { engineer, approver, buyer, viewer, co } = t;
    const asm = await product(engineer, co, { name: 'Gearbox', type: 'assembly', category: 'Drives', standardCostCents: 5000, priceCents: 9000 });
    const gear = await product(engineer, co, { name: 'Spur gear', category: 'Drives', standardCostCents: 700 });
    for (let i = 0; i < 5; i++) await product(engineer, co, { name: `Washer ${i}`, category: 'Fasteners', standardCostCents: 5 });
    await line(engineer, co, (await firstRevision(engineer, co, asm.id)).id, { componentId: gear.id, quantity: 3 });
    await releaseThrough({ engineer, approver, co }, [asm.id]);
    await buyer.json('POST', erp(co, '/suppliers'), { legalName: 'Drive Parts', category: 'Drives' });

    const page = await viewer.json('GET', erp(co, '/products?category=Fasteners&sort=name&dir=desc&limit=2&offset=1'));
    expect(page.total).toBe(5);
    expect(page.products.map((p: any) => p.name)).toEqual(['Washer 3', 'Washer 2']);
    expect(page.categories).toEqual(['Drives', 'Fasteners']);
    expect((await viewer.json('GET', erp(co, '/products?q=spur'))).products.map((p: any) => p.id)).toEqual([gear.id]);
    expect((await viewer.json('GET', erp(co, '/products?type=assembly'))).total).toBe(1);

    const catalogue = await viewer.json('GET', erp(co, '/reports/catalogue'));
    expect(catalogue.total).toBe(7);
    expect(catalogue.withoutRelease).toBe(6);
    const bomCost = await viewer.json('GET', erp(co, '/reports/bom-cost'));
    expect(bomCost.rows).toMatchObject([{ id: asm.id, rolledUpCents: 2100, complete: true, marginCents: 6900 }]);
    const wu = await viewer.json('GET', erp(co, '/reports/where-used'));
    expect(wu.rows).toMatchObject([{ id: gear.id, releasedParents: 1, parentNumbers: [asm.number] }]);
    const changes = await viewer.json('GET', erp(co, '/reports/changes?status=released'));
    expect(changes.rows).toHaveLength(1);
    expect(changes.revisions.released).toBe(1);
    const lifecycle = await viewer.json('GET', erp(co, '/reports/lifecycle'));
    expect(lifecycle.stages.find((s: any) => s.value === 'draft').n).toBe(7);
    const sup = await viewer.json('GET', erp(co, '/reports/suppliers'));
    expect(sup.byStatus.find((s: any) => s.value === 'pending').n).toBe(1);
    expect(sup.performance).toMatch(/goods receipts/);

    for (const [path, header] of [
      ['/products?format=csv', 'Number,SKU,Name'],
      ['/suppliers?format=csv', 'Number,Legal name'],
      ['/change-orders?format=csv', 'Number,Title,Status'],
      ['/change-requests?format=csv', 'Number,Title,Status'],
      ['/documents?format=csv', 'Number,Title,Kind'],
      ['/reports/catalogue?format=csv', 'Number,SKU,Name'],
      ['/reports/lifecycle?format=csv', 'Number,Name,Type'],
      ['/reports/bom-cost?format=csv', 'Number,Name,Type,Revision,Rolled-up cost'],
      ['/reports/where-used?format=csv', 'Number,Name,Type'],
      ['/reports/changes?format=csv', 'Change order,Title'],
      ['/reports/suppliers?format=csv', 'Number,Legal name'],
      [`/products/${gear.id}/where-used?format=csv`, 'Parent number'],
    ] as const) {
      const res = await viewer.req('GET', erp(co, path));
      expect(res.status, path).toBe(200);
      expect(res.headers.get('Content-Type'), path).toMatch(/text\/csv/);
      expect(res.headers.get('Content-Disposition'), path).toMatch(/attachment/);
      expect((await res.text()).startsWith(header), path).toBe(true);
    }
    const csv = await (await viewer.req('GET', erp(co, '/reports/bom-cost?format=csv'))).text();
    expect(csv).toContain('21.00');
  });
});

describe('the example company', () => {
  it('gets products, a released two-level bill of materials, a draft change order and two suppliers, and loses them on removal', async () => {
    const ex = await signup('Example learner');
    const built = (await (await ex.req('POST', '/api/system/demo', {})).json()) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const list = await ex.json('GET', erp(co, '/products?limit=100'));
    expect(list.total).toBe(8);
    const kit = list.products.find((p: any) => p.sku === 'SBK-100');
    expect(kit).toMatchObject({ releasedRevision: 'A', lifecycle: 'active' });
    const ex1 = await ex.json('GET', erp(co, `/revisions/${kit.releasedRevisionId}/explosion`));
    expect(Math.max(...ex1.nodes.map((n: any) => n.level))).toBe(2);
    const cost = await ex.json('GET', erp(co, `/revisions/${kit.releasedRevisionId}/cost`));
    // 2 x (420 + 2 x 1.05 x 120) + 4 x 18 + 4 x 9 + 150 = 2 x 672 + 72 + 36 + 150 = 1602 cents
    expect(cost).toMatchObject({ unitCostCents: 1602, complete: true });
    const orders = await ex.json('GET', erp(co, '/change-orders'));
    expect(orders.orders.map((o: any) => [o.number, o.status, o.sodException]).sort()).toEqual([
      ['ECO-0001', 'released', true],
      ['ECO-0002', 'draft', false],
    ]);
    const suppliers = await ex.json('GET', erp(co, '/suppliers'));
    // Release 1's two suppliers, Release 2's two approved fastener suppliers and Release 3's approved coating supplier.
    expect(suppliers.suppliers.map((s: any) => s.status).sort()).toEqual(['approved', 'approved', 'approved', 'approved', 'pending']);
    expect(suppliers.suppliers.every((s: any) => s.abn === '')).toBe(true);
    expect((await ex.json('GET', erp(co, '/documents'))).documents[0]).toMatchObject({ latestSource: 'cad_reference' });
    // The example's Finance workspace is the one a supplier may link to.
    const steel = suppliers.suppliers.find((s: any) => s.legalName === 'Example Steel Supplies');
    const fin = (await ex.json('GET', erp(co, `/suppliers/${steel.id}`))).finance;
    expect(fin.orgs).toHaveLength(1);
    expect(fin.canLink).toBe(true);

    await ex.json('POST', '/api/system/demo/remove', {});
    for (const table of ['erp_products', 'erp_revisions', 'erp_bom_lines', 'erp_change_orders', 'erp_suppliers', 'erp_documents', 'erp_events', 'erp_counters']) {
      const n = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE company_id = ?`).bind(co).first<{ n: number }>();
      expect(n!.n, table).toBe(0);
    }
    expect((await ex.req('GET', erp(co, '/products'))).status).toBe(404);
  });
});
