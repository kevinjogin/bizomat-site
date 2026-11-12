// Project controls through the API: permanent task keys, scheduling data, dependencies, the critical path, calendars,
// approved baselines (immutable), progress and cost records, earned value, the controls summary and permissions.

import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup, signupWith, uniqueEmail, type Client } from './helpers';

async function project(owner: Client, name = 'Laser installation') {
  const b = await createBoard(owner, name);
  const boardId = b.board.id as string;
  const groupId = b.groups[0].id as string;
  const tl = await owner.json('POST', `/api/boards/${boardId}/columns`, { title: 'Plan', type: 'timeline' });
  await owner.json('PATCH', `/api/boards/${boardId}/project`, { currency: 'AUD' });
  const budget = await owner.json('POST', `/api/boards/${boardId}/columns`, { title: 'Budget', type: 'currency', settings: { currencyMode: 'inherit', financeRole: 'approved_budget' } });
  const add = async (n: string, start: string, end: string, cost?: number) =>
    (await owner.json('POST', `/api/boards/${boardId}/items`, { name: n, groupId, values: { [tl.id]: { start, end }, ...(cost != null ? { [budget.id]: cost } : {}) } })) as { id: string; key: string };
  return { boardId, groupId, tl, budget, add };
}

const sched = (c: Client, boardId: string, status = '2026-11-02') => c.json('GET', `/api/boards/${boardId}/schedule?statusDate=${status}`);

describe('permanent task keys', () => {
  it('numbers tasks with the project prefix, never changes or reuses a key', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    const a = await p.add('Site preparation', '2026-11-02', '2026-11-04');
    const b = await p.add('Electrical installation', '2026-11-05', '2026-11-10');
    expect(a.key).toBe('LASER-0001');
    expect(b.key).toBe('LASER-0002');
    await o.json('PATCH', `/api/items/${a.id}`, { name: 'Site preparation and survey' });
    const bundle = await o.json('GET', `/api/boards/${p.boardId}`);
    expect(bundle.items.find((i: any) => i.id === a.id).key).toBe('LASER-0001');
    await o.json('DELETE', `/api/items/${b.id}`);
    const c = await p.add('Compressed air', '2026-11-11', '2026-11-12');
    expect(c.key).toBe('LASER-0003');
    // Search by key.
    const found = await o.json('POST', `/api/workspaces/${o.workspaceId}/search`, { q: 'LASER-0003' });
    expect(JSON.stringify(found)).toContain(c.id);
  });

  it('gives every task a unique key when many are created at once', async () => {
    const o = await signup('Owner');
    const p = await project(o, 'Parallel work');
    const created = await Promise.all(Array.from({ length: 20 }, (_, i) => p.add(`T${i}`, '2026-11-02', '2026-11-03')));
    const keys = created.map((x) => x.key);
    expect(new Set(keys).size).toBe(20);
    expect(keys.every((k) => /^PARALL-\d{4}$/.test(k))).toBe(true);
  });

  it('gives keys to tasks that existed before keys, oldest first, and lets the manager change the prefix for new tasks', async () => {
    const o = await signup('Owner');
    const p = await project(o, 'Old project');
    const a = await p.add('First', '2026-11-02', '2026-11-03');
    await env.DB.prepare('UPDATE items SET task_key = NULL, task_number = NULL WHERE board_id = ?').bind(p.boardId).run();
    const bundle = await o.json('GET', `/api/boards/${p.boardId}`);
    expect(bundle.items.find((i: any) => i.id === a.id).key).toMatch(/^OLD-\d{4}$/);
    await o.json('PUT', `/api/boards/${p.boardId}/schedule/settings`, { prefix: 'OP' });
    const n = await p.add('Next', '2026-11-04', '2026-11-05');
    expect(n.key).toMatch(/^OP-\d{4}$/);
    expect((await o.req('PUT', `/api/boards/${p.boardId}/schedule/settings`, { prefix: 'bad prefix' })).status).toBe(400);
    const other = await project(o, 'Another');
    expect((await o.req('PUT', `/api/boards/${other.boardId}/schedule/settings`, { prefix: 'OP' })).status).toBe(409);
  });
});

