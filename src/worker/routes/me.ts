import { Hono } from 'hono';
import { z } from 'zod';
import { getColumnType } from '../../shared/columns';
import { addDays, todayIn } from '../../shared/dates';
import { isItemDone } from '../../shared/filters';
import { assigneesOf, dueDateOf } from '../../shared/items';
import { NOTIFICATION_TYPES, type ColumnDTO } from '../../shared/types';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, newId, notFound, now, parseJson, placeholders, randomToken, sha256Hex } from '../lib/util';
import { hashPassword, passwordProblems, verifyPassword } from '../auth/password';
import { rateLimit } from '../auth/rate-limit';
import { audit } from '../services/audit';
import { columnDTO, itemDTO, type ColumnRow } from '../services/mappers';
import { accessibleBoardIds, requireItem, requireWorkspace, type ItemRow } from '../services/permissions';
import { userDTO, type UserRow } from './helpers';

export const meRoutes = new Hono<AppEnv>();

meRoutes.patch('/me', async (c) => {
  const user = c.get('user');
  const input = await body(
    c,
    z.object({
      name: z.string().trim().min(1).max(100).optional(),
      timezone: z.string().max(64).optional(),
      locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/).optional(),
      theme: z.enum(['light', 'dark', 'system']).optional(),
      preferences: z.record(z.string(), z.unknown()).optional(),
    }),
  );
  if (input.timezone) {
    try {
      new Intl.DateTimeFormat('en', { timeZone: input.timezone });
    } catch {
      throw badRequest('Unknown time zone');
    }
  }
  const cur = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first<UserRow>();
  const prefs = { ...parseJson<Record<string, unknown>>(cur!.preferences_json, {}), ...(input.preferences ?? {}) };
  if (JSON.stringify(prefs).length > 10000) throw badRequest('Preferences too large');
  await c.env.DB.prepare('UPDATE users SET name = ?, timezone = ?, locale = ?, theme = ?, preferences_json = ?, updated_at = ? WHERE id = ?')
    .bind(input.name ?? cur!.name, input.timezone ?? cur!.timezone, input.locale ?? cur!.locale, input.theme ?? cur!.theme, JSON.stringify(prefs), now(), user.id)
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first<UserRow>();
  return c.json(userDTO(row!));
});

meRoutes.post('/me/password', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `password:${user.id}`, 10, 60 * 60_000);
  const input = await body(c, z.object({ currentPassword: z.string().max(256).optional(), newPassword: z.string().max(256) }));
  const row = await c.env.DB.prepare('SELECT password_hash, email FROM users WHERE id = ?').bind(user.id).first<{ password_hash: string | null; email: string }>();
  if (row?.password_hash && !(await verifyPassword(input.currentPassword ?? '', row.password_hash))) throw new HttpError(403, 'Current password is incorrect');
  const problem = passwordProblems(input.newPassword, row?.email);
  if (problem) throw badRequest(problem);
  const session = c.get('session');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').bind(await hashPassword(input.newPassword), now(), user.id),
    // Revoke every other session after a password change.
    c.env.DB.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND id != ? AND revoked_at IS NULL').bind(now(), user.id, session?.id ?? ''),
  ]);
  await audit(c.env.DB, { actorId: user.id, action: 'auth.password_changed', ip: clientIp(c) });
  return c.json({ ok: true });
});

meRoutes.get('/me/sessions', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare('SELECT id, provider, user_agent, ip, created_at, last_seen_at, expires_at FROM sessions WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ? ORDER BY last_seen_at DESC')
    .bind(user.id, now())
    .all<{ id: string }>();
  const current = c.get('session')?.id;
  return c.json(rows.results.map((s) => ({ ...s, current: s.id === current })));
});

meRoutes.delete('/me/sessions/:id', async (c) => {
  const user = c.get('user');
  const r = await c.env.DB.prepare('UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL').bind(now(), c.req.param('id'), user.id).run();
  if (!r.meta.changes) throw notFound('Session');
  await audit(c.env.DB, { actorId: user.id, action: 'auth.session_revoked', targetId: c.req.param('id'), ip: clientIp(c) });
  return c.json({ ok: true });
});

