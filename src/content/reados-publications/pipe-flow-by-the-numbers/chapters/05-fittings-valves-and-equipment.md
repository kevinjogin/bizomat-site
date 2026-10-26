---
book: pipe-flow-by-the-numbers
chapterSlug: fittings-valves-and-equipment
order: 5
title: "Fittings, valves and equipment"
description: "Loss coefficients and equivalent lengths, equipment drops scaled from data sheets, CW-2's losses added up, a clogging strainer, and a cooler's drop taken at the wrong flow."
draft: false
---

Straight pipe is only part of the story. Every elbow, tee, valve, strainer and heat exchanger in a system disturbs the flow, and each disturbance costs head. In a long pipeline, these "minor losses" really are minor. In a compact plant loop like CW-2, with short branches, many fittings and coolers at every machine, they are often the larger part of the total, and getting them wrong gives a pump that is too big or too small.

This chapter sets out loss coefficients and equivalent lengths, adds up CW-2's fitting and valve losses, scales its machines' cooler losses from their data sheets, follows what a clogging strainer does to the pump's suction, and ends with a cooler's pressure drop taken at the wrong flow.

## Loss coefficients

The head lost through a fitting is expressed as a number of velocity heads:

h = K × v² ÷ 2g,

where K is the fitting's **loss coefficient**. A K of 1 means the fitting costs one velocity head; at CW-2's header velocity, that is 0.156 m, about 1.5 kPa.

Loss coefficients come from tests, and they vary with the fitting's design, size and manufacturer, and with what is upstream and downstream of it. Published tables differ from each other by a factor of two for some fittings. The values below are illustrations, chosen to be in the range such tables give; for real work, they are replaced with the manufacturer's data for the fittings actually used, or with a recognised reference.

```figure
type: compare
title: Loss coefficients used for CW-2
rowhead: Fitting
cols: K, illustration | Where it is on CW-2
caption: This is an illustration. Each K is a typical order of magnitude, not a value for any particular product. The velocity head used with each K is the one in the pipe where the fitting sits.
- 90° elbow, long radius | 0.3 | headers, 8 on each
- 90° elbow, short radius | 0.75 | branches, 4 on each machine's path
- Tee, flow through the branch | 1.0 | at each machine, in and out
- Gate valve, fully open | 0.15 | isolating valves at the pump
- Ball valve, fully open | 0.05 | machine isolating valves
- * Balancing valve, fully open | 5.0 | one on each machine's return
- Strainer, clean | 2.0 | pump suction
- Exit into a tank | 1.0 | return discharge
```

The exit loss deserves a word. Water leaving a pipe into a tank loses its whole velocity head, because its velocity is dissipated in the tank. That is K = 1 exactly, by the energy equation, whatever the pipe's shape. It is often forgotten in hand calculations, and on a short, fast discharge it can be a noticeable share of the total.

## Entrances

Water entering a pipe from a tank loses head at the entrance too, because it must accelerate from rest into the pipe and squeeze past the pipe's edge. The loss depends on the edge's shape: a sharp-edged entrance flush with the tank wall is commonly given a K of about 0.5, and a well-rounded bellmouth much less. On CW-2, the suction entrance and the strainer are close together in the tank, and the workbook takes the strainer's K of 2.0 to include both, rather than adding a separate 0.5 × 0.1563 = 0.078 m for the entrance. That is a judgement, recorded as such in the workbook.

More important than the entrance's loss is what happens above it. A suction entrance too close to the water's surface draws a vortex, a spinning funnel of air, down into the pipe. The air reduces the pump's output, makes it noisy and, collecting at high points, causes the problems Chapter 9 describes. The cure is enough submergence above the entrance, or a plate or baffle that breaks up the swirl, and the pump's supplier or a recognised reference gives the submergence for a given flow and bore.

## Equivalent length

An alternative way to express a fitting's loss is as the length of straight pipe that would lose the same head. Equating K × v² ÷ 2g with f × (L ÷ D) × v² ÷ 2g gives the **equivalent length**:

L_e = K × D ÷ f.

For a long-radius elbow on CW-2's header, L_e = 0.3 × 0.0809 ÷ 0.01952 = **1.24 m**. For the open balancing valve on a branch, 5.0 × 0.036 ÷ 0.02419 = **7.44 m**. For the suction strainer, 2.0 × 0.0809 ÷ 0.01952 = 8.29 m.

