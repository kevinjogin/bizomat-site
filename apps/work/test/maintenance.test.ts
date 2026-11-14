// BIZOMAT ERP: Asset Management and Maintenance, Stage 1 (src/worker/maintenance). The owner's acceptance tests:
//   A an asset hierarchy (Company > Factory > Production line > CNC machine > Hydraulic system) and a registered machine;
//   B a requester raises a request with a photograph, a supervisor approves it and makes one work order from it (never two);
//   C a work order with instructions, tasks, a labour estimate and parts lines;
//   D a technician times the work, records it, adds a photograph and completes it; it is then locked until a supervisor
//     reopens it with a reason;
//   J access across two companies and the four maintenance roles;
// plus the CSV import (preview, duplicates, parents), loops in the hierarchy and the "include child assets" filter.
import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
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

async function joinCompany(owner: Client, companyId: string, invitee: Client, role: 'admin' | 'member') {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role, tasksRole: 'member', crmRole: null, finRole: null });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const mt = (co: string, path = '') => `/api/maintenance/c/${co}${path}`;

function photo(field: 'assetId' | 'requestId' | 'workOrderId', id: string, name = 'fault.png') {
  const fd = new FormData();
  fd.set('file', new File([PNG], name, { type: 'image/png' }));
  fd.set(field, id);
  return fd;
}

