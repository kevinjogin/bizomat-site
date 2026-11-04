// Derived/computed item values shared by API and UI.

import { getColumnType, doneLabelIds, type ColumnLike } from './columns';
import { evaluateFormula, type FormulaValue } from './formula';
import { isItemDone } from './filters';

export interface ComputableItem {
  id: string;
  name: string;
  parentItemId?: string | null;
  createdAt: number;
  updatedAt: number;
  values: Record<string, unknown>;
}

export interface ComputeContext {
  userName?: (id: string) => string | undefined;
  subitemsOf?: (itemId: string) => ComputableItem[];
  today?: string;
}

function formulaInput(col: ColumnLike, item: ComputableItem, ctx: ComputeContext): FormulaValue {
  const v = col.type === 'created_at' ? item.createdAt : col.type === 'updated_at' ? item.updatedAt : item.values[col.id];
  if (v == null) return null;
  switch (col.type) {
    case 'number': case 'currency': case 'percentage': case 'rating': case 'progress':
      return typeof v === 'number' ? v : null;
    case 'checkbox':
      return !!v;
    case 'date':
      return String(v).slice(0, 10);
    case 'timeline':
      return (v as any).end ?? null;
    case 'created_at': case 'updated_at':
      return new Date(v as number).toISOString().slice(0, 10);
    case 'people': case 'files': case 'dependency':
      return Array.isArray(v) ? v.length : 0;
    default:
      return getColumnType(col.type).toText(v, col.settings, { userName: ctx.userName });
  }
}

/**
 * Returns a copy of item.values with computed columns (formula, created/updated
 * dates and derived progress) filled in. Computed values are never persisted.
 */
export function computeValues(item: ComputableItem, columns: ColumnLike[], ctx: ComputeContext = {}): Record<string, unknown> {
  const out: Record<string, unknown> = { ...item.values };
  const byTitle = new Map(columns.map((c) => [c.title.trim().toLowerCase(), c]));
  for (const col of columns) {
    if (col.type === 'created_at') out[col.id] = item.createdAt;
    else if (col.type === 'updated_at') out[col.id] = item.updatedAt;
    else if (col.type === 'progress' && col.settings?.mode === 'subitems' && ctx.subitemsOf) {
      const subs = ctx.subitemsOf(item.id);
      out[col.id] = subs.length ? Math.round((subs.filter((s) => isItemDone(s, columns)).length / subs.length) * 100) : null;
    } else if (col.type === 'progress' && col.settings?.mode === 'status') {
      const sc = columns.find((c) => c.id === col.settings.progressStatusColumnId) ?? columns.find((c) => c.type === 'status');
      if (sc) {
        const labels = (sc.settings.labels ?? []);
        const idx = labels.findIndex((l) => l.id === item.values[sc.id]);
        out[col.id] = idx < 0 ? null : doneLabelIds(sc).includes(String(item.values[sc.id])) ? 100 : Math.round((idx / Math.max(1, labels.length - 1)) * 100);
      }
    }
  }
  for (const col of columns) {
    if (col.type !== 'formula') continue;
    const src = String(col.settings?.formula ?? '');
    const seen = new Set<string>([col.id]);
    const resolve = (title: string): FormulaValue => {
      const key = title.trim().toLowerCase();
      if (key === 'name' || key === 'item') return item.name;
      const ref = byTitle.get(key);
      if (!ref) throw new Error(`Unknown column {${title}}`);
      if (ref.type === 'formula') {
        if (seen.has(ref.id)) throw new Error('Circular formula reference');
        seen.add(ref.id);
        const inner = evaluateFormula(String(ref.settings?.formula ?? ''), { resolve, today: ctx.today });
        seen.delete(ref.id);
        return inner.value;
      }
      return formulaInput(ref, { ...item, values: out }, ctx);
    };
    out[col.id] = evaluateFormula(src, { resolve, today: ctx.today }).value;
  }
  return out;
}

/** Pick the most relevant "due date" for an item (first date column, then timeline end). */
export function dueDateOf(values: Record<string, unknown>, columns: ColumnLike[]): string | null {
  for (const c of columns) {
    if (c.type === 'date' && typeof values[c.id] === 'string') return String(values[c.id]).slice(0, 10);
  }
  for (const c of columns) {
    if (c.type === 'timeline' && values[c.id]) return String((values[c.id] as any).end);
  }
  return null;
}

/** All user ids assigned via person / people columns. */
export function assigneesOf(values: Record<string, unknown>, columns: ColumnLike[]): string[] {
  const ids = new Set<string>();
  for (const c of columns) {
    const v = values[c.id];
    if (c.type === 'person' && typeof v === 'string') ids.add(v);
    if (c.type === 'people' && Array.isArray(v)) v.forEach((x) => typeof x === 'string' && ids.add(x));
  }
  return Array.from(ids);
}

/** Fractional index between two positions (for drag & drop reordering). */
export function positionBetween(before: number | null | undefined, after: number | null | undefined): number {
  if (before == null && after == null) return 1000;
  if (before == null) return (after as number) - 1000;
  if (after == null) return before + 1000;
  return (before + after) / 2;
}
