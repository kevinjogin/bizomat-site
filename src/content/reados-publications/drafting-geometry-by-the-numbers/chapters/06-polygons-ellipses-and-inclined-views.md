---
book: drafting-geometry-by-the-numbers
chapterSlug: polygons-ellipses-and-inclined-views
order: 6
title: "Polygons, ellipses and inclined views"
description: "Draw regular polygons by across-flats or across-corners size, construct the ellipses that circles become on inclined faces and oblique cuts, and estimate an ellipse's perimeter."
draft: false
---

Two families of shapes cause more confusion in 2D drafting than their simplicity deserves. Regular polygons, above all the hexagons of nuts and bolt heads, are drawn with a command that asks whether the polygon is inscribed in a circle or circumscribed about it, and the wrong answer changes the size by 15%. Ellipses appear whenever a circle is seen at an angle or a cylinder is cut obliquely, and the drafter must know which axis shrinks or stretches, and by what factor.

This chapter sets out both, with the numbers that check them. The running case mounts the motor plate on a sloping face of the conveyor frame, so that its round features appear as ellipses in the frame's front view, and adds a conduit that passes through a sloping guard and needs an elliptical hole.

## Regular polygons: across flats and across corners

A regular polygon of n sides fits between two circles. The **circumscribed circle** passes through its corners; its diameter is the polygon's size across corners. The **inscribed circle** touches the middle of each side; its diameter is the size across flats, for an even number of sides. The two are related by:

across flats = across corners × cos(180° ÷ n)

For a hexagon, cos 30° = 0.866, so a hexagon 16 mm across flats is 16 ÷ 0.866 = **18.475 mm** across corners. Each side is half the across-corners size, 9.238 mm, and the area is (√3 ÷ 2) × 16² = 221.70 mm². The KEVOS® [regular polygon calculator](/tools/regular-polygon/) gives the same relationships for any number of sides.

CAD polygon commands usually ask for a centre, a number of sides and a radius, and then whether the polygon is **inscribed in** the circle of that radius, which puts the corners on the circle, or **circumscribed about** it, which puts the flats on it. The wording is easy to reverse in your head. "Inscribed in a circle" means the polygon is inside the circle, touching it at the corners, so the radius you type is half the across-corners size. "Circumscribed about a circle" means the polygon is outside it, touching at the flats, so the radius is half the across-flats size.

```figure
type: compare
title: Across flats and across corners for regular polygons
cols: AF ÷ AC | AC for a polygon 16 mm across flats
caption: AF ÷ AC = cos(180° ÷ n). For odd n, "across flats" is the distance from a flat to the opposite corner's inscribed circle and is rarely used.
- Square, 4 sides | 0.7071 | 22.627 mm
- *Hexagon, 6 sides | 0.8660 | 18.475 mm
- Octagon, 8 sides | 0.9239 | 17.318 mm
```

## The error: nuts that were too small

This is an illustration. On the plate's assembly drawing, the drafter drew the M10 nuts on the pivot and lock bolts as hexagons 16 mm across flats, a size taken from the nut supplier's data for this illustration. The drafter used the polygon command with a radius of 8 mm and accepted the default, inscribed.

The nuts were drawn 16 mm across corners and only 16 × 0.866 = **13.856 mm** across flats. The error surfaced when the checker measured spanner clearance on the drawing: a 16 mm spanner appeared to fit with room to spare against a frame member, which made the checker suspicious enough to list the polygon and measure across its flats. The fix was to redraw the nuts circumscribed about an 8 mm radius, or inscribed in a 9.238 mm radius, either of which gives 16 mm across flats. The office then made a small block of the nut at its true size, so that nobody redraws it.

Real nuts and bolt heads are chamfered at the corners, so their measured across-corners size is a little less than the theoretical 18.475 mm, and their exact dimensions come from the fastener standard. For a clearance check on an assembly, the theoretical across-corners size is the safe one to use, because it is the largest.

## Circles seen at an angle

A circle on a face that is inclined to the plane of projection does not appear as a circle. It appears as an ellipse whose **major axis** is the circle's true diameter, lying parallel to the line about which the face is tilted, and whose **minor axis** is the diameter multiplied by the cosine of the tilt angle.

minor axis = D × cos θ

The same factor applies to every length measured across the tilt. A face tilted at 30° appears foreshortened to cos 30° = 0.866 of its true height in that direction, and every circle on it becomes an ellipse with a minor-to-major ratio of 0.866.

This is why mechanical drawings use **auxiliary views**: a view projected square to the inclined face shows it at its true shape, with true circles and true lengths, so that it can be dimensioned. The foreshortened view still appears on the drawing, but its ellipses are for recognition, not for dimensioning. Even so, the foreshortened view must be drawn correctly, or it misleads, and an assembly drawing often has no auxiliary view at all.

```figure
type: formula
title: Circles on a face tilted by θ
formula: major axis = D        minor axis = D × cos θ
caption: This is an illustration. The plate's features in the frame's front view, with the plate's face tilted 30° back from vertical about a horizontal axis.
- D | True diameter of the circle on the inclined face
- θ | Angle between the face and the plane of the view, 30°
step: Ø60 bore: 60 × 51.962 mm ellipse
step: Ø100 pitch circle: 100 × 86.603 mm ellipse
step: Plate height: 140 × 0.866 = 121.244 mm in the view; length 220 mm unchanged
```

