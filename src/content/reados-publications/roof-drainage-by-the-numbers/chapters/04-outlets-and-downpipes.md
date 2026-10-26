---
book: roof-drainage-by-the-numbers
chapterSlug: outlets-and-downpipes
order: 4
title: "Outlets and downpipes"
description: "Check the outlet, the usual bottleneck in roof drainage: weir and orifice flow into a downpipe, the depth each outlet needs, nozzles, sumps, strainers, offsets and the connection below ground."
draft: false
---

A gutter can be large enough and still overflow, because the water has to leave it through a hole in its sole. That hole, the outlet, is a short, sharp restriction, and in most roof drainage systems it is the part that limits capacity. Water piles up over the outlet until it is deep enough to push the flow through, and if the depth needed is more than the gutter has, the gutter spills right there, beside the downpipe, while the rest of it looks half empty. People who see that often conclude the downpipe is blocked. Frequently it is simply too small an outlet for the flow.

This chapter checks W-40's rear outlets. It explains how water enters an outlet, first as a weir over the rim and then as an orifice running full, works out the water depth each outlet needs, finds that the four-downpipe arrangement from Chapter 3 does not work with the outlets first drawn, compares the options, and settles on six downpipes. It then covers strainers, nozzles, offsets and the connection to the stormwater system. The failure case is a set of leaf baskets that halved the outlets' capacity on a neighbouring building.

## How water enters an outlet

Picture a round hole in the sole of a gutter, with a downpipe below. When only a little water arrives, it spills over the rim of the hole on all sides, like water over the edge of a dam. That is **weir flow**, and the flow depends on the length of the rim, the hole's circumference, and on the depth of water above the rim raised to the power of one and a half.

As the flow increases, the water piles higher, until the hole is running full and the water above it is pushing straight down through it. That is **orifice flow**, and the flow depends on the hole's area and on the square root of the depth.

At any depth, the outlet passes the smaller of the two. At shallow depths the rim limits the flow; at greater depths, the area does. The water depth over the outlet must be enough for the outlet to pass the arriving flow, and it adds to whatever depth the gutter itself needs.

```figure
type: formula
title: Capacity of a round outlet, as a weir and as an orifice
formula: weir Q = 1.77 × (π × D) × h^1.5        orifice Q = 0.6 × (π × D² ÷ 4) × √(2 × 9.81 × h)        capacity = the smaller
caption: This is an illustration in metres and cubic metres a second, using a discharge coefficient of 0.6 for both, a teaching assumption. The weir coefficient 1.77 is (2/3) × 0.6 × √(2 × 9.81). Real outlets differ; makers' tested data govern.
- Outlet diameter D | 0.090 m
- Water depth over the outlet h | 0.050 m
step: weir Q = 1.77 × 0.283 × 0.050^1.5 ≈ 0.0056 m³/s = 5.6 L/s
step: orifice Q = 0.6 × 0.00636 × √(0.981) ≈ 0.0038 m³/s = 3.8 L/s
step: capacity at 50 mm depth ≈ 3.8 L/s, limited by the orifice
```

## The first design does not work

W-40's first drawings showed four rear downpipes with **90 mm** round outlets. Each outlet receives **6.0 L/s** at the 5% AEP intensity, 3.0 L/s from each side. At a water depth of 50 mm, the 90 mm outlet passes only about **3.8 L/s**. To pass 6.0 L/s, the water over it must be about **126 mm** deep.

The gutter's effective depth, to its front edge, is 100 mm. So at the 5% AEP flow, the gutter would spill over its front edge at every outlet, even though Chapter 3 showed the gutter itself needs only about 54 mm to carry the flow along its length. The outlet, not the gutter, is the limit. This is the most common finding in any roof drainage check, and it is invisible unless the outlet is checked separately.

## Compare the options

There are three ways to fix it: bigger outlets, more outlets, or a sump under the outlet that gives more depth.

```figure
type: compare
title: Rear outlet options checked against the 100 mm effective gutter depth
cols: Water depth needed at 5% AEP | Water depth needed at 1% AEP | Verdict
caption: This is an illustration using the weir and orifice estimates with a coefficient of 0.6. The depth needed must stay below the gutter's 100 mm effective depth, with margin, for the gutter to carry the storm without spilling.
- Four downpipes, 90 mm outlets | about 126 mm | about 243 mm | fails at 5% AEP
- Four downpipes, 100 mm outlets | about 83 mm | about 159 mm | thin margin at 5%; spills well before 1%
- Four downpipes, 150 mm outlets in sumps | about 37 mm | about 46 mm | works; sumps add cost and detailing
- *Six downpipes, 100 mm outlets | about 37 mm | about 71 mm | works with margin at both
```

