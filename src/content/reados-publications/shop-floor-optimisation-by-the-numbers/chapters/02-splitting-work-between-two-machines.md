---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: splitting-work-between-two-machines
order: 2
title: "Splitting work between two machines"
description: "Split jobs between two identical machines so both finish together: the halving bound, longest-first and differencing rules, exhaustive checks and how many perfect splits to expect."
draft: false
---

The simplest loading problem in a shop is also one of the most common: a list of jobs and two identical machines, and the aim of finishing the list as early as possible. Two press brakes, two lathes, two welders or two inspectors all pose it. Because the machines are identical, the order of jobs on each machine does not matter; only which jobs go on which machine. The best split is the one that makes the two machines' loads as equal as possible.

Mathematicians call this number partitioning, and it is one of the classic hard problems: no method is known that finds the best split quickly for every list. It is also, for the sizes a shop meets, very tractable. This chapter takes the shop's twelve brake jobs from Chapter 1 and splits them by two simple rules, checks every possible split to find the best, estimates how many perfect splits a list should have, and ends with a perfect split that turned out not to be.

## The brake list

This is an illustration. Monday's brake work is twelve jobs. Each time includes the job's tool setup and its bending, measured from recent runs of the same parts.

```figure
type: compare
title: Monday's twelve press brake jobs, longest first
cols: Work | Brake time, min
rowhead: Job
- J1 | EC-600 bodies, 60 off | 212
- J2 | EC-600 doors, 60 off | 187
- J3 | job work: switchboard panels | 164
- J4 | EC-600 gland and roof plates | 141
- J5 | job work: machine guards | 133
- J6 | EC-600 mounting plates | 118
- J7 | job work: cable tray | 96
- J8 | stand frames: gussets | 88
- J9 | job work: brackets | 71
- J10 | EC-600 door stays | 64
- J11 | job work: covers | 47
- J12 | job work: clips | 35
caption: This is an illustration. The twelve jobs total 1,356 minutes. The order of jobs on a brake does not change when the brake finishes, so only the split matters.
```

The cost of a split is its makespan, the finishing time of the busier brake. If the two loads are A and B, with A + B = 1,356, the makespan is the larger of the two, which equals (1,356 + |A − B|) ÷ 2. Minimising the makespan is therefore the same as minimising the difference between the loads. The bound, as Chapter 1 showed, is half the total, 678 minutes, reached only by a split with no difference at all. A second bound, the longest job of 212 minutes, is far lower and plays no part here.

## Rule 1: longest jobs first

The most widely used rule is to sort the jobs from longest to shortest and give each, in turn, to the machine with the lighter load so far. It is called the longest-processing-time rule, or LPT. The logic is that the long jobs are placed while there is still room to balance them, and the short jobs at the end fill the remaining gap.

```figure
type: steps
title: The longest-first rule on Monday's brake list
caption: This is an illustration. At each step the job goes to the brake whose load is lighter; ties go to brake 1.
- J1 212, J2 187 | brake 1: 212; brake 2: 187
- J3 164, J4 141 | brake 2: 351; brake 1: 353
- J5 133, J6 118 | brake 2: 484; brake 1: 471
- J7 96, J8 88 | brake 1: 567; brake 2: 572
- J9 71, J10 64 | brake 1: 638; brake 2: 636
- J11 47, J12 35 | brake 2: 683; brake 1: 673
- * Result | 673 and 683 minutes: makespan 683, gap to the bound 5 minutes
```

A gap of 5 minutes on 678 is well under 1%. For many shops that would end the matter: the remaining 5 minutes are smaller than the uncertainty in the job times themselves. The rule also has a guarantee. For two machines, Graham showed in 1969 that its makespan can never exceed the best possible by more than one-sixth, and on lists of many jobs of mixed sizes it typically does far better, as here.

### Where longest-first goes wrong

The guarantee's worst case is worth seeing, because it shows the rule's blind spot. Take five jobs of 3, 3, 2, 2 and 2 hours. The best split is obvious once seen: the two 3-hour jobs on one machine and the three 2-hour jobs on the other, 6 hours each. Longest-first puts one 3-hour job on each machine, then shares the three 2-hour jobs, which leaves one machine with 3 + 2 + 2 = 7 hours, exactly one-sixth more than the best. The rule cannot see that two jobs of the same size are sometimes better kept together, because it only ever looks at the current loads.

The blind spot matters most when the list has a few large jobs of similar size and little small work to fill the gaps. Shop lists with many small jobs at the end, like Monday's, give the rule plenty of material for the final balancing, and the result is usually within a few minutes of the bound. When the list is short and lumpy, it is worth trying the other rule and, if the list is small enough, checking every split.

## Rule 2: differencing

A cleverer rule, published by Karmarkar and Karp in 1982, works by differences rather than sums. Take the two largest numbers in the list and decide that they will go on different machines. Their combined effect on the difference between the loads is then just their difference, so replace the pair with that single number and repeat. When one number remains, it is the difference between the two machines' loads.

