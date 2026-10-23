---
book: weld-repairs-that-hold
chapterSlug: building-up-wasted-metal
order: 8
title: "Building up wasted metal"
description: "Survey thinning before deciding on weld build-up, compare deposited metal with an insert, and read published limits as an example of how regulators draw the line."
draft: true
---

Plate does not only crack. It thins. Corrosion, erosion and repeated mechanical work remove metal until a part no longer has the thickness its design assumed. The 1919 Airco booklet describes one such case: firebox edges worn by excessive caulking, by steam escaping through leaking seams and by corrosion. Its remedy was to brush off the rust and build the edge back up with weld, hammering the deposit lightly while it was still red hot.

Weld build-up is attractive because it needs no cutting and no new plate. It also deposits a great deal of heat over a wide area, hides the original thickness under new metal and is difficult to inspect. This chapter sets out how to decide, using a thickness survey, a metal-volume comparison and a published rule as an example of where a regulator has drawn the line.

## Start with a thickness survey

Before deciding anything, measure. An ultrasonic thickness gauge on a marked grid gives a map of remaining thickness, which should be recorded with the minimum, the general level and the extent of thinning. Decide the grid spacing by the size of the area and how uneven the wastage looks; pitted surfaces need closer readings, because a single deep pit can sit between widely spaced points.

The survey answers three questions:

1. **How thin is the thinnest point**, compared with the minimum thickness the design or standard requires?
2. **How large is the thinned area?**
3. **What caused it, and has the cause stopped?** A build-up over active corrosion simply gives the corrosion new metal to consume.

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

## Exercise: apply the published thresholds

An unstayed plate has a minimum required thickness of 9.0 mm. The thinnest reading is 6.1 mm over an area of 180 mm by 200 mm. Using the thresholds quoted above as an illustration only, decide whether build-up would be prohibited, and whether approval would be needed on depth, area or both.

60% of 9.0 mm is **5.4 mm**; the plate is at 6.1 mm, so build-up is not prohibited. The depth below minimum is **9.0 − 6.1 = 2.9 mm**, and 25% of 9.0 mm is **2.25 mm**, so approval would be needed on depth. The area is **180 × 200 = 36,000 mm²**, below about 64,516 mm², so the area threshold is not exceeded. Explain why an engineer might still prefer an insert here.
