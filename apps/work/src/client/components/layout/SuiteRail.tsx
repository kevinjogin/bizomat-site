// BIZOMAT ERP's module rail: one workspace for signed-in people (owner, 14 Nov 2026). Every tool opens inside the ERP
// at /erp/<tool> (src/worker/mount.ts), and this rail sits at the left of each one, so moving between them never leaves
// the ERP. On a phone it is a bar along the bottom. The modules (owner, 20 Nov 2026): Dashboard, Project Management (My
// Work and Project Management in one), Sales and CRM, Finance and Accounting, Product Management, Engineering (Design,
// CAD Automation, Manufacturing, Quality), Procurement, Warehouse (Stock and Orders and dispatch), Maintenance, Health and
// Safety, Reports and Administration. Each module of the ERP's own has its own side menu (system/modules.tsx). "Report a
// fault" (a maintenance request) sits at the foot of the rail on every screen. Nothing here changes who may see what.
import { lazy, Suspense, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { useCompanyToolPaths } from '../../lib/company-context';
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
const ERP_PAGES = /^\/(my-work|cad|products|engineering|procurement|inventory|manufacturing|quality|supply-chain|warehouse|maintenance|whs|operations|reports|administration|admin|company-admin|modules|inbox|m)(\/|$)|^\/c\/[^/]+\/(company-admin|cad|products|engineering|procurement|inventory|manufacturing|quality|supply-chain|warehouse|erp-roles|erp-settings|erp-reports|settings|maintenance|whs|modules|inbox|m)(\/|$)/;

// The modules (owner, 20 Nov 2026): My Work and Project Management are one, Project Management; Products and Engineering
// is Product Management; Engineering holds Design, CAD Automation, Manufacturing and Quality; Procurement is its own;
// Warehouse holds Stock (Inventory) and Orders and dispatch (Supply Chain); People and HR and All modules come from the
// modules framework. Each has its own side menu (system/modules.tsx).
const MODULES: Module[] = [
  { id: 'home', label: 'Dashboard', title: 'Dashboard: your company and the progress of every module', icon: 'home', to: '/', active: (p) => IS_SYSTEM && !ERP_PAGES.test(p) },
  { id: 'tasks', label: 'Project Management', title: 'Project Management: my work, projects, boards, timelines, documents and dashboards', icon: 'grid', to: '/tasks/', active: (p) => APP_BASE === '/tasks' || (IS_SYSTEM && /^\/my-work(\/|$)/.test(p)) },
  { id: 'crm', label: 'Sales and CRM', title: 'Sales and CRM: customers, leads, deals and follow-ups', icon: 'briefcase', to: '/crm/', active: () => APP_BASE === '/crm' },
  { id: 'finance', label: 'Finance and Accounting', title: 'Finance and Accounting: quotes, invoices, bills, banking, GST and reports', icon: 'dollar', to: '/finance/', active: () => APP_BASE === '/finance' },
  { id: 'product', label: 'Product Management', title: 'Product Management: your products and variants', icon: 'diamond', to: '/products', active: own(/^\/(c\/[^/]+\/)?products(\/(?!changes|documents|cad)[^/]+)?\/?$/) },
  { id: 'engineering', label: 'Engineering', title: 'Engineering: design changes and documents, CAD Automation, manufacturing and quality', icon: 'bolt', to: '/engineering', active: own(/^\/(c\/[^/]+\/)?(engineering|cad|manufacturing|quality|products\/(changes|documents|cad))(\/|$)/) },
  { id: 'procurement', label: 'Procurement', title: 'Procurement: suppliers, requisitions, quotations, purchase orders and receipts', icon: 'inbox', to: '/procurement', active: own(/^\/(c\/[^/]+\/)?procurement(\/|$)/) },
  { id: 'warehouse', label: 'Warehouse', title: 'Warehouse: stock, warehouses, movements and counts; sales orders, picking, dispatch, deliveries and returns', icon: 'archive', to: '/warehouse', active: own(/^\/(c\/[^/]+\/)?(warehouse|inventory|supply-chain)(\/|$)/) },
  { id: 'maintenance', label: 'Maintenance', title: 'Maintenance: requests, work orders, assets, preventive maintenance and inspections', icon: 'wrench', to: '/maintenance', active: own(/^\/(c\/[^/]+\/)?maintenance(\/|$)/) },
  { id: 'whs', label: 'Health and Safety', title: 'Health and Safety (BIZOMAT WHS): hazards, incidents, risk assessments, investigations, regulator notification records and actions', icon: 'shield', to: '/whs', active: own(/^\/(c\/[^/]+\/)?whs(\/|$)/) },
  // The modules framework (20 Nov 2026): People and HR, and All modules (the 97-module catalogue, every new module and what
  // is waiting for you).
  { id: 'people', label: 'People and HR', title: 'People and HR: employees, leave, recruitment, onboarding, training, performance and payroll', icon: 'users', to: '/m/hr', active: own(/^\/(c\/[^/]+\/)?m\/(hr|recruitment|onboarding|training|performance|payroll)(\/|$)/) },
  { id: 'modules', label: 'All modules', title: 'All modules: the 97 modules of BIZOMAT ERP, a search across them, and what is waiting for you', icon: 'layers', to: '/modules', active: own(/^\/(c\/[^/]+\/)?(modules|inbox)(\/|$)|^\/(c\/[^/]+\/)?m\/(?!hr|recruitment|onboarding|training|performance|payroll)[a-z_]+(\/|$)/) },
  { id: 'reports', label: 'Reports', title: 'Reports: every report of your tools in one place', icon: 'chart', to: '/reports', active: own(/^\/reports(\/|$)|^\/c\/[^/]+\/erp-reports(\/|$)/) },
  { id: 'admin', label: 'Administration', title: 'Administration: company, people, departments, tools, ERP roles and permissions', icon: 'settings', to: '/administration', active: (p) => APP_BASE === '/company' || (IS_SYSTEM && /^\/(administration|admin)(\/|$)|^\/c\/[^/]+\/(settings|erp-roles|erp-settings)/.test(p)) },
];

/** Company Admin (flag company_admin_console): shown to the owner and administrators of a company where it is on. */
const COMPANY_ADMIN: Module = { id: 'company-admin', label: 'Company Admin', title: 'Company Admin: manage your company’s team, roles and access, API tokens and activity', icon: 'users', to: '/company-admin', active: own(/^\/(c\/[^/]+\/)?company-admin(\/|$)/) };

/** True inside the ERP: the rail is shown and the shell makes room for it (class "in-suite"). */
export const SUITE_SHELL = SUITE !== '';

export function SuiteRail() {
  const { session } = useSession();
  const location = useLocation();
  const adminCompanies = useQuery({ queryKey: ['company', 'admin-companies'], queryFn: () => get<{ companies: { id: string }[] }>('/company/admin/companies'), staleTime: 60_000, retry: false, enabled: SUITE_SHELL && !!session });
  const toolPaths = useCompanyToolPaths(SUITE_SHELL && !!session);
  if (!SUITE_SHELL || !session) return null;
  const path = location.pathname;
  // The company being worked in: its own Project Management, CRM and Finance (lib/company-context.ts).
  const own: Record<string, string | undefined> = { tasks: toolPaths.tasks, crm: toolPaths.crm, finance: toolPaths.finance };
  const modules = (adminCompanies.data?.companies.length ? [...MODULES, COMPANY_ADMIN] : MODULES).map((m) => (own[m.id] ? { ...m, to: own[m.id]! } : m));
  return (
    <nav className="suite-rail" aria-label="BIZOMAT ERP modules">
      <a className="suite-home" href={`${SUITE}/`} title="BIZOMAT ERP" aria-label="BIZOMAT ERP dashboard">
        <BrandMark size={30} />
      </a>
      {modules.map((m) => {
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
