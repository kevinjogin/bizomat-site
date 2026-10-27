---
book: housings-that-rebuild
chapterSlug: trim-knit-and-make-it-solid
order: 5
title: "Trim, knit and make it solid"
description: "Join overbuilt surfaces into a closed skin, turn it into a solid, and use delete face, replace face and cut with surface to move between surface and solid work."
draft: false
---

Chapter 4 left the housing as a set of separate surfaces, each deliberately built larger than its final shape. This chapter turns that collection into a single solid body. It also introduces the utilities that let a model move back and forth between surface and solid work in the same part file, which is the core of the hybrid method.

The work is mostly mechanical once the surfaces are good. The failures are instructive, though. Almost every problem at this stage traces back to a gap, an overlap or a reference that was nearly right, and the fix is nearly always to correct the source rather than to loosen a tolerance.

## Overbuild, then trim

Surfaces that meet edge to edge by construction are fragile. If two surfaces are both built to end exactly on a shared curve, any small change in either can open a gap or create an overlap along that curve. Surfaces that are built to overlap generously and are then trimmed against each other are robust, because the trim always finds a clean intersection.

This is an illustration. The housing's crown is extruded 10 mm past each end of the housing and its section extends 5 mm past each side. The side walls are swept from 3 mm below the underside to 5 mm above the highest point of the crown. Wherever the surfaces cross, they do so with room to spare. When the crown later rises from 6 mm to 8 mm, the side walls still extend above it, and the trim still finds its intersection.

```figure
type: steps
title: Turning the housing's surfaces into a solid
caption: This is an illustration. Each step is checked before the next; a failure is fixed where it starts, not patched later.
- Overbuild | every surface extends past its neighbours
- Trim | crown and side walls mutually trimmed; nose patches trimmed to their neighbours
- Close | underside planar surface bounded by the bottom edge loop
- Knit | all surfaces joined; open edges reported and fixed
- *Make solid | knit closed volume into a solid body
- Check | volume, open edges, offset test of the whole body
```

## Choose the trim that matches the job

Most systems offer two kinds of trim. A **standard trim** uses one surface, plane or sketch as a cutting tool and removes part of another surface. A **mutual trim** takes several surfaces, finds all their intersections at once and lets you choose which regions to keep. Mutual trim is the natural choice when several surfaces enclose a region, because it handles every intersection in one feature.

For the housing, a mutual trim between the crown and the swept side walls keeps the crown's inner region and the side walls below the crown. It produces one trimmed body with a clean edge along the full crown-to-side intersection. The nose patches are then trimmed to that body, and the underside planar surface is created from the bottom edge loop of the side walls.

Two practical points help. Select the regions to keep rather than the regions to remove where the system allows both, because keep selections tend to survive topology changes better when the model is edited. And name the trim feature after what it keeps, such as `Trim, keep crown and sides`, so its purpose survives in the tree.

## Extend and untrim

Sometimes a surface turns out to be too small after all. An **extend** feature lengthens a surface beyond one or more of its edges. The extension can continue the surface's existing shape, or it can run in a straight line tangent to the edge. Continuing the shape keeps curvature consistent but can wander if the surface curves strongly; a linear extension is predictable but introduces a curvature change at the original edge.

**Untrim** does the opposite of trim. It recovers the original, untrimmed extent of a surface, or fills internal holes cut into it. It is useful when a trim has removed the wrong region or when a later change needs the surface's full extent again. Both tools are repairs. A model that needs many extends and untrims usually needs its surfaces rebuilt larger from the start.

## Knit with a reason for the tolerance

A **knit** joins separate surfaces that share edges into one surface body. If the joined surfaces enclose a volume completely, most systems can turn the result into a solid in the same step, an option often labelled along the lines of "create solid" or "try to form solid".

Knitting depends on a gap tolerance. Edges closer together than the tolerance are joined; edges further apart remain open. It is tempting to raise the tolerance until a stubborn knit succeeds. That is almost always a mistake. A large tolerance stitches surfaces that do not truly meet, creating a body whose edges are approximations. Fillets, shells and exports may then fail unpredictably later.

