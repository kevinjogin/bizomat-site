---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: discrete-event-simulation-of-the-test-line
order: 9
title: "Discrete-event simulation: sizing the end-of-line test"
description: "An average-load sum said 2 test bays; a 12-week discrete-event model with day-shift loading shows 2 bays pass 5.4 units a day against 10 built, and 4 bays keep up."
draft: false
---

Every BPU-5 leaving the factory is charged, discharged at full load and recharged to a shipping level in an end-of-line test bay. The number of bays is a production decision taken late in development, often from a simple sum of hours. That sum assumes the bays can be loaded whenever a test finishes. In the case, they cannot: the operator who loads and unloads them works one shift, and a bay that finishes at 19:00 holds its unit until morning.

Rules like that are where formulas stop working. This chapter builds a discrete-event simulation of the test line, verifies it against the formula in the case where both should agree, checks it against the pilot build, and uses it to size the bays. It ends with the two bays that were bought from the average-load sum and the growing pile of untested units that showed they were not enough.

## The test and the rules

This is an illustration. All amounts are Australian dollars excluding GST. At full rate the factory assembles **10 units a working day** in one shift, finishing the first at about 7:30 and the rest at intervals of about 48 minutes. The end-of-line test charges the unit, discharges it at 3 kW, and recharges it to its shipping charge. It takes a mean of **4.0 hours**, with a standard deviation of 0.25 hours. About **6%** of units fail their first test; they are taken out, repaired in about **1.0 hour**, and given a full retest. A bay's equipment, a programmable load, a charger, a data logger and an enclosure, costs **A$11,000**.

The operator loads and unloads bays only between **7:00 and 15:30 on weekdays**. A test may run outside those hours, but a finished unit stays in its bay until the operator returns, and an empty bay cannot be loaded until then.

## Sizing by average load

The obvious calculation adds up the work. Each unit needs 4.0 hours of testing, and 6% of units need a repair and a retest, counted conservatively as another 5.0 hours. A day's production therefore needs

10 × (4.0 + 0.06 × (1.0 + 4.0)) = **43 bay-hours** per working day.

A bay can run 24 hours a day, so the line needs 43 ÷ 24 = **1.79 bays**, which rounds up to **2 bays**. Over a seven-day week the 215 bay-hours of work needs only 215 ÷ 168 = **1.28 bays** of continuous running. On either reading, 2 bays look adequate with room to spare.

## What the sum leaves out

The sum treats bay time as a pool that can be used at any hour. The shift rule breaks that. A bay loaded at 7:00 finishes at about 11:00; loaded again then, it finishes at about 15:00; loaded a third time just before the operator leaves, it finishes at about 19:00 and then waits with a finished unit until 7:00. That is **at most 3 tests per bay per working day**. Two bays can therefore do at most 30 tests in a five-day week, against the 53 tests that 50 units and their retests need. On Friday afternoon the last unit loaded sits in its bay until Monday.

No standard queueing formula handles a server that can start work only in certain hours and that stays blocked after finishing until those hours return, with retests feeding back into the queue. Those are exactly the features a discrete-event simulation is built for.

```figure
type: timeline
title: One test bay's working day under the shift rule
caption: This is an illustration. Mean 4.0-hour test; the operator loads and unloads only from 7:00 to 15:30 on weekdays. The third test of the day finishes after the shift and holds the bay overnight.
- 7:00 | Unload overnight unit, load test 1 | operator starts the shift
- 11:00 | Unload, load test 2 | about 4.0 h later
- 15:00 | Unload, load test 3 | just inside the shift
- 15:30 | Operator leaves | no loading or unloading until morning
- * 19:00 | Test 3 finishes | unit stays in the bay for 12 hours
- 7:00 next day | Unload, load test 1 | at most 3 tests per bay per working day
```

## The parts of a discrete-event model

