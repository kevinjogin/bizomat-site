// BIZOMAT WHS, Release 1: the hazard register (a list with filters and CSV) and one hazard with its workflow: Reported,
// Assessment, Controls assigned, Control implementation, Verification, Closed. Rating on the company's risk matrix,
// controls as actions tagged with the hierarchy of controls, links to risk assessments, incidents and Maintenance work
// orders, photos, notes and consultation, and the history.
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal } from '../../components/ui/overlays';
import { csvHref, dateText, dayText, localToday, whsPage, whsPath, type Action, type Hazard, type Matrix, type WhsComment, type WhsEvent, type WhsFile, type WhsLink, type WhsMe } from './api';
import { Comments, ConfidentialBadge, FilterPanel, History, NoteDialog, PersonSelect, Props, RatingSelect, RiskBadge, Section, StatusBadge, Stepper, Warnings, WhsFiles, WhsUpload, levelOf, options, useWhsAct } from './common';
import { ActionRows, NewActionForm, type ActionDraft } from './Actions';

export function HazardsPage({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Hazards');
  const [sp, setSp] = useSearchParams();
  const f = { status: sp.get('status') ?? '', category: sp.get('category') ?? '', site: sp.get('site') ?? '', level: sp.get('level') ?? '', q: sp.get('q') ?? '' };
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    const n = new URLSearchParams(sp);
    if (e.target.value) n.set(k, e.target.value);
    else n.delete(k);
    setSp(n, { replace: true });
  };
  const query = new URLSearchParams({ today: localToday(), ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) });
  const q = useQuery({ queryKey: ['whs', companyId, 'hazards', query.toString()], queryFn: () => get<{ hazards: Hazard[]; total: number }>(whsPath(companyId, `/hazards?${query}`)) });
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">{me.can.view ? 'Every hazard reported in the company, highest risk first.' : 'Your hazard reports and the hazards you are responsible for.'}</p>
        <Link className="btn primary" to={whsPage(companyId, '/report/hazard')}><Icon name="plus" /> Report a hazard</Link>
        {me.can.view ? <a className="btn" href={csvHref(companyId, `/hazards?${query}`)} download><Icon name="download" /> Export CSV</a> : null}
      </div>
      <FilterPanel active={Object.values(f).filter(Boolean).length}>
        <div className="field"><label htmlFor="hz-q">Search</label><input id="hz-q" className="input" value={f.q} onChange={set('q')} placeholder="Number, title, place" /></div>
        <div className="field"><label htmlFor="hz-s">Status</label><select id="hz-s" className="select" value={f.status} onChange={set('status')}><option value="">Any</option><option value="open">Not closed</option>{options(me.lists.hazardStatus)}</select></div>
        <div className="field"><label htmlFor="hz-c">Category</label><select id="hz-c" className="select" value={f.category} onChange={set('category')}><option value="">Any</option>{options(me.lists.hazardCategories)}</select></div>
        {me.sites.length ? <div className="field"><label htmlFor="hz-site">Site</label><select id="hz-site" className="select" value={f.site} onChange={set('site')}><option value="">Any</option>{me.sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div> : null}
        <div className="field"><label htmlFor="hz-l">Risk level</label><select id="hz-l" className="select" value={f.level} onChange={set('level')}><option value="">Any</option>{me.matrix.levels.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}</select></div>
      </FilterPanel>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : !q.data.hazards.length ? (
        <EmptyState icon="alert" title="No hazards here">Anyone in the company can report one, from a phone, with a photo.</EmptyState>
      ) : (
        <div className="crm-table-scroll">
          <table className="data-table mt-table">
            <thead><tr><th>Hazard</th><th>Category</th><th>Where</th><th>Risk</th><th>Status</th><th>Responsible</th><th>Due</th></tr></thead>
            <tbody>
              {q.data.hazards.map((h) => (
                <tr key={h.id}>
                  <td data-label="Hazard"><Link to={whsPage(companyId, `/hazards/${h.id}`)} className="mt-primary"><span className="mt-num">{h.number}</span> {h.title}</Link> {h.confidential ? <ConfidentialBadge /> : null}<div className="muted small">Reported {dayText(h.reportedAt)}{h.reportedByName ? ` by ${h.reportedByName}` : ''}</div></td>
                  <td data-label="Category">{h.categoryLabel}</td>
                  <td data-label="Where">{[h.siteName, h.location].filter(Boolean).join(', ')}</td>
                  <td data-label="Risk"><RiskBadge level={h.riskLevel} label={h.riskLabel} rank={h.riskRank} high={h.high} /></td>
                  <td data-label="Status"><StatusBadge status={h.status} label={h.statusLabel} /></td>
                  <td data-label="Responsible">{h.responsibleName ?? ''}</td>
                  <td data-label="Due" className={h.overdue ? 'mt-overdue' : ''}>{dateText(h.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {q.data.total > q.data.hazards.length ? <p className="muted small">{q.data.hazards.length} of {q.data.total} shown: narrow the filters to see the rest.</p> : null}
        </div>
      )}
    </div>
  );
}

interface HazardView {
  hazard: Hazard;
  matrix: Matrix | null;
  actions: Action[];
  links: WhsLink[];
  files: WhsFile[];
  comments: WhsComment[];
  history: WhsEvent[];
  warnings: string[];
  can: Record<'edit' | 'assess' | 'advance' | 'close' | 'link' | 'addFiles' | 'comment' | 'consult', boolean>;
}

const FLOW: [string, string][] = [
  ['reported', 'Reported'],
  ['assessment', 'Assessment'],
  ['controls_assigned', 'Controls assigned'],
  ['implementation', 'Implementation'],
  ['verification', 'Verification'],
  ['closed', 'Closed'],
];

type Dialog = null | 'assess' | 'controls' | 'close' | 'cancel' | 'reopen' | 'link' | 'edit';

export function HazardDetail({ companyId, me }: { companyId: string; me: WhsMe }) {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ['whs', companyId, 'hazard', id], queryFn: () => get<HazardView>(whsPath(companyId, `/hazards/${id}?today=${localToday()}`)), retry: false });
  const act = useWhsAct(companyId);
  const [dialog, setDialog] = useState<Dialog>(null);
  usePageTitle(q.data ? `${q.data.hazard.number} ${q.data.hazard.title}` : 'Hazard');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const h = v.hazard;
  const refresh = () => void q.refetch();
  const advance = (to: string, done: string, extra: Record<string, unknown> = {}) => act(() => post(whsPath(companyId, `/hazards/${h.id}/advance`), { to, ...extra }), done);
  return (
    <div className="stack whs-detail">
      <div className="mt-path"><Link to={whsPage(companyId, '/hazards')}>Hazards</Link><span className="sep">/</span><span>{h.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{h.number}</span> {h.title}</h2>
          <div className="mt-badges"><StatusBadge status={h.status} label={h.statusLabel} /><RiskBadge level={h.riskLevel} label={h.riskLabel} rank={h.riskRank} high={h.high} /><span className="badge">{h.categoryLabel}</span>{h.confidential ? <ConfidentialBadge /> : null}{h.overdue ? <span className="badge danger">Overdue</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          {v.can.assess ? <button className={`btn${h.riskLevel ? '' : ' primary'}`} onClick={() => setDialog('assess')}>{h.riskLevel ? 'Rate again' : 'Assess the risk'}</button> : null}
          {v.can.assess && ['assessment', 'controls_assigned', 'implementation'].includes(h.status) ? <button className="btn" onClick={() => setDialog('controls')}>Assign controls</button> : null}
          {v.can.advance && h.status === 'controls_assigned' ? <button className="btn" onClick={() => void advance('implementation', 'Implementation started')}>Start implementation</button> : null}
          {v.can.advance && ['controls_assigned', 'implementation'].includes(h.status) ? <button className="btn" onClick={() => void advance('verification', 'Ready for verification')}>Ready for verification</button> : null}
          {v.can.close ? <button className="btn primary" onClick={() => setDialog('close')}><Icon name="check" /> Verify and close</button> : null}
          {v.can.assess && me.can.assess ? <button className="btn" onClick={() => navigate(whsPage(companyId, `/risk/new?hazard=${h.id}`))}>Make a risk assessment</button> : null}
          {v.can.edit ? <button className="btn ghost" onClick={() => setDialog('edit')}><Icon name="edit" /> Edit</button> : null}
          {v.can.assess && !['closed', 'cancelled'].includes(h.status) ? <button className="btn ghost" onClick={() => setDialog('cancel')}>Cancel</button> : null}
          {me.can.approve && ['closed', 'cancelled'].includes(h.status) ? <button className="btn ghost" onClick={() => setDialog('reopen')}>Reopen</button> : null}
        </div>
      </div>
      {h.status !== 'cancelled' ? <Stepper steps={FLOW} current={h.status} /> : null}
      <Warnings items={v.warnings} />
      <div className="qc-two">
        <Section title="The hazard">
          <Props items={[
            ['Description', h.description],
            ['Site', h.siteName],
            ['Where', h.location],
            ['Department', h.departmentName],
            ['Asset', h.assetLabel],
            ['Activity', h.activity],
            ['People exposed', h.peopleExposed],
            ['What could happen', h.consequenceText],
            ['Reported', `${dayText(h.reportedAt)}${h.reportedByName ? ` by ${h.reportedByName}` : ''}`],
          ]} />
        </Section>
        <Section title="Risk and controls">
          <Props items={[
            ['Initial risk', h.riskLevel ? <><RiskBadge level={h.riskLevel} label={h.riskLabel} rank={h.riskRank} high={h.high} /> <span className="muted small">likelihood {h.likelihood}, consequence {h.consequence}</span></> : 'Not rated yet'],
            ['Assessed', h.assessedAt ? `${dayText(h.assessedAt)}${h.assessedByName ? ` by ${h.assessedByName}` : ''}` : ''],
            ['Existing controls', h.existingControls],
            ['Proposed controls', h.proposedControls],
            ['Responsible', h.responsibleName],
            ['Due', h.dueDate ? <span className={h.overdue ? 'mt-overdue' : ''}>{dateText(h.dueDate)}</span> : ''],
            ['Residual risk', h.residualLevel ? <><RiskBadge level={h.residualLevel} label={h.residualLabel} /> <span className="muted small">likelihood {h.residualLikelihood}, consequence {h.residualConsequence}</span></> : ''],
            ['Verified', h.verifiedAt ? `${dayText(h.verifiedAt)}${h.verifiedByName ? ` by ${h.verifiedByName}` : ''}: ${h.verificationNote}` : ''],
            ['Closed or cancelled', h.closureNote && !h.verifiedAt ? h.closureNote : ''],
          ]} />
        </Section>
      </div>
      <Section title={`Actions (${v.actions.length})`} actions={v.can.assess && !['closed', 'cancelled'].includes(h.status) ? <button className="btn sm" onClick={() => setDialog('controls')}><Icon name="plus" size={14} /> Add a control action</button> : null}>
        {v.actions.length ? <ActionRows companyId={companyId} actions={v.actions} /> : <p className="muted small">No actions yet. Controls are carried out as actions, each tagged with its place in the hierarchy of controls.</p>}
      </Section>
      <Section title="Linked records" actions={v.can.link ? <button className="btn sm" onClick={() => setDialog('link')}><Icon name="link" size={14} /> Link</button> : null}>
        <LinkList companyId={companyId} links={v.links} />
      </Section>
      <Section title="Photos and documents" actions={v.can.addFiles ? <WhsUpload companyId={companyId} kind="hazard" id={h.id} onDone={refresh} camera={false} /> : null}>
        <WhsFiles companyId={companyId} files={v.files} onRemoved={refresh} canRemove={me.can.approve} />
      </Section>
      {v.can.comment || v.comments.length ? (
        <Section title="Notes and consultation">
          <Comments companyId={companyId} entityType="hazard" entityId={h.id} comments={v.comments} canNote={me.can.view} canConsult={v.can.consult} />
        </Section>
      ) : null}
      {v.history.length ? <Section title="History"><History events={v.history as any} /></Section> : null}

      {dialog === 'assess' ? <AssessDialog companyId={companyId} me={me} hazard={h} onClose={() => setDialog(null)} /> : null}
      {dialog === 'controls' ? <ControlsDialog companyId={companyId} me={me} hazard={h} onClose={() => setDialog(null)} /> : null}
      {dialog === 'close' ? <CloseDialog me={me} onClose={() => setDialog(null)} onSave={(note, rl, rc) => advance('closed', `${h.number} closed`, { note, residualLikelihood: rl || undefined, residualConsequence: rc || undefined })} /> : null}
      {dialog === 'cancel' ? <NoteDialog title={`Cancel ${h.number}`} label="Why is it cancelled?" confirm="Cancel the hazard" danger required onClose={() => setDialog(null)} onSave={(note) => advance('cancelled', `${h.number} cancelled`, { note })} /> : null}
      {dialog === 'reopen' ? <NoteDialog title={`Reopen ${h.number}`} label="Why is it reopened?" confirm="Reopen" onClose={() => setDialog(null)} onSave={(note) => advance('reopen', `${h.number} reopened`, { note })} /> : null}
      {dialog === 'link' ? <LinkDialog companyId={companyId} from={{ type: 'hazard', id: h.id }} onClose={() => setDialog(null)} /> : null}
      {dialog === 'edit' ? <EditHazard companyId={companyId} me={me} hazard={h} canAssign={me.can.assess} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

export function LinkList({ companyId, links }: { companyId: string; links: WhsLink[] }) {
  if (!links.length) return <p className="muted small">No linked records.</p>;
  const to = (l: WhsLink) => (l.type === 'hazard' ? whsPage(companyId, `/hazards/${l.id}`) : l.type === 'incident' ? whsPage(companyId, `/incidents/${l.id}`) : l.type === 'risk_assessment' ? whsPage(companyId, `/risk/${l.id}`) : `/c/${encodeURIComponent(companyId)}/maintenance/work-orders/${l.id}`);
  return (
    <ul className="erp-list">
      {links.map((l) => <li key={`${l.type}:${l.id}`} className="small"><span className="muted">{l.typeLabel}:</span> <Link to={to(l)}><span className="mt-num">{l.number}</span> {l.title}</Link></li>)}
    </ul>
  );
}

/** Link a record to an incident, a hazard, a risk assessment or a Maintenance work order of the same company. */
export function LinkDialog({ companyId, from, onClose }: { companyId: string; from: { type: 'hazard' | 'incident' | 'risk_assessment'; id: string }; onClose: () => void }) {
  const [type, setType] = useState<'incident' | 'hazard' | 'risk_assessment' | 'work_order'>(from.type === 'incident' ? 'hazard' : 'incident');
  const [target, setTarget] = useState('');
  const act = useWhsAct(companyId);
  const list = useQuery({
    queryKey: ['whs', companyId, 'link-options', type],
    queryFn: async () => {
      if (type === 'incident') return (await get<{ incidents: { id: string; number: string; title: string }[] }>(whsPath(companyId, '/incidents?limit=200'))).incidents;
      if (type === 'hazard') return (await get<{ hazards: { id: string; number: string; title: string }[] }>(whsPath(companyId, '/hazards?limit=200'))).hazards;
      if (type === 'risk_assessment') return (await get<{ assessments: { id: string; number: string; revision: number; title: string }[] }>(whsPath(companyId, '/risk-assessments'))).assessments.map((r) => ({ id: r.id, number: `${r.number} rev ${r.revision}`, title: r.title }));
      return (await get<{ workOrders: { id: string; number: string; description: string }[] }>(`/maintenance/c/${encodeURIComponent(companyId)}/work-orders?limit=200`)).workOrders.map((x) => ({ id: x.id, number: x.number, title: x.description }));
    },
  });
  const save = async () => {
    const r = await act(() => post(whsPath(companyId, '/links'), { fromType: from.type, fromId: from.id, toType: type, toId: target }), 'Linked');
    if (r) onClose();
  };
  return (
    <Modal title="Link a record" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!target} onClick={() => void save()}>Link</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="ln-type">Kind of record</label><select id="ln-type" className="select" value={type} onChange={(e) => { setType(e.target.value as typeof type); setTarget(''); }}>
          {from.type !== 'incident' ? <option value="incident">Incident</option> : null}
          {from.type !== 'hazard' ? <option value="hazard">Hazard</option> : null}
          {from.type !== 'risk_assessment' ? <option value="risk_assessment">Risk assessment</option> : null}
          <option value="work_order">Maintenance work order</option>
        </select></div>
        {list.error ? <ErrorBox error={list.error} /> : (
          <div className="field"><label htmlFor="ln-target">Record</label><select id="ln-target" className="select" value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">Choose one</option>
            {(list.data ?? []).filter((x) => x.id !== from.id).map((x) => <option key={x.id} value={x.id}>{x.number} {x.title.slice(0, 80)}</option>)}
          </select></div>
        )}
      </div>
    </Modal>
  );
}

function AssessDialog({ companyId, me, hazard, onClose }: { companyId: string; me: WhsMe; hazard: Hazard; onClose: () => void }) {
  const [l, setL] = useState<number | ''>(hazard.likelihood ?? '');
  const [c, setC] = useState<number | ''>(hazard.consequence ?? '');
  const [existing, setExisting] = useState(hazard.existingControls);
  const [note, setNote] = useState('');
  const act = useWhsAct(companyId);
  const level = levelOf(me.matrix, l, c);
  const save = async () => {
    const r = await act(() => post(whsPath(companyId, `/hazards/${hazard.id}/assess`), { likelihood: l, consequence: c, existingControls: existing, note: note || undefined }), `${hazard.number} rated`);
    if (r) onClose();
  };
  return (
    <Modal title={`Assess ${hazard.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!l || !c} onClick={() => void save()}>Save the rating</button></>}>
      <div className="stack">
        <p className="muted small">Rated on your company’s risk matrix (version {me.matrixVersion}). The rating keeps the matrix it was made on.</p>
        <div className="whs-two">
          <RatingSelect id="as-l" label="Likelihood" value={l} onChange={setL} scale={me.matrix.likelihood} />
          <RatingSelect id="as-c" label="Consequence" value={c} onChange={setC} scale={me.matrix.consequence} />
        </div>
        {level ? <p>Risk level: <RiskBadge level={level.key} label={level.label} rank={level.rank} high={level.rank >= me.matrix.highFrom} /> <span className="muted small">{level.action}</span></p> : null}
        <div className="field"><label htmlFor="as-ex">Existing controls</label><textarea id="as-ex" className="textarea" rows={2} value={existing} onChange={(e) => setExisting(e.target.value)} /></div>
        <div className="field"><label htmlFor="as-note">Note (optional)</label><input id="as-note" className="input" value={note} onChange={(e) => setNote(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function ControlsDialog({ companyId, me, hazard, onClose }: { companyId: string; me: WhsMe; hazard: Hazard; onClose: () => void }) {
  const [proposed, setProposed] = useState(hazard.proposedControls);
  const [responsible, setResponsible] = useState(hazard.responsibleId ?? '');
  const [due, setDue] = useState(hazard.dueDate ?? '');
  const [actions, setActions] = useState<ActionDraft[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const act = useWhsAct(companyId);
  const save = async () => {
    const r = await act(() => post<{ warnings: string[] }>(whsPath(companyId, `/hazards/${hazard.id}/controls`), { proposedControls: proposed || undefined, responsibleId: responsible || null, dueDate: due || null, actions: actions.map((a) => ({ ...a, responsibleId: a.responsibleId || null, dueDate: a.dueDate || null, hierarchy: a.hierarchy || null })) }), 'Controls assigned');
    if (r?.warnings.length) setWarnings(r.warnings);
    else if (r) onClose();
  };
  return (
    <Modal wide title={`Controls for ${hazard.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>{warnings.length ? 'Close' : 'Back'}</button>{warnings.length ? null : <button className="btn primary" onClick={() => void save()}>Assign the controls</button>}</>}>
      <div className="stack">
        <Warnings items={warnings} />
        <p className="muted small">Prefer controls high in the hierarchy: eliminate the hazard, substitute it, isolate people from it, or engineer it out. Administrative controls and PPE come last.</p>
        <div className="field"><label htmlFor="ct-proposed">Proposed controls</label><textarea id="ct-proposed" className="textarea" rows={3} value={proposed} onChange={(e) => setProposed(e.target.value)} /></div>
        <div className="whs-two">
          <PersonSelect me={me} id="ct-resp" value={responsible} onChange={setResponsible} label="Responsible for the hazard" />
          <div className="field"><label htmlFor="ct-due">Due</label><input id="ct-due" type="date" className="input" value={due} onChange={(e) => setDue(e.target.value)} /></div>
        </div>
        <h3 className="erp-h3">Actions to carry the controls out</h3>
        {actions.map((a, i) => (
          <div key={i} className="row wrap whs-draft-action"><strong className="grow">{a.title}</strong><span className="muted small">{me.lists.hierarchy[a.hierarchy] ?? 'Not tagged'}{a.evidenceRequired ? ', evidence needed' : ''}</span><button className="btn ghost sm" aria-label={`Remove ${a.title}`} onClick={() => setActions(actions.filter((_, k) => k !== i))}><Icon name="x" size={14} /></button></div>
        ))}
        <NewActionForm me={me} onAdd={(a) => setActions([...actions, a])} />
      </div>
    </Modal>
  );
}

function CloseDialog({ me, onClose, onSave }: { me: WhsMe; onClose: () => void; onSave: (note: string, rl: number | '', rc: number | '') => Promise<unknown> }) {
  const [rl, setRl] = useState<number | ''>('');
  const [rc, setRc] = useState<number | ''>('');
  const level = levelOf(me.matrix, rl, rc);
  return (
    <NoteDialog title="Verify and close" label="How were the controls verified?" confirm="Close the hazard" required onClose={onClose} onSave={(note) => onSave(note, rl, rc)} intro={<p className="muted small">Every action from this hazard must be verified first.</p>}>
      <div className="whs-two">
        <RatingSelect id="cl-l" label="Residual likelihood" value={rl} onChange={setRl} scale={me.matrix.likelihood} optional />
        <RatingSelect id="cl-c" label="Residual consequence" value={rc} onChange={setRc} scale={me.matrix.consequence} optional />
      </div>
      {level ? <p className="small">Residual risk: <RiskBadge level={level.key} label={level.label} rank={level.rank} /></p> : null}
    </NoteDialog>
  );
}

function EditHazard({ companyId, me, hazard, canAssign, onClose }: { companyId: string; me: WhsMe; hazard: Hazard; canAssign: boolean; onClose: () => void }) {
  const [f, setF] = useState({ title: hazard.title, description: hazard.description, category: hazard.category, siteId: hazard.siteId ?? '', location: hazard.location, activity: hazard.activity, peopleExposed: hazard.peopleExposed, consequenceText: hazard.consequenceText, existingControls: hazard.existingControls, proposedControls: hazard.proposedControls, responsibleId: hazard.responsibleId ?? '', dueDate: hazard.dueDate ?? '' });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const act = useWhsAct(companyId);
  const save = async () => {
    const body: Record<string, unknown> = { ...f, siteId: f.siteId || null };
    if (canAssign) {
      body.responsibleId = f.responsibleId || null;
      body.dueDate = f.dueDate || null;
    } else {
      delete body.responsibleId;
      delete body.dueDate;
    }
    const r = await act(() => patch(whsPath(companyId, `/hazards/${hazard.id}`), body), 'Saved');
    if (r) onClose();
  };
  return (
    <Modal wide title={`Edit ${hazard.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="eh-title">Title</label><input id="eh-title" className="input" value={f.title} onChange={set('title')} /></div>
        <div className="field"><label htmlFor="eh-cat">Category</label><select id="eh-cat" className="select" value={f.category} onChange={set('category')}>{options(me.lists.hazardCategories)}</select></div>
        <div className="field"><label htmlFor="eh-site">Site</label><select id="eh-site" className="select" value={f.siteId} onChange={set('siteId')}><option value="">Not at a site</option>{me.sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div className="field span-2"><label htmlFor="eh-loc">Where</label><input id="eh-loc" className="input" value={f.location} onChange={set('location')} /></div>
        <div className="field span-2"><label htmlFor="eh-desc">Description</label><textarea id="eh-desc" className="textarea" rows={3} value={f.description} onChange={set('description')} /></div>
        <div className="field"><label htmlFor="eh-act">Activity</label><input id="eh-act" className="input" value={f.activity} onChange={set('activity')} /></div>
        <div className="field"><label htmlFor="eh-people">People exposed</label><input id="eh-people" className="input" value={f.peopleExposed} onChange={set('peopleExposed')} /></div>
        <div className="field span-2"><label htmlFor="eh-cons">What could happen</label><textarea id="eh-cons" className="textarea" rows={2} value={f.consequenceText} onChange={set('consequenceText')} /></div>
        <div className="field span-2"><label htmlFor="eh-ex">Existing controls</label><textarea id="eh-ex" className="textarea" rows={2} value={f.existingControls} onChange={set('existingControls')} /></div>
        <div className="field span-2"><label htmlFor="eh-pr">Proposed controls</label><textarea id="eh-pr" className="textarea" rows={2} value={f.proposedControls} onChange={set('proposedControls')} /></div>
        {canAssign ? <PersonSelect me={me} id="eh-resp" value={f.responsibleId} onChange={(v) => setF((x) => ({ ...x, responsibleId: v }))} /> : null}
        {canAssign ? <div className="field"><label htmlFor="eh-due">Due</label><input id="eh-due" type="date" className="input" value={f.dueDate} onChange={set('dueDate')} /></div> : null}
      </div>
    </Modal>
  );
}

