// Moving tasks to another project or company (owner, 20 Nov 2026; services/item-transfer.ts; flag move_records, off):
// off until both companies have the flag; one task or many, each with its subtasks, comments, files, time and history;
// a new key in the new project; values carried by column type and title, labels by name, people only when they may open
// the new project; what is not carried listed first; refused for viewers, for tasks with financial data without the
// rights, and for API tokens limited to one company. Pure checks of the column matching at the end.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { carryValue, matchColumns } from '../src/worker/services/item-transfer';
import type { ColumnDTO } from '../src/shared/types';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

const flag = (scope: 'global' | 'company', scopeId = '', value = 'on') =>
  env.DB.prepare('INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1)').bind('move_records', scope, scopeId, value, 'test', 'test').run();

async function company(owner: Client, name: string) {
  const res = await owner.req('POST', '/api/company/companies', { kind: 'business', name, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  expect(res.status).toBe(201);
  const data = (await res.json()) as any;
  return { id: data.company.id as string, ws: data.tools.tasks as string };
}

// The person's own company, as the ERP makes it on a first visit.
const ownCompany = async (c: Client) => {
  await c.json('GET', '/api/system/me');
  return (await env.DB.prepare('SELECT id FROM sys_companies WHERE owner_id = ?').bind(c.userId).first<{ id: string }>())!.id;
};

async function boardIn(c: Client, ws: string, name: string) {
  const board = await c.json('POST', `/api/workspaces/${ws}/boards`, { name });
  return c.json('GET', `/api/boards/${board.id}`);
}

describe('moving tasks between projects and companies', () => {
  it('is off until the flag is on for both companies', async () => {
    const a = await signup();
    const b1 = await createBoard(a, 'Mine');
    const co = await company(a, 'Rivet Works');
    const b2 = await boardIn(a, co.ws, 'Theirs');
    const t = await a.json('POST', `/api/boards/${b1.board.id}/items`, { name: 'Wrong place' });

    expect((await a.json('GET', `/api/transfer/targets?from=${b1.board.id}`)).enabled).toBe(false);
    const off = await a.req('POST', `/api/boards/${b1.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: b2.board.id });
    expect(off.status).toBe(403);
    expect(((await off.json()) as any).details.code).toBe('MOVE_OFF');

    await flag('company', await ownCompany(a));
    // On for the company it is in, not the one it would go to: still refused, and that company is not offered.
    expect((await a.req('POST', `/api/boards/${b1.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: b2.board.id })).status).toBe(403);
    const targets = await a.json('GET', `/api/transfer/targets?from=${b1.board.id}`);
    expect(targets.enabled).toBe(true);
    expect(targets.companies.map((x: any) => x.id)).not.toContain(co.id);

    await flag('company', co.id);
    const listed = await a.json('GET', `/api/transfer/targets?from=${b1.board.id}`);
    const theirs = listed.companies.find((x: any) => x.id === co.id);
    expect(theirs.projects.map((p: any) => p.id)).toContain(b2.board.id);
    expect(listed.companies.flatMap((x: any) => x.projects.map((p: any) => p.id))).not.toContain(b1.board.id);
    const moved = await a.json('POST', `/api/boards/${b1.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: b2.board.id });
    expect(moved.ok).toBe(true);
    expect(moved.sameCompany).toBe(false);
    expect(moved.moved).toBe(1);
  });

  it('moves a task with its subtasks, comments, time and history, and gives it a key in the new project', async () => {
    const a = await signup();
    await flag('company', await ownCompany(a));
    const src = await createBoard(a, 'Laser line');
    const dst = await createBoard(a, 'Press line');
    const [person, status, due] = src.columns;
    const t = await a.json('POST', `/api/boards/${src.board.id}/items`, { name: 'Order nozzles', values: { [person.id]: a.userId, [status.id]: 'working', [due.id]: '2026-12-01' } });
    const sub = await a.json('POST', `/api/boards/${src.board.id}/items`, { name: 'Ask for a quote', parentItemId: t.id });
    await a.json('POST', `/api/items/${t.id}/updates`, { body: 'Supplier called back' });
    await a.json('POST', `/api/items/${t.id}/time`, { minutes: 30, date: '2026-11-20' });
    const stays = await a.json('POST', `/api/boards/${src.board.id}/items`, { name: 'Stays here' });
    const before = (await a.json('GET', `/api/items/${t.id}`)).item;

    const preview = await a.json('POST', `/api/boards/${src.board.id}/items/transfer/preview`, { itemIds: [t.id], toBoardId: dst.board.id, toGroupId: dst.groups[1].id });
    expect(preview.sameCompany).toBe(true);
    expect(preview.tasks).toHaveLength(1);
    expect(preview.tasks[0]).toMatchObject({ id: t.id, ok: true, subtasks: 1, notCarried: [] });
    expect(preview.target.groupId).toBe(dst.groups[1].id);
    // The preview changes nothing.
    expect((await a.json('GET', `/api/items/${t.id}`)).board.id).toBe(src.board.id);

    const res = await a.json('POST', `/api/boards/${src.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: dst.board.id, toGroupId: dst.groups[1].id });
    expect(res.ok).toBe(true);
    const detail = await a.json('GET', `/api/items/${t.id}`);
    expect(detail.board.id).toBe(dst.board.id);
    expect(detail.item.groupId).toBe(dst.groups[1].id);
    expect(detail.subitems.map((s: any) => s.id)).toEqual([sub.id]);
    const dcols = dst.columns;
    expect(detail.item.values[dcols[0].id]).toBe(a.userId);
    expect(detail.item.values[dcols[1].id]).toBe('working');
    expect(detail.item.values[dcols[2].id]).toBe('2026-12-01');
    expect(detail.timeEntries).toHaveLength(1);
    expect(detail.item.key).toMatch(/-\d+$/);
    expect(detail.item.key).not.toBe(before.key);
    expect(res.tasks[0].newKey).toBe(detail.item.key);
    const comments = await a.json('GET', `/api/items/${t.id}/updates`);
    expect(comments.map((u: any) => u.body)).toContain('Supplier called back');
    const history = await a.json('GET', `/api/items/${t.id}/activity`);
    expect(history.map((h: any) => h.action)).toEqual(expect.arrayContaining(['item_transferred', 'item_created']));

    const oldBoard = await a.json('GET', `/api/boards/${src.board.id}`);
    expect(oldBoard.items.map((i: any) => i.id)).toEqual([stays.id]);
    const newBoard = await a.json('GET', `/api/boards/${dst.board.id}`);
    expect(newBoard.items.map((i: any) => i.id).sort()).toEqual([t.id, sub.id].sort());
    const out = await env.DB.prepare("SELECT COUNT(*) AS n FROM activity_log WHERE board_id = ? AND action = 'item_moved_out'").bind(src.board.id).first<{ n: number }>();
    expect(out!.n).toBe(1);
    const audit = await env.DB.prepare("SELECT event_type FROM audit_events WHERE item_id = ? AND event_type LIKE 'task.moved_%' ORDER BY event_type").bind(t.id).all<{ event_type: string }>();
    expect(audit.results.map((r) => r.event_type)).toEqual(['task.moved_in', 'task.moved_out']);

    // Subtasks cannot be picked on their own; a task already there cannot be moved there again.
    expect((await a.req('POST', `/api/boards/${dst.board.id}/items/transfer`, { itemIds: [sub.id], toBoardId: src.board.id })).status).toBe(400);
    expect((await a.req('POST', `/api/boards/${dst.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: dst.board.id })).status).toBe(400);
  });

  it('moves many at once to another company, listing what does not carry over', async () => {
    const a = await signup();
    const other = await signup();
    await addMember(a, other, 'member');
    await flag('global');
    const src = await createBoard(a, 'Sales jobs');
    const co = await company(a, 'Bracket Co');
    const dst = await boardIn(a, co.ws, 'Jobs');
    // Someone who is not in the new company is assigned to every task.
    const [person, status] = src.columns;
    const ids: string[] = [];
    for (let i = 0; i < 3; i++) ids.push((await a.json('POST', `/api/boards/${src.board.id}/items`, { name: `Job ${i}`, values: { [person.id]: other.userId, [status.id]: i === 0 ? 'done' : 'working' } })).id);

    const preview = await a.json('POST', `/api/boards/${src.board.id}/items/transfer/preview`, { itemIds: ids, toBoardId: dst.board.id });
    expect(preview.sameCompany).toBe(false);
    expect(preview.tasks).toHaveLength(3);
    for (const t of preview.tasks) expect(t.notCarried.map((n: any) => n.column)).toContain(person.title);

    const res = await a.json('POST', `/api/boards/${src.board.id}/items/transfer`, { itemIds: ids, toBoardId: dst.board.id });
    expect(res.moved).toBe(3);
    const board = await a.json('GET', `/api/boards/${dst.board.id}`);
    const moved = board.items.filter((i: any) => ids.includes(i.id));
    expect(moved).toHaveLength(3);
    for (const m of moved) expect(m.values[dst.columns[0].id]).toBeUndefined();
    // The other person no longer finds the task they could open before.
    expect((await other.req('GET', `/api/items/${ids[0]}`)).status).toBe(404);
    // The old company's board says only that it went to another company.
    const out = await env.DB.prepare("SELECT new_value FROM activity_log WHERE board_id = ? AND action = 'item_moved_out' LIMIT 1").bind(src.board.id).first<{ new_value: string }>();
    expect(JSON.parse(out!.new_value)).toEqual({ company: 'another company' });
  });

  it('refuses viewers, people who may not add tasks there, and API tokens limited to one company', async () => {
    const a = await signup();
    const viewer = await signup();
    await addMember(a, viewer, 'viewer');
    await flag('global');
    const src = await createBoard(a, 'One');
    const dst = await createBoard(a, 'Two');
    const t = await a.json('POST', `/api/boards/${src.board.id}/items`, { name: 'Task' });
    expect((await viewer.req('POST', `/api/boards/${src.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: dst.board.id })).status).toBe(403);

    const b = await signup();
    const theirs = await createBoard(b, 'Not yours');
    expect((await a.req('POST', `/api/boards/${src.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: theirs.board.id })).status).toBe(404);

    const co = await company(a, 'Token Co');
    const far = await boardIn(a, co.ws, 'Far');
    const tok = await a.req('POST', '/api/me/tokens', { name: 'scoped', companyId: await ownCompany(a) });
    expect(tok.status).toBe(201);
    const { token } = (await tok.json()) as { token: string };
    const res = await fetchWithToken(token, `/api/boards/${src.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: far.board.id });
    expect(res.status).toBe(403);
    // Nothing moved.
    expect((await a.json('GET', `/api/items/${t.id}`)).board.id).toBe(src.board.id);
  });

  it('moves a task with financial data only for someone who may see and change it', async () => {
    const a = await signup();
    const pm = await signup();
    await addMember(a, pm, 'member');
    await flag('global');
    const src = await createBoard(a, 'Budgeted');
    const dst = await createBoard(a, 'Other');
    const col = await a.json('POST', `/api/boards/${src.board.id}/columns`, { title: 'Budget', type: 'currency', settings: { currency: 'AUD', currencyMode: 'fixed', financeRole: 'approved_budget' } });
    await a.json('POST', `/api/boards/${dst.board.id}/columns`, { title: 'Budget', type: 'currency', settings: { currency: 'AUD', currencyMode: 'fixed', financeRole: 'approved_budget' } });
    const t = await a.json('POST', `/api/boards/${src.board.id}/items`, { name: 'Costly', values: { [col.id]: 1200 } });
    // The member may edit both projects but not see financial data in the first one.
    await env.DB.prepare('INSERT INTO board_permissions (board_id, workspace_id, user_id, view_finance, edit_finance, updated_at) VALUES (?, ?, ?, 0, 0, 1)').bind(src.board.id, a.workspaceId, pm.userId).run();
    const p = await pm.json('POST', `/api/boards/${src.board.id}/items/transfer/preview`, { itemIds: [t.id], toBoardId: dst.board.id });
    expect(p.tasks[0].ok).toBe(false);
    expect(p.tasks[0].error).toMatch(/financial data/);
    const r = await pm.json('POST', `/api/boards/${src.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: dst.board.id });
    expect(r.moved).toBe(0);
    expect(r.ok).toBe(false);
    expect((await a.json('GET', `/api/items/${t.id}`)).board.id).toBe(src.board.id);
    // The owner moves it, amount and all.
    const ok = await a.json('POST', `/api/boards/${src.board.id}/items/transfer`, { itemIds: [t.id], toBoardId: dst.board.id });
    expect(ok.moved).toBe(1);
    const after = await a.json('GET', `/api/boards/${dst.board.id}`);
    const budget = after.columns.find((c: any) => c.title === 'Budget');
    expect(after.items.find((i: any) => i.id === t.id).values[budget.id]).toBe(1200);
  });
});

async function fetchWithToken(token: string, path: string, body: unknown) {
  const { SELF } = await import('cloudflare:test');
  return SELF.fetch(`http://example.com${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

const col = (id: string, title: string, type: string, settings: Record<string, any> = {}): ColumnDTO => ({ id, boardId: 'b', title, type, settings, position: 0, width: 100, hidden: false, required: false, description: '' });

describe('carrying values from one project’s columns to another’s', () => {
  it('matches columns by type and title, then the only one of a type', () => {
    const src = [col('s1', 'Owner', 'person'), col('s2', 'Status', 'status'), col('s3', 'Notes', 'long_text'), col('s4', 'Score', 'formula'), col('s5', 'Size', 'number')];
    const dst = [col('d1', 'Stage', 'status'), col('d2', 'Owner', 'person'), col('d3', 'Weight', 'number'), col('d4', 'Height', 'number')];
    const m = Object.fromEntries(matchColumns(src, dst).map((x) => [x.from.id, x.to?.id ?? null]));
    expect(m).toEqual({ s1: 'd2', s2: 'd1', s3: null, s4: null, s5: null });
  });

  it('carries labels by name, people who may open the project, dependencies moved together, same-currency amounts', () => {
    const ctx = { people: new Set(['u1']), mayAssign: true, moved: new Set(['i1']), currency: (c: ColumnDTO) => (c.settings.currency as string) ?? null };
    const from = col('s', 'Status', 'status', { labels: [{ id: 'x1', label: 'Waiting', color: '#111111' }] });
    const to = col('d', 'Status', 'status', { labels: [{ id: 'y9', label: 'waiting', color: '#222222' }] });
    expect(carryValue(from, to, 'x1', ctx)).toEqual({ value: 'y9' });
    const none = col('d', 'Status', 'status', { labels: [{ id: 'z', label: 'Other', color: '#222222' }] });
    expect(carryValue(from, none, 'x1', ctx)).toEqual({ dropped: 'the new project has no label "Waiting"' });
    expect(carryValue(col('p', 'People', 'people'), col('q', 'People', 'people'), ['u1', 'u2'], ctx)).toEqual({ value: ['u1'], partly: true });
    expect(carryValue(col('p', 'Owner', 'person'), col('q', 'Owner', 'person'), 'u2', ctx)).toHaveProperty('dropped');
    expect(carryValue(col('p', 'Owner', 'person'), col('q', 'Owner', 'person'), 'u1', { ...ctx, mayAssign: false })).toHaveProperty('dropped');
    expect(carryValue(col('a', 'After', 'dependency'), col('b', 'After', 'dependency'), ['i1', 'i2'], ctx)).toEqual({ value: ['i1'] });
    expect(carryValue(col('a', 'After', 'dependency'), col('b', 'After', 'dependency'), ['i2'], ctx)).toHaveProperty('dropped');
    expect(carryValue(col('m', 'Budget', 'currency', { currency: 'AUD' }), col('n', 'Budget', 'currency', { currency: 'AUD' }), 50, ctx)).toEqual({ value: 50 });
    expect(carryValue(col('m', 'Budget', 'currency', { currency: 'AUD' }), col('n', 'Budget', 'currency', { currency: 'USD' }), 50, ctx)).toEqual({ dropped: 'the amount is in AUD and the new column is in USD' });
  });
});
