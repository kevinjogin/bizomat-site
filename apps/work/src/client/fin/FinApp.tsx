// BIZOMAT Finance: the app served under /finance by the same SPA and API as Project Management and the CRM, on the same
// sign-in. Routes (inside the /finance base): /, /start, /join/:token, /o/:orgId/<page>. The sign-in pages are shared.
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post } from '../lib/api';
import { appUrl } from '../lib/base';
import { useSession } from '../lib/session';
import { applyTheme, storedTheme, usePageTitle, type ThemePref } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { BRAND, PLATFORM_URLS } from '../lib/brand';
import { BrandMark, Icon, ProductLockup } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, Popover, useToast } from '../components/ui/overlays';
import { PlatformFooter } from '../components/layout/PlatformLinks';
import { CompanyPrompt } from '../components/layout/CompanyPrompt';
import { CURRENCIES } from '../../shared/money';
import { FIN_ROLE_LABELS, WORKSPACE_KIND_LABELS, type FinPerms, type WorkspaceKind } from '../../shared/fin/roles';
import { fin, lastOrg, rememberOrg, useFinOrg, useFinOrgs, type FinNotificationDTO, type FinOrgDTO } from './lib';
import '../styles/crm.css';
import '../styles/fin.css';

const Dashboard = lazy(() => import('./Dashboard').then((m) => ({ default: m.Dashboard })));
const Transactions = lazy(() => import('./Transactions').then((m) => ({ default: m.Transactions })));
const TransactionPage = lazy(() => import('./Transactions').then((m) => ({ default: m.TransactionPage })));
const BankAccounts = lazy(() => import('./Banking').then((m) => ({ default: m.BankAccounts })));
const AccountPage = lazy(() => import('./Banking').then((m) => ({ default: m.AccountPage })));
const DocList = lazy(() => import('./Docs').then((m) => ({ default: m.DocList })));
const DocPage = lazy(() => import('./Docs').then((m) => ({ default: m.DocPage })));
const Contacts = lazy(() => import('./Contacts').then((m) => ({ default: m.Contacts })));
const ContactPage = lazy(() => import('./Contacts').then((m) => ({ default: m.ContactPage })));
const Reports = lazy(() => import('./Reports').then((m) => ({ default: m.Reports })));
const ReportPage = lazy(() => import('./Reports').then((m) => ({ default: m.ReportPage })));
const Budgets = lazy(() => import('./Plan').then((m) => ({ default: m.Budgets })));
const BudgetPage = lazy(() => import('./Plan').then((m) => ({ default: m.BudgetPage })));
const Goals = lazy(() => import('./Plan').then((m) => ({ default: m.Goals })));
const Recurring = lazy(() => import('./Plan').then((m) => ({ default: m.Recurring })));
const Documents = lazy(() => import('./Documents').then((m) => ({ default: m.Documents })));
const Accounting = lazy(() => import('./Accounting').then((m) => ({ default: m.Accounting })));
const Team = lazy(() => import('./Team').then((m) => ({ default: m.Team })));
const Settings = lazy(() => import('./Settings').then((m) => ({ default: m.Settings })));

interface NavEntry {
  to: string;
  label: string;
  icon: string;
  show?: (p: FinPerms, org: FinOrgDTO) => boolean;
}

const business = (o: FinOrgDTO) => o.kind === 'business';

const NAV: NavEntry[] = [
  { to: 'dashboard', label: 'Dashboard', icon: 'home' },
  { to: 'transactions', label: 'Transactions', icon: 'list', show: (p) => p.banking.view !== 'none' },
  { to: 'banking', label: 'Bank accounts', icon: 'building', show: (p) => p.banking.view !== 'none' },
  { to: 'invoices', label: 'Invoices', icon: 'doc', show: (p, o) => business(o) && p.sales.view !== 'none' },
  { to: 'bills', label: 'Bills', icon: 'file', show: (p, o) => business(o) && p.purchases.view !== 'none' },
  { to: 'purchase-orders', label: 'Purchase orders', icon: 'checkSquare', show: (p, o) => business(o) && p.purchases.view !== 'none' },
  { to: 'expense-claims', label: 'Expense claims', icon: 'dollar', show: (p, o) => business(o) && p.purchases.view !== 'none' },
  { to: 'contacts', label: 'Customers and suppliers', icon: 'users', show: (p, o) => business(o) && p.contacts.view !== 'none' },
  { to: 'reports', label: 'Reports', icon: 'chart', show: (p) => p.reports.view },
  { to: 'budgets', label: 'Budgets', icon: 'target', show: (p) => p.budgets.view },
  { to: 'goals', label: 'Savings goals', icon: 'trophy', show: (p) => p.budgets.view },
  { to: 'recurring', label: 'Recurring', icon: 'refresh', show: (p) => p.banking.create || p.sales.create || p.purchases.create },
  { to: 'documents', label: 'Documents', icon: 'folder', show: (p) => p.documents.view !== 'none' },
  { to: 'accounting', label: 'Accounting', icon: 'layers', show: (p) => p.accounting.view },
  { to: 'team', label: 'Team', icon: 'users' },
  { to: 'settings', label: 'Settings', icon: 'settings' },
];