meRoutes.post('/me/sessions/revoke-others', async (c) => {
  const user = c.get('user');
  const r = await c.env.DB.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND id != ? AND revoked_at IS NULL').bind(now(), user.id, c.get('session')?.id ?? '').run();
  return c.json({ revoked: r.meta.changes });
});

meRoutes.get('/me/identities', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare('SELECT id, provider, email, created_at FROM user_identities WHERE user_id = ?').bind(user.id).all();
  const pw = await c.env.DB.prepare('SELECT password_hash IS NOT NULL AS has_password FROM users WHERE id = ?').bind(user.id).first<{ has_password: number }>();
  return c.json({ hasPassword: !!pw?.has_password, identities: rows.results });
});

meRoutes.delete('/me/identities/:id', async (c) => {
  const user = c.get('user');
  const pw = await c.env.DB.prepare('SELECT password_hash IS NOT NULL AS has_password FROM users WHERE id = ?').bind(user.id).first<{ has_password: number }>();
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM user_identities WHERE user_id = ?').bind(user.id).first<{ n: number }>();
  if (!pw?.has_password && (count?.n ?? 0) <= 1) throw badRequest('Set a password before removing your only sign-in method');
  const r = await c.env.DB.prepare('DELETE FROM user_identities WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).run();
  if (!r.meta.changes) throw notFound('Identity');
  return c.json({ ok: true });
});

// ------------------------------------------------------------- API tokens

meRoutes.get('/me/tokens', async (c) => {
  const rows = await c.env.DB.prepare('SELECT id, name, prefix, last_used_at, expires_at, created_at FROM api_tokens WHERE user_id = ? AND revoked_at IS NULL ORDER BY created_at DESC').bind(c.get('user').id).all();
  return c.json(rows.results);
});

meRoutes.post('/me/tokens', async (c) => {
  const user = c.get('user');
  if (c.get('authKind') !== 'session') throw new HttpError(403, 'API tokens can only be created from an interactive session');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(100), expiresInDays: z.number().int().min(1).max(365).optional() }));
  const token = `wos_${randomToken(32)}`;
  const id = newId();
  await c.env.DB.prepare('INSERT INTO api_tokens (id, user_id, name, token_hash, prefix, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, user.id, input.name, await sha256Hex(token), token.slice(0, 10), input.expiresInDays ? now() + input.expiresInDays * 86_400_000 : null, now())
    .run();
  await audit(c.env.DB, { actorId: user.id, action: 'api_token.created', targetId: id, ip: clientIp(c) });
  return c.json({ id, name: input.name, token }, 201);
});

meRoutes.delete('/me/tokens/:id', async (c) => {
  const r = await c.env.DB.prepare('UPDATE api_tokens SET revoked_at = ? WHERE id = ? AND user_id = ?').bind(now(), c.req.param('id'), c.get('user').id).run();
  if (!r.meta.changes) throw notFound('Token');
  return c.json({ ok: true });
});

// ------------------------------------------------- notification preferences

meRoutes.get('/me/notification-preferences', async (c) => {
  const rows = await c.env.DB.prepare('SELECT type, in_app, email FROM notification_preferences WHERE user_id = ?').bind(c.get('user').id).all<{ type: string; in_app: number; email: number }>();
  return c.json(
    NOTIFICATION_TYPES.map((t) => {
      const r = rows.results.find((x) => x.type === t);
      return { type: t, inApp: r ? !!r.in_app : true, email: r ? !!r.email : false };
    }),
  );
});

