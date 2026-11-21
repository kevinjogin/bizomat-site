// The Maintenance field release, stream A (src/worker/maintenance/lists.ts, asset-summary.ts; MEX a functional reference
// only): the work order and request lists' filters in the person's own days, the due-today, due-this-week and unassigned
// lists, paging and CSV files; the other open work on a request's asset; the asset summary with its duplicate warning;
// a requester withdrawing their own request; and the dashboard's counts by role. Every count stays within what the
// person may see. Dates are fixed with today=2026-11-20, a Friday whose week ends on Sunday 2026-11-22.
import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { WO_SELECT } from '../src/worker/maintenance/routes-work';
import { dayStartMs, localStamp, tzOffsetFrom, weekEndOf } from '../src/worker/maintenance/lists';

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5, 6, 7, 8]);
const TODAY = '2026-11-20';
const AEDT = -660;

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

/** A registered company with an owner (maintenance admin), a supervisor, a technician and a requester. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const co = await registerCompany(owner, `${label} Manufacturing`);
  const supervisor = await signup(`${label} Supervisor`);
  const technician = await signup(`${label} Technician`);
  const requester = await signup(`${label} Employee`);
  for (const p of [supervisor, technician, requester]) await joinCompany(owner, co, p);
  await owner.json('PUT', mt(co, `/roles/${supervisor.userId}`), { role: 'supervisor' });
  await owner.json('PUT', mt(co, `/roles/${technician.userId}`), { role: 'technician' });
  return { owner, supervisor, technician, requester, co };
}

/** The department Workshop, the site NTH and the assets plant > pump > seal (all in NTH) and a forklift (no site). */
async function plant(t: Awaited<ReturnType<typeof team>>) {
  const dept = (await t.owner.json('POST', `/api/company/c/${t.co}/departments`, { name: 'Workshop' })).id as string;
  const site = await t.supervisor.json('POST', mt(t.co, '/sites'), { code: 'NTH', name: 'North plant' });
  const root = await t.supervisor.json('POST', mt(t.co, '/assets'), { name: 'plant' });
  const pump = await t.supervisor.json('POST', mt(t.co, '/assets'), { name: 'pump', parentId: root.id });
  const seal = await t.supervisor.json('POST', mt(t.co, '/assets'), { name: 'seal', parentId: pump.id });
  const forklift = await t.supervisor.json('POST', mt(t.co, '/assets'), { name: 'forklift' });
  await t.supervisor.json('PUT', mt(t.co, `/assets/${root.id}/site`), { siteId: site.id, includeChildren: true });
  return { dept, site, root, pump, seal, forklift };
}

const ids = (list: { id: string }[]) => list.map((x) => x.id);
const setDate = (column: 'created_at' | 'completed_at', co: string, id: string, t: number) => env.DB.prepare(`UPDATE mt_work_orders SET ${column} = ? WHERE company_id = ? AND id = ?`).bind(t, co, id).run();
const csvLines = (text: string) => text.replace(/^\uFEFF/, '').split('\r\n').filter(Boolean);

describe('lists.ts: days in the person’s time zone and the week', () => {
  it('reads tzOffset, starts local days, writes local times and ends the week on Sunday', () => {
    expect(tzOffsetFrom('-660')).toBe(-660);
    expect(tzOffsetFrom('840')).toBe(840);
    expect(tzOffsetFrom('841')).toBe(0);
    expect(tzOffsetFrom('x')).toBe(0);
    expect(tzOffsetFrom(undefined)).toBe(0);
    expect(new Date(dayStartMs('2026-11-20', AEDT)).toISOString()).toBe('2026-11-19T13:00:00.000Z');
    expect(localStamp(Date.parse('2026-11-19T14:00:00Z'), AEDT)).toBe('2026-11-20 01:00');
    expect(weekEndOf('2026-11-20')).toBe('2026-11-22');
    expect(weekEndOf('2026-11-22')).toBe('2026-11-22');
    expect(weekEndOf('2026-11-23')).toBe('2026-11-29');
  });
});

