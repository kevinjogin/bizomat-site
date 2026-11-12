import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { runMaintenance } from '../src/worker/index';
import { addMember, createBoard, signup } from './helpers';

async function team() {
  const owner = await signup('Owner');
  const bob = await signup('Bob');
  await addMember(owner, bob);
  const b = await createBoard(owner);
  const [person, status, due] = b.columns;
  return { owner, bob, b, person, status, due };
}

const list = async (c: any, ws: string, q = '') => (await c.json('GET', `/api/notifications?workspaceId=${ws}${q}`)) as { notifications: any[]; unreadCount: number };

describe('notifications (critical test 10)', () => {
  it('assignment notifications with deep links (not to the actor)', async () => {
    const { owner, bob, b, person } = await team();
    const it1 = await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Assigned', values: { [person.id]: bob.userId } });
    const n = await list(bob, owner.workspaceId);
    const a = n.notifications.find((x) => x.type === 'assignment');
    expect(a.title).toContain('Assigned');
    expect(a.link).toBe(`/w/${owner.workspaceId}/boards/${b.board.id}?item=${it1.id}`);
    expect(a.actorId).toBe(owner.userId);
    // Self-assignment does not notify.
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Mine', values: { [person.id]: owner.userId } });
    expect((await list(owner, owner.workspaceId)).notifications.filter((x) => x.type === 'assignment')).toHaveLength(0);
  });

  it('mentions, comments and replies', async () => {
    const { owner, bob, b } = await team();
    const carol = await signup('Carol');
    await addMember(owner, carol);
    const it1 = await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Discussion' });
    // Bob comments -> owner (creator) gets 'comment'
    const up = await bob.json('POST', `/api/items/${it1.id}/updates`, { body: `Hi @[Carol](user:${carol.userId})` });
    expect((await list(owner, owner.workspaceId)).notifications.some((x) => x.type === 'comment')).toBe(true);
    expect((await list(carol, owner.workspaceId)).notifications.some((x) => x.type === 'mention' && x.body.includes('@Carol'))).toBe(true);
    // Owner replies -> Bob (parent author) gets 'reply'
    await owner.json('POST', `/api/items/${it1.id}/updates`, { body: 'Thanks', parentUpdateId: up.id });
    expect((await list(bob, owner.workspaceId)).notifications.some((x) => x.type === 'reply')).toBe(true);
  });

  it('mentions of users without board access are not delivered', async () => {
    const { owner, bob, b } = await team();
    await owner.json('PATCH', `/api/boards/${b.board.id}`, { visibility: 'private' });
    const it1 = await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Private' });
    await owner.json('POST', `/api/items/${it1.id}/updates`, { body: `fyi @[Bob](user:${bob.userId})` });
    expect((await list(bob, owner.workspaceId)).notifications.filter((x) => x.type === 'mention')).toHaveLength(0);
  });

  it('status change notifies assignees', async () => {
    const { owner, bob, b, person, status } = await team();
    const it1 = await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Status item', values: { [person.id]: bob.userId } });
    await owner.json('PATCH', `/api/items/${it1.id}`, { values: { [status.id]: 'done' } });
    const s = (await list(bob, owner.workspaceId)).notifications.find((x) => x.type === 'status_change');
    expect(s.title).toBe('"Status item" is now Done');
  });

  it('due soon and overdue notifications from the scheduler, deduplicated', async () => {
    const { owner, bob, b, person, due, status } = await team();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Late', values: { [person.id]: bob.userId, [due.id]: yesterday } });
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Today', values: { [person.id]: bob.userId, [due.id]: today } });
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Tomorrow', values: { [person.id]: bob.userId, [due.id]: tomorrow } });
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Finished', values: { [person.id]: bob.userId, [due.id]: yesterday, [status.id]: 'done' } });
    await runMaintenance(env, Date.now());
    await runMaintenance(env, Date.now());
    const n = (await list(bob, owner.workspaceId)).notifications;
    const titles = n.filter((x) => x.type === 'overdue' || x.type === 'due_soon').map((x) => x.title).sort();
    expect(titles).toEqual(['"Late" is overdue', '"Today" is due today', '"Tomorrow" is due tomorrow']);
  });

  it('read, unread, mark all read and delete', async () => {
    const { owner, bob, b, person } = await team();
    for (const name of ['a', 'b', 'c']) await owner.json('POST', `/api/boards/${b.board.id}/items`, { name, values: { [person.id]: bob.userId } });
    let n = await list(bob, owner.workspaceId);
    expect(n.unreadCount).toBe(3);
    await bob.json('POST', `/api/notifications/${n.notifications[0].id}/read`, {});
    n = await list(bob, owner.workspaceId);
    expect(n.unreadCount).toBe(2);
    expect((await list(bob, owner.workspaceId, '&unread=1')).notifications).toHaveLength(2);
    await bob.json('POST', `/api/notifications/${n.notifications[0].id}/read?unread=1`, {});
    expect((await list(bob, owner.workspaceId)).unreadCount).toBe(3);
    const r = await bob.json('POST', `/api/notifications/read-all?workspaceId=${owner.workspaceId}`, {});
    expect(r.updated).toBe(3);
    expect((await list(bob, owner.workspaceId)).unreadCount).toBe(0);
    await bob.json('DELETE', `/api/notifications/${n.notifications[0].id}`, {});
    expect((await list(bob, owner.workspaceId)).notifications).toHaveLength(2);
  });

  it('preferences mute notification types', async () => {
    const { owner, bob, b, person } = await team();
    const prefs = await bob.json('GET', '/api/me/notification-preferences');
    // Email is on by default for assignments (12 Nov 2026); in-app as before.
    expect(prefs.find((p: any) => p.type === 'assignment')).toEqual({ type: 'assignment', inApp: true, email: true });
    await bob.json('PUT', '/api/me/notification-preferences', [{ type: 'assignment', inApp: false, email: false }]);
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'muted', values: { [person.id]: bob.userId } });
    expect((await list(bob, owner.workspaceId)).notifications.filter((x) => x.type === 'assignment')).toHaveLength(0);
    expect((await bob.json('GET', '/api/me/notification-preferences')).find((p: any) => p.type === 'assignment').inApp).toBe(false);
  });

  it('former members stop seeing workspace notifications', async () => {
    const { owner, bob, b, person } = await team();
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x', values: { [person.id]: bob.userId } });
    expect((await list(bob, owner.workspaceId)).notifications.length).toBe(1);
    await owner.json('DELETE', `/api/workspaces/${owner.workspaceId}/members/${bob.userId}`, {});
    expect((await bob.json('GET', '/api/notifications')).notifications.filter((x: any) => x.workspaceId === owner.workspaceId)).toHaveLength(0);
  });
});
