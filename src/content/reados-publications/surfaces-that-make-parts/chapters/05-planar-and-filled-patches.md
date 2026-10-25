---
book: surfaces-that-make-parts
chapterSlug: planar-and-filled-patches
order: 5
title: "Planar and filled patches"
description: "Close boundaries with planar regions and N-sided filled surfaces, choose contact, tangent or curvature conditions at each edge, and measure how far a patch departs from intent."
draft: false
---

Not every surface is made by moving a profile. Many are made by filling a boundary that already exists: the flat face of a flange around an opening, a cap across the end of a tube, a patch over a hole left by a deleted feature. The two tools for this are the planar surface, which fills a flat boundary, and the filled surface, which fills a boundary of any shape and lets you control how the patch meets each edge.

This chapter uses both on the duct. It builds the flange face as a planar region, shows what goes wrong when a planar patch is used on a curved surface, fills a hole with a tangent patch instead, and builds the flat pad for the pressure switch. Each patch is checked with a number: an area, a deviation or a gap.

## Planar surfaces

A planar surface fills one or more closed loops that lie in a single plane. The outer loop sets the boundary; any loops inside it become holes. The loops can be sketch entities, model edges or a mixture, as long as they are coplanar and closed.

The duct's flange face is a planar surface on the outlet plane at x = 240. Its outer loop is the 230 by 110 mm flange outline from the skeleton. Its inner loop is the outlet edge of the transition loft: the 180 by 60 mm rounded rectangle where the loft ends. The result is a flat rectangular frame with the duct opening in it.

Use the loft's edge for the inner loop, not a new sketch of the same rectangle. A separate sketch would be geometrically the same today, but it would be a second definition of the opening. If the outlet corner radius changes and only the loft updates, the flange face and the duct no longer meet. Built from the loft's edge, the flange face follows the duct automatically, and the two surfaces share an exact boundary that will knit cleanly in Chapter 7.

The check is the area. The frame should measure 230 × 110 − 10,606.9 = **14,693.1 mm²**. If the CAD area differs, either the outline or the opening is not what the skeleton says.

## When a boundary is not flat

A planar surface needs a planar boundary. Most modellers refuse a loop that is visibly out of plane. Some accept a loop that is very nearly planar, within their internal tolerance, and build a flat patch across it. That second case is the dangerous one, because the result looks right.

This is an illustration from the case. An early layout placed the pressure-switch port on the top of the duct at x = 110 mm, where s = 0.35. When the port moved to the side wall, the designer had to close the 12 mm hole the trim had left in the top. The hole's edge lay on a surface curving gently along the duct, so it was almost, but not quite, flat. The planar surface command accepted it.

The patch was flat; the surface around it was not. Along the duct at that point, the top guide has a slope of 0.4095 (22.3°) and a second derivative of 60 × (6 − 12 × 0.35) ÷ 200² = 0.0027 per mm. The curvature of a curve whose slope is not zero is the second derivative divided by (1 + slope²)^1.5:

**κ = 0.0027 ÷ (1 + 0.4095²)^1.5 = 0.0027 ÷ 1.2618 = 0.00214 per mm**

That is a radius of about **467 mm**. Across a 12 mm hole, the true surface sags away from a flat chord by R − √(R² − 6²), which is **0.039 mm**. The planar patch sat up to 0.039 mm away from where the original surface would be, and it met the surrounding surface with a slight crease rather than tangentially.

```figure
type: formula
title: How far a flat patch departs from a curved surface
formula: sag = R − √(R² − a²) ≈ a² ÷ (2R)
caption: This is an illustration. Small, but visible as a facet in reflections and enough to spoil a smooth inside surface.
- R | local radius of curvature of the surface, mm
- a | half the width of the patch, mm
step: At s = 0.35, the top guide has slope 0.4095 and second derivative 0.0027 per mm
step: κ = 0.0027 ÷ 1.2618 = 0.00214 per mm, so R ≈ 467 mm
step: For a 12 mm hole, a = 6 mm: sag = 467.3 − √(467.3² − 36) = 0.039 mm
```

Nobody would see 0.039 mm on a dimensional check. The designer found the problem with a zebra-stripe display, described in Chapter 8: the stripes jumped at the patch edge. On an inside surface of a duct, the crease would cause no real harm. On a visible cover or a sealing face, the same mistake would show as a flat spot or a leak path. The correction, below, was to use a filled surface with a tangent condition, and in Chapter 6 an even better one.

