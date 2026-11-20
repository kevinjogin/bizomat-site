// Product Management: sales and margin analysis, in the style of Phocas (owner, 20 Nov 2026; Phocas a functional
// reference only), at /erp/c/<company>/products/analysis, and stock against sales at /products/analysis/stock. The
// figures are the company's own dispatched goods and the cost that left stock for them (src/worker/erp/analysis.ts):
// one period against another, by one dimension at a time, drilled down by clicking a row, with the months as a chart,
// saved views and CSV. Nothing here changes a record.
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post, postForBlob } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import { niceTop } from '../../components/charts/Charts';
import { erpPath, money, productsPage, qty } from './api';
import { CsvLink, Section } from './common';

type Dim = 'product' | 'category' | 'family' | 'customer' | 'salesperson' | 'warehouse' | 'month';
type Measure = 'sales' | 'quantity' | 'cost' | 'margin' | 'marginPct';
type Compare = 'none' | 'year' | 'period';
interface Filter {
  dimension: Dim;
  key: string;
  label?: string;
}
interface Totals {
  qty: number;
  salesCents: number;
  costCents: number;
  costedSalesCents: number;
  marginCents: number;
  marginPct: number | null;
  uncostedSalesCents: number;
  lines: number;
}
interface Row extends Totals {
  key: string;
  label: string;
  uom: string;
  compare: { qty: number; salesCents: number; marginCents: number; marginPct: number | null } | null;
  changePct: number | null;
}
interface Result {
  from: string;
  to: string;
  compare: { from: string; to: string } | null;
  currency: string;
  currencies: string[];
  dimension: Dim;
  rows: Row[];
  rowCount: number;
  totals: Totals;
  compareTotals: Totals | null;
  trend: { month: string; salesCents: number; marginCents: number; compareMonth: string | null; compareSalesCents: number | null }[];
  truncated: boolean;
}
interface Meta {
  dimensions: { key: Dim; label: string }[];
  currencies: string[];
  today: string;
  canManageViews: boolean;
  source: string;
}
interface ViewSpec {
  period: string;
  from?: string;
  to?: string;
  compare: Compare;
  dimension: Dim;
  filters: Filter[];
  sort: Measure;
  currency?: string;
}
interface SavedView {
  id: string;
  name: string;
  shared: boolean;
  mine: boolean;
  ownerName: string;
  spec: ViewSpec;
}

const DIM_LABEL: Record<Dim, string> = { product: 'Product', category: 'Category', family: 'Family', customer: 'Customer', salesperson: 'Salesperson', warehouse: 'Warehouse', month: 'Month' };
const DIMS = Object.keys(DIM_LABEL) as Dim[];
/** Where a click on a row goes next: the dimension that usually explains it, skipping those already chosen. */
const NEXT: Record<Dim, Dim[]> = {
  product: ['customer', 'month', 'salesperson', 'warehouse'],
  category: ['product', 'customer', 'month'],
  family: ['product', 'customer', 'month'],
  customer: ['product', 'category', 'month'],
  salesperson: ['customer', 'product', 'month'],
  warehouse: ['product', 'customer', 'month'],
  month: ['product', 'customer', 'category'],
};
const SORTS: [Measure, string][] = [
  ['sales', 'Sales'],
  ['margin', 'Margin'],
  ['marginPct', 'Margin %'],
  ['cost', 'Cost'],
  ['quantity', 'Quantity'],
];
const COMPARES: [Compare, string][] = [
  ['year', 'Same period last year'],
  ['period', 'Previous period'],
  ['none', 'No comparison'],
];

