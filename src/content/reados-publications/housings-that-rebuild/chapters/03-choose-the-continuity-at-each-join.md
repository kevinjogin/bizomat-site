---
book: housings-that-rebuild
chapterSlug: choose-the-continuity-at-each-join
order: 3
title: "Choose the continuity at each join"
description: "Decide where a housing needs position, tangent or curvature continuity, check it with combs and zebra stripes, and count the cost in setback and radius."
draft: false
---

Every place where two faces meet is a decision, even when nobody made it consciously. The faces can meet at a sharp edge, they can meet with matching direction, or they can meet with matching direction and matching curvature. Each option looks different on a finished part, costs a different amount of modelling effort and affects later features such as the shell.

This chapter names the options, shows how to check which one a model actually has, and works through the decision for the housing's plan-view corners. The numbers show something that surprises many designers: a curvature-continuous blend that occupies the same space as a fillet is tighter, not gentler, at its centre.

## Name the levels of continuity

Continuity describes how smoothly one curve or surface joins another. CAD documentation uses two related families of terms. Geometric continuity, written G0, G1 and G2, describes the shape. Parametric continuity, written C0, C1 and C2, describes the internal mathematics of the curve's parameter. For design work, the geometric terms are the ones that matter, although many presentations and some software labels use the C names loosely to mean the same thing. This book uses G.

```figure
type: compare
title: Three levels of continuity at a join
cols: What matches | How it looks on a gloss surface
caption: Each level includes the one before it. G2 means position, direction and curvature all agree where the faces meet.
- G0, position | The faces touch | A visible crease or sharp edge
- G1, tangent | Direction matches | Smooth to touch, but highlights change speed abruptly
- *G2, curvature | Curvature also matches | Highlights flow continuously across the join
```

Higher levels exist. G3 matches the rate of change of curvature, and some specialised surface modellers used for car bodies work at that level. For moulded product housings, G2 is the practical ceiling, and many joins are perfectly acceptable at G1.

A constant-radius fillet between two flat faces is G1. Its direction matches each face where it meets them, but its curvature jumps from zero on the flat face to 1 ÷ R on the fillet. That jump is what the eye catches as a sudden change in a reflected highlight.

## See continuity with analysis tools

Continuity cannot be judged reliably from shaded images. Three analysis tools, available in some form in most systems, make it visible.

1. **Curvature combs on edges and sections.** The comb from Chapter 2 works on surface sections too. Cut a section through a join and display the comb: a step at the join means G1; a continuous envelope means G2.
2. **Zebra stripes.** The system reflects a pattern of parallel stripes onto the surface, as if the part sat under striped lights. Across a G0 join the stripes break apart. Across a G1 join they stay connected but change direction sharply. Across a G2 join they flow through without a kink.
3. **Curvature colour maps.** Each point on the surface is coloured by its curvature. A sudden colour change along a boundary marks a curvature jump. The same display reports the minimum radius on a face, which becomes critical in Chapter 6.

```figure
type: matrix
title: What each analysis shows at each level
x: Analysis tool: comb → zebra
y: Continuity: G1 → G2
hot: 4
caption: Use at least two tools. A comb on one section can miss a problem elsewhere along the join; zebra stripes show the whole surface at once.
- Comb step at the join | curvature jumps
- Zebra stripes kink | direction of highlights changes abruptly
- Comb envelope continuous | curvature matches on that section
- Zebra stripes flow | highlights continue smoothly across the join
```

Each tool has limits. Zebra stripes depend on the viewing direction and stripe density, so rotate the model and change the stripe width before deciding. A comb shows only the sections you cut, so a problem between sections can hide. A colour map can make tiny numerical noise look dramatic if its scale is too tight. Use the tools together, and record what you checked.

## Count what G2 costs

Curvature continuity is not free. To blend from a flat face, with zero curvature, into a turn, the curvature must ramp up from zero. To complete the same turn in the same space as a constant-radius arc, it must then rise above the arc's curvature to make up for the slow start.

This is an illustration. Take one plan-view corner of the housing, a 90° turn between the rear wall and a side wall. The brief specifies R10. An R10 arc starts turning 10 mm before the corner point on each wall, a setback of 10 mm, and its curvature is 0.1 per mm throughout.

Now model a G2 blend as a symmetrical curve whose curvature rises linearly from zero to a peak at the middle and falls linearly back to zero, a shape known as a clothoid pair. Two versions are useful for comparison. One keeps the same 10 mm setback as the arc. The other keeps the same minimum radius as the arc, 10 mm, at its tightest point.

