---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: one-fitter-four-machines
order: 6
title: "One fitter, four machines: the machine repair model"
description: "A birth–death model for machines that share one repairer: how often breakdowns queue, the waiting hidden in logged repair times, fitter utilisation, and what a second fitter would buy."
draft: false
---

A breakdown is two things: the time a fitter spends repairing the machine, and the time the machine waits for a fitter to arrive. When one fitter looks after several machines, the second part appears whenever two machines break down close together. It does not show in the fitter's timesheet, which records only hands-on work, and it hides inside the machine's logged downtime, which records everything. A model that separates the two tells a manager how much downtime the fitter's workload causes, and what more fitters would buy.

This chapter builds the classic machine repair model, a birth–death Markov chain, for the four baggers sharing one fitter per shift. It finds how much of the logged hour-long breakdown is waiting, why a fitter who is idle most of the time still leaves machines waiting, and what a second fitter would add to output. It ends with a staffing decision made on the fitter's utilisation alone.

## Four machines and one fitter

This is an illustration. Each of the four baggers suffers breakdowns at 0.10 per running hour, as Chapter 3 found. Jams are cleared by operators and do not involve the fitter. Breakdowns are logged as lasting 60 minutes on average, from the machine stopping to its restart. The fitter's job cards show an average of 48 minutes of work per breakdown. The other 12 minutes are spent waiting: for the fitter to finish another job, or to walk from one line to another.

The model counts how many baggers are broken down at once, from zero to four. When n are down, the other 4 − n are running, and each can break down at 0.10 per hour, so a new breakdown arrives at (4 − n) × 0.10 per hour. The fitter repairs one machine at a time at a rate of 60 ÷ 48 = 1.25 per hour whenever at least one is down. A chain whose states step up by one on a "birth" and down by one on a "death" is a birth–death process, and its long-run probabilities follow from detailed balance between each pair of neighbouring states, exactly as in Chapter 3.

```figure
type: formula
title: The machine repair model for N machines and one repairer
formula: p_n = p_(n−1) × (N − n + 1) λ ÷ μ, for n = 1 to N
formula: p₀ is found from p₀ + p₁ + … + p_N = 1
caption: This is an illustration. N = 4 baggers, λ = 0.10 breakdowns per running hour each, μ = 1.25 repairs per hour (48 minutes of work). Each step multiplies by the number of machines still able to break down.
- p₀, none down | 0.7092
- p₁, one down and being repaired | 0.2269
- p₂, one repaired and one waiting | 0.0545
- p₃ | 0.0087
- p₄, all four down | 0.0007
```

Reichl's treatment of the master equation for birth–death processes uses the same structure for populations, chemical reactions and queues; here the "population" is broken machines. Because each state connects only to its neighbours, the flow up from state n − 1 to n must equal the flow back down, which gives the product formula directly.

## What the probabilities say

From the probabilities follow the measures a manager cares about. The average number of baggers down is the sum of n × pₙ, 0.365; the average number waiting for the fitter is the sum of (n − 1) × pₙ over n of two or more, 0.074. The fitter is busy whenever at least one machine is down, 29.1% of the time. Breakdowns occur at 0.10 times the number running, 0.10 × (4 − 0.365) = 0.364 an hour across the four. Little's law then gives the average time a broken machine waits: 0.074 ÷ 0.364 = 0.203 hours, 12.2 minutes, and its average total downtime 0.365 ÷ 0.364 = 1.004 hours, 60.2 minutes.

```figure
type: stats
title: The four baggers sharing one fitter
caption: This is an illustration. Model results for 0.10 breakdowns per running hour per bagger and 48 minutes of repair work. The modelled 60.2 minutes of downtime per breakdown matches the log's 60, which is how the 48-minute work content was confirmed.
- 29.1% | Fitter busy | idle 71% of the shift
- * 12.2 min | Average wait for the fitter per breakdown | 20% of the logged hour
- 60.2 min | Average downtime per breakdown | 48 min of work plus waiting
- 90.9% | Each bagger's availability against breakdowns alone | 92.6% if no breakdown ever waited
```

The probabilities of the rarer states are worth reading too. Three or more baggers are down at once 0.94% of the time, about 75 hours over the plant's 8,000 scheduled hours a year; all four are down together 0.07% of the time, about 6 hours a year. Those are the hours when a customer order is most at risk, and they are almost entirely hours when breakdowns are queued behind one fitter. A plant that has had a bad night with three lines down at once has usually met this tail of the distribution, not an unusual run of bad luck.

