---
book: outcome-first-projects-by-the-numbers
chapterSlug: where-the-gap-comes-from
order: 6
title: "Working back from the gap to its causes"
description: "A Pareto of 412 failed deliveries and a capacity check on effective rates: ironers and dispatch cause 83%, the ironers are 20% short on peak days, and the washers are not the constraint."
draft: false
---

The first five chapters turned a request for a new plant into four measures, a baseline for each and a target derived from the purpose. Together they define a gap: the distance, in the units of each target, between where the laundry is and where the tender and the price require it to be. This chapter works back from that gap to its causes. It uses two tools that every operations manager already has: a Pareto analysis of the failures that have actually happened, and a capacity check that compares what each stage of the process can do with what it is asked to do on its worst days.

The order matters. A cause list built from the equipment the business would like to buy will always find that the equipment is needed. A cause list built from the failures, and then tested against the arithmetic of capacity, finds where the money will move the measures. In the laundry's case it finds that the washers, the part of the plant the owners asked to replace, are not where the deliveries fail.

## The gap in the units of the targets

This is an illustration. All amounts are Australian dollars excluding GST. The four gaps, taken from the baselines and targets of Chapters 4 and 5, are these.

- **On-time-in-full delivery.** 412 failures in 4,680 deliveries over 26 weeks (91.2%) against at most 93 in the evidence window (98%). At least **319 failures** a half-year must go, from about 15.8 a week to no more than 3.6.
- **Cost per kilogram.** A$1.711 against a ceiling of A$1.66, a gap of about A$0.051/kg, or **A$158,504 a year** at today's 3,120,000 kg.
- **Water.** 14.0 L/kg against 10.0 L/kg, a reduction of 4.0 L/kg or 28.6%.
- **Energy.** 6.00 MJ/kg against 5.0 MJ/kg, a reduction of 1.0 MJ/kg or 16.7%.

```figure
type: stats
title: The four gaps the causes must explain
caption: This is an illustration. Each gap is stated in the unit of its target, so that every cause and every later option can be scored against it directly.
- * 319 | failures to remove per 26 weeks | from 412 to at most 93
- A$0.051/kg | cost per clean kg | A$158,504 a year at baseline volume
- 4.0 L/kg | water per clean kg | 14.0 to 10.0, a 28.6% cut
- 1.0 MJ/kg | energy per clean kg | 6.00 to 5.0, a 16.7% cut
```

Stating the gap this way does two jobs. It sets the size of the problem each cause must account for: a cause that explains 30 failures cannot close a gap of 319 on its own. And it puts all four measures side by side, which matters later, because a change that helps one measure can hurt another.

## A Pareto of the 412 failures

Chapter 4 established the 412 failures from customer-signed dockets. For this chapter the operations manager and the dispatch supervisor coded each failed docket with one primary cause, using a simple rule: the cause is the first step in the process, counting back from the customer, that made the delivery late or incomplete. A hospital delivery that left on time but short of theatre linen, because the ironer had not finished it, is coded to the ironer, not to dispatch. A delivery that was complete in the dock but loaded onto the wrong run is coded to dispatch. Disputed dockets went to the operations manager for a final decision, and the coding rule was written on the front of the analysis so that anyone could repeat it.

[From a request for new plant to the outcome behind it](/reados/publications/outcome-first-projects-by-the-numbers/from-request-to-outcome/) showed the first result of this coding: only 37 of the 412 failures, 9.0%, were caused by the washers running full. Sorted from the largest cause to the smallest, the full picture is as follows.

```figure
type: bars
title: Pareto of 412 failed deliveries by primary cause, 26 weeks
unit: failures
max: 160
caption: This is an illustration. The three largest causes, ironer backlog on peak days, dispatch and ironer breakdowns, account for 342 failures, 83.0% of the total. Washing capacity is fourth, at 9.0%.
- * Ironer backlog on peak days | 157 | 38.1%, cumulative 38.1%
- * Dispatch: loading and routes | 111 | 26.9%, cumulative 65.0%
- * Ironer breakdowns, line 1 | 74 | 18.0%, cumulative 83.0%
- Wash capacity, washers full | 37 | 9.0%, cumulative 92.0%
- Soiled linen received late | 33 | 8.0%, cumulative 100.0%
```

