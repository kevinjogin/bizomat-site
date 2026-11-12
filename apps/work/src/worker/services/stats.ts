// Aggregations over REAL board data for dashboards, goals and charts.

import { isFinancialColumn } from '../../shared/permissions';
import { getColumnType, labelsOf } from '../../shared/columns';
import { addDays, todayIn } from '../../shared/dates';
import { isItemDone, matchFilter, sanitizeFilter, type FilterGroup } from '../../shared/filters';
import { assigneesOf, computeValues, dueDateOf } from '../../shared/items';
import type { ColumnDTO, ItemDTO, MemberDTO } from '../../shared/types';
import { placeholders } from '../lib/util';
import { columnDTO, groupDTO, itemDTO, type ColumnRow, type GroupRow } from './mappers';
import type { ItemRow } from './permissions';

export interface BoardData {
  boards: Map<string, { id: string; name: string }>;
  columns: Map<string, ColumnDTO[]>;
  groups: Map<string, { id: string; name: string; color: string }>;
  items: ItemDTO[]; // top-level + subitems, not archived
}

/** Board data as the caller may see it: financial columns removed on boards where they lack finance access. */
export async function loadBoardDataFor(db: D1Database, workspaceId: string, userId: string, boardIds: string[]): Promise<BoardData> {
  const { financeHiddenBoards } = await import('./access');
  return loadBoardData(db, boardIds, await financeHiddenBoards(db, workspaceId, userId, boardIds));
}

export async function loadBoardData(db: D1Database, boardIds: string[], hideFinanceOn: Set<string> = new Set()): Promise<BoardData> {
  const data: BoardData = { boards: new Map(), columns: new Map(), groups: new Map(), items: [] };
  if (!boardIds.length) return data;
  const ph = placeholders(boardIds.length);
  const [boards, cols, groups, items] = await Promise.all([
    db.prepare(`SELECT id, name FROM boards WHERE id IN (${ph})`).bind(...boardIds).all<{ id: string; name: string }>(),
    db.prepare(`SELECT * FROM columns WHERE board_id IN (${ph}) ORDER BY position`).bind(...boardIds).all<ColumnRow>(),
    db.prepare(`SELECT * FROM groups WHERE board_id IN (${ph}) AND archived_at IS NULL`).bind(...boardIds).all<GroupRow>(),
    db.prepare(`SELECT * FROM items WHERE board_id IN (${ph}) AND archived_at IS NULL`).bind(...boardIds).all<ItemRow>(),
  ]);
  boards.results.forEach((b) => data.boards.set(b.id, b));
  const hiddenCols = new Set<string>();
  for (const c of cols.results.map(columnDTO)) {
    if (hideFinanceOn.has(c.boardId) && isFinancialColumn(c)) {
      hiddenCols.add(c.id);
      continue;
    }
    data.columns.set(c.boardId, [...(data.columns.get(c.boardId) ?? []), c]);
  }
  groups.results.map(groupDTO).forEach((g) => data.groups.set(g.id, g));
  const all = items.results.map(itemDTO).map((i) => {
    if (!hiddenCols.size || !hideFinanceOn.has(i.boardId)) return i;
    const values: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(i.values)) if (!hiddenCols.has(k)) values[k] = v;
    return { ...i, values };
  });
  const subs = new Map<string, ItemDTO[]>();
  for (const i of all) if (i.parentItemId) subs.set(i.parentItemId, [...(subs.get(i.parentItemId) ?? []), i]);
  data.items = all.map((i) => ({ ...i, values: computeValues(i, data.columns.get(i.boardId) ?? [], { subitemsOf: (id) => subs.get(id) ?? [] }) }));
  return data;
}

export interface WidgetConfig {
  boardIds?: string[];
  filter?: FilterGroup;
  includeSubitems?: boolean;
  groupBy?: string; // status | priority | person | group | board | <columnId>
  chartType?: 'bar' | 'pie' | 'line' | 'donut';
  metric?: { kind: 'count' } | { kind: 'sum' | 'avg'; columnId?: string; columnTitle?: string };
  dateRange?: { preset?: 'last_7' | 'last_30' | 'this_month' | 'next_7' | 'next_30' | 'all'; from?: string; to?: string; field?: 'created_at' | 'due' | 'completed_at' };
  days?: number;
  limit?: number;
}

