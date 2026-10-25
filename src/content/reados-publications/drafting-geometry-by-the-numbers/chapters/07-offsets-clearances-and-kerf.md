---
book: drafting-geometry-by-the-numbers
chapterSlug: offsets-clearances-and-kerf
order: 7
title: "Offsets, clearances and kerf"
description: "Offset lines and arcs exactly, predict what happens at corners and small radii, build clearance and swept envelopes, and apply cutting kerf once, not twice."
draft: false
---

An offset is the simplest construction in CAD and one of the most consequential. It makes a parallel copy of a line or curve at a set distance: a clearance boundary round a part, a wall of constant thickness, a toolpath half a cutter's width from the edge, the path a laser follows so that its kerf falls outside the finished shape. The command takes a second; predicting its result at corners, small radii and curves takes a little geometry.

This chapter covers that geometry: how lines, arcs and corners offset, why small radii collapse, how to build a clearance envelope round a part that moves, and how kerf compensation works and fails. The running case builds the motor plate's swept clearance envelope for the frame designer and finds a bore that was compensated twice.

## How lines and arcs offset

Offsetting a straight line by a distance d gives a parallel line d away. For a line written as ax + by = c, the offset line is ax + by = c ± d√(a² + b²), with the sign deciding the side. The plate's chamfer, x + y = 315, offset 15 mm outwards, becomes x + y = 315 + 15√2 = **336.213**.

Offsetting an arc keeps its centre and changes its radius: outwards by +d, inwards by −d. The R40 corner offset 15 mm outwards becomes R55 about the same centre (40, 100); offset 15 mm inwards it becomes R25. The arc's angular span stays the same, 90° in this case, so its length changes in proportion to the radius.

That simple rule has a limit. An arc offset inwards by more than its radius has nothing left: the offset radius would be zero or negative. The software either removes the arc, leaving the neighbouring offset lines to meet at a sharp corner, or reports an error. The plate's R10 chamfer fillets offset inwards by 12 mm vanish; offset by 8 mm they become R2 fillets, still tangent to the offset lines.

```figure
type: compare
title: What offsetting does to the plate's features
cols: Offset 15 mm outwards | Offset 8 mm inwards | Offset 12 mm inwards
caption: This is an illustration. Arcs keep their centres; radii change by the offset; an inward offset larger than the radius removes the arc.
- Bottom edge y = 0 | y = −15 | y = 8 | y = 12
- Chamfer x + y = 315 | x + y = 336.213 | x + y = 303.686 | x + y = 298.029
- R40 corner, centre (40, 100) | R55 | R32 | R28
- *R10 chamfer fillets | R25 | R2 | Vanish; sharp corners
- Ø60 bore, as a closed hole | Ø30 hole | Ø76 hole | Ø84 hole
```

The last row is a reminder that "outwards" and "inwards" are relative to the boundary being offset. For the outline, outwards means away from the material. For a hole, the outline's outward direction points into the hole, so offsetting the whole plate's material boundary outwards shrinks its holes. Most programs offset one object at a time and ask which side; when offsetting a whole profile with holes, check each hole went the way you intended.

## Corners: extend or round

When a closed profile is offset outwards, each convex corner opens a gap between the two offset lines. There are two ways to close it:

- **extend** the offset lines until they meet, which keeps a sharp corner but moves it outwards by more than d, by d ÷ sin(θ ÷ 2) for an interior angle θ;
- **round** the corner with an arc of radius d centred on the original corner point, which keeps every point exactly d from the original profile.

For a clearance boundary, the rounded corner is the true offset, because it is the set of points exactly d from the part. The extended corner is safe, since it lies farther out, but wastes space: at a square corner it sits d√2 = 1.414d from the original corner instead of d. For a 15 mm clearance at the plate's square corner B, the extended corner is 21.2 mm from B, the rounded one 15 mm.

When a profile is offset inwards, convex corners close up without trouble, but concave corners and small arcs behave as above. Toolpaths and kerf paths follow the same rules, which is why a laser cannot cut a perfectly sharp inside corner: its path rounds the corner with the beam's radius.

## The running case: a swept clearance envelope

This is an illustration. The frame designer needs to know how close frame members can come to the motor plate. The plate does not sit still: it turns 7.5° either way about the pivot P during belt adjustment. The required clearance is 15 mm from any point of the plate, in any position.

