# BIZOMAT ERP: the 97-module catalogue

Generated from `apps/work/src/shared/erp-catalogue.ts` by `npx tsx scripts/erp/modules-doc.ts`; do not edit by hand
(`apps/work/test-node/erp-modules-doc.test.ts` fails when this file is out of step). The same catalogue is the ERP's
All modules page (`/erp/c/<company>/modules`) and its API (`GET /api/erp/c/<company>/catalogue`).

Totals: 97 modules; 45 live, 9 live and extended, 33 new, 8 partly built, 2 planned.

Statuses: Live (built, tested and live before 20 Nov 2026), Live, extended (extended on 20 Nov 2026), New (built on
20 Nov 2026 on the modules framework, `apps/work/src/shared/erp-objects`), Partly built (what is missing is named),
Planned (not built). Implemented 20 Nov 2026 for New and extended modules; production test status is in
`docs/erp/STATUS.md`.

## A. ERP core and platform

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Enterprise and organisation management | Live, extended | `/erp/c/{co}/m/organisation` | Registered companies with departments in a tree; now legal entities and subsidiaries with country, currency, fiscal year, time zone and language, business units, locations and exchange rates. Records: legal entities, business units, locations, exchange rates. | Intercompany transactions are not built. |  | test/erp-modules.test.ts |
| 2 | User and account management | Live | `/company/` | Company members, invitations, suspension and reactivation, removal, ownership transfer, profiles, the Company Admin console (switch off by default). |  |  | test/members.test.ts, test/company.test.ts |
| 3 | Roles and permissions | Live, extended | `/erp/c/{co}/erp-roles` | Company roles, roles in each tool, ERP roles with a capability matrix, segregation of duties; 12 roles added for the new modules (HR, payroll, projects, service, fleet, contracts, marketing, finance control, operations, compliance). |  |  | test/erp.test.ts, test/erp-modules.test.ts |
| 4 | Authentication and identity | Partly built |  | Password sign-in with lockout, Google sign-in, sessions with CSRF protection, two-factor sign-in for platform administrators, BIZOMAT as the sign-in provider of CAD Automation. | Two-factor sign-in for every person, SAML or enterprise single sign-on; the forgotten-password link is behind a switch that is off. |  | test/auth.test.ts, test/security.test.ts |
| 5 | Audit trail and compliance | Live |  | Append-only audit logs in every tool, the ERP history with before and after values, company activity, personal and company exports. |  |  | test/erp.test.ts, test/compliance.test.ts |
| 6 | Workflow and business process automation | Live, extended | `/erp/c/{co}/m/workflow` | Automations in Projects and the CRM; approvals with segregation of duties in every ERP module; now workflow rules that notify and escalate on any new module’s status, and one approval inbox. Records: workflow rules. | No drag-and-drop workflow designer; rules notify and escalate but do not change records. |  | test/erp-modules.test.ts |
| 7 | Notifications and communication | Live, extended |  | In-app and email notifications in Projects, the CRM, Finance and WHS; now ERP alerts for approvals, assignments, due dates and workflow rules in the new modules. | No chat or SMS. |  | test/notifications.test.ts, test/erp-modules.test.ts |
| 8 | Document and file management | Live, extended | `/erp/c/{co}/m/documents` | Projects documents with versions and comments, files on every record; now controlled documents with versions, approval by someone else, review reminders and retention dates. Records: controlled documents. | No document templates that fill in record data. |  | test/documents.test.ts, test/erp-modules.test.ts |
| 9 | Global search and navigation | Live, extended | `/erp/c/{co}/modules` | Search in Projects and in the CRM; now one search across the new modules’ records and the ERP’s products, suppliers and orders, the All modules page with its search, favourites and recently used. | Finance and the CRM keep their own searches. |  | test/erp-modules.test.ts |
| 10 | ERP configuration, reporting and analytics | Live, extended | `/erp/reports` | The Reports hub, dashboards, CRM custom fields, ERP and module settings, CSV exports; now reports and CSV import and export for every new module, and Product Management’s sales and margin analysis by product, category, family, customer, salesperson, warehouse and month, with drill-down, comparison periods, saved views and stock against sales. | Custom fields only in the CRM; no report designer; no budgets or forecasts beside the analysis. |  | test/erp-modules.test.ts |

