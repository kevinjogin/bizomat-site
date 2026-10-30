---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: grouping-machines-into-cells
order: 9
title: "Grouping machines into cells"
description: "Group workstations into bays or cells so that as little material as possible moves between them: flow matrices, graph partitioning, exhaustive checks, swap-based improvement and its local optima."
draft: false
---

Where machines sit decides how far work travels. A shop laid out by machine type, all the cutting in one bay and all the welding in another, is easy to supervise and wasteful to run, because every part crosses the shop at least once and often several times. A shop laid out by flow puts machines that exchange a lot of work next to each other, so that most moves are short and stay inside a bay. Deciding which machines share a bay is a partitioning problem: split a network of machines into groups so that as little flow as possible crosses between groups.

This chapter splits the shop's ten workstations into two bays of five. It builds the flow network from a trolley log, checks all 126 possible splits, shows how a swap-based improvement finds the best from the shop's current layout, and shows the local optimum where the same method gets stuck from other starts. The error is the layout by machine type itself.

## The flow network

This is an illustration. The shop's building has two bays, each with room for five workstations. For a fortnight, every trolley or forklift move between workstations was logged, and the daily averages recorded. Moves within a bay are short; moves between bays cross a roller door, wait for the forklift and take several minutes each.

```figure
type: compare
title: The ten workstations
cols: Workstation | Current bay
rowhead: Code
- LA | fibre laser | cutting and forming
- DB | deburring and marking | cutting and forming
- B1 | press brake 1 | cutting and forming
- B2 | press brake 2 | cutting and forming
- SW | cold saw | cutting and forming
- W1 | weld bay 1, frames and stands | joining and finishing
- W2 | weld bay 2, job work | joining and finishing
- GR | grinding and finishing | joining and finishing
- AS | EC-600 assembly line | joining and finishing
- DS | dispatch and powder-coat loading | joining and finishing
caption: This is an illustration. The current layout groups the machines by type: cutting and forming in one bay, joining and finishing in the other.
```

```figure
type: compare
title: Average daily moves between workstations, from the fortnight's log
cols: Moves a day | What moves
rowhead: Between
- LA and DB | 28 | every laser part is deburred
- GR and DS | 14 | finished job work to dispatch
- DB and B1 | 15 | parts for bending
- DB and B2 | 11 | parts for bending
- B1 and W1 | 12 | bent parts for frames
- AS and DS | 12 | finished cabinets
- DB and AS | 6 | flat EC-600 gland plates
- B2 and AS | 10 | bent EC-600 parts
- W1 and GR | 10 | welded frames
- SW and W1 | 9 | cut tube for frames
- W2 and GR | 9 | welded job work
- SW and W2 | 8 | cut tube for job work
- B1 and W2 | 5 | bent parts for job work
- LA and B1 | 4 | parts bent without deburring
- B2 and DS | 3 | bent parts shipped flat
- B1 and B2 | 2 | parts needing both brakes
caption: This is an illustration. 158 moves a day in total. Pairs not listed exchange no work.
```

The table is a network: workstations are its points, and each pair that exchanges work is joined by a line weighted by its daily moves. The cost of a layout is the total weight of the lines that cross between the two bays, called the cut.

## The current layout's cut

In the current layout, seven flows cross between the bays: B1 to W1, 12; B1 to W2, 5; B2 to AS, 10; B2 to DS, 3; SW to W1, 9; SW to W2, 8; and DB to AS, 6. The cut is **53 moves a day**, a third of all the shop's moves. Each crossing takes several minutes of forklift time and waiting, and the supervisor estimated that cross-bay moves took more than two hours of labour a day.

## Checking every split

Splitting ten workstations into two groups of five can be done in 252 ways, but each split is counted twice, once from each bay's side, so there are 126 different layouts. Checking all of them takes a spreadsheet a moment.

```figure
type: bars
title: The 126 possible two-bay layouts, by moves a day between bays
unit: layouts
max: 25
caption: This is an illustration. Calculated by checking every split of the ten workstations into two bays of five. Only 2 layouts have fewer than 40 moves a day between bays; the current layout, at 53, is among the best 8 but far from the best.
- 30–39 | 2
- 40–49 | 4
- 50–59 | 8
- 60–69 | 11
- 70–79 | 17
- 80–89 | 22
- 90–99 | 23
- 100–109 | 19
- 110–119 | 15
- 120 and over | 5
```

