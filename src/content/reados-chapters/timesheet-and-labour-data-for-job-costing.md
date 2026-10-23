---
title: "Timesheet and labour data for job costing: capturing hours accurately so job profits can be trusted"
description: "Labour is often the largest and least accurate cost in job costing. How to structure timesheet data, calculate loaded labour rates, capture hours reliably and quote better."
publishDate: 2026-10-09
category: "Operations"
tags:
  - operations
  - finance
  - systems
author: "KEVOS®"
featured: false
draft: false
---

In fabrication shops, maintenance contractors, installers, engineering consultancies and many other project-based businesses, labour is the largest controllable cost of most jobs. Job profitability reports, quotes for future work, progress claims and decisions about which work to pursue all rely on knowing how many hours went into each job and what those hours cost. Yet labour data is often the least reliable data in the business: hours written on paper at the end of the week from memory, allocated to whichever job seemed most likely, or lumped into a general code because nobody knew where else to put them.

When labour data is unreliable, job reports mislead. A profitable type of work looks marginal because it absorbs hours that really belonged elsewhere; an unprofitable type looks fine; estimators keep quoting from assumptions that the business never tests against reality. Payroll errors and award compliance problems can follow, with serious consequences.

This article explains what labour data needs to capture, how to calculate realistic labour cost rates, how to structure jobs and cost codes, how to capture time accurately, how approvals and payroll compliance fit in, and how to use the results to improve estimating and decisions. It is general information for owners and managers of project-based businesses, not payroll or employment advice.

## Why labour data matters

Accurate labour data supports:

- **Job costing**: knowing the real cost and margin of each job.
- **Estimating**: comparing actual hours with estimates to improve future quotes.
- **Billing**: charging customers correctly for time and materials work and variations.
- **Payroll**: paying people correctly, including overtime, penalties and allowances.
- **Productivity**: seeing where time goes, including travel, waiting and rework.
- **Work in progress**: valuing unfinished jobs for financial reporting.

## What labour data should capture

Each time entry typically records:

| Field | Purpose |
|---|---|
| Person | Who did the work |
| Date and start and finish times | When, supporting payroll and award compliance |
| Job | Which job the time belongs to |
| Task or cost code | Which part of the job, such as fabrication, installation or commissioning |
| Activity type | Normal work, travel, rework, waiting or training |
| Chargeable or non-chargeable | Whether the time can be billed or is overhead |
| Hours | Duration, including any overtime split |
| Notes | Brief description, especially for variations or problems |

Recording start and finish times, not just totals, supports payroll calculations under awards and agreements, which often depend on when work was performed.

## Calculating loaded labour cost rates

A worker's hourly wage is only part of what an hour of labour costs the business. A **loaded labour rate** adds the costs that come with employment, such as:

- **Superannuation guarantee contributions**, at 12% of ordinary earnings from 1 July 2025.
- **Leave**: annual leave, personal leave and public holidays, which are paid but not worked.
- **Payroll tax**, for businesses above state thresholds.
- **Workers compensation insurance.**
- **Other on-costs**, such as allowances, protective equipment and training.

Then there is **non-chargeable time**: hours that are worked and paid but cannot be charged to jobs, such as workshop maintenance, meetings, training and waiting.

For illustration, consider a tradesperson who earns $40 an hour. Adding superannuation at 12% gives $44.80. Allowing about $7.20 an hour for paid leave and public holidays and about $3.00 an hour for payroll tax and workers compensation gives a loaded cost of roughly $55 per hour worked. If about 80% of worked hours are chargeable to jobs, the cost per chargeable hour is about $55 ÷ 0.8, or roughly $69. Costing jobs at the $40 wage would understate the cost of each chargeable hour by about $29, or more than 40%. Actual on-costs vary by business, state, award and individual circumstances, so calculate your own with your accountant.

```figure
type: stack
title: From a $40 wage to a loaded labour rate
unit: $
caption: About $55 per hour worked; at 80% chargeable, about $69 per chargeable hour, more than 40% above the wage.
- Wage | 40
- Superannuation at 12% | 4.80
- Paid leave and public holidays | 7.20
- *Payroll tax and workers compensation | 3.00
```

### Keep rates current

Loaded rates go out of date. Award minimum wages usually change from 1 July each year after the Fair Work Commission's annual wage review, enterprise agreements set their own increases, and on-costs such as insurance premiums and payroll tax change too. Review loaded rates at least annually, and whenever wages or on-costs change significantly, so job costs and quotes keep pace. Keep separate rates for different trades or classifications where their costs differ materially.