A static offset of the outline by 15 mm is not enough, because it only covers the drawn position. The envelope must be swept: the region the plate occupies across its whole rotation, offset by 15 mm.

For a part rotating about a point, the outer boundary of the sweep is set by the point of the part farthest from the pivot. The drafter listed the candidates:

- corner B (220, 0): √(200² + 20²) = 201.00 mm from P;
- corner C (220, 95), before filleting: √(200² + 75²) = 213.60 mm;
- with the R10 fillet at C, its farthest point is the fillet centre's distance plus 10, √(190² + 70.858²) + 10 = **212.78 mm**;
- the fillet at D: 196.70 mm;
- corner D itself, before filleting: 196.02 mm.

So the fillet at C sweeps the outermost arc. Across the 15° of rotation, the plate occupies everything within 212.78 mm of P over the angular range that corner sweeps, and the clearance envelope is an arc of radius 212.78 + 15 = **227.78 mm** about P across that range, joined to the static 15 mm offsets of the plate's other edges at each extreme position.

The drafter built it by drawing the plate outline at both extreme rotations, offsetting each by 15 mm with rounded corners, adding the R227.78 arc about P between them, and trimming the result into one closed boundary on a construction layer. The frame designer can now place members anywhere outside that boundary without further calculation.

```figure
type: steps
title: Building a swept clearance envelope for a rotating part
caption: This is an illustration. The same method serves any part that moves through a known range: rotate, offset, join with arcs or lines, and trim.
- Find the extremes of motion | Plate rotated −7.5° and +7.5° about P
- Find the farthest point from the pivot | Fillet at C, 212.78 mm from P
- Offset each extreme outline | 15 mm, rounded corners, so every point is exactly 15 mm clear
- Add the swept boundary | Arc of R227.78 about P between the two extremes
- *Trim and join | One closed boundary on a non-plotting construction layer, given to the frame designer
```

## Checking a frame member against the envelope

The swept arc answers the general question, how far from the pivot anything must stay. A particular frame member asks a narrower one: how close does the plate come to this face? For a straight member, the answer is not necessarily set by the point farthest from the pivot, but by the point that reaches farthest in the direction square to the member.

This is an illustration. The frame designer proposes a vertical upright whose face is at x = 245 mm in the plate's coordinates, and a horizontal cross member under the plate. For the upright, the drafter needs the largest x that any point of the plate reaches across its rotation. Rotating the plate clockwise by 7.5° swings the right edge and the C fillet outwards; the extreme turns out to be on the C fillet, just above its lower tangent point, at x = **227.62 mm**. Adding the 15 mm clearance gives 242.62 mm, so an upright face at 245 mm is 17.38 mm from the plate at worst and meets the requirement with 2.38 mm to spare.

For the cross member, the same rotation drops corner B, which reaches y = **−25.93 mm**, below the plate's drawn bottom edge. The cross member's top face must therefore be at or below −25.93 − 15 = −40.93 mm. A designer who offset only the drawn outline would have put it at −15 mm and found the plate striking it at the first belt adjustment. The upright and the cross member are each set by a different point of the plate, at the same extreme of rotation, which is typical: the worst case for each member must be found separately.

```figure
type: stats
title: Extremes of the rotating plate and the member limits they set
caption: This is an illustration. Plate coordinates, with the plate turned 7.5° clockwise about P in both cases and a 15 mm clearance added.
- 227.62 mm | Largest x reached | On the C fillet
- * 242.62 mm | Nearest allowed upright face | Proposed face at 245 mm passes
- −25.93 mm | Lowest y reached | Corner B
- −40.93 mm | Highest allowed cross member top | Not −15 mm
```

These extremes can be found by drawing the plate at both rotation limits and measuring, as the drafter did, then confirmed by a short calculation. The swept envelope from the previous section contains both, which is the reason to build it: one boundary answers every member's question at once.

## Kerf: the width of the cut

Every cutting process removes a strip of material: the kerf. A laser, plasma or waterjet removes a strip a fraction of a millimetre to a few millimetres wide, depending on the process, material and thickness. If the machine followed the drawn outline exactly, half the kerf would fall inside the part. Outlines would come out undersize by one kerf width overall, and holes oversize by the same amount.