describe('the work order list: filters, quick lists, paging and CSV', () => {
  let t: Awaited<ReturnType<typeof team>>;
  let p: Awaited<ReturnType<typeof plant>>;
  const w: Record<string, any> = {};
  const list = async (c: Client, qs: string) => (await c.json('GET', mt(t.co, `/work-orders?today=${TODAY}&${qs}`))) as any;

  beforeAll(async () => {
    t = await team('Lists');
    p = await plant(t);
    const s = t.supervisor;
    w.w1 = await s.json('POST', mt(t.co, '/work-orders'), { assetId: p.pump.id, description: 'Pump seal leaking', trade: 'Fitter', departmentId: p.dept, contractor: 'Acme Hydraulics', dueStart: '2026-11-18', dueFinish: '2026-11-21', assignedTo: t.technician.userId });
    w.w2 = await s.json('POST', mt(t.co, '/work-orders'), { assetId: p.seal.id, description: 'Replace the seal', trade: 'fitter', dueStart: '2026-11-20' });
    w.w3 = await s.json('POST', mt(t.co, '/work-orders'), { assetId: p.forklift.id, description: 'Forklift lights', trade: 'Electrician', department: 'Stores', dueFinish: '2026-11-22' });
    w.w4 = await t.owner.json('POST', mt(t.co, '/work-orders'), { assetId: p.forklift.id, description: 'Forklift service', dueStart: '2026-11-24', dueFinish: '2026-11-25' });
    w.w5 = await s.json('POST', mt(t.co, '/work-orders'), { assetId: p.pump.id, description: 'Pump check', dueFinish: '2026-11-10' });
    await s.json('POST', mt(t.co, `/work-orders/${w.w5.id}/complete`), { notes: 'Checked' });
    // 01:00 on 20 Nov in Sydney (AEDT, UTC+11) is 14:00 on 19 Nov in UTC.
    await setDate('created_at', t.co, w.w1.id, Date.parse('2026-11-19T14:00:00Z'));
    for (const k of ['w2', 'w3', 'w4', 'w5']) await setDate('created_at', t.co, w[k].id, Date.parse('2026-11-10T00:00:00Z'));
    await setDate('completed_at', t.co, w.w5.id, Date.parse('2026-11-19T14:00:00Z'));
  });

  it('filters on the date raised, completed and due start in the person’s own days, and on due finish as before', async () => {
    const s = t.supervisor;
    const q = async (qs: string) => ids((await list(s, `sort=number&${qs}`)).workOrders);
    expect(await q(`raisedFrom=2026-11-20&raisedTo=2026-11-20&tzOffset=${AEDT}`)).toEqual([w.w1.id]);
    expect(await q('raisedFrom=2026-11-20&raisedTo=2026-11-20&tzOffset=0')).toEqual([]);
    expect(await q('raisedFrom=2026-11-19&raisedTo=2026-11-19')).toEqual([w.w1.id]);
    expect(await q('dueStartFrom=2026-11-19&dueStartTo=2026-11-20')).toEqual([w.w2.id]);
    expect(await q('dueFrom=2026-11-21&dueTo=2026-11-22')).toEqual([w.w1.id, w.w3.id]);
    expect(await q(`completedFrom=2026-11-20&completedTo=2026-11-20&tzOffset=${AEDT}`)).toEqual([w.w5.id]);
    expect(await q('completedFrom=2026-11-20&completedTo=2026-11-20&tzOffset=0')).toEqual([]);
    // Dates that are not dates are left out, as before.
    expect(await q('raisedFrom=2026-13-40')).toHaveLength(5);
  });

  it('filters on department, raised by, contractor, site, the asset with its children and the trade', async () => {
    const q = async (qs: string) => ids((await list(t.supervisor, `sort=number&${qs}`)).workOrders);
    expect(await q(`departmentId=${p.dept}`)).toEqual([w.w1.id]);
    expect(await q('department=stores')).toEqual([w.w3.id]);
    expect(await q(`raisedBy=${t.owner.userId}`)).toEqual([w.w4.id]);
    expect(await q('contractor=hydraulic')).toEqual([w.w1.id]);
    expect(await q(`siteId=${p.site.id}`)).toEqual([w.w1.id, w.w2.id, w.w5.id]);
    expect(await q(`assetId=${p.pump.id}&includeChildren=1`)).toEqual([w.w1.id, w.w2.id, w.w5.id]);
    expect(await q(`assetId=${p.pump.id}`)).toEqual([w.w1.id, w.w5.id]);
    expect(await q('trade=FITTER')).toEqual([w.w1.id, w.w2.id]);
  });

  it('lists what is due today, due this week and unassigned, sorts by due start, pages, and names each trade once', async () => {
    const s = t.supervisor;
    expect(ids((await list(s, 'status=outstanding&due=today&sort=number')).workOrders)).toEqual([w.w1.id, w.w2.id]);
    const week = await list(s, 'status=outstanding&due=week&sort=number');
    expect(ids(week.workOrders)).toEqual([w.w1.id, w.w2.id, w.w3.id]);
    expect(week.weekEnd).toBe('2026-11-22');
    expect(ids((await list(s, 'status=outstanding&unassigned=1&sort=number')).workOrders)).toEqual([w.w2.id, w.w3.id, w.w4.id]);
    // No due start sorts last.
    expect(ids((await list(s, 'status=outstanding&sort=dueStart&dir=asc')).workOrders)).toEqual([w.w1.id, w.w2.id, w.w4.id, w.w3.id]);
    const page = await list(s, 'sort=number&limit=2&offset=2');
    expect(ids(page.workOrders)).toEqual([w.w3.id, w.w4.id]);
    expect(page).toMatchObject({ total: 5, limit: 2, offset: 2 });
    expect(page.trades.filter((x: string) => x.toLowerCase() === 'fitter')).toHaveLength(1);
    expect(page.trades.map((x: string) => x.toLowerCase())).toEqual(['electrician', 'fitter']);
  });

  it('keeps each person to their own work, and the earlier calls answer as before', async () => {
    expect(ids((await list(t.technician, 'status=outstanding&due=today&sort=number')).workOrders)).toEqual([w.w1.id]);
    expect((await list(t.requester, 'status=outstanding')).workOrders).toEqual([]);
    // As whs/Hazards.tsx asks: every work order, by due finish (none last).
    const all = (await t.supervisor.json('GET', mt(t.co, '/work-orders?limit=200'))) as any;
    expect(ids(all.workOrders)).toEqual([w.w5.id, w.w1.id, w.w3.id, w.w4.id, w.w2.id]);
    expect(all.total).toBe(5);
  });

  it('gives each list row exactly what the work order itself gives (the list query stays in step with WO_SELECT)', async () => {
    expect(WO_SELECT.startsWith('SELECT w.*')).toBe(true);
    const detail = (await t.supervisor.json('GET', mt(t.co, `/work-orders/${w.w1.id}`))) as any;
    const row = (await list(t.supervisor, `q=${encodeURIComponent(w.w1.number)}`)).workOrders.find((x: any) => x.id === w.w1.id);
    expect(row).toBeTruthy();
    for (const k of Object.keys(detail.workOrder)) expect([k, row[k]]).toEqual([k, detail.workOrder[k]]);
  });

  it('downloads the filtered list as CSV, within the person’s scope, with formulas made harmless', async () => {
    const res = await t.supervisor.req('GET', mt(t.co, `/work-orders?status=outstanding&sort=number&format=csv&tzOffset=${AEDT}&today=${TODAY}`));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')?.startsWith('text/csv')).toBe(true);
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="maintenance-work-orders-2026-11-20.csv"');
    // The file starts with a byte order mark (EF BB BF), so spreadsheets read it as UTF-8.
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    const lines = csvLines(new TextDecoder().decode(bytes));
    expect(lines[0]).toBe('Number,Description,Asset,Asset name,Site,Job type,Priority,Status,Trade,Technician,Contractor,Department,Raised by,Raised,Due start,Due finish,Completed,Estimated (h),Recorded (h)');
    expect(lines).toHaveLength(5);
    const first = lines.find((l) => l.startsWith(w.w1.number))!;
    for (const part of ['NTH', 'Workshop', 'Assigned', 'Lists Supervisor', '2026-11-20 01:00', 'Acme Hydraulics', 'Lists Technician']) expect(first).toContain(part);
    expect(csvLines(await (await t.supervisor.req('GET', mt(t.co, '/work-orders?trade=electrician&format=csv'))).text())).toHaveLength(2);
    expect(csvLines(await (await t.technician.req('GET', mt(t.co, '/work-orders?status=outstanding&format=csv'))).text())).toHaveLength(2);
    expect(csvLines(await (await t.requester.req('GET', mt(t.co, '/work-orders?format=csv'))).text())).toHaveLength(1);
    // A description a spreadsheet would run as a formula starts with an apostrophe.
    await t.supervisor.json('POST', mt(t.co, '/work-orders'), { assetId: p.forklift.id, description: '=HYPERLINK("x")' });
    const formula = await (await t.supervisor.req('GET', mt(t.co, '/work-orders?q=hyperlink&format=csv'))).text();
    expect(formula).toContain(`"'=HYPERLINK(""x"")"`);
  });
});