interface Ctx {
  data: BoardData;
  members: Map<string, MemberDTO>;
  today: string;
  userId: string;
}

function resolveRange(cfg: WidgetConfig, today: string): [string, string] | null {
  const r = cfg.dateRange;
  if (!r || r.preset === 'all' || (!r.preset && !r.from && !r.to)) return null;
  switch (r.preset) {
    case 'last_7': return [addDays(today, -6), today];
    case 'last_30': return [addDays(today, -29), today];
    case 'this_month': return [today.slice(0, 8) + '01', addDays(today.slice(0, 8) + '01', 31).slice(0, 8) + '01'];
    case 'next_7': return [today, addDays(today, 7)];
    case 'next_30': return [today, addDays(today, 30)];
  }
  return [r.from ?? '0000-01-01', r.to ?? '9999-12-31'];
}

function scopedItems(ctx: Ctx, cfg: WidgetConfig): ItemDTO[] {
  const allowed = cfg.boardIds?.length ? new Set(cfg.boardIds) : null;
  const filter = cfg.filter ? sanitizeFilter(cfg.filter) : null;
  const range = resolveRange(cfg, ctx.today);
  return ctx.data.items.filter((i) => {
    if (!cfg.includeSubitems && i.parentItemId) return false;
    if (allowed && !allowed.has(i.boardId)) return false;
    const cols = ctx.data.columns.get(i.boardId) ?? [];
    if (filter && filter.rules.length && !matchFilter(i, filter, { columns: new Map(cols.map((c) => [c.id, c])), currentUserId: ctx.userId, today: ctx.today, userName: (id) => ctx.members.get(id)?.name })) return false;
    if (range) {
      const field = cfg.dateRange?.field ?? 'created_at';
      const d = field === 'due' ? dueDateOf(i.values, cols) : field === 'completed_at' ? (i.completedAt ? new Date(i.completedAt).toISOString().slice(0, 10) : null) : new Date(i.createdAt).toISOString().slice(0, 10);
      if (!d || d < range[0] || d > range[1]) return false;
    }
    return true;
  });
}

function metricValue(items: ItemDTO[], ctx: Ctx, metric: WidgetConfig['metric']): number {
  if (!metric || metric.kind === 'count') return items.length;
  const nums: number[] = [];
  for (const i of items) {
    const cols = ctx.data.columns.get(i.boardId) ?? [];
    const col = cols.find((c) => c.id === metric.columnId) ?? (metric.columnTitle ? cols.find((c) => c.title.toLowerCase() === metric.columnTitle!.toLowerCase()) : undefined);
    const v = col ? i.values[col.id] : undefined;
    if (typeof v === 'number') nums.push(v);
  }
  if (!nums.length) return 0;
  const sum = nums.reduce((a, b) => a + b, 0);
  return metric.kind === 'sum' ? sum : sum / nums.length;
}

export interface Segment {
  key: string;
  label: string;
  color: string | null;
  value: number;
  count: number;
}

const NONE = { key: '__none', label: 'Empty', color: '#94a3b8' };

function groupKeys(i: ItemDTO, ctx: Ctx, by: string): { key: string; label: string; color: string | null }[] {
  const cols = ctx.data.columns.get(i.boardId) ?? [];
  const labelOf = (type: 'status' | 'priority') => {
    const col = cols.find((c) => c.type === type);
    if (!col) return [NONE];
    const l = labelsOf(col).find((x) => x.id === i.values[col.id]);
    return l ? [{ key: l.label.toLowerCase(), label: l.label, color: l.color }] : [NONE];
  };
  switch (by) {
    case 'status': return labelOf('status');
    case 'priority': return labelOf('priority');
    case 'person': {
      const ids = assigneesOf(i.values, cols);
      return ids.length ? ids.map((id) => ({ key: id, label: ctx.members.get(id)?.name ?? 'Former member', color: null })) : [{ ...NONE, label: 'Unassigned' }];
    }
    case 'group': {
      const g = ctx.data.groups.get(i.groupId);
      return [{ key: g?.name.toLowerCase() ?? '?', label: g?.name ?? '—', color: g?.color ?? null }];
    }
    case 'board': {
      const b = ctx.data.boards.get(i.boardId);
      return [{ key: i.boardId, label: b?.name ?? '—', color: null }];
    }
    case 'done': return isItemDone(i, cols) ? [{ key: 'done', label: 'Done', color: '#00a36c' }] : [{ key: 'open', label: 'Open', color: '#5b5bd6' }];
    default: {
      const col = cols.find((c) => c.id === by);
      if (!col) return [NONE];
      const v = i.values[col.id];
      if (v == null || v === '') return [NONE];
      if (['status', 'priority', 'dropdown'].includes(col.type)) {
        const ids = Array.isArray(v) ? v : [v];
        return ids.map((id) => {
          const l = labelsOf(col).find((x) => x.id === id);
          return { key: String(id), label: l?.label ?? String(id), color: l?.color ?? null };
        });
      }
      if (col.type === 'person' || col.type === 'people') {
        return (Array.isArray(v) ? v : [v]).map((id) => ({ key: String(id), label: ctx.members.get(String(id))?.name ?? 'Former member', color: null }));
      }
      if (col.type === 'tags') return (v as string[]).map((t) => ({ key: t.toLowerCase(), label: t, color: null }));
      if (col.type === 'date') return [{ key: String(v).slice(0, 7), label: String(v).slice(0, 7), color: null }];
      const text = getColumnType(col.type).toText(v, col.settings);
      return [{ key: text.toLowerCase(), label: text, color: null }];
    }
  }
}

