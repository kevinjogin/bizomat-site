// The Admin Control Centre (Stage 1, R2): feature flags, the kill switch and rollout stages. Every flag ships off; a
// platform admin switches one on for a scope, with a reason. High and highest risk flags are the founder's, need the
// flag's key typed and a re-authentication. Everything is enforced on the server; this page only reads and asks.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post, put } from '../../lib/api';
import { Field } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { useAdmin } from '../api';
// The console's styles: these pages also open inside the ERP console (src/client/system/SystemApp.tsx).
import '../../styles/admin-console.css';
import { Card, Empty, PageIntro, TableWrap, When } from '../ui';
import { codeOf, useReauth } from '../reauth';
import '../../styles/billing.css';

type Scope = 'global' | 'stage' | 'country' | 'company';
interface Flag {
  key: string;
  label: string;
  description: string;
  values: string[];
  scopes: Scope[];
  risk: 'low' | 'medium' | 'high' | 'highest';
  enforcement: boolean;
  release: string;
  managedBy?: string;
  default: string;
  global: string;
  needsConfirmation: boolean;
  overrides: { scope: Scope; scopeId: string; value: string; reason: string; by: string | null; at: number }[];
}
interface FlagsResp {
  flags: Flag[];
  billingLocked: boolean;
  role: 'founder' | 'admin';
}
interface HistoryRow {
  id: string;
  scope: string;
  scope_id: string;
  old_value: string | null;
  new_value: string | null;
  reason: string;
  kind: string;
  created_at: number;
  actor: string | null;
}

const SCOPE_LABEL: Record<Scope, string> = { global: 'Everyone', stage: 'Rollout stage', country: 'Country', company: 'Company' };
const scopeText = (s: Scope, id: string) => (s === 'global' ? 'Everyone' : `${SCOPE_LABEL[s]}: ${id}`);
const GROUPS: { title: string; test: (f: Flag) => boolean }[] = [
  { title: 'Company registration and verification', test: (f) => ['company_registration_required', 'registry_verification_enabled', 'verification_enforcement', 'scheduled_reverification'].includes(f.key) },
  { title: 'Existing users, compliance and deletion', test: (f) => ['migration_notifications', 'compliance_countdown', 'auto_suspension', 'legal_review_completed', 'auto_deletion', 'individual_accounts_policy'].includes(f.key) },
  { title: 'Billing', test: (f) => f.key === 'billing_mode' },
  { title: 'Modules', test: (f) => f.key.startsWith('module_') },
];

