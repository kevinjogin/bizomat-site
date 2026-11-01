---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: sizing-the-maintenance-crew
order: 7
title: "Sizing the maintenance crew"
description: "Breakdown calls from many machines as a queue: the M/M/c model and Erlang C, utilisation and waiting, Little's law, when an infinite-source queue overstates waits, and crew size."
draft: false
---

Chapter 6 modelled one fitter and four machines exactly, state by state. A site's maintenance crew serves many more: the ovens, fryers, seasoning drums, conveyors, palletisers and compressors as well as the packing lines. With dozens of machines, a breakdown on one barely changes the chance of a breakdown on another, and the calls on the crew begin to look like a steady random stream. That is the setting for the most widely used model in queueing theory, the multi-server queue with random arrivals and random service times, and for its central result, the Erlang C formula.

This chapter applies that model to the site's crew with the WORKOS queue tool, explains what the Erlang C formula calculates and why waiting rises so steeply as utilisation rises, and compares the queue model with the exact finite-source model of Chapter 6 for the same site. It ends with a request for a sixth fitter that rested on the wrong call rate.

## The crew and its calls

This is an illustration. On day shift the site's maintenance crew answers breakdown calls from 40 machines across the plant, other than the packing hall's baggers, which have their own fitter. Each machine generates breakdown calls at about 0.10 per running hour. A job, from the call to the machine's restart, takes the crew 60 minutes on average, including travel and isolation. The crew is five fitters. The plant wants breakdown calls to wait no more than 15 minutes on average before a fitter starts.

If all 40 machines were running, calls would arrive at 40 × 0.10 = 4.0 an hour. At 60 minutes a job, that is 4.0 hours of work an hour: an offered load of 4.0 fitters. Five fitters would each be busy 80% of the time.

## The M/M/c queue and Erlang C

The M/M/c model treats calls as a Poisson stream at a constant rate λ, job times as exponential with mean 1 ÷ μ, and c servers taking jobs in order. It is a birth–death chain like Chapter 6's, with the difference that the arrival rate does not fall as more machines are down: the source is treated as infinite. Its long-run probabilities give the chance that an arriving call must wait, the Erlang C probability, named after the Danish engineer who derived it for telephone exchanges, and from that the average wait.

```figure
type: formula
title: Waiting in an M/M/c queue
formula: Offered load a = λ ÷ μ; utilisation ρ = a ÷ c
formula: P(wait) = [aᶜ ÷ c! × 1 ÷ (1 − ρ)] ÷ [Σ aᵏ ÷ k! for k = 0 to c − 1 + aᶜ ÷ c! × 1 ÷ (1 − ρ)]
formula: Average wait W_q = P(wait) ÷ (cμ − λ); average queue L_q = λ W_q
caption: This is an illustration: the site's crew with all 40 machines assumed running. The last line is Little's law, which holds for any stable queue.
- Calls | λ = 4.0 an hour; jobs average 60 min, so μ = 1.0 an hour and a = 4.0
- Five fitters | ρ = 0.80; P(wait) = 55.4%
step: W_q = 0.554 ÷ (5 × 1.0 − 4.0) = 0.554 h = 33.3 min
step: L_q = 4.0 × 0.554 = 2.2 calls waiting on average
```

The [queue wait check](/tools/queue-wait-check/) carries out this calculation. From the arrival rate, the average service time per job and the number of servers, it calculates the utilisation, the chance that an arriving job must wait by Erlang C, the average wait in the queue, the average time in the system and the average number waiting by Little's law, and the fewest servers that keep the average wait within a target the user sets. It flags utilisation above 85%, where waits become very sensitive to demand, and reminds the user that scheduled or batched arrivals change the answer. It reports an overloaded system, utilisation of 100% or more, as one whose queue grows without limit.

```figure
type: compare
title: The site's crew from the queue wait check, calls at 4.0 an hour and 60-minute jobs
cols: Utilisation | Chance a call waits | Average wait, min | Average calls waiting
rowhead: Fitters
caption: This is an illustration. With four fitters the crew is exactly loaded and the queue grows without limit. The tool's fewest fitters for a 15-minute average wait is six.
- 4 | 100% | overloaded | grows without limit
- * 5 | 80% | 55.4% | 33.3 | 2.22
- 6 | 67% | 28.5% | 8.5 | 0.57
- 7 | 57% | 13.5% | 2.7 | 0.18
```

