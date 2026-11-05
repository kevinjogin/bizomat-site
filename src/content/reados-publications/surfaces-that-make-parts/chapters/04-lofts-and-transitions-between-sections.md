---
book: surfaces-that-make-parts
chapterSlug: lofts-and-transitions-between-sections
order: 4
title: "Lofts and transitions between sections"
description: "Loft a round-to-rectangular transition with matched segments, guide curves and end conditions, then check section area and volume along its length before trusting it."
draft: false
---

A loft builds a surface through a series of sections. Where a sweep carries one profile along a path, a loft blends between different profiles, which is exactly what a transition needs. It is also the surface tool most likely to produce a shape that rebuilds without error and is still wrong: twisted, pinched or bulging between its sections.

This chapter builds the duct's transition from the skeleton of Chapter 2, controls it with matched segments, guide curves and end conditions, and then measures what it actually made. The measurement finds a problem the screen does not show: the passage bulges in the middle. The correction is a single extra section, chosen by calculation.

## How a loft works

A loft needs at least two sections, selected in order. Between them, the software builds a surface by connecting corresponding points on neighbouring sections and blending smoothly through all of them. The choices it makes, and the controls you have over them, are:

- **Correspondence.** Which point on one section joins which point on the next. The software shows this as connector lines in the preview. Most modellers let you drag connectors or set synchronisation points.
- **Guides.** Curves that the loft must follow between sections. Each guide must touch every section it crosses.
- **Centreline.** An optional curve that the sections are blended along, useful for curved transitions without guides.
- **End conditions.** How the surface leaves the first section and arrives at the last: free, normal to the section, or tangent to a neighbouring face.

All sections in one loft must be of the same kind. A closed section cannot loft to an open one. For the duct, both end sections are closed, and the loft produces a closed tube without end caps.

## Match the segments

The software matches sections segment by segment where it can. A rounded rectangle has eight segments: four lines and four arcs. A plain circle has one. Given a one-segment circle and an eight-segment rectangle, the software must decide for itself where the rectangle's corners come from on the circle, and it usually starts from the circle's seam point.

This is an illustration of the result on the duct. The designer's first loft used an unsplit circle whose seam sat at the top, and a rectangle sketch whose first segment started at a corner. The loft rebuilt and looked plausible in a shaded view. In the preview, though, the connector lines ran diagonally: the top of the circle was joined to the rectangle's top-left corner, so the surface twisted by roughly 22° along the transition. Measured sections showed the skew, and the side guides, which still forced the side points to meet, created two creases where the twisted surface was pulled back into line.

The correction was the eight-segment circle from Chapter 2. The rectangle's segments change at four tangent points on each side of its centre. The points where the top and bottom lines meet the corner arcs sit at (±75, ±30) mm from the centre, at angles of ±21.8° from horizontal. The points where the side lines meet the arcs sit at (±90, ±15) mm, at ±9.5°. Splitting the circle at the same polar angles gives eight arcs that correspond one to one with the rectangle's segments. With the connectors aligned, the surface ran straight and the creases vanished.

```figure
type: svg
title: Correspondence between the inlet circle and the outlet rectangle
alt: Left, a circle split into eight arcs at polar angles of plus and minus 9.5 and 21.8 degrees on each side. Right, a 180 by 60 rounded rectangle with eight segments. Connector lines join each split point on the circle to the matching tangent point on the rectangle.
caption: This is an illustration. Matching split points at the same polar angles stops the loft from twisting. Shapes are not to a common scale.
viewbox: 0 0 640 260
body:
<circle class="ln" cx="130" cy="130" r="90"/>
<circle class="fa" cx="218.8" cy="115.2" r="4"/>
<circle class="fa" cx="218.8" cy="144.8" r="4"/>
<circle class="fa" cx="213.6" cy="96.6" r="4"/>
<circle class="fa" cx="213.6" cy="163.4" r="4"/>
<circle class="fa" cx="41.2" cy="115.2" r="4"/>
<circle class="fa" cx="41.2" cy="144.8" r="4"/>
<circle class="fa" cx="46.4" cy="96.6" r="4"/>
<circle class="fa" cx="46.4" cy="163.4" r="4"/>
<rect class="ln" x="380" y="90" width="240" height="80" rx="20"/>
<circle class="fa" cx="620" cy="110" r="4"/>
<circle class="fa" cx="620" cy="150" r="4"/>
<circle class="fa" cx="600" cy="90" r="4"/>
<circle class="fa" cx="600" cy="170" r="4"/>
<circle class="fa" cx="380" cy="110" r="4"/>
<circle class="fa" cx="380" cy="150" r="4"/>
<circle class="fa" cx="400" cy="90" r="4"/>
<circle class="fa" cx="400" cy="170" r="4"/>
<path class="la dsh" d="M218.8 115.2L620 110"/>
<path class="la dsh" d="M213.6 96.6L600 90"/>
<path class="la dsh" d="M218.8 144.8L620 150"/>
<path class="la dsh" d="M213.6 163.4L600 170"/>
<text class="txb" x="88" y="246">Inlet, 8 arcs</text>
<text class="txb" x="430" y="216">Outlet, 4 lines + 4 arcs</text>
<text class="tx txs" x="58" y="101">21.8°</text>
<text class="tx txs" x="54" y="120">9.5°</text>
```

