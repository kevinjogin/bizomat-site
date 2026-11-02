---
book: drafting-geometry-by-the-numbers
chapterSlug: profiles-that-cut-cleanly
order: 10
title: "Profiles that cut cleanly"
description: "Prepare 2D geometry for laser, plasma and waterjet cutting: arcs versus segments, chord tolerance, layers, units, lead-ins, cut length and pierce count, with a cutting estimate."
draft: false
---

The last step of most 2D drafting work is to hand the geometry to a machine. A cutting contractor imports the file, nests the part on a sheet, adds lead-ins and kerf compensation and cuts it. Everything in this book has been leading here: an exact datum, exact points, true tangents, a closed boundary, a checked area. This chapter covers what the drafter must do to the file itself so that the machine cuts what the drawing shows.

Most of it is about curves. A cutting machine moves in straight lines and circular arcs. Anything else, an ellipse, a spline, an offset curve, must be converted into lines and arcs before it can be cut, and the conversion has a tolerance. The rest is housekeeping that is easy to skip and expensive to forget: layers, units, what goes in the file and what does not. The running case prepares the motor plate's cutting file, estimates its cutting time, and finds a corner that was cut as facets.

## Lines, arcs and everything else

A cutting machine's motion controller follows two kinds of path well: straight lines and circular arcs. A file made only of these can be cut exactly, subject to the machine's own accuracy. The motor plate's outline and holes are made only of lines and arcs, so they can go to the machine as they are.

Other curves have to be approximated. An ellipse, a spline or the offset of either is converted by the export, by the contractor's import or by the cutting software into a chain of short lines or arcs. Converting to arcs is better, because a few arcs can follow a smooth curve closely; converting to lines needs many more segments for the same accuracy, and every segment junction is a small change of direction that the machine may slow down for.

Polylines need care too. A polyline can contain arc segments, stored as a bulge between two vertices. Some exports keep the bulges as true arcs; others, depending on the target format version or a setting, break them into line segments. Check by importing the exported file into a fresh drawing and listing a curved segment: it should report itself as an arc with the right radius and centre.

## How far a chord departs from its arc

When an arc of radius R is replaced by straight chords, each chord cuts across the arc and the greatest gap between them, at the chord's midpoint, is the **sagitta**:

s = R × (1 − cos(θ ÷ 2)) ≈ c² ÷ (8R)

where θ is the angle each chord subtends and c is its length. Turned round, the longest chord that keeps within a tolerance t is c = 2√(2Rt − t²), and the largest angle per chord is 2 × arccos(1 − t ÷ R).

Two consequences follow. Small radii need many more segments per degree than large ones, because the sagitta grows as the radius shrinks. And for a given tolerance, the number of segments in a full circle depends on the radius: a Ø9 hole held to 0.01 mm needs 48 chords, the Ø60 bore 122. The cutting software's export or import tolerance decides which. The KEVOS® [CNC chord error calculator](/tools/cnc-chord-error/) gives the same relationship for toolpaths.

```figure
type: formula
title: Chord tolerance for an arc replaced by straight segments
formula: s = R (1 − cos(θ ÷ 2)) ≈ c² ÷ 8R        c_max = 2 √(2Rt − t²)
caption: The sagitta s is the largest gap between the arc and a chord. Set a tolerance t and the formula gives the longest chord, or the largest angle per chord, that keeps within it.
- R | Arc radius, mm
- θ, c | Angle subtended by each chord, and its length
- t | Allowed gap between arc and chord, mm
step: R40 corner at 10° per chord: s = 40 × (1 − cos 5°) = 0.152 mm
step: R40 corner at 1° per chord: s = 0.0015 mm
step: For t = 0.01 mm at R40: c_max = 1.789 mm, or 2.56° per chord, 36 chords across the 90° corner
```

## The error: the faceted corner

This is an illustration. An early batch of plates came back with a visible pattern of flats round the R40 corner. Each flat was about 7 mm long, and a straight edge laid on the corner rocked slightly at their junctions. The customer asked whether the corner was within the drawing's general tolerance; it was, but it looked poor and it snagged a cleaning cloth.