/** A registered company with an owner (maintenance admin), a supervisor, a technician and a requester. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company, tools } = await registerCompany(owner, `${label} Manufacturing`);
  const supervisor = await signup(`${label} Supervisor`);
  const technician = await signup(`${label} Technician`);
  const requester = await signup(`${label} Employee`);
  for (const p of [supervisor, technician, requester]) await joinCompany(owner, company.id, p, 'member');
  await owner.json('PUT', mt(company.id, `/roles/${supervisor.userId}`), { role: 'supervisor' });
  await owner.json('PUT', mt(company.id, `/roles/${technician.userId}`), { role: 'technician' });
  return { owner, supervisor, technician, requester, co: company.id, tools };
}

async function asset(c: Client, co: string, body: Record<string, unknown>) {
  return c.json('POST', mt(co, '/assets'), body);
}

describe('A: the asset register and its hierarchy', () => {
  it('builds Company > Factory > Production line > CNC machine > Hydraulic system and registers the machine', async () => {
    const { owner, requester, co } = await team('Alpha');
    const root = await asset(owner, co, { name: 'Alpha Manufacturing', category: 'Site' });
    expect(root.number).toBe('A-0001');
    const factory = await asset(owner, co, { name: 'Factory', parentId: root.id, category: 'Building', location: 'Sydney' });
    const line = await asset(owner, co, { name: 'Production line 1', parentId: factory.id, category: 'Line' });
    const cnc = await asset(owner, co, {
      number: 'CNC-01',
      name: 'CNC machining centre',
      parentId: line.id,
      category: 'Machine',
      type: 'Vertical machining centre',
      manufacturer: 'Example Machine Tools',
      model: 'VMC-850',
      serialNumber: 'EMT-850-0042',
      purchaseDate: '2024-03-01',
      commissioningDate: '2024-04-15',
      warrantyUntil: '2027-04-15',
      supplier: 'Example Supplies',
      purchaseCostCents: 18500000,
      replacementCostCents: 21000000,
      criticality: 'critical',
      strategy: 'preventive',
      responsibleId: owner.userId,
      specs: [
        { key: 'Spindle power', value: '15 kW' },
        { key: 'Table size', value: '1000 × 500 mm' },
      ],
    });
    expect(cnc).toMatchObject({ number: 'CNC-01', manufacturer: 'Example Machine Tools', model: 'VMC-850', serialNumber: 'EMT-850-0042', criticality: 'critical', status: 'operating', parentNumber: line.number, responsibleName: 'Alpha Owner' });
    const hyd = await asset(owner, co, { name: 'Hydraulic system', parentId: cnc.id, category: 'System' });
    expect(hyd.number).toBe('A-0004');

    const detail = await owner.json('GET', mt(co, `/assets/${hyd.id}`));
    expect(detail.path.map((p: any) => p.name)).toEqual(['Alpha Manufacturing', 'Factory', 'Production line 1', 'CNC machining centre', 'Hydraulic system']);
    expect(detail.parent).toMatchObject({ id: cnc.id, number: 'CNC-01' });
    const cncDetail = await requester.json('GET', mt(co, `/assets/${cnc.id}`));
    expect(cncDetail.asset.specs).toHaveLength(2);
    expect(cncDetail.asset.purchaseCostCents).toBe(18500000);
    expect(cncDetail.children.map((x: any) => x.id)).toEqual([hyd.id]);
    expect(cncDetail.history[0]).toMatchObject({ action: 'asset.created', actorName: 'Alpha Owner' });
    expect(cncDetail.can.edit).toBe(false);

    const tree = await owner.json('GET', mt(co, '/assets/tree'));
    expect(tree.nodes).toHaveLength(5);
    expect(tree.nodes.find((n: any) => n.id === hyd.id).parentId).toBe(cnc.id);

    // Numbers are unique per company (case does not matter); the same manufacturer and serial number is a duplicate.
    expect((await owner.req('POST', mt(co, '/assets'), { number: 'cnc-01', name: 'Again' })).status).toBe(409);
    expect((await owner.req('POST', mt(co, '/assets'), { name: 'Copy', manufacturer: 'example machine tools', serialNumber: 'emt-850-0042' })).status).toBe(409);
    // A changed field is recorded with its value before and after.
    await owner.json('PATCH', mt(co, `/assets/${cnc.id}`), { status: 'under_maintenance', location: 'Bay 3' });
    const after = await owner.json('GET', mt(co, `/assets/${cnc.id}`));
    const ev = after.history.find((e: any) => e.action === 'asset.updated');
    expect(ev.before).toMatchObject({ status: 'operating', location: '' });
    expect(ev.after).toMatchObject({ status: 'under_maintenance', location: 'Bay 3' });
  });

  it('refuses a parent that would make a loop, and parents from another company', async () => {
    const { owner, co } = await team('Loop');
    const a1 = await asset(owner, co, { name: 'Top' });
    const a2 = await asset(owner, co, { name: 'Middle', parentId: a1.id });
    const a3 = await asset(owner, co, { name: 'Bottom', parentId: a2.id });
    const self = await owner.req('PATCH', mt(co, `/assets/${a1.id}`), { parentId: a1.id });
    expect(self.status).toBe(400);
    const loop = await owner.req('PATCH', mt(co, `/assets/${a1.id}`), { parentId: a3.id });
    expect(loop.status).toBe(400);
    expect(((await loop.json()) as any).error).toMatch(/below it/);
    // Moving a branch elsewhere is fine.
    await owner.json('PATCH', mt(co, `/assets/${a3.id}`), { parentId: a1.id });
    expect((await owner.json('GET', mt(co, `/assets/${a3.id}`))).path.map((p: any) => p.name)).toEqual(['Top', 'Bottom']);
    // Another company's asset cannot be a parent.
    const other = await signup('Other Owner');
    const otherCo = (await other.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own').id;
    const foreign = await asset(other, otherCo, { name: 'Foreign' });
    expect((await owner.req('PATCH', mt(co, `/assets/${a3.id}`), { parentId: foreign.id })).status).toBe(400);
  });
});

describe('B: a request with a photograph, approved and made into one work order', () => {
  it('runs the request workflow and never makes a second work order from the same request', async () => {
    const { supervisor, requester, technician, co } = await team('Bravo');
    const cnc = await asset(supervisor, co, { name: 'CNC machine', manufacturer: 'Example', serialNumber: 'B-1' });

    // Only the description is required.
    expect((await requester.req('POST', mt(co, '/requests'), { description: '' })).status).toBe(400);
    const req = await requester.json('POST', mt(co, '/requests'), { description: 'Hydraulic oil leaking under the machine', assetId: cnc.id, priority: 'high', location: 'Bay 3', neededBy: '2026-12-01' });
    expect(req).toMatchObject({ number: 'MR-0001', status: 'awaiting_approval', priority: 'high', requestedByName: 'Bravo Employee', assetNumber: cnc.number });
    const up = await requester.req('POST', mt(co, '/files'), photo('requestId', req.id));
    expect(up.status).toBe(201);
    const file = (await up.json()) as any;
    expect(file).toMatchObject({ name: 'fault.png', isImage: true });
    const dl = await requester.req('GET', mt(co, `/files/${file.id}`));
    expect(dl.status).toBe(200);
    expect(dl.headers.get('Content-Type')).toBe('image/png');
    expect(dl.headers.get('Content-Security-Policy')).toContain('sandbox');
    expect(new Uint8Array(await dl.arrayBuffer())).toEqual(PNG);

    // The requester follows it in My requests; a technician who did not raise it cannot see it.
    const mine = await requester.json('GET', mt(co, '/requests?mine=1'));
    expect(mine.requests.map((r: any) => r.id)).toEqual([req.id]);
    expect((await technician.req('GET', mt(co, `/requests/${req.id}`))).status).toBe(404);
    // The requester cannot decide on it.
    expect((await requester.req('POST', mt(co, `/requests/${req.id}/approve`), {})).status).toBe(403);
    expect((await requester.req('POST', mt(co, `/requests/${req.id}/convert`), {})).status).toBe(403);

    // The supervisor sees it awaiting approval, approves it and makes a work order from it.
    const awaiting = await supervisor.json('GET', mt(co, '/requests?status=awaiting'));
    expect(awaiting.requests.map((r: any) => r.id)).toContain(req.id);
    const approved = await supervisor.json('POST', mt(co, `/requests/${req.id}/approve`), {});
    expect(approved).toMatchObject({ status: 'approved', decidedByName: 'Bravo Supervisor' });
    const made = await supervisor.json('POST', mt(co, `/requests/${req.id}/convert`), { jobType: 'breakdown', assignedTo: technician.userId });
    expect(made.request).toMatchObject({ status: 'converted', workOrderNumber: 'WO-00001' });
    expect(made.workOrder).toMatchObject({ number: 'WO-00001', assetId: cnc.id, description: 'Hydraulic oil leaking under the machine', priority: 'high', jobType: 'breakdown', status: 'assigned' });

    // A second work order from the same request is refused, and so is attaching it elsewhere.
    expect((await supervisor.req('POST', mt(co, `/requests/${req.id}/convert`), {})).status).toBe(409);
    expect((await supervisor.req('POST', mt(co, `/requests/${req.id}/attach`), { workOrderId: made.workOrder.id })).status).toBe(409);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_work_orders WHERE company_id = ?').bind(co).first<{ n: number }>())?.n).toBe(1);

    // A second request about the same machine shows its outstanding work order, and is attached to it instead.
    const again = await requester.json('POST', mt(co, '/requests'), { description: 'Still leaking', assetId: cnc.id });
    const view = await supervisor.json('GET', mt(co, `/requests/${again.id}`));
    expect(view.assetOutstandingWorkOrders.map((w: any) => w.id)).toEqual([made.workOrder.id]);
    expect(view.can).toMatchObject({ approve: true, convert: true, attach: true });
    const attached = await supervisor.json('POST', mt(co, `/requests/${again.id}/attach`), { workOrderId: made.workOrder.id });
    expect(attached).toMatchObject({ status: 'converted', workOrderId: made.workOrder.id });

    // The requester sees the work order of their request, and the history of the request.
    const mineView = await requester.json('GET', mt(co, `/requests/${req.id}`));
    expect(mineView.workOrderVisible).toBe(true);
    expect(mineView.files).toHaveLength(1);
    expect(mineView.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['request.created', 'file.uploaded', 'request.approved', 'request.converted']));
    expect((await requester.req('GET', mt(co, `/work-orders/${made.workOrder.id}`))).status).toBe(200);
  });

  it('declines with a reason, asks for more information and takes the answer, and follows the approval rule', async () => {
    const { owner, supervisor, requester, co } = await team('Echo');
    const r1 = await requester.json('POST', mt(co, '/requests'), { description: 'Light flickering' });
    expect((await supervisor.req('POST', mt(co, `/requests/${r1.id}/decline`), { reason: '' })).status).toBe(400);
    const declined = await supervisor.json('POST', mt(co, `/requests/${r1.id}/decline`), { reason: 'Facilities look after lighting' });
    expect(declined).toMatchObject({ status: 'declined', decisionNote: 'Facilities look after lighting' });
    expect((await supervisor.req('POST', mt(co, `/requests/${r1.id}/convert`), {})).status).toBe(409);

    const r2 = await requester.json('POST', mt(co, '/requests'), { description: 'Noise' });
    const asked = await supervisor.json('POST', mt(co, `/requests/${r2.id}/request-info`), { comment: 'Which machine?' });
    expect(asked.status).toBe('info_requested');
    const answered = await requester.json('POST', mt(co, `/requests/${r2.id}/respond`), { comment: 'The CNC machine in bay 3' });
    expect(answered.status).toBe('awaiting_approval');
    const detail = await requester.json('GET', mt(co, `/requests/${r2.id}`));
    expect(detail.comments.map((x: any) => x.body)).toEqual(['Which machine?', 'The CNC machine in bay 3']);
    // A request without an asset needs one to become a work order.
    expect((await supervisor.req('POST', mt(co, `/requests/${r2.id}/convert`), {})).status).toBe(400);

    // With the approval rule off, new requests are submitted straight away; only administrators change the rule.
    expect((await supervisor.req('PATCH', mt(co, '/settings'), { requireApproval: false })).status).toBe(403);
    await owner.json('PATCH', mt(co, '/settings'), { requireApproval: false });
    const r3 = await requester.json('POST', mt(co, '/requests'), { description: 'Guard loose' });
    expect(r3.status).toBe('submitted');
  });
});

describe('C and D: a work order planned, worked, completed, locked and reopened', () => {
  let ctx: Awaited<ReturnType<typeof team>>;
  let wo: any;
  let req: any;
  beforeAll(async () => {
    ctx = await team('Delta');
  });

  it('C: makes a work order with instructions, safety, tasks, a labour estimate and parts lines', async () => {
    const { supervisor, technician, requester, co } = ctx;
    const pump = await asset(supervisor, co, { name: 'Hydraulic pump', manufacturer: 'Example Pumps', model: 'HP-40', serialNumber: 'D-77' });
    req = await requester.json('POST', mt(co, '/requests'), { description: 'Pump overheating', assetId: pump.id });
    await supervisor.json('POST', mt(co, `/requests/${req.id}/approve`), {});
    // A requester cannot be given work orders.
    expect((await supervisor.req('POST', mt(co, '/work-orders'), { assetId: pump.id, description: 'x', assignedTo: requester.userId })).status).toBe(400);
    expect((await supervisor.req('POST', mt(co, '/work-orders'), { assetId: pump.id, description: 'x', dueStart: '2026-12-02', dueFinish: '2026-12-01' })).status).toBe(400);
    const made = await supervisor.json('POST', mt(co, `/requests/${req.id}/convert`), {
      jobType: 'mechanical',
      priority: 'urgent',
      trade: 'Fitter',
      assignedTo: technician.userId,
      dueStart: '2026-11-20',
      dueFinish: '2026-11-21',
      estimatedHours: 2.5,
      instructions: 'Check the oil level and the cooler. Replace the filter.',
      safety: 'Isolate and lock out the machine. Release stored hydraulic pressure.',
      projectRef: 'PRJ-12',
      customerRef: 'Internal',
      tasks: ['Isolate and lock out', 'Replace the filter', 'Test run for 15 minutes'],
      parts: [
        { part: 'Hydraulic filter HF-10', quantity: 1 },
        { part: 'Hydraulic oil ISO 46 (litres)', quantity: 20 },
      ],
    });
    wo = made.workOrder;
    const detail = await supervisor.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(detail.workOrder).toMatchObject({ status: 'assigned', jobType: 'mechanical', priority: 'urgent', trade: 'Fitter', estimatedMinutes: 150, assignedToName: 'Delta Technician', safety: expect.stringContaining('lock out') });
    expect(detail.tasks.map((t: any) => t.text)).toEqual(['Isolate and lock out', 'Replace the filter', 'Test run for 15 minutes']);
    expect(detail.parts).toEqual([expect.objectContaining({ part: 'Hydraulic filter HF-10', quantity: 1 }), expect.objectContaining({ part: 'Hydraulic oil ISO 46 (litres)', quantity: 20 })]);
    expect(detail.requests.map((r: any) => r.id)).toEqual([req.id]);
    expect(detail.totals).toMatchObject({ actualMinutes: 0, estimatedMinutes: 150 });
    // Another parts line, then one changed.
    const extra = await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/parts`), { part: 'O-ring kit', quantity: 2 });
    await supervisor.json('PATCH', mt(co, `/work-orders/${wo.id}/parts/${extra.id}`), { quantity: 1 });
    expect((await supervisor.json('GET', mt(co, `/work-orders/${wo.id}`))).parts).toHaveLength(3);
  });

  it('D: the technician times the work, ticks tasks, adds a note and a photograph and completes it; then it is locked', async () => {
    const { supervisor, technician, requester, co } = ctx;
    // My work.
    const mine = await technician.json('GET', mt(co, '/work-orders?mine=1&status=outstanding'));
    expect(mine.workOrders.map((w: any) => w.id)).toEqual([wo.id]);
    // The timer: one running per person; starting it moves the work order to in progress.
    expect((await technician.req('POST', mt(co, `/work-orders/${wo.id}/timer/start`), {})).status).toBe(201);
    expect((await technician.req('POST', mt(co, `/work-orders/${wo.id}/timer/start`), {})).status).toBe(409);
    let detail = await technician.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(detail.workOrder.status).toBe('in_progress');
    expect(detail.totals.myTimer).toMatchObject({ running: true });
    // 90 minutes later (the start is moved back instead of waiting).
    await env.DB.prepare('UPDATE mt_labour SET started_at = started_at - ? WHERE work_order_id = ? AND ended_at IS NULL').bind(90 * 60_000, wo.id).run();
    const stopped = await technician.json('POST', mt(co, `/work-orders/${wo.id}/timer/stop`), {});
    expect(stopped.minutes).toBe(90);
    expect((await technician.req('POST', mt(co, `/work-orders/${wo.id}/timer/stop`), {})).status).toBe(409);

    for (const t of detail.tasks) await technician.json('PATCH', mt(co, `/work-orders/${wo.id}/tasks/${t.id}`), { done: true });
    await technician.json('POST', mt(co, `/work-orders/${wo.id}/tasks`), { text: 'Top up the oil' });
    await technician.json('POST', mt(co, `/work-orders/${wo.id}/comments`), { body: 'Filter was blocked. Cooler fins cleaned.' });
    const up = await technician.req('POST', mt(co, '/files'), photo('workOrderId', wo.id, 'after-repair.png'));
    expect(up.status).toBe(201);
    // Technicians cannot change the plan itself or remove tasks.
    expect((await technician.req('PATCH', mt(co, `/work-orders/${wo.id}`), { priority: 'low' })).status).toBe(403);
    expect((await technician.req('DELETE', mt(co, `/work-orders/${wo.id}/tasks/${detail.tasks[0].id}`))).status).toBe(403);
    // A running timer at completion is stopped.
    await technician.json('POST', mt(co, `/work-orders/${wo.id}/timer/start`), {});

    expect((await technician.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: '' })).status).toBe(400);
    const done = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Filter replaced, oil topped up, test run fine.' });
    expect(done).toMatchObject({ status: 'completed', completionNotes: 'Filter replaced, oil topped up, test run fine.', completedByName: 'Delta Technician' });
    detail = await technician.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(detail.tasks.filter((t: any) => t.done).map((t: any) => t.doneByName)).toEqual(['Delta Technician', 'Delta Technician', 'Delta Technician']);
    expect(detail.totals.actualMinutes).toBe(90);
    expect(detail.totals.running).toEqual([]);
    expect(detail.labour).toHaveLength(2);
    expect(detail.files.map((f: any) => f.name)).toEqual(['after-repair.png']);
    expect(detail.comments.map((x: any) => x.body)).toContain('Filter was blocked. Cooler fins cleaned.');
    expect(detail.locked).toBe(true);
    expect(detail.can).toMatchObject({ work: false, edit: false, complete: false, reopen: false });
    // Completing the work order completed its request.
    expect((await requester.json('GET', mt(co, `/requests/${req.id}`))).request.status).toBe('completed');

    // Locked: every change is refused by the server.
    const refused = [
      await supervisor.req('PATCH', mt(co, `/work-orders/${wo.id}`), { description: 'Changed after the fact' }),
      await technician.req('POST', mt(co, `/work-orders/${wo.id}/tasks`), { text: 'More' }),
      await technician.req('PATCH', mt(co, `/work-orders/${wo.id}/tasks/${detail.tasks[0].id}`), { done: false }),
      await technician.req('POST', mt(co, `/work-orders/${wo.id}/parts`), { part: 'Seal', quantity: 1 }),
      await technician.req('POST', mt(co, `/work-orders/${wo.id}/timer/start`), {}),
      await technician.req('POST', mt(co, `/work-orders/${wo.id}/comments`), { body: 'Late note' }),
      await technician.req('POST', mt(co, '/files'), photo('workOrderId', wo.id)),
      await technician.req('DELETE', mt(co, `/files/${detail.files[0].id}`)),
      await technician.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Again' }),
    ];
    expect(refused.map((r) => r.status)).toEqual([409, 409, 409, 409, 409, 409, 409, 409, 409]);
    expect((await env.DB.prepare('SELECT description FROM mt_work_orders WHERE id = ?').bind(wo.id).first<{ description: string }>())?.description).toBe('Pump overheating');

    // The controlled correction: a supervisor reopens it with a reason; the technician cannot.
    expect((await technician.req('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'Mistake' })).status).toBe(403);
    expect((await supervisor.req('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: '' })).status).toBe(400);
    const reopened = await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'Oil level reading was not recorded' });
    expect(reopened).toMatchObject({ status: 'in_progress', completedAt: null });
    const after = await supervisor.json('GET', mt(co, `/work-orders/${wo.id}`));
    const ev = after.history.find((e: any) => e.action === 'work_order.reopened');
    expect(ev).toMatchObject({ actorName: 'Delta Supervisor', summary: expect.stringContaining('Oil level reading was not recorded') });
    expect(ev.before).toMatchObject({ status: 'completed' });
    expect((await requester.json('GET', mt(co, `/requests/${req.id}`))).request.status).toBe('converted');
    // Open again: the change is accepted now, and recorded.
    await supervisor.json('PATCH', mt(co, `/work-orders/${wo.id}`), { instructions: 'Also record the oil level.' });
    await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Oil level recorded: full.' });
    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/close`), {});
    const closed = await supervisor.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(closed.workOrder.status).toBe('closed');
    expect(closed.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['work_order.created', 'labour.started', 'labour.recorded', 'task.done', 'file.uploaded', 'work_order.completed', 'work_order.reopened', 'work_order.updated', 'work_order.closed']));
    // The asset's history shows the work.
    const assetView = await supervisor.json('GET', mt(co, `/assets/${wo.assetId}`));
    expect(assetView.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['work_order.completed', 'request.created']));
  });

  it('lists, filters and sorts work orders, and counts them on the overview', async () => {
    const { supervisor, technician, co } = ctx;
    const a = await asset(supervisor, co, { name: 'Compressor' });
    await supervisor.json('POST', mt(co, '/work-orders'), { assetId: a.id, description: 'Overdue check', dueFinish: '2026-01-01', priority: 'low', jobType: 'inspection', trade: 'Electrician', assignedTo: technician.userId });
    await supervisor.json('POST', mt(co, '/work-orders'), { assetId: a.id, description: 'Belt replacement', dueFinish: '2027-01-01', priority: 'high', jobType: 'mechanical' });
    const overdue = await supervisor.json('GET', mt(co, '/work-orders?status=overdue&today=2026-11-14'));
    expect(overdue.workOrders.map((w: any) => w.description)).toEqual(['Overdue check']);
    const byPriority = await supervisor.json('GET', mt(co, `/work-orders?assetId=${a.id}&sort=priority&dir=desc`));
    expect(byPriority.workOrders.map((w: any) => w.priority)).toEqual(['high', 'low']);
    expect((await supervisor.json('GET', mt(co, '/work-orders?trade=electrician'))).workOrders).toHaveLength(1);
    expect((await supervisor.json('GET', mt(co, '/work-orders?jobType=inspection'))).workOrders).toHaveLength(1);
    expect((await supervisor.json('GET', mt(co, '/work-orders?q=belt'))).workOrders).toHaveLength(1);
    expect((await supervisor.json('GET', mt(co, `/work-orders?q=${encodeURIComponent(a.number)}`))).workOrders).toHaveLength(2);
    const ov = await technician.json('GET', mt(co, '/overview?today=2026-11-14'));
    expect(ov).toMatchObject({ role: 'technician', myWork: 1, overdue: 1, openWorkOrders: 1 });
    const sov = await supervisor.json('GET', mt(co, '/overview?today=2026-11-14'));
    expect(sov.openWorkOrders).toBe(2);
  });
});

describe('the include child assets filter', () => {
  it('finds the work orders of an asset and of every asset under it', async () => {
    const { supervisor, co } = await team('Child');
    const factory = await asset(supervisor, co, { name: 'Factory' });
    const cnc = await asset(supervisor, co, { name: 'CNC machine', parentId: factory.id });
    const hyd = await asset(supervisor, co, { name: 'Hydraulic system', parentId: cnc.id });
    const other = await asset(supervisor, co, { name: 'Forklift' });
    const w1 = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: cnc.id, description: 'Spindle noise' });
    const w2 = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: hyd.id, description: 'Hose leak' });
    await supervisor.json('POST', mt(co, '/work-orders'), { assetId: other.id, description: 'Tyres' });
    const only = await supervisor.json('GET', mt(co, `/work-orders?assetId=${cnc.id}`));
    expect(only.workOrders.map((w: any) => w.id)).toEqual([w1.id]);
    const withChildren = await supervisor.json('GET', mt(co, `/work-orders?assetId=${cnc.id}&includeChildren=1&sort=number`));
    expect(withChildren.workOrders.map((w: any) => w.id)).toEqual([w1.id, w2.id]);
    const fromTop = await supervisor.json('GET', mt(co, `/work-orders?assetId=${factory.id}&includeChildren=1`));
    expect(fromTop.total).toBe(2);
  });
});

describe('CSV import with a preview and duplicate detection', () => {
  it('previews without saving, finds duplicates and bad rows, places assets under parents by number, then imports', async () => {
    const { owner, supervisor, co } = await team('Import');
    await asset(owner, co, { number: 'SITE-1', name: 'Main site' });
    await asset(owner, co, { number: 'PMP-9', name: 'Old pump', manufacturer: 'Acme', serialNumber: 'S-100' });
    const csv = [
      'Asset number,Name,Parent,Manufacturer,Model,Serial number,Purchase date,Purchase cost,Criticality,Status,Spec: Power',
      'FAC-1,Factory,SITE-1,,,,,,high,,',
      'LINE-1,Production line 1,FAC-1,,,,,,,,',
      ',CNC machine,LINE-1,Example,VMC-850,S-200,15/03/2024,"$185,000.00",critical,operating,15 kW',
      'SITE-1,Duplicate site,,,,,,,,,',
      'PMP-10,Same serial,,acme,,s-100,,,,,',
      'PMP-11,Serial twice in file,,Example,,S-200,,,,,',
      'BAD-1,,,,,,,,,,',
      'BAD-2,Bad date,,,,,31/02/2024,,,,',
      'BAD-3,Under a bad row,BAD-2,,,,,,,,',
      'ORPH-1,No such parent,NOPE,,,,,,,,',
      'LOOP-A,Loop A,LOOP-B,,,,,,,,',
      'LOOP-B,Loop B,LOOP-A,,,,,,,,',
    ].join('\r\n');
    // Only administrators import.
    expect((await supervisor.req('POST', mt(co, '/assets/import'), { csv, dryRun: true })).status).toBe(403);
    const preview = await owner.json('POST', mt(co, '/assets/import'), { csv, dryRun: true });
    expect(preview.dryRun).toBe(true);
    const status = Object.fromEntries(preview.rows.map((r: any) => [r.line, r.status]));
    expect(status).toEqual({ 2: 'ok', 3: 'ok', 4: 'ok', 5: 'duplicate', 6: 'duplicate', 7: 'duplicate', 8: 'error', 9: 'error', 10: 'error', 11: 'error', 12: 'error', 13: 'error' });
    expect(preview.summary).toEqual({ total: 12, ok: 3, duplicates: 3, errors: 6 });
    expect(preview.rows.find((r: any) => r.line === 6).messages.join(' ')).toMatch(/PMP-9/);
    expect(preview.rows.find((r: any) => r.line === 8).messages).toContain('Name is missing');
    expect(preview.rows.find((r: any) => r.line === 12).messages.join(' ')).toMatch(/loop/);
    // Nothing saved by the preview.
    expect((await owner.json('GET', mt(co, '/assets'))).total).toBe(2);

    const done = await owner.json('POST', mt(co, '/assets/import'), { csv, dryRun: false });
    expect(done.created).toBe(3);
    const list = await owner.json('GET', mt(co, '/assets?sort=number'));
    expect(list.total).toBe(5);
    const cnc = list.assets.find((x: any) => x.name === 'CNC machine');
    expect(cnc).toMatchObject({ number: 'A-0001', manufacturer: 'Example', serialNumber: 'S-200', purchaseDate: '2024-03-15', purchaseCostCents: 18500000, criticality: 'critical', parentNumber: 'LINE-1' });
    expect(cnc.specs).toEqual([{ key: 'Power', value: '15 kW' }]);
    const detail = await owner.json('GET', mt(co, `/assets/${cnc.id}`));
    expect(detail.path.map((p: any) => p.number)).toEqual(['SITE-1', 'FAC-1', 'LINE-1', 'A-0001']);
    expect(detail.history[0]).toMatchObject({ action: 'asset.imported' });
    // The same file again: everything that was imported is now a duplicate.
    const again = await owner.json('POST', mt(co, '/assets/import'), { csv, dryRun: true });
    expect(again.summary.ok).toBe(0);
    // A new asset after the import continues the numbering.
    expect((await asset(owner, co, { name: 'Next' })).number).toBe('A-0002');
  });
});

describe('J: access across companies and the four maintenance roles', () => {
  it('hides one company’s maintenance from another (404) and from people who only share a tool', async () => {
    const one = await team('Juliet');
    const two = await team('Kilo');
    const a1 = await asset(one.owner, one.co, { name: 'Juliet press' });
    const r1 = await one.requester.json('POST', mt(one.co, '/requests'), { description: 'Press stuck', assetId: a1.id });
    const w1 = await one.supervisor.json('POST', mt(one.co, '/work-orders'), { assetId: a1.id, description: 'Free the press', assignedTo: one.technician.userId });
    const f1 = (await (await one.requester.req('POST', mt(one.co, '/files'), photo('requestId', r1.id))).json()) as any;

    // The other company's owner, at the first company's address: 404 for everything.
    for (const path of ['/me', '/overview', '/assets', `/assets/${a1.id}`, '/requests', `/requests/${r1.id}`, '/work-orders', `/work-orders/${w1.id}`, `/files/${f1.id}`, '/roles']) {
      expect((await two.owner.req('GET', mt(one.co, path))).status, path).toBe(404);
    }
    expect((await two.owner.req('POST', mt(one.co, '/requests'), { description: 'x' })).status).toBe(404);
    // The first company's ids at the other company's address: 404 too.
    for (const path of [`/assets/${a1.id}`, `/requests/${r1.id}`, `/work-orders/${w1.id}`, `/files/${f1.id}`]) {
      expect((await two.owner.req('GET', mt(two.co, path))).status, path).toBe(404);
    }
    expect((await two.owner.req('POST', mt(two.co, '/work-orders'), { assetId: a1.id, description: 'x' })).status).toBe(400);
    expect((await two.owner.req('POST', mt(two.co, '/requests'), { description: 'x', assetId: a1.id })).status).toBe(400);
    expect((await two.owner.req('POST', mt(two.co, '/files'), photo('assetId', a1.id))).status).toBe(404);
    expect((await two.owner.req('POST', mt(two.co, `/requests/${r1.id}/approve`), {})).status).toBe(404);

    // Someone who only shares a tool with the company (a guest) has no access.
    const guest = await signup('Gail Guest');
    await joinOrg(one.owner, one.tools.crm!, guest, 'member');
    expect((await guest.req('GET', mt(one.co, '/me'))).status).toBe(404);
    expect((await guest.json('GET', '/api/maintenance/companies')).companies.map((c: any) => c.id)).not.toContain(one.co);

    // A person's own company: its owner is the administrator; nobody else gets in.
    const solo = await signup('Sam Solo');
    const own = (await solo.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    expect(own.role).toBe('admin');
    expect((await solo.json('GET', mt(own.id, '/me'))).can).toMatchObject({ roles: true, importAssets: true });
    expect((await one.owner.req('GET', mt(own.id, '/assets'))).status).toBe(404);
    const crm = await createOrg(solo, 'Solo Leads');
    await joinOrg(solo, crm, one.requester, 'member');
    expect((await one.requester.req('GET', mt(own.id, '/me'))).status).toBe(404);
  });

  it('gives each role what it may do and refuses actions above it (403)', async () => {
    const { owner, supervisor, technician, requester, co } = await team('Lima');
    expect((await owner.json('GET', mt(co, '/me'))).role).toBe('admin');
    expect((await supervisor.json('GET', mt(co, '/me'))).role).toBe('supervisor');
    expect((await technician.json('GET', mt(co, '/me'))).role).toBe('technician');
    // Members are requesters until an administrator gives them another role.
    expect((await requester.json('GET', mt(co, '/me'))).role).toBe('requester');
    const companyAdmin = await signup('Lima Admin');
    await joinCompany(owner, co, companyAdmin, 'admin');
    expect((await companyAdmin.json('GET', mt(co, '/me'))).role).toBe('admin');

    const a = await asset(supervisor, co, { name: 'Lathe' });
    const mine = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: a.id, description: 'Assigned to the technician', assignedTo: technician.userId });
    const theirs = await supervisor.json('POST', mt(co, '/work-orders'), { assetId: a.id, description: 'Not assigned' });
    const req = await requester.json('POST', mt(co, '/requests'), { description: 'Coolant low', assetId: a.id });

    // Requester: views assets, raises and follows requests; nothing above that.
    expect((await requester.req('GET', mt(co, '/assets'))).status).toBe(200);
    expect((await requester.req('GET', mt(co, `/assets/${a.id}`))).status).toBe(200);
    expect((await requester.req('POST', mt(co, '/assets'), { name: 'Mine' })).status).toBe(403);
    expect((await requester.req('PATCH', mt(co, `/assets/${a.id}`), { name: 'Renamed' })).status).toBe(403);
    expect((await requester.req('POST', mt(co, `/assets/${a.id}/archive`), {})).status).toBe(403);
    expect((await requester.req('POST', mt(co, '/files'), photo('assetId', a.id))).status).toBe(403);
    expect((await requester.req('POST', mt(co, '/work-orders'), { assetId: a.id, description: 'x' })).status).toBe(403);
    expect((await requester.req('GET', mt(co, `/work-orders/${mine.id}`))).status).toBe(404);
    expect((await requester.json('GET', mt(co, '/work-orders'))).workOrders).toEqual([]);
    expect((await requester.req('POST', mt(co, `/requests/${req.id}/approve`), {})).status).toBe(403);
    expect((await requester.req('POST', mt(co, '/assets/import'), { csv: 'Name\nX', dryRun: true })).status).toBe(403);
    expect((await requester.req('GET', mt(co, '/roles'))).status).toBe(403);
    expect((await requester.req('PUT', mt(co, `/roles/${requester.userId}`), { role: 'admin' })).status).toBe(403);
    expect((await requester.req('GET', mt(co, '/events'))).status).toBe(403);
    expect((await requester.req('PATCH', mt(co, `/requests/${req.id}`), { priority: 'urgent' })).status).toBe(200);

    // Technician: works on their own work orders only.
    expect((await technician.req('GET', mt(co, `/work-orders/${mine.id}`))).status).toBe(200);
    expect((await technician.req('GET', mt(co, `/work-orders/${theirs.id}`))).status).toBe(404);
    expect((await technician.req('POST', mt(co, `/work-orders/${theirs.id}/timer/start`), {})).status).toBe(404);
    expect((await technician.req('POST', mt(co, `/work-orders/${theirs.id}/complete`), { notes: 'x' })).status).toBe(404);
    expect((await technician.req('POST', mt(co, '/work-orders'), { assetId: a.id, description: 'x' })).status).toBe(403);
    expect((await technician.req('POST', mt(co, `/work-orders/${mine.id}/cancel`), { reason: 'x' })).status).toBe(403);
    expect((await technician.req('POST', mt(co, `/requests/${req.id}/approve`), {})).status).toBe(403);
    expect((await technician.req('POST', mt(co, '/assets'), { name: 'x' })).status).toBe(403);
    expect((await technician.req('POST', mt(co, `/work-orders/${mine.id}/status`), { status: 'on_hold', note: 'Waiting for a part' })).status).toBe(200);
    expect((await technician.req('POST', mt(co, `/work-orders/${mine.id}/status`), { status: 'open' })).status).toBe(403);

    // Supervisor: assets, requests and work orders; not the import, roles or settings.
    expect((await supervisor.req('POST', mt(co, `/requests/${req.id}/approve`), {})).status).toBe(200);
    expect((await supervisor.req('POST', mt(co, '/assets/import'), { csv: 'Name\nX', dryRun: true })).status).toBe(403);
    expect((await supervisor.req('GET', mt(co, '/roles'))).status).toBe(403);
    expect((await supervisor.req('PUT', mt(co, `/roles/${requester.userId}`), { role: 'technician' })).status).toBe(403);
    expect((await supervisor.req('GET', mt(co, '/events'))).status).toBe(200);

    // Administrator: roles. The owner always stays an administrator; a role can be put back to the default.
    const roles = await owner.json('GET', mt(co, '/roles'));
    expect(roles.people.find((p: any) => p.id === requester.userId)).toMatchObject({ role: 'requester', roleIsDefault: true });
    expect((await owner.req('PUT', mt(co, `/roles/${owner.userId}`), { role: 'requester' })).status).toBe(400);
    await owner.json('PUT', mt(co, `/roles/${technician.userId}`), { role: null });
    expect((await technician.json('GET', mt(co, '/me'))).role).toBe('requester');
    expect((await technician.req('GET', mt(co, `/work-orders/${mine.id}`))).status).toBe(404);
    const events = await owner.json('GET', mt(co, '/events'));
    expect(events.events.map((e: any) => e.action)).toContain('role.changed');
    // People outside the company cannot be given a role.
    const stranger = await signup('Stranger');
    expect((await owner.req('PUT', mt(co, `/roles/${stranger.userId}`), { role: 'technician' })).status).toBe(404);
  });
});
