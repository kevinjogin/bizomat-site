---
book: reference-class-forecasting-by-the-numbers
chapterSlug: choosing-the-reference-class
order: 3
title: "Choosing the reference class"
description: "Balance similarity against sample size across 24 projects in four types, cross-check with published base rates, and see why dropping P05 and P21 cut the P80 to 1.302."
draft: true
---

A forecast from a reference class can only be as relevant as the class. Choose projects too unlike the new one and the forecast describes someone else's risks. Choose too few and the percentiles rest on two or three numbers. Choose them by looking at the outcomes first and the class becomes whatever the team hoped it would be.

This chapter works through the choice for Bay 4. It compares the business's 24 measured projects with Bay 4's own make-up, looks at the four project types separately, tests two other ways of cutting the class, and uses published base rates as a cross-check on direction and shape. It deals with the most common objection to any reference class, that this project is different, and sets out what to record for each project so that the next choice is easier. It ends with a proposal to drop two projects as one-offs, which would have cut Bay 4's 80th-percentile budget by A$254,000, excluding GST.

## Similarity against sample size

Every reference class trades two things. **Similarity** makes the past projects more like the new one, so their outcomes are more relevant. **Sample size** makes the distribution more stable, so the percentiles do not swing on one project. Narrowing the class improves the first and worsens the second.

The trade-off is not symmetrical. A broad class of genuinely comparable projects, such as all capital projects run by the same business with the same people and the same suppliers, already captures most of what matters: how this business estimates, how its approvals work, how its suppliers perform. Narrowing it further pays only where a subgroup behaves clearly differently. Kahneman and Tversky's (1979) recommendation was to start from the distribution of a broad, relevant class and then adjust, cautiously, for what is known about the case. Starting narrow and adjusting nothing is the less reliable route.

Similarity should be judged on the things that drive overrun, not on what the project looks like. For a small business the useful questions are: was the work estimated by the same people in the same way; was it approved through the same process; did it involve the same kinds of interface, such as connecting new equipment to existing machines, power or networks; did it depend on third-party approvals; and was the technology new to the business. A switchboard upgrade and a solar installation look nothing alike, but both needed a network operator's approval, and both overran for reasons connected with it. Two machine purchases look alike, but a catalogue machine and a machine with custom automation are different risks.

This is an illustration. The business's 24 projects fall into four types, and the types behave very differently.

```figure
type: tree
title: The 24 past projects by type
caption: This is an illustration. Cost ratios measured as in Chapter 2. Machines barely overran; software overran by a median of two-thirds.
- All 24 projects | median 1.140, P80 1.408, from 0.92 to 2.60
  - Machine purchases, 7 | median 1.020, P80 1.046, from 0.97 to 1.08
  - Building works, 8 | median 1.155, P80 1.282, from 0.92 to 1.52
  - Automation, 5 | median 1.270, P80 1.496, from 1.11 to 1.68
  - *Software, 4 | median 1.665, P80 2.210, from 1.21 to 2.60
```

The pattern makes sense. A machine purchase is mostly a quoted price for a standard product, with freight, rigging and a foundation around it, and the business has done it seven times. Building works carry approvals, ground and weather. Automation has to work with machines it was not designed alongside, and the business learns each time what that integration really involves. Software projects change how people work, and their scope is discovered as they run.

```figure
type: range
title: Spread of cost ratios by project type
min: 0.8
max: 2.8
ticks: 0.8 | 1.3 | 1.8 | 2.3 | 2.8
caption: This is an illustration. Each band runs from the lowest to the highest ratio in the type. The machine band is narrow and close to 1.00; the software band is wide and starts above it.
- Machine purchases, 7 | 0.97 | 1.08
- Building works, 8 | 0.92 | 1.52
- Automation, 5 | 1.11 | 1.68
- *Software, 4 | 1.21 | 2.60
- All 24 projects | 0.92 | 2.60
```

## What Bay 4 is made of

Bay 4 is not one type of project. It is a building, two machines, an automation system and a software and network job, approved together. The question is whether the whole class, with its mix of types, resembles that combination.

This is an illustration. By approved dollars, Bay 4's base cost is 37.7% building, 43.9% machines, 12.3% automation and 6.1% software and network. The 24 past projects, by approved dollars, were 36.4% building, 41.2% machines, 14.8% automation and 7.5% software. The match is close.

```figure
type: compare
title: Bay 4's mix against the reference class
rowhead: Type
cols: Bay 4, share of base cost | Past projects, share of approved dollars | Past projects, count
caption: This is an illustration. Bay 4 shares from A$860k, A$1,000k, A$280k and A$140k of a A$2.28m base; class shares from A$2,585k, A$2,925k, A$1,050k and A$535k of A$7,095k approved.
- Building | 37.7% | 36.4% | 8
- Machines | 43.9% | 41.2% | 7
- Automation | 12.3% | 14.8% | 5
- *Software and network | 6.1% | 7.5% | 4
```

