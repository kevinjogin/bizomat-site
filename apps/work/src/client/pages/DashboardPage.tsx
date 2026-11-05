import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { canEdit, useWorkspace } from '../lib/session';
import { usePageTitle } from '../lib/hooks';
import { formatDate, timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Field, Loading, ProgressBar } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { useBoards } from '../components/layout/CreateDialogs';
import { BarChart, DonutChart, LineChart, type ChartDatum } from '../components/charts/Charts';
import { positionBetween } from '../../shared/items';
import type { BoardBundle } from '../../shared/types';
import type { FilterGroup, FilterRule } from '../../shared/filters';
import type { DashboardDTO } from './Dashboards';
import '../styles/content.css';

interface WidgetDTO {
  id: string;
  dashboardId: string;
  type: string;
  title: string;
  config: WidgetConfig;
  position: number;
  w: number;
  h: number;
}

interface WidgetConfig {
  boardIds?: string[];
  filter?: FilterGroup;
  includeSubitems?: boolean;
  groupBy?: string;
  chartType?: 'bar' | 'pie' | 'line' | 'donut';
  metric?: { kind: 'count' } | { kind: 'sum' | 'avg'; columnTitle?: string; columnId?: string };
  dateRange?: { preset?: string; field?: 'created_at' | 'due' | 'completed_at' };
  days?: number;
  limit?: number;
  /** UI-only helpers persisted so the dialog can be re-opened faithfully. */
  ui?: { done?: 'any' | 'open' | 'done'; statuses?: string[] };
}

export const WIDGET_TYPES: { type: string; label: string; icon: string; w: number; h: number; desc: string }[] = [
  { type: 'number', label: 'Number', icon: 'hash', w: 1, h: 1, desc: 'Count, sum or average of items' },
  { type: 'chart', label: 'Chart', icon: 'chart', w: 2, h: 2, desc: 'Bar, donut or line chart grouped by any dimension' },
  { type: 'status', label: 'Task status', icon: 'checkSquare', w: 2, h: 2, desc: 'Items per status label' },
  { type: 'priority', label: 'Priority distribution', icon: 'flag', w: 2, h: 2, desc: 'Items per priority' },
  { type: 'completion', label: 'Completion', icon: 'target', w: 1, h: 1, desc: 'Share of items done' },
  { type: 'workload', label: 'Workload', icon: 'workload', w: 2, h: 2, desc: 'Open items per person' },
  { type: 'overdue', label: 'Overdue work', icon: 'clock', w: 1, h: 2, desc: 'Items past their due date' },
  { type: 'upcoming', label: 'Upcoming deadlines', icon: 'calendar', w: 1, h: 2, desc: 'Items due soon' },
  { type: 'progress', label: 'Project progress', icon: 'timeline', w: 2, h: 2, desc: 'Completion per board' },
  { type: 'activity', label: 'Activity', icon: 'activity', w: 2, h: 2, desc: 'Latest changes' },
  { type: 'time', label: 'Time tracking', icon: 'clock', w: 2, h: 2, desc: 'Hours logged per person and board' },
];

const GROUP_BY = [
  { v: 'status', l: 'Status' },
  { v: 'priority', l: 'Priority' },
  { v: 'person', l: 'Person' },
  { v: 'group', l: 'Group' },
  { v: 'board', l: 'Board' },
  { v: 'done', l: 'Done / open' },
];

const PRESETS = [
  { v: 'all', l: 'All time' },
  { v: 'last_7', l: 'Last 7 days' },
  { v: 'last_30', l: 'Last 30 days' },
  { v: 'this_month', l: 'This month' },
  { v: 'next_7', l: 'Next 7 days' },
  { v: 'next_30', l: 'Next 30 days' },
];

function itemHref(wsId: string, boardId: string, itemId: string) {
  return `/w/${wsId}/boards/${boardId}?item=${itemId}`;
}

