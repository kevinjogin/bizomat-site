import { formatScaled, sumScaled } from '../../shared/money';
import { Fragment, useMemo, useRef, useState } from 'react';
import { getColumnType, labelsOf, PALETTE } from '../../shared/columns';
import { positionBetween } from '../../shared/items';
import type { ColumnDTO, GroupDTO, ItemDTO } from '../../shared/types';
import { Icon } from '../components/ui/Icon';
import { ColorSwatches } from '../components/ui/ui';
import { MenuItem, MenuSep, Popover, useConfirm, useContextMenu, useToast } from '../components/ui/overlays';
import { Cell, type CellCtx } from './cells/Cell';
import type { BoardViewProps } from './types';
import { ColumnDialog } from './ColumnDialog';
import { BASE } from '../lib/base';
import { GroupDescriptionPreview, GroupInfoPanel, groupFigures } from './GroupDescription';
import { CriticalBadge, TaskKey, useScheduleIndex } from './controls/schedule';

interface Section {
  key: string;
  title: string;
  color: string;
  group?: GroupDTO; // set when grouping by board groups
  items: ItemDTO[];
  presetValues?: Record<string, unknown>;
}

const NAME_W = 320;

export function TableView(props: BoardViewProps) {
  const { bundle, view, items, allItems, columns, actions, canEdit, members } = props;
  const toast = useToast();
  const confirm = useConfirm();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [drag, setDrag] = useState<{ id: string; over?: { id: string; where: 'before' | 'after' } | { group: string } } | null>(null);
  const [colDialog, setColDialog] = useState<{ column?: ColumnDTO } | null>(null);
  const ctxMenu = useContextMenu();
  const isAdmin = props.access === 'admin';
  const groupBy = view.settings.groupBy && view.settings.groupBy !== 'group' ? bundle.columns.find((c) => c.id === view.settings.groupBy) : undefined;
  const sorted = !!view.settings.sort?.length;
  const widths = view.settings.columnWidths ?? {};

  const ctx: CellCtx = useMemo(() => ({ members, items: allItems, boardId: bundle.board.id, memberName: props.memberName, onUploaded: () => actions.refresh(), toast }), [members, allItems, bundle.board.id, props.memberName, actions, toast]);

  const sections: Section[] = useMemo(() => {
    if (!groupBy) {
      return bundle.groups.map((g) => ({ key: g.id, title: g.name, color: g.color, group: g, items: items.filter((i) => i.groupId === g.id) }));
    }
    if (groupBy.type === 'person') {
      const out: Section[] = members.map((m, i) => ({ key: m.id, title: m.name, color: PALETTE[i % PALETTE.length], items: items.filter((it) => it.values[groupBy.id] === m.id), presetValues: { [groupBy.id]: m.id } }));
      out.push({ key: '__none', title: 'Unassigned', color: '#94a3b8', items: items.filter((it) => !it.values[groupBy.id]), presetValues: {} });
      return out.filter((s) => s.items.length || s.key === '__none');
    }
    const labels = labelsOf(groupBy);
    const valueOf = (it: ItemDTO) => {
      const v = it.values[groupBy.id];
      return Array.isArray(v) ? v[0] : v;
    };
    const out: Section[] = labels.map((l) => ({ key: l.id, title: l.label, color: l.color, items: items.filter((it) => valueOf(it) === l.id), presetValues: { [groupBy.id]: groupBy.type === 'dropdown' ? [l.id] : l.id } }));
    out.push({ key: '__none', title: 'Empty', color: '#94a3b8', items: items.filter((it) => !valueOf(it)), presetValues: {} });
    return out;
  }, [groupBy, bundle.groups, items, members]);

  const subitemsOf = (id: string) => allItems.filter((i) => i.parentItemId === id).sort((a, b) => a.position - b.position);
  const toggle = (set: Set<string>, id: string) => {
    const n = new Set(set);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  };

  // ------------------------------------------------------------ drag & drop
  const onRowDragOver = (e: React.DragEvent, it: ItemDTO) => {
    if (!drag || drag.id === it.id) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const where = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    if (!drag.over || !('id' in drag.over) || drag.over.id !== it.id || drag.over.where !== where) setDrag({ ...drag, over: { id: it.id, where } });
  };
  const drop = async (section: Section) => {
    if (!drag) return;
    const draggedId = drag.id;
    const over = drag.over;
    setDrag(null);
    const item = allItems.find((i) => i.id === draggedId);
    if (!item) return;
    if (groupBy) {
      if (section.key === '__none') await actions.setValue(draggedId, groupBy.id, null);
      else await actions.setValue(draggedId, groupBy.id, section.presetValues?.[groupBy.id]);
      return;
    }
    const list = section.items.filter((i) => i.id !== draggedId);
    let beforeId: string | null = null;
    let afterId: string | null = null;
    if (over && 'id' in over && !sorted) {
      const idx = list.findIndex((i) => i.id === over.id);
      if (over.where === 'before') {
        beforeId = list[idx - 1]?.id ?? null;
        afterId = list[idx]?.id ?? null;
      } else {
        beforeId = list[idx]?.id ?? null;
        afterId = list[idx + 1]?.id ?? null;
      }
    }
    if (section.group!.id === item.groupId && !beforeId && !afterId) return;
    await actions.moveItem(draggedId, { groupId: section.group!.id, beforeId, afterId });
  };

  // -------------------------------------------------------- column resizing
  const startResize = (e: React.PointerEvent, col: ColumnDTO) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = widths[col.id] ?? col.width;
    const th = (e.currentTarget as HTMLElement).closest('th') as HTMLElement;
    const move = (ev: PointerEvent) => {
      const w = Math.max(70, Math.min(600, startW + ev.clientX - startX));
      th.style.width = `${w}px`;
      document.querySelectorAll<HTMLElement>(`[data-col="${col.id}"]`).forEach((el) => (el.style.width = `${w}px`));
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const w = Math.max(70, Math.min(600, startW + ev.clientX - startX));
      if (canEdit) void actions.updateColumn(col.id, { width: Math.round(w) });
      else props.updateViewSettings({ columnWidths: { ...widths, [col.id]: Math.round(w) } });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const [colDrag, setColDrag] = useState<string | null>(null);
  const dropColumn = (target: ColumnDTO) => {
    if (!colDrag || colDrag === target.id) return setColDrag(null);
    const list = bundle.columns.filter((c) => c.id !== colDrag);
    const idx = list.findIndex((c) => c.id === target.id);
    const pos = positionBetween(list[idx - 1]?.position ?? null, list[idx].position);
    void actions.updateColumn(colDrag, { position: pos });
    setColDrag(null);
  };

  const colWidth = (c: ColumnDTO) => widths[c.id] ?? c.width;
  const totalCols = columns.length + 3;

  if (!bundle.groups.length && !groupBy) {
    return (
      <div className="empty">
        <h3>This board has no groups</h3>
        {canEdit ? <button className="btn primary" onClick={() => actions.createGroup('New group')}>Add a group</button> : null}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      {sections.map((section) => (
        <GroupSection
          key={section.key}
          section={section}
          props={props}
          columns={columns}
          colWidth={colWidth}
          ctx={ctx}
          selected={selected}
          setSelected={setSelected}
          expanded={expanded}
          toggleExpanded={(id) => setExpanded((s) => toggle(s, id))}
          subitemsOf={subitemsOf}
          drag={drag}
          setDrag={setDrag}
          onRowDragOver={onRowDragOver}
          onDrop={() => drop(section)}
          onContextMenu={ctxMenu.open}
          totalCols={totalCols}
          header={
            <tr>
              <th className="group-bar" style={{ background: section.color }} />
              <th className="select-cell sticky-col" style={{ left: 0 }}>
                <input
                  type="checkbox"
                  aria-label={`Select all in ${section.title}`}
                  checked={section.items.length > 0 && section.items.every((i) => selected.has(i.id))}
                  onChange={(e) => {
                    const n = new Set(selected);
                    section.items.forEach((i) => (e.target.checked ? n.add(i.id) : n.delete(i.id)));
                    setSelected(n);
                  }}
                />
              </th>
              <th className="sticky-col" style={{ width: NAME_W, left: 34, textAlign: 'left' }}>
                <div className="th-inner" style={{ justifyContent: 'flex-start' }}>Item</div>
              </th>
              {columns.map((c) => (
                <ColumnHeader
                  key={c.id}
                  col={c}
                  width={colWidth(c)}
                  isAdmin={isAdmin}
                  props={props}
                  onEdit={() => setColDialog({ column: c })}
                  onResize={(e) => startResize(e, c)}
                  draggable={isAdmin}
                  onDragStart={() => setColDrag(c.id)}
                  onDrop={() => dropColumn(c)}
                  onDelete={async () => {
                    if (await confirm({ title: `Delete column "${c.title}"?`, message: 'All values in this column will be permanently removed from every item.', danger: true, confirmLabel: 'Delete column' })) await actions.deleteColumn(c.id);
                  }}
                />
              ))}
              <th style={{ width: 44 }}>
                {isAdmin ? (
                  <button className="btn ghost icon sm" aria-label="Add column" title="Add column" onClick={() => setColDialog({})}>
                    <Icon name="plus" />
                  </button>
                ) : null}
              </th>
            </tr>
          }
        />
      ))}
      {canEdit && !groupBy ? (
        <button className="btn" onClick={() => actions.createGroup('New group', 'bottom')}>
          <Icon name="plus" /> Add new group
        </button>
      ) : null}

      {selected.size > 0 ? <BulkBar props={props} selected={selected} clear={() => setSelected(new Set())} /> : null}
      {colDialog ? (
        <ColumnDialog
          column={colDialog.column}
          columns={bundle.columns}
          onClose={() => setColDialog(null)}
          onSave={async (input) => {
            if (colDialog.column) {
              const c = colDialog.column;
              const patch: Record<string, unknown> = {};
              if (input.title !== c.title) patch.title = input.title;
              if (input.type !== c.type) patch.type = input.type;
              if (input.settings !== undefined && JSON.stringify(input.settings) !== JSON.stringify(c.settings)) patch.settings = input.settings;
              if (input.required !== c.required) patch.required = input.required;
              if (input.description !== c.description) patch.description = input.description;
              if (!Object.keys(patch).length) return true;
              return actions.updateColumn(c.id, patch);
            }
            return !!(await actions.createColumn({ title: input.title, type: input.type, settings: input.settings }));
          }}
        />
      ) : null}
      {ctxMenu.menu ? (
        <Popover point={ctxMenu.menu} onClose={ctxMenu.close}>
          <ItemMenu item={ctxMenu.menu.data as ItemDTO} props={props} close={ctxMenu.close} onAddSubitem={(id) => setExpanded((s) => new Set(s).add(id))} />
        </Popover>
      ) : null}
    </div>
  );
}

function GroupSection(p: {
  section: Section;
  props: BoardViewProps;
  columns: ColumnDTO[];
  colWidth: (c: ColumnDTO) => number;
  ctx: CellCtx;
  selected: Set<string>;
  setSelected: (s: Set<string>) => void;
  expanded: Set<string>;
  toggleExpanded: (id: string) => void;
  subitemsOf: (id: string) => ItemDTO[];
  drag: { id: string; over?: any } | null;
  setDrag: (d: any) => void;
  onRowDragOver: (e: React.DragEvent, it: ItemDTO) => void;
  onDrop: () => void;
  onContextMenu: (e: React.MouseEvent, data: any) => void;
  header: React.ReactNode;
  totalCols: number;
}) {
  const { section, props, columns, ctx, selected } = p;
  const { actions, canEdit } = props;
  const collapsed = section.group?.collapsed ?? false;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const confirm = useConfirm();
  const [name, setName] = useState(section.title);
  const [editingName, setEditingName] = useState(false);
  const [dropHover, setDropHover] = useState(false);
  // Group description: the details panel (from the name, the information icon or the menu) and the preview line.
  const [info, setInfo] = useState<null | 'view' | 'edit'>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const nameRef = useRef<HTMLButtonElement>(null);
  const description = section.group?.description ?? '';
  const startRename = () => { setName(section.title); setEditingName(true); };
  return (
    <section className="group-block" aria-label={`Group ${section.title}`}>
      <div className="group-head">
        <button className="btn ghost icon sm" aria-label={collapsed ? 'Expand group' : 'Collapse group'} aria-expanded={!collapsed} onClick={() => section.group && actions.updateGroup(section.group.id, { collapsed: !collapsed })} disabled={!section.group} style={{ color: section.color }}>
          <Icon name={collapsed ? 'chevronRight' : 'chevronDown'} />
        </button>
        {editingName && section.group ? (
          <input
            className="input sm"
            style={{ width: 260, color: section.color, fontWeight: 700 }}
            autoFocus
            value={name}
            aria-label="Group name"
            onChange={(e) => setName(e.target.value)}
            onBlur={() => { setEditingName(false); if (name.trim() && name !== section.title) actions.updateGroup(section.group!.id, { name: name.trim() }); }}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') { setName(section.title); setEditingName(false); } }}
          />
        ) : (
          <button
            ref={nameRef}
            className="group-name"
            style={{ color: section.color }}
            // With a description (or without edit access) the name opens the group's details; otherwise it renames, as before.
            onClick={() => { if (!section.group) return; if (description || !canEdit) setInfo('view'); else startRename(); }}
            disabled={!section.group}
            aria-haspopup={description || !canEdit ? 'dialog' : undefined}
            title={description || !canEdit ? 'Show group details' : 'Rename group'}
          >
            {section.title}
          </button>
        )}
        {section.group && description && !editingName ? (
          <button className="btn ghost icon sm group-info" aria-label={`About ${section.title}`} title="Group description" aria-haspopup="dialog" aria-expanded={!!info} onClick={() => setInfo('view')}>
            <Icon name="info" size={14} />
          </button>
        ) : null}
        <span className="muted small">{section.items.length} item{section.items.length === 1 ? '' : 's'}</span>
        {canEdit && section.group ? (
          <>
            <button ref={menuRef} className="btn ghost icon sm" aria-label="Group actions" onClick={() => setMenuOpen(true)}><Icon name="more" /></button>
            {menuOpen ? (
              <Popover anchor={menuRef} onClose={() => setMenuOpen(false)} width={230}>
                <MenuItem icon="plus" onClick={() => { setMenuOpen(false); actions.createItem({ name: 'New item', groupId: section.group!.id, position: 'top' }); }}>Add item at top</MenuItem>
                <MenuItem icon="edit" onClick={() => { setMenuOpen(false); setEditingName(true); }}>Rename group</MenuItem>
                <MenuItem icon="info" onClick={() => { setMenuOpen(false); setInfo('edit'); }}>{description ? 'Edit description' : 'Add description'}</MenuItem>
                <div style={{ padding: '6px 10px' }}><ColorSwatches value={section.color} onChange={(c) => actions.updateGroup(section.group!.id, { color: c })} /></div>
                <MenuItem icon="chevronDown" onClick={() => { setMenuOpen(false); moveGroup(props, section.group!, 1); }}>Move down</MenuItem>
                <MenuItem icon="chevronRight" onClick={() => { setMenuOpen(false); moveGroup(props, section.group!, -1); }}>Move up</MenuItem>
                <MenuItem icon="copy" onClick={() => { setMenuOpen(false); actions.duplicateGroup(section.group!.id); }}>Duplicate group</MenuItem>
                <MenuSep />
                <MenuItem icon="archive" onClick={async () => { setMenuOpen(false); if (await confirm({ title: `Archive "${section.title}"?`, message: 'The group and its items move to the archive and can be restored later.' })) actions.archiveGroup(section.group!.id); }}>Archive group</MenuItem>
                <MenuItem icon="trash" danger onClick={async () => { setMenuOpen(false); if (await confirm({ title: `Delete "${section.title}"?`, message: `This permanently deletes the group and its ${section.items.length} item(s).`, danger: true, confirmLabel: 'Delete group', typeToConfirm: section.items.length > 5 ? section.title : undefined })) actions.deleteGroup(section.group!.id); }}>Delete group</MenuItem>
              </Popover>
            ) : null}
          </>
        ) : null}
        {info && section.group ? (
          <GroupInfoPanel
            group={section.group}
            figures={groupFigures(props.bundle, props.allItems, section.group.id)}
            anchor={nameRef}
            canEdit={canEdit}
            startEditing={info === 'edit'}
            onSave={(d) => actions.updateGroup(section.group!.id, { description: d })}
            onRename={canEdit ? startRename : undefined}
            onClose={() => setInfo(null)}
          />
        ) : null}
      </div>
      {section.group && description && !collapsed ? (
        <GroupDescriptionPreview text={description} groupName={section.title} open={previewOpen} onToggle={() => setPreviewOpen((o) => !o)} />
      ) : null}
      {!collapsed ? (
        <table className="grid-table" style={{ width: 'max-content' }} onDragOver={(e) => { if (p.drag) { e.preventDefault(); setDropHover(true); } }} onDragLeave={() => setDropHover(false)} onDrop={(e) => { e.preventDefault(); setDropHover(false); p.onDrop(); }}>
          <colgroup>
            <col style={{ width: 6 }} />
            <col style={{ width: 34 }} />
            <col style={{ width: NAME_W }} />
            {columns.map((c) => <col key={c.id} data-col={c.id} style={{ width: p.colWidth(c) }} />)}
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>{p.header}</thead>
          <tbody>
            {section.items.map((it) => {
              const subs = p.subitemsOf(it.id);
              const open = p.expanded.has(it.id);
              const over = p.drag?.over && 'id' in p.drag.over && p.drag.over.id === it.id ? p.drag.over.where : null;
              return (
                <Fragment key={it.id}>
                  <tr
                    className={`${selected.has(it.id) ? 'selected' : ''}${p.drag?.id === it.id ? ' dragging' : ''}${over === 'before' ? ' drop-before' : over === 'after' ? ' drop-after' : ''}`}
                    draggable={canEdit && !it.id.startsWith('tmp-')}
                    onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', it.id); p.setDrag({ id: it.id }); }}
                    onDragEnd={() => p.setDrag(null)}
                    onDragOver={(e) => p.onRowDragOver(e, it)}
                    onContextMenu={(e) => p.onContextMenu(e, it)}
                  >
                    <td className="group-bar" style={{ background: section.color }} />
                    <td className="select-cell sticky-col" style={{ left: 0 }}>
                      <input type="checkbox" aria-label={`Select ${it.name}`} checked={selected.has(it.id)} onChange={() => { const n = new Set(selected); if (n.has(it.id)) n.delete(it.id); else n.add(it.id); p.setSelected(n); }} />
                    </td>
                    <td className="sticky-col" style={{ left: 34 }}>
                      <NameCell item={it} props={props} subCount={subs.length} open={open} toggle={() => p.toggleExpanded(it.id)} />
                    </td>
                    {columns.map((c) => (
                      <td key={c.id}>
                        <Cell column={c} item={it} value={it.values[c.id]} ctx={ctx} canEdit={canEdit && !it.id.startsWith('tmp-')} onChange={(v) => actions.setValue(it.id, c.id, v)} />
                      </td>
                    ))}
                    <td />
                  </tr>
                  {open ? (
                    <>
                      {subs.map((s) => (
                        <tr key={s.id} className="subitem-row" onContextMenu={(e) => p.onContextMenu(e, s)}>
                          <td className="group-bar" style={{ background: section.color, opacity: 0.4 }} />
                          <td className="select-cell sticky-col" style={{ left: 0 }} />
                          <td className="sticky-col" style={{ left: 34 }}>
                            <NameCell item={s} props={props} subCount={0} open={false} toggle={() => {}} isSub />
                          </td>
                          {columns.map((c) => (
                            <td key={c.id}>
                              <Cell column={c} item={s} value={s.values[c.id]} ctx={ctx} canEdit={canEdit && !s.id.startsWith('tmp-')} onChange={(v) => actions.setValue(s.id, c.id, v)} />
                            </td>
                          ))}
                          <td />
                        </tr>
                      ))}
                      {canEdit ? <AddRow totalCols={p.totalCols} placeholder="+ Add subitem" indent onAdd={(name) => actions.createItem({ name, parentItemId: it.id })} color={section.color} /> : null}
                    </>
                  ) : null}
                </Fragment>
              );
            })}
            {canEdit ? (
              <AddRow
                totalCols={p.totalCols}
                placeholder="+ Add item"
                color={section.color}
                onAdd={(name) => actions.createItem({ name, groupId: section.group?.id, values: section.presetValues })}
              />
            ) : null}
            {section.items.length === 0 && dropHover ? (
              <tr><td colSpan={p.totalCols} style={{ textAlign: 'center', color: 'var(--accent)' }}>Drop here</td></tr>
            ) : null}
            <SummaryRow items={section.items} columns={columns} color={section.color} />
          </tbody>
        </table>
      ) : (
        <div className="muted small" style={{ paddingLeft: 40 }} onDragOver={(e) => p.drag && e.preventDefault()} onDrop={(e) => { e.preventDefault(); p.onDrop(); }}>
          {section.items.length} hidden item(s) — drop here to move
        </div>
      )}
    </section>
  );
}

function moveGroup(props: BoardViewProps, g: GroupDTO, dir: number) {
  const gs = props.bundle.groups;
  const i = gs.findIndex((x) => x.id === g.id);
  const j = i + dir;
  if (j < 0 || j >= gs.length) return;
  const pos = dir > 0 ? positionBetween(gs[j].position, gs[j + 1]?.position ?? null) : positionBetween(gs[j - 1]?.position ?? null, gs[j].position);
  void props.actions.updateGroup(g.id, { position: pos });
}

function NameCell({ item, props, subCount, open, toggle, isSub }: { item: ItemDTO; props: BoardViewProps; subCount: number; open: boolean; toggle: () => void; isSub?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const criticality = useScheduleIndex().byItem.get(item.id)?.criticality;
  const save = () => {
    setEditing(false);
    const n = name.trim();
    if (n && n !== item.name) void props.actions.updateItem(item.id, { name: n });
    else setName(item.name);
  };
  return (
    <div className="name-cell" style={isSub ? { paddingLeft: 34 } : undefined}>
      {props.canEdit && !isSub ? <span className="drag-handle" aria-hidden><Icon name="drag" size={14} /></span> : null}
      {!isSub ? (
        <button className="btn ghost icon sm" style={{ width: 22, visibility: subCount || props.canEdit ? 'visible' : 'hidden' }} aria-label={open ? 'Hide subitems' : 'Show subitems'} aria-expanded={open} onClick={toggle} title={`${subCount} subitem(s)`}>
          <Icon name={open ? 'chevronDown' : 'chevronRight'} size={14} />
        </button>
      ) : <Icon name="subitem" size={14} className="muted" />}
      {!editing ? <TaskKey value={item.key} /> : null}
      {editing ? (
        <input className="input sm grow" autoFocus value={name} aria-label="Item name" onChange={(e) => setName(e.target.value)} onBlur={save} onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setName(item.name); setEditing(false); } }} maxLength={500} />
      ) : (
        <span
          className="name-text"
          tabIndex={0}
          role="button"
          onDoubleClick={() => props.canEdit && setEditing(true)}
          onClick={() => props.openItem(item.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') props.openItem(item.id);
            if (e.key === 'F2' && props.canEdit) setEditing(true);
          }}
          title="Click to open, double-click to rename"
        >
          {item.name}
        </span>
      )}
      <CriticalBadge criticality={criticality} compact />
      {subCount ? <span className="badge" title="Subitems">{subCount}</span> : null}
      {item.updateCount ? <span className="badge accent" title="Updates"><Icon name="message" size={11} /> {item.updateCount}</span> : null}
      <button className="btn ghost icon sm open-btn" aria-label={`Open ${item.name}`} onClick={() => props.openItem(item.id)}><Icon name="chevronRight" size={14} /></button>
    </div>
  );
}