meRoutes.put('/me/notification-preferences', async (c) => {
  const user = c.get('user');
  const input = await body(c, z.array(z.object({ type: z.enum(NOTIFICATION_TYPES), inApp: z.boolean(), email: z.boolean() })).max(20));
  await c.env.DB.batch(
    input.map((p) =>
      c.env.DB.prepare('INSERT INTO notification_preferences (user_id, type, in_app, email) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, type) DO UPDATE SET in_app = excluded.in_app, email = excluded.email').bind(user.id, p.type, p.inApp ? 1 : 0, p.email ? 1 : 0),
    ),
  );
  return c.json({ ok: true, emailDelivery: 'not_configured' });
});

// ------------------------------------------------------ favourites & recents

const ENTITY_TYPES = ['board', 'dashboard', 'document', 'item', 'goal'] as const;

async function entityWorkspace(db: D1Database, type: string, id: string): Promise<string | null> {
  const table = { board: 'boards', dashboard: 'dashboards', document: 'documents', item: 'items', goal: 'goals' }[type];
  if (!table) return null;
  const row = await db.prepare(`SELECT workspace_id FROM ${table} WHERE id = ?`).bind(id).first<{ workspace_id: string }>();
  return row?.workspace_id ?? null;
}

async function resolveEntities(db: D1Database, userId: string, wsId: string, rows: { entity_type: string; entity_id: string; at: number }[]) {
  const boards = new Set(await accessibleBoardIds(db, wsId, userId));
  const out: { type: string; id: string; name: string; boardId?: string; at: number }[] = [];
  for (const r of rows) {
    let row: any = null;
    if (r.entity_type === 'board' && boards.has(r.entity_id)) row = await db.prepare('SELECT name FROM boards WHERE id = ?').bind(r.entity_id).first();
    if (r.entity_type === 'item') {
      row = await db.prepare('SELECT name, board_id FROM items WHERE id = ? AND archived_at IS NULL').bind(r.entity_id).first();
      if (row && !boards.has(row.board_id)) row = null;
    }
    if (r.entity_type === 'dashboard') row = await db.prepare('SELECT name FROM dashboards WHERE id = ? AND workspace_id = ? AND archived_at IS NULL').bind(r.entity_id, wsId).first();
    if (r.entity_type === 'goal') row = await db.prepare('SELECT title AS name FROM goals WHERE id = ? AND workspace_id = ? AND archived_at IS NULL').bind(r.entity_id, wsId).first();
    if (r.entity_type === 'document') {
      const { requireDocument } = await import('../services/permissions');
      const d = await requireDocument(db, r.entity_id, userId).catch(() => null);
      row = d && !d.doc.archived_at ? { name: d.doc.title } : null;
    }
    if (row) out.push({ type: r.entity_type, id: r.entity_id, name: row.name, boardId: row.board_id, at: r.at });
  }
  return out;
}

meRoutes.get('/workspaces/:ws/favourites', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const rows = await c.env.DB.prepare('SELECT entity_type, entity_id, created_at AS at FROM favourites WHERE user_id = ? AND workspace_id = ? ORDER BY created_at DESC').bind(user.id, wsId).all<any>();
  return c.json(await resolveEntities(c.env.DB, user.id, wsId, rows.results));
});

meRoutes.post('/workspaces/:ws/favourites', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const input = await body(c, z.object({ type: z.enum(ENTITY_TYPES), id: z.string() }));
  if ((await entityWorkspace(c.env.DB, input.type, input.id)) !== wsId) throw notFound('Entity');
  await c.env.DB.prepare('INSERT OR IGNORE INTO favourites (user_id, workspace_id, entity_type, entity_id, created_at) VALUES (?, ?, ?, ?, ?)').bind(user.id, wsId, input.type, input.id, now()).run();
  return c.json({ ok: true }, 201);
});

meRoutes.delete('/workspaces/:ws/favourites/:type/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM favourites WHERE user_id = ? AND workspace_id = ? AND entity_type = ? AND entity_id = ?').bind(c.get('user').id, c.req.param('ws'), c.req.param('type'), c.req.param('id')).run();
  return c.json({ ok: true });
});

