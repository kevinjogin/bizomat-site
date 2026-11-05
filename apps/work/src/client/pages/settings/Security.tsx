import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, post } from '../../lib/api';
import { useConfig } from '../../lib/session';
import { timeAgo } from '../../lib/format';
import { ErrorBox, Field, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';

interface SessionRow {
  id: string;
  provider: string;
  user_agent: string | null;
  ip: string | null;
  created_at: number;
  last_seen_at: number;
  expires_at: number;
  current: boolean;
}

function describeAgent(ua: string | null) {
  if (!ua) return 'Unknown device';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : '';
  return `${browser}${os ? ` on ${os}` : ''}`;
}

export function SecuritySettings() {
  return (
    <div className="col" style={{ gap: 16 }}>
      <PasswordCard />
      <SessionsCard />
      <ProvidersCard />
      <TokensCard />
    </div>
  );
}

function PasswordCard() {
  const ids = useQuery({ queryKey: ['identities'], queryFn: () => get<{ hasPassword: boolean; identities: any[] }>('/me/identities') });
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();
  const hasPassword = ids.data?.hasPassword ?? true;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirmPw) return setError('New passwords do not match');
    setBusy(true);
    try {
      await post('/me/password', { currentPassword: hasPassword ? current : undefined, newPassword: next });
      setCurrent('');
      setNext('');
      setConfirmPw('');
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({ queryKey: ['identities'] });
      toast('Password updated. Other sessions were signed out.');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="card card-pad" onSubmit={submit}>
      <h2 style={{ marginBottom: 12 }}>{hasPassword ? 'Change password' : 'Set a password'}</h2>
      {hasPassword ? (
        <Field label="Current password" htmlFor="pw-current">
          <input id="pw-current" className="input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </Field>
      ) : (
        <p className="muted small">You sign in with an external provider. Setting a password adds email sign-in as a fallback.</p>
      )}
      <Field label="New password" htmlFor="pw-new" hint="At least 10 characters with letters and a number or symbol.">
        <input id="pw-new" className="input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={10} />
      </Field>
      <Field label="Confirm new password" htmlFor="pw-confirm">
        <input id="pw-confirm" className="input" type="password" autoComplete="new-password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
      </Field>
      {error ? <div className="error-box" style={{ marginBottom: 12 }} role="alert">{error}</div> : null}
      <button className="btn primary" disabled={busy || next.length < 10}>{busy ? 'Saving…' : 'Update password'}</button>
    </form>
  );
}