A fifth of each logged breakdown is waiting. That is the first practical result: an improvement programme that set out to cut the 60-minute breakdowns by working faster would be attacking the 48 minutes and ignoring the 12, and a programme that set out to cut the 12 by adding fitters must compare the cost of fitters with the value of 12 minutes.

## Idle most of the time, and still a wait

The fitter is idle 71% of the time, which looks like ample spare capacity. Yet a breakdown waits 12 minutes on average. The two facts fit together because breakdowns are random: they do not arrive evenly spaced, and the fitter's idle hours are not where the second breakdown happens to fall.

A second subtlety makes the wait worse than the time-average suggests. The chance that the fitter is busy at a random moment is 29.1%, but the chance that the fitter is busy at the moment a breakdown happens is lower, 22.0%, because a breakdown can only come from a machine that is running, and when the fitter is busy one machine is already down. For a closed group of machines, the state that a new breakdown sees is the long-run state of the group with that machine removed: three baggers and one fitter. The result, sometimes called the arrival theorem, matters when the group is small. For a large group it makes little difference, which is why Chapter 7 can use a simpler model for the whole site's maintenance crew.

## What a second fitter would buy

The model can be rerun with two fitters: the repair rate in state n becomes the smaller of n and 2, times 1.25. The waiting almost disappears.

```figure
type: compare
title: One fitter against two for the four baggers' breakdowns
cols: Fitter busy, each | Average wait, min | Downtime per breakdown, min | Bagger availability, breakdowns only | Line bags a shift, no buffer
rowhead: Fitters per shift
caption: This is an illustration. Bags a shift from Chapter 4's line formula with the bagger's breakdown downtime ratio set to 0.10 × downtime ÷ 60. The buffer passes most long stops, so the buffered line gains about the same.
- * One fitter | 29.1% | 12.2 | 60.2 | 90.9% | 24,503
- Two fitters | 14.8% | 0.4 | 48.4 | 92.5% | 24,921
- No waiting at all | not applicable | 0 | 48.0 | 92.6% | 24,935
```

A second fitter on each shift would add about 418 bags a shift on each line, 1,672 across the four, or about 836,000 bags a year over 500 shifts. At the illustrative contribution of A$0.10 a bag that is about A$84,000 a year. The cost of a second fitter on each of two shifts, at an illustrative A$115,000 a year each including on-costs, is A$230,000. On output alone the second fitter does not pay.

The model also shows what would pay better. The waiting is caused by overlap, and overlap falls if each repair is shorter. Cutting the work content from 48 to 40 minutes, with spares kits at each line and a fault-finding guide, would cut both the work and the wait, without a second person. Chapter 10 compares that with the other options.

## Shorter repairs instead of more fitters

The same model prices the alternative. This is an illustration. With spares kits held at each line and a fault-finding guide for the commonest breakdowns, the fitter's work content falls from 48 to 40 minutes. The repair rate becomes 1.5 per hour. With one fitter, the fitter is busy 24.7% of the time, the average wait falls from 12.2 to 8.4 minutes, and the downtime per breakdown from 60.2 to 48.4 minutes. Each bagger's availability against breakdowns rises to 92.5%, and the line formula gives 24,920 bags a shift: within one bag of the two-fitter result.

Shortening the work does twice the good of its own size: it removes eight minutes of work from every breakdown and also shrinks the overlaps that cause waiting, taking another four minutes off the average wait. The comparison is the whole value of the model. Two quite different investments, a second person on each shift or a set of spares and a guide, buy almost the same output, and the model shows it before either is bought. Chapter 10 prices both against the other options for the line.

## Checking the model against the job cards

A model like this makes a prediction that the records can test directly: the share of breakdowns that found the fitter already busy. The arrival theorem gives 22.0%. This is an illustration. In the four-week log, the four baggers had 116 breakdowns between them, and the job cards showed that 26 of them started while the fitter was on another job, 22.4%. The agreement confirms the model's two inputs, the breakdown rate and the 48-minute work content, and the assumption that breakdowns on different baggers are independent.

