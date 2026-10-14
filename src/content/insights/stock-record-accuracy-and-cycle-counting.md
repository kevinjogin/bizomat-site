---
title: "Stock record accuracy: cycle counting, root causes and why the system disagrees with the shelf"
description: "When system stock and shelf stock disagree, planning, promises and accounts all suffer. How to measure record accuracy, run cycle counts, find root causes and prevent errors."
publishDate: 2026-10-09
category: "Operations"
tags:
  - operations
  - systems
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

A customer service officer promises delivery tomorrow because the system shows 40 units in stock. The picker finds 12. Elsewhere, purchasing orders more of a part the warehouse holds in two locations under two numbers, and production stops because a component the system says is available has been used without being recorded. At the annual stocktake, the accounts are adjusted by tens of thousands of dollars, and nobody can say exactly why.

These are symptoms of poor **inventory record accuracy**: the stock recorded in the business system does not match what is physically on the shelf. Every planning tool, from simple reorder points to material requirements planning, depends on accurate records. When they are wrong, businesses compensate with extra safety stock, expediting, overtime, manual checks and apologies to customers, all of which cost far more than keeping records right.

This article explains what record accuracy means and how to measure it, why records go wrong, how cycle counting works, how to find and fix root causes, which process controls prevent errors, how cycle counting relates to the annual stocktake and financial controls, and what targets are realistic. It is general information for operations, warehouse, purchasing and finance managers.

## What record accuracy means

A stock record is accurate when the quantity in the system matches the quantity physically present, for a given item in a given location, within an agreed tolerance. Three choices shape how accuracy is measured:

- **Unit of measurement**: accuracy is best measured per **item and location**, sometimes called a stock line, rather than by total value, because value totals let errors cancel out.
- **Tolerance**: some items, such as bulk fasteners counted by weight, cannot be counted exactly, so a tolerance is set. High-value or critical items usually have zero tolerance.
- **Timing**: counts must account for transactions in progress, such as goods received but not yet put away.

**Record accuracy** is then the percentage of counted lines that match within tolerance. If 200 lines are counted and 184 are within tolerance, accuracy is 92%.

## Why net value hides the problem

Many businesses judge stock accuracy by the net value of stocktake adjustments. That is misleading. If one item is overstated by $5,000 and another understated by $5,000, the net adjustment is zero, but both records were wrong, and both probably caused planning problems. Track both the **hit rate** by line and the **gross value** of adjustments, adding overs and unders without letting them cancel.

## Why accuracy matters

| Consequence | How poor records cause it |
|---|---|
| Stockouts and late deliveries | The system shows stock that is not there |
| Excess stock | The system hides stock that is there, so more is bought |
| Inflated safety stock | Planners add buffers to protect against unreliable records |
| Production stoppages | Components recorded as available are missing |
| Wasted time | Staff search, recount and check before committing |
| Financial misstatement | Inventory values in the accounts are wrong |
| Lost trust | Staff stop believing the system and keep side records |

The last consequence is the most damaging. Once people stop trusting the system, they keep their own spreadsheets and notes, and the records get worse.

## Why records go wrong

Record errors almost always come from processes, not from the counting itself:

| Cause | Example |
|---|---|
| Unrecorded issues | Parts taken for urgent repairs without a transaction |
| Wrong item | Similar items confused at picking or receiving |
| Wrong location | Stock put away in an unrecorded or overflow location |
| Unit of measure errors | Boxes of 100 recorded as single items, or the reverse |
| Receiving errors | Quantities received not matching quantities recorded |
| Timing | Transactions entered hours or days after the movement |
| Backflushing errors | Components automatically deducted using a wrong bill of materials or scrap rate |
| Unrecorded scrap and rework | Damaged parts discarded without adjustment |
| Returns | Customer returns placed back on shelves without being recorded |
| Duplicate item records | The same part held under two numbers |
| Theft or loss | Items leaving without any record |

**Backflushing**, where the system automatically deducts components from stock when a finished item is reported as produced, is a common hidden cause. If the bill of materials is wrong, or actual scrap differs from the planned allowance, component records drift steadily even though nobody touched them.

## Cycle counting

