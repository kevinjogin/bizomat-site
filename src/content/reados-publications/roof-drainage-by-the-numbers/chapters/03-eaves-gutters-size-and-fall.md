---
book: roof-drainage-by-the-numbers
chapterSlug: eaves-gutters-size-and-fall
order: 3
title: "Eaves gutters: size and fall"
description: "Size an eaves gutter from its flow: effective cross-section, fall, a Manning estimate of flow depth, downpipe spacing as the strongest lever, and the brackets that keep the fall true."
draft: false
---

An eaves gutter is an open channel hung from the edge of a roof. It collects water along its whole length and carries it sideways to outlets, falling gently towards each. Whether it copes depends on three things: how much water arrives at its fullest point, how deep the water must be to carry that flow, and how much depth the gutter actually has before it spills. Gutter profiles are usually chosen by appearance and habit. This chapter chooses one by numbers, and shows that the most effective way to make a gutter cope is often not a bigger gutter but more outlets.

It works through W-40's rear gutter: the effective cross-section of a gutter, the fall and why it matters, an estimate of the flow depth using Manning's formula, the effect of downpipe spacing, and the brackets that keep the fall true over years. The failure case is a gutter whose brackets were spaced too widely, so that it sagged into a series of shallow ponds.

## The effective cross-section

A gutter's capacity depends on the cross-section of water it can hold before spilling, not its overall size. Two features reduce that section.

The **front edge**. Gutters on buildings are set with the front edge lower than the back, so that when they overflow, water spills outwards, away from the fascia and the building. Chapter 6 explains why. The water level at which the gutter begins to spill is therefore set by the front edge, not the back.

The **profile**. Many gutters have a moulded front, a curved or ogee shape that looks well from the street. Below the front lip, the shape narrows towards the sole. Only the area below the overflow level counts.

W-40's rear gutter is a plain box-section steel gutter, **150 mm** wide inside and **115 mm** deep at the back, with its front edge set **15 mm** lower than the back. This is an illustration. Its effective depth, from the sole to the front edge, is therefore **100 mm**, and its effective cross-section **150 × 100 = 15,000 mm²**. Water above 100 mm deep goes over the front.

## Choose a profile for the job

Eaves gutters come in a handful of common shapes, each with a different balance of capacity, appearance and ease of cleaning.

```figure
type: compare
title: Common eaves gutter profiles compared
cols: Moulded front | Half-round | Box section
caption: This is an illustration of general characteristics. Capacities for a particular product come from its maker's data; two profiles with the same width can hold very different amounts of water below the front edge.
- Effective section for its width | moderate: the moulded front narrows the lower part | lowest: the curve gives little depth at the edges | highest: square sides use the full width
- Appearance | traditional on houses | traditional and heritage | plain, common on commercial buildings
- Cleaning | moderate: debris lodges in the moulding's corners | easiest: a smooth curve | easy, but corners can hold silt
- Fixing | external brackets or concealed clips | external brackets | external brackets or a fascia-mounted support
- *Chosen for W-40 | no | no | yes, 150 mm wide, 115 mm deep at the back
```

The plain box section suited W-40's industrial character and gave the most capacity for its width. On a house in a heritage street, the half-round's appearance might matter more, with more downpipes to make up the capacity. The choice should be made knowingly, with the effective section and the maker's capacity data in front of the designer, not by habit.

Gutters for large commercial roofs often grow into sizes the standard catalogue does not cover. At that point, a custom-folded gutter can be made to any section, and its capacity estimated in the same way. A custom gutter also lets the designer set the front edge height and the outlet positions precisely, at the cost of folding and fixing details that must be drawn properly.

## Fall

A gutter laid dead level still drains, because the water surface itself slopes towards the outlet as water piles up. A gutter with fall drains faster, empties completely after the rain stops, and carries more water at a given depth. The ABCB Housing Provisions require eaves gutters on houses to fall at **not less than 1:500**, one millimetre of drop for every 500 mm of length. W-40 uses the same 1:500 as its minimum.