meRoutes.get('/workspaces/:ws/recents', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const rows = await c.env.DB.prepare('SELECT entity_type, entity_id, visited_at AS at FROM recents WHERE user_id = ? AND workspace_id = ? ORDER BY visited_at DESC LIMIT 30').bind(user.id, wsId).all<any>();
  return c.json(await resolveEntities(c.env.DB, user.id, wsId, rows.results));
});

meRoutes.post('/workspaces/:ws/recents', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const input = await body(c, z.object({ type: z.enum(ENTITY_TYPES), id: z.string() }));
  if ((await entityWorkspace(c.env.DB, input.type, input.id)) !== wsId) throw notFound('Entity');
  await c.env.DB.prepare('INSERT INTO recents (user_id, workspace_id, entity_type, entity_id, visited_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, entity_type, entity_id) DO UPDATE SET visited_at = excluded.visited_at').bind(user.id, wsId, input.type, input.id, now()).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ My Work

export interface WorkItem {
  item: ReturnType<typeof itemDTO>;
  boardId: string;
  boardName: string;
  due: string | null;
  done: boolean;
  statusText: string;
  statusColor: string | null;
}

/** Items assigned to the user across every board they can access. */
export async function assignedItems(db: D1Database, wsId: string, userId: string): Promise<{ items: WorkItem[]; columnsByBoard: Map<string, ColumnDTO[]> }> {
  const boards = await accessibleBoardIds(db, wsId, userId);
  if (!boards.length) return { items: [], columnsByBoard: new Map() };
  const cols = await db.prepare(`SELECT * FROM columns WHERE board_id IN (${placeholders(boards.length)}) AND type IN ('person','people','status','date','timeline')`).bind(...boards).all<ColumnRow>();
  const columnsByBoard = new Map<string, ColumnDTO[]>();
  for (const col of cols.results.map(columnDTO)) columnsByBoard.set(col.boardId, [...(columnsByBoard.get(col.boardId) ?? []), col]);
  const boardNames = await db.prepare(`SELECT id, name FROM boards WHERE id IN (${placeholders(boards.length)})`).bind(...boards).all<{ id: string; name: string }>();
  const nameOf = new Map(boardNames.results.map((b) => [b.id, b.name]));
  // Coarse SQL pre-filter on the JSON text, exact check in code.
  const rows = await db
    .prepare(`SELECT * FROM items WHERE workspace_id = ? AND archived_at IS NULL AND board_id IN (${placeholders(boards.length)}) AND instr(values_json, ?) > 0 LIMIT 2000`)
    .bind(wsId, ...boards, `"${userId}"`)
    .all<ItemRow>();
  const out: WorkItem[] = [];
  for (const r of rows.results) {
    const bc = columnsByBoard.get(r.board_id) ?? [];
    const values = parseJson<Record<string, unknown>>(r.values_json, {});
    if (!assigneesOf(values, bc).includes(userId)) continue;
    const status = bc.find((x) => x.type === 'status');
    const label = status ? (status.settings.labels ?? []).find((l: any) => l.id === values[status.id]) : null;
    out.push({
      item: itemDTO(r),
      boardId: r.board_id,
      boardName: nameOf.get(r.board_id) ?? '',
      due: dueDateOf(values, bc),
      done: isItemDone({ values }, bc),
      statusText: status ? getColumnType('status').toText(values[status.id], status.settings) : '',
      statusColor: label?.color ?? null,
    });
  }
  return { items: out, columnsByBoard };
}

meRoutes.get('/workspaces/:ws/my-work', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const tz = (await c.env.DB.prepare('SELECT timezone FROM users WHERE id = ?').bind(user.id).first<{ timezone: string }>())?.timezone ?? 'UTC';
  const today = todayIn(tz);
  const weekEnd = addDays(today, 7);
  const { items } = await assignedItems(c.env.DB, wsId, user.id);
  const buckets: Record<'overdue' | 'today' | 'upcoming' | 'later' | 'noDate' | 'completed', WorkItem[]> = { overdue: [] as WorkItem[], today: [] as WorkItem[], upcoming: [] as WorkItem[], later: [] as WorkItem[], noDate: [] as WorkItem[], completed: [] as WorkItem[] };
  for (const w of items) {
    if (w.done) buckets.completed.push(w);
    else if (!w.due) buckets.noDate.push(w);
    else if (w.due < today) buckets.overdue.push(w);
    else if (w.due === today) buckets.today.push(w);
    else if (w.due <= weekEnd) buckets.upcoming.push(w);
    else buckets.later.push(w);
  }
  const byDue = (a: WorkItem, b: WorkItem) => (a.due ?? '9999').localeCompare(b.due ?? '9999');
  Object.values(buckets).forEach((b) => b.sort(byDue));
  buckets.completed.sort((a, b) => (b.item.completedAt ?? 0) - (a.item.completedAt ?? 0));
  buckets.completed = buckets.completed.slice(0, 50);
  return c.json({ ...buckets, date: today });
});

