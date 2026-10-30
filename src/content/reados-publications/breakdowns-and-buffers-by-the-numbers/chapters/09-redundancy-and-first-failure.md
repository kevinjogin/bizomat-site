---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: redundancy-and-the-time-to-first-failure
order: 9
title: "Redundancy and the time to first failure"
description: "Two compressors, one needed: mean first passage time to losing both, active and standby redundancy, why repair makes redundancy work, failures to start, and common causes."
draft: false
---

Some machines are so important that a site installs two where one would do. The packing hall's compressed air is one: every bagger and case packer uses it, and if it fails, all four lines stop. Two compressors, either able to carry the load, should make a total loss of air very rare. How rare depends on three things the word "redundant" hides: whether the second machine is running or waiting, how quickly a failed one is repaired, and whether anything can take out both at once.

This chapter calculates the mean time until the hall loses its air, the mean first passage time of a Markov chain to its failed state, for the two compressors running together and for one running with the other on standby. It compares the result with redundancy without repair from the WORKOS system reliability tool, adds a standby that sometimes fails to start, and ends with a pair whose expected decade between losses of air shrank to about three years once a shared cause of failure was counted.

## Two compressors, one repair crew

This is an illustration. The packing hall has two identical compressors, either of which can supply the hall's demand. Each stops on a fault on average every 2,000 running hours, a failure rate of 0.0005 an hour, at random. A failed compressor is repaired by a contractor in 24 hours on average, including call-out, a repair rate of 1 ÷ 24 an hour. There is one contractor, so if both fail, the second waits for the first to be repaired.

One compressor alone would be unavailable λ ÷ (λ + μ) = 0.0005 ÷ 0.04217 = 1.19% of the time, about 104 hours a year of the plant's 8,760, and would almost certainly stop at least once a year. The question is what the second one buys.

## Mean first passage time

The chain for the pair has three states: both working; one failed and being repaired; both failed. The third is the one to avoid. The mean time to reach it from the first, starting with both working, is a mean first passage time, which Reichl derives for general Markov chains from the master equation. For a small chain the method is simple: write the expected time to failure from each working state as the time spent there on average plus the expected time from wherever the chain goes next, and solve the two equations.

```figure
type: formula
title: Mean time to losing both compressors, both running, one repair crew
formula: From both working: T₂ = 1 ÷ (2λ) + T₁
formula: From one working: T₁ = 1 ÷ (λ + μ) + μ ÷ (λ + μ) × T₂
formula: Solution: T₂ = (3λ + μ) ÷ (2λ²)
caption: This is an illustration. With both running, either can fail, so the pair leaves the first state at 2λ. From one working, the next event is either the second failure, at λ, or the repair, at μ; repair returns the pair to the first state.
- λ = 0.0005 an hour; μ = 1 ÷ 24 = 0.04167 an hour
step: T₂ = (0.0015 + 0.04167) ÷ (2 × 0.00000025) = 86,333 hours, about 9.9 years
step: Unavailability of air in the long run: 0.028%, about 2.5 hours a year
```

Running both compressors gives a mean of about ten years between losses of air, against a compressor stop about every three months for a single machine. The chance of losing air in any one year is about 1 − e^(−8,760 ÷ 86,333) = 9.7%.

The method extends to any number of states. For each working state, the expected time to the failed state equals the average time spent in that state, one divided by the total rate of leaving it, plus the expected times from each possible next state weighted by the chance of going there. That gives one linear equation per working state, and the set can be solved by hand for three or four states or with a spreadsheet's matrix functions for more. In matrix form the vector of mean times is the inverse of the rate matrix restricted to the working states, with its sign changed, multiplied by a column of ones. It is the same calculation reliability software performs for a Markov model of a complex system, and IEC 61165, the international standard on applying Markov techniques in dependability work, describes the general approach. A hand calculation for a small chain is the best check on such software.

## Repair is what makes redundancy work

