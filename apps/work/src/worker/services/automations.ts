// Automation engine: Trigger -> Conditions -> Actions, with execution logs
// (automation_runs), duplicate prevention (unique event_key), retries with
// backoff and loop prevention (depth limit + per-chain fingerprinting).

import { z } from 'zod';
import { labelsOf } from '../../shared/columns';
import { addDays, startOfWeek, todayIn } from '../../shared/dates';
import { matchFilter, sanitizeFilter, type FilterGroup } from '../../shared/filters';
import { assigneesOf } from '../../shared/items';
import type { ColumnDTO } from '../../shared/types';
import { newId, now, parseJson } from '../lib/util';
import type { Svc } from './context';
import { loadColumns } from './mappers';
import { itemLink, notify } from './notify';
import type { BoardRow, ItemRow } from './permissions';

export const MAX_AUTOMATION_DEPTH = 3;
const MAX_ATTEMPTS = 3;

// ---------------------------------------------------------------- definitions

export const triggerSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('item_created'), includeSubitems: z.boolean().optional() }),
  z.object({ type: z.literal('status_changed'), columnId: z.string(), to: z.string().optional(), from: z.string().optional() }),
  z.object({ type: z.literal('column_changed'), columnId: z.string() }),
  z.object({ type: z.literal('item_moved_to_group'), groupId: z.string().optional() }),
  z.object({ type: z.literal('update_posted') }),
  z.object({ type: z.literal('date_arrived'), columnId: z.string(), offsetDays: z.number().int().min(-60).max(60).default(0) }),
  z.object({
    type: z.literal('recurring'),
    interval: z.enum(['daily', 'weekly', 'monthly']),
    weekday: z.number().int().min(0).max(6).optional(), // 0 = Monday
    dayOfMonth: z.number().int().min(1).max(28).optional(),
    hourUtc: z.number().int().min(0).max(23).default(8),
  }),
]);
export type Trigger = z.infer<typeof triggerSchema>;

export const actionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('set_value'), columnId: z.string(), value: z.unknown() }),
  z.object({ type: z.literal('set_date_today'), columnId: z.string() }),
  z.object({ type: z.literal('clear_value'), columnId: z.string() }),
  z.object({
    type: z.literal('notify'),
    target: z.enum(['assignees', 'creator', 'user']),
    userId: z.string().optional(),
    message: z.string().min(1).max(500),
  }),
  z.object({ type: z.literal('assign'), columnId: z.string(), userId: z.string() }),
  z.object({ type: z.literal('move_to_group'), groupId: z.string() }),
  z.object({ type: z.literal('create_item'), groupId: z.string().optional(), name: z.string().min(1).max(300), values: z.record(z.string(), z.unknown()).optional() }),
  z.object({ type: z.literal('create_subitem'), name: z.string().min(1).max(300) }),
  z.object({ type: z.literal('archive_item') }),
  z.object({ type: z.literal('duplicate_item'), groupId: z.string().optional() }),
  z.object({ type: z.literal('send_webhook'), integrationId: z.string() }),
]);
export type Action = z.infer<typeof actionSchema>;

export const automationSchema = z.object({
  name: z.string().min(1).max(200),
  enabled: z.boolean().optional(),
  trigger: triggerSchema,
  conditions: z.unknown().optional(),
  actions: z.array(actionSchema).min(1).max(10),
});

export interface AutomationRow {
  id: string;
  workspace_id: string;
  board_id: string;
  name: string;
  enabled: number;
  trigger_json: string;
  conditions_json: string;
  actions_json: string;
  state_json: string;
  created_by: string;
  created_at: number;
  updated_at: number;
  last_run_at: number | null;
  run_count: number;
}

// --------------------------------------------------------------------- events

export type BoardEvent =
  | { type: 'item_created'; item: ItemRow; isSubitem: boolean }
  | { type: 'column_changed'; item: ItemRow; columnId: string; oldValue: unknown; newValue: unknown }
  | { type: 'item_moved'; item: ItemRow; fromGroupId: string; toGroupId: string }
  | { type: 'update_posted'; item: ItemRow; updateId: string }
  | { type: 'date_arrived'; item: ItemRow; columnId: string; date: string }
  | { type: 'recurring'; periodKey: string };

