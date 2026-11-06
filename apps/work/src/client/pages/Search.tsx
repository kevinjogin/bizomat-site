import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, post } from '../lib/api';
import { useMembers, useWorkspace } from '../lib/session';
import { useDebounced, usePageTitle } from '../lib/hooks';
import { formatDate, mentionText, timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Field, Spinner } from '../components/ui/ui';
import { Modal, useToast } from '../components/ui/overlays';
import { useBoards } from '../components/layout/CreateDialogs';
import { OPERATOR_LABELS, opNeedsValue, type FilterGroup, type FilterRule } from '../../shared/filters';
import type { FilterOperator } from '../../shared/columns';
import '../styles/content.css';

const TYPES = [
  { v: 'boards', l: 'Boards', icon: 'grid' },
  { v: 'items', l: 'Items', icon: 'checkSquare' },
  { v: 'subitems', l: 'Subitems', icon: 'subitem' },
  { v: 'documents', l: 'Documents', icon: 'doc' },
  { v: 'comments', l: 'Comments', icon: 'message' },
  { v: 'users', l: 'People', icon: 'users' },
] as const;
type SearchType = (typeof TYPES)[number]['v'];

const SORTS = [
  { v: 'relevance', l: 'Relevance' },
  { v: 'updated_desc', l: 'Recently updated' },
  { v: 'updated_asc', l: 'Least recently updated' },
  { v: 'created_desc', l: 'Newest' },
  { v: 'name_asc', l: 'Name A–Z' },
  { v: 'due_asc', l: 'Due date' },
];

const FIELDS: { v: string; l: string; ops: FilterOperator[]; input?: 'text' | 'date' | 'number' }[] = [
  { v: 'name', l: 'Name', ops: ['contains', 'not_contains', 'is', 'is_not', 'is_empty', 'is_not_empty'], input: 'text' },
  { v: 'done', l: 'Completion', ops: ['is', 'is_not'] },
  { v: 'created_at', l: 'Created date', ops: ['on', 'before', 'after', 'today', 'this_week', 'within_last_days'], input: 'date' },
  { v: 'updated_at', l: 'Updated date', ops: ['on', 'before', 'after', 'today', 'this_week', 'within_last_days'], input: 'date' },
];

interface Query {
  q: string;
  types: SearchType[];
  boardIds: string[];
  statuses: string[];
  priorities: string[];
  people: string[];
  dateRange: { field: 'created_at' | 'updated_at' | 'due'; from: string; to: string };
  filter: FilterGroup;
  sort: string;
}

const EMPTY: Query = {
  q: '',
  types: ['boards', 'items', 'subitems', 'documents', 'comments', 'users'],
  boardIds: [],
  statuses: [],
  priorities: [],
  people: [],
  dateRange: { field: 'updated_at', from: '', to: '' },
  filter: { op: 'and', rules: [] },
  sort: 'relevance',
};

function isGroup(r: FilterRule | FilterGroup): r is FilterGroup {
  return Array.isArray((r as FilterGroup).rules);
}

function cleanFilter(g: FilterGroup): FilterGroup {
  return {
    op: g.op,
    rules: g.rules
      .map((r) => (isGroup(r) ? cleanFilter(r) : r))
      .filter((r) => (isGroup(r) ? r.rules.length > 0 : !opNeedsValue(r.op) || r.field === 'done' || (r.value !== '' && r.value != null))),
  };
}

function toPayload(q: Query) {
  const filter = cleanFilter(q.filter);
  return {
    q: q.q,
    types: q.types,
    boardIds: q.boardIds.length ? q.boardIds : undefined,
    statuses: q.statuses.length ? q.statuses : undefined,
    priorities: q.priorities.length ? q.priorities : undefined,
    people: q.people.length ? q.people : undefined,
    dateRange: q.dateRange.from || q.dateRange.to ? { field: q.dateRange.field, from: q.dateRange.from || undefined, to: q.dateRange.to || undefined } : undefined,
    filter: filter.rules.length ? filter : undefined,
    sort: q.sort,
    limit: 50,
  };
}