Equivalent lengths are convenient because they can simply be added to a pipe's real length and the total run through the friction formula once. They have a weakness: the equivalent length depends on the friction factor, which changes with flow and pipe, so an equivalent length worked out for one pipe and flow is not exactly right for another. For a single system calculation, K values are more reliable; the CW-2 workbook uses K throughout.

## CW-2's fittings and valves

This is an illustration. On the headers, which carry the full flow at their pump ends, the workbook takes each fitting's loss at the full-flow velocity head of 0.1563 m. That is conservative for fittings near the far ends, where the flow is less, and simple.

- Headers: 16 long-radius elbows at K = 0.3, the strainer at 2.0, two gate valves at 0.15 and the exit at 1.0, a total K of 8.1. The head lost is 8.1 × 0.1563 = **1.266 m**.
- The farthest machine's branch: two tee branches at 1.0, four short elbows at 0.75, two ball valves at 0.05 and the open balancing valve at 5.0, a total K of 10.1, at the branch velocity head of 0.1107 m. The head lost is 10.1 × 0.1107 = **1.118 m**.

Together, CW-2's fittings and valves lose 2.384 m on the longest path at the design flow, about two-thirds of the 3.674 m that the straight pipe loses.

## Equipment: scaling the data sheet

Each moulding machine's coolers are a piece of equipment with its own pressure drop, given by the machine's maker. Equipment losses are not expressed as K values; the data sheet gives a pressure drop at a stated flow. Because the flow through a cooler is turbulent, its pressure drop varies close to the square of the flow, and the drop at any other flow is found by scaling:

Δp₂ = Δp₁ × (Q₂ ÷ Q₁)².

This is an illustration. The machines' data sheet gives a pressure drop of 62 kPa at 2.0 L/s through the mould and oil coolers together. At CW-2's 1.5 L/s per machine, the drop is 62 × (1.5 ÷ 2.0)² = **34.9 kPa**, which the workbook rounds to 35 kPa, a head of 35 ÷ 9.778 = **3.58 m**.

That single item is the largest loss on the path, a third of the total. Coolers, heat exchangers, filters and control valves are usually the dominant losses in a plant loop, and their data sheets deserve more attention than any fitting.

```figure
type: bars
title: CW-2's index path at the design flow, by part
unit: m
max: 4
caption: This is an illustration. Heads at 9.0 L/s along the longest path from the tank, through the farthest machine and back. The machine's coolers alone are a third of the 10.84 m total.
- Supply header friction | 1.315
- Return header friction | 1.466
- Branch friction | 0.893
- Header fittings and valves | 1.266
- Branch fittings and valves | 1.118
- * Machine coolers | 3.580
- Static lift to the return discharge | 1.200
```

## A clogging strainer

The suction strainer protects the pump and the machines from debris, and it clogs as it does its job. Its loss coefficient rises as it fills. Clean, at K = 2.0, it loses 0.313 m. This is an illustration: half-blocked, its loss coefficient might reach 20, and it would lose 20 × 0.1563 = 3.13 m.

Chapter 2 found that the pump's suction sits only 0.031 m above atmospheric with a clean strainer. With the strainer at K = 20, the suction's pressure head becomes 0.5 − 0.156 − 3.13 = −2.78 m, a gauge pressure of **−27.2 kPa**. That is still well above the water's vapour pressure, but it is enough to draw air in at any leaking joint on the suction, and it brings the pump closer to cavitation, which Centrifugal Pumps by the Numbers explains. A compound gauge on the suction, reading below zero, is the plant's early warning; the maintenance schedule calls for the strainer to be cleaned when the suction gauge falls below −10 kPa.

## Fittings close together

Loss coefficients are measured with long straight pipe before and after the fitting, so that the flow arrives undisturbed and has room to recover. In real systems, fittings are often close together: an elbow straight into a tee, two elbows back to back in different planes, a valve straight after a pump. The flow arriving at the second fitting is still disturbed by the first, and the combined loss is not exactly the sum of the two K values. It may be more or less, depending on the arrangement.