## B. Finance and accounting

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 11 | General ledger and accounting | Live | `/finance/` | Chart of accounts, journals that must balance, posted journals locked, trial balance, profit and loss, balance sheet, cash flow, general ledger report. | One lock date per workspace rather than financial periods; no year-end closing journal. |  | test/fin-ledger.test.ts |
| 12 | Accounts payable | Live | `/finance/` | Supplier bills with approval and payments recorded; purchase orders and goods receipts to draft bills. | No payment files for the bank. | 11 | test/fin-sales.test.ts, test/erp-r2.test.ts |
| 13 | Accounts receivable | Live | `/finance/` | Invoices, payments, credit notes with refunds, aged receivables, overdue reminders to the team. | No customer statements or automatic reminders to customers. | 11 | test/fin-sales.test.ts |
| 14 | Cash management | Partly built | `/finance/` | Cash and debt on the dashboard, a 4 to 26 week cash forecast from open documents and recurring items. | Saved forecasts and scenarios. | 11, 15 | test/fin-ledger.test.ts |
| 15 | Bank management and reconciliation | Live | `/finance/` | Bank accounts, statement import (CSV, OFX, QIF) with duplicate checks, suggested matches, reconciliation records. | No live bank feeds. |  | test/fin-banking.test.ts |
| 16 | Budgeting and financial planning | Live | `/finance/` | Budgets by account and month (up to 36), by department, project or cost centre, from last year’s actuals, budget against actual, alerts. | Budget versions, scenarios and approval. |  | test/fin-ledger.test.ts |
| 17 | Expense management | Live | `/finance/` | Expense claims with receipts, approval and reimbursement recorded. | Policy limits, mileage, receipt reading. |  | test/fin-sales.test.ts |
| 18 | Fixed asset management | New | `/erp/c/{co}/m/fixed_assets` | Asset register, straight-line and diminishing-value depreciation, schedules, book values, disposals with gain or loss, placing in service approved by someone else. Records: fixed assets. | Depreciation is not posted to Finance’s ledger yet. | 11 | test/erp-modules.test.ts |
| 19 | Tax management | Partly built | `/finance/` | Tax codes, Australian GST, BAS worksheet on a cash or accrual basis; regional settings per legal entity. | Tax rules of other countries, lodgement, withholding tax. | 11 | test/fin-ledger.test.ts |
| 20 | Cost accounting and cost centres | Partly built | `/finance/` | Departments, projects and cost centres on every Finance line and report; manufacturing job costing; project costs from timesheets; cost centres as business units. | Overhead allocation rules. | 11 | test/fin-ledger.test.ts, test/erp-r3.test.ts |
| 21 | Financial consolidation and multi-company accounting | Planned | `/erp/c/{co}/m/organisation` | Legal entities with ownership, currencies and exchange rates are recorded (Organisation structure). | Consolidating ledgers, eliminations and intercompany transactions are not built; each Finance workspace keeps one currency. | 1, 11 |  |
| 22 | Revenue recognition and financial reporting | New | `/erp/c/{co}/m/revenue` | Revenue schedules spread by month with earned and deferred amounts; Finance’s reports for financial reporting. Records: revenue schedules. | Not posted to Finance’s ledger yet; straight line only. | 11, 29, 34 | test/erp-modules.test.ts |

