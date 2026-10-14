---
title: "Testing business software that holds important data: test data, calculations, permissions and acceptance"
description: "Data-heavy business systems fail in predictable places: calculations, dates, rounding, permissions and volume. How to plan tests, prepare data and run acceptance testing."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - quality
  - validation
author: "KEVOS®"
featured: false
draft: false
---

When a new or changed business system goes live, the problems that cause the most damage are rarely crashes. They are quiet errors in data: invoices whose GST is a cent out on some lines, jobs that disappear from a schedule at the end of the month, a discount that applies twice, a report that double counts, a user who can see pay rates they should not, or a stock figure that goes wrong when two people pick the same item at once. These errors can run for weeks before anyone notices, and by then they have flowed into customers' invoices, financial statements and decisions.

Testing a system that holds and calculates important business data needs more than clicking through screens to see that they work. It needs realistic test data, test cases drawn from real business scenarios, independent checks of calculations, deliberate attempts to break rules, tests of permissions and simultaneous use, checks of reports against their sources, and a structured acceptance process in which the people who will use the system confirm it does what the business needs.

This article explains how to plan and carry out testing for data-heavy business systems, whether custom-built, configured packages or major updates. It covers levels of testing, preparing test data, writing scenario-based test cases, the edge cases that cause most errors, checking calculations and reports, testing permissions, simultaneous use and volume, running user acceptance testing and repeating tests after updates. It is general information for managers, system owners and project teams.

## Levels of testing

| Level | What it checks | Usually done by |
|---|---|---|
| Unit testing | Individual functions and calculations | Developers |
| Integration testing | Connections between components and systems | Developers and integrators |
| System testing | The whole system against its requirements | Test team or vendor |
| User acceptance testing | Whether the system supports real business work | Business users |
| Regression testing | That changes have not broken existing functions | Test team, often automated |

Businesses commissioning software mainly control user acceptance testing and should ask suppliers for evidence of the earlier levels. For configured packages, the business's own configuration, such as price rules, tax codes, approval workflows and reports, needs testing even when the underlying software is well proven.

## Preparing test data

Good test data is the foundation of useful testing. Options include:

- **Synthetic data**: invented records designed to cover specific cases. Safe and controllable, but may miss the oddities of real data.
- **Masked copies of production**: real data with names, contact details and other personal information replaced. Realistic in volume and variety, but must be protected and refreshed.
- **Subsets**: a representative slice of real data, smaller and faster to work with.
- **Known datasets**: a fixed set of records with precisely known expected results, used to check calculations and reports every time the system changes.

Avoid using unmasked copies of real customer, employee or payment data in test environments, which are often less protected than production. Where real data must be used, restrict access and delete it after testing.

## Writing test cases from business scenarios

The most valuable test cases describe real business situations rather than individual screens. A simple structure is:

- **Starting situation**: the relevant records, such as a customer with special pricing and an open order.
- **Action**: what the user or process does, such as converting a quote to an order with a partial delivery.
- **Expected result**: what the system should show and record, including calculated values.

Draw scenarios from the business's actual work, especially recent awkward cases. The people who will use the system are the best source of them. The [requirements that can be traced and tested](/insights/requirements-that-can-be-traced-and-tested/) article explains how to link each requirement to tests that prove it.

## The edge cases that cause most errors

| Area | Cases worth testing |
|---|---|
| Quantities | Zero, negative, fractional, very large, unit conversions |
| Money | Rounding, discounts on discounts, credits, refunds, multiple currencies |
| GST | Taxable, GST-free and input-taxed items on one invoice, rounding per line versus total |
| Dates | End of month, 29 February, the 30 June and 1 July financial year boundary, daylight saving changes, time zones between states |
| Text | Long names, apostrophes, special characters, leading zeros in codes |
| Missing information | Optional fields left blank, partially completed records |
| Status changes | Cancellations, reversals, reopened jobs, partial deliveries |
| Sequences | Out-of-order events, such as an invoice before dispatch |
| History | Price or rate changes taking effect mid-period |

