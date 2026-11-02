---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: loading-several-machines
order: 3
title: "Loading several machines"
description: "Load jobs onto three or more identical machines: the two lower bounds, the longest-first rule and its guarantee, its worst case, jobs that arrive during the day, and a capacity check over the week."
draft: false
---

With more than two machines, splitting work becomes loading: each job goes to one of several identical machines, and the aim is again to finish the whole list as early as possible. Three weld bays, four CNC mills, five inspectors or six operators on a kitting bench all pose the same problem. The count of possible plans grows faster, as the number of machines raised to the number of jobs, and the differencing trick of Chapter 2 no longer applies in its simple form. The longest-first rule does, and with it come two bounds that frequently prove its plan the best possible.

This chapter loads the shop's three weld bays, proves the result optimal with a bound, shows the rule's worst case, deals with jobs that arrive during the day, and checks the bays' capacity over a week with the KEVOS® capacity tool. Its error is a loading made in order of arrival.

## The weld queue

This is an illustration. The weld queue for Tuesday and Wednesday morning holds fifteen jobs, each with a measured time in minutes including fit-up, tacking, welding and cleaning. The shop has three weld bays, each with a qualified welder and a similar set-up, so any job can go to any bay.

```figure
type: compare
title: The weld queue, longest first
cols: Work | Time, min
rowhead: Job
- W1 | EC-600 floor stands, 6 off | 185
- W2 | job work: mezzanine handrail | 170
- W3 | job work: trailer drawbar | 152
- W4 | EC-600 floor stands, 5 off | 140
- W5 | job work: hopper | 128
- W6 | job work: machine base | 121
- W7 | EC-600 wall brackets, 120 off | 110
- W8 | job work: gates | 96
- W9 | job work: frames | 90
- W10 | EC-600 cable tray supports | 84
- W11 | job work: repairs | 75
- W12 | job work: guards | 62
- W13 | job work: brackets | 55
- W14 | job work: lifting lugs | 48
- W15 | job work: tabs | 40
caption: This is an illustration. The fifteen jobs total 1,556 minutes, a little over 8½ hours of work for each of the three bays.
```

There are 3¹⁵ = 14,348,907 ways to assign the fifteen jobs to the three bays, about 2.4 million once the interchangeable bays are allowed for. That is within reach of a computer search, but not of a planner, and with twenty jobs the count passes three billion.

## Two lower bounds

Two simple facts bound every possible plan. First, the work cannot be shared more evenly than equally, so the makespan is at least the total divided by the number of machines. Second, no plan finishes before its longest job does. The bound is the larger of the two.

```figure
type: formula
title: Lower bound on the makespan of identical machines
formula: Bound = the larger of (total work ÷ m) and (longest job)
caption: When the times are whole minutes, the first term can be rounded up to the next whole minute, because no machine can finish part-way through a minute's worth of a job that does not exist.
- m | number of identical machines
- total work | sum of all job times, including setup
- longest job | the single longest job time
```

For the weld queue, the total is 1,556 minutes and m is 3, so the first term is 518.7 minutes, rounded up to 519; the longest job, 185 minutes, is far below it. No plan can finish before **519 minutes**.

## Longest first on three bays

The longest-processing-time rule is the same as in Chapter 2: sort the jobs longest first, and give each to the bay with the lightest load so far.

```figure
type: steps
title: Loading the weld queue longest first
caption: This is an illustration. Loads are given as bay 1, bay 2, bay 3 after each group of jobs.
- W1 to W3 | one each: 185, 170, 152
- W4 140, W5 128, W6 121 | to bays 3, 2 and 1: 306, 298, 292
- W7 110, W8 96, W9 90 | to bays 3, 2 and 1: 396, 394, 402
- W10 84, W11 75, W12 62 | to bays 2, 1 and 3: 471, 478, 464
- W13 55, W14 48, W15 40 | to bays 3, 1 and 2: 519, 518, 519
- * Result | makespan 519 minutes, equal to the lower bound
```

The plan finishes at 519 minutes, exactly the bound. Since no plan can beat the bound, this plan is proved the best possible, without searching any of the other 14 million. That is the happy outcome Chapter 1 promised: a quick heuristic, a quick bound, and a proof that no more effort is needed. Bay 1 gets W1, W6, W9, W11 and W14; bay 2 gets W2, W5, W8, W10 and W15; bay 3 gets W3, W4, W7, W12 and W13.

The proof is worth more than it appears. When the welders ask whether the job split could be fairer, the planner can show that every bay finishes within a minute of the others and that no split could finish earlier. And when an urgent job arrives, the planner knows exactly how much slack each bay has: none, so the new job will extend the makespan by at least its own time divided by three.