The [system reliability tool](/tools/system-reliability/) answers a different question, and the difference is the lesson. From up to four blocks in series, each with a Weibull shape, a characteristic life and a number of identical units in active redundancy, it calculates each block's reliability at a mission time, the system's reliability, the weakest block and the system's mean time to failure by integrating the reliability curve. It assumes independent failures and no repair during the mission, and it reminds the user to check common causes.

```figure
type: compare
title: The compressor pair with and without repair
cols: Mean time to losing both, h | Reliability over 1,000 h | Losses of air expected a year
rowhead: Arrangement
caption: This is an illustration. The no-repair rows are the system reliability tool with shape β = 1 (random failures) and characteristic life 2,000 h. The repaired rows come from the mean first passage time. Repair turns a modest gain into a large one.
- One compressor, no repair | 2,000 | 60.7% | not applicable
- Two compressors, no repair | 3,000 | 84.5% | not applicable
- * Two compressors, 24-hour repair | 86,333 | about 98.8% | about 0.10
```

Without repair, a second compressor adds only half the first one's life: the pair lasts 3,000 hours on average, because once one has failed the other is alone. With repair, the pair lasts 86,333 hours, because almost every time one fails it is repaired long before the other fails too. The ratio μ ÷ λ, 83 here, measures how many times faster repair is than failure, and the mean time to losing both grows roughly in proportion to it. The no-repair calculation is right for a mission where nothing can be fixed, a satellite or a remote pump between visits; for a factory with a contractor on call, it badly understates the value of the second machine.

## Running together or waiting on standby

The second compressor need not run. If it waits switched off, a cold standby, it is assumed not to fail while waiting, and the pair leaves its first state at λ instead of 2λ. The same method gives T₂ = (2λ + μ) ÷ λ² = 170,667 hours, nearly twice the running pair's figure, and a long-run unavailability of about 1.2 hours a year.

Standby has a cost that the perfect-switch model hides: the standby must start when called. This is an illustration. If the standby compressor fails to start 2% of the time, because of a stuck valve, a tripped breaker or a control fault that nobody noticed while it sat idle, the pair goes straight from both working to both failed in 2% of first failures. The mean time to losing air falls from 170,667 to 63,985 hours, below the running pair's 86,333. A standby that is never tested is a standby that may not start; the arithmetic says a running pair, which proves itself every hour, can beat an untested standby.

```figure
type: bars
title: Mean time to losing compressed air, years
unit: years
max: 21
caption: This is an illustration. 8,760 hours a year. A 2% chance that the standby fails to start costs more than half of the standby's advantage; a shared cause of failure costs more still.
- One compressor | 0.23
- Two, no repair | 0.34
- Two running, 24 h repair | 9.9
- Two, cold standby, perfect start | 19.5
- Standby, 2% failure to start | 7.3
- * Two running, 5% common cause | 3.2
```

The standby's start can be tested. Alternating the duty between the two machines weekly, so that each starts from cold every fortnight, proves the start and spreads the running hours. The chapter on [receivers and compressor control](/reados/publications/compressed-air-plant-by-the-numbers/receivers-and-compressor-control/) in Compressed Air Plant by the Numbers discusses how the control system sequences two compressors.

## Common causes

Two machines are independent only if nothing can stop both. Compressors in one room share an electrical supply, a cooling air path, a control panel, an air receiver, a dryer and a main. Any of those can take out both at once, and so can the same maintenance error made on both, or a hot day that trips both on temperature. Reliability engineers model this with a beta factor: a fraction β of each machine's failures are taken to affect both.

This is an illustration. If 5% of the compressors' failures come from causes they share, those causes alone strike the pair at 0.05 × 0.0005 = 0.000025 an hour, about 0.22 times a year, each time taking out the air for about a day. Combined with the independent failures, the mean time to losing air falls to about 28,000 hours, 3.2 years. The common causes now account for most of the losses: the pair's independent failures alone would give one loss in ten years, the shared causes one in four and a half.