function AddRow({ totalCols, placeholder, onAdd, indent, color }: { totalCols: number; placeholder: string; onAdd: (name: string) => void; indent?: boolean; color: string }) {
  const [v, setV] = useState('');
  return (
    <tr className="add-row">
      <td className="group-bar" style={{ background: color, opacity: 0.4 }} />
      <td className="sticky-col" style={{ left: 0 }} />
      <td className="sticky-col" style={{ left: 34 }}>
        <input
          placeholder={placeholder}
          aria-label={placeholder.replace('+ ', '')}
          value={v}
          style={indent ? { paddingLeft: 42 } : undefined}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && v.trim()) {
              onAdd(v.trim());
              setV('');
            }
            if (e.key === 'Escape') setV('');
          }}
          onBlur={() => {
            if (v.trim()) {
              onAdd(v.trim());
              setV('');
            }
          }}
          maxLength={500}
        />
      </td>
      <td colSpan={totalCols - 2} />
    </tr>
  );
}

function SummaryRow({ items, columns, color }: { items: ItemDTO[]; columns: ColumnDTO[]; color: string }) {
  if (!items.length) return null;
  return (
    <tr className="summary-row">
      <td className="group-bar" style={{ background: 'transparent' }} />
      <td className="sticky-col" style={{ left: 0 }} />
      <td className="sticky-col" style={{ left: 34 }} />
      {columns.map((c) => (
        <td key={c.id}>
          <ColumnSummary col={c} items={items} color={color} />
        </td>
      ))}
      <td />
    </tr>
  );
}

