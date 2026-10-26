---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: metal-spinning-and-shear-spinning
order: 9
title: "Metal spinning and shear spinning"
description: "Form round parts on a lathe: conventional spinning's blanks, passes and cycle times, the sine law of shear spinning, and catch a cone's blank sized from the angle on the wrong side of its wall."
draft: false
---

Metal spinning is one of the oldest ways of making a seamless round part from flat sheet, and one of the most flexible. A blank is clamped against a former, called a mandrel or chuck, which has the shape of the part's inside. The two rotate together on a lathe, and a roller, pressed against the blank, moves along the former in a series of passes, laying the blank onto it. Because only a small spot of metal is worked at any moment, the forces are small, the tooling is simple and the same machine can make many different parts. The cost is time per part, which is why spinning suits small and moderate quantities, large parts and shapes that would need expensive drawing tools.

This chapter covers **conventional spinning**, in which the wall keeps close to the blank's thickness and the blank's diameter shrinks, and **shear spinning**, in which the blank's diameter stays the same and the wall is thinned according to a simple and exact rule, the sine law. The running case spins SC-100 itself, and then a conical variant, a sensor hood, whose first blank was sized from the cone's angle measured on the wrong side of its wall.

## Conventional spinning

In conventional spinning, the roller works the blank onto the former in many passes, each moving the metal a little further along the former's profile. The blank's outer edge moves inwards as the part forms, as it does in drawing, and its circumference shrinks, so the flange ahead of the roller is in circumferential compression and can wrinkle if a pass tries to move it too far. The spinner's skill, or a CNC spinning machine's program, lies in choosing passes that keep the flange stable and the wall at an even thickness.

Because the wall's thickness stays close to the blank's, the **blank size** for conventional spinning follows the same area rule as drawing. SC-100 spun would start from about the same 199.3 mm blank in 0.8 mm sheet, with its trim allowance taken on the lathe, as Chapter 7 noted. Spinners often add a little to the blank for a first part and adjust from the result, because the passes can thin the wall slightly and the edge is trimmed anyway.

## Formers and rollers

The former is the part's inside shape, turned from hardwood, resin, aluminium, cast iron or tool steel according to the quantity and the material being spun. A wooden former for a few prototype parts costs little and can be made in hours; a hardened steel one for thousands of parts costs more but holds its shape. The roller is a hardened, polished wheel on a tool post or a CNC slide, with a nose radius chosen for the part's radii and the material. A **tailstock** pad clamps the blank's centre against the former's end, and must hold it without slipping as the roller drives it.

A part that is narrower at its mouth than its body, such as a vase or a closed vessel, cannot be spun on a solid former, because the former could not be withdrawn. Such parts are spun on **segmented** formers that come apart, or spun partly in air, off the former, by an experienced spinner.

## The running case: SC-100 spun

This is an illustration. A spinning shop quoting SC-100 proposed a steel former for the cup's inside, 99.2 mm in diameter, and a CNC spinning lathe running at **600 rpm**. The part would be formed in about **8 passes**, each moving the roller along a path of about 80 mm, at a feed of about **1 mm per revolution**. The roller's working time is then about 8 × 80 ÷ (1 × 600) ≈ **1.1 minutes**, and with loading, trimming on the lathe and unloading, the cycle is about **2.6 minutes** per part. Chapter 10 uses these figures to compare spinning with drawing.

At 600 rpm, the blank's outer edge, at a radius of 100 mm, moves at about 377 m per minute. That speed is what lets a small roller form a large part quickly; it is also why the blank must be clamped securely and the lathe guarded, because a blank that escapes its clamp at that speed is dangerous.

## Shear spinning

In **shear spinning**, the roller forms the part in a single pass, at a set gap from the former, and moves the metal along the part's axis without changing its distance from the axis. Each ring of the blank stays at its original radius and is displaced along the axis into the cone's wall. Because the ring keeps its radius and its circumference, the blank's diameter equals the part's largest diameter, and the wall must thin to keep its volume. The rule that relates the wall's thickness to the blank's is the **sine law**:

