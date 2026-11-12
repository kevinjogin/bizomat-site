// Organisations, invitations, roles and permissions (12 Nov 2026 platform upgrade).
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { addMember, signup, signupWith, uniqueEmail, type Client } from './helpers';

async function invite(owner: Client, email: string, role: string, extra: Record<string, unknown> = {}, wsId = owner.workspaceId) {
  return owner.json('POST', `/api/workspaces/${wsId}/invitations`, { email, role, ...extra });
}
const tokenOf = (inv: { inviteUrl: string }) => inv.inviteUrl.split('/invite/')[1];

async function join(owner: Client, role: string, extra: Record<string, unknown> = {}) {
  const email = uniqueEmail(role);
  const inv = await invite(owner, email, role, extra);
  return signupWith(role, email, tokenOf(inv));
}

async function project(owner: Client, name = 'Project A', visibility: 'workspace' | 'private' = 'workspace') {
  const b = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/boards`, { name, templateId: 'project-plan', withSampleItems: true, visibility });
  return owner.json('GET', `/api/boards/${b.id}`);
}

describe('organisation membership and invitations', () => {
  it('stores only the token hash, sends a single-use seven-day link, and a resend rotates it', async () => {
    const owner = await signup('Owner');
    const email = uniqueEmail('inv');
    const inv = await invite(owner, email, 'member');
    expect(inv.expiresAt - Date.now()).toBeGreaterThan(6.9 * 86_400_000);
    const row = await env.DB.prepare('SELECT token_hash FROM invitations WHERE id = ?').bind(inv.id).first<{ token_hash: string }>();
    expect(row!.token_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(row!.token_hash).not.toContain(tokenOf(inv));
    const resent = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations/${inv.id}/resend`, {});
    expect(tokenOf(resent)).not.toBe(tokenOf(inv));
    // The old link stops working; the new one works once.
    expect((await signup('Other')).req('POST', `/api/auth/invitations/${tokenOf(inv)}/accept`, {}).then((r) => r.status)).resolves.toBe(404);
    const person = await signupWith('Invitee', email, tokenOf(resent));
    expect((await person.json('GET', '/api/workspaces')).some((w: any) => w.id === owner.workspaceId)).toBe(true);
    const list = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/invitations`);
    expect(list.find((i: any) => i.id === inv.id).status).toBe('accepted');
    // Resending an accepted invitation is refused.
    expect((await owner.req('POST', `/api/workspaces/${owner.workspaceId}/invitations/${inv.id}/resend`, {})).status).toBe(409);
  });

  it('a second invitation to the same address replaces the first; existing members cannot be invited', async () => {
    const owner = await signup();
    const email = uniqueEmail('dup');
    const first = await invite(owner, email, 'viewer');
    const second = await invite(owner, email, 'member');
    const list = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/invitations`);
    expect(list.find((i: any) => i.id === first.id).status).toBe('revoked');
    expect(list.find((i: any) => i.id === second.id).status).toBe('pending');
    const p = await signupWith('P', email, tokenOf(second));
    expect((await owner.req('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: p.email, role: 'viewer' })).status).toBe(409);
    expect((await p.req('POST', `/api/auth/invitations/${tokenOf(first)}/accept`, {})).status).toBe(404);
  });

  it('existing users accept with the token and the inviter is notified', async () => {
    const owner = await signup('Owner');
    const existing = await signup('Existing');
    const inv = await invite(owner, existing.email, 'viewer');
    await existing.json('POST', `/api/auth/invitations/${tokenOf(inv)}/accept`, {});
    const ws = await existing.json('GET', '/api/workspaces');
    expect(ws.find((w: any) => w.id === owner.workspaceId).role).toBe('viewer');
    const n = await owner.json('GET', `/api/notifications?workspaceId=${owner.workspaceId}`);
    expect(n.notifications.some((x: any) => x.type === 'invitation_accepted')).toBe(true);
    const audit = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/audit-events`);
    expect(audit.some((e: any) => e.type === 'invitation.sent')).toBe(true);
    expect(audit.some((e: any) => e.type === 'invitation.accepted')).toBe(true);
  });

  it('only admins invite project managers and admins; members only when allowed and never admins', async () => {
    const owner = await signup();
    const pm = await join(owner, 'project_manager');
    expect((await pm.req('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: uniqueEmail(), role: 'admin' })).status).toBe(403);
    expect((await pm.req('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: uniqueEmail(), role: 'project_manager' })).status).toBe(403);
    expect((await pm.req('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: uniqueEmail(), role: 'guest' })).status).toBe(201);
    const member = await join(owner, 'member');
    expect((await member.req('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: uniqueEmail(), role: 'member' })).status).toBe(403);
  });

  it('suspension cuts access without deleting anything; restoring gives it back', async () => {
    const owner = await signup();
    const member = await join(owner, 'member');
    const b = await project(owner);
    expect((await member.req('GET', `/api/boards/${b.board.id}`)).status).toBe(200);
    await owner.json('POST', `/api/workspaces/${owner.workspaceId}/members/${member.userId}/suspend`, { suspended: true });
    expect((await member.req('GET', `/api/boards/${b.board.id}`)).status).toBe(404);
    expect((await member.json('GET', '/api/workspaces')).some((w: any) => w.id === owner.workspaceId)).toBe(false);
    const dir = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/members/directory`);
    expect(dir.find((m: any) => m.id === member.userId).status).toBe('suspended');
    // The last owner cannot be suspended, and nobody suspends themselves.
    expect((await owner.req('POST', `/api/workspaces/${owner.workspaceId}/members/${owner.userId}/suspend`, { suspended: true })).status).toBe(400);
    await owner.json('POST', `/api/workspaces/${owner.workspaceId}/members/${member.userId}/suspend`, { suspended: false });
    expect((await member.req('GET', `/api/boards/${b.board.id}`)).status).toBe(200);
  });

  it('removing a member removes their project and task grants', async () => {
    const owner = await signup();
    const guest = await join(owner, 'guest');
    const b = await project(owner);
    const item = b.items.find((i: any) => !i.parentItemId);
    await owner.json('PUT', `/api/items/${item.id}/access/${guest.userId}`, { canUpdateStatus: true });
    await owner.json('DELETE', `/api/workspaces/${owner.workspaceId}/members/${guest.userId}`, {});
    const left = await env.DB.prepare('SELECT COUNT(*) AS n FROM item_permissions WHERE user_id = ?').bind(guest.userId).first<{ n: number }>();
    expect(left!.n).toBe(0);
    expect((await guest.req('GET', `/api/items/${item.id}`)).status).toBe(404);
  });

  it('nobody raises their own role; an admin cannot make themselves owner', async () => {
    const owner = await signup();
    const admin = await join(owner, 'admin');
    expect((await admin.req('PATCH', `/api/workspaces/${owner.workspaceId}/members/${admin.userId}`, { role: 'owner' })).status).toBe(403);
    const member = await join(owner, 'member');
    expect((await member.req('PATCH', `/api/workspaces/${owner.workspaceId}/members/${member.userId}`, { role: 'admin' })).status).toBe(403);
  });
});