A discrete-event simulation represents a system as **entities** that move through it (here, BPU-5 units), each with **attributes** (when it was assembled, whether it has failed a test), **resources** they compete for (test bays, and the operator's hours), **queues** where they wait, and **events** that change the system's state: a unit is assembled, a test starts, a test ends, a unit is unloaded, a repair finishes. A **clock** moves from one event to the next, and **rules** decide what happens at each one: which unit is loaded next, whether a bay may be unloaded at this hour. Law's *Simulation Modeling and Analysis* sets out the structure and the practice of building, checking and running such models.

The BPU-5 model was deliberately small. Units joined a single first-in, first-out queue as they were assembled, with assembly times varied by up to ±0.2 hours around the schedule. Each test took a random time from a normal distribution with mean 4.0 hours and standard deviation 0.25 hours; each first test failed with probability 0.06, and a failed unit rejoined the queue one hour later for a full retest. A bay could be loaded or unloaded only in shift hours. Instead of jumping from event to event, the model advanced its clock in steps of 3 minutes and checked every bay at each step. That is simpler to write and to read, and with tests of about 4 hours a 3-minute step changes the results very little. Each run covered **12 weeks** of production, with the random numbers drawn from a seeded generator, seed **20261028**.

## Verification: switch the rule off

Before trusting the model with the shift rule, it was run without it, with bays loaded at any hour, seven days a week. In that case the formula should be right, and the model should agree with it.

With 2 bays and no shift rule, the model passed **10.0 units a working day**, exactly the assembly rate. The bays were busy **62.3%** of the time. The formula predicts testing time of 50 × 4.0 + 3 × 4.0 = 212 bay-hours a week, out of 2 × 168 = 336 available, or 63.1%; the difference is within the random variation of a 12-week run. Units took a mean of **9.7 hours** from assembly to pass. The model reproduces the formula where the formula applies, so any difference with the rule switched on comes from the rule.

## Validation: the pilot build

The PVT build put 30 units through the production line at the full rate of 10 a day over three days, and the real test line, with its 2 bays, gave a check on the model's behaviour. Run for the same 30 units, the model predicted that the number of units waiting or in test at 15:30 would rise to 8, 12 and 18 over the three build days, then fall to 12, 7, 2 and 0 as the bays worked through the backlog, with the last unit unloaded at 7:00 on the fourth working day after the build ended. The real count followed that shape: it rose each build day and took most of the following week to clear. A model that reproduces the observed pattern on the pilot has earned some trust for the question it was built for, the full rate, which no pilot can show directly.

## Run length, start-up and repeat runs

Three choices about how the model is run matter as much as how it is built. The first is the starting state. The model starts with empty bays and no queue, which flatters the first days, so a run must be long enough for the start to wash out; Law calls this the warm-up problem and describes ways to detect and discard the warm-up period. Twelve weeks is long enough here: with 4 bays the count of units waiting or in test at 15:30 is between 5 and 9 from the first day to the last, with no trend. The second is the measure. Units passed a day and the largest queue answer the sizing question; the mean time from assembly to pass answers the delivery question. The third is repetition. One run is one possible 12 weeks, and the answer should be checked on other random numbers before anyone spends money on it.

## Results at full rate

This is an illustration. Each configuration was run for 12 weeks at 10 units a working day, seed 20261028:

- **2 bays:** 5.4 units passed a working day; the queue grew without limit, reaching **275** units; mean assembly to pass 470 hours.
- **3 bays:** 8.15 a day; the queue reached **110** and was still growing; mean 192 hours.
- **4 bays:** **9.9 a day**, keeping pace with assembly (594 of the 600 units built had passed by the end of the run, with the rest in test or waiting); largest queue **8**; mean assembly to pass **20.8 hours**.
- **5 bays:** 9.9 a day; largest queue 3; mean 16.6 hours.

Four bays are the smallest number that keep up. A fifth saves about 4 hours of mean lead time, which mostly means a unit is unloaded at 7:00 rather than 11:00, and that is not worth A$11,000.

```figure
type: bars
title: Units passed per working day by number of bays, with the largest queue
unit: units a day
max: 10
caption: This is an illustration. Discrete-event model, 12 weeks at 10 units a working day, day-shift loading only, seed 20261028. Two bays, sized by average load, pass little more than half of production.
- 2 bays | 5.4 | largest queue 275, still growing
- 3 bays | 8.15 | largest queue 110, still growing
- * 4 bays | 9.9 | largest queue 8; mean 20.8 h assembly to pass
- 5 bays | 9.9 | largest queue 3; mean 16.6 h
```

Two further checks support the 4-bay result. Run with seeds 20261029 and 20261030, the model gave **9.87 and 9.90 units a day**, mean lead times of 20.1 and 21.3 hours, and a largest queue of 7 each time, so the conclusion does not depend on one set of random numbers. And Little's law, from [Queues in the test lab: utilisation, waiting and Little's law](/reados/publications/prototypes-and-simulation-by-the-numbers/queues-in-the-test-lab/), gives the average number of units in the test area: 50 units a week over 168 calendar hours is 0.2976 units an hour, and with a mean time of 20.8 hours, L = 0.2976 × 20.8 = **6.2 units**.

