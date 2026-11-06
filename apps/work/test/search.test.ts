import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup } from './helpers';

async function seed() {
  const c = await signup('Searcher');
  const mate = await signup('Mate');
  await addMember(c, mate);
  const b = await createBoard(c, 'Roadmap board');
  const [person, status, due, priority] = b.columns;
  const mk = (name: string, values: any = {}) => c.json('POST', `/api/boards/${b.board.id}/items`, { name, values });
  const i1 = await mk('Payment gateway', { [status.id]: 'done', [priority.id]: 'high', [person.id]: mate.userId, [due.id]: '2026-02-01' });
  const i2 = await mk('Payment receipts', { [status.id]: 'working', [priority.id]: 'low', [due.id]: '2026-03-01' });
  const i3 = await mk('Onboarding email', { [status.id]: 'working', [priority.id]: 'high', [person.id]: c.userId, [due.id]: '2026-01-15' });
  const sub = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Payment sub-task', parentItemId: i1.id });
  await c.json('POST', `/api/items/${i2.id}/updates`, { body: 'Receipts need a PDF template' });
  await c.json('POST', `/api/workspaces/${c.workspaceId}/documents`, { title: 'Payment architecture' });
  return { c, mate, b, i1, i2, i3, sub, person, status, due, priority };
}

const search = (c: any, ws: string, body: any) => c.json('POST', `/api/workspaces/${ws}/search`, body);

describe('global search', () => {
  it('searches boards, items, subitems, documents, comments and users', async () => {
    const { c, i1, i2, sub } = await seed();
    const r = await search(c, c.workspaceId, { q: 'payment' });
    expect(r.items.map((i: any) => i.id).sort()).toEqual([i1.id, i2.id].sort());
    expect(r.subitems.map((i: any) => i.id)).toEqual([sub.id]);
    expect(r.documents.map((d: any) => d.title)).toEqual(['Payment architecture']);
    const comments = await search(c, c.workspaceId, { q: 'pdf template', types: ['comments'] });
    expect(comments.comments[0].item_id).toBe(i2.id);
    const boards = await search(c, c.workspaceId, { q: 'roadmap', types: ['boards'] });
    expect(boards.boards).toHaveLength(1);
    const users = await search(c, c.workspaceId, { q: 'mate', types: ['users'] });
    expect(users.users.map((u: any) => u.name)).toEqual(['Mate']);
    // Searches column values too.
    const byValue = await search(c, c.workspaceId, { q: 'working on it', types: ['items'] });
    expect(byValue.items.map((i: any) => i.id).sort()).toEqual([i2.id, (await search(c, c.workspaceId, { q: 'onboarding', types: ['items'] })).items[0].id].sort());
  });

  it('status, priority, person, date-range filters and sorting', async () => {
    const { c, mate, i1, i2, i3 } = await seed();
    const ids = (r: any) => r.items.map((i: any) => i.id);
    expect(ids(await search(c, c.workspaceId, { q: '', types: ['items'], statuses: ['Done'] }))).toEqual([i1.id]);
    expect(ids(await search(c, c.workspaceId, { q: '', types: ['items'], priorities: ['high'], sort: 'name_asc' }))).toEqual([i3.id, i1.id]);
    expect(ids(await search(c, c.workspaceId, { q: '', types: ['items'], people: [mate.userId] }))).toEqual([i1.id]);
    expect(ids(await search(c, c.workspaceId, { q: '', types: ['items'], dateRange: { field: 'due', from: '2026-01-20', to: '2026-02-15' } }))).toEqual([i1.id]);
    expect(ids(await search(c, c.workspaceId, { q: '', types: ['items'], sort: 'due_asc' }))).toEqual([i3.id, i1.id, i2.id]);
  });

  it('advanced AND/OR filters and saved filters', async () => {
    const { c, i1, i2, i3, status, priority } = await seed();
    const filter = {
      op: 'or',
      rules: [
        { field: status.id, op: 'is', value: 'done' },
        { op: 'and', rules: [{ field: priority.id, op: 'is', value: 'low' }, { field: 'name', op: 'contains', value: 'receipt' }] },
      ],
    };
    const r = await search(c, c.workspaceId, { q: '', types: ['items'], filter });
    expect(r.items.map((i: any) => i.id).sort()).toEqual([i1.id, i2.id].sort());
    expect(r.items.map((i: any) => i.id)).not.toContain(i3.id);
    const saved = await c.json('POST', `/api/workspaces/${c.workspaceId}/saved-filters`, { name: 'Done or low receipts', query: { filter } });
    const list = await c.json('GET', `/api/workspaces/${c.workspaceId}/saved-filters`);
    expect(list.find((s: any) => s.id === saved.id).query.filter.op).toBe('or');
    await c.json('DELETE', `/api/saved-filters/${saved.id}`, {});
    expect(await c.json('GET', `/api/workspaces/${c.workspaceId}/saved-filters`)).toHaveLength(0);
  });

  it('respects board access and archived items', async () => {
    const { c, mate, b, i1 } = await seed();
    await c.json('POST', `/api/items/${i1.id}/archive`, {});
    expect((await search(c, c.workspaceId, { q: 'gateway', types: ['items'] })).items).toHaveLength(0);
    await c.json('PATCH', `/api/boards/${b.board.id}`, { visibility: 'private' });
    const r = await search(mate, c.workspaceId, { q: 'payment' });
    expect(r.items).toHaveLength(0);
    expect(r.boards).toHaveLength(0);
    expect(r.documents.length).toBe(1); // workspace-visible doc
  });

  it('LIKE wildcards are escaped', async () => {
    const { c } = await seed();
    expect((await search(c, c.workspaceId, { q: '_', types: ['items'] })).items).toHaveLength(0);
    expect((await search(c, c.workspaceId, { q: '%', types: ['items', 'boards', 'documents'] })).items).toHaveLength(0);
  });
});

