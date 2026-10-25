---
book: surfaces-that-make-parts
chapterSlug: when-a-part-needs-surfaces
order: 1
title: "When a part needs surfaces"
description: "What a CAD surface is, which shapes need one, why every surface model ends as a solid, and how to plan the build of a round-to-rectangular moulded duct."
draft: false
---

A solid model describes a volume. A surface model describes a skin. In a solid, every face belongs to a closed boundary with material on one side, so the software always knows what is inside the part. A surface has no inside. It is a sheet of zero thickness that can be open at its edges, can cross other sheets, and can be stretched, trimmed and patched freely before anyone decides where the material goes.

That freedom is the reason to use surfaces and the reason to be careful with them. This chapter explains what surfaces are for, why the work almost always ends by turning them back into a solid, and how to plan a surface model before drawing anything. It introduces the running case: a moulded air-inlet duct that has to change shape from round to rectangular without losing flow area.

## What a surface is, and what it is not

Every solid model already contains surfaces. Each face of an extruded block is a bounded piece of a plane; each face of a hole is a bounded piece of a cylinder. The solid is the set of those faces stitched into a closed shell, with the software keeping track of which side holds material. A surface body is the same kind of face, or a set of faces, without the requirement to close.

Because a surface has no thickness, it has no volume and no mass. You cannot section it to show material, assign it a density, or check its wall. A mass-properties report on a surface body gives an area at best. A drawing view of a surface shows edges, not hatching. A machining program or a mould design needs a closed solid or a surface that bounds one. These limits are why surface modelling is usually a stage in building a part rather than the finished result.

Most parametric modellers keep solid bodies and surface bodies in the same part file, in separate folders of the feature tree. You can build surfaces next to a solid, use a surface to cut or replace a solid face, extract faces from a solid as surfaces, and thicken or close surfaces into a new solid. The two kinds of body work together; surface modelling is not a separate program.

## Shapes that solid features handle badly

Solid features are built from sections: extrude a section, revolve it, sweep it along a path or loft between several of them. Each feature creates its side faces and its end faces together, and the end faces must close the volume. That works well for prismatic parts. It works less well when:

- **the shape is defined by its skin.** Flow passages, handles, covers and housings are specified by the surface a user touches or air passes over. The wall behind that surface is a consequence.
- **two unlike sections must blend.** Changing from a circle to a rectangle, or from one footprint to another, needs control over every intermediate section. A solid loft can do some of this, but the surface tools give more control over the edges and how they meet neighbouring faces.
- **gaps must be filled with control.** Where three or four faces leave an irregular hole, a solid feature has nothing to sketch on. A surface patch can be built from the surrounding edges with a chosen continuity.
- **imported geometry is incomplete.** A model received from another system may arrive with missing or badly joined faces. Surface tools let you delete, rebuild and re-join the faces until the body closes again.
- **a tool needs a dividing sheet.** Mould parting surfaces, shut-off surfaces and split tools are open sheets by nature.

```figure
type: decision
title: Should this feature be built from surfaces?
question: Can the shape be described as one or two sections moved along a straight line, an axis or a simple path?
caption: Surfaces earn their place where the skin carries the requirement or where faces must be built and joined one at a time.
- Yes | Use solid features | Extrude, revolve and simple sweeps are faster, more robust and easier for the next person to edit.
- *No, the skin is the requirement | Build the skin as surfaces | Model the functional surface first, then give it thickness or close it.
- No, there is a gap or a damaged face | Patch with surfaces | Delete, fill and re-join faces, then convert back to a solid.
```

Surfaces are not better than solids. A surface model has more features, more edges to join and more ways to fail, and its feature tree is harder for the next designer to read. Use surfaces where they solve a real problem, and return to solid features as soon as the difficult skin is built.

## Why every surface model ends as a solid

A part that will be made needs material. Before release, the model must give a mass for the bill of materials, sections for the drawing, a closed body for interference checks in the assembly, and a valid shape for computer-aided manufacturing or a toolmaker's mould design. Finite element analysis of a thin-walled part can use a mid-surface with a thickness property, but even then the analyst usually starts from the solid and extracts the mid-surface.

So the normal sequence is:

1. Build the surfaces that carry the requirement.
2. Trim, extend and patch them until they meet cleanly.
3. Join them into one body and check that it has no gaps.
4. Either thicken the body into a wall or, if it encloses a volume, fill that volume to make a solid.
5. Continue with solid features for the parts of the design that do not need surfaces: bosses, ribs, holes and fasteners.

The checks in between matter as much as the operations. A surface model can look complete on screen and still have a gap of a few hundredths of a millimetre that stops it closing or offsetting. Chapters 7 and 8 deal with finding those problems before they reach a supplier.

## Meet the duct

The running case is an air-inlet duct for a compressor enclosure. This is an illustration. The flow surface, the inside of the duct, is defined as follows:

