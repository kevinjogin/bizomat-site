// The console's CAD Automation panel (/erp/admin/cad; src/worker/cad/admin.ts; docs/cad/README.md, "Platform admin
// guide"): CAD Automation's health and usage by company from its last sync, the fair-use limits, the companies where
// CAD Automation works inside the ERP, and the migration report with its review list. The flags themselves are set in
// the Control Centre. Platform admins only, with two-factor sign-in; every change is in the audit log.
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiError, del, errorMessage, get, post, put } from '../../lib/api';
import { timeAgo } from '../../lib/format';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';

interface Limits { concurrent: number; commandSeconds: number; uploadMb: number; storageMb: number }
interface Account {
  cadAccountId: string;
  email: string;
  emailVerified: boolean;
  userId: string | null;
  userName: string | null;
  method: string | null;
  companyId: string | null;
  companyName: string | null;
  status: 'mapped' | 'review';
  reason: string | null;
  counts: { computers?: number; commands?: number; grants?: number; unassigned?: { computers?: number; commands?: number; grants?: number } };
  assignedAt: number | null;
  lastSeen: number | null;
}
interface Overview {
  connected: boolean;
  connectedReason: string | null;
  health: { at: number; contract?: number; worker: Record<string, string | number | boolean | null>; companies: { id: string; name: string; computers: number; online?: number; queued?: number; running?: number; failed24h?: number; done24h?: number; avgSeconds?: number; storageBytes?: number }[] } | null;
  sync?: { at: number; minutes: number; late: boolean; stale: boolean } | null;
  password?: { flag: boolean; accounts: number; linked: number; ready: boolean; retired: boolean };
  totals: { accounts: number; mapped: number; review: number; computers: number; commands: number; grants: number; unassignedComputers: number; unassignedCommands: number; unassignedGrants: number };
  accounts: Account[];
  limits: { defaults: Limits; builtIn: Limits; bounds: Record<keyof Limits, [number, number]>; companies: { companyId: string; name: string; limits: Limits }[] };
  enabled: { scope: string; scopeId: string; name: string | null }[];
}

const LIMIT_LABELS: [keyof Limits, string][] = [
  ['concurrent', 'Commands at the same time'],
  ['commandSeconds', 'Longest command (seconds)'],
  ['uploadMb', 'Largest file sent to SOLIDWORKS (MB)'],
  ['storageMb', 'Exports kept per company (MB)'],
];

