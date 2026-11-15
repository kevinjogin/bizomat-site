# BIZOMAT ERP: status by release

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026). A module is Working only when
its acceptance tests pass; nothing is labelled live to look further along than it is. The public statuses are
`src/data/erp-capabilities.ts` and `src/config/systems.ts`; this file is the engineering view behind them.

Updated 15 Nov 2026. Release 1 was merged and deployed on 14 Nov 2026; Release 2 (purchasing and inventory) on
15 Nov 2026 (kevinjogin/bizomat-site#63, deploy run 32, version 85db8c2, migration 0021); Release 3 (manufacturing) on
15 Nov 2026 (kevinjogin/bizomat-site#65, deploy run 33, version 9ce599e, migration 0022); Release 4 part A (quality) on
15 Nov 2026 (kevinjogin/bizomat-site#67, deploy run 34, version 930cd57, migration 0023) and part B (Maintenance stages M2
and M3) on 15 Nov 2026 (kevinjogin/bizomat-site#68, deploy run 35, version 41848e4, migration 0024). Each migration was
applied at start-up. Release 5 part A (supply chain and logistics) on 15 Nov 2026 (kevinjogin/bizomat-site#70, deploy run 36, version 7feb60f,
migration 0025).

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
| **Release 4 Quality**: Quality foundations | Quality manager and inspector roles, the capability matrix for quality, segregation of duties on corrective actions with the recorded one-person exception, QP, QI, NCR and CA numbering, files on plans, inspections, characteristics, NCRs and actions | `docs/erp/release-4-quality.md`; `apps/work/test/erp-r4-quality.test.ts` (roles, isolation, segregation) |
| **Release 4 Quality**: Inspection plans | Versions (draft, released, superseded) released by a quality manager; incoming, first article, in-process, final, supplier and product plans for a product, revision, supplier or routing operation; dimensions and measured values with limits, attributes, visual checks, samples and photos | Scenario E; plan version test |
| **Release 4 Quality**: Inspections | Offered from goods receipt lines needing inspection, inspection points and finished goods with a final plan, or made by hand; the best released plan copied on; readings per characteristic and sample checked against the limits on the server; result worked out; completed once; a full inspection records a Release 3 inspection point's result | Scenario E; in-process and final test; concurrency test (workerd and Node) |
| **Release 4 Quality**: Quarantine and release | A failed lot into quarantine through StockOps in the same step or later, once per key; accepted on condition by a quality manager and released, never more than was quarantined | Quarantine and release test; CHECK tests (workerd and Node) |
| **Release 4 Quality**: Nonconformance | NCRs from inspections or by hand (a Maintenance asset read only), containment, five whys or free text, a disposition decided once, carried out through StockOps (scrap, return to supplier, release) or as a rework note, once per key and never beyond the decision, verification and closure | Scenario E; disposition concurrency tests (workerd and Node) |
| **Release 4 Quality**: Corrective and preventive actions | Responsible person, due date, evidence; approval and closure with segregation of duties; effectiveness check; overdue actions on the Quality overview (My Work has no place for ERP records) | Scenario E; segregation test |
| **Release 4 Quality**: Traceability | A lot's or serial's inspections and NCRs in its trace | Scenario E |
| **Release 4 Quality**: Reports | Inspection results, rejection rates by product and supplier, supplier defects (also on the supplier page, read only), NCR register and ageing, corrective actions and overdue, rework, cost of poor quality from scrap and rework records; Operations hub counts | Reports with exact numbers and CSV (workerd and Node) |
| **Release 4 Quality**: Example company | A released incoming plan, a failed inspection, an NCR with containment and root cause, a corrective action in progress | Example company tests (workerd and Node) |
| **Release 4 Maintenance**: Preventive maintenance | Schedules per asset and templates per asset class; time (from completion or fixed dates), meter and condition triggers; one work order per due occurrence, unique in the database, from the cron, the button and readings; the next due moves on at completion; the calendar | Scenario F; idempotency (cron twice, three runs at once), meter, condition and compliance tests (workerd and Node) |
| **Release 4 Maintenance**: Meters and readings | Meters and gauges with expected ranges and rollover; readings by hand, from a work order or a prestart; backwards only as a reset; life totals | Meter and condition trigger tests |
| **Release 4 Maintenance**: Inspections and prestarts | Inspection templates; inspections on work orders; a failed inspection's follow-up made once; prestart checks on a phone; a failed critical item sets the asset out of service (recorded) and raises a request | Follow-up concurrency test; prestart test; Chromium at 390 |
| **Release 4 Maintenance**: Parts through Inventory | Maintenance stores are ERP warehouses; parts issued and returned through StockOps (`maintenance_issue`, `maintenance_return`); a concurrent last-unit issue refused; technicians issue to their own work orders only; parts cost on the work order; Finance posting recorded as planned | Parts tests (workerd and Node) |
| **Release 4 Maintenance**: Trades, labour costs, downtime, sites, QR | Trades and rates, time entered by hand, labour priced when recorded; downtime; sites with site filters; QR labels and the scan lookup | Scenario F (exact costs); sites test; scan test |
| **Release 4 Maintenance**: Reports | Reliability (MTBF, MTTR, downtime, availability), backlog, PM compliance, breakdown trends, asset costs; drill-down, site and period filters, CSV | Exact-number tests |
| **Release 4 Maintenance**: Example company | A site, rates, a meter with readings, a schedule that made and completed its work order, an inspection with a failed item, a store with a part issued, a breakdown with downtime and a prestart | Example company tests (workerd and Node) |
| **Release 5 Supply chain**: foundations | Sales manager role, the capability matrix for sales, shipping and returns, SO, SHP and RMA numbering, files on orders, shipments, returns and proof of delivery, history | `docs/erp/release-5-supply-chain.md`; `apps/work/test/erp-r5-supply-chain.test.ts` (roles, isolation) |
| **Release 5 Supply chain**: sales orders | For the company's one customer record (a CRM company and its Finance customer, nothing copied), priced as Finance prices lines, dates, delivery address, shipping terms, customer order number; statuses worked out from the lines; amendments with their history; cancel and close; a draft order from a won CRM deal, once | Scenario G; amendment, cancel and won-deal tests |
| **Release 5 Supply chain**: allocation and make to order | Stock reserved through StockOps soonest expiry first, then oldest, outside quarantine, once per key; allocated reservations protected in Inventory; a manufacturing order from a line, linked both ways | Scenario G |
| **Release 5 Supply chain**: MRP demand | Confirmed orders' outstanding, unallocated quantities as demand, at the promised or requested date | MRP test with exact numbers |
| **Release 5 Supply chain**: job profitability | A made-to-order manufacturing order's revenue (the line before tax, for the quantity made) against its actual cost, in the costing view and a report | Scenario G (exact numbers, workerd and Node) |
| **Release 5 Supply chain**: shipping | Carriers with a tracking address; shipments with a pick list (soonest expiry, then oldest), packages, dispatch through StockOps (`sales_dispatch`, once per shipment, a concurrent last unit refused), delivery with a photo, document or drawn signature; the delivery schedule; an optional dispatch email through the outbox (never for the example company) | Scenario G; concurrency tests (workerd and Node); Chromium at 390 |
| **Release 5 Supply chain**: draft invoice in Finance | One draft invoice per shipment through Finance's own `createDoc`, with freight as a line, by someone whose Finance role may create invoices; made once under repeated and simultaneous requests; a failure recorded and retried | Scenario G; failed-integration retry test; Node test |
| **Release 5 Supply chain**: returns | Raised up to what was shipped, authorised by a sales manager, received through StockOps (`customer_return`, optionally into quarantine) at the dispatched cost, linked to a Quality inspection or NCR, one draft credit note through Finance's `createCredit` | Scenario G |
| **Release 5 Supply chain**: traceability and reports | A lot's trace to the shipment and customer; open orders, delivery to customers, shipments by carrier, freight, returns, sales by product and customer, job profitability; drill-down and CSV; Supply Chain overview and Operations counts | Reports with exact numbers and CSV |
| **Release 5 Supply chain**: example company | A carrier, a sales order with a made-to-order line, a delivered shipment with its draft invoice, a return with its draft credit note; no email | Example company tests (workerd and Node) |

## BIZOMAT WHS, Release 1 (not deployed)

Built and tested on the branch `whs-release-1` (migration 0026); not merged or deployed. Details, sources checked and
decisions: `docs/whs/README.md`. Every legal pack is Not verified until a platform administrator verifies it in the
application; BIZOMAT does not submit notifications to regulators.

| Area | What | Evidence |
| --- | --- | --- |
| Placement | "Health and Safety" in the rail, `/erp/c/<company>/whs`, `/erp/whs` to the company used last; dashboard card, My Work, Reports, Administration (WHS roles) | `apps/work/test/whs-core.test.ts` |
| Roles and access | WHS manager, WHS officer or supervisor, investigator, health and safety representative, health officer (the only role that reads medical details); everyone reports and sees their own; other companies 404; confidential psychosocial reports | Roles test; Test 12 (health and confidential reports); Test 13 (other companies) |
| Jurisdiction engine | Platform packs, typed instruments, versioned effective-dated rules applied only when active, verified and in effect; sites to jurisdictions; never another jurisdiction's rules; draft, review, activation and verification by platform admins | Tests 3 and 11; legal workflow and effective-date tests |
| Hazards and risk assessments | Hazard register and workflow; twelve kinds of assessment on a configurable matrix (5 by 5 by default, versioned), hierarchy of controls with its warning, approval with segregation, reviews and revisions, heat maps | Test 1; matrix test; Node hazard test |
| Incidents and investigations | Workflow from report to closure, serious-incident alerts (in the app and by email, never for the example company), tracked changes after classification, never deleted; investigations with five whys and fishbone, approval with segregation | Test 2; Test 14 (reporting from a phone); edit history test (workerd and Node) |
| Regulator notification record | Flag and due time only from a verified rule in effect; a person's decision with reasons; checklist; the submission with its reference and confirmation, then frozen | Test 3 (workerd and Node) |
| Actions register | Evidence required before completion, verification by someone else, closure, overdue escalation by the 15-minute run | Evidence refusal and escalation tests |
| Dashboard | Real counts with filters, monthly trends, sites and departments; injury rates only with hours worked entered | Escalation, My Work and rates test |
| Example company | NSW site, a hazard through assessment, a JSA with controls, a near miss and an injury with an investigation, actions, an example notification record; no email | Example company tests (workerd and Node) |

Planned: inspections and audits, documents and SWMS acknowledgement, permits, contractors and visitors, training,
chemicals, plant safety, PPE, emergency management, consultation, health surveillance, the compliance register,
electronic submission to regulators and verified legal content.

## In development

| What | Where it stands |
| --- | --- |
| CAD computers and jobs in the ERP | The ERP side is built; CAD Automation does not report yet. |
| Sign in with BIZOMAT for CAD Automation | Built in both repositories; not switched on. |

## Blocked

| What | Blocked by |
| --- | --- |
| Drawings generated from an ERP product | Sign in with BIZOMAT in CAD Automation (above). Engineering documents can reference a CAD file today. |
| Stock value posted to Finance's ledger | Finance has no inventory or cost-of-goods accounts or journal source for it. Release 2 records each posting as "Planned: Finance posting (Release 3)" and posts nothing; Release 5's dispatches and customer returns record theirs the same way. |
| Production value posted to Finance's ledger (Release 3) | The same, plus work-in-progress, finished-goods, absorption and variance accounts. Each posting is recorded as planned ("Planned: Finance posting, not built yet", which Release 3 also writes for stock); nothing is posted. Options and their risks: `docs/erp/release-3.md`, "Posting to Finance". |
| Sending purchase orders and requests for quotation by email with the PDF | The email outbox has no attachments. They are downloaded, sent by hand and recorded as sent. |

## Planned

| Release | What |
| --- | --- |
| Release 3 | Live: see Working. Posting stock and production value to Finance's ledger waits for the owner's decision (Blocked) |
| Release 4 | Part A, quality: live, see Working; statistical process control, calibration, quality audits, product compliance and the appraisal and external failure costs of poor quality stay planned. Part B, Maintenance stages M2 and M3: live, see Working; Maintenance M4 stays planned: the AI scheduling assistant, workload planning, offline field work, predictive maintenance and IoT feeds, and maintenance costs posted to Finance |
| Release 5 | Part A, supply chain and logistics: live, see Working. Still planned: bookings and labels in carriers' own systems, landed costs, demand forecasting and inventory optimisation, automatic backorder allocation, transfers between sites, distribution planning, service lines on sales orders, posting the value of stock sold to Finance's ledger, and the cross-module analytics and AI listed in `docs/erp/architecture/15-erp-roadmap-2026.md` |

Also planned, not in a numbered release yet: three-way matching against the supplier's own invoice, replenishment
orders, more than one stock currency, routings in the cost roll-up, sharing the CRM's
product catalogue with the product master; in manufacturing, finite scheduling and a drag-and-drop planning board, work
in progress held as stock in work-in-progress locations, an OEE measure, process (formula and batch) manufacturing and
rate-based repetitive schedules.

## Decisions waiting for the owner

- Email of purchase orders and requests for quotation with the PDF attached needs attachments in the email outbox: a
  change to the email service, not built.
- Stock value postings to Finance: which accounts (inventory, cost of goods, stock adjustments) and when (Release 3).
- Production value postings to Finance (Release 3): which accounts, and which option of `docs/erp/release-3.md`
  ("Posting to Finance"); the recommendation is a side table naming each journal's ERP source, with periodic summaries.
- BIZOMAT Manufacturing and Operations: the owner asked (15 Nov 2026) for it to turn green once every tool works.
  With Release 5 part A it is Available in `src/config/systems.ts` on the Release 5 branch, so the website says so only
  once that branch is deployed; the status note lists what stays planned.
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
- Release 4 part A: rework under an NCR is a rework note, not a draft manufacturing order (an order would issue new
  materials). Say if a rework order type is wanted; it would need its own design.
- Release 4 part A: overdue corrective actions show on the Quality overview, not in My Work, which lists Projects and
  Tasks items only. Showing ERP actions in My Work would change Projects and Tasks: say if wanted.
- Release 4 part A: closing a nonconformance has no segregation of duties (a quality manager closes it); corrective
  actions do. Say if the person who decided the disposition should not also close it.
- Release 4 part A: the founder's letter on The Engine Room now says "Supply chain is planned", and its Maintenance
  card lists quality beside procurement, inventory and manufacturing. Say if the letter should be worded otherwise.
- Release 4 Maintenance: its own decisions are in `docs/maintenance/README.md` ("Decisions to confirm with the owner"): the automatic out-of-service on
  a failed critical prestart item, who may record prestarts and readings, one outstanding preventive work order per
  schedule, how labour rates resolve, parts only from marked stores, and maintenance costs in Finance.
- Release 5 part A: the dispatch email is sent only where email is set up on the service; say whether it is in
  production. The shipment screen says when it cannot be sent.
- Release 5 part A: the founder's letter on The Engine Room now names posting stock, production and maintenance costs
  to Finance's ledger as what is planned (it said supply chain), and its Maintenance card lists supply chain beside the
  other modules. Say if the letter should be worded otherwise.
- Release 5 part A: one draft invoice per shipment (what was shipped, at the order's prices, with the freight charge),
  and a credit note linked to that invoice only once the invoice is approved. Say if invoicing per order, or on
  delivery instead of dispatch, is wanted.
- Release 5 part A: sales orders take products only. Service lines (installation, freight as its own product) would
  need a product type or Finance items on the order: say if wanted.
- Release 5 part A: existing example companies are not changed; removing and remaking one adds the supply chain records.
- BIZOMAT WHS (not deployed): its decisions are in `docs/whs/README.md` ("Decisions for the owner"): who reads medical
  details and confidential reports, hours worked for injury rates, Health and Safety in My Work and in the rail, and who
  verifies the legal packs.
