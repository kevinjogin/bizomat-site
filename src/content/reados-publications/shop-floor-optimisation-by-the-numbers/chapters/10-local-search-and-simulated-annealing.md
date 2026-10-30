---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: local-search-and-simulated-annealing
order: 10
title: "Local search and simulated annealing"
description: "Solve problems too large for exhaustive search: moves and local optima, the simulated annealing rule, choosing a temperature schedule, penalties for constraints and when to stop."
draft: false
---

The earlier chapters solved their problems in one of three ways: by checking every plan, by an exact rule, or by a heuristic whose plan met a bound. Many real problems allow none of these. A three-week laser schedule with forty jobs, eight materials and due dates has no exact rule and far too many sequences to check, and its bound is too weak to prove any plan good. For problems like this, the general-purpose tool is local search: start from any reasonable plan, change it a little, keep the change if it helps, and repeat. Simulated annealing is a version of local search that occasionally keeps a change that makes things worse, so that it can escape the traps that stop plain local search.

This chapter sets out local search in general, shows how it gets trapped, introduces simulated annealing and its temperature schedule, and runs it on Chapter 9's layout problem, where the true best is known and the method's success can be measured. It covers constraints, stopping rules and when to buy software instead, and its error is an annealing run that was never warm.

## Neighbourhoods and moves

Local search needs three things: a way to describe a plan, a cost for each plan, and a set of small changes, called moves, that turn one plan into a neighbouring plan. The neighbourhood of a plan is the set of plans one move away. The choice of move is the most important design decision, because it decides which plans can reach which.

```figure
type: compare
title: Moves for the problems in this book
cols: Plan | Natural moves | Neighbours of one plan
rowhead: Problem
- Machine loading, Chapters 2 and 3 | which machine each job is on | move one job; swap two jobs on different machines | up to jobs × machines
- Line balancing, Chapter 4 | which station each task is at | move one task to an adjacent station, if precedence allows | about tasks × 2
- Bar cutting, Chapter 6 | which pieces on which bar | move or swap pieces between bars | pieces × bars
- Sequencing, Chapter 8 | the order of jobs | swap two adjacent jobs; move one job elsewhere; reverse a stretch | about jobs²
- Cell layout, Chapter 9 | which bay each station is in | swap two stations between bays | 25 for two bays of five
caption: A good move is small enough to evaluate quickly and rich enough that any plan can be reached from any other by a chain of moves.
```

Plain local search, also called descent or hill-climbing, tries the moves from the current plan and makes one that lowers the cost, either the first found or the best of all. It stops at a local optimum, a plan none of whose neighbours is better. Chapter 9 showed what that means in practice: from 35 of the 126 starting layouts, swap-based descent stopped at a layout with 42 moves a day between bays, when one with 32 existed.

## Why descent gets trapped

The trap layout in Chapter 9 put the laser, deburring, brake 1, the saw and weld bay 1 together. Every one of its 25 swaps raises the cut, by between 1 and 61 moves a day, so descent cannot leave it. But the best layout is only two swaps away. Swapping the saw for brake 2 raises the cut from 42 to 43, a step uphill of just one move; then swapping weld bay 1 for the assembly line lowers it from 43 to 32. The ridge between the trap and the best is one move a day high, and descent cannot cross even that, because it never accepts a step uphill.

```figure
type: steps
title: The two-swap path out of Chapter 9's trap layout
caption: This is an illustration. Descent refuses the first swap because it raises the cost; simulated annealing accepts it with a probability that depends on the temperature.
- Trap | LA, DB, B1, SW, W1 together: 42 moves a day between bays
- Swap SW for B2 | LA, DB, B1, B2, W1: 43, one move uphill
- * Swap W1 for AS | LA, DB, B1, B2, AS: 32, the best layout
```

Restarting from several random layouts is one cure, and it works well when traps are few, as here. On large problems, traps are many and the best plans lie in narrow valleys, and random restarts rarely land near them. The better cure is to let the search cross ridges.

## Simulated annealing

When a metal is annealed, it is heated and cooled slowly, so that its atoms have time to settle into a low-energy, well-ordered arrangement; cooled quickly, it freezes in a disordered, higher-energy state. In 1953 Metropolis and colleagues gave a rule for simulating a physical system at a temperature: propose a small change; if it lowers the energy, accept it; if it raises the energy by Δ, accept it with probability e^(−Δ/T). In 1983 Kirkpatrick, Gelatt and Vecchi proposed using the same rule on optimisation problems, with the plan's cost as the energy and the temperature lowered slowly, and called the method simulated annealing.