describe('role-based and project-level access', () => {
  it('guests see nothing organisation-wide: only what is shared with them', async () => {
    const owner = await signup();
    const guest = await join(owner, 'guest');
    const a = await project(owner, 'Shared');
    const b = await project(owner, 'Not shared');
    expect(await guest.json('GET', `/api/workspaces/${owner.workspaceId}/boards`)).toHaveLength(0);
    expect((await guest.req('GET', `/api/boards/${a.board.id}`)).status).toBe(404);
    await owner.json('PUT', `/api/boards/${a.board.id}/access/${guest.userId}`, { level: 'view' });
    const boards = await guest.json('GET', `/api/workspaces/${owner.workspaceId}/boards`);
    expect(boards.map((x: any) => x.id)).toEqual([a.board.id]);
    expect((await guest.req('GET', `/api/boards/${b.board.id}`)).status).toBe(404);
    // Read-only on what they see.
    const it1 = a.items.find((i: any) => !i.parentItemId);
    expect((await guest.req('PATCH', `/api/items/${it1.id}`, { name: 'changed' })).status).toBe(403);
    // A guest does not see the organisation's member list.
    const members = await guest.json('GET', `/api/workspaces/${owner.workspaceId}/members`);
    expect(members.length).toBeLessThan(3);
  });

  it('full access to project A and read-only to project B for the same person', async () => {
    const owner = await signup();
    const eng = await join(owner, 'member');
    const a = await project(owner, 'A', 'private');
    const b = await project(owner, 'B', 'private');
    await owner.json('PUT', `/api/boards/${a.board.id}/access/${eng.userId}`, { level: 'edit' });
    await owner.json('PUT', `/api/boards/${b.board.id}/access/${eng.userId}`, { level: 'view' });
    const ia = a.items.find((i: any) => !i.parentItemId);
    const ib = b.items.find((i: any) => !i.parentItemId);
    expect((await eng.req('PATCH', `/api/items/${ia.id}`, { name: 'Edited in A' })).status).toBe(200);
    expect((await eng.req('PATCH', `/api/items/${ib.id}`, { name: 'Edited in B' })).status).toBe(403);
    expect((await eng.req('POST', `/api/boards/${b.board.id}/items`, { name: 'new' })).status).toBe(403);
    expect((await eng.req('DELETE', `/api/items/${ib.id}`)).status).toBe(403);
  });

  it('"No access" hides a workspace-wide project from one person, but never from an admin', async () => {
    const owner = await signup();
    const member = await join(owner, 'member');
    const admin = await join(owner, 'admin');
    const a = await project(owner);
    await owner.json('PUT', `/api/boards/${a.board.id}/access/${member.userId}`, { level: 'none' });
    expect((await member.req('GET', `/api/boards/${a.board.id}`)).status).toBe(404);
    expect((await owner.req('PUT', `/api/boards/${a.board.id}/access/${admin.userId}`, { level: 'none' })).status).toBe(400);
    expect((await admin.req('GET', `/api/boards/${a.board.id}`)).status).toBe(200);
  });

  it('capabilities can be switched off per person (create, delete, assign)', async () => {
    const owner = await signup();
    const member = await join(owner, 'member');
    const a = await project(owner);
    await owner.json('PUT', `/api/boards/${a.board.id}/access/${member.userId}`, { level: 'edit', overrides: { createTasks: false, deleteTasks: false, assignTasks: false } });
    const it1 = a.items.find((i: any) => !i.parentItemId);
    const person = a.columns.find((c: any) => c.type === 'person');
    expect((await member.req('POST', `/api/boards/${a.board.id}/items`, { name: 'x' })).status).toBe(403);
    expect((await member.req('DELETE', `/api/items/${it1.id}`)).status).toBe(403);
    expect((await member.req('PATCH', `/api/items/${it1.id}`, { values: { [person.id]: owner.userId } })).status).toBe(403);
    expect((await member.req('PATCH', `/api/items/${it1.id}`, { name: 'still editable' })).status).toBe(200);
    const bundle = await member.json('GET', `/api/boards/${a.board.id}`);
    expect(bundle.board.caps).toMatchObject({ level: 'edit', createTasks: false, deleteTasks: false, assignTasks: false });
  });

  it('no privilege escalation through project access', async () => {
    const owner = await signup();
    const pm = await join(owner, 'member');
    const other = await join(owner, 'member');
    const a = await project(owner, 'A', 'private');
    await owner.json('PUT', `/api/boards/${a.board.id}/access/${pm.userId}`, { level: 'edit', overrides: { manageMembers: true } });
    // Can add people up to their own level, not above, and cannot change themselves.
    expect((await pm.req('PUT', `/api/boards/${a.board.id}/access/${other.userId}`, { level: 'edit' })).status).toBe(200);
    expect((await pm.req('PUT', `/api/boards/${a.board.id}/access/${other.userId}`, { level: 'manage' })).status).toBe(403);
    expect((await pm.req('PUT', `/api/boards/${a.board.id}/access/${pm.userId}`, { level: 'manage' })).status).toBe(403);
    expect((await pm.req('PUT', `/api/boards/${a.board.id}/access/${other.userId}`, { level: 'view', overrides: { generateReports: true } })).status).toBe(403);
    // Someone without manage-members cannot touch access at all.
    expect((await other.req('PUT', `/api/boards/${a.board.id}/access/${pm.userId}`, { level: 'none' })).status).toBe(403);
    expect((await other.req('GET', `/api/boards/${a.board.id}/access`)).status).toBe(403);
  });

  it('organisations are isolated: direct API calls across organisations answer 404', async () => {
    const a = await signup('A');
    const b = await signup('B');
    const pa = await project(a);
    const item = pa.items[0];
    for (const [m, p] of [
      ['GET', `/api/boards/${pa.board.id}`],
      ['GET', `/api/items/${item.id}`],
      ['GET', `/api/items/${item.id}/context`],
      ['GET', `/api/boards/${pa.board.id}/access`],
      ['GET', `/api/boards/${pa.board.id}/finance`],
      ['GET', `/api/boards/${pa.board.id}/reports`],
      ['POST', `/api/boards/${pa.board.id}/reports/preview`],
      ['PUT', `/api/items/${item.id}/access/${b.userId}`],
      ['GET', `/api/workspaces/${a.workspaceId}/members/directory`],
      ['GET', `/api/workspaces/${a.workspaceId}/email`],
      ['GET', `/api/workspaces/${a.workspaceId}/audit-events`],
    ] as const) {
      const res = await b.req(m, p, m === 'GET' ? undefined : { type: 'inception' });
      expect([403, 404], `${m} ${p}`).toContain(res.status);
    }
  });
});

