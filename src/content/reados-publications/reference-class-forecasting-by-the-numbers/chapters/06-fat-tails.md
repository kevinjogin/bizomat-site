---
book: reference-class-forecasting-by-the-numbers
chapterSlug: fat-tails
order: 6
title: "Fat tails: when the average misleads"
description: "Tail measures for the 24-project class, why a normal curve misreads it, how tails differ by project type, and why Bay 4's A$140k software line carries its tail."
draft: false
---

Chapter 4 read the reference class through its percentiles, and Chapter 5 turned a chosen percentile into a budget. Both treat the class as a single distribution and ask where a given share of outcomes falls. This chapter looks at the distribution's shape, and in particular at its upper end, where a few projects finished at one and a half to two and a half times their approved budgets. That end decides whether an average means anything, whether a normal curve can stand in for the record, and where in a project the real exposure sits.

The short answer for Bay 4 is that the tail is not spread evenly across the project. Its machines come from a class with almost no tail at all, and its software and network work comes from a class where half the past projects overran by 50% or more. Contingency set as a flat percentage of the whole budget ignores that difference, and so does a three-point estimate that assumes the worst case is only a little worse than the likely one.

## Thin tails and fat tails

A distribution is **thin-tailed** when outcomes cluster around a typical value and the worst outcomes are not far from it. Heights of adults, the weights of bags off a filling line and the cycle times of a stable machining operation behave like this. The average is a good summary, the spread is well described by a standard deviation, and a normal curve fitted to a sample predicts the extremes reasonably well.

A distribution is **fat-tailed** when rare outcomes sit far from the typical one, and when those rare outcomes carry a large share of the total. A single observation can move the average noticeably; the worst observed outcome is several times the typical departure; and a normal curve fitted to the sample gives the extremes far too little probability. Published research on cost overrun, summarised in the Flyvbjerg et al. (2018) paper listed in this book's references, argues that overrun distributions for many project types are fat-tailed in this sense, and that the tails come from behaviour and from how projects are run, not from random noise around a sound estimate.

Overrun ratios also have a natural asymmetry. A project can rarely finish far under its approved budget: the scope was priced, the quotes were real and most savings are small. There is no matching ceiling on the way up. A project that discovers a missing substation, a data migration that will not run or a guarding design that fails its safety assessment can double its cost. The lower end of the distribution is bounded in practice; the upper end is open.

## Measuring the tail of the class

This is an illustration. The 24 past projects of the running case, with approved budgets and final costs in 2026 dollars excluding GST, give four simple tail measures. Each is easy to compute in a spreadsheet and each answers a different question.

- **Share of projects with an overrun of 50% or more**, a cost ratio of 1.50 or above: 4 of 24, or **16.7%**. The four are P05 (first ERP system, 2.60), P21 (machine monitoring and MES pilot, 1.95), P18 (collaborative robot loading two lathes, 1.68) and P08 (switchboard and power upgrade, 1.52).
- **Mean overrun of the projects in that tail**: (2.60 + 1.95 + 1.68 + 1.52) ÷ 4 = 1.9375, a mean overrun of **93.8%**. When a project lands in the tail, it lands deep.
- **Worst ratio divided by the median**: 2.60 ÷ 1.140 = **2.28**. The worst project's ratio is more than twice the typical one.
- **Share of overrun dollars from the tail**: the 24 projects had approved budgets of A$7,095k and final costs of A$8,658k, a net overrun of A$1,563k. The four tail projects overran by A$288k, A$133k, A$143k and A$99k, a total of A$663k, or **42.4%** of the net overrun, from budgets that were only A$720k, or 10.1% of the approved dollars.

```figure
type: stats
title: Four tail measures for the 24-project class
caption: This is an illustration. Cost ratio = final cost ÷ approved budget at the decision to proceed, both in 2026 dollars excluding GST.
- * 16.7% | Projects with overrun of 50% or more | 4 of 24
- 93.8% | Mean overrun of those four | mean ratio 1.9375
- 2.28 | Worst ratio ÷ median | 2.60 ÷ 1.140
- 42.4% | Share of net overrun dollars from the four | A$663k of A$1,563k
```

