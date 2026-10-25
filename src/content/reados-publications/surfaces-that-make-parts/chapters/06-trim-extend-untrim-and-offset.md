---
book: surfaces-that-make-parts
chapterSlug: trim-extend-untrim-and-offset
order: 6
title: "Trim, extend, untrim and offset"
description: "Cut surfaces back with trims, lengthen them with extensions, restore them with untrim, copy them at a distance, and predict from curvature where an offset will fail."
draft: false
---

Surfaces are rarely built to their final edges. The usual method is to build them a little too large, let them cross, and cut them back where they meet. That needs trim tools. Sometimes a surface is too short to reach its neighbour and has to be extended first. Sometimes a trim was a mistake and the original edge has to be recovered. And sometimes a whole surface has to be copied at a distance, to check a wall or to build a mating part.

This chapter covers those four operations on the duct: trim, extend, untrim and offset. The last one carries a rule worth learning by heart, because it explains most failures to thicken a surface into a solid. The rule predicts that a small, sensible-looking round at the duct's outlet will make the whole part fail to thicken, and it gives the radius that fixes it.

## Trim with a tool

A trim removes part of a surface along a boundary defined by a trim tool. The tool can be another surface, a plane, or a sketch projected onto the surface. After choosing the tool, you choose the pieces to keep, or the pieces to remove, and the software discards the rest.

On the duct, two trims use tools prepared earlier:

- **The port hole.** The extruded 12 mm cylinder from Chapter 3 passes through the pad seat. Used as a trim tool, it cuts a circular hole in the pad. The piece to keep is the pad outside the circle.
- **The opening for the pad's skirt.** The 56 by 46 mm loop projected onto the side wall in Chapter 5 trims the wall. The piece to keep is the wall outside the loop.

Choosing pieces is where trims go wrong. When the tool divides a surface into several regions, each must be selected deliberately. If the software keeps "everything except" a selected piece, a small sliver created by an unexpected intersection may survive and later stop the knit. After every trim, count the faces in the surface body and compare with what you expect: the pad seat should have one face with one inner loop, not two faces.

## Mutual trim

A mutual trim uses two or more surfaces as tools on each other. Each surface is cut where it crosses the others, and you choose which pieces of each to keep. It is the natural way to finish two surfaces that have been built long and allowed to cross.

The duct's flange face was built directly from the loft's edge in Chapter 5, so it needs no trim. But a common alternative shows when mutual trim is the better choice. Suppose the loft ended 5 mm short of the flange plane, at a location set by some other requirement, and the flange face were a large plane sheet. The designer would extend the loft through the plane, then mutually trim: keep the duct on the inlet side of the plane, and keep the plane outside the duct and inside the flange outline. The two trimmed surfaces then share an exact boundary, which is the condition for a clean knit.

The general principle is "build long, trim back". Surfaces that meet exactly by construction are fragile: a small change makes them fall short and leave a gap. Surfaces that overlap and are trimmed to each other always meet, because the trim creates their shared edge.

## Extend a surface

An extension lengthens a surface beyond one of its edges, by a distance, up to a point or up to another surface. There are two kinds:

- **Same surface.** The extension continues the surface's own mathematical shape. A curved surface keeps curving. This is right when the surface's curvature is meaningful, as in a styled cover.
- **Linear.** The extension leaves the edge in a straight line, tangent to the surface. This is right when the surface should run straight on, or when continuing the curvature would turn it back on itself.

For the duct's loft, the end condition at the outlet is normal to the section, so the surface already arrives straight. A linear extension of 5 mm continues it without change. A same-surface extension would do almost the same there, but near the inlet end, where the guides are curving, it would bend the extension upwards along the top guide's curvature. For a trimming overlap, linear is the safer choice.

Two cautions. Extending changes the surface's edge, so any feature that referenced the old edge may need updating. And some systems will not extend an edge that is already joined to another surface; extend first, then trim and knit.

## Untrim: recover what was cut away

Most surface types keep their full underlying shape even after they have been trimmed. The trim records which part of that shape is in use. An untrim command uses this to restore part or all of the original boundary. Typical options restore only the inner edges (filling holes), only the outer edges, or all of them, and some let you choose an edge and either extend it or connect its end points.