This is an illustration. The first knit of the housing's skin reported two open edges, one at each nose corner. Measuring showed a gap of 0.03 mm between each nose patch and the side wall. The knit tolerance in the model was 0.01 mm. Raising the tolerance to 0.05 mm would have closed the knit. Instead, the designer traced the gap to its source: the nose patch's boundary had been built on a sketch curve that approximated the side wall edge, not on the edge itself. Re-referencing the patch boundary to the actual trimmed edge of the side wall closed the gap to zero, and the knit succeeded at the original tolerance.

```figure
type: compare
title: Two responses to the 0.03 mm gap at the nose
cols: Knit result | Later consequence
caption: This is an illustration. The quick fix hid the problem; the real fix removed it.
- Raise knit tolerance to 0.05 mm | Closed, solid formed | Fillet across the nose edge failed two features later
- *Re-reference the patch to the true edge | Closed at 0.01 mm, solid formed | Fillets and shell solved
```

The rule is to treat a knit tolerance as a statement about precision, not as a dial to turn until the error goes away. Keep it small, and when a knit fails, find out why.

## Check the solid before going further

A knit that forms a solid is a milestone, but it needs checking before any solid feature is added.

```figure
type: checklist
title: Checks on the new master solid
caption: This is an illustration. The hand estimate is rough; its job is to catch a body that is wildly wrong, not to confirm the CAD value precisely.
- x Body type | one solid body, no separate surface bodies left over
- x Open edges | none reported by the geometry check
- x Volume | CAD reports 341.8 cm³; hand estimate about 345 cm³
- x Offset test | whole body offsets inwards by 2.0 mm without error
- *x Brief checks | envelope, symmetry, crown rise and parting height as in Chapter 1
```

The hand estimate deserves a word. The housing's plan area, with two R10 rear corners and the 16 mm by 44 mm nose taper on each side, is about 10,773 mm². Multiplying by the 28 mm height at the side walls gives about 301.6 cm³. The crown adds a circular segment of about 290 mm² across the width, carried along the length and reduced in proportion to the narrower plan at the nose, which adds about 43.3 cm³. The total is about **345 cm³**, within 1% of the CAD value. The estimate ignores the G2 corner shapes, the nose patches and the draft, so a 1% difference is reassuring. A 20% difference would mean a surface had been trimmed the wrong way or a region was missing.

Record the volume with the model. It becomes a baseline for every later change: when the crown, length or draft is edited, a hand-predicted change in volume can be compared with the reported one, and a surprise means a surface has moved somewhere unexpected. Volume is a blunt measure, but it is quick, objective and hard to argue with.

The geometry check, often called a check or diagnosis tool, deserves equal attention. It reports invalid faces, open edges, short edges and minimum radii. Run it after the knit and save the result, so you can compare later checks against a known good state.

## Move between solid and surface on purpose

The hybrid method depends on being able to move between solid and surface work. Four tools make that possible.

```figure
type: compare
title: Tools that move between surfaces and solids
cols: What it does | Typical housing use
caption: Each tool changes faces without rebuilding the whole body. Each still needs a reference that will survive later changes.
- Delete face | Removes faces from a solid, leaving a surface body or patching the hole | Removing a failed blend to rebuild it with surfaces
- Replace face | Swaps one or more solid faces for a new surface, extending or trimming to fit | Changing the crown shape without rebuilding the sides
- Cut with surface | Removes material from a solid on one side of a surface | Trimming a block to a styled top surface
- *Thicken | Turns a surface into a solid of set thickness, or fills an enclosed volume | Making a lens or a uniform-wall body from a skin
```

**Delete face** removes selected faces from a solid. Depending on the option chosen, it can leave an open surface body, or heal the gap by extending the neighbouring faces, or patch it with a fill. It is the first step of a common repair: delete a problem region, build a better surface in its place, then knit and make solid again.

**Replace face** swaps one or more faces of a solid for a new surface. The new surface does not have to match the old faces' boundaries exactly; it can be larger, and the system extends or trims the neighbouring faces to meet it. This makes replace face a powerful way to restyle part of a solid. To change the crown shape late in the project, build a new crown surface and replace the old crown faces with it. The side walls, fillets and shell that follow update to the new shape without being rebuilt.

