---
book: surfaces-that-make-parts
chapterSlug: curves-and-planes-that-carry-the-shape
order: 2
title: "Curves and planes that carry the shape"
description: "Build the skeleton of a surface model: named planes, section sketches and guide curves with known slopes, curvature and end conditions, checked before any surface exists."
draft: false
---

Every surface in a parametric model is built from curves. An extruded surface needs a profile, a loft needs sections and guides, a fill needs a boundary. If the curves are right, the surfaces usually behave. If the curves are slightly wrong, the surfaces inherit the error, and the fault appears much later as a twist, a gap or a failed thicken that is hard to trace back.

This chapter builds the skeleton of the duct: the planes, the two end sections and the guide curves that fix how the shape changes along its length. It treats each curve as a piece of engineering geometry with a slope and a curvature that can be calculated, not as a line dragged until it looks right. The companion chapter [Choosing and checking curves in CAD](/reados/collections/cad-modelling-and-design-intent/choosing-and-checking-curves-in-cad/) covers curve types in general; here the focus is on curves that will carry surfaces.

## Start from planes you can name

A skeleton begins with reference planes placed by numbers that come from the requirement. For the duct, the long axis runs along x, with x = 0 at the inlet mouth. The planes are:

- the inlet plane at x = 0, where the bell-mouth starts;
- the transition start at x = 40, where the 30 mm straight round section ends after the 10 mm bell-mouth;
- a mid-plane at x = 140, halfway along the transition, for a control section if one is needed;
- the outlet plane at x = 240, which is also the flange face;
- the vertical plane of symmetry, y = 0, on which the duct will later be split.

Each plane is offset from the part's base planes by a named dimension, not from a face of another feature. A plane offset from a face moves when that face moves, and it disappears if the face is deleted or renamed by a rebuild. A plane offset from the origin planes by "transition length" survives any change to the surfaces built on it.

Place planes where sections or guides need them, and no more. A skeleton cluttered with spare planes invites the next designer to attach something to the wrong one.

## Draw the end sections

The inlet section of the transition is a circle of 120 mm diameter on the plane at x = 40, centred on the axis. The outlet section is a rounded rectangle 180 mm by 60 mm with 15 mm corner radii on the plane at x = 240, centred 30 mm below the axis.

Both sketches should be fully defined, with every dimension tied to the named variables from Chapter 1. A section that can still move will move, usually when a relation elsewhere is edited, and the loft will follow it without warning.

There is one deliberate oddity. The rounded rectangle is made of eight segments: four straight lines and four arcs. A single circle is one segment. When the loft in Chapter 4 matches the two sections, it works best when both have the same number of segments meeting at corresponding points. The circle is therefore drawn as eight arcs, split at the angles where the rectangle's lines and arcs meet, or split later with split points. That looks unnecessary in the sketch, but it is what lets the loft run without a twist.

## Guide curves fix the side and plan views

Two sections alone leave the loft free to choose how the shape changes between them. Guide curves remove that freedom. The duct needs four:

- a **top guide** in the plane of symmetry, from the top of the circle at height 60 mm to the top of the rectangle at height 0;
- a **bottom guide** in the same plane, from the bottom of the circle at −60 mm to the bottom of the rectangle, also at −60 mm, so it is a straight line;
- two **side guides** in the horizontal plane through the axis, from the sides of the circle at ±60 mm to the sides of the rectangle at ±90 mm.

The centre of each section is the average of its top and bottom, so the centre falls from 0 to −30 mm as required.

Each guide needs a shape between its ends. A straight line would give a sharp change of direction where the transition meets the round section and again at the flange. Instead each guide follows the smooth step

**f(s) = 3s² − 2s³**

where s runs from 0 at the start of the transition to 1 at the outlet, so s = (x − 40) ÷ 200. The function starts at 0 and ends at 1 with zero slope at both ends. The top guide is then z = 60 − 60f(s), and the side guides are y = ±(60 + 30f(s)).

```figure
type: compare
title: Guide curve values along the transition
cols: x (mm) | f(s) | Top z (mm) | Side y (mm) | Centre z (mm)
caption: This is an illustration. Zero slope at both ends lets the guides meet the round section and the flange without a kink.
- s = 0 | 40 | 0 | 60.000 | ±60.000 | 0.000
- s = 0.25 | 90 | 0.15625 | 50.625 | ±64.688 | −4.688
- *s = 0.5 | 140 | 0.5 | 30.000 | ±75.000 | −15.000
- s = 0.75 | 190 | 0.84375 | 9.375 | ±85.313 | −25.313
- s = 1 | 240 | 1 | 0.000 | ±90.000 | −30.000
```

