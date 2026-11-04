import { useMemo, useState } from 'react';
import { labelsOf } from '../../../shared/columns';
import type { ColumnDTO, ItemDTO } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { Avatar, EmptyState } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { MenuItem, MenuSep, Popover, useContextMenu } from '../../components/ui/overlays';
import { formatDate, todayISO } from '../../lib/format';
import '../../styles/views.css';

const LANE_TYPES = new Set(['status', 'priority', 'dropdown']);
const EMPTY = '__empty';

function laneColumns(columns: ColumnDTO[]) {
  return columns.filter((c) => LANE_TYPES.has(c.type) && !(c.type === 'dropdown' && c.settings.multiple !== false));
}

function laneValue(item: ItemDTO, col: ColumnDTO): string {
  const v = item.values[col.id];
  if (Array.isArray(v)) return (v[0] as string) ?? EMPTY;
  return typeof v === 'string' ? v : EMPTY;
}

export function KanbanView(props: BoardViewProps) {
  const { bundle, view, items, canEdit, actions, openItem, updateViewSettings, members } = props;
  const candidates = laneColumns(bundle.columns);
  const col = candidates.find((c) => c.id === view.settings.kanbanColumnId) ?? candidates.find((c) => c.type === 'status') ?? candidates[0];
  const [dragId, setDragId] = useState<string | null>(null);
  const [overLane, setOverLane] = useState<string | null>(null);
  const [overCard, setOverCard] = useState<string | null>(null);
  const ctxMenu = useContextMenu();

  const personCol = bundle.columns.find((c) => c.type === 'person' || c.type === 'people');
  const dateCol = bundle.columns.find((c) => c.type === 'date');
  const prioCol = bundle.columns.find((c) => c.type === 'priority' && c.id !== col?.id);

  const lanes = useMemo(() => {
    if (!col) return [];
    const labels = labelsOf(col);
    const byLane = new Map<string, ItemDTO[]>();
    for (const i of items) {
      const k = laneValue(i, col);
      const key = labels.some((l) => l.id === k) ? k : EMPTY;
      byLane.set(key, [...(byLane.get(key) ?? []), i]);
    }
    return [
      ...labels.map((l) => ({ id: l.id, label: l.label, color: l.color, items: byLane.get(l.id) ?? [] })),
      { id: EMPTY, label: 'Empty', color: '#94a3b8', items: byLane.get(EMPTY) ?? [] },
    ];
  }, [col, items]);

  if (!col) {
    return (
      <EmptyState icon="kanban" title="Kanban needs a status column" action={canEdit ? <button className="btn primary" onClick={() => actions.createColumn({ title: 'Status', type: 'status' })}>Add a status column</button> : undefined}>
        Kanban lanes come from a status, priority or single-select dropdown column.
      </EmptyState>
    );
  }

  const valueFor = (laneId: string) => (laneId === EMPTY ? null : col.type === 'dropdown' ? [laneId] : laneId);

  const moveToLane = async (itemId: string, laneId: string, beforeCardId?: string | null) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    if (laneValue(item, col) !== laneId) await actions.setValue(itemId, col.id, valueFor(laneId));
    if (beforeCardId !== undefined) {
      const lane = lanes.find((l) => l.id === laneId);
      const list = (lane?.items ?? []).filter((i) => i.id !== itemId);
      const idx = beforeCardId ? list.findIndex((i) => i.id === beforeCardId) : list.length;
      const above = idx > 0 ? list[idx - 1] : null;
      const below = idx >= 0 && idx < list.length ? list[idx] : null;
      // Reorder within the item's own group so the position is meaningful.
      if ((above && above.groupId === item.groupId) || (below && below.groupId === item.groupId)) {
        await actions.moveItem(itemId, { beforeId: above?.groupId === item.groupId ? above.id : null, afterId: below?.groupId === item.groupId ? below.id : null });
      }
    }
  };

  const onDrop = (e: React.DragEvent, laneId: string, beforeCardId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData('text/x-workos-item') || dragId;
    setDragId(null);
    setOverLane(null);
    setOverCard(null);
    if (id && canEdit) void moveToLane(id, laneId, beforeCardId);
  };

  const ctxItem = ctxMenu.menu ? items.find((i) => i.id === ctxMenu.menu!.data) : null;

  return (
    <>
      <div className="view-header">
        <label className="label" htmlFor="kanban-col">Lanes from</label>
        <select id="kanban-col" className="select sm" value={col.id} onChange={(e) => updateViewSettings({ kanbanColumnId: e.target.value })}>
          {candidates.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <span className="muted small">{items.length} item{items.length === 1 ? '' : 's'}</span>
      </div>
      <div className="kanban" role="list" aria-label={`Kanban by ${col.title}`}>
        {lanes.map((lane) => (
          <section
            key={lane.id}
            className={`lane${overLane === lane.id ? ' drop-target' : ''}`}
            role="listitem"
            aria-label={`${lane.label}, ${lane.items.length} items`}
            onDragOver={(e) => { if (canEdit && dragId) { e.preventDefault(); setOverLane(lane.id); } }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverLane(null); }}
            onDrop={(e) => onDrop(e, lane.id, null)}
          >
            <div className="lane-head" style={{ borderTopColor: lane.color }}>
              <span className="icon-dot" style={{ background: lane.color }} /> <span className="ellipsis">{lane.label}</span>
              <span className="lane-count">{lane.items.length}</span>
            </div>
            <div className="lane-body">
              {lane.items.map((item) => {
                const people = personCol ? ([] as string[]).concat((item.values[personCol.id] as any) ?? []).filter(Boolean) : [];
                const due = dateCol ? (item.values[dateCol.id] as string | undefined) : undefined;
                const prio = prioCol ? labelsOf(prioCol).find((l) => l.id === item.values[prioCol.id]) : undefined;
                const overdue = due && due.slice(0, 10) < todayISO() && !item.completedAt;
                return (
                  <article
                    key={item.id}
                    className={`kcard${dragId === item.id ? ' dragging' : ''}${overCard === item.id ? ' drop-before' : ''}`}
                    draggable={canEdit}
                    tabIndex={0}
                    aria-label={item.name}
                    onDragStart={(e) => { e.dataTransfer.setData('text/x-workos-item', item.id); e.dataTransfer.effectAllowed = 'move'; setDragId(item.id); }}
                    onDragEnd={() => { setDragId(null); setOverLane(null); setOverCard(null); }}
                    onDragOver={(e) => { if (canEdit && dragId && dragId !== item.id) { e.preventDefault(); e.stopPropagation(); setOverLane(lane.id); setOverCard(item.id); } }}
                    onDrop={(e) => onDrop(e, lane.id, item.id)}
                    onClick={() => openItem(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') openItem(item.id);
                      if ((e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) && canEdit) {
                        e.preventDefault();
                        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        ctxMenu.open({ preventDefault() {}, clientX: r.left + 20, clientY: r.top + 20 } as any, item.id);
                      }
                    }}
                    onContextMenu={(e) => canEdit && ctxMenu.open(e, item.id)}
                  >
                    <div className="row" style={{ alignItems: 'flex-start' }}>
                      <span className="kname grow">{item.name}</span>
                      {canEdit ? (
                        <button className="btn ghost icon sm" aria-label={`Actions for ${item.name}`} onClick={(e) => { e.stopPropagation(); ctxMenu.open(e as any, item.id); }}>
                          <Icon name="more" />
                        </button>
                      ) : null}
                    </div>
                    <div className="kmeta">
                      {people.length ? (
                        <span className="avatar-stack">
                          {people.slice(0, 3).map((id) => {
                            const m = members.find((x) => x.id === id);
                            return <Avatar key={id} id={id} name={m?.name ?? 'Former member'} url={m?.avatarUrl} size="sm" />;
                          })}
                        </span>
                      ) : null}
                      {due ? <span className={overdue ? 'danger-text' : ''}><Icon name="calendar" size={12} /> {formatDate(due)}</span> : null}
                      {prio ? <span className="pill kpill" style={{ background: prio.color }}>{prio.label}</span> : null}
                      {item.subitemCount ? <span title="Subitems"><Icon name="subitem" size={12} /> {item.subitemCount}</span> : null}
                      {item.updateCount ? <span title="Updates"><Icon name="message" size={12} /> {item.updateCount}</span> : null}
                    </div>
                  </article>
                );
              })}
              {canEdit ? <LaneAdd onAdd={(name) => actions.createItem({ name, values: { [col.id]: valueFor(lane.id) } })} label={lane.label} /> : null}
            </div>
          </section>
        ))}
      </div>
      {ctxMenu.menu && ctxItem ? (
        <Popover point={{ x: ctxMenu.menu.x, y: ctxMenu.menu.y }} onClose={ctxMenu.close}>
          <MenuItem icon="eye" onClick={() => { ctxMenu.close(); openItem(ctxItem.id); }}>Open item</MenuItem>
          <MenuSep />
          <div className="menu-label">Move to lane</div>
          {lanes.map((l) => (
            <MenuItem key={l.id} active={laneValue(ctxItem, col) === l.id} onClick={() => { ctxMenu.close(); void moveToLane(ctxItem.id, l.id); }}>
              <span className="row"><span className="icon-dot" style={{ background: l.color }} /> {l.label}</span>
            </MenuItem>
          ))}
          <MenuSep />
          <MenuItem icon="copy" onClick={() => { ctxMenu.close(); void actions.duplicateItem(ctxItem.id); }}>Duplicate</MenuItem>
          <MenuItem icon="archive" onClick={() => { ctxMenu.close(); void actions.archiveItem(ctxItem.id); }}>Archive</MenuItem>
        </Popover>
      ) : null}
    </>
  );
}

function LaneAdd({ onAdd, label }: { onAdd: (name: string) => void; label: string }) {
  const [name, setName] = useState('');
  return (
    <div className="lane-add">
      <input
        placeholder="+ Add item"
        aria-label={`Add item to ${label}`}
        value={name}
        maxLength={500}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) {
            onAdd(name.trim());
            setName('');
          }
          if (e.key === 'Escape') setName('');
        }}
      />
    </div>
  );
}
