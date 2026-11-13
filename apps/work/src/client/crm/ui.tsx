// Small building blocks of the CRM screens, on the app's design system (src/client/components/ui, styles/app.css).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { Avatar } from '../components/ui/ui';
import { Icon } from '../components/ui/Icon';
import { Dropdown, MenuItem } from '../components/ui/overlays';
import { useDebounced } from '../lib/hooks';
import type { ListOption, OrgSettings } from '../../shared/crm/defaults';
import { FIELDS, OP_LABELS, VALUELESS_OPS, customFieldFilterType, opsFor, type CrmEntity, type FieldDef, type FieldType, type FilterCond, type FilterOp } from '../../shared/crm/fields';
import type { CustomFieldDTO, ListResult, TagDTO } from '../../shared/crm/types';
import { fromMinor, toMinor } from '../../shared/crm/money';
import { ENTITY_PATH, crm, optionsOf, recordPath, useCustomFields, useMembers, useOrgId, usePeople, usePipelines, useTags } from './lib';

/** A choice from a list: a coloured dot (identity) and the label in ordinary text. */
export function Chip({ list, value, empty = '' }: { list: ListOption[]; value: string | null | undefined; empty?: string }) {
  if (!value) return empty ? <span className="muted">{empty}</span> : null;
  const o = list.find((x) => x.key === value);
  return (
    <span className="crm-chip">
      <span className="crm-dot" style={{ background: o?.color ?? 'var(--border-strong)' }} aria-hidden />
      {o?.label ?? value}
    </span>
  );
}

export function PersonChip({ id, small }: { id: string | null | undefined; small?: boolean }) {
  const people = usePeople();
  const m = people.get(id);
  if (!id) return <span className="muted">Unassigned</span>;
  return (
    <span className="row crm-person" title={m?.email}>
      <Avatar name={m?.name ?? 'Former member'} id={id} url={m?.avatarUrl} size={small ? 'sm' : undefined} />
      <span className="ellipsis">{m?.name ?? 'Former member'}</span>
    </span>
  );
}

export function RecordLink({ entity, refDto }: { entity: 'lead' | 'contact' | 'company' | 'deal' | 'activity'; refDto: { id: string; name: string } | null }) {
  const orgId = useOrgId();
  if (!refDto) return <span className="muted">None</span>;
  return <Link to={recordPath(orgId, entity, refDto.id)}>{refDto.name}</Link>;
}

/** An amount typed in the currency's units, kept in minor units. */
export function MoneyInput({ value, onChange, currency, id, placeholder, ariaLabel }: { value: number | null | undefined; onChange: (v: number | null) => void; currency: string; id?: string; placeholder?: string; ariaLabel?: string }) {
  const [text, setText] = useState(value === null || value === undefined ? '' : fromMinor(value, currency));
  const [error, setError] = useState(false);
  useEffect(() => {
    setText(value === null || value === undefined ? '' : fromMinor(value, currency));
  }, [value, currency]);
  return (
    <div className="crm-money">
      <span className="crm-money-cur" aria-hidden>{currency}</span>
      <input
        id={id}
        className={`input${error ? ' invalid' : ''}`}
        inputMode="decimal"
        placeholder={placeholder ?? '0.00'}
        aria-label={ariaLabel}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          try {
            const v = toMinor(text.replace(/[^\d.,-]/g, '').replace(/,(?=\d{3}(\D|$))/g, ''), currency);
            setError(false);
            onChange(v === null ? null : Math.max(0, v));
          } catch {
            setError(true);
          }
        }}
      />
    </div>
  );
}

