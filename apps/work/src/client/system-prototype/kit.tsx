// Small building blocks of the System prototype, on the app's design system (app.css): menus, badges, tabs, drawers,
// key facts and states. Menus and tabs follow the WAI-ARIA keyboard patterns.
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Popover } from '../components/ui/overlays';
import { PIcon } from './icons';
import { APP_URL, STATE_LABEL } from './nav';
import { toneFor } from './format';
import type { ModuleId, PageState, Tone } from './types';

// ------------------------------------------------------------------ menus

/** A button that opens a menu. Arrow keys move through the items, Escape closes and returns focus to the button. */
export function MenuButton({
  label,
  className = 'btn',
  content,
  children,
  align = 'start',
  width,
  title,
  menuLabel,
}: {
  label: string;
  className?: string;
  content: ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'start' | 'end';
  width?: number;
  title?: string;
  menuLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    ref.current?.focus();
  }, []);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => document.querySelector<HTMLElement>('.popover .menu-item:not([disabled])')?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <>
      <button
        ref={ref}
        type="button"
        className={className}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={title}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {content}
      </button>
      {open ? (
        <Popover anchor={ref} onClose={close} align={align} width={width} label={menuLabel ?? label}>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Tab') setOpen(false);
            }}
          >
            {children(close)}
          </div>
        </Popover>
      ) : null}
    </>
  );
}

export function MenuEntry({ icon, children, onClick, checked, disabled, hint }: { icon?: string; children: ReactNode; onClick: () => void; checked?: boolean; disabled?: boolean; hint?: string }) {
  return (
    <button
      type="button"
      className={`menu-item${checked ? ' active' : ''}`}
      role={checked === undefined ? 'menuitem' : 'menuitemradio'}
      aria-checked={checked}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? <PIcon name={icon} size={15} /> : null}
      <span className="grow ellipsis">{children}</span>
      {hint ? <span className="shortcut">{hint}</span> : null}
      {checked ? <PIcon name="check" size={14} /> : null}
    </button>
  );
}

