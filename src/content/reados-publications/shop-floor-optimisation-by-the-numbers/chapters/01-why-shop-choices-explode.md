---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: why-shop-choices-explode
order: 1
title: "Why shop-floor choices explode"
description: "Count the possible plans in common shop-floor choices, describe a plan by its cost and constraints, and use lower bounds, exact rules and heuristics to decide how hard to search."
draft: false
---

A shop's hardest planning problems rarely look hard. Twelve jobs need to go on two press brakes; eight jobs wait for the laser; eleven tasks have to be shared between three assembly stations. Each problem fits on a whiteboard, and a capable planner will produce an answer in minutes. The difficulty is that the number of possible answers grows so fast with the size of the problem that the planner's answer is almost never the best one, and without some arithmetic nobody can tell how far from the best it is.

This chapter counts the possibilities in the running case, introduces the three things every later chapter uses to judge a plan, a cost, a set of constraints and a bound, and sets out the three ways to search: check every plan, use a rule that is known to be best, or use a heuristic and measure it against a bound. It ends with a split of brake work made the obvious way, and what the bound said about it.

## Counting the plans

Choices on a shop floor come in a few shapes. Splitting jobs between machines is an assignment: each job gets one of the machines, so twelve jobs on two machines have 2¹² = 4,096 possible splits, and on three machines 3¹² = 531,441. Ordering jobs on one machine is a permutation: eight jobs can run in 8 × 7 × 6 × … × 1 = 40,320 orders. Choosing projects from a list is a selection: each project is in or out, so eight projects give 2⁸ = 256 possible portfolios. The counts multiply quickly because every added job, task or project multiplies the count, rather than adding to it.

```figure
type: compare
title: Possible plans in the shop's week
cols: Shape of the choice | Number of possible plans
rowhead: Choice
- 12 brake jobs on 2 press brakes | assignment | 4,096
- 15 weld jobs in 3 weld bays | assignment | 14,348,907
- 11 assembly tasks to 3 stations, before precedence | assignment | 177,147
- 8 improvement projects within a budget | selection | 256
- 8 jobs in sequence on the laser | permutation | 40,320
- 10 workstations into two bays of five | equal split | 126
- * 20 jobs in sequence on the laser | permutation | 2,432,902,008,176,640,000
caption: This is an illustration. Each count is the number of candidate plans before constraints remove the infeasible ones. The 10-station split counts each pair of bays once.
```

The last row is the one to remember. A program that checked a million sequences a second would take about 77,000 years to check every order of twenty jobs. No faster computer changes the picture much: each extra job multiplies the time by the number of jobs, so a computer a thousand times faster buys only two or three extra jobs. Problems of this kind are called combinatorial, and their size is what makes them hard, not the difficulty of evaluating any one plan.

Several of the shop's problems are small enough to check completely, and the later chapters do so: 4,096 brake splits, 40,320 laser sequences and 126 bay layouts take a laptop a fraction of a second. Exhaustive checks of this kind are how the book proves which plans are best, and they are worth running whenever the count is below a few hundred million. Above that, the planner needs the other two tools.

## Cost, constraints and bound

A plan is judged by three things, and writing them down is the first step in any of the problems in this book.

```figure
type: layers
title: What every planning problem needs before it can be solved
caption: The bound is the least familiar of the three and the most useful. It says how good any plan could possibly be, so the gap between a plan and the bound limits what further searching can gain.
- Cost | the one number to make smallest: finishing time, idle time, waste, setup minutes, trolley moves
- Constraints | what any plan must respect: precedence, capacity, due dates, budget, machine capability
- Bound | a value no feasible plan can beat, worked out without finding the best plan
- Plan | a particular choice, with its cost checked against the bound
```

The cost must be a single number, because "best" means nothing until it is. On the press brakes, the cost is the time the last job finishes, called the makespan. On the assembly line, it is the longest station time, because that sets the line's pace. In project selection, it is the annual saving, to be made largest rather than smallest, which is the same thing with the sign changed. Where two goals compete, such as finishing early and changing over rarely, one must become the cost and the other a constraint, or the two must be combined with a price on each.

Constraints separate feasible plans from infeasible ones. An assembly task cannot start before the tasks it depends on; a set of projects cannot cost more than the budget; a bar cannot hold more tube than its length. Constraints often cut the count of plans dramatically, but they rarely make the problem easier to search, because the feasible plans are scattered among the infeasible ones.

