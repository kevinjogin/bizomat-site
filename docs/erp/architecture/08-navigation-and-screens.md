# 8. ERP navigation and screen structure

Status: proposal for review. The full experience design is in `../ux/`: the navigation map and routes
(`02-information-architecture.md`), dashboards (`04-role-dashboards.md`), patterns (`05-reusable-screens.md`),
design system (`06-design-system.md`), responsive layouts (`07-responsive-layouts.md`) and the clickable prototype
(`08-prototype-guide.md`). This page lists, per module, the screens to build and the pattern each uses, so every
stage of the roadmap has a fixed scope.

Patterns: **D** dashboard, **L** list, **R** record, **F** form, **W** workflow or approval, **Rp** report,
**M** mobile-first screen. State: **W** working today (opened inside ERP), **N** new.

## 8.1 Shell and shared

| Screen | Route | Pattern | State |
| --- | --- | --- | --- |
| Home (role dashboard) | `/erp/` | D | N |
| My Work | `/erp/my-work/` | L + W | N (reads existing tasks, approvals, activities) |
| Search results | `/erp/search?q=` | L | N |
| Notifications | drawer | L | N (reads each tool's notifications) |
| Profile, theme, standalone apps | user menu | - | W (profile) |

## 8.2 Modules

| Section | Screens (pattern) | State |
| --- | --- | --- |
| Sales & Customers | Customers L/R, Contacts L/R, Leads L/R, Opportunities pipeline board and R, Activities L, Sales reports Rp | W (CRM) |
| | Quotes L/R/F with live preview | W (Finance) |
| | Sales orders L/R/F, Deliveries L/R/F, Pick list M | N |
| Finance | Dashboard D, Invoices, Credit notes, Bills, Expense claims (L/R/F), Banking and reconciliation, Accounting, Budgets, Reports Rp, GST worksheet Rp | W (Finance) |
| | BAS module with lodged-period snapshots | N (Finance Stage 2, outside ERP) |
| Projects & Tasks | Boards and views, My work, Dashboards, Documents, Goals | W (Project Management) |
| | Project costs and budget | W (Company) |
| Products & Engineering | Products L/R/F (tabs: Overview, Variants, Revisions, BOM, Routing, Documents, Where used, Activity, Audit); BOM tree editor and compare; Engineering changes L/R/F/W; Drawings (CAD links) L | N |
| | CAD Automation commands and computers | W (CAD Automation at `/cad/`) |
| Procurement | Suppliers L/R (Finance contact plus ERP profile tab); Requisitions L/R/F/W; RFQs L/R/F with comparison; Purchase orders L/R (Finance document plus Receiving tab); Supplier performance Rp | N (+ W Finance documents) |
| Inventory & Warehouse | Stock on hand L (by product, location, lot); Movements L; Goods receipts L/R/F and M (scan); Transfers L/F and M; Counts L/F and M; Warehouses and locations L/F; Valuation Rp | N |
| Manufacturing | Work orders L/R/F (tabs: Operations, Materials, Output, Quality, Tasks); Planning board (capacity by work centre, drag to reschedule); Work centres L/R; Shop floor M (operations to start, report quantity and scrap) | N |
| Quality | Inspections L/R and M (checklist); Inspection plans L/F; Nonconformances L/R/F/W; Corrective actions L/R | N |
| Assets & Maintenance | Assets L/R/F; Maintenance plans L/F; Maintenance orders L/R/F and M; Work request M; Downtime Rp | N |
| Supply Chain | Shipments L/R/F; Carriers L/F; Delivery schedule (calendar); Returns L/R/F | N |
| Reports & Analytics | Enterprise dashboards D; Company performance Rp; Operational reports Rp; Saved and scheduled reports L | N (+ W Finance, CRM and Project Management reports) |
| Administration | Company, People, Departments, Tools | W (Company) |
| | Sites and branches L/F; Legal entities L/F; Role templates (module matrix); Module access; Approval rules L/F; Numbering; Enterprise audit L | N |

## 8.3 Connected workflows across screens (no re-entry)

| From | Action | Lands on | Data carried |
| --- | --- | --- | --- |
| CRM deal | Start a quote (exists today) | Finance quote editor | customer, deal title and value |
| Finance quote (accepted) | Create sales order | Sales order (confirmed) | customer, lines, prices, tax |
| Sales order | Create work order | Work order (planned) | product, revision, quantity, due date |
| Sales order | Create delivery | Delivery (picking) | lines not yet delivered |
| Delivery | Invoice | Finance invoice (draft) | delivered lines at order prices |
| Requisition (approved) | Create purchase order | Finance purchase order (draft) with ERP receiving tab | supplier, product lines, site |
| Purchase order | Receive | Goods receipt | open lines and quantities |
| Goods receipt line | Inspect | Inspection (incoming) | product, quantity, lot |
| Inspection (failed) | Raise NCR | Nonconformance (draft) | inspection results, quantity |
| Work order | Plan tasks | Project Management board | operations as tasks |
| Product revision | Create drawing (when CAD accepts BIZOMAT accounts) | CAD Automation command, then the revision's documents | code, name, revision for the title block |
