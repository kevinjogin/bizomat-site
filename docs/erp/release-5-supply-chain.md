# BIZOMAT ERP, Release 5 part A: supply chain and logistics

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026), Release 5: supply chain and
logistics (sales orders, allocation, make to order, picking, packing, shipments, dispatch, delivery, returns, the
Finance invoice), its reports, and Scenario G ("complete a customer order, manufacture or allocate stock, dispatch,
make the Finance invoice"). Owner, 15 Nov 2026: "work on Supply chain and once all tools are ready then make this
green" (BIZOMAT Manufacturing and Operations on the website). Status by release: `docs/erp/STATUS.md`. Earlier
releases: `release-1.md` (products, engineering, suppliers), `release-2.md` (purchasing and inventory), `release-3.md`
(manufacturing), `release-4-quality.md` (quality); Maintenance M2 and M3 in `docs/maintenance/README.md`.

Built on the branch `erp-release-5-supply-chain`, inside the existing Project Management app (`apps/work`), as the
earlier releases were: the same Worker and Node server, database, file store, email outbox, accounts and session. No
new app, Machine, database, service, dependency or sign-in. One additive migration. Not deployed: production has it
only once it is reviewed, merged and deployed.

| Part | Where |
| --- | --- |
| Migration (additive: 12 new `erp_*` tables and their indexes; no trigger, no change to an earlier table) | `apps/work/migrations/0025_erp_supply_chain.sql` |
| Server, under `/api/erp` (signed in) | `apps/work/src/worker/erp/`: `sales.ts` (sales orders, amendments, from a won deal, allocation, make to order), `logistics.ts` (carriers, shipments, pick, pack, dispatch, delivery, the delivery schedule, the draft invoice), `returns.ts` (returns, receipt, the Quality link, the draft credit note), `supply-reports.ts` (seven reports, the hub) |
| Changed for it | `access.ts` (the sales manager role, capabilities), `util.ts` (numbering, history kinds), `stock.ts` (`sales_dispatch`, sources), `production.ts` (`createMo` links, job profitability), `planning.ts` (sales order demand in MRP), `inventory.ts` (allocated reservations, traceability to the delivery), `record-files.ts` (files on orders, shipments, proof of delivery, returns), `mfg-reports.ts` (its note), `index.ts` (routes, Operations counts); `services/email/templates.ts` (the `erp_dispatch` email); `system/example.ts` (example records) |
| Screens, inside the ERP at `/erp/c/<company>/supply-chain` | `apps/work/src/client/system/erp/`: `SupplyChain.tsx` (overview, sales orders, pick and dispatch, shipments, delivery schedule, returns, carriers), `SupplyReports.tsx`; `Manufacturing.tsx` (made for, job profitability), `Inventory.tsx` (where it went), `WarehouseScreen.tsx` (link); `SystemApp.tsx` (routes, side menu, Operations card and counts, reports), `SuiteRail.tsx`, `styles/erp.css` |
| Tests | `apps/work/test/erp-r5-supply-chain.test.ts` (workerd, 6 tests), `apps/work/test-node/erp-r5-supply-chain.test.ts` (Node, 5 tests); earlier expectations updated (below) |

## Foundations added

- **Role.** Sales manager, kept in `erp_role_grants`. Capabilities (`access.ts` `CAPABILITIES`; ERP administrators may
  do everything; refusals name the roles that may):

  | Capability | Roles |
  | --- | --- |
  | `sales.view` | every ERP reader |
  | `sales.edit`, `sales.confirm`, `returns.authorise` | sales manager |
  | `sales.allocate` | sales manager, warehouse manager, warehouse operator |
  | `shipping.plan`, `carriers.setup`, `returns.raise` | sales manager, warehouse manager |
  | `shipping.pick`, `shipping.pack`, `shipping.dispatch`, `returns.receive` | warehouse manager, warehouse operator |
  | `shipping.deliver` | warehouse manager, warehouse operator, sales manager |
  | make to order | `production.plan` (production manager), as for any manufacturing order |

  Choosing a CRM customer also needs a CRM role that sees that company; the draft invoice and credit note also need a
  Finance role that may create invoices. Both are checked by the CRM's and Finance's own code.
- **Numbering** (`erp_sequences`): SO-00001 (sales orders), SHP-00001 (shipments), RMA-00001 (returns).
- **Files** (`erp_record_files`): on sales orders, shipments, returns, and proof of delivery (kind `delivery`, accepted
  only once a shipment is dispatched), through the existing upload checks.
- **History**: every step writes `erp_events`, with before and after values.
- **Migration 0025**: `erp_carriers`, `erp_sales_orders`, `erp_so_lines`, `erp_so_revisions`, `erp_so_allocations`,
  `erp_so_mo_links`, `erp_shipments`, `erp_shipment_lines`, `erp_pick_lines`, `erp_packages`, `erp_rmas`,
  `erp_rma_lines`. Keys are `(company_id, id)`; money is integer cents. Statuses are CHECK lists (fixed workflows);
  extensible kinds (return reasons, package kinds, carrier services) are not. CHECKs also keep allocated plus shipped
  within the ordered quantity, shipped within picked, picked within planned, and returned within shipped, so the
  database itself refuses shipping more than was ordered. No foreign key reaches `crm_`, `fin_` or `co_` tables.

## Sales orders

- **The customer is the company's one customer record.** In a registered company: a CRM company (and contact) of the
  company's CRM organisation, and the Finance customer it is linked to through `co_customer_links`; in an own or example
  company, the CRM company and the Finance customer chosen beside it. Nothing is copied: the order keeps the ids and a
  snapshot of the names for its documents.
- **Lines** are products of the product master (no service lines yet), priced as Finance prices them
  (`docLineAmount`, `splitTax`): quantity, unit price, discount, the company's Finance tax codes; in a Finance workspace
  that is not registered for GST, orders carry no tax. Header: requested and promised dates (and per line), delivery
  address, shipping terms, the customer's order number, notes.
- **Statuses:** draft, confirmed, partially allocated, allocated, partially shipped, shipped, invoiced, closed,
  cancelled. From confirmed on, the status is worked out in one statement from the lines, shipments and invoice
  events (`soStatusStmt`), never set by hand.
- **Amendments**: a confirmed order is amended with a reason; the version before is kept in `erp_so_revisions`; a line
  cannot go below what is allocated or shipped. Cancel releases its allocations (refused while a shipment is open);
  close with a reason ends an order before everything is shipped.
- **From a won CRM deal** (`POST /sales-orders/from-deal`): a draft order for the deal's company, its items matched to
  products by code; unmatched items are listed. Once per deal (a partial unique index); asked again, the existing
  order is returned.

## Allocation, make to order and planning

- **Allocate stock** reserves through StockOps (`reserve`), per line, soonest expiry first, then the oldest receipt,
  outside quarantine; once per request key. Inventory's reservation screen refuses to release or issue a reservation
  that belongs to a sales order. Deallocate returns it.
- **Make to order**: a production manager makes a manufacturing order from a line (`createMo` with the link written in
  the same batch, `erp_so_mo_links`); the order shows the sales order it is made for, and the line its orders. Its
  finished goods, once received, are allocated to the line like any stock.
- **MRP** (`planning.ts`): confirmed and later orders are demand: ordered less shipped less allocated, due on the
  line's promised date, else the order's promised, requested or order date. Drafts and cancelled orders are not.
  Enter in the master production schedule only demand that is not on a sales order.
- **Job profitability** (the costing view of a manufacturing order, and its report): the linked line's value before
  tax for the quantity made for it, less the order's actual cost by element; freight is not included.

## Shipping

- **Carriers**: name, code, services, and a tracking page address (https, with `{tracking}`).
- **Shipments** are planned from an order's allocations not yet on a shipment: carrier, service, planned date, delivery
  window, freight cost and charge, whether the customer is emailed, and a pick list by location and lot (soonest
  expiry, then oldest). Planned, picking, picked, packed, dispatched, delivered, cancelled.
- **Pick** ("Picked as listed", or quantities typed), **pack** (packages with kind, weight, dimensions and contents),
  **dispatch** (tracking number): `sales_dispatch` out of the reservations, source `shipment`, under a once key per
  shipment, the shipment's status guarded in the same batch. A double submission returns the dispatched shipment; two
  dispatches of the last unit let one through and refuse the other (409). The value of stock sold is recorded as a
  planned Finance posting; nothing is posted.
- **Delivery**: received by, date and time, and proof of delivery (a photo, a document, or a signature drawn on the
  phone and stored as an image), through the existing upload checks.
- **Dispatch email** (optional, asked for per shipment): the `erp_dispatch` template through the email outbox, once per
  shipment (idempotency key), to the address given or the order's contact. Never for the example company. Where email
  is not set up on the service, nothing is queued and the shipment says so; the screen says it before dispatch too.
- **Delivery schedule**: shipments by date with their windows, and confirmed lines due with no shipment; CSV.
- **The draft invoice in Finance**: on a dispatched shipment, one draft invoice through Finance's `createDoc` (kind
  invoice, action draft): what was shipped at the order's prices and tax codes, and the freight charge as a line. A
  claim in `erp_integration_events` (unique key per shipment, compare-and-set attempts) makes it once under repeated and
  simultaneous requests; a failure is recorded and can be retried; after a crash the invoice is found by its reference.
  It needs a Finance role that may create invoices. Finance's approval posts it.

