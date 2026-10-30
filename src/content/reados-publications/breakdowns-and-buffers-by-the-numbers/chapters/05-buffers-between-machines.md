---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: buffers-between-machines
order: 5
title: "Buffers between machines"
description: "How an accumulation buffer decouples two machines, why a speed margin is needed to use it, output against buffer size from a validated model, and why the mix of stop lengths sets a buffer's worth."
draft: false
---

Chapter 4 showed that two machines coupled directly lose each other's stops. A buffer between them, an accumulation conveyor, a table or a tank, breaks that coupling. While the downstream machine is stopped, the upstream one keeps working and fills the buffer; while the upstream one is stopped, the downstream one keeps working and empties it. Each stop that the buffer absorbs is a stop the other machine never feels. The question is how much buffer is worth having, and the answer depends on three things: the buffer's size, the speed margin of the downstream machine, and the lengths of the stops it must absorb.

This chapter explains how a buffer works on the packing line, builds a model that combines the machines' Markov stops with the buffer's level, checks it against the exact results at the two extremes, and charts output against buffer size. It links the buffer to Little's law with the WORKOS lead-time tool, and ends with a buffer extension whose expected gain was nearly halved when the case packer's real stop lengths were used.

## Filling and draining

The real line has a five-minute buffer: the accumulation conveyor holds 300 bags. The bagger makes 60 bags a minute; the case packer can pack 66. That 10% speed margin is what makes the buffer work.

When the case packer stops, the bagger keeps running and the conveyor fills at 60 bags a minute. After five minutes it is full, and from then on the bagger is blocked. When the case packer restarts, it packs at 66 a minute while the bagger supplies 60, so the conveyor drains by only 6 bags a minute: it takes 50 minutes of both machines running to empty a full buffer. When the bagger stops with bags on the conveyor, the case packer keeps packing at 66 a minute until the conveyor is empty, then starves.

```figure
type: steps
title: The five-minute buffer through one case packer jam and one bagger stop
caption: This is an illustration. Rates in bags a minute. The bagger's stop came 20 minutes after the jam, when the buffer still held 60 bags, so the case packer packed through the first minute of it.
- Normal running | buffer near empty; case packer runs at the bagger's 60 a minute
- Case packer jams for 3 min | buffer fills at 60 a minute to 180 bags; bagger keeps running
- Both running | buffer drains at 6 a minute; after 20 min it holds 60 bags
- * Bagger stops | case packer empties the 60 bags at 66 a minute in under a minute, then starves
- Bagger restarts | case packer resumes at 60 a minute; buffer stays near empty
```

The sequence shows two things. First, with a faster downstream machine the buffer is usually nearly empty. It fills only during case packer stops, and it drains slowly afterwards. Second, the buffer protects the bagger from the case packer's stops much better than it protects the case packer from the bagger's, because it is rarely full when the bagger stops. The speed margin sets how quickly the buffer recovers: with a 20% margin it would drain in half the time and be ready for the next upstream stop sooner.

## A model for the buffered line

The machines are still Markov: each stops and restarts at its own rates, with failures that happen only while it is working. The buffer adds a continuous variable, its level, which rises or falls at a rate that depends on which machines are running. The combined model has no simple formula for this line, although Buzacott and Shanthikumar and others give exact results for special cases, so it is solved here by simulation. A program follows the line through 3 million running hours, drawing each stop and repair time at random from the machines' rates, moving the buffer level at the right rate between events, blocking the bagger when the buffer is full and starving the case packer when it is empty. The share of the time the case packer is packing, multiplied by its rate, gives the output.

A simulation must be checked before it is trusted. The model has two exact limits. With no buffer it must reproduce Chapter 4's E = 1 ÷ (1 + 0.125 + 0.050) = 0.8511; the simulation gave 0.8512. With an unlimited buffer and a faster case packer, the line can never lose an hour to the case packer, and its efficiency must approach the bagger's own availability, 0.8889; at an 80-minute buffer the simulation gave 0.8888. Repeating the runs with different random number sequences changed the results by less than 0.0005.

```figure
type: compare
title: Line output against buffer size, with exponential stop lengths for both machines
cols: Line efficiency | Bags a shift | Bagger blocked, share of time | Average bags in buffer
rowhead: Buffer, minutes of bagger output
caption: This is an illustration. Simulated over 3 million hours, bagger 0.50 and 4.0 per hour, case packer 0.25 and 5.0 per hour, 60 and 66 bags a minute. The zero and 80-minute rows match the exact limits of 0.8511 and 0.8889.
- 0 | 0.8512 | 24,515 | 4.3% | 0
- 2 | 0.8571 | 24,684 | 3.6% | 8
- * 5, as built | 0.8638 | 24,878 | 2.8% | 28
- 10 | 0.8715 | 25,098 | 2.0% | 66
- 20 | 0.8802 | 25,350 | 1.0% | 137
- 40 | 0.8866 | 25,534 | 0.3% | 222
- 80 | 0.8888 | 25,598 | 0.0% | 271
```

