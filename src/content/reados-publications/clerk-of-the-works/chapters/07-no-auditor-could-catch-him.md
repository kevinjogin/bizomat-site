---
book: clerk-of-the-works
chapterSlug: no-auditor-could-catch-him
order: 7
title: "No auditor could catch him: measuring progress honestly and forecasting the final cost"
description: "Use Chaucer's Reeve to look at progress reporting: measure earned value on the grandstand from objective milestones, compare it with claimed progress, and forecast cost and finish."
draft: false
---

The Reeve in the General Prologue manages a lord's farm, and he is very good at it. He can keep a granary and a bin. No auditor could ever find him in arrears. He knew, from the drought and the rain, how his seed and his grain would yield. He had kept the accounts since his lord was twenty, and the lord's sheep, cattle, dairy, pigs and horses were all under his control. And he had done well out of it: he could please his lord by lending him things that were already the lord's.

The portrait is a warning about records that are perfectly kept and still mislead. The Reeve's accounts balanced; that was the problem. An audit that checks whether the figures add up cannot tell whether they describe what actually happened. This chapter applies that warning to progress reporting on the grandstand, using earned value, and shows how the same project looked on track or in trouble depending on how progress was measured.

## The Reeve's two skills

Chaucer gives the Reeve two kinds of competence, and owners need both from their reporting. The first is forecasting from conditions: knowing from the weather what the harvest will be, long before it is in. The second is keeping records that can be checked. The Reeve's flaw was that he controlled both the work and the record of it, so that nobody else could compare the two.

Earned value is a method for doing both jobs at once. It compares three quantities at a reporting date: the value of the work that was planned to be done by then, the value of the work actually done, and the cost actually incurred. From those it gives indices for cost and schedule performance and forecasts of the final cost and finish. The method is only as honest as its measure of the work actually done, and that measure is where the Reeve's lesson applies.

## The grandstand at week 14

This is an illustration. At the end of week 14, just over half way through the 26-week programme, the clerk of works prepares the monthly report to the committee. The society's base budget, A$1,180,000 excluding GST, is the budget at completion; contingency is reported separately in its own register. The planned value to date, from the baseline cash flow agreed at contract, is A$690,000. The society's actual cost to date, meaning everything paid and accrued across the head contract, seats, fees and services, is A$668,000.

That leaves the earned value: the budgeted value of the work actually done. The builder's progress claim for week 13 showed the structural steel package, budgeted at A$155,000, as 90% complete, on the builder's estimate. On that basis the clerk's first calculation of earned value for the whole budget came to A$702,000.

```figure
type: compare
title: Earned value at week 14, measured two ways
cols: Builder's percent complete | Objective milestones
caption: This is an illustration. The only difference between the two columns is how the steel package's progress is measured. Everything else is identical.
- Steel package, A$155,000 budget | 90% claimed: A$139,500 | 50% by milestones: A$77,500
- Earned value, whole budget | A$702,000 | A$640,000
- Cost performance index, CPI | 1.051 | 0.958
- Schedule performance index, SPI | 1.017 | 0.928
- * Estimate at completion, BAC ÷ CPI | A$1,122,849 | A$1,231,625
- Forecast finish | 25.6 weeks | 28.0 weeks
```

## Why the percent complete was wrong

The builder's 90% was not a lie. It was an impression, and a common one. All twelve raker beams and most of the columns and roof framing had been cut, and the workshop looked nearly finished. But six raker beams were being reworked after the revision error in Chapter 6, nothing had been galvanised, and nothing had been delivered. Measured by what the society could actually use, the steel package was about half done.

The clerk of works had agreed objective progress rules for each package with the builder and superintendent at the start-up meeting, precisely so that progress would not rest on impressions. For structural steel, the rules gave credit in fixed steps tied to evidence the clerk could verify:

| Milestone for each steel item | Credit | Evidence |
| --- | --- | --- |
| Shop drawings approved at the current revision | 10% | approved drawing, revision checked against the register |
| Fabricated and passed the hold point inspection | 40% | clerk of works' inspection record |
| Galvanised and delivered to site | 30% | delivery docket and galvanising certificate |
| Erected, bolted and inspected | 20% | superintendent's inspection record |

