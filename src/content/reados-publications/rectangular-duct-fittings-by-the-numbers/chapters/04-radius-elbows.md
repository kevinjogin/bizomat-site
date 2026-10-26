---
book: rectangular-duct-fittings-by-the-numbers
chapterSlug: radius-elbows
order: 4
title: "Radius elbows: cheeks and curved wrappers"
description: "Develop a 90° radius elbow, 400 in the plane of the bend with a 200 mm throat: annular cheeks, wrapper lengths, tangents, marking arcs, and a throat radius read as a centreline."
draft: false
---

A radius elbow turns rectangular duct around a smooth curve. Its cheeks are flat pieces shaped like a quarter of an annulus, and its wrappers are flat strips bent to follow the cheeks' inner and outer arcs. It is the rectangular equivalent of a smooth round bend, and unlike a round bend it is fully developable: every piece starts flat, and the curvature is only ever in one direction.

This chapter develops the running case's radius elbow: 90°, with the duct's 400 mm dimension in the plane of the bend, a 200 mm throat radius and 50 mm straight tangents at each end. It works out the cheek's shape and area, the wrapper lengths, how to mark the arcs on the cheek blank, and how the wrappers are formed, and ends with a throat radius that was read as a centreline radius, putting the elbow's outlet 200 mm from where the run needed it.

## The elbow's geometry

This is an illustration. Where the run turns from horizontal to vertical to drop down a wall, the shop is making a radius elbow with the **400 mm dimension in the plane of the bend**, so that the duct's 600 mm width stays across the wall. The cheeks are therefore the two 400 mm side faces, and the wrappers are the 600 mm top and bottom faces, which become the throat and the heel as the duct turns.

The drawing gives a **throat radius** of 200 mm, half the duct's depth. Every other radius follows:

- throat radius, on the inside of the bend: **200 mm**;
- centreline radius, at the middle of the 400 mm dimension: 200 + 200 = **400 mm**;
- heel radius, on the outside: 200 + 400 = **600 mm**.

A centreline radius equal to the duct dimension in the plane of the bend, here 400 mm, is a common proportion for supply duct elbows, and the throat radius of half that dimension follows from it. The designer chooses the radius for pressure loss and space; the fabricator's task is to make whatever is drawn.

Each end of the elbow carries a 50 mm straight **tangent**, a short length of straight duct formed as part of the fitting so that the transverse joint sits on straight, not curved, sheet.

## The cheeks

Each cheek is a quarter annulus, with an inner arc of 200 mm radius and an outer arc of 600 mm radius, plus a 400 × 50 mm rectangle at each end for the tangents. Its area is π ÷ 4 × (0.6² − 0.2²) + 2 × 0.4 × 0.05 = **0.2913 m²**.

The two cheeks are mirror images in the assembled elbow, and identical as flat shapes. As with the mitred elbow, the seam allowances must be placed so that each cheek's flanges face the same way relative to the elbow.

```figure
type: formula
title: Radius elbow dimensions from the throat radius
formula: centreline radius = throat radius + d ÷ 2        heel radius = throat radius + d
formula: wrapper length = arc on its radius + 2 × tangent        arc = radius × angle in radians
caption: The running case's 90° elbow, d = 400 mm in the plane of the bend, throat radius 200 mm, 50 mm tangents.
- d | Duct dimension in the plane of the bend, 400 mm
- tangent | Straight length at each end, 50 mm
step: Radii: throat 200, centreline 400, heel 600 mm
step: Throat wrapper: π ÷ 2 × 200 + 100 = 314.2 + 100 = 414.2 mm long, 600 mm wide
step: Heel wrapper: π ÷ 2 × 600 + 100 = 942.5 + 100 = 1,042.5 mm long, 600 mm wide
step: Cheek: quarter annulus 200 to 600 mm plus two 400 × 50 mm tangents, 0.2913 m²
```

## Marking the arcs

The cheek's arcs are swung from a centre point with a trammel or a steel tape held at a centre punch. On a single cheek the centre lies in the corner of the blank, 50 mm beyond each tangent, and the shop marks it on the blank before swinging.

When the cheeks are nested, the centre may fall off the blank, and the arcs are marked by offsets from their chords instead:

- the outer arc's chord, from one tangent point to the other, is 600 × √2 = **848.5 mm**, and the arc rises 600 × (1 − cos 45°) = **175.7 mm** above the chord at its middle;
- the inner arc's chord is 200 × √2 = **282.8 mm**, and it rises **58.6 mm**.

Intermediate offsets at quarter points along each chord fill in the curve, and a flexible batten draws it. On a laser or plasma table the arcs come from the cutting file, and the chords and rises are the checks marked on the first cheek.

