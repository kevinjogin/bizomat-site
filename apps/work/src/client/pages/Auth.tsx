import { ROLE_LABELS } from '../../shared/permissions';
import type { WorkspaceRole } from '../../shared/types';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post, setCsrfToken } from '../lib/api';
import { useConfig, useSession } from '../lib/session';
import { Icon, ProductLockup } from '../components/ui/Icon';
import { PlatformLegalLinks } from '../components/layout/PlatformLinks';
import { BRAND, pageTitle } from '../lib/brand';
import { Field, Loading } from '../components/ui/ui';
import { appUrl } from '../lib/base';

const OAUTH_ERRORS: Record<string, string> = {
  invalid_state: 'The sign-in request expired or was tampered with. Please try again.',
  expired_state: 'The sign-in request expired. Please try again.',
  exchange_failed: 'Google sign-in failed. Please try again.',
  email_not_verified: 'Your Google email address is not verified.',
  signup_disabled: 'Sign-up is by invitation only. Ask a workspace admin to invite you.',
  provider_unavailable: 'That sign-in method is not configured.',
  account_disabled: 'This account is disabled.',
  email_not_allowed: 'This email address cannot be used here. Use your work or personal email address.',
  email_unverified: 'Confirm your email address first: we have sent you a link. Open it, then sign in.',
};

/** Asks for a new confirmation link; the answer is the same whether or not the address has an account. */
function ResendLink({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'error'>('idle');
  const [msg, setMsg] = useState<string | null>(null);
  const resend = async () => {
    setState('busy');
    try {
      await post('/auth/verify-email/resend', { email });
      setState('sent');
    } catch (e) {
      setMsg(errorMessage(e));
      setState('error');
    }
  };
  if (state === 'sent') return <p className="muted small">If {email} still needs confirming, a new link is on its way. It can take a minute; check the spam folder too.</p>;
  return (
    <p className="muted small">
      No email?{' '}
      <button type="button" className="btn ghost sm" onClick={resend} disabled={state === 'busy'}>
        {state === 'busy' ? 'Sending…' : 'Send the link again'}
      </button>
      {msg ? <span className="error"> {msg}</span> : null}
    </p>
  );
}

/** After sign-up, when the address must be confirmed before signing in. */
function CheckInbox({ email }: { email: string }) {
  return (
    <AuthLayout title="Check your inbox" subtitle={`We sent a link to ${email}.`}>
      <div className="info-box" role="status">
        Open the link in that email to confirm your address, then sign in. The link works for 24 hours. This keeps accounts to real, reachable email
        addresses.
      </div>
      <div className="auth-gap" />
      <ResendLink email={email} />
      <Link className="btn block lg" to={`/login?email=${encodeURIComponent(email)}`}>Go to sign in</Link>
    </AuthLayout>
  );
}

/** The page the confirmation link opens (/verify-email?token=...). */
export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<{ ok: boolean; email?: string; error?: string } | null>(null);
  useEffect(() => {
    let live = true;
    post<{ ok: boolean; email: string }>('/auth/verify-email', { token })
      .then((r) => live && setState({ ok: true, email: r.email }))
      .catch((e) => live && setState({ ok: false, error: errorMessage(e) }));
    return () => {
      live = false;
    };
  }, [token]);
  if (!state) return <Loading label="Confirming your email address…" />;
  return state.ok ? (
    <AuthLayout title="Email address confirmed" subtitle={`${state.email} is confirmed.`}>
      <Link className="btn primary block lg" to={`/login?email=${encodeURIComponent(state.email ?? '')}`}>Sign in</Link>
    </AuthLayout>
  ) : (
    <AuthLayout title="This link did not work">
      <div className="error-box" role="alert">{state.error}</div>
      <div className="auth-gap" />
      <Link className="btn block lg" to="/login">Go to sign in</Link>
    </AuthLayout>
  );
}

function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const config = useConfig();
  useEffect(() => {
    document.title = pageTitle(title);
  }, [title]);
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-brand">
          <ProductLockup height={20} />
          <span className="spacer" />
          {config.data && config.data.environment !== 'production' ? <span className="badge warning">{config.data.environment}</span> : null}
        </div>
        <h1>{title}</h1>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
        <div style={{ marginTop: 16 }}>{children}</div>
        <footer className="auth-foot">
          <span>Part of the {BRAND.platform} platform</span>
          <PlatformLegalLinks />
          <Link to="/privacy">How {BRAND.product} uses your data</Link>
          <span>{BRAND.copyright}</span>
        </footer>
      </div>
    </div>
  );
}

function ProviderButtons({ next }: { next: string }) {
  const config = useConfig();
  const google = config.data?.providers.find((p) => p.id === 'google');
  if (!google?.enabled) return null;
  return (
    <>
      <a className="btn block lg" href={appUrl(`/api/auth/oauth/google/start?next=${encodeURIComponent(next)}`)}>
        <Icon name="globe" /> Continue with Google
      </a>
      <div className="divider">or</div>
    </>
  );
}