## Why waiting rises so steeply

The table shows the shape that surprises people. Going from seven fitters to six, utilisation rises from 57% to 67% and the average wait triples. Going from six to five, utilisation rises to 80% and the wait quadruples. At four, the crew is exactly as busy as the work requires, and the wait is unbounded: any random run of calls creates a backlog that the crew can never work off.

The reason is the 1 ÷ (1 − ρ) term. Random arrivals and random job lengths mean there are always periods when calls bunch up and periods when the crew is idle. The idle time cannot be saved for later; it is lost. The busier the crew, the less idle time there is to absorb the bunches, and the longer the backlog after each one. That is the same lesson as Chapter 6's utilisation target, generalised: for any resource serving random demand, average waiting rises without limit as utilisation approaches 100%, and it starts rising steeply long before.

A useful way to read the result is as the price of spare capacity. A crew sized for the average workload has no margin and an unbounded queue. Each fitter added beyond the offered load buys a large cut in waiting at first and smaller cuts afterwards, the same diminishing returns as Chapter 5's buffer. Where to stop is a business decision: the cost of a fitter against the cost of machines waiting, which Chapter 10 converts into money. The model's job is to give the waiting for each crew size honestly, so that the decision is made on numbers rather than on how busy the crew looks.

## The finite source

The M/M/c model assumes the call rate stays at 4.0 an hour however many machines are already down. In fact, a machine that is down or waiting for a fitter cannot generate another call, so the call rate falls when the crew is busy, just when calls would hurt most. That is a self-correcting effect the infinite-source model leaves out, and for a crew serving 40 machines it is not negligible.

The exact model is Chapter 6's machine repair model with 40 machines and c fitters. Its probabilities follow from the same detailed balance: pₙ = pₙ₋₁ × (40 − n + 1) λ ÷ (min(n, c) μ). Solving it gives the actual call rate, which with five fitters is 3.58 an hour, and the actual average wait.

```figure
type: compare
title: Average wait for the site's crew by three methods
cols: Five fitters, min | Six fitters, min | Seven fitters, min
rowhead: Method
caption: This is an illustration. The queue wait check with the nominal call rate of 4.0 an hour, with the measured call rate of 3.6 an hour, and the exact finite-source model for 40 machines. Only the exact model meets the 15-minute target with five fitters.
- Queue wait check, 4.0 calls an hour | 33.3 | 8.5 | 2.7
- Queue wait check, 3.6 calls an hour, as measured | 17.6 | 4.9 | 1.5
- * Exact finite-source model, 40 machines | 11.2 | 3.4 | 1.0
```

Two corrections close most of the gap. Using the measured call rate, which already reflects the machines that were down, takes the queue model from 33.3 to 17.6 minutes. The rest is the finite-source feedback, which the exact model captures. For 40 machines and five fitters, the queue model with the measured rate overstates the wait by about half; for 400 machines it would be nearly exact; for four machines, as in Chapter 6, it would be badly wrong. The queue tool is the quick, conservative screen; the finite-source model is the answer when the number of machines is modest and the decision is close.

## What the crew does when it is not repairing

At five fitters and about 72% busy on breakdowns, the crew has about 1.4 fitter-hours an hour free. That time is not waste. It is the reserve that keeps breakdown waits short, and it is where planned work goes: preventive maintenance, inspections, improvement jobs. The trick is to make planned work interruptible, so that a fitter on a planned job can drop it for a breakdown. If planned work is scheduled as if it could not be interrupted, the crew effectively has fewer servers for breakdowns and the waits of the table above apply to the smaller number.

Priorities change the picture too. If the crew answers bottleneck machines first, their waits fall and others' rise; the average across all calls stays about the same. A priority queue model, or a simulation, can show the effect; the simple model shows the average the crew must achieve.

## Bursts at the start of a shift

The M/M/c model assumes calls arrive at a steady average rate. Many sites do not see that. Machines restarted at the beginning of a shift, after a weekend or after a cleaning period fail more often in the first hour, as Chapter 2's check of time into the shift would show, and calls bunch up just when the crew is starting its day. The queue tool's own caution says it: scheduled or batched arrivals change the waits.