## Structuring jobs and cost codes

Cost codes divide jobs into parts that can be compared with estimates. Good structures:

- **Match how jobs are estimated**, so actual and estimated hours can be compared line by line.
- **Use a standard set of codes** across jobs, so results can be compared between jobs.
- **Are detailed enough to guide decisions**, but not so detailed that people guess. A dozen codes used accurately are better than a hundred used carelessly.
- **Include codes for variations**, so extra work requested by customers is captured and can be charged.
- **Separate rework and waiting**, which reveal problems worth fixing.

The [estimating project costs from cost drivers](/reados/collections/project-estimates-schedules-and-costs/estimating-project-costs-from-cost-drivers/) article explains how estimates built on clear cost drivers become easier to compare with actual results.

## Capturing time accurately

Accuracy depends most on **when** time is recorded and **how easy** recording is:

- **Record daily, or as work happens.** Hours recalled at the end of the week are estimates, not records.
- **Make job selection easy and reliable.** Scanning a barcode on a job sheet, or selecting from a short list of the person's current jobs on a phone, prevents mistyped job numbers. The [designing identifiers and check digits](/reados/collections/operational-data-records-and-controls/designing-identifiers-and-check-digits/) article explains how check digits catch typing errors.
- **Use mobile apps or kiosks** where paper creates delays and transcription errors.
- **Prompt for unallocated time**, so hours do not default into general overhead codes.
- **Capture travel separately**, because travel is a real cost that may or may not be chargeable.
- **Keep it quick.** If recording time takes more than a minute or two a day, people will delay it or guess.

## Common sources of error

| Error | Effect |
|---|---|
| Time recorded from memory days later | Hours spread across jobs inaccurately |
| Wrong job number | Costs appear on the wrong job |
| Large "general" or "workshop" allocations | Job costs understated, overheads overstated |
| Rounding to whole or half days | Small jobs distorted |
| Overtime allocated to whichever job was last | Some jobs carry others' costs |
| Travel and waiting not recorded | Real costs of remote or disorganised jobs hidden |
| Variations not separately coded | Extra work not charged to customers |

## Approvals and checks

Supervisors or project managers should review time regularly, ideally daily or at least weekly:

- **Check that hours match attendance**, such as site sign-in records or clock data.
- **Query unusual allocations**, such as time on closed jobs or large amounts of general time.
- **Approve variations and overtime.**
- **Correct errors before payroll and invoicing.**

Reports of unallocated time, time on closed jobs and hours exceeding estimates help supervisors focus their checks.

## Payroll and award compliance

Timesheet data is also payroll data. Under the Fair Work Act, employers must keep employee records, including hours worked where relevant, for seven years. Modern awards and enterprise agreements set out overtime, penalty rates and allowances that depend on when and how long people work. Errors in time capture can therefore lead to underpayments, and under federal law, intentional underpayment of wages became a criminal offence from 1 January 2025. Make sure timesheet systems capture the information payroll needs, that payroll calculations are checked against the applicable award or agreement, and seek advice from an accountant, payroll specialist or the Fair Work Ombudsman's resources when unsure.

## Using the data

Accurate labour data becomes valuable when it is used:

- **Job reviews**: compare actual and estimated hours by cost code at the end of each job, and discuss the causes of large differences.
- **Estimating feedback**: update estimating norms, such as hours per tonne fabricated or per unit installed, from completed jobs.
- **Live job tracking**: compare hours to date with progress, so overruns are found while they can still be managed.
- **Productivity analysis**: track chargeable time, rework and waiting by team and job type.
- **Pricing decisions**: identify job types that are consistently more or less profitable than assumed.

The [project cash flow versus cost reports](/reados/collections/project-estimates-schedules-and-costs/project-cash-flow-versus-cost-reports/) article discusses how cost data and cash flow tell different stories about jobs.

## Subcontractors and labour hire

Many businesses supplement employees with subcontractors and labour-hire workers. Their hours belong on jobs too, but they often arrive through invoices weeks later, coded only to the job as a whole. Ask subcontractors and labour-hire providers to record time against the same job and cost codes, or capture their hours through the same app or site sign-in, so job reports show labour consistently whoever performed it. Check invoiced hours against site records before paying.

## Work in progress and unbilled time

