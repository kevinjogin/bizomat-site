// Small SVG charts for project controls (no chart library). Values come straight from the server's calculations; a
// missing value (null) leaves a gap instead of being drawn as zero.

export interface Series {
  key: string;
  label: string;
  /** CSS class for the line colour (controls.css: pv, ev, ac, plan). */
  cls: string;
  values: (number | null)[];
}

export function LineChart({ labels, series, height = 200, refLine, format = (v) => String(v), title }: { labels: string[]; series: Series[]; height?: number; refLine?: number; format?: (v: number) => string; title: string }) {
  const W = 640;
  const H = height;
  const pad = { l: 64, r: 12, t: 10, b: 26 };
  const all = series.flatMap((s) => s.values).filter((v): v is number => v != null && Number.isFinite(v));
  if (refLine != null) all.push(refLine);
  if (!labels.length || !all.length) return <p className="pc-unavailable">Not enough data for this chart yet.</p>;
  let lo = Math.min(0, ...all);
  let hi = Math.max(...all);
  if (hi === lo) hi = lo + 1;
  const span = hi - lo;
  hi += span * 0.05;
  if (lo < 0) lo -= span * 0.05;
  const n = labels.length;
  const x = (i: number) => pad.l + (n === 1 ? (W - pad.l - pad.r) / 2 : (i / (n - 1)) * (W - pad.l - pad.r));
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const ticks = [lo, lo + (hi - lo) / 2, hi];
  const path = (vals: (number | null)[]) => {
    let d = '';
    let pen = false;
    vals.forEach((v, i) => {
      if (v == null || !Number.isFinite(v)) {
        pen = false;
        return;
      }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  };
  const every = Math.max(1, Math.ceil(n / 8));
  return (
    <figure style={{ margin: 0 }}>
      <svg className="pc-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        <title>{title}</title>
        <line className="axis" x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} />
        {ticks.map((t, i) => (
          <text key={i} x={pad.l - 6} y={y(t) + 3} textAnchor="end">{format(t)}</text>
        ))}
        {labels.map((l, i) => (i % every === 0 || i === n - 1 ? <text key={l + i} x={x(i)} y={H - 8} textAnchor="middle">{l.slice(5)}</text> : null))}
        {refLine != null ? <line className="one" x1={pad.l} x2={W - pad.r} y1={y(refLine)} y2={y(refLine)} /> : null}
        {series.map((s) => (
          <g key={s.key}>
            <path className={s.cls} d={path(s.values)} fill="none" strokeWidth={2} />
            {s.values.map((v, i) => (v != null && Number.isFinite(v) ? <circle key={i} className={s.cls} cx={x(i)} cy={y(v)} r={2.4} fill="currentColor" stroke="none" /> : null))}
          </g>
        ))}
      </svg>
      <figcaption className="pc-legend">
        {series.map((s) => (
          <span key={s.key}>
            <i className={s.cls} style={{ background: 'currentColor' }} />
            {s.label}
          </span>
        ))}
        {refLine != null ? <span><i style={{ background: 'var(--text-3)' }} />{format(refLine)}</span> : null}
      </figcaption>
    </figure>
  );
}

export function Bars({ rows, format = (v) => String(v), danger }: { rows: { label: string; value: number | null }[]; format?: (v: number) => string; danger?: (label: string) => boolean }) {
  const max = Math.max(0, ...rows.map((r) => Math.abs(r.value ?? 0)));
  if (!rows.length) return <p className="pc-unavailable">No data.</p>;
  return (
    <div className="pc-bars">
      {rows.map((r) => (
        <div key={r.label} className="bar-row">
          <span className="ellipsis" title={r.label}>{r.label}</span>
          <span className="bar-track">
            <span className={`bar-fill${danger?.(r.label) ? ' danger' : ''}`} style={{ width: `${max ? (Math.abs(r.value ?? 0) / max) * 100 : 0}%`, display: 'block' }} />
          </span>
          <span className="num small">{r.value == null ? <span className="pc-unavailable">unavailable</span> : format(r.value)}</span>
        </div>
      ))}
    </div>
  );
}
