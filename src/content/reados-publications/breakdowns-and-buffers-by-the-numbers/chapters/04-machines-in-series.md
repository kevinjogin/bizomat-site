---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: machines-in-series-without-a-buffer
order: 4
title: "Machines in series without a buffer"
description: "Two machines coupled directly: the Markov chain of a series line, operation-dependent and time-dependent failures, why downtime ratios add, and what long rigid lines lose."
draft: false
---

A packing line is a chain. The bagger fills bags, the case packer packs them, and if either stops, bags stop leaving the line. With nothing between the machines to absorb a stop, the line's output is set by both machines' stops together, and it is always lower than either machine's availability alone. How much lower depends on a detail that is easy to overlook: whether a machine can fail while it is standing idle because the other one has stopped.

This chapter builds the Markov chain of a two-machine line with no buffer, solves it for both kinds of failure behaviour, shows the general rule that the downtime ratios of machines in series add, and follows the rule out to long lines of many machines. It ends with a customer commitment made on the bagger's availability alone, which promised 4% more bags than the line could make.

## The line as a Markov chain

This is an illustration. Imagine the accumulation conveyor between the bagger and the case packer removed, so that the case packer takes each bag as it is made. The bagger stops at 0.50 per running hour and restarts at 4.0 per stopped hour; the case packer stops at 0.25 per running hour and restarts at 5.0 per stopped hour, as Chapter 1's exercise found. The case packer is rated at 66 bags a minute, but with no buffer it can pack only what the bagger makes, 60 a minute.

When one machine stops, the other is forced to wait: the case packer has no bags, or the bagger has nowhere to send them. Most of the bagger's stops are jams caused by film and product, and most of the case packer's are carton jams; none of those can happen while the machine is idle. Failures that happen only while a machine is working are called operation-dependent. With operation-dependent failures, the line has three states, not four: both running; bagger stopped and case packer idle; case packer stopped and bagger idle. Both cannot be stopped at once, because the idle machine cannot fail.

```figure
type: formula
title: Steady state of a two-machine line with no buffer, operation-dependent failures
formula: P_A stopped = P_both × λA ÷ μA and P_B stopped = P_both × λB ÷ μB
formula: Line efficiency E = P_both = 1 ÷ (1 + λA ÷ μA + λB ÷ μB)
caption: This is an illustration. The chain is a star centred on "both running", so it is solved by the ratios of Chapter 3. E is the share of time the line makes bags.
- Bagger | λA ÷ μA = 0.50 ÷ 4.0 = 0.125
- Case packer | λB ÷ μB = 0.25 ÷ 5.0 = 0.050
step: E = 1 ÷ (1 + 0.125 + 0.050) = 0.8511
step: Bags a shift = 60 × 480 × 0.8511 = 24,511
step: Line stopped by the bagger 10.6% of the time, by the case packer 4.3%
```

The line runs 85.1% of the time. Each machine's own availability, measured over its own running time, is unchanged: the bagger still stops once every two running hours and restarts in fifteen minutes. But the bagger now spends 4.3% of the time idle, waiting for the case packer, and the case packer spends 10.6% idle, waiting for the bagger. That idle time is the cost of coupling.

## Failures while idle

Some failures do happen while a machine stands idle: an electronic fault, a leak, a motor that trips on its own. Failures that run on clock time whether the machine works or not are called time-dependent. If both machines failed that way, each would be up independently of the other, and the line would run only when both happened to be up: E = A_A × A_B = 0.8889 × 0.9524 = 0.8466.

```figure
type: compare
title: Line efficiency of the bagger and case packer with no buffer
cols: Line efficiency | Bags a shift | Difference from the bagger alone
rowhead: Assumption
caption: This is an illustration. The bagger's availability alone, 88.9%, is not the line's. The operation-dependent model fits the bagger's jams and the case packer's carton jams best.
- Bagger alone, 60 a minute | 0.8889 | 25,600 | none
- * Operation-dependent failures, no buffer | 0.8511 | 24,511 | −1,089
- Time-dependent failures, no buffer | 0.8466 | 24,381 | −1,219
```