At week 14, the items that had passed the hold point and the shop drawing step together earned 50% of the package value. Nothing had earned the delivery or erection credit. The milestones turned a judgement about a busy workshop into a count of items with evidence attached. They also removed an argument. The builder's project manager did not have to defend an estimate, and the clerk of works did not have to doubt one: the count was the count, and either side could repeat it from the same records.

## Running the numbers

The [Earned Value Check](/tools/earned-value-check/) tool computes the indices and forecasts from four figures and the planned duration. Enter a budget at completion of A$1,180,000, planned value A$690,000, earned value A$640,000, actual cost A$668,000 and a planned duration of 6 months, which is the 26 weeks rounded. It returns the cost and schedule variances, CPI and SPI, two estimates at completion, the estimate to complete, the variance at completion, the to-complete performance index, the per cent complete and a simple forecast duration, and it flags the result against the lowest indices and highest TCPI you set. Its guide warns that the indices are only as good as the earned value measurement, and that percent-complete claims without objective milestones overstate progress, which is the point of this chapter.

```figure
type: formula
title: Earned value indices and forecasts for the grandstand at week 14
formula: CPI = EV ÷ AC; SPI = EV ÷ PV; EAC = BAC ÷ CPI
caption: This is an illustration, using the objective earned value. The second estimate, which also allows for the schedule slip, is A$1,275,658. The tool reports recovery needed, because SPI is below the 0.95 limit set.
- EV | earned value, A$640,000
- AC | actual cost, A$668,000
- PV | planned value, A$690,000
- BAC | budget at completion, A$1,180,000
step: CPI = 640,000 ÷ 668,000 = 0.958; SPI = 640,000 ÷ 690,000 = 0.928
step: EAC = 1,180,000 ÷ 0.958 = A$1,231,625; variance at completion = −A$51,625
step: TCPI = (1,180,000 − 640,000) ÷ (1,180,000 − 668,000) = 1.055
step: forecast duration ≈ 6 months ÷ 0.928 = 6.5 months, about 28 weeks
```

The two pictures could hardly be more different. On the builder's percent complete, the project was 5% under cost and slightly ahead of time, with a forecast finish of A$57,151 under budget. On objective milestones, it was 4% over cost and 7% behind time, heading for a A$51,625 overrun and a finish about two weeks late. The arithmetic in both was flawless. Like the Reeve's accounts, the first set balanced and described something that had not happened.

## What the forecast means for the society

A forecast is only useful if it changes a decision. The clerk of works took three points from the objective figures to the committee.

First, the forecast overrun of A$51,625 is within the A$138,533 of contingency left at week 14, so the project remains funded, but it would use more than a third of what remains, with roofing and seat installation, the riskiest remaining work, still to come.

Second, a TCPI of 1.055 means the remaining work must be done about 5.5% more efficiently than planned to finish on the base budget. The work to date has run at 0.958. Expecting the rest to run at 1.055 is not a plan; the committee should assume the overrun is real.

Third, a finish at about week 28 is two weeks after the contract date of week 26, which is itself four weeks before the show. The show is not yet at risk, but the margin has halved. Whether the delay attracts liquidated damages depends on its causes, and part of it is the builder's own revision error. The superintendent will decide any extension of time claim; the clerk of works' job is to make sure the records of what caused each day's delay are complete.

```figure
type: gauge
title: Schedule performance at week 14
min: 0.80
max: 1.10
value: 0.928
unit: SPI
label: objective earned value
caption: This is an illustration. Below 0.95 the society's reporting rule calls for a recovery plan from the builder. The builder's own percent complete gave 1.017, inside the green band.
- 0.80 | 0.95 | recovery plan required
- 0.95 | 1.10 | on track
```

## Failure: paying on the impression

The builder's claim for week 13, assessed before the clerk of works' milestone count was finished, had been certified at the builder's 90% for steel. The society had therefore paid for about A$62,000 of steel progress that had not been earned on the agreed rules. That is part of why actual cost, at A$668,000, ran ahead of the objective earned value.

