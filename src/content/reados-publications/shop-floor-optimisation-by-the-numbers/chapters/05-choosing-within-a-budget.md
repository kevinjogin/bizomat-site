---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: choosing-within-a-budget
order: 5
title: "Choosing jobs and projects within a budget"
description: "Choose the projects or jobs that give the most benefit within a budget or capacity: the knapsack problem, ratio and largest-first rules, the fractional bound and exact table methods."
draft: false
---

Every year a shop has more good ideas than money. The press brakes would benefit from quick-change tooling, the laser from better nesting software, the weld bays from fixtures, the store from racking. Each project has a cost and an expected annual saving, and the budget will not stretch to all of them. The same problem appears with capacity rather than money: a week's spare laser hours, and more job offers than will fit, each with its own hours and contribution. Choosing the subset with the greatest total benefit within the limit is the knapsack problem, named after a hiker packing the most valuable load a pack will hold.

This chapter values one project with the BIZOMAT set-up reduction tool, chooses the shop's portfolio by three rules, checks every portfolio to find the best, bounds the answer with the fractional relaxation, and introduces the table method that solves larger cases. Its error is a saving counted at its full value when only part of it was real.

## The candidate projects

This is an illustration. The shop's improvement budget for the year is A$60,000 excluding GST. Eight projects have been proposed, each with an installed cost and an expected annual saving estimated by the person proposing it.

The first, quick-change tooling for the press brakes, was valued with the [set-up reduction value tool](/tools/setup-worth/). The tool takes the current and target set-up times, the number of changeovers a year, the combined hourly cost of the machine and operator and the investment, and reports the minutes saved per changeover, the hours released a year, their annual value and the payback. The brakes change tools about 600 times a year between them; quick-change tooling is expected to cut a typical set-up from 45 minutes to 15, at a combined cost of A$110 an hour, for an investment of A$18,000. The tool reports 30 minutes saved per changeover, 300 hours released a year, an annual value of A$33,000 and a payback of 0.55 years, and it adds two checks to verify: that the target set-up time has been proven in a trial, and that the released time is actually used.

```figure
type: compare
title: The eight candidate projects
cols: Cost, A$ ex GST | Annual saving, A$ | Saving per dollar
rowhead: Project
- P1 Quick-change brake tooling | 18,000 | 33,000 | 1.83
- P2 Nesting software upgrade | 12,000 | 14,000 | 1.17
- P3 Weld fixture set | 9,500 | 8,000 | 0.84
- P4 Saw length stop and readout | 7,000 | 6,500 | 0.93
- P5 Powder-line hook racks | 15,000 | 11,000 | 0.73
- P6 Assembly tool balancers | 6,500 | 4,800 | 0.74
- P7 Sheet store racking | 22,000 | 15,500 | 0.70
- P8 Forklift attachment | 11,000 | 7,200 | 0.65
caption: This is an illustration. The eight projects cost A$101,000 in total, against a budget of A$60,000. Savings are the proposers' estimates; P1's comes from the set-up reduction tool.
```

All eight cost A$101,000, so roughly two-fifths of the proposals must wait. There are 2⁸ = 256 possible portfolios, of which 174 fit within the budget.

## Three rules

Three rules of thumb are commonly used, sometimes without being recognised as rules.

```figure
type: compare
title: Portfolios chosen by three rules
cols: Projects chosen | Spent, A$ | Annual saving, A$
rowhead: Rule
- Cheapest first | P6, P4, P3, P8, P2 | 46,000 | 40,500
- Best saving per dollar first | P1, P2, P4, P3, P6 | 53,000 | 66,300
- Largest saving first | P1, P7, P2, P4 | 59,000 | 69,000
- * Best of all 256 | P1, P2, P4, P5, P6 | 58,500 | 69,300
caption: This is an illustration. Each rule takes projects in its order, skipping any that would exceed the A$60,000 budget. The best portfolio was found by checking every combination.
```

Cheapest first is the instinct of a cautious committee: approve the small items, because they are easy to justify. It is the worst rule here by a wide margin, because cheap projects are not necessarily good ones, and it leaves the best project of all, P1, unfunded until it runs out of cheap ones.

Best saving per dollar first, the ratio rule, is the one the textbooks recommend, and Dantzig showed in 1957 that it gives the best possible answer if projects could be bought in fractions. It does well, but here it stops at A$53,000 because the next projects by ratio, P5 at A$15,000 and P7 at A$22,000, do not fit in the A$7,000 left, and the unspent money earns nothing.

Largest saving first happens to do better here, A$69,000, because it fills the budget more completely, but that is luck: it would choose a A$59,000 project saving A$40,000 over three A$19,000 projects saving A$30,000 each.

## The best portfolio and a bound