describe('the request list: filters, outstanding, other open work on the asset, CSV and the asset summary', () => {
  let t: Awaited<ReturnType<typeof team>>;
  let p: Awaited<ReturnType<typeof plant>>;
  const r: Record<string, any> = {};
  let wR: any;
  const list = async (c: Client, qs: string) => (await c.json('GET', mt(t.co, `/requests?${qs}`))) as any;
  const set = (rows: { id: string }[]) => new Set(ids(rows));

  beforeAll(async () => {
    t = await team('Reqs');
    p = await plant(t);
    r.r1 = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Seal dripping', assetId: p.seal.id, departmentId: p.dept });
    r.r2 = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Forklift horn', assetId: p.forklift.id });
    r.r3 = await t.owner.json('POST', mt(t.co, '/requests'), { description: 'Pump noise', assetId: p.pump.id });
    wR = (await t.supervisor.json('POST', mt(t.co, `/requests/${r.r1.id}/convert`), {})).workOrder;
    const wC = (await t.supervisor.json('POST', mt(t.co, `/requests/${r.r2.id}/convert`), {})).workOrder;
    await t.supervisor.json('POST', mt(t.co, `/work-orders/${wC.id}/cancel`), { reason: 'Not needed' });
  });

  it('filters on the asset with its children, requested by, department, site and the new statuses', async () => {
    const s = t.supervisor;
    expect(set((await list(s, `assetId=${p.pump.id}&includeChildren=1`)).requests)).toEqual(new Set([r.r1.id, r.r3.id]));
    expect(ids((await list(s, `assetId=${p.pump.id}`)).requests)).toEqual([r.r3.id]);
    expect(set((await list(s, `requestedBy=${t.requester.userId}`)).requests)).toEqual(new Set([r.r1.id, r.r2.id]));
    expect(ids((await list(s, `departmentId=${p.dept}`)).requests)).toEqual([r.r1.id]);
    expect(set((await list(s, `siteId=${p.site.id}`)).requests)).toEqual(new Set([r.r1.id, r.r3.id]));
    // Outstanding: waiting for a decision, or made into a work order that is still open (r2's was cancelled).
    expect(set((await list(s, 'status=outstanding')).requests)).toEqual(new Set([r.r1.id, r.r3.id]));
    const cancelled = await list(s, 'status=wo_cancelled');
    expect(ids(cancelled.requests)).toEqual([r.r2.id]);
    expect(cancelled.requests[0]).toMatchObject({ status: 'converted', workOrderStatus: 'cancelled' });
    expect(ids((await list(s, 'status=awaiting_approval')).requests)).toEqual([r.r3.id]);
    expect(ids((await list(s, `requestedBy=${t.requester.userId}&status=awaiting_approval`)).requests)).toEqual([]);
    const page = await list(s, 'limit=2&offset=1');
    expect(page).toMatchObject({ total: 3, limit: 2, offset: 1 });
    expect(page.requests).toHaveLength(2);
  });

  it('keeps the earlier status=awaiting (submitted too), and a requester’s outstanding list is their own', async () => {
    await t.owner.json('PATCH', mt(t.co, '/settings'), { requireApproval: false });
    r.rS = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Light out in the office' });
    expect(r.rS.status).toBe('submitted');
    expect(ids((await list(t.supervisor, 'status=awaiting')).requests)).toContain(r.rS.id);
    expect(ids((await list(t.supervisor, 'status=awaiting_approval')).requests)).not.toContain(r.rS.id);
    expect(set((await list(t.requester, 'status=outstanding')).requests)).toEqual(new Set([r.r1.id, r.rS.id]));
  });

  it('counts the other open requests and work orders on each row’s asset, within what the person may see', async () => {
    r.r4 = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Seal still dripping', assetId: p.seal.id });
    const rows = (await list(t.supervisor, 'limit=100')).requests as any[];
    const row = (id: string, from = rows) => from.find((x) => x.id === id);
    expect(row(r.r4.id).openOnAsset).toEqual({ requests: 1, workOrders: 1 });
    // r1's own work order is not counted.
    expect(row(r.r1.id).openOnAsset).toEqual({ requests: 1, workOrders: 0 });
    expect(row(r.r1.id).siteCode).toBe('NTH');
    expect(row(r.rS.id).openOnAsset).toEqual({ requests: 0, workOrders: 0 });
    expect(row(r.rS.id).siteCode).toBeNull();
    r.r5 = await t.owner.json('POST', mt(t.co, '/requests'), { description: 'Forklift mirror', assetId: p.forklift.id });
    r.r6 = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Forklift seat', assetId: p.forklift.id });
    expect(row(r.r6.id, (await list(t.supervisor, 'limit=100')).requests).openOnAsset.requests).toBe(1);
    // The requester does not learn about the owner's r5; r2 is not outstanding (its work order was cancelled).
    expect(row(r.r6.id, (await list(t.requester, 'limit=100')).requests).openOnAsset.requests).toBe(0);
  });

  it('downloads the request list as CSV', async () => {
    const res = await t.supervisor.req('GET', mt(t.co, `/requests?format=csv&today=${TODAY}&tzOffset=${AEDT}`));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="maintenance-requests-2026-11-20.csv"');
    const lines = csvLines(await res.text());
    expect(lines[0]).toBe('Number,Description,Status,Priority,Asset,Asset name,Site,Location,Department,Raised by,Raised,Requested-by date,Decided by,Decided,Decision or withdrawal note,Work order,Work order status,Completed,Closed');
    expect(lines).toHaveLength(8);
    expect(lines.find((l) => l.startsWith(r.r2.number))).toContain('Cancelled');
    expect(lines.find((l) => l.startsWith(r.r1.number))).toContain('Workshop');
    expect(csvLines(await (await t.requester.req('GET', mt(t.co, '/requests?format=csv'))).text())).toHaveLength(6);
  });

  it('summarises the asset with its path and the other open work, counted within the person’s scope', async () => {
    const mine = (await t.requester.json('GET', mt(t.co, `/assets/${p.seal.id}/summary`))) as any;
    expect(mine.asset).toMatchObject({ number: p.seal.number, siteCode: 'NTH', parentNumber: p.pump.number, criticality: 'medium', status: 'operating', archived: false });
    expect(Object.keys(mine.asset)).not.toContain('purchaseCostCents');
    expect(Object.keys(mine.asset)).not.toContain('replacementCostCents');
    expect(Object.keys(mine.asset)).not.toContain('responsibleId');
    expect(mine.path.map((x: any) => x.name)).toEqual(['plant', 'pump', 'seal']);
    expect(mine.scope).toBe('yours');
    expect(mine.open.requests).toBe(2);
    expect(set(mine.open.requestList)).toEqual(new Set([r.r1.id, r.r4.id]));
    expect(mine.open.workOrders).toBe(1);
    expect(ids(mine.open.workOrderList)).toEqual([wR.id]);
    expect(mine.open.requestList.find((x: any) => x.id === r.r1.id).workOrderNumber).toBe(wR.number);
    r.r7 = await t.owner.json('POST', mt(t.co, '/requests'), { description: 'Seal again', assetId: p.seal.id });
    const all = (await t.supervisor.json('GET', mt(t.co, `/assets/${p.seal.id}/summary`))) as any;
    expect(all.scope).toBe('company');
    expect(all.open.requests).toBe(3);
    const without = (await t.supervisor.json('GET', mt(t.co, `/assets/${p.seal.id}/summary?excludeRequestId=${r.r4.id}`))) as any;
    expect(without.open.requests).toBe(2);
    expect(ids(without.open.requestList)).not.toContain(r.r4.id);
    // On wR itself: wR is not other work, nor is r1, which was made into it.
    const onWork = (await t.supervisor.json('GET', mt(t.co, `/assets/${p.seal.id}/summary?excludeWorkOrderId=${wR.id}`))) as any;
    expect(onWork.open.workOrders).toBe(0);
    expect(onWork.open.requests).toBe(2);
    expect(ids(onWork.open.requestList)).not.toContain(r.r1.id);
    const unknown = await t.supervisor.req('GET', mt(t.co, '/assets/nope/summary'));
    expect(unknown.status).toBe(404);
    expect(((await unknown.json()) as any).error).toBe('Asset not found');
    const stranger = await signup('Reqs Stranger');
    const theirs = await registerCompany(stranger, 'Stranger Works');
    expect((await stranger.req('GET', mt(theirs, `/assets/${p.seal.id}/summary`))).status).toBe(404);
    expect((await stranger.req('GET', mt(t.co, `/assets/${p.seal.id}/summary`))).status).toBe(404);
  });
});

