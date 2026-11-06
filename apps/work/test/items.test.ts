import { describe, expect, it } from 'vitest';
import { createBoard, signup } from './helpers';

describe('items and subitems (critical test 5)', () => {
  it('creates, edits and persists items with values', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const [person, status, due, priority] = b.columns;
    const item = await c.json('POST', `/api/boards/${b.board.id}/items`, {
      name: 'Write spec',
      groupId: b.groups[1].id,
      values: { [person.id]: c.userId, [status.id]: 'working', [due.id]: '2026-03-01', [priority.id]: 'high' },
    });
    expect(item.groupId).toBe(b.groups[1].id);
    await c.json('PATCH', `/api/items/${item.id}`, { name: 'Write the spec', description: 'Details', values: { [status.id]: 'done', [priority.id]: null } });
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    const saved = bundle.items.find((i: any) => i.id === item.id);
    expect(saved.name).toBe('Write the spec');
    expect(saved.description).toBe('Details');
    expect(saved.values[status.id]).toBe('done');
    expect(saved.values[priority.id]).toBeUndefined();
    expect(saved.values[due.id]).toBe('2026-03-01');
    expect(saved.completedAt).toBeGreaterThan(0);
    // Reopening clears completion.
    await c.json('PATCH', `/api/items/${item.id}`, { values: { [status.id]: 'stuck' } });
    expect((await c.json('GET', `/api/items/${item.id}`)).item.completedAt).toBeNull();
  });

  it('rejects invalid values with 422', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const [, status, due] = b.columns;
    const item = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x' });
    expect((await c.req('PATCH', `/api/items/${item.id}`, { values: { [status.id]: 'not-a-label' } })).status).toBe(422);
    expect((await c.req('PATCH', `/api/items/${item.id}`, { values: { [due.id]: 'tomorrow' } })).status).toBe(422);
    expect((await c.req('PATCH', `/api/items/${item.id}`, { values: { unknown: 1 } })).status).toBe(422);
    expect((await c.req('POST', `/api/boards/${b.board.id}/items`, { name: '   ' })).status).toBe(400);
  });

  it('creates subitems and loads them in item detail', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const parent = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Parent' });
    const s1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Sub 1', parentItemId: parent.id });
    const s2 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Sub 2', parentItemId: parent.id });
    expect(s1.parentItemId).toBe(parent.id);
    expect((await c.req('POST', `/api/boards/${b.board.id}/items`, { name: 'Sub-sub', parentItemId: s1.id })).status).toBe(400);
    const detail = await c.json('GET', `/api/items/${parent.id}`);
    expect(detail.subitems.map((s: any) => s.name)).toEqual(['Sub 1', 'Sub 2']);
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.find((i: any) => i.id === parent.id).subitemCount).toBe(2);
    // Moving the parent moves subitems along.
    await c.json('POST', `/api/items/${parent.id}/move`, { groupId: b.groups[2].id });
    const after = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(after.items.find((i: any) => i.id === s2.id).groupId).toBe(b.groups[2].id);
    // Archiving the parent archives subitems.
    await c.json('POST', `/api/items/${parent.id}/archive`, {});
    const archived = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(archived.items.map((i: any) => i.id)).not.toContain(s1.id);
    const arch = await c.json('GET', `/api/boards/${b.board.id}?archived=1`);
    expect(arch.items.map((i: any) => i.id)).toEqual(expect.arrayContaining([parent.id, s1.id, s2.id]));
    await c.json('POST', `/api/items/${parent.id}/restore`, {});
    await c.json('DELETE', `/api/items/${parent.id}`, {});
    expect((await c.req('GET', `/api/items/${s1.id}`)).status).toBe(404);
  });

  it('duplicates items with subitems', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const status = b.columns[1];
    const p = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Orig', values: { [status.id]: 'working' } });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'child', parentItemId: p.id });
    const copy = await c.json('POST', `/api/items/${p.id}/duplicate`, {});
    expect(copy.name).toBe('Orig (copy)');
    expect(copy.values[status.id]).toBe('working');
    const d = await c.json('GET', `/api/items/${copy.id}`);
    expect(d.subitems.map((s: any) => s.name)).toEqual(['child']);
  });

  it('bulk actions apply to many items', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const status = b.columns[1];
    const ids: string[] = [];
    for (let i = 0; i < 4; i++) ids.push((await c.json('POST', `/api/boards/${b.board.id}/items`, { name: `i${i}` })).id);
    const r = await c.json('POST', `/api/boards/${b.board.id}/items/bulk`, { itemIds: ids, action: 'set_value', columnId: status.id, value: 'done' });
    expect(r.processed).toBe(4);
    await c.json('POST', `/api/boards/${b.board.id}/items/bulk`, { itemIds: ids.slice(0, 2), action: 'move', groupId: b.groups[2].id });
    await c.json('POST', `/api/boards/${b.board.id}/items/bulk`, { itemIds: [ids[3]], action: 'delete' });
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.filter((i: any) => i.values[status.id] === 'done')).toHaveLength(3);
    expect(bundle.items.filter((i: any) => i.groupId === b.groups[2].id)).toHaveLength(2);
    expect((await c.req('POST', `/api/boards/${b.board.id}/items/bulk`, { itemIds: ['nope'], action: 'archive' })).status).toBe(404);
  });

  it('tracks activity history for changes', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const status = b.columns[1];
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Track me' });
    await c.json('PATCH', `/api/items/${it.id}`, { name: 'Tracked', values: { [status.id]: 'stuck' } });
    await c.json('POST', `/api/items/${it.id}/move`, { groupId: b.groups[1].id });
    const act = await c.json('GET', `/api/items/${it.id}/activity`);
    const actions = act.map((a: any) => a.action);
    expect(actions).toEqual(expect.arrayContaining(['item_created', 'renamed', 'value_changed', 'moved']));
    const vc = act.find((a: any) => a.action === 'value_changed');
    expect(vc).toMatchObject({ columnId: status.id, oldValue: null, newValue: 'stuck', actorName: c.name });
    const boardAct = await c.json('GET', `/api/boards/${b.board.id}/activity`);
    expect(boardAct.length).toBeGreaterThanOrEqual(4);
  });

  it('updates, replies and edit/delete permissions', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Discuss' });
    const u = await c.json('POST', `/api/items/${it.id}/updates`, { body: 'First update' });
    await c.json('POST', `/api/items/${it.id}/updates`, { body: 'A reply', parentUpdateId: u.id });
    const r = await c.json('POST', `/api/items/${it.id}/updates`, { body: 'Another', parentUpdateId: u.id });
    expect((await c.req('POST', `/api/items/${it.id}/updates`, { body: 'nested', parentUpdateId: r.id })).status).toBe(400);
    const list = await c.json('GET', `/api/items/${it.id}/updates`);
    expect(list).toHaveLength(1);
    expect(list[0].replies.map((x: any) => x.body)).toEqual(['A reply', 'Another']);
    await c.json('PATCH', `/api/updates/${u.id}`, { body: 'Edited' });
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.find((i: any) => i.id === it.id).updateCount).toBe(3);
    await c.json('DELETE', `/api/updates/${u.id}`, {});
    expect(await c.json('GET', `/api/items/${it.id}/updates`)).toHaveLength(0);
  });

  it('time tracking start/stop/manual and single running timer', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const i1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 't1' });
    const i2 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 't2' });
    await c.json('POST', `/api/items/${i1.id}/time/start`, {});
    expect((await c.json('GET', '/api/me/timer')).item_id).toBe(i1.id);
    await c.json('POST', `/api/items/${i2.id}/time/start`, {});
    expect((await c.json('GET', '/api/me/timer')).item_id).toBe(i2.id);
    await c.json('POST', `/api/items/${i2.id}/time/stop`, {});
    expect(await c.json('GET', '/api/me/timer')).toBeNull();
    expect((await c.req('POST', `/api/items/${i2.id}/time/stop`, {})).status).toBe(400);
    await c.json('POST', `/api/items/${i1.id}/time`, { minutes: 90, date: '2026-01-02', note: 'manual' });
    const d = await c.json('GET', `/api/items/${i1.id}`);
    expect(d.timeEntries.some((t: any) => t.duration_seconds === 5400)).toBe(true);
    expect(d.timeEntries.filter((t: any) => t.ended_at).length).toBe(2);
  });
});