The drafter's file had the corner as a true arc. The contractor's import had converted it with a tolerance setting that produced 10° chords, nine across the quarter circle, each 2 × 40 × sin 5° = 6.97 mm long, with a sagitta of 0.152 mm. The flats were the chords. The contractor reset the import tolerance to keep arcs as arcs, and the next batch had a smooth corner.

The drafter added two lines to the cutting order: "Cut all arcs as true arcs; do not segment." and "If segmentation is unavoidable, chord tolerance 0.01 mm or finer." The second line covers the cases where a true arc cannot be kept, such as the elliptical conduit hole in Chapter 6's guard. That ellipse is tightest at the ends of its major axis, where its radius of curvature is b² ÷ a = 30² ÷ 34.641 = 25.98 mm; at 0.01 mm tolerance, chords there can be no longer than 1.44 mm, so about 142 chords over its 203.34 mm perimeter if they were all that short. Arc fitting does far better, which is why an arc-fitted conversion is worth asking for.

```figure
type: bars
title: Chords needed for a full circle at 0.01 mm chord tolerance
caption: Count from c_max = 2√(2Rt − t²) with t = 0.01 mm, rounded up. True arcs need one entity each, whatever the radius.
max: 130
- Ø9 motor hole | 48
- Ø11 pivot hole | 53
- *Ø60 bore | 122
```

## What goes in the cutting file

A drawing file carries much more than the cutting machine needs: dimensions, text, title block, centrelines, hatching, construction geometry, other views. A cutting contractor can strip it out, but every item left in is a chance for the wrong thing to be cut. The cleanest practice is to send a separate cutting file containing only:

- the part's closed profiles at true size, on a layer named for cutting;
- any etching or marking, such as Chapter 5's index marks and Chapter 7's part number, on a separate layer named for marking, so that the operator sets it to mark rather than cut;
- nothing else, apart from an agreed part identifier, if the contractor asks for one, on a non-cutting layer.

The file must be in the agreed units, normally millimetres, with the drawing's unit setting saying so. A file drawn in millimetres but labelled as unitless or inches can be imported at 25.4 times or 1 ÷ 25.4 of its size, which is obvious for a whole plate but not necessarily for a small detail. The geometry should sit at a known position, conventionally with the datum corner at the origin as this book has done throughout.

```figure
type: checklist
title: Preparing the motor plate's cutting file
caption: This is an illustration. Run after the release check in Chapter 9, on a copy of the geometry rather than on the drawing itself.
- Eight closed profiles on the cutting layer | Outline, bore, four holes, pivot, slot
- Index marks and part number on the marking layer | Seven marks from 5° to 20°; text at least 8 mm inside the outline
- Geometry at finished size | No kerf allowance; the contractor applies compensation
- Arcs exported as arcs | Imported back and listed to confirm
- Units millimetres | Unit setting in the file confirmed; overall size reads 220 × 140
- x Dimensions, title block or centrelines in the file | Removed; they belong on the drawing
- ? Material and thickness | Stated on the order, not in the file: 10 mm mild steel
```

## Lead-ins, pierces and small holes

A cutting beam cannot start on the profile. It pierces the sheet first, which leaves a blemish, and then moves onto the profile along a short **lead-in**. On an outer profile, the pierce goes in the scrap outside; on a hole, in the scrap inside. At the end of the cut, a **lead-out** or overcut may continue a little past the start.

The contractor normally adds lead-ins automatically, but the drafter can help or hinder. A small hole leaves little room for a pierce and lead-in inside it, and very small holes relative to the plate thickness may not cut cleanly at all. The contractor will say what minimum hole size and slot width their process can cut in 10 mm steel; if a design needs smaller, drilling or machining after cutting may be required. For the plate, the Ø9 motor holes and the 11 mm slot are the features to ask about.

Where the lead-in meets a profile, it leaves a small mark. On a functional edge, such as the slot's sides, which the lock bolt's washer bears on, the drafter can ask for lead-ins to be placed on a non-functional part of the profile, such as the slot's end cap, and note it on the order.

## Cut length, pierces and time

The cutting contractor prices a part largely from three numbers: the length of cut, the number of pierces and the material. The drafter can calculate the first two exactly from the geometry and check the quote.