describe('an inspection round counts as open work on each asset still open on it', () => {
  it('in the asset summary and the request list, once, within each scope, until its checklist or the round is done', async () => {
    const t = await team('Rounds');
    const make = (body: Record<string, unknown>) => t.supervisor.json('POST', mt(t.co, '/assets'), body);
    const bay = await make({ number: 'BAY-1', name: 'Bay' });
    const m1 = await make({ number: 'M-1', name: 'Mill one', parentId: bay.id });
    const m2 = await make({ number: 'M-2', name: 'Mill two', parentId: bay.id });
    const saw = await make({ number: 'SAW-1', name: 'Saw' });
    const tpl = await t.supervisor.json('POST', mt(t.co, '/inspection-templates'), { name: 'Guard check', items: [{ label: 'Guards in place', kind: 'pass_fail' }] });
    const made = await t.supervisor.json('POST', mt(t.co, '/inspection-rounds'), { templateId: tpl.id, assets: [{ assetId: m1.id }, { assetId: m2.id }], assignedTo: t.technician.userId });
    const w = made.workOrder;
    // The round's work order sits on the bay, the asset above both mills.
    expect(w.assetNumber).toBe('BAY-1');
    const open = async (c: Client, assetId: string, qs = '') => ((await c.json('GET', mt(t.co, `/assets/${assetId}/summary${qs}`))) as any).open;
    for (const asset of [m1, m2, bay]) {
      const o = await open(t.supervisor, asset.id);
      expect([asset.number, o.workOrders, ids(o.workOrderList)]).toEqual([asset.number, 1, [w.id]]);
    }
    expect((await open(t.supervisor, saw.id)).workOrders).toBe(0);
    // Within each scope: the technician it is given to sees it; a requester does not.
    expect((await open(t.technician, m1.id)).workOrders).toBe(1);
    expect((await open(t.requester, m1.id)).workOrders).toBe(0);
    expect((await open(t.supervisor, m1.id, `?excludeWorkOrderId=${w.id}`)).workOrders).toBe(0);
    // A request on a mill shows the round as other open work on its asset.
    const rq = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Mill one guard rattles', assetId: m1.id });
    const rowOf = async (c: Client) => ((await c.json('GET', mt(t.co, '/requests?limit=100'))) as any).requests.find((x: any) => x.id === rq.id);
    expect((await rowOf(t.supervisor)).openOnAsset).toEqual({ requests: 0, workOrders: 1 });
    expect((await rowOf(t.requester)).openOnAsset).toEqual({ requests: 0, workOrders: 0 });

    // Mill one's checklist completed: the round is no longer open work on it, and still is on mill two and the bay.
    const lines = ((await t.technician.json('GET', mt(t.co, `/work-orders/${w.id}/round`))) as any).lines as any[];
    const l1 = lines.find((l) => l.assetNumber === 'M-1');
    await t.technician.json('PUT', mt(t.co, `/work-orders/${w.id}/round/lines/${l1.id}/results`), { results: [{ itemId: tpl.items[0].id, passed: true }] });
    await t.technician.json('POST', mt(t.co, `/work-orders/${w.id}/round/lines/${l1.id}/complete`), {});
    expect((await open(t.supervisor, m1.id)).workOrders).toBe(0);
    expect((await open(t.supervisor, m2.id)).workOrders).toBe(1);
    expect((await open(t.supervisor, bay.id)).workOrders).toBe(1);
    expect((await rowOf(t.supervisor)).openOnAsset).toEqual({ requests: 0, workOrders: 0 });

    // A round on mill two alone sits on mill two: counted once, not once for its asset and once for its line.
    const solo = (await t.supervisor.json('POST', mt(t.co, '/inspection-rounds'), { templateId: tpl.id, assets: [{ assetId: m2.id }] })).workOrder;
    expect(solo.assetNumber).toBe('M-2');
    const both = await open(t.supervisor, m2.id);
    expect([both.workOrders, new Set(ids(both.workOrderList))]).toEqual([2, new Set([w.id, solo.id])]);
    // A cancelled round is not open work.
    await t.supervisor.json('POST', mt(t.co, `/work-orders/${w.id}/cancel`), { reason: 'Done another way' });
    expect(ids((await open(t.supervisor, m2.id)).workOrderList)).toEqual([solo.id]);
    expect((await open(t.supervisor, bay.id)).workOrders).toBe(0);
  });
});