function ColumnSummary({ col, items }: { col: ColumnDTO; items: ItemDTO[]; color: string }) {
  if (col.type === 'status' || col.type === 'priority') {
    const labels = labelsOf(col);
    const counts = labels.map((l) => ({ l, n: items.filter((i) => i.values[col.id] === l.id).length }));
    const empty = items.length - counts.reduce((s, c) => s + c.n, 0);
    return (
      <div className="stacked-bar" title={counts.map((c) => `${c.l.label}: ${c.n}`).join(', ')}>
        {counts.filter((c) => c.n).map((c) => <span key={c.l.id} style={{ width: `${(c.n / items.length) * 100}%`, background: c.l.color }} />)}
        {empty ? <span style={{ width: `${(empty / items.length) * 100}%`, background: 'var(--border-strong)' }} /> : null}
      </div>
    );
  }
  const nums = items.map((i) => i.values[col.id]).filter((v): v is number => typeof v === 'number');
  if (col.type === 'currency' && nums.length) {
    // Integer arithmetic for money (src/shared/money.ts): no floating-point drift in group subtotals.
    const { total } = sumScaled(nums);
    return <span title={`Sum of ${nums.length} amount${nums.length === 1 ? '' : 's'}`}>{formatScaled(total, col.settings.currency ?? null)}</span>;
  }
  if (['number', 'currency', 'percentage', 'rating', 'formula'].includes(col.type) && nums.length) {
    const sum = nums.reduce((a, b) => a + b, 0);
    const show = col.type === 'percentage' || col.type === 'rating' ? sum / nums.length : sum;
    return <span title={col.type === 'percentage' || col.type === 'rating' ? 'Average' : 'Sum'}>{getColumnType(col.type === 'formula' ? 'number' : col.type).toText(Math.round(show * 100) / 100, col.settings)}</span>;
  }
  if (col.type === 'progress' && nums.length) return <span>{Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)}% avg</span>;
  if (col.type === 'checkbox') return <span>{items.filter((i) => i.values[col.id]).length}/{items.length}</span>;
  if (col.type === 'date') {
    const ds = items.map((i) => i.values[col.id]).filter((v): v is string => typeof v === 'string').sort();
    return ds.length ? <span>{ds[0].slice(5)} – {ds[ds.length - 1].slice(5)}</span> : null;
  }
  return null;
}

