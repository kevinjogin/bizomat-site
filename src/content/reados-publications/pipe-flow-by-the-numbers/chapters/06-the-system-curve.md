---
book: pipe-flow-by-the-numbers
chapterSlug: the-system-curve
order: 6
title: "The system curve"
description: "CW-2's system curve from static lift and losses, the square-law shortcut, aged and closed loops, a pump curve and its operating point, and a head scaled in proportion to flow."
draft: false
---

Every loss in Chapters 4 and 5 was calculated at one flow, CW-2's design flow of 9.0 L/s. But a system does not run at one flow. It runs wherever its pump and its pipework agree, and that point moves as valves are set, strainers clog, pipes age and machines are added. To see where it will be, the system's head must be known at every flow, not just one. That is the **system curve**: the head the system needs, plotted against the flow through it.

This chapter builds CW-2's system curve from its static lift and its losses, compares the exact curve with the usual square-law shortcut, shows how ageing and the difference between open and closed loops change the curve, meets a pump's curve to find where the system will run, and ends with a head that was scaled in proportion to flow.

## Two kinds of head

Every system curve is made of two parts.

- **Static head** does not change with flow. In an open loop like CW-2, it is the height the pump must lift the water from the tank's surface to the return's discharge, 1.2 m. It is there even at zero flow: the pump must produce 1.2 m before any water moves.
- **Dynamic head** is the sum of every friction, fitting and equipment loss, and it rises with the flow. At zero flow it is zero; at CW-2's design flow, Chapters 4 and 5 found it to be 9.637 m.

At the design flow, the system's total head is 1.2 + 9.637 = **10.84 m**, which is the figure Chapter 2 used for the pump's head.

## The square-law shortcut

Since turbulent losses grow roughly with the square of the flow, the dynamic head can be written as k × Q², with k found from the design point: k = 9.637 ÷ 9.0² = 0.1190 m per (L/s)². The system curve is then

H = 1.2 + 0.1190 × Q²,

with Q in litres per second. It is quick to draw and to use, and for CW-2 it is close to the full calculation, which recalculates every friction factor at every flow.

```figure
type: compare
title: CW-2's system curve, full calculation and square law
rowhead: Flow
cols: Full calculation, m | Square law, m | Aged loop, m | As a closed loop, m
caption: This is an illustration. Heads on the index path at 25 °C. The aged loop assumes every pipe's roughness has risen to 0.5 mm with no change of bore. The closed loop is the same pipework with no static lift.
- 0 L/s | 1.20 | 1.20 | 1.20 | 0
- 3 L/s | 2.34 | 2.27 | 2.58 | 1.14
- 6 L/s | 5.57 | 5.48 | 6.64 | 4.37
- * 9 L/s | 10.84 | 10.84 | 13.39 | 9.64
- 10.5 L/s | 14.24 | 14.32 | 17.77 | 13.04
- 12 L/s | 18.15 | 18.33 | 22.81 | 16.95
```

The square law and the full calculation agree within 0.2 m over the whole range. The square law slightly underestimates the head at low flows and overestimates it at high flows, because the real friction factor falls a little as the flow rises. For selecting and checking pumps, that agreement is good enough, and the square law is what most system curves on pump selection sheets are.

## What changes the curve

Three things move a system curve, and each moves it differently.

- **Static head** moves the whole curve up or down. If CW-2's tank level fell 0.3 m, the static lift would rise to 1.5 m, and every point on the curve would rise by 0.3 m.
- **Resistance** makes the curve steeper or flatter. Ageing, a clogging strainer or a partly closed valve raises k and steepens the curve. In the aged loop of the table, the head at the design flow rises from 10.84 to **13.39 m**, by 24%, with no change to the static lift.
- **The flow paths** themselves change the curve when branches are opened or closed. Shutting down two of CW-2's machines changes how the flow divides along the headers, and with it the curve; Chapter 7 deals with branches.

Temperature moves the curve a little too. Warmer water is less viscous, so its friction factor and its losses fall slightly; Chapter 4 found the warm return's friction about 1% below the cool supply's. For a cooling loop that is negligible, but for an oil or glycol circuit whose viscosity changes several times over between a cold start and running temperature, the cold curve can be far steeper than the warm one.

