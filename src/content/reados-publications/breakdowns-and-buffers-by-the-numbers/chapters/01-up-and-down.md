---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: up-and-down-the-two-state-model
order: 1
title: "Up and down: the two-state model"
description: "A repairable machine as a two-state Markov process: failure and repair rates from a stoppage log, steady-state availability, settling after a restart, and why stop definitions matter."
draft: false
---

The simplest useful description of a machine is that it is either running or stopped. While it runs, there is a steady chance in each minute that it will stop; while it is stopped, there is a steady chance in each minute that it will be restarted. That is all a two-state Markov model says, and it is enough to answer the first questions anyone asks about a machine: what share of the time it runs, how often it stops, how long stops last on average, and how quickly a machine that has just been restarted settles into its usual pattern.

This chapter turns a month of the bagger's stoppage log into a failure rate and a repair rate with the BIZOMAT availability tool, writes down the model's balance equation, solves it for the long-run availability and for the hour after a restart, and converts the result into bags. It ends with two records of the same machine, the operators' log and the maintenance system, that gave availabilities two and a half points apart, and the reason why.

## A month of the bagger's log

This is an illustration. The bagger on line 1 was scheduled for two 8-hour shifts a day, five days a week, for four weeks: 320 hours. Its operators logged every stop with a start and end time. Adding them up gave 142 stops and 35.6 hours stopped, leaving 284.4 hours running.

The [repairable asset availability tool](/tools/maintenance-availability/) turns those three numbers into the basic measures. From the operating time, the corrective downtime and the number of failures in one observation window, it calculates the observed availability, operating time divided by operating plus corrective downtime, the operating-time mean time between failures and the average corrective downtime per failure. It warns that zero failures does not mean an infinite mean time between failures, that the summary should not on its own set maintenance intervals, and that the failure definition must be consistent across the window.

```figure
type: stats
title: The bagger's month, from the repairable asset availability tool
caption: This is an illustration. Operating time 284.4 h, corrective downtime 35.6 h, 142 failures, over 320 scheduled hours. Every stop the operators logged counts as a failure here, however short.
- * 88.9% | Observed availability | 284.4 ÷ (284.4 + 35.6)
- 2.00 h | Mean time between failures | running hours per stop
- 15.0 min | Average downtime per stop | 35.6 h ÷ 142
- 3.6 | Stops per 8-hour shift on average | 142 ÷ 40 shifts
```

Two words in the tool's description deserve emphasis. The mean time between failures is counted in operating hours, not calendar hours, because a stopped machine cannot fail again. And "failure" means whatever the log counts as one. Both choices change the answer, as the error at the end of this chapter shows.

## Rates instead of times

The model works with rates. The failure rate λ is the reciprocal of the mean time between failures: the bagger fails at 1 ÷ 2.00 = 0.50 per running hour. The repair rate μ is the reciprocal of the mean downtime: it is restarted at 1 ÷ 0.25 = 4.0 per stopped hour. A constant rate means the chance of a change in the next short interval does not depend on how long the machine has been in its present state. A machine that has run for three hours is no more likely to stop in the next minute than one that has just started; a stop that has lasted ten minutes is no more likely to end in the next minute than one just begun. That memoryless property is what makes the model Markov, and Chapter 2 tests whether the bagger's data support it.

```figure
type: svg
title: The bagger as a two-state Markov process
alt: Two circles, labelled Running and Stopped. An arrow from Running to Stopped is labelled lambda equals 0.50 per hour. An arrow from Stopped back to Running is labelled mu equals 4.0 per hour. Beneath, the long-run shares of time are given as 88.9 per cent running and 11.1 per cent stopped.
caption: This is an illustration. The arrows carry rates, not probabilities: λ is failures per running hour and μ is restarts per stopped hour.
viewbox: 0 0 560 220
body:
<circle class="bxa" cx="140" cy="100" r="58"/>
<circle class="bx" cx="420" cy="100" r="58"/>
<text class="txb" x="104" y="106">Running</text>
<text class="txb" x="384" y="106">Stopped</text>
<path class="la flow" d="M196 80C260 40 300 40 364 80"/>
<path class="ah" d="M364 80l-13-2 7-10z"/>
<path class="la flow" d="M364 122C300 162 260 162 196 122"/>
<path class="ah" d="M196 122l13 2-7 10z"/>
<text class="tx" x="226" y="36">λ = 0.50 per hour</text>
<text class="tx" x="234" y="184">μ = 4.0 per hour</text>
<text class="tx txs" x="80" y="210">88.9% of the time</text>
<text class="tx txs" x="364" y="210">11.1% of the time</text>
```

## Why a constant rate is a reasonable start

