// BIZOMAT WHS, Release 1: the jurisdiction packs for BIZOMAT platform administrators (the ERP console, WHS legal
// packs). The controlled legal update workflow: a rule version is drafted, submitted, reviewed by another administrator
// (a lone administrator's own review is the recorded exception), activated, and verified against the official source
// with the source checked and notes. Active versions are never edited: a new version is drafted instead, and old
// incidents keep the version that applied to them. Every change is in the pack's history.
import { useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { Modal } from '../../components/ui/overlays';
import { dateTimeText, type Instrument, type Pack, type Rule } from './api';
import { LegalNotice, Section, useWhsAct } from './common';
import { InstrumentList, RuleList, VerifyBadge } from './Legal';

const KINDS: Record<string, string> = { legislation: 'Legislation', regulation: 'Regulation', code_of_practice: 'Approved code of practice', standard: 'Standard', guidance: 'Government guidance', model_law: 'Model law' };
const RULE_KINDS: Record<string, string> = { notification: 'Incident notification', site_preservation: 'Site preservation', retention: 'Record retention', exposure_limits: 'Exposure limits', other: 'Other obligation' };
const INCIDENT_KINDS: Record<string, string> = { injury: 'Injury', illness: 'Illness', near_miss: 'Near miss', dangerous_occurrence: 'Dangerous occurrence', property_damage: 'Property damage', environmental: 'Environmental', vehicle: 'Vehicle', contractor: 'Contractor', visitor: 'Visitor', psychosocial: 'Psychosocial' };
const OUTCOMES: Record<string, string> = { first_aid: 'First aid', medical_treatment: 'Medical treatment', restricted_duties: 'Restricted duties', lost_time: 'Lost time', hospital_inpatient: 'Hospital in-patient', fatality: 'Death' };

export function LegalAdmin() {
  return (
    <Routes>
      <Route index element={<PackOverview />} />
      <Route path=":pack" element={<PackAdmin />} />
    </Routes>
  );
}

function PackOverview() {
  usePageTitle('WHS legal packs');
  const q = useQuery({ queryKey: ['whs-admin', 'overview'], queryFn: () => get<{ packs: Pack[]; notice: string }>('/admin/whs/overview') });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <LegalNotice text={q.data.notice} />
      <p className="muted small">The jurisdiction packs every company’s BIZOMAT WHS uses. Verify each instrument and rule against its official source before it is relied on; until then companies see it as Not verified and no deadline is computed from it.</p>
      <table className="data-table responsive">
        <thead><tr><th>Pack</th><th>Regulator</th><th>Instruments verified</th><th>Rules verified</th><th>Versions in progress</th></tr></thead>
        <tbody>
          {q.data.packs.map((p) => (
            <tr key={p.id}>
              <td data-label="Pack"><Link to={`/admin/whs/${p.id}`}><strong>{p.name}</strong></Link> <span className="muted small">{p.code}{p.assignable ? '' : ', reference'}</span></td>
              <td data-label="Regulator">{p.regulator}</td>
              <td data-label="Instruments verified"><VerifyBadge verified={!!p.counts?.verifiedInstruments} label={`${p.counts?.verifiedInstruments ?? 0} of ${p.counts?.instruments ?? 0}`} /></td>
              <td data-label="Rules verified"><VerifyBadge verified={!!p.counts?.verifiedRules} label={`${p.counts?.verifiedRules ?? 0} of ${p.counts?.rules ?? 0}`} /></td>
              <td data-label="Versions in progress">{p.openVersions ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AdminPack {
  pack: Pack;
  instruments: Instrument[];
  rules: Rule[];
  events: { id: string; action: string; summary: string; actorName: string | null; at: number }[];
  sites: number;
  notice: string;
}

type Dialog = null | { kind: 'verifyInstrument'; i: Instrument } | { kind: 'instrument'; i?: Instrument } | { kind: 'rule'; r?: Rule; version?: boolean } | { kind: 'review'; r: Rule } | { kind: 'verifyRule'; r: Rule } | { kind: 'unverify'; r: Rule };

function PackAdmin() {
  const { pack = '' } = useParams();
  const q = useQuery({ queryKey: ['whs-admin', 'pack', pack], queryFn: () => get<AdminPack>(`/admin/whs/packs/${encodeURIComponent(pack)}`) });
  const act = useWhsAct('admin');
  const [dialog, setDialog] = useState<Dialog>(null);
  usePageTitle(q.data?.pack.name ?? 'WHS legal pack');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const d = q.data;
  const run = async (path: string, body: unknown, done: string) => {
    const r = await act(() => post(`/admin/whs${path}`, body), done);
    void q.refetch();
    return r;
  };
  const ruleActions = (r: Rule) => (
    <span className="row wrap">
      {r.status === 'draft' ? <button className="btn sm" onClick={() => setDialog({ kind: 'rule', r })}>Edit draft</button> : null}
      {r.status === 'draft' ? <button className="btn sm" onClick={() => void run(`/rules/${encodeURIComponent(r.id)}/submit`, {}, 'Submitted for review')}>Submit</button> : null}
      {r.status === 'in_review' ? <button className="btn sm primary" onClick={() => setDialog({ kind: 'review', r })}>Review</button> : null}
      {r.status === 'reviewed' ? <button className="btn sm primary" onClick={() => void run(`/rules/${encodeURIComponent(r.id)}/activate`, {}, 'Activated')}>Activate</button> : null}
      {(r.status === 'reviewed' || r.status === 'active') && r.verification !== 'verified' ? <button className="btn sm" onClick={() => setDialog({ kind: 'verifyRule', r })}>Verify</button> : null}
      {r.verification === 'verified' ? <button className="btn sm ghost" onClick={() => setDialog({ kind: 'unverify', r })}>Take back verification</button> : null}
      {r.status === 'active' ? <button className="btn sm" onClick={() => setDialog({ kind: 'rule', r, version: true })}>New version</button> : null}
      {['draft', 'in_review', 'reviewed'].includes(r.status) ? <button className="btn sm ghost" onClick={() => void run(`/rules/${encodeURIComponent(r.id)}/withdraw`, {}, 'Withdrawn')}>Withdraw</button> : null}
    </span>
  );
  return (
    <div className="stack">
      <div className="mt-path"><Link to="/admin/whs">WHS legal packs</Link><span className="sep">/</span><span>{d.pack.name}</span></div>
      <LegalNotice text={d.notice} />
      <Section title={d.pack.name}>
        <p className="small">{d.pack.framework}. Regulator: {d.pack.regulator}. Pack version {d.pack.version}. Used by {d.sites} site{d.sites === 1 ? '' : 's'} across all companies.</p>
        <p className="muted small">{d.pack.notes}</p>
      </Section>
      <Section title="Instruments" actions={<button className="btn sm" onClick={() => setDialog({ kind: 'instrument' })}><Icon name="plus" size={14} /> Add</button>}>
        <InstrumentList instruments={d.instruments} actions={(i) => <span className="row wrap"><button className="btn sm" onClick={() => setDialog({ kind: 'instrument', i })}>Edit</button>{i.status !== 'verified' && i.status !== 'retired' ? <button className="btn sm" onClick={() => setDialog({ kind: 'verifyInstrument', i })}>Verify</button> : null}</span>} />
      </Section>
      <Section title="Rules and their versions" actions={<button className="btn sm" onClick={() => setDialog({ kind: 'rule' })}><Icon name="plus" size={14} /> New rule</button>}>
        <p className="muted small">Draft, submit, review (by another administrator), activate, then verify against the official source. An unverified rule is shown to companies but applies to no incident.</p>
        <RuleList rules={d.rules} actions={ruleActions} />
      </Section>
      <Section title="History">
        <ol className="mt-history">{d.events.map((e) => <li key={e.id}><div className="small"><strong>{e.actorName ?? 'Someone'}</strong> <span className="muted">{dateTimeText(e.at)}</span></div><div className="small">{e.summary}</div></li>)}</ol>
      </Section>
      {dialog?.kind === 'verifyInstrument' ? <VerifyDialog title={`Verify: ${dialog.i.title}`} onClose={() => setDialog(null)} onSave={(b) => run(`/instruments/${encodeURIComponent(dialog.i.id)}/verify`, b, 'Verified')} /> : null}
      {dialog?.kind === 'verifyRule' ? <VerifyDialog title={`Verify: ${dialog.r.title}, version ${dialog.r.version}`} needDate={!dialog.r.effectiveFrom} onClose={() => setDialog(null)} onSave={(b) => run(`/rules/${encodeURIComponent(dialog.r.id)}/verify`, b, 'Verified')} /> : null}
      {dialog?.kind === 'unverify' ? <ReasonDialog title="Take back the verification" label="Why?" onClose={() => setDialog(null)} onSave={(reason) => run(`/rules/${encodeURIComponent(dialog.r.id)}/unverify`, { reason }, 'Verification taken back')} /> : null}
      {dialog?.kind === 'review' ? <ReviewDialog rule={dialog.r} onClose={() => setDialog(null)} onSave={(b) => run(`/rules/${encodeURIComponent(dialog.r.id)}/review`, b, b.decision === 'approve' ? 'Reviewed' : 'Returned')} /> : null}
      {dialog?.kind === 'instrument' ? <InstrumentDialog packId={d.pack.id} instrument={dialog.i} onClose={() => setDialog(null)} onDone={() => void q.refetch()} /> : null}
      {dialog?.kind === 'rule' ? <RuleDialog packId={d.pack.id} rule={dialog.r} version={!!dialog.version} instruments={d.instruments} onClose={() => setDialog(null)} onDone={() => void q.refetch()} /> : null}
    </div>
  );
}

function VerifyDialog({ title, needDate, onClose, onSave }: { title: string; needDate?: boolean; onClose: () => void; onSave: (b: { sourceChecked: string; notes: string; effectiveFrom?: string }) => Promise<unknown> }) {
  const [source, setSource] = useState('https://');
  const [notes, setNotes] = useState('');
  const [from, setFrom] = useState('');
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={notes.trim().length < 3 || (needDate && !from)} onClick={async () => { if (await onSave({ sourceChecked: source, notes, effectiveFrom: from || undefined })) onClose(); }}>Record the verification</button></>}>
      <div className="stack">
        <p className="muted small">Verify only after reading the enacted law in force at the official source. Your name, the time, the source and your notes are kept, and companies see that it is verified.</p>
        <div className="field"><label htmlFor="vf-src">Official source checked</label><input id="vf-src" className="input" value={source} onChange={(e) => setSource(e.target.value)} /></div>
        <div className="field"><label htmlFor="vf-from">In effect from{needDate ? '' : ' (optional)'}</label><input id="vf-from" type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div className="field"><label htmlFor="vf-notes">What you checked</label><textarea id="vf-notes" className="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function ReasonDialog({ title, label, onClose, onSave }: { title: string; label: string; onClose: () => void; onSave: (reason: string) => Promise<unknown> }) {
  const [text, setText] = useState('');
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={text.trim().length < 3} onClick={async () => { if (await onSave(text)) onClose(); }}>Save</button></>}>
      <div className="field"><label htmlFor="rs-text">{label}</label><textarea id="rs-text" className="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} /></div>
    </Modal>
  );
}

function ReviewDialog({ rule, onClose, onSave }: { rule: Rule; onClose: () => void; onSave: (b: { decision: 'approve' | 'return'; notes: string }) => Promise<unknown> }) {
  const [notes, setNotes] = useState('');
  const save = async (decision: 'approve' | 'return') => {
    if (await onSave({ decision, notes })) onClose();
  };
  return (
    <Modal title={`Review: ${rule.title}, version ${rule.version}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn" disabled={notes.trim().length < 3} onClick={() => void save('return')}>Return for changes</button><button className="btn primary" disabled={notes.trim().length < 3} onClick={() => void save('approve')}>Reviewed</button></>}>
      <div className="stack">
        <p className="muted small">Drafted by {rule.draftedByName ?? 'the seed'}. Someone other than the drafter reviews it.</p>
        <div className="field"><label htmlFor="rv-notes">Review notes</label><textarea id="rv-notes" className="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function InstrumentDialog({ packId, instrument, onClose, onDone }: { packId: string; instrument?: Instrument; onClose: () => void; onDone: () => void }) {
  const [f, setF] = useState({ kind: instrument?.kind ?? 'legislation', title: instrument?.title ?? '', citation: instrument?.citation ?? '', industry: instrument?.industry ?? '', sourceUrl: instrument?.sourceUrl ?? 'https://', effectiveFrom: instrument?.effectiveFrom ?? '', amendedAt: instrument?.amendedAt ?? '', summary: instrument?.summary ?? '' });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const act = useWhsAct('admin');
  const save = async () => {
    const body = { ...f, effectiveFrom: f.effectiveFrom || null, amendedAt: f.amendedAt || null };
    const r = await act(() => (instrument ? patch(`/admin/whs/instruments/${encodeURIComponent(instrument.id)}`, body) : post(`/admin/whs/packs/${encodeURIComponent(packId)}/instruments`, body)), 'Saved');
    if (r) {
      onDone();
      onClose();
    }
  };
  return (
    <Modal wide title={instrument ? 'Edit the instrument' : 'Add an instrument'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        {instrument?.status === 'verified' ? <p className="span-2 whs-warning small">Changing a verified instrument makes it not verified again.</p> : null}
        <div className="field"><label htmlFor="in-kind">Kind</label><select id="in-kind" className="select" value={f.kind} onChange={set('kind')}>{Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div className="field"><label htmlFor="in-cit">Citation</label><input id="in-cit" className="input" value={f.citation} onChange={set('citation')} /></div>
        <div className="field span-2"><label htmlFor="in-t">Title</label><input id="in-t" className="input" value={f.title} onChange={set('title')} /></div>
        <div className="field span-2"><label htmlFor="in-url">Official source (https)</label><input id="in-url" className="input" value={f.sourceUrl} onChange={set('sourceUrl')} /></div>
        <div className="field span-2"><label htmlFor="in-ind">Applies to (industries, workplaces)</label><input id="in-ind" className="input" value={f.industry} onChange={set('industry')} /></div>
        <div className="field"><label htmlFor="in-from">In effect from</label><input id="in-from" type="date" className="input" value={f.effectiveFrom} onChange={set('effectiveFrom')} /></div>
        <div className="field"><label htmlFor="in-am">Last amended</label><input id="in-am" type="date" className="input" value={f.amendedAt} onChange={set('amendedAt')} /></div>
        <div className="field span-2"><label htmlFor="in-sum">Summary</label><textarea id="in-sum" className="textarea" rows={3} value={f.summary} onChange={set('summary')} /></div>
      </div>
    </Modal>
  );
}

function RuleDialog({ packId, rule, version, instruments, onClose, onDone }: { packId: string; rule?: Rule; version: boolean; instruments: Instrument[]; onClose: () => void; onDone: () => void }) {
  const [f, setF] = useState({
    kind: rule?.kind ?? 'notification',
    title: rule?.title ?? '',
    instrumentId: rule?.instrumentId ?? '',
    provision: rule?.provision ?? '',
    sourceUrl: rule?.sourceUrl ?? 'https://',
    effectiveFrom: rule?.effectiveFrom ?? '',
    effectiveTo: rule?.effectiveTo ?? '',
    body: rule?.body ?? '',
    deadlineMinutes: rule?.deadlineMinutes ? String(rule.deadlineMinutes) : '',
    deadlineFrom: rule?.deadlineFrom ?? 'awareness',
    deadlineText: rule?.deadlineText ?? '',
    requiredInfo: (rule?.requiredInfo ?? []).join('\n'),
    sitePreservation: rule?.sitePreservation ?? '',
    responsibleParty: rule?.responsibleParty ?? '',
    procedure: rule?.procedure ?? '',
    retention: rule?.retention ?? '',
    changeNote: version ? '' : (rule?.changeNote ?? ''),
  });
  const [criteria, setCriteria] = useState<{ kinds: string[]; outcomes: string[] }>({ kinds: rule?.criteria.kinds ?? [], outcomes: rule?.criteria.outcomes ?? [] });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const act = useWhsAct('admin');
  const save = async () => {
    const body = {
      ...f,
      instrumentId: f.instrumentId || null,
      effectiveFrom: f.effectiveFrom || null,
      effectiveTo: f.effectiveTo || null,
      deadlineMinutes: f.deadlineMinutes ? Number(f.deadlineMinutes) : null,
      requiredInfo: f.requiredInfo.split('\n').map((x) => x.trim()).filter(Boolean),
      criteria,
    };
    const r = await act(() => (version && rule ? post(`/admin/whs/rules/${encodeURIComponent(rule.id)}/versions`, body) : rule ? patch(`/admin/whs/rules/${encodeURIComponent(rule.id)}`, body) : post(`/admin/whs/packs/${encodeURIComponent(packId)}/rules`, body)), version ? 'New version drafted' : 'Saved');
    if (r) {
      onDone();
      onClose();
    }
  };
  const toggle = (list: 'kinds' | 'outcomes', k: string, on: boolean) => setCriteria((c) => ({ ...c, [list]: on ? [...c[list], k] : c[list].filter((x) => x !== k) }));
  return (
    <Modal xl title={version ? `New version of: ${rule?.title}` : rule ? `Edit the draft: ${rule.title}` : 'New rule'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!f.title.trim()} onClick={() => void save()}>{version ? 'Draft the new version' : 'Save the draft'}</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="ru-kind">Kind</label><select id="ru-kind" className="select" value={f.kind} onChange={set('kind')}>{Object.entries(RULE_KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div className="field"><label htmlFor="ru-ins">Instrument</label><select id="ru-ins" className="select" value={f.instrumentId} onChange={set('instrumentId')}><option value="">None</option>{instruments.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}</select></div>
        <div className="field span-2"><label htmlFor="ru-t">Title</label><input id="ru-t" className="input" value={f.title} onChange={set('title')} /></div>
        <div className="field"><label htmlFor="ru-prov">Provision</label><input id="ru-prov" className="input" value={f.provision} onChange={set('provision')} /></div>
        <div className="field"><label htmlFor="ru-url">Official source (https)</label><input id="ru-url" className="input" value={f.sourceUrl} onChange={set('sourceUrl')} /></div>
        <div className="field"><label htmlFor="ru-from">In effect from</label><input id="ru-from" type="date" className="input" value={f.effectiveFrom} onChange={set('effectiveFrom')} /></div>
        <div className="field"><label htmlFor="ru-to">In effect until (optional)</label><input id="ru-to" type="date" className="input" value={f.effectiveTo} onChange={set('effectiveTo')} /></div>
        <div className="field span-2"><label htmlFor="ru-body">The rule in plain words</label><textarea id="ru-body" className="textarea" rows={3} value={f.body} onChange={set('body')} /></div>
        {f.kind === 'notification' ? (
          <>
            <fieldset className="erp-checks span-2"><legend className="small">Incidents it covers (used only once verified): kinds</legend>{Object.entries(INCIDENT_KINDS).map(([k, v]) => <label key={k} className="checkbox qc-inline"><input type="checkbox" checked={criteria.kinds.includes(k)} onChange={(e) => toggle('kinds', k, e.target.checked)} /> {v}</label>)}</fieldset>
            <fieldset className="erp-checks span-2"><legend className="small">and outcomes</legend>{Object.entries(OUTCOMES).map(([k, v]) => <label key={k} className="checkbox qc-inline"><input type="checkbox" checked={criteria.outcomes.includes(k)} onChange={(e) => toggle('outcomes', k, e.target.checked)} /> {v}</label>)}</fieldset>
            <div className="field"><label htmlFor="ru-dl">Deadline in minutes (from the enacted law)</label><input id="ru-dl" type="number" min={1} className="input" value={f.deadlineMinutes} onChange={set('deadlineMinutes')} /></div>
            <div className="field"><label htmlFor="ru-df">Counted from</label><select id="ru-df" className="select" value={f.deadlineFrom} onChange={set('deadlineFrom')}><option value="awareness">Becoming aware of the incident</option><option value="occurrence">The incident</option></select></div>
            <div className="field span-2"><label htmlFor="ru-dt">The deadline in words</label><input id="ru-dt" className="input" value={f.deadlineText} onChange={set('deadlineText')} /></div>
            <div className="field span-2"><label htmlFor="ru-ri">Required information, one a line</label><textarea id="ru-ri" className="textarea" rows={3} value={f.requiredInfo} onChange={set('requiredInfo')} /></div>
            <div className="field span-2"><label htmlFor="ru-sp">Site preservation</label><textarea id="ru-sp" className="textarea" rows={2} value={f.sitePreservation} onChange={set('sitePreservation')} /></div>
            <div className="field"><label htmlFor="ru-rp">Who notifies</label><input id="ru-rp" className="input" value={f.responsibleParty} onChange={set('responsibleParty')} /></div>
            <div className="field"><label htmlFor="ru-pr">How</label><input id="ru-pr" className="input" value={f.procedure} onChange={set('procedure')} /></div>
          </>
        ) : null}
        <div className="field span-2"><label htmlFor="ru-ret">Record retention</label><input id="ru-ret" className="input" value={f.retention} onChange={set('retention')} /></div>
        <div className="field span-2"><label htmlFor="ru-cn">Why this version</label><input id="ru-cn" className="input" value={f.changeNote} onChange={set('changeNote')} /></div>
      </div>
    </Modal>
  );
}