## The rule's guarantee and its worst case

For m identical machines, Graham proved in 1969 that the longest-first rule's makespan is never more than (4/3 − 1/(3m)) times the best possible. For three machines, that factor is 11/9, about 1.22. The guarantee is tight: there are job lists on which the rule does exactly that badly.

```figure
type: compare
title: The longest-first rule's worst case on three machines
cols: Machine 1 | Machine 2 | Machine 3 | Makespan
rowhead: Plan
- Longest first | 5 + 3 + 3 = 11 | 5 + 3 = 8 | 4 + 4 = 8 | 11
- * Best possible | 5 + 4 = 9 | 5 + 4 = 9 | 3 + 3 + 3 = 9 | 9
caption: Seven jobs of 5, 5, 4, 4, 3, 3 and 3 hours. The rule puts the two 5s and one 4 on separate machines, then cannot place the three 3s well. Its makespan is 11 ÷ 9 = 1.22 times the best, the guarantee's limit.
```

The worst case has the same signature as Chapter 2's: a short list of jobs of similar sizes, with no small work to fill the gaps. The rule's plans are excellent when the list has many jobs and a tail of short ones, and merely good when the list is short and lumpy. In the second case, the bound shows the gap: here, the bound is the total 27 hours ÷ 3 = 9 hours, and the rule's 11 hours is 2 hours above it, which prompts a search that finds the 9-hour plan.

## Improving a plan that misses the bound

When the rule's plan sits above the bound, a few minutes of improvement by hand usually closes most of the gap. The method is a simple local search, which Chapter 10 develops in general. Look at the busiest machine, and try two kinds of change: move one of its jobs to another machine, or swap one of its jobs with a shorter job on another machine. Accept any change that lowers the makespan, or that keeps it the same while lowering the load on the busiest machine, and repeat until no change helps.

In the worst-case example, the machine with 5 + 3 + 3 = 11 hours is the busiest. Moving either of its 3-hour jobs to another machine gives that machine 11 hours, so no single move helps. Swapping is more powerful. Swapping the 5 on the busy machine with a 4 from the 4 + 4 machine gives 4 + 3 + 3 = 10, 5 + 3 = 8 and 5 + 4 = 9: the makespan falls to 10. The busiest machine now holds 4 + 3 + 3; swapping its 4 with the 3 on the 5 + 3 machine gives 3 + 3 + 3 = 9, 5 + 4 = 9 and 5 + 4 = 9. Two swaps have reached the best plan, which equals the bound of 27 ÷ 3 = 9 hours, so the search can stop.

That small example shows both the value and the limit of local search. Moves alone stalled at the rule's plan; swaps, which change two machines at once, found a path to the best. On larger lists there are plans from which no single move or swap helps even though better plans exist, which is the trap Chapter 10's simulated annealing is designed to escape. For a fifteen-job weld queue, the practical answer is simpler: when the rule and a few swaps leave a gap of more than a few minutes, run an exhaustive or branch-and-bound search on a computer, which for fifteen jobs and three bays takes seconds.

## Jobs that arrive during the day

A weld queue is seldom fixed for a whole day. Jobs arrive, are expedited or are held for material, and the planner must place each one as it comes without knowing what follows. The natural rule is to give each arriving job to the bay that will be free first. This is called list scheduling, and its guarantee, also due to Graham, is weaker: its makespan is never more than (2 − 1/m) times the best, 1.67 times for three bays.

The weaker guarantee reflects the missing information. A long job that arrives last can land on a bay that is already full, and nothing can be done about it once the other bays are committed. Two practical habits recover most of the loss. The first is to release work to the bays in batches, sorted longest first, rather than one job at a time; a batch of half a day's work loses little. The second is to keep the longest uncommitted jobs at the head of the queue, so that late arrivals tend to be short and easy to fit.

## Machines that are not identical

When the machines differ, a job's time depends on where it goes. A newer weld bay with a positioner may weld a stand in 25 minutes that takes 32 in an older bay. The longest-first rule adapts by giving each job to the machine on which it would finish earliest, counting that machine's own time for the job. The bound becomes harder to state: a safe version uses each job's shortest time anywhere for the total, divided by the number of machines. That bound is weak when some machines are much faster than others, and the gap then overstates what can be gained. For small lists, exhaustive search remains the reliable check.

### Aims other than finishing early

Makespan is not the only sensible cost. A shop may prefer to keep each welder on similar work so that skills and fixtures stay in one bay, to give the most experienced welder the critical jobs, or to finish the urgent jobs first even if the whole queue ends later. These preferences are best written as constraints, such as fixing the EC-600 stands to the bay with the stand fixture, before the remaining jobs are loaded by the rule. The bound is then recalculated with the fixed jobs included, and the plan is again judged by its gap. A constraint that costs only a few minutes against the bound is usually worth keeping; one that costs an hour deserves a conversation.