function page(el: ReactNode) {
  return <Suspense fallback={<Loading />}>{el}</Suspense>;
}

/** Finance's routes, for the signed-in area (App.tsx gives the sign-in pages and the session gate). */
export function FinRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FinHome />} />
      <Route path="/start" element={<Start />} />
      <Route path="/o/:orgId/*" element={<OrgArea />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** "/": the last workspace used, else the first, else the start page. */
function FinHome() {
  const q = useFinOrgs();
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data) return <Loading label={`Loading ${BRAND.full}…`} />;
  const last = lastOrg();
  const org = q.data.orgs.find((o) => o.id === last) ?? q.data.orgs[0];
  if (!org || q.data.invitations.length) return <Navigate to="/start" replace />;
  return <Navigate to={`/o/${org.id}/dashboard`} replace />;
}

function OrgArea() {
  const { orgId = '' } = useParams();
  const q = useFinOrg(orgId);
  useEffect(() => {
    if (q.data) rememberOrg(q.data.id);
  }, [q.data]);
  if (q.error) {
    if (q.error instanceof ApiError && q.error.status === 404) return <Navigate to="/" replace />;
    return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  }
  if (!q.data) return <Loading label="Opening the workspace…" />;
  return (
    <FinShell>
      <Routes>
        <Route path="dashboard" element={page(<Dashboard />)} />
        <Route path="transactions" element={page(<Transactions />)} />
        <Route path="transactions/:id" element={page(<TransactionPage />)} />
        <Route path="banking" element={page(<BankAccounts />)} />
        <Route path="banking/:accountId" element={page(<AccountPage />)} />
        <Route path="invoices" element={page(<DocList kind="invoice" />)} />
        <Route path="invoices/:id" element={page(<DocPage kind="invoice" />)} />
        <Route path="bills" element={page(<DocList kind="bill" />)} />
        <Route path="bills/:id" element={page(<DocPage kind="bill" />)} />
        <Route path="purchase-orders" element={page(<DocList kind="purchase_order" />)} />
        <Route path="purchase-orders/:id" element={page(<DocPage kind="purchase_order" />)} />
        <Route path="expense-claims" element={page(<DocList kind="expense_claim" />)} />
        <Route path="expense-claims/:id" element={page(<DocPage kind="expense_claim" />)} />
        <Route path="contacts" element={page(<Contacts />)} />
        <Route path="contacts/:id" element={page(<ContactPage />)} />
        <Route path="reports" element={page(<Reports />)} />
        <Route path="reports/:key" element={page(<ReportPage />)} />
        <Route path="budgets" element={page(<Budgets />)} />
        <Route path="budgets/:id" element={page(<BudgetPage />)} />
        <Route path="goals" element={page(<Goals />)} />
        <Route path="recurring" element={page(<Recurring />)} />
        <Route path="documents" element={page(<Documents />)} />
        <Route path="accounting" element={<Navigate to="chart" replace />} />
        <Route path="accounting/:tab" element={page(<Accounting />)} />
        <Route path="team" element={page(<Team />)} />
        <Route path="settings" element={<Navigate to="workspace" replace />} />
        <Route path="settings/:tab" element={page(<Settings />)} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </FinShell>
  );
}