export function MenuLink({ icon, href, children, external, onNavigate }: { icon?: string; href: string; children: ReactNode; external?: boolean; onNavigate?: () => void }) {
  if (external)
    return (
      <a className="menu-item" role="menuitem" href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
        {icon ? <PIcon name={icon} size={15} /> : null}
        <span className="grow ellipsis">{children}</span>
        <PIcon name="share" size={13} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  return (
    <Link className="menu-item" role="menuitem" to={href} onClick={onNavigate}>
      {icon ? <PIcon name={icon} size={15} /> : null}
      <span className="grow ellipsis">{children}</span>
    </Link>
  );
}

// ------------------------------------------------------------------ badges

export function StatusBadge({ status, tone }: { status?: string; tone?: Tone }) {
  if (!status) return null;
  const t = tone ?? toneFor(status);
  return <span className={`badge erp-badge-${t}`}>{status}</span>;
}

/** The page state badges: Working, Connected, Planned. `compact` shows the letter with the word for screen readers. */
export function StateBadges({ states, compact }: { states: PageState[]; compact?: boolean }) {
  return (
    <span className={`erp-states${compact ? ' compact' : ''}`}>
      {states.map((s) => (
        <span key={s} className={`erp-state erp-state-${s}`} title={STATE_LABEL[s]}>
          {compact ? (
            <>
              <span aria-hidden>{s}</span>
              <span className="sr-only">{STATE_LABEL[s]}</span>
            </>
          ) : (
            STATE_LABEL[s]
          )}
        </span>
      ))}
    </span>
  );
}

const MODULE_SHORT: Record<ModuleId, string> = { System: 'ERP', CRM: 'CRM', Finance: 'Finance', 'Project Management': 'Projects', 'CAD Automation': 'CAD', Company: 'Company' };
export function ModuleBadge({ module }: { module: ModuleId }) {
  return (
    <span className={`erp-module erp-module-${MODULE_SHORT[module].toLowerCase()}`} title={module}>
      {MODULE_SHORT[module]}
    </span>
  );
}

/** "Open in Finance": the real address of a working application. Never called by the prototype. */
export function OpenInApp({ module, className = 'btn sm' }: { module: ModuleId; className?: string }) {
  if (module === 'System') return null;
  return (
    <a className={className} href={APP_URL[module]} target="_blank" rel="noopener noreferrer">
      Open in {module}
      <PIcon name="share" size={13} />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

// ------------------------------------------------------------------ tabs

export interface TabDef {
  id: string;
  label: ReactNode;
  count?: number;
}
/** Tabs with arrow-key movement (automatic activation). */
export function Tabs({ tabs, active, onChange, label, className }: { tabs: TabDef[]; active: string; onChange: (id: string) => void; label: string; className?: string }) {
  const base = useId();
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active);
    let j = -1;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = tabs.length - 1;
    if (j < 0) return;
    e.preventDefault();
    onChange(tabs[j].id);
    setTimeout(() => document.getElementById(`${base}-${tabs[j].id}`)?.focus(), 0);
  };
  return (
    <div className={`tabs erp-tabs${className ? ` ${className}` : ''}`} role="tablist" aria-label={label} onKeyDown={onKey}>
      {tabs.map((t) => (
        <button
          key={t.id}
          id={`${base}-${t.id}`}
          type="button"
          role="tab"
          aria-selected={t.id === active}
          tabIndex={t.id === active ? 0 : -1}
          className={`tab${t.id === active ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
          data-hl={`tab-${t.id}`}
        >
          {t.label}
          {t.count !== undefined ? <span className="erp-tab-count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ drawer

/** A panel from the right. Modal: focus stays inside until it closes; Escape closes. */
export function Drawer({ title, onClose, children, footer, wide }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('button, a[href], input, select')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prev?.focus?.();
    };
  }, [onClose]);
  return createPortal(
    <>
      <div className="sidepanel-overlay" onMouseDown={onClose} />
      <div ref={ref} className={`sidepanel erp-drawer${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={id}>
        <div className="erp-drawer-head">
          <h2 id={id} className="grow">
            {title}
          </h2>
          <button type="button" className="btn ghost icon sm" onClick={onClose} aria-label="Close">
            <PIcon name="x" />
          </button>
        </div>
        <div className="erp-drawer-body">{children}</div>
        {footer ? <div className="erp-drawer-foot">{footer}</div> : null}
      </div>
    </>,
    document.body,
  );
}

// ------------------------------------------------------------------ content blocks

export function Facts({ items, columns = 3 }: { items: [string, ReactNode][]; columns?: 2 | 3 | 4 }) {
  return (
    <dl className={`erp-facts cols-${columns}`}>
      {items.map(([k, v]) => (
        <div key={k} className="erp-fact">
          <dt>{k}</dt>
          <dd>{v === undefined || v === null || v === '' ? <span className="muted">Not set</span> : v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Panel({ title, actions, children, className, hl, id }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; hl?: string; id?: string }) {
  return (
    <section className={`card erp-panel${className ? ` ${className}` : ''}`} data-hl={hl} aria-labelledby={title && id ? id : undefined}>
      {title ? (
        <div className="erp-panel-head">
          <h2 id={id}>{title}</h2>
          {actions ? <div className="row wrap">{actions}</div> : null}
        </div>
      ) : null}
      <div className="erp-panel-body">{children}</div>
    </section>
  );
}

export function Empty({ icon = 'search', title, children, action }: { icon?: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty erp-empty">
      <div className="empty-icon">
        <PIcon name={icon} size={24} />
      </div>
      <h3>{title}</h3>
      {children ? <p className="muted">{children}</p> : null}
      {action}
    </div>
  );
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="erp-skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton erp-skel-row" />
      ))}
    </div>
  );
}

export function Meter({ value, max = 100, label, tone }: { value: number; max?: number; label: string; tone?: Tone }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const t = tone ?? (value > max ? 'danger' : pct >= 90 ? 'warning' : 'accent');
  return (
    <span className={`erp-meter erp-meter-${t}`} role="img" aria-label={label}>
      <span style={{ '--w': `${pct}%` } as CSSProperties} />
    </span>
  );
}

export function Avatar({ name }: { name: string }) {
  const ini = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <span className="erp-avatar" aria-hidden>
      {ini}
    </span>
  );
}
