# BIZOMAT ERP, Release 2: purchasing and inventory

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026), Release 2: sections 4
(procurement) and 5 (inventory and warehouse), 11 (roles and segregation of duties), 12 (audit), 14 (reports), 15
(Release 2) and 16 (Scenarios B and C). Status by release: `docs/erp/STATUS.md`. Release 1 (products, engineering, the
supplier master): `docs/erp/release-1.md`.

Built inside the existing Project Management app (`apps/work`), as Release 1 was: the same Worker and Node server,
database, file store, accounts and session. No new app, Machine, database or sign-in. One additive migration.

| Part | Where |
| --- | --- |
| Migration (additive: 30 new `erp_*` tables, their indexes and two triggers on the new ledger; nothing else changed) | `apps/work/migrations/0021_erp_purchasing_inventory.sql` |
| Server, under `/api/erp` (signed in) | `apps/work/src/worker/erp/`: `settings.ts`, `procurement.ts`, `purchasing.ts`, `record-files.ts`, `stock.ts`, `inventory.ts`, `performance.ts`, `print.ts`, `qr.ts`, `stock-reports.ts` |
| Screens, inside the ERP at `/erp/c/<company>/...` | `apps/work/src/client/system/erp/`: `Purchasing.tsx` (in Procurement), `Inventory.tsx`, `WarehouseScreen.tsx`, `StockReports.tsx`, `ErpSettings.tsx` |
| Example company data | `apps/work/src/worker/system/example.ts` |
| Tests | `apps/work/test/erp-r2.test.ts` (workerd, 13 tests), `apps/work/test-node/erp-r2.test.ts` (Node, 4 tests); Release 1's tests updated where Release 2 replaced a placeholder |

## Foundations added

- **Roles.** Two new ERP roles, Warehouse manager and Warehouse operator, beside Release 1's. Release 1's
  `erp_user_roles` lists its seven roles in a CHECK, which an additive migration cannot widen, so roles given from now
  on are kept in `erp_role_grants` (no CHECK; the code checks the names) and both tables are read together. The
  capability matrix (`access.ts` `CAPABILITIES`):

  | Capability | Roles (ERP administrators may do everything) |
  | --- | --- |
  | `purchasing.view`, `inventory.view` | every role |
  | `requisitions.raise` | engineer, engineering approver, buyer, procurement manager, warehouse manager, warehouse operator |
  | `requisitions.approve`, `purchasing.approve` | procurement manager |
  | `purchasing.edit` (quotations, purchase orders, the draft bill) | buyer, procurement manager |
  | `receiving.post` | warehouse manager, warehouse operator |
  | `inventory.operate` | warehouse manager, warehouse operator |
  | `inventory.approve`, `inventory.setup` | warehouse manager |
  | `settings.manage` | ERP administrators only |

  The buyer orders and the warehouse receives: a buyer cannot receive goods, and an operator cannot order.
- **Segregation of duties**, as in Release 1 (`segregation()`): nobody approves a requisition they raised, a supplier
  choice they made, a purchase order they submitted, an adjustment they asked for or a count they submitted. In a
  company of one the approval is allowed and recorded (`sod_exception`, and the history says so).
- **Numbering** (`erp_sequences`, the same one-statement counter as Release 1): REQ-00001, RFQ-00001, PO-00001,
  GR-00001 (goods receipts), CNT-00001 (counts), ADJ-00001 (adjustments).
- **Settings** (`erp_settings`, Administration, Purchasing and inventory settings; ERP administrators): the purchase
  order approval limit, the adjustment approval threshold, negative stock (off by default), the costing method and the
  stock currency. Not set, the limit and the threshold send everything to a manager.
- **Attachments** on requisitions, requests for quotation, quotations, purchase orders and receipts
  (`erp_record_files`), checked as every upload is.
- **History**: every step writes `erp_events`, shown on each record.

## Procurement

- **Requisitions.** Product or free-text lines (quantity, unit, specification, estimated cost), the requester, a
  department (`co_departments`), a required date, a budget reference (typed, or a Finance budget, project or cost centre
  offered only to people whose Finance role may see budgets) and a reason. Draft, submitted, approved or rejected by a
  procurement manager, converted once a request for quotation or a purchase order is made from it, or cancelled.
