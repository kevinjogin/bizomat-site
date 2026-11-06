// Admin time-series charts: crisp SVG sized to the container (no stretched
// text), multiple series, hover read-out, sparse axis labels.

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Point } from './api';

export interface Series {
  name: string;
  color: string;
  points: Point[];
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(600);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.floor(e.contentRect.width))));
    ro.observe(el);
    setW(Math.max(200, Math.floor(el.getBoundingClientRect().width)));
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function shortDate(d: string, span: number) {
  const dt = new Date(d + 'T00:00:00Z');
  return dt.toLocaleDateString(undefined, span > 180 ? { month: 'short', year: '2-digit', timeZone: 'UTC' } : { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function TimeChart({ series, kind = 'bar', height = 200, label }: { series: Series[]; kind?: 'bar' | 'line'; height?: number; label: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const dates = series[0]?.points.map((p) => p.date) ?? [];
  const n = dates.length;
  const max = niceMax(Math.max(0, ...series.flatMap((s) => s.points.map((p) => p.value))));
  const pad = { l: 34, r: 8, t: 10, b: 24 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const slot = n ? iw / n : iw;
  const x = (i: number) => pad.l + slot * i + slot / 2;
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 70))));
  const total = series.map((s) => s.points.reduce((a, p) => a + p.value, 0));
  const summary = `${label}: ${series.map((s, i) => `${s.name} total ${total[i]}`).join(', ')}`;
  if (!n) return <div className="ac-empty">No data in this range</div>;
  const barW = Math.max(1.5, Math.min(26, (slot * 0.72) / series.length));
  return (
    <div ref={ref} className="ac-chart" onMouseLeave={() => setHover(null)}>
      <svg width={width} height={height} role="img" aria-label={summary}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={width - pad.r} y1={y(f * max)} y2={y(f * max)} className="ac-grid" />
            <text x={pad.l - 6} y={y(f * max) + 4} textAnchor="end" className="ac-axis">
              {Math.round(f * max).toLocaleString()}
            </text>
          </g>
        ))}
        {dates.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={d} x={x(i)} y={height - 6} textAnchor="middle" className="ac-axis">
              {shortDate(d, n)}
            </text>
          ) : null,
        )}
        {kind === 'bar'
          ? series.map((s, si) =>
              s.points.map((p, i) =>
                p.value > 0 ? (
                  <rect key={`${si}-${i}`} x={x(i) - (barW * series.length) / 2 + si * barW} y={y(p.value)} width={barW - 0.5} height={pad.t + ih - y(p.value)} rx={Math.min(3, barW / 3)} fill={s.color} opacity={hover == null || hover === i ? 1 : 0.55} />
                ) : null,
              ),
            )
          : series.map((s, si) => {
              const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
              return (
                <g key={si}>
                  {si === 0 ? <path d={`${d} L${x(n - 1)},${pad.t + ih} L${x(0)},${pad.t + ih} Z`} fill={s.color} opacity={0.1} /> : null}
                  <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
                  {n <= 45 ? s.points.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.value)} r={hover === i ? 4 : 2.5} fill={s.color} />) : null}
                </g>
              );
            })}
        {hover != null ? <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} className="ac-cursor" /> : null}
        {dates.map((d, i) => (
          <rect key={d} x={pad.l + slot * i} y={pad.t} width={slot} height={ih} fill="transparent" onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)} />
        ))}
      </svg>
      <div className="ac-chart-foot">
        <div className="ac-legend">
          {series.map((s, i) => (
            <span key={s.name}>
              <i style={{ background: s.color }} /> {s.name} <b>{total[i].toLocaleString()}</b>
            </span>
          ))}
        </div>
        <div className="ac-hover" aria-live="polite">
          {hover != null ? (
            <>
              {new Date(dates[hover] + 'T00:00:00Z').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}:{' '}
              {series.map((s) => `${s.name} ${s.points[hover]?.value ?? 0}`).join(' · ')}
            </>
          ) : (
            <span className="muted">Hover a day for details</span>
          )}
        </div>
      </div>
    </div>
  );
}

/** 90-day activity heatmap (one square per UTC day). */
export function ActivityStrip({ days }: { days: { date: string; heartbeats: number }[] }) {
  const cells = useMemo(() => {
    const m = new Map(days.map((d) => [d.date, d.heartbeats]));
    const out: { date: string; active: boolean; beats: number }[] = [];
    const today = Date.parse(new Date().toISOString().slice(0, 10));
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today - i * 86_400_000).toISOString().slice(0, 10);
      out.push({ date: d, active: m.has(d), beats: m.get(d) ?? 0 });
    }
    return out;
  }, [days]);
  const activeDays = cells.filter((c) => c.active).length;
  const level = (c: { active: boolean; beats: number }) => (!c.active ? 0 : c.beats >= 30 ? 4 : c.beats >= 10 ? 3 : c.beats >= 1 ? 2 : 1);
  return (
    <div>
      <div className="ac-strip" role="img" aria-label={`Active on ${activeDays} of the last 90 days`}>
        {cells.map((c) => (
          <span key={c.date} className={`l${level(c)}`} title={`${c.date}: ${c.active ? `active${c.beats ? `, ${c.beats} heartbeat${c.beats === 1 ? '' : 's'}` : ''}` : 'no activity'}`} />
        ))}
      </div>
      <div className="muted small" style={{ marginTop: 6 }}>
        Active on <b>{activeDays}</b> of the last 90 days (UTC). Darker = more minutes with the app open.
      </div>
    </div>
  );
}
