import { describe, expect, it } from 'vitest';
import { createBoard, signup } from './helpers';

describe('workspaces (critical test 3)', () => {
  it('creates, updates, lists and soft-deletes a workspace', async () => {
    const c = await signup();
    const ws = await c.json('POST', '/api/workspaces', { name: 'Marketing', color: '#00a36c' });
    expect(ws.role).toBe('owner');
    expect(ws.name).toBe('Marketing');
    await c.json('PATCH', `/api/workspaces/${ws.id}`, { name: 'Growth', settings: { allowMembersToInvite: true } });
    const got = await c.json('GET', `/api/workspaces/${ws.id}`);
    expect(got.name).toBe('Growth');
    expect(got.settings.allowMembersToInvite).toBe(true);
    const list = await c.json('GET', '/api/workspaces');
    expect(list.map((w: any) => w.id)).toContain(ws.id);
    expect((await c.req('DELETE', `/api/workspaces/${ws.id}`, { confirmName: 'wrong' })).status).toBe(400);
    await c.json('DELETE', `/api/workspaces/${ws.id}`, { confirmName: 'Growth' });
    expect((await c.req('GET', `/api/workspaces/${ws.id}`)).status).toBe(404);
    expect((await c.json('GET', '/api/workspaces')).map((w: any) => w.id)).not.toContain(ws.id);
    const audit = await c.json('GET', `/api/workspaces/${c.workspaceId}/audit`);
    expect(Array.isArray(audit)).toBe(true);
  });
});

