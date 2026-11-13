// Small building blocks for the Finance screens: amounts, account, tax code, contact and tracking pickers, status
// badges and headline figures. They use the app's design system (app.css) and the CRM's layout classes (crm.css).
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { accountLabel, categoryOptions, moneyAccounts, pct, useAccounts, useContacts, useMoney, useTaxCodes, useTracking, type AccountDTO, type TaxCodeDTO } from './lib';

/** An amount typed in dollars and cents, kept in cents. Negative amounts only where `signed` is set. */
export function MoneyInput({ value, onChange, id, placeholder, ariaLabel, signed, required, disabled }: { value: number | null | undefined; onChange: (v: number | null) => void; id?: string; placeholder?: string; ariaLabel?: string; signed?: boolean; required?: boolean; disabled?: boolean }) {
  const { currency, plain, parse } = useMoney();
  const [text, setText] = useState(plain(value));
  const [error, setError] = useState(false);
  useEffect(() => {
    setText(plain(value));
  }, [value, currency]);
  const commit = () => {
    try {
      const v = parse(text);
      setError(false);
      onChange(v === null ? null : signed ? v : Math.abs(v));
    } catch {
      setError(true);
    }
  };
  return (
    <div className="crm-money fin-money">
      <span className="crm-money-cur" aria-hidden>{currency}</span>
      <input
        id={id}
        className={`input${error ? ' invalid' : ''}`}
        inputMode="decimal"
        placeholder={placeholder ?? '0.00'}
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        required={required}
        disabled={disabled}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
        }}
      />
    </div>
  );
}

/** An amount shown in the workspace currency; negative amounts in brackets-free minus form, coloured when `tone`. */
export function Money({ value, tone, strong }: { value: number | null | undefined; tone?: boolean; strong?: boolean }) {
  const { fmt } = useMoney();
  const v = value ?? 0;
  const cls = `fin-amount${tone ? (v < 0 ? ' neg' : v > 0 ? ' pos' : '') : ''}${strong ? ' strong' : ''}`;
  return <span className={cls}>{fmt(v)}</span>;
}