**Cut with surface** removes material from one side of a surface. It suits the solid-first approach, such as cutting the top of an extruded block with a styled crown surface. It is the place where over-building matters most. A cutting surface that only just reaches the edge of the solid can leave slivers or fail. Extend it at least a few millimetres past the solid on every side.

**Thicken** creates a solid from a surface, either by adding a set thickness to one or both sides of an open surface or by filling the volume enclosed by a closed set of knitted surfaces. Thickening a single surface is a clean way to make a part that is really a skin, such as a display lens that follows the crown. Thickening an open skin inwards is an alternative to shelling a solid, and Chapter 6 compares the two.

## Build a matching part from the same surface

Surfaces kept as references pay off when a second part must follow the housing's shape. The display lens is the clearest example on this housing. It sits in a shallow pocket around the window and must follow the crown so that it looks like part of the same surface.

This is an illustration. The window opening is 50 mm by 30 mm. Around it, the cover has a pocket 1.0 mm deep and 52 mm by 32 mm, leaving a 1.0 mm ledge on each side for the lens to sit on and for adhesive tape. The lens is designed 51.8 mm by 31.8 mm, giving **(52 − 51.8) ÷ 2 = 0.1 mm** of clearance on each side.

The lens is built from the crown surface, not from the cover's solid faces. An offset surface 1.0 mm below the crown gives the pocket floor; the same crown surface, trimmed to the 51.8 mm by 31.8 mm outline, is thickened inwards by 1.0 mm to make the lens. Both the pocket floor and the lens therefore follow the crown exactly, at any crown rise. When the crown later changes from a 6 mm to an 8 mm rise, the pocket and lens update together, and the 0.1 mm clearance and flush top surface hold without any edits.

If the lens had been built by sketching on a plane and extruding, it would have been flat while the crown is curved. Across a 32 mm width with a crown radius of 111 mm, a flat lens would sit about **111 − √(111² − 16²) ≈ 1.16 mm** proud of the crown at its edges relative to its centre, which is more than the lens thickness itself. The surface-based method avoids the problem entirely.

## Keep surface bodies tidy

Hybrid models accumulate surface bodies: reference surfaces, construction surfaces, abandoned attempts and the leftovers of trims. Each one adds clutter, slows rebuilds and confuses the next person.

Hide surfaces that remain as references, and put them in a clearly named folder. Delete surfaces that no longer serve any feature, after checking that nothing references them. Most systems can show what depends on a feature before you delete it. At the end of this stage the housing model should contain one solid body and a short, named list of reference surfaces kept for later edits.

The edited READOS chapter on [editing solid faces with clear design checks](/reados/collections/cad-modelling-and-design-intent/editing-solid-faces-with-clear-design-checks/) covers the checks that should follow any direct change to solid faces, including those made with delete and replace face.

## Exercise: restyle the crown late in the project

Two weeks before tooling, the industrial designer asks for the crown to rise 8 mm instead of 6 mm. The model already has fillets, a window cut and a shell. Describe two ways to make the change, and say which you would choose and why.

**Worked answer.** The first way is to change the **crown rise parameter** from 6 mm to 8 mm. The crown section sketch updates to an 85 mm radius, as calculated in Chapter 2, the extruded crown surface follows, and the trims, knit, solid and later features rebuild. This is the preferred route if the model has been built as described, because the crown is driven by the skeleton.

The second way is to build a new crown surface and use **replace face** on the existing solid. This suits a model whose crown is not parameter-driven, or a change that cannot be expressed as a new rise value, such as a crown with a different shape in the middle.

Choose the parameter route where it exists. Then rerun the checks, and think about what the volume should do before reading it. The overall height stays at 34 mm, so a taller crown means lower side walls: 26 mm instead of 28 mm. The crown segment grows from about 290 mm² to about 388 mm², but the lost wall height removes more than the crown adds, so the hand estimate falls from about 345 cm³ to about **338 cm³**. If the CAD volume rises instead, the envelope has grown and statement 1 of the brief has been broken. The offset test, the minimum-radius readout and the brief checks must all pass before the change is accepted.
