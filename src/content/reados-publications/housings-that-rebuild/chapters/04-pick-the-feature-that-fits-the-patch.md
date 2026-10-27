---
book: housings-that-rebuild
chapterSlug: pick-the-feature-that-fits-the-patch
order: 4
title: "Pick the feature that fits the patch"
description: "Choose between extrude, sweep, loft, boundary and fill surfaces for each region of a housing, and avoid the three-sided patches that later refuse to offset or shell."
draft: false
---

A housing's outer skin is a patchwork. Each patch is a region bounded by edges, and each can be built by several different features. The choice matters more than it first appears. Two patches can look identical in a shaded view while one offsets, shells and fillets cleanly and the other fails at the first downstream operation.

This chapter maps the housing's skin into patches, matches each to a feature, and then deals with the hardest region: the sensor nose, where the crown, the side walls and the front face converge. The nose is where most housing models first fail, and the reason is usually topology rather than shape.

## Map the skin into patches

Before building anything, sketch the skin as a set of regions on paper or as a quick layout. Each region should be one surface with a clear set of boundary edges. Count the edges of each region, note which neighbours each edge touches, and note the continuity required at each edge from the decisions in Chapter 3.

This is an illustration. The housing's outer skin divides into five main regions:

```figure
type: compare
title: Patch map for the housing's outer skin
cols: Boundary edges | Continuity to neighbours | Candidate feature
caption: This is an illustration. Most regions have an obvious feature; the nose corners do not, because they are three-sided.
- Crown | 4 | G1 to sides via fillet later | Extrude or sweep of the crown section
- Side walls and corners | 2 (closed loop) | G2 within, drafted | Sweep or drafted extrude of the plan outline
- Underside | 1 (closed loop) | G0, it is the open base | Planar surface
- Nose front face | 4 | G1 to sides and crown | Boundary or loft
- *Nose corners, left and right | 3 | G1 to three neighbours | Problem: needs a decision
```

The count of boundary edges is the most important column. Most surface features are fundamentally four-sided: they map a rectangle of parameter space onto the surface. Extrudes, sweeps, lofts and boundary surfaces all work naturally with four edges, or with two opposite pairs. A region with three edges, or five, needs either a feature designed for arbitrary boundaries or a change to the patch layout.

## Match the feature to the region

Each surface feature has a natural shape. Using it for that shape gives clean, light surfaces. Forcing it to make another shape gives heavy surfaces with internal distortion.

```figure
type: decision
title: Choosing a surface feature for a region
question: How is the region's shape best described?
caption: Choose the simplest feature that describes the region. A more general feature is not more accurate; it only has more freedom to go wrong.
- One profile moved straight | crown section along the length; underside | extrude
- One profile moved along a path | side walls along the plan outline, with draft | sweep
- Several sections that change shape | rear section to nose section | loft, optionally with guide curves
- A network of curves in two directions | nose front face with side and top edges | boundary surface
- *An arbitrary closed boundary | three-sided or many-sided corner patches | fill (N-sided patch)
```

The housing's crown is a single section, 111 mm radius in the first version, extruded along the full length and extended past both ends. The side walls are a sweep of the plan outline, including its G2 corners, with draft applied by sweeping along a direction tilted at the draft angle. The nose front face is a boundary surface, built on its top and bottom edges in one direction and its two side edges in the other.

Two habits make this stage easier. Build surfaces **larger than they need to be**, so they overlap their neighbours and can be trimmed back to clean edges in Chapter 5. And build each surface from **sketches and curves in the skeleton**, not from edges of other surfaces, wherever possible. A crown extruded from the crown sketch survives a change to the side walls; a crown lofted between edges of the side walls does not.

## Sweep the side walls with the draft built in

The side walls deserve a closer look, because they combine three requirements: they follow the plan outline, they keep the G2 corners from Chapter 3, and they lean inwards at the draft angle so the part can leave the mould. There are two common ways to build them, and only one keeps all three requirements together.

The first way is to extrude the plan outline straight up and then apply a draft feature to the resulting faces. This is quick, and on a prismatic part it works well. On a housing with G2 corners, the draft feature treats each face separately. It rotates the flat walls about the parting line and recalculates the corner faces to suit, and the recalculated corners can lose their curvature continuity higher up the wall, which is exactly the hidden failure described in Chapter 3.

The second way is to build the draft into the surface from the start. A sweep of the plan outline along a short path tilted at the draft angle, or an extrude with a draft option applied to the whole profile at once, produces walls whose every horizontal section is an offset of the plan outline. The corners remain G2 at every height, because each section is the same shape, slightly smaller.

