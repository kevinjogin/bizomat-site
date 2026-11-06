// Filter engine shared by table views, search, dashboards and automation
// conditions. Supports nested AND/OR groups.

import { getColumnType, isEmptyValue, labelsOf, doneLabelIds, type ColumnLike, type FilterOperator } from './columns';
import { addDays, startOfWeek, todayIn } from './dates';

export interface FilterRule {
  field: string; // 'name' | 'group' | 'board' | 'created_at' | 'updated_at' | 'done' | <columnId>
  op: FilterOperator;
  value?: unknown;
}

export interface FilterGroup {
  op: 'and' | 'or';
  rules: Array<FilterRule | FilterGroup>;
}

export interface FilterableItem {
  id: string;
  name: string;
  boardId: string;
  groupId: string;
  createdAt: number;
  updatedAt: number;
  values: Record<string, unknown>;
}

export interface FilterContext {
  columns: Map<string, ColumnLike>;
  currentUserId?: string;
  today?: string;
  timeZone?: string;
  userName?: (id: string) => string | undefined;
}

export const EMPTY_FILTER: FilterGroup = { op: 'and', rules: [] };

export function isGroup(r: FilterRule | FilterGroup): r is FilterGroup {
  return (r as FilterGroup).rules !== undefined;
}

const MAX_RULES = 100;

/** Validate & normalise an untrusted filter payload. */
export function sanitizeFilter(input: unknown, depth = 0): FilterGroup {
  if (!input || typeof input !== 'object' || depth > 4) return { op: 'and', rules: [] };
  const g = input as { op?: unknown; rules?: unknown };
  const op = g.op === 'or' ? 'or' : 'and';
  const rules: Array<FilterRule | FilterGroup> = [];
  if (Array.isArray(g.rules)) {
    for (const r of g.rules.slice(0, MAX_RULES)) {
      if (!r || typeof r !== 'object') continue;
      if (Array.isArray((r as FilterGroup).rules)) {
        rules.push(sanitizeFilter(r, depth + 1));
      } else {
        const rr = r as FilterRule;
        if (typeof rr.field !== 'string' || typeof rr.op !== 'string') continue;
        rules.push({ field: rr.field.slice(0, 64), op: rr.op as FilterOperator, value: rr.value });
      }
    }
  }
  return { op, rules };
}

function toDay(v: unknown): string | null {
  if (typeof v === 'number') return new Date(v).toISOString().slice(0, 10);
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  if (v && typeof v === 'object' && 'end' in (v as any)) return String((v as any).end).slice(0, 10);
  return null;
}

function dateRange(v: unknown): [string, string] | null {
  if (v && typeof v === 'object' && 'start' in (v as any)) return [String((v as any).start), String((v as any).end)];
  const d = toDay(v);
  return d ? [d, d] : null;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : v == null ? [] : [v];
}

function fieldValue(item: FilterableItem, field: string): unknown {
  switch (field) {
    case 'name': return item.name;
    case 'group': return item.groupId;
    case 'board': return item.boardId;
    case 'created_at': return item.createdAt;
    case 'updated_at': return item.updatedAt;
    default: return item.values[field];
  }
}

function fieldColumn(field: string, ctx: FilterContext): ColumnLike | undefined {
  return ctx.columns.get(field);
}

export function matchRule(item: FilterableItem, rule: FilterRule, ctx: FilterContext): boolean {
  const today = ctx.today ?? todayIn(ctx.timeZone);
  const col = fieldColumn(rule.field, ctx);
  let raw = fieldValue(item, rule.field);
  if (col && (col.type === 'created_at' || col.type === 'updated_at')) raw = col.type === 'created_at' ? item.createdAt : item.updatedAt;

  // Special pseudo-field: item completion (any done status label).
  if (rule.field === 'done') {
    const done = isItemDone(item, ctx.columns);
    return rule.op === 'is_not' ? !done : done === (rule.value !== false);
  }

  const text = col
    ? getColumnType(col.type).toText(raw, col.settings, { userName: ctx.userName })
    : raw == null ? '' : String(raw);
  const v = rule.value;
  const vText = v == null ? '' : String(v).toLowerCase();

  switch (rule.op) {
    case 'is_empty': return isEmptyValue(raw);
    case 'is_not_empty': return !isEmptyValue(raw);
    case 'contains':
      if (Array.isArray(raw)) return raw.some((x) => String(x).toLowerCase().includes(vText));
      return text.toLowerCase().includes(vText);
    case 'not_contains':
      if (Array.isArray(raw)) return !raw.some((x) => String(x).toLowerCase().includes(vText));
      return !text.toLowerCase().includes(vText);
    case 'is':
    case 'is_not': {
      let eq: boolean;
      if (col?.type === 'checkbox') eq = !!raw === (v === true || v === 'true');
      else if (Array.isArray(raw)) eq = raw.map(String).includes(String(v));
      else if (typeof raw === 'number' && v !== '' && v != null) eq = raw === Number(v);
      else if (col && ['status', 'priority', 'dropdown', 'person'].includes(col.type)) eq = raw === v;
      else eq = String(raw ?? '').toLowerCase() === vText || text.toLowerCase() === vText;
      return rule.op === 'is' ? eq : !eq;
    }
    case 'any_of':
    case 'none_of': {
      const wanted = asArray(v).map(String);
      const have = asArray(raw).map(String);
      const hit = have.some((h) => wanted.includes(h));
      return rule.op === 'any_of' ? hit : !hit;
    }
    case 'includes_me':
      return !!ctx.currentUserId && asArray(raw).includes(ctx.currentUserId);
    case 'gt': case 'gte': case 'lt': case 'lte': {
      const n = typeof raw === 'number' ? raw : Number(raw);
      if (raw == null || !Number.isFinite(n)) return false;
      const t = Number(v);
      return rule.op === 'gt' ? n > t : rule.op === 'gte' ? n >= t : rule.op === 'lt' ? n < t : n <= t;
    }
    case 'between': {
      const [lo, hi] = Array.isArray(v) ? v : [undefined, undefined];
      if (typeof raw === 'number' && (col == null || !['created_at', 'updated_at'].includes(col.type)) && rule.field !== 'created_at' && rule.field !== 'updated_at') {
        return (lo == null || lo === '' || raw >= Number(lo)) && (hi == null || hi === '' || raw <= Number(hi));
      }
      const r = dateRange(raw);
      if (!r) return false;
      return (!lo || r[1] >= String(lo)) && (!hi || r[0] <= String(hi));
    }
    case 'on': { const r = dateRange(raw); return !!r && r[0] <= String(v) && r[1] >= String(v); }
    case 'before': { const d = toDay(raw); return !!d && d < String(v); }
    case 'after': { const d = toDay(raw); return !!d && d > String(v); }
    case 'today': { const r = dateRange(raw); return !!r && r[0] <= today && r[1] >= today; }
    case 'this_week': {
      const r = dateRange(raw);
      if (!r) return false;
      const s = startOfWeek(today);
      const e = addDays(s, 6);
      return r[1] >= s && r[0] <= e;
    }
    case 'overdue': {
      const d = toDay(raw);
      return !!d && d < today && !isItemDone(item, ctx.columns);
    }
    case 'within_next_days': {
      const d = toDay(raw);
      const n = Number(v ?? 7);
      return !!d && d >= today && d <= addDays(today, n);
    }
    case 'within_last_days': {
      const d = toDay(raw);
      const n = Number(v ?? 7);
      return !!d && d <= today && d >= addDays(today, -n);
    }
  }
  return false;
}

