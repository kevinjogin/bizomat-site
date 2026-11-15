# BIZOMAT ERP, Release 3: manufacturing

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026), Release 3: sections 6
(manufacturing), 10 (reports, manufacturing), 12 (roles and segregation of duties), 13 and 14 (user experience and
module completion), 15 (Release 3) and 16 (Scenario C's last step, Scenario D and the "Also test" list). Status by
release: `docs/erp/STATUS.md`. Release 1 (products, engineering, suppliers): `docs/erp/release-1.md`. Release 2
(purchasing and inventory): `docs/erp/release-2.md`.

Built on the branch `erp-release-3`, inside the existing Project Management app (`apps/work`), as Releases 1 and 2 were:
the same Worker and Node server, database, file store, accounts and session. No new app, Machine, database, service,
dependency or sign-in. One additive migration. Not deployed: production has it only once it is reviewed, merged and
deployed.

| Part | Where |
| --- | --- |
| Migration (additive: 20 new `erp_*` tables and their indexes; no trigger, nothing else changed) | `apps/work/migrations/0022_erp_manufacturing.sql` |
| Server, under `/api/erp` (signed in) | `apps/work/src/worker/erp/`: `manufacturing.ts` (settings, planning data, work centres, machines, routings), `production.ts` (orders, execution, receipts, costs, the shop floor), `planning.ts` (schedule, MRP, capacity), `mfg-reports.ts` |
| Changed for it | `access.ts` (roles, capabilities), `stock.ts` (movement types, the planned-posting kind), `procurement.ts` (`createRequisition`, shared with MRP), `record-files.ts` (files on routings and orders), `util.ts` (numbering), `index.ts` (routes, Operations counts) |
| Screens, inside the ERP at `/erp/c/<company>/manufacturing` | `apps/work/src/client/system/erp/`: `Manufacturing.tsx`, `ShopFloor.tsx`, `MfgReports.tsx`; settings in `ErpSettings.tsx` |
| Example company data | `apps/work/src/worker/system/example.ts` |
| Tests | `apps/work/test/erp-r3.test.ts` (workerd, 8 tests), `apps/work/test-node/erp-r3.test.ts` (Node, 4 tests); earlier tests updated where Release 3 changed what they read (below) |

## Foundations added

- **Roles.** Production manager and production operator, kept in `erp_role_grants` (the code checks the names). The
  capability matrix (`access.ts` `CAPABILITIES`; ERP administrators may do everything):

  | Capability | Roles |
  | --- | --- |
  | `manufacturing.view` | every role |
  | `manufacturing.setup` (work centres, machines, draft routings) | engineer, engineering approver, production manager |
  | `routings.release` | engineering approver (never the routing's author, unless the company is one person) |
  | `production.plan` (orders from draft to close, the schedule, planning data) | production manager |
  | `production.execute` (start, pause, time, output, scrap, rework, downtime, inspections, complete) | production manager, production operator |
  | `production.issue` (issue, return and scrap materials) | production roles, warehouse manager, warehouse operator |
  | `production.receive` (finished goods) | production roles, warehouse manager, warehouse operator |
  | `mrp.run` (run MRP; make suggestions to draft orders) | production manager |
  | `mrp.buy` (buy suggestions to requisitions) | production manager, buyer, procurement manager |

  Production manager and operator may also raise requisitions (`requisitions.raise`). Every refusal says in plain words
  who may do it. Everything is checked on the server; screens only hide what the server would refuse.
- **Segregation of duties.** Nobody releases a routing revision they drafted (`segregation()`); in a company of one the
  release is allowed and recorded (`sod_exception`, and the history says so).
- **Numbering** (`erp_sequences`): MO-00001 (manufacturing orders), FGR-00001 (finished-goods receipts), MRP-00001.
- **Settings** (`erp_mfg_settings`, Administration, "Purchasing, inventory and manufacturing settings"; ERP
  administrators): the over-completion tolerance (0 by default), reserving materials on release (on), the
  finished-goods location, and the MRP horizon (90 days).
- **Planning data per product** (`erp_product_planning`): made or bought (else worked out: made when it has a released
  bill of materials and a released routing), purchase and manufacturing lead times, safety stock, minimum order and
  order multiple. Reorder points, minimums and maximums stay in Inventory (Release 2).
- **Files** on routings and manufacturing orders (`erp_record_files`, two new kinds), checked as every upload is.
- **History**: every step writes `erp_events`.
- **Kinds without CHECK lists.** Methods, production types, priorities, report kinds, time kinds, demand kinds,
  suggestion kinds and cost elements are checked by the code with a length check in the database, as Release 2's
  movement and source kinds are; statuses are listed in CHECKs. The new movement types (`production_issue`,
  `production_return`, `production_receipt`, `production_scrap`) and source type (`manufacturing_order`) went into
  Release 2's open lists without a table rebuild.

## Work centres and machines

- A work centre has a code, a status (active, on hold, inactive), a capacity calendar (working days, hours per day,
  efficiency, machines or stations in parallel) and cost rates per hour: labour, machine, and overhead either per
  labour hour or as a percentage of labour and machine cost (not both; a CHECK holds it). Available hours a week =
  working days x hours per day x machines x efficiency. A work centre in use by an open order or a draft or released
  routing cannot be archived.
- A machine belongs to a work centre, may have its own rate, and may name a Maintenance asset of the same company. The
  machine shows as down while that asset has an open breakdown or emergency repair work order. Maintenance is only read:
  there is no foreign key to its tables and none of its code changed.

## Routings

- Revisions per product (A, B, ...): draft, released (one per product, a unique index), superseded. One draft per
  product at a time. Releasing supersedes the released revision in the same transaction, and only while the draft is
  still a draft, so two releases at the same moment cannot both happen. "Copy to a new draft" starts the next revision
  from any revision.
- Operations: number, name, instructions, work centre, machine (of that work centre), set-up minutes, run minutes per
  unit, crew, an inspection point with what to check, an outsourced step (supplier, estimated cost per unit, days), and
  predecessors: a list of lower-numbered operations (none given: the operation numbered before it), with whether it may
  overlap them. Only lower numbers are accepted, so loops cannot happen.
- Manufacturing lead time of a product: the routing's own, else the product's planning lead time, else worked out from
  the routing's operations for the quantity (below).

## Manufacturing orders

- Fields: product; a released bill of materials revision and a released routing revision (the released ones unless
  chosen); quantity; required date; start date (else the required date less the manufacturing lead time, not before
  today); method (make to stock, to order, engineer to order); production type (discrete, assembly, batch,
  repetitive, job); priority; customer or job reference; finished-goods location; notes; assigned people.
- Materials: the bill of materials' direct lines (no optional lines, the first of each alternative group, effective on
  the start date, no services), required = quantity x quantity per x (1 + scrap %).
- Operations: copied from the routing and scheduled forward from the start: an operation starts the working day after
  its predecessors finish (the day the last of them starts, where overlap is allowed) and takes its hours (set-up plus
  run time for the quantity) over its work centre's productive hours per day (hours per day x efficiency), at least one
  working day; an outsourced one takes its supplier's days.
- Estimated cost by element (stored on the order, worked out again while it is a draft or amended): materials =
  quantity x quantity per x the component's cost now (average held, else last price, else standard cost; none: counted
  at zero and listed as missing); scrap = the scrap allowance's share of that; labour = hours x crew x labour rate;
  machine = hours x the machine's rate (else the work centre's); outsourcing = estimate per unit x quantity; overheads
  = labour hours x overhead rate, or overhead % of labour and machine. Each element is rounded to the cent once.
