---
book: reference-class-forecasting-by-the-numbers
chapterSlug: schedule-and-benefit-forecasts
order: 7
title: "Schedule, benefits and the cost of delay"
description: "Schedule ratios put Bay 4 at 44.7 weeks at P50 and 54.7 at P80 against a 36-week plan; with A$45k a week of contribution, the P80 delay costs about A$839k."
draft: false
---

The chapters so far have corrected Bay 4's cost. A business case also rests on two other forecasts made from the inside: when the new capacity starts earning, and how much it earns once it does. Both are open to the same optimism as the cost estimate, and both can be checked against the business's own records in the same way. This chapter applies the reference class to the schedule, shows that time and cost overruns in the class travel together, prices the delay, and builds a small reference class for the benefit that justifies Bay 4: unattended overnight machining hours.

The result is a business case in which the cost, the start date and the weekly benefit are all taken from the outside view. It looks very different from the plan the team first put forward, and the difference comes mostly from time, not money.

## Schedule ratios for the class

Chapter 2 defined the **schedule ratio** as the actual duration divided by the planned duration, both measured from the decision to proceed to the agreed finish point, which for Bay 4 is the first production shift. This is an illustration. The 24 past projects have the following schedule ratios, sorted: 0.83, 1.00, 1.00, 1.07, 1.08, 1.10, 1.10, 1.13, 1.17, 1.17, 1.19, 1.23, 1.25, 1.25, 1.30, 1.36, 1.36, 1.40, 1.50, 1.55, 1.71, 1.80, 1.89 and 2.15. Twenty-one of the 24 finished late. Only P12, the compressed-air ring main, finished early, at 5 weeks against 6, and two machine projects, P03 and P13, finished exactly on time.

Read with PERCENTILE.INC as in Chapter 4, the median schedule ratio is **1.240**, the P70 is 1.361, the P80 is **1.518** and the P90 is 1.774. The mean is 1.316. The schedule ratios run higher than the cost ratios at every percentile: the median project overran its budget by 14% and its schedule by 24%. That pattern is common. Money can be found by trimming scope or squeezing a supplier; lost weeks rarely come back.

Applied to Bay 4's 36-week plan, the percentiles give the finish dates in the figure. The delay is priced at **A$45,000 a week**, the contribution Bay 4 is expected to earn once it is running. This is an illustration, excluding GST, and the next section explains what it covers.

```figure
type: compare
title: Bay 4's first production shift from the class's schedule ratios
cols: Schedule ratio | First shift, weeks from approval | Weeks later than plan | Contribution lost at A$45k a week
caption: This is an illustration. Weeks are 36 × the ratio; delay costs are calculated on unrounded weeks.
- Inside-view plan | 1.000 | 36.0 | 0 | A$0
- P50 | 1.240 | 44.7 | 8.7 | A$389k
- P70 | 1.361 | 49.0 | 13.0 | A$586k
- * P80 | 1.518 | 54.7 | 18.7 | A$839k
- P90 | 1.774 | 63.9 | 27.9 | A$1,254k
```

The subclasses tell the same story for time that Chapter 6 told for cost. Machine projects have a median schedule ratio of 1.083 and a P80 of 1.153; automation projects 1.400 and 1.614; software projects 1.650 and 1.942. Bay 4's critical path in the team's plan runs through the machines, the thin-tailed part, but its finish point, the first production shift with the pallet system running overnight, depends on the automation and software, the two subclasses with the longest schedule tails. A plan whose last activities come from the fattest-tailed work should not expect the machine class's punctuality, and the whole-class ratios used above may, if anything, be kind to it.

## Time and cost move together

A natural question is whether a project that overruns on cost also overruns on time, or whether the two are separate risks. The class answers it clearly. The Pearson correlation between the 24 cost ratios and the 24 schedule ratios is **0.937**, and the rank correlation, which looks only at the order of the projects and is less affected by P05's extreme values, is **0.951**. In a spreadsheet, CORREL on the two columns gives the first; CORREL on their RANK.AVG columns gives the second.

The overlap at the top end is complete. The five projects above the class's cost P80 of 1.408 are P05, P21, P18, P08 and P14, and they are exactly the five projects above the schedule P80 of 1.518.

```figure
type: compare
title: The six largest cost overruns and their schedules
cols: Cost ratio | Schedule ratio | Main cause
caption: This is an illustration. The same discoveries cost money and time. Pearson correlation across all 24 projects: 0.937; rank correlation 0.951.
- * P05 First ERP system | 2.60 | 2.15 | data migration and customisation; scope grew
- P21 Monitoring and MES pilot | 1.95 | 1.80 | network rebuild and integration with ERP
- P18 Collaborative robot cell | 1.68 | 1.89 | safety assessment and guarding redesign
- P08 Switchboard and power upgrade | 1.52 | 1.71 | network operator required a new kiosk substation
- P14 Pallet pool for HMC | 1.45 | 1.55 | controls integration with machine
- P11 CAM system replacement | 1.38 | 1.50 | post-processor development
```

