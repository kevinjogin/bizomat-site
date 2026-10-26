---
book: roof-drainage-by-the-numbers
chapterSlug: catchments-and-flow
order: 2
title: "Catchments and flow"
description: "Turn a roof into flows: plan catchment areas, walls that shed rain onto roofs, the rational formula in litres a second, splitting catchments between outlets and concentrated flow from upper roofs."
draft: false
---

A design intensity tells you how hard it rains. To size anything, you need to know how much water arrives where: how many litres a second reach each gutter, each outlet and each box gutter sump. That depends on the area of roof draining to each point, on any walls that shed water onto the roof, and on how the roof is divided between outlets. Most drainage errors that are not about the design storm are about catchment: an area counted twice, a wall forgotten, an upper roof's downpipe discharging where nobody expected.

This chapter turns W-40's roof into flows. It measures catchments in plan, adds the share of a parapet wall that sheds rain onto the roof, applies the rational formula to get litres a second, divides the catchments between outlets, and checks that the 5-minute storm is the right one for a roof this size. The failure case is a neighbouring building where an upper roof discharged onto a lower roof's gutter at one point and overflowed it there every heavy storm.

## Measure the catchment in plan

Rain falls more or less vertically, so the amount landing on a roof depends on the roof's area in plan, the area of its shadow on the ground at noon, not its sloping area. W-40's rear slope is 12 m wide in plan and 40 m long, so its catchment is **480 m²**. Its sloping length, 12 m divided by the cosine of 5°, is about 12.05 m, and its sloping area about 481.8 m², only 0.4% more. At low pitches the difference does not matter.

At steep pitches, and where wind drives rain at an angle, a roof facing the wind catches more rain than its plan area suggests. Some design methods increase the catchment of sloping roofs to allow for this. AS/NZS 3500.3 sets out how for the roofs it covers, and its method should be followed where it applies. W-40's 5° roof is close enough to flat that this book uses plan area.

## Add the walls that shed onto the roof

Rain driven by wind strikes vertical surfaces and runs down them. Where a wall rises above a roof, the water running down the wall lands on the roof below it. W-40's front parapet rises **1.0 m** above the roof along its full 40 m length. Its inside face is **40 m²** of vertical surface draining straight into the box gutter.

Design methods add a share of such a wall's area to the catchment below it. The share depends on the method, the wall's orientation and the exposure. This book uses **half the wall's area** as a teaching assumption, so the parapet adds **20 m²** to the front catchment, making it **500 m²**. A real design uses the share set by the applicable method.

The outside face of the parapet, facing the street, drains to the ground, not the roof, and does not count. Nor does the ridge: each slope drains only its own side.

## The rational formula

For a roof, almost all the rain that falls runs off. Roofs absorb little, store little and lose little to evaporation during a short storm, so roof drainage design takes all of it as runoff. The flow is then the intensity multiplied by the area, converted to convenient units.

```figure
type: formula
title: Flow from a roof catchment
formula: Q (L/s) = I (mm/h) × A (m²) ÷ 3,600
caption: This is an illustration for W-40's rear slope. One millimetre of rain on one square metre is one litre, and an hour is 3,600 seconds, so mm/h × m² ÷ 3,600 gives litres a second. All the rain is taken as runoff.
- Rear slope catchment | 480 m²
- 5% AEP intensity | 180 mm/h
- 1% AEP intensity | 250 mm/h
step: Q at 5% AEP = 180 × 480 ÷ 3,600 = 24.0 L/s
step: Q at 1% AEP = 250 × 480 ÷ 3,600 ≈ 33.3 L/s
```

Twenty-four litres a second is a lot of water: a household bucket filled every half second, arriving along a 40 m gutter. It is the whole slope's flow; the next step is to divide it between outlets.

## Divide the catchment between outlets

Each outlet collects the water from the part of the roof that drains to it. On a simple slope with an eaves gutter, each downpipe collects from the length of gutter that falls towards it. With downpipes evenly spaced and the gutter falling towards each from both sides, each downpipe's catchment is the gutter length it serves multiplied by the slope's width.