```figure
type: compare
title: An R10 arc and two curvature-continuous corners
cols: Setback on each wall | Minimum radius | Peak curvature
caption: This is an illustration, calculated numerically for a 90° turn. Matching the arc's setback makes the blend tighter in the middle; matching its radius makes the blend much longer.
- R10 arc, G1 at each end | 10.0 mm | 10.0 mm | 0.100 per mm
- G2 blend, same setback | 10.0 mm | 5.35 mm | 0.187 per mm
- *G2 blend, same minimum radius | 18.70 mm | 10.0 mm | 0.100 per mm
```

The numbers were found by integrating the curve's direction along its length. A clothoid pair turning 90° has a setback of about 0.595 times its length, and its peak curvature is π divided by its length. A 10 mm setback therefore needs a length of about 16.8 mm, giving a peak curvature of 0.187 per mm and a minimum radius of 5.35 mm. A 10 mm minimum radius needs a length of about 31.4 mm, giving a setback of 18.70 mm.

```figure
type: svg
title: Curvature along the corner for the arc and the same-setback G2 blend
alt: A chart of curvature against distance along a corner. The R10 arc is a flat-topped step from zero to 0.1 per millimetre and back. The G2 blend is a triangle rising from zero to a peak of 0.187 per millimetre in the middle and falling back to zero, over a slightly longer distance.
caption: This is an illustration. The arc's curvature jumps at both ends; the blend ramps smoothly but peaks higher in the middle.
viewbox: 0 0 640 280
body:
<path class="ln" d="M60 230H600 M60 230V30"/>
<text class="tx txs" x="20" y="44">0.19</text>
<text class="tx txs" x="20" y="132">0.10</text>
<text class="tx txs" x="40" y="234">0</text>
<path class="lf dsh" d="M60 40H600 M60 128H600"/>
<path class="li" d="M60 230H200V128H460V230H600"/>
<path class="la draw" pathLength="1" d="M60 230L178 230L330 40L482 230H600"/>
<text class="txb" x="470" y="120">R10 arc</text>
<text class="txa" x="345" y="38">G2 blend, peak 0.187</text>
<text class="tx txs" x="200" y="258">distance along the corner</text>
<circle class="fa pulse" cx="200" cy="128" r="5"/>
<circle class="fa pulse" cx="460" cy="128" r="5"/>
```

Two practical consequences follow. First, a G2 corner that fits the same footprint as an R10 arc has a minimum radius of only 5.35 mm. If the part is shelled inwards by 2.0 mm, the inside radius at that point is **5.35 − 2.0 = 3.35 mm**, compared with 8.0 mm for the arc. That is still workable here, but on a thicker wall or a tighter corner it could fail the shell, as Chapter 6 shows.

Second, a G2 corner that is never tighter than R10 needs 18.70 mm of setback on each wall. On the 72 mm wide rear end, the straight portion between the two corners shrinks from **72 − 2 × 10 = 52 mm** to **72 − 2 × 18.70 = 34.6 mm**. That changes the look of the product and may collide with internal features, such as a battery bay that needs a flat wall.

## Decide where G2 is worth it

The decision belongs to the product and the people who will see it, not to the modelling tool. A short set of questions sorts most joins.

```figure
type: decision
title: Choosing continuity for a housing join
question: Will the join be seen as a reflection on a smooth, glossy surface?
caption: This is an illustration of the reasoning used for the moisture-meter housing. The answer for each join is recorded in the model notes.
- *Yes, on a main visible face | plan corners on the glossy side walls | G2, with its setback and minimum radius checked
- Yes, but on a textured or matte area | top perimeter edge under a matte texture | G1 fillet is usually enough
- No, internal or hidden | ribs, bosses, inside corners | G1 or even G0, whatever moulds and shells best
```

This is an illustration. For the housing, the industrial designer specifies a high-gloss finish on the side walls and a fine matte texture on the crown. The decisions are:

- **Plan-view corners** on the glossy sides: G2, keeping the brief's 10 mm setback. The model notes record a minimum radius of 5.35 mm and an inside radius after shelling of 3.35 mm.
- **Top perimeter edge**, where the textured crown meets the glossy sides: an R3 constant-radius fillet, G1. The texture breaks up reflections enough that the curvature jump does not read.
- **Window surround**: an R1.5 fillet on the outer edge of the window opening. This choice turns out to be a problem in Chapter 6.
- **Internal ribs and bosses**: whatever is simplest to mould and shell.

Many CAD systems offer a curvature-continuous option within the fillet command itself, or a conic profile controlled by a shape value. These produce G2 blends without building surfaces by hand. Use them where they can satisfy the decision, and check the result with zebra stripes and the minimum-radius readout.

## Build continuity into surface boundaries

When surfaces are built rather than filleted, continuity is set at their boundaries. Lofts, boundary surfaces and fills usually let each boundary carry a condition: none, tangent to an adjacent face, or curvature to an adjacent face.

