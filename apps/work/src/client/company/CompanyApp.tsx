// The company area, served under /company by the same SPA and API as the tools, on the same sign-in: register a company
// (or work in one you were invited to), then see and manage its people, departments and tools in one place. Routes
// (inside the /company base): /, /new, /join/:token, /confirm-email, /authorize, /c/:companyId/<page>.
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post } from '../lib/api';
import { useSession } from '../lib/session';
import { appUrl, SUITE, toolUrl } from '../lib/base';
import { applyTheme, storedTheme, usePageTitle, type ThemePref } from '../lib/hooks';
import { BRAND, PLATFORM_URLS } from '../lib/brand';
import { BrandMark, Icon, ProductLockup } from '../components/ui/Icon';
import { Avatar, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, useToast } from '../components/ui/overlays';
import { PlatformFooter } from '../components/layout/PlatformLinks';
import { COMPANY_ROLE_LABELS, TOOL_APPS, TOOL_ICONS, TOOL_NAMES, abnLabel, lastCompany, rememberCompany, toolHref, useCompany, useMine } from './lib';
import { Register } from './Register';
import '../styles/crm.css';
import '../styles/fin.css';
import '../styles/company.css';
import { SUITE_SHELL, SuiteRail } from '../components/layout/SuiteRail';

const Overview = lazy(() => import('./Pages').then((m) => ({ default: m.Overview })));
const People = lazy(() => import('./Pages').then((m) => ({ default: m.People })));
const Departments = lazy(() => import('./Pages').then((m) => ({ default: m.Departments })));
const Tools = lazy(() => import('./Pages').then((m) => ({ default: m.Tools })));
const Settings = lazy(() => import('./Pages').then((m) => ({ default: m.Settings })));
const Activity = lazy(() => import('./Pages').then((m) => ({ default: m.Activity })));
const Projects = lazy(() => import('./Pages').then((m) => ({ default: m.Projects })));

function page(el: ReactNode) {
  return <Suspense fallback={<Loading />}>{el}</Suspense>;
}