There are two reasons for the link. The first is that both overruns usually have the same cause: a substation nobody planned for takes months to approve and build, and it also costs money. The second is that time costs money directly. Every extra week keeps the project's own staff on it, extends site costs and hire, and holds the builder's and integrator's teams on site. For forecasting, the consequence is plain: do not pair a P80 budget with a P50 date. If the business chooses to fund Bay 4 to its P80 cost, the date it plans its customers around should be read at the same confidence, and any simulation that combines cost and time must treat them as strongly correlated, not independent.

Only two projects in the class, P03 and P12, finished both on time and within budget. Both were small, simple and familiar, a lathe and an air main.

## What a week of delay is worth

Bay 4's purpose is to earn contribution: the revenue from the extra machining capacity less the variable costs of producing it, such as material, tooling, power and direct labour. The team's estimate is **A$45,000 a week** once Bay 4 is running at its planned level. Each week the first production shift slips is a week of that contribution that the business does not earn, unless the work can be done elsewhere or merely moved later without losing the customer.

[What is a day worth?](/reados/collections/valuing-time-delay-and-uncertainty/what-is-a-day-of-delay-worth/) sets out how to build such a figure: contribution lost, plus any ongoing costs that keep running during the delay, counting only days that move the finish date. At A$45,000 a week, the P50 delay of 8.65 weeks costs about **A$389,000** and the P80 delay of 18.65 weeks about **A$839,000**. The P80 cost overrun, from Chapter 5, is A$3,379k − A$2,400k = A$979k. The price of the likely delay is of the same order as the likely extra spend, and a business case that corrects the cost but keeps the 36-week start date has fixed less than half of the problem.

The figure needs two cautions. It assumes Bay 4 reaches full contribution in its first week of operation, which no new bay does; a ramp-up makes early weeks worth less, and so makes the first weeks of delay a little cheaper than the flat figure. And it assumes the work is lost, not deferred. If customers will wait, part of the contribution is only delayed, and the true cost is closer to the cost of financing it for the delay. The business must decide which is true for its order book, and say so in the business case.

## Benefits are forecast from the inside too

The A$45,000 a week is itself an inside-view forecast. The largest single assumption in it is that the pallet automation will deliver **2,000 unattended spindle hours a month** overnight, across the two machines, within the first months of operation. The team estimates that those overnight hours account for **A$20,000 a week** of the A$45,000. This is an illustration. Two thousand hours a month is about 461.5 hours a week, so the overnight work is valued at about A$43 of contribution per spindle hour.

Benefits are prone to the same biases as costs, and often more so, because nobody measures them as carefully as they measure invoices. A planned benefit that falls short is rarely recorded as an overrun; it simply never arrives. The cure is the same: find a class of similar past forecasts and compare what was promised with what was delivered.

The business's five automation projects each had a planned effect on machine hours or labour, written in their approval papers. The operations manager went back to the production records and measured what each delivered in its first full year, as a **realisation ratio**: delivered benefit divided by planned benefit. This is an illustration; the ratios below are part of the fictional case.

```figure
type: bars
title: Benefit realisation of five past automation projects, first full year
unit: ×
max: 1
caption: This is an illustration. Realisation = delivered ÷ planned benefit. Median 0.62; the PERCENTILE.INC P20 is 0.536. For benefits, the cautious percentile is the low one.
- P04 Robot deburring cell | 0.62
- P09 Bar-feed and part-catcher retrofit | 0.90
- P14 Pallet pool for HMC | 0.55
- * P18 Collaborative robot loading two lathes | 0.48
- P23 Automated tool presetting and storage | 0.81
```

None of the five delivered its plan in the first year. The median realisation is **0.62**, and the P20, the value that 80% of past projects exceeded, is found at position 1 + 0.2 × 4 = 1.8 in the sorted list, so 0.48 + 0.8 × (0.55 − 0.48) = **0.536**. With costs, the cautious percentile is a high one, because a higher cost is worse. With benefits, it is a low one.

Applied to Bay 4's overnight hours, the median gives 2,000 × 0.62 = **1,240 hours a month**, worth A$20,000 × 0.62 = A$12,400 a week, and Bay 4's weekly contribution becomes A$25,000 + A$12,400 = **A$37,400**. At the P20, 1,072 hours a month gives A$35,720 a week. Five projects is a very small class, so the business treats these as an adjustment of direction and size, not a precise forecast. The causes recorded for the shortfalls, fixtures that were not ready for unattended work, programs not yet proven to run without an operator, and a lack of urgent jobs to load at night, are as useful as the ratios: each is something Bay 4 can plan for.

## Putting cost, time and benefit together

