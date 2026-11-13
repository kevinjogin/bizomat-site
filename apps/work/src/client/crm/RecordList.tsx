// The list of leads, contacts, companies, deals or activities: built-in and saved views, search, filters, sortable and
// configurable columns, selection with bulk actions, pages, and CSV import and export. All filtering, sorting and
// paging happens on the server.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { appUrl } from '../lib/base';
import { useDebounced, useLocalState } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, PageHeader, Spinner } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, Modal, useConfirm, useToast } from '../components/ui/overlays';
import { DEFAULT_VIEWS, ENTITY_LABELS, FIELDS, type CrmEntity, type FieldDef, type FilterCond, type ListQuery } from '../../shared/crm/fields';
import type { ListResult, SavedViewDTO } from '../../shared/crm/types';
import { parseCsv } from '../../shared/crm/csv';
import { Chip, FilterBuilder, Pager, PersonChip, TagChips, UserSelect, useFilterFields } from './ui';
import { RecordFormDialog } from './RecordForm';
import { ENTITY_PATH, crm, download, labelOf, optionsOf, recordPath, shortDate, useCurrentOrg, useCustomFields, useMoney, usePipelines, useRefreshOrg, useTags, dateTime } from './lib';

type Query = Omit<ListQuery, 'page' | 'pageSize'>;

const ICON: Record<CrmEntity, string> = { lead: 'funnel', contact: 'user', company: 'building', deal: 'dollar', activity: 'calendar' };