function FinShell({ children }: { children: ReactNode }) {
  const org = useFinOrg().data!;
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const base = `/o/${org.id}`;
  useEffect(() => setNavOpen(false), [location.pathname]);
  return (
    <div className={`shell crm-shell fin-shell${navOpen ? ' nav-open' : ''}`}>
      <header className="topbar">
        <button className="btn ghost icon mobile-only" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
          <Icon name="menu" />
        </button>
        <Link to={`${base}/dashboard`} className="brand" aria-label={`${BRAND.full} home`}>
          <span className="mobile-only"><BrandMark size={28} /></span>
          <span className="desktop-only"><ProductLockup height={15} /></span>
        </Link>
        <OrgSwitcher />
        <div className="spacer" />
        <Bell />
        <ThemeButton />
        <Profile />
      </header>
      <nav className="sidebar" aria-label="Finance navigation">
        {NAV.filter((n) => !n.show || n.show(org.perms, org)).map((n) => (
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
        <a className="nav-item" href={PLATFORM_URLS.crm}>
          <Icon name="briefcase" /> Customer Relationship Management
        </a>
        <a className="nav-item" href={PLATFORM_URLS.financeGuide}>
          <Icon name="help" /> Finance user guide
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

function OrgInitial({ name, kind, url }: { name: string; kind: WorkspaceKind; url: string | null }) {
  return url ? <img src={appUrl(url)} alt="" className="crm-org-logo" /> : <span className={`crm-org-logo crm-org-initial fin-org-initial ${kind}`} aria-hidden>{name[0]?.toUpperCase()}</span>;
}

function OrgSwitcher() {
  const org = useFinOrg().data!;
  const orgs = useFinOrgs();
  const navigate = useNavigate();
  const unread = useQuery({ queryKey: ['fin', 'unread'], queryFn: () => get<Record<string, number>>('/fin/me/unread'), refetchInterval: 60_000 });
  return (
    <Dropdown
      width={300}
      label="Workspaces"
      trigger={(open, ref) => (
        <button ref={ref} className="btn ws-switcher crm-org-switcher" onClick={open} aria-label={`Workspace: ${org.name}. Switch workspace`}>
          <OrgInitial name={org.name} kind={org.kind} url={org.logoUrl} />
          <span className="ellipsis">{org.name}</span>
          <Icon name="chevronDown" size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="menu-label">Your workspaces</div>
          {(orgs.data?.orgs ?? []).map((o) => (
            <MenuItem key={o.id} active={o.id === org.id} onClick={() => { close(); navigate(`/o/${o.id}/dashboard`); }}>
              <span className="grow ellipsis">{o.name}</span>
              <span className="muted small">{WORKSPACE_KIND_LABELS[o.kind]}</span>
              {unread.data?.[o.id] ? <span className="badge danger">{unread.data[o.id]}</span> : null}
            </MenuItem>
          ))}
          <MenuSep />
          <MenuItem icon="plus" onClick={() => { close(); navigate('/start'); }}>Create or join a workspace</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

function Bell() {
  const org = useFinOrg().data!;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const anchor = useState<HTMLButtonElement | null>(null);
  const q = useQuery({ queryKey: ['fin', org.id, 'notifications'], queryFn: () => get<{ unread: number; items: FinNotificationDTO[] }>(fin(org.id, '/notifications')), refetchInterval: 30_000 });
  const readAll = async () => {
    await post(fin(org.id, '/notifications/read'), {});
    q.refetch();
    qc.invalidateQueries({ queryKey: ['fin', 'unread'] });
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
            {(q.data?.items ?? []).slice(0, 12).map((n) => (
              <button key={n.id} className={`crm-notif${n.readAt ? '' : ' unread'}`} onClick={() => {
                setOpen(false);
                if (!n.readAt) post(fin(org.id, '/notifications/read'), { ids: [n.id] }).then(() => { q.refetch(); qc.invalidateQueries({ queryKey: ['fin', 'unread'] }); });
                if (n.link) navigate(n.link);
              }}>
                <span className="crm-notif-title">{n.title}</span>
                <span className="muted small">{timeAgo(n.createdAt)}</span>
              </button>
            ))}
            {q.data && !q.data.items.length ? <p className="muted small crm-pad">Nothing yet.</p> : null}
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
  const org = useFinOrg().data!;
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
            <div className="muted small">{FIN_ROLE_LABELS[org.role]} in {org.name}</div>
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

const KIND_TEXT: Record<WorkspaceKind, string> = {
  personal: 'Your own money: accounts, spending, budgets and savings goals. Private to you unless you invite someone.',
  household: 'Money shared at home: everyone you invite sees the household accounts, budgets and reports.',
  business: 'A business: chart of accounts, GST, invoices, bills, purchase orders, expense claims and financial reports.',
};

function Start() {
  const { session } = useSession();
  const orgs = useFinOrgs();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  usePageTitle('Start');
  const [f, setF] = useState({ kind: 'personal' as WorkspaceKind, name: '', currency: 'AUD', fyStartMonth: 7, gstRegistered: false, abn: '', legalName: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Australia/Sydney' });
  const [busy, setBusy] = useState(false);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body: Record<string, unknown> = { kind: f.kind, name: f.name, currency: f.currency, fyStartMonth: f.fyStartMonth, timezone: f.timezone };
      if (f.kind === 'business') Object.assign(body, { gstRegistered: f.gstRegistered, abn: f.abn, legalName: f.legalName });
      const r = await post<{ id: string }>('/fin/orgs', body);
      await qc.invalidateQueries({ queryKey: ['fin', 'orgs'] });
      navigate(`/o/${r.id}/dashboard`);
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const months = Array.from({ length: 12 }, (_, i) => new Date(2026, i, 1).toLocaleDateString('en-AU', { month: 'long' }));
  return (
    <div className="crm-start">
      <header className="row crm-start-head">
        <ProductLockup height={18} />
        <span className="grow" />
        <span className="muted small">{session?.user.email}</span>
      </header>
      <div className="page crm-page">
        <PageHeader title="Your Finance workspaces" subtitle="Each workspace keeps its own accounts, transactions, budgets and reports, with its own members and permissions. Keep personal, household and business money apart, as many businesses as you need, with one BIZOMAT login." />
        {orgs.data?.invitations.length ? (
          <section className="card card-pad stack">
            <h2 className="crm-subhead">Invitations for {session?.user.email}</h2>
            {orgs.data.invitations.map((i) => (
              <div key={i.id} className="row wrap crm-invite-row">
                <div className="grow">
                  <strong>{i.orgName}</strong> ({WORKSPACE_KIND_LABELS[i.orgKind]}) as {FIN_ROLE_LABELS[i.role]}
                  <div className="muted small">{i.inviter ? `From ${i.inviter}, ` : ''}{timeAgo(i.createdAt)}. Open the link in the invitation email to accept.</div>
                </div>
                <button className="btn sm" onClick={async () => { await post(`/fin/me/invitations/${i.id}/decline`).catch((e) => toast(errorMessage(e), 'error')); orgs.refetch(); }}>Decline</button>
              </div>
            ))}
          </section>
        ) : null}
        {orgs.data?.orgs.length ? (
          <div className="grid-cards">
            {orgs.data.orgs.map((o) => (
              <Link key={o.id} to={`/o/${o.id}/dashboard`} className="tile">
                <div className="row"><OrgInitial name={o.name} kind={o.kind} url={o.logoUrl} /><strong className="ellipsis">{o.name}</strong></div>
                <span className="muted small">{WORKSPACE_KIND_LABELS[o.kind]} · {FIN_ROLE_LABELS[o.role]} · {o.memberCount} {o.memberCount === 1 ? 'member' : 'members'}</span>
              </Link>
            ))}
          </div>
        ) : null}
        <form className="card card-pad stack crm-start-form" onSubmit={create}>
          <h2 className="crm-subhead">{orgs.data?.orgs.length ? 'Create another workspace' : 'Create your first workspace'}</h2>
          <fieldset className="fin-kind-choice" aria-label="Kind of workspace">
            {(['personal', 'household', 'business'] as WorkspaceKind[]).map((k) => (
              <label key={k}>
                <input type="radio" name="kind" value={k} checked={f.kind === k} onChange={() => setF({ ...f, kind: k, fyStartMonth: 7 })} />
                <strong>{WORKSPACE_KIND_LABELS[k]}</strong>
                <span className="muted small">{KIND_TEXT[k]}</span>
              </label>
            ))}
          </fieldset>
          <div className="crm-form-grid">
            <div className="field crm-span"><label htmlFor="ws-name">Workspace name</label><input id="ws-name" className="input" required maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder={f.kind === 'business' ? 'For example: Harbour Design Pty Ltd' : f.kind === 'household' ? 'For example: Our household' : 'For example: My money'} /></div>
            <div className="field"><label htmlFor="ws-currency">Currency</label><select id="ws-currency" className="select" value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}: {c.name}</option>)}</select></div>
            <div className="field"><label htmlFor="ws-fy">Financial year starts in</label><select id="ws-fy" className="select" value={f.fyStartMonth} onChange={(e) => setF({ ...f, fyStartMonth: Number(e.target.value) })}>{months.map((m, i) => <option key={m} value={i + 1}>{m}{i === 6 ? ' (Australia)' : ''}</option>)}</select></div>
            {f.kind === 'business' ? (
              <>
                <div className="field"><label htmlFor="ws-legal">Legal name</label><input id="ws-legal" className="input" maxLength={160} value={f.legalName} onChange={(e) => setF({ ...f, legalName: e.target.value })} /></div>
                <div className="field"><label htmlFor="ws-abn">ABN</label><input id="ws-abn" className="input" inputMode="numeric" maxLength={20} value={f.abn} onChange={(e) => setF({ ...f, abn: e.target.value.replace(/[^0-9 ]/g, '') })} placeholder="11 digits" /></div>
                <label className="row crm-span"><input type="checkbox" checked={f.gstRegistered} onChange={(e) => setF({ ...f, gstRegistered: e.target.checked })} /> Registered for GST (GST is worked out on each line, with the standard Australian tax codes)</label>
              </>
            ) : null}
          </div>
          <p className="muted small">You become its owner. It starts with a chart of accounts {f.kind === 'business' ? 'for a business, with the standard Australian tax codes' : 'of everyday categories'}; you can rename, add and archive categories. No sample records are added.</p>
          <div><button className="btn primary" type="submit" disabled={busy || !f.name.trim()}>{busy ? 'Creating…' : 'Create workspace'}</button></div>
        </form>
        <p className="muted small">BIZOMAT Finance never connects to your bank and never asks for internet banking passwords: you import statements you download yourself. It records payments; it does not make them.</p>
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
  const preview = useQuery({ queryKey: ['fin', 'invite', token], queryFn: () => get<{ orgName: string; orgKind: WorkspaceKind; inviter: string | null; roleLabel: string; email: string; status: string; message: string }>(`/fin-public/invitations/${encodeURIComponent(token)}`), retry: false });
  usePageTitle('Invitation');
  const next = encodeURIComponent(`/join/${token}`);
  const accept = async () => {
    try {
      const r = await post<{ orgId: string }>(`/fin/invitations/${encodeURIComponent(token)}/accept`);
      await qc.invalidateQueries({ queryKey: ['fin', 'orgs'] });
      navigate(`/o/${r.orgId}/dashboard`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const decline = async () => {
    try {
      await post(`/fin/invitations/${encodeURIComponent(token)}/decline`);
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
            <p className="muted">{p.inviter ?? 'Someone'} invited {p.email} to the {WORKSPACE_KIND_LABELS[p.orgKind].toLowerCase()} workspace {p.orgName} in {BRAND.full} as {p.roleLabel}.</p>
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

// ------------------------------------------------------------------ notifications

function NotificationsPage() {
  const org = useFinOrg().data!;
  const navigate = useNavigate();
  const qc = useQueryClient();
  usePageTitle('Notifications');
  const q = useQuery({ queryKey: ['fin', org.id, 'notifications'], queryFn: () => get<{ unread: number; items: FinNotificationDTO[] }>(fin(org.id, '/notifications')) });
  return (
    <div className="page crm-page">
      <PageHeader
        title="Notifications"
        icon="bell"
        actions={q.data?.unread ? <button className="btn" onClick={async () => { await post(fin(org.id, '/notifications/read'), {}); q.refetch(); qc.invalidateQueries({ queryKey: ['fin', 'unread'] }); }}>Mark all read</button> : null}
      />
      {!q.data ? <Loading /> : !q.data.items.length ? <EmptyState icon="bell" title="No notifications">Approvals, invoices and bills falling due, budget warnings, monthly summaries and scheduled reports appear here.</EmptyState> : (
        <div className="card">
          {q.data.items.map((n) => (
            <button key={n.id} className={`crm-notif wide${n.readAt ? '' : ' unread'}`} onClick={async () => { if (!n.readAt) await post(fin(org.id, '/notifications/read'), { ids: [n.id] }); q.refetch(); qc.invalidateQueries({ queryKey: ['fin', 'unread'] }); if (n.link) navigate(n.link); }}>
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
