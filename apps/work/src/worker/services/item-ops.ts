// Item domain operations. Used by HTTP routes AND the automation engine so that
// validation, activity tracking, notifications, realtime fan-out and
// automation triggers behave identically no matter who makes the change.

import { getColumnType, isComputed, normalizeColumnValue, doneLabelIds, labelsOf } from '../../shared/columns';
import { allocateTaskKey } from './schedule/task-keys';
import type { ColumnDTO } from '../../shared/types';
import { assigneesOf, positionBetween } from '../../shared/items';
import { HttpError, badRequest, newId, now, parseJson, placeholders } from '../lib/util';
import { broadcast } from '../realtime/board-room';
import { activityStmt, auditEventStmt } from './audit';
import { isFinancialColumn } from '../../shared/permissions';
import type { Svc } from './context';
import { loadColumns } from './mappers';
import type { BoardRow, ItemRow } from './permissions';
import { itemLink, notify, taskLink } from './notify';
import { loadTask, usersWithAccess } from './access';
import type { TaskCaps } from '../../shared/permissions';
import { dispatchEvent } from './automations';
import { eventStmt } from './analytics';

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
    // Financial amounts stay out of the search index: people without finance access must not find tasks by amount.
    if (v == null || c.type === 'person' || c.type === 'people' || c.type === 'files' || c.type === 'dependency' || isFinancialColumn(c)) continue;
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
  /** The item's current values: people already assigned may stay even if their access has since changed. */
  previous?: Record<string, unknown>,
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
      const before = previous?.[colId];
      const had = new Set(before == null ? [] : Array.isArray(before) ? (before as string[]) : [before as string]);
      if (col.type === 'person' && !had.has(r.value as string)) userRefs.add(r.value as string);
      if (col.type === 'people') (r.value as string[]).filter((u) => !had.has(u)).forEach((u) => userRefs.add(u));
      if (col.type === 'dependency') (r.value as string[]).forEach((i) => itemRefs.add(i));
      if (col.type === 'files') (r.value as string[]).forEach((f) => fileRefs.add(f));
    }
  }
  if (userRefs.size) {
    const ids = Array.from(userRefs);
    const rows = await svc.db
      .prepare(`SELECT user_id FROM workspace_members WHERE workspace_id = ? AND status = 'active' AND user_id IN (${placeholders(ids.length)})`)
      .bind(board.workspace_id, ...ids)
      .all<{ user_id: string }>();
    const ok = new Set(rows.results.map((r) => r.user_id));
    const bad = ids.filter((i) => !ok.has(i));
    if (bad.length) errors.push({ column: 'person', message: 'Assignees must be members of this workspace' });
    else {
      // A person can only be given a task they can open: access to the project, or to this task.
      const allowed = await usersWithAccess(svc.db, board, itemId ?? null, ids);
      if (ids.some((i) => !allowed.has(i))) errors.push({ column: 'person', message: 'Give this person access to the project or the task before assigning it to them' });
    }
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
  const nowSet = new Set(assigneesOf(after, columns));
  const added = Array.from(nowSet).filter((u) => !prev.has(u));
  if (!added.length) return;
  const removed = Array.from(prev).filter((u) => !nowSet.has(u));
  const by = svc.actor?.name ?? svc.automationName ?? 'Automation';
  const details = await taskEmailDetails(svc, board, item, after, columns);
  const previous = removed.length
    ? (await svc.db.prepare(`SELECT name FROM users WHERE id IN (${placeholders(removed.length)})`).bind(...removed).all<{ name: string }>()).results.map((r) => r.name).join(', ')
    : null;
  // One notification per person: the email lists what that person may do on the task.
  for (const uid of added) {
    const t = await loadTask(svc.db, item.id, uid);
    const actions = t ? taskActions(t.caps) : [];
    await notify(svc, {
      workspaceId: board.workspace_id,
      userIds: [uid],
      type: 'assignment',
      title: `You were assigned to "${item.name}"`,
      body: `${by} assigned you on ${board.name}`,
      link: itemLink(board.workspace_id, board.id, item.id),
      entityType: 'item',
      entityId: item.id,
      email: removed.length
        ? { template: 'task_reassignment', previous, ...details, assignedBy: by, actions }
        : { template: 'task_assignment', ...details, assignedBy: by, actions },
    });
  }
}

