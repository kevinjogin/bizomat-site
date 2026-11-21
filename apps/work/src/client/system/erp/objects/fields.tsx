// Inputs for the modules framework's fields, drawn from the definitions: text, numbers, money in dollars and cents, dates,
// times, choices, yes or no, codes, and a searchable picker for references to shared records (people, customers,
// suppliers, products, projects and other records). The server checks every value again.
import { useEffect, useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../../lib/api';
import { Icon } from '../../../components/ui/Icon';
import type { FieldDef } from '../../../../shared/erp-objects';
import { xPath } from './api';

export function MoneyInput({ id, value, onChange, required, allowNegative }: { id: string; value: unknown; onChange: (v: number | null) => void; required?: boolean; allowNegative?: boolean }) {
  const [text, setText] = useState(typeof value === 'number' ? (value / 100).toFixed(2) : '');
  useEffect(() => {
    const cur = text.trim() === '' ? null : Math.round(Number(text.replace(/[,\s$]/g, '')) * 100);
    if (value !== cur) setText(typeof value === 'number' ? (value / 100).toFixed(2) : '');
  }, [value]);
  return (
    <input
      id={id}
      className="input erp-money-input"
      inputMode="decimal"
      required={required}
      value={text}
      placeholder="0.00"
      onChange={(e) => {
        const t = e.target.value;
        setText(t);
        const clean = t.replace(/[,\s$]/g, '');
        if (clean === '') onChange(null);
        else if (/^-?\d*\.?\d{0,2}$/.test(clean) && (allowNegative || !clean.startsWith('-'))) onChange(Math.round(Number(clean) * 100));
      }}
    />
  );
}

/** A reference: type to search, pick one; the label shows what was picked. */
export function RefPicker({ companyId, kind, id, value, label, onChange, required }: { companyId: string; kind: string; id: string; value: unknown; label?: string; onChange: (v: string | null, label: string) => void; required?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const list = useQuery({ queryKey: ['erp', companyId, 'x', 'lookup', kind, q], queryFn: () => get<{ options: { id: string; label: string; sub?: string }[] }>(xPath(companyId, `/lookup/${encodeURIComponent(kind)}?q=${encodeURIComponent(q)}`)), enabled: open, staleTime: 30_000 });
  // a value given earlier, shown by its label
  const known = useQuery({ queryKey: ['erp', companyId, 'x', 'label', kind, value], queryFn: () => get<{ options: { id: string; label: string }[] }>(xPath(companyId, `/lookup/${encodeURIComponent(kind)}?id=${encodeURIComponent(String(value))}`)), enabled: typeof value === 'string' && !!value && !label, staleTime: 60_000 });
  const shown = typeof value === 'string' && value ? (label ?? known.data?.options[0]?.label ?? 'Chosen') : '';
  const listId = useId();
  if (shown && !open) {
    return (
      <div className="row erp-ref-picked">
        <span className="grow ellipsis" id={id}>{shown}</span>
        <button type="button" className="btn sm ghost" onClick={() => setOpen(true)}>Change</button>
        {!required ? <button type="button" className="btn sm ghost icon" aria-label="Clear" onClick={() => onChange(null, '')}><Icon name="x" size={14} /></button> : null}
      </div>
    );
  }
  return (
    <div className="erp-ref">
      <input id={id} className="input" type="search" role="combobox" aria-expanded={open} aria-controls={listId} autoComplete="off" placeholder="Type to search" value={q} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); }} />
      {open ? (
        <ul className="erp-ref-list" id={listId} role="listbox">
          {list.isLoading ? <li className="muted small">Searching…</li> : null}
          {list.data && !list.data.options.length ? <li className="muted small">Nothing found{q ? ` for “${q}”` : ''}. You may not have access to these records.</li> : null}
          {list.data?.options.map((o) => (
            <li key={o.id} role="option" aria-selected={o.id === value}>
              <button type="button" className="erp-ref-option" onClick={() => { onChange(o.id, o.label); setOpen(false); setQ(''); }}>
                <span>{o.label}</span>
                {o.sub ? <span className="muted small"> {o.sub}</span> : null}
              </button>
            </li>
          ))}
          {shown ? <li><button type="button" className="btn sm ghost" onClick={() => setOpen(false)}>Keep {shown}</button></li> : null}
        </ul>
      ) : null}
    </div>
  );
}

export function FieldInput({ f, id, value, label, onChange, companyId }: { f: FieldDef; id: string; value: unknown; label?: string; onChange: (v: unknown, label?: string) => void; companyId: string }) {
  const s = (v: unknown) => (v === null || v === undefined ? '' : String(v));
  switch (f.type) {
    case 'textarea':
      return <textarea id={id} className="textarea" rows={3} maxLength={f.max ?? 5000} required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value)} />;
    case 'number':
    case 'percent':
    case 'integer':
      return <input id={id} className="input erp-qty-input" type="number" inputMode="decimal" step={f.type === 'integer' ? 1 : 'any'} min={f.min ?? 0} max={f.max} required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />;
    case 'money':
      return <MoneyInput id={id} value={value} required={f.required} allowNegative={(f.min ?? 0) < 0} onChange={(v) => onChange(v)} />;
    case 'date':
      return <input id={id} className="input" type="date" required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value || null)} />;
    case 'time':
      return <input id={id} className="input" type="time" required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value || null)} />;
    case 'select':
      return (
        <select id={id} className="select" required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value || null)}>
          {!f.required || value === null || value === undefined ? <option value="">Choose…</option> : null}
          {Object.entries(f.options ?? {}).filter(([k]) => !f.retired?.includes(k) || k === value).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      );
    case 'bool':
      return (
        <label className="row erp-check">
          <input id={id} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} /> <span>{value === true ? 'Yes' : 'No'}</span>
        </label>
      );
    case 'currency':
      return <input id={id} className="input erp-unit-input" maxLength={3} required={f.required} placeholder="AUD" value={s(value)} onChange={(e) => onChange(e.target.value.toUpperCase() || null)} />;
    case 'country':
      return <input id={id} className="input erp-unit-input" maxLength={2} required={f.required} placeholder="AU" value={s(value)} onChange={(e) => onChange(e.target.value.toUpperCase() || null)} />;
    case 'ref':
      return <RefPicker companyId={companyId} kind={f.ref!} id={id} value={value} label={label} required={f.required} onChange={(v, l) => onChange(v, l)} />;
    case 'email':
      return <input id={id} className="input" type="email" maxLength={320} required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value)} />;
    case 'phone':
      return <input id={id} className="input" type="tel" maxLength={40} required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value)} />;
    case 'url':
      return <input id={id} className="input" type="url" maxLength={300} required={f.required} placeholder="https://" value={s(value)} onChange={(e) => onChange(e.target.value)} />;
    default:
      return <input id={id} className="input" maxLength={f.max ?? 200} required={f.required} value={s(value)} onChange={(e) => onChange(e.target.value)} />;
  }
}