function SessionsCard() {
  const q = useQuery({ queryKey: ['sessions'], queryFn: () => get<SessionRow[]>('/me/sessions') });
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      qc.invalidateQueries({ queryKey: ['sessions'] });
      toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="grow">Active sessions</h2>
        <button
          className="btn sm"
          disabled={(q.data ?? []).filter((s) => !s.current).length === 0}
          onClick={async () => {
            if (await confirm({ title: 'Sign out other sessions?', message: 'Every other browser and device will be signed out.', confirmLabel: 'Sign out others', danger: true })) {
              act(() => post('/me/sessions/revoke-others'), 'Other sessions signed out');
            }
          }}
        >
          Sign out all others
        </button>
      </div>
      {q.isLoading ? <Loading /> : null}
      {q.error ? <div className="card-pad"><ErrorBox error={q.error} /></div> : null}
      <div className="list">
        {(q.data ?? []).map((s) => (
          <div key={s.id} className="list-row">
            <Icon name="keyboard" />
            <span className="grow" style={{ minWidth: 0 }}>
              <strong>{describeAgent(s.user_agent)}</strong> {s.current ? <span className="badge success">This device</span> : null}
              <div className="muted small">
                {s.provider} · IP {s.ip ?? 'unknown'} · active {timeAgo(s.last_seen_at)} · expires {new Date(s.expires_at).toLocaleDateString()}
              </div>
            </span>
            {!s.current ? (
              <button className="btn sm" onClick={() => act(() => del(`/me/sessions/${s.id}`), 'Session revoked')}>Revoke</button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProvidersCard() {
  const q = useQuery({ queryKey: ['identities'], queryFn: () => get<{ hasPassword: boolean; identities: { id: string; provider: string; email: string; created_at: number }[] }>('/me/identities') });
  const config = useConfig();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const google = config.data?.providers.find((p) => p.id === 'google');
  const linkedGoogle = q.data?.identities.some((i) => i.provider === 'google');
  return (
    <section className="card">
      <div className="card-header"><h2 className="grow">Sign-in methods</h2></div>
      <div className="list">
        <div className="list-row">
          <Icon name="key" />
          <span className="grow">Email and password</span>
          <span className={`badge ${q.data?.hasPassword ? 'success' : ''}`}>{q.data?.hasPassword ? 'Enabled' : 'Not set'}</span>
        </div>
        {(q.data?.identities ?? []).map((i) => (
          <div key={i.id} className="list-row">
            <Icon name="globe" />
            <span className="grow">
              {i.provider[0].toUpperCase() + i.provider.slice(1)} <span className="muted small">{i.email}</span>
            </span>
            <button
              className="btn sm"
              onClick={async () => {
                if (!(await confirm({ title: `Unlink ${i.provider}?`, message: 'You will no longer be able to sign in with this provider.', danger: true, confirmLabel: 'Unlink' }))) return;
                try {
                  await del(`/me/identities/${i.id}`);
                  qc.invalidateQueries({ queryKey: ['identities'] });
                  toast('Provider unlinked');
                } catch (e) {
                  toast(errorMessage(e), 'error');
                }
              }}
            >
              Unlink
            </button>
          </div>
        ))}
        <div className="list-row">
          <Icon name="globe" />
          <span className="grow">
            Google
            {!google?.enabled ? <div className="muted small">Google sign-in is not configured on this deployment (an administrator must add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET).</div> : null}
          </span>
          {google?.enabled && !linkedGoogle ? (
            <a className="btn sm" href="/api/auth/oauth/google/start?link=1">Link Google</a>
          ) : (
            <button className="btn sm" disabled>{linkedGoogle ? 'Linked' : 'Unavailable'}</button>
          )}
        </div>
      </div>
    </section>
  );
}

function TokensCard() {
  const q = useQuery({ queryKey: ['api-tokens'], queryFn: () => get<{ id: string; name: string; prefix: string; last_used_at: number | null; expires_at: number | null; created_at: number }[]>('/me/tokens') });
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [days, setDays] = useState('90');
  const [created, setCreated] = useState<string | null>(null);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await post('/me/tokens', { name: name.trim(), expiresInDays: days ? Number(days) : undefined });
      setCreated(r.token);
      setName('');
      qc.invalidateQueries({ queryKey: ['api-tokens'] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="grow">Personal API tokens</h2>
        <button className="btn sm" onClick={() => { setCreated(null); setCreating(true); }}><Icon name="plus" size={14} /> New token</button>
      </div>
      <div className="card-pad muted small" style={{ paddingBottom: 0 }}>
        Use tokens with <code>Authorization: Bearer &lt;token&gt;</code> to call the WorkOS API. Tokens act as you, with your permissions.
      </div>
      {q.isLoading ? <Loading /> : null}
      <div className="list" style={{ marginTop: 8 }}>
        {(q.data ?? []).map((t) => (
          <div key={t.id} className="list-row">
            <Icon name="key" />
            <span className="grow" style={{ minWidth: 0 }}>
              <strong>{t.name}</strong> <span className="mono muted">{t.prefix}…</span>
              <div className="muted small">
                Created {timeAgo(t.created_at)} · {t.last_used_at ? `last used ${timeAgo(t.last_used_at)}` : 'never used'} · {t.expires_at ? `expires ${new Date(t.expires_at).toLocaleDateString()}` : 'no expiry'}
              </div>
            </span>
            <button
              className="btn sm"
              onClick={async () => {
                if (!(await confirm({ title: `Revoke "${t.name}"?`, message: 'Applications using this token will stop working immediately.', danger: true, confirmLabel: 'Revoke' }))) return;
                try {
                  await del(`/me/tokens/${t.id}`);
                  qc.invalidateQueries({ queryKey: ['api-tokens'] });
                } catch (e) {
                  toast(errorMessage(e), 'error');
                }
              }}
            >
              Revoke
            </button>
          </div>
        ))}
        {q.data && q.data.length === 0 ? <div className="card-pad muted small">No tokens yet.</div> : null}
      </div>
      {creating ? (
        <Modal title={created ? 'Token created' : 'New API token'} onClose={() => setCreating(false)} footer={created ? <button className="btn primary" onClick={() => setCreating(false)}>Done</button> : <><button className="btn" onClick={() => setCreating(false)}>Cancel</button><button className="btn primary" form="token-form" disabled={!name.trim()}>Create token</button></>}>
          {created ? (
            <>
              <p>Copy this token now. It will not be shown again.</p>
              <div className="token-reveal" aria-label="New token">{created}</div>
              <button className="btn sm" style={{ marginTop: 10 }} onClick={() => navigator.clipboard?.writeText(created).then(() => toast('Copied'))}><Icon name="copy" size={14} /> Copy</button>
            </>
          ) : (
            <form id="token-form" onSubmit={create}>
              <Field label="Name" htmlFor="tok-name"><input id="tok-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="e.g. Reporting script" /></Field>
              <Field label="Expires" htmlFor="tok-exp">
                <select id="tok-exp" className="select" value={days} onChange={(e) => setDays(e.target.value)}>
                  <option value="30">In 30 days</option>
                  <option value="90">In 90 days</option>
                  <option value="365">In 1 year</option>
                  <option value="">Never</option>
                </select>
              </Field>
            </form>
          )}
        </Modal>
      ) : null}
    </section>
  );
}