export default function DashboardPage() {
  const ws = useWorkspace();
  const { dashboardId } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const editable = canEdit(ws.role);
  const [adding, setAdding] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetDTO | null>(null);
  const [editingDash, setEditingDash] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const dash = useQuery({ queryKey: ['dashboard', dashboardId], queryFn: () => get<{ dashboard: DashboardDTO; widgets: WidgetDTO[] }>(`/dashboards/${dashboardId}`) });
  const data = useQuery({
    queryKey: ['dashboard', dashboardId, 'data'],
    queryFn: () => get<{ boardIds: string[]; boards: { id: string; name: string }[]; widgets: Record<string, any>; computedAt: number }>(`/dashboards/${dashboardId}/data`),
    refetchInterval: 60_000,
  });
  const favs = useQuery({ queryKey: ['favourites', ws.id], queryFn: () => get<any[]>(`/workspaces/${ws.id}/favourites`) });
  const isFav = !!favs.data?.some((f) => f.type === 'dashboard' && f.id === dashboardId);
  usePageTitle(dash.data?.dashboard.name);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['dashboard', dashboardId] });
  };
  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const toggleFav = () =>
    run(async () => {
      if (isFav) await del(`/workspaces/${ws.id}/favourites/dashboard/${dashboardId}`);
      else await post(`/workspaces/${ws.id}/favourites`, { type: 'dashboard', id: dashboardId });
      qc.invalidateQueries({ queryKey: ['favourites', ws.id] });
    });

  const widgets = useMemo(() => [...(dash.data?.widgets ?? [])].sort((a, b) => a.position - b.position), [dash.data]);

  const drop = (targetId: string) => {
    const from = widgets.findIndex((w) => w.id === dragId);
    const to = widgets.findIndex((w) => w.id === targetId);
    setDragId(null);
    setOverId(null);
    if (from < 0 || to < 0 || from === to) return;
    const others = widgets.filter((w) => w.id !== dragId);
    const idx = others.findIndex((w) => w.id === targetId) + (from < to ? 1 : 0);
    const pos = positionBetween(others[idx - 1]?.position ?? null, others[idx]?.position ?? null);
    // Optimistic reorder.
    qc.setQueryData(['dashboard', dashboardId], (old: any) => old && { ...old, widgets: old.widgets.map((w: WidgetDTO) => (w.id === dragId ? { ...w, position: pos } : w)) });
    run(() => patch(`/widgets/${dragId}`, { position: pos }));
  };

  const resize = (w: WidgetDTO, dw: number, dh: number) => {
    const nw = Math.min(4, Math.max(1, w.w + dw));
    const nh = Math.min(4, Math.max(1, w.h + dh));
    if (nw === w.w && nh === w.h) return;
    qc.setQueryData(['dashboard', dashboardId], (old: any) => old && { ...old, widgets: old.widgets.map((x: WidgetDTO) => (x.id === w.id ? { ...x, w: nw, h: nh } : x)) });
    run(() => patch(`/widgets/${w.id}`, { w: nw, h: nh }));
  };

  if (dash.isLoading) return <Loading />;
  if (dash.error) return <div className="page"><ErrorBox error={dash.error} retry={() => dash.refetch()} /></div>;
  const d = dash.data!.dashboard;

  return (
    <div className="page" style={{ maxWidth: 1400 }}>
      <div className="page-header">
        <div className="grow" style={{ flex: '1 1 280px' }}>
          <h1 className="row">
            {d.name}
            <button className="btn ghost icon sm" aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={isFav} onClick={toggleFav} style={{ color: isFav ? 'var(--warning)' : undefined }}>
              <Icon name="star" />
            </button>
          </h1>
          <p>
            {d.description ? `${d.description} · ` : ''}
            {data.data ? `${data.data.boards.length} board${data.data.boards.length === 1 ? '' : 's'}: ${data.data.boards.map((b) => b.name).join(', ') || 'none'}` : ' '}
          </p>
        </div>
        <div className="dash-toolbar">
          <span className="muted small" aria-live="polite">{data.isFetching ? 'Refreshing…' : data.data ? `Updated ${timeAgo(data.data.computedAt)}` : ''}</span>
          <button className="btn" onClick={() => data.refetch()} aria-label="Refresh data"><Icon name="refresh" /> Refresh</button>
          {editable ? (
            <>
              <button className="btn" onClick={() => setEditingDash(true)}><Icon name="settings" /> Settings</button>
              <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> Add widget</button>
            </>
          ) : null}
        </div>
      </div>
      {data.error ? <ErrorBox error={data.error} retry={() => data.refetch()} /> : null}
      {!widgets.length ? (
        <EmptyState icon="chart" title="This dashboard has no widgets" action={editable ? <button className="btn primary" onClick={() => setAdding(true)}>Add a widget</button> : null}>
          Widgets show live numbers, charts and lists computed from your boards.
        </EmptyState>
      ) : (
        <div className="dash-grid">
          {widgets.map((w) => (
            <section
              key={w.id}
              className={`widget${dragId === w.id ? ' dragging' : ''}${overId === w.id && dragId !== w.id ? ' drop-target' : ''}`}
              style={{ gridColumn: `span ${w.w}`, gridRow: `span ${w.h}` }}
              aria-label={w.title}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                setOverId(w.id);
              }}
              onDragLeave={() => setOverId((o) => (o === w.id ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                drop(w.id);
              }}
            >
              <div className="widget-head">
                {editable ? (
                  <span
                    className="drag"
                    draggable
                    role="button"
                    tabIndex={-1}
                    aria-label="Drag to reorder"
                    onDragStart={(e) => {
                      setDragId(w.id);
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', w.id);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverId(null);
                    }}
                  >
                    <Icon name="drag" size={14} />
                  </span>
                ) : null}
                <span className="ellipsis grow">{w.title}</span>
                {editable ? (
                  <div className="widget-tools">
                    <button className="btn ghost icon sm" aria-label="Narrower" title="Narrower" onClick={() => resize(w, -1, 0)} disabled={w.w <= 1}><Icon name="chevronLeft" size={14} /></button>
                    <button className="btn ghost icon sm" aria-label="Wider" title="Wider" onClick={() => resize(w, 1, 0)} disabled={w.w >= 4}><Icon name="chevronRight" size={14} /></button>
                    <button className="btn ghost icon sm" aria-label="Shorter" title="Shorter" onClick={() => resize(w, 0, -1)} disabled={w.h <= 1}><span aria-hidden style={{ fontSize: 11, fontWeight: 700 }}>H−</span></button>
                    <button className="btn ghost icon sm" aria-label="Taller" title="Taller" onClick={() => resize(w, 0, 1)} disabled={w.h >= 4}><span aria-hidden style={{ fontSize: 11, fontWeight: 700 }}>H+</span></button>
                    <button className="btn ghost icon sm" aria-label={`Edit ${w.title}`} onClick={() => setEditingWidget(w)}><Icon name="edit" size={14} /></button>
                    <button
                      className="btn ghost icon sm"
                      aria-label={`Remove ${w.title}`}
                      onClick={async () => {
                        if (await confirm({ title: 'Remove widget?', message: `"${w.title}" will be removed from this dashboard.`, confirmLabel: 'Remove', danger: true })) run(() => del(`/widgets/${w.id}`));
                      }}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="widget-body">
                {data.isLoading ? <div className="skeleton" style={{ height: '70%' }} /> : <WidgetBody widget={w} data={data.data?.widgets[w.id]} wsId={ws.id} />}
              </div>
            </section>
          ))}
        </div>
      )}
      {adding || editingWidget ? (
        <WidgetDialog
          wsId={ws.id}
          dashboard={d}
          widget={editingWidget}
          onClose={() => {
            setAdding(false);
            setEditingWidget(null);
          }}
          onSaved={refresh}
        />
      ) : null}
      {editingDash ? <DashboardSettingsDialog wsId={ws.id} dashboard={d} onClose={() => setEditingDash(false)} onSaved={refresh} /> : null}
    </div>
  );
}

