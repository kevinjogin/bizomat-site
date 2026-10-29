---
book: outcome-first-projects-by-the-numbers
chapterSlug: holding-delivery-to-the-outcome
order: 10
title: "Holding acceptance and benefit tracking to the outcome"
description: "Acceptance tests from requirements, monthly tracking of 93 failures in 4,680 deliveries (98.01%), a seasonal energy claim corrected from 1.38 to 1.154 MJ/kg, and the tunnel gate."
draft: false
---

Approval is the point at which an outcome-first project is most at risk of becoming a deliverables project again. The equipment arrives, the installers want a signature, the managers have other work, and the measures that justified the decision quietly give way to "it's in and running". This chapter carries the four measures through to the end: into the acceptance of the new ironer line, into monthly tracking during the 26 weeks that decide the tender, into the comparison of energy across seasons, and into the gate that will decide, years from now, whether the laundry needs a tunnel washer after all.

The rule is simple to state. Acceptance, tracking and later decisions use the same measures, with the same definitions, baselines and targets, as the decision to approve. If any of them changes, the change is recorded and explained, never made quietly.

## Acceptance tests written from the requirements

This is an illustration. All amounts are Australian dollars excluding GST. Chapter 9 derived five requirements for Option B from the targets. Each becomes an acceptance test with a method, a pass condition and a record. The point of the tests is not to prove that the equipment works. It is to prove that the target can be reached.

```figure
type: compare
title: Acceptance tests derived from Option B's requirements
cols: Test | Pass condition | Record
caption: This is an illustration. Each test uses the requirement's own unit and period. R1 is tested on the customer's mix, not the vendor's demonstration linen.
- R1 Ironer rate | Run the new line on a sample of the hospital mix, defined from the dockets, with repeat runs | at least 540 kg/h nominal; effective capacity with line 2 at least 599.0 kg/h | test sheets signed by the vendor and the operations manager
- R2 Availability | Downtime log for the 8 weeks after acceptance | at least 95% | maintenance leader's weekly log
- R3 Loading | Van departure times from the dock | hospital by 04:45, hotel by 08:00, every day | dispatch supervisor's daily sheet
- R4 Water and hygiene | Mains meter, clean dispatched kg, rewash log, hygiene audit | at most 10.0 L/kg monthly; rewash at most 4%; AS 4146:2024 met | finance manager's monthly report
- R5 Energy | Gas and electricity meters, clean dispatched kg | at most 5.0 MJ/kg on the period average, season-adjusted for comparison | finance manager's monthly report
```

The new ironer line was accepted in month 5, after its rate test on the hospital mix passed. R2 then ran into the evidence window: the line's availability over its first 8 weeks was tracked weekly, because each breakdown in those weeks would count directly against the tender.

## Leading and lagging measures

The four outcome measures are lagging: they report what has already happened, a month at a time. By the time a monthly OTIF figure shows a problem, several weeks of the evidence window have gone. The laundry therefore tracked a small set of leading measures, chosen because Chapter 6's cause analysis showed them to drive the failures.

- **Vans loaded by 04:45 and 08:00**, daily, from R3. A late van is a likely failure before the customer signs anything.
- **Flatwork carried over at the end of the second shift**, daily, in kilograms. Carry-over was the mechanism behind the 157 peak-day backlog failures; with the new line it should be near zero.
- **Line availability**, weekly, from the downtime log, for both ironer lines.
- **Soiled-linen collection times** against the customer agreement, weekly, by customer.

Each leading measure has an owner from the benefits dependency network of Chapter 7 and a trigger for action, such as two days of carry-over in a week or one van late on two days. The lagging measures are reported monthly by the finance manager in one page: failures against the cumulative allowance, cost per clean kilogram, litres per kilogram and megajoules per kilogram.

## Monthly tracking in the evidence window

The evidence window is months 6 to 11, January to June: 26 weeks, about 4⅓ weeks or 780 deliveries a month, 4,680 in all. The tender allows at most 93 failures. Option B's estimate was 84.0.

```figure
type: line
title: OTIF by month in the evidence window, against 98%
x: Month of the evidence window
y: OTIF, %
legend: Month's OTIF | Cumulative OTIF | Target
ymin: 96
ymax: 99
caption: This is an illustration. Month 6 started well below 98%, and cumulative OTIF stayed below the target until the final month, when it reached 98.01%: 93 failures in 4,680 deliveries, exactly the number allowed.
- Jan | 96.9 | 96.92 | 98
- Feb | 97.8 | 97.37 | 98
- Mar | 98.2 | 97.65 | 98
- Apr | 98.3 | 97.82 | 98
- May | 98.5 | 97.95 | 98
- Jun | 98.3 | 98.01 | 98
```

Month 6 had 24 failures, 96.9%, as the new line and the loading shift settled in. The following months had 17, 14, 13, 12 and 13. The total was **93 failures in 4,680 deliveries, 98.01%**: a pass, with no margin at all.