The general lesson is to look at the connectors in every loft preview. A loft that rebuilds is not a loft that is right. Diagonal or crossing connectors mean a twist, and a twisted surface will cause trouble when it is filleted, offset or thickened.

## Guides fix the outline, not the corners

With the four guides from Chapter 2, the loft's top, bottom and side lines are fully controlled. What the guides do not control is the shape between them: how quickly each corner region changes from the circle's 60 mm radius to the rectangle's 15 mm radius. The loft decides that by blending the corresponding segments of the end sections.

That freedom affects the flow area, which is the duct's main requirement. The only way to know what the loft did is to measure it.

## Check the section area along the length

Cut sections through the finished loft at regular intervals, for example at s = 0, 0.25, 0.5, 0.75 and 1, and measure the enclosed area. Most modellers can report the area of a planar region bounded by section edges, or the area of a face made by a planar surface across the section.

For planning, the designer estimated each section as a rounded rectangle. The guides fix the width W = 120 + 60f and the height H = 120 − 60f. The corner radius was assumed to change in the same proportion, r = 60 − 45f, from 60 mm (a circle is a rounded square whose corner radius is half its side) to 15 mm. The area is W × H − (4 − π)r². This is an illustration: the real loft's corners are not exact arcs, and the CAD measurement is the value to rely on. The estimate tells you where to look.

```figure
type: bars
title: Estimated flow area along the transition, before correction
unit: mm²
max: 13000
caption: This is an illustration. The default blend bulges to 8.7% above the inlet area at mid-length, more than the 5% the case allows.
- s = 0, inlet circle | 11309.7
- s = 0.25 | 11903.7
- *s = 0.5, mid-length | 12292.9
- s = 0.75 | 11420.5
- s = 1, outlet | 10606.9
```

At mid-length, the section is 150 mm wide and 90 mm high with an estimated corner radius of 37.5 mm, giving **12,292.9 mm²**, 8.7% more than the inlet. The duct expands and then contracts again. The mean velocity falls from 10.61 m/s to about 9.76 m/s in the middle before rising to 11.31 m/s at the outlet. For the case, the designer has set a limit: no section more than 5% larger than the inlet, to avoid a slow, separated region in the middle of the duct.

The CAD measurement of the actual loft agreed with the estimate closely enough to confirm the bulge. The cause is geometric. The guides fix width and height, and their product at mid-length, 150 × 90 = 13,500 mm², is bigger than at either end. The corners have to remove more area there than a linear blend of radii removes.

## Correct the bulge with a mid-section

With the guides fixed, the only free quantity at mid-length is the corner radius. A larger radius removes more area. The geometric limit in a section 90 mm high is 45 mm, which would make each short side a full semicircle. That limit cannot be used here: at 45 mm the two short straight sides shrink to zero length, the section has six segments instead of eight, and the one-to-one matching with the end sections breaks. The designer therefore chose 44 mm, which leaves a 2 mm straight side. The area is

**150 × 90 − (4 − π) × 44² = 13,500 − 1,661.9 = 11,838.1 mm²**

That is **4.7%** above the inlet area, within the 5% limit. The designer sketched this section on the mid-plane at x = 140, with its ends piercing the four guides, split it into eight segments at matching points, and added it to the loft as a third section. The re-measured mid-length area matched the sketch, the velocity there became about 10.14 m/s, and the sections either side fell smoothly between their neighbours.

```figure
type: compare
title: Mid-length section, before and after adding a control section
cols: Corner radius | Area | Change from inlet | Mean velocity at 0.12 m³/s
caption: This is an illustration. The guides fix 150 × 90 mm at mid-length; only the corner radius was free to change.
- Default blend | 37.5 mm | 12,292.9 mm² | +8.7% | 9.76 m/s
- *Control section added | 44 mm | 11,838.1 mm² | +4.7% | 10.14 m/s
```

A remaining 4% expansion is a design decision, not a geometric necessity. If the limit were tighter, the guides themselves would have to change, perhaps narrowing the side guides in the first half of the transition so that the width grows later than the height falls. The point of the check is that the decision is made by someone looking at a number.

