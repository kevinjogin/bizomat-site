---
book: welding-distortion-by-the-numbers
chapterSlug: buckling-of-thin-plate
order: 5
title: "Buckling of thin plate"
description: "Calculate the stress at which a thin panel buckles, see why welding's residual compression easily exceeds it, and keep thin stainless and steel panels flat with heat control, spacing and fixtures."
draft: false
---

Thin sheet welded to a frame or to stiffeners often comes out wavy: a panel that should be flat has gentle bulges between its welds, and pressing on one bulge makes it pop through to the other side with a click, like the bottom of an oil can. This is buckling, and it is the hardest kind of welding distortion to correct, because there is nothing bent to straighten: the panel is too large for the space the welds have left it, and it must bulge somewhere.

This chapter explains why welding makes thin plate buckle, calculates the compressive stress at which a thin panel buckles, shows how panel thickness and stiffener spacing change it, and describes the controls that keep the shop's stainless steel panels flat.

## Compression away from the weld

Chapter 1 showed that the band of metal along a weld ends up in tension, because it was squashed while hot and wants to be shorter. Forces must balance within a part, so the metal away from the weld is pushed into compression by the same amount: the tensile band along the weld is held long by the compressed plate beside it. In thick plate, the compressive stress spread over a large area is low and harmless. In thin plate, it may exceed the stress at which the plate buckles, and the plate relieves it by bulging out of plane.

## The buckling stress of a panel

A flat panel supported along its edges and pushed in its own plane stays flat until the compressive stress reaches a critical value, then buckles. For a long panel simply supported along its edges, the critical stress is approximately:

σ_cr = k × π² × E ÷ [12 × (1 − ν²)] × (t ÷ b)²

where t is the thickness, b the width between supports, E the stiffness, ν Poisson's ratio, about 0.3, and k a factor that depends on the edge supports and loading, about 4 for a long panel with simply supported edges under uniform compression.

```figure
type: formula
title: Buckling stress of a thin stainless steel panel between stiffeners
formula: σ_cr = k × π² × E ÷ [12 × (1 − ν²)] × (t ÷ b)²
caption: This is an illustration for the shop's panels, with simply supported edges and uniform compression. Real panel edges, loads and imperfections differ, but the dependence on (t ÷ b)² holds.
- t, sheet thickness | 1.5 mm
- b, stiffener spacing | 600 mm
- E, austenitic stainless steel | about 193,000 MPa
- k | about 4
step: k π² E ÷ [12 (1 − 0.09)] ≈ 4 × 9.87 × 193,000 ÷ 10.92 ≈ 698,000 MPa
step: (t ÷ b)² = (1.5 ÷ 600)² ≈ 6.25 × 10⁻⁶
step: σ_cr ≈ 4.4 MPa
```

Four megapascals is a tiny stress, a small fraction of what the residual compression from a weld can easily reach in thin sheet. The panel buckles almost as soon as it is welded. That is why thin panels welded to frames are so prone to waviness: their buckling stress is far below the stresses welding creates. Even a light seal weld along one edge can produce more than enough compression across a wide panel to buckle it, which is why the shop's panels buckled even where the welds were small and neat, and why neatness alone does not keep a thin panel flat.

## Thickness and spacing

The buckling stress rises with the square of the ratio of thickness to width, so both doubling the thickness and halving the spacing raise it fourfold.

```figure
type: bars
title: Buckling stress of a stainless panel by thickness and stiffener spacing
unit: MPa, simply supported edges, k = 4
max: 20
caption: This is an illustration. Calculated from the formula above. Halving the stiffener spacing has the same effect as doubling the thickness, at far less weight.
- 1.5 mm at 600 mm spacing | 4.4
- 2 mm at 600 mm | 7.8
- 1.5 mm at 300 mm | 17.4
- *3 mm at 600 mm | 17.4
```