```figure
type: steps
title: Differencing Monday's brake list
caption: This is an illustration. Each line commits two jobs, or two groups, to opposite brakes and carries forward their difference. The final number is the load difference of the split it builds.
- 212 − 187 = 25 | 164 − 141 = 23; 133 − 118 = 15; 96 − 88 = 8; 71 − 64 = 7; 47 − 35 = 12
- Remaining list | 25, 23, 15, 12, 8, 7
- 25 − 23 = 2 | 15 − 12 = 3; 8 − 7 = 1
- Remaining list | 3, 2, 1
- 3 − 2 = 1 | then 1 − 1 = 0
- * Final difference | 0: a perfect split, 678 minutes on each brake
```

Recovering the split from the differences is a bookkeeping step. Each subtraction says that the two items go on opposite brakes, so the subtractions form a chain of "opposite" links that can be followed from J1 to every other job. Following them gives brake 1 the jobs J1, J4, J6, J7, J10 and J11, 212 + 141 + 118 + 96 + 64 + 47 = 678 minutes, and brake 2 the other six, also 678. The differencing rule has found a perfect split, which the longest-first rule missed by 10 minutes of difference.

Differencing tends to beat the longest-first rule because it keeps the large jobs in balance with each other rather than with the running totals, and because its numbers shrink quickly, so the final adjustments are made with small amounts. It is not guaranteed to find a perfect split when one exists, and on some lists it does worse than longest-first. Running both and keeping the better result costs a minute with a spreadsheet.

## Checking every split

Twelve jobs can be split 2¹² = 4,096 ways, which a short program checks in a few milliseconds. The check confirms that perfect splits exist and finds all of them.

```figure
type: compare
title: The four perfect splits of Monday's brake list
cols: Jobs on one brake | Minutes
rowhead: Split
- A | J1, J3, J6, J7, J8 | 678
- B | J3, J4, J6, J7, J8, J9 | 678
- C | J1, J3, J7, J8, J9, J11 | 678
- * D, found by differencing | J1, J4, J6, J7, J10, J11 | 678
caption: This is an illustration. Found by checking all 4,096 splits. The remaining jobs go on the other brake in each case; counting each split once from each brake's side gives 8 of the 4,096.
```

Exhaustive checking is affordable up to about 30 jobs on two machines, where 2³⁰ is about a billion splits and a reasonable program takes minutes. With more jobs, or more machines, it becomes impractical, and the rules and their bounds take over. The four perfect splits also show something useful: when several best plans exist, the planner can choose among them on a second criterion, such as keeping all the EC-600 work on one brake to reduce tool changes, without losing any time.

## How many perfect splits to expect

The landscape picture of Chapter 1 gives a quick estimate of whether perfect splits should exist at all. Give each job a sign, plus for brake 1 and minus for brake 2, and add the signed times. The result is the difference between the loads. Over all possible splits, this signed sum averages zero and has a spread, measured by its standard deviation, equal to the square root of the sum of the squared job times. With twelve or more jobs, its distribution is close to a normal curve.

```figure
type: formula
title: Estimated number of perfect splits
formula: σ = √(a₁² + a₂² + … + aₙ²)
formula: Perfect splits ≈ 2ⁿ⁺¹ ÷ (σ × √(2π))
caption: Valid when job times are whole numbers of the same unit, there are a dozen or more jobs, and the total is even, so that a zero difference is possible. Each split is counted once from each brake's side. The same counting argument appears in the statistical physics of the problem.
- aᵢ | each job's time, in whole units
- n | number of jobs
- σ | spread of the load difference over all splits
- 2ⁿ | number of splits
```

For Monday's list, the squared times sum to 187,834, so σ = 433.4 minutes, and the estimate is 2¹³ ÷ (433.4 × 2.507) = 7.5. The exhaustive check found 8. The estimate is remarkably close, and it explains why perfect splits were available: there are many more splits, 4,096, than possible differences in the range where most splits fall.

The same formula shows when perfect splits vanish. If the job times were recorded to the second instead of the minute, every time would be 60 times larger, σ would be 60 times larger, and the expected number of perfect splits would fall to 0.13. Perfect balance to the second would probably be impossible, though splits within a minute would be as plentiful as before. The practical lesson is to balance to the precision that matters: minutes for a shift's brake work, seconds only when cycle times are seconds long.

## Fixed jobs and other constraints

Real splits usually come with constraints. A job may need a tool that only one brake has, an operator who works only on one machine, or a delivery that forces it to run first. Each fixed job simply starts that machine's load at the job's time; the remaining jobs are then split by the same rules, aiming to equalise the totals including the fixed ones. Constraints that tie jobs together, such as two jobs that share a setup and should run on the same brake, can be handled by merging them into one job for the split.