This is the better repair for the old top port from Chapter 5. The 12 mm hole was cut into the loft by a trim, so the loft's full surface still exists underneath. An untrim of the hole's inner edge restores the original face exactly: the same shape, the same curvature, with no patch and no new edges. The deviation is zero by construction, which neither the planar patch nor the tangent fill could achieve.

```figure
type: compare
title: Three ways to close the old 12 mm port in the top
cols: Departure from original | Edges added | When to use
caption: This is an illustration. Untrim is exact when the surface was trimmed; the patches are for holes with no surface underneath.
- Planar patch | up to 0.039 mm, with a crease | one loop | Only where the surface really is flat
- Tangent fill | small; measure it | one loop | Holes in imported or damaged geometry
- *Untrim inner edge | zero | none | Holes made by trimming a surface you still own
```

Untrim does not help with imported geometry, where the underlying surface may already have been cut to its trimmed boundary, or where the hole was in the original design. Then a fill is the tool.

## Offset surfaces

An offset surface is a copy of a surface moved a fixed distance along its normal at every point. A plane offsets to a parallel plane; a cylinder of radius R offsets outward to radius R + d or inward to R − d; a free-form surface offsets to a new free-form surface. An offset of zero copies the surface exactly, which is a convenient way to extract faces from a solid or another surface body without changing them.

The duct uses offsets for three jobs:

1. **Checking the wall.** An offset of 2.5 mm outward from the flow surface shows where the outside of the moulding will be before the part is thickened. A minimum-distance measurement from that offset to the frame-rail sheet from Chapter 3 confirms the 7.5 mm clearance.
2. **A mating part.** A steel bracket supports the duct under the transition. Its saddle must follow the duct's outside with a 0.5 mm gap. An offset of 2.5 + 0.5 = **3.0 mm** from the flow surface gives the saddle's shape, which Chapter 9 uses to cut the bracket.
3. **Predicting the thicken.** A thicken is an offset plus the faces that close the edges. If the offset fails, the thicken fails. Testing the offset first isolates the problem.

## Why offsets fail

Offset a curve towards the centre of one of its arcs, and the arc's radius shrinks by the offset distance. When the distance equals the radius, the arc shrinks to a point; beyond that, the offset curve loops back and crosses itself. The same happens on surfaces. The survey of offset curves and surfaces listed in this book's references sets out the general condition. For practical modelling, it reduces to one rule:

**A surface can be offset by a distance d only where its radius of curvature on the side towards which it moves is greater than d.**

On the side away from the centre of curvature, the radius grows and there is no limit. So the check is to find every curved region of the surface, note which side its centre of curvature is on, and compare the radius with the offset distance wherever the offset moves towards the centre.

For the duct, the offset is 2.5 mm outward from the flow surface, into the wall.

```figure
type: compare
title: Radii on the flow surface and the 2.5 mm outward offset
cols: Flow-surface radius | Centre of curvature | Offset radius | Result
caption: This is an illustration. Only the 2 mm round at the outlet lip moves towards its centre by more than its radius.
- Round section | 60 mm | flow side | 62.5 mm | grows, safe
- Outlet corners | 15 mm | flow side | 17.5 mm | grows, safe
- Bell-mouth lip | 10 mm | wall side | 7.5 mm | shrinks, safe
- *Outlet lip round, first version | 2 mm | wall side | −0.5 mm | fails
- Outlet lip round, corrected | 5 mm | wall side | 2.5 mm | shrinks, safe
```

## The lip round that would not thicken

This is an illustration of the failure. Where the duct meets the flange, the flow surface turns through 90°: the inside of the duct wall meets the flange face at the edge of the opening. Looking at the material, that edge is an outside corner of an L-shaped section, with the duct wall as one leg and the flange as the other. The designer rounded it with a 2 mm surface fillet, to remove a sharp edge from the airflow and from the gasket.

The fillet's centre of curvature lies in the material, so the outward offset moves towards it. A 2 mm radius offset by 2.5 mm would become −0.5 mm. The offset failed, and so did the trial thicken, with a message that the operation would create a self-intersecting surface. The software did not say where.

The rule found the place in a minute: a list of every radius on the flow surface, with the side of its centre, showed only one radius smaller than 2.5 mm on the wall side. The fix followed from the same rule. With a 5 mm round on the flow side, the inside corner of the L on the back of the flange becomes 5 − 2.5 = **2.5 mm**, a radius equal to the wall thickness. That is a sensible bend for a moulded wall: the material turns the corner with uniform thickness, and the inside corner is not sharp. A sharp inside corner in a moulding concentrates stress and disturbs filling, so the corrected round improves the part as well as letting it thicken.

