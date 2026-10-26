---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: cones-pyramids-and-frustums
order: 3
title: "Cones, pyramids and frustums"
description: "Calculate cone and pyramid bottoms and the frustums that hoppers are made of, find wall and hip slopes, and catch an average-of-the-ends estimate that overstated a hopper by 21%."
draft: false
---

Tanks drain through cones and hoppers feed through pyramids. Both are shapes that taper to a point, and in practice both are cut off before the point to leave an outlet, which makes them frustums: the part of a cone or pyramid between two parallel sections. Their volume has a formula that is exact and a little less obvious than a prism's, and the obvious shortcut, averaging the two end areas, is always wrong in the same direction.

This chapter covers the volumes of cones and pyramids, the frustum formula for both, the slopes of cone walls and of a pyramid hopper's sides and hips, and the height a hopper must have for a given capacity. The running case calculates TK-1's cone and HP-400's hopper, and finds the hopper's capacity overstated by an estimate made from the average of its ends.

## Cones and pyramids

A cone or pyramid with base area A and height h, measured perpendicular to the base, has a volume of **A × h ÷ 3**: one third of the prism with the same base and height. The rule holds for any base shape, circular, square, rectangular or polygonal, provided the sides run straight to a single apex.

For a circular cone of radius r, the volume is π × r² × h ÷ 3. For a square pyramid of side s, it is s² × h ÷ 3.

## Frustums

A frustum has two parallel end areas, A₁ at the larger end and A₂ at the smaller, a height h between them, and straight sides. Its volume is:

```figure
type: formula
title: Volume of a frustum of a cone or pyramid
formula: V = h ÷ 3 × (A₁ + A₂ + √(A₁ × A₂))
caption: This is an illustration for TK-1's cone, 1,200 mm to 100 mm over 400 mm, and HP-400's hopper, 1,000 mm square to 250 mm square over 900 mm.
- A₁, A₂ | Areas of the large and small ends
- h | Perpendicular height between the ends
step: TK-1 cone: A₁ = π × 0.6² = 1.1310 m², A₂ = π × 0.05² = 0.0079 m²
step: V = 0.4 ÷ 3 × (1.1310 + 0.0079 + √(1.1310 × 0.0079)) = 0.1644 m³
step: HP-400: A₁ = 1.0 m², A₂ = 0.0625 m²; V = 0.9 ÷ 3 × (1.0 + 0.0625 + 0.25) = 0.3938 m³
```

For a cone frustum with end radii R and r, the formula becomes π × h ÷ 3 × (R² + R × r + r²), which is the form most often quoted. Both forms give the same answer, because √(πR² × πr²) = πRr.

The frustum formula can be checked by subtraction: a frustum is a whole cone minus the small cone cut off its tip. TK-1's cone, extended to its apex, would be 0.4 × 0.6 ÷ 0.55 = 0.4364 m tall and hold 0.16451 m³; the tip below the outlet, 0.0364 m tall with a 50 mm radius, holds 0.0000952 m³. The difference, **0.16441 m³**, is the frustum's volume, as the formula gave.

## The running case: TK-1's cone and HP-400

This is an illustration.

**TK-1's cone** runs from the shell's 1,200 mm internal diameter to a 100 mm outlet over a height of 400 mm. Its volume is about **0.1644 m³**, 164.4 L, which is why the shell above it can be shorter than a flat-bottomed tank's for the same capacity, as Chapter 2 found.

**HP-400** is a square pyramid frustum, 1,000 × 1,000 mm at the top and 250 × 250 mm at the outlet, 900 mm high. Its volume is 0.9 ÷ 3 × (1.0 + 0.0625 + √0.0625) = **0.3938 m³**. The 300 mm straight upstand above it, a prism, adds 1.0 × 1.0 × 0.3 = 0.300 m³, giving the level-full volume of about **0.694 m³** that Chapter 1 used.

## The error: averaging the ends

This is an illustration. The fabricator's estimator first priced HP-400 from a quick calculation: the average of the two end areas times the height. That gave (1.0 + 0.0625) ÷ 2 × 0.9 = **0.478 m³** for the frustum, 21% more than the true 0.394 m³. The quotation promised a hopper holding "about 0.78 m³" level full.