## A capacity check for the week

Loading answers "who does what today". Capacity answers "can the bays do this week's work at all", and it should come first, because no loading can fix a week that is overloaded. The [capacity check tool](/tools/capacity/) estimates the practical output of a set of parallel stations from the available hours per station, the number of stations, the cycle time per unit and a realistic efficiency, and compares it with demand.

This is an illustration. Next week the weld bays must produce 180 EC-600 floor stands, which take 28 minutes each in a bay, around their job work. Treating the stands alone, with 37.5 hours a week per bay, three bays and a realistic efficiency of 85% for allowances, interruptions and handling, the tool reports a practical capacity of about 205 stands for the week and a utilisation of 87.8% for the 180 required, a buffer of about 25 stands. It flags the result as tight capacity: above the 85% at which it recommends planning, below the 100% at which demand cannot be met.

```figure
type: bars
title: Weld bay utilisation for 180 floor stands in a week, by efficiency allowed
unit: %
max: 120
caption: This is an illustration. Capacity = 37.5 h × 60 × 3 bays × efficiency ÷ 28 min. Above 100%, the week cannot be done in standard hours; the 85% planning level leaves room for breakdowns and rework.
- 95% efficiency | 78.6
- 90% efficiency | 83.0
- * 85% efficiency | 87.8
- 80% efficiency | 93.3
- 75% efficiency | 99.6
```

The figure shows why the efficiency figure matters more than the loading rule. Between 85% and 75% efficiency, the week goes from tight to barely possible. Before relying on the plan, the supervisor checked the last month's actual weld hours against standard times and found an efficiency of 82%, which put the week at 91% utilisation, and arranged four hours of Saturday work as a buffer. The tool also reminds the user to use measured cycle times at the constraint, including handling, rather than ideal times.

## The error: loading in order of arrival

This is an illustration. Before the longest-first habit took hold, the weld queue was loaded in the order the jobs had been released from the office: 96, 40, 185, 62, 128, 75, 170, 55, 110, 152, 48, 121, 84, 140 and 90 minutes, each to the bay that would be free first.

```figure
type: compare
title: The weld queue loaded in order of release, against longest first
cols: Bay 1, min | Bay 2, min | Bay 3, min | Makespan, min
rowhead: Loading
- In order of release | 556 | 468 | 532 | 556
- * Longest first | 519 | 518 | 519 | 519
caption: This is an illustration. Same fifteen jobs, same three bays. Loading in release order left bay 2 idle for 88 minutes while bay 1 finished; the gap to the bound was 37 minutes.
```

Bay 2's welder was idle for an hour and a half at the end of Wednesday morning, and bay 1 ran 37 minutes past the time the whole queue could have been finished. The cause is visible in the release order: the 152-minute and 140-minute jobs came late, when the bays were already nearly balanced, and landed as large overhangs. The bound, 519 minutes, showed the planner that 37 minutes had been lost, and the longest-first rule recovered all of them. The change of practice was to collect the morning's released jobs, sort them and load them as a batch, with genuine rush jobs placed first.

## Exercise: nine jobs in three bays

This is an illustration. Nine weld jobs of 120, 110, 95, 90, 80, 70, 60, 45 and 30 minutes are to be loaded into the three bays.

1. What is the lower bound on the makespan?
2. What makespan does the longest-first rule give?
3. An exhaustive check of all 3⁹ = 19,683 assignments finds the best. Show a plan that achieves 235 minutes, and say how far longest-first was from it.

**Worked answer.**

1. The total is 700 minutes, so 700 ÷ 3 = 233.3, rounded up to 234; the longest job, 120, is smaller. The bound is **234 minutes**.
2. Longest first: 120, 110 and 95 go one to each bay; 90 joins the 95 bay (185), 80 the 110 bay (190), 70 the 120 bay (190); 60 joins the lightest, the 185 bay (245); 45 joins a 190 bay (235); 30 joins the other 190 bay (220). Makespan **245 minutes**.
3. One best plan is 120 + 110 = 230 in bay 1, 95 + 80 + 60 = 235 in bay 2 and 90 + 70 + 45 + 30 = 235 in bay 3: makespan **235 minutes**. The search confirms that no plan reaches 234, so 235 is the best possible, and longest-first was **10 minutes** worse. The rule went wrong when it placed the 60-minute job on the 185-minute bay, which was lightest at that moment but left no good home for the later jobs; this short, lumpy list is the kind on which the rule is weakest.