A single month is a small sample. If the process were running exactly at a 2% failure rate, a month of 780 deliveries would average 15.6 failures, and the three-sigma upper limit would be about 27.3 failures, an OTIF of 96.5%. Month 6's 24 failures were inside that limit, so on its own the month did not prove the process was worse than 2%. But the tender does not judge months one at a time. It judges the total, and the total is what the laundry tracked.

```figure
type: compare
title: Failures against the cumulative allowance
cols: Failures | Cumulative | Even pace of 15.5 a month | Allowance left | Required for the rest of the window
caption: This is an illustration. After month 6 the laundry was 8.5 failures behind an even pace and had to beat 98% in every remaining month. It did, by the smallest possible margin.
- Month 6, January | 24 | 24 | 15.5 | 69 | at most 1.77% failures: OTIF 98.23%
- Month 7, February | 17 | 41 | 31.0 | 52 | at most 1.67%: OTIF 98.33%
- Month 8, March | 14 | 55 | 46.5 | 38 | at most 1.62%: OTIF 98.38%
- Month 9, April | 13 | 68 | 62.0 | 25 | at most 1.60%: OTIF 98.40%
- Month 10, May | 12 | 80 | 77.5 | 13 | at most 1.67%: OTIF 98.33%
- * Month 11, June | 13 | 93 | 93.0 | 0 | window complete: 98.01%
```

## When a target is this tight

The table changed how the laundry managed the window. After month 6 the question was no longer "are we at 98% this month?" but "how many failures can we still afford, and what rate does that require?". Three practices followed.

**Track the allowance weekly.** The operations manager recalculated the remaining allowance every Monday from the signed dockets, with the failures coded by cause as in Chapter 6. A failure coded to dispatch went to the dispatch supervisor the same day.

**Prepare responses before they are needed.** The owners agreed in advance what would happen if the cumulative count moved further behind the even pace: peak-day overtime on the ironers and a standby driver, both costed and approved before the window opened, so that nobody needed a meeting to act.

**Do not move the goalposts.** Under pressure there are easy ways to improve a number without improving the service: splitting a late order into an on-time partial delivery and a second docket, or agreeing a later cut-off with a friendly ward manager. Both breach the definitions fixed in Chapter 3, and both would have been found by the hospital group's own records. The laundry reported against the measures as written.

The result also says something about the estimates. Option B was expected to remove 328.05 failures and removed 319, 97.2% of the forecast. The shortfall, 9.05 failures, was exactly the margin the estimate had left. Benefit forecasts tend to be optimistic, and a pass that depends on every estimate holding is a pass at risk. [Schedule, benefits and the cost of delay](/reados/publications/reference-class-forecasting-by-the-numbers/schedule-and-benefit-forecasts/) in *Reference Class Forecasting by the Numbers* shows how the realisation of past projects' benefits can be used to correct such a forecast before approval, which would have told the owners to expect a closer result than 98.2%.

## Reviewing the estimates cause by cause

A total that passes can hide estimates that failed. Option B's 84.0 failures were built from five separate estimates, one for each cause in Chapter 6's Pareto: 7.9 left from peak-day backlog, 11.1 from breakdowns, 22.2 from dispatch, 29.6 from wash capacity and 13.2 from late soiled linen. Because every failed docket in the window was coded with the same rule as the baseline, the review after the window can set the actual count for each cause beside its estimate.

That comparison is more useful than the total for three reasons. It shows which business changes worked as planned and which did not, so that effort goes where it is needed before the next contract period. It shows whether the coding itself drifted: if dispatch failures fell sharply while "late soiled linen" rose, the review must check whether failures were being recoded to the customer. And it calibrates the next estimate. A laundry that knows its dispatch estimate held and its backlog estimate was optimistic will estimate better when the tunnel decision comes.

The review uses four questions, written before the window opened:

- For each cause, how did the actual count compare with the estimate, and why?
- Were the definitions, cut-offs and coding rule applied unchanged throughout?
- Which leading measures moved before the lagging ones, and by how long?
- What did the shortfall of 9.05 failures against the estimate come from?

The answers go into the same one-page report as the measures, with an owner for each action.

## Comparing energy across seasons

Energy per kilogram changes with the season even when nothing else does. The wash runs at 70 °C, and the incoming water is about 12 °C in winter and 22 °C in summer, against an annual average of 17 °C. Heating the wash takes about 9.4% more gas than average in winter and 9.4% less in summer. In the baseline, wash gas of 2.4 MJ/kg becomes 2.174 MJ/kg in summer and 2.626 in winter, and whole-plant energy in summer is 5.774 MJ/kg, not 6.00.

Option B carries the same pattern: it is expected to use 4.763 MJ/kg in summer, 5.022 in winter and 4.892 over a year. A winter month above 5.0 MJ/kg does not mean the option has failed; the tender assesses the reporting-period average, and R5 states the averaging period and requires the method to be reported. But any comparison of one month with the baseline must compare like with like.

## The error: a summer month against an annual baseline

This is an illustration. The first monthly report in the evidence window showed January energy of **4.62 MJ/kg**. The draft report compared it with the annual baseline of 6.00 MJ/kg and claimed a saving of **1.38 MJ/kg**, 23%, well above the 1.108 MJ/kg the option was designed to deliver. A paragraph was drafted for the tender submission.

