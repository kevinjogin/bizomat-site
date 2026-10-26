---
book: ductwork-by-the-numbers
chapterSlug: friction-in-straight-duct
order: 4
title: "Friction in straight duct"
description: "Calculate straight-duct loss with Darcy–Weisbach, the Reynolds number and an explicit friction factor, see how it scales, and catch two metres of flexible hose costing 94 Pa."
draft: false
---

Air moving along a duct rubs against its walls and loses pressure steadily, metre by metre. That **friction loss** is the largest single part of the pressure a long system's fan must supply, and it is the part that the duct's size, length and surface control. It can be read from a friction chart, as generations of designers have done, or calculated directly with one equation and a friction factor, which a spreadsheet does in a line.

This chapter sets out the Darcy–Weisbach equation, the Reynolds number, an explicit formula for the friction factor, and the roughness that drives it, then calculates EX-1's straight-duct losses. The running case finds two metres of flexible hose at B1's hood, which the design had treated as steel duct, adding 94 Pa to the index path.

## The Darcy–Weisbach equation

The pressure lost to friction in a straight round duct of length L and internal diameter D, carrying air of density ρ at an average velocity v, is:

```figure
type: formula
title: Friction loss in straight duct
formula: Δp = f × (L ÷ D) × (ρ × v² ÷ 2)
caption: This is an illustration for EX-1's 140 mm branches at 0.30 m³/s, with air at 1.2 kg/m³ and a friction factor from the Haaland formula for a roughness of 0.15 mm.
- f | Darcy friction factor, dimensionless
- L, D | Duct length and internal diameter, m
- ρ × v² ÷ 2 | Velocity pressure, Pa
step: v = 19.49 m/s; velocity pressure = 0.5 × 1.2 × 19.49² = 227.9 Pa
step: f = 0.0213 at Re = 180,900 and ε ÷ D = 0.00107
step: Loss per metre = 0.0213 ÷ 0.14 × 227.9 = 34.7 Pa/m
```

The term ρv² ÷ 2 is the **velocity pressure**, the pressure equivalent of the air's kinetic energy, which Chapter 5 uses for fittings. The equation says that friction loss is a number of velocity pressures, f × L ÷ D of them, so it rises with the square of the velocity and in proportion to the length.

## Reynolds number

The friction factor depends on whether the flow is smooth and layered, **laminar**, or chaotic, **turbulent**, and on how rough the wall is. The Reynolds number tells which:

- **Re = ρ × v × D ÷ μ**, where μ is the air's dynamic viscosity, about 1.81 × 10⁻⁵ Pa·s near 20 °C.

For EX-1's 140 mm branch, Re = 1.2 × 19.49 × 0.14 ÷ 1.81 × 10⁻⁵ = about **181,000**. Flow in pipes and ducts is laminar only below a Reynolds number of about 2,000 and fully turbulent well above a few thousand, so every duct in an extraction system runs fully turbulent, and the formulas for turbulent flow apply.

## The friction factor

For turbulent flow, the friction factor depends on the Reynolds number and the **relative roughness**, the wall's roughness ε divided by the diameter. The classic relation, the Colebrook equation, has to be solved by iteration. An explicit approximation published by Haaland in 1983 is accurate to within a few per cent and needs no iteration:

- **1 ÷ √f = −1.8 × log₁₀((ε ÷ D ÷ 3.7)^1.11 + 6.9 ÷ Re)**.

The roughness of the wall is the uncertain input. In this book's illustrations, galvanised steel duct is taken as **0.15 mm**. Real values depend on the material, the seams and the joints, and a duct carrying dust becomes rougher as deposits build up; the duct supplier's data or a recognised design reference should be used for a real system.

## The running case: EX-1's straight ducts

This is an illustration, with air at 1.2 kg/m³ and 0.15 mm roughness.

```figure
type: compare
title: Straight-duct friction in EX-1
cols: Velocity | Friction factor | Per metre | Length | Loss
caption: This is an illustration. The small branch loses most per metre; the long 250 mm sections lose most in total because of their length.
- Branches, 140 mm, 0.30 m³/s | 19.49 m/s | 0.0213 | 34.7 Pa/m | 3 m each | 104 Pa each
- Main B1 to N2, 140 mm | 19.49 m/s | 0.0213 | 34.7 Pa/m | 8 m | 277 Pa
- Main N2 to N3, 200 mm | 19.10 m/s | 0.0196 | 21.4 Pa/m | 6 m | 128 Pa
- *Main N3 to fan, 250 mm | 18.33 m/s | 0.0186 | 15.0 Pa/m | 10 m | 150 Pa
- Stack, 250 mm | 18.33 m/s | 0.0186 | 15.0 Pa/m | 6 m | 90 Pa
```

