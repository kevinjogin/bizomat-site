# BIZOMAT ERP, Release 4 part A: quality management

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026), Release 4: sections 7 (quality
management), 10 (reports, quality), 12 (roles: quality manager and quality inspector; segregation of duties), 13 and 14
(user experience and module completion), 15 (Release 4) and 16 (Scenario E and the "Also test" list). Status by release:
`docs/erp/STATUS.md`. Earlier releases: `docs/erp/release-1.md` (products, engineering, suppliers), `release-2.md`
(purchasing and inventory), `release-3.md` (manufacturing). Release 4 part B (Maintenance stages M2 and M3 and
reliability reports) is built separately.

Built on the branch `erp-release-4-quality`, inside the existing Project Management app (`apps/work`), as Releases 1 to 3
were: the same Worker and Node server, database, file store, accounts and session. No new app, Machine, database,
service, dependency or sign-in. One additive migration. Not deployed: production has it only once it is reviewed,
merged and deployed.

| Part | Where |
| --- | --- |
| Migration (additive: 10 new `erp_qc_*` tables and their indexes; no trigger, nothing else changed) | `apps/work/migrations/0023_erp_quality.sql` |
| Server, under `/api/erp` (signed in) | `apps/work/src/worker/erp/`: `quality.ts` (plans, inspections, quarantine and release, the queue, the hub, options), `ncr.ts` (nonconformances, dispositions and their actions, corrective and preventive actions), `quality-reports.ts` |
| Changed for it | `access.ts` (roles, capabilities, `segregationOf`), `util.ts` (numbering, history kinds), `record-files.ts` (files on plans, inspections, characteristics, NCRs and actions), `index.ts` (routes, Operations counts), `purchasing.ts` (a receipt's inspections; its note), `production.ts` (an order's inspections and NCRs; its note), `inventory.ts` (traceability), `suppliers.ts` (the supplier's quality, read only) |
| Screens, inside the ERP at `/erp/c/<company>/quality` | `apps/work/src/client/system/erp/`: `Quality.tsx` (overview, inspections, nonconformances, corrective actions, plans), `QualityReports.tsx`; links from receipts, orders, traceability and suppliers |
| Example company data | `apps/work/src/worker/system/example.ts` |
| Tests | `apps/work/test/erp-r4-quality.test.ts` (workerd, 7 tests), `apps/work/test-node/erp-r4-quality.test.ts` (Node, 4 tests); two earlier expectations updated (below) |

## Foundations added

- **Roles.** Quality manager and quality inspector, kept in `erp_role_grants` (the code checks the names). The
  capability matrix (`access.ts` `CAPABILITIES`; ERP administrators may do everything):

  | Capability | Roles |
  | --- | --- |
  | `quality.view` | every role |
  | `quality.plan` (draft plans and characteristics) | quality manager, engineer, engineering approver |
  | `quality.plan_release` | quality manager |
  | `quality.inspect` (start, record, complete, quarantine, cancel inspections) | quality manager, quality inspector |
  | `quality.raise` (raise NCRs, containment, root cause) | quality roles, production manager and operator, warehouse manager and operator |
  | `quality.disposition` (decide and carry out dispositions, conditional acceptance, release, verify and close NCRs) | quality manager |
  | `capa.propose` | quality roles, engineers, engineering approvers, production, warehouse and procurement managers |
  | `capa.approve` (approve, verify, close and cancel actions) | quality manager |

  The responsible person of a corrective action starts it, adds evidence and marks it done, whatever their role. Every
  refusal says in plain words who may do it.
- **Segregation of duties** (`segregationOf`): nobody approves a corrective or preventive action they proposed or are
  responsible for, and nobody closes one they carried out or are responsible for. In a company of one person the
  approval and closure are the recorded exception (`approval_sod`, `closure_sod`, and the history says so).
- **Numbering** (`erp_sequences`): QP-00001 (inspection plans; a plan's versions share its number), QI-00001
  (inspections), NCR-00001, CA-00001.
- **Files** (`erp_record_files`, five new kinds): plans, inspections, a characteristic's photos, NCRs and a corrective
  action's evidence, checked as every upload is. Photos of a characteristic are taken while the inspection is open.
- **History**: every step writes `erp_events`.
- **Kinds without CHECK lists.** Plan kinds, characteristic kinds, inspection sources, severities, dispositions, action
  kinds and CAPA kinds are checked by the code with a length check in the database; statuses and results are listed in
  CHECKs. The new movements use Release 2's open lists (`quarantine`, `release`, `scrap`, `supplier_return`, sources
  `quarantine`, `scrap`, `supplier_return`) with the NCR or inspection as the movement's source.

## Inspection plans

- A plan version has a kind (incoming, first article, in-process, final, supplier, product) and applies to a product
  (optionally one revision), a supplier, or an operation of a routing (in-process and first article only). A supplier
  plan names its supplier; the others name a product.
- Characteristics: a dimension or measured value (unit, nominal, tolerance, minimum, maximum; at least one limit), an
  attribute (pass or fail) or a visual check; the number of samples (1 to 200); whether a photo is needed. The limits are
  the minimum and maximum, else the nominal less and plus the tolerance.
- Versions: one draft and one released version per plan (unique indexes). A quality manager releases a draft; releasing
  supersedes the released version in the same transaction, once (a second release at the same moment is refused). New
  version copies any version into the next draft. Only released plans are used, and a draft can be removed.

## Inspections

- **Where they come from.** The Quality overview offers what waits: goods receipt lines of products marked
  "inspection required" (incoming), inspection points of operations in progress (in-process), and finished-goods
  receipts of products with a released final plan, received after it was released (final). An inspection is started
  from there, from a goods receipt or a manufacturing order, or by hand (a supplier inspection, a first article, a
  product check). At most one inspection that is not cancelled per receipt line, operation or finished-goods receipt
  (a unique index): starting it twice, or at the same moment, returns the first.
- **The plan.** The best released plan for the source is chosen: by kind (incoming tries incoming, then product, then
  supplier plans; in-process tries in-process then product; final tries final then product), then the most specific
  that applies (supplier, revision, routing, operation). Its characteristics are copied onto the inspection, so a later
  version never changes a past inspection. Without a plan the inspector adds characteristics by hand.
- **Recording.** A reading per characteristic and sample: a value, or conforming yes or no. The server compares each
  value with the limits copied onto the inspection and stores whether it is within them; anything the client says about
  a result is ignored. Readings can be changed while the inspection is open; each save is recorded with who and when.
- **Completing.** Every sample of every characteristic must be read and every required photo added. The result is
  worked out: passed, or failed when any reading is outside its limits or not conforming; each characteristic's result
  is stored. Completing is done once (a once-only key): a double submission or two people at once complete it once.
- **Quarantine and release.** On a fail the lot can be moved into a quarantine location through StockOps' `relocate` in
  the same transaction (only stock that is not reserved), or later. A quality manager may accept a failed lot on
  condition, with the reason (result `conditional`); stock this inspection put in quarantine is then released through
  StockOps, once per key, never more than it quarantined (a CHECK). A failed lot is otherwise released only through its
  NCR's disposition.
- **Release 3's inspection points.** The simple pass or fail at an inspection point is unchanged. A full inspection made
  from an operation records the operation's pass or fail (and the inspection's number) when it is completed, or a pass
  when a failed one is accepted on condition, so the operation can complete. The order shows its inspections.
