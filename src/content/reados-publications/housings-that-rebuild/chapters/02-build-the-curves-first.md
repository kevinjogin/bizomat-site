---
book: housings-that-rebuild
chapterSlug: build-the-curves-first
order: 2
title: "Build the curves first"
description: "Replace chains of arcs with a few controlled splines, read curvature combs and fix imported outlines before any surface depends on them."
draft: false
---

A surface is only as good as the curves it is built on. A crown built from a wavy section will be wavy. A side wall trimmed to an outline made of forty short arcs will carry forty edges, and every one of them can trip a later fillet or shell. Time spent on curves at the start is repaid many times when surfaces, shells and splits begin to depend on them.

This chapter builds the three curves that control the housing's main form: the plan outline, the side profile and the crown section. It shows how to choose between arcs and splines, how to control a spline with few points, how to read its curvature, and how to repair an imported outline that would otherwise poison every surface built from it.

## Know what each curve type gives you

Sketch tools offer lines, arcs, conics and splines. Each has a different curvature behaviour, and curvature is what the eye reads on a glossy moulded surface.

```figure
type: compare
title: Curve types and their curvature
cols: Curvature along the curve | Typical use on the housing
caption: Curvature is 1 divided by the local radius. A line has none, an arc has a constant amount, and a spline can vary smoothly.
- Line | Zero everywhere | Straight side walls, parting line in side view
- Arc | Constant, 1 ÷ R | Plan corners at R10, simple crown section
- Conic | Varies, controlled by one shape value | Transitions where an arc looks too round
- *Spline | Varies smoothly, set by control points | Nose taper, side profile, freeform crown
```

Curvature is the reciprocal of the local radius. A straight line has curvature zero. An R10 arc has curvature **1 ÷ 10 = 0.1 per mm** everywhere along it. Where a line meets an arc tangentially, the direction is continuous but the curvature jumps from 0 to 0.1 per mm in an instant. That jump is invisible in a wireframe and obvious in a reflection on a gloss surface. Chapter 3 treats it as a continuity decision. For now, notice that choosing a curve type is already a decision about how faces will look.

## Prefer few controls to many points

Splines can be defined in two ways. A **fit-point** spline passes through points you place, and the system calculates the shape between them. A **control-point** spline, sometimes called a style spline or a control polygon, is pulled towards points that sit off the curve, rather like a flexible strip attracted by magnets.

Fit-point splines are intuitive, because you place the curve where you want it. They are also prone to wiggles. Each new fit point forces the curve through another location, and the curve can overshoot between points to satisfy them all. Control-point splines are less intuitive at first but tend to stay smooth, because moving one control point changes the curve gradually over a span.

This is an illustration. The industrial designer's side-view sketch of the housing's nose taper was first traced with an 11-point fit spline, following the drawing faithfully. Its curvature comb showed three inflections, places where the curve changed from bending one way to bending the other. None of them was in the designer's intent; they came from small errors in tracing. Rebuilding the same curve as a five-point control spline, with the end tangents constrained, gave a single smooth bend that stayed within 0.2 mm of the traced line along its whole length.

```figure
type: bars
title: Inflections in two versions of the nose curve
unit: inflections
max: 3
caption: This is an illustration. Fewer controls gave a curve that stayed within 0.2 mm of the trace with no unintended changes of bend.
- 11-point fit spline | 3
- *5-point control spline, tangents fixed | 0
```

The general rule is to use **the fewest controls that describe the shape**. Add a point only when the curve cannot reach the intended shape without it. Each extra point is another place for the curve to misbehave and another value someone must understand later.

## Read the curvature comb

Most CAD systems can display a curvature comb, sometimes called a curvature plot or porcupine. It draws a line perpendicular to the curve at regular intervals, with length proportional to the local curvature. The tips of these lines form an envelope. The comb is the single most useful tool for judging a curve.

```figure
type: svg
title: Reading a curvature comb
alt: A smooth curve with perpendicular comb lines. The comb envelope rises smoothly to a peak and falls again on the left curve. On the right curve the envelope jumps abruptly at a join and crosses to the other side at an inflection.
caption: A smooth envelope means smoothly changing curvature. A step in the envelope marks a curvature jump; a crossing marks an inflection.
viewbox: 0 0 640 260
body:
<text class="txb" x="30" y="28">Smooth spline</text>
<path class="li" d="M30 200 C 110 200, 200 120, 290 110"/>
<path class="lf" d="M60 199V187 M90 196V170 M120 189V150 M150 179V135 M180 167V126 M210 152V122 M240 137V121 M270 120V112"/>
<path class="la draw" pathLength="1" d="M60 187 C 100 160, 140 132, 180 126 S 250 121, 270 112"/>
<text class="tx txs" x="30" y="232">envelope changes gradually</text>
<text class="txb" x="350" y="28">Arc chain with a join</text>
<path class="li" d="M350 200 L 450 200 A 60 60 0 0 0 510 140 L 510 120"/>
<path class="lf" d="M380 200V200 M420 200V200 M460 197V167 M480 188V158 M497 174V145 M507 157V127"/>
<path class="la" d="M450 200 V 170 M460 167 L 507 127"/>
<circle class="fa pulse" cx="450" cy="200" r="5"/>
<text class="txa" x="420" y="225">jump</text>
<text class="tx txs" x="350" y="250">curvature steps from zero to 1 ÷ R at the join</text>
```