- **Requests for quotation.** From an approved requisition or directly; approved suppliers only (pending, held, blocked
  and archived suppliers are refused). Each supplier's copy is a PDF drawn by Finance's document engine
  (`fin/document.ts`, a new kind `rfq`: no prices, two empty columns for the supplier's price and lead time). Each
  supplier's quotation is recorded: unit prices per line, lead time, freight, payment terms, validity, notes and
  documents. The comparison lists them side by side and marks the cheapest (lowest total with freight among complete,
  valid quotations in the request's currency) and the fastest (shortest lead time among them); it exports CSV. A buyer
  selects one with a reason; a procurement manager who did not select it approves the choice.
- **Purchase orders.** Approved suppliers only; made from the approved quotation (its prices, freight as a line, its
  terms), from a requisition (its estimates), or directly. Lines: product or free-text item, specification, quantity
  (three decimals, as Finance), unit price, discount, tax code: the company's Finance purchase tax codes when it runs
  Finance (the supplier's linked workspace, else its only one), else GST or none; priced exactly as Finance prices lines
  (`docLineAmount`, `splitTax`). Statuses: draft, awaiting approval, approved, sent, partly received, received,
  cancelled, closed.
  - **Approval limits.** At submit: a total at or below the limit, in the company's stock currency, is approved at once
    (`within_limit`); above it, in another currency, or with no limit set, it waits for a procurement manager who did not
    submit it (`manager`); in a company of one the submitter's approval is the recorded exception (`solo`). The rule
    and the limit used are stored on the order and in its history.
  - **Amendments.** An approved, sent or partly received order is amended with a reason: the version before is kept in
    `erp_po_revisions` (header and lines as they were), the revision number goes up, and the order goes back to draft and
    through approval. A line's quantity cannot drop below what was received, and a received line cannot be removed or
    change its product. Approved again, it carries on as partly received.
  - **PDF.** Finance's engine, with the company's details (a registered company's legal name, ABN, address, email and
    phone; its Finance template and logo when it runs Finance). A draft or awaiting-approval order prints "DRAFT".
    The editor shows the PDF beside the form as it is typed (Finance's `LivePreview`).
  - **Sending.** The email outbox cannot attach a file, so orders and requests are downloaded and sent from the person's
    own email, then recorded as sent (`sent_via = 'manual'`). The screens say so.
- **Goods receipts.** All or part of an approved order: received, damaged and rejected quantities with reasons
  (accepted = received less damaged and rejected), the location (else the product's usual one), lot numbers, one serial
  number per unit accepted, expiry dates. Products marked "inspection required" are flagged on the line and the receipt;
  inspection screens are Quality (Release 4). Accepted product quantities enter stock in the same transaction as the
  receipt and the order's received quantities. Outstanding = ordered less accepted (damaged and rejected stay
  outstanding until the order is closed).
  - **Idempotent.** The client sends a key with each submission (`request_key`, unique per company): a double click or
    a retry returns the first receipt.
  - **Concurrent receipts.** The order line's CHECK refuses more accepted than ordered, so two people receiving the last
    units at once cannot both succeed: one transaction fails whole (409).
  - **Valued** at the order's net unit price (after discount, before tax). An order in another currency is valued at the
    product's standard cost: no exchange rates are kept.
- **Supplier performance** (`performance.ts`), on the supplier's page and in a report: on time (receipts dated on or
  before the order's required date), in full (orders whose first receipt accepted every line in full with nothing
  damaged or rejected), average lead time (order date to first receipt), and quantities refused. It replaces Release 1's
  "Measured from purchase orders (Release 2)".

## The link to Finance

- **`erp_integration_events`**: company, kind, source record, target, a unique idempotency key, status (pending, done,
  failed, planned), attempts, a short last error (never record content), the target's id and workspace, times.
- **The draft bill.** "Make a draft bill in Finance" on a receipt makes one draft supplier bill through Finance's own
  `createDoc` (with `action: 'draft'`), in the company's Finance business workspace, for the supplier's linked Finance
  contact, by someone with `purchasing.edit` whose Finance role may create bills (`purchases.create`). Lines: what was
  accepted, at the order's prices, discounts and tax codes (mapped to the workspace's own codes). In a workspace not
  registered for GST, the GST the supplier charges on an order priced before GST is a line of its own, so the draft
  comes to what the supplier invoices. Once per receipt: the event row's key is unique; a request claims it by moving
  `attempts` in one compare-and-set statement (a second one at the same moment gets 409, a later one gets the same
  bill); a bill found in Finance with the receipt's reference (after a crash between Finance saving it and the row being
  marked done) is recognised, not made again. No `fin_*` table is written outside Finance's functions.
- **Inventory postings to Finance: planned, not live.** Posting stock value to Finance's ledger would need inventory
  and cost-of-goods accounts and a journal source type that Finance does not have, so nothing is posted. Each stock
  operation that changes value records a `finance.inventory_posting` event with status `planned`, its amount and the
  note "Planned: Finance posting (Release 3)". The valuation screen and the receipt page say so.

## Inventory

- **Warehouses and locations.** A warehouse holds a tree of locations: store, zone, rack, shelf, bin (a level sits
  inside a higher one). Kinds: normal, quarantine, work in progress, finished goods, receiving, dispatch. A location or
  warehouse holding stock cannot be archived or change its kind.
- **Product stock settings** (`erp_product_stock`): lot, serial and expiry tracking (lot and serial only while the
  product has no stock), inspection on receipt, reorder point, minimum, maximum, usual location.
- **Stock** (`erp_stock`): on hand and reserved per product, location, lot and serial (available = on hand less
  reserved; quarantine is not available), expiry, on order (open orders less accepted), value. Services are never
  stocked. A serial number is one unit, and a unique index keeps it in one place.
- **The movement ledger** (`erp_stock_moves`): one row per change with its type, quantity, reservation change, unit
  cost, value, source document, reference, reason, who and when. Append-only: triggers refuse any change to a
  movement (only `created_by` may be cleared when an account is deleted) and any deletion, except when the whole
  company is being removed (the example company, on request), which writes `erp_purges` first in the same transaction.
- **Operations** (`stock.ts` `StockOps`, one transaction each): receipt, issue, transfer, reservation and release (and
  issue against a reservation), adjustment, customer return, return to supplier, count variance, quarantine and release,
  scrap. Each stock row is made if missing (all zero) and then updated by the change, so its CHECK applies: while
  negative stock is off, on hand never goes below zero and reservations never exceed it. Two issues of the last unit at
  the same moment cannot both succeed (tested on workerd and on Node). Allowing negative stock is a company setting;
  turning it off again is refused while any stock is below zero.
- **Adjustments** need a reason; one worth more than the threshold waits for a warehouse manager who did not ask for it.
  Scrap over the threshold needs a warehouse manager.
- **Counts.** A stocktake (a warehouse) or cycle count (a location and what is inside it) lists every stock record there
  with the quantity at that moment; found stock can be added. Counts are entered (on a computer or the phone screen),
  submitted when every line is counted, and approved by a warehouse manager who did not submit them: each variance
  (counted less expected) posts as a movement, in one transaction, once (`erp_done`). Lines where stock moved since the
  count was opened are marked: variances are against the quantity when it was opened, so count when nothing moves.
- **Valuation.** Weighted average or first in, first out, chosen before the first movement and then locked (if none was
  chosen, the first movement locks weighted average). Weighted average values an issue inside the transaction from the
  quantity and value held at that moment, and the last unit takes the last cent. FIFO keeps cost layers
  (`erp_cost_layers`); an issue takes the oldest first with guarded updates, so a concurrent issue of the same layer
  fails whole instead of being valued twice. With negative stock allowed, an issue beyond the layers is valued at the
  last known cost and the layers are not back-filled. A warehouse's value is its quantity at the product's average.
- **Traceability.** From a lot or serial number: the supplier, purchase order and receipt it came in on, every later
  movement, and where it is now.
- **QR codes** (`qr.ts`): made on the server as SVG, no third-party service and no library: byte mode, error correction
  M, versions 1 to 10 (213 bytes), the mask chosen by the standard's penalty rules. Every mask of ten texts (versions 1
  to 10) was compared with python-qrcode's matrices (80 of 80 identical); a test pins one of them. Locations carry
  `LOC:WAREHOUSE/CODE`, products their number. A warehouse's page prints every location's label.