Had the share been much higher, the likely cause would be breakdowns that cluster: a common cause such as a bad batch of film affecting all four lines, or a shift change when all four baggers restart at once. Clustering raises waiting above what the independent model predicts, and its remedy lies in the cause, not in more fitters.

## Priorities and travel

Two real features are missing from the simple model. The first is priority. With one fitter and two breakdowns, the fitter should go to the machine whose stop costs most, and on a line with a buffer that may not be the one that broke first. The bagger and case packer on the same line have very different costs per minute stopped, once the buffer is included. The second is travel. The 48 minutes of work content include walking between lines; a fitter based at the far end of the hall adds minutes to every job. Both can be modelled, by adding states for priority classes and a travel time to each repair, but the simple model is usually good enough to tell whether the question is worth that refinement.

## Isolation is part of the repair

Every one of the 48 minutes assumes the machine has been isolated, locked out and proved dead before the fitter reaches into it, and that guards are refitted before it restarts. Work health and safety law requires it, and Safe Work Australia's model code of practice on managing the risks of plant explains how to isolate plant and control its stored energy. The time it takes is part of the work content, not waste to be squeezed out. If the model shows that faster repairs would be valuable, the gains come from better access, spares at hand, clearer diagnostics and practised procedures, never from shortcuts on isolation.

## The error: a utilisation target

This is an illustration. A review of maintenance staffing set a target utilisation of 70% for fitters, on the reasoning that a fitter busy less than that is under-used. The packing hall's fitter, busy 29% of the shift, was flagged, and the review proposed adding two more lines' worth of machines to the same fitter's round.

The engineer modelled the proposal: six baggers with one fitter. The fitter would be busy 42.9% of the time, still well under the target, but the average wait per breakdown would rise from 12.2 to 23.6 minutes, and each bagger's availability against breakdowns would fall from 90.9% to 89.3%. On the four existing lines alone, that loss was worth more than the saving in fitter time.

```figure
type: compare
title: The fitter's round extended from four baggers to six
cols: Fitter busy | Average wait per breakdown, min | Downtime per breakdown, min | Bagger availability, breakdowns only
rowhead: Machines on one fitter's round
caption: This is an illustration. Same breakdown rate and 48-minute repairs. Utilisation rises modestly while waiting nearly doubles.
- * Four baggers | 29.1% | 12.2 | 60.2 | 90.9%
- Six baggers | 42.9% | 23.6 | 71.6 | 89.3%
```

The mistake was to treat a repairer like a machine that should be kept busy. A repairer's job is to keep the machines busy, and waiting rises steeply as utilisation rises, long before the repairer is fully loaded. For repairers serving machines with random breakdowns, utilisation is the wrong target; the right one is the waiting time the plant can afford, and the machine repair model converts between the two.

## Exercise: six baggers with two fitters

If the fitter's round were extended to six baggers but a second fitter were added, with the same breakdown rate of 0.10 per running hour and 48 minutes of work, what would the average wait and downtime per breakdown be, and each bagger's availability against breakdowns? Compare them with four baggers and one fitter. Use pₙ = pₙ₋₁ × (6 − n + 1) × 0.10 ÷ (min(n, 2) × 1.25).

**Worked answer.** This is an illustration. The ratio 0.10 ÷ 1.25 is 0.08. Starting from p₀ = 1, the unnormalised terms are p₁ = 6 × 0.08 = 0.48, p₂ = 0.48 × 5 × 0.08 ÷ 2 = 0.096, p₃ = 0.096 × 4 × 0.08 ÷ 2 = 0.01536, p₄ = 0.00184, p₅ = 0.00015 and p₆ = 0.00001; they sum to 1.5934. Normalised, the average number down is 0.7262 ÷ 1.5934 = 0.456, and the average number waiting, counting only machines beyond the two being repaired, is 0.0195 ÷ 1.5934 = 0.0122. Breakdowns arrive at 0.10 × (6 − 0.456) = 0.554 an hour, so by Little's law the average wait is 0.0122 ÷ 0.554 × 60 = **1.3 minutes** and the average downtime per breakdown 0.456 ÷ 0.554 × 60 = **49.3 minutes**. Each bagger's availability against breakdowns is 1 − 0.456 ÷ 6 = **92.4%**, above the 90.9% of four baggers with one fitter. Two fitters for six machines serve them better than one fitter for four, because the chance that both fitters are busy when a breakdown happens is very small.
