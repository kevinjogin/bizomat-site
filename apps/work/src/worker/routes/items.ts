import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, newId, notFound, now, parseJson, placeholders } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { activityStmt } from '../services/audit';
import { svcFromContext } from '../services/context';
import { createItem, deleteItem, duplicateItem, moveItem, setItemArchived, updateItem } from '../services/item-ops';
import { itemDTO, loadColumns } from '../services/mappers';
import { extractMentions, itemLink, notify } from '../services/notify';
import { type ItemRow } from '../services/permissions';
import { assertPatchAllowed, financialColumnIds, requireProject, requireTask, rightsForPatch, stripValues } from '../services/access';
import { broadcast } from '../realtime/board-room';
import { dispatchEvent } from '../services/automations';
import { assigneesOf } from '../../shared/items';

export const itemRoutes = new Hono<AppEnv>();

const valuesSchema = z.record(z.string().max(64), z.unknown()).refine((v) => Object.keys(v).length <= 100, 'Too many values');

itemRoutes.post('/boards/:id/items', async (c) => {
  const user = c.get('user');
  const { board, caps } = await requireProject(c.env.DB, c.req.param('id'), user.id, 'createTasks');
  if (board.archived_at) throw new HttpError(409, 'Board is archived. Restore it before editing.');
  const input = await body(
    c,
    z.object({
      name: z.string().trim().min(1).max(500),
      groupId: z.string().optional(),
      parentItemId: z.string().nullable().optional(),
      values: valuesSchema.optional(),
      description: z.string().max(20000).optional(),
      position: z.union([z.enum(['top', 'bottom']), z.number()]).optional(),
    }),
  );
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM items WHERE board_id = ?').bind(board.id).first<{ n: number }>();
  if ((count?.n ?? 0) >= 20000) throw badRequest('Board item limit reached');
  if (input.values && Object.keys(input.values).length) {
    const cols = await loadColumns(c.env.DB, board.id);
    const need = rightsForPatch(cols, { values: input.values });
    if (need.has('editFinance') && !caps.editFinance) throw new HttpError(403, 'You do not have permission to change the financial data of this task');
    if (need.has('manageAssignments') && !caps.assignTasks) throw new HttpError(403, 'You do not have permission to change who this task is assigned to');
  }
  const item = await createItem(svcFromContext(c), board, { ...input, position: input.position ?? (input.parentItemId ? 'bottom' : 'bottom') });
  const fresh = await c.env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(item.id).first<ItemRow>();
  return c.json(itemDTO(fresh ?? item), 201);
});

itemRoutes.get('/items/:id', async (c) => {
  const user = c.get('user');
  const t = await requireTask(c.env.DB, c.req.param('id'), user.id, 'view');
  const { item, board, caps } = t;
  const access = t.project ? t.project.access : caps.edit ? 'edit' : 'view';
  const db = c.env.DB;
  const hidden = caps.viewFinance ? new Set<string>() : financialColumnIds(await loadColumns(db, board.id));
  const [subitems, attachments, timeEntries, parent] = await Promise.all([
    db.prepare('SELECT * FROM items WHERE parent_item_id = ? AND archived_at IS NULL ORDER BY position').bind(item.id).all<ItemRow>(),
    db.prepare('SELECT id, file_name, content_type, size, uploader_id, created_at, item_id, document_id FROM attachments WHERE item_id = ? AND deleted_at IS NULL ORDER BY created_at DESC').bind(item.id).all<any>(),
    db.prepare('SELECT t.*, u.name AS user_name FROM time_entries t JOIN users u ON u.id = t.user_id WHERE t.item_id = ? ORDER BY t.started_at DESC LIMIT 100').bind(item.id).all<any>(),
    item.parent_item_id ? db.prepare('SELECT id, name FROM items WHERE id = ?').bind(item.parent_item_id).first<{ id: string; name: string }>() : Promise.resolve(null),
  ]);
  c.executionCtx.waitUntil(
    db.prepare("INSERT INTO recents (user_id, workspace_id, entity_type, entity_id, visited_at) VALUES (?, ?, 'item', ?, ?) ON CONFLICT(user_id, entity_type, entity_id) DO UPDATE SET visited_at = excluded.visited_at")
      .bind(user.id, item.workspace_id, item.id, now())
      .run(),
  );
  return c.json({
    item: stripValues(itemDTO(item), hidden),
    parent,
    board: { id: board.id, name: board.name, workspaceId: board.workspace_id, access, projectAccess: !!t.project },
    caps,
    subitems: subitems.results.map((x) => stripValues(itemDTO(x), hidden)),
    attachments: attachments.results.map((a) => ({ id: a.id, fileName: a.file_name, contentType: a.content_type, size: a.size, url: `/api/files/${a.id}`, itemId: a.item_id, documentId: a.document_id, uploaderId: a.uploader_id, createdAt: a.created_at })),
    timeEntries: timeEntries.results,
  });
});

