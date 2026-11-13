// The shell of the CRM and Finance super admin consoles, the same as the Project Management founder console
// (src/client/admin/AdminApp.tsx): the same people (platform admins), the same layout and styles, a 404 page for
// everyone else (the server answers 404 to them too). Links lead between the three consoles.
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ApiError } from '../../lib/api';
import { Icon, Wordmark } from '../../components/ui/Icon';
import { pageTitle } from '../../lib/brand';
import { appUrl } from '../../lib/base';
import { Avatar, ErrorBox } from '../../components/ui/ui';
import { useAdmin } from '../api';
import { PageSkeleton, num } from '../ui';
import { NotFound } from '../AdminApp';
import '../../styles/admin-console.css';

export interface AdminMe {
  user: { id: string; name: string; email: string };
  role: 'founder' | 'admin';
}

export interface ConsoleNav {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

/** The three consoles, by product. Paths are absolute on bizomat.ai (each product is its own mount of the app). */
const CONSOLES = [
  { key: 'tasks', label: 'Project Management console', href: '/tasks/admin' },
  { key: 'crm', label: 'CRM super admin', href: '/crm/admin' },
  { key: 'finance', label: 'Finance super admin', href: '/finance/admin' },
] as const;

export function ConsoleShell({ product, productKey, nav, privacy, children }: { product: string; productKey: 'crm' | 'finance'; nav: ConsoleNav[]; privacy: ReactNode; children: (me: AdminMe) => ReactNode }) {
  const me = useAdmin<AdminMe>('/me', { retry: false, staleTime: 60_000 });
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => setNavOpen(false), [location.pathname]);
  useEffect(() => {
    if (me.data) document.title = pageTitle('Super admin');
  }, [me.data]);

  if (me.isLoading) return <div className="ac-boot"><span className="spinner" aria-label="Loading" /></div>;
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) return <NotFound />;
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  const admin = me.data!;
  const range = new URLSearchParams(location.search).get('range');
  const rangeQuery = range ? `?range=${encodeURIComponent(range)}` : '';
  const current = nav.find((n) => (n.end ? location.pathname === n.to || location.pathname === `${n.to}/` : location.pathname.startsWith(n.to)));

  return (
    <div className={`ac-shell${navOpen ? ' nav-open' : ''}`}>
      <aside className="ac-side" aria-label="Super admin navigation">
        <Link to="/admin" className="ac-brand" aria-label={`BIZOMAT ${product} super admin`}>
          <Wordmark height={16} />
          <span className="ac-brand-sub">
            {product}
            <br />
            Super admin
          </span>
        </Link>
        <nav className="ac-nav">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to + rangeQuery} end={n.end} className={({ isActive }) => `ac-nav-item${isActive ? ' active' : ''}`}>
              <Icon name={n.icon} size={17} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ac-side-foot">
          <div className="ac-nav-section muted small">Other consoles</div>
          {CONSOLES.filter((x) => x.key !== productKey).map((x) => (
            <a key={x.key} href={x.href} className="ac-nav-item">
              <Icon name="layers" size={17} /> {x.label}
            </a>
          ))}
          <a href={appUrl('/')} className="ac-nav-item">
            <Icon name="chevronLeft" size={17} /> Back to {product}
          </a>
          <div className="ac-privacy-note">{privacy}</div>
        </div>
      </aside>
      <div className="ac-main">
        <header className="ac-top">
          <button className="btn ghost icon ac-menu" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
            <Icon name="menu" />
          </button>
          <h1 className="ac-title">{current?.label ?? 'Super admin'}</h1>
          <span className="spacer" />
          <div className="ac-who">
            <Avatar id={admin.user.id} name={admin.user.name} size="sm" />
            <span className="ac-who-text">
              <span className="ellipsis">{admin.user.email}</span>
              <span className={`ac-role ${admin.role}`}>{admin.role === 'founder' ? 'Super admin (founder)' : 'Admin'}</span>
            </span>
          </div>
        </header>
        <main className="ac-content" id="admin-main">
          <Suspense fallback={<PageSkeleton />}>{children(admin)}</Suspense>
        </main>
      </div>
      {navOpen ? <div className="ac-scrim" onClick={() => setNavOpen(false)} aria-hidden /> : null}
    </div>
  );
}

/** A count of bytes as KB, MB or GB. */
export function bytes(nb: number): string {
  if (nb < 1024) return `${nb} B`;
  if (nb < 1024 ** 2) return `${(nb / 1024).toFixed(1)} KB`;
  if (nb < 1024 ** 3) return `${(nb / 1024 ** 2).toFixed(1)} MB`;
  return `${(nb / 1024 ** 3).toFixed(2)} GB`;
}

/** An action from an audit trail in words: "transaction.created" -> "transaction created". */
export function actionLabel(action: string): string {
  return action.replace(/_/g, ' ').replace(/\./g, ' ');
}

export const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  manager: 'Manager',
  sales: 'Sales Executive',
  member: 'Member',
  viewer: 'Viewer',
  accountant: 'Accountant',
  finance_manager: 'Finance Manager',
  contributor: 'Contributor',
};

/** The health checks of a console: each a count that should be zero, with what it means. */
export function HealthChecks({ checks }: { checks: { key: string; label: string; value: number; ok: boolean; hint: string }[] }) {
  return (
    <ul className="ac-list">
      {checks.map((c) => (
        <li key={c.key}>
          <span className={`ac-pill ${c.ok ? 'success' : 'danger'}`}>{c.ok ? 'OK' : 'Check'}</span>
          <span className="grow">
            <strong>{c.label}: {num(c.value)}</strong>
            <span className="muted small"> {c.hint}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
