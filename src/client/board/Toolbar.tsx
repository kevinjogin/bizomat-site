import { useRef, useState } from 'react';
import { getColumnType, labelsOf } from '../../shared/columns';
import { OPERATOR_LABELS, isGroup, opNeedsValue, operatorsFor, type FilterGroup, type FilterRule } from '../../shared/filters';
import type { BoardBundle, ColumnDTO, MemberDTO, ViewDTO, ViewSettings } from '../../shared/types';
import { Icon } from '../components/ui/Icon';
import { Popover } from '../components/ui/overlays';
import { Avatar } from '../components/ui/ui';
import type { QuickFilters } from './filtering';

const FIXED_FIELDS = [
  { id: 'name', title: 'Name' },
  { id: 'group', title: 'Group' },
  { id: 'done', title: 'Completion' },
  { id: 'created_at', title: 'Created' },
  { id: 'updated_at', title: 'Last updated' },
];

export function Toolbar({
  bundle,
  view,
  quick,
  setQuick,
  updateSettings,
  canEdit,
  onNewItem,
  members,
}: {
  bundle: BoardBundle;
  view: ViewDTO | undefined;
  quick: QuickFilters;
  setQuick: (q: QuickFilters) => void;
  updateSettings: (p: Partial<ViewSettings>) => void;
  canEdit: boolean;
  onNewItem: () => void;
  members: MemberDTO[];
}) {
  const [open, setOpen] = useState<null | 'filter' | 'sort' | 'group' | 'hide' | 'person'>(null);
  const refs = { filter: useRef<HTMLButtonElement>(null), sort: useRef<HTMLButtonElement>(null), group: useRef<HTMLButtonElement>(null), hide: useRef<HTMLButtonElement>(null), person: useRef<HTMLButtonElement>(null) };
  const s = view?.settings ?? {};
  const filterCount = countRules(s.filter);
  const sortCount = s.sort?.length ?? 0;
  const hiddenCount = s.hiddenColumns?.length ?? 0;
  const person = members.find((m) => m.id === quick.personId);
  const isTable = view?.type === 'table' || !view;
  return (
    <div className="toolbar" role="toolbar" aria-label="Board tools">
      {canEdit ? (
        <button className="btn primary sm" onClick={onNewItem}>
          <Icon name="plus" /> New item
        </button>
      ) : null}
      <div className="row" style={{ position: 'relative' }}>
        <Icon name="search" className="muted" />
        <input className="input sm" style={{ width: 180 }} placeholder="Search this board" value={quick.search} onChange={(e) => setQuick({ ...quick, search: e.target.value })} aria-label="Search this board" />
      </div>
      <button ref={refs.person} className={`btn sm${quick.personId ? ' active' : ''}`} onClick={() => setOpen('person')}>
        {person ? <Avatar id={person.id} name={person.name} url={person.avatarUrl} size="sm" /> : <Icon name="user" />} Person
      </button>
      <button ref={refs.filter} className={`btn sm${filterCount ? ' active' : ''}`} onClick={() => setOpen('filter')}>
        <Icon name="filter" /> Filter{filterCount ? ` · ${filterCount}` : ''}
      </button>
      <button ref={refs.sort} className={`btn sm${sortCount ? ' active' : ''}`} onClick={() => setOpen('sort')}>
        <Icon name="sort" /> Sort{sortCount ? ` · ${sortCount}` : ''}
      </button>
      {isTable ? (
        <button ref={refs.group} className={`btn sm${s.groupBy && s.groupBy !== 'group' ? ' active' : ''}`} onClick={() => setOpen('group')}>
          <Icon name="group" /> Group by
        </button>
      ) : null}
      {isTable ? (
        <button ref={refs.hide} className={`btn sm${hiddenCount ? ' active' : ''}`} onClick={() => setOpen('hide')}>
          <Icon name="eyeOff" /> Hide{hiddenCount ? ` · ${hiddenCount}` : ''}
        </button>
      ) : null}
      {open === 'person' ? (
        <Popover anchor={refs.person} onClose={() => setOpen(null)} width={240}>
          <div className="menu-label">Filter by person</div>
          {members.map((m) => (
            <button key={m.id} className={`menu-item${quick.personId === m.id ? ' active' : ''}`} onClick={() => { setQuick({ ...quick, personId: quick.personId === m.id ? null : m.id }); setOpen(null); }}>
              <Avatar id={m.id} name={m.name} url={m.avatarUrl} size="sm" /> <span className="grow ellipsis">{m.name}</span>
            </button>
          ))}
          {quick.personId ? <button className="menu-item" onClick={() => { setQuick({ ...quick, personId: null }); setOpen(null); }}>Clear</button> : null}
        </Popover>
      ) : null}
      {open === 'filter' ? (
        <Popover anchor={refs.filter} onClose={() => setOpen(null)} width={Math.min(620, window.innerWidth - 16)}>
          <FilterBuilder bundle={bundle} members={members} value={s.filter ?? { op: 'and', rules: [] }} onChange={(f) => updateSettings({ filter: f })} />
        </Popover>
      ) : null}
      {open === 'sort' ? (
        <Popover anchor={refs.sort} onClose={() => setOpen(null)} width={360}>
          <SortBuilder columns={bundle.columns} value={s.sort ?? []} onChange={(v) => updateSettings({ sort: v })} />
        </Popover>
      ) : null}
      {open === 'group' ? (
        <Popover anchor={refs.group} onClose={() => setOpen(null)} width={240}>
          <div className="menu-label">Group rows by</div>
          {[{ id: 'group', title: 'Board groups' }, ...bundle.columns.filter((c) => ['status', 'priority', 'person', 'dropdown'].includes(c.type))].map((c) => (
            <button key={c.id} className={`menu-item${(s.groupBy ?? 'group') === c.id ? ' active' : ''}`} onClick={() => { updateSettings({ groupBy: c.id }); setOpen(null); }}>
              {c.title}
            </button>
          ))}
        </Popover>
      ) : null}
      {open === 'hide' ? (
        <Popover anchor={refs.hide} onClose={() => setOpen(null)} width={260}>
          <div className="menu-label">Columns in this view</div>
          {bundle.columns.map((c) => {
            const hidden = (s.hiddenColumns ?? []).includes(c.id);
            return (
              <label key={c.id} className="menu-item">
                <input type="checkbox" checked={!hidden} onChange={() => updateSettings({ hiddenColumns: hidden ? (s.hiddenColumns ?? []).filter((x) => x !== c.id) : [...(s.hiddenColumns ?? []), c.id] })} />
                <span className="grow">{c.title}</span>
                <span className="muted small">{getColumnType(c.type).label}</span>
              </label>
            );
          })}
        </Popover>
      ) : null}
    </div>
  );
}

