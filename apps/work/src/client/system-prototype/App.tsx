// Routes of the System prototype (information architecture, section 4), as hash addresses so the prototype runs as
// static files: #/ (Home), #/my-work, #/<section>/<page>, #/<section>/<page>/<record>, #/<section>/<page>/new.
import type { ComponentType } from 'react';
import { createHashRouter, Link, useParams } from 'react-router-dom';
import { Empty } from './kit';
import { pageByPath } from './nav';
import { FormView } from './patterns/FormView';
import { RecordView } from './patterns/RecordView';
import { ENTITIES } from './registry';
import { PageHeader } from './shell/PageHeader';
import { Shell } from './shell/Shell';
import type { NavPage } from './types';
import { Dashboard } from './widgets/Dashboard';
import { MyWork } from './pages/MyWork';
import { EntityListPage } from './pages/common';
import * as M from './pages/modules';
import * as CAD from './pages/cad';
import * as A from './pages/admin';
import { NotificationsPage, QuickAccess, Scan, ShopFloor } from './pages/mobile';
import { Enterprise, ProjectReports, ReportPage, SavedReports } from './pages/reports';

const Report = (id: string) => () => <ReportPage id={id} />;
const CUSTOM: Record<string, ComponentType<{ page: NavPage }>> = {
  'sales/overview': M.SalesOverview,
  'sales/opportunities': M.Pipeline,
  'sales/reports': Report('sales'),
  'finance/dashboard': M.FinanceDashboard,
  'finance/banking': M.Banking,
  'finance/accounting': M.Accounting,
  'finance/gst-bas': M.GstBas,
  'finance/budgets': M.Budgets,
  'finance/reports': Report('financial'),
  'projects/teams': M.Teams,
  'projects/schedule': M.Schedule,
  'projects/dashboards': M.ProjectDashboards,
  'projects/costs': M.ProjectCosts,
  'cad/overview': CAD.CadOverview,
  'cad/setup': CAD.CadSetup,
  'cad/computers': CAD.CadComputers,
  'cad/connectors': CAD.CadConnectors,
  'procurement/performance': M.SupplierPerformancePage,
  'inventory/warehouses': M.Warehouses,
  'inventory/scan': Scan,
  'manufacturing/planning': M.Planning,
  'manufacturing/shop-floor': ShopFloor,
  'supply-chain/schedule': M.DeliverySchedule,
  'supply-chain/demand': M.DemandPlan,
  'reports/enterprise': Enterprise,
  'reports/financial': Report('financial'),
  'reports/sales': Report('sales'),
  'reports/projects': ProjectReports,
  'reports/operations': Report('operations'),
  'reports/saved': SavedReports,
  'administration/company': A.CompanyPage,
  'administration/people': A.PeoplePage,
  'administration/departments': A.DepartmentsPage,
  'administration/sites': A.SitesPage,
  'administration/modules': A.ModulesPage,
  'administration/workflows': A.WorkflowsPage,
  'administration/numbering': A.NumberingPage,
  'administration/audit': A.AuditPage,
};

function NotFound() {
  return (
    <div className="erp-page">
      <PageHeader crumbs={[{ label: 'Home', to: '/' }, { label: 'Not found' }]} title="Page not found" />
      <Empty icon="search" title="This address is not in the prototype" action={<Link className="btn" to="/">Go to Home</Link>}>
        Use the sidebar or search to find a page.
      </Empty>
    </div>
  );
}

function SectionPage() {
  const { a = '', b = '' } = useParams();
  const page = pageByPath(`${a}/${b}`);
  if (!page) return <NotFound />;
  const Custom = CUSTOM[page.path];
  if (Custom) return <Custom key={page.path} page={page} />;
  if (page.entity) return <EntityListPage key={page.path} page={page} />;
  return <NotFound />;
}

function RecordPage() {
  const { a = '', b = '', id = '' } = useParams();
  const page = pageByPath(`${a}/${b}`);
  if (page?.path === 'reports/enterprise') return <ReportPage key={id} id={id === 'company-performance' ? id : 'company-performance'} />;
  if (!page?.entity) return <NotFound />;
  const def = ENTITIES[page.entity];
  if (id === 'new') return def.form ? <FormView key={page.path} def={def} page={page} /> : <NotFound />;
  return <RecordView key={`${page.path}/${id}`} def={def} id={id} page={page} />;
}

export const router = createHashRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'my-work', element: <MyWork /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'quick', element: <QuickAccess /> },
      { path: ':a/:b', element: <SectionPage /> },
      { path: ':a/:b/:id', element: <RecordPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