Grouped by stage of the process, the ironers account for 231 failures (56.1%), dispatch for 111 (26.9%), the wash room for 37 (9.0%) and the customers' own collection times for 33 (8.0%). Ironers and dispatch together are **342 failures, 83.0%**. Even if every wash-room and customer failure disappeared, 342 would remain, nearly four times the 93 allowed.

A Pareto chart shows where failures are recorded, not why they happen. A cause can be large because a stage is short of capacity, because it is unreliable, because its people work to the wrong priorities, or because the coding rule pushes failures towards it. The next step tests the two largest groups against the arithmetic of capacity, so that the Pareto becomes an explanation rather than a tally.

## Effective capacity, not nameplate capacity

A machine's nameplate rate is what it does when it is running, at the design speed, on the product it was rated with. What it delivers over a shift is lower for two reasons. It is not always running: breakdowns, changeovers, warm-up and waiting for work take time out. And when it runs, it does not always run at the rated speed: small stops, slow feeding and mixed items reduce the rate. Overall equipment effectiveness puts these losses into three factors, availability, performance and quality. The [OEE and Downtime Analysis tool](/tools/oee-downtime-pro/) works through them from a downtime log.

```figure
type: formula
title: Effective rate of a production line
formula: Effective rate = nominal rate × availability × performance
caption: This is an illustration. Quality losses, mainly rewashed items, are counted in the case as part of the load rather than as a third factor, so the effective rate uses availability and performance only.
- Nominal rate | the rated output while running, kg/h
- Availability | share of planned production time the line is actually running
- Performance | actual rate while running as a share of the nominal rate
- Effective rate | what the line delivers over the planned hours, kg/h
step: Line 1 (2009): 300 × 0.72 × 0.85 = 183.6 kg/h
step: Line 2 (2016): 300 × 0.90 × 0.85 = 229.5 kg/h
step: Both lines: 183.6 + 229.5 = 413.1 kg/h against a nominal 600 kg/h
```

The availability figures came from the maintenance leader's downtime log and the performance figures from the ironer counters, both over the same 26 weeks as the dockets. Line 1, the older line, loses 28% of its planned time to stops. At its performance of 0.85, that costs 71.4 kg/h of output, and line 1 now delivers only 44% of the two lines' effective rate.

## The ironers on an average day and a peak day

Flatwork, the sheets, pillowcases, towels and table linen that pass through the ironers or the folders, is 62% of the laundry's clean weight: 37,200 kg of the 60,000 kg washed each week. Over 90 production hours a week (two shifts of 7.5 hours on six days), the ironers must process **413.3 kg/h on average**.

The average hides the problem. Linen use in hotels peaks after weekends, and the hospital group's elective surgery lists run heavier early in the week. The operations manager's daily flatwork records give a peak-day factor of 1.25: on a peak day the ironers face 7,750 kg instead of the 6,200 kg of an average day, a required rate of **516.7 kg/h**.

Against those needs the two lines deliver 413.1 kg/h. On an average day that is 0.2 kg/h below the need: effectively no margin at all, so any stop on an average day also leaves work behind. On a peak day the lines are **103.6 kg/h short, 20.0% below the need**, and over two shifts of 7.5 hours about **1,553 kg** of flatwork is carried over to the next day. At the lines' effective rate, that is nearly 3.8 hours of ironing that must happen before the next day's own work, which is exactly the time in which the hospital orders for the 06:00 cut-off are being finished.

That mechanism explains both ironer causes in the Pareto. The 157 backlog failures fall on and after peak days, when carry-over pushes the morning's hospital and hotel orders past their cut-offs. The 74 breakdown failures are line 1's low availability arriving on days when there is no spare capacity to absorb a stop. It also explains a cost the Pareto does not show: the carry-over is partly cleared with overtime, about one full-time equivalent across the year, or A$68,000 at the laundry's loaded labour cost.

## The washers: busy, not short

