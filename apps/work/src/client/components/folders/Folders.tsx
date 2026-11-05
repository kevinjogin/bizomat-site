// Reusable folders UI: coloured folder icons, folder tree with drag & drop
// filing, colour picker and "Move to folder" menus. Used by Documents,
// Boards, Dashboards and the sidebar.

import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { FolderDTO } from '../../../shared/types';
import { PALETTE } from '../../../shared/columns';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { Icon } from '../ui/Icon';
import { MenuItem, MenuSep, Modal, Popover, useConfirm, useToast } from '../ui/overlays';
import { Field } from '../ui/ui';

export type FolderScope = FolderDTO['scope'];
export type FolderSelection = 'all' | 'unfiled' | string;

export const FOLDER_COLORS = ['#F97316', ...PALETTE.filter((c) => c.toLowerCase() !== '#f97316')];
const ENTITY_MIME = 'application/x-workos-entity';
const FOLDER_MIME = 'application/x-workos-folder';

export function useFolders(wsId: string, scope: FolderScope) {
  return useQuery({ queryKey: ['folders', wsId, scope], queryFn: () => get<FolderDTO[]>(`/workspaces/${wsId}/folders?scope=${scope}`), staleTime: 30_000 });
}

/** Filled folder glyph in any colour. */
export function FolderIcon({ color = '#F97316', size = 18, open }: { color?: string; size?: number; open?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ flex: 'none' }}>
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.4l2 2h8.6A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6.5Z" fill={color} />
      <path d={open ? 'M3.3 10.5h17.4l-1.6 8.1a1.5 1.5 0 0 1-1.5 1.2H4.6' : 'M3 9.5h18'} stroke="rgba(255,255,255,.55)" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

/** Makes an element draggable into a folder. */
export function entityDragProps(id: string) {
  return {
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData(ENTITY_MIME, id);
      e.dataTransfer.effectAllowed = 'move';
    },
  };
}

interface Node {
  folder: FolderDTO;
  children: Node[];
  depth: number;
}

export function buildTree(folders: FolderDTO[]): Node[] {
  const byParent = new Map<string | null, FolderDTO[]>();
  const ids = new Set(folders.map((f) => f.id));
  for (const f of folders) {
    const p = f.parentId && ids.has(f.parentId) ? f.parentId : null;
    byParent.set(p, [...(byParent.get(p) ?? []), f]);
  }
  const walk = (parent: string | null, depth: number): Node[] =>
    (byParent.get(parent) ?? []).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name)).map((f) => ({ folder: f, depth, children: walk(f.id, depth + 1) }));
  return walk(null, 0);
}

export function flattenTree(nodes: Node[]): Node[] {
  return nodes.flatMap((n) => [n, ...flattenTree(n.children)]);
}

export function folderPath(folders: FolderDTO[], id: string | null): FolderDTO[] {
  const map = new Map(folders.map((f) => [f.id, f]));
  const out: FolderDTO[] = [];
  let cur = id ? map.get(id) : undefined;
  while (cur && out.length < 20) {
    out.unshift(cur);
    cur = cur.parentId ? map.get(cur.parentId) : undefined;
  }
  return out;
}

function useFolderActions(wsId: string, scope: FolderScope) {
  const qc = useQueryClient();
  const toast = useToast();
  const refresh = () => qc.invalidateQueries({ queryKey: ['folders', wsId, scope] });
  const run = async <T,>(p: Promise<T>, msg?: string): Promise<T | null> => {
    try {
      const r = await p;
      await refresh();
      if (msg) toast(msg);
      return r;
    } catch (e) {
      toast(errorMessage(e), 'error');
      return null;
    }
  };
  return {
    create: (name: string, color: string, parentId: string | null) => run(post<FolderDTO>(`/workspaces/${wsId}/folders`, { scope, name, color, parentId }), `Folder "${name}" created`),
    update: (id: string, p: Partial<Pick<FolderDTO, 'name' | 'color' | 'parentId'>>) => run(patch<FolderDTO>(`/folders/${id}`, p)),
    remove: (id: string) => run(del(`/folders/${id}`), 'Folder deleted — its contents moved up a level'),
  };
}