export function OptionSelect({ options, value, onChange, id, allowEmpty, emptyLabel = 'None', ariaLabel }: { options: ListOption[]; value: string | null | undefined; onChange: (v: string) => void; id?: string; allowEmpty?: boolean; emptyLabel?: string; ariaLabel?: string }) {
  const known = options.some((o) => o.key === value);
  return (
    <select id={id} className="select" value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-label={ariaLabel}>
      {allowEmpty ? <option value="">{emptyLabel}</option> : null}
      {value && !known ? <option value={value}>{value}</option> : null}
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function UserSelect({ value, onChange, id, allowEmpty = true, emptyLabel = 'Unassigned', ariaLabel }: { value: string | null | undefined; onChange: (v: string | null) => void; id?: string; allowEmpty?: boolean; emptyLabel?: string; ariaLabel?: string }) {
  const members = useMembers().data ?? [];
  return (
    <select id={id} className="select" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} aria-label={ariaLabel}>
      {allowEmpty ? <option value="">{emptyLabel}</option> : null}
      {value && !members.some((m) => m.userId === value) ? <option value={value}>Former member</option> : null}
      {members.map((m) => (
        <option key={m.userId} value={m.userId}>
          {m.name}
        </option>
      ))}
    </select>
  );
}

const PICK_FIELD: Record<string, string> = { contact: 'name', company: 'name', deal: 'title', lead: 'name' };

/** Choose a contact, company, deal or lead of this organisation by typing part of its name. */
export function RecordPicker({ entity, value, onChange, id, placeholder }: { entity: 'contact' | 'company' | 'deal' | 'lead'; value: { id: string; name: string } | null; onChange: (v: { id: string; name: string } | null) => void; id?: string; placeholder?: string }) {
  const orgId = useOrgId();
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const q = useDebounced(text, 200);
  const results = useQuery({
    queryKey: ['crm', orgId, 'pick', entity, q],
    queryFn: () => get<ListResult<any>>(`${crm(orgId, `/${ENTITY_PATH[entity]}`)}?q=${encodeURIComponent(q)}&pageSize=8&query=${encodeURIComponent(JSON.stringify({ sort: { field: 'updatedAt', dir: 'desc' } }))}`),
    enabled: open,
  });
  if (value) {
    return (
      <div className="row crm-picked">
        <span className="grow ellipsis">{value.name}</span>
        <button type="button" className="btn ghost icon sm" aria-label={`Remove ${value.name}`} onClick={() => onChange(null)}>
          <Icon name="x" size={14} />
        </button>
      </div>
    );
  }
  return (
    <div className="crm-picker">
      <input
        id={id}
        className="input"
        placeholder={placeholder ?? `Search ${ENTITY_PATH[entity]}`}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open ? (
        <div className="crm-picker-list card" role="listbox">
          {results.isLoading ? <div className="muted small crm-picker-row">Searching…</div> : null}
          {(results.data?.rows ?? []).map((r) => (
            <button type="button" key={r.id} role="option" aria-selected={false} className="crm-picker-row" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange({ id: r.id, name: r[PICK_FIELD[entity]] || r.title || r.name }); setText(''); setOpen(false); }}>
              <span className="ellipsis">{r[PICK_FIELD[entity]] || r.title || r.name}</span>
              <span className="muted small ellipsis">{r.email || r.company?.name || r.website || ''}</span>
            </button>
          ))}
          {results.data && !results.data.rows.length ? <div className="muted small crm-picker-row">Nothing found</div> : null}
        </div>
      ) : null}
    </div>
  );
}

export function TagChips({ tags }: { tags: TagDTO[] }) {
  if (!tags.length) return null;
  return (
    <span className="row wrap crm-tags">
      {tags.map((t) => (
        <span key={t.id} className="crm-tag">
          <span className="crm-dot" style={{ background: t.color }} aria-hidden />
          {t.name}
        </span>
      ))}
    </span>
  );
}