This is an illustration. The plate's cut length is:

- outline: bottom edge 220, right edge 90.858, two R10 fillet arcs of 7.854 each, the chamfer's straight part 55.355, top edge 130.858, R40 corner 62.832, left edge 100, a total of **675.611 mm**;
- bore: π × 60 = 188.496 mm;
- four motor holes: 4 × π × 9 = 113.097 mm;
- pivot hole: π × 11 = 34.558 mm;
- slot: outer arc 48.564, inner arc 45.684 and two end caps totalling π × 11 = 34.558, a total of 128.806 mm.

That is **1,140.6 mm** of cut and **8 pierces**. If, for this illustration, the contractor's laser cuts 10 mm mild steel at 1.2 m/min and each pierce takes 2 seconds, the cutting time is 1.1406 ÷ 1.2 × 60 = 57.0 seconds plus 16 seconds of piercing, about **73 seconds** per plate before rapid moves and marking. Over 400 plates, that is about 8.1 hours of beam time. The real speeds depend on the machine and the material and must come from the contractor; what the drafter adds is a geometry figure that the quote can be checked against.

## What cutting can hold, and what it cannot

Exact geometry does not make a process exact. A thermal cutting process leaves an edge with its own accuracy, squareness and surface, which depend on the machine, material and thickness, and which the contractor can state. The drafter's job is to know which features of the part need more than the process gives, and to say so on the drawing and the order.

For the motor plate, most features are comfortably within what a laser can hold: the outline, the slot, the pivot hole and the motor bolt holes are clearances, and a few tenths of a millimetre either way does not change their function. The bore is different if the motor spigot must locate the motor accurately. If the design needs a close fit on the spigot, the bore should be cut undersize, say Ø58 in this illustration, and finished by boring or reaming to its toleranced size, with the cutting file and the drawing both showing which is which. If a clearance fit is enough, the bore can be cut to size. That decision belongs to the designer, but the drafter is often the person who notices that a fit tolerance has been put on a feature that the purchase order describes as laser cut.

## Sending the file

The cutting file should travel with the drawing, not instead of it. Send the drawing as a PDF beside the cutting file, so that the contractor can compare the two, see the material, thickness, quantity and finish, and raise a query if they disagree. Give both the same part number and revision in their file names, so that a revised drawing and an old cutting file cannot be mixed up on the contractor's system.

Agree the exchange format and version with the contractor once, and keep to it. Older format versions sometimes handle curves, units and polylines differently from newer ones, and a format change is a good moment to repeat the import test: open the exported file in a fresh drawing, list the bore, the slot and the R40 corner, confirm they are true arcs at the right radii, and confirm the overall size reads 220 × 140 mm. When the first plates arrive, measure the bore, a motor hole spacing and the slot width against the drawing, and keep the results with the release record from Chapter 9. A process that cut the first batch correctly will usually cut the next one correctly; a process that was never checked gives no such assurance.

## Exercise: the doubled holes, priced

In Chapter 9's running case, the cutting file nearly went out with the four motor holes duplicated. Using the illustration's speeds, how much beam time would the duplicates have added per plate and over the order of 400, and what else would have happened?

**Worked answer.** Each duplicate hole adds its circumference, π × 9 = 28.274 mm, and one pierce. Four of them add 113.097 mm of cut and 4 pierces. At 1.2 m/min, 0.113097 ÷ 1.2 × 60 = 5.65 seconds of cutting, plus 4 × 2 = 8 seconds of piercing, so **13.7 seconds** per plate, 19% more than the 73 seconds the correct file needs.

Over 400 plates, that is 400 × 13.7 = 5,460 seconds, about **1.5 hours** of extra beam time, which would appear in the price if the contractor quoted from the file.

The other consequences are worse than the time. Each hole would be cut twice along the same path, so the second pass would cut through already-heated, already-cut edges, widening and scorching them and possibly leaving dross. And the extra pierce inside each Ø9 hole, which has little room for a pierce and lead-in, would increase the risk of a damaged hole edge. The duplicates would have cost money and quality for no benefit, and the profile count in Chapter 9 is what stopped them.