## Returns

- **Raised** on a shipped order (sales manager or warehouse manager): lines up to what was shipped less returned or
  already being returned, a reason (damaged, wrong item, faulty, not needed, other) and notes.
- **Authorised** or rejected by a sales manager; cancelled or closed.
- **Received** by the warehouse into a location (a quarantine location to inspect first), with lot, serial and expiry
  (the expiry defaults from the stock it left): `customer_return` through StockOps at the unit cost it was dispatched at,
  once per return.
- **Quality**: a returned item can be linked to an inspection or nonconformance of the same company.
- **The draft credit note** through Finance's `createCredit`, once per return (the same claim pattern), linked to the
  shipment's invoice only when that invoice is approved; otherwise it stands on its own.

## Traceability

A lot's or serial's trace now lists the shipments it left in, with their customer and delivery, and follows
components through manufacturing orders to the finished goods' shipments (also through the order's sales order link).

## Reports

Open orders, delivery to customers (on time and in full), shipments by carrier, freight cost and charge, returns,
sales by product and customer (from what was dispatched, before tax), and job profitability. Each has filters,
drill-down to its records and CSV. The Supply Chain overview and the Operations page count what waits: orders to
confirm, allocate or late, shipments to pick, pack, dispatch, in transit and to invoice, returns to authorise and
receive.