itemRoutes.patch('/items/:id', async (c) => {
  const user = c.get('user');
  const t = await requireTask(c.env.DB, c.req.param('id'), user.id, 'view');
  const { item, board } = t;
  if (board.archived_at) throw new HttpError(409, 'Board is archived. Restore it before editing.');
  const input = await body(c, z.object({ name: z.string().max(500).optional(), description: z.string().max(20000).optional(), values: valuesSchema.optional() }));
  const cols = await loadColumns(c.env.DB, board.id);
  assertPatchAllowed(t.caps, rightsForPatch(cols, input));
  const updated = await updateItem(svcFromContext(c), board, item, input, cols);
  return c.json(stripValues(itemDTO(updated), t.caps.viewFinance ? new Set() : financialColumnIds(cols)));
});

itemRoutes.post('/items/:id/move', async (c) => {
  const { item, board } = await projectTask(c, 'edit');
  const input = await body(c, z.object({ groupId: z.string().optional(), beforeId: z.string().nullable().optional(), afterId: z.string().nullable().optional(), position: z.number().optional() }));
  const moved = await moveItem(svcFromContext(c), board, item, input);
  return c.json(itemDTO(moved));
});

itemRoutes.post('/items/:id/duplicate', async (c) => {
  const { item, board } = await projectTask(c, 'createTasks');
  const input = await body(c, z.object({ withSubitems: z.boolean().default(true) }));
  const copy = await duplicateItem(svcFromContext(c), board, item, input);
  return c.json(itemDTO(copy), 201);
});

itemRoutes.post('/items/:id/archive', async (c) => {
  const { item, board } = await projectTask(c, 'edit');
  await setItemArchived(svcFromContext(c), board, item, true);
  return c.json({ ok: true });
});

itemRoutes.post('/items/:id/restore', async (c) => {
  const { item, board } = await projectTask(c, 'edit');
  const group = await c.env.DB.prepare('SELECT archived_at FROM groups WHERE id = ?').bind(item.group_id).first<{ archived_at: number | null }>();
  if (group?.archived_at) throw badRequest('Restore the group first');
  await setItemArchived(svcFromContext(c), board, item, false);
  return c.json({ ok: true });
});

itemRoutes.delete('/items/:id', async (c) => {
  const user = c.get('user');
  const { item, board } = await requireTask(c.env.DB, c.req.param('id'), user.id, 'delete');
  await deleteItem(svcFromContext(c), board, item);
  return c.json({ ok: true });
});

itemRoutes.post('/boards/:id/items/bulk', async (c) => {
  const user = c.get('user');
  const { board, caps } = await requireProject(c.env.DB, c.req.param('id'), user.id, 'edit');
  const input = await body(
    c,
    z.object({
      itemIds: z.array(z.string()).min(1).max(500),
      action: z.enum(['archive', 'restore', 'delete', 'move', 'set_value', 'duplicate']),
      groupId: z.string().optional(),
      columnId: z.string().optional(),
      value: z.unknown().optional(),
    }),
  );
  const rows = await c.env.DB.prepare(`SELECT * FROM items WHERE board_id = ? AND id IN (${placeholders(input.itemIds.length)})`).bind(board.id, ...input.itemIds).all<ItemRow>();
  if (rows.results.length !== new Set(input.itemIds).size) throw notFound('One or more items');
  const svc = svcFromContext(c);
  const cols = await loadColumns(c.env.DB, board.id);
  if (input.action === 'delete' && !caps.deleteTasks) throw new HttpError(403, 'Your access to this project does not include deleting tasks');
  if (input.action === 'duplicate' && !caps.createTasks) throw new HttpError(403, 'Your access to this project does not include creating tasks');
  if (input.action === 'set_value' && input.columnId) {
    const need = rightsForPatch(cols, { values: { [input.columnId]: input.value ?? null } });
    if (need.has('editFinance') && !caps.editFinance) throw new HttpError(403, 'You do not have permission to change financial data on this project');
    if (need.has('manageAssignments') && !caps.assignTasks) throw new HttpError(403, 'You do not have permission to assign tasks on this project');
  }
  const errors: { itemId: string; error: string }[] = [];
  for (const it of rows.results) {
    try {
      if (input.action === 'archive') await setItemArchived(svc, board, it, true);
      else if (input.action === 'restore') await setItemArchived(svc, board, it, false);
      else if (input.action === 'delete') await deleteItem(svc, board, it);
      else if (input.action === 'duplicate') await duplicateItem(svc, board, it);
      else if (input.action === 'move') {
        if (!input.groupId) throw badRequest('groupId required');
        if (!it.parent_item_id) await moveItem(svc, board, it, { groupId: input.groupId });
      } else if (input.action === 'set_value') {
        if (!input.columnId) throw badRequest('columnId required');
        await updateItem(svc, board, it, { values: { [input.columnId]: input.value ?? null } }, cols);
      }
    } catch (e) {
      errors.push({ itemId: it.id, error: e instanceof Error ? e.message : 'Failed' });
    }
  }
  return c.json({ ok: errors.length === 0, processed: rows.results.length - errors.length, errors });
});

