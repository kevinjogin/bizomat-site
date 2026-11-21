// The Maintenance field release, stream C (src/worker/maintenance/routes-rounds.ts, round-guard.ts, routes-meters.ts and
// routes-setup.ts): inspection rounds (one work order over many assets, each with its own checklist, progress per asset
// and overall, exceptions, a follow-up per failed asset made once, a supervisor's review with segregation of duties and
// the one-person exception), the Readings page (filters, several readings at once with a result each) and asset labels
// that open the ERP (old ASSET: labels still work). Every rule is checked against companies, roles and scopes.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { qrSvg } from '../src/worker/erp/qr';
import { assetLabelText, labelCode } from '../src/worker/maintenance/routes-setup';
import { roundForCard } from '../src/worker/maintenance/routes-rounds';
import roundsSrc from '../src/client/system/maintenance/Rounds.tsx?raw';

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

/** The team with a plant: AREA-1 holds LINE-1 (with the mills M-1 and M-2) and the compressor C-1; OLD-1 is archived. */
async function plant(label: string) {
  const t = await team(label);
  const { supervisor, co } = t;
  const make = (body: Record<string, unknown>) => supervisor.json('POST', mt(co, '/assets'), body);
  const area = await make({ number: 'AREA-1', name: 'Workshop area', category: 'Area' });
  const line = await make({ number: 'LINE-1', name: 'Machining line', parentId: area.id });
  const m1 = await make({ number: 'M-1', name: 'Mill one', parentId: line.id, category: 'Machine' });
  const m2 = await make({ number: 'M-2', name: 'Mill two', parentId: line.id, category: 'Machine' });
  const c1 = await make({ number: 'C-1', name: 'Compressor', parentId: area.id, category: 'Utility' });
  const old = await make({ number: 'OLD-1', name: 'Old saw' });
  await supervisor.json('POST', mt(co, `/assets/${old.id}/archive`), {});
  const G = await supervisor.json('POST', mt(co, '/inspection-templates'), {
    name: 'Guard round',
    failAction: 'work_order',
    items: [
      { label: 'Guards in place', kind: 'pass_fail', critical: true },
      { label: 'Emergency stop tested', kind: 'pass_fail' },
      { label: 'Oil level', kind: 'number', unit: 'L', min: 2, max: 5 },
      { label: 'Remarks', kind: 'text', required: false },
    ],
  });
  const K = await supervisor.json('POST', mt(co, '/inspection-templates'), { name: 'Compressor check', failAction: 'request', items: [{ label: 'Drain valve works', kind: 'pass_fail' }] });
  const item = (tpl: any, label: string) => tpl.items.find((x: any) => x.label === label).id as string;
  return { ...t, area, line, m1, m2, c1, old, G, K, item };
}

type Plant = Awaited<ReturnType<typeof plant>>;

/** A round over the assets given (by default M-1, M-2 and C-1 with its own checklist), assigned to the technician. */
async function round(p: Plant, assets?: { assetId: string; templateId?: string }[], extra: Record<string, unknown> = {}) {
  const res = await p.supervisor.json('POST', mt(p.co, '/inspection-rounds'), { templateId: p.G.id, assets: assets ?? [{ assetId: p.m1.id }, { assetId: p.m2.id }, { assetId: p.c1.id, templateId: p.K.id }], assignedTo: p.tech.userId, ...extra });
  return res as { workOrder: any; roundId: string; assets: number };
}

const lineOf = async (c: Client, co: string, woId: string, number: string) => ((await c.json('GET', mt(co, `/work-orders/${woId}/round`))).lines as any[]).find((l) => l.assetNumber === number);
const numbers = (r: any) => (r.lines as any[]).map((l) => l.assetNumber);
const codeOf = async (res: Response) => ((await res.json()) as any).details?.code;

/** Records the answers on a line (Guards, E-stop, Oil, as given), then completes it. */
async function passLine(c: Client, p: Plant, woId: string, lineId: string, answers: { guards?: boolean; estop?: boolean; oil?: number; note?: string } = {}) {
  await c.json('PUT', mt(p.co, `/work-orders/${woId}/round/lines/${lineId}/results`), {
    results: [
      { itemId: p.item(p.G, 'Guards in place'), passed: answers.guards ?? true, note: answers.note },
      { itemId: p.item(p.G, 'Emergency stop tested'), passed: answers.estop ?? true },
      { itemId: p.item(p.G, 'Oil level'), value: answers.oil ?? 3.5 },
    ],
  });
  return c.json('POST', mt(p.co, `/work-orders/${woId}/round/lines/${lineId}/complete`), {});
}

