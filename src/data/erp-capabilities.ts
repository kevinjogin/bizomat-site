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
//   CAD Automation: apps/cad/CLAUDE.md, src/data/platform-catalog.ts (CAD). Sign in with BIZOMAT (Continue with BIZOMAT)
//     is live; CAD Automation inside the ERP is released behind flags that ship off (docs/cad/README.md).
//   Checked against the code again for the Knowledge Centre (20 Nov 2026, docs/learn/AUDIT.md): company roles, segregation
//     of duties, approval limits, scoped API tokens and the access review.
//   Asset management and maintenance (CMMS): owner's brief of 14 Nov 2026 (MEX used as a functional reference only).
//     Its Stage 1 is live (apps/work/src/worker/maintenance, migration 0018_maintenance.sql; acceptance tests A to D and J
//     in apps/work/test/maintenance.test.ts and test-node/maintenance.test.ts). Stages M2 and M3 (ERP Release 4, part B;
//     built on the branch erp-release-4-maintenance, live once merged and deployed): preventive maintenance, readings,
//     inspections, prestarts, parts through ERP Inventory, trades and labour costs, downtime, sites, QR labels and the
//     reliability reports (migration 0024_maintenance_m2_m3.sql; Scenario F and the rule tests in
//     apps/work/test/maintenance-m2-m3.test.ts and test-node/maintenance-m2-m3.test.ts). The AI scheduling assistant,
//     offline field work and maintenance costs posted to Finance: planned.
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
//     ledger, job profitability and finite scheduling: planned.
//   ERP Release 4 part A (owner's brief of 14 Nov 2026, Release 4, quality management; built on the branch
//     erp-release-4-quality, live once merged and deployed): inspection plans with versions and characteristics,
//     inspections of goods receipts, manufacturing operations, finished goods and suppliers with the result worked out
//     from the limits, quarantine and release, nonconformance reports with containment, root cause and dispositions,
//     corrective and preventive actions, traceability of a lot's inspections and NCRs, and seven quality reports
//     (apps/work/src/worker/erp/quality.ts, ncr.ts, quality-reports.ts, migration 0023_erp_quality.sql; Scenario E and the
//     rule tests in apps/work/test/erp-r4-quality.test.ts and test-node/erp-r4-quality.test.ts). SPC, calibration,
//     quality audits and product compliance: planned.
//   ERP Release 5 part A (owner's brief of 14 Nov 2026, section 9, supply chain and logistics; built on the branch
//     erp-release-5-supply-chain, live once merged and deployed): sales orders for the company's CRM and Finance customer
//     record, allocation, make to order through a linked manufacturing order, MRP demand from confirmed orders, job
//     profitability, carriers, shipments with pick lists, packages, dispatch and delivery confirmation with proof of
//     delivery, the dispatch email, the delivery schedule, returns, one draft invoice per shipment and one draft credit
//     note per return in Finance, traceability to the delivery and seven reports (apps/work/src/worker/erp/sales.ts,
//     logistics.ts, returns.ts, supply-reports.ts, migration 0025_erp_supply_chain.sql; Scenario G and the rule tests in
//     apps/work/test/erp-r5-supply-chain.test.ts and test-node/erp-r5-supply-chain.test.ts). Stock value postings to
//     Finance's ledger, carrier connections, demand and supply planning, landed costs and backorder automation: planned.
//   BIZOMAT WHS, Release 1 (owner's WHS brief; built on the branch whs-release-1, live once merged and deployed): the
//     hazard register, risk assessments with a configurable matrix and the hierarchy of controls, incidents with
//     investigations, the regulator notification record (decided and submitted by people, never by the system), the
//     actions register with evidence, confidential health records, the dashboard and versioned jurisdiction packs, all
//     Not verified until a platform administrator verifies them (apps/work/src/worker/whs, migration 0026_whs_core.sql;
//     apps/work/test/whs-core.test.ts and test-node/whs-core.test.ts). Inspections, permits, contractors, training,
//     chemicals, PPE, emergency management, consultation, health surveillance and the compliance register: planned.
//   Everything else (service, human capital): docs/erp/architecture/02 to 10. Nothing of it is built, so it is planned.
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
      cap('Subsidiaries', 'live', 'Legal entities in BIZOMAT ERP name the entity that owns them and the ownership, and each can name its own Finance workspace, which may be another registered company’s.'),
      cap('Legal entities', 'live', 'Organisation structure in BIZOMAT ERP: each entity’s country, currency, fiscal year, time zone and language, and its Finance workspace.'),
      cap('Sites and branches', 'planned'),
      cap('Departments', 'live', 'Nested to any depth, each with a head.'),
      cap('Departments in every tool', 'connected', 'A department is a team in Projects and the CRM and a tracking department in Finance.'),
      cap('Cost centres', 'live', 'A Finance tracking category. Not yet shared with the other systems.'),
      cap('Intercompany transactions', 'connected', 'A sale between two legal entities, approved by someone else, makes a draft invoice in the seller’s Finance workspace and a draft bill in the buyer’s, converted at your exchange rate.'),
      cap('Multi-currency', 'live', 'Each Finance workspace and CRM organisation uses one currency. Between them, BIZOMAT ERP converts at the exchange rates you enter: intercompany bills, postings from fixed assets, pay runs and revenue schedules, and the consolidated report. Project budgets in Projects support 11 currencies.'),
      cap('Localisation', 'live', 'Australia only: ABN and ACN checks, GST tax codes with BAS labels, Australian phone and postcode rules. Other countries are planned.'),
      cap('Business policies', 'planned', 'Finance has its own approval settings and period lock. Company-wide policies are planned.'),
      cap('User and role management', 'live', 'Company roles (owner, admin, manager, employee and read only) and a role in each tool. Each tool keeps its own roles and checks them.'),
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
      cap('Asset accounting', 'live', 'The fixed asset register in BIZOMAT ERP: straight-line or diminishing-value depreciation, book values and disposals with their gain or loss. Each month’s depreciation is posted to Finance’s ledger once, into the accounts the company chooses; a disposal’s journal is entered in Finance.'),
      cap('Cash management', 'live', 'Money accounts, statement import (CSV, OFX, QIF), matching, rules and reconciliation. No bank connection.'),
      cap('Bank feeds', 'planned', 'Needs an approved provider. None is chosen, and Finance never connects to a bank today.'),
      cap('Treasury', 'planned', 'No payments, investments, borrowing or hedging.'),
      cap('Financial consolidation', 'live', 'A consolidated profit and loss and balance sheet across the legal entities’ Finance workspaces, translated at the closing rate, with intercompany balances eliminated. No translation reserve or minority interest is worked out.'),
      cap('Management accounting', 'live', 'Reports filtered by department, project and cost centre.'),
      cap('Cost accounting', 'live', 'Overhead costs spread across departments by percentage and posted to Finance’s ledger (BIZOMAT ERP, Cost allocation). Allocation by headcount, floor area or activity rates is planned.'),
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
    servedBy: 'BIZOMAT CRM and BIZOMAT Finance; sales orders, deliveries and returns in BIZOMAT ERP Supply Chain',
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
      cap('Sales orders', 'live', 'For the company\'s one customer record (the CRM company and the Finance customer it is billed as), priced as Finance prices lines, confirmed, allocated, shipped and invoiced.'),
      cap('Won deal to sales order', 'connected', 'A won CRM deal becomes a draft sales order for its customer, once; the deal\'s items become lines where their code matches a product.'),
      cap('Order management', 'live', 'Statuses from draft to invoiced worked out from the lines, shipments and invoices; amendments with the earlier versions kept; cancelling and closing with a reason; the open orders report.'),
      cap('Credit management', 'planned', 'Payment terms and aged receivables exist in Finance. Credit limits and holds are planned.'),
      cap('Deliveries', 'live', 'Shipments with a pick list, packages, dispatch from a phone and delivery confirmation with proof of delivery.'),
      cap('Billing', 'live', 'Finance invoices, progress invoices from quotes, recurring invoices and secure online links.'),
      cap('Won deal to draft invoice', 'connected', 'A draft only, once per deal. Finance approval posts it.'),
      cap('Shipment to draft invoice', 'connected', 'One draft invoice in Finance per shipment: what was shipped at the order\'s prices, with the freight charge as a line. Made once; Finance approval posts it.'),
      cap('Returns', 'live', 'Authorised by a sales manager, received back into stock (into quarantine to inspect it), with one draft credit note in Finance per return.'),
      cap('Rebates', 'planned'),
      cap('Customer service', 'planned', 'CRM activities and timelines record contact with customers. Cases and service levels are planned.'),
      cap('Sales forecast and reports', 'live', 'CRM dashboard and 11 reports, including the weighted and commit forecast.'),
      cap('Sales and margin analysis', 'live', 'In Product Management: sales, cost and margin of the goods dispatched, by product, category, family, customer, salesperson, warehouse and month, against the same period last year or the period before, with drill-down, saved views, CSV and stock against sales (days of cover, reorder, not moving). Budgets and forecasts beside it are planned.'),
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
    servedBy: 'BIZOMAT ERP Product Management and Engineering; BIZOMAT Engineering Automation (CAD Automation)',
    features: [
      cap('Product master', 'live', 'Numbered products with type, category, unit, costs, price, physical details, lifecycle stage and effective dates, images and attachments. The CRM product catalogue still serves deals on its own.'),
      cap('Product classification', 'planned'),
      cap('Variants and configurations', 'live', 'A variant is a product of its own that records what sets it apart: size, model, configuration, material, finish or options.'),
      cap('Specifications', 'planned'),
      cap('Parts and assemblies in SOLIDWORKS', 'live', 'CAD Automation builds native features on the engineer\'s own computer from an AI assistant. Tested through a simulated SOLIDWORKS; field testing on Windows with SOLIDWORKS 2022 is the next milestone.'),
      cap('Engineering drawings', 'live', 'Native SOLIDWORKS drawings through CAD Automation, exported as PDF, DWG or DXF. Released drawings are not kept as ERP records yet.'),
      cap('CAD integration', 'live', 'CAD Automation\'s connector, add-in and Companion. Its setup is in the ERP under Engineering.'),
      cap('CAD computers and jobs in the ERP', 'in-development', 'The ERP side and CAD Automation\'s report are built. Computers show in the ERP only once CAD Automation reports them; until then the ERP page says so.'),
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
      cap('Drawing generated from an ERP product', 'planned', 'Engineering documents can reference a CAD file today.'),
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
      cap('Make to order', 'live', 'A manufacturing order made from a sales order line, linked both ways, with the customer\'s order as its reference.'),
      cap('Engineer to order', 'planned', 'An order can be marked engineer to order with a job reference. Engineering and costing tied to a project are planned.'),
      cap('Project manufacturing', 'planned'),
      cap('Master production scheduling', 'live', 'Forecast or confirmed demand per product, quantity and due date, with a reference.'),
      cap('Material requirements planning (MRP)', 'live', 'Level by level through released bills of materials, from confirmed sales orders and the schedule\'s demand, stock less reservations, open purchase and manufacturing orders, lead times, safety stock, reorder points and order sizes. Suggestions to make (a draft order), buy (a requisition) or expedite, marked late or overdue. Each run is kept with its inputs.'),
      cap('Capacity planning', 'live', 'Rough-cut: load per work centre per week against its available hours, with overloads flagged. Finite scheduling is planned.'),
      cap('Advanced planning and scheduling', 'planned'),
      cap('Production orders', 'live', 'Draft, released, in progress, completed and closed, or cancelled; materials with the scrap allowance, operations copied from the routing, estimated cost, assigned people, and amendments with their history.'),
      cap('Job management', 'planned', 'Orders carry a job reference, assigned people and priorities. Job boards are planned.'),
      cap('Shop-floor control', 'live', 'A screen for phones: jobs ready and in progress per work centre, progress, shortages, outstanding inspections and machines down.'),
      cap('Manufacturing execution (MES)', 'live', 'Operations started in order (or overlapping where allowed), labour per person by timer or minutes, machine time, output, scrap, rework, downtime and inspection results, then completed. Connections to machines are planned.'),
      cap('Labour and machine tracking', 'live'),
      cap('Work in progress (WIP)', 'live', 'The cost of each open order to date. Posting it to Finance\'s ledger is planned: nothing is posted.'),
      cap('Scrap and rework', 'live', 'Scrap with a reason at each operation and materials scrapped against an order; rework quantities and rework time.'),
      cap('Production costing', 'live', 'Estimated against actual by element (materials, labour, machine, outsourcing, overheads, scrap, rework), finished goods valued at actual cost, and variances recorded at close.'),
      cap('Job profitability', 'live', 'For orders made to order: the sales order line\'s revenue before tax against the order\'s actual cost, on the order and in a report.'),
      cap('Overall equipment effectiveness (OEE)', 'live', 'Availability, performance and quality by work centre and machine, from the machine time, downtime and output recorded on the shop floor. Machines do not send data.'),
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
      cap('Picking and packing', 'live', 'Pick lists from the stock allocated to a sales order (soonest expiry first, then the oldest), and packages with weight, size and contents, on a phone.'),
      cap('Receiving', 'live', 'Against purchase orders, on a computer or a phone.'),
      cap('Dispatch', 'live', 'The picked stock leaves once, never beyond what is there, and its allocation is used up.'),
      cap('Replenishment', 'live', 'Every product at or below its reorder point ordered up to its maximum level on one draft requisition, run by hand from Stock, Replenishment. No schedule yet.'),
    ],
  },
  {
    id: 'supply-chain',
    name: 'Supply chain and logistics',
    summary: 'Planning demand and supply, and moving goods between suppliers, sites and customers.',
    servedBy: 'BIZOMAT ERP Supply Chain',
    features: [
      cap('Demand planning', 'planned', 'Confirmed sales orders and the schedule\'s demand drive MRP today; forecasting demand from history is planned.'),
      cap('Supply planning', 'planned'),
      cap('Material planning', 'live', 'MRP in Manufacturing: what to make and buy, from confirmed sales orders and demand, stock and open orders.'),
      cap('Inventory optimisation', 'planned'),
      cap('Stock allocation', 'live', 'Stock reserved for each sales order line, soonest expiry first, then the oldest, outside quarantine; released when an order is cancelled or closed.'),
      cap('Warehouse management', 'planned', 'The warehouse operations of Inventory and Warehouse, and picking, packing and dispatch, work today. Advanced warehouse management is planned.'),
      cap('Carrier management', 'live', 'Carriers with their services and the address of their tracking page.'),
      cap('Transportation management', 'planned', 'Carriers and shipments work today; route and load planning, and bookings in a carrier\'s own system, are planned.'),
      cap('Freight', 'live', 'Freight cost and charge per shipment, the charge a line on the draft invoice, and a report of cost against charge.'),
      cap('Shipment tracking', 'live', 'The carrier\'s tracking number with a link to its own tracking page. Connections to carriers\' systems are planned.'),
      cap('Delivery scheduling', 'live', 'Ship dates and delivery windows on a schedule, with the orders due that have no shipment yet.'),
      cap('Proof of delivery', 'live', 'Who received it and when, with a photo, a signature drawn on the phone or a document.'),
      cap('Customer notifications', 'live', 'An optional email to the customer on dispatch, with the tracking link, where email is set up on the service. The example company sends none.'),
      cap('Returns logistics', 'live', 'Returns authorised, received back into stock or quarantine, and linked to a Quality inspection or nonconformance.'),
      cap('Traceability to the customer', 'live', 'From the supplier, order and receipt of a lot, through the manufacturing order, to the shipment and the customer who received it.'),
      cap('Supply chain reports', 'live', 'Open orders, delivery on time and in full, shipments by carrier, freight, returns, sales by product and customer, and job profitability, each with CSV.'),
      cap('Landed costs', 'planned'),
      cap('Distribution', 'planned'),
      cap('Backorders', 'planned', 'What is not shipped stays open on the order and in the open orders report; allocating it automatically as stock arrives is planned.'),
      cap('Inter-site transfers', 'planned'),
    ],
  },
  {
    id: 'quality',
    name: 'Quality management',
    summary: 'Inspections, nonconformances and corrective actions, from suppliers to finished products.',
    servedBy: 'BIZOMAT ERP Quality',
    features: [
      cap('Supplier quality', 'live', 'Supplier inspections, failed incoming inspections and nonconformances per supplier, goods returned to it, and its quality shown on the supplier page.'),
      cap('Incoming inspection', 'live', 'Goods received for products that need inspection wait for it. Readings per characteristic and sample; a failed lot can go into quarantine in the same step.'),
      cap('In-process inspection', 'live', 'An inspection point of a manufacturing operation can be a full inspection to a plan; completing it records the operation\'s pass or fail.'),
      cap('Final inspection', 'live', 'Finished goods received from a manufacturing order wait for a final inspection when the product has a released final plan.'),
      cap('Quality plans', 'live', 'Inspection plans with versions, released by a quality manager: dimensions and measured values with limits, attributes, visual checks, sample sizes and photos.'),
      cap('Nonconformance reports (NCR)', 'live', 'Containment, root cause by five whys or free text, a disposition decided once by a quality manager and carried out through stock (scrap, return to supplier, release), verification and closure.'),
      cap('Corrective and preventive actions (CAPA)', 'live', 'A responsible person, a due date and evidence; approved and closed by a quality manager who did not propose or do it. Overdue actions show on the Quality overview.'),
      cap('Statistical process control (SPC)', 'planned'),
      cap('Calibration', 'live', 'Measuring instruments with their intervals; readings checked against the tolerance on the server; a pass moves the next due date on, a fail takes the instrument out of service; reminders before it is due.'),
      cap('Quality audits', 'planned'),
      cap('Traceability', 'live', 'A lot or serial number\'s inspections and nonconformances, beside where it came from and every movement.'),
      cap('Product compliance', 'planned'),
      cap('Quality reporting', 'live', 'Inspection results, rejection rates by product and supplier, supplier defects, the NCR register and ageing, corrective actions, rework, and the cost of poor quality from scrap and rework records.'),
    ],
  },
  {
    id: 'assets',
    name: 'Asset management and maintenance',
    summary: 'A maintenance management system (CMMS): assets, requests, work orders, technicians, preventive plans, parts and reliability.',
    servedBy: 'BIZOMAT ERP Asset Management and Maintenance (stages 1 to 3 working; AI scheduling and offline work planned); depreciation in BIZOMAT Finance (planned)',
    features: [
      // CMMS Stage 1: live (owner, 14 Nov 2026), tested by apps/work/test/maintenance.test.ts.
      cap('Asset register', 'live'),
      cap('Asset hierarchy', 'live', 'Assets within assets and locations.'),
      cap('Equipment master and asset details', 'live'),
      cap('Maintenance requests with approval', 'live', 'Approval by a supervisor or administrator when the company requires it.'),
      cap('Maintenance work orders', 'live', 'Work orders with tasks, required parts, parts issued from the stores, labour by timer or entered by hand with its cost, downtime, inspections, readings and notes. Lists with filters by dates, trade, job type, department, asset and site, quick lists (my work, due today, due this week, overdue, unassigned) and CSV; a printable job card; sign-off with a name and a signature drawn on screen (not a verified electronic signature); and work recorded after it was done.'),
      cap('Parts reserved and ordered for a job', 'live', 'Required parts linked to ERP products, with what is free in the maintenance stores; reserved for the work order in ERP Inventory and released when it is completed or cancelled; a purchase requisition raised in Procurement for what is short.'),
      cap('Inspection rounds', 'live', 'One inspection work order over many assets, each with its own checklist, progress, exceptions, and approval by a supervisor who did not complete it.'),
      cap('Maintenance alerts', 'live', 'In-app alerts for requests waiting for approval, decisions, work given to someone and work completed. Email copies are built but switched off.'),
      cap('Corrective maintenance', 'live', 'A standard work order of the corrective job type.'),
      cap('Breakdown maintenance', 'live', 'A standard work order of the breakdown job type.'),
      cap('Technician assignment', 'live', 'Maintenance roles per company: administrator, supervisor, technician and requester.'),
      cap('Labour timer', 'live'),
      cap('Photos and documents', 'live', 'On assets, requests and work orders.'),
      // CMMS Stage 2 (ERP Release 4, part B): built and tested, live once deployed.
      cap('Preventive maintenance plans', 'live', 'Schedules per asset, or per class of assets through a template: every so many days, weeks or months (from the last completion or on fixed dates), every so many meter units, or when a reading is outside its limits. Paused or active.'),
      cap('Maintenance planning and calendar', 'live', 'A calendar of what is due: open preventive work orders, the next due dates and those after them, and meter-based work projected from the meter\'s daily use.'),
      cap('Recurring work orders', 'live', 'Made by the schedules when due, once per due date, meter value or reading, by the scheduler every 15 minutes or a supervisor\'s button. The next due date moves on when the work order is completed.'),
      cap('Asset readings and meters', 'live', 'Meters and gauges with an expected range; readings by hand, from a work order or in a prestart check; a lower meter reading only as a reset, with rollovers counted on. Trend charts are planned.'),
      cap('Condition monitoring', 'live', 'From readings and limits: a reading outside them makes a work order. Sensor feeds come with IoT integrations (planned).'),
      cap('Threshold alerts', 'planned', 'Readings outside the limits are flagged and can make a work order today; alerts for them are planned.'),
      cap('Work order inspections', 'live', 'Inspection templates of pass or fail, number (with limits) and text items, recorded on the work order. A failed inspection makes one corrective work order or one request. Photo and signature answers and checklists across several assets are planned.'),
      // CMMS Stage 3 (ERP Release 4, part B): built and tested, live once deployed.
      cap('Digital prestart checklists', 'live', 'A phone screen for a quick check of an asset before use. A failure raises a request; a failed critical item also sets the asset out of service, recorded with the status before.'),
      cap('Spare parts and stores', 'live', 'Parts are ERP Inventory products kept in warehouses marked as maintenance stores, issued to and returned from work orders with their cost; never below zero. Minimum, maximum and reorder points are Inventory\'s. Reserving parts for a work order is planned.'),
      cap('Maintenance stocktakes', 'live', 'Stocktakes of the maintenance stores, started and counted from Maintenance with a due date, are ERP Inventory\'s counts, approved and posted in Inventory.'),
      cap('Barcode and QR scanning', 'live', 'QR labels for assets that a phone\'s own camera opens in the ERP; scan or type a code on a phone to open an asset, its prestart check or a fault report. A Readings page takes a round of meter readings at once.'),
      cap('Multi-site maintenance', 'live', 'Sites per company, with assets placed in them, and site filters on lists, the calendar and the reports.'),
      cap('Fuel records', 'planned'),
      // CMMS Stage 4.
      cap('Trades and technicians', 'live', 'Trades with hourly rates, people linked to trades, and a labour rate per person; labour is priced when it is recorded.'),
      cap('Technician workload planning', 'planned'),
      cap('AI scheduling assistant', 'planned', 'Proposes schedules only, with a preview, an explanation and a comparison. A person edits, accepts or rejects each one, and the history is kept.'),
      cap('Reliability reporting', 'live', 'Mean time between failures and to repair, downtime and availability per asset, preventive maintenance compliance, breakdown trends, backlog by priority and age, and asset costs, with drill-down and CSV. Repeat failures and department breakdowns are planned.'),
      cap('Downtime', 'live', 'When the asset was down, recorded on its work order.'),
      cap('Predictive maintenance', 'planned'),
      cap('IoT integrations', 'planned'),
      cap('Offline field operation', 'planned', 'Not offered until the offline queue, reconnection, conflict resolution and audit are tested.'),
      cap('Lifecycle costs', 'planned', 'Labour, parts and contractor costs per asset over its life. Labour and parts per asset over any period work today (asset costs report).'),
      // Administration and links to the other systems.
      cap('Maintenance administration centre', 'planned', 'Custom and mandatory fields, labels, categories, job types, priorities, approval rules, field-level edit rights and an audit of configuration changes. Maintenance roles, the approval setting, sites, trades and rates and the stores are set today.'),
      cap('Maintenance costs in Finance', 'planned', 'Labour, parts and contractor costs as expense allocations, with references to fixed assets. Costs are recorded on each work order and in the reports today; nothing is posted to Finance.'),
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
      cap('Timesheets', 'live', 'Time tracked on tasks in Projects, and weekly timesheets by project in BIZOMAT ERP, approved by the person’s manager and used for pay runs, project costs and draft invoices.'),
      cap('Project procurement', 'planned'),
      cap('Project costing', 'connected', 'Income and costs posted to the project\'s Finance tracking project, plus cost entries in Projects.'),
      cap('Project billing', 'live', 'Progress invoices from a Finance quote; draft invoices in Finance from approved timesheets and from construction progress claims. Billing from milestones is planned.'),
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
    id: 'health-safety',
    name: 'Work health and safety',
    summary: 'Hazards, risk assessments, incidents, investigations and corrective actions, with the regulator notification record.',
    servedBy: 'BIZOMAT WHS, the Health and Safety module of BIZOMAT ERP',
    features: [
      cap('Hazard register', 'live', 'Reported from a phone with photos, rated on the company\'s risk matrix, controls assigned as actions, verified and closed.'),
      cap('Risk assessments', 'live', 'JSA, JHA, SWMS and nine more kinds: steps, hazards, initial and residual risk, controls by the hierarchy of controls, approval by someone who did not draft them, reviews and revisions.'),
      cap('Incident management', 'live', 'Injuries, illnesses, near misses, dangerous occurrences and more: immediate response, classification, every later change recorded, never deleted.'),
      cap('Investigations', 'live', 'A team, a timeline, witness statements, evidence, five whys and fishbone, contributing factors and failed controls, approved before corrective action.'),
      cap('Regulator notification records', 'live', 'A person decides with reasons and records the submission with the regulator\'s reference. BIZOMAT does not submit to regulators, and computes a due time only from a verified rule.'),
      cap('Corrective actions', 'live', 'Evidence required before completion, verification by someone else, and overdue actions escalated in the app.'),
      cap('Jurisdiction packs', 'live', 'Every Australian jurisdiction, with skeleton packs for New Zealand, the United Kingdom, Canada, Singapore and South Africa. Not verified until a competent person verifies them.'),
      cap('Confidential health records', 'live', 'Medical treatment details kept apart and read only by health officers.'),
      cap('Inspections and audits', 'planned'),
      cap('Permits to work', 'planned'),
      cap('Contractor and visitor safety', 'planned'),
      cap('Chemicals and safety data sheets', 'planned'),
      cap('Emergency management', 'planned'),
      cap('Health surveillance', 'planned'),
      cap('Compliance register', 'planned'),
    ],
  },
  {
    id: 'people',
    name: 'Human capital management',
    summary: 'Employees and their organisation, skills, time and development.',
    servedBy: 'BIZOMAT ERP People and HR, with people and departments in Company accounts',
    features: [
      cap('Employees', 'live', 'Employee records with position, department, manager, location, hours and pay basis; pay details seen only by HR managers, payroll officers and the person; self service for the person once their record names their account.'),
      cap('Organisation structures', 'live', 'Nested departments with heads. Positions and reporting lines are planned.'),
      cap('Recruitment', 'live', 'Job openings approved before they open, applicants through screening, interview and offer, and hiring into an employee record. No public careers page.'),
      cap('Onboarding', 'live', 'Onboarding and offboarding checklists made from templates on hiring and leaving, with who does each step and when.'),
      cap('Training', 'live', 'Courses and training records with results and expiry reminders. Courses are recorded, not delivered online.'),
      cap('Qualifications', 'planned'),
      cap('Workforce scheduling', 'planned'),
      cap('Attendance', 'live', 'Days worked with clock-in and clock-out times; hours worked out; approval.'),
      cap('Leave', 'live', 'Leave types with days a year; requests approved by the person’s manager or HR, never by themselves, and checked against what is left of the year.'),
      cap('Payroll', 'live', 'Pay runs worked out from salaries and approved timesheets with the withholding and contribution rates you set, approved by someone else, payslips in self service. Not certified payroll: no PAYG withholding tables, Single Touch Payroll, payment files or reporting to any tax authority; check every amount.'),
      cap('Superannuation', 'planned', 'Pay runs work out an employer contribution at the rate you set; paying and reporting superannuation is not built.'),
      cap('Performance', 'live', 'Reviews with weighted objectives, the person’s self assessment, the reviewer’s ratings and acknowledgement; goals with progress.'),
    ],
  },
  {
    id: 'governance',
    name: 'Governance and compliance',
    summary: 'Controls, approvals, audit and the security of the data the other domains keep.',
    servedBy: 'BIZOMAT ERP Administration, with each system\'s own controls',
    features: [
      cap('Internal controls', 'live', 'In Finance: approvals, the period lock and ledger integrity enforced by the database. Company-wide controls are planned.'),
      cap('Segregation of duties', 'live', 'In the ERP modules the person who drafts a revision, change order, routing or corrective action cannot approve or release it, and Finance roles separate people who submit from people who approve. Company-wide rules are planned.'),
      cap('Approval limits', 'live', 'A purchase order within the company\'s approval limit is approved on submit; above it, a procurement manager approves. Finance approval is by record type and role, not by amount.'),
      cap('Audit trails', 'live', 'Each system keeps its own audit log, and the platform console shows activity across them. One audit view for a company is planned.'),
      cap('Risk management', 'planned'),
      cap('Policy management', 'planned'),
      cap('Regulatory records', 'planned'),
      cap('Document retention', 'planned', 'Deleted Finance documents are kept for the audit trail. Retention rules are planned.'),
      cap('Data security', 'live', 'Every query is limited to the person\'s company or organisation, records of others answer as not found, unsafe requests need a CSRF token, and downloads are sandboxed.'),
      cap('Access reviews', 'in-development', 'The access review of the Company Admin console (on screen and as CSV) is built behind a flag that ships off. People and roles are listed per company and in the platform console. Scheduled reviews are planned.'),
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
      cap('APIs', 'live', 'Each system\'s API, used with the session or a personal API token limited to one company (optionally some applications, or reading only) that expires. A published API reference is planned.'),
      cap('Webhooks', 'live', 'Signed outgoing webhooks from Projects, and messages to Slack and Microsoft Teams. Not yet from the CRM, Finance or the ERP.'),
      cap('Event processing', 'planned', 'An event outbox for reactions between modules.'),
      cap('Document exchange', 'live', 'Secure online links for quotes, invoices and credit notes; customers accept quotes online. E-invoicing is planned.'),
      cap('Electronic data interchange (EDI)', 'planned'),
      cap('External connections', 'live', 'Email through the platform\'s email provider, Slack and Microsoft Teams, and AI apps through CAD Automation. No bank, payment, carrier or mailbox connections.'),
      cap('Identity and access management', 'live', 'One BIZOMAT account and session for every system in the ERP, with email confirmation and personal API tokens.'),
      cap('Sign in with BIZOMAT for CAD Automation', 'live', 'CAD Automation takes the same BIZOMAT account: Continue with BIZOMAT.'),
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