describe('scheduling, dependencies and the critical path', () => {
  it('calculates the critical path from typed links on the working calendar', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    // A 3d (Mon 2 - Wed 4 Nov), B 4d, C 2d, D 5d: A->B, A->C, B->D, C->D (finish to start).
    const A = await p.add('A', '2026-11-02', '2026-11-04');
    const B = await p.add('B', '2026-11-05', '2026-11-10');
    const C = await p.add('C', '2026-11-05', '2026-11-06');
    const D = await p.add('D', '2026-11-11', '2026-11-17');
    for (const [x, y] of [[A, B], [A, C], [B, D], [C, D]]) expect((await o.req('POST', `/api/boards/${p.boardId}/links`, { predecessorId: x.id, successorId: y.id })).status).toBe(201);
    const s = await sched(o, p.boardId);
    const t = (id: string) => s.tasks.find((x: any) => x.itemId === id);
    expect(s.summary.valid).toBe(true);
    expect(s.summary.projectStart).toBe('2026-11-02');
    expect(s.summary.projectFinish).toBe('2026-11-17');
    expect(s.summary.criticalDurationDays).toBe(12);
    expect([t(A.id).criticality, t(B.id).criticality, t(C.id).criticality, t(D.id).criticality]).toEqual(['critical', 'critical', 'near_critical', 'critical']);
    expect(t(C.id).totalFloatDays).toBe(2);
    expect(t(C.id).lateFinish).toBe('2026-11-10');
    expect(t(A.id).wbs).toBe('1.1');
    expect(t(A.id).key).toBe('LASER-0001');
    expect(s.summary.criticalPaths).toEqual([[A.id, B.id, D.id]]);
    // A lag pushes the network; the planned dates then conflict with the links.
    const link = (await o.json('GET', `/api/items/${B.id}/schedule`)).links.find((l: any) => l.predecessorId === A.id);
    await o.json('PATCH', `/api/links/${link.id}`, { type: 'FS', lag: 2, lagUnit: 'days' });
    const s2 = await sched(o, p.boardId);
    expect(s2.tasks.find((x: any) => x.itemId === B.id).earlyStart).toBe('2026-11-09');
    expect(s2.warnings.some((w: any) => w.code === 'date_conflict' && w.itemIds.includes(B.id))).toBe(true);
    // Applying writes the calculated dates into the plan.
    const applied = await o.json('POST', `/api/boards/${p.boardId}/schedule/apply`, { statusDate: '2026-11-02' });
    expect(applied.updated).toBeGreaterThan(0);
    const s3 = await sched(o, p.boardId);
    expect(s3.tasks.find((x: any) => x.itemId === B.id).plannedStart).toBe('2026-11-09');
    expect(s3.warnings.some((w: any) => w.code === 'date_conflict')).toBe(false);
  });

  it('refuses self links, duplicates and loops; summary-task links; and reads the Dependency column as finish to start', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    const A = await p.add('A', '2026-11-02', '2026-11-03');
    const B = await p.add('B', '2026-11-04', '2026-11-05');
    const C = await p.add('C', '2026-11-06', '2026-11-09');
    expect((await o.req('POST', `/api/boards/${p.boardId}/links`, { predecessorId: A.id, successorId: A.id })).status).toBe(400);
    await o.json('POST', `/api/boards/${p.boardId}/links`, { predecessorId: A.id, successorId: B.id });
    expect((await o.req('POST', `/api/boards/${p.boardId}/links`, { predecessorId: A.id, successorId: B.id })).status).toBe(409);
    await o.json('POST', `/api/boards/${p.boardId}/links`, { predecessorId: B.id, successorId: C.id, type: 'SS', lag: 1 });
    const loop = await o.req('POST', `/api/boards/${p.boardId}/links`, { predecessorId: C.id, successorId: A.id });
    expect(loop.status).toBe(400);
    expect((await loop.json<{ error: string }>()).error).toMatch(/loop: LASER-0003 → LASER-0001 → LASER-0002 → LASER-0003/);
    // A loop already in the Dependency column is reported, and the schedule is not calculated.
    const dep = await o.json('POST', `/api/boards/${p.boardId}/columns`, { title: 'Depends on', type: 'dependency' });
    await o.json('PATCH', `/api/items/${A.id}`, { values: { [dep.id]: [C.id] } });
    const s = await sched(o, p.boardId);
    expect(s.summary.valid).toBe(false);
    expect(s.warnings.find((w: any) => w.code === 'cycle').message).toMatch(/Dependency loop/);
    expect(s.links.find((l: any) => l.source === 'column')).toMatchObject({ predecessorId: C.id, successorId: A.id, type: 'FS' });
  });

  it('accepts durations or dates, keeps them consistent, and records milestones and constraints', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    const A = await p.add('A', '2026-11-02', '2026-11-04');
    await o.json('PATCH', `/api/items/${A.id}/schedule`, { duration: 5, durationUnit: 'days', applyDuration: true });
    let s = await sched(o, p.boardId);
    expect(s.tasks[0]).toMatchObject({ plannedStart: '2026-11-02', plannedFinish: '2026-11-06', durationDays: 5, elapsedDays: 5 });
    await o.json('PATCH', `/api/items/${A.id}/schedule`, { duration: 2, durationUnit: 'weeks', applyDuration: true });
    s = await sched(o, p.boardId);
    expect(s.tasks[0]).toMatchObject({ plannedFinish: '2026-11-13', durationDays: 10, elapsedDays: 12 });
    expect((await o.req('PATCH', `/api/items/${A.id}/schedule`, { duration: 3 })).status).toBe(400); // does not fit the dates
    const M = await p.add('Handover', '2026-11-20', '2026-11-20');
    await o.json('PATCH', `/api/items/${M.id}/schedule`, { milestone: true, constraintType: 'MFO', constraintDate: '2026-11-20' });
    s = await sched(o, p.boardId);
    const m = s.tasks.find((x: any) => x.itemId === M.id);
    expect(m.milestone).toBe(true);
    expect(m.durationDays).toBe(0);
    expect((await o.req('PATCH', `/api/items/${M.id}/schedule`, { constraintType: 'SNET', constraintDate: null })).status).toBe(400);
    expect((await o.req('PATCH', `/api/items/${A.id}/schedule`, { actualStart: '2026-11-03', actualFinish: '2026-11-02' })).status).toBe(400);
  });

  it('uses the project calendar: holidays move finish dates', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    const A = await p.add('A', '2026-11-02', '2026-11-04');
    const B = await p.add('B', '2026-11-05', '2026-11-10');
    await o.json('POST', `/api/boards/${p.boardId}/links`, { predecessorId: A.id, successorId: B.id });
    await o.json('PATCH', `/api/items/${B.id}/schedule`, { duration: 4, durationUnit: 'days' });
    const cal = await o.json('GET', `/api/boards/${p.boardId}/schedule/calendar`);
    expect(cal.scope).toBe('default');
    expect(cal.hoursPerDay).toBe(8);
    const bad = await o.req('PUT', `/api/boards/${p.boardId}/schedule/calendar`, { scope: 'project', calendar: { ...cal.calendar, workingDays: [] } });
    expect(bad.status).toBe(400);
    await o.json('PUT', `/api/boards/${p.boardId}/schedule/calendar`, { scope: 'project', calendar: { ...cal.calendar, timezone: 'Australia/Sydney', exceptions: [{ start: '2026-11-09', end: '2026-11-09', name: 'Public holiday', working: false, kind: 'holiday' }] } });
    const s = await sched(o, p.boardId);
    expect(s.calendarScope).toBe('project');
    // B's planned dates now span a holiday: 3 working days in 5-10 Nov; the stored 4-day duration does not fit them, so the dates win.
    expect(s.tasks.find((x: any) => x.itemId === B.id).durationDays).toBe(3);
  });
});