The model also shows where the bay time goes. With 4 bays, each bay was testing only **31%** of the time and holding a finished unit for another **67%**, waiting for the operator. A bay that tests for 4 hours and then holds the unit for 12 is not short of capacity in the formula's sense; it is short of loading opportunities. That suggests the alternatives tested in the exercise: more hours of loading, or more bays.

```figure
type: compare
title: Test-line sizing by formula and by simulation
cols: Units passed a working day | Mean assembly to pass | What it shows
caption: This is an illustration. The formula and the model agree when bays can be loaded at any hour. With day-shift loading, the same 2 bays fall behind from the first week.
- Average-load sum | 10 (1.79 bays needed) | not stated | assumes bays loaded at any hour
- DES, no shift rule (verification) | 10.0 | 9.7 h | agrees with the formula; bays 62.3% busy
- * DES, day-shift loading | 5.4 | 470 h | queue reaches 275 in 12 weeks
- DES, day-shift loading, 4 bays | 9.9 | 20.8 h | keeps pace; bays testing 31% of the time
```

## The error: two bays from a sum of hours

This is an illustration. Production engineering sized the test line from the average-load calculation and bought **2 bays**. Nobody had connected the bay calculation to the operator's shift, which was set in a separate staffing plan.

The problem was detected during the PVT build, from the operations manager's daily count of units awaiting test. The count rose every day of the build and stayed high for most of the following week, at a production rate of 10 a day sustained for only three days. Extrapolating that pattern to full rate was not something a spreadsheet could do with any confidence, so the lead electrical engineer built the discrete-event model in **3 days** of engineer time, 24 hours at A$140 an hour, **A$3,360**. The model showed that 2 bays would fall behind from the first week of full production, with untested stock growing by about 23 units a week; at the target unit cost of A$4,720, the 275 units waiting after 12 weeks would have tied up about A$1.3 million.

Two more bays were bought for **A$22,000** and installed before full-rate production began. The cost of finding the problem at PVT was the model and the bays; finding it after release would have added late deliveries and overtime to both.

The general point is that capacity sized from averages ignores the rules under which the capacity can be used. [Rollout rhythm: cadence, line of balance and batch size](/reados/publications/modular-projects-by-the-numbers/rollout-rhythm/) in *Modular Projects by the Numbers* makes the same argument for crews installing repeated units, and [Working back from the gap to its causes](/reados/publications/outcome-first-projects-by-the-numbers/where-the-gap-comes-from/) in *Outcome-First Projects by the Numbers* finds a plant's real constraint by capacity analysis on peak days rather than average ones. Monte Carlo models, as in [Monte Carlo in a spreadsheet: will the unit last the day](/reados/publications/prototypes-and-simulation-by-the-numbers/monte-carlo-for-the-working-day/), handle uncertainty in quantities; discrete-event models handle uncertainty in timing, sequence and rules.

## Exercise: a second shift instead of more bays

Instead of buying two more bays, the operations manager proposes a second-shift operator so that bays can be loaded and unloaded from **7:00 to 23:30** on working days. The model gives, for 12 weeks at seed 20261028: with **2 bays**, 8.95 units passed a working day, a mean of 118 hours from assembly to pass and a largest queue of 66; with **3 bays**, 9.98 a day, a mean of 8 hours and a largest queue of 6. A second-shift operator costs 8 hours × A$75 an hour × 240 working days. Which option should the business choose?

**Worked answer.** With the longer loading window, 2 bays still fall behind: 8.95 a day against 10 built, and a queue of 66 units after 12 weeks. Three bays keep up, and with lead times of 8 hours they would ship faster than 4 bays on one shift. But the second shift costs 8 × A$75 × 240 = **A$144,000 a year**, as well as A$11,000 for the third bay, against **A$22,000 once** for two more bays on one shift. Four bays on the day shift meet the rate for a small fraction of the cost. The second shift would be worth revisiting only if the line's lead time, rather than its throughput, became the constraint.