// ------------------------------------------------------------ widget body

function segs(x: any): ChartDatum[] {
  return Array.isArray(x?.segments) ? x.segments : [];
}

function ItemList({ items, wsId, empty }: { items: any[]; wsId: string; empty: string }) {
  if (!items?.length) return <div className="muted small chart-empty">{empty}</div>;
  return (
    <div className="widget-list">
      {items.map((i) => (
        <Link key={i.id} to={itemHref(wsId, i.boardId, i.id)}>
          <span className="grow ellipsis">
            {i.name}
            <span className="muted small"> · {i.boardName}</span>
          </span>
          {i.status ? <span className="pill" style={{ background: i.status.color, height: 20, fontSize: 11 }}>{i.status.label}</span> : null}
          <span className="small" style={{ color: 'var(--text-3)', flex: 'none' }}>{formatDate(i.due)}</span>
        </Link>
      ))}
    </div>
  );
}

function WidgetBody({ widget, data, wsId }: { widget: WidgetDTO; data: any; wsId: string }) {
  if (!data) return <div className="muted small">No data</div>;
  if (data.error) return <div className="widget-error">{data.error}</div>;
  const short = widget.h <= 1;
  const chartH = Math.max(110, widget.h * 170 - 90);
  switch (widget.type) {
    case 'number': {
      const m = widget.config.metric;
      return (
        <div className="col" style={{ justifyContent: 'center', height: '100%' }}>
          <div className="big-number">{Number(data.value ?? 0).toLocaleString()}</div>
          <div className="muted small">{m && m.kind !== 'count' ? `${m.kind} of ${m.columnTitle ?? 'column'} · ${data.count} items` : 'items'}</div>
        </div>
      );
    }
    case 'completion':
      return (
        <div className="col" style={{ justifyContent: 'center', height: '100%' }}>
          <div className="big-number">{data.percent}%</div>
          <ProgressBar value={data.percent} />
          <div className="muted small">{data.done} of {data.total} done</div>
        </div>
      );
    case 'chart': {
      const s = segs(data);
      const type = widget.config.chartType ?? data.chartType ?? 'bar';
      if (type === 'line') return <LineChart data={s} height={chartH} />;
      if (type === 'pie' || type === 'donut') return <DonutChart data={s} size={Math.min(chartH, 180)} />;
      return <BarChart data={s} height={chartH} />;
    }
    case 'status':
    case 'priority':
      return short ? <BarChart data={segs(data)} horizontal /> : <DonutChart data={segs(data)} size={Math.min(chartH, 180)} centerLabel="items" />;
    case 'workload':
      return <BarChart data={segs(data)} horizontal />;
    case 'overdue':
      return (
        <div>
          <div className="row" style={{ marginBottom: 4 }}><span className="big-number danger-text" style={{ fontSize: 28 }}>{data.count}</span><span className="muted small">overdue</span></div>
          <ItemList items={data.items} wsId={wsId} empty="Nothing overdue 🎉" />
        </div>
      );
    case 'upcoming':
      return (
        <div>
          <div className="row" style={{ marginBottom: 4 }}><span className="big-number" style={{ fontSize: 28 }}>{data.count}</span><span className="muted small">due in the next {widget.config.days ?? 7} days</span></div>
          <ItemList items={data.items} wsId={wsId} empty="No upcoming deadlines" />
        </div>
      );
    case 'progress':
      if (!data.boards?.length) return <div className="muted small chart-empty">No items yet</div>;
      return (
        <div className="col" style={{ gap: 10 }}>
          {data.boards.map((b: any) => (
            <div key={b.id}>
              <div className="row small">
                <Link to={`/w/${wsId}/boards/${b.id}`} className="grow ellipsis" style={{ color: 'var(--text)' }}>{b.name}</Link>
                <span className="muted">{b.done}/{b.total} · {b.percent}%</span>
              </div>
              <ProgressBar value={b.percent} />
            </div>
          ))}
        </div>
      );
    case 'activity':
      if (!data.events?.length) return <div className="muted small chart-empty">No activity yet</div>;
      return (
        <div className="widget-list">
          {data.events.map((e: any) => (
            <Link key={e.id} to={e.item_id ? itemHref(wsId, e.board_id, e.item_id) : `/w/${wsId}/boards/${e.board_id}`}>
              <Icon name="activity" size={14} />
              <span className="grow ellipsis">
                <strong>{e.actor_name ?? (String(e.action).endsWith(':automation') ? 'Automation' : 'Someone')}</strong> {describeAction(e.action)} {e.item_name ? <>“{e.item_name}”</> : null}
                <span className="muted small"> · {e.board_name}</span>
              </span>
              <span className="muted small" style={{ flex: 'none' }}>{timeAgo(e.created_at)}</span>
            </Link>
          ))}
        </div>
      );
    case 'time':
      return (
        <div className="col">
          <div className="row"><span className="big-number" style={{ fontSize: 28 }}>{data.totalHours}</span><span className="muted small">hours logged</span></div>
          {data.byPerson?.length ? <BarChart data={data.byPerson} horizontal /> : <div className="muted small">No time logged in this range</div>}
          {!short && data.byBoard?.length > 1 ? <BarChart data={data.byBoard} horizontal /> : null}
        </div>
      );
  }
  return <div className="muted small">Unsupported widget</div>;
}

