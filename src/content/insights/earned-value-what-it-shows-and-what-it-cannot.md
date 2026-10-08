---
title: "Earned value: what it shows about a job, and what it cannot"
description: "Earned value compares work done with work planned and money spent. How to measure it honestly, read the indices in context and not mistake delivery efficiency for a job worth doing."
publishDate: 2026-10-08
category: "Business"
tags:
  - finance
  - operations
  - systems
author: "KEVOS"
featured: false
draft: false
---

A job's cost report says $66,000 has been spent against a budget of $120,000. Is that good news or bad? On its own, nobody can say. If half the work is done, the job is running roughly to budget. If a third of the work is done, it is heading for a large overrun. If two-thirds is done, it is doing well. Comparing spending with budget tells you how fast money is leaving, not what it has bought.

**Earned value** fixes that by adding a third number: the budgeted value of the work actually completed. With it, a business can see whether a job is converting time and money into finished work at the rate it planned, and forecast where it is likely to land. It is one of the most useful measures available for significant jobs, and one of the most easily misread.

This article explains the three numbers behind earned value, how to measure progress so the result means something, how to read the indices in context, and why a green earned value report can sit alongside a job that is in trouble. It is general information for owners and managers who run or oversee projects.

## Three numbers

Earned value uses three figures, all measured at the same date:

| Figure | Meaning | Question it answers |
|---|---|---|
| **Planned value (PV)** | The budget for the work scheduled to be done by now | How much work should we have done? |
| **Earned value (EV)** | The budget for the work actually completed by now | How much work have we done, valued at its budget? |
| **Actual cost (AC)** | What the completed work has actually cost | What did it cost us? |

From these come two simple variances and two indices:

- **Cost variance** = EV − AC. Negative means the work done has cost more than its budget.
- **Schedule variance** = EV − PV. Negative means less work is done than planned. It is measured in dollars, not days.
- **Cost performance index (CPI)** = EV ÷ AC. Below 1 means each dollar spent is producing less than a dollar of budgeted work.
- **Schedule performance index (SPI)** = EV ÷ PV. Below 1 means work is being completed more slowly than planned.

Two simple forecasts of final cost follow. If the cost performance so far continues, the **estimate at completion** is the total budget divided by the CPI. If the problems so far were one-off and the remaining work will go to budget, it is the actual cost plus the budget for the remaining work. The truth usually lies between, and showing both as a range is more honest than choosing one.

## "Value" means budget, not benefit

The word "value" causes the most common misreading. In earned value, value means **the budget assigned to completed work**. It is not customer value, revenue, profit or business benefit. A job can earn its planned value perfectly while building something nobody will use, because the measure only asks whether authorised work is being completed efficiently, not whether that work is still worth doing.

That is not a flaw. It is a boundary. Earned value answers one question well: relative to the agreed plan, how efficiently is this job turning time and money into finished scope? Other questions need other evidence:

- Is the work fit for purpose and passing its checks?
- Is the finish date safe, given which tasks are late?
- Will the people who receive the result be ready to use it?
- Are the expected benefits still achievable?
- Has something outside the job changed whether it is worth finishing?

## The baseline decides whether the numbers mean anything

Earned value is only as good as the plan it measures against. That plan, the **baseline**, needs three things: work broken into defined packages, a schedule showing when each package should be done, and a budget for each package. If the work is vague, completion cannot be measured. If the schedule is unrealistic, comparing against it gives false comfort or false alarm. If budgets are not attached to work packages, earned value loses its meaning.

Changes need discipline too. When a change is genuinely approved, the baseline should be updated openly, with a record of why. Two opposite habits destroy the signal:

- **Rebaselining constantly** to make bad variances disappear, so the history of the job is erased.
- **Refusing to update the baseline** after a real approved change, so the job is measured against a plan nobody is following.

Anyone reading the report should be able to tell whether a baseline change reflects an approved change to the job or an attempt to restore a better-looking number. The [record of what you promised](/insights/keeping-the-record-of-what-you-promised/) article covers baselines and change control.

## Progress rules: where honesty lives

