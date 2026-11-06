import { beforeAll, describe, expect, it } from 'vitest';
import { createBoard, signup, type Client } from './helpers';

// Critical test 2: users cannot access another workspace.

let a: Client;
let b: Client;
const ids: Record<string, string> = {};

function pngFile(name = 'p.png') {
  const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  return new File([bytes], name, { type: 'image/png' });
}

beforeAll(async () => {
  a = await signup('Alice');
  b = await signup('Bob');
  const board = await createBoard(a, 'Alice secret board');
  ids.board = board.board.id;
  ids.group = board.groups[0].id;
  ids.column = board.columns[0].id;
  ids.view = board.views[0].id;
  const item = await a.json('POST', `/api/boards/${ids.board}/items`, { name: 'Alice secret item' });
  ids.item = item.id;
  const up = await a.json('POST', `/api/items/${ids.item}/updates`, { body: 'secret comment' });
  ids.update = up.id;
  const fd = new FormData();
  fd.set('file', pngFile());
  fd.set('scope', 'item');
  fd.set('itemId', ids.item);
  const f = await a.req('POST', '/api/files', fd);
  ids.file = ((await f.json()) as any).id;
  ids.doc = (await a.json('POST', `/api/workspaces/${a.workspaceId}/documents`, { title: 'Alice secret doc' })).id;
  ids.dashboard = (await a.json('POST', `/api/workspaces/${a.workspaceId}/dashboards`, { name: 'Alice dash', boardIds: [ids.board] })).id;
  const dash = await a.json('GET', `/api/dashboards/${ids.dashboard}`);
  ids.widget = dash.widgets[0].id;
  ids.goal = (await a.json('POST', `/api/workspaces/${a.workspaceId}/goals`, { title: 'Alice goal' })).id;
  ids.automation = (
    await a.json('POST', `/api/boards/${ids.board}/automations`, {
      name: 'auto',
      trigger: { type: 'item_created' },
      actions: [{ type: 'notify', target: 'creator', message: 'hi' }],
    })
  ).id;
  ids.integration = (await a.json('POST', `/api/workspaces/${a.workspaceId}/integrations`, { provider: 'webhook', name: 'hook', url: 'https://hooks.example.com/x' })).id;
  ids.team = (await a.json('POST', `/api/workspaces/${a.workspaceId}/teams`, { name: 'Team A' })).id;
  ids.time = (await a.json('POST', `/api/items/${ids.item}/time`, { minutes: 30, date: '2026-01-01' })).id;
  // The item_created automation notifies Alice (the creator).
  await a.json('POST', `/api/boards/${ids.board}/items`, { name: 'second' });
});

const notOk = (s: number) => expect([403, 404]).toContain(s);