describe('task-level access', () => {
  it('a contractor sees one maintenance task and nothing else', async () => {
    const owner = await signup('Owner');
    const contractor = await join(owner, 'guest');
    const a = await project(owner, 'Plant');
    const [task, other] = a.items.filter((i: any) => !i.parentItemId);
    const status = a.columns.find((c: any) => c.type === 'status');
    await owner.json('PUT', `/api/items/${task.id}/access/${contractor.userId}`, { canUpdateStatus: true, canComment: true, canUpload: false });
    // The task: yes. Its board, other tasks, other projects: no.
    const got = await contractor.json('GET', `/api/items/${task.id}`);
    expect(got.board.projectAccess).toBe(false);
    expect(got.caps).toMatchObject({ view: true, edit: false, updateStatus: true, comment: true, upload: false, via: 'task' });
    expect((await contractor.req('GET', `/api/boards/${a.board.id}`)).status).toBe(404);
    expect((await contractor.req('GET', `/api/items/${other.id}`)).status).toBe(404);
    expect(await contractor.json('GET', `/api/workspaces/${owner.workspaceId}/boards`)).toHaveLength(0);
    // What the grant allows, and only that.
    expect((await contractor.req('PATCH', `/api/items/${task.id}`, { values: { [status.id]: 'working' } })).status).toBe(200);
    expect((await contractor.req('PATCH', `/api/items/${task.id}`, { name: 'Renamed' })).status).toBe(403);
    expect((await contractor.req('POST', `/api/items/${task.id}/updates`, { body: 'On site tomorrow' })).status).toBe(201);
    expect((await contractor.req('DELETE', `/api/items/${task.id}`)).status).toBe(403);
    expect((await contractor.req('POST', `/api/items/${task.id}/move`, { groupId: task.groupId })).status).toBe(403);
    // The standalone task page has what it needs, and no other task.
    const ctx = await contractor.json('GET', `/api/items/${task.id}/context`);
    expect(ctx.projectAccess).toBe(false);
    expect(ctx.items.map((i: any) => i.id)).toContain(task.id);
    expect(ctx.items.map((i: any) => i.id)).not.toContain(other.id);
    const shared = await contractor.json('GET', `/api/workspaces/${owner.workspaceId}/shared-tasks`);
    expect(shared.map((s: any) => s.id)).toEqual([task.id]);
  });

  it('a task cannot be assigned to someone who has no access to it', async () => {
    const owner = await signup();
    const guest = await join(owner, 'guest');
    const a = await project(owner);
    const task = a.items.find((i: any) => !i.parentItemId);
    const person = a.columns.find((c: any) => c.type === 'person');
    const res = await owner.req('PATCH', `/api/items/${task.id}`, { values: { [person.id]: guest.userId } });
    expect(res.status).toBe(422);
    expect(await res.text()).toMatch(/access/i);
    await owner.json('PUT', `/api/items/${task.id}/access/${guest.userId}`, {});
    expect((await owner.req('PATCH', `/api/items/${task.id}`, { values: { [person.id]: guest.userId } })).status).toBe(200);
    const picker = await owner.json('GET', `/api/items/${task.id}/assignable`);
    expect(picker.people.find((p: any) => p.id === guest.userId).access).toBe('task');
    const work = await guest.json('GET', `/api/workspaces/${owner.workspaceId}/my-work`);
    const all = [...work.overdue, ...work.today, ...work.upcoming, ...work.later, ...work.noDate, ...work.completed];
    expect(all.some((w: any) => w.item.id === task.id)).toBe(true);
  });

  it('an invitation can carry access to one task', async () => {
    const owner = await signup();
    const a = await project(owner);
    const task = a.items.find((i: any) => !i.parentItemId);
    const email = uniqueEmail('contractor');
    const inv = await invite(owner, email, 'guest', { grants: [{ kind: 'item', id: task.id, canUpdateStatus: true }] });
    const c = await signupWith('Contractor', email, tokenOf(inv));
    expect((await c.req('GET', `/api/items/${task.id}`)).status).toBe(200);
    expect((await c.req('GET', `/api/boards/${a.board.id}`)).status).toBe(404);
  });

  it('only people who manage the project share its tasks', async () => {
    const owner = await signup();
    const viewer = await join(owner, 'viewer');
    const guest = await join(owner, 'guest');
    const a = await project(owner);
    const task = a.items.find((i: any) => !i.parentItemId);
    expect((await viewer.req('PUT', `/api/items/${task.id}/access/${guest.userId}`, {})).status).toBe(403);
  });
});