## A routine for measuring sections

Section checks are only useful if they are repeatable. The designer on the case wrote down a routine and kept the result with the model:

1. Create reference planes normal to the duct axis at x = 40, 90, 140, 190 and 240 mm, offset from the origin plane by named dimensions so they stay put when the surfaces change.
2. On each plane, make the intersection curve of the plane and the loft. Most modellers have an intersection-curve or split-line tool for this.
3. Build a planar surface bounded by that curve and read its area, or measure the closed sketch directly if the software reports enclosed area.
4. Record each area against the estimate, with the model revision and the date.
5. Flag any section that departs from the estimate by more than about 2%, or that exceeds the 5% limit against the inlet, and find out why before going further.
6. Suppress or hide the measuring planes and surfaces afterwards, and name them so it is clear they are checks, not product.

The routine takes a few minutes and runs again after any change to the skeleton. It also gives the reviewer something concrete: a table of five numbers that either meets the limit or does not.

## Count the faces the loft made

A loft between eight-segment sections usually makes eight faces, one for each pair of corresponding segments, running the full length of the transition. The edges between those faces run lengthwise along the duct. At the outlet, they fall exactly where the rectangle's straight sides meet its corner arcs.

Those lengthwise edges are normal, but they carry information. Where a flat face meets a 15 mm arc at the outlet, the surfaces are tangent but the curvature jumps from zero to 1 ÷ 15 = 0.067 per mm. The join is G1, the same as at the ends of the guides. For the inside of a duct that is acceptable. It will show up in the zebra-stripe check in Chapter 8 as a slight bend in the stripes, and the designer should expect it there rather than treat it as a fault.

The edges also matter to later operations. A fillet or offset that crosses one of these edges must handle the change of face. If the loft has produced more faces than expected, for example sixteen thin faces because one section was split at extra points, look at the sketches before going further. Extra faces mean extra edges, and extra edges are where knits, offsets and fillets fail.

## Volume by the prismoidal formula

The enclosed volume of the transition is useful later for the fluid model and as a check on the closed body in Chapter 7. With three sections, the prismoidal formula gives a good estimate:

**V = L ÷ 6 × (A₀ + 4Aₘ + A₁)**

With L = 200 mm, A₀ = 11,309.7, Aₘ = 11,838.1 and A₁ = 10,606.9 mm², V = 33.333 × (11,309.7 + 47,352.5 + 10,606.9) = **2,308,970 mm³**, about 2.31 litres. The uncorrected loft would have held about 2.37 litres. The BIZOMAT [Prismoidal Formula Volume](/tools/prismoidal-volume/) tool runs the same calculation.

## Set the end conditions

The loft meets the revolved round section at x = 40 and the flange at x = 240. Two end conditions finish the job:

- **Start: tangent to the revolved face.** This matches the surface direction across the join, so the inside of the duct has no ridge where the round section ends. The guides already start with zero slope, so the condition and the guides agree.
- **End: normal to the outlet section.** This makes the duct arrive square to the flange, so the flange face can be a flat region around the opening and the outlet section is a true 180 by 60 rectangle, not a slightly flared one.

If an end condition fights a guide, for example a guide that arrives at 5° while the condition demands 0°, the loft either fails or creates a tight ripple near the end. Make guides and end conditions agree in the skeleton rather than letting the loft compromise.

## When to use a boundary surface instead

Many modellers also offer a boundary surface, built from curves in two directions: sections one way, guides the other. It gives more direct control of the surface at each edge, including curvature continuity, and some designers prefer it for transitions where all four sides must meet neighbouring faces precisely. A loft with guides is easier to set up and is adequate for the duct. Use the boundary surface when a loft's edges cannot be made to meet their neighbours with the continuity you need.

## Exercise: a compromise corner radius

A toolmaker finds the 2 mm straight sides at mid-length awkward to inspect and suggests a 40 mm corner radius there instead. Calculate the mid-length area and its change from the inlet, and say whether it meets the 5% limit.

**Worked answer.** A = 150 × 90 − (4 − π) × 40² = 13,500 − 0.8584 × 1,600 = 13,500 − 1,373.5 = **12,126.5 mm²**. Compared with 11,309.7 mm² at the inlet, that is **+7.2%**, which fails the 5% limit.

The toolmaker's concern may still be valid, so it should be discussed rather than dismissed. One route is to keep the 44 mm radius and show the toolmaker that the control section is only an intermediate section of a smooth surface, not a feature that needs its own tooling. Another is to adjust the guides so the mid-length section is narrower or lower. Either way, the area check decides whether a proposed change is acceptable, and it has to be repeated after any change to the loft.
