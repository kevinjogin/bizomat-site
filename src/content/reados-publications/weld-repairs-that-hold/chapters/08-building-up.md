---
book: weld-repairs-that-hold
chapterSlug: building-up-wasted-metal
order: 8
title: "Building up wasted metal"
description: "Survey thinning before deciding on weld build-up, compare deposited metal with an insert, and read published limits as an example of how regulators draw the line."
draft: false
---

Plate does not only crack. It thins. Corrosion, erosion and repeated mechanical work remove metal until a part no longer has the thickness its design assumed. The 1919 Airco booklet describes one such case: firebox edges worn by excessive caulking, by steam escaping through leaking seams and by corrosion. Its remedy was to brush off the rust and build the edge back up with weld, hammering the deposit lightly while it was still red hot.

Weld build-up is attractive because it needs no cutting and no new plate. It also deposits a great deal of heat over a wide area, hides the original thickness under new metal and is difficult to inspect. This chapter sets out how to decide, using a thickness survey, a metal-volume comparison and a published rule as an example of where a regulator has drawn the line.

## Start with a thickness survey

Before deciding anything, measure. An ultrasonic thickness gauge on a marked grid gives a map of remaining thickness, which should be recorded with the minimum, the general level and the extent of thinning. Decide the grid spacing by the size of the area and how uneven the wastage looks; pitted surfaces need closer readings, because a single deep pit can sit between widely spaced points.

The survey answers three questions:

1. **How thin is the thinnest point**, compared with the minimum thickness the design or standard requires?
2. **How large is the thinned area?**
3. **What caused it, and has the cause stopped?** A build-up over active corrosion simply gives the corrosion new metal to consume.

## Laying out the survey grid

A thickness survey is only as good as its grid. Readings taken too far apart can miss the thinnest point; readings taken too close waste time on uniform plate. A practical approach is to start with a coarse grid across the whole suspect area, then add closer readings wherever the coarse grid shows thinning or the surface shows pitting.

This is an illustration. For the tank's 350 mm by 250 mm corroded region, a 50 mm grid gives 8 points along the length and 6 across, or 48 readings. Halving the spacing to 25 mm quadruples the work, to 15 by 11, or 165 readings. The workshop uses the 50 mm grid first, then adds 25 mm readings around the three lowest values.

Good survey practice also includes:

- **Calibrating the gauge** on a reference block of known thickness and similar material before starting, and checking it again at the end.
- **Preparing the surface** at each point, or using a gauge mode designed to read through coatings, because paint and scale can add to the apparent thickness.
- **Recording position and value together**, on a gridded sketch or photograph, so the survey can be repeated at the same points later.
- **Reporting the minimum, the general level and the extent**, not just an average. An average of 8.5 mm can hide a pit at 5 mm.

```figure
type: compare
title: Two survey grids over a 350 × 250 mm area
cols: 50 mm grid | 25 mm grid
caption: Start coarse, then tighten the grid where readings or pitting show it is needed.
- Readings | 48 | 165
- Chance of missing a small pit | Higher | Lower
- *Best use | Mapping the whole area | Around the thinnest readings
```

## Corrosion rate and remaining life

Thickness readings become far more useful when they are compared over time. The simplest estimate of corrosion rate divides the metal lost by the time in service:

**corrosion rate = (original thickness − measured thickness) / years in service**

This is an illustration with assumed figures. If the tank has been in service for about 35 years and the general level of the corroded region has fallen from 10.0 mm to about 6.5 mm, the average rate is:

**(10.0 − 6.5) / 35 = 0.1 mm per year**

If the owner's engineer has set a minimum acceptable thickness of 6.0 mm for that part of the tank, the remaining allowance is 0.5 mm, which at 0.1 mm per year is about 5 years. That estimate is rough, because corrosion is rarely uniform in time: a change in water quality, drainage or coating can make the recent rate much higher or lower than the long-term average. Repeat surveys at the same points are the only reliable way to measure the current rate.

Even as a rough figure, remaining life frames the decision. Five years of allowance points towards a planned repair at a convenient shutdown rather than an emergency, and towards fixing the cause, the standing water, so that the new insert does not follow the same path.

## Compare build-up with an insert by the metal deposited