The best layout puts LA, DB, B1, B2 and AS in one bay and SW, W1, W2, GR and DS in the other. Only four flows cross: B1 to W1, 12; B1 to W2, 5; B2 to DS, 3; and AS to DS, 12, a cut of **32 moves a day**. The second best, at 35, puts LA, DB, B2, AS and DS together. Every other layout has a cut of 42 or more.

The best layout makes sense once seen. The EC-600 assembly line takes most of its parts from deburring and brake 2, so it belongs with the cutting and forming machines; the saw feeds only the weld bays, so it belongs with them. The current layout had these two exactly backwards, a consequence of grouping by machine type rather than by flow.

## Improving by swaps

With ten workstations, checking every layout is easy. With forty workstations split into four cells, it is not: the count runs to billions. The standard approach, introduced by Kernighan and Lin in 1970 for splitting electronic circuits, is to improve a layout by swapping pairs of workstations between groups. Each swap keeps the groups the same size; the method tries every possible swap, makes the one that lowers the cut most, and repeats until no swap helps.

```figure
type: steps
title: Swap-based improvement from the current layout
caption: This is an illustration. With five workstations in each bay, there are 25 possible swaps at each step.
- Start | current layout by machine type: cut 53
- Try all 25 swaps | the best swaps SW and AS
- * After one swap | LA, DB, B1, B2, AS and SW, W1, W2, GR, DS: cut 32
- Try all 25 swaps again | none lowers the cut: stop
```

From the current layout, a single swap reaches the best layout. That is partly luck: the current layout was wrong in only one place. The method's weakness appears from other starting points.

## Local optima

A layout where no single swap lowers the cut is called a local optimum. The best layout is one, but there can be others, and the swap method stops at whichever it reaches first. Starting the method from each of the 126 layouts in turn shows how often that happens.

```figure
type: compare
title: Where swap-based improvement ends, from each of the 126 starting layouts
cols: Starting layouts that end here | Moves a day between bays
rowhead: Final layout
- * LA DB B1 B2 AS with SW W1 W2 GR DS | 91 | 32
- LA DB B1 SW W1 with B2 AS DS GR W2 | 35 | 42
caption: This is an illustration. From 35 of the 126 starts, the method stops at a layout with a cut of 42, where every single swap makes things worse, although a layout with a cut of 32 exists.
```

The trap layout puts LA, DB, B1, SW and W1 together: a "frames" bay built around brake 1, the saw and weld bay 1, which share heavy flows. From it, moving any one workstation breaks a strong link, so every single swap raises the cut, yet the best layout is two swaps away. Starting from LA, DB, SW, W1 and GR, for example, the method swaps GR for B1 and stops at the trap with 42 moves a day, ten more than the best.

```figure
type: matrix
title: Two ways a search can stop
x: Size of the cut: high → low
y: Can a single swap improve it? no → yes
hot: 4
caption: Swap-based improvement only ever moves down and to the right. It stops at either bottom-row layout; only the bottom-right one is best.
- Poor layout, improvable | the method moves on
- Good layout, still improvable | the method moves on
- Poor local optimum | rare in practice; restart elsewhere
- Local optimum | the trap at 42, or the best at 32
```

Two remedies are common. The first is to run the improvement from several different starting layouts, random or chosen by judgement, and keep the best result; with 91 of 126 starts reaching the best here, three random starts find it more than 95% of the time. The second is to allow the search to accept some worsening moves early on, so that it can climb out of a trap, which is the idea behind Chapter 10's simulated annealing. Kernighan and Lin's own method uses a version of the second: it makes a whole sequence of swaps, even ones that raise the cut, and then keeps the best point along the sequence.

## What the flow table should count

The cut is only as meaningful as the weights in the flow table. A count of moves treats a hand trolley of small brackets the same as a forklift load of cabinet bodies, and treats a move to the next machine the same as a move across the yard. Three refinements make the weights closer to the real cost.

The first is to weight each move by its effort: a forklift move might count as three trolley moves, a crane lift as five. The second is to count only moves that would cross between bays in some layout, ignoring moves that always stay at one machine, such as parts returned to the same brake for a second bend. The third is to use a period that represents the work mix the layout must serve for the next few years, not the last fortnight: if EC-600 volume is expected to double, its flows should be doubled in the table before the layout is chosen.

This is an illustration. As a test, the shop reweighted its table with the three flows into dispatch, which travel by forklift, counted three times. The best layout changed completely: LA, DB, B1, SW and W1 in one bay, and B2, AS, DS, GR and W2 in the other, with a weighted cut of 42 against 62 for the layout that was best by count. It keeps dispatch beside both of the stations that feed it by forklift. It is also the trap layout of the previous section, which shows how a layout can be a poor local optimum under one set of weights and the best under another.

