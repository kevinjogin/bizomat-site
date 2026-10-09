---
title: "Planning a data migration between business systems: scope, mapping, cleansing, trial loads and reconciliation"
description: "Moving data to a new system is where many implementations go wrong. How to scope, map, clean, rehearse, reconcile and cut over so records arrive complete and trusted."
publishDate: 2026-10-09
category: "Projects"
tags:
  - systems
  - projects
  - quality
author: "KEVOS"
featured: false
draft: false
---

When a business replaces its accounting package, introduces an ERP system, moves from spreadsheets to a database or retires an old in-house application, the new system starts empty. Customers, suppliers, items, prices, stock balances, open orders and often years of history must be moved across. This **data migration** is usually treated as a technical task near the end of the project, and it is one of the most common reasons implementations are late, over budget or distrusted after go-live.

The difficulty is rarely the mechanics of copying data. It is that old data is messier than anyone expected, the two systems describe the same things differently, important decisions about what to bring across are left to the last minute, and nobody can prove that what arrived matches what left. Staff who find wrong balances or missing records in the first week stop trusting the new system and fall back on old spreadsheets.

This article sets out a practical approach to data migration for small and medium businesses: deciding scope, profiling the old data, mapping it to the new system, cleansing it, rehearsing with trial loads, reconciling results, planning the cutover and dealing with the old system afterwards. It is general information for business owners, project managers and the people who will own the data.

## Why migrations go wrong

Common causes of migration trouble include:

- **Late start.** Migration work begins after the new system is configured, leaving no time to fix data problems.
- **Underestimated data quality problems.** Duplicates, gaps, inconsistent codes and free-text fields appear only when someone examines the data closely.
- **Different structures.** The old system may store information the new one does not expect, or the new one may require information the old one never held.
- **Unclear ownership.** Technical staff move data, but nobody in the business decides what is correct.
- **No reconciliation.** Data is loaded but never proven to be complete and accurate.
- **Single attempt.** The first full load happens at go-live, with no rehearsal.

Each is avoidable with planning. Treat migration as a workstream of the project from the start, with its own plan, owners and tests.

## Step 1: Decide the scope

Not everything in the old system needs to move. The scope decision has a large effect on effort and risk.

| Data | Typical approach |
|---|---|
| Master data: customers, suppliers, items, employees, assets | Migrate active records after cleansing; leave inactive ones in the archive |
| Open transactions: open orders, purchase orders, jobs, invoices and bills | Migrate, because work must continue |
| Balances: stock on hand, account balances, leave balances | Migrate as opening balances at cutover, reconciled carefully |
| Recent history: for example the current and previous financial years | Migrate if needed for reporting and comparison, often in summary |
| Older history | Keep in an accessible archive rather than migrating |
| Documents and attachments | Migrate those linked to active records; archive the rest |

Migrating full detailed history is expensive and often unnecessary, because old transactions may not fit the new system's structure. A searchable archive of the old system's data, kept for the required retention period, is usually a better answer. Record-keeping obligations still apply to archived data, so make sure it remains accessible and readable for as long as it must be kept.

## Step 2: Profile the old data

**Data profiling** means examining the existing data systematically before deciding how to move it. Useful checks include:

- **Record counts** by type and status.
- **Completeness** of important fields, such as the percentage of customers with ABNs or items with units of measure.
- **Duplicates**, such as customers or items entered more than once.
- **Invalid values**, such as dates in the future, negative quantities or codes not in the reference list.
- **Inconsistent formats**, such as phone numbers, addresses and descriptions written in different ways.
- **Free-text fields** holding information the new system needs as structured data.
- **Orphaned records**, such as orders for customers that no longer exist.

Profiling turns vague worries into a list of specific problems with sizes, which helps estimate effort and prioritise fixes. The [data readiness is a business habit](/insights/data-readiness-is-a-business-habit/) article explains how to judge whether data is good enough for each intended use.

## Step 3: Map the old data to the new

A **data map** specifies, field by field, where each piece of information in the new system comes from and how it is transformed. A useful map records:

- **Target field** in the new system and whether it is required.
- **Source field or fields** in the old system.
- **Transformation rules**, such as code conversions, unit conversions, splitting or combining fields, and default values.
- **Owner** who confirms the rule is correct.
- **Open questions** that need business decisions.

Mapping often reveals decisions the business has never made explicitly. If the old system had free-text payment terms and the new one requires a code from a list, someone must decide how each existing term maps to a code. If units of measure differ, conversions must be defined carefully: a stock quantity in metres migrated into a field expecting pieces will make every stock figure wrong.

Code conversion tables, such as old customer categories to new ones or old product groups to new ones, should be reviewed and approved by the people who use them.

## Step 4: Cleanse the data

Data problems can be fixed in three places:

- **In the old system before migration**, which suits problems the business must fix anyway, such as duplicates and wrong addresses.
- **During transformation**, which suits systematic changes such as reformatting phone numbers or converting codes.
- **In the new system after migration**, which should be limited to minor issues, because staff will meet problems at the worst possible time.

Prioritise cleansing by impact. Errors in items, units of measure, prices, stock balances, customer credit terms and supplier bank details cause immediate operational and financial problems; errors in rarely used fields can wait.

Cleansing is business work. Technical staff can find suspected duplicates and invalid values, but people who know the customers, items and suppliers must decide what is correct. Allow their time in the plan.

## Step 5: Rehearse with trial loads

Never let go-live be the first full migration. Plan at least two or three **trial loads** into a test copy of the new system:

1. **First trial**: load a sample to test the mapping and find structural problems.
2. **Second trial**: load a full copy of the data, reconcile it and test that typical processes work with migrated records, such as receiving an open purchase order or invoicing an open sales order.
3. **Dress rehearsal**: repeat the full process exactly as planned for cutover, timing each step.

Each trial finds problems that are much cheaper to fix in rehearsal than after go-live. The dress rehearsal also shows how long the cutover will take, which determines how long normal operations must pause.

## Step 6: Reconcile, and prove it

**Reconciliation** is the evidence that migrated data is complete and accurate. It should be planned in advance with agreed checks and tolerances.

| Check | Example |
|---|---|
| Record counts | 912 active customers in the old system, 912 in the new |
| Control totals | Total stock value, accounts receivable and payable balances match to the cent or within an agreed tolerance |
| Breakdowns | Stock value by warehouse and product group; receivables by ageing period |
| Sample checks | A random sample of records compared field by field |
| Key records | The largest customers, highest-value items and critical suppliers checked individually |
| Process tests | Typical transactions completed using migrated records |

Reconciliation results should be documented and signed off by the business owners of each data area before go-live. Finance usually signs off balances; operations, sales and purchasing sign off their master data and open transactions.

## Step 7: Plan the cutover

The **cutover** is the period when the business stops using the old system and starts using the new one. A cutover plan typically sets out:

- **The cutover date and timing**, often at the end of a month or financial period, and in a quieter trading period.
- **A freeze** on changes to master data in the old system from a set time.
- **The final extract, transformation, load and reconciliation steps**, with owners and expected durations from the dress rehearsal.
- **Go or no-go criteria**, such as balances reconciled and critical processes tested, decided by named people.
- **A fallback plan**, stating how the business will continue if the go-live is postponed.
- **Communication** to staff, customers and suppliers about any interruption.
- **Stock counts** at cutover, if stock balances are being migrated, so the opening position is reliable.

## Step 8: After go-live

Migration does not end at go-live:

- **Provide extra support** for the first weeks, with a clear way to report suspected data errors.
- **Correct errors at their source** and record what was found.
- **Run parallel checks** for critical outputs, such as the first payroll or the first month-end, comparing results with expectations.
- **Make the old system read-only** to prevent people continuing to use it, then archive its data in an accessible form for the required retention period.
- **Retire the old system** once the archive is verified, including licences and hardware.