## C. Sales, CRM and customers

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 23 | Customer relationship management | Live | `/crm/` | Contacts and companies, activities, notes, files, tags, custom fields, automations, insights and reports. |  |  | test/crm-records.test.ts |
| 24 | Marketing management | New | `/erp/c/{co}/m/marketing` | Campaigns with budget approval, spend, results, cost per lead and return. Records: campaigns. | Email sending, lists and segments; results are entered, not counted from the CRM. | 23 | test/erp-modules.test.ts |
| 25 | Lead management | Live | `/crm/` | Leads with scoring and conversion to contact, company and deal. |  |  | test/crm-records.test.ts |
| 26 | Opportunity and pipeline management | Live | `/crm/` | Pipelines and stages, deals on a board, stage history, deal items. |  |  | test/crm-records.test.ts |
| 27 | Quotation and proposal management | Live | `/finance/` | Quotes with versions, online acceptance, part invoicing, made from a CRM deal. |  |  | test/fin-sales.test.ts, test/company-links.test.ts |
| 28 | Sales order management | Live | `/erp/c/{co}/supply-chain` | Sales orders for the one customer record, amendments, allocation, make to order, from a won deal. |  |  | test/erp-r5-supply-chain.test.ts |
| 29 | Contract and agreement management | New | `/erp/c/{co}/m/contracts` | Customer contracts with review, approval by someone else, signing recorded, notice-date reminders. Records: contracts. | No electronic signature. | 23 | test/erp-modules.test.ts |
| 30 | Pricing, discounts and promotions | New | `/erp/c/{co}/m/pricing` | Approved price lists by customer, group and quantity; promotions; a price check; line and document discounts in Finance. Records: price lists, promotions. | Sales orders are not repriced from price lists yet. | 28, 45 | test/erp-modules.test.ts |
| 31 | Sales commission management | New | `/erp/c/{co}/m/commissions` | Plans by salesperson and statements worked out from won CRM deals, approved by someone else. Records: commission statements, commission plans. | Not paid through payroll yet. | 26 | test/erp-modules.test.ts |
| 32 | Customer service and support | New | `/erp/c/{co}/m/service` | Tickets with priority, response targets, assignment, resolution and reminders. Records: service tickets, field service jobs, service agreements. | No customer portal or shared inbox. | 23 | test/erp-modules.test.ts |
| 33 | Returns, refunds and RMA management | Live | `/erp/c/{co}/supply-chain` | Returns authorised, received into stock or quarantine, draft credit notes, refunds in Finance. |  |  | test/erp-r5-supply-chain.test.ts |
| 34 | Subscription and recurring revenue management | New | `/erp/c/{co}/m/subscriptions` | Subscriptions by customer and plan, draft invoices each period, monthly recurring revenue; recurring invoices in Finance. Records: subscriptions. | No card payments. | 13, 23 | test/erp-modules.test.ts |

## D. Procurement and suppliers

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 35 | Supplier and vendor management | Live | `/erp/c/{co}/procurement` | Supplier master with approval, hold and block, ABN format check, contacts, documents, link to Finance. |  |  | test/erp.test.ts |
| 36 | Strategic sourcing and RFQ | Live | `/erp/c/{co}/procurement/rfqs` | Requests for quotation, quotations compared, selection approved. |  |  | test/erp-r2.test.ts |
| 37 | Purchase requisition management | Live | `/erp/c/{co}/procurement/requisitions` | Requisitions approved by a procurement manager who did not raise them. |  |  | test/erp-r2.test.ts |
| 38 | Procurement and purchasing management | Live | `/erp/c/{co}/procurement` | The purchasing cycle from requisition to receipt, approval limits, reports. |  |  | test/erp-r2.test.ts |
| 39 | Purchase order management | Live | `/erp/c/{co}/procurement/purchase-orders` | Purchase orders with approval limits, amendments, PDF, receipts. | Emailing the PDF from BIZOMAT. |  | test/erp-r2.test.ts |
| 40 | Supplier contract management | New | `/erp/c/{co}/m/contracts` | Supplier contracts in Contracts: review, approval, signing recorded and renewal reminders. Records: contracts. |  | 35 | test/erp-modules.test.ts |
| 41 | Supplier portal | Planned |  | Suppliers are managed by staff. | A portal needs sign-in for suppliers’ own people, which is not built. | 35, 39 |  |
| 42 | Supplier performance and evaluation | Live | `/erp/c/{co}/procurement` | On time, in full, lead time, refused quantities and quality defects per supplier. |  |  | test/erp-r2.test.ts, test/erp-r4-quality.test.ts |
| 43 | Import, export and trade compliance | New | `/erp/c/{co}/m/trade` | Declarations with tariff codes, origin, incoterms, customs value, permits and clearance. Records: import and export declarations. | Nothing is lodged with customs. | 39, 28 | test/erp-modules.test.ts |
| 44 | Invoice matching and procurement reconciliation | New | `/erp/c/{co}/m/matching` | Three-way matching of supplier invoices with order and receipts, within a tolerance, variances approved by someone else. Records: invoice matching. |  | 39, 48, 12 | test/erp-modules.test.ts |