- a bell-mouth at the open inlet, a quarter-round of 10 mm radius that turns the inlet edge outwards;
- a straight round section of 120 mm inside diameter, 30 mm long;
- a transition over 200 mm from that circle to a rectangle 180 mm wide and 60 mm high with 15 mm corner radii;
- an outlet centre 30 mm below the inlet centre, so that the duct passes over a frame rail;
- a flat mounting flange at the outlet, 230 mm by 110 mm;
- a flat pad on the left side wall, part-way along the transition, for a pressure switch.

The duct is injection moulded in polypropylene with a nominal wall of 2.5 mm. The inside of a round-to-rectangular transition cannot be pulled out of a one-piece mould: the rectangle is wider than the circle but the circle is taller than the rectangle, so a core withdrawn through either end would be trapped. The duct is therefore moulded as two half-shells split on its vertical plane of symmetry and joined at assembly. That decision returns in Chapter 10, where it sets the draft direction.

```figure
type: svg
title: The running case in side view
alt: Side view of the air-inlet duct flow passage. From the left, a 10 mm bell-mouth, a 30 mm straight round section of 120 mm inside diameter, then a 200 mm transition in which the top falls 60 mm while the bottom stays level, ending in a 60 mm high outlet with a flange.
caption: This is an illustration, drawn with the length at half the vertical scale. The flow surface is dimensioned; the 2.5 mm wall is added outside it in Chapter 9.
viewbox: 0 0 640 290
body:
<path class="cl" d="M30 130H620"/>
<path class="ln" d="M70 70Q50 70 50 50"/>
<path class="ln" d="M70 190Q50 190 50 210"/>
<path class="li" d="M70 70H130"/>
<path class="li" d="M70 190H130"/>
<path class="la draw" pathLength="1" d="M130 70C230 70 430 130 530 130"/>
<path class="la draw" pathLength="1" d="M130 190H530"/>
<rect class="bx" x="530" y="105" width="12" height="110"/>
<path class="lf dsh" d="M130 30V250"/>
<path class="lf dsh" d="M530 30V250"/>
<text class="txb" x="54" y="36">Inlet</text>
<text class="tx txs" x="74" y="232">Ø120 × 30</text>
<text class="txb" x="250" y="56">Transition, 200 long</text>
<text class="tx txs" x="270" y="212">bottom stays level</text>
<text class="tx txs" x="380" y="96">top falls 60</text>
<text class="txb" x="552" y="124">Flange</text>
<text class="tx txs" x="552" y="160">outlet</text>
<text class="tx txs" x="552" y="176">60 high</text>
<text class="tx txs" x="552" y="272">centre 30 lower</text>
```

## The numbers the shape must respect

A transition duct exists to carry a flow. Its most important property is the flow area at each section, because a sudden contraction or expansion costs pressure and makes noise. The designer's first task is to calculate the end areas and decide what may happen in between.

The inlet circle of 120 mm diameter has an area of π × 120² ÷ 4 = **11,309.7 mm²**. The outlet is a rounded rectangle. Its area is the full rectangle less the four corner pieces that the radii remove. Each corner removes a square of side r less a quarter circle of radius r, so the four together remove (4 − π)r². With r = 15 mm:

**180 × 60 − (4 − π) × 15² = 10,800 − 193.1 = 10,606.9 mm²**

The outlet is therefore 0.938 of the inlet area, a contraction of about 6%. At an illustrative design flow of 0.12 m³/s, the mean velocity rises from 0.12 ÷ 0.0113097 = **10.61 m/s** at the inlet to 0.12 ÷ 0.0106069 = **11.31 m/s** at the outlet. A gentle, continuous contraction like this is acceptable for the case. What the designer must avoid is a section in the middle that is much larger or smaller than either end. Chapter 4 checks that.

```figure
type: stats
title: End sections of the duct flow passage
caption: This is an illustration. The outlet is about 6% smaller in area but 20% longer in perimeter than the inlet.
- 11,309.7 mm² | Inlet area | Ø120 circle
- 10,606.9 mm² | Outlet area | 180 × 60 with R15 corners
- *0.938 | Area ratio | a gentle contraction
- 10.61 to 11.31 m/s | Mean velocity | at 0.12 m³/s
```

The perimeters tell a second story. The circle's perimeter is π × 120 = 376.99 mm. The rounded rectangle's is 2 × (180 + 60) − 8 × 15 + 2π × 15 = **454.25 mm**, about 20.5% longer. The transition must stretch its skin around the section as it flattens. That stretch is why the surface needs control along its length and not only at its ends.

## Decide which surface carries the intent

A thin-walled part has two skins, and only one of them can be modelled exactly. The other follows from the thickness. Choose the skin that carries the requirement.

For the duct, the requirement is flow area, so the inside skin is the functional surface. The model builds the flow surface to the stated dimensions and adds the 2.5 mm wall outwards. The outside dimensions are then the inside dimensions plus 2.5 mm on each side: the round section is 125 mm outside diameter and the outlet is 185 mm by 65 mm outside.

For a cover that must clear a mechanism and look right to a user, the outside skin would carry the requirement and the wall would go inwards. For a part that mates on both sides, neither skin is free, and the designer has to decide which mating surface governs and check the other as a derived result.

