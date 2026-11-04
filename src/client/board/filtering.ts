import { matchFilter, sortItems, isItemDone } from '../../shared/filters';
import type { ColumnDTO, ItemDTO, ViewDTO } from '../../shared/types';

export interface QuickFilters {
  search: string;
  personId: string | null;
}

/** Apply a view's saved filter + sort and the transient quick filters. Returns top-level items. */
export function applyView(
  items: ItemDTO[],
  columns: ColumnDTO[],
  view: ViewDTO | undefined,
  quick: QuickFilters,
  ctx: { currentUserId: string; memberName: (id: string) => string | undefined },
): ItemDTO[] {
  const colMap = new Map(columns.map((c) => [c.id, c]));
  const fctx = { columns: colMap, currentUserId: ctx.currentUserId, userName: ctx.memberName };
  const q = quick.search.trim().toLowerCase();
  const subsByParent = new Map<string, ItemDTO[]>();
  for (const i of items) if (i.parentItemId) subsByParent.set(i.parentItemId, [...(subsByParent.get(i.parentItemId) ?? []), i]);
  const personCols = columns.filter((c) => c.type === 'person' || c.type === 'people');
  const top = items.filter((i) => {
    if (i.parentItemId) return false;
    if (view?.settings.filter && !matchFilter(i, view.settings.filter, fctx)) return false;
    if (quick.personId) {
      const has = personCols.some((c) => {
        const v = i.values[c.id];
        return Array.isArray(v) ? v.includes(quick.personId) : v === quick.personId;
      });
      if (!has) return false;
    }
    if (q) {
      const hay = [i.name, ...Object.values(i.values).map((v) => (typeof v === 'string' || typeof v === 'number' ? String(v) : ''))].join(' ').toLowerCase();
      const subHit = (subsByParent.get(i.id) ?? []).some((s) => s.name.toLowerCase().includes(q));
      if (!hay.includes(q) && !subHit) return false;
    }
    return true;
  });
  const sorted = view?.settings.sort?.length ? sortItems(top, view.settings.sort, fctx) : [...top].sort((a, b) => a.position - b.position);
  return sorted;
}

export function visibleColumns(columns: ColumnDTO[], view: ViewDTO | undefined): ColumnDTO[] {
  const hidden = new Set(view?.settings.hiddenColumns ?? []);
  return columns.filter((c) => !c.hidden && !hidden.has(c.id));
}

export { isItemDone };
