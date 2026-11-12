import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { errorMessage, post, put } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { Field, Switch } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { useAdmin } from '../api';
import { Card, Empty, Kpi, PageIntro, QueryState, TableWrap, When } from '../ui';

interface Policy {
  blockDisposable: boolean;
  requireMx: boolean;
  requireVerification: boolean;
  blockedDomains: string[];
  allowedDomains: string[];
  updatedAt: number | null;
  updatedBy: string | null;
}

interface ProtectionResp {
  policy: Policy;
  canChange: boolean;
  confirmationActive: boolean;
  disposableCount: number;
  reasons: Record<string, string>;
  refusals: { last30Days: number; byReason: Record<string, number>; recent: { at: number; where: string; reason: string; domain: string | null }[] };
  unconfirmed: { count: number; accounts: { id: string; name: string; email: string; created_at: number; last_link_at: number | null }[] };
  flagged: { id: string; name: string; email: string; created_at: number }[];
}

type CheckResp = { ok: boolean; domain: string; reason?: string; message?: string; allowed?: boolean; mx?: string };

const WHERE: Record<string, string> = { signup: 'Sign-up', login: 'Sign-in', oauth: 'Google sign-in', invitation: 'Invitation' };
const MX: Record<string, string> = {
  ok: 'has mail servers',
  no_mx: 'publishes no mail servers',
  null_mx: 'says it accepts no email',
  nxdomain: 'does not exist',
  unknown: 'could not be checked (DNS did not answer); let through',
  skipped: 'not checked',
};

const lines = (s: string) => s.split(/[\s,;]+/).map((x) => x.trim()).filter(Boolean);

