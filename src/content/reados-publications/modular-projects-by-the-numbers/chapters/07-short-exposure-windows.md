---
book: modular-projects-by-the-numbers
chapterSlug: short-exposure-windows
order: 7
title: "Short exposure windows: installing in days, not weeks"
description: "Disruption risk grows with days on site: 69.9% over 15 days against 21.3% over 3, A$228,000 against A$58,600 of site-related cost per cell, and a permit day nobody planned."
draft: true
---

A production line that has been stopped and opened up for an installation is at its most vulnerable. The product is not flowing, the guarding is off, contractors are working beside people who run the next line, and the plan depends on parts, permits, people and services all arriving when the schedule says they will. Every day the line stays open is another day for something to go wrong. The bespoke option in the running case keeps each line open for about three weeks; the modular option for about three working days. This chapter puts numbers on what that difference is worth.

It models disruption as events that arrive at a steady average rate, shows how the chance of at least one event and the expected cost grow with the days on site, and prices the exposure for both options. It then describes how work is moved out of the window, sets out an installation plan for one cell, and covers the safety of the people doing it. The error case is an installation planned for three days that took four, because a step nobody had written down took a day.

## Risk accumulates with time on site

Some things go wrong during almost every installation, and they are not all foreseeable one by one. A cable is found damaged when a cover comes off. A part arrives wrong. A crane booking falls through. The maintenance team on the next line needs the same isolation. A services fault appears when the load changes. Each of these is a **disruptive event**: something that stops or slows the installation enough to cost real money, here an average of **A$40,000**, excluding GST, in rework, extra labour and extended downtime.

This is an illustration. The case assumes disruptive events arrive at an average rate of **λ = 0.08 per working day on site**, about one every 12.5 working days, independently of one another. That is a **Poisson process**, the simplest model of events that occur at random at a steady average rate. It gives three useful results for a stay of t working days:

```figure
type: formula
title: Exposure to disruptive events over a stay on site
formula: expected events = λ × t
formula: P(at least one event) = 1 − e^(−λ × t)
caption: This is an illustration with λ = 0.08 disruptive events per working day on site and an average cost of A$40,000 per event, excluding GST.
- λ | average disruptive events per working day on site, 0.08
- t | working days the line is stopped and open, 15 bespoke or 3 modular
- e | the base of natural logarithms, about 2.718
step: Bespoke, 15 days: expected events = 0.08 × 15 = 1.2; P(at least one) = 1 − e^(−1.2) = 69.9%
step: Modular, 3 days: expected events = 0.08 × 3 = 0.24; P(at least one) = 1 − e^(−0.24) = 21.3%
step: Expected disruption cost = expected events × A$40,000: A$48,000 bespoke, A$9,600 modular
```

The two measures behave differently. The expected number of events, and with it the expected cost, rises in proportion to the days on site: five times the days, five times the expected cost. The chance of at least one event rises more slowly, because it cannot exceed 100%. Five times the days gives only 3.28 times the probability (69.9% against 21.3%), and beyond about 8.7 working days a disruption is more likely than not.

```figure
type: line
title: Chance of at least one disruptive event by working days on site
x: Working days on site
y: Chance of at least one event, %
ymin: 0
ymax: 100
mark: 3 | modular
mark: 15 | bespoke
caption: This is an illustration with λ = 0.08 per working day. The chance passes 50% at about 8.7 working days. The expected cost, unlike this curve, rises in a straight line with the days.
- 0 | 0
- 1 | 7.7
- 2 | 14.8
- 3 | 21.3
- 4 | 27.4
- 5 | 33.0
- 8 | 47.3
- 10 | 55.1
- 15 | 69.9
- 20 | 79.8
```

The spread matters as well as the average. Over 15 days, the Poisson model gives a 30.1% chance of no event, 36.1% of exactly one and **33.7% of two or more**: one bespoke installation in three would suffer at least two disruptions, costing A$80,000 or more at the average of A$40,000 an event. Over 3 days, the chances are 78.7%, 18.9% and **2.5%**: about one modular installation in 40. Across the whole programme, twelve bespoke installations expect 14.4 events and twelve modular ones 2.88.

```figure
type: compare
title: How many disruptive events one installation suffers
cols: No event | Exactly one | Two or more | Expected events
caption: This is an illustration from the Poisson model with λ = 0.08 per working day. Rows may not sum to 100% because of rounding.
- Bespoke, 15 working days | 30.1% | 36.1% | 33.7% | 1.2
- * Modular, 3 working days | 78.7% | 18.9% | 2.5% | 0.24
```

The model is deliberately simple, and its simplifications should be stated. The real rate is not steady: it is higher on the first day, when covers come off and old equipment is removed, and during commissioning, when the new cell meets the real line. Events are not always independent, since one delay can cause another by pushing work into a contractor's next booking. A business that wants a better λ can count the disruptive events in its own past shutdowns and divide by the working days they lasted. If, for example, its last ten major shutdowns lasted 150 working days in all and suffered 12 events that each cost more than a day's work, its own rate is 12 ÷ 150 = 0.08 a day. Ten shutdowns is a small sample, so the estimate is rough, but it is the business's own and it can be updated after every installation the programme makes. The point the model makes survives its simplifications: exposure is bought by the day, and a shorter stay buys less of it.

