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
import signOffSrc from '../src/client/system/maintenance/SignOff.tsx?raw';
import printSrc from '../src/client/system/maintenance/WorkOrderPrint.tsx?raw';
import workOrdersSrc from '../src/client/system/maintenance/WorkOrders.tsx?raw';
import overlaysSrc from '../src/client/components/ui/overlays.tsx?raw';

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
    // Not an inspection round.
    expect(card.round).toBeNull();
    expect(JSON.stringify(card)).not.toMatch(/cents/i);
    const ownerCard = await owner.json('GET', mt(co, `/work-orders/${wo.id}/job-card`));
    expect(JSON.stringify(ownerCard)).not.toMatch(/cents/i);
    expect(ownerCard.labour).toHaveLength(1);
  });

  it('prints an inspection round: each asset with its checklist, boxes while open and answers once done, never a cost', async () => {
    const { owner, supervisor, technician, requester, co } = await team('Round Card');
    const bay = await owner.json('POST', mt(co, '/assets'), { number: 'BAY-1', name: 'Press bay', purchaseCostCents: 900000 });
    const p1 = await owner.json('POST', mt(co, '/assets'), { number: 'PR-1', name: 'Press one', parentId: bay.id, purchaseCostCents: 250000 });
    const p2 = await owner.json('POST', mt(co, '/assets'), { number: 'PR-2', name: 'Press two', parentId: bay.id });
    const site = await owner.json('POST', mt(co, '/sites'), { code: 'S1', name: 'North' });
    await owner.json('PUT', mt(co, `/assets/${p1.id}/site`), { siteId: site.id });
    const tpl = await owner.json('POST', mt(co, '/inspection-templates'), {
      name: 'Press guard round',
      failAction: 'none',
      items: [
        { label: 'Guards fitted', kind: 'pass_fail', critical: true },
        { label: 'Oil level', kind: 'number', unit: 'L', min: 2, max: 5 },
      ],
    });
    const item = (label: string) => tpl.items.find((x: any) => x.label === label).id;
    const made = await supervisor.json('POST', mt(co, '/inspection-rounds'), { templateId: tpl.id, assets: [{ assetId: p1.id }, { assetId: p2.id }], assignedTo: technician.userId });
    const woId = made.workOrder.id;
    const lines = (await technician.json('GET', mt(co, `/work-orders/${woId}/round`))).lines as any[];
    const first = lines.find((l) => l.assetNumber === 'PR-1');
    await technician.json('PUT', mt(co, `/work-orders/${woId}/round/lines/${first.id}/results`), { results: [{ itemId: item('Guards fitted'), passed: true }, { itemId: item('Oil level'), value: 3.5 }] });
    await technician.json('POST', mt(co, `/work-orders/${woId}/round/lines/${first.id}/complete`), {});

    const card = await technician.json('GET', mt(co, `/work-orders/${woId}/job-card`));
    expect(card.workOrder).toMatchObject({ jobType: 'inspection', assetNumber: 'BAY-1' });
    expect(card.round).toMatchObject({ id: made.roundId, templateName: 'Press guard round' });
    expect(card.round.lines.map((l: any) => [l.assetNumber, l.assetName, l.siteCode, l.templateName, l.status, l.review])).toEqual([
      ['PR-1', 'Press one', 'S1', 'Press guard round', 'passed', 'awaiting'],
      ['PR-2', 'Press two', null, 'Press guard round', 'open', null],
    ]);
    // Completed: the answers as recorded. Open: the checklist's items to fill in, nothing recorded.
    expect(card.round.lines[0].results.map((r: any) => [r.label, r.passed, r.value])).toEqual([
      ['Guards fitted', true, null],
      ['Oil level', true, 3.5],
    ]);
    expect(card.round.lines[1].items.map((i: any) => [i.label, i.kind, i.unit, i.min, i.max, i.critical])).toEqual([
      ['Guards fitted', 'pass_fail', '', null, null, true],
      ['Oil level', 'number', 'L', 2, 5, false],
    ]);
    expect(card.round.lines[1].results).toEqual([]);
    for (const who of [technician, owner]) expect(JSON.stringify(await who.json('GET', mt(co, `/work-orders/${woId}/job-card`)))).not.toMatch(/cents/i);
    // Who may see the round's work order, as for any job card.
    expect((await requester.req('GET', mt(co, `/work-orders/${woId}/job-card`))).status).toBe(404);
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

  it('keeps every signature picture on record, never as a photo, also after a reopen and a new completion', async () => {
    const { owner, supervisor, technician, co } = await team('Keep');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    const photo = await technician.req('POST', mt(co, '/files'), upload('workOrderId', wo.id, 'signature-before.png', PNG, 'image/png'));
    expect(photo.status).toBe(201);
    const photoId = ((await photo.json()) as any).id;
    const signed = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'Pat Example', image: sigPng() } });
    // Completed: the work order is locked.
    expect((await technician.req('DELETE', mt(co, `/files/${signed.signatureFileId}`))).status).toBe(409);
    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'One more check' });
    const message = 'This is the signature of a sign-off of the work order. It stays on record with the work order.';
    const kept = await supervisor.req('DELETE', mt(co, `/files/${signed.signatureFileId}`));
    expect(kept.status).toBe(409);
    expect(((await kept.json()) as any).error).toBe(message);
    // Completed again without a sign-off: the earlier picture stays on record, still not a photo.
    const again = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Checked' });
    expect(again.signatureFileId).toBeNull();
    const detail = await supervisor.json('GET', mt(co, `/work-orders/${wo.id}`));
    expect(detail.files.find((f: any) => f.id === signed.signatureFileId)).toMatchObject({ signature: true });
    // An upload, even one named like a signature, stays an ordinary photo.
    expect(detail.files.find((f: any) => f.id === photoId)).toMatchObject({ signature: false, isImage: true });
    const card = await technician.json('GET', mt(co, `/work-orders/${wo.id}/job-card`));
    expect(card.files.images.map((f: any) => f.id)).toEqual([photoId]);
    expect(card.files.documents).toEqual([]);
    expect(card.signOff).toBeNull();
    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'Tidy the files' });
    const still = await supervisor.req('DELETE', mt(co, `/files/${signed.signatureFileId}`));
    expect(still.status).toBe(409);
    expect(((await still.json()) as any).error).toBe(message);
    expect((await supervisor.req('DELETE', mt(co, `/files/${photoId}`))).status).toBe(200);
    // The history keeps who signed.
    expect(detail.history.find((e: any) => e.action === 'work_order.completed' && e.summary.includes('signed off by Pat Example'))).toBeTruthy();
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

  it('tells the supervisors it was waiting for when a request is withdrawn', async () => {
    const { owner, supervisor, technician, requester, co } = await team('Withdrawn');
    const withdrawnOf = async (who: Client, id: string) => (await alertsOf(co, who.userId)).filter((x) => x.record_id === id && x.title.endsWith('was withdrawn'));
    // Awaiting approval and decided by nobody yet: every supervisor and administrator.
    const r1 = await requester.json('POST', mt(co, '/requests'), { description: 'Leak under the press' });
    await requester.json('POST', mt(co, `/requests/${r1.id}/withdraw`), { reason: 'Raised twice' });
    for (const p of [owner, supervisor]) {
      const got = await withdrawnOf(p, r1.id);
      expect(got).toHaveLength(1);
      expect(got[0]).toMatchObject({ kind: 'request', title: `Request ${r1.number} was withdrawn`, body: 'Raised twice', link: `/c/${co}/maintenance/requests/${r1.id}`, emailed: 0 });
      expect(got[0].dedupe_key).toMatch(new RegExp(`^mt:req:${r1.id}:withdrawn:\\d+:${p.userId}$`));
    }
    for (const p of [technician, requester]) expect(await withdrawnOf(p, r1.id)).toHaveLength(0);
    // A refused second withdrawal alerts nobody again.
    expect((await requester.req('POST', mt(co, `/requests/${r1.id}/withdraw`), { reason: 'Again' })).status).toBe(409);
    expect(await withdrawnOf(owner, r1.id)).toHaveLength(1);

    // Waiting for information asked by the supervisor: that supervisor only.
    const r2 = await requester.json('POST', mt(co, '/requests'), { description: 'A noise from the fan' });
    await supervisor.json('POST', mt(co, `/requests/${r2.id}/request-info`), { comment: 'Which fan?' });
    await requester.json('POST', mt(co, `/requests/${r2.id}/withdraw`), { reason: 'It stopped' });
    expect((await withdrawnOf(supervisor, r2.id)).map((x) => x.body)).toEqual(['It stopped']);
    expect(await withdrawnOf(owner, r2.id)).toHaveLength(0);

    // Already approved: nobody is waiting on it, so nobody is alerted.
    const r3 = await requester.json('POST', mt(co, '/requests'), { description: 'Door sticks' });
    await supervisor.json('POST', mt(co, `/requests/${r3.id}/approve`), {});
    await requester.json('POST', mt(co, `/requests/${r3.id}/withdraw`), { reason: 'Fixed it myself' });
    for (const p of [owner, supervisor, technician, requester]) expect(await withdrawnOf(p, r3.id)).toHaveLength(0);

    // A supervisor withdrawing their own request: the others are told, never the person acting.
    const own = await supervisor.json('POST', mt(co, '/requests'), { description: 'Light out in the store' });
    await supervisor.json('POST', mt(co, `/requests/${own.id}/withdraw`), { reason: 'Wrong store' });
    expect(await withdrawnOf(owner, own.id)).toHaveLength(1);
    expect(await withdrawnOf(supervisor, own.id)).toHaveLength(0);
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

describe('the example company', () => {
  it('gets a belt change recorded after it was done, and loses it with the rounds on removal', async () => {
    const a = await signup('Recorded Example Owner');
    const built = (await a.json('POST', '/api/system/demo', {})) as any;
    expect(built.status).toBe('ready');
    const ex = built.companyId;
    // The owner is the only person, so nothing is alerted; the example never sends email either.
    expect(await alertCount(ex)).toBe(0);
    const done = ((await a.json('GET', mt(ex, '/work-orders?status=completed&limit=100'))).workOrders as any[]).filter((w) => w.description === 'Replaced the worn drive belt on the air compressor');
    expect(done).toHaveLength(1);
    const w = done[0];
    expect(w).toMatchObject({ status: 'completed', recordedDone: true, assetNumber: 'UT-0201', jobType: 'corrective', priority: 'medium', assignedTo: a.userId, completedBy: a.userId, dueStart: days(-3), dueFinish: days(-3), completionNotes: 'Belt replaced and tensioned. Compressor run for ten minutes without a fault.', signedByName: null, signatureFileId: null });
    expect(new Date(w.completedAt).toISOString().slice(0, 10)).toBe(days(-3));
    const detail = await a.json('GET', mt(ex, `/work-orders/${w.id}`));
    expect(detail.labourCosts).toEqual([expect.objectContaining({ minutes: 40, entry: 'manual', workDate: days(-3), userId: a.userId })]);
    expect(detail.history.map((e: any) => e.action)).toContain('work_order.recorded_done');
    expect(detail.downtime).toBeNull();
    const overview = await a.json('GET', mt(ex, '/overview'));
    expect(overview.assets).toBe(7);
    expect(overview.openWorkOrders).toBe(2);

    expect((await a.req('POST', '/api/system/demo/remove', {})).status).toBe(200);
    const left = await env.DB.prepare(
      'SELECT (SELECT COUNT(*) FROM mt_work_orders WHERE company_id = ?1 AND id = ?2) + (SELECT COUNT(*) FROM mt_labour WHERE company_id = ?1 AND work_order_id = ?2) + (SELECT COUNT(*) FROM mt_labour_costs WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_rounds WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_round_assets WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_round_results WHERE company_id = ?1) AS n',
    )
      .bind(ex, w.id)
      .first<{ n: number }>();
    expect(left!.n).toBe(0);
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

// The review of the field release. The losing order of a race is reproduced with a trigger inside the transaction it
// races.
async function withTrigger(name: string, sql: string, fn: () => Promise<void>) {
  await env.DB.prepare(sql).run();
  try {
    await fn();
  } finally {
    await env.DB.prepare(`DROP TRIGGER IF EXISTS ${name}`).run();
  }
}

describe('the review of the field release: the sign-off', () => {
  it('takes a typed sign-off from someone who cannot draw, recorded as typed, also when a signature is required', async () => {
    const { owner, supervisor, technician, co } = await team('Typed');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    await owner.json('PATCH', mt(co, '/settings/work-orders'), { requireSignature: true });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    const complete = (signature: unknown) => technician.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature });
    // A typed sign-off has no picture; a drawn one has no tick; neither is both.
    for (const bad of [{ name: 'Sam Keys', typed: true, image: sigPng() }, { name: 'Sam Keys' }, { name: '', typed: true }]) expect((await complete(bad)).status).toBe(400);
    const res = await complete({ name: 'Sam Keys', role: 'Technician', typed: true });
    expect(res.status).toBe(200);
    const done = (await res.json()) as any;
    expect(done).toMatchObject({ status: 'completed', signedByName: 'Sam Keys', signedByRole: 'Technician', signedAt: expect.any(Number), signedTyped: true, signatureFileId: null, signatureUrl: null });
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_files WHERE company_id = ? AND work_order_id = ?').bind(co, wo.id).first<{ n: number }>())!.n).toBe(0);
    const detail = await supervisor.json('GET', mt(co, `/work-orders/${wo.id}`));
    const line = detail.history.find((e: any) => e.action === 'work_order.completed');
    expect(line.summary).toBe(`Work order ${wo.number} completed, signed off by Sam Keys with a typed name (no signature drawn)`);
    expect(line.after).toMatchObject({ signedBy: 'Sam Keys', signedTyped: true });
    const card = await technician.json('GET', mt(co, `/work-orders/${wo.id}/job-card`));
    expect(card.signOff).toEqual({ name: 'Sam Keys', role: 'Technician', at: done.signedAt, typed: true, url: null });
    // A drawn signature is not typed.
    await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/reopen`), { reason: 'Again' });
    const drawn = await technician.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'Pat Example', image: sigPng() } });
    expect(drawn).toMatchObject({ signedTyped: false, signatureFileId: expect.any(String) });
    expect((await technician.json('GET', mt(co, `/work-orders/${wo.id}/job-card`))).signOff).toMatchObject({ typed: false, url: drawn.signatureUrl });
    // Work recorded after it was done takes one too.
    const rec = await supervisor.req('POST', mt(co, '/work-orders/done'), { assetId: pump.id, description: 'Greased the bearings', doneDate: days(-1), notes: 'Greased', signature: { name: 'Sam Keys', typed: true } });
    expect(rec.status).toBe(201);
    expect(await rec.json()).toMatchObject({ signedByName: 'Sam Keys', signedTyped: true, signatureFileId: null });
  });

  it('keeps nothing of a completion that lost a race: no history line naming its sign-off, no picture', async () => {
    const { owner, supervisor, technician, co } = await team('Lost');
    const pump = await owner.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const wo = await workOrder(supervisor, co, pump.id, technician.userId);
    // The other completion committed first: this one's UPDATE finds nothing to change (the row is skipped).
    await withTrigger(
      't_lost_completion',
      `CREATE TRIGGER t_lost_completion BEFORE UPDATE OF status ON mt_work_orders WHEN NEW.id = '${wo.id}' AND NEW.completed_by = '${technician.userId}' BEGIN SELECT RAISE(IGNORE); END`,
      async () => {
        const res = await technician.req('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'A. Lee', image: sigPng() } });
        expect(res.status).toBe(409);
      },
    );
    const lines = await env.DB.prepare("SELECT summary FROM mt_events WHERE company_id = ? AND work_order_id = ? AND action = 'work_order.completed'").bind(co, wo.id).all<{ summary: string }>();
    expect(lines.results).toEqual([]);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_files WHERE company_id = ? AND work_order_id = ?').bind(co, wo.id).first<{ n: number }>())!.n).toBe(0);
    const winner = await supervisor.json('POST', mt(co, `/work-orders/${wo.id}/complete`), { notes: 'Done', signature: { name: 'B. Kaur', image: sigPng() } });
    expect(winner).toMatchObject({ status: 'completed', signedByName: 'B. Kaur' });
    const after = await env.DB.prepare("SELECT summary FROM mt_events WHERE company_id = ? AND work_order_id = ? AND action = 'work_order.completed'").bind(co, wo.id).all<{ summary: string }>();
    expect(after.results.map((r) => r.summary)).toEqual([`Work order ${wo.number} completed, signed off by B. Kaur`]);
  });

  it('offers a typed sign-off on the screens and never calls either a verified electronic signature', () => {
    expect(signOffSrc).toContain('I cannot draw a signature here: sign with my typed name');
    expect(signOffSrc).toContain("if (v.typed) return { name, role, typed: true as const };");
    expect(signOffSrc).toContain('Signed with a typed name by');
    expect(printSrc).toContain('Signed with a typed name by');
    // Every mention of a verified electronic signature says the sign-off is not one.
    for (const src of [signOffSrc, printSrc]) {
      for (const m of src.matchAll(/verified electronic signature/gi)) expect(src.slice(Math.max(0, m.index! - 40), m.index)).toMatch(/\b(not|neither|never)\b/i);
    }
    // Sign-off pictures, the current one and earlier ones, are never among the work order's photos.
    expect(workOrdersSrc).toContain('d.files.filter((f) => !f.signature && f.id !== w.signatureFileId)');
  });
});

describe('the review of the field release: reports, alerts and dialogs', () => {
  it('counts work recorded after it was done in the month it was done, in the breakdowns report', async () => {
    const { owner, supervisor, co } = await team('Month');
    const press = await owner.json('POST', mt(co, '/assets'), { name: 'Press' });
    const now = new Date();
    const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 15)).toISOString().slice(0, 10);
    const res = await supervisor.req('POST', mt(co, '/work-orders/done'), {
      assetId: press.id,
      description: 'Replaced the belt',
      jobType: 'corrective',
      doneDate: lastMonth,
      notes: 'New belt fitted',
      downtime: { startedAt: Date.parse(`${lastMonth}T08:00:00Z`), endedAt: Date.parse(`${lastMonth}T10:00:00Z`) },
    });
    expect(res.status).toBe(201);
    const w = (await res.json()) as any;
    const monthOf = (d: string) => d.slice(0, 7);
    const report = async (from: string, to: string) => (await supervisor.json('GET', mt(co, `/reports/breakdowns?from=${from}&to=${to}`))).months as any[];
    const [y, m] = lastMonth.split('-').map(Number);
    const first = `${monthOf(lastMonth)}-01`;
    const last = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
    const then = (await report(first, last)).find((r) => r.month === monthOf(lastMonth));
    expect(then).toMatchObject({ corrective: 1, failures: 1, downtimeHours: 2 });
    expect(then.workOrders.map((x: any) => x.id)).toEqual([w.id]);
    const thisMonth = utcDate(Date.now()).slice(0, 7);
    const nowRow = (await report(`${thisMonth}-01`, utcDate(Date.now()))).find((r) => r.month === thisMonth);
    expect(nowRow).toMatchObject({ corrective: 0, failures: 0 });
  });

  it('alerts only active members with access to Maintenance, never a suspended one, and never the person acting', async () => {
    const { owner, supervisor, technician, tech2, requester, co } = await team('Active');
    await owner.json('PUT', mt(co, `/roles/${tech2.userId}`), { role: 'supervisor' });
    const sender = { companyId: co, kind: 'registered' as const, companyName: 'Active Manufacturing', userId: requester.userId };
    const n = (dedupe: string) => ({ to: [], managers: true, kind: 'approval' as const, title: 'A test request', link: `/c/${co}/maintenance`, recordId: dedupe, dedupe });
    const got = async (dedupe: string) => (await env.DB.prepare('SELECT user_id FROM erp_alerts WHERE company_id = ? AND dedupe_key LIKE ?').bind(co, `mt:${dedupe}:%`).all<{ user_id: string }>()).results.map((r) => r.user_id).sort();
    expect(await sendMtAlert(env, sender, n('all'))).toBe(3);
    expect(await got('all')).toEqual([owner.userId, supervisor.userId, tech2.userId].sort());
    // Suspended in the company: no alert, and a named supervisor who is suspended falls back to the others.
    await env.DB.prepare("UPDATE co_members SET status = 'suspended' WHERE company_id = ? AND user_id = ?").bind(co, supervisor.userId).run();
    expect(await sendMtAlert(env, sender, n('suspended'))).toBe(2);
    expect(await got('suspended')).toEqual([owner.userId, tech2.userId].sort());
    await sendMtAlert(env, sender, { ...n('named'), managers: false, orManagers: true, to: [supervisor.userId] });
    expect(await got('named')).toEqual([owner.userId, tech2.userId].sort());
    // With the members work on, Maintenance access switched off for a person stops their alerts; never the owner's.
    await env.DB.prepare("INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('company_members_v2', 'company', ?, 'on', 'test', 'test', 1)").bind(co).run();
    try {
      for (const u of [tech2.userId, owner.userId]) {
        await env.DB.prepare("INSERT OR REPLACE INTO co_member_access (company_id, user_id, module, access, scope, updated_at) VALUES (?, ?, 'maintenance', 0, 'all', 1)").bind(co, u).run();
      }
      expect(await sendMtAlert(env, sender, n('module'))).toBe(1);
      expect(await got('module')).toEqual([owner.userId]);
      expect(await sendMtAlert(env, sender, { ...n('assigned'), managers: false, to: [tech2.userId, technician.userId] })).toBe(1);
      expect(await got('assigned')).toEqual([technician.userId]);
    } finally {
      await env.DB.prepare("DELETE FROM feature_flags WHERE key = 'company_members_v2' AND scope = 'company' AND scope_id = ?").bind(co).run();
    }
    // Never the person acting.
    expect(await sendMtAlert(env, { ...sender, userId: owner.userId }, { ...n('self'), managers: false, to: [owner.userId] })).toBe(0);
  });

  it('opens a dialog with the focus on its first field once, not again each time its page renders', () => {
    // src/client/components/ui/overlays.tsx: no DOM here, so its source is checked. The focus effect runs once (no
    // dependency on onClose, which a parent may make anew each second), and Escape closes with the latest handler.
    const modal = overlaysSrc.slice(overlaysSrc.indexOf('export function Modal('), overlaysSrc.indexOf('export function ConfirmProvider('));
    expect(modal).toMatch(/prev\?\.focus\?\.\(\);\s*\};\s*\}, \[\]\);/);
    expect(modal).toContain('closeRef.current();');
    expect(modal).not.toContain('}, [onClose]);');
  });
});