## Know the slope and curvature of each guide

A guide curve is only useful if you know what it does. Two numbers matter: the steepest slope and the tightest curvature.

The slope of f with respect to s is 6s(1 − s), which is greatest at s = 0.5, where it equals 1.5. The top guide falls 60 mm over 200 mm, so its steepest slope is 60 × 1.5 ÷ 200 = 0.45, an angle of **24.2°** to the axis. The side guides grow by 30 mm over the same length, so their steepest slope is 0.225, or **12.7°**. Both are mild for a flow passage, and both occur at the mid-plane.

Curvature is the reciprocal of the local radius. At the ends of the guide, where the slope is zero, the curvature equals the second derivative. For the top guide, that is 60 × 6 ÷ 200² = **0.009 per mm**, a radius of **111.1 mm**. The straight round section it joins has zero curvature. So the top guide meets the round section with matching position and direction but a jump in curvature, from 0 to 0.009 per mm.

That jump defines the continuity of the join, a term used throughout this book:

```figure
type: layers
title: Levels of continuity where two curves or surfaces meet
caption: Each level includes the ones above it. The duct's guides give G1 at the ends of the transition; Chapter 8 shows how to see the difference.
- G0, position | The curves touch; there may be a sharp corner.
- G1, tangent | Same direction at the join; the curvature may jump.
- *G2, curvature | Same direction and same curvature; reflections run smoothly across the join.
- G3 and above | Rate of change of curvature also matches; used for visible styling surfaces.
```

A G1 join is adequate for the inside of a duct. If the outside were a visible styled surface, the designer might choose a guide with zero curvature at its ends as well, for example the quintic step 10s³ − 15s⁴ + 6s⁵. The price is a steeper middle: its greatest slope is 1.875, so the top guide would reach 29.4° instead of 24.2°. Smoothness at the ends is paid for with steepness in the middle. The skeleton is where that trade-off is made, by calculation.

## Fit points or control points

CAD systems draw free-form curves as splines, almost always non-uniform rational B-splines (NURBS) underneath. You can usually define a spline in one of two ways. With **fit points**, you place points the curve must pass through and the software chooses the curve. With **control points**, you place a control polygon and the curve follows it without passing through the inner points.

Fit points feel natural but give less control between the points: the curve can bulge or ripple, and adding a point to fix one region changes the shape elsewhere. Control points give direct control of slope and curvature at the ends, because the first and last legs of the polygon set the end tangents.

The smooth step above can be drawn exactly as a cubic spline with four control points. Placed at equal spacing along the transition, at x = 40, 106.67, 173.33 and 240 mm, with heights 60, 60, 0 and 0 mm, they produce precisely z = 60 − 60f(s). The first two points at the same height make the start horizontal; the last two make the end horizontal.

```figure
type: svg
title: Top guide drawn from four control points
alt: A control polygon with four points. The first two are at height 60 mm, at x 40 and 106.67 mm; the last two at height 0, at x 173.33 and 240 mm. The cubic curve starts and ends horizontal and passes through height 30 at x 140.
caption: This is an illustration. Equal spacing along x and the end legs held level give the smooth step exactly, with a known 24.2° slope at mid-length.
viewbox: 0 0 640 280
body:
<path class="lf dsh" d="M60 70H226.7L393.3 220H560"/>
<circle class="bxi" cx="60" cy="70" r="6"/>
<circle class="bxi" cx="226.7" cy="70" r="6"/>
<circle class="bxi" cx="393.3" cy="220" r="6"/>
<circle class="bxi" cx="560" cy="220" r="6"/>
<path class="la draw" pathLength="1" d="M60 70C226.7 70 393.3 220 560 220"/>
<circle class="fa" cx="310" cy="145" r="5"/>
<text class="tx txs" x="40" y="54">x 40, z 60</text>
<text class="tx txs" x="200" y="54">x 106.67, z 60</text>
<text class="tx txs" x="360" y="246">x 173.33, z 0</text>
<text class="tx txs" x="530" y="246">x 240, z 0</text>
<text class="txa" x="328" y="140">x 140, z 30, slope 24.2°</text>
```

A curve built this way can be reviewed by reading four coordinates. A fit-point spline with a dozen points, adjusted by eye, cannot.

## The other skeleton sketches

Two more sketches complete the skeleton.