## The running case: the plate on a sloping face

This is an illustration. On the conveyor frame, the motor plate bolts to a bracket face that slopes back at 30° from the vertical, tilted about a horizontal axis, so that the belt runs at the angle the frame designer wanted. The frame's general arrangement drawing has a front elevation looking horizontally at the conveyor, and the plate appears in it.

In that view, horizontal lengths on the plate are unchanged, because they lie along the tilt axis. Vertical lengths are foreshortened by cos 30° = 0.866. So the plate appears 220 mm long and 140 × 0.866 = **121.244 mm** high. The Ø60 bore appears as an ellipse with a horizontal major axis of 60 mm and a vertical minor axis of 60 × 0.866 = **51.962 mm**. The 100 mm pitch circle becomes an ellipse 100 × 86.603 mm, and the motor holes sit on it at horizontal offsets of ±35.355 mm and vertical offsets of ±35.355 × 0.866 = ±30.618 mm from the bore centre.

The drafter drew the view by scaling a copy of the plate's outline by 0.866 in the vertical direction only, a one-direction scale that most programs offer through a block insertion with different x and y scale factors. That turns every circle into exactly the right ellipse at once. The alternative, drawing each ellipse by its centre and axes, is equally exact and easier to edit later. Either way, the minor-to-major ratio of every ellipse must equal the height ratio of the outline, 121.244 ÷ 140 = 0.866, which is the check.

## The error: sine for cosine

This is an illustration. A colleague who drew an earlier version of the front elevation by hand calculation made the minor axis of the bore 60 × sin 30° = 30 mm instead of 60 × cos 30° = 51.962 mm. The ellipse looked plausibly squashed, and nobody questioned it until the frame designer checked the motor clearance in the view and found the motor apparently clearing a cross member by 20 mm more than it should.

The ratio check found it: 30 ÷ 60 = 0.5, while the plate outline in the same view had a height ratio of 0.866. A tilt of 30° from the vertical foreshortens vertical lengths by cos 30°; sin 30° is the factor for a face tilted 60°. A quick sanity test helps choose the function: at zero tilt the circle is true, so the factor must be 1, and cos 0° = 1 while sin 0° = 0.

```figure
type: svg
title: The bore seen square and in the frame's front view
alt: On the left, the plate's Ø60 bore drawn as a true circle with its 100 mm pitch circle and four holes. On the right, the same features in the frame's front view, where the face is tilted 30 degrees: the bore is an ellipse 60 wide and 51.962 high, the pitch circle an ellipse 100 wide and 86.603 high, and the four holes small ellipses at plus or minus 35.355 horizontally and plus or minus 30.618 vertically.
caption: This is an illustration, drawn at full scale. Horizontal sizes are unchanged; vertical sizes are multiplied by cos 30° = 0.866.
viewbox: 0 0 600 260
body:
<text class="txb" x="60" y="22">Square to the plate</text>
<circle class="bx" cx="140" cy="135" r="30"/>
<circle class="cl" cx="140" cy="135" r="50"/>
<circle class="bxi" cx="175.36" cy="99.64" r="4.5"/>
<circle class="bxi" cx="104.64" cy="99.64" r="4.5"/>
<circle class="bxi" cx="104.64" cy="170.36" r="4.5"/>
<circle class="bxi" cx="175.36" cy="170.36" r="4.5"/>
<text class="txs" x="96" y="230">Ø60 bore, PCD 100</text>
<text class="txb" x="340" y="22">Front view, face tilted 30°</text>
<ellipse class="bxa" cx="440" cy="135" rx="30" ry="25.98"/>
<ellipse class="cl" cx="440" cy="135" rx="50" ry="43.3"/>
<ellipse class="bxi" cx="475.36" cy="104.38" rx="4.5" ry="3.9"/>
<ellipse class="bxi" cx="404.64" cy="104.38" rx="4.5" ry="3.9"/>
<ellipse class="bxi" cx="404.64" cy="165.62" rx="4.5" ry="3.9"/>
<ellipse class="bxi" cx="475.36" cy="165.62" rx="4.5" ry="3.9"/>
<path class="la draw" pathLength="1" d="M520 109.02V160.98"/>
<text class="txa" x="528" y="140">51.962</text>
<path class="lf" d="M410 196H470"/>
<text class="txs" x="428" y="214">60</text>
<text class="txs" x="440" y="240" text-anchor="middle">Holes ±35.355 across, ±30.618 up and down</text>
```

## Cylinders cut at an angle

The opposite case arises when a round bar, pipe or conduit passes through a sloping plate. The hole in the plate is the intersection of a cylinder with an inclined plane, and it is an ellipse whose **minor axis** is the cylinder's diameter and whose **major axis** is stretched:

major axis = D ÷ cos θ

where θ is the angle between the plate and a plane square to the cylinder.