describe('baselines and earned value', () => {
  it('approves immutable baselines, keeps the original, compares, and calculates earned value from dated records', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    // One task: 10 working days (Mon 2 - Fri 13 Nov), budget 100,000 AUD.
    const A = await p.add('Machine installation', '2026-11-02', '2026-11-13', 100000);
    expect((await o.req('POST', `/api/boards/${p.boardId}/baselines`, { name: 'Original', approvedBy: 'Project sponsor', approvedOn: '2026-10-30' })).status).toBe(201);
    const list = await o.json('GET', `/api/boards/${p.boardId}/baselines`);
    expect(list.baselines[0]).toMatchObject({ number: 0, name: 'Original', bac: '100000.0000', currency: 'AUD', projectFinish: '2026-11-13' });
    // No route changes or deletes an approved baseline (the server code has no UPDATE or DELETE on them either:
    // test-node/baselines-insert-only.test.ts).
    for (const method of ['PATCH', 'PUT', 'DELETE']) {
      expect((await o.req(method, `/api/boards/${p.boardId}/baselines/${list.baselines[0].id}`, { name: 'changed' })).status).toBe(404);
    }
    // Progress and cost: 40% by Fri 6 Nov, costs 30,000 + 15,000 then 5,000 after the status date.
    await o.json('POST', `/api/items/${A.id}/progress`, { asOf: '2026-11-06', percentComplete: 40 });
    await o.json('POST', `/api/items/${A.id}/costs`, { spentOn: '2026-11-03', amount: '30000', category: 'Labour' });
    await o.json('POST', `/api/items/${A.id}/costs`, { spentOn: '2026-11-06', amount: 15000, category: 'Materials' });
    await o.json('POST', `/api/items/${A.id}/costs`, { spentOn: '2026-11-09', amount: '5000', category: 'Labour' });
    const ev = await o.json('GET', `/api/boards/${p.boardId}/evm?statusDate=2026-11-06`);
    expect(ev.available).toBe(true);
    expect(ev.baseline.number).toBe(0);
    expect(ev.currency).toBe('AUD');
    // Status Fri 6 Nov end of day: 5 of 10 working days -> PV 50,000; EV 40,000; AC 45,000 (the 9 Nov cost is later).
    expect(ev.metrics).toMatchObject({ bac: '100000.00', pv: '50000.00', ev: '40000.00', ac: '45000.00', cv: '-5000.00', sv: '-10000.00', cpi: 0.8889, spi: 0.8, cpiStatus: 'below', spiStatus: 'below' });
    expect(ev.metrics.eac).toEqual({ cpi: '112500.00', budget: '105000.00', cpiSpi: '129375.00' });
    expect(ev.metrics.etc.cpi).toBe('67500.00');
    expect(ev.metrics.vac.cpi).toBe('-12500.00');
    expect(ev.metrics.tcpiBac).toBe(1.0909);
    expect(ev.tasks[0]).toMatchObject({ key: 'LASER-0001', plannedPercent: 50, earnedPercent: 40 });
    expect(ev.costByCategory).toEqual(expect.arrayContaining([{ category: 'Labour', amount: '30000.00' }, { category: 'Materials', amount: '15000.00' }]));
    expect(ev.trend.at(-1)).toMatchObject({ date: '2026-11-06', pv: '50000.00', ev: '40000.00', ac: '45000.00' });
    // An earlier status date uses the records known then: no progress yet, cost 30,000.
    const early = await o.json('GET', `/api/boards/${p.boardId}/evm?statusDate=2026-11-03`);
    expect(early.metrics).toMatchObject({ ev: '0.00', ac: '30000.00', cpi: 0 });
    expect(early.metrics.eac.cpi).toBeNull();
    // A revised baseline needs a reason; the original stays.
    expect((await o.req('POST', `/api/boards/${p.boardId}/baselines`, { name: 'Recovery plan', approvedBy: 'Sponsor', approvedOn: '2026-11-06' })).status).toBe(400);
    await o.json('PATCH', `/api/items/${A.id}`, { values: { [p.tl.id]: { start: '2026-11-02', end: '2026-11-20' } } });
    await o.json('POST', `/api/boards/${p.boardId}/baselines`, { name: 'Recovery plan', approvedBy: 'Sponsor', approvedOn: '2026-11-06', reason: 'Late delivery of the machine' });
    const cmp = await o.json('GET', `/api/boards/${p.boardId}/baselines/compare?statusDate=2026-11-06`);
    expect(cmp.baseline.number).toBe(1);
    expect(cmp.original).toMatchObject({ number: 0, projectFinish: '2026-11-13', finishVarianceDays: 5 });
    const orig = await o.json('GET', `/api/boards/${p.boardId}/baselines/compare?statusDate=2026-11-06&baseline=${list.baselines[0].id}`);
    expect(orig.rows[0]).toMatchObject({ key: 'LASER-0001', baselineFinish: '2026-11-13', currentFinish: '2026-11-20', finishVarianceDays: 5, startVarianceDays: 0 });
    const all = await o.json('GET', `/api/boards/${p.boardId}/baselines`);
    expect(all.baselines.map((b: any) => b.number)).toEqual([0, 1]);
    expect(all.baselines[1].previousBaselineId).toBe(all.baselines[0].id);
    // The controls summary combines it.
    const ctl = await o.json('GET', `/api/boards/${p.boardId}/controls?statusDate=2026-11-06`);
    expect(ctl.baseline.number).toBe(1);
    expect(ctl.evm.cpi).not.toBeUndefined();
    expect(ctl.forecastFinish).toBe('2026-11-20');
  });

  it('says why earned value is unavailable instead of inventing numbers', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    await p.add('A', '2026-11-02', '2026-11-13', 1000);
    const none = await o.json('GET', `/api/boards/${p.boardId}/evm`);
    expect(none).toMatchObject({ available: false });
    expect(none.reason).toMatch(/baseline/);
    await o.json('POST', `/api/boards/${p.boardId}/baselines`, { name: 'Original', approvedBy: 'Sponsor', approvedOn: '2026-10-30' });
    const ev = await o.json('GET', `/api/boards/${p.boardId}/evm?statusDate=2026-11-06`);
    expect(ev.metrics.ac).toBeNull();
    expect(ev.metrics.cpi).toBeNull();
    expect(ev.warnings.join(' ')).toMatch(/No actual cost is recorded/);
  });
});

