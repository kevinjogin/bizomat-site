// Two-factor sign-in for platform admins (Admin Control Centre, R2): set up an authenticator app, keep the recovery
// codes, and prove the second factor once per session. MfaGate stands in front of the console for an admin who has
// set it up and has not proved it in this session.
import { useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { errorMessage, post } from '../../lib/api';
import { Field } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { useAdmin } from '../api';
import { Card, PageIntro, QueryState } from '../ui';
import { useReauth } from '../reauth';

export interface SecurityState {
  mfa: { enrolled: boolean; pending: boolean; recoveryCodesLeft: number };
  session: { verified: boolean; reauthenticatedAt: number | null; reauthValidUntil: number | null };
  canEncrypt: boolean;
}

export const useSecurity = () => useAdmin<SecurityState>('/platform/security', { staleTime: 0 });

function CodeForm({ onDone, allowRecovery }: { onDone: () => void; allowRecovery?: boolean }) {
  const [code, setCode] = useState('');
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post('/admin/platform/security/verify', recovery ? { recoveryCode: code.trim() } : { code: code.replace(/\s/g, '') });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="ac-form ac-stack" onSubmit={submit}>
      <Field label={recovery ? 'Recovery code' : 'Code from your authenticator app'} htmlFor="mfa-code" error={error}>
        <input id="mfa-code" className="input" autoComplete="one-time-code" inputMode={recovery ? 'text' : 'numeric'} maxLength={recovery ? 20 : 8} value={code} onChange={(e) => setCode(e.target.value)} required />
      </Field>
      <div className="row">
        <button className="btn primary" type="submit" disabled={busy}>Continue</button>
        {allowRecovery ? (
          <button className="btn ghost" type="button" onClick={() => { setRecovery(!recovery); setCode(''); setError(null); }}>
            {recovery ? 'Use the authenticator app' : 'Use a recovery code'}
          </button>
        ) : null}
      </div>
    </form>
  );
}

/** Before the console: an admin who set up two-factor sign-in proves it once per session. */
export function MfaGate({ children }: { children: ReactNode }) {
  const s = useSecurity();
  const qc = useQueryClient();
  if (s.isLoading) return <div className="ac-boot"><span className="spinner" aria-label="Loading" /></div>;
  if (!s.data || !s.data.mfa.enrolled || s.data.session.verified) return <>{children}</>;
  return (
    <div className="ac-boot">
      <section className="ac-card ac-stack" aria-labelledby="mfa-gate-title">
        <h1 id="mfa-gate-title" className="ac-h2">Two-factor sign-in</h1>
        <p className="muted">Enter the code your authenticator app shows for BIZOMAT.</p>
        <CodeForm allowRecovery onDone={() => void qc.invalidateQueries()} />
      </section>
    </div>
  );
}

export default function Security() {
  const s = useSecurity();
  const qc = useQueryClient();
  const toast = useToast();
  const { run, dialog } = useReauth();
  const [setup, setSetup] = useState<{ secret: string; uri: string; qr: string | null } | null>(null);
  const [code, setCode] = useState('');
  const [codes, setCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin', '/platform/security'] });

  const start = () => {
    setBusy(true);
    run(() => post<{ secret: string; uri: string; qr: string | null }>('/admin/platform/security/mfa/start', {}))
      .then((r) => { setSetup(r); setCodes(null); setCode(''); })
      .catch((e) => { if (errorMessage(e) !== 'Cancelled') toast(errorMessage(e), 'error'); })
      .finally(() => setBusy(false));
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await post<{ recoveryCodes: string[] }>('/admin/platform/security/mfa/confirm', { code: code.replace(/\s/g, '') });
      setCodes(r.recoveryCodes);
      setSetup(null);
      toast('Two-factor sign-in is on');
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ac-stack">
      {dialog}
      <PageIntro>
        <p className="muted">
          Two-factor sign-in protects the console: after your password, a six-digit code from an authenticator app on your phone. The Control Centre
          always needs it; once it is set up, the whole console asks for a code once per session. Dangerous changes ask for your password and a code
          again.
        </p>
      </PageIntro>
      <QueryState q={s}>
        {() => {
          const d = s.data!;
          return (
            <>
              {codes ? (
                <Card title="Your recovery codes" subtitle="Shown once. Keep them somewhere safe, away from your phone. Each one works once if you lose the phone.">
                  <ol className="ac-list mono">{codes.map((c) => <li key={c}>{c}</li>)}</ol>
                  <div className="row"><button className="btn" onClick={() => setCodes(null)}>I have saved them</button></div>
                </Card>
              ) : null}
              <Card title="Authenticator app" subtitle={d.mfa.enrolled ? `On. ${d.mfa.recoveryCodesLeft} recovery codes left.` : 'Not set up yet.'}>
                {!d.canEncrypt ? (
                  <p className="muted">Two-factor sign-in needs the server’s settings key, which is not set on this server.</p>
                ) : setup ? (
                  <form className="ac-form ac-stack" onSubmit={confirm}>
                    <p>Scan this code with an authenticator app (for example 1Password, Google Authenticator or Microsoft Authenticator), then enter the six-digit code it shows.</p>
                    {setup.qr ? <img src={setup.qr} alt="QR code to add BIZOMAT to an authenticator app" width={200} height={200} /> : null}
                    <p className="small">Or type this key: <code className="ac-code">{setup.secret.replace(/(.{4})/g, '$1 ').trim()}</code></p>
                    <Field label="Code from the app" htmlFor="mfa-first-code">
                      <input id="mfa-first-code" className="input" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value)} required />
                    </Field>
                    <div className="row">
                      <button className="btn primary" type="submit" disabled={busy}>Turn on</button>
                      <button className="btn ghost" type="button" onClick={() => setSetup(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="row">
                    <button className="btn primary" onClick={start} disabled={busy}>{d.mfa.enrolled ? 'Move to a new phone' : 'Set up two-factor sign-in'}</button>
                  </div>
                )}
              </Card>
              {d.mfa.enrolled && !d.session.verified ? (
                <Card title="This session">
                  <CodeForm allowRecovery onDone={() => void refresh()} />
                </Card>
              ) : null}
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