```figure
type: formula
title: The simulated annealing acceptance rule and cooling schedule
formula: If Δ ≤ 0, accept the move
formula: If Δ > 0, accept with probability e^(−Δ ÷ T)
formula: After each move, T ← α × T
caption: The temperature T is in the same units as the cost. At high T almost every move is accepted and the search wanders widely; at low T only improvements are accepted and the search becomes descent.
- Δ | change in cost caused by the proposed move
- T | the current temperature
- α | cooling factor, a little below 1, such as 0.98
```

The temperature sets how large an uphill step the search will usually take. A step of 10 moves a day is accepted with probability e^(−10/20) = 0.61 at a temperature of 20, 0.14 at a temperature of 5, and 0.00005 at a temperature of 1. Early in the run, the search roams freely across ridges; as it cools, it settles into the deepest valley it has found; at the end, it is plain descent. The method always records the best plan seen during the run, because the final plan may be slightly worse than one passed earlier.

## Annealing the cell layout

This is an illustration. The layout problem of Chapter 9 makes a good test, because all 126 layouts have been checked and the best is known. Each run below starts from the trap layout at 42, proposes a random swap of one station from each bay at every step, and applies the acceptance rule. Each schedule was run 20 times with different random choices.

```figure
type: compare
title: Simulated annealing from the trap layout, 20 runs of each schedule
cols: Starting temperature | Cooling factor | Steps | Runs ending at the best, 32
rowhead: Schedule
- No temperature: plain descent | 0.01 | 1.00 | 200 | 0 of 20
- Fast cooling, short run | 20 | 0.90 | 60 | 5 of 20
- Moderate cooling | 20 | 0.95 | 200 | 14 of 20
- * Slow cooling | 20 | 0.98 | 200 | 19 of 20
- Hotter start, longer run | 40 | 0.98 | 300 | 16 of 20
caption: This is an illustration. The runs that missed ended at the trap, 42, or at nearby layouts of 35 to 43. Plain descent never left the trap. Results from a random process vary from one set of runs to another.
```

Plain descent never escaped, as expected. Annealing escaped in most runs, and slow cooling did best: with a starting temperature of 20 and a cooling factor of 0.98, 19 of 20 runs ended at the best layout. After 200 steps, that schedule's temperature had fallen to 20 × 0.98²⁰⁰ = 0.35, cold enough that the final plan was a settled descent. Cooling fast, at 0.90 for 60 steps, left too little time at the temperatures where the search could cross the ridge and then find its way down the far side. Starting hotter did not help: at 40, the search spent more of its run wandering among poor layouts before it began to settle, and its extra 100 steps did not make up for it.

## Choosing the schedule

Three numbers define a geometric schedule, and simple rules set each.

```figure
type: checklist
title: Setting up a simulated annealing run
caption: The open item is the one most often skipped, and the cause of this chapter's error. A run that starts too cold is just descent.
- ? Starting temperature accepts most uphill moves at first | from a sample of moves, set T so that a typical uphill Δ is accepted about half to four-fifths of the time
- x Cooling is slow enough | α between 0.95 and 0.99 per step, or hold each temperature for a number of moves before cooling
- x The final temperature makes uphill moves rare | stop when acceptance of uphill moves falls to about 1%
- x The best plan seen is recorded, not just the last | the search can drift away from it while still warm
- x Several independent runs are made | if they agree, the result is probably the best; if they differ, run longer or cool more slowly
```

To set the starting temperature, sample a few dozen random moves from the starting plan and look at the uphill ones. From the trap layout, uphill swaps cost between 1 and 61 moves a day, with a typical value around 30. A temperature of 20 accepts a 30-move step with probability e^(−1.5) = 0.22 and a 10-move step with 0.61, which suits this problem: small ridges are easy to cross and large ones possible. The cooling factor and run length trade time against quality, and on a computer the time is cheap: a schedule that takes a minute rather than a second is usually worth it for a plan that will run a week.

## Constraints as penalties

Most shop problems have constraints, and moves can break them. There are two ways to handle this. The first is to allow only moves that keep the plan feasible, such as moving an assembly task only to a station where its predecessors are already done. The second is to allow any move but add a penalty to the cost for each broken constraint, such as a large charge per minute that a station exceeds takt, or per minute that a hard due date is missed. Penalties let the search pass through infeasible plans on its way between feasible ones, which often helps it cross ridges, but the penalty must be large enough that the final plan is feasible. A sound practice is to raise the penalty as the temperature falls.