The overpayment was not a loss: the steel would be delivered and the money was not gone. But it weakened the society's position. Money paid ahead of value is security given up; if the builder had failed, the society would have paid for steel it did not hold.

Detection came from comparing two records that should have agreed: the certified claim and the milestone count. The correction had two parts. The superintendent adjusted the next certificate to bring the steel back to the milestone value, which it is entitled to do because progress certificates are provisional. And the clerk of works' milestone count became an input to every certificate, before it was issued, not a report produced after it. The builder agreed, because the rules had been settled at the start: nobody was being judged by a new standard.

## Reporting to a committee of volunteers

The society's committee are farmers, a retired bank manager, a schoolteacher and a vet. None of them uses earned value at work, and the clerk of works did not ask them to learn it. The monthly report put the indices on the second page and led with four plain sentences, each with the evidence behind it:

1. **Cost.** For every dollar of planned work done, we have spent about A$1.04. If that continues, the stand will cost about A$51,600 more than the base budget, which our remaining contingency of A$138,500 can cover.
2. **Time.** We have done about 93% of the work planned by now. If that continues, the builder will finish in about week 28, two weeks late and two weeks before the show.
3. **Why.** Most of the gap is the steel: six beams were reworked after a drawing error that is the builder's responsibility, and nothing has yet been galvanised or delivered.
4. **What we need from you.** Nothing yet. If the next report shows no improvement in time, we will ask the builder for a recovery plan and consider whether to book temporary seating as a fallback.

The Reeve's lord saw accounts that balanced. The committee saw a forecast, its cause and a decision point. The second costs no more to produce than the first, and it is the only kind of report that lets an owner act.

## What earned value costs on a small job

Owners of small projects sometimes treat earned value as something for large organisations with project controls teams. On the grandstand it took the clerk of works about two hours a month: half an hour to count milestones against the inspection records, an hour to gather the society's actual costs from the treasurer, and half an hour to run the figures and write the four sentences. The progress rules took an afternoon at the start-up meeting. Against a budget of A$1.18 million, that is a small price for a forecast that was right two months before the end.

The real cost is agreeing the rules before work starts. Rules introduced in the middle of a job look like a way to pay less, and builders resist them for good reason. Rules agreed at the start are simply the contract's measure of progress.

## The Reeve's forecasting

The Reeve's better skill was the one that served his lord: reading the drought and the rain to know what the harvest would bring. Earned value gives an owner a version of that. At week 14, with just over half the time gone, the society knew roughly what the stand would cost and when it would be finished, and could act while there was still room. Without objective measurement, it would have learned the same facts at week 24, when the only remaining choices were to pay or to miss the show.

For a wider treatment of what earned value reveals and conceals, see [earned value: what it shows about a job, and what it cannot](/reados/collections/project-estimates-schedules-and-costs/earned-value-what-it-shows-and-what-it-cannot/) in *Project Estimates, Schedules and Costs*.

## Exercise: report week 18

At the end of week 18, planned value is A$905,000. Actual cost is A$870,000. Steel is now 80% complete by milestones, and earned value across the budget is A$842,000. Calculate CPI, SPI, the estimate at completion by BAC ÷ CPI, the variance at completion, the TCPI and the forecast duration from 6 months. Say whether the project is recovering, and what the committee should take from the figures.

**Worked answer.** CPI = 842,000 ÷ 870,000 = 0.968. SPI = 842,000 ÷ 905,000 = 0.930. EAC = 1,180,000 ÷ 0.968 = A$1,219,240, a variance at completion of −A$39,240. TCPI = (1,180,000 − 842,000) ÷ (1,180,000 − 870,000) = 338,000 ÷ 310,000 = 1.090. Forecast duration = 6 ÷ 0.930 = 6.45 months, still about 28 weeks. Cost performance has improved, from 0.958 to 0.968, and the forecast overrun has fallen from about A$51,600 to about A$39,200. Schedule performance is flat at about 0.93, so the late finish is not recovering. The committee should note that the cost position is improving and remains within contingency, that the finish date is not, and that the builder's recovery plan should be judged by whether SPI moves at the next report. A TCPI of 1.09 confirms that the base budget alone will not be met.