With time-dependent failures the chain has a fourth state, both machines stopped, which the operation-dependent chain cannot reach. Its probability is the product of the two machines' unavailabilities, 0.1111 × 0.0476 = 0.0053: about half a per cent of the time, both are being repaired at once. That state matters for maintenance even when it hardly matters for output, because it is when two jobs compete for one fitter, the subject of Chapter 6.

The two assumptions differ by only half a point here, because both machines are fairly reliable and the time each spends idle is short. Operation-dependent is the better description for jams and most mechanical failures, which need the machine to be moving. For a real line, the two can be mixed: each kind of stop is assigned to the behaviour that fits it, and the chain gains a state or two. The buffer study of Chapter 5 uses operation-dependent failures for both machines.

## Testing which behaviour applies

The log can say which kind of failure dominates. If failures are operation-dependent, no stop should start while the machine is idle, and the stop rate per running hour should be the same whether the line was busy or often starved. If failures are time-dependent, some stops will be found to have started during idle periods, often discovered only when the machine is asked to restart and will not. This is an illustration. Of the case packer's 68 stops in the month, the status signal showed 65 starting while it was running and 3 found on attempting to restart after an idle period, all three electrical faults on the carton magazine's sensor. The case packer's stops are overwhelmingly operation-dependent; the sensor fault was a time-dependent cause that a maintenance check, not a model, resolved.

The distinction also shapes how stop rates are estimated. For an operation-dependent machine the rate must be counted per running hour, as Chapter 1 did. Dividing the case packer's 68 stops by the scheduled 320 hours instead of its 270 running hours would understate its rate by about a sixth.

## Downtime ratios add

The formula for E generalises at once. For any number of machines in series with no buffers and operation-dependent failures, the line efficiency is 1 ÷ (1 + Σ λᵢ ÷ μᵢ). Each machine contributes its downtime per hour of running, λ ÷ μ, and the contributions add. That gives a quick way to see what each machine costs the line, and what an improvement to any one of them is worth.

This is an illustration. The plant is considering a metal detector between the case packer and the palletiser. It would stop at 0.05 per running hour, usually to clear a false reject, and take 5 minutes to restart, so its downtime ratio is 0.05 ÷ 12 = 0.0042. Added to the line, E = 1 ÷ (1 + 0.125 + 0.050 + 0.0042) = 0.8481, about 24,420 bags a shift, a loss of about 90 bags a shift. Its ratio is a thirtieth of the bagger's, so it barely matters to output; its value or cost lies elsewhere, in product safety.

## Which machine to improve first

Because the ratios add, cutting any machine's downtime ratio by the same amount gives the line the same gain. A reduction of 0.01 in the bagger's ratio and a reduction of 0.01 in the case packer's are worth exactly the same number of bags. What differs is how much room each machine has, and what each reduction costs.

This is an illustration. Halving the case packer's ratio, from 0.050 to 0.025, by halving its stops or its repair times, gives E = 1 ÷ 1.150 = 0.8696, an extra 532 bags a shift. Halving the bagger's, from 0.125 to 0.0625, gives E = 1 ÷ 1.1125 = 0.8989, an extra 1,377 bags a shift. The bagger offers two and a half times the gain for the same proportional improvement, simply because it loses more time to begin with. Unless the case packer's improvement is much cheaper, the bagger comes first.

Two qualifications follow from later chapters. A buffer changes the arithmetic, because it absorbs some stops and not others, so the ranking must be redone with the buffer in the model; Chapter 10 does that. And a reduction in the ratio can come from fewer stops or from shorter ones, which are the same to this formula but not to a buffer: the buffer swallows short stops and passes long ones, so on a buffered line shortening long stops is worth more than preventing short ones. The no-buffer formula is the right first screen; the buffered model is the right final answer.

## Long rigid lines

The additive rule explains a familiar result in factory design: long lines of machines coupled without buffers lose a great deal of output, even when each machine is very reliable. A machine available 98% of the time has a downtime ratio of 0.02 ÷ 0.98 = 0.0204.