With 256 portfolios, checking every one takes a spreadsheet seconds. The best is P1, P2, P4, P5 and P6: A$58,500 spent, A$69,300 a year saved. It differs from the ratio rule's choice by swapping the weld fixture set, P3, for the hook racks, P5, which uses more of the budget for a larger saving.

The fractional bound says how far any portfolio could be from the best without checking them all. Take projects in ratio order until the next does not fit, then imagine buying the fraction of it that the remaining budget allows. No real portfolio can beat this, because fractional purchase is a relaxation of the real problem.

```figure
type: steps
title: The fractional bound on the year's saving
caption: This is an illustration. The bound says that no combination of whole projects within A$60,000 can save more than A$71,433 a year; the best found saves A$69,300, within 3% of it.
- Take P1, P2, P4, P3, P6 in ratio order | A$53,000 spent, A$66,300 saved
- Next in ratio order is P5 | A$15,000, does not fit in the A$7,000 left
- Buy 7,000 ÷ 15,000 = 0.467 of P5 | adds 0.467 × A$11,000 = A$5,133
- * Bound | A$71,433 a year
```

The gap between the best portfolio and the bound, A$2,133, is the most that any cleverer method could find, and since the best has been found by checking every portfolio, it is known to be zero in practice. On larger lists where exhaustive checking is impossible, the bound is what tells the committee whether a heuristic's choice is good enough.

## A flat landscape near the top

Looking at the best few portfolios is as instructive as finding the best one.

```figure
type: bars
title: The six best portfolios within A$60,000, by annual saving
unit: A$
max: 72000
- * P1 P2 P4 P5 P6 | 69300
- P1 P2 P4 P7 | 69000
- P1 P2 P3 P4 P8 | 68700
- P1 P2 P6 P7 | 67300
- P1 P2 P3 P6 P8 | 67000
- P1 P2 P3 P4 P6 | 66300
caption: This is an illustration. Six portfolios lie within A$3,000 a year of each other, and all contain P1 and P2. The bound is A$71,433.
```

Every one of the six contains P1 and P2, which are clearly worth doing, and the rest differ in ways worth a few thousand dollars a year. That is typical of knapsack problems: the landscape near the top is flat, with many near-best answers. It means two things for a committee. The choice of the last few projects is not worth a long argument, because the difference is smaller than the uncertainty in the savings themselves. And the choice can be made on other grounds, such as risk, strategic fit or the capacity of the people who must deliver the projects, at little cost in expected saving.

## Savings that are uncertain or linked

The knapsack arithmetic treats each saving as a known number and each project as independent of the others. Neither is quite true, and both deserve a few minutes before the committee signs off.

Savings are estimates, usually made by the person who wants the project, and they vary in quality. A saving built from measured set-up times and a counted number of changeovers is more reliable than one built from a supplier's brochure. A simple way to respect this is to discount each saving by a confidence factor before optimising: perhaps 90% for a saving built from the shop's own measurements, 60% for one from a supplier's claim, and less for a saving that depends on winning new work. The optimisation then chooses on expected value rather than on enthusiasm. Because the landscape near the top is flat, the discounting often changes the last project chosen and rarely the first.

Projects also interact. Some are mutually exclusive: two different nesting packages solve the same problem, and buying both does not double the saving. Some depend on others: the nesting upgrade may save more if the sheet store racking makes the right sheets easy to reach, and the hook racks only save money if the powder line has the throughput to use them. Some share a scarce resource other than money, such as the one maintenance fitter who must install them.

```figure
type: checklist
title: Before optimising a project portfolio
caption: The open item is the one this chapter's error turned on. A saving that becomes idle time is not a saving.
- x Every cost includes installation, training and lost production during installation | the cost the business will actually pay
- ? Every saving says where released time or material goes | output, smaller batches, avoided overtime
- x Savings are discounted for confidence | measured, supplier's claim or hoped-for
- x Exclusive projects are marked so only one can be chosen | two nesting packages, two racking schemes
- x Dependent projects are combined or linked | a project that only pays with another is chosen with it
- x Scarce people are a second constraint | the fitter's hours, the engineer's design time
```

Each of these fits the methods of this chapter. Exclusive projects are handled by rejecting any portfolio that contains both; dependent projects by merging them into one combined project with the combined cost and saving; a second scarce resource by adding a second budget that every portfolio must also respect. Exhaustive checking handles all of them without change. The table method handles a second budget by adding a second dimension to the table, which multiplies its size but remains practical for small budgets.

## Larger lists: the table method

For fifty projects, or a capacity problem with hundreds of candidate jobs, exhaustive checking is impossible: 2⁵⁰ is about a thousand million million. A method called dynamic programming solves the knapsack problem exactly in a time proportional to the number of items multiplied by the number of budget steps, which is usually small.

