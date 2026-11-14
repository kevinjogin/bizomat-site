# 13. Enterprise capability matrix

Status: read from the code and docs on 14 Nov 2026. This is the full matrix behind `src/data/erp-capabilities.ts`, the
public source of BIZOMAT ERP's functional coverage. The rows here match that file name for name, in the same order.
Phases are defined in `15-erp-roadmap-2026.md`; the links between systems in `14-application-integration-map.md`.

The sixteen domains follow the way the large ERP suites publicly group their functions (SAP S/4HANA and SAP Cloud ERP,
Epicor Kinetic, Microsoft Dynamics 365, Oracle Fusion Cloud, Infor CloudSuite, IFS Cloud). Only the grouping is
borrowed. No text is copied, and BIZOMAT does not claim parity with any of them. Asset management and maintenance uses
MEX (a maintenance management product) as a functional reference only: no branding, design or text is taken from it.

## 1. How to read the matrix

### 1.1 Statuses

Every feature carries exactly one status.

| Status | Meaning | Rule |
| --- | --- | --- |
| live | Works today in one BIZOMAT system | Found in the code and covered by its tests |
| connected | Works today by linking two BIZOMAT systems | Linked through shared company or organisation ids and the owners' own services; no record is copied |
| in-development | Being built, not switched on for everyone | Code exists or is being written; a named step is missing (a merge, a secret, its tests) |
| planned | Designed, not built | Everything that cannot be found in the code |

Finance never connects to banks, processes payments, lodges with the ATO or runs payroll. Those features are planned
and stay planned until an approved design and provider exist.

### 1.2 Columns

| Column | Meaning |
| --- | --- |
| Served by today | Where a person uses it now. A dash means nowhere. |
| Owner | The module or system that owns the feature (today or when built). |
| Data owner | The authoritative table. "(new)" marks a table proposed in `04-master-data-ownership.md` and `05-entity-relationship-design.md`, not created. Other systems keep references, never copies. |
| Depends on | What must exist first. |
| Phase | S0 means it exists today. S1 to S13, M1 to M4 and the tracks F, I and P are in `15-erp-roadmap-2026.md`. ".2" is a second release of that stage. |
| Tests | Existing test files for live and connected rows; the test requirements below for the rest. |

### 1.3 Test requirements (codes used in the Tests column)

Existing test files are in `apps/work/test/` (Vitest, run on the Workers runtime and on Node), `apps/work/e2e/`
(Playwright), `apps/cad/tests/` (pytest) and `tests/` (website). The codes below add to them; every new stage also
runs the regression suites unchanged (T-REG).