## E. Inventory and warehouse

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45 | Inventory management | Live | `/erp/c/{co}/inventory` | Stock by product, location, lot and serial; the append-only ledger; reservations; valuation by weighted average or FIFO. |  |  | test/erp-r2.test.ts |
| 46 | Warehouse management | Live | `/erp/c/{co}/inventory` | Warehouses and a location tree, transfers, quarantine. |  |  | test/erp-r2.test.ts |
| 47 | Warehouse management system (WMS) | Live | `/erp/c/{co}/inventory` | The warehouse screen for phones, QR labels, scanning, receive, issue, move and count. |  |  | test/erp-r2.test.ts |
| 48 | Goods receiving and inbound processing | Live | `/erp/c/{co}/procurement/receipts` | Partial receipts, damage and refusals, lots, serials and expiry, inspection on receipt. |  |  | test/erp-r2.test.ts |
| 49 | Putaway and warehouse location management | Partly built | `/erp/c/{co}/inventory` | Locations by store, zone, rack, shelf and bin; moves between them. | Suggested putaway locations. |  | test/erp-r2.test.ts |
| 50 | Picking, packing and fulfilment | Live | `/erp/c/{co}/supply-chain` | Pick lists by soonest expiry, packages, dispatch once. |  |  | test/erp-r5-supply-chain.test.ts |
| 51 | Shipping and dispatch | Live | `/erp/c/{co}/supply-chain` | Shipments, carriers with tracking, dispatch, proof of delivery, delivery schedule. | Bookings in carriers’ systems. |  | test/erp-r5-supply-chain.test.ts |
| 52 | Batch, lot and serial tracking | Live | `/erp/c/{co}/inventory` | Lots and serials from receipt to delivery, expiry, traceability with inspections and NCRs. |  |  | test/erp-r2.test.ts, test/erp-r5-supply-chain.test.ts |
| 53 | Inventory replenishment and stock planning | Partly built | `/erp/c/{co}/manufacturing` | Reorder points, minimums, safety stock, shortages report, MRP buy suggestions to requisitions. | Automatic replenishment orders and transfers between sites. | 45, 57 | test/erp-r3.test.ts |
| 54 | Stocktake, cycle counting and adjustment | Live | `/erp/c/{co}/inventory` | Stocktakes and cycle counts approved by someone else, adjustments with approval thresholds. |  |  | test/erp-r2.test.ts |

## F. Manufacturing and production

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 55 | Bill of materials management | Live | `/erp/c/{co}/products` | Multi-level bills, loops refused, explosion, where-used, comparison, cost roll-up. |  |  | test/erp.test.ts |
| 56 | Routing and manufacturing process management | Live | `/erp/c/{co}/manufacturing` | Routings with revisions released by someone else, operations, work centres and machines. |  |  | test/erp-r3.test.ts |
| 57 | Material requirements planning (MRP) | Live | `/erp/c/{co}/manufacturing` | MRP level by level with lead times, stock, reservations and sales demand; suggestions to orders. |  |  | test/erp-r3.test.ts |
| 58 | Production planning and scheduling | Live | `/erp/c/{co}/manufacturing` | Master production schedule, scheduled operations with predecessors. | Finite scheduling and a planning board. |  | test/erp-r3.test.ts |
| 59 | Shop floor management | Live | `/erp/c/{co}/manufacturing` | A phone screen per work centre: jobs, timers, output, scrap, downtime and inspections. |  |  | test/erp-r3.test.ts |
| 60 | Production order management | Live | `/erp/c/{co}/manufacturing` | Manufacturing orders from release to close, materials through stock, finished goods at actual cost. |  |  | test/erp-r3.test.ts |
| 61 | Capacity planning | Live | `/erp/c/{co}/manufacturing` | Rough-cut capacity by work centre and week. |  |  | test/erp-r3.test.ts |
| 62 | Subcontracting and outsourced manufacturing | New | `/erp/c/{co}/m/subcontracting` | Subcontract orders with the manufacturing order, materials sent, what comes back and its cost; outsourced operations on routings. Records: subcontract orders. | Stock moves to and from the subcontractor are made in Inventory. | 60, 35 | test/erp-modules.test.ts |
| 63 | Product configuration and variant management | Partly built | `/erp/c/{co}/products` | Product variants by size, model, configuration, material, finish and options. | Configure-to-order rules. |  | test/erp.test.ts |
| 64 | Manufacturing execution system (MES) | Partly built | `/erp/c/{co}/manufacturing` | The shop floor screen records labour, machine time, output, scrap, rework and downtime. | Machine data collection and OEE. |  | test/erp-r3.test.ts |
| 65 | Manufacturing costing and production performance | Live | `/erp/c/{co}/manufacturing` | Estimated against actual cost by element, variances, job profitability, eight reports. |  |  | test/erp-r3.test.ts |

