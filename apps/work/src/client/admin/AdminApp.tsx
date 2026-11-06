import { lazy, Suspense, useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation, Link } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { Icon, Wordmark } from '../components/ui/Icon';
import { BRAND, pageTitle } from '../lib/brand';
import { Avatar, ErrorBox } from '../components/ui/ui';
import { useAdmin } from './api';
import { PageSkeleton } from './ui';
import '../styles/admin-console.css';

const Overview = lazy(() => import('./pages/Overview'));
const Users = lazy(() => import('./pages/Users'));
const UserDetail = lazy(() => import('./pages/UserDetail'));
const Sessions = lazy(() => import('./pages/Sessions'));
const Activity = lazy(() => import('./pages/Activity'));
const Projects = lazy(() => import('./pages/Projects'));
const Adoption = lazy(() => import('./pages/Adoption'));
const Health = lazy(() => import('./pages/Health'));
const Settings = lazy(() => import('./pages/Settings'));

interface AdminMe {
  user: { id: string; name: string; email: string };
  role: 'founder' | 'admin';
  heartbeatIntervalMs: number;
  activeWindowMs: number;
}

const NAV: { to: string; label: string; icon: string; end?: boolean }[] = [
  { to: '/admin', label: 'Overview', icon: 'chart', end: true },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/sessions', label: 'Live Sessions', icon: 'activity' },
  { to: '/admin/activity', label: 'Activity', icon: 'clock' },
  { to: '/admin/projects', label: 'Projects', icon: 'grid' },
  { to: '/admin/adoption', label: 'Adoption Analytics', icon: 'target' },
  { to: '/admin/health', label: 'System Health', icon: 'shield' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export function NotFound() {
  useEffect(() => {
    document.title = pageTitle('Page not found');
  }, []);
  return (
    <div className="ac-notfound">
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <a className="btn" href="/">Go home</a>
    </div>
  );
}

export default function AdminApp() {
  const me = useAdmin<AdminMe>('/me', { retry: false, staleTime: 60_000 });
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => setNavOpen(false), [location.pathname]);
  useEffect(() => {
    if (me.data) document.title = pageTitle('Founder console');
  }, [me.data]);

  if (me.isLoading) return <div className="ac-boot"><span className="spinner" aria-label="Loading" /></div>;
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) return <NotFound />;
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  const admin = me.data!;
  const range = new URLSearchParams(location.search).get('range');
  const rangeQuery = range ? `?range=${encodeURIComponent(range)}` : '';
  const current = NAV.find((n) => (n.end ? location.pathname === n.to || location.pathname === n.to + '/' : location.pathname.startsWith(n.to)));

  return (
    <div className={`ac-shell${navOpen ? ' nav-open' : ''}`}>
      <aside className="ac-side" aria-label="Founder console navigation">
        <Link to="/admin" className="ac-brand" aria-label={`${BRAND.full} founder console`}>
          <Wordmark height={16} />
          <span className="ac-brand-sub">
            {BRAND.product}
            <br />
            Founder console
          </span>
        </Link>
        <nav className="ac-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to + rangeQuery} end={n.end} className={({ isActive }) => `ac-nav-item${isActive ? ' active' : ''}`}>
              <Icon name={n.icon} size={17} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ac-side-foot">
          <a href="/" className="ac-nav-item">
            <Icon name="chevronLeft" size={17} /> Back to {BRAND.product}
          </a>
          <div className="ac-privacy-note">
            Analytics follow the <a href="/privacy">privacy notice</a>. Passwords, tokens and content are never shown.
          </div>
        </div>
      </aside>
      <div className="ac-main">
        <header className="ac-top">
          <button className="btn ghost icon ac-menu" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
            <Icon name="menu" />
          </button>
          <h1 className="ac-title">{current?.label ?? 'Founder console'}</h1>
          <span className="spacer" />
          <div className="ac-who">
            <Avatar id={admin.user.id} name={admin.user.name} size="sm" />
            <span className="ac-who-text">
              <span className="ellipsis">{admin.user.email}</span>
              <span className={`ac-role ${admin.role}`}>{admin.role === 'founder' ? 'Founder' : 'Admin'}</span>
            </span>
          </div>
        </header>
        <main className="ac-content" id="admin-main">
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route index element={<Overview />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:userId" element={<UserDetail />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="activity" element={<Activity />} />
              <Route path="projects" element={<Projects />} />
              <Route path="adoption" element={<Adoption />} />
              <Route path="health" element={<Health />} />
              <Route path="settings" element={<Settings role={admin.role} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      {navOpen ? <div className="ac-scrim" onClick={() => setNavOpen(false)} aria-hidden /> : null}
    </div>
  );
}