function countRules(f?: FilterGroup): number {
  if (!f) return 0;
  return f.rules.reduce((n, r) => n + (isGroup(r) ? countRules(r) : 1), 0);
}

export function FilterBuilder({ bundle, members, value, onChange, depth = 0 }: { bundle: BoardBundle; members: MemberDTO[]; value: FilterGroup; onChange: (f: FilterGroup) => void; depth?: number }) {
  const cols = new Map(bundle.columns.map((c) => [c.id, c]));
  const fields = [...FIXED_FIELDS, ...bundle.columns.map((c) => ({ id: c.id, title: c.title }))];
  const setRule = (i: number, r: FilterRule | FilterGroup) => onChange({ ...value, rules: value.rules.map((x, j) => (j === i ? r : x)) });
  const remove = (i: number) => onChange({ ...value, rules: value.rules.filter((_, j) => j !== i) });
  return (
    <div className="col" style={{ padding: depth ? 8 : 6, gap: 8, border: depth ? '1px solid var(--border)' : undefined, borderRadius: 8 }}>
      {depth === 0 ? <div className="menu-label">Show items where…</div> : null}
      {value.rules.length === 0 ? <div className="muted small">No conditions — all items are shown.</div> : null}
      {value.rules.map((r, i) => (
        <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 54, paddingTop: 4 }} className="small muted">
            {i === 0 ? 'Where' : i === 1 ? (
              <select className="select sm" value={value.op} onChange={(e) => onChange({ ...value, op: e.target.value as 'and' | 'or' })} aria-label="Combine conditions">
                <option value="and">and</option>
                <option value="or">or</option>
              </select>
            ) : value.op}
          </div>
          <div className="grow">
            {isGroup(r) ? (
              <FilterBuilder bundle={bundle} members={members} value={r} onChange={(g) => setRule(i, g)} depth={depth + 1} />
            ) : (
              <RuleEditor rule={r} fields={fields} cols={cols} bundle={bundle} members={members} onChange={(nr) => setRule(i, nr)} />
            )}
          </div>
          <button className="btn ghost icon sm" aria-label="Remove condition" onClick={() => remove(i)}><Icon name="x" /></button>
        </div>
      ))}
      <div className="row">
        <button className="btn sm" onClick={() => onChange({ ...value, rules: [...value.rules, { field: 'name', op: 'contains', value: '' }] })}><Icon name="plus" /> Add condition</button>
        {depth < 2 ? <button className="btn ghost sm" onClick={() => onChange({ ...value, rules: [...value.rules, { op: value.op === 'and' ? 'or' : 'and', rules: [] }] })}>Add group</button> : null}
        {depth === 0 && value.rules.length ? <button className="btn ghost sm" onClick={() => onChange({ op: 'and', rules: [] })}>Clear all</button> : null}
      </div>
    </div>
  );
}