For problems that are mostly constraints, such as building a roster of operators and machines that respects skills, leave and shift rules, the cost can simply be the number of broken constraints, and the aim is a plan with none. Physicists and computer scientists studying random constraint problems of this kind have found that they are typically easy when constraints are few or very many relative to the variables, and hard in a narrow band between, where a feasible plan exists but is rare. When a roster search struggles, it is often a sign that the problem sits in that band, and relaxing one constraint helps far more than searching longer.

## Other ways out of traps

Simulated annealing is one of several methods that let a search escape local optima, and the others are worth knowing because planning software uses them.

Restarts are the simplest: run plain descent many times from random or varied starting plans and keep the best. They work well when the landscape has a few wide valleys, as Chapter 9's layout problem does, and badly when the good plans lie in many narrow ones.

Tabu search makes the best available move at each step even if it is uphill, and forbids, for a number of steps, any move that would undo a recent change. The forbidden list stops the search falling straight back into the trap it has just left. Tabu search is deterministic, which makes its results repeatable, and it is widely used in scheduling and vehicle-routing software.

Population methods, often called genetic algorithms, keep a set of plans and build new ones by combining parts of good ones and making random changes. They suit problems where good plans share recognisable building blocks, such as sequences with good groupings of materials, and they are common in nesting software.

Large-neighbourhood search, finally, removes a sizeable part of the plan, such as all the jobs on one machine or one day of a schedule, and rebuilds that part by an exact method or a good rule. It combines the reach of a big move with the precision of the exact methods of the earlier chapters.

All of these share annealing's two lessons: the plan found depends on the moves allowed and on how the search is set up, and no single run proves anything. Comparing several runs, and comparing the best with a bound, is how the planner knows when the search has done enough.

## When to stop and when to buy

Annealing is a craft, and a shop with a recurring large problem is usually better served by software built for it: nesting software for sheet and bar, scheduling modules in planning systems, and general solvers that find provably best plans for many problems of moderate size. The ideas of this book remain useful when using them. The bound says how good the software's answer is; a small exhaustive or rule-based case checks that the software's settings and data are right; and an understanding of local optima explains why two runs of the same software can give different answers, and why more run time sometimes gives a better one.

## The error: an annealing run that was never warm

This is an illustration. Before the trolley log study of Chapter 9 was complete, a planner wrote a small annealing program to choose the bay layout and ran it once from the layout LA, DB, B1, SW and W1, which the team had sketched as a sensible "frames" grouping. The program reported 42 moves a day between bays as the best it could find. The planner's report recommended the frames layout.

The supervisor, comparing it with a colleague's exhaustive check, saw the 32-move layout and asked why the program had missed it. The program's starting temperature was 0.01, copied from an example with costs measured in fractions. At that temperature, even the one-move uphill step out of the trap was accepted with probability e^(−1/0.01), effectively never, so the program had run plain descent from a trap. Resetting the starting temperature to 20, chosen from a sample of uphill moves as described above, and making five independent runs, found the 32-move layout in every run. The lesson is that the temperature must be in the same units as the cost and set from the problem's own moves, and that a single run is never enough evidence of a best plan.

## Exercise: a cooling schedule

This is an illustration. An annealing run starts at a temperature of 20 and multiplies the temperature by 0.98 after each step.

1. What is the temperature after 100 steps?
2. What is the probability of accepting an uphill step of 10 at the start, and after 100 steps?
3. After how many steps does the temperature fall below 1?
4. From Chapter 9's trap layout, the escape needs an uphill step of 1 followed by a downhill step of 11. At a temperature of 1, what is the probability of accepting the uphill step?

**Worked answer.**

1. 20 × 0.98¹⁰⁰ = 20 × 0.1326 = **2.65**.
2. At the start, e^(−10 ÷ 20) = e^(−0.5) = **0.61**. After 100 steps, e^(−10 ÷ 2.65) = e^(−3.77) = **0.023**.
3. The temperature falls below 1 when 0.98ⁿ < 1/20, that is n > ln(0.05) ÷ ln(0.98) = −2.996 ÷ −0.0202 = 148.3, so after **149 steps**.
4. e^(−1 ÷ 1) = **0.37**. Even quite late in the run, the one-move ridge is easy to cross; the escape is likely as long as the swap is proposed at all. With 25 possible swaps, the right one is proposed about once in 25 steps, which is why the slow schedule, with 200 steps, found the best layout far more often than the 60-step fast schedule.