```figure
type: line
title: Bags a shift against buffer size, exponential stop lengths
x: Buffer, minutes of bagger output
y: Bags a shift
ymin: 24400
ymax: 25700
caption: This is an illustration. Output rises quickly for the first few minutes of buffer and then flattens towards the bagger's own limit of 25,600 bags a shift. The as-built five-minute buffer recovers 363 of the 1,089 bags a shift the case packer would otherwise cost.
- 0 | 24515
- 2 | 24684
- 5 | 24878
- 10 | 25098
- 20 | 25350
- 40 | 25534
- 80 | 25598
```

The curve shows the law of diminishing returns that every buffer obeys. The first two minutes recover 169 bags a shift; going from 20 to 40 minutes recovers 184, for ten times the conveyor. Each doubling of the buffer buys less, because each extra minute of buffer is needed only by the longer, rarer stops.

## How long product sits in the buffer

Buffers cost more than conveyor length. Product that sits in them ages, which matters for food with a hold-time rule, and work in progress ties up floor space. Little's law, proved by John Little in 1961, says that in any stable system the average number of items inside equals the throughput times the average time each spends inside. It needs no assumptions about the distributions.

The [WIP and lead time check](/tools/wip-lead-time-check/) applies it. From the work in progress and the throughput per day, it calculates the average lead time in days and working hours, the flow efficiency as value-added time over lead time, and the work-in-progress limit that would give a target lead time at the same throughput. For the five-minute buffer, entering an average of 28 bags in the buffer, a throughput of 49,756 bags a day over two shifts and 16 working hours a day, gives a lead time of 0.00056 days, about 0.54 minutes: on average a bag spends half a minute on the conveyor. Even the 40-minute buffer, averaging 222 bags, would hold a bag for about four minutes on average. The averages hide the bags caught on a full conveyor during a long case packer stop, which can wait much longer; for those, the hold-time rule applies to the worst case, not the average.

## The lengths of the case packer's stops

The simulation above treats each machine's stop lengths as exponential, as Chapter 1 did. Chapter 3 showed that the bagger's stops are really a mixture of short jams and long breakdowns. Because the buffer is usually nearly empty, the bagger's stop lengths turn out to matter little; repeating the simulation with the bagger's three-state stops gave almost the same output at every buffer size. The case packer's stops matter far more, because they are the ones the buffer absorbs.

This is an illustration. The case packer's log, split as Chapter 3 split the bagger's, showed that 80% of its stops were carton jams averaging 3 minutes and 20% were breakdowns averaging 48 minutes; the overall mean is still 12 minutes and the rate still 0.25 per running hour. Running the simulation with that mixture gave lower output at every buffer size above zero.

```figure
type: compare
title: Line efficiency by buffer size for two descriptions of the case packer's stops
cols: Exponential, mean 12 min | Mixture: 80% at 3 min, 20% at 48 min | Difference, bags a shift
rowhead: Buffer, minutes
caption: This is an illustration. Same rates and means; only the spread of the case packer's stop lengths differs. With the mixture, a five-minute buffer absorbs the jams completely, but only the first five minutes of each breakdown.
- 0 | 0.8512 | 0.8512 | 0
- 2 | 0.8571 | 0.8564 | −20
- * 5 | 0.8638 | 0.8602 | −103
- 10 | 0.8715 | 0.8643 | −207
- 20 | 0.8802 | 0.8689 | −326
- 40 | 0.8866 | 0.8757 | −314
```

The reason is the tail. Exponential stops with a 12-minute mean include many stops of 5 to 20 minutes, which a 10- or 20-minute buffer absorbs completely. The real case packer has few stops in that range: its jams are short enough for a two-minute buffer and its breakdowns too long for a twenty-minute one. Most of what a medium buffer could absorb, the real machine does not produce. The same mean with a different spread gives a different buffer value.

## Buffers that are smaller than they look

