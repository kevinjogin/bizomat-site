// BIZOMAT CRM: the app served under /crm by the same SPA and API as Project Management, on the same sign-in.
// Routes (inside the /crm base): /, /start, /join/:token, /o/:orgId/<page>. The sign-in pages are the shared ones.
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post } from '../lib/api';
import { appUrl } from '../lib/base';
import { useSession } from '../lib/session';
import { applyTheme, storedTheme, useDebounced, usePageTitle, useShortcut, type ThemePref } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { BRAND, PLATFORM_URLS } from '../lib/brand';
import { BrandMark, Icon, ProductLockup } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, Popover, useToast } from '../components/ui/overlays';
import { PlatformFooter } from '../components/layout/PlatformLinks';
import { CompanyPrompt } from '../components/layout/CompanyPrompt';
import { CURRENCIES } from '../../shared/money';
import { CRM_ROLE_LABELS } from '../../shared/crm/roles';
import type { CrmNotificationDTO } from '../../shared/crm/types';
import { crm, lastOrg, recordPath, rememberOrg, useOrg, useOrgs } from './lib';
import { Chip } from './ui';
import '../styles/crm.css';

const Overview = lazy(() => import('./Insights').then((m) => ({ default: m.Overview })));
const Reports = lazy(() => import('./Insights').then((m) => ({ default: m.Reports })));
const RecordListPage = lazy(() => import('./RecordList').then((m) => ({ default: m.RecordList })));
const RecordPage = lazy(() => import('./RecordPage').then((m) => ({ default: m.RecordPage })));
const DealsPage = lazy(() => import('./Deals').then((m) => ({ default: m.DealsPage })));
const ActivitiesPage = lazy(() => import('./Activities').then((m) => ({ default: m.ActivitiesPage })));
const ActivityPage = lazy(() => import('./Activities').then((m) => ({ default: m.ActivityPage })));
const CalendarPage = lazy(() => import('./Activities').then((m) => ({ default: m.CalendarPage })));
const Automations = lazy(() => import('./Automations').then((m) => ({ default: m.Automations })));
const Team = lazy(() => import('./Team').then((m) => ({ default: m.Team })));
const Settings = lazy(() => import('./Settings').then((m) => ({ default: m.Settings })));

const NAV: { to: string; label: string; icon: string; show?: (perms: any) => boolean }[] = [
  { to: 'overview', label: 'Overview', icon: 'home' },
  { to: 'leads', label: 'Leads', icon: 'funnel', show: (p) => p.leads.view !== 'none' },
  { to: 'contacts', label: 'Contacts', icon: 'user', show: (p) => p.contacts.view !== 'none' },
  { to: 'companies', label: 'Companies', icon: 'building', show: (p) => p.companies.view !== 'none' },
  { to: 'deals', label: 'Deals', icon: 'dollar', show: (p) => p.deals.view !== 'none' },
  { to: 'activities', label: 'Activities', icon: 'activity', show: (p) => p.activities.view !== 'none' },
  { to: 'calendar', label: 'Calendar', icon: 'calendar', show: (p) => p.activities.view !== 'none' },
  { to: 'tasks', label: 'Tasks', icon: 'checkSquare', show: (p) => p.activities.view !== 'none' },
  { to: 'reports', label: 'Reports', icon: 'chart', show: (p) => p.reports.view },
  { to: 'automations', label: 'Automations', icon: 'bolt', show: (p) => p.automations.view },
  { to: 'team', label: 'Team', icon: 'users' },
  { to: 'settings', label: 'Settings', icon: 'settings' },
];

function page(el: ReactNode) {
  return <Suspense fallback={<Loading />}>{el}</Suspense>;
}

/** The CRM's routes, for the signed-in area (App.tsx gives the sign-in pages and the session gate). */
export function CrmRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CrmHome />} />
      <Route path="/start" element={<Start />} />
      <Route path="/o/:orgId/*" element={<OrgArea />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** "/": the last organisation used, else the first, else the start page. */
function CrmHome() {
  const q = useOrgs();
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data) return <Loading label={`Loading ${BRAND.full}…`} />;
  const last = lastOrg();
  const org = q.data.orgs.find((o) => o.id === last) ?? q.data.orgs[0];
  if (!org || q.data.invitations.length) return <Navigate to="/start" replace />;
  return <Navigate to={`/o/${org.id}/overview`} replace />;
}

