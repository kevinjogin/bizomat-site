// Inspection rounds (the field release; src/worker/maintenance/routes-rounds.ts): one work order of job type inspection
// over many assets, each with its own checklist. The list of rounds; making one (assets one by one, an asset and every
// asset under it, or by category and site); a round with its progress, filters and a scan to jump to an asset; one
// asset's checklist on a phone (pass and fail buttons, numbers, notes) with a supervisor's approval; and the round's
// section on its work order. The server decides who may see and do what; these screens follow its answers.
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post, put } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { useDebounced, usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { PRIORITY_LABELS, dateText, dateTimeText, minutesText, mtPage, mtPath, useSites, type InspItem, type InspResult, type MtEvent, type MtMe, type Priority, type WorkOrder } from './api';
import { AssetStatusBadge, History, Section, WoBadge, options } from './common';
import { CodeField } from './Field';
import { AssetPicker, PersonSelect, type PickedAsset } from './pickers';

// ------------------------------------------------------------------ shapes (src/worker/maintenance/routes-rounds.ts)

interface RoundRow {
  workOrderId: string;
  number: string;
  description: string;
  status: WorkOrder['status'];
  priority: Priority;
  assetNumber: string;
  assetName: string;
  templateName: string;
  assignedToName: string | null;
  dueStart: string | null;
  dueFinish: string | null;
  assets: number;
  completed: number;
  percent: number;
  exceptions: number;
  awaitingApproval: number;
  notApproved: number;
}

interface RoundTotals {
  assets: number;
  completed: number;
  open: number;
  passed: number;
  failed: number;
  percent: number;
  questions: number;
  answered: number;
  exceptions: number;
  approved: number;
  notApproved: number;
  awaitingApproval: number;
}

type Review = 'awaiting' | 'approved' | 'not_approved' | null;
type FollowUp = { kind: 'work_order' | 'request'; id: string; number: string };

interface RoundLine {
  id: string;
  position: number;
  assetId: string;
  assetNumber: string;
  assetName: string;
  assetStatus: string;
  siteCode: string | null;
  photoUrl: string | null;
  templateId: string;
  templateName: string;
  status: 'open' | 'passed' | 'failed';
  attempt: number;
  questions: number;
  answered: number;
  percent: number;
  failedItems: number;
  completedAt: number | null;
  completedByName: string | null;
  review: Review;
  reviewNote: string;
  reviewedAt: number | null;
  reviewedByName: string | null;
  followUp: FollowUp | null;
}

interface RoundView {
  round: { id: string; templateId: string; templateName: string; workOrder: WorkOrder; locked: boolean; totals: RoundTotals } | null;
  lines?: RoundLine[];
  filter?: string;
  q?: string;
  can?: { record: boolean; manage: boolean; review: boolean; timer: boolean };
}

type Next = { lineId: string; assetNumber: string; assetName: string } | null;

interface LineView {
  line: RoundLine;
  round: { id: string; workOrderId: string; number: string; description: string; status: WorkOrder['status']; locked: boolean };
  asset: { id: string; number: string; name: string; status: string; location: string; siteCode: string | null };
  items: InspItem[];
  results: (InspResult & { itemId: string })[];
  history: MtEvent[];
  next: Next;
  can: { record: boolean; complete: boolean; approve: boolean; notApprove: boolean; remove: boolean; changeChecklist: boolean };
  segregation: string | null;
}

interface Completed {
  status: 'passed' | 'failed';
  failed: number;
  followUp: FollowUp | null;
  followUpMade: boolean;
  next: Next;
  totals: RoundTotals;
}

interface TemplateRow {
  id: string;
  name: string;
  items: number;
  archived: boolean;
}

const roundsPath = (companyId: string, woId: string, path = '') => mtPath(companyId, `/work-orders/${woId}/round${path}`);
const followUpLink = (companyId: string, f: FollowUp) => mtPage(companyId, `/${f.kind === 'work_order' ? 'work-orders' : 'requests'}/${f.id}`);

function ResultBadge({ line }: { line: Pick<RoundLine, 'status' | 'failedItems'> }) {
  if (line.status === 'open') return <span className="badge accent">Open</span>;
  if (line.status === 'passed') return <span className="badge success">Passed</span>;
  return <span className="badge danger">Failed ({line.failedItems})</span>;
}

function ReviewBadge({ review }: { review: Review }) {
  if (review === 'approved') return <span className="badge success">Approved</span>;
  if (review === 'not_approved') return <span className="badge danger">Not approved</span>;
  if (review === 'awaiting') return <span className="badge warning">Awaiting approval</span>;
  return <span className="muted small">Not completed yet</span>;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// ------------------------------------------------------------------ the list

const STATUS_TABS: [string, string][] = [
  ['outstanding', 'Outstanding'],
  ['completed', 'Completed'],
  ['all', 'All'],
];

export function RoundsPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Inspection rounds');
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? 'outstanding';
  const q = params.get('q') ?? '';
  const term = useDebounced(q, 250);
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const list = useQuery({ queryKey: ['mt', companyId, 'rounds', status, term], queryFn: () => get<{ rounds: RoundRow[]; total: number }>(mtPath(companyId, `/inspection-rounds?status=${encodeURIComponent(status)}&q=${encodeURIComponent(term)}`)) });
  return (
    <div className="stack">
      <p className="muted small">An inspection round is one work order over many assets, each with its own checklist. Technicians record each asset on a phone; a supervisor or administrator approves each one.</p>
      <div className="row wrap">
        <nav className="tabs grow" aria-label="Inspection round lists">
          {STATUS_TABS.map(([v, l]) => <button key={v} className={`tab${status === v ? ' active' : ''}`} aria-current={status === v ? 'page' : undefined} onClick={() => set('status', v === 'outstanding' ? '' : v)}>{l}</button>)}
        </nav>
        {me.can.manageWork ? <Link className="btn primary" to={mtPage(companyId, '/rounds/new')}><Icon name="plus" /> New inspection round</Link> : null}
      </div>
      <div className="field">
        <label htmlFor="mtr-q">Search</label>
        <input id="mtr-q" className="input" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Work order number, words or asset" />
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.rounds.length ? (
          <EmptyState icon="target" title="No inspection rounds yet">{me.can.manageWork ? 'Make one with the checklist and the assets to inspect.' : 'Rounds given to you show here.'}</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table mt-table">
              <thead><tr><th>Work order</th><th>Status</th><th>Assets</th><th>Exceptions</th><th>Approval</th><th>Technician</th><th>Due</th></tr></thead>
              <tbody>
                {list.data.rounds.map((r) => (
                  <tr key={r.workOrderId}>
                    <td data-label="Work order" className="mt-desc"><Link className="mt-primary mt-num" to={mtPage(companyId, `/rounds/${r.workOrderId}`)}>{r.number}</Link><div className="small">{r.description}</div><div className="muted small">{r.assetNumber} {r.assetName} · {r.templateName}</div></td>
                    <td data-label="Status"><WoBadge status={r.status} /></td>
                    <td data-label="Assets"><span className="mt-num">{r.completed} of {r.assets}</span> <progress className="mt-bar" max={100} value={r.percent} aria-label={`${r.percent}% done`} /></td>
                    <td data-label="Exceptions" className="mt-num">{r.exceptions}</td>
                    <td data-label="Approval" className="small">{r.awaitingApproval} awaiting, {r.notApproved} not approved</td>
                    <td data-label="Technician">{r.assignedToName ?? <span className="muted">Not assigned</span>}</td>
                    <td data-label="Due">{dateText(r.dueFinish)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data && list.data.total > list.data.rounds.length ? <p className="muted small">Showing {list.data.rounds.length} of {list.data.total}. Search to narrow the list.</p> : null}
    </div>
  );
}

// ------------------------------------------------------------------ a new round

interface Chosen {
  assetId: string;
  number: string;
  name: string;
  templateId: string;
}

const MAX_PER_CALL = 100;

export function NewRoundPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('New inspection round');
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const templates = useQuery({ queryKey: ['mt', companyId, 'insp-templates'], queryFn: () => get<{ templates: TemplateRow[] }>(mtPath(companyId, '/inspection-templates')) });
  const sites = useSites(companyId);
  const cats = useQuery({ queryKey: ['mt', companyId, 'asset-categories'], queryFn: () => get<{ categories: string[] }>(mtPath(companyId, '/assets?limit=1')) });
  const [templateId, setTemplateId] = useState(params.get('templateId') ?? '');
  const [chosen, setChosen] = useState<Chosen[]>([]);
  const [one, setOne] = useState<PickedAsset | null>(null);
  const [top, setTop] = useState<PickedAsset | null>(null);
  const [filter, setFilter] = useState({ category: '', siteId: '' });
  const [woAsset, setWoAsset] = useState<PickedAsset | null>(null);
  const [form, setForm] = useState({ description: '', assignedTo: '', priority: 'medium' as Priority, dueStart: '', dueFinish: '', hours: '', instructions: '', safety: '' });
  const [busy, setBusy] = useState(false);
  if (!me.can.manageWork) return <p className="muted">Only maintenance supervisors and administrators make inspection rounds.</p>;
  const live = (templates.data?.templates ?? []).filter((t) => !t.archived);
  const tplName = live.find((t) => t.id === templateId)?.name ?? '';
  const add = (list: { id: string; number: string; name: string }[]) => {
    setChosen((x) => {
      const have = new Set(x.map((c) => c.assetId));
      const fresh = list.filter((a) => !have.has(a.id)).map((a) => ({ assetId: a.id, number: a.number, name: a.name, templateId: '' }));
      if (list.length && !fresh.length) toast('Those assets are already on the list');
      return [...x, ...fresh];
    });
  };
  const addTree = async (a: PickedAsset | null) => {
    setTop(a);
    if (!a) return;
    try {
      const tree = await get<{ nodes: { id: string; number: string; name: string; parentId: string | null }[] }>(mtPath(companyId, '/assets/tree'));
      const kids = new Map<string, typeof tree.nodes>();
      for (const n of tree.nodes) if (n.parentId) kids.set(n.parentId, [...(kids.get(n.parentId) ?? []), n]);
      const out: typeof tree.nodes = [];
      const walk = (id: string, depth: number) => {
        const node = tree.nodes.find((n) => n.id === id);
        if (node) out.push(node);
        if (depth < 200) for (const k of kids.get(id) ?? []) walk(k.id, depth + 1);
      };
      walk(a.id, 0);
      add(out);
      setTop(null);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const addMatching = async () => {
    try {
      const qs = new URLSearchParams({ limit: '500' });
      if (filter.category) qs.set('category', filter.category);
      if (filter.siteId) qs.set('siteId', filter.siteId);
      const r = await get<{ assets: { id: string; number: string; name: string }[] }>(mtPath(companyId, `/assets?${qs}`));
      if (!r.assets.length) toast('No asset matches');
      add(r.assets);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const f = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!templateId) return toast('Choose the checklist', 'error');
    setBusy(true);
    try {
      const r = await post<{ workOrder: WorkOrder; assets: number }>(mtPath(companyId, '/inspection-rounds'), {
        templateId,
        assets: chosen.map((c) => ({ assetId: c.assetId, ...(c.templateId ? { templateId: c.templateId } : {}) })),
        ...(woAsset ? { assetId: woAsset.id } : {}),
        ...(form.description.trim() ? { description: form.description.trim() } : {}),
        assignedTo: form.assignedTo || null,
        priority: form.priority,
        dueStart: form.dueStart || null,
        dueFinish: form.dueFinish || null,
        estimatedHours: form.hours ? Number(form.hours) : null,
        instructions: form.instructions,
        safety: form.safety,
      });
      toast(`Inspection round ${r.workOrder.number} made with ${plural(r.assets, 'asset', 'assets')}`);
      navigate(mtPage(companyId, `/rounds/${r.workOrder.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const tooMany = chosen.length > MAX_PER_CALL;
  return (
    <form className="stack" onSubmit={submit}>
      <h2 className="crm-subhead">New inspection round</h2>
      <section className="card card-pad stack">
        <div className="field">
          <label htmlFor="mtr-tpl">Checklist for the round (required)</label>
          <select id="mtr-tpl" className="select" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            <option value="">Choose a checklist</option>
            {live.map((t) => <option key={t.id} value={t.id}>{t.name} ({plural(t.items, 'item', 'items')})</option>)}
          </select>
        </div>
        {!templates.isLoading && !live.length ? <p className="muted small">No checklist yet. <Link to={mtPage(companyId, '/checklists/new')}>Make one first</Link>.</p> : null}
      </section>
      <section className="card card-pad stack">
        <h3 className="crm-subhead">Assets</h3>
        <div className="crm-form-grid">
          <AssetPicker companyId={companyId} id="mtr-one" label="Add one asset" value={one} onChange={(a) => { setOne(null); if (a) add([a]); }} />
          <AssetPicker companyId={companyId} id="mtr-tree" label="An asset and every asset under it" value={top} onChange={(a) => void addTree(a)} />
        </div>
        <div className="mt-filters" role="group" aria-label="By category and site">
          <div className="field">
            <label htmlFor="mtr-cat">Category</label>
            <select id="mtr-cat" className="select" value={filter.category} onChange={(e) => setFilter((x) => ({ ...x, category: e.target.value }))}>
              <option value="">Any</option>
              {(cats.data?.categories ?? []).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="mtr-site">Site</label>
            <select id="mtr-site" className="select" value={filter.siteId} onChange={(e) => setFilter((x) => ({ ...x, siteId: e.target.value }))}>
              <option value="">Any</option>
              {(sites.data?.sites ?? []).filter((s) => !s.archived).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}
            </select>
          </div>
          <div className="field">
            <span className="sr-only">Add</span>
            <button type="button" className="btn" disabled={!filter.category && !filter.siteId} onClick={() => void addMatching()}><Icon name="plus" /> Add the matching assets</button>
          </div>
        </div>
        {chosen.length ? (
          <div className="crm-table-scroll">
            <table className="data-table mt-table">
              <thead><tr><th>Asset</th><th>Checklist</th><th /></tr></thead>
              <tbody>
                {chosen.map((c, i) => (
                  <tr key={c.assetId}>
                    <td data-label="Asset"><strong className="mt-num">{c.number}</strong> {c.name}</td>
                    <td data-label="Checklist">
                      <label className="sr-only" htmlFor={`mtr-ct-${i}`}>Checklist of {c.number}</label>
                      <select id={`mtr-ct-${i}`} className="select" value={c.templateId} onChange={(e) => setChosen((x) => x.map((y) => (y.assetId === c.assetId ? { ...y, templateId: e.target.value } : y)))}>
                        <option value="">Round checklist{tplName ? ` (${tplName})` : ''}</option>
                        {live.filter((t) => t.id !== templateId).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </td>
                    <td><button type="button" className="btn ghost icon sm" aria-label={`Take ${c.number} off the list`} onClick={() => setChosen((x) => x.filter((y) => y.assetId !== c.assetId))}><Icon name="trash" size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="muted small">No assets chosen yet.</p>}
        <p className={`small${tooMany ? ' mt-overdue' : ' muted'}`}>{plural(chosen.length, 'asset', 'assets')} chosen. Up to {MAX_PER_CALL} now; add more on the round afterwards.</p>
      </section>
      <section className="card card-pad stack">
        <h3 className="crm-subhead">The work order</h3>
        <div className="field">
          <label htmlFor="mtr-desc">Description</label>
          <textarea id="mtr-desc" className="textarea" rows={2} maxLength={5000} value={form.description} onChange={f('description')} placeholder={`Inspection round: ${tplName || 'the checklist'}, ${plural(chosen.length, 'asset', 'assets')}`} />
        </div>
        <AssetPicker companyId={companyId} id="mtr-wo-asset" label="Work order asset (optional: left empty, the nearest asset above all of them)" value={woAsset} onChange={setWoAsset} />
        <div className="crm-form-grid">
          <PersonSelect me={me} id="mtr-tech" label="Technician" minRole="technician" value={form.assignedTo} onChange={(v) => setForm((x) => ({ ...x, assignedTo: v }))} empty="Not assigned yet" />
          <div className="field"><label htmlFor="mtr-priority">Priority</label><select id="mtr-priority" className="select" value={form.priority} onChange={f('priority')}>{options(PRIORITY_LABELS)}</select></div>
          <div className="field"><label htmlFor="mtr-start">Due start</label><input id="mtr-start" className="input" type="date" value={form.dueStart} onChange={f('dueStart')} /></div>
          <div className="field"><label htmlFor="mtr-finish">Due finish</label><input id="mtr-finish" className="input" type="date" value={form.dueFinish} onChange={f('dueFinish')} /></div>
          <div className="field"><label htmlFor="mtr-hours">Estimated hours (labour)</label><input id="mtr-hours" className="input" type="number" min="0" step="0.25" value={form.hours} onChange={f('hours')} /></div>
          <div className="field crm-span"><label htmlFor="mtr-ins">Instructions</label><textarea id="mtr-ins" className="textarea" rows={3} value={form.instructions} onChange={f('instructions')} /></div>
          <div className="field crm-span"><label htmlFor="mtr-safety">Safety requirements</label><textarea id="mtr-safety" className="textarea" rows={2} value={form.safety} onChange={f('safety')} /></div>
        </div>
      </section>
      <div className="row wrap">
        <button className="btn primary lg" disabled={busy || !templateId || !chosen.length || tooMany}>{busy ? 'Making…' : 'Make the round'}</button>
        <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </form>
  );
}

// ------------------------------------------------------------------ one round

const FILTER_TABS: [string, string][] = [
  ['all', 'All'],
  ['incomplete', 'Incomplete'],
  ['exceptions', 'Exceptions'],
  ['awaiting', 'Awaiting approval'],
  ['not_approved', 'Not approved'],
];

function ProgressLine({ t }: { t: RoundTotals }) {
  return (
    <div className="mt-round-progress">
      <progress className="mt-meter" max={100} value={t.percent} aria-label="Assets done" />
      <strong>{t.completed} of {t.assets} assets done ({t.percent}%)</strong>
    </div>
  );
}

export function RoundPage({ companyId }: { companyId: string; me: MtMe }) {
  const { workOrderId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const filter = params.get('filter') ?? 'all';
  const q = params.get('q') ?? '';
  const term = useDebounced(q, 250);
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const view = useQuery({ queryKey: ['mt', companyId, 'round', workOrderId, filter, term], queryFn: () => get<RoundView>(roundsPath(companyId, workOrderId, `?filter=${encodeURIComponent(filter)}&q=${encodeURIComponent(term)}`)), retry: false });
  const [adding, setAdding] = useState<PickedAsset[]>([]);
  const [busy, setBusy] = useState(false);
  usePageTitle(view.data?.round ? `Round ${view.data.round.workOrder.number}` : 'Inspection round');
  if (view.error) return <ErrorBox error={view.error} retry={() => view.refetch()} />;
  if (!view.data) return <Loading />;
  const r = view.data.round;
  if (!r) return <p className="muted">This work order is not an inspection round. <Link to={mtPage(companyId, `/work-orders/${workOrderId}`)}>Open the work order</Link>.</p>;
  const w = r.workOrder;
  const t = r.totals;
  const can = view.data.can!;
  const lines = view.data.lines ?? [];
  const refresh = () => qc.invalidateQueries({ queryKey: ['mt', companyId] });
  const run = async (fn: () => Promise<unknown>, done?: string) => {
    setBusy(true);
    try {
      await fn();
      if (done) toast(done);
      await refresh();
      return true;
    } catch (err) {
      toast(errorMessage(err), 'error');
      return false;
    } finally {
      setBusy(false);
    }
  };
  const openAsset = async (assetId: string, number: string) => {
    const all = await qc.fetchQuery({ queryKey: ['mt', companyId, 'round', workOrderId, 'all', ''], queryFn: () => get<RoundView>(roundsPath(companyId, workOrderId, '?filter=all&q=')) });
    const line = (all.lines ?? []).find((l) => l.assetId === assetId);
    if (line) navigate(mtPage(companyId, `/rounds/${workOrderId}/lines/${line.id}`));
    else toast(`${number} is not on this round`, 'error');
  };
  const addAssets = () =>
    run(async () => {
      const res = await post<{ added: number; skipped: { number: string }[]; assets: number }>(roundsPath(companyId, workOrderId, '/assets'), { assets: adding.map((a) => ({ assetId: a.id })) });
      toast(`${plural(res.added, 'asset', 'assets')} added${res.skipped.length ? `; already on the round: ${res.skipped.map((s) => s.number).join(', ')}` : ''}`);
      setAdding([]);
    });
  return (
    <div className="stack">
      <section className="card card-pad stack" aria-label="The round">
        <div className="row wrap">
          <div className="grow">
            <h2 className="mt-title"><Link to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link></h2>
            <p className="mt-pre">{w.description}</p>
            <p className="muted small">{r.templateName} · {w.assetNumber} {w.assetName} · {w.assignedToName ?? 'Not assigned'}{w.dueFinish ? ` · due ${dateText(w.dueFinish)}` : ''}</p>
          </div>
          <WoBadge status={w.status} />
        </div>
        <ProgressLine t={t} />
        <p className="small">{plural(t.exceptions, 'exception', 'exceptions')}, {t.awaitingApproval} awaiting approval, {t.notApproved} not approved. Time on this job: {minutesText(w.actualMinutes ?? 0) || '0 min'}.</p>
        {can.timer ? (
          <div className="mt-big-actions">
            {w.timerRunning ? (
              <button className="btn danger" disabled={busy} onClick={() => void run(() => post(mtPath(companyId, `/work-orders/${w.id}/timer/stop`), {}), 'Time recorded')}><Icon name="stop" /> Stop my timer</button>
            ) : (
              <button className="btn primary" disabled={busy} onClick={() => void run(() => post(mtPath(companyId, `/work-orders/${w.id}/timer/start`), {}), 'Timer started')}><Icon name="play" /> Start my timer</button>
            )}
          </div>
        ) : null}
        {r.locked ? <p className="warn-box small">{w.number} is locked: its checklists cannot change until a supervisor or administrator reopens it.</p> : null}
      </section>
      <nav className="tabs" aria-label="Which assets">
        {FILTER_TABS.map(([v, l]) => <button key={v} className={`tab${filter === v ? ' active' : ''}`} aria-current={filter === v ? 'page' : undefined} onClick={() => set('filter', v === 'all' ? '' : v)}>{l}</button>)}
      </nav>
      <p className="muted small">Exceptions are assets with a failed item. Approval is a supervisor’s check of each asset’s record.</p>
      <div className="crm-form-grid">
        <div className="field">
          <label htmlFor="mtr-search">Search the assets</label>
          <input id="mtr-search" className="input" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Asset number or name" />
        </div>
        <CodeField companyId={companyId} onFound={(s) => void openAsset(s.asset.id, s.asset.number)} />
      </div>
      <div className="card crm-table-card">
        {!lines.length ? (
          <EmptyState icon="target" title="No assets here">Try another tab or clear the search.</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table mt-table">
              <thead><tr><th>Asset</th><th>Checklist</th><th>Questions</th><th>Progress</th><th>Result</th><th>Approval</th><th>Follow-up</th><th /></tr></thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id}>
                    <td data-label="Asset">
                      <div className="mt-round-asset">
                        {l.photoUrl ? <img className="mt-round-photo" src={appUrl(l.photoUrl)} alt="" loading="lazy" /> : null}
                        <span><Link className="mt-primary mt-num" to={mtPage(companyId, `/rounds/${workOrderId}/lines/${l.id}`)}>{l.assetNumber}</Link> {l.assetName}{l.siteCode ? <span className="muted small"> · {l.siteCode}</span> : null}</span>
                      </div>
                    </td>
                    <td data-label="Checklist">{l.templateName}</td>
                    <td data-label="Questions" className="mt-num">{l.answered} of {l.questions}</td>
                    <td data-label="Progress"><progress className="mt-bar" max={100} value={l.percent} aria-label={`${l.percent}% recorded`} /></td>
                    <td data-label="Result"><ResultBadge line={l} /></td>
                    <td data-label="Approval"><ReviewBadge review={l.review} />{l.review === 'not_approved' && l.reviewNote ? <div className="muted small">{l.reviewNote}</div> : null}</td>
                    <td data-label="Follow-up">{l.followUp ? <Link to={followUpLink(companyId, l.followUp)}>{l.followUp.number}</Link> : null}</td>
                    <td>
                      <span className="row">
                        <Link className="btn sm" to={mtPage(companyId, `/rounds/${workOrderId}/lines/${l.id}`)}>Open</Link>
                        {can.manage && l.status === 'open' && l.answered === 0 ? <button className="btn ghost icon sm" disabled={busy} aria-label={`Take ${l.assetNumber} off the round`} onClick={() => void run(() => del(roundsPath(companyId, workOrderId, `/lines/${l.id}`)), `${l.assetNumber} taken off the round`)}><Icon name="trash" size={14} /></button> : null}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {can.manage ? (
        <Section title="Add assets">
          <AssetPicker companyId={companyId} id="mtr-add" label="Asset to add" value={null} onChange={(a) => { if (a && !adding.some((x) => x.id === a.id)) setAdding((x) => [...x, a]); }} />
          {adding.length ? (
            <ul className="mt-docs">
              {adding.map((a) => (
                <li key={a.id} className="row">
                  <span className="grow"><strong className="mt-num">{a.number}</strong> {a.name}</span>
                  <button type="button" className="btn ghost icon sm" aria-label={`Take ${a.number} off the list`} onClick={() => setAdding((x) => x.filter((y) => y.id !== a.id))}><Icon name="x" size={14} /></button>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="row"><button className="btn" disabled={busy || !adding.length || adding.length > MAX_PER_CALL} onClick={() => void addAssets()}><Icon name="plus" /> Add {plural(adding.length, 'asset', 'assets')} to the round</button></div>
          <p className="muted small">A round holds up to 300 assets. Each takes the round’s checklist; change it on the asset’s page before anything is recorded.</p>
        </Section>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ one asset of a round (a phone screen)

interface Answer {
  passed?: boolean;
  value?: string;
  text?: string;
  note?: string;
}

export function RoundLinePage({ companyId, me }: { companyId: string; me: MtMe }) {
  const { workOrderId = '', lineId = '' } = useParams();
  // A new asset is a new screen: nothing typed for one asset carries over to the next.
  return <LineScreen key={lineId} companyId={companyId} me={me} workOrderId={workOrderId} lineId={lineId} />;
}

function LineScreen({ companyId, workOrderId, lineId }: { companyId: string; me: MtMe; workOrderId: string; lineId: string }) {
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['mt', companyId, 'round', workOrderId, 'line', lineId], queryFn: () => get<LineView>(roundsPath(companyId, workOrderId, `/lines/${lineId}`)), retry: false });
  const templates = useQuery({ queryKey: ['mt', companyId, 'insp-templates'], queryFn: () => get<{ templates: TemplateRow[] }>(mtPath(companyId, '/inspection-templates')), enabled: !!q.data?.can.changeChecklist });
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [done, setDone] = useState<Completed | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  usePageTitle(q.data ? `${q.data.asset.number} on ${q.data.round.number}` : 'Round asset');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { line, asset, items, results, can, round } = q.data;
  const recorded = new Map(results.map((r) => [r.itemId, r]));
  const back = mtPage(companyId, `/rounds/${workOrderId}`);
  const refresh = () => qc.invalidateQueries({ queryKey: ['mt', companyId] });
  const set = (id: string, a: Answer) => setAnswers((x) => ({ ...x, [id]: { ...x[id], ...a } }));
  // What shows in a field: what was typed here, else what is recorded.
  const shown = (i: InspItem): Answer => {
    const r = recorded.get(i.id);
    const base: Answer = r ? { passed: r.passed ?? undefined, value: r.value != null ? String(r.value) : '', text: r.text, note: r.note } : {};
    return { ...base, ...answers[i.id] };
  };
  const has = (i: InspItem) => {
    const a = shown(i);
    return i.kind === 'pass_fail' ? a.passed !== undefined : i.kind === 'number' ? (a.value ?? '').trim() !== '' : !!(a.text ?? '').trim();
  };
  const changed = () =>
    Object.entries(answers)
      .map(([itemId, a]) => {
        const item = items.find((x) => x.id === itemId);
        if (!item) return null;
        const s = shown(item);
        if (item.kind === 'pass_fail') return s.passed === undefined ? null : { itemId, passed: s.passed, note: s.note ?? '' };
        if (item.kind === 'number') return (s.value ?? '').trim() === '' ? null : { itemId, value: Number(s.value), note: s.note ?? '' };
        return { itemId, text: a.text ?? s.text ?? '', note: s.note ?? '' };
      })
      .filter(Boolean);
  // The asset is read again whatever the outcome, so the screen shows what the server holds (an answer saved before a
  // step that failed, an item a supervisor added).
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      await refresh();
      setBusy(false);
    }
  };
  const save = () =>
    run(async () => {
      const list = changed();
      if (!list.length) return;
      await put(roundsPath(companyId, workOrderId, `/lines/${lineId}/results`), { results: list });
      setAnswers({});
      toast('Saved');
    });
  const complete = () =>
    run(async () => {
      const list = changed();
      if (list.length) await put(roundsPath(companyId, workOrderId, `/lines/${lineId}/results`), { results: list });
      // The answers stay on screen until the asset is completed: when completing fails, they are still shown.
      const r = await post<Completed>(roundsPath(companyId, workOrderId, `/lines/${lineId}/complete`), {});
      setAnswers({});
      setDone(r);
    });
  const decide = (decision: 'approved' | 'not_approved') =>
    run(async () => {
      await post(roundsPath(companyId, workOrderId, `/lines/${lineId}/decide`), { decision, ...(reason.trim() ? { note: reason.trim() } : {}) });
      setReason('');
      toast(decision === 'approved' ? `${asset.number} approved` : `${asset.number} is open again for its checklist to be done again`);
    });
  const missing = items.filter((i) => i.required && !has(i));
  const header = (
    <section className="card card-pad stack">
      <div className="row wrap">
        <h2 className="crm-subhead grow">{asset.number} {asset.name}</h2>
        <AssetStatusBadge value={asset.status} />
      </div>
      <p className="muted small">{[asset.location, asset.siteCode].filter(Boolean).join(' · ')}{asset.location || asset.siteCode ? ' · ' : ''}Round <Link to={back}>{round.number}</Link></p>
      <p className="small"><strong>{line.templateName}</strong> · <ResultBadge line={line} /> <ReviewBadge review={line.review} /></p>
    </section>
  );
  if (done) {
    return (
      <div className="stack mt-phone">
        {header}
        <section className={`card card-pad stack mt-result ${done.status}`} aria-live="polite">
          <h2 className="crm-subhead">{done.status === 'failed' ? `Failed: ${plural(done.failed, 'item', 'items')}` : 'Passed: every item'}</h2>
          {done.followUp ? <p>Follow-up: <Link to={followUpLink(companyId, done.followUp)}>{done.followUp.kind === 'work_order' ? 'work order' : 'request'} {done.followUp.number}</Link>{done.followUpMade ? ' was made for the failure.' : ' (made earlier).'}</p> : null}
          <ProgressLine t={done.totals} />
          <div className="mt-big-actions">
            {done.next ? <Link className="btn primary" to={mtPage(companyId, `/rounds/${workOrderId}/lines/${done.next.lineId}`)}><Icon name="chevronRight" /> Next asset: {done.next.assetNumber}</Link> : null}
            <Link className="btn" to={back}>Back to the round</Link>
          </div>
        </section>
      </div>
    );
  }
  const open = line.status === 'open';
  return (
    <div className="stack mt-phone">
      {header}
      {line.review === 'not_approved' && open ? <p className="warn-box">Not approved: {line.reviewNote}. Record it again and complete it.</p> : null}
      {can.changeChecklist ? (
        <ChecklistChange companyId={companyId} workOrderId={workOrderId} lineId={lineId} current={line.templateId} templates={(templates.data?.templates ?? []).filter((x) => !x.archived)} onDone={refresh} />
      ) : null}
      {open ? (
        <ol className="mt-check">
          {items.map((i, n) => {
            const a = shown(i);
            const editable = can.record;
            return (
              <li key={i.id} className={`card card-pad mt-check-item${a.passed === false ? ' failed' : a.passed ? ' passed' : ''}`}>
                <div className="mt-check-label">
                  <span className="mt-num muted">{n + 1}.</span> {i.label}
                  {i.critical ? <span className="badge danger">Critical</span> : null}
                  {!i.required ? <span className="muted small"> (optional)</span> : null}
                </div>
                {i.kind === 'pass_fail' ? (
                  <div className="mt-passfail" role="group" aria-label={i.label}>
                    <button type="button" disabled={!editable} className={`btn${a.passed === true ? ' primary' : ''}`} aria-pressed={a.passed === true} onClick={() => set(i.id, { passed: true })}><Icon name="check" /> Pass</button>
                    <button type="button" disabled={!editable} className={`btn${a.passed === false ? ' danger' : ''}`} aria-pressed={a.passed === false} onClick={() => set(i.id, { passed: false })}><Icon name="x" /> Fail</button>
                  </div>
                ) : i.kind === 'number' ? (
                  <div className="field">
                    <label htmlFor={`rl-${i.id}`}><span className="sr-only">{i.label}: </span>{i.unit ? `Value (${i.unit})` : 'Value'}{i.min != null || i.max != null ? `, ${i.min ?? '…'} to ${i.max ?? '…'}` : ''}</label>
                    <input id={`rl-${i.id}`} className="input" type="number" inputMode="decimal" step="any" disabled={!editable} value={a.value ?? ''} onChange={(e) => set(i.id, { value: e.target.value })} />
                  </div>
                ) : (
                  <div className="field">
                    <label htmlFor={`rl-${i.id}`}><span className="sr-only">{i.label}: </span>Notes</label>
                    <input id={`rl-${i.id}`} className="input" maxLength={2000} disabled={!editable} value={a.text ?? ''} onChange={(e) => set(i.id, { text: e.target.value })} />
                  </div>
                )}
                {a.passed === false || (i.kind === 'number' && a.value && ((i.min != null && Number(a.value) < i.min) || (i.max != null && Number(a.value) > i.max))) ? (
                  <div className="field">
                    <label htmlFor={`rl-n-${i.id}`}>What is wrong<span className="sr-only"> with {i.label}</span>?</label>
                    <input id={`rl-n-${i.id}`} className="input" maxLength={1000} disabled={!editable} value={a.note ?? ''} onChange={(e) => set(i.id, { note: e.target.value })} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : (
        <Section title="Recorded">
          <ol className="mt-insp-items">
            {results.map((r) => (
              <li key={r.id} className={r.passed === false ? 'failed' : ''}>
                <div className="row wrap">
                  <span className="grow">{r.label}{r.critical ? <span className="badge danger"> Critical</span> : null}</span>
                  <span className="small">{r.kind === 'pass_fail' ? (r.passed ? 'Pass' : 'Fail') : r.kind === 'number' ? `${r.value}${r.unit ? ` ${r.unit}` : ''}${r.passed === false ? ' (outside the limits)' : ''}` : r.text}</span>
                </div>
                {r.note ? <div className="muted small">{r.note}</div> : null}
              </li>
            ))}
          </ol>
          {!results.length ? <p className="muted small">Nothing was recorded (every item is optional).</p> : null}
          <p className="muted small">Completed {dateTimeText(line.completedAt)}{line.completedByName ? ` by ${line.completedByName}` : ''}.{line.followUp ? ' ' : ''}{line.followUp ? <>Follow-up: <Link to={followUpLink(companyId, line.followUp)}>{line.followUp.number}</Link>.</> : null}</p>
        </Section>
      )}
      {open && can.record ? (
        <section className="card card-pad stack">
          {missing.length ? <p className="muted small">Still to record: {missing.map((m) => m.label).join(', ')}.</p> : null}
          <div className="mt-big-actions">
            <button className="btn" disabled={busy || !Object.keys(answers).length} onClick={() => void save()}>Save</button>
            <button className="btn primary" disabled={busy || missing.length > 0 || !can.complete} onClick={() => void complete()}><Icon name="check" /> Complete this asset</button>
          </div>
        </section>
      ) : null}
      {!open && (can.approve || can.notApprove) ? (
        <Section title="Approval">
          {line.review === 'approved' ? <p className="small">Approved{line.reviewedByName ? ` by ${line.reviewedByName}` : ''}{line.reviewedAt ? `, ${dateTimeText(line.reviewedAt)}` : ''}.{line.reviewNote ? ` ${line.reviewNote}` : ''}</p> : null}
          {q.data.segregation ? <p className="warn-box small">{q.data.segregation}</p> : (
            <>
              <div className="field">
                <label htmlFor="rl-reason">Reason (needed for Not approved)</label>
                <textarea id="rl-reason" className="textarea" rows={2} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
              <div className="mt-big-actions">
                {can.approve ? <button className="btn primary" disabled={busy} onClick={() => void decide('approved')}><Icon name="check" /> Approve</button> : null}
                {can.notApprove ? <button className="btn danger" disabled={busy || !reason.trim()} onClick={() => void decide('not_approved')}><Icon name="x" /> Not approved</button> : null}
              </div>
              {!can.notApprove ? <p className="muted small">{round.number} is locked. To have this checklist done again, reopen the work order first.</p> : null}
            </>
          )}
        </Section>
      ) : null}
      {!open && line.review === 'approved' && !can.approve && !can.notApprove ? <p className="small">Approved{line.reviewedByName ? ` by ${line.reviewedByName}` : ''}.</p> : null}
      <div className="row wrap">
        <Link className="btn" to={back}>Back to the round</Link>
        {q.data.next ? <Link className="btn" to={mtPage(companyId, `/rounds/${workOrderId}/lines/${q.data.next.lineId}`)}>Next open asset: {q.data.next.assetNumber}</Link> : null}
      </div>
      <Section title="History">
        <History events={q.data.history} />
      </Section>
    </div>
  );
}

/** A supervisor gives an asset of the round another checklist while nothing is recorded for it. */
function ChecklistChange({ companyId, workOrderId, lineId, current, templates, onDone }: { companyId: string; workOrderId: string; lineId: string; current: string; templates: TemplateRow[]; onDone: () => Promise<void> }) {
  const toast = useToast();
  const [value, setValue] = useState(current);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await patch(roundsPath(companyId, workOrderId, `/lines/${lineId}`), { templateId: value });
      toast('Checklist changed');
      await onDone();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mt-add-line">
      <label className="sr-only" htmlFor="rl-tpl">Checklist of this asset</label>
      <select id="rl-tpl" className="select" value={value} onChange={(e) => setValue(e.target.value)}>
        {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <button className="btn" disabled={busy || value === current} onClick={() => void save()}>Change the checklist</button>
    </div>
  );
}


// ------------------------------------------------------------------ the round on its work order

export function RoundSection({ companyId, woId }: { companyId: string; woId: string }) {
  const q = useQuery({ queryKey: ['mt', companyId, 'round', woId, 'summary'], queryFn: () => get<RoundView>(roundsPath(companyId, woId, '?summary=1')), retry: false });
  const r = q.data?.round;
  if (!r) return null;
  const t = r.totals;
  return (
    <Section title="Inspection round" actions={<Link className="btn sm" to={mtPage(companyId, `/rounds/${woId}`)}>Open the round</Link>}>
      <ProgressLine t={t} />
      <p className="small">{plural(t.exceptions, 'exception', 'exceptions')}, {t.awaitingApproval} awaiting approval{t.notApproved ? `, ${t.notApproved} not approved` : ''}.</p>
      {t.open ? <p className="muted small">Every asset’s checklist must be completed before the work order can be completed.</p> : null}
    </Section>
  );
}
