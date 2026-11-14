// The navigation map of docs/erp/ux/02-information-architecture.md, section 3, with the role table of section 5.
// Every page carries its state: W (working: an existing BIZOMAT screen), C (connected: an ERP screen over existing
// data), P (planned: a new ERP module, shown here with demonstration data).
import type { ModuleId, NavPage, NavSection, PageState, RoleId, SectionId } from './types';

const p = (path: string, label: string, icon: string, state: PageState[], module: ModuleId, extra: Partial<NavPage> = {}): NavPage => ({ path, label, icon, state, module, ...extra });

export const SECTIONS: NavSection[] = [
  {
    id: 'sales',
    label: 'Sales & Customers',
    icon: 'briefcase',
    pages: [
      p('sales/overview', 'Overview', 'home', ['W'], 'CRM', { opens: '/crm/o/:org/overview' }),
      p('sales/customers', 'Customers', 'building', ['W'], 'CRM', { opens: '/crm/o/:org/companies', entity: 'customer' }),
      p('sales/contacts', 'Contacts', 'users', ['W'], 'CRM', { opens: '/crm/o/:org/contacts', entity: 'contact' }),
      p('sales/leads', 'Leads', 'funnel', ['W'], 'CRM', { opens: '/crm/o/:org/leads', entity: 'lead' }),
      p('sales/opportunities', 'Opportunities and pipeline', 'kanban', ['W'], 'CRM', { opens: '/crm/o/:org/deals', entity: 'opportunity' }),
      p('sales/activities', 'Activities', 'calendar', ['W'], 'CRM', { opens: '/crm/o/:org/activities', entity: 'activity' }),
      p('sales/quotes', 'Quotes', 'file', ['W'], 'Finance', { opens: '/finance/o/:org/quotes', entity: 'quote' }),
      p('sales/orders', 'Sales orders', 'cart', ['P'], 'ERP', { opens: 'ERP (new), from an accepted quote or a won deal', entity: 'salesOrder' }),
      p('sales/deliveries', 'Deliveries', 'truck', ['P'], 'ERP', { opens: 'ERP (new), from a sales order', entity: 'delivery' }),
      p('sales/reports', 'Sales reports', 'chart', ['W'], 'CRM', { opens: '/crm/o/:org/reports' }),
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'dollar',
    pages: [
      p('finance/dashboard', 'Finance dashboard', 'home', ['W'], 'Finance', { opens: '/finance/o/:org/dashboard' }),
      p('finance/invoices', 'Invoices', 'doc', ['W'], 'Finance', { opens: '/finance/o/:org/invoices', entity: 'invoice' }),
      p('finance/credit-notes', 'Credit notes', 'undo', ['W'], 'Finance', { opens: '/finance/o/:org/credit-notes', entity: 'creditNote' }),
      p('finance/bills', 'Bills', 'file', ['W'], 'Finance', { opens: '/finance/o/:org/bills', entity: 'bill' }),
      p('finance/expense-claims', 'Expense claims', 'dollar', ['W'], 'Finance', { opens: '/finance/o/:org/expense-claims', entity: 'expenseClaim' }),
      p('finance/banking', 'Banking', 'building', ['W'], 'Finance', { opens: '/finance/o/:org/banking, /transactions' }),
      p('finance/accounting', 'Accounting', 'layers', ['W'], 'Finance', { opens: '/finance/o/:org/accounting/chart' }),
      p('finance/gst-bas', 'GST and BAS', 'shield', ['W', 'P'], 'Finance', { opens: '/finance/o/:org/reports/gst', stateNote: 'The GST worksheet works today. The BAS module with lodged-period snapshots is planned (Stage 2 of the Finance brief).' }),
      p('finance/budgets', 'Budgets', 'target', ['W'], 'Finance', { opens: '/finance/o/:org/budgets' }),
      p('finance/reports', 'Financial reports', 'chart', ['W'], 'Finance', { opens: '/finance/o/:org/reports' }),
    ],
  },
  {
    id: 'projects',
    label: 'Projects & Tasks',
    icon: 'grid',
    pages: [
      p('projects/projects', 'Projects', 'grid', ['W'], 'Project Management', { opens: '/tasks/w/:ws/boards', entity: 'project' }),
      p('projects/my-tasks', 'My tasks', 'checkSquare', ['W'], 'Project Management', { opens: '/tasks/w/:ws/my-work', entity: 'task' }),
      p('projects/teams', 'Teams', 'users', ['W'], 'Project Management', { opens: '/tasks/w/:ws/settings and /company/c/:co/departments' }),
      p('projects/schedule', 'Schedule', 'timeline', ['W'], 'Project Management', { opens: '/tasks/w/:ws/boards/:board/views/:view (timeline and workload)' }),
      p('projects/dashboards', 'Project dashboards', 'chart', ['W'], 'Project Management', { opens: '/tasks/w/:ws/dashboards' }),
      p('projects/costs', 'Project costs', 'dollar', ['W'], 'Company', { opens: '/company/c/:co/projects' }),
    ],
  },
  {
    id: 'engineering',
    label: 'Products & Engineering',
    icon: 'pencilRuler',
    pages: [
      p('products/products', 'Products', 'box', ['P'], 'ERP', { opens: 'ERP product master (new)', entity: 'product' }),
      p('products/variants', 'Variants', 'copy', ['P'], 'ERP', { opens: 'Tab of the product', entity: 'variant' }),
      p('products/boms', 'Bills of materials', 'tree', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'bom' }),
      p('products/routings', 'Routings', 'route', ['P'], 'ERP', { opens: 'ERP (new), shared with Manufacturing', entity: 'routing' }),
      p('engineering/changes', 'Engineering changes', 'edit', ['P'], 'ERP', { opens: 'ERP (new): change requests and orders', entity: 'eco' }),
      p('products/revisions', 'Revisions', 'history', ['P'], 'ERP', { opens: 'Tab of the product and the BOM', entity: 'revision' }),
      p('engineering/drawings', 'Drawings and models', 'image', ['W', 'P'], 'CAD Automation', { opens: '/cad/', stateNote: 'CAD Automation holds the files and the automation (working). ERP keeps the link and the revision (planned).', entity: 'drawing' }),
      p('engineering/cad-jobs', 'CAD automation jobs', 'bolt', ['W'], 'CAD Automation', { opens: '/cad/ (SolidWorks MCP)', entity: 'cadJob' }),
    ],
  },
  {
    id: 'procurement',
    label: 'Procurement',
    icon: 'cart',
    pages: [
      p('procurement/suppliers', 'Suppliers', 'building', ['W', 'P'], 'Finance', { opens: '/finance/o/:org/contacts (kind supplier)', stateNote: 'The supplier contact works in Finance today. The ERP supplier profile is planned.', entity: 'supplier' }),
      p('procurement/requisitions', 'Requisitions', 'form', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'requisition' }),
      p('procurement/rfqs', 'Requests for quotation', 'message', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'rfq' }),
      p('procurement/purchase-orders', 'Purchase orders', 'checkSquare', ['W', 'P'], 'Finance', { opens: '/finance/o/:org/purchase-orders', stateNote: 'The purchase order document works in Finance today. ERP lines and receiving are planned.', entity: 'purchaseOrder' }),
      p('procurement/bills', 'Supplier bills', 'file', ['W'], 'Finance', { opens: '/finance/o/:org/bills', entity: 'bill' }),
      p('procurement/performance', 'Supplier performance', 'trophy', ['P'], 'ERP', { opens: 'ERP report (new)' }),
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory & Warehouse',
    icon: 'warehouse',
    pages: [
      p('inventory/stock', 'Stock on hand', 'box', ['P'], 'ERP', { opens: 'ERP (new), valued in Finance through journals', entity: 'stock' }),
      p('inventory/movements', 'Stock movements', 'refresh', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'movement' }),
      p('inventory/receipts', 'Goods receipts', 'inbox', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'receipt' }),
      p('inventory/transfers', 'Transfers', 'truck', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'transfer' }),
      p('inventory/counts', 'Stock counts', 'listOrdered', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'count' }),
      p('inventory/warehouses', 'Warehouses and locations', 'map', ['P'], 'ERP', { opens: 'ERP (new)' }),
      p('inventory/scan', 'Scan', 'scan', ['P'], 'ERP', { opens: 'ERP (new), for phones' }),
    ],
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    icon: 'factory',
    pages: [
      p('manufacturing/work-orders', 'Production orders', 'factory', ['P'], 'ERP', { opens: 'ERP (new): work orders', entity: 'workOrder' }),
      p('manufacturing/planning', 'Production planning', 'calendar', ['P'], 'ERP', { opens: 'ERP (new)' }),
      p('manufacturing/work-centres', 'Work centres', 'gauge', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'workCentre' }),
      p('manufacturing/routings', 'Routings', 'route', ['P'], 'ERP', { opens: 'Shared with Products & Engineering', entity: 'routing' }),
      p('manufacturing/shop-floor', 'Shop floor', 'play', ['P'], 'ERP', { opens: 'ERP (new), for tablets and phones' }),
    ],
  },
  {
    id: 'quality',
    label: 'Quality',
    icon: 'shield',
    pages: [
      p('quality/inspections', 'Inspections', 'clipboard', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'inspection' }),
      p('quality/nonconformances', 'Nonconformances', 'alert', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'ncr' }),
      p('quality/corrective-actions', 'Corrective actions', 'check', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'capa' }),
      p('quality/plans', 'Inspection plans', 'listOrdered', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'inspectionPlan' }),
      p('quality/certificates', 'Certificates', 'doc', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'certificate' }),
    ],
  },
  {
    id: 'maintenance',
    label: 'Assets & Maintenance',
    icon: 'wrench',
    pages: [
      p('maintenance/assets', 'Assets', 'settings', ['P'], 'ERP', { opens: 'ERP (new); depreciation stays in Finance', entity: 'asset' }),
      p('maintenance/plans', 'Maintenance plans', 'calendar', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'maintenancePlan' }),
      p('maintenance/requests', 'Work requests', 'message', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'workRequest' }),
      p('maintenance/orders', 'Maintenance orders', 'wrench', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'maintenanceOrder' }),
      p('maintenance/downtime', 'Downtime', 'clock', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'downtime' }),
    ],
  },
  {
    id: 'supply-chain',
    label: 'Supply Chain',
    icon: 'truck',
    pages: [
      p('supply-chain/shipments', 'Shipments', 'truck', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'shipment' }),
      p('supply-chain/carriers', 'Carriers', 'building', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'carrier' }),
      p('supply-chain/schedule', 'Delivery schedule', 'calendar', ['P'], 'ERP', { opens: 'ERP (new)' }),
      p('supply-chain/returns', 'Returns', 'returnArrow', ['P'], 'ERP', { opens: 'ERP (new)', entity: 'return' }),
      p('supply-chain/demand', 'Demand plan', 'workload', ['P'], 'ERP', { opens: 'ERP (new)' }),
    ],
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'chart',
    pages: [
      p('reports/enterprise', 'Enterprise dashboards', 'chart', ['C'], 'ERP', { opens: 'ERP (cross-module figures)' }),
      p('reports/financial', 'Financial reports', 'dollar', ['W'], 'Finance', { opens: 'Finance reports' }),
      p('reports/sales', 'Sales reports', 'briefcase', ['W'], 'CRM', { opens: 'CRM reports' }),
      p('reports/projects', 'Project reports', 'grid', ['W'], 'Project Management', { opens: 'Project Management dashboards' }),
      p('reports/operations', 'Operations reports', 'factory', ['P'], 'ERP', { opens: 'Inventory, production, quality, maintenance' }),
      p('reports/saved', 'Saved and scheduled reports', 'star', ['W', 'P'], 'ERP', { opens: 'Finance and Project Management today; ERP saved reports planned', stateNote: 'Saved and scheduled reports work in Finance and Project Management today. ERP saved reports are planned.' }),
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: 'settings',
    pages: [
      p('administration/company', 'Company', 'building', ['W'], 'Company', { opens: '/company/c/:co/overview' }),
      p('administration/people', 'People and roles', 'users', ['W'], 'Company', { opens: '/company/c/:co/people' }),
      p('administration/departments', 'Departments', 'group', ['W'], 'Company', { opens: '/company/c/:co/departments' }),
      p('administration/sites', 'Sites and branches', 'map', ['P'], 'ERP', { opens: 'New core entity (co_sites)' }),
      p('administration/modules', 'Tools and modules', 'plug', ['W', 'P'], 'Company', { opens: '/company/c/:co/tools', stateNote: 'Tools work in Company today. Module access for ERP modules is planned.' }),
      p('administration/workflows', 'Approval workflows', 'signature', ['P'], 'ERP', { opens: "ERP (new), reusing Finance's approval rules" }),
      p('administration/numbering', 'Numbering', 'hash', ['W', 'P'], 'Finance', { opens: 'Finance numbering; ERP series for new records', stateNote: 'Finance numbering works today. ERP series for new records are planned.' }),
      p('administration/audit', 'Audit trail', 'history', ['W', 'C'], 'ERP', { opens: 'Per tool today; an ERP view across them is connected', stateNote: 'Each tool keeps its own audit trail today. The ERP view across them is a connected screen.' }),
    ],
  },
];