export function segments(items: ItemDTO[], ctx: Ctx, by: string, metric: WidgetConfig['metric']): Segment[] {
  const buckets = new Map<string, { label: string; color: string | null; items: ItemDTO[] }>();
  for (const i of items) {
    for (const k of groupKeys(i, ctx, by)) {
      const b = buckets.get(k.key) ?? { label: k.label, color: k.color, items: [] };
      b.items.push(i);
      buckets.set(k.key, b);
    }
  }
  return Array.from(buckets.entries())
    .map(([key, b]) => ({ key, label: b.label, color: b.color, value: Math.round(metricValue(b.items, ctx, metric) * 100) / 100, count: b.items.length }))
    .sort((a, b) => b.value - a.value);
}

function itemSummary(i: ItemDTO, ctx: Ctx) {
  const cols = ctx.data.columns.get(i.boardId) ?? [];
  const status = cols.find((c) => c.type === 'status');
  const label = status ? labelsOf(status).find((l) => l.id === i.values[status.id]) : undefined;
  return {
    id: i.id,
    name: i.name,
    boardId: i.boardId,
    boardName: ctx.data.boards.get(i.boardId)?.name ?? '',
    due: dueDateOf(i.values, cols),
    status: label ? { label: label.label, color: label.color } : null,
    assignees: assigneesOf(i.values, cols).map((id) => ctx.members.get(id)?.name ?? 'Former member'),
  };
}