- Statuses: draft, released, in progress (at the first issue, start, time or report), completed, closed; or cancelled
  (a draft, or a released order with nothing recorded). A draft follows the released revisions when it is saved. A
  released order is amended with a reason: quantity (never below what is completed), dates, priority, reference, notes,
  location and people; the version before is kept in `erp_mo_revisions` and the revision number goes up.

## Execution

- **Release** shows shortages (required against available), reserves what stock allows through StockOps (outside
  quarantine, soonest expiry first; `erp_reservations` with a link table `erp_mo_reservations`), and schedules the
  operations again from today. A draft leaves draft once: release and cancel share one once-only key.
- **Issue materials**: per line, the material, location, lot and serial (the product's tracking is enforced) and
  quantity; the order's own reservations on that stock are taken first. Partial issues are allowed. **Return** unused
  materials at the average cost the order took them at; the CHECK on `issued_qty` refuses returning more than was
  issued. **Scrap** materials against the order (from stock, with a reason). Movements: `production_issue`,
  `production_return`, `production_scrap`, source `manufacturing_order`. Two people issuing the last unit cannot both
  succeed (the stock CHECK), and stock reserved for one order cannot be issued to another.
- **Operations**: start (predecessors completed, or started where overlap is allowed), pause (stops the running
  timers), complete. Labour per person by timer (one running timer per person, operation and kind: a unique index) or
  minutes entered, for oneself or another person of the company; machine time; rework time is marked. Each entry
  carries its rate at the time, its cost and its overhead. Reports: good output, scrap with a reason, rework with a
  reason, downtime with minutes and a reason; once per client key. Good plus scrap at an operation never exceeds what
  its predecessors passed as good; good output never exceeds the order's maximum (a CHECK on the operation).
- **Inspection points**: a pass or fail (a fail needs a note) before the operation completes. Full Quality
  (inspection plans, results by characteristic, nonconformances, corrective actions) is Release 4; the screens say so.
- **Outsourced operations** are completed with the actual cost; their good output is what the supplier returned (given,
  else what went out to it).
- **Finished goods**: received into a location (the order's, else the company's, else the product's usual one; never
  quarantine), partly if wanted, with lots, one serial per unit and expiry, no more than the last operations reported
  good. Valued at actual cost: the order's actual cost not yet taken into stock, spread over the units still expected
  (the last receipt takes the remainder to the cent). Movement `production_receipt`. Once per client key (a unique
  index; a replay or a simultaneous duplicate returns the first receipt). The order's `completed_qty` has a CHECK
  against `max_qty` (quantity plus the tolerance when the order was drafted or amended), so over-completion is refused,
  also when two people receive at once.
- **Complete** (every operation completed, no timer running): open reservations are released. **Close**: actual costs
  are written per element with the estimate and the variance (`erp_mo_costs`), the order's actual and variance are
  stored, and nothing more can be recorded on it.

## The shop floor

Manufacturing, Shop floor: made for a phone or a terminal at the machine, refreshed every 30 seconds. Per work centre:
status, machines up or down, good output today, planned against done this week, outstanding inspections, the jobs in
progress (progress, shortages, late, machine down) and the jobs ready to start. Large buttons: start, my timer,
good output, scrap, downtime, inspection, pause, complete. Each report carries its own key.

## Planning

- **Master production schedule** (`erp_mps_entries`): forecast or confirmed demand for a product, quantity, due date and
  reference; open, closed or cancelled. There are no sales orders before Release 5: confirmed demand is entered here.
  (Release 5 part A, `docs/erp/release-5-supply-chain.md`: confirmed sales orders are demand of their own; the schedule
  keeps demand that is not on a sales order.)
- **MRP** (`planning.ts` `runMrp`), deterministic. Each run is stored (`erp_mrp_runs`) with its inputs (demand, open
  purchase orders, open manufacturing orders, stock, planning data), a line per product (`erp_mrp_lines`) with its
  netting, and its suggestions (`erp_mrp_suggestions`). A new run dismisses the earlier runs' open suggestions.
  - Products are planned level by level down the released bills of materials (low-level codes).
  - Available = on hand outside quarantine less reservations.
  - Receipts: open purchase order lines (approved, sent, partly received; outstanding = ordered less accepted) at the
    line's, else the order's required date; open manufacturing orders' remaining output at their required date, else
    their planned finish.
  - Requirements: confirmed demand due within the horizon (forecasts when asked); open orders' materials not yet issued
    or reserved, at the order's start; the materials of the orders MRP plans for the products above, at their start
    (today at the earliest). Dates before today are netted today and keep their own date for the messages.
  - In date order, receipts first on a day: when stock would fall below the safety stock, a later receipt is pulled in
    first (an expedite suggestion for that purchase or manufacturing order); otherwise an order is planned for the
    shortfall, at least the minimum order (planning data, else the product supplier's minimum for bought items),
    rounded up to the multiple, due on the requirement's date and ordered or started its lead time before. Purchase
    lead time: the product supplier's (preferred, else the shortest), else the product's. Stock below the safety stock
    at the start is planned today.
  - A product with a reorder point that ends the horizon at or below it gets one more order, up to its maximum (else
    one unit above the reorder point), due after its lead time.
  - Messages: late (the order or start date is before today), overdue (needed before today), expedite (an open order
    due after it is needed, or past due and not in).
  - Convert: a buy suggestion becomes a submitted requisition through the existing requisition code
    (`procurement.ts` `createRequisition`; its usual approval follows), priced at the product supplier's price; a make
    suggestion becomes a draft manufacturing order. A suggestion is claimed before it is converted, so two people
    converting at once make one record. Expedite suggestions link to their order.
- **Rough-cut capacity**: per work centre per week (Monday to Sunday), the hours of open orders' operations not completed
  (set-up when not started, plus run time for the quantity still to make) in the week each is planned to start (the
  current week when that is past), plus the latest run's planned make orders (their routing's hours) in the week they
  should start, against the week's available hours; overloads flagged.

## Job costing

Per order, estimated against actual by element:

| Element | Actual |
| --- | --- |
| Materials | issued less returned, at the stock value of each movement |
| Labour | labour time not marked rework, at the work centre's labour rate |
| Machine | machine time not marked rework, at the machine's (else the work centre's) rate |
| Outsourcing | the actual cost entered on completing each outsourced operation |
| Overheads | per labour hour, or the percentage of labour and machine cost, of every time entry |
| Scrap | materials scrapped against the order |
| Rework | labour and machine time marked rework |