```figure
type: svg
title: The outlet lip in section, before and after
alt: Two L-shaped wall sections where the duct wall meets the flange. On the left, a 2 mm round on the flow-side corner is offset 2.5 mm into the wall and its offset arc crosses itself. On the right, a 5 mm round offsets to a 2.5 mm inside radius and the wall turns the corner with uniform thickness.
caption: This is an illustration. The flow-side radius must exceed the wall thickness for the offset to exist; here 5 mm leaves a 2.5 mm inside radius.
viewbox: 0 0 640 290
body:
<path class="ln" d="M40 230H200Q220 230 220 210V60"/>
<path class="la" d="M40 205H192"/>
<path class="la" d="M195 208V60"/>
<path class="la" d="M188 214L200 200"/>
<path class="la" d="M200 214L188 200"/>
<text class="txb" x="40" y="40">R2 lip: offset fails</text>
<text class="tx txs" x="40" y="258">flow surface</text>
<text class="tx txs" x="230" y="150">flange face</text>
<text class="txa" x="96" y="190">−0.5 mm</text>
<path class="ln" d="M360 230H520Q550 230 550 200V60"/>
<path class="la" d="M360 205H520Q525 205 525 200V60"/>
<text class="txb" x="360" y="40">R5 lip: offset R2.5</text>
<text class="tx txs" x="360" y="258">flow surface</text>
<text class="tx txs" x="560" y="150">flange face</text>
<text class="txa" x="366" y="186">wall 2.5, inside R2.5</text>
```

Two general lessons come from this. First, a thicken failure is almost always an offset failure in one small region, and the curvature rule finds it faster than trial and error. Second, the right radius on the functional surface is usually wall thickness plus the inside radius you want, so the outside and inside of a bend are designed together.

## Finding the smallest radius in practice

A table of designed radii covers the features you created deliberately. It does not cover radii the software created for you: the corners of a loft between sections, the edges of a fill, the inside of a blend. Those need measuring.

Most modellers offer two displays for this. A curvature map colours the surface by curvature, usually with a scale you can set; setting the top of the scale to 1 ÷ 2.5 = 0.4 per mm makes any region tighter than the wall thickness stand out at once. Curvature combs, drawn on section curves cut through the surface, show the curvature at each point as a line whose length is proportional to it, so a sudden spike marks a tight spot.

The designer's routine on the duct was:

1. Display the curvature map on the whole flow surface with the scale capped at 0.4 per mm.
2. Inspect every region at or near the cap, and for each one decide which side its centre of curvature is on.
3. Cut a section through any doubtful region and read the minimum radius from the comb or a radius measurement.
4. Record the minimum wall-side radius beside the wall thickness in the design notes.

On the first pass this routine showed only the 2 mm outlet lip. After the correction, the smallest wall-side radius was the corrected lip's 5 mm, double the wall thickness. The note in the model now reads "smallest wall-side radius 5 mm; maximum outward offset 5 mm less a margin". Anyone who later changes the wall has the limit in front of them.

## Exercise: a thicker wall

The moulder asks whether the wall could be 3 mm instead of 2.5 mm. Using the table of radii, say which features of the flow surface would offset safely by 3 mm outward and which would not, and what the inside radius at the outlet lip would become.

**Worked answer.** Radii whose centres are on the flow side grow and are always safe: the round section becomes 63 mm and the outlet corners 18 mm. Radii whose centres are on the wall side shrink by 3 mm. The bell-mouth goes from 10 to **7 mm**, still safe. The corrected 5 mm outlet lip goes to **2 mm**, which exists, but the inside radius is now smaller than the wall, a sharper inside corner than before. The original 2 mm lip would have failed even more clearly, at −1 mm.

Any blend whose radius is not in the table, such as the curved parts of the pad's skirt from Chapter 5, must be checked too: measure its smallest radius on the wall side with a curvature display and compare it with 3 mm. If the moulder's request is accepted, the designer should also consider raising the outlet lip to 5.5 mm, keeping the inside radius at 2.5 mm, and then repeat the flange gasket and area checks that depend on that edge.
