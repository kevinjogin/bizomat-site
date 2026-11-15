// BIZOMAT WHS, Release 1: the actions register (corrective, preventive and improvement actions from any source) and one
// action: start, add evidence, complete (refused without evidence when it needs it), verify, close. Overdue actions are
// marked, and escalated in the app by the server.
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal } from '../../components/ui/overlays';
import { csvHref, dateText, dayText, localToday, whsPage, whsPath, type Action, type WhsComment, type WhsEvent, type WhsFile, type WhsMe } from './api';
import { Comments, ConfidentialBadge, FilterPanel, History, NoteDialog, PersonSelect, Props, Section, StatusBadge, Stepper, WhsFiles, WhsUpload, options, useWhsAct } from './common';

export interface ActionDraft {
  title: string;
  description: string;
  kind: string;
  hierarchy: string;
  priority: string;
  responsibleId: string;
  dueDate: string;
  evidenceRequired: boolean;
  evidenceNote: string;
}

const sourceLink = (companyId: string, a: Action) => {
  if (!a.sourceId) return null;
  const path = a.sourceType === 'hazard' ? `/hazards/${a.sourceId}` : a.sourceType === 'incident' ? `/incidents/${a.sourceId}` : a.sourceType === 'risk_assessment' ? `/risk/${a.sourceId}` : null;
  return path ? whsPage(companyId, path) : null;
};

/** The actions of a record, as compact rows. */
export function ActionRows({ companyId, actions }: { companyId: string; actions: Action[] }) {
  return (
    <ul className="erp-list">
      {actions.map((a) => (
        <li key={a.id} className="row wrap whs-action-row">
          <Link to={whsPage(companyId, `/actions/${a.id}`)} className="grow"><span className="mt-num">{a.number}</span> {a.title}</Link>
          {a.hierarchy ? <span className="badge">{a.hierarchyLabel}</span> : null}
          <StatusBadge status={a.status} label={a.statusLabel} />
          <span className="small muted">{a.responsibleName ?? 'Nobody yet'}{a.dueDate ? `, due ${dateText(a.dueDate)}` : ''}</span>
          {a.overdue ? <span className="badge danger">Overdue</span> : null}
        </li>
      ))}
    </ul>
  );
}

/** A form for one action (used inside other dialogs: the caller decides what to do with it). */
export function NewActionForm({ me, onAdd, submitLabel = 'Add this action' }: { me: WhsMe; onAdd: (a: ActionDraft) => void; submitLabel?: string }) {
  const blank: ActionDraft = { title: '', description: '', kind: 'corrective', hierarchy: '', priority: 'medium', responsibleId: '', dueDate: '', evidenceRequired: false, evidenceNote: '' };
  const [a, setA] = useState<ActionDraft>(blank);
  const set = (k: keyof ActionDraft) => (e: { target: { value: string } }) => setA((x) => ({ ...x, [k]: e.target.value }));
  return (
    <fieldset className="whs-action-form">
      <legend>New action</legend>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="na-title">What is to be done</label><input id="na-title" className="input" maxLength={200} value={a.title} onChange={set('title')} /></div>
        <div className="field"><label htmlFor="na-h">Hierarchy of controls</label><select id="na-h" className="select" value={a.hierarchy} onChange={set('hierarchy')}><option value="">Not a control</option>{options(me.lists.hierarchy)}</select></div>
        <div className="field"><label htmlFor="na-k">Kind</label><select id="na-k" className="select" value={a.kind} onChange={set('kind')}>{options(me.lists.actionKinds)}</select></div>
        <PersonSelect me={me} id="na-resp" value={a.responsibleId} onChange={(v) => setA((x) => ({ ...x, responsibleId: v }))} />
        <div className="field"><label htmlFor="na-due">Due</label><input id="na-due" type="date" className="input" value={a.dueDate} onChange={set('dueDate')} /></div>
        <div className="field"><label htmlFor="na-p">Priority</label><select id="na-p" className="select" value={a.priority} onChange={set('priority')}>{options(me.lists.priorities)}</select></div>
        <label className="checkbox whs-check mt-field-end"><input type="checkbox" checked={a.evidenceRequired} onChange={(e) => setA((x) => ({ ...x, evidenceRequired: e.target.checked }))} /> Evidence needed to complete it</label>
        {a.evidenceRequired ? <div className="field span-2"><label htmlFor="na-ev">What evidence</label><input id="na-ev" className="input" maxLength={1000} value={a.evidenceNote} onChange={set('evidenceNote')} placeholder="For example: a photo of the guard fitted" /></div> : null}
        <div className="field span-2"><label htmlFor="na-d">Details (optional)</label><textarea id="na-d" className="textarea" rows={2} value={a.description} onChange={set('description')} /></div>
      </div>
      <div className="row"><button type="button" className="btn" disabled={!a.title.trim()} onClick={() => { onAdd({ ...a, title: a.title.trim() }); setA(blank); }}><Icon name="plus" /> {submitLabel}</button></div>
    </fieldset>
  );
}