/** The company area's routes for signed-in people (App.tsx gives the sign-in pages and the session gate). */
export function CompanyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CompanyHome />} />
      <Route path="/new" element={<Register />} />
      <Route path="/authorize" element={<Authorize />} />
      <Route path="/c/:companyId/*" element={<CompanyArea />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** "/": the last company used, else the only one, else the list (with invitations and Register). */
function CompanyHome() {
  usePageTitle('Your companies');
  const q = useMine();
  const { session } = useSession();
  const toast = useToast();
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data) return <Loading label={`Loading ${BRAND.full}…`} />;
  const { companies, invitations } = q.data;
  const last = companies.find((c) => c.id === lastCompany());
  if (!invitations.length && (last || companies.length === 1)) return <Navigate to={`/c/${(last ?? companies[0]).id}/overview`} replace />;
  return (
    <div className={`crm-start${SUITE_SHELL ? ' in-suite' : ''}`}>
      <SuiteRail />
      <header className="row crm-start-head">
        <ProductLockup height={18} />
        <span className="grow" />
        <span className="muted small">{session?.user.email}</span>
      </header>
      <div className="page crm-page">
        <PageHeader title="Your companies" subtitle="Work as your company: its people, departments and tools, with one sign-in for Project Management, the CRM and Finance." />
        {invitations.length ? (
          <section className="card card-pad stack">
            <h2 className="crm-subhead">Invitations for {session?.user.email}</h2>
            {invitations.map((i) => (
              <div key={i.id} className="row wrap crm-invite-row">
                <div className="grow">
                  <strong>{i.company}</strong> as {COMPANY_ROLE_LABELS[i.role as 'admin' | 'member'] ?? i.role}
                  <div className="muted small">{i.inviter ? `From ${i.inviter}. ` : ''}Open the link in the invitation email to accept.</div>
                </div>
              </div>
            ))}
          </section>
        ) : null}
        {companies.length ? (
          <div className="grid-cards">
            {companies.map((c) => (
              <Link key={c.id} to={`/c/${c.id}/overview`} className="tile">
                <div className="row">
                  <span className="crm-org-logo crm-org-initial" aria-hidden>{c.name[0]?.toUpperCase()}</span>
                  <strong className="ellipsis">{c.name}</strong>
                </div>
                <span className="muted small">
                  {COMPANY_ROLE_LABELS[c.role]} · {c.memberCount} {c.memberCount === 1 ? 'person' : 'people'} · {abnLabel({ abnStatus: c.abnStatus, kind: c.kind as 'business' | 'individual' }).text}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <section className="card card-pad stack co-empty">
            <h2 className="crm-subhead">Set up your company account</h2>
            <p>BIZOMAT works as a company. Register your business with its ABN, or yourself if you work in your own name. Your Project Management workspace, CRM and Finance then work together, and the people you invite sign in once for all of them.</p>
          </section>
        )}
        <div className="row">
          <Link to="/new" className="btn primary">
            <Icon name="plus" /> Register a company
          </Link>
          <button className="btn ghost" onClick={() => q.refetch().then(() => toast('Up to date'))}>Refresh</button>
        </div>
      </div>
    </div>
  );
}

interface NavEntry {
  to: string;
  label: string;
  icon: string;
  admin?: boolean;
}

const NAV: NavEntry[] = [
  { to: 'overview', label: 'Overview', icon: 'home' },
  { to: 'departments', label: 'Departments', icon: 'layers' },
  { to: 'people', label: 'People', icon: 'users' },
  { to: 'projects', label: 'Projects', icon: 'target' },
  { to: 'tools', label: 'Tools', icon: 'grid' },
  { to: 'activity', label: 'Activity', icon: 'list', admin: true },
  { to: 'settings', label: 'Company settings', icon: 'settings' },
];

function CompanyArea() {
  const { companyId = '' } = useParams();
  const q = useCompany(companyId);
  useEffect(() => {
    if (q.data) rememberCompany(q.data.company.id);
  }, [q.data]);
  if (q.error) {
    if (q.error instanceof ApiError && q.error.status === 404) return <Navigate to="/" replace />;
    return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  }
  if (!q.data) return <Loading label="Opening the company…" />;
  return (
    <CompanyShell>
      <Routes>
        <Route path="overview" element={page(<Overview />)} />
        <Route path="departments" element={page(<Departments />)} />
        <Route path="people" element={page(<People />)} />
        <Route path="tools" element={page(<Tools />)} />
        <Route path="projects" element={page(<Projects />)} />
        <Route path="activity" element={page(<Activity />)} />
        <Route path="settings" element={page(<Settings />)} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </CompanyShell>
  );
}

function CompanyShell({ children }: { children: ReactNode }) {
  const view = useCompany().data!;
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const base = `/c/${view.company.id}`;
  const admin = view.me.role !== 'member';
  useEffect(() => setNavOpen(false), [location.pathname]);
  return (
    <div className={`shell crm-shell co-shell${SUITE_SHELL ? ' in-suite' : ''}${navOpen ? ' nav-open' : ''}`}>
      <SuiteRail />
      <header className="topbar">
        <button className="btn ghost icon mobile-only" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
          <Icon name="menu" />
        </button>
        <Link to={`${base}/overview`} className="brand" aria-label={`${BRAND.full} home`}>
          <span className="mobile-only"><BrandMark size={28} /></span>
          <span className="desktop-only"><ProductLockup height={15} /></span>
        </Link>
        <CompanySwitcher />
        <div className="spacer" />
        <ThemeButton />
        <Profile />
      </header>
      <nav className="sidebar" aria-label="Company navigation">
        {NAV.filter((n) => !n.admin || admin).map((n) => (
          <NavLink key={n.to} to={`${base}/${n.to}`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon name={n.icon} /> {n.label}
          </NavLink>
        ))}
        <div className="nav-section">Open a tool</div>
        {TOOL_APPS.map((app) => {
          const t = view.tools[app];
          if (!t || !t.myRole) return null;
          return (
            <a key={app} className="nav-item" href={toolHref(app, t.id)}>
              <Icon name={TOOL_ICONS[app]} /> {TOOL_NAMES[app]}
            </a>
          );
        })}
        <a className="nav-item" href={PLATFORM_URLS.cad}>
          <Icon name="diamond" /> CAD Automation
        </a>
        <PlatformFooter />
      </nav>
      <main className="main" id="main">
        {children}
      </main>
    </div>
  );
}

function CompanySwitcher() {
  const view = useCompany().data!;
  const mine = useMine();
  const navigate = useNavigate();
  return (
    <Dropdown
      width={300}
      label="Companies"
      trigger={(open, ref) => (
        <button ref={ref} className="btn ws-switcher crm-org-switcher" onClick={open} aria-label={`Company: ${view.company.name}. Switch company`}>
          <span className="crm-org-logo crm-org-initial" aria-hidden>{view.company.name[0]?.toUpperCase()}</span>
          <span className="ellipsis">{view.company.name}</span>
          <Icon name="chevronDown" size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="menu-label">Your companies</div>
          {(mine.data?.companies ?? []).map((c) => (
            <MenuItem key={c.id} active={c.id === view.company.id} onClick={() => { close(); navigate(`/c/${c.id}/overview`); }}>
              <span className="grow ellipsis">{c.name}</span>
              <span className="muted small">{COMPANY_ROLE_LABELS[c.role]}</span>
            </MenuItem>
          ))}
          <MenuSep />
          <MenuItem icon="plus" onClick={() => { close(); navigate('/new'); }}>Register another company</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

function ThemeButton() {
  const [pref, setPref] = useState<ThemePref>(storedTheme());
  return (
    <Dropdown align="end" label="Theme" trigger={(open, ref) => <button ref={ref} className="btn ghost icon desktop-only" aria-label="Theme" onClick={open}><Icon name={document.documentElement.dataset.theme === 'dark' ? 'moon' : 'sun'} /></button>}>
      {(close) => (
        <>
          {(['light', 'dark', 'system'] as ThemePref[]).map((p) => (
            <MenuItem key={p} icon={p === 'light' ? 'sun' : p === 'dark' ? 'moon' : 'settings'} active={pref === p} onClick={() => { close(); setPref(p); applyTheme(p); }}>
              {p === 'system' ? 'Match this computer' : p[0].toUpperCase() + p.slice(1)}
            </MenuItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}

function Profile() {
  const { session } = useSession();
  const view = useCompany().data!;
  const qc = useQueryClient();
  const toast = useToast();
  const user = session!.user;
  const signOut = async () => {
    try {
      await post('/auth/logout');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
    qc.clear();
    window.location.href = appUrl('/login');
  };
  return (
    <Dropdown align="end" width={240} trigger={(open, ref) => <button ref={ref} className="btn ghost icon" aria-label="Profile menu" onClick={open}><Avatar name={user.name} id={user.id} url={user.avatarUrl} /></button>}>
      {(close) => (
        <>
          <div className="crm-pad">
            <div><strong>{user.name}</strong></div>
            <div className="muted small ellipsis">{user.email}</div>
            <div className="muted small">{view.me.roleLabel} of {view.company.name}</div>
          </div>
          <MenuItem icon="user" onClick={() => { close(); window.location.href = toolUrl('/tasks/settings/profile'); }}>Profile and security</MenuItem>
          {session?.platformRole ? <MenuItem icon="chart" onClick={() => { close(); window.location.href = SUITE ? '/system/admin/overview' : '/tasks/admin'; }}>Super admin console</MenuItem> : null}
          <MenuSep />
          <MenuItem icon="logout" onClick={() => { close(); void signOut(); }}>Sign out</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

// ------------------------------------------------------------------ public pages

/** /join/:token: an invitation, shown before sign-in; accepted once signed in as the invited address. */
export function Join() {
  usePageTitle('Invitation');
  const { token = '' } = useParams();
  const { session } = useSession();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const q = useQuery({ queryKey: ['company', 'invite', token], queryFn: () => get<{ company: string; inviter: string | null; roleLabel: string; tools: string; status: string; emailHint: string; hasAccount: boolean }>(`/company-public/invitations/${encodeURIComponent(token)}`), retry: false });
  const accept = async () => {
    setBusy(true);
    try {
      const r = await post<{ companyId: string }>(`/company/invitations/${encodeURIComponent(token)}/accept`);
      await qc.invalidateQueries({ queryKey: ['company'] });
      navigate(`/c/${r.companyId}/overview`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const decline = async () => {
    await post(`/company/invitations/${encodeURIComponent(token)}/decline`).catch((e) => toast(errorMessage(e), 'error'));
    navigate('/');
  };
  const next = encodeURIComponent(`/join/${token}`);
  return (
    <div className="crm-start">
      <header className="row crm-start-head"><ProductLockup height={18} /></header>
      <div className="page crm-page">
        {q.error ? (
          <section className="card card-pad stack crm-start-form"><h1 className="crm-subhead">This invitation was not found</h1><p>Ask the person who invited you for a new link.</p></section>
        ) : !q.data ? (
          <Loading />
        ) : (
          <section className="card card-pad stack crm-start-form">
            <h1 className="crm-subhead">Join {q.data.company} on BIZOMAT</h1>
            <p>
              {q.data.inviter ? `${q.data.inviter} invited ` : 'You were invited '}
              {q.data.emailHint} as {q.data.roleLabel}. Tools: {q.data.tools}.
            </p>
            {q.data.status !== 'pending' ? (
              <p className="warning-text">This invitation has {q.data.status === 'accepted' ? 'already been accepted' : q.data.status === 'expired' ? 'expired' : 'been withdrawn'}.</p>
            ) : session ? (
              <div className="row">
                <button className="btn primary" disabled={busy} onClick={accept}>{busy ? 'Joining…' : `Join ${q.data.company}`}</button>
                <button className="btn ghost" onClick={decline}>Decline</button>
                <span className="muted small">Signed in as {session.user.email}</span>
              </div>
            ) : (
              <div className="row">
                <Link className="btn primary" to={`/login?next=${next}`}>Sign in to accept</Link>
                {q.data.hasAccount ? null : <Link className="btn" to={`/signup?next=${next}`}>Create your account</Link>}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

/** /confirm-email?token=: confirms a company's contact address (works without signing in). */
export function ConfirmEmail() {
  usePageTitle('Confirm the contact address');
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    if (!token) {
      setState({ ok: false, text: 'This link has no confirmation code.' });
      return;
    }
    post<{ company: string }>('/company-public/confirm-email', { token })
      .then((r) => setState({ ok: true, text: `The contact address of ${r.company} is confirmed.` }))
      .catch((e) => setState({ ok: false, text: errorMessage(e) }));
  }, [token]);
  return (
    <div className="crm-start">
      <header className="row crm-start-head"><ProductLockup height={18} /></header>
      <div className="page crm-page">
        <section className="card card-pad stack crm-start-form">
          <h1 className="crm-subhead">Confirm the company’s contact address</h1>
          {state ? <p className={state.ok ? '' : 'warning-text'}>{state.text}</p> : <Loading />}
          <Link to="/" className="btn">Go to your companies</Link>
        </section>
      </div>
    </div>
  );
}

/** /authorize: another BIZOMAT application (CAD Automation) asks to sign you in with your BIZOMAT account. */
function Authorize() {
  usePageTitle('Sign in with BIZOMAT');
  const [params] = useSearchParams();
  const { session } = useSession();
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const clientId = params.get('client_id') ?? '';
  const redirectUri = params.get('redirect_uri') ?? '';
  const q = useQuery({ queryKey: ['id-client', clientId, redirectUri], queryFn: () => get<{ name: string }>(`/company/id/client?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}`), retry: false });
  const go = async (deny: boolean) => {
    setBusy(true);
    try {
      const r = await post<{ redirect: string }>('/company/id/authorize', {
        clientId,
        redirectUri,
        state: params.get('state') ?? '',
        codeChallenge: params.get('code_challenge') ?? '',
        codeChallengeMethod: params.get('code_challenge_method') ?? '',
        scope: params.get('scope') ?? undefined,
        deny,
      });
      window.location.assign(r.redirect);
    } catch (e) {
      toast(errorMessage(e), 'error');
      setBusy(false);
    }
  };
  return (
    <div className={`crm-start${SUITE_SHELL ? ' in-suite' : ''}`}>
      <SuiteRail />
      <header className="row crm-start-head"><ProductLockup height={18} /></header>
      <div className="page crm-page">
        <section className="card card-pad stack crm-start-form">
          {q.error ? (
            <>
              <h1 className="crm-subhead">This sign-in request is not valid</h1>
              <p>{errorMessage(q.error)}</p>
            </>
          ) : !q.data ? (
            <Loading />
          ) : (
            <>
              <h1 className="crm-subhead">Sign in to {q.data.name} with BIZOMAT</h1>
              <p>
                {q.data.name} will receive your name, your email address ({session?.user.email}) and the companies you belong to. It does not receive your password.
              </p>
              <div className="row">
                <button className="btn primary" disabled={busy} onClick={() => go(false)}>Continue as {session?.user.name}</button>
                <button className="btn ghost" disabled={busy} onClick={() => go(true)}>Cancel</button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