Read the comb for three things:

1. **Steps.** A sudden change in comb length at a point marks a curvature discontinuity. Between a line and a tangent arc, the comb goes from nothing to full length in one step.
2. **Crossings.** Where the comb flips from one side of the curve to the other, the curve has an inflection. That is acceptable only where the designer intended an S-shape.
3. **Bumps.** A comb envelope with local humps means the curvature rises and falls without reason. On a moulded part, bumps show up as wavering reflections.

Scale the comb display so the longest line is a sensible fraction of the curve length. A comb scaled too small hides problems; one scaled too large turns every gentle variation into apparent drama.

## Build the crown section from the brief

The crown section is the simplest of the three controlling curves, and a good place to start with numbers. The brief says the crown rises 6 mm across the 72 mm width. If the section is a circular arc, its radius follows from the chord and rise:

```figure
type: formula
title: Crown radius from chord and rise
formula: R = (c² ÷ 4 + h²) ÷ (2h)
caption: This is an illustration. A circular crown gives constant curvature across the width; a spline would let it vary.
- R | crown radius, mm
- c | chord, the housing width, mm
- h | rise of the crown above the chord, mm
step: R = (72² ÷ 4 + 6²) ÷ (2 × 6) = (1,296 + 36) ÷ 12 = 111 mm
step: Curvature = 1 ÷ 111 ≈ 0.009 per mm
step: Arc length across the top = 111 × 0.661 rad ≈ 73.3 mm
```

A circular crown has constant curvature, 0.009 per mm, from one side to the other. That is simple and robust, but it may look flat in the middle and abrupt at the edges once fillets are added. A three-point control spline with its end tangents set by the side-wall draft can give a crown that is fuller in the centre and softer at the edges, while still rising exactly 6 mm. The choice is the designer's; the modelling point is to make the rise a parameter and constrain the spline so that the rise stays exact when other values change.

## Control tangency with construction geometry

A spline's end tangents matter as much as its interior shape. If the nose curve must leave the straight side wall tangentially, the spline's start tangent must be constrained to that wall, not merely look aligned.

Construction lines are the cleanest way to do this. Draw a construction line along the direction you want, constrain the spline's end handle to be collinear with it, and dimension the construction line's angle from a reference plane if it needs to change. For the housing's side profile, the rear end of the profile spline is tangent to a construction line drawn at the draft angle, 1.0° from vertical. When the draft parameter changes, the construction line rotates and the spline follows.

Handle length, sometimes called tangent weighting, also matters. A short handle makes the curve turn quickly after leaving the end; a long one makes it run straight for longer. Dimension handle lengths when they carry intent, rather than dragging them by eye. A housing whose nose looks right in one version and pinched in the next often has an undimensioned handle that moved when something else changed.

## Use three-dimensional curves where the shape is not planar

Some housing edges do not lie in any plane. The edge where the crowned top meets a drafted side wall is one: it rises and falls as the crown curves and leans in with the draft. Two methods produce such curves.

The first is a **projected curve**, created by projecting a plan sketch onto the crown surface, or by intersecting two sketches drawn on different planes. This keeps intent in two-dimensional sketches, which are easy to dimension and edit. The second is a **three-dimensional sketch**, where a spline is drawn and constrained in space directly. Three-dimensional sketches are powerful but harder to constrain fully, and they tend to hold intent less clearly.

Prefer the projected or intersection curve where it can do the job. It is defined by sketches a colleague can read, and it updates predictably. Use a three-dimensional sketch where the curve genuinely has no planar source, such as a guide curve that must touch three non-coplanar edges.

## Repair an imported outline before using it

This is an illustration. The plan outline arrived from the styling package as a DXF. Imported into a sketch, it contained 37 entities: short arcs and lines approximating the outline, with endpoints that nearly but not quite met. The largest gap measured 0.004 mm. An extruded surface from this outline would have had 37 faces around its perimeter, and a fillet along the top edge would have needed to run across 36 tiny edges.