/** Choose tags; a new name creates the tag. */
export function TagPicker({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) {
  const tags = useTags();
  const orgId = useOrgId();
  const [text, setText] = useState('');
  const chosen = (tags.data ?? []).filter((t) => value.includes(t.id));
  const add = async () => {
    const name = text.trim();
    if (!name) return;
    const existing = (tags.data ?? []).find((t) => t.name.toLowerCase() === name.toLowerCase());
    const { post } = await import('../lib/api');
    const tag = existing ?? (await post<TagDTO>(crm(orgId, '/tags'), { name }));
    await tags.refetch();
    if (!value.includes(tag.id)) onChange([...value, tag.id]);
    setText('');
  };
  return (
    <div className="stack">
      <div className="row wrap">
        {chosen.map((t) => (
          <span key={t.id} className="crm-tag">
            <span className="crm-dot" style={{ background: t.color }} aria-hidden />
            {t.name}
            <button type="button" className="btn ghost icon sm" aria-label={`Remove tag ${t.name}`} onClick={() => onChange(value.filter((x) => x !== t.id))}>
              <Icon name="x" size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="row">
        <input className="input" list="crm-tag-names" placeholder="Add a tag" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} aria-label="Tag name" />
        <datalist id="crm-tag-names">
          {(tags.data ?? []).map((t) => (
            <option key={t.id} value={t.name} />
          ))}
        </datalist>
        <button type="button" className="btn" onClick={add} disabled={!text.trim()}>
          Add
        </button>
      </div>
    </div>
  );
}

/** Inputs for the organisation's custom fields of one record type. */
export function CustomFieldInputs({ fields, value, onChange, currency }: { fields: CustomFieldDTO[]; value: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void; currency: string }) {
  const set = (id: string, v: unknown) => onChange({ ...value, [id]: v === '' ? null : v });
  return (
    <>
      {fields
        .filter((f) => !f.archived)
        .map((f) => {
          const id = `cf-${f.id}`;
          const v = value[f.id];
          let input: ReactNode;
          switch (f.type) {
            case 'textarea':
              input = <textarea id={id} className="textarea" rows={3} value={(v as string) ?? ''} onChange={(e) => set(f.id, e.target.value)} />;
              break;
            case 'number':
              input = <input id={id} className="input" type="number" value={(v as number) ?? ''} onChange={(e) => set(f.id, e.target.value === '' ? null : Number(e.target.value))} />;
              break;
            case 'money':
              input = <MoneyInput id={id} currency={currency} value={(v as number) ?? null} onChange={(x) => set(f.id, x)} />;
              break;
            case 'date':
              input = <input id={id} className="input" type="date" value={(v as string) ?? ''} onChange={(e) => set(f.id, e.target.value)} />;
              break;
            case 'checkbox':
              input = (
                <label className="checkbox">
                  <input id={id} type="checkbox" checked={!!v} onChange={(e) => set(f.id, e.target.checked)} /> Yes
                </label>
              );
              break;
            case 'select':
              input = <OptionSelect id={id} allowEmpty options={f.options.map((o) => ({ key: o, label: o }))} value={(v as string) ?? ''} onChange={(x) => set(f.id, x)} />;
              break;
            case 'multiselect': {
              const list = Array.isArray(v) ? (v as string[]) : [];
              input = (
                <div className="row wrap" role="group" aria-label={f.label}>
                  {f.options.map((o) => (
                    <label key={o} className="checkbox">
                      <input type="checkbox" checked={list.includes(o)} onChange={(e) => set(f.id, e.target.checked ? [...list, o] : list.filter((x) => x !== o))} /> {o}
                    </label>
                  ))}
                </div>
              );
              break;
            }
            default:
              input = <input id={id} className="input" type={f.type === 'email' ? 'email' : f.type === 'url' ? 'url' : f.type === 'phone' ? 'tel' : 'text'} value={(v as string) ?? ''} onChange={(e) => set(f.id, e.target.value)} />;
          }
          return (
            <div className="field" key={f.id}>
              <label htmlFor={id}>
                {f.label}
                {f.required ? ' *' : ''}
              </label>
              {input}
            </div>
          );
        })}
    </>
  );
}

// ------------------------------------------------------------------ filters

interface FilterField {
  key: string;
  label: string;
  type: FieldType | 'tag';
  options?: ListOption[];
}

/** Every field a list can filter on: built-in fields, tags and the organisation's custom fields. */
export function useFilterFields(entity: CrmEntity, settings: OrgSettings): FilterField[] {
  const members = useMembers().data ?? [];
  const pipelines = usePipelines().data ?? [];
  const tags = useTags().data ?? [];
  const cfs = useCustomFields().data ?? [];
  return useMemo(() => {
    const people: ListOption[] = [{ key: 'me', label: 'Me' }, ...members.map((m) => ({ key: m.userId, label: m.name }))];
    const out: FilterField[] = FIELDS[entity]
      .filter((f) => !f.formOnly && !(['company', 'contact', 'deal', 'lead'] as FieldType[]).includes(f.type))
      .map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type,
        options:
          f.type === 'user'
            ? people
            : f.type === 'pipeline'
              ? pipelines.map((p) => ({ key: p.id, label: p.name }))
              : f.type === 'stage'
                ? pipelines.flatMap((p) => p.stages.map((s) => ({ key: s.id, label: pipelines.length > 1 ? `${p.name}: ${s.name}` : s.name })))
                : f.type === 'enum'
                  ? optionsOf(f.list as FieldDef['list'], settings)
                  : undefined,
      }));
    if (entity !== 'activity') out.push({ key: 'tag', label: 'Tag', type: 'tag', options: tags.map((t) => ({ key: t.id, label: t.name })) });
    for (const cf of cfs.filter((c) => c.entity === entity && !c.archived)) {
      out.push({ key: `cf:${cf.id}`, label: cf.label, type: customFieldFilterType(cf.type), options: cf.options.length ? cf.options.map((o) => ({ key: o, label: o })) : undefined });
    }
    return out;
  }, [entity, settings, members, pipelines, tags, cfs]);
}

