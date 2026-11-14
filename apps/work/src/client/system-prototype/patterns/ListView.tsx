// The list view pattern: search, an advanced filter builder, sorting, a column chooser, saved views, bulk selection
// and bulk actions, CSV export, row actions and pagination. On a phone the table becomes cards.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal, Popover, useToast } from '../../components/ui/overlays';
import { downloadCsv, exportMessage, fmtDate, money, PHONE, readStore, useMedia, writeStore } from '../format';
import { PIcon } from '../icons';
import { Empty, MenuButton, MenuEntry, SkeletonRows, StatusBadge } from '../kit';
import { RecLink } from '../links';
import { cellText, sortValue, useRows } from '../registry';
import { useErp } from '../state';
import type { Column, Condition, EntityDef, Op, Row, SavedView } from '../types';

const OPS: Record<'text' | 'number' | 'date', { op: Op; label: string }[]> = {
  text: [
    { op: 'contains', label: 'contains' },
    { op: 'is', label: 'is' },
    { op: 'isNot', label: 'is not' },
    { op: 'startsWith', label: 'starts with' },
  ],
  number: [
    { op: 'eq', label: 'equals' },
    { op: 'gt', label: 'is greater than' },
    { op: 'lt', label: 'is less than' },
  ],
  date: [
    { op: 'before', label: 'is before' },
    { op: 'after', label: 'is after' },
    { op: 'on', label: 'is on' },
  ],
};
const kindGroup = (c?: Column): 'text' | 'number' | 'date' => (c?.kind === 'money' || c?.kind === 'number' || c?.kind === 'percent' ? 'number' : c?.kind === 'date' ? 'date' : 'text');

function matches(r: Row, cond: Condition): boolean {
  const raw = r[cond.field];
  const s = String(raw ?? '').toLowerCase();
  const v = cond.value.toLowerCase();
  if (cond.value === '' && !['is', 'isNot'].includes(cond.op)) return true;
  switch (cond.op) {
    case 'contains':
      return s.includes(v);
    case 'is':
      return s === v;
    case 'isNot':
      return s !== v;
    case 'startsWith':
      return s.startsWith(v);
    case 'eq':
      return Number(raw) === Number(cond.value);
    case 'gt':
      return Number(raw) > Number(cond.value);
    case 'lt':
      return Number(raw) < Number(cond.value);
    case 'before':
      return String(raw ?? '') < cond.value;
    case 'after':
      return String(raw ?? '') > cond.value;
    case 'on':
      return String(raw ?? '').slice(0, 10) === cond.value;
  }
}

export function Cell({ col, r, first, href }: { col: Column; r: Row; first?: boolean; href: string }) {
  if (col.render) return <>{col.render(r)}</>;
  const v = r[col.key];
  if (first)
    return (
      <Link to={href} className="erp-rowlink">
        {String(v ?? r.id)}
      </Link>
    );
  if (v === undefined || v === null || v === '') return <span className="muted">–</span>;
  switch (col.kind) {
    case 'status':
      return <StatusBadge status={String(v)} />;
    case 'money':
      return <>{money(Number(v))}</>;
    case 'date':
      return <>{fmtDate(String(v))}</>;
    case 'percent':
      return <>{v}%</>;
    case 'id':
      return <RecLink id={String(v)} />;
    default:
      return <>{String(v)}</>;
  }
}
const isNum = (c: Column) => c.kind === 'money' || c.kind === 'number' || c.kind === 'percent';