The tank case gives a direct comparison. This is an illustration. The corroded region near the base measures about 350 mm by 250 mm, with remaining thickness down to 6.5 mm on the nominal 10 mm plate. Suppose the average loss across the region is about 2.5 mm.

Restoring the full thickness by build-up would mean depositing roughly:

**350 × 250 × 2.5 = 218,750 mm³, or about 219 cm³**

At 7.85 g/cm³, that is about **1.72 kg** of weld metal spread over the whole area, plus allowance for grinding back to a smooth surface.

The flush insert from Chapter 6 needs about 1,314 mm of perimeter weld. With the 60° groove from Chapter 3, about 105.7 mm² in 10 mm plate:

**1,314 × 105.7 ≈ 138,900 mm³, or about 1.09 kg**

In this illustration, the insert deposits about a third less metal, concentrates it in a joint that can be inspected by established methods and replaces the wasted plate entirely, rather than burying it under new metal. Build-up still has its place, especially for small, shallow areas or edges, but it is not automatically the smaller job.

```figure
type: compare
title: Restoring a 350 × 250 mm corroded area in 10 mm plate
cols: Weld build-up | Flush insert
best: 2
caption: Illustrative tank case. Build-up spreads heat over the whole area; an insert concentrates it in an inspectable joint.
- Weld metal | About 1.72 kg over the area | About 1.09 kg around the edge
- Wasted plate | Stays, under new metal | Removed
- Inspection | Large surface, harder to assess | Butt weld, established methods
- *Heat input | Spread over the whole region | Concentrated at the perimeter
```

## A published limit as a worked example

Regulators that govern pressure equipment set limits on weld build-up. One readily available example is the United States Federal Railroad Administration's rule for steam locomotive boilers, 49 CFR § 230.33. For unstayed portions of a boiler, it requires written approval before build-up of wasted areas that exceed 100 square inches in total or a depth beyond the smaller of 25% of the minimum required thickness or half an inch. It prohibits weld build-up altogether where a wasted sheet has been reduced to less than 60% of its minimum required thickness. For stayed portions, it requires welded repairs to follow established railroad practice or an accepted national boiler repair standard.

That rule applies to locomotives operating under United States jurisdiction, not in Australia, and it is quoted here only to show how such limits work. Read it against an invented plate.

Suppose an unstayed plate has a minimum required thickness of 8.0 mm, and the thinnest reading is 5.2 mm over a wasted area of 300 mm by 250 mm:

- **Below 60%?** 60% of 8.0 mm is 4.8 mm. The plate is at 5.2 mm, or 65% of the minimum required, so build-up is not prohibited outright.
- **Depth beyond the threshold?** The wastage below the required minimum is 8.0 − 5.2 = 2.8 mm. 25% of 8.0 mm is 2.0 mm, smaller than half an inch, so the depth exceeds the threshold.
- **Area beyond the threshold?** 100 square inches is about 64,516 mm². The wasted area is 300 × 250 = 75,000 mm², which also exceeds it.

Under that rule, the build-up would need prior written approval on two counts. The exercise shows the structure such rules share: an absolute floor below which build-up is not allowed, and thresholds above which a regulator wants to review the repair before it is made.

```figure
type: bars
title: Reading a build-up limit against one plate
unit: mm
max: 9
caption: Illustrative unstayed plate. Below 4.8 mm build-up is prohibited; below 6.0 mm it needs prior approval under the quoted rule.
- Minimum required thickness | 8
- Approval threshold, 2.0 mm below minimum | 6
- *Thinnest reading | 5.2
- Floor, 60% of minimum required | 4.8
```

## When build-up is the sensible choice

Build-up remains useful where:

- the area is small and shallow, such as a worn edge, a local pit or a seating face;
- the cause has been removed, and the surface can be cleaned to sound metal;
- the deposit can be inspected adequately and ground to a profile that does not concentrate stress;
- the applicable standard or approver accepts it for that part and location.

The booklet's caulked edges were a reasonable candidate: narrow, local and caused by a mechanism that a welded seam would remove. A broad corroded panel is usually not.

## How build-up is done well

Where weld build-up is the right repair, a few practices make it more reliable:

