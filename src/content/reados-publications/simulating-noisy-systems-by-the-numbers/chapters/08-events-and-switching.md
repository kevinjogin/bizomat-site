---
book: simulating-noisy-systems-by-the-numbers
chapterSlug: events-and-switching
order: 8
title: "Events and switching"
description: "Adding random events and on-off rules to a time-stepped model: Poisson arrivals and their clusters, placing events within steps, a level interlock, and how a released queue can make extremes worse."
draft: false
---

So far the noise in BT-1's model has been continuous: a process flow that wanders smoothly about its mean. Real systems also have events: a washdown starts, a pump trips, a valve opens, a batch is dumped. Events arrive at discrete moments, often at random, and their effect is usually far larger than the continuous noise. They are also where control rules act: a level switch that holds a pump, an interlock that stops a feed. A model with events and switching rules is no longer a pure stochastic differential equation, but it is simulated with the same time-stepping machinery, and it raises its own pitfalls.

This chapter adds BT-1's washdowns as a Poisson process, checks them against the plant's records, examines how often they cluster, and simulates a rule that holds washdowns while the tank is high. Its error is a version of that rule that released all the held washdowns at once and left the overflow risk almost unchanged.

## Washdowns as a Poisson process

Chapter 1 described the washdowns: about four in a 16-hour production day, each adding 3.0 L/s for 8 minutes, at times that look random. The simplest model of events at random times is the **Poisson process**: events occur independently, at a constant average rate, so that the chance of one in any short interval is proportional to its length and unaffected by what happened before. Its two signatures are that the number of events in a fixed period follows the Poisson distribution, with variance equal to its mean, and that the gaps between events follow the exponential distribution.

The model draws each day's washdown start times by accumulating exponential gaps with a mean of 4 hours, the reciprocal of 0.25 an hour, using the transformation in Chapter 2, until the day's 16 hours are used. The plant's records support the model: 163 washdowns in 40 days, a mean of 4.1 a day with a variance of 3.9, and gaps whose histogram followed the exponential shape, with no sign of a minimum spacing or a fixed timetable.

```figure
type: compare
title: Washdowns per production day under the Poisson model
rowhead: Washdowns in a day
cols: Probability | In 240 production days
caption: Poisson distribution with a mean of 4. A day with no washdowns and a day with eight or more are both ordinary events in a year, and the busy days are where most of the exceedances occur.
- 0 | 1.8% | 4 days
- 1 or fewer | 9.2% | 22 days
- 4 | 19.5% | 47 days
- * 8 or more | 5.1% | 12 days
```

### Clusters are normal

A Poisson process does not space its events evenly; it clumps them. With a mean gap of 4 hours, the chance that the next washdown starts within 30 minutes of the last is 1 − e^(−0.5 ÷ 4) = 11.8%, and in a day with four washdowns the chance that at least one pair falls within 30 minutes of each other is roughly one in three. Two washdowns in quick succession raise the level by about 0.8 m, and a third within half an hour, or two coinciding with a high process flow, takes it above the 1.85 m limit. This is the mechanism behind most of the 5.3% of days with an exceedance. Intuition, which expects random events to be spread out, consistently underestimates how often they bunch, which is one more reason the average-input spreadsheet of Chapter 1 went wrong.

## Placing events within steps

The model steps every 10 s, but a washdown can start at any moment. There are two ways to handle that. The simple one, used here, rounds each start and end to the nearest step: the washdown runs from the first step at or after its start time for 48 steps. The rounding moves each washdown by at most 10 s, much less than its 8-minute duration, and it does not change its volume. The more exact way splits the step at the event time and integrates the two parts separately, which matters when events are short compared with the step or when the timing of individual events must be exact, as in a simulation of a control sequence. Either way, a check is cheap: total the simulated washdown volume over many days and compare it with the rate times the volume per washdown, 4 × 1.44 = 5.76 m³ a day.

### Time-stepped or event-driven

