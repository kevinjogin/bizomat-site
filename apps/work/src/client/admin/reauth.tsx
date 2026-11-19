// Re-authentication for dangerous actions (Admin Control Centre, R2). The server answers 403 REAUTH_REQUIRED when an
// action needs the password and a code from the last 10 minutes; useReauth runs an action, asks for both when needed,
// confirms them with /admin/platform/security/reauth and runs the action again.
import { useRef, useState } from 'react';
import { ApiError, errorMessage, post } from '../lib/api';
import { Modal } from '../components/ui/overlays';
import { Field } from '../components/ui/ui';

export const codeOf = (e: unknown): string | undefined => (e instanceof ApiError ? ((e.details as { code?: string } | undefined)?.code ?? undefined) : undefined);

export function useReauth() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef<{ fn: () => Promise<unknown>; resolve: (v: unknown) => void; reject: (e: unknown) => void } | null>(null);

  /** Runs fn; when the server asks for a re-authentication, asks for it and runs fn again. */
  const run = <T,>(fn: () => Promise<T>): Promise<T> =>
    fn().catch((e) => {
      if (codeOf(e) !== 'REAUTH_REQUIRED') throw e;
      return new Promise<T>((resolve, reject) => {
        pending.current = { fn, resolve: resolve as (v: unknown) => void, reject };
        setPassword('');
        setCode('');
        setError(null);
        setOpen(true);
      });
    });

  const close = () => {
    setOpen(false);
    pending.current?.reject(new Error('Cancelled'));
    pending.current = null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post('/admin/platform/security/reauth', { password, code: code.replace(/\s/g, '') });
      const p = pending.current!;
      pending.current = null;
      setOpen(false);
      setPassword('');
      p.fn().then(p.resolve, p.reject);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const dialog = open ? (
    <Modal title="Confirm it is you" onClose={close}>
      <form className="ac-form ac-stack" onSubmit={submit}>
        <p className="muted small">This change needs your password and a code from your authenticator app. It stays confirmed for 10 minutes.</p>
        <Field label="Password" htmlFor="reauth-password">
          <input id="reauth-password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Field label="Code from your authenticator app" htmlFor="reauth-code" error={error}>
          <input id="reauth-code" className="input" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value)} required />
        </Field>
        <div className="row">
          <button className="btn primary" type="submit" disabled={busy}>Confirm</button>
          <button className="btn ghost" type="button" onClick={close}>Cancel</button>
        </div>
      </form>
    </Modal>
  ) : null;

  return { run, dialog };
}
