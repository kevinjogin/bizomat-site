// Item domain operations. Used by HTTP routes AND the automation engine so that
// validation, activity tracking, notifications, realtime fan-out and
// automation triggers behave identically no matter who makes the change.

import { getColumnType, isComputed, normalizeColumnValue, doneLabelIds, labelsOf } from '../../shared/columns';
import type { ColumnDTO } from '../../shared/types';
import { assigneesOf, positionBetween } from '../../shared/items';
import { HttpError, badRequest, newId, now, parseJson, placeholders } from '../lib/util';
import { broadcast } from '../realtime/board-room';
import { activityStmt } from './audit';
import type { Svc } from './context';
import { loadColumns } from './mappers';
import type { BoardRow, ItemRow } from './permissions';
import { itemLink, notify } from './notify';
import { dispatchEvent } from './automations';

const MAX_NAME = 500;

function actorId(svc: Svc) {
  return svc.actor?.id ?? null;
}

function activityAction(svc: Svc, action: string) {
  return svc.automationName ? `${action}:automation` : action;
}

export function buildSearchText(name: string, description: string, values: Record<string, unknown>, columns: ColumnDTO[]): string {
  const parts = [name, description];
  for (const c of columns) {
    const v = values[c.id];
    if (v == null || c.type === 'person' || c.type === 'people' || c.type === 'files' || c.type === 'dependency') continue;
    parts.push(getColumnType(c.type).toText(v, c.settings));
  }
  return parts.join(' • ').toLowerCase().slice(0, 4000);
}

function isDone(values: Record<string, unknown>, columns: ColumnDTO[]): boolean {
  return columns.some((c) => c.type === 'status' && typeof values[c.id] === 'string' && doneLabelIds(c).includes(values[c.id] as string));
}

/**
 * Validate a values patch against the board's columns. Unknown or computed
 * columns, invalid values and references to users/items outside the tenant
 * are rejected.
 */
export async function validateValues(
  svc: Svc,
  board: BoardRow,
  columns: ColumnDTO[],
  patch: Record<string, unknown>,
  itemId?: string,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  const errors: { column: string; message: string }[] = [];
  const userRefs = new Set<string>();
  const itemRefs = new Set<string>();
  const fileRefs = new Set<string>();
  for (const [colId, raw] of Object.entries(patch)) {
    const col = columns.find((c) => c.id === colId);
    if (!col) {
      errors.push({ column: colId, message: 'Unknown column' });
      continue;
    }
    if (isComputed(col.type)) {
      errors.push({ column: col.title, message: 'This column is computed and cannot be edited' });
      continue;
    }
    if (col.type === 'progress' && col.settings?.mode && col.settings.mode !== 'manual') {
      errors.push({ column: col.title, message: 'This progress column is calculated automatically' });
      continue;
    }
    const r = normalizeColumnValue(col, raw);
    if (!r.ok) {
      errors.push({ column: col.title, message: r.error });
      continue;
    }
    out[colId] = r.value;
    if (r.value != null) {
      if (col.type === 'person') userRefs.add(r.value as string);
      if (col.type === 'people') (r.value as string[]).forEach((u) => userRefs.add(u));
      if (col.type === 'dependency') (r.value as string[]).forEach((i) => itemRefs.add(i));
      if (col.type === 'files') (r.value as string[]).forEach((f) => fileRefs.add(f));
    }
  }
  if (userRefs.size) {
    const ids = Array.from(userRefs);
    const rows = await svc.db
      .prepare(`SELECT user_id FROM workspace_members WHERE workspace_id = ? AND user_id IN (${placeholders(ids.length)})`)
      .bind(board.workspace_id, ...ids)
      .all<{ user_id: string }>();
    const ok = new Set(rows.results.map((r) => r.user_id));
    const bad = ids.filter((i) => !ok.has(i));
    if (bad.length) errors.push({ column: 'person', message: 'Assignees must be members of this workspace' });
  }
  if (itemRefs.size) {
    const ids = Array.from(itemRefs);
    if (itemId && itemRefs.has(itemId)) errors.push({ column: 'dependency', message: 'An item cannot depend on itself' });
    const rows = await svc.db
      .prepare(`SELECT id FROM items WHERE board_id = ? AND id IN (${placeholders(ids.length)})`)
      .bind(board.id, ...ids)
      .all<{ id: string }>();
    if (rows.results.length !== ids.length) errors.push({ column: 'dependency', message: 'Dependencies must be items on this board' });
  }
  if (fileRefs.size) {
    const ids = Array.from(fileRefs);
    const rows = await svc.db
      .prepare(`SELECT id FROM attachments WHERE workspace_id = ? AND board_id = ? AND deleted_at IS NULL AND id IN (${placeholders(ids.length)})`)
      .bind(board.workspace_id, board.id, ...ids)
      .all<{ id: string }>();
    if (rows.results.length !== ids.length) errors.push({ column: 'files', message: 'Files must be uploaded to this board' });
  }
  if (errors.length) throw new HttpError(422, errors.map((e) => `${e.column}: ${e.message}`).join('; '), errors);
  return out;
}