## What the exposure costs

Three costs of each installation depend on the time on site. The first is **lost contribution**: the line produces nothing while it is stopped, at A$8,000 a working day in the case. The second is the **expected disruption cost** from the events above. The third is the **site works** themselves, which are larger when the work is done in place around a stopped line, as Chapter 2 explained.

This is an illustration, in A$ excluding GST. For one bespoke cell, the site works cost A$60,000, the lost contribution is 15 × A$8,000 = A$120,000 and the expected disruption is 15 × 0.08 × A$40,000 = A$48,000, a total of **A$228,000**. For one modular cell, they are A$25,000, 3 × A$8,000 = A$24,000 and 3 × 0.08 × A$40,000 = A$9,600, a total of **A$58,600**. The difference is **A$169,400 a cell**, or **A$2,032,800** across twelve.

At programme level, the bespoke option stops lines for 12 × 15 = 180 working days and the modular option for 12 × 3 = 36. The lost contribution is A$1,440,000 against A$288,000, and the expected disruption A$576,000 against A$115,200. Chapter 9 sets these savings beside the design-once cost and the extra workshop assembly that the modular option pays for them.

```figure
type: compare
title: Site-related cost of one installation
cols: Bespoke, 15 days | Modular, 3 days | Difference
caption: This is an illustration, in A$ excluding GST. The lost contribution is real money every time; the disruption cost is an expected value, the average over many installations.
- Site works | A$60,000 | A$25,000 | A$35,000
- Lost contribution at A$8,000 a day | A$120,000 | A$24,000 | A$96,000
- Expected disruption, events × A$40,000 | A$48,000 | A$9,600 | A$38,400
- * Total per cell | A$228,000 | A$58,600 | A$169,400
- Total for twelve cells | A$2,736,000 | A$703,200 | A$2,032,800
```

Two points about these numbers. The lost contribution is the largest single item, and it is the one most easily underestimated, because nobody receives an invoice for it. The business's A$8,000 a day is its net contribution from one line; if operators cannot be redeployed while their line is stopped, their wages add to it, and a restart after a long stoppage has its own cost in waste and slow running. The [Downtime Cost tool](/tools/downtime-cost/) adds those items to lost contribution, which is a useful check on the daily figure before it is multiplied by fifteen.

The expected disruption cost, by contrast, is an average, not a bill. A bespoke installation will usually cost either nothing or A$40,000 or more for disruption, rarely A$48,000. The expected value is the right number for comparing options across twelve installations, and the spread in the previous section is the right picture of what any one installation might do.

## Moving work out of the window

The modular cell's three days are not a matter of working faster. They come from moving work to places where time is cheap. The cell is built and tested in the integrator's workshop, where a delay costs workshop hours but no production. It arrives on its two skids, pre-wired and with its software already proved in the factory acceptance test. The site works, the in-feed section, the services to the handover points, the anchors and the network connection, are completed and proved against the interface specification while the line is still running. What remains for the window is to remove the manual station, set and anchor the skids, connect interfaces that have already been checked, and prove the cell with product. The site acceptance test, like the 12-hour factory test each production cell passes before it ships, sits outside the three days: it runs once the line has restarted.

```figure
type: checklist
title: Ready to stop the line: pre-installation checks
caption: This is an illustration. Each item is proved before the line stops, not on the installation weekend. The last two came from this chapter's error case.
- Site survey signed against every value in the interface specification | including the in-feed height
- In-feed section installed and run with product, diverted back to manual packing | before the stop
- Power at the isolator, air at the inlet and network signals tested | against the specification, at peak site demand for air
- Anchor holes drilled and the slab level checked over the skid footprint |
- Factory acceptance test passed and records received | 12 hours without a stoppage; the cell released to ship
- Lifting and transport plan approved, equipment booked | with a named person in charge of each lift
- Back-out plan agreed | manual tables and pallet positions stored, ready to reinstate
- Isolation points walked and agreed with the site's authorised person | names, times and permit forms settled in advance
- x Starting the stop with any item still open | an open item becomes a day on site
- ? Who decides go or no-go at the end of the second day, and on what evidence
```

The **back-out plan** deserves a note. If the cell cannot run by the end of the window, the line must still produce. The case keeps the manual station's tables and pallet positions in storage until the new cell has passed its site acceptance test, so that the line can restart with hand-packing while the problem is fixed. Without that option, a failed installation would lose A$8,000 for every further day until the cell runs.

## The installation plan

This is an illustration. The plan below is for one modular cell. The line stops at the end of its last shift on Day 0 and restarts on Day 4, so three working days of production are lost. Chapter 2's site survey and pre-installation check come ten weeks before.

