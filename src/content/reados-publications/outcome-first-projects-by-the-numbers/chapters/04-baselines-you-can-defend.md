---
book: outcome-first-projects-by-the-numbers
chapterSlug: baselines-you-can-defend
order: 4
title: "Baselines you can defend"
description: "26 weeks of signed dockets give 91.2% OTIF, not the 95.6% the dispatch system showed; a p-chart, the A$1.711/kg cost baseline, 14.0 L/kg, 6.00 MJ/kg and their seasons."
draft: true
---

A baseline is the number every later claim is measured from. If it is too kind, the project looks unnecessary or its benefits look small; if it is too harsh, the benefits look large and the project is credited with improvements it did not cause. Either way, the first person to check it will find the weakness, and once one baseline is doubted, every benefit built on it is doubted too. A baseline worth having is one that can be defended: measured in the defined measure, from a source the customer would accept, over a stated period, with its variation known.

This chapter measures the laundry's four baselines in the definitions of Chapter 3. It explains why the delivery baseline uses 26 weeks of customer-signed dockets, how the data were validated, what the weekly figures and a control chart show about the process, and what the cost, water and energy baselines are and how the season moves them. It ends with the first delivery figure the laundry produced, which came from the wrong source and was 4.4 points too high.

## Why 26 weeks of signed dockets

This is an illustration. The delivery baseline covers the most recent **26 weeks**: 156 production days, 30 deliveries a day, **4,680 deliveries** in all. Three reasons fixed that choice.

The first is comparability. The hospital group will judge the tender on OTIF over a trailing 26 weeks, so a baseline over the same length, in the same measure, answers the question the tender will ask. The second is size. At 180 deliveries a week, one bad week of 24 failures accounts for about half a point of a 26-week figure, but for 3.3 points of a four-week figure. The third is relevance. The plant, the runs and the customers in the last six months are the ones the project will change. Older data would mix in a different customer list and an earlier state of the ironers.

The source is the **customer-signed delivery docket**, because the Chapter 3 definition takes the time and completeness from the customer's side. Every docket carries the signature time and a tick or a note against each line item. The dockets come back with the drivers and are filed by date, so the 26 weeks could be assembled from paper and the electronic copies the hotels return, without depending on any system's interpretation of them.

## Validating the data

Collecting data is not the same as having it right. Basili and Weiss (1984), in their method for collecting software engineering data, validated the change reports as they came in, by interviewing the people who had filled them in. They reported that without that step as much as 50% of the change data could have been erroneous. The figure belongs to their setting, but the lesson transfers: data recorded by busy people for some other purpose is wrong more often than anyone expects, and the time to find out is while the people who recorded it still remember.

The laundry's validation had three parts. First, completeness of the set: the operations manager checked that every scheduled delivery in the 26 weeks had a docket, 4,680 scheduled and 4,680 found, after chasing a handful from two hotels. Second, reading: each docket's signature time and line-item marks were entered into a spreadsheet, and a sample of a hundred was re-entered by the finance manager to catch transcription errors. Third, interpretation: every docket that looked like a failure was reviewed with the dispatch supervisor and, where the note was unclear, with the driver or the customer's receiving staff. A note reading "towels short, sent tomorrow" is a failure; a note reading "spare cage returned" is not.

The result was **412 failures** in 4,680 deliveries, **OTIF 91.2%**. That was not the first figure the laundry had.

## The error: a delivery stamped at the dock

This is an illustration. When the owners first asked for an OTIF figure, the dispatch system produced one in minutes: **95.6%**, with 206 failures in the same 26 weeks. The system stamped each delivery "delivered" when the van left the dock and flagged a failure only when a van departed after its scheduled time or was loaded short against the picking list. It measured dispatch, from the laundry's side of the door.