There is one difference worth noting. Each past project counts once in the median, however large it was, so the class gives software and automation, with 9 of 24 projects between them, more weight than their 22.3% share of the approved dollars. Bay 4, by contrast, bundles all four types into one approval, and its outcome will be a dollar-weighted blend. That is why Chapter 8 forecasts Bay 4 component by component as well. For a first forecast, the whole class is a reasonable reference: it describes how this business's capital projects of this mix have turned out, and its 24 records give percentiles that do not hinge on a single project.

## When to use a subclass

A subclass earns its place when the new project is mostly one type and that type behaves clearly differently from the rest. The business adopted a working rule for its own decisions.

```figure
type: decision
title: Choosing between the whole class and a subclass
question: Is the new project mostly one type of work?
caption: The business's working rule, not a standard. Thin subclasses describe the middle reasonably but the tail poorly, so the whole class or an external base rate is kept as a check.
- Yes, with five or more records of that type | Use the subclass | keep the whole class as a check on the tail
- Yes, with fewer than five records | Use the subclass for the middle | take the tail from the whole class or published base rates
- *No, a mix similar to the class | Use the whole class | as for Bay 4's first forecast
- No, a mix unlike the class | Forecast by component | Chapter 8's method
```

A machine replacement on its own would use the machine subclass: seven records, a median of 1.020 and an 80th percentile of 1.046, far tighter than the whole class. A new quality system on its own would use the software subclass for the middle, a median of 1.665, but four records are too few to say much about how bad the worst case could be.

The arithmetic shows how thin it is. With four values, the 80th percentile sits at position 1 + 0.8 × 3 = 3.4 in the sorted list, 40% of the way from the third value, 1.95, to the fourth, 2.60, which gives 1.95 + 0.4 × 0.65 = **2.210**. The subclass's 80th percentile is therefore made of two projects, P21 and P05. If either had finished differently, it would move by tens of points. A subclass's median is reasonably robust with five or more records; its upper percentiles are not, which is why the rule above keeps a broader source for the tail.

## Other ways to cut the class

Type is not the only possible filter. Two others came up in the Bay 4 discussion.

**By date.** If the business's estimating had improved over time, older projects would overstate future overruns. The 13 projects from 2018 onward have a median of 1.180 and an 80th percentile of 1.394, against 1.140 and 1.408 for all 24. There is no sign of improvement. The recent projects are, if anything, slightly worse in the middle, and the whole class stays. A date filter would be justified only by a known change in how projects are run, such as a new estimating method or a new approval process, and only once a few projects under the new method had been completed to show its effect.

**By size.** The exercise at the end of this chapter tests a filter on approved budget, which changes the class more than it first appears to.

Whatever the filter, the rule is that it must be chosen for a reason about the new project, before looking at what it does to the percentiles. A filter chosen because it gives a lower number is not a reference class; it is the inside view wearing the outside view's clothes.

## Published base rates as a cross-check

A small business's own class is small. Published base rates from large databases can check whether its shape is plausible, even though they cannot set its budget. The supplementary material to *How Big Things Get Done* (Flyvbjerg and Gardner, 2023), drawn from the Flyvbjerg database of 16,000+ projects, gives the mean cost overrun, the share of projects with an overrun of 50% or more, and the mean overrun of projects in that tail, measured in real terms against the budget at the final investment decision. For buildings these are 62%, 39% and 206%; for IT, 73%, 18% and 447%; for solar power, 1%, 2% and 50%.

These are mostly large projects worldwide, and the business's projects are small. The business's eight building projects, mostly fit-outs, hardstands and services, have a mean ratio of 1.183, an overrun of 18.3%, far below the published 62% for buildings. Its four software projects have a mean ratio of 1.785, an overrun of 78.5%, close to the published 73% for IT. What the comparison confirms is direction and shape: software and IT projects are prone to very large overruns in a minority of cases, and a small class that shows that tendency is not an aberration. Chapter 6, [Fat tails: when the average misleads](/reados/publications/reference-class-forecasting-by-the-numbers/fat-tails/), uses the same figures to read the tails.

## This time is different

When the class first came to the Bay 4 table, the production engineer's reaction was that Bay 4 was different. The automation integrator was experienced; the machines were from a supplier the business knew; the building was a simple portal frame. Each point was true. Each had also been true, in its own terms, of earlier projects. P14's pallet pool was a standard product, and still overran by 45% on controls integration with the machine. P15's extension was a straightforward building, and still overran by 24% on wet weather and steel prices.