describe('a requester withdraws their own request', () => {
  let t: Awaited<ReturnType<typeof team>>;
  let a: any;
  const raise = (c: Client, description: string) => c.json('POST', mt(t.co, '/requests'), { description, assetId: a.id });
  const withdraw = (c: Client, id: string, body: unknown = { reason: 'Raised twice' }) => c.req('POST', mt(t.co, `/requests/${id}/withdraw`), body);

  beforeAll(async () => {
    t = await team('Wd');
    a = await t.supervisor.json('POST', mt(t.co, '/assets'), { name: 'Press brake' });
  });

  it('only the person who raised it, with a reason; it is closed with a comment and a history line', async () => {
    const before = ((await t.requester.json('GET', mt(t.co, `/overview?today=${TODAY}`))) as any).myRequests;
    const rq = await raise(t.requester, 'Back gauge not homing');
    expect(rq.status).toBe('awaiting_approval');
    expect(((await t.requester.json('GET', mt(t.co, `/requests/${rq.id}`))) as any).can.withdraw).toBe(true);
    expect(((await t.supervisor.json('GET', mt(t.co, `/requests/${rq.id}`))) as any).can.withdraw).toBe(false);
    expect(((await t.requester.json('GET', mt(t.co, `/overview?today=${TODAY}`))) as any).myRequests).toBe(before + 1);
    expect((await withdraw(t.supervisor, rq.id, { reason: 'x' })).status).toBe(403);
    expect((await withdraw(t.technician, rq.id)).status).toBe(404);
    expect((await withdraw(t.requester, rq.id, {})).status).toBe(400);
    expect((await withdraw(t.requester, rq.id, { reason: '   ' })).status).toBe(400);
    const res = await withdraw(t.requester, rq.id);
    expect(res.status).toBe(200);
    const done = (await res.json()) as any;
    expect(done).toMatchObject({ status: 'closed', withdrawReason: 'Raised twice' });
    expect(typeof done.withdrawnAt).toBe('number');
    expect(done.closedAt).toBe(done.withdrawnAt);
    const view = (await t.requester.json('GET', mt(t.co, `/requests/${rq.id}`))) as any;
    expect(view.comments.at(-1).body).toBe('Withdrawn: Raised twice');
    expect(view.comments.filter((c: any) => c.body.startsWith('Withdrawn:'))).toHaveLength(1);
    expect(view.history[0]).toMatchObject({ action: 'request.withdrawn', after: { status: 'closed', withdrawn: true, reason: 'Raised twice' } });
    expect(view.can).toMatchObject({ withdraw: false, comment: false, close: false, edit: false });
    const again = await withdraw(t.requester, rq.id);
    expect(again.status).toBe(409);
    expect(((await again.json()) as any).details.code).toBe('REQUEST_NOT_WITHDRAWABLE');
    expect((await t.supervisor.req('POST', mt(t.co, `/requests/${rq.id}/convert`), {})).status).toBe(409);
    expect(ids(((await t.supervisor.json('GET', mt(t.co, '/requests?status=withdrawn'))) as any).requests)).toEqual([rq.id]);
    expect(ids(((await t.supervisor.json('GET', mt(t.co, '/requests?status=closed'))) as any).requests)).toContain(rq.id);
    const fd = new FormData();
    fd.set('file', new File([PNG], 'late.png', { type: 'image/png' }));
    fd.set('requestId', rq.id);
    expect((await t.requester.req('POST', mt(t.co, '/files'), fd)).status).toBe(409);
    expect(((await t.requester.json('GET', mt(t.co, `/overview?today=${TODAY}`))) as any).myRequests).toBe(before);
    const csv = csvLines(await (await t.supervisor.req('GET', mt(t.co, '/requests?status=withdrawn&format=csv'))).text());
    expect(csv[1]).toContain('Withdrawn');
    expect(csv[1]).toContain('Raised twice');
  });

  it('may be withdrawn while waiting for information or approved, never once declined or made into a work order', async () => {
    const info = await raise(t.requester, 'Guard rail loose');
    await t.supervisor.json('POST', mt(t.co, `/requests/${info.id}/request-info`), { comment: 'Which side?' });
    expect((await withdraw(t.requester, info.id)).status).toBe(200);
    const approved = await raise(t.requester, 'Foot pedal sticky');
    await t.supervisor.json('POST', mt(t.co, `/requests/${approved.id}/approve`), {});
    expect((await withdraw(t.requester, approved.id)).status).toBe(200);
    const declined = await raise(t.requester, 'Paint the floor');
    await t.supervisor.json('POST', mt(t.co, `/requests/${declined.id}/decline`), { reason: 'Not maintenance' });
    const no = await withdraw(t.requester, declined.id);
    expect(no.status).toBe(409);
    expect(((await no.json()) as any).details.code).toBe('REQUEST_NOT_WITHDRAWABLE');
    const converted = await raise(t.requester, 'Hydraulic leak');
    const made = (await t.supervisor.json('POST', mt(t.co, `/requests/${converted.id}/convert`), {})).workOrder;
    const has = await withdraw(t.requester, converted.id);
    expect(has.status).toBe(409);
    const body = (await has.json()) as any;
    expect(body.details.code).toBe('REQUEST_HAS_WORK_ORDER');
    expect(body.error).toContain(made.number);
    // A supervisor withdraws only their own request.
    const own = await raise(t.supervisor, 'Supervisor’s own');
    expect((await withdraw(t.supervisor, own.id)).status).toBe(200);
    // Someone in another company: 404, under either company's address.
    const stranger = await signup('Wd Stranger');
    const theirs = await registerCompany(stranger, 'Wd Elsewhere');
    const target = await raise(t.requester, 'Not yours');
    expect((await stranger.req('POST', mt(theirs, `/requests/${target.id}/withdraw`), { reason: 'x' })).status).toBe(404);
    expect((await stranger.req('POST', mt(t.co, `/requests/${target.id}/withdraw`), { reason: 'x' })).status).toBe(404);
  });

  it('two withdrawals at once: one is made, and the comment and history line are written once', async () => {
    const rq = await raise(t.requester, 'Twice at once');
    const both = await Promise.all([withdraw(t.requester, rq.id), withdraw(t.requester, rq.id)]);
    expect(both.map((x) => x.status).sort()).toEqual([200, 409]);
    const view = (await t.requester.json('GET', mt(t.co, `/requests/${rq.id}`))) as any;
    expect(view.comments.filter((c: any) => c.body.startsWith('Withdrawn:'))).toHaveLength(1);
    expect(view.history.filter((e: any) => e.action === 'request.withdrawn')).toHaveLength(1);
  });
});

