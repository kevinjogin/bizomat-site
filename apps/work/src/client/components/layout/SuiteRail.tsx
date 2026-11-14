// BIZOMAT System's module rail: one system (owner, 14 Nov 2026). Inside the System every tool opens at
// /system/<tool> (src/worker/mount.ts), and this rail sits at the left of each one (Project Management, the CRM,
// Finance, Company accounts and the System's own pages), so moving between them never leaves the System. On a phone it
// is a bar along the bottom. Each tool keeps its own navigation beside it; nothing here changes who may see what.
import { Link, useLocation } from 'react-router-dom';
import { APP_BASE, BASE, SUITE } from '../../lib/base';
import { IS_SYSTEM } from '../../lib/brand';
import { useSession } from '../../lib/session';
import { BrandMark, Icon } from '../ui/Icon';

interface Module {
  id: string;
  label: string;
  title: string;
  icon: string;
  /** Its address inside the System. */
  href: string;
  active: (systemPath: string) => boolean;
  admin?: boolean;
}

const MODULES: Module[] = [
  { id: 'home', label: 'Home', title: 'BIZOMAT System home: your companies and tools', icon: 'home', href: '/system/', active: (p) => IS_SYSTEM && !p.startsWith('/admin') && !/^\/(c\/[^/]+\/)?cad(\/|$)/.test(p) },
  { id: 'tasks', label: 'Project Management', title: 'Project Management', icon: 'grid', href: '/system/tasks/', active: () => APP_BASE === '/tasks' },
  { id: 'crm', label: 'CRM', title: 'Customer Relationship Management', icon: 'briefcase', href: '/system/crm/', active: () => APP_BASE === '/crm' },
  { id: 'finance', label: 'Finance', title: 'Finance', icon: 'dollar', href: '/system/finance/', active: () => APP_BASE === '/finance' },
  { id: 'cad', label: 'CAD Automation', title: 'CAD Automation: setup and computers', icon: 'diamond', href: '/system/cad', active: (p) => IS_SYSTEM && /^\/(c\/[^/]+\/)?cad(\/|$)/.test(p) },
  { id: 'company', label: 'Company', title: 'Company accounts: people, departments and tools', icon: 'building', href: '/system/company/', active: () => APP_BASE === '/company' },
  { id: 'admin', label: 'Super admin', title: 'System console: every account and company', icon: 'shield', href: '/system/admin/overview', active: (p) => IS_SYSTEM && p.startsWith('/admin'), admin: true },
];

/** True inside the System: the rail is shown and the shell makes room for it (class "in-suite"). */
export const SUITE_SHELL = SUITE !== '';

export function SuiteRail() {
  const { session } = useSession();
  const location = useLocation();
  if (!SUITE_SHELL) return null;
  // The path inside the System's own pages ('/c/x/cad', '/admin/users'); elsewhere the tool's own path.
  const path = location.pathname;
  return (
    <nav className="suite-rail" aria-label="BIZOMAT System modules">
      <a className="suite-home" href="/system/" title="BIZOMAT System" aria-label="BIZOMAT System home">
        <BrandMark size={30} />
      </a>
      {MODULES.filter((m) => !m.admin || session?.platformRole).map((m) => {
        const active = m.active(path);
        const cls = `suite-item${active ? ' active' : ''}`;
        const inner = (
          <>
            <Icon name={m.icon} size={19} />
            <span className="suite-label">{m.label}</span>
          </>
        );
        // A page of the System's own, from one of its pages: no reload.
        if (BASE === '/system' && m.href.startsWith('/system/') && !/^\/system\/(tasks|crm|finance|company)\//.test(m.href)) {
          return (
            <Link key={m.id} to={m.href.slice('/system'.length) || '/'} className={cls} title={m.title} aria-current={active ? 'page' : undefined}>
              {inner}
            </Link>
          );
        }
        return (
          <a key={m.id} href={m.href} className={cls} title={m.title} aria-current={active ? 'page' : undefined}>
            {inner}
          </a>
        );
      })}
    </nav>
  );
}
