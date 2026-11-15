// BIZOMAT WHS, Release 1: incidents (a register with filters and CSV) and one incident with its workflow: Reported,
// Immediate response, Classified, Under investigation, Corrective action, Verification, Closed. Its sections: the
// details (with the changes tracked after classification), the investigation (team, timeline, witness statements,
// evidence, five whys, fishbone, contributing factors, failed controls, approval), the regulatory notification record
// (the rules of the site's jurisdictions, the decision by an authorised person, the checklist and the submission as it
// was made) and the confidential health record for health officers.
import { useState } from 'react';
import { Link, NavLink, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get, patch, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal } from '../../components/ui/overlays';
import { csvHref, dateText, dateTimeText, dayText, localMs, localTime, localToday, whsPage, whsPath, type IncidentView, type Incident, type Investigation, type NotificationView, type WhsFile, type WhsMe } from './api';
import { Comments, ConfidentialBadge, FilterPanel, History, LegalNotice, NoteDialog, PersonSelect, Props, Section, StatusBadge, Stepper, WhsFiles, WhsUpload, options, useWhsAct } from './common';
import { ActionRows, RaiseActionDialog } from './Actions';
import { LinkDialog, LinkList } from './Hazards';

export function IncidentsPage({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Incidents');
  const [sp, setSp] = useSearchParams();
  const f = { status: sp.get('status') ?? '', kind: sp.get('kind') ?? '', site: sp.get('site') ?? '', from: sp.get('from') ?? '', to: sp.get('to') ?? '', notifiable: sp.get('notifiable') ?? '', investigate: sp.get('investigate') ?? '', q: sp.get('q') ?? '' };
  const set = (k: keyof typeof f, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    setSp(n, { replace: true });
  };
  const query = new URLSearchParams({ today: localToday(), ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) });
  const q = useQuery({ queryKey: ['whs', companyId, 'incidents', query.toString()], queryFn: () => get<{ incidents: Incident[]; total: number }>(whsPath(companyId, `/incidents?${query}`)) });
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">{me.can.view ? 'Every incident and near miss reported in the company.' : 'Your incident reports and where each stands.'}</p>
        <Link className="btn primary" to={whsPage(companyId, '/report/incident')}><Icon name="plus" /> Report an incident</Link>
        {me.can.view ? <a className="btn" href={csvHref(companyId, `/incidents?${query}`)} download><Icon name="download" /> Export CSV</a> : null}
      </div>
      <FilterPanel active={Object.values(f).filter(Boolean).length}>
        <div className="field"><label htmlFor="in-q">Search</label><input id="in-q" className="input" value={f.q} onChange={(e) => set('q', e.target.value)} /></div>
        <div className="field"><label htmlFor="in-s">Status</label><select id="in-s" className="select" value={f.status} onChange={(e) => set('status', e.target.value)}><option value="">Any</option><option value="open">Not closed</option>{options(me.lists.incidentStatus)}</select></div>
        <div className="field"><label htmlFor="in-k">Kind</label><select id="in-k" className="select" value={f.kind} onChange={(e) => set('kind', e.target.value)}><option value="">Any</option>{options(me.lists.incidentKinds)}</select></div>
        {me.sites.length ? <div className="field"><label htmlFor="in-site">Site</label><select id="in-site" className="select" value={f.site} onChange={(e) => set('site', e.target.value)}><option value="">Any</option>{me.sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div> : null}
        <div className="field"><label htmlFor="in-from">From</label><input id="in-from" type="date" className="input" value={f.from} onChange={(e) => set('from', e.target.value)} /></div>
        <div className="field"><label htmlFor="in-to">To</label><input id="in-to" type="date" className="input" value={f.to} onChange={(e) => set('to', e.target.value)} /></div>
        {me.can.view ? <label className="checkbox mt-field-end"><input type="checkbox" checked={f.notifiable === '1'} onChange={(e) => set('notifiable', e.target.checked ? '1' : '')} /> Notification to decide or record</label> : null}
        {me.can.view ? <label className="checkbox mt-field-end"><input type="checkbox" checked={f.investigate === '1'} onChange={(e) => set('investigate', e.target.checked ? '1' : '')} /> To investigate</label> : null}
      </FilterPanel>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : !q.data.incidents.length ? <EmptyState icon="flag" title="No incidents here">Anyone in the company can report one, from a phone.</EmptyState> : (
        <div className="crm-table-scroll">
          <table className="data-table mt-table">
            <thead><tr><th>Incident</th><th>When</th><th>Kind</th><th>Where</th><th>Severity</th><th>Status</th><th>Notification</th></tr></thead>
            <tbody>
              {q.data.incidents.map((i) => (
                <tr key={i.id}>
                  <td data-label="Incident"><Link to={whsPage(companyId, `/incidents/${i.id}`)} className="mt-primary"><span className="mt-num">{i.number}</span> {i.title}</Link> {i.confidential ? <ConfidentialBadge /> : null} {i.serious ? <span className="badge danger">Serious</span> : null}</td>
                  <td data-label="When">{dateText(i.occurredDate)} {i.occurredTime}</td>
                  <td data-label="Kind">{i.kindLabel}</td>
                  <td data-label="Where">{[i.siteName, i.location].filter(Boolean).join(', ')}</td>
                  <td data-label="Severity">{i.severityLabel ?? ''}</td>
                  <td data-label="Status"><StatusBadge status={i.status} label={i.statusLabel} /></td>
                  <td data-label="Notification">{i.notificationStatus && i.notificationStatus !== 'not_assessed' ? i.notificationLabel : i.potentiallyNotifiable ? <span className="badge danger">May be notifiable</span> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const FLOW: [string, string][] = [
  ['reported', 'Reported'],
  ['immediate_response', 'Immediate response'],
  ['classified', 'Classified'],
  ['investigation', 'Investigation'],
  ['corrective_action', 'Corrective action'],
  ['verification', 'Verification'],
  ['closed', 'Closed'],
];

export function IncidentDetail({ companyId, me }: { companyId: string; me: WhsMe }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['whs', companyId, 'incident', id], queryFn: () => get<IncidentView>(whsPath(companyId, `/incidents/${id}?today=${localToday()}`)), retry: false });
  usePageTitle(q.data ? `${q.data.incident.number} ${q.data.incident.title}` : 'Incident');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const i = v.incident;
  const base = whsPage(companyId, `/incidents/${i.id}`);
  const tab = (to: string, text: string) => <NavLink to={`${base}${to}`} end className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{text}</NavLink>;
  return (
    <div className="stack whs-detail">
      <div className="mt-path"><Link to={whsPage(companyId, '/incidents')}>Incidents</Link><span className="sep">/</span><span>{i.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{i.number}</span> {i.title}</h2>
          <div className="mt-badges"><StatusBadge status={i.status} label={i.statusLabel} /><span className="badge">{i.kindLabel}</span>{i.severityLabel ? <span className="badge">{i.severityLabel}</span> : null}{i.serious ? <span className="badge danger">Serious</span> : null}{i.confidential ? <ConfidentialBadge /> : null}{i.potentiallyNotifiable && i.notificationStatus === 'not_assessed' ? <span className="badge danger">May be notifiable: decide</span> : null}</div>
        </div>
      </div>
      <Stepper steps={FLOW} current={i.status} />
      {i.full ? (
        <nav className="tabs whs-subtabs" aria-label="Incident sections">
          {tab('', 'Details')}
          {tab('/investigation', `Investigation${v.investigation ? '' : ''}`)}
          {tab('/notification', 'Regulator notification')}
          {v.can.health ? tab('/health', 'Health (confidential)') : null}
        </nav>
      ) : null}
      <Routes>
        <Route index element={<IncidentMain companyId={companyId} me={me} view={v} refetch={() => void q.refetch()} />} />
        <Route path="investigation" element={<InvestigationTab companyId={companyId} me={me} view={v} />} />
        <Route path="notification" element={<NotificationTab companyId={companyId} me={me} incidentId={i.id} />} />
        <Route path="health" element={<HealthTab companyId={companyId} me={me} incident={i} />} />
      </Routes>
    </div>
  );
}

type MainDialog = null | 'respond' | 'classify' | 'investigate' | 'close' | 'reopen' | 'action' | 'link' | 'edit';

function IncidentMain({ companyId, me, view: v, refetch }: { companyId: string; me: WhsMe; view: IncidentView; refetch: () => void }) {
  const [dialog, setDialog] = useState<MainDialog>(null);
  const act = useWhsAct(companyId);
  const i = v.incident;
  const advance = (to: string, done: string, note?: string) => act(() => post(whsPath(companyId, `/incidents/${i.id}/advance`), { to, note }), done);
  if (!i.full) {
    return (
      <div className="stack">
        <Section title="Your report">
          <Props items={[['What happened', i.description], ['When', `${dateText(i.occurredDate)} ${i.occurredTime}`], ['Site', i.siteName], ['Where', i.location], ['Reported', dayText(i.reportedAt)], ['Where it stands', i.statusLabel]]} />
          <p className="muted small">A WHS officer or manager follows it up. Investigation details and medical information are not shown here.</p>
        </Section>
        <Section title="Photos and documents" actions={v.can.addFiles ? <WhsUpload companyId={companyId} kind="incident" id={i.id} onDone={refetch} /> : null}>
          <WhsFiles companyId={companyId} files={v.files} onRemoved={refetch} />
        </Section>
      </div>
    );
  }
  return (
    <div className="stack">
      <div className="row wrap whs-step-actions">
        {v.can.respond ? <button className="btn primary" onClick={() => setDialog('respond')}>Record the immediate response</button> : null}
        {v.can.classify ? <button className={`btn${i.status === 'immediate_response' ? ' primary' : ''}`} onClick={() => setDialog('classify')}>{i.classifiedAt ? 'Classify again' : 'Classify'}</button> : null}
        {v.can.investigate ? <button className="btn primary" onClick={() => setDialog('investigate')}>Start the investigation</button> : null}
        {v.can.toCorrective ? <button className="btn" onClick={() => void advance('corrective_action', 'Corrective action')}>To corrective action</button> : null}
        {v.can.toVerification ? <button className="btn" onClick={() => void advance('verification', 'Ready for verification')}>Ready for verification</button> : null}
        {v.can.close ? <button className="btn primary" onClick={() => setDialog('close')}><Icon name="check" /> Verify and close</button> : null}
        {v.can.reopen ? <button className="btn ghost" onClick={() => setDialog('reopen')}>Reopen</button> : null}
        {v.can.edit ? <button className="btn ghost" onClick={() => setDialog('edit')}><Icon name="edit" /> Edit</button> : null}
      </div>
      {i.serious ? <p className="whs-warning small" role="note"><Icon name="alert" size={16} /> A serious incident: the WHS managers were alerted. Check the regulator notification tab: the rules of the site’s jurisdiction, and the decision a WHS manager records.</p> : null}
      <div className="qc-two">
        <Section title="What happened">
          <Props items={[
            ['Description', i.description],
            ['When', `${dateText(i.occurredDate)} ${i.occurredTime}`],
            ['Site', i.siteName],
            ['Where', i.location],
            ['Department', i.departmentName],
            ['Activity', i.activity],
            ['People involved', i.peopleInvolved],
            ['Witnesses', i.witnesses],
            ['Assets involved', [i.assetLabel, i.assetsText].filter(Boolean).join('; ')],
            ['Reported', `${dateTimeText(i.reportedAt)}${i.reportedByName ? ` by ${i.reportedByName}` : ''}`],
          ]} />
        </Section>
        <Section title="Response and classification">
          <Props items={[
            ['Immediate response', i.immediateResponse],
            ['First aid', i.firstAid ? 'Given' : ''],
            ['Initial notification', i.initialNotification],
            ['Outcome', i.outcomeLabel],
            ['Body part', i.bodyPart],
            ['Nature of injury', i.injuryNature],
            ['Severity', i.severityLabel],
            ['Investigation', i.investigationRequired ? 'Required' : 'Not required'],
            ['Classified', i.classifiedAt ? `${dayText(i.classifiedAt)}${i.classifiedByName ? ` by ${i.classifiedByName}` : ''}` : 'Not yet'],
            ['Health details', v.healthRecorded ? (v.can.health ? 'Recorded: see the confidential tab' : 'Recorded, seen only by health officers') : ''],
            ['Closed', i.closedAt ? `${dayText(i.closedAt)}${i.closedByName ? ` by ${i.closedByName}` : ''}: ${i.closureNote}` : ''],
          ]} />
        </Section>
      </div>
      <Section title={`Corrective and preventive actions (${v.actions.length})`} actions={v.can.actions ? <button className="btn sm" onClick={() => setDialog('action')}><Icon name="plus" size={14} /> New action</button> : null}>
        {v.actions.length ? <ActionRows companyId={companyId} actions={v.actions} /> : <p className="muted small">No actions yet.</p>}
      </Section>
      <Section title="Linked records" actions={me.can.assess ? <button className="btn sm" onClick={() => setDialog('link')}><Icon name="link" size={14} /> Link</button> : null}>
        <LinkList companyId={companyId} links={v.links} />
      </Section>
      <Section title="Photos and documents" actions={v.can.addFiles ? <WhsUpload companyId={companyId} kind="incident" id={i.id} onDone={refetch} /> : null}>
        <WhsFiles companyId={companyId} files={v.files} onRemoved={refetch} canRemove={me.can.approve} />
      </Section>
      <Section title="Notes and consultation">
        <Comments companyId={companyId} entityType="incident" entityId={i.id} comments={v.comments} canNote={me.can.view} canConsult={v.can.consult} />
      </Section>
      {v.revisions.length ? (
        <Section title="Changes after classification">
          <p className="muted small">Recorded by the database itself: the record cannot be changed without a trace, and it is never deleted.</p>
          <ol className="mt-history">
            {v.revisions.map((r) => (
              <li key={r.id}>
                <div className="small muted">{dateTimeText(r.at)}</div>
                <ul className="mt-changes small">{r.changes.map((c) => <li key={c.field}>{c.field.replace(/_/g, ' ')}: {String(c.before ?? '(empty)') || '(empty)'} → {String(c.after ?? '(empty)') || '(empty)'}</li>)}</ul>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
      {v.history.length ? <Section title="History"><History events={v.history as any} /></Section> : null}

      {dialog === 'respond' ? <RespondDialog companyId={companyId} incident={i} onClose={() => setDialog(null)} /> : null}
      {dialog === 'classify' ? <ClassifyDialog companyId={companyId} me={me} incident={i} onClose={() => setDialog(null)} /> : null}
      {dialog === 'investigate' ? <StartInvestigation companyId={companyId} me={me} incident={i} onClose={() => setDialog(null)} /> : null}
      {dialog === 'close' ? <NoteDialog title={`Close ${i.number}`} label="How were the corrective actions verified?" confirm="Close the incident" required intro={<p className="muted small">Every action must be verified, and the notification decision and any submission recorded, before it is closed.</p>} onClose={() => setDialog(null)} onSave={(note) => advance('closed', `${i.number} closed`, note)} /> : null}
      {dialog === 'reopen' ? <NoteDialog title={`Reopen ${i.number}`} label="Why?" confirm="Reopen" required onClose={() => setDialog(null)} onSave={(note) => advance('reopen', `${i.number} reopened`, note)} /> : null}
      {dialog === 'action' ? <RaiseActionDialog companyId={companyId} me={me} source={{ type: 'incident', id: i.id, label: i.number }} onClose={() => setDialog(null)} /> : null}
      {dialog === 'link' ? <LinkDialog companyId={companyId} from={{ type: 'incident', id: i.id }} onClose={() => setDialog(null)} /> : null}
      {dialog === 'edit' ? <EditIncident companyId={companyId} me={me} incident={i} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

function RespondDialog({ companyId, incident, onClose }: { companyId: string; incident: Incident; onClose: () => void }) {
  const [text, setText] = useState(incident.immediateResponse ?? '');
  const [firstAid, setFirstAid] = useState(!!incident.firstAid);
  const [told, setTold] = useState(incident.initialNotification ?? '');
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, `/incidents/${incident.id}/respond`), { immediateResponse: text, firstAid, initialNotification: told || undefined }), 'Immediate response recorded')) onClose();
  };
  return (
    <Modal title="Immediate response" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!text.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="rs-text">What was done straight away?</label><textarea id="rs-text" className="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} /></div>
        <label className="checkbox"><input type="checkbox" checked={firstAid} onChange={(e) => setFirstAid(e.target.checked)} /> First aid was given</label>
        <div className="field"><label htmlFor="rs-told">Who was told, and how?</label><input id="rs-told" className="input" value={told} onChange={(e) => setTold(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function ClassifyDialog({ companyId, me, incident, onClose }: { companyId: string; me: WhsMe; incident: Incident; onClose: () => void }) {
  const [f, setF] = useState({ kind: incident.kind, severity: incident.severity ?? 'minor', outcome: incident.outcome ?? 'none', bodyPart: incident.bodyPart ?? '', injuryNature: incident.injuryNature ?? '', note: '' });
  const [investigate, setInvestigate] = useState(!!incident.investigationRequired);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, `/incidents/${incident.id}/classify`), { ...f, note: f.note || undefined, investigationRequired: investigate }), `${incident.number} classified`)) onClose();
  };
  return (
    <Modal wide title={`Classify ${incident.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save the classification</button></>}>
      <div className="stack">
        <p className="muted small">The classification is the record of what happened to the person. Medical details stay in the confidential health record. After this, every change to the incident is tracked.</p>
        <div className="form-grid">
          <div className="field"><label htmlFor="cl-kind">Kind</label><select id="cl-kind" className="select" value={f.kind} onChange={set('kind')} disabled={incident.confidential}>{options(me.lists.incidentKinds)}</select></div>
          <div className="field"><label htmlFor="cl-sev">Severity</label><select id="cl-sev" className="select" value={f.severity} onChange={set('severity')}>{options(me.lists.severities)}</select></div>
          <div className="field"><label htmlFor="cl-out">Outcome</label><select id="cl-out" className="select" value={f.outcome} onChange={set('outcome')}>{options(me.lists.outcomes)}</select></div>
          <div className="field"><label htmlFor="cl-body">Body part</label><input id="cl-body" className="input" value={f.bodyPart} onChange={set('bodyPart')} /></div>
          <div className="field"><label htmlFor="cl-nature">Nature of injury or illness</label><input id="cl-nature" className="input" value={f.injuryNature} onChange={set('injuryNature')} /></div>
          <label className="checkbox mt-field-end"><input type="checkbox" checked={investigate} onChange={(e) => setInvestigate(e.target.checked)} /> To be investigated</label>
          <div className="field span-2"><label htmlFor="cl-note">Note (optional)</label><input id="cl-note" className="input" value={f.note} onChange={set('note')} /></div>
        </div>
      </div>
    </Modal>
  );
}

function EditIncident({ companyId, me, incident, onClose }: { companyId: string; me: WhsMe; incident: Incident; onClose: () => void }) {
  const [f, setF] = useState({ title: incident.title, description: incident.description, occurredDate: incident.occurredDate, occurredTime: incident.occurredTime, siteId: incident.siteId ?? '', location: incident.location, activity: incident.activity ?? '', peopleInvolved: incident.peopleInvolved ?? '', witnesses: incident.witnesses ?? '', assetsText: incident.assetsText ?? '' });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => patch(whsPath(companyId, `/incidents/${incident.id}`), { ...f, siteId: f.siteId || null, occurredAt: localMs(f.occurredDate, f.occurredTime) }), 'Saved')) onClose();
  };
  return (
    <Modal wide title={`Edit ${incident.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        {incident.classifiedAt ? <p className="span-2 whs-warning small"><Icon name="info" size={14} /> This incident is classified: every change is recorded with its before and after values.</p> : null}
        <div className="field span-2"><label htmlFor="ei-title">Title</label><input id="ei-title" className="input" value={f.title} onChange={set('title')} /></div>
        <div className="field"><label htmlFor="ei-date">Date</label><input id="ei-date" type="date" className="input" value={f.occurredDate} onChange={set('occurredDate')} /></div>
        <div className="field"><label htmlFor="ei-time">Time</label><input id="ei-time" type="time" className="input" value={f.occurredTime} onChange={set('occurredTime')} /></div>
        <div className="field"><label htmlFor="ei-site">Site</label><select id="ei-site" className="select" value={f.siteId} onChange={set('siteId')}><option value="">Not at a site</option>{me.sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div className="field"><label htmlFor="ei-loc">Where</label><input id="ei-loc" className="input" value={f.location} onChange={set('location')} /></div>
        <div className="field span-2"><label htmlFor="ei-desc">What happened</label><textarea id="ei-desc" className="textarea" rows={3} value={f.description} onChange={set('description')} /></div>
        <div className="field"><label htmlFor="ei-act">Activity</label><input id="ei-act" className="input" value={f.activity} onChange={set('activity')} /></div>
        <div className="field"><label htmlFor="ei-assets">Assets involved</label><input id="ei-assets" className="input" value={f.assetsText} onChange={set('assetsText')} /></div>
        <div className="field span-2"><label htmlFor="ei-people">People involved</label><textarea id="ei-people" className="textarea" rows={2} value={f.peopleInvolved} onChange={set('peopleInvolved')} /></div>
        <div className="field span-2"><label htmlFor="ei-wit">Witnesses</label><textarea id="ei-wit" className="textarea" rows={2} value={f.witnesses} onChange={set('witnesses')} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ investigation

function StartInvestigation({ companyId, me, incident, onClose }: { companyId: string; me: WhsMe; incident: Incident; onClose: () => void }) {
  const [lead, setLead] = useState(me.user.id);
  const [team, setTeam] = useState<string[]>([]);
  const [method, setMethod] = useState('five_whys');
  const [scope, setScope] = useState('');
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, `/incidents/${incident.id}/investigation`), { leadId: lead, team, method, scope: scope || undefined }), 'Investigation started')) onClose();
  };
  return (
    <Modal title={`Investigate ${incident.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Start</button></>}>
      <div className="stack">
        <PersonSelect me={me} id="iv-lead" value={lead} onChange={setLead} label="Lead investigator" optional={false} />
        <fieldset className="erp-checks"><legend className="small">Team</legend>{me.people.filter((p) => p.id !== lead).map((p) => <label key={p.id} className="checkbox"><input type="checkbox" checked={team.includes(p.id)} onChange={(e) => setTeam(e.target.checked ? [...team, p.id] : team.filter((x) => x !== p.id))} /> {p.name}</label>)}</fieldset>
        <div className="field"><label htmlFor="iv-method">Method</label><select id="iv-method" className="select" value={method} onChange={(e) => setMethod(e.target.value)}>{options(me.lists.invMethods)}</select></div>
        <div className="field"><label htmlFor="iv-scope">Scope</label><textarea id="iv-scope" className="textarea" rows={2} value={scope} onChange={(e) => setScope(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function InvestigationTab({ companyId, me, view }: { companyId: string; me: WhsMe; view: IncidentView }) {
  const inv = view.investigation;
  const [dialog, setDialog] = useState<null | 'analysis' | 'timeline' | 'statement' | 'approve' | 'return' | 'action'>(null);
  const act = useWhsAct(companyId);
  if (!inv) {
    return (
      <Section title="Investigation">
        <p className="muted small">{view.incident.investigationRequired ? 'This incident is to be investigated.' : 'No investigation.'} An investigation is started once the incident is classified.</p>
        {view.can.investigate ? <StartButton companyId={companyId} me={me} incident={view.incident} /> : null}
      </Section>
    );
  }
  const call = (path: string, body: unknown, done: string) => act(() => post(whsPath(companyId, `/investigations/${inv.id}${path}`), body), done);
  return (
    <div className="stack">
      <div className="row wrap whs-step-actions">
        <StatusBadge status={inv.status} label={`${inv.number}: ${inv.statusLabel}`} />
        {inv.can.edit ? <button className="btn" onClick={() => setDialog('analysis')}><Icon name="edit" /> Root cause analysis</button> : null}
        {inv.can.edit ? <button className="btn" onClick={() => setDialog('timeline')}>Add to the timeline</button> : null}
        {inv.can.edit ? <button className="btn" onClick={() => setDialog('statement')}>Record a statement</button> : null}
        {inv.can.submit ? <button className="btn primary" disabled={!inv.rootCause} title={inv.rootCause ? '' : 'Record the root cause first'} onClick={() => void call('/submit', {}, 'Submitted for approval')}>Submit for approval</button> : null}
        {inv.can.approve ? <button className="btn primary" onClick={() => setDialog('approve')}>Approve</button> : null}
        {inv.can.approve ? <button className="btn" onClick={() => setDialog('return')}>Return for changes</button> : null}
        {me.can.assess && inv.status === 'approved' ? <button className="btn" onClick={() => setDialog('action')}><Icon name="plus" /> Corrective action</button> : null}
      </div>
      <div className="qc-two">
        <Section title="Team and scope">
          <Props items={[['Lead', inv.leadName], ['Team', inv.team.map((t) => t.name).join(', ')], ['Method', inv.methodLabel], ['Scope', inv.scope], ['Approved', inv.approvedAt ? `${dayText(inv.approvedAt)}${inv.approvedByName ? ` by ${inv.approvedByName}` : ''}${inv.approvalSod ? ' (one-person exception recorded)' : ''}` : ''], ['Approval note', inv.approvalNote]]} />
        </Section>
        <Section title="Timeline">
          {inv.timeline.length ? <ol className="whs-timeline">{inv.timeline.map((t) => <li key={t.id}><span className="mt-num">{t.at}</span> {t.description}</li>)}</ol> : <p className="muted small">No entries yet.</p>}
        </Section>
      </div>
      <Section title="Root cause">
        {inv.whys.length ? <ol className="qc-whys small">{inv.whys.map((w, k) => <li key={k}><span className="muted">Why {k + 1}:</span> {w}</li>)}</ol> : null}
        {Object.keys(inv.fishbone).length ? (
          <div className="whs-fishbone" aria-label="Fishbone (cause and effect)">
            {Object.entries(me.lists.fishbone).filter(([k]) => inv.fishbone[k]?.length).map(([k, label]) => <div key={k} className="whs-bone"><strong className="small">{label}</strong><ul className="small">{inv.fishbone[k].map((c, n) => <li key={n}>{c}</li>)}</ul></div>)}
          </div>
        ) : null}
        <Props items={[['Root cause', inv.rootCause], ['Contributing factors', inv.factors.join('; ')], ['Findings', inv.findings]]} />
        {inv.failedControls.length ? (
          <>
            <h3 className="erp-h3">Failed controls</h3>
            <ul className="erp-list small">{inv.failedControls.map((c, k) => <li key={k}><strong>{c.control}</strong>{c.hierarchy ? ` (${me.lists.hierarchy[c.hierarchy] ?? c.hierarchy})` : ''}{c.why ? `: ${c.why}` : ''}</li>)}</ul>
          </>
        ) : null}
      </Section>
      <Section title={`Witness statements (${inv.statementCount})`}>
        {inv.statements === null ? <p className="muted small">Statements are seen by the investigation team, investigators and WHS managers.</p> : inv.statements.length ? (
          <ul className="mt-comments">{inv.statements.map((s) => <li key={s.id}><div className="small"><strong>{s.witness}</strong> <span className="muted">{s.takenOn ? dateText(s.takenOn) : dayText(s.createdAt)}{s.takenByName ? `, taken by ${s.takenByName}` : ''}</span></div><div className="mt-pre">{s.statement}</div></li>)}</ul>
        ) : <p className="muted small">No statements yet.</p>}
      </Section>
      <Section title="Evidence" actions={inv.can.edit ? <WhsUpload companyId={companyId} kind="investigation" id={inv.id} onDone={() => void act(async () => null, '')} label="Add evidence" /> : null}>
        <WhsFiles companyId={companyId} files={inv.files} onRemoved={() => void act(async () => null, '')} canRemove={inv.can.edit} />
      </Section>
      {dialog === 'analysis' ? <AnalysisDialog companyId={companyId} me={me} inv={inv} onClose={() => setDialog(null)} /> : null}
      {dialog === 'timeline' ? <TimelineDialog companyId={companyId} inv={inv} onClose={() => setDialog(null)} /> : null}
      {dialog === 'statement' ? <StatementDialog companyId={companyId} inv={inv} onClose={() => setDialog(null)} /> : null}
      {dialog === 'approve' ? <NoteDialog title={`Approve ${inv.number}`} label="Note (optional)" confirm="Approve" onClose={() => setDialog(null)} onSave={(note) => call('/approve', { decision: 'approve', note: note || undefined }, 'Approved')} /> : null}
      {dialog === 'return' ? <NoteDialog title={`Return ${inv.number}`} label="What should change?" confirm="Return" required onClose={() => setDialog(null)} onSave={(note) => call('/approve', { decision: 'return', note }, 'Returned')} /> : null}
      {dialog === 'action' ? <RaiseActionDialog companyId={companyId} me={me} source={{ type: 'investigation', id: inv.id, label: inv.number }} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

function StartButton({ companyId, me, incident }: { companyId: string; me: WhsMe; incident: Incident }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>Start the investigation</button>
      {open ? <StartInvestigation companyId={companyId} me={me} incident={incident} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

function AnalysisDialog({ companyId, me, inv, onClose }: { companyId: string; me: WhsMe; inv: Investigation; onClose: () => void }) {
  const [whys, setWhys] = useState<string[]>([...inv.whys, '', '', '', '', ''].slice(0, 5));
  const [bones, setBones] = useState<Record<string, string>>(Object.fromEntries(Object.keys(me.lists.fishbone).map((k) => [k, (inv.fishbone[k] ?? []).join('\n')])));
  const [rootCause, setRootCause] = useState(inv.rootCause);
  const [factors, setFactors] = useState(inv.factors.join('\n'));
  const [failed, setFailed] = useState(inv.failedControls.map((c) => `${c.control}${c.why ? ` | ${c.why}` : ''}`).join('\n'));
  const [findings, setFindings] = useState(inv.findings);
  const act = useWhsAct(companyId);
  const save = async () => {
    const body = {
      whys: whys.map((w) => w.trim()).filter(Boolean),
      fishbone: Object.fromEntries(Object.entries(bones).map(([k, v]) => [k, lines(v)])),
      rootCause,
      factors: lines(factors),
      failedControls: lines(failed).map((l) => {
        const [control, why] = l.split('|').map((x) => x.trim());
        return { control, why: why ?? '' };
      }),
      findings,
    };
    if (await act(() => patch(whsPath(companyId, `/investigations/${inv.id}`), body), 'Saved')) onClose();
  };
  return (
    <Modal xl title={`Root cause analysis: ${inv.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="stack">
        <fieldset className="whs-action-form"><legend>Five whys</legend>
          {whys.map((w, k) => <div key={k} className="field"><label htmlFor={`why-${k}`}>Why {k + 1}</label><input id={`why-${k}`} className="input" value={w} onChange={(e) => setWhys(whys.map((x, n) => (n === k ? e.target.value : x)))} /></div>)}
        </fieldset>
        <fieldset className="whs-action-form"><legend>Fishbone: causes by category, one a line</legend>
          <div className="form-grid">{Object.entries(me.lists.fishbone).map(([k, label]) => <div key={k} className="field"><label htmlFor={`bone-${k}`}>{label}</label><textarea id={`bone-${k}`} className="textarea" rows={2} value={bones[k]} onChange={(e) => setBones({ ...bones, [k]: e.target.value })} /></div>)}</div>
        </fieldset>
        <div className="field"><label htmlFor="an-root">Root cause</label><textarea id="an-root" className="textarea" rows={2} value={rootCause} onChange={(e) => setRootCause(e.target.value)} /></div>
        <div className="field"><label htmlFor="an-factors">Contributing factors, one a line</label><textarea id="an-factors" className="textarea" rows={2} value={factors} onChange={(e) => setFactors(e.target.value)} /></div>
        <div className="field"><label htmlFor="an-failed">Failed controls, one a line: the control | why it failed</label><textarea id="an-failed" className="textarea" rows={2} value={failed} onChange={(e) => setFailed(e.target.value)} /></div>
        <div className="field"><label htmlFor="an-findings">Findings</label><textarea id="an-findings" className="textarea" rows={3} value={findings} onChange={(e) => setFindings(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function TimelineDialog({ companyId, inv, onClose }: { companyId: string; inv: Investigation; onClose: () => void }) {
  const [at, setAt] = useState(`${localToday()} ${localTime()}`);
  const [text, setText] = useState('');
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, `/investigations/${inv.id}/timeline`), { at, description: text }), 'Added')) onClose();
  };
  return (
    <Modal title="Add to the timeline" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!at.trim() || !text.trim()} onClick={() => void save()}>Add</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="tl-at">When</label><input id="tl-at" className="input" value={at} onChange={(e) => setAt(e.target.value)} /></div>
        <div className="field"><label htmlFor="tl-text">What happened</label><textarea id="tl-text" className="textarea" rows={2} value={text} onChange={(e) => setText(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function StatementDialog({ companyId, inv, onClose }: { companyId: string; inv: Investigation; onClose: () => void }) {
  const [witness, setWitness] = useState('');
  const [on, setOn] = useState(localToday());
  const [text, setText] = useState('');
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, `/investigations/${inv.id}/statements`), { witness, takenOn: on || null, statement: text }), 'Statement recorded')) onClose();
  };
  return (
    <Modal wide title="Witness statement" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!witness.trim() || !text.trim()} onClick={() => void save()}>Record</button></>}>
      <div className="stack">
        <div className="whs-two">
          <div className="field"><label htmlFor="st-w">Witness</label><input id="st-w" className="input" value={witness} onChange={(e) => setWitness(e.target.value)} /></div>
          <div className="field"><label htmlFor="st-on">Taken on</label><input id="st-on" type="date" className="input" value={on} onChange={(e) => setOn(e.target.value)} /></div>
        </div>
        <div className="field"><label htmlFor="st-text">Statement</label><textarea id="st-text" className="textarea" rows={6} value={text} onChange={(e) => setText(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ regulatory notification

function NotificationTab({ companyId, me, incidentId }: { companyId: string; me: WhsMe; incidentId: string }) {
  const q = useQuery({ queryKey: ['whs', companyId, 'notification', incidentId], queryFn: () => get<NotificationView>(whsPath(companyId, `/incidents/${incidentId}/notification`)), retry: false });
  const act = useWhsAct(companyId);
  const [decide, setDecide] = useState<string | null>(null);
  const [submit, setSubmit] = useState<string | null>(null);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const n = q.data;
  return (
    <div className="stack">
      <LegalNotice text={n.notice} />
      <p className="whs-warning small" role="note"><Icon name="info" size={14} /> {n.noSubmission}</p>
      <Section title="The rules of the site’s jurisdictions" actions={n.can.evaluate ? <button className="btn sm" onClick={() => void act(() => post(whsPath(companyId, `/incidents/${incidentId}/notification/evaluate`), {}), 'Checked again')}><Icon name="refresh" size={14} /> Check again</button> : null}>
        {!n.incident.siteId ? <p className="muted small">The incident has no site, so no jurisdiction’s rules can be checked. Choose its site first.</p> : !n.packs.length ? <p className="muted small">{n.incident.siteName} has no jurisdiction yet. A WHS manager chooses it in WHS settings.</p> : null}
        {n.checks.length ? (
          <ul className="erp-list">
            {n.checks.map((c) => (
              <li key={c.id} className="card card-pad stack whs-rule-check">
                <div className="row wrap">
                  <strong className="grow">{c.pack?.name}: {c.rule?.title} <span className="muted small">(version {c.ruleVersion})</span></strong>
                  {c.verified ? <span className="badge success">Verified</span> : <span className="badge warning">Not verified</span>}
                  {c.verified ? (c.matches ? <span className="badge danger">Potentially notifiable</span> : <span className="badge">Not covered</span>) : null}
                </div>
                {c.verified && c.matches ? (
                  <p className="small"><strong>Due by {dateTimeText(c.dueAt)}</strong> {c.dueNote ? <span className="muted">{c.dueNote}</span> : <span className="muted">(from the verified rule’s deadline)</span>}</p>
                ) : <p className="small"><strong>{c.dueNote}</strong></p>}
                {c.rule ? (
                  <details className="whs-more"><summary className="small">What the rule says</summary>
                    <Props items={[['Provision', c.rule.provision], ['Text', c.rule.body], ['Deadline', c.rule.deadlineText], ['Required information', c.rule.requiredInfo.join('; ')], ['Site preservation', c.rule.sitePreservation], ['Who notifies', c.rule.responsibleParty], ['How', c.rule.procedure], ['Regulator', c.rule.regulator], ['Official source', <a href={c.rule.sourceUrl} target="_blank" rel="noopener noreferrer">{c.rule.sourceUrl}</a>], ['In effect', c.rule.effectiveFrom ? `From ${dateText(c.rule.effectiveFrom)}${c.rule.effectiveTo ? ` to ${dateText(c.rule.effectiveTo)}` : ''}` : 'Effective date not verified']]} />
                  </details>
                ) : null}
                <p className="muted small">Checked {dateTimeText(c.evaluatedAt)}. Each check is kept as it was; a later version of the rule never changes it.</p>
              </li>
            ))}
          </ul>
        ) : n.packs.length ? <p className="muted small">The site’s jurisdictions have no notification rule in effect on {dateText(n.incident.occurredDate)}.</p> : null}
      </Section>
      {n.packs.map((p) => {
        const notice = n.notices.find((x) => x.packId === p.id);
        return (
          <Section key={p.id} title={`Notification to ${p.regulator}`} actions={n.can.decide && notice?.status !== 'submitted' ? <button className="btn sm primary" onClick={() => setDecide(p.id)}>{notice ? 'Change the decision' : 'Record the decision'}</button> : null}>
            {!notice ? <p className="muted small">No decision yet. {n.can.decide ? 'Only you, as an authorised person, decide whether it is notifiable: BIZOMAT never decides it.' : 'A WHS manager decides whether it is notifiable.'}</p> : (
              <div className="stack">
                {notice.example ? <p className="whs-example small"><Icon name="info" size={14} /> Example data: this record shows how a notification is kept. No regulator was contacted.</p> : null}
                <Props items={[
                  ['Status', <StatusBadge status={notice.status} label={notice.statusLabel} />],
                  ['Decision', notice.decision ? `${notice.decision === 'notifiable' ? 'Notifiable' : 'Not notifiable'}, by ${notice.decidedByName ?? 'an authorised person'} on ${dateTimeText(notice.decidedAt)}` : 'Being assessed'],
                  ['Reasons', notice.decisionReasons],
                  ['Responsible for notifying', notice.responsibleName],
                  ['Due', notice.decision === 'notifiable' ? (notice.dueAt ? dateTimeText(notice.dueAt) : notice.dueNote) : ''],
                  ['Submitted', notice.submittedAt ? `${dateTimeText(notice.submittedAt)} by ${notice.submittedByName ?? ''}, ${notice.methodLabel.toLowerCase()}` : ''],
                  ['Regulator’s reference', notice.reference],
                  ['Notes', notice.submissionNotes],
                  ['Recorded', notice.recordedAt ? `${dateTimeText(notice.recordedAt)} by ${notice.recordedByName ?? ''}` : ''],
                ]} />
                {notice.decision === 'notifiable' ? <Checklist companyId={companyId} incidentId={incidentId} notice={notice} canEdit={notice.status !== 'submitted' && (n.can.decide || notice.responsibleId === me.user.id)} /> : null}
                <div className="stack">
                  <div className="row wrap"><h3 className="erp-h3 grow">Confirmation and supporting documents</h3>{notice.status !== 'submitted' || notice.files.length === 0 ? (n.can.decide || notice.responsibleId === me.user.id ? <WhsUpload companyId={companyId} kind="notice" id={notice.id} onDone={() => void q.refetch()} label="Attach" /> : null) : null}</div>
                  <NoticeFiles companyId={companyId} files={notice.files} onChange={() => void q.refetch()} canRemove={notice.status !== 'submitted'} />
                </div>
                {notice.status === 'to_submit' && (n.can.decide || notice.responsibleId === me.user.id) ? <div className="row"><button className="btn primary" onClick={() => setSubmit(notice.id)}>Record the submission</button></div> : null}
              </div>
            )}
          </Section>
        );
      })}
      {decide ? <DecisionDialog companyId={companyId} me={me} incidentId={incidentId} packId={decide} existing={n.notices.find((x) => x.packId === decide) ?? null} regulator={n.packs.find((p) => p.id === decide)!.regulator} onClose={() => setDecide(null)} /> : null}
      {submit ? <SubmissionDialog companyId={companyId} me={me} incidentId={incidentId} noticeId={submit} onClose={() => setSubmit(null)} /> : null}
    </div>
  );
}

function NoticeFiles({ companyId, files, onChange, canRemove }: { companyId: string; files: WhsFile[]; onChange: () => void; canRemove: boolean }) {
  return <WhsFiles companyId={companyId} files={files} onRemoved={onChange} canRemove={canRemove} />;
}

function Checklist({ companyId, incidentId, notice, canEdit }: { companyId: string; incidentId: string; notice: NotificationView['notices'][number]; canEdit: boolean }) {
  const act = useWhsAct(companyId);
  const toggle = (k: number, done: boolean) => void act(() => put(whsPath(companyId, `/incidents/${incidentId}/notification/${notice.id}/checklist`), { items: notice.checklist.map((x, n) => (n === k ? { ...x, done } : x)) }), '');
  return (
    <fieldset className="erp-checks whs-checklist">
      <legend className="erp-h3">Checklist ({notice.checklist.filter((x) => x.done).length} of {notice.checklist.length})</legend>
      {notice.checklist.map((x, k) => <label key={k} className="checkbox"><input type="checkbox" checked={x.done} disabled={!canEdit} onChange={(e) => toggle(k, e.target.checked)} /> {x.text}</label>)}
    </fieldset>
  );
}

function DecisionDialog({ companyId, me, incidentId, packId, regulator, existing, onClose }: { companyId: string; me: WhsMe; incidentId: string; packId: string; regulator: string; existing: NotificationView['notices'][number] | null; onClose: () => void }) {
  const [decision, setDecision] = useState(existing?.decision ?? 'notifiable');
  const [reasons, setReasons] = useState('');
  const [responsible, setResponsible] = useState(existing?.responsibleId ?? '');
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, `/incidents/${incidentId}/notification/decision`), { packId, decision, reasons, responsibleId: responsible || null }), 'Decision recorded')) onClose();
  };
  return (
    <Modal title={`Decision: notify ${regulator}?`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={reasons.trim().length < 3} onClick={() => void save()}>Record the decision</button></>}>
      <div className="stack">
        <p className="muted small">You decide, as an authorised person, from the law in force and the regulator’s guidance. BIZOMAT records your decision and reasons; it never decides.</p>
        <div className="field"><label htmlFor="dc-d">Decision</label><select id="dc-d" className="select" value={decision} onChange={(e) => setDecision(e.target.value)}><option value="notifiable">Notifiable: the regulator must be told</option><option value="not_notifiable">Not notifiable</option><option value="assessing">Still being assessed</option></select></div>
        <div className="field"><label htmlFor="dc-r">Reasons</label><textarea id="dc-r" className="textarea" rows={3} value={reasons} onChange={(e) => setReasons(e.target.value)} /></div>
        {decision === 'notifiable' ? <PersonSelect me={me} id="dc-resp" value={responsible} onChange={setResponsible} label="Who notifies the regulator" /> : null}
      </div>
    </Modal>
  );
}

function SubmissionDialog({ companyId, me, incidentId, noticeId, onClose }: { companyId: string; me: WhsMe; incidentId: string; noticeId: string; onClose: () => void }) {
  const [method, setMethod] = useState('online');
  const [date, setDate] = useState(localToday());
  const [time, setTime] = useState(localTime());
  const [by, setBy] = useState(me.user.id);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, `/incidents/${incidentId}/notification/${noticeId}/submission`), { method, submittedAt: localMs(date, time), submittedById: by, reference, notes: notes || undefined }), 'Submission recorded')) onClose();
  };
  return (
    <Modal title="Record the submission" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!reference.trim()} onClick={() => void save()}>Record it</button></>}>
      <div className="stack">
        <p className="muted small">Record a submission only once it has been made to the regulator. It cannot be changed afterwards.</p>
        <div className="field"><label htmlFor="sb-m">How it was made</label><select id="sb-m" className="select" value={method} onChange={(e) => setMethod(e.target.value)}>{options(me.lists.submissionMethods)}</select></div>
        <div className="whs-two">
          <div className="field"><label htmlFor="sb-d">Date</label><input id="sb-d" type="date" className="input" max={localToday()} value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="field"><label htmlFor="sb-t">Time</label><input id="sb-t" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        </div>
        <PersonSelect me={me} id="sb-by" value={by} onChange={setBy} label="Who made it" optional={false} />
        <div className="field"><label htmlFor="sb-ref">The regulator’s reference</label><input id="sb-ref" className="input" maxLength={200} value={reference} onChange={(e) => setReference(e.target.value)} /></div>
        <div className="field"><label htmlFor="sb-n">Notes</label><textarea id="sb-n" className="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <p className="muted small">Attach the regulator’s confirmation in the notification section.</p>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ the confidential health record

