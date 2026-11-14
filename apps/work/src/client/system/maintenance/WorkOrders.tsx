// Work orders: the list (My work, outstanding, overdue, all; filters and sort), a new work order, and the work order
// itself: header, asset, the time with a start/stop timer, instructions and safety, tasks, parts lines, notes, photos and
// documents, history, and completing or reopening it. A completed work order is locked by the server.
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import {
  JOB_TYPE_LABELS,
  PRIORITY_LABELS,
  WO_STATUS_LABELS,
  dateText,
  dateTimeText,
  localToday,
  minutesText,
  mtPage,
  mtPath,
  type MtComment,
  type MtEvent,
  type MtFile,
  type MtMe,
  type MtRequest,
  type Priority,
  type WorkOrder,
} from './api';
import { Comments, FileList, FilterPanel, History, PriorityBadge, Props, RequestBadge, Section, UploadButton, WoBadge, options } from './common';
import { AssetPicker, DepartmentField, PersonSelect, useAssetLabel, type PickedAsset } from './pickers';
import { ReasonDialog } from './Requests';

const OUTSTANDING = ['open', 'assigned', 'in_progress', 'on_hold'];

// ------------------------------------------------------------------ list

type View = 'mine' | 'outstanding' | 'overdue' | 'all';
const SORTS: Record<string, string> = { due: 'Due date', finish: 'Finish date', number: 'Number', priority: 'Priority', asset: 'Asset number', jobType: 'Job type' };

