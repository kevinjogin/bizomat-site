# BIZOMAT ERP: status by release

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026). A module is Working only when
its acceptance tests pass; nothing is labelled live to look further along than it is. The public statuses are
`src/data/erp-capabilities.ts` and `src/config/systems.ts`; this file is the engineering view behind them.

Updated 15 Nov 2026. Release 1 was merged and deployed on 14 Nov 2026, Release 2 (purchasing and inventory) on
15 Nov 2026 (kevinjogin/bizomat-site#63, deploy run 32, version 85db8c2, migration 0021 applied at start-up).

## Working

Built, tested and live at `bizomat.ai/erp`.

| Area | What | Evidence |
| --- | --- | --- |
| ERP workspace | Module rail, company switcher, dashboard by company, My Work, Reports hub, Administration, own company per person, example company, platform console | `docs/system/README.md`, `apps/work/test/system.test.ts`, `example-company.test.ts` |
| Sales and CRM, Finance and Accounting, Projects and Tasks, Company accounts | Each tool inside the ERP, with the links between them | `docs/crm/`, `docs/finance/`, `docs/company/` and their tests |
| Maintenance, Stage M1 | Asset register and hierarchy, requests with approval, work orders, labour timer, files | `docs/maintenance/README.md`, `apps/work/test/maintenance.test.ts` |
| CAD Automation set-up | The set-up steps in Products and Engineering | `apps/cad/CLAUDE.md` |
| **Release 1**: ERP foundations | Per-company numbering, the ERP history with before and after values, ERP roles (several per person) with the capability matrix, segregation of duties with the recorded one-person exception, ERP roles screen | `docs/erp/release-1.md`; `apps/work/test/erp.test.ts` (roles, numbering, isolation) |
| **Release 1**: Product master | Products with every master field, variants, lifecycle and effective dates, images and attachments, product suppliers, list with search, filters, sort, paging and CSV | Scenario A; lists and CSV tests |
| **Release 1**: Revisions and change control | Revisions (draft, in a change order, released, superseded), change requests, change orders with approval and release by someone other than the drafter, release in one transaction, a concurrent release refused | Scenario A; segregation and concurrent-release tests (workerd and Node) |
| **Release 1**: Bills of materials | Multi-level lines, loops refused, structure, explosion with CSV, where-used, revision comparison, cost roll-up with missing costs and currencies flagged | Scenario A; roll-up, loop, effective-date tests |
| **Release 1**: Engineering documents | Versions as files or CAD references, approval, DXF and STEP checked and downloaded only | Documents test; Node STEP test |
| **Release 1**: Supplier master | Suppliers with approval, hold and block, ABN format check, contacts, documents, products supplied, link to Finance's supplier (refused without a Finance role) | Supplier lifecycle and Finance link tests |
| **Release 1**: Reports | Product catalogue, lifecycle, bill of materials cost, where-used, revisions and changes, supplier list; drill-down and CSV | Reports and CSV test |
| **Release 1**: Example company | A kit with a released two-level bill of materials, a draft change order, a CAD reference, two suppliers (one approved) | Example company test |
| **Release 2**: Foundations | Warehouse manager and operator roles, the capability matrix for purchasing and inventory, REQ, RFQ, PO, GR, CNT and ADJ numbering, purchasing and inventory settings, attachments on purchasing records | `docs/erp/release-2.md`; `apps/work/test/erp-r2.test.ts` (roles, numbering, isolation) |
| **Release 2**: Requisitions | Product or free-text lines, department, required date, budget reference, reason; approval by a procurement manager who did not raise them | Scenario B |
| **Release 2**: Requests for quotation and the comparison | Approved suppliers only, a PDF per supplier, sent by hand and recorded, quotations with prices, lead time, freight, terms, validity and documents, cheapest and fastest marked, selection with a reason and its approval | Scenario B |
| **Release 2**: Purchase orders | Approved suppliers, from a quotation, a requisition or directly, Finance tax codes, approval limits with the rule recorded, segregation, amendments with their history, PDF with live preview, sent by hand and recorded, cancel and close | Scenario B; approval-limit and amendment tests |
| **Release 2**: Goods receipts | Partial receipts, damaged and rejected with reasons, lots, serials, expiry, inspection flag, stock in the same transaction, idempotent, concurrent receipts of the last units refused | Scenario B; concurrency tests (workerd and Node) |
| **Release 2**: Supplier performance | On time, in full, lead time and refused quantities from receipts | Scenario B; supplier delivery report |
| **Release 2**: Draft bill in Finance | One draft supplier bill per receipt through Finance's own `createDoc`, by someone whose Finance role may create bills; made once under repeated and simultaneous requests | Scenario B; Node test |
| **Release 2**: Inventory and warehouse | Warehouses and a location tree, stock by product, location, lot and serial, the append-only ledger, issue, transfer, reservations, quarantine, returns, scrap, adjustments with approval, stocktakes and cycle counts, traceability, never below zero (a concurrent last-unit issue refused) | Scenario C; stock and concurrency tests (workerd and Node) |
| **Release 2**: Valuation | Weighted average and FIFO, chosen once and locked, valuation screen and report | Valuation tests (workerd and Node) |
| **Release 2**: QR labels and the warehouse screen | QR SVG made on the server, label sheets, the scan lookup, a phone screen to receive, issue, move and count by typed codes, the camera where the browser can read codes | QR reference test; scan lookup test; Chromium run at phone width (typed codes) |
| **Release 2**: Availability in bills of materials | Available stock per component, required and shortages for a build quantity | BOM availability test |
| **Release 2**: Reports | Purchase commitments, supplier spend, price variance, supplier delivery, stock on hand, valuation, movements, ageing, slow-moving, shortages; filters and CSV | Reports and CSV tests |
| **Release 2**: Example company | A warehouse with locations, stock received from a purchase order, a requisition, a request for quotation with two quotations | Example company tests (workerd and Node) |

## In development

| What | Where it stands |
| --- | --- |
| CAD computers and jobs in the ERP | The ERP side is built; CAD Automation does not report yet. |
| Sign in with BIZOMAT for CAD Automation | Built in both repositories; not switched on. |

## Blocked

| What | Blocked by |
| --- | --- |
| Drawings generated from an ERP product | Sign in with BIZOMAT in CAD Automation (above). Engineering documents can reference a CAD file today. |
| Stock value posted to Finance's ledger | Finance has no inventory or cost-of-goods accounts or journal source for it. Release 2 records each posting as "Planned: Finance posting (Release 3)" and posts nothing. |
| Sending purchase orders and requests for quotation by email with the PDF | The email outbox has no attachments. They are downloaded, sent by hand and recorded as sent. |

## Planned

| Release | What |
| --- | --- |
| Release 3 | Manufacturing: routings and work centres, production orders, a planning board, shop-floor reporting; posting stock value to Finance's ledger |
| Release 4 | Quality (inspections, nonconformances, corrective actions) and the later Maintenance stages (M2 to M4) |
| Release 5 | Supply chain (sales orders, deliveries, shipments, returns) and the cross-module analytics and AI listed in `docs/erp/architecture/15-erp-roadmap-2026.md` |

Also planned, not in a numbered release yet: three-way matching against the supplier's own invoice, pick lists, packing
and dispatch, replenishment orders, more than one stock currency, routings in the cost roll-up, sharing the CRM's
product catalogue with the product master.

## Decisions waiting for the owner

- Email of purchase orders and requests for quotation with the PDF attached needs attachments in the email outbox: a
  change to the email service, not built.
- Stock value postings to Finance: which accounts (inventory, cost of goods, stock adjustments) and when (Release 3).
- The app's Permissions-Policy now allows the camera for its own origin (`camera=(self)`), for the warehouse screen;
  the browser still asks each person. Say if it should stay off (typing codes works without it).
- The founder's letter on The Engine Room listed procurement and inventory as planned; one sentence now lists
  manufacturing, quality and supply chain instead. Say if the letter should be worded otherwise.
- `src/data/erp-capabilities.ts` keeps "Product classification", "Lifecycle status" and "Product costing" as Planned, as
  the brief asked (only the named features changed), although the product master now records type, category,
  subcategory, family and lifecycle, and bills of materials roll up material cost. Changing them to Live is a one-line
  change each, if wanted.
- Whether a registered company of one person should keep the recorded segregation-of-duties exception (today: yes, as
  for own and example companies).