describe('workspace isolation (IDOR)', () => {
  it('cannot read the workspace or its collections', async () => {
    const ws = a.workspaceId;
    for (const p of [
      `/api/workspaces/${ws}`,
      `/api/workspaces/${ws}/boards`,
      `/api/workspaces/${ws}/members`,
      `/api/workspaces/${ws}/teams`,
      `/api/workspaces/${ws}/documents`,
      `/api/workspaces/${ws}/dashboards`,
      `/api/workspaces/${ws}/goals`,
      `/api/workspaces/${ws}/templates`,
      `/api/workspaces/${ws}/integrations`,
      `/api/workspaces/${ws}/invitations`,
      `/api/workspaces/${ws}/audit`,
      `/api/workspaces/${ws}/export`,
      `/api/workspaces/${ws}/activity`,
      `/api/workspaces/${ws}/my-work`,
      `/api/workspaces/${ws}/favourites`,
      `/api/workspaces/${ws}/recents`,
      `/api/workspaces/${ws}/planner`,
      `/api/workspaces/${ws}/saved-filters`,
      `/api/workspaces/${ws}/admin/overview`,
      `/api/workspaces/${ws}/logo`,
    ]) {
      const r = await b.req('GET', p);
      expect(r.status, p).toBe(404);
    }
    notOk((await b.req('POST', `/api/workspaces/${ws}/search`, { q: 'secret' })).status);
  });

  it('cannot read board-level resources', async () => {
    for (const p of [
      `/api/boards/${ids.board}`,
      `/api/boards/${ids.board}/activity`,
      `/api/boards/${ids.board}/automations`,
      `/api/boards/${ids.board}/files`,
      `/api/items/${ids.item}`,
      `/api/items/${ids.item}/updates`,
      `/api/items/${ids.item}/activity`,
      `/api/files/${ids.file}`,
      `/api/documents/${ids.doc}`,
      `/api/documents/${ids.doc}/versions`,
      `/api/documents/${ids.doc}/comments`,
      `/api/dashboards/${ids.dashboard}`,
      `/api/dashboards/${ids.dashboard}/data`,
      `/api/automations/${ids.automation}/runs`,
      `/api/integrations/${ids.integration}/deliveries`,
      `/api/users/${a.userId}/avatar`,
    ]) {
      const r = await b.req('GET', p);
      expect(r.status, p).toBe(404);
    }
  });

  it('cannot modify or delete foreign resources', async () => {
    const attempts: [string, string, unknown][] = [
      ['PATCH', `/api/workspaces/${a.workspaceId}`, { name: 'pwned' }],
      ['POST', `/api/workspaces/${a.workspaceId}/boards`, { name: 'x' }],
      ['POST', `/api/workspaces/${a.workspaceId}/invitations`, { email: b.email, role: 'admin' }],
      ['PATCH', `/api/workspaces/${a.workspaceId}/members/${b.userId}`, { role: 'owner' }],
      ['PATCH', `/api/boards/${ids.board}`, { name: 'pwned' }],
      ['DELETE', `/api/boards/${ids.board}`, { confirmName: 'Alice secret board' }],
      ['POST', `/api/boards/${ids.board}/duplicate`, {}],
      ['PUT', `/api/boards/${ids.board}/members`, { userId: b.userId, role: 'owner' }],
      ['POST', `/api/boards/${ids.board}/items`, { name: 'x' }],
      ['POST', `/api/boards/${ids.board}/groups`, { name: 'x' }],
      ['POST', `/api/boards/${ids.board}/columns`, { title: 'x', type: 'text' }],
      ['POST', `/api/boards/${ids.board}/views`, { name: 'x', type: 'table', personal: true }],
      ['POST', `/api/boards/${ids.board}/automations`, { name: 'x', trigger: { type: 'item_created' }, actions: [{ type: 'archive_item' }] }],
      ['POST', `/api/boards/${ids.board}/items/bulk`, { itemIds: [ids.item], action: 'delete' }],
      ['POST', `/api/boards/${ids.board}/chart`, {}],
      ['PATCH', `/api/groups/${ids.group}`, { name: 'x' }],
      ['DELETE', `/api/groups/${ids.group}`, {}],
      ['PATCH', `/api/columns/${ids.column}`, { title: 'x' }],
      ['DELETE', `/api/columns/${ids.column}`, {}],
      ['PATCH', `/api/views/${ids.view}`, { name: 'x' }],
      ['DELETE', `/api/views/${ids.view}`, {}],
      ['PATCH', `/api/items/${ids.item}`, { name: 'x' }],
      ['POST', `/api/items/${ids.item}/move`, { groupId: ids.group }],
      ['POST', `/api/items/${ids.item}/duplicate`, {}],
      ['POST', `/api/items/${ids.item}/archive`, {}],
      ['DELETE', `/api/items/${ids.item}`, {}],
      ['POST', `/api/items/${ids.item}/updates`, { body: 'x' }],
      ['POST', `/api/items/${ids.item}/time/start`, {}],
      ['PATCH', `/api/updates/${ids.update}`, { body: 'x' }],
      ['DELETE', `/api/updates/${ids.update}`, {}],
      ['DELETE', `/api/time/${ids.time}`, {}],
      ['DELETE', `/api/files/${ids.file}`, {}],
      ['PATCH', `/api/documents/${ids.doc}`, { title: 'x' }],
      ['DELETE', `/api/documents/${ids.doc}`, {}],
      ['POST', `/api/documents/${ids.doc}/comments`, { body: 'x' }],
      ['PATCH', `/api/dashboards/${ids.dashboard}`, { name: 'x' }],
      ['DELETE', `/api/dashboards/${ids.dashboard}`, {}],
      ['POST', `/api/dashboards/${ids.dashboard}/widgets`, { type: 'number', title: 'x' }],
      ['PATCH', `/api/widgets/${ids.widget}`, { title: 'x' }],
      ['DELETE', `/api/widgets/${ids.widget}`, {}],
      ['PATCH', `/api/goals/${ids.goal}`, { title: 'x' }],
      ['DELETE', `/api/goals/${ids.goal}`, {}],
      ['PATCH', `/api/automations/${ids.automation}`, { name: 'x' }],
      ['DELETE', `/api/automations/${ids.automation}`, {}],
      ['POST', `/api/automations/${ids.automation}/run`, {}],
      ['PATCH', `/api/integrations/${ids.integration}`, { name: 'x' }],
      ['DELETE', `/api/integrations/${ids.integration}`, {}],
      ['POST', `/api/integrations/${ids.integration}/test`, {}],
      ['PATCH', `/api/workspaces/${a.workspaceId}/teams/${ids.team}`, { name: 'x' }],
      ['POST', `/api/workspaces/${a.workspaceId}/favourites`, { type: 'board', id: ids.board }],
    ];
    for (const [m, p, body] of attempts) {
      const r = await b.req(m, p, body);
      expect([403, 404], `${m} ${p} -> ${r.status}`).toContain(r.status);
    }
    // Everything still intact for Alice.
    const board = await a.json('GET', `/api/boards/${ids.board}`);
    expect(board.board.name).toBe('Alice secret board');
    expect(board.items.map((i: any) => i.id)).toContain(ids.item);
  });

  it('cannot reference foreign entities from own workspace', async () => {
    const own = await createBoard(b, 'Bob board');
    // Move Alice's item into Bob's group
    expect([403, 404]).toContain((await b.req('POST', `/api/items/${ids.item}/move`, { groupId: own.groups[0].id })).status);
    // Use Alice's id as person / dependency / file on Bob's item
    const person = own.columns.find((c: any) => c.type === 'person');
    const bi = await b.json('POST', `/api/boards/${own.board.id}/items`, { name: 'b item' });
    expect((await b.req('PATCH', `/api/items/${bi.id}`, { values: { [person.id]: a.userId } })).status).toBe(422);
    const dep = await b.json('POST', `/api/boards/${own.board.id}/columns`, { title: 'Deps', type: 'dependency' });
    expect((await b.req('PATCH', `/api/items/${bi.id}`, { values: { [dep.id]: [ids.item] } })).status).toBe(422);
    const files = await b.json('POST', `/api/boards/${own.board.id}/columns`, { title: 'Files', type: 'files' });
    expect((await b.req('PATCH', `/api/items/${bi.id}`, { values: { [files.id]: [ids.file] } })).status).toBe(422);
    // Subitem under Alice's item via Bob's board
    expect((await b.req('POST', `/api/boards/${own.board.id}/items`, { name: 'x', parentItemId: ids.item })).status).toBe(400);
    // Item in Alice's group through Bob's board
    expect((await b.req('POST', `/api/boards/${own.board.id}/items`, { name: 'x', groupId: ids.group })).status).toBe(400);
    // Document linked to Alice's board
    expect((await b.req('POST', `/api/workspaces/${b.workspaceId}/documents`, { title: 'x', boardId: ids.board })).status).toBe(404);
    // Dashboard over Alice's board silently drops it
    const d = await b.json('POST', `/api/workspaces/${b.workspaceId}/dashboards`, { name: 'x', boardIds: [ids.board] });
    expect(d.boardIds).toEqual([]);
    // Goal linked to Alice's board drops it
    const g = await b.json('POST', `/api/workspaces/${b.workspaceId}/goals`, { title: 'x', boardIds: [ids.board], progressMode: 'boards' });
    expect(g.boardIds).toEqual([]);
    // Automation sending to Alice's integration
    const r = await b.req('POST', `/api/boards/${own.board.id}/automations`, { name: 'x', trigger: { type: 'item_created' }, actions: [{ type: 'send_webhook', integrationId: ids.integration }] });
    expect(r.status).toBe(400);
    // Upload a file onto Alice's item
    const fd = new FormData();
    fd.set('file', pngFile());
    fd.set('scope', 'item');
    fd.set('itemId', ids.item);
    expect((await b.req('POST', '/api/files', fd)).status).toBe(404);
    // Logo upload into Alice's workspace
    const fd2 = new FormData();
    fd2.set('file', pngFile());
    fd2.set('scope', 'logo');
    fd2.set('workspaceId', a.workspaceId);
    expect((await b.req('POST', '/api/files', fd2)).status).toBe(404);
    // Planner entry for Alice's item
    expect((await b.req('POST', `/api/workspaces/${b.workspaceId}/planner`, { itemId: ids.item, day: '2026-01-01' })).status).toBe(404);
  });

  it("does not leak Alice's notifications or search results", async () => {
    const mine = await a.json('GET', '/api/notifications');
    expect(mine.notifications.length).toBeGreaterThan(0);
    const nid = mine.notifications[0].id;
    expect((await b.req('POST', `/api/notifications/${nid}/read`, {})).status).toBe(404);
    const bob = await b.json('GET', `/api/notifications?workspaceId=${a.workspaceId}`);
    expect(bob.notifications).toHaveLength(0);
    const s = await b.json('POST', `/api/workspaces/${b.workspaceId}/search`, { q: 'secret' });
    expect(JSON.stringify(s)).not.toContain('Alice secret');
  });
});