describe('permissions', () => {
  it('viewers read the schedule but cannot change it; finance stays hidden without finance rights', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    const A = await p.add('A', '2026-11-02', '2026-11-04', 500);
    const B = await p.add('B', '2026-11-05', '2026-11-06');
    await o.json('POST', `/api/boards/${p.boardId}/baselines`, { name: 'Original', approvedBy: 'Sponsor', approvedOn: '2026-10-30' });
    const v = await signup('Viewer');
    await addMember(o, v, 'viewer');
    expect((await v.req('GET', `/api/boards/${p.boardId}/schedule`)).status).toBe(200);
    expect((await v.req('POST', `/api/boards/${p.boardId}/links`, { predecessorId: A.id, successorId: B.id })).status).toBe(403);
    expect((await v.req('PATCH', `/api/items/${A.id}/schedule`, { milestone: true })).status).toBe(403);
    expect((await v.req('POST', `/api/boards/${p.boardId}/baselines`, { name: 'x', approvedBy: 'x', approvedOn: '2026-11-01' })).status).toBe(403);
    expect((await v.req('PUT', `/api/boards/${p.boardId}/schedule/settings`, { criticalDays: 1 })).status).toBe(403);
    expect((await v.req('POST', `/api/items/${A.id}/costs`, { spentOn: '2026-11-02', amount: 10 })).status).toBe(403);
    const m = await signup('Member');
    await addMember(o, m, 'member');
    // The organisation shows finances to project managers only.
    await o.json('PUT', `/api/workspaces/${o.workspaceId}/finance`, { visibility: 'managers' });
    // So members cannot see finances: earned value is refused and baselines hide money.
    const evRes = await m.req('GET', `/api/boards/${p.boardId}/evm`);
    expect(evRes.status).toBe(403);
    const bl = await m.json('GET', `/api/boards/${p.boardId}/baselines`);
    expect(bl.baselines[0].bac).toBeNull();
    const ctl = await m.json('GET', `/api/boards/${p.boardId}/controls`);
    expect(ctl.evm).toBeNull();
    expect(ctl.evmReason).toMatch(/finances/);
    // Someone outside the organisation sees nothing.
    const x = await signup('Outsider');
    expect((await x.req('GET', `/api/boards/${p.boardId}/schedule`)).status).toBe(404);
    expect((await x.req('GET', `/api/items/${A.id}/schedule`)).status).toBe(404);
  });
});