export function WorkOrdersPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Work orders');
  const [params, setParams] = useSearchParams();
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const manager = me.can.manageWork;
  const view = (params.get('view') as View) ?? (me.role === 'technician' ? 'mine' : 'outstanding');
  const g = (k: string) => params.get(k) ?? '';
  const assetLabel = useAssetLabel(companyId, g('assetId'));
  const query = new URLSearchParams({ today: localToday() });
  if (view === 'mine') query.set('mine', '1');
  if (view === 'mine' || view === 'outstanding') query.set('status', g('status') || 'outstanding');
  else if (view === 'overdue') query.set('status', 'overdue');
  else if (g('status')) query.set('status', g('status'));
  for (const k of ['priority', 'jobType', 'trade', 'assetId', 'dueFrom', 'dueTo', 'q', 'sort', 'dir']) if (g(k)) query.set(k, g(k));
  if (g('assetId') && g('includeChildren') === '1') query.set('includeChildren', '1');
  const list = useQuery({ queryKey: ['mt', companyId, 'work-orders', query.toString()], queryFn: () => get<{ workOrders: WorkOrder[]; total: number; trades: string[]; today: string }>(mtPath(companyId, `/work-orders?${query}`)) });
  const views: [View, string][] = [['mine', 'My work'], ['outstanding', 'Outstanding'], ['overdue', 'Overdue'], ['all', 'All']];
  const today = list.data?.today ?? localToday();
  return (
    <div className="stack">
      <div className="row wrap">
        <nav className="tabs grow" aria-label="Work order lists">
          {views.map(([v, l]) => <button key={v} className={`tab${view === v ? ' active' : ''}`} aria-current={view === v ? 'page' : undefined} onClick={() => set('view', v)}>{l}</button>)}
        </nav>
        {manager ? <Link className="btn primary" to={mtPage(companyId, '/work-orders/new')}><Icon name="plus" /> New work order</Link> : null}
      </div>
      <FilterPanel active={['status', 'priority', 'jobType', 'trade', 'dueFrom', 'dueTo', 'q', 'assetId'].filter((k) => g(k)).length}>
        <div className="field">
          <label htmlFor="mtw-q">Search</label>
          <input id="mtw-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Number, words or asset" />
        </div>
        {view === 'all' || view === 'mine' || view === 'outstanding' ? (
          <div className="field">
            <label htmlFor="mtw-status">Status</label>
            <select id="mtw-status" className="select" value={g('status')} onChange={(e) => set('status', e.target.value)}>
              <option value="">{view === 'all' ? 'Any' : 'Outstanding'}</option>
              {options(view === 'all' ? WO_STATUS_LABELS : Object.fromEntries(OUTSTANDING.map((s) => [s, WO_STATUS_LABELS[s as keyof typeof WO_STATUS_LABELS]])))}
            </select>
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="mtw-priority">Priority</label>
          <select id="mtw-priority" className="select" value={g('priority')} onChange={(e) => set('priority', e.target.value)}><option value="">Any</option>{options(PRIORITY_LABELS)}</select>
        </div>
        <div className="field">
          <label htmlFor="mtw-type">Job type</label>
          <select id="mtw-type" className="select" value={g('jobType')} onChange={(e) => set('jobType', e.target.value)}><option value="">Any</option>{options(JOB_TYPE_LABELS)}</select>
        </div>
        <div className="field">
          <label htmlFor="mtw-trade">Trade</label>
          <select id="mtw-trade" className="select" value={g('trade')} onChange={(e) => set('trade', e.target.value)}>
            <option value="">Any</option>
            {(list.data?.trades ?? []).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mtw-from">Due from</label>
          <input id="mtw-from" className="input" type="date" value={g('dueFrom')} onChange={(e) => set('dueFrom', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="mtw-to">Due to</label>
          <input id="mtw-to" className="input" type="date" value={g('dueTo')} onChange={(e) => set('dueTo', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="mtw-sort">Sort by</label>
          <select id="mtw-sort" className="select" value={g('sort') || 'due'} onChange={(e) => set('sort', e.target.value)}>{options(SORTS)}</select>
        </div>
        <div className="field">
          <label htmlFor="mtw-dir">Order</label>
          <select id="mtw-dir" className="select" value={g('dir') || 'asc'} onChange={(e) => set('dir', e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="crm-span">
          <AssetPicker companyId={companyId} id="mtw-asset" label="Asset" value={assetLabel} onChange={(a) => set('assetId', a?.id ?? '')} />
          {g('assetId') ? (
            <label className="checkbox">
              <input type="checkbox" checked={g('includeChildren') === '1'} onChange={(e) => set('includeChildren', e.target.checked ? '1' : '')} /> Include child assets
            </label>
          ) : null}
        </div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.workOrders.length ? (
          <EmptyState icon="wrench" title="No work orders here">{view === 'mine' ? 'Nothing is assigned to you right now.' : 'Try another list or remove a filter.'}</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table mt-table">
              <thead><tr><th>Number</th><th>Description</th><th>Asset</th><th>Job type</th><th>Priority</th><th>Status</th><th>Technician</th><th>Due finish</th><th>Completed</th></tr></thead>
              <tbody>
                {list.data.workOrders.map((w) => {
                  const overdue = OUTSTANDING.includes(w.status) && !!w.dueFinish && w.dueFinish < today;
                  return (
                    <tr key={w.id}>
                      <td data-label="Number"><Link className="mt-primary mt-num" to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link>{w.timerRunning ? <div><span className="badge warning"><Icon name="clock" size={12} /> Timer on</span></div> : null}</td>
                      <td data-label="Description" className="mt-desc">{w.description.length > 120 ? `${w.description.slice(0, 120)}…` : w.description}</td>
                      <td data-label="Asset"><Link to={mtPage(companyId, `/assets/${w.assetId}`)}>{w.assetNumber}</Link> <span className="small">{w.assetName}</span></td>
                      <td data-label="Job type">{JOB_TYPE_LABELS[w.jobType] ?? w.jobType}</td>
                      <td data-label="Priority"><PriorityBadge priority={w.priority} /></td>
                      <td data-label="Status"><WoBadge status={w.status} /></td>
                      <td data-label="Technician">{w.assignedToName ?? <span className="muted">Not assigned</span>}</td>
                      <td data-label="Due finish" className={overdue ? 'mt-overdue' : ''}>{dateText(w.dueFinish)}{overdue ? ' (overdue)' : ''}</td>
                      <td data-label="Completed" className="small">{w.completedAt ? dateTimeText(w.completedAt) : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data && list.data.total > list.data.workOrders.length ? <p className="muted small">Showing {list.data.workOrders.length} of {list.data.total}. Narrow the filters to see the rest.</p> : null}
    </div>
  );
}

// ------------------------------------------------------------------ new work order

export function NewWorkOrderPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('New work order');
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const preset = useAssetLabel(companyId, params.get('assetId') ?? '');
  const [asset, setAsset] = useState<PickedAsset | null>(null);
  const [form, setForm] = useState({ description: '', jobType: 'corrective', priority: 'medium' as Priority, trade: '', assignedTo: '', contractor: '', dueStart: '', dueFinish: '', hours: '', instructions: '', safety: '', projectRef: '', customerRef: '' });
  const [dept, setDept] = useState({ departmentId: '', department: '' });
  const [tasks, setTasks] = useState<string[]>(['']);
  const [parts, setParts] = useState<{ part: string; quantity: string }[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (preset && preset.number !== '…' && !asset) setAsset(preset);
  }, [preset, asset]);
  if (!me.can.manageWork) return <p className="muted">Only supervisors and administrators make work orders. Report a fault instead, and a supervisor will make one.</p>;
  const f = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!asset) return toast('Choose the asset', 'error');
    setBusy(true);
    try {
      const w = await post<WorkOrder>(mtPath(companyId, '/work-orders'), {
        assetId: asset.id,
        description: form.description,
        jobType: form.jobType,
        priority: form.priority,
        trade: form.trade,
        assignedTo: form.assignedTo || null,
        contractor: form.contractor,
        dueStart: form.dueStart || null,
        dueFinish: form.dueFinish || null,
        estimatedHours: form.hours ? Number(form.hours) : null,
        instructions: form.instructions,
        safety: form.safety,
        projectRef: form.projectRef,
        customerRef: form.customerRef,
        department: dept.department,
        departmentId: dept.departmentId || null,
        tasks: tasks.map((t) => t.trim()).filter(Boolean),
        parts: parts.filter((p) => p.part.trim() && Number(p.quantity) > 0).map((p) => ({ part: p.part.trim(), quantity: Number(p.quantity) })),
      });
      toast(`Work order ${w.number} made`);
      navigate(mtPage(companyId, `/work-orders/${w.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="stack" onSubmit={submit}>
      <h2 className="crm-subhead">New work order</h2>
      <section className="card card-pad stack">
        <AssetPicker companyId={companyId} id="mtn-asset" label="Asset (required)" value={asset} onChange={setAsset} allowNone={false} />
        <div className="field">
          <label htmlFor="mtn-desc">Description (required)</label>
          <textarea id="mtn-desc" className="textarea" rows={3} required maxLength={5000} value={form.description} onChange={f('description')} />
        </div>
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="mtn-type">Job type</label><select id="mtn-type" className="select" value={form.jobType} onChange={f('jobType')}>{options(JOB_TYPE_LABELS)}</select></div>
          <div className="field"><label htmlFor="mtn-priority">Priority</label><select id="mtn-priority" className="select" value={form.priority} onChange={f('priority')}>{options(PRIORITY_LABELS)}</select></div>
          <PersonSelect me={me} id="mtn-tech" label="Technician" minRole="technician" value={form.assignedTo} onChange={(v) => setForm((x) => ({ ...x, assignedTo: v }))} empty="Not assigned yet" />
          <div className="field"><label htmlFor="mtn-trade">Trade</label><input id="mtn-trade" className="input" maxLength={80} value={form.trade} onChange={f('trade')} placeholder="For example: Fitter, Electrician" /></div>
          <div className="field"><label htmlFor="mtn-contractor">Contractor</label><input id="mtn-contractor" className="input" maxLength={200} value={form.contractor} onChange={f('contractor')} /></div>
          <DepartmentField me={me} id="mtn-dept" departmentId={dept.departmentId} department={dept.department} onChange={setDept} />
          <div className="field"><label htmlFor="mtn-start">Due start</label><input id="mtn-start" className="input" type="date" value={form.dueStart} onChange={f('dueStart')} /></div>
          <div className="field"><label htmlFor="mtn-finish">Due finish</label><input id="mtn-finish" className="input" type="date" value={form.dueFinish} onChange={f('dueFinish')} /></div>
          <div className="field"><label htmlFor="mtn-hours">Estimated hours (labour)</label><input id="mtn-hours" className="input" type="number" min="0" step="0.25" value={form.hours} onChange={f('hours')} /></div>
          <div className="field"><label htmlFor="mtn-project">Project reference</label><input id="mtn-project" className="input" maxLength={120} value={form.projectRef} onChange={f('projectRef')} /></div>
          <div className="field"><label htmlFor="mtn-customer">Customer reference</label><input id="mtn-customer" className="input" maxLength={120} value={form.customerRef} onChange={f('customerRef')} /></div>
          <div className="field crm-span"><label htmlFor="mtn-ins">Instructions</label><textarea id="mtn-ins" className="textarea" rows={4} value={form.instructions} onChange={f('instructions')} /></div>
          <div className="field crm-span"><label htmlFor="mtn-safety">Safety requirements</label><textarea id="mtn-safety" className="textarea" rows={3} value={form.safety} onChange={f('safety')} placeholder="For example: isolate and lock out, release stored pressure, PPE" /></div>
        </div>
      </section>
      <section className="card card-pad stack">
        <h3 className="crm-subhead">Tasks</h3>
        <div className="mt-lines">
          {tasks.map((t, i) => (
            <div key={i} className="mt-spec-line">
              <label className="sr-only" htmlFor={`mtn-task-${i}`}>Task {i + 1}</label>
              <input id={`mtn-task-${i}`} className="input crm-span-2" maxLength={500} value={t} placeholder={`Task ${i + 1}`} onChange={(e) => setTasks((x) => x.map((y, j) => (j === i ? e.target.value : y)))} />
              <button type="button" className="btn ghost icon" aria-label={`Remove task ${i + 1}`} onClick={() => setTasks((x) => x.filter((_, j) => j !== i))}><Icon name="x" /></button>
            </div>
          ))}
        </div>
        <div className="row"><button type="button" className="btn sm" onClick={() => setTasks((x) => [...x, ''])}><Icon name="plus" size={14} /> Add a task</button></div>
      </section>
      <section className="card card-pad stack">
        <h3 className="crm-subhead">Required parts</h3>
        <p className="muted small">Write each part and the quantity. Issuing parts from stores comes in a later stage.</p>
        <div className="mt-lines">
          {parts.map((p, i) => (
            <div key={i} className="mt-line">
              <input className="input" aria-label={`Part ${i + 1}`} maxLength={200} value={p.part} placeholder="Part" onChange={(e) => setParts((x) => x.map((y, j) => (j === i ? { ...y, part: e.target.value } : y)))} />
              <input className="input" aria-label={`Quantity of part ${i + 1}`} type="number" min="0" step="any" value={p.quantity} onChange={(e) => setParts((x) => x.map((y, j) => (j === i ? { ...y, quantity: e.target.value } : y)))} />
              <button type="button" className="btn ghost icon" aria-label={`Remove part ${i + 1}`} onClick={() => setParts((x) => x.filter((_, j) => j !== i))}><Icon name="x" /></button>
            </div>
          ))}
        </div>
        <div className="row"><button type="button" className="btn sm" onClick={() => setParts((x) => [...x, { part: '', quantity: '1' }])}><Icon name="plus" size={14} /> Add a part</button></div>
      </section>
      <div className="row wrap">
        <button className="btn primary lg" disabled={busy || !form.description.trim() || !asset}>{busy ? 'Making…' : 'Make the work order'}</button>
        <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </form>
  );
}

// ------------------------------------------------------------------ detail

interface WoView {
  workOrder: WorkOrder;
  assetPath: { id: string; number: string; name: string }[];
  otherOutstandingOnAsset: number | null;
  requests: MtRequest[];
  tasks: { id: string; text: string; done: boolean; doneAt: number | null; doneByName: string | null }[];
  parts: { id: string; part: string; quantity: number }[];
  labour: { id: string; userId: string | null; userName: string | null; startedAt: number; endedAt: number | null; minutes: number | null; running: boolean }[];
  totals: { actualMinutes: number; estimatedMinutes: number | null; running: { userId: string; userName: string | null; startedAt: number }[]; myTimer: { startedAt: number } | null };
  comments: MtComment[];
  files: MtFile[];
  history: MtEvent[];
  locked: boolean;
  can: { edit: boolean; work: boolean; complete: boolean; reopen: boolean; close: boolean; cancel: boolean };
}

function useTick(on: boolean) {
  const [, set] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => set((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [on]);
}

const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function WorkOrderDetail({ companyId, me }: { companyId: string; me: MtMe }) {
  const { workOrderId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['mt', companyId, 'work-order', workOrderId], queryFn: () => get<WoView>(mtPath(companyId, `/work-orders/${workOrderId}`)), retry: false });
  const [dialog, setDialog] = useState<null | 'complete' | 'reopen' | 'cancel' | 'edit' | 'hold'>(null);
  const [newTask, setNewTask] = useState('');
  const [newPart, setNewPart] = useState({ part: '', quantity: '1' });
  useTick(!!q.data?.totals.myTimer);
  usePageTitle(q.data?.workOrder.number ?? 'Work order');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const d = q.data;
  const w = d.workOrder;
  const base = mtPath(companyId, `/work-orders/${w.id}`);
  const refresh = () => qc.invalidateQueries({ queryKey: ['mt', companyId] });
  const act = async (fn: () => Promise<unknown>, done?: string): Promise<boolean> => {
    try {
      await fn();
      if (done) toast(done);
      await refresh();
      setDialog(null);
      return true;
    } catch (err) {
      toast(errorMessage(err), 'error');
      return false;
    }
  };
  const est = d.totals.estimatedMinutes;
  const actual = d.totals.actualMinutes;
  return (
    <div className="stack">
      <div className="mt-head">
        <div>
          <h2 className="mt-title">{w.number}</h2>
          <div className="mt-badges"><WoBadge status={w.status} /><PriorityBadge priority={w.priority} /><span className="badge">{JOB_TYPE_LABELS[w.jobType] ?? w.jobType}</span></div>
        </div>
        <div className="mt-head-actions">
          {d.can.edit ? <button className="btn" onClick={() => setDialog('edit')}><Icon name="edit" /> Edit</button> : null}
          {d.can.work && w.status !== 'on_hold' ? <button className="btn" onClick={() => setDialog('hold')}>Put on hold</button> : null}
          {d.can.work && w.status === 'on_hold' ? <button className="btn" onClick={() => act(() => post(`${base}/status`, { status: 'in_progress' }), 'Resumed')}>Resume</button> : null}
          {d.can.close ? <button className="btn" onClick={() => act(() => post(`${base}/close`, {}), 'Closed')}>Close</button> : null}
          {d.can.reopen ? <button className="btn" onClick={() => setDialog('reopen')}><Icon name="restore" /> Reopen</button> : null}
          {d.can.cancel ? <button className="btn ghost" onClick={() => setDialog('cancel')}>Cancel work order</button> : null}
        </div>
      </div>
      <nav className="mt-path" aria-label="Asset">
        {d.assetPath.map((p, i) => (
          <span key={p.id} className="row">
            {i ? <span className="sep" aria-hidden>›</span> : null}
            <Link to={mtPage(companyId, `/assets/${p.id}`)}>{i === d.assetPath.length - 1 ? <strong>{p.number} {p.name}</strong> : p.name}</Link>
          </span>
        ))}
      </nav>
      {d.locked ? (
        <div className="warn-box mt-locked">
          <Icon name="lock" />
          <span className="grow">
            {w.status === 'completed' ? `Completed ${dateTimeText(w.completedAt)}${w.completedByName ? ` by ${w.completedByName}` : ''}.` : w.status === 'closed' ? 'Closed.' : 'Cancelled.'} It is locked: no changes until a supervisor or administrator reopens it with a reason.
          </span>
        </div>
      ) : null}

      {d.can.work || d.can.complete ? (
        <section className="card card-pad stack" aria-label="Time and completion">
          <div className="mt-timer">
            <Icon name="clock" size={22} />
            <div className="grow">
              <div className="mt-clock">{d.totals.myTimer ? clock(Date.now() - d.totals.myTimer.startedAt) : minutesText(actual) || '0 min'}</div>
              <div className="muted small">{d.totals.myTimer ? 'Your timer is running.' : `Recorded so far${est != null ? ` of ${minutesText(est)} estimated` : ''}.`}</div>
            </div>
          </div>
          <div className="mt-big-actions">
            {d.can.work ? (
              d.totals.myTimer ? (
                <button className="btn danger" onClick={() => act(() => post(`${base}/timer/stop`, {}), 'Time recorded')}><Icon name="stop" /> Stop timer</button>
              ) : (
                <button className="btn primary" onClick={() => act(() => post(`${base}/timer/start`, {}), 'Timer started')}><Icon name="play" /> Start timer</button>
              )
            ) : null}
            {d.can.complete ? <button className="btn primary" onClick={() => setDialog('complete')}><Icon name="check" /> Complete</button> : null}
            {d.can.work ? <UploadButton big companyId={companyId} target={{ workOrderId: w.id }} onDone={refresh} label="Add a photo" /> : null}
          </div>
        </section>
      ) : null}

      <div className="mt-grid">
        <aside className="stack">
          <Section title="Details">
            <p className="mt-pre">{w.description}</p>
            <Props
              items={[
                ['Asset', <Link key="a" to={mtPage(companyId, `/assets/${w.assetId}`)}>{w.assetNumber} {w.assetName}</Link>],
                ['Job type', JOB_TYPE_LABELS[w.jobType] ?? w.jobType],
                ['Priority', PRIORITY_LABELS[w.priority]],
                ['Technician', w.assignedToName ?? 'Not assigned'],
                ['Trade', w.trade],
                ['Contractor', w.contractor],
                ['Department', w.departmentName ?? w.department],
                ['Due start', dateText(w.dueStart)],
                ['Due finish', dateText(w.dueFinish)],
                ['Estimated', minutesText(w.estimatedMinutes)],
                ['Project reference', w.projectRef],
                ['Customer reference', w.customerRef],
                ['Made', dateTimeText(w.createdAt)],
              ]}
            />
            {d.otherOutstandingOnAsset ? <p className="muted small">{d.otherOutstandingOnAsset} other open {d.otherOutstandingOnAsset === 1 ? 'work order' : 'work orders'} on this asset.</p> : null}
          </Section>
          {d.requests.length ? (
            <Section title="From requests">
              <ul className="mt-docs">
                {d.requests.map((r) => (
                  <li key={r.id} className="row wrap">
                    <Link className="mt-num mt-primary" to={mtPage(companyId, `/requests/${r.id}`)}>{r.number}</Link>
                    <span className="grow small">{r.description}</span>
                    <RequestBadge status={r.status} />
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
          <Section title="Time">
            <meter className="mt-meter" min={0} max={Math.max(est ?? 0, actual, 1)} value={actual} aria-label="Time recorded against the estimate" />
            <p className="small">{minutesText(actual) || '0 min'} recorded{est != null ? ` of ${minutesText(est)} estimated` : ''}{est != null && actual > est ? ' (over the estimate)' : ''}.</p>
            {d.labour.length ? (
              <ul className="mt-docs small">
                {d.labour.map((l) => (
                  <li key={l.id} className="row wrap">
                    <span className="grow">{l.userName ?? 'Someone'}</span>
                    <span className="muted">{dateTimeText(l.startedAt)}</span>
                    <strong>{l.running ? 'running' : minutesText(l.minutes)}</strong>
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">No time recorded yet.</p>}
          </Section>
        </aside>
        <div className="stack">
          {w.safety ? (
            <section className="card card-pad stack" aria-labelledby="mt-safety-h">
              <h2 className="crm-subhead" id="mt-safety-h"><Icon name="alert" /> Safety requirements</h2>
              <div className="mt-safety mt-pre">{w.safety}</div>
            </section>
          ) : null}
          <Section title="Instructions">
            {w.instructions ? <p className="mt-pre">{w.instructions}</p> : <p className="muted small">No instructions.</p>}
          </Section>
          {w.completionNotes ? (
            <Section title="Completion notes">
              <p className="mt-pre">{w.completionNotes}</p>
            </Section>
          ) : null}
          <Section title={`Tasks (${d.tasks.filter((t) => t.done).length} of ${d.tasks.length} done)`}>
            {d.tasks.length ? (
              <ul className="mt-tasks">
                {d.tasks.map((t) => (
                  <li key={t.id} className={`mt-task${t.done ? ' done' : ''}`}>
                    <input type="checkbox" id={`mt-task-${t.id}`} checked={t.done} disabled={!d.can.work} onChange={(e) => act(() => patch(`${base}/tasks/${t.id}`, { done: e.target.checked }))} />
                    <label htmlFor={`mt-task-${t.id}`} className="grow">
                      <span className="mt-task-text">{t.text}</span>
                      {t.done ? <div className="mt-task-meta">Done by {t.doneByName ?? 'someone'}, {dateTimeText(t.doneAt)}</div> : null}
                    </label>
                    {d.can.edit ? <button className="btn ghost icon sm" aria-label={`Remove task ${t.text}`} onClick={async () => { if (await confirm({ title: 'Remove this task?', message: t.text, confirmLabel: 'Remove', danger: true })) await act(() => del(`${base}/tasks/${t.id}`), 'Task removed'); }}><Icon name="trash" size={14} /></button> : null}
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">No tasks.</p>}
            {d.can.work ? (
              <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); if (newTask.trim()) void act(() => post(`${base}/tasks`, { text: newTask.trim() })).then((ok) => ok && setNewTask('')); }}>
                <label className="sr-only" htmlFor="mt-new-task">New task</label>
                <input id="mt-new-task" className="input" maxLength={500} placeholder="Add a task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                <button className="btn" disabled={!newTask.trim()}>Add</button>
              </form>
            ) : null}
          </Section>
          <Section title="Required parts">
            {d.parts.length ? (
              <table className="data-table mt-table">
                <thead><tr><th>Part</th><th>Quantity</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {d.parts.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Part">{p.part}</td>
                      <td data-label="Quantity" className="mt-num">{p.quantity}</td>
                      <td>{d.can.work ? <button className="btn ghost icon sm" aria-label={`Remove ${p.part}`} onClick={() => act(() => del(`${base}/parts/${p.id}`), 'Part line removed')}><Icon name="trash" size={14} /></button> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="muted small">No parts listed.</p>}
            {d.can.work ? (
              <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); if (newPart.part.trim() && Number(newPart.quantity) > 0) void act(() => post(`${base}/parts`, { part: newPart.part.trim(), quantity: Number(newPart.quantity) })).then((ok) => ok && setNewPart({ part: '', quantity: '1' })); }}>
                <input className="input" aria-label="Part" maxLength={200} placeholder="Part" value={newPart.part} onChange={(e) => setNewPart((x) => ({ ...x, part: e.target.value }))} />
                <input className="input mt-qty" aria-label="Quantity" type="number" min="0" step="any" value={newPart.quantity} onChange={(e) => setNewPart((x) => ({ ...x, quantity: e.target.value }))} />
                <button className="btn" disabled={!newPart.part.trim()}>Add</button>
              </form>
            ) : null}
            <p className="muted small">Issuing parts from stores comes in a later stage.</p>
          </Section>
          <Section title="Photos and documents" actions={d.can.work ? <UploadButton companyId={companyId} target={{ workOrderId: w.id }} onDone={refresh} /> : null}>
            <FileList files={d.files} canRemove={(f) => d.can.work && (f.uploadedBy === me.user.id || me.can.manageWork)} onRemove={(f) => act(() => del(mtPath(companyId, `/files/${f.id}`)), 'File removed')} />
          </Section>
          <Section title="Notes">
            <Comments comments={d.comments} canAdd={d.can.work} onAdd={async (body) => { await post(`${base}/comments`, { body }); await refresh(); }} />
          </Section>
          <Section title="History">
            <History events={d.history} />
          </Section>
        </div>
      </div>
      {dialog === 'complete' ? <ReasonDialog title={`Complete ${w.number}`} label="Completion notes: what was done and what was found" confirm="Complete" onClose={() => setDialog(null)} onSubmit={(notes) => act(() => post(`${base}/complete`, { notes }), 'Completed')} /> : null}
      {dialog === 'reopen' ? <ReasonDialog title={`Reopen ${w.number}`} label="Reason for reopening (kept in the history)" confirm="Reopen" onClose={() => setDialog(null)} onSubmit={(reason) => act(() => post(`${base}/reopen`, { reason }), 'Reopened')} /> : null}
      {dialog === 'cancel' ? <ReasonDialog danger title={`Cancel ${w.number}`} label="Reason for cancelling" confirm="Cancel the work order" onClose={() => setDialog(null)} onSubmit={(reason) => act(() => post(`${base}/cancel`, { reason }), 'Cancelled')} /> : null}
      {dialog === 'hold' ? <ReasonDialog optional title={`Put ${w.number} on hold`} label="Why? (optional, for example waiting for a part)" confirm="Put on hold" onClose={() => setDialog(null)} onSubmit={(note) => act(() => post(`${base}/status`, { status: 'on_hold', ...(note ? { note } : {}) }), 'On hold')} /> : null}
      {dialog === 'edit' ? <EditWorkOrderDialog companyId={companyId} me={me} wo={w} onClose={() => setDialog(null)} onSaved={() => { void refresh(); setDialog(null); }} /> : null}
    </div>
  );
}

function EditWorkOrderDialog({ companyId, me, wo, onClose, onSaved }: { companyId: string; me: MtMe; wo: WorkOrder; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState({
    description: wo.description,
    jobType: wo.jobType,
    priority: wo.priority as string,
    trade: wo.trade,
    assignedTo: wo.assignedTo ?? '',
    contractor: wo.contractor,
    dueStart: wo.dueStart ?? '',
    dueFinish: wo.dueFinish ?? '',
    hours: wo.estimatedMinutes != null ? String(wo.estimatedMinutes / 60) : '',
    instructions: wo.instructions,
    safety: wo.safety,
    projectRef: wo.projectRef,
    customerRef: wo.customerRef,
  });
  const [dept, setDept] = useState({ departmentId: wo.departmentId ?? '', department: wo.department });
  const [busy, setBusy] = useState(false);
  const f = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((x) => ({ ...x, [k]: e.target.value }));
  const save = async () => {
    setBusy(true);
    try {
      await patch(mtPath(companyId, `/work-orders/${wo.id}`), {
        description: form.description,
        jobType: form.jobType,
        priority: form.priority,
        trade: form.trade,
        assignedTo: form.assignedTo || null,
        contractor: form.contractor,
        dueStart: form.dueStart || null,
        dueFinish: form.dueFinish || null,
        estimatedHours: form.hours ? Number(form.hours) : null,
        instructions: form.instructions,
        safety: form.safety,
        projectRef: form.projectRef,
        customerRef: form.customerRef,
        department: dept.department,
        departmentId: dept.departmentId || null,
      });
      toast('Saved');
      onSaved();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`Edit ${wo.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !form.description.trim()} onClick={save}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="field"><label htmlFor="mtx-desc">Description</label><textarea id="mtx-desc" className="textarea" rows={3} maxLength={5000} value={form.description} onChange={f('description')} /></div>
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="mtx-type">Job type</label><select id="mtx-type" className="select" value={form.jobType} onChange={f('jobType')}>{options(JOB_TYPE_LABELS)}</select></div>
        <div className="field"><label htmlFor="mtx-priority">Priority</label><select id="mtx-priority" className="select" value={form.priority} onChange={f('priority')}>{options(PRIORITY_LABELS)}</select></div>
        <PersonSelect me={me} id="mtx-tech" label="Technician" minRole="technician" value={form.assignedTo} onChange={(v) => setForm((x) => ({ ...x, assignedTo: v }))} empty="Not assigned" />
        <div className="field"><label htmlFor="mtx-trade">Trade</label><input id="mtx-trade" className="input" maxLength={80} value={form.trade} onChange={f('trade')} /></div>
        <div className="field"><label htmlFor="mtx-contractor">Contractor</label><input id="mtx-contractor" className="input" maxLength={200} value={form.contractor} onChange={f('contractor')} /></div>
        <DepartmentField me={me} id="mtx-dept" departmentId={dept.departmentId} department={dept.department} onChange={setDept} />
        <div className="field"><label htmlFor="mtx-start">Due start</label><input id="mtx-start" className="input" type="date" value={form.dueStart} onChange={f('dueStart')} /></div>
        <div className="field"><label htmlFor="mtx-finish">Due finish</label><input id="mtx-finish" className="input" type="date" value={form.dueFinish} onChange={f('dueFinish')} /></div>
        <div className="field"><label htmlFor="mtx-hours">Estimated hours</label><input id="mtx-hours" className="input" type="number" min="0" step="0.25" value={form.hours} onChange={f('hours')} /></div>
        <div className="field"><label htmlFor="mtx-project">Project reference</label><input id="mtx-project" className="input" maxLength={120} value={form.projectRef} onChange={f('projectRef')} /></div>
        <div className="field"><label htmlFor="mtx-customer">Customer reference</label><input id="mtx-customer" className="input" maxLength={120} value={form.customerRef} onChange={f('customerRef')} /></div>
        <div className="field crm-span"><label htmlFor="mtx-ins">Instructions</label><textarea id="mtx-ins" className="textarea" rows={4} value={form.instructions} onChange={f('instructions')} /></div>
        <div className="field crm-span"><label htmlFor="mtx-safety">Safety requirements</label><textarea id="mtx-safety" className="textarea" rows={3} value={form.safety} onChange={f('safety')} /></div>
      </div>
    </Modal>
  );
}
