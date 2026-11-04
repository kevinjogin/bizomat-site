import { useMemo } from 'react';
import { getColumnType, labelsOf } from '../../../shared/columns';
import type { ColumnDTO, ItemDTO, ViewSettings } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { BarChart, DonutChart, LineChart, type ChartDatum } from '../../components/charts/Charts';
import { EmptyState } from '../../components/ui/ui';
import '../../styles/views.css';

const GROUPABLE = new Set(['status', 'priority', 'dropdown', 'person', 'people', 'tags', 'date', 'timeline', 'checkbox', 'rating', 'text']);
const NUMERIC = new Set(['number', 'currency', 'percentage', 'rating', 'progress', 'formula']);
const NONE_COLOR = '#94a3b8';

type Metric = NonNullable<ViewSettings['chartMetric']>;

function keysFor(item: ItemDTO, groupBy: string, columns: ColumnDTO[], groups: Map<string, { name: string; color: string }>, memberName: (id: string) => string | undefined): { key: string; label: string; color: string | null }[] {
  const none = { key: '__none', label: 'Empty', color: NONE_COLOR };
  if (groupBy === 'group') {
    const g = groups.get(item.groupId);
    return [{ key: item.groupId, label: g?.name ?? '—', color: g?.color ?? null }];
  }
  const col =
    groupBy === 'status' ? columns.find((c) => c.type === 'status')
    : groupBy === 'priority' ? columns.find((c) => c.type === 'priority')
    : groupBy === 'person' ? columns.find((c) => c.type === 'person' || c.type === 'people')
    : columns.find((c) => c.id === groupBy);
  if (!col) return [none];
  const v = item.values[col.id];
  if (v == null || v === '' || (Array.isArray(v) && !v.length)) return [groupBy === 'person' || col.type === 'person' || col.type === 'people' ? { ...none, label: 'Unassigned' } : none];
  switch (col.type) {
    case 'status': case 'priority': case 'dropdown':
      return (Array.isArray(v) ? v : [v]).map((id) => {
        const l = labelsOf(col).find((x) => x.id === id);
        return { key: String(id), label: l?.label ?? String(id), color: l?.color ?? null };
      });
    case 'person': case 'people':
      return (Array.isArray(v) ? v : [v]).map((id) => ({ key: String(id), label: memberName(String(id)) ?? 'Former member', color: null }));
    case 'tags':
      return (v as string[]).map((t) => ({ key: t.toLowerCase(), label: t, color: null }));
    case 'date':
      return [{ key: String(v).slice(0, 7), label: String(v).slice(0, 7), color: null }];
    case 'timeline':
      return [{ key: String((v as any).start).slice(0, 7), label: String((v as any).start).slice(0, 7), color: null }];
    case 'checkbox':
      return [v ? { key: 'yes', label: 'Checked', color: '#00a36c' } : { key: 'no', label: 'Unchecked', color: NONE_COLOR }];
    default: {
      const t = getColumnType(col.type).toText(v, col.settings);
      return [{ key: t.toLowerCase(), label: t || 'Empty', color: null }];
    }
  }
}

export function computeSegments(items: ItemDTO[], groupBy: string, metric: Metric, columns: ColumnDTO[], groups: Map<string, { name: string; color: string }>, memberName: (id: string) => string | undefined): ChartDatum[] {
  const buckets = new Map<string, { label: string; color: string | null; nums: number[]; count: number; order: number }>();
  const col = groupBy !== 'group' ? (groupBy === 'status' ? columns.find((c) => c.type === 'status') : groupBy === 'priority' ? columns.find((c) => c.type === 'priority') : columns.find((c) => c.id === groupBy)) : undefined;
  const labelOrder = col && ['status', 'priority', 'dropdown'].includes(col.type) ? labelsOf(col).map((l) => l.id) : [];
  const metricCol = metric.kind !== 'count' ? columns.find((c) => c.id === metric.columnId) : undefined;
  for (const it of items) {
    for (const k of keysFor(it, groupBy, columns, groups, memberName)) {
      const b = buckets.get(k.key) ?? { label: k.label, color: k.color, nums: [], count: 0, order: labelOrder.indexOf(k.key) };
      b.count++;
      if (metricCol) {
        const n = it.values[metricCol.id];
        if (typeof n === 'number') b.nums.push(n);
      }
      buckets.set(k.key, b);
    }
  }
  const out = Array.from(buckets.entries()).map(([key, b]) => {
    let value = b.count;
    if (metric.kind === 'sum') value = b.nums.reduce((a, c) => a + c, 0);
    if (metric.kind === 'avg') value = b.nums.length ? b.nums.reduce((a, c) => a + c, 0) / b.nums.length : 0;
    return { key, label: b.label, color: b.color, value: Math.round(value * 100) / 100, count: b.count, order: b.order };
  });
  const isDateLike = col && (col.type === 'date' || col.type === 'timeline');
  out.sort((a, b) => {
    if (a.key === '__none') return 1;
    if (b.key === '__none') return -1;
    if (isDateLike) return a.key.localeCompare(b.key);
    if (labelOrder.length) return (a.order < 0 ? 999 : a.order) - (b.order < 0 ? 999 : b.order);
    if (groupBy === 'group') return 0;
    return b.value - a.value;
  });
  return out.map(({ order: _o, ...d }) => d);
}