- **Clean to sound metal** and confirm by inspection that there are no cracks in the area to be built up.
- **Lay overlapping stringer beads** in a planned pattern, rather than wide weaves, to control heat input and leave a more even surface.
- **Control preheat and interpass temperature** as for any other weld; build-up covers a large area and can accumulate heat.
- **Build slightly above the final surface** and grind back to a smooth profile with gentle transitions at the edges, so there is no step to concentrate stress.
- **Inspect the finished surface** and measure the final thickness to confirm the target was reached.

Where build-up is used to restore a seating face or flange, the final machining or grinding must also restore flatness and surface finish. Wear-resistant overlays, often called hardfacing, are a related but different process, intended to resist abrasion rather than restore load-bearing thickness.

## Hammering the deposit, then and now

The booklet told welders to hammer the built-up edge lightly while it was still red hot. Hammering, or peening, deforms the deposit while it is soft. That stretches it slightly, offsetting some of the shrinkage that would otherwise pull the edge out of shape, and it may have helped close the edge against steam.

Modern practice treats peening as a procedure variable rather than a habit. Done on metal that is too cold, it can crack the deposit. Done on the final layer, it can close surface defects over so that inspection no longer finds them, and it work-hardens the surface. Structural welding codes commonly restrict it, for example by not allowing peening of the root or final layers. Where a procedure does use peening, it states the tool, the passes it applies to and the temperature range. On a modern repair, unrecorded hammering is a deviation, not a craftsman's flourish.

## Inspecting a build-up

Build-up is harder to inspect than a butt weld because the defects that matter lie parallel to the surface: lack of fusion between the deposit and the original plate, lack of fusion between neighbouring beads, and porosity trapped under overlapping passes. A sound inspection plan for build-up therefore works in stages:

- **Inspect each layer before the next.** Remove slag, check for undercut at bead edges and porosity in the surface, and correct faults while they are still accessible.
- **Apply a surface method after final grinding**, after the hold time the procedure specifies if hydrogen cracking is possible.
- **Repeat the thickness survey on the original grid.** A before-and-after map at the same points is the most persuasive single record of a build-up, because it shows the restored thickness exactly where the loss was measured.
- **Examine the fusion interface ultrasonically** where the standard or the consequence of failure calls for it.

Compare the two maps point by point. A reading lower than planned may mean the deposit was ground back too far. A reading that will not settle, or that jumps between values, can indicate a lamination or poor fusion at the interface and deserves a closer look.

## The tank case: two answers on one tank

This is an illustration. The workshop's 50 mm survey confirms a corroded region of about 350 mm by 250 mm, or 87,500 mm², with a minimum of 6.5 mm against the owner's engineer's 6.0 mm minimum, and an estimated five years of remaining allowance. The cause is standing water against the plate.

Build-up would deposit about 1.72 kg of weld metal over the whole region and leave 87,500 mm² of fusion interface to inspect, over plate that would keep corroding from the outside unless the drainage were fixed. The insert deposits about 1.09 kg in a perimeter butt weld that established methods can inspect, and it removes the wasted plate. The workshop chooses the insert, fixes the drainage, and records why.

The closer 25 mm readings also find two isolated pits elsewhere on the shell, each about 20 mm across and 1.5 mm deep, in plate that is otherwise at full thickness. Treating each pit as a shallow disc, the metal to replace is about:

**π × 10² × 1.5 ≈ 471 mm³, or about 3.7 g of weld metal**

These are small, local, with a known cause and surrounded by sound plate. The workshop grinds each pit to a smooth dish, deposits a few stringer beads to the procedure, grinds flush, measures the thickness and applies penetrant testing. Same tank, two different repairs, each chosen by size, cause and how well the result can be inspected.

## Exercise: apply the published thresholds

An unstayed plate has a minimum required thickness of 9.0 mm. The thinnest reading is 6.1 mm over an area of 180 mm by 200 mm. Using the thresholds quoted above as an illustration only, decide whether build-up would be prohibited, and whether approval would be needed on depth, area or both.

60% of 9.0 mm is **5.4 mm**; the plate is at 6.1 mm, so build-up is not prohibited. The depth below minimum is **9.0 − 6.1 = 2.9 mm**, and 25% of 9.0 mm is **2.25 mm**, so approval would be needed on depth. The area is **180 × 200 = 36,000 mm²**, below about 64,516 mm², so the area threshold is not exceeded. Explain why an engineer might still prefer an insert here.