## Filled surfaces

A filled surface, sometimes called an N-sided patch, fills a closed boundary of any shape: sketch curves, 3D curves, model edges or a mixture. It can have three, four, five or more sides. Optional constraint curves inside the boundary pull the patch through additional shapes.

The important choice is the condition at each boundary edge:

```figure
type: compare
title: Edge conditions for a filled surface
cols: What matches across the edge | Use it for
caption: The condition can usually be set edge by edge. Tangent and curvature conditions need a neighbouring face to match, not just an edge.
- Contact | Position only (G0) | Edges that will be trimmed or filleted later; boundaries with no neighbouring face
- *Tangent | Position and direction (G1) | Patches inside a smooth surface; most repairs
- Curvature | Position, direction and curvature (G2) | Visible styled surfaces; reflective finishes
```

A contact condition makes the patch meet the edge and nothing more. If the neighbouring face is curved, the patch meets it at an angle and leaves a crease, which is what the planar patch did. A tangent condition makes the patch leave the edge in the same direction as the neighbouring face, so there is no crease. A curvature condition goes further and matches how fast the surface is bending, so reflections run smoothly across the join.

Most modellers also have an option to optimise the patch, which makes the simplest surface that satisfies the conditions and usually rebuilds faster. Turning it off may expose a resolution setting: higher resolution follows complex boundaries more faithfully at the cost of more data and slower rebuilds. Start with the simplest patch and increase the resolution only if the deviation check demands it.

For the old top port, the designer replaced the planar patch with a filled surface bounded by the hole edge, with a tangent condition. The zebra stripes now ran smoothly across the patch. Because the patch leaves every edge in the surface's own direction, its departure from the original shape is expected to be a small fraction of the planar patch's 0.039 mm; a deviation check between the patch and the surface around it confirms the actual figure rather than assuming it. For a 12 mm hole in a gently curved surface, a tangent fill is very close to the original shape. For a larger hole, or a surface that changes curvature quickly across it, the difference grows, and the patch should be checked again.

## Build the pad for the pressure switch

The pressure switch needs a flat seat 40 mm long and 30 mm high on the left side wall, centred between x = 90 and x = 130 mm, with its 12 mm port through the middle. The side wall there is not flat: it curves outwards along the duct, and it curves around the section as well, because the section is still close to round at that point. A pad sketched on a plane parallel to the axis would meet the wall at different heights all round.

The pad's plane comes from the side guide. At x = 90 (s = 0.25), the guide is at y = −(60 + 30 × 0.15625) = **−64.69 mm**. At x = 130 (s = 0.45), it is at y = −(60 + 30 × 0.42525) = **−72.76 mm**. The chord between these points runs outwards 8.07 mm over 40 mm, an angle of **11.4°** to the axis. Halfway, at x = 110, the guide is at −68.45 mm, which is 0.27 mm inside the chord, because the guide is still curving outwards there.

The designer placed the pad's plane parallel to that chord and 3 mm outside it. The flat seat therefore stands 3.0 mm proud of the wall at its ends and 3.27 mm proud at its middle, measured along the side guide. The switch's seal sees a true flat surface square to the port axis, and the port's direction is set by a plane that anyone can reproduce from two guide values.

```figure
type: svg
title: Placing the pad on the side wall, plan view
alt: Plan view of the left side wall between x 90 and x 130 mm. The side guide curves outwards from y minus 64.69 to minus 72.76 mm. A dashed chord joins those points at 11.4 degrees to the axis. The pad plane is drawn parallel to the chord, 3 mm further out. The guide sits 0.27 mm inside the chord at x 110.
caption: This is an illustration, exaggerated across the wall for clarity. The pad plane is set from two guide values, not by eye.
viewbox: 0 0 640 300
body:
<path class="cl" d="M40 60H600"/>
<path class="la draw" pathLength="1" d="M120 120C240 140 360 168 480 202"/>
<path class="lf dsh" d="M120 120L480 202"/>
<path class="li" d="M106 168L466 250"/>
<circle class="fa" cx="120" cy="120" r="5"/>
<circle class="fa" cx="480" cy="202" r="5"/>
<text class="tx txs" x="48" y="50">duct axis</text>
<text class="txb" x="60" y="112">x 90, y −64.69</text>
<text class="txb" x="430" y="186">x 130, y −72.76</text>
<text class="tx txs" x="292" y="150">side guide</text>
<text class="tx txs" x="260" y="198">chord, 11.4° to axis</text>
<text class="txa" x="230" y="246">pad plane, 3 mm outside the chord</text>
```

