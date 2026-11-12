// Organisation administration added on 12 Nov 2026: finance settings (currency, who sees finances, and the review of
// existing amount columns), email delivery (Brevo status, delays, failures, a test to yourself) and the permanent
// audit trail.

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FINANCE_ROLE_LABELS, type FinanceRole } from '../../../shared/columns';
import type { CurrencyInfo } from '../../../shared/money';
import { errorMessage, get, post, put } from '../../lib/api';
import { timeAgo } from '../../lib/format';
import { useWorkspace } from '../../lib/session';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Field, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { appUrl } from '../../lib/base';
import '../../styles/platform.css';

interface FinanceCol {
  id: string;
  boardId: string;
  boardName: string;
  title: string;
  type: string;
  financial: boolean;
  financeRole: FinanceRole | null;
  storedCurrency: string | null;
  currencyMode: 'inherit' | 'fixed';
  currency: string | null;
  currencySource: 'column' | 'project' | 'organisation' | 'unset';
  confirmed: boolean;
  valueCount: number;
}

interface FinanceSettingsDTO {
  defaultCurrency: string | null;
  visibility: 'all' | 'editors' | 'managers';
  enabledFields: string[];
  currencies: CurrencyInfo[];
  roles: { id: FinanceRole; label: string }[];
  columns?: FinanceCol[];
}