function RuleEditor({ rule, fields, cols, bundle, members, onChange }: { rule: FilterRule; fields: { id: string; title: string }[]; cols: Map<string, ColumnDTO>; bundle: BoardBundle; members: MemberDTO[]; onChange: (r: FilterRule) => void }) {
  const ops = rule.field === 'done' ? (['is', 'is_not'] as const) : operatorsFor(rule.field, cols);
  const col = cols.get(rule.field);
  return (
    <div className="row wrap" style={{ gap: 6 }}>
      <select className="select sm" style={{ width: 150 }} value={rule.field} aria-label="Field" onChange={(e) => {
        const f = e.target.value;
        const nextOps = f === 'done' ? ['is'] : operatorsFor(f, cols);
        onChange({ field: f, op: (nextOps[0] ?? 'is') as FilterRule['op'], value: undefined });
      }}>
        {fields.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
      </select>
      <select className="select sm" style={{ width: 150 }} value={rule.op} aria-label="Operator" onChange={(e) => onChange({ ...rule, op: e.target.value as FilterRule['op'] })}>
        {ops.map((o) => <option key={o} value={o}>{rule.field === 'done' ? (o === 'is' ? 'is done' : 'is not done') : OPERATOR_LABELS[o]}</option>)}
      </select>
      {rule.field !== 'done' && opNeedsValue(rule.op) ? <RuleValue rule={rule} col={col} bundle={bundle} members={members} onChange={(v) => onChange({ ...rule, value: v })} /> : null}
    </div>
  );
}

function RuleValue({ rule, col, bundle, members, onChange }: { rule: FilterRule; col?: ColumnDTO; bundle: BoardBundle; members: MemberDTO[]; onChange: (v: unknown) => void }) {
  const multi = rule.op === 'any_of' || rule.op === 'none_of';
  const options: { id: string; label: string }[] | null =
    rule.field === 'group' ? bundle.groups.map((g) => ({ id: g.id, label: g.name }))
    : col && ['status', 'priority', 'dropdown'].includes(col.type) ? labelsOf(col).map((l) => ({ id: l.id, label: l.label }))
    : col && (col.type === 'person' || col.type === 'people') ? members.map((m) => ({ id: m.id, label: m.name }))
    : null;
  if (options) {
    if (multi) {
      const cur = Array.isArray(rule.value) ? (rule.value as string[]) : [];
      return (
        <div className="row wrap" style={{ gap: 4 }}>
          {options.map((o) => (
            <label key={o.id} className="badge" style={{ cursor: 'pointer', background: cur.includes(o.id) ? 'var(--accent-soft)' : undefined }}>
              <input type="checkbox" checked={cur.includes(o.id)} onChange={() => onChange(cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id])} style={{ width: 12, height: 12 }} /> {o.label}
            </label>
          ))}
        </div>
      );
    }
    return (
      <select className="select sm" style={{ width: 160 }} value={String(rule.value ?? '')} onChange={(e) => onChange(e.target.value)} aria-label="Value">
        <option value="">Choose…</option>
        {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    );
  }
  const isDate = (col && ['date', 'timeline', 'created_at', 'updated_at'].includes(col.type)) || rule.field === 'created_at' || rule.field === 'updated_at';
  if (rule.op === 'within_next_days' || rule.op === 'within_last_days') {
    return <input className="input sm" type="number" min={1} style={{ width: 80 }} value={String(rule.value ?? 7)} onChange={(e) => onChange(Number(e.target.value))} aria-label="Days" />;
  }
  if (rule.op === 'between') {
    const [a, b] = Array.isArray(rule.value) ? (rule.value as string[]) : ['', ''];
    return (
      <span className="row">
        <input className="input sm" type={isDate ? 'date' : 'number'} style={{ width: 140 }} value={a ?? ''} onChange={(e) => onChange([e.target.value, b])} aria-label="From" />
        <input className="input sm" type={isDate ? 'date' : 'number'} style={{ width: 140 }} value={b ?? ''} onChange={(e) => onChange([a, e.target.value])} aria-label="To" />
      </span>
    );
  }
  if (col?.type === 'checkbox') {
    return (
      <select className="select sm" value={String(rule.value ?? 'true')} onChange={(e) => onChange(e.target.value === 'true')} aria-label="Value">
        <option value="true">checked</option>
        <option value="false">unchecked</option>
      </select>
    );
  }
  const numeric = col && ['number', 'currency', 'percentage', 'rating', 'progress', 'formula'].includes(col.type);
  return <input className="input sm" style={{ width: 160 }} type={isDate ? 'date' : numeric ? 'number' : 'text'} value={String(rule.value ?? '')} onChange={(e) => onChange(e.target.value)} aria-label="Value" />;
}

function SortBuilder({ columns, value, onChange }: { columns: ColumnDTO[]; value: { field: string; dir: 'asc' | 'desc' }[]; onChange: (v: { field: string; dir: 'asc' | 'desc' }[]) => void }) {
  const fields = [{ id: 'name', title: 'Name' }, { id: 'created_at', title: 'Created' }, { id: 'updated_at', title: 'Last updated' }, ...columns.map((c) => ({ id: c.id, title: c.title }))];
  return (
    <div className="col" style={{ padding: 6 }}>
      <div className="menu-label">Sort by</div>
      {value.map((s, i) => (
        <div key={i} className="row">
          <select className="select sm grow" value={s.field} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, field: e.target.value } : x)))} aria-label="Sort field">
            {fields.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
          </select>
          <select className="select sm" style={{ width: 110 }} value={s.dir} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, dir: e.target.value as 'asc' | 'desc' } : x)))} aria-label="Direction">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button className="btn ghost icon sm" aria-label="Remove sort" onClick={() => onChange(value.filter((_, j) => j !== i))}><Icon name="x" /></button>
        </div>
      ))}
      <div className="row">
        <button className="btn sm" onClick={() => onChange([...value, { field: 'name', dir: 'asc' }])}><Icon name="plus" /> Add sort</button>
        {value.length ? <button className="btn ghost sm" onClick={() => onChange([])}>Clear</button> : null}
      </div>
    </div>
  );
}