The simplest correction is to model the day in periods. This is an illustration. If the first hour of the shift brings calls at 6.0 an hour and the rest of the shift at 3.3 an hour, averaging about 3.6, five fitters face a utilisation of 120% in the first hour: the queue grows for that hour whatever the steady-state formula says, and the backlog then takes much of the next hour to clear. The steady-state result for the average rate understates the waits in the morning. Two practical responses follow: start one fitter half an hour before the production shift to walk the lines and catch faults before restart, and stagger the restart of machines so that their early-life failures do not all arrive at once. Both reduce the burst rather than adding fitters to meet it.

## Response targets in contracts

When maintenance is contracted out, the contract usually states a response time, and the same arithmetic decides whether it is achievable and what it will cost. A contractor asked to guarantee that 95% of calls are answered within 15 minutes, rather than an average of 15 minutes, needs more people, because the tail of the waiting time distribution is much longer than its average. In an M/M/c queue the waiting time of the calls that wait is exponential with mean 1 ÷ (cμ − λ), so with five fitters, 60-minute jobs and 3.6 calls an hour, a call that has to wait does so for an average of 1 ÷ 1.4 hours, about 43 minutes. A percentile target should be checked against that tail, and a contract should state which kind of target it means.

## Little's law in maintenance records

Little's law, L = λ × W, links the three numbers a maintenance system already holds: the average backlog of open breakdown calls, the rate at which calls arrive and the average time a call stays open. Any two give the third, with no assumption about distributions. This is an illustration. If the maintenance system shows an average of 0.67 breakdown calls waiting and calls arriving at 3.58 an hour, the average wait must be 0.67 ÷ 3.58 = 0.19 hours, 11.2 minutes, whatever the system's own response-time report says. A disagreement between the two means the records are incomplete, often because calls are closed late or opened only when a fitter arrives.

## The error: a sixth fitter on the nominal call rate

This is an illustration. The maintenance manager's case for a sixth fitter used the queue wait check with 40 machines × 0.10 = 4.0 calls an hour and five fitters, giving an average wait of 33.3 minutes against the 15-minute target, and the tool's recommendation of six fitters.

The engineer asked how many calls had actually arrived. The maintenance system showed 3.6 an hour over the last quarter, because at any time some machines were down, waiting or stopped for other reasons. With 3.6 an hour the tool gave 17.6 minutes, still over the target, and still recommended six. The engineer then solved the exact finite-source model, which gave 11.2 minutes with five fitters, and checked it against Little's law and the maintenance records, which gave about 11 minutes. Five fitters met the target.

The sixth fitter, at about A$115,000 a year, was not approved. Instead, the crew's planned work was made interruptible and the response target was added to the monthly maintenance report, measured from the records with Little's law, so that a real rise in waits would be seen. The lesson is that a quick model's conservatism is a virtue for screening and a cost for decisions: when a screen gives a close or expensive answer, use the exact model and the records before acting.

## Exercise: shorter jobs

The crew introduces job kits and standard fault-finding guides for the commonest breakdowns, cutting the average job from 60 to 50 minutes. Using the queue wait check with the measured 3.6 calls an hour, find the utilisation, chance of waiting and average wait with five fitters and with four. Would four fitters meet the 15-minute target?

**Worked answer.** This is an illustration. With 50-minute jobs, μ = 1.2 an hour and the offered load is 3.6 ÷ 1.2 = 3.0. With five fitters, utilisation is **60%**, the Erlang C probability of waiting **23.6%**, and the average wait 0.236 ÷ (5 × 1.2 − 3.6) = 0.098 hours, **5.9 minutes**. With four fitters, utilisation is **75%**, the chance of waiting **50.9%**, and the average wait 0.509 ÷ (4 × 1.2 − 3.6) = 0.425 hours, **25.5 minutes**, so the screen says four fitters would not meet the target. The exact finite-source model gives 4.6 minutes with five fitters and 17.0 minutes with four, so even the exact model says four fitters would miss the target, though by much less than the screen suggests. Shorter jobs bought the crew's waiting down by two-thirds, which is the same lesson as Chapter 6: cutting work content cuts both the work and the queue.