B1's path to the fan, its 8 m of 140 mm duct, the 6 m of 200 mm and the 10 m of 250 mm, loses about 277 + 128 + 150 = **555 Pa** in straight duct alone, before any fitting, hood, collector or stack.

## Where the index path's friction goes

Half of B1's straight-duct friction is in its first 8 m, the 140 mm section from the hood to N2, because that section is both the smallest and among the longest. The 250 mm section, longer still, contributes barely a quarter.

```figure
type: stack
title: Straight-duct friction on B1's path to the fan
unit: Pa
caption: This is an illustration. The small duct at the far end of the main is where friction concentrates; it is also where a larger duct would save the most, if the transport velocity allowed one.
- B1 to N2, 140 mm, 8 m | 277
- N2 to N3, 200 mm, 6 m | 128
- N3 to fan, 250 mm, 10 m | 150
```

That distribution shows where design effort pays. Moving booth B1 a metre closer to N2 would remove a metre of 140 mm duct and save about 35 Pa on the index path; moving the fan a metre closer to N3 would remove a metre of 250 mm duct and save only about 15 Pa. Moving the junction N2 towards B1 instead would shorten the 140 mm run but lengthen the 200 mm one by the same amount, saving only the difference, about 13 Pa per metre, and it would shorten B2's path too, which is not the one that needs help. Layout decisions made early, on where the main runs and where booths stand, usually save more fan pressure than any later choice of fittings, and the per-metre figures show which moves are worth making. They are worth calculating before the booths are bolted down, because afterwards each metre of duct saved means moving equipment and services, not redrawing a line on a layout.

## A quick check by hand

For galvanised extraction ducts of 100 to 300 mm at around 15 to 25 m/s, the friction factor lies close to 0.02. That gives a quick check on any calculated loss: **loss per metre ≈ 0.02 ÷ D × velocity pressure**. For EX-1's ducts it gives 32.6, 21.9 and 16.1 Pa/m for the 140, 200 and 250 mm sections, against the calculated 34.7, 21.4 and 15.0 Pa/m. The check agrees within about 10% for all three sections, which is close enough to catch a misplaced decimal, a radius used for a diameter or a velocity left unsquared, and not close enough to replace the calculation.

## Friction charts

Before spreadsheets, designers read friction loss from charts: a log-log plot of flow against loss per metre, with lines of constant diameter and constant velocity, drawn for standard air in a duct of standard roughness. A chart is the same equation drawn once, and it is quick and visual. Its limits are that it is only right for the air density and roughness it was drawn for, and that reading a log scale between gridlines is easy to get wrong by a factor of two. A calculation shows its inputs, so it can be checked and changed; a chart reading cannot. Charts remain useful as a cross-check, and every designer should be able to read one.

## Extraction and comfort design

The two kinds of system use friction differently. An extraction system is designed by **velocity**: each duct is sized for its transport velocity, and the friction is whatever results, which the fan must supply. A comfort ventilation system is often designed by **equal friction**: every duct is sized for the same loss per metre, a figure chosen by the designer for economy and quiet, so that the system's losses are spread evenly and balancing is easier. The equal-friction method sizes ducts larger, at lower velocities, and would leave a dust duct full of dust. Knowing which method a drawing used explains its sizes, and mixing the methods on one system is a sign that someone has not.

## How friction scales

Two scaling rules make quick estimates possible and catch errors.

- **With flow.** At a fixed size, velocity is proportional to flow and friction roughly to velocity squared, so doubling the flow roughly quadruples the friction; the friction factor falls slightly as the Reynolds number rises, so the real factor is a little less. In a 140 mm duct, doubling the flow from 0.30 to 0.60 m³/s raises the loss per metre by a factor of about 3.9.
- **With size.** At a fixed flow, velocity goes as 1 ÷ D², velocity pressure as 1 ÷ D⁴, and friction per metre, with its extra 1 ÷ D, as roughly 1 ÷ D⁵. A small change in diameter makes a large change in friction, which is why rounding a duct down for velocity, as Chapter 1 did, costs pressure.

## The error: two metres of flexible hose

