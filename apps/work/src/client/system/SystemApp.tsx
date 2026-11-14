// BIZOMAT System, served under /system by the same SPA and API as the tools, on the same sign-in: every tool a person
// uses, in one place, organised by company, with CAD Automation as its own section and, for the super admin, every
// account and company with their activity. The server (src/worker/system) decides what each person may see; this
// screen only shows it. Routes (inside the /system base): /, /c/:companyId/<home|cad|settings>, /admin/<section>.
import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, patch, post } from '../lib/api';
import { lastWorkspace, useSession } from '../lib/session';
import { SUITE, appUrl, toolUrl } from '../lib/base';
import { applyTheme, storedTheme, usePageTitle, type ThemePref } from '../lib/hooks';
import { BRAND, PLATFORM_URLS } from '../lib/brand';
import { timeAgo } from '../lib/format';
import { formatMoney } from '../../shared/crm/money';
import { BrandMark, Icon, ProductLockup } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, useConfirm, useToast } from '../components/ui/overlays';
import { PlatformFooter } from '../components/layout/PlatformLinks';
import { toolRoleLabel } from '../company/lib';
import '../styles/crm.css';
import '../styles/fin.css';
import '../styles/company.css';
import '../styles/system.css';
import { SUITE_SHELL, SuiteRail } from '../components/layout/SuiteRail';

// Asset Management and Maintenance (Stage 1), inside a company at /c/<company>/maintenance; loaded when it is opened.
const MaintenanceArea = lazy(() => import('./maintenance/Maintenance').then((m) => ({ default: m.MaintenanceArea })));

// ------------------------------------------------------------------ data

type SysApp = 'tasks' | 'crm' | 'finance';
type SysRole = 'owner' | 'admin' | 'member' | 'guest';
interface CompanyLite {
  id: string;
  /** demo: the person's example company (invented data, only for them). */
  kind: 'registered' | 'own' | 'demo';
  name: string;
  role: SysRole;
  registration?: { abnStatus: string; emailConfirmed: boolean; suspended: boolean };
  toolCount: number;
  apps: SysApp[];
}
interface Me {
  user: { id: string; name: string; email: string };
  platformRole: 'founder' | 'admin' | null;
  companies: CompanyLite[];
  cadConnected: boolean;
  example: { status: 'none' | 'building' | 'ready' | 'failed' | 'removed'; companyId?: string; failed?: string };
}
interface Tool {
  app: SysApp;
  id: string;
  name: string;
  role: string;
  kind?: string;
  url: string;
  numbers: Record<string, number | string | undefined> | null;
}
interface CompanyView {
  company: Omit<CompanyLite, 'toolCount' | 'apps'>;
  tools: Tool[];
  people: number | null;
}
interface CadPerson {
  userId: string;
  name: string;
  email: string;
  emailConfirmed: boolean;
  status: {
    computers: { name: string; online: boolean; solidworks?: string; addin?: string; lastSeen?: number | null; open?: string }[];
    jobs: { id: string; tool: string; status: string; at: number }[];
    assistants: { app: string; connectedAt?: number | null; lastUsed?: number | null }[];
    reportedAt: number;
  } | null;
}

// The ERP's module names (the tools underneath keep their own names).
const APP_NAMES: Record<SysApp, string> = { tasks: 'Projects and Tasks', crm: 'Sales and CRM', finance: 'Finance and Accounting' };
const APP_ICONS: Record<SysApp, string> = { tasks: 'grid', crm: 'briefcase', finance: 'dollar' };
const ROLE_LABELS: Record<SysRole, string> = { owner: 'Owner', admin: 'Administrator', member: 'Member', guest: 'Shared with you' };
const CAD = {
  app: 'https://bizomat.ai/cad/',
  assistant: 'https://bizomat.ai/cad/assistant',
  computers: 'https://bizomat.ai/cad/solidworks',
  download: 'https://bizomat.ai/cad/download/solidworks',
  docs: 'https://bizomat.ai/cad/docs',
};
const LAST_KEY = 'bizomat-system-company';

const useMe = () => useQuery({ queryKey: ['system', 'me'], queryFn: () => get<Me>('/system/me') });
const useCompanyView = (id: string) => useQuery({ queryKey: ['system', 'company', id], queryFn: () => get<CompanyView>(`/system/companies/${encodeURIComponent(id)}`), retry: false });
const n = (v: unknown) => (typeof v === 'number' ? v.toLocaleString() : '0');
const money = (v: unknown, cur: unknown) => formatMoney(typeof v === 'number' ? v : 0, typeof cur === 'string' ? cur : 'AUD', { compact: true });
const when = (t: number | null | undefined) => (t ? timeAgo(t) : 'never');