```figure
type: formula
title: The sine law of shear spinning
formula: t₁ = t₀ × sin α
caption: This is an illustration for a cone with a half-angle of 30°, the angle between the cone's wall and its axis, spun from 1.6 mm sheet.
- t₀ | Blank thickness, mm
- t₁ | Wall thickness after spinning, mm
- α | Half-angle of the cone, between the wall and the axis, degrees
step: t₁ = 1.6 × sin 30° = 1.6 × 0.5 = 0.80 mm
step: For a blank thickness from a wanted wall: t₀ = t₁ ÷ sin α = 0.8 ÷ 0.5 = 1.6 mm
step: The blank's diameter equals the cone's largest diameter
```

The law follows directly from the geometry. A ring of the blank of radial width w, at radius r, becomes a band of the cone's wall of slant length w ÷ sin α, at the same radius. Its circumference is unchanged, so its area grows by 1 ÷ sin α, and its thickness must fall by sin α to keep its volume. At α = 90°, a flat disc, there is no change; at small angles, a slender cone, the wall becomes very thin.

```figure
type: line
title: Shear-spun wall thickness by cone half-angle
x: Half-angle between wall and axis, degrees
y: Wall thickness, mm
legend: From 1.6 mm sheet | From 1.0 mm sheet
ymin: 0
ymax: 1.8
caption: This is an illustration of the sine law. Steep cones thin the wall heavily; at 90°, a flat blank, there is no change.
- 15 | 0.41 | 0.26
- 30 | 0.80 | 0.50
- 45 | 1.13 | 0.71
- 60 | 1.39 | 0.87
- 75 | 1.55 | 0.97
- 90 | 1.60 | 1.00
```

The thinning a material can take in one shear-spinning pass is limited by its ductility; research on spinnability has related the maximum reduction to the material's reduction of area in a tensile test, and spinners work from experience and trials with each material. Steep cones, which need large reductions, may be shear-spun in two passes or from a preformed shape. A wall of exact thickness also depends on the roller's gap following the sine law: a gap set thicker or thinner than the law demands pushes metal ahead of the roller or pulls it back, and the flange buckles or the wall tears.

## The running case: a conical hood

This is an illustration. The customer also wanted a conical version of the sensor cover, a hood with a base diameter of **200 mm**, a flat top 60 mm across and a wall at **30°** to its axis, about 121 mm high, with a wall of **0.8 mm** in 304. Shear spinning suits it well: one pass on a conical former, a wall of controlled thickness, and a blank of the same diameter as the base, 200 mm.

By the sine law, the blank must be 0.8 ÷ sin 30° = **1.6 mm** thick. The flat top, which is not spun down, stays at 1.6 mm, which suits a hood that carries a fitting at its top.

## The error: the angle on the wrong side

This is an illustration. The hood's drawing dimensioned its wall as **60°** from the base, the angle between the wall and the flat flange plane, which is the natural way to dimension a cone on a drawing. The planner applied the sine law to that angle and calculated the blank's thickness as 0.8 ÷ sin 60° ≈ **0.92 mm**.

The sine law's angle is the half-angle between the wall and the **axis**, which for this hood is 30°, not 60°. From a 0.92 mm blank, a true shear-spun wall at 30° would be only 0.92 × 0.5 ≈ **0.46 mm**, little more than half the required 0.8 mm. In the first trial, the roller's gap was set to the drawing's 0.8 mm, which did not match the law for that blank, and the metal ahead of the roller, with nowhere to go, pushed outwards and buckled the flange within the first few turns.

```figure
type: bars
title: The hood's blank and wall thickness, mm
unit: mm
max: 1.8
caption: This is an illustration. Using the angle from the base instead of the axis gave a blank too thin by almost half.
- Blank thickness as first calculated, from 60° | 0.92
- Wall that blank would give at the true 30° | 0.46
- *Blank thickness required, from 30° | 1.60
- Wall required | 0.80
```

