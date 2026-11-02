---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: balancing-an-assembly-line
order: 4
title: "Balancing an assembly line"
description: "Balance an assembly line to takt: takt time, the least number of stations, precedence, the positional weight rule, exhaustive checks, and the KEVOS® takt, bottleneck and cycle time tools."
draft: false
---

An assembly line is a loading problem with two extra rules. The work is divided into tasks, each task must go to one station, and the stations work in sequence, so a task cannot be done at a station before the tasks it depends on. And the line has a pace, set by demand, that every station must keep: the takt time. The aim is to meet takt with as few stations as possible and, with the stations fixed, to share the work as evenly as possible so that no operator waits while another struggles.

This chapter balances the EC-600 final assembly line. It works out takt with the KEVOS® takt time tool, finds the least possible number of stations, balances the line by a classic rule and by exhaustive search, checks the result with the KEVOS® bottleneck and cycle time tools, and ends with a balance made by dividing the task list into equal thirds.

## Takt and the least number of stations

Takt time is the net working time available divided by the number of units required in that time. It is the interval at which a finished unit must leave the line if demand is to be met exactly. The [takt time tool](/tools/?tool=takt-time) calculates it from the net available production time and the required output, and reminds the user to deduct breaks, meetings and planned maintenance from the shift.

This is an illustration. The shop's final assembly line has 420 minutes of net working time a shift, after breaks and the start-up meeting, and EC-600 demand is 60 cabinets a day on one shift. The tool gives a takt of **7.00 minutes**, or 420 seconds, a required rate of 8.6 cabinets an hour.

```figure
type: formula
title: Takt time, least number of stations and balance efficiency
formula: Takt = net available time ÷ required output
formula: Least stations = total task time ÷ takt, rounded up
formula: Balance efficiency = total task time ÷ (stations × longest station time)
caption: The least number of stations is a lower bound in the sense of Chapter 1: no balance can use fewer. Balance efficiency is 100% only when every station has exactly the same work.
- Takt | the pace at which a unit must leave the line
- Total task time | sum of all task times for one unit
- Longest station time | the line's actual cycle, set by its slowest station
```

The total work content of one cabinet is 19.6 minutes. Divided by the 7.00-minute takt, that is 2.8 stations' worth of work, so the line needs at least **3 stations**. With three stations and perfect balance, each would carry 6.53 minutes, leaving 0.47 minutes of each takt as slack for variation.

## The tasks and their order

```figure
type: compare
title: EC-600 final assembly tasks
cols: Task | Time, min | Must follow
rowhead: Code
- A | fit back-plate mounting rails | 1.6 | none
- B | fit gland plate | 1.2 | none
- C | hang door on hinges | 2.4 | none
- D | fit door seal | 1.8 | C
- E | fit lock and handle | 1.5 | C
- F | fit earth studs and bonding straps | 2.2 | A and B
- G | mount back plate and DIN rail | 2.6 | A
- H | fit and adjust door stay | 1.9 | D and E
- I | fit cable entry blanks | 1.3 | B
- J | earth continuity test | 1.4 | F, G and H
- K | final inspection and labels | 1.7 | I and J
caption: This is an illustration. Times are measured averages over 20 cabinets, including handling. The total is 19.6 minutes.
```

The precedence column is what makes balancing harder than loading. The earth continuity test, J, cannot be done until the earth studs, the back plate and the door stay are all fitted, and final inspection, K, must be last. A station can take any task whose predecessors are at the same station or earlier.

Eleven tasks can be assigned to three stations in 3¹¹ = 177,147 ways. Of those, only 1,610 respect the precedence rules, and only 27 keep every station within the 7.00-minute takt. A good balance is a needle in a modest haystack.

## The ranked positional weight rule

A classic heuristic for line balancing, published by Helgeson and Birnie in 1961, ranks each task by its positional weight: its own time plus the times of every task that must follow it, directly or indirectly. A task with a large positional weight has a lot of work waiting behind it, so it should be done early. Stations are then filled in turn: take the highest-ranked task whose predecessors are done and which still fits within takt, and when nothing fits, open the next station.

```figure
type: steps
title: Ranked positional weight balance of the EC-600 line at a 7.00-minute takt
caption: This is an illustration. Positional weights: C 10.7, A 9.5, B 7.8, D 6.8, E 6.5, G 5.7, F 5.3, H 5.0, J 3.1, I 3.0, K 1.7.
- Station 1 | C 2.4, A 1.6, B 1.2, D 1.8: 7.0 minutes; E would exceed takt
- Station 2 | E 1.5, G 2.6, F 2.2: 6.3 minutes; H would exceed takt
- Station 3 | H 1.9, J 1.4, I 1.3, K 1.7: 6.3 minutes
- * Result | 3 stations, longest 7.0 minutes, exactly at takt
```