interface HealthView {
  health: { personName: string; personUserId: string | null; personUserName: string | null; treatment: string; provider: string; restrictions: string; daysLost: number | null; notes: string; updatedAt: number; updatedByName: string | null } | null;
  files: WhsFile[];
  history: { id: string; summary: string; actorName: string | null; at: number }[];
}

function HealthTab({ companyId, me, incident }: { companyId: string; me: WhsMe; incident: Incident }) {
  const q = useQuery({ queryKey: ['whs', companyId, 'health', incident.id], queryFn: () => get<HealthView>(whsPath(companyId, `/incidents/${incident.id}/health`)), retry: false });
  const [edit, setEdit] = useState(false);
  if (!me.can.health) return <p className="muted">Health details are confidential: only health officers read them.</p>;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const h = q.data.health;
  return (
    <div className="stack">
      <p className="whs-confidential-box small"><Icon name="lock" size={14} /> Confidential health information. Only health officers see this page. Supervisors, WHS managers and the person who reported it do not; the history records who changed it, never what it says.</p>
      <Section title="Medical treatment" actions={<button className="btn sm" onClick={() => setEdit(true)}><Icon name="edit" size={14} /> {h ? 'Edit' : 'Record'}</button>}>
        {h ? <Props items={[['Person', h.personUserName ?? h.personName], ['Treatment', h.treatment], ['Where', h.provider], ['Work restrictions', h.restrictions], ['Days lost', h.daysLost ?? ''], ['Notes', h.notes], ['Last changed', `${dateTimeText(h.updatedAt)}${h.updatedByName ? ` by ${h.updatedByName}` : ''}`]]} /> : <p className="muted small">Nothing recorded yet.</p>}
      </Section>
      <Section title="Medical documents" actions={<WhsUpload companyId={companyId} kind="health" id={incident.id} onDone={() => void q.refetch()} />}>
        <WhsFiles companyId={companyId} files={q.data.files} onRemoved={() => void q.refetch()} canRemove />
      </Section>
      {q.data.history.length ? <Section title="Who changed it"><ul className="erp-list small">{q.data.history.map((e) => <li key={e.id}>{e.summary} <span className="muted">{e.actorName ?? ''}, {dateTimeText(e.at)}</span></li>)}</ul></Section> : null}
      {edit ? <HealthDialog companyId={companyId} me={me} incidentId={incident.id} health={h} onClose={() => { setEdit(false); void q.refetch(); }} /> : null}
    </div>
  );
}