The finance manager questioned it before it went anywhere. Gas per kilogram had fallen further than the heat-recovery and washer changes could explain, and the gas invoices showed the same fall in previous summers. Comparing gas use with the incoming-water temperature, recorded at the plant room, showed that most of the extra fall was the season. The correct comparison is with the summer baseline of 5.774 MJ/kg: a saving of **1.154 MJ/kg**, about 20.0%. The draft had overstated the saving by 0.226 MJ/kg, about a fifth.

```figure
type: compare
title: January energy: the raw claim and the season-adjusted comparison
cols: Raw claim | Season-adjusted
caption: This is an illustration. The season-adjusted saving is real and close to the design value; the raw claim credited the summer to the project. A winter month would show the opposite error and look like a failure.
- January energy, MJ/kg | 4.62 | 4.62
- Baseline used | annual, 6.00 | summer, 5.774
- * Saving claimed | 1.38 MJ/kg | 1.154 MJ/kg
- Option B's expected value for the month | not considered | summer, 4.763: January was 0.143 better
```

The correction was written into R5: monthly energy is reported as measured, against the tender threshold on the period average, and compared with the baseline only after adjusting both to the same incoming-water temperature, with the method stated. The same mistake in reverse would have done more damage. In June, a winter month, a raw comparison would have made the option look as if it were failing, and could have prompted changes to settings that were working.

## The tunnel-washer gate

Option C left one decision open: a tunnel washer and extension, about A$5.0 million, when washing capacity actually runs out. The trigger was written at approval and is tracked like any other measure: wash volume of 66,096 kg a week, 90% of the washers' capacity, held for 8 weeks. At 3% growth that is expected after about 3.27 years.

The 90% trigger is not arbitrary. The extension and tunnel need about 14 months for approval and construction. Triggered at 90%, the new capacity would arrive when volume is about 93.1% of today's wash capacity, before the washers run full, which at 3% growth happens after about 6.8 years. A trigger at 100% would leave the laundry 14 months short of washing capacity.

```figure
type: decision
title: The tunnel-washer gate
question: Has wash volume held at or above 66,096 kg a week, 90% of capacity, for 8 consecutive weeks?
caption: This is an illustration. The trigger and the measures for the decision are written now, so that the decision is made on the evidence, at the right time, and against the same four targets.
- No | Continue with Option B | report wash utilisation monthly; re-check the growth rate yearly
- * Yes, and the four targets are holding | Prepare the tunnel and extension case | score it on OTIF, cost per kg, water and energy, against a do-minimum such as more washer-extractors
- Yes, but the growth came from one new contract | Test whether the volume is lasting | a short-term contract may not justify a 12-year asset
```

Writing the trigger before the evidence arrives is what makes the gate a decision rather than a formality. [Stopping rules and kill criteria written before the evidence](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/kill-criteria-before-the-evidence/) in *Stage Gates and Stopping Rules by the Numbers* shows how criteria set in advance protect a gate from being reinterpreted once results are in, and [Stage gates that make real decisions](/reados/collections/project-delivery-procurement-and-governance/stage-gates-that-make-real-decisions/) describes the four outcomes a gate can have: go, hold, recycle or stop.

## Tracking informs evaluation, it does not replace it

NSW Treasury's Benefits Management Guide, TPG24-31, issued in February 2025 and not mandatory, describes benefits management as most useful when applied early, to define the problem and shape the options, then to compare options and set up monitoring, and then to track performance. It is explicit that benefits management informs evaluation but does not substitute for it. Its companion plan template records, for each benefit, a baseline, a target and a target date: the three things this book has built for each of the laundry's measures. The UK Infrastructure and Projects Authority's guide makes a similar case for benefits-led planning across the life of a project.

For the laundry, tracking showed that the four targets were met in the evidence window. It did not show, by itself, why; whether the hospital group's decision turned on them; or whether the gains will last. Those are questions for a review after the tender, using the same measures. One part of the answer is already visible: the loading shift and the collection times are business changes, and they will slip unless someone keeps them in place. [Delivered is not adopted](/reados/collections/from-approval-to-benefits/delivered-is-not-adopted/) covers how to make such changes stick after go-live.

## Exercise: the allowance with six weeks to go

Suppose that after 20 weeks of the 26-week evidence window the laundry has recorded 71 failures. The remaining 6 weeks contain 1,080 deliveries. How many failures can the laundry afford in those 6 weeks, and what weekly OTIF does that require?

**Worked answer.** The window allows at most 93 failures, so the laundry can afford **93 − 71 = 22** in the last 6 weeks. That is 22 ÷ 1,080 = 2.04% of the remaining deliveries, an average of about 3.7 failures a week, so the remaining weeks must average an OTIF of 97.96% or better, **98.0%** to one decimal place. The answer depends on counting failures, not on averaging weekly percentages: one bad week of 8 failures leaves only 14 for the other five weeks, 2.8 a week. A weekly chart from Chapter 4's control limits would show a week of 8 failures as ordinary variation for a 2% process, which is true and irrelevant: the tender counts the total.