describe('the overview: counts by role', () => {
  it('counts awaiting approval apart from new requests, and due today, this week and unassigned within each scope', async () => {
    const t = await team('Dash');
    const a = await t.supervisor.json('POST', mt(t.co, '/assets'), { name: 'Lathe' });
    const ra = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Chuck slipping', assetId: a.id });
    expect(ra.status).toBe('awaiting_approval');
    await t.owner.json('PATCH', mt(t.co, '/settings'), { requireApproval: false });
    const rs = await t.requester.json('POST', mt(t.co, '/requests'), { description: 'Coolant low' });
    expect(rs.status).toBe('submitted');
    const ov = (c: Client) => c.json('GET', mt(t.co, `/overview?today=${TODAY}`)) as Promise<any>;
    expect(await ov(t.supervisor)).toMatchObject({ awaitingApproval: 1, newRequests: 1, openRequests: 2, outstandingRequests: 2, approvalRequired: false, weekEnd: '2026-11-22' });
    expect(await ov(t.requester)).toMatchObject({ awaitingApproval: 1, newRequests: 1, myRequests: 2 });
    expect(await ov(t.technician)).toMatchObject({ awaitingApproval: 0, newRequests: 0 });
    await t.supervisor.json('POST', mt(t.co, '/work-orders'), { assetId: a.id, description: 'wa', dueStart: '2026-11-18', dueFinish: '2026-11-21', assignedTo: t.technician.userId });
    await t.supervisor.json('POST', mt(t.co, '/work-orders'), { assetId: a.id, description: 'wb', dueFinish: '2026-11-22' });
    await t.supervisor.json('POST', mt(t.co, '/work-orders'), { assetId: a.id, description: 'wc', dueFinish: '2026-11-25' });
    expect(await ov(t.supervisor)).toMatchObject({ dueToday: 1, dueThisWeek: 2, unassigned: 2 });
    expect(await ov(t.technician)).toMatchObject({ dueToday: 1, dueThisWeek: 1, unassigned: 0, myWork: 1 });
    await t.supervisor.json('POST', mt(t.co, `/requests/${ra.id}/convert`), {});
    expect(await ov(t.supervisor)).toMatchObject({ outstandingRequests: 2, openRequests: 1, awaitingApproval: 0 });
  });
});