Rounding deserves special attention. Calculating GST on each line and then adding the lines can give a result a cent different from calculating GST on the invoice total. Either may be acceptable, but the method must be consistent, match the business's accounting practice and agree with what customers' systems expect. Check current Australian Taxation Office guidance on rounding.

## Checking calculations independently

Never check a system's calculations using the same system. For pricing, costing, tax, payroll and commission calculations:

- **Build an independent calculation**, often in a spreadsheet, for each test scenario.
- **Compare results line by line**, not just totals.
- **Include combinations**, such as a customer discount applied to a promotional price with freight.
- **Investigate every difference**, even a cent, until the cause is understood.

## Trying to break the rules

Testing should deliberately attempt what should not be possible:

- Entering a negative quantity or a date in the wrong format.
- Saving a record without required information.
- Deleting a customer with open orders.
- Approving one's own purchase order where separation of duties is required.
- Exceeding a credit limit or discount authority.
- Importing a file with missing or extra columns.

A system that accepts these silently has a gap that real users will eventually find.

## Testing permissions

For each role, test what the user can and cannot see and do:

- **Can see**: records and fields needed for the role.
- **Cannot see**: sensitive information, such as pay rates, margins or other customers' data in a portal.
- **Can do**: the actions their role requires.
- **Cannot do**: approvals, deletions and exports beyond their authority.

Permission errors are easy to miss because testers often use administrator accounts. Test with accounts set up exactly as real users' accounts will be.

## Testing simultaneous use

Business systems are used by many people at once. Test situations such as:

- **Two users editing the same record** at the same time.
- **Two orders for the last unit of stock** placed simultaneously.
- **A report running while transactions are entered.**
- **Batch processes**, such as invoicing runs, while users are working.

These tests reveal problems with locking, stock reservation and data consistency that single-user testing never finds.

## Testing volume and performance

Test with realistic data volumes and user numbers: a system that is fast with 500 test records may be slow with five years of history. Time key actions and batch processes against agreed targets, and test the busiest periods, such as month-end and end of financial year.

## Testing reports

Reports are often tested last and least, yet decisions depend on them. For each important report:

- **Reconcile totals** with the underlying transactions and with independent sources, such as the bank or the general ledger.
- **Check filters and groupings**, such as whether cancelled orders are excluded.
- **Check period boundaries**, especially transactions on the last and first days of periods.
- **Look for double counting** where reports combine related records.

## Testing data migrations and integrations

If the change involves moving data from an old system or connecting to other systems, include:

- **Reconciliation of migrated records**: counts, balances and samples.
- **Processing of migrated open transactions**, such as invoicing an order created in the old system.
- **Integration tests** for normal records, errors, duplicates and outages.

## Running user acceptance testing

User acceptance testing confirms that the system supports real work. Plan it carefully:

1. **Choose testers** who do the work, including experienced staff who know the exceptions.
2. **Prepare scenarios and data** in advance, with expected results.
3. **Train testers** briefly on the system and on recording results.
4. **Record every result**: passed, failed or unclear, with evidence such as screenshots.
5. **Classify defects by severity** and agree which must be fixed before go-live.
6. **Retest fixes**, and rerun related scenarios in case fixes broke something else.
7. **Agree sign-off criteria**, such as all critical scenarios passed and no unresolved high-severity defects.

| Severity | Example | Typical rule |
|---|---|---|
| Critical | Wrong invoice totals, data loss, security breach | Must be fixed before go-live |
| High | A key process fails without a workaround | Fix before go-live, or approved workaround |
| Medium | A process works with an inconvenient workaround | Fix soon after go-live |
| Low | Cosmetic issues | Fix when convenient |

## Repeating tests after updates

Systems change after go-live through vendor updates, configuration changes and new features. **Regression testing** reruns key scenarios to confirm nothing has broken. Keeping the known dataset and its expected results makes regression testing quick, and automating the most important checks makes it routine. The [tests that cannot fail](/insights/tests-that-cannot-fail/) article explains how to make sure checks are capable of finding problems.