function triggerMatches(t: Trigger, e: BoardEvent, cols: ColumnDTO[]): boolean {
  switch (t.type) {
    case 'item_created':
      return e.type === 'item_created' && (!e.isSubitem || !!t.includeSubitems);
    case 'status_changed': {
      if (e.type !== 'column_changed' || e.columnId !== t.columnId) return false;
      const col = cols.find((c) => c.id === t.columnId);
      if (!col || col.type !== 'status') return false;
      if (t.to && e.newValue !== t.to) return false;
      if (t.from && e.oldValue !== t.from) return false;
      return true;
    }
    case 'column_changed':
      return e.type === 'column_changed' && e.columnId === t.columnId;
    case 'item_moved_to_group':
      return e.type === 'item_moved' && (!t.groupId || e.toGroupId === t.groupId);
    case 'update_posted':
      return e.type === 'update_posted';
    case 'date_arrived':
      return e.type === 'date_arrived' && e.columnId === t.columnId;
    case 'recurring':
      return e.type === 'recurring';
  }
}

function eventKey(a: AutomationRow, e: BoardEvent, eventId: string): string {
  if (e.type === 'date_arrived') return `${a.id}:date:${e.item.id}:${e.columnId}:${e.date}`;
  if (e.type === 'recurring') return `${a.id}:recurring:${e.periodKey}`;
  return `${a.id}:${e.type}:${eventId}`;
}

function serializeEvent(e: BoardEvent) {
  const { ...rest } = e as Record<string, unknown>;
  if ('item' in e) return JSON.stringify({ ...rest, item: undefined, itemId: e.item.id });
  return JSON.stringify(rest);
}

// --------------------------------------------------------------------- engine

/** Called by item operations after every change. Never throws. */
const HOOK_EVENTS: Partial<Record<BoardEvent['type'], string>> = {
  item_created: 'item.created',
  column_changed: 'item.updated',
  item_moved: 'item.moved',
  update_posted: 'update.posted',
};

export async function dispatchEvent(svc: Svc, board: BoardRow, e: BoardEvent): Promise<void> {
  const hook = HOOK_EVENTS[e.type];
  if (hook && 'item' in e) {
    const payload = {
      board: { id: board.id, name: board.name },
      item: { id: e.item.id, name: e.item.name, groupId: e.item.group_id, values: parseJson(e.item.values_json, {}) },
      ...(e.type === 'column_changed' ? { change: { columnId: e.columnId, oldValue: e.oldValue, newValue: e.newValue } } : {}),
    };
    svc.waitUntil(
      import('./integrations')
        .then((m) => m.fanOut(svc, board.workspace_id, board.id, hook, payload))
        .catch((err) => console.warn('integration fan-out failed', err)),
    );
  }
  if (svc.automationDepth >= MAX_AUTOMATION_DEPTH) return;
  try {
    const rows = await svc.db
      .prepare('SELECT * FROM automations WHERE board_id = ? AND workspace_id = ? AND enabled = 1')
      .bind(board.id, board.workspace_id)
      .all<AutomationRow>();
    if (!rows.results.length) return;
    const cols = await loadColumns(svc.db, board.id);
    const eventId = newId();
    for (const a of rows.results) {
      const trigger = parseJson<Trigger | null>(a.trigger_json, null);
      if (!trigger || !triggerMatches(trigger, e, cols)) continue;
      await runAutomation(svc, board, a, e, eventKey(a, e, eventId), cols);
    }
  } catch (err) {
    console.error('automation dispatch failed', err);
  }
}

export interface RunResult {
  status: 'succeeded' | 'failed' | 'skipped' | 'duplicate';
  error?: string;
}

