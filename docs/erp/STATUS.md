# BIZOMAT ERP: status by release

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026). A module is Working only when
its acceptance tests pass; nothing is labelled live to look further along than it is. The public statuses are
`src/data/erp-capabilities.ts` and `src/config/systems.ts`; this file is the engineering view behind them.

Updated 15 Nov 2026. Release 1 was merged and deployed on 14 Nov 2026; Release 2 (purchasing and inventory) on
15 Nov 2026 (kevinjogin/bizomat-site#63, deploy run 32, version 85db8c2, migration 0021); Release 3 (manufacturing) on
15 Nov 2026 (kevinjogin/bizomat-site#65, deploy run 33, version 9ce599e, migration 0022). Each migration was applied at
start-up.

Release 4, part B (Maintenance stages M2 and M3) is built and tested on the branch `erp-release-4-maintenance`
(migration 0024) and is **not deployed**: rows marked "(not deployed)" work in that branch only, until it is reviewed,
merged and deployed. Release 4, part A (Quality) is built separately.

## Working

Built, tested and live at `bizomat.ai/erp`, unless marked "(not deployed)".

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
| **Release 3**: Foundations | Production manager and operator roles, the capability matrix for manufacturing, MO, FGR and MRP numbering, manufacturing settings (over-completion tolerance, reserving on release, finished-goods location, MRP horizon), planning data per product, files on routings and orders | `docs/erp/release-3.md`; `apps/work/test/erp-r3.test.ts` (roles, isolation) |
| **Release 3**: Work centres and machines | Capacity calendar, cost rates, status; machines linked read only to Maintenance assets, down while an open breakdown work order exists | Scenario D; machine-down test |
| **Release 3**: Routings | Revisions (draft, released, superseded) released by an engineering approver who did not draft them, copied to a new draft; operations with work centre, machine, times, crew, inspection point, outsourcing and predecessors with overlap | Scenario D; segregation test |
| **Release 3**: Manufacturing orders | From released revisions; materials with the scrap allowance; scheduled operations; estimated cost by element; release with shortages and reservations; amendments with their history; cancel, complete, close | Scenario D; cancel and amendment tests |
| **Release 3**: Execution | Issue, return and scrap materials through StockOps (the last unit cannot be issued twice); predecessors enforced; labour by timer or minutes per person, machine time, output, scrap, rework, downtime; inspection points; finished goods at actual cost, once per key, never beyond the tolerance | Scenario C's last step; Scenario D; concurrency tests (workerd and Node) |
| **Release 3**: Shop floor | A phone screen per work centre: ready and current jobs, progress, shortages, inspections, machines down, planned against actual output; start, timer, report, pause, complete | Shop floor test; Chromium run at phone width |
| **Release 3**: Planning | Master production schedule; MRP level by level with lead times, open orders, reservations, safety stock, reorder points and order sizes, stored with its inputs; make, buy and expedite suggestions converted to draft orders and requisitions; rough-cut capacity | MRP and capacity tests with exact numbers |
| **Release 3**: Job costing | Estimated against actual by element, variances at close, the costing view | Scenario D (exact numbers, workerd and Node) |
| **Release 3**: Reports | Production output, work order progress, material consumption, labour utilisation, production variance, machine downtime, MRP suggestions, capacity load; Operations hub counts | Reports and CSV tests |
| **Release 3**: Example company | Work centres, released routings, an order in progress with labour and an issue, a schedule and an MRP run with suggestions | Example company tests (workerd and Node) |
| **Release 4 Maintenance (not deployed)**: Preventive maintenance | Schedules per asset and templates per asset class; time (from completion or fixed dates), meter and condition triggers; one work order per due occurrence, unique in the database, from the cron, the button and readings; the next due moves on at completion; the calendar | Scenario F; idempotency (cron twice, three runs at once), meter, condition and compliance tests (workerd and Node) |
| **Release 4 Maintenance (not deployed)**: Meters and readings | Meters and gauges with expected ranges and rollover; readings by hand, from a work order or a prestart; backwards only as a reset; life totals | Meter and condition trigger tests |
| **Release 4 Maintenance (not deployed)**: Inspections and prestarts | Inspection templates; inspections on work orders; a failed inspection's follow-up made once; prestart checks on a phone; a failed critical item sets the asset out of service (recorded) and raises a request | Follow-up concurrency test; prestart test; Chromium at 390 |
| **Release 4 Maintenance (not deployed)**: Parts through Inventory | Maintenance stores are ERP warehouses; parts issued and returned through StockOps (`maintenance_issue`, `maintenance_return`); a concurrent last-unit issue refused; technicians issue to their own work orders only; parts cost on the work order; Finance posting recorded as planned | Parts tests (workerd and Node) |
| **Release 4 Maintenance (not deployed)**: Trades, labour costs, downtime, sites, QR | Trades and rates, time entered by hand, labour priced when recorded; downtime; sites with site filters; QR labels and the scan lookup | Scenario F (exact costs); sites test; scan test |
| **Release 4 Maintenance (not deployed)**: Reports | Reliability (MTBF, MTTR, downtime, availability), backlog, PM compliance, breakdown trends, asset costs; drill-down, site and period filters, CSV | Exact-number tests |
| **Release 4 Maintenance (not deployed)**: Example company | A site, rates, a meter with readings, a schedule that made and completed its work order, an inspection with a failed item, a store with a part issued, a breakdown with downtime and a prestart | Example company tests (workerd and Node) |

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
| Production value posted to Finance's ledger (Release 3) | The same, plus work-in-progress, finished-goods, absorption and variance accounts. Each posting is recorded as planned ("Planned: Finance posting, not built yet", which Release 3 also writes for stock); nothing is posted. Options and their risks: `docs/erp/release-3.md`, "Posting to Finance". |
| Job profitability | Sales orders (Release 5): no revenue can be linked to a manufacturing order honestly before them. |
| Sending purchase orders and requests for quotation by email with the PDF | The email outbox has no attachments. They are downloaded, sent by hand and recorded as sent. |

## Planned

| Release | What |
| --- | --- |
| Release 3 | Live: see Working. Posting stock and production value to Finance's ledger waits for the owner's decision (Blocked) |
| Release 4 | Quality (inspections, nonconformances, corrective actions): part A. Maintenance stages M2 and M3: part B, built (not deployed), see Working. Maintenance M4 stays planned: the AI scheduling assistant, workload planning, offline field work, predictive maintenance and IoT feeds; maintenance costs posted to Finance |
| Release 5 | Supply chain (sales orders, deliveries, shipments, returns) and the cross-module analytics and AI listed in `docs/erp/architecture/15-erp-roadmap-2026.md` |

Also planned, not in a numbered release yet: three-way matching against the supplier's own invoice, pick lists, packing
and dispatch, replenishment orders, more than one stock currency, routings in the cost roll-up, sharing the CRM's
product catalogue with the product master; in manufacturing, finite scheduling and a drag-and-drop planning board, work
in progress held as stock in work-in-progress locations, an OEE measure, process (formula and batch) manufacturing and
rate-based repetitive schedules.

## Decisions waiting for the owner

- Email of purchase orders and requests for quotation with the PDF attached needs attachments in the email outbox: a
  change to the email service, not built.
- Stock value postings to Finance: which accounts (inventory, cost of goods, stock adjustments) and when (Release 3).
- Production value postings to Finance (Release 3): which accounts, and which option of `docs/erp/release-3.md`
  ("Posting to Finance"); the recommendation is a side table naming each journal's ERP source, with periodic summaries.
- Whether BIZOMAT Manufacturing and Operations should change from Planned to "Available, some modules planned" now that
  Release 3 is deployed (Procurement, Inventory, Manufacturing and Maintenance's first stage work). It stays
  Planned in `src/config/systems.ts` until the owner says so.
- Existing example companies are not changed: their owners can remove and remake them in Administration to see
  Release 3's example records. Say if they should be offered that more visibly.
- The over-completion tolerance is 0% by default (completing more than the order is refused). Say if another default
  is wanted.
- The app's Permissions-Policy now allows the camera for its own origin (`camera=(self)`), for the warehouse screen;
  the browser still asks each person. Say if it should stay off (typing codes works without it).
- The founder's letter on The Engine Room listed procurement and inventory as planned; one sentence now lists
  manufacturing, quality and supply chain instead. Say if the letter should be worded otherwise. (Release 3 changed that
  sentence to "Quality and supply chain are planned".)
- `src/data/erp-capabilities.ts` keeps "Product classification", "Lifecycle status" and "Product costing" as Planned, as
  the brief asked (only the named features changed), although the product master now records type, category,
  subcategory, family and lifecycle, and bills of materials roll up material cost. Changing them to Live is a one-line
  change each, if wanted.
- Whether a registered company of one person should keep the recorded segregation-of-duties exception (today: yes, as
  for own and example companies).
- Release 4 Maintenance (branch `erp-release-4-maintenance`, migration 0024, additive): merge and deploy. Its own
  decisions are in `docs/maintenance/README.md` ("Decisions to confirm with the owner"): the automatic out-of-service on
  a failed critical prestart item, who may record prestarts and readings, one outstanding preventive work order per
  schedule, how labour rates resolve, parts only from marked stores, and maintenance costs in Finance.