function lastCompany(): string | null {
  try {
    return localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
}
function rememberCompany(id: string) {
  try {
    localStorage.setItem(LAST_KEY, id);
  } catch {
    /* private mode */
  }
}

function kindLine(c: Pick<CompanyLite, 'kind' | 'role'>): string {
  if (c.role === 'guest') return 'Shared with you: only the tools you were added to';
  if (c.kind === 'demo') return 'Example company: invented data to learn BIZOMAT, only for you';
  if (c.kind === 'own') return 'Your own company (not registered)';
  return `Registered company · ${ROLE_LABELS[c.role]}`;
}

// ------------------------------------------------------------------ routes

/** BIZOMAT ERP's routes for signed-in people (App.tsx gives the sign-in pages and the session gate). */
export function SystemRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SystemHome />} />
      <Route path="/c/:companyId/*" element={<CompanyArea />} />
      <Route path="/admin/*" element={<Shell><AdminArea /></Shell>} />
      {/* The module rail's Products and Engineering: the CAD page of the company used last. */}
      <Route path="/cad" element={<SystemHome page="cad" />} />
      <Route path="/my-work" element={<MyWorkRedirect />} />
      {/* The module rail's Maintenance: the maintenance of the company used last. */}
      <Route path="/maintenance/*" element={<MaintenanceRedirect />} />
      <Route path="/operations" element={<Shell><Operations /></Shell>} />
      <Route path="/reports" element={<Shell><ReportsPage /></Shell>} />
      <Route path="/administration" element={<Shell><Administration /></Shell>} />
      {/* A tool's address reached from here (/crm/..., /tasks/...): open it inside the ERP with a page load. */}
      <Route path="/tasks/*" element={<OpenTool />} />
      <Route path="/crm/*" element={<OpenTool />} />
      <Route path="/finance/*" element={<OpenTool />} />
      <Route path="/company/*" element={<OpenTool />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** Another module of the ERP: its own application, at /erp/<tool>/..., is a page load away. */
function OpenTool() {
  const location = useLocation();
  useEffect(() => {
    window.location.replace(`${SUITE || '/erp'}${location.pathname}${location.search}${location.hash}`);
  }, [location]);
  return <Loading label="Opening…" />;
}

/** My Work: everything assigned to you, in the Projects and Tasks workspace used last. */
function MyWorkRedirect() {
  const { session } = useSession();
  const ws = session?.workspaces.find((w) => w.id === lastWorkspace()) ?? session?.workspaces[0];
  useEffect(() => {
    window.location.replace(toolUrl(ws ? `/tasks/w/${encodeURIComponent(ws.id)}/my-work` : '/tasks/'));
  }, [ws]);
  return <Loading label="Opening My Work…" />;
}

/** Maintenance: in the company used last when the person has maintenance there, else their first registered company. */
function MaintenanceRedirect() {
  const location = useLocation();
  const q = useQuery({ queryKey: ['mt', 'companies'], queryFn: () => get<{ companies: { id: string; kind: 'registered' | 'own' | 'demo' }[] }>('/maintenance/companies') });
  if (q.error) return <Shell><div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div></Shell>;
  if (!q.data) return <Loading label="Opening maintenance…" />;
  const list = q.data.companies;
  const pick = list.find((c) => c.id === lastCompany()) ?? list.find((c) => c.kind === 'registered') ?? list[0];
  if (!pick) return <Shell><div className="page"><EmptyState title="No company yet" icon="building">Reload the page to make your own company.</EmptyState></div></Shell>;
  return <Navigate to={`/c/${pick.id}/maintenance${location.pathname.replace(/^\/maintenance/, '')}${location.search}`} replace />;
}

/** "/": the company used last, else the first (registered, then the person's own). "/cad": its CAD page. */
function SystemHome({ page = 'home' }: { page?: 'home' | 'cad' }) {
  const q = useMe();
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data) return <Loading label={`Loading ${BRAND.full}…`} />;
  const list = q.data.companies;
  const pick = list.find((c) => c.id === lastCompany()) ?? list.find((c) => c.kind !== 'demo') ?? list[0];
  if (!pick) return <Shell><div className="page"><EmptyState title="No company yet" icon="building">Reload the page to make your own company.</EmptyState></div></Shell>;
  return <Navigate to={`/c/${pick.id}/${page}`} replace />;
}

function CompanyArea() {
  const { companyId = '' } = useParams();
  const q = useCompanyView(companyId);
  useEffect(() => {
    if (q.data) rememberCompany(q.data.company.id);
  }, [q.data]);
  if (q.error) {
    if (q.error instanceof ApiError && q.error.status === 404) return <Navigate to="/" replace />;
    return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  }
  if (!q.data) return <Loading label="Opening the company…" />;
  return (
    <Shell view={q.data}>
      <Routes>
        <Route path="home" element={<CompanyHome view={q.data} />} />
        <Route path="cad" element={<CadPage view={q.data} />} />
        <Route path="settings" element={<CompanySettings view={q.data} />} />
        <Route path="maintenance/*" element={<Suspense fallback={<Loading />}><MaintenanceArea companyId={q.data.company.id} companyName={q.data.company.name} /></Suspense>} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </Shell>
  );
}

// ------------------------------------------------------------------ shell