```figure
type: svg
title: Cheek of the 90° radius elbow
alt: A quarter-annulus panel with an inner arc of radius 200 mm and an outer arc of radius 600 mm, with a short straight tangent rectangle at each end. Dashed chords span each arc, 848.5 mm for the outer arc and 282.8 mm for the inner arc.
caption: This is an illustration at 0.3 scale. The centre of both arcs is at lower left; each tangent extends the cheek 50 mm beyond the arcs.
viewbox: 0 0 280 280
body:
<path class="bxa" d="M80 240H200A180 180 0 0 0 20 60V180A60 60 0 0 1 80 240Z"/>
<path class="bx" d="M80 240H200V255H80Z"/>
<path class="bx" d="M20 60H5V180H20Z"/>
<path class="li dsh" d="M200 240L20 60M80 240L20 180"/>
<circle class="fa" cx="20" cy="240" r="3"/>
<text class="txs" x="105" y="140">Chord 848.5</text>
<text class="txs" x="40" y="228">282.8</text>
<text class="txs" x="160" y="110">Heel R600</text>
<text class="txs" x="56" y="196">R200</text>
<text class="txs" x="98" y="272">Tangent 50</text>
<text class="txs" x="26" y="262">Centre</text>
```

## The wrappers

The **throat wrapper** is 414.2 mm long and 600 mm wide; the **heel wrapper** is 1,042.5 mm long and 600 mm wide. Each is a rectangle, cut flat, then curved along its length to the cheek's radius, 200 mm for the throat and 600 mm for the heel, over the middle of its length, leaving the 50 mm tangents at each end straight.

The arc lengths are measured on the cheek's edge, which is the duct's inside surface. Strictly, a wrapper bent to an inside radius of 200 mm has its mean line on 200.4 mm, and its arc on the mean line is 0.63 mm longer than on the inside. For 0.8 mm sheet that is within the seam's tolerance and shops ignore it; for heavier gauges it is added, as for any rolled part.

The wrappers are curved on slip rolls or, for the tight throat, by hand over a pipe of about the right radius. The heel, at 600 mm radius in 0.8 mm sheet, springs back a good deal, as any lightly bent thin sheet does, and is rolled a little tighter than its final radius and allowed to open to the cheek when assembled. The cheek is stiff and flat; the wrapper is flexible; the seam pulls the wrapper to the cheek's shape.

```figure
type: bars
title: Lengths of the radius elbow's pieces
unit: mm
max: 1100
caption: This is an illustration for the running case's elbow, net of seam allowances. The heel wrapper is two and a half times the throat's length.
- Throat wrapper | 414.2
- Centreline, arc plus tangents | 728.3
- * Heel wrapper | 1042.5
- Cheek outer chord | 848.5
```

## Seams on a radius elbow

The seams between cheeks and wrappers follow the arcs, and that limits which seams can be used. A Pittsburgh lock rolled on a straight edge can be formed on a curved edge only with care, because the pocket's outer leg must stretch along the heel's outer arc and compress along the throat's inner arc. The running case's shop forms the Pittsburgh pockets on the **wrappers**, which are straight when the pocket is rolled, and turns a plain flange on the cheeks' curved edges, notching the flange along the throat's tight arc so that it can close up without wrinkling, as Chapter 9 shows.

Forming the pocket on the straight wrapper and then curving the wrapper is the order that works: the roll former sees straight sheet, and the pocket follows the wrapper's curve as it is rolled. The pocket's legs are then stretched slightly on the heel and compressed slightly on the throat, which at these radii and this gauge they tolerate.

## How small a throat radius

The throat radius can be reduced only so far. At a throat radius of zero, the throat is a sharp fold and the fitting is a "square throat" elbow, with a curved heel and a mitre-like inside corner, a different fitting with different airflow. Between zero and the drawn radius, two limits apply in the shop.

The first is forming. A wrapper bent to a radius of a few tens of millimetres in 0.8 mm sheet kinks rather than curving smoothly unless it is formed over a mandrel, and its Pittsburgh pocket, rolled while the wrapper was straight, must compress along the tight curve. The running case's shop forms throat wrappers down to about 100 mm radius by hand over a pipe; below that, it makes a square throat instead. That figure is this shop's, an illustration, and a shop with a beading machine or a different roll former will have its own.

The second is the seam on the cheek. A flange turned on the cheek's inner arc compresses as it follows the curve, and the tighter the arc, the more notches it needs and the weaker the seam. Chapter 9 works out how much a flange on a curved edge must shrink or stretch.

Neither limit is a design rule. The radius is the designer's choice for the airflow, and if the drawn radius is below what the shop can form well, the shop raises it before cutting rather than making a poor fitting.