The rule has met takt with the least number of stations, which is its main job. But station 1 has exactly 7.0 minutes of work, no margin at all, while stations 2 and 3 have 0.7 minutes to spare. A cabinet with a stiff hinge, or a new operator, will make station 1 miss takt, and the line will fall behind.

## Searching every balance

With 177,147 assignments, a short program can check every one, discard those that break precedence and find the one with the smallest longest station.

```figure
type: compare
title: Three balances of the EC-600 line
cols: Station 1 | Station 2 | Station 3 | Longest, min | Balance efficiency
rowhead: Balance
- Equal thirds of the task list | A B C D, 7.0 | E F G H, 8.2 | I J K, 4.4 | 8.2 | 79.7%
- Ranked positional weight | C A B D, 7.0 | E G F, 6.3 | H J I K, 6.3 | 7.0 | 93.3%
- * Best of all 1,610 feasible | A B C I, 6.5 | D F G, 6.6 | E H J K, 6.5 | 6.6 | 99.0%
caption: This is an illustration. Balance efficiency = 19.6 ÷ (3 × longest station). The best balance was found by checking every assignment that respects precedence.
```

The best balance gives every station between 6.5 and 6.6 minutes, a longest station of 6.6 minutes and 0.4 minutes of margin at the bottleneck. It moves the cable entry blanks, I, to station 1, where they can follow the gland plate, and separates the door seal and lock tasks so that each door task sits with work that does not depend on it. These are moves a supervisor might find by trial and error, but the search finds them in seconds and proves that nothing better exists: no balance of these tasks on three stations has a longest station below 6.6 minutes.

## Checking the balance with the KEVOS® tools

The [bottleneck and line balance tool](/tools/bottleneck/) takes the available production time, the daily demand and the cycle times of up to three steps. It reports the required takt, the constraint step and its load against takt, the line's daily capacity and the line balance efficiency, and checks whether the constraint meets takt and whether the balance is above 85%.

This is an illustration. Entering 420 minutes, 60 cabinets and station times of 6.5, 6.6 and 6.5 minutes, the tool reports a takt of 7.00 minutes, station 2 as the constraint at 6.60 minutes, a constraint load of 94.3% of takt, a line capacity of 64 cabinets a day and a balance efficiency of 99.0%. All stations meet takt. It flags the constraint's load as a warning because it is above 90% of takt, a reminder that 0.4 minutes of margin is modest.

The [cycle time tool](/tools/cycle-time/) makes the same comparison from the other side: the required cycle for the demand against the line's actual cycle. With 420 minutes, 60 cabinets and an actual cycle of 6.6 minutes, it reports a headroom of 0.40 minutes and an output of 64 cabinets at the actual cycle, and warns that pace is met with under 10% headroom, so variation could cause misses.

```figure
type: bars
title: Station loads in the best balance, as a share of the 7.00-minute takt
unit: %
max: 110
caption: This is an illustration. The bottleneck tool's constraint load is the highest bar. The remaining margin, about 6% of takt at each station, must absorb variation in task times.
- Station 1, 6.5 min | 92.9
- * Station 2, 6.6 min | 94.3
- Station 3, 6.5 min | 92.9
```

## Constraints the task list does not show

Precedence is rarely the only rule a real line must respect. Some tasks need a particular tool, fixture or bench, and should stay at the station that has it: the earth continuity test, J, needs the test set, and putting it at a station without one means buying a second. Some tasks must be kept apart: on many lines, electrical tests are kept away from stations where metal swarf or adhesives are present. Some belong together because they are done on the same face of the product, and splitting them means turning the cabinet twice. And operators' skills limit which tasks can be given to a new starter.

These rules are called zoning constraints, and they are handled in the same way as fixed jobs in Chapters 2 and 3. A task tied to a station is placed there first; tasks that must be together are merged into one task; tasks that must be apart are marked so that the search rejects any balance that puts them together. The exhaustive search handles all three easily, because it simply discards balances that break a rule. The positional weight rule handles them less gracefully, because it fills stations greedily and may paint itself into a corner.