The most important design choice in earned value is how work **earns** its value. If progress is reported as a percentage someone estimates, the result can look precise while being a guess. "The hood is 90% done" is a judgement. Rules agreed in advance remove most of the judgement:

- **0/100**: a package earns nothing until complete. Suits short packages lasting a reporting period or less.
- **50/50** or similar fixed formulas: half on starting, half on finishing. Suits short packages spanning two reporting periods.
- **Weighted milestones**: defined steps within a longer package each earn a set share, such as 60% on installation and 40% on passing inspection.
- **Units completed**: for repetitive work, each unit earns its share of the budget.
- **Measured physical progress**: where progress can be objectively measured, such as metres laid.

Two principles matter more than the choice of method. First, **reported progress should never run ahead of demonstrated achievement**. Second, **quality should gate earning**: if a package fails its agreed check, it has not fully earned its value, however much effort it absorbed. Shorter packages with tangible outputs make all of this easier; the [sizing work packages](/insights/sizing-work-packages-to-find-problems-in-time/) article covers why.

## Read the indices in context

The indices are signals, not verdicts. Some common traps:

- **A good CPI can hide deferred work.** Spending is low because work has not started, or because a supplier has not invoiced yet.
- **A poor CPI can be deliberate.** The business may have approved paying overtime to protect a finish date that matters more than the cost.
- **The SPI says nothing directly about the finish date.** It adds up all work across the job. Being behind on work with plenty of spare time is harmless; being slightly behind on the critical path is not. Check the schedule, not just the index.
- **Forecasts assume the future resembles the past.** That is reasonable for repetitive work and weak for commissioning, approvals or anything new.

When performance is poor, the response should not be automatic. Options include fixing how the work is done, resequencing, changing scope, paying to accelerate, changing the delivery approach or stopping. Judge each by what it does for the business, not by how much it improves the index.

## Put it in a wider view

Earned value becomes more useful when it sits alongside other measures, so a green delivery number cannot hide a red condition elsewhere:

1. **Delivery efficiency**: cost and schedule indices.
2. **Technical performance**: requirements met, defects, test results.
3. **Schedule health**: critical-path dates, remaining float, dependencies.
4. **Readiness**: whether the people who will use the result are prepared.
5. **Benefits**: whether the reason for the job still holds.

The [reports that change decisions](/insights/reports-that-change-decisions/) article covers building reports around forecasts and decisions rather than status colours.

## Is it worth the effort?

Running earned value properly takes effort: defined packages, budgets by package, cost coding and regular measurement. It is most valuable on jobs that are large relative to the business, can be broken into clear packages, and where losing visibility would be expensive. For small, short or exploratory jobs, a simpler comparison of milestones and spending may be enough. Some contracts, particularly in government and defence work, require formal earned value reporting; Standards Australia publishes AS 4817 on earned value performance measurement, and any contractual requirement should be checked against the current edition.

## Setting it up for one job

For a first attempt, choose one significant job and keep the setup simple:

1. **Break the job into packages** of a few weeks or less, each with a clear output.
2. **Give each package a budget** that adds up to the job budget, and a planned completion date.
3. **Choose a progress rule for each package** before work starts, and write it down.
4. **Code actual costs to packages**, including labour, materials and subcontractors, and note invoices still to come.
5. **Measure at a fixed interval**, such as every fortnight, and record PV, EV and AC for the job.
6. **Review the result with the schedule** and decide what, if anything, to change.

After two or three jobs, the business will also have a useful record of how its estimates compare with reality, package by package.

## A worked example

This is an illustration. A commercial kitchen fit-out business has a 12-week job with a cost budget of $120,000, broken into six packages:

| Package | Budget |
|---|---|
| Strip-out | $10,000 |
| Plumbing and gas rough-in | $20,000 |
| Electrical rough-in | $15,000 |
| Exhaust hood and ductwork | $25,000 |
| Cool room | $20,000 |
| Equipment installation and commissioning | $30,000 |
| **Total** | **$120,000** |

By the end of week 6, the plan called for the first four packages to be complete, so planned value is $70,000. Actual cost to date is $66,000.