export async function computeWidget(db: D1Database, type: string, cfg: WidgetConfig, ctx: Ctx): Promise<unknown> {
  const items = scopedItems(ctx, cfg);
  const open = () => items.filter((i) => !isItemDone(i, ctx.data.columns.get(i.boardId) ?? []));
  switch (type) {
    case 'number':
      return { value: Math.round(metricValue(items, ctx, cfg.metric) * 100) / 100, count: items.length };
    case 'chart':
      return { chartType: cfg.chartType ?? 'bar', segments: segments(items, ctx, cfg.groupBy ?? 'status', cfg.metric) };
    case 'status':
      return { segments: segments(items, ctx, 'status', { kind: 'count' }) };
    case 'priority':
      return { segments: segments(items, ctx, 'priority', { kind: 'count' }) };
    case 'completion': {
      const done = items.filter((i) => isItemDone(i, ctx.data.columns.get(i.boardId) ?? [])).length;
      return { done, total: items.length, percent: items.length ? Math.round((done / items.length) * 100) : 0 };
    }
    case 'workload': {
      const segs = segments(open(), ctx, 'person', cfg.metric ?? { kind: 'count' });
      return { segments: segs };
    }
    case 'overdue': {
      const list = open()
        .map((i) => itemSummary(i, ctx))
        .filter((s) => s.due && s.due < ctx.today)
        .sort((a, b) => (a.due ?? '').localeCompare(b.due ?? ''));
      return { count: list.length, items: list.slice(0, cfg.limit ?? 20) };
    }
    case 'upcoming': {
      const end = addDays(ctx.today, cfg.days ?? 7);
      const list = open()
        .map((i) => itemSummary(i, ctx))
        .filter((s) => s.due && s.due >= ctx.today && s.due <= end)
        .sort((a, b) => (a.due ?? '').localeCompare(b.due ?? ''));
      return { count: list.length, items: list.slice(0, cfg.limit ?? 20) };
    }
    case 'progress': {
      const byBoard = new Map<string, { done: number; total: number }>();
      for (const i of items) {
        const s = byBoard.get(i.boardId) ?? { done: 0, total: 0 };
        s.total++;
        if (isItemDone(i, ctx.data.columns.get(i.boardId) ?? [])) s.done++;
        byBoard.set(i.boardId, s);
      }
      return {
        boards: Array.from(byBoard.entries()).map(([id, s]) => ({ id, name: ctx.data.boards.get(id)?.name ?? '', done: s.done, total: s.total, percent: s.total ? Math.round((s.done / s.total) * 100) : 0 })),
      };
    }
    case 'activity': {
      const ids = cfg.boardIds?.length ? cfg.boardIds.filter((b) => ctx.data.boards.has(b)) : Array.from(ctx.data.boards.keys());
      if (!ids.length) return { events: [] };
      const rows = await db
        .prepare(
          `SELECT a.id, a.action, a.created_at, a.item_id, a.board_id, u.name AS actor_name, i.name AS item_name FROM activity_log a
           LEFT JOIN users u ON u.id = a.actor_id LEFT JOIN items i ON i.id = a.item_id
           WHERE a.board_id IN (${placeholders(ids.length)}) ORDER BY a.created_at DESC LIMIT ?`,
        )
        .bind(...ids, cfg.limit ?? 20)
        .all();
      return { events: rows.results.map((r: any) => ({ ...r, board_name: ctx.data.boards.get(r.board_id)?.name })) };
    }
    case 'time': {
      const ids = cfg.boardIds?.length ? cfg.boardIds.filter((b) => ctx.data.boards.has(b)) : Array.from(ctx.data.boards.keys());
      if (!ids.length) return { totalHours: 0, byPerson: [], byBoard: [] };
      const range = resolveRange(cfg, ctx.today) ?? ['0000-01-01', '9999-12-31'];
      const from = Date.parse(range[0] + 'T00:00:00Z');
      const to = Date.parse(range[1] + 'T23:59:59Z');
      const rows = await db
        .prepare(
          `SELECT t.user_id, t.board_id, SUM(COALESCE(t.duration_seconds, (strftime('%s','now') * 1000 - t.started_at) / 1000)) AS secs
           FROM time_entries t WHERE t.board_id IN (${placeholders(ids.length)}) AND t.started_at BETWEEN ? AND ? GROUP BY t.user_id, t.board_id`,
        )
        .bind(...ids, from, to)
        .all<{ user_id: string; board_id: string; secs: number }>();
      const byPerson = new Map<string, number>();
      const byBoard = new Map<string, number>();
      let total = 0;
      for (const r of rows.results) {
        byPerson.set(r.user_id, (byPerson.get(r.user_id) ?? 0) + r.secs);
        byBoard.set(r.board_id, (byBoard.get(r.board_id) ?? 0) + r.secs);
        total += r.secs;
      }
      const hours = (s: number) => Math.round((s / 3600) * 10) / 10;
      return {
        totalHours: hours(total),
        byPerson: Array.from(byPerson.entries()).map(([id, s]) => ({ key: id, label: ctx.members.get(id)?.name ?? 'Former member', value: hours(s), color: null, count: 0 })),
        byBoard: Array.from(byBoard.entries()).map(([id, s]) => ({ key: id, label: ctx.data.boards.get(id)?.name ?? '', value: hours(s), color: null, count: 0 })),
      };
    }
  }
  return { error: 'Unknown widget type' };
}

export function makeCtx(data: BoardData, members: MemberDTO[], userId: string, tz = 'UTC'): Ctx {
  return { data, members: new Map(members.map((m) => [m.id, m])), today: todayIn(tz), userId };
}

/** Goal progress from linked boards: percent of top-level items done. */
export function boardsCompletion(data: BoardData): { done: number; total: number; percent: number } {
  let done = 0;
  let total = 0;
  for (const i of data.items) {
    if (i.parentItemId) continue;
    total++;
    if (isItemDone(i, data.columns.get(i.boardId) ?? [])) done++;
  }
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}