The figure did not survive contact with the customer. The hospital group's linen services manager keeps a complaint log, and when the operations manager tried to reconcile it with the dispatch system, many logged complaints matched deliveries the system showed as successful. The signed dockets settled it. They showed 412 failures, not 206, and OTIF of 91.2%. The 206 deliveries the system had missed were of two kinds: vans that left on time but reached the customer after the cut-off; and deliveries that left with every item scanned but were signed for with items short, because cages had been mis-labelled or items left on the dock.

```figure
type: compare
title: Two baselines for the same 26 weeks
cols: Dispatch system | Signed dockets
caption: This is an illustration. Same 4,680 deliveries, two sources. The 206-delivery gap is deliveries that left on time but arrived late, or left complete on the picking list but were signed for short.
- What it records | Van departure time and picking scan | Customer's signature time and line-item check
- Viewpoint | The laundry's dock | The customer's ward or store
- Failures in 26 weeks | 206 | 412
- * OTIF | 95.6% | 91.2%
- Gap to the 98% requirement | 2.4 points | 6.8 points
- Reconciles with the hospital complaint log | No | Yes
```

The difference changed the project. At 95.6%, the gap to 98% is 2.4 points, small enough to suggest that tidier dispatch might close it. At 91.2% it is 6.8 points and twice as many failures, a gap that needs changes in production as well. The correction was to make the signed docket the only source for OTIF, to record the 206-delivery difference and its explanation in the baseline file so that nobody later rediscovers the higher number and quotes it, and to keep the dispatch figure as what it really is: a measure of dispatch punctuality, useful as a leading indicator but not the outcome.

## The weekly series

The 26-week figure is an average. The weekly figures show how much the laundry's performance moves around it.

```figure
type: line
title: Weekly OTIF from signed dockets, weeks 1 to 26
x: Week
y: OTIF, %
legend: Weekly OTIF | Mean, 91.2%
ymin: 84
ymax: 96
caption: This is an illustration. 180 deliveries a week. Weekly OTIF ranged from 86.7% (weeks 12 and 22) to 94.4% (weeks 3, 8 and 23); the sample standard deviation is 2.40 points. No week came near 98%.
- 1 | 88.3 | 91.2
- 2 | 87.8 | 91.2
- 3 | 94.4 | 91.2
- 4 | 92.2 | 91.2
- 5 | 92.2 | 91.2
- 6 | 93.9 | 91.2
- 7 | 92.8 | 91.2
- 8 | 94.4 | 91.2
- 9 | 92.2 | 91.2
- 10 | 90.6 | 91.2
- 11 | 90.6 | 91.2
- 12 | 86.7 | 91.2
- 13 | 90.6 | 91.2
- 14 | 93.3 | 91.2
- 15 | 90.6 | 91.2
- 16 | 88.3 | 91.2
- 17 | 92.8 | 91.2
- 18 | 88.9 | 91.2
- 19 | 92.8 | 91.2
- 20 | 88.9 | 91.2
- 21 | 91.1 | 91.2
- 22 | 86.7 | 91.2
- 23 | 94.4 | 91.2
- 24 | 92.2 | 91.2
- 25 | 90.6 | 91.2
- 26 | 93.9 | 91.2
```

Weekly failures ranged from 10 to 24. Seven of the 26 weeks were below 90%; the best weeks, at 94.4%, had 10 failures each. The first 13 weeks had 204 failures and the last 13 had 208, so there is no sign of a trend in either direction. The weekly sample standard deviation is **2.40 points**. Nothing in the series suggests that the laundry is close to 98% and merely having bad luck: its best week was 3.6 points short.

## Is the process stable

A **p-chart** tests whether week-to-week variation in a proportion is what chance alone would produce from a stable process, or whether some weeks are different in kind. It sets control limits three standard errors either side of the average failure proportion.

The average failure proportion is p̄ = 412 ÷ 4,680 = **0.0880**. With n = 180 deliveries a week, the standard error of a weekly proportion is √(0.0880 × 0.9120 ÷ 180) = **0.0211**. The upper control limit is 0.0880 + 3 × 0.0211 = **0.1514**, a weekly OTIF of 84.9%; the lower limit is 0.0880 − 3 × 0.0211 = **0.0247**, a weekly OTIF of 97.5%. No week falls outside either limit.