itemRoutes.get('/items/:id/activity', async (c) => {
  const user = c.get('user');
  const { item, caps, board } = await requireTask(c.env.DB, c.req.param('id'), user.id, 'view');
  const hiddenCols = caps.viewFinance ? new Set<string>() : financialColumnIds(await loadColumns(c.env.DB, board.id));
  const rows = await c.env.DB.prepare(
    `SELECT a.*, u.name AS actor_name FROM activity_log a LEFT JOIN users u ON u.id = a.actor_id
     WHERE a.item_id = ? OR a.item_id IN (SELECT id FROM items WHERE parent_item_id = ?) ORDER BY a.created_at DESC LIMIT 200`,
  )
    .bind(item.id, item.id)
    .all<any>();
  return c.json(
    rows.results.map((r) => ({
      id: r.id,
      boardId: r.board_id,
      itemId: r.item_id,
      actorId: r.actor_id,
      actorName: r.actor_name ?? (String(r.action).endsWith(':automation') ? 'Automation' : null),
      action: r.action,
      columnId: r.column_id,
      // Financial amounts are not shown to people without finance access: the change is listed, the values are not.
      oldValue: hiddenCols.has(r.column_id) ? null : parseJson(r.old_value, null),
      newValue: hiddenCols.has(r.column_id) ? null : parseJson(r.new_value, null),
      restricted: hiddenCols.has(r.column_id) || undefined,
      createdAt: r.created_at,
    })),
  );
});

// ------------------------------------------------------- updates / comments

itemRoutes.get('/items/:id/updates', async (c) => {
  const user = c.get('user');
  const { item } = await requireTask(c.env.DB, c.req.param('id'), user.id, 'view');
  const rows = await c.env.DB.prepare(
    `SELECT up.*, u.name AS author_name FROM updates up JOIN users u ON u.id = up.author_id
     WHERE up.item_id = ? AND up.deleted_at IS NULL ORDER BY up.created_at`,
  )
    .bind(item.id)
    .all<any>();
  const map = (r: any) => ({ id: r.id, itemId: r.item_id, parentUpdateId: r.parent_update_id, authorId: r.author_id, authorName: r.author_name, body: r.body, createdAt: r.created_at, editedAt: r.edited_at, replies: [] as any[] });
  const all = rows.results.map(map);
  const top = all.filter((u) => !u.parentUpdateId).reverse();
  for (const u of all) if (u.parentUpdateId) top.find((t) => t.id === u.parentUpdateId)?.replies.push(u);
  return c.json(top);
});