function HealthDialog({ companyId, me, incidentId, health, onClose }: { companyId: string; me: WhsMe; incidentId: string; health: HealthView['health']; onClose: () => void }) {
  const [f, setF] = useState({ personName: health?.personName ?? '', personUserId: health?.personUserId ?? '', treatment: health?.treatment ?? '', provider: health?.provider ?? '', restrictions: health?.restrictions ?? '', daysLost: health?.daysLost == null ? '' : String(health.daysLost), notes: health?.notes ?? '' });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => put(whsPath(companyId, `/incidents/${incidentId}/health`), { ...f, personUserId: f.personUserId || null, daysLost: f.daysLost === '' ? null : Number(f.daysLost) }), 'Saved')) onClose();
  };
  return (
    <Modal wide title="Confidential health record" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="hl-name">Person</label><input id="hl-name" className="input" value={f.personName} onChange={set('personName')} /></div>
        <PersonSelect me={me} id="hl-user" value={f.personUserId} onChange={(v) => setF((x) => ({ ...x, personUserId: v }))} label="Their account (if in the company)" />
        <div className="field span-2"><label htmlFor="hl-tr">Treatment</label><textarea id="hl-tr" className="textarea" rows={3} value={f.treatment} onChange={set('treatment')} /></div>
        <div className="field"><label htmlFor="hl-pr">Where it was given</label><input id="hl-pr" className="input" value={f.provider} onChange={set('provider')} /></div>
        <div className="field"><label htmlFor="hl-days">Days lost</label><input id="hl-days" type="number" min={0} max={3650} className="input" value={f.daysLost} onChange={set('daysLost')} /></div>
        <div className="field span-2"><label htmlFor="hl-re">Work restrictions</label><textarea id="hl-re" className="textarea" rows={2} value={f.restrictions} onChange={set('restrictions')} /></div>
        <div className="field span-2"><label htmlFor="hl-no">Notes</label><textarea id="hl-no" className="textarea" rows={2} value={f.notes} onChange={set('notes')} /></div>
      </div>
    </Modal>
  );
}