describe('financial data access', () => {
  it('finance can be restricted to project managers; values never reach others', async () => {
    const owner = await signup();
    const member = await signup('Member');
    await addMember(owner, member, 'member');
    const a = await project(owner);
    const budget = a.columns.find((c: any) => c.type === 'currency');
    const task = a.items.find((i: any) => !i.parentItemId);
    await owner.json('PATCH', `/api/items/${task.id}`, { values: { [budget.id]: 1234.5 } });
    await owner.json('PUT', `/api/workspaces/${owner.workspaceId}/finance`, { visibility: 'managers' });
    const bundle = await member.json('GET', `/api/boards/${a.board.id}`);
    expect(bundle.columns.some((c: any) => c.id === budget.id)).toBe(false);
    expect(bundle.items.every((i: any) => i.values[budget.id] === undefined)).toBe(true);
    expect(bundle.finance.hiddenColumns).toBeGreaterThan(0);
    const item = await member.json('GET', `/api/items/${task.id}`);
    expect(item.item.values[budget.id]).toBeUndefined();
    const act = await member.json('GET', `/api/items/${task.id}/activity`);
    expect(act.filter((x: any) => x.columnId === budget.id).every((x: any) => x.newValue === null && x.restricted)).toBe(true);
    expect((await member.req('PATCH', `/api/items/${task.id}`, { values: { [budget.id]: 1 } })).status).toBe(403);
    expect((await member.req('GET', `/api/boards/${a.board.id}/finance`)).status).toBe(403);
    // Search cannot be used to filter on the hidden amount either.
    const s = await member.json('POST', `/api/workspaces/${owner.workspaceId}/search`, { q: '', types: ['items'], filter: { op: 'and', rules: [{ field: budget.id, op: 'gt', value: 1000 }] } });
    expect((s.items ?? []).length).toBe(0);
    // Copying the project with its items would hand them the amounts (they would own the copy): refused.
    expect((await member.req('POST', `/api/boards/${a.board.id}/duplicate`, { withItems: true })).status).toBe(403);
    expect((await member.req('POST', `/api/boards/${a.board.id}/duplicate`, { withItems: false })).status).toBe(201);
    // The owner still sees everything.
    expect((await owner.json('GET', `/api/boards/${a.board.id}`)).items.find((i: any) => i.id === task.id).values[budget.id]).toBe(1234.5);
  });
});