The dollar measure needs one caution. Ranked by dollars rather than by ratio, the second-largest overrun in the class is P15, the factory extension, which overran by A$276k at a ratio of only 1.24, because its budget was A$1,150k. A large project with a moderate ratio can lose as many dollars as a small project with an extreme one. The tail measures above describe the shape of the ratios; dollar exposure also depends on size, and both matter for Bay 4.

```figure
type: stack
title: Where the class's net overrun of A$1,563k came from
unit: A$'000
caption: This is an illustration. Four projects with ratios of 1.50 or more supplied 42.4% of the net overrun. The other 20 projects' figure is net of three small underruns totalling A$12k.
- P05 First ERP system, ratio 2.60 | 288
- P18 Collaborative robot cell, ratio 1.68 | 143
- P21 Monitoring and MES pilot, ratio 1.95 | 133
- P08 Switchboard and power upgrade, ratio 1.52 | 99
- Other 20 projects, net | 900
```

## What the average hides

The class's mean ratio is 1.267 and its median is 1.140. The gap between them is the first sign of a tail: the mean is pulled upward by a handful of large values that the median ignores. Remove P05 alone and the mean falls to 1.209, a drop of 0.058, while the median moves only from 1.140 to 1.130. One project out of 24 shifts the mean almost six times as much as it shifts the median.

That sensitivity cuts both ways. A business that sets budgets from the average of its past ratios gets a number that jumps whenever a bad project enters or leaves the record. Worse, in a small sample from a right-skewed distribution, the sample mean is more often below the long-run mean than above it, because the rare extreme projects that drive the long-run mean are usually missing from any given sample. A class of 24 that happens to contain one ERP disaster may be closer to the truth than one that happens to contain none, and a business whose record has no disaster yet should not read that as evidence it will never have one.

This is why the book works with percentiles rather than means, as [Reading the distribution](/reados/publications/reference-class-forecasting-by-the-numbers/reading-the-distribution/) set out. A percentile answers the question a budget actually asks, "how often would this amount have been enough?", and it is far less disturbed by a single extreme value. It does not make the tail go away. It only stops the tail from silently inflating or deflating a summary number.

## Testing the normal assumption

Many spreadsheet risk models assume that outcomes follow a normal distribution, because it needs only a mean and a standard deviation. Fitted to the class, the normal curve has a mean of 1.267 and a sample standard deviation of 0.374. Its predictions can be set beside the record.

```figure
type: compare
title: A normal curve fitted to the class, against the record
cols: Normal, mean 1.267, sd 0.374 | Record, 24 projects
caption: This is an illustration. The normal curve spreads the shoulders too wide, invents underruns that never happened and gives the extreme outcome almost no chance.
- Ratio 0.92 or below | 17.7% | 4.2%, 1 of 24
- Ratio 1.50 or above | 26.6% | 16.7%, 4 of 24
- Ratio 2.00 or above | 2.5%, 1 in 40 | 4.2%, 1 of 24
- * Ratio 2.60 or above | 0.018%, about 1 in 5,400 | 4.2%, 1 of 24
- P80 ratio | 1.582 | 1.408
```

The normal curve is wrong at both ends. It puts 17.7% of projects at a ratio of 0.92 or below, where the record has only P12 at exactly 0.92, because a symmetric curve must place as much probability below the mean as above it. It overstates the share at 1.50 or above and sets the P80 at 1.582, well above the record's 1.408, because one outlier inflates the standard deviation. And it treats P05 as a 3.56 standard-deviation event that should occur about once in 5,400 projects. Under that curve, the chance of seeing at least one ratio of 2.60 or more in 24 projects is about 0.44%. The business has seen one. That is strong evidence that the shape is wrong, not that the business was extraordinarily unlucky.

[Thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/) explains distributions as statements of belief about what can happen. A normal curve is a strong statement: that departures beyond three standard deviations are practically impossible. For project costs, the business's own record contradicts it. Where a distribution is needed, the record itself, read by percentiles or resampled as in Chapter 8, says less and is more honest.

## Tails differ by type of project

The whole class mixes four kinds of project, and their tails are very different.