## Finance

The ERP never writes `fin_*` tables. Invoices and credit notes are drafts made through Finance's own code, with its
checks and roles. Stock sold and returned is recorded as a planned Finance posting, as every stock movement is since
Release 2; nothing is posted.

## Example company

New example companies get: a carrier (Example Freight, Road and Overnight, tracking on track.example.com), a confirmed
sales order for Harbour Cafe (six kits from stock, ten weldments made to order through MO-00002), a shipment picked,
packed, dispatched and delivered, its draft invoice in Finance, and a damaged kit returned into quarantine with its
draft credit note. It sends no email. Example companies made before Release 5 are not changed; removing and remaking
one adds these records.

## Website

BIZOMAT Manufacturing and Operations is shown as Available (`src/config/systems.ts`), with a status note that names
what stays planned, and a user guide at `/systems/manufacturing/guide/`. The ERP page and guide, the Manufacturing and
Operations page, the Systems index, the systems map and `src/data/erp-capabilities.ts` show Supply Chain as live; the
founder's letter no longer calls supply chain planned.

## Tests

- **Scenario G** (workerd): a registered company with a sales manager, warehouse staff and a production manager; a
  sales order for a CRM company and its linked Finance customer (nothing copied; refused to a person without a CRM
  role), allocated soonest expiry first, a line made to order through a linked manufacturing order run to completion
  (job profitability 1,500.00 less 160.00), a shipment with its pick list, packages, two simultaneous dispatches made
  once, delivery with a signature, the draft invoice once (2,424.00 before GST, 242.40 GST, freight as a line; refused
  without a Finance role), a return received into quarantine with its draft credit note once, traceability from the
  supplier's lot to the delivery, and all seven reports with exact numbers.
- **Isolation and roles**: another company's people get 404 everywhere; capabilities per role; amendments keep the
  version before and never go below what is allocated; cancelling releases stock.
- **Concurrency and retries**: two dispatches of the last unit (one 201, one 409); a failed invoice integration
  recorded, then retried once fixed, making one invoice.
- **MRP** with sales order demand, exact quantities and dates; drafts and cancelled orders are not demand.
- **Won deal** to a draft order, once.
- **Example company**: its records, no email, the earlier releases' figures unchanged.
- **Node** (`test-node/erp-r5-supply-chain.test.ts`): migration 0025 creates only `erp_` tables and indexes, lists no
  extensible kind in a CHECK, and leaves every earlier table exactly as it was; Scenario G in a person's own company
  with exact values; the last unit; the example company sends no email even where email works.
- **Earlier tests changed**, because Release 5 adds example records and a role: `test/erp.test.ts` (the roles list
  includes the sales manager), `test/erp-r2.test.ts`, `test/erp-r3.test.ts`, `test/erp-r4-quality.test.ts` and
  `test-node/erp-r3.test.ts` (the example company's stock rows and manufacturing orders found by name or number, since
  it now has a kits row and MO-00002), and `test/erp-r3.test.ts`'s job profitability expectation (planned before,
  now `{ linked: false }` for an order not made to order). Website: `tests/navigation.test.ts` and
  `tests/seo-rules.test.ts` follow the status change.
- **Chromium** (built Node server): every Supply Chain screen and report at 1440; pick, pack, dispatch, signature and
  delivery at 390; the Operations page; no console errors, no server errors, no sideways scroll. The website's
  `/systems/`, the Manufacturing and Operations page and guide, the ERP page and guide and The Engine Room at 1440 and
  390.

## Known limits

- The value of stock sold and returned is not posted to Finance's ledger (recorded as planned), as for every stock
  movement.
- No bookings or labels in a carrier's own system: the tracking number is typed and the link built from the carrier's
  address.
- Sales order lines are products only; services are invoiced from Finance.
- Backorders are allocated by choosing Allocate stock again, not automatically as stock arrives.
- One invoice per shipment; freight on the invoice is the shipment's charge.
- The dispatch email is sent only where email is set up on the service.
- Landed costs, demand forecasting, inventory optimisation, transfers between sites and distribution planning are
  planned.