The average-of-ends method is exact only for prisms, where the two ends are equal. For any taper it overstates the volume, because the area at mid-height of a tapering shape is less than the average of its ends: HP-400's mid-height section is 625 × 625 mm, 0.391 m², while the ends average 0.531 m². The more the shape tapers, the bigger the error. For TK-1's cone, whose outlet is tiny compared with its top, averaging the ends would overstate the volume by about **39%**.

```figure
type: bars
title: HP-400's frustum volume by method
unit: m³
max: 0.5
caption: This is an illustration. Averaging the ends overstates any taper; multiplying the mid-height area by the height understates it. Only the frustum or prismoidal formula is exact.
- Mid-height area × height | 0.352
- *Frustum formula, exact | 0.394
- Average of the end areas × height | 0.478
```

The error was found when the customer's engineer checked the quotation's capacity with the frustum formula. The check that would have caught it earlier is a bound: a frustum's volume must lie between the volume of a prism on its small end and a prism on its large end, and much nearer the small one when the taper is steep. A quick look at where the estimate falls between those bounds is a useful sanity check, but it is no substitute for the exact formula, which takes no longer.

## Slopes of cone and hopper walls

The slope of a cone or hopper wall matters for drainage and, for bulk solids, for whether the material flows at all. The slope is usually stated from the horizontal, though some designers state it from the vertical, and a drawing should say which.

- **TK-1's cone** falls 400 mm over a horizontal run of (600 − 50) = 550 mm, so its wall is at about **36°** from the horizontal, 54° from the vertical. That is ample for a liquid to drain.
- **HP-400's side walls** fall 900 mm over a run of (500 − 125) = 375 mm, about **67.4°** from the horizontal.
- **HP-400's hips**, the corner lines where two walls meet, run along the diagonal, whose horizontal run is 375 × √2 = 530 mm, so they are shallower, about **59.5°** from the horizontal.

```figure
type: compare
title: Wall and hip slopes of TK-1 and HP-400
cols: Fall | Horizontal run | From horizontal
caption: This is an illustration. A pyramid hopper's hips are always shallower than its walls, and bulk solids that hang up usually do so in the corners first.
- TK-1 cone wall | 400 mm | 550 mm | 36.0°
- HP-400 side wall | 900 mm | 375 mm | 67.4°
- *HP-400 hip | 900 mm | 530 mm | 59.5°
```

The hip slope is the one that matters most for bulk solids, because material in the corner of a pyramid hopper slides on the shallower hip line. Whether a particular powder flows reliably in a hopper of a given slope is a question for bulk solids testing and design, not for geometry, and the customer's material data or a specialist should decide the slope. The geometry's job is to state the slopes exactly so that the decision can be checked.

## Height for a required capacity

The frustum formula can be turned round to find the height a hopper needs, but not simply, because the small end's size usually depends on the height through the wall slope. In practice the outlet size is fixed by the discharge equipment and the slope by the material, and the height then follows from geometry: for HP-400, with a 1,000 mm top, a 250 mm outlet and walls at 67.4°, the height is the run, 375 mm, times tan 67.4°, which returns the 900 mm drawn.

If more capacity is needed, it is usually cheaper to add straight upstand above the hopper than to change the hopper itself, because the upstand is a simple prism and the hopper's slopes and outlet stay as designed. Each 100 mm of HP-400's upstand adds 1.0 × 1.0 × 0.1 = 0.1 m³.

## Rectangular and offset hoppers

Not every hopper is a square pyramid. A rectangular hopper with a rectangular outlet is a frustum only if the two ends are similar rectangles, the outlet a scaled copy of the top. If the top is 1,200 × 800 mm and the outlet 300 × 300 mm, the sides slope at different angles and the shape is not a frustum of any pyramid: the frustum formula no longer applies, and the prismoidal formula of Chapter 4 does. An offset hopper, whose outlet is not under the centre of the top, has the same volume as the centred one with the same ends and height, because sliding the sections sideways does not change their areas, but its walls have four different slopes, which Chapter 9's patterns must handle.

## Volume up to a level in a cone