The comparison shows the designer's choices. A 3 mm panel at 600 mm spacing and a 1.5 mm panel at 300 mm spacing have the same buckling stress, but the thinner panel with more stiffeners weighs less and costs less in stainless steel, though it needs more welds, each adding its own heat. In practice, stiffer panels resist buckling better, but no practical thickness will resist the full residual stress of a heavy weld in thin sheet; the welding itself must be controlled.

## Edge support matters

The factor k in the buckling formula depends on how the panel's edges are supported. A panel whose edges are clamped firmly, held against rotation as well as movement, has a k about 1.7 times higher than one whose edges are merely supported, and so resists buckling more. A panel welded continuously to stiff stiffeners behaves more like the clamped case; one stitched to light stiffeners or attached at a few points behaves more like the supported case, or worse. The illustrative calculations in this chapter use the simply supported value, which is conservative. Designers who rely on the stiffeners to hold the panel's edges must make sure the stiffeners are stiff enough to do so, or the panel and its stiffeners will buckle together.

## Initial flatness

Buckling theory assumes a perfectly flat panel, and real sheet is not. Rolled sheet carries waviness and residual stresses of its own from manufacture, and handling, cutting and forming add more. A panel that starts slightly bowed buckles gradually as the compressive stress rises, rather than snapping suddenly, and it buckles in the direction of its initial bow. The shop found that its stainless sheet supplier's flatness varied from batch to batch, and that panels cut from flatter sheet buckled less. It now checks the flatness of sheet on delivery and keeps the flattest for the largest panels.

## Cutting and forming before welding

Thermal cutting of thin sheet by plasma or laser leaves narrow heated bands along the cut edges, with residual stresses of their own, and can make narrow strips curl or long panels bow before any welding is done. Forming sheet into flanges and returns also leaves stresses. Where flatness matters, the shop cuts panels with the process and parameters that put the least heat into the edges, and lays them out so that long, narrow parts are cut with balanced edges. A panel that is already distorted before welding cannot come out flat after it.

## Designing panels to resist buckling

Designers can make panels less prone to buckling without making them thicker. Formed ribs, swages or beads pressed into the sheet stiffen it against out-of-plane movement and raise its effective buckling stress; folded edges and returns stiffen its edges; and a slight deliberate curvature, a crown, makes a panel resist the compressive stress by curving further in a controlled direction rather than buckling unpredictably. Food equipment designers often use folded and swaged panels for exactly these reasons, and they reduce the welding needed as well.

## Heat input is the main lever

Because the compressive stress comes from the weld's shrinkage, reducing the heat put into the sheet reduces it. The main methods are:

- **lower heat input processes**, such as pulsed arc, short-circuit transfer, laser or resistance welding, which put less heat into the sheet for the same joint;
- **intermittent or stitch welds** instead of continuous ones, where the joint's function allows, cutting the total heat;
- **faster travel**, with smaller welds sized to the need;
- **chill bars**, copper or aluminium bars clamped close to the weld to draw heat away;
- **attaching the panel by other means**, such as adhesive bonding, mechanical fasteners or resistance spot welding, which put little or no heat into the panel's face.

## Dunham's fender

Dunham, writing about car fenders in 1917, gave advice for thin sheet that still applies. Dunham told welders to use a much smaller filler wire than for heavier work, to hold the torch nearly flat to the sheet to avoid burning through, to weld a crack from its centre outwards towards the edge, and not to tack the end, but to clamp the fender with the edges slightly separated at the end to avoid warping. The method kept the heat low, let the shrinkage move towards a free edge rather than building up against a tacked one, and allowed for the edges drawing together, much as Whittemore's creep allowance did.

## Sequence on thin panels

On a panel welded to a frame round its edges, welding continuously round the perimeter in one direction drives the shrinkage ahead and builds up compression in the panel. Welding short lengths at widely spaced points first, spreading round the panel, then filling in between, distributes the heat and lets each weld cool before its neighbour is made. The shop's sequence for its panels welds 25 mm stitches at the corners, then the mid-points of each side, then the quarter points, and so on, letting each cool before the next nearby weld, and finishes with continuous welds only where the panel must be sealed.