describe('fixes from review', () => {
  it('a task marked done without actual dates keeps its planned finish (and baselines record the plan)', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    const status = (await o.json('GET', `/api/boards/${p.boardId}`)).columns.find((c: any) => c.type === 'status');
    const done = status.settings.labels.find((l: any) => l.done).id;
    const A = await p.add('A', '2026-10-26', '2026-10-30');
    const B = await p.add('B', '2026-11-02', '2026-11-04');
    const C = await p.add('C', '2026-11-06', '2026-11-12');
    await o.json('POST', `/api/boards/${p.boardId}/links`, { predecessorId: B.id, successorId: C.id, lag: 1 });
    for (const x of [A, B]) await o.json('PATCH', `/api/items/${x.id}`, { values: { [status.id]: done } });
    await o.json('POST', `/api/boards/${p.boardId}/baselines`, { name: 'Original', approvedBy: 'Sponsor', approvedOn: '2026-10-25' });
    const cmp = await o.json('GET', `/api/boards/${p.boardId}/baselines/compare`);
    const row = (id: string) => cmp.rows.find((r: any) => r.itemId === id);
    expect(row(A.id)).toMatchObject({ baselineStart: '2026-10-26', baselineFinish: '2026-10-30' });
    expect(row(B.id).baselineFinish).toBe('2026-11-04');
    // C follows B's planned finish (4 Nov) and the 1-day lag, not the day B was marked done.
    expect(row(C.id).baselineStart).toBe('2026-11-06');
  });

  it('someone with access to one task sees the names of linked tasks only', async () => {
    const o = await signup('Owner');
    const p = await project(o);
    const A = await p.add('A', '2026-11-02', '2026-11-04');
    const B = await p.add('B', '2026-11-05', '2026-11-06');
    const secret = await p.add('Confidential negotiation', '2026-11-09', '2026-11-10');
    await o.json('POST', `/api/boards/${p.boardId}/links`, { predecessorId: A.id, successorId: B.id });
    const email = uniqueEmail('contractor');
    const inv = await o.json('POST', `/api/workspaces/${o.workspaceId}/invitations`, { email, role: 'guest' });
    const contractor = await signupWith('Contractor', email, inv.inviteUrl.split('/invite/')[1]);
    await o.json('PUT', `/api/items/${B.id}/access/${contractor.userId}`, { canUpdateStatus: true });
    const got = await contractor.json('GET', `/api/items/${B.id}/schedule`);
    expect(Object.keys(got.names).sort()).toEqual([A.id, B.id].sort());
    expect(JSON.stringify(got)).not.toContain('Confidential negotiation');
    expect(JSON.stringify(got)).not.toContain(secret.id);
    expect((await contractor.req('GET', `/api/boards/${p.boardId}/schedule`)).status).toBe(404);
  });
});