describe('inspection rounds', () => {
  it('makes one inspection work order over many assets', async () => {
    const p = await plant('Alpha');
    for (const who of [p.tech, p.requester]) {
      expect((await who.req('POST', mt(p.co, '/inspection-rounds'), { templateId: p.G.id, assets: [{ assetId: p.m1.id }] })).status).toBe(403);
    }
    const made = await p.supervisor.req('POST', mt(p.co, '/inspection-rounds'), { templateId: p.G.id, assets: [{ assetId: p.m1.id }, { assetId: p.m2.id }, { assetId: p.c1.id, templateId: p.K.id }], assignedTo: p.tech.userId, dueFinish: day(3) });
    expect(made.status).toBe(201);
    const body = (await made.json()) as any;
    expect(body.assets).toBe(3);
    expect(body.workOrder).toMatchObject({ jobType: 'inspection', assetNumber: 'AREA-1', status: 'assigned', description: 'Inspection round: Guard round, 3 assets', dueFinish: day(3) });
    // One job in the work order list, not one per asset.
    expect((await p.supervisor.json('GET', mt(p.co, '/work-orders?jobType=inspection'))).total).toBe(1);
    const r = await p.supervisor.json('GET', mt(p.co, `/work-orders/${body.workOrder.id}/round`));
    expect(r.round.totals).toEqual({ assets: 3, completed: 0, open: 3, passed: 0, failed: 0, percent: 0, questions: 9, answered: 0, exceptions: 0, approved: 0, notApproved: 0, awaitingApproval: 0 });
    expect(r.lines.map((l: any) => [l.assetNumber, l.templateName, l.questions, l.status, l.review])).toEqual([
      ['M-1', 'Guard round', 4, 'open', null],
      ['M-2', 'Guard round', 4, 'open', null],
      ['C-1', 'Compressor check', 1, 'open', null],
    ]);
    expect(r.round).toMatchObject({ templateName: 'Guard round', locked: false });
    expect(r.can).toEqual({ record: true, manage: true, review: true, timer: true });
    // The history of the work order says what was made.
    const history = (await p.supervisor.json('GET', mt(p.co, `/work-orders/${body.workOrder.id}`))).history.map((e: any) => e.action);
    expect(history).toEqual(expect.arrayContaining(['work_order.created', 'round.created']));
  });

  it('tells the technician given a round, as for any work order given to them', async () => {
    const p = await plant('Alerted');
    const alertsOf = async (userId: string, recordId: string) => (await env.DB.prepare('SELECT * FROM erp_alerts WHERE company_id = ? AND user_id = ? AND record_id = ?').bind(p.co, userId, recordId).all<any>()).results;
    const { workOrder: w } = await round(p, undefined, { dueFinish: day(3) });
    const got = await alertsOf(p.tech.userId, w.id);
    expect(got).toHaveLength(1);
    expect(got[0]).toMatchObject({ kind: 'assigned', title: `Work order ${w.number} was given to you`, body: `AREA-1 Workshop area: Inspection round: Guard round, 3 assets Due ${day(3)}.`, link: `/c/${p.co}/maintenance/work-orders/${w.id}`, emailed: 0 });
    // Nobody else is told, and never the supervisor who made it.
    for (const who of [p.owner, p.supervisor, p.tech2, p.requester]) expect(await alertsOf(who.userId, w.id)).toHaveLength(0);
    // A round given to nobody, or to the supervisor making it, alerts nobody.
    const unassigned = (await p.supervisor.json('POST', mt(p.co, '/inspection-rounds'), { templateId: p.G.id, assets: [{ assetId: p.m1.id }] })).workOrder;
    expect(unassigned.status).toBe('open');
    const self = (await p.supervisor.json('POST', mt(p.co, '/inspection-rounds'), { templateId: p.G.id, assets: [{ assetId: p.m2.id }], assignedTo: p.supervisor.userId })).workOrder;
    const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_alerts WHERE company_id = ? AND record_id IN (?, ?)').bind(p.co, unassigned.id, self.id).first<{ n: number }>();
    expect(n!.n).toBe(0);
  });

  it("chooses the work order's asset, refuses wrong assets and checklists, and answers null for other work orders", async () => {
    const p = await plant('Bravo');
    expect((await round(p, [{ assetId: p.m1.id }, { assetId: p.m2.id }])).workOrder.assetNumber).toBe('LINE-1');
    expect((await round(p, [{ assetId: p.m1.id }])).workOrder).toMatchObject({ assetNumber: 'M-1', description: 'Inspection round: Guard round, 1 asset' });
    expect((await round(p, [{ assetId: p.m1.id }, { assetId: p.m2.id }], { assetId: p.m1.id })).workOrder.assetNumber).toBe('M-1');
    // An asset with no parent in common with the others: the first one chosen.
    const loose = await p.supervisor.json('POST', mt(p.co, '/assets'), { number: 'Z-9', name: 'Yard light' });
    expect((await round(p, [{ assetId: loose.id }, { assetId: p.m1.id }])).workOrder.assetNumber).toBe('Z-9');

    const post = (body: Record<string, unknown>) => p.supervisor.req('POST', mt(p.co, '/inspection-rounds'), { templateId: p.G.id, ...body });
    let res = await post({ assets: [{ assetId: p.m1.id }, { assetId: p.m1.id }] });
    expect([res.status, await codeOf(res)]).toEqual([400, 'ROUND_DUPLICATE']);
    res = await post({ assets: [{ assetId: p.old.id }] });
    expect(res.status).toBe(400);
    const archived = (await res.json()) as any;
    expect(archived.details.code).toBe('ROUND_ASSET_ARCHIVED');
    expect(archived.error).toContain('OLD-1');
    const stranger = await signup('Bravo Stranger');
    const own = (await stranger.json('GET', '/api/maintenance/companies')).companies.find((x: any) => x.kind === 'own');
    const theirs = await stranger.json('POST', mt(own.id, '/assets'), { name: 'Their pump' });
    res = await post({ assets: [{ assetId: theirs.id }] });
    expect([res.status, await codeOf(res)]).toEqual([400, 'ROUND_ASSET_UNKNOWN']);
    const retired = await p.supervisor.json('POST', mt(p.co, '/inspection-templates'), { name: 'Retired round', items: [{ label: 'x', kind: 'pass_fail' }] });
    await p.supervisor.json('PATCH', mt(p.co, `/inspection-templates/${retired.id}`), { archived: true });
    res = await p.supervisor.req('POST', mt(p.co, '/inspection-rounds'), { templateId: retired.id, assets: [{ assetId: p.m1.id }] });
    expect([res.status, await codeOf(res)]).toEqual([400, 'TEMPLATE_ARCHIVED']);
    res = await post({ assets: [{ assetId: p.m1.id, templateId: 'not-a-template' }] });
    expect([res.status, await codeOf(res)]).toEqual([400, 'TEMPLATE_UNKNOWN']);
    // At most 100 assets in one request.
    expect((await post({ assets: Array.from({ length: 101 }, () => ({ assetId: p.m1.id })) })).status).toBe(400);
    // Nothing was made by the refusals: four rounds, four inspection work orders.
    expect((await p.supervisor.json('GET', mt(p.co, '/inspection-rounds'))).total).toBe(4);
    expect((await p.supervisor.json('GET', mt(p.co, '/work-orders?jobType=inspection'))).total).toBe(4);

    const ordinary = await p.supervisor.json('POST', mt(p.co, '/work-orders'), { assetId: p.m1.id, description: 'Change the belt' });
    expect(await p.supervisor.json('GET', mt(p.co, `/work-orders/${ordinary.id}/round`))).toEqual({ round: null, lines: [] });
  });

  it('records each asset with progress per asset and overall', async () => {
    const p = await plant('Charlie');
    const { workOrder: w } = await round(p);
    const m1 = await lineOf(p.tech, p.co, w.id, 'M-1');
    const results = { results: [{ itemId: p.item(p.G, 'Guards in place'), passed: true }, { itemId: p.item(p.G, 'Emergency stop tested'), passed: true }, { itemId: p.item(p.G, 'Oil level'), value: 3.5 }] };
    expect(await p.tech.json('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}/results`), results)).toEqual({ recorded: 3, failed: 0, answered: 3, questions: 4, percent: 75 });
    expect((await p.requester.req('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}/results`), results)).status).toBe(403);
    expect((await p.tech2.req('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}/results`), results)).status).toBe(404);
    // An item of another checklist is refused.
    expect((await p.tech.req('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}/results`), { results: [{ itemId: p.item(p.K, 'Drain valve works'), passed: true }] })).status).toBe(400);
    let r = await p.tech.json('GET', mt(p.co, `/work-orders/${w.id}/round`));
    expect(r.lines.find((l: any) => l.id === m1.id)).toMatchObject({ answered: 3, percent: 75 });
    expect(r.round.totals).toMatchObject({ answered: 3, percent: 0 });
    const done = await p.tech.json('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}/complete`), {});
    expect(done).toMatchObject({ status: 'passed', failed: 0, followUp: null, followUpMade: false, next: { assetNumber: 'M-2' } });
    expect(done.totals).toMatchObject({ completed: 1, percent: 33 });
    expect(done.line).toMatchObject({ status: 'passed', percent: 100, questions: 3, review: 'awaiting' });
    const again = await p.tech.req('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}/results`), results);
    expect([again.status, await codeOf(again)]).toEqual([409, 'ROUND_LINE_DONE']);
    // The line's own page: the asset, the recorded items, the history, and the next open asset.
    const view = await p.tech.json('GET', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}`));
    expect(view.asset).toMatchObject({ number: 'M-1', name: 'Mill one' });
    expect(view.items.map((i: any) => i.label)).toEqual(['Guards in place', 'Emergency stop tested', 'Oil level']);
    expect(view.results.map((x: any) => x.label)).toEqual(['Guards in place', 'Emergency stop tested', 'Oil level']);
    expect(view.history.map((e: any) => e.action)).toEqual(['round.asset_passed', 'round.recorded']);
    expect(view.next).toMatchObject({ assetNumber: 'M-2' });
    expect(view.can).toEqual({ record: false, complete: false, approve: false, notApprove: false, remove: false, changeChecklist: false });
    r = await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round?summary=1`));
    expect(r.lines).toBeUndefined();
    expect(r.round.totals.completed).toBe(1);
  });

  it('shows exceptions, makes a follow-up per failed asset once, and completes each asset once', async () => {
    const p = await plant('Delta');
    const { workOrder: w } = await round(p);
    const m2 = await lineOf(p.tech, p.co, w.id, 'M-2');
    const failed = await p.tech.json('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${m2.id}/results`), {
      results: [{ itemId: p.item(p.G, 'Guards in place'), passed: false, note: 'Guard cracked' }, { itemId: p.item(p.G, 'Emergency stop tested'), passed: true }, { itemId: p.item(p.G, 'Oil level'), value: 6 }],
    });
    expect(failed.failed).toBe(2);
    expect(numbers(await p.tech.json('GET', mt(p.co, `/work-orders/${w.id}/round?filter=exceptions`)))).toEqual(['M-2']);
    const done = await p.tech.json('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${m2.id}/complete`), {});
    expect(done).toMatchObject({ status: 'failed', failed: 2, followUpMade: true, followUp: { kind: 'work_order' } });
    const follow = await p.supervisor.json('GET', mt(p.co, `/work-orders/${done.followUp.id}`));
    expect(follow.workOrder).toMatchObject({ assetNumber: 'M-2', jobType: 'corrective', status: 'open' });
    expect(follow.workOrder.description).toContain(w.number);
    expect(follow.workOrder.description).toContain('Guards in place');
    expect(follow.workOrder.description).toContain('Oil level (6 L)');
    // M-1 passes.
    expect((await passLine(p.tech, p, w.id, (await lineOf(p.tech, p.co, w.id, 'M-1')).id)).status).toBe('passed');
    // The compressor: its own checklist (failures raise a request); nothing recorded yet is refused.
    const c1 = await lineOf(p.tech, p.co, w.id, 'C-1');
    const missing = await p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}/complete`), {});
    expect(missing.status).toBe(400);
    const missingBody = (await missing.json()) as any;
    expect(missingBody.details.code).toBe('ROUND_LINE_MISSING');
    expect(missingBody.error).toContain('Drain valve works');
    await p.tech.json('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}/results`), { results: [{ itemId: p.item(p.K, 'Drain valve works'), passed: false }] });
    const followUps = async () => (await env.DB.prepare("SELECT COUNT(*) AS n FROM mt_requests WHERE company_id = ? AND asset_id = ? AND description LIKE 'Follow-up of the failed inspection%'").bind(p.co, p.c1.id).first<{ n: number }>())!.n;
    // The once-only key of this attempt, already taken (as by a completion a moment earlier): refused, nothing made.
    await env.DB.prepare('INSERT INTO mt_done (company_id, key, created_at) VALUES (?, ?, ?)').bind(p.co, `round-asset:${c1.id}:1`, Date.now()).run();
    const taken = await p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}/complete`), {});
    expect([taken.status, await codeOf(taken)]).toEqual([409, 'ROUND_CONFLICT']);
    expect(await followUps()).toBe(0);
    expect((await lineOf(p.tech, p.co, w.id, 'C-1')).status).toBe('open');
    await env.DB.prepare('DELETE FROM mt_done WHERE company_id = ? AND key = ?').bind(p.co, `round-asset:${c1.id}:1`).run();
    // Two completions at the same moment: one is done, the other is refused (the key, or the line already done), one follow-up.
    const both = await Promise.all([p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}/complete`), {}), p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}/complete`), {})]);
    expect(both.map((x) => x.status).sort()).toEqual([200, 409]);
    expect(['ROUND_CONFLICT', 'ROUND_LINE_DONE']).toContain(await codeOf(both.find((x) => x.status === 409)!));
    expect(await followUps()).toBe(1);
    // The filters.
    const list = async (q: string) => numbers(await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round?${q}`)));
    expect(await list('filter=incomplete')).toEqual([]);
    expect(await list('filter=exceptions')).toEqual(['M-2', 'C-1']);
    expect(await list('q=mill')).toEqual(['M-1', 'M-2']);
    expect(await list('q=compressor')).toEqual(['C-1']);
    const r = await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round`));
    expect(r.round.totals).toMatchObject({ completed: 3, percent: 100, passed: 1, failed: 2, exceptions: 2, awaitingApproval: 3 });
    expect(r.lines.find((l: any) => l.assetNumber === 'C-1').followUp).toMatchObject({ kind: 'request' });
    const events = await env.DB.prepare("SELECT COUNT(*) AS n FROM mt_events WHERE company_id = ? AND asset_id = ? AND action = 'round.asset_failed'").bind(p.co, p.m2.id).first<{ n: number }>();
    expect(events!.n).toBe(1);
    // The list of rounds, with its counts.
    const rounds = await p.supervisor.json('GET', mt(p.co, '/inspection-rounds'));
    expect(rounds.rounds).toEqual([expect.objectContaining({ workOrderId: w.id, assets: 3, completed: 3, percent: 100, exceptions: 2, awaitingApproval: 3, notApproved: 0, assetNumber: 'AREA-1', templateName: 'Guard round', assignedToName: 'Delta Technician' })]);
  });

  it('adds, changes and takes off assets, and completing the work order needs every asset done', async () => {
    const p = await plant('Echo');
    const { workOrder: w } = await round(p);
    const added = await p.supervisor.json('POST', mt(p.co, `/work-orders/${w.id}/round/assets`), { assets: [{ assetId: p.m1.id }, { assetId: p.line.id }] });
    expect(added).toMatchObject({ added: 1, skipped: [{ number: 'M-1' }], assets: 4 });
    expect((await p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/round/assets`), { assets: [{ assetId: p.area.id }] })).status).toBe(403);
    const ordinary = await p.supervisor.json('POST', mt(p.co, '/work-orders'), { assetId: p.m1.id, description: 'Change the belt' });
    const notRound = await p.supervisor.req('POST', mt(p.co, `/work-orders/${ordinary.id}/round/assets`), { assets: [{ assetId: p.m1.id }] });
    expect([notRound.status, await codeOf(notRound)]).toEqual([404, 'NOT_A_ROUND']);
    // Another checklist for the compressor, while nothing is recorded for it.
    let c1 = await lineOf(p.supervisor, p.co, w.id, 'C-1');
    const changed = await p.supervisor.json('PATCH', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}`), { templateId: p.G.id });
    expect(changed.line).toMatchObject({ templateName: 'Guard round', questions: 4 });
    await p.tech.json('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}/results`), { results: [{ itemId: p.item(p.G, 'Guards in place'), passed: true }] });
    let res = await p.supervisor.req('PATCH', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}`), { templateId: p.K.id });
    expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_LINE_HAS_RESULTS']);
    res = await p.supervisor.req('DELETE', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}`));
    expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_LINE_HAS_RESULTS']);
    const line = await lineOf(p.supervisor, p.co, w.id, 'LINE-1');
    expect((await p.tech.req('DELETE', mt(p.co, `/work-orders/${w.id}/round/lines/${line.id}`))).status).toBe(403);
    expect((await p.supervisor.req('DELETE', mt(p.co, `/work-orders/${w.id}/round/lines/${line.id}`))).status).toBe(200);
    expect(numbers(await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round`)))).toEqual(['M-1', 'M-2', 'C-1']);
    // The work order keeps its own timer.
    expect((await p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/timer/start`), {})).status).toBe(201);
    expect((await p.tech.json('GET', mt(p.co, `/work-orders/${w.id}/round`))).round.workOrder.timerRunning).toBe(true);
    // Completing the work order while an asset is open is refused, with the open ones named.
    await passLine(p.tech, p, w.id, (await lineOf(p.tech, p.co, w.id, 'M-1')).id);
    await passLine(p.tech, p, w.id, (await lineOf(p.tech, p.co, w.id, 'M-2')).id);
    res = await p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/complete`), { notes: 'Done' });
    expect(res.status).toBe(409);
    const incomplete = (await res.json()) as any;
    expect(incomplete.details).toMatchObject({ code: 'ROUND_INCOMPLETE', open: 1 });
    expect(incomplete.error).toBe('1 asset on this inspection round is not done yet: C-1. Complete their checklists, or take them off the round.');
    c1 = await lineOf(p.tech, p.co, w.id, 'C-1');
    await passLine(p.tech, p, w.id, c1.id);
    // Approvals do not block it: nothing is approved and it completes.
    const completed = await p.tech.json('POST', mt(p.co, `/work-orders/${w.id}/complete`), { notes: 'Round done' });
    expect(completed.status).toBe('completed');
    res = await p.tech.req('PUT', mt(p.co, `/work-orders/${w.id}/round/lines/${c1.id}/results`), { results: [{ itemId: p.item(p.G, 'Guards in place'), passed: true }] });
    expect(res.status).toBe(409);
    expect(((await res.json()) as any).error).toMatch(/locked/);
    expect((await p.supervisor.req('POST', mt(p.co, `/work-orders/${w.id}/round/assets`), { assets: [{ assetId: p.area.id }] })).status).toBe(409);
    const r = await p.tech.json('GET', mt(p.co, `/work-orders/${w.id}/round`));
    expect(r.round.locked).toBe(true);
    expect(r.can).toEqual({ record: false, manage: false, review: false, timer: false });

    // A round of one asset keeps it.
    const { workOrder: one } = await round(p, [{ assetId: p.m1.id }]);
    const only = await lineOf(p.supervisor, p.co, one.id, 'M-1');
    res = await p.supervisor.req('DELETE', mt(p.co, `/work-orders/${one.id}/round/lines/${only.id}`));
    expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_LAST_ASSET']);
  });

  it('holds up to 300 assets, 100 per request', async () => {
    const p = await plant('Foxtrot');
    const csv = ['Asset number,Name', ...Array.from({ length: 301 }, (_, i) => `EXT-${String(i + 1).padStart(3, '0')},Fire extinguisher ${i + 1}`)].join('\n');
    expect((await p.owner.json('POST', mt(p.co, '/assets/import'), { csv, dryRun: false })).created).toBe(301);
    const ext = ((await p.owner.json('GET', mt(p.co, '/assets?limit=1000&q=extinguisher&sort=number'))).assets as any[]).map((x) => ({ assetId: x.id }));
    expect(ext).toHaveLength(301);
    const { workOrder: w, assets } = await round(p, ext.slice(0, 100));
    expect(assets).toBe(100);
    expect((await p.supervisor.json('POST', mt(p.co, `/work-orders/${w.id}/round/assets`), { assets: ext.slice(100, 200) })).assets).toBe(200);
    expect((await p.supervisor.json('POST', mt(p.co, `/work-orders/${w.id}/round/assets`), { assets: ext.slice(200, 300) })).assets).toBe(300);
    const res = await p.supervisor.req('POST', mt(p.co, `/work-orders/${w.id}/round/assets`), { assets: ext.slice(300) });
    expect([res.status, await codeOf(res)]).toEqual([400, 'ROUND_TOO_MANY']);
    const r = await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round`));
    expect(r.round.totals.assets).toBe(300);
    expect(r.lines.map((l: any) => l.position)).toEqual(Array.from({ length: 300 }, (_, i) => i + 1));
  });

  it('lets a supervisor approve or mark an asset not approved, never their own completion', async () => {
    const p = await plant('Golf');
    const { workOrder: w } = await round(p, [{ assetId: p.m1.id }, { assetId: p.m2.id }]);
    const m1 = await lineOf(p.supervisor, p.co, w.id, 'M-1');
    const m2 = await lineOf(p.supervisor, p.co, w.id, 'M-2');
    const decide = (c: Client, lineId: string, body: Record<string, unknown>) => c.req('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${lineId}/decide`), body);
    let res = await decide(p.supervisor, m1.id, { decision: 'approved' });
    expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_NOT_COMPLETED']);
    await passLine(p.supervisor, p, w.id, m1.id);
    res = await decide(p.supervisor, m1.id, { decision: 'approved' });
    expect([res.status, await codeOf(res)]).toEqual([403, 'SEGREGATION']);
    expect((await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round/lines/${m1.id}`))).segregation).toBe('You completed this checklist, so another supervisor or administrator reviews it.');
    res = await decide(p.owner, m1.id, { decision: 'approved' });
    expect(res.status).toBe(200);
    expect((await res.json()) as any).toMatchObject({ line: { review: 'approved', reviewedByName: 'Golf Owner' }, segregationException: false });
    res = await decide(p.owner, m1.id, { decision: 'approved' });
    expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_REVIEWED']);
    // The technician completes M-2 with a failed guard: one follow-up.
    const first = await passLine(p.tech, p, w.id, m2.id, { guards: false });
    expect(first.followUpMade).toBe(true);
    expect((await decide(p.tech, m2.id, { decision: 'approved' })).status).toBe(403);
    expect((await decide(p.supervisor, m2.id, { decision: 'not_approved' })).status).toBe(400);
    res = await decide(p.supervisor, m2.id, { decision: 'not_approved', note: 'No photo of the cracked guard' });
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).line).toMatchObject({ status: 'open', attempt: 2, review: 'not_approved', reviewNote: 'No photo of the cracked guard', answered: 3 });
    expect(numbers(await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round?filter=not_approved`)))).toEqual(['M-2']);
    expect(numbers(await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round?filter=incomplete`)))).toEqual(['M-2']);
    // Done again: no second follow-up, and it waits for approval again.
    const second = await p.tech.json('POST', mt(p.co, `/work-orders/${w.id}/round/lines/${m2.id}/complete`), {});
    expect(second).toMatchObject({ followUpMade: false, followUp: { id: first.followUp.id }, line: { review: 'awaiting', attempt: 2 } });
    const follow = await env.DB.prepare("SELECT COUNT(*) AS n FROM mt_work_orders WHERE company_id = ? AND asset_id = ? AND description LIKE 'Follow-up of the failed inspection%'").bind(p.co, p.m2.id).first<{ n: number }>();
    expect(follow!.n).toBe(1);
    // On the completed work order: not approved needs it reopened first; approving is allowed.
    await p.tech.json('POST', mt(p.co, `/work-orders/${w.id}/complete`), { notes: 'Round done' });
    res = await decide(p.owner, m1.id, { decision: 'not_approved', note: 'Oil level not shown' });
    expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_LOCKED']);
    res = await decide(p.supervisor, m2.id, { decision: 'approved', note: 'Photo added' });
    expect(res.status).toBe(200);
    const history = (await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round/lines/${m2.id}`))).history.map((e: any) => e.action);
    expect(history.slice(0, 3)).toEqual(['round.approved', 'round.asset_failed', 'round.not_approved']);
    // A cancelled round takes no decisions.
    const { workOrder: other } = await round(p, [{ assetId: p.c1.id, templateId: p.K.id }]);
    const c1 = await lineOf(p.tech, p.co, other.id, 'C-1');
    await p.tech.json('PUT', mt(p.co, `/work-orders/${other.id}/round/lines/${c1.id}/results`), { results: [{ itemId: p.item(p.K, 'Drain valve works'), passed: true }] });
    await p.tech.json('POST', mt(p.co, `/work-orders/${other.id}/round/lines/${c1.id}/complete`), {});
    await p.supervisor.json('POST', mt(p.co, `/work-orders/${other.id}/cancel`), { reason: 'x' });
    res = await p.supervisor.req('POST', mt(p.co, `/work-orders/${other.id}/round/lines/${c1.id}/decide`), { decision: 'approved' });
    expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_CANCELLED']);
  });

  it('lets the only supervisor or administrator approve their own completion, and records the exception', async () => {
    const solo = await signup('Solo Maintainer');
    const co = (await solo.json('GET', '/api/maintenance/companies')).companies.find((x: any) => x.kind === 'own').id;
    const pump = await solo.json('POST', mt(co, '/assets'), { name: 'Pump' });
    const tpl = await solo.json('POST', mt(co, '/inspection-templates'), { name: 'Pump check', items: [{ label: 'No leaks', kind: 'pass_fail' }] });
    const made = await solo.json('POST', mt(co, '/inspection-rounds'), { templateId: tpl.id, assets: [{ assetId: pump.id }] });
    const line = (await solo.json('GET', mt(co, `/work-orders/${made.workOrder.id}/round`))).lines[0];
    await solo.json('PUT', mt(co, `/work-orders/${made.workOrder.id}/round/lines/${line.id}/results`), { results: [{ itemId: tpl.items[0].id, passed: true }] });
    await solo.json('POST', mt(co, `/work-orders/${made.workOrder.id}/round/lines/${line.id}/complete`), {});
    expect((await solo.json('GET', mt(co, `/work-orders/${made.workOrder.id}/round/lines/${line.id}`))).segregation).toBeNull();
    const decided = await solo.json('POST', mt(co, `/work-orders/${made.workOrder.id}/round/lines/${line.id}/decide`), { decision: 'approved' });
    expect(decided).toMatchObject({ line: { review: 'approved' }, segregationException: true });
    const e = await env.DB.prepare("SELECT summary, after_json FROM mt_events WHERE company_id = ? AND action = 'round.approved'").bind(co).first<{ summary: string; after_json: string }>();
    expect(e!.summary).toContain('segregation exception');
    expect(JSON.parse(e!.after_json).segregationException).toBe(true);
  });

  it('keeps rounds inside their company and shows each person only the rounds they may see', async () => {
    const A = await plant('Hotel');
    const B = await team('India');
    const { workOrder: w } = await round(A);
    const lineA = await lineOf(A.tech, A.co, w.id, 'M-1');
    expect((await B.owner.req('GET', mt(A.co, `/work-orders/${w.id}/round`))).status).toBe(404);
    expect((await B.owner.req('GET', mt(B.co, `/work-orders/${w.id}/round`))).status).toBe(404);
    expect((await B.owner.req('GET', mt(B.co, `/work-orders/${w.id}/round/lines/${lineA.id}`))).status).toBe(404);
    expect((await B.owner.req('PUT', mt(B.co, `/work-orders/${w.id}/round/lines/${lineA.id}/results`), { results: [{ itemId: A.item(A.G, 'Guards in place'), passed: true }] })).status).toBe(404);
    expect((await B.owner.req('POST', mt(B.co, `/work-orders/${w.id}/round/lines/${lineA.id}/decide`), { decision: 'approved' })).status).toBe(404);
    const bTpl = await B.supervisor.json('POST', mt(B.co, '/inspection-templates'), { name: 'Their check', items: [{ label: 'x', kind: 'pass_fail' }] });
    const res = await B.supervisor.req('POST', mt(B.co, '/inspection-rounds'), { templateId: bTpl.id, assets: [{ assetId: A.m1.id }] });
    expect([res.status, await codeOf(res)]).toEqual([400, 'ROUND_ASSET_UNKNOWN']);
    // Company A's checklist cannot be used in company B either.
    const bAsset = await B.supervisor.json('POST', mt(B.co, '/assets'), { name: 'Their mill' });
    const tplRes = await B.supervisor.req('POST', mt(B.co, '/inspection-rounds'), { templateId: A.G.id, assets: [{ assetId: bAsset.id }] });
    expect([tplRes.status, await codeOf(tplRes)]).toEqual([400, 'TEMPLATE_UNKNOWN']);
    expect((await B.owner.json('GET', mt(B.co, '/inspection-rounds?status=all'))).rounds).toEqual([]);
    // In company A: a technician sees the rounds given to them only; a requester none.
    await round(A, [{ assetId: A.c1.id }], { assignedTo: A.tech2.userId });
    expect((await A.supervisor.json('GET', mt(A.co, '/inspection-rounds'))).total).toBe(2);
    const mine = await A.tech.json('GET', mt(A.co, '/inspection-rounds'));
    expect(mine.rounds.map((r: any) => r.workOrderId)).toEqual([w.id]);
    expect(mine.rounds.every((r: any) => r.assignedToName === 'Hotel Technician')).toBe(true);
    expect((await A.tech2.json('GET', mt(A.co, '/inspection-rounds'))).rounds.map((r: any) => r.assignedToName)).toEqual(['Hotel Second Technician']);
    expect((await A.requester.json('GET', mt(A.co, '/inspection-rounds'))).rounds).toEqual([]);
    // Status filter: completed rounds are not outstanding.
    expect((await A.supervisor.json('GET', mt(A.co, '/inspection-rounds?status=completed'))).rounds).toEqual([]);
    expect((await A.supervisor.json('GET', mt(A.co, '/inspection-rounds?q=compressor'))).total).toBe(1);
    expect((await A.supervisor.json('GET', mt(A.co, '/inspection-rounds?q=workshop'))).total).toBe(1);
  });

  it('gives the job card each asset with its checklist and results, and no costs', async () => {
    const p = await plant('Juliet');
    const { workOrder: w } = await round(p);
    await passLine(p.tech, p, w.id, (await lineOf(p.tech, p.co, w.id, 'M-1')).id, { oil: 4 });
    const card = await roundForCard(env.DB, { companyId: p.co }, { id: w.id });
    expect(card).toMatchObject({ templateName: 'Guard round' });
    expect(card!.lines.map((l) => [l.assetNumber, l.templateName, l.status, l.review, l.items.length, l.results.length])).toEqual([
      ['M-1', 'Guard round', 'passed', 'awaiting', 3, 3],
      ['M-2', 'Guard round', 'open', null, 4, 0],
      ['C-1', 'Compressor check', 'open', null, 1, 0],
    ]);
    expect(card!.lines[0].results.find((r) => r.label === 'Oil level')).toMatchObject({ value: 4, unit: 'L', passed: true });
    expect(JSON.stringify(card)).not.toMatch(/cost|cents|rate/i);
    // Not a round: nothing. Another company: nothing.
    const ordinary = await p.supervisor.json('POST', mt(p.co, '/work-orders'), { assetId: p.m1.id, description: 'x' });
    expect(await roundForCard(env.DB, { companyId: p.co }, { id: ordinary.id })).toBeNull();
    expect(await roundForCard(env.DB, { companyId: 'another-company' }, { id: w.id })).toBeNull();
  });
});