// ------------------------------------------------------- My Day / planner

meRoutes.get('/workspaces/:ws/planner', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const from = c.req.query('from') ?? todayIn('UTC');
  const to = c.req.query('to') ?? from;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw badRequest('Invalid date range');
  const boards = new Set(await accessibleBoardIds(c.env.DB, wsId, user.id));
  const rows = await c.env.DB.prepare(
    `SELECT p.*, i.name AS item_name, i.board_id, i.values_json, i.completed_at, b.name AS board_name FROM planner_entries p
     JOIN items i ON i.id = p.item_id JOIN boards b ON b.id = i.board_id
     WHERE p.user_id = ? AND p.workspace_id = ? AND p.day BETWEEN ? AND ? AND i.archived_at IS NULL ORDER BY p.day, p.position`,
  )
    .bind(user.id, wsId, from, to)
    .all<any>();
  return c.json(
    rows.results
      .filter((r) => boards.has(r.board_id))
      .map((r) => ({ id: r.id, itemId: r.item_id, itemName: r.item_name, boardId: r.board_id, boardName: r.board_name, day: r.day, position: r.position, done: !!r.done, itemCompleted: !!r.completed_at })),
  );
});

meRoutes.post('/workspaces/:ws/planner', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const input = await body(c, z.object({ itemId: z.string(), day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }));
  const { item } = await requireItem(c.env.DB, input.itemId, user.id, 'view');
  if (item.workspace_id !== wsId) throw notFound('Item');
  const id = newId();
  await c.env.DB.prepare('INSERT INTO planner_entries (id, workspace_id, user_id, item_id, day, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, item_id, day) DO NOTHING')
    .bind(id, wsId, user.id, item.id, input.day, now(), now())
    .run();
  return c.json({ ok: true }, 201);
});

meRoutes.patch('/planner/:id', async (c) => {
  const input = await body(c, z.object({ done: z.boolean().optional(), day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), position: z.number().optional() }));
  const row = await c.env.DB.prepare('SELECT * FROM planner_entries WHERE id = ? AND user_id = ?').bind(c.req.param('id'), c.get('user').id).first<any>();
  if (!row) throw notFound('Planner entry');
  await c.env.DB.prepare('UPDATE OR IGNORE planner_entries SET done = ?, day = ?, position = ? WHERE id = ?').bind(input.done === undefined ? row.done : input.done ? 1 : 0, input.day ?? row.day, input.position ?? row.position, row.id).run();
  return c.json({ ok: true });
});

meRoutes.delete('/planner/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM planner_entries WHERE id = ? AND user_id = ?').bind(c.req.param('id'), c.get('user').id).run();
  return c.json({ ok: true });
});

meRoutes.get('/me/timer', async (c) => {
  const row = await c.env.DB.prepare(
    'SELECT t.id, t.item_id, t.started_at, i.name AS item_name, i.board_id, i.workspace_id FROM time_entries t JOIN items i ON i.id = t.item_id WHERE t.user_id = ? AND t.ended_at IS NULL LIMIT 1',
  )
    .bind(c.get('user').id)
    .first();
  return c.json(row ?? null);
});