```figure
type: timeline
title: Installation plan for one modular cell
caption: This is an illustration. Three working days of production are lost, Days 1 to 3. Hold points at the end of each day decide whether the plan continues or the back-out plan starts.
- Week −10 | Site survey and pre-installation check | every interface value measured and signed
- Week −4 | Site works complete and proved | in-feed, power, air, anchors, network; isolation points agreed
- Week −2 | Factory acceptance test passed | 12 hours without a stoppage; cell released; records sent to site
- Day 0, end of last shift | Line stops | isolation applied, permits issued, last cases cleared
- Day 1 | Manual station out, skids in | skids set, levelled and anchored; hold point: mechanical complete
- Day 2 | Connections and checks | power, air, network and in-feed connected; inputs, outputs and safety functions checked; go or no-go
- * Day 3 | Product trials and safety validation | runs with product; safety functions validated by a competent person
- Day 4, first shift | Line restarts with the cell | site acceptance test runs in production, as Chapter 4 describes
```

The order of the days matters. Mechanical work comes first because it is the least likely to go wrong after the preparation above, and it frees the second day for connections and checks, where problems usually appear. The go or no-go decision at the end of Day 2 leaves a full day either to finish the cell or to reinstate the manual station before the line is due to restart.

## People and safety during the window

Until a cell runs, its line is still packed by hand. Chapter 1 estimated that the stacking operator on one line lifts about 12.6 tonnes of cases a shift, so every week a cell is late extends that manual handling exposure, which is part of the outcome the programme exists to remove. During the window itself, the hazards change rather than disappear. Heavy skids are moved beside a running line. Electrical, pneumatic and stored energy must be isolated and proved dead. The robot is commissioned with people nearby, before every safety function has been validated.

A short window creates its own pressure: when the plan is three days, a step that takes an extra half-day is tempting to skip. The plan has to give isolation, permits and safety validation their own time, because they are not optional and cannot be compressed by working harder. Safety functions must be validated by competent people before the cell enters production, under the work health and safety laws, the model Code of Practice for managing the risks of plant, and the AS/NZS 4024 series that covers machinery safeguarding. If the cell stops during its first weeks and operators hand-stack as a stopgap, that arrangement needs the same planning as the original manual station: lifting heights, rotation and the number of cases handled.

## The error: the day nobody planned

This is an illustration. Cell 7 was the first installation at site B. Its plan was copied from the six installations at site A, which had each finished in three days. At site A, the line's supply is isolated at a local board by the installer's electrician under the site's permit. At site B, the board serving the line also serves the line next to it, and the site's procedure requires its own authorised electrical person to apply the isolation, after the neighbouring line has been stopped and its stop agreed with production planning.

Nobody had asked. The site survey covered the technical interfaces, and site B's survey correctly recorded the supply at the isolator, but nothing in the survey or the plan covered site procedures. On Day 1, the installer's electrician presented for the permit at 06:00 and was told the authorised person would not be on site until Day 2, when the neighbouring line was scheduled for a planned stop anyway. The skids went in on Day 1, but connections could not start until Day 2. The installation took **four working days**.

The cost of the extra day was 1 × A$8,000 = **A$8,000** of lost contribution, which was real, and the expected disruption rose from A$9,600 to 4 × 0.08 × A$40,000 = A$12,800, another **A$3,200** of exposure: the chance of at least one disruptive event rose from 21.3% to **27.4%**. The cell's benefit started one day later, about A$180,000 ÷ 365 = A$493. The total was about **A$11,200** of cost and exposure for one missing line in a plan.

It was detected at the plan's first hold point. The plan required isolation proved by 08:00 on Day 1; when that failed, the installer escalated to the programme engineer before any further work was booked, and the day's tasks were reshuffled so that mechanical work went ahead.

The correction was to treat site procedures as interfaces. The pre-installation checklist gained the last item shown above: isolation points walked and agreed with each site's authorised person at week −4, names and times confirmed in week −1, and the isolation applied as part of the line stop on Day 0. The structured prompts in [Finding project risks before they find you](/reados/collections/project-planning-and-control/finding-project-risks-before-they-find-you/), which test assumptions and interfaces one by one, would have caught the gap. Had the extra day recurred on the five remaining installations at sites B and C, it would have cost about 5 × A$11,200 = **A$56,000**.

## Exercise: a two-day installation

The integrator offers to do more pre-commissioning in its workshop, including a full simulated run of the site connections, so that the installation needs only two working days. It asks A$10,000 extra per cell, excluding GST. For the 11 rollout cells, is the offer worth taking?

**Worked answer.** One fewer working day saves A$8,000 of lost contribution and 1 × 0.08 × A$40,000 = A$3,200 of expected disruption, A$11,200 a cell. Against the A$10,000 price, the net gain is **A$1,200 a cell**, or 11 × A$1,200 = **A$13,200** across the rollout. The chance of at least one disruptive event falls from 21.3% to 1 − e^(−0.16) = **14.8%**. The gain is thin and fragile: a single two-day plan that slips to three days, as the error case shows plans can, costs A$11,200 and erases most of the programme-wide gain. A reasonable response is to accept only if the integrator shows a credible two-day plan with its hold points, and to make the extra A$10,000 payable only for installations that finish in two days.