export default function SignupProtection() {
  const q = useAdmin<ProtectionResp>('/signup-protection');
  const qc = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({ blockDisposable: true, requireMx: true, requireVerification: true, blocked: '', allowed: '' });
  const [busy, setBusy] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [test, setTest] = useState<CheckResp | null>(null);
  const d = q.data;

  useEffect(() => {
    if (!d) return;
    setForm({
      blockDisposable: d.policy.blockDisposable,
      requireMx: d.policy.requireMx,
      requireVerification: d.policy.requireVerification,
      blocked: d.policy.blockedDomains.join('\n'),
      allowed: d.policy.allowedDomains.join('\n'),
    });
  }, [d?.policy.updatedAt]);

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin', '/signup-protection'] });
  const run = async (what: string, fn: () => Promise<void>) => {
    setBusy(what);
    try {
      await fn();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(null);
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    void run('save', async () => {
      await put('/admin/signup-protection', {
        blockDisposable: form.blockDisposable,
        requireMx: form.requireMx,
        requireVerification: form.requireVerification,
        blockedDomains: lines(form.blocked),
        allowedDomains: lines(form.allowed),
      });
      toast('Sign-up protection saved');
      await refresh();
    });
  };

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;
    void run('check', async () => setTest(await post<CheckResp>('/admin/signup-protection/check', { email: testEmail.trim() })));
  };

  const confirmAccount = (id: string, email: string) =>
    run(`confirm:${id}`, async () => {
      await post(`/admin/users/${id}/confirm-email`, {});
      toast(`${email} marked as confirmed`);
      await refresh();
    });

  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">
          Who can create an account and sign in. Only addresses that can really receive email get in: temporary-mail services, domains you block and
          domains without mail servers are refused, robots that fill the hidden form field are refused, and new accounts confirm their address before
          signing in. Accounts that existed before this was turned on are not affected, and administrators are never locked out.
        </p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const p = d!.policy;
          const canChange = d!.canChange;
          return (
            <>
              <div className="ac-kpis">
                <Kpi label="Refused, last 30 days" value={d!.refusals.last30Days} icon="shield" />
                <Kpi label="Accounts waiting to confirm" value={d!.unconfirmed.count} icon="message" />
                <Kpi label="Accounts on refused domains" value={d!.flagged.length} icon="users" tone={d!.flagged.length ? 'warning' : undefined} />
                <Kpi label="Email confirmation" value={null} text={d!.confirmationActive ? 'On' : p.requireVerification ? 'Waiting for email' : 'Off'} icon="check" />
              </div>

              <Card title="Rules" subtitle={canChange ? undefined : 'Only the founder can change these rules.'}>
                <form className="ac-form" onSubmit={save}>
                  <div className="ac-form-row">
                    <Switch checked={form.blockDisposable} onChange={(v) => setForm({ ...form, blockDisposable: v })} label="Block disposable addresses" disabled={!canChange} />
                    <span>Block temporary and disposable email services ({d!.disposableCount} known services, and their subdomains)</span>
                  </div>
                  <div className="ac-form-row">
                    <Switch checked={form.requireMx} onChange={(v) => setForm({ ...form, requireMx: v })} label="Require mail servers" disabled={!canChange} />
                    <span>Require a domain that receives email (it must publish mail servers; catches made-up domains and typos such as gmial.com)</span>
                  </div>
                  <div className="ac-form-row">
                    <Switch checked={form.requireVerification} onChange={(v) => setForm({ ...form, requireVerification: v })} label="Require email confirmation" disabled={!canChange} />
                    <span>
                      New accounts confirm their address (a link by email) before they can sign in
                      {form.requireVerification && !d!.confirmationActive ? <b> (starts when email is connected: Founder console, Email)</b> : null}
                    </span>
                  </div>
                  <div className="ac-grid-2">
                    <Field label="Blocked domains" htmlFor="blocked" hint="One per line. Their subdomains are blocked too. Existing accounts on them can no longer sign in.">
                      <textarea id="blocked" className="input ac-textarea" rows={6} spellCheck={false} placeholder="spam-domain.example" value={form.blocked} onChange={(e) => setForm({ ...form, blocked: e.target.value })} disabled={!canChange} />
                    </Field>
                    <Field label="Always allowed domains" htmlFor="allowed" hint="One per line. Skips every check (for example your own company's domain, or a domain refused by mistake).">
                      <textarea id="allowed" className="input ac-textarea" rows={6} spellCheck={false} placeholder="yourcompany.com" value={form.allowed} onChange={(e) => setForm({ ...form, allowed: e.target.value })} disabled={!canChange} />
                    </Field>
                  </div>
                  <p className="muted small">Always on: a hidden field on the sign-up form that only robots fill, and limits on sign-ups and sign-in attempts per address and network.</p>
                  {canChange ? (
                    <div className="ac-actions">
                      <button className="btn primary" type="submit" disabled={!!busy}>{busy === 'save' ? 'Saving…' : 'Save rules'}</button>
                      {p.updatedAt ? <span className="muted small">Last changed <When ts={p.updatedAt} />{p.updatedBy ? ` by ${p.updatedBy}` : ''}</span> : null}
                    </div>
                  ) : null}
                </form>
              </Card>

              <Card title="Test an address" subtitle="What the rules say about an address today. The mail-server check really asks DNS. Nothing is sent and no account is made.">
                <form className="ac-grant" onSubmit={check}>
                  <label className="ac-search grow">
                    <Icon name="search" />
                    <input className="input" type="email" placeholder="name@example.com" aria-label="Address to test" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
                  </label>
                  <button className="btn" disabled={!!busy || !testEmail.trim()}>{busy === 'check' ? 'Checking…' : 'Test'}</button>
                </form>
                {test ? (
                  <div className="ac-check" role="status">
                    {test.ok ? (
                      <p className="ac-ok"><Icon name="check" size={14} /> Allowed{test.allowed ? ' (always allowed domain)' : ''}. {test.domain} {MX[test.mx ?? 'skipped'] ?? test.mx}.</p>
                    ) : (
                      <p className="ac-bad"><Icon name="x" size={14} /> Refused ({d!.reasons[test.reason ?? ''] ?? test.reason}): {test.message}</p>
                    )}
                  </div>
                ) : null}
              </Card>

              <div className="ac-grid-2">
                <Card title="Refused in the last 30 days" subtitle="Only the domain and the reason are kept, never the whole address.">
                  {!d!.refusals.recent.length ? (
                    <Empty>Nothing refused yet.</Empty>
                  ) : (
                    <>
                      <p className="small">
                        {Object.entries(d!.refusals.byReason).map(([r, n]) => `${d!.reasons[r] ?? r}: ${n}`).join('; ')}
                      </p>
                      <TableWrap label="Refusals">
                        <thead>
                          <tr>
                            <th>When</th>
                            <th>Where</th>
                            <th>Domain</th>
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {d!.refusals.recent.map((r, i) => (
                            <tr key={i}>
                              <td><When ts={r.at} /></td>
                              <td className="small">{WHERE[r.where] ?? r.where}</td>
                              <td className="small">{r.domain ?? '—'}</td>
                              <td className="small">{d!.reasons[r.reason] ?? r.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </TableWrap>
                    </>
                  )}
                </Card>

                <Card title="Waiting to confirm" subtitle="New accounts that have not opened their confirmation link yet. They cannot sign in until they do.">
                  {!d!.unconfirmed.accounts.length ? (
                    <Empty>None.</Empty>
                  ) : (
                    <TableWrap label="Accounts waiting to confirm">
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th>Created</th>
                          <th>Last link</th>
                          {canChange ? <th aria-label="Actions" /> : null}
                        </tr>
                      </thead>
                      <tbody>
                        {d!.unconfirmed.accounts.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <div className="ac-user-cell">
                                <span className="ac-user-name">{u.name}</span>
                                <span className="muted small">{u.email}</span>
                              </div>
                            </td>
                            <td><When ts={u.created_at} /></td>
                            <td><When ts={u.last_link_at} fallback="none sent" /></td>
                            {canChange ? (
                              <td className="num">
                                <button className="btn ghost sm" onClick={() => confirmAccount(u.id, u.email)} disabled={!!busy} title="Only after you have checked with the person that the address is theirs">
                                  Mark confirmed
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </TableWrap>
                  )}
                </Card>
              </div>

              {d!.flagged.length ? (
                <Card title="Existing accounts on refused domains" subtitle="These accounts cannot sign in under the current rules (unless they are administrators). Add the domain to “Always allowed” if that is wrong.">
                  <TableWrap label="Accounts on refused domains">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d!.flagged.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="ac-user-cell">
                              <span className="ac-user-name">{u.name}</span>
                              <span className="muted small">{u.email}</span>
                            </div>
                          </td>
                          <td><When ts={u.created_at} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                </Card>
              ) : null}
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
