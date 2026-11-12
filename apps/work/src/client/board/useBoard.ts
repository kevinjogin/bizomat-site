// Board state: one shared bundle (board, groups, columns, items, views) used by
// EVERY view. Mutations go to the API and are applied optimistically to the
// cached bundle so all views update instantly and consistently.

import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { BoardBundle, ColumnDTO, GroupDTO, ItemDTO, ViewDTO, ViewSettings } from '../../shared/types';
import { computeValues } from '../../shared/items';
import { positionBetween } from '../../shared/items';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { useToast } from '../components/ui/overlays';

export interface BoardActions {
  createItem: (input: { name: string; groupId?: string; parentItemId?: string | null; values?: Record<string, unknown>; position?: 'top' | 'bottom' }) => Promise<ItemDTO | null>;
  updateItem: (id: string, patch: { name?: string; description?: string; values?: Record<string, unknown> }) => Promise<boolean>;
  setValue: (id: string, columnId: string, value: unknown) => Promise<boolean>;
  moveItem: (id: string, to: { groupId?: string; beforeId?: string | null; afterId?: string | null }) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  archiveItem: (id: string) => Promise<void>;
  duplicateItem: (id: string) => Promise<void>;
  bulk: (itemIds: string[], action: string, extra?: Record<string, unknown>) => Promise<void>;
  createGroup: (name: string, position?: 'top' | 'bottom') => Promise<void>;
  updateGroup: (id: string, patch: Partial<Pick<GroupDTO, 'name' | 'color' | 'collapsed' | 'position'>>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  archiveGroup: (id: string) => Promise<void>;
  duplicateGroup: (id: string) => Promise<void>;
  createColumn: (input: { title: string; type: string; settings?: Record<string, unknown>; afterColumnId?: string }) => Promise<ColumnDTO | null>;
  updateColumn: (id: string, patch: Partial<Pick<ColumnDTO, 'title' | 'type' | 'settings' | 'width' | 'hidden' | 'required' | 'description' | 'position'>>) => Promise<boolean>;
  deleteColumn: (id: string) => Promise<void>;
  createView: (input: { name: string; type: ViewDTO['type']; settings?: ViewSettings; personal?: boolean }) => Promise<ViewDTO | null>;
  updateView: (id: string, patch: { name?: string; settings?: ViewSettings; position?: number }) => Promise<void>;
  deleteView: (id: string) => Promise<void>;
  refresh: () => Promise<unknown>;
}

type ItemPatch = { name?: string; description?: string; values?: Record<string, unknown> };

// An added item is shown at once under a temporary id ('tmp-…') and replaced by the saved item when the server
// answers. Someone can click the new row in between, so that window is invisible to the rest of the board:
// - `saving`: temporary id → the save, so an edit made meanwhile waits for the real id instead of being lost;
// - `queued`: temporary id → those edits, laid over the saved item when it replaces the temporary one;
// - `savedAs`: temporary id → real id, for an edit from the row as it was drawn just before the swap;
// - `rowKeys`: real id → the temporary id it replaced, so the row keeps its React key and an editor opened on
//   the temporary row stays open (a new key would remount the row and close it).
const saving = new Map<string, Promise<ItemDTO | null>>();
const queued = new Map<string, ItemPatch>();
const savedAs = new Map<string, string>();
const rowKeys = new Map<string, string>();

/** True while an added item is still being saved (it has no id on the server yet). */
export const isUnsaved = (id: string) => id.startsWith('tmp-');

/** React key for an item's row: the same before and after an added item is saved. */
export const itemKey = (id: string) => rowKeys.get(id) ?? id;

function applyPatch(i: ItemDTO, p: ItemPatch): ItemDTO {
  return { ...i, ...(p.name !== undefined ? { name: p.name } : {}), ...(p.description !== undefined ? { description: p.description } : {}), values: p.values ? mergeValues(i.values, p.values) : i.values, updatedAt: Date.now() };
}

export function useBoardQuery(boardId: string | undefined) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => keepUnsaved(await get<BoardBundle>(`/boards/${boardId}`), qc.getQueryData<BoardBundle>(['board', boardId])),
    enabled: !!boardId,
    staleTime: 5_000,
  });
}

/** The server knows nothing yet of an item still being saved: a board fetch keeps its row (and any editor open on it). */
function keepUnsaved(fresh: BoardBundle, current: BoardBundle | undefined): BoardBundle {
  const unsaved = current?.items.filter((i) => saving.has(i.id)) ?? [];
  return unsaved.length ? { ...fresh, items: [...fresh.items, ...unsaved] } : fresh;
}