export function FolderDialog({ title, initial, onSave, onClose }: { title: string; initial?: { name: string; color: string }; onSave: (name: string, color: string) => Promise<unknown>; onClose: () => void }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? '#F97316');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSave(name.trim(), color);
    onClose();
  };
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" form="folder-form" disabled={!name.trim()}>Save</button></>}>
      <form id="folder-form" onSubmit={submit}>
        <Field label="Folder name" htmlFor="folder-name">
          <input id="folder-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="e.g. Client proposals" />
        </Field>
        <Field label="Colour">
          <FolderColorPicker value={color} onChange={setColor} />
        </Field>
        <div className="row" style={{ gap: 10 }}>
          <FolderIcon color={color} size={36} /> <strong>{name || 'Preview'}</strong>
        </div>
      </form>
    </Modal>
  );
}

export function FolderColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="row wrap" style={{ gap: 6 }} role="radiogroup" aria-label="Folder colour">
      {FOLDER_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={value.toLowerCase() === c.toLowerCase()}
          aria-label={`Colour ${c}`}
          onClick={() => onChange(c)}
          className="folder-swatch"
          style={{ outline: value.toLowerCase() === c.toLowerCase() ? '2px solid var(--text)' : undefined }}
        >
          <FolderIcon color={c} size={22} />
        </button>
      ))}
      <label className="folder-swatch" title="Custom colour" style={{ position: 'relative' }}>
        <Icon name="edit" size={14} />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Custom colour" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
      </label>
    </div>
  );
}

/**
 * Folder navigator: All / Unfiled / tree. Folders accept dropped entities
 * (calls onFile) and dropped folders (re-parents them).
 */