describe('the members gate: whoever may raise a request may withdraw it', () => {
  it('lets a read-only member withdraw their own request while company_members_v2 is on', async () => {
    const owner = await signup('Gate Owner');
    const co = await registerCompany(owner, 'Gate Works');
    await env.DB.prepare("INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('company_members_v2', 'company', ?, 'on', 'test', 'test', 1)").bind(co).run();
    const reader = await signup('Gate Reader');
    const r = await owner.json('POST', `/api/company/c/${co}/team/invitations`, { emails: [reader.email], role: 'read_only' });
    expect(r.results[0].status).toBe('sent');
    const row = await env.DB.prepare('SELECT id FROM co_invitations WHERE company_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(co, reader.email).first<{ id: string }>();
    const token = `tok-${row!.id}-${Math.random().toString(36).slice(2)}`;
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))].map((b) => b.toString(16).padStart(2, '0')).join('');
    await env.DB.prepare('UPDATE co_invitations SET token_hash = ? WHERE company_id = ? AND id = ?').bind(hash, co, row!.id).run();
    expect((await reader.req('POST', `/api/company/invitations/${token}/accept`, {})).status).toBe(200);
    const rq = await reader.json('POST', mt(co, '/requests'), { description: 'Door sticks' });
    // Other changes stay read-only.
    const edit = await reader.req('PATCH', mt(co, `/requests/${rq.id}`), { description: 'Door sticks badly' });
    expect(edit.status).toBe(403);
    expect(((await edit.json()) as any).details.code).toBe('READ_ONLY');
    const res = await reader.req('POST', mt(co, `/requests/${rq.id}/withdraw`), { reason: 'Fixed itself' });
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).status).toBe('closed');
  });
});