It may seem unlikely that a machine with dozens of moving parts, several operators and a changing product should stop at a constant rate. The reason it often does is that its stops have many causes, each of them rare. A film splice that misses, a product clump in the weigher, a carton that sticks, a sensor that sees a shadow: each happens now and then, more or less independently of the others. Probability theory shows that when many independent, individually rare event streams are added together, the combined stream approaches a Poisson process, whose intervals are exponential and whose rate is constant, whatever the patterns of the individual streams. It is the same limit that turns a binomial count of rare events into a Poisson count, and it is why constant-rate models describe so many machines better than one might expect.

The limit fails when one cause dominates and that cause has a pattern of its own. A blade that wears and breaks every few hundred hours, a heater that ages, a stop that happens at every reel change: those are not random, and a model that treats them as random will mislead. Chapter 2 shows how to test for such patterns, and Chapter 10 how to deal with the wear-out parts separately.

## Estimates come with uncertainty

A month of data gives estimates, not exact rates. The number of stops in a fixed running time behaves approximately as a Poisson count, whose standard deviation is the square root of its mean. With 142 stops, the relative uncertainty of the failure rate is about 1 ÷ √142 = 8.4%, and a rough 95% range for the count is 142 ± 1.96 × √142, or about 119 to 165. Over 284.4 running hours that is a failure rate between about 0.42 and 0.58 per hour, a mean time between failures between 1.7 and 2.4 hours.

The mean repair time has its own uncertainty, which depends on how variable individual repairs are. If repair times were exponential, the standard error of their mean over 142 stops would be 15 ÷ √142 = 1.3 minutes. The bagger's repair times are more variable than that, as Chapter 3 shows, and the true standard error is about 3 minutes. The lesson is not that a month is too short, but that the model's predictions inherit the data's uncertainty. A prediction to three significant figures, such as 25,600 bags a shift, is a calculation from the central estimates; the real line could plausibly differ by several per cent. Decisions that depend on differences smaller than that need more data.

## The balance equation

Let P_run(t) be the probability that the bagger is running at time t, and P_stop(t) = 1 − P_run(t) the probability that it is stopped. In a short interval dt, a running machine stops with probability λ dt and a stopped machine restarts with probability μ dt. The change in P_run is the flow in minus the flow out. This is the master equation, the bookkeeping rule that Reichl and every text on stochastic processes start from, written here for two states.

```figure
type: formula
title: Master equation and steady state for a two-state machine
formula: dP_run ÷ dt = μ P_stop − λ P_run
formula: Steady state: λ P_run = μ P_stop, so A = μ ÷ (λ + μ) = MTBF ÷ (MTBF + MTTR)
caption: This is an illustration. In steady state the flow from running to stopped equals the flow back. The result is the same availability the tool reported, written in rates.
- Failure rate | λ = 0.50 per running hour
- Repair rate | μ = 4.0 per stopped hour
step: A = 4.0 ÷ (0.50 + 4.0) = 0.8889
step: Flow each way: 0.8889 × 0.50 = 0.4444 stops per scheduled hour = 0.1111 × 4.0
```

The steady state is reached when the two flows balance: the number of stops started per hour equals the number of stops ended per hour. That idea, balancing the flows between states, is the whole method of this book. Every later model has more states and more arrows, but each is solved by writing the same balance for every state.

## How fast the machine settles

The steady state describes the long run. A machine that has just been restarted at the beginning of a shift is certainly running, and its probability of running decays towards 0.889 over the next hour or so. Solving the master equation gives the path.

```figure
type: formula
title: Probability of running after a known start
formula: Started running: P_run(t) = A + (1 − A) × e^(−(λ + μ) t)
formula: Started stopped: P_run(t) = A × (1 − e^(−(λ + μ) t))
caption: This is an illustration. The time constant 1 ÷ (λ + μ) = 1 ÷ 4.5 h = 13.3 minutes sets how quickly the bagger forgets how it started.
- Time constant | 13.3 min
- After 15 min from running | 0.889 + 0.111 × e^(−1.125) = 0.925
- After 30 min from running | 0.901
- After 60 min from running | 0.890, within 0.1 point of the steady state
```

```figure
type: line
title: The bagger's probability of running after a restart and after a stop
x: Minutes after the known start
y: Probability of running
ymin: 0
ymax: 1
caption: This is an illustration. Both curves approach the same 0.889 with the same 13.3-minute time constant. After about three time constants the starting state no longer matters.
legend: Started running | Started stopped
- 0 | 1.000 | 0.000
- 5 | 0.965 | 0.278
- 10 | 0.941 | 0.469
- 15 | 0.925 | 0.600
- 20 | 0.914 | 0.691
- 30 | 0.901 | 0.795
- 45 | 0.893 | 0.859
- 60 | 0.890 | 0.879
```

The time constant answers a practical question. A trial run or a capability study that lasts 20 minutes after a fresh start will see the bagger running more often than it does in the long run, because the machine has not yet had time to stop as often as it will. A run of an hour or more sees close to the long-run behaviour. For the bagger the effect is small, but for a machine with rare, long stops the time constant can be hours, and short trials can badly overstate its availability.