export async function runAutomation(
  svc: Svc,
  board: BoardRow,
  a: AutomationRow,
  e: BoardEvent,
  key: string,
  cols: ColumnDTO[],
  attempt = 1,
  existingRunId?: string,
): Promise<RunResult> {
  const item = 'item' in e ? e.item : null;
  const fingerprint = `${a.id}:${item?.id ?? 'board'}`;
  if (svc.chain.includes(fingerprint)) return { status: 'skipped', error: 'Loop prevented' };

  // Conditions are evaluated against the item's current state.
  const conditions = sanitizeFilter(parseJson<FilterGroup>(a.conditions_json, { op: 'and', rules: [] }));
  if (item && conditions.rules.length) {
    const fresh = await svc.db.prepare('SELECT * FROM items WHERE id = ?').bind(item.id).first<ItemRow>();
    if (!fresh) return { status: 'skipped' };
    const ok = matchFilter(
      { id: fresh.id, name: fresh.name, boardId: fresh.board_id, groupId: fresh.group_id, createdAt: fresh.created_at, updatedAt: fresh.updated_at, values: parseJson(fresh.values_json, {}) },
      conditions,
      { columns: new Map(cols.map((c) => [c.id, c])), today: todayIn('UTC') },
    );
    if (!ok) return { status: 'skipped' };
  }

  const t = now();
  let runId = existingRunId;
  if (!runId) {
    runId = newId();
    const ins = await svc.db
      .prepare(
        `INSERT OR IGNORE INTO automation_runs (id, workspace_id, automation_id, board_id, item_id, event_key, event_json, status, attempts, depth, started_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'running', ?, ?, ?)`,
      )
      .bind(runId, a.workspace_id, a.id, board.id, item?.id ?? null, key, serializeEvent(e), attempt, svc.automationDepth, t)
      .run();
    if (!ins.meta.changes) return { status: 'duplicate' };
  } else {
    await svc.db.prepare("UPDATE automation_runs SET status = 'running', attempts = ?, started_at = ? WHERE id = ?").bind(attempt, t, runId).run();
  }

  const child: Svc = {
    ...svc,
    actor: null,
    automationName: a.name,
    automationDepth: svc.automationDepth + 1,
    chain: [...svc.chain, fingerprint],
  };
  const actions = parseJson<Action[]>(a.actions_json, []);
  const results: unknown[] = [];
  try {
    let current = item;
    for (const action of actions) {
      const r = await executeAction(child, board, a, action, current, cols);
      if (r && typeof r === 'object' && 'item' in (r as any)) current = (r as any).item ?? current;
      results.push(r?.summary ?? null);
    }
    await svc.db.batch([
      svc.db.prepare("UPDATE automation_runs SET status = 'succeeded', finished_at = ?, result_json = ?, error = NULL, next_retry_at = NULL WHERE id = ?").bind(now(), JSON.stringify(results), runId),
      svc.db.prepare('UPDATE automations SET last_run_at = ?, run_count = run_count + 1 WHERE id = ?').bind(now(), a.id),
    ]);
    return { status: 'succeeded' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const retryAt = attempt < MAX_ATTEMPTS ? now() + Math.pow(2, attempt) * 60_000 : null;
    await svc.db
      .prepare("UPDATE automation_runs SET status = 'failed', finished_at = ?, error = ?, next_retry_at = ?, result_json = ? WHERE id = ?")
      .bind(now(), msg.slice(0, 1000), retryAt, JSON.stringify(results), runId)
      .run();
    await notify(svc, {
      workspaceId: a.workspace_id,
      userIds: [a.created_by],
      type: 'automation',
      title: `Automation "${a.name}" failed`,
      body: msg.slice(0, 300),
      link: `/w/${a.workspace_id}/boards/${board.id}?automations=1`,
      entityType: 'automation',
      entityId: a.id,
      dedupeKey: `autofail:${runId}:${attempt}`,
      includeActor: true,
    });
    return { status: 'failed', error: msg };
  }
}

async function executeAction(
  svc: Svc,
  board: BoardRow,
  a: AutomationRow,
  action: Action,
  item: ItemRow | null,
  cols: ColumnDTO[],
): Promise<{ summary: string; item?: ItemRow | null } | null> {
  // Lazy import avoids an import cycle at module-evaluation time.
  const ops = await import('./item-ops');
  const needItem = () => {
    if (!item) throw new Error(`Action ${action.type} needs an item`);
    return item;
  };
  const reload = async (id: string) => svc.db.prepare('SELECT * FROM items WHERE id = ?').bind(id).first<ItemRow>();
  switch (action.type) {
    case 'set_value': {
      const it = needItem();
      const updated = await ops.updateItem(svc, board, (await reload(it.id)) ?? it, { values: { [action.columnId]: action.value } }, cols);
      return { summary: `Set ${action.columnId}`, item: updated };
    }
    case 'clear_value': {
      const it = needItem();
      const updated = await ops.updateItem(svc, board, (await reload(it.id)) ?? it, { values: { [action.columnId]: null } }, cols);
      return { summary: `Cleared ${action.columnId}`, item: updated };
    }
    case 'set_date_today': {
      const it = needItem();
      const col = cols.find((c) => c.id === action.columnId);
      if (!col || col.type !== 'date') throw new Error('Target column must be a date column');
      const updated = await ops.updateItem(svc, board, (await reload(it.id)) ?? it, { values: { [col.id]: todayIn('UTC') } }, cols);
      return { summary: `Set ${col.title} to today`, item: updated };
    }
    case 'assign': {
      const it = (await reload(needItem().id)) ?? needItem();
      const col = cols.find((c) => c.id === action.columnId);
      if (!col || (col.type !== 'person' && col.type !== 'people')) throw new Error('Target column must be a person column');
      const current = parseJson<Record<string, unknown>>(it.values_json, {})[col.id];
      const value = col.type === 'person' ? action.userId : Array.from(new Set([...(Array.isArray(current) ? (current as string[]) : []), action.userId]));
      const updated = await ops.updateItem(svc, board, it, { values: { [col.id]: value } }, cols);
      return { summary: `Assigned user`, item: updated };
    }
    case 'move_to_group': {
      const it = (await reload(needItem().id)) ?? needItem();
      if (it.group_id === action.groupId) return { summary: 'Already in group', item: it };
      const moved = await ops.moveItem(svc, board, it, { groupId: action.groupId });
      return { summary: 'Moved item', item: moved };
    }
    case 'archive_item': {
      const it = needItem();
      await ops.setItemArchived(svc, board, it, true);
      return { summary: 'Archived item', item: null };
    }
    case 'duplicate_item': {
      const it = (await reload(needItem().id)) ?? needItem();
      const copy = await ops.duplicateItem(svc, board, it, { groupId: action.groupId });
      return { summary: `Duplicated to ${copy.id}` };
    }
    case 'create_item': {
      const today = todayIn('UTC');
      const name = action.name.replace(/\{date\}/g, today).replace(/\{item\}/g, item?.name ?? '');
      const created = await ops.createItem(svc, board, { groupId: action.groupId, name, values: action.values }, cols);
      return { summary: `Created item ${created.id}` };
    }
    case 'create_subitem': {
      const it = needItem();
      if (it.parent_item_id) throw new Error('Cannot create a subitem of a subitem');
      const created = await ops.createItem(svc, board, { parentItemId: it.id, name: action.name.replace(/\{item\}/g, it.name) }, cols);
      return { summary: `Created subitem ${created.id}` };
    }
    case 'notify': {
      const it = item ? ((await reload(item.id)) ?? item) : null;
      let users: string[] = [];
      if (action.target === 'assignees' && it) users = assigneesOf(parseJson(it.values_json, {}), cols);
      if (action.target === 'creator') users = [it?.created_by ?? a.created_by];
      if (action.target === 'user' && action.userId) users = [action.userId];
      const message = action.message.replace(/\{item\}/g, it?.name ?? '').replace(/\{board\}/g, board.name);
      const n = await notify(svc, {
        workspaceId: board.workspace_id,
        userIds: users,
        type: 'automation',
        title: message,
        body: `Automation: ${a.name}`,
        link: it ? itemLink(board.workspace_id, board.id, it.id) : `/w/${board.workspace_id}/boards/${board.id}`,
        entityType: it ? 'item' : 'board',
        entityId: it?.id ?? board.id,
        includeActor: true,
      });
      return { summary: `Notified ${n} user(s)` };
    }
    case 'send_webhook': {
      const { deliverToIntegration } = await import('./integrations');
      const it = item ? ((await reload(item.id)) ?? item) : null;
      await deliverToIntegration(svc, board.workspace_id, action.integrationId, 'automation.triggered', {
        automation: { id: a.id, name: a.name },
        board: { id: board.id, name: board.name },
        item: it ? { id: it.id, name: it.name, values: parseJson(it.values_json, {}) } : null,
      }, { throwOnError: true });
      return { summary: 'Webhook delivered' };
    }
  }
}

/** Validate that an automation's references stay inside its board/workspace. */
export async function validateAutomationRefs(db: D1Database, board: BoardRow, def: z.infer<typeof automationSchema>, cols: ColumnDTO[]): Promise<string | null> {
  const colIds = new Set(cols.map((c) => c.id));
  const t = def.trigger;
  if ('columnId' in t && t.columnId && !colIds.has(t.columnId)) return 'Trigger column does not exist on this board';
  if (t.type === 'status_changed') {
    const col = cols.find((c) => c.id === t.columnId);
    if (col?.type !== 'status') return 'Status trigger requires a status column';
    const labels = labelsOf(col).map((l) => l.id);
    if (t.to && !labels.includes(t.to)) return 'Unknown status label';
  }
  if (t.type === 'date_arrived' && !['date', 'timeline'].includes(cols.find((c) => c.id === t.columnId)?.type ?? '')) return 'Date trigger requires a date column';
  const groups = await db.prepare('SELECT id FROM groups WHERE board_id = ?').bind(board.id).all<{ id: string }>();
  const groupIds = new Set(groups.results.map((g) => g.id));
  if (t.type === 'item_moved_to_group' && t.groupId && !groupIds.has(t.groupId)) return 'Unknown group';
  for (const a of def.actions) {
    if ('columnId' in a && !colIds.has(a.columnId)) return `Action column does not exist on this board`;
    if ('groupId' in a && a.groupId && !groupIds.has(a.groupId)) return 'Action group does not exist on this board';
    if ('userId' in a && a.userId) {
      const m = await db.prepare('SELECT 1 FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(board.workspace_id, a.userId).first();
      if (!m) return 'Action user must be a workspace member';
    }
    if (a.type === 'send_webhook') {
      const i = await db.prepare('SELECT 1 FROM integrations WHERE id = ? AND workspace_id = ?').bind(a.integrationId, board.workspace_id).first();
      if (!i) return 'Unknown integration';
    }
    if (t.type === 'recurring' && ['set_value', 'set_date_today', 'clear_value', 'assign', 'move_to_group', 'archive_item', 'duplicate_item', 'create_subitem'].includes(a.type)) {
      return 'Recurring automations can only create items, notify or send webhooks';
    }
  }
  return null;
}

// ----------------------------------------------------------------- scheduler

export function recurringPeriodKey(t: Extract<Trigger, { type: 'recurring' }>, at: number): string | null {
  const d = new Date(at);
  if (d.getUTCHours() < t.hourUtc) return null;
  const today = d.toISOString().slice(0, 10);
  if (t.interval === 'daily') return today;
  if (t.interval === 'weekly') {
    const dow = (d.getUTCDay() + 6) % 7;
    if (dow !== (t.weekday ?? 0)) return null;
    return `w${startOfWeek(today)}`;
  }
  if (d.getUTCDate() !== (t.dayOfMonth ?? 1)) return null;
  return `m${today.slice(0, 7)}`;
}

/** Time-based triggers. Runs from the cron handler; idempotent thanks to event keys. */
export async function runScheduledAutomations(svc: Svc, at: number = now()): Promise<{ fired: number }> {
  let fired = 0;
  const rows = await svc.db
    .prepare(
      `SELECT a.* FROM automations a JOIN boards b ON b.id = a.board_id
       WHERE a.enabled = 1 AND b.archived_at IS NULL AND (a.trigger_json LIKE '%"date_arrived"%' OR a.trigger_json LIKE '%"recurring"%')`,
    )
    .all<AutomationRow>();
  const today = new Date(at).toISOString().slice(0, 10);
  for (const a of rows.results) {
    const trigger = parseJson<Trigger | null>(a.trigger_json, null);
    if (!trigger) continue;
    const board = await svc.db.prepare('SELECT * FROM boards WHERE id = ?').bind(a.board_id).first<BoardRow>();
    if (!board) continue;
    const cols = await loadColumns(svc.db, board.id);
    if (trigger.type === 'recurring') {
      const period = recurringPeriodKey(trigger, at);
      if (!period) continue;
      const r = await runAutomation(svc, board, a, { type: 'recurring', periodKey: period }, `${a.id}:recurring:${period}`, cols);
      if (r.status === 'succeeded' || r.status === 'failed') fired++;
    } else if (trigger.type === 'date_arrived') {
      // Item date == today - offset  (offset -1 => one day before the date).
      const target = addDays(today, -(trigger.offsetDays ?? 0));
      const col = cols.find((c) => c.id === trigger.columnId);
      if (!col) continue;
      const path = `$."${col.id}"`;
      const sql =
        col.type === 'timeline'
          ? `SELECT * FROM items WHERE board_id = ? AND archived_at IS NULL AND json_extract(values_json, ? || '.end') = ?`
          : `SELECT * FROM items WHERE board_id = ? AND archived_at IS NULL AND substr(json_extract(values_json, ?), 1, 10) = ?`;
      const items = await svc.db.prepare(sql).bind(board.id, path, target).all<ItemRow>();
      for (const item of items.results) {
        const e: BoardEvent = { type: 'date_arrived', item, columnId: col.id, date: target };
        const r = await runAutomation(svc, board, a, e, eventKey(a, e, ''), cols);
        if (r.status === 'succeeded' || r.status === 'failed') fired++;
      }
    }
  }
  return { fired };
}

/** Retry failed runs whose backoff elapsed. */
export async function retryFailedRuns(svc: Svc, at: number = now()): Promise<number> {
  const runs = await svc.db
    .prepare("SELECT * FROM automation_runs WHERE status = 'failed' AND next_retry_at IS NOT NULL AND next_retry_at <= ? LIMIT 25")
    .bind(at)
    .all<{ id: string; automation_id: string; board_id: string; item_id: string | null; event_key: string; event_json: string; attempts: number }>();
  let n = 0;
  for (const run of runs.results) {
    const a = await svc.db.prepare('SELECT * FROM automations WHERE id = ? AND enabled = 1').bind(run.automation_id).first<AutomationRow>();
    const board = await svc.db.prepare('SELECT * FROM boards WHERE id = ?').bind(run.board_id).first<BoardRow>();
    if (!a || !board) {
      await svc.db.prepare('UPDATE automation_runs SET next_retry_at = NULL WHERE id = ?').bind(run.id).run();
      continue;
    }
    const ev = parseJson<Record<string, any>>(run.event_json, {});
    let e: BoardEvent;
    if (run.item_id) {
      const item = await svc.db.prepare('SELECT * FROM items WHERE id = ?').bind(run.item_id).first<ItemRow>();
      if (!item) {
        await svc.db.prepare("UPDATE automation_runs SET next_retry_at = NULL, error = 'Item no longer exists' WHERE id = ?").bind(run.id).run();
        continue;
      }
      e = { ...(ev as any), item } as BoardEvent;
    } else e = ev as BoardEvent;
    const cols = await loadColumns(svc.db, board.id);
    await runAutomation({ ...svc, chain: [] }, board, a, e, run.event_key, cols, run.attempts + 1, run.id);
    n++;
  }
  return n;
}

/** Notifications for due-soon and overdue items (deduplicated per item/day). */
export async function notifyDueDates(svc: Svc, at: number = now()): Promise<number> {
  const today = new Date(at).toISOString().slice(0, 10);
  const tomorrow = addDays(today, 1);
  const cols = await svc.db
    .prepare("SELECT c.id, c.board_id, c.type FROM columns c JOIN boards b ON b.id = c.board_id WHERE c.type = 'date' AND b.archived_at IS NULL AND b.kind != 'template'")
    .all<{ id: string; board_id: string; type: string }>();
  let sent = 0;
  for (const c of cols.results) {
    const path = `$."${c.id}"`;
    const items = await svc.db
      .prepare(
        `SELECT i.*, b.name AS board_name FROM items i JOIN boards b ON b.id = i.board_id
         WHERE i.board_id = ? AND i.archived_at IS NULL AND i.completed_at IS NULL
           AND substr(json_extract(i.values_json, ?), 1, 10) IN (?, ?, ?)`,
      )
      .bind(c.board_id, path, tomorrow, today, addDays(today, -1))
      .all<ItemRow & { board_name: string }>();
    if (!items.results.length) continue;
    const boardCols = await loadColumns(svc.db, c.board_id);
    const boardRow = await svc.db.prepare('SELECT * FROM boards WHERE id = ?').bind(c.board_id).first<BoardRow>();
    const { taskEmailDetails } = await import('./item-ops');
    for (const it of items.results) {
      const values = parseJson<Record<string, unknown>>(it.values_json, {});
      const due = String(values[c.id]).slice(0, 10);
      const users = assigneesOf(values, boardCols);
      if (!users.length) continue;
      const overdue = due < today;
      const details = boardRow ? { ...(await taskEmailDetails(svc, boardRow, it, values, boardCols)), dueDate: due } : null;
      sent += await notify(svc, {
        workspaceId: it.workspace_id,
        userIds: users,
        type: overdue ? 'overdue' : 'due_soon',
        title: overdue ? `"${it.name}" is overdue` : due === today ? `"${it.name}" is due today` : `"${it.name}" is due tomorrow`,
        body: `${it.board_name} · due ${due}`,
        link: itemLink(it.workspace_id, it.board_id, it.id),
        entityType: 'item',
        entityId: it.id,
        dedupeKey: `${overdue ? 'overdue' : 'due'}:${it.id}:${c.id}:${due}:${overdue ? 'o' : due === today ? 't' : 'n'}`,
        includeActor: true,
        email: details ? { template: overdue ? 'overdue' : 'due_reminder', ...details } : undefined,
      });
    }
  }
  return sent;
}
