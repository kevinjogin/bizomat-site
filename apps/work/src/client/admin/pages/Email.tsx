import { Fragment, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { errorMessage, post, put } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { Field, Switch } from '../../components/ui/ui';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { useAdmin } from '../api';
import { Card, Empty, PageIntro, QueryState, TableWrap, When } from '../ui';

interface EmailAdmin {
  status: {
    provider: 'brevo' | 'log' | 'none' | 'test';
    configured: boolean;
    keyUnreadable: boolean;
    canSaveSecrets: boolean;
    canChange: boolean;
    sentToday: number;
    counts: Record<string, number>;
  };
  settings: {
    enabled: boolean;
    hasApiKey: boolean;
    apiKeyLast4: string | null;
    apiKeySource: 'console' | 'environment' | 'default';
    hasWebhookToken: boolean;
    webhookTokenSource: 'console' | 'environment' | 'default';
    fromName: string;
    fromAddress: string;
    replyTo: string | null;
    dailyLimit: number;
    criticalReserve: number;
    sandbox: boolean;
    updatedAt: number | null;
    updatedBy: string | null;
  };
  appAddress: { href: string | null; problem: string | null; invitationExample: string | null };
  webhookUrl: string;
  endpoint: string;
  recent: { id: string; to_email: string; template: string; status: string; attempts: number; next_attempt_at: number; last_error: string | null; last_event: string | null; created_at: number; sent_at: number | null }[];
  suppressed: { email: string; reason: string; created_at: number }[];
}

interface LinkCheck {
  ok: boolean;
  verdict: string;
  dns: { host: string; resolves: boolean | null; detail: string };
  hops: { url: string; host: string; status: number | null; error: string | null }[];
  finalUrl: string | null;
}

interface CheckResult {
  ok: boolean;
  error: string | null;
  account: { email: string | null; companyName: string | null; plans: { type: string; credits: number | null; creditsType: string | null }[] } | null;
  senders: { email: string; name: string; active: boolean }[] | null;
  domains: { name: string; authenticated: boolean | null; verified: boolean | null }[] | null;
  sender: string;
  senderActive: boolean | null;
  domainAuthenticated: boolean | null;
}

const TEMPLATE_LABELS: Record<string, string> = {
  invitation: 'Invitation',
  invitation_accepted: 'Invitation accepted',
  project_assignment: 'Added to a project',
  task_assignment: 'Task assigned',
  task_reassignment: 'Task reassigned',
  due_reminder: 'Due soon',
  overdue: 'Overdue',
  status_update: 'Status changed',
  comment_mention: 'Comment or mention',
  project_membership: 'Project membership',
  permission_change: 'Access changed',
  report_generated: 'Report ready',
  test: 'Test',
  notification: 'Notification',
  verify_email: 'Email confirmation',
};

function Tick({ ok, yes, no, unknown }: { ok: boolean | null; yes: string; no: string; unknown?: string }) {
  if (ok === null) return <span className="muted">{unknown ?? 'Could not be read'}</span>;
  return (
    <span className={ok ? 'ac-ok' : 'ac-bad'}>
      <Icon name={ok ? 'check' : 'x'} size={14} /> {ok ? yes : no}
    </span>
  );
}

export default function Email() {
  const q = useAdmin<EmailAdmin>('/email');
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [apiKey, setApiKey] = useState('');
  const [form, setForm] = useState({ enabled: true, fromName: '', fromAddress: '', replyTo: '', dailyLimit: '250', criticalReserve: '40', sandbox: false });
  const [busy, setBusy] = useState<string | null>(null);
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [test, setTest] = useState<{ ok: boolean; status: string; error: string | null; to?: string } | null>(null);
  const [link, setLink] = useState('');
  const [linkCheck, setLinkCheck] = useState<LinkCheck | null>(null);
  const d = q.data;

  useEffect(() => {
    if (!d) return;
    setForm({
      enabled: d.settings.enabled,
      fromName: d.settings.fromName,
      fromAddress: d.settings.fromAddress,
      replyTo: d.settings.replyTo ?? '',
      dailyLimit: String(d.settings.dailyLimit),
      criticalReserve: String(d.settings.criticalReserve),
      sandbox: d.settings.sandbox,
    });
  }, [d?.settings.updatedAt]);

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin', '/email'] });
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
      const dailyLimit = Number(form.dailyLimit);
      const criticalReserve = Number(form.criticalReserve);
      if (!Number.isInteger(dailyLimit) || dailyLimit < 1) throw new Error('The daily limit must be a whole number of at least 1');
      if (!Number.isInteger(criticalReserve) || criticalReserve < 0) throw new Error('The reserve must be a whole number (0 or more)');
      await put('/admin/email', {
        enabled: form.enabled,
        ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
        fromName: form.fromName.trim(),
        fromAddress: form.fromAddress.trim(),
        replyTo: form.replyTo.trim(),
        dailyLimit,
        criticalReserve,
        sandbox: form.sandbox,
      });
      setApiKey('');
      toast('Email settings saved');
      await refresh();
    });
  };

  const checkKey = () =>
    run('check', async () => {
      const r = await post<CheckResult>('/admin/email/check', apiKey.trim() ? { apiKey: apiKey.trim() } : {});
      setCheck(r);
    });

  const removeKey = async () => {
    if (!(await confirm({ title: 'Remove the saved API key?', message: 'Email stops unless an API key is also set as a server secret.', danger: true, confirmLabel: 'Remove key' }))) return;
    void run('remove', async () => {
      await put('/admin/email', { apiKey: null });
      toast('API key removed');
      await refresh();
    });
  };

  const newToken = async () => {
    if (d?.settings.hasWebhookToken && !(await confirm({ title: 'Create a new webhook token?', message: 'The old token stops working. Paste the new one into Brevo straight away.', confirmLabel: 'Create new token' }))) return;
    void run('token', async () => {
      const r = await post<{ token: string; webhookUrl: string }>('/admin/email/webhook-token', {});
      setToken(r.token);
      await refresh();
    });
  };

  const sendTest = () =>
    run('test', async () => {
      const r = await post<{ ok: boolean; status: string; error: string | null; to?: string }>('/admin/email/test', {});
      setTest(r);
      await refresh();
    });

  const sendDelayed = () =>
    run('process', async () => {
      const r = await post<{ sent: number; failed: number; deferred: number }>('/admin/email/process', {});
      toast(`Sent ${r.sent ?? 0}, failed ${r.failed ?? 0}, still waiting ${r.deferred ?? 0}`);
      await refresh();
    });

  const copy = (text: string, what: string) => {
    void navigator.clipboard?.writeText(text).then(
      () => toast(`${what} copied`),
      () => toast('Copy failed: select the text and copy it', 'error'),
    );
  };

  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">
          Connect Brevo so BIZOMAT can send invitations, task assignments, due-date reminders and report notices. The API key is stored encrypted on the server and is
          never shown again after you save it.
        </p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const s = d!.status;
          const st = d!.settings;
          const canChange = s.canChange;
          return (
            <>
              <Card title="Status">
                <dl className="ac-dl">
                  <dt>Email</dt>
                  <dd>
                    {s.configured ? (
                      <span className="ac-ok"><Icon name="check" size={14} /> Connected to Brevo{st.sandbox ? ' (sandbox: Brevo accepts and drops every message)' : ''}</span>
                    ) : !st.enabled ? (
                      <span className="ac-bad"><Icon name="x" size={14} /> Switched off here</span>
                    ) : s.provider === 'log' ? (
                      <span className="muted">Development mode: messages are stored, not sent</span>
                    ) : (
                      <span className="ac-bad"><Icon name="x" size={14} /> Not connected: no API key. Invitations show a link to share by hand.</span>
                    )}
                  </dd>
                  {s.keyUnreadable ? (
                    <>
                      <dt>API key</dt>
                      <dd className="ac-bad">The saved key cannot be read on this server (the database came from another server). Enter it again.</dd>
                    </>
                  ) : null}
                  <dt>Links in emails</dt>
                  <dd>{d!.appAddress.problem ? <span className="ac-bad">{d!.appAddress.problem}</span> : <>{d!.appAddress.invitationExample} <span className="muted small">(from the app's configured address, never the browser's)</span></>}</dd>
                  <dt>Sender</dt>
                  <dd>{st.fromName} &lt;{st.fromAddress}&gt;{st.replyTo ? `, replies to ${st.replyTo}` : ''}</dd>
                  <dt>Today (UTC)</dt>
                  <dd>{s.sentToday} of {st.dailyLimit} sent; {st.criticalReserve} kept for invitations and account emails</dd>
                  <dt>All time</dt>
                  <dd>
                    {Object.keys(s.counts).length ? Object.entries(s.counts).map(([k, v]) => `${v} ${k}`).join(', ') : 'Nothing sent yet'}
                  </dd>
                  <dt>Delivery events</dt>
                  <dd>{st.hasWebhookToken ? 'Webhook token set: bounces and blocks come back from Brevo' : 'No webhook yet: bounces and blocks are not reported back (optional, below)'}</dd>
                  {st.updatedAt ? (
                    <>
                      <dt>Last changed</dt>
                      <dd><When ts={st.updatedAt} />{st.updatedBy ? ` by ${st.updatedBy}` : ''}</dd>
                    </>
                  ) : null}
                </dl>
                <div className="ac-actions">
                  <button className="btn primary" onClick={sendTest} disabled={!!busy || !s.configured}>
                    <Icon name="message" /> {busy === 'test' ? 'Sending…' : 'Send a test email to me'}
                  </button>
                  <button className="btn" onClick={() => refresh()} disabled={!!busy}><Icon name="refresh" /> Refresh</button>
                  {s.counts.deferred ? <button className="btn" onClick={sendDelayed} disabled={!!busy}>Send delayed emails now</button> : null}
                </div>
                {test ? (
                  <p className={`small ${test.ok ? 'ac-ok' : 'ac-bad'}`} role="status">
                    {test.ok
                      ? `Brevo accepted the test email to ${test.to}. Check that inbox (and its spam folder). Brevo, not BIZOMAT, reports the final delivery.`
                      : `Not sent (${test.status}): ${test.error ?? 'no reason given'}`}
                  </p>
                ) : null}
              </Card>

              <Card title="Brevo connection" subtitle={canChange ? 'Four steps. Nothing is sent until you press “Send a test email to me”.' : 'Only the founder can change the connection.'}>
                <ol className="ac-steps small">
                  <li>In Brevo, open <b>SMTP &amp; API</b>, then <b>API keys</b>, and create an API key. It starts with <code>xkeysib-</code> (not the SMTP key, <code>xsmtpsib-</code>).</li>
                  <li>In Brevo, open <b>Senders, domains &amp; dedicated IPs</b>: add the sender address below and authenticate its domain (Brevo gives the DNS records to add).</li>
                  <li>Paste the key here, press <b>Check key</b>, then <b>Save</b>.</li>
                  <li>Press <b>Send a test email to me</b> above.</li>
                </ol>
                <form onSubmit={save} className="ac-form">
                  <div className="ac-form-row">
                    <Switch checked={form.enabled} onChange={(v) => setForm({ ...form, enabled: v })} label="Send email" disabled={!canChange} />
                    <span>Send email {form.enabled ? 'on' : 'off'}</span>
                  </div>
                  <Field
                    label="Brevo API key"
                    htmlFor="brevo-key"
                    hint={
                      st.hasApiKey
                        ? `Saved key ending ${st.apiKeyLast4 ?? '????'}. Leave this empty to keep it.`
                        : st.apiKeySource === 'environment'
                          ? 'A key is set as a server secret. A key saved here replaces it.'
                          : 'No key saved yet.'
                    }
                  >
                    <input
                      id="brevo-key"
                      className="input"
                      type="password"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={st.hasApiKey ? `•••• ${st.apiKeyLast4 ?? ''}` : 'xkeysib-…'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={!canChange || !s.canSaveSecrets}
                    />
                  </Field>
                  {!s.canSaveSecrets ? <p className="small ac-bad">This server has no encryption key, so it cannot store an API key. Set the secret WORK_BREVO_API_KEY instead.</p> : null}
                  <div className="ac-grid-2">
                    <Field label="Sender name" htmlFor="from-name">
                      <input id="from-name" className="input" maxLength={70} value={form.fromName} onChange={(e) => setForm({ ...form, fromName: e.target.value })} disabled={!canChange} />
                    </Field>
                    <Field label="Sender address" htmlFor="from-address" hint="Must be a sender or authenticated domain in Brevo">
                      <input id="from-address" className="input" type="email" value={form.fromAddress} onChange={(e) => setForm({ ...form, fromAddress: e.target.value })} disabled={!canChange} />
                    </Field>
                    <Field label="Reply-to address (optional)" htmlFor="reply-to" hint="Where replies go. Empty: replies go to the sender address">
                      <input id="reply-to" className="input" type="email" value={form.replyTo} onChange={(e) => setForm({ ...form, replyTo: e.target.value })} disabled={!canChange} />
                    </Field>
                    <div className="ac-grid-2">
                      <Field label="Daily limit" htmlFor="daily-limit" hint="Brevo's free plan: 300 a day">
                        <input id="daily-limit" className="input" type="number" min={1} value={form.dailyLimit} onChange={(e) => setForm({ ...form, dailyLimit: e.target.value })} disabled={!canChange} />
                      </Field>
                      <Field label="Kept for invitations" htmlFor="reserve" hint="Of the daily limit">
                        <input id="reserve" className="input" type="number" min={0} value={form.criticalReserve} onChange={(e) => setForm({ ...form, criticalReserve: e.target.value })} disabled={!canChange} />
                      </Field>
                    </div>
                  </div>
                  <div className="ac-form-row">
                    <Switch checked={form.sandbox} onChange={(v) => setForm({ ...form, sandbox: v })} label="Sandbox" disabled={!canChange} />
                    <span>Sandbox (Brevo accepts every message and delivers none; for trying the setup)</span>
                  </div>
                  {canChange ? (
                    <div className="ac-actions">
                      <button className="btn primary" type="submit" disabled={!!busy}>{busy === 'save' ? 'Saving…' : 'Save'}</button>
                      <button className="btn" type="button" onClick={checkKey} disabled={!!busy || (!apiKey.trim() && !st.hasApiKey && st.apiKeySource !== 'environment')}>
                        {busy === 'check' ? 'Checking…' : 'Check key'}
                      </button>
                      {st.hasApiKey ? <button className="btn ghost" type="button" onClick={removeKey} disabled={!!busy}>Remove saved key</button> : null}
                    </div>
                  ) : null}
                </form>
                {check ? (
                  <div className="ac-check" role="status">
                    {!check.ok ? (
                      <p className="ac-bad small">{check.error}</p>
                    ) : (
                      <dl className="ac-dl">
                        <dt>Key</dt>
                        <dd><Tick ok yes="Brevo accepts this key" no="" /></dd>
                        <dt>Account</dt>
                        <dd>{[check.account?.companyName, check.account?.email].filter(Boolean).join(', ') || '—'}</dd>
                        {check.account?.plans.length ? (
                          <>
                            <dt>Plan</dt>
                            <dd>{check.account.plans.map((p) => `${p.type}${p.credits != null ? ` (${p.credits} ${p.creditsType ?? 'credits'})` : ''}`).join('; ')}</dd>
                          </>
                        ) : null}
                        <dt>Sender {check.sender}</dt>
                        <dd><Tick ok={check.senderActive} yes="Active sender in Brevo" no="Not an active sender in Brevo yet" /></dd>
                        <dt>Its domain</dt>
                        <dd><Tick ok={check.domainAuthenticated} yes="Authenticated in Brevo" no="Not authenticated in Brevo yet (add its DNS records)" /></dd>
                      </dl>
                    )}
                    {check.ok && check.senderActive === false && check.domainAuthenticated === false ? (
                      <p className="small muted">Until the sender or its domain is ready in Brevo, Brevo refuses messages from it.</p>
                    ) : null}
                  </div>
                ) : null}
              </Card>

              <Card title="Check an email link" subtitle="Brevo rewrites every link in an email to count clicks (an address like https://r.…/tr/cl/…). Paste a link from a received email: the server opens it as a recipient would and shows where it ends. Opening it counts as a click in Brevo.">
                <form
                  className="ac-grant"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void run('link', async () => setLinkCheck(await post<LinkCheck>('/admin/email/link-check', { link })));
                  }}
                >
                  <label className="ac-search grow">
                    <Icon name="link" />
                    <input className="input" placeholder="https://r.…/tr/cl/… or https://bizomat.ai/tasks/invite/…" aria-label="Link from an email" value={link} onChange={(e) => setLink(e.target.value)} />
                  </label>
                  <button className="btn" disabled={!!busy || link.trim().length < 8}>{busy === 'link' ? 'Checking…' : 'Check link'}</button>
                </form>
                <p className="small muted">Tip: send yourself the test email (Status, above); its “Check an email link” button points to …/tasks/invite/link-check.</p>
                {linkCheck ? (
                  <div className="ac-check" role="status">
                    <p className={linkCheck.ok ? 'ac-ok' : 'ac-bad'}><Icon name={linkCheck.ok ? 'check' : 'x'} size={14} /> {linkCheck.verdict}</p>
                    <dl className="ac-dl">
                      <dt>DNS for {linkCheck.dns.host}</dt>
                      <dd>{linkCheck.dns.resolves === null ? 'Not checked' : linkCheck.dns.resolves ? 'Found' : 'Not found'}{linkCheck.dns.detail ? `: ${linkCheck.dns.detail}` : ''}</dd>
                      {linkCheck.hops.map((h, i) => (
                        <Fragment key={i}>
                          <dt>{i === 0 ? 'Link' : `Redirect ${i}`}</dt>
                          <dd><code className="ac-code">{h.url}</code> {h.status != null ? `→ ${h.status}` : ''}{h.error ? <span className="ac-bad"> {h.error}</span> : null}</dd>
                        </Fragment>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </Card>

              <Card title="Delivery events (optional)" subtitle="Lets Brevo tell BIZOMAT about bounces, blocks and spam complaints, so those addresses are not emailed again.">
                <dl className="ac-dl">
                  <dt>Webhook address</dt>
                  <dd>
                    <code className="ac-code">{d!.webhookUrl}</code>{' '}
                    <button className="btn ghost sm" type="button" onClick={() => copy(d!.webhookUrl, 'Address')}>Copy</button>
                  </dd>
                  <dt>Token</dt>
                  <dd>{st.hasWebhookToken ? `Set (${st.webhookTokenSource === 'console' ? 'here' : 'server secret'})` : 'Not set'}</dd>
                </dl>
                {token ? (
                  <div className="ac-check" role="status">
                    <p className="small"><b>Copy this token now: it is not shown again.</b></p>
                    <code className="ac-code">{token}</code>{' '}
                    <button className="btn ghost sm" type="button" onClick={() => copy(token, 'Token')}>Copy</button>
                  </div>
                ) : null}
                <ol className="ac-steps small">
                  <li>Create a token here.</li>
                  <li>In Brevo, open <b>Transactional</b>, <b>Settings</b>, <b>Webhook</b>, and add a webhook with the address above.</li>
                  <li>Choose authentication <b>Bearer token</b> and paste the token; tick delivered, soft bounce, hard bounce, blocked, spam, invalid and unsubscribed.</li>
                </ol>
                {canChange ? (
                  <button className="btn" type="button" onClick={newToken} disabled={!!busy || !s.canSaveSecrets}>{st.hasWebhookToken ? 'Create a new token' : 'Create token'}</button>
                ) : null}
              </Card>

              <Card title="Recent emails" subtitle="Every organisation, newest first. Message content is not shown.">
                {!d!.recent.length ? (
                  <Empty>No emails yet.</Empty>
                ) : (
                  <TableWrap label="Recent emails">
                    <thead>
                      <tr>
                        <th>When</th>
                        <th>To</th>
                        <th>Kind</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d!.recent.map((r) => (
                        <tr key={r.id}>
                          <td><When ts={r.created_at} /></td>
                          <td className="small">{r.to_email}</td>
                          <td className="small">{TEMPLATE_LABELS[r.template] ?? r.template}</td>
                          <td className="small">
                            {r.status}
                            {r.last_event ? ` (${r.last_event})` : ''}
                            {r.last_error ? <div className="muted">{r.last_error}</div> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                )}
              </Card>

              {d!.suppressed.length ? (
                <Card title="Addresses not emailed" subtitle="They bounced, were blocked or complained, so nothing more is sent to them.">
                  <TableWrap label="Suppressed addresses">
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Reason</th>
                        <th>Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d!.suppressed.map((x) => (
                        <tr key={x.email}>
                          <td className="small">{x.email}</td>
                          <td className="small">{x.reason}</td>
                          <td><When ts={x.created_at} /></td>
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