The [managing legacy Visual Basic 6 applications](/insights/managing-legacy-visual-basic-6-applications/) article discusses retiring old in-house systems, and the [choosing an ERP system for a small manufacturer](/insights/choosing-an-erp-system-for-a-small-manufacturer/) article covers selecting and implementing a replacement.

## Roles and responsibilities

| Role | Responsibility |
|---|---|
| Business data owners | Decide what is correct, approve mappings and conversions, sign off reconciliation |
| Migration lead | Plans and coordinates the migration workstream |
| Technical staff or vendor | Extracts, transforms and loads data; builds reconciliation reports |
| Project manager | Integrates migration into the overall plan and manages risks |
| Sponsor | Makes go or no-go decisions and resolves priority conflicts |

## A worked example

This is an illustrative example. A manufacturer of agricultural equipment is moving from an ageing accounting and inventory system to a cloud ERP system. The old system holds about 6,500 items, 900 active customers, 300 active suppliers, open sales and purchase orders, and ten years of transactions.

**Scope.** The business migrates active master data, open orders, stock balances and opening account balances, plus two years of monthly sales summaries for reporting. Older transactions are exported to an archive database with simple search screens, retained for the required period.

**Profiling and cleansing.** Profiling finds about 400 duplicate or obsolete items, 60 customers without ABNs and inconsistent units of measure on steel stock, held in metres for some items and in six-metre lengths for others. The purchasing and stores team fixes these over six weeks before the first full trial.

**Trial loads.** The first trial reveals that the new system requires a country code on every supplier address, which the old system never held; a default is agreed and checked. The second trial shows a stock value difference of $38,000, traced to unit conversions on twelve steel items. The dress rehearsal confirms the cutover takes about 14 hours.

**Reconciliation and cutover.** At cutover, stock is counted, and the migrated stock value of about $1.84 million agrees with the counted value within the agreed tolerance. Receivables and payables match to the cent. Finance and operations managers sign off, and the business goes live after a weekend cutover.

**Result.** The first month-end closes with only minor issues, staff trust the new balances, and the old system is made read-only and retired three months later once the archive has been checked.

## Common mistakes

- **Treating migration as a copy job** rather than a business decision about what is correct.
- **Migrating everything**, including years of history the new system cannot use well.
- **Cleansing too late**, leaving staff to discover problems after go-live.
- **Testing with tidy samples** instead of full, real data with all its exceptions.
- **Skipping reconciliation** or accepting unexplained differences because time has run out.
- **Allowing changes during the freeze**, so the final extract misses late updates.
- **Keeping the old system open** for updates after go-live, creating two sources of truth.
- **Forgetting interfaces**, such as banking files, website orders or supplier portals, that also need to point at the new system.
- **Losing access to archived data** because nobody kept the means to read it.

## Applying this in an Australian business

- **Start migration planning** at the beginning of a system project.
- **Decide scope deliberately**, migrating active and open data and archiving the rest.
- **Profile the data** before estimating the effort.
- **Map field by field**, with business owners approving rules.
- **Cleanse at the source** where possible, prioritising high-impact errors.
- **Rehearse at least twice** before go-live.
- **Reconcile with agreed checks** and obtain sign-off.
- **Keep archived data accessible** for legal retention periods, such as tax and employee records.

## Questions worth considering

- Who in our business will decide what is correct in each data area?
- What history do we really need in the new system, and what can be archived?
- How clean is our data today, and how do we know?
- How will we prove that balances and records arrived complete and accurate?
- What will we do if the go-live has to be postponed on the day?

## Bringing it together

Data migration decides whether a new system starts with trusted information or inherited problems. Start early, decide what to migrate and what to archive, profile and cleanse the data, map it field by field with business owners, rehearse with trial loads, reconcile with agreed checks and plan the cutover in detail. After go-live, support users, fix errors at the source and archive the old system's data for as long as it must be kept. The effort is modest compared with the cost of a new system that nobody trusts.

---

*Source: KEVOS editorial notes, drawing on general information systems implementation and data migration practice. The worked example is illustrative. This article is general information.*