function mergeValues(base: Record<string, unknown>, patch: Record<string, unknown>) {
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v == null) delete out[k];
    else out[k] = v;
  }
  return out;
}

async function defaultGroupId(db: D1Database, boardId: string): Promise<string> {
  const g = await db
    .prepare('SELECT id FROM groups WHERE board_id = ? AND archived_at IS NULL ORDER BY position LIMIT 1')
    .bind(boardId)
    .first<{ id: string }>();
  if (!g) throw badRequest('Board has no groups. Create a group first.');
  return g.id;
}

async function assertGroup(db: D1Database, boardId: string, groupId: string) {
  const g = await db.prepare('SELECT id FROM groups WHERE id = ? AND board_id = ?').bind(groupId, boardId).first();
  if (!g) throw badRequest('Group does not belong to this board');
}

function emitRealtime(svc: Svc, boardId: string, kind: string, extra: Record<string, unknown> = {}) {
  svc.waitUntil(broadcast(svc.env, boardId, { kind, actorId: actorId(svc), ...extra }));
}

async function notifyAssignmentChanges(
  svc: Svc,
  board: BoardRow,
  item: ItemRow,
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  columns: ColumnDTO[],
) {
  const prev = new Set(assigneesOf(before, columns));
  const added = assigneesOf(after, columns).filter((u) => !prev.has(u));
  if (!added.length) return;
  await notify(svc, {
    workspaceId: board.workspace_id,
    userIds: added,
    type: 'assignment',
    title: `You were assigned to "${item.name}"`,
    body: `${svc.actor?.name ?? svc.automationName ?? 'Automation'} assigned you on ${board.name}`,
    link: itemLink(board.workspace_id, board.id, item.id),
    entityType: 'item',
    entityId: item.id,
  });
}

export interface CreateItemInput {
  groupId?: string;
  name: string;
  description?: string;
  values?: Record<string, unknown>;
  parentItemId?: string | null;
  position?: 'top' | 'bottom' | number;
}

