// Dependency-free, accessible SVG charts. Colours come from the data (label
// colours) or an original fallback palette; text uses theme CSS variables.

export interface ChartDatum {
  key: string;
  label: string;
  color: string | null;
  value: number;
  count?: number;
}

const FALLBACK = ['#f97316', '#5b5bd6', '#00a36c', '#f5a524', '#e5484d', '#0ea5e9', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#64748b', '#334155'];

function colorOf(d: ChartDatum, i: number) {
  return d.color || FALLBACK[i % FALLBACK.length];
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${(n / 1000).toFixed(0)}k`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function summary(data: ChartDatum[], kind: string) {
  if (!data.length) return `${kind}: no data`;
  return `${kind}: ` + data.map((d) => `${d.label} ${fmt(d.value)}`).join(', ');
}

export function Legend({ data }: { data: ChartDatum[] }) {
  return (
    <div className="legend" aria-hidden>
      {data.map((d, i) => (
        <span key={d.key}>
          <span className="icon-dot" style={{ background: colorOf(d, i) }} /> {d.label} <strong>{fmt(d.value)}</strong>
        </span>
      ))}
    </div>
  );
}

function NoData() {
  return <div className="muted small chart-empty">No data to display</div>;
}

export function BarChart({ data, height = 180, horizontal, showLegend = false }: { data: ChartDatum[]; height?: number; horizontal?: boolean; showLegend?: boolean }) {
  if (!data.length) return <NoData />;
  const max = Math.max(1, ...data.map((d) => d.value));
  if (horizontal) {
    const rowH = 26;
    const h = data.length * rowH + 4;
    return (
      <div className="chart">
        <svg className="chart-svg" role="img" aria-label={summary(data, 'Bar chart')} width="100%" height={h} viewBox={`0 0 400 ${h}`} preserveAspectRatio="none">
          {data.map((d, i) => {
            const w = Math.max(2, (d.value / max) * 250);
            return (
              <g key={d.key} transform={`translate(0 ${i * rowH})`}>
                <text x={0} y={16} style={{ fontSize: 11 }}>{d.label.length > 18 ? d.label.slice(0, 17) + '…' : d.label}</text>
                <rect x={120} y={4} width={w} height={rowH - 10} rx={4} fill={colorOf(d, i)}>
                  <title>{`${d.label}: ${fmt(d.value)}`}</title>
                </rect>
                <text x={124 + w} y={16} style={{ fontSize: 11 }}>{fmt(d.value)}</text>
              </g>
            );
          })}
        </svg>
        {showLegend ? <Legend data={data} /> : null}
      </div>
    );
  }
  const W = 400;
  const pad = { l: 30, b: 34, t: 10, r: 6 };
  const inner = W - pad.l - pad.r;
  const bw = inner / data.length;
  const ih = height - pad.b - pad.t;
  const ticks = [0, 0.5, 1].map((f) => f * max);
  return (
    <div className="chart">
      <svg className="chart-svg" role="img" aria-label={summary(data, 'Bar chart')} width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
        {ticks.map((t) => {
          const y = pad.t + ih - (t / max) * ih;
          return (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="var(--border)" />
              <text x={pad.l - 4} y={y + 4} textAnchor="end">{fmt(t)}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = Math.max(1, (d.value / max) * ih);
          const x = pad.l + i * bw + bw * 0.15;
          return (
            <g key={d.key}>
              <rect x={x} y={pad.t + ih - h} width={bw * 0.7} height={h} rx={3} fill={colorOf(d, i)}>
                <title>{`${d.label}: ${fmt(d.value)}`}</title>
              </rect>
              <text x={x + bw * 0.35} y={height - pad.b + 14} textAnchor="middle">
                {d.label.length > Math.max(4, Math.floor(bw / 7)) ? d.label.slice(0, Math.max(3, Math.floor(bw / 7) - 1)) + '…' : d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {showLegend ? <Legend data={data} /> : null}
    </div>
  );
}

export function DonutChart({ data, size = 140, centerLabel }: { data: ChartDatum[]; size?: number; centerLabel?: string }) {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  if (!data.length || total === 0) return <NoData />;
  const stroke = Math.max(14, size * 0.16);
  const r = size / 2 - stroke / 2 - 2;
  const c = size / 2;
  let acc = 0;
  const circ = 2 * Math.PI * r;
  return (
    <div className="chart chart-donut">
      <svg role="img" aria-label={summary(data, 'Donut chart')} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="chart-svg">
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        {data.map((d, i) => {
          const frac = Math.max(0, d.value) / total;
          const dash = frac * circ;
          const el = (
            <circle
              key={d.key}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={colorOf(d, i)}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-acc * circ}
              transform={`rotate(-90 ${c} ${c})`}
            >
              <title>{`${d.label}: ${fmt(d.value)} (${Math.round(frac * 100)}%)`}</title>
            </circle>
          );
          acc += frac;
          return el;
        })}
        <text x={c} y={c + 2} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--text)' }}>{fmt(total)}</text>
        {centerLabel ? <text x={c} y={c + 18} textAnchor="middle">{centerLabel}</text> : null}
      </svg>
      <Legend data={data} />
    </div>
  );
}

export function LineChart({ data, height = 180 }: { data: ChartDatum[]; height?: number }) {
  if (!data.length) return <NoData />;
  const W = 400;
  const pad = { l: 30, b: 30, t: 10, r: 10 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const ih = height - pad.t - pad.b;
  const step = data.length > 1 ? (W - pad.l - pad.r) / (data.length - 1) : 0;
  const pts = data.map((d, i) => [pad.l + i * step, pad.t + ih - (d.value / max) * ih] as const);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const color = data[0].color || FALLBACK[0];
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));
  return (
    <div className="chart">
      <svg className="chart-svg" role="img" aria-label={summary(data, 'Line chart')} width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
        {[0, 0.5, 1].map((f) => {
          const y = pad.t + ih - f * ih;
          return (
            <g key={f}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="var(--border)" />
              <text x={pad.l - 4} y={y + 4} textAnchor="end">{fmt(f * max)}</text>
            </g>
          );
        })}
        <path d={`${path} L${pts[pts.length - 1][0]},${pad.t + ih} L${pts[0][0]},${pad.t + ih} Z`} fill={color} opacity={0.12} />
        <path d={path} fill="none" stroke={color} strokeWidth={2} />
        {pts.map((p, i) => (
          <g key={data[i].key}>
            <circle cx={p[0]} cy={p[1]} r={3.5} fill={color}>
              <title>{`${data[i].label}: ${fmt(data[i].value)}`}</title>
            </circle>
            {i % labelEvery === 0 ? (
              <text x={p[0]} y={height - 10} textAnchor="middle">{data[i].label.slice(0, 10)}</text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}
