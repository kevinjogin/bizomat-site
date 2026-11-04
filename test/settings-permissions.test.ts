import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup } from './helpers';

describe('settings enforce permissions (critical test 12)', () => {
  it('members cannot manage roles, invite admins or delete the workspace', async () => {
    const owner = await signup('Owner');
    const member = await signup('Member');
    const viewer = await signup('Viewer');
    await addMember(owner, member, 'member');
    await addMember(owner, viewer, 'viewer');
    const ws = owner.workspaceId;
    expect((await member.req('PATCH', `/api/workspaces/${ws}/members/${viewer.userId}`, { role: 'admin' })).status).toBe(403);
    expect((await member.req('PATCH', `/api/workspaces/${ws}/members/${member.userId}`, { role: 'owner' })).status).toBe(403);
    expect((await member.req('POST', `/api/workspaces/${ws}/invitations`, { email: 'x@example.com', role: 'member' })).status).toBe(403);
    expect((await member.req('PATCH', `/api/workspaces/${ws}`, { name: 'Pwned' })).status).toBe(403);
    expect((await member.req('DELETE', `/api/workspaces/${ws}`, { confirmName: 'x' })).status).toBe(403);
    expect((await member.req('DELETE', `/api/workspaces/${ws}/members/${viewer.userId}`, {})).status).toBe(403);
    expect((await member.req('GET', `/api/workspaces/${ws}/audit`)).status).toBe(403);
    expect((await member.req('GET', `/api/workspaces/${ws}/export`)).status).toBe(403);
    expect((await member.req('GET', `/api/workspaces/${ws}/invitations`)).status).toBe(403);
    expect((await member.req('POST', `/api/workspaces/${ws}/teams`, { name: 't' })).status).toBe(403);
    expect((await member.req('POST', `/api/workspaces/${ws}/integrations`, { provider: 'webhook', name: 'h', url: 'https://hooks.example.com/x' })).status).toBe(403);
    // When owners allow it, members may invite (but still not admins).
    await owner.json('PATCH', `/api/workspaces/${ws}`, { settings: { allowMembersToInvite: true } });
    expect((await member.req('POST', `/api/workspaces/${ws}/invitations`, { email: 'y@example.com', role: 'member' })).status).toBe(201);
    expect((await member.req('POST', `/api/workspaces/${ws}/invitations`, { email: 'z@example.com', role: 'admin' })).status).toBe(403);
    // Members can leave.
    await member.json('DELETE', `/api/workspaces/${ws}/members/${member.userId}`, {});
    expect((await member.req('GET', `/api/workspaces/${ws}`)).status).toBe(404);
  });

  it('admins manage members but only owners touch owners; last owner protected', async () => {
    const owner = await signup('Owner');
    const admin = await signup('Admin');
    const m = await signup('M');
    await addMember(owner, admin, 'admin');
    await addMember(owner, m, 'member');
    const ws = owner.workspaceId;
    await admin.json('PATCH', `/api/workspaces/${ws}/members/${m.userId}`, { role: 'viewer' });
    expect((await admin.req('PATCH', `/api/workspaces/${ws}/members/${m.userId}`, { role: 'owner' })).status).toBe(403);
    expect((await admin.req('PATCH', `/api/workspaces/${ws}/members/${owner.userId}`, { role: 'member' })).status).toBe(403);
    expect((await admin.req('DELETE', `/api/workspaces/${ws}/members/${owner.userId}`, {})).status).toBe(403);
    expect((await admin.req('DELETE', `/api/workspaces/${ws}`, { confirmName: 'x' })).status).toBe(403);
    expect((await owner.req('PATCH', `/api/workspaces/${ws}/members/${owner.userId}`, { role: 'admin' })).status).toBe(400);
    expect((await owner.req('DELETE', `/api/workspaces/${ws}/members/${owner.userId}`, {})).status).toBe(400);
    await owner.json('PATCH', `/api/workspaces/${ws}/members/${admin.userId}`, { role: 'owner' });
    await owner.json('PATCH', `/api/workspaces/${ws}/members/${owner.userId}`, { role: 'admin' });
    const members = await admin.json('GET', `/api/workspaces/${ws}/members`);
    expect(members.find((x: any) => x.id === admin.userId).role).toBe('owner');
    const audit = await admin.json('GET', `/api/workspaces/${ws}/audit`);
    expect(audit.some((a: any) => a.action === 'member.role_changed')).toBe(true);
    const overview = await admin.json('GET', `/api/workspaces/${ws}/admin/overview`);
    expect(overview.members).toBe(3);
  });

  it('viewers can read but not edit; can still comment', async () => {
    const owner = await signup();
    const viewer = await signup();
    await addMember(owner, viewer, 'viewer');
    const b = await createBoard(owner);
    const it = await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'readonly' });
    const bundle = await viewer.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.board.access).toBe('view');
    expect((await viewer.req('PATCH', `/api/items/${it.id}`, { name: 'x' })).status).toBe(403);
    expect((await viewer.req('POST', `/api/boards/${b.board.id}/items`, { name: 'x' })).status).toBe(403);
    expect((await viewer.req('DELETE', `/api/items/${it.id}`, {})).status).toBe(403);
    expect((await viewer.req('POST', `/api/boards/${b.board.id}/columns`, { title: 'x', type: 'text' })).status).toBe(403);
    expect((await viewer.req('POST', `/api/boards/${b.board.id}/groups`, { name: 'x' })).status).toBe(403);
    expect((await viewer.req('POST', `/api/workspaces/${owner.workspaceId}/boards`, { name: 'x' })).status).toBe(403);
    expect((await viewer.req('POST', `/api/workspaces/${owner.workspaceId}/dashboards`, { name: 'x' })).status).toBe(403);
    expect((await viewer.req('POST', `/api/workspaces/${owner.workspaceId}/documents`, { title: 'x' })).status).toBe(403);
    expect((await viewer.req('POST', `/api/items/${it.id}/updates`, { body: 'I can comment' })).status).toBe(201);
    // Personal saved views are allowed for viewers.
    expect((await viewer.req('POST', `/api/boards/${b.board.id}/views`, { name: 'mine', type: 'table', personal: true })).status).toBe(201);
    expect((await viewer.req('POST', `/api/boards/${b.board.id}/views`, { name: 'shared', type: 'table' })).status).toBe(403);
  });

  it('board visibility and board-level roles', async () => {
    const owner = await signup();
    const m = await signup();
    await addMember(owner, m, 'member');
    const b = await createBoard(owner);
    // Members can edit workspace boards but not change structure/visibility.
    expect((await m.req('POST', `/api/boards/${b.board.id}/items`, { name: 'ok' })).status).toBe(201);
    expect((await m.req('PATCH', `/api/boards/${b.board.id}`, { visibility: 'private' })).status).toBe(403);
    expect((await m.req('POST', `/api/boards/${b.board.id}/columns`, { title: 'x', type: 'text' })).status).toBe(403);
    expect((await m.req('POST', `/api/boards/${b.board.id}/archive`, {})).status).toBe(403);
    // Restrict member to viewer on this board.
    await owner.json('PUT', `/api/boards/${b.board.id}/members`, { userId: m.userId, role: 'viewer' });
    expect((await m.req('POST', `/api/boards/${b.board.id}/items`, { name: 'no' })).status).toBe(403);
    // Make private: member (still a board viewer) can view; remove and they lose access.
    await owner.json('PATCH', `/api/boards/${b.board.id}`, { visibility: 'private' });
    expect((await m.req('GET', `/api/boards/${b.board.id}`)).status).toBe(200);
    await owner.json('DELETE', `/api/boards/${b.board.id}/members/${m.userId}`, {});
    expect((await m.req('GET', `/api/boards/${b.board.id}`)).status).toBe(404);
    // Board owner role grants admin.
    await owner.json('PUT', `/api/boards/${b.board.id}/members`, { userId: m.userId, role: 'owner' });
    expect((await m.json('GET', `/api/boards/${b.board.id}`)).board.access).toBe('admin');
    // Last board owner cannot be removed.
    await owner.json('DELETE', `/api/boards/${b.board.id}/members/${m.userId}`, {});
    expect((await owner.req('DELETE', `/api/boards/${b.board.id}/members/${owner.userId}`, {})).status).toBe(400);
    // Board members must be workspace members.
    const stranger = await signup();
    expect((await owner.req('PUT', `/api/boards/${b.board.id}/members`, { userId: stranger.userId, role: 'editor' })).status).toBe(400);
  });

  it('teams CRUD for admins', async () => {
    const owner = await signup();
    const m = await signup();
    await addMember(owner, m);
    const t = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/teams`, { name: 'Design', memberIds: [m.userId, 'not-a-member'] });
    let teams = await m.json('GET', `/api/workspaces/${owner.workspaceId}/teams`);
    expect(teams[0]).toMatchObject({ id: t.id, name: 'Design', memberIds: [m.userId] });
    await owner.json('PATCH', `/api/workspaces/${owner.workspaceId}/teams/${t.id}`, { name: 'Product design', memberIds: [] });
    teams = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/teams`);
    expect(teams[0]).toMatchObject({ name: 'Product design', memberIds: [] });
    await owner.json('DELETE', `/api/workspaces/${owner.workspaceId}/teams/${t.id}`, {});
    expect(await owner.json('GET', `/api/workspaces/${owner.workspaceId}/teams`)).toHaveLength(0);
  });

  it('profile settings validate input', async () => {
    const c = await signup();
    const u = await c.json('PATCH', '/api/me', { name: 'New Name', timezone: 'Europe/London', theme: 'dark', locale: 'fr', preferences: { density: 'compact' } });
    expect(u).toMatchObject({ name: 'New Name', timezone: 'Europe/London', theme: 'dark', locale: 'fr', preferences: { density: 'compact' } });
    expect((await c.req('PATCH', '/api/me', { timezone: 'Mars/Olympus' })).status).toBe(400);
    expect((await c.req('PATCH', '/api/me', { theme: 'neon' })).status).toBe(400);
  });

  it('export is a complete JSON dump of only this workspace', async () => {
    const c = await signup();
    const other = await signup();
    await createBoard(other, 'Other workspace board');
    const b = await createBoard(c, 'Exported board');
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'exported item' });
    const res = await c.req('GET', `/api/workspaces/${c.workspaceId}/export`);
    expect(res.headers.get('Content-Disposition')).toContain('attachment');
    const data = (await res.json()) as any;
    expect(data.format).toBe('workos-export-v1');
    expect(data.boards.map((x: any) => x.name)).toEqual(['Exported board']);
    expect(data.items.map((x: any) => x.name)).toEqual(['exported item']);
    expect(JSON.stringify(data)).not.toContain('Other workspace board');
    expect(JSON.stringify(data)).not.toMatch(/password_hash|token_hash/);
  });
});

describe('dashboards and goals permissions', () => {
  it('viewers can read but not edit dashboards; only creators/admins delete', async () => {
    const owner = await signup();
    const viewer = await signup();
    const member = await signup();
    await addMember(owner, viewer, 'viewer');
    await addMember(owner, member, 'member');
    const d = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/dashboards`, { name: 'D' });
    expect((await viewer.req('GET', `/api/dashboards/${d.id}/data`)).status).toBe(200);
    expect((await viewer.req('PATCH', `/api/dashboards/${d.id}`, { name: 'x' })).status).toBe(403);
    expect((await viewer.req('POST', `/api/dashboards/${d.id}/widgets`, { type: 'number', title: 'x' })).status).toBe(403);
    expect((await member.req('DELETE', `/api/dashboards/${d.id}`, {})).status).toBe(403);
    const g = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/goals`, { title: 'G' });
    expect((await viewer.req('PATCH', `/api/goals/${g.id}`, { title: 'x' })).status).toBe(403);
    expect((await member.req('DELETE', `/api/goals/${g.id}`, {})).status).toBe(403);
  });
});