The bound is a number that no feasible plan can beat, found by relaxing the problem until it is easy. For the two press brakes, the relaxation is to imagine that jobs could be split part-way through: the work would then divide exactly in half, and no real plan can do better. The shop's twelve brake jobs total 1,356 minutes, so no split can finish before 678 minutes. If a plan finishes at 683 minutes, the most any amount of further searching can save is 5 minutes. That one subtraction is often the most valuable calculation in planning, because it tells the planner when to stop.

## The landscape of plans

Statistical physics offers a useful picture. Treat each possible plan as a configuration of a system, its cost as the system's energy, and the best plan as its lowest-energy state. The question of how hard a problem is then becomes a question about the shape of its energy landscape: how many configurations sit near the bottom, and whether they are gathered in one valley or scattered across many.

For the brake problem, the landscape can be drawn completely, because there are only 4,096 splits. The figure groups them by the difference between the two brakes' loads.

```figure
type: bars
title: The 4,096 ways to split the shop's twelve brake jobs, by load difference between the brakes
unit: splits
max: 1600
caption: This is an illustration. Calculated by checking every split. Only 76 splits, under 2%, put the two brakes within 10 minutes of each other; 8 balance them exactly. A split chosen at random is far from balanced.
- 0–10 min | 76
- 11–50 min | 290
- 51–100 min | 364
- 101–200 min | 684
- 201–400 min | 1174
- over 400 min | 1508
```

Most splits are poor, and good ones are rare. That is typical of combinatorial problems and explains why plans made by habit tend to be mediocre: there are vastly more mediocre plans than good ones, so any method that does not deliberately seek the good ones will land among the mediocre. It also explains why good heuristics work: they are designed to head straight for the small region at the bottom of the landscape.

A second lesson from the physics concerns which problems are hard. For many of these problems, typical instances are easy when they are either very loosely or very tightly constrained, and hard in a narrow region between, much as a material changes abruptly at a phase transition. For splitting work between two machines, the controlling quantity is how many different job lengths there are compared with how many jobs. With many short jobs of similar size, perfect splits are plentiful and easy to find; with a few long jobs of very different sizes, the best split is unique and hard to find. Chapter 2 returns to this with a formula that estimates how many perfect splits the shop's jobs have.

## Three ways to search

```figure
type: decision
title: How hard to search for a plan
question: How many plans are there, and does the problem have special structure?
caption: Most real shop problems fall in the bottom row. The bound turns a heuristic from a guess into a measured answer.
- Fewer than a few hundred million | small splits, short sequences, small portfolios | check every plan: the answer is proved best
- A rule is known to be best | single-machine sequencing for flow time or lateness, Chapter 8 | apply the rule: no search needed
- * Too many plans, no exact rule | loading, line balancing, cutting, nesting, cells | use a heuristic, compare it with a bound, then improve by local search if the gap matters
```

Exhaustive search is the gold standard when it is affordable, and a spreadsheet macro or a short script can do it for the small problems in this book. Its results serve another purpose: they are the test against which heuristics are judged.

Exact rules exist for a few problems with special structure. On one machine with no setups, running the shortest jobs first gives the least average time in the shop, and running the jobs in order of due date gives the least maximum lateness. These rules are proved best for every instance, and Chapter 8 uses them.

Heuristics are rules of thumb with a known record: put the longest jobs on first, cut the longest pieces first, take projects in order of saving per dollar. They are fast and usually good. A few come with a worst-case guarantee; most come only with experience. Paired with a bound, any heuristic tells the planner exactly what is at stake: if the heuristic's plan equals the bound, it is proved best; if it is close, further search is not worth the time; if the gap is large, either the heuristic or the bound needs improving, and Chapter 10's local search is the next step.

These problems are hard in a precise sense. Computer scientists have shown that partitioning, bin packing, line balancing and most sequencing problems belong to a class for which no method is known that solves every instance quickly, and most researchers believe none exists, as Garey and Johnson's standard account explains. That is a statement about the worst instances. Real shop problems are usually far from the worst, which is why heuristics and bounds work as well as they do.

## Gaps, ratios and weak bounds

Two numbers describe how good a plan is against its bound. The gap is the plan's cost minus the bound, in the cost's own units: minutes, millimetres or dollars. The ratio is the plan's cost divided by the bound. Gaps are what matter on the floor, because they convert directly into idle time, scrap or money; ratios are what the textbooks quote, because they allow results from problems of different sizes to be compared. A plan 5 minutes above a 678-minute bound has a gap of 5 minutes and a ratio of 1.007, and almost nobody would spend an hour looking for the 5 minutes.

