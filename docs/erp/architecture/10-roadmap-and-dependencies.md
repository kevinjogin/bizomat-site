# 10. Development roadmap and dependencies

Status: proposal for review. Each stage ends with tests, a review by the owner and, only when approved, a release
through the existing deploy workflow. No stage needs a new Fly app, Machine, server or database.

## 10.1 Dependency graph

```mermaid
flowchart LR
  A0[Phase 0: discovery, architecture, UX prototype<br/>this delivery] --> A1
  A1[Stage 1: ERP shell at /erp<br/>mount, navigation, My Work, search,<br/>existing apps inside] --> A2
  A2[Stage 2: Core foundations<br/>sites, legal entities, module access,<br/>role templates, approvals, numbering, audit, outbox] --> B1
  B1[Stage 3: Product master<br/>products, variants, revisions, documents,<br/>CRM and Finance product links] --> B2
  B2[Stage 4: Engineering<br/>BOMs, routings, work centres,<br/>engineering changes, CAD links] --> D1
  A2 --> C1
  B1 --> C1[Stage 5: Procurement and inventory<br/>supplier profiles, requisitions, POs through Finance,<br/>warehouses, receipts, stock moves, valuation journals]
  C1 --> D1[Stage 6: Sales orders and deliveries<br/>from quotes, deliveries, invoicing through Finance,<br/>CRM history]
  B2 --> D2
  C1 --> D2[Stage 7: Manufacturing<br/>work orders, operations, issues and outputs,<br/>WIP journals, Project Management tasks, planning board]
  C1 --> E1[Stage 8: Quality<br/>inspection plans, incoming and in-process inspections,<br/>NCRs, CAPA]
  D2 --> E1
  A2 --> E2[Stage 9: Assets and maintenance]
  D1 --> E3[Stage 10: Supply chain<br/>shipments, carriers, schedule, returns]
  D1 & D2 & E1 --> F1[Stage 11: Enterprise reporting<br/>performance report, operational reports, schedules]
  X1[CAD Automation: Sign in with BIZOMAT<br/>change in kevinjogin/bizomat-cad] --> B3[Generate drawings from ERP]
  B2 --> B3
  Y1[Finance: fin_journals.origin column<br/>and journal service] --> C1
```

## 10.2 Stages

| Stage | Scope | Depends on | Ends with | Not included |
| --- | --- | --- | --- | --- |
| 0 | Discovery, architecture (this folder), UX specification and clickable prototype | none | Owner review and approval | Any production code |
| 1 | `/erp` mount (one more entry in `MOUNTS`, proxy `ERP_PATHS`, website Worker route), ERP route table in the SPA, shell (header, sidebar, breadcrumbs, company selector), role dashboards with widgets fed by existing APIs only, My Work across Project Management, CRM and Finance, global search across them, existing apps opened in the shell, ERP in the website navigation (beside the existing items) | 0 | Release after review; every existing address unchanged | New ERP records |
| 2 | Core: `co_sites`, `co_legal_entities`, `co_module_access`, `co_site_access`, `co_role_templates`, approval engine, ERP numbering, `erp_audit_log`, `erp_events` outbox and processor, Administration screens | 1 | Release | Module data |
| 3 | Product master: products, variants, categories, units, revisions, documents; links from CRM products and Finance lines (additive columns) | 2 | Release; first new ERP data | BOMs |
| 4 | Engineering: BOMs, compare, where-used, routings, work centres, engineering changes with approvals, CAD links by hand | 3 | Release | Generated drawings |
| 5 | Procurement and inventory: supplier profiles, requisitions, RFQs, POs through Finance with product lines, warehouses and locations, goods receipts, stock moves, on hand, transfers, counts, valuation journals (needs `fin_journals.origin` and Inventory, GRNI and WIP accounts) | 2, 3 | Release | Lots and serials (P2 inside the stage if time) |
| 6 | Sales orders and deliveries: from quotes and deals, reservations, picking, deliveries, invoicing through Finance, CRM history | 3, 5 | Release | Shipments |
| 7 | Manufacturing: work orders, release with availability, operations reporting, issues and outputs, WIP journals, tasks in Project Management, planning board, shop floor | 4, 5 | Release | MRP |
| 8 | Quality: inspection plans, incoming inspection with quarantine, in-process and final, NCRs with disposition, CAPA with tasks | 5, 7 | Release | Certificates |
| 9 | Assets and maintenance: register, plans, orders, requests, downtime | 2 (and 5 for parts) | Release | Finance depreciation link (Finance Stage 3) |
| 10 | Supply chain: carriers, shipments, delivery schedule, returns | 6 | Release | Carrier integrations |
| 11 | Enterprise reporting: company performance, operational reports, saved and scheduled reports | 6, 7, 8 | Release | - |
| Parallel | CAD Automation accepts BIZOMAT accounts (in `kevinjogin/bizomat-cad`), then "Generate drawing" in ERP | Access to that repository; the `BIZOMAT_ID_CLIENTS` and CAD client secrets set by the owner | Release of both apps | - |
| Parallel | Finance Stages 2 to 4 of its own brief (BAS module, banking, payroll) | Finance roadmap | Their own releases | - |

## 10.3 Order of value for a small manufacturer

1. Stage 1 gives one place to work and My Work, with no data migration.
2. Stage 3 to 5 replace spreadsheets for products, BOMs, purchasing and stock, the usual first pain.
3. Stage 6 and 7 connect sales to production and delivery.
4. Stage 8 to 11 add control and insight as the company grows.

## 10.4 What can change the order

- If CAD Automation's sign-in lands early, the drawing generation moves into Stage 4.
- A business that only trades (no production) can skip Stage 4 and 7 and still use 5 and 6.
- Measured capacity on the work Machine (section 12) may require the owner to approve more memory before Stage 5
  (stock moves) goes live; the preflight refuses any resize without that approval.