```figure
type: compare
title: Cost ratio tails by type of project
cols: Projects | Mean ratio | Standard deviation | Worst ratio | Ratio 1.50 or above
caption: This is an illustration. Machines are thin-tailed; software is fat-tailed. With four to eight projects each, the subclasses show direction and shape, not precise percentiles.
- Machines | 7 | 1.020 | 0.037 | 1.08 | 0 of 7
- Buildings | 8 | 1.183 | 0.180 | 1.52 | 1 of 8
- Automation | 5 | 1.332 | 0.235 | 1.68 | 1 of 5
- * Software | 4 | 1.785 | 0.629 | 2.60 | 2 of 4
```

The machine purchases are the thinnest-tailed work the business does. Its worst machine project, the five-axis machining centre P20, overran by 8% on shipping delay and the exchange rate, and the standard deviation of 0.037 is a tenth of the whole class's. A machine is a catalogue product with a fixed price, a known lead time and a supplier who has installed hundreds of the same model. Little is discovered after approval.

Software is the opposite. Two of the four projects overran by 50% or more, the mean ratio is 1.785 and the standard deviation is 0.629. The causes in the record, data migration and customisation in P05, a network rebuild and ERP integration in P21, are the kind of work whose real scope is found only by doing it. Automation sits between: every automation project in the class overran, and the two worst, P14 and P18, were integration and safety work rather than the robot or pallet system itself. Buildings carry one tail project, P08, where the network operator required a new kiosk substation.

## Published base rates show the same pattern

The supplementary material to *How Big Things Get Done* (Flyvbjerg and Gardner, 2023), drawn from the Flyvbjerg database of more than 16,000 projects, publishes cost risk base rates by project type, measured in real terms against the budget at final investment decision. Three of its rows are useful here.

```figure
type: compare
title: Published cost risk base rates beside the business's own class
cols: Mean cost overrun | Share with overrun of 50% or more | Mean overrun in that tail
caption: Published rows from the supplementary material to How Big Things Get Done (Flyvbjerg and Gardner, 2023), mostly large projects worldwide. The business's own rows are an illustration from the fictional class.
- Buildings, published | 62% | 39% | 206%
- IT, published | 73% | 18% | 447%
- Solar power, published | 1% | 2% | 50%
- Business's buildings, 8 | 18.3% | 12.5% | 52.0%
- * Business's software, 4 | 78.5% | 50.0% | 127.5%
- Business's whole class, 24 | 26.7% | 16.7% | 93.8%
```

These are mostly large projects worldwide, many of them public, and a small business should not set its budget from them. Its own records describe its own suppliers, scale and habits better. The published rows are useful for judging the shape and direction of the tail. IT projects in the database rarely land in the tail, 18%, but when they do, the mean overrun is 447%. Solar power is almost tail-free, which the research attributes to modular, repeatable work. The business's own pattern points the same way: its catalogue machines behave like the thin-tailed published type, and its software has the deepest tail it owns. Its buildings are much milder than the published buildings row, which is plausible for small, simple structures on its own site, and is a reason not to import the 62% figure into a factory extension.

## What the tail means for Bay 4

Bay 4's base estimate is A$860k for the building, A$1,000k for the machines, A$280k for the automation and A$140k for the software and network, plus A$120k of contingency, an approved budget of A$2.40m excluding GST. Chapter 8 spreads the contingency across the components in proportion to their base costs, giving shares of the approved budget of A$905.3k, A$1,052.6k, A$294.7k and A$147.4k. Applying each subclass's P90 ratio to its share shows where the exposure sits.

```figure
type: bars
title: Bay 4 overrun at each component's subclass P90
unit: A$'000
max: 350
caption: This is an illustration. Software is 6.1% of the base but carries 26.4% of the sum of these P90 overruns; machines are 43.9% of the base and carry 8.3%. The sum is not a project P90 (Chapter 8).
- Building, P90 ratio 1.373 on A$905.3k | 337.7
- Machines, P90 ratio 1.062 on A$1,052.6k | 65.3
- Automation, P90 ratio 1.588 on A$294.7k | 173.3
- * Software and network, P90 ratio 2.405 on A$147.4k | 207.1
```