A plant's system curve is therefore a family of curves, not one. The design curve is the middle of the family, and a pump must work acceptably across the range the plant will actually see.

## Open and closed loops

CW-2's static lift is small, 1.2 m against 9.6 m of losses, so its curve is mostly dynamic. As a closed loop, with the same pipework but no open tank, it would have no static head at all, and its curve would start at zero. The table's last column shows that curve.

The distinction matters more for systems where the static head is large. A transfer pump lifting water 18 m to a header tank has a curve that starts at 18 m and rises from there; a chilled-water loop in a tall building has none, however tall the building, because every metre the water rises it falls again. READOS's Centrifugal Pumps by the Numbers develops a system dominated by static lift, and shows how differently a pump behaves on it.

## Building the curve

The CW-2 workbook builds its system curve in five steps, and the same steps serve any loop.

```figure
type: steps
title: Building a system curve
caption: The order used in the CW-2 workbook. Steps 2 to 4 are repeated at each flow; the square law is a check, not a substitute.
- Find the static head | the lift from the supply surface to the highest discharge, 1.2 m for CW-2
- Pick the index path | the path with the largest losses, usually to the farthest or most resistant outlet
- Calculate straight-pipe friction at each flow | each length at its own flow, by Darcy–Weisbach and Colebrook
- Add fittings, valves and equipment | K values times velocity heads; data-sheet drops scaled by flow squared
- Plot head against flow from zero to beyond the design flow | and compare with H = static + k × Q²
```

The **index path** is the one that needs the most head, and it sets the pump's duty. On CW-2, it is the path through the farthest machine, because that path has the most header. On another loop it might be a nearer machine with an unusually resistant cooler. The workbook calculates every machine's path at the design flow and takes the largest, which on CW-2 is machine 6's.

## Uncertainty in the curve

A system curve is only as good as its inputs, and the loss coefficients and equipment pressure drops are the least certain of them. This is an illustration. If every fitting, valve and cooler loss on CW-2's index path were 20% higher than assumed, the head at the design flow would rise from 10.84 to 12.03 m, and the operating point with the pump curve above would fall to 8.66 L/s; if they were 20% lower, the head would fall to 9.64 m and the flow would rise to 9.38 L/s.

A spread of about ±4% in flow from a ±20% spread in the least certain losses is typical of a loop whose curve is mostly dynamic. It is why a pump is selected with some margin, why balancing valves are fitted, and why the first job at commissioning is to measure the actual flow and head and redraw the curve through the measured point. A curve that passes through a measured point is worth more than any calculation.

## Where the system runs

A pump's curve gives the head it can produce at each flow, falling from its highest at zero flow. The system runs where the pump's curve and the system's curve cross: the **operating point**, the one flow at which the head the pump produces equals the head the system needs.

This is an illustration. CW-2's pump has a curve that can be represented, over its working range, as H = 16.5 − 0.070 × Q², with Q in L/s. At 9.0 L/s, it produces 16.5 − 0.070 × 81 = 10.83 m, matching the system's 10.84 m. The operating point is **9.0 L/s at 10.83 m**.

```figure
type: compare
title: CW-2's operating point as the system changes
rowhead: Condition
cols: Static lift, m | Flow, L/s | Head, m
caption: This is an illustration with the pump curve H = 16.5 − 0.070 × Q². A higher static lift or an aged loop moves the operating point to a lower flow.
- * New loop, design tank level | 1.2 | 9.00 | 10.83
- New loop, tank 0.3 m higher | 0.9 | 9.09 | 10.72
- New loop, tank 0.3 m lower | 1.5 | 8.91 | 10.94
- Aged loop, roughness 0.5 mm | 1.2 | 8.33 | 11.64
```

The table shows the system finding its own level. When the tank is lower, the system needs more head; the pump, running back up its curve, produces it, but at a lower flow. When the loop ages, its curve steepens, and the flow falls to 8.33 L/s, about 1.39 L/s per machine. Nothing has failed and no alarm has sounded, but every machine has lost 7% of its cooling water, which is enough for the warmest moulds to run warm. That slow loss is invisible without a flow meter and a recorded design point to compare it with.

