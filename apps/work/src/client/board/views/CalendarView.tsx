import { useMemo, useState } from 'react';
import { labelsOf } from '../../../shared/columns';
import { addDays, addMonths, diffDays, startOfMonth, startOfWeek } from '../../../shared/dates';
import type { ColumnDTO, ItemDTO } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { EmptyState } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { todayISO } from '../../lib/format';
import '../../styles/views.css';

type Mode = 'month' | 'week' | 'day';
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function rangeOf(item: ItemDTO, col: ColumnDTO): [string, string] | null {
  const v = item.values[col.id];
  if (col.type === 'date') return typeof v === 'string' ? [v.slice(0, 10), v.slice(0, 10)] : null;
  if (v && typeof v === 'object' && 'start' in (v as any)) return [(v as any).start, (v as any).end];
  return null;
}

export function CalendarView(props: BoardViewProps) {
  const { bundle, view, items, canEdit, actions, openItem, updateViewSettings } = props;
  const dateCols = bundle.columns.filter((c) => c.type === 'date' || c.type === 'timeline');
  const col = dateCols.find((c) => c.id === view.settings.calendarColumnId) ?? dateCols.find((c) => c.type === 'date') ?? dateCols[0];
  const mode: Mode = (view.settings.calendarMode as Mode) ?? 'month';
  const today = todayISO();
  const [cursor, setCursor] = useState(today);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const statusCol = bundle.columns.find((c) => c.type === 'status');
  const colorOf = (i: ItemDTO) => {
    if (!statusCol) return 'var(--accent-fill)';
    return labelsOf(statusCol).find((l) => l.id === i.values[statusCol.id])?.color ?? 'var(--accent-fill)';
  };

  const days = useMemo(() => {
    if (mode === 'day') return [cursor];
    if (mode === 'week') {
      const s = startOfWeek(cursor);
      return Array.from({ length: 7 }, (_, i) => addDays(s, i));
    }
    const first = startOfWeek(startOfMonth(cursor));
    const last = addDays(startOfMonth(addMonths(startOfMonth(cursor), 1)), -1);
    const n = Math.ceil((diffDays(first, last) + 1) / 7) * 7;
    return Array.from({ length: n }, (_, i) => addDays(first, i));
  }, [cursor, mode]);

  const byDay = useMemo(() => {
    const m = new Map<string, ItemDTO[]>();
    if (!col) return m;
    const lo = days[0];
    const hi = days[days.length - 1];
    for (const it of items) {
      const r = rangeOf(it, col);
      if (!r || r[1] < lo || r[0] > hi) continue;
      let d = r[0] < lo ? lo : r[0];
      const end = r[1] > hi ? hi : r[1];
      let guard = 0;
      while (d <= end && guard++ < 400) {
        m.set(d, [...(m.get(d) ?? []), it]);
        d = addDays(d, 1);
      }
    }
    return m;
  }, [items, col, days]);

  if (!col) {
    return (
      <EmptyState icon="calendar" title="Calendar needs a date column" action={canEdit ? <button className="btn primary" onClick={() => actions.createColumn({ title: 'Due date', type: 'date' })}>Add a date column</button> : undefined}>
        Items are placed on the calendar using a date or timeline column.
      </EmptyState>
    );
  }

  const undated = items.filter((i) => !rangeOf(i, col));

  const moveTo = (itemId: string, day: string) => {
    const it = items.find((i) => i.id === itemId);
    if (!it) return;
    const r = rangeOf(it, col);
    if (col.type === 'date') {
      const cur = it.values[col.id] as string | undefined;
      const time = cur && cur.length > 10 ? cur.slice(10) : '';
      if (cur?.slice(0, 10) !== day) void actions.setValue(itemId, col.id, day + time);
    } else {
      const delta = r ? diffDays(r[0], day) : 0;
      if (!r) void actions.setValue(itemId, col.id, { start: day, end: day });
      else if (delta) void actions.setValue(itemId, col.id, { start: addDays(r[0], delta), end: addDays(r[1], delta) });
    }
  };

  const step = (dir: number) => setCursor(mode === 'month' ? addMonths(startOfMonth(cursor), dir) : addDays(cursor, dir * (mode === 'week' ? 7 : 1)));
  const title =
    mode === 'month'
      ? new Date(cursor + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })
      : mode === 'week'
        ? `${new Date(days[0] + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })} – ${new Date(days[6] + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}`
        : new Date(cursor + 'T00:00:00Z').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

  const create = async (day: string) => {
    const name = newName.trim();
    setAdding(null);
    setNewName('');
    if (!name) return;
    await actions.createItem({ name, values: { [col.id]: col.type === 'date' ? day : { start: day, end: day } } });
  };

  const event = (it: ItemDTO, day: string) => {
    const r = rangeOf(it, col)!;
    const isStart = r[0] === day || day === days[0] || (mode !== 'day' && new Date(day + 'T00:00:00Z').getUTCDay() === 1);
    return (
      <div
        key={it.id + day}
        className={`cal-event${isStart ? '' : ' span-mid'}`}
        style={{ background: colorOf(it) }}
        draggable={canEdit}
        tabIndex={0}
        role="button"
        title={it.name}
        aria-label={`${it.name}, ${r[0] === r[1] ? r[0] : `${r[0]} to ${r[1]}`}`}
        onDragStart={(e) => { e.dataTransfer.setData('text/x-workos-item', it.id); setDragId(it.id); }}
        onDragEnd={() => { setDragId(null); setOver(null); }}
        onClick={(e) => { e.stopPropagation(); openItem(it.id); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') openItem(it.id);
          // Keyboard rescheduling: Alt+Arrow moves by a day / week.
          if (canEdit && e.altKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            const d = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' ? -7 : 7;
            moveTo(it.id, addDays(r[0], d));
          }
        }}
      >
        {isStart ? it.name : ' '}
      </div>
    );
  };

  const cell = (day: string, limit: number) => {
    const list = byDay.get(day) ?? [];
    const other = mode === 'month' && day.slice(0, 7) !== cursor.slice(0, 7);
    return (
      <div
        key={day}
        className={`cal-cell${other ? ' other' : ''}${day === today ? ' today' : ''}${over === day ? ' drop-target' : ''}`}
        onDragOver={(e) => { if (canEdit && dragId) { e.preventDefault(); setOver(day); } }}
        onDragLeave={() => setOver((o) => (o === day ? null : o))}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData('text/x-workos-item') || dragId;
          setOver(null);
          setDragId(null);
          if (id && canEdit) moveTo(id, day);
        }}
        onDoubleClick={() => canEdit && setAdding(day)}
      >
        <div className="row" style={{ gap: 4 }}>
          <span className="cal-day">{Number(day.slice(8))}</span>
          {canEdit ? (
            <button className="btn ghost icon sm cal-add" aria-label={`Add item on ${day}`} onClick={() => setAdding(day)}>
              <Icon name="plus" size={12} />
            </button>
          ) : null}
        </div>
        {list.slice(0, limit).map((it) => event(it, day))}
        {list.length > limit ? (
          <button className="cal-more btn ghost sm" onClick={() => { setCursor(day); updateViewSettings({ calendarMode: 'day' }); }}>
            +{list.length - limit} more
          </button>
        ) : null}
        {adding === day ? (
          <input
            className="input sm"
            autoFocus
            placeholder="Item name"
            aria-label={`New item on ${day}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => create(day)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') create(day);
              if (e.key === 'Escape') { setAdding(null); setNewName(''); }
            }}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className="cal">
      <div className="cal-toolbar">
        <button className="btn sm" onClick={() => setCursor(today)}>Today</button>
        <button className="btn ghost icon sm" aria-label="Previous" onClick={() => step(-1)}><Icon name="chevronLeft" /></button>
        <button className="btn ghost icon sm" aria-label="Next" onClick={() => step(1)}><Icon name="chevronRight" /></button>
        <h2>{title}</h2>
        <span className="spacer" />
        {dateCols.length > 1 ? (
          <select className="select sm" style={{ width: 'auto' }} aria-label="Date column" value={col.id} onChange={(e) => updateViewSettings({ calendarColumnId: e.target.value })}>
            {dateCols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        ) : null}
        <div className="seg" role="group" aria-label="Calendar mode">
          {(['month', 'week', 'day'] as Mode[]).map((m) => (
            <button key={m} className={mode === m ? 'on' : ''} aria-pressed={mode === m} onClick={() => updateViewSettings({ calendarMode: m })}>
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {mode === 'day' ? (
        <div className="cal-day-list" onDragOver={(e) => canEdit && dragId && e.preventDefault()} onDrop={(e) => { const id = e.dataTransfer.getData('text/x-workos-item'); if (id && canEdit) moveTo(id, cursor); }}>
          {(byDay.get(cursor) ?? []).map((it) => event(it, cursor))}
          {(byDay.get(cursor) ?? []).length === 0 ? <div className="muted small">Nothing scheduled.</div> : null}
          {canEdit ? (
            adding === cursor ? (
              <input className="input sm" autoFocus placeholder="Item name" aria-label="New item" value={newName} onChange={(e) => setNewName(e.target.value)} onBlur={() => create(cursor)} onKeyDown={(e) => e.key === 'Enter' && create(cursor)} />
            ) : (
              <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => setAdding(cursor)}><Icon name="plus" /> Add item</button>
            )
          ) : null}
        </div>
      ) : (
        <div className={`cal-grid${mode === 'week' ? ' cal-week' : ''}`} role="grid" aria-label={title}>
          {DOW.map((d) => <div key={d} className="cal-dow" role="columnheader">{d}</div>)}
          {days.map((d) => cell(d, mode === 'week' ? 50 : 4))}
        </div>
      )}
      {undated.length ? (
        <div className="cal-undated card card-pad">
          <h3 style={{ marginBottom: 8 }}>No {col.title.toLowerCase()} ({undated.length})</h3>
          <div className="row wrap" style={{ gap: 6 }}>
            {undated.slice(0, 40).map((it) => (
              <button
                key={it.id}
                className="badge"
                draggable={canEdit}
                onDragStart={(e) => { e.dataTransfer.setData('text/x-workos-item', it.id); setDragId(it.id); }}
                onDragEnd={() => setDragId(null)}
                onClick={() => openItem(it.id)}
                style={{ cursor: 'pointer', border: 0 }}
              >
                {it.name}
              </button>
            ))}
          </div>
          {canEdit ? <p className="muted small" style={{ marginTop: 6 }}>Drag an item onto a day to schedule it.</p> : null}
        </div>
      ) : null}
    </div>
  );
}