The designer chose **six downpipes with 100 mm outlets**. Each now serves about 6.7 m of gutter, 80 m² of roof, and receives **4.0 L/s** at 5% AEP and about **5.6 L/s** at 1% AEP. The outlets need about 37 mm and 71 mm of water respectively. The gutter's own flow depth from Chapter 3, with six downpipes, is about 40 mm and 51 mm. At the outlet end, the water must satisfy both, so the deeper figure governs: about **40 mm** at 5% AEP and about **71 mm** at 1% AEP, leaving 60 mm and 29 mm below the front edge.

Six downpipes also bring the gutter served by each well under the 12 m reference from the Housing Provisions, and add redundancy: if one outlet blocks, its neighbours are only 6.7 m away.

The sump option deserves its place in the table. A sump, or rain box, is a small, deeper box under the gutter at the outlet, giving the water more depth to drive it through a larger outlet. Sumps are standard in box gutters, Chapter 5's subject. Under an eaves gutter, they are visible, need careful sealing and add fabrication, which is why the designer preferred more downpipes here.

## Nozzles and outlet shape

The figures above assume a plain round hole with a sharp edge. The way the outlet is formed changes its capacity.

A **nozzle**, an outlet whose top is flared or funnel-shaped and narrows into the downpipe, guides water in smoothly and passes noticeably more than a sharp-edged hole of the same pipe size. Many proprietary outlets are pressed with a short flared nozzle for this reason. A **flat-cut outlet**, where the downpipe is simply pushed up through a hole cut in the gutter sole, or a rectangular downpipe connected through a slot, can pass less than the estimates suggest, because water must turn sharply at the edges.

The estimates in this chapter use a discharge coefficient of 0.6 for both weir and orifice behaviour, a cautious value for a sharp-edged opening. For real work, outlet makers' tested capacities, given as flow against water depth for each outlet, are much better than any formula. Where they are not available, the formula with a cautious coefficient gives a defensible estimate.

## Test an outlet when the numbers are close

Where no tested data exist and the margin is thin, a simple bench test settles the question. The W-40 fabricator set up a 2 m length of the chosen gutter, level, with one 100 mm outlet and its strainer, on trestles over a drum. A hose fed water into the gutter's closed end, and the flow was measured by timing how long the drum took to fill to a marked volume. At each flow, the water depth over the outlet was read with a steel rule held against the gutter's back.

At about 4 L/s, the measured depth was a little under the 37 mm estimate, because the pressed outlet's flared top performed better than the sharp-edged hole the formula assumes. At the highest flow the hose could supply, about 5 L/s, the depth was about 55 mm. The test took an afternoon and gave the designer confidence that the estimates were cautious rather than optimistic. The results were filed with the design note.

## Strainers and leaf guards

Outlets clog. Leaves, seed pods, grit and litter collect at the outlet, because that is where the water takes them. A **strainer**, a domed or flat grille over the outlet, stops debris entering the downpipe, where a blockage is much harder to clear. It also reduces the outlet's capacity, and more so as debris collects on it.

A common design allowance assumes an outlet is partly blocked. If half the outlet's area is lost, its orifice capacity halves. W-40's 100 mm outlet, half blocked, would pass only about **2.8 L/s** at the 71 mm depth that the unblocked outlet needs for the 1% storm. That is why the overflow paths in Chapter 6 are not optional: they are what protects the building when an outlet is partly blocked, which in practice is much of the time between cleans.

A domed strainer, which stands up from the gutter sole, keeps working longer than a flat one, because debris collects around its base while water still enters over the top. Leaf guards over the whole gutter keep leaves out of the gutter altogether, but they need cleaning too and can stop overflow if they cover the front edge, as Chapter 6's failure case shows.

## The downpipe itself

Below a properly sized outlet, a vertical downpipe of the same or larger size generally carries what the outlet admits, because falling water accelerates and the pipe is rarely the restriction. Trouble starts where the downpipe changes direction. **Offsets**, the bends that take a downpipe out around a plinth, a beam or a doorway, slow the water and can back it up if they are too flat or too tight. A long horizontal run at the foot of a downpipe needs fall, like any drain.

