import { type ReactNode } from 'react';
import { colorFor, initials } from '../../lib/format';
import { PALETTE } from '../../../shared/columns';
import { Icon } from './Icon';

export function Avatar({ name, id, url, size }: { name: string; id: string; url?: string | null; size?: 'sm' | 'lg' }) {
  const cls = `avatar${size ? ` ${size}` : ''}`;
  if (url) return <img className={cls} src={url} alt={name} title={name} />;
  return (
    <span className={cls} style={{ background: colorFor(id) }} title={name} aria-label={name}>
      {initials(name)}
    </span>
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <span className="spinner" role="status" aria-label={label} />;
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="center-fill" aria-busy="true">
      <div className="row muted">
        <Spinner /> {label}
      </div>
    </div>
  );
}

export function EmptyState({ icon = 'grid', title, children, action }: { icon?: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={24} />
      </div>
      <h3>{title}</h3>
      {children ? <div className="muted" style={{ maxWidth: 420 }}>{children}</div> : null}
      {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
    </div>
  );
}

export function ErrorBox({ error, retry }: { error: unknown; retry?: () => void }) {
  const msg = error instanceof Error ? error.message : String(error ?? 'Something went wrong');
  return (
    <div className="error-box row" role="alert">
      <span className="grow">{msg}</span>
      {retry ? (
        <button className="btn sm" onClick={retry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className="switch" title={label}>
      <input type="checkbox" role="switch" aria-label={label} checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span />
    </label>
  );
}

export function ColorSwatches({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="color-swatches" role="radiogroup" aria-label="Colour">
      {PALETTE.map((c) => (
        <button key={c} type="button" role="radio" aria-checked={value === c} aria-label={c} className={value === c ? 'selected' : ''} style={{ background: c }} onClick={() => onChange(c)} />
      ))}
    </div>
  );
}

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: ReactNode; error?: string | null; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <span className="error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

export function PageHeader({ title, subtitle, icon, actions }: { title: ReactNode; subtitle?: ReactNode; icon?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      {icon ? (
        <div className="empty-icon" style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} />
        </div>
      ) : null}
      <div className="grow">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="row wrap">{actions}</div> : null}
    </div>
  );
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${v}%`, background: color }} />
    </div>
  );
}