At 1:500, the gutter drops **10 mm** over the 5 m from each high point to each downpipe in the four-downpipe arrangement. That is small enough to be invisible from the ground, and large enough to empty the gutter after rain, provided the gutter is straight. A sag of a few millimetres between brackets defeats it entirely, as the failure case shows. Steeper falls carry more water but make the gutter visibly crooked on a long building, and the low end hangs lower against the fascia, so architects resist them.

## Estimate the flow depth

The flow at the outlet end of each gutter section, from Chapter 2, is **3.0 L/s** at the 5% AEP intensity with four downpipes. The question is how deep the water must be to carry it.

For flow in a channel with a steady fall, **Manning's formula** relates the flow to the channel's shape, its slope and its roughness. It assumes uniform flow, where the depth is the same along the channel. A gutter collecting water along its length is not quite like that, so the result is an estimate, but a useful one for comparing options. A Manning's roughness of about 0.012 is a published value for smooth steel.

```figure
type: formula
title: Flow depth in W-40's rear gutter by Manning's formula
formula: Q = A × (1 ÷ n) × R^(2/3) × S^(1/2)        where R = A ÷ P
caption: This is an illustration for a 150 mm wide gutter at a fall of 1:500 with n = 0.012. A is the water's cross-section, P the wetted perimeter, R the hydraulic radius and S the fall. The depth was found by trial until Q matched 3.0 L/s.
- Width b and trial depth y | 0.150 m and 0.054 m
- Area A = b × y | 0.0081 m²
- Wetted perimeter P = b + 2y | 0.258 m
step: R = 0.0081 ÷ 0.258 ≈ 0.0314 m
step: velocity = (1 ÷ 0.012) × 0.0314^(2/3) × 0.002^(1/2) ≈ 0.371 m/s
step: Q = 0.0081 × 0.371 ≈ 0.0030 m³/s = 3.0 L/s at a depth of about 54 mm
```

At the 5% AEP flow, the water is about **54 mm** deep at the outlet end, leaving **46 mm** below the front edge. At the 1% AEP flow of about 4.2 L/s per side, the same method gives about **69 mm**, still 31 mm below the front edge. On these numbers, the gutter itself carries both storms. Chapter 4 shows that the gutter is not the whole story.

A galvanised or weathered surface is rougher. Using a Manning's n of 0.016 instead, the 5% depth rises to about **67 mm**. Roughness matters, and gutters that collect dirt and corrosion lose capacity with age.

## Downpipe spacing is the strongest lever

Because flow builds steadily along the gutter, the flow at each outlet is proportional to the length of gutter draining to it. Halving the spacing halves the flow and reduces the depth needed.

```figure
type: bars
title: Estimated flow depth at the outlet by number of rear downpipes, 5% AEP
unit: mm
max: 100
caption: This is an illustration for W-40's 150 mm gutter at 1:500 and n = 0.012, with downpipes evenly spaced along 40 m. The gutter's effective depth is 100 mm. Depth falls quickly as outlets are added.
- 3 downpipes, 4.0 L/s per side | 67
- *4 downpipes, 3.0 L/s per side | 54
- 5 downpipes, 2.4 L/s per side | 46
- 6 downpipes, 2.0 L/s per side | 40
```

Going from three downpipes to six reduces the depth at the outlet from about 67 mm to 40 mm, with the same gutter. A larger gutter would achieve something similar, at more cost in material, a heavier load on the fascia and a bulkier look. More downpipes cost more in pipe, fittings and connections to the stormwater system below, which is often the deciding cost. The right answer balances the two, and the outlets themselves, the subject of Chapter 4, often decide it.

The Housing Provisions limit each downpipe on a house to serving no more than **12 m** of gutter, and require downpipes to be placed as close as possible to valley gutters. W-40 is not a house, but the 12 m limit is a sensible reference. Four downpipes, each serving 10 m, satisfy it.

## Where to put the downpipes

Evenly spaced downpipes give equal flows, but buildings rarely allow perfect spacing. Doors, windows, roller shutters, columns and the stormwater pits on the ground all constrain where a downpipe can run. W-40's rear wall has two roller doors, and the designer placed the four downpipes clear of them, at roughly 5 m, 15 m, 25 m and 35 m along the wall.

When spacing is uneven, the longest gutter run to any outlet sets the depth there, and the calculation should be done for that run. A downpipe moved 2 m to clear a door makes one gutter run 7 m instead of 5 m, so the flow there rises from 3.0 to **4.2 L/s** at 5% AEP. The design note records the actual runs, not the ideal ones.