// ---------------------------------------------------------------- periods
const iso = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const PERIODS: [string, string][] = [
  ['last-12-months', 'Last 12 months'],
  ['this-month', 'This month'],
  ['last-month', 'Last month'],
  ['this-quarter', 'This quarter'],
  ['last-quarter', 'Last quarter'],
  ['this-fy', 'This financial year'],
  ['last-fy', 'Last financial year'],
  ['this-year', 'This calendar year'],
  ['custom', 'Dates of my choice'],
];
/** A named period on the server's date (the financial year starts on 1 July, as in Australia). */
export function periodDates(key: string, today: string, from?: string, to?: string): { from: string; to: string } {
  const [y, m] = today.split('-').map(Number);
  const q = Math.floor((m - 1) / 3);
  const fy = m >= 7 ? y : y - 1;
  switch (key) {
    case 'this-month':
      return { from: iso(y, m, 1), to: today };
    case 'last-month': {
      const [py, pm] = m === 1 ? [y - 1, 12] : [y, m - 1];
      return { from: iso(py, pm, 1), to: iso(py, pm, lastDay(py, pm)) };
    }
    case 'this-quarter':
      return { from: iso(y, q * 3 + 1, 1), to: today };
    case 'last-quarter': {
      const [py, pq] = q === 0 ? [y - 1, 3] : [y, q - 1];
      return { from: iso(py, pq * 3 + 1, 1), to: iso(py, pq * 3 + 3, lastDay(py, pq * 3 + 3)) };
    }
    case 'this-fy':
      return { from: iso(fy, 7, 1), to: today };
    case 'last-fy':
      return { from: iso(fy - 1, 7, 1), to: iso(fy, 6, 30) };
    case 'this-year':
      return { from: iso(y, 1, 1), to: today };
    case 'custom':
      if (from && to) return { from, to };
      return { from: iso(y, m, 1), to: today };
    default:
      return { from: iso(m === 12 ? y : y - 1, m === 12 ? 1 : m + 1, 1), to: today };
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthText = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
const dateText = (d: string) => `${Number(d.slice(8, 10))} ${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;
const pctText = (n: number | null) => (n === null ? '' : `${n.toLocaleString('en-AU', { maximumFractionDigits: 1 })}%`);
function compact(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(cents / 100);
  } catch {
    return String(Math.round(cents / 100));
  }
}

// ---------------------------------------------------------------- state in the address (so a view can be linked)
function useAnalysisState() {
  const [params, setParams] = useSearchParams();
  const filters: Filter[] = params.getAll('f').flatMap((s) => {
    const [d, key, ...label] = s.split('~');
    return DIMS.includes(d as Dim) && key ? [{ dimension: d as Dim, key, label: label.join('~') || undefined }] : [];
  });
  const state = {
    period: params.get('p') || 'last-12-months',
    from: params.get('from') || undefined,
    to: params.get('to') || undefined,
    compare: ((params.get('cmp') as Compare) || 'year') as Compare,
    dimension: (DIMS.includes(params.get('dim') as Dim) ? params.get('dim') : 'product') as Dim,
    filters,
    sort: ((params.get('sort') as Measure) || 'sales') as Measure,
    currency: params.get('cur') || undefined,
    view: params.get('view') || '',
  };
  const write = (next: Partial<typeof state>) => {
    const s = { ...state, ...next };
    const n = new URLSearchParams();
    if (s.period !== 'last-12-months') n.set('p', s.period);
    if (s.period === 'custom' && s.from) n.set('from', s.from);
    if (s.period === 'custom' && s.to) n.set('to', s.to);
    if (s.compare !== 'year') n.set('cmp', s.compare);
    if (s.dimension !== 'product') n.set('dim', s.dimension);
    for (const f of s.filters) n.append('f', [f.dimension, f.key, f.label ?? ''].join('~'));
    if (s.sort !== 'sales') n.set('sort', s.sort);
    if (s.currency) n.set('cur', s.currency);
    if (s.view) n.set('view', s.view);
    setParams(n, { replace: false });
  };
  return { state, write };
}

// ---------------------------------------------------------------- the page
export function SalesAnalysis({ companyId }: { companyId: string }) {
  usePageTitle('Sales and margin analysis');
  const { state, write } = useAnalysisState();
  const meta = useQuery({ queryKey: ['erp', companyId, 'analysis', 'meta'], queryFn: () => get<Meta>(erpPath(companyId, '/analysis/meta')) });
  const today = meta.data?.today ?? new Date().toISOString().slice(0, 10);
  const dates = periodDates(state.period, today, state.from, state.to);
  const spec = { from: dates.from, to: dates.to, compare: state.compare, dimension: state.dimension, filters: state.filters, sort: state.sort, ...(state.currency ? { currency: state.currency } : {}), limit: 500 };
  const result = useQuery({
    queryKey: ['erp', companyId, 'analysis', 'query', spec],
    queryFn: () => post<Result>(erpPath(companyId, '/analysis/query'), spec),
    enabled: !!meta.data && dates.from <= dates.to,
    placeholderData: keepPreviousData,
  });
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  if (meta.error) return <ErrorBox error={meta.error} retry={() => meta.refetch()} />;
  if (!meta.data) return <Loading label="Opening the analysis…" />;
  const r = result.data;
  const cur = r?.currency ?? state.currency ?? meta.data.currencies[0] ?? 'AUD';
  const drillTo = (row: Row) => {
    const used = new Set<Dim>([...state.filters.map((f) => f.dimension), state.dimension]);
    const next = NEXT[state.dimension].find((d) => !used.has(d)) ?? DIMS.find((d) => !used.has(d));
    if (!next) return;
    write({ filters: [...state.filters, { dimension: state.dimension, key: row.key, label: row.label }], dimension: next, view: '' });
  };
  const canDrill = state.filters.length < 6 && DIMS.some((d) => d !== state.dimension && !state.filters.some((f) => f.dimension === d));
  const exportCsv = async () => {
    try {
      const blob = await postForBlob(erpPath(companyId, '/analysis/query?format=csv'), spec);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-analysis-${state.dimension}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const viewSpec: ViewSpec = { period: state.period, ...(state.period === 'custom' ? { from: dates.from, to: dates.to } : {}), compare: state.compare, dimension: state.dimension, filters: state.filters, sort: state.sort, ...(state.currency ? { currency: state.currency } : {}) };

  return (
    <div className="erp-an">
      <div className="erp-an-bar" role="group" aria-label="What to analyse">
        <label className="erp-an-field">
          <span>Period</span>
          <select className="input" value={state.period} onChange={(e) => write({ period: e.target.value, ...(e.target.value === 'custom' ? { from: dates.from, to: dates.to } : {}), view: '' })}>
            {PERIODS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        {state.period === 'custom' ? (
          <>
            <label className="erp-an-field"><span>From</span><input className="input" type="date" value={dates.from} max={dates.to} onChange={(e) => e.target.value && write({ from: e.target.value, view: '' })} /></label>
            <label className="erp-an-field"><span>To</span><input className="input" type="date" value={dates.to} min={dates.from} onChange={(e) => e.target.value && write({ to: e.target.value, view: '' })} /></label>
          </>
        ) : null}
        <label className="erp-an-field">
          <span>Compare with</span>
          <select className="input" value={state.compare} onChange={(e) => write({ compare: e.target.value as Compare, view: '' })}>
            {COMPARES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        {(r?.currencies.length ?? meta.data.currencies.length) > 1 ? (
          <label className="erp-an-field">
            <span>Currency</span>
            <select className="input" value={cur} onChange={(e) => write({ currency: e.target.value, view: '' })}>
              {(r?.currencies ?? meta.data.currencies).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        ) : null}
        <SavedViews companyId={companyId} selected={state.view} canManage={meta.data.canManageViews} onApply={(v) => write({ period: v.spec.period, from: v.spec.from, to: v.spec.to, compare: v.spec.compare, dimension: v.spec.dimension, filters: v.spec.filters, sort: v.spec.sort, currency: v.spec.currency, view: v.id })} onClear={() => write({ view: '' })} spec={viewSpec} />
        <span className="grow" />
        <button type="button" className="btn" onClick={() => setSaving(true)}><Icon name="star" /> Save view</button>
        <button type="button" className="btn" onClick={exportCsv} disabled={!r}><Icon name="download" /> Export CSV</button>
      </div>
      <p className="muted small erp-an-dates">
        {dateText(dates.from)} to {dateText(dates.to)}
        {r?.compare ? <> against {dateText(r.compare.from)} to {dateText(r.compare.to)}</> : null}
        {dates.from > dates.to ? <span className="erp-neg"> The period starts after it ends.</span> : null}
      </p>

      <nav className="erp-an-trail" aria-label="Drill-down">
        <button type="button" className={`erp-an-crumb${state.filters.length ? '' : ' current'}`} onClick={() => write({ filters: [], view: '' })} aria-current={state.filters.length ? undefined : 'page'}>
          All sales
        </button>
        {state.filters.map((f, i) => (
          <span key={`${f.dimension}-${f.key}`} className="erp-an-step">
            <Icon name="chevronRight" size={12} />
            <button type="button" className={`erp-an-crumb${i === state.filters.length - 1 ? ' current' : ''}`} onClick={() => write({ filters: state.filters.slice(0, i + 1), view: '' })} aria-current={i === state.filters.length - 1 ? 'page' : undefined}>
              <span className="muted">{DIM_LABEL[f.dimension]}:</span> {f.label ?? f.key}
            </button>
            <button type="button" className="btn ghost sm icon-only" aria-label={`Remove ${DIM_LABEL[f.dimension]} ${f.label ?? ''}`} onClick={() => write({ filters: state.filters.filter((_, j) => j !== i), view: '' })}>
              <Icon name="x" size={12} />
            </button>
          </span>
        ))}
      </nav>

      {result.error ? <ErrorBox error={result.error} retry={() => result.refetch()} /> : !r ? <Loading /> : (
        <div className={result.isFetching ? 'erp-an-body refreshing' : 'erp-an-body'}>
          <Tiles r={r} currency={cur} compareName={state.compare === 'year' ? 'the same period last year' : 'the previous period'} />
          {r.totals.uncostedSalesCents > 0 ? (
            <p className="muted small">{money(r.totals.uncostedSalesCents, cur)} of these sales left no stock (services or products not kept in stock), so it has no cost. Margin and margin % are worked out on the rest.</p>
          ) : null}
          <Section title="By month">
            <TrendChart trend={r.trend} currency={cur} compare={!!r.compare} />
          </Section>
          <Section
            title={`By ${DIM_LABEL[state.dimension].toLowerCase()}`}
            actions={
              <label className="erp-an-field inline">
                <span>Sort by</span>
                <select className="input" value={state.sort} onChange={(e) => write({ sort: e.target.value as Measure, view: '' })} disabled={state.dimension === 'month'}>
                  {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </label>
            }
          >
            <div className="erp-an-dims" role="tablist" aria-label="Analyse by">
              {DIMS.filter((d) => !state.filters.some((f) => f.dimension === d)).map((d) => (
                <button key={d} type="button" role="tab" aria-selected={state.dimension === d} className={`erp-an-dim${state.dimension === d ? ' active' : ''}`} onClick={() => write({ dimension: d, view: '' })}>
                  {DIM_LABEL[d]}
                </button>
              ))}
            </div>
            <Grid companyId={companyId} r={r} currency={cur} dimension={state.dimension} showQty={state.dimension === 'product' || state.filters.some((f) => f.dimension === 'product')} onDrill={canDrill ? drillTo : null} />
          </Section>
          <p className="muted small">{meta.data.source} Cost is what the dispatch took out of stock at its valuation.{r.truncated ? ' The period holds more than 100,000 shipment lines; choose a shorter one for every line.' : ''}</p>
        </div>
      )}
      {saving ? <SaveViewDialog companyId={companyId} spec={viewSpec} onClose={() => setSaving(false)} onSaved={(id) => write({ view: id })} /> : null}
    </div>
  );
}

// ---------------------------------------------------------------- headline figures
function Delta({ now, before, points, name }: { now: number | null; before: number | null; points?: boolean; name: string }) {
  if (now === null || before === null) return <span className="erp-an-delta muted">No figure for {name}</span>;
  if (points) {
    const d = Math.round((now - before) * 10) / 10;
    const up = d > 0;
    return (
      <span className={`erp-an-delta ${d === 0 ? 'muted' : up ? 'up' : 'down'}`}>
        {d !== 0 ? <Icon name={up ? 'arrowUp' : 'arrowDown'} size={12} /> : null} {d > 0 ? '+' : ''}{d.toLocaleString('en-AU')} points against {name}
      </span>
    );
  }
  if (before === 0) return <span className="erp-an-delta muted">Nothing in {name}</span>;
  const d = Math.round(((now - before) / Math.abs(before)) * 1000) / 10;
  const up = d > 0;
  return (
    <span className={`erp-an-delta ${d === 0 ? 'muted' : up ? 'up' : 'down'}`}>
      {d !== 0 ? <Icon name={up ? 'arrowUp' : 'arrowDown'} size={12} /> : null} {d > 0 ? '+' : ''}{d.toLocaleString('en-AU')}% against {name}
    </span>
  );
}

function Tiles({ r, currency, compareName }: { r: Result; currency: string; compareName: string }) {
  const t = r.totals;
  const c = r.compareTotals;
  return (
    <div className="erp-an-tiles">
      <div className="erp-an-tile">
        <span className="erp-an-label">Sales before tax</span>
        <strong className="erp-an-value">{money(t.salesCents, currency)}</strong>
        {c ? <Delta now={t.salesCents} before={c.salesCents} name={compareName} /> : <span className="erp-an-delta muted">{t.lines} shipment line{t.lines === 1 ? '' : 's'}</span>}
      </div>
      <div className="erp-an-tile">
        <span className="erp-an-label">Cost of goods dispatched</span>
        <strong className="erp-an-value">{money(t.costCents, currency)}</strong>
        <span className="erp-an-delta muted">From the stock ledger</span>
      </div>
      <div className="erp-an-tile">
        <span className="erp-an-label">Margin</span>
        <strong className={`erp-an-value${t.marginCents < 0 ? ' erp-neg' : ''}`}>{money(t.marginCents, currency)}</strong>
        {c ? <Delta now={t.marginCents} before={c.marginCents} name={compareName} /> : null}
      </div>
      <div className="erp-an-tile">
        <span className="erp-an-label">Margin %</span>
        <strong className="erp-an-value">{t.marginPct === null ? 'No cost yet' : pctText(t.marginPct)}</strong>
        {c ? <Delta now={t.marginPct} before={c.marginPct} points name={compareName} /> : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- the months as a chart
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(720);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** A column with a 4 px rounded top, square at the baseline. */
function column(x: number, y: number, w: number, base: number) {
  const h = base - y;
  if (h <= 0.5) return '';
  const r = Math.min(4, h, w / 2);
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`;
}

function TrendChart({ trend, currency, compare }: { trend: Result['trend']; currency: string; compare: boolean }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);
  const H = 220;
  const pad = { l: 64, r: 12, t: 14, b: 30 };
  const iw = width - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(0, ...trend.map((m) => m.salesCents), ...trend.map((m) => (compare ? (m.compareSalesCents ?? 0) : 0)));
  const top = niceTop(max, true);
  const ticks = max > 0 ? [0, top / 4, top / 2, (top * 3) / 4, top] : [0];
  const y = (v: number) => pad.t + ih - (Math.max(0, v) / top) * ih;
  const band = iw / Math.max(1, trend.length);
  const bw = Math.min(24, band * 0.6);
  const cx = (i: number) => pad.l + band * i + band / 2;
  const every = trend.length > 18 ? 3 : trend.length > 9 && width < 640 ? 2 : 1;
  const line = compare ? trend.map((m, i) => `${i ? 'L' : 'M'}${cx(i)},${y(m.compareSalesCents ?? 0)}`).join('') : '';
  const a = active === null ? null : trend[active];
  const tipLeft = active === null ? 0 : Math.min(Math.max(cx(active) - 90, 0), width - 180);
  const summary = `Sales by month: ${trend.map((m) => `${monthText(m.month)} ${money(m.salesCents, currency)}`).join(', ')}`;
  return (
    <div className="erp-an-chart" ref={ref}>
      <div className="erp-an-legend">
        {compare ? (
          <>
            <span className="erp-an-key"><svg width="12" height="12" aria-hidden="true"><rect width="12" height="12" rx="3" className="erp-an-s1" /></svg> This period</span>
            <span className="erp-an-key"><svg width="16" height="12" aria-hidden="true"><line x1="0" y1="6" x2="16" y2="6" className="erp-an-s2-line" /></svg> Comparison period</span>
          </>
        ) : <span className="muted small">Sales before tax, by month of dispatch</span>}
        <span className="grow" />
        <button type="button" className="btn ghost sm" onClick={() => setAsTable(!asTable)} aria-pressed={asTable}>{asTable ? 'Show the chart' : 'Show as a table'}</button>
      </div>
      {asTable ? (
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead><tr><th>Month</th><th className="num">Sales</th><th className="num">Margin</th>{compare ? <><th>Compared with</th><th className="num">Sales then</th></> : null}</tr></thead>
            <tbody>{trend.map((m) => <tr key={m.month}><td>{monthText(m.month)}</td><td className="num">{money(m.salesCents, currency)}</td><td className="num">{money(m.marginCents, currency)}</td>{compare ? <><td>{m.compareMonth ? monthText(m.compareMonth) : ''}</td><td className="num">{money(m.compareSalesCents ?? 0, currency)}</td></> : null}</tr>)}</tbody>
          </table>
        </div>
      ) : (
        <div className="erp-an-plot">
          <svg width={width} height={H} role="img" aria-label={summary} className="erp-an-svg" onPointerLeave={() => setActive(null)}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} className={t === 0 ? 'erp-an-base' : 'erp-an-grid'} />
                <text x={pad.l - 8} y={y(t) + 4} textAnchor="end">{t === 0 ? '0' : compact(t, currency)}</text>
              </g>
            ))}
            {trend.map((m, i) => (
              <path key={m.month} d={column(cx(i) - bw / 2, y(m.salesCents), bw, y(0))} className={`erp-an-s1${active !== null && active !== i ? ' dim' : ''}`} />
            ))}
            {compare ? <path d={line} className="erp-an-s2-line" fill="none" /> : null}
            {compare ? trend.map((m, i) => <circle key={m.month} cx={cx(i)} cy={y(m.compareSalesCents ?? 0)} r={4} className="erp-an-s2-dot" />) : null}
            {trend.map((m, i) => (i % every === 0 ? <text key={m.month} x={cx(i)} y={H - 10} textAnchor="middle">{i === 0 || m.month.endsWith('-01') ? monthText(m.month) : MONTHS[Number(m.month.slice(5, 7)) - 1]}</text> : null))}
            {trend.map((m, i) => (
              <rect
                key={m.month}
                x={pad.l + band * i}
                y={pad.t}
                width={band}
                height={ih}
                className="erp-an-hit"
                tabIndex={0}
                aria-label={`${monthText(m.month)}: ${money(m.salesCents, currency)}${compare ? `, comparison ${money(m.compareSalesCents ?? 0, currency)}` : ''}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            ))}
          </svg>
          {a ? (
            <div className="erp-an-tip" style={{ left: tipLeft }} role="status">
              <strong>{money(a.salesCents, currency)}</strong> <span className="muted">{monthText(a.month)}</span>
              <div className="small"><span className="muted">Margin</span> {money(a.marginCents, currency)}</div>
              {compare ? <div className="small"><svg width="12" height="6" aria-hidden="true"><line x1="0" y1="3" x2="12" y2="3" className="erp-an-s2-line" /></svg> <strong>{money(a.compareSalesCents ?? 0, currency)}</strong> <span className="muted">{a.compareMonth ? monthText(a.compareMonth) : ''}</span></div> : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- the grid
function Grid({ companyId, r, currency, dimension, showQty, onDrill }: { companyId: string; r: Result; currency: string; dimension: Dim; showQty: boolean; onDrill: ((row: Row) => void) | null }) {
  if (!r.rows.length) return <p className="muted">Nothing was dispatched to customers in this period{r.compare ? ' or the one it is compared with' : ''}. Sales appear here once a shipment is dispatched in Warehouse.</p>;
  const top = Math.max(1, ...r.rows.map((x) => x.salesCents));
  const partly = r.rows.some((x) => x.uncostedSalesCents > 0);
  return (
    <>
      <div className="crm-table-scroll">
        <table className="data-table responsive erp-an-grid-table">
          <thead>
            <tr>
              <th>{DIM_LABEL[dimension]}</th>
              {showQty ? <th className="num">Quantity</th> : null}
              <th className="num">Sales</th>
              <th aria-label="Share of the largest" />
              <th className="num">Cost</th>
              <th className="num">Margin</th>
              <th className="num">Margin %</th>
              {r.compare ? <><th className="num">Sales then</th><th className="num">Change</th></> : null}
            </tr>
          </thead>
          <tbody>
            {r.rows.map((x) => (
              <tr key={x.key}>
                <td data-label={DIM_LABEL[dimension]}>
                  {onDrill && x.salesCents !== 0 ? (
                    <button type="button" className="erp-an-drill" onClick={() => onDrill(x)} title="Open this row by another dimension">
                      {dimension === 'month' ? monthText(x.key) : x.label}
                    </button>
                  ) : dimension === 'month' ? monthText(x.key) : x.label}
                  {dimension === 'product' ? <Link className="erp-an-open" to={productsPage(companyId, `/${encodeURIComponent(x.key)}`)} aria-label={`Open product ${x.label}`}><Icon name="external" size={12} /></Link> : null}
                </td>
                {showQty ? <td data-label="Quantity" className="num">{qty(x.qty)} {x.uom}</td> : null}
                <td data-label="Sales" className="num">{money(x.salesCents, currency)}</td>
                <td className="erp-an-share" aria-hidden="true"><svg width="80" height="8"><rect width="80" height="8" rx="4" className="erp-an-track" /><rect width={Math.max(0, (x.salesCents / top) * 80)} height="8" rx="4" className="erp-an-s1" /></svg></td>
                <td data-label="Cost" className="num">{money(x.costCents, currency)}</td>
                <td data-label="Margin" className={`num${x.marginCents < 0 ? ' erp-neg' : ''}`}>{money(x.marginCents, currency)}</td>
                <td data-label="Margin %" className="num">{pctText(x.marginPct)}{x.uncostedSalesCents > 0 ? <span className="muted" title="Part of these sales has no cost"> *</span> : null}</td>
                {r.compare ? <><td data-label="Sales then" className="num">{money(x.compare?.salesCents ?? 0, currency)}</td><td data-label="Change" className="num"><Change pct={x.changePct} was={x.compare?.salesCents ?? 0} /></td></> : null}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total{r.rowCount > r.rows.length ? ` (first ${r.rows.length} of ${r.rowCount})` : ''}</th>
              {showQty ? <td className="num">{r.rows.every((x) => x.uom === r.rows[0].uom) ? `${qty(r.totals.qty)} ${r.rows[0].uom}` : ''}</td> : null}
              <td className="num">{money(r.totals.salesCents, currency)}</td>
              <td />
              <td className="num">{money(r.totals.costCents, currency)}</td>
              <td className="num">{money(r.totals.marginCents, currency)}</td>
              <td className="num">{pctText(r.totals.marginPct)}</td>
              {r.compare ? <><td className="num">{money(r.compareTotals?.salesCents ?? 0, currency)}</td><td className="num"><Change pct={r.compareTotals && r.compareTotals.salesCents ? Math.round(((r.totals.salesCents - r.compareTotals.salesCents) / Math.abs(r.compareTotals.salesCents)) * 1000) / 10 : null} was={r.compareTotals?.salesCents ?? 0} /></td></> : null}
            </tr>
          </tfoot>
        </table>
      </div>
      {partly ? <p className="muted small">* Part of these sales left no stock, so it has no cost; its margin % is worked out on the rest.</p> : null}
      {onDrill ? <p className="muted small">Click a row to see it by another dimension. The trail above goes back.</p> : null}
    </>
  );
}

function Change({ pct, was }: { pct: number | null; was: number }) {
  if (pct === null) return <span className="muted">{was === 0 ? 'New' : ''}</span>;
  if (pct === 0) return <span className="muted">0%</span>;
  return (
    <span className={pct > 0 ? 'erp-an-up' : 'erp-an-down'}>
      <Icon name={pct > 0 ? 'arrowUp' : 'arrowDown'} size={12} /> {pct > 0 ? '+' : ''}{pctText(pct)}
    </span>
  );
}

// ---------------------------------------------------------------- saved views
function SavedViews({ companyId, selected, canManage, onApply, onClear, spec }: { companyId: string; selected: string; canManage: boolean; onApply: (v: SavedView) => void; onClear: () => void; spec: ViewSpec }) {
  const q = useQuery({ queryKey: ['erp', companyId, 'analysis', 'views'], queryFn: () => get<{ views: SavedView[] }>(erpPath(companyId, '/analysis/views')) });
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const views = q.data?.views ?? [];
  const current = views.find((v) => v.id === selected);
  const mine = views.filter((v) => v.mine);
  const shared = views.filter((v) => !v.mine);
  const refresh = () => qc.invalidateQueries({ queryKey: ['erp', companyId, 'analysis', 'views'] });
  const update = async () => {
    if (!current) return;
    try {
      await patch(erpPath(companyId, `/analysis/views/${current.id}`), { spec });
      toast(`Saved the changes to ${current.name}`);
      refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const remove = async () => {
    if (!current) return;
    if (!(await confirm({ title: `Delete the view ${current.name}?`, message: current.shared ? 'It is shared, so it goes for everyone in the company. The figures are not changed.' : 'Only the saved view goes. The figures are not changed.', confirmLabel: 'Delete', danger: true }))) return;
    try {
      await del(erpPath(companyId, `/analysis/views/${current.id}`));
      onClear();
      refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <>
      <label className="erp-an-field">
        <span>Saved view</span>
        <select className="input" value={current ? current.id : ''} onChange={(e) => { const v = views.find((x) => x.id === e.target.value); if (v) onApply(v); else onClear(); }}>
          <option value="">{views.length ? 'Choose a saved view' : 'No saved views yet'}</option>
          {mine.length ? <optgroup label="Mine">{mine.map((v) => <option key={v.id} value={v.id}>{v.name}{v.shared ? ' (shared)' : ''}</option>)}</optgroup> : null}
          {shared.length ? <optgroup label="Shared in the company">{shared.map((v) => <option key={v.id} value={v.id}>{v.name}, by {v.ownerName}</option>)}</optgroup> : null}
        </select>
      </label>
      {current?.mine ? <button type="button" className="btn ghost" onClick={update}>Save changes to this view</button> : null}
      {current && (current.mine || canManage) ? <button type="button" className="btn ghost" onClick={remove} aria-label={`Delete the view ${current.name}`}><Icon name="trash" /></button> : null}
    </>
  );
}

function SaveViewDialog({ companyId, spec, onClose, onSaved }: { companyId: string; spec: ViewSpec; onClose: () => void; onSaved: (id: string) => void }) {
  const [name, setName] = useState('');
  const [shared, setShared] = useState(false);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const toast = useToast();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const out = await post<{ view: SavedView }>(erpPath(companyId, '/analysis/views'), { name, shared, spec });
      await qc.invalidateQueries({ queryKey: ['erp', companyId, 'analysis', 'views'] });
      toast(`Saved the view ${out.view.name}`);
      onSaved(out.view.id);
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
      setBusy(false);
    }
  };
  return (
    <Modal
      title="Save this view"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="erp-an-save" className="btn primary" disabled={busy || !name.trim()}>Save view</button>
        </>
      }
    >
      <form id="erp-an-save" className="stack" onSubmit={submit}>
        <p className="muted small">A view keeps the period, the comparison, the dimension, the drill-down and the sort. Named periods move with the date: Last month is always last month.</p>
        <label className="field">
          <span>Name</span>
          <input className="input" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="Margin by customer" required />
        </label>
        <label className="row erp-toggle">
          <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} /> Share it with everyone in the company who can see reports
        </label>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------- stock against sales
interface StockRow {
  productId: string;
  number: string;
  name: string;
  category: string;
  uom: string;
  onHand: number;
  reserved: number;
  available: number;
  valueCents: number | null;
  reorderPoint: number | null;
  soldQty: number;
  costOfSalesCents: number;
  coverDays: number | null;
  status: 'ok' | 'reorder' | 'not_moving' | 'slow';
}
const STATUS: Record<StockRow['status'], [string, string]> = {
  reorder: ['At or below the reorder point', 'danger'],
  not_moving: ['Not moving', 'warning'],
  slow: ['Slow: over 180 days of cover', 'warning'],
  ok: ['Moving', 'success'],
};

export function StockAnalysis({ companyId }: { companyId: string }) {
  usePageTitle('Stock against sales');
  const [params, setParams] = useSearchParams();
  const days = [30, 90, 180, 365].includes(Number(params.get('days'))) ? Number(params.get('days')) : 90;
  const show = (params.get('show') as StockRow['status'] | null) ?? null;
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const q = useQuery({ queryKey: ['erp', companyId, 'analysis', 'stock', days], queryFn: () => get<{ days: number; rows: StockRow[]; totals: { valueCents: number; toReorder: number; notMoving: number; slow: number }; note: string }>(erpPath(companyId, `/analysis/stock?days=${days}`)), placeholderData: keepPreviousData });
  const rows = useMemo(() => (q.data?.rows ?? []).filter((r) => !show || r.status === show), [q.data, show]);
  const chip = (key: StockRow['status'] | null, label: ReactNode) => (
    <button type="button" className={`erp-an-dim${show === key ? ' active' : ''}`} aria-pressed={show === key} onClick={() => set('show', key ?? '')}>{label}</button>
  );
  return (
    <Section title="Stock against sales" actions={<CsvLink companyId={companyId} path={`/analysis/stock?days=${days}`} />}>
      <div className="erp-an-bar">
        <label className="erp-an-field">
          <span>Sales over</span>
          <select className="input" value={days} onChange={(e) => set('days', e.target.value === '90' ? '' : e.target.value)}>
            {[30, 90, 180, 365].map((d) => <option key={d} value={d}>The last {d} days</option>)}
          </select>
        </label>
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : (
        <>
          <div className="erp-an-tiles">
            <div className="erp-an-tile"><span className="erp-an-label">Stock value</span><strong className="erp-an-value">{money(q.data.totals.valueCents)}</strong><span className="erp-an-delta muted">Quarantine left out of available</span></div>
            <div className="erp-an-tile"><span className="erp-an-label">To reorder</span><strong className="erp-an-value">{q.data.totals.toReorder}</strong><span className="erp-an-delta muted">At or below the reorder point</span></div>
            <div className="erp-an-tile"><span className="erp-an-label">Not moving</span><strong className="erp-an-value">{q.data.totals.notMoving}</strong><span className="erp-an-delta muted">In stock, nothing dispatched</span></div>
            <div className="erp-an-tile"><span className="erp-an-label">Slow</span><strong className="erp-an-value">{q.data.totals.slow}</strong><span className="erp-an-delta muted">Over 180 days of cover</span></div>
          </div>
          <div className="erp-an-dims" role="group" aria-label="Show">
            {chip(null, 'All')}
            {chip('reorder', 'To reorder')}
            {chip('not_moving', 'Not moving')}
            {chip('slow', 'Slow')}
            {chip('ok', 'Moving')}
          </div>
          {!rows.length ? <p className="muted">{q.data.rows.length ? 'No product is in this group.' : 'No product is in stock or has been dispatched yet.'}</p> : (
            <div className="crm-table-scroll">
              <table className="data-table responsive">
                <thead><tr><th>Product</th><th>Category</th><th className="num">On hand</th><th className="num">Reserved</th><th className="num">Available</th><th className="num">Value</th><th className="num">Reorder point</th><th className="num">Dispatched</th><th className="num">Days of cover</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.productId}>
                      <td data-label="Product"><Link to={productsPage(companyId, `/${encodeURIComponent(r.productId)}`)}>{r.number}</Link> {r.name}</td>
                      <td data-label="Category">{r.category}</td>
                      <td data-label="On hand" className="num">{qty(r.onHand)} {r.uom}</td>
                      <td data-label="Reserved" className="num">{qty(r.reserved)}</td>
                      <td data-label="Available" className="num">{qty(r.available)}</td>
                      <td data-label="Value" className="num">{money(r.valueCents)}</td>
                      <td data-label="Reorder point" className="num">{r.reorderPoint === null ? '' : qty(r.reorderPoint)}</td>
                      <td data-label="Dispatched" className="num">{qty(r.soldQty)}</td>
                      <td data-label="Days of cover" className="num">{r.coverDays === null ? '' : r.coverDays.toLocaleString('en-AU')}</td>
                      <td data-label="Status"><span className={`badge ${STATUS[r.status][1]}`}>{STATUS[r.status][0]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="muted small">{q.data.note} Stock values are in the company's own currency, at their valuation in Warehouse.</p>
        </>
      )}
    </Section>
  );
}