Chapter 3 first considers **four** downpipes on the rear wall, each serving 10 m of gutter, the first and last 5 m from the gutter ends. Each then drains **10 × 12 = 120 m²**, giving **6.0 L/s** at 5% AEP and about **8.3 L/s** at 1% AEP, with half of each arriving from either side, **3.0 L/s** and about **4.2 L/s**.

The front box gutter falls from a high point in the middle to a sump and rainhead at each end. Each end takes half the 500 m² front catchment, **250 m²**, giving **12.5 L/s** at 5% AEP and about **17.4 L/s** at 1% AEP.

```figure
type: compare
title: W-40's catchments and flows
cols: Catchment | 5% AEP flow | 1% AEP flow
caption: This is an illustration at 180 mm/h and 250 mm/h. Rear downpipe flows assume four evenly spaced downpipes, which Chapter 4 revisits. The front catchment includes half the parapet's inside face.
- Rear slope, whole | 480 m² | 24.0 L/s | 33.3 L/s
- Rear, one of four downpipes | 120 m² | 6.0 L/s | 8.3 L/s
- Rear, one side of one downpipe | 60 m² | 3.0 L/s | 4.2 L/s
- Front slope with parapet share | 500 m² | 25.0 L/s | 34.7 L/s
- *Front, one box gutter end | 250 m² | 12.5 L/s | 17.4 L/s
```

## How flow builds along a gutter

The flow in a gutter is not the same everywhere. At a high point, where the gutter starts, it carries nothing. Every metre of gutter towards the outlet collects the runoff from another metre of roof, so the flow grows steadily and reaches its largest value just before the outlet.

For W-40's rear slope, each metre of gutter collects from a strip of roof 12 m long and 1 m wide, 12 m². At 180 mm/h that strip delivers **180 × 12 ÷ 3,600 = 0.6 L/s**. So the flow in the rear gutter is **0.6 L/s for every metre** from its high point. Five metres from a high point, at a downpipe, it is **3.0 L/s**, the figure in the table. At 250 mm/h, the rate is about 0.83 L/s a metre.

This simple picture explains two practical points. The gutter only needs its full capacity near the outlets, which is why the outlet end is where it overflows first. And doubling the distance between downpipes doubles the flow each gutter section must carry, which is why outlet spacing is one of the most effective levers a designer has, as Chapter 3 shows.

## Things on the roof that redirect water

Roofs are rarely as clean as a drawing. Skylights, roof ventilators, plant platforms, walkways and the upstands around them all interrupt the flow down the sheeting. Water running down the roof meets the upstand on the high side and must be turned around it, usually by a back gutter or a small diverting ridge, often called a cricket or saddle. That concentrates the flow from the whole width of the penetration into the sheet pans on either side. A wide penetration can double the flow in those pans.

The catchment for the gutter is unchanged, because the water still reaches the same gutter. What changes is the local flow in the sheeting, which can overtop the sheet's ribs and find its way through side laps. The roof sheet manufacturer's data gives the length of roof each profile can drain at a given intensity, and wide penetrations near the top of a long roof are worth checking against it.

## Check that five minutes is right

Chapter 1 chose a five-minute duration because water reaches a roof's outlets quickly. W-40 can be checked. Rain on the ridge travels about 12 m down the slope as a thin sheet, at an assumed **0.5 m/s**, taking about **24 seconds**. In the box gutter, water from the high point travels up to 20 m to an end sump, at an assumed 0.5 m/s, taking about **40 seconds**. The longest travel time is therefore about a minute, well under five. The roof responds to the rain almost at once, and the five-minute intensity is, if anything, slightly cautious for a roof this size. Very large roofs, with long gutters and long travel times, are where longer durations and the detailed methods of AS/NZS 3500.3 come into their own.

## Watch for concentrated flow

Catchment arithmetic assumes rain lands evenly and runs to the nearest outlet. Two common features break that assumption.

**Upper roofs discharging onto lower roofs.** When a downpipe from an upper roof discharges onto a lower roof, the upper roof's whole flow lands at one point. Unless it is spread, it runs in a concentrated stream down the lower roof's sheeting and arrives at one short length of the lower gutter. The upper roof's catchment must be added to the lower outlet that receives it, and the discharge should be spread across several sheet pans with a spreader, or piped directly to the lower gutter's outlet, so it does not overload the sheeting's laps or one section of gutter. The concentrated stream also wears and stains the sheeting's coating where it lands, shortening the roof's life at that spot.