export function FinanceSettings() {
  const ws = useWorkspace();
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['finance-settings', ws.id], queryFn: () => get<FinanceSettingsDTO>(`/workspaces/${ws.id}/finance`) });
  const [currency, setCurrency] = useState<string | null | undefined>(undefined);
  const [visibility, setVisibility] = useState<string | undefined>(undefined);
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const d = q.data!;
  const cur = currency === undefined ? d.defaultCurrency ?? '' : currency ?? '';
  const vis = visibility ?? d.visibility;
  const refresh = () => {
    q.refetch();
    qc.invalidateQueries({ queryKey: ['board'] });
  };
  const save = async () => {
    try {
      await put(`/workspaces/${ws.id}/finance`, { defaultCurrency: cur || null, visibility: vis });
      toast('Finance settings saved');
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const colAction = async (c: FinanceCol, body: Record<string, unknown>, msg: string) => {
    try {
      await post(`/workspaces/${ws.id}/finance/columns/${c.id}`, body);
      toast(msg);
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const review = (d.columns ?? []).filter((c) => (c.type === 'currency' && c.currencySource === 'column' && !c.confirmed) || (c.type === 'number' && !c.financial));
  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="card card-pad">
        <h2 style={{ marginBottom: 6 }}>Currency</h2>
        <p className="muted small" style={{ marginBottom: 12 }}>
          The organisation's default currency for amounts on its projects. A project can use its own (board settings, Project details). Choosing a currency states what the stored numbers mean; it never changes them, and amounts in different currencies are never added together.
        </p>
        <div className="row wrap" style={{ alignItems: 'flex-end' }}>
          <Field label="Default currency" htmlFor="fin-cur">
            <select id="fin-cur" className="select" value={cur} onChange={(e) => setCurrency(e.target.value || null)}>
              <option value="">Not set</option>
              {d.currencies.map((c) => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
            </select>
          </Field>
          <Field label="Who sees financial data by default" htmlFor="fin-vis">
            <select id="fin-vis" className="select" value={vis} onChange={(e) => setVisibility(e.target.value)}>
              <option value="all">Everyone with access to the project</option>
              <option value="editors">People who can edit the project</option>
              <option value="managers">Project managers and administrators only</option>
            </select>
          </Field>
          <div className="field"><button className="btn primary" onClick={save}>Save</button></div>
        </div>
        <p className="muted small">Exceptions for one person are set on each project (board settings, Permissions: View or Edit financial data).</p>
      </section>

      <section className="card">
        <div className="card-header"><h2 className="grow">Review existing amount columns</h2><span className="badge">{review.length}</span></div>
        <div className="card-pad">
          <p className="muted small" style={{ marginBottom: 10 }}>
            Columns made before currency settings existed keep the code they were created with (often USD, the old default), and number columns such as "Finance" are not yet marked as money. Nothing is assumed: decide for each column. The amounts themselves are never changed.
          </p>
          {!review.length ? <EmptyState icon="check" title="Nothing to review">Every amount column has a confirmed currency.</EmptyState> : (
            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Project</th><th>Column</th><th>Now</th><th>Values</th><th>Decide</th></tr></thead>
                <tbody>
                  {review.map((c) => (
                    <tr key={c.id}>
                      <td>{c.boardName}</td>
                      <td><strong>{c.title}</strong> <span className="muted small">({c.type})</span></td>
                      <td className="small">{c.type === 'currency' ? `Stored code ${c.storedCurrency ?? 'none'}, not confirmed` : 'Plain number, not marked as money'}</td>
                      <td>{c.valueCount}</td>
                      <td>
                        <div className="row wrap" style={{ gap: 4 }}>
                          {c.type === 'currency' ? (
                            <>
                              <button className="btn sm" onClick={() => colAction(c, { action: 'confirm' }, `${c.title}: ${c.storedCurrency} confirmed`)}>Keep {c.storedCurrency}</button>
                              <button className="btn sm" onClick={() => colAction(c, { action: 'inherit' }, `${c.title} now follows the project's or organisation's currency`)}>Use project or organisation currency{d.defaultCurrency ? ` (${d.defaultCurrency})` : ''}</button>
                              <select className="select sm" defaultValue="" aria-label={`Set a currency for ${c.title}`} onChange={(e) => e.target.value && colAction(c, { action: 'set', currency: e.target.value }, `${c.title}: ${e.target.value}`)}>
                                <option value="">Other…</option>
                                {d.currencies.map((x) => <option key={x.code} value={x.code}>{x.code}</option>)}
                              </select>
                            </>
                          ) : (
                            <button className="btn sm" onClick={() => colAction(c, { action: 'mark_financial' }, `${c.title} is now treated as money`)}>Mark as money</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <div className="card-header"><h2 className="grow">Amount columns and their finance roles</h2></div>
        <div className="card-pad">
          <p className="muted small" style={{ marginBottom: 10 }}>A finance role tells summaries and reports what the amounts are, so they can show remaining budget (approved - actual - committed), variance (approved - actual) and utilisation.</p>
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Project</th><th>Column</th><th>Currency</th><th>Finance role</th></tr></thead>
              <tbody>
                {(d.columns ?? []).filter((c) => c.financial).map((c) => (
                  <tr key={c.id}>
                    <td>{c.boardName}</td>
                    <td>{c.title}</td>
                    <td className="small">{c.currency ?? 'Not set'} <span className="muted">({c.currencySource === 'column' ? 'column' : c.currencySource === 'project' ? 'project' : c.currencySource === 'organisation' ? 'organisation' : 'none'})</span>{c.currencySource === 'column' && !c.confirmed ? <span className="badge warning" style={{ marginLeft: 4 }}>Unconfirmed</span> : null}</td>
                    <td>
                      <select className="select sm" value={c.financeRole ?? ''} aria-label={`Finance role of ${c.title}`} onChange={(e) => colAction(c, { action: 'role', financeRole: e.target.value || null }, 'Finance role saved')}>
                        <option value="">Not set</option>
                        {(Object.keys(FINANCE_ROLE_LABELS) as FinanceRole[]).map((r) => <option key={r} value={r}>{FINANCE_ROLE_LABELS[r]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

interface EmailStatus {
  provider: string;
  configured: boolean;
  developmentMode: boolean;
  sender: { email: string; name: string };
  replyTo: string | null;
  sandbox: boolean;
  webhookConfigured: boolean;
  senderVerification: string;
  dailyLimit: number;
  criticalReserve: number;
  sentToday: number;
  remainingToday: number;
  counts: Record<string, number>;
  delayed: number;
  recent: { id: string; to_email: string; template: string; subject: string; status: string; attempts: number; last_error: string | null; last_event: string | null; created_at: number; sent_at: number | null; next_attempt_at: number }[];
  suppressed: { email: string; reason: string; created_at: number }[];
}

const STATUS_TONE: Record<string, string> = { sent: 'ok', delivered: 'ok', queued: 'warn', deferred: 'warn', sending: 'warn', failed: 'bad', bounced: 'bad', blocked: 'bad', suppressed: 'bad', skipped: '' };

export function EmailSettings() {
  const ws = useWorkspace();
  const toast = useToast();
  const q = useQuery({ queryKey: ['email-status', ws.id], queryFn: () => get<EmailStatus>(`/workspaces/${ws.id}/email`) });
  const [testing, setTesting] = useState(false);
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const s = q.data!;
  const test = async () => {
    setTesting(true);
    try {
      const r = await post<{ ok: boolean; status?: string; error?: string | null; reason?: string }>(`/workspaces/${ws.id}/email/test`, {});
      toast(r.ok ? 'Test email accepted by the provider. Check your inbox (delivery itself is reported by Brevo).' : `Test email not sent: ${r.error ?? r.reason ?? r.status}`, r.ok ? 'info' : 'error');
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setTesting(false);
    }
  };
  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="card card-pad">
        <h2 style={{ marginBottom: 8 }}>Email delivery</h2>
        <table className="data-table">
          <tbody>
            <tr><td style={{ width: 220 }}>Provider</td><td><span className={`status-dot ${s.configured ? 'ok' : s.developmentMode ? 'warn' : 'bad'}`} />{s.configured ? (s.provider === 'brevo' ? 'Brevo (transactional API)' : s.provider) : s.developmentMode ? 'Development mode: messages are stored, not sent' : 'Not configured: invitations show a link to share instead'}</td></tr>
            <tr><td>Sender</td><td>{s.sender.name} &lt;{s.sender.email}&gt;{s.replyTo ? `, replies to ${s.replyTo}` : ''}</td></tr>
            <tr><td>Sender and domain verification</td><td className="small">{s.senderVerification}</td></tr>
            <tr><td>Delivery events (webhook)</td><td>{s.webhookConfigured ? 'Configured' : 'Not configured: bounces and blocks are not reported back'}</td></tr>
            {s.sandbox ? <tr><td>Sandbox</td><td>On: Brevo accepts and drops every message</td></tr> : null}
            <tr><td>Today (UTC)</td><td>{s.sentToday} of {s.dailyLimit} sent{s.criticalReserve ? `; ${s.criticalReserve} more kept for invitations` : ''}</td></tr>
            <tr><td>Delayed</td><td>{s.delayed ? <span className="badge warning">{s.delayed} waiting (daily limit or provider)</span> : 'None'}</td></tr>
          </tbody>
        </table>
        {!s.configured && !s.developmentMode ? (
          <p className="small" style={{ marginTop: 12 }}>
            Email is not connected yet, so the test button is off. The founder connects Brevo once for the whole platform in the founder console:{' '}
            <a href={appUrl('/admin/email')}>Founder console, Email (Brevo)</a>.
          </p>
        ) : null}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={test} disabled={testing || (!s.configured && !s.developmentMode)}><Icon name="message" /> Send a test email to me</button>
          <button className="btn" onClick={() => q.refetch()}><Icon name="refresh" /> Refresh</button>
        </div>
      </section>
      {s.suppressed.length ? (
        <section className="card card-pad">
          <h2 style={{ marginBottom: 8 }}>Addresses not emailed</h2>
          <p className="muted small">These members' addresses bounced, were blocked or complained, so nothing more is sent to them.</p>
          <ul>{s.suppressed.map((x) => <li key={x.email}>{x.email}: {x.reason} ({timeAgo(x.created_at)})</li>)}</ul>
        </section>
      ) : null}
      <section className="card">
        <div className="card-header"><h2 className="grow">Recent emails from this organisation</h2></div>
        {!s.recent.length ? <div className="card-pad muted small">None yet.</div> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>When</th><th>To</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {s.recent.map((r) => (
                  <tr key={r.id}>
                    <td className="small">{timeAgo(r.created_at)}</td>
                    <td className="small">{r.to_email}</td>
                    <td className="small">{r.subject}<div className="muted">{r.template}</div></td>
                    <td className="small">
                      <span className={`status-dot ${STATUS_TONE[r.status] ?? ''}`} />{r.status}{r.last_event ? ` (${r.last_event})` : ''}
                      {r.last_error ? <div className="muted">{r.last_error}</div> : null}
                      {r.status === 'deferred' ? <div className="muted">Next try {new Date(r.next_attempt_at).toLocaleString()}</div> : null}
                      {r.status === 'failed' && r.template !== 'invitation' ? <button className="btn ghost sm" onClick={async () => { try { await post(`/workspaces/${ws.id}/email/${r.id}/retry`, {}); q.refetch(); } catch (e) { toast(errorMessage(e), 'error'); } }}>Retry</button> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

interface AuditEventDTO {
  id: string;
  boardId: string | null;
  itemId: string | null;
  actorName: string | null;
  type: string;
  before: unknown;
  after: unknown;
  metadata: Record<string, unknown>;
  createdAt: number;
}

export function AuditTrail() {
  const ws = useWorkspace();
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (from) params.set('from', String(Date.parse(`${from}T00:00:00`)));
  if (to) params.set('to', String(Date.parse(`${to}T23:59:59`)));
  const q = useQuery({ queryKey: ['audit-events', ws.id, type, from, to], queryFn: () => get<AuditEventDTO[]>(`/workspaces/${ws.id}/audit-events?${params}`) });
  return (
    <section className="card">
      <div className="card-header"><h2 className="grow">Audit trail</h2></div>
      <div className="card-pad">
        <p className="muted small" style={{ marginBottom: 10 }}>The permanent record of task, project, membership, permission, invitation, finance, report and workspace name and colour events. Nobody can edit or delete it from the application.</p>
        <div className="row wrap" style={{ alignItems: 'flex-end' }}>
          <Field label="Event type">
            <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All</option>
              <option value="task.">Tasks</option>
              <option value="project.">Projects</option>
              <option value="member.">Members</option>
              <option value="invitation.">Invitations</option>
              <option value="permission.">Permissions</option>
              <option value="finance.">Finance</option>
              <option value="report.">Reports</option>
              <option value="workspace.">Workspace (name and colour)</option>
            </select>
          </Field>
          <Field label="From"><input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
          <Field label="To"><input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
        </div>
      </div>
      {q.isLoading ? <Loading /> : q.error ? <div className="card-pad"><ErrorBox error={q.error} /></div> : !q.data?.length ? <div className="card-pad muted small">No events in this range.</div> : (
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>When</th><th>Who</th><th>Event</th><th>Details</th></tr></thead>
            <tbody>
              {q.data.map((e) => (
                <tr key={e.id}>
                  <td className="small">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="small">{e.actorName ?? (e.metadata.automation ? 'Automation' : 'System')}</td>
                  <td><code className="small">{e.type}</code></td>
                  <td className="small muted">{describe(e)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function short(v: unknown): string {
  if (v == null) return 'none';
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return s.length > 80 ? `${s.slice(0, 79)}…` : s;
}

function describe(e: AuditEventDTO): string {
  const parts: string[] = [];
  if (e.before !== null && e.before !== undefined) parts.push(`before: ${short(e.before)}`);
  if (e.after !== null && e.after !== undefined) parts.push(`after: ${short(e.after)}`);
  const md = { ...e.metadata };
  delete md.automation;
  if (Object.keys(md).length) parts.push(short(md));
  return parts.join(' · ');
}