The elements add up without double counting. Variance = actual less estimated. The costing view also shows the
estimated cost per unit, the actual cost per good unit, what was taken into stock and what was not. **Job
profitability** was planned in Release 3: no revenue could be linked to an order honestly before sales orders, and a
product's list price is not revenue. Release 5 part A adds it for orders made to order from a sales order line: the
line's value before tax for the quantity made, against the order's actual cost (`docs/erp/release-5-supply-chain.md`).

## Reports

Production output, work order progress, material consumption, labour utilisation (against available hours, and per
person), production variance (by element, for orders closed in a period), machine downtime (by machine and reason),
MRP suggestions and capacity load. Each links its rows to their records and exports CSV. The Operations hub counts
orders to release, late orders, orders to close, outstanding inspections and open MRP suggestions.

## The link to Finance

Nothing is written to Finance's ledger or to any `fin_*` table (the Scenario D test counts `fin_journals` before and
after). Each production stock movement records a `finance.production_posting` event with status `planned` and its
amount (work in progress and finished goods), and closing an order records a `finance.production_variance` event with
status `planned` and the cost not taken into stock. The note reads "Planned: Finance posting, not built yet". Release 2's
stock movements record theirs with the same note from now on (it named Release 3 before; rows already in production keep
the old text).

### Posting to Finance: design note for the owner

