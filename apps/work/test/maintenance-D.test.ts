// BIZOMAT ERP Maintenance, the field release, stream D (src/worker/maintenance/routes-job.ts, signoff.ts, alerts.ts): the
// printable job card (read only, never a cost), the sign-off at completion (a typed name and a picture drawn on screen,
// not a verified electronic signature), work recorded after it was done, the two completing settings, and alerts in
// the ERP with email copies only behind the flag maintenance_email_alerts (off) and never for the example company.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { sendMtAlert } from '../src/worker/maintenance/alerts';
import { FLAGS, flagOn } from '../src/worker/platform/flags';
import { setEmailProviderForTests, type EmailProvider, type OutgoingEmail } from '../src/worker/services/email/provider';
import { utcDate } from '../src/worker/maintenance/m2util';

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
  return data.company.id as string;
}

async function joinCompany(owner: Client, companyId: string, invitee: Client) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const mt = (co: string, path = '') => `/api/maintenance/c/${co}${path}`;
const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;

/** A registered company with an owner (administrator), a supervisor, two technicians and a requester. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const co = await registerCompany(owner, `${label} Manufacturing`);
  const supervisor = await signup(`${label} Supervisor`);
  const technician = await signup(`${label} Technician`);
  const tech2 = await signup(`${label} Second Technician`);
  const requester = await signup(`${label} Employee`);
  for (const p of [supervisor, technician, tech2, requester]) await joinCompany(owner, co, p);
  await owner.json('PUT', mt(co, `/roles/${supervisor.userId}`), { role: 'supervisor' });
  await owner.json('PUT', mt(co, `/roles/${technician.userId}`), { role: 'technician' });
  await owner.json('PUT', mt(co, `/roles/${tech2.userId}`), { role: 'technician' });
  return { owner, supervisor, technician, tech2, requester, co };
}

function upload(field: 'workOrderId', id: string, name: string, bytes: Uint8Array, type: string) {
  const fd = new FormData();
  fd.set('file', new File([bytes], name, { type }));
  fd.set(field, id);
  return fd;
}

/** The header of a PNG (signature, IHDR of the size given) and `pad` zero bytes, as a data address. */
function sigPng(w = 600, h = 200, pad = 200) {
  const head = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52];
  const be = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
  const bytes = [...head, ...be(w), ...be(h), 8, 6, 0, 0, 0, 0, 0, 0, 0, ...new Array(pad).fill(0)];
  return `data:image/png;base64,${btoa(String.fromCharCode(...bytes))}`;
}

const days = (n: number) => utcDate(Date.now() + n * 86_400_000);

async function until(fn: () => Promise<boolean>, ms = 3000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await fn()) return true;
    await new Promise((r) => setTimeout(r, 50));
  }
  return fn();
}