/** Choose an account: categories (income and expenses), money accounts, or any account. */
export function AccountSelect({ value, onChange, id, kind = 'any', direction = 'any', allowEmpty, emptyLabel = 'Choose…', ariaLabel, required, include }: { value: string | null | undefined; onChange: (v: string | null) => void; id?: string; kind?: 'category' | 'money' | 'any' | 'posting'; direction?: 'in' | 'out' | 'any'; allowEmpty?: boolean; emptyLabel?: string; ariaLabel?: string; required?: boolean; include?: (a: AccountDTO) => boolean }) {
  const accounts = useAccounts().data ?? [];
  let list: AccountDTO[];
  if (kind === 'money') list = moneyAccounts(accounts);
  else if (kind === 'category') list = categoryOptions(accounts, direction);
  else if (kind === 'posting') list = accounts.filter((a) => !a.archived);
  else list = accounts.filter((a) => !a.archived || a.id === value);
  if (include) list = list.filter(include);
  const groups = new Map<string, AccountDTO[]>();
  const typeLabel: Record<string, string> = { asset: 'Assets', liability: 'Liabilities', equity: 'Equity', revenue: 'Income', expense: 'Expenses' };
  for (const a of list) groups.set(typeLabel[a.type], [...(groups.get(typeLabel[a.type]) ?? []), a]);
  const depth = (a: AccountDTO) => (a.parentId && accounts.some((x) => x.id === a.parentId) ? 1 : 0);
  return (
    <select id={id} className="select" aria-label={ariaLabel} required={required} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      {allowEmpty || !value ? <option value="">{emptyLabel}</option> : null}
      {[...groups.entries()].map(([label, xs]) => (
        <optgroup key={label} label={label}>
          {xs.map((a) => (
            <option key={a.id} value={a.id}>
              {depth(a) ? '   ' : ''}
              {accountLabel(a)}
              {a.archived ? ' (archived)' : ''}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

/** Choose a tax (GST) code for sales, purchases or either. Hidden by callers when the workspace has no GST. */
export function TaxCodeSelect({ value, onChange, id, direction = 'both', ariaLabel }: { value: string | null | undefined; onChange: (v: string | null) => void; id?: string; direction?: 'sales' | 'purchases' | 'both'; ariaLabel?: string }) {
  const codes = (useTaxCodes().data ?? []).filter((t) => (!t.archived || t.id === value) && (direction === 'both' || t.direction === direction || t.direction === 'both'));
  return (
    <select id={id} className="select" aria-label={ariaLabel ?? 'Tax code'} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">No GST</option>
      {codes.map((t) => (
        <option key={t.id} value={t.id}>
          {t.code}: {t.name} {t.rateBp ? `(${pct(t.rateBp)})` : ''}
        </option>
      ))}
    </select>
  );
}

export function taxCodeName(codes: TaxCodeDTO[] | undefined, id: string | null | undefined): string {
  if (!id) return '';
  const t = codes?.find((x) => x.id === id);
  return t ? t.code : '';
}

/** Choose a customer or supplier of the workspace. */
export function ContactSelect({ value, onChange, id, kind = 'any', ariaLabel, emptyLabel = 'No contact' }: { value: string | null | undefined; onChange: (v: string | null) => void; id?: string; kind?: 'customer' | 'supplier' | 'any'; ariaLabel?: string; emptyLabel?: string }) {
  const contacts = (useContacts().data ?? []).filter((c) => (!c.archived || c.id === value) && (kind === 'any' || c.kind === kind || c.kind === 'both'));
  return (
    <select id={id} className="select" aria-label={ariaLabel ?? 'Contact'} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">{emptyLabel}</option>
      {contacts.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

const TRACKING_LABELS = { department: 'Department', project: 'Project', cost_centre: 'Cost centre' } as const;
export type TrackingKind = keyof typeof TRACKING_LABELS;

/** Choose a department, project or cost centre; renders nothing when the workspace has none of that kind. */
export function TrackingSelect({ kind, value, onChange, id }: { kind: TrackingKind; value: string | null | undefined; onChange: (v: string | null) => void; id?: string }) {
  const list = (useTracking().data ?? []).filter((t) => t.kind === kind && (!t.archived || t.id === value));
  if (!list.length) return null;
  return (
    <select id={id} className="select" aria-label={TRACKING_LABELS[kind]} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">No {TRACKING_LABELS[kind].toLowerCase()}</option>
      {list.map((t) => (
        <option key={t.id} value={t.id}>
          {t.code ? `${t.code} ` : ''}
          {t.name}
        </option>
      ))}
    </select>
  );
}

export function useHasTracking() {
  const list = useTracking().data ?? [];
  return { department: list.some((t) => t.kind === 'department' && !t.archived), project: list.some((t) => t.kind === 'project' && !t.archived), cost_centre: list.some((t) => t.kind === 'cost_centre' && !t.archived) };
}

export { TRACKING_LABELS };

const STATUS: Record<string, { label: string; tone?: 'accent' | 'success' | 'danger' | 'warning' }> = {
  draft: { label: 'Draft' },
  submitted: { label: 'Awaiting approval', tone: 'warning' },
  posted: { label: 'Posted', tone: 'success' },
  approved: { label: 'Approved', tone: 'accent' },
  part_paid: { label: 'Part paid', tone: 'warning' },
  paid: { label: 'Paid', tone: 'success' },
  billed: { label: 'Billed', tone: 'success' },
  void: { label: 'Void', tone: 'danger' },
  overdue: { label: 'Overdue', tone: 'danger' },
  unmatched: { label: 'To match', tone: 'warning' },
  matched: { label: 'Matched', tone: 'success' },
  ignored: { label: 'Ignored' },
};

/** A record's status as a badge ("Awaiting approval", "Paid", "Overdue"). */
export function StatusBadge({ status, overdue }: { status: string; overdue?: boolean }) {
  const s = overdue && (status === 'approved' || status === 'part_paid') ? STATUS.overdue : (STATUS[status] ?? { label: status });
  return <span className={`badge${s.tone ? ` ${s.tone}` : ''}`}>{s.label}</span>;
}

/** A labelled figure: the dashboard's and reports' headline numbers. */
export function Stat({ label, value, hint, to, tone }: { label: string; value: ReactNode; hint?: ReactNode; to?: string; tone?: 'danger' | 'success' }) {
  const body = (
    <>
      <span className="crm-stat-label">{label}</span>
      <span className={`crm-stat-value${tone ? ` ${tone}` : ''}`}>{value}</span>
      {hint ? <span className="crm-stat-hint">{hint}</span> : null}
    </>
  );
  return to ? (
    <Link to={to} className="crm-stat card">
      {body}
    </Link>
  ) : (
    <div className="crm-stat card">{body}</div>
  );
}

/** Pages of a list. */
export function Pager({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return <div className="muted small crm-pager">{total === 1 ? '1 record' : `${total} records`}</div>;
  return (
    <div className="row crm-pager">
      <span className="muted small grow">
        {(page - 1) * pageSize + 1} to {Math.min(total, page * pageSize)} of {total}
      </span>
      <button className="btn sm" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
        <Icon name="chevronLeft" size={14} />
      </button>
      <span className="small">
        Page {page} of {pages}
      </span>
      <button className="btn sm" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page">
        <Icon name="chevronRight" size={14} />
      </button>
    </div>
  );
}

/** Tabs that are links (each tab its own address). */
export function TabLinks({ tabs, active }: { tabs: { key: string; label: string; to: string; hidden?: boolean }[]; active: string }) {
  return (
    <nav className="tabs fin-tabs" aria-label="Sections">
      {tabs
        .filter((t) => !t.hidden)
        .map((t) => (
          <Link key={t.key} to={t.to} className={`tab${t.key === active ? ' active' : ''}`} aria-current={t.key === active ? 'page' : undefined}>
            {t.label}
          </Link>
        ))}
    </nav>
  );
}

/** A short explanation shown above a form or list (plain language, one or two sentences). */
export function Hint({ children }: { children: ReactNode }) {
  return <p className="muted small fin-hint">{children}</p>;
}