describe('the Readings page', () => {
  it('lists the live meters with filters', async () => {
    const p = await plant('Kilo');
    const { supervisor, requester, co } = p;
    const site = await supervisor.json('POST', mt(co, '/sites'), { code: 'S1', name: 'North' });
    for (const asset of [p.m1, p.m2]) await supervisor.json('PUT', mt(co, `/assets/${asset.id}/site`), { siteId: site.id });
    const m1Hours = await supervisor.json('POST', mt(co, '/meters'), { assetId: p.m1.id, name: 'Spindle hours', unit: 'h' });
    const temp = await supervisor.json('POST', mt(co, '/meters'), { assetId: p.m2.id, name: 'Coolant temperature', unit: 'C', rising: false, expectedMin: 10, expectedMax: 30 });
    await supervisor.json('POST', mt(co, '/meters'), { assetId: p.c1.id, name: 'Run hours', unit: 'h' });
    const spare = await supervisor.json('POST', mt(co, '/meters'), { assetId: p.m1.id, name: 'Spare counter' });
    await supervisor.json('PATCH', mt(co, `/meters/${spare.id}`), { archived: true });
    const z1 = await supervisor.json('POST', mt(co, '/assets'), { number: 'Z-1', name: 'Retired press' });
    await supervisor.json('POST', mt(co, '/meters'), { assetId: z1.id, name: 'Gone counter' });
    await supervisor.json('POST', mt(co, `/assets/${z1.id}/archive`), {});
    await requester.json('POST', mt(co, `/meters/${m1Hours.id}/readings`), { value: 100, readAt: Date.now() - 10 * DAY });
    await requester.json('POST', mt(co, `/meters/${temp.id}/readings`), { value: 20 });

    const view = (q = '') => requester.json('GET', mt(co, `/meters?view=readings${q}`));
    const all = await view();
    expect(all.total).toBe(3);
    expect(all.meters.map((m: any) => [m.assetNumber, m.name, m.siteCode])).toEqual([
      ['C-1', 'Run hours', null],
      ['M-1', 'Spindle hours', 'S1'],
      ['M-2', 'Coolant temperature', 'S1'],
    ]);
    expect(all.meters.find((m: any) => m.id === temp.id)).toMatchObject({ lastOutOfRange: false, siteName: 'North', rising: false, expectedMin: 10, expectedMax: 30 });
    expect((await view(`&siteId=${site.id}`)).total).toBe(2);
    expect((await view('&q=compressor')).total).toBe(1);
    expect((await view('&q=coolant')).meters.map((m: any) => m.id)).toEqual([temp.id]);
    expect((await view('&notReadForDays=7')).meters.map((m: any) => m.name).sort()).toEqual(['Run hours', 'Spindle hours']);
    expect((await view('&kind=gauge')).meters.map((m: any) => m.id)).toEqual([temp.id]);
    expect((await view('&kind=meter')).total).toBe(2);
    expect((await view(`&assetId=${p.area.id}&includeChildren=1`)).total).toBe(3);
    expect((await view(`&assetId=${p.line.id}&includeChildren=1`)).total).toBe(2);
    expect((await view(`&assetId=${p.m1.id}`)).total).toBe(1);
    expect((await view('&sort=lastRead')).meters.map((m: any) => m.name)).toEqual(['Run hours', 'Spindle hours', 'Coolant temperature']);
    const paged = await view('&limit=2&offset=2');
    expect([paged.total, paged.meters.length]).toEqual([3, 1]);
    // The plain list keeps its old behaviour and shape.
    const plain = await requester.json('GET', mt(co, '/meters'));
    expect(plain.meters.map((m: any) => m.name)).toContain('Gone counter');
    expect(Object.keys(plain.meters[0])).not.toContain('siteCode');
    expect(plain.total).toBe(4);
  });

  it('saves several readings at once, each with its own result', async () => {
    const p = await plant('Lima');
    const { supervisor, requester, co } = p;
    const m1Hours = await supervisor.json('POST', mt(co, '/meters'), { assetId: p.m1.id, name: 'Spindle hours', unit: 'h' });
    const temp = await supervisor.json('POST', mt(co, '/meters'), { assetId: p.m2.id, name: 'Coolant temperature', rising: false, expectedMin: 10, expectedMax: 30 });
    const c1Hours = await supervisor.json('POST', mt(co, '/meters'), { assetId: p.c1.id, name: 'Run hours', unit: 'h' });
    await requester.json('POST', mt(co, `/meters/${m1Hours.id}/readings`), { value: 100, readAt: Date.now() - 10 * DAY });
    const batch = (entries: unknown[]) => requester.req('POST', mt(co, '/readings/batch'), { entries, today: today() });

    let res = await batch([{ meterId: m1Hours.id, value: 150 }, { meterId: temp.id, value: 35 }, { meterId: c1Hours.id, value: 10 }]);
    expect(res.status).toBe(200);
    let out = (await res.json()) as any;
    expect(out).toMatchObject({ saved: 3, failed: 0 });
    expect(out.results.map((r: any) => r.meterId)).toEqual([m1Hours.id, temp.id, c1Hours.id]);
    expect(out.results[0].reading).toMatchObject({ delta: 50, total: 150 });
    expect(out.results[1].reading.outOfRange).toBe(true);
    expect(out.results[2].reading.total).toBe(10);
    // One refused reading does not undo the other.
    out = (await (await batch([{ meterId: m1Hours.id, value: 140 }, { meterId: temp.id, value: 21 }])).json()) as any;
    expect(out).toMatchObject({ saved: 1, failed: 1 });
    expect(out.results[0]).toMatchObject({ ok: false, status: 409 });
    expect(out.results[0].error).toMatch(/lower than the last reading/);
    expect(out.results[1].ok).toBe(true);
    expect((await requester.json('GET', mt(co, `/meters/${m1Hours.id}`))).meter.lastValue).toBe(150);
    expect((await requester.json('GET', mt(co, `/meters/${temp.id}`))).meter.lastValue).toBe(21);
    out = (await (await batch([{ meterId: m1Hours.id, value: 140, reset: true }])).json()) as any;
    expect(out.saved).toBe(1);
    // The whole body is checked first: a meter twice, or more than 50, saves nothing.
    const before = await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_readings WHERE company_id = ? AND meter_id = ?').bind(co, temp.id).first<{ n: number }>();
    res = await batch([{ meterId: temp.id, value: 22 }, { meterId: temp.id, value: 23 }]);
    expect([res.status, await codeOf(res)]).toEqual([400, 'DUPLICATE_METER']);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_readings WHERE company_id = ? AND meter_id = ?').bind(co, temp.id).first<{ n: number }>())!.n).toBe(before!.n);
    expect((await batch(Array.from({ length: 51 }, (_, i) => ({ meterId: `m${i}`, value: 1 })))).status).toBe(400);
    // Another company's meter is not found; the rest is saved.
    const other = await team('Mike');
    const theirAsset = await other.supervisor.json('POST', mt(other.co, '/assets'), { name: 'Their truck' });
    const theirMeter = await other.supervisor.json('POST', mt(other.co, '/meters'), { assetId: theirAsset.id, name: 'Odometer' });
    out = (await (await batch([{ meterId: theirMeter.id, value: 5 }, { meterId: temp.id, value: 24 }])).json()) as any;
    expect(out.results).toEqual([expect.objectContaining({ ok: false, status: 404 }), expect.objectContaining({ ok: true })]);
    expect((await other.supervisor.json('GET', mt(other.co, `/meters/${theirMeter.id}`))).meter.lastValue).toBeNull();
    // A reading that passes a meter interval makes its preventive work order, once.
    await supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: p.c1.id, name: 'Every 100 h', triggerKind: 'meter', meterId: c1Hours.id, meterInterval: 100 });
    out = (await (await batch([{ meterId: c1Hours.id, value: 120 }])).json()) as any;
    expect(out.results[0].generated).toHaveLength(1);
    expect(out.results[0].generated[0].number).toMatch(/^WO-/);
    out = (await (await batch([{ meterId: c1Hours.id, value: 130 }])).json()) as any;
    expect(out.results[0].generated).toEqual([]);
  });
});