describe('boards (critical test 4)', () => {
  it('creates a blank board with groups, columns and views', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Launch');
    expect(b.board.name).toBe('Launch');
    expect(b.board.access).toBe('admin');
    expect(b.groups.length).toBe(3);
    expect(b.columns.map((x: any) => x.type)).toEqual(['person', 'status', 'date', 'priority']);
    expect(b.views.map((v: any) => v.type)).toEqual(['table', 'kanban']);
    const kanban = b.views.find((v: any) => v.type === 'kanban');
    expect(kanban.settings.kanbanColumnId).toBe(b.columns.find((x: any) => x.type === 'status').id);
    expect(b.boardMembers).toEqual([{ userId: c.userId, role: 'owner' }]);
    const list = await c.json('GET', `/api/workspaces/${c.workspaceId}/boards`);
    expect(list.find((x: any) => x.id === b.board.id).itemCount).toBe(0);
  });

  it('creates boards from every builtin template', async () => {
    const c = await signup();
    const tpl = await c.json('GET', `/api/workspaces/${c.workspaceId}/templates`);
    expect(tpl.builtin.length).toBeGreaterThanOrEqual(6);
    for (const t of tpl.builtin) {
      const b = await createBoard(c, `From ${t.name}`, { templateId: t.id });
      expect(b.columns.length).toBe(t.columns.length);
      expect(b.views.map((v: any) => v.type)).toEqual(t.views.length ? t.views : ['table']);
      // View settings reference real column ids (placeholders resolved).
      for (const v of b.views) expect(JSON.stringify(v.settings)).not.toMatch(/"@/);
      if (t.id === 'project-plan') {
        expect(b.items.filter((i: any) => i.parentItemId).length).toBeGreaterThan(0);
        const timeline = b.columns.find((x: any) => x.type === 'timeline');
        expect(b.items.find((i: any) => !i.parentItemId).values[timeline.id].start).toMatch(/^\d{4}-/);
      }
      if (t.id === 'requests') {
        const form = b.views.find((v: any) => v.type === 'form');
        expect(b.groups.map((g: any) => g.id)).toContain(form.settings.formGroupId);
      }
    }
    const noSamples = await createBoard(c, 'Empty CRM', { templateId: 'crm', withSampleItems: false });
    expect(noSamples.items).toHaveLength(0);
    expect((await c.req('POST', `/api/workspaces/${c.workspaceId}/boards`, { name: 'x', templateId: 'nope' })).status).toBe(404);
  });

  it('renames, duplicates (with remapped ids), archives, restores and deletes', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Original', { templateId: 'crm' });
    await c.json('PATCH', `/api/boards/${b.board.id}`, { name: 'Renamed', description: 'desc' });
    const dup = await c.json('POST', `/api/boards/${b.board.id}/duplicate`, { name: 'Copy' });
    const copy = await c.json('GET', `/api/boards/${dup.id}`);
    expect(copy.board.name).toBe('Copy');
    expect(copy.items.length).toBe(b.items.length);
    const origIds = new Set([...b.columns.map((x: any) => x.id), ...b.groups.map((g: any) => g.id), ...b.items.map((i: any) => i.id)]);
    expect(JSON.stringify(copy)).not.toMatch(new RegExp(Array.from(origIds).join('|')));
    const value = copy.columns.find((x: any) => x.title === 'Deal value');
    expect(copy.items.some((i: any) => typeof i.values[value.id] === 'number')).toBe(true);

    await c.json('POST', `/api/boards/${b.board.id}/archive`, {});
    expect((await c.json('GET', `/api/workspaces/${c.workspaceId}/boards`)).map((x: any) => x.id)).not.toContain(b.board.id);
    expect((await c.json('GET', `/api/workspaces/${c.workspaceId}/boards?archived=1`)).map((x: any) => x.id)).toContain(b.board.id);
    // Archived boards are read-only for edits.
    expect((await c.req('POST', `/api/boards/${b.board.id}/items`, { name: 'x' })).status).toBe(409);
    await c.json('POST', `/api/boards/${b.board.id}/restore`, {});
    expect((await c.req('DELETE', `/api/boards/${b.board.id}`, { confirmName: 'nope' })).status).toBe(400);
    await c.json('DELETE', `/api/boards/${b.board.id}`, { confirmName: 'Renamed' });
    expect((await c.req('GET', `/api/boards/${b.board.id}`)).status).toBe(404);
    // Copy survives deletion of the original.
    expect((await c.req('GET', `/api/boards/${dup.id}`)).status).toBe(200);
  });

  it('saves a board as a workspace template and creates from it', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Process', { templateId: 'sprint' });
    const tpl = await c.json('POST', `/api/boards/${b.board.id}/save-as-template`, { name: 'Our sprint' });
    const list = await c.json('GET', `/api/workspaces/${c.workspaceId}/templates`);
    expect(list.workspace.map((t: any) => t.id)).toContain(tpl.id);
    // Templates are hidden from the normal board list.
    expect((await c.json('GET', `/api/workspaces/${c.workspaceId}/boards`)).map((x: any) => x.id)).not.toContain(tpl.id);
    const fromTpl = await createBoard(c, 'Sprint 2', { templateId: tpl.id });
    expect(fromTpl.columns.map((x: any) => x.title)).toEqual(b.columns.map((x: any) => x.title));
  });

  it('manages groups: create, rename, collapse, reorder, duplicate, archive, delete', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const g = await c.json('POST', `/api/boards/${b.board.id}/groups`, { name: 'Backlog', position: 'bottom' });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'in backlog', groupId: g.id });
    await c.json('PATCH', `/api/groups/${g.id}`, { name: 'Icebox', collapsed: true, color: '#e5484d' });
    // Reorder: move to the very top.
    await c.json('PATCH', `/api/groups/${g.id}`, { position: b.groups[0].position - 500 });
    let bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.groups[0]).toMatchObject({ id: g.id, name: 'Icebox', collapsed: true, color: '#e5484d' });
    const dup = await c.json('POST', `/api/groups/${g.id}/duplicate`, {});
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.filter((i: any) => i.groupId === dup.id).map((i: any) => i.name)).toEqual(['in backlog']);
    await c.json('POST', `/api/groups/${dup.id}/archive`, { archived: true });
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.groups.map((x: any) => x.id)).not.toContain(dup.id);
    expect(bundle.items.filter((i: any) => i.groupId === dup.id)).toHaveLength(0);
    await c.json('DELETE', `/api/groups/${g.id}`, {});
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.groups.map((x: any) => x.id)).not.toContain(g.id);
    expect(bundle.items.some((i: any) => i.name === 'in backlog')).toBe(false);
  });

  it('cannot delete the last group', async () => {
    const c = await signup();
    const b = await createBoard(c);
    await c.json('DELETE', `/api/groups/${b.groups[0].id}`, {});
    await c.json('DELETE', `/api/groups/${b.groups[1].id}`, {});
    expect((await c.req('DELETE', `/api/groups/${b.groups[2].id}`, {})).status).toBe(400);
  });

  it('personal boards are private to their creator', async () => {
    const c = await signup();
    const other = await signup();
    const { addMember } = await import('./helpers');
    await addMember(c, other, 'member');
    const p = await createBoard(c, 'My personal', { kind: 'personal' });
    expect(p.board.visibility).toBe('private');
    expect((await other.req('GET', `/api/boards/${p.board.id}`)).status).toBe(404);
    const list = await other.json('GET', `/api/workspaces/${c.workspaceId}/boards`);
    expect(list.map((x: any) => x.id)).not.toContain(p.board.id);
  });
});

describe('referential integrity', () => {
  it('deleting a board removes its groups, columns, items, updates, views, automations', async () => {
    const { env } = await import('cloudflare:test');
    const c = await signup();
    const b = await createBoard(c, 'Doomed');
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x' });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'sub', parentItemId: it.id });
    await c.json('POST', `/api/items/${it.id}/updates`, { body: 'hello' });
    await c.json('POST', `/api/items/${it.id}/time`, { minutes: 5, date: '2026-01-01' });
    await c.json('POST', `/api/boards/${b.board.id}/automations`, { name: 'a', trigger: { type: 'item_created' }, actions: [{ type: 'archive_item' }] });
    await c.json('DELETE', `/api/boards/${b.board.id}`, { confirmName: 'Doomed' });
    for (const t of ['groups', 'columns', 'items', 'views', 'updates', 'automations', 'board_members', 'time_entries']) {
      const r = await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE board_id = ?`).bind(b.board.id).first<{ n: number }>();
      expect(r!.n, t).toBe(0);
    }
  });
});
