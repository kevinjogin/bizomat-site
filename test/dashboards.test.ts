import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup } from './helpers';

const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);

describe('dashboards show accurate data (critical test 11)', () => {
  it('computes every widget from real board data', async () => {
    const c = await signup('Dash Owner');
    const mate = await signup('Mate');
    await addMember(c, mate);
    const b = await createBoard(c, 'Data board');
    const [person, status, due, priority] = b.columns;
    const effort = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Effort', type: 'number' });
    const rows = [
      { name: 'A', [status.id]: 'done', [priority.id]: 'high', [person.id]: c.userId, [effort.id]: 5, [due.id]: iso(-3) },
      { name: 'B', [status.id]: 'done', [priority.id]: 'low', [person.id]: mate.userId, [effort.id]: 3 },
      { name: 'C', [status.id]: 'working', [priority.id]: 'high', [person.id]: mate.userId, [effort.id]: 2, [due.id]: iso(-1) },
      { name: 'D', [status.id]: 'stuck', [person.id]: mate.userId, [effort.id]: 10, [due.id]: iso(2) },
      { name: 'E', [due.id]: iso(20) },
    ];
    for (const { name, ...values } of rows) await c.json('POST', `/api/boards/${b.board.id}/items`, { name, values, groupId: b.groups[0].id });
    // An archived item must be excluded everywhere.
    const arch = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Archived', values: { [status.id]: 'done' } });
    await c.json('POST', `/api/items/${arch.id}/archive`, {});
    // Time tracking
    const items = (await c.json('GET', `/api/boards/${b.board.id}`)).items;
    await c.json('POST', `/api/items/${items[0].id}/time`, { minutes: 90, date: iso(0) });

    const dash = await c.json('POST', `/api/workspaces/${c.workspaceId}/dashboards`, { name: 'Ops', boardIds: [b.board.id] });
    const d = await c.json('GET', `/api/dashboards/${dash.id}`);
    const add = async (type: string, config: any = {}) => (await c.json('POST', `/api/dashboards/${dash.id}/widgets`, { type, title: type, config })).id;
    const ids = {
      count: await add('number'),
      sum: await add('number', { metric: { kind: 'sum', columnId: effort.id } }),
      avg: await add('number', { metric: { kind: 'avg', columnId: effort.id } }),
      openCount: d.widgets.find((w: any) => w.title === 'Open items').id,
      completion: await add('completion'),
      status: await add('status'),
      priority: await add('priority'),
      workload: await add('workload'),
      overdue: await add('overdue'),
      upcoming: await add('upcoming', { days: 7 }),
      progress: await add('progress'),
      chart: await add('chart', { groupBy: 'person', metric: { kind: 'sum', columnId: effort.id } }),
      filtered: await add('number', { filter: { op: 'and', rules: [{ field: priority.id, op: 'is', value: 'high' }] } }),
      activity: await add('activity', { limit: 5 }),
      time: await add('time', { dateRange: { preset: 'last_7' } }),
    };
    const data = (await c.json('GET', `/api/dashboards/${dash.id}/data`)).widgets;
    expect(data[ids.count]).toEqual({ value: 5, count: 5 });
    expect(data[ids.sum].value).toBe(20);
    expect(data[ids.avg].value).toBe(5);
    expect(data[ids.openCount].value).toBe(3);
    expect(data[ids.completion]).toEqual({ done: 2, total: 5, percent: 40 });
    const seg = (w: string) => Object.fromEntries(data[w].segments.map((s: any) => [s.label, s.value]));
    expect(seg(ids.status)).toEqual({ Done: 2, 'Working on it': 1, Stuck: 1, Empty: 1 });
    expect(seg(ids.priority)).toEqual({ High: 2, Low: 1, Empty: 2 });
    expect(seg(ids.workload)).toEqual({ Mate: 2, Unassigned: 1 });
    expect(data[ids.overdue].count).toBe(1);
    expect(data[ids.overdue].items[0].name).toBe('C');
    expect(data[ids.upcoming].items.map((i: any) => i.name)).toEqual(['D']);
    expect(data[ids.progress].boards).toEqual([{ id: b.board.id, name: 'Data board', done: 2, total: 5, percent: 40 }]);
    expect(seg(ids.chart)).toEqual({ 'Dash Owner': 5, Mate: 15, Unassigned: 0 });
    expect(data[ids.filtered].value).toBe(2);
    expect(data[ids.activity].events.length).toBe(5);
    expect(data[ids.time].totalHours).toBe(1.5);

    // Data reacts to edits immediately.
    const e = items.find((i: any) => i.name === 'E');
    await c.json('PATCH', `/api/items/${e.id}`, { values: { [status.id]: 'done' } });
    const after = (await c.json('GET', `/api/dashboards/${dash.id}/data`)).widgets;
    expect(after[ids.completion]).toEqual({ done: 3, total: 5, percent: 60 });
  });

  it('viewers only see data from boards they can access', async () => {
    const owner = await signup('Owner');
    const member = await signup('Member');
    await addMember(owner, member);
    const pub = await createBoard(owner, 'Public');
    const priv = await createBoard(owner, 'Private', { visibility: 'private' });
    await owner.json('POST', `/api/boards/${pub.board.id}/items`, { name: 'p1' });
    for (const n of ['s1', 's2', 's3']) await owner.json('POST', `/api/boards/${priv.board.id}/items`, { name: n });
    const dash = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/dashboards`, { name: 'All', boardIds: [pub.board.id, priv.board.id] });
    const w = await owner.json('POST', `/api/dashboards/${dash.id}/widgets`, { type: 'number', title: 'Count' });
    const ownerData = await owner.json('GET', `/api/dashboards/${dash.id}/data`);
    expect(ownerData.widgets[w.id].value).toBe(4);
    const memberData = await member.json('GET', `/api/dashboards/${dash.id}/data`);
    expect(memberData.widgets[w.id].value).toBe(1);
    expect(memberData.boardIds).toEqual([pub.board.id]);
    expect(JSON.stringify(memberData)).not.toContain('Private');
  });

  it('dashboard CRUD: duplicate, resize, reorder, remove widgets, archive, delete', async () => {
    const c = await signup();
    const dash = await c.json('POST', `/api/workspaces/${c.workspaceId}/dashboards`, { name: 'D', withDefaultWidgets: false });
    const w1 = await c.json('POST', `/api/dashboards/${dash.id}/widgets`, { type: 'number', title: 'one' });
    const w2 = await c.json('POST', `/api/dashboards/${dash.id}/widgets`, { type: 'status', title: 'two', w: 2, h: 2 });
    await c.json('PATCH', `/api/widgets/${w1.id}`, { w: 3, h: 2, position: w2.position + 1 });
    let got = await c.json('GET', `/api/dashboards/${dash.id}`);
    expect(got.widgets.map((x: any) => x.title)).toEqual(['two', 'one']);
    expect(got.widgets[1]).toMatchObject({ w: 3, h: 2 });
    expect((await c.req('POST', `/api/dashboards/${dash.id}/widgets`, { type: 'bogus', title: 'x' })).status).toBe(400);
    const dup = await c.json('POST', `/api/dashboards/${dash.id}/duplicate`, {});
    expect((await c.json('GET', `/api/dashboards/${dup.id}`)).widgets).toHaveLength(2);
    await c.json('DELETE', `/api/widgets/${w2.id}`, {});
    got = await c.json('GET', `/api/dashboards/${dash.id}`);
    expect(got.widgets).toHaveLength(1);
    await c.json('POST', `/api/dashboards/${dash.id}/archive`, { archived: true });
    expect((await c.json('GET', `/api/workspaces/${c.workspaceId}/dashboards`)).map((x: any) => x.id)).not.toContain(dash.id);
    await c.json('DELETE', `/api/dashboards/${dash.id}`, {});
    expect((await c.req('GET', `/api/dashboards/${dash.id}`)).status).toBe(404);
  });
});

describe('goals', () => {
  it('manual and board-linked progress', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const status = b.columns[1];
    const i1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'a' });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'b' });
    const manual = await c.json('POST', `/api/workspaces/${c.workspaceId}/goals`, { title: 'Revenue', startValue: 0, targetValue: 200, currentValue: 50, unit: 'k$' });
    expect(manual.progress.percent).toBe(25);
    const linked = await c.json('POST', `/api/workspaces/${c.workspaceId}/goals`, { title: 'Ship', progressMode: 'boards', boardIds: [b.board.id], parentGoalId: manual.id });
    expect(linked.progress).toEqual({ percent: 0, done: 0, total: 2 });
    await c.json('PATCH', `/api/items/${i1.id}`, { values: { [status.id]: 'done' } });
    await c.json('PATCH', `/api/goals/${manual.id}`, { currentValue: 200, status: 'achieved' });
    const goals = await c.json('GET', `/api/workspaces/${c.workspaceId}/goals`);
    expect(goals.find((g: any) => g.id === linked.id).progress.percent).toBe(50);
    expect(goals.find((g: any) => g.id === manual.id)).toMatchObject({ status: 'achieved', progress: { percent: 100 } });
    expect((await c.req('PATCH', `/api/goals/${manual.id}`, { parentGoalId: manual.id })).status).toBe(400);
    await c.json('DELETE', `/api/goals/${manual.id}`, {});
    expect((await c.json('GET', `/api/workspaces/${c.workspaceId}/goals`)).find((g: any) => g.id === linked.id).parentGoalId).toBeNull();
  });
});