Write this decision down. A later designer who thickens in the other direction will change every inside dimension without any error message, because the software has no way to know which side mattered.

## A first mistake: modelling the outside

This is an illustration of a mistake that is easy to make. The designer's first attempt built the duct as a solid loft from a 125 mm circle to a 185 by 65 mm rectangle, the outside sizes taken from a supplier's sketch, and then shelled it inwards by 2.5 mm. The model rebuilt without errors and looked correct.

The problem was found when the designer measured the flow passage before writing the airflow note on the drawing. The inlet inside diameter was 120 mm, as intended, but only because the outside had been chosen to suit. When the supplier later asked for a 3 mm wall to improve filling, the designer changed the shell thickness, and the inside diameter fell to 119 mm without anyone deciding it should. Worse, the supplier's sketch showed 15 mm radii on the outside corners, so shelling had left 12.5 mm radii inside. The flow passage no longer matched the 15 mm corners used in the airflow calculation or the outlet gasket.

The correction was to rebuild the transition from the flow surface, as this book does, and to thicken outwards. The inside dimensions now stay fixed whatever wall the supplier asks for, and the outside dimensions follow. The lesson is general: build the skin that carries the requirement, and let the other one be the consequence.

## Plan the build before modelling

A surface model is a chain of dependencies. If the first curves are wrong, every surface built on them inherits the error, and correcting it late can break trims and joins downstream. A short written plan saves rework.

```figure
type: steps
title: Build plan for the duct
caption: Each stage is checked before the next starts. The chapters of this book follow the same order.
- Skeleton | Planes, section sketches and guide curves that fix the shape (Chapter 2).
- Primary surfaces | Bell-mouth and round section by revolving; flange face as a planar region (Chapters 3 and 5).
- Transition | Loft from circle to rectangle with guide curves and a controlled mid-section (Chapter 4).
- Local features | Side pad and its blend, port hole (Chapters 5 and 6).
- Join and check | Knit, find open edges, confirm continuity and section areas (Chapters 7 and 8).
- *Make it solid | Thicken outwards by 2.5 mm; check mass and wall (Chapter 9).
- Release | Split into half-shells, draft, export and hand over (Chapter 10).
```

The plan also names the checks: inlet and outlet areas, mid-section area, gap tolerance, curvature at the joins, wall thickness, draft and mass. Each check has a number to compare against, so that "it looks fine" is never the test.

## The tools, by what they do

Surface commands differ in name between systems but fall into a few families. Learning the families makes it easier to move between software and to read another designer's feature tree.

```figure
type: compare
title: Families of surface operations
cols: Typical command | Used in this book for
caption: Command names are those of one mainstream modeller. Other systems use different words for the same operation, for example sew, stitch or merge for knit.
- Create from sections | Extruded, revolved, swept, lofted and boundary surfaces | Bell-mouth, round section, transition
- Patch a boundary | Planar surface, filled surface | Flange face, side pad, blends
- Modify edges | Trim, untrim, extend | Port hole, overlaps, repairs
- Copy at a distance | Offset surface | Checking the wall, mating parts
- Join | Knit surface | Making one body from many faces
- *Make solid | Thicken, solid from enclosed volume, surface cut, replace face | The moulded duct and the fluid volume
```

Two practical points apply to every family. First, keep the number of surface bodies visible and small. Each operation can leave a new body in the tree, and a forgotten body causes confusing results later. Second, hide surfaces you have finished with rather than deleting them. Later features may reference them.

## Record the requirements beside the model

Before the first sketch, put the governing numbers where the model can use them. Most modellers let you define named global variables or a design table. For the duct, the list is short: inlet diameter 120, outlet width 180, outlet height 60, outlet corner radius 15, transition length 200, outlet drop 30, bell-mouth radius 10, wall 2.5, and the target flow of 0.12 m³/s with the end areas it implies. Each sketch dimension then refers to a name rather than a typed value.

This costs ten minutes and pays back every time a supplier or a test asks for a change. It also gives the reviewer something to check: when the model is opened six months later, the requirement and the geometry sit side by side, and a measured section can be compared with a stated target rather than with someone's memory of what was intended.

## Exercise: change the outlet corner radius

The compressor supplier proposes a gasket that needs 20 mm corner radii at the outlet instead of 15 mm. Calculate the new outlet area, the new area ratio and the mean outlet velocity at 0.12 m³/s.

**Worked answer.** The corners now remove (4 − π) × 20² = 0.8584 × 400 = 343.4 mm². The outlet area is 10,800 − 343.4 = **10,456.6 mm²**. The area ratio is 10,456.6 ÷ 11,309.7 = **0.925**, a contraction of about 7.5%. The mean outlet velocity becomes 0.12 ÷ 0.0104566 = **11.48 m/s**, up from 11.31 m/s.

The change is small, but it shows why the outlet radius belongs in the skeleton as a named dimension rather than as a fillet added at the end. If the radius drives the section sketch, the loft, the flange opening and the area check all update together. If it is a fillet added after thickening, the flow surface and the flange opening can disagree, and the area check in the drawing note quietly goes out of date.
