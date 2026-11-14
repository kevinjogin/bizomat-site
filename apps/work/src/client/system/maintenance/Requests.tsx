// Maintenance requests: raise one (only the description is needed), follow your own, and, for supervisors and
// administrators, decide on them: approve, decline, ask for more information, make a work order or attach to one.
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { timeAgo } from '../../lib/format';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import {
  JOB_TYPE_LABELS,
  PRIORITY_LABELS,
  REQUEST_STATUS_LABELS,
  dateText,
  dateTimeText,
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
import { Comments, FileList, FilterPanel, History, PriorityBadge, Props, RequestBadge, Section, UploadButton, WoBadge, options, uploadMtFile } from './common';
import { AssetPicker, DepartmentField, PersonSelect, useAssetLabel, type PickedAsset } from './pickers';

// ------------------------------------------------------------------ the request form (also the rail's "Report a fault")

export function RequestForm({ companyId, me, initialAsset, onDone, onCancel, compact }: { companyId: string; me: MtMe | null; initialAsset?: PickedAsset | null; onDone: (r: MtRequest) => void; onCancel?: () => void; compact?: boolean }) {
  const toast = useToast();
  const qc = useQueryClient();
  const [description, setDescription] = useState('');
  const [asset, setAsset] = useState<PickedAsset | null>(initialAsset ?? null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [location, setLocation] = useState('');
  const [dept, setDept] = useState({ departmentId: '', department: '' });
  const [neededBy, setNeededBy] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [more, setMore] = useState(!compact);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setBusy(true);
    try {
      const r = await post<MtRequest>(mtPath(companyId, '/requests'), {
        description: description.trim(),
        assetId: asset?.id ?? null,
        priority,
        location,
        department: dept.department,
        departmentId: dept.departmentId || null,
        neededBy: neededBy || null,
        notes,
      });
      let failed = 0;
      for (const f of files) {
        try {
          await uploadMtFile(companyId, { requestId: r.id }, f);
        } catch {
          failed++;
        }
      }
      if (failed) toast(`${failed} ${failed === 1 ? 'file was' : 'files were'} not added. Open the request to try again.`, 'error');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      onDone(r);
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="stack" onSubmit={submit}>
      <div className="field">
        <label htmlFor="mtr-desc">What is wrong, or what needs doing?</label>
        <textarea id="mtr-desc" className="textarea" rows={4} required maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="For example: hydraulic oil leaking under the CNC machine in bay 3" />
        <span className="hint">This is the only thing you must fill in.</span>
      </div>
      <AssetPicker companyId={companyId} id="mtr-asset" label="Asset (if you know it)" value={asset} onChange={setAsset} />
      <div className="field">
        <label htmlFor="mtr-photos">Photos or documents</label>
        <input id="mtr-photos" className="input" type="file" multiple accept="image/*,.pdf,.txt,.docx,.xlsx" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        {files.length ? <span className="hint">{files.length} {files.length === 1 ? 'file' : 'files'} will be added.</span> : <span className="hint">On a phone you can take a photo here.</span>}
      </div>
      {!more ? (
        <button type="button" className="btn ghost sm" onClick={() => setMore(true)}><Icon name="plus" size={14} /> Priority, location and more</button>
      ) : (
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="mtr-priority">Priority</label>
            <select id="mtr-priority" className="select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>{options(PRIORITY_LABELS)}</select>
          </div>
          <div className="field">
            <label htmlFor="mtr-needed">Requested-by date</label>
            <input id="mtr-needed" className="input" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="mtr-location">Location</label>
            <input id="mtr-location" className="input" maxLength={200} value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          {me ? <DepartmentField me={me} id="mtr-dept" departmentId={dept.departmentId} department={dept.department} onChange={setDept} /> : (
            <div className="field">
              <label htmlFor="mtr-dept">Department</label>
              <input id="mtr-dept" className="input" maxLength={120} value={dept.department} onChange={(e) => setDept({ departmentId: '', department: e.target.value })} />
            </div>
          )}
          <div className="field crm-span">
            <label htmlFor="mtr-notes">Notes</label>
            <textarea id="mtr-notes" className="textarea" rows={2} maxLength={5000} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
      )}
      <div className="row wrap">
        <button className="btn primary lg" disabled={busy || !description.trim()}>{busy ? 'Sending…' : 'Send the request'}</button>
        {onCancel ? <button type="button" className="btn" onClick={onCancel}>Cancel</button> : null}
      </div>
      {me?.approvalRequired ? <p className="muted small">A supervisor or administrator approves requests before work starts.</p> : null}
    </form>
  );
}

export function NewRequestPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Report a fault');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const assetId = params.get('assetId');
  const asset = useQuery({ queryKey: ['mt', companyId, 'asset', assetId], queryFn: () => get<{ asset: { id: string; number: string; name: string } }>(mtPath(companyId, `/assets/${assetId}`)), enabled: !!assetId });
  if (assetId && !asset.data && !asset.error) return <Loading />;
  const initial = asset.data ? { id: asset.data.asset.id, number: asset.data.asset.number, name: asset.data.asset.name } : null;
  return (
    <div className="stack">
      <h2 className="crm-subhead">Report a fault or request work</h2>
      <section className="card card-pad">
        <RequestForm companyId={companyId} me={me} initialAsset={initial} onDone={(r) => navigate(mtPage(companyId, `/requests/${r.id}`))} onCancel={() => navigate(-1)} />
      </section>
    </div>
  );
}

// ------------------------------------------------------------------ lists

type View = 'mine' | 'awaiting' | 'open' | 'all';

export function RequestsPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Maintenance requests');
  const [params, setParams] = useSearchParams();
  const manager = me.can.decide;
  const view = (params.get('view') as View) ?? (manager ? 'awaiting' : 'mine');
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const status = params.get('status') ?? '';
  const priority = params.get('priority') ?? '';
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const q = params.get('q') ?? '';
  const assetId = params.get('assetId') ?? '';
  const assetLabel = useAssetLabel(companyId, assetId);
  const query = new URLSearchParams();
  if (view === 'mine') query.set('mine', '1');
  if (view === 'awaiting') query.set('status', 'awaiting');
  if (view === 'open') query.set('status', 'open');
  if (status && view !== 'awaiting') query.set('status', status);
  for (const [k, v] of Object.entries({ priority, from, to, q, assetId })) if (v) query.set(k, v);
  const list = useQuery({ queryKey: ['mt', companyId, 'requests', query.toString()], queryFn: () => get<{ requests: MtRequest[]; total: number }>(mtPath(companyId, `/requests?${query}`)) });
  const views: [View, string][] = manager ? [['awaiting', 'Awaiting approval'], ['open', 'Open'], ['mine', 'My requests'], ['all', 'All']] : [['mine', 'My requests'], ['all', 'All I can see']];
  return (
    <div className="stack">
      <div className="row wrap">
        <nav className="tabs grow" aria-label="Request lists">
          {views.map(([v, l]) => <button key={v} className={`tab${view === v ? ' active' : ''}`} aria-current={view === v ? 'page' : undefined} onClick={() => set('view', v)}>{l}</button>)}
        </nav>
        <Link className="btn primary" to={mtPage(companyId, '/requests/new')}><Icon name="plus" /> Report a fault</Link>
      </div>
      <FilterPanel active={[status, priority, from, to, q, assetId].filter(Boolean).length}>
        <div className="field">
          <label htmlFor="mtq-q">Search</label>
          <input id="mtq-q" className="input" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Number or words" />
        </div>
        {view !== 'awaiting' ? (
          <div className="field">
            <label htmlFor="mtq-status">Status</label>
            <select id="mtq-status" className="select" value={status} onChange={(e) => set('status', e.target.value)}>
              <option value="">Any</option>
              {options(REQUEST_STATUS_LABELS)}
            </select>
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="mtq-priority">Priority</label>
          <select id="mtq-priority" className="select" value={priority} onChange={(e) => set('priority', e.target.value)}>
            <option value="">Any</option>
            {options(PRIORITY_LABELS)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mtq-from">Raised from</label>
          <input id="mtq-from" className="input" type="date" value={from} onChange={(e) => set('from', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="mtq-to">Raised to</label>
          <input id="mtq-to" className="input" type="date" value={to} onChange={(e) => set('to', e.target.value)} />
        </div>
        <div className="crm-span">
          <AssetPicker companyId={companyId} id="mtq-asset" label="Asset" value={assetLabel} onChange={(a) => set('assetId', a?.id ?? '')} />
        </div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.requests.length ? (
          <EmptyState icon="inbox" title="No requests here">{view === 'awaiting' ? 'Nothing is waiting for approval.' : 'Raise one with Report a fault.'}</EmptyState>
        ) : (
          <table className="data-table mt-table">
            <thead><tr><th>Number</th><th>Description</th><th>Asset</th><th>Priority</th><th>Status</th><th>Raised by</th><th>Raised</th></tr></thead>
            <tbody>
              {list.data.requests.map((r) => (
                <tr key={r.id}>
                  <td data-label="Number"><Link className="mt-primary mt-num" to={mtPage(companyId, `/requests/${r.id}`)}>{r.number}</Link></td>
                  <td data-label="Description" className="mt-desc">{r.description.length > 140 ? `${r.description.slice(0, 140)}…` : r.description}</td>
                  <td data-label="Asset">{r.assetId ? <Link to={mtPage(companyId, `/assets/${r.assetId}`)}>{r.assetNumber} {r.assetName}</Link> : <span className="muted">None</span>}</td>
                  <td data-label="Priority"><PriorityBadge priority={r.priority} /></td>
                  <td data-label="Status"><RequestBadge status={r.status} />{r.workOrderNumber ? <div className="small muted">{r.workOrderNumber}</div> : null}</td>
                  <td data-label="Raised by">{r.requestedByName ?? ''}</td>
                  <td data-label="Raised" className="small" title={dateTimeText(r.createdAt)}>{timeAgo(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {list.data && list.data.total > list.data.requests.length ? <p className="muted small">Showing {list.data.requests.length} of {list.data.total}. Narrow the filters to see the rest.</p> : null}
    </div>
  );
}

// ------------------------------------------------------------------ detail

interface RequestView {
  request: MtRequest;
  assetOutstandingWorkOrders: WorkOrder[];
  workOrderVisible: boolean;
  comments: MtComment[];
  files: MtFile[];
  history: MtEvent[];
  approvalRequired: boolean;
  can: { edit: boolean; approve: boolean; decline: boolean; requestInfo: boolean; respond: boolean; convert: boolean; attach: boolean; close: boolean; comment: boolean; upload: boolean };
}

export function RequestDetail({ companyId, me }: { companyId: string; me: MtMe }) {
  const { requestId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ['mt', companyId, 'request', requestId], queryFn: () => get<RequestView>(mtPath(companyId, `/requests/${requestId}`)), retry: false });
  const [dialog, setDialog] = useState<null | 'decline' | 'info' | 'respond' | 'convert' | 'edit' | 'close'>(null);
  usePageTitle(q.data?.request.number ?? 'Request');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { request: r, can } = q.data;
  const refresh = () => qc.invalidateQueries({ queryKey: ['mt', companyId] });
  const act = async (fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      await refresh();
      setDialog(null);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-head">
        <div>
          <h2 className="mt-title">{r.number}</h2>
          <div className="mt-badges"><RequestBadge status={r.status} /><PriorityBadge priority={r.priority} /></div>
        </div>
        <div className="mt-head-actions">
          {can.approve ? <button className="btn primary" onClick={() => act(() => post(mtPath(companyId, `/requests/${r.id}/approve`), {}), 'Approved')}><Icon name="check" /> Approve</button> : null}
          {can.convert ? <button className="btn primary" onClick={() => setDialog('convert')}><Icon name="wrench" /> Make a work order</button> : null}
          {can.requestInfo ? <button className="btn" onClick={() => setDialog('info')}>Ask for more information</button> : null}
          {can.decline ? <button className="btn" onClick={() => setDialog('decline')}>Decline</button> : null}
          {can.respond ? <button className="btn primary" onClick={() => setDialog('respond')}>Give the information</button> : null}
          {can.edit ? <button className="btn" onClick={() => setDialog('edit')}><Icon name="edit" /> Edit</button> : null}
          {can.close ? <button className="btn ghost" onClick={() => setDialog('close')}>Close the request</button> : null}
        </div>
      </div>
      {r.status === 'info_requested' ? <div className="warn-box">More information was asked for. {can.respond ? 'Answer it with Give the information.' : 'Waiting for the requester.'}</div> : null}
      {r.status === 'declined' ? <div className="warn-box">Declined{r.decidedByName ? ` by ${r.decidedByName}` : ''}: {r.decisionNote}</div> : null}
      {r.workOrderId ? (
        <div className="info-box row wrap">
          <span className="grow">Work order {q.data.workOrderVisible ? <Link to={mtPage(companyId, `/work-orders/${r.workOrderId}`)}>{r.workOrderNumber}</Link> : r.workOrderNumber}{r.workOrderStatus ? <> · <WoBadge status={r.workOrderStatus} /></> : null}</span>
          {r.status === 'completed' ? <span className="small">The request was completed when its work order was completed.</span> : null}
        </div>
      ) : null}
      <div className="mt-grid">
        <aside className="stack">
          <Section title="Request">
            <p className="mt-pre">{r.description}</p>
            <Props
              items={[
                ['Asset', r.assetId ? <Link to={mtPage(companyId, `/assets/${r.assetId}`)}>{r.assetNumber} {r.assetName}</Link> : null],
                ['Priority', PRIORITY_LABELS[r.priority]],
                ['Location', r.location],
                ['Department', r.departmentName ?? r.department],
                ['Requested by date', dateText(r.neededBy)],
                ['Raised by', r.requestedByName],
                ['Raised', dateTimeText(r.createdAt)],
                ['Decided by', r.decidedByName ? `${r.decidedByName}, ${dateTimeText(r.decidedAt)}` : null],
                ['Notes', r.notes ? <span className="mt-pre">{r.notes}</span> : null],
              ]}
            />
          </Section>
          {can.attach && q.data.assetOutstandingWorkOrders.length ? (
            <Section title="Open work on this asset">
              <p className="muted small">Attach the request to one of these instead of making another work order for the same fault.</p>
              <ul className="mt-docs">
                {q.data.assetOutstandingWorkOrders.map((w) => (
                  <li key={w.id} className="row wrap">
                    <Link className="mt-num mt-primary" to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link>
                    <span className="grow small">{w.description}</span>
                    <WoBadge status={w.status} />
                    <button className="btn sm" onClick={() => act(() => post(mtPath(companyId, `/requests/${r.id}/attach`), { workOrderId: w.id }), `Attached to ${w.number}`)}>Attach</button>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </aside>
        <div className="stack">
          <Section title="Photos and documents" actions={can.upload ? <UploadButton companyId={companyId} target={{ requestId: r.id }} onDone={refresh} /> : null}>
            <FileList files={q.data.files} canRemove={(f) => can.upload && (f.uploadedBy === me.user.id || me.can.decide)} onRemove={(f) => act(() => del(mtPath(companyId, `/files/${f.id}`)), 'File removed')} />
          </Section>
          <Section title="Comments">
            <Comments comments={q.data.comments} canAdd={can.comment} noun="comment" onAdd={async (body) => { await post(mtPath(companyId, `/requests/${r.id}/comments`), { body }); await refresh(); }} />
          </Section>
          <Section title="History">
            <History events={q.data.history} />
          </Section>
        </div>
      </div>
      {dialog === 'decline' ? <ReasonDialog title={`Decline ${r.number}`} label="Reason (the requester sees it)" confirm="Decline" onClose={() => setDialog(null)} onSubmit={(reason) => act(() => post(mtPath(companyId, `/requests/${r.id}/decline`), { reason }), 'Declined')} /> : null}
      {dialog === 'info' ? <ReasonDialog title="Ask for more information" label="What do you need to know?" confirm="Ask" onClose={() => setDialog(null)} onSubmit={(comment) => act(() => post(mtPath(companyId, `/requests/${r.id}/request-info`), { comment }), 'Asked for more information')} /> : null}
      {dialog === 'respond' ? <ReasonDialog title="Give the information" label="Your answer" confirm="Send" onClose={() => setDialog(null)} onSubmit={(comment) => act(() => post(mtPath(companyId, `/requests/${r.id}/respond`), { comment }), 'Sent')} /> : null}
      {dialog === 'close' ? <ReasonDialog title={`Close ${r.number}`} label="Note (optional)" confirm="Close the request" optional onClose={() => setDialog(null)} onSubmit={(note) => act(() => post(mtPath(companyId, `/requests/${r.id}/close`), note ? { note } : {}), 'Closed')} /> : null}
      {dialog === 'convert' ? <ConvertDialog companyId={companyId} me={me} request={r} onClose={() => setDialog(null)} onDone={(woId) => { void refresh(); navigate(mtPage(companyId, `/work-orders/${woId}`)); }} /> : null}
      {dialog === 'edit' ? <EditRequestDialog companyId={companyId} me={me} request={r} onClose={() => setDialog(null)} onSaved={() => { void refresh(); setDialog(null); }} /> : null}
    </div>
  );
}

export function ReasonDialog({ title, label, confirm, onClose, onSubmit, optional, danger }: { title: string; label: string; confirm: string; onClose: () => void; onSubmit: (text: string) => Promise<unknown> | void; optional?: boolean; danger?: boolean }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      await onSubmit(text.trim());
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className={`btn ${danger ? 'danger' : 'primary'}`} disabled={busy || (!optional && !text.trim())} onClick={go}>{busy ? 'Working…' : confirm}</button></>}>
      <div className="field">
        <label htmlFor="mt-reason">{label}</label>
        <textarea id="mt-reason" className="textarea" rows={4} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
    </Modal>
  );
}

function ConvertDialog({ companyId, me, request, onClose, onDone }: { companyId: string; me: MtMe; request: MtRequest; onClose: () => void; onDone: (workOrderId: string) => void }) {
  const toast = useToast();
  const [asset, setAsset] = useState<PickedAsset | null>(request.assetId ? { id: request.assetId, number: request.assetNumber ?? '', name: request.assetName ?? '' } : null);
  const [jobType, setJobType] = useState('corrective');
  const [priority, setPriority] = useState<Priority>(request.priority);
  const [assignedTo, setAssignedTo] = useState('');
  const [dueFinish, setDueFinish] = useState(request.neededBy ?? '');
  const [hours, setHours] = useState('');
  const [instructions, setInstructions] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async () => {
    if (!asset) return;
    setBusy(true);
    try {
      const r = await post<{ workOrder: WorkOrder }>(mtPath(companyId, `/requests/${request.id}/convert`), {
        assetId: asset.id,
        jobType,
        priority,
        assignedTo: assignedTo || null,
        dueFinish: dueFinish || null,
        estimatedHours: hours ? Number(hours) : null,
        instructions,
      });
      toast(`Work order ${r.workOrder.number} made`);
      onDone(r.workOrder.id);
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`Make a work order from ${request.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !asset} onClick={go}>{busy ? 'Making…' : 'Make the work order'}</button></>}>
      <p className="muted small">The description comes from the request. Add tasks, parts and safety on the work order.</p>
      <AssetPicker companyId={companyId} id="mtc-asset" label="Asset (required)" value={asset} onChange={setAsset} allowNone={false} />
      <div className="crm-form-grid">
        <div className="field">
          <label htmlFor="mtc-type">Job type</label>
          <select id="mtc-type" className="select" value={jobType} onChange={(e) => setJobType(e.target.value)}>{options(JOB_TYPE_LABELS)}</select>
        </div>
        <div className="field">
          <label htmlFor="mtc-priority">Priority</label>
          <select id="mtc-priority" className="select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>{options(PRIORITY_LABELS)}</select>
        </div>
        <PersonSelect me={me} id="mtc-tech" label="Technician" minRole="technician" value={assignedTo} onChange={setAssignedTo} empty="Not assigned yet" />
        <div className="field">
          <label htmlFor="mtc-due">Due finish</label>
          <input id="mtc-due" className="input" type="date" value={dueFinish} onChange={(e) => setDueFinish(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="mtc-hours">Estimated hours</label>
          <input id="mtc-hours" className="input" type="number" min="0" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} />
        </div>
        <div className="field crm-span">
          <label htmlFor="mtc-ins">Instructions</label>
          <textarea id="mtc-ins" className="textarea" rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

function EditRequestDialog({ companyId, me, request, onClose, onSaved }: { companyId: string; me: MtMe; request: MtRequest; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [description, setDescription] = useState(request.description);
  const [asset, setAsset] = useState<PickedAsset | null>(request.assetId ? { id: request.assetId, number: request.assetNumber ?? '', name: request.assetName ?? '' } : null);
  const [priority, setPriority] = useState<Priority>(request.priority);
  const [location, setLocation] = useState(request.location);
  const [dept, setDept] = useState({ departmentId: request.departmentId ?? '', department: request.department });
  const [neededBy, setNeededBy] = useState(request.neededBy ?? '');
  const [notes, setNotes] = useState(request.notes);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await patch(mtPath(companyId, `/requests/${request.id}`), { description, assetId: asset?.id ?? null, priority, location, department: dept.department, departmentId: dept.departmentId || null, neededBy: neededBy || null, notes });
      toast('Saved');
      onSaved();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`Edit ${request.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !description.trim()} onClick={save}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="field">
        <label htmlFor="mte-desc">Description</label>
        <textarea id="mte-desc" className="textarea" rows={4} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <AssetPicker companyId={companyId} id="mte-asset" value={asset} onChange={setAsset} />
      <div className="crm-form-grid">
        <div className="field">
          <label htmlFor="mte-priority">Priority</label>
          <select id="mte-priority" className="select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>{options(PRIORITY_LABELS)}</select>
        </div>
        <div className="field">
          <label htmlFor="mte-needed">Requested-by date</label>
          <input id="mte-needed" className="input" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="mte-location">Location</label>
          <input id="mte-location" className="input" maxLength={200} value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <DepartmentField me={me} id="mte-dept" departmentId={dept.departmentId} department={dept.department} onChange={setDept} />
        <div className="field crm-span">
          <label htmlFor="mte-notes">Notes</label>
          <textarea id="mte-notes" className="textarea" rows={2} maxLength={5000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