**Cycle counting** counts a portion of stock regularly throughout the year, rather than everything at once. It finds errors sooner, spreads the workload, and, most importantly, provides a steady flow of evidence about why errors occur.

### Deciding how often to count

Most businesses classify items using an **ABC analysis**, usually by annual usage value:

- **A items**: the small share of items that account for most of the value or usage, counted most often, such as monthly or quarterly.
- **B items**: middle importance, counted less often, such as quarterly or twice a year.
- **C items**: the many low-value items, counted perhaps once a year.

Criticality matters as well as value. A cheap component that stops production when missing may deserve frequent counting.

### Other counting approaches

- **Location-based counting**: counting every item in a set of locations, which also finds stock in the wrong place.
- **Opportunity-based counting**: counting when stock is low, at a reorder point or when a location is emptied, when counting is quick.
- **Exception-based counting**: counting items with negative balances, unusual adjustments or frequent stockouts.
- **Control groups**: repeatedly counting a small, fixed group of items, often weekly, to find root causes quickly, because errors appear soon after they occur and can be traced while memories are fresh.

### Running a count well

1. **Count blind**: counters record what they find without seeing the system quantity, which avoids bias.
2. **Manage cut-off**: count when the item is not moving, or record transactions in progress so they can be allowed for.
3. **Recount differences** outside tolerance, preferably by another person.
4. **Investigate before adjusting**: look for unrecorded transactions, wrong locations and unit errors.
5. **Adjust with approval**, recording the reason.
6. **Record the cause** of each confirmed error, so patterns become visible.

### Who should count

Counting is a skill. Counters should know the items, their units of measure and how to read labels, and they should understand why accuracy matters. Many businesses use a small, trained group of counters rather than whoever is free, and rotate them so that people do not routinely count stock they handle themselves. Simple tools, such as scales for counting small parts by weight and handheld scanners that record counts directly, reduce errors further.

## Finding and fixing root causes

Adjusting records fixes the symptom; fixing processes prevents recurrence. For each confirmed error, ask why it happened, and why again, until a process cause appears. Group causes over time and tackle the most frequent. Typical findings lead to changes such as:

- **Clear unit of measure conversions** and labels showing the stocking unit.
- **Locations recorded for every put-away**, including overflow areas.
- **A process for urgent issues**, so parts taken outside normal hours are still recorded.
- **Returns quarantined** until inspected and recorded.
- **Bills of materials corrected** where backflushing causes drift.
- **Duplicate items merged** in the item master. The [master data and the single source of truth](/insights/master-data-and-the-single-source-of-truth/) article explains how to prevent duplicates.

## Process controls that prevent errors

- **Location control**: every bin, shelf and pallet position has a unique, labelled location, and stock is recorded by location.
- **Barcode scanning** at receiving, put-away, picking and dispatch, which reduces wrong-item and quantity errors.
- **Receiving checks** against purchase orders, with discrepancies recorded.
- **Timely transactions**, entered when movements happen rather than at the end of a shift.
- **Restricted access** to stores, with clear rules for after-hours issues.
- **Kitting** for production, so components issued to jobs are recorded together.
- **Separation of duties**, so the people who handle stock do not also approve adjustments.

The [lean warehousing and material flow](/insights/lean-warehousing-and-material-flow/) article covers layouts and flows that make accurate recording easier.

## Stock beyond the main warehouse

Stock records often go wrong away from the main store. Service vans carry parts used on customer sites; consignment stock sits at customers' premises; second warehouses and production areas hold their own supplies; and goods travel between sites. Each needs to be a recorded location in the system, with transfers recorded when stock leaves one place and arrives at another, and **in-transit** quantities visible in between. Van stock is a common weak point: technicians use parts on jobs and record them late, or not at all. Scanning parts against jobs on a mobile device, and counting vans regularly, keeps both stock and job costs accurate.

## Using system data to target counts

The system itself can point to likely errors. Reports worth running regularly include:

- **Negative balances**, which are always wrong, because physical stock cannot be below zero.
- **Items with frequent adjustments**, which indicate an unresolved process cause.
- **Stock with no movement** for a long period, which may not exist or may be obsolete.
- **Items picked short** or reported missing by pickers.
- **Locations holding several different items** where only one is expected.

Counting these items first finds more errors per hour of counting than counting at random.