The fix was to recalculate from the half-angle, buy 1.6 mm sheet for the hood and set the roller gap to 0.8 mm, which the sine law then matched. The general lesson is that a formula's angle has a definition, and a drawing's angle may be measured from a different datum. The sine law's check is simple: at 90° there must be no thinning, so an angle near 90° should give a wall near the blank's thickness, and a slender cone a thin one. A 30° cone giving almost no thinning would have failed that check.

## Shear spinning's limits and uses

Shear spinning makes cones, and shapes close to cones, with walls of accurately controlled thickness: rocket nose cones, lighting reflectors, cookware, fan inlets, hoppers and tank ends. Its wall thickness follows the sine law along the whole part, so a curved profile, whose angle changes along its length, gets a wall that varies with the local angle. Where a curved part needs an even wall, the blank is preformed, or the part is spun in passes that combine shear and conventional spinning. A cylinder, at α = 0°, cannot be shear-spun from a flat blank; tubular parts are made by **flow forming**, a related process that thins and lengthens a tube or a cup on a cylindrical mandrel.

## Spinning stainless steel

Austenitic stainless steels spin well but work-harden quickly, as Chapter 8 described, so a part that needs many passes may need an anneal partway through, and the roller's forces are higher than for aluminium or copper. Lubrication is applied to the blank's surface, often a soap or wax for spinning, and must be cleaned off afterwards, as for a drawn part. A spun stainless part's surface shows the roller's track as fine spiral lines, which may need polishing for appearance; SC-100's outdoor cover was to be finished by bead blasting, which hides them.

## Spun prototypes for drawn parts

Spinning is often used to make prototypes of a part that will later be drawn, because a wooden or aluminium former can be turned in a day and a few parts spun the next, long before a drawing tool could be designed and made. For SC-100, the customer's designer wanted a handful of covers to check the fit over the instrument, the seal on its gasket and the look of the bead-blasted finish, and a spinning shop supplied ten spun cups within a week.

A spun prototype tests the part's shape, fit and function. It does not test the drawn part's manufacturing behaviour: its earing, its rim thickening, its work hardening or its tendency to crack after drawing, all of which differ between spinning and drawing. The thickness distribution differs too, because the spinner's passes thin and thicken the wall in different places from a draw. A prototype that seals well on its gasket proves the design's dimensions; the drawing tool's trials, in Chapters 3 to 8, still have to prove the process. Keeping those two questions separate stops a successful prototype being taken as evidence that the part will draw.

## Recording a spinning process

A spinning process sheet records the former's material and dimensions, the blank's diameter and thickness, the lathe's speed, the number of passes and the feed, the roller's nose radius, the lubricant and the trim. For a shear-spun part, it also records the half-angle used in the sine law, measured from the axis, and the calculated blank thickness beside the wall it produces. For the hood, that line reads: half-angle 30° from axis, blank 1.6 mm, wall 0.8 mm, blank diameter 200 mm. With the angle's datum written down, the error above cannot repeat.

## Exercise: a steeper hood

A second hood is wanted with a 45° half-angle and the same 0.8 mm wall. What blank thickness does it need? If the shop has only 1.2 mm sheet in stock, what wall would that give at 45°, and at what half-angle would 1.2 mm sheet give exactly 0.8 mm?

**Worked answer.** At 45°, the blank must be 0.8 ÷ sin 45° ≈ 0.8 ÷ 0.707 ≈ **1.13 mm** thick. From 1.2 mm sheet at 45°, the wall would be 1.2 × 0.707 ≈ **0.85 mm**, about 6% over the specified 0.8 mm, which may be acceptable if the drawing allows it.

For 1.2 mm sheet to give exactly 0.8 mm, sin α must be 0.8 ÷ 1.2 ≈ 0.667, so α ≈ **41.8°**. That changes the hood's shape, which is the customer's decision, not the shop's. The calculation shows the trade: either buy sheet of the thickness the law requires, accept a wall slightly thicker than drawn, or ask whether the angle can move. Each is a legitimate choice, made with the numbers in front of the customer.