For a plant loop, the practical response is to accept the uncertainty and allow for it: add the K values as if the fittings were separate, and recognise that the total may be out by perhaps a fifth either way for tightly packed fittings. That uncertainty is one reason why a pump is selected with some margin, and why balancing valves are fitted to trim the flows once the system is built.

## Reducing the losses

Fitting losses are partly a design choice. On CW-2, the machine branches use short-radius elbows because space under the machines is tight. This is an illustration: replacing the four short elbows on each branch path, at K = 0.75 each, with long-radius elbows at 0.3 would save 4 × 0.45 = 1.8 velocity heads, 1.8 × 0.1107 = **0.199 m** per machine. Across the index path, that is about 2% of the total head.

```figure
type: bars
title: Fitting and valve losses on the farthest machine's branch
unit: m
max: 1.2
caption: This is an illustration at 1.5 L/s. Long-radius elbows would save 0.199 m on the branch, about 2% of the index path's 10.84 m. The open balancing valve is the largest single fitting loss.
- * As built, short elbows, K total 10.1 | 1.118
- With long-radius elbows, K total 8.3 | 0.919
- Balancing valve alone, open, K 5.0 | 0.554
```

That is small for one change, and many such changes together are what separate an efficient loop from a wasteful one. The bigger levers are elsewhere: a cooler or filter selected for a lower pressure drop, a strainer with a larger screen area, and fewer valves where isolation is not needed. Over a loop's life, pumping energy usually costs far more than the fittings, and Chapter 10 puts a price on each metre of head.

## Valves that control

A valve used to control or balance flow is a deliberately variable loss. A balancing valve, set partly closed, may have a K of 50 or 100 or more; a control valve modulates its K continuously to hold a temperature or a flow. Such valves are described by a flow coefficient, Kv, which is the flow in m³/h that passes through the valve with a pressure drop of 1 bar. The pressure drop at any flow is then Δp = (Q ÷ Kv)² bar, with Q in m³/h.

Kv and K describe the same thing in different terms. Chapter 7 uses balancing valves' settings to share CW-2's flow between its machines, and works in pressure drops; the conversion between Kv and K for a given bore is in the exercise below.

## The error: a cooler's drop taken at the wrong flow

This is an illustration. When CW-2 was first designed, the designer took the machines' cooler pressure drop straight from the data sheet, 62 kPa, without noticing that it was stated at 2.0 L/s, not at the 1.5 L/s each machine would receive. The cooler's head in the calculation was therefore 6.34 m instead of 3.58 m, **2.76 m too high**.

The total head on the index path came out at 13.6 m instead of 10.8 m, and the pump was selected for that. Installed, the pump met a system that needed less head than expected, ran further out along its curve than intended, delivered more flow than 9 L/s, and drew more power. The balancing valves had to be closed further than planned to bring the flow back down, which wasted the extra head as heat in the valves.

It was found at commissioning, when the measured flow with the valves open was well above 9 L/s and the measured pressure drop across a machine's coolers was 35 kPa, not 62. The fix in the short term was the balancing valves; in the longer term, the plant fitted a variable-speed drive, which Centrifugal Pumps by the Numbers deals with. The shop's rule now is that every equipment pressure drop in a calculation carries the flow it was quoted at, and is scaled to the design flow in the next column. A second column records the pressure drop measured across the equipment at commissioning, so that the data sheet, the calculation and the plant can be compared on one line, and a cooler whose measured drop climbs over the years shows up as fouling before a machine runs hot.

## Exercise: Kv and K

A balancing valve on a branch of 36.0 mm bore has a Kv of 8.0 m³/h. Find its pressure drop at 1.5 L/s, and the equivalent loss coefficient K in the branch.

**Worked answer.**

- 1.5 L/s is 5.4 m³/h.
- Δp = (5.4 ÷ 8.0)² = 0.456 bar = **45.6 kPa**.
- As a head, 45.6 ÷ 9.778 = 4.66 m.
- The branch's velocity head is 0.1107 m, so K = 4.66 ÷ 0.1107 = **42.1**.

A valve with a Kv of 8.0 is well closed for a branch of this size, with a K more than eight times the fully open value used above. It would take much of the head the pump supplies and is suited to a machine close to the pump, where there is head to spare. Chapter 7 shows how the settings are found.
