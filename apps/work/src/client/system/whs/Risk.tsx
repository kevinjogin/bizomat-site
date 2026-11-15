// BIZOMAT WHS, Release 1: risk assessments (JSA, JHA, SWMS and the other kinds) and the risk register. An assessment is
// the task in steps, each hazard with its harm, the people affected, the initial and residual rating on the company's
// matrix, and controls tagged with the hierarchy of controls. Approval by someone who did not draft it, revisions with
// the reason for review, and the heat map of initial and residual risk.
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import { csvHref, dateText, dayText, localToday, whsPage, whsPath, type Matrix, type RaControl, type RaLine, type RaView, type RiskAssessment, type WhsMe } from './api';
import { Comments, ConfidentialBadge, History, NoteDialog, PersonSelect, Props, RatingSelect, RiskBadge, Section, SiteSelect, StatusBadge, Warnings, WhsFiles, WhsUpload, levelOf, options, useWhsAct } from './common';
import { ActionRows, RaiseActionDialog } from './Actions';
import { LinkDialog, LinkList } from './Hazards';

export function RiskAssessmentsPage({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Risk assessments');
  const [sp, setSp] = useSearchParams();
  const f = { status: sp.get('status') ?? '', kind: sp.get('kind') ?? '', reviewDue: sp.get('reviewDue') ?? '', q: sp.get('q') ?? '' };
  const set = (k: keyof typeof f, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    setSp(n, { replace: true });
  };
  const query = new URLSearchParams({ today: localToday(), ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) });
  const q = useQuery({ queryKey: ['whs', companyId, 'ras', query.toString()], queryFn: () => get<{ assessments: RiskAssessment[] }>(whsPath(companyId, `/risk-assessments?${query}`)) });
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Job safety analyses, safe work method statements and the other assessments, with their approval and review dates.</p>
        <Link className="btn" to={whsPage(companyId, '/risk/register')}><Icon name="grid" /> Risk register and heat map</Link>
        {me.can.assess ? <Link className="btn primary" to={whsPage(companyId, '/risk/new')}><Icon name="plus" /> New risk assessment</Link> : null}
        <a className="btn" href={csvHref(companyId, `/risk-assessments?${query}`)} download><Icon name="download" /> Export CSV</a>
      </div>
      <div className="mt-filters" role="group" aria-label="Filters">
        <div className="field"><label htmlFor="ra-q">Search</label><input id="ra-q" className="input" value={f.q} onChange={(e) => set('q', e.target.value)} /></div>
        <div className="field"><label htmlFor="ra-k">Kind</label><select id="ra-k" className="select" value={f.kind} onChange={(e) => set('kind', e.target.value)}><option value="">Any</option>{options(me.lists.raKinds)}</select></div>
        <div className="field"><label htmlFor="ra-s">Status</label><select id="ra-s" className="select" value={f.status} onChange={(e) => set('status', e.target.value)}><option value="">Current (not superseded)</option>{options(me.lists.raStatus)}</select></div>
        <label className="checkbox mt-field-end"><input type="checkbox" checked={f.reviewDue === '1'} onChange={(e) => set('reviewDue', e.target.checked ? '1' : '')} /> Review due</label>
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : !q.data.assessments.length ? <EmptyState icon="target" title="No risk assessments yet" /> : (
        <div className="crm-table-scroll">
          <table className="data-table mt-table">
            <thead><tr><th>Assessment</th><th>Kind</th><th>Site</th><th>Responsible</th><th>Review</th><th>Status</th></tr></thead>
            <tbody>
              {q.data.assessments.map((r) => (
                <tr key={r.id}>
                  <td data-label="Assessment"><Link to={whsPage(companyId, `/risk/${r.id}`)} className="mt-primary"><span className="mt-num">{r.number} rev {r.revision}</span> {r.title}</Link> {r.confidential ? <ConfidentialBadge /> : null}</td>
                  <td data-label="Kind">{r.kindLabel}</td>
                  <td data-label="Site">{r.siteName ?? ''}</td>
                  <td data-label="Responsible">{r.responsibleName ?? ''}</td>
                  <td data-label="Review" className={r.reviewDue ? 'mt-overdue' : ''}>{dateText(r.reviewDate)}{r.reviewDue ? ' (due)' : ''}</td>
                  <td data-label="Status"><StatusBadge status={r.status} label={r.statusLabel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function NewRiskAssessment({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('New risk assessment');
  const [sp] = useSearchParams();
  const hazardId = sp.get('hazard') ?? '';
  const navigate = useNavigate();
  const toast = useToast();
  const [f, setF] = useState({ kind: 'jsa', title: '', activity: '', scope: '', siteId: '', location: '', responsibleId: me.user.id, reviewDate: '' });
  const [busy, setBusy] = useState(false);
  const [confidential, setConfidential] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  if (!me.can.assess) return <p className="muted">Only WHS officers and managers make risk assessments.</p>;
  const save = async () => {
    setBusy(true);
    try {
      const r = await post<RaView>(whsPath(companyId, '/risk-assessments'), { ...f, siteId: f.siteId || null, responsibleId: f.responsibleId || null, reviewDate: f.reviewDate || null, hazardId: hazardId || null, confidential: f.kind === 'psychosocial' && me.can.confidential && confidential });
      navigate(whsPage(companyId, `/risk/${r.assessment.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">New risk assessment</h2>
      {hazardId ? <p className="muted small">It will be linked to the hazard it is made for.</p> : null}
      <div className="form-grid">
        <div className="field"><label htmlFor="nr-kind">Kind</label><select id="nr-kind" className="select" value={f.kind} onChange={set('kind')}>{options(me.lists.raKinds)}</select></div>
        <div className="field"><label htmlFor="nr-title">Title</label><input id="nr-title" className="input" maxLength={200} value={f.title} onChange={set('title')} /></div>
        <div className="field span-2"><label htmlFor="nr-act">The work or activity</label><input id="nr-act" className="input" maxLength={500} value={f.activity} onChange={set('activity')} /></div>
        <SiteSelect me={me} id="nr-site" value={f.siteId} onChange={(v) => setF((x) => ({ ...x, siteId: v }))} />
        <div className="field"><label htmlFor="nr-loc">Where</label><input id="nr-loc" className="input" value={f.location} onChange={set('location')} /></div>
        <PersonSelect me={me} id="nr-resp" value={f.responsibleId} onChange={(v) => setF((x) => ({ ...x, responsibleId: v }))} />
        <div className="field"><label htmlFor="nr-rev">Review by</label><input id="nr-rev" type="date" className="input" value={f.reviewDate} onChange={set('reviewDate')} /></div>
        <div className="field span-2"><label htmlFor="nr-scope">Scope</label><textarea id="nr-scope" className="textarea" rows={2} value={f.scope} onChange={set('scope')} /></div>
        {f.kind === 'psychosocial' && me.can.confidential ? <label className="checkbox span-2"><input type="checkbox" checked={confidential} onChange={(e) => setConfidential(e.target.checked)} /> Confidential: only WHS managers and health officers see it</label> : null}
      </div>
      <div className="row"><button className="btn primary" disabled={busy || !f.title.trim()} onClick={() => void save()}>{busy ? 'Saving…' : 'Make the draft'}</button><span className="muted small">Then add its steps, hazards and controls.</span></div>
    </section>
  );
}

type Dialog = null | 'approve' | 'return' | 'revise' | 'cancel' | 'action' | 'link';

export function RiskAssessmentDetail({ companyId, me }: { companyId: string; me: WhsMe }) {
  const { id = '' } = useParams();
  const q = useQuery({ queryKey: ['whs', companyId, 'ra', id], queryFn: () => get<RaView>(whsPath(companyId, `/risk-assessments/${id}?today=${localToday()}`)), retry: false });
  const act = useWhsAct(companyId);
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [editing, setEditing] = useState(false);
  usePageTitle(q.data ? `${q.data.assessment.number} ${q.data.assessment.title}` : 'Risk assessment');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const r = v.assessment;
  const m = v.matrix ?? me.matrix;
  const call = (path: string, body: unknown, done: string) => act(() => post<RaView>(whsPath(companyId, `/risk-assessments/${r.id}${path}`), body), done);
  return (
    <div className="stack whs-detail">
      <div className="mt-path"><Link to={whsPage(companyId, '/risk')}>Risk assessments</Link><span className="sep">/</span><span>{r.number} rev {r.revision}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{r.number} rev {r.revision}</span> {r.title}</h2>
          <div className="mt-badges"><StatusBadge status={r.status} label={r.statusLabel} /><span className="badge">{r.kindLabel}</span>{r.reviewDue ? <span className="badge danger">Review due</span> : null}{r.confidential ? <ConfidentialBadge /> : null}</div>
        </div>
        <div className="mt-head-actions">
          {v.can.edit ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Edit steps, hazards and controls</button> : null}
          {v.can.submit ? <button className="btn primary" onClick={() => void call('/submit', {}, 'Submitted for approval')}>Submit for approval</button> : null}
          {v.can.approve ? <button className="btn primary" onClick={() => setDialog('approve')}>Approve</button> : null}
          {v.can.approve ? <button className="btn" onClick={() => setDialog('return')}>Return for changes</button> : null}
          {v.can.revise ? <button className="btn" onClick={() => setDialog('revise')}>Review: new revision</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setDialog('cancel')}>Cancel</button> : null}
        </div>
      </div>
      <Warnings items={v.warnings} />
      <Section title="The assessment">
        <Props items={[
          ['Work or activity', r.activity],
          ['Scope', r.scope],
          ['Site', r.siteName],
          ['Where', r.location],
          ['Asset', r.assetLabel],
          ['Responsible', r.responsibleName],
          ['Review by', r.reviewDate ? <span className={r.reviewDue ? 'mt-overdue' : ''}>{dateText(r.reviewDate)}</span> : ''],
          ['Why this revision', r.reviewTrigger ? `${r.reviewTriggerLabel}: ${r.reviewReason}` : ''],
          ['Drafted by', r.draftedByName],
          ['Approved', r.approvedAt ? `${dayText(r.approvedAt)}${r.approvedByName ? ` by ${r.approvedByName}` : ''}${r.approvalSod ? ' (one-person exception recorded)' : ''}${r.warningsAcknowledged ? ', with its warnings acknowledged' : ''}` : ''],
          ['Approval note', r.approvalNote],
        ]} />
      </Section>
      {editing ? <ContentEditor companyId={companyId} me={me} matrix={m} view={v} onDone={() => { setEditing(false); void q.refetch(); }} /> : <ContentView view={v} matrix={m} />}
      <Section title={`Actions (${v.actions.length})`} actions={me.can.assess ? <button className="btn sm" onClick={() => setDialog('action')}><Icon name="plus" size={14} /> New action</button> : null}>
        {v.actions.length ? <ActionRows companyId={companyId} actions={v.actions} /> : <p className="muted small">No actions from this assessment.</p>}
      </Section>
      <Section title="Linked records" actions={me.can.assess ? <button className="btn sm" onClick={() => setDialog('link')}><Icon name="link" size={14} /> Link</button> : null}>
        <LinkList companyId={companyId} links={v.links} />
      </Section>
      <Section title="Revisions">
        <ul className="erp-list small">{v.revisions.map((x) => <li key={x.id}>{x.id === r.id ? <strong>Revision {x.revision}</strong> : <Link to={whsPage(companyId, `/risk/${x.id}`)}>Revision {x.revision}</Link>} <StatusBadge status={x.status} label={x.statusLabel} /> {x.trigger ? <span className="muted">{x.trigger}: {x.reason}</span> : <span className="muted">first revision</span>}</li>)}</ul>
      </Section>
      <Section title="Supporting evidence" actions={me.can.assess ? <WhsUpload companyId={companyId} kind="risk_assessment" id={r.id} onDone={() => void q.refetch()} /> : null}>
        <WhsFiles companyId={companyId} files={v.files} onRemoved={() => void q.refetch()} canRemove={me.can.approve} />
      </Section>
      <Section title="Notes and consultation">
        <Comments companyId={companyId} entityType="risk_assessment" entityId={r.id} comments={v.comments} canNote={me.can.view} canConsult={v.can.consult} />
      </Section>
      {v.history.length ? <Section title="History"><History events={v.history as any} /></Section> : null}
      {dialog === 'approve' ? (
        <NoteDialog title={`Approve ${r.number} rev ${r.revision}`} label="Note (optional)" confirm={v.warnings.length ? 'I have read the warnings: approve' : 'Approve'} intro={v.warnings.length ? <Warnings items={v.warnings} /> : <p className="muted small">You did not draft or submit it.</p>} onClose={() => setDialog(null)} onSave={(note) => call('/approve', { note: note || undefined, acknowledgeWarnings: v.warnings.length > 0 }, 'Approved')} />
      ) : null}
      {dialog === 'return' ? <NoteDialog title="Return for changes" label="What should change?" confirm="Return" required onClose={() => setDialog(null)} onSave={(note) => call('/return', { note }, 'Returned')} /> : null}
      {dialog === 'cancel' ? <NoteDialog title="Cancel the draft" label="Why?" confirm="Cancel it" danger required onClose={() => setDialog(null)} onSave={(reason) => call('/cancel', { reason }, 'Cancelled')} /> : null}
      {dialog === 'revise' ? <ReviseDialog companyId={companyId} me={me} ra={r} onClose={() => setDialog(null)} onMade={(nid) => navigate(whsPage(companyId, `/risk/${nid}`))} /> : null}
      {dialog === 'action' ? <RaiseActionDialog companyId={companyId} me={me} source={{ type: 'risk_assessment', id: r.id, label: `${r.number} rev ${r.revision}` }} onClose={() => setDialog(null)} /> : null}
      {dialog === 'link' ? <LinkDialog companyId={companyId} from={{ type: 'risk_assessment', id: r.id }} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

function ContentView({ view, matrix }: { view: RaView; matrix: Matrix }) {
  if (!view.lines.length && !view.steps.length) return <Section title="Steps, hazards and controls"><p className="muted small">Nothing yet. Edit the draft to add the task’s steps, each hazard and its controls.</p></Section>;
  const groups: { step: { id: string; seq: number; step: string } | null; lines: RaLine[] }[] = [...view.steps.map((s) => ({ step: s, lines: view.lines.filter((l) => l.stepId === s.id) })), { step: null, lines: view.lines.filter((l) => !l.stepId) }].filter((g) => g.step || g.lines.length);
  return (
    <Section title="Steps, hazards and controls">
      <p className="muted small">Rated on the matrix this revision was made with: {matrix.likelihood.length} likelihoods by {matrix.consequence.length} consequences.</p>
      <ol className="whs-ra-steps">
        {groups.map((g, k) => (
          <li key={g.step?.id ?? `none-${k}`} className={g.step ? '' : 'whs-no-step'}>
            {g.step ? <h3 className="erp-h3">Step {g.step.seq}: {g.step.step}</h3> : <h3 className="erp-h3">Other hazards</h3>}
            {g.lines.length ? g.lines.map((l) => (
              <div key={l.id} className="card card-pad stack whs-ra-line">
                <div className="row wrap"><strong className="grow">{l.hazard}</strong><span className="small muted">Initial</span><RiskBadge level={l.level} label={l.levelLabel} rank={l.rank} high={l.high} />{l.residualLevel ? <><span className="small muted">Residual</span><RiskBadge level={l.residualLevel} label={l.residualLabel} /></> : null}</div>
                <Props items={[['Harm', l.harm], ['Who is affected', l.persons], ['Rating', `likelihood ${l.likelihood}, consequence ${l.consequence}${l.residualLikelihood ? `; residual ${l.residualLikelihood} by ${l.residualConsequence}` : ''}`], ['Hazard register', l.hazardNumber], ['Responsible', l.responsibleName]]} />
                {l.controls.length ? (
                  <ul className="whs-controls">{l.controls.map((c, n) => <li key={c.id ?? n}><span className={`badge whs-h-${c.hierarchy}`}>{c.hierarchyLabel}</span> {c.description} <span className="muted small">{c.stage === 'existing' ? 'existing' : 'additional'}{c.effectivenessLabel && c.effectiveness !== 'not_assessed' ? `, ${c.effectivenessLabel.toLowerCase()}` : ''}{c.responsibleName ? `, ${c.responsibleName}` : ''}</span></li>)}</ul>
                ) : <p className="muted small">No controls.</p>}
                <Warnings items={l.warnings} />
              </div>
            )) : <p className="muted small">No hazards in this step.</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}

interface DraftLine {
  stepKey: string;
  hazard: string;
  harm: string;
  persons: string;
  likelihood: number | '';
  consequence: number | '';
  residualLikelihood: number | '';
  residualConsequence: number | '';
  responsibleId: string;
  controls: RaControl[];
}

function ContentEditor({ companyId, me, matrix, view, onDone }: { companyId: string; me: WhsMe; matrix: Matrix; view: RaView; onDone: () => void }) {
  const toast = useToast();
  const [steps, setSteps] = useState(view.steps.map((s) => ({ key: s.id, step: s.step })));
  const [lines, setLines] = useState<DraftLine[]>(view.lines.map((l) => ({ stepKey: l.stepId ?? '', hazard: l.hazard, harm: l.harm, persons: l.persons, likelihood: l.likelihood, consequence: l.consequence, residualLikelihood: l.residualLikelihood ?? '', residualConsequence: l.residualConsequence ?? '', responsibleId: l.responsibleId ?? '', controls: l.controls.map((c) => ({ stage: c.stage, hierarchy: c.hierarchy, description: c.description, effectiveness: c.effectiveness, responsibleId: c.responsibleId ?? null })) })));
  const [busy, setBusy] = useState(false);
  const setLine = (i: number, patchL: Partial<DraftLine>) => setLines(lines.map((l, k) => (k === i ? { ...l, ...patchL } : l)));
  const save = async () => {
    setBusy(true);
    try {
      await put(whsPath(companyId, `/risk-assessments/${view.assessment.id}/content`), {
        steps: steps.filter((s) => s.step.trim()),
        lines: lines.map((l) => ({ stepKey: l.stepKey || null, hazard: l.hazard, harm: l.harm, persons: l.persons, likelihood: l.likelihood, consequence: l.consequence, residualLikelihood: l.residualLikelihood || null, residualConsequence: l.residualConsequence || null, responsibleId: l.responsibleId || null, controls: l.controls.filter((c) => c.description.trim()).map((c) => ({ ...c, responsibleId: c.responsibleId || null })) })),
      });
      toast('Saved');
      onDone();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const valid = lines.every((l) => l.hazard.trim() && l.likelihood && l.consequence);
  return (
    <Section title="Edit steps, hazards and controls">
      <fieldset className="whs-action-form">
        <legend>Task steps, in order</legend>
        <ol className="whs-edit-steps">
          {steps.map((s, i) => (
            <li key={s.key} className="row">
              <label className="sr-only" htmlFor={`st-${s.key}`}>Step {i + 1}</label>
              <input id={`st-${s.key}`} className="input grow" value={s.step} onChange={(e) => setSteps(steps.map((x, k) => (k === i ? { ...x, step: e.target.value } : x)))} />
              <button className="btn ghost sm" aria-label={`Remove step ${i + 1}`} onClick={() => { setSteps(steps.filter((_, k) => k !== i)); setLines(lines.map((l) => (l.stepKey === s.key ? { ...l, stepKey: '' } : l))); }}><Icon name="x" size={14} /></button>
            </li>
          ))}
        </ol>
        <button className="btn sm" onClick={() => setSteps([...steps, { key: `new-${Date.now()}`, step: '' }])}><Icon name="plus" size={14} /> Add a step</button>
      </fieldset>
      {lines.map((l, i) => {
        const level = levelOf(matrix as WhsMe['matrix'], l.likelihood, l.consequence);
        const res = levelOf(matrix as WhsMe['matrix'], l.residualLikelihood, l.residualConsequence);
        const lowOnly = level && level.rank >= matrix.highFrom && (!l.controls.length || l.controls.every((c) => c.hierarchy === 'administrative' || c.hierarchy === 'ppe'));
        return (
          <fieldset key={i} className="whs-action-form">
            <legend>Hazard {i + 1}</legend>
            <div className="form-grid">
              <div className="field"><label htmlFor={`ln-step-${i}`}>Step</label><select id={`ln-step-${i}`} className="select" value={l.stepKey} onChange={(e) => setLine(i, { stepKey: e.target.value })}><option value="">Not a step</option>{steps.map((s, k) => <option key={s.key} value={s.key}>{k + 1}. {s.step.slice(0, 60)}</option>)}</select></div>
              <div className="field"><label htmlFor={`ln-hz-${i}`}>Hazard</label><input id={`ln-hz-${i}`} className="input" value={l.hazard} onChange={(e) => setLine(i, { hazard: e.target.value })} /></div>
              <div className="field"><label htmlFor={`ln-harm-${i}`}>Potential harm</label><input id={`ln-harm-${i}`} className="input" value={l.harm} onChange={(e) => setLine(i, { harm: e.target.value })} /></div>
              <div className="field"><label htmlFor={`ln-per-${i}`}>Who is affected</label><input id={`ln-per-${i}`} className="input" value={l.persons} onChange={(e) => setLine(i, { persons: e.target.value })} /></div>
              <RatingSelect id={`ln-l-${i}`} label="Likelihood" value={l.likelihood} onChange={(x) => setLine(i, { likelihood: x })} scale={matrix.likelihood} optional />
              <RatingSelect id={`ln-c-${i}`} label="Consequence" value={l.consequence} onChange={(x) => setLine(i, { consequence: x })} scale={matrix.consequence} optional />
              <RatingSelect id={`ln-rl-${i}`} label="Residual likelihood" value={l.residualLikelihood} onChange={(x) => setLine(i, { residualLikelihood: x })} scale={matrix.likelihood} optional />
              <RatingSelect id={`ln-rc-${i}`} label="Residual consequence" value={l.residualConsequence} onChange={(x) => setLine(i, { residualConsequence: x })} scale={matrix.consequence} optional />
              <PersonSelect me={me} id={`ln-resp-${i}`} value={l.responsibleId} onChange={(x) => setLine(i, { responsibleId: x })} />
              <div className="mt-field-end small">{level ? <>Initial <RiskBadge level={level.key} label={level.label} rank={level.rank} high={level.rank >= matrix.highFrom} /></> : null} {res ? <>Residual <RiskBadge level={res.key} label={res.label} rank={res.rank} /></> : null}</div>
            </div>
            <h4 className="erp-h3">Controls</h4>
            {l.controls.map((c, k) => (
              <div key={k} className="whs-control-row">
                <label className="sr-only" htmlFor={`ct-st-${i}-${k}`}>Existing or additional</label>
                <select id={`ct-st-${i}-${k}`} className="select" value={c.stage} onChange={(e) => setLine(i, { controls: l.controls.map((x, n) => (n === k ? { ...x, stage: e.target.value as RaControl['stage'] } : x)) })}><option value="existing">Existing</option><option value="additional">Additional</option></select>
                <label className="sr-only" htmlFor={`ct-h-${i}-${k}`}>Hierarchy of controls</label>
                <select id={`ct-h-${i}-${k}`} className="select" value={c.hierarchy} onChange={(e) => setLine(i, { controls: l.controls.map((x, n) => (n === k ? { ...x, hierarchy: e.target.value } : x)) })}>{options(me.lists.hierarchy)}</select>
                <label className="sr-only" htmlFor={`ct-d-${i}-${k}`}>Control</label>
                <input id={`ct-d-${i}-${k}`} className="input" value={c.description} placeholder="The control" onChange={(e) => setLine(i, { controls: l.controls.map((x, n) => (n === k ? { ...x, description: e.target.value } : x)) })} />
                <label className="sr-only" htmlFor={`ct-e-${i}-${k}`}>Effectiveness</label>
                <select id={`ct-e-${i}-${k}`} className="select" value={c.effectiveness ?? 'not_assessed'} onChange={(e) => setLine(i, { controls: l.controls.map((x, n) => (n === k ? { ...x, effectiveness: e.target.value } : x)) })}>{options(me.lists.effectiveness)}</select>
                <button className="btn ghost sm" aria-label="Remove the control" onClick={() => setLine(i, { controls: l.controls.filter((_, n) => n !== k) })}><Icon name="x" size={14} /></button>
              </div>
            ))}
            <div className="row wrap">
              <button className="btn sm" onClick={() => setLine(i, { controls: [...l.controls, { stage: 'additional', hierarchy: 'engineering', description: '', effectiveness: 'not_assessed' }] })}><Icon name="plus" size={14} /> Add a control</button>
              <button className="btn ghost sm" onClick={() => setLines(lines.filter((_, k) => k !== i))}>Remove this hazard</button>
            </div>
            {lowOnly ? <Warnings items={['A high risk with only administrative controls and PPE: look for elimination, substitution, isolation or engineering controls first.']} /> : null}
          </fieldset>
        );
      })}
      <div className="row wrap">
        <button className="btn" onClick={() => setLines([...lines, { stepKey: steps[steps.length - 1]?.key ?? '', hazard: '', harm: '', persons: '', likelihood: '', consequence: '', residualLikelihood: '', residualConsequence: '', responsibleId: '', controls: [] }])}><Icon name="plus" /> Add a hazard</button>
        <span className="grow" />
        <button className="btn" onClick={onDone}>Back</button>
        <button className="btn primary" disabled={busy || !valid} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button>
      </div>
    </Section>
  );
}

function ReviseDialog({ companyId, me, ra, onClose, onMade }: { companyId: string; me: WhsMe; ra: RiskAssessment; onClose: () => void; onMade: (id: string) => void }) {
  const [trigger, setTrigger] = useState('work');
  const [reason, setReason] = useState('');
  const act = useWhsAct(companyId);
  const save = async () => {
    const r = await act(() => post<RaView>(whsPath(companyId, `/risk-assessments/${ra.id}/revise`), { trigger, reason }), 'New revision drafted');
    if (r) onMade(r.assessment.id);
  };
  return (
    <Modal title={`Review ${ra.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!reason.trim()} onClick={() => void save()}>Draft revision {ra.revision + 1}</button></>}>
      <div className="stack">
        <p className="muted small">An assessment is reviewed when the work, the equipment, the controls or the circumstances change. The approved revision stays in force until the new one is approved.</p>
        <div className="field"><label htmlFor="rv-t">Why</label><select id="rv-t" className="select" value={trigger} onChange={(e) => setTrigger(e.target.value)}>{options(me.lists.reviewTriggers)}</select></div>
        <div className="field"><label htmlFor="rv-r">What changed</label><textarea id="rv-r" className="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ the risk register

interface RegisterView {
  matrix: Matrix;
  heatMap: { initial: number[][]; residual: number[][] };
  otherMatrix: number;
  byLevel: Record<string, number>;
  rows: { source: 'risk_assessment' | 'hazard'; id: string; number: string; title: string; hazard: string; level: string; levelLabel: string; rank: number; residualLevel: string | null; residualLabel: string; reviewDate: string | null; reviewDue: boolean }[];
}

export function RiskRegister({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Risk register');
  const [site, setSite] = useState('');
  const q = useQuery({ queryKey: ['whs', companyId, 'register', site], queryFn: () => get<RegisterView>(whsPath(companyId, `/risk-register?today=${localToday()}${site ? `&site=${encodeURIComponent(site)}` : ''}`)) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const d = q.data;
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Every hazard of the approved risk assessments and the rated hazards of the register, highest first.</p>
        {me.sites.length ? <div className="field"><label htmlFor="rr-site" className="sr-only">Site</label><select id="rr-site" className="select" value={site} onChange={(e) => setSite(e.target.value)}><option value="">All sites</option>{me.sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div> : null}
        <a className="btn" href={csvHref(companyId, `/risk-register${site ? `?site=${encodeURIComponent(site)}` : ''}`)} download><Icon name="download" /> Export CSV</a>
      </div>
      <div className="qc-two">
        <HeatMap title="Initial risk" matrix={d.matrix} grid={d.heatMap.initial} />
        <HeatMap title="Residual risk" matrix={d.matrix} grid={d.heatMap.residual} />
      </div>
      {d.otherMatrix ? <p className="muted small">{d.otherMatrix} ratings were made on an earlier version of the matrix: they are in the list below, not in the heat map.</p> : null}
      <Section title="By level">
        <ul className="whs-levels">{d.matrix.levels.slice().reverse().map((l) => <li key={l.key}><RiskBadge level={l.key} label={l.label} rank={l.rank} high={l.rank >= d.matrix.highFrom} /> {d.byLevel[l.key] ?? 0} <span className="muted small">{l.action}</span></li>)}</ul>
      </Section>
      <Section title="The register">
        {!d.rows.length ? <p className="muted small">Nothing rated yet.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table mt-table">
              <thead><tr><th>Record</th><th>Hazard</th><th>Initial</th><th>Residual</th><th>Review</th></tr></thead>
              <tbody>{d.rows.map((r, k) => <tr key={`${r.id}-${k}`}><td data-label="Record"><Link to={whsPage(companyId, r.source === 'hazard' ? `/hazards/${r.id}` : `/risk/${r.id}`)}><span className="mt-num">{r.number}</span> {r.title}</Link></td><td data-label="Hazard">{r.hazard}</td><td data-label="Initial"><RiskBadge level={r.level} label={r.levelLabel} rank={r.rank} /></td><td data-label="Residual">{r.residualLevel ? <RiskBadge level={r.residualLevel} label={r.residualLabel} /> : ''}</td><td data-label="Review" className={r.reviewDue ? 'mt-overdue' : ''}>{dateText(r.reviewDate)}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}

/** The heat map: likelihood down, consequence across, each cell its level (in words and shade) and its count. */
export function HeatMap({ title, matrix, grid }: { title: string; matrix: Matrix; grid: number[][] }) {
  return (
    <Section title={title}>
      <div className="crm-table-scroll">
        <table className="whs-heatmap">
          <caption className="sr-only">{title}: likelihood by consequence, with the number of hazards in each cell</caption>
          <thead><tr><th scope="col" className="small">Likelihood \ Consequence</th>{matrix.consequence.map((c) => <th key={c.value} scope="col" className="small">{c.value}. {c.label}</th>)}</tr></thead>
          <tbody>
            {matrix.likelihood.slice().reverse().map((l) => (
              <tr key={l.value}>
                <th scope="row" className="small">{l.value}. {l.label}</th>
                {matrix.consequence.map((c) => {
                  const key = matrix.grid[l.value - 1][c.value - 1];
                  const level = matrix.levels.find((x) => x.key === key);
                  const n = grid[l.value - 1]?.[c.value - 1] ?? 0;
                  return <td key={c.value} className={`whs-cell whs-risk-${Math.min(level?.rank ?? 1, 6)}${n ? '' : ' whs-cell-empty'}`} title={`${level?.label ?? ''}: ${n}`}><span className="whs-cell-n">{n || ''}</span><span className="whs-cell-l">{level?.label}</span></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