A cone is also where a tank's level and volume are least proportional, because each millimetre of level near the outlet holds much less than a millimetre near the top. The volume below a level y in TK-1's cone is itself a frustum, from the 50 mm outlet radius to the radius at that level, which grows in a straight line from 50 mm at the outlet to 600 mm at the top of the cone.

This is an illustration. Halfway up TK-1's cone, at 200 mm above the outlet, the radius is 50 + 550 × 0.5 = 325 mm, and the volume below is π × 0.2 ÷ 3 × (0.325² + 0.325 × 0.05 + 0.05²) = **0.0260 m³**, about 26 L. Half the cone's height holds only about 16% of its volume. Chapter 5 uses exactly this calculation to build TK-1's calibration table through the cone.

## Spherical caps and dished ends

Some tanks have dished rather than conical bottoms. A shallow dish that is part of a sphere is a **spherical cap**, whose volume, with base radius a and depth h, is π × h ÷ 6 × (3a² + h²). This is an illustration. A dish on TK-1's 600 mm radius, 150 mm deep, is part of a sphere of radius (a² + h²) ÷ 2h = 1.275 m and holds π × 0.15 ÷ 6 × (3 × 0.36 + 0.0225) = about **0.0866 m³**, roughly half the 400 mm cone's volume in less than half its depth.

Most pressed dished ends are not spherical caps but torispherical or ellipsoidal shapes with a knuckle radius at the edge. Their volumes depend on the exact profile, and the manufacturer's published volume for each size should be used, not a spherical-cap estimate. A whole sphere, used for some pressure and gas storage, holds 4πr³ ÷ 3; a sphere of 1,200 mm internal diameter holds about 0.905 m³.

## Working in millimetres

All the formulas in this chapter work in any consistent unit, and drawing dimensions arrive in millimetres. A frustum calculated in millimetres gives cubic millimetres, which divide by 10⁶ for litres: TK-1's cone, from 600 mm to 50 mm radius over 400 mm, is π × 400 ÷ 3 × (600² + 600 × 50 + 50²) = 164,410,000 mm³, or 164.4 L. The danger is mixing units within one formula, the height in metres and the radii in millimetres, which gives a number that is wrong by a factor of a thousand and can look plausible if nobody expects a particular answer.

## Cone bottoms on vertical tanks

A cone bottom adds capacity below the shell, drains the tank, and costs more to make than a flat bottom: it must be rolled or pressed, and its seam to the shell is a circumferential weld at a change of direction. Shallower cones hold less and drain more slowly; steeper ones hold more and add height. The exercise shows the trade-off for TK-1.

The outlet size changes the cone's volume less than its depth does, but not negligibly. With the same 400 mm depth, a 50 mm outlet would make TK-1's cone hold about 157.3 L, and a 200 mm outlet about 180.1 L, against 164.4 L for the 100 mm outlet drawn. A change of outlet late in the design, to suit a different valve, should therefore be followed by a recalculation of the working capacity, not assumed to be harmless. The capacity block of Chapter 1 should be updated in the same revision as the outlet.

## Exercise: a steeper cone

The processor asks whether TK-1's cone could be steeper, 600 mm deep instead of 400 mm, with the same 1,200 mm top and 100 mm outlet. What does the cone hold, at what slope from the horizontal, how tall must the shell be for 1,800 L working with 150 mm freeboard, and what happens to the tank's overall height from outlet to top?

**Worked answer.** The steeper cone holds π × 0.6 ÷ 3 × (0.6² + 0.6 × 0.05 + 0.05²) = **0.2466 m³**, about 82 L more than the 400 mm cone. Its wall falls 600 mm over 550 mm, about **47.5°** from the horizontal.

The shell must hold 1.800 − 0.2466 = 1.5534 m³ below the maximum level, a liquid height of 1.5534 ÷ 1.1310 = 1.3735 m, so with freeboard the shell is about **1,523 mm**, against Chapter 1's 1,596 mm. The overall height from outlet to top becomes 0.600 + 1.523 = about **2,123 mm**, against 0.400 + 1.596 = 1,996 mm: about 127 mm taller. The steeper cone drains faster and shortens the shell, but makes the tank taller overall, because a cone holds only a third of the cylinder of the same height. Whether that suits the processor depends on the headroom and on how quickly the tank must empty.