For jobs that run across months, recorded labour hours feed **work in progress**: the value of work done but not yet invoiced. Accurate, timely time records let the business invoice progress claims and time-and-materials work promptly, value work in progress correctly in its accounts and spot jobs where costs are running ahead of billing. Unrecorded or late time delays invoices and weakens cash flow, which is one of the strongest arguments for daily time capture.

## Introducing a new time capture system

Changing how people record time affects everyone, so introduce it carefully. Explain why accurate data matters, including fair pay and better quoting, not just management control. Involve supervisors and a few workers in choosing and testing the tool. Keep the first version simple, with a short list of codes, and expand only when it is working. Run old and new methods side by side for a short period, compare results and provide quick help for the first weeks. Most resistance fades when people find the new method quicker than the old paper sheet.

## Privacy and tracking

Some time capture systems record locations, such as GPS positions when people clock in on site. These can verify attendance and support travel analysis, but they raise privacy and workplace surveillance obligations, and some states require notice before tracking employees. Explain what is recorded and why, limit access to location data and keep it only as long as needed.

## Common mistakes

- **Costing labour at wage rates** instead of loaded rates.
- **Weekly paper timesheets** filled in from memory.
- **Too many cost codes**, encouraging guesswork.
- **No codes for variations, rework and waiting.**
- **General time dumped into overhead** without review.
- **Never comparing actual with estimated hours.**
- **Timesheets that do not capture what payroll needs** under awards.

## A worked example

This is an illustrative example. A structural steel fabrication and installation business employs about 30 tradespeople. Workers fill in paper timesheets on Friday afternoons, which an administrator types into the job costing system on Monday. About 15% of hours are recorded against a general workshop code, and job reports show most jobs close to their estimated margins.

**Change.** The business introduces a mobile time app. Each job sheet carries a barcode, and workers scan it when they start a task and select a cost code from a short list: cutting, drilling, welding, painting, loading, installation, travel, rework and waiting. Supervisors approve time daily. A loaded labour rate, calculated with the accountant, replaces the wage rate in job costing.

**Findings.** Within three months, hours on the general code fall to about 4%. With time now accurately allocated and costed at loaded rates, job reports show that small stair and handrail jobs, quoted from old norms, consistently take about 20% more hours than estimated, while large structural jobs are slightly more profitable than thought. Rework on painting accounts for a noticeable share of hours on several jobs.

```figure
type: bars
title: Hours booked to the general workshop code
unit: %
max: 20
caption: Accurate allocation showed small stair and handrail jobs taking about 20% more hours than estimated.
- Paper timesheets typed in on Monday | 15
- *Mobile app with job barcodes, three months on | 4
```

**Actions.** Estimating norms for stairs and handrails are updated, prices rise accordingly, and a review of painting preparation reduces rework.

**Result.** Quotes better reflect real costs, and managers trust job reports enough to use them in deciding which work to pursue. The administrator who spent most of each Monday typing timesheets now spends that time checking exceptions and preparing invoices, which go out several days sooner.

## Applying this in an Australian business

- **Calculate loaded labour rates**, including superannuation, leave, payroll tax and workers compensation.
- **Align cost codes** with how jobs are estimated.
- **Capture time daily**, with easy and reliable job selection.
- **Record travel, rework, waiting and variations** separately.
- **Approve time regularly** and review unallocated hours.
- **Make sure timesheets support payroll** under awards and agreements, and keep records for seven years.
- **Compare actual with estimated hours** and update estimating norms.
- **Handle location tracking** in line with privacy and surveillance obligations.

## Questions worth considering

- What share of our labour hours is recorded against general or overhead codes?
- Do our job costs use loaded labour rates or wage rates?
- How long after the work are hours recorded?
- Which job types consistently take longer than we estimate?
- Do our timesheets capture everything payroll needs under our awards?

## Bringing it together

Labour data drives job costing, estimating, billing and payroll, yet it is often the least accurate data in project-based businesses. Capture time daily with easy, reliable job selection, use cost codes that match estimates, record travel, rework, waiting and variations separately, cost labour at loaded rates, approve time regularly and make sure records support payroll compliance. Then use the data: compare actual with estimated hours, update estimating norms and decide which work to pursue based on costs that can be trusted.

---

*Source: KEVOS® editorial notes, drawing on general job costing, payroll and operations practice. Employment and payroll obligations are summarised for orientation; seek professional advice for your circumstances. Figures in the worked examples are illustrative. This article is general information.*