The idea is to build a table. Divide the budget into steps, here A$500, giving 121 columns from A$0 to A$60,000. Take the projects one at a time. For each budget column, record the best saving achievable with the projects considered so far: either the best without the new project, or the new project's saving plus the best achievable with the remaining budget after paying for it. After the eighth project, the last column holds the best saving within A$60,000: A$69,300, the same answer as the exhaustive check, from 8 × 121 = 968 small calculations instead of 256 full portfolios. For fifty projects in A$500 steps, it would be 50 × 121 = 6,050 calculations, against a thousand million million portfolios.

The method needs costs that are whole multiples of the step. Real costs can be rounded up to the step, which keeps every chosen portfolio within the budget at the price of occasionally missing one that would just have fitted. A spreadsheet can implement the table directly, one row per project.

## Capacity instead of money

The same arithmetic chooses jobs to fill spare capacity. This is an illustration. If the laser has 22 spare hours next week and six job offers with known laser hours and contributions, the hours are the cost, the contribution is the saving, and the 22 hours are the budget. The ratio rule ranks jobs by contribution per laser hour, the bound tells the sales manager the most the week could earn, and checking 2⁶ = 64 combinations finds the best. The difference from the project case is urgency: job offers must be answered quickly, and a well-chosen rule that is within a few per cent of the bound is usually the right tool.

## Keeping score after the decision

A portfolio is a forecast, and the only way to make the next year's forecast better is to check this year's. A short review twelve months after installation compares each project's realised saving with its estimate: set-up times actually achieved, hours actually released and used, scrap actually avoided. The review is not about blame. Its purpose is to learn which kinds of estimate run high, so that next year's confidence factors are based on the shop's own record rather than on guesses. The questions worth asking of each kind of estimate are simple: were savings from measured time reductions close to their estimates, were savings from software and better information as hard to pin down as expected, and did the projects nobody argued about, the ones near the top of every rule's list, deliver as promised? The record also protects good projects in the next round, because a committee that has seen last year's quick-change tooling pay back as forecast will trust the next proposal built the same way.

## The error: a saving counted in full

This is an illustration. After the portfolio had been approved, the operations manager reviewed P1's business case and asked where the 300 released brake hours would go. The set-up reduction tool's own check had flagged the question: released time is valuable only if it becomes useful production, smaller batches or avoided overtime. The brakes were not the shop's bottleneck. Chapter 2's brake loads ran well inside a shift, and much of the released time would simply become idle time.

The review estimated that about 40% of the released hours would be used, through smaller batches that reduced work in progress and through avoided Saturday shifts in busy months. P1's real saving was therefore about 0.4 × A$33,000 = A$13,200 a year, and its payback 1.36 years rather than 0.55.

```figure
type: compare
title: The portfolio with P1's saving corrected to A$13,200
cols: Projects chosen | Annual saving, A$
rowhead: Method
- Best saving per dollar first | P2, P4, P3, P6, P1 | 46,500
- * Best of all 256 | P1, P2, P4, P5, P6 | 49,500
- Fractional bound | | 51,633
caption: This is an illustration. The best portfolio is unchanged, but its saving falls by A$19,800 a year. The ratio rule now ranks P1 fifth rather than first.
```

The correction left the best portfolio unchanged, which was a relief, but cut the year's expected saving from A$69,300 to A$49,500. The lesson is that optimisation amplifies the quality of its inputs: a choice among projects is only as good as each project's saving, and savings expressed as released hours must be checked against whether the hours will be used. The shop now asks every proposer to state where released time goes.

## Exercise: a smaller budget

This is an illustration. Suppose the budget were cut to A$45,000, with the original savings.

1. Which projects does the ratio rule choose, and what do they save?
2. What is the fractional bound?
3. An exhaustive check finds the best portfolio saves A$58,300. Is the ratio rule's choice the best?

**Worked answer.**

1. In ratio order: P1 (A$18,000), P2 (A$30,000 cumulative), P4 (A$37,000); P3 at A$9,500 would make A$46,500, too much, so it is skipped; P6 (A$43,500); P5, P7 and P8 do not fit. The choice is **P1, P2, P4 and P6**, costing A$43,500 and saving 33,000 + 14,000 + 6,500 + 4,800 = **A$58,300** a year.
2. After P1, P2 and P4, A$37,000 is spent and A$8,000 remains; the next by ratio is P3, of which 8,000 ÷ 9,500 = 0.842 could be bought, adding 0.842 × 8,000 = A$6,737. The bound is 53,500 + 6,737 = **A$60,237**.
3. Yes. The ratio rule's A$58,300 equals the best found by checking every portfolio, so it is optimal, and no portfolio can exceed the bound of A$60,237. Here the ratio rule's leftover budget, A$1,500, was too small to matter.
