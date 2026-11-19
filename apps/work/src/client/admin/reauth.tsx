// Re-authentication for dangerous actions (Admin Control Centre, R2). The server answers 403 REAUTH_REQUIRED when an
// action needs the password and a code from the last 10 minutes. ReauthHost, mounted once by each console, registers
// with the request helper (src/client/lib/api.ts): it asks for both, confirms them with
// /admin/platform/security/reauth, and the request helper sends the action again. Every screen gets this without
// changes of its own.
import { useEffect, useRef, useState } from 'react';
import { ApiError, errorMessage, post, setReauthHandler } from '../lib/api';
import { Modal } from '../components/ui/overlays';
import { Field } from '../components/ui/ui';

export const codeOf = (e: unknown): string | undefined => (e instanceof ApiError ? ((e.details as { code?: string } | undefined)?.code ?? undefined) : undefined);

export function ReauthHost() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef<((ok: boolean) => void) | null>(null);

  useEffect(() => {
    setReauthHandler(
      () =>
        new Promise<boolean>((resolve) => {
          pending.current?.(false);
          pending.current = resolve;
          setPassword('');
          setCode('');
          setError(null);
          setOpen(true);
        }),
    );
    return () => setReauthHandler(null);
  }, []);

  const finish = (ok: boolean) => {
    setOpen(false);
    setPassword('');
    pending.current?.(ok);
    pending.current = null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post('/admin/platform/security/reauth', { password, code: code.replace(/\s/g, '') });
      finish(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;
  return (
    <Modal title="Confirm it is you" onClose={() => finish(false)}>
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
          <button className="btn ghost" type="button" onClick={() => finish(false)}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

/** For pages written before ReauthHost: the request helper now asks and retries, so run only calls the action. */
export function useReauth() {
  return { run: <T,>(fn: () => Promise<T>) => fn(), dialog: null as null };
}
