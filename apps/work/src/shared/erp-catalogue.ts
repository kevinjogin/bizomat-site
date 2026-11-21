// The master catalogue of BIZOMAT ERP's 97 modules (owner's brief "97-module enterprise expansion", 20 Nov 2026), one
// source for the ERP's All modules page, its API (/api/erp/c/:company/catalogue), docs/erp/MODULES.md and the tests.
// Each entry says honestly where the module stands, what exists and what does not. Statuses:
//   live      built, tested and live before this release
//   improved  live before, and extended in this release
//   new       built in this release on the modules framework (src/shared/erp-objects)
//   partial   some of it is built; `gaps` says what is not
//   planned   not built
// A module is never shown as live because a page renders: its tests and evidence are named.

export type CatalogueStatus = 'live' | 'improved' | 'new' | 'partial' | 'planned';
export type CatalogueArea = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export const AREAS: Record<CatalogueArea, string> = {
  A: 'ERP core and platform',
  B: 'Finance and accounting',
  C: 'Sales, CRM and customers',
  D: 'Procurement and suppliers',
  E: 'Inventory and warehouse',
  F: 'Manufacturing and production',
  G: 'Quality, engineering and maintenance',
  H: 'Logistics, projects and services',
  I: 'Human resources and people',
  J: 'Industry solutions',
};

export const STATUS_LABELS: Record<CatalogueStatus, string> = { live: 'Live', improved: 'Live, extended', new: 'New', partial: 'Partly built', planned: 'Planned' };

export interface CatalogueEntry {
  n: number;
  name: string;
  area: CatalogueArea;
  status: CatalogueStatus;
  /** The framework module that delivers it (new and improved modules). */
  module?: string;
  /** Where it opens in the ERP ({co} is the company): an ERP page, or a tool at /tasks/, /crm/, /finance/, /company/. */
  path?: string;
  /** What exists. */
  now: string;
  /** What does not exist yet. */
  gaps?: string;
  /** Catalogue numbers it builds on. */
  depends?: number[];
  /** Tests that prove it (apps/work). */
  evidence?: string;
}

const CO = '/c/{co}';
const m = (key: string) => `${CO}/m/${key}`;