The pad itself is a planar surface: a 40 by 30 mm rectangle with 5 mm corner radii, sketched on that plane and centred on the chord's midpoint. Between the pad and the wall there is a gap of about 3 mm that varies around the pad's outline. Closing it is a blending job.

## Blend the pad into the wall

The gap between the pad and the wall is a ring with two closed boundaries: the pad's outline and a loop on the wall. A filled surface fills one loop, so this ring needs a different approach. The designer used a loft between the two loops:

1. Project a rounded rectangle 8 mm larger all round than the pad, 56 by 46 mm, onto the side wall along the pad's normal.
2. Trim the wall inside that projected loop, leaving a hole slightly larger than the pad.
3. Loft from the trimmed hole edge to the pad's outline, with the start tangent to the wall and the end tangent to the pad's plane.
4. Check the connectors, as in Chapter 4, so that corners correspond.

The result is a smooth skirt that leaves the wall tangentially and arrives flat on the pad. An alternative is four filled surfaces, one on each side, with curvature conditions at their shared edges, but that creates more edges for later operations to deal with. One loft is simpler.

Check two things before moving on. First, the flat area of the pad must still be at least 40 by 30 mm; a tangent end condition can encroach on the pad if the skirt is too short. Second, the pad must sit inside the left half-shell. It faces the −y direction, square to the half-shells' pull direction in Chapter 10, so it can be moulded without a side action. The earlier top position would have put the port across the joint between the two halves, which was the original reason for moving it.

## Caps that exist only for checking

Planar surfaces have one more use on the duct: temporary caps that close the flow passage so it can be measured as a volume. The fluid model in Chapter 9 needs a closed body bounded by the flow surface and two flat ends.

The inlet cap sits on the inlet plane at x = 0 and is bounded by the bell-mouth's outer lip, a circle of 70 mm radius. Its area is π × 70² = **15,393.8 mm²**. The outlet cap is bounded by the loft's outlet edge, so its area should equal the outlet flow area, **10,606.9 mm²**. That gives a useful cross-check: if the outlet cap does not measure 10,606.9 mm², the loft's outlet edge does not match the section sketch, and something upstream has changed.

Build the caps as separate surface bodies, name them "Check cap, inlet" and "Check cap, outlet", and keep them out of the product. They belong to the fluid volume and to the measurement routine, not to the moulded duct. A cap accidentally knitted into the duct's surface body would turn the thickened part into a solid lump with no passage through it. Chapter 7 shows how a body count catches that mistake before it reaches the thicken.

## Patches and the feature tree

Patches depend on the edges they fill. That makes them sensitive to changes upstream: if the loft's outlet edge is split differently after an edit, the flange face may lose its inner loop; if the side wall moves, the projected loop for the pad's skirt moves with it and the trim may fail. Three habits reduce the risk:

- Build patches from skeleton curves where the boundary is defined by the requirement, as with the flange outline, and from model edges only where the boundary is genuinely another surface's edge, as with the opening.
- Rebuild after every upstream change and check that each patch still has the expected number of loops and the expected area.
- Name patches for what they close ("Flange face", "Pad seat", "Pad skirt"), so that a failed rebuild message points to something recognisable.

## Exercise: a larger port hole

Suppose the old top port had been 20 mm in diameter instead of 12 mm, at the same position. Calculate how far a planar patch would depart from the curved surface, and say whether the conclusion changes.

**Worked answer.** The local radius is unchanged at about 467.3 mm. With a = 10 mm, the sag is 467.3 − √(467.3² − 10²) = **0.107 mm**, nearly three times the 12 mm case, because the sag grows with the square of the patch width. The approximation a² ÷ (2R) = 100 ÷ 934.7 = 0.107 mm agrees.

The conclusion is the same, only stronger. A planar patch on a curved surface always creates a facet, and its error grows quickly with size. A tangent fill should be used, and for a patch this large its deviation should be measured rather than assumed small. Where the original surface still exists in the model, the better repair is to restore it exactly, which is what the untrim tool in Chapter 6 does.
