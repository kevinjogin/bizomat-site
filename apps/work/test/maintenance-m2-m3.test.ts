// BIZOMAT ERP Release 4, part B: Maintenance stages M2 and M3 (src/worker/maintenance). The owner's Scenario F (create an
// asset, schedule preventive maintenance, generate the work order, record labour and parts, complete it; the next due
// date moves on) runs end to end with exact costs. Then each rule the brief sets: meter- and condition-based triggers,
// idempotent generation (the cron twice, and runs at the same moment), a failed inspection's follow-up made once, a
// prestart failure setting the asset out of service and raising a request, parts issued and returned through ERP
// Inventory with a concurrent last-unit issue refused, technicians issuing only to their own work orders, isolation
// between companies, sites, the reports with exact numbers, and the example company.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { generateDue } from '../src/worker/maintenance/pm';
import { runMaintenance } from '../src/worker/index';

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

/** A maintenance store (an ERP warehouse) with a bin, and a spare part with stock at a known cost. */
async function store(owner: Client, co: string, part = { name: 'Hydraulic filter', qty: 10, cost: 1250 }) {
  await owner.json('PUT', erp(co, '/erp-settings'), { adjustmentApprovalCents: 100_000_000, costingMethod: 'weighted_average' });
  const wh = await owner.json('POST', erp(co, '/warehouses'), { code: `MS${Math.floor(Math.random() * 1e6)}`, name: 'Maintenance store' });
  const bin = await owner.json('POST', erp(co, '/locations'), { warehouseId: wh.id, code: 'B1', name: 'Bin 1' });
  const product = await owner.json('POST', erp(co, '/products'), { name: part.name, type: 'consumable', standardCostCents: part.cost });
  const adj = await owner.json('POST', erp(co, '/adjustments'), { productId: product.id, locationId: bin.id, quantity: part.qty, unitCostCents: part.cost, reason: 'Opening stock' });
  expect(adj.status).toBe('posted');
  return { wh, bin, product };
}

const onHand = async (c: Client, co: string, productId: string) => (await c.json('GET', erp(co, `/products/${productId}/stock`))).totals.onHand as number;

