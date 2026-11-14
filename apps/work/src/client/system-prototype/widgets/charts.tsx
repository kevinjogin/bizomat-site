// Small SVG charts for the prototype: vertical bars (with an optional target line), horizontal bars (with an optional
// limit) and lines. One axis each, thin marks, a legend for two or more series, a tooltip on hover and focus, and a
// table view for every chart. Series colours come from erp.css (--erp-series-1..3), validated for colour vision
// deficiency in light and dark themes.
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export interface Series {
  name: string;
  values: number[];
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

/** Rounded top, square base: a bar anchored to the baseline. */
function barPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  if (h <= 0) return '';
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

function Tooltip({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div className="erp-tip" role="presentation" style={{ '--tx': `${x}px`, '--ty': `${y}px` } as CSSProperties}>
      {children}
    </div>
  );
}

export function Legend({ items }: { items: { name: string; cls: string; dashed?: boolean }[] }) {
  return (
    <div className="legend erp-legend">
      {items.map((i) => (
        <span key={i.name}>
          <i className={`erp-key ${i.cls}${i.dashed ? ' dashed' : ''}`} aria-hidden /> {i.name}
        </span>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ vertical bars

export function BarChart({
  labels,
  series,
  target,
  format,
  height = 180,
  onSelect,
  selected,
  label,
}: {
  labels: string[];
  series: Series[];
  target?: Series;
  format: (n: number) => string;
  height?: number;
  onSelect?: (i: number) => void;
  selected?: number | null;
  label: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const left = 44;
  const bottom = 22;
  const top = 8;
  const w = Math.max(0, width - left - 4);
  const h = height - bottom - top;
  const all = [...series.flatMap((s) => s.values), ...(target?.values ?? [])];
  const max = niceMax(Math.max(...all, 0));
  const step = labels.length ? w / labels.length : 0;
  const groupW = Math.max(4, step * 0.64);
  const barW = Math.max(3, (groupW - (series.length - 1) * 2) / series.length);
  const y = (v: number) => top + h - (v / max) * h;
  const ticks = [0, 0.5, 1].map((t) => t * max);
  const every = Math.ceil(labels.length / Math.max(1, Math.floor(w / 46)));
  return (
    <div className="erp-chart" ref={ref}>
      {width > 0 ? (
        <svg width={width} height={height} className="chart-svg" role="img" aria-label={label}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={left} x2={left + w} y1={y(t)} y2={y(t)} className="erp-grid" />
              <text x={left - 6} y={y(t) + 4} textAnchor="end">
                {format(t)}
              </text>
            </g>
          ))}
          {labels.map((lb, i) => {
            const gx = left + i * step + (step - groupW) / 2;
            return (
              <g key={lb + i} className={`erp-col${selected === i ? ' selected' : ''}${hover === i ? ' hover' : ''}`}>
                {series.map((s, si) => (
                  <path key={s.name} d={barPath(gx + si * (barW + 2), y(s.values[i] ?? 0), barW, top + h - y(s.values[i] ?? 0))} className={`erp-s${si + 1}`} />
                ))}
                {i % every === 0 ? (
                  <text x={left + i * step + step / 2} y={height - 6} textAnchor="middle">
                    {lb}
                  </text>
                ) : null}
                <rect
                  x={left + i * step}
                  y={top}
                  width={step}
                  height={h}
                  className="erp-hit"
                  tabIndex={onSelect ? 0 : undefined}
                  role={onSelect ? 'button' : undefined}
                  aria-label={onSelect ? `${lb}: ${series.map((s) => `${s.name} ${format(s.values[i] ?? 0)}`).join(', ')}. Show details` : undefined}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => onSelect?.(i)}
                  onKeyDown={(e) => {
                    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelect(i);
                    }
                  }}
                />
              </g>
            );
          })}
          {target ? (
            <polyline
              className="erp-target"
              fill="none"
              points={labels.map((_, i) => `${left + i * step + step / 2},${y(target.values[i] ?? 0)}`).join(' ')}
            />
          ) : null}
          <line x1={left} x2={left + w} y1={top + h} y2={top + h} className="erp-axis" />
        </svg>
      ) : null}
      {hover !== null && width > 0 ? (
        <Tooltip x={Math.min(width - 150, Math.max(0, left + hover * step + step / 2 - 70))} y={8}>
          <strong>{labels[hover]}</strong>
          {series.map((s) => (
            <span key={s.name}>
              {s.name}: {format(s.values[hover] ?? 0)}
            </span>
          ))}
          {target ? (
            <span>
              {target.name}: {format(target.values[hover] ?? 0)}
            </span>
          ) : null}
        </Tooltip>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ horizontal bars

export interface HBarItem {
  label: string;
  value: number;
  note?: string;
  over?: boolean;
}
export function HBarChart({ items, format, limit, limitLabel, onSelect, label }: { items: HBarItem[]; format: (n: number) => string; limit?: number; limitLabel?: string; onSelect?: (i: number) => void; label: string }) {
  const max = niceMax(Math.max(...items.map((i) => i.value), limit ?? 0));
  return (
    <div className="erp-hbars" role="list" aria-label={label}>
      {items.map((it, i) => {
        const pct = (it.value / max) * 100;
        const body = (
          <>
            <span className="erp-hbar-label" title={it.label}>
              {it.label}
            </span>
            <span className="erp-hbar-track">
              <span className={`erp-hbar-fill${it.over ? ' over' : ''}`} style={{ '--w': `${pct}%` } as CSSProperties} />
              {limit !== undefined ? <span className="erp-hbar-limit" style={{ '--l': `${(limit / max) * 100}%` } as CSSProperties} title={limitLabel} /> : null}
            </span>
            <span className="erp-hbar-value">
              {format(it.value)}
              {it.note ? <span className={`erp-hbar-note${it.over ? ' over' : ''}`}>{it.note}</span> : null}
            </span>
          </>
        );
        return onSelect ? (
          <button key={it.label} type="button" role="listitem" className="erp-hbar" onClick={() => onSelect(i)} aria-label={`${it.label}: ${format(it.value)}${it.note ? `, ${it.note}` : ''}. Show details`}>
            {body}
          </button>
        ) : (
          <div key={it.label} role="listitem" className="erp-hbar">
            {body}
          </div>
        );
      })}
      {limit !== undefined && limitLabel ? (
        <div className="erp-hbar-legend muted small">
          <i className="erp-key limit" aria-hidden /> {limitLabel}
        </div>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ lines

export function LineChart({ labels, series, format, height = 180, label, area }: { labels: string[]; series: Series[]; format: (n: number) => string; height?: number; label: string; area?: boolean }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const left = 44;
  const bottom = 22;
  const top = 10;
  const w = Math.max(0, width - left - 8);
  const h = height - bottom - top;
  const all = series.flatMap((s) => s.values);
  const minV = Math.min(0, ...all);
  const max = niceMax(Math.max(...all));
  const x = (i: number) => left + (labels.length > 1 ? (i / (labels.length - 1)) * w : w / 2);
  const y = (v: number) => top + h - ((v - minV) / (max - minV)) * h;
  const every = Math.ceil(labels.length / Math.max(1, Math.floor(w / 52)));
  const gid = useId();
  return (
    <div className="erp-chart" ref={ref}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          className="chart-svg"
          role="img"
          aria-label={label}
          onMouseMove={(e) => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const px = e.clientX - rect.left - left;
            const i = Math.round((px / w) * (labels.length - 1));
            setHover(i >= 0 && i < labels.length ? i : null);
          }}
          onMouseLeave={() => setHover(null)}
        >
          {[0, 0.5, 1].map((t) => {
            const v = minV + t * (max - minV);
            return (
              <g key={t}>
                <line x1={left} x2={left + w} y1={y(v)} y2={y(v)} className="erp-grid" />
                <text x={left - 6} y={y(v) + 4} textAnchor="end">
                  {format(v)}
                </text>
              </g>
            );
          })}
          {labels.map((lb, i) =>
            i % every === 0 ? (
              <text key={lb + i} x={x(i)} y={height - 6} textAnchor="middle">
                {lb}
              </text>
            ) : null,
          )}
          {series.map((s, si) => {
            const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
            return (
              <g key={s.name} className={`erp-line erp-s${si + 1}`}>
                {area && si === 0 ? <polygon id={`${gid}-a`} className="erp-area" points={`${x(0)},${y(minV)} ${pts} ${x(s.values.length - 1)},${y(minV)}`} /> : null}
                <polyline fill="none" points={pts} className={si === 1 && series.length > 1 ? 'dashed' : undefined} />
              </g>
            );
          })}
          {hover !== null ? (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={top} y2={top + h} className="erp-crosshair" />
              {series.map((s, si) => (
                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r={4} className={`erp-pt erp-s${si + 1}`} />
              ))}
            </g>
          ) : null}
        </svg>
      ) : null}
      {hover !== null && width > 0 ? (
        <Tooltip x={Math.min(width - 150, Math.max(0, x(hover) - 70))} y={4}>
          <strong>{labels[hover]}</strong>
          {series.map((s) => (
            <span key={s.name}>
              {s.name}: {format(s.values[hover])}
            </span>
          ))}
        </Tooltip>
      ) : null}
    </div>
  );
}

/** A chart with a "Table" switch: the same figures as a table, for screen readers and exact values. */
export function ChartFrame({ children, headers, rows, legend }: { children: ReactNode; headers: string[]; rows: (string | number)[][]; legend?: ReactNode }) {
  const [table, setTable] = useState(false);
  return (
    <div className="erp-chartframe">
      <div className="erp-chartframe-bar">
        {legend ?? <span />}
        <button type="button" className="btn ghost sm" aria-pressed={table} onClick={() => setTable((t) => !t)}>
          {table ? 'Show chart' : 'Show table'}
        </button>
      </div>
      {table ? (
        <div className="erp-table-scroll">
          <table className="data-table erp-mini-table">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((v, j) => (
                    <td key={j} className={j > 0 ? 'num' : undefined}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