Two things stand out. The software and network line is 6.1% of the base cost and contributes 26.4% of the sum of the P90 overruns; at the worst ratio in its subclass, 2.60, it would add A$235.8k, about twice the whole project contingency. The building has the largest dollar exposure, A$337.7k at its P90, not because its tail is fat but because it is large, and its one tail project, P08, was a power supply problem that Bay 4 could repeat. The machines, the biggest line, contribute little.

A flat contingency, such as the A$120k that Chapter 1 traced to a template line, "what we always use", spreads protection evenly over the budget. The tail is not even. The useful response is to target the work that carries it, which Chapter 9 does: network and power investigations before approval, and a software pilot before committing to the full system.

## The error: a symmetric range for the software

This is an illustration. During Bay 4's risk review, the software lead gave a three-point estimate for the software and network line: optimistic A$120k, most likely A$140k, pessimistic A$250k. The estimator used the PERT formulas, mean = (O + 4M + P) ÷ 6 and standard deviation = (P − O) ÷ 6, which give a mean of (120 + 560 + 250) ÷ 6 = **A$155.0k** and a standard deviation of 130 ÷ 6 = **A$21.7k**. Treating the result as normal, the P90 is 155.0 + 1.2816 × 21.7 = **A$182.8k**, 1.31 times the A$140k line. The risk register recorded a software P90 of A$183k and assigned A$43k of the contingency to it.

The pessimistic value looked generous: A$250k is nearly 1.8 times the most likely cost. The reviewer found the problem by putting the range beside the software subclass. P21, the business's own machine monitoring and MES pilot, had an approved budget of A$140k, the same as Bay 4's line, and finished at A$273k. The team's "pessimistic" case was below an outcome the business had already had on similar work. The subclass P90 of 2.405, applied to the line's A$147.4k share of the approved budget, gives **A$354.4k**, nearly twice the PERT figure.

```figure
type: range
title: Three views of Bay 4's software and network cost
min: 100
max: 400
unit: A$'000
ticks: A$100k | A$250k | A$400k
caption: This is an illustration. The team's range stopped below P21's actual outcome, and the beta distribution behind PERT is bounded at A$250k.
- Team's three-point range | 120 | 250 | optimistic to pessimistic
- PERT P90, normal assumption | 182.8 | 182.8 | 1.31 × the A$140k line
- P21 actual, approved A$140k | 273 | 273 | ratio 1.95
- * Software subclass P50 to P90 | 245.4 | 354.4 | on the A$147.4k share
```

The error had two layers. A pessimistic value in a three-point estimate records what the people in the room can imagine, and people anchor on the most likely case and adjust too little. The PERT model then makes it worse: its underlying distribution is bounded at the pessimistic value, so it assigns no probability to any cost above A$250k, and the normal approximation keeps the P90 close to the middle of the range. The correction was to replace the three-point range with the subclass percentiles for the software line, to note that four projects support those percentiles only loosely, and to treat the gap as a reason to act on the software before approval rather than as a number to argue about.

## Exercise: two halves of the class

Split the 24 projects into machine and building projects (15) and automation and software projects (9). For each group, find the share with a ratio of 1.50 or above, the worst ratio divided by the group's median, and the group's share of approved dollars and of the A$1,563k net overrun. The machine and building projects had approved budgets of A$5,510k and a net overrun of A$677k.

**Worked answer.** Machine and building projects: 1 of 15 (P08) at 1.50 or above, **6.7%**; the sorted ratios run from 0.92 to 1.52 with the eighth value, the median, at 1.06, so worst ÷ median = 1.52 ÷ 1.06 = **1.43**; they hold A$5,510k ÷ A$7,095k = **77.7%** of approved dollars and A$677k ÷ A$1,563k = **43.3%** of the net overrun. Automation and software projects: 3 of 9 (P05, P21, P18) at 1.50 or above, **33.3%**, with a mean overrun in the tail of **107.7%**; the median of the nine is 1.38, so worst ÷ median = 2.60 ÷ 1.38 = **1.88**; they hold A$1,585k, **22.3%** of approved dollars, and A$886k, **56.7%** of the net overrun. A fifth of the money produced more than half of the overrun. For Bay 4, whose automation and software lines are A$420k of its A$2,280k base, that is where tail-cutting effort belongs.
