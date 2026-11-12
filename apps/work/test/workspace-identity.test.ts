// Workspace renaming and identification colours (owner's request, 12 Nov 2026): rename keeps the id and everything
// in the workspace, names are unique per person (ignoring case), colours come from the palette or a custom #rrggbb,
// only owners and admins change them, and every change is in both audit records.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup } from './helpers';
import { WORKSPACE_COLORS, parseHexColor, workspaceColorName, workspaceNameKey } from '../src/shared/workspace-colors';
import { DEFAULT_COLOR } from '../src/shared/brand';

describe('workspace colour palette', () => {
  it('has ten named, distinct colours including BIZOMAT teal, and reads custom colours strictly', () => {
    expect(WORKSPACE_COLORS.map((c) => c.name)).toEqual(['Blue', 'Teal', 'Green', 'Orange', 'Amber', 'Red', 'Purple', 'Pink', 'Indigo', 'Grey']);
    expect(new Set(WORKSPACE_COLORS.map((c) => c.hex)).size).toBe(10);
    for (const c of WORKSPACE_COLORS) expect(c.hex).toMatch(/^#[0-9a-f]{6}$/);
    expect(workspaceColorName(DEFAULT_COLOR)).toBe('Teal');
    expect(workspaceColorName('#0F766E')).toBe('Teal');
    expect(workspaceColorName('#123456')).toBeNull();
    // Not the task status or priority colours.
    for (const used of ['#94a3b8', '#f5a524', '#e5484d', '#00a36c', '#7f1d1d', '#0ea5e9']) expect(WORKSPACE_COLORS.map((c) => c.hex)).not.toContain(used);
    expect(parseHexColor(' #1A2b3C ')).toBe('#1a2b3c');
    expect(parseHexColor('1a2b3c')).toBe('#1a2b3c');
    for (const bad of ['', 'red', '#12345', '#1234567', '#gggggg', 'rgb(1,2,3)']) expect(parseHexColor(bad)).toBeNull();
    expect(workspaceNameKey('  Acme Ops ')).toBe(workspaceNameKey('acme ops'));
  });
});

describe('renaming a workspace', () => {
  it('persists the new name, keeps the id, and leaves boards, items and members intact', async () => {
    const owner = await signup('Robin Owner');
    const ws = await owner.json('POST', '/api/workspaces', { name: 'Northwind Ops' });
    const member = await signup('Sam Member');
    await addMember(owner, member, 'member', ws.id);
    const board = await owner.json('POST', `/api/workspaces/${ws.id}/boards`, { name: 'Harbour fit-out', templateId: 'project-plan', withSampleItems: true });
    const before = await owner.json('GET', `/api/boards/${board.id}`);
    const membersBefore = await owner.json('GET', `/api/workspaces/${ws.id}/members`);

    const res = await owner.json('PATCH', `/api/workspaces/${ws.id}`, { name: '  Northwind Operations  ' });
    expect(res.workspace).toMatchObject({ id: ws.id, name: 'Northwind Operations' });

    const got = await owner.json('GET', `/api/workspaces/${ws.id}`);
    expect(got).toMatchObject({ id: ws.id, name: 'Northwind Operations', color: ws.color });
    expect((await owner.json('GET', '/api/workspaces')).find((w: any) => w.id === ws.id).name).toBe('Northwind Operations');
    expect((await owner.json('GET', '/api/auth/me')).workspaces.find((w: any) => w.id === ws.id).name).toBe('Northwind Operations');
    // The other member sees the new name too, under the same id.
    expect((await member.json('GET', '/api/workspaces')).find((w: any) => w.id === ws.id).name).toBe('Northwind Operations');

    // Renaming never creates a workspace: the count is the same and the old id still answers.
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM workspaces WHERE created_by = ?').bind(owner.userId).first<{ n: number }>();
    expect(count?.n).toBe(2); // the sign-up workspace and this one
    const after = await owner.json('GET', `/api/boards/${board.id}`);
    expect(after.board.workspaceId).toBe(ws.id);
    expect(after.items.map((i: any) => i.id).sort()).toEqual(before.items.map((i: any) => i.id).sort());
    expect(after.groups.map((g: any) => g.id)).toEqual(before.groups.map((g: any) => g.id));
    expect((await owner.json('GET', `/api/workspaces/${ws.id}/boards`)).map((b: any) => b.id)).toContain(board.id);
    const membersAfter = await owner.json('GET', `/api/workspaces/${ws.id}/members`);
    expect(membersAfter.map((m: any) => `${m.id}:${m.role}`).sort()).toEqual(membersBefore.map((m: any) => `${m.id}:${m.role}`).sort());
  });

  it('refuses a name already used by another of your workspaces, ignoring case and spaces (409)', async () => {
    const c = await signup();
    const alpha = await c.json('POST', '/api/workspaces', { name: 'Alpha Projects' });
    const beta = await c.json('POST', '/api/workspaces', { name: 'Beta Projects' });
    for (const name of ['Alpha Projects', 'alpha projects', '  ALPHA PROJECTS ']) {
      const r = await c.req('PATCH', `/api/workspaces/${beta.id}`, { name });
      expect(r.status).toBe(409);
      expect(((await r.json()) as any).error).toMatch(/already belong to a workspace called "Alpha Projects"/);
    }
    expect((await c.json('GET', `/api/workspaces/${beta.id}`)).name).toBe('Beta Projects');
    // Changing only the letter case of a workspace's own name is fine.
    await c.json('PATCH', `/api/workspaces/${alpha.id}`, { name: 'ALPHA Projects' });
    expect((await c.json('GET', `/api/workspaces/${alpha.id}`)).name).toBe('ALPHA Projects');
    // A workspace you do not belong to does not count.
    const other = await signup();
    await other.json('POST', '/api/workspaces', { name: 'Gamma Projects' });
    await c.json('PATCH', `/api/workspaces/${beta.id}`, { name: 'Gamma Projects' });
    expect((await c.json('GET', `/api/workspaces/${beta.id}`)).name).toBe('Gamma Projects');
  });

  it('refuses empty and over-long names, and stores the trimmed name', async () => {
    const c = await signup();
    const ws = await c.json('POST', '/api/workspaces', { name: 'Delta' });
    for (const name of ['', '   ', 'x'.repeat(101)]) {
      const r = await c.req('PATCH', `/api/workspaces/${ws.id}`, { name });
      expect(r.status).toBe(400);
    }
    expect((await c.req('PATCH', `/api/workspaces/${ws.id}`, { name: 42 })).status).toBe(400);
    expect((await c.json('GET', `/api/workspaces/${ws.id}`)).name).toBe('Delta');
    await c.json('PATCH', `/api/workspaces/${ws.id}`, { name: `  ${'y'.repeat(100)}  ` });
    expect((await c.json('GET', `/api/workspaces/${ws.id}`)).name).toBe('y'.repeat(100));
  });
});

describe('workspace colour', () => {
  it('accepts a palette colour or a custom hex colour and refuses anything else', async () => {
    const c = await signup();
    const ws = await c.json('POST', '/api/workspaces', { name: 'Epsilon' });
    const indigo = WORKSPACE_COLORS.find((x) => x.name === 'Indigo')!.hex;
    await c.json('PATCH', `/api/workspaces/${ws.id}`, { color: indigo });
    expect((await c.json('GET', `/api/workspaces/${ws.id}`)).color).toBe(indigo);
    await c.json('PATCH', `/api/workspaces/${ws.id}`, { color: '#1A2B3C' });
    expect((await c.json('GET', `/api/workspaces/${ws.id}`)).color).toBe('#1A2B3C');
    for (const color of ['red', '#12345', '#1234567', '#gggggg', 'url(x)', '']) {
      const r = await c.req('PATCH', `/api/workspaces/${ws.id}`, { color });
      expect(r.status, color).toBe(400);
    }
    expect((await c.json('GET', `/api/workspaces/${ws.id}`)).color).toBe('#1A2B3C');
    // The colour is in every list that shows the workspace.
    expect((await c.json('GET', '/api/auth/me')).workspaces.find((w: any) => w.id === ws.id).color).toBe('#1A2B3C');
  });
});

describe('who may rename or recolour', () => {
  it('owners and admins may; members, viewers and outsiders may not', async () => {
    const owner = await signup('Owner');
    const ws = owner.workspaceId;
    const admin = await signup('Admin');
    const member = await signup('Member');
    const viewer = await signup('Viewer');
    const outsider = await signup('Outsider');
    await addMember(owner, admin, 'admin');
    await addMember(owner, member, 'member');
    await addMember(owner, viewer, 'viewer');
    for (const who of [member, viewer]) {
      expect((await who.req('PATCH', `/api/workspaces/${ws}`, { name: 'Taken over' })).status).toBe(403);
      expect((await who.req('PATCH', `/api/workspaces/${ws}`, { color: '#b91c1c' })).status).toBe(403);
    }
    expect((await outsider.req('PATCH', `/api/workspaces/${ws}`, { name: 'Taken over' })).status).toBe(404);
    const unchanged = await owner.json('GET', `/api/workspaces/${ws}`);
    expect(unchanged.name).not.toBe('Taken over');
    await admin.json('PATCH', `/api/workspaces/${ws}`, { name: 'Admin renamed', color: '#b91c1c' });
    expect(await owner.json('GET', `/api/workspaces/${ws}`)).toMatchObject({ name: 'Admin renamed', color: '#b91c1c' });
  });
});

describe('audit of workspace identity changes', () => {
  it('records workspace.renamed and workspace.color_changed with before and after, only when they change', async () => {
    const c = await signup('Audit Owner');
    const ws = await c.json('POST', '/api/workspaces', { name: 'Zeta' });
    await c.json('PATCH', `/api/workspaces/${ws.id}`, { name: 'Zeta Works', color: '#7e22ce' });
    // The same values again: nothing new to record.
    await c.json('PATCH', `/api/workspaces/${ws.id}`, { name: 'Zeta Works', color: '#7E22CE' });
    await c.json('PATCH', `/api/workspaces/${ws.id}`, { description: 'Only the description' });

    const log = await c.json('GET', `/api/workspaces/${ws.id}/audit`);
    const renamed = log.filter((r: any) => r.action === 'workspace.renamed');
    const recoloured = log.filter((r: any) => r.action === 'workspace.color_changed');
    expect(renamed).toHaveLength(1);
    expect(renamed[0]).toMatchObject({ actor_id: c.userId, target_type: 'workspace', target_id: ws.id, metadata: { from: 'Zeta', to: 'Zeta Works' } });
    expect(recoloured).toHaveLength(1);
    expect(recoloured[0].metadata).toEqual({ from: ws.color, to: '#7e22ce' });
    expect(log.filter((r: any) => r.action === 'workspace.updated')).toHaveLength(3);

    const events = await c.json('GET', `/api/workspaces/${ws.id}/audit-events?type=workspace.`);
    expect(events.map((e: any) => e.type).sort()).toEqual(['workspace.color_changed', 'workspace.renamed']);
    expect(events.find((e: any) => e.type === 'workspace.renamed')).toMatchObject({ actorId: c.userId, before: 'Zeta', after: 'Zeta Works' });
    expect(events.find((e: any) => e.type === 'workspace.color_changed')).toMatchObject({ before: ws.color, after: '#7e22ce' });
  });

  it('a refused rename leaves no audit row', async () => {
    const c = await signup();
    await c.json('POST', '/api/workspaces', { name: 'Eta' });
    const theta = await c.json('POST', '/api/workspaces', { name: 'Theta' });
    expect((await c.req('PATCH', `/api/workspaces/${theta.id}`, { name: 'eta' })).status).toBe(409);
    const log = await c.json('GET', `/api/workspaces/${theta.id}/audit`);
    expect(log.some((r: any) => r.action === 'workspace.renamed' || r.action === 'workspace.updated')).toBe(false);
  });
});

describe('boards still open by id after a rename', () => {
  it('keeps board URLs working', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Route check');
    await c.json('PATCH', `/api/workspaces/${c.workspaceId}`, { name: 'Renamed home' });
    expect((await c.req('GET', `/api/boards/${b.board.id}`)).status).toBe(200);
    expect((await c.req('GET', `/api/workspaces/${c.workspaceId}/boards`)).status).toBe(200);
  });
});