## Who should do the testing

Different people find different problems. Developers and vendors find technical faults; experienced users find gaps in business logic and awkward real-world cases; accounts staff find calculation and reconciliation errors; and someone unfamiliar with the system finds confusing screens and instructions. A small business does not need a dedicated test team, but it does need time set aside for the right people. Testing squeezed into the last days before go-live, alongside normal work, is usually superficial.

Plan testing time in the project schedule from the start, and treat users' testing time as a real cost of the project. A useful rule of thumb is that the people who will rely on a system should spend enough time testing it that they would be comfortable explaining its results to a customer or auditor.

## Recording and tracking defects

Every problem found should be recorded in one place, with a clear description, the steps to reproduce it, the expected and actual results, severity, who is fixing it and its status. A shared defect log, even a simple spreadsheet for small projects, prevents problems being forgotten, fixed twice or argued about. Review open defects regularly with the supplier, and do not close a defect until the person who found it has confirmed the fix.

## Common mistakes

- **Testing only the happy path** of typical transactions.
- **Using administrator accounts** for all testing.
- **Checking calculations with the system itself.**
- **Small test data** that hides performance and volume problems.
- **Testing reports last**, or not at all.
- **Unmasked personal data** in test environments.
- **No written sign-off criteria**, so go-live becomes a matter of opinion.
- **No regression testing** after vendor updates.

## A worked example

This is an illustrative example. An electrical contracting business is replacing its quoting and invoicing spreadsheets with a configured job management package. The vendor has tested the product, but the business's price lists, labour rates, discounts, GST settings and reports are its own configuration.

**Preparation.** The operations manager and two estimators write 60 scenarios from recent jobs, including a quote with GST-free items, a variation approved after partial invoicing, a job spanning 30 June, and a strata customer with a negotiated discount and a separate billing address. The accounts officer builds a spreadsheet that independently calculates expected totals for each.

**Findings.** Testing finds that GST is calculated on each line and rounded, while the accounting system recalculates on the total, producing one-cent differences on about one invoice in five. A variation entered after a part-invoice doubles a discount. A job created on 30 June appears in the wrong financial year in one report. A site supervisor's role can see labour cost rates.

**Fixes and retest.** The vendor adjusts the GST setting to match the accounting system, a configuration error causing the double discount is corrected, the report filter is changed to use the invoice date, and the supervisor role is restricted. All 60 scenarios are rerun, and two further minor issues are fixed.

**Result.** The system goes live with signed-off scenarios and a regression set of 20 key scenarios that is rerun after each vendor update. The one-cent GST issue alone would have created reconciliation work every month and confused customers.

## Applying this in an Australian business

- **Test your configuration**, not only the vendor's product.
- **Use masked or synthetic test data**, never unprotected real data.
- **Write scenarios from real work**, including awkward cases.
- **Test GST, rounding and financial year boundaries** carefully.
- **Check calculations independently.**
- **Test each role's permissions** with realistic accounts.
- **Test simultaneous use, volume and reports.**
- **Agree sign-off criteria** and keep a regression set for updates.

## Questions worth considering

- Who in our business will test our next system change, and with what scenarios?
- How would we know if invoices were a cent out on some lines?
- Do our test environments contain real customer or employee data?
- Have we tested what each role can see, using real user accounts?
- What do we rerun after a vendor update?

## Bringing it together

Data-heavy business systems fail in predictable places: calculations, rounding, dates, permissions, simultaneous use, volume and reports. Prepare safe, realistic test data, write scenarios from real business work, cover edge cases deliberately, check calculations independently, try to break the rules, test each role's access, reconcile reports, run structured acceptance testing with clear sign-off criteria and repeat key tests after every change. The effort is small compared with the cost of errors that flow quietly into invoices, accounts and decisions.

---

*Source: KEVOS® editorial notes, drawing on general software testing and business systems implementation practice. Tax rounding is mentioned for illustration; check current Australian Taxation Office guidance. The worked example is illustrative. This article is general information.*