Which answer is right depends on which weights are true, so the shop timed a week of forklift moves. Because the forklift was parked at the dispatch door and the moves were short, a forklift move took about the same labour as a trolley move, and the count-based weights stood. The lesson is that the weights deserve the same scrutiny as the search: a precise search over the wrong weights gives a precise wrong layout, and the top two or three layouts under plausible weights deserve a look on the floor before one is chosen.

## More than two cells, and shared machines

Larger shops split into three, four or more cells. The simplest method is to split in two, then split each half in two, and so on, using the same swap-based improvement at each stage. Methods that split into several groups at once do somewhat better and are built into layout software, but the repeated halving method is easy to apply by hand and gives a sound starting point.

Two features of real cells change the arithmetic. Cells are limited by floor area and by people, not by a fixed number of machines, so the equal-size rule is replaced by a limit on each cell's total area or crew. And some machines are needed by every cell: a deburring station or a saw can often be duplicated cheaply, giving each cell its own and removing its flows from the cut entirely. The decision is then a trade: the cost of the second machine against the moves it removes. In the running case, a second, smaller deburring station in the joining bay would remove none of the best layout's crossings, because deburring already sits with all the machines it serves; a second saw in the cutting bay would remove nothing either. The best layout needs no duplication, which is another sign that it groups the work naturally.

## Partitioning and physics

Splitting a network into two equal halves has a close counterpart in the physics of magnets. Give each workstation a variable that is +1 in one bay and −1 in the other. A flow between two workstations adds to the cost only when their variables differ, exactly as the energy of a pair of magnetic moments rises when they point in opposite directions, and the requirement of equal bays says that the variables must sum to zero. Physicists have analysed such systems in depth, and one of their findings carries over directly: for large networks with tangled, conflicting links, the cost landscape has many valleys of nearly equal depth, separated by high ridges. That is the landscape in which swap-based improvement stalls, and it is why randomised methods that can cross ridges outperform greedy ones on large layout problems.

## The error: grouping by machine type

This is an illustration. The current layout grouped machines by what they are: cutting and forming in one bay, joining and finishing in the other. It is the natural first layout of a growing job shop, and it was never revisited when the EC-600 product line began. The trolley log made the cost visible: 53 moves a day crossed the bays, one in three of all moves, and most of the crossings involved the EC-600 assembly line, whose parts came from the other bay.

The best layout cut the crossings to 32 a day, a reduction of 21 moves, or 40%. At an estimated six minutes each, including waiting for the forklift, that saves about two hours of labour a day. The move required relocating the assembly line and the saw, a weekend's work. Before committing, the shop checked the constraints the flow table does not show: the saw needs a 6.5 m clear length for incoming tube, which the joining bay had, and the assembly line needs a clean area away from grinding dust, which meant placing it at the far end of the cutting bay. Both were satisfied, so the best layout on paper was also feasible on the floor.

## Exercise: six stations

This is an illustration. A smaller shop has six stations, P to U, and two bays of three. The daily moves are: P–Q 20, P–R 5, Q–R 8, R–S 4, S–T 15, T–U 12, S–U 6, Q–T 3 and P–U 2.

1. What is the total number of moves, and how many different layouts are there?
2. The current layout is P, S and U in one bay. What is its cut?
3. Apply swap-based improvement. Where does it end, and is that the best?

**Worked answer.**

1. 20 + 5 + 8 + 4 + 15 + 12 + 6 + 3 + 2 = **75** moves a day. Six stations into two groups of three: 20 splits, each counted twice, so **10** layouts.
2. With P, S and U together and Q, R and T together, the crossing flows are P–Q 20, P–R 5, R–S 4, S–T 15, T–U 12 and none other between the groups: 20 + 5 + 4 + 15 + 12 = **56**.
3. The best first swap is S for Q, giving P, Q and U against R, S and T: crossing flows P–R 5, Q–R 8, Q–T 3, T–U 12 and S–U 6, a cut of **34**. The best next swap is U for R, giving P, Q and R against S, T and U: crossing flows R–S 4, Q–T 3 and P–U 2, a cut of **9**. No swap improves it further. Checking all 10 layouts confirms that 9 is the best: the network has two natural clusters, P–Q–R and S–T–U, joined by only three light flows.