export function FilterBuilder({ fields, filters, match, onChange, currency }: { fields: FilterField[]; filters: FilterCond[]; match: 'all' | 'any'; onChange: (f: FilterCond[], m: 'all' | 'any') => void; currency: string }) {
  const update = (i: number, patch: Partial<FilterCond>) => onChange(filters.map((f, j) => (j === i ? { ...f, ...patch } : f)), match);
  return (
    <div className="stack crm-filters">
      {filters.length > 1 ? (
        <div className="row small">
          Show records that match
          <select className="select sm" value={match} onChange={(e) => onChange(filters, e.target.value as 'all' | 'any')} aria-label="Match">
            <option value="all">all conditions</option>
            <option value="any">any condition</option>
          </select>
        </div>
      ) : null}
      {filters.map((f, i) => {
        const def = fields.find((x) => x.key === f.field) ?? fields[0];
        const ops = opsFor(def.type);
        return (
          <div className="row wrap crm-filter-row" key={i}>
            <select className="select sm" aria-label="Field" value={f.field} onChange={(e) => {
              const nd = fields.find((x) => x.key === e.target.value)!;
              update(i, { field: nd.key, op: opsFor(nd.type)[0], value: undefined });
            }}>
              {fields.map((x) => (
                <option key={x.key} value={x.key}>{x.label}</option>
              ))}
            </select>
            <select className="select sm" aria-label="Condition" value={f.op} onChange={(e) => update(i, { op: e.target.value as FilterOp })}>
              {ops.map((o) => (
                <option key={o} value={o}>{OP_LABELS[o]}</option>
              ))}
            </select>
            <FilterValue def={def} cond={f} currency={currency} onChange={(value) => update(i, { value })} />
            <button type="button" className="btn ghost icon sm" aria-label="Remove condition" onClick={() => onChange(filters.filter((_, j) => j !== i), match)}>
              <Icon name="x" size={14} />
            </button>
          </div>
        );
      })}
      <div>
        <button type="button" className="btn sm" onClick={() => onChange([...filters, { field: fields[0].key, op: opsFor(fields[0].type)[0] }], match)}>
          <Icon name="plus" size={14} /> Add condition
        </button>
      </div>
    </div>
  );
}

function FilterValue({ def, cond, currency, onChange }: { def: FilterField; cond: FilterCond; currency: string; onChange: (v: unknown) => void }) {
  if (VALUELESS_OPS.has(cond.op)) return null;
  if (cond.op === 'last_days' || cond.op === 'next_days') return <input className="input sm crm-num" type="number" min={0} aria-label="Days" value={(cond.value as number) ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />;
  if (def.options && (cond.op === 'in' || cond.op === 'not_in' || cond.op === 'has' || cond.op === 'has_not')) {
    const list = Array.isArray(cond.value) ? (cond.value as string[]) : [];
    return (
      <Dropdown
        width={240}
        label={def.label}
        trigger={(open, ref) => (
          <button type="button" ref={ref} className="btn sm" onClick={open}>
            {list.length ? `${list.length} chosen` : 'Choose'} <Icon name="chevronDown" size={12} />
          </button>
        )}
      >
        {() => (
          <div className="crm-option-list">
            {def.options!.map((o) => (
              <label key={o.key} className="checkbox crm-option">
                <input type="checkbox" checked={list.includes(o.key)} onChange={(e) => onChange(e.target.checked ? [...list, o.key] : list.filter((x) => x !== o.key))} /> {o.label}
              </label>
            ))}
            {!def.options!.length ? <div className="muted small">No choices yet</div> : null}
          </div>
        )}
      </Dropdown>
    );
  }
  if (def.type === 'date' || def.type === 'datetime') return <input className="input sm" type="date" aria-label="Date" value={(cond.value as string) ?? ''} onChange={(e) => onChange(e.target.value || undefined)} />;
  if (def.type === 'money') return <span className="crm-filter-money"><MoneyInput currency={currency} ariaLabel="Amount" value={(cond.value as number) ?? null} onChange={(v) => onChange(v ?? undefined)} /></span>;
  if (def.type === 'int' || def.type === 'percent') return <input className="input sm crm-num" type="number" aria-label="Number" value={(cond.value as number) ?? ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />;
  return <input className="input sm" aria-label="Value" value={(cond.value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
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

export function useClickOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fn();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, fn]);
}

export function MenuButton({ label, items }: { label: string; items: { label: string; icon?: string; onClick: () => void; danger?: boolean; hidden?: boolean }[] }) {
  const shown = items.filter((i) => !i.hidden);
  if (!shown.length) return null;
  return (
    <Dropdown
      align="end"
      label={label}
      trigger={(open, ref) => (
        <button ref={ref} className="btn icon" aria-label={label} onClick={open}>
          <Icon name="more" />
        </button>
      )}
    >
      {(close) => (
        <>
          {shown.map((i) => (
            <MenuItem key={i.label} icon={i.icon} danger={i.danger} onClick={() => { close(); i.onClick(); }}>
              {i.label}
            </MenuItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}

export const useRefDummy = useRef;