This is an illustration. With a 1.0° draft, the top cover's walls rise 20 mm from the parting plane to the top, so each wall leans in by **20 × tan 1.0° ≈ 0.35 mm** over that height. The base's walls fall 14 mm from the parting plane to the underside and lean in by **14 × tan 1.0° ≈ 0.24 mm**. Measured across the full 72 mm width, the top of the cover is about 0.7 mm narrower than the parting line, and the underside about 0.5 mm narrower. Those small numbers are easy to overlook, but they affect the lip and groove in Chapter 8, which must follow the same drafted walls.

Because draft is a parameter, the sweep direction is driven by the draft value. When the moulder later asks for 1.5°, the walls, corners and every section update together, and the continuity holds.

## Understand loft and boundary behaviour

Lofts and boundary surfaces look similar but behave differently. A loft treats its profiles as primary and any guide curves as secondary influences. Its shape is dominated by the sections, with the guides pulling it towards them. A boundary surface treats curves in both directions as equals and builds a surface that meets all of them.

The difference matters when both directions carry design intent. For the nose front face, the top edge comes from the crown, the bottom edge from the parting line, and the side edges from the nose taper in plan. All four carry intent, so a boundary surface fits. A loft between the top and bottom edges, guided by the sides, can drift slightly away from the side curves between guide points, especially if the guides and profiles have very different lengths.

Guide curves bring their own rules. Each guide must touch every profile, usually at a sketch point or vertex, and the touching should be a genuine constraint, not a near miss. A guide that passes 0.01 mm from a profile may work on one rebuild and fail on the next. Where a loft or boundary needs tangency to a neighbour, set the condition on the relevant edge and check its influence, as discussed in Chapter 3.

## See why three-sided patches cause trouble

At each front corner of the nose, three surfaces meet: the crown, the swept side wall and the nose front face. Between them, after the edge fillets are planned, sits a small three-sided region. It is the most common source of failure in a housing model.

```figure
type: svg
title: A three-sided patch and a four-sided alternative
alt: Two corner patches. On the left a triangular patch whose edges meet at a single point where the surface collapses, marked as a degenerate vertex. On the right the same corner divided so the patch has four sides, with a short fourth edge replacing the collapsed point.
caption: A four-sided feature forced into a three-sided region collapses one edge to a point. A short fourth edge, or a fill feature, removes the collapse.
viewbox: 0 0 640 270
body:
<text class="txb" x="40" y="28">Three-sided: one edge collapses</text>
<path class="bx" d="M60 230 L280 230 L170 60 Z"/>
<path class="lf" d="M100 230 L170 60 M140 230 L170 60 M200 230 L170 60 M240 230 L170 60"/>
<circle class="fa pulse" cx="170" cy="60" r="7"/>
<text class="txa" x="186" y="58">degenerate vertex</text>
<text class="tx txs" x="60" y="255">isolines crowd into one point</text>
<text class="txb" x="360" y="28">Four-sided: short fourth edge</text>
<path class="bxa" d="M380 230 L600 230 L512 64 L468 64 Z"/>
<path class="lf" d="M424 230 L479 64 M468 230 L490 64 M512 230 L501 64 M556 230 L506 64"/>
<path class="la draw" pathLength="1" d="M468 64 L512 64"/>
<text class="txa" x="456" y="52">fourth edge, 8 mm</text>
<text class="tx txs" x="380" y="255">isolines stay spaced; offsets solve</text>
```

When a four-sided feature is forced into a three-sided region, one of its four edges shrinks to zero length. That point is called a **degenerate vertex**. All the surface's internal parameter lines converge on it. The surface may render perfectly, but mathematically it has a singularity: at that point, the surface normal is poorly defined. Operations that depend on the normal, such as offsetting, thickening and shelling, often fail there, because they cannot decide which way is out.

Three ways around the problem are common:

1. **Use a fill feature.** A fill, or N-sided patch, is designed to cover an arbitrary closed boundary. It can be set to meet each neighbour with contact, tangency or curvature. Because the patch is built as a trimmed surface over a larger underlying surface, it does not collapse an edge.
2. **Change the patch to four sides.** Add a short fourth edge by splitting one boundary or by stopping one neighbour short of the corner. The region becomes a genuine four-sided patch that any boundary feature can fill without collapse.
3. **Loft to a point deliberately.** A loft can end at a sketch point if the point is constrained so that the loft arrives normal to a defined plane. This can work for symmetric nose shapes, but it still creates a vertex where many isolines meet, and it is the least robust of the three for a part that must shell.

## Work the nose corner through

This is an illustration. The nose narrows from the 72 mm body width to a 40 mm front face over a 44 mm taper, so each side steps in 16 mm. In plan, the taper runs at about **atan(16 ÷ 44) ≈ 20.0°** to the long axis, and each tapered side is about **√(16² + 44²) ≈ 46.8 mm** long.

