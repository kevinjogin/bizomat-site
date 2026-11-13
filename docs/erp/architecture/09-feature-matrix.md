# 9. Complete ERP feature matrix

Status: proposal for review. **W** works today in an existing BIZOMAT application, **E** extends an existing record or
screen, **N** new ERP feature. Priority: **P1** first release of the module, **P2** next, **P3** later. "Depends on"
names the features or modules that must exist first.

## 9.1 Existing modules inside ERP (reused, not rebuilt)

| Area | Feature | State | ERP role |
| --- | --- | --- | --- |
| Sales & Customers | Companies, contacts, leads, deals, pipelines, activities, notes, files, automations, email templates, calendar feeds, CRM reports | W (CRM) | Opened in the ERP shell; My Work gathers activities |
| Sales & Customers | Quotes with versions, online acceptance, progress invoicing | W (Finance Stage 1) | Source of sales orders |
| Finance | Ledger, chart of accounts, tax codes, tracking, transactions, statement import and reconciliation, invoices, credit notes, bills, purchase orders, expense claims, payments, budgets, goals, recurring records, 12 reports with CSV and PDF, GST worksheet, period lock, approvals, audit | W (Finance) | Opened in the ERP shell; posts every ERP journal |
| Projects & Tasks | Workspaces, boards, groups, items, columns, views (table, kanban, timeline, calendar, workload), dashboards, documents, goals, automations, time and cost entries, baselines, schedules, my work | W (Project Management) | Opened in the ERP shell; receives ERP tasks |
| Company | Registration with checks, people and tool roles, departments in every tool, overview figures, links between tools, BIZOMAT sign-in for other apps | W (Company) | ERP Administration builds on it |
| Engineering | CAD Automation: SolidWorks MCP tools, add-in and Companion, CAD files and jobs | W (separate app `cados`) | Called from products and revisions |

## 9.2 New modules

### 1. Product master and engineering (PRD)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Product master: code, name, kind, unit, category, status, accounts, tax codes, prices, costs, attributes | N | P1 | Core module access, numbering |
| Product variants (attributes, codes, price differences) | N | P1 | Product master |
| Product categories and units of measure with conversions | N | P1 | Product master |
| Link CRM product catalogue (`crm_products.erp_product_id`) and import once | E | P1 | Product master |
| Product on Finance lines (`fin_doc_lines.product_id`, quote and credit lines) | E | P1 | Product master |
| Revisions (A, B, C) with status and release | N | P1 | Product master |
| Engineering BOMs per revision: tree view, quantities, scrap, reference designators | N | P1 | Revisions |
| BOM compare between revisions; where-used | N | P2 | BOMs |
| Engineering change requests and orders with approval and stock disposition | N | P2 | Revisions, approvals |
| Drawings and models linked from CAD Automation (by hand first) | E | P1 | Revisions |
| Generate a drawing through CAD Automation | E | P3 | BIZOMAT sign-in in CAD Automation |
| Documents on products and revisions with preview | N | P1 | Core documents |

### 2. BOM and routing management (shared with Manufacturing)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Manufacturing BOM derived from the engineering BOM | N | P2 | Engineering BOMs |
| Work centres (site, capacity, cost rate) | N | P1 | Sites |
| Routings: operations with work centre, set-up and run times | N | P1 | Work centres, revisions |
| Rolled-up standard cost (materials + operations) | N | P2 | BOMs, routings, product costs |

### 3. Supplier and procurement management (PRC)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Supplier profile on Finance contacts: approval status, lead times, terms, certifications, rating | E | P1 | Finance contacts |
| Purchase requisitions with approval | N | P1 | Approvals, products |
| Requests for quotation and supplier responses, comparison | N | P2 | Requisitions |
| Purchase orders through Finance, with product lines, site, warehouse, expected dates | E | P1 | Finance POs, products |
| Receiving status and expected receipts | E | P1 | Goods receipts |
| Three-way match (PO, receipt, bill) with tolerance | E | P2 | Goods receipts, Finance bills |
| Supplier performance (on-time, quality, price) | N | P2 | Receipts, inspections |
| Reorder suggestions from minimum stock | N | P2 | Inventory |

### 4. Inventory and warehouse management (INV)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Warehouses and locations (bins) per site | N | P1 | Sites |
| Stock moves ledger (posted moves never edited) | N | P1 | Products, warehouses |
| Stock on hand by product, location, lot | N | P1 | Stock moves |
| Goods receipts against purchase orders, put-away | N | P1 | Procurement |
| Transfers between locations and sites | N | P1 | Stock moves |
| Stock counts (cycle and full) with adjustments over a threshold approved | N | P2 | Stock moves, approvals |
| Lots and serial numbers, expiry | N | P2 | Stock moves |
| Reservations for sales and work orders | N | P2 | Sales orders, work orders |
| Inventory valuation journals in Finance (`origin = 'erp_inventory'`) | E | P1 | Finance journal service, `fin_journals.origin` |
| Barcode and QR scanning on phones (camera, manual entry) | N | P2 | Stock moves |
| Minimum and reorder levels, low-stock alerts | N | P2 | Stock on hand |