The defect showed up in two ways. The sketch would not close for an extrude until the gaps were merged, and once merged, the curvature comb was a ragged series of steps. Either symptom is enough to stop and repair.

```figure
type: steps
title: Repairing the imported plan outline
caption: This is an illustration. The result is one spline per side with tangent, curvature-checked joins to the R10 corners.
- Fix the import | set it to construction, lock it in place
- Identify the real shape | straight sides, R10 corners, nose taper
- Redraw primitives | lines and arcs where the design is truly straight or round
- *Fit splines | fit the nose taper with a tolerance of 0.05 mm
- Constrain joins | tangent to neighbours, curvature where required
- Check | comb, deviation from the import, closed profile
```

The key step is the fit. Most systems have a fit-spline tool that replaces a chain of entities with a single spline within a stated tolerance. A tolerance of 0.05 mm turned the nose taper's 21 imported segments into one spline. The deviation analysis reported a maximum distance of 0.04 mm from the original chain, well inside the industrial designer's stated limit of 0.2 mm. The straight sides and corners were redrawn as true lines and R10 arcs, because those were their intended shapes. The repaired outline had seven entities instead of 37.

Keep the import in the model after the repair, hidden in a reference folder. It is the record of what the designer supplied, and a later deviation check against it is the quickest way to prove that the clean outline still matches the styling after other changes. If the styling package issues a revised outline, import it beside the old one and compare the two before touching the clean curves: often only one region has changed, and only that spline needs to be refitted.

If a fitted spline needs more than a handful of control points to stay within tolerance, check the import again. The source may contain a genuine feature the fit is fighting, or the tolerance may be tighter than the design needs.

## Match curves that will be lofted together

Curves that will later form the boundaries of one surface need to be compatible, not just individually smooth. Two properties matter most.

The first is **degree and structure**. A spline's degree sets how many neighbouring control points influence each part of it. Cubic splines, degree 3, are the common default and give curvature continuity within the curve. If one section of a loft is a cubic spline with five control points and the next is an arc converted to a spline with a different structure, the system must reconcile them. It usually does so by adding internal detail to the surface, which shows up as extra isoparametric lines and can create subtle ripples.

The second is **parameterisation**, the way a curve's internal parameter runs along its length. Two curves can have the same shape while one places most of its parameter range in its first third and the other spreads it evenly. A loft connects points of equal parameter, not equal distance. Mismatched parameterisation produces a twisted surface even when both boundaries look correct.

This is an illustration. The first attempt at a loft between the housing's rear section and its nose section produced a surface that visibly twisted near the nose. Both sections passed the comb check. The cause was that the rear section was drawn as two arcs and a line, converted automatically, while the nose section was a single control spline. Redrawing the rear section as a control spline with the same number of points as the nose section, and aligning their start points on the centre plane, removed the twist without changing either shape by more than 0.05 mm.

The practical habits are simple:

- Build curves that will be connected with the same type and a similar number of controls.
- Start every closed section at the same place, such as the centre plane, and run it in the same direction.
- Where the system allows connectors or synchronisation points between sections, use them deliberately rather than accepting the default.

## Know what curves can and cannot fix

Good curves do not guarantee good surfaces. A surface can still twist, bulge or pinch between well-behaved boundaries, especially if the boundary curves have very different parameterisation, meaning their points are spaced differently along their lengths. They also cannot repair intent errors: a smooth curve placed in the wrong position is still wrong. Treat the curve check as necessary, not sufficient, and repeat the analysis on the surfaces in Chapter 3.

The edited Library chapter on [choosing and checking curves in CAD](/reados/collections/cad-modelling-and-design-intent/choosing-and-checking-curves-in-cad/) covers curve representations and conversion more generally.

## Exercise: raise the crown

The industrial designer asks for a fuller look, with the crown rising 8 mm across the same 72 mm width instead of 6 mm. If the crown stays a circular arc, what is the new radius and curvature? Which other curves should be checked after the change?

**Worked answer.** Using the same formula, R = (72² ÷ 4 + 8²) ÷ (2 × 8) = (1,296 + 64) ÷ 16 = **85 mm**. The curvature rises from about 0.009 per mm to **1 ÷ 85 ≈ 0.0118 per mm**, roughly 31% more.

Because the crown rise is a parameter, the section sketch updates directly. Check the side profile, because its top line meets the crown section, and any projected curve that uses the crown surface, such as the crown-to-side edge. Run the curvature comb on each. The crown is now steeper at the sides: the arc leaves the centre plane horizontally and meets each side at about 25° to the horizontal instead of about 19°. That changes how the edge fillet in Chapter 3 behaves, so note it as an open check before moving on.