When a model consists only of events, such as machines breaking down and being repaired, or parts arriving at a test station, it can be simulated without time steps at all, by jumping from one event to the next. That is discrete-event simulation, described in the chapter on simulating a test line in [Prototypes and Simulation by the Numbers](/reados/publications/prototypes-and-simulation-by-the-numbers/discrete-event-simulation-of-the-test-line/). BT-1 needs time steps because its level changes continuously between events; its events are simply superimposed on the continuous model. Hybrid models of this kind are common in plant engineering: tanks, buffers, thermal masses and batteries all change continuously while being switched by discrete events.

## A switching rule: holding washdowns

The engineer's first proposal for reducing exceedances, before considering a larger tank, was a rule in the washdown control system: a washdown may not start while BT-1's level is above **1.4 m**. A washdown requested while the level is high waits until it falls below 1.4 m, then starts. Since the washdowns are the main cause of high levels, holding them while the tank is already high should prevent most of the stacking.

The rule is a switch on a noisy signal, and it brings the questions of any threshold. The level carries the process flow's fluctuations, so near 1.4 m it crosses back and forth, and a released washdown can be held again if the level rises above 1.4 m within a few seconds. In the simulation the rule acts only at the moment of release, so it cannot chatter, but a real implementation needs a deadband or a delay so that a permit is not granted and withdrawn within a few seconds.

## The error: a queue released all at once

The first simulation of the rule, over 100,000 days, gave a mixed result. Exceedance days halved, from 5.34% to **2.52%**, which looked like success. But overflow days fell only from 24 to **15**, and the tail of the daily maximum showed something odd: without the rule, 61 days exceeded 2.4 m and 24 exceeded 2.5 m; with the rule, 16 exceeded 2.4 m and **15** exceeded 2.5 m. Almost every day that reached 2.4 m went on to overflow, which no smooth process would produce.

The engineer replayed several of the overflow days, using their seeds, and printed the washdown starts. In each, two or three washdowns had been requested while the level was above 1.4 m, had waited, and had then **all started together** at the moment the level fell below 1.4 m. The rule had taken washdowns that would naturally have been spread over an hour and released them as a single slug of 6 or 9 L/s, onto a tank that was still near 1.4 m. On ordinary days the rule helped; on the worst days it manufactured the very coincidence it was meant to prevent.

```figure
type: timeline
title: A replayed overflow day under the unspaced rule
caption: This is an illustration. Simulated day number 13, production starting at 06:00. Three washdowns requested between 11:46 and 12:11 were held while the level was above 1.4 m, then started together at 12:12, adding 9 L/s to a tank already at 1.40 m.
- 11:25 | Washdown starts at 1.32 m | Below the 1.4 m hold level, so it runs at once.
- 11:37 | Request held at 1.50 m | Starts at 11:42 when the level dips to 1.40 m.
- 11:46 to 12:11 | Three more requests held | The level is between 1.41 and 1.68 m throughout.
- * 12:12 | All three start together at 1.40 m | 9 L/s of washdown on top of the process flow.
- 12:20 | Level peaks at 2.69 m | The tank overflows for several minutes.
```

The fix was to release held washdowns one at a time, and more generally to space all washdowns: **no washdown may start while the level is above 1.4 m, nor within 15 minutes of the previous washdown's start**. The spaced rule turns the random clusters into a queue that drains at a controlled rate.

```figure
type: compare
title: Washdown rules compared over 100,000 simulated days
rowhead: Rule
cols: Days with an exceedance | Days above 2.4 m | Overflow days | Washdowns held
caption: This is an illustration. Same random inputs for each rule. The unspaced rule halves the exceedances but barely touches the overflows, because it releases held washdowns together; spacing them removes both.
- No rule | 5.34% | 61 | 24 | none
- Hold above 1.4 m, release all at once | 2.52% | 16 | 15 | 2.0%, mean 13.6 min
- * Hold above 1.4 m, and 15 min apart | 0.68% | 0 | 0 | 6.9%, mean 11.6 min
```