export async function createItem(svc: Svc, board: BoardRow, input: CreateItemInput, columns?: ColumnDTO[]): Promise<ItemRow> {
  const cols = columns ?? (await loadColumns(svc.db, board.id));
  const name = input.name.trim().slice(0, MAX_NAME);
  if (!name) throw badRequest('Item name is required');
  let groupId = input.groupId;
  let parent: ItemRow | null = null;
  if (input.parentItemId) {
    parent = await svc.db.prepare('SELECT * FROM items WHERE id = ? AND board_id = ?').bind(input.parentItemId, board.id).first<ItemRow>();
    if (!parent) throw badRequest('Parent item does not belong to this board');
    if (parent.parent_item_id) throw badRequest('Subitems cannot have their own subitems');
    groupId = parent.group_id;
  }
  if (groupId) await assertGroup(svc.db, board.id, groupId);
  else groupId = await defaultGroupId(svc.db, board.id);

  const boardSettings = parseJson<{ defaultValues?: Record<string, unknown> }>(board.settings_json, {});
  const defaults = parent ? {} : boardSettings.defaultValues ?? {};
  const requested = { ...defaults, ...(input.values ?? {}) };
  // Required columns are enforced on edit; on creation we allow empty values so
  // quick-add works, but every provided value is validated.
  const provided = Object.fromEntries(Object.entries(requested).filter(([, v]) => v != null && v !== ''));
  const values = mergeValues({}, await validateValues(svc, board, cols.map((c) => ({ ...c, required: false })), provided));

  const scope = parent ? 'parent_item_id = ?' : 'group_id = ? AND parent_item_id IS NULL';
  const scopeArg = parent ? parent.id : groupId;
  let position: number;
  if (typeof input.position === 'number') position = input.position;
  else {
    const agg = await svc.db
      .prepare(`SELECT MIN(position) AS lo, MAX(position) AS hi FROM items WHERE ${scope}`)
      .bind(scopeArg)
      .first<{ lo: number | null; hi: number | null }>();
    position = input.position === 'top' ? positionBetween(null, agg?.lo ?? null) : positionBetween(agg?.hi ?? null, null);
  }
  const t = now();
  const id = newId();
  const description = (input.description ?? '').slice(0, 20000);
  const item: ItemRow = {
    id,
    workspace_id: board.workspace_id,
    board_id: board.id,
    group_id: groupId,
    parent_item_id: parent?.id ?? null,
    name,
    description,
    position,
    values_json: JSON.stringify(values),
    search_text: buildSearchText(name, description, values, cols),
    created_by: svc.actor?.id ?? board.created_by,
    created_at: t,
    updated_at: t,
    completed_at: isDone(values, cols) ? t : null,
    archived_at: null,
  };
  await svc.db.batch([
    svc.db
      .prepare(
        `INSERT INTO items (id, workspace_id, board_id, group_id, parent_item_id, name, description, position, values_json, search_text, created_by, created_at, updated_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(item.id, item.workspace_id, item.board_id, item.group_id, item.parent_item_id, item.name, item.description, item.position, item.values_json, item.search_text, item.created_by, t, t, item.completed_at),
    activityStmt(svc.db, {
      workspaceId: board.workspace_id,
      boardId: board.id,
      itemId: parent?.id ?? id,
      actorId: actorId(svc),
      action: activityAction(svc, parent ? 'subitem_created' : 'item_created'),
      newValue: { id, name },
    }),
    svc.db.prepare('UPDATE boards SET updated_at = ? WHERE id = ?').bind(t, board.id),
  ]);
  await notifyAssignmentChanges(svc, board, item, {}, values, cols);
  emitRealtime(svc, board.id, 'item_created', { itemId: id });
  await dispatchEvent(svc, board, { type: 'item_created', item, isSubitem: !!parent });
  return item;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  values?: Record<string, unknown>;
}

export async function updateItem(svc: Svc, board: BoardRow, item: ItemRow, patch: UpdateItemInput, columns?: ColumnDTO[]): Promise<ItemRow> {
  const cols = columns ?? (await loadColumns(svc.db, board.id));
  const before = parseJson<Record<string, unknown>>(item.values_json, {});
  const changes = patch.values ? await validateValues(svc, board, cols, patch.values, item.id) : {};
  const after = mergeValues(before, changes);
  const name = patch.name !== undefined ? patch.name.trim().slice(0, MAX_NAME) : item.name;
  if (!name) throw badRequest('Item name is required');
  const description = patch.description !== undefined ? patch.description.slice(0, 20000) : item.description;
  const t = now();
  const wasDone = item.completed_at != null;
  const nowDone = isDone(after, cols);
  const completedAt = nowDone ? (wasDone ? item.completed_at : t) : null;

  const stmts: D1PreparedStatement[] = [];
  // Per-column JSON updates keep concurrent edits to different columns safe.
  let setExpr = 'values_json';
  const setArgs: unknown[] = [];
  const changedCols: string[] = [];
  for (const [colId, v] of Object.entries(changes)) {
    const old = before[colId] ?? null;
    if (JSON.stringify(old) === JSON.stringify(v ?? null)) continue;
    changedCols.push(colId);
    const path = `$."${colId.replace(/"/g, '')}"`;
    if (v == null) {
      setExpr = `json_remove(${setExpr}, ?)`;
      setArgs.push(path);
    } else {
      setExpr = `json_set(${setExpr}, ?, json(?))`;
      setArgs.push(path, JSON.stringify(v));
    }
    stmts.push(
      activityStmt(svc.db, {
        workspaceId: board.workspace_id,
        boardId: board.id,
        itemId: item.id,
        actorId: actorId(svc),
        action: activityAction(svc, 'value_changed'),
        columnId: colId,
        oldValue: old,
        newValue: v ?? null,
      }),
    );
  }
  if (name !== item.name) {
    stmts.push(activityStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), action: activityAction(svc, 'renamed'), oldValue: item.name, newValue: name }));
  }
  if (description !== item.description) {
    stmts.push(activityStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), action: activityAction(svc, 'description_changed') }));
  }
  if (!stmts.length) return item;
  const searchText = buildSearchText(name, description, after, cols);
  stmts.unshift(
    svc.db
      .prepare(`UPDATE items SET values_json = ${setExpr}, name = ?, description = ?, search_text = ?, updated_at = ?, completed_at = ? WHERE id = ?`)
      .bind(...setArgs, name, description, searchText, t, completedAt, item.id),
  );
  await svc.db.batch(stmts);
  const updated: ItemRow = { ...item, name, description, values_json: JSON.stringify(after), search_text: searchText, updated_at: t, completed_at: completedAt };

  await notifyAssignmentChanges(svc, board, updated, before, after, cols);
  for (const colId of changedCols) {
    const col = cols.find((c) => c.id === colId)!;
    if (col.type === 'status') {
      const label = labelsOf(col).find((l) => l.id === after[colId])?.label ?? 'empty';
      await notify(svc, {
        workspaceId: board.workspace_id,
        userIds: assigneesOf(after, cols),
        type: 'status_change',
        title: `"${updated.name}" is now ${label}`,
        body: `${col.title} changed on ${board.name}`,
        link: itemLink(board.workspace_id, board.id, item.id),
        entityType: 'item',
        entityId: item.id,
      });
    }
  }
  emitRealtime(svc, board.id, 'item_updated', { itemId: item.id });
  for (const colId of changedCols) {
    await dispatchEvent(svc, board, { type: 'column_changed', item: updated, columnId: colId, oldValue: before[colId] ?? null, newValue: after[colId] ?? null });
  }
  return updated;
}