export function FolderPanel({
  wsId,
  scope,
  selected,
  onSelect,
  counts,
  canEdit,
  onFile,
  label,
}: {
  wsId: string;
  scope: FolderScope;
  selected: FolderSelection;
  onSelect: (s: FolderSelection) => void;
  counts: { all: number; unfiled: number; byFolder: Map<string, number> };
  canEdit: boolean;
  onFile: (entityId: string, folderId: string | null) => void;
  label: string;
}) {
  const q = useFolders(wsId, scope);
  const actions = useFolderActions(wsId, scope);
  const confirm = useConfirm();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<null | { mode: 'create'; parentId: string | null } | { mode: 'edit'; folder: FolderDTO }>(null);
  const [menu, setMenu] = useState<{ folder: FolderDTO; el: HTMLElement } | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const tree = useMemo(() => buildTree(q.data ?? []), [q.data]);

  const dropHandlers = (target: string | null) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!canEdit) return;
      if (e.dataTransfer.types.includes(ENTITY_MIME) || e.dataTransfer.types.includes(FOLDER_MIME)) {
        e.preventDefault();
        setOver(target ?? '__root');
      }
    },
    onDragLeave: () => setOver(null),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setOver(null);
      const entity = e.dataTransfer.getData(ENTITY_MIME);
      const folder = e.dataTransfer.getData(FOLDER_MIME);
      if (entity) onFile(entity, target);
      else if (folder && folder !== target) void actions.update(folder, { parentId: target });
    },
  });

  const renderNode = (n: Node): ReactNode => {
    const f = n.folder;
    const isOpen = !collapsed.has(f.id);
    return (
      <div key={f.id}>
        <div
          className={`folder-row${selected === f.id ? ' active' : ''}${over === f.id ? ' drop' : ''}`}
          style={{ paddingLeft: 6 + n.depth * 14 }}
          draggable={canEdit}
          onDragStart={(e) => { e.dataTransfer.setData(FOLDER_MIME, f.id); e.stopPropagation(); }}
          {...dropHandlers(f.id)}
        >
          <button className="btn ghost icon sm" style={{ width: 18, height: 18, visibility: n.children.length ? 'visible' : 'hidden' }} aria-label={isOpen ? `Collapse ${f.name}` : `Expand ${f.name}`} aria-expanded={isOpen} onClick={() => setCollapsed((s) => { const x = new Set(s); if (x.has(f.id)) x.delete(f.id); else x.add(f.id); return x; })}>
            <Icon name={isOpen ? 'chevronDown' : 'chevronRight'} size={12} />
          </button>
          <button className="folder-name" onClick={() => onSelect(f.id)} aria-current={selected === f.id ? 'true' : undefined}>
            <FolderIcon color={f.color} open={selected === f.id} /> <span className="ellipsis">{f.name}</span>
          </button>
          <span className="folder-count">{counts.byFolder.get(f.id) ?? 0}</span>
          {canEdit ? (
            <button className="btn ghost icon sm folder-more" aria-label={`${f.name} folder options`} onClick={(e) => setMenu({ folder: f, el: e.currentTarget })}>
              <Icon name="more" size={14} />
            </button>
          ) : null}
        </div>
        {isOpen ? n.children.map(renderNode) : null}
      </div>
    );
  };

  return (
    <nav className="folder-panel card" aria-label={`${label} folders`}>
      <div className="row" style={{ padding: '10px 10px 6px' }}>
        <strong className="grow small" style={{ textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-3)' }}>Folders</strong>
        {canEdit ? (
          <button className="btn ghost icon sm" aria-label="New folder" title="New folder" onClick={() => setDialog({ mode: 'create', parentId: null })}>
            <Icon name="plus" size={14} />
          </button>
        ) : null}
      </div>
      <div className={`folder-row${selected === 'all' ? ' active' : ''}`} style={{ paddingLeft: 6 }}>
        <span style={{ width: 18 }} />
        <button className="folder-name" onClick={() => onSelect('all')}><Icon name="layers" /> All {label.toLowerCase()}</button>
        <span className="folder-count">{counts.all}</span>
      </div>
      <div className={`folder-row${selected === 'unfiled' ? ' active' : ''}${over === '__root' ? ' drop' : ''}`} style={{ paddingLeft: 6 }} {...dropHandlers(null)}>
        <span style={{ width: 18 }} />
        <button className="folder-name" onClick={() => onSelect('unfiled')}><Icon name="inbox" /> Not in a folder</button>
        <span className="folder-count">{counts.unfiled}</span>
      </div>
      {tree.length ? <div className="menu-sep" /> : null}
      {tree.map(renderNode)}
      {q.data && !q.data.length && canEdit ? (
        <button className="btn ghost sm" style={{ margin: '6px 8px 10px' }} onClick={() => setDialog({ mode: 'create', parentId: null })}>
          <Icon name="folder" /> Create your first folder
        </button>
      ) : null}
      {canEdit && q.data?.length ? <p className="muted small" style={{ padding: '6px 12px 10px', margin: 0 }}>Drag items onto a folder to file them.</p> : null}

      {menu ? (
        <Popover anchor={menu.el} onClose={() => setMenu(null)} width={250}>
          <MenuItem icon="plus" onClick={() => { const f = menu.folder; setMenu(null); setDialog({ mode: 'create', parentId: f.id }); }}>New subfolder</MenuItem>
          <MenuItem icon="edit" onClick={() => { const f = menu.folder; setMenu(null); setDialog({ mode: 'edit', folder: f }); }}>Rename & colour</MenuItem>
          <div className="menu-label">Colour</div>
          <div style={{ padding: '2px 10px 8px' }}>
            <FolderColorPicker value={menu.folder.color} onChange={(c) => { void actions.update(menu.folder.id, { color: c }); setMenu({ ...menu, folder: { ...menu.folder, color: c } }); }} />
          </div>
          {menu.folder.parentId ? <MenuItem icon="upload" onClick={() => { const f = menu.folder; setMenu(null); void actions.update(f.id, { parentId: null }); }}>Move to top level</MenuItem> : null}
          <MenuSep />
          <MenuItem icon="trash" danger onClick={async () => {
            const f = menu.folder;
            setMenu(null);
            if (await confirm({ title: `Delete folder "${f.name}"?`, message: 'Nothing inside is deleted: its items and subfolders move up one level.', danger: true, confirmLabel: 'Delete folder' })) {
              await actions.remove(f.id);
              if (selected === f.id) onSelect(f.parentId ?? 'all');
            }
          }}>Delete folder</MenuItem>
        </Popover>
      ) : null}
      {dialog?.mode === 'create' ? (
        <FolderDialog title={dialog.parentId ? 'New subfolder' : 'New folder'} onClose={() => setDialog(null)} onSave={async (name, color) => {
          const f = await actions.create(name, color, dialog.parentId);
          if (f) onSelect(f.id);
        }} />
      ) : null}
      {dialog?.mode === 'edit' ? (
        <FolderDialog title="Rename folder" initial={{ name: dialog.folder.name, color: dialog.folder.color }} onClose={() => setDialog(null)} onSave={(name, color) => actions.update(dialog.folder.id, { name, color })} />
      ) : null}
    </nav>
  );
}

