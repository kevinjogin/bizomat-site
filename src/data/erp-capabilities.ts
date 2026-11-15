// BIZOMAT ERP capability registry: what the ERP covers, by enterprise domain, and the honest status of each feature.
//
// One public source for the ERP's functional coverage (owner, 14 Nov 2026). The domain structure is inspired by the
// public module structures of the large ERP suites; no text is copied from them and no parity with them is claimed.
// The full matrix (owner, data owner, dependencies, phase and tests per feature) is
// docs/erp/architecture/13-enterprise-capability-matrix.md; the phases are in 15-erp-roadmap-2026.md.
//
// Every feature carries exactly one status (the same four as FEATURE_STATUS in src/config/systems.ts):
//   live            works today in BIZOMAT, in one system.
//   connected       works today by linking two BIZOMAT systems through shared company or organisation ids and their
//                   own APIs, without copying records.
//   in-development  being built, not switched on for everyone.
//   planned         designed, not built.
//
// Where the statuses come from (read on 14 Nov 2026; when the code changes, change this file in the same commit):
//   Company accounts and the ERP shell: apps/work/src/worker/company/ (routes.ts, links.ts, departments.ts, sync.ts,
//     verify.ts, id-provider.ts), apps/work/src/worker/system/ (system.ts, admin.ts), apps/work/src/client/system/,
//     apps/work/src/client/components/layout/SuiteRail.tsx, migrations 0013, 0014, 0016 and 0017,
//     docs/company/README.md, docs/system/README.md.
//   Finance: apps/work/src/worker/fin/, apps/work/src/shared/fin/, migrations 0011 and 0015, docs/finance/README.md.
//     Finance never connects to banks, processes payments, lodges with the ATO or runs payroll: those stay planned.
//   CRM: apps/work/src/worker/crm/, apps/work/src/shared/crm/, migration 0010, docs/crm/README.md.
//   Projects: apps/work/README.md (feature table), apps/work/src/worker/routes/, apps/work/src/worker/services/schedule/,
//     migrations 0001 and 0008.
//   CAD Automation: apps/cad/CLAUDE.md, src/data/platform-catalog.ts (CAD). Its ERP status feed
//     (/company/api/id/cad-status) is built but CAD Automation's reporter is not merged, and Sign in with BIZOMAT for
//     CAD Automation is built but not merged (docs/BIZOMAT-PROJECT-STATUS.md, 14 Nov 2026): both in-development.
//   Asset management and maintenance (CMMS): owner's brief of 14 Nov 2026 (MEX used as a functional reference only).
//     Its Stage 1 is live (apps/work/src/worker/maintenance, migration 0018_maintenance.sql; acceptance tests A to D and J
//     in apps/work/test/maintenance.test.ts and test-node/maintenance.test.ts); the rest is planned.
//   ERP Release 1 (owner's brief of 14 Nov 2026, Release 1): the product master with variants, revisions with change
//     requests and change orders, multi-level bills of materials, engineering documents and the supplier master
//     (apps/work/src/worker/erp, migration 0020_erp_engineering_procurement.sql; Scenario A and the rule tests in
//     apps/work/test/erp.test.ts and test-node/erp.test.ts).
//   ERP Release 2 (owner's brief of 14 Nov 2026, Release 2): purchase requisitions, requests for quotation with the
//     quotation comparison, purchase orders with approval limits and amendments, goods receipts, supplier performance,
//     one draft bill in Finance per receipt, and inventory: warehouses and locations, stock by lot and serial, the
//     movement ledger, reservations, returns, quarantine, scrap, adjustments, counts, weighted average and FIFO
//     valuation, traceability, QR labels and the warehouse screen (apps/work/src/worker/erp, migration
//     0021_erp_purchasing_inventory.sql; Scenarios B and C and the rule tests in apps/work/test/erp-r2.test.ts and
//     test-node/erp-r2.test.ts). Inventory postings to Finance's ledger: planned.
//   ERP Release 3 (owner's brief of 14 Nov 2026, Release 3; built on the branch erp-release-3, live once merged and
//     deployed): work centres and machines, routings with revisions, manufacturing orders with materials, operations,
//     labour and machine time, output, scrap, rework, downtime and inspection points, finished-goods receipts at actual
//     cost, the shop floor, the master production schedule, MRP, rough-cut capacity, job costing by element and the
//     manufacturing reports (apps/work/src/worker/erp, migration 0022_erp_manufacturing.sql; Scenario D and the rule
//     tests in apps/work/test/erp-r3.test.ts and test-node/erp-r3.test.ts). Production value postings to Finance's
//     ledger, job profitability, finite scheduling and full Quality: planned.
//   Everything else (sales orders, quality, supply chain, service, human capital): docs/erp/architecture/02 to 10.
//     Nothing of it is built, so it is planned.
// Rule: if a feature cannot be found in the code or the docs above, it is planned. Notes are public text: plain
// language, no file paths, no repository names.
//
// A test should compare this file with the code over time (docs/erp/architecture/13, section 4).

