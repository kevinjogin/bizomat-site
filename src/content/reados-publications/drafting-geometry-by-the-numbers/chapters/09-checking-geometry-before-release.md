---
book: drafting-geometry-by-the-numbers
chapterSlug: checking-geometry-before-release
order: 9
title: "Checking geometry before it leaves the drafter"
description: "A repeatable check of 2D geometry before release: closure, duplicates, entity counts, critical coordinates, webs and overrides, with independent calculations and clear limits."
draft: false
---

Every chapter so far has ended its constructions with a check. This chapter gathers those checks into a routine that a drafter runs on every profile before it is released, and that a second person can run without having drawn it. The aim is not to inspect everything, which no one has time for, but to test the few things whose failure would be expensive or invisible: a profile that does not close, a feature cut twice, a hole that is slightly off its pitch circle, a dimension that says one thing while the geometry says another.

Good checking is independent. Measuring a distance in the CAD file and comparing it with the dimension the same file displays proves nothing, because both come from the same geometry. Comparing it with a value calculated from the design, or measured by a different route, proves a great deal. The running case puts the motor plate through the routine and finds a fault that looked fine at every zoom.

## What to check, and against what

A useful check has three parts: a quantity to measure, an expected value from an independent source, and a limit for the difference. Without the limit, every check either passes everything or fails on rounding noise.

For geometry built exactly, the limit can be very small. If the design says the diagonal of the motor holes is 100 mm and the geometry was built by construction, the listed value should be 100.000 at three decimal places, and anything beyond about 0.001 mm means the construction was not what the drafter thought. For geometry traced from a scan or imported from another system, the limit must be larger and stated, because the source itself is approximate.

The independent sources are the ones developed earlier in this book:

- **design values** from the specification, such as the 100 mm pitch circle;
- **derived values** calculated by hand or in a spreadsheet, such as the 70.711 mm chord, the 46.989 mm slot chord or the 25,649.51 mm² net area;
- **second constructions**, such as solving a triangle by the cosine rule and measuring the same distance in the file.

```figure
type: compare
title: Critical values for the motor plate
cols: Expected | Source | Listed in the file | Difference
caption: This is an illustration. Each expected value comes from the design or a hand calculation, never from the file's own dimensions.
- Bore centre O | (110.000, 70.000) | Design | (110.000, 70.000) | 0
- Motor hole diagonals | 100.000 mm, both | Pitch circle | 100.000, 100.000 | 0
- Motor hole neighbour spacing | 70.711 mm | 100 × sin 45° | 70.711 | 0
- Pivot P to bore O | 102.956 mm | √(90² + 50²) | 102.956 | 0
- Slot ends from P | 180.000 mm at 5° and 20° | Design | 180.000, 180.000 | 0
- Slot chord S1 to S2 | 46.989 mm | 2 × 180 × sin 7.5° | 46.989 | 0
- *Net area of the profile | 25,649.51 mm² | Composite table | 25,649.51 | 0
```

## Closure, duplicates and strays

The most damaging faults are not wrong numbers but wrong topology: profiles that do not close, entities drawn twice, and fragments left behind from construction. They are also the faults the eye is worst at finding, because they look identical to correct geometry.

**Closure.** Every cutting profile must be one closed boundary. Join each profile into a closed polyline, or ask the software to build a region from it, and confirm it reports an area. An open profile reports none. Chapter 1's 0.004 mm gap was found this way.

**Duplicates.** Two identical lines, arcs or circles on top of each other are invisible. On a cutting machine each is cut, doubling pierce and cut time, scorching the edge and sometimes stopping the job. Most CAD programs have a command that finds and deletes overlapping or duplicated objects; run it, and note how many it removes. Any number above zero is worth understanding before the file is released, because it means someone's construction did not go as planned.

**Strays.** Construction points, zero-length lines, tiny arcs from a failed fillet and text left on a cutting layer all reach the machine if they are on a layer it reads. Freeze or delete construction layers before export, and list what remains.

**Elevation.** In a 2D drawing, all geometry should sit at zero elevation. An object drawn at an elevation of 0.5 mm looks the same in plan, but some exports and snaps treat it as 3D, and a distance measured from it includes the height. Listing a few objects, or setting all elevations to zero, removes the doubt.