The wash room's capacity is calculated the same way. Eight washer-extractors take 110 kg a load on a 55-minute cycle, so each can run 60/55 cycles an hour. With an effective factor of 0.85 for loading, unloading and stops, over 90 hours:

8 × 110 × 60/55 × 0.85 × 90 = **73,440 kg a week**, or 816 kg/h.

The laundry washes 60,000 kg a week, a utilisation of **81.7%**. That is a busy wash room, and on the worst days it does run full, which is where the 37 wash-capacity failures sit. But the wash room's own load records show the peaks absorbed within the shift on most days, because soiled linen arrives across the day and washing can start as soon as it does, while ironing can start only once washing and drying are complete. The washers have about 18% of headroom; the ironers have none.

Growth changes that over time. At the owners' estimate of 3% a year, wash volume reaches 90% of capacity, 66,096 kg a week, after 3.27 years, during year 4, and 100% after about 6.8 years. By year 5 the ironers' peak-day need has grown to 599.0 kg/h. Both numbers come back later: the 90% point becomes the trigger for a decision on new washing capacity in Chapter 8, and the year-5 ironer peak becomes a requirement in Chapter 9.

```figure
type: compare
title: Capacity against need: ironers and washers
cols: Nominal | Effective | Needed, average | Needed, peak day | Position
caption: This is an illustration. The ironers' nameplate rate suggests plenty of room; the effective rate against the peak day shows a 20.0% shortfall. The washers, the stage the owners asked to replace, have about 18% headroom today.
- * Ironer lines 1 and 2 | 600 kg/h | 413.1 kg/h | 413.3 kg/h | 516.7 kg/h | 103.6 kg/h short on peak days
- Washer-extractors (8) | 960 kg/h | 816 kg/h | 666.7 kg/h | absorbed within the shift on most days | 81.7% utilised; 90% during year 4
```

The washers' nominal rate in the figure is 8 × 110 × 60/55 = 960 kg/h, before the 0.85 factor. The [Capacity Check tool](/tools/capacity/) reproduces both calculations from working time, cycle time and efficiency.

## Where the cost, water and energy gaps come from

The same discipline applies to the other three measures: find where the cost, water and energy are actually used before deciding what to change.

**Cost.** Labour is A$2,856,000 of the A$5,337,704 annual cost, 53.5%, or about A$0.915 of the A$1.711 per kilogram. Within labour, the largest single block is the people who feed sheets into the ironers and fold their output by hand, on both lines and both shifts, followed by the overtime that clears the peak-day backlog. Maintenance is A$290,000 a year, and line 1 alone accounts for about A$90,000 of it, 31%. A cost gap of A$0.051/kg is therefore more likely to be closed in the ironer room than in the wash room, where the eight washer-extractors are loaded by a small crew.

**Water.** Every litre the laundry uses goes through the washer-extractors, most of it in the rinse steps. The water gap is the one gap for which washing equipment is the cause, and the options in Chapter 8 that close it all act in the wash room: machines that rinse with less water, and reuse of the cleaner final-rinse water for the next load's early steps.

**Energy.** Gas is 5.1 of the 6.00 MJ/kg. Heating wash water takes 2.4 MJ/kg (47.1% of the gas), drying 1.6 MJ/kg (31.4%) and the ironers' heated rolls 1.1 MJ/kg (21.6%); electricity adds 0.90 MJ/kg. Wash heat is 40% of all the energy the laundry uses, and much of it leaves through the drain in warm waste water. Using less water and recovering heat from the drain both act on the largest energy item. The ironers matter for energy too: a modern line with better insulated rolls uses less gas per kilogram.

Put together, the causes form a pattern that the original request did not see.

```figure
type: compare
title: Causes against the four measures
cols: OTIF | Cost per kg | Water | Energy
caption: This is an illustration. Read across a row to see which targets a cause affects. The ironers and dispatch drive delivery and much of the cost; the wash room drives water and energy but only 9.0% of failures.
- * Ironer capacity on peak days | 157 failures | overtime, about A$68,000 a year | none | none
- * Ironer line 1 reliability | 74 failures | about A$90,000 a year maintenance | none | rolls use 1.1 MJ/kg of gas
- * Dispatch, loading and routes | 111 failures | vehicles and drivers | none | none
- Manual feeding and folding | none directly | largest labour block of 53.5% | none | none
- Washer-extractors | 37 failures | small crew | all of 14.0 L/kg | wash heat 2.4 MJ/kg
- Dryers | none | small | none | 1.6 MJ/kg
- Customers' collection times | 33 failures | none | none | none
```