/** Items with computed values (formula, progress, created/updated) filled in. */
export function useComputedItems(bundle: BoardBundle | undefined, memberName: (id: string) => string | undefined) {
  return useMemo(() => {
    if (!bundle) return [] as ItemDTO[];
    const subs = new Map<string, ItemDTO[]>();
    for (const i of bundle.items) if (i.parentItemId) subs.set(i.parentItemId, [...(subs.get(i.parentItemId) ?? []), i]);
    return bundle.items.map((i) => ({ ...i, values: computeValues(i, bundle.columns, { userName: memberName, subitemsOf: (id) => subs.get(id) ?? [] }) }));
  }, [bundle, memberName]);
}

export function useBoardActions(boardId: string): BoardActions {
  const qc = useQueryClient();
  const toast = useToast();
  const key = ['board', boardId];
  const getB = () => qc.getQueryData<BoardBundle>(key);
  const setB = (fn: (b: BoardBundle) => BoardBundle) => qc.setQueryData<BoardBundle>(key, (b) => (b ? fn(b) : b));
  const refresh = () => qc.invalidateQueries({ queryKey: key });
  const fail = (e: unknown) => {
    toast(errorMessage(e), 'error');
    void refresh();
  };
  const run = async <T,>(p: Promise<T>, after = true): Promise<T | null> => {
    try {
      const r = await p;
      if (after) void refresh();
      return r;
    } catch (e) {
      fail(e);
      return null;
    }
  };

  return {
    refresh,
    async createItem(input) {
      const tempId = `tmp-${Math.random().toString(36).slice(2)}`;
      const b = getB();
      const groupId = input.groupId ?? (input.parentItemId ? b?.items.find((i) => i.id === input.parentItemId)?.groupId : b?.groups[0]?.id) ?? '';
      if (b) {
        const siblings = b.items.filter((i) => (input.parentItemId ? i.parentItemId === input.parentItemId : i.groupId === groupId && !i.parentItemId));
        const pos = input.position === 'top' ? positionBetween(null, siblings[0]?.position ?? null) : positionBetween(siblings.at(-1)?.position ?? null, null);
        setB((bb) => ({
          ...bb,
          items: [...bb.items, { id: tempId, boardId, groupId, parentItemId: input.parentItemId ?? null, name: input.name, description: '', position: pos, values: input.values ?? {}, createdBy: '', createdAt: Date.now(), updatedAt: Date.now(), completedAt: null, archivedAt: null, subitemCount: 0, updateCount: 0 }],
        }));
      }
      const save = (async () => {
        const created = await run(post<ItemDTO>(`/boards/${boardId}/items`, { ...input, groupId: input.parentItemId ? undefined : groupId || undefined }), false);
        const edits = queued.get(tempId);
        queued.delete(tempId);
        saving.delete(tempId);
        // A board fetch still on its way may predate the save: it would drop the saved row again.
        void qc.cancelQueries({ queryKey: key });
        // Swap the temporary row for the saved one under the same React key, with any edit made meanwhile
        // (and without a copy of the saved item that a fetch may already have brought in).
        if (created) {
          savedAs.set(tempId, created.id);
          rowKeys.set(created.id, tempId);
        }
        setB((bb) => ({ ...bb, items: created ? bb.items.filter((i) => i.id !== created.id).map((i) => (i.id === tempId ? applyPatch({ ...created, subitemCount: 0, updateCount: 0 }, edits ?? {}) : i)) : bb.items.filter((i) => i.id !== tempId) }));
        // An edit made meanwhile refreshes the board once it is saved; refreshing now could bring back the item
        // without it for a moment.
        if (!edits) void refresh();
        return created;
      })();
      saving.set(tempId, save);
      return save;
    },
    async updateItem(id, p) {
      id = savedAs.get(id) ?? id;
      setB((b) => ({ ...b, items: b.items.map((i) => (i.id === id ? applyPatch(i, p) : i)) }));
      if (isUnsaved(id)) {
        const pending = saving.get(id);
        if (!pending) return false; // its save failed; createItem has said so and removed the row
        const before = queued.get(id);
        queued.set(id, { ...before, ...p, ...(before?.values || p.values ? { values: { ...before?.values, ...p.values } } : {}) });
        const created = await pending;
        if (!created) return false;
        id = created.id;
      }
      return (await run(patch(`/items/${id}`, p))) !== null;
    },
    async setValue(id, columnId, value) {
      return this.updateItem(id, { values: { [columnId]: value } });
    },
    async moveItem(id, to) {
      const b = getB();
      if (b) {
        const pos = (x?: string | null) => (x ? b.items.find((i) => i.id === x)?.position ?? null : null);
        const item = b.items.find((i) => i.id === id);
        const groupId = to.groupId ?? item?.groupId;
        let position: number;
        if (!to.beforeId && !to.afterId) {
          const last = b.items.filter((i) => i.groupId === groupId && !i.parentItemId && i.id !== id).sort((a, c) => a.position - c.position).at(-1);
          position = positionBetween(last?.position ?? null, null);
        } else position = positionBetween(pos(to.beforeId), pos(to.afterId));
        setB((bb) => ({ ...bb, items: bb.items.map((i) => (i.id === id ? { ...i, groupId: groupId!, position } : i.parentItemId === id ? { ...i, groupId: groupId! } : i)) }));
      }
      await run(post(`/items/${id}/move`, to));
    },
    async deleteItem(id) {
      setB((b) => ({ ...b, items: b.items.filter((i) => i.id !== id && i.parentItemId !== id) }));
      await run(del(`/items/${id}`));
    },
    async archiveItem(id) {
      setB((b) => ({ ...b, items: b.items.filter((i) => i.id !== id && i.parentItemId !== id) }));
      await run(post(`/items/${id}/archive`));
    },
    async duplicateItem(id) {
      await run(post(`/items/${id}/duplicate`, { withSubitems: true }));
    },
    async bulk(itemIds, action, extra = {}) {
      if (action === 'delete' || action === 'archive') setB((b) => ({ ...b, items: b.items.filter((i) => !itemIds.includes(i.id) && !itemIds.includes(i.parentItemId ?? '')) }));
      const r = await run(post<{ ok: boolean; processed: number; errors: { error: string }[] }>(`/boards/${boardId}/items/bulk`, { itemIds, action, ...extra }));
      if (r && r.errors.length) toast(`${r.errors.length} item(s) failed: ${r.errors[0].error}`, 'error');
    },
    async createGroup(name, position = 'top') {
      await run(post(`/boards/${boardId}/groups`, { name, position }));
    },
    async updateGroup(id, p) {
      setB((b) => ({ ...b, groups: b.groups.map((g) => (g.id === id ? { ...g, ...p } : g)).sort((a, c) => a.position - c.position) }));
      await run(patch(`/groups/${id}`, p), p.collapsed === undefined);
    },
    async deleteGroup(id) {
      setB((b) => ({ ...b, groups: b.groups.filter((g) => g.id !== id), items: b.items.filter((i) => i.groupId !== id) }));
      await run(del(`/groups/${id}`));
    },
    async archiveGroup(id) {
      setB((b) => ({ ...b, groups: b.groups.filter((g) => g.id !== id), items: b.items.filter((i) => i.groupId !== id) }));
      await run(post(`/groups/${id}/archive`, { archived: true }));
    },
    async duplicateGroup(id) {
      await run(post(`/groups/${id}/duplicate`));
    },
    async createColumn(input) {
      return run(post<ColumnDTO>(`/boards/${boardId}/columns`, input));
    },
    async updateColumn(id, p) {
      setB((b) => ({ ...b, columns: b.columns.map((c) => (c.id === id ? { ...c, ...p, settings: p.settings ? { ...c.settings, ...p.settings } : c.settings } : c)).sort((a, c) => a.position - c.position) }));
      return (await run(patch(`/columns/${id}`, p))) !== null;
    },
    async deleteColumn(id) {
      setB((b) => ({ ...b, columns: b.columns.filter((c) => c.id !== id) }));
      await run(del(`/columns/${id}`));
    },
    async createView(input) {
      return run(post<ViewDTO>(`/boards/${boardId}/views`, input));
    },
    async updateView(id, p) {
      setB((b) => ({ ...b, views: b.views.map((v) => (v.id === id ? { ...v, ...(p.name ? { name: p.name } : {}), ...(p.settings ? { settings: p.settings } : {}), ...(p.position !== undefined ? { position: p.position } : {}) } : v)) }));
      await run(patch(`/views/${id}`, p), false);
    },
    async deleteView(id) {
      setB((b) => ({ ...b, views: b.views.filter((v) => v.id !== id) }));
      await run(del(`/views/${id}`));
    },
  };
}

function mergeValues(base: Record<string, unknown>, p: Record<string, unknown>) {
  const out = { ...base };
  for (const [k, v] of Object.entries(p)) {
    if (v == null || v === '') delete out[k];
    else out[k] = v;
  }
  return out;
}