The EC-600 line has one zoning rule worth checking. The best balance puts the earth continuity test, J, at station 3 with final inspection, K. That suits the shop, because the test set already sits beside the inspection bench, so the best balance needs no new equipment. Had the test set been at station 2, the search would have been rerun with J fixed there, and the cost of the constraint read from the change in the longest station.

## Variation and the margin

Task times are averages. A cabinet whose door hangs badly, a short delay for a part or a slow operator can push a station past takt for one cycle. On a line without buffers, that delay passes to every station downstream and the line loses output. The margin between the longest station and takt is what absorbs these variations, and a balance with stations at 99% of takt will lose output in practice even if its averages meet demand.

Two remedies are common. The first is to balance to a target cycle somewhat below takt, often 90% to 95%, which here would be 6.3 to 6.65 minutes; the best balance at 6.6 just meets the looser end. The second is to place small buffers, one or two cabinets, between stations so that a slow cycle at one station does not immediately stop its neighbours. Chapter 5 of *Breakdowns and Buffers by the Numbers*, [Buffers between machines](/reados/publications/breakdowns-and-buffers-by-the-numbers/buffers-between-machines/), shows how much output a small buffer recovers.

## When demand rises

This is an illustration. The shop's distributor has asked whether the line could supply 66 cabinets a day. Takt would fall to 420 ÷ 66 = 6.36 minutes. The least number of stations becomes 19.6 ÷ 6.36 = 3.08, rounded up to **4**, so no three-station balance can work: even the best has a 6.6-minute station. The options are a fourth station, overtime, shorter task times through better fixtures or kitting, or moving a task off the line, such as fitting the cable entry blanks, I, at a sub-assembly bench beforehand. Removing I's 1.3 minutes leaves 18.3 minutes of line work, 2.88 stations' worth at the new takt, so three stations become possible again in principle, and the search can be rerun to confirm a balance exists.

## The error: equal thirds of the task list

This is an illustration. When the line was first set up, the supervisor divided the task list into thirds by count, four tasks, four tasks and three, in the order they appeared on the work instruction: A to D at station 1, E to H at station 2 and I to K at station 3. The split respected precedence, and it looked fair.

It was not. Station 2 carried 8.2 minutes of work against a takt of 7.00, while station 3 carried only 4.4. The line ran at station 2's pace, producing 420 ÷ 8.2 = 51 cabinets a shift instead of 60, and the station 3 operator spent almost half of every cycle waiting. The shortfall was blamed at first on the station 2 operator.

The bottleneck tool made the cause plain within minutes. Entering 7.0, 8.2 and 4.4 minutes, it reported station 2 as the constraint at 117% of takt, a line capacity of 51 cabinets a day and a balance efficiency of 79.7%, below its 85% check. The correction was the ranked positional weight balance, later replaced by the best balance from the search. Output rose to 60 a shift, and the operators' workloads became nearly equal. The lesson is that equal numbers of tasks are not equal amounts of work, and that the work content of each station should be added up before the line is set up.

## Exercise: one more task

This is an illustration. A new task L, fitting a document pocket inside the door, takes 0.9 minutes and must follow C. Demand stays at 60 cabinets a shift.

1. What is the new total work content, and the least number of stations?
2. The ranked positional weight rule now opens a fourth station for L alone. Why?
3. An exhaustive search finds a three-station balance with a longest station of 7.0 minutes: A, B, C and D at station 1; E, F, H and I at station 2; G, J, K and L at station 3. Check it.

**Worked answer.**

1. 19.6 + 0.9 = **20.5 minutes**, and 20.5 ÷ 7.00 = 2.93, so at least **3 stations**.
2. L's positional weight is only its own 0.9 minutes, because nothing follows it, so the rule ranks it last. By the time it is considered, every station has been filled close to takt by higher-ranked tasks: station 1 has 7.0, station 2 has 6.3 and station 3 has 6.3, and 6.3 + 0.9 = 7.2 exceeds takt. Because the rule never revisits a closed station, it opens a fourth. The rule ranks by work waiting downstream, which says nothing about how easily a small task can fill a gap.
3. Station 1: 1.6 + 1.2 + 2.4 + 1.8 = **7.0**; no task has a predecessor outside it. Station 2: 1.5 + 2.2 + 1.9 + 1.3 = **6.9**; E follows C, F follows A and B, H follows D and E, I follows B, all at station 1 or 2. Station 3: 2.6 + 1.4 + 1.7 + 0.9 = **6.6**; G follows A, J follows F, G and H, K follows I and J, and L follows C, all earlier or at station 3. Every station meets the 7.00-minute takt, so three stations suffice, though station 1 again has no margin.
