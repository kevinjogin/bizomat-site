// The asset register: a tree of the hierarchy and a filterable list, an asset with all its details, its place in the
// hierarchy, the assets under it, its outstanding work, open requests, history and files, the asset form, and the CSV
// import with a preview.
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import {
  ASSET_STATUS_LABELS,
  CRITICALITY_LABELS,
  JOB_TYPE_LABELS,
  STRATEGY_LABELS,
  dateText,
  money,
  mtPage,
  mtPath,
  type Asset,
  type MtEvent,
  type MtFile,
  type MtMe,
  type MtRequest,
  type WorkOrder,
} from './api';
import { AssetStatusBadge, CriticalityBadge, FileList, FilterPanel, History, PriorityBadge, Props, RequestBadge, Section, UploadButton, WoBadge, options } from './common';
import { AssetPicker, DepartmentField, PersonSelect, type PickedAsset } from './pickers';

// ------------------------------------------------------------------ register: tree and list

interface TreeNode {
  id: string;
  number: string;
  name: string;
  parentId: string | null;
  status: string;
  criticality: string;
  category: string;
  archived: boolean;
  openWork: number;
}

export function AssetsPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Assets');
  const [params, setParams] = useSearchParams();
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const view = params.get('view') === 'list' ? 'list' : 'tree';
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <nav className="tabs grow" aria-label="Asset views">
          <button className={`tab${view === 'tree' ? ' active' : ''}`} aria-current={view === 'tree' ? 'page' : undefined} onClick={() => set('view', '')}><Icon name="subitem" /> Hierarchy</button>
          <button className={`tab${view === 'list' ? ' active' : ''}`} aria-current={view === 'list' ? 'page' : undefined} onClick={() => set('view', 'list')}><Icon name="list" /> List</button>
        </nav>
        {me.can.importAssets ? <button className="btn" onClick={() => setImporting(true)}><Icon name="upload" /> Import CSV</button> : null}
        {me.can.manageAssets ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New asset</button> : null}
      </div>
      {view === 'tree' ? <AssetTree companyId={companyId} q={params.get('q') ?? ''} setQ={(v) => set('q', v)} /> : <AssetList companyId={companyId} params={params} set={set} />}
      {creating ? <AssetFormDialog companyId={companyId} me={me} onClose={() => setCreating(false)} /> : null}
      {importing ? <ImportDialog companyId={companyId} onClose={() => setImporting(false)} /> : null}
    </div>
  );
}

