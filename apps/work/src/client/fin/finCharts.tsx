// Charts for Finance that the shared ones (src/client/components/charts/Charts.tsx) do not draw: two series side by
// side (income and expenses) and a line that can go below zero (cash). Values are in dollars (major units); the
// caller formats tooltips. Colours: the CRM's categorical order, checked for colour-blind separation on each theme's
// surface (dataviz validator: blue and orange pass in light and dark); a single series is BIZOMAT teal.
import { BRAND } from '../lib/brand';

const SERIES_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'];
const SERIES_DARK = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];

/** The i-th categorical colour for the current theme (fixed order, never cycled: past eight, callers fold into Other). */
export function seriesColor(i: number): string {
  const dark = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark';
  const list = dark ? SERIES_DARK : SERIES_LIGHT;
  return list[Math.min(i, list.length - 1)];
}

export const TEAL = BRAND.colors.teal;

/** Compact axis label: 1200 -> 1.2k, 2500000 -> 2.5M. */
export function compact(n: number): string {
  const a = Math.abs(n);
  const s = n < 0 ? '-' : '';
  if (a >= 1_000_000) return `${s}${+(a / 1_000_000).toFixed(1)}M`;
  if (a >= 10_000) return `${s}${(a / 1000).toFixed(0)}k`;
  if (a >= 1000) return `${s}${+(a / 1000).toFixed(1)}k`;
  return `${s}${Number.isInteger(a) ? a : a.toFixed(1)}`;
}

/** A round top for an axis: 152,000 -> 200,000. */
function niceTop(max: number): number {
  if (!(max > 0)) return 0;
  const exp = 10 ** Math.floor(Math.log10(max));
  for (const m of [1, 2, 2.5, 4, 5, 6, 8, 10]) if (m * exp >= max * (1 - 1e-9)) return m * exp;
  return 10 * exp;
}

function domain(values: number[]) {
  const max = Math.max(0, ...values);
  const min = Math.min(0, ...values);
  const top = niceTop(max);
  const bottom = -niceTop(-min);
  const span = top - bottom || 1;
  const ticks = [bottom, 0, top].filter((t, i, a) => a.indexOf(t) === i && (t !== bottom || bottom < 0) && (t !== top || top > 0));
  return { top, bottom, span, ticks: ticks.length ? ticks : [0] };
}

export interface GroupDatum {
  key: string;
  label: string;
  values: number[];
}

/** Bars of two (or more) series side by side per group, anchored at zero, with a legend. */
export function GroupedBars({ groups, series, height = 200, format }: { groups: GroupDatum[]; series: { label: string; color: string }[]; height?: number; format: (v: number) => string }) {
  if (!groups.length) return <div className="muted small chart-empty">No data to display</div>;
  const W = 400;
  const pad = { l: 34, b: 24, t: 8, r: 4 };
  const inner = W - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const { top, span, ticks } = domain(groups.flatMap((g) => g.values));
  const y = (v: number) => pad.t + ((top - v) / span) * ih;
  const gw = inner / groups.length;
  const bw = Math.max(2, (gw * 0.76) / series.length - 2);
  const label = (s: string) => (s.length > Math.max(3, Math.floor(gw / 7)) ? s.slice(0, Math.max(3, Math.floor(gw / 7))) : s);
  const summary = groups.map((g) => `${g.label}: ${g.values.map((v, i) => `${series[i]?.label} ${format(v)}`).join(', ')}`).join('; ');
  return (
    <div className="chart">
      {series.length > 1 ? (
        <div className="legend" aria-hidden>
          {series.map((s) => (
            <span key={s.label}>
              <svg width="10" height="10" aria-hidden><rect width="10" height="10" rx="2" fill={s.color} /></svg> {s.label}
            </span>
          ))}
        </div>
      ) : null}
      <svg className="chart-svg" role="img" aria-label={summary} width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--border)" />
            <text x={pad.l - 4} y={y(t) + 4} textAnchor="end">{compact(t)}</text>
          </g>
        ))}
        {groups.map((g, gi) => {
          const x0 = pad.l + gi * gw + gw * 0.12;
          return (
            <g key={g.key}>
              {g.values.map((v, si) => {
                const h = Math.max(1, Math.abs(y(v) - y(0)));
                const yy = v >= 0 ? y(0) - h : y(0);
                return (
                  <rect key={si} x={x0 + si * (bw + 2)} y={yy} width={bw} height={h} rx={2} fill={series[si]?.color ?? TEAL}>
                    <title>{`${g.label}, ${series[si]?.label}: ${format(v)}`}</title>
                  </rect>
                );
              })}
              <text x={pad.l + gi * gw + gw / 2} y={height - 8} textAnchor="middle">{label(g.label)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** One series as a line that may cross zero (a zero line is drawn when it does). */
export function SignedLine({ data, height = 190, format, color = TEAL }: { data: { key: string; label: string; value: number }[]; height?: number; format: (v: number) => string; color?: string }) {
  if (!data.length) return <div className="muted small chart-empty">No data to display</div>;
  const W = 400;
  const pad = { l: 34, b: 24, t: 10, r: 10 };
  const ih = height - pad.t - pad.b;
  const { top, span, ticks } = domain(data.map((d) => d.value));
  const y = (v: number) => pad.t + ((top - v) / span) * ih;
  const step = data.length > 1 ? (W - pad.l - pad.r) / (data.length - 1) : 0;
  const x0 = data.length > 1 ? pad.l : pad.l + (W - pad.l - pad.r) / 2;
  const pts = data.map((d, i) => [x0 + i * step, y(d.value)] as const);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const every = Math.max(1, Math.ceil(data.length / 7));
  return (
    <div className="chart">
      <svg className="chart-svg" role="img" aria-label={data.map((d) => `${d.label} ${format(d.value)}`).join(', ')} width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? 'var(--text-3)' : 'var(--border)'} />
            <text x={pad.l - 4} y={y(t) + 4} textAnchor="end">{compact(t)}</text>
          </g>
        ))}
        <path d={path} fill="none" stroke={color} strokeWidth={2} />
        {pts.map((p, i) => (
          <g key={data[i].key}>
            <circle cx={p[0]} cy={p[1]} r={4} fill={data[i].value < 0 ? 'var(--danger)' : color} stroke="var(--surface)" strokeWidth={1.5}>
              <title>{`${data[i].label}: ${format(data[i].value)}`}</title>
            </circle>
            {i % every === 0 ? <text x={p[0]} y={height - 8} textAnchor="middle">{data[i].label.slice(0, 10)}</text> : null}
          </g>
        ))}
      </svg>
    </div>
  );
}