This is an illustration. A Ø60 cable conduit runs vertically past the motor and passes through a sheet metal guard that slopes at 30° from horizontal. The hole in the guard, drawn in the guard's own flat pattern, is an ellipse 60 mm across the slope and 60 ÷ cos 30° = **69.282 mm** along it, before any clearance is added. A circular hole of 60 mm would bind on the conduit; a circular hole of 69.3 mm would leave an unsightly gap at the sides. The ellipse fits.

The guard's flat pattern needs the ellipse because the guard is cut flat and then bent; the drafter draws the ellipse on the flat pattern at its true size. Its area, π × 34.641 × 30 = 3,264.8 mm², feeds the guard's mass, and its perimeter feeds the cutting time.

## The perimeter of an ellipse

Unlike a circle, an ellipse has no simple exact formula for its perimeter. The exact value needs an elliptic integral, which is what CAD software evaluates when it reports an ellipse's length. For hand checks, the approximation published by Srinivasa Ramanujan in 1914 is excellent:

P ≈ π × [3(a + b) − √((3a + b)(a + 3b))]

where a and b are the semi-axes, half the major and minor axes. For the ellipses in this chapter its error is far smaller than a thousandth of a millimetre. The KEVOS® [ellipse calculator](/tools/ellipse/) gives the perimeter and area from the two axes.

```figure
type: bars
title: Perimeters of the running case's round and elliptical features
unit: mm
caption: This is an illustration. Elliptical perimeters by Ramanujan's approximation, checked against numerical integration to 0.001 mm.
- Ø60 bore, true circle | 188.5
- Ø60 bore in the 30° front view, 60 × 51.962 | 176.1
- *Conduit hole in the guard, 69.282 × 60 | 203.34
```

## Isometric ellipses

Pictorial drawings in isometric show circles on the three principal faces as ellipses whose minor-to-major ratio is 0.577, which is tan 30°. In a true isometric projection, a circle of diameter D becomes an ellipse with a major axis of D and a minor axis of D × 0.577. Most isometric sketches, though, are drawn as **isometric drawings**, with lengths along the three axes at full size rather than foreshortened, which enlarges everything by 1 ÷ 0.8165 = 1.2247. In an isometric drawing, the circle becomes an ellipse with a major axis of 1.2247 D and a minor axis of 0.7071 D.

For the plate's Ø60 bore, that is 73.48 × 42.43 mm in an isometric drawing. Many CAD programs have an isometric ellipse mode that draws these directly on the current isometric plane. The pictorial is not used for dimensioning, but it often goes into assembly instructions, and an ellipse of the wrong proportion makes a round part look oval.

## How ellipses live in a CAD file

An ellipse is a different kind of object from a circle, and that has consequences downstream. Most CAD programs store a true ellipse by its centre, its major axis vector and its axis ratio, and calculate points on it exactly. Some older programs, and some settings in current ones, draw an ellipse instead as a polyline made of circular arcs, which looks the same but is only an approximation. Exchange formats add another layer: an ellipse written to an older file version, or read by simpler cutting software, may arrive as a spline or as a chain of short lines.

Two consequences matter for the running case. First, the offset of an ellipse is not an ellipse. If the guard's conduit hole needs 2 mm of clearance all round, offsetting the 69.282 × 60 mm ellipse by 2 mm produces a curve that most programs store as a spline; it is close to, but not the same as, an ellipse of 73.282 × 64 mm. Either can be right, but the drawing must say which, because an inspector checking the axes of the offset curve will find it slightly different from the ellipse with enlarged axes. Second, a cutting machine that cannot read ellipses or splines needs the curve converted to arcs or short lines, and Chapter 10 shows how to choose the tolerance for that conversion so that the cut shape stays within the design's limits.

## Exercise: the hole positions in the front view

The frame designer needs to know where the plate's two lower motor holes appear in the frame's front elevation, measured from the bore centre, and what size they are, to check that they clear a bracket edge drawn 32 mm below the bore centre in that view. Do they?

**Worked answer.** The lower holes are at 225° and 315° on the 100 mm pitch circle, offset ±35.355 mm horizontally and −35.355 mm vertically on the plate. In the front view, horizontal offsets are unchanged and vertical offsets are multiplied by cos 30° = 0.866, so the hole centres appear at ±35.355 mm horizontally and −30.618 mm vertically from the bore centre.

Each Ø9 hole appears as an ellipse 9 mm wide and 9 × 0.866 = 7.794 mm high, so its lowest point is 30.618 + 7.794 ÷ 2 = **34.515 mm** below the bore centre.

The bracket edge is drawn 32 mm below the bore centre, so the holes extend 2.5 mm past it. They do not clear. But the front view is foreshortened, so the drafter should confirm the clash on the true geometry, in an auxiliary view square to the plate or in the 3D model, before anyone redesigns the bracket. On the plate, the lowest point of each hole is 35.355 + 4.5 = 39.855 mm below the bore centre, and the bracket edge, if it lies on the plate's face, corresponds to 32 ÷ 0.866 = 36.95 mm on the plate. The clash is real: the holes overlap the bracket edge by 2.9 mm measured on the plate.
