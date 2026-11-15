// BIZOMAT WHS, Release 1: reporting a hazard or an incident, made for a phone (brief Test 14). The short form comes
// first, with large targets and the camera for photos; "More details" holds the rest. Anyone in the company may report.
// Medical treatment details, when given, go to the confidential health record that only health officers read.
import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, errorMessage, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { useToast } from '../../components/ui/overlays';
import { localMs, localTime, localToday, whsPage, whsPath, type WhsMe } from './api';
import { SiteSelect, options } from './common';

/** Photos chosen before the report exists; they are sent once it is made. */
function PhotoPicker({ files, setFiles }: { files: File[]; setFiles: (f: File[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="stack">
      <input ref={input} type="file" accept="image/*" capture="environment" className="sr-only" aria-label="Take or choose a photo" tabIndex={-1} onChange={(e) => { if (e.target.files?.length) setFiles([...files, ...Array.from(e.target.files)].slice(0, 6)); e.target.value = ''; }} />
      <button type="button" className="btn whs-big" onClick={() => input.current?.click()}><Icon name="image" /> {files.length ? 'Add another photo' : 'Take or add a photo'}</button>
      {files.length ? (
        <ul className="whs-chosen">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="row">
              <Icon name="image" size={14} /> <span className="grow ellipsis">{f.name}</span>
              <button type="button" className="btn ghost sm" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))}><Icon name="x" size={14} /></button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

async function sendFiles(companyId: string, kind: string, id: string, files: File[]) {
  for (const f of files) {
    const fd = new FormData();
    fd.set('file', f);
    fd.set('kind', kind);
    fd.set('id', id);
    await api(whsPath(companyId, '/files'), { method: 'POST', form: fd });
  }
}

function Done({ companyId, number, kind, id, extra }: { companyId: string; number: string; kind: 'hazard' | 'incident'; id: string; extra?: string }) {
  return (
    <section className="card card-pad stack whs-done" role="status">
      <h2 className="crm-subhead"><Icon name="check" /> Thank you: {number} is reported</h2>
      <p>A WHS officer or manager follows it up. You can see where it stands at any time.</p>
      {extra ? <p className="small">{extra}</p> : null}
      <div className="whs-report-buttons">
        <Link className="btn primary whs-big" to={whsPage(companyId, `/${kind === 'hazard' ? 'hazards' : 'incidents'}/${id}`)}>Open {number}</Link>
        <Link className="btn whs-big" to={whsPage(companyId)}>Back to Health and Safety</Link>
      </div>
    </section>
  );
}

function ConfidentialChoice({ me, value, onChange }: { me: WhsMe; value: boolean; onChange: (v: boolean) => void }) {
  const readers = me.confidentialReaders;
  return (
    <div className="whs-confidential-box">
      <label className="checkbox whs-check"><input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} /> Keep this report confidential</label>
      <p className="small muted">
        {readers.names.length ? `Only you and ${readers.names.join(', ')} will see it.` : 'Only you will see it until someone is given the WHS manager or health officer role.'}{' '}
        {readers.fallback ? 'Nobody is a WHS manager or health officer yet, so the company’s ERP administrators read confidential reports for now.' : ''}
      </p>
    </div>
  );
}

export function ReportHazard({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Report a hazard');
  const toast = useToast();
  const [f, setF] = useState({ title: '', category: '', siteId: me.sites.length === 1 ? me.sites[0].id : '', location: '', description: '', departmentId: '', activity: '', peopleExposed: '', consequenceText: '', existingControls: '', proposedControls: '' });
  const [confidential, setConfidential] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ id: string; number: string } | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const canConfidential = me.lists.confidentialCategories.includes(f.category);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      const h = await post<{ id: string; number: string }>(whsPath(companyId, '/hazards'), { ...body, confidential: canConfidential && confidential });
      try {
        await sendFiles(companyId, 'hazard', h.id, files);
      } catch (err) {
        toast(`${h.number} is reported, but a photo could not be added: ${errorMessage(err)}`, 'error');
      }
      setDone(h);
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  if (done) return <Done companyId={companyId} number={done.number} kind="hazard" id={done.id} />;
  return (
    <form className="card card-pad stack whs-report" onSubmit={submit}>
      <h2 className="crm-subhead">Report a hazard</h2>
      <p className="muted small">Something that could hurt someone. Tell us what and where; a photo helps.</p>
      <div className="field"><label htmlFor="hz-title">What is the hazard?</label><input id="hz-title" className="input whs-input" required maxLength={200} value={f.title} onChange={set('title')} placeholder="For example: oil on the floor by press 2" /></div>
      <div className="field"><label htmlFor="hz-category">What kind of hazard?</label><select id="hz-category" className="select whs-input" required value={f.category} onChange={set('category')}><option value="">Choose one</option>{options(me.lists.hazardCategories)}</select></div>
      {me.sites.length ? <SiteSelect me={me} id="hz-site" value={f.siteId} onChange={(v) => setF((x) => ({ ...x, siteId: v }))} label="Which site?" /> : null}
      <div className="field"><label htmlFor="hz-location">Where exactly?</label><input id="hz-location" className="input whs-input" maxLength={300} value={f.location} onChange={set('location')} placeholder="Building, area, machine" /></div>
      <PhotoPicker files={files} setFiles={setFiles} />
      {canConfidential ? <ConfidentialChoice me={me} value={confidential} onChange={setConfidential} /> : null}
      <details className="whs-more">
        <summary>More details (optional)</summary>
        <div className="stack">
          <div className="field"><label htmlFor="hz-desc">Describe it</label><textarea id="hz-desc" className="textarea" rows={3} maxLength={5000} value={f.description} onChange={set('description')} /></div>
          {me.departments.length ? <div className="field"><label htmlFor="hz-dept">Department</label><select id="hz-dept" className="select" value={f.departmentId} onChange={set('departmentId')}><option value="">Not chosen</option>{me.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div> : null}
          <div className="field"><label htmlFor="hz-activity">What work is being done there?</label><input id="hz-activity" className="input" maxLength={500} value={f.activity} onChange={set('activity')} /></div>
          <div className="field"><label htmlFor="hz-people">Who could be hurt?</label><input id="hz-people" className="input" maxLength={500} value={f.peopleExposed} onChange={set('peopleExposed')} /></div>
          <div className="field"><label htmlFor="hz-cons">What could happen?</label><textarea id="hz-cons" className="textarea" rows={2} maxLength={2000} value={f.consequenceText} onChange={set('consequenceText')} /></div>
          <div className="field"><label htmlFor="hz-existing">What is in place now?</label><textarea id="hz-existing" className="textarea" rows={2} maxLength={2000} value={f.existingControls} onChange={set('existingControls')} /></div>
          <div className="field"><label htmlFor="hz-proposed">What would fix it?</label><textarea id="hz-proposed" className="textarea" rows={2} maxLength={2000} value={f.proposedControls} onChange={set('proposedControls')} /></div>
        </div>
      </details>
      <button className="btn primary whs-big" disabled={busy || !f.title.trim() || !f.category}>{busy ? 'Sending…' : 'Send the report'}</button>
    </form>
  );
}

const SERIOUS_OUTCOMES = ['hospital_inpatient', 'fatality'];
const FIRST_KINDS = ['injury', 'near_miss', 'property_damage', 'dangerous_occurrence'];

export function ReportIncident({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Report an incident');
  const toast = useToast();
  const navigate = useNavigate();
  const [f, setF] = useState({ kind: '', title: '', occurredDate: localToday(), occurredTime: localTime(), siteId: me.sites.length === 1 ? me.sites[0].id : '', location: '', outcome: 'none', immediateResponse: '', description: '', peopleInvolved: '', witnesses: '', departmentId: '', activity: '', severity: '' });
  const [firstAid, setFirstAid] = useState(false);
  const [confidential, setConfidential] = useState(false);
  const [health, setHealth] = useState({ treatment: '', provider: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ id: string; number: string; serious: boolean } | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const kinds = me.lists.incidentKinds;
  const serious = SERIOUS_OUTCOMES.includes(f.outcome) || f.kind === 'dangerous_occurrence' || f.severity === 'serious' || f.severity === 'critical';
  const hurt = f.kind === 'injury' || f.kind === 'illness' || (f.outcome !== 'none' && f.outcome !== '');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body: Record<string, unknown> = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      body.occurredAt = localMs(f.occurredDate, f.occurredTime);
      body.firstAid = firstAid;
      body.confidential = f.kind === 'psychosocial' && confidential;
      if (health.treatment.trim() || health.provider.trim()) body.health = { treatment: health.treatment.trim(), provider: health.provider.trim() };
      const i = await post<{ id: string; number: string; serious: boolean }>(whsPath(companyId, '/incidents'), body);
      try {
        await sendFiles(companyId, 'incident', i.id, files);
      } catch (err) {
        toast(`${i.number} is reported, but a photo could not be added: ${errorMessage(err)}`, 'error');
      }
      setDone(i);
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  if (done) return <Done companyId={companyId} number={done.number} kind="incident" id={done.id} extra={done.serious ? 'It is serious: the WHS managers have been alerted.' : undefined} />;
  return (
    <form className="card card-pad stack whs-report" onSubmit={submit}>
      <h2 className="crm-subhead">Report an incident</h2>
      <p className="muted small">If someone needs help now, call for it first. Then tell us what happened.</p>
      <fieldset className="whs-kinds">
        <legend>What happened?</legend>
        <div className="whs-kind-grid" role="radiogroup" aria-label="Kind of incident">
          {[...FIRST_KINDS, ...Object.keys(kinds).filter((k) => !FIRST_KINDS.includes(k))].map((k) => (
            <label key={k} className={`whs-kind${f.kind === k ? ' active' : ''}`}>
              <input type="radio" name="incident-kind" value={k} checked={f.kind === k} onChange={() => setF((x) => ({ ...x, kind: k }))} /> {kinds[k]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field"><label htmlFor="in-title">In a few words</label><input id="in-title" className="input whs-input" required maxLength={200} value={f.title} onChange={set('title')} placeholder="For example: pallet fell from a rack" /></div>
      <div className="whs-two">
        <div className="field"><label htmlFor="in-date">When (date)</label><input id="in-date" type="date" className="input whs-input" required max={localToday()} value={f.occurredDate} onChange={set('occurredDate')} /></div>
        <div className="field"><label htmlFor="in-time">Time</label><input id="in-time" type="time" className="input whs-input" value={f.occurredTime} onChange={set('occurredTime')} /></div>
      </div>
      {me.sites.length ? <SiteSelect me={me} id="in-site" value={f.siteId} onChange={(v) => setF((x) => ({ ...x, siteId: v }))} label="Which site?" /> : null}
      <div className="field"><label htmlFor="in-location">Where exactly?</label><input id="in-location" className="input whs-input" maxLength={300} value={f.location} onChange={set('location')} /></div>
      <div className="field"><label htmlFor="in-outcome">Was anyone hurt?</label><select id="in-outcome" className="select whs-input" value={f.outcome} onChange={set('outcome')}>{options(me.lists.outcomes)}</select></div>
      {serious ? <p className="whs-warning small" role="note"><Icon name="alert" size={16} /> This may have to be notified to the regulator. The WHS managers are alerted as soon as you send this report. Leave the scene as it is unless it must be made safe.</p> : null}
      <div className="field"><label htmlFor="in-response">What was done straight away?</label><textarea id="in-response" className="textarea" rows={2} maxLength={3000} value={f.immediateResponse} onChange={set('immediateResponse')} /></div>
      <PhotoPicker files={files} setFiles={setFiles} />
      {f.kind === 'psychosocial' ? <ConfidentialChoice me={me} value={confidential} onChange={setConfidential} /> : null}
      <details className="whs-more">
        <summary>More details (optional)</summary>
        <div className="stack">
          <div className="field"><label htmlFor="in-desc">What happened, in full</label><textarea id="in-desc" className="textarea" rows={4} maxLength={10000} value={f.description} onChange={set('description')} /></div>
          <div className="field"><label htmlFor="in-people">Who was involved?</label><textarea id="in-people" className="textarea" rows={2} maxLength={2000} value={f.peopleInvolved} onChange={set('peopleInvolved')} /></div>
          <div className="field"><label htmlFor="in-witnesses">Witnesses</label><textarea id="in-witnesses" className="textarea" rows={2} maxLength={2000} value={f.witnesses} onChange={set('witnesses')} /></div>
          {me.departments.length ? <div className="field"><label htmlFor="in-dept">Department</label><select id="in-dept" className="select" value={f.departmentId} onChange={set('departmentId')}><option value="">Not chosen</option>{me.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div> : null}
          <div className="field"><label htmlFor="in-activity">What work was being done?</label><input id="in-activity" className="input" maxLength={500} value={f.activity} onChange={set('activity')} /></div>
          <div className="field"><label htmlFor="in-severity">How serious do you think it is?</label><select id="in-severity" className="select" value={f.severity} onChange={set('severity')}><option value="">Not sure</option>{options(me.lists.severities)}</select></div>
          <label className="checkbox whs-check"><input type="checkbox" checked={firstAid} onChange={(e) => setFirstAid(e.target.checked)} /> First aid was given</label>
          {hurt ? (
            <fieldset className="whs-health-box">
              <legend><Icon name="lock" size={14} /> Medical treatment (confidential)</legend>
              <p className="small muted">{me.healthOfficers ? 'Seen only by the company’s health officers, never by supervisors. You will not see it again once it is sent.' : 'Seen only by health officers. Nobody is a health officer yet: the details are kept for when someone is.'}</p>
              <div className="field"><label htmlFor="in-treatment">Treatment given</label><textarea id="in-treatment" className="textarea" rows={2} maxLength={5000} value={health.treatment} onChange={(e) => setHealth((h) => ({ ...h, treatment: e.target.value }))} /></div>
              <div className="field"><label htmlFor="in-provider">Where it was given</label><input id="in-provider" className="input" maxLength={300} value={health.provider} onChange={(e) => setHealth((h) => ({ ...h, provider: e.target.value }))} /></div>
            </fieldset>
          ) : null}
        </div>
      </details>
      <button className="btn primary whs-big" disabled={busy || !f.kind || !f.title.trim() || !f.occurredDate}>{busy ? 'Sending…' : 'Send the report'}</button>
      <button type="button" className="btn ghost" onClick={() => navigate(whsPage(companyId))}>Cancel</button>
    </form>
  );
}