function OrgArea() {
  const { orgId = '' } = useParams();
  const q = useOrg(orgId);
  useEffect(() => {
    if (q.data) rememberOrg(q.data.id);
  }, [q.data]);
  if (q.error) {
    if (q.error instanceof ApiError && q.error.status === 404) return <Navigate to="/" replace />;
    return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  }
  if (!q.data) return <Loading label="Opening the organisation…" />;
  return (
    <CrmShell>
      <Routes>
        <Route path="overview" element={page(<Overview />)} />
        <Route path="leads" element={page(<RecordListPage entity="lead" />)} />
        <Route path="leads/:id" element={page(<RecordPage entity="lead" />)} />
        <Route path="contacts" element={page(<RecordListPage entity="contact" />)} />
        <Route path="contacts/:id" element={page(<RecordPage entity="contact" />)} />
        <Route path="companies" element={page(<RecordListPage entity="company" />)} />
        <Route path="companies/:id" element={page(<RecordPage entity="company" />)} />
        <Route path="deals" element={page(<DealsPage />)} />
        <Route path="deals/:id" element={page(<RecordPage entity="deal" />)} />
        <Route path="activities" element={page(<ActivitiesPage />)} />
        <Route path="activities/:id" element={page(<ActivityPage />)} />
        <Route path="tasks" element={page(<ActivitiesPage tasks />)} />
        <Route path="calendar" element={page(<CalendarPage />)} />
        <Route path="reports" element={<Navigate to="pipeline" replace />} />
        <Route path="reports/:key" element={page(<Reports />)} />
        <Route path="automations" element={page(<Automations />)} />
        <Route path="team" element={page(<Team />)} />
        <Route path="settings" element={<Navigate to="notifications" replace />} />
        <Route path="settings/:tab" element={page(<Settings />)} />
        <Route path="search" element={<SearchPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </CrmShell>
  );
}

function CrmShell({ children }: { children: ReactNode }) {
  const org = useOrg().data!;
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const base = `/o/${org.id}`;
  useEffect(() => setNavOpen(false), [location.pathname]);
  useShortcut('mod+k', () => navigate(`${base}/search`));
  return (
    <div className={`shell crm-shell${navOpen ? ' nav-open' : ''}`}>
      <header className="topbar">
        <button className="btn ghost icon mobile-only" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
          <Icon name="menu" />
        </button>
        <Link to={`${base}/overview`} className="brand" aria-label={`${BRAND.full} home`}>
          <span className="mobile-only"><BrandMark size={28} /></span>
          <span className="desktop-only"><ProductLockup height={15} /></span>
        </Link>
        <OrgSwitcher />
        <TopSearch />
        <div className="spacer" />
        <Bell />
        <ThemeButton />
        <Profile />
      </header>
      <nav className="sidebar" aria-label="CRM navigation">
        {NAV.filter((n) => !n.show || n.show(org.perms)).map((n) => (
          <NavLink key={n.to} to={`${base}/${n.to}`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <Icon name={n.icon} /> {n.label}
          </NavLink>
        ))}
        <div className="nav-section">BIZOMAT</div>
        <a className="nav-item" href={PLATFORM_URLS.company}>
          <Icon name="building" /> Company
        </a>
        <a className="nav-item" href={PLATFORM_URLS.tasks}>
          <Icon name="grid" /> Project Management
        </a>
        <a className="nav-item" href={PLATFORM_URLS.crmGuide}>
          <Icon name="help" /> CRM user guide
        </a>
        <PlatformFooter />
      </nav>
      <main className="main" id="main">
        <CompanyPrompt />
        {children}
      </main>
    </div>
  );
}

function OrgSwitcher() {
  const org = useOrg().data!;
  const orgs = useOrgs();
  const navigate = useNavigate();
  const unread = useQuery({ queryKey: ['crm', 'unread'], queryFn: () => get<Record<string, number>>('/crm/notifications/unread'), refetchInterval: 60_000 });
  return (
    <Dropdown
      width={280}
      label="Organisations"
      trigger={(open, ref) => (
        <button ref={ref} className="btn ws-switcher crm-org-switcher" onClick={open} aria-label={`Organisation: ${org.name}. Switch organisation`}>
          {org.logoUrl ? <img src={appUrl(org.logoUrl)} alt="" className="crm-org-logo" /> : <span className="crm-org-logo crm-org-initial" aria-hidden>{org.name[0]}</span>}
          <span className="ellipsis">{org.name}</span>
          <Icon name="chevronDown" size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="menu-label">Your organisations</div>
          {(orgs.data?.orgs ?? []).map((o) => (
            <MenuItem key={o.id} active={o.id === org.id} onClick={() => { close(); navigate(`/o/${o.id}/overview`); }}>
              <span className="grow ellipsis">{o.name}</span>
              <span className="muted small">{CRM_ROLE_LABELS[o.role]}</span>
              {unread.data?.[o.id] ? <span className="badge danger">{unread.data[o.id]}</span> : null}
            </MenuItem>
          ))}
          <MenuSep />
          <MenuItem icon="plus" onClick={() => { close(); navigate('/start'); }}>Create or join an organisation</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

function TopSearch() {
  const org = useOrg().data!;
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <form className="crm-topsearch desktop-only" role="search" onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate(`/o/${org.id}/search?q=${encodeURIComponent(q.trim())}`); }}>
      <Icon name="search" />
      <input className="input" type="search" placeholder="Search the CRM" aria-label="Search the CRM" value={q} onChange={(e) => setQ(e.target.value)} />
    </form>
  );
}

function Bell() {
  const org = useOrg().data!;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const anchor = useState<HTMLButtonElement | null>(null);
  const q = useQuery({ queryKey: ['crm', org.id, 'notifications'], queryFn: () => get<{ unread: number; notifications: CrmNotificationDTO[] }>(crm(org.id, '/notifications')), refetchInterval: 30_000 });
  const readAll = async () => {
    await post(crm(org.id, '/notifications/read'), {});
    q.refetch();
    qc.invalidateQueries({ queryKey: ['crm', 'unread'] });
  };
  return (
    <>
      <button ref={anchor[1]} className="btn ghost icon crm-bell" aria-label={`Notifications${q.data?.unread ? `, ${q.data.unread} unread` : ''}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="bell" />
        {q.data?.unread ? <span className="crm-bell-count" aria-hidden>{q.data.unread > 99 ? '99+' : q.data.unread}</span> : null}
      </button>
      {open && anchor[0] ? (
        <Popover anchor={anchor[0]} onClose={() => setOpen(false)} align="end" width={360}>
          <div className="row crm-pop-head">
            <strong className="grow">Notifications</strong>
            {q.data?.unread ? <button className="btn ghost sm" onClick={readAll}>Mark all read</button> : null}
          </div>
          <div className="crm-notif-list">
            {(q.data?.notifications ?? []).slice(0, 12).map((n) => (
              <button key={n.id} className={`crm-notif${n.readAt ? '' : ' unread'}`} onClick={async () => {
                setOpen(false);
                if (!n.readAt) post(crm(org.id, '/notifications/read'), { ids: [n.id] }).then(() => q.refetch());
                if (n.link) navigate(n.link);
              }}>
                <span className="crm-notif-title">{n.title}</span>
                <span className="muted small">{timeAgo(n.createdAt)}</span>
              </button>
            ))}
            {q.data && !q.data.notifications.length ? <p className="muted small crm-pad">Nothing yet.</p> : null}
          </div>
          <div className="crm-pop-foot"><Link to={`/o/${org.id}/notifications`} onClick={() => setOpen(false)}>All notifications</Link> · <Link to={`/o/${org.id}/settings/notifications`} onClick={() => setOpen(false)}>Settings</Link></div>
        </Popover>
      ) : null}
    </>
  );
}

function ThemeButton() {
  const [pref, setPref] = useState<ThemePref>(storedTheme());
  return (
    <Dropdown align="end" label="Theme" trigger={(open, ref) => <button ref={ref} className="btn ghost icon desktop-only" aria-label="Theme" onClick={open}><Icon name={document.documentElement.dataset.theme === 'dark' ? 'moon' : 'sun'} /></button>}>
      {(close) => (
        <>
          {(['light', 'dark', 'system'] as ThemePref[]).map((p) => (
            <MenuItem key={p} icon={p === 'light' ? 'sun' : p === 'dark' ? 'moon' : 'settings'} active={pref === p} onClick={async () => {
              close();
              setPref(p);
              // On this computer only, never on the account.
              applyTheme(p);
            }}>
              {p[0].toUpperCase() + p.slice(1)}
            </MenuItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}

function Profile() {
  const { session } = useSession();
  const org = useOrg().data!;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const user = session!.user;
  return (
    <Dropdown align="end" width={240} trigger={(open, ref) => <button ref={ref} className="btn ghost icon" aria-label="Profile menu" onClick={open}><Avatar name={user.name} id={user.id} url={user.avatarUrl} /></button>}>
      {(close) => (
        <>
          <div className="crm-pad">
            <div><strong>{user.name}</strong></div>
            <div className="muted small ellipsis">{user.email}</div>
            <div className="muted small">{CRM_ROLE_LABELS[org.role]} in {org.name}</div>
          </div>
          <MenuSep />
          <MenuItem icon="bell" onClick={() => { close(); navigate(`/o/${org.id}/settings/notifications`); }}>Notification settings</MenuItem>
          <MenuItem icon="user" onClick={() => { close(); window.location.href = '/tasks/settings/profile'; }}>Profile and security</MenuItem>
          {session?.platformRole ? <MenuItem icon="chart" onClick={() => { close(); navigate('/admin'); }}>Super admin console</MenuItem> : null}
          <MenuSep />
          <MenuItem icon="logout" onClick={async () => {
            close();
            try {
              await post('/auth/logout');
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
            qc.clear();
            window.location.href = appUrl('/login');
          }}>Sign out</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

// ------------------------------------------------------------------ start and join

function Start() {
  const { session } = useSession();
  const orgs = useOrgs();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  usePageTitle('Start');
  const [f, setF] = useState({ name: '', industry: '', website: '', country: '', currency: 'AUD', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' });
  const [busy, setBusy] = useState(false);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await post<{ id: string }>('/crm/orgs', f);
      await qc.invalidateQueries({ queryKey: ['crm', 'orgs'] });
      navigate(`/o/${r.id}/overview`);
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="crm-start">
      <header className="row crm-start-head">
        <ProductLockup height={18} />
        <span className="grow" />
        <span className="muted small">{session?.user.email}</span>
      </header>
      <div className="page crm-page">
        <PageHeader title="Your CRM organisations" subtitle="Customer Relationship Management (CRM) keeps your contacts, companies, leads, deals and follow-ups in one place, shared with your team. Each organisation has its own customers, pipelines, team and settings; use as many as you need with one BIZOMAT login." />
        {orgs.data?.invitations.length ? (
          <section className="card card-pad stack">
            <h2 className="crm-subhead">Invitations for {session?.user.email}</h2>
            {orgs.data.invitations.map((i) => (
              <div key={i.id} className="row wrap crm-invite-row">
                <div className="grow">
                  <strong>{i.orgName}</strong> as {CRM_ROLE_LABELS[i.role as keyof typeof CRM_ROLE_LABELS] ?? i.role}
                  <div className="muted small">{i.inviter ? `From ${i.inviter}, ` : ''}{timeAgo(i.createdAt)}. Open the link in the invitation email to accept.</div>
                </div>
                <button className="btn sm" onClick={async () => { await post(`/crm/me/invitations/${i.id}/decline`).catch((e) => toast(errorMessage(e), 'error')); orgs.refetch(); }}>Decline</button>
              </div>
            ))}
          </section>
        ) : null}
        {orgs.data?.orgs.length ? (
          <div className="grid-cards">
            {orgs.data.orgs.map((o) => (
              <Link key={o.id} to={`/o/${o.id}/overview`} className="tile">
                <div className="row">{o.logoUrl ? <img src={appUrl(o.logoUrl)} alt="" className="crm-org-logo" /> : <span className="crm-org-logo crm-org-initial" aria-hidden>{o.name[0]}</span>}<strong className="ellipsis">{o.name}</strong></div>
                <span className="muted small">{CRM_ROLE_LABELS[o.role]} · {o.memberCount} {o.memberCount === 1 ? 'member' : 'members'}</span>
              </Link>
            ))}
          </div>
        ) : null}
        <form className="card card-pad stack crm-start-form" onSubmit={create}>
          <h2 className="crm-subhead">{orgs.data?.orgs.length ? 'Create another organisation' : 'Create your organisation'}</h2>
          <p className="muted small">You become its owner. It starts with a sales pipeline and seven automations you can change; no sample records are added.</p>
          <div className="crm-form-grid">
            <div className="field crm-span"><label htmlFor="org-name">Organisation name</label><input id="org-name" className="input" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="For example: ABC Engineering" /></div>
            <div className="field"><label htmlFor="org-ind">Industry</label><input id="org-ind" className="input" value={f.industry} onChange={(e) => setF({ ...f, industry: e.target.value })} /></div>
            <div className="field"><label htmlFor="org-web">Website</label><input id="org-web" className="input" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} /></div>
            <div className="field"><label htmlFor="org-country">Country</label><input id="org-country" className="input" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /></div>
            <div className="field"><label htmlFor="org-currency">Currency</label><select id="org-currency" className="select" value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}: {c.name}</option>)}</select></div>
          </div>
          <div><button className="btn primary" type="submit" disabled={busy || !f.name.trim()}>{busy ? 'Creating…' : 'Create organisation'}</button></div>
        </form>
        <p className="muted small">Looking for projects and tasks? <a href={PLATFORM_URLS.tasks}>Open Project Management</a>.</p>
      </div>
    </div>
  );
}

/** The invitation link: who invites, to what, as what; accept or decline with the signed-in account. */
export function Join() {
  const { token = '' } = useParams();
  const { session } = useSession();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const preview = useQuery({ queryKey: ['crm', 'invite', token], queryFn: () => get<{ orgName: string; inviter: string | null; roleLabel: string; email: string; status: string; message: string }>(`/crm-public/invitations/${encodeURIComponent(token)}`), retry: false });
  usePageTitle('Invitation');
  const next = encodeURIComponent(`/join/${token}`);
  const accept = async () => {
    try {
      const r = await post<{ orgId: string }>(`/crm/invitations/${encodeURIComponent(token)}/accept`);
      await qc.invalidateQueries({ queryKey: ['crm', 'orgs'] });
      navigate(`/o/${r.orgId}/overview`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const decline = async () => {
    try {
      await post(`/crm/invitations/${encodeURIComponent(token)}/decline`);
      toast('Invitation declined');
      navigate('/');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const p = preview.data;
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-brand"><ProductLockup height={20} /></div>
        {preview.isLoading ? <Loading /> : preview.error || !p ? (
          <>
            <h1>This invitation is not valid</h1>
            <p className="muted">It may have been withdrawn or replaced by a newer one. Ask the person who invited you to send it again.</p>
          </>
        ) : (
          <>
            <h1>Join {p.orgName}</h1>
            <p className="muted">{p.inviter ?? 'Someone'} invited {p.email} to {p.orgName} in {BRAND.full} (CRM) as {p.roleLabel}.</p>
            {p.message ? <blockquote className="crm-quote">{p.message}</blockquote> : null}
            {p.status !== 'pending' ? (
              <div className="error-box">This invitation is {p.status}.</div>
            ) : !session ? (
              <div className="stack">
                <Link className="btn primary block lg" to={`/login?next=${next}&email=${encodeURIComponent(p.email)}`}>Sign in to accept</Link>
                <Link className="btn block" to={`/signup?next=${next}&email=${encodeURIComponent(p.email)}`}>Create a BIZOMAT account with {p.email}</Link>
              </div>
            ) : session.user.email.toLowerCase() !== p.email.toLowerCase() ? (
              <div className="error-box">You are signed in as {session.user.email}. This invitation is for {p.email}: sign out and sign in with that address.</div>
            ) : (
              <div className="row">
                <button className="btn primary lg" onClick={accept}>Accept and join</button>
                <button className="btn lg" onClick={decline}>Decline</button>
              </div>
            )}
          </>
        )}
        <footer className="auth-foot"><span>Part of the {BRAND.platform} platform</span><span>{BRAND.copyright}</span></footer>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ search and notifications

function SearchPage() {
  const org = useOrg().data!;
  const location = useLocation();
  const navigate = useNavigate();
  const initial = new URLSearchParams(location.search).get('q') ?? '';
  const [q, setQ] = useState(initial);
  const dq = useDebounced(q, 250);
  usePageTitle('Search');
  useEffect(() => setQ(initial), [initial]);
  const res = useQuery({ queryKey: ['crm', org.id, 'search', dq], queryFn: () => get<{ results: Record<string, any[]> }>(`${crm(org.id, '/search')}?q=${encodeURIComponent(dq)}`), enabled: dq.trim().length >= 2 });
  const groups: [string, string, (r: any) => { to: string; title: string; detail: string }][] = [
    ['contact', 'Contacts', (r) => ({ to: recordPath(org.id, 'contact', r.id), title: r.name, detail: [r.jobTitle, r.company?.name, r.email].filter(Boolean).join(' · ') })],
    ['company', 'Companies', (r) => ({ to: recordPath(org.id, 'company', r.id), title: r.name, detail: [r.industry, r.website].filter(Boolean).join(' · ') })],
    ['lead', 'Leads', (r) => ({ to: recordPath(org.id, 'lead', r.id), title: r.name, detail: [r.companyName, r.email].filter(Boolean).join(' · ') })],
    ['deal', 'Deals', (r) => ({ to: recordPath(org.id, 'deal', r.id), title: r.title, detail: [r.company?.name, r.stageName, r.status !== 'open' ? r.status : ''].filter(Boolean).join(' · ') })],
    ['activity', 'Activities', (r) => ({ to: recordPath(org.id, 'activity', r.id), title: r.title, detail: [r.dueDate, r.contact?.name, r.deal?.name].filter(Boolean).join(' · ') })],
    ['note', 'Notes', (r) => ({ to: recordPath(org.id, r.entity, r.recordId), title: `${r.recordName}`, detail: r.excerpt })],
  ];
  const total = res.data ? Object.values(res.data.results).reduce((s, l) => s + l.length, 0) : 0;
  return (
    <div className="page crm-page">
      <PageHeader title="Search" icon="search" subtitle={`Across ${org.name}: contacts, companies, leads, deals, activities and notes.`} />
      <form className="crm-search crm-search-lg" role="search" onSubmit={(e) => { e.preventDefault(); navigate(`?q=${encodeURIComponent(q)}`, { replace: true }); }}>
        <Icon name="search" />
        <input className="input" type="search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, phone, company, deal…" aria-label="Search the CRM" />
      </form>
      {res.isFetching ? <Spinner /> : null}
      {dq.trim().length >= 2 && res.data && !total ? <EmptyState icon="search" title={`Nothing found for “${dq}”`} /> : null}
      <div className="stack-lg crm-pad-top">
        {res.data
          ? groups.map(([key, label, map]) =>
              res.data!.results[key]?.length ? (
                <section key={key} className="card">
                  <h2 className="crm-group-head">{label}</h2>
                  <ul className="crm-results">
                    {res.data!.results[key].map((r) => {
                      const m = map(r);
                      return (
                        <li key={r.id}>
                          <Link to={m.to}>{m.title}</Link>
                          <span className="muted small">{m.detail}</span>
                          {key === 'lead' ? <Chip list={org.settings.leadStatuses} value={r.status} /> : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null,
            )
          : null}
      </div>
    </div>
  );
}

function NotificationsPage() {
  const org = useOrg().data!;
  const navigate = useNavigate();
  const qc = useQueryClient();
  usePageTitle('Notifications');
  const q = useQuery({ queryKey: ['crm', org.id, 'notifications'], queryFn: () => get<{ unread: number; notifications: CrmNotificationDTO[] }>(crm(org.id, '/notifications')) });
  return (
    <div className="page crm-page">
      <PageHeader
        title="Notifications"
        icon="bell"
        actions={q.data?.unread ? <button className="btn" onClick={async () => { await post(crm(org.id, '/notifications/read'), {}); q.refetch(); qc.invalidateQueries({ queryKey: ['crm', 'unread'] }); }}>Mark all read</button> : null}
      />
      {!q.data ? <Loading /> : !q.data.notifications.length ? <EmptyState icon="bell" title="No notifications">Assignments, mentions, reminders and automation messages appear here.</EmptyState> : (
        <div className="card">
          {q.data.notifications.map((n) => (
            <button key={n.id} className={`crm-notif wide${n.readAt ? '' : ' unread'}`} onClick={async () => { if (!n.readAt) await post(crm(org.id, '/notifications/read'), { ids: [n.id] }); q.refetch(); if (n.link) navigate(n.link); }}>
              <span className="crm-notif-title">{n.title}</span>
              {n.body ? <span className="muted small">{n.body}</span> : null}
              <span className="muted small">{timeAgo(n.createdAt)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
