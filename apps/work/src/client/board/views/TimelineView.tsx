import { useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { labelsOf, doneLabelIds } from '../../../shared/columns';
import { addDays, diffDays, parseIsoDate } from '../../../shared/dates';
import { formatLink, type LinkDTO, type TaskScheduleDTO } from '../../../shared/schedule';
import type { ColumnDTO, ItemDTO } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { EmptyState } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { del, errorMessage, get, post } from '../../lib/api';
import { todayISO } from '../../lib/format';
import { CriticalBadge, TaskKey, fmtDays, invalidateControls, useScheduleIndex } from '../controls/schedule';
import '../../styles/views.css';
import '../../styles/controls.css';

type Zoom = 'day' | 'week' | 'month' | 'quarter';
const PX: Record<Zoom, number> = { day: 36, week: 16, month: 5, quarter: 1.8 };
const ROW = 36;
const HEAD = 44;
const COLS_W = 790;

interface Range { start: string; end: string }

function rangeOf(item: ItemDTO, col: ColumnDTO): Range | null {
  const v = item.values[col.id] as any;
  return v && typeof v === 'object' && v.start && v.end ? { start: v.start, end: v.end } : null;
}

type Drag = { id: string; mode: 'move' | 'l' | 'r'; x0: number; orig: Range; cur: Range; moved: boolean };
type Row = { kind: 'group'; id: string; name: string; color: string } | { kind: 'item'; item: ItemDTO; depth: number; hasKids: boolean };

export function TimelineView(props: BoardViewProps) {
  const { bundle, view, items, allItems, canEdit, actions, openItem, updateViewSettings, memberName } = props;
  const { data: sched, byItem } = useScheduleIndex();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const tlCols = bundle.columns.filter((c) => c.type === 'timeline');
  const col = tlCols.find((c) => c.id === view.settings.timelineColumnId) ?? tlCols.find((c) => c.id === sched?.settings.timelineColumnId) ?? tlCols[0];
  const zoom: Zoom = (view.settings.timelineZoom as Zoom) ?? 'week';
  const showCols = !!view.settings.timelineShowColumns;
  const baselineId = (view.settings.timelineBaselineId as string | undefined) ?? '';
  const px = PX[zoom];
  const today = todayISO();
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const [linking, setLinking] = useState<false | { from: string | null }>(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const progressCol = bundle.columns.find((c) => c.type === 'progress');
  const statusCol = bundle.columns.find((c) => c.type === 'status');

  const baselines = useQuery({ queryKey: ['baselines', bundle.board.id], queryFn: () => get<{ baselines: { id: string; number: number; name: string }[] }>(`/boards/${bundle.board.id}/baselines`), staleTime: 60_000 });
  const cmp = useQuery({
    queryKey: ['baseline-compare', bundle.board.id, baselineId],
    queryFn: () => get<{ available: boolean; rows: { itemId: string; baselineStart: string | null; baselineFinish: string | null }[] }>(`/boards/${bundle.board.id}/baselines/compare?baseline=${baselineId}`),
    enabled: !!baselineId,
  });
  const baseBy = useMemo(() => new Map((cmp.data?.available ? cmp.data.rows : []).map((r) => [r.itemId, r])), [cmp.data]);

  const children = useMemo(() => {
    const m = new Map<string, ItemDTO[]>();
    for (const it of allItems) if (it.parentItemId) m.set(it.parentItemId, [...(m.get(it.parentItemId) ?? []), it]);
    for (const list of m.values()) list.sort((a, b) => a.position - b.position);
    return m;
  }, [allItems]);

  /** Planned dates (editable), or, for a task scheduled only by duration and links, its calculated dates. */
  const rangeFor = (it: ItemDTO): Range | null => {
    if (drag && drag.id === it.id) return drag.cur;
    const r = col ? rangeOf(it, col) : null;
    if (r) return r;
    const s = byItem.get(it.id);
    return s?.earlyStart && s.earlyFinish ? { start: s.earlyStart, end: s.earlyFinish } : null;
  };
  const isPlanned = (it: ItemDTO) => !!(col && rangeOf(it, col));

  const rows: Row[] = [];
  for (const g of bundle.groups) {
    const gi = items.filter((i) => i.groupId === g.id && rangeFor(i));
    if (!gi.length) continue;
    rows.push({ kind: 'group', id: g.id, name: g.name, color: g.color });
    for (const item of gi) {
      const kids = (children.get(item.id) ?? []).filter((k) => rangeFor(k));
      rows.push({ kind: 'item', item, depth: 0, hasKids: kids.length > 0 });
      if (expanded.has(item.id)) for (const k of kids) rows.push({ kind: 'item', item: k, depth: 1, hasKids: false });
    }
  }
  const rowIndex = new Map<string, number>();
  rows.forEach((r, i) => r.kind === 'item' && rowIndex.set(r.item.id, i));
  const undated = items.filter((i) => !rangeFor(i));

  const { start, totalDays } = useMemo(() => {
    let lo = addDays(today, -7);
    let hi = addDays(today, 30);
    const see = (a?: string | null, b?: string | null) => {
      if (a && a < lo) lo = a;
      if (b && b > hi) hi = b;
    };
    for (const it of allItems) {
      if (col) {
        const r = rangeOf(it, col);
        if (r) see(r.start, r.end);
      }
      const s = byItem.get(it.id);
      see(s?.earlyStart, s?.earlyFinish);
      const b = baseBy.get(it.id);
      see(b?.baselineStart, b?.baselineFinish);
    }
    lo = addDays(lo, -7);
    hi = addDays(hi, 21);
    return { start: lo, totalDays: Math.min(3000, diffDays(lo, hi) + 1) };
  }, [allItems, col, today, byItem, baseBy]);

  if (!col && !sched?.tasks.some((t) => t.earlyStart)) {
    return (
      <EmptyState icon="timeline" title="Timeline needs a timeline column" action={canEdit ? <button className="btn primary" onClick={async () => { const c = await actions.createColumn({ title: 'Timeline', type: 'timeline' }); if (c) updateViewSettings({ timelineColumnId: c.id }); }}>Add a timeline column</button> : undefined}>
        The Gantt chart plots each item between its start and end dates.
      </EmptyState>
    );
  }

  const x = (d: string) => diffDays(start, d) * px;
  const progressOf = (it: ItemDTO): number => {
    const s = byItem.get(it.id);
    if (s?.percentComplete != null) return s.percentComplete;
    if (statusCol && doneLabelIds(statusCol).includes(it.values[statusCol.id] as string)) return 100;
    if (progressCol && typeof it.values[progressCol.id] === 'number') return it.values[progressCol.id] as number;
    return 0;
  };
  const colorOf = (it: ItemDTO) => (statusCol ? labelsOf(statusCol).find((l) => l.id === it.values[statusCol.id])?.color : undefined) ?? 'var(--accent-fill)';
  const isDone = (it: ItemDTO) => !!it.completedAt || !!byItem.get(it.id)?.actualFinish;

  const onPointerDown = (e: React.PointerEvent, it: ItemDTO, mode: Drag['mode']) => {
    if (linking) return;
    if (!canEdit || !col || !isPlanned(it)) return;
    const r = rangeOf(it, col)!;
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
    if (col && (d.cur.start !== d.orig.start || d.cur.end !== d.orig.end)) void actions.setValue(d.id, col.id, d.cur);
  };

  /** Link mode: the first bar clicked is the predecessor, the second the successor (finish to start). */
  const onBarClick = async (it: ItemDTO) => {
    if (!linking) {
      if (!canEdit) openItem(it.id);
      return;
    }
    if (!linking.from) return setLinking({ from: it.id });
    if (linking.from === it.id) return setLinking({ from: null });
    try {
      await post(`/boards/${bundle.board.id}/links`, { predecessorId: linking.from, successorId: it.id, type: 'FS' });
      toast('Dependency added (finish to start). Change its type or lag in the task’s Schedule tab.');
      invalidateControls(qc, bundle.board.id);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
    setLinking(false);
  };

  const onLinkClick = async (l: LinkDTO) => {
    const a = byItem.get(l.predecessorId);
    const b = byItem.get(l.successorId);
    if (l.source === 'column') return toast('This link comes from the Dependency column: change it there.');
    if (!canEdit) return;
    if (!(await confirm({ title: 'Remove this dependency?', message: `${a?.key ?? ''} ${a?.name ?? ''} → ${b?.key ?? ''} ${b?.name ?? ''} (${formatLink(l.type, l.lagMinutes, l.lagUnit, sched?.summary.hoursPerDay ?? 8, 5)})`, danger: true, confirmLabel: 'Remove' }))) return;
    try {
      await del(`/links/${l.id}`);
      invalidateControls(qc, bundle.board.id);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };

  const onBarKey = (e: React.KeyboardEvent, it: ItemDTO) => {
    if (e.key === 'Enter') return linking ? void onBarClick(it) : openItem(it.id);
    if (!canEdit || !col || !isPlanned(it)) return;
    const r = rangeOf(it, col)!;
    const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
    if (!step) return;
    e.preventDefault();
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
    const month = date.getUTCMonth();
    if (zoom === 'day') ticks.push({ left: i * px, width: px, label: `${dom}`, major: dom === 1 });
    else if (zoom === 'week' && dow === 0) ticks.push({ left: i * px, width: 7 * px, label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }), major: dom <= 7 });
    else if (zoom === 'month' && dom === 1) ticks.push({ left: i * px, width: 30 * px, label: date.toLocaleDateString(undefined, { month: 'short', year: '2-digit', timeZone: 'UTC' }), major: month === 0 });
    else if (zoom === 'quarter' && dom === 1 && month % 3 === 0) ticks.push({ left: i * px, width: 91 * px, label: `Q${month / 3 + 1} ${String(date.getUTCFullYear()).slice(2)}`, major: month === 0 });
  }
  const width = totalDays * px;
  const height = rows.length * ROW;

  // Dependency lines, by link type: FS end->start, SS start->start, FF end->end, SF start->end.
  const arrows: { d: string; key: string; critical: boolean; bad: boolean; link: LinkDTO | null }[] = [];
  const links: LinkDTO[] = sched?.links ?? [];
  for (const l of links) {
    const pi = rowIndex.get(l.predecessorId);
    const si = rowIndex.get(l.successorId);
    if (pi === undefined || si === undefined) continue;
    const pr = rangeFor((rows[pi] as { item: ItemDTO }).item);
    const sr = rangeFor((rows[si] as { item: ItemDTO }).item);
    if (!pr || !sr) continue;
    const fromEnd = l.type === 'FS' || l.type === 'FF';
    const toEnd = l.type === 'FF' || l.type === 'SF';
    const x1 = fromEnd ? x(pr.end) + px : x(pr.start);
    const x2 = toEnd ? x(sr.end) + px : x(sr.start);
    const y1 = pi * ROW + ROW / 2;
    const y2 = si * ROW + ROW / 2;
    const elbow = toEnd ? Math.max(x1, x2) + 10 : fromEnd ? Math.max(x1 + 8, x2 - 8) : Math.min(x1, x2) - 10;
    const head = toEnd ? `H${x2 + 2} m5,-4 l-5,4 l5,4` : `H${x2 - 2} m-5,-4 l5,4 l-5,4`;
    arrows.push({ key: l.id, critical: l.critical, bad: (l.floatDays ?? 0) < 0, link: l, d: `M${x1},${y1} H${elbow} V${y2} ${head}` });
  }

  const summary = sched?.summary;
  const leftWidth = showCols ? COLS_W : 300;
  const gridCols = '72px 40px minmax(140px, 1fr) 78px 78px 48px 40px 90px 90px 52px';

  const leftCells = (it: ItemDTO, depth: number, hasKids: boolean) => {
    const s: TaskScheduleDTO | undefined = byItem.get(it.id);
    const nameBtn = (
      <span className="row" style={{ minWidth: 0, gap: 4, paddingLeft: depth * 14 }}>
        {hasKids ? (
          <button className="btn ghost icon sm" aria-label={expanded.has(it.id) ? 'Collapse subtasks' : 'Expand subtasks'} aria-expanded={expanded.has(it.id)} onClick={() => setExpanded((e) => { const n = new Set(e); if (n.has(it.id)) n.delete(it.id); else n.add(it.id); return n; })}>
            <Icon name={expanded.has(it.id) ? 'chevronDown' : 'chevronRight'} size={12} />
          </button>
        ) : null}
        <button className="btn ghost sm ellipsis" style={{ justifyContent: 'flex-start', maxWidth: '100%' }} onClick={() => openItem(it.id)}>{it.name}</button>
        <CriticalBadge criticality={s?.criticality} compact />
      </span>
    );
    if (!showCols) return (
      <>
        <span className="row-key"><TaskKey value={it.key} /></span>
        {nameBtn}
      </>
    );
    const r = rangeFor(it);
    return (
      <div className="gantt-cols" style={{ gridTemplateColumns: gridCols }}>
        <TaskKey value={it.key} />
        <span className="small muted">{s?.wbs ?? ''}</span>
        {nameBtn}
        <span className="small">{r?.start ?? '—'}</span>
        <span className="small">{r?.end ?? '—'}</span>
        <span className="small num">{s?.durationDays != null ? `${s.durationDays}d` : '—'}</span>
        <span className="small num">{Math.round(progressOf(it))}%</span>
        <span className="small ellipsis">{(s?.owners ?? []).map((o) => memberName(o) ?? '').filter(Boolean).join(', ') || '—'}</span>
        <span className="small ellipsis" title={(s?.predecessors ?? []).map((p) => byItem.get(p)?.key).join(', ')}>{(s?.predecessors ?? []).map((p) => byItem.get(p)?.key ?? '').join(', ') || '—'}</span>
        <span className={`small num ${(s?.totalFloatDays ?? 0) < 0 ? 'pc-neg' : ''}`}>{s?.totalFloatDays != null ? `${s.totalFloatDays}d` : '—'}</span>
      </div>
    );
  };

  return (
    <div className="gantt-wrap">
      <div className="view-header" style={{ padding: '0 0 8px', flexWrap: 'wrap', gap: 8 }}>
        {tlCols.length > 1 && col ? (
          <select className="select sm" aria-label="Timeline column" value={col.id} onChange={(e) => updateViewSettings({ timelineColumnId: e.target.value })}>
            {tlCols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        ) : null}
        <div className="seg" role="group" aria-label="Zoom">
          {(['day', 'week', 'month', 'quarter'] as Zoom[]).map((z) => (
            <button key={z} className={zoom === z ? 'on' : ''} aria-pressed={zoom === z} onClick={() => updateViewSettings({ timelineZoom: z })}>{z[0].toUpperCase() + z.slice(1)}</button>
          ))}
        </div>
        <button className={`btn sm${showCols ? ' primary' : ''}`} aria-pressed={showCols} onClick={() => updateViewSettings({ timelineShowColumns: !showCols })}><Icon name="table" /> Schedule columns</button>
        <select className="select sm" aria-label="Baseline to compare" value={baselineId} onChange={(e) => updateViewSettings({ timelineBaselineId: e.target.value || undefined })}>
          <option value="">No baseline overlay</option>
          {(baselines.data?.baselines ?? []).map((b) => <option key={b.id} value={b.id}>Baseline {b.number}: {b.name}</option>)}
        </select>
        {canEdit ? (
          <button className={`btn sm${linking ? ' primary' : ''}`} aria-pressed={!!linking} onClick={() => setLinking(linking ? false : { from: null })}>
            <Icon name="link" /> {linking ? (linking.from ? 'Now click the successor' : 'Click the predecessor') : 'Link tasks'}
          </button>
        ) : null}
        <span className="muted small">{linking ? 'Esc or the button again to stop.' : canEdit ? 'Drag bars to reschedule, edges to resize. Click a line to remove a link.' : 'Read-only'}</span>
      </div>
      {summary ? (
        <div className="gantt-summary" style={{ marginBottom: 8 }}>
          <span>Project start <b>{summary.projectStart ?? '—'}</b></span>
          <span>Forecast finish <b>{summary.projectFinish ?? '—'}</b></span>
          <span>Critical path <b>{fmtDays(summary.criticalDurationDays)}</b> (working)</span>
          <span><b>{summary.counts.critical}</b> critical · <b>{summary.counts.near_critical}</b> near-critical</span>
          {!summary.valid ? <span className="crit-badge critical">Dependency loop: the critical path cannot be calculated (see Project controls)</span> : null}
        </div>
      ) : null}
      <div className="gantt-legend" style={{ marginBottom: 8 }} aria-label="Legend">
        <span><i className="sw critical" />Critical path (red, flag)</span>
        <span><i className="sw near" />Near-critical (amber, clock)</span>
        <span><i className="sw std" />Non-critical</span>
        <span><i className="sw done" />Completed (striped)</span>
        <span><i className="dia" />Milestone</span>
        <span><i className="sw base" />Baseline</span>
        <span><i className="sw base" style={{ borderStyle: 'dashed', borderColor: 'var(--accent)' }} />Forecast differs from plan</span>
      </div>
      {rows.length === 0 ? (
        <div className="card card-pad muted">No items have {col ? col.title.toLowerCase() : 'timeline'} dates yet.</div>
      ) : (
        <div className="gantt-scroll" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={(e) => e.key === 'Escape' && setLinking(false)}>
          <div className="gantt" style={{ gridTemplateColumns: `${leftWidth}px ${width}px` }}>
            <div className="gantt-left">
              <div className="gantt-row gantt-head" style={{ height: HEAD }}>
                {showCols ? (
                  <div className="gantt-cols" style={{ gridTemplateColumns: gridCols, fontWeight: 600 }}>
                    <span>ID</span><span>WBS</span><span>Task</span><span>Start</span><span>Finish</span><span className="num">Dur.</span><span className="num">%</span><span>Owner</span><span>Pred.</span><span className="num">Float</span>
                  </div>
                ) : <strong>Task</strong>}
              </div>
              {rows.map((r) =>
                r.kind === 'group' ? (
                  <div key={'g' + r.id} className="gantt-row group"><span className="icon-dot" style={{ background: r.color }} /> <span className="ellipsis">{r.name}</span></div>
                ) : (
                  <div key={r.item.id} className={`gantt-row${linking && linking.from === r.item.id ? ' linking-from' : ''}`}>{leftCells(r.item, r.depth, r.hasKids)}</div>
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
                  const it = r.item;
                  const rg = rangeFor(it)!;
                  const s = byItem.get(it.id);
                  const left = x(rg.start);
                  const w = (diffDays(rg.start, rg.end) + 1) * px;
                  const milestone = s ? s.milestone : rg.start === rg.end;
                  const done = isDone(it);
                  const crit = !done && s && (s.criticality === 'critical' || s.criticality === 'near_critical') ? ` crit-${s.criticality}` : '';
                  const base = baseBy.get(it.id);
                  const forecastDiffers = s?.earlyStart && s.earlyFinish && isPlanned(it) && !done && (s.earlyStart !== rg.start || s.earlyFinish !== rg.end);
                  const editable = canEdit && isPlanned(it) && !linking;
                  const title = `${it.key ? `${it.key} · ` : ''}${it.name} · ${rg.start} → ${rg.end}${s ? ` · ${s.criticality === 'critical' ? 'Critical' : s.criticality === 'near_critical' ? 'Near-critical' : 'Float'} ${s.totalFloatDays ?? '—'} d` : ''}${forecastDiffers ? ` · Forecast ${s!.earlyStart} → ${s!.earlyFinish}` : ''}`;
                  return (
                    <div key={'l' + it.id} className="gantt-lane" style={{ position: 'absolute', top: i * ROW, left: 0, right: 0 }}>
                      {base?.baselineStart && base.baselineFinish ? (
                        <div className={`gantt-baseline${base.baselineStart === base.baselineFinish ? ' milestone' : ''}`} style={{ left: x(base.baselineStart), width: Math.max(8, (diffDays(base.baselineStart, base.baselineFinish) + 1) * px) }} title={`Baseline ${base.baselineStart} → ${base.baselineFinish}`} />
                      ) : null}
                      {forecastDiffers ? <div className="gantt-baseline" style={{ left: x(s!.earlyStart!), width: Math.max(8, (diffDays(s!.earlyStart!, s!.earlyFinish!) + 1) * px), borderStyle: 'dashed', borderColor: 'var(--accent)', top: 4, height: 28 }} title={`Forecast ${s!.earlyStart} → ${s!.earlyFinish}`} /> : null}
                      {milestone ? (
                        <div
                          className={`gantt-milestone${crit}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`Milestone ${title}`}
                          title={title}
                          style={{ left: left + px / 2 - 8, top: 10, cursor: editable ? 'grab' : 'pointer' }}
                          onPointerDown={(e) => onPointerDown(e, it, 'move')}
                          onClick={() => (linking || !editable) && void onBarClick(it)}
                          onKeyDown={(e) => onBarKey(e, it)}
                        />
                      ) : (
                        <div
                          className={`gantt-bar${editable ? '' : ' readonly'}${drag?.id === it.id ? ' dragging' : ''}${crit}${done ? ' complete' : ''}`}
                          role="button"
                          tabIndex={0}
                          aria-label={title}
                          title={title}
                          style={{ left, width: Math.max(w, 8), top: 7, ...(crit || done ? {} : { background: colorOf(it) }), ...(isPlanned(it) ? {} : { opacity: 0.7 }) }}
                          onPointerDown={(e) => onPointerDown(e, it, 'move')}
                          onClick={() => (linking || !editable) && void onBarClick(it)}
                          onKeyDown={(e) => onBarKey(e, it)}
                        >
                          <span className="fill" style={{ width: `${progressOf(it)}%` }} />
                          {editable ? <span className="handle l" onPointerDown={(e) => onPointerDown(e, it, 'l')} /> : null}
                          {crit && w > 30 ? <span className="crit-mark" aria-hidden><Icon name={s!.criticality === 'critical' ? 'flag' : 'clock'} size={11} /></span> : null}
                          {done && w > 30 ? <span className="crit-mark" aria-hidden><Icon name="check" size={11} /></span> : null}
                          <span style={{ position: 'relative', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w > 70 ? it.name : ''}</span>
                          {editable ? <span className="handle r" onPointerDown={(e) => onPointerDown(e, it, 'r')} /> : null}
                        </div>
                      )}
                      {w <= 70 && !milestone ? <span className="small muted" style={{ position: 'absolute', left: left + Math.max(w, 8) + 6, top: 9, whiteSpace: 'nowrap' }}>{it.name}</span> : null}
                      {milestone ? <span className="small muted" style={{ position: 'absolute', left: left + px / 2 + 14, top: 9, whiteSpace: 'nowrap' }}>{it.name}</span> : null}
                    </div>
                  );
                })}
                {arrows.length ? (
                  <svg className="gantt-arrows" width={width} height={height} aria-hidden>
                    {arrows.map((a) => <path key={a.key} d={a.d} className={a.critical ? 'critical' : a.bad ? 'bad' : ''} />)}
                    {arrows.map((a) => <path key={'h' + a.key} d={a.d} className="link-hit" onClick={() => a.link && void onLinkClick(a.link)}><title>{a.link ? `${byItem.get(a.link.predecessorId)?.key ?? ''} → ${byItem.get(a.link.successorId)?.key ?? ''} ${formatLink(a.link.type, a.link.lagMinutes, a.link.lagUnit, sched?.summary.hoursPerDay ?? 8, 5)}${a.critical ? ' (critical)' : ''}` : ''}</title></path>)}
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
                <TaskKey value={it.key} />
                <button className="btn ghost sm grow ellipsis" style={{ justifyContent: 'flex-start' }} onClick={() => openItem(it.id)}>{it.name}</button>
                {canEdit && col ? (
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