export function describeAction(action: string) {
  const a = String(action).replace(/:automation$/, '');
  const map: Record<string, string> = {
    item_created: 'created',
    subitem_created: 'added a subitem to',
    value_changed: 'updated',
    renamed: 'renamed',
    description_changed: 'edited the description of',
    moved: 'moved',
    archived: 'archived',
    restored: 'restored',
    item_deleted: 'deleted an item',
    update_posted: 'posted an update on',
    reply_posted: 'replied on',
    file_uploaded: 'uploaded a file to',
    file_deleted: 'removed a file from',
    group_created: 'created a group',
    column_created: 'added a column',
    column_deleted: 'deleted a column',
    column_renamed: 'renamed a column',
  };
  return map[a] ?? a.replace(/_/g, ' ');
}

// --------------------------------------------------------- widget dialog

function useSourceBundles(boardIds: string[]) {
  return useQueries({
    queries: boardIds.map((id) => ({ queryKey: ['board-meta', id], queryFn: () => get<BoardBundle>(`/boards/${id}`), staleTime: 60_000 })),
  });
}

function WidgetDialog({ wsId, dashboard, widget, onClose, onSaved }: { wsId: string; dashboard: DashboardDTO; widget: WidgetDTO | null; onClose: () => void; onSaved: () => void }) {
  const boards = useBoards(wsId);
  const [type, setType] = useState(widget?.type ?? 'number');
  const meta = WIDGET_TYPES.find((t) => t.type === type)!;
  const [title, setTitle] = useState(widget?.title ?? meta.label);
  const [titleTouched, setTitleTouched] = useState(!!widget);
  const cfg0 = widget?.config ?? {};
  const [boardIds, setBoardIds] = useState<string[]>(cfg0.boardIds ?? []);
  const [done, setDone] = useState<'any' | 'open' | 'done'>(cfg0.ui?.done ?? 'any');
  const [statuses, setStatuses] = useState<string[]>(cfg0.ui?.statuses ?? []);
  const [includeSubitems, setIncludeSubitems] = useState(!!cfg0.includeSubitems);
  const [groupBy, setGroupBy] = useState(cfg0.groupBy ?? 'status');
  const [chartType, setChartType] = useState(cfg0.chartType ?? 'bar');
  const [metricKind, setMetricKind] = useState<'count' | 'sum' | 'avg'>(cfg0.metric?.kind ?? 'count');
  const [metricCol, setMetricCol] = useState((cfg0.metric as any)?.columnTitle ?? '');
  const [preset, setPreset] = useState(cfg0.dateRange?.preset ?? 'all');
  const [dateField, setDateField] = useState(cfg0.dateRange?.field ?? 'created_at');
  const [days, setDays] = useState(cfg0.days ?? 7);
  const [w, setW] = useState(widget?.w ?? meta.w);
  const [h, setH] = useState(widget?.h ?? meta.h);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const available = (boards.data ?? []).filter((b) => !dashboard.boardIds.length || dashboard.boardIds.includes(b.id));
  const scope = boardIds.length ? boardIds : available.map((b) => b.id);
  const bundles = useSourceBundles(scope.slice(0, 20));
  const statusLabels = useMemo(() => {
    const set = new Map<string, string>();
    for (const q of bundles) for (const c of q.data?.columns ?? []) if (c.type === 'status') for (const l of c.settings.labels ?? []) set.set(l.label.toLowerCase(), l.label);
    return Array.from(set.values());
  }, [bundles]);
  const numericCols = useMemo(() => {
    const set = new Set<string>();
    for (const q of bundles) for (const c of q.data?.columns ?? []) if (['number', 'currency', 'percentage', 'rating', 'progress', 'formula'].includes(c.type)) set.add(c.title);
    return Array.from(set);
  }, [bundles]);

  const buildFilter = (): FilterGroup | undefined => {
    const rules: (FilterRule | FilterGroup)[] = [];
    if (done === 'open') rules.push({ field: 'done', op: 'is_not' });
    if (done === 'done') rules.push({ field: 'done', op: 'is' });
    if (statuses.length) {
      const wanted = statuses.map((s) => s.toLowerCase());
      const or: FilterRule[] = [];
      for (const q of bundles) {
        for (const c of q.data?.columns ?? []) {
          if (c.type !== 'status') continue;
          const ids = (c.settings.labels ?? []).filter((l: any) => wanted.includes(l.label.toLowerCase())).map((l: any) => l.id);
          if (ids.length) or.push({ field: c.id, op: 'any_of', value: ids });
        }
      }
      // An empty OR group would match everything; use an impossible rule instead.
      rules.push(or.length ? { op: 'or', rules: or } : { field: 'name', op: 'is', value: '\u0000' });
    }
    return rules.length ? { op: 'and', rules } : undefined;
  };

  const usesFilter = !['activity', 'time'].includes(type);
  const usesMetric = type === 'number' || type === 'chart' || type === 'workload';
  const usesDate = usesFilter || type === 'time';

  const save = async () => {
    setBusy(true);
    setError(null);
    const config: WidgetConfig = {
      boardIds: boardIds.length ? boardIds : undefined,
      filter: usesFilter ? buildFilter() : undefined,
      includeSubitems: includeSubitems || undefined,
      groupBy: type === 'chart' ? groupBy : undefined,
      chartType: type === 'chart' ? (chartType as WidgetConfig['chartType']) : undefined,
      metric: usesMetric && metricKind !== 'count' && metricCol ? { kind: metricKind, columnTitle: metricCol } : usesMetric ? { kind: 'count' } : undefined,
      dateRange: usesDate && preset !== 'all' ? { preset, field: type === 'time' ? undefined : dateField } : undefined,
      days: type === 'upcoming' ? days : undefined,
      ui: { done, statuses },
    };
    try {
      if (widget) await patch(`/widgets/${widget.id}`, { title: title.trim() || meta.label, config, w, h });
      else await post(`/dashboards/${dashboard.id}/widgets`, { type, title: title.trim() || meta.label, config, w, h });
      onSaved();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      wide
      title={widget ? `Edit widget` : 'Add widget'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : widget ? 'Save widget' : 'Add widget'}</button>
        </>
      }
    >
      {!widget ? (
        <Field label="Widget type">
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
            {WIDGET_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                className={`tile${type === t.type ? ' active' : ''}`}
                aria-pressed={type === t.type}
                style={{ padding: 10, borderColor: type === t.type ? 'var(--accent)' : undefined, background: type === t.type ? 'var(--accent-soft)' : undefined, textAlign: 'left' }}
                onClick={() => {
                  setType(t.type);
                  setW(t.w);
                  setH(t.h);
                  if (!titleTouched) setTitle(t.label);
                }}
              >
                <span className="row" style={{ fontWeight: 600 }}><Icon name={t.icon} /> {t.label}</span>
                <span className="muted small">{t.desc}</span>
              </button>
            ))}
          </div>
        </Field>
      ) : null}
      <Field label="Title" htmlFor="w-title">
        <input id="w-title" className="input" value={title} maxLength={200} onChange={(e) => { setTitle(e.target.value); setTitleTouched(true); }} />
      </Field>
      <div className="row wrap" style={{ alignItems: 'flex-start', gap: 16 }}>
        <Field label="Width (columns)" htmlFor="w-w">
          <select id="w-w" className="select" value={w} onChange={(e) => setW(Number(e.target.value))}>{[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select>
        </Field>
        <Field label="Height (rows)" htmlFor="w-h">
          <select id="w-h" className="select" value={h} onChange={(e) => setH(Number(e.target.value))}>{[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select>
        </Field>
        {type === 'chart' ? (
          <>
            <Field label="Chart type" htmlFor="w-ct">
              <select id="w-ct" className="select" value={chartType} onChange={(e) => setChartType(e.target.value as any)}>
                <option value="bar">Bar</option>
                <option value="donut">Donut</option>
                <option value="line">Line</option>
              </select>
            </Field>
            <Field label="Group by" htmlFor="w-gb">
              <select id="w-gb" className="select" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                {GROUP_BY.map((g) => <option key={g.v} value={g.v}>{g.l}</option>)}
              </select>
            </Field>
          </>
        ) : null}
        {type === 'upcoming' ? (
          <Field label="Days ahead" htmlFor="w-days">
            <input id="w-days" className="input" type="number" min={1} max={90} value={days} onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value) || 7)))} />
          </Field>
        ) : null}
      </div>
      {usesMetric ? (
        <div className="row wrap" style={{ alignItems: 'flex-start', gap: 16 }}>
          <Field label="Metric" htmlFor="w-mk">
            <select id="w-mk" className="select" value={metricKind} onChange={(e) => setMetricKind(e.target.value as any)}>
              <option value="count">Count items</option>
              <option value="sum">Sum of column</option>
              <option value="avg">Average of column</option>
            </select>
          </Field>
          {metricKind !== 'count' ? (
            <Field label="Numeric column (by title)" htmlFor="w-mc" hint="Matched by title on every source board">
              <input id="w-mc" className="input" list="w-numeric-cols" value={metricCol} onChange={(e) => setMetricCol(e.target.value)} placeholder="e.g. Budget" />
              <datalist id="w-numeric-cols">{numericCols.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          ) : null}
        </div>
      ) : null}
      <Field label="Source boards" hint={dashboard.boardIds.length ? 'Limited to this dashboard’s boards. Leave empty for all of them.' : 'Leave empty for every board you can access.'}>
        <div className="row wrap" style={{ gap: 6 }}>
          {available.map((b) => (
            <button key={b.id} type="button" className={`chip${boardIds.includes(b.id) ? ' on' : ''}`} aria-pressed={boardIds.includes(b.id)} onClick={() => setBoardIds(boardIds.includes(b.id) ? boardIds.filter((x) => x !== b.id) : [...boardIds, b.id])}>
              {b.name}
            </button>
          ))}
          {!available.length ? <span className="muted small">No boards available.</span> : null}
        </div>
      </Field>
      {usesFilter ? (
        <>
          <div className="row wrap" style={{ alignItems: 'flex-start', gap: 16 }}>
            <Field label="Items" htmlFor="w-done">
              <select id="w-done" className="select" value={done} onChange={(e) => setDone(e.target.value as any)}>
                <option value="any">All items</option>
                <option value="open">Open items only</option>
                <option value="done">Done items only</option>
              </select>
            </Field>
            <Field label="Date range" htmlFor="w-preset">
              <select id="w-preset" className="select" value={preset} onChange={(e) => setPreset(e.target.value)}>
                {PRESETS.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
              </select>
            </Field>
            {preset !== 'all' ? (
              <Field label="Date field" htmlFor="w-df">
                <select id="w-df" className="select" value={dateField} onChange={(e) => setDateField(e.target.value as any)}>
                  <option value="created_at">Created date</option>
                  <option value="due">Due date</option>
                  <option value="completed_at">Completed date</option>
                </select>
              </Field>
            ) : null}
          </div>
          <label className="checkbox" style={{ marginBottom: 12 }}>
            <input type="checkbox" checked={includeSubitems} onChange={(e) => setIncludeSubitems(e.target.checked)} /> Include subitems
          </label>
          {statusLabels.length ? (
            <Field label="Only these statuses (optional)">
              <div className="row wrap" style={{ gap: 6 }}>
                {statusLabels.map((s) => (
                  <button key={s} type="button" className={`chip${statuses.includes(s) ? ' on' : ''}`} aria-pressed={statuses.includes(s)} onClick={() => setStatuses(statuses.includes(s) ? statuses.filter((x) => x !== s) : [...statuses, s])}>
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          ) : null}
        </>
      ) : type === 'time' ? (
        <Field label="Date range" htmlFor="w-preset">
          <select id="w-preset" className="select" value={preset} onChange={(e) => setPreset(e.target.value)}>
            {PRESETS.filter((p) => !p.v.startsWith('next')).map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
          </select>
        </Field>
      ) : null}
      {error ? <div className="error-box">{error}</div> : null}
    </Modal>
  );
}

function DashboardSettingsDialog({ wsId, dashboard, onClose, onSaved }: { wsId: string; dashboard: DashboardDTO; onClose: () => void; onSaved: () => void }) {
  const boards = useBoards(wsId);
  const qc = useQueryClient();
  const [name, setName] = useState(dashboard.name);
  const [description, setDescription] = useState(dashboard.description);
  const [selected, setSelected] = useState<string[]>(dashboard.boardIds);
  const [error, setError] = useState<string | null>(null);
  const save = async () => {
    try {
      await patch(`/dashboards/${dashboard.id}`, { name: name.trim() || dashboard.name, description, boardIds: selected });
      qc.invalidateQueries({ queryKey: ['dashboards', wsId] });
      onSaved();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  return (
    <Modal title="Dashboard settings" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={save}>Save</button></>}>
      <Field label="Name" htmlFor="d-name"><input id="d-name" className="input" value={name} maxLength={200} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Description" htmlFor="d-desc"><textarea id="d-desc" className="textarea" value={description} maxLength={2000} onChange={(e) => setDescription(e.target.value)} /></Field>
      <Field label="Source boards" hint="Leave empty to include every board each viewer can access. Viewers only ever see data from boards they have access to.">
        <div className="col" style={{ maxHeight: 220, overflow: 'auto', gap: 4 }}>
          {(boards.data ?? []).map((b) => (
            <label key={b.id} className="checkbox">
              <input type="checkbox" checked={selected.includes(b.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, b.id] : selected.filter((x) => x !== b.id))} /> {b.name}
            </label>
          ))}
        </div>
      </Field>
      {error ? <div className="error-box">{error}</div> : null}
    </Modal>
  );
}