## Fixtures and tensioning

A fixture that holds the sheet flat against a backing plate during welding and cooling prevents it from buckling while it cools, and if the fixture includes chill bars, it removes heat too. Some panels relax into slight buckling when released, but far less than if they had been welded free. On long seams in thin sheet, stretching the sheet slightly in tension before welding, so that the weld's shrinkage only reduces the tension rather than producing compression, is a powerful method used in some industries; it needs a fixture that can apply and hold the tension.

## Stainless steel's particular problem

Austenitic stainless steels, the commonest in food equipment, expand about half as much again as carbon steel and conduct heat only about a third as well (Chapter 1), so a weld's heat stays concentrated and expands a narrow band strongly. Thin stainless panels therefore buckle more readily than carbon steel panels of the same size and thickness. Their lower thermal conductivity also makes chill bars and low heat input processes especially valuable, and their appearance, often polished, makes any waviness visible.

## Can a buckled panel be fixed?

A panel that has buckled is too large for its frame, and the cure is to shrink it back. Heat shrinking, with small spots of heat applied to the bulges and quenched or allowed to cool, can draw a buckled panel flat in skilled hands, as panel beaters do, by deliberately making the same kind of shrinkage the weld made, in the right places. On stainless steel, the heat can discolour the surface and must be kept within limits, and the finish may need restoring. Planishing, hammering the panel against a dolly, stretches it locally and can redistribute a buckle. Both are slow and skilled, which is why prevention is so much cheaper than cure. A panel that has been shrunk flat also carries new residual stresses where the heat spots were, and may move again if it is later heated, welded nearby or put into service at a higher temperature, so a panel fixed this way is checked again after any later work on it.

## The running case: the food panels

This is an illustration. The shop's 1.5 mm stainless steel panels, welded to frames with stiffeners at 600 mm spacing by continuous fillet welds all round, came out with bulges of up to about 4 mm. The production manager made four changes: the stiffener spacing was reduced to 400 mm, raising the buckling stress about 2.25 times; the panels were attached to the stiffeners with intermittent stitch welds, continuous welds being kept for the sealed perimeter; the perimeter welds were made in the spaced stitch sequence described above, with copper chill bars clamped along each edge; and the welders changed to a pulsed arc process with lower heat input. The waviness fell to under 1 mm, which customers accepted, and the welding time per panel rose by only a few minutes once the welders were used to the sequence.

## A failure: the sealed tank side

This is an illustration. A thin stainless steel tank side, 2 mm thick, was welded continuously round its edges to a heavy frame in a single run, by a welder in a hurry to finish. It buckled into a large, dished bulge that oil-canned in and out when pressed, and the customer rejected it.

The side was cut out, and a new one fitted using the spaced stitch sequence, with chill bars and a fixture holding it flat, and was then finished with the continuous seal weld made in short sections. It came out flat. The extra time for the careful method was about an hour; the rework had cost a day and a sheet of stainless steel.

## Exercise: spacing for a target buckling stress

The shop wants the 1.5 mm panels' buckling stress to be at least 15 MPa, using the simple formula with k = 4. What maximum stiffener spacing would achieve it? What if the panels were 2 mm thick?

From σ_cr = 698,000 × (t ÷ b)², the spacing for 15 MPa is b = t × √(698,000 ÷ 15) ≈ t × 216. For 1.5 mm sheet, b ≈ **324 mm**; for 2 mm sheet, b ≈ **431 mm**.

A 400 mm spacing, as the shop chose, gives about 9.8 MPa for 1.5 mm sheet and about 17.4 MPa for 2 mm sheet. The calculation helps the designer balance sheet thickness, stiffener spacing and weight, but no practical choice will resist the residual stress of careless welding, so heat input control remains essential.