Fixing jobs rarely costs much when the list has plenty of small work. If J1 and J2, the two largest EC-600 jobs, had to share a brake because they use the same tooling, that brake would start at 399 minutes, and the other ten jobs, 957 minutes, would have to supply 279 minutes to it and 678 to the other. Splits A, C and D above place J1 and J2 apart and would no longer be allowed, but split B leaves J1 and J2 together on the other brake with J5, J10, J11 and J12, 678 minutes, so the constraint costs nothing. Before accepting that a constraint is expensive, check whether it changes the best makespan at all.

When the machines are not identical, for example when one brake is older and slower, the jobs' times differ by machine, and the split must balance the times each machine would take. The longest-first rule adapts: give each job to the machine on which it would finish earliest. Differencing does not adapt easily, and exhaustive checking remains available for small lists.

## A routine for the planner

The methods of this chapter combine into a routine that takes a planner a few minutes with a spreadsheet, and that leaves a record of how good the split is.

```figure
type: steps
title: Splitting a job list between two identical machines
caption: Steps 3 and 4 take seconds in a spreadsheet. Step 5 needs a short macro or script, worthwhile for lists of up to about 25 jobs that recur every week.
- 1. Measure | list every job with its measured time including setup
- 2. Bound | half the total, and the longest job; take the larger
- 3. Longest-first | sort and assign; note the makespan and the gap to the bound
- 4. Differencing | apply it and keep whichever rule gives the smaller makespan
- 5. Check, if small | for up to about 25 jobs, check every split to confirm or improve
- 6. Choose among equals | where several splits tie, prefer fewer tool changes or the operator's preference
```

The record matters as much as the split. A note on the job sheet saying "makespan 683, bound 678" tells the supervisor at a glance that the plan is sound, and gives a baseline against which to judge what happened on the day. When the brakes finish far from the plan, the gap between planned and actual is a measure of how good the job times are, which is exactly the problem in the following error.

## The error: the perfect split that was not

This is an illustration. Encouraged by the perfect split, the planner used split D on the following Monday, expecting both brakes to finish at 678 minutes. Brake 1 finished at 678. Brake 2 finished at 718 minutes, 40 minutes later, and the supervisor asked why the perfect plan had failed.

The shift log showed the cause. Two of brake 2's jobs, J3 and J5, used tooling that had to be fetched from the store and set on the brake, and their listed times of 164 and 133 minutes were bending times only, taken from the estimating sheet; the setups had added 25 and 15 minutes. The other jobs' times included setup. The plan was perfect for the data and wrong for the floor.

```figure
type: compare
title: The brake split before and after correcting the job times
cols: Total, min | Bound, min | Best possible, min | Longest-first rule, min
rowhead: Job times
- As listed, setups missing for J3 and J5 | 1,356 | 678 | 678 | 683
- * Corrected, J3 189 and J5 148 | 1,396 | 698 | 699 | 701
caption: This is an illustration. With the corrected times, the best split found by exhaustive check finishes at 699 minutes, and the longest-first rule at 701. No perfect split exists for the corrected list.
```

The correction was to rebuild the job list from measured times including setup, and to split it again. With the corrected times, the best split, found by checking all 4,096, puts J1, J2, J4, J8 and J9 on one brake, 699 minutes, with the rest on the other, 697 minutes. The longest-first rule gives 701 minutes, within 2 minutes of the best. The lesson is Chapter 1's: optimising inaccurate times produces a precise answer to the wrong question, and a "perfect" plan is the most sensitive of all to a wrong input.

## Exercise: eight jobs on two lathes

This is an illustration. Two identical CNC lathes share eight jobs of 90, 75, 62, 55, 41, 38, 27 and 12 minutes.

1. What is the lower bound on the makespan?
2. What makespan does the longest-first rule give?
3. What does differencing give?
4. With 2⁸ = 256 splits, the best can be checked exhaustively. What is it, and which rule found it?

**Worked answer.**

1. The total is 400 minutes, so the bound is **200 minutes**.
2. Longest-first: 90 to lathe 1, 75 to lathe 2, 62 to lathe 2 (137), 55 to lathe 1 (145), 41 to lathe 2 (178), 38 to lathe 1 (183), 27 to lathe 2 (205), 12 to lathe 1 (195). Makespan **205 minutes**.
3. Differencing: 90 − 75 = 15 and 62 − 55 = 7 leave 41, 38, 27, 15, 12 and 7; then 41 − 38 = 3, 27 − 15 = 12, 12 − 12 = 0 and 7 − 3 = 4, leaving 4 and 0, so the difference is **4**. The loads are 202 and 198 minutes, a makespan of **202 minutes**: 90, 62, 38 and 12 on one lathe, the rest on the other.
4. Checking all 256 splits shows that no split has a difference below 4, so **202 minutes** is the best possible, and differencing found it. The perfect split of 200 does not exist: the jobs' parities and sizes do not allow it, and the formula above, with only eight jobs, is too rough to predict that reliably.