describe('drag and drop persistence (critical test 7)', () => {
  it('reorders within a group and across groups', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const g = b.groups[0].id;
    const names = ['A', 'B', 'C', 'D'];
    const items: any[] = [];
    for (const n of names) items.push(await c.json('POST', `/api/boards/${b.board.id}/items`, { name: n, groupId: g }));
    const order = async (groupId: string) =>
      (await c.json('GET', `/api/boards/${b.board.id}`)).items
        .filter((i: any) => i.groupId === groupId && !i.parentItemId)
        .sort((x: any, y: any) => x.position - y.position)
        .map((i: any) => i.name);
    expect(await order(g)).toEqual(['A', 'B', 'C', 'D']);
    // Drag D between A and B.
    await c.json('POST', `/api/items/${items[3].id}/move`, { beforeId: items[0].id, afterId: items[1].id });
    expect(await order(g)).toEqual(['A', 'D', 'B', 'C']);
    // Drag A to the end.
    await c.json('POST', `/api/items/${items[0].id}/move`, { beforeId: items[2].id, afterId: null });
    expect(await order(g)).toEqual(['D', 'B', 'C', 'A']);
    // Drag B to top.
    await c.json('POST', `/api/items/${items[1].id}/move`, { beforeId: null, afterId: items[3].id });
    expect(await order(g)).toEqual(['B', 'D', 'C', 'A']);
    // Drag C into another group (append).
    const g2 = b.groups[1].id;
    const x = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'X', groupId: g2 });
    await c.json('POST', `/api/items/${items[2].id}/move`, { groupId: g2, beforeId: null, afterId: x.id });
    expect(await order(g)).toEqual(['B', 'D', 'A']);
    expect(await order(g2)).toEqual(['C', 'X']);
    // Kanban-style drop changes status persistently.
    const status = b.columns[1];
    await c.json('PATCH', `/api/items/${x.id}`, { values: { [status.id]: 'done' } });
    expect((await c.json('GET', `/api/items/${x.id}`)).item.values[status.id]).toBe('done');
  });

  it('cannot move into a group of another board', async () => {
    const c = await signup();
    const b1 = await createBoard(c, 'one');
    const b2 = await createBoard(c, 'two');
    const it = await c.json('POST', `/api/boards/${b1.board.id}/items`, { name: 'x' });
    expect((await c.req('POST', `/api/items/${it.id}/move`, { groupId: b2.groups[0].id })).status).toBe(400);
  });
});