export const PAGES: NavPage[] = SECTIONS.flatMap((s) => s.pages);
export const pageByPath = (path: string) => PAGES.find((pg) => pg.path === path);
export const sectionOf = (path: string) => SECTIONS.find((s) => s.pages.some((pg) => pg.path === path));

export const STATE_LABEL: Record<PageState, string> = { W: 'Working', C: 'Connected', P: 'Planned' };

/** The real address of each existing application ("Open in Finance"). */
export const APP_URL: Record<ModuleId, string> = {
  CRM: 'https://bizomat.ai/crm/',
  Finance: 'https://bizomat.ai/finance/',
  'Project Management': 'https://bizomat.ai/tasks/',
  'CAD Automation': 'https://bizomat.ai/cad/',
  Company: 'https://bizomat.ai/company/',
  ERP: '',
};

// ------------------------------------------------------------------ roles

type Access = 'full' | 'read' | { pages: string[]; read: boolean };
export interface RoleDef {
  id: RoleId;
  label: string;
  layout: string;
  person: string;
  sections: Partial<Record<SectionId, Access>> | 'all';
  except?: SectionId[];
}

export const ROLES: RoleDef[] = [
  { id: 'ceo', label: 'CEO / Business owner', layout: 'Company performance', person: 'Chris Doyle', sections: 'all' },
  { id: 'executive', label: 'Executive manager', layout: 'Operations overview', person: 'Jess Patel', sections: 'all', except: ['administration'] },
  { id: 'sales', label: 'Sales manager', layout: 'Sales', person: 'Priya Nair', sections: { sales: 'full', finance: { pages: ['finance/invoices'], read: true }, projects: 'full', reports: 'full' } },
  { id: 'finance', label: 'Finance manager', layout: 'Finance', person: 'Daniel Okafor', sections: { finance: 'full', sales: 'read', procurement: 'read', reports: 'full' } },
  { id: 'accountant', label: 'Accountant', layout: 'Accounting', person: 'Mei Lin', sections: { finance: 'full', reports: 'full' } },
  { id: 'engineer', label: 'Engineer', layout: 'Engineering', person: 'Tom Walsh', sections: { engineering: 'full', projects: 'full', quality: 'read' } },
  { id: 'procurement', label: 'Procurement manager', layout: 'Purchasing', person: 'Sara Haddad', sections: { procurement: 'full', inventory: 'read', finance: { pages: ['finance/bills'], read: true }, reports: 'full' } },
  { id: 'production', label: 'Production manager', layout: 'Production', person: 'Ben Carter', sections: { manufacturing: 'full', inventory: 'full', quality: 'full', projects: 'full', reports: 'full' } },
  { id: 'warehouse', label: 'Warehouse manager', layout: 'Warehouse', person: 'Luca Romano', sections: { inventory: 'full', procurement: { pages: ['procurement/purchase-orders'], read: false }, 'supply-chain': 'full' } },
  { id: 'quality', label: 'Quality manager', layout: 'Quality', person: 'Grace Kim', sections: { quality: 'full', manufacturing: 'read', procurement: 'read' } },
  { id: 'project', label: 'Project manager', layout: 'Projects', person: 'Hannah Brooks', sections: { projects: 'full', sales: 'read', reports: 'full' } },
  { id: 'admin', label: 'Administrator', layout: 'Administration', person: 'Omar Siddiqui', sections: 'all' },
];
export const roleById = (id: RoleId) => ROLES.find((r) => r.id === id) ?? ROLES[0];

/** The sections a role sees, each with its pages and whether the role may only read them. */
export interface VisibleSection {
  section: NavSection;
  pages: NavPage[];
  read: boolean;
  note?: string;
}
export function visibleSections(role: RoleId): VisibleSection[] {
  const def = roleById(role);
  return SECTIONS.flatMap((section): VisibleSection[] => {
    if (def.sections === 'all') return def.except?.includes(section.id) ? [] : [{ section, pages: section.pages, read: false }];
    const access = def.sections[section.id];
    if (!access) return [];
    if (access === 'full') return [{ section, pages: section.pages, read: false }];
    if (access === 'read') return [{ section, pages: section.pages, read: true }];
    return [{ section, pages: section.pages.filter((pg) => access.pages.includes(pg.path)), read: access.read, note: role === 'warehouse' ? 'Receiving' : undefined }];
  });
}

export function accessTo(role: RoleId, path: string): 'full' | 'read' | 'none' {
  const v = visibleSections(role).find((s) => s.pages.some((pg) => pg.path === path));
  if (!v) return 'none';
  return v.read ? 'read' : 'full';
}