describe('Scenario F: create asset, schedule preventive maintenance, generate the work order, record labour and parts, complete it', () => {
  it('runs end to end with exact costs, and the next due date moves on', async () => {
    const { owner, supervisor, tech, requester, co } = await team('Foxtrot');
    // Rates: the technician's own, and a trade's.
    const fitter = await supervisor.json('POST', mt(co, '/trades'), { name: 'Fitter', rateCents: 5000 });
    await supervisor.json('PUT', mt(co, `/technicians/${tech.userId}`), { rateCents: 6000, tradeIds: [fitter.id] });
    expect((await tech.req('POST', mt(co, '/trades'), { name: 'Nope' })).status).toBe(403);
    const { wh, bin, product } = await store(owner, co);
    await owner.json('PUT', mt(co, `/stores/${wh.id}`), { store: true });
    expect((await supervisor.req('PUT', mt(co, `/stores/${wh.id}`), { store: true })).status).toBe(403);

    // Create the asset and an inspection template.
    const press = await supervisor.json('POST', mt(co, '/assets'), { number: 'HP-01', name: 'Hydraulic press', category: 'Press', criticality: 'high', strategy: 'preventive' });
    const checklist = await supervisor.json('POST', mt(co, '/inspection-templates'), {
      name: 'Press monthly check',
      failAction: 'work_order',
      items: [
        { label: 'Guards in place', kind: 'pass_fail', critical: true },
        { label: 'Hydraulic pressure', kind: 'number', unit: 'bar', min: 150, max: 180 },
        { label: 'Remarks', kind: 'text', required: false },
      ],
    });
    expect(checklist.items).toHaveLength(3);

    // Schedule preventive maintenance: every 30 days from the last completion, first due today.
    expect((await tech.req('POST', mt(co, '/pm/schedules'), { assetId: press.id, name: 'x', triggerKind: 'time', intervalN: 1, intervalUnit: 'month' })).status).toBe(403);
    expect((await supervisor.req('POST', mt(co, '/pm/schedules'), { assetId: press.id, name: 'No interval', triggerKind: 'time' })).status).toBe(400);
    const pm = await supervisor.json('POST', mt(co, `/pm/schedules?today=${today()}`), {
      assetId: press.id,
      name: 'Monthly press service',
      description: 'Change the hydraulic filter and check the guards',
      triggerKind: 'time',
      intervalN: 30,
      intervalUnit: 'day',
      startDate: today(),
      jobType: 'preventive',
      priority: 'high',
      tasks: ['Isolate the press', 'Change the hydraulic filter', 'Run and check for leaks'],
      parts: [{ part: 'Hydraulic filter', quantity: 2 }],
      estimatedHours: 2,
      leadDays: 0,
      trade: 'Fitter',
      assignedTo: tech.userId,
      inspectionTemplateId: checklist.id,
      instructions: 'Follow the press service sheet.',
      safety: 'Lock out the press before opening any panel.',
    });
    expect(pm).toMatchObject({ triggerKind: 'time', nextDueDate: today(), active: true, assignedToName: 'Foxtrot Technician', inspectionTemplateName: 'Press monthly check', openWorkOrder: null });
    expect((await requester.json('GET', mt(co, '/pm/schedules'))).schedules).toHaveLength(1);

    // Generate the work order (the button). Pressing it again makes nothing more.
    const gen = await supervisor.json('POST', mt(co, '/pm/generate'), { today: today() });
    expect(gen.made).toHaveLength(1);
    expect(gen.made[0]).toMatchObject({ scheduleId: pm.id, dueDate: today(), key: `t:${today()}` });
    expect((await supervisor.json('POST', mt(co, '/pm/generate'), { today: today() })).made).toHaveLength(0);
    const woId = gen.made[0].workOrderId;
    let d = await tech.json('GET', mt(co, `/work-orders/${woId}`));
    expect(d.workOrder).toMatchObject({ jobType: 'preventive', priority: 'high', status: 'assigned', assignedTo: tech.userId, dueFinish: today(), estimatedMinutes: 120, trade: 'Fitter', safety: 'Lock out the press before opening any panel.' });
    expect(d.workOrder.description).toBe('Monthly press service: Change the hydraulic filter and check the guards');
    expect(d.tasks.map((t: any) => t.text)).toEqual(['Isolate the press', 'Change the hydraulic filter', 'Run and check for leaks']);
    expect(d.parts).toEqual([expect.objectContaining({ part: 'Hydraulic filter', quantity: 2 })]);
    expect(d.preventive).toMatchObject({ scheduleId: pm.id, name: 'Monthly press service', dueDate: today() });
    expect(d.inspections).toHaveLength(1);
    expect(d.costs).toBeNull();
    expect(d.can.seeCosts).toBe(false);
    expect((await supervisor.json('GET', mt(co, `/pm/schedules/${pm.id}`))).schedule.openWorkOrder).toMatchObject({ id: woId, status: 'assigned' });

    // Record labour: the timer, and 90 minutes entered by hand (priced at the technician's own rate, 60.00 an hour).
    expect((await tech.req('POST', mt(co, `/work-orders/${woId}/timer/start`), {})).status).toBe(201);
    expect((await tech.req('POST', mt(co, `/work-orders/${woId}/timer/stop`), {})).status).toBe(200);
    expect((await tech.req('POST', mt(co, `/work-orders/${woId}/labour`), { date: today(), minutes: 90, note: 'Filter change and leak test' })).status).toBe(201);
    expect((await tech.req('POST', mt(co, `/work-orders/${woId}/labour`), { date: day(3), minutes: 30 })).status).toBe(400);
    expect((await tech.req('POST', mt(co, `/work-orders/${woId}/labour`), { date: today(), minutes: 30, userId: supervisor.userId })).status).toBe(403);
    // ... and 30 minutes of the supervisor's, entered by the supervisor: no own rate, so the work order's trade (50.00).
    expect((await supervisor.req('POST', mt(co, `/work-orders/${woId}/labour`), { date: today(), minutes: 30 })).status).toBe(201);

    // Record parts: two filters issued from the maintenance store through ERP Inventory.
    const stock = await tech.json('GET', mt(co, `/stores/stock?productId=${product.id}`));
    expect(stock.stock).toEqual([expect.objectContaining({ productId: product.id, locationId: bin.id, onHand: 10, available: 10, unitCostCents: 1250 })]);
    expect((await tech.req('POST', mt(co, `/work-orders/${woId}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 2 }] })).status).toBe(201);
    expect(await onHand(owner, co, product.id)).toBe(8);

    // The inspection: guards pass, pressure 165 bar (inside 150 to 180).
    const insp = d.inspections[0];
    const item = (label: string) => insp.items.find((x: any) => x.label === label).id;
    await tech.json('PUT', mt(co, `/work-orders/${woId}/inspections/${insp.id}/results`), { results: [{ itemId: item('Guards in place'), passed: true }, { itemId: item('Hydraulic pressure'), value: 165 }] });
    expect((await tech.json('POST', mt(co, `/work-orders/${woId}/inspections/${insp.id}/complete`), {})).status).toBe('passed');

    // Complete the maintenance.
    await tech.json('POST', mt(co, `/work-orders/${woId}/complete`), { notes: 'Filter changed, no leaks, guards checked.' });
    d = await supervisor.json('GET', mt(co, `/work-orders/${woId}`));
    expect(d.workOrder.status).toBe('completed');
    expect(d.labourCosts.map((l: any) => [l.entry, l.minutes, l.rateCents, l.rateSource, l.costCents])).toEqual(
      expect.arrayContaining([
        ['manual', 90, 6000, 'person', 9000],
        ['manual', 30, 5000, 'work_order_trade', 2500],
        ['timer', 0, 6000, 'person', 0],
      ]),
    );
    expect(d.costs).toEqual({ labourCents: 11500, labourUnpricedMinutes: 0, partsCents: 2500, totalCents: 14000 });
    expect(d.stock.byProduct).toEqual([expect.objectContaining({ productId: product.id, issued: 2, costCents: 2500 })]);
    expect(d.stock.moves[0]).toMatchObject({ type: 'maintenance_issue', quantity: 2, unitCostCents: 1250, valueCents: 2500 });
    expect(d.stock.financePosting).toMatch(/^Planned/);

    // The next due date moved on: 30 days after the completion.
    const after = await supervisor.json('GET', mt(co, `/pm/schedules/${pm.id}`));
    expect(after.schedule).toMatchObject({ nextDueDate: day(30), lastDoneDate: today(), openWorkOrder: null });
    expect(after.occurrences).toEqual([expect.objectContaining({ dueDate: today(), open: false, onTime: true, workOrder: expect.objectContaining({ id: woId, status: 'completed' }) })]);
    expect((await supervisor.json('POST', mt(co, '/pm/generate'), { today: today() })).made).toHaveLength(0);

    // The stock ledger and the planned (never posted) Finance posting.
    const moves = await env.DB.prepare("SELECT move_type, on_hand_delta, value_delta_cents, source_type, source_id FROM erp_stock_moves WHERE company_id = ? AND source_type = 'work_order'").bind(co).all<any>();
    expect(moves.results).toEqual([{ move_type: 'maintenance_issue', on_hand_delta: -2, value_delta_cents: -2500, source_type: 'work_order', source_id: woId }]);
    const posting = await env.DB.prepare("SELECT kind, status, amount_cents FROM erp_integration_events WHERE company_id = ? AND source_type = 'work_order'").bind(co).first<any>();
    expect(posting).toEqual({ kind: 'finance.maintenance_posting', status: 'planned', amount_cents: -2500 });
    const fin = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_integration_events WHERE company_id = ? AND source_type = 'work_order' AND status <> 'planned'").bind(co).first<{ n: number }>();
    expect(fin!.n).toBe(0);

    // The history says what happened.
    const history = d.history.map((e: any) => e.action);
    expect(history).toEqual(expect.arrayContaining(['work_order.created', 'labour.entered', 'parts.issued', 'inspection.passed', 'work_order.completed', 'pm.completed']));

    // The asset page shows its schedule and its QR label; the label is an SVG.
    const assetView = await requester.json('GET', mt(co, `/assets/${press.id}`));
    expect(assetView.schedules.map((s: any) => s.id)).toEqual([pm.id]);
    const qr = await requester.req('GET', assetView.qrUrl);
    expect(qr.status).toBe(200);
    expect(qr.headers.get('Content-Type')).toMatch(/image\/svg\+xml/);
    expect(await qr.text()).toContain('<svg');
  });
});

describe('generation is idempotent', () => {
  it('makes one work order when the cron runs twice, and one when runs meet at the same moment', async () => {
    const { supervisor, co } = await team('Golf');
    const asset = await supervisor.json('POST', mt(co, '/assets'), { name: 'Compressor' });
    const s1 = await supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: asset.id, name: 'Weekly drain', triggerKind: 'time', intervalN: 1, intervalUnit: 'week', startDate: today() });
    // The cron's own hook (runMaintenance), twice.
    const r1 = await runMaintenance(env, Date.now());
    expect(r1.maintenancePm).toBeDefined();
    await runMaintenance(env, Date.now());
    const count = async (id: string) => (await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_pm_occurrences WHERE company_id = ? AND schedule_id = ?').bind(co, id).first<{ n: number }>())!.n;
    expect(await count(s1.id)).toBe(1);
    const wos = await env.DB.prepare("SELECT COUNT(*) AS n FROM mt_work_orders WHERE company_id = ? AND job_type = 'preventive'").bind(co).first<{ n: number }>();
    expect(wos!.n).toBe(1);

    // Two cron runs and the button, all at once.
    const s2 = await supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: asset.id, name: 'Weekly belt check', triggerKind: 'time', intervalN: 1, intervalUnit: 'week', startDate: today(), jobType: 'inspection' });
    const results = await Promise.all([generateDue(env.DB, { today: today(), actorId: null }), generateDue(env.DB, { today: today(), actorId: null }), supervisor.json('POST', mt(co, '/pm/generate'), { today: today() })]);
    const made = results.flatMap((r: any) => r.made).filter((m: any) => m.scheduleId === s2.id);
    expect(made).toHaveLength(1);
    expect(await count(s2.id)).toBe(1);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_work_orders WHERE company_id = ? AND job_type = ?').bind(co, 'inspection').first<{ n: number }>())!.n).toBe(1);

    // A paused schedule makes nothing; fixed dates keep their day of the month.
    await supervisor.json('PATCH', mt(co, `/pm/schedules/${s1.id}`), { active: false });
    const fixed = await supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: asset.id, name: 'Monthly on the 31st', triggerKind: 'time', intervalN: 1, intervalUnit: 'month', basis: 'fixed', startDate: '2027-01-31' });
    expect(fixed.nextDueDate).toBe('2027-01-31');
    const { addInterval } = await import('../src/worker/maintenance/m2util');
    expect([addInterval('2027-01-31', 1, 'month', 31), addInterval('2027-02-28', 1, 'month', 31), addInterval('2028-01-31', 1, 'month', 31)]).toEqual(['2027-02-28', '2027-03-31', '2028-02-29']);
  });
});

describe('meter-based and condition-based triggers', () => {
  it('makes a work order when the meter passes its interval, refuses a backwards reading unless it is a reset, and counts on past a rollover', async () => {
    const { supervisor, tech, requester, co } = await team('Hotel');
    const loader = await supervisor.json('POST', mt(co, '/assets'), { name: 'Wheel loader', category: 'Mobile plant' });
    const hours = await supervisor.json('POST', mt(co, '/meters'), { assetId: loader.id, name: 'Hours', unit: 'h' });
    expect((await requester.req('POST', mt(co, '/meters'), { assetId: loader.id, name: 'Nope' })).status).toBe(403);
    expect((await requester.json('POST', mt(co, `/meters/${hours.id}/readings`), { value: 1000 })).reading).toMatchObject({ value: 1000, delta: null, total: 1000 });
    const s = await supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: loader.id, name: '250-hour service', triggerKind: 'meter', meterId: hours.id, meterInterval: 250, leadDays: 3, assignedTo: tech.userId });
    expect(s).toMatchObject({ nextDueMeter: 1250, meterName: 'Hours' });
    expect((await requester.json('POST', mt(co, `/meters/${hours.id}/readings`), { value: 1200 })).generated).toEqual([]);
    const r = await requester.json('POST', mt(co, `/meters/${hours.id}/readings`), { value: 1260 });
    expect(r.reading).toMatchObject({ delta: 60, total: 1260 });
    expect(r.generated).toEqual([expect.objectContaining({ scheduleId: s.id, key: 'm:1250', dueDate: day(3) })]);
    // Another reading while it is open makes nothing more.
    expect((await requester.json('POST', mt(co, `/meters/${hours.id}/readings`), { value: 1300 })).generated).toEqual([]);
    // Backwards: refused, unless marked as a reset.
    const back = await requester.req('POST', mt(co, `/meters/${hours.id}/readings`), { value: 1100 });
    expect(back.status).toBe(409);
    expect(((await back.json()) as any).error).toMatch(/lower than the last reading/);
    // Complete the work order, with a reading from the work order: the next service is due 250 hours after it.
    const woId = r.generated[0].workOrderId;
    expect((await tech.json('POST', mt(co, `/meters/${hours.id}/readings`), { value: 1310, workOrderId: woId })).reading.total).toBe(1310);
    await tech.json('POST', mt(co, `/work-orders/${woId}/complete`), { notes: 'Serviced' });
    expect((await supervisor.json('GET', mt(co, `/pm/schedules/${s.id}`))).schedule).toMatchObject({ nextDueMeter: 1560, lastDoneMeter: 1310 });
    expect((await tech.json('GET', mt(co, `/work-orders/${woId}`))).readings).toEqual([expect.objectContaining({ meterId: hours.id, value: 1310 })]);
    // The meter was replaced: it reads 5 now, counted on from zero; the life total keeps rising.
    expect((await requester.json('POST', mt(co, `/meters/${hours.id}/readings`), { value: 5, reset: true })).reading).toMatchObject({ value: 5, delta: 5, total: 1315 });

    // An odometer that rolls over at 99,999: a reset past the rollover counts on.
    const odo = await supervisor.json('POST', mt(co, '/meters'), { assetId: loader.id, name: 'Odometer', unit: 'km', rolloverValue: 99999 });
    await requester.json('POST', mt(co, `/meters/${odo.id}/readings`), { value: 99990 });
    expect((await requester.json('POST', mt(co, `/meters/${odo.id}/readings`), { value: 10, reset: true })).reading).toMatchObject({ delta: 19, total: 100009 });
  });

  it('makes one work order per reading outside the limits, not while one is open, and not again for a reading taken while it was open', async () => {
    const { supervisor, tech, requester, co } = await team('India');
    const pump = await supervisor.json('POST', mt(co, '/assets'), { name: 'Cooling pump' });
    const temp = await supervisor.json('POST', mt(co, '/meters'), { assetId: pump.id, name: 'Bearing temperature', unit: 'C', rising: false, expectedMin: 10, expectedMax: 80 });
    expect((await supervisor.req('POST', mt(co, '/pm/schedules'), { assetId: pump.id, name: 'Meter on a gauge', triggerKind: 'meter', meterId: temp.id, meterInterval: 10 })).status).toBe(400);
    const s = await supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: pump.id, name: 'Bearing over temperature', triggerKind: 'condition', meterId: temp.id, jobType: 'inspection', assignedTo: tech.userId, leadDays: 1 });
    expect((await requester.json('POST', mt(co, `/meters/${temp.id}/readings`), { value: 70 })).generated).toEqual([]);
    const hot = await requester.json('POST', mt(co, `/meters/${temp.id}/readings`), { value: 85 });
    expect(hot.reading.outOfRange).toBe(true);
    expect(hot.generated).toEqual([expect.objectContaining({ scheduleId: s.id, key: `c:${hot.reading.id}`, dueDate: day(1) })]);
    expect((await requester.json('POST', mt(co, `/meters/${temp.id}/readings`), { value: 90 })).generated).toEqual([]);
    await tech.json('POST', mt(co, `/work-orders/${hot.generated[0].workOrderId}/complete`), { notes: 'Bearing greased' });
    // The 90 was read while the work order was open: the cron does not make another for it.
    expect((await generateDue(env.DB, { companyId: co, today: today(), actorId: null })).made).toEqual([]);
    // A new reading outside the limits (here below the minimum, with a lower limit of its own) makes the next one.
    await supervisor.json('PATCH', mt(co, `/pm/schedules/${s.id}`), { condBelow: 20 });
    expect((await requester.json('POST', mt(co, `/meters/${temp.id}/readings`), { value: 15 })).generated).toHaveLength(1);
    const occ = await supervisor.json('GET', mt(co, `/pm/schedules/${s.id}`));
    expect(occ.occurrences).toHaveLength(2);
    expect((await supervisor.json('GET', mt(co, `/meters/${temp.id}`))).readings.map((r: any) => r.value)).toEqual([15, 90, 85, 70]);
  });
});

describe('inspections and prestarts', () => {
  it('makes the follow-up of a failed inspection once, as a work order or a request', async () => {
    const { supervisor, tech, co } = await team('Juliet');
    const crane = await supervisor.json('POST', mt(co, '/assets'), { name: 'Overhead crane' });
    const tpl = await supervisor.json('POST', mt(co, '/inspection-templates'), { name: 'Crane check', items: [{ label: 'Hook latch works', kind: 'pass_fail' }, { label: 'Rope wear', kind: 'number', unit: '%', max: 10 }] });
    const wo = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: crane.id, description: 'Six-monthly crane inspection', jobType: 'inspection', assignedTo: tech.userId });
    const added = await tech.json('POST', mt(co, `/work-orders/${wo.id}/inspections`), { templateId: tpl.id });
    expect((await tech.req('POST', mt(co, `/work-orders/${wo.id}/inspections`), { templateId: tpl.id })).status).toBe(409);
    const items = (await tech.json('GET', mt(co, `/work-orders/${wo.id}`))).inspections[0].items;
    // Not every required item has a result yet.
    await tech.json('PUT', mt(co, `/work-orders/${wo.id}/inspections/${added.id}/results`), { results: [{ itemId: items[0].id, passed: true }] });
    expect((await tech.req('POST', mt(co, `/work-orders/${wo.id}/inspections/${added.id}/complete`), {})).status).toBe(400);
    await tech.json('PUT', mt(co, `/work-orders/${wo.id}/inspections/${added.id}/results`), { results: [{ itemId: items[1].id, value: 14 }] });
    // Two completions at the same moment: one follow-up.
    const [c1, c2] = await Promise.all([tech.req('POST', mt(co, `/work-orders/${wo.id}/inspections/${added.id}/complete`), {}), tech.req('POST', mt(co, `/work-orders/${wo.id}/inspections/${added.id}/complete`), {})]);
    expect([c1.status, c2.status].sort()).toEqual([200, 409]);
    const ok = (await (c1.status === 200 ? c1 : c2).json()) as any;
    expect(ok).toMatchObject({ status: 'failed', failed: 1, followUp: { kind: 'work_order' } });
    const follow = await env.DB.prepare("SELECT number, job_type, status, asset_id, description FROM mt_work_orders WHERE company_id = ? AND description LIKE 'Follow-up of the failed inspection%'").bind(co).all<any>();
    expect(follow.results).toHaveLength(1);
    expect(follow.results[0]).toMatchObject({ job_type: 'corrective', status: 'open', asset_id: crane.id });
    expect(follow.results[0].description).toContain('Rope wear (14 %)');
    const view = await tech.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(view.inspections[0]).toMatchObject({ status: 'failed', failed: 1, followUp: { kind: 'work_order', number: follow.results[0].number } });
    // Completed results are locked.
    expect((await tech.req('PUT', mt(co, `/work-orders/${wo.id}/inspections/${added.id}/results`), { results: [{ itemId: items[1].id, value: 5 }] })).status).toBe(409);

    // A template whose failures raise a request.
    const tpl2 = await supervisor.json('POST', mt(co, '/inspection-templates'), { name: 'Sling check', failAction: 'request', items: [{ label: 'Sling tag readable', kind: 'pass_fail' }] });
    const added2 = await tech.json('POST', mt(co, `/work-orders/${wo.id}/inspections`), { templateId: tpl2.id });
    const it2 = (await tech.json('GET', mt(co, `/work-orders/${wo.id}`))).inspections.find((x: any) => x.id === added2.id).items[0];
    await tech.json('PUT', mt(co, `/work-orders/${wo.id}/inspections/${added2.id}/results`), { results: [{ itemId: it2.id, passed: false }] });
    const done2 = await tech.json('POST', mt(co, `/work-orders/${wo.id}/inspections/${added2.id}/complete`), {});
    expect(done2.followUp).toMatchObject({ kind: 'request' });
    const req = await supervisor.json('GET', mt(co, `/requests/${done2.followUp.id}`));
    expect(req.request).toMatchObject({ status: 'awaiting_approval', assetId: crane.id });
  });

  it('sets the asset out of service and raises a request when a critical prestart item fails', async () => {
    const { supervisor, tech, requester, co } = await team('Kilo');
    const forklift = await supervisor.json('POST', mt(co, '/assets'), { number: 'FL-01', name: 'Forklift', category: 'Mobile plant', serialNumber: 'FLX-1001' });
    const hours = await supervisor.json('POST', mt(co, '/meters'), { assetId: forklift.id, name: 'Hours', unit: 'h' });
    const tpl = await supervisor.json('POST', mt(co, '/inspection-templates'), {
      name: 'Forklift prestart',
      items: [
        { label: 'Brakes work', kind: 'pass_fail', critical: true },
        { label: 'Horn works', kind: 'pass_fail' },
        { label: 'Fork damage', kind: 'text', required: false },
      ],
    });
    expect((await requester.req('PUT', mt(co, `/assets/${forklift.id}/prestart`), { templateId: tpl.id })).status).toBe(403);
    await supervisor.json('PUT', mt(co, `/assets/${forklift.id}/prestart`), { templateId: tpl.id });
    // Scan the label, or type the serial number.
    expect((await requester.json('GET', mt(co, `/scan?code=${encodeURIComponent('ASSET:FL-01')}`))).asset.id).toBe(forklift.id);
    const scanned = await requester.json('GET', mt(co, '/scan?code=flx-1001'));
    expect(scanned).toMatchObject({ asset: { id: forklift.id, number: 'FL-01' }, prestart: { templateId: tpl.id, name: 'Forklift prestart' } });
    expect((await requester.req('GET', mt(co, '/scan?code=NOPE-9'))).status).toBe(404);
    const form = await requester.json('GET', mt(co, `/assets/${forklift.id}/prestart`));
    const id = (label: string) => form.template.items.find((x: any) => x.label === label).id;

    // A passed check: no request, the status stays.
    const ok = await requester.json('POST', mt(co, '/prestarts'), { assetId: forklift.id, results: [{ itemId: id('Brakes work'), passed: true }, { itemId: id('Horn works'), passed: true }], reading: { meterId: hours.id, value: 512 } });
    expect(ok).toMatchObject({ request: null, outOfService: false, prestart: { result: 'passed', failedItems: 0 } });
    // A missing required item is refused.
    expect((await requester.req('POST', mt(co, '/prestarts'), { assetId: forklift.id, results: [{ itemId: id('Brakes work'), passed: true }] })).status).toBe(400);

    // Brakes fail (critical): out of service, an urgent request; sent twice with the same key, recorded once.
    const body = { assetId: forklift.id, results: [{ itemId: id('Brakes work'), passed: false, note: 'Pedal goes to the floor' }, { itemId: id('Horn works'), passed: true }], notes: 'Parked at bay 3', requestKey: 'prestart-key-0001' };
    const failed = await requester.json('POST', mt(co, '/prestarts'), body);
    expect((await requester.req('POST', mt(co, '/prestarts'), body)).status).toBe(409);
    expect(failed).toMatchObject({ outOfService: true, prestart: { result: 'failed', failedItems: 1, criticalFailed: 1, statusBefore: 'operating', setOutOfService: true } });
    expect(failed.request.number).toMatch(/^MR-/);
    const asset = await supervisor.json('GET', mt(co, `/assets/${forklift.id}`));
    expect(asset.asset.status).toBe('out_of_service');
    expect(asset.history.find((e: any) => e.action === 'asset.out_of_service')).toMatchObject({ before: { status: 'operating' }, after: { status: 'out_of_service' } });
    expect(asset.prestarts.map((p: any) => p.result)).toEqual(['failed', 'passed']);
    const req = await supervisor.json('GET', mt(co, `/requests/${failed.request.id}`));
    expect(req.request).toMatchObject({ priority: 'urgent', status: 'awaiting_approval', assetId: forklift.id, requestedBy: requester.userId });
    expect(req.request.description).toContain('Brakes work (critical)');
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_prestarts WHERE company_id = ?').bind(co).first<{ n: number }>())!.n).toBe(2);

    // A work order's status still does not change the asset's status (the owner's decision).
    const conv = await supervisor.json('POST', mt(co, `/requests/${failed.request.id}/convert`), { assignedTo: tech.userId, jobType: 'corrective' });
    await tech.json('POST', mt(co, `/work-orders/${conv.workOrder.id}/complete`), { notes: 'Brake master cylinder replaced' });
    expect((await supervisor.json('GET', mt(co, `/assets/${forklift.id}`))).asset.status).toBe('out_of_service');
    // A supervisor puts it back in service by hand.
    await supervisor.json('PATCH', mt(co, `/assets/${forklift.id}`), { status: 'operating' });
    // A failure that is not critical raises a request but leaves the status.
    const minor = await requester.json('POST', mt(co, '/prestarts'), { assetId: forklift.id, results: [{ itemId: id('Brakes work'), passed: true }, { itemId: id('Horn works'), passed: false }] });
    expect(minor).toMatchObject({ outOfService: false, prestart: { result: 'failed', criticalFailed: 0 } });
    expect(minor.request).not.toBeNull();
    expect((await supervisor.json('GET', mt(co, `/assets/${forklift.id}`))).asset.status).toBe('operating');
  });
});

describe('parts through ERP Inventory', () => {
  it('issues and returns parts, refuses a concurrent last-unit issue, and lets technicians issue only to their own work orders', async () => {
    const { owner, supervisor, tech, tech2, requester, co } = await team('Lima');
    const { wh, bin, product } = await store(owner, co, { name: 'Drive belt', qty: 1, cost: 4200 });
    const fan = await supervisor.json('POST', mt(co, '/assets'), { name: 'Extraction fan' });
    const w1 = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: fan.id, description: 'Replace the belt', assignedTo: tech.userId });
    const w2 = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: fan.id, description: 'Replace the belt again', assignedTo: tech2.userId });
    const line = { productId: product.id, locationId: bin.id, quantity: 1 };
    // Not a maintenance store yet.
    expect((await tech.req('POST', mt(co, `/work-orders/${w1.id}/stock/issue`), { lines: [line] })).status).toBe(400);
    await owner.json('PUT', mt(co, `/stores/${wh.id}`), { store: true });
    // Only to their own work orders; requesters not at all.
    expect((await tech.req('POST', mt(co, `/work-orders/${w2.id}/stock/issue`), { lines: [line] })).status).toBe(404);
    expect((await requester.req('POST', mt(co, `/work-orders/${w1.id}/stock/issue`), { lines: [line] })).status).toBe(403);
    // The last unit, asked for by two technicians at the same moment: one gets it.
    const [a, b] = await Promise.all([tech.req('POST', mt(co, `/work-orders/${w1.id}/stock/issue`), { lines: [line] }), tech2.req('POST', mt(co, `/work-orders/${w2.id}/stock/issue`), { lines: [line] })]);
    expect([a.status, b.status].sort()).toEqual([201, 409]);
    expect(await onHand(owner, co, product.id)).toBe(0);
    const winner = a.status === 201 ? w1 : w2;
    const winnerTech = a.status === 201 ? tech : tech2;
    // Returning more than was issued is refused; returning it puts it back at the cost it was issued at.
    expect((await winnerTech.req('POST', mt(co, `/work-orders/${winner.id}/stock/return`), { lines: [{ ...line, quantity: 2 }] })).status).toBe(400);
    expect((await winnerTech.req('POST', mt(co, `/work-orders/${winner.id}/stock/return`), { lines: [line], reason: 'Wrong size' })).status).toBe(201);
    expect(await onHand(owner, co, product.id)).toBe(1);
    const view = await supervisor.json('GET', mt(co, `/work-orders/${winner.id}`));
    expect(view.stock.moves.map((m: any) => [m.type, m.quantity, m.valueCents])).toEqual([
      ['maintenance_issue', 1, 4200],
      ['maintenance_return', -1, -4200],
    ]);
    expect(view.costs.partsCents).toBe(0);
    // A supervisor issues to any work order; a requestKey sent twice issues once.
    const keyed = { lines: [line], requestKey: 'issue-key-00001' };
    expect((await supervisor.req('POST', mt(co, `/work-orders/${w2.id}/stock/issue`), keyed)).status).toBe(201);
    expect((await supervisor.req('POST', mt(co, `/work-orders/${w2.id}/stock/issue`), keyed)).status).toBe(409);
    expect(await onHand(owner, co, product.id)).toBe(0);
    // A locked work order takes no parts.
    await tech2.json('POST', mt(co, `/work-orders/${w2.id}/complete`), { notes: 'Done' });
    expect((await supervisor.req('POST', mt(co, `/work-orders/${w2.id}/stock/return`), { lines: [line] })).status).toBe(409);
    // Nobody was given an ERP role to do any of this.
    const grants = await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_role_grants WHERE company_id = ?').bind(co).first<{ n: number }>();
    expect(grants!.n).toBe(0);
  });
});

describe('companies, sites and roles', () => {
  it('keeps every new record inside its company (404 elsewhere)', async () => {
    const A = await team('Mike');
    const B = await team('November');
    const asset = await A.supervisor.json('POST', mt(A.co, '/assets'), { name: 'Boiler' });
    const meter = await A.supervisor.json('POST', mt(A.co, '/meters'), { assetId: asset.id, name: 'Pressure', rising: false });
    const s = await A.supervisor.json('POST', mt(A.co, '/pm/schedules'), { assetId: asset.id, name: 'Boiler service', triggerKind: 'time', intervalN: 6, intervalUnit: 'month' });
    const tpl = await A.supervisor.json('POST', mt(A.co, '/inspection-templates'), { name: 'Boiler check', items: [{ label: 'Valve', kind: 'pass_fail' }] });
    const site = await A.supervisor.json('POST', mt(A.co, '/sites'), { code: 'NORTH', name: 'North plant' });
    for (const path of [`/pm/schedules/${s.id}`, `/meters/${meter.id}`, `/inspection-templates/${tpl.id}`, `/assets/${asset.id}/qr`, '/reports/backlog', '/sites', '/pm/forecast']) {
      expect((await B.owner.req('GET', mt(A.co, path))).status, path).toBe(404);
      if (path !== '/sites' && path !== '/reports/backlog' && path !== '/pm/forecast') expect((await B.owner.req('GET', mt(B.co, path))).status, `B ${path}`).toBe(404);
    }
    expect((await B.owner.req('POST', mt(A.co, `/meters/${meter.id}/readings`), { value: 1 })).status).toBe(404);
    expect((await B.owner.req('POST', mt(B.co, `/meters/${meter.id}/readings`), { value: 1 })).status).toBe(404);
    expect((await B.supervisor.req('POST', mt(B.co, '/pm/schedules'), { assetId: asset.id, name: 'x', triggerKind: 'time', intervalN: 1, intervalUnit: 'day' })).status).toBe(400);
    expect((await B.supervisor.req('PUT', mt(B.co, `/assets/${asset.id}/site`), { siteId: site.id })).status).toBe(404);
    const bAsset = await B.supervisor.json('POST', mt(B.co, '/assets'), { name: 'Their boiler' });
    expect((await B.supervisor.req('PUT', mt(B.co, `/assets/${bAsset.id}/site`), { siteId: site.id })).status).toBe(400);
    expect((await B.supervisor.req('POST', mt(B.co, '/prestarts'), { assetId: bAsset.id, templateId: tpl.id, results: [] })).status).toBe(404);
    // The cron works across companies but each work order stays in its own.
    const all = await env.DB.prepare('SELECT DISTINCT o.company_id FROM mt_pm_occurrences o JOIN mt_work_orders w ON w.id = o.work_order_id AND w.company_id <> o.company_id').all();
    expect(all.results).toEqual([]);
  });

  it('places assets in sites and filters lists and reports by site', async () => {
    const { supervisor, requester, co } = await team('Oscar');
    const north = await supervisor.json('POST', mt(co, '/sites'), { code: 'N1', name: 'North depot', address: '1 Example Road' });
    const south = await supervisor.json('POST', mt(co, '/sites'), { code: 'S1', name: 'South depot' });
    expect((await supervisor.req('POST', mt(co, '/sites'), { code: 'n1', name: 'Again' })).status).toBe(409);
    expect((await requester.req('POST', mt(co, '/sites'), { code: 'X', name: 'Nope' })).status).toBe(403);
    const line = await supervisor.json('POST', mt(co, '/assets'), { name: 'Packing line', siteId: north.id });
    const child = await supervisor.json('POST', mt(co, '/assets'), { name: 'Labeller', parentId: line.id });
    expect(child).toMatchObject({ siteId: north.id, siteCode: 'N1' });
    const other = await supervisor.json('POST', mt(co, '/assets'), { name: 'Truck' });
    await supervisor.json('PUT', mt(co, `/assets/${other.id}/site`), { siteId: south.id });
    expect((await requester.json('GET', mt(co, `/assets?siteId=${north.id}`))).assets.map((x: any) => x.name).sort()).toEqual(['Labeller', 'Packing line']);
    expect((await requester.json('GET', mt(co, '/assets?siteId=none'))).total).toBe(0);
    // Move the line and everything under it.
    expect(await supervisor.json('PUT', mt(co, `/assets/${line.id}/site`), { siteId: south.id, includeChildren: true })).toEqual({ siteId: south.id, assets: 2 });
    expect((await requester.json('GET', mt(co, `/assets?siteId=${south.id}`))).total).toBe(3);
    const sites = await requester.json('GET', mt(co, '/sites'));
    expect(sites.sites.map((s: any) => [s.code, s.assets])).toEqual([
      ['N1', 0],
      ['S1', 3],
    ]);
    await supervisor.json('POST', mt(co, '/work-orders'), { assetId: other.id, description: 'Service the truck' });
    await supervisor.json('PATCH', mt(co, `/assets/${child.id}`), { siteId: north.id });
    await supervisor.json('POST', mt(co, '/work-orders'), { assetId: child.id, description: 'Adjust the labeller' });
    expect((await supervisor.json('GET', mt(co, `/work-orders?siteId=${north.id}&view=all`))).workOrders.map((w: any) => w.description)).toEqual(['Adjust the labeller']);
    expect((await supervisor.json('GET', mt(co, `/reports/backlog?siteId=${south.id}`))).totals.count).toBe(1);
    expect((await supervisor.json('GET', mt(co, '/reports/backlog'))).totals.count).toBe(2);
    expect((await requester.req('GET', mt(co, '/reports/backlog'))).status).toBe(403);
  });
});

describe('reports with exact numbers', () => {
  it('works out MTBF, MTTR, downtime and availability from failures with downtime', async () => {
    const { supervisor, tech, co } = await team('Papa');
    const mill = await supervisor.json('POST', mt(co, '/assets'), { name: 'Milling machine' });
    const lathe = await supervisor.json('POST', mt(co, '/assets'), { name: 'Lathe' });
    const base = Date.parse(`${day(-40)}T00:00:00Z`);
    const from = day(-40);
    const to = day(-31); // ten days: 240 hours
    const failure = async (assetId: string, jobType: string, start: number, hours: number, status: 'complete' | 'cancel' = 'complete') => {
      const w = await supervisor.json('POST', mt(co, '/work-orders'), { assetId, description: `${jobType} failure`, jobType, assignedTo: tech.userId });
      await tech.json('PUT', mt(co, `/work-orders/${w.id}/downtime`), { startedAt: start, endedAt: start + hours * 3_600_000, cause: 'Example' });
      if (status === 'complete') await tech.json('POST', mt(co, `/work-orders/${w.id}/complete`), { notes: 'Repaired' });
      else await supervisor.json('POST', mt(co, `/work-orders/${w.id}/cancel`), { reason: 'Raised twice' });
      return w;
    };
    await failure(mill.id, 'breakdown', base + 1 * DAY + 8 * 3_600_000, 2);
    await failure(mill.id, 'corrective', base + 4 * DAY + 12 * 3_600_000, 4);
    await failure(mill.id, 'breakdown', base + 20 * DAY, 9); // after the period
    await failure(mill.id, 'breakdown', base + 2 * DAY, 5, 'cancel'); // cancelled: not a failure
    await failure(mill.id, 'preventive', base + 3 * DAY, 3); // planned work: not a failure
    await failure(lathe.id, 'emergency_repair', base + 6 * DAY, 1.5);
    expect((await tech.req('PUT', mt(co, `/work-orders/${(await supervisor.json('POST', mt(co, '/work-orders'), { assetId: lathe.id, description: 'x', assignedTo: tech.userId })).id}/downtime`), { startedAt: base + 2 * 3_600_000, endedAt: base })).status).toBe(400);
    const r = await supervisor.json('GET', mt(co, `/reports/reliability?from=${from}&to=${to}`));
    expect(r.periodHours).toBe(240);
    const m = r.assets.find((x: any) => x.assetId === mill.id);
    expect(m).toMatchObject({ failures: 2, downtimeHours: 6, mttrHours: 3, mtbfHours: 117, availabilityPct: 97.5 });
    expect(m.workOrders.map((w: any) => w.minutes)).toEqual([120, 240]);
    expect(r.assets.find((x: any) => x.assetId === lathe.id)).toMatchObject({ failures: 1, downtimeHours: 1.5, mttrHours: 1.5, mtbfHours: 238.5, availabilityPct: 99.4 });
    expect(r.totals).toEqual({ failures: 3, downtimeHours: 7.5, mttrHours: 2.5 });
    const trends = await supervisor.json('GET', mt(co, `/reports/breakdowns?from=${from}&to=${to}`));
    expect(trends.totals.failures).toBe(3);
    expect(trends.totals.downtimeHours).toBe(7.5);
    const csv = await supervisor.req('GET', mt(co, `/reports/reliability?from=${from}&to=${to}&format=csv`));
    expect(csv.headers.get('Content-Type')).toMatch(/text\/csv/);
    const text = await csv.text();
    expect(text.split('\n')[0]).toContain('MTBF (h)');
    expect(text).toContain(',2,6,3,117,97.5,');
  });

  it('works out the backlog by priority and age, and PM compliance', async () => {
    const { supervisor, tech, co } = await team('Quebec');
    const asset = await supervisor.json('POST', mt(co, '/assets'), { name: 'Conveyor' });
    const made = async (priority: string, ageDays: number) => {
      const w = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: asset.id, description: `${priority} job`, priority, estimatedHours: 2 });
      await env.DB.prepare('UPDATE mt_work_orders SET created_at = ? WHERE id = ?').bind(Date.parse(`${day(-ageDays)}T09:00:00Z`), w.id).run();
      return w;
    };
    await made('urgent', 3);
    await made('high', 10);
    await made('high', 30);
    await made('medium', 45);
    await made('low', 120);
    const done = await made('urgent', 1);
    await supervisor.json('POST', mt(co, `/work-orders/${done.id}/complete`), { notes: 'Done' });
    const b = await supervisor.json('GET', mt(co, `/reports/backlog?today=${today()}`));
    expect(b.totals).toMatchObject({ count: 5, estimatedHours: 10, byBand: { '0-7': 1, '8-30': 2, '31-90': 1, '91+': 1 }, byPriority: { urgent: 1, high: 2, medium: 1, low: 1 } });
    expect(b.matrix.high['8-30']).toEqual({ count: 2, estimatedHours: 4 });
    expect(b.matrix.low['91+'].count).toBe(1);
    expect(b.workOrders.map((w: any) => w.ageDays)).toEqual([120, 45, 30, 10, 3]);

    // PM compliance: four occurrences due up to today. On time 1, late 1, missed 1, skipped 1: 25%.
    const sched = async (name: string, start: string) => supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: asset.id, name, triggerKind: 'time', intervalN: 30, intervalUnit: 'day', startDate: start, assignedTo: tech.userId });
    const late = await sched('Late one', day(-3));
    const missed = await sched('Missed one', day(-1));
    const onTime = await sched('On time one', today());
    const skipped = await sched('Skipped one', day(-2));
    await sched('Not due yet', day(5));
    const gen = await supervisor.json('POST', mt(co, '/pm/generate'), { today: today() });
    expect(gen.made).toHaveLength(4);
    const wo = (s: any) => gen.made.find((m: any) => m.scheduleId === s.id).workOrderId;
    await tech.json('POST', mt(co, `/work-orders/${wo(late)}/complete`), { notes: 'Done late' });
    await tech.json('POST', mt(co, `/work-orders/${wo(onTime)}/complete`), { notes: 'Done' });
    await supervisor.json('POST', mt(co, `/work-orders/${wo(skipped)}/cancel`), { reason: 'Line stopped for the week' });
    const pc = await supervisor.json('GET', mt(co, `/reports/pm-compliance?from=${day(-10)}&to=${day(10)}&today=${today()}`));
    expect(pc).toMatchObject({ upTo: today(), due: 4, onTime: 1, late: 1, missed: 1, skipped: 1, compliancePct: 25 });
    expect(pc.occurrences.find((o: any) => o.scheduleId === missed.id)).toMatchObject({ outcome: 'missed', dueDate: day(-1) });
    // A cancelled occurrence is skipped: a completion-based schedule moves on from its due date.
    expect((await supervisor.json('GET', mt(co, `/pm/schedules/${skipped.id}`))).schedule.nextDueDate).toBe(day(28));
    // The forecast shows the open ones and the dates ahead.
    const f = await supervisor.json('GET', mt(co, `/pm/forecast?from=${today()}&to=${day(40)}&today=${today()}`));
    expect(f.entries.filter((e: any) => e.scheduleId === onTime.id).map((e: any) => [e.date, e.kind])).toEqual([[day(30), 'due']]);
    expect(f.entries.find((e: any) => e.scheduleId === missed.id && e.kind === 'open')).toMatchObject({ date: today(), note: `Overdue since ${day(-1)}` });
  });

  it('works out asset costs from priced labour and parts', async () => {
    const { owner, supervisor, tech, co } = await team('Romeo');
    const { wh, bin, product } = await store(owner, co, { name: 'Bearing', qty: 5, cost: 3000 });
    await owner.json('PUT', mt(co, `/stores/${wh.id}`), { store: true });
    await supervisor.json('POST', mt(co, '/trades'), { name: 'Electrician', rateCents: 9000 });
    await supervisor.json('PUT', mt(co, `/technicians/${tech.userId}`), { rateCents: 7000 });
    const asset = await supervisor.json('POST', mt(co, '/assets'), { name: 'Saw' });
    const w = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: asset.id, description: 'Change the bearing', assignedTo: tech.userId, trade: 'electrician' });
    await tech.json('POST', mt(co, `/work-orders/${w.id}/labour`), { date: today(), minutes: 45 });
    await supervisor.json('POST', mt(co, `/work-orders/${w.id}/labour`), { date: today(), minutes: 20 });
    await supervisor.json('POST', mt(co, `/work-orders/${w.id}/stock/issue`), { lines: [{ productId: product.id, locationId: bin.id, quantity: 2 }] });
    // A rate changed later does not change past costs.
    await supervisor.json('PUT', mt(co, `/technicians/${tech.userId}`), { rateCents: 1 });
    const r = await supervisor.json('GET', mt(co, `/reports/costs?from=${today()}&to=${today()}`));
    // 45 min at 70.00 = 52.50; 20 min at the trade's 90.00 = 30.00; parts 2 x 30.00 = 60.00.
    expect(r.assets).toEqual([expect.objectContaining({ assetId: asset.id, labourCents: 8250, labourMinutes: 65, unpricedMinutes: 0, partsCents: 6000, totalCents: 14250 })]);
    expect(r.totals).toEqual({ labourCents: 8250, partsCents: 6000, totalCents: 14250, unpricedMinutes: 0 });
  });
});

describe('the example company', () => {
  it('gets a site, a meter with readings, a schedule that made a work order, a store with a part issued, a failed inspection item and a prestart', async () => {
    const a = await signup('Example Maintainer');
    const built = (await a.json('POST', '/api/system/demo', {})) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const overview = await a.json('GET', mt(co, '/overview'));
    // Stage 1's figures are unchanged: seven assets, two open work orders.
    expect(overview.assets).toBe(7);
    expect(overview.openWorkOrders).toBe(2);
    const sites = await a.json('GET', mt(co, '/sites'));
    expect(sites.sites.length).toBeGreaterThanOrEqual(1);
    expect(sites.unplaced).toBe(0);
    const meters = await a.json('GET', mt(co, '/meters'));
    const hours = meters.meters.find((m: any) => m.name === 'Laser hours');
    expect(hours.readings).toBeGreaterThanOrEqual(2);
    const schedules = (await a.json('GET', mt(co, '/pm/schedules'))).schedules;
    const withWork = [];
    for (const s of schedules) {
      const v = await a.json('GET', mt(co, `/pm/schedules/${s.id}`));
      if (v.occurrences.length) withWork.push(v);
    }
    expect(withWork.length).toBeGreaterThanOrEqual(1);
    expect(withWork[0].occurrences[0].workOrder.status).toBe('completed');
    const stores = await a.json('GET', mt(co, '/stores'));
    expect(stores.warehouses.some((w: any) => w.isStore)).toBe(true);
    const issued = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_stock_moves WHERE company_id = ? AND move_type = 'maintenance_issue'").bind(co).first<{ n: number }>();
    expect(issued!.n).toBeGreaterThanOrEqual(1);
    const failedResults = await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_insp_results r JOIN mt_wo_inspections i ON i.id = r.inspection_id WHERE r.company_id = ? AND r.passed = 0').bind(co).first<{ n: number }>();
    expect(failedResults!.n).toBeGreaterThanOrEqual(1);
    expect((await a.json('GET', mt(co, '/prestarts'))).prestarts.length).toBeGreaterThanOrEqual(1);
    // It is removed with everything else.
    expect((await a.req('POST', '/api/system/demo/remove', {})).status).toBe(200);
    const left = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM mt_pm_schedules WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_meters WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_sites WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_prestarts WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_insp_templates WHERE company_id = ?1) AS n').bind(co).first<{ n: number }>();
    expect(left!.n).toBe(0);
  });
});