A boundary condition can only be as good as the face it references. Asking a loft to be curvature-continuous with a face that has its own curvature jumps near the boundary produces a loft that inherits the jumps. Check the neighbour first.

A second subtlety concerns the influence of the condition. Many systems provide a weighting or tangent length that controls how far into the new surface the boundary condition reaches. Short influence gives a surface that matches at the edge and then quickly heads towards its own shape, which can leave a visible band. Long influence carries the neighbour's shape further in, which can cause a bulge if the surfaces are far apart. Adjust it while watching zebra stripes, then record the value.

## Detect a hidden continuity failure

This is an illustration. The first G2 plan corners on the housing passed a quick visual check in the shaded view. During the zebra check, rotating the model showed a faint kink in the stripes about two-thirds of the way up the side wall at each rear corner. A section comb at that height showed a small step in curvature.

The cause was the draft. The corner blend had been built on the plan sketch at the parting plane and then drafted. The draft rotated the side walls about the parting line but treated the corner blend as a separate face with its own draft behaviour. The result was G2 at the parting line and only G1 higher up.

The fix was to build the side walls and corners as one drafted surface from the outset, sweeping the full plan outline, including its G2 corners, along a drafted direction, so that every section stayed G2. A repeat zebra check at five heights showed continuous stripes at each.

The general lesson is that **continuity can change along a join**. A check at one height or one section proves only that section. Check several sections, especially where another operation, such as draft, a split or a trim, has acted on the faces after they were created.

The edited Library chapter on [building CAD surfaces with clear dependencies](/reados/collections/cad-modelling-and-design-intent/building-cad-surfaces-with-clear-dependencies/) discusses specifying continuity at surface joins alongside trimming and NURBS control.

## Plan for the join you cannot make perfect

One join on the housing will never be truly continuous in the finished product: the parting line between the top cover and the base. In the model, the two parts are cut from one smooth master surface, so the join is perfect on screen. In production, the two parts come from different mould cavities, shrink slightly differently and are assembled with some clearance. A small step or gap along the line is almost certain.

Designers deal with this in two broad ways. One is to accept a flush join and specify how much mismatch is acceptable, which the moulder must then hold. The other is to make the mismatch deliberate, so it cannot be seen as a fault. A small, intentional step, where one part sits slightly proud of the other, or a narrow groove, often called a reveal, along the parting line hides variation that would look like poor quality on a flush join.

This is an illustration. For the moisture-meter housing, the industrial designer chooses a reveal: a groove 0.6 mm wide and 0.4 mm deep, formed as a small chamfer on the top edge of the base. The decision is recorded alongside the continuity table, because it changes the meaning of the side-wall continuity. The glossy sides are G2 within each part, and the parting line is deliberately broken.

Modelling the reveal needs care. It should be cut after the split in Chapter 8, as a feature of the base alone, so it does not disturb the master surfaces. If it is cut into the master before splitting, both parts inherit a feature intended for only one of them, and a later change to the parting height can drag the reveal into the wrong place.

The same reasoning applies to any join between separately made parts: a window lens set into the cover, a rubber overmould, a button in an opening. Each needs a decision about whether the join is meant to be seen and, if so, how its unavoidable variation will be presented. Continuity on the screen is a design intent; continuity on the shelf depends on tooling, shrinkage and assembly.

## Record the continuity decisions

The continuity of each important join is part of the design, but the model does not always make it obvious. Record the decisions in a short table in the model notes or the design file: the join, the chosen level, the reason, and the measured minimum radius. When the model passes to another designer or to a toolmaker, the table explains why the corners look the way they do and which values must not be simplified away.

## Exercise: tighten the corners

The product manager wants the housing to look more compact and asks for the plan-view corners to use a 7 mm setback instead of 10 mm, keeping them G2. Using the clothoid-pair proportions above, what are the new minimum radius and the inside radius after a 2.0 mm shell? Is the shell still likely to succeed at that point?

**Worked answer.** For a 90° clothoid pair, the setback is about 0.595 times the length, so a 7 mm setback needs a length of about **7 ÷ 0.595 ≈ 11.8 mm**. The peak curvature is π ÷ 11.8 ≈ 0.267 per mm, so the minimum radius is about **3.74 mm**. After a 2.0 mm inward shell, the inside radius at the tightest point is about **3.74 − 2.0 = 1.74 mm**.

The shell should still succeed at the corner, because the minimum radius exceeds the wall thickness, but the margin has shrunk. A later request for a 2.4 mm wall would leave about 1.3 mm inside, and a request for a 4 mm setback would bring the minimum radius close to the wall itself. Record the minimum radius as a checked value in the notes so the next change is assessed against it.