function AssetTree({ companyId, q, setQ }: { companyId: string; q: string; setQ: (v: string) => void }) {
  const [archived, setArchived] = useState(false);
  const tree = useQuery({ queryKey: ['mt', companyId, 'tree', archived], queryFn: () => get<{ nodes: TreeNode[] }>(mtPath(companyId, `/assets/tree${archived ? '?archived=all' : ''}`)) });
  const [open, setOpen] = useState<Set<string>>(new Set());
  const { children, roots, shown, matches } = useMemo(() => {
    const nodes = tree.data?.nodes ?? [];
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const children = new Map<string, TreeNode[]>();
    const roots: TreeNode[] = [];
    for (const n of nodes) {
      if (n.parentId && byId.has(n.parentId)) children.set(n.parentId, [...(children.get(n.parentId) ?? []), n]);
      else roots.push(n);
    }
    // Searching: the matching assets and every asset above them.
    const term = q.trim().toLowerCase();
    const matches = new Set<string>();
    const shown = new Set<string>();
    if (term) {
      for (const n of nodes) {
        if (`${n.number} ${n.name} ${n.category}`.toLowerCase().includes(term)) {
          matches.add(n.id);
          let cur: TreeNode | undefined = n;
          for (let i = 0; cur && i < 200; i++) {
            shown.add(cur.id);
            cur = cur.parentId ? byId.get(cur.parentId) : undefined;
          }
        }
      }
    }
    return { children, roots, shown, matches };
  }, [tree.data, q]);
  const searching = !!q.trim();
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const render = (n: TreeNode, depth: number) => {
    if (searching && !shown.has(n.id)) return null;
    const kids = children.get(n.id) ?? [];
    const expanded = searching || open.has(n.id);
    return (
      <li key={n.id}>
        <div className={`mt-tree-row${matches.has(n.id) ? ' match' : ''}`}>
          {kids.length ? (
            <button type="button" className="btn ghost icon sm mt-toggle" aria-expanded={expanded} aria-label={`${expanded ? 'Collapse' : 'Expand'} ${n.name}`} onClick={() => toggle(n.id)}>
              <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={14} />
            </button>
          ) : <span className="mt-toggle-gap" aria-hidden />}
          <Link to={mtPage(companyId, `/assets/${n.id}`)}>
            <span className="mt-num">{n.number}</span>
            <span className="mt-tree-name">{n.name}</span>
          </Link>
          {n.archived ? <span className="badge">Archived</span> : null}
          {n.status !== 'operating' ? <AssetStatusBadge value={n.status} /> : null}
          {n.criticality === 'critical' || n.criticality === 'high' ? <CriticalityBadge value={n.criticality} /> : null}
          {n.openWork ? <span className="badge warning" title="Outstanding work orders">{n.openWork} open</span> : null}
          {kids.length && !expanded ? <span className="muted small">{kids.length} under it</span> : null}
        </div>
        {kids.length && expanded && depth < 60 ? <ul>{kids.map((k) => render(k, depth + 1))}</ul> : null}
      </li>
    );
  };
  return (
    <div className="stack">
      <div className="row wrap mt-toolbar">
        <div className="crm-search">
          <Icon name="search" />
          <input className="input" type="search" aria-label="Search the hierarchy" placeholder="Search by number or name" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn ghost sm" onClick={() => setOpen(new Set((tree.data?.nodes ?? []).map((n) => n.id)))}>Expand all</button>
        <button className="btn ghost sm" onClick={() => setOpen(new Set())}>Collapse all</button>
        <label className="checkbox"><input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} /> Show archived</label>
      </div>
      {tree.error ? <ErrorBox error={tree.error} retry={() => tree.refetch()} /> : null}
      <section className="card card-pad">
        {!tree.data ? <Loading /> : !tree.data.nodes.length ? (
          <EmptyState icon="layers" title="No assets yet">Add your sites, buildings, lines, machines and their systems, each under the one it belongs to. Or import them from a CSV file.</EmptyState>
        ) : searching && !matches.size ? (
          <p className="muted">No asset matches.</p>
        ) : (
          <ul className="mt-tree" aria-label="Asset hierarchy">{roots.map((r) => render(r, 0))}</ul>
        )}
      </section>
    </div>
  );
}