The matrix answers the question the Pareto alone could not. The OTIF gap and a large part of the cost gap come from the same place, the ironer room, with dispatch as the second front. The water and energy gaps come from the wash room. A plan that only renews the wash room can close two gaps and leave the two that decide the hospital contract almost untouched.

## The error: nominal capacity against the average

This is an illustration. Before the operations manager's analysis, the owners' first capacity check, prepared for the board paper that accompanied the request for a new plant, compared the ironers' nominal capacity with the average need:

600 kg/h available against 413.3 kg/h needed: **31.1% spare**.

On that basis the ironers were described as "well within capacity", and the delivery problem was attributed to the wash room and to "driver issues". The check made two mistakes at once. It used the nameplate rate, which assumes the lines run all the time at full speed, and it used the average day, which hides the days on which the failures happen.

The error was found by the dispatch supervisor, who kept a simple log of flatwork carried over at the end of the second shift because it decided how many vans could leave on time the next morning. The log showed carry-over on every Monday in the 26 weeks and on most days after a breakdown on line 1. A process with 31.1% spare capacity does not leave work behind every Monday. The operations manager redid the check with the effective rates from the downtime log and counters, and with the peak-day need from the daily flatwork records:

413.1 kg/h effective against 516.7 kg/h on a peak day: **20.0% short**.

The difference between the two checks is not a rounding matter. One said the ironers had 186.7 kg/h to spare; the other said they were 103.6 kg/h short, a swing of 290.3 kg/h, almost the whole nominal rate of one line. The board paper was withdrawn, and the laundry adopted three rules for any capacity statement: use effective rates from logged data, test against the peak period in which failures occur, and reconcile the result with an independent record of what actually happened, such as the carry-over log.

A capacity model like this one can and should be tested before anyone buys plant on the strength of it. [Discrete-event simulation: sizing the end-of-line test](/reados/publications/prototypes-and-simulation-by-the-numbers/discrete-event-simulation-of-the-test-line/) in *Prototypes and Simulation by the Numbers* shows the same trap in another setting, where test bays sized from the average load could not cope with the timing of real work, and how a simple simulation exposes it before the money is committed.

## What the causes mean for the options

The analysis does not yet choose a solution, but it constrains every solution that follows. An option that does not add effective ironer capacity on peak days cannot remove the 157 backlog failures. An option that keeps line 1 in service must lift its availability, or the 74 breakdown failures remain. An option that does not change dispatch leaves 111 failures, more than the 93 allowed on their own. And an option that does not change the wash room cannot reach 10.0 L/kg or 5.0 MJ/kg.

Chapter 7 turns those constraints into a benefits dependency network, linking each target to the business changes and the equipment that would move it, and Chapter 9 turns the ironer shortfall into a requirement that a new line must meet on the customer's own linen.

## Exercise: maintenance instead of a new line

The maintenance leader proposes a preventive maintenance contract for line 1 that would lift its availability from 0.72 to 0.90, the same as line 2, with performance unchanged at 0.85. Calculate the two lines' effective rate and compare it with today's peak-day need and with the year-5 peak of 599.0 kg/h. Does maintenance alone close the ironer gap?

**Worked answer.** Line 1 would deliver 300 × 0.90 × 0.85 = 229.5 kg/h, the same as line 2, so the two lines together give 229.5 + 229.5 = **459.0 kg/h**. Against today's peak-day need of 516.7 kg/h they are still **57.7 kg/h short**, about 11% below the need, and against the year-5 peak of 599.0 kg/h they are about 140.0 kg/h short. Better maintenance is worth having, because it would reduce the 74 breakdown failures, but it cannot close the peak-day gap: the shortfall is a capacity problem, not only a reliability problem. Chapter 8 tests a do-minimum option built around exactly this contract and finds the same limit in delivery terms.
