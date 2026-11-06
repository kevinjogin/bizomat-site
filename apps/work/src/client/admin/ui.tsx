import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '../components/ui/Icon';
import { ErrorBox } from '../components/ui/ui';
import { RANGE_LABELS, type Range, type UserStatus } from './api';

export const num = (v: number | null | undefined, digits = 0) =>
  v == null || Number.isNaN(v) ? '—' : v.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 });

export function fmtDateTime(ts: number | null | undefined) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function fmtDate(ts: number | null | undefined) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function relative(ts: number | null | undefined, nowTs = Date.now()) {
  if (!ts) return 'never';
  const s = Math.round((nowTs - ts) / 1000);
  if (s < 0) return 'just now';
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)} d ago`;
  return fmtDate(ts);
}

/** Relative time with the exact local time as a tooltip. */
export function When({ ts, fallback = 'never' }: { ts: number | null | undefined; fallback?: string }) {
  if (!ts) return <span className="muted">{fallback}</span>;
  return (
    <time dateTime={new Date(ts).toISOString()} title={fmtDateTime(ts)}>
      {relative(ts)}
    </time>
  );
}

/** Re-render periodically so relative times stay current. */
export function useTick(ms = 15_000) {
  const [, set] = useState(0);
  useEffect(() => {
    const t = setInterval(() => set((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
}

export function Card({ title, actions, children, className = '', subtitle }: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`ac-card ${className}`}>
      {title || actions ? (
        <header className="ac-card-head">
          <div className="grow" style={{ minWidth: 0 }}>
            {title ? <h3>{title}</h3> : null}
            {subtitle ? <p className="muted small">{subtitle}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className="ac-card-body">{children}</div>
    </section>
  );
}

export function Kpi({ label, value, hint, tone, icon, digits, text }: { label: string; value: number | null | undefined; hint?: ReactNode; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info'; icon?: string; digits?: number; text?: string }) {
  return (
    <div className={`ac-kpi${tone ? ` tone-${tone}` : ''}`}>
      <div className="ac-kpi-top">
        <span className="ac-kpi-label">{label}</span>
        {icon ? <Icon name={icon} size={15} /> : null}
      </div>
      <div className="ac-kpi-value">{text ?? num(value, digits)}</div>
      {hint ? <div className="ac-kpi-hint">{hint}</div> : null}
    </div>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  active_now: { label: 'Active now', cls: 'success' },
  active: { label: 'Active (7 days)', cls: 'info' },
  idle: { label: 'Idle', cls: 'neutral' },
  inactive: { label: 'Inactive', cls: 'neutral' },
  never_returned: { label: 'Never returned', cls: 'warning' },
  disabled: { label: 'Disabled', cls: 'danger' },
  locked: { label: 'Locked', cls: 'danger' },
  ended: { label: 'Ended', cls: 'neutral' },
  expired: { label: 'Expired', cls: 'neutral' },
};

export function StatusPill({ status }: { status: UserStatus | string }) {
  const s = STATUS[status] ?? { label: status, cls: 'neutral' };
  return (
    <span className={`ac-pill ${s.cls}`}>
      {status === 'active_now' || status === 'active_session' ? <span className="ac-live-dot" aria-hidden /> : null}
      {s.label}
    </span>
  );
}

export function RangeSelect({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div className="ac-segmented" role="radiogroup" aria-label="Date range">
      {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
        <button key={r} type="button" role="radio" aria-checked={value === r} className={value === r ? 'on' : ''} onClick={() => onChange(r)}>
          {RANGE_LABELS[r]}
        </button>
      ))}
    </div>
  );
}

export function Skeleton({ h = 18, w = '100%' }: { h?: number; w?: number | string }) {
  return <div className="skeleton" style={{ height: h, width: w }} />;
}

export function PageSkeleton() {
  return (
    <div className="ac-stack" aria-busy="true" aria-label="Loading">
      <div className="ac-kpis">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="ac-kpi">
            <Skeleton h={12} w="50%" />
            <div style={{ height: 10 }} />
            <Skeleton h={30} w="40%" />
          </div>
        ))}
      </div>
      <div className="ac-card">
        <div className="ac-card-body">
          <Skeleton h={180} />
        </div>
      </div>
    </div>
  );
}

export function QueryState({ q, children }: { q: { isLoading: boolean; error: unknown; refetch: () => unknown }; children: () => ReactNode }) {
  if (q.isLoading) return <PageSkeleton />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  return <>{children()}</>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="ac-empty">{children}</div>;
}

export function TableWrap({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="ac-table-wrap" role="region" aria-label={label} tabIndex={0}>
      <table className="ac-table">{children}</table>
    </div>
  );
}

export function Percent({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="muted">—</span>;
  return <span>{value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%</span>;
}

export function Bar({ value, max, color = 'var(--brand)' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="ac-bar" aria-hidden>
      <span style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function deviceIcon(device: string) {
  return device === 'mobile' ? '📱' : device === 'tablet' ? '📲' : device === 'bot' ? '🤖' : '🖥️';
}

export function DeviceCell({ device, browser, os }: { device: string; browser: string; os: string }) {
  return (
    <span className="ac-device" title={`${device} · ${browser} · ${os}`}>
      <span aria-hidden>{deviceIcon(device)}</span>
      <span>
        <span className="ac-device-main">{browser}</span>
        <span className="muted small"> · {os}</span>
      </span>
    </span>
  );
}

export function PageIntro({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="ac-intro">
      <div className="grow" style={{ minWidth: 0 }}>{children}</div>
      {actions ? <div className="ac-intro-actions">{actions}</div> : null}
    </div>
  );
}