```figure
type: bars
title: Efficiency of a rigid line of identical machines, each 98% available
unit: %
max: 100
caption: This is an illustration. Operation-dependent failures: E = 1 ÷ (1 + n × 0.0204). Time-dependent failures would give 0.98ⁿ, slightly lower: 81.7% for ten machines.
- 1 machine | 98.0
- 2 machines | 96.1
- 4 machines | 92.5
- 6 machines | 89.1
- 8 machines | 86.0
- * 10 machines | 83.1
```

Ten machines, each down only 2% of its running time, give a line that runs 83% of the time. The remedies are the ones the rest of this book examines: buffers that decouple the machines (Chapter 5), faster repair, which cuts every ratio, and fewer stops. Engineers designing a new line can use the formula at the concept stage to set reliability targets for each machine: to reach 90% line efficiency with ten machines, the ratios must sum to 0.111, an average of 0.011 each, or about 98.9% availability per machine.

## What the measured availabilities mean on a coupled line

On a running line, each machine's log records its own stops, and a naive availability calculated over the whole scheduled time mixes in the time it stood idle. This is an illustration. Over a shift, the bagger was stopped by its own faults for 10.6% of the time and stood idle for the case packer for 4.3%. Its availability over its own running and stopped time, excluding the idle time, is 0.8511 ÷ (0.8511 + 0.1064) = 0.889, the figure Chapter 1 found. Including the idle time as "not available" would give 85.1%, which is the line's figure, not the bagger's.

The distinction matters when the figures are used to rank machines or to judge improvements. The bagger's own availability is the right input for the model; the line efficiency is the output. Reporting the line's efficiency as each machine's availability blames every machine for every other's stops, and reporting each machine's own availability without the line efficiency hides the cost of coupling.

## Speed does not help without a buffer

The case packer can run at 66 bags a minute, 10% faster than the bagger. With no buffer that capacity is wasted, because the case packer can only pack bags as they arrive. Its extra speed becomes useful only when there is something to catch up on, which needs bags to accumulate while it is stopped and a buffer to hold them. Chapter 5 shows that the speed margin and the buffer work together: the buffer fills while the case packer is stopped, and the speed margin empties it afterwards.

## The error: a promise made on the bagger's availability

This is an illustration. When a retailer asked whether line 1 could commit to a weekly volume, the sales coordinator used the bagger's availability from the maintenance report, then 88.9%, as the line's: 60 bags a minute × 480 minutes × 0.889 = 25,600 bags a shift, or 256,000 a week. The plant committed to 255,000.

The first fortnight averaged about 24,500 bags a shift, 245,000 a week, and the plant ran overtime to make up the shortfall. The engineer's check took one line of arithmetic. With no buffer, the case packer's stops add to the bagger's: E = 1 ÷ (1 + 0.125 + 0.050) = 0.851, or 24,511 bags a shift. The commitment had been 4.3% too high, about 1,089 bags a shift, because the case packer's downtime ratio of 0.050 had been left out entirely. The real line has a five-minute buffer, which Chapter 5 shows recovers part of the loss, about 260 bags a shift, but not all of it.

The fix was procedural. Commitments are now made from a line model, checked against the line's recent output, with a margin for the uncertainty that Chapter 1 described. And the maintenance report now shows the line's efficiency next to each machine's availability, so that the two are not confused again.

## Exercise: adding the metal detector

The metal detector described above, with a failure rate of 0.05 per running hour and a mean restart of 5 minutes, is added after the case packer with no buffer. Find the line efficiency and bags a shift with operation-dependent failures, and the bags lost a year over 500 shifts. Then find the line efficiency if all three machines' failures were time-dependent instead.

**Worked answer.** This is an illustration. The detector's downtime ratio is 0.05 ÷ (60 ÷ 5) = 0.05 ÷ 12 = **0.00417**. With operation-dependent failures, E = 1 ÷ (1 + 0.125 + 0.050 + 0.00417) = **0.8481**, or 60 × 480 × 0.8481 = **24,424 bags a shift**, 87 fewer than before, about **43,500 bags a year**. With time-dependent failures, the detector's availability is 12 ÷ 12.05 = 0.99585, and the line efficiency is 0.8889 × 0.9524 × 0.99585 = **0.8431**. Either way the detector costs less than half a per cent of output, which is small beside its purpose, but the calculation shows the cost before the detector is installed rather than after.