## A curve through a measured point

At CW-2's commissioning, with the balancing valves set, the plant measured the flow at the pump, 9.04 L/s, and the pump's head from its suction and discharge gauges, corrected for their heights and velocity heads, 10.9 m. This is an illustration. Taking the static lift as the known 1.2 m, the measured k is (10.9 − 1.2) ÷ 9.04² = 0.1187 m per (L/s)², within half a per cent of the calculated 0.1190. The measured curve is therefore H = 1.2 + 0.1187 × Q², and it, not the calculated one, is recorded as the loop's baseline.

The baseline is used every time the loop is changed or checked. A year later, a measured k of 0.13 would mean the loop's resistance had risen by about 10%, from fouling, a strainer, a valve or ageing, and the next step would be to find where by reading the gauges along the path. A new machine's demand is checked by reading the head it needs off the baseline curve at the new flow. And when the pump is replaced, the baseline tells the supplier exactly what the new pump must meet.

Recording the baseline costs about an hour at commissioning, with gauges and a meter that are already there. Without it, every later question about the loop starts with an argument about what it used to do.

## Reading a system curve

A system curve answers practical questions directly.

1. **Can the pump deliver the flow?** Only if its curve lies above the system curve at that flow.
2. **What happens if a valve is closed?** The curve steepens and the operating point slides back along the pump curve to a lower flow and a higher head.
3. **What does a bigger flow cost?** The head needed at the new flow, read from the curve, and the power that follows from it, which Chapter 10 prices.
4. **Is the system dominated by friction or by lift?** The ratio of the static head to the total at the design flow. CW-2's is 11%; its flow responds strongly to any change of resistance.

## The error: head scaled in proportion to flow

This is an illustration. When the plant planned to fit new moulds needing 2.0 L/s each instead of 1.5, it needed 12.0 L/s through CW-2. A planner estimated the head by scaling the design point in proportion: the dynamic head of 9.637 m at 9.0 L/s became 9.637 × 12 ÷ 9 = 12.85 m at 12 L/s, giving a total of **14.05 m**. A replacement pump offering 15 m at 12 L/s was ordered on that basis.

Losses do not scale in proportion to flow; in turbulent flow they scale nearly with its square. The system actually needs **18.15 m** at 12 L/s, 4.1 m more than estimated. With the new pump, whose curve could be represented as H = 21 − 0.0417 × Q², the system settled at **11.14 L/s and 15.8 m**, about 1.86 L/s per machine, 7% short of the 2.0 L/s the new moulds needed.

It was found at the new pump's commissioning, when the flow meter read 11.1 L/s with the balancing valves wide open. The fix was a second change: the machines' cooler connections were rearranged to cut their pressure drop, which flattened the curve enough for the new pump to reach 12 L/s. The lesson is the one the system curve exists to teach: read the head at the new flow from the curve, never by proportion.

## Exercise: the head at 7.5 L/s

Using the square-law curve H = 1.2 + 0.1190 × Q², find the head CW-2 needs at 7.5 L/s, with the six machines sharing the flow equally at 1.25 L/s each. Compare it with the full calculation's value, which is about 7.95 m. How much head does the pump curve H = 16.5 − 0.070 × Q² offer at 7.5 L/s, and what does the difference mean?

**Worked answer.**

- Square law: H = 1.2 + 0.1190 × 7.5² = 1.2 + 6.69 = **7.89 m**, within 0.1 m of the full calculation.
- The pump offers 16.5 − 0.070 × 7.5² = **12.56 m** at 7.5 L/s.
- The pump offers 4.6 m more than the system needs at that flow, so the system cannot run at 7.5 L/s on this curve: the pump pushes the flow up until the two curves meet again, at the design point.

To run at 7.5 L/s, something must change: a valve partly closed, which steepens the system curve, or the pump slowed, which lowers its curve. Shutting one machine down is a third kind of change: it alters the system curve itself, as Chapter 7 shows, and the five running machines then each get more than 1.5 L/s.