The process is therefore stable, in the statistical sense: its failures come from the way the laundry normally works, not from a few exceptional weeks with special causes. That is an important finding for a project. A stable process cannot be brought to 98% by chasing bad weeks, investigating each late delivery or exhorting the drivers, because the bad weeks are not different in kind from the good ones. The gap is systemic, and closing it needs a change to the system. Chapter 6 finds which parts of the system. The lower limit also gives a test of change: under the present process a week better than 97.5% would be very unusual, so a run of such weeks after a change is evidence that the change worked.

## The cost baseline

All amounts are Australian dollars excluding GST. The laundry's fully loaded cost in the baseline year, in the definition of Chapter 3, was **A$5,337,704**, on 3,120,000 clean dispatched kilograms: **A$1.711/kg**. Revenue was A$6,052,800, a margin of 11.8%.

```figure
type: stack
title: The laundry's baseline cost of A$5,337,704 a year, by element
unit: A$, excluding GST
caption: This is an illustration. Fully loaded, including an 8% capital charge on existing plant. Labour is 53.5% of the total; utilities together are 16.5%. A$1.711 per clean kg.
- Labour, 42 FTE | 2856000
- Premises and overheads | 520000
- Gas | 445536
- Capital charge, existing plant | 330000
- Maintenance | 290000
- Vehicles | 260000
- Water and trade waste | 222768
- Electricity | 210600
- Chemicals | 202800
```

Labour dominates, at 42 full-time equivalents and a loaded cost of A$68,000 each, A$2,856,000 or **53.5%** of cost and A$0.915 of every kilogram. Gas, electricity and water together are 16.5%. The capital charge of A$330,000 on existing plant is included so that the baseline is comparable with options that add capital charges of their own. The breakdown already says something about where a cost reduction might come from: a project that leaves labour untouched has to find its savings in less than half of the cost base.

## Water and energy baselines

The laundry used **43,680 kL** of mains water in the baseline year, **14.0 L/kg**, at A$5.10/kL for water, sewerage and trade waste combined, A$222,768. It used **15,912 GJ** of gas, **5.1 MJ/kg**, at A$28/GJ, A$445,536; and **780,000 kWh** of electricity, 0.25 kWh/kg or 0.90 MJ/kg, at A$0.27/kWh, A$210,600. Energy intensity was (15,912 × 1,000 + 780,000 × 3.6) ÷ 3,120,000 = **6.00 MJ/kg**.

Gas meters on the boiler and the dryer and ironer burners split the gas by use: washing 2.4 MJ/kg (47.1%), drying 1.6 MJ/kg (31.4%) and ironing 1.1 MJ/kg (21.6%). Washing is the largest single use because the wash water is heated to about 70 °C from whatever temperature the mains supply delivers.

## The season moves the energy baseline

That last point makes the energy baseline seasonal. The incoming water averages about 17 °C over the year, about 12 °C in winter and 22 °C in summer. The heat needed to raise the water to 70 °C is proportional to the rise, so winter wash gas is (70 − 12) ÷ (70 − 17) = **1.094** times the annual average and summer wash gas is (70 − 22) ÷ (70 − 17) = **0.906** times it. Wash gas is therefore about **2.626 MJ/kg** in winter and **2.174 MJ/kg** in summer, against 2.4 on average, and the whole-plant energy intensity is about **5.774 MJ/kg** in summer and 6.226 MJ/kg in winter, against 6.00 for the year.

A swing of about 0.45 MJ/kg between summer and winter is a large fraction of any likely saving. A month's energy figure must therefore be compared with the baseline for the same season, not with the annual average, or summer months will appear to show savings that the weather produced. Chapter 10 returns to this with a claim that made exactly that mistake. Water intensity shows no comparable seasonal driver in this laundry's records.

