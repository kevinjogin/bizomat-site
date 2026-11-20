// A module of the ERP's modules framework at /erp/c/<company>/m/<module> (People and HR, payroll, timesheets, service,
// contracts, fleet, calibration, fixed assets, the industry solutions and the rest): its overview, a list for each kind of
// record with search, filters, saved filters, sorting, paging, CSV export and import; forms with line items; each
// record's page with its workflow steps, actions, related records, files, comments and history; the module's reports,
// and the dispatch board, price check and payslips where the module has them. Drawn from the same definitions the
// server enforces (src/shared/erp-objects); the server decides every permission.
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, api, del, errorMessage, get, patch, post } from '../../../lib/api';
import { appUrl } from '../../../lib/base';
import { usePageTitle } from '../../../lib/hooks';
import { timeAgo } from '../../../lib/format';
import { Icon } from '../../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../../components/ui/overlays';
import '../../../styles/maintenance.css';
import '../../../styles/erp.css';
import { Comments, FileList, FilterPanel, History, Props, Section } from '../../maintenance/common';
import { Pager } from '../common';
import { OBJECTS, type FieldDef } from '../../../../shared/erp-objects';
import { FieldInput, RefPicker } from './fields';
import { POSTING_KIND_OF_MODULE, PostingsTab, RecordPostings } from './Postings';
import { ConsolidationTab } from './Consolidation';
import { TONE_CLASS, favourites, modulePage, moneyText, noteRecent, recordPage, toggleFavourite, useModule, valueText, xHref, xPath, type Detail, type ObjectFull, type Rec, type ReportTable } from './api';

export function StatusBadge({ statuses, value }: { statuses: { key: string; label: string; tone: string }[]; value: string }) {
  const s = statuses.find((x) => x.key === value);
  return <span className={`badge ${TONE_CLASS[s?.tone ?? 'neutral'] ?? ''}`}>{s?.label ?? value}</span>;
}

