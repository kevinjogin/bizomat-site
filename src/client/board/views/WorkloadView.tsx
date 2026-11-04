import { useMemo, useState } from 'react';
import { addDays, startOfWeek } from '../../../shared/dates';
import { isItemDone } from '../../../shared/filters';
import type { ColumnDTO, ItemDTO } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { Avatar, EmptyState } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { MenuItem, MenuSep, Popover } from '../../components/ui/overlays';
import { todayISO } from '../../lib/format';
import '../../styles/views.css';

const UNASSIGNED = '__unassigned';
const NUMERIC = new Set(['number', 'currency', 'percentage', 'rating', 'progress', 'formula']);

function datesOf(item: ItemDTO, dateCol: ColumnDTO | undefined): [string, string] | null {
  if (!dateCol) return null;
  const v = item.values[dateCol.id] as any;
  if (dateCol.type === 'date') return typeof v === 'string' ? [v.slice(0, 10), v.slice(0, 10)] : null;
  return v && v.start ? [v.start, v.end] : null;
}

export function WorkloadView(props: BoardViewProps) {
  const { bundle, view, items, canEdit, actions, openItem, updateViewSettings, members } = props;
  const personCols = bundle.columns.filter((c) => c.type === 'person' || c.type === 'people');
  const personCol = personCols.find((c) => c.id === view.settings.workloadPersonColumnId) ?? personCols[0];
  const numericCols = bundle.columns.filter((c) => NUMERIC.has(c.type));
  const effortCol = numericCols.find((c) => c.id === view.settings.workloadEffortColumnId);
  const dateCols = bundle.columns.filter((c) => c.type === 'date' || c.type === 'timeline');
  const dateCol = dateCols.find((c) => c.id === view.settings.workloadDateColumnId) ?? dateCols.find((c) => c.type === 'timeline') ?? dateCols[0];
  const capacity = Number(view.settings.workloadCapacity ?? (effortCol ? 40 : 5)) || (effortCol ? 40 : 5);
  const [weekStart, setWeekStart] = useState(startOfWeek(todayISO()));
  const [dragging, setDragging] = useState<{ itemId: string; from: string } | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ el: HTMLElement; itemId: string; from: string } | null>(null);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = days[6];
  const today = todayISO();

  const open = useMemo(() => items.filter((i) => !isItemDone(i, bundle.columns)), [items, bundle.columns]);
  const effortOf = (i: ItemDTO) => (effortCol ? (typeof i.values[effortCol.id] === 'number' ? (i.values[effortCol.id] as number) : 0) : 1);

  const rows = useMemo(() => {
    if (!personCol) return [];
    const map = new Map<string, ItemDTO[]>();
    for (const m of members) map.set(m.id, []);
    map.set(UNASSIGNED, []);
    for (const it of open) {
      const v = it.values[personCol.id];
      const ids = Array.isArray(v) ? (v as string[]) : typeof v === 'string' ? [v] : [];
      if (!ids.length) map.get(UNASSIGNED)!.push(it);
      for (const id of ids) map.set(id, [...(map.get(id) ?? []), it]);
    }
    return Array.from(map.entries())
      .map(([id, list]) => ({ id, list }))
      .filter((r) => r.id === UNASSIGNED || r.list.length || members.some((m) => m.id === r.id));
  }, [open, personCol, members]);

  if (!personCol) {
    return (
      <EmptyState icon="workload" title="Workload needs a person column" action={canEdit ? <button className="btn primary" onClick={() => actions.createColumn({ title: 'Owner', type: 'person' })}>Add a person column</button> : undefined}>
        Workload shows how much open work each person has.
      </EmptyState>
    );
  }

  const reassign = (itemId: string, from: string, to: string) => {
    if (from === to) return;
    const it = items.find((i) => i.id === itemId);
    if (!it) return;
    if (personCol.type === 'person') {
      void actions.setValue(itemId, personCol.id, to === UNASSIGNED ? null : to);
    } else {
      const cur = Array.isArray(it.values[personCol.id]) ? (it.values[personCol.id] as string[]) : [];
      let next = cur.filter((x) => x !== from);
      if (to !== UNASSIGNED && !next.includes(to)) next = [...next, to];
      void actions.setValue(itemId, personCol.id, next.length ? next : null);
    }
  };

  const nameOf = (id: string) => (id === UNASSIGNED ? 'Unassigned' : members.find((m) => m.id === id)?.name ?? 'Former member');

  const chip = (it: ItemDTO, from: string) => (
    <button
      key={it.id + from}
      className="wl-chip"
      draggable={canEdit}
      title={it.name}
      aria-label={`${it.name}${canEdit ? ', press Enter to reassign' : ''}`}
      onDragStart={(e) => { e.dataTransfer.setData('text/x-workos-item', it.id); setDragging({ itemId: it.id, from }); }}
      onDragEnd={() => { setDragging(null); setOver(null); }}
      onClick={(e) => (canEdit ? setMenu({ el: e.currentTarget, itemId: it.id, from }) : openItem(it.id))}
    >
      <span>{it.name}</span>
      {effortCol && typeof it.values[effortCol.id] === 'number' ? <strong>{it.values[effortCol.id] as number}</strong> : null}
    </button>
  );

  return (
    <div className="workload">
      <div className="row wrap" style={{ marginBottom: 12 }}>
        <button className="btn ghost icon sm" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}><Icon name="chevronLeft" /></button>
        <button className="btn sm" onClick={() => setWeekStart(startOfWeek(today))}>This week</button>
        <button className="btn ghost icon sm" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}><Icon name="chevronRight" /></button>
        <strong>{weekStart} → {weekEnd}</strong>
        <span className="spacer" />
        {personCols.length > 1 ? (
          <select className="select sm" style={{ width: 'auto' }} aria-label="Person column" value={personCol.id} onChange={(e) => updateViewSettings({ workloadPersonColumnId: e.target.value })}>
            {personCols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        ) : null}
        <select className="select sm" style={{ width: 'auto' }} aria-label="Effort measure" value={effortCol?.id ?? ''} onChange={(e) => updateViewSettings({ workloadEffortColumnId: e.target.value || undefined })}>
          <option value="">Effort: item count</option>
          {numericCols.map((c) => <option key={c.id} value={c.id}>Effort: {c.title}</option>)}
        </select>
        <label className="row small">
          Capacity / week
          <input className="input sm" type="number" min={1} style={{ width: 70 }} aria-label="Weekly capacity" defaultValue={capacity} onBlur={(e) => { const n = Number(e.target.value); if (n > 0 && n !== capacity) updateViewSettings({ workloadCapacity: n }); }} />
        </label>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="wl-table">
          <thead>
            <tr>
              <th>Person</th>
              {days.map((d) => <th key={d} style={d === today ? { color: 'var(--accent)' } : undefined}>{new Date(d + 'T00:00:00Z').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', timeZone: 'UTC' })}</th>)}
              <th>No date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ id, list }) => {
              const inWeek = list.filter((i) => {
                const r = datesOf(i, dateCol);
                return r && r[1] >= weekStart && r[0] <= weekEnd;
              });
              const load = inWeek.reduce((s, i) => s + effortOf(i), 0);
              const pct = Math.min(100, Math.round((load / capacity) * 100));
              const overloaded = load > capacity;
              const m = members.find((x) => x.id === id);
              return (
                <tr
                  key={id}
                  className={over === id ? 'drop-target' : ''}
                  onDragOver={(e) => { if (canEdit && dragging) { e.preventDefault(); setOver(id); } }}
                  onDrop={(e) => { e.preventDefault(); setOver(null); if (dragging && canEdit) reassign(dragging.itemId, dragging.from, id); setDragging(null); }}
                >
                  <td>
                    <div className="wl-person">
                      {m ? <Avatar id={m.id} name={m.name} url={m.avatarUrl} size="sm" /> : <Icon name="user" />}
                      <div className="grow">
                        <div className="ellipsis" style={{ fontWeight: 600 }}>{nameOf(id)}</div>
                        <div className={`small ${overloaded ? 'danger-text' : 'muted'}`}>{load} / {capacity} {effortCol ? effortCol.title.toLowerCase() : 'items'}{overloaded ? ' · over capacity' : ''} · {list.length} open</div>
                        <div className={`wl-load${overloaded ? ' over' : ''}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${nameOf(id)} load`}><span style={{ width: `${pct}%` }} /></div>
                      </div>
                    </div>
                  </td>
                  {days.map((d) => {
                    const dayItems = list.filter((i) => {
                      const r = datesOf(i, dateCol);
                      return r && r[0] <= d && r[1] >= d;
                    });
                    const dayLoad = dayItems.reduce((s, i) => s + effortOf(i), 0);
                    const dayOver = dayLoad > capacity / 5;
                    return (
                      <td key={d} className="wl-day">
                        {dayItems.length ? <div className={`wl-day-count${dayOver ? ' over' : ''}`}>{dayLoad}</div> : null}
                        {dayItems.slice(0, 4).map((it) => chip(it, id))}
                        {dayItems.length > 4 ? <div className="muted small">+{dayItems.length - 4}</div> : null}
                      </td>
                    );
                  })}
                  <td className="wl-day">
                    {list.filter((i) => !datesOf(i, dateCol)).slice(0, 6).map((it) => chip(it, id))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!dateCol ? <p className="muted small" style={{ marginTop: 8 }}>Add a date or timeline column to spread work across the week.</p> : null}
      {menu ? (
        <Popover anchor={menu.el} onClose={() => setMenu(null)}>
          <MenuItem icon="eye" onClick={() => { const id = menu.itemId; setMenu(null); openItem(id); }}>Open item</MenuItem>
          <MenuSep />
          <div className="menu-label">Reassign to</div>
          {[...members.map((m) => m.id), UNASSIGNED].filter((id) => id !== menu.from).map((id) => (
            <MenuItem key={id} icon="user" onClick={() => { const mm = menu; setMenu(null); reassign(mm.itemId, mm.from, id); }}>{nameOf(id)}</MenuItem>
          ))}
        </Popover>
      ) : null}
    </div>
  );
}
