// BIZOMAT WHS, Release 1: the jurisdiction packs as a company sees them (read only, with each instrument's and rule's
// verification status and what was checked), the company's own policies, and the WHS settings: the jurisdictions of
// each site, the risk matrix (versioned), and the hours worked that injury frequency rates need.
import { useState, type ReactNode } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get, patch, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { Modal } from '../../components/ui/overlays';
import { dateText, dayText, whsPage, whsPath, type Instrument, type Matrix, type Pack, type Rule, type WhsMe } from './api';
import { LegalNotice, Props, RiskBadge, Section, useWhsAct } from './common';

export const VerifyBadge = ({ verified, label }: { verified: boolean; label?: string }) => <span className={`badge ${verified ? 'success' : 'warning'}`}>{label ?? (verified ? 'Verified' : 'Not verified')}</span>;

interface Policy {
  id: string;
  number: string;
  title: string;
  kindLabel: string;
  kindNote: string;
  packId: string | null;
  packName: string | null;
  summary: string;
  sourceUrl: string;
  effectiveFrom: string | null;
  reviewDate: string | null;
  status: string;
  approvedAt: number | null;
  approvedByName: string | null;
}

interface SettingsView {
  matrix: Matrix;
  matrixVersion: number;
  matrixVersions: { version: number; at: number; byName: string | null }[];
  sites: { id: string; code: string; name: string; packs: { id: string; name: string; regulator: string; rules: number; verifiedRules: number }[] }[];
  packs: Pack[];
  hours: { siteId: string | null; siteName: string | null; month: string; hours: number }[];
  policies: Policy[];
  can: { manage: boolean };
  notice: string;
}

export function JurisdictionsPage({ companyId, me }: { companyId: string; me: WhsMe }) {
  return (
    <Routes>
      <Route index element={<PackList companyId={companyId} me={me} />} />
      <Route path=":pack" element={<PackView companyId={companyId} />} />
    </Routes>
  );
}