export function RecordList({ entity, extraActions, initialView, presetFilters, title, subtitle, createDefaults }: { entity: CrmEntity; extraActions?: ReactNode; initialView?: string; presetFilters?: FilterCond[]; title?: string; subtitle?: string; createDefaults?: Record<string, unknown> }) {
  const org = useCurrentOrg();
  const perms = org.perms[ENTITY_LABELS[entity].module];
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefreshOrg();
  const [params, setParams] = useSearchParams();
  const label = ENTITY_LABELS[entity];
  const defaults = DEFAULT_VIEWS[entity];
  const views = useQuery({ queryKey: ['crm', org.id, 'views', entity], queryFn: () => get<SavedViewDTO[]>(`${crm(org.id, '/views')}?entity=${entity}`) });
  const viewKey = params.get('view') ?? initialView ?? defaults[0].key;
  const saved = views.data?.find((v) => v.id === viewKey);
  const builtIn = viewKey === 'deleted' ? { key: 'deleted', name: 'Deleted', query: { scope: 'deleted' as const, sort: { field: 'updatedAt', dir: 'desc' as const } } } : defaults.find((v) => v.key === viewKey);
  // The view's own conditions (always required) and the person's own on top: all of them, or any one of them.
  const viewQuery: Query = useMemo(() => {
    const q = saved?.query ?? builtIn?.query ?? defaults[0].query;
    // "Closing soon" follows the organisation's setting.
    if (entity === 'deal' && viewKey === 'closing') return { ...q, filters: (q.filters ?? []).map((f) => (f.op === 'next_days' ? { ...f, value: org.settings.closingSoonDays } : f)) };
    return q;
  }, [saved, builtIn, defaults, entity, viewKey, org.settings.closingSoonDays]);
  const [filters, setFilters] = useState<FilterCond[]>([]);
  const [match, setMatch] = useState<'all' | 'any'>('all');
  const [sort, setSort] = useState<Query['sort']>(viewQuery.sort);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const allColumns = useColumns(entity);
  const [columns, setColumns] = useLocalState<string[]>(`workos:crm:cols:${entity}`, FIELDS[entity].filter((f) => f.defaultColumn).map((f) => f.key));
  const shownColumns = (saved?.columns?.length ? saved.columns : columns).filter((k) => allColumns.some((c) => c.key === k));

  useEffect(() => {
    setFilters([]);
    setMatch('all');
    setSort(viewQuery.sort);
    setPage(1);
    setSelected(new Set());
  }, [viewKey, viewQuery]);

  const q = useDebounced(search, 250);
  // A saved view that already has an "any of" group keeps it; the person's conditions are then all required.
  const userAny = match === 'any' && filters.length > 1 && !viewQuery.anyOf?.length;
  const query: ListQuery = {
    scope: viewQuery.scope,
    q: [viewQuery.q, q].filter(Boolean).join(' ') || undefined,
    filters: [...(presetFilters ?? []), ...(viewQuery.filters ?? []), ...(userAny ? [] : filters)],
    match: viewQuery.match === 'any' && !filters.length ? 'any' : 'all',
    anyOf: userAny ? filters : viewQuery.anyOf,
    sort,
    page,
    pageSize: 50,
  };
  const list = useQuery({
    queryKey: ['crm', org.id, 'list', entity, JSON.stringify(query)],
    queryFn: () => get<ListResult<any>>(`${crm(org.id, `/${ENTITY_PATH[entity]}`)}?query=${encodeURIComponent(JSON.stringify(query))}`),
    placeholderData: keepPreviousData,
  });

  const rows = list.data?.rows ?? [];
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleSort = (key: string) => setSort((s) => (s?.field === key ? { field: key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field: key, dir: 'asc' }));

  const bulk = async (action: string, value?: string | null) => {
    if (action === 'delete' && !(await confirm({ title: `Delete ${selected.size} ${selected.size === 1 ? label.one.toLowerCase() : label.many.toLowerCase()}?`, message: 'They move to Deleted, where they can be restored.', confirmLabel: 'Delete', danger: true }))) return;
    try {
      const r = await post<{ updated: number; skipped: { id: string; reason: string }[] }>(crm(org.id, `/${ENTITY_PATH[entity]}/bulk`), { ids: [...selected], action, value });
      toast(r.skipped.length ? `${r.updated} changed, ${r.skipped.length} skipped (${r.skipped[0].reason})` : `${r.updated} changed`, r.skipped.length ? 'info' : undefined);
      setSelected(new Set());
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const exportCsv = () => download(appUrl(`/api${crm(org.id, `/${ENTITY_PATH[entity]}/export`)}?query=${encodeURIComponent(JSON.stringify({ ...query, page: undefined, pageSize: undefined }))}`));

  const saveView = async (name: string, shared: boolean) => {
    try {
      const v = await post<SavedViewDTO>(crm(org.id, '/views'), { entity, name, shared, columns: shownColumns, query: { q: query.q, filters: [...(viewQuery.filters ?? []), ...(userAny ? [] : filters)], match: query.match, anyOf: query.anyOf, sort, scope: viewQuery.scope } });
      await views.refetch();
      setParams((p) => {
        p.set('view', v.id);
        return p;
      });
      toast('View saved');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const viewName = saved?.name ?? builtIn?.name ?? defaults[0].name;
  const isDeleted = viewQuery.scope === 'deleted';

  return (
    <div className="page crm-page">
      <PageHeader
        title={title ?? label.many}
        subtitle={subtitle}
        icon={ICON[entity]}
        actions={
          <>
            {extraActions}
            {perms.import && entity !== 'deal' && entity !== 'activity' ? (
              <button className="btn" onClick={() => setImporting(true)}>
                <Icon name="upload" /> Import
              </button>
            ) : null}
            {perms.export ? (
              <button className="btn" onClick={exportCsv}>
                <Icon name="download" /> Export
              </button>
            ) : null}
            {perms.create ? (
              <button className="btn primary" onClick={() => setCreating(true)}>
                <Icon name="plus" /> New {label.one.toLowerCase()}
              </button>
            ) : null}
          </>
        }
      />
      <div className="crm-views" role="tablist" aria-label="Views">
        {defaults.filter((v) => v.key !== 'archived' && !(v.query.scope === 'deleted')).map((v) => (
          <button key={v.key} role="tab" aria-selected={viewKey === v.key} className={`tab${viewKey === v.key ? ' active' : ''}`} onClick={() => setParams((p) => (p.set('view', v.key), p))}>
            {v.name}
          </button>
        ))}
        {(views.data ?? []).map((v) => (
          <button key={v.id} role="tab" aria-selected={viewKey === v.id} className={`tab${viewKey === v.id ? ' active' : ''}`} onClick={() => setParams((p) => (p.set('view', v.id), p))}>
            {v.shared ? <Icon name="users" size={13} /> : <Icon name="star" size={13} />} {v.name}
          </button>
        ))}
        <Dropdown
          label="More views"
          trigger={(open, ref) => (
            <button ref={ref} className="tab" onClick={open}>
              More <Icon name="chevronDown" size={12} />
            </button>
          )}
        >
          {(close) => (
            <>
              {defaults.some((v) => v.key === 'archived') ? <MenuItem icon="archive" onClick={() => { close(); setParams((p) => (p.set('view', 'archived'), p)); }}>Archived</MenuItem> : null}
              {perms.delete !== 'none' ? <MenuItem icon="trash" onClick={() => { close(); setParams((p) => (p.set('view', 'deleted'), p)); }}>Deleted</MenuItem> : null}
              {saved && saved.mine ? (
                <>
                  <MenuSep />
                  <MenuItem icon="trash" danger onClick={async () => { close(); await del(crm(org.id, `/views/${saved.id}`)); await views.refetch(); setParams((p) => (p.delete('view'), p)); }}>Delete this view</MenuItem>
                </>
              ) : null}
            </>
          )}
        </Dropdown>
      </div>
      <div className="row wrap crm-toolbar">
        <div className="crm-search">
          <Icon name="search" />
          <input className="input" type="search" placeholder={`Search ${label.many.toLowerCase()}`} aria-label={`Search ${label.many.toLowerCase()}`} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <button className={`btn${filters.length ? ' active' : ''}`} onClick={() => setFilterOpen((o) => !o)} aria-expanded={filterOpen}>
          <Icon name="filter" /> Filters{filters.length ? ` (${filters.length})` : ''}
        </button>
        <ColumnsMenu all={allColumns} shown={shownColumns} onChange={setColumns} />
        <span className="grow" />
        <button className="btn" onClick={() => setSaving(true)}>
          <Icon name="star" /> Save view
        </button>
      </div>
      {filterOpen ? <FiltersPanel entity={entity} filters={filters} match={match} onChange={(f, m) => { setFilters(f); setMatch(m); setPage(1); }} /> : null}
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        <div className="crm-table-scroll">
          <table className="data-table crm-table">
            <thead>
              <tr>
                <th className="crm-check">
                  <input type="checkbox" aria-label="Select all on this page" checked={allChecked} onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())} />
                </th>
                {shownColumns.map((k) => {
                  const c = allColumns.find((x) => x.key === k)!;
                  const active = sort?.field === k;
                  return (
                    <th key={k} aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                      <button className="crm-sort" onClick={() => toggleSort(k)}>
                        {c.label}
                        {active ? <Icon name={sort!.dir === 'asc' ? 'chevronDown' : 'chevronRight'} size={12} /> : null}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={selected.has(r.id) ? 'selected' : undefined}>
                  <td className="crm-check">
                    <input type="checkbox" aria-label={`Select ${r.name ?? r.title}`} checked={selected.has(r.id)} onChange={(e) => {
                      const s = new Set(selected);
                      if (e.target.checked) s.add(r.id);
                      else s.delete(r.id);
                      setSelected(s);
                    }} />
                  </td>
                  {shownColumns.map((k, i) => (
                    <td key={k}>{i === 0 ? <Link to={recordPath(org.id, entity, r.id)} className="crm-primary">{cell(allColumns.find((c) => c.key === k)!, r)}</Link> : cell(allColumns.find((c) => c.key === k)!, r)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {list.isLoading ? (
            <div className="center-fill crm-pad"><Spinner /></div>
          ) : !rows.length ? (
            <EmptyState icon={ICON[entity]} title={search || filters.length ? 'Nothing matches' : `No ${label.many.toLowerCase()} in ${viewName.toLowerCase()}`}>
              {search || filters.length ? 'Try other words or remove a filter.' : perms.create ? `Create your first ${label.one.toLowerCase()} or import a CSV file.` : null}
            </EmptyState>
          ) : null}
        </div>
        {list.data ? <Pager page={list.data.page} pageSize={list.data.pageSize} total={list.data.total} onPage={setPage} /> : null}
      </div>
      {selected.size ? <BulkBar entity={entity} count={selected.size} deleted={isDeleted} archived={viewQuery.scope === 'archived'} onAction={bulk} onClear={() => setSelected(new Set())} /> : null}
      {creating ? <RecordFormDialog entity={entity} initial={createDefaults} onClose={() => setCreating(false)} /> : null}
      {importing ? <ImportDialog entity={entity as 'lead' | 'contact' | 'company'} onClose={() => setImporting(false)} /> : null}
      {saving ? <SaveViewDialog canShare={['owner', 'admin', 'manager'].includes(org.role)} onSave={saveView} onClose={() => setSaving(false)} /> : null}
    </div>
  );

  function cell(c: Column, r: any): ReactNode {
    return c.render(r);
  }
}

interface Column {
  key: string;
  label: string;
  render: (r: any) => ReactNode;
}

/** How each field shows in a list cell. */
function useColumns(entity: CrmEntity): Column[] {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const pipelines = usePipelines().data ?? [];
  const cfs = (useCustomFields().data ?? []).filter((f) => f.entity === entity && !f.archived);
  return useMemo(() => {
    const out: Column[] = FIELDS[entity]
      .filter((f) => !f.formOnly)
      .map((f: FieldDef) => ({
        key: f.key,
        label: f.label,
        render: (r: any) => {
          const v = r[f.key];
          switch (f.type) {
            case 'enum':
              return <Chip list={optionsOf(f.list, org.settings)} value={v} />;
            case 'user':
              return <PersonChip id={v} small />;
            case 'money':
              return v === null || v === undefined ? '' : <span className="crm-num-cell">{fmt(v)}</span>;
            case 'date':
              return <span className={entity === 'activity' && r.overdue && f.key === 'dueDate' ? 'danger-text' : undefined}>{shortDate(v)}</span>;
            case 'datetime':
              return v ? <span title={dateTime(v)}>{shortDate(new Date(v).toISOString())}</span> : '';
            case 'company':
              return r.company?.name ?? '';
            case 'contact':
              return r.contact?.name ?? '';
            case 'deal':
              return r.deal?.name ?? '';
            case 'lead':
              return r.lead?.name ?? '';
            case 'pipeline':
              return pipelines.find((p) => p.id === v)?.name ?? '';
            case 'stage':
              return r.stageName ?? '';
            case 'percent':
              return v === null || v === undefined ? (entity === 'deal' ? `${r.effectiveProbability}%` : '') : `${v}%`;
            case 'bool':
              return v ? 'Yes' : '';
            case 'int':
              return f.key === 'score' ? <span className="crm-score" data-level={v >= 70 ? 'high' : v >= 40 ? 'mid' : 'low'}>{v}</span> : v;
            default:
              if (f.key === 'name' || f.key === 'title') return (
                <span className="row crm-name-cell">
                  <span className="ellipsis">{v || '(no name)'}</span>
                  {entity === 'deal' && r.flagged ? <Icon name="flag" size={13} title={r.flagReason || 'Flagged'} /> : null}
                  {r.tags?.length ? <TagChips tags={r.tags.slice(0, 2)} /> : null}
                </span>
              );
              return v ?? '';
          }
        },
      }));
    for (const cf of cfs) {
      out.push({
        key: `cf:${cf.id}`,
        label: cf.label,
        render: (r: any) => {
          const v = r.custom?.[cf.id];
          if (v === null || v === undefined) return '';
          if (cf.type === 'money') return fmt(Number(v));
          if (cf.type === 'checkbox') return v ? 'Yes' : 'No';
          if (cf.type === 'date') return shortDate(String(v));
          if (Array.isArray(v)) return v.join(', ');
          return String(v);
        },
      });
    }
    return out;
  }, [entity, org.settings, fmt, pipelines, cfs]);
}

function ColumnsMenu({ all, shown, onChange }: { all: Column[]; shown: string[]; onChange: (c: string[]) => void }) {
  return (
    <Dropdown
      width={260}
      label="Columns"
      trigger={(open, ref) => (
        <button ref={ref} className="btn" onClick={open}>
          <Icon name="table" /> Columns
        </button>
      )}
    >
      {() => (
        <div className="crm-option-list">
          {all.map((c) => (
            <label key={c.key} className="checkbox crm-option">
              <input type="checkbox" checked={shown.includes(c.key)} onChange={(e) => onChange(e.target.checked ? [...shown, c.key] : shown.filter((k) => k !== c.key))} disabled={shown.length === 1 && shown.includes(c.key)} /> {c.label}
            </label>
          ))}
        </div>
      )}
    </Dropdown>
  );
}

function FiltersPanel({ entity, filters, match, onChange }: { entity: CrmEntity; filters: FilterCond[]; match: 'all' | 'any'; onChange: (f: FilterCond[], m: 'all' | 'any') => void }) {
  const org = useCurrentOrg();
  const fields = useFilterFields(entity, org.settings);
  return (
    <div className="card card-pad crm-filter-panel">
      <FilterBuilder fields={fields} filters={filters} match={match} onChange={onChange} currency={org.currency} />
    </div>
  );
}

function BulkBar({ entity, count, deleted, archived, onAction, onClear }: { entity: CrmEntity; count: number; deleted: boolean; archived: boolean; onAction: (a: string, v?: string | null) => void; onClear: () => void }) {
  const org = useCurrentOrg();
  const tags = useTags().data ?? [];
  const [assign, setAssign] = useState(false);
  const statusList = entity === 'deal' ? [] : optionsOf(FIELDS[entity].find((f) => f.key === 'status')?.list, org.settings);
  return (
    <div className="bulk-bar" role="toolbar" aria-label="Actions for the selected records">
      <strong>{count} selected</strong>
      {deleted ? (
        <button className="btn sm" onClick={() => onAction('restore')}>
          <Icon name="restore" size={14} /> Restore
        </button>
      ) : (
        <>
          <button className="btn sm" onClick={() => setAssign(true)}>
            <Icon name="user" size={14} /> Assign
          </button>
          {entity === 'activity' ? (
            <button className="btn sm" onClick={() => onAction('complete')}>
              <Icon name="check" size={14} /> Complete
            </button>
          ) : null}
          {statusList.length ? (
            <Dropdown label="Status" trigger={(open, ref) => <button ref={ref} className="btn sm" onClick={open}>Status</button>}>
              {(close) => <>{statusList.filter((s) => s.key !== 'converted').map((s) => <MenuItem key={s.key} onClick={() => { close(); onAction('status', s.key); }}>{s.label}</MenuItem>)}</>}
            </Dropdown>
          ) : null}
          <Dropdown label="Priority" trigger={(open, ref) => <button ref={ref} className="btn sm" onClick={open}>Priority</button>}>
            {(close) => <>{optionsOf('priorities', org.settings).map((s) => <MenuItem key={s.key} onClick={() => { close(); onAction('priority', s.key); }}>{s.label}</MenuItem>)}</>}
          </Dropdown>
          {entity !== 'activity' && tags.length ? (
            <Dropdown label="Tags" trigger={(open, ref) => <button ref={ref} className="btn sm" onClick={open}>Tag</button>}>
              {(close) => (
                <>
                  {tags.map((t) => <MenuItem key={t.id} onClick={() => { close(); onAction('tag', t.id); }}>Add “{t.name}”</MenuItem>)}
                  <MenuSep />
                  {tags.map((t) => <MenuItem key={`x${t.id}`} onClick={() => { close(); onAction('untag', t.id); }}>Remove “{t.name}”</MenuItem>)}
                </>
              )}
            </Dropdown>
          ) : null}
          {entity !== 'activity' ? (
            <button className="btn sm" onClick={() => onAction(archived ? 'unarchive' : 'archive')}>
              <Icon name="archive" size={14} /> {archived ? 'Unarchive' : 'Archive'}
            </button>
          ) : null}
          <button className="btn sm danger" onClick={() => onAction('delete')}>
            <Icon name="trash" size={14} /> Delete
          </button>
        </>
      )}
      <button className="btn ghost sm" onClick={onClear}>
        Clear
      </button>
      {assign ? (
        <Modal title={`Assign ${count} records`} onClose={() => setAssign(false)}>
          <AssignForm onAssign={(id) => { setAssign(false); onAction('assign', id); }} />
        </Modal>
      ) : null}
    </div>
  );
}

function AssignForm({ onAssign }: { onAssign: (id: string | null) => void }) {
  const [id, setId] = useState<string | null>(null);
  return (
    <div className="stack">
      <UserSelect value={id} onChange={setId} ariaLabel="Assign to" />
      <button className="btn primary" onClick={() => onAssign(id)}>
        Assign
      </button>
    </div>
  );
}

function SaveViewDialog({ canShare, onSave, onClose }: { canShare: boolean; onSave: (name: string, shared: boolean) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [shared, setShared] = useState(false);
  return (
    <Modal
      title="Save view"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!name.trim()} onClick={() => { onSave(name.trim(), shared); onClose(); }}>Save</button>
        </>
      }
    >
      <div className="stack">
        <div className="field">
          <label htmlFor="view-name">Name</label>
          <input id="view-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="For example: Key accounts in Queensland" />
        </div>
        <p className="muted small">The view keeps the current search, filters, sort and columns.</p>
        {canShare ? (
          <label className="checkbox">
            <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} /> Share with everyone in the organisation
          </label>
        ) : null}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ import

const IMPORT_FIELDS: Record<'lead' | 'contact' | 'company', string[]> = {
  contact: ['firstName', 'lastName', 'email', 'phone', 'mobile', 'jobTitle', 'companyId', 'website', 'address', 'city', 'region', 'postcode', 'country', 'source', 'status', 'priority', 'ownerId', 'nextFollowUp', 'description'],
  company: ['name', 'website', 'industry', 'size', 'annualRevenue', 'phone', 'email', 'address', 'city', 'region', 'postcode', 'country', 'status', 'ownerId', 'description'],
  lead: ['firstName', 'lastName', 'companyName', 'jobTitle', 'email', 'phone', 'website', 'country', 'industry', 'source', 'status', 'estimatedValue', 'priority', 'ownerId', 'followUpDate', 'description'],
};

function guess(header: string, options: { key: string; label: string }[]): string {
  const h = header.toLowerCase().replace(/[^a-z]/g, '');
  const alias: Record<string, string> = { firstname: 'firstName', givenname: 'firstName', lastname: 'lastName', surname: 'lastName', familyname: 'lastName', emailaddress: 'email', mail: 'email', company: 'companyId', organisation: 'companyId', organization: 'companyId', title: 'jobTitle', position: 'jobTitle', mobilephone: 'mobile', cell: 'mobile', owner: 'ownerId', state: 'region', zip: 'postcode', zipcode: 'postcode', tag: 'tags', revenue: 'annualRevenue', value: 'estimatedValue' };
  const byLabel = options.find((o) => o.label.toLowerCase().replace(/[^a-z]/g, '') === h);
  return byLabel?.key ?? (alias[h] && options.some((o) => o.key === alias[h]) ? alias[h] : '');
}

function ImportDialog({ entity, onClose }: { entity: 'lead' | 'contact' | 'company'; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const cfs = (useCustomFields().data ?? []).filter((f) => f.entity === entity && !f.archived);
  const options = [
    ...IMPORT_FIELDS[entity].map((k) => {
      const f = FIELDS[entity].find((x) => x.key === k)!;
      return { key: k, label: entity === 'lead' && k === 'companyName' ? 'Company' : f.key === 'companyId' ? 'Company' : f.label };
    }),
    { key: 'tags', label: 'Tags' },
    ...cfs.map((f) => ({ key: `cf:${f.id}`, label: f.label })),
  ];
  const [rows, setRows] = useState<string[][] | null>(null);
  const [mapping, setMapping] = useState<string[]>([]);
  const [dups, setDups] = useState<'skip' | 'update' | 'create'>('skip');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ created: number; updated: number; skipped: number; errors: { row: number; message: string }[] } | null>(null);
  const onFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast('Choose a file of up to 5 MB', 'error');
    const parsed = parseCsv(await file.text());
    if (parsed.length < 2) return toast('The file has no rows under its header', 'error');
    setRows(parsed);
    setMapping(parsed[0].map((h) => guess(h, options)));
  };
  const run = async () => {
    if (!rows) return;
    setBusy(true);
    const body = rows.slice(1).map((r) => Object.fromEntries(mapping.map((k, i) => [k, r[i] ?? '']).filter(([k]) => k)));
    const total = { created: 0, updated: 0, skipped: 0, errors: [] as { row: number; message: string }[] };
    try {
      for (let i = 0; i < body.length; i += 500) {
        const r = await post<typeof total>(crm(org.id, `/${ENTITY_PATH[entity]}/import`), { rows: body.slice(i, i + 500), duplicates: dups });
        total.created += r.created;
        total.updated += r.updated;
        total.skipped += r.skipped;
        total.errors.push(...r.errors.map((e) => ({ row: e.row + i + 1, message: e.message })));
      }
      setResult(total);
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`Import ${ENTITY_LABELS[entity].many.toLowerCase()} from CSV`} onClose={onClose}>
      {result ? (
        <div className="stack">
          <div className="info-box" role="status">
            {result.created} created, {result.updated} updated, {result.skipped} skipped as duplicates{result.errors.length ? `, ${result.errors.length} with errors` : ''}.
          </div>
          {result.errors.length ? (
            <ul className="small crm-errors">
              {result.errors.slice(0, 30).map((e) => (
                <li key={e.row}>Row {e.row}: {e.message}</li>
              ))}
            </ul>
          ) : null}
          <button className="btn primary" onClick={onClose}>Done</button>
        </div>
      ) : !rows ? (
        <div className="stack">
          <p>Choose a CSV file with a header row (UTF-8; commas or semicolons). You match its columns to CRM fields next. Owners are matched by email or name; companies by name (new ones are created); choices by label.</p>
          <input type="file" accept=".csv,text/csv" aria-label="CSV file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="stack">
          <p className="muted small">{rows.length - 1} rows found. Match each column, or leave it out.</p>
          <div className="crm-table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Column in the file</th><th>First row</th><th>CRM field</th></tr>
              </thead>
              <tbody>
                {rows[0].map((h, i) => (
                  <tr key={i}>
                    <td>{h}</td>
                    <td className="muted ellipsis">{rows[1]?.[i]}</td>
                    <td>
                      <select className="select sm" aria-label={`Field for ${h}`} value={mapping[i] ?? ''} onChange={(e) => setMapping(mapping.map((m, j) => (j === i ? e.target.value : m)))}>
                        <option value="">Leave out</option>
                        {options.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="field">
            <label htmlFor="import-dups">When a record already exists ({entity === 'company' ? 'same name' : 'same email address'})</label>
            <select id="import-dups" className="select" value={dups} onChange={(e) => setDups(e.target.value as typeof dups)}>
              <option value="skip">Skip the row</option>
              <option value="update">Update the existing record</option>
              <option value="create">Create another record</option>
            </select>
          </div>
          <div className="row">
            <span className="grow" />
            <button className="btn" onClick={() => setRows(null)}>Choose another file</button>
            <button className="btn primary" disabled={busy || !mapping.some(Boolean)} onClick={run}>{busy ? 'Importing…' : `Import ${rows.length - 1} rows`}</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export { patch, labelOf };