describe('my work, planner, favourites, recents', () => {
  it('buckets assigned items by due date and completion', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const [person, status, due] = b.columns;
    const day = (o: number) => new Date(Date.now() + o * 86_400_000).toISOString().slice(0, 10);
    const mk = (name: string, values: any) => c.json('POST', `/api/boards/${b.board.id}/items`, { name, values: { [person.id]: c.userId, ...values } });
    await mk('overdue', { [due.id]: day(-2) });
    await mk('today', { [due.id]: day(0) });
    await mk('soon', { [due.id]: day(3) });
    await mk('later', { [due.id]: day(30) });
    await mk('nodate', {});
    await mk('finished', { [status.id]: 'done', [due.id]: day(-5) });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'not mine', values: { [due.id]: day(0) } });
    const w = await c.json('GET', `/api/workspaces/${c.workspaceId}/my-work`);
    const names = (k: string) => w[k].map((x: any) => x.item.name);
    expect(names('overdue')).toEqual(['overdue']);
    expect(names('today')).toEqual(['today']);
    expect(names('upcoming')).toEqual(['soon']);
    expect(names('later')).toEqual(['later']);
    expect(names('noDate')).toEqual(['nodate']);
    expect(names('completed')).toEqual(['finished']);
    expect(w.overdue[0]).toMatchObject({ boardName: b.board.name, statusText: '' });
  });

  it('planner (My Day / weekly planning)', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Plan me' });
    await c.json('POST', `/api/workspaces/${c.workspaceId}/planner`, { itemId: it.id, day: '2026-05-04' });
    await c.json('POST', `/api/workspaces/${c.workspaceId}/planner`, { itemId: it.id, day: '2026-05-04' }); // idempotent
    let p = await c.json('GET', `/api/workspaces/${c.workspaceId}/planner?from=2026-05-04&to=2026-05-10`);
    expect(p).toHaveLength(1);
    await c.json('PATCH', `/api/planner/${p[0].id}`, { done: true, day: '2026-05-06' });
    p = await c.json('GET', `/api/workspaces/${c.workspaceId}/planner?from=2026-05-04&to=2026-05-10`);
    expect(p[0]).toMatchObject({ day: '2026-05-06', done: true, itemName: 'Plan me' });
    await c.json('DELETE', `/api/planner/${p[0].id}`, {});
    expect(await c.json('GET', `/api/workspaces/${c.workspaceId}/planner?from=2026-05-04&to=2026-05-10`)).toHaveLength(0);
    expect((await c.req('GET', `/api/workspaces/${c.workspaceId}/planner?from=bad`)).status).toBe(400);
  });

  it('favourites and recents resolve names and respect access', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Fav board');
    await c.json('POST', `/api/workspaces/${c.workspaceId}/favourites`, { type: 'board', id: b.board.id });
    const favs = await c.json('GET', `/api/workspaces/${c.workspaceId}/favourites`);
    expect(favs).toEqual([expect.objectContaining({ type: 'board', id: b.board.id, name: 'Fav board' })]);
    // Visiting the board records a recent.
    const recents = await c.json('GET', `/api/workspaces/${c.workspaceId}/recents`);
    expect(recents.some((r: any) => r.id === b.board.id)).toBe(true);
    await c.json('DELETE', `/api/workspaces/${c.workspaceId}/favourites/board/${b.board.id}`, {});
    expect(await c.json('GET', `/api/workspaces/${c.workspaceId}/favourites`)).toHaveLength(0);
    expect((await c.req('POST', `/api/workspaces/${c.workspaceId}/favourites`, { type: 'board', id: 'nope' })).status).toBe(404);
  });
});