The first version of the model filled each front corner with a three-sided loft, two of its profiles meeting at the corner point. It rendered well and passed a zebra check. Then the designer applied a 2.0 mm offset-surface test, offsetting each outer face inwards by the wall thickness, which is a cheap way to predict whether a shell will succeed. The offset failed on both nose corners, at the collapsed vertex.

Two alternatives were built and tested in the same way.

```figure
type: compare
title: Three ways to build the nose corner, tested by a 2.0 mm offset
cols: Topology | Zebra check | 2.0 mm offset test
caption: This is an illustration. The test that mattered was the offset, not the appearance; both working options were kept for comparison until the shell in Chapter 6 confirmed them.
- Three-sided loft | 3 sides, one collapsed edge | Good | Failed at the corner point
- Fill, tangent to three neighbours | Trimmed N-sided patch | Good | Succeeded
- *Four-sided boundary with an 8 mm edge | 4 sides, no collapse | Good, slightly fuller | Succeeded
```

The team chose the four-sided boundary surface with a short 8 mm fourth edge for the production model. The fill also worked, but the boundary surface had a clearer dependency on named curves, so its behaviour under later changes was easier to predict. The fill was kept in a suppressed folder as a documented fallback.

The detection method is the important part. **Offset each new surface by the wall thickness as you build it.** If the offset fails, the shell will almost certainly fail, and the cause is far easier to see on one surface than on a finished part with twenty features.

## Control a fill with reference surfaces

A fill feature's shape depends heavily on how its boundaries are defined. If the boundary is a set of sketch curves with no neighbouring surfaces, the fill can only meet them in position, and its interior is free to bulge or sag. If the boundary is made of edges of real neighbouring faces, the fill can be set to meet them tangentially or with curvature continuity, and its interior follows their shape.

Where no real neighbour exists yet, build a **reference surface** for the fill to lean on. A reference surface is a temporary surface, perhaps a short extrude or ruled surface along the boundary, whose only purpose is to give the fill a direction to match. After the fill is built, the reference surface is hidden or deleted from the final body but kept in the tree, so the fill remains controlled.

Constraint curves add further control. Many fill features accept internal curves that the patch must pass through. One well-placed constraint curve across the middle of a patch can stop a fill from sagging or bulging, much as a single guide curve controls a loft. Add one at a time and check the zebra stripes after each.

## Keep surface quality measurable

"The surface looks fine" is not a record anyone can check later. A few simple measurements turn surface quality into something that can be compared between versions and handed to a colleague.

- **Deviation from the controlling curves.** Measure the maximum distance between each surface edge and the curve it was meant to follow. For the housing, the limit set by the industrial designer is 0.2 mm, and the built surfaces stay within 0.05 mm.
- **Continuity at each boundary.** Record whether each join meets its target level from Chapter 3, measured on at least three sections.
- **Offset test at the wall thickness.** Pass or fail at 2.0 mm, for every surface.
- **Minimum radius.** The smallest radius reported by the curvature analysis on each surface, compared with the wall thickness.

These four numbers fit in a single row per surface. A table of them in the model notes takes a few minutes to update and makes the effect of a change visible at once. If a later edit pushes a surface's minimum radius from 5.35 mm down towards 2 mm, the table shows it before the shell fails.

## Recognise when to change the layout

Sometimes no feature choice makes a region behave, because the region itself is badly shaped. Long, thin patches, regions with very short edges next to very long ones, and patches whose boundary edges meet at very shallow angles are all hard to fill cleanly.

The remedy is to change the patch layout rather than the feature. Move a boundary curve, split a long patch into two, or extend one neighbour so the awkward region becomes a simpler shape. This is a design-level change and should be checked with the industrial designer, because it can alter where a highlight breaks or where an edge appears.

## Exercise: decide the patch for a new feature

The electronics team adds a thumb rest: a shallow oval recess 30 mm by 18 mm, 1.5 mm deep at its centre, on the crown near the rear. Its rim must blend tangentially into the crown. Which feature would you choose for the recess surface, and what quick test would you run before committing to it?

**Worked answer.** The recess has one closed boundary, the oval rim on the crown, and an interior that should dip smoothly to 1.5 mm. That is an arbitrary closed boundary with a tangency requirement, so a **fill feature** with tangent contact to the surrounding crown, plus one constraint curve or point setting the 1.5 mm depth at the centre, is the natural choice. A loft would need a degenerate point at the centre to close; a boundary surface would need the oval split into four edges.

Before committing, run the **2.0 mm offset test** on the new fill. If it succeeds, the shell should solve through the recess. Then check the minimum radius of the fill with the curvature readout: it must exceed the 2.0 mm wall, or the inside of the shell will fold at that point, which is the subject of Chapter 6.