export async function moveItem(svc: Svc, board: BoardRow, item: ItemRow, to: { groupId?: string; position?: number; beforeId?: string | null; afterId?: string | null }): Promise<ItemRow> {
  if (item.parent_item_id && to.groupId && to.groupId !== item.group_id) throw badRequest('Move the parent item to change a subitem group');
  const groupId = to.groupId ?? item.group_id;
  if (groupId !== item.group_id) await assertGroup(svc.db, board.id, groupId);
  let position = to.position;
  if (position === undefined) {
    const ids = [to.beforeId, to.afterId].filter(Boolean) as string[];
    const rows = ids.length
      ? await svc.db.prepare(`SELECT id, position FROM items WHERE board_id = ? AND id IN (${placeholders(ids.length)})`).bind(board.id, ...ids).all<{ id: string; position: number }>()
      : { results: [] as { id: string; position: number }[] };
    const pos = (id?: string | null) => rows.results.find((r) => r.id === id)?.position ?? null;
    // beforeId = the item that will be ABOVE the moved item; afterId = BELOW.
    if (!to.beforeId && !to.afterId) {
      const agg = await svc.db.prepare('SELECT MAX(position) AS hi FROM items WHERE group_id = ? AND parent_item_id IS NULL').bind(groupId).first<{ hi: number | null }>();
      position = positionBetween(agg?.hi ?? null, null);
    } else position = positionBetween(pos(to.beforeId), pos(to.afterId));
  }
  const t = now();
  const stmts = [
    svc.db.prepare('UPDATE items SET group_id = ?, position = ?, updated_at = ? WHERE id = ?').bind(groupId, position, t, item.id),
    svc.db.prepare('UPDATE items SET group_id = ? WHERE parent_item_id = ?').bind(groupId, item.id),
  ];
  if (groupId !== item.group_id) {
    stmts.push(activityStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), action: activityAction(svc, 'moved'), oldValue: item.group_id, newValue: groupId }));
  }
  await svc.db.batch(stmts);
  const moved = { ...item, group_id: groupId, position, updated_at: t };
  emitRealtime(svc, board.id, 'item_moved', { itemId: item.id });
  if (groupId !== item.group_id) await dispatchEvent(svc, board, { type: 'item_moved', item: moved, fromGroupId: item.group_id, toGroupId: groupId });
  return moved;
}