W-40's rear downpipes run straight down the wall to stormwater pits at ground level, with one offset where two pass around a column base. The offsets were fabricated with bends no sharper than 45°, a short straight between them and a cleaning eye at the lower bend. The source book that informed this one, from 1922, devotes a whole section to such offsets, then called conductor offsets. The geometry of making them has changed little; what has changed is that the outlet above is now checked by numbers rather than by eye.

## Connect to the stormwater system

The downpipe ends at a connection to the site's stormwater system, through a pit, a junction or a rainwater tank. The connection must take the full flow without backing up, and it must be watertight where it enters the ground. The underground system is designed separately, usually by the civil engineer, for the whole site's flows, and its design depends on local authority requirements. Each downpipe's flow, from this chapter, is one of its inputs, so the two designs must be checked together.

Where a downpipe discharges to a rainwater tank, the tank's inlet screen and overflow must pass the full 5% AEP flow, and the tank's overflow must connect to the stormwater system or a safe discharge point. A tank inlet sized for gentle rain becomes the system's new bottleneck in a storm.

```figure
type: checklist
title: Outlet and downpipe checks for W-40's rear gutter
caption: This is an illustration of the designer's checklist. Each line was recorded in the design note with its numbers.
- Water depth needed at each outlet, 5% AEP, below the effective gutter depth with margin | about 40 mm against 100 mm
- Water depth at 1% AEP, or an overflow path designed for the excess | about 71 mm; overflow in Chapter 6
- Outlet type and its tested capacity, or a cautious coefficient | 100 mm flared nozzle; formula with 0.6
- Domed strainers on every outlet | yes
- Offsets no sharper than 45°, with a cleaning eye | two downpipes
- Downpipe flows passed to the stormwater designer | six at 4.0 L/s and 5.6 L/s
- x Assuming the gutter's capacity is the system's capacity | the outlet usually limits
```

## A failure case: the leaf baskets

This is an illustration. A neighbouring building's gutters overflowed beside their downpipes in every heavy storm, although the gutters were large and new. The owner had them cleaned twice, without improvement.

An inspection during rain found the cause. Each outlet had been fitted with a deep leaf basket, a mesh cup sitting inside the top of the downpipe, sold to keep leaves out. The baskets were clean, but their mesh and frame obstructed about half the outlet's area, and they sat below the gutter sole, so the outlet could never behave as a free weir. Each outlet's capacity was roughly halved. At the 5% AEP flow, the water needed to be far deeper than the gutter allowed.

The detection came from watching the gutter in rain, which showed water piling up only at the outlets while the gutter elsewhere ran shallow. The correction was to remove the baskets, fit flared outlets with domed strainers that stand above the sole, and install a cleanable leaf guard over the gutters, set back from the front edge so it could not interfere with overflow. The overflow at the outlets stopped.

## How this applies to a small Australian business

When gutters overflow beside their downpipes, the outlet is usually the cause. Check outlets separately from the gutter: work out the water depth each outlet needs for its flow, using the maker's tested data or a cautious formula, and compare it with the gutter's depth below its front edge. Use more downpipes, larger flared outlets or sumps if the depth is too great. Fit strainers that stand above the sole, not baskets inside the outlet. Keep offsets gentle and cleanable, and give the stormwater designer the flow from every downpipe.

## Exercise: the sump alternative

Instead of six downpipes, the builder proposes keeping four downpipes, each with a **150 mm** outlet in a sump under the gutter. Each outlet receives 6.0 L/s at 5% AEP and about 8.3 L/s at 1% AEP. Using the weir and orifice estimates, about how deep must the water be over each outlet? If the sump's top is level with the gutter sole, and the gutter's effective depth is 100 mm, is there margin?

**Worked answer.** For the 150 mm outlet, the weir estimate at depth h is **1.77 × π × 0.15 × h^1.5** and the orifice estimate **0.6 × π × 0.15² ÷ 4 × √(2 × 9.81 × h)**. Trying depths, the outlet passes 6.0 L/s at about **37 mm** and 8.3 L/s at about **46 mm**, limited by the weir at those depths. Both are well below the gutter's 100 mm effective depth, so there is ample margin, and the sump adds more. The sump option works hydraulically. The choice between it and six downpipes rests on cost, appearance and the risk of leaks at four sumps, against two extra downpipes and their stormwater connections.