function AssetList({ companyId, params, set }: { companyId: string; params: URLSearchParams; set: (k: string, v: string) => void }) {
  const g = (k: string) => params.get(k) ?? '';
  const query = new URLSearchParams();
  for (const k of ['q', 'status', 'criticality', 'strategy', 'category', 'archived', 'sort']) if (g(k)) query.set(k, g(k));
  const list = useQuery({ queryKey: ['mt', companyId, 'assets', query.toString()], queryFn: () => get<{ assets: Asset[]; total: number; categories: string[] }>(mtPath(companyId, `/assets?${query}`)) });
  return (
    <div className="stack">
      <FilterPanel active={['q', 'status', 'criticality', 'strategy', 'category', 'archived'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="mta-q">Search</label><input id="mta-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, name, serial, location" /></div>
        <div className="field"><label htmlFor="mta-cat">Category</label><select id="mta-cat" className="select" value={g('category')} onChange={(e) => set('category', e.target.value)}><option value="">Any</option>{(list.data?.categories ?? []).map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="field"><label htmlFor="mta-status">Status</label><select id="mta-status" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Any</option>{options(ASSET_STATUS_LABELS)}</select></div>
        <div className="field"><label htmlFor="mta-crit">Criticality</label><select id="mta-crit" className="select" value={g('criticality')} onChange={(e) => set('criticality', e.target.value)}><option value="">Any</option>{options(CRITICALITY_LABELS)}</select></div>
        <div className="field"><label htmlFor="mta-strategy">Strategy</label><select id="mta-strategy" className="select" value={g('strategy')} onChange={(e) => set('strategy', e.target.value)}><option value="">Any</option>{options(STRATEGY_LABELS)}</select></div>
        <div className="field"><label htmlFor="mta-arch">Show</label><select id="mta-arch" className="select" value={g('archived')} onChange={(e) => set('archived', e.target.value)}><option value="">In use</option><option value="1">Archived</option><option value="all">All</option></select></div>
        <div className="field"><label htmlFor="mta-sort">Sort by</label><select id="mta-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}><option value="">Number</option><option value="name">Name</option><option value="updated">Recently changed</option></select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.assets.length ? <EmptyState icon="layers" title="No assets match">Try other words or remove a filter.</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table mt-table">
              <thead><tr><th>Number</th><th>Name</th><th>Category</th><th>Make and model</th><th>Location</th><th>Status</th><th>Criticality</th><th>Under</th></tr></thead>
              <tbody>
                {list.data.assets.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={mtPage(companyId, `/assets/${a.id}`)}>{a.number}</Link></td>
                    <td data-label="Name">{a.name}{a.archived ? <> <span className="badge">Archived</span></> : null}</td>
                    <td data-label="Category">{a.category}</td>
                    <td data-label="Make and model">{[a.manufacturer, a.model].filter(Boolean).join(' ')}</td>
                    <td data-label="Location">{a.location}</td>
                    <td data-label="Status"><AssetStatusBadge value={a.status} /></td>
                    <td data-label="Criticality"><CriticalityBadge value={a.criticality} /></td>
                    <td data-label="Under">{a.parentId ? <Link to={mtPage(companyId, `/assets/${a.parentId}`)}>{a.parentNumber}</Link> : <span className="muted">Top level</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data && list.data.total > list.data.assets.length ? <p className="muted small">Showing {list.data.assets.length} of {list.data.total}. Narrow the filters to see the rest.</p> : null}
    </div>
  );
}

// ------------------------------------------------------------------ one asset

interface AssetView {
  asset: Asset;
  path: { id: string; number: string; name: string }[];
  parent: { id: string; number: string; name: string } | null;
  children: { id: string; number: string; name: string; status: string; criticality: string; archived: boolean; children: number }[];
  outstandingWorkOrders: WorkOrder[];
  openRequests: MtRequest[];
  history: MtEvent[];
  files: MtFile[];
  can: { edit: boolean; upload: boolean };
}

export function AssetDetail({ companyId, me }: { companyId: string; me: MtMe }) {
  const { assetId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['mt', companyId, 'asset', assetId], queryFn: () => get<AssetView>(mtPath(companyId, `/assets/${assetId}`)), retry: false });
  const [editing, setEditing] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  usePageTitle(q.data ? `${q.data.asset.number} ${q.data.asset.name}` : 'Asset');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { asset: a, can } = q.data;
  const refresh = () => qc.invalidateQueries({ queryKey: ['mt', companyId] });
  const archive = async () => {
    if (!a.archived && !(await confirm({ title: `Archive ${a.number}?`, message: 'It leaves the register and the pickers. Its history, work orders and files stay, and you can restore it.', confirmLabel: 'Archive' }))) return;
    try {
      await post(mtPath(companyId, `/assets/${a.id}/${a.archived ? 'restore' : 'archive'}`), {});
      toast(a.archived ? 'Restored' : 'Archived');
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-head">
        <div>
          <h2 className="mt-title">{a.number} {a.name}</h2>
          <div className="mt-badges"><AssetStatusBadge value={a.status} /><CriticalityBadge value={a.criticality} />{a.archived ? <span className="badge">Archived</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          {!a.archived ? <Link className="btn" to={mtPage(companyId, `/requests/new?assetId=${a.id}`)}><Icon name="alert" /> Report a fault</Link> : null}
          {me.can.manageWork && !a.archived ? <Link className="btn primary" to={mtPage(companyId, `/work-orders/new?assetId=${a.id}`)}><Icon name="wrench" /> New work order</Link> : null}
          {can.edit ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Edit</button> : null}
          {can.edit ? <button className="btn ghost" onClick={archive}>{a.archived ? 'Restore' : 'Archive'}</button> : null}
        </div>
      </div>
      <nav className="mt-path" aria-label="Where it sits">
        {q.data.path.map((p, i) => (
          <span key={p.id} className="row">
            {i ? <span className="sep" aria-hidden>›</span> : null}
            {p.id === a.id ? <strong>{p.name}</strong> : <Link to={mtPage(companyId, `/assets/${p.id}`)}>{p.name}</Link>}
          </span>
        ))}
      </nav>
      <div className="mt-grid">
        <aside className="stack">
          <Section title="About">
            {a.description ? <p className="mt-pre">{a.description}</p> : null}
            <Props
              items={[
                ['Asset number', <span key="n" className="mt-num">{a.number}</span>],
                ['Category', a.category],
                ['Type', a.type],
                ['Manufacturer', a.manufacturer],
                ['Model', a.model],
                ['Serial number', a.serialNumber],
                ['Registration', a.registrationNumber],
                ['Location', a.location],
                ['Department', a.departmentName ?? a.department],
                ['Responsible', a.responsibleName],
                ['Strategy', STRATEGY_LABELS[a.strategy]],
                ['Under', a.parentId ? <Link key="p" to={mtPage(companyId, `/assets/${a.parentId}`)}>{a.parentNumber} {a.parentName}</Link> : 'Top level'],
              ]}
            />
            <p className="muted small">Label it with the asset number {a.number}. Printing and scanning QR codes and barcodes comes in a later stage.</p>
          </Section>
          <Section title="Purchase and warranty">
            <Props
              items={[
                ['Supplier', a.supplier],
                ['Purchased', dateText(a.purchaseDate)],
                ['Commissioned', dateText(a.commissioningDate)],
                ['Warranty until', a.warrantyUntil ? <span key="w">{dateText(a.warrantyUntil)}{a.warrantyUntil < new Date().toISOString().slice(0, 10) ? ' (ended)' : ''}</span> : null],
                ['Purchase cost', money(a.purchaseCostCents)],
                ['Replacement cost', money(a.replacementCostCents)],
              ]}
            />
          </Section>
          <Section title="Technical specifications">
            {a.specs.length ? <Props items={a.specs.map((s) => [s.key, s.value])} /> : <p className="muted small">None recorded.</p>}
          </Section>
        </aside>
        <div className="stack">
          <Section title="Outstanding work" actions={me.can.manageWork && !a.archived ? <Link className="btn sm" to={mtPage(companyId, `/work-orders?view=outstanding&assetId=${a.id}&includeChildren=1`)}>With the assets under it</Link> : null}>
            {q.data.outstandingWorkOrders.length ? (
              <ul className="mt-docs">
                {q.data.outstandingWorkOrders.map((w) => (
                  <li key={w.id} className="row wrap">
                    <Link className="mt-num mt-primary" to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link>
                    <span className="grow small">{w.description}</span>
                    <span className="small muted">{JOB_TYPE_LABELS[w.jobType]}</span>
                    <PriorityBadge priority={w.priority} />
                    <WoBadge status={w.status} />
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">No outstanding work orders{me.can.manageWork ? '' : ' you can see'}.</p>}
          </Section>
          <Section title="Open requests">
            {q.data.openRequests.length ? (
              <ul className="mt-docs">
                {q.data.openRequests.map((r) => (
                  <li key={r.id} className="row wrap">
                    <Link className="mt-num mt-primary" to={mtPage(companyId, `/requests/${r.id}`)}>{r.number}</Link>
                    <span className="grow small">{r.description}</span>
                    <RequestBadge status={r.status} />
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">No open requests{me.can.decide ? '' : ' of yours'}.</p>}
          </Section>
          <Section title={`Assets under it (${q.data.children.length})`} actions={can.edit && !a.archived ? <button className="btn sm" onClick={() => setAddingChild(true)}><Icon name="plus" size={14} /> Add one</button> : null}>
            {q.data.children.length ? (
              <ul className="mt-docs">
                {q.data.children.map((c) => (
                  <li key={c.id} className="row wrap">
                    <Link className="mt-num" to={mtPage(companyId, `/assets/${c.id}`)}>{c.number}</Link>
                    <span className="grow">{c.name}</span>
                    {c.children ? <span className="muted small">{c.children} under it</span> : null}
                    {c.archived ? <span className="badge">Archived</span> : <AssetStatusBadge value={c.status} />}
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">None.</p>}
          </Section>
          <Section title="Photos and documents" actions={can.upload ? <UploadButton companyId={companyId} target={{ assetId: a.id }} onDone={refresh} /> : null}>
            <FileList files={q.data.files} canRemove={() => can.upload} onRemove={async (f) => { try { await del(mtPath(companyId, `/files/${f.id}`)); toast('File removed'); await refresh(); } catch (err) { toast(errorMessage(err), 'error'); } }} />
          </Section>
          <Section title="Maintenance history">
            <History events={q.data.history} />
          </Section>
        </div>
      </div>
      {editing ? <AssetFormDialog companyId={companyId} me={me} asset={a} onClose={() => setEditing(false)} /> : null}
      {addingChild ? <AssetFormDialog companyId={companyId} me={me} parent={{ id: a.id, number: a.number, name: a.name }} onClose={() => setAddingChild(false)} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ the asset form

const dollars = (cents: number | null) => (cents === null ? '' : (cents / 100).toFixed(2));
function toCents(v: string): number | null | 'bad' {
  const t = v.trim().replace(/[$,\s]/g, '');
  if (!t) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return 'bad';
  return Math.round(Number(t) * 100);
}

function AssetFormDialog({ companyId, me, asset, parent, onClose }: { companyId: string; me: MtMe; asset?: Asset; parent?: PickedAsset; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const [f, setF] = useState({
    number: asset?.number ?? '',
    name: asset?.name ?? '',
    description: asset?.description ?? '',
    category: asset?.category ?? '',
    type: asset?.type ?? '',
    manufacturer: asset?.manufacturer ?? '',
    model: asset?.model ?? '',
    serialNumber: asset?.serialNumber ?? '',
    registrationNumber: asset?.registrationNumber ?? '',
    purchaseDate: asset?.purchaseDate ?? '',
    commissioningDate: asset?.commissioningDate ?? '',
    warrantyUntil: asset?.warrantyUntil ?? '',
    supplier: asset?.supplier ?? '',
    purchaseCost: dollars(asset?.purchaseCostCents ?? null),
    replacementCost: dollars(asset?.replacementCostCents ?? null),
    location: asset?.location ?? '',
    responsibleId: asset?.responsibleId ?? '',
    criticality: asset?.criticality ?? 'medium',
    status: asset?.status ?? 'operating',
    strategy: asset?.strategy ?? 'run_to_failure',
  });
  const [dept, setDept] = useState({ departmentId: asset?.departmentId ?? '', department: asset?.department ?? '' });
  const [parentAsset, setParentAsset] = useState<PickedAsset | null>(asset?.parentId ? { id: asset.parentId, number: asset.parentNumber ?? '', name: asset.parentName ?? '' } : (parent ?? null));
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(asset?.specs ?? []);
  const [busy, setBusy] = useState(false);
  const field = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const text = (k: keyof typeof f, label: string, max: number, extra: Record<string, unknown> = {}) => (
    <div className="field">
      <label htmlFor={`mtf-${k}`}>{label}</label>
      <input id={`mtf-${k}`} className="input" maxLength={max} value={f[k]} onChange={field(k)} {...extra} />
    </div>
  );
  const date = (k: keyof typeof f, label: string) => (
    <div className="field">
      <label htmlFor={`mtf-${k}`}>{label}</label>
      <input id={`mtf-${k}`} className="input" type="date" value={f[k]} onChange={field(k)} />
    </div>
  );
  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    const purchase = toCents(f.purchaseCost);
    const replacement = toCents(f.replacementCost);
    if (purchase === 'bad' || replacement === 'bad') return toast('Write costs as amounts, for example 12500.00', 'error');
    setBusy(true);
    const body = {
      ...(f.number.trim() ? { number: f.number.trim() } : {}),
      name: f.name,
      description: f.description,
      category: f.category,
      type: f.type,
      manufacturer: f.manufacturer,
      model: f.model,
      serialNumber: f.serialNumber,
      registrationNumber: f.registrationNumber,
      purchaseDate: f.purchaseDate || null,
      commissioningDate: f.commissioningDate || null,
      warrantyUntil: f.warrantyUntil || null,
      supplier: f.supplier,
      purchaseCostCents: purchase,
      replacementCostCents: replacement,
      location: f.location,
      department: dept.department,
      departmentId: dept.departmentId || null,
      responsibleId: f.responsibleId || null,
      criticality: f.criticality,
      status: f.status,
      strategy: f.strategy,
      specs: specs.filter((s) => s.key.trim()).map((s) => ({ key: s.key.trim(), value: s.value.trim() })),
      parentId: parentAsset?.id ?? null,
    };
    try {
      const saved = asset ? await patch<Asset>(mtPath(companyId, `/assets/${asset.id}`), body) : await post<Asset>(mtPath(companyId, '/assets'), body);
      toast(asset ? 'Saved' : `Asset ${saved.number} added`);
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      onClose();
      if (!asset) navigate(mtPage(companyId, `/assets/${saved.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={asset ? `Edit ${asset.number}` : 'New asset'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.name.trim()} onClick={() => void save()}>{busy ? 'Saving…' : asset ? 'Save' : 'Add the asset'}</button></>}>
      <form onSubmit={save} className="stack">
        <fieldset className="mt-form-section">
          <legend>The asset</legend>
          <div className="crm-form-grid">
            {text('name', 'Name (required)', 200, { required: true })}
            {text('number', 'Asset number', 40, { placeholder: asset ? '' : 'Leave blank for the next number' })}
            {text('category', 'Category', 80, { placeholder: 'For example: Machine, Vehicle, Building' })}
            {text('type', 'Type', 80)}
            <div className="field crm-span">
              <label htmlFor="mtf-description">Description</label>
              <textarea id="mtf-description" className="textarea" rows={2} maxLength={5000} value={f.description} onChange={field('description')} />
            </div>
          </div>
          <AssetPicker companyId={companyId} id="mtf-parent" label="Sits under (parent asset)" value={parentAsset} onChange={setParentAsset} exclude={asset?.id} />
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Make and identity</legend>
          <div className="crm-form-grid">
            {text('manufacturer', 'Manufacturer', 120)}
            {text('model', 'Model', 120)}
            {text('serialNumber', 'Serial number', 120)}
            {text('registrationNumber', 'Registration number', 120)}
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Purchase and warranty</legend>
          <div className="crm-form-grid">
            {text('supplier', 'Supplier', 200)}
            {date('purchaseDate', 'Purchase date')}
            {date('commissioningDate', 'Commissioning date')}
            {date('warrantyUntil', 'Warranty until')}
            {text('purchaseCost', 'Purchase cost ($)', 20, { inputMode: 'decimal' })}
            {text('replacementCost', 'Replacement cost ($)', 20, { inputMode: 'decimal' })}
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Place and people</legend>
          <div className="crm-form-grid">
            {text('location', 'Location', 200)}
            <DepartmentField me={me} id="mtf-dept" departmentId={dept.departmentId} department={dept.department} onChange={setDept} />
            <PersonSelect me={me} id="mtf-resp" label="Responsible person" value={f.responsibleId} onChange={(v) => setF((x) => ({ ...x, responsibleId: v }))} />
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Maintenance</legend>
          <div className="crm-form-grid">
            <div className="field"><label htmlFor="mtf-crit">Criticality</label><select id="mtf-crit" className="select" value={f.criticality} onChange={field('criticality')}>{options(CRITICALITY_LABELS)}</select></div>
            <div className="field"><label htmlFor="mtf-status">Operating status</label><select id="mtf-status" className="select" value={f.status} onChange={field('status')}>{options(ASSET_STATUS_LABELS)}</select></div>
            <div className="field"><label htmlFor="mtf-strategy">Maintenance strategy</label><select id="mtf-strategy" className="select" value={f.strategy} onChange={field('strategy')}>{options(STRATEGY_LABELS)}</select></div>
          </div>
        </fieldset>
        <fieldset className="mt-form-section">
          <legend>Technical specifications</legend>
          <div className="mt-lines">
            {specs.map((s, i) => (
              <div key={i} className="mt-spec-line">
                <input className="input" aria-label={`Specification ${i + 1} name`} maxLength={80} placeholder="For example: Power" value={s.key} onChange={(e) => setSpecs((x) => x.map((y, j) => (j === i ? { ...y, key: e.target.value } : y)))} />
                <input className="input" aria-label={`Specification ${i + 1} value`} maxLength={500} placeholder="For example: 15 kW" value={s.value} onChange={(e) => setSpecs((x) => x.map((y, j) => (j === i ? { ...y, value: e.target.value } : y)))} />
                <button type="button" className="btn ghost icon" aria-label={`Remove specification ${i + 1}`} onClick={() => setSpecs((x) => x.filter((_, j) => j !== i))}><Icon name="x" /></button>
              </div>
            ))}
          </div>
          <div className="row"><button type="button" className="btn sm" disabled={specs.length >= 60} onClick={() => setSpecs((x) => [...x, { key: '', value: '' }])}><Icon name="plus" size={14} /> Add a specification</button></div>
        </fieldset>
        <button type="submit" className="sr-only" tabIndex={-1}>Save</button>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ CSV import

interface ImportResult {
  dryRun: boolean;
  columns: { header: string; field: string | null }[];
  rows: { line: number; status: 'ok' | 'duplicate' | 'error'; number: string; name: string; parentNumber: string; messages: string[]; imported?: boolean }[];
  summary: { total: number; ok: number; duplicates: number; errors: number };
  created: number;
}

const SAMPLE = 'Asset number,Name,Parent,Category,Manufacturer,Model,Serial number,Location,Criticality,Status,Purchase date,Purchase cost,Spec: Power\nFAC-1,Factory,,Building,,,,Sydney,high,operating,,,\nCNC-01,CNC machining centre,FAC-1,Machine,Example,VMC-850,EX-0042,Bay 3,critical,operating,15/03/2024,185000,15 kW';

function ImportDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [csv, setCsv] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (dryRun: boolean) => {
    setBusy(true);
    try {
      const r = await post<ImportResult>(mtPath(companyId, '/assets/import'), { csv, dryRun });
      setResult(r);
      if (!dryRun) {
        toast(`${r.created} ${r.created === 1 ? 'asset' : 'assets'} imported`);
        await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      }
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const readFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast('The file is larger than 2 MB', 'error');
    setCsv(await file.text());
    setResult(null);
  };
  const done = result && !result.dryRun;
  return (
    <Modal xl title="Import assets from a CSV file" onClose={onClose} footer={
      <>
        <button className="btn" onClick={onClose}>{done ? 'Close' : 'Cancel'}</button>
        {!done ? <button className="btn" disabled={busy || !csv.trim()} onClick={() => run(true)}>{busy ? 'Checking…' : 'Preview'}</button> : null}
        {!done && result?.dryRun ? <button className="btn primary" disabled={busy || !result.summary.ok} onClick={() => run(false)}>Import {result.summary.ok} {result.summary.ok === 1 ? 'asset' : 'assets'}</button> : null}
      </>
    }>
      <div className="stack">
        <p className="small">The first row names the columns. Name is required; the others are optional: Asset number (blank for the next number), Parent (the parent’s asset number, in the register or in this file), Category, Type, Manufacturer, Model, Serial number, Registration number, Purchase date, Commissioning date, Warranty until, Supplier, Purchase cost, Replacement cost, Location, Department, Criticality, Status, Strategy, and Spec: &lt;name&gt; for each technical specification. Dates as 2026-11-14 or 14/11/2026.</p>
        <p className="muted small">Rows that repeat an asset number, or a manufacturer and serial number, already in the register or earlier in the file are skipped as duplicates. Rows with errors are skipped. Nothing is saved until you press Import.</p>
        <div className="row wrap">
          <input type="file" accept=".csv,text/csv" aria-label="Choose a CSV file" onChange={(e) => void readFile(e.target.files?.[0])} />
          <button type="button" className="btn ghost sm" onClick={() => { setCsv(SAMPLE); setResult(null); }}>Use an example</button>
        </div>
        <label className="sr-only" htmlFor="mt-csv">CSV text</label>
        <textarea id="mt-csv" className="textarea mt-csv" rows={8} value={csv} onChange={(e) => { setCsv(e.target.value); setResult(null); }} placeholder="Paste the CSV here, or choose a file" />
        {result ? (
          <>
            <div className={done ? 'ok-box' : result.summary.errors || result.summary.duplicates ? 'warn-box' : 'ok-box'}>
              {done ? `${result.created} imported. ` : `${result.summary.ok} ready to import. `}
              {result.summary.duplicates} {result.summary.duplicates === 1 ? 'duplicate' : 'duplicates'}, {result.summary.errors} with errors, of {result.summary.total} rows.
            </div>
            {result.columns.some((c) => !c.field) ? <p className="muted small">Columns not used: {result.columns.filter((c) => !c.field).map((c) => c.header || '(blank)').join(', ')}.</p> : null}
            <div className="crm-table-scroll">
              <table className="data-table mt-table mt-import-table">
                <thead><tr><th>Line</th><th>Result</th><th>Number</th><th>Name</th><th>Parent</th><th>Notes</th></tr></thead>
                <tbody>
                  {result.rows.map((r) => (
                    <tr key={r.line} className={r.status === 'error' ? 'mt-row-error' : r.status === 'duplicate' ? 'mt-row-duplicate' : ''}>
                      <td data-label="Line" className="mt-num">{r.line}</td>
                      <td data-label="Result">{r.imported ? <span className="badge success">Imported</span> : r.status === 'ok' ? <span className="badge success">Ready</span> : r.status === 'duplicate' ? <span className="badge warning">Duplicate</span> : <span className="badge danger">Error</span>}</td>
                      <td data-label="Number" className="mt-num">{r.number || <span className="muted">next number</span>}</td>
                      <td data-label="Name">{r.name}</td>
                      <td data-label="Parent">{r.parentNumber}</td>
                      <td data-label="Notes" className="small">{r.messages.join('. ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