function PackList({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('Jurisdictions');
  const q = useQuery({ queryKey: ['whs', 'packs'], queryFn: () => get<{ packs: Pack[]; notice: string }>('/whs/packs') });
  const s = useQuery({ queryKey: ['whs', companyId, 'settings'], queryFn: () => get<SettingsView>(whsPath(companyId, '/settings')) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const used = new Set(me.sites.flatMap((x) => x.packs.map((p) => p.id)));
  const byCountry = q.data.packs.reduce<Record<string, Pack[]>>((acc, p) => ((acc[p.country] ??= []).push(p), acc), {});
  const COUNTRY: Record<string, string> = { AU: 'Australia', NZ: 'New Zealand', GB: 'United Kingdom', CA: 'Canada', SG: 'Singapore', ZA: 'South Africa' };
  return (
    <div className="stack">
      <LegalNotice text={q.data.notice} />
      <Section title="Your sites">
        {!me.sites.length ? <p className="muted small">No sites yet. Sites are added in Maintenance, Settings, and given their jurisdictions in WHS settings.</p> : (
          <ul className="erp-list">{me.sites.map((x) => <li key={x.id} className="small"><strong>{x.name}</strong>: {x.packs.length ? x.packs.map((p) => <Link key={p.id} to={whsPage(companyId, `/jurisdictions/${p.id}`)} className="qc-inline">{p.name}</Link>) : <span className="muted">no jurisdiction chosen</span>}</li>)}</ul>
        )}
        {me.can.manage ? <p className="small"><Link to={whsPage(companyId, '/settings')}>Choose each site’s jurisdictions in WHS settings</Link></p> : null}
      </Section>
      {Object.entries(byCountry).map(([country, packs]) => (
        <Section key={country} title={COUNTRY[country] ?? country}>
          <ul className="erp-list">
            {packs.map((p) => (
              <li key={p.id} className="card card-pad stack whs-pack">
                <div className="row wrap">
                  <Link to={whsPage(companyId, `/jurisdictions/${p.id}`)} className="grow"><strong>{p.name}</strong></Link>
                  {used.has(p.id) ? <span className="badge accent">Used by your sites</span> : null}
                  {!p.assignable ? <span className="badge">Reference only</span> : null}
                  <span className="badge">{p.coverage === 'core' ? 'Core pack' : p.coverage === 'reference' ? 'Reference' : 'Skeleton pack'}</span>
                  <VerifyBadge verified={!!p.counts?.verifiedRules} label={`${p.counts?.verifiedRules ?? 0} of ${p.counts?.rules ?? 0} rules verified`} />
                </div>
                <p className="small muted">{p.framework}. Regulator: {p.regulator}.</p>
              </li>
            ))}
          </ul>
        </Section>
      ))}
      {s.data ? <PoliciesSection companyId={companyId} me={me} policies={s.data.policies} packs={s.data.packs} canManage={s.data.can.manage} /> : null}
    </div>
  );
}

function PackView({ companyId }: { companyId: string }) {
  const { pack = '' } = useParams();
  const q = useQuery({ queryKey: ['whs', 'pack', pack], queryFn: () => get<{ pack: Pack; instruments: Instrument[]; rules: Rule[]; notice: string }>(`/whs/packs/${encodeURIComponent(pack)}`) });
  usePageTitle(q.data?.pack.name ?? 'Jurisdiction');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { pack: p, instruments, rules } = q.data;
  return (
    <div className="stack">
      <div className="mt-path"><Link to={whsPage(companyId, '/jurisdictions')}>Jurisdictions</Link><span className="sep">/</span><span>{p.name}</span></div>
      <LegalNotice text={q.data.notice} />
      <Section title={p.name}>
        <Props items={[['Framework', p.framework], ['Regulator', p.regulatorUrl ? <a href={p.regulatorUrl} target="_blank" rel="noopener noreferrer">{p.regulator}</a> : p.regulator], ['Notes', p.notes], ['Pack version', String(p.version)]]} />
      </Section>
      <Section title="Instruments">
        <InstrumentList instruments={instruments} />
      </Section>
      <Section title="Rules">
        <RuleList rules={rules} />
      </Section>
    </div>
  );
}

export function InstrumentList({ instruments, actions }: { instruments: Instrument[]; actions?: (i: Instrument) => ReactNode }) {
  if (!instruments.length) return <p className="muted small">None yet.</p>;
  return (
    <ul className="erp-list">
      {instruments.map((i) => (
        <li key={i.id} className="card card-pad stack whs-instrument">
          <div className="row wrap">
            <strong className="grow">{i.title}</strong>
            <span className="badge">{i.kindLabel.split(' (')[0]}</span>
            <VerifyBadge verified={i.status === 'verified'} label={i.statusLabel} />
            {actions?.(i)}
          </div>
          <p className="small muted">{i.kindNote}</p>
          <Props items={[['Official source', <a href={i.sourceUrl} target="_blank" rel="noopener noreferrer">{i.sourceUrl}</a>], ['Applies to', i.industry], ['Citation', i.citation], ['In effect from', dateText(i.effectiveFrom)], ['Last amended', dateText(i.amendedAt)], ['Summary', i.summary], ['Verified', i.verifiedAt ? `${dayText(i.verifiedAt)}${i.verifiedByName ? ` by ${i.verifiedByName}` : ' by a BIZOMAT platform administrator'}, against ${i.verifiedSource}${i.verifiedNotes ? `: ${i.verifiedNotes}` : ''}` : ''], ['What was checked when it was added', i.sourceCheck]]} />
        </li>
      ))}
    </ul>
  );
}

export function RuleList({ rules, actions }: { rules: Rule[]; actions?: (r: Rule) => ReactNode }) {
  if (!rules.length) return <p className="muted small">None yet.</p>;
  return (
    <ul className="erp-list">
      {rules.map((r) => (
        <li key={r.id} className="card card-pad stack whs-instrument">
          <div className="row wrap">
            <strong className="grow">{r.title} <span className="muted small">(version {r.version})</span></strong>
            <span className="badge">{r.kindLabel}</span>
            <span className="badge">{r.statusLabel}</span>
            <VerifyBadge verified={r.verification === 'verified'} label={r.verificationLabel} />
            {actions?.(r)}
          </div>
          {r.verification !== 'verified' ? <p className="small whs-warning"><Icon name="alert" size={14} /> Not verified: a competent person must verify it against the official source before it is relied on. BIZOMAT computes no deadline from it.</p> : null}
          <Props items={[
            ['In effect', r.effectiveFrom || r.effectiveTo ? `${r.effectiveFrom ? `from ${dateText(r.effectiveFrom)}` : 'until'}${r.effectiveTo ? ` ${r.effectiveFrom ? 'to' : ''} ${dateText(r.effectiveTo)}` : ''}` : 'Effective date not verified'],
            ['Provision', r.provision],
            ['Text', r.body],
            ['Deadline', r.deadlineMinutes && r.verification === 'verified' ? `${r.deadlineMinutes >= 60 ? `${Math.round((r.deadlineMinutes / 60) * 10) / 10} hours` : `${r.deadlineMinutes} minutes`} from ${r.deadlineFrom === 'occurrence' ? 'the incident' : 'becoming aware of it'}` : r.deadlineText],
            ['Required information', r.requiredInfo.join('; ')],
            ['Site preservation', r.sitePreservation],
            ['Record retention', r.retention],
            ['Official source', <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">{r.sourceUrl}</a>],
            ['Verified', r.verifiedAt ? `${dayText(r.verifiedAt)} against ${r.verifiedSource}${r.verifiedNotes ? `: ${r.verifiedNotes}` : ''}${r.verifySod ? ' (one-administrator exception recorded)' : ''}` : r.verifiedNotes],
            ['Why this version', r.changeNote],
            ['What was checked when it was added', r.sourceCheck],
          ]} />
        </li>
      ))}
    </ul>
  );
}

function PoliciesSection({ companyId, me, policies, packs, canManage }: { companyId: string; me: WhsMe; policies: Policy[]; packs: Pack[]; canManage: boolean }) {
  const [adding, setAdding] = useState(false);
  const act = useWhsAct(companyId);
  return (
    <Section title="Company policies" actions={canManage ? <button className="btn sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add a policy</button> : null}>
      <p className="muted small">{me.lists.instrumentNotes.company_policy} They sit beside the legal instruments so people see both.</p>
      {policies.length ? (
        <ul className="erp-list">
          {policies.map((p) => (
            <li key={p.id} className="card card-pad stack whs-instrument">
              <div className="row wrap"><strong className="grow"><span className="mt-num">{p.number}</span> {p.title}</strong><span className="badge">Internal company policy</span><span className={`badge ${p.status === 'active' ? 'success' : ''}`}>{p.status === 'active' ? 'Active' : 'Retired'}</span>{canManage && p.status === 'active' ? <button className="btn ghost sm" onClick={() => void act(() => patch(whsPath(companyId, `/policies/${p.id}`), { retire: true }), 'Retired')}>Retire</button> : null}</div>
              <Props items={[['Summary', p.summary], ['Jurisdiction', p.packName], ['Document', p.sourceUrl ? <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">{p.sourceUrl}</a> : ''], ['In effect from', dateText(p.effectiveFrom)], ['Review by', dateText(p.reviewDate)], ['Approved', p.approvedAt ? `${dayText(p.approvedAt)}${p.approvedByName ? ` by ${p.approvedByName}` : ''}` : '']]} />
            </li>
          ))}
        </ul>
      ) : <p className="muted small">No company policies yet.</p>}
      {adding ? <PolicyDialog companyId={companyId} packs={packs} onClose={() => setAdding(false)} /> : null}
    </Section>
  );
}

function PolicyDialog({ companyId, packs, onClose }: { companyId: string; packs: Pack[]; onClose: () => void }) {
  const [f, setF] = useState({ title: '', packId: '', summary: '', sourceUrl: '', effectiveFrom: '', reviewDate: '' });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => post(whsPath(companyId, '/policies'), { ...f, packId: f.packId || null, effectiveFrom: f.effectiveFrom || null, reviewDate: f.reviewDate || null }), 'Policy added')) onClose();
  };
  return (
    <Modal title="Add a company policy" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" disabled={!f.title.trim()} onClick={() => void save()}>Add</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="po-title">Title</label><input id="po-title" className="input" value={f.title} onChange={set('title')} /></div>
        <div className="field span-2"><label htmlFor="po-pack">Jurisdiction (optional)</label><select id="po-pack" className="select" value={f.packId} onChange={set('packId')}><option value="">All of the company</option>{packs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div className="field span-2"><label htmlFor="po-sum">Summary</label><textarea id="po-sum" className="textarea" rows={3} value={f.summary} onChange={set('summary')} /></div>
        <div className="field span-2"><label htmlFor="po-url">Link to the document (https, optional)</label><input id="po-url" className="input" value={f.sourceUrl} onChange={set('sourceUrl')} /></div>
        <div className="field"><label htmlFor="po-from">In effect from</label><input id="po-from" type="date" className="input" value={f.effectiveFrom} onChange={set('effectiveFrom')} /></div>
        <div className="field"><label htmlFor="po-rev">Review by</label><input id="po-rev" type="date" className="input" value={f.reviewDate} onChange={set('reviewDate')} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ settings

export function WhsSettings({ companyId, me }: { companyId: string; me: WhsMe }) {
  usePageTitle('WHS settings');
  const q = useQuery({ queryKey: ['whs', companyId, 'settings'], queryFn: () => get<SettingsView>(whsPath(companyId, '/settings')) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const s = q.data;
  return (
    <div className="stack">
      {!s.can.manage ? <p className="muted small">Only WHS managers and ERP administrators change these settings.</p> : null}
      <SitesSection companyId={companyId} view={s} />
      <MatrixSection companyId={companyId} view={s} />
      <HoursSection companyId={companyId} me={me} view={s} />
      <Section title="Roles">
        <p className="small">WHS roles are ERP roles: WHS manager, WHS officer or supervisor, incident investigator, health and safety representative, and health officer. Everyone in the company reports hazards and incidents without a role.</p>
        <p className="muted small">Only health officers read medical details. Confidential reports are read by WHS managers and health officers.</p>
        {me.can.manage ? <Link className="btn" to={`/c/${encodeURIComponent(companyId)}/erp-roles`}><Icon name="shield" /> ERP roles</Link> : null}
      </Section>
    </div>
  );
}

function SitesSection({ companyId, view }: { companyId: string; view: SettingsView }) {
  const [editing, setEditing] = useState<string | null>(null);
  const site = view.sites.find((x) => x.id === editing);
  return (
    <Section title="Sites and their jurisdictions">
      <LegalNotice text={view.notice} />
      {!view.sites.length ? <p className="muted small">No sites yet. A maintenance administrator adds them in <Link to={`/c/${encodeURIComponent(companyId)}/maintenance/settings`}>Maintenance, Settings</Link>.</p> : (
        <table className="data-table responsive">
          <thead><tr><th>Site</th><th>Jurisdictions</th><th>Rules verified</th><th /></tr></thead>
          <tbody>
            {view.sites.map((x) => (
              <tr key={x.id}>
                <td data-label="Site"><strong>{x.name}</strong> <span className="muted small">{x.code}</span></td>
                <td data-label="Jurisdictions">{x.packs.length ? x.packs.map((p) => p.name).join(', ') : <span className="muted">None chosen: no rules are checked for its incidents</span>}</td>
                <td data-label="Rules verified">{x.packs.map((p) => `${p.verifiedRules} of ${p.rules}`).join(', ')}</td>
                <td>{view.can.manage ? <button className="btn sm" onClick={() => setEditing(x.id)}>Choose</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {site ? <SitePacksDialog companyId={companyId} site={site} packs={view.packs} onClose={() => setEditing(null)} /> : null}
    </Section>
  );
}

function SitePacksDialog({ companyId, site, packs, onClose }: { companyId: string; site: SettingsView['sites'][number]; packs: Pack[]; onClose: () => void }) {
  const [chosen, setChosen] = useState<string[]>(site.packs.map((p) => p.id));
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => put(whsPath(companyId, `/sites/${site.id}/jurisdictions`), { packIds: chosen }), 'Jurisdictions saved')) onClose();
  };
  return (
    <Modal title={`Jurisdictions of ${site.name}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <div className="stack">
        <p className="muted small">An incident at this site is checked only against the rules of the jurisdictions chosen here, never another’s. Most sites have one.</p>
        <fieldset className="erp-checks">
          <legend className="sr-only">Jurisdictions</legend>
          {packs.map((p) => <label key={p.id} className="checkbox"><input type="checkbox" checked={chosen.includes(p.id)} onChange={(e) => setChosen(e.target.checked ? [...chosen, p.id] : chosen.filter((x) => x !== p.id))} /> {p.name} <span className="muted small">({p.counts?.verifiedRules ?? 0} of {p.counts?.rules ?? 0} rules verified)</span></label>)}
        </fieldset>
      </div>
    </Modal>
  );
}

function MatrixSection({ companyId, view }: { companyId: string; view: SettingsView }) {
  const [editing, setEditing] = useState(false);
  const m = view.matrix;
  return (
    <Section title={`Risk matrix (version ${view.matrixVersion})`} actions={view.can.manage ? <button className="btn sm" onClick={() => setEditing(true)}><Icon name="edit" size={14} /> Change</button> : null}>
      <p className="muted small">Likelihood by consequence. A change makes a new version: earlier ratings keep the version they were made on. {m.levels.filter((l) => l.rank >= m.highFrom).map((l) => l.label).join(' and ')} count as high risks for the hierarchy-of-controls warning.</p>
      <MatrixTable m={m} />
      <ul className="whs-levels">{m.levels.slice().reverse().map((l) => <li key={l.key}><RiskBadge level={l.key} label={l.label} rank={l.rank} /> <span className="small muted">{l.action}</span></li>)}</ul>
      {view.matrixVersions.length > 1 ? <p className="muted small">Versions: {view.matrixVersions.map((v) => `${v.version} (${dayText(v.at)}${v.byName ? `, ${v.byName}` : ''})`).join('; ')}</p> : null}
      {editing ? <MatrixDialog companyId={companyId} matrix={m} onClose={() => setEditing(false)} /> : null}
    </Section>
  );
}

function MatrixTable({ m, onCell }: { m: Matrix; onCell?: (l: number, c: number) => void }) {
  return (
    <div className="crm-table-scroll">
      <table className="whs-heatmap">
        <caption className="sr-only">Risk matrix</caption>
        <thead><tr><th scope="col" className="small">Likelihood \ Consequence</th>{m.consequence.map((c) => <th key={c.value} scope="col" className="small">{c.value}. {c.label}</th>)}</tr></thead>
        <tbody>
          {m.likelihood.slice().reverse().map((l) => (
            <tr key={l.value}>
              <th scope="row" className="small">{l.value}. {l.label}</th>
              {m.consequence.map((c) => {
                const level = m.levels.find((x) => x.key === m.grid[l.value - 1]?.[c.value - 1]);
                return (
                  <td key={c.value} className={`whs-cell whs-risk-${Math.min(level?.rank ?? 1, 6)}`}>
                    {onCell ? <button type="button" className="whs-cell-btn" onClick={() => onCell(l.value, c.value)} aria-label={`Likelihood ${l.value}, consequence ${c.value}: ${level?.label}. Change`}>{level?.label}</button> : <span className="whs-cell-l">{level?.label}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatrixDialog({ companyId, matrix, onClose }: { companyId: string; matrix: Matrix; onClose: () => void }) {
  const [m, setM] = useState<Matrix>(JSON.parse(JSON.stringify(matrix)));
  const act = useWhsAct(companyId);
  const resize = (axis: 'likelihood' | 'consequence', n: number) => {
    const scale = Array.from({ length: n }, (_, i) => m[axis][i] ?? { value: i + 1, label: `Level ${i + 1}` }).map((x, i) => ({ ...x, value: i + 1 }));
    const L = axis === 'likelihood' ? n : m.likelihood.length;
    const C = axis === 'consequence' ? n : m.consequence.length;
    const fill = m.levels[0].key;
    setM({ ...m, [axis]: scale, grid: Array.from({ length: L }, (_, l) => Array.from({ length: C }, (_, c) => m.grid[l]?.[c] ?? fill)) });
  };
  const cycle = (l: number, c: number) => {
    const keys = m.levels.map((x) => x.key);
    const cur = m.grid[l - 1][c - 1];
    const next = keys[(keys.indexOf(cur) + 1) % keys.length];
    setM({ ...m, grid: m.grid.map((row, i) => (i === l - 1 ? row.map((v, k) => (k === c - 1 ? next : v)) : row)) });
  };
  const save = async () => {
    if (await act(() => put(whsPath(companyId, '/settings/matrix'), { matrix: m }), 'New matrix version saved')) onClose();
  };
  return (
    <Modal xl title="Change the risk matrix" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className="btn primary" onClick={() => void save()}>Save as a new version</button></>}>
      <div className="stack">
        <div className="whs-two">
          <div className="field"><label htmlFor="mx-l">Likelihood levels</label><select id="mx-l" className="select" value={m.likelihood.length} onChange={(e) => resize('likelihood', Number(e.target.value))}>{[2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
          <div className="field"><label htmlFor="mx-c">Consequence levels</label><select id="mx-c" className="select" value={m.consequence.length} onChange={(e) => resize('consequence', Number(e.target.value))}>{[2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
        </div>
        <div className="form-grid">
          <fieldset className="whs-action-form"><legend>Likelihood names</legend>{m.likelihood.map((x, i) => <div key={i} className="field"><label htmlFor={`mxl-${i}`}>{i + 1}</label><input id={`mxl-${i}`} className="input" value={x.label} onChange={(e) => setM({ ...m, likelihood: m.likelihood.map((y, k) => (k === i ? { ...y, label: e.target.value } : y)) })} /></div>)}</fieldset>
          <fieldset className="whs-action-form"><legend>Consequence names</legend>{m.consequence.map((x, i) => <div key={i} className="field"><label htmlFor={`mxc-${i}`}>{i + 1}</label><input id={`mxc-${i}`} className="input" value={x.label} onChange={(e) => setM({ ...m, consequence: m.consequence.map((y, k) => (k === i ? { ...y, label: e.target.value } : y)) })} /></div>)}</fieldset>
        </div>
        <fieldset className="whs-action-form">
          <legend>Risk levels, lowest first</legend>
          {m.levels.map((x, i) => (
            <div key={x.key} className="form-grid">
              <div className="field"><label htmlFor={`mxv-${i}`}>Name</label><input id={`mxv-${i}`} className="input" value={x.label} onChange={(e) => setM({ ...m, levels: m.levels.map((y, k) => (k === i ? { ...y, label: e.target.value } : y)) })} /></div>
              <div className="field"><label htmlFor={`mxa-${i}`}>What to do</label><input id={`mxa-${i}`} className="input" value={x.action} onChange={(e) => setM({ ...m, levels: m.levels.map((y, k) => (k === i ? { ...y, action: e.target.value } : y)) })} /></div>
            </div>
          ))}
          <div className="field"><label htmlFor="mx-high">High risks start at</label><select id="mx-high" className="select" value={m.highFrom} onChange={(e) => setM({ ...m, highFrom: Number(e.target.value) })}>{m.levels.map((l) => <option key={l.key} value={l.rank}>{l.label}</option>)}</select></div>
        </fieldset>
        <p className="muted small">Select a cell to change its level.</p>
        <MatrixTable m={m} onCell={cycle} />
      </div>
    </Modal>
  );
}

function HoursSection({ companyId, me, view }: { companyId: string; me: WhsMe; view: SettingsView }) {
  const [site, setSite] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [hours, setHours] = useState('');
  const act = useWhsAct(companyId);
  const save = async () => {
    if (await act(() => put(whsPath(companyId, '/hours'), { entries: [{ siteId: site || null, month, hours: hours === '' ? null : Number(hours) }] }), hours === '' ? 'Removed' : 'Hours saved')) setHours('');
  };
  return (
    <Section title="Hours worked">
      <p className="muted small">BIZOMAT does not track hours worked. Enter them per site and month, and the dashboard works out lost-time and recordable injury frequency rates (per million hours) for any period whose every month has hours. Without them it shows counts only.</p>
      {view.can.manage ? (
        <div className="row wrap whs-hours-form">
          <div className="field"><label htmlFor="hr-site">Site</label><select id="hr-site" className="select" value={site} onChange={(e) => setSite(e.target.value)}><option value="">Whole company (not split by site)</option>{me.sites.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
          <div className="field"><label htmlFor="hr-month">Month</label><input id="hr-month" type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} /></div>
          <div className="field"><label htmlFor="hr-hours">Hours</label><input id="hr-hours" type="number" min={0} step={1} className="input" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Leave empty to remove" /></div>
          <button className="btn mt-field-end" disabled={!month} onClick={() => void save()}>Save</button>
        </div>
      ) : null}
      {view.hours.length ? (
        <table className="data-table responsive">
          <thead><tr><th>Month</th><th>Site</th><th className="num">Hours</th></tr></thead>
          <tbody>{view.hours.slice(0, 36).map((h) => <tr key={`${h.siteId}-${h.month}`}><td data-label="Month">{h.month}</td><td data-label="Site">{h.siteName ?? 'Whole company'}</td><td className="num" data-label="Hours">{h.hours.toLocaleString()}</td></tr>)}</tbody>
        </table>
      ) : <p className="muted small">No hours entered.</p>}
    </Section>
  );
}