/** Menu entries for moving one entity to a folder (inside an existing Dropdown/Popover). */
export function MoveToFolderItems({ folders, current, onPick }: { folders: FolderDTO[]; current: string | null | undefined; onPick: (folderId: string | null) => void }) {
  const flat = flattenTree(buildTree(folders));
  if (!flat.length) return null;
  return (
    <>
      <div className="menu-label">Move to folder</div>
      {current ? <MenuItem icon="inbox" onClick={() => onPick(null)}>No folder</MenuItem> : null}
      {flat.map((n) => (
        <button key={n.folder.id} className={`menu-item${current === n.folder.id ? ' active' : ''}`} role="menuitem" disabled={current === n.folder.id} onClick={() => onPick(n.folder.id)} style={{ paddingLeft: 10 + n.depth * 14 }}>
          <FolderIcon color={n.folder.color} size={16} /> <span className="grow ellipsis">{n.folder.name}</span>
        </button>
      ))}
    </>
  );
}

/** Breadcrumb + subfolder tiles shown above a folder's contents. */
export function FolderHeader({ folders, selected, onSelect, counts }: { folders: FolderDTO[]; selected: FolderSelection; onSelect: (s: FolderSelection) => void; counts: Map<string, number> }) {
  if (selected === 'all' || selected === 'unfiled') return null;
  const path = folderPath(folders, selected);
  const children = folders.filter((f) => f.parentId === selected).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="row wrap small" style={{ gap: 4, marginBottom: children.length ? 10 : 0 }} aria-label="Folder path">
        <button className="btn ghost sm" onClick={() => onSelect('all')}>All</button>
        {path.map((f) => (
          <span key={f.id} className="row" style={{ gap: 4 }}>
            <Icon name="chevronRight" size={12} className="muted" />
            <button className="btn ghost sm" onClick={() => onSelect(f.id)}><FolderIcon color={f.color} size={15} /> {f.name}</button>
          </span>
        ))}
      </div>
      {children.length ? (
        <div className="folder-tiles">
          {children.map((f) => (
            <button key={f.id} className="folder-tile" onClick={() => onSelect(f.id)}>
              <FolderIcon color={f.color} size={28} />
              <span className="ellipsis" style={{ fontWeight: 600 }}>{f.name}</span>
              <span className="muted small">{counts.get(f.id) ?? 0}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Count items per folder and decide which entities are visible for a selection. */
export function useFolderFilter<T extends { folderId?: string | null }>(items: T[], folders: FolderDTO[], selected: FolderSelection) {
  return useMemo(() => {
    const ids = new Set(folders.map((f) => f.id));
    const folderOf = (i: T) => (i.folderId && ids.has(i.folderId) ? i.folderId : null);
    const byFolder = new Map<string, number>();
    for (const i of items) {
      const f = folderOf(i);
      if (f) byFolder.set(f, (byFolder.get(f) ?? 0) + 1);
    }
    const visible = items.filter((i) => (selected === 'all' ? true : selected === 'unfiled' ? !folderOf(i) : folderOf(i) === selected));
    return { visible, counts: { all: items.length, unfiled: items.filter((i) => !folderOf(i)).length, byFolder } };
  }, [items, folders, selected]);
}

/** Folder selection kept in the URL (?folder=) so it can be linked and survives reloads. */
export function useFolderSelection(): [FolderSelection, (s: FolderSelection) => void] {
  const read = () => new URLSearchParams(window.location.search).get('folder') || 'all';
  const [sel, setSel] = useState<FolderSelection>(read);
  const ref = useRef(sel);
  ref.current = sel;
  const set = (s: FolderSelection) => {
    setSel(s);
    const u = new URL(window.location.href);
    if (s === 'all') u.searchParams.delete('folder');
    else u.searchParams.set('folder', s);
    window.history.replaceState(window.history.state, '', u.toString());
  };
  return [sel, set];
}