- **The warehouse screen** (Inventory, Warehouse screen; made for a phone): Receive (against an open order, one line at
  a time), Issue, Move and Count, by typing codes, or reading them with the camera where the browser has
  BarcodeDetector and the person allows it. The app's Permissions-Policy now allows the camera for this origin only
  (`camera=(self)`, `apps/work/src/worker/app.ts`); the browser still asks. Each submission carries its own key.
- **BOM availability.** The structure shows each component's available stock; the explosion takes a build quantity and
  shows required, available and a shortage flag per line (also counting a component used on several lines), with CSV.

## Screens

- Procurement: Suppliers, Requisitions, Quotations, Purchase orders, Receipts. Inventory: Stock (by product, or by
  location, lot and serial), Warehouses (location tree, QR labels), Movements, Adjustments, Counts, Valuation, Warehouse
  screen, and each product's stock page (where it is, reservations, actions, settings, recent movements). Lists have
  search, filters, sort, paging and CSV; detail pages have related records, documents and history; empty states and
  phone layouts throughout.
- Operations stays the hub: it shows what waits in the company (requisitions, supplier choices and orders to approve,
  orders to receive, products to reorder, adjustments and counts to approve), then the modules with their status. The
  rail is unchanged; Procurement and Inventory are in the company's side menu.

