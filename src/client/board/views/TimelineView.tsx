import { useMemo, useRef, useState } from 'react';
import { labelsOf, doneLabelIds } from '../../../shared/columns';
import { addDays, diffDays, parseIsoDate } from '../../../shared/dates';
import type { ColumnDTO, ItemDTO } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { EmptyState } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { todayISO } from '../../lib/format';
import '../../styles/views.css';

type Zoom = 'day' | 'week' | 'month';
const PX: Record<Zoom, number> = { day: 36, week: 16, month: 5 };
const ROW = 36;
const HEAD = 44;

interface Range { start: string; end: string }

function rangeOf(item: ItemDTO, col: ColumnDTO): Range | null {
  const v = item.values[col.id] as any;
  return v && typeof v === 'object' && v.start && v.end ? { start: v.start, end: v.end } : null;
}

type Drag = { id: string; mode: 'move' | 'l' | 'r'; x0: number; orig: Range; cur: Range; moved: boolean };

export function TimelineView(props: BoardViewProps) {
  const { bundle, view, items, canEdit, actions, openItem, updateViewSettings } = props;
  const tlCols = bundle.columns.filter((c) => c.type === 'timeline');
  const col = tlCols.find((c) => c.id === view.settings.timelineColumnId) ?? tlCols[0];
  const zoom: Zoom = (view.settings.timelineZoom as Zoom) ?? 'week';
  const px = PX[zoom];
  const today = todayISO();
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);

  const progressCol = bundle.columns.find((c) => c.type === 'progress');
  const depCol = bundle.columns.find((c) => c.type === 'dependency');
  const statusCols = bundle.columns.filter((c) => c.type === 'status');
  const statusCol = statusCols[0];

  const rangeFor = (it: ItemDTO): Range | null => (drag && drag.id === it.id ? drag.cur : col ? rangeOf(it, col) : null);

  const { start, totalDays } = useMemo(() => {
    let lo = addDays(today, -7);
    let hi = addDays(today, 30);
    if (col) {
      for (const it of items) {
        const r = rangeOf(it, col);
        if (!r) continue;
        if (r.start < lo) lo = r.start;
        if (r.end > hi) hi = r.end;
      }
    }
    lo = addDays(lo, -7);
    hi = addDays(hi, 21);
    return { start: lo, totalDays: Math.min(1500, diffDays(lo, hi) + 1) };
  }, [items, col, today]);

  if (!col) {
    return (
      <EmptyState icon="timeline" title="Timeline needs a timeline column" action={canEdit ? <button className="btn primary" onClick={async () => { const c = await actions.createColumn({ title: 'Timeline', type: 'timeline' }); if (c) updateViewSettings({ timelineColumnId: c.id }); }}>Add a timeline column</button> : undefined}>
        The Gantt chart plots each item between its start and end dates.
      </EmptyState>
    );
  }

  const x = (d: string) => diffDays(start, d) * px;

  // Rows grouped by board group (respecting group order).
  const rows: ({ kind: 'group'; id: string; name: string; color: string } | { kind: 'item'; item: ItemDTO })[] = [];
  for (const g of bundle.groups) {
    const gi = items.filter((i) => i.groupId === g.id && rangeOf(i, col));
    if (!gi.length) continue;
    rows.push({ kind: 'group', id: g.id, name: g.name, color: g.color });
    gi.forEach((item) => rows.push({ kind: 'item', item }));
  }
  const rowIndex = new Map<string, number>();
  rows.forEach((r, i) => r.kind === 'item' && rowIndex.set(r.item.id, i));
  const undated = items.filter((i) => !rangeOf(i, col));

  const progressOf = (it: ItemDTO): number => {
    if (statusCol && doneLabelIds(statusCol).includes(it.values[statusCol.id] as string)) return 100;
    if (progressCol && typeof it.values[progressCol.id] === 'number') return it.values[progressCol.id] as number;
    return 0;
  };
  const colorOf = (it: ItemDTO) => (statusCol ? labelsOf(statusCol).find((l) => l.id === it.values[statusCol.id])?.color : undefined) ?? 'var(--accent)';

  const onPointerDown = (e: React.PointerEvent, it: ItemDTO, mode: Drag['mode']) => {
    if (!canEdit) return;
    const r = rangeOf(it, col);
    if (!r) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const d: Drag = { id: it.id, mode, x0: e.clientX, orig: r, cur: r, moved: false };
    dragRef.current = d;
    setDrag(d);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const delta = Math.round((e.clientX - d.x0) / px);
    let cur: Range;
    if (d.mode === 'move') cur = { start: addDays(d.orig.start, delta), end: addDays(d.orig.end, delta) };
    else if (d.mode === 'l') cur = { start: addDays(d.orig.start, delta) > d.orig.end ? d.orig.end : addDays(d.orig.start, delta), end: d.orig.end };
    else cur = { start: d.orig.start, end: addDays(d.orig.end, delta) < d.orig.start ? d.orig.start : addDays(d.orig.end, delta) };
    const nd = { ...d, cur, moved: d.moved || Math.abs(e.clientX - d.x0) > 3 };
    dragRef.current = nd;
    setDrag(nd);
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!d) return;
    if (!d.moved) return openItem(d.id);
    if (d.cur.start !== d.orig.start || d.cur.end !== d.orig.end) void actions.setValue(d.id, col.id, d.cur);
  };

  const onBarKey = (e: React.KeyboardEvent, it: ItemDTO) => {
    if (e.key === 'Enter') return openItem(it.id);
    if (!canEdit) return;
    const r = rangeOf(it, col);
    if (!r) return;
    const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
    if (!step) return;
    e.preventDefault();
    // Arrow: move; Shift+Arrow: resize end.
    const next = e.shiftKey ? { start: r.start, end: addDays(r.end, step) < r.start ? r.start : addDays(r.end, step) } : { start: addDays(r.start, step), end: addDays(r.end, step) };
    void actions.setValue(it.id, col.id, next);
  };

  // Scale ticks.
  const ticks: { left: number; label: string; major: boolean; width: number }[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = addDays(start, i);
    const date = new Date(parseIsoDate(d));
    const dom = date.getUTCDate();
    const dow = (date.getUTCDay() + 6) % 7;
    if (zoom === 'day') ticks.push({ left: i * px, width: px, label: `${dom}`, major: dom === 1 });
    else if (zoom === 'week' && dow === 0) ticks.push({ left: i * px, width: 7 * px, label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }), major: dom <= 7 });
    else if (zoom === 'month' && dom === 1) ticks.push({ left: i * px, width: 30 * px, label: date.toLocaleDateString(undefined, { month: 'short', year: '2-digit', timeZone: 'UTC' }), major: date.getUTCMonth() === 0 });
  }
  const width = totalDays * px;
  const height = rows.length * ROW;

  // Dependency arrows.
  const arrows: { d: string; bad: boolean; key: string }[] = [];
  if (depCol) {
    for (const r of rows) {
      if (r.kind !== 'item') continue;
      const deps = r.item.values[depCol.id];
      if (!Array.isArray(deps)) continue;
      const me = rangeFor(r.item);
      if (!me) continue;
      for (const depId of deps as string[]) {
        const di = rowIndex.get(depId);
        if (di === undefined) continue;
        const depItem = (rows[di] as { item: ItemDTO }).item;
        const dr = rangeFor(depItem);
        if (!dr) continue;
        const x1 = x(dr.end) + px;
        const y1 = di * ROW + ROW / 2;
        const x2 = x(me.start);
        const y2 = (rowIndex.get(r.item.id) ?? 0) * ROW + ROW / 2;
        const mid = Math.max(x1 + 8, x2 - 8);
        arrows.push({ key: `${depId}-${r.item.id}`, bad: me.start <= dr.end, d: `M${x1},${y1} H${mid} V${y2} H${x2 - 2} m-5,-4 l5,4 l-5,4` });
      }
    }
  }

  return (
    <div className="gantt-wrap">
      <div className="view-header" style={{ padding: '0 0 10px' }}>
        {tlCols.length > 1 ? (
          <select className="select sm" aria-label="Timeline column" value={col.id} onChange={(e) => updateViewSettings({ timelineColumnId: e.target.value })}>
            {tlCols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        ) : null}
        <div className="seg" role="group" aria-label="Zoom">
          {(['day', 'week', 'month'] as Zoom[]).map((z) => (
            <button key={z} className={zoom === z ? 'on' : ''} aria-pressed={zoom === z} onClick={() => updateViewSettings({ timelineZoom: z })}>{z[0].toUpperCase() + z.slice(1)}</button>
          ))}
        </div>
        <span className="muted small">{canEdit ? 'Drag bars to reschedule, drag edges to resize. Keyboard: ←/→ move, Shift+←/→ resize.' : 'Read-only'}</span>
      </div>
      {rows.length === 0 ? (
        <div className="card card-pad muted">No items have {col.title.toLowerCase()} dates yet.</div>
      ) : (
        <div className="gantt-scroll" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          <div className="gantt" style={{ gridTemplateColumns: `260px ${width}px` }}>
            <div className="gantt-left">
              <div className="gantt-row gantt-head" style={{ height: HEAD }}><strong>Item</strong></div>
              {rows.map((r) =>
                r.kind === 'group' ? (
                  <div key={'g' + r.id} className="gantt-row group"><span className="icon-dot" style={{ background: r.color }} /> <span className="ellipsis">{r.name}</span></div>
                ) : (
                  <div key={r.item.id} className="gantt-row">
                    <button className="btn ghost sm ellipsis" style={{ justifyContent: 'flex-start', maxWidth: '100%' }} onClick={() => openItem(r.item.id)}>{r.item.name}</button>
                  </div>
                ),
              )}
            </div>
            <div className="gantt-canvas" style={{ width }}>
              <div className="gantt-head" style={{ height: HEAD }}>
                <div className="gantt-scale">
                  {ticks.map((t) => <span key={t.left} className={t.major ? 'major' : ''} style={{ left: t.left, width: t.width }}>{t.label}</span>)}
                </div>
              </div>
              <div style={{ position: 'relative', height }}>
                {zoom === 'day'
                  ? Array.from({ length: totalDays }, (_, i) => {
                      const d = addDays(start, i);
                      const dow = new Date(parseIsoDate(d)).getUTCDay();
                      return dow === 0 || dow === 6 ? <div key={d} className="gantt-day weekend" style={{ left: i * px, width: px }} /> : null;
                    })
                  : null}
                {today >= start ? <div className="gantt-today" style={{ left: x(today) + px / 2 }} title="Today" /> : null}
                {rows.map((r, i) => {
                  if (r.kind === 'group') return <div key={'gl' + r.id} className="gantt-lane group" style={{ position: 'absolute', top: i * ROW, left: 0, right: 0 }} />;
                  const rg = rangeFor(r.item)!;
                  const left = x(rg.start);
                  const w = (diffDays(rg.start, rg.end) + 1) * px;
                  const milestone = rg.start === rg.end;
                  return (
                    <div key={'l' + r.item.id} className="gantt-lane" style={{ position: 'absolute', top: i * ROW, left: 0, right: 0 }}>
                      {milestone ? (
                        <div
                          className="gantt-milestone"
                          role="button"
                          tabIndex={0}
                          aria-label={`Milestone ${r.item.name} on ${rg.start}`}
                          title={`${r.item.name} · ${rg.start}`}
                          style={{ left: left + px / 2 - 8, top: 10, cursor: canEdit ? 'grab' : 'pointer' }}
                          onPointerDown={(e) => onPointerDown(e, r.item, 'move')}
                          onClick={() => !canEdit && openItem(r.item.id)}
                          onKeyDown={(e) => onBarKey(e, r.item)}
                        />
                      ) : (
                        <div
                          className={`gantt-bar${canEdit ? '' : ' readonly'}${drag?.id === r.item.id ? ' dragging' : ''}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`${r.item.name}: ${rg.start} to ${rg.end}`}
                          title={`${r.item.name} · ${rg.start} → ${rg.end}`}
                          style={{ left, width: Math.max(w, 8), top: 7, background: colorOf(r.item) }}
                          onPointerDown={(e) => onPointerDown(e, r.item, 'move')}
                          onClick={() => !canEdit && openItem(r.item.id)}
                          onKeyDown={(e) => onBarKey(e, r.item)}
                        >
                          <span className="fill" style={{ width: `${progressOf(r.item)}%` }} />
                          {canEdit ? <span className="handle l" onPointerDown={(e) => onPointerDown(e, r.item, 'l')} /> : null}
                          <span style={{ position: 'relative', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w > 60 ? r.item.name : ''}</span>
                          {canEdit ? <span className="handle r" onPointerDown={(e) => onPointerDown(e, r.item, 'r')} /> : null}
                        </div>
                      )}
                      {w <= 60 && !milestone ? <span className="small muted" style={{ position: 'absolute', left: left + Math.max(w, 8) + 6, top: 9, whiteSpace: 'nowrap' }}>{r.item.name}</span> : null}
                      {milestone ? <span className="small muted" style={{ position: 'absolute', left: left + px / 2 + 14, top: 9, whiteSpace: 'nowrap' }}>{r.item.name}</span> : null}
                    </div>
                  );
                })}
                {arrows.length ? (
                  <svg className="gantt-arrows" width={width} height={height} aria-hidden>
                    {arrows.map((a) => <path key={a.key} d={a.d} className={a.bad ? 'bad' : ''} />)}
                  </svg>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
      {undated.length ? (
        <div className="card card-pad" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Without dates ({undated.length})</h3>
          <div className="list">
            {undated.slice(0, 50).map((it) => (
              <div key={it.id} className="list-row">
                <button className="btn ghost sm grow ellipsis" style={{ justifyContent: 'flex-start' }} onClick={() => openItem(it.id)}>{it.name}</button>
                {canEdit ? (
                  <button className="btn sm" onClick={() => actions.setValue(it.id, col.id, { start: today, end: addDays(today, 2) })}>
                    <Icon name="calendar" /> Set dates
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