itemRoutes.post('/items/:id/updates', async (c) => {
  const user = c.get('user');
  // Viewers may comment on boards they can see; posting is a collaboration action, not a data edit. Task-only access
  // includes commenting only when it was granted.
  const { item, board } = await requireTask(c.env.DB, c.req.param('id'), user.id, 'comment');
  await rateLimit(c.env.DB, `updates:${user.id}`, 120, 60_000);
  const input = await body(c, z.object({ body: z.string().trim().min(1).max(20000), parentUpdateId: z.string().nullable().optional() }));
  let parentAuthor: string | null = null;
  if (input.parentUpdateId) {
    const parent = await c.env.DB.prepare('SELECT author_id, parent_update_id FROM updates WHERE id = ? AND item_id = ? AND deleted_at IS NULL').bind(input.parentUpdateId, item.id).first<{ author_id: string; parent_update_id: string | null }>();
    if (!parent) throw badRequest('Reply target not found');
    if (parent.parent_update_id) throw badRequest('Replies cannot be nested further');
    parentAuthor = parent.author_id;
  }
  const id = newId();
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO updates (id, workspace_id, board_id, item_id, parent_update_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, board.workspace_id, board.id, item.id, input.parentUpdateId ?? null, user.id, input.body, t),
    activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: user.id, action: input.parentUpdateId ? 'reply_posted' : 'update_posted' }),
  ]);
  const svc = svcFromContext(c);
  const link = itemLink(board.workspace_id, board.id, item.id);
  const excerpt = input.body.replace(/@\[([^\]]+)\]\(user:[^)]+\)/g, '@$1').slice(0, 200);
  const mentioned = extractMentions(input.body);
  if (mentioned.length) {
    // Only notify mentioned users who can actually see this task (through the project or a task grant).
    const { usersWithAccess } = await import('../services/access');
    const allowed = Array.from(await usersWithAccess(c.env.DB, board, item.id, mentioned.slice(0, 50)));
    await notify(svc, { workspaceId: board.workspace_id, userIds: allowed, type: 'mention', title: `${user.name} mentioned you on "${item.name}"`, body: excerpt, link, entityType: 'item', entityId: item.id, email: await commentEmail(c, board, item, user.name, excerpt, true) });
  }
  if (parentAuthor && !mentioned.includes(parentAuthor)) {
    await notify(svc, { workspaceId: board.workspace_id, userIds: [parentAuthor], type: 'reply', title: `${user.name} replied on "${item.name}"`, body: excerpt, link, entityType: 'item', entityId: item.id, email: await commentEmail(c, board, item, user.name, excerpt, false) });
  }
  // Item followers: creator + assignees.
  const cols = await loadColumns(c.env.DB, board.id);
  const followers = [item.created_by, ...assigneesOf(parseJson(item.values_json, {}), cols)].filter((u) => !mentioned.includes(u) && u !== parentAuthor);
  await notify(svc, { workspaceId: board.workspace_id, userIds: followers, type: 'comment', title: `${user.name} commented on "${item.name}"`, body: excerpt, link, entityType: 'item', entityId: item.id, email: await commentEmail(c, board, item, user.name, excerpt, false) });
  c.executionCtx.waitUntil(broadcast(c.env, board.id, { kind: 'update_posted', itemId: item.id, actorId: user.id }));
  await dispatchEvent(svc, board, { type: 'update_posted', item, updateId: id });
  return c.json({ id, itemId: item.id, parentUpdateId: input.parentUpdateId ?? null, authorId: user.id, authorName: user.name, body: input.body, createdAt: t, editedAt: null, replies: [] }, 201);
});

async function loadUpdate(c: any) {
  const u = (await c.env.DB.prepare('SELECT * FROM updates WHERE id = ? AND deleted_at IS NULL').bind(c.req.param('updateId')).first()) as any;
  if (!u) throw notFound('Update');
  const auth = await requireTask(c.env.DB, u.item_id, c.get('user').id, 'view');
  return { update: u, ...auth, access: auth.project?.access ?? 'view' };
}

itemRoutes.patch('/updates/:updateId', async (c) => {
  const { update } = await loadUpdate(c);
  if (update.author_id !== c.get('user').id) throw new HttpError(403, 'You can only edit your own updates');
  const input = await body(c, z.object({ body: z.string().trim().min(1).max(20000) }));
  await c.env.DB.prepare('UPDATE updates SET body = ?, edited_at = ? WHERE id = ?').bind(input.body, now(), update.id).run();
  return c.json({ ok: true });
});