export const CATALOGUE: CatalogueEntry[] = [
  // A. ERP core and platform
  { n: 1, name: 'Enterprise and organisation management', area: 'A', status: 'improved', module: 'organisation', path: m('organisation'), now: 'Registered companies with departments in a tree; now legal entities and subsidiaries with country, currency, fiscal year, time zone and language, business units, locations and exchange rates.', gaps: 'Intercompany transactions are not built.', evidence: 'test/erp-modules.test.ts' },
  { n: 2, name: 'User and account management', area: 'A', status: 'live', path: '/company/', now: 'Company members, invitations, suspension and reactivation, removal, ownership transfer, profiles, the Company Admin console (switch off by default).', evidence: 'test/members.test.ts, test/company.test.ts' },
  { n: 3, name: 'Roles and permissions', area: 'A', status: 'improved', path: `${CO}/erp-roles`, now: 'Company roles, roles in each tool, ERP roles with a capability matrix, segregation of duties; 12 roles added for the new modules (HR, payroll, projects, service, fleet, contracts, marketing, finance control, operations, compliance).', evidence: 'test/erp.test.ts, test/erp-modules.test.ts' },
  { n: 4, name: 'Authentication and identity', area: 'A', status: 'partial', now: 'Password sign-in with lockout, Google sign-in, sessions with CSRF protection, two-factor sign-in for platform administrators, BIZOMAT as the sign-in provider of CAD Automation.', gaps: 'Two-factor sign-in for every person, SAML or enterprise single sign-on; the forgotten-password link is behind a switch that is off.', evidence: 'test/auth.test.ts, test/security.test.ts' },
  { n: 5, name: 'Audit trail and compliance', area: 'A', status: 'live', now: 'Append-only audit logs in every tool, the ERP history with before and after values, company activity, personal and company exports.', evidence: 'test/erp.test.ts, test/compliance.test.ts' },
  { n: 6, name: 'Workflow and business process automation', area: 'A', status: 'improved', module: 'workflow', path: m('workflow'), now: 'Automations in Projects and the CRM; approvals with segregation of duties in every ERP module; now workflow rules that notify and escalate on any new module’s status, and one approval inbox.', gaps: 'No drag-and-drop workflow designer; rules notify and escalate but do not change records.', evidence: 'test/erp-modules.test.ts' },
  { n: 7, name: 'Notifications and communication', area: 'A', status: 'improved', now: 'In-app and email notifications in Projects, the CRM, Finance and WHS; now ERP alerts for approvals, assignments, due dates and workflow rules in the new modules.', gaps: 'No chat or SMS.', evidence: 'test/notifications.test.ts, test/erp-modules.test.ts' },
  { n: 8, name: 'Document and file management', area: 'A', status: 'improved', module: 'documents', path: m('documents'), now: 'Projects documents with versions and comments, files on every record; now controlled documents with versions, approval by someone else, review reminders and retention dates.', gaps: 'No document templates that fill in record data.', evidence: 'test/documents.test.ts, test/erp-modules.test.ts' },
  { n: 9, name: 'Global search and navigation', area: 'A', status: 'improved', path: `${CO}/modules`, now: 'Search in Projects and in the CRM; now one search across the new modules’ records and the ERP’s products, suppliers and orders, the All modules page with its search, favourites and recently used.', gaps: 'Finance and the CRM keep their own searches.', evidence: 'test/erp-modules.test.ts' },
  { n: 10, name: 'ERP configuration, reporting and analytics', area: 'A', status: 'improved', path: '/reports', now: 'The Reports hub, dashboards, CRM custom fields, ERP and module settings, CSV exports; now reports and CSV import and export for every new module, and Product Management’s sales and margin analysis by product, category, family, customer, salesperson, warehouse and month, with drill-down, comparison periods, saved views and stock against sales.', gaps: 'Custom fields only in the CRM; no report designer; no budgets or forecasts beside the analysis.', evidence: 'test/erp-modules.test.ts' },

  // B. Finance and accounting
  { n: 11, name: 'General ledger and accounting', area: 'B', status: 'live', path: '/finance/', now: 'Chart of accounts, journals that must balance, posted journals locked, trial balance, profit and loss, balance sheet, cash flow, general ledger report.', gaps: 'One lock date per workspace rather than financial periods; no year-end closing journal.', evidence: 'test/fin-ledger.test.ts' },
  { n: 12, name: 'Accounts payable', area: 'B', status: 'live', path: '/finance/', now: 'Supplier bills with approval and payments recorded; purchase orders and goods receipts to draft bills.', gaps: 'No payment files for the bank.', depends: [11], evidence: 'test/fin-sales.test.ts, test/erp-r2.test.ts' },
  { n: 13, name: 'Accounts receivable', area: 'B', status: 'live', path: '/finance/', now: 'Invoices, payments, credit notes with refunds, aged receivables, overdue reminders to the team.', gaps: 'No customer statements or automatic reminders to customers.', depends: [11], evidence: 'test/fin-sales.test.ts' },
  { n: 14, name: 'Cash management', area: 'B', status: 'partial', path: '/finance/', now: 'Cash and debt on the dashboard, a 4 to 26 week cash forecast from open documents and recurring items.', gaps: 'Saved forecasts and scenarios.', depends: [11, 15], evidence: 'test/fin-ledger.test.ts' },
  { n: 15, name: 'Bank management and reconciliation', area: 'B', status: 'live', path: '/finance/', now: 'Bank accounts, statement import (CSV, OFX, QIF) with duplicate checks, suggested matches, reconciliation records.', gaps: 'No live bank feeds.', evidence: 'test/fin-banking.test.ts' },
  { n: 16, name: 'Budgeting and financial planning', area: 'B', status: 'live', path: '/finance/', now: 'Budgets by account and month (up to 36), by department, project or cost centre, from last year’s actuals, budget against actual, alerts.', gaps: 'Budget versions, scenarios and approval.', evidence: 'test/fin-ledger.test.ts' },
  { n: 17, name: 'Expense management', area: 'B', status: 'live', path: '/finance/', now: 'Expense claims with receipts, approval and reimbursement recorded.', gaps: 'Policy limits, mileage, receipt reading.', evidence: 'test/fin-sales.test.ts' },
  { n: 18, name: 'Fixed asset management', area: 'B', status: 'new', module: 'fixed_assets', path: m('fixed_assets'), now: 'Asset register, straight-line and diminishing-value depreciation, schedules, book values, disposals with gain or loss, placing in service approved by someone else.', gaps: 'Depreciation is not posted to Finance’s ledger yet.', depends: [11], evidence: 'test/erp-modules.test.ts' },
  { n: 19, name: 'Tax management', area: 'B', status: 'partial', path: '/finance/', now: 'Tax codes, Australian GST, BAS worksheet on a cash or accrual basis; regional settings per legal entity.', gaps: 'Tax rules of other countries, lodgement, withholding tax.', depends: [11], evidence: 'test/fin-ledger.test.ts' },
  { n: 20, name: 'Cost accounting and cost centres', area: 'B', status: 'partial', path: '/finance/', now: 'Departments, projects and cost centres on every Finance line and report; manufacturing job costing; project costs from timesheets; cost centres as business units.', gaps: 'Overhead allocation rules.', depends: [11], evidence: 'test/fin-ledger.test.ts, test/erp-r3.test.ts' },
  { n: 21, name: 'Financial consolidation and multi-company accounting', area: 'B', status: 'planned', path: m('organisation'), now: 'Legal entities with ownership, currencies and exchange rates are recorded (Organisation structure).', gaps: 'Consolidating ledgers, eliminations and intercompany transactions are not built; each Finance workspace keeps one currency.', depends: [1, 11] },
  { n: 22, name: 'Revenue recognition and financial reporting', area: 'B', status: 'new', module: 'revenue', path: m('revenue'), now: 'Revenue schedules spread by month with earned and deferred amounts; Finance’s reports for financial reporting.', gaps: 'Not posted to Finance’s ledger yet; straight line only.', depends: [11, 29, 34], evidence: 'test/erp-modules.test.ts' },

  // C. Sales, CRM and customers
  { n: 23, name: 'Customer relationship management', area: 'C', status: 'live', path: '/crm/', now: 'Contacts and companies, activities, notes, files, tags, custom fields, automations, insights and reports.', evidence: 'test/crm-records.test.ts' },
  { n: 24, name: 'Marketing management', area: 'C', status: 'new', module: 'marketing', path: m('marketing'), now: 'Campaigns with budget approval, spend, results, cost per lead and return.', gaps: 'Email sending, lists and segments; results are entered, not counted from the CRM.', depends: [23], evidence: 'test/erp-modules.test.ts' },
  { n: 25, name: 'Lead management', area: 'C', status: 'live', path: '/crm/', now: 'Leads with scoring and conversion to contact, company and deal.', evidence: 'test/crm-records.test.ts' },
  { n: 26, name: 'Opportunity and pipeline management', area: 'C', status: 'live', path: '/crm/', now: 'Pipelines and stages, deals on a board, stage history, deal items.', evidence: 'test/crm-records.test.ts' },
  { n: 27, name: 'Quotation and proposal management', area: 'C', status: 'live', path: '/finance/', now: 'Quotes with versions, online acceptance, part invoicing, made from a CRM deal.', evidence: 'test/fin-sales.test.ts, test/company-links.test.ts' },
  { n: 28, name: 'Sales order management', area: 'C', status: 'live', path: `${CO}/supply-chain`, now: 'Sales orders for the one customer record, amendments, allocation, make to order, from a won deal.', evidence: 'test/erp-r5-supply-chain.test.ts' },
  { n: 29, name: 'Contract and agreement management', area: 'C', status: 'new', module: 'contracts', path: m('contracts'), now: 'Customer contracts with review, approval by someone else, signing recorded, notice-date reminders.', gaps: 'No electronic signature.', depends: [23], evidence: 'test/erp-modules.test.ts' },
  { n: 30, name: 'Pricing, discounts and promotions', area: 'C', status: 'new', module: 'pricing', path: m('pricing'), now: 'Approved price lists by customer, group and quantity; promotions; a price check; line and document discounts in Finance.', gaps: 'Sales orders are not repriced from price lists yet.', depends: [28, 45], evidence: 'test/erp-modules.test.ts' },
  { n: 31, name: 'Sales commission management', area: 'C', status: 'new', module: 'commissions', path: m('commissions'), now: 'Plans by salesperson and statements worked out from won CRM deals, approved by someone else.', gaps: 'Not paid through payroll yet.', depends: [26], evidence: 'test/erp-modules.test.ts' },
  { n: 32, name: 'Customer service and support', area: 'C', status: 'new', module: 'service', path: m('service'), now: 'Tickets with priority, response targets, assignment, resolution and reminders.', gaps: 'No customer portal or shared inbox.', depends: [23], evidence: 'test/erp-modules.test.ts' },
  { n: 33, name: 'Returns, refunds and RMA management', area: 'C', status: 'live', path: `${CO}/supply-chain`, now: 'Returns authorised, received into stock or quarantine, draft credit notes, refunds in Finance.', evidence: 'test/erp-r5-supply-chain.test.ts' },
  { n: 34, name: 'Subscription and recurring revenue management', area: 'C', status: 'new', module: 'subscriptions', path: m('subscriptions'), now: 'Subscriptions by customer and plan, draft invoices each period, monthly recurring revenue; recurring invoices in Finance.', gaps: 'No card payments.', depends: [13, 23], evidence: 'test/erp-modules.test.ts' },

  // D. Procurement and suppliers
  { n: 35, name: 'Supplier and vendor management', area: 'D', status: 'live', path: `${CO}/procurement`, now: 'Supplier master with approval, hold and block, ABN format check, contacts, documents, link to Finance.', evidence: 'test/erp.test.ts' },
  { n: 36, name: 'Strategic sourcing and RFQ', area: 'D', status: 'live', path: `${CO}/procurement/rfqs`, now: 'Requests for quotation, quotations compared, selection approved.', evidence: 'test/erp-r2.test.ts' },
  { n: 37, name: 'Purchase requisition management', area: 'D', status: 'live', path: `${CO}/procurement/requisitions`, now: 'Requisitions approved by a procurement manager who did not raise them.', evidence: 'test/erp-r2.test.ts' },
  { n: 38, name: 'Procurement and purchasing management', area: 'D', status: 'live', path: `${CO}/procurement`, now: 'The purchasing cycle from requisition to receipt, approval limits, reports.', evidence: 'test/erp-r2.test.ts' },
  { n: 39, name: 'Purchase order management', area: 'D', status: 'live', path: `${CO}/procurement/purchase-orders`, now: 'Purchase orders with approval limits, amendments, PDF, receipts.', gaps: 'Emailing the PDF from BIZOMAT.', evidence: 'test/erp-r2.test.ts' },
  { n: 40, name: 'Supplier contract management', area: 'D', status: 'new', module: 'contracts', path: m('contracts'), now: 'Supplier contracts in Contracts: review, approval, signing recorded and renewal reminders.', depends: [35], evidence: 'test/erp-modules.test.ts' },
  { n: 41, name: 'Supplier portal', area: 'D', status: 'planned', now: 'Suppliers are managed by staff.', gaps: 'A portal needs sign-in for suppliers’ own people, which is not built.', depends: [35, 39] },
  { n: 42, name: 'Supplier performance and evaluation', area: 'D', status: 'live', path: `${CO}/procurement`, now: 'On time, in full, lead time, refused quantities and quality defects per supplier.', evidence: 'test/erp-r2.test.ts, test/erp-r4-quality.test.ts' },
  { n: 43, name: 'Import, export and trade compliance', area: 'D', status: 'new', module: 'trade', path: m('trade'), now: 'Declarations with tariff codes, origin, incoterms, customs value, permits and clearance.', gaps: 'Nothing is lodged with customs.', depends: [39, 28], evidence: 'test/erp-modules.test.ts' },
  { n: 44, name: 'Invoice matching and procurement reconciliation', area: 'D', status: 'new', module: 'matching', path: m('matching'), now: 'Three-way matching of supplier invoices with order and receipts, within a tolerance, variances approved by someone else.', depends: [39, 48, 12], evidence: 'test/erp-modules.test.ts' },

  // E. Inventory and warehouse
  { n: 45, name: 'Inventory management', area: 'E', status: 'live', path: `${CO}/inventory`, now: 'Stock by product, location, lot and serial; the append-only ledger; reservations; valuation by weighted average or FIFO.', evidence: 'test/erp-r2.test.ts' },
  { n: 46, name: 'Warehouse management', area: 'E', status: 'live', path: `${CO}/inventory`, now: 'Warehouses and a location tree, transfers, quarantine.', evidence: 'test/erp-r2.test.ts' },
  { n: 47, name: 'Warehouse management system (WMS)', area: 'E', status: 'live', path: `${CO}/inventory`, now: 'The warehouse screen for phones, QR labels, scanning, receive, issue, move and count.', evidence: 'test/erp-r2.test.ts' },
  { n: 48, name: 'Goods receiving and inbound processing', area: 'E', status: 'live', path: `${CO}/procurement/receipts`, now: 'Partial receipts, damage and refusals, lots, serials and expiry, inspection on receipt.', evidence: 'test/erp-r2.test.ts' },
  { n: 49, name: 'Putaway and warehouse location management', area: 'E', status: 'partial', path: `${CO}/inventory`, now: 'Locations by store, zone, rack, shelf and bin; moves between them.', gaps: 'Suggested putaway locations.', evidence: 'test/erp-r2.test.ts' },
  { n: 50, name: 'Picking, packing and fulfilment', area: 'E', status: 'live', path: `${CO}/supply-chain`, now: 'Pick lists by soonest expiry, packages, dispatch once.', evidence: 'test/erp-r5-supply-chain.test.ts' },
  { n: 51, name: 'Shipping and dispatch', area: 'E', status: 'live', path: `${CO}/supply-chain`, now: 'Shipments, carriers with tracking, dispatch, proof of delivery, delivery schedule.', gaps: 'Bookings in carriers’ systems.', evidence: 'test/erp-r5-supply-chain.test.ts' },
  { n: 52, name: 'Batch, lot and serial tracking', area: 'E', status: 'live', path: `${CO}/inventory`, now: 'Lots and serials from receipt to delivery, expiry, traceability with inspections and NCRs.', evidence: 'test/erp-r2.test.ts, test/erp-r5-supply-chain.test.ts' },
  { n: 53, name: 'Inventory replenishment and stock planning', area: 'E', status: 'partial', path: `${CO}/manufacturing`, now: 'Reorder points, minimums, safety stock, shortages report, MRP buy suggestions to requisitions.', gaps: 'Automatic replenishment orders and transfers between sites.', depends: [45, 57], evidence: 'test/erp-r3.test.ts' },
  { n: 54, name: 'Stocktake, cycle counting and adjustment', area: 'E', status: 'live', path: `${CO}/inventory`, now: 'Stocktakes and cycle counts approved by someone else, adjustments with approval thresholds.', evidence: 'test/erp-r2.test.ts' },

  // F. Manufacturing and production
  { n: 55, name: 'Bill of materials management', area: 'F', status: 'live', path: `${CO}/products`, now: 'Multi-level bills, loops refused, explosion, where-used, comparison, cost roll-up.', evidence: 'test/erp.test.ts' },
  { n: 56, name: 'Routing and manufacturing process management', area: 'F', status: 'live', path: `${CO}/manufacturing`, now: 'Routings with revisions released by someone else, operations, work centres and machines.', evidence: 'test/erp-r3.test.ts' },
  { n: 57, name: 'Material requirements planning (MRP)', area: 'F', status: 'live', path: `${CO}/manufacturing`, now: 'MRP level by level with lead times, stock, reservations and sales demand; suggestions to orders.', evidence: 'test/erp-r3.test.ts' },
  { n: 58, name: 'Production planning and scheduling', area: 'F', status: 'live', path: `${CO}/manufacturing`, now: 'Master production schedule, scheduled operations with predecessors.', gaps: 'Finite scheduling and a planning board.', evidence: 'test/erp-r3.test.ts' },
  { n: 59, name: 'Shop floor management', area: 'F', status: 'live', path: `${CO}/manufacturing`, now: 'A phone screen per work centre: jobs, timers, output, scrap, downtime and inspections.', evidence: 'test/erp-r3.test.ts' },
  { n: 60, name: 'Production order management', area: 'F', status: 'live', path: `${CO}/manufacturing`, now: 'Manufacturing orders from release to close, materials through stock, finished goods at actual cost.', evidence: 'test/erp-r3.test.ts' },
  { n: 61, name: 'Capacity planning', area: 'F', status: 'live', path: `${CO}/manufacturing`, now: 'Rough-cut capacity by work centre and week.', evidence: 'test/erp-r3.test.ts' },
  { n: 62, name: 'Subcontracting and outsourced manufacturing', area: 'F', status: 'new', module: 'subcontracting', path: m('subcontracting'), now: 'Subcontract orders with the manufacturing order, materials sent, what comes back and its cost; outsourced operations on routings.', gaps: 'Stock moves to and from the subcontractor are made in Inventory.', depends: [60, 35], evidence: 'test/erp-modules.test.ts' },
  { n: 63, name: 'Product configuration and variant management', area: 'F', status: 'partial', path: `${CO}/products`, now: 'Product variants by size, model, configuration, material, finish and options.', gaps: 'Configure-to-order rules.', evidence: 'test/erp.test.ts' },
  { n: 64, name: 'Manufacturing execution system (MES)', area: 'F', status: 'partial', path: `${CO}/manufacturing`, now: 'The shop floor screen records labour, machine time, output, scrap, rework and downtime.', gaps: 'Machine data collection and OEE.', evidence: 'test/erp-r3.test.ts' },
  { n: 65, name: 'Manufacturing costing and production performance', area: 'F', status: 'live', path: `${CO}/manufacturing`, now: 'Estimated against actual cost by element, variances, job profitability, eight reports.', evidence: 'test/erp-r3.test.ts' },

  // G. Quality, engineering and maintenance
  { n: 66, name: 'Quality management system (QMS)', area: 'G', status: 'live', path: `${CO}/quality`, now: 'Inspection plans, inspections, quarantine, NCRs, corrective actions, reports.', gaps: 'Statistical process control and quality audits.', evidence: 'test/erp-r4-quality.test.ts' },
  { n: 67, name: 'Quality inspection and testing', area: 'G', status: 'live', path: `${CO}/quality`, now: 'Readings checked against limits on the server, results, photos.', evidence: 'test/erp-r4-quality.test.ts' },
  { n: 68, name: 'Non-conformance, CAPA and corrective actions', area: 'G', status: 'live', path: `${CO}/quality`, now: 'NCRs with containment, root cause, disposition; corrective and preventive actions with segregation of duties.', evidence: 'test/erp-r4-quality.test.ts' },
  { n: 69, name: 'Engineering change management (ECR and ECO)', area: 'G', status: 'live', path: `${CO}/products`, now: 'Change requests and change orders approved and released by someone else.', evidence: 'test/erp.test.ts' },
  { n: 70, name: 'Product lifecycle management (PLM)', area: 'G', status: 'live', path: `${CO}/products`, now: 'Lifecycle stages with effective dates, revisions, change control, engineering documents.', evidence: 'test/erp.test.ts' },
  { n: 71, name: 'Engineering and CAD integration', area: 'G', status: 'live', path: `${CO}/cad`, now: 'CAD Automation set-up and computers in Products and Engineering; CAD inside the ERP behind its switch (off).', evidence: 'test/cad.test.ts' },
  { n: 72, name: 'Maintenance management', area: 'G', status: 'live', path: `${CO}/maintenance`, now: 'Requests, work orders, preventive maintenance, inspections, prestarts, parts from stock; the field release adds list filters and CSV, the asset summary and duplicate warnings, request withdrawal, required parts by product with reservations and requisitions, stocktakes of the stores, inspection rounds over many assets, the Readings page, the job card, sign-off and in-app alerts.', gaps: 'Email copies of alerts are built but switched off; offline field work, technician workload planning and the AI scheduling assistant are planned.', evidence: 'test/maintenance.test.ts, test/maintenance-m2-m3.test.ts, test/maintenance-A.test.ts, test/maintenance-B.test.ts, test/maintenance-C.test.ts, test/maintenance-D.test.ts' },
  { n: 73, name: 'Enterprise asset management (EAM)', area: 'G', status: 'live', path: `${CO}/maintenance`, now: 'Asset register and hierarchy, meters, sites, reliability reports.', evidence: 'test/maintenance-m2-m3.test.ts' },
  { n: 74, name: 'Calibration and measurement equipment', area: 'G', status: 'new', module: 'calibration', path: m('calibration'), now: 'Instruments with intervals, calibrations checked against tolerance on the server, due reminders, out of service on a fail.', depends: [66, 73], evidence: 'test/erp-modules.test.ts' },
  { n: 75, name: 'Environment, health and safety (EHS)', area: 'G', status: 'improved', module: 'environment', path: m('environment'), now: 'BIZOMAT WHS (hazards, risk assessments, incidents, investigations, actions); now environmental aspects and energy, water, waste and emissions records.', gaps: 'WHS inspections, permits and training records; emissions factors.', evidence: 'test/whs-core.test.ts, test/erp-modules.test.ts' },

  // H. Logistics, projects and services
  { n: 76, name: 'Transportation management (TMS)', area: 'H', status: 'new', module: 'transport', path: m('transport'), now: 'Delivery runs with vehicle, driver and stops linked to shipments; carriers and shipments in Supply chain.', gaps: 'Route optimisation and carrier bookings.', depends: [51, 77], evidence: 'test/erp-modules.test.ts' },
  { n: 77, name: 'Fleet management', area: 'H', status: 'new', module: 'fleet', path: m('fleet'), now: 'Vehicles, fuel with consumption, trip logbook, registration and insurance reminders, maintenance assets.', depends: [72], evidence: 'test/erp-modules.test.ts' },
  { n: 78, name: 'Project management', area: 'H', status: 'live', path: '/tasks/', now: 'Workspaces, boards, timelines with dependencies, milestones, goals, dashboards, documents, automations.', evidence: 'test/boards.test.ts, test/schedule-engine.test.ts' },
  { n: 79, name: 'Project accounting and cost control', area: 'H', status: 'improved', module: 'timesheets', path: m('timesheets'), now: 'Project budgets, cost entries and earned value in Projects; now project hours and costs from approved timesheets, and draft invoices for billable hours.', depends: [78, 82], evidence: 'test/project-controls.test.ts, test/erp-modules.test.ts' },
  { n: 80, name: 'Field service management', area: 'H', status: 'new', module: 'service', path: m('service'), now: 'Field jobs scheduled, dispatched, started and completed on a phone, then invoiced as drafts.', depends: [32, 81], evidence: 'test/erp-modules.test.ts' },
  { n: 81, name: 'Service management and service contracts', area: 'H', status: 'new', module: 'service', path: m('service'), now: 'Service agreements with response times, visits, value and end-date reminders.', depends: [29], evidence: 'test/erp-modules.test.ts' },
  { n: 82, name: 'Timesheet and time tracking', area: 'H', status: 'new', module: 'timesheets', path: m('timesheets'), now: 'Weekly timesheets by project, approved by the person’s manager, used by payroll and project costs; timers in Projects.', depends: [78, 85], evidence: 'test/erp-modules.test.ts' },
  { n: 83, name: 'Resource planning and allocation', area: 'H', status: 'new', module: 'resources', path: m('resources'), now: 'Allocations by project and week with utilisation and over-allocation; the workload view in Projects.', depends: [78, 85], evidence: 'test/erp-modules.test.ts' },
  { n: 84, name: 'Dispatch and scheduling', area: 'H', status: 'new', module: 'service', path: `${m('service')}/dispatch`, now: 'A dispatch board of field jobs by technician and day.', depends: [80], evidence: 'test/erp-modules.test.ts' },

  // I. Human resources and people
  { n: 85, name: 'Human resource management (HRM)', area: 'I', status: 'new', module: 'hr', path: m('hr'), now: 'Employee records with manager, department and location, leave with approval and balances, attendance, self service.', depends: [1, 2], evidence: 'test/erp-modules.test.ts' },
  { n: 86, name: 'Recruitment and applicant tracking', area: 'I', status: 'new', module: 'recruitment', path: m('recruitment'), now: 'Job openings approved before opening, applicants through the stages, hiring into an employee record.', gaps: 'No public careers page.', depends: [85], evidence: 'test/erp-modules.test.ts' },
  { n: 87, name: 'Employee onboarding and offboarding', area: 'I', status: 'new', module: 'onboarding', path: m('onboarding'), now: 'Checklists from templates with who and when; made on hiring and on leaving.', depends: [85], evidence: 'test/erp-modules.test.ts' },
  { n: 88, name: 'Learning and training management', area: 'I', status: 'new', module: 'training', path: m('training'), now: 'Courses, training records, results and expiry reminders.', gaps: 'No online course delivery.', depends: [85], evidence: 'test/erp-modules.test.ts' },
  { n: 89, name: 'Performance and talent management', area: 'I', status: 'new', module: 'performance', path: m('performance'), now: 'Reviews with weighted objectives, self assessment, reviewer’s completion, acknowledgement; goals.', depends: [85], evidence: 'test/erp-modules.test.ts' },
  { n: 90, name: 'Payroll and compensation management', area: 'I', status: 'new', module: 'payroll', path: m('payroll'), now: 'Pay runs from salaries and approved timesheets, withholding and contribution rates you set, approval by someone else, payslips in self service.', gaps: 'Not certified payroll: no statutory tax tables, payment files or reporting to tax authorities; not posted to Finance.', depends: [85, 82], evidence: 'test/erp-modules.test.ts' },

  // J. Industry solutions
  { n: 91, name: 'Retail ERP', area: 'J', status: 'new', module: 'retail', path: m('retail'), now: 'Stores with their stock, daily takings reconciled by someone else; promotions in Pricing.', gaps: 'Not a point-of-sale terminal.', depends: [30, 45], evidence: 'test/erp-modules.test.ts' },
  { n: 92, name: 'Wholesale and distribution ERP', area: 'J', status: 'new', module: 'wholesale', path: m('wholesale'), now: 'Trade accounts with tiers, discounts, price lists and credit limits; distribution through Supply chain.', depends: [28, 30], evidence: 'test/erp-modules.test.ts' },
  { n: 93, name: 'Construction and engineering ERP', area: 'J', status: 'new', module: 'construction', path: m('construction'), now: 'Estimates, variations, progress claims with retention, certified and invoiced as drafts.', depends: [29, 78], evidence: 'test/erp-modules.test.ts' },
  { n: 94, name: 'Professional services ERP', area: 'J', status: 'new', module: 'professional', path: m('professional'), now: 'Client engagements by fee, time or retainer with hours from approved timesheets.', depends: [82, 34], evidence: 'test/erp-modules.test.ts' },
  { n: 95, name: 'Healthcare ERP', area: 'J', status: 'new', module: 'healthcare', path: m('healthcare'), now: 'Facilities with accreditation, staff credentials with expiry reminders; procurement, assets and workforce through the core modules.', gaps: 'Administration only: no clinical or patient records.', depends: [85, 72], evidence: 'test/erp-modules.test.ts' },
  { n: 96, name: 'Public sector and nonprofit ERP', area: 'J', status: 'new', module: 'public_sector', path: m('public_sector'), now: 'Grants and restricted funds with budgets, spending, reporting dates and acquittal.', depends: [16], evidence: 'test/erp-modules.test.ts' },
  { n: 97, name: 'Energy, mining and agriculture ERP', area: 'J', status: 'new', module: 'natural_resources', path: m('natural_resources'), now: 'Sites and permits, production by day, shift and commodity; equipment through Maintenance.', depends: [72], evidence: 'test/erp-modules.test.ts' },
];

/** The catalogue's numbers in order, for the tests. */
export const catalogueProblems = (moduleKeys: Set<string>): string[] => {
  const out: string[] = [];
  CATALOGUE.forEach((e, i) => {
    if (e.n !== i + 1) out.push(`entry ${i + 1} has number ${e.n}`);
    if ((e.status === 'new' || (e.status === 'improved' && e.module)) && !e.module) out.push(`${e.n}: a new module names its framework module`);
    if (e.module && !moduleKeys.has(e.module)) out.push(`${e.n}: unknown module ${e.module}`);
    if ((e.status === 'partial' || e.status === 'planned') && !e.gaps) out.push(`${e.n}: says what is missing`);
    if (e.status !== 'planned' && !e.evidence) out.push(`${e.n}: names its evidence`);
  });
  if (CATALOGUE.length !== 97) out.push(`${CATALOGUE.length} entries, not 97`);
  return out;
};