export function matchFilter(item: FilterableItem, filter: FilterGroup | undefined | null, ctx: FilterContext): boolean {
  if (!filter || !filter.rules || filter.rules.length === 0) return true;
  const results = filter.rules.map((r) => (isGroup(r) ? matchFilter(item, r, ctx) : matchRule(item, r, ctx)));
  return filter.op === 'or' ? results.some(Boolean) : results.every(Boolean);
}

/** True when any status column on the item has a "done" label selected. */
export function isItemDone(item: { values: Record<string, unknown> }, columns: Map<string, ColumnLike> | ColumnLike[]): boolean {
  const cols = Array.isArray(columns) ? columns : Array.from(columns.values());
  const statusCols = cols.filter((c) => c.type === 'status');
  if (statusCols.length === 0) return false;
  return statusCols.some((c) => {
    const v = item.values[c.id];
    return typeof v === 'string' && doneLabelIds(c).includes(v);
  });
}

export function sortItems<T extends FilterableItem>(
  items: T[],
  sort: { field: string; dir: 'asc' | 'desc' }[] | undefined,
  ctx: FilterContext,
): T[] {
  if (!sort || sort.length === 0) return items;
  const keyed = items.map((it) => ({
    it,
    keys: sort.map((s) => {
      const col = ctx.columns.get(s.field);
      const raw = fieldValue(it, s.field);
      if (!col) return typeof raw === 'string' ? raw.toLowerCase() : (raw as number | null) ?? null;
      if (col.type === 'created_at') return it.createdAt;
      if (col.type === 'updated_at') return it.updatedAt;
      if (col.type === 'person' || col.type === 'people') {
        const id = Array.isArray(raw) ? raw[0] : raw;
        return typeof id === 'string' ? (ctx.userName?.(id) ?? id).toLowerCase() : null;
      }
      return getColumnType(col.type).sortKey(raw, col.settings);
    }),
  }));
  keyed.sort((a, b) => {
    for (let i = 0; i < sort.length; i++) {
      const x = a.keys[i];
      const y = b.keys[i];
      if (x === y) continue;
      if (x == null) return 1; // empties last regardless of direction
      if (y == null) return -1;
      const c = x < y ? -1 : 1;
      return sort[i].dir === 'desc' ? -c : c;
    }
    return 0;
  });
  return keyed.map((k) => k.it);
}

/** Operators available for a field. */
export function operatorsFor(field: string, columns: Map<string, ColumnLike>): FilterOperator[] {
  if (field === 'name') return ['contains', 'not_contains', 'is', 'is_not', 'is_empty', 'is_not_empty'];
  if (field === 'group' || field === 'board') return ['is', 'is_not', 'any_of', 'none_of'];
  if (field === 'created_at' || field === 'updated_at') return ['on', 'before', 'after', 'between', 'today', 'this_week', 'within_last_days'];
  const col = columns.get(field);
  return col ? getColumnType(col.type).operators : [];
}

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  is: 'is', is_not: 'is not', contains: 'contains', not_contains: 'does not contain',
  is_empty: 'is empty', is_not_empty: 'is not empty', any_of: 'is any of', none_of: 'is none of',
  gt: '>', gte: '≥', lt: '<', lte: '≤', between: 'between', before: 'before', after: 'after',
  on: 'on', within_next_days: 'within next N days', within_last_days: 'within last N days',
  overdue: 'is overdue', today: 'is today', this_week: 'is this week', includes_me: 'includes me',
};

export function opNeedsValue(op: FilterOperator): boolean {
  return !['is_empty', 'is_not_empty', 'overdue', 'today', 'this_week', 'includes_me'].includes(op);
}

export { labelsOf };