Downpipe positions also have to suit what happens below ground. Each downpipe connects to the site's stormwater system, through a pit or a junction in an underground pipe, and that system must carry the combined flow to the legal point of discharge set by the local council or water authority. On W-40, the four rear downpipes connect to a 150 mm pipe running along the rear of the building to a pit at one corner. Moving a downpipe a few metres on the drawing is cheap; moving it after the underground pipe is laid is not. The roof drainage and site stormwater drawings should be checked together before either is built.

## Brackets keep the fall true

A gutter carrying water is heavy. W-40's gutter, with water 54 mm deep, holds about **8 kg** of water a metre, on top of its own weight, and more if debris or hail collects. It hangs from brackets fixed to the fascia or the rafters, and the brackets set its line and fall.

Brackets must be spaced closely enough that the gutter does not sag between them, at the spacing the gutter's maker specifies for the profile, material and wind region. They must be set to a string line or laser line with the fall marked, so every bracket is at the right height. Expansion joints, Chapter 7's subject, need brackets either side. Stopends and outlets need support close by, because they carry extra load and are where the gutter is cut.

## The gutter's other jobs

A gutter is also part of the roof's edge. It supports the ends of the roof sheets' drip edges, which should project into the gutter far enough that water falls into it rather than running back under the sheets, but not so far that it overshoots in heavy rain. It must be clear of the roof sheeting so that the front edge, not the back, is the overflow. And it must be kept far enough below the roof sheets that leaves and debris can be removed. These details are as much a part of a working gutter as its size.

## A failure case: the sagging gutter

This is an illustration. On another of the owner's buildings, a long eaves gutter was installed with its brackets at about twice the spacing its maker specified, to save time. It looked straight on the day.

Within a year, the gutter had sagged between brackets. Each span had a low point a few millimetres below the brackets either side, and the 1:500 fall, only about 2 mm over a 1.2 m span, could not overcome it. After every shower, a series of shallow ponds remained along the gutter. Leaves settled in them, the ponds stayed wet for days, and rust began at the low points. In heavy rain, debris carried from the ponds partly blocked an outlet, and the gutter overflowed there.

The detection came from a maintenance inspection after rain, which found standing water in a gutter that should have been empty. A string line along the gutter showed the sag pattern clearly. The correction was to add brackets at the specified spacing, reset the gutter to a string line at the correct fall and replace two corroded lengths. The lesson recorded in the maintenance plan was simple: a gutter that holds water after the rain has stopped has a fall problem, and a fall problem becomes a corrosion problem and then an overflow problem.

## How this applies to a small Australian business

Gutters are often chosen by profile and colour, with capacity assumed. Work out the flow at each outlet from the catchment, estimate the flow depth, and compare it with the gutter's effective depth below its front edge. Treat Manning's formula as a comparison tool and use the gutter maker's tested capacity data where it exists. Remember that downpipe spacing changes the answer more than almost anything else. Set the fall to a line, at not less than 1:500, and install brackets at the maker's spacing so the fall survives. A gutter that holds water after rain needs attention before it corrodes.

## Exercise: three downpipes and a door

The builder proposes only three rear downpipes, at 6.7 m, 20 m and 33.3 m along the 40 m wall, so each serves about 13.3 m of gutter. What is the flow per side at each downpipe at 5% AEP? Using the bar chart, about how deep is the water at the outlet, and how much margin remains below the 100 mm effective depth? Would you accept the proposal?

**Worked answer.** Each downpipe collects from about **6.7 m** of gutter on each side. At **0.6 L/s per metre**, that is about **4.0 L/s** per side. The chart gives a flow depth of about **67 mm**, leaving about **33 mm** below the front edge at 5% AEP. At 1% AEP the flow per side rises to about 5.6 L/s and the estimated depth to about 85 mm, leaving 15 mm. Each downpipe also serves more than the 12 m of gutter used as a reference limit. The gutter might carry the flow, but the margin is thin, the reference limit is exceeded, and Chapter 4 shows that the outlets, not the gutter, are usually the limit. The proposal should be declined.
