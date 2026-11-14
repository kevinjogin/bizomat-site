// BIZOMAT ERP's module rail: one workspace for signed-in people (owner, 14 Nov 2026). Every tool opens inside the ERP
// at /erp/<tool> (src/worker/mount.ts), and this rail sits at the left of each one (Projects and Tasks, Sales and CRM,
// Finance and Accounting, Administration and the ERP's own pages), so moving between them never leaves the ERP. On a
// phone it is a bar along the bottom. Maintenance (Asset Management and Maintenance, Stage 1) is live; its "Report a
// fault" button sits at the foot of the rail on every screen. Each tool keeps its own navigation beside it; nothing here changes who may see
// what. The modules that are planned but not built (procurement, inventory, manufacturing and the rest) are listed on
// the Operations page as planned, never as working.
import { lazy, Suspense, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_BASE, SUITE } from '../../lib/base';
import { IS_SYSTEM } from '../../lib/brand';
import { useSession } from '../../lib/session';
import { BrandMark, Icon } from '../ui/Icon';

// The quick fault report (Asset Management and Maintenance), loaded when it is opened.
const ReportFault = lazy(() => import('../../system/maintenance/ReportFault'));

interface Module {
  id: string;
  label: string;
  title: string;
  icon: string;
  /** Its path inside the ERP ('/crm/' is /erp/crm/; '/reports' is one of the ERP's own pages). */
  to: string;
  active: (path: string) => boolean;
}

const own = (re: RegExp) => (p: string) => IS_SYSTEM && re.test(p);
const ERP_PAGES = /^\/(my-work|cad|maintenance|operations|reports|administration|admin)(\/|$)|^\/c\/[^/]+\/(cad|settings|maintenance)(\/|$)/;

const MODULES: Module[] = [
  { id: 'home', label: 'Dashboard', title: 'Dashboard: your company, its tools and their figures', icon: 'home', to: '/', active: (p) => IS_SYSTEM && !ERP_PAGES.test(p) },
  { id: 'my-work', label: 'My Work', title: 'My Work: everything assigned to you in Projects and Tasks', icon: 'checkSquare', to: '/my-work', active: (p) => APP_BASE === '/tasks' && /\/my-work(\/|$)/.test(p) },
  { id: 'crm', label: 'Sales and CRM', title: 'Sales and CRM: customers, leads, deals and follow-ups', icon: 'briefcase', to: '/crm/', active: () => APP_BASE === '/crm' },
  { id: 'finance', label: 'Finance and Accounting', title: 'Finance and Accounting: quotes, invoices, bills, banking, GST and reports', icon: 'dollar', to: '/finance/', active: () => APP_BASE === '/finance' },
  { id: 'tasks', label: 'Projects and Tasks', title: 'Projects and Tasks: boards, timelines, documents and dashboards', icon: 'grid', to: '/tasks/', active: (p) => APP_BASE === '/tasks' && !/\/my-work(\/|$)/.test(p) },
  { id: 'cad', label: 'Products and Engineering', title: 'Products and Engineering: CAD Automation setup and computers', icon: 'diamond', to: '/cad', active: own(/^\/(c\/[^/]+\/)?cad(\/|$)/) },
  { id: 'maintenance', label: 'Maintenance', title: 'Asset Management and Maintenance', icon: 'wrench', to: '/maintenance', active: own(/^\/(c\/[^/]+\/)?maintenance(\/|$)/) },
  { id: 'operations', label: 'Operations', title: 'Operations: procurement, inventory, manufacturing, quality and supply chain (planned), and what is live of Asset Management and Maintenance', icon: 'layers', to: '/operations', active: own(/^\/operations(\/|$)/) },
  { id: 'reports', label: 'Reports', title: 'Reports: every report of your tools in one place', icon: 'chart', to: '/reports', active: own(/^\/reports(\/|$)/) },
  { id: 'admin', label: 'Administration', title: 'Administration: company, people, departments, tools and permissions', icon: 'settings', to: '/administration', active: (p) => APP_BASE === '/company' || (IS_SYSTEM && /^\/(administration|admin)(\/|$)|^\/c\/[^/]+\/settings/.test(p)) },
];

/** True inside the ERP: the rail is shown and the shell makes room for it (class "in-suite"). */
export const SUITE_SHELL = SUITE !== '';

export function SuiteRail() {
  const { session } = useSession();
  const location = useLocation();
  if (!SUITE_SHELL || !session) return null;
  const path = location.pathname;
  return (
    <nav className="suite-rail" aria-label="BIZOMAT ERP modules">
      <a className="suite-home" href={`${SUITE}/`} title="BIZOMAT ERP" aria-label="BIZOMAT ERP dashboard">
        <BrandMark size={30} />
      </a>
      {MODULES.map((m) => {
        const active = m.active(path);
        const cls = `suite-item${active ? ' active' : ''}`;
        const inner = (
          <>
            <Icon name={m.icon} size={19} />
            <span className="suite-label">{m.label}</span>
          </>
        );
        // One of the ERP's own pages, from one of its pages: no reload.
        if (IS_SYSTEM && !/^\/(tasks|crm|finance|company)\//.test(m.to)) {
          return (
            <Link key={m.id} to={m.to} className={cls} title={m.title} aria-current={active ? 'page' : undefined}>
              {inner}
            </Link>
          );
        }
        return (
          <a key={m.id} href={`${SUITE}${m.to}`} className={cls} title={m.title} aria-current={active ? 'page' : undefined}>
            {inner}
          </a>
        );
      })}
      <FaultButton />
    </nav>
  );
}

/** "Report a fault": a maintenance request from any screen of the ERP, in a dialog over the page. */
function FaultButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="suite-item suite-fault" title="Report a fault: raise a maintenance request" onClick={() => setOpen(true)}>
        <Icon name="alert" size={19} />
        <span className="suite-label">Report a fault</span>
      </button>
      {open ? (
        <Suspense fallback={null}>
          <ReportFault onClose={() => setOpen(false)} />
        </Suspense>
      ) : null}
    </>
  );
}