**Valleys.** Where two roof planes meet in a valley, the valley collects water from both and delivers it to one point on the gutter below, often at a corner. The outlet there carries far more than the average.

W-40 has neither, which keeps the case simple. Its owner's plans include a small air-conditioning plant platform with its own roof on the front slope in a few years' time. The design note records that its downpipe must be piped into the box gutter's nearest sump, with that sump's catchment increased to match, rather than discharged onto the roof.

```figure
type: steps
title: Working out flows for each outlet
caption: This is an illustration of the order the W-40 designer followed. Each step is recorded in the design note so it can be checked.
- Mark the drainage | ridges, high points, valleys, falls and every outlet on the roof plan
- Measure plan areas | the area draining to each outlet, from the plan, not the sloping surface
- Add walls | a share of any wall that sheds onto the roof, using the applicable method
- Add upper roofs | any roof whose downpipe discharges onto this roof, at the outlet that receives it
- Apply the formula | Q = I × A ÷ 3,600 for each outlet, at each design probability
- *Check the totals | the outlets' catchments must add up to the whole roof, with nothing missed or counted twice
```

Round flows to one decimal place in litres a second, but keep the unrounded areas in the design note, so later changes to the roof can be recalculated without accumulating rounding errors. The last step catches more errors than any other. W-40's four rear downpipes at 120 m² add up to 480 m², and its two front ends at 250 m² add up to 500 m², matching the slopes plus the parapet share.

## A failure case: the upper roof

This is an illustration. Next door to W-40, a neighbour's building has a two-storey office whose 150 m² roof drains through one downpipe onto the single-storey warehouse roof below. The downpipe discharges straight onto the lower roof sheeting, about 2 m from the lower roof's eaves gutter.

At 180 mm/h, the upper roof alone sends **150 × 180 ÷ 3,600 = 7.5 L/s** down that downpipe. It runs as a stream down two or three sheet pans and arrives at a few metres of the lower gutter, which was sized, like the rest of that gutter, for about 4 L/s from its own catchment. In every heavy storm, the lower gutter overflowed at that one point, and over time the overflow stained the wall and rotted a timber window frame below.

The detection came from the staining, which appeared only at one spot along an otherwise sound gutter. The investigation traced it to the upper roof's discharge, which nobody had counted in the lower gutter's catchment. The correction was to pipe the upper downpipe across the lower roof to the nearest lower outlet, whose catchment and outlet size were then checked with the extra 150 m² included, and to add a second outlet near the original discharge point.

## How this applies to a small Australian business

Building owners and installers often size gutters by the roof's total area and forget where the water actually goes. Draw the roof plan, mark every ridge, valley, high point and outlet, and work out the plan area draining to each outlet. Add a share of any wall that sheds rain onto the roof, and the whole catchment of any upper roof whose downpipe discharges onto it. Calculate litres a second for each outlet at each design probability, and check that the outlets' areas add up to the whole roof. When an upper roof is added, or an existing roof extended, redo the catchments: a gutter that was right before may be wrong now.

## Exercise: a taller parapet

During design, the architect proposes raising W-40's parapet to **2.0 m** above the roof for appearance. Using the same half-share assumption, what is the new front catchment, the catchment at each box gutter end, and the flow at each end at 5% and 1% AEP? By how much has the 1% flow increased?

**Worked answer.** The inside face becomes **40 × 2.0 = 80 m²**, of which half, **40 m²**, is added. The front catchment becomes **480 + 40 = 520 m²**, and each end **260 m²**. At 5% AEP each end receives **180 × 260 ÷ 3,600 = 13.0 L/s**, and at 1% AEP about **250 × 260 ÷ 3,600 ≈ 18.1 L/s**. The 1% flow rises from about 17.4 to 18.1 L/s, an increase of about **4%**. That is small, but it must be carried into the box gutter, sump and overflow checks in Chapters 5 and 6.