function ColumnHeader({ col, width, isAdmin, props, onEdit, onResize, onDelete, draggable, onDragStart, onDrop }: { col: ColumnDTO; width: number; isAdmin: boolean; props: BoardViewProps; onEdit: () => void; onResize: (e: React.PointerEvent) => void; onDelete: () => void; draggable: boolean; onDragStart: () => void; onDrop: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const sort = props.view.settings.sort ?? [];
  const current = sort.find((s) => s.field === col.id);
  return (
    <th style={{ width }} draggable={draggable} onDragStart={(e) => { e.dataTransfer.setData('text/column', col.id); onDragStart(); }} onDragOver={(e) => draggable && e.preventDefault()} onDrop={(e) => { e.preventDefault(); onDrop(); }} title={col.description || col.title}>
      <div className="th-inner">
        <span className="ellipsis">{col.title}{col.required ? ' *' : ''}</span>
        {current ? <Icon name="sort" size={12} /> : null}
        <button ref={ref} className="btn ghost icon sm" style={{ width: 20, height: 20 }} aria-label={`Column ${col.title} options`} onClick={() => setOpen(true)}><Icon name="chevronDown" size={12} /></button>
        <span className="resize-handle" onPointerDown={onResize} role="separator" aria-label={`Resize ${col.title}`} />
      </div>
      {open ? (
        <Popover anchor={ref} onClose={() => setOpen(false)} width={220}>
          <div className="menu-label">{getColumnType(col.type).label}</div>
          <MenuItem icon="sort" onClick={() => { setOpen(false); props.updateViewSettings({ sort: [{ field: col.id, dir: 'asc' }] }); }}>Sort ascending</MenuItem>
          <MenuItem icon="sort" onClick={() => { setOpen(false); props.updateViewSettings({ sort: [{ field: col.id, dir: 'desc' }] }); }}>Sort descending</MenuItem>
          {current ? <MenuItem icon="x" onClick={() => { setOpen(false); props.updateViewSettings({ sort: sort.filter((s) => s.field !== col.id) }); }}>Clear sort</MenuItem> : null}
          <MenuItem icon="eyeOff" onClick={() => { setOpen(false); props.updateViewSettings({ hiddenColumns: [...(props.view.settings.hiddenColumns ?? []), col.id] }); }}>Hide in this view</MenuItem>
          {['status', 'priority', 'person', 'dropdown'].includes(col.type) ? <MenuItem icon="group" onClick={() => { setOpen(false); props.updateViewSettings({ groupBy: col.id }); }}>Group by this column</MenuItem> : null}
          {isAdmin ? (
            <>
              <MenuSep />
              <MenuItem icon="settings" onClick={() => { setOpen(false); onEdit(); }}>Settings & type</MenuItem>
              <MenuItem icon="trash" danger onClick={() => { setOpen(false); onDelete(); }}>Delete column</MenuItem>
            </>
          ) : null}
        </Popover>
      ) : null}
    </th>
  );
}

export function ItemMenu({ item, props, close, onAddSubitem }: { item: ItemDTO; props: BoardViewProps; close: () => void; onAddSubitem?: (id: string) => void }) {
  const confirm = useConfirm();
  const toast = useToast();
  const { actions, canEdit, bundle } = props;
  return (
    <>
      <MenuItem icon="chevronRight" onClick={() => { close(); props.openItem(item.id); }}>Open item</MenuItem>
      <MenuItem icon="link" onClick={() => { close(); navigator.clipboard?.writeText(`${location.origin}${BASE}/w/${bundle.board.workspaceId}/boards/${bundle.board.id}?item=${item.id}`).then(() => toast('Link copied')); }}>Copy link</MenuItem>
      {canEdit ? (
        <>
          {!item.parentItemId ? <MenuItem icon="subitem" onClick={() => { close(); onAddSubitem?.(item.id); actions.createItem({ name: 'New subitem', parentItemId: item.id }); }}>Add subitem</MenuItem> : null}
          <MenuItem icon="copy" onClick={() => { close(); actions.duplicateItem(item.id); }}>Duplicate</MenuItem>
          {!item.parentItemId ? (
            <>
              <div className="menu-label">Move to group</div>
              {bundle.groups.filter((g) => g.id !== item.groupId).map((g) => (
                <MenuItem key={g.id} onClick={() => { close(); actions.moveItem(item.id, { groupId: g.id }); }}>
                  <span className="row"><span className="icon-dot" style={{ background: g.color }} />{g.name}</span>
                </MenuItem>
              ))}
            </>
          ) : null}
          <MenuSep />
          <MenuItem icon="archive" onClick={() => { close(); actions.archiveItem(item.id); toast('Item archived'); }}>Archive</MenuItem>
          <MenuItem icon="trash" danger onClick={async () => { close(); if (await confirm({ title: `Delete "${item.name}"?`, message: 'The item, its subitems, updates and files will be permanently deleted.', danger: true, confirmLabel: 'Delete' })) actions.deleteItem(item.id); }}>Delete</MenuItem>
        </>
      ) : null}
    </>
  );
}

function BulkBar({ props, selected, clear }: { props: BoardViewProps; selected: Set<string>; clear: () => void }) {
  const { actions, bundle, canEdit } = props;
  const confirm = useConfirm();
  const [menu, setMenu] = useState<null | 'move' | 'set'>(null);
  const moveRef = useRef<HTMLButtonElement>(null);
  const setRef = useRef<HTMLButtonElement>(null);
  const ids = Array.from(selected);
  const statusCol = bundle.columns.find((c) => c.type === 'status');
  const personCol = bundle.columns.find((c) => c.type === 'person');
  if (!canEdit) return (
    <div className="bulk-bar"><strong>{ids.length} selected</strong><button className="btn ghost sm" onClick={clear}>Clear</button></div>
  );
  return (
    <div className="bulk-bar" role="region" aria-label="Bulk actions">
      <strong>{ids.length} selected</strong>
      <button ref={setRef} className="btn sm" onClick={() => setMenu('set')}>Set value</button>
      <button ref={moveRef} className="btn sm" onClick={() => setMenu('move')}>Move to</button>
      <button className="btn sm" onClick={async () => { await actions.bulk(ids, 'duplicate'); clear(); }}><Icon name="copy" /> Duplicate</button>
      <button className="btn sm" onClick={async () => { await actions.bulk(ids, 'archive'); clear(); }}><Icon name="archive" /> Archive</button>
      <button className="btn sm danger" onClick={async () => { if (await confirm({ title: `Delete ${ids.length} items?`, message: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' })) { await actions.bulk(ids, 'delete'); clear(); } }}><Icon name="trash" /> Delete</button>
      <button className="btn ghost icon sm" aria-label="Clear selection" onClick={clear}><Icon name="x" /></button>
      {menu === 'move' ? (
        <Popover anchor={moveRef} onClose={() => setMenu(null)}>
          {bundle.groups.map((g) => <MenuItem key={g.id} onClick={async () => { setMenu(null); await actions.bulk(ids, 'move', { groupId: g.id }); clear(); }}>{g.name}</MenuItem>)}
        </Popover>
      ) : null}
      {menu === 'set' ? (
        <Popover anchor={setRef} onClose={() => setMenu(null)} width={240}>
          {statusCol ? (
            <>
              <div className="menu-label">{statusCol.title}</div>
              {labelsOf(statusCol).map((l) => <MenuItem key={l.id} onClick={async () => { setMenu(null); await actions.bulk(ids, 'set_value', { columnId: statusCol.id, value: l.id }); }}><span className="row"><span className="icon-dot" style={{ background: l.color }} />{l.label}</span></MenuItem>)}
            </>
          ) : null}
          {personCol ? (
            <>
              <div className="menu-label">{personCol.title}</div>
              {props.members.map((m) => <MenuItem key={m.id} onClick={async () => { setMenu(null); await actions.bulk(ids, 'set_value', { columnId: personCol.id, value: m.id }); }}>{m.name}</MenuItem>)}
            </>
          ) : null}
        </Popover>
      ) : null}
    </div>
  );
}