## What a loss of air costs

The times become money once a loss of air is priced. This is an illustration. Without air all four lines stop. A loss lasting about a day costs four lines' daily contribution, 4 × A$4,955 = A$19,820, before restart scrap. A single compressor would stop about 4.3 times a year, an expected A$86,000 a year. The running pair without common causes would lose air about once in ten years, an expected A$2,000 a year; with the 5% common cause, about once in three years, A$6,200 a year. The second compressor is plainly worth having, and the common causes cost about A$4,200 a year, which sets a budget for removing them.

## More, smaller machines

A site sometimes considers three compressors of half the size instead of two full-size ones, any two of which can carry the load. It sounds safer, with three machines instead of two, but the same first passage method says otherwise. This is an illustration. With three half-size compressors, each failing at the same rate of 0.0005 an hour and repaired by one crew in 24 hours, the hall loses air when two are down. From three working, the mean time to that state is (5λ + μ) ÷ (6λ²) = 29,444 hours, 3.4 years, about a third of the two full-size machines' 9.9 years. With three machines running there are more failures to begin with, and losing air needs only two of them to coincide rather than both of two. The half-size arrangement may still be chosen for energy efficiency at part load, but it should be chosen knowing its reliability cost, and with a faster repair arrangement to offset it.

## Finding and removing common causes

The model shows where to spend money: not on a third compressor, which would add little, but on the things the two share. A walk through the compressor room with the question "what single thing could stop both?" usually finds several. Typical answers include a single electrical supply that could be split across two boards, a single dryer that could be given a bypass, an air receiver whose drain valve could freeze, and a control panel whose failure stops both. Each removed shared cause lowers β, and the mean time between losses rises towards the independent figure.

Maintenance itself is a common cause. If the same technician services both compressors on the same day with the same wrong part or setting, both may fail together. Staggering the service of redundant machines, and checking the first before servicing the second, costs little. So does a rule that a redundant machine is never taken out for planned work while its partner is under repair, which removes the plant's own maintenance schedule from the list of ways to lose both.

## The error: two machines, so "four nines"

This is an illustration. When the second compressor was installed, its business case claimed that air would be available 99.99% of the time, calculated as 1 − 0.0119², the square of a single machine's unavailability, which assumes the two fail completely independently and are both always either working or under repair at random. That figure, about 1.2 hours a year without air, became the plant's assumption.

In the second year the hall lost its air twice, once when a contractor isolated the wrong supply board, which fed both compressors, and once when the shared dryer's drain froze in a cold snap. The engineer modelled the pair with a common-cause fraction estimated from the plant's own two losses and the shared items found in a walk through the compressor room, and found that a few per cent was enough to make losses of air every few years likely, with a long-run unavailability several times the business case's figure. The squared-unavailability figure was not wrong for independent machines; the machines were not independent.

The corrections were physical: separate supply boards, a dryer bypass with its own drain heater, and staggered servicing. The model was updated to track the plant's own record of losses, which gave the common-cause fraction a basis in data rather than in hope.

## Exercise: a slower contractor

The plant changes contractor to one who takes 72 hours on average to repair a compressor. With both compressors running, one repair crew and no common causes, find the mean time to losing air, and compare it with the 24-hour contractor. What does the comparison say about the value of fast repair?

**Worked answer.** This is an illustration. The repair rate is 1 ÷ 72 = 0.01389 an hour. The mean time to losing both is (3 × 0.0005 + 0.01389) ÷ (2 × 0.0005²) = 0.01539 ÷ 0.0000005 = **30,778 hours**, about **3.5 years**, against 86,333 hours, 9.9 years, with the 24-hour contractor. Tripling the repair time cut the mean time between losses of air to about a third, because the pair is exposed to a second failure for three times as long after each first failure. For a redundant pair, the repair time is the main lever: a contract with a slower response gives up most of what the second compressor was bought for.