export default function Search() {
  const ws = useWorkspace();
  usePageTitle('Search');
  const [params] = useSearchParams();
  const [query, setQuery] = useState<Query>(() => ({ ...EMPTY, q: params.get('q') ?? '', people: params.get('people') ? [params.get('people')!] : [] }));
  const [saveOpen, setSaveOpen] = useState(false);
  const boards = useBoards(ws.id);
  const members = useMembers(ws.id);
  const qc = useQueryClient();
  const toast = useToast();
  const payload = useDebounced(useMemo(() => toPayload(query), [query]), 300);
  const hasCriteria = !!(payload.q || payload.boardIds || payload.statuses || payload.priorities || payload.people || payload.dateRange || payload.filter);
  const res = useQuery({
    queryKey: ['search', ws.id, payload],
    queryFn: () => post<Record<string, any[]>>(`/workspaces/${ws.id}/search`, payload),
    enabled: hasCriteria,
    placeholderData: (prev) => prev,
  });
  const saved = useQuery({ queryKey: ['saved-filters', ws.id], queryFn: () => get<{ id: string; name: string; query: Query; createdAt: number }[]>(`/workspaces/${ws.id}/saved-filters`) });
  const set = <K extends keyof Query>(k: K, v: Query[K]) => setQuery((q) => ({ ...q, [k]: v }));
  const toggleIn = <K extends 'types' | 'boardIds' | 'people'>(k: K, v: string) => setQuery((q) => ({ ...q, [k]: (q[k] as string[]).includes(v) ? (q[k] as string[]).filter((x) => x !== v) : [...(q[k] as string[]), v] }));
  const base = `/w/${ws.id}`;
  const r = res.data ?? {};
  const total = Object.values(r).reduce((s, a) => s + (Array.isArray(a) ? a.length : 0), 0);

  return (
    <div className="page" style={{ maxWidth: 1360 }}>
      <div className="page-header">
        <div className="grow">
          <h1>Search</h1>
          <p>Find boards, items, documents, comments and people. Combine filters with AND / OR logic.</p>
        </div>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="search-trigger" style={{ maxWidth: 'none', cursor: 'text', background: 'var(--surface)', height: 42 }}>
          <Icon name="search" />
          <input className="grow" aria-label="Search query" autoFocus value={query.q} onChange={(e) => set('q', e.target.value)} placeholder="Search everything…" style={{ border: 0, background: 'transparent', outline: 'none', height: '100%', fontSize: 15 }} maxLength={200} />
          {res.isFetching ? <Spinner /> : null}
        </div>
      </div>
      <div className="search-layout">
        <aside className="filters card card-pad" aria-label="Search filters">
          <Field label="Search in">
            <div className="row wrap" style={{ gap: 6 }}>
              {TYPES.map((t) => <button key={t.v} type="button" className={`chip${query.types.includes(t.v) ? ' on' : ''}`} aria-pressed={query.types.includes(t.v)} onClick={() => toggleIn('types', t.v)}><Icon name={t.icon} size={12} /> {t.l}</button>)}
            </div>
          </Field>
          <Field label="Boards">
            <div className="row wrap" style={{ gap: 6, maxHeight: 120, overflow: 'auto' }}>
              {(boards.data ?? []).map((b) => <button key={b.id} type="button" className={`chip${query.boardIds.includes(b.id) ? ' on' : ''}`} aria-pressed={query.boardIds.includes(b.id)} onClick={() => toggleIn('boardIds', b.id)}>{b.name}</button>)}
            </div>
          </Field>
          <ChipInput label="Status labels" values={query.statuses} onChange={(v) => set('statuses', v)} placeholder="e.g. Done, Stuck" />
          <ChipInput label="Priority labels" values={query.priorities} onChange={(v) => set('priorities', v)} placeholder="e.g. High" />
          <Field label="People (assigned)">
            <div className="row wrap" style={{ gap: 6, maxHeight: 120, overflow: 'auto' }}>
              {(members.data ?? []).map((m) => <button key={m.id} type="button" className={`chip${query.people.includes(m.id) ? ' on' : ''}`} aria-pressed={query.people.includes(m.id)} onClick={() => toggleIn('people', m.id)}>{m.name}</button>)}
            </div>
          </Field>
          <Field label="Date range">
            <select className="select sm" aria-label="Date field" value={query.dateRange.field} onChange={(e) => set('dateRange', { ...query.dateRange, field: e.target.value as any })}>
              <option value="updated_at">Updated</option>
              <option value="created_at">Created</option>
              <option value="due">Due date</option>
            </select>
            <div className="row">
              <input className="input sm" type="date" aria-label="From date" value={query.dateRange.from} onChange={(e) => set('dateRange', { ...query.dateRange, from: e.target.value })} />
              <input className="input sm" type="date" aria-label="To date" value={query.dateRange.to} onChange={(e) => set('dateRange', { ...query.dateRange, to: e.target.value })} />
            </div>
          </Field>
          <Field label="Sort by" htmlFor="s-sort">
            <select id="s-sort" className="select sm" value={query.sort} onChange={(e) => set('sort', e.target.value)}>{SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}</select>
          </Field>
          <Field label="Advanced filter (items)">
            <GroupEditor group={query.filter} onChange={(g) => set('filter', g)} depth={0} />
          </Field>
          <div className="row wrap">
            <button className="btn sm" onClick={() => setQuery({ ...EMPTY })}>Reset</button>
            <button className="btn sm primary" onClick={() => setSaveOpen(true)} disabled={!hasCriteria}><Icon name="star" size={13} /> Save filter</button>
          </div>
          {saved.data?.length ? (
            <>
              <hr />
              <div className="label" style={{ marginBottom: 6 }}>Saved filters</div>
              <div className="col" style={{ gap: 2 }}>
                {saved.data.map((s) => (
                  <div key={s.id} className="row small">
                    <button className="btn ghost sm grow" style={{ justifyContent: 'flex-start' }} onClick={() => setQuery({ ...EMPTY, ...s.query, dateRange: { ...EMPTY.dateRange, ...(s.query.dateRange ?? {}) }, filter: s.query.filter ?? EMPTY.filter })}>
                      <Icon name="filter" size={13} /> <span className="ellipsis">{s.name}</span>
                    </button>
                    <button className="btn ghost icon sm" aria-label={`Delete saved filter ${s.name}`} onClick={async () => {
                      try { await del(`/saved-filters/${s.id}`); qc.invalidateQueries({ queryKey: ['saved-filters', ws.id] }); } catch (e) { toast(errorMessage(e), 'error'); }
                    }}><Icon name="trash" size={12} /></button>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </aside>
        <div aria-live="polite">
          {!hasCriteria ? (
            <EmptyState icon="search" title="Start typing or add a filter">Results across every board and document you can access will appear here.</EmptyState>
          ) : res.error ? <ErrorBox error={res.error} retry={() => res.refetch()} /> : res.isLoading ? <div className="center-fill"><Spinner /></div> : total === 0 ? (
            <EmptyState icon="search" title="No results">Try fewer filters or a different search term.</EmptyState>
          ) : (
            <>
              <p className="muted small">{total} result{total === 1 ? '' : 's'}</p>
              <Section title="Boards" icon="grid" rows={r.boards} render={(b) => (
                <Link key={b.id} to={`${base}/boards/${b.id}`} className="list-row"><Icon name="grid" /><span className="grow ellipsis" style={{ fontWeight: 500 }}>{b.name}</span><span className="muted small">{timeAgo(b.updated_at)}</span></Link>
              )} />
              {(['items', 'subitems'] as const).map((k) => (
                <Section key={k} title={k === 'items' ? 'Items' : 'Subitems'} icon={k === 'items' ? 'checkSquare' : 'subitem'} rows={r[k]} render={(i) => (
                  <Link key={i.id} to={`${base}/boards/${i.boardId}?item=${i.parentItemId ?? i.id}`} className="list-row">
                    <Icon name={k === 'items' ? 'checkSquare' : 'subitem'} />
                    <span className="grow" style={{ minWidth: 0 }}>
                      <span className="ellipsis" style={{ display: 'block', fontWeight: 500 }}>{i.name}</span>
                      <span className="muted small">{i.boardName}</span>
                    </span>
                    {i.completedAt ? <span className="badge success">Done</span> : null}
                    {i.due ? <span className="muted small">Due {formatDate(i.due)}</span> : null}
                    <span className="muted small desktop-only">{timeAgo(i.updatedAt)}</span>
                  </Link>
                )} />
              ))}
              <Section title="Documents" icon="doc" rows={r.documents} render={(d) => (
                <Link key={d.id} to={`${base}/docs/${d.id}`} className="list-row">
                  <Icon name="doc" />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="ellipsis" style={{ display: 'block', fontWeight: 500 }}>{d.title}</span>
                    <span className="muted small ellipsis" style={{ display: 'block' }}>{String(d.excerpt ?? '').replace(/^[^\n]*\n/, '')}</span>
                  </span>
                  <span className="muted small">{timeAgo(d.updated_at)}</span>
                </Link>
              )} />
              <Section title="Comments" icon="message" rows={r.comments} render={(cm) => (
                <Link key={cm.id} to={`${base}/boards/${cm.board_id}?item=${cm.item_id}`} className="list-row">
                  <Icon name="message" />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="ellipsis" style={{ display: 'block' }}>{mentionText(cm.body)}</span>
                    <span className="muted small">{cm.author_name} on “{cm.item_name}”</span>
                  </span>
                  <span className="muted small">{timeAgo(cm.created_at)}</span>
                </Link>
              )} />
              <Section title="People" icon="users" rows={r.users} render={(u) => (
                <button key={u.id} className="list-row" style={{ border: 0, background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => setQuery((q) => ({ ...q, people: [u.id], types: ['items', 'subitems'], q: '' }))} title="Show items assigned to this person">
                  <Avatar name={u.name} id={u.id} url={u.avatarUrl} size="sm" />
                  <span className="grow">{u.name} <span className="muted small">{u.email}</span></span>
                  <span className="badge">{u.role}</span>
                </button>
              )} />
            </>
          )}
        </div>
      </div>
      {saveOpen ? <SaveFilterDialog wsId={ws.id} query={query} onClose={() => setSaveOpen(false)} /> : null}
    </div>
  );
}

function Section({ title, icon, rows, render }: { title: string; icon: string; rows?: any[]; render: (r: any) => React.ReactNode }) {
  if (!rows?.length) return null;
  return (
    <section className="result-section">
      <h3><Icon name={icon} /> {title} <span className="badge">{rows.length}</span></h3>
      <div className="card list">{rows.map(render)}</div>
    </section>
  );
}

function ChipInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [text, setText] = useState('');
  const add = () => {
    const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange(Array.from(new Set([...values, ...parts])).slice(0, 20));
    setText('');
  };
  return (
    <Field label={label}>
      <div className="row wrap" style={{ gap: 4 }}>
        {values.map((v) => (
          <span key={v} className="chip on">{v}<button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter((x) => x !== v))}><Icon name="x" size={11} /></button></span>
        ))}
      </div>
      <input className="input sm" aria-label={label} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} onBlur={add} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} maxLength={60} />
    </Field>
  );
}

function GroupEditor({ group, onChange, depth }: { group: FilterGroup; onChange: (g: FilterGroup) => void; depth: number }) {
  const update = (i: number, r: FilterRule | FilterGroup) => onChange({ ...group, rules: group.rules.map((x, j) => (j === i ? r : x)) });
  const remove = (i: number) => onChange({ ...group, rules: group.rules.filter((_, j) => j !== i) });
  return (
    <div className="col" style={{ gap: 6, ...(depth ? { borderLeft: '2px solid var(--accent)', paddingLeft: 8 } : {}) }}>
      {group.rules.length > 1 ? (
        <div className="row small">
          Match
          <select className="select sm" style={{ width: 'auto' }} aria-label="Match all or any" value={group.op} onChange={(e) => onChange({ ...group, op: e.target.value as 'and' | 'or' })}>
            <option value="and">ALL (AND)</option>
            <option value="or">ANY (OR)</option>
          </select>
          of these
        </div>
      ) : null}
      {group.rules.map((r, i) =>
        isGroup(r) ? (
          <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
            <div className="grow"><GroupEditor group={r} onChange={(g) => update(i, g)} depth={depth + 1} /></div>
            <button className="btn ghost icon sm" aria-label="Remove group" onClick={() => remove(i)}><Icon name="x" size={12} /></button>
          </div>
        ) : (
          <RuleEditor key={i} rule={r} onChange={(nr) => update(i, nr)} onRemove={() => remove(i)} />
        ),
      )}
      <div className="row">
        <button type="button" className="btn ghost sm" onClick={() => onChange({ ...group, rules: [...group.rules, { field: 'name', op: 'contains', value: '' }] })}><Icon name="plus" size={12} /> Condition</button>
        {depth === 0 ? <button type="button" className="btn ghost sm" onClick={() => onChange({ ...group, rules: [...group.rules, { op: group.op === 'and' ? 'or' : 'and', rules: [{ field: 'name', op: 'contains', value: '' }] }] })}><Icon name="plus" size={12} /> Group</button> : null}
      </div>
    </div>
  );
}

function RuleEditor({ rule, onChange, onRemove }: { rule: FilterRule; onChange: (r: FilterRule) => void; onRemove: () => void }) {
  const field = FIELDS.find((f) => f.v === rule.field) ?? FIELDS[0];
  const needsValue = rule.field !== 'done' && opNeedsValue(rule.op);
  return (
    <div className="col" style={{ gap: 4, padding: 6, border: '1px solid var(--border)', borderRadius: 6 }}>
      <div className="row">
        <select className="select sm" aria-label="Field" value={rule.field} onChange={(e) => {
          const f = FIELDS.find((x) => x.v === e.target.value)!;
          onChange({ field: f.v, op: f.ops[0], value: f.v === 'done' ? undefined : '' });
        }}>
          {FIELDS.map((f) => <option key={f.v} value={f.v}>{f.l}</option>)}
        </select>
        <button className="btn ghost icon sm" aria-label="Remove condition" onClick={onRemove}><Icon name="x" size={12} /></button>
      </div>
      <select className="select sm" aria-label="Operator" value={rule.op} onChange={(e) => onChange({ ...rule, op: e.target.value as FilterOperator })}>
        {field.ops.map((o) => <option key={o} value={o}>{rule.field === 'done' ? (o === 'is' ? 'is done' : 'is not done') : OPERATOR_LABELS[o]}</option>)}
      </select>
      {needsValue ? (
        rule.op === 'within_last_days' ? (
          <input className="input sm" type="number" min={1} aria-label="Days" value={String(rule.value ?? 7)} onChange={(e) => onChange({ ...rule, value: Number(e.target.value) })} />
        ) : (
          <input className="input sm" type={field.input === 'date' ? 'date' : 'text'} aria-label="Value" value={String(rule.value ?? '')} onChange={(e) => onChange({ ...rule, value: e.target.value })} />
        )
      ) : null}
    </div>
  );
}

function SaveFilterDialog({ wsId, query, onClose }: { wsId: string; query: Query; onClose: () => void }) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();
  const save = async () => {
    if (!name.trim()) return;
    try {
      await post(`/workspaces/${wsId}/saved-filters`, { name: name.trim(), scope: 'search', query });
      qc.invalidateQueries({ queryKey: ['saved-filters', wsId] });
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  return (
    <Modal title="Save filter" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!name.trim()} onClick={save}>Save</button></>}>
      <Field label="Name" htmlFor="sf-name" error={error}>
        <input id="sf-name" className="input" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} placeholder="e.g. My overdue high-priority items" />
      </Field>
    </Modal>
  );
}