What posting would need:

- **Accounts.** Finance's default business chart has 630 Inventory and 310 Cost of goods sold. Posting production
  needs, per Finance workspace: raw materials inventory (or 630), work in progress (a new current asset), finished
  goods (a new current asset, or 630), labour absorbed and overhead absorbed (credits against the payroll and overhead
  expense accounts), production variances (an expense or direct cost), stock adjustments and scrap (an expense), and
  cost of goods sold (310) for when sales orders exist. The ERP would map each to a workspace's account, chosen by an
  ERP administrator who is also a Finance administrator.
- **The source type.** `fin_journals.source_type` has a CHECK listing fixed sources (migration 0011: manual,
  transaction, invoice, bill, expense_claim, payment, opening, reversal). An additive migration cannot widen it.
  Posted journals are frozen by triggers (`fin_journal_posted_frozen`, `fin_journal_lines_posted_no_*`): a mistake is
  reversed, never edited.
- **Options and their risks.**
  1. *Post as `manual` journals with an ERP reference.* No schema change; works today. Risk: they look like journals a
     person typed, Finance's reports cannot tell them apart, and a person could reverse them in Finance without the ERP
     knowing. Mitigation: a reference format and the integration event's idempotency key.
  2. *Rebuild `fin_journals` with a wider source list* (for example `erp_stock`, `erp_production`). Clean and reportable.
     Risk: rebuilding the ledger's main table, which holds posted, frozen journals, in production: a migration with a
     table copy, its triggers recreated, and a full backup and rehearsal first. It breaks the rule of additive
     migrations, so it needs the owner's approval.
  3. *A side table in Finance* (`fin_journal_sources`, additive) naming each journal's ERP source, with the journals
     posted as `manual`. Additive and reportable; Finance's code would read the side table to show the source. Risk:
     two places to keep in step; still `manual` to anything that reads only `fin_journals`.
  4. *Keep it planned* (today). No risk to the ledger; Finance's balance sheet does not show stock or work in progress.
- **When to post.** Per movement (simple, many journals) or a periodic summary per period and account (fewer journals,
  easier to reconcile). Either way through Finance's own functions (as the draft bill is, Release 2), idempotent by the
  integration event's key, by someone whose Finance role may post journals, and respecting Finance's period lock.

Recommendation: option 3 with periodic summaries, after the owner chooses the accounts; until then option 4.

## Example company