export function ModuleArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const { module = '' } = useParams();
  const q = useModule(companyId, module);
  const [favs, setFavs] = useState(favourites());
  const favKey = `m/${module}`;
  useEffect(() => {
    if (q.data) noteRecent(favKey);
  }, [q.data, favKey]);
  if (q.error) {
    if (q.error instanceof ApiError && (q.error.status === 403 || q.error.status === 404)) {
      return (
        <div className="page crm-page">
          <PageHeader title="Module" />
          <section className="co-prompt">
            <p>{q.error.message}</p>
            <p className="muted small">People in {companyName} reach a module through their ERP roles; an ERP administrator gives roles on the ERP roles page.</p>
            <div className="row"><Link className="btn" to={`/c/${encodeURIComponent(companyId)}/modules`}>All modules</Link></div>
          </section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  }
  if (!q.data) return <Loading label="Opening the module…" />;
  const m = q.data;
  const base = modulePage(companyId, module);
  const isFav = favs.includes(favKey);
  return (
    <div className="page crm-page">
      <nav className="erp-crumbs small" aria-label="Breadcrumb">
        <Link to={`/c/${encodeURIComponent(companyId)}/modules`}>All modules</Link> <span aria-hidden="true">›</span> <span>{m.module.label}</span>
      </nav>
      <PageHeader
        title={m.module.label}
        subtitle={m.module.summary}
        actions={
          <button type="button" className={`btn ghost${isFav ? ' active' : ''}`} aria-pressed={isFav} title={isFav ? 'Remove from favourites' : 'Add to favourites (this computer)'} onClick={() => setFavs(toggleFavourite(favKey))}>
            <Icon name="star" /> {isFav ? 'Favourite' : 'Add to favourites'}
          </button>
        }
      />
      <nav className="tabs mt-tabs" aria-label={`${m.module.label} sections`}>
        <NavLink to={base} end className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="home" size={14} /> Overview</NavLink>
        {m.objects.map((o) => (
          <NavLink key={o.key} to={`${base}/${o.key}`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{o.plural}</NavLink>
        ))}
        {module === 'service' ? <NavLink to={`${base}/dispatch`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="calendar" size={14} /> Dispatch board</NavLink> : null}
        {module === 'pricing' ? <NavLink to={`${base}/price`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="search" size={14} /> Price check</NavLink> : null}
        {module === 'hr' || module === 'payroll' ? <NavLink to={`${base}/payslips`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="dollar" size={14} /> My payslips</NavLink> : null}
        {module === 'consolidation' ? <NavLink to={`${base}/consolidated`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="layers" size={14} /> Consolidated report</NavLink> : null}
        {POSTING_KIND_OF_MODULE[module] ? <NavLink to={`${base}/postings`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="dollar" size={14} /> Finance postings</NavLink> : null}
        <NavLink to={`${base}/reports`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name="chart" size={14} /> Reports</NavLink>
      </nav>
      <Routes>
        <Route index element={<Overview companyId={companyId} module={module} data={m} />} />
        <Route path="reports" element={<Reports companyId={companyId} module={module} data={m} />} />
        <Route path="reports/:object/:report" element={<ReportView companyId={companyId} module={module} />} />
        <Route path="dispatch" element={<DispatchBoard companyId={companyId} />} />
        <Route path="price" element={<PriceCheck companyId={companyId} />} />
        <Route path="payslips" element={<Payslips companyId={companyId} />} />
        {module === 'consolidation' ? <Route path="consolidated" element={<ConsolidationTab companyId={companyId} />} /> : null}
        {POSTING_KIND_OF_MODULE[module] ? <Route path="postings" element={<PostingsTab companyId={companyId} kind={POSTING_KIND_OF_MODULE[module]} />} /> : null}
        <Route path=":object" element={<ObjectList companyId={companyId} module={module} />} />
        <Route path=":object/new" element={<RecordEditor companyId={companyId} module={module} />} />
        <Route path=":object/:id/edit" element={<RecordEditor companyId={companyId} module={module} />} />
        <Route path=":object/:id" element={<RecordDetail companyId={companyId} module={module} />} />
        <Route path="*" element={<Navigate to={base} replace />} />
      </Routes>
    </div>
  );
}

// ------------------------------------------------------------------ overview

function Overview({ companyId, module, data }: { companyId: string; module: string; data: NonNullable<ReturnType<typeof useModule>['data']> }) {
  usePageTitle(data.module.label);
  const base = modulePage(companyId, module);
  return (
    <div className="stack">
      <div className="crm-stats">
        {data.objects.map((o) => {
          const total = Object.values(o.counts).reduce((s, n) => s + n, 0);
          return (
            <Link key={o.key} to={`${base}/${o.key}`} className="card crm-stat">
              <span className="crm-stat-label">{o.plural}</span>
              <span className="crm-stat-value">{total.toLocaleString()}</span>
              <span className="muted small">
                {o.statuses.filter((s) => o.counts[s.key]).slice(0, 3).map((s) => `${o.counts[s.key]} ${s.label.toLowerCase()}`).join(', ') || (o.can.view ? 'None yet' : 'Yours only')}
              </span>
              {o.dueSoon ? <span className="small warning-text">{o.dueSoon} due within 14 days</span> : null}
              {o.mine ? <span className="small">{o.mine} yours or given to you</span> : null}
            </Link>
          );
        })}
      </div>
      <div className="crm-record-grid">
        <Section title="Recently changed">
          {data.recent.length ? (
            <ul className="erp-list">
              {data.recent.map((r) => {
                const o = data.objects.find((x) => x.key === r.object)!;
                return (
                  <li key={r.id}>
                    <Link to={`${base}/${r.object}/${r.id}`}><span className="mt-num">{r.number}</span> {r.title}</Link> <StatusBadge statuses={o.statuses} value={r.status} /> <span className="muted small">{timeAgo(r.updatedAt)}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted small">Nothing yet. {data.objects.find((o) => o.can.create) ? 'Add the first record from its tab above.' : ''}</p>
          )}
        </Section>
        <Section title="About this module">
          <ul className="erp-list small">
            {data.objects.map((o) => <li key={o.key}><strong>{o.plural}:</strong> {o.what}</li>)}
          </ul>
          {data.module.limits.length ? (
            <>
              <h3 className="erp-h3">What it does not do</h3>
              <ul className="erp-list small muted">{data.module.limits.map((l) => <li key={l}>{l}</li>)}</ul>
            </>
          ) : null}
          <p className="muted small">Catalogue {data.module.catalogue.map((n) => `module ${n}`).join(', ')}.</p>
        </Section>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ lists

function ObjectList({ companyId, module }: { companyId: string; module: string }) {
  const { object = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) =>
    setParams((p) => {
      const n = new URLSearchParams(p);
      if (v) n.set(k, v);
      else n.delete(k);
      if (k !== 'offset') n.delete('offset');
      return n;
    }, { replace: true });
  const offset = Number(g('offset')) || 0;
  const limit = 50;
  const filters = new URLSearchParams(params);
  filters.delete('offset');
  const list = useQuery({ queryKey: ['erp', companyId, 'x', 'o', object, filters.toString(), offset], queryFn: () => get<{ object: ObjectFull; records: Rec[]; total: number }>(xPath(companyId, `/o/${object}?${filters}&limit=${limit}&offset=${offset}`)), retry: false });
  const [importing, setImporting] = useState(false);
  const def = list.data?.object;
  usePageTitle(def?.plural ?? 'Records');
  if (list.error) return <ErrorBox error={list.error} retry={() => list.refetch()} />;
  if (!def || !list.data) return <Loading />;
  const data = list.data;
  const listFields = def.fields.filter((f) => f.list && !(data.records[0]?.hidden ?? []).includes(f.key)).slice(0, 5);
  const filterFields = def.fields.filter((f) => f.filter && ['select', 'bool', 'ref'].includes(f.type) && !f.sensitive).slice(0, 6);
  const active = [...params.keys()].filter((k) => k !== 'offset' && k !== 'sort' && k !== 'dir').length;
  const base = modulePage(companyId, module);
  return (
    <div className="stack">
      {def.notice ? <p className="info-box small">{def.notice}</p> : null}
      <div className="row wrap">
        <p className="muted small grow">{def.what}</p>
        <SavedFilters companyId={companyId} object={object} query={filters.toString()} onPick={(qs) => setParams(new URLSearchParams(qs), { replace: true })} />
        <a className="btn" href={xHref(companyId, `/o/${object}?${filters}&format=csv`)} download><Icon name="download" /> Export CSV</a>
        {def.can.import ? <button className="btn" onClick={() => setImporting(true)}><Icon name="upload" /> Import</button> : null}
        {def.can.create ? <Link className="btn primary" to={`${base}/${object}/new`}><Icon name="plus" /> New {def.label.toLowerCase()}</Link> : null}
      </div>
      <FilterPanel active={active}>
        <div className="field"><label htmlFor="x-q">Search</label><input id="x-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, name or words" /></div>
        <div className="field"><label htmlFor="x-st">Status</label><select id="x-st" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Any</option>{def.statuses.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</select></div>
        {filterFields.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={`x-f-${f.key}`}>{f.label}</label>
            {f.type === 'select' ? (
              <select id={`x-f-${f.key}`} className="select" value={g(`f.${f.key}`)} onChange={(e) => set(`f.${f.key}`, e.target.value)}><option value="">Any</option>{Object.entries(f.options ?? {}).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
            ) : f.type === 'bool' ? (
              <select id={`x-f-${f.key}`} className="select" value={g(`f.${f.key}`)} onChange={(e) => set(`f.${f.key}`, e.target.value)}><option value="">Any</option><option value="1">Yes</option><option value="0">No</option></select>
            ) : (
              <RefPicker companyId={companyId} kind={f.ref!} id={`x-f-${f.key}`} value={g(`f.${f.key}`) || null} onChange={(v) => set(`f.${f.key}`, v ?? '')} />
            )}
          </div>
        ))}
        <div className="field"><label htmlFor="x-show">Show</label>
          <select id="x-show" className="select" value={g('mine') ? 'mine' : g('assigned') ? 'assigned' : g('overdue') ? 'overdue' : g('archived') ? 'archived' : g('open') ? 'open' : ''} onChange={(e) => { const v = e.target.value; setParams((p) => { const n = new URLSearchParams(p); for (const k of ['mine', 'assigned', 'overdue', 'archived', 'open', 'offset']) n.delete(k); if (v) n.set(v, '1'); return n; }, { replace: true }); }}>
            <option value="">Everything I may see</option>
            <option value="open">Still open</option>
            <option value="mine">Mine</option>
            <option value="assigned">Given to me</option>
            <option value="overdue">Overdue</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="field"><label htmlFor="x-sort">Sort by</label>
          <select id="x-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}>
            <option value="">Recently changed</option><option value="number">Number</option><option value="title">Name</option><option value="status">Status</option><option value="date">Date</option><option value="due">Due</option><option value="amount">Amount</option><option value="created">Created</option>
          </select>
        </div>
      </FilterPanel>
      <div className="card crm-table-card">
        {!data.records.length ? (
          <EmptyState icon="grid" title={active ? `No ${def.plural.toLowerCase()} match` : `No ${def.plural.toLowerCase()} yet`} action={!active && def.can.create ? <Link className="btn primary" to={`${base}/${object}/new`}><Icon name="plus" /> New {def.label.toLowerCase()}</Link> : undefined}>
            {active ? 'Try other words or remove a filter.' : def.can.view ? def.what : 'You see the ones that are yours or given to you.'}
          </EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Name</th>{listFields.filter((f) => f.key !== titleKey(def)).map((f) => <th key={f.key} className={['money', 'number', 'integer', 'percent'].includes(f.type) ? 'num' : undefined}>{f.label}</th>)}<th>Status</th></tr></thead>
              <tbody>
                {data.records.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={`${base}/${object}/${r.id}`}>{r.number}</Link></td>
                    <td data-label="Name">{r.title}{r.archivedAt ? <span className="badge sys-gap">Archived</span> : null}</td>
                    {listFields.filter((f) => f.key !== titleKey(def)).map((f) => <td key={f.key} data-label={f.label} className={['money', 'number', 'integer', 'percent'].includes(f.type) ? 'num' : undefined}>{valueText(f, r.data[f.key], r.labels[f.key], r.currency)}</td>)}
                    <td data-label="Status"><StatusBadge statuses={def.statuses} value={r.status} />{r.dueDate && r.dueDate < new Date().toISOString().slice(0, 10) ? <span className="badge danger sys-gap">Overdue</span> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pager offset={offset} limit={limit} total={data.total} setOffset={(n) => set('offset', n ? String(n) : '')} />
      {importing ? <ImportDialog companyId={companyId} def={def} onClose={() => setImporting(false)} /> : null}
    </div>
  );
}

/** The field shown as the record's name (a list leaves it out of its own columns). */
const titleKey = (def: ObjectFull) => (def.title.includes('{') ? '' : def.title);

function SavedFilters({ companyId, object, query, onPick }: { companyId: string; object: string; query: string; onPick: (q: string) => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const views = useQuery({ queryKey: ['erp', companyId, 'x', 'views', object], queryFn: () => get<{ views: { id: string; name: string; query: string }[] }>(xPath(companyId, `/views?object=${object}`)) });
  const save = async () => {
    const name = window.prompt('Name this filter');
    if (!name?.trim()) return;
    try {
      await post(xPath(companyId, '/views'), { object, name: name.trim(), query });
      await qc.invalidateQueries({ queryKey: ['erp', companyId, 'x', 'views', object] });
      toast('Filter saved');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="row">
      {views.data?.views.length ? (
        <select className="select" aria-label="Saved filters" value="" onChange={(e) => { const v = views.data!.views.find((x) => x.id === e.target.value); if (v) onPick(v.query); }}>
          <option value="">Saved filters…</option>
          {views.data.views.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      ) : null}
      {query ? <button type="button" className="btn ghost" onClick={() => void save()}><Icon name="star" /> Save filter</button> : null}
    </div>
  );
}

function ImportDialog({ companyId, def, onClose }: { companyId: string; def: ObjectFull; onClose: () => void }) {
  const [csv, setCsv] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ row: number; message: string }[]>([]);
  const qc = useQueryClient();
  const toast = useToast();
  const columns = def.fields.filter((f) => !f.computed && !f.sensitive).map((f) => f.label);
  const run = async (dryRun: boolean) => {
    setBusy(true);
    setErrors([]);
    try {
      const r = await api<{ ok: boolean; checked: number; made: { id: string }[]; errors?: { row: number; message: string }[] }>(xPath(companyId, `/o/${def.key}/import`), { method: 'POST', body: { csv, dryRun }, allowStatuses: [400, 207] });
      if (!r.ok) {
        setErrors(r.errors ?? []);
        return;
      }
      if (dryRun) toast(`${r.checked} rows checked: every one is right`);
      else {
        toast(`${r.made.length} ${def.plural.toLowerCase()} imported`);
        await qc.invalidateQueries({ queryKey: ['erp', companyId, 'x'] });
        onClose();
      }
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`Import ${def.plural.toLowerCase()}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn" disabled={busy || !csv.trim()} onClick={() => void run(true)}>Check</button><button className="btn primary" disabled={busy || !csv.trim()} onClick={() => void run(false)}>{busy ? 'Working…' : 'Import'}</button></>}>
      <div className="stack">
        <p className="small">A CSV file with a header row, up to 500 records. Every row is checked before any is saved. Columns, by their names here: {columns.join(', ')}. References (people, customers, products and records) by their name or number; money in dollars.</p>
        <input type="file" accept=".csv,text/csv" aria-label="Choose a CSV file" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCsv(await f.text()); }} />
        <label className="sr-only" htmlFor="x-csv">CSV</label>
        <textarea id="x-csv" className="textarea" rows={8} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={columns.slice(0, 4).join(',')} />
        {errors.length ? <ul className="crm-errors small">{errors.map((x) => <li key={x.row}>Row {x.row}: {x.message}</li>)}</ul> : null}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ the form

function RecordEditor({ companyId, module }: { companyId: string; module: string }) {
  const { object = '', id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const meta = useQuery({ queryKey: ['erp', companyId, 'x', 'o', object, 'meta'], queryFn: () => get<{ object: ObjectFull }>(xPath(companyId, `/o/${object}?limit=1`)), enabled: !id });
  const existing = useQuery({ queryKey: ['erp', companyId, 'x', 'rec', object, id], queryFn: () => get<Detail>(xPath(companyId, `/o/${object}/${id}`)), enabled: !!id });
  const def = id ? existing.data?.object : meta.data?.object;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Record<string, unknown>[]>([]);
  const [lineLabels, setLineLabels] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  usePageTitle(def ? `${id ? 'Edit' : 'New'} ${def.label.toLowerCase()}` : 'Record');
  useEffect(() => {
    if (!def || data) return;
    if (id && existing.data) {
      setData({ ...existing.data.record.data });
      setLabels({ ...existing.data.record.labels });
      setLines(existing.data.lines ?? []);
      setLineLabels(existing.data.lineLabels ?? {});
    } else if (!id) {
      const d: Record<string, unknown> = {};
      for (const f of def.fields) if (f.default !== undefined && !f.computed) d[f.key] = f.default;
      setData(d);
    }
  }, [def, existing.data, id, data]);
  if (meta.error || existing.error) return <ErrorBox error={meta.error ?? existing.error} />;
  if (!def || !data) return <Loading />;
  const hidden = existing.data?.record.hidden ?? [];
  const fields = def.fields.filter((f) => !f.computed && !hidden.includes(f.key) && (!f.sensitive || (def.sensitiveEditable ?? []).includes(f.key)) && (!f.showIf || f.showIf.is.includes(String(data[f.showIf.field] ?? ''))));
  const sections: [string, FieldDef[]][] = [];
  for (const f of fields) {
    const s = f.section ?? 'Details';
    const at = sections.find(([n]) => n === s);
    if (at) at[1].push(f);
    else sections.push([s, [f]]);
  }
  const canLines = !!def.lines && (def.lines.editableIn ?? ['x']).length > 0 && (!id || existing.data?.can.editLines);
  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    try {
      const body: Record<string, unknown> = { data: Object.fromEntries(Object.entries(data).filter(([k]) => fields.some((f) => f.key === k))) };
      if (canLines) body.lines = lines.map((l) => Object.fromEntries(Object.entries(l).filter(([k]) => def.lines!.fields.some((f) => f.key === k && !f.computed))));
      if (id) body.version = existing.data!.record.version;
      const saved = id ? await patch<Detail>(xPath(companyId, `/o/${object}/${id}`), body) : await post<Detail>(xPath(companyId, `/o/${object}`), body);
      toast(id ? 'Saved' : `${def.label} ${saved.record.number} added`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId, 'x'] });
      navigate(recordPage(companyId, module, object, saved.record.id));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const base = modulePage(companyId, module);
  return (
    <form className="stack" onSubmit={save}>
      <nav className="erp-crumbs small" aria-label="Breadcrumb"><Link to={`${base}/${object}`}>{def.plural}</Link> <span aria-hidden="true">›</span> {id ? existing.data?.record.number : `New ${def.label.toLowerCase()}`}</nav>
      {def.notice ? <p className="info-box small">{def.notice}</p> : null}
      {sections.map(([name, fs]) => (
        <fieldset key={name} className="mt-form-section">
          <legend>{name}</legend>
          <div className="crm-form-grid">
            {fs.map((f) => (
              <div key={f.key} className={`field${f.wide || f.type === 'textarea' ? ' crm-span' : ''}`}>
                <label htmlFor={`xf-${f.key}`}>{f.label}{f.required ? ' (required)' : ''}</label>
                <FieldInput f={f} id={`xf-${f.key}`} companyId={companyId} value={data[f.key]} label={labels[f.key]} onChange={(v, l) => { setData((d) => ({ ...d!, [f.key]: v })); if (l !== undefined) setLabels((x) => ({ ...x, [f.key]: l })); }} />
                {f.help ? <p className="muted small">{f.help}</p> : null}
              </div>
            ))}
          </div>
        </fieldset>
      ))}
      {def.lines && canLines ? <LinesEditor companyId={companyId} def={def} lines={lines} setLines={setLines} labels={lineLabels} setLabels={setLineLabels} /> : null}
      {def.lines && !canLines && !id ? <p className="muted small">The {def.lines.label.toLowerCase()} are worked out after saving.</p> : null}
      <div className="row">
        <Link className="btn" to={id ? recordPage(companyId, module, object, id) : `${base}/${object}`}>Cancel</Link>
        <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : id ? 'Save' : `Add the ${def.label.toLowerCase()}`}</button>
      </div>
    </form>
  );
}

function LinesEditor({ companyId, def, lines, setLines, labels, setLabels }: { companyId: string; def: ObjectFull; lines: Record<string, unknown>[]; setLines: (l: Record<string, unknown>[]) => void; labels: Record<string, string>; setLabels: (l: Record<string, string>) => void }) {
  const ld = def.lines!;
  const fields = ld.fields;
  const blank = () => Object.fromEntries(fields.filter((f) => f.default !== undefined).map((f) => [f.key, f.default]));
  return (
    <fieldset className="mt-form-section">
      <legend>{ld.label}</legend>
      {lines.length ? (
        <div className="crm-table-scroll">
          <table className="data-table erp-lines">
            <thead><tr>{fields.map((f) => <th key={f.key}>{f.label}</th>)}<th><span className="sr-only">Remove</span></th></tr></thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i}>
                  {fields.map((f) => (
                    <td key={f.key} data-label={f.label}>
                      {f.computed ? (
                        <span className="muted">{valueText(f, l[f.key], labels[`line:${i}:${f.key}`])}</span>
                      ) : (
                        <FieldInput f={f} id={`xl-${i}-${f.key}`} companyId={companyId} value={l[f.key]} label={labels[`line:${i}:${f.key}`]} onChange={(v, lab) => { const next = lines.slice(); next[i] = { ...next[i], [f.key]: v }; setLines(next); if (lab !== undefined) setLabels({ ...labels, [`line:${i}:${f.key}`]: lab }); }} />
                      )}
                    </td>
                  ))}
                  <td><button type="button" className="btn ghost icon sm" aria-label={`Remove line ${i + 1}`} onClick={() => setLines(lines.filter((_, j) => j !== i))}><Icon name="trash" size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted small">No {ld.label.toLowerCase()} yet.</p>
      )}
      <div className="row"><button type="button" className="btn" onClick={() => setLines([...lines, blank()])}><Icon name="plus" /> Add a line</button></div>
    </fieldset>
  );
}

// ------------------------------------------------------------------ one record

function RecordDetail({ companyId, module }: { companyId: string; module: string }) {
  const { object = '', id = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const key = ['erp', companyId, 'x', 'rec', object, id];
  const q = useQuery({ queryKey: key, queryFn: () => get<Detail>(xPath(companyId, `/o/${object}/${id}`)), retry: false });
  const [stepping, setStepping] = useState<Detail['steps'][number] | null>(null);
  const [acting, setActing] = useState<Detail['actions'][number] | null>(null);
  const [result, setResult] = useState<{ title: string; rows: Record<string, unknown>[] } | null>(null);
  const [tab, setTab] = useState<'details' | 'lines' | 'finance' | 'related' | 'files' | 'comments' | 'history'>('details');
  const fileInput = useRef<HTMLInputElement>(null);
  usePageTitle(q.data ? `${q.data.record.number} ${q.data.record.title}` : 'Record');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const d = q.data;
  const r = d.record;
  const def = d.object;
  const refresh = async (next?: Detail) => {
    if (next) qc.setQueryData(key, next);
    await qc.invalidateQueries({ queryKey: ['erp', companyId, 'x'] });
  };
  const runStep = async (s: Detail['steps'][number], note?: string) => {
    try {
      const next = await post<Detail>(xPath(companyId, `/o/${object}/${id}/step/${s.key}`), { note: note ?? null });
      toast(`${s.label}: done`);
      await refresh(next);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const runAction = async (a: Detail['actions'][number], input?: Record<string, unknown>) => {
    try {
      const out = await post<{ message: string; link: string | null; result: unknown; detail: Detail | null }>(xPath(companyId, `/o/${object}/${id}/action/${a.key}`), { input: input ?? {} });
      toast(out.message);
      if (out.detail) await refresh(out.detail);
      if (Array.isArray(out.result)) setResult({ title: a.label, rows: out.result as Record<string, unknown>[] });
      if (out.link?.startsWith('/c/')) navigate(out.link);
      else if (out.link) window.open(appUrl(out.link.replace(/^\/erp/, '')), '_self');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const remove = async (archive: boolean) => {
    const ok = await confirm({ title: archive ? `Archive ${r.number}?` : `Delete ${r.number}?`, message: archive ? 'It stays in the history and can be restored.' : 'Only a draft nobody refers to can be deleted. This cannot be undone.', confirmLabel: archive ? 'Archive' : 'Delete', danger: !archive });
    if (!ok) return;
    try {
      const out = await del<Detail | { deleted: boolean }>(xPath(companyId, `/o/${object}/${id}${archive ? '?archive=1' : ''}`));
      toast(archive ? 'Archived' : 'Deleted');
      if ('deleted' in out) {
        await qc.invalidateQueries({ queryKey: ['erp', companyId, 'x'] });
        navigate(modulePage(companyId, module, `/${object}`));
      } else await refresh(out as Detail);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      let next: Detail | undefined;
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.set('file', f);
        next = await api<Detail>(xPath(companyId, `/o/${object}/${id}/files`), { method: 'POST', form: fd });
      }
      toast(files.length === 1 ? 'File added' : `${files.length} files added`);
      await refresh(next);
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };
  const sections: [string, [string, ReactNode][]][] = [];
  for (const f of def.fields) {
    if (r.hidden.includes(f.key)) continue;
    const s = f.section ?? 'Details';
    const v = valueText(f, r.data[f.key], r.labels[f.key], r.currency);
    const link = f.type === 'ref' && f.ref?.startsWith('obj:') && r.data[f.key] ? (d.related.length >= 0 ? <RefLink companyId={companyId} object={f.ref.slice(4)} id={String(r.data[f.key])} label={v} /> : v) : v;
    const at = sections.find(([n]) => n === s);
    const item: [string, ReactNode] = [f.label, link];
    if (at) at[1].push(item);
    else sections.push([s, [item]]);
  }
  const base = modulePage(companyId, module);
  return (
    <div className="stack">
      <nav className="erp-crumbs small" aria-label="Breadcrumb"><Link to={`${base}/${object}`}>{def.plural}</Link> <span aria-hidden="true">›</span> {r.number}</nav>
      <div className="crm-record-head card card-pad">
        <div className="row wrap">
          <div className="grow">
            <h2 className="crm-card-title"><span className="mt-num">{r.number}</span> {r.title}</h2>
            <div className="row wrap small">
              <StatusBadge statuses={def.statuses} value={r.status} />
              {r.archivedAt ? <span className="badge">Archived</span> : null}
              {r.dueDate ? <span className={r.dueDate < new Date().toISOString().slice(0, 10) && !def.closed.includes(r.status) ? 'danger-text' : 'muted'}>Due {valueText({ key: 'd', label: 'd', type: 'date' }, r.dueDate, undefined)}</span> : null}
              {r.amountCents !== null ? <span className="muted">{moneyText(r.amountCents, r.currency ?? 'AUD')}</span> : null}
              <span className="muted">Added by {r.createdByName ?? 'someone'} {timeAgo(r.createdAt)}, changed {timeAgo(r.updatedAt)}</span>
              {r.sodException ? <span className="badge warning" title="Approved by the person who made it: they are alone in the company, so the exception is recorded">Segregation exception recorded</span> : null}
            </div>
          </div>
          <div className="row wrap erp-actions">
            {d.steps.map((s) => (
              <button key={s.key} className={`btn${s.approval ? ' primary' : ''}`} title={s.segregation ? 'You made this record or it is yours: someone else must take this step (segregation of duties)' : undefined} onClick={() => (s.note || s.confirm ? setStepping(s) : void runStep(s))}>
                {s.label}
              </button>
            ))}
            {d.actions.map((a) => <button key={a.key} className="btn" title={a.what} onClick={() => (a.input.length || a.confirm ? setActing(a) : void runAction(a))}><Icon name="bolt" /> {a.label}</button>)}
            {d.can.edit ? <Link className="btn" to={`${base}/${object}/${id}/edit`}><Icon name="edit" /> Edit</Link> : null}
            {r.archivedAt && d.can.archive ? <button className="btn" onClick={async () => { try { await refresh(await post<Detail>(xPath(companyId, `/o/${object}/${id}/restore`))); toast('Restored'); } catch (e) { toast(errorMessage(e), 'error'); } }}><Icon name="restore" /> Restore</button> : null}
            {!r.archivedAt && d.can.archive ? <button className="btn ghost" onClick={() => void remove(true)}><Icon name="archive" /> Archive</button> : null}
            {!r.archivedAt && d.can.remove && r.status === def.statuses[0]?.key ? <button className="btn ghost danger" onClick={() => void remove(false)}><Icon name="trash" /> Delete</button> : null}
          </div>
        </div>
        {def.notice ? <p className="info-box small">{def.notice}</p> : null}
        {r.hidden.length ? <p className="muted small">Some fields are hidden: your roles do not include them.</p> : null}
      </div>
      <nav className="tabs crm-tabs" aria-label="Record sections">
        {(['details', ...(d.lines ? ['lines'] : []), ...(d.postings ? ['finance'] : []), 'related', 'files', 'comments', 'history'] as const).map((t) => (
          <button key={t} type="button" className={`tab${tab === t ? ' active' : ''}`} aria-pressed={tab === t} onClick={() => setTab(t as typeof tab)}>
            {t === 'details' ? 'Details' : t === 'lines' ? (def.lines?.label ?? 'Lines') : t === 'finance' ? `Finance (${d.postings?.journals.filter((j) => !j.reversed).length ?? 0})` : t === 'related' ? `Related (${d.related.length})` : t === 'files' ? `Files (${d.files.length})` : t === 'comments' ? `Comments (${d.comments.length})` : 'History'}
          </button>
        ))}
      </nav>
      {tab === 'details' ? <div className="crm-record-grid">{sections.map(([name, items]) => <Section key={name} title={name}><Props items={items} /></Section>)}</div> : null}
      {tab === 'lines' && d.lines && def.lines ? (
        <Section title={def.lines.label} actions={d.can.editLines ? <Link className="btn sm" to={`${base}/${object}/${id}/edit`}><Icon name="edit" /> Change</Link> : undefined}>
          {d.lines.length ? (
            <div className="crm-table-scroll">
              <table className="data-table responsive">
                <thead><tr>{def.lines.fields.map((f) => <th key={f.key}>{f.label}</th>)}</tr></thead>
                <tbody>{d.lines.map((l, i) => <tr key={i}>{def.lines!.fields.map((f) => <td key={f.key} data-label={f.label}>{valueText(f, l[f.key], d.lineLabels[`line:${i}:${f.key}`], r.currency)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          ) : <p className="muted small">No {def.lines.label.toLowerCase()} yet.</p>}
        </Section>
      ) : null}
      {tab === 'finance' && d.postings ? <Section title="Journals in Finance"><RecordPostings postings={d.postings} currency={r.currency ?? 'AUD'} /></Section> : null}
      {tab === 'related' ? (
        <Section title="Related records">
          {d.related.length ? (
            <ul className="erp-list">{d.related.map((x) => <li key={`${x.id}:${x.via}`}><Link to={recordPage(companyId, x.module, x.object, x.id)}>{x.objectLabel} <span className="mt-num">{x.number}</span> {x.title}</Link> <span className="muted small">{x.status.replace(/_/g, ' ')}</span></li>)}</ul>
          ) : <p className="muted small">No other record refers to this one yet.</p>}
        </Section>
      ) : null}
      {tab === 'files' ? (
        <Section title="Files" actions={d.can.attach ? <><input ref={fileInput} type="file" multiple className="sr-only" tabIndex={-1} aria-label="Add files" accept="image/*,.pdf,.txt,.csv,.docx,.xlsx,.pptx,.odt,.ods,.zip,.md" onChange={(e) => void upload(e.target.files)} /><button className="btn sm" onClick={() => fileInput.current?.click()}><Icon name="upload" /> Add files</button></> : undefined}>
          <FileList files={d.files as any} canRemove={(f: any) => d.can.archive || f.uploadedBy === r.createdBy} onRemove={async (f: any) => { if (!(await confirm({ title: `Remove ${f.name}?`, confirmLabel: 'Remove', danger: true }))) return; try { await del(xPath(companyId, `/files/${f.id}`)); await q.refetch(); } catch (e) { toast(errorMessage(e), 'error'); } }} />
        </Section>
      ) : null}
      {tab === 'comments' ? (
        <Section title="Comments">
          <Comments noun="comment" canAdd={d.can.comment} comments={d.comments.map((c) => ({ id: c.id, body: c.body, at: c.at, authorName: c.author })) as any} onAdd={async (body) => { await refresh(await post<Detail>(xPath(companyId, `/o/${object}/${id}/comments`), { body })); }} />
        </Section>
      ) : null}
      {tab === 'history' ? <Section title="History"><History events={d.history as any} /></Section> : null}
      {stepping ? <StepDialog step={stepping} onClose={() => setStepping(null)} onRun={async (note) => { await runStep(stepping, note); setStepping(null); }} /> : null}
      {acting ? <ActionDialog companyId={companyId} action={acting} onClose={() => setActing(null)} onRun={async (input) => { await runAction(acting, input); setActing(null); }} /> : null}
      {result ? <ResultDialog title={result.title} rows={result.rows} currency={r.currency ?? 'AUD'} onClose={() => setResult(null)} /> : null}
    </div>
  );
}

function RefLink({ companyId, object, id, label }: { companyId: string; object: string; id: string; label: string }) {
  const module = useMemo(() => MODULE_OF[object], [object]);
  return module ? <Link to={recordPage(companyId, module, object, id)}>{label || 'Open'}</Link> : <>{label}</>;
}

// The module of each kind of record, for links between records.
const MODULE_OF: Record<string, string> = Object.fromEntries(OBJECTS.map((o) => [o.key, o.module]));

function StepDialog({ step, onClose, onRun }: { step: Detail['steps'][number]; onClose: () => void; onRun: (note?: string) => Promise<void> }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={step.label} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || (step.note === 'required' && !note.trim())} onClick={async () => { setBusy(true); await onRun(note.trim() || undefined); setBusy(false); }}>{busy ? 'Working…' : step.label}</button></>}>
      <div className="stack">
        {step.confirm ? <p>{step.confirm}</p> : null}
        {step.segregation ? <p className="warning-text small">You made this record or it is yours: unless you are alone in the company, someone else must take this step.</p> : null}
        {step.note ? (
          <div className="field">
            <label htmlFor="x-step-note">{step.note === 'required' ? 'Reason (required)' : 'Note (optional)'}</label>
            <textarea id="x-step-note" className="textarea" rows={3} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function ActionDialog({ companyId, action, onClose, onRun }: { companyId: string; action: Detail['actions'][number]; onClose: () => void; onRun: (input: Record<string, unknown>) => Promise<void> }) {
  const [input, setInput] = useState<Record<string, unknown>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const missing = action.input.some((f) => f.required && (input[f.key] === undefined || input[f.key] === null || input[f.key] === ''));
  return (
    <Modal title={action.label} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || missing} onClick={async () => { setBusy(true); await onRun(input); setBusy(false); }}>{busy ? 'Working…' : action.label}</button></>}>
      <div className="stack">
        <p className="small">{action.what}</p>
        {action.confirm ? <p>{action.confirm}</p> : null}
        {action.input.map((f) => (
          <div key={f.key} className="field">
            <label htmlFor={`xa-${f.key}`}>{f.label}{f.required ? ' (required)' : ''}</label>
            <FieldInput f={f} id={`xa-${f.key}`} companyId={companyId} value={input[f.key]} label={labels[f.key]} onChange={(v, l) => { setInput((x) => ({ ...x, [f.key]: v })); if (l !== undefined) setLabels((x) => ({ ...x, [f.key]: l })); }} />
          </div>
        ))}
      </div>
    </Modal>
  );
}

function ResultDialog({ title, rows, currency, onClose }: { title: string; rows: Record<string, unknown>[]; currency: string; onClose: () => void }) {
  const cols = rows.length ? Object.keys(rows[0]) : [];
  return (
    <Modal wide title={title} onClose={onClose} footer={<button className="btn" onClick={onClose}>Close</button>}>
      {rows.length ? (
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead><tr>{cols.map((c) => <th key={c}>{c.replace(/([A-Z])/g, ' $1').toLowerCase()}</th>)}</tr></thead>
            <tbody>{rows.map((row, i) => <tr key={i}>{cols.map((c) => <td key={c}>{typeof row[c] === 'number' && c !== 'month' ? moneyText(row[c], currency) : String(row[c] ?? '')}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : <p className="muted">Nothing to show.</p>}
    </Modal>
  );
}

// ------------------------------------------------------------------ reports

function Reports({ companyId, module, data }: { companyId: string; module: string; data: NonNullable<ReturnType<typeof useModule>['data']> }) {
  usePageTitle(`${data.module.label} reports`);
  const base = modulePage(companyId, module);
  return (
    <div className="crm-record-grid">
      {data.objects.map((o) => (
        <Section key={o.key} title={o.plural}>
          {o.reports.length ? <ul className="erp-list">{o.reports.map((r) => <li key={r.key}><Link to={`${base}/reports/${o.key}/${r.key}`}>{r.label}</Link> <span className="muted small">{r.what}</span></li>)}</ul> : <p className="muted small">No reports.</p>}
        </Section>
      ))}
    </div>
  );
}

function ReportView({ companyId, module }: { companyId: string; module: string }) {
  const { object = '', report = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'x', 'report', object, report], queryFn: () => get<{ report: ReportTable }>(xPath(companyId, `/o/${object}/report/${report}`)), retry: false });
  usePageTitle(q.data?.report.label ?? 'Report');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const r = q.data.report;
  const countCol = r.columns.find((c) => c.key === 'count');
  const max = countCol ? Math.max(1, ...r.rows.map((x) => Number(x.count) || 0)) : 0;
  return (
    <div className="stack">
      <nav className="erp-crumbs small" aria-label="Breadcrumb"><Link to={modulePage(companyId, module, '/reports')}>Reports</Link> <span aria-hidden="true">›</span> {r.label}</nav>
      <div className="row wrap"><p className="muted small grow">{r.what}</p><a className="btn" href={xHref(companyId, `/o/${object}/report/${report}?format=csv`)} download><Icon name="download" /> Export CSV</a></div>
      {r.note ? <p className="info-box small">{r.note}</p> : null}
      <div className="card crm-table-card">
        {r.rows.length ? (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr>{r.columns.map((c) => <th key={c.key} className={c.kind === 'money' || c.kind === 'number' ? 'num' : undefined}>{c.label}</th>)}{countCol ? <th><span className="sr-only">Share</span></th> : null}</tr></thead>
              <tbody>
                {r.rows.map((row, i) => (
                  <tr key={i}>
                    {r.columns.map((c) => <td key={c.key} data-label={c.label} className={c.kind === 'money' || c.kind === 'number' ? 'num' : undefined}>{c.kind === 'money' ? moneyText(row[c.key]) : c.kind === 'date' && row[c.key] ? new Date(`${row[c.key]}T00:00:00`).toLocaleDateString() : String(row[c.key] ?? '')}</td>)}
                    {countCol ? <td><meter className="erp-meter" min={0} max={max} value={Number(row.count) || 0} aria-label={`${row.count} of ${max}`} /></td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="chart" title="Nothing to report yet">Records you may see appear here.</EmptyState>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ dispatch board, price check, payslips

function DispatchBoard({ companyId }: { companyId: string }) {
  usePageTitle('Dispatch board');
  const [week, setWeek] = useState(0);
  const start = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + week * 7);
    return d.toISOString().slice(0, 10);
  }, [week]);
  const days = Array.from({ length: 7 }, (_, i) => new Date(Date.parse(`${start}T00:00:00Z`) + i * 86_400_000).toISOString().slice(0, 10));
  const q = useQuery({ queryKey: ['erp', companyId, 'x', 'dispatch', start], queryFn: () => get<{ object: ObjectFull; records: Rec[] }>(xPath(companyId, `/o/sv_job?from=${days[0]}&to=${days[6]}&limit=500&sort=date&dir=asc`)), retry: false });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const techs = new Map<string, string>();
  for (const r of q.data.records) techs.set(r.assigneeId ?? '', r.labels.technician ?? (r.assigneeId ? 'A technician' : 'Not given to anyone'));
  const rows = [...techs.entries()].sort((a, b) => (a[0] === '' ? 1 : b[0] === '' ? -1 : a[1].localeCompare(b[1])));
  return (
    <div className="stack">
      <div className="row wrap">
        <button className="btn sm" onClick={() => setWeek((w) => w - 1)} aria-label="Previous week"><Icon name="chevronLeft" /></button>
        <strong>Week of {new Date(`${start}T00:00:00`).toLocaleDateString()}</strong>
        <button className="btn sm" onClick={() => setWeek((w) => w + 1)} aria-label="Next week"><Icon name="chevronRight" /></button>
        {week ? <button className="btn sm ghost" onClick={() => setWeek(0)}>This week</button> : null}
        <span className="grow" />
        <Link className="btn primary" to={modulePage(companyId, 'service', '/sv_job/new')}><Icon name="plus" /> New job</Link>
      </div>
      {!rows.length ? <EmptyState icon="calendar" title="No jobs this week">Field service jobs scheduled this week appear here by technician and day.</EmptyState> : (
        <div className="crm-table-scroll card">
          <table className="data-table erp-dispatch">
            <thead><tr><th>Technician</th>{days.map((d) => <th key={d}>{new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</th>)}</tr></thead>
            <tbody>
              {rows.map(([tech, name]) => (
                <tr key={tech || 'none'}>
                  <th scope="row">{name}</th>
                  {days.map((d) => (
                    <td key={d}>
                      {q.data!.records.filter((r) => (r.assigneeId ?? '') === tech && r.date === d).map((r) => (
                        <Link key={r.id} className="erp-dispatch-job" to={recordPage(companyId, 'service', 'sv_job', r.id)}>
                          <span className="mt-num small">{r.number}</span> <span className="small">{r.title}</span> <StatusBadge statuses={q.data!.object.statuses} value={r.status} />
                          {r.data.startTime ? <span className="muted small"> {String(r.data.startTime)}</span> : null}
                        </Link>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PriceCheck({ companyId }: { companyId: string }) {
  usePageTitle('Price check');
  const [product, setProduct] = useState<string | null>(null);
  const [customer, setCustomer] = useState<string | null>(null);
  const [qty, setQty] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const q = useQuery({ queryKey: ['erp', companyId, 'x', 'price', product, customer, qty, date], queryFn: () => get<any>(xPath(companyId, `/price?product=${encodeURIComponent(product!)}&customer=${encodeURIComponent(customer ?? '')}&qty=${encodeURIComponent(qty)}&date=${date}`)), enabled: !!product, retry: false });
  return (
    <div className="stack">
      <div className="card card-pad crm-form-grid">
        <div className="field"><label htmlFor="pc-p">Product</label><RefPicker companyId={companyId} kind="product" id="pc-p" value={product} onChange={(v) => setProduct(v)} /></div>
        <div className="field"><label htmlFor="pc-c">Customer</label><RefPicker companyId={companyId} kind="customer" id="pc-c" value={customer} onChange={(v) => setCustomer(v)} /></div>
        <div className="field"><label htmlFor="pc-q">Quantity</label><input id="pc-q" className="input erp-qty-input" type="number" min={0} step="any" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
        <div className="field"><label htmlFor="pc-d">Date</label><input id="pc-d" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      </div>
      {q.error ? <ErrorBox error={q.error} /> : null}
      {q.data ? (
        <Section title={q.data.product.label}>
          <Props items={[
            ['Standard price', q.data.product.standardPrice !== null ? moneyText(q.data.product.standardPrice, q.data.product.currency) : ''],
            ['Price list', q.data.priceList ? `${q.data.priceList.list}: ${moneyText(q.data.priceList.price, q.data.priceList.currency)} from ${q.data.priceList.minQty}` : 'None applies'],
            ['Promotion', q.data.promotion ? `${q.data.promotion.name}: ${moneyText(q.data.promotion.off)} off each` : 'None applies'],
            ['Unit price', moneyText(q.data.unitPrice)],
            ['Total', moneyText(q.data.total)],
          ]} />
          <p className="muted small">{q.data.note}</p>
        </Section>
      ) : <p className="muted small">Choose a product to see the price that applies.</p>}
    </div>
  );
}

function Payslips({ companyId }: { companyId: string }) {
  usePageTitle('My payslips');
  const q = useQuery({ queryKey: ['erp', companyId, 'x', 'payslips'], queryFn: () => get<{ payslips: any[]; note: string }>(xPath(companyId, '/payslips')), retry: false });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <p className="muted small">{q.data.note}</p>
      {q.data.payslips.length ? (
        <div className="card crm-table-card">
          <table className="data-table responsive">
            <thead><tr><th>Pay run</th><th>Period</th><th>Paid on</th><th className="num">Hours</th><th className="num">Gross</th><th className="num">Tax withheld</th><th className="num">Other deductions</th><th className="num">Net</th><th className="num">Employer contribution</th></tr></thead>
            <tbody>{q.data.payslips.map((p, i) => <tr key={i}><td data-label="Pay run">{p.run}</td><td data-label="Period">{p.periodStart} to {p.periodEnd}</td><td data-label="Paid on">{p.payDate}</td><td className="num" data-label="Hours">{p.hours ?? ''}</td><td className="num" data-label="Gross">{moneyText(p.gross, p.currency)}</td><td className="num" data-label="Tax withheld">{moneyText(p.withheld, p.currency)}</td><td className="num" data-label="Other deductions">{moneyText(p.deductions, p.currency)}</td><td className="num" data-label="Net">{moneyText(p.net, p.currency)}</td><td className="num" data-label="Employer contribution">{moneyText(p.contribution, p.currency)}</td></tr>)}</tbody>
          </table>
        </div>
      ) : <EmptyState icon="dollar" title="No payslips yet">Payslips of approved pay runs appear here.</EmptyState>}
    </div>
  );
}