## Assembling and checking the elbow

The shop assembles the radius elbow in this order, each step checked before the next.

1. Roll the Pittsburgh pockets on both wrappers' long edges while they are flat.
2. Curve each wrapper over its middle, leaving the 50 mm tangents straight, and check its curve against a template of the cheek's arc.
3. Turn and notch the flanges on both cheeks' curved edges and straight tangent edges.
4. Fit the throat wrapper to both cheeks, starting at one tangent and working round, closing the locks as the wrapper is pressed to the arc.
5. Fit the heel wrapper the same way.
6. Check the elbow on the setting-out drawn on the floor: its two ends must sit on the marked lines, square to each other, with the centreline's ends 400 + 50 = 450 mm from the corner point along each direction.

Step 6 is the one that found the error below. A setting-out on the floor, drawn full size from the job's dimensions, is the fastest way to check any fitting that changes direction, and it costs a few minutes with a chalk line and a tape.

## Elbows at other angles

A radius elbow at any angle θ is the same set of pieces with the arcs shortened in proportion. For a 45° elbow with the same radii, the throat wrapper's arc is π ÷ 4 × 200 = 157.1 mm and the heel's π ÷ 4 × 600 = 471.2 mm, each plus the tangents, and the cheek is an eighth of an annulus.

Two 45° radius elbows back to back, with a short straight between them or none, make a smooth offset, which Chapter 5 uses. Their cheeks then form an S-curve, and both cheeks of each elbow lie in the same plane.

## The error: a throat radius read as a centreline

This is an illustration. The first radius elbow was made from a drawing note that read "R200". The fabricator took it as the centreline radius, which is how radius elbows are often specified on round duct, and made the elbow with its centreline on 200 mm. With a 400 mm duct dimension in the plane of the bend, that put the throat radius at **zero**: a sharp inside corner, a heel radius of 400 mm, a heel wrapper of π ÷ 2 × 400 + 100 = 728.3 mm, and a throat that was not a wrapper at all but a fold.

The elbow was the wrong shape for the air and the wrong size for the run. Its centreline turned on a 200 mm radius instead of 400 mm, so the outlet stood 200 mm closer to the inlet's line in both directions than the drawing required, and the vertical drop would have hit the wall 200 mm early. The fault was found at the shop's dry assembly, when the elbow was laid on the setting-out drawn on the floor and its outlet missed the mark.

The pieces could not be salvaged. The cheeks, cut as quarter discs with a 400 mm outer radius, were too small for the correct 600 mm heel, and the heel wrapper at 728.3 mm was 314.2 mm short of the 1,042.5 mm needed. Two cheeks and two wrappers went to the scrap bin, about 0.8 m² of sheet and two hours' work, a modest cost because the floor check came before the elbow was sealed, painted or sent to site.

The drawing's note was ambiguous, and the fabricator's reading was reasonable for round duct. The shop now asks for every radius elbow's throat, centreline and heel radii on the job sheet, all three, and checks that they differ by half the duct dimension in the plane of the bend each.

```figure
type: checklist
title: Radius elbow checks before cutting
caption: Three radii, two wrappers and one sense of direction, each written down.
- Dimension in the plane of the bend | 400 for this elbow
- Throat, centreline and heel radii all stated | 200, 400 and 600 mm
- Tangent length at each end | 50 mm
- Throat and heel wrapper lengths including tangents | 414.2 and 1,042.5 mm
- Cheek arcs checked by chord and rise | 848.5 / 175.7 and 282.8 / 58.6 mm
- x Radius taken as centreline without checking | throat radius zero, outlet 200 mm short
```

## Exercise: the other way round

Another radius elbow in the run turns in plan, with the **600 mm** dimension in the plane of the bend and a throat radius of 300 mm. Find its centreline and heel radii, its throat and heel wrapper lengths for 90° and for 45°, without tangents, and the area of one 90° cheek without tangents.

**Worked answer.**

- Radii: throat **300 mm**, centreline 300 + 300 = **600 mm**, heel 300 + 600 = **900 mm**.
- 90° wrappers: throat π ÷ 2 × 300 = **471.2 mm**, heel π ÷ 2 × 900 = **1,413.7 mm**, both 400 mm wide, since the wrappers are now the 400 mm side faces.
- 45° wrappers: half those, **235.6 mm** and **706.9 mm**.
- 90° cheek area: π ÷ 4 × (0.9² − 0.3²) = **0.5655 m²**, nearly twice the running case's cheek, because the cheek's radii scale with the dimension in the plane of the bend.

Turning the same duct the other way has made the cheeks bigger and the wrappers narrower. The elbow with the larger dimension in the plane of the bend is the larger fitting, whatever the duct's size on the drawing.
