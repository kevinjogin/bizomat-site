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
  id: 'erp' | 'crm' | 'finance' | 'projects' | 'engineering' | 'manufacturing' | 'whs';
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
    statusNote: 'Working today: the workspace, the dashboard by company, Sales and CRM, Finance and Accounting, Projects and Tasks, Products and Engineering (products, bills of materials, revisions, engineering changes, documents and CAD Automation), Procurement (suppliers, requisitions, quotations, purchase orders and goods receipts), Inventory (warehouses, stock, movements, counts and valuation), Manufacturing (work centres, routings, manufacturing orders, the shop floor, MRP, capacity and job costing), Quality (inspection plans, inspections, nonconformances and corrective actions), Supply Chain (sales orders, allocation, make to order, picking, packing, dispatch, deliveries, returns, carriers and the draft invoice in Finance), Maintenance (assets, requests, work orders, preventive maintenance, readings, inspections, prestart checks, parts from Inventory, sites and reliability reports), Reports and Administration. Planned: postings of stock, production and maintenance value to Finance’s ledger.',
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
    status: 'available',
    statusNote: 'Working today inside BIZOMAT ERP: Procurement (suppliers, requisitions, quotations, purchase orders, goods receipts and the draft bill in Finance), Inventory (warehouses, stock by lot and serial, movements, counts and valuation), Manufacturing (work centres, routings, manufacturing orders, the shop floor, MRP, capacity, job costing and job profitability), Quality (inspection plans, inspections, nonconformances and corrective actions), Maintenance (assets, work orders, preventive maintenance, inspections, prestart checks, parts and reliability reports) and Supply Chain (sales orders, allocation, make to order, picking, packing, dispatch, delivery confirmation, returns, carriers and the draft invoice and credit note in Finance). Planned: posting stock, production and maintenance value to Finance’s ledger (recorded as planned, nothing is posted); the AI scheduling assistant and offline field work in Maintenance; statistical process control, calibration and quality audits; and in Supply Chain, connections to carriers’ own systems, landed costs and demand forecasting.',
    url: '/systems/manufacturing/',
    guide: '/systems/manufacturing/guide/',
    access: { href: `${erp}operations`, label: 'Open Operations', note: 'Opens inside BIZOMAT ERP, in the Operations module: Procurement, Inventory, Manufacturing, Quality, Supply Chain and Maintenance.' },
    module: 'Operations',
  },
  {
    // BIZOMAT WHS, Release 1 (the core): apps/work/src/worker/whs, migration 0026_whs_core.sql, docs/whs/README.md;
    // apps/work/test/whs-core.test.ts and test-node/whs-core.test.ts. The legal packs are Not verified until a platform
    // administrator verifies them in the app: nothing here may say the product makes a business meet the law.
    id: 'whs',
    kind: 'Work Health & Safety Management System',
    name: 'BIZOMAT WHS',
    short: 'WHS',
    line: 'Manage workplace safety, incidents, hazards, risk assessments, inspections, contractors, training, corrective actions and regulatory compliance from one connected platform.',
    status: 'partial',
    statusNote: 'Working today inside BIZOMAT ERP (Release 1): hazard reporting from a phone and the hazard register; risk assessments (JSA, JHA, SWMS and nine more kinds) on the company’s own risk matrix with the hierarchy of controls; incidents and near misses with investigations by five whys and fishbone; the regulator notification record (the decision is made by an authorised person, and the submission is recorded as it was made: BIZOMAT does not submit to regulators); the actions register with evidence; confidential health records seen only by health officers; and jurisdiction packs for Australia’s Commonwealth, states and territories (Victoria under its own OHS laws) with skeleton packs for New Zealand, the United Kingdom, Canada, Singapore and South Africa. Every legal instrument and rule is Not verified until a competent person verifies it against the official source. Planned: inspections and audits, documents and SWMS acknowledgement, permits to work, contractors and visitors, training, chemicals, plant safety, PPE, emergency management, consultation, health surveillance and the compliance register.',
    url: '/systems/whs/',
    guide: '/systems/whs/guide/',
    access: { href: `${erp}whs`, label: 'Open Health and Safety', note: 'Opens inside BIZOMAT ERP, in the Health and Safety module.' },
    module: 'Health and Safety',
  },
] as const;

export const systemById = (id: SystemInfo['id']): SystemInfo => SYSTEMS.find((s) => s.id === id)!;

/** The public pages of the Systems section. */
export const SYSTEMS_HOME = '/systems/';


export const STATUS_LABEL: Record<SystemStatus, string> = { available: 'Available', partial: 'Available, some modules planned', planned: 'Planned' };

/** Every feature on the Systems pages carries one of these (owner, 14 Nov 2026). */
export type FeatureStatus = 'live' | 'connected' | 'in-development' | 'planned';
export const FEATURE_STATUS: Record<FeatureStatus, { label: string; meaning: string }> = {
  live: { label: 'Live', meaning: 'Works today in BIZOMAT.' },
  connected: { label: 'Connected', meaning: 'Works today by linking two BIZOMAT systems, without copying records.' },
  'in-development': { label: 'In development', meaning: 'Being built: parts exist, but it is not switched on for everyone yet.' },
  planned: { label: 'Planned', meaning: 'Designed, not built. Not available today.' },
};