The spaced rule cut exceedance days from 5.34% to 0.68% and produced no day above 2.0 m in 100,000. Its cost is waiting: 6.9% of washdowns are held, for 11.6 minutes on average, with one in ten of those held waiting over 22 minutes and the longest about an hour and three-quarters, on days with an unusual run of requests. Whether that delay is acceptable is a production question, not a hydraulic one, and the simulation gives production the numbers to decide it.

### What the error teaches

A switching rule changes the statistics of the events it controls, and not always in the intended direction. Holding events and then releasing them can create bunching where none existed. The same pattern appears wherever a queue is released in a batch: machines restarted together after a power dip draw a large inrush, held orders released together overload a workstation. The defence is to look at the extremes of a simulated rule, not just its averages, and to replay the worst simulated days to see what actually happened in them. A rule judged only by its average effect would have been accepted here with its flaw intact.

## Checking the events in the simulation

The event generator deserves the same checks as the random numbers of Chapter 2. Over 20,000 simulated days, the model generated 80,473 washdowns, a mean of 4.02 a day with a variance of 3.98, as a Poisson process with a mean of 4 should. The gaps between washdowns, collected across days, followed the exponential distribution, with a median of 2.8 hours. Under the spaced rule, the engineer also checked that no two washdown starts in any simulated day were less than 15 minutes apart, and that no washdown started with the level above 1.4 m: a rule in a model can be coded wrongly just as easily as a rule in a PLC, and a few lines that assert it was obeyed are cheap insurance.

The replay technique used to find the error depends on the housekeeping of Chapter 2. Because every simulated day has its own seed and its own streams, any day can be regenerated alone and printed in full detail, event by event, without rerunning the other 99,999. A simulation without that ability can report that something odd happens on the worst days, but cannot show what.

## Other switching: pumps with start and stop levels

Many tanks are emptied by a pump that starts at a high level and stops at a low one, rather than by an orifice. The same model handles it: the outflow is the pump's flow while it runs and zero while it does not, and the pump's state switches when the level crosses the start or stop level. The questions then include how often the pump starts, because motor suppliers limit the number of starts an hour to protect the windings and starters, and how close the level comes to overflow when the inflow exceeds what the pump can remove. The width of the band between the start and stop levels trades starts against storage: a narrow band starts the pump often, a wide one uses up storage that might be needed for a surge. Noise on the level signal near the switching levels adds starts that the average inflow would not predict, the same chatter that alarms suffer, and the model shows how much hysteresis or delay the level switch needs to keep the starts within the supplier's limit.

## How this applies to a small Australian business

If events in your system look random, check the records for the Poisson signatures: counts per period with variance close to the mean, and exponential gaps. If they fit, expect clusters, and simulate them rather than assuming even spacing. When you simulate a control rule, report its effect on the worst days as well as the typical ones, and replay a few of the worst simulated days to see the mechanism. Rules that hold and release events should release them at a controlled rate, and the model should check that every rule it contains was actually obeyed.

## Exercise: busier production

Production plans to add a fifth filling line, raising washdowns from four to six a day on average, each still 3.0 L/s for 8 minutes. (a) What is the new rate per hour, and the mean gap? (b) What is the chance that the next washdown starts within 30 minutes of the last? (c) Under the spaced rule, with washdowns at least 15 minutes apart, what is the largest number of washdowns that could start in any hour, and why does that bound matter for the tank?

**Worked answer.** (a) Six in 16 hours is **0.375 an hour**, a mean gap of 1 ÷ 0.375 = **2.67 hours**. (b) 1 − e^(−0.375 × 0.5) = 1 − e^(−0.1875) = **17.1%**, up from 11.8%. (c) With starts at least 15 minutes apart, at most **four** washdowns can start in any hour, and since each lasts 8 minutes while the next cannot start until 15 minutes after it, **no two washdowns ever run at once**: the washdown inflow never exceeds 3.0 L/s. The bound caps the worst-case washdown inflow, which is what makes the overflow risk negligible under the rule. With more washdowns, the queue would grow and the holding delays would lengthen, which a new simulation would quantify.
