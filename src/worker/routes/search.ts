import { Hono } from 'hono';
import { z } from 'zod';
import { matchFilter, sanitizeFilter, sortItems } from '../../shared/filters';
import { computeValues, dueDateOf } from '../../shared/items';
import { labelsOf } from '../../shared/columns';
import type { AppEnv } from '../env';
import { body, newId, notFound, now, parseJson, placeholders } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { columnDTO, itemDTO, workspaceMembers, type ColumnRow } from '../services/mappers';
import { accessibleBoardIds, requireWorkspace, wsAtLeast, type ItemRow } from '../services/permissions';

export const searchRoutes = new Hono<AppEnv>();

const TYPES = ['boards', 'items', 'subitems', 'documents', 'comments', 'users'] as const;

const searchSchema = z.object({
  q: z.string().max(200).default(''),
  types: z.array(z.enum(TYPES)).default([...TYPES]),
  boardIds: z.array(z.string()).max(100).optional(),
  /** Semantic filters across boards (matched against label text / user ids). */
  statuses: z.array(z.string().max(60)).max(20).optional(),
  priorities: z.array(z.string().max(60)).max(20).optional(),
  people: z.array(z.string()).max(50).optional(),
  dateRange: z.object({ field: z.enum(['created_at', 'updated_at', 'due']).default('updated_at'), from: z.string().optional(), to: z.string().optional() }).optional(),
  /** Advanced AND/OR filter applied per board (fields: name, done, created_at, updated_at, column ids). */
  filter: z.unknown().optional(),
  sort: z.enum(['relevance', 'updated_desc', 'updated_asc', 'created_desc', 'name_asc', 'due_asc']).default('relevance'),
  limit: z.number().int().min(1).max(200).default(50),
});

function likeEscape(s: string) {
  return s.toLowerCase().replace(/[\\%_]/g, (m) => `\\${m}`);
}