**Kerf compensation** offsets the cutting path by half the kerf, away from the finished part: outwards on the outer profile, inwards on holes and internal cut-outs. Almost all modern cutting systems apply it in their own software, using a kerf value set for the machine, material and thickness. That has a clear consequence for the drafter: **draw the finished part at its true size**, and let the cutter compensate. The cutter knows its kerf; the drafter usually does not.

This is an illustration. For the 10 mm plate, the cutting contractor quotes a kerf of 0.3 mm on its laser. With compensation, the path runs 0.15 mm outside the outline and 0.15 mm inside each hole. The Ø60 bore's path is a circle of Ø59.7; the beam removes 0.15 mm either side of it, and the hole comes out Ø60.0.

```figure
type: formula
title: Kerf compensation for holes and outlines
formula: path diameter of a hole = D − k        path offset of an outline = +k ÷ 2
caption: This is an illustration with a kerf k of 0.3 mm. Compensation belongs in the cutting software, applied once, to a drawing at true size.
- D | Finished hole diameter
- k | Kerf width for this machine, material and thickness
step: Ø60 bore: path Ø59.7, cut Ø60.0
step: Not compensated: path Ø60.0, cut Ø60.3, outline 0.3 mm undersize overall
step: Compensated twice: drawn Ø59.7, path Ø59.4, cut Ø59.7
```

## The error: the bore compensated twice

This is an illustration. A drafter who had once worked with an older cutting machine without automatic compensation "allowed for the kerf" in the plate's file by drawing every hole 0.3 mm smaller and offsetting the outline 0.15 mm outwards. The holes on the drawing were dimensioned correctly, Ø60 and Ø9, because the dimensions had been overridden with the nominal values.

The contractor's software applied its own compensation to the file as received. The bore's path became Ø59.7 − 0.3 = Ø59.4, and the hole came out **Ø59.7**. The motor's Ø60 spigot would not enter. The motor holes came out Ø8.7, still enough for M8 bolts but not to the drawing. The outline came out 0.3 mm oversize overall.

The first article inspection caught it: the bore measured Ø59.70 against a drawn Ø60. The investigation found the overridden dimensions, which the office's checker should have caught, since a dimension override hides exactly this kind of discrepancy. The corrections were to redraw the file at true size, to remove all dimension overrides, and to add a note to the cutting purchase order: "Geometry at finished size. Supplier to apply kerf compensation." Chapter 9 turns the override check into a standard step.

## Offsets of curves that are not circles

Lines and arcs offset into lines and arcs. Other curves do not offset into the same kind of curve. Chapter 6 noted that an offset ellipse is not an ellipse, and the same is true of splines. The software represents the offset as a spline or a chain of arcs that stays within a tolerance of the true offset. For a clearance boundary that does not matter. For a profile that goes to a cutting machine, it matters a little, because the machine will follow whatever approximation it is given, and Chapter 10 sets tolerances for that.

Where a constant wall or clearance must be exact, build the profile from lines and arcs in the first place, so that every offset is exact too. The plate's outline is made entirely of lines and arcs, so every offset of it in this chapter is exact.

## Exercise: a border for marking

The customer wants the plate's part number laser-etched anywhere at least 8 mm inside the outline and at least 5 mm from any hole or slot. Describe the inner boundary for the outline, and say what happens to the fillets and the R40 corner. What changes if the border becomes 12 mm?

**Worked answer.** Offset the outline 8 mm inwards. The straight edges move in by 8 mm: the bottom edge to y = 8, the right edge to x = 212, the top edge to y = 132, the left edge to x = 8, and the chamfer to x + y = 315 − 8√2 = 303.686. The R40 corner becomes **R32** about (40, 100). The R10 fillets at the chamfer become **R2**, still tangent to the offset chamfer and edges. The square corners A and B stay square, because convex corners close up cleanly on an inward offset.

The marking zone is then that boundary with each hole and the slot offset 5 mm outwards subtracted from it: Ø70 round the bore, Ø19 round the motor holes, Ø21 round the pivot hole and a slot boundary 21 mm wide round the arc slot.

At 12 mm, the edges move in 12 mm, the chamfer becomes x + y = 298.029, and the R40 corner becomes R28. The R10 fillets cannot survive an offset of 12 mm, so the software removes them and the offset chamfer meets the offset right and top edges at sharp corners. That is correct geometry for a marking border, since no one will cut it, but it shows why an inward toolpath cannot reproduce a fillet smaller than the tool's radius.