describe('asset labels', () => {
  it('open the asset in the ERP, and old labels still work', async () => {
    const p = await plant('November');
    const { requester, co } = p;
    const res = await requester.req('GET', mt(co, `/assets/${p.m1.id}/qr`));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toMatch(/^image\/svg\+xml/);
    const address = `http://example.com/erp/c/${co}/maintenance/scan?code=M-1`;
    expect(await res.text()).toBe(qrSvg(address, 'M-1 Mill one'));
    expect(assetLabelText({}, 'x', 'A-1')).toBe('ASSET:A-1');
    expect(assetLabelText({ ENVIRONMENT: 'production', APP_URL: 'https://bizomat.ai/tasks', CANONICAL_URL: 'https://bizomat.ai/tasks' }, 'abc', 'A 1/2')).toBe('https://bizomat.ai/erp/c/abc/maintenance/scan?code=A%201%2F2');
    // An address that would not fit in a QR code falls back to the old label.
    expect(assetLabelText({ ENVIRONMENT: 'test', APP_URL: 'http://example.com' }, 'c'.repeat(200), 'A-1')).toBe('ASSET:A-1');
    expect(labelCode('asset:m-1', co)).toBe('m-1');
    expect(labelCode(`https://bizomat.ai/erp/c/${co}/maintenance/scan?code=M-1`, co)).toBe('M-1');
    expect(labelCode('https://bizomat.ai/erp/c/other/maintenance/scan?code=M-1', co)).toBeNull();
    expect(labelCode('https://example.org/some/page', co)).toBe('https://example.org/some/page');
    for (const code of ['ASSET:M-1', 'asset%3Am-1', 'M-1', encodeURIComponent(address)]) {
      expect((await requester.json('GET', mt(co, `/scan?code=${code.includes('%') ? code : encodeURIComponent(code)}`))).asset.number, code).toBe('M-1');
    }
    const elsewhere = await requester.req('GET', mt(co, `/scan?code=${encodeURIComponent(`http://example.com/erp/c/${p.co}x/maintenance/scan?code=M-1`)}`));
    expect(elsewhere.status).toBe(404);
    expect(((await elsewhere.json()) as any).error).toBe('This label is not for an asset of this company');
    expect((await requester.req('GET', mt(co, `/scan?code=${encodeURIComponent(`http://example.com/erp/c/${co}/maintenance/scan?code=`)}`))).status).toBe(400);
    expect((await requester.req('GET', mt(co, '/scan?code=https%3A%2F%2Fexample.org%2Fpage'))).status).toBe(404);
  });
});

describe('the example company', () => {
  it('gets a completed inspection round over three machines, and loses it on removal', async () => {
    const a = await signup('Round Example');
    const built = (await a.json('POST', '/api/system/demo', {})) as any;
    expect(built.status).toBe('ready');
    const co = built.companyId;
    const rounds = (await a.json('GET', mt(co, '/inspection-rounds?status=all'))).rounds as any[];
    expect(rounds).toHaveLength(1);
    expect(rounds[0]).toMatchObject({ assets: 3, completed: 3, percent: 100, exceptions: 1, awaitingApproval: 2, notApproved: 0, status: 'completed', assetNumber: 'AREA-02', templateName: 'Weekly machine guard round', description: 'Inspection round: Weekly machine guard round, 3 assets' });
    const r = await a.json('GET', mt(co, `/work-orders/${rounds[0].workOrderId}/round`));
    expect(r.round.totals).toEqual({ assets: 3, completed: 3, open: 0, passed: 2, failed: 1, percent: 100, questions: 9, answered: 9, exceptions: 1, approved: 1, notApproved: 0, awaitingApproval: 2 });
    expect(r.lines.map((l: any) => [l.assetNumber, l.status, l.review, l.followUp])).toEqual([
      ['MC-0104', 'passed', 'approved', null],
      ['MC-0107', 'failed', 'awaiting', null],
      ['UT-0201', 'passed', 'awaiting', null],
    ]);
    // The faded label is recorded only (the checklist makes no follow-up); the owner, alone, approved under the exception.
    const brake = await a.json('GET', mt(co, `/work-orders/${rounds[0].workOrderId}/round/lines/${r.lines[1].id}`));
    expect(brake.results.find((x: any) => x.label === 'Warning labels readable')).toMatchObject({ passed: false, note: 'Label on the rear guard has faded' });
    const approved = await env.DB.prepare("SELECT summary FROM mt_events WHERE company_id = ? AND action = 'round.approved'").bind(co).first<{ summary: string }>();
    expect(approved!.summary).toContain('segregation exception');
    const wo = await a.json('GET', mt(co, `/work-orders/${rounds[0].workOrderId}`));
    expect(wo.workOrder).toMatchObject({ status: 'completed', completionNotes: 'Round done. The press brake rear guard label needs replacing.' });
    // The earlier figures stay as they were.
    const overview = await a.json('GET', mt(co, '/overview'));
    expect(overview.assets).toBe(7);
    expect(overview.openWorkOrders).toBe(2);
    expect(overview.openRequests).toBeGreaterThanOrEqual(2);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM erp_alerts WHERE company_id = ?').bind(co).first<{ n: number }>())!.n).toBe(0);

    expect((await a.req('POST', '/api/system/demo/remove', {})).status).toBe(200);
    const left = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM mt_rounds WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_round_assets WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_round_results WHERE company_id = ?1) AS n').bind(co).first<{ n: number }>();
    expect(left!.n).toBe(0);
  });
});

// The review of the field release. The losing order of a race is reproduced with a trigger: the competing change lands
// inside the transaction it races, after the reads that transaction made first.
async function withTrigger(name: string, sql: string, fn: () => Promise<void>) {
  await env.DB.prepare(sql).run();
  try {
    await fn();
  } finally {
    await env.DB.prepare(`DROP TRIGGER IF EXISTS ${name}`).run();
  }
}

describe('the review of the field release: rounds and readings', () => {
  it('never completes a round whose asset was opened again after the check, and keeps nothing of that completion', async () => {
    const p = await plant('Round Race');
    const { workOrder: w } = await round(p, [{ assetId: p.m1.id }]);
    const m1 = await lineOf(p.tech, p.co, w.id, 'M-1');
    await passLine(p.tech, p, w.id, m1.id);
    // Marked not approved at the moment the work order is completed: the asset is open again inside its transaction.
    await withTrigger(
      't_round_race',
      `CREATE TRIGGER t_round_race AFTER UPDATE OF status ON mt_work_orders WHEN NEW.id = '${w.id}' AND NEW.status = 'completed'
       BEGIN UPDATE mt_round_assets SET status = 'open', attempt = attempt + 1 WHERE company_id = '${p.co}' AND work_order_id = '${w.id}'; END`,
      async () => {
        const res = await p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/complete`), { notes: 'Round done' });
        expect(res.status).toBe(409);
      },
    );
    const after = await p.tech.json('GET', mt(p.co, `/work-orders/${w.id}`));
    expect(after.workOrder.status).not.toBe('completed');
    expect(after.history.filter((e: any) => e.action === 'work_order.completed')).toEqual([]);
    // With an asset really open, the answer says which.
    await env.DB.prepare("UPDATE mt_round_assets SET status = 'open' WHERE company_id = ? AND work_order_id = ?").bind(p.co, w.id).run();
    const open = await p.tech.req('POST', mt(p.co, `/work-orders/${w.id}/complete`), { notes: 'Round done' });
    expect([open.status, await codeOf(open)]).toEqual([409, 'ROUND_INCOMPLETE']);
  });

  it('adds no asset to a round whose work order was completed after it was read', async () => {
    const p = await plant('Round Add');
    const { workOrder: w } = await round(p, [{ assetId: p.m1.id }]);
    await withTrigger(
      't_round_add',
      `CREATE TRIGGER t_round_add AFTER INSERT ON mt_round_assets WHEN NEW.work_order_id = '${w.id}'
       BEGIN UPDATE mt_work_orders SET status = 'completed' WHERE company_id = '${p.co}' AND id = '${w.id}'; END`,
      async () => {
        const res = await p.supervisor.req('POST', mt(p.co, `/work-orders/${w.id}/round/assets`), { assets: [{ assetId: p.m2.id }, { assetId: p.c1.id }] });
        expect([res.status, await codeOf(res)]).toEqual([409, 'ROUND_LOCKED']);
      },
    );
    expect(numbers(await p.supervisor.json('GET', mt(p.co, `/work-orders/${w.id}/round`)))).toEqual(['M-1']);
    const added = await env.DB.prepare("SELECT COUNT(*) AS n FROM mt_events WHERE company_id = ? AND work_order_id = ? AND action = 'round.assets_added'").bind(p.co, w.id).first<{ n: number }>();
    expect(added!.n).toBe(0);
  });

  it('reports a saved reading as saved when making its preventive work fails, and the next run makes it', async () => {
    const p = await plant('Reading PM');
    const { supervisor, requester, co } = p;
    const hours = await supervisor.json('POST', mt(co, '/meters'), { assetId: p.c1.id, name: 'Run hours', unit: 'h' });
    await supervisor.json('POST', mt(co, '/pm/schedules'), { assetId: p.c1.id, name: 'Every 100 h', triggerKind: 'meter', meterId: hours.id, meterInterval: 100 });
    const readings = async () => (await env.DB.prepare('SELECT COUNT(*) AS n FROM mt_readings WHERE company_id = ? AND meter_id = ?').bind(co, hours.id).first<{ n: number }>())!.n;
    // Making the work order fails with a database error that is not a duplicate.
    await withTrigger('t_reading_pm', `CREATE TRIGGER t_reading_pm BEFORE INSERT ON mt_work_orders WHEN NEW.company_id = '${co}' BEGIN SELECT json('not json'); END`, async () => {
      const res = await requester.req('POST', mt(co, '/readings/batch'), { entries: [{ meterId: hours.id, value: 120 }], today: today() });
      expect(res.status).toBe(200);
      const out = (await res.json()) as any;
      expect(out).toMatchObject({ saved: 1, failed: 0 });
      expect(out.results[0]).toMatchObject({ ok: true, generated: [], pmPending: true, reading: { value: 120, total: 120 } });
      const one = await requester.req('POST', mt(co, `/meters/${hours.id}/readings`), { value: 125, today: today() });
      expect(one.status).toBe(201);
      expect(await one.json()).toMatchObject({ generated: [], pmPending: true });
    });
    expect(await readings()).toBe(2);
    const out = (await (await requester.req('POST', mt(co, '/readings/batch'), { entries: [{ meterId: hours.id, value: 130 }], today: today() })).json()) as any;
    expect(out.results[0]).toMatchObject({ ok: true, pmPending: false });
    expect(out.results[0].generated).toHaveLength(1);
  });

  it('names each checklist field after its item, and keeps the answers on screen when completing an asset fails', () => {
    // The phone screen (src/client/system/maintenance/Rounds.tsx): no DOM here, so its source is checked.
    expect(roundsSrc).toContain('<span className="sr-only">{i.label}: </span>{i.unit ?');
    expect(roundsSrc).toContain('<span className="sr-only">{i.label}: </span>Notes');
    expect(roundsSrc).toContain('What is wrong<span className="sr-only"> with {i.label}</span>?');
    expect(roundsSrc).toMatch(/const r = await post<Completed>\([^)]*\/complete`\), \{\}\);\s*setAnswers\(\{\}\);\s*setDone\(r\);/);
    expect(roundsSrc).toMatch(/\} finally \{\s*await refresh\(\);\s*setBusy\(false\);/);
  });
});