export async function runSearch(db: D1Database, wsId: string, userId: string, input: z.infer<typeof searchSchema>) {
  const role = await requireWorkspace(db, wsId, userId);
  const q = input.q.trim();
  const like = `%${likeEscape(q)}%`;
  const types = new Set(input.types);
  let boards = await accessibleBoardIds(db, wsId, userId);
  if (input.boardIds?.length) {
    const want = new Set(input.boardIds);
    boards = boards.filter((b) => want.has(b));
  }
  const results: Record<string, unknown[]> = {};
  const members = await workspaceMembers(db, wsId);
  const nameOf = new Map(members.map((m) => [m.id, m.name]));

  if (types.has('boards') && boards.length) {
    const rows = await db
      .prepare(`SELECT id, name, description, updated_at FROM boards WHERE id IN (${placeholders(boards.length)}) ${q ? "AND (lower(name) LIKE ? ESCAPE '\\' OR lower(description) LIKE ? ESCAPE '\\')" : ''} ORDER BY updated_at DESC LIMIT ?`)
      .bind(...boards, ...(q ? [like, like] : []), input.limit)
      .all();
    results.boards = rows.results;
  }

  if ((types.has('items') || types.has('subitems')) && boards.length) {
    const rows = await db
      .prepare(
        `SELECT * FROM items WHERE workspace_id = ? AND archived_at IS NULL AND board_id IN (${placeholders(boards.length)})
         ${q ? "AND search_text LIKE ? ESCAPE '\\'" : ''}
         ${types.has('items') && !types.has('subitems') ? 'AND parent_item_id IS NULL' : ''}
         ${!types.has('items') && types.has('subitems') ? 'AND parent_item_id IS NOT NULL' : ''}
         ORDER BY updated_at DESC LIMIT 2000`,
      )
      .bind(wsId, ...boards, ...(q ? [like] : []))
      .all<ItemRow>();
    const boardIds = Array.from(new Set(rows.results.map((r) => r.board_id)));
    const cols = boardIds.length ? (await db.prepare(`SELECT * FROM columns WHERE board_id IN (${placeholders(boardIds.length)})`).bind(...boardIds).all<ColumnRow>()).results.map(columnDTO) : [];
    const byBoard = new Map<string, typeof cols>();
    cols.forEach((col) => byBoard.set(col.boardId, [...(byBoard.get(col.boardId) ?? []), col]));
    const boardNames = boardIds.length ? await db.prepare(`SELECT id, name FROM boards WHERE id IN (${placeholders(boardIds.length)})`).bind(...boardIds).all<{ id: string; name: string }>() : { results: [] };
    const bName = new Map(boardNames.results.map((b) => [b.id, b.name]));
    const filter = input.filter ? sanitizeFilter(input.filter) : null;
    const statuses = input.statuses?.map((s) => s.toLowerCase());
    const priorities = input.priorities?.map((s) => s.toLowerCase());
    let items = rows.results.map(itemDTO).filter((it) => {
      const bc = byBoard.get(it.boardId) ?? [];
      it.values = computeValues(it, bc);
      const labelMatch = (type: 'status' | 'priority', wanted?: string[]) => {
        if (!wanted?.length) return true;
        return bc.filter((c) => c.type === type).some((c) => wanted.includes((labelsOf(c).find((l) => l.id === it.values[c.id])?.label ?? '').toLowerCase()));
      };
      if (!labelMatch('status', statuses) || !labelMatch('priority', priorities)) return false;
      if (input.people?.length) {
        const assigned = bc.filter((c) => c.type === 'person' || c.type === 'people').flatMap((c) => {
          const v = it.values[c.id];
          return Array.isArray(v) ? v : v ? [v] : [];
        });
        if (!input.people.some((p) => assigned.includes(p))) return false;
      }
      if (input.dateRange && (input.dateRange.from || input.dateRange.to)) {
        const f = input.dateRange.field;
        const d = f === 'due' ? dueDateOf(it.values, bc) : new Date(f === 'created_at' ? it.createdAt : it.updatedAt).toISOString().slice(0, 10);
        if (!d) return false;
        if (input.dateRange.from && d < input.dateRange.from) return false;
        if (input.dateRange.to && d > input.dateRange.to) return false;
      }
      if (filter && filter.rules.length && !matchFilter(it, filter, { columns: new Map(bc.map((c) => [c.id, c])), currentUserId: userId, userName: (id) => nameOf.get(id) })) return false;
      return true;
    });
    if (input.sort === 'name_asc') items = sortItems(items, [{ field: 'name', dir: 'asc' }], { columns: new Map() });
    else if (input.sort === 'updated_asc') items.sort((a, b) => a.updatedAt - b.updatedAt);
    else if (input.sort === 'created_desc') items.sort((a, b) => b.createdAt - a.createdAt);
    else if (input.sort === 'due_asc') items.sort((a, b) => (dueDateOf(a.values, byBoard.get(a.boardId) ?? []) ?? '9999').localeCompare(dueDateOf(b.values, byBoard.get(b.boardId) ?? []) ?? '9999'));
    else if (input.sort === 'relevance' && q) {
      const ql = q.toLowerCase();
      const score = (n: string) => (n.toLowerCase() === ql ? 0 : n.toLowerCase().startsWith(ql) ? 1 : n.toLowerCase().includes(ql) ? 2 : 3);
      items.sort((a, b) => score(a.name) - score(b.name) || b.updatedAt - a.updatedAt);
    }
    const mapped = items.slice(0, input.limit).map((it) => ({ ...it, boardName: bName.get(it.boardId), due: dueDateOf(it.values, byBoard.get(it.boardId) ?? []) }));
    results.items = mapped.filter((i) => !i.parentItemId);
    results.subitems = mapped.filter((i) => i.parentItemId);
  }

  if (types.has('documents')) {
    const rows = await db
      .prepare(
        `SELECT d.id, d.title, d.visibility, d.created_by, d.updated_at, substr(d.search_text, 1, 160) AS excerpt, dm.role AS doc_role FROM documents d
         LEFT JOIN document_members dm ON dm.document_id = d.id AND dm.user_id = ?
         WHERE d.workspace_id = ? AND d.archived_at IS NULL ${q ? "AND d.search_text LIKE ? ESCAPE '\\'" : ''} ORDER BY d.updated_at DESC LIMIT ?`,
      )
      .bind(userId, wsId, ...(q ? [like] : []), input.limit)
      .all<any>();
    results.documents = rows.results.filter((d) => wsAtLeast(role, 'admin') || d.visibility === 'workspace' || d.created_by === userId || d.doc_role).map(({ doc_role: _r, ...d }) => d);
  }

  if (types.has('comments') && boards.length && q) {
    const rows = await db
      .prepare(
        `SELECT up.id, up.body, up.created_at, up.item_id, up.board_id, i.name AS item_name, u.name AS author_name FROM updates up
         JOIN items i ON i.id = up.item_id JOIN users u ON u.id = up.author_id
         WHERE up.workspace_id = ? AND up.deleted_at IS NULL AND up.board_id IN (${placeholders(boards.length)}) AND lower(up.body) LIKE ? ESCAPE '\\'
         ORDER BY up.created_at DESC LIMIT ?`,
      )
      .bind(wsId, ...boards, like, input.limit)
      .all();
    results.comments = rows.results;
  }

  if (types.has('users')) {
    results.users = members.filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.email.toLowerCase().includes(q.toLowerCase())).slice(0, input.limit);
  }
  return results;
}

searchRoutes.post('/workspaces/:ws/search', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `search:${user.id}`, 120, 60_000);
  const input = await body(c, searchSchema);
  return c.json(await runSearch(c.env.DB, c.req.param('ws'), user.id, input));
});

// ------------------------------------------------------------ saved filters

searchRoutes.get('/workspaces/:ws/saved-filters', async (c) => {
  const user = c.get('user');
  await requireWorkspace(c.env.DB, c.req.param('ws'), user.id);
  const rows = await c.env.DB.prepare('SELECT * FROM saved_filters WHERE workspace_id = ? AND user_id = ? ORDER BY created_at DESC').bind(c.req.param('ws'), user.id).all<any>();
  return c.json(rows.results.map((r) => ({ id: r.id, name: r.name, scope: r.scope, query: parseJson(r.query_json, {}), createdAt: r.created_at })));
});

searchRoutes.post('/workspaces/:ws/saved-filters', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(100), scope: z.string().max(30).default('search'), query: z.record(z.string(), z.unknown()) }));
  const json = JSON.stringify(input.query);
  if (json.length > 10000) throw notFound('Filter too large');
  const id = newId();
  await c.env.DB.prepare('INSERT INTO saved_filters (id, workspace_id, user_id, name, scope, query_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, wsId, user.id, input.name, input.scope, json, now()).run();
  return c.json({ id }, 201);
});

searchRoutes.delete('/saved-filters/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM saved_filters WHERE id = ? AND user_id = ?').bind(c.req.param('id'), c.get('user').id).run();
  return c.json({ ok: true });
});