export type CapabilityStatus = 'live' | 'connected' | 'in-development' | 'planned';

export const CAPABILITY_STATUSES: readonly CapabilityStatus[] = ['live', 'connected', 'in-development', 'planned'];

export interface ErpCapability {
  readonly name: string;
  readonly status: CapabilityStatus;
  /** A qualifier where the status alone would say too much or too little. */
  readonly note?: string;
}

export interface ErpDomain {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  /** The BIZOMAT system that serves the domain today, or will serve it. */
  readonly servedBy: string;
  readonly features: readonly ErpCapability[];
}

const cap = (name: string, status: CapabilityStatus, note?: string): ErpCapability => (note ? { name, status, note } : { name, status });

export const ERP_DOMAINS: readonly ErpDomain[] = [
  {
    id: 'enterprise',
    name: 'Enterprise management',
    summary: 'The company structure the other domains work in: companies, people, roles, departments and the shared ERP workspace.',
    servedBy: 'BIZOMAT ERP (Administration) and Company accounts',
    features: [
      cap('BIZOMAT ERP workspace', 'live', 'Every tool opens inside the ERP with one module rail and one sign-in.'),
      cap('Multiple companies', 'live', 'A person can belong to several registered companies and switch between them in the ERP.'),
      cap('Own company for every person', 'live', 'Not registered. It holds the tools a person owns outside a registered company.'),
      cap('Company registration with checks', 'live', 'ABN check digit, and a register lookup only when it is switched on; email confirmation; Australian phone and postcode rules. Phone numbers are never called verified.'),
      cap('Subsidiaries', 'planned', 'There are no parent and child companies yet.'),
      cap('Legal entities', 'planned', 'One registered company is one entity today.'),
      cap('Sites and branches', 'planned'),
      cap('Departments', 'live', 'Nested to any depth, each with a head.'),
      cap('Departments in every tool', 'connected', 'A department is a team in Projects and the CRM and a tracking department in Finance.'),
      cap('Cost centres', 'live', 'A Finance tracking category. Not yet shared with the other systems.'),
      cap('Intercompany transactions', 'planned'),
      cap('Multi-currency', 'planned', 'Each Finance workspace and CRM organisation uses one currency. Project budgets in Projects support 11 currencies.'),
      cap('Localisation', 'live', 'Australia only: ABN and ACN checks, GST tax codes with BAS labels, Australian phone and postcode rules. Other countries are planned.'),
      cap('Business policies', 'planned', 'Finance has its own approval settings and period lock. Company-wide policies are planned.'),
      cap('User and role management', 'live', 'Company roles (owner, administrator, member) and a role in each tool. Each tool keeps its own roles and checks them.'),
      cap('Invitations with tool roles and departments', 'live'),
      cap('Tools grouped by company', 'live', 'A tool shared with someone outside its company shows under that company as Shared with you.'),
      cap('Platform console', 'live', 'For platform administrators only: accounts, companies and activity across the tools.'),
    ],
  },
  {
    id: 'finance',
    name: 'Finance and controlling',
    summary: 'The ledger, what is owed both ways, cash, budgets, tax and the reports that come from posted entries.',
    servedBy: 'BIZOMAT Finance',
    features: [
      cap('General ledger', 'live', 'Double-entry. The database refuses unbalanced postings, postings into locked periods and changes to posted journals.'),
      cap('Chart of accounts and tax codes', 'live'),
      cap('Accounts payable', 'live', 'Bills, purchase orders to bills, payments recorded and aged payables. No payment is made from BIZOMAT.'),
      cap('Accounts receivable', 'live', 'Invoices, credit notes, payments recorded and aged receivables. No payment is collected by BIZOMAT.'),
      cap('Expense claims', 'live'),
      cap('Asset accounting', 'planned', 'Fixed assets and depreciation come in a later stage of Finance.'),
      cap('Cash management', 'live', 'Money accounts, statement import (CSV, OFX, QIF), matching, rules and reconciliation. No bank connection.'),
      cap('Bank feeds', 'planned', 'Needs an approved provider. None is chosen, and Finance never connects to a bank today.'),
      cap('Treasury', 'planned', 'No payments, investments, borrowing or hedging.'),
      cap('Financial consolidation', 'planned', 'Needs legal entities and multi-currency first.'),
      cap('Management accounting', 'live', 'Reports filtered by department, project and cost centre.'),
      cap('Cost accounting', 'planned', 'No cost allocation, standard costs or activity rates yet.'),
      cap('Profitability analysis', 'live', 'Profit and loss by department, project or cost centre. By product or customer is planned.'),
      cap('Budgets', 'live', 'Monthly budgets by account, department, project or cost centre, with budget against actual.'),
      cap('Forecasts', 'live', 'Cash flow forecast. Financial planning scenarios are planned.'),
      cap('Tax and regulatory reporting', 'live', 'GST and BAS worksheet only. BIZOMAT does not lodge with the ATO and is not a certified tax product.'),
      cap('BAS module with lodged-period snapshots', 'planned', 'A later stage of Finance. Lodgement stays with the business or its agent.'),
      cap('Financial statements and reports', 'live', '12 reports from posted journals, with CSV and PDF.'),
      cap('Period lock and audit trail', 'live'),
    ],
  },
  {
    id: 'sales',
    name: 'Sales and distribution',
    summary: 'From the first lead to the paid invoice: customers, opportunities, quotes, orders, deliveries and billing.',
    servedBy: 'BIZOMAT CRM and BIZOMAT Finance; sales orders, deliveries and returns in BIZOMAT ERP (planned module)',
    features: [
      cap('Customer relationship management (CRM)', 'live', 'Organisations, companies, contacts, activities, timelines, automations, search and saved views.'),
      cap('Leads', 'live', 'Statuses, an explainable score and conversion to a contact, company and deal in one step.'),
      cap('Opportunities', 'live', 'Deals in several pipelines with custom stages, products and weighted value.'),
      cap('One customer record across CRM and Finance', 'connected', 'A CRM company is linked once to the Finance customer it is billed as; open invoices and the amount owed show in the CRM.'),
      cap('Quotes', 'live', 'Finance quotes with versions kept as sent, online acceptance, expiry and progress invoicing.'),
      cap('Quote from a CRM deal', 'connected', 'The deal lists its quotes, and each step shows on the deal timeline without amounts.'),
      cap('Sales product and service catalogue', 'live', 'CRM products with code and unit price, used on deals.'),
      cap('Pricing', 'planned', 'Prices are entered per line or come from the CRM catalogue. Price lists and pricing rules are planned.'),
      cap('Sales contracts', 'planned'),
      cap('Sales orders', 'planned'),
      cap('Order management', 'planned'),
      cap('Credit management', 'planned', 'Payment terms and aged receivables exist in Finance. Credit limits and holds are planned.'),
      cap('Deliveries', 'planned'),
      cap('Billing', 'live', 'Finance invoices, progress invoices from quotes, recurring invoices and secure online links.'),
      cap('Won deal to draft invoice', 'connected', 'A draft only, once per deal. Finance approval posts it.'),
      cap('Returns', 'planned', 'Finance credit notes are live. Returns of goods are planned.'),
      cap('Rebates', 'planned'),
      cap('Customer service', 'planned', 'CRM activities and timelines record contact with customers. Cases and service levels are planned.'),
      cap('Sales forecast and reports', 'live', 'CRM dashboard and 11 reports, including the weighted and commit forecast.'),
    ],
  },
  {
    id: 'procurement',
    name: 'Sourcing and procurement',
    summary: 'Choosing suppliers, asking for prices, ordering, receiving and matching what was ordered, received and billed.',
    servedBy: 'BIZOMAT ERP Procurement; BIZOMAT Finance (bills and payments)',
    features: [
      cap('Supplier master', 'live', 'Suppliers with approval, hold and block by a procurement manager who did not create them, contacts, documents, payment terms, lead times and the products each supplies. Linked, not copied, to the Finance supplier they are paid as. An ABN is checked for its form only.'),
      cap('Supplier qualification', 'planned'),
      cap('Requests for quotation (RFQs)', 'live', 'To approved suppliers only, from an approved requisition or directly, with a PDF to download and send. Each supplier\'s quotation is recorded: prices, lead time, freight, payment terms, validity and documents. Sending by email with the PDF attached is not built yet.'),
      cap('Supplier comparisons', 'live', 'Quotations side by side, line by line, with the cheapest and fastest marked. A buyer selects one with a reason; a procurement manager who did not select it approves the choice.'),
      cap('Supplier contracts', 'planned'),
      cap('Purchase requisitions', 'live', 'Products or free-text items with a department, a required date, a budget reference and a reason, approved by a procurement manager who did not raise them.'),
      cap('Purchase orders', 'live', 'In the ERP, to approved suppliers: product or free-text lines with discounts and tax codes; approved on submit within the company\'s limit, else by a procurement manager; amendments keep each earlier version and go back to approval; a PDF to download and send. Finance\'s own purchase orders remain for businesses without the ERP.'),
      cap('Purchase order to bill', 'live', 'Each goods receipt makes one draft bill in Finance, once, for someone whose Finance role may create bills.'),
      cap('Purchase scheduling', 'planned'),
      cap('Goods receipts', 'live', 'All or part of an order: accepted, damaged and rejected quantities with reasons, lot and serial numbers, expiry dates, and products that need inspection flagged. Stock comes in with the receipt, in one step.'),
      cap('Three-way matching', 'planned', 'Receipts and their draft bills are linked; matching against the supplier\'s own invoice is planned.'),
      cap('Supplier invoices', 'live', 'Finance bills with approval and payments recorded. No payment is made from BIZOMAT.'),
      cap('Supplier performance', 'live', 'On time, in full and lead time, measured from goods receipts.'),
    ],
  },
  {
    id: 'engineering',
    name: 'Product lifecycle and engineering',
    summary: 'Products from design to release: product records, CAD models and drawings, bills of materials, revisions and changes.',
    servedBy: 'BIZOMAT ERP Products and Engineering; BIZOMAT Engineering Automation (CAD Automation)',
    features: [
      cap('Product master', 'live', 'Numbered products with type, category, unit, costs, price, physical details, lifecycle stage and effective dates, images and attachments. The CRM product catalogue still serves deals on its own.'),
      cap('Product classification', 'planned'),
      cap('Variants and configurations', 'live', 'A variant is a product of its own that records what sets it apart: size, model, configuration, material, finish or options.'),
      cap('Specifications', 'planned'),
      cap('Parts and assemblies in SOLIDWORKS', 'live', 'CAD Automation builds native features on the engineer\'s own computer from an AI assistant. Tested through a simulated SOLIDWORKS; field testing on Windows with SOLIDWORKS 2022 is the next milestone.'),
      cap('Engineering drawings', 'live', 'Native SOLIDWORKS drawings through CAD Automation, exported as PDF, DWG or DXF. Released drawings are not kept as ERP records yet.'),
      cap('CAD integration', 'live', 'CAD Automation\'s connector, add-in and Companion. Its setup is in the ERP under Products and Engineering.'),
      cap('CAD computers and jobs in the ERP', 'in-development', 'The ERP side is built. CAD Automation does not report yet, and the ERP page says so.'),
      cap('Design checks', 'live', 'Measuring, inspection and interference checks through CAD Automation.'),
      cap('Model import and export', 'live', 'STEP, IGES and Parasolid in; STEP, STL, Parasolid and IGES out.'),
      cap('Bill of materials (BOM) management', 'live', 'Lines with quantity, unit, scrap allowance, reference designators, position, effective dates, optional lines and alternatives. A bill of materials belongs to a revision and locks when it is released.'),
      cap('Multi-level BOM', 'live', 'Explosion through every level, where-used, comparison of two revisions and material cost roll-up, with missing costs flagged. Loops are refused. Each component\'s available stock, and shortages for a build quantity.'),
      cap('Routings', 'live', 'Revisions of a product\'s routing: operations at work centres and machines with set-up and run times, crew, inspection points, outsourced steps and predecessors. Released by an engineering approver who did not draft them; copied to a new draft.'),
      cap('Engineering revisions', 'live', 'Draft, in a change order, released and superseded. A release supersedes the previous revision in the same step.'),
      cap('Engineering change requests and orders (ECR and ECO)', 'live', 'Approved and released by an engineering approver who did not draft the change order; in a company of one, the exception is recorded.'),
      cap('Document management', 'live', 'Engineering documents per product and revision, with versions and approval: an uploaded file, or a reference to a CAD file on the engineer\'s own computer. DXF and STEP files are checked and only ever downloaded.'),
      cap('Product costing', 'planned'),
      cap('Lifecycle status', 'planned'),
      cap('Compliance', 'planned'),
      cap('Drawing generated from an ERP product', 'planned', 'Needs Sign in with BIZOMAT in CAD Automation. Engineering documents can reference a CAD file today.'),
    ],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    summary: 'Planning and making products: production orders, materials, capacity, the shop floor and production cost.',
    servedBy: 'BIZOMAT ERP Manufacturing',
    features: [
      cap('Discrete manufacturing', 'live', 'Manufacturing orders made from a released bill of materials and a released routing.'),
      cap('Process manufacturing', 'planned', 'After discrete manufacturing: needs formulas and batch records.'),
      cap('Repetitive manufacturing', 'planned', 'An order can be marked repetitive; rate-based schedules are planned.'),
      cap('Make to stock', 'live', 'Orders for stock, planned by MRP from the master production schedule, stock and reorder points.'),
      cap('Make to order', 'live', 'An order carries its customer or job as a reference, and confirmed demand is entered in the master production schedule. Links to sales orders come with Release 5.'),
      cap('Engineer to order', 'planned', 'An order can be marked engineer to order with a job reference. Engineering and costing tied to a project are planned.'),
      cap('Project manufacturing', 'planned'),
      cap('Master production scheduling', 'live', 'Forecast or confirmed demand per product, quantity and due date, with a reference.'),
      cap('Material requirements planning (MRP)', 'live', 'Level by level through released bills of materials, from confirmed demand, stock less reservations, open purchase and manufacturing orders, lead times, safety stock, reorder points and order sizes. Suggestions to make (a draft order), buy (a requisition) or expedite, marked late or overdue. Each run is kept with its inputs.'),
      cap('Capacity planning', 'live', 'Rough-cut: load per work centre per week against its available hours, with overloads flagged. Finite scheduling is planned.'),
      cap('Advanced planning and scheduling', 'planned'),
      cap('Production orders', 'live', 'Draft, released, in progress, completed and closed, or cancelled; materials with the scrap allowance, operations copied from the routing, estimated cost, assigned people, and amendments with their history.'),
      cap('Job management', 'planned', 'Orders carry a job reference, assigned people and priorities. Job boards are planned.'),
      cap('Shop-floor control', 'live', 'A screen for phones: jobs ready and in progress per work centre, progress, shortages, outstanding inspections and machines down.'),
      cap('Manufacturing execution (MES)', 'live', 'Operations started in order (or overlapping where allowed), labour per person by timer or minutes, machine time, output, scrap, rework, downtime and inspection results, then completed. Connections to machines are planned.'),
      cap('Labour and machine tracking', 'live'),
      cap('Work in progress (WIP)', 'live', 'The cost of each open order to date. Posting it to Finance\'s ledger is planned: nothing is posted.'),
      cap('Scrap and rework', 'live', 'Scrap with a reason at each operation and materials scrapped against an order; rework quantities and rework time.'),
      cap('Production costing', 'live', 'Estimated against actual by element (materials, labour, machine, outsourcing, overheads, scrap, rework), finished goods valued at actual cost, and variances recorded at close. Job profitability is planned: it needs sales orders.'),
      cap('Overall equipment effectiveness (OEE)', 'planned', 'Downtime and output are recorded; the OEE measure is planned.'),
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory and warehousing',
    summary: 'What is in stock, where it is, how it moves and what it is worth.',
    servedBy: 'BIZOMAT ERP Inventory and Warehouse',
    features: [
      cap('Multi-warehouse', 'live'),
      cap('Bins and locations', 'live', 'A tree of store, zone, rack, shelf and bin, with quarantine, receiving, dispatch, work-in-progress and finished-goods locations.'),
      cap('Raw materials', 'live', 'Any product but a service can be kept in stock.'),
      cap('Work in progress stock', 'planned', 'Work-in-progress locations exist. Materials issued to a manufacturing order leave stock and their cost is carried on the order until finished goods are received.'),
      cap('Finished goods', 'live', 'Kept, moved and counted like any stock, and received from manufacturing orders at actual cost.'),
      cap('Stock movements', 'live', 'An append-only ledger: every movement with its document, never changed or deleted.'),
      cap('Batch and lot tracking', 'live', 'With expiry dates, and traceability from the supplier, order and receipt to every later move.'),
      cap('Serial numbers', 'live', 'One unit each, never in stock twice.'),
      cap('Stock adjustments', 'live', 'Each with a reason; above the company\'s threshold a warehouse manager who did not ask for it approves.'),
      cap('Quarantine and returns', 'live', 'Quarantine and release, customer returns, returns to suppliers and scrap.'),
      cap('Barcodes', 'live', 'Product numbers, SKUs and location codes typed on the warehouse screen, or read by the phone\'s camera where the browser can read codes. Not every browser can.'),
      cap('QR scanning', 'live', 'QR labels for products and locations, made by BIZOMAT itself, to print and scan.'),
      cap('Reservations', 'live'),
      cap('Stock valuation', 'live', 'Weighted average or first in, first out, chosen before the first movement and then locked. Posting stock value to Finance\'s ledger is planned: nothing is posted today.'),
      cap('Cycle counts', 'live', 'Stocktakes and cycle counts with count sheets and variances, approved by a warehouse manager who did not count, then posted as movements.'),
      cap('Picking and packing', 'planned', 'Issues from a location work today; pick lists and packing are planned.'),
      cap('Receiving', 'live', 'Against purchase orders, on a computer or a phone.'),
      cap('Dispatch', 'planned', 'Dispatch locations exist; deliveries come with Supply Chain.'),
      cap('Replenishment', 'planned', 'Reorder points, minimums, maximums and a shortages report work today; replenishment orders are not made automatically.'),
    ],
  },
  {
    id: 'supply-chain',
    name: 'Supply chain and logistics',
    summary: 'Planning demand and supply, and moving goods between suppliers, sites and customers.',
    servedBy: 'BIZOMAT ERP Supply Chain (planned module)',
    features: [
      cap('Demand planning', 'planned'),
      cap('Supply planning', 'planned'),
      cap('Material planning', 'live', 'MRP in Manufacturing: what to make and buy, from confirmed demand, stock and open orders.'),
      cap('Inventory optimisation', 'planned'),
      cap('Warehouse management', 'planned', 'The warehouse operations of Inventory and Warehouse.'),
      cap('Transportation management', 'planned'),
      cap('Freight', 'planned'),
      cap('Shipment tracking', 'planned', 'Tracking references first; connections to carriers come later.'),
      cap('Landed costs', 'planned'),
      cap('Distribution', 'planned'),
      cap('Backorders', 'planned'),
      cap('Inter-site transfers', 'planned'),
    ],
  },
  {
    id: 'quality',
    name: 'Quality management',
    summary: 'Inspections, nonconformances and corrective actions, from suppliers to finished products.',
    servedBy: 'BIZOMAT ERP Quality (planned module)',
    features: [
      cap('Supplier quality', 'planned'),
      cap('Incoming inspection', 'planned'),
      cap('In-process inspection', 'planned', 'A routing operation can be an inspection point recording a pass or fail with a note. Inspection plans, results by characteristic and nonconformances come with Quality.'),
      cap('Final inspection', 'planned'),
      cap('Quality plans', 'planned'),
      cap('Nonconformance reports (NCR)', 'planned'),
      cap('Corrective and preventive actions (CAPA)', 'planned', 'Actions will be tasks in Projects.'),
      cap('Statistical process control (SPC)', 'planned'),
      cap('Calibration', 'planned'),
      cap('Quality audits', 'planned'),
      cap('Traceability', 'planned'),
      cap('Product compliance', 'planned'),
      cap('Quality reporting', 'planned'),
    ],
  },
  {
    id: 'assets',
    name: 'Asset management and maintenance',
    summary: 'A maintenance management system (CMMS): assets, requests, work orders, technicians, preventive plans, parts and reliability.',
    servedBy: 'BIZOMAT ERP Asset Management and Maintenance (Stage 1 live); depreciation in BIZOMAT Finance (planned)',
    features: [
      // CMMS Stage 1: live (owner, 14 Nov 2026), tested by apps/work/test/maintenance.test.ts.
      cap('Asset register', 'live'),
      cap('Asset hierarchy', 'live', 'Assets within assets and locations.'),
      cap('Equipment master and asset details', 'live'),
      cap('Maintenance requests with approval', 'live', 'Approval by a supervisor or administrator when the company requires it.'),
      cap('Maintenance work orders', 'live', 'Standard work orders with tasks, required parts as text lines, labour and notes. Recurring work orders from plans are planned.'),
      cap('Corrective maintenance', 'live', 'A standard work order of the corrective job type.'),
      cap('Breakdown maintenance', 'live', 'A standard work order of the breakdown job type.'),
      cap('Technician assignment', 'live', 'Maintenance roles per company: administrator, supervisor, technician and requester.'),
      cap('Labour timer', 'live'),
      cap('Photos and documents', 'live', 'On assets, requests and work orders.'),
      // CMMS Stage 2.
      cap('Preventive maintenance plans', 'planned', 'Triggered by time, usage or condition.'),
      cap('Maintenance planning and calendar', 'planned'),
      cap('Recurring work orders', 'planned'),
      cap('Asset readings and meters', 'planned', 'Readings with thresholds and trend charts.'),
      cap('Condition monitoring', 'planned', 'From readings and thresholds first; sensor feeds come with IoT integrations.'),
      cap('Threshold alerts', 'planned'),
      cap('Work order inspections', 'planned', 'Checklists across several assets: pass, fail, observation, not applicable, number, text, photo and signature. A failed answer can raise a request or a work order by rule.'),
      // CMMS Stage 3.
      cap('Digital prestart checklists', 'planned'),
      cap('Spare parts and stores', 'planned', 'Through ERP Inventory and Procurement: minimum and maximum, reorder points, reservations, issues and returns to work orders. Stage 1 records required parts as text only.'),
      cap('Maintenance stocktakes', 'planned', 'With approval, through the central inventory service.'),
      cap('Barcode and QR scanning', 'planned', 'For assets and parts.'),
      cap('Multi-site maintenance', 'planned'),
      cap('Fuel records', 'planned'),
      // CMMS Stage 4.
      cap('Trades and technician workload planning', 'planned'),
      cap('AI scheduling assistant', 'planned', 'Proposes schedules only, with a preview, an explanation and a comparison. A person edits, accepts or rejects each one, and the history is kept.'),
      cap('Reliability reporting', 'planned', 'Mean time between failures and to repair, failure frequency, preventive maintenance compliance, repeat failures and cost by asset and department, with exports.'),
      cap('Downtime', 'planned'),
      cap('Predictive maintenance', 'planned'),
      cap('IoT integrations', 'planned'),
      cap('Offline field operation', 'planned', 'Not offered until the offline queue, reconnection, conflict resolution and audit are tested.'),
      cap('Lifecycle costs', 'planned', 'Labour, parts and contractor costs per asset over its life.'),
      // Administration and links to the other systems.
      cap('Maintenance administration centre', 'planned', 'Custom and mandatory fields, labels, categories, job types, priorities, approval rules, templates, field-level edit rights and an audit of configuration changes. Stage 1 has maintenance roles and one approval setting.'),
      cap('Maintenance costs in Finance', 'planned', 'Labour, parts and contractor costs as expense allocations, with references to fixed assets.'),
      cap('Shutdown projects in Projects', 'planned'),
      cap('Drawings and manuals from Engineering', 'planned'),
    ],
  },
  {
    id: 'projects',
    name: 'Project and portfolio management',
    summary: 'Planning, running and costing projects, with tasks, schedules, budgets and the figures from Finance.',
    servedBy: 'BIZOMAT Projects, with costs from BIZOMAT Finance',
    features: [
      cap('Portfolios', 'planned', 'Folders, dashboards across boards and goals exist. Portfolio management is planned.'),
      cap('Project planning', 'live', 'Boards, timeline and Gantt, typed dependencies, critical path scheduling and working calendars.'),
      cap('Work breakdown structure (WBS)', 'live', 'WBS numbers from groups, tasks and subtasks in the schedule.'),
      cap('Milestones', 'live'),
      cap('Baselines and earned value', 'live'),
      cap('Project budgets', 'live', 'Approved, estimated, actual and committed amounts per project.'),
      cap('Resources', 'live', 'People assigned to tasks, the workload view and work units on scheduled tasks. Resource pools, skills and rates are planned.'),
      cap('Timesheets', 'live', 'Time tracked on tasks. Timesheet approval is planned.'),
      cap('Project procurement', 'planned'),
      cap('Project costing', 'connected', 'Income and costs posted to the project\'s Finance tracking project, plus cost entries in Projects.'),
      cap('Project billing', 'planned', 'Progress invoices from a Finance quote are live. Billing from project time or milestones is planned.'),
      cap('Project profitability', 'connected', 'Income, costs and remaining budget from Finance, on the company\'s projects page.'),
      cap('Deal to project', 'connected', 'A CRM deal starts a project in the company\'s Projects workspace, once per deal.'),
      cap('CRM activity to task', 'connected', 'A CRM activity becomes a task in a project, linked back to the CRM.'),
      cap('Project documents', 'live', 'Documents with versions, comments and links to boards and tasks.'),
      cap('Project reports and dashboards', 'live', 'Eight report types (PDF, Excel, HTML, CSV) and dashboards with 11 widget types.'),
    ],
  },
  {
    id: 'service',
    name: 'Service management',
    summary: 'After-sales service: cases, contracts, warranty, service orders, field work and repairs.',
    servedBy: 'BIZOMAT ERP Service (planned module), with customers in BIZOMAT CRM',
    features: [
      cap('Customer service cases', 'planned', 'CRM activities and timelines record contact with customers today.'),
      cap('Service contracts', 'planned'),
      cap('Warranty', 'planned'),
      cap('Service orders', 'planned'),
      cap('Field service', 'planned'),
      cap('Technician scheduling', 'planned'),
      cap('Repairs', 'planned'),
      cap('Return material authorisation (RMA)', 'planned'),
      cap('Service spare parts', 'planned'),
      cap('Service history', 'planned', 'The CRM timeline holds each customer\'s activities, notes and documents. History by product or asset is planned.'),
    ],
  },
  {
    id: 'people',
    name: 'Human capital management',
    summary: 'Employees and their organisation, skills, time and development.',
    servedBy: 'BIZOMAT ERP People (planned module), with people and departments in Company accounts',
    features: [
      cap('Employees', 'planned', 'People in a company are accounts with roles, not employee records.'),
      cap('Organisation structures', 'live', 'Nested departments with heads. Positions and reporting lines are planned.'),
      cap('Recruitment', 'planned'),
      cap('Onboarding', 'planned', 'Invitations give a new person their company and tool roles today. HR onboarding is planned.'),
      cap('Training', 'planned'),
      cap('Qualifications', 'planned'),
      cap('Workforce scheduling', 'planned'),
      cap('Attendance', 'planned'),
      cap('Leave', 'planned'),
      cap('Payroll', 'planned', 'BIZOMAT does not run payroll, PAYG withholding or Single Touch Payroll. It would need its own approved design and provider.'),
      cap('Superannuation', 'planned', 'Not offered. It depends on payroll.'),
      cap('Performance', 'planned'),
    ],
  },
  {
    id: 'governance',
    name: 'Governance and compliance',
    summary: 'Controls, approvals, audit and the security of the data the other domains keep.',
    servedBy: 'BIZOMAT ERP Administration, with each system\'s own controls',
    features: [
      cap('Internal controls', 'live', 'In Finance: approvals, the period lock and ledger integrity enforced by the database. Company-wide controls are planned.'),
      cap('Segregation of duties', 'planned', 'Finance roles already separate people who submit from people who approve. Company-wide rules are planned.'),
      cap('Approval limits', 'planned', 'Finance approval is by record type and role, not by amount.'),
      cap('Audit trails', 'live', 'Each system keeps its own audit log, and the platform console shows activity across them. One audit view for a company is planned.'),
      cap('Risk management', 'planned'),
      cap('Policy management', 'planned'),
      cap('Regulatory records', 'planned'),
      cap('Document retention', 'planned', 'Deleted Finance documents are kept for the audit trail. Retention rules are planned.'),
      cap('Data security', 'live', 'Every query is limited to the person\'s company or organisation, records of others answer as not found, unsafe requests need a CSRF token, and downloads are sandboxed.'),
      cap('Access reviews', 'planned', 'People and roles are listed per company and in the platform console. Scheduled reviews are planned.'),
    ],
  },
  {
    id: 'analytics',
    name: 'Enterprise analytics and AI',
    summary: 'Dashboards, reports and analysis across the domains, and AI that helps without acting on its own.',
    servedBy: 'BIZOMAT ERP Dashboard and Reports',
    features: [
      cap('Executive dashboards', 'connected', 'The ERP dashboard shows each company\'s figures read from Projects, the CRM and Finance. Role dashboards are planned.'),
      cap('Department dashboards', 'connected', 'The company overview shows totals for each department from each tool.'),
      cap('Reports hub', 'live', 'Every report of the company\'s tools in one place. Each opens in its own module with its own permissions.'),
      cap('Operational KPIs', 'planned', 'Each tool\'s own dashboard is live. Measures across modules, such as on-time delivery, are planned.'),
      cap('Financial analytics', 'live', 'The Finance dashboard and reports.'),
      cap('Sales analytics', 'live', 'The CRM dashboard and reports.'),
      cap('Production analytics', 'live', 'Manufacturing reports: production output, work order progress, material consumption, labour utilisation, production variance, machine downtime, MRP suggestions and capacity load.'),
      cap('Predictive forecasting', 'planned'),
      cap('Exception detection', 'planned', 'Rule-based alerts exist in Finance (due, overdue, budgets nearly spent) and the CRM (overdue follow-ups).'),
      cap('AI business assistant', 'planned', 'AI apps work in SOLIDWORKS through CAD Automation, and AI Search covers the public website. An assistant over ERP records is planned.'),
      cap('Workflow automation', 'live', 'Inside Projects and the CRM (automations) and Finance (recurring records and alerts). Automation across systems is planned.'),
      cap('Natural-language reporting', 'planned'),
      cap('Controlled AI actions', 'planned', 'AI actions on ERP records will be proposals a person approves. CAD Automation already limits AI apps to its own tools, acting as the signed-in person.'),
    ],
  },
  {
    id: 'integration',
    name: 'Enterprise integration platform',
    summary: 'How the systems connect to each other and to the outside: APIs, events, identity, documents and extensions.',
    servedBy: 'BIZOMAT ERP platform: the shared API and the BIZOMAT sign-in',
    features: [
      cap('APIs', 'live', 'Each system\'s API, used with the session or a personal API token. A published API reference and scoped tokens are planned.'),
      cap('Webhooks', 'live', 'Signed outgoing webhooks from Projects, and messages to Slack and Microsoft Teams. Not yet from the CRM, Finance or the ERP.'),
      cap('Event processing', 'planned', 'An event outbox for reactions between modules.'),
      cap('Document exchange', 'live', 'Secure online links for quotes, invoices and credit notes; customers accept quotes online. E-invoicing is planned.'),
      cap('Electronic data interchange (EDI)', 'planned'),
      cap('External connections', 'live', 'Email through the platform\'s email provider, Slack and Microsoft Teams, and AI apps through CAD Automation. No bank, payment, carrier or mailbox connections.'),
      cap('Identity and access management', 'live', 'One BIZOMAT account and session for every system in the ERP, with email confirmation and personal API tokens.'),
      cap('Sign in with BIZOMAT for CAD Automation', 'in-development', 'The BIZOMAT side is built. CAD Automation\'s side is built and not yet released.'),
      cap('Extensible workflows', 'planned', 'Automations inside Projects and the CRM are live. Workflows that span systems are planned.'),
      cap('Custom fields', 'live', 'In Projects (25 column types) and the CRM (11 field types). Not yet in Finance or ERP records.'),
      cap('Custom reports', 'live', 'Projects dashboards built from board data, and saved views in Projects and the CRM. A report designer across systems is planned.'),
      cap('Integration monitoring', 'planned', 'Projects records each webhook delivery and its result. One monitor for every connection is planned.'),
    ],
  },
];

/** How many features carry each status, for one domain's features or for every domain. */
export function capabilityCounts(features: readonly ErpCapability[] = ERP_DOMAINS.flatMap((d) => d.features)): Record<CapabilityStatus, number> {
  const counts: Record<CapabilityStatus, number> = { live: 0, connected: 0, 'in-development': 0, planned: 0 };
  for (const f of features) counts[f.status] += 1;
  return counts;
}
