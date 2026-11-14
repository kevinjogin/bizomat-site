// BIZOMAT Systems: the public catalogue of BIZOMAT's business software (owner, 14 Nov 2026: "SYSTEMS is the public entry
// point for discovering the software; ERP is the central workspace for signed-in users"). One source for /systems/,
// each system's page and guide, the header's Systems menu, the footer and the sign-in links.
//
// Rules (CLAUDE.md): describe only what works today (src/data/platform-catalog.ts records where each fact comes from);
// a module that is planned is labelled planned and never shown as working; Resources are not a system and stay free.
import { APP_LINKS } from './platform.ts';

export type SystemStatus = 'available' | 'partial' | 'planned';

export interface SystemInfo {
  /** Slug: /systems/<id>/. */
  id: 'erp' | 'crm' | 'finance' | 'projects' | 'engineering' | 'manufacturing';
  /** What kind of system it is ("Business Management System"). */
  kind: string;
  /** Its product name ("BIZOMAT ERP"). */
  name: string;
  /** The short name used in running text and narrow places ("ERP"). */
  short: string;
  /** Earlier names people may know it by. */
  formerly?: string;
  /** One line for menus and cards. */
  line: string;
  status: SystemStatus;
  /** What is working today, said plainly, for systems that are partly built or planned. */
  statusNote?: string;
  /** The public information page and its user guide. */
  url: string;
  guide?: string;
  /** Where a signed-in person opens it, inside BIZOMAT ERP (or its own application). */
  access?: { href: string; label: string; note: string };
  /** Its module in the ERP workspace. */
  module?: string;
}

const erp = APP_LINKS.erp.home;

export const SYSTEMS: readonly SystemInfo[] = [
  {
    id: 'erp',
    kind: 'Business Management System',
    name: 'BIZOMAT ERP',
    short: 'ERP',
    formerly: 'BIZOMAT System',
    line: 'One workspace for your company: sales, finance, projects, engineering and administration, by company.',
    status: 'partial',
    statusNote: 'Working today: the workspace, the dashboard by company, Sales and CRM, Finance and Accounting, Projects and Tasks, Products and Engineering (CAD Automation), Reports and Administration. Maintenance (assets, requests and work orders) is in development. Procurement, inventory, manufacturing, quality and supply chain are planned.',
    url: '/systems/erp/',
    guide: '/systems/erp/guide/',
    access: { href: erp, label: 'Open BIZOMAT ERP', note: 'Sign in with your BIZOMAT account. Every module opens inside the ERP.' },
    module: 'Dashboard',
  },
  {
    id: 'crm',
    kind: 'Customer Management System',
    name: 'BIZOMAT CRM',
    short: 'CRM',
    formerly: 'BIZOMAT Customer Relationship Management',
    line: 'Customers, contacts, leads, deals and follow-ups, shared with your team.',
    status: 'available',
    url: '/systems/crm/',
    guide: '/systems/crm/guide/',
    access: { href: `${erp}crm/`, label: 'Open Sales and CRM', note: 'Opens inside BIZOMAT ERP, in the Sales and CRM module.' },
    module: 'Sales and CRM',
  },
  {
    id: 'finance',
    kind: 'Finance Management System',
    name: 'BIZOMAT Finance',
    short: 'Finance',
    line: 'Accounts, transactions, quotes, invoices, bills, banking, GST and reports, on a double-entry ledger.',
    status: 'available',
    url: '/systems/finance/',
    guide: '/systems/finance/guide/',
    access: { href: `${erp}finance/`, label: 'Open Finance and Accounting', note: 'Opens inside BIZOMAT ERP, in the Finance and Accounting module.' },
    module: 'Finance and Accounting',
  },
  {
    id: 'projects',
    kind: 'Project Management System',
    name: 'BIZOMAT Projects',
    short: 'Projects',
    formerly: 'BIZOMAT Project Management',
    line: 'Projects, tasks, teams, timelines and documents in one shared workspace.',
    status: 'available',
    url: '/systems/projects/',
    guide: '/systems/projects/guide/',
    access: { href: `${erp}tasks/`, label: 'Open Projects and Tasks', note: 'Opens inside BIZOMAT ERP, in the Projects and Tasks module.' },
    module: 'Projects and Tasks',
  },
  {
    id: 'engineering',
    kind: 'Engineering Automation System',
    name: 'BIZOMAT Engineering Automation',
    short: 'Engineering Automation',
    formerly: 'CAD Automation (CADOS)',
    line: 'Your AI assistant builds and checks SOLIDWORKS parts, assemblies and drawings on your own computer.',
    status: 'available',
    statusNote: 'Needs SOLIDWORKS on your own Windows computer, the BIZOMAT add-in and Companion, and an AI assistant that supports MCP connectors. CAD Automation keeps its own sign-in for now.',
    url: '/systems/engineering/',
    guide: '/systems/engineering/guide/',
    access: { href: APP_LINKS.cad.home, label: 'Open CAD Automation', note: 'CAD Automation has its own sign-in for now. Its setup and your company\'s computers are also in BIZOMAT ERP, under Products and Engineering.' },
    module: 'Products and Engineering',
  },
  {
    id: 'manufacturing',
    kind: 'Manufacturing and Operations System',
    name: 'BIZOMAT Manufacturing and Operations',
    short: 'Manufacturing and Operations',
    line: 'Procurement, inventory, manufacturing, quality, maintenance and supply chain, as ERP modules.',
    status: 'planned',
    statusNote: 'Planned, not built, except the first stage of Maintenance (assets, requests and work orders), which is in development inside BIZOMAT ERP. The design can be explored in the BIZOMAT ERP design preview, which uses demonstration data only.',
    url: '/systems/manufacturing/',
    module: 'Operations',
  },
] as const;

export const systemById = (id: SystemInfo['id']): SystemInfo => SYSTEMS.find((s) => s.id === id)!;

/** The public pages of the Systems section. */
export const SYSTEMS_HOME = '/systems/';

/** The design preview of the planned ERP modules (demonstration data). */
export const ERP_PREVIEW = '/system-preview/';

export const STATUS_LABEL: Record<SystemStatus, string> = { available: 'Available', partial: 'Available, some modules planned', planned: 'Planned' };

/** Every feature on the Systems pages carries one of these (owner, 14 Nov 2026). */
export type FeatureStatus = 'live' | 'connected' | 'in-development' | 'planned';
export const FEATURE_STATUS: Record<FeatureStatus, { label: string; meaning: string }> = {
  live: { label: 'Live', meaning: 'Works today in BIZOMAT.' },
  connected: { label: 'Connected', meaning: 'Works today by linking two BIZOMAT systems, without copying records.' },
  'in-development': { label: 'In development', meaning: 'Being built: parts exist, but it is not switched on for everyone yet.' },
  planned: { label: 'Planned', meaning: 'Designed, not built. Not available today.' },
};