/** The task details shown in emails (organisation, project, priority, due date, status, a link). */
export async function taskEmailDetails(svc: Svc, board: BoardRow, item: ItemRow, values: Record<string, unknown>, columns: ColumnDTO[]) {
  const ws = await svc.db.prepare('SELECT name FROM workspaces WHERE id = ?').bind(board.workspace_id).first<{ name: string }>();
  const settings = parseJson<{ dateColumnId?: string }>(board.settings_json, {});
  const priorityCol = columns.find((c) => c.type === 'priority');
  const statusCol = columns.find((c) => c.type === 'status');
  const dateCol = columns.find((c) => c.id === settings.dateColumnId) ?? columns.find((c) => c.type === 'date');
  const timelineCol = columns.find((c) => c.type === 'timeline');
  const label = (col: ColumnDTO | undefined) => (col ? labelsOf(col).find((l) => l.id === values[col.id])?.label ?? null : null);
  let due: string | null = dateCol && typeof values[dateCol.id] === 'string' ? (values[dateCol.id] as string) : null;
  if (!due && timelineCol) {
    const tl = values[timelineCol.id] as { end?: string } | undefined;
    due = tl?.end ?? null;
  }
  return {
    organisation: ws?.name ?? '',
    project: board.name,
    board: board.name,
    task: item.name,
    description: item.description ? item.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : null,
    priority: label(priorityCol),
    status: label(statusCol),
    dueDate: due,
    url: taskLink(board.workspace_id, item.id),
  };
}