The first is the **revolve profile** for the inlet, drawn in the plane of symmetry. It is a straight line at radius 60 mm from x = 10 to x = 40, the round section, joined at x = 10 by a quarter arc of 10 mm radius whose centre sits at x = 10 and radius 70 mm. The arc leaves the straight line tangentially and finishes at x = 0, radius 70 mm, pointing radially outwards. The tangent relation between line and arc must be explicit in the sketch. Without it, a later change to the bell-mouth radius can leave a small kink that no one sees until the surface is checked.

The profile ends at x = 40, the same point where the top guide starts. That shared point is what lets the revolved round section and the lofted transition meet edge to edge in Chapter 4. Reference the guide's start to the profile's end point, or both to the same plane and dimension, so they cannot drift apart.

The second is the **flange outline** on the outlet plane: a rectangle 230 mm by 110 mm, centred on the outlet centre 30 mm below the axis. With an opening of 180 mm by 60 mm, that leaves a margin of (230 − 180) ÷ 2 = 25 mm at the sides and (110 − 60) ÷ 2 = 25 mm at the top and bottom. Dimension the outline as "opening plus two margins" rather than as fixed numbers. If the outlet grows, the flange grows with it, and the 25 mm seal and bolt land stays the same width.

With these sketches, every edge of the eventual flow surface is defined before any surface exists: the inlet lip, the junction at x = 40, the outlet edge, the flange outline and the four guides between them.

## Make every guide touch every section

A loft guide must meet each section it passes. In most modellers, this means a pierce or coincident relation between the guide's end and a point on the section sketch. Being visually close is not enough.

This is an illustration of a mistake from the case. The designer drew the side guides in a sketch on the horizontal plane through the axis and snapped their ends to the circle's silhouette as seen on screen. On the outlet end, the snap picked the edge of the rectangle's corner arc rather than the end of its straight side, 0.2 mm away. The loft accepted the guide but produced a narrow crease along the side wall, and in another attempt reported that the guide did not intersect a profile.

The cause was found by checking the guide's end relation: it was coincident with an arc, not with the line's end point. The fix was to delete the snap relation and add a pierce relation between the guide and the end point of the rectangle's vertical side, then to add the same relation at the circle's split point. The crease disappeared. Afterwards the designer measured the distance from each guide end to its section: zero in every case.

```figure
type: checklist
title: Skeleton checks before the first surface
caption: Every item has a yes or no answer. An open item is a reason not to start surfacing.
- Planes offset from origin planes by named dimensions
- Both end sections fully defined from named variables
- Circle split into eight segments matching the rectangle
- Guide ends pierce or coincide with section points, measured gap zero
- Guide end slopes zero where the transition meets neighbours
- ? Steepest slope and end curvature calculated and recorded
- ? Mid-plane section needed? Decided after the area check in Chapter 4
```

## Keep the skeleton together

Put the skeleton sketches near the top of the feature tree, name them for what they do ("Top guide", "Outlet section") and keep them free of references to generated geometry. A sketch that references an edge of a surface built later in the tree creates a loop that the software may resolve unpredictably on rebuild. A skeleton that references only planes and the origin is stable.

Where a curve must be derived from a surface, such as a curve projected onto the duct for the pressure-switch pad, build it after the surface and name it so that its dependency is clear. That is a local feature, not part of the skeleton.

Finally, rebuild the skeleton on its own before surfacing: suppress everything after it and change two or three named variables to extreme but plausible values. A 160 mm transition length, a 40 mm drop, a 20 mm corner radius. If the sketches stay fully defined and the guides still pierce their sections, the skeleton is robust. If a relation flips or a guide pulls away, fix it now, while there are no surfaces depending on it.

## Exercise: slope at the pressure-switch pad

The pressure-switch pad will sit part-way along the transition, starting at x = 90 mm. Calculate the height of the top guide and its slope at that position, and say whether the bottom guide needs any check there.

**Worked answer.** At x = 90, s = (90 − 40) ÷ 200 = 0.25. Then f = 3 × 0.0625 − 2 × 0.015625 = **0.15625**, and the top guide height is 60 − 60 × 0.15625 = **50.625 mm**. The slope of f is 6 × 0.25 × 0.75 = 1.125, so the top guide's slope is 60 × 1.125 ÷ 200 = **0.3375**, an angle of **18.6°** to the axis.

The bottom guide is a straight line at −60 mm, so its height and slope are constant: no check is needed beyond confirming it pierces both sections. The value of the exercise is that a pad placed on a surface with an 18.6° slope will not sit flat on a plane parallel to the axis. Chapter 5 uses the side-guide values to orient the pad correctly.