### 5. Manufacturing and production (MFG)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Work orders from sales orders or for stock | N | P1 | Products, BOMs, routings |
| Release with component availability check and reservations | N | P1 | Inventory |
| Operations reporting (start, stop, quantity, scrap) | N | P1 | Work orders |
| Issue components and output finished goods (stock moves) | N | P1 | Inventory |
| Work-in-progress and finished goods journals | E | P2 | Finance journal service |
| Tasks in Project Management per operation | E | P2 | Project Management item service |
| Production planning board (capacity load by work centre, drag to reschedule) | N | P2 | Work orders, work centres |
| Material requirements planning (MRP) suggestions | N | P3 | Sales orders, BOMs, inventory |
| Shop floor screen on tablets | N | P2 | Operations reporting |

### 6. Quality management (QLT)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Inspection plans (characteristics, methods, tolerances) per product and stage | N | P1 | Products |
| Incoming inspection from goods receipts (quarantine location until passed) | N | P1 | Goods receipts |
| In-process and final inspections from operations and deliveries | N | P2 | Work orders, deliveries |
| Nonconformance reports with disposition and approval | N | P1 | Inspections, approvals |
| Corrective and preventive actions (CAPA) with tasks in Project Management | E | P2 | NCRs, Project Management |
| Certificates of conformance on deliveries | N | P3 | Deliveries, documents |
| Mobile inspection checklist | N | P2 | Inspections |

### 7. Asset and maintenance management (AST)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Asset register (site, location, make, model, serial, status) | N | P1 | Sites |
| Link to work centres | N | P1 | Work centres |
| Maintenance plans (calendar or meter) | N | P1 | Assets |
| Maintenance orders (preventive, corrective), labour, parts from stock | N | P1 | Assets, inventory |
| Work requests from any person (mobile) | N | P2 | Maintenance orders |
| Downtime recording and availability | N | P2 | Maintenance orders, work centres |
| Finance fixed asset link (depreciation in Finance Stage 3) | E | P3 | Finance fixed assets |

### 8. Supply chain and logistics (SCM)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Sales orders from accepted quotes or won deals | N | P1 | Finance quotes, CRM deals, products |
| Deliveries with picking and packing | N | P1 | Sales orders, inventory |
| Invoicing from deliveries through Finance | E | P1 | Finance `createDoc` |
| Delivery history on the CRM timeline | E | P1 | CRM events |
| Carriers and shipments (tracking reference, freight cost) | N | P2 | Deliveries |
| Delivery schedule (calendar of promised dates) | N | P2 | Sales orders |
| Customer and supplier returns | N | P3 | Deliveries, receipts, credit notes |
| Demand plan from sales history | N | P3 | Sales orders |

### 9. Enterprise reporting (RPT)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| Role dashboards with widgets from every module | N | P1 | Shell, module APIs |
| Company performance report (sales, margin, cash, on-time delivery, quality, utilisation) | N | P2 | Sales orders, Finance reports, quality, manufacturing |
| Operational reports (stock valuation, inventory turns, open POs, late work orders, NCR Pareto, maintenance backlog) | N | P2 | Each module |
| Saved and scheduled reports (Finance's scheduler pattern) | E | P2 | Report definitions |
| Exports (CSV, PDF through the document engine) | E | P1 | Each report |

### 10. Shell and shared services (Core)

| Feature | Type | Priority | Depends on |
| --- | --- | --- | --- |
| `/erp` mount in the work app, ERP route table, shell (header, sidebar, breadcrumbs) | N | P1 | none |
| Company and site selectors | E | P1 | `co_sites` |
| Module access and role templates | E | P1 | `co_module_access` |
| Global search across modules | E | P1 | Each module's search |
| My Work (tasks, approvals, follow-ups, mentions) | E | P1 | Each module's lists |
| Quick create | E | P1 | Each module's forms |
| Favourites and recent | N | P1 | Shell |
| Approval engine for ERP records | N | P1 | Module access |
| Enterprise audit view | E | P2 | Each audit table |
| Notification centre across tools | E | P2 | Each notification table |
| Mobile layouts (approvals, tasks, scanning, inspections, maintenance) | N | P2 | Modules |