itemRoutes.delete('/updates/:updateId', async (c) => {
  const { update, access } = await loadUpdate(c);
  if (update.author_id !== c.get('user').id && access !== 'admin') throw new HttpError(403, 'You can only delete your own updates');
  await c.env.DB.prepare('UPDATE updates SET deleted_at = ? WHERE id = ? OR parent_update_id = ?').bind(now(), update.id, update.id).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------ time tracking

itemRoutes.post('/items/:id/time/start', async (c) => {
  const user = c.get('user');
  const { item, board } = await requireTask(c.env.DB, c.req.param('id'), user.id, 'updateStatus');
  const t = now();
  // Only one running timer per user: stop any other.
  await c.env.DB.prepare('UPDATE time_entries SET ended_at = ?1, duration_seconds = (?1 - started_at) / 1000 WHERE user_id = ?2 AND ended_at IS NULL').bind(t, user.id).run();
  const id = newId();
  await c.env.DB.prepare('INSERT INTO time_entries (id, workspace_id, board_id, item_id, user_id, started_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, board.workspace_id, board.id, item.id, user.id, t, t).run();
  return c.json({ id, startedAt: t }, 201);
});

itemRoutes.post('/items/:id/time/stop', async (c) => {
  const user = c.get('user');
  const { item } = await requireTask(c.env.DB, c.req.param('id'), user.id, 'updateStatus');
  const t = now();
  const r = await c.env.DB.prepare('UPDATE time_entries SET ended_at = ?1, duration_seconds = (?1 - started_at) / 1000 WHERE user_id = ?2 AND item_id = ?3 AND ended_at IS NULL').bind(t, user.id, item.id).run();
  if (!r.meta.changes) throw badRequest('No running timer on this item');
  return c.json({ ok: true });
});

itemRoutes.post('/items/:id/time', async (c) => {
  const user = c.get('user');
  const { item, board } = await requireTask(c.env.DB, c.req.param('id'), user.id, 'updateStatus');
  const input = await body(c, z.object({ minutes: z.number().int().min(1).max(24 * 60), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), note: z.string().max(500).optional() }));
  const start = Date.parse(`${input.date}T09:00:00Z`);
  const id = newId();
  await c.env.DB.prepare('INSERT INTO time_entries (id, workspace_id, board_id, item_id, user_id, started_at, ended_at, duration_seconds, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, board.workspace_id, board.id, item.id, user.id, start, start + input.minutes * 60_000, input.minutes * 60, input.note ?? '', now())
    .run();
  return c.json({ id }, 201);
});

itemRoutes.delete('/time/:entryId', async (c) => {
  const user = c.get('user');
  const entry = await c.env.DB.prepare('SELECT * FROM time_entries WHERE id = ?').bind(c.req.param('entryId')).first<{ id: string; user_id: string; item_id: string }>();
  if (!entry) throw notFound('Time entry');
  const t = await requireTask(c.env.DB, entry.item_id, user.id, 'view');
  const access = t.project?.access ?? 'view';
  if (entry.user_id !== user.id && access !== 'admin') throw new HttpError(403, 'You can only delete your own time entries');
  await c.env.DB.prepare('DELETE FROM time_entries WHERE id = ?').bind(entry.id).run();
  return c.json({ ok: true });
});

// -------------------------------------------------------------- form views

itemRoutes.post('/views/:viewId/submit', async (c) => {
  const user = c.get('user');
  const view = await c.env.DB.prepare("SELECT * FROM views WHERE id = ? AND type = 'form'").bind(c.req.param('viewId')).first<{ id: string; board_id: string; settings_json: string }>();
  if (!view) throw notFound('Form');
  const { board } = await requireProject(c.env.DB, view.board_id, user.id, 'createTasks');
  await rateLimit(c.env.DB, `form:${user.id}`, 60, 60_000);
  const settings = parseJson<{ formColumns?: string[]; formGroupId?: string }>(view.settings_json, {});
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(500), values: valuesSchema.optional() }));
  const allowed = new Set(settings.formColumns ?? []);
  const values = Object.fromEntries(Object.entries(input.values ?? {}).filter(([k]) => allowed.has(k)));
  // Enforce required columns that are part of the form.
  const cols = await loadColumns(c.env.DB, board.id);
  const missing = cols.filter((col) => col.required && allowed.has(col.id) && (values[col.id] == null || values[col.id] === ''));
  if (missing.length) throw new HttpError(422, `Required: ${missing.map((m) => m.title).join(', ')}`);
  const item = await createItem(svcFromContext(c), board, { name: input.name, values, groupId: settings.formGroupId }, cols);
  return c.json(itemDTO(item), 201);
});

/** Task actions that belong to the project (moving, archiving, duplicating): task-only access does not include them. */
async function projectTask(c: any, need: 'edit' | 'createTasks') {
  const t = await requireTask(c.env.DB, c.req.param('id'), c.get('user').id, 'view');
  if (!t.project) throw new HttpError(403, 'Your access to this task does not include that');
  if (need === 'edit' && t.project.caps.level === 'view') throw new HttpError(403, 'You need edit access to this board');
  if (need === 'createTasks' && !t.project.caps.createTasks) throw new HttpError(403, 'Your access to this project does not include creating tasks');
  if (t.board.archived_at) throw new HttpError(409, 'Board is archived. Restore it before editing.');
  return t;
}

/** Email content for comments and mentions. */
async function commentEmail(c: any, board: { id: string; name: string; workspace_id: string }, item: ItemRow, author: string, excerpt: string, mention: boolean) {
  const ws = await c.env.DB.prepare('SELECT name FROM workspaces WHERE id = ?').bind(board.workspace_id).first();
  const { taskLink } = await import('../services/notify');
  return { template: 'comment_mention' as const, organisation: ws?.name ?? '', project: board.name, board: board.name, task: item.name, author, mention, excerpt, url: taskLink(board.workspace_id, item.id) };
}