New example companies also get: manufacturing settings (5% over-completion, reserve on release, a finished-goods
location) and work-in-progress and finished-goods locations; three work centres (laser cutting, welding and forming,
assembly and packing) with two machines linked to the example's Maintenance assets (laser cutter, press brake); an
approved coating supplier; released routings for the bracket weldment (laser cut, weld with an inspection point,
outsourced powder coat) and the kit (pack); planning data for gusset plates; 21 gusset plates in stock; a manufacturing
order for ten weldments, released with its materials reserved, the gusset plates issued, laser cutting done with its
labour and machine time, and welding started with four good; confirmed demand for 60 kits and a forecast of 40 in the
master production schedule; and an MRP run whose make and buy suggestions are left open. All through the app's own API,
all invented. The bracket arms stay all on hand (ten reserved for the order), so Release 2's example figures hold.

**Existing example companies are not changed**: they are made once, on the first visit, and Release 3 adds nothing to
them. Their owners see empty manufacturing screens until they make records, or they can remove the example company in
Administration and ask for it again, which makes it with the Release 3 records. Removing the example company removes its
Release 3 records first (they point at Release 2's reservations and locations).

## Tests

- **Scenario D** (workerd, `test/erp-r3.test.ts`): roles and refusals at each step; work centres, a machine, an
  outsourcing supplier; a routing drafted by a production manager and released by an engineering approver; an order of
  10 with its materials (10 frames, 42 bolts with a 5% scrap allowance) and an exact estimate (459.20 by element);
  release with reservations; predecessors enforced; issue from reservations by a warehouse operator; a return; labour
  by two people, machine time, rework time; good output (a replayed report counted once), downtime with a reason; the
  inspection point; the outsourced step's actual cost; finished goods received in two parts (175.13 and 262.70: actual
  cost to the cent), a replayed receipt, over-completion refused; complete and close with every element's estimate,
  actual and variance exact (actual 437.83, variance -21.37); planned Finance events and no `fin_journals` written; the
  eight reports and every CSV header; segregation of duties on routing release; a copy superseding the earlier
  revision; MRP roles (a buyer converts a buy suggestion, not a make one).
- **Scenario C's last step**: goods received on a purchase order, reserved for an order, the rest transferred, then
  issued to the order from both places.
- **Concurrency**: the last unit issued to two orders at once (exactly one); reserved stock refused to another order;
  over-completion with a 10% tolerance (good output capped, two simultaneous receipts let exactly one through, the CHECK
  refuses a direct update); cancelling, and no release after it.
- **MRP with exact numbers**: four products on three levels; lead times from the routing, the product and the product
  supplier; an open purchase order pulled in (expedite); a reservation; an open order's output and materials; safety
  stock (late), an overdue demand; a minimum order and a multiple; every suggestion's quantity, dates and messages, and
  every line's netting; inputs stored; conversion once each; a second run with forecasts.
- **Rough-cut capacity**: 61 hours of an order and 6 planned hours against 56 available (120%, overloaded); 60 hours of
  a five-day, two-machine, 80% work centre.
- **Isolation, roles and the shop floor**: another company gets 404 for every record and route; capabilities per role;
  the shop floor's ready and current jobs, shortages, inspections, output today and timers; one running timer per
  person; an amendment with its history; a machine down through its Maintenance asset's breakdown work order, and only
  the company's own assets linkable.
- **The example company** and its removal.
- **Node** (`test-node/erp-r3.test.ts`): migration 0022 only creates `erp_` tables and indexes, lists no extensible
  kinds in a CHECK, and leaves every earlier table and trigger as it was; Scenario D with exact costs over real HTTP;
  a finished-goods receipt sent twice at the same moment made once; the last unit issued to two orders at once; the
  CHECKs on node:sqlite; the example company.
- Earlier tests updated where Release 3 changed what they read: the ERP roles list (`test/erp.test.ts`, two new roles),
  the example company's suppliers (`test/erp.test.ts`, one more), and the planned-posting note
  (`test/erp-r2.test.ts`).
- Chromium, on the built Node server with the example company: every manufacturing screen and report at 1440 and the
  shop floor, an order, planning, orders, work centres and a report at 390, with no console errors, no server errors and
  no sideways scroll; drafting and releasing an order, converting a suggestion, and on the phone reporting output and
  running a timer.

## Known limits

- Stock and production value are not posted to Finance's ledger (above).
- Job profitability came with Release 5 part A (sales orders); before it, it was planned.
- Scheduling is forward and infinite (no finite capacity, no drag-and-drop board); capacity is rough-cut by week.
- Work in progress is a cost carried on the order; materials issued leave stock (work-in-progress locations are not
  used for it).
- Inspection points record a pass or fail only; Quality is Release 4.
- The over-completion tolerance applies to orders drafted or amended after it is set.
- Machine time is recorded by hand or by timer; there is no connection to machines (and no OEE measure).
- An order's bill of materials and routing cannot change after release: cancel it (if nothing is recorded) or finish it.