export function taskActions(caps: TaskCaps): string[] {
  const out: string[] = ['view the task'];
  if (caps.edit) out.push('edit it');
  if (caps.updateStatus || caps.edit) out.push('update its status');
  if (caps.comment) out.push('add comments');
  if (caps.upload) out.push('upload attachments');
  if (caps.manageAssignments) out.push('change assignments');
  return out;
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
  // A permanent key (PREFIX-0001) from the project's counter (services/schedule/task-keys.ts).
  const key = await allocateTaskKey(svc.db, board);
  item.task_number = key.number;
  item.task_key = key.key;
  await svc.db.batch([
    svc.db
      .prepare(
        `INSERT INTO items (id, workspace_id, board_id, group_id, parent_item_id, name, description, position, values_json, search_text, created_by, created_at, updated_at, completed_at, task_number, task_key)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(item.id, item.workspace_id, item.board_id, item.group_id, item.parent_item_id, item.name, item.description, item.position, item.values_json, item.search_text, item.created_by, t, t, item.completed_at, key.number, key.key),
    activityStmt(svc.db, {
      workspaceId: board.workspace_id,
      boardId: board.id,
      itemId: parent?.id ?? id,
      actorId: actorId(svc),
      action: activityAction(svc, parent ? 'subitem_created' : 'item_created'),
      newValue: { id, name },
    }),
    svc.db.prepare('UPDATE boards SET updated_at = ? WHERE id = ?').bind(t, board.id),
    eventStmt(svc.db, { type: 'task.created', userId: actorId(svc), workspaceId: board.workspace_id, boardId: board.id, entityType: 'item', entityId: id, metadata: { subitem: !!parent, automation: !!svc.automationName }, at: t }),
    auditEventStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: id, actorId: actorId(svc), type: 'task.created', after: { name, groupId, parentItemId: parent?.id ?? null }, metadata: auditMeta(svc), at: t }),
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
  const changes = patch.values ? await validateValues(svc, board, cols, patch.values, item.id, before) : {};
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
  stmts.push(...taskAuditStmts(svc, board, item, cols, before, after, changedCols, { name, description, wasDone, nowDone, at: t }));
  const searchText = buildSearchText(name, description, after, cols);
  if (svc.actor) stmts.push(eventStmt(svc.db, { type: 'task.updated', userId: svc.actor.id, workspaceId: board.workspace_id, boardId: board.id, entityType: 'item', entityId: item.id, metadata: { fields: changedCols.length + (name !== item.name ? 1 : 0) + (description !== item.description ? 1 : 0) }, at: t }));
  if (!wasDone && nowDone) stmts.push(eventStmt(svc.db, { type: 'task.completed', userId: actorId(svc), workspaceId: board.workspace_id, boardId: board.id, entityType: 'item', entityId: item.id, metadata: { automation: !!svc.automationName }, at: t }));
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
      const from = labelsOf(col).find((l) => l.id === before[colId])?.label ?? null;
      const recipients = assigneesOf(after, cols);
      await notify(svc, {
        workspaceId: board.workspace_id,
        userIds: recipients,
        type: 'status_change',
        title: `"${updated.name}" is now ${label}`,
        body: `${col.title} changed on ${board.name}`,
        link: itemLink(board.workspace_id, board.id, item.id),
        entityType: 'item',
        entityId: item.id,
        email: recipients.length ? { template: 'status_update', from, ...(await taskEmailDetails(svc, board, updated, after, cols)), assignedBy: null } : undefined,
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
    stmts.push(auditEventStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), type: 'task.moved', before: { groupId: item.group_id }, after: { groupId }, metadata: auditMeta(svc), at: t }));
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
    auditEventStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), type: archived ? 'task.archived' : 'task.restored', metadata: auditMeta(svc), at: t }),
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
    auditEventStmt(svc.db, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), type: 'task.deleted', before: { name: item.name, groupId: item.group_id }, metadata: auditMeta(svc) }),
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

function auditMeta(svc: Svc): Record<string, unknown> {
  return svc.automationName ? { automation: svc.automationName } : {};
}

function ids(v: unknown): string[] {
  return v == null ? [] : Array.isArray(v) ? (v as string[]) : [String(v)];
}

/** Typed audit events for a task change: status, completion, priority, dates, owners, finance and other fields. */
function taskAuditStmts(
  svc: Svc,
  board: BoardRow,
  item: ItemRow,
  cols: ColumnDTO[],
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  changedCols: string[],
  x: { name: string; description: string; wasDone: boolean; nowDone: boolean; at: number },
): D1PreparedStatement[] {
  const base = { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: actorId(svc), metadata: auditMeta(svc), at: x.at };
  const out: D1PreparedStatement[] = [];
  const other: string[] = [];
  for (const colId of changedCols) {
    const col = cols.find((c) => c.id === colId);
    if (!col) continue;
    const b = before[colId] ?? null;
    const a = after[colId] ?? null;
    if (col.type === 'status') {
      const label = (v: unknown) => labelsOf(col).find((l) => l.id === v)?.label ?? null;
      out.push(auditEventStmt(svc.db, { ...base, type: 'task.status_changed', before: { id: b, label: label(b) }, after: { id: a, label: label(a) }, metadata: { ...base.metadata, columnId: colId } }));
    } else if (col.type === 'priority') {
      const label = (v: unknown) => labelsOf(col).find((l) => l.id === v)?.label ?? null;
      out.push(auditEventStmt(svc.db, { ...base, type: 'task.priority_changed', before: { id: b, label: label(b) }, after: { id: a, label: label(a) }, metadata: { ...base.metadata, columnId: colId } }));
    } else if (col.type === 'date' || col.type === 'timeline') {
      out.push(auditEventStmt(svc.db, { ...base, type: 'task.due_date_changed', before: b, after: a, metadata: { ...base.metadata, columnId: colId, columnTitle: col.title } }));
    } else if (col.type === 'person' || col.type === 'people') {
      const was = new Set(ids(b));
      const now_ = new Set(ids(a));
      const added = [...now_].filter((u) => !was.has(u));
      const removed = [...was].filter((u) => !now_.has(u));
      if (added.length) out.push(auditEventStmt(svc.db, { ...base, type: 'task.owner_assigned', before: [...was], after: [...now_], metadata: { ...base.metadata, columnId: colId, userIds: added, reassigned: removed.length > 0 } }));
      if (removed.length) out.push(auditEventStmt(svc.db, { ...base, type: 'task.owner_removed', before: [...was], after: [...now_], metadata: { ...base.metadata, columnId: colId, userIds: removed } }));
    } else if (isFinancialColumn(col)) {
      out.push(auditEventStmt(svc.db, { ...base, type: 'task.finance_changed', before: b, after: a, metadata: { ...base.metadata, columnId: colId, columnTitle: col.title, financeRole: col.settings?.financeRole ?? null } }));
    } else other.push(colId);
  }
  if (!x.wasDone && x.nowDone) out.push(auditEventStmt(svc.db, { ...base, type: 'task.completed' }));
  if (x.wasDone && !x.nowDone) out.push(auditEventStmt(svc.db, { ...base, type: 'task.reopened' }));
  const fields = [...other.map((c) => cols.find((x2) => x2.id === c)?.title ?? c)];
  if (x.name !== item.name) fields.push('name');
  if (x.description !== item.description) fields.push('description');
  if (fields.length) {
    out.push(
      auditEventStmt(svc.db, {
        ...base,
        type: 'task.modified',
        before: x.name !== item.name ? { name: item.name } : undefined,
        after: x.name !== item.name ? { name: x.name } : undefined,
        metadata: { ...base.metadata, fields },
      }),
    );
  }
  return out;
}