## Reports

Purchase commitments, supplier spend, purchase price variance, supplier delivery performance, stock on hand, stock
valuation, stock movements, stock ageing (with lots expiring within 30 days), slow-moving stock, shortages. Each takes
date, status, supplier or warehouse filters as fits it, links every row to its record and exports CSV.

## Example company

New example companies also get: purchase order approval up to 2,000 dollars, a warehouse with a location tree
(including quarantine, receiving and dispatch), stock settings, two more approved suppliers, an approved requisition, a
request for quotation to two suppliers with both quotations recorded (left open to compare and select), and a purchase
order for 40 bracket arms, approved within the limit, recorded as sent and received into stock. Existing example
companies are not changed. Removing the example company removes these records too.

## Tests

- **Scenario B** (requisition to stock to draft bill): roles and refusals at each step; approved suppliers only; RFQ
  and preview PDFs; the comparison's totals and marks; selection with a reason and its approval; the order from the
  quotation (lines, freight, terms, totals worked by hand); approval over the limit by a manager; partial and replayed
  receipts, over-receipt refused, damaged quantities, lots, the inspection flag; on order and values; the planned
  Finance posting; supplier performance; the draft bill refused without a Finance link or role, made once, the same
  bill on a second request, and one bill for two simultaneous requests.
- **Scenario C** (warehouse): adjustments with the threshold and segregation, transfer, reservation and issue against
  it, quarantine and release, scrap, customer and supplier returns, a stocktake with a variance approved by another
  warehouse manager (a second approval refused), weighted average values, traceability, the ledger refusing UPDATE and
  DELETE, the costing method locked, QR SVG, the scan lookup, shortages.
- Valuation: weighted average to the last cent; FIFO across three layers. Stock never negative: an issue beyond stock,
  two simultaneous issues of the last unit (exactly one), an empty location, negative stock allowed and the setting
  refused while stock is negative, a reservation beyond stock. Approval limits (no limit, within, above, other
  currency, a manager's own order, a pending supplier, the solo exception). Amendment history. Concurrent receipts and
  unique serial numbers. Isolation (another company's records, ids and links: 404; the database refuses a cross-company
  stock row), roles, numbering under concurrency, list paging and search, CSV headers of every list and report, BOM
  availability, the QR encoder against a reference symbol, the example company and its removal.
- Node (`test-node/erp-r2.test.ts`): migration 0021 only creates `erp_` tables, indexes and the two ledger triggers and
  leaves every earlier table as it was; a replayed and a concurrent receipt, FIFO, the last unit issued twice at once,
  the ledger triggers on node:sqlite; the example company's draft bill made once for three simultaneous requests.

## Known limits

- Orders and requests for quotation are not emailed with their PDF: the outbox has no attachments.
- Stock value is not posted to Finance's ledger (above).
- Three-way matching against the supplier's own invoice is not built: the receipt and its draft bill are linked.
- A count's variances are against the quantities when it was opened.
- Stock is valued in one currency; goods bought in another are valued at standard cost.
- Pick lists, packing, dispatch and replenishment orders are not built; reorder points, minimums and the shortages report
  are.
- The camera reading depends on the browser (BarcodeDetector is not in every browser); typing always works. It was
  not tried on a real phone camera here.