/** Raise one action from a record (an incident, an investigation, a risk assessment). */
export function RaiseActionDialog({ companyId, me, source, onClose }: { companyId: string; me: WhsMe; source: { type: string; id: string; label: string }; onClose: () => void }) {
  const act = useWhsAct(companyId);
  return (
    <Modal wide title={`New action from ${source.label}`} onClose={onClose} footer={<button className="btn" onClick={onClose}>Back</button>}>
      <NewActionForm
        me={me}
        submitLabel="Raise the action"
        onAdd={async (a) => {
          const r = await act(() => post(whsPath(companyId, '/actions'), { ...a, sourceType: source.type, sourceId: source.id, responsibleId: a.responsibleId || null, dueDate: a.dueDate || null, hierarchy: a.hierarchy || null }), 'Action raised');
          if (r) onClose();
        }}
      />
    </Modal>
  );
}

export function ActionsPage({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Actions');
  const [sp, setSp] = useSearchParams();
  const f = { status: sp.get('status') ?? '', mine: sp.get('mine') ?? '', overdue: sp.get('overdue') ?? '', source: sp.get('source') ?? '', q: sp.get('q') ?? '' };
  const set = (k: keyof typeof f, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    setSp(n, { replace: true });
  };
  const [adding, setAdding] = useState(false);
  const query = new URLSearchParams({ today: localToday(), ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) });
  const q = useQuery({ queryKey: ['whs', companyId, 'actions', query.toString()], queryFn: () => get<{ actions: Action[]; total: number }>(whsPath(companyId, `/actions?${query}`)) });
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">{me.can.view ? 'Every corrective and preventive action, from hazards, incidents, investigations and risk assessments.' : 'The actions you are responsible for.'}</p>
        {me.can.assess ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> New action</button> : null}
        {me.can.view ? <a className="btn" href={csvHref(companyId, `/actions?${query}`)} download><Icon name="download" /> Export CSV</a> : null}
      </div>
      <FilterPanel active={Object.values(f).filter(Boolean).length}>
        <div className="field"><label htmlFor="ac-q">Search</label><input id="ac-q" className="input" value={f.q} onChange={(e) => set('q', e.target.value)} /></div>
        <div className="field"><label htmlFor="ac-s">Status</label><select id="ac-s" className="select" value={f.status} onChange={(e) => set('status', e.target.value)}><option value="">Any</option><option value="open">Open or in progress</option><option value="to_verify">Completed, to verify</option>{options(me.lists.actionStatus)}</select></div>
        <div className="field"><label htmlFor="ac-src">Source</label><select id="ac-src" className="select" value={f.source} onChange={(e) => set('source', e.target.value)}><option value="">Any</option>{options(me.lists.actionSources, me.lists.liveActionSources)}</select></div>
        <label className="checkbox mt-field-end"><input type="checkbox" checked={f.mine === '1'} onChange={(e) => set('mine', e.target.checked ? '1' : '')} /> Mine</label>
        <label className="checkbox mt-field-end"><input type="checkbox" checked={f.overdue === '1'} onChange={(e) => set('overdue', e.target.checked ? '1' : '')} /> Overdue</label>
      </FilterPanel>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : !q.data.actions.length ? <EmptyState icon="checkSquare" title="No actions here" /> : (
        <div className="crm-table-scroll">
          <table className="data-table mt-table">
            <thead><tr><th>Action</th><th>From</th><th>Control</th><th>Responsible</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              {q.data.actions.map((a) => {
                const src = sourceLink(companyId, a);
                return (
                  <tr key={a.id}>
                    <td data-label="Action"><Link to={whsPage(companyId, `/actions/${a.id}`)} className="mt-primary"><span className="mt-num">{a.number}</span> {a.title}</Link> {a.confidential ? <ConfidentialBadge /> : null}<div className="muted small">{a.kindLabel}, {a.priorityLabel.toLowerCase()} priority{a.evidenceRequired ? `, evidence needed (${a.evidenceCount} added)` : ''}</div></td>
                    <td data-label="From">{a.sourceLabel}{a.sourceNumber ? <> {src ? <Link to={src}>{a.sourceNumber}</Link> : a.sourceNumber}</> : null}</td>
                    <td data-label="Control">{a.hierarchyLabel}</td>
                    <td data-label="Responsible">{a.responsibleName ?? ''}</td>
                    <td data-label="Due" className={a.overdue ? 'mt-overdue' : ''}>{dateText(a.dueDate)}{a.overdue ? ' (overdue)' : ''}</td>
                    <td data-label="Status"><StatusBadge status={a.status} label={a.statusLabel} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {adding ? <RaiseActionDialog companyId={companyId} me={me} source={{ type: 'other', id: '', label: 'the register' }} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

interface ActionView {
  action: Action;
  files: WhsFile[];
  comments: WhsComment[];
  history: WhsEvent[];
  can: Record<'edit' | 'start' | 'complete' | 'evidence' | 'verify' | 'close' | 'cancel', boolean>;
}

const FLOW: [string, string][] = [
  ['open', 'Open'],
  ['in_progress', 'In progress'],
  ['completed', 'Completed'],
  ['verified', 'Verified'],
  ['closed', 'Closed'],
];

export function ActionDetail({ companyId, me }: { companyId: string; me: WhsMe }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['whs', companyId, 'action', id], queryFn: () => get<ActionView>(whsPath(companyId, `/actions/${id}?today=${localToday()}`)), retry: false });
  const act = useWhsAct(companyId);
  const [dialog, setDialog] = useState<null | 'complete' | 'verify' | 'notEffective' | 'close' | 'cancel'>(null);
  usePageTitle(q.data ? `${q.data.action.number} ${q.data.action.title}` : 'Action');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { action: a, can } = q.data;
  const refresh = () => void q.refetch();
  const call = (path: string, body: unknown, done: string) => act(() => post(whsPath(companyId, `/actions/${a.id}${path}`), body), done);
  const src = sourceLink(companyId, a);
  return (
    <div className="stack whs-detail">
      <div className="mt-path"><Link to={whsPage(companyId, '/actions')}>Actions</Link><span className="sep">/</span><span>{a.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{a.number}</span> {a.title}</h2>
          <div className="mt-badges"><StatusBadge status={a.status} label={a.statusLabel} /><span className="badge">{a.priorityLabel}</span>{a.hierarchy ? <span className="badge">{a.hierarchyLabel}</span> : null}{a.overdue ? <span className="badge danger">Overdue</span> : null}{a.confidential ? <ConfidentialBadge /> : null}</div>
        </div>
        <div className="mt-head-actions">
          {can.start ? <button className="btn" onClick={() => void call('/start', {}, 'Started')}>Start</button> : null}
          {can.complete ? <button className="btn primary" onClick={() => setDialog('complete')}><Icon name="check" /> Complete</button> : null}
          {can.verify ? <button className="btn primary" onClick={() => setDialog('verify')}>Verify</button> : null}
          {can.verify ? <button className="btn" onClick={() => setDialog('notEffective')}>Not effective</button> : null}
          {can.close ? <button className="btn primary" onClick={() => setDialog('close')}>Close</button> : null}
          {can.cancel ? <button className="btn ghost" onClick={() => setDialog('cancel')}>Cancel</button> : null}
        </div>
      </div>
      {a.status !== 'cancelled' ? <Stepper steps={FLOW} current={a.status} /> : null}
      <Section title="The action">
        <Props items={[
          ['Details', a.description],
          ['From', a.sourceNumber ? (src ? <Link to={src}>{a.sourceLabel} {a.sourceNumber}</Link> : `${a.sourceLabel} ${a.sourceNumber}`) : a.sourceLabel],
          ['Kind', a.kindLabel],
          ['Hierarchy of controls', a.hierarchyLabel],
          ['Responsible', a.responsibleName ?? 'Nobody yet'],
          ['Due', a.dueDate ? <span className={a.overdue ? 'mt-overdue' : ''}>{dateText(a.dueDate)}</span> : ''],
          ['Evidence', a.evidenceRequired ? `Needed: ${a.evidenceNote || 'a photo or document'} (${a.evidenceCount} added)` : 'Not required'],
          ['Raised', `${dayText(a.createdAt)}${a.createdByName ? ` by ${a.createdByName}` : ''}`],
          ['Completed', a.completedAt ? `${dayText(a.completedAt)}${a.completedByName ? ` by ${a.completedByName}` : ''}: ${a.completionNote}` : ''],
          ['Verified', a.verifiedAt ? `${dayText(a.verifiedAt)}${a.verifiedByName ? ` by ${a.verifiedByName}` : ''}: ${a.verificationNote}${a.verifySod ? ' (one-person exception recorded)' : ''}` : a.verificationNote],
          ['Closed', a.closedAt ? `${dayText(a.closedAt)}${a.closedByName ? ` by ${a.closedByName}` : ''}${a.closureNote ? `: ${a.closureNote}` : ''}` : ''],
        ]} />
      </Section>
      <Section title="Evidence" actions={can.evidence ? <WhsUpload companyId={companyId} kind="action" id={a.id} onDone={refresh} label="Add evidence" /> : null}>
        {a.evidenceRequired && !a.evidenceCount ? <p className="whs-warning small"><Icon name="alert" size={14} /> This action needs evidence before it can be completed.</p> : null}
        <WhsFiles companyId={companyId} files={q.data.files} onRemoved={refresh} canRemove={can.evidence} />
      </Section>
      <Section title="Notes">
        <Comments companyId={companyId} entityType="action" entityId={a.id} comments={q.data.comments} canNote canConsult={me.can.consult} />
      </Section>
      {q.data.history.length ? <Section title="History"><History events={q.data.history as any} /></Section> : null}
      {dialog === 'complete' ? <NoteDialog title={`Complete ${a.number}`} label="What was done?" confirm="Complete" required onClose={() => setDialog(null)} onSave={(note) => call('/complete', { note }, 'Completed')} /> : null}
      {dialog === 'verify' ? <NoteDialog title={`Verify ${a.number}`} label="How did you check it works?" confirm="Verified effective" required onClose={() => setDialog(null)} onSave={(note) => call('/verify', { effective: true, note }, 'Verified')} /> : null}
      {dialog === 'notEffective' ? <NoteDialog title={`${a.number} is not effective`} label="What is still wrong?" confirm="Send back to in progress" required onClose={() => setDialog(null)} onSave={(note) => call('/verify', { effective: false, note }, 'Sent back')} /> : null}
      {dialog === 'close' ? <NoteDialog title={`Close ${a.number}`} label="Closing note (optional)" confirm="Close" onClose={() => setDialog(null)} onSave={(note) => call('/close', { note: note || undefined }, 'Closed')} /> : null}
      {dialog === 'cancel' ? <NoteDialog title={`Cancel ${a.number}`} label="Why?" confirm="Cancel the action" danger required onClose={() => setDialog(null)} onSave={(reason) => call('/cancel', { reason }, 'Cancelled')} /> : null}
    </div>
  );
}