export function ListView({ def, basePath, label }: { def: EntityDef; basePath: string; label: string }) {
  const { site, patchRecord, toggleFavourite } = useErp();
  const toast = useToast();
  const navigate = useNavigate();
  const phone = useMedia(PHONE);
  const [params, setParams] = useSearchParams();
  const allRows = useRows(def.key);
  const defaultCols = def.columns.filter((c) => c.visible !== false).map((c) => c.key);
  const [custom, setCustom] = useState<SavedView[]>(() => readStore(`views:${def.key}`, []));
  const views: SavedView[] = [{ id: 'all', label: `All ${def.plural.toLowerCase()}`, conditions: [], builtIn: true }, ...(def.views ?? []), ...custom];
  const viewId = params.get('view') ?? 'all';
  const view = views.find((v) => v.id === viewId) ?? views[0];
  const [search, setSearch] = useState(view.search ?? '');
  const [conditions, setConditions] = useState<Condition[]>(view.conditions);
  const [sort, setSort] = useState<SavedView['sort']>(view.sort);
  const [cols, setCols] = useState<string[]>(view.columns ?? defaultCols);
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pageIx, setPageIx] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saveOpen, setSaveOpen] = useState(false);
  const [colsOpen, setColsOpen] = useState(false);
  const colsRef = useRef<HTMLButtonElement>(null);
  const [viewName, setViewName] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, []);
  // A different saved view replaces the search, filters, sort and columns.
  useEffect(() => {
    setSearch(view.search ?? '');
    setConditions(view.conditions);
    setSort(view.sort);
    setCols(view.columns ?? defaultCols);
    setPageIx(0);
    setSelected(new Set());
  }, [viewId, def.key]);

  const visibleCols = def.columns.filter((c) => c.key === def.columns[0].key || cols.includes(c.key));
  const filtered = useMemo(() => {
    let rows = allRows.filter((r) => site === 'All sites' || !r.site || r.site === site);
    rows = rows.filter((r) => conditions.every((c) => matches(r, c)));
    const q = search.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.id.toLowerCase().includes(q) || def.columns.some((c) => cellText(c, r).toLowerCase().includes(q)));
    if (sort) {
      const col = def.columns.find((c) => c.key === sort.key);
      if (col)
        rows = [...rows].sort((a, b) => {
          const x = sortValue(col, a);
          const y = sortValue(col, b);
          return (x < y ? -1 : x > y ? 1 : 0) * (sort.dir === 'asc' ? 1 : -1);
        });
    }
    return rows;
  }, [allRows, site, conditions, search, sort, def]);
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const ix = Math.min(pageIx, pages - 1);
  const pageRows = filtered.slice(ix * size, ix * size + size);
  const allOnPage = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const someOnPage = pageRows.some((r) => selected.has(r.id));
  const modified = JSON.stringify(conditions) !== JSON.stringify(view.conditions) || search !== (view.search ?? '') || JSON.stringify(sort) !== JSON.stringify(view.sort);
  const href = (r: Row) => `/${basePath}/${r.id}`;

  const setView = (id: string) => {
    const p = new URLSearchParams(params);
    if (id === 'all') p.delete('view');
    else p.set('view', id);
    setParams(p, { replace: true });
  };
  const exportRows = (rows: Row[], name: string) => {
    void downloadCsv(`${name}.csv`, visibleCols.map((c) => c.label), rows.map((r) => visibleCols.map((c) => (c.key === 'id' ? r.id : cellText(c, r))))).then((o) => toast(exportMessage(o, `${rows.length} ${rows.length === 1 ? 'row' : 'rows'}`, `${name}.csv`)));
  };
  const toggleSort = (key: string) => setSort((s) => (!s || s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : undefined));
  const toggleRow = (id: string) => setSelected((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });

  const filterCount = conditions.length;
  return (
    <div className="erp-list" aria-busy={loading}>
      <div className="erp-views" role="group" aria-label="Saved views">
        {views.map((v) => (
          <span key={v.id} className="erp-view-chip">
            <button type="button" className={`erp-view${v.id === view.id ? ' active' : ''}`} aria-pressed={v.id === view.id} onClick={() => setView(v.id)} data-hl={`view-${v.id}`}>
              {v.label}
              {v.id === view.id && modified ? <span className="erp-modified"> (changed)</span> : null}
            </button>
            {!v.builtIn ? (
              <button
                type="button"
                className="btn ghost icon sm"
                aria-label={`Delete view ${v.label}`}
                onClick={() => {
                  const next = custom.filter((x) => x.id !== v.id);
                  setCustom(next);
                  writeStore(`views:${def.key}`, next);
                  if (v.id === view.id) setView('all');
                }}
              >
                <PIcon name="x" size={12} />
              </button>
            ) : null}
          </span>
        ))}
        <button type="button" className="btn ghost sm" onClick={() => { setViewName(''); setSaveOpen(true); }}>
          <PIcon name="plus" size={14} /> Save view
        </button>
      </div>

      <div className="erp-toolbar" role="toolbar" aria-label={`${label} tools`}>
        <div className="erp-search">
          <PIcon name="search" />
          <label htmlFor={`search-${def.key}`} className="sr-only">
            Search {label.toLowerCase()}
          </label>
          <input
            id={`search-${def.key}`}
            className="input"
            type="search"
            placeholder={`Search ${label.toLowerCase()}`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIx(0);
            }}
          />
        </div>
        <button type="button" className={`btn${showFilters || filterCount ? ' active' : ''}`} aria-expanded={showFilters} aria-controls={`filters-${def.key}`} onClick={() => setShowFilters((s) => !s)}>
          <PIcon name="filter" /> Filter{filterCount ? ` (${filterCount})` : ''}
        </button>
        {!phone ? (
          <button type="button" ref={colsRef} className="btn" aria-expanded={colsOpen} onClick={() => setColsOpen((o) => !o)}>
            <PIcon name="table" /> Columns
          </button>
        ) : null}
        <span className="spacer" />
        <span className="muted small" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
        </span>
        <button type="button" className="btn" onClick={() => exportRows(filtered, def.plural.toLowerCase().replace(/\s+/g, '-'))}>
          <PIcon name="download" /> Export CSV
        </button>
      </div>
      {colsOpen ? (
        <Popover anchor={colsRef} onClose={() => setColsOpen(false)} role="dialog" label="Choose columns" width={240}>
          <fieldset className="erp-colchooser">
            <legend className="menu-label">Columns</legend>
            {def.columns.map((c, i) => (
              <label key={c.key} className="checkbox erp-colopt">
                <input
                  type="checkbox"
                  checked={i === 0 || cols.includes(c.key)}
                  disabled={i === 0}
                  onChange={(e) => setCols((list) => (e.target.checked ? [...list, c.key] : list.filter((k) => k !== c.key)))}
                />
                {c.label}
              </label>
            ))}
            <button type="button" className="btn sm" onClick={() => setCols(defaultCols)}>
              Reset columns
            </button>
          </fieldset>
        </Popover>
      ) : null}

      {showFilters ? (
        <div className="card erp-filters" id={`filters-${def.key}`} role="group" aria-label="Filter conditions">
          {conditions.length === 0 ? <p className="muted small">No conditions. Add one to narrow the list.</p> : null}
          {conditions.map((cond, i) => {
            const col = def.columns.find((c) => c.key === cond.field);
            const group = kindGroup(col);
            const options = col?.kind === 'status' || col?.key === 'site' ? Array.from(new Set(allRows.map((r) => String(r[cond.field] ?? '')))).filter(Boolean).sort() : null;
            const update = (patch: Partial<Condition>) => setConditions((list) => list.map((c, j) => (j === i ? { ...c, ...patch } : c)));
            return (
              <div key={i} className="erp-cond">
                <span className="erp-cond-and muted small">{i === 0 ? 'Where' : 'and'}</span>
                <label className="sr-only" htmlFor={`cf-${i}`}>
                  Field of condition {i + 1}
                </label>
                <select
                  id={`cf-${i}`}
                  className="select sm"
                  value={cond.field}
                  onChange={(e) => {
                    const nc = def.columns.find((c) => c.key === e.target.value);
                    update({ field: e.target.value, op: OPS[kindGroup(nc)][0].op, value: '' });
                  }}
                >
                  {def.columns.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={`co-${i}`}>
                  Operator of condition {i + 1}
                </label>
                <select id={`co-${i}`} className="select sm" value={cond.op} onChange={(e) => update({ op: e.target.value as Op })}>
                  {OPS[group].map((o) => (
                    <option key={o.op} value={o.op}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={`cv-${i}`}>
                  Value of condition {i + 1}
                </label>
                {options && (cond.op === 'is' || cond.op === 'isNot') ? (
                  <select id={`cv-${i}`} className="select sm" value={cond.value} onChange={(e) => update({ value: e.target.value })}>
                    <option value="">Choose…</option>
                    {options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input id={`cv-${i}`} className="input sm" type={group === 'date' ? 'date' : group === 'number' ? 'number' : 'text'} value={cond.value} onChange={(e) => update({ value: e.target.value })} />
                )}
                <button type="button" className="btn ghost icon sm" aria-label={`Remove condition ${i + 1}`} onClick={() => setConditions((list) => list.filter((_, j) => j !== i))}>
                  <PIcon name="x" size={14} />
                </button>
              </div>
            );
          })}
          <div className="row wrap">
            <button type="button" className="btn sm" onClick={() => setConditions((list) => [...list, { field: def.columns[1]?.key ?? 'id', op: OPS[kindGroup(def.columns[1])][0].op, value: '' }])}>
              <PIcon name="plus" size={14} /> Add condition
            </button>
            {conditions.length ? (
              <button type="button" className="btn ghost sm" onClick={() => setConditions([])}>
                Clear all
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {selected.size ? (
        <div className="erp-bulkbar" role="region" aria-label="Bulk actions">
          <strong>{selected.size} selected</strong>
          {(def.bulk ?? []).map((b) => (
            <button
              key={b.label}
              type="button"
              className="btn sm"
              onClick={() => {
                const ids = Array.from(selected);
                if (b.patch) ids.forEach((id) => patchRecord(def.key, id, b.patch!));
                toast(`${b.toast} (${ids.length})`);
                setSelected(new Set());
              }}
            >
              {b.label}
            </button>
          ))}
          <button type="button" className="btn sm" onClick={() => exportRows(filtered.filter((r) => selected.has(r.id)), `${def.plural.toLowerCase().replace(/\s+/g, '-')}-selected`)}>
            <PIcon name="download" size={14} /> Export selected
          </button>
          <button type="button" className="btn ghost sm" onClick={() => setSelected(new Set())}>
            Clear selection
          </button>
        </div>
      ) : null}

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <Empty
          icon="filter"
          title={`No ${def.plural.toLowerCase()} match`}
          action={
            <button
              type="button"
              className="btn"
              onClick={() => {
                setConditions([]);
                setSearch('');
              }}
            >
              Clear search and filters
            </button>
          }
        >
          Change the search or the filters to see more.
        </Empty>
      ) : phone ? (
        <ul className="erp-cards" aria-label={label}>
          {pageRows.map((r) => {
            const status = def.columns.find((c) => c.kind === 'status');
            return (
              <li key={r.id} className="erp-card" data-hl={r.id}>
                <Link to={href(r)} className="erp-card-link">
                  <span className="erp-card-top">
                    <span className="erp-id">{def.columns[0].key === 'id' ? r.id : r[def.columns[0].key]}</span>
                    {status ? <StatusBadge status={r[status.key]} /> : null}
                  </span>
                  <span className="erp-card-title">{def.title(r)}</span>
                  {def.columns
                    .filter((c) => c.card && c.kind !== 'status')
                    .map((c) => (
                      <span key={c.key} className="erp-card-row">
                        <span className="muted small">{c.label}</span>
                        <span>{cellText(c, r) || '–'}</span>
                      </span>
                    ))}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="card erp-table-card">
          <div className="erp-table-scroll">
            <table className="data-table erp-table erp-list-table">
              <caption className="sr-only">
                {label}, {filtered.length} records, page {ix + 1} of {pages}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="erp-check-col">
                    <input
                      type="checkbox"
                      aria-label="Select all rows on this page"
                      checked={allOnPage}
                      ref={(el) => {
                        if (el) el.indeterminate = someOnPage && !allOnPage;
                      }}
                      onChange={() =>
                        setSelected((s) => {
                          const n = new Set(s);
                          pageRows.forEach((r) => (allOnPage ? n.delete(r.id) : n.add(r.id)));
                          return n;
                        })
                      }
                    />
                  </th>
                  {visibleCols.map((c) => (
                    <th key={c.key} scope="col" className={isNum(c) ? 'num' : undefined} aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                      <button type="button" className="erp-sort" onClick={() => toggleSort(c.key)}>
                        {c.label}
                        <PIcon name={sort?.key === c.key ? (sort.dir === 'asc' ? 'chevronUp' : 'chevronDown') : 'sort'} size={12} className={sort?.key === c.key ? 'erp-sort-on' : 'erp-sort-none'} />
                      </button>
                    </th>
                  ))}
                  <th scope="col" className="erp-actions-col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.id} className={selected.has(r.id) ? 'selected' : undefined} data-hl={r.id}>
                    <td className="erp-check-col">
                      <input type="checkbox" aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onChange={() => toggleRow(r.id)} />
                    </td>
                    {visibleCols.map((c, i) => (
                      <td key={c.key} className={isNum(c) ? 'num' : undefined}>
                        <Cell col={c} r={r} first={i === 0} href={href(r)} />
                      </td>
                    ))}
                    <td className="erp-actions-col">
                      <MenuButton label={`Actions for ${r.id}`} className="btn ghost icon sm" content={<PIcon name="moreV" />} align="end" width={210}>
                        {(close) => (
                          <>
                            <MenuEntry
                              icon="eye"
                              onClick={() => {
                                close();
                                navigate(href(r));
                              }}
                            >
                              Open
                            </MenuEntry>
                            <MenuEntry
                              icon="star"
                              onClick={() => {
                                close();
                                toggleFavourite({ path: href(r), label: r.id });
                              }}
                            >
                              Pin or unpin
                            </MenuEntry>
                            <MenuEntry
                              icon="copy"
                              onClick={() => {
                                close();
                                navigator.clipboard?.writeText(r.id).catch(() => undefined);
                                toast(`${r.id} copied.`);
                              }}
                            >
                              Copy number
                            </MenuEntry>
                            <MenuEntry
                              icon="download"
                              onClick={() => {
                                close();
                                exportRows([r], r.id);
                              }}
                            >
                              Export row
                            </MenuEntry>
                          </>
                        )}
                      </MenuButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && filtered.length > 0 ? (
        <nav className="erp-pager" aria-label="Pages">
          <span className="muted small">
            {ix * size + 1}–{Math.min(filtered.length, ix * size + size)} of {filtered.length}
          </span>
          <span className="spacer" />
          <label className="small muted" htmlFor={`size-${def.key}`}>
            Rows per page
          </label>
          <select
            id={`size-${def.key}`}
            className="select sm erp-size"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPageIx(0);
            }}
          >
            {[10, 25, 50].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <button type="button" className="btn sm" disabled={ix === 0} onClick={() => setPageIx(ix - 1)}>
            <PIcon name="chevronLeft" size={14} /> Previous
          </button>
          <span className="small">
            Page {ix + 1} of {pages}
          </span>
          <button type="button" className="btn sm" disabled={ix >= pages - 1} onClick={() => setPageIx(ix + 1)}>
            Next <PIcon name="chevronRight" size={14} />
          </button>
        </nav>
      ) : null}

      {saveOpen ? (
        <Modal
          title="Save this view"
          onClose={() => setSaveOpen(false)}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setSaveOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={!viewName.trim()}
                onClick={() => {
                  const v: SavedView = { id: `v${Date.now()}`, label: viewName.trim(), conditions, sort, columns: cols, search };
                  const next = [...custom, v];
                  setCustom(next);
                  writeStore(`views:${def.key}`, next);
                  setSaveOpen(false);
                  setView(v.id);
                  toast(`View "${v.label}" saved on this computer.`);
                }}
              >
                Save view
              </button>
            </>
          }
        >
          <div className="field">
            <label htmlFor="view-name">Name</label>
            <input id="view-name" className="input" value={viewName} onChange={(e) => setViewName(e.target.value)} placeholder="For example: Brisbane, this month" />
            <span className="hint">Keeps the search, filters, sort and columns. The prototype saves views on this computer.</span>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