export function ChartView(props: BoardViewProps) {
  const { bundle, view, items, updateViewSettings, memberName } = props;
  const cols = bundle.columns;
  const chartType = view.settings.chartType ?? 'bar';
  const groupBy = view.settings.chartGroupBy ?? (cols.some((c) => c.type === 'status') ? 'status' : 'group');
  const metric: Metric = view.settings.chartMetric ?? { kind: 'count' };
  const groups = useMemo(() => new Map(bundle.groups.map((g) => [g.id, { name: g.name, color: g.color }])), [bundle.groups]);
  const data = useMemo(() => computeSegments(items, groupBy, metric, cols, groups, memberName), [items, groupBy, metric, cols, groups, memberName]);
  const groupOptions = [
    { id: 'group', label: 'Group' },
    ...(cols.some((c) => c.type === 'status') ? [{ id: 'status', label: 'Status' }] : []),
    ...(cols.some((c) => c.type === 'priority') ? [{ id: 'priority', label: 'Priority' }] : []),
    ...(cols.some((c) => c.type === 'person' || c.type === 'people') ? [{ id: 'person', label: 'Person' }] : []),
    ...cols.filter((c) => GROUPABLE.has(c.type)).map((c) => ({ id: c.id, label: `Column: ${c.title}` })),
  ];
  const numericCols = cols.filter((c) => NUMERIC.has(c.type));
  const metricLabel = metric.kind === 'count' ? 'Items' : `${metric.kind === 'sum' ? 'Sum' : 'Average'} of ${cols.find((c) => c.id === metric.columnId)?.title ?? '?'}`;
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="chart-view">
      <div className="row wrap">
        <label className="label" htmlFor="chart-type">Chart</label>
        <div className="seg" role="group" aria-label="Chart type" id="chart-type">
          {(['bar', 'pie', 'line'] as const).map((t) => (
            <button key={t} className={chartType === t ? 'on' : ''} aria-pressed={chartType === t} onClick={() => updateViewSettings({ chartType: t })}>
              {t === 'pie' ? 'Donut' : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <label className="label" htmlFor="chart-group">Group by</label>
        <select id="chart-group" className="select sm" style={{ width: 'auto' }} value={groupBy} onChange={(e) => updateViewSettings({ chartGroupBy: e.target.value })}>
          {groupOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <label className="label" htmlFor="chart-metric">Measure</label>
        <select
          id="chart-metric"
          className="select sm"
          style={{ width: 'auto' }}
          value={metric.kind === 'count' ? 'count' : `${metric.kind}:${metric.columnId}`}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'count') updateViewSettings({ chartMetric: { kind: 'count' } });
            else {
              const [kind, columnId] = v.split(':');
              updateViewSettings({ chartMetric: { kind: kind as 'sum' | 'avg', columnId } });
            }
          }}
        >
          <option value="count">Count of items</option>
          {numericCols.flatMap((c) => [
            <option key={`sum:${c.id}`} value={`sum:${c.id}`}>Sum of {c.title}</option>,
            <option key={`avg:${c.id}`} value={`avg:${c.id}`}>Average of {c.title}</option>,
          ])}
        </select>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="chart" title="No data to chart">Items matching this view's filters will appear here.</EmptyState>
      ) : (
        <>
          <div className="card chart-card">
            <div className="row" style={{ marginBottom: 8 }}>
              <h3 className="grow">{metricLabel} by {groupOptions.find((o) => o.id === groupBy)?.label.replace('Column: ', '') ?? groupBy}</h3>
              <span className="muted small">{items.length} items</span>
            </div>
            {chartType === 'pie' ? <DonutChart data={data} size={220} centerLabel={String(Math.round(total * 100) / 100)} /> : chartType === 'line' ? <LineChart data={data} height={260} /> : <BarChart data={data} height={260} showLegend />}
          </div>
          <div className="card chart-table">
            <table className="data-table">
              <thead>
                <tr><th>{groupOptions.find((o) => o.id === groupBy)?.label.replace('Column: ', '') ?? 'Group'}</th><th style={{ textAlign: 'right' }}>Items</th>{metric.kind !== 'count' ? <th style={{ textAlign: 'right' }}>{metricLabel}</th> : null}<th style={{ textAlign: 'right' }}>Share</th></tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.key}>
                    <td><span className="row"><span className="icon-dot" style={{ background: d.color ?? 'var(--accent)' }} /> {d.label}</span></td>
                    <td style={{ textAlign: 'right' }}>{d.count}</td>
                    {metric.kind !== 'count' ? <td style={{ textAlign: 'right' }}>{d.value.toLocaleString()}</td> : null}
                    <td style={{ textAlign: 'right' }}>{total ? Math.round((d.value / total) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