This is **uniqueness bias**: the belief that the features that make a project distinctive also exempt it from the record. Every project is unique in its details. Very few are unique in the ways that drive overrun, which are mostly approvals, interfaces between systems, scope discovered during the work and the performance of third parties. The honest test is to ask which past overruns could not happen to Bay 4, and why, with evidence. If the answer is "none of them", the class applies.

Where there is genuine evidence of a difference, it should be applied as a stated adjustment to a stated part of the forecast, recorded with its reason, so that the outcome can later show whether it was justified. Where the business has no comparable records at all, the class has to be built from structured judgement; [Estimating when data is thin](/reados/collections/project-estimates-schedules-and-costs/estimating-when-data-is-thin/) covers how to gather and record it.

## What to record for each project

The class is easier to choose from, and harder to manipulate, if each record carries enough detail to judge similarity without relying on memory.

```figure
type: checklist
title: Fields in each reference class record
caption: The business's record template. Most fields take a few minutes to fill at project close and are almost impossible to reconstruct years later.
- Identifier, year of decision and type | P01 to P24; machine, building, automation or software
- Short description and main components | so that mixed projects can be split later
- How the estimate was made | quotations, budget prices or allowances, and who prepared it
- Approved budget and planned duration at the decision to proceed | with the source document
- Final cost by year of spending, and actual duration | nominal and in 2026 dollars
- Main causes of variance, in a few words | for example "network rebuild and integration with ERP"
- x Overwrite the approved budget with a later top-up | keep both, with dates
- x Leave a project out because it went badly | every completed project goes in
```

## The error: two one-offs

This is an illustration. When the class was presented, the project lead proposed dropping P05, the first ERP system at 2.60, and P21, the machine monitoring and MES pilot at 1.95. The argument was that both were software disasters with unusual causes, a data migration that ballooned and a network that had to be rebuilt, and that neither said anything about a factory extension.

The effect of dropping them was large. With 22 projects, the median fell from 1.140 to 1.120, the 80th percentile from 1.408 to 1.302 and the 90th percentile from 1.632 to 1.443. For Bay 4, the 80th-percentile budget fell from A$3.379 million to A$3.125 million, A$254,000 less, and the 90th-percentile budget from A$3.917 million to A$3.463 million, A$454,000 less.

```figure
type: compare
title: Bay 4 forecast with and without P05 and P21
rowhead: Measure
cols: All 24 projects | Without P05 and P21
caption: This is an illustration. Dropping the two worst outcomes moved the median a little and the upper percentiles a lot, which is why it was tempting.
- Median ratio | 1.140 | 1.120
- 80th percentile ratio | 1.408 | 1.302
- *Bay 4 budget at the 80th percentile | A$3.379m | A$3.125m
- 90th percentile ratio | 1.632 | 1.443
- Bay 4 budget at the 90th percentile | A$3.917m | A$3.463m
```

The finance manager rejected the proposal on two grounds. First, every overrun has a cause that looks unusual afterwards. P08's kiosk substation, P18's guarding redesign and P14's controls integration were each one-offs in their particulars. Remove every project with an unusual cause and nothing is left but the projects that went well. Second, and decisively, Bay 4 is not just a factory extension. Its A$140,000 software and network component schedules the pallets, monitors the machines and connects them to the business's systems over a new network, which is close to a description of P21. Bay 4 has exactly the kind of component that produced the two outcomes being dropped.

The corrected rule is that a project may leave the class only for a reason about the new project, applied to every past project alike: for example, a forecast for a machine purchase with no software uses the machine subclass, which excludes all four software projects, not just the two worst. For Bay 4, which contains every type, all 24 stay.

## Exercise: a class of large projects

The owner suggests that because Bay 4 is the business's largest project, the class should include only past projects with approved budgets of A$250,000 or more. Which projects remain, what are the median and 80th-percentile ratios, and what Bay 4 budgets do they imply? Should the filter be used?

**Worked answer.** Eleven projects have approved budgets of A$250,000 or more: P01, P03, P07, P10, P13 and P20 (machines), P04 and P14 (automation), and P15, P19 and P22 (buildings). Sorted, their ratios are 0.99, 1.00, 1.02, 1.03, 1.05, 1.08, 1.10, 1.18, 1.24, 1.27 and 1.45. With 11 values the median is the 6th, **1.080**, and the 80th percentile sits at position 1 + 0.8 × 10 = 9, the 9th value, **1.240**. Bay 4's budgets would be 2,400 × 1.08 = **A$2.592 million** at the median and 2,400 × 1.24 = **A$2.976 million** at the 80th percentile, A$403,000 below the whole-class figure. The filter should not be used. It does not select for size so much as for type: it keeps six of seven machine purchases and removes all four software projects, so it describes a machine-heavy project with no software. Bay 4's components are each within the size range of the class, and its software and network component, at A$140,000, is the same size as P21. The filter was chosen because Bay 4 is large, but its effect was to remove the risks Bay 4 actually carries.
