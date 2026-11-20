// Two-factor sign-in in Settings, Security (src/worker/auth/two-factor.ts; flag account_two_factor): turn it on with an
// authenticator app and keep the ten recovery codes shown once; new recovery codes, or turning it off, need the password
// and a code. Shown only while it is available (the flag is on, or the person is a platform admin).
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post } from '../../lib/api';
import { Field } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';

interface Status {
  available: boolean;
  enrolled: boolean;
  pending: boolean;
  recoveryCodesLeft: number;
  canEncrypt: boolean;
  hasPassword: boolean;
  askedAtSignIn: boolean;
}

export function TwoFactorCard() {
  const q = useQuery({ queryKey: ['two-factor'], queryFn: () => get<Status>('/auth/two-factor') });
  const qc = useQueryClient();
  const toast = useToast();
  const [setup, setSetup] = useState<{ secret: string; qr: string | null } | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [codes, setCodes] = useState<string[] | null>(null);
  const [mode, setMode] = useState<'none' | 'off' | 'codes'>('none');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!q.data?.available) return null;
  const s = q.data;
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const start = () => run(async () => setSetup(await post<{ secret: string; qr: string | null }>('/auth/two-factor/start')));
  const confirmSetup = () =>
    run(async () => {
      const r = await post<{ recoveryCodes: string[] }>('/auth/two-factor/confirm', { code });
      setCodes(r.recoveryCodes);
      setSetup(null);
      setCode('');
      await qc.invalidateQueries({ queryKey: ['two-factor'] });
      toast('Two-factor sign-in is on');
    });
  const manage = () =>
    run(async () => {
      const input = { ...(s.hasPassword ? { password } : {}), ...(code.includes('-') || code.length > 8 ? { recoveryCode: code } : { code }) };
      if (mode === 'off') {
        await post('/auth/two-factor/disable', input);
        toast('Two-factor sign-in is off');
      } else {
        setCodes((await post<{ recoveryCodes: string[] }>('/auth/two-factor/recovery-codes', input)).recoveryCodes);
      }
      setMode('none');
      setPassword('');
      setCode('');
      await qc.invalidateQueries({ queryKey: ['two-factor'] });
    });
  return (
    <section className="card card-pad" id="two-factor">
      <h2>Two-factor sign-in</h2>
      <p className="muted small">
        {s.enrolled
          ? `On. ${s.askedAtSignIn ? 'Signing in asks for a code from your authenticator app.' : 'The ERP console asks for a code from your authenticator app.'} ${s.recoveryCodesLeft} recovery codes left.`
          : s.askedAtSignIn ? 'Off. Turn it on to be asked for a code from an authenticator app on your phone each time you sign in.' : 'Off. Turn it on to be asked for a code from an authenticator app in the ERP console.'}
      </p>
      {codes ? (
        <div className="info-box">
          <p className="small"><strong>Your recovery codes.</strong> Each works once, if you lose your phone. Keep them somewhere safe: they are not shown again.</p>
          <ul className="mt-recovery-codes">{codes.map((c) => <li key={c}><code>{c}</code></li>)}</ul>
          <button className="btn sm" onClick={() => setCodes(null)}>I have kept them</button>
        </div>
      ) : null}
      {!s.enrolled && !setup ? <button className="btn primary" disabled={busy || !s.canEncrypt} onClick={() => void start()}>Turn on two-factor sign-in</button> : null}
      {!s.canEncrypt ? <p className="muted small">It needs the server’s settings key, which is not set on this server.</p> : null}
      {setup ? (
        <div className="stack">
          <p className="small">Scan the code with your authenticator app (or type the key), then enter the six-digit code it shows.</p>
          {setup.qr ? <img className="mt-qr" src={setup.qr} alt="QR code for your authenticator app" width={180} height={180} /> : null}
          <p className="small">Key: <code>{setup.secret}</code></p>
          <Field label="Code from the app" htmlFor="tf-code">
            <input id="tf-code" className="input" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.trim())} />
          </Field>
          <div className="row"><button className="btn primary" disabled={busy || code.length < 6} onClick={() => void confirmSetup()}>Confirm</button><button className="btn" onClick={() => { setSetup(null); setCode(''); }}>Cancel</button></div>
        </div>
      ) : null}
      {s.enrolled && mode === 'none' && !codes ? (
        <div className="row wrap">
          <button className="btn" onClick={() => setMode('codes')}>New recovery codes</button>
          <button className="btn ghost danger" onClick={() => setMode('off')}>Turn off</button>
        </div>
      ) : null}
      {mode !== 'none' ? (
        <div className="stack">
          <p className="small">{mode === 'off' ? 'Turning it off means only your password protects your account.' : 'New codes replace the ones you have.'} Confirm it is you.</p>
          {s.hasPassword ? (
            <Field label="Password" htmlFor="tf-password">
              <input id="tf-password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
          ) : null}
          <Field label="Code from the app, or a recovery code" htmlFor="tf-manage-code">
            <input id="tf-manage-code" className="input" autoComplete="one-time-code" maxLength={20} value={code} onChange={(e) => setCode(e.target.value.trim())} />
          </Field>
          <div className="row"><button className={`btn ${mode === 'off' ? 'danger' : 'primary'}`} disabled={busy || !code || (s.hasPassword && !password)} onClick={() => void manage()}>{mode === 'off' ? 'Turn off' : 'Make new codes'}</button><button className="btn" onClick={() => { setMode('none'); setCode(''); setPassword(''); }}>Cancel</button></div>
        </div>
      ) : null}
      {error ? <div className="error-box" role="alert">{error}</div> : null}
    </section>
  );
}
