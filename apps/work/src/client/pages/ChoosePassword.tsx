import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { errorMessage, post } from '../lib/api';
import { useSession } from '../lib/session';
import { Field } from '../components/ui/ui';
import { AuthLayout } from './Auth';

/**
 * Shown instead of the app while the account must choose a new password: after the founder set a temporary one, or
 * after a security reset. The server refuses everything else until then (403 PASSWORD_RESET_REQUIRED).
 */
export function ChoosePasswordPage() {
  const { session } = useSession();
  const qc = useQueryClient();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirmPw) return setError('The new passwords do not match');
    if (next === current) return setError('Choose a password different from the one you signed in with');
    setBusy(true);
    try {
      await post('/me/password', { currentPassword: current, newPassword: next });
      await qc.invalidateQueries({ queryKey: ['me'] });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };
  const signOut = async () => {
    try {
      await post('/auth/logout');
    } finally {
      window.location.assign('/login');
    }
  };
  return (
    <AuthLayout title="Choose a new password" subtitle="For your security, choose a new password before you continue. It signs you out everywhere else.">
      <form onSubmit={submit}>
        {session ? <p className="muted small">Signed in as {session.user.email}</p> : null}
        <Field label="The password you signed in with" htmlFor="cp-current">
          <input id="cp-current" className="input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </Field>
        <Field label="New password" htmlFor="cp-new" hint="At least 10 characters with letters and a number or symbol.">
          <input id="cp-new" className="input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={10} />
        </Field>
        <Field label="Confirm new password" htmlFor="cp-confirm">
          <input id="cp-confirm" className="input" type="password" autoComplete="new-password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
        </Field>
        {error ? <div className="error-box" role="alert">{error}</div> : null}
        <button className="btn primary block lg" disabled={busy || next.length < 10}>{busy ? 'Saving…' : 'Save and continue'}</button>
        <button type="button" className="btn ghost block" onClick={signOut}>Sign out</button>
      </form>
    </AuthLayout>
  );
}