const alertsOf = (co: string, userId: string) => env.DB.prepare('SELECT * FROM erp_alerts WHERE company_id = ? AND user_id = ? ORDER BY created_at').bind(co, userId).all<any>().then((r) => r.results);
const alertCount = async (co: string) => (await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_alerts WHERE company_id = ?').bind(co).first<{ n: number }>())!.n;

async function workOrder(supervisor: Client, co: string, assetId: string, assignedTo: string, extra: Record<string, unknown> = {}) {
  return supervisor.json('POST', mt(co, '/work-orders'), { assetId, description: 'Replace the pump seal', assignedTo, ...extra });
}

describe('the job card', () => {
  it('prints the asset, the work, tasks, parts, inspections, labour, notes and files, never a cost', async () => {
    const { owner, supervisor, technician, co } = await team('Card');
    const plant = await owner.json('POST', mt(co, '/assets'), { name: 'Plant' });
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump 1', parentId: plant.id, manufacturer: 'Example Pumps', model: 'P-200', serialNumber: 'EP-0001', registrationNumber: 'REG-1', location: 'Bay 2', purchaseCostCents: 500000 });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId, {
      instructions: 'Isolate, drain, replace the seal',
      safety: 'Lock out the motor',
      tasks: ['Isolate the pump', 'Replace the seal'],
      parts: [{ part: 'Mechanical seal', quantity: 1 }],
    });
    // A part line naming an ERP product prints the product's number.
    const product = await owner.json('POST', erp(co, '/products'), { name: 'Mechanical seal', type: 'consumable' });
    await env.DB.prepare('UPDATE mt_wo_parts SET product_id = ? WHERE company_id = ? AND work_order_id = ?').bind(product.id, co, wo.id).run();
    const tpl = await owner.json('POST', mt(co, '/inspection-templates'), {
      name: 'Pump check',
      failAction: 'none',
      items: [
        { label: 'Leaks', kind: 'pass_fail' },
        { label: 'Pressure', kind: 'number', unit: 'bar', min: 2, max: 4 },
        { label: 'Remarks', kind: 'text', required: false },
      ],
    });
    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/inspections`), { templateId: tpl.id });
    const photo = await technician.json('POST', mt(co, '/files'), upload('workOrderId', wo.id, 'fault.png', PNG, 'image/png'));
    await technician.json('POST', mt(co, '/files'), upload('workOrderId', wo.id, 'manual.pdf', new TextEncoder().encode('%PDF-1.4 example'), 'application/pdf'));
    await technician.json('POST', mt(co, `/work-orders/${wo.id}/comments`), { body: 'Seal weeping' });
    await technician.json('POST', mt(co, `/work-orders/${wo.id}/labour`), { date: days(0), minutes: 30 });

    const card = await technician.json('GET', mt(co, `/work-orders/${wo.id}/job-card`));
    expect(card).toMatchObject({
      company: { id: co, name: 'Card Manufacturing' },
      printedBy: 'Card Technician',
      workOrder: { number: wo.number, status: 'assigned', instructions: 'Isolate, drain, replace the seal', safety: 'Lock out the motor' },
      asset: { name: 'Pump 1', manufacturer: 'Example Pumps', model: 'P-200', serialNumber: 'EP-0001', registrationNumber: 'REG-1', location: 'Bay 2' },
      parts: [{ part: 'Mechanical seal', quantity: 1, productNumber: product.number }],
      labour: [{ minutes: 30, entry: 'manual', userName: 'Card Technician', workDate: days(0) }],
      signOff: null,
    });
    expect(card.printedAt).toEqual(expect.any(Number));
    expect(card.assetPath.map((p: any) => p.name)).toEqual(['Plant', 'Pump 1']);
    expect(card.tasks.map((t: any) => t.text)).toEqual(['Isolate the pump', 'Replace the seal']);
    expect(card.tasks.map((t: any) => t.done)).toEqual([false, false]);
    expect(card.inspections[0].items.map((i: any) => i.kind)).toEqual(['pass_fail', 'number', 'text']);
    expect(card.inspections[0].items[1]).toMatchObject({ unit: 'bar', min: 2, max: 4 });
    expect(card.files.images.map((f: any) => f.name)).toEqual(['fault.png']);
    expect(card.files.images[0].url).toBe(`/api/maintenance/c/${co}/files/${photo.id}`);
    expect(card.files.documents.map((f: any) => f.name)).toEqual(['manual.pdf']);
    expect(card.notes[0].body).toBe('Seal weeping');
    expect(JSON.stringify(card)).not.toMatch(/cents/i);
    const ownerCard = await owner.json('GET', mt(co, `/work-orders/${wo.id}/job-card`));
    expect(JSON.stringify(ownerCard)).not.toMatch(/cents/i);
    expect(ownerCard.labour).toHaveLength(1);
  });

  it('is shown only to people who may see the work order, and not while the module is off', async () => {
    const { owner, supervisor, technician, requester, co } = await team('Access');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    expect((await requester.req('GET', mt(co, `/work-orders/${wo.id}/job-card`))).status).toBe(404);
    const other = await signup('Access Other Owner');
    await registerCompany(other, 'Access Other');
    expect((await other.req('GET', mt(co, `/work-orders/${wo.id}/job-card`))).status).toBe(404);

    // A work order made from the requester's own request: the requester may print it. The answer keeps its shape.
    const r = await requester.json('POST', mt(co, '/requests'), { description: 'The pump leaks', assetId: pump.id });
    const conv = await supervisor.req('POST', mt(co, `/requests/${r.id}/convert`), { assignedTo: technician.userId });
    expect(conv.status).toBe(201);
    const made = (await conv.json()) as any;
    expect(Object.keys(made).sort()).toEqual(['request', 'workOrder']);
    expect(made.request.status).toBe('converted');
    expect((await requester.req('GET', mt(co, `/work-orders/${made.workOrder.id}/job-card`))).status).toBe(200);

    await env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('module_maintenance_enabled', 'company', ?, 'off', 'test', 'test', ?)").bind(co, Date.now()).run();
    try {
      const off = await owner.req('GET', mt(co, `/work-orders/${wo.id}/job-card`));
      expect(off.status).toBe(403);
      expect(((await off.json()) as any).details.code).toBe('MODULE_DISABLED');
    } finally {
      await env.DB.prepare("DELETE FROM feature_flags WHERE key = 'module_maintenance_enabled' AND scope = 'company' AND scope_id = ?").bind(co).run();
    }
  });
});

describe('the sign-off at completion', () => {
  it('is optional by default, kept as a file of the work order and shown on the job card', async () => {
    const { owner, supervisor, technician, co } = await team('Sign');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    const plain = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Seal replaced' });
    expect(plain).toMatchObject({ status: 'completed', completionNotes: 'Seal replaced', signedByName: null, signedByRole: '', signedAt: null, signatureFileId: null, signatureUrl: null, recordedDone: false });

    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'Check the seal again' });
    const signed = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'Pat Example', role: 'Site supervisor', image: sigPng() } });
    expect(signed).toMatchObject({ status: 'completed', signedByName: 'Pat Example', signedByRole: 'Site supervisor', signedAt: expect.any(Number), signatureFileId: expect.any(String) });
    expect(signed.signatureUrl).toBe(`/api/maintenance/c/${co}/files/${signed.signatureFileId}`);
    const pic = await technician.req('GET', signed.signatureUrl);
    expect(pic.status).toBe(200);
    expect(pic.headers.get('Content-Type')).toBe('image/png');
    const row = await env.DB.prepare('SELECT work_order_id, mime, name, size FROM mt_files WHERE company_id = ? AND id = ?').bind(co, signed.signatureFileId).first<any>();
    expect(row).toMatchObject({ work_order_id: wo.id, mime: 'image/png', name: `signature-${wo.number}.png`, size: 233 });

    const detail = await supervisor.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(detail.history.find((e: any) => e.action === 'work_order.completed' && e.summary.includes('signed off by Pat Example'))).toBeTruthy();
    const card = await technician.json('GET', mt(co, `/work-orders/${wo.id}/job-card`));
    expect(card.signOff).toMatchObject({ name: 'Pat Example', role: 'Site supervisor', at: signed.signedAt, url: signed.signatureUrl });
    expect(card.files.images.map((f: any) => f.id)).not.toContain(signed.signatureFileId);
  });

  it('refuses a picture it cannot read, and changes nothing', async () => {
    const { owner, supervisor, technician, co } = await team('Pic');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    const complete = (signature: unknown) => technician.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature });
    for (const image of ['data:image/jpeg;base64,AAAA', sigPng(10, 200), sigPng(600, 200, 0), 'data:image/png;base64,***']) {
      const res = await complete({ name: 'Pat Example', image });
      expect(res.status).toBe(400);
      expect(((await res.json()) as any).details.code).toBe('SIGNATURE_INVALID');
    }
    expect((await complete({ name: 'Pat Example', image: `data:image/png;base64,${'A'.repeat(400_001)}` })).status).toBe(400);
    expect((await complete({ name: '', image: sigPng() })).status).toBe(400);
    const after = await technician.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(after.workOrder.status).toBe('assigned');
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_files WHERE company_id = ? AND work_order_id = ?').bind(co, wo.id).first<{ n: number }>())!.n).toBe(0);
  });

  it('is required when an administrator asks for it', async () => {
    const { owner, supervisor, technician, co } = await team('Need');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    expect((await supervisor.req('PATCH', mt(co, '/settings/work-orders'), { requireSignature: true })).status).toBe(403);
    const empty = await owner.req('PATCH', mt(co, '/settings/work-orders'), {});
    expect(empty.status).toBe(400);
    expect(((await empty.json()) as any).error).toBe('Nothing to change');
    expect(await owner.json('PATCH', mt(co, '/settings/work-orders'), { requireSignature: true })).toEqual({ requireSignature: true, techniciansRecordWork: false });
    expect((await technician.json('GET', mt(co, '/me'))).requireSignature).toBe(true);
    const refused = await technician.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'x' });
    expect(refused.status).toBe(400);
    expect(((await refused.json()) as any).details.code).toBe('SIGNATURE_REQUIRED');
    expect((await technician.json('GET', mt(co, `/work-orders/${wo.id}`))).workOrder.status).toBe('assigned');
    const ok = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'x', signature: { name: 'Pat Example', image: sigPng() } });
    expect(ok).toMatchObject({ status: 'completed', signedByName: 'Pat Example', signedByRole: '' });
    const ev = await env.DB.prepare("SELECT summary FROM mt_events WHERE company_id = ? AND action = 'settings.changed' ORDER BY created_at").bind(co).all<{ summary: string }>();
    expect(ev.results.map((e) => e.summary)).toContain('Completing a work order now needs a signature');
    expect(await owner.json('PATCH', mt(co, '/settings/work-orders'), { requireSignature: false })).toEqual({ requireSignature: false, techniciansRecordWork: false });
    expect((await technician.json('GET', mt(co, '/me'))).requireSignature).toBe(false);
  });

  it('keeps the signature picture while the work order names it', async () => {
    const { owner, supervisor, technician, co } = await team('Keep');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    const signed = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'Pat Example', image: sigPng() } });
    // Completed: the work order is locked.
    expect((await technician.req('DELETE', mt(co, `/files/${signed.signatureFileId}`))).status).toBe(409);
    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'One more check' });
    const kept = await supervisor.req('DELETE', mt(co, `/files/${signed.signatureFileId}`));
    expect(kept.status).toBe(409);
    expect(((await kept.json()) as any).error).toBe('This is the signature of the work order’s sign-off. It stays with the work order.');
    // Completed again without a sign-off: the earlier picture is an ordinary file of the work order.
    const again = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Checked' });
    expect(again.signatureFileId).toBeNull();
    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'Tidy the files' });
    expect((await supervisor.req('DELETE', mt(co, `/files/${signed.signatureFileId}`))).status).toBe(200);
  });

  it('stores one picture when two people complete the same work order at once', async () => {
    const { owner, supervisor, technician, co } = await team('Race');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    const [a, b] = await Promise.all([
      technician.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'A', image: sigPng() } }),
      supervisor.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'B', image: sigPng() } }),
    ]);
    expect([a.status, b.status].sort()).toEqual([200, 409]);
    const winner = a.status === 200 ? 'A' : 'B';
    const files = await env.DB.prepare('SELECT id FROM mt_files WHERE company_id = ? AND work_order_id = ? AND name = ?').bind(co, wo.id, `signature-${wo.number}.png`).all<{ id: string }>();
    expect(files.results).toHaveLength(1);
    const w = await env.DB.prepare('SELECT signature_file_id, signed_by_name FROM mt_work_orders WHERE company_id = ? AND id = ?').bind(co, wo.id).first<any>();
    expect(w.signature_file_id).toBe(files.results[0].id);
    expect(w.signed_by_name).toBe(winner);
  });
});

describe('work recorded after it was done', () => {
  it('makes and completes a work order in one step, counted like any other', async () => {
    const { owner, supervisor, co } = await team('Done');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const before = (await supervisor.json('GET', mt(co, '/overview'))).completedNotClosed;
    const payload = { assetId: pump.id, description: 'Replaced the drive belt', jobType: 'corrective', doneDate: days(-1), minutes: 45, notes: 'Belt replaced and tensioned', requestKey: 'rk-00000001' };
    const res = await supervisor.req('POST', mt(co, '/work-orders/done'), payload);
    expect(res.status).toBe(201);
    const w = (await res.json()) as any;
    expect(w).toMatchObject({ status: 'completed', recordedDone: true, completionNotes: 'Belt replaced and tensioned', completedBy: supervisor.userId, assignedTo: supervisor.userId, dueStart: days(-1), dueFinish: days(-1), jobType: 'corrective', priority: 'medium' });
    expect(new Date(w.completedAt).toISOString().slice(0, 10)).toBe(days(-1));
    const d = await supervisor.json('GET', mt(co, `/work-orders/${w.id}`));
    expect(d.labourCosts).toEqual([expect.objectContaining({ minutes: 45, entry: 'manual', workDate: days(-1), userId: supervisor.userId })]);
    const actions = d.history.map((e: any) => e.action);
    expect(actions).toContain('work_order.created');
    expect(actions).toContain('work_order.recorded_done');
    expect(d.history.find((e: any) => e.action === 'work_order.recorded_done').summary).toBe(`Work order ${w.number} recorded as done on ${days(-1)}: 45 min`);
    expect((await supervisor.json('GET', mt(co, '/overview'))).completedNotClosed).toBe(before + 1);
    expect((await supervisor.json('GET', mt(co, '/work-orders?status=completed'))).workOrders.map((x: any) => x.id)).toContain(w.id);
    const costs = await supervisor.json('GET', mt(co, `/reports/costs?from=${days(-2)}&to=${days(0)}&today=${days(0)}`));
    expect(costs.assets.find((x: any) => x.assetId === pump.id).labourMinutes).toBe(45);

    const twice = await supervisor.req('POST', mt(co, '/work-orders/done'), payload);
    expect(twice.status).toBe(409);
    expect(((await twice.json()) as any).error).toBe('This was already recorded: refresh to see it');
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_work_orders WHERE company_id = ? AND description = ?').bind(co, 'Replaced the drive belt').first<{ n: number }>())!.n).toBe(1);
  });

  it('places the work at noon of the day done in the person’s own time zone, never after now', async () => {
    const { owner, supervisor, co } = await team('Zone');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const nz = await supervisor.json('POST', mt(co, '/work-orders/done'), { assetId: pump.id, description: 'Greased the bearings', doneDate: days(-2), notes: 'Greased', tzOffset: -780 });
    expect(nz.completedAt).toBe(Date.parse(`${days(-2)}T12:00:00Z`) - 780 * 60_000);
    const t0 = Date.now();
    const today = await supervisor.json('POST', mt(co, '/work-orders/done'), { assetId: pump.id, description: 'Checked the guard', doneDate: days(1), notes: 'Checked', tzOffset: 840 });
    expect(today.completedAt).toBeLessThanOrEqual(Date.now());
    expect(today.completedAt).toBeGreaterThanOrEqual(t0 - 1000);
    expect((await supervisor.req('POST', mt(co, '/work-orders/done'), { assetId: pump.id, description: 'x', doneDate: days(-1), notes: 'x', tzOffset: 900 })).status).toBe(400);
  });

  it('follows who may record it, for whom and when', async () => {
    const { owner, supervisor, technician, requester, co } = await team('Who');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const base = { assetId: pump.id, description: 'Changed the filter', doneDate: days(-1), notes: 'Filter changed' };
    const forTech = await supervisor.json('POST', mt(co, '/work-orders/done'), { ...base, doneBy: technician.userId, minutes: 20 });
    expect(forTech).toMatchObject({ assignedTo: technician.userId, completedBy: supervisor.userId });
    expect((await supervisor.json('GET', mt(co, `/work-orders/${forTech.id}`))).labourCosts[0].userId).toBe(technician.userId);
    expect((await technician.json('GET', mt(co, '/work-orders?mine=1&status=completed'))).workOrders.map((x: any) => x.id)).toContain(forTech.id);

    const off = await technician.req('POST', mt(co, '/work-orders/done'), base);
    expect(off.status).toBe(403);
    expect(((await off.json()) as any).error).toBe('Only supervisors and administrators record work already done. An administrator can let technicians do it in Maintenance settings.');
    expect((await technician.json('GET', mt(co, '/me'))).can.recordWork).toBe(false);
    expect(await owner.json('PATCH', mt(co, '/settings/work-orders'), { techniciansRecordWork: true })).toEqual({ requireSignature: false, techniciansRecordWork: true });
    expect((await technician.json('GET', mt(co, '/me'))).can.recordWork).toBe(true);
    const own = await technician.req('POST', mt(co, '/work-orders/done'), base);
    expect(own.status).toBe(201);
    expect(((await own.json()) as any).assignedTo).toBe(technician.userId);
    const forOther = await technician.req('POST', mt(co, '/work-orders/done'), { ...base, doneBy: supervisor.userId });
    expect(forOther.status).toBe(403);
    expect(((await forOther.json()) as any).error).toBe('Technicians record only their own work');
    expect((await requester.req('POST', mt(co, '/work-orders/done'), base)).status).toBe(403);
    expect((await requester.json('GET', mt(co, '/me'))).can.recordWork).toBe(false);

    for (const doneDate of [days(2), days(-400), '2026-02-30']) expect((await supervisor.req('POST', mt(co, '/work-orders/done'), { ...base, doneDate })).status).toBe(400);
    expect((await supervisor.req('POST', mt(co, '/work-orders/done'), { ...base, doneBy: requester.userId })).status).toBe(400);
    const old = await owner.json('POST', mt(co, '/assets'), { name: 'Old pump' });
    await owner.json('POST', mt(co, `/assets/${old.id}/archive`), {});
    expect((await supervisor.req('POST', mt(co, '/work-orders/done'), { ...base, assetId: old.id })).status).toBe(400);
    const other = await signup('Who Other Owner');
    const otherCo = await registerCompany(other, 'Who Other');
    const foreign = await other.json('POST', mt(otherCo, '/assets'), { name: 'Their pump' });
    expect((await supervisor.req('POST', mt(co, '/work-orders/done'), { ...base, assetId: foreign.id })).status).toBe(400);

    await owner.json('PATCH', mt(co, '/settings/work-orders'), { requireSignature: true });
    const unsigned = await supervisor.req('POST', mt(co, '/work-orders/done'), base);
    expect(unsigned.status).toBe(400);
    expect(((await unsigned.json()) as any).details.code).toBe('SIGNATURE_REQUIRED');
    const signed = await supervisor.req('POST', mt(co, '/work-orders/done'), { ...base, signature: { name: 'Pat Example', role: 'Operator', image: sigPng() } });
    expect(signed.status).toBe(201);
    const sw = (await signed.json()) as any;
    expect(sw).toMatchObject({ signedByName: 'Pat Example', signedByRole: 'Operator', recordedDone: true });
    expect(await env.DB.prepare('SELECT name FROM mt_files WHERE company_id = ? AND id = ?').bind(co, sw.signatureFileId).first()).toEqual({ name: `signature-${sw.number}.png` });
  });

  it('records the downtime, which the reliability report counts', async () => {
    const { owner, supervisor, co } = await team('Down');
    const press = await owner.json('POST', mt(co, '/assets'), { name: 'Press' });
    const res = await supervisor.req('POST', mt(co, '/work-orders/done'), {
      assetId: press.id,
      description: 'Replaced the snapped belt',
      jobType: 'breakdown',
      doneDate: days(-1),
      notes: 'New belt fitted',
      downtime: { startedAt: Date.parse(`${days(-1)}T08:00:00Z`), endedAt: Date.parse(`${days(-1)}T09:30:00Z`), cause: 'Belt snapped' },
    });
    expect(res.status).toBe(201);
    const w = (await res.json()) as any;
    expect((await supervisor.json('GET', mt(co, `/work-orders/${w.id}`))).downtime).toMatchObject({ minutes: 90, cause: 'Belt snapped' });
    const rel = await supervisor.json('GET', mt(co, `/reports/reliability?from=${days(-2)}&to=${days(0)}`));
    expect(rel.assets.find((x: any) => x.assetId === press.id)).toMatchObject({ failures: 1, downtimeHours: 1.5 });
    const backwards = await supervisor.req('POST', mt(co, '/work-orders/done'), { assetId: press.id, description: 'x', doneDate: days(-1), notes: 'x', downtime: { startedAt: Date.parse(`${days(-1)}T09:00:00Z`), endedAt: Date.parse(`${days(-1)}T08:00:00Z`) } });
    expect(backwards.status).toBe(400);
  });
});

describe('alerts', () => {
  it('tells approvers about requests, and requesters about decisions and information asked for', async () => {
    const { owner, supervisor, technician, requester, co } = await team('Alert');
    const r1 = await requester.json('POST', mt(co, '/requests'), { description: 'Water on the floor at bay 2' });
    for (const p of [owner, supervisor]) {
      const mine = (await alertsOf(co, p.userId)).filter((x) => x.record_id === r1.id);
      expect(mine).toHaveLength(1);
      expect(mine[0]).toMatchObject({ kind: 'approval', title: `Request ${r1.number} is waiting for your approval`, body: 'Water on the floor at bay 2', link: `/c/${co}/maintenance/requests/${r1.id}`, emailed: 0 });
      expect(mine[0].dedupe_key).toMatch(/^mt:req:/);
    }
    expect(await alertsOf(co, technician.userId)).toHaveLength(0);
    expect(await alertsOf(co, requester.userId)).toHaveLength(0);
    const bell = await supervisor.json('GET', erp(co, '/x/alerts'));
    expect(bell.alerts[0]).toMatchObject({ kind: 'approval', read: false, title: `Request ${r1.number} is waiting for your approval` });
    expect(bell.unread).toBeGreaterThanOrEqual(1);

    const own = await supervisor.json('POST', mt(co, '/requests'), { description: 'Light out in the store' });
    expect((await alertsOf(co, owner.userId)).filter((x) => x.record_id === own.id)).toHaveLength(1);
    expect((await alertsOf(co, supervisor.userId)).filter((x) => x.record_id === own.id)).toHaveLength(0);

    await supervisor.json('POST', mt(co, `/requests/${r1.id}/approve`), { note: 'ok' });
    expect((await alertsOf(co, requester.userId)).find((x) => x.record_id === r1.id)).toMatchObject({ kind: 'decision', title: `Your request ${r1.number} was approved`, body: 'ok' });

    const r2 = await requester.json('POST', mt(co, '/requests'), { description: 'Water on the floor again' });
    await supervisor.json('POST', mt(co, `/requests/${r2.id}/decline`), { reason: 'Duplicate' });
    expect((await alertsOf(co, requester.userId)).find((x) => x.record_id === r2.id)).toMatchObject({ kind: 'decision', title: `Your request ${r2.number} was declined`, body: 'Reason: Duplicate' });

    const r3 = await requester.json('POST', mt(co, '/requests'), { description: 'A noise from a machine' });
    await supervisor.json('POST', mt(co, `/requests/${r3.id}/request-info`), { comment: 'Which bay?' });
    expect((await alertsOf(co, requester.userId)).find((x) => x.record_id === r3.id)).toMatchObject({ kind: 'info', title: `More information is needed on your request ${r3.number}`, body: 'Which bay?' });
    await requester.json('POST', mt(co, `/requests/${r3.id}/respond`), { comment: 'Bay 4' });
    const given = `Request ${r3.number} has the information you asked for`;
    expect((await alertsOf(co, supervisor.userId)).find((x) => x.title === given)).toMatchObject({ kind: 'approval', body: 'Bay 4' });
    expect((await alertsOf(co, owner.userId)).find((x) => x.title === given)).toBeUndefined();
  });

  it('tells requesters about their work orders and technicians about work given to them', async () => {
    const { owner, supervisor, technician, tech2, requester, co } = await team('Assign');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const r = await requester.json('POST', mt(co, '/requests'), { description: 'The pump leaks', assetId: pump.id });
    const conv = await supervisor.json('POST', mt(co, `/requests/${r.id}/convert`), { assignedTo: technician.userId, dueFinish: days(3) });
    const wo = conv.workOrder;
    expect((await alertsOf(co, requester.userId)).find((x) => x.record_id === r.id && x.kind === 'work_order')).toMatchObject({ title: `Work order ${wo.number} was made from your request ${r.number}`, link: `/c/${co}/maintenance/requests/${r.id}` });
    const given = (await alertsOf(co, technician.userId)).filter((x) => x.record_id === wo.id);
    expect(given).toHaveLength(1);
    expect(given[0]).toMatchObject({ kind: 'assigned', title: `Work order ${wo.number} was given to you`, link: `/c/${co}/maintenance/work-orders/${wo.id}`, body: `${pump.number} Pump: The pump leaks Due ${days(3)}.` });

    await supervisor.json('PATCH', mt(co, `/work-orders/${wo.id}`), { assignedTo: tech2.userId });
    expect((await alertsOf(co, tech2.userId)).filter((x) => x.record_id === wo.id)).toHaveLength(1);
    const count = await alertCount(co);
    await supervisor.json('PATCH', mt(co, `/work-orders/${wo.id}`), { priority: 'high' });
    expect(await alertCount(co)).toBe(count);
    const selfWo = await workOrder(supervisor, co, pump.id, supervisor.userId);
    expect(await alertCount(co)).toBe(count);

    await tech2.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Seal replaced' });
    expect((await alertsOf(co, requester.userId)).find((x) => x.record_id === r.id && x.kind === 'completed')).toMatchObject({ title: `Your request ${r.number} is done`, body: `Work order ${wo.number} was completed.` });

    const r4 = await requester.json('POST', mt(co, '/requests'), { description: 'The pump leaks again', assetId: pump.id });
    await supervisor.json('POST', mt(co, `/requests/${r4.id}/attach`), { workOrderId: selfWo.id });
    expect((await alertsOf(co, requester.userId)).find((x) => x.record_id === r4.id && x.kind === 'work_order')).toMatchObject({ title: `Your request ${r4.number} was added to work order ${selfWo.number}` });
  });

  it('sends each alert once, only to people in the company, never to the person acting', async () => {
    const { owner, requester, co } = await team('Once');
    const sender = { companyId: co, kind: 'registered' as const, companyName: 'Once Manufacturing', userId: owner.userId };
    const n = { to: [requester.userId], kind: 'request' as const, title: 'A test alert', link: `/c/${co}/maintenance`, recordId: 'x', dedupe: 'twice' };
    expect(await sendMtAlert(env, sender, n)).toBe(1);
    expect(await sendMtAlert(env, sender, n)).toBe(0);
    expect((await alertsOf(co, requester.userId)).filter((x) => x.dedupe_key === `mt:twice:${requester.userId}`)).toHaveLength(1);
    expect(await sendMtAlert(env, { ...sender, userId: requester.userId }, { ...n, dedupe: 'self' })).toBe(0);
    await env.DB.prepare('DELETE FROM co_members WHERE company_id = ? AND user_id = ?').bind(co, requester.userId).run();
    expect(await sendMtAlert(env, sender, { ...n, dedupe: 'gone' })).toBe(0);
  });

  it('shows in the ERP alerts bell, marked read one at a time or all at once', async () => {
    const { supervisor, requester, co } = await team('Bell');
    for (const d of ['One', 'Two', 'Three']) {
      const r = await requester.json('POST', mt(co, '/requests'), { description: `Fault ${d}` });
      await supervisor.json('POST', mt(co, `/requests/${r.id}/approve`), {});
    }
    const bell = await requester.json('GET', erp(co, '/x/alerts'));
    expect(bell.unread).toBe(3);
    await requester.json('POST', erp(co, '/x/alerts/read'), { ids: [bell.alerts[0].id] });
    expect((await requester.json('GET', erp(co, '/x/alerts'))).unread).toBe(2);
    await requester.json('POST', erp(co, '/x/alerts/read'), { all: true });
    expect((await requester.json('GET', erp(co, '/x/alerts'))).unread).toBe(0);
    const other = await signup('Bell Other Owner');
    const otherCo = await registerCompany(other, 'Bell Other');
    expect((await requester.req('GET', erp(otherCo, '/x/alerts'))).status).toBe(404);
  });
});

class FakeProvider implements EmailProvider {
  readonly name = 'fake';
  sent: OutgoingEmail[] = [];
  async send(m: OutgoingEmail) {
    this.sent.push(m);
    return { ok: true as const, messageId: `<mt${this.sent.length}.${crypto.randomUUID()}@test>` };
  }
}

const outboxFor = async (email: string) => (await env.DB.prepare("SELECT COUNT(*) AS n FROM email_outbox WHERE template = 'erp_alert' AND to_email = ?").bind(email.toLowerCase()).first<{ n: number }>())!.n;

describe('email copies of alerts', () => {
  it('go only while the flag is on for the company', async () => {
    const { supervisor, requester, co } = await team('Mail');
    setEmailProviderForTests(new FakeProvider());
    try {
      const r1 = await requester.json('POST', mt(co, '/requests'), { description: 'A first fault' });
      await new Promise((r) => setTimeout(r, 300));
      const rows = await env.DB.prepare('SELECT emailed FROM erp_alerts WHERE company_id = ? AND record_id = ?').bind(co, r1.id).all<{ emailed: number }>();
      expect(rows.results.length).toBe(2);
      expect(rows.results.every((x) => x.emailed === 0)).toBe(true);
      expect(await outboxFor(supervisor.email)).toBe(0);

      await env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('maintenance_email_alerts', 'company', ?, 'on', 'test', 'test', ?)").bind(co, Date.now()).run();
      const r2 = await requester.json('POST', mt(co, '/requests'), { description: 'A second fault' });
      expect(await until(async () => (await outboxFor(supervisor.email)) === 1)).toBe(true);
      expect(await until(async () => (await env.DB.prepare('SELECT emailed FROM erp_alerts WHERE company_id = ? AND record_id = ? AND user_id = ?').bind(co, r2.id, supervisor.userId).first<{ emailed: number }>())?.emailed === 1)).toBe(true);
    } finally {
      await env.DB.prepare("DELETE FROM feature_flags WHERE key = 'maintenance_email_alerts' AND scope = 'company' AND scope_id = ?").bind(co).run();
      setEmailProviderForTests(null);
    }
  });

  it('never go from the example company', async () => {
    const a = await signup('Mail Example Owner');
    const built = (await a.json('POST', '/api/system/demo', {})) as any;
    expect(built.status).toBe('ready');
    const ex = built.companyId;
    expect(await alertCount(ex)).toBe(0);
    const overview = await a.json('GET', mt(ex, '/overview'));
    expect(overview.assets).toBe(7);
    expect(overview.openWorkOrders).toBe(2);
    setEmailProviderForTests(new FakeProvider());
    await env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('maintenance_email_alerts', 'company', ?, 'on', 'test', 'test', ?)").bind(ex, Date.now()).run();
    try {
      const n = await sendMtAlert(env, { companyId: ex, kind: 'demo', companyName: 'Acme Studio (example)', userId: 'someone-else' }, { to: [a.userId], kind: 'request', title: 't', link: `/c/${ex}/maintenance`, recordId: 'x', dedupe: 'demo-check' });
      expect(n).toBe(1);
      await new Promise((r) => setTimeout(r, 200));
      expect(await outboxFor(a.email)).toBe(0);
    } finally {
      await env.DB.prepare("DELETE FROM feature_flags WHERE key = 'maintenance_email_alerts' AND scope = 'company' AND scope_id = ?").bind(ex).run();
      setEmailProviderForTests(null);
    }
  });
});

describe('the flag and what /me says', () => {
  it('ships the email flag off, and /me reports the completing settings', async () => {
    expect(FLAGS.maintenance_email_alerts).toMatchObject({ values: ['off', 'on'], enforcement: false, release: 'Maintenance' });
    expect(FLAGS.maintenance_email_alerts.scopes).toContain('company');
    const { requester, co } = await team('Flag');
    expect(await flagOn(env.DB, 'maintenance_email_alerts', { companyId: co })).toBe(false);
    const me = await requester.json('GET', mt(co, '/me'));
    expect(me).toMatchObject({ requireSignature: false, techniciansRecordWork: false, can: { recordWork: false } });
  });
});
