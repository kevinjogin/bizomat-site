import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post, setCsrfToken } from '../lib/api';
import { useConfig, useSession } from '../lib/session';
import { BrandMark, Icon, Wordmark } from '../components/ui/Icon';
import { BRAND, pageTitle } from '../lib/brand';
import { Field, Loading } from '../components/ui/ui';

const OAUTH_ERRORS: Record<string, string> = {
  invalid_state: 'The sign-in request expired or was tampered with. Please try again.',
  expired_state: 'The sign-in request expired. Please try again.',
  exchange_failed: 'Google sign-in failed. Please try again.',
  email_not_verified: 'Your Google email address is not verified.',
  signup_disabled: 'Sign-up is by invitation only. Ask a workspace admin to invite you.',
  provider_unavailable: 'That sign-in method is not configured.',
  account_disabled: 'This account is disabled.',
};

function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const config = useConfig();
  useEffect(() => {
    document.title = pageTitle(title);
  }, [title, config.data?.appName]);
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="row" style={{ marginBottom: 20 }}>
          <BrandMark size={34} /> <Wordmark size={19} />
          {config.data && config.data.environment !== 'production' ? <span className="badge warning">{config.data.environment}</span> : null}
        </div>
        <h1>{title}</h1>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
        <div style={{ marginTop: 16 }}>{children}</div>
        <p className="muted small" style={{ marginTop: 20, textAlign: 'center' }}>{BRAND.product} is part of <strong style={{ color: 'var(--brand)', letterSpacing: '.06em' }}>{BRAND.company}</strong></p>
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
      <a className="btn block lg" href={`/api/auth/oauth/google/start?next=${encodeURIComponent(next)}`}>
        <Icon name="globe" /> Continue with Google
      </a>
      <div className="divider">or</div>
    </>
  );
}

export function LoginPage() {
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(params.get('error') ? OAUTH_ERRORS[params.get('error')!] ?? 'Sign-in failed' : null);
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
    try {
      const s = await post('/auth/login', { email, password });
      setCsrfToken(s.csrfToken);
      qc.setQueryData(['me'], s);
      navigate(next, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout title="Sign in" subtitle="Welcome back. Sign in to your workspace.">
      <ProviderButtons next={next} />
      <form onSubmit={submit} noValidate>
        <Field label="Email" htmlFor="email">
          <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" htmlFor="password">
          <input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error ? <div className="error-box" role="alert" style={{ marginBottom: 12 }}>{error}</div> : null}
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
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const s = await post('/auth/signup', { name, email, password });
      setCsrfToken(s.csrfToken);
      qc.setQueryData(['me'], s);
      navigate(next, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout title="Create your account" subtitle="Start organising your team's work in minutes.">
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
  const inv = useQuery({ queryKey: ['invite', token], queryFn: () => get(`/auth/invitations/${token}`), retry: false });
  if (inv.isLoading) return <Loading />;
  if (inv.error) return <AuthLayout title="Invitation not found"><p className="muted">This invitation link is invalid.</p><Link to="/login">Go to sign in</Link></AuthLayout>;
  const d = inv.data;
  const accept = async () => {
    try {
      const r = await post(`/auth/invitations/${token}/accept`);
      await refresh();
      navigate(`/w/${r.workspaceId}/home`);
    } catch (e) {
      setError(errorMessage(e));
    }
  };
  return (
    <AuthLayout title={`Join ${d.workspaceName}`} subtitle={`${d.inviterName} invited ${d.email} as ${d.role}.`}>
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