- **The screen** is made for a phone: one card per characteristic with its limits, a large input or Conforms and Does not
  buttons per sample, photos from the camera, and a save bar that stays above the module rail.

## Nonconformance

- Raised by anyone who operates or inspects, from failed inspections (product, lot, serial, quantity, supplier, receipt,
  order and where the stock is now are filled in from the first inspection: its quarantine location if it quarantined)
  or by hand. It may name a Maintenance asset of the same company (read from `mt_assets`, never written; no foreign key)
  or a process. Severity: minor, major or critical.
- **Statuses:** open, contained, investigating (under investigation), dispositioned, capa (a corrective action raised
  from it), verification, closed, or cancelled (before a disposition).
- **Containment** in words, and stock put into quarantine with it if wanted (StockOps, once per key).
- **Root cause** by five whys (up to five answers; the root cause defaults to the last) or free text.
- **Disposition**, decided once by a quality manager (a once-only key: two quality managers deciding at the same moment
  leave one decision): how much is used as is, reworked, repaired, scrapped, returned to the supplier or regraded, never
  more than the quantity affected.
- **Carrying it out** goes through existing code, each action once per client key (a unique index on the action), and
  each counted against its disposition line, whose CHECK refuses doing more than was decided:

  | Disposition | Actions |
  | --- | --- |
  | Scrap | Scrap: StockOps `takeOut('scrap')`, valued in the ledger |
  | Return to supplier | Return: StockOps `takeOut('supplier_return')` |
  | Use as is, regrade | Release from quarantine (StockOps `relocate`), or done where it stands |
  | Rework, repair | A rework or repair note, then release from quarantine, or done where it stands |

  Rework is a note, not a draft manufacturing order: a Release 3 order issues new materials from a bill of materials,
  which reworking a defective part does not, so a draft order would misstate the materials. The rework itself is
  reported at an operation on the shop floor (Release 3's rework report and rework time), and the rework report shows
  both.
- **Verification and closure.** Ready for verification once every disposition line is carried out and every corrective
  action from it is verified, closed or cancelled; a quality manager then records how the fix was verified and closes it.

## Corrective and preventive actions

- Corrective or preventive, from an NCR or on their own: a title and details, a responsible person of the company, a due
  date, and evidence (files).
- **Statuses:** proposed, approved, in progress, done, verified (the effectiveness check; not effective sends it back to
  in progress with the note kept), closed, or cancelled.
- Approval and closure follow segregation of duties (above). Raising one from a dispositioned NCR moves the NCR to capa.
- **Overdue** (proposed, approved or in progress after the due date) actions show on the Quality overview, with the
  person's own actions. My Work is Projects and Tasks' list of board items and has no place for ERP records, so they
  are not in My Work; the overview says so.

## Traceability

A lot or serial number's trace (Inventory) lists its inspections and NCRs beside where it came from and every movement;
quarantine, release, scrap and return movements carry the inspection's or NCR's number as their reference.

## Reports

Each lists the records behind its numbers, links them, filters by dates (the last 30 days by default) and what fits it,
and exports CSV.

| Report | What |
| --- | --- |
| Inspection results | Completed inspections; totals by result and by kind; the pass rate |
| Rejection rates | By product and by supplier: inspections, failed, accepted on condition, rejection rate; quantity inspected and rejected (a failed inspection rejects its lot) |
| Supplier defects | Per supplier: received, damaged or rejected at receipt (Release 2), inspections failed, quantity rejected, defect rate, NCRs and returns with their value. The supplier page shows the last year read only |
| NCR register | Every NCR with its age, disposition and actions; ageing of the open ones (0 to 7, 8 to 30, 31 to 90, over 90 days); by status and severity |
| Corrective actions | By status, with the overdue ones and the recorded one-person exceptions |
| Rework | Rework reported on the shop floor, rework time at its cost with overheads, and rework and repair dispositions |
| Cost of poor quality | Internal failure from the records: scrap at its value in the stock ledger (under an NCR, in production, in the warehouse) and rework time at its cost. Goods returned to suppliers are shown, not counted (a supplier may credit them). Appraisal costs (inspection time is not recorded) and external failure costs (no sales orders or customer returns before Release 5) are listed as planned |

The Operations hub counts what waits for inspection, NCRs to disposition and overdue actions.

## Finance

Nothing is written to Finance or any `fin_*` table (the Scenario E tests count `fin_journals`). Scrap and returns under
an NCR record their Finance posting as planned through StockOps, as every stock movement does since Release 3.

## Example company

New example companies also get: a released incoming plan for the bracket arms from Example Steel Supplies (thickness
3 ± 0.15 mm, length 240 ± 0.5 mm, edges free of burrs; three samples each); the incoming inspection of the arms received
in Release 2's example, failed on one thickness of 2.81 mm; a nonconformance raised from it, with its containment and
root cause by three whys; and a corrective action (agree a sampling plan with the supplier), approved under the recorded
one-person exception and in progress. All through the app's own API, all invented. No stock moves, so Release 2's and
3's example figures hold.

**Existing example companies are not changed**: they are made once, on the first visit, and Release 4 adds nothing to
them. Their owners see an empty Quality until they make records, or they can remove the example company in
Administration and ask for it again. Removing it removes its quality records first.

## Tests

- **Scenario E** (workerd): an incoming plan drafted by an engineer (refused to an inspector) and released only by a
  quality manager; a lot-tracked receipt of 20 waiting for inspection; the inspection started twice (one); readings
  checked against the limits on the server (a client's "ok" ignored), a sample count and a photo required before
  completing; completed as failed with the lot moved into quarantine in the same step; an NCR raised from it (refused to a
  viewer; once per key) with its product, lot, supplier, receipt and quarantine location; containment, five whys; a
  disposition (refused to an inspector, over the quantity refused, decided once) of 5 returned, 2 scrapped and 13 used
  as is, each carried out once (the same scrap twice: once; more than decided: refused); stock exact (13 on hand,
  13,000 cents); a corrective action proposed by the inspector for an engineer, overdue, on the overview and the
  engineer's own list, approved by a quality manager, evidence, done, not effective, done again, verified, closed;
  verification and closure; history; traceability (the lot's inspection, NCR and the seven movements); every report with
  exact numbers and every CSV header; the supplier page's quality; no `fin_journals` written.
- **Quarantine and release**: an inspection without a plan with a characteristic added by hand, part of a lot
  quarantined while open (to a quarantine location only, once per key, never more than is free), failed, release refused
  until a quality manager accepts it on condition, released once under two simultaneous requests.
- **In-process and final**: an in-process plan for one operation of a routing found for that operation; the operation
  cannot complete until the full inspection passes, then records it; Release 3's simple pass or fail at the next
  operation still works; finished goods received after a final plan wait for a final inspection, which finds the plan,
  computes a fail from an attribute and quarantines; rework hours and cost exact in the rework report and the cost of
  poor quality.
- **Concurrency and repeated requests**: two quality managers dispositioning one NCR at the same moment (one decision);
  the same scrap sent twice at once (one movement); two scraps for more than is left at once (one through; the
  database refuses a direct update beyond the decision); an inspection completed twice at once (once).
- **Segregation of duties**: neither the proposer nor the responsible person approves; the person who did it does not
  close; an engineer may not approve, verify, close or cancel; a responsible person outside the company is refused;
  a one-person company's exception recorded on approval and closure.
- **Isolation, roles and versions**: roles and capabilities per role; an NCR may name only its own company's Maintenance
  asset; another company gets 404 for every quality record and route and 400 when naming another company's records; a
  plan copied to version 2 and released supersedes version 1, new inspections use it and old ones keep theirs.
- **The example company** and its removal.
- **Node** (`test-node/erp-r4-quality.test.ts`): migration 0023 only creates `erp_qc_` tables and indexes, lists no
  extensible kinds in a CHECK, has no foreign key to Maintenance, and leaves every earlier table as it was; Scenario E
  over real HTTP with exact quantities and values; an inspection completed twice at once, two dispositions at once and
  the same scrap sent twice at once each happen once; the CHECKs on node:sqlite; the example company.
- Earlier tests updated where a placeholder became real: the ERP roles list (`test/erp.test.ts`, two new roles) and the
  goods receipt's inspection note, which pointed at Release 4 (`test/erp-r2.test.ts`).
- Chromium, on the built Node server with the example company: every quality screen and report, Operations, the
  dashboard, a manufacturing order, a goods receipt, a supplier and traceability at 1440, and the overview, an
  inspection, an NCR, an action, plans and a report at 390, with no console errors, no server errors and no sideways
  scroll; an inspection started by hand on the desktop, recorded and completed on the phone, and the example NCR taken
  through its disposition, its corrective action, verification and closure on the desktop.

## Known limits

- A disposition is decided once and cannot be changed; cancel the NCR before its disposition, or raise another.
- Quarantine needs a location of the kind quarantine (Inventory, Warehouses); reserved stock cannot be quarantined
  until its reservation is released.
- An inspection covers one lot; a receipt line of several serial numbers is inspected as one lot.
- Sampling plans (sample sizes from lot sizes and acceptance numbers) are not built: the plan gives each
  characteristic's sample count.
- Statistical process control, calibration of measuring equipment, quality audits and product compliance are planned.
- Appraisal and external failure costs of poor quality are planned (inspection time is not recorded; no sales orders).
- Corrective actions are ERP records, not tasks in Projects, and do not appear in My Work.