## Counting the profiles

The simplest topological check is a count. The drafter knows how many closed profiles the part should have; the file should have exactly that many on its cutting layer.

For the motor plate, the expected count is eight: one outline, one bore, four motor holes, one pivot hole and one slot. Each closed profile also means one pierce, the point where the cutting beam starts, so the count goes straight into the cutting estimate. A file with more profiles than expected has duplicates or strays; one with fewer has a missing feature or two features merged.

```figure
type: stats
title: Counts that describe the motor plate's cutting file
caption: This is an illustration. These numbers are known before the file is opened, so a mismatch in any of them is a finding.
- 8 | Closed profiles | Outline, bore, four holes, pivot, slot
- 8 | Pierces | One per profile
- 0 | Duplicate objects | After the overlap command
- * 1 | Profiles not at zero elevation | Must be 0 before release
```

## The running case: the check that found twelve profiles

This is an illustration. When the drafter ran the routine on the plate before release, every critical value in the comparison table matched. The profile count did not: the cutting layer held **twelve** closed profiles, not eight.

Listing the profiles showed that the four motor holes were each there twice. The drafter had placed the first hole by polar entry, arrayed it four times about O, then undone and redone the array while experimenting with the start angle. One redo had left a second complete array on top of the first. The overlap command removed four circles, and the count fell to eight.

The listing also showed one profile, the pivot hole, at an elevation of 0.5 mm, inherited from a block that had been exploded. In plan it was exactly at (20, 20). The drafter set its elevation to zero.

Neither fault would have changed a dimension on the drawing. Both would have reached the cutter: the doubled holes as four extra pierces and a burnt edge on each hole, the elevated circle as a possible rejection by the contractor's import filter. The count found both in under a minute.

## Webs, minimum features and symmetry

Once the topology is right, check the geometry against the limits the design sets. For the plate, the engineer's minimum web is 15 mm, and the drafter checks every web that could approach it, measuring to the right boundary as Chapters 3 and 4 showed:

- slot end S1 to the right edge: 15.19 mm, the thinnest web on the plate;
- slot end S2 to the chamfer: 25.82 mm;
- top right motor hole to the chamfer: 40.96 mm;
- pivot hole to the bottom and left edges: 14.5 mm from the hole's edge.

The last line is a finding. The pivot hole's centre is 20 mm from each edge and its radius is 5.5 mm, so the web is 14.5 mm, below the 15 mm minimum. The drafter raised it with the engineer, who accepted it: the minimum was set for the slot ends, which carry the adjustment load, and the pivot boss is backed by a washer. The drafter recorded the acceptance on the drawing's construction layer. A check that finds something the design has already allowed for is still a good check; the record shows it was seen.

Symmetry checks catch rotated or mirrored errors. The four motor holes should average to the bore centre; the two slot ends should be the same distance from P; a mirrored part should have mirrored coordinates. These take seconds with a coordinate listing.

```figure
type: checklist
title: Release check for a 2D cutting profile
caption: Run in this order. Topology first, because a wrong count or an open profile makes every later measurement doubtful.
- Profiles close | Each boundary joins into a closed polyline or region that reports an area
- Count matches | Closed profiles equal the expected number; here 8
- No duplicates | Overlap command finds nothing, or every removal is explained
- All at zero elevation | Listed or forced to zero
- Critical values match | Compared with design or hand-calculated values to 0.001 mm
- Webs at or above the minimum | Measured to the true nearest boundary; exceptions recorded
- Area and centroid match the hand check | Net area 25,649.51 mm², centroid (105.89, 67.46)
- x Dimension overrides | Any overridden dimension is a finding until explained
- ? Units | Drawing units millimetres; confirm the receiving system reads them as millimetres
```

## Dimensions that disagree with geometry

A drawing's dimensions are measured from its geometry, unless someone types over them. An overridden dimension shows text that may not match the geometry it points to. Chapter 7's double-compensated bore was hidden by exactly that: the hole was drawn Ø59.7 and the dimension text had been overridden to read Ø60.