export default function CadAdmin() {
  const q = useQuery({ queryKey: ['admin', 'cad'], queryFn: () => get<Overview>('/admin/platform/cad'), refetchInterval: 60_000 });
  const [assigning, setAssigning] = useState<Account | null>(null);
  const [limitsFor, setLimitsFor] = useState<{ companyId: string | null; name: string; limits: Limits } | null>(null);
  if (q.error) {
    // Two-factor sign-in first (the same rule and prompt as the Control Centre): a way to Security, not an error to retry.
    const code = q.error instanceof ApiError ? (q.error.details as { code?: string } | undefined)?.code : undefined;
    if (code === 'MFA_ENROLMENT_REQUIRED' || code === 'MFA_REQUIRED') {
      return (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Two-factor sign-in first</h2>
          <p>
            {code === 'MFA_ENROLMENT_REQUIRED'
              ? 'The CAD Automation panel changes fair-use limits and places people’s CAD work in companies, so it needs two-factor sign-in, like the Control Centre. Set it up once with an authenticator app; it takes about two minutes.'
              : 'Enter a code from your authenticator app to continue.'}
          </p>
          <div className="row"><Link className="btn primary" to="/admin/security">Go to Security</Link></div>
        </section>
      );
    }
    return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  }
  if (!q.data) return <Loading />;
  const v = q.data;
  const review = v.accounts.filter((a) => a.status === 'review');
  const pw = v.password;
  return (
    <div className="stack">
      {v.sync?.late ? (
        <section className="co-prompt" role="alert">
          <p>
            <strong>CAD Automation has not reported for {v.sync.minutes} minutes.</strong>{' '}
            {v.sync.stale
              ? 'Its last answer from the ERP is now too old, so it works by person: company limits, team views and the read-only refusal do not apply to new work until it reports again. Nothing moves between companies.'
              : 'After 15 minutes without an answer it works by person until it reports again. Check the cados app (fly-status in kevinjogin/bizomat-cad) and the ERP’s sync answer.'}
          </p>
        </section>
      ) : null}
      <section className="card card-pad stack">
        <h2 className="crm-subhead">CAD Automation in the ERP</h2>
        <p className="muted small">CAD Automation works inside the ERP only where the flag <code>cad_in_erp</code> is on (a company for a pilot, a rollout stage, or everyone), and its parts where their own flags are on. The old pages at bizomat.ai/cad open in the ERP only while <code>cad_redirect</code> is on. Set both in the <Link to="/admin/controls">Control Centre</Link>; switching them off puts everything back as it was.</p>
        <dl className="crm-props">
          <div className="crm-prop"><dt>Connection from the ERP</dt><dd>{v.connected ? 'Set' : `Not set: ${v.connectedReason ?? ''}`}</dd></div>
          <div className="crm-prop"><dt>Last report from CAD Automation</dt><dd>{v.health ? `${timeAgo(v.health.at)} (version ${String(v.health.worker.version ?? 'unknown')}, ${String(v.health.worker.computersOnline ?? 0)} computers online, scanner ${String(v.health.worker.scanner ?? 'unknown')})` : 'None yet'}</dd></div>
          <div className="crm-prop"><dt>On for</dt><dd>{v.enabled.length ? v.enabled.map((e) => (e.scope === 'company' ? e.name ?? e.scopeId : `${e.scope}${e.scopeId ? ` ${e.scopeId}` : ''}`)).join(', ') : 'Nobody yet'}</dd></div>
          <div className="crm-prop"><dt>Contract</dt><dd>{v.health ? (Number(v.health.contract ?? 1) >= 2 ? 'Version 2: read-only roles refused in the company, download permission and link downloads' : 'Version 1: CAD Automation does not know read-only roles or link downloads yet; it is told only the companies where people may work') : 'Not known yet'}</dd></div>
          {pw ? (
            <div className="crm-prop">
              <dt>Password sign-in</dt>
              <dd>
                {pw.retired
                  ? 'Retired: everyone signs in to CAD Automation with their BIZOMAT account.'
                  : pw.flag
                    ? `Not retired yet: the flag is on, but ${pw.accounts - pw.linked} of ${pw.accounts} CAD Automation accounts are not linked to a BIZOMAT account (place them in the review list below).`
                    : pw.ready
                      ? `In use. Ready to retire: all ${pw.accounts} CAD Automation accounts are linked to BIZOMAT accounts. Switch cad_password_retired on in the Control Centre.`
                      : `In use. ${pw.linked} of ${pw.accounts} CAD Automation accounts are linked to BIZOMAT accounts; it can be retired once all are.`}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Usage by company</h2>
        {!v.health?.companies.length ? <p className="muted">No company has CAD work recorded yet.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Company</th><th className="num">Computers</th><th className="num">Online</th><th className="num">Waiting</th><th className="num">Running</th><th className="num">Done, 24 h</th><th className="num">Failed, 24 h</th><th className="num">Average</th><th className="num">Exports</th></tr></thead>
              <tbody>
                {v.health.companies.map((c) => (
                  <tr key={c.id}>
                    <td data-label="Company">{c.name}</td>
                    <td data-label="Computers" className="num">{c.computers}</td>
                    <td data-label="Online" className="num">{c.online ?? 0}</td>
                    <td data-label="Waiting" className="num">{c.queued ?? 0}</td>
                    <td data-label="Running" className="num">{c.running ?? 0}</td>
                    <td data-label="Done" className="num">{c.done24h ?? 0}</td>
                    <td data-label="Failed" className="num">{c.failed24h ?? 0}</td>
                    <td data-label="Average" className="num">{c.avgSeconds ? `${c.avgSeconds} s` : ''}</td>
                    <td data-label="Exports" className="num">{c.storageBytes ? `${(c.storageBytes / 1024 / 1024).toFixed(1)} MB` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card card-pad stack">
        <div className="row wrap">
          <h2 className="crm-subhead grow">Fair-use limits</h2>
          <button className="btn sm" onClick={() => setLimitsFor({ companyId: null, name: 'Every company', limits: v.limits.defaults })}>Change the defaults</button>
        </div>
        <p className="muted small">CAD Automation is free; these limits keep it fast for everyone. A company’s own limits replace the defaults for it.</p>
        <table className="data-table responsive">
          <thead><tr><th>For</th>{LIMIT_LABELS.map(([k, l]) => <th key={k} className="num">{l}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            <tr><td data-label="For"><strong>Every company</strong></td>{LIMIT_LABELS.map(([k]) => <td key={k} className="num">{v.limits.defaults[k]}</td>)}<td /></tr>
            {v.limits.companies.map((c) => (
              <tr key={c.companyId}>
                <td data-label="For">{c.name}</td>
                {LIMIT_LABELS.map(([k]) => <td key={k} className="num">{c.limits[k]}</td>)}
                <td className="erp-actions"><button className="btn ghost sm" onClick={() => setLimitsFor({ companyId: c.companyId, name: c.name, limits: c.limits })}>Change</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <CompanyLimitForm onPick={(companyId, name) => setLimitsFor({ companyId, name, limits: v.limits.defaults })} />
      </section>

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Migration report</h2>
        <p className="muted small">Every CAD Automation account, matched to a BIZOMAT account by its BIZOMAT id or an email both sides confirmed, and placed in a company: the person’s only registered company, else their own company. Earlier computers, commands and AI connections move there at CAD Automation’s next sync, once CAD Automation works in the ERP for that company. Nothing is deleted.</p>
        <dl className="crm-props">
          <div className="crm-prop"><dt>Accounts</dt><dd>{v.totals.accounts} ({v.totals.mapped} placed, {v.totals.review} to review)</dd></div>
          <div className="crm-prop"><dt>Computers</dt><dd>{v.totals.computers} ({v.totals.unassignedComputers} not in a company yet)</dd></div>
          <div className="crm-prop"><dt>Commands</dt><dd>{v.totals.commands} ({v.totals.unassignedCommands} not in a company yet)</dd></div>
          <div className="crm-prop"><dt>AI connections</dt><dd>{v.totals.grants} ({v.totals.unassignedGrants} not in a company yet)</dd></div>
        </dl>
        <h3 className="crm-subhead">To review</h3>
        {!review.length ? <p className="muted">Nothing to review.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>CAD account</th><th>Why</th><th className="num">Computers</th><th className="num">Commands</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {review.map((a) => (
                  <tr key={a.cadAccountId}>
                    <td data-label="CAD account">{a.email}{a.emailVerified ? '' : <span className="muted small"> (email not confirmed)</span>}{a.userName ? <div className="muted small">{a.userName}</div> : null}</td>
                    <td data-label="Why" className="small">{a.reason}</td>
                    <td data-label="Computers" className="num">{a.counts.computers ?? 0}</td>
                    <td data-label="Commands" className="num">{a.counts.commands ?? 0}</td>
                    <td className="erp-actions"><button className="btn sm" onClick={() => setAssigning(a)}>Place</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {assigning ? <AssignDialog account={assigning} onClose={() => setAssigning(null)} onDone={() => void q.refetch()} /> : null}
      {limitsFor ? <LimitsDialog target={limitsFor} bounds={v.limits.bounds} onClose={() => setLimitsFor(null)} onDone={() => void q.refetch()} /> : null}
    </div>
  );
}

function CompanyLimitForm({ onPick }: { onPick: (companyId: string, name: string) => void }) {
  const [id, setId] = useState('');
  return (
    <form className="row wrap" onSubmit={(e) => { e.preventDefault(); if (id.trim()) onPick(id.trim(), id.trim()); }}>
      <div className="field grow"><label htmlFor="cad-limit-co">Give a company its own limits (company id)</label><input id="cad-limit-co" className="input mono" value={id} onChange={(e) => setId(e.target.value)} maxLength={64} /></div>
      <button className="btn" type="submit" disabled={!id.trim()}>Set its limits</button>
    </form>
  );
}

function LimitsDialog({ target, bounds, onClose, onDone }: { target: { companyId: string | null; name: string; limits: Limits }; bounds: Record<keyof Limits, [number, number]>; onClose: () => void; onDone: () => void }) {
  const [vals, setVals] = useState<Record<keyof Limits, string>>({ concurrent: String(target.limits.concurrent), commandSeconds: String(target.limits.commandSeconds), uploadMb: String(target.limits.uploadMb), storageMb: String(target.limits.storageMb) });
  const toast = useToast();
  const path = target.companyId ? `/admin/platform/cad/limits/${encodeURIComponent(target.companyId)}` : '/admin/platform/cad/limits';
  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await put(path, Object.fromEntries(LIMIT_LABELS.map(([k]) => [k, Math.round(Number(vals[k]))])));
      toast('Limits saved');
      onDone();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const clear = async () => {
    try {
      await del(path);
      toast('Back to the defaults');
      onDone();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Modal title={`Limits: ${target.name}`} onClose={onClose} footer={<div className="row">{target.companyId ? <button className="btn ghost" onClick={() => void clear()}>Use the defaults</button> : null}<button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn primary" form="cad-limits" type="submit">Save</button></div>}>
      <form id="cad-limits" className="stack" onSubmit={save}>
        {LIMIT_LABELS.map(([k, label]) => (
          <div key={k} className="field">
            <label htmlFor={`cad-l-${k}`}>{label}</label>
            <input id={`cad-l-${k}`} className="input" type="number" min={bounds[k][0]} max={bounds[k][1]} step={1} value={vals[k]} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} required />
            <span className="muted small">From {bounds[k][0]} to {bounds[k][1]}.</span>
          </div>
        ))}
      </form>
    </Modal>
  );
}

function AssignDialog({ account, onClose, onDone }: { account: Account; onClose: () => void; onDone: () => void }) {
  const [email, setEmail] = useState(account.emailVerified ? account.email : '');
  const [companyId, setCompanyId] = useState('');
  const [reason, setReason] = useState('');
  const toast = useToast();
  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await post(`/admin/platform/cad/accounts/${encodeURIComponent(account.cadAccountId)}/assign`, { email: email.trim(), companyId: companyId.trim(), reason: reason.trim() });
      toast('Placed. Its CAD work moves at the next sync.');
      onDone();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Modal title={`Place ${account.email}`} onClose={onClose} footer={<div className="row"><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn primary" form="cad-assign" type="submit">Place</button></div>}>
      <form id="cad-assign" className="stack" onSubmit={save}>
        <p className="muted small">Choose the BIZOMAT account this CAD Automation account belongs to, and the company its earlier work goes into. The person must be an active member of that company. Check with the person first.</p>
        <div className="field"><label htmlFor="cad-a-email">BIZOMAT account email</label><input id="cad-a-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} /></div>
        <div className="field"><label htmlFor="cad-a-co">Company id</label><input id="cad-a-co" className="input mono" value={companyId} onChange={(e) => setCompanyId(e.target.value)} required maxLength={64} /></div>
        <div className="field"><label htmlFor="cad-a-why">Reason (kept in the audit log)</label><textarea id="cad-a-why" className="input" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={500} /></div>
      </form>
    </Modal>
  );
}