describe('integrations', () => {
  it('lists providers honestly and never exposes secrets', async () => {
    const c = await signup();
    const p = await c.json('GET', '/api/integrations/providers');
    const google = p.providers.find((x: any) => x.id === 'google_drive');
    expect(google.availability).toBe('requires_setup');
    expect((await c.req('POST', `/api/workspaces/${c.workspaceId}/integrations`, { provider: 'google_drive', name: 'x', url: 'https://x.example.com' })).status).toBe(400);
    expect((await c.req('POST', `/api/workspaces/${c.workspaceId}/integrations`, { provider: 'webhook', name: 'x', url: 'http://insecure.example.com' })).status).toBe(400);
    expect((await c.req('POST', `/api/workspaces/${c.workspaceId}/integrations`, { provider: 'webhook', name: 'x', url: 'https://127.0.0.1/x' })).status).toBe(400);
    expect((await c.req('POST', `/api/workspaces/${c.workspaceId}/integrations`, { provider: 'webhook', name: 'x', url: 'https://localhost/x' })).status).toBe(400);
    expect((await c.req('POST', `/api/workspaces/${c.workspaceId}/integrations`, { provider: 'slack', name: 'x', url: 'https://evil.example.com/services/x' })).status).toBe(400);
    const created = await c.json('POST', `/api/workspaces/${c.workspaceId}/integrations`, { provider: 'webhook', name: 'Hook', url: 'https://hooks.example.com/secret-path-123' });
    expect(created.status).toBe('pending');
    expect(created.signingSecret).toMatch(/^whsec_/);
    const list = await c.json('GET', `/api/workspaces/${c.workspaceId}/integrations`);
    const text = JSON.stringify(list);
    expect(text).not.toContain('secret-path-123');
    expect(text).not.toContain(created.signingSecret);
    expect(list[0].endpointHint).toBe('hooks.example.com/…');
    await c.json('PATCH', `/api/integrations/${created.id}`, { enabled: false });
    expect((await c.json('GET', `/api/workspaces/${c.workspaceId}/integrations`))[0].status).toBe('disabled');
    await c.json('DELETE', `/api/integrations/${created.id}`, {});
    expect(await c.json('GET', `/api/workspaces/${c.workspaceId}/integrations`)).toHaveLength(0);
  });
});