function FlagCard({ f, founder, onChanged, run }: { f: Flag; founder: boolean; onChanged: () => void; run: <T>(fn: () => Promise<T>) => Promise<T> }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryRow[] | null>(null);
  const [form, setForm] = useState({ scope: f.scopes[0], scopeId: '', value: f.values.find((v) => v !== f.default) ?? f.values[0], reason: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const locked = f.needsConfirmation && !founder;
  const act = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await run(fn);
      toast(done);
      setHistory(null);
      onChanged();
    } catch (e) {
      if (errorMessage(e) !== 'Cancelled') toast(codeOf(e) === 'CONFIRMATION_REQUIRED' ? `Type ${f.key} to confirm.` : errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void act(() => put(`/admin/platform/flags/${f.key}`, { scope: form.scope, scopeId: form.scope === 'global' ? '' : form.scopeId.trim(), value: form.value, reason: form.reason, confirm: form.confirm || undefined }), `${f.label}: saved`);
  };
  const reset = (o: Flag['overrides'][number]) => {
    const reason = prompt(`Why remove "${o.value}" for ${scopeText(o.scope, o.scopeId)}?`);
    if (!reason) return;
    const confirm = f.needsConfirmation ? prompt(`Type ${f.key} to confirm`) ?? '' : undefined;
    void act(() => post(`/admin/platform/flags/${f.key}/reset`, { scope: o.scope, scopeId: o.scopeId, reason, confirm }), `${f.label}: removed`);
  };
  const showHistory = async () => {
    if (history) return setHistory(null);
    try {
      setHistory((await get<{ history: HistoryRow[] }>(`/admin/platform/flags/${f.key}/history`)).history);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  return (
    <section className="ac-card">
      <header className="ac-card-head">
        <div className="grow">
          <h3>{f.label}</h3>
          <p className="muted small">{f.description}</p>
        </div>
        <span className={`ac-tag${f.risk === 'high' || f.risk === 'highest' ? ' ac-bad' : ''}`}>Risk: {f.risk}</span>
      </header>
      <p className="small">
        Everyone: <strong>{f.global}</strong> (default {f.default}) · acts from {f.release}
        {f.enforcement ? ' · turned off by the kill switch' : ''}
      </p>
      {f.overrides.length ? (
        <TableWrap label={`${f.label}: values set`}>
          <thead><tr><th>For</th><th>Value</th><th>Why</th><th>By</th><th>When</th><th /></tr></thead>
          <tbody>
            {f.overrides.map((o) => (
              <tr key={`${o.scope}:${o.scopeId}`}>
                <td>{scopeText(o.scope, o.scopeId)}</td>
                <td><strong>{o.value}</strong></td>
                <td>{o.reason}</td>
                <td>{o.by ?? 'unknown'}</td>
                <td><When ts={o.at} /></td>
                <td>{!f.managedBy && !locked ? <button className="btn sm ghost" disabled={busy} onClick={() => reset(o)}>Remove</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : null}
      <div className="row">
        {f.managedBy ? <span className="muted small">Set by {f.managedBy}.</span> : locked ? <span className="muted small">Only the founder changes this flag.</span> : <button className="btn sm" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Change'}</button>}
        <button className="btn sm ghost" onClick={() => void showHistory()}>{history ? 'Hide history' : 'History'}</button>
      </div>
      {open && !f.managedBy && !locked ? (
        <form className="ac-form ac-stack" onSubmit={submit}>
          <div className="ac-grid-2">
            <Field label="For" htmlFor={`${f.key}-scope`}>
              <select id={`${f.key}-scope`} className="select" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as Scope })}>
                {f.scopes.map((s) => <option key={s} value={s}>{SCOPE_LABEL[s]}</option>)}
              </select>
            </Field>
            {form.scope !== 'global' ? (
              <Field label={form.scope === 'stage' ? 'Stage (internal or pilot)' : form.scope === 'country' ? 'Country code (AU, GB...)' : 'Company id'} htmlFor={`${f.key}-id`}>
                <input id={`${f.key}-id`} className="input" value={form.scopeId} onChange={(e) => setForm({ ...form, scopeId: e.target.value })} required />
              </Field>
            ) : null}
            <Field label="Value" htmlFor={`${f.key}-value`}>
              <select id={`${f.key}-value`} className="select" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}>
                {f.values.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Why (kept in the history)" htmlFor={`${f.key}-reason`}>
            <textarea id={`${f.key}-reason`} className="input ac-textarea" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} minLength={3} required />
          </Field>
          {f.needsConfirmation ? (
            <Field label={`Type ${f.key} to confirm`} htmlFor={`${f.key}-confirm`} hint="A high-risk change also asks for your password and a code.">
              <input id={`${f.key}-confirm`} className="input" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
            </Field>
          ) : null}
          <div className="row"><button className="btn primary" type="submit" disabled={busy}>Save</button></div>
        </form>
      ) : null}
      {history ? (
        history.length ? (
          <TableWrap label={`${f.label}: history`}>
            <thead><tr><th>When</th><th>For</th><th>From</th><th>To</th><th>Why</th><th>By</th></tr></thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td><When ts={h.created_at} /></td>
                  <td>{scopeText(h.scope as Scope, h.scope_id)}</td>
                  <td>{h.old_value ?? 'default'}</td>
                  <td>{h.new_value ?? (h.kind === 'kill_switch' ? 'default (kill switch)' : 'default')}</td>
                  <td>{h.reason}</td>
                  <td>{h.actor ?? 'unknown'}</td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : <Empty>No changes yet.</Empty>
      ) : null}
    </section>
  );
}

interface Integrity {
  checkedAt: number;
  registry: { missing: number; mismatched: number; orphaned: number };
  toolsOfDeletedCompanies: number;
  tablesChecked: number;
  unknownCompany: Record<string, number>;
  skipped: string[];
}

interface SupportGrant { id: string; company_id: string; company: string | null; reason: string; starts_at: number; ends_at: number; revoked_at: number | null; admin: string | null }

/** Support access (R5): time-limited, with a reason, logged in the company's own activity and visible to its owner. */
function SupportCard() {
  const toast = useToast();
  const qc = useQueryClient();
  const q = useAdmin<{ grants: SupportGrant[]; maxHours: number }>('/platform/support', { retry: false });
  const [f, setF] = useState({ companyId: '', reason: '', hours: '4' });
  const [view, setView] = useState<{ company: Record<string, unknown> | null; people: { name: string; email: string; role: string; disabled: number }[]; tools: Record<string, string> } | null>(null);
  const open = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/platform/support/${encodeURIComponent(f.companyId.trim())}`, { reason: f.reason, hours: Number(f.hours) })
      .then(() => { toast('Support access opened. The company sees it.'); setF({ companyId: '', reason: '', hours: '4' }); void qc.invalidateQueries({ queryKey: ['admin'] }); })
      .catch((err) => toast(errorMessage(err), 'error'));
  };
  const look = (companyId: string) => get<typeof view>(`/admin/platform/support/${encodeURIComponent(companyId)}/view`).then(setView).catch((err) => toast(errorMessage(err), 'error'));
  const end = (companyId: string, id: string) => post(`/admin/platform/support/${encodeURIComponent(companyId)}/grants/${id}/end`, {}).then(() => { toast('Support access ended'); void qc.invalidateQueries({ queryKey: ['admin'] }); }).catch((err) => toast(errorMessage(err), 'error'));
  const t = Date.now();
  return (
    <Card title="Support access" subtitle="Look at one registered company's people, tools and registration, for a few hours, with a reason. The company's owner and administrators see each time and can end it. Never sign in as anyone.">
      {q.data?.grants.length ? (
        <TableWrap label="Support access">
          <thead><tr><th>Company</th><th>Why</th><th>By</th><th>Until</th><th /></tr></thead>
          <tbody>
            {q.data.grants.map((g) => {
              const active = !g.revoked_at && g.ends_at > t;
              return (
                <tr key={g.id}>
                  <td>{g.company ?? g.company_id}</td><td>{g.reason}</td><td>{g.admin ?? 'unknown'}</td><td>{active ? <When ts={g.ends_at} /> : 'Ended'}</td>
                  <td>{active ? <div className="row"><button className="btn sm" type="button" onClick={() => look(g.company_id)}>View</button><button className="btn sm" type="button" onClick={() => end(g.company_id, g.id)}>End</button></div> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      ) : <Empty>No support access in the last 30 days.</Empty>}
      <form className="ac-form ac-stack" onSubmit={open}>
        <div className="ac-grid-2">
          <Field label="Company id" htmlFor="support-company"><input id="support-company" className="input" value={f.companyId} onChange={(e) => setF({ ...f, companyId: e.target.value })} required /></Field>
          <Field label="For how long" htmlFor="support-hours">
            <select id="support-hours" className="select" value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })}>
              {[1, 4, 24, 72].map((h) => <option key={h} value={String(h)}>{h === 1 ? '1 hour' : `${h} hours`}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Why (the company sees this)" htmlFor="support-reason"><input id="support-reason" className="input" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} minLength={3} maxLength={500} required /></Field>
        <div className="row"><button className="btn" type="submit">Open support access</button></div>
      </form>
      {view ? (
        <div className="ac-stack">
          <p className="small"><strong>{String(view.company?.name ?? '')}</strong> · registration {String(view.company?.registration_status ?? 'unknown')} · tools: {Object.keys(view.tools).join(', ') || 'none'}</p>
          <TableWrap label="People">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>{view.people.map((p) => <tr key={p.email}><td>{p.name}{p.disabled ? ' (disabled)' : ''}</td><td>{p.email}</td><td>{p.role}</td></tr>)}</tbody>
          </TableWrap>
        </div>
      ) : null}
    </Card>
  );
}

/** The integrity check (R4): counts only, read only, run on request. */
function IntegrityCard() {
  const toast = useToast();
  const [report, setReport] = useState<Integrity | null>(null);
  const [busy, setBusy] = useState(false);
  const check = () => {
    setBusy(true);
    get<Integrity>('/admin/platform/integrity')
      .then(setReport)
      .catch((err) => toast(errorMessage(err), 'error'))
      .finally(() => setBusy(false));
  };
  const unknown = report ? Object.entries(report.unknownCompany) : [];
  const drift = report ? report.registry.missing + report.registry.mismatched + report.registry.orphaned : 0;
  return (
    <Card title="Integrity check" subtitle="Records that point at a company that does not exist, tools of deleted companies, and the company registry against each company's own table. Counts only.">
      <div className="row"><button className="btn" type="button" onClick={check} disabled={busy}>{busy ? 'Checking' : 'Run the check'}</button></div>
      {report ? (
        <div className="ac-stack">
          <p className="small">
            {report.tablesChecked} tables checked <When ts={report.checkedAt} />.{' '}
            {drift === 0 && unknown.length === 0 && report.toolsOfDeletedCompanies === 0 ? 'Nothing out of place.' : 'Some records need a look.'}
          </p>
          <p className="small">
            Company registry: {report.registry.missing} missing, {report.registry.mismatched} out of step, {report.registry.orphaned} without their company (the 15-minute run repairs these).
            Tools still linked to a deleted company: {report.toolsOfDeletedCompanies}.
          </p>
          {unknown.length ? (
            <TableWrap label="Records whose company does not exist">
              <thead><tr><th>Table</th><th>Records</th></tr></thead>
              <tbody>{unknown.map(([t, n]) => <tr key={t}><td><code>{t}</code></td><td>{n}</td></tr>)}</tbody>
            </TableWrap>
          ) : null}
          {report.skipped.length ? <p className="muted small">Not read: {report.skipped.join(', ')}</p> : null}
        </div>
      ) : null}
    </Card>
  );
}

export default function Controls() {
  const q = useAdmin<FlagsResp>('/platform/flags', { retry: false });
  const rollout = useAdmin<{ companies: { company_id: string; company: string | null; stage: string; reason: string; updated_at: number; updated_by: string | null }[] }>('/platform/rollout', { retry: false });
  const qc = useQueryClient();
  const toast = useToast();
  const { run, dialog } = useReauth();
  const [kill, setKill] = useState({ reason: '', confirm: '' });
  const [stage, setStage] = useState({ companyId: '', stage: 'pilot', reason: '' });
  const refresh = () => void qc.invalidateQueries({ queryKey: ['admin'] });

  if (q.error) {
    const c = codeOf(q.error);
    if (c === 'MFA_ENROLMENT_REQUIRED' || c === 'MFA_REQUIRED') {
      return (
        <div className="ac-stack">
          <Card title="Two-factor sign-in first">
            <p>The Control Centre changes how BIZOMAT behaves for every company, so it needs two-factor sign-in.</p>
            <div className="row"><Link className="btn primary" to="/admin/security">Go to Security</Link></div>
          </Card>
        </div>
      );
    }
    return <Card title="Control Centre"><p className="muted">{q.error instanceof ApiError ? q.error.message : errorMessage(q.error)}</p></Card>;
  }
  if (!q.data) return <div className="ac-boot"><span className="spinner" aria-label="Loading" /></div>;
  const d = q.data;
  const founder = d.role === 'founder';

  const pullKill = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => post<{ cleared: number }>('/admin/platform/kill-switch', kill))
      .then((r) => { toast(`Kill switch: ${r.cleared} values removed; every enforcement flag is back to its default`); setKill({ reason: '', confirm: '' }); refresh(); })
      .catch((err) => { if (errorMessage(err) !== 'Cancelled') toast(errorMessage(err), 'error'); });
  };
  const saveStage = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => put(`/admin/platform/rollout/${encodeURIComponent(stage.companyId.trim())}`, { stage: stage.stage === 'all' ? null : stage.stage, reason: stage.reason }))
      .then(() => { toast('Rollout stage saved'); setStage({ companyId: '', stage: 'pilot', reason: '' }); refresh(); })
      .catch((err) => { if (errorMessage(err) !== 'Cancelled') toast(errorMessage(err), 'error'); });
  };

  return (
    <div className="ac-stack">
      {dialog}
      <PageIntro>
        <p className="muted">
          Every Stage 1 capability ships switched off. Switch one on for everyone, a rollout stage, a country or one company, with a reason; the server
          enforces it and keeps every change in the history. A flag whose release is not built yet is stored and does nothing until then.
        </p>
      </PageIntro>
      {d.billingLocked ? <p className="billing-banner info">Billing is locked on the server (BIZOMAT_BILLING_LOCK): BIZOMAT is free, and the billing mode cannot be set to paid.</p> : null}
      {GROUPS.map((g) => (
        <div key={g.title} className="ac-stack">
          <h2 className="ac-h2">{g.title}</h2>
          {d.flags.filter(g.test).map((f) => <FlagCard key={f.key} f={f} founder={founder} onChanged={refresh} run={run} />)}
        </div>
      ))}
      <IntegrityCard />
      <SupportCard />
      <Card title="Kill switch" subtitle="Every enforcement flag back to its default (off, free, personal workspaces allowed), for everyone, at once.">
        <form className="ac-form ac-stack" onSubmit={pullKill}>
          <Field label="Why" htmlFor="kill-reason">
            <textarea id="kill-reason" className="input ac-textarea" value={kill.reason} onChange={(e) => setKill({ ...kill, reason: e.target.value })} minLength={3} required />
          </Field>
          <Field label="Type KILL SWITCH to confirm" htmlFor="kill-confirm">
            <input id="kill-confirm" className="input" value={kill.confirm} onChange={(e) => setKill({ ...kill, confirm: e.target.value })} required />
          </Field>
          <div className="row"><button className="btn danger" type="submit">Turn enforcement off everywhere</button></div>
        </form>
      </Card>
      <Card title="Rollout stages" subtitle="Internal test companies, then pilot companies, then everyone. A flag set for a stage applies to its companies.">
        {rollout.data?.companies.length ? (
          <TableWrap label="Companies in a rollout stage">
            <thead><tr><th>Company</th><th>Stage</th><th>Why</th><th>By</th><th>When</th></tr></thead>
            <tbody>
              {rollout.data.companies.map((r) => (
                <tr key={r.company_id}><td>{r.company ?? r.company_id}</td><td>{r.stage}</td><td>{r.reason}</td><td>{r.updated_by ?? 'unknown'}</td><td><When ts={r.updated_at} /></td></tr>
              ))}
            </tbody>
          </TableWrap>
        ) : <Empty>Every company is in the general stage.</Empty>}
        {founder ? (
          <form className="ac-form ac-stack" onSubmit={saveStage}>
            <div className="ac-grid-2">
              <Field label="Company id" htmlFor="stage-company"><input id="stage-company" className="input" value={stage.companyId} onChange={(e) => setStage({ ...stage, companyId: e.target.value })} required /></Field>
              <Field label="Stage" htmlFor="stage-stage">
                <select id="stage-stage" className="select" value={stage.stage} onChange={(e) => setStage({ ...stage, stage: e.target.value })}>
                  <option value="internal">Internal test</option>
                  <option value="pilot">Pilot</option>
                  <option value="all">Everyone (general)</option>
                </select>
              </Field>
            </div>
            <Field label="Why" htmlFor="stage-reason"><input id="stage-reason" className="input" value={stage.reason} onChange={(e) => setStage({ ...stage, reason: e.target.value })} minLength={3} required /></Field>
            <div className="row"><button className="btn" type="submit">Save stage</button></div>
          </form>
        ) : <p className="muted small">Only the founder changes rollout stages.</p>}
      </Card>
    </div>
  );
}