export async function setItemArchived(svc: Svc, board: BoardRow, item: ItemRow, archived: boolean) {
  const t = now();
  await svc.db.batch([
    svc.db.prepare('UPDATE items SET archived_at = ?, updated_at = ? WHERE id = ? OR parent_item_id = ?').bind(archived ? t : null, t, item.id, item.id),
    activityStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), action: activityAction(svc, archived ? 'archived' : 'restored') }),
  ]);
  emitRealtime(svc, board.id, archived ? 'item_archived' : 'item_restored', { itemId: item.id });
}

export async function deleteItem(svc: Svc, board: BoardRow, item: ItemRow) {
  const files = await svc.db
    .prepare('SELECT r2_key FROM attachments WHERE item_id IN (SELECT id FROM items WHERE id = ?1 OR parent_item_id = ?1)')
    .bind(item.id)
    .all<{ r2_key: string }>();
  await svc.db.batch([
    svc.db.prepare('DELETE FROM attachments WHERE item_id IN (SELECT id FROM items WHERE id = ?1 OR parent_item_id = ?1)').bind(item.id),
    svc.db.prepare('DELETE FROM items WHERE parent_item_id = ?').bind(item.id),
    svc.db.prepare('DELETE FROM items WHERE id = ?').bind(item.id),
    activityStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: null, actorId: actorId(svc), action: 'item_deleted', oldValue: { id: item.id, name: item.name } }),
  ]);
  if (files.results.length) svc.waitUntil(svc.env.FILES.delete(files.results.map((f) => f.r2_key)));
  emitRealtime(svc, board.id, 'item_deleted', { itemId: item.id });
}

export async function duplicateItem(svc: Svc, board: BoardRow, item: ItemRow, opts: { groupId?: string; withSubitems?: boolean; name?: string } = {}): Promise<ItemRow> {
  const cols = await loadColumns(svc.db, board.id);
  const values = parseJson<Record<string, unknown>>(item.values_json, {});
  // Files are owned by the original item, so they are not carried over.
  for (const c of cols) if (c.type === 'files') delete values[c.id];
  const copy = await createItem(
    svc,
    board,
    {
      groupId: opts.groupId ?? item.group_id,
      parentItemId: item.parent_item_id,
      name: opts.name ?? `${item.name} (copy)`,
      description: item.description,
      values,
      position: item.parent_item_id ? undefined : positionBetween(item.position, item.position + 1),
    },
    cols,
  );
  if (opts.withSubitems !== false && !item.parent_item_id) {
    const subs = await svc.db.prepare('SELECT * FROM items WHERE parent_item_id = ? AND archived_at IS NULL ORDER BY position').bind(item.id).all<ItemRow>();
    for (const s of subs.results) {
      const sv = parseJson<Record<string, unknown>>(s.values_json, {});
      for (const c of cols) if (c.type === 'files') delete sv[c.id];
      await createItem(svc, board, { parentItemId: copy.id, name: s.name, description: s.description, values: sv }, cols);
    }
  }
  return copy;
}