| Code | Requirement |
| --- | --- |
| T-ISO | Isolation: a member of company A gets 404 for every record of company B, through every route, search and export. |
| T-PERM | Permissions: each role and module level allows exactly its actions, on the server; nobody approves their own request. |
| T-OWN | Ownership: no copy of another system's record; writes go through the owner's service (a test searches ERP code for other modules' tables). |
| T-DUP | No duplicates: idempotent creates; a link or document made from a record is made once. |
| T-QTY | Quantities: guarded updates; nothing is received, issued, delivered or invoiced twice. |
| T-LED | Ledger: every journal ERP causes balances, respects the lock date, carries its origin, and the trial balance balances after a full journey. |
| T-E2E | A browser journey on desktop and phone. |
| T-REG | The existing suites pass unchanged on both runtimes. |
| T-HON | Honest status: the registry and screen labels match the code; nothing planned is shown as working; Finance never claims bank, payment, lodgement or payroll. |
| T-CAD | CAD Automation's own suites (simulated SOLIDWORKS, the Companion link) and its field checklist on Windows. |
| T-AI | AI proposes only: preview, explanation, manual edit, accept or reject by a person, history kept. |
| T-OFF | Offline: queue, reconnection, conflict resolution and audit, tested before anything is called offline. |
| T-MIG | Additive migration; the previous image runs with the new tables in place. |

## 2. Summary

| # | Domain | Live | Connected | In development | Planned | Total |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Enterprise management | 11 | 1 | 0 | 6 | 18 |
| 2 | Finance and controlling | 13 | 0 | 0 | 6 | 19 |
| 3 | Sales and distribution | 7 | 3 | 0 | 9 | 19 |
| 4 | Sourcing and procurement | 4 | 0 | 0 | 9 | 13 |
| 5 | Product lifecycle and engineering | 5 | 0 | 1 | 14 | 20 |
| 6 | Manufacturing | 0 | 0 | 0 | 20 | 20 |
| 7 | Inventory and warehousing | 0 | 0 | 0 | 17 | 17 |
| 8 | Supply chain and logistics | 0 | 0 | 0 | 12 | 12 |
| 9 | Quality management | 0 | 0 | 0 | 13 | 13 |
| 10 | Asset management and maintenance | 0 | 0 | 10 | 25 | 35 |
| 11 | Project and portfolio management | 9 | 4 | 0 | 3 | 16 |
| 12 | Service management | 0 | 0 | 0 | 10 | 10 |
| 13 | Human capital management | 1 | 0 | 0 | 11 | 12 |
| 14 | Governance and compliance | 3 | 0 | 0 | 7 | 10 |
| 15 | Enterprise analytics and AI | 4 | 2 | 0 | 7 | 13 |
| 16 | Enterprise integration platform | 7 | 0 | 1 | 4 | 12 |
| | **All domains** | **64** | **10** | **12** | **173** | **259** |

What this says in plain words: the commercial and financial core (customers, quotes, invoicing, the ledger, projects)
and the company structure work today, joined by ten links. CAD Automation works for engineers in SOLIDWORKS. Two
connections to CAD Automation and the first stage of maintenance management are being built. Operations (procurement
beyond Finance's documents, inventory, manufacturing, quality, supply chain, service) and human resources are planned.

## 3. Matrix by domain

### 3.1 Enterprise management

Served by BIZOMAT ERP (Administration) and Company accounts.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BIZOMAT ERP workspace | live | `/erp`, module rail on every screen | ERP shell | none (reads each tool) | Company accounts, each tool's API | S0 | `mount.test.ts`, `system.test.ts`, smoke test |
| Multiple companies | live | ERP company switcher, Company accounts | Company | `co_companies`, `co_members` | - | S0 | `company.test.ts`, `system.test.ts` |
| Own company for every person | live | ERP | ERP shell | `sys_companies` | - | S0 | `system.test.ts` |
| Company registration with checks | live | `/company/new` | Company | `co_companies` (checks stored with it) | Register lookup needs `ABR_GUID` (owner) | S0 | `company.test.ts` |
| Subsidiaries | planned | - | Company (Core) | parent link on `co_companies` (new) | Legal entities | S2.2 | T-ISO, T-PERM, T-MIG |
| Legal entities | planned | - | Company (Core) | `co_legal_entities` (new) | - | S2 | T-ISO, T-PERM, T-MIG |
| Sites and branches | planned | - | Company (Core) | `co_sites`, `co_site_access` (new) | - | S2 | T-ISO, T-PERM, T-MIG |
| Departments | live | Company accounts | Company | `co_departments`, `co_department_members` | - | S0 | `company.test.ts` |
| Departments in every tool | connected | Projects and CRM teams, Finance tracking | Company (`sync.ts`, `departments.ts`) | `co_departments`; each tool's team or tracking row is kept in step | The tool belongs to the company (`co_tools`) | S0 | `company.test.ts` |
| Cost centres | live | Finance tracking | Finance | `fin_tracking` (kind `cost_centre`) | - | S0; shared across systems in S2 | `fin-*.test.ts` |
| Intercompany transactions | planned | - | Finance | journals per legal entity | Legal entities, multi-currency | F5 | T-LED, T-ISO |
| Multi-currency | planned | - | Finance, CRM | `fin_orgs`, `fin_journals` | Finance brief Stage 4 | F4 | T-LED |
| Localisation | live | Company checks, Finance tax codes | Company, Finance | `co_companies.country`, `fin_tax_codes` | - | S0; other countries by owner decision | `company.test.ts`, `fin-*.test.ts` |
| Business policies | planned | Finance approval settings and period lock, inside Finance | Company (Core) | company settings (new) | Approval engine | S2 | T-PERM |
| User and role management | live | Company People, each tool's team pages | Company and each tool | `users`, `co_members`, each tool's members table | - | S0; module access and role templates in S2 | `company.test.ts`, `crm-orgs.test.ts`, `fin-access.test.ts`, `settings-permissions.test.ts` |
| Invitations with tool roles and departments | live | Company accounts | Company | `co_invitations` | - | S0 | `company.test.ts` |
| Tools grouped by company | live | ERP dashboard | ERP shell | none: worked out from `co_tools` and each tool's members | - | S0 | `system.test.ts` |
| Platform console | live | `/erp/admin` | ERP shell | reads `users`, `co_*`, `sys_*` and the audit tables | - | S0 | `system.test.ts` |

### 3.2 Finance and controlling

Served by BIZOMAT Finance. Finance owns every posted figure; other systems read it or post through its services.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| General ledger | live | Finance | Finance | `fin_journals`, `fin_journal_lines` (six triggers) | - | S0 | `fin-*.test.ts`, `to-cloudflare.test.ts` |
| Chart of accounts and tax codes | live | Finance | Finance | `fin_accounts`, `fin_tax_codes` | - | S0 | `fin-*.test.ts` |
| Accounts payable | live | Finance bills | Finance | `fin_docs` (bill, purchase order), `fin_payments` | - | S0 | `fin-*.test.ts`, T-HON |
| Accounts receivable | live | Finance invoices, credit notes | Finance | `fin_docs` (invoice), `fin_credit_notes`, `fin_payments` | - | S0 | `fin-*.test.ts`, T-HON |
| Expense claims | live | Finance | Finance | `fin_docs` (expense claim) | - | S0 | `fin-*.test.ts` |
| Asset accounting | planned | - | Finance | fixed asset register (new), linked to `erp_assets` | Finance brief Stage 3; CMMS asset register for the link | F3 | T-LED |
| Cash management | live | Finance banking | Finance | `fin_transactions`, `fin_statement_*`, `fin_reconciliations`, `fin_rules` | - | S0 | `fin-banking.test.ts` |
| Bank feeds | planned | - | Finance | `fin_statement_lines` | An approved provider (owner decision, security review) | F3 | T-HON |
| Treasury | planned | - | Finance | - | Bank feeds; owner decision | F5 | T-HON |
| Financial consolidation | planned | - | Finance | reads each legal entity's journals | Legal entities, multi-currency | F5 | T-LED |
| Management accounting | live | Finance reports with tracking filters | Finance | `fin_tracking`, `fin_journal_lines` | - | S0 | `fin-*.test.ts` |
| Cost accounting | planned | - | Finance with ERP | tracked journal lines; ERP cost rates | Product and production costing | F5 (after S8) | T-LED |
| Profitability analysis | live | Profit and loss by tracking category | Finance | `fin_journal_lines` | By product or customer needs S3 and S4 | S0; by product and customer F5 | `fin-*.test.ts` |
| Budgets | live | Finance budgets | Finance | `fin_budgets`, `fin_budget_lines` | - | S0 | `fin-*.test.ts` |
| Forecasts | live | Cash flow forecast | Finance | worked out from documents and recurring records | - | S0; planning scenarios F5 | `fin-*.test.ts` |
| Tax and regulatory reporting | live | GST and BAS worksheet | Finance | worked out from journals and `fin_tax_codes` | - | S0 | `fin-*.test.ts`, T-HON (no lodgement) |
| BAS module with lodged-period snapshots | planned | - | Finance | new Finance tables | Finance brief Stage 2 | F2 | T-LED, T-HON |
| Financial statements and reports | live | 12 Finance reports | Finance | worked out from posted journals | - | S0 | `fin-*.test.ts` |
| Period lock and audit trail | live | Finance | Finance | `fin_orgs` lock date, triggers, `fin_audit_log` | - | S0 | `fin-*.test.ts` |

### 3.3 Sales and distribution

Served by BIZOMAT CRM and BIZOMAT Finance; sales orders, deliveries and returns in BIZOMAT ERP (planned module).

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Customer relationship management (CRM) | live | CRM | CRM | `crm_*` | - | S0 | `crm-orgs.test.ts`, `crm-records.test.ts`, `crm.spec.ts` |
| Leads | live | CRM | CRM | `crm_leads` | - | S0 | `crm-records.test.ts` |
| Opportunities | live | CRM | CRM | `crm_deals`, `crm_pipelines`, `crm_stages` | - | S0 | `crm-records.test.ts` |
| One customer record across CRM and Finance | connected | CRM company "In Finance"; Finance "From the CRM" | Company links | `co_customer_links` (CRM company to Finance contact) | Both tools in one company | S0 | `company-links.test.ts` |
| Quotes | live | Finance | Finance | `fin_quotes`, `fin_quote_versions`, `fin_quote_events` | - | S0 | `fin-sales.test.ts`, `finance-sales.spec.ts` |
| Quote from a CRM deal | connected | CRM deal, "Across your company" | Company links, Finance | `fin_quotes.crm_deal_id`; deal timeline in `crm_events` | One customer record | S0 | `fin-sales.test.ts` |
| Sales product and service catalogue | live | CRM | CRM until the product master exists | `crm_products` | - | S0; linked to the product master in S3 | `crm-records.test.ts` |
| Pricing | planned | - | ERP Sales | price lists (new) | Product master | S4 | T-PERM, T-OWN |
| Sales contracts | planned | - | ERP Sales | new | Sales orders | S4.2 | T-ISO, T-DUP |
| Sales orders | planned | - | ERP Sales | `erp_sales_orders` (new) | Product master, Finance quotes | S4 | T-ISO, T-OWN, T-DUP, T-QTY, T-E2E |
| Order management | planned | - | ERP Sales | `erp_sales_orders` (new) | Sales orders | S4 | T-QTY, T-E2E |
| Credit management | planned | Payment terms and aged receivables in Finance | ERP Sales, reading Finance | credit limit as an ERP extension of `fin_contacts` (new) | Sales orders | S4 | T-PERM, T-OWN |
| Deliveries | planned | - | ERP Sales with Inventory | `erp_deliveries` (new) | Sales orders; stock deliveries need S6 | S4 (services), S6 (stock) | T-QTY, T-LED |
| Billing | live | Finance invoices | Finance | `fin_docs` (invoice) | - | S0; from sales orders in S4 | `fin-*.test.ts` |
| Won deal to draft invoice | connected | CRM deal, "Across your company" | Company links, Finance | `co_deal_links`; the invoice in `fin_docs` | One customer record | S0 | `company-links.test.ts` |
| Returns | planned | Finance credit notes | ERP Sales and Inventory; credit in Finance | returns (new); `fin_credit_notes` | Deliveries, goods receipts | S6 | T-QTY, T-LED |
| Rebates | planned | - | ERP Sales with Finance | new | Pricing, sales orders | S4.2 | T-LED |
| Customer service | planned | CRM activities and timelines | ERP Service | see 3.12 | - | S11 | see 3.12 |
| Sales forecast and reports | live | CRM dashboard and reports | CRM | worked out from `crm_deals` | - | S0 | `crm-records.test.ts` |

### 3.4 Sourcing and procurement

Served by BIZOMAT Finance (suppliers, purchase orders, bills); BIZOMAT ERP Procurement (planned module). Finance keeps
the supplier and the purchase order document; ERP adds what procurement needs in its own tables.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Supplier master | live | Finance contacts (kind supplier) | Finance | `fin_contacts`; ERP profile `erp_supplier_profiles` (new, keyed by the contact) | - | S0; profile in S5 | `fin-*.test.ts` |
| Supplier qualification | planned | - | ERP Procurement | `erp_supplier_profiles` (new) | Approval engine | S5 | T-PERM, T-OWN |
| Requests for quotation (RFQs) | planned | - | ERP Procurement | `erp_rfqs` (new) | Requisitions | S5 | T-ISO, T-DUP |
| Supplier comparisons | planned | - | ERP Procurement | worked out from RFQ responses | RFQs | S5 | T-E2E |
| Supplier contracts | planned | - | ERP Procurement | new | Supplier profiles | S5.2 | T-ISO |
| Purchase requisitions | planned | - | ERP Procurement | `erp_requisitions` (new) | Approval engine, product master | S5 | T-PERM, T-DUP |
| Purchase orders | live | Finance | Finance (document), ERP (extension) | `fin_docs` (purchase order) + `erp_po_extensions` (new) | - | S0; product lines S5, receiving S6 | `fin-*.test.ts` |
| Purchase order to bill | live | Finance | Finance | `fin_docs` | - | S0 | `fin-*.test.ts` |
| Purchase scheduling | planned | - | ERP Procurement | expected dates in `erp_po_extensions` (new) | Purchase orders with product lines | S5 | T-E2E |
| Goods receipts | planned | - | ERP Inventory | `erp_goods_receipts` (new) | Inventory core, purchase orders | S6 | T-QTY, T-LED, T-DUP |
| Three-way matching | planned | - | Finance with ERP Inventory | match status on the bill (new) | Goods receipts, Finance bills | S6 | T-QTY, T-LED |
| Supplier invoices | live | Finance bills | Finance | `fin_docs` (bill) | - | S0 | `fin-*.test.ts`, T-HON |
| Supplier performance | planned | - | ERP Procurement | worked out from receipts and inspections | Goods receipts, inspections | S6, S9 | T-E2E |

### 3.5 Product lifecycle and engineering

Served by BIZOMAT Engineering Automation (the CAD Automation application) and, when built, BIZOMAT ERP Products and
Engineering records. CAD Automation keeps no models: the SOLIDWORKS files stay on the engineer's computer.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Product master | planned | CRM catalogue, for deals | ERP Products | `erp_products` (new); `crm_products.erp_product_id` and `fin_doc_lines.product_id` (additive) | Numbering, module access | S3 | T-ISO, T-OWN, T-DUP, T-MIG |
| Product classification | planned | - | ERP Products | categories (new) | Product master | S3 | T-ISO |
| Variants and configurations | planned | - | ERP Products | `erp_product_variants` (new) | Product master | S3 | T-DUP |
| Specifications | planned | - | ERP Products | product attributes (new) | Product master | S3 | T-ISO |
| Parts and assemblies in SOLIDWORKS | live | CAD Automation (`/cad`, MCP tools, add-in, Companion) | CAD Automation | the SOLIDWORKS files on the engineer's computer | A paired Windows computer with SOLIDWORKS | S0; field testing next | T-CAD |
| Engineering drawings | live | CAD Automation | CAD Automation | the drawing file on the engineer's computer; exports are one-hour links | As above | S0; released copies in ERP in S7 | T-CAD |
| CAD integration | live | CAD Automation; ERP Products and Engineering (setup) | CAD Automation | CAD Automation's own accounts and `bridge.sqlite` | - | S0 | T-CAD, `system.test.ts` |
| CAD computers and jobs in the ERP | in-development | ERP page, which says CAD Automation is not reporting yet | ERP shell, fed by CAD Automation | `sys_cad_status` (one report per account; CAD Automation stays the source) | CAD Automation's reporter merged; the `cad` client secret set on both apps (owner) | S1 | `system.test.ts`; the reporter's tests in CAD Automation |
| Design checks | live | CAD Automation | CAD Automation | - | - | S0 | T-CAD |
| Model import and export | live | CAD Automation | CAD Automation | - | - | S0 | T-CAD |
| Bill of materials (BOM) management | planned | Parts list on a SOLIDWORKS drawing | ERP Engineering | `erp_boms`, `erp_bom_lines` (new) | Product master, revisions | S7 | T-ISO, T-DUP |
| Multi-level BOM | planned | - | ERP Engineering | `erp_boms` (new) | BOM management | S7 | T-E2E |
| Routings | planned | - | ERP Engineering (shared with Manufacturing) | `erp_routings`, `erp_operations`, `erp_work_centres` (new) | Sites | S7 | T-ISO |
| Engineering revisions | planned | - | ERP Engineering | `erp_revisions` (new) | Product master | S3 (field), S7 (release) | T-DUP |
| Engineering change requests and orders (ECR and ECO) | planned | - | ERP Engineering | `erp_changes` (new) | Revisions, approval engine | S7 | T-PERM |
| Document management | planned | Each tool's own documents | ERP Engineering, Core file store | `erp_documents` (new) | Revisions | S7 | T-ISO |
| Product costing | planned | - | ERP Engineering with Finance | rolled-up cost on the product (new) | BOMs, routings, work centre rates | S7.2 | T-LED |
| Lifecycle status | planned | - | ERP Products | product status (new) | Product master | S3 | T-PERM |
| Compliance | planned | - | ERP Engineering and Quality | new | Product master, documents | S9 | T-ISO |
| Drawing generated from an ERP product | planned | - | ERP Engineering with CAD Automation | `erp_cad_links`, `erp_documents` (new) | Sign in with BIZOMAT for CAD Automation, product master, revisions | S7 | T-CAD, T-OWN |

### 3.6 Manufacturing

Served by BIZOMAT ERP Manufacturing (planned module). Nothing is built. Work orders own quantities, materials and
status; Projects owns the collaboration tasks made from them; Finance owns the WIP journals.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Discrete manufacturing | planned | - | ERP Manufacturing | `erp_work_orders` (new) | BOMs, routings, inventory | S8 | T-ISO, T-QTY, T-E2E |
| Process manufacturing | planned | - | ERP Manufacturing | formulas and batch records (new) | Discrete manufacturing, lots | S8.2 | T-QTY |
| Repetitive manufacturing | planned | - | ERP Manufacturing | rate-based orders (new) | Discrete manufacturing | S8.2 | T-QTY |
| Make to stock | planned | - | ERP Manufacturing | `erp_work_orders` (new) | Inventory | S8 | T-QTY |
| Make to order | planned | - | ERP Manufacturing | `erp_work_orders` linked to `erp_sales_orders` (new) | Sales orders | S8 | T-QTY, T-DUP |
| Engineer to order | planned | Deal to project tracks the work in Projects | ERP Manufacturing with Projects | `erp_work_orders` (new); tasks in Projects | Make to order, engineering records | S8 | T-OWN |
| Project manufacturing | planned | - | ERP Manufacturing with Projects | work orders carry the project's Finance tracking project | Make to order | S8 | T-LED, T-OWN |
| Master production scheduling | planned | - | ERP Manufacturing | plan (new) | Sales orders, work orders | S8.2 | T-E2E |
| Material requirements planning (MRP) | planned | - | ERP Manufacturing | suggestions (new) | BOMs, inventory, sales orders | S8.2 | T-QTY |
| Capacity planning | planned | - | ERP Manufacturing | worked out from work centres and operations | Routings | S8 | T-E2E |
| Advanced planning and scheduling | planned | - | ERP Manufacturing | - | MRP, capacity planning | S8.2 | T-AI if AI proposes schedules |
| Production orders | planned | - | ERP Manufacturing | `erp_work_orders` (new) | Product master, BOMs, routings | S8 | T-ISO, T-QTY, T-E2E |
| Job management | planned | - | ERP Manufacturing | `erp_wo_operations` (new) | Production orders | S8 | T-E2E |
| Shop-floor control | planned | - | ERP Manufacturing | operation reports (new) | Job management | S8 | T-E2E (tablet) |
| Manufacturing execution (MES) | planned | - | ERP Manufacturing | - | Shop-floor control | S8.2 | T-E2E |
| Labour and machine tracking | planned | - | ERP Manufacturing | operation hours (new) | Shop-floor control, work centres | S8 | T-QTY |
| Work in progress (WIP) | planned | - | ERP Manufacturing; journals in Finance | stock moves; `fin_journals` with origin | Finance journal service | S8 | T-LED |
| Scrap and rework | planned | - | ERP Manufacturing | operation reports and stock moves (new) | Shop-floor control | S8 | T-QTY, T-LED |
| Production costing | planned | - | ERP Manufacturing with Finance | worked out from moves and hours | WIP, work centre rates | S8 | T-LED |
| Overall equipment effectiveness (OEE) | planned | - | ERP Manufacturing | worked out from operation reports and downtime | Shop-floor control, CMMS downtime | S8.2 | T-E2E |

### 3.7 Inventory and warehousing

Served by BIZOMAT ERP Inventory and Warehouse (planned module), valued in BIZOMAT Finance. This is the central
inventory service: every other module (sales, procurement, manufacturing, maintenance) moves stock through it.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Multi-warehouse | planned | - | ERP Inventory | `erp_warehouses` (new) | Sites | S6 | T-ISO |
| Bins and locations | planned | - | ERP Inventory | `erp_locations` (new) | Warehouses | S6 | T-ISO |
| Raw materials | planned | - | ERP Inventory | `erp_stock_moves`, `erp_stock_balances` (new) | Product master | S6 | T-QTY |
| Work in progress stock | planned | - | ERP Inventory | `erp_stock_moves` (new) | Manufacturing | S8 | T-QTY, T-LED |
| Finished goods | planned | - | ERP Inventory | `erp_stock_moves` (new) | Product master | S6 | T-QTY |
| Stock movements | planned | - | ERP Inventory | `erp_stock_moves` (new; posted moves never edited) | Warehouses, product master | S6 | T-QTY, T-LED |
| Batch and lot tracking | planned | - | ERP Inventory | `erp_lots` (new) | Stock movements | S6.2 | T-QTY |
| Serial numbers | planned | - | ERP Inventory | serials (new) | Stock movements | S6.2 | T-QTY, T-DUP |
| Barcodes | planned | - | ERP Inventory | codes on products and locations | Stock movements | S6.2 | T-E2E (phone) |
| QR scanning | planned | - | ERP Inventory | as above | Barcodes | S6.2 | T-E2E (phone) |
| Reservations | planned | - | ERP Inventory | reservations (new) | Sales orders, work orders, maintenance work orders | S6 | T-QTY |
| Stock valuation | planned | - | ERP Inventory; journals in Finance | `erp_stock_moves`; `fin_journals` with `origin = 'erp_inventory'` | Finance journal service (F1) | S6 | T-LED |
| Cycle counts | planned | - | ERP Inventory | counts (new); adjustments over a threshold approved | Approval engine | S6 | T-PERM, T-LED |
| Picking and packing | planned | - | ERP Inventory | pick lists (new) | Deliveries | S6 | T-QTY, T-E2E |
| Receiving | planned | - | ERP Inventory | `erp_goods_receipts` (new) | Purchase orders | S6 | T-QTY, T-DUP |
| Dispatch | planned | - | ERP Inventory | `erp_deliveries` (new) | Picking and packing | S6 | T-QTY |
| Replenishment | planned | - | ERP Inventory with Procurement | minimum and reorder levels (new) | Stock on hand, requisitions | S6.2 | T-QTY |

### 3.8 Supply chain and logistics

Served by BIZOMAT ERP Supply Chain (planned module).

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Demand planning | planned | - | ERP Supply Chain | plans (new) | Sales order history | S10 | T-E2E |
| Supply planning | planned | - | ERP Supply Chain | plans (new) | Demand planning, procurement | S10 | T-E2E |
| Material planning | planned | - | ERP Manufacturing and Supply Chain | MRP suggestions (new) | MRP | S8.2 | T-QTY |
| Inventory optimisation | planned | - | ERP Supply Chain | - | Demand planning, stock history | S10.2 | T-E2E |
| Warehouse management | planned | - | ERP Inventory | see 3.7 | Inventory core | S6 | see 3.7 |
| Transportation management | planned | - | ERP Supply Chain | `erp_shipments`, `erp_carriers` (new) | Deliveries | S10 | T-ISO |
| Freight | planned | - | ERP Supply Chain; cost in Finance | freight cost on shipments (new) | Shipments | S10 | T-LED |
| Shipment tracking | planned | - | ERP Supply Chain | tracking references (new) | Shipments | S10 | T-E2E |
| Landed costs | planned | - | ERP Supply Chain with Finance | allocations to receipts (new) | Goods receipts, Finance journal service | S10 | T-LED |
| Distribution | planned | - | ERP Supply Chain | - | Multi-site inventory | S10 | T-QTY |
| Backorders | planned | - | ERP Sales with Inventory | open order lines | Sales orders, reservations | S6 | T-QTY |
| Inter-site transfers | planned | - | ERP Inventory | transfer moves (new) | Sites, stock movements | S6 | T-QTY, T-ISO |

### 3.9 Quality management

Served by BIZOMAT ERP Quality (planned module).

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Supplier quality | planned | - | ERP Quality with Procurement | worked out from inspections | Incoming inspection, supplier profiles | S9 | T-E2E |
| Incoming inspection | planned | - | ERP Quality | `erp_inspections` (new); quarantine location | Goods receipts | S9 | T-QTY |
| In-process inspection | planned | - | ERP Quality | `erp_inspections` (new) | Work orders | S9 | T-E2E |
| Final inspection | planned | - | ERP Quality | `erp_inspections` (new) | Work orders, deliveries | S9 | T-E2E |
| Quality plans | planned | - | ERP Quality | `erp_inspection_plans` (new) | Product master | S9 | T-ISO |
| Nonconformance reports (NCR) | planned | - | ERP Quality | `erp_ncrs` (new) | Inspections, approval engine | S9 | T-PERM |
| Corrective and preventive actions (CAPA) | planned | - | ERP Quality; actions as tasks in Projects | `erp_capas` (new); tasks in Projects | NCRs | S9 | T-OWN |
| Statistical process control (SPC) | planned | - | ERP Quality | measurements (new) | In-process inspection | S9.2 | T-E2E |
| Calibration | planned | - | ERP Quality with CMMS | instruments as `erp_assets` (new) | CMMS asset register (M1), plans (M2) | S9 | T-ISO |
| Quality audits | planned | - | ERP Quality | new | Approval engine | S9 | T-PERM |
| Traceability | planned | - | ERP Quality with Inventory | lots and serials | Batch and lot tracking | S9 | T-QTY |
| Product compliance | planned | - | ERP Quality | new | Product master, documents | S9 | T-ISO |
| Quality reporting | planned | - | ERP Quality | worked out | Inspections, NCRs | S9 | T-E2E |

### 3.10 Asset management and maintenance (CMMS)

Served by BIZOMAT ERP Asset Management and Maintenance. Owner's brief, 14 Nov 2026: a full maintenance management
system (CMMS) inside BIZOMAT ERP, in four stages, with MEX as a functional reference only. Stage 1 is being built now;
its features stay in-development until its tests pass, and the lead then marks them live. The table names below follow
`04-master-data-ownership.md`; the Stage 1 build decides the final names.

Rules this domain keeps:
- ERP Maintenance owns assets, requests, work orders, plans, readings and inspections. Parts are stock in the central
  inventory service (3.7), never a separate maintenance stock table. Purchases go through Procurement and Finance.
  Costs are posted by Finance. Shutdown collaboration lives in Projects. Drawings stay with Engineering and CAD
  Automation. No record of another system is copied.
- The AI scheduling assistant only proposes (T-AI). Offline field operation is never claimed before T-OFF passes.

#### Stage M1: register, requests and work orders (in development)

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Asset register | in-development | Being built | ERP Maintenance | `erp_assets` (new) | Company tenancy | M1 | T-ISO, T-PERM, T-MIG, owner's tests |
| Asset hierarchy | in-development | Being built | ERP Maintenance | parent asset and location on `erp_assets` (new) | Asset register | M1 | T-ISO (no loops, no links across companies) |
| Equipment master and asset details | in-development | Being built | ERP Maintenance | `erp_assets` (new) | Asset register | M1 | T-ISO |
| Maintenance requests with approval | in-development | Being built | ERP Maintenance | `erp_maintenance_requests` (new) | Asset register | M1 | T-PERM (no self-approval), T-DUP, T-E2E |
| Maintenance work orders | in-development | Being built | ERP Maintenance | `erp_maintenance_orders` (new) | Requests | M1 | T-ISO, T-PERM, T-DUP, T-E2E |
| Corrective maintenance | in-development | Being built | ERP Maintenance | `erp_maintenance_orders` (new) | Work orders | M1 | T-E2E |
| Breakdown maintenance | in-development | Being built | ERP Maintenance | `erp_maintenance_orders` (new) | Work orders | M1 | T-E2E |
| Technician assignment | in-development | Being built | ERP Maintenance | assignee on the work order | Work orders, company people | M1 | T-PERM |
| Labour timer | in-development | Being built | ERP Maintenance | labour entries (new) | Work orders | M1 | T-QTY (one running timer per person and order), T-E2E (phone) |
| Photos and documents | in-development | Being built | ERP Maintenance, Core file store | `erp_documents` (new) | Work orders, assets | M1 | T-ISO, document security (sandboxed downloads) |

#### Stage M2: preventive maintenance and inspections (planned)

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Preventive maintenance plans | planned | - | ERP Maintenance | `erp_maintenance_plans` (new) | Work orders | M2 | T-DUP (a trigger makes one work order) |
| Maintenance planning and calendar | planned | - | ERP Maintenance | worked out from plans and orders | Plans | M2 | T-E2E |
| Recurring work orders | planned | - | ERP Maintenance | `erp_maintenance_orders` (new) | Plans | M2 | T-DUP |
| Asset readings and meters | planned | - | ERP Maintenance | asset readings (new) | Asset register | M2 | T-ISO |
| Condition monitoring | planned | - | ERP Maintenance | readings and thresholds (new) | Readings | M2 | T-E2E |
| Threshold alerts | planned | - | ERP Maintenance; notifications | alert rules (new) | Readings | M2 | T-DUP (one alert per crossing) |
| Work order inspections | planned | - | ERP Maintenance | inspection templates and answers (new) | Work orders | M2 | T-DUP (a failed answer raises one request or order), T-E2E |

#### Stage M3: prestarts, parts, stores and sites (planned)

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Digital prestart checklists | planned | - | ERP Maintenance | prestart templates and answers (new) | Inspections (M2) | M3 | T-E2E (phone) |
| Spare parts and stores | planned | - | ERP Inventory (stock), ERP Maintenance (use) | `erp_stock_moves`, reservations; parts are products | Inventory core (S6), procurement (S5), product master (S3) | M3 | T-QTY, T-OWN, T-LED |
| Maintenance stocktakes | planned | - | ERP Inventory | inventory counts | Cycle counts (S6), approval engine | M3 | T-PERM, T-LED |
| Barcode and QR scanning | planned | - | ERP Inventory and Maintenance | codes on assets, parts and locations | Barcodes (S6.2) | M3 | T-E2E (phone) |
| Multi-site maintenance | planned | - | ERP Maintenance | site on assets and orders | Sites (S2) | M3 | T-ISO (site scope) |
| Fuel records | planned | - | ERP Maintenance | fuel records (new); cost in Finance | Readings | M3 | T-LED |

#### Stage M4: planning, AI assistance and reliability (planned)

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Trades and technician workload planning | planned | - | ERP Maintenance | trades (new); qualifications later from People (S12) | Work orders, plans | M4 | T-E2E |
| AI scheduling assistant | planned | - | ERP Maintenance | schedule proposals with their history (new) | Workload planning; the controlled AI action rules (S13) | M4 | T-AI |
| Reliability reporting | planned | - | ERP Maintenance | worked out from orders, downtime and costs | Downtime, costs in Finance | M4 | T-E2E, exports checked against the records |
| Downtime | planned | - | ERP Maintenance | downtime records (new) | Work orders | M4 | T-QTY |
| Predictive maintenance | planned | - | ERP Maintenance | - | Readings history, IoT integrations | M4 | T-AI |
| IoT integrations | planned | - | ERP Maintenance with the integration platform | readings from devices | Readings, event processing (track I) | M4 | security review, T-ISO |
| Offline field operation | planned | - | ERP Maintenance | offline queue on the device | M1 to M3 screens | M4 | T-OFF |
| Lifecycle costs | planned | - | ERP Maintenance with Finance | worked out from posted costs | Maintenance costs in Finance | M4 | T-LED |

#### Administration and links to the other systems (planned)

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Maintenance administration centre | planned | - | ERP Maintenance | field definitions and settings (new); configuration audit in `erp_audit_log` (new) | Module access (S2) | M2 to M4, growing with each stage | T-PERM (field-level edit rights), audit of every configuration change |
| Maintenance costs in Finance | planned | - | Finance (journals), ERP Maintenance (source) | `fin_journals` with an origin; fixed asset reference | Finance journal service (F1); fixed assets (F3) for the reference | M3 | T-LED, T-OWN |
| Shutdown projects in Projects | planned | - | Projects (tasks), ERP Maintenance (orders) | tasks in Projects linked to work orders | Work orders; Projects item service | M2 | T-OWN, T-DUP |
| Drawings and manuals from Engineering | planned | - | ERP Engineering and CAD Automation | `erp_documents`, `erp_cad_links` (new) | Engineering records (S7) | M4 | T-ISO, T-OWN |

#### Owner's acceptance tests A to J

The owner's CMMS brief sets acceptance tests A to J. They are the exit criteria of the CMMS stages
(`15-erp-roadmap-2026.md`, section 5). Their wording is not yet recorded in this repository: copy it here from the
brief before Stage M1 is marked live, and note against each test the stage it closes.

### 3.11 Project and portfolio management

Served by BIZOMAT Projects, with costs from BIZOMAT Finance.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Portfolios | planned | Folders, dashboards across boards, goals | Projects | new | Module access | P1 | T-ISO, T-PERM |
| Project planning | live | Projects | Projects | `boards`, `items`, `task_schedules`, `task_links`, `project_calendars` | - | S0 | `schedule-engine.test.ts`, `project-controls.test.ts`, `views.test.ts` |
| Work breakdown structure (WBS) | live | Projects schedule | Projects | worked out from groups, items and subitems | - | S0 | `schedule-engine.test.ts` |
| Milestones | live | Projects | Projects | `task_schedules` (milestone) | - | S0 | `project-controls.test.ts` |
| Baselines and earned value | live | Projects | Projects | `project_baselines`, `baseline_tasks`, `task_progress_entries`, `task_cost_entries` | - | S0 | `project-controls.test.ts`, `report-controls.test.ts`, `baselines-insert-only.test.ts` |
| Project budgets | live | Projects finance columns | Projects | the board's finance columns and currency | - | S0 | `project-controls.test.ts`, `platform-finance-reports.test.ts` |
| Resources | live | Workload view, people columns | Projects | `items` people columns, `task_schedules` work and units | - | S0 | `views.test.ts`, `dashboards.test.ts` |
| Timesheets | live | Time tracking on tasks | Projects | `time_entries` | - | S0; approval P1 | `items.test.ts` |
| Project procurement | planned | - | ERP Procurement with Projects | requisitions and orders carry the project's Finance tracking project | Procurement | P3 | T-OWN, T-LED |
| Project costing | connected | Company projects page; cost entries in Projects | Company links, Finance | `co_project_links`; figures read from `fin_journal_lines` | Both tools in one company | S0 | `company-links.test.ts` |
| Project billing | planned | Progress invoices from Finance quotes | Finance with Projects | invoices in `fin_docs` | Sales orders | P2 | T-LED, T-DUP |
| Project profitability | connected | Company projects page | Company links, Finance | `co_project_links` | Project costing | S0 | `company-links.test.ts` |
| Deal to project | connected | CRM deal, "Across your company" | Company links | `co_deal_links` | Both tools in one company | S0 | `company-links.test.ts` |
| CRM activity to task | connected | CRM activity | CRM with Projects | task reference on `crm_activities` (`pm_item_id`) | - | S0 | `crm-records.test.ts` |
| Project documents | live | Projects documents | Projects | `documents`, `document_versions` | - | S0 | `documents.test.ts` |
| Project reports and dashboards | live | Projects | Projects | `reports` (saved versions); dashboards | - | S0 | `report-controls.test.ts`, `dashboards.test.ts` |

### 3.12 Service management

Served by BIZOMAT ERP Service (planned module), with customers in BIZOMAT CRM. Nothing is built.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Customer service cases | planned | CRM activities and timelines | ERP Service | cases (new), linked to `crm_companies` | CRM, event processing | S11 | T-ISO, T-OWN |
| Service contracts | planned | - | ERP Service | new | Sales contracts | S11 | T-ISO |
| Warranty | planned | - | ERP Service | new | Serial numbers, deliveries | S11 | T-QTY |
| Service orders | planned | - | ERP Service | new | Cases | S11 | T-E2E |
| Field service | planned | - | ERP Service | new | Service orders; CMMS technician screens (M1) | S11 | T-E2E (phone) |
| Technician scheduling | planned | - | ERP Service | new | Field service; CMMS workload planning (M4) | S11.2 | T-AI if AI proposes |
| Repairs | planned | - | ERP Service | new | Service orders | S11 | T-QTY |
| Return material authorisation (RMA) | planned | - | ERP Service with Inventory | new | Returns | S11 | T-QTY, T-DUP |
| Service spare parts | planned | - | ERP Inventory | stock moves | Inventory core | S11 | T-QTY |
| Service history | planned | CRM timeline per customer | ERP Service | worked out | Cases, serial numbers | S11 | T-ISO |

### 3.13 Human capital management

Served by BIZOMAT ERP People (planned module), with people and departments in Company accounts.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Employees | planned | Company people are accounts with roles | ERP People | employee records (new), linked to `co_members` | Legal entities | S12 | T-ISO, personal data review |
| Organisation structures | live | Nested departments with heads | Company | `co_departments` | - | S0; positions S12 | `company.test.ts` |
| Recruitment | planned | - | ERP People | new | Employees | S12.2 | personal data review |
| Onboarding | planned | Invitations with tool roles | ERP People | new | Employees | S12 | T-PERM |
| Training | planned | - | ERP People | new | Employees | S12 | T-ISO |
| Qualifications | planned | - | ERP People | new | Employees | S12 | T-ISO |
| Workforce scheduling | planned | - | ERP People | new | Employees, sites | S12.2 | T-E2E |
| Attendance | planned | - | ERP People | new | Employees | S12.2 | T-ISO |
| Leave | planned | - | ERP People | new | Employees, approval engine | S12 | T-PERM |
| Payroll | planned | - | Finance (its own brief, Stage 4) | - | An approved design and provider | F4 | T-HON |
| Superannuation | planned | - | Finance (its own brief, Stage 4) | - | Payroll | F4 | T-HON |
| Performance | planned | - | ERP People | new | Employees | S12.2 | T-PERM |

### 3.14 Governance and compliance

Served by BIZOMAT ERP Administration, with each system's own controls.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Internal controls | live | Finance approvals, period lock, ledger triggers | Finance today; Core later | `fin_*` settings and triggers | - | S0; company-wide S2 | `fin-*.test.ts` |
| Segregation of duties | planned | Finance roles separate submitters from approvers | Core (approval engine) | approval rules (new) | Approval engine | S2 | T-PERM |
| Approval limits | planned | - | Core (approval engine) | approval rules (new) | Approval engine | S2 | T-PERM |
| Audit trails | live | Each system's audit log; platform console activity | Each system; Core for one view | `co_audit`, `crm_audit_log`, `fin_audit_log`, `audit_events` | - | S0; one company view S2 | `system.test.ts`, `security.test.ts` |
| Risk management | planned | - | Core | new | Approval engine | S9 | T-PERM |
| Policy management | planned | - | Core | new | Documents | S9 | T-PERM |
| Regulatory records | planned | - | Core | new | Documents | S9 | T-ISO |
| Document retention | planned | Deleted Finance documents kept for audit | Core | retention rules (new) | Documents | S9 | T-ISO, T-MIG |
| Data security | live | Every system | Each system | company and organisation scoping, composite foreign keys | - | S0 | `isolation.test.ts`, `security.test.ts`, `crm-records.test.ts`, `fin-access.test.ts` |
| Access reviews | planned | People and roles per company; platform console | Core | review records (new) | Module access | S2 | T-PERM |

### 3.15 Enterprise analytics and AI

Served by BIZOMAT ERP Dashboard and Reports.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Executive dashboards | connected | ERP dashboard by company | ERP shell, reading each tool | none (figures read on request) | Each tool's own figure rules | S0; role dashboards S1 | `system.test.ts`, `company.test.ts` |
| Department dashboards | connected | Company overview by department | Company, reading each tool | none (figures read on request) | Departments in every tool | S0 | `company.test.ts` |
| Reports hub | live | ERP Reports page | ERP shell | none (links to each tool's reports) | - | S0 | `system.test.ts` |
| Operational KPIs | planned | Each tool's own dashboard | ERP Reporting | worked out | Sales orders, inventory, manufacturing | S13 | T-E2E |
| Financial analytics | live | Finance dashboard and reports | Finance | worked out from journals | - | S0 | `fin-*.test.ts` |
| Sales analytics | live | CRM dashboard and reports | CRM | worked out from CRM records | - | S0 | `crm-records.test.ts` |
| Production analytics | planned | - | ERP Reporting | worked out | Manufacturing | S13 | T-E2E |
| Predictive forecasting | planned | - | ERP Reporting | - | History in each module | S13 | T-AI |
| Exception detection | planned | Rule alerts in Finance and the CRM | ERP Reporting | - | Event processing | S13 | T-DUP |
| AI business assistant | planned | - | ERP shell | none: reads through each owner's permissions | Universal search, controlled AI actions | S13 | T-AI, T-ISO, T-PERM |
| Workflow automation | live | Automations in Projects and the CRM; Finance recurring records and alerts | Each tool | `automations`, `crm_automations`, `fin_recurring` | - | S0; across systems I2 | `automations.test.ts`, `crm-records.test.ts`, `fin-*.test.ts` |
| Natural-language reporting | planned | - | ERP Reporting | - | AI business assistant | S13 | T-AI |
| Controlled AI actions | planned | CAD Automation's own tool limits | ERP shell | proposals and their decisions (new) | Approval engine | S13 | T-AI |

### 3.16 Enterprise integration platform

Served by the ERP platform: the shared API of the work app and the BIZOMAT sign-in.

| Feature | Status | Served by today | Owner | Data owner | Depends on | Phase | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| APIs | live | Each system's API under `/api` | Each system | `api_tokens` (personal tokens) | - | S0; reference and scoped tokens I2 | `auth.test.ts`, `security.test.ts` |
| Webhooks | live | Projects outgoing webhooks, Slack and Microsoft Teams | Projects | `integrations`, `integration_deliveries` | - | S0; other modules I2 | `automations.test.ts` |
| Event processing | planned | - | Core | `erp_events` outbox (new) | - | I1 (with S2) | T-DUP (idempotent handlers) |
| Document exchange | live | Secure online links for quotes, invoices, credit notes | Finance | the signed link value stored with each document | - | S0; e-invoicing I3 | `fin-sales.test.ts`, `finance-sales.spec.ts` |
| Electronic data interchange (EDI) | planned | - | Core | - | Event processing, sales and purchase orders | I3 | security review |
| External connections | live | Email outbox, Slack and Microsoft Teams, AI apps through CAD Automation | Each system | `email_outbox`, `integrations` | - | S0 | `email-links.test.ts`, `automations.test.ts`, T-CAD |
| Identity and access management | live | One BIZOMAT account and session | Core | `users`, `sessions`, `api_tokens` | - | S0 | `auth.test.ts`, `mount.test.ts`, `signup-protection.test.ts` |
| Sign in with BIZOMAT for CAD Automation | in-development | Provider side built and deployed; CAD Automation's side built, not merged | Core (provider), CAD Automation (client) | `id_auth_codes`, `id_access_tokens`; CAD Automation keeps the BIZOMAT id only | Merge in CAD Automation; client secret set on both apps (owner) | S1 | `company.test.ts`; CAD Automation's own tests in its unmerged change |
| Extensible workflows | planned | Automations inside Projects and the CRM | Core | - | Event processing | I2 | T-DUP, T-PERM |
| Custom fields | live | Projects columns, CRM custom fields | Projects, CRM | board columns, `crm_custom_fields` | - | S0; ERP records I2 | `columns.test.ts`, `crm-records.test.ts` |
| Custom reports | live | Projects dashboards, saved views in Projects and the CRM | Projects, CRM | dashboards, `crm_saved_views` | - | S0; designer across systems I2 | `dashboards.test.ts`, `crm-records.test.ts` |
| Integration monitoring | planned | Webhook delivery records in Projects | Core | - | Event processing | I1 | T-E2E |

## 4. Keeping the statuses honest

- **One public source.** `src/data/erp-capabilities.ts` is the only public statement of ERP coverage. Pages that show
  coverage read from it. This document explains it; when they differ, the code wins and both are corrected.
- **Same commit.** When a feature's code changes status (built, merged, switched on, removed), the registry and this
  matrix change in the same pull request.
- **Who flips a status.** in-development becomes live only after its tests pass on both runtimes and its public
  address is checked (`CLAUDE.md`, "After any production change"). planned becomes in-development only when code for it
  exists on a branch. connected needs both systems' permission checks and a same-company check in the code.
- **A test should compare it with the code over time.** Proposed checks, in a website test beside
  `tests/platform-catalog.test.ts`:
  1. Exactly sixteen domains in the order of section 3; every feature has exactly one of the four statuses; no
     duplicate feature names within a domain.
  2. Features marked live or connected point at code that exists. For example: Finance's `REPORTS` has 12 entries; the
     CRM's `REPORTS` has 11; `CUSTOM_FIELD_TYPES` has 11; the link routes in `apps/work/src/worker/company/links.ts`
     exist for each connected row; `SuiteRail.tsx` lists the rail modules named in `11-enterprise-workspace-update.md`.
  3. Features that must never be live: bank feeds, treasury payments, BAS lodgement, payroll and superannuation stay
     planned unless the owner records an approved provider and design (T-HON).
  4. in-development rows name what is missing; when the missing step lands (the CAD reporter merged, the CMMS Stage 1
     tests passing), the test fails until the status is updated.
  5. The counts in section 2 equal `capabilityCounts()` per domain.
- **No invented facts.** No customer, figure, price or partner appears in the registry or here. Notes say what exists
  and what does not.