## G. Quality, engineering and maintenance

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 66 | Quality management system (QMS) | Live | `/erp/c/{co}/quality` | Inspection plans, inspections, quarantine, NCRs, corrective actions, reports. | Statistical process control and quality audits. |  | test/erp-r4-quality.test.ts |
| 67 | Quality inspection and testing | Live | `/erp/c/{co}/quality` | Readings checked against limits on the server, results, photos. |  |  | test/erp-r4-quality.test.ts |
| 68 | Non-conformance, CAPA and corrective actions | Live | `/erp/c/{co}/quality` | NCRs with containment, root cause, disposition; corrective and preventive actions with segregation of duties. |  |  | test/erp-r4-quality.test.ts |
| 69 | Engineering change management (ECR and ECO) | Live | `/erp/c/{co}/products` | Change requests and change orders approved and released by someone else. |  |  | test/erp.test.ts |
| 70 | Product lifecycle management (PLM) | Live | `/erp/c/{co}/products` | Lifecycle stages with effective dates, revisions, change control, engineering documents. |  |  | test/erp.test.ts |
| 71 | Engineering and CAD integration | Live | `/erp/c/{co}/cad` | CAD Automation set-up and computers in Products and Engineering; CAD inside the ERP behind its switch (off). |  |  | test/cad.test.ts |
| 72 | Maintenance management | Live | `/erp/c/{co}/maintenance` | Requests, work orders, preventive maintenance, inspections, prestarts, parts from stock; the field release adds list filters and CSV, the asset summary and duplicate warnings, request withdrawal, required parts by product with reservations and requisitions, stocktakes of the stores, inspection rounds over many assets, the Readings page, the job card, sign-off and in-app alerts. | Email copies of alerts are built but switched off; offline field work, technician workload planning and the AI scheduling assistant are planned. |  | test/maintenance.test.ts, test/maintenance-m2-m3.test.ts, test/maintenance-A.test.ts, test/maintenance-B.test.ts, test/maintenance-C.test.ts, test/maintenance-D.test.ts |
| 73 | Enterprise asset management (EAM) | Live | `/erp/c/{co}/maintenance` | Asset register and hierarchy, meters, sites, reliability reports. |  |  | test/maintenance-m2-m3.test.ts |
| 74 | Calibration and measurement equipment | New | `/erp/c/{co}/m/calibration` | Instruments with intervals, calibrations checked against tolerance on the server, due reminders, out of service on a fail. Records: measuring instruments, calibrations. |  | 66, 73 | test/erp-modules.test.ts |
| 75 | Environment, health and safety (EHS) | Live, extended | `/erp/c/{co}/m/environment` | BIZOMAT WHS (hazards, risk assessments, incidents, investigations, actions); now environmental aspects and energy, water, waste and emissions records. Records: environmental aspects, energy, water, waste and emissions. | WHS inspections, permits and training records; emissions factors. |  | test/whs-core.test.ts, test/erp-modules.test.ts |

## H. Logistics, projects and services

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 76 | Transportation management (TMS) | New | `/erp/c/{co}/m/transport` | Delivery runs with vehicle, driver and stops linked to shipments; carriers and shipments in Supply chain. Records: transport runs. | Route optimisation and carrier bookings. | 51, 77 | test/erp-modules.test.ts |
| 77 | Fleet management | New | `/erp/c/{co}/m/fleet` | Vehicles, fuel with consumption, trip logbook, registration and insurance reminders, maintenance assets. Records: vehicles, fuel, trips (logbook). |  | 72 | test/erp-modules.test.ts |
| 78 | Project management | Live | `/tasks/` | Workspaces, boards, timelines with dependencies, milestones, goals, dashboards, documents, automations. |  |  | test/boards.test.ts, test/schedule-engine.test.ts |
| 79 | Project accounting and cost control | Live, extended | `/erp/c/{co}/m/timesheets` | Project budgets, cost entries and earned value in Projects; now project hours and costs from approved timesheets, and draft invoices for billable hours. Records: timesheets. |  | 78, 82 | test/project-controls.test.ts, test/erp-modules.test.ts |
| 80 | Field service management | New | `/erp/c/{co}/m/service` | Field jobs scheduled, dispatched, started and completed on a phone, then invoiced as drafts. Records: service tickets, field service jobs, service agreements. |  | 32, 81 | test/erp-modules.test.ts |
| 81 | Service management and service contracts | New | `/erp/c/{co}/m/service` | Service agreements with response times, visits, value and end-date reminders. Records: service tickets, field service jobs, service agreements. |  | 29 | test/erp-modules.test.ts |
| 82 | Timesheet and time tracking | New | `/erp/c/{co}/m/timesheets` | Weekly timesheets by project, approved by the person’s manager, used by payroll and project costs; timers in Projects. Records: timesheets. |  | 78, 85 | test/erp-modules.test.ts |
| 83 | Resource planning and allocation | New | `/erp/c/{co}/m/resources` | Allocations by project and week with utilisation and over-allocation; the workload view in Projects. Records: resource allocations. |  | 78, 85 | test/erp-modules.test.ts |
| 84 | Dispatch and scheduling | New | `/erp/c/{co}/m/service/dispatch` | A dispatch board of field jobs by technician and day. Records: service tickets, field service jobs, service agreements. |  | 80 | test/erp-modules.test.ts |

