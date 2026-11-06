import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup } from './helpers';

const TYPES = ['table', 'kanban', 'calendar', 'timeline', 'chart', 'workload', 'form', 'map', 'files'];

describe('views share one data model (critical test 8)', () => {
  it('creates every view type over the same items', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const status = b.columns[1];
    const views: any[] = [];
    for (const type of TYPES) {
      views.push(await c.json('POST', `/api/boards/${b.board.id}/views`, { name: `${type} view`, type, settings: { filter: { op: 'and', rules: [{ field: 'name', op: 'contains', value: 'x' }] } } }));
    }
    expect((await c.req('POST', `/api/boards/${b.board.id}/views`, { name: 'bad', type: 'spreadsheet3000' })).status).toBe(400);
    const item = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Shared item' });
    await c.json('PATCH', `/api/items/${item.id}`, { values: { [status.id]: 'done' } });
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.views.map((v: any) => v.type)).toEqual(expect.arrayContaining(TYPES));
    // One canonical item list: every view renders from bundle.items.
    expect(bundle.items.filter((i: any) => i.id === item.id)).toHaveLength(1);
    expect(bundle.items.find((i: any) => i.id === item.id).values[status.id]).toBe('done');
    // Chart view endpoint reflects the edit.
    const chart = await c.json('POST', `/api/boards/${b.board.id}/chart`, { groupBy: 'status' });
    expect(chart.segments.find((s: any) => s.label === 'Done').count).toBe(1);
    await c.json('PATCH', `/api/items/${item.id}`, { values: { [status.id]: 'stuck' } });
    const chart2 = await c.json('POST', `/api/boards/${b.board.id}/chart`, { groupBy: 'status' });
    expect(chart2.segments.find((s: any) => s.label === 'Done')).toBeUndefined();
    expect(chart2.segments.find((s: any) => s.label === 'Stuck').count).toBe(1);
    // Filters are sanitised and persisted.
    expect(bundle.views.find((v: any) => v.id === views[0].id).settings.filter.rules[0].field).toBe('name');
  });

  it('updates and deletes views; personal views are private', async () => {
    const c = await signup();
    const other = await signup();
    await addMember(c, other, 'member');
    const b = await createBoard(c);
    const shared = await c.json('POST', `/api/boards/${b.board.id}/views`, { name: 'Shared', type: 'table' });
    await c.json('PATCH', `/api/views/${shared.id}`, { name: 'Renamed', settings: { sort: [{ field: 'name', dir: 'asc' }], hiddenColumns: [b.columns[0].id] } });
    const mine = await other.json('POST', `/api/boards/${b.board.id}/views`, { name: 'Mine', type: 'kanban', personal: true });
    const ownerBundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(ownerBundle.views.map((v: any) => v.id)).not.toContain(mine.id);
    expect(ownerBundle.views.find((v: any) => v.id === shared.id)).toMatchObject({ name: 'Renamed', settings: { sort: [{ field: 'name', dir: 'asc' }] } });
    const otherBundle = await other.json('GET', `/api/boards/${b.board.id}`);
    expect(otherBundle.views.map((v: any) => v.id)).toContain(mine.id);
    expect((await c.req('PATCH', `/api/views/${mine.id}`, { name: 'hijack' })).status).toBe(404);
    await c.json('DELETE', `/api/views/${shared.id}`, {});
    expect((await c.json('GET', `/api/boards/${b.board.id}`)).views.map((v: any) => v.id)).not.toContain(shared.id);
  });

  it('form view submissions create items with only allowed fields', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Requests', { templateId: 'requests' });
    const form = b.views.find((v: any) => v.type === 'form');
    const email = b.columns.find((x: any) => x.title === 'Requester email');
    const owner = b.columns.find((x: any) => x.title === 'Owner');
    const created = await c.json('POST', `/api/views/${form.id}/submit`, { name: 'Need laptop', values: { [email.id]: 'r@example.com', [owner.id]: c.userId } });
    expect(created.values[email.id]).toBe('r@example.com');
    expect(created.values[owner.id]).toBeUndefined();
    expect(created.groupId).toBe(form.settings.formGroupId);
    expect((await c.req('POST', `/api/views/${form.id}/submit`, { name: 'x', values: { [email.id]: 'bad' } })).status).toBe(422);
  });
});