function Shell({ view, children }: { view?: CompanyView; children: ReactNode }) {
  const me = useMe().data;
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setNavOpen(false), [location.pathname]);
  const id = view?.company.id ?? lastCompany() ?? me?.companies[0]?.id;
  const base = id ? `/c/${id}` : '';
  return (
    <div className={`shell crm-shell co-shell sys-shell${SUITE_SHELL ? ' in-suite' : ''}${navOpen ? ' nav-open' : ''}`}>
      <SuiteRail />
      <ExamplePreparer />
      <header className="topbar">
        <button className="btn ghost icon mobile-only" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
          <Icon name="menu" />
        </button>
        <Link to="/" className="brand" aria-label={`${BRAND.full} home`}>
          <span className="mobile-only"><BrandMark size={28} /></span>
          <span className="desktop-only"><ProductLockup height={15} /></span>
        </Link>
        <CompanySwitcher current={view?.company.id} />
        <div className="spacer" />
        <ThemeButton />
        <Profile />
      </header>
      <nav className="sidebar" aria-label="ERP navigation">
        {base ? (
          <>
            <NavLink to={`${base}/home`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><Icon name="home" /> Dashboard</NavLink>
            <NavLink to={`${base}/cad`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><Icon name="diamond" /> Products and Engineering</NavLink>
            <NavLink to={`${base}/maintenance`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><Icon name="wrench" /> Maintenance</NavLink>
            <NavLink to={`${base}/settings`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><Icon name="settings" /> Company</NavLink>
          </>
        ) : null}
        {view?.tools.length ? (
          <>
            <div className="nav-section">Open a tool</div>
            {view.tools.map((t) => (
              <a key={`${t.app}:${t.id}`} className="nav-item" href={t.url} title={`${APP_NAMES[t.app]}: ${t.name}`}>
                <Icon name={APP_ICONS[t.app]} /> <span className="ellipsis">{APP_NAMES[t.app]}</span>
              </a>
            ))}
          </>
        ) : null}
        {me?.platformRole ? (
          <>
            <div className="nav-section">Super admin</div>
            <NavLink to="/admin/overview" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><Icon name="shield" /> ERP console</NavLink>
          </>
        ) : null}
        {/* Every tool is in the module rail (SuiteRail); CAD Automation's own application opens at /cad. */}
        <div className="nav-section">CAD Automation application</div>
        <a className="nav-item" href={CAD.app}><Icon name="diamond" /> Open CAD Automation</a>
        <PlatformFooter />
      </nav>
      <main className="main" id="main">
        {children}
      </main>
    </div>
  );
}

function CompanySwitcher({ current }: { current?: string }) {
  const me = useMe().data;
  const navigate = useNavigate();
  const list = me?.companies ?? [];
  const active = list.find((c) => c.id === current);
  const yours = list.filter((c) => c.role !== 'guest' && c.kind !== 'demo');
  const shared = list.filter((c) => c.role === 'guest');
  const examples = list.filter((c) => c.kind === 'demo');
  const item = (c: CompanyLite, close: () => void) => (
    <MenuItem key={c.id} active={c.id === current} onClick={() => { close(); navigate(`/c/${c.id}/home`); }}>
      <span className="grow ellipsis">{c.name}</span>
      <span className="muted small">{c.role === 'guest' ? `${c.toolCount} ${c.toolCount === 1 ? 'tool' : 'tools'}` : c.kind === 'demo' ? 'Example' : c.kind === 'own' ? 'Own' : ROLE_LABELS[c.role]}</span>
    </MenuItem>
  );
  return (
    <Dropdown
      width={320}
      label="Companies"
      trigger={(open, ref) => (
        <button ref={ref} className="btn ws-switcher crm-org-switcher" onClick={open} aria-label={active ? `Company: ${active.name}. Switch company` : 'Choose a company'}>
          <span className="crm-org-logo crm-org-initial" aria-hidden>{(active?.name ?? 'C')[0]?.toUpperCase()}</span>
          <span className="ellipsis">{active?.name ?? 'Companies'}</span>
          <Icon name="chevronDown" size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="menu-label">Your companies</div>
          {yours.map((c) => item(c, close))}
          {shared.length ? (
            <>
              <MenuSep />
              <div className="menu-label">Shared with you</div>
              {shared.map((c) => item(c, close))}
            </>
          ) : null}
          {examples.length ? (
            <>
              <MenuSep />
              <div className="menu-label">Example company</div>
              {examples.map((c) => item(c, close))}
            </>
          ) : null}
          <MenuSep />
          <MenuItem icon="plus" onClick={() => { close(); window.location.href = `${PLATFORM_URLS.company}new`; }}>Register a company</MenuItem>
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
  const me = useMe().data;
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
            {me?.platformRole ? <div className="muted small">{me.platformRole === 'founder' ? 'Founder (super admin)' : 'Platform administrator'}</div> : null}
          </div>
          <MenuItem icon="user" onClick={() => { close(); window.location.href = toolUrl('/tasks/settings/profile'); }}>Profile and security</MenuItem>
          <MenuSep />
          <MenuItem icon="logout" onClick={() => { close(); void signOut(); }}>Sign out</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

// ------------------------------------------------------------------ the example company

/** Asks for the person's example company on their first visit (once per browser tab), never blocking the page. */
let examplePrepared = false;
function ExamplePreparer() {
  const me = useMe().data;
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const status = me?.example?.status;
  useEffect(() => {
    if (status !== 'none' || examplePrepared) return;
    examplePrepared = true;
    setBusy(true);
    post('/system/demo', {})
      .catch(() => null)
      .finally(() => {
        setBusy(false);
        void qc.invalidateQueries({ queryKey: ['system'] });
        void qc.invalidateQueries({ queryKey: ['mt'] });
      });
  }, [status, qc]);
  if (!busy && status !== 'building') return null;
  return (
    <p className="sys-example-note" role="status">
      Preparing your example company, Acme Studio, with invented data to learn with…
    </p>
  );
}

/** Shown on the example company's pages: what it is, and where it is removed. */
function ExampleBanner() {
  return (
    <section className="co-prompt sys-example-banner">
      <p>
        <strong>Example company.</strong> Acme Studio is invented data to learn BIZOMAT: projects, customers, finance and maintenance. Only you can see it, and
        nothing you change here affects your own companies. It sends no email. Remove it any time in Administration.
      </p>
      <Link className="btn" to="/administration">Administration</Link>
    </section>
  );
}

/** Administration: remove the example company, or add it again. */
function ExampleCard() {
  const me = useMe();
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const ex = me.data?.example;
  if (!ex) return null;
  const run = async (what: 'remove' | 'again') => {
    if (what === 'remove' && !(await confirm({ title: 'Remove the example company?', message: 'Its projects, customers, finance and maintenance records are deleted. You can add a new one later.', confirmLabel: 'Remove', danger: true }))) return;
    setBusy(true);
    try {
      if (what === 'remove') {
        await post('/system/demo/remove', {});
        toast('Example company removed');
        if (ex.companyId && lastCompany() === ex.companyId) rememberCompany('');
        navigate('/administration', { replace: true });
      } else {
        await post('/system/demo', { again: true });
        toast('Example company added');
      }
      await qc.invalidateQueries({ queryKey: ['system'] });
      await qc.invalidateQueries({ queryKey: ['mt'] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">Example company</h2>
      {ex.status === 'ready' ? (
        <>
          <p className="muted">Acme Studio is invented data to learn BIZOMAT, only for you. Remove it when you no longer need it.</p>
          <div className="row wrap">
            {ex.companyId ? <Link className="btn" to={`/c/${ex.companyId}/home`}>Open the example company</Link> : null}
            <button className="btn danger" disabled={busy} onClick={() => void run('remove')}>Remove the example company</button>
          </div>
        </>
      ) : ex.status === 'building' || ex.status === 'none' ? (
        <p className="muted">Your example company is being prepared.</p>
      ) : (
        <>
          <p className="muted">{ex.status === 'failed' ? 'The example company could not be made.' : 'You removed the example company.'} Add a new one to learn with invented data. Only you can see it.</p>
          <div className="row"><button className="btn primary" disabled={busy} onClick={() => void run('again')}>Add the example company again</button></div>
        </>
      )}
    </section>
  );
}

// ------------------------------------------------------------------ company pages

function CompanyHome({ view }: { view: CompanyView }) {
  const me = useMe().data;
  const c = view.company;
  const byApp = (app: SysApp) => view.tools.filter((t) => t.app === app);
  return (
    <div className="page crm-page">
      <PageHeader title={c.name} subtitle={kindLine(c)} />
      {c.kind === 'demo' ? <ExampleBanner /> : null}
      {c.kind === 'own' && c.role === 'owner' ? (
        <section className="co-prompt">
          <p>This is your own company. It holds the tools you own that no registered company runs. Register your business to add its ABN, people and departments, and to give each person a role in each tool.</p>
          <a className="btn" href={`${PLATFORM_URLS.company}new`}>Register a company</a>
        </section>
      ) : null}
      {c.role === 'guest' ? (
        <section className="co-prompt">
          <p>Someone in {c.name} added you to these tools. Your access comes from each tool, and its owner decides who is in it.</p>
        </section>
      ) : null}
      {c.registration?.suspended ? <p className="warning-text">This company is suspended. Its tools stay as they are; ask BIZOMAT support for details.</p> : null}
      <div className="co-tools-grid">
        {(['tasks', 'crm', 'finance'] as SysApp[]).flatMap((app) => byApp(app).map((t) => <ToolCard key={`${t.app}:${t.id}`} tool={t} />))}
        {c.role !== 'guest' ? (
          <Link to={`/c/${c.id}/maintenance`} className="card card-pad co-tool-card sys-tool-card">
            <div className="row"><Icon name="wrench" /> <strong>Maintenance</strong></div>
            <p className="muted small">Asset Management and Maintenance: the asset register, requests and work orders.</p>
            <p className="small">Report a fault, follow your requests, or plan and record the work.</p>
          </Link>
        ) : null}
        {c.kind !== 'demo' ? <Link to={`/c/${c.id}/cad`} className="card card-pad co-tool-card sys-tool-card">
          <div className="row"><Icon name="diamond" /> <strong>Products and Engineering</strong></div>
          <p className="muted small">SOLIDWORKS on your computers, driven by your AI assistant.</p>
          <p className="small">{me?.cadConnected ? 'See computers, AI apps and recent jobs.' : 'Set it up, then see its computers here.'}</p>
        </Link> : null}
      </div>
      {!view.tools.length && c.role !== 'guest' ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">No tools in this company yet</h2>
          <p className="muted">Start one. It appears here as soon as it exists.</p>
          <div className="row wrap">
            <a className="btn" href={PLATFORM_URLS.tasks}><Icon name="grid" /> Project Management</a>
            <a className="btn" href={PLATFORM_URLS.crm}><Icon name="briefcase" /> Customer Relationship Management</a>
            <a className="btn" href={PLATFORM_URLS.finance}><Icon name="dollar" /> Finance</a>
          </div>
        </section>
      ) : null}
      {view.people != null ? <p className="muted small">{view.people} {view.people === 1 ? 'person' : 'people'} in this company. People, departments and tool roles are managed in the company area.</p> : null}
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const x = tool.numbers;
  return (
    <section className="card card-pad co-tool-card sys-tool-card">
      <div className="row">
        <Icon name={APP_ICONS[tool.app]} /> <strong className="grow ellipsis">{APP_NAMES[tool.app]}</strong>
        <a className="btn sm" href={tool.url}>Open</a>
      </div>
      <p className="muted small ellipsis">{tool.name}{tool.kind ? ` (${tool.kind})` : ''} · Your role: {toolRoleLabel(tool.app, tool.role)}</p>
      {!x ? (
        <p className="muted small">Figures are shown to people whose role in {APP_NAMES[tool.app]} shows them.</p>
      ) : tool.app === 'tasks' ? (
        <dl className="co-figures">
          <div><dt>Open tasks</dt><dd>{n(x.open)}</dd></div>
          <div><dt>Overdue</dt><dd className={x.overdue ? 'warning-text' : ''}>{n(x.overdue)}</dd></div>
          <div><dt>Due in 7 days</dt><dd>{n(x.dueSoon)}</dd></div>
          <div><dt>Projects</dt><dd>{n(x.projects)}</dd></div>
        </dl>
      ) : tool.app === 'crm' ? (
        <dl className="co-figures">
          <div><dt>Open deals</dt><dd>{n(x.openDeals)}</dd></div>
          <div><dt>Pipeline</dt><dd>{money(x.openValue, x.currency)}</dd></div>
          <div><dt>Won in 30 days</dt><dd>{money(x.wonValue30d, x.currency)}</dd></div>
          <div><dt>Follow-ups due</dt><dd>{n(x.followUpsDue)}</dd></div>
        </dl>
      ) : (
        <>
          <dl className="co-figures">
            <div><dt>Income</dt><dd>{money(x.income, x.currency)}</dd></div>
            <div><dt>Expenses</dt><dd>{money(x.expenses, x.currency)}</dd></div>
            <div><dt>Owed to you</dt><dd>{money(x.receivable, x.currency)}</dd></div>
            <div><dt>You owe</dt><dd>{money(x.payable, x.currency)}</dd></div>
          </dl>
          <p className="muted small">This financial year so far, from posted entries.</p>
        </>
      )}
    </section>
  );
}

function CadPage({ view }: { view: CompanyView }) {
  const me = useMe().data;
  const c = view.company;
  const q = useQuery({ queryKey: ['system', 'cad', c.id], queryFn: () => get<{ scope: 'company' | 'self' | 'none'; people: CadPerson[] }>(`/system/companies/${encodeURIComponent(c.id)}/cad`) });
  const scopeNote =
    q.data?.scope === 'company'
      ? `As ${ROLE_LABELS[c.role].toLowerCase()} of ${c.name}, you see the CAD computers of everyone in it. People in other companies never see them.`
      : q.data?.scope === 'self'
        ? c.kind === 'registered'
          ? `You see your own CAD computers. The owner and administrators of ${c.name} see everyone's in it.`
          : 'You see your own CAD computers. Nobody else sees them here.'
        : c.kind === 'demo'
          ? 'The example company has no CAD computers. Yours are listed under your own company.'
          : `CAD computers are not shared with people who only share a tool with ${c.name}.`;
  const reported = (q.data?.people ?? []).filter((p) => p.status);
  return (
    <div className="page crm-page">
      <PageHeader title="Products and Engineering" subtitle="CAD Automation: your AI assistant builds native SOLIDWORKS parts, assemblies and drawings on your own computer." actions={<a className="btn primary" href={CAD.app}>Open CAD Automation</a>} />
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Set it up in four steps</h2>
        <ol className="sys-steps">
          <li><strong>Sign in to CAD Automation.</strong> <span className="muted">Open <a href={CAD.app}>bizomat.ai/cad</a> and sign in or create your CAD Automation account.</span></li>
          <li><strong>Install it on your Windows computer.</strong> <span className="muted">Download <a href={CAD.download}>BIZOMAT CAD Automation for SOLIDWORKS</a> (one installer: the SOLIDWORKS add-in and the Companion). The download needs your CAD Automation sign-in.</span></li>
          <li><strong>Pair the computer.</strong> <span className="muted">At the end of the install the Companion opens the browser to pair this computer with your account. It then appears under <a href={CAD.computers}>SOLIDWORKS</a>.</span></li>
          <li><strong>Connect your AI assistant.</strong> <span className="muted">Copy your connector address from <a href={CAD.assistant}>CAD Assistant</a> and add it as a custom connector in Claude, ChatGPT or another app that supports remote MCP servers.</span></li>
        </ol>
        <p className="muted small">Full guide: <a href={CAD.docs}>CAD Automation setup and troubleshooting</a>. The connector, installer and add-in are the same ones CAD Automation has always used.</p>
      </section>
      <section className="card card-pad stack">
        <div className="row wrap">
          <h2 className="crm-subhead grow">Computers in {c.name}</h2>
          <button className="btn ghost sm" onClick={() => q.refetch()}><Icon name="refresh" size={14} /> Refresh</button>
        </div>
        <p className="muted small">{scopeNote}</p>
        {!me?.cadConnected ? (
          <div className="co-prompt">
            <p>CAD Automation is not reporting to the ERP yet, so its computers are not listed here. Until it is, see your computers and AI apps in CAD Automation itself.</p>
            <a className="btn" href={CAD.computers}>See my computers</a>
          </div>
        ) : null}
        {q.error ? (
          <ErrorBox error={q.error} retry={() => q.refetch()} />
        ) : !q.data ? (
          <Loading />
        ) : q.data.scope === 'none' ? null : !reported.length ? (
          <p className="muted">{me?.cadConnected ? 'No CAD Automation report yet for ' + (q.data.scope === 'company' ? 'anyone in this company.' : 'your account.') + ' It arrives within a few minutes of a computer being paired.' : 'No computers to show yet.'}</p>
        ) : (
          <div className="sys-table-wrap">
            <table className="data-table responsive sys-cad-table">
              <thead>
                <tr><th>Person</th><th>Computers</th><th>AI apps</th><th>Recent jobs</th><th>Reported</th></tr>
              </thead>
              <tbody>
                {reported.map((p) => (
                  <tr key={p.userId}>
                    <td><strong>{p.name}</strong><div className="muted small">{p.email}</div></td>
                    <td>
                      {p.status!.computers.length ? p.status!.computers.map((m) => (
                        <div key={m.name} className="sys-cad-line">
                          <span className={`badge ${m.online ? 'success' : ''}`}>{m.online ? 'Online' : 'Offline'}</span> {m.name}
                          <div className="muted small">{[m.solidworks ? `SOLIDWORKS ${m.solidworks}` : null, m.addin ? `add-in ${m.addin}` : null, m.open ? `open: ${m.open}` : null, `seen ${when(m.lastSeen)}`].filter(Boolean).join(' · ')}</div>
                        </div>
                      )) : <span className="muted">None paired</span>}
                    </td>
                    <td>{p.status!.assistants.length ? p.status!.assistants.map((a) => <div key={a.app}>{a.app} <span className="muted small">used {when(a.lastUsed)}</span></div>) : <span className="muted">None connected</span>}</td>
                    <td>{p.status!.jobs.length ? p.status!.jobs.slice(0, 5).map((j) => <div key={j.id} className="small">{j.tool} <span className="muted">{j.status}, {when(j.at)}</span></div>) : <span className="muted">None</span>}</td>
                    <td className="muted small">{when(p.status!.reportedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function CompanySettings({ view }: { view: CompanyView }) {
  const c = view.company;
  const qc = useQueryClient();
  const toast = useToast();
  const [name, setName] = useState(c.name);
  const [busy, setBusy] = useState(false);
  usePageTitle('Company');
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await patch(`/system/companies/${encodeURIComponent(c.id)}`, { name });
      await qc.invalidateQueries({ queryKey: ['system'] });
      toast('Saved');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page crm-page">
      <PageHeader title="Company" subtitle={kindLine(c)} />
      {c.kind === 'demo' ? <ExampleBanner /> : null}
      {c.kind === 'own' && c.role === 'owner' ? (
        <form className="card card-pad stack crm-start-form" onSubmit={save}>
          <div className="field">
            <label htmlFor="sys-company-name">Company name</label>
            <input id="sys-company-name" className="input" value={name} maxLength={100} required onChange={(e) => setName(e.target.value)} />
          </div>
          <p className="muted small">Your own company is not registered and has no ABN. It is the home of the tools you own outside a registered company.</p>
          <div className="row">
            <button className="btn primary" disabled={busy || !name.trim() || name.trim() === c.name}>{busy ? 'Saving…' : 'Save'}</button>
            <a className="btn ghost" href={`${PLATFORM_URLS.company}new`}>Register a company</a>
          </div>
        </form>
      ) : c.kind === 'registered' && c.role !== 'guest' ? (
        <section className="card card-pad stack">
          <p>{c.name} is a registered company. Its people, departments, tool roles and registration details are managed in the company area.</p>
          {c.registration ? (
            <ul className="co-checks">
              <li><span className={`badge ${c.registration.abnStatus === 'active' ? 'success' : ''}`}>ABN</span> {c.registration.abnStatus === 'active' ? 'Active on the register' : c.registration.abnStatus === 'none' ? 'Registered in a person’s own name' : `Status: ${c.registration.abnStatus}`}</li>
              <li><span className={`badge ${c.registration.emailConfirmed ? 'success' : 'warning'}`}>Email</span> {c.registration.emailConfirmed ? 'Contact address confirmed' : 'Contact address not confirmed yet'}</li>
            </ul>
          ) : null}
          <div className="row"><a className="btn" href={`${PLATFORM_URLS.company}c/${encodeURIComponent(c.id)}/overview`}>Open in the company area</a></div>
        </section>
      ) : (
        <section className="card card-pad stack">
          <p>You were added to tools held by {c.name}. You are not a member of the company itself, so its settings are not shown to you.</p>
        </section>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ ERP pages: operations, reports, administration

/** The company the ERP pages work in: the one used last, else the first. */
function useCurrentCompany() {
  const me = useMe();
  const id = me.data ? (me.data.companies.find((c) => c.id === lastCompany()) ?? me.data.companies[0])?.id ?? '' : '';
  const view = useQuery({ queryKey: ['system', 'company', id], queryFn: () => get<CompanyView>(`/system/companies/${encodeURIComponent(id)}`), enabled: !!id, retry: false });
  return { me, id, view };
}

/**
 * The ERP's operations modules (docs/erp/architecture/08). Planned ones are shown as planned, never as working. Asset
 * Management and Maintenance is partly live (Stage 1): exactly what is live is said, and the rest is labelled planned.
 */
const PLANNED: { name: string; icon: string; covers: string; today?: string; live?: { to: string; label: string } }[] = [
  { name: 'Procurement', icon: 'inbox', covers: 'Suppliers, purchase requisitions with approval, requests for quotation, purchase orders and receiving, and supplier performance.', today: 'Today: suppliers and bills are kept in Finance and Accounting.' },
  { name: 'Inventory and Warehouse', icon: 'archive', covers: 'Stock on hand by product, location and lot, movements, goods receipts, transfers, stock counts and valuation.' },
  { name: 'Manufacturing', icon: 'settings', covers: 'Work orders with operations and materials, a planning board by work centre, and a shop-floor screen for reporting quantities and scrap.' },
  { name: 'Quality', icon: 'checkSquare', covers: 'Inspection plans and checklists, inspections, nonconformances and corrective actions.' },
  {
    name: 'Asset Management and Maintenance',
    icon: 'wrench',
    covers: 'Live now: the asset register with its hierarchy, CSV import and files; maintenance requests with approval; standard work orders with tasks, parts lines, a labour timer, photos, completion and reopening; maintenance roles per company; and the history of every change.',
    today: 'Planned: preventive maintenance, meter readings, inspections, prestart checks, spare parts and stocktakes, more than one site, QR code and barcode labels, and AI scheduling.',
    live: { to: '/maintenance', label: 'Open Maintenance' },
  },
  { name: 'Supply Chain', icon: 'globe', covers: 'Shipments, carriers, a delivery schedule and returns.' },
  { name: 'Products and Engineering records', icon: 'diamond', covers: 'Products with variants, revisions, bills of materials and routings, and engineering changes, linked to CAD Automation drawings.', today: 'Today: CAD Automation builds SOLIDWORKS parts, assemblies and drawings from your AI assistant (Products and Engineering).' },
];

function Operations() {
  usePageTitle('Operations');
  return (
    <div className="page crm-page">
      <PageHeader title="Operations" subtitle="Procurement, inventory, manufacturing, quality, assets, maintenance and supply chain. Asset Management and Maintenance is partly live; the other modules are planned: they are not built yet and keep no data." />
      <div className="co-tools-grid">
        {PLANNED.map((m) => (
          <section key={m.name} className="card card-pad co-tool-card">
            <div className="row"><Icon name={m.icon} /> <strong className="grow">{m.name}</strong>{m.live ? <span className="badge success">Partly live</span> : <span className="badge">Planned</span>}</div>
            <p className="small">{m.covers}</p>
            {m.today ? <p className="muted small">{m.today}</p> : null}
            {m.live ? <div className="row"><Link className="btn sm" to={m.live.to}>{m.live.label}</Link></div> : null}
          </section>
        ))}
      </div>
    </div>
  );
}

function ReportsPage() {
  usePageTitle('Reports');
  const { me, view } = useCurrentCompany();
  if (me.error) return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  if (!view.data) return <Loading />;
  const c = view.data.company;
  const tools = view.data.tools;
  const one = (app: SysApp) => tools.filter((t) => t.app === app);
  const links: { app: SysApp; label: string; what: string; href: (id: string) => string }[] = [
    { app: 'crm', label: 'Sales and CRM reports', what: 'Pipeline, forecast, won and lost deals, lead sources and team activity.', href: (id) => toolUrl(`/crm/o/${encodeURIComponent(id)}/reports`) },
    { app: 'finance', label: 'Finance and Accounting reports', what: 'Profit and loss, balance sheet, cash, what is owed both ways, budgets and the GST and BAS worksheet.', href: (id) => toolUrl(`/finance/o/${encodeURIComponent(id)}/reports`) },
    { app: 'tasks', label: 'Projects and Tasks dashboards', what: 'Dashboards built from live board data: counts, progress, workload and dates.', href: (id) => toolUrl(`/tasks/w/${encodeURIComponent(id)}/dashboards`) },
  ];
  return (
    <div className="page crm-page">
      <PageHeader title="Reports" subtitle={`Every report of ${c.name}'s tools in one place. Each opens in its module, with that module's permissions.`} />
      <p className="muted small">The figures on the <Link to={`/c/${c.id}/home`}>Dashboard</Link> come from these tools.</p>
      <div className="co-tools-grid">
        {links.flatMap((l) =>
          one(l.app).map((t) => (
            <a key={`${l.app}:${t.id}`} href={l.href(t.id)} className="card card-pad co-tool-card sys-tool-card">
              <div className="row"><Icon name={APP_ICONS[l.app]} /> <strong className="grow">{l.label}</strong></div>
              <p className="muted small">{t.name} · Your role: {toolRoleLabel(t.app, t.role)}</p>
              <p className="small">{l.what}</p>
            </a>
          )),
        )}
      </div>
      {!tools.length ? <p className="muted">No tools in {c.name} yet, so there are no reports. Start Sales and CRM, Finance and Accounting or Projects and Tasks from the rail.</p> : null}
    </div>
  );
}

function Administration() {
  usePageTitle('Administration');
  const { me, view } = useCurrentCompany();
  if (me.error) return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  if (!view.data || !me.data) return <Loading />;
  const c = view.data.company;
  const tools = view.data.tools;
  const companyLinks = c.kind === 'registered' && c.role !== 'guest'
    ? [
        { label: 'Company overview', href: toolUrl(`/company/c/${encodeURIComponent(c.id)}/overview`), icon: 'home' },
        { label: 'People and roles', href: toolUrl(`/company/c/${encodeURIComponent(c.id)}/people`), icon: 'users' },
        { label: 'Departments', href: toolUrl(`/company/c/${encodeURIComponent(c.id)}/departments`), icon: 'layers' },
        { label: 'Tools', href: toolUrl(`/company/c/${encodeURIComponent(c.id)}/tools`), icon: 'grid' },
        { label: 'Company settings', href: toolUrl(`/company/c/${encodeURIComponent(c.id)}/settings`), icon: 'settings' },
      ]
    : [];
  const toolAdmin: { app: SysApp; label: string; href: (id: string) => string }[] = [
    { app: 'crm', label: 'Sales and CRM: team, roles and settings', href: (id) => toolUrl(`/crm/o/${encodeURIComponent(id)}/team`) },
    { app: 'finance', label: 'Finance: team, roles and settings', href: (id) => toolUrl(`/finance/o/${encodeURIComponent(id)}/team`) },
    { app: 'tasks', label: 'Projects and Tasks: workspace settings', href: (id) => toolUrl(`/tasks/w/${encodeURIComponent(id)}/settings`) },
  ];
  return (
    <div className="page crm-page">
      <PageHeader title="Administration" subtitle={`${c.name}: its people, departments, tools and permissions. Each tool keeps its own roles; the server checks them.`} />
      {companyLinks.length ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Company</h2>
          <div className="row wrap">
            {companyLinks.map((l) => <a key={l.label} className="btn" href={l.href}><Icon name={l.icon} /> {l.label}</a>)}
          </div>
        </section>
      ) : c.kind === 'own' && c.role === 'owner' ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Your own company</h2>
          <p className="muted">It is not registered, so it has no people or departments of its own. Register your business to add them and to give each person a role in each tool.</p>
          <div className="row wrap">
            <Link className="btn" to={`/c/${c.id}/settings`}>Rename it</Link>
            <a className="btn primary" href={toolUrl('/company/new')}>Register a company</a>
          </div>
        </section>
      ) : c.kind === 'demo' ? (
        <p className="muted">This is your example company: invented data, only for you. Its tools are below; remove it under Example company.</p>
      ) : (
        <p className="muted">You were added to tools of {c.name}. Its administration is done by its owner.</p>
      )}
      {tools.length ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Tools</h2>
          <div className="stack">
            {toolAdmin.flatMap((l) => tools.filter((t) => t.app === l.app).map((t) => (
              <a key={`${l.app}:${t.id}`} className="nav-item" href={l.href(t.id)}><Icon name={APP_ICONS[l.app]} /> {l.label} <span className="muted small">({t.name})</span></a>
            )))}
          </div>
        </section>
      ) : null}
      <ExampleCard />
      <section className="card card-pad stack">
        <h2 className="crm-subhead">You</h2>
        <div className="row wrap"><a className="btn" href={toolUrl('/tasks/settings/profile')}><Icon name="user" /> Profile and security</a></div>
      </section>
      {me.data.platformRole ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Platform administration</h2>
          <p className="muted small">Every account and company on BIZOMAT, with activity across the tools.</p>
          <div className="row wrap"><Link className="btn" to="/admin/overview"><Icon name="shield" /> ERP console</Link></div>
        </section>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ super admin

const ADMIN_NAV = [
  { to: 'overview', label: 'Overview' },
  { to: 'users', label: 'Users' },
  { to: 'companies', label: 'Companies' },
  { to: 'activity', label: 'Activity' },
];

function AdminArea() {
  const me = useMe();
  if (me.error) return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  if (!me.data) return <Loading />;
  if (!me.data.platformRole) return <Navigate to="/" replace />;
  const founder = me.data.platformRole === 'founder';
  return (
    <div className="page crm-page">
      <PageHeader title="ERP console" subtitle="Every account and company on BIZOMAT, with their activity across the tools. Usage only: never the contents of anyone's records." />
      <nav className="tabs sys-tabs" aria-label="Console sections">
        {ADMIN_NAV.map((x) => <NavLink key={x.to} to={`/admin/${x.to}`} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>{x.label}</NavLink>)}
      </nav>
      <Routes>
        <Route path="overview" element={<AdminOverview founder={founder} />} />
        <Route path="users" element={<AdminUsers founder={founder} self={me.data.user.id} />} />
        <Route path="companies" element={<AdminCompanies founder={founder} />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </div>
  );
}

function Tile({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card card-pad sys-tile">
      <div className="muted small">{label}</div>
      <div className="sys-tile-value">{value}</div>
      {hint ? <div className="muted small">{hint}</div> : null}
    </div>
  );
}

function AdminOverview({ founder }: { founder: boolean }) {
  const q = useQuery({ queryKey: ['system', 'admin', 'overview'], queryFn: () => get<any>('/admin/system/overview') });
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const backfill = async () => {
    setBusy(true);
    try {
      const r = await post<{ made: number }>('/admin/system/backfill');
      toast(r.made ? `Made ${r.made} own ${r.made === 1 ? 'company' : 'companies'}` : 'Every account already has its own company');
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { users, companies, tools, cad } = q.data;
  return (
    <div className="stack">
      <div className="sys-tiles">
        <Tile label="Accounts" value={n(users.total)} hint={`${n(users.disabled ?? 0)} disabled · ${n(users.unconfirmed ?? 0)} email not confirmed`} />
        <Tile label="Active in 7 days" value={n(users.active7 ?? 0)} hint={`${n(users.active30 ?? 0)} in 30 days`} />
        <Tile label="Registered companies" value={n(companies.registered)} hint={`${n(companies.suspended)} suspended`} />
        <Tile label="Own companies" value={n(companies.own)} hint={`${n(Math.max(0, (users.total ?? 0) - (companies.own ?? 0)))} accounts without one yet`} />
        <Tile label="Example companies" value={n(companies.examples ?? 0)} hint="Invented data, one per person who opened the ERP; not counted below" />
        <Tile label="Project Management workspaces" value={n(tools.workspaces)} />
        <Tile label="CRM organisations" value={n(tools.crm)} />
        <Tile label="Finance workspaces" value={n(tools.finance)} />
        <Tile label="CAD Automation accounts reported" value={n(cad.accounts)} hint={cad.last ? `Last report ${timeAgo(cad.last)}` : 'No report yet'} />
      </div>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Own companies</h2>
        <p className="muted">Every account gets a company of its own the first time it opens the ERP (and every account that existed on 14 Nov 2026 got one then), and the daily maintenance run makes the rest. Each holds the tools that person owns outside a registered company. Nothing is copied: the tools stay where they are.</p>
        {founder ? <div className="row"><button className="btn" disabled={busy} onClick={backfill}>{busy ? 'Working…' : 'Make the missing own companies now'}</button></div> : <p className="muted small">Only the founder can run this.</p>}
      </section>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Each tool's own console</h2>
        <div className="row wrap">
          <a className="btn" href={toolUrl('/tasks/admin')}>Projects and Tasks console</a>
          <a className="btn" href={toolUrl('/crm/admin')}>Sales and CRM console</a>
          <a className="btn" href={toolUrl('/finance/admin')}>Finance console</a>
        </div>
      </section>
    </div>
  );
}

function Search({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="row sys-search">
      <Icon name="search" size={15} />
      <input className="input" type="search" value={value} placeholder={placeholder} aria-label={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function usePaged<T>(key: string, path: string, q: string) {
  const [offset, setOffset] = useState(0);
  useEffect(() => setOffset(0), [q]);
  const r = useQuery({ queryKey: ['system', 'admin', key, q, offset], queryFn: () => get<Record<string, unknown> & { more: boolean }>(`${path}?q=${encodeURIComponent(q)}&offset=${offset}`) });
  return { r, rows: ((r.data?.[key] as T[]) ?? []), offset, setOffset };
}

function Pager({ offset, more, setOffset }: { offset: number; more: boolean; setOffset: (n: number) => void }) {
  if (!offset && !more) return null;
  return (
    <div className="row">
      <button className="btn ghost sm" disabled={!offset} onClick={() => setOffset(Math.max(0, offset - 50))}>Previous</button>
      <span className="muted small">{offset + 1} to {offset + 50}</span>
      <button className="btn ghost sm" disabled={!more} onClick={() => setOffset(offset + 50)}>Next</button>
    </div>
  );
}

function AdminUsers({ founder, self }: { founder: boolean; self: string }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { r, rows, offset, setOffset } = usePaged<any>('users', '/admin/system/users', q.trim());
  const act = async (id: string, action: 'disable' | 'enable') => {
    try {
      await post(`/admin/system/users/${encodeURIComponent(id)}/${action}`);
      toast(action === 'disable' ? 'Account disabled and signed out everywhere' : 'Account enabled');
      await r.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <Search value={q} onChange={setQ} placeholder="Search by name or email" />
      {r.error ? <ErrorBox error={r.error} retry={() => r.refetch()} /> : !r.data ? <Loading /> : (
        <div className="sys-table-wrap">
          <table className="data-table responsive">
            <thead><tr><th>Account</th><th>Companies</th><th>Tools</th><th>CAD</th><th>Last active</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong>{u.platform_role ? <span className="badge accent sys-gap">{u.platform_role === 'founder' ? 'Founder' : 'Admin'}</span> : null}<div className="muted small">{u.email}</div></td>
                  <td className="small">{u.own_name ? <div>{u.own_name} <span className="muted">(own)</span></div> : <div className="muted">No own company yet</div>}{u.registered ? <div>{u.registered}</div> : null}</td>
                  <td className="small">PM {u.tasks} · CRM {u.crm} · Finance {u.finance}</td>
                  <td className="small">{u.cad ? 'Reported' : <span className="muted">None</span>}</td>
                  <td className="small">{when(u.last_active_at ?? u.last_login_at)}</td>
                  <td>{u.disabled_at ? <span className="badge danger">Disabled</span> : u.email_verified_at ? <span className="badge success">Active</span> : <span className="badge warning">Email not confirmed</span>}</td>
                  <td className="sys-actions">
                    <button className="btn ghost sm" onClick={() => navigate(`/admin/activity?user=${encodeURIComponent(u.id)}&name=${encodeURIComponent(u.name)}`)}>Activity</button>
                    {founder && u.id !== self && u.platform_role !== 'founder' ? (
                      u.disabled_at ? <button className="btn ghost sm" onClick={() => act(u.id, 'enable')}>Enable</button> : <button className="btn ghost sm danger-text" onClick={() => { if (window.confirm(`Disable ${u.email}? They are signed out everywhere.`)) void act(u.id, 'disable'); }}>Disable</button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={7} className="muted">No accounts match.</td></tr> : null}
            </tbody>
          </table>
        </div>
      )}
      <Pager offset={offset} more={!!r.data?.more} setOffset={setOffset} />
    </div>
  );
}

function AdminCompanies({ founder }: { founder: boolean }) {
  const [q, setQ] = useState('');
  const toast = useToast();
  const { r, rows, offset, setOffset } = usePaged<any>('companies', '/admin/system/companies', q.trim());
  const act = async (id: string, action: 'suspend' | 'resume') => {
    try {
      await post(`/admin/system/companies/${encodeURIComponent(id)}/${action}`);
      toast(action === 'suspend' ? 'Company suspended' : 'Company resumed');
      await r.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <Search value={q} onChange={setQ} placeholder="Search by company or owner email" />
      {r.error ? <ErrorBox error={r.error} retry={() => r.refetch()} /> : !r.data ? <Loading /> : (
        <div className="sys-table-wrap">
          <table className="data-table responsive">
            <thead><tr><th>Company</th><th>Kind</th><th>Owner</th><th className="num">People</th><th className="num">Tools</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((co) => (
                <tr key={`${co.kind}:${co.id}`}>
                  <td><strong>{co.name}</strong><div className="muted small">Since {new Date(co.created_at).toLocaleDateString()}</div></td>
                  <td className="small">{co.kind === 'registered' ? 'Registered' : 'Own (not registered)'}</td>
                  <td className="small">{co.owner_name ?? '—'}<div className="muted">{co.owner_email ?? ''}</div></td>
                  <td className="num">{co.people}</td>
                  <td className="num">{co.tools}</td>
                  <td>{co.kind !== 'registered' ? <span className="muted small">—</span> : co.suspended_at ? <span className="badge danger">Suspended</span> : <span className="badge success">Active</span>}</td>
                  <td className="sys-actions">
                    {founder && co.kind === 'registered' ? (
                      co.suspended_at ? <button className="btn ghost sm" onClick={() => act(co.id, 'resume')}>Resume</button> : <button className="btn ghost sm danger-text" onClick={() => { if (window.confirm(`Suspend ${co.name}?`)) void act(co.id, 'suspend'); }}>Suspend</button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={7} className="muted">No companies match.</td></tr> : null}
            </tbody>
          </table>
        </div>
      )}
      <Pager offset={offset} more={!!r.data?.more} setOffset={setOffset} />
    </div>
  );
}

const ACTIVITY_APPS = [
  { id: '', label: 'Every tool' },
  { id: 'tasks', label: 'Project Management' },
  { id: 'crm', label: 'CRM' },
  { id: 'finance', label: 'Finance' },
  { id: 'company', label: 'Company accounts' },
  { id: 'sign-in', label: 'Sign-ins' },
];

function AdminActivity() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const user = params.get('user') ?? '';
  const userName = params.get('name') ?? '';
  const [app, setApp] = useState('');
  const [pages, setPages] = useState<number[]>([]);
  const before = pages[pages.length - 1];
  useEffect(() => setPages([]), [app, user]);
  const q = useQuery({
    queryKey: ['system', 'admin', 'activity', app, user, before],
    queryFn: () => get<{ events: { app: string; action: string; target_type: string | null; at: number; actor_id: string | null; place: string | null; actor_name: string | null; actor_email: string | null }[] }>(`/admin/system/activity?app=${encodeURIComponent(app)}&user=${encodeURIComponent(user)}${before ? `&before=${before}` : ''}`),
  });
  const events = q.data?.events ?? [];
  return (
    <div className="stack">
      <div className="row wrap">
        <label className="row small">Tool
          <select className="select" value={app} onChange={(e) => setApp(e.target.value)}>
            {ACTIVITY_APPS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </label>
        {user ? <span className="badge accent">{userName || 'One account'} <button className="btn ghost sm" aria-label="Show everyone" onClick={() => navigate('/admin/activity')}>×</button></span> : null}
        <span className="grow" />
        <button className="btn ghost sm" onClick={() => q.refetch()}><Icon name="refresh" size={14} /> Refresh</button>
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : (
        <div className="sys-table-wrap">
          <table className="data-table responsive">
            <thead><tr><th>When</th><th>Who</th><th>Tool</th><th>What</th><th>Where</th></tr></thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={`${e.at}:${i}`}>
                  <td className="small" title={new Date(e.at).toLocaleString()}>{timeAgo(e.at)}</td>
                  <td className="small">{e.actor_name ?? <span className="muted">System</span>}<div className="muted">{e.actor_email ?? ''}</div></td>
                  <td className="small">{ACTIVITY_APPS.find((a) => a.id === e.app)?.label ?? e.app}</td>
                  <td className="small"><code>{e.action}</code>{e.target_type ? <span className="muted"> · {e.target_type}</span> : null}</td>
                  <td className="small">{e.place ?? <span className="muted">—</span>}</td>
                </tr>
              ))}
              {!events.length ? <tr><td colSpan={5} className="muted">No activity.</td></tr> : null}
            </tbody>
          </table>
        </div>
      )}
      <div className="row">
        <button className="btn ghost sm" disabled={!pages.length} onClick={() => setPages((p) => p.slice(0, -1))}>Newer</button>
        <button className="btn ghost sm" disabled={events.length < 100} onClick={() => setPages((p) => [...p, events[events.length - 1].at])}>Older</button>
      </div>
    </div>
  );
}