A gap is an upper limit on what can be gained, not a promise. If the bound is weak, the true best plan may sit well above it, and part of the gap can never be closed. The halving bound for the brakes is weak when one job is very long: with a 900-minute job among 1,356 minutes of work, no split can finish before 900 minutes, whatever the halving bound says. The cure is to work out every simple bound that applies and take the largest. For machine loading, that means the larger of the average load and the longest job; for cutting, the larger of the total length divided by the bar length and the number of pieces too long to share a bar; for a budget, the best saving per dollar times the budget.

When a heuristic's plan equals the largest bound, the plan is proved best and the search is over. Chapter 3's weld loading and Chapter 6's bar cutting both reach that happy state. When a gap remains, two questions decide what to do next: is the gap worth more than the time spent closing it, and is the bound or the plan the more likely culprit? Exhaustive search, where it is affordable, answers the second question outright.

## The error: a split made the obvious way

This is an illustration. On a Monday, the planner shared the twelve brake jobs between the two press brakes by working down the job list in the order the orders had arrived, giving each job to whichever brake would be free first. The jobs, with their brake times in minutes including setup, are 96, 47, 212, 64, 133, 35, 187, 71, 118, 164, 88 and 141, which total 1,356 minutes.

```figure
type: steps
title: The Monday split, made in order of arrival
caption: This is an illustration. Each job goes to whichever brake has the lighter load when the job comes up.
- Brake 1 receives | 96, 64, 133, 187 and 164, ending at 644 minutes
- Brake 2 receives | 47, 212, 35, 71, 118, 88 and 141, ending at 712 minutes
- Makespan of the plan | 712 minutes
- Lower bound | 1,356 ÷ 2 = 678 minutes
- * Most that better planning could save | 712 − 678 = 34 minutes
```

The supervisor noticed brake 1 standing idle for over half an hour at the end of the shift while brake 2 finished a long job, and asked whether the split could have been better. The bound answered the question before anyone searched: up to 34 minutes of brake time had been lost. Chapter 2 shows that a split with no gap at all exists, and that a simple rule, putting the longest jobs on first, finds one within 5 minutes of it.

The cause was not carelessness but the order of the list. Assigning jobs as they arrive leaves the long jobs to chance: a 212-minute job placed late can unbalance any split. The fix was a change of habit, sorting the list by length before splitting it, at no cost.

## Data before optimisation

Every method in this book takes its inputs as given, and the answers are only as good as those inputs. Three cautions apply throughout.

```figure
type: checklist
title: Before optimising any shop-floor plan
caption: The open item is the one most often skipped. A method that saves 5 minutes on paper is pointless if the times are wrong by 20.
- x The cost is one number, agreed with the people who live with the plan | makespan, waste, idle time
- x Every constraint is written down, including the unwritten ones | operator skills, tooling, material on hand
- x A bound has been worked out | half the total work, total length ÷ bar length, budget ÷ best ratio
- ? Times and quantities are measured, not remembered | observed cycle and setup times, real lengths and counts
- x The plan is checked against the bound before more effort is spent | the gap is the most that can be gained
```

Times should be measured over several cycles, not taken from the fastest run or from memory, because a planned split built on optimistic times will be unbalanced in practice. Quantities should include scrap and spares. And the plan should be revisited when inputs change, because a plan that was best for Monday's list is rarely best for Tuesday's.

## Exercise: how big and how good?

This is an illustration. Next week the shop has 15 laser jobs to sequence and 10 weld jobs to share between its three weld bays. The weld jobs total 1,260 minutes, and the longest is 300 minutes.

1. How many sequences are there for the laser jobs, and how long would checking them all take at a million sequences a second?
2. How many ways are there to assign the weld jobs to the three bays?
3. What is the lower bound on the weld bays' makespan?
4. A planner's assignment finishes at 455 minutes. What is the most a better assignment could save?

**Worked answer.**

1. 15! = 1,307,674,368,000 sequences. At a million a second, that is about 1.31 million seconds, or about 15 days. A full check is impractical; Chapter 8's rules or a heuristic are needed.
2. 3¹⁰ = 59,049 assignments, few enough to check every one in well under a second.
3. Two bounds apply. Shared perfectly, the work takes 1,260 ÷ 3 = 420 minutes per bay; and no plan can finish before the longest job does, 300 minutes. The bound is the larger, **420 minutes**.
4. At most 455 − 420 = **35 minutes**. Because 59,049 assignments can be checked exhaustively, the planner can find the true best and see how much of the 35 minutes is real; Chapter 3 shows how to do this, and a bound for when a full check is not possible.