The figure below sets the inside-view case beside two outside-view cases. The measure is a deliberately simple one: the undiscounted payback, in weeks from approval, assuming full contribution from the first production shift. It is not a full appraisal, but it shows how the three corrections combine.

```figure
type: compare
title: Bay 4's business case from the inside and the outside
cols: Cost | First shift | Contribution a week | Payback, weeks from approval
caption: This is an illustration, excluding GST. Payback = first shift + cost ÷ weekly contribution, undiscounted, with no ramp-up. The outside-view cases use the median benefit realisation of 0.62.
- Inside view | A$2.400m | week 36.0 | A$45.0k | 89
- Outside view, P50 cost and time | A$2.736m | week 44.7 | A$37.4k | 118
- * Outside view, P80 cost and time | A$3.379m | week 54.7 | A$37.4k | 145
```

On the inside view, Bay 4 repays its cost in about 89 weeks from approval, under two years. At the outside view's P50 it takes about 118 weeks, and at the P80 about 145 weeks, nearly three years. The project may still be well worth doing; a machining bay will run for many years beyond its payback. But the owner deciding on the inside-view case would have been told it pays back in under two years when the business's own history says that is unlikely, and that matters when the money is borrowed or when Bay 4 competes with other uses of the same funds.

## The error: the schedule without the power supply

This is an illustration. The team's 36-week schedule had the machines on the critical path: ordered in week 2 with a 24-week lead time, delivered in week 26, installed and commissioned in weeks 26 to 32, followed by the pallet system in weeks 30 to 34 and software trials in weeks 34 to 36. The building package included the switchboard upgrade, priced by the electrician, and the schedule showed it as a two-week task in weeks 22 and 23.

During the pre-approval review, the reviewer read the "main cause" column of the reference class and noticed two projects held up by the electricity network: P08, where the network operator required a new kiosk substation, and P22, the solar and battery system, delayed by network approval. P08 had been planned at 14 weeks and took 24. The reviewer asked the electrician for a maximum demand calculation for the site with Bay 4 running. It showed that the new load would exceed the capacity of the existing supply, so an application to the network operator was needed before the new switchboard could be energised.

Left in the plan as drawn, the application would have gone in around week 20, when the electrician began detailed design. With P08's 24 weeks, power would have arrived in week 44 instead of before week 26, and every activity after machine delivery would have moved by 18 weeks. The first production shift would have been in **week 54**, a schedule ratio of 1.50, close to the class's P80, at a delay cost of 18 × A$45,000 = **A$810,000**. A single missing activity would have produced the outside view's P80 almost exactly.

```figure
type: timeline
title: Bay 4's schedule after the power path was added
caption: This is an illustration. Lodging the network application at approval gives power in week 26, the same week the machines arrive: two paths now meet with no float between them.
- Week 0 | Approval | network application and maximum demand calculation lodged in week 2
- Week 2 | Machines ordered | 24-week lead time
- Weeks 2–26 | Network approval and connection | P08's actual 24 weeks used as the duration
- * Week 26 | Merge point | machines delivered and site supply available; zero float
- Weeks 26–32 | Machine installation and commissioning | needs full power from day one
- Weeks 30–36 | Pallet system and software trials | first production shift in week 36
```

The correction was to make the network application the first activity after approval, using P08's actual duration rather than its plan. That restored the 36-week date on paper, but at a price that the schedule now shows: two independent paths, the machines and the power supply, must both be ready in week 26. [How confident is that finish date?](/reados/collections/project-estimates-schedules-and-costs/how-confident-is-that-finish-date/) calls this a merge point. If each path has, say, a 70% chance of being ready on time and the two are independent, the chance that both are ready is 0.7 × 0.7 = 49%. The team also asked the integrator whether the machines could be commissioned on temporary supply, which would remove the merge point for the first weeks, and added the network application to the list of tail items in Chapter 9.

## Exercise: a customer promise at week 40

The sales manager wants to tell a major customer that Bay 4's capacity will be available from week 40 after approval. Using the class's schedule ratios, what share of past projects would have met that date? What date has the same confidence as the P70 cost, and what contribution would be lost against the 36-week plan if Bay 4 starts at that date?

**Worked answer.** Week 40 is a schedule ratio of 40 ÷ 36 = 1.111. Seven of the 24 past projects finished at or below that ratio (0.83, 1.00, 1.00, 1.07, 1.08, 1.10 and 1.10), so on the business's own history a week-40 promise would have been kept about **29%** of the time. The P70 schedule ratio of 1.361 gives 36 × 1.361 = **49.0 weeks**, 13.0 weeks later than the plan, and 13.01 × A$45,000 = about **A$585,500** of contribution lost. A promise the business can keep seven times in ten would be week 49, not week 40; if week 40 matters commercially, the customer should be told it is a target with a stated chance, or the work for that customer should be planned on existing capacity until Bay 4 is running.