## From availability to bags

Availability is a share of time; production cares about output. The bagger alone, running at 60 bags a minute for 88.9% of a 480-minute shift, would make 60 × 480 × 0.8889 = 25,600 bags. That is an upper limit for the line, because Chapter 4 shows that the case packer's own stops subtract more. It also assumes the bagger runs at full speed whenever it runs; slow running and small stops not logged as stops reduce output further, which is what the performance factor in overall equipment effectiveness measures.

Over a year of 500 shifts, the same figures give about 1,780 stops and 445 hours stopped on each bagger, or 7,100 stops and 1,780 hours across the four lines. Numbers on that scale are what make improvements worth pricing: shaving one minute from the average stop on all four baggers would return about 119 machine-hours a year, and Chapter 10 shows how to turn such figures into contribution once the case packer and the buffer are taken into account.

The model also gives the number of stops: 0.50 per running hour times 7.11 running hours is 3.56 stops in an average shift. Chapter 2 shows how much individual shifts vary around that average, and how to tell an unlucky shift from a changed machine.

## Where the definitions come from

The model's two numbers, λ and μ, are only as good as the definitions behind them. Three choices need to be made explicitly and written down.

- **What counts as a stop.** The operators logged every stop. A maintenance system usually logs only those that needed a work order. A sensor-based system may log every pause longer than a few seconds. Each gives a different λ.
- **When a stop ends.** At the restart button, or when the machine is back to full speed and making good product? For the bagger, the operators logged the restart, and the minutes of start-up scrap that follow are a quality loss, not downtime.
- **What time counts as scheduled.** Breaks, changeovers, cleaning and planned maintenance are excluded from the 320 hours here, so they are neither running nor stopped. Including them would change the availability without changing the machine.

Writing the three definitions at the top of every report that quotes an availability costs one line and prevents most arguments about whose figure is right. It also lets a later reader repeat the calculation from the raw log, which is the real test of any reliability figure.

The chapter on [maintenance that prevents breakdowns](/reados/collections/lean-and-continuous-improvement/maintenance-that-prevents-breakdowns/) discusses how the records a maintenance team keeps shape the decisions it makes.

## The error: two records, two availabilities

This is an illustration. The maintenance manager reported the bagger's availability for the same four weeks as 91.2%, from the maintenance system. The production manager, using the operators' log, reported 88.9%. Each suspected the other's figures.

The engineer put both records through the availability tool. The maintenance system held 28 work orders totalling 28.3 hours: only the stops that needed a fitter. The 114 shorter stops, about 7.3 hours cleared by the operators, were not in it, so the maintenance system counted those hours as running time. Entering 291.7 hours of operation, 28.3 hours of downtime and 28 failures gave an availability of 91.2%, a mean time between failures of 10.4 hours and a mean repair of 60.6 minutes. The operators' log gave 88.9%, 2.0 hours and 15.0 minutes.

```figure
type: compare
title: The same bagger and the same four weeks, from two records
cols: Stops counted | Downtime, h | Availability | MTBF, running h | Mean downtime per stop
rowhead: Record
caption: This is an illustration. Both are correct for their own definition of a stop. Neither alone describes the bagger well enough for the buffer and crew questions in later chapters.
- Maintenance system, fitter work orders only | 28 | 28.3 | 91.2% | 10.4 | 60.6 min
- * Operators' log, every stop | 142 | 35.6 | 88.9% | 2.0 | 15.0 min
```

Neither record was wrong. They described different things: the maintenance system described breakdowns, the operators' log described every interruption to output. For the question "what output will the line make?", the operators' log is the right one, because every minute stopped is a minute without bags. For the question "is one fitter enough?", the maintenance system is the right one, because only work orders need the fitter. The resolution was to keep both and to model the bagger with three states, running, minor stop and breakdown, which Chapter 3 does. The managers' disagreement was the first sign that two states were not enough.

## Exercise: the case packer's month

Over the same four weeks the case packer's log shows 270.0 hours running, 68 stops and 13.5 hours stopped. Find its availability, mean time between failures and mean downtime per stop, its failure and repair rates, and the time constant of its two-state model.

**Worked answer.** This is an illustration. The availability is 270.0 ÷ (270.0 + 13.5) = **95.2%**. The mean time between failures is 270.0 ÷ 68 = **3.97 running hours** and the mean downtime 13.5 ÷ 68 = 0.199 h, **11.9 minutes**. Rounded for modelling, λ = 1 ÷ 4.0 = **0.25 per running hour** and μ = 1 ÷ 0.2 = **5.0 per stopped hour**, which give A = 5.0 ÷ 5.25 = 0.952, matching the log. The time constant is 1 ÷ (0.25 + 5.0) = 0.190 h, **11.4 minutes**. The case packer runs for 270 of the 320 hours, not 306, because it cannot run while the bagger is stopped and the conveyor between them is empty; Chapter 4 explains how the two machines' stops interact.