export function LoginPage() {
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(params.get('error') ? OAUTH_ERRORS[params.get('error')!] ?? 'Sign-in failed' : null);
  const [unconfirmed, setUnconfirmed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { session } = useSession();
  const config = useConfig();
  useEffect(() => {
    if (session) navigate(next, { replace: true });
  }, [session, next, navigate]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setUnconfirmed(null);
    try {
      const s = await post('/auth/login', { email, password });
      setCsrfToken(s.csrfToken);
      qc.setQueryData(['me'], s);
      navigate(next, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && (err.details as { code?: string; email?: string } | undefined)?.code === 'EMAIL_UNVERIFIED') setUnconfirmed((err.details as { email?: string }).email ?? email);
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout title={`Sign in to ${BRAND.platform}`} subtitle={`Welcome back. Sign in to your ${BRAND.product} workspace.`}>
      <ProviderButtons next={next} />
      <form onSubmit={submit} noValidate>
        <Field label="Email" htmlFor="email">
          <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" htmlFor="password">
          <input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error ? <div className={unconfirmed ? 'info-box' : 'error-box'} role="alert" style={{ marginBottom: 12 }}>{error}</div> : null}
        {unconfirmed ? <ResendLink email={unconfirmed} /> : null}
        <button className="btn primary block lg" disabled={busy || !email || !password}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      {config.data?.allowSignup ? (
        <p className="muted small" style={{ marginTop: 16, textAlign: 'center' }}>
          New here? <Link to={`/signup${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`}>Create an account</Link>
        </p>
      ) : (
        <p className="muted small" style={{ marginTop: 16, textAlign: 'center' }}>Accounts are created by invitation.</p>
      )}
    </AuthLayout>
  );
}

export function SignupPage() {
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Signing up from an invitation link: the token joins the invited organisation (src/worker/routes/auth.ts).
      const inviteToken = /^\/invite\/([A-Za-z0-9_-]{10,200})$/.exec(next)?.[1];
      const s = await post('/auth/signup', { name, email, password, ...(inviteToken ? { inviteToken } : {}), ...(website ? { website } : {}) });
      if (s.verificationRequired) {
        setSentTo(s.email);
        return;
      }
      setCsrfToken(s.csrfToken);
      qc.setQueryData(['me'], s);
      navigate(s.joinedWorkspaceId ? `/w/${s.joinedWorkspaceId}/home` : next, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  if (sentTo) return <CheckInbox email={sentTo} />;
  return (
    <AuthLayout title={`Create your ${BRAND.platform} account`} subtitle={`Start organising your team's work in ${BRAND.product}.`}>
      <ProviderButtons next={next} />
      <form onSubmit={submit} noValidate>
        <Field label="Full name" htmlFor="name">
          <input id="name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
        </Field>
        <Field label="Work email" htmlFor="email">
          <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 10 characters, with letters and a number or symbol.">
          <input id="password" className="input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} />
        </Field>
        {/* Hidden from people (and from screen readers): only form-filling robots fill it in. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        {error ? <div className="error-box" role="alert" style={{ marginBottom: 12 }}>{error}</div> : null}
        <button className="btn primary block lg" disabled={busy || !name || !email || password.length < 10}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="muted small" style={{ marginTop: 16, textAlign: 'center' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

export function InvitePage() {
  const { token } = useParams();
  const { session, refresh } = useSession();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const linkCheck = token === 'link-check';
  const inv = useQuery({ queryKey: ['invite', token], queryFn: () => get(`/auth/invitations/${token}`), retry: false, enabled: !linkCheck });
  if (linkCheck) {
    // The target of the "Check an email link" button in test emails: shows where the link really arrived.
    const here = `${window.location.origin}${window.location.pathname}`;
    return (
      <AuthLayout title="Email links work" subtitle="This page was opened from a BIZOMAT email link.">
        <div className="info-box" role="status">
          You arrived at <strong style={{ wordBreak: 'break-all' }}>{here}</strong>. Invitation links in emails open this same page with the invitation’s own code instead of “link-check”.
        </div>
        <p className="muted small" style={{ marginTop: 12 }}>If the address above does not start with the BIZOMAT address you expected, check the link tracking settings of the email service (founder console, Email).</p>
        <Link className="btn block lg" to="/login">Go to sign in</Link>
      </AuthLayout>
    );
  }
  if (inv.isLoading) return <Loading />;
  if (inv.error) return <AuthLayout title="Invitation not found"><p className="muted">This invitation link is invalid.</p><Link to="/login">Go to sign in</Link></AuthLayout>;
  const d = inv.data;
  const accept = async () => {
    try {
      const r = await post(`/auth/invitations/${token}/accept`);
      await refresh();
      // An invitation to one task opens that task; otherwise the organisation's home.
      navigate(r.itemId ? `/w/${r.workspaceId}/tasks/${r.itemId}` : `/w/${r.workspaceId}/home`);
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  return (
    <AuthLayout title={`Join ${d.workspaceName}`} subtitle={`${d.inviterName} invited ${d.email} as ${ROLE_LABELS[d.role as WorkspaceRole] ?? d.role}.`}>
      {d.status !== 'pending' ? <div className="info-box">This invitation is {d.status}.</div> : session ? (
        <>
          {session.user.email.toLowerCase() !== d.email.toLowerCase() ? (
            <div className="error-box" style={{ marginBottom: 12 }}>You are signed in as {session.user.email}. Sign in as {d.email} to accept.</div>
          ) : null}
          {error ? <div className="error-box" style={{ marginBottom: 12 }}>{error}</div> : null}
          <button className="btn primary block lg" onClick={accept}>Accept invitation</button>
        </>
      ) : (
        <div className="col">
          <Link className="btn primary block lg" to={`/signup?email=${encodeURIComponent(d.email)}&next=${encodeURIComponent(`/invite/${token}`)}`}>Create account to join</Link>
          <Link className="btn block" to={`/login?next=${encodeURIComponent(`/invite/${token}`)}`}>I already have an account</Link>
        </div>
      )}
    </AuthLayout>
  );
}