## I. Human resources and people

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 85 | Human resource management (HRM) | New | `/erp/c/{co}/m/hr` | Employee records with manager, department and location, leave with approval and balances, attendance, self service. Records: employees, leave requests, attendance, leave types. |  | 1, 2 | test/erp-modules.test.ts |
| 86 | Recruitment and applicant tracking | New | `/erp/c/{co}/m/recruitment` | Job openings approved before opening, applicants through the stages, hiring into an employee record. Records: job openings, applicants. | No public careers page. | 85 | test/erp-modules.test.ts |
| 87 | Employee onboarding and offboarding | New | `/erp/c/{co}/m/onboarding` | Checklists from templates with who and when; made on hiring and on leaving. Records: onboarding and offboarding, checklist templates. |  | 85 | test/erp-modules.test.ts |
| 88 | Learning and training management | New | `/erp/c/{co}/m/training` | Courses, training records, results and expiry reminders. Records: training records, courses. | No online course delivery. | 85 | test/erp-modules.test.ts |
| 89 | Performance and talent management | New | `/erp/c/{co}/m/performance` | Reviews with weighted objectives, self assessment, reviewer’s completion, acknowledgement; goals. Records: performance reviews, goals. |  | 85 | test/erp-modules.test.ts |
| 90 | Payroll and compensation management | New | `/erp/c/{co}/m/payroll` | Pay runs from salaries and approved timesheets, withholding and contribution rates you set, approval by someone else, payslips in self service. Records: pay runs. | Not certified payroll: no statutory tax tables, payment files or reporting to tax authorities; not posted to Finance. | 85, 82 | test/erp-modules.test.ts |

## J. Industry solutions

| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 91 | Retail ERP | New | `/erp/c/{co}/m/retail` | Stores with their stock, daily takings reconciled by someone else; promotions in Pricing. Records: stores, daily takings. | Not a point-of-sale terminal. | 30, 45 | test/erp-modules.test.ts |
| 92 | Wholesale and distribution ERP | New | `/erp/c/{co}/m/wholesale` | Trade accounts with tiers, discounts, price lists and credit limits; distribution through Supply chain. Records: trade accounts. |  | 28, 30 | test/erp-modules.test.ts |
| 93 | Construction and engineering ERP | New | `/erp/c/{co}/m/construction` | Estimates, variations, progress claims with retention, certified and invoiced as drafts. Records: estimates, progress claims, variations. |  | 29, 78 | test/erp-modules.test.ts |
| 94 | Professional services ERP | New | `/erp/c/{co}/m/professional` | Client engagements by fee, time or retainer with hours from approved timesheets. Records: client engagements. |  | 82, 34 | test/erp-modules.test.ts |
| 95 | Healthcare ERP | New | `/erp/c/{co}/m/healthcare` | Facilities with accreditation, staff credentials with expiry reminders; procurement, assets and workforce through the core modules. Records: facilities, staff credentials. | Administration only: no clinical or patient records. | 85, 72 | test/erp-modules.test.ts |
| 96 | Public sector and nonprofit ERP | New | `/erp/c/{co}/m/public_sector` | Grants and restricted funds with budgets, spending, reporting dates and acquittal. Records: grants and funds. |  | 16 | test/erp-modules.test.ts |
| 97 | Energy, mining and agriculture ERP | New | `/erp/c/{co}/m/natural_resources` | Sites and permits, production by day, shift and commodity; equipment through Maintenance. Records: sites and fields, production. |  | 72 | test/erp-modules.test.ts |