## A baseline is not frozen

The baseline describes the past. The comparison that matters for a benefit is with what would happen without the project, and that is not the same. The owners estimate that volume will grow by about 3% a year, so in a year the laundry would be processing about 61,800 kg a week with the same plant. The same machines would face more peak days, and fixed costs would be spread over more kilograms. A benefit claimed against the frozen baseline would credit the project with changes that growth alone would have produced, or blame it for problems that growth alone would have caused. [What would have happened anyway? The counterfactual behind every business case](/reados/collections/investment-appraisal-and-business-cases/what-would-have-happened-anyway/) sets out how to build that comparison, and [Building a demand forecast from its drivers](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/demand-from-drivers/) in *Demand and Benefit Forecasts by the Numbers* shows how to replace an owners' estimate like the 3% with a forecast built from what drives the volume.

Fixing the baseline at one point, and saying which point, matters as much for benefits as it does for cost. [Measuring overrun: baselines, real dollars and scope](/reados/publications/reference-class-forecasting-by-the-numbers/measuring-overrun/) in *Reference Class Forecasting by the Numbers* makes the same argument for project cost: one baseline, fixed at the decision to proceed, in one consistent unit, or the comparison means nothing.

## Recording the baselines

NSW Treasury's TPG24-31 *Benefits Management Guide*, issued in February 2025, is not mandatory, but it is the current Australian state guidance and its companion Benefit Management Plan template records three things for each benefit: a **baseline measure**, a **target** and a **target date**. The laundry's register follows that pattern. This chapter fills the baseline column; Chapter 5 fills the other two.

```figure
type: compare
title: The laundry's baseline register
cols: Baseline | Source and period | Variation
caption: This is an illustration. Each baseline in the Chapter 3 definition, with its source and the variation that later comparisons must allow for. Targets and target dates are added in Chapter 5.
- OTIF | 91.2%, 412 failures in 4,680 | Signed dockets, 26 weeks | Weekly 86.7% to 94.4%; sd 2.40 points
- Cost per clean kg | A$1.711 | Management accounts, baseline year; A$5,337,704 | Labour 53.5% of cost
- Water | 14.0 L/kg | Utility meter, 43,680 kL in the year | No strong seasonal driver
- Energy | 6.00 MJ/kg | Gas 15,912 GJ, electricity 780,000 kWh | Summer 5.774, winter 6.226 MJ/kg
```

[Chapter 3](/reados/publications/outcome-first-projects-by-the-numbers/measures-from-questions/) defined the measures; this chapter measured them. The next, [Targets derived from the purpose, not from the baseline](/reados/publications/outcome-first-projects-by-the-numbers/targets-from-the-purpose/), sets the values each must reach.

## Exercise: control limits now and at the target

For a p-chart of weekly failures with n = 180 deliveries a week, calculate the standard error and the upper and lower control limits when the average failure proportion is p̄ = 0.088, and express the limits as weekly OTIF. Then calculate the upper control limit for a process running exactly at the target failure rate of 2%. In a later week the laundry achieves 95.0% OTIF, 9 failures. Does that week show the target is being missed?

**Worked answer.** The standard error is √(0.088 × 0.912 ÷ 180) = **0.0211**. The limits are 0.088 ± 3 × 0.0211: upper **0.1514**, lower **0.0247**, which are weekly OTIF of **84.9%** and **97.5%**. At p = 0.02, the standard error is √(0.02 × 0.98 ÷ 180) = 0.01043, and the upper limit is 0.02 + 3 × 0.01043 = **0.0513**, or 0.0513 × 180 = **9.2 failures** a week, a weekly OTIF of **94.9%**. A process running at exactly 2% expects 3.6 failures a week but can produce up to 9 in an ordinary week. One week at 95.0% is inside the limit, so by itself it does not show that the target is being missed. A run of such weeks would, and the 26-week count that the tender uses is the final test.