This is an illustration. The design calculation treated B1's whole path as galvanised steel duct. The installation drawing, prepared later by the fitter, connected B1's hood to its duct with **2 m of flexible hose**, so that the booth could be moved for maintenance. Flexible hose with a corrugated or wire-reinforced inner wall is far rougher than steel; in this illustration its effective roughness is taken as 3 mm, although the hose maker's data should be used for a real hose.

At 3 mm roughness, the friction factor in a 140 mm hose at 19.49 m/s rises to about 0.050 and the loss to about **81.8 Pa/m**, against 34.7 Pa/m for steel. Two metres of hose add about 2 × (81.8 − 34.7) = **94 Pa** to B1's path, which is the index path, so the fan would have to supply 94 Pa more than calculated or B1 would fall short of its flow.

```figure
type: bars
title: Friction per metre in a 140 mm duct at 0.30 m³/s, by wall
unit: Pa/m
max: 90
caption: This is an illustration. The roughness values are illustrative; the hose maker's data governs a real hose. Even a short length of rough hose on the index path matters at the fan.
- Very smooth wall, 0.0015 mm | 25.8
- *Galvanised steel, 0.15 mm | 34.7
- Flexible hose, 3 mm | 81.8
```

The design review caught it by comparing the installation drawing with the calculation's list of segments, which had no flexible hose in it. The fix was to shorten the hose to 0.5 m, enough for the booth's movement, and to add it to the calculation: about 24 Pa instead of 94 Pa. The general lesson is that the calculation must be of the system as installed, and every change of material on the index path belongs in it.

## Non-circular ducts

For rectangular ducts, Chapter 2's two approaches apply. Either use the Huebscher equivalent diameter with the round-duct formula at the same flow, or use the hydraulic diameter with the rectangle's own velocity. The two give similar results for moderate aspect ratios; they should not be mixed, using the equivalent diameter with the rectangle's velocity, which double-counts the difference.

## Air density

The equation uses the air's density, which falls with temperature and altitude. At about 1.2 kg/m³, near 20 °C at sea level, EX-1's figures hold. A hot exhaust at 80 °C has a density about a sixth lower, and a system at high altitude lower still. Friction and velocity pressure both scale with density at a given velocity, so a system designed at one density and run at another has different losses, and its fan delivers a different pressure, which fan selections must account for.

## Seams and joints

Roughness is not only the sheet's surface. Spiral-wound duct has a raised helical seam inside it; longitudinally seamed duct has one seam along its length; and every joint between lengths, every 1.2 to 3 m depending on how the duct is made, has some step or gap. These features are part of what a duct's effective roughness represents, and a value taken from a design reference for "galvanised steel duct" usually includes them. A duct with badly made joints, protruding screws or rivets, or misaligned sections can lose noticeably more than its nominal figure, and the extra is concentrated where the air hits each protrusion, which in a dust duct is also where wear starts. Rivets and screws on extraction ducts should therefore be kept out of the airstream where possible, and joints made with their laps in the direction of flow.

## Dust build-up

A dust duct's friction does not stay at its clean value. Deposits roughen the wall and, if they grow, reduce the bore. A duct that drops below its transport velocity, as Chapter 1's 150 mm branch did, accumulates dust quickly; one that stays above it still collects a thin layer over time. Allowing for some increase in roughness in the design, and providing access doors at intervals so that the main can be inspected and cleaned, are cheaper than discovering the effect as weaker hoods a year after commissioning.

## Exercise: a dusty middle section

After a year, the main from N2 to N3 has a dust layer that raises its effective roughness to 1 mm, in this illustration, without measurably reducing its 200 mm bore. At 0.60 m³/s, what is its new friction factor and loss per metre, and how much does its 6 m length now lose compared with when it was clean? What does that do to the system?

**Worked answer.** At Re = 253,000 and ε ÷ D = 0.005, the Haaland formula gives f = **0.0308**, against 0.0196 when clean. The loss per metre rises from 21.4 to about **33.7 Pa/m**, and the 6 m section's loss from about 128 Pa to about **202 Pa**, an increase of about 74 Pa.

The section is on B1's index path, so the fan must find 74 Pa more or B1's flow falls; it also sits downstream of B2's junction, so B2's path is unaffected while B1's grows harder, which unbalances N2 in B2's favour. A modest build-up in one section shifts both the fan's duty and the balance, which is why periodic cleaning and a check of hood flows are part of running an extraction system, not only of commissioning it.