The site supervisor reports the first four packages as done. On that basis, earned value is $70,000, the SPI is 1.00 and the CPI is 70 ÷ 66 = 1.06. The job looks on schedule and under budget.

But the business uses a weighted-milestone rule for the hood: 60% on installation and 40% on passing the fire and ventilation inspection. The hood was installed but failed inspection and needs rework. It has earned 60% of $25,000, which is $15,000. Earned value is therefore $10,000 + $20,000 + $15,000 + $15,000 = $60,000.

Now the picture is different:

- **SPI** = 60,000 ÷ 70,000 = 0.86. Work is behind plan.
- **CPI** = 60,000 ÷ 66,000 = 0.91. Each dollar is producing about 91 cents of budgeted work.
- **Estimate at completion**, if cost performance continues: 120,000 × 66,000 ÷ 60,000 = $132,000.
- **Estimate at completion**, if the remaining work goes to budget: 66,000 + (120,000 − 60,000) = $126,000.

The forecast range is $126,000 to $132,000, an overrun of $6,000 to $12,000.

The owner then checks the schedule rather than relying on the SPI. The cool room is independent of the hood and can start on time. But equipment commissioning cannot finish until the hood passes inspection, so the hood rework sits on the critical path. The owner books the re-inspection, asks the ductwork subcontractor to fix the defect under warranty, and moves the cool room installers forward to use the waiting time.

The same job, measured two ways, told two different stories. The difference came entirely from the progress rule.

## How this applies to a small Australian business

- **Use earned value on significant jobs** that can be broken into clear packages.
- **Budget each package**, and schedule when it should be complete.
- **Agree progress rules in advance**, and avoid estimated percentages.
- **Let quality checks gate earning.**
- **Show forecasts as a range**, not a single number.
- **Check the schedule** before reading anything into the SPI.
- **Record every baseline change**, with its reason.
- **Keep earned value alongside** quality, readiness and benefit measures.

## Signals worth watching

- Progress reported as percentages nobody can verify.
- Packages showing complete before their inspections have passed.
- Frequent rebaselining with little explanation.
- A green CPI while large invoices are still to arrive.
- Discussion of the SPI with no reference to the critical path.
- Earned value reports nobody uses to make a decision.

## Common mistakes

- **Reading "earned value" as business value.**
- **Measuring progress by opinion.**
- **Counting work that failed its checks.**
- **Treating the SPI as a finish-date forecast.**
- **Rebaselining to hide variance.**
- **Applying full earned value to every small job.**

## Frequently asked questions

**Do we need special software?** No. A spreadsheet with work packages, budgets, planned completion dates, progress rules and actual costs by package is enough for most small-business jobs.

**How often should we measure?** At each reporting period, often fortnightly or monthly. Shorter jobs need more frequent measurement.

**What if our accounts do not track costs by package?** Start with job-level costs and the largest packages. Cost codes by package make earned value far more useful.

**Can earned value predict the finish date?** Not reliably on its own. Use the schedule for dates and earned value for efficiency.

**Is a CPI of 0.95 a problem?** It depends on the job, the trend and the reserve available. A steady small shortfall on a long job adds up; an early dip caused by one-off costs may not.

## Questions to ask

- What is the budget for the work we have actually completed?
- What rules decide when work counts as complete?
- Has any counted work failed its checks?
- Which late work sits on the critical path?
- What range of final cost does our performance suggest?
- Is the work we are completing efficiently still the right work?

## Bringing it together

Earned value adds the missing number to a cost report: the budgeted value of work actually done. With it, a business can see cost and schedule efficiency and forecast final cost as a range. The numbers are only as honest as the baseline and the progress rules behind them, so agree those rules in advance and let quality gate earning. Read the indices in context, check the schedule for dates, and keep earned value alongside quality, readiness and benefit measures. It shows how efficiently a job is being delivered, not whether the job is still worth doing.

---

*Source: KEVOS notes, drawing on teaching material on earned value management, performance baselines, progress measurement and project controls, and Standards Australia's AS 4817 on earned value performance measurement. Examples and figures in this article are illustrations. This article is general information.*