## Cycle counting and the annual stocktake

Many businesses perform a full annual stocktake for financial reporting, stopping operations for a day or more. Where cycle counting is well established and accuracy is demonstrated, some businesses, with their auditors' agreement, reduce reliance on the full stocktake. Even where a full count remains, cycle counting makes it smoother, because records are already close to reality and fewer large adjustments surprise everyone at year-end.

## Inventory adjustments and financial controls

Stock adjustments change the value of assets in the accounts and can conceal theft or error. Controls should include:

- **Approval limits** for adjustments by value.
- **Reasons recorded** for every adjustment.
- **Regular review** of adjustment reports by someone independent of the warehouse.
- **Investigation** of repeated adjustments on the same items or by the same people.

The [internal controls for a growing small business](/insights/internal-controls-for-a-growing-small-business/) article discusses separation of duties and approval controls more widely.

## Realistic targets

Many businesses aim for record accuracy of 95% or better by line within tolerance, with higher targets for A items and critical components. Businesses starting from poor accuracy often see large improvements within months once root causes are addressed, but sustaining accuracy requires ongoing cycle counting and discipline. Track accuracy over time by item class and location, and review causes regularly.

## Common mistakes

- **Measuring by net value**, letting errors cancel out.
- **Adjusting without investigating**, so causes repeat.
- **Counting only once a year.**
- **Showing counters the system quantity**, which biases counts.
- **Ignoring cut-off**, creating false differences.
- **Allowing unrecorded after-hours issues.**
- **Leaving wrong bills of materials** to drive backflushing errors.
- **Keeping side records** instead of fixing the system.

## A worked example

This is an illustrative example. A distributor of hydraulic and pneumatic components holds about 4,000 stocked items in one warehouse. A trial count of 300 random item locations finds that only 72% match the system within tolerance. Planners carry extra safety stock on many items, and customer service staff routinely ask the warehouse to check shelves before promising stock.

**Control group.** The operations manager selects 100 items across classes and counts them every week for eight weeks, investigating every difference immediately.

**Findings.** About a third of errors come from unit of measure confusion on fittings stocked in bags of 10 but sometimes picked and recorded as single units. About a quarter come from customer returns placed back on shelves without being recorded. Many others come from stock held in an overflow area without location records, and a smaller number from receiving count errors.

**Fixes.** Item labels show the stocking unit clearly, and unit conversions are corrected in the system. Returns go to a quarantine bay until inspected and recorded. Overflow locations are labelled and scanned. Receiving staff scan each carton against the purchase order.

**Cycle counting.** An ABC cycle counting program begins, counting A items monthly, B items quarterly and C items twice a year, with blind counts, recounts of differences and recorded causes.

**Result.** Within six months, accuracy across the counted lines rises to about 96%. Planners reduce safety stock on items with reliable records, releasing an estimated $180,000 of stock over the following year in this illustration, and customer service staff promise from the system without calling the warehouse.

## Applying this in an Australian business

- **Measure accuracy by item and location**, with tolerances.
- **Track gross as well as net adjustments.**
- **Introduce cycle counting** by ABC class and criticality.
- **Use a control group** to find root causes fast.
- **Count blind**, manage cut-off and investigate before adjusting.
- **Fix process causes**, such as units, locations, returns and backflushing.
- **Control adjustments** with approvals and independent review.
- **Discuss with your auditor** how cycle counting relates to year-end stocktakes.

## Questions worth considering

- What percentage of our stock records would match the shelf today?
- How large are our gross, not just net, stock adjustments each year?
- Which errors do we keep correcting without fixing their causes?
- Do staff trust the system's stock figures, or do they check first?
- Who approves stock adjustments, and who reviews them?

## Bringing it together

Accurate stock records underpin planning, customer promises and financial statements. Measure accuracy by item and location, count stock continually through ABC and control-group cycle counting, investigate every difference to find its process cause, and fix those causes through location control, scanning, clear units of measure, proper handling of returns and accurate bills of materials. Control adjustments carefully, and the system will become something people trust rather than something they check.

---

*Source: KEVOS® editorial notes, drawing on general inventory management, warehousing and internal control practice. Figures in the worked example are illustrative. This article is general information.*