A conveyor's nominal capacity is rarely all usable. Accumulation conveyors often need a minimum number of bags on them to feed the next machine smoothly, so the bottom of the buffer is never available to absorb a bagger stop. Bags can be damaged by back pressure if a full conveyor keeps pushing, so the upstream machine is often slowed or stopped before the conveyor is truly full. And level sensors that slow the bagger as the conveyor fills change its effective speed, which the model must include if it is used. This is an illustration. Checks of the packing line's conveyor found that only about 260 of its 300 bags of nominal capacity were usable, which the model should use rather than the brochure figure. On the real stop mix the difference is small, about 20 bags a shift in the simulation, but on lines with medium-length stops it can be the difference between a buffer that works and one that does not.

## The speed margin, tested

The filling-and-draining sequence suggests that a larger speed margin should help, by emptying the buffer sooner after each case packer stop. The model can test that. This is an illustration. With the case packer's real mixture of stops and the five-minute buffer, raising its speed from 63 to 66 to 72 bags a minute, margins of 5%, 10% and 20%, gave line efficiencies of 0.8599, 0.8602 and 0.8603: a difference of about 13 bags a shift across the whole range. The average buffer level fell from 31 to 22 to 17 bags.

The result is less surprising once the stop mix is in view. After a three-minute jam the buffer holds 180 bags, which even a 5% margin clears in an hour, long before the next jam is likely. After a 48-minute breakdown, the buffer was full and the bagger blocked for most of the stop; the margin then decides how quickly the buffer empties, but the bags lost during the blocked period are lost whatever the margin. On this line the margin is enough at 10%, and a faster case packer would not repay its cost. On a line whose downstream stops were mostly of medium length, the answer could be different, which is why the model, not intuition, should settle it.

## Building and checking a simulation

The simulation behind this chapter is short: a loop that finds the next event (a machine stopping, a machine restarting, the buffer becoming full or empty), advances the clock and the buffer level to it, and updates the states. A few habits make such a model trustworthy.

- **Check the limits.** Every model should reproduce a case with a known answer. Here, no buffer and an unlimited buffer gave the exact results of Chapter 4 and Chapter 1.
- **Run long and repeat.** Three million hours of simulated running, and repeats with different random sequences, showed that the results were stable to a few parts in ten thousand, finer than the differences being compared.
- **Use the same random sequence for comparisons.** Comparing two buffer sizes with the same sequence of stops removes most of the random noise from the difference, so small effects can be seen.
- **Keep the inputs traceable.** Every rate and duration in the model came from the log, with the definitions of Chapter 1 stated, so the model can be updated as the line changes.

A spreadsheet can run a short version of the same model, but a few dozen lines of code in any language do it faster and more transparently, and the code itself documents the assumptions. The chapter on [queues in the test lab](/reados/publications/prototypes-and-simulation-by-the-numbers/queues-in-the-test-lab/) in Prototypes and Simulation by the Numbers uses the same event-by-event approach for a different problem.

## The error: a buffer extension sized on the average stop

This is an illustration. A proposal to double the accumulation conveyor from five to ten minutes was costed against the exponential model, which predicted an extra 222 bags a shift, 111,000 bags a year over 500 shifts. At the illustrative contribution of A$0.10 a bag, that is A$11,100 a year, for a conveyor extension quoted at A$45,000 excluding GST: a payback of about four years.

The reviewing engineer asked for the case packer's stop lengths, not just their mean. The split showed the mixture above, and the simulation with the mixture predicted 0.8643 − 0.8602 = 0.0041, an extra 118 bags a shift, A$5,900 a year and a payback of nearly eight years. The proposal was set aside in favour of the measure the mixture pointed to: shortening the case packer's breakdowns, which Chapter 10 prices. The lesson is general. A buffer study needs the distribution of the stops it is meant to absorb, and a mean alone overstates the value of a medium buffer whenever stops are a mix of very short and very long.

## Exercise: a twenty-minute buffer, two ways

Using the tables above, find the extra bags a shift and a year from extending the buffer from five to twenty minutes, first with the exponential model and then with the case packer's real mixture of stop lengths. At A$0.10 a bag and 500 shifts a year, what is each worth?

**Worked answer.** This is an illustration. With exponential stops the efficiency rises from 0.8638 to 0.8802, an extra 0.0164 × 28,800 = **472 bags a shift**, 236,000 a year, worth **A$23,600 a year**. With the real mixture it rises from 0.8602 to 0.8689, an extra 0.0087 × 28,800 = **251 bags a shift**, 125,500 a year, worth **A$12,550 a year**. The real gain is a little over half the exponential prediction. A twenty-minute buffer also needs four times the conveyor of a five-minute one, so on the real data it is unlikely to be the best use of the money; Chapter 10 compares it with the alternatives.