Most programs can list or highlight dimensions whose text has been overridden. Run the search before release. Each override is either a deliberate convention, such as a dimension marked as not to scale on a broken view, which should be flagged on the drawing, or a fault. There is rarely a third kind.

The same applies to dimensions that are no longer associated with their geometry. A dimension that has lost its association still shows its old value after the geometry moves. Re-associating or re-creating it, and checking that its value matches the design, closes the gap.

## Setting the limit for geometry that was not built here

The 0.001 mm limit suits geometry built exactly by construction. Geometry that arrives from elsewhere, such as a customer's DXF, a traced scan or a profile exported from a 3D model through an approximating format, needs a limit that reflects its source, and a decision about what to do when it fails.

A sensible limit is a small fraction of the tightest tolerance the feature carries. This is an illustration. Suppose the customer supplies the motor plate as a DXF and the drawing gives the motor holes a position tolerance of Ø0.2 mm. A drafter who wants the file itself to use no more than a tenth of that zone sets a limit of 0.02 mm on the diameter of the position error, or 0.01 mm on each hole's distance from its true position. A hole listed at a radius of 50.006 mm from O passes; one at 50.015 mm does not, and should be rebuilt from the design values rather than accepted as supplied.

The same reasoning applies to arcs supplied as chains of short lines. Chapter 10 shows how far such a chain can depart from the true arc; if that departure is larger than the limit, the chain is replaced by a true arc before the file is checked further. The decision to rebuild should be recorded, because the rebuilt geometry is now the drafter's responsibility, not the customer's.

## Keeping a record of the check

A check that leaves no record cannot be relied on by anyone else. The record need not be elaborate. For the plate, the drafter keeps three things with the drawing:

1. **The comparison table** of critical values, expected and listed, with the date and the file revision it was run on.
2. **The counts**: closed profiles, pierces, duplicates removed and objects moved to zero elevation, with a one-line explanation of anything non-zero.
3. **The exceptions**: any web below the minimum, any override and any imported geometry rebuilt, each with who accepted it.

When the plate is revised, the record shows what was checked last time, and the new check can concentrate on what changed. When a fault turns up in the field, the record shows whether the check would have caught it, which is how the routine improves. The office added the profile count to its routine after the doubled holes were found, and the elevation check after the exploded block; each line on the checklist has a reason like that behind it.

## Who checks, and how much

The drafter should run the routine on their own work; it is quick and catches most faults. A second person should check the critical values and the webs on any part whose failure would be costly, using the design values rather than the drafter's notes, so that a misunderstanding of the design is caught too.

The effort should match the risk. For a laser-cut bracket made in hundreds, the full routine is worth the twenty minutes it takes. For a one-off guard panel, closure, the count and a glance at the main dimensions may be enough. What should never be skipped is closure and the count, because a profile that will not cut, or cuts twice, wastes more than the whole check costs.

## Exercise: a colleague's file

A colleague hands over a version of the plate with these values from the file. Which are findings, and what is the likely cause of each?

- Motor hole diagonals: 100.000 mm and 100.000 mm; neighbour spacing 70.711 mm.
- Pivot to slot end S1: 180.000 mm; pivot to slot end S2: 179.500 mm.
- Closed profiles: 8.
- Net area reported by the region: 25,744.54 mm².

**Worked answer.** The motor holes are correct: both diagonals are 100.000 mm and the spacing is 70.711 mm.

The slot end S2 is a finding. It should be 180.000 mm from P, and it is 0.5 mm short. Because S1 is correct, the slot's centreline was probably drawn by its end points rather than as an arc about P, or S2 was stretched or moved after the slot was drawn. The slot is then no longer concentric with the pivot, and the lock bolt will bind as the plate turns. Redraw the slot from its centreline arc about P.

The profile count of 8 is right, so nothing is missing or doubled on the cutting layer.

The net area is a finding. It is 25,744.54 − 25,649.51 = **95.03 mm²** too large, which is exactly the area of the Ø11 pivot hole, π × 5.5². The region was built without the pivot hole as an island, so the mass and centroid taken from it are wrong, even though the pivot hole itself is present on the cutting layer, which is why the count is correct. Rebuild the region with all seven holes and recheck: the area should be 25,649.51 mm² and the centroid (105.89, 67.46).
