---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: buckling-oil-canning-and-heat
order: 3
title: "Buckling, oil-canning and a few degrees of heat"
description: "See how small a compressive stress buckles a thin panel, why a degree of temperature difference can do it, how big the buckle gets, and catch an afternoon buckle blamed on the folder."
draft: false
---

A thin panel can fail without any load pressing on its face at all. Squeeze it gently in its own plane and, at a remarkably small stress, it stops shortening and bows sideways instead. That is buckling, and in sheet metal panels it appears as the wavy, pillowed look of a large flat cover, the shallow dents that come and go as the sun moves, and the sudden bang of oil-canning when a slightly bowed panel is pushed through flat.

This chapter puts numbers on all three. It calculates the stress at which SP-90 buckles, shows how a temperature difference of a fraction of a degree reaches it, estimates how big the resulting buckle is, and explains why stiffening a panel reduces the buckle's size even when it cannot prevent the buckle. It closes with an afternoon buckle that was blamed on the wrong supplier.

## The critical stress of a plate

A flat plate under compression in its own plane stays flat until the compressive stress reaches a critical value, then buckles into waves. For a plate with simply supported edges, compressed on two opposite edges, the classical result is:

```figure
type: formula
title: Critical buckling stress of a simply supported plate
formula: σcr = k π² E / (12 (1 − ν²)) × (t / b)²
caption: Timoshenko and Gere. b is the width of the loaded edge, the dimension across which the plate buckles into one half-wave. For a long plate in uniaxial compression with all edges simply supported, k = 4.
- σcr | Critical compressive stress, MPa
- k | Buckling coefficient, 4 for a long simply supported plate
- E, ν | 200,000 MPa and 0.3 for steel
- t | Sheet thickness, 1.2 mm
- b | Loaded width, mm
```

The striking term is (t / b)². For SP-90, t / b = 1.2 / 600 = 0.002, and its square is 0.000004. Multiply that by the rest of the formula and the critical stress for compression along the panel's 900 mm height is:

σcr = 4 × π² × 200,000 / (12 × 0.91) × 0.000004 = **2.89 MPa**.

Welding Distortion by the Numbers applies the same formula to [thin panels between welded stiffeners](/reados/publications/welding-distortion-by-the-numbers/buckling-of-thin-plate/); this chapter applies it to a screwed panel and to heat. Two point nine megapascals is about one-ninetieth of the yield stress of ordinary structural sheet. The panel buckles long before the steel is stressed in any sense that matters for strength. Thickness and bay width both enter squared, so 1.6 mm sheet raises the critical stress to 5.14 MPa, 2.0 mm to 8.03 MPa, and halving the bay width to 300 mm raises it four times, to 11.6 MPa.

```figure
type: bars
title: Critical stress for uniaxial buckling, simply supported, k = 4
unit: MPa
max: 12
caption: This is an illustration. Each value is for a long plate whose loaded width is shown. Compare with a yield stress of a few hundred megapascals: thin panels buckle at a tiny fraction of their strength.
- *1.2 mm, 600 mm wide (SP-90) | 2.89
- 1.6 mm, 600 mm wide | 5.14
- 2.0 mm, 600 mm wide | 8.03
- 1.2 mm, 300 mm wide | 11.57
```

### Compression from two directions

When a panel is restrained on all four edges and warms up, it is compressed in both directions at once. For that case, with equal stress in both directions and the plate buckling into a single bulge, the critical stress is σcr = (π² D / t) × (1/a² + 1/b²). For SP-90 that gives:

σcr = π² × 31,648 / 1.2 × (1/600² + 1/900²) = **1.04 MPa**.

Biaxial compression is worse than uniaxial because each direction's compression helps the other's buckle along. SP-90, held on all four edges, buckles at about one megapascal.

## How little heat it takes

A steel panel that warms by ΔT but is prevented from expanding develops a compressive stress. If it is restrained in one direction, the stress is E α ΔT. If it is restrained in both, which is the case for a panel screwed all round to a frame that stays cooler, the stress is E α ΔT / (1 − ν). Taking α as about 12 × 10⁻⁶ per °C, a typical value for carbon steel:

- uniaxial buckling at 2.89 MPa needs ΔT = 2.89 / (200,000 × 0.000012) = **1.2 °C**;
- biaxial buckling at 1.04 MPa needs ΔT = 1.04 × 0.7 / 2.4 = **0.3 °C**.

A third of a degree. If SP-90 were held perfectly rigidly on all four edges, warming it by the heat of a hand would buckle it. Real frames are not perfectly rigid, they expand too, and screws in clearance holes let the sheet slip a little, which is why most panels do not buckle constantly. But the margin is small, and any real temperature difference between panel and frame, such as sun on the panel and shade on the frame, or a hot motor near one panel, uses it up many times over. A 10 °C difference produces a biaxial stress of 34.3 MPa, thirty-three times what is needed.

The same arithmetic applies to anything else that leaves a panel slightly too large for its frame. A panel cut 0.1 mm too long for a rigid 900 mm opening is compressed by 200,000 × 0.1 / 900 = 22.2 MPa when forced in, nearly eight times the uniaxial critical stress. Welding a panel to its frame, or welding studs to it, leaves shrinkage stresses of the same order or larger. [Welding Distortion by the Numbers](/reados/publications/welding-distortion-by-the-numbers/) deals with weld shrinkage in detail; here the point is that a thin panel is almost always loaded past its critical stress by something, and the question is how big the resulting buckle is.

## How big is the buckle?

Once a panel buckles, its extra length goes into a wave. A useful estimate of the wave's height comes from geometry alone. A half-sine wave of height w₀ over a length λ is longer than its chord by about π² w₀² / (4 λ). If the panel has an excess length of λ α ΔT to lose over that length, setting the two equal gives:

```figure
type: formula
title: Estimated height of a thermal buckle
formula: w₀ ≈ (2 / π) λ √(α ΔT)
caption: This is an illustration. A geometric estimate that ignores the small elastic shortening before buckling, so it slightly overstates the height. λ is the length of one half-wave, roughly the width of the bay that buckles.
- w₀ | Height of the buckle, mm
- λ | Half-wavelength, roughly the bay width, mm
- α | Coefficient of thermal expansion, about 12 × 10⁻⁶ per °C
- ΔT | Temperature of panel above frame, °C
step: For SP-90 buckling across its 600 mm width with ΔT = 10 °C: √(0.00012) = 0.01095
step: w₀ ≈ 0.637 × 600 × 0.01095 = 4.2 mm
```

The estimate was checked numerically: a half-sine wave 4.18 mm high over 600 mm is 0.0718 mm longer than its chord, against a thermal excess of 0.0720 mm. The formula's key message is that **buckle height is proportional to bay size**. A panel cannot be made stiff enough to stop a 10 °C difference buckling it, but it can be divided into bays small enough that the buckle is too shallow to see.

```figure
type: compare
title: Estimated buckle height for a 10 °C panel-to-frame difference
cols: Half-wavelength | Buckle height | Visible on a painted panel?
caption: This is an illustration using the geometric estimate above, with full restraint. Slip at the screws reduces all of these. The builder's working limit for "no visible buckling" is 2 mm.
- Whole SP-90, buckling along 900 mm | 900 mm | 6.3 mm | Yes, clearly
- *Whole SP-90, buckling across 600 mm | 600 mm | 4.2 mm | Yes
- Bays 300 mm wide | 300 mm | 2.1 mm | Borderline
- Bays 225 mm wide | 225 mm | 1.6 mm | No
- Bays 150 mm wide | 150 mm | 1.0 mm | No
```

This is an illustration. The builder turned the target "no visible buckling with a 10 °C difference" into a number: an estimated buckle no higher than 2 mm. Under the estimate, that means no bay wider than about 290 mm. Chapter 7's three stiffeners, which create bays 225 mm high, meet it with margin; a single stiffener down the middle, creating 300 mm bays, does not quite.

## Oil-canning

Oil-canning is buckling with an audience. A panel with a slight initial bow, or with residual stresses that have already buckled it gently, has two stable shapes, bowed in and bowed out. Push it at the centre and it resists, then snaps through to the other shape with a bang, and stays there until pushed back. The name comes from the base of an old oil can, which was made to do exactly that.

The size of the snap is governed by the same geometry as the thermal buckle: the panel's excess length relative to its frame, spread over a bay. A panel with a large excess length over a large bay has a deep snap that hands find easily. A panel with the same excess spread over small bays snaps by a fraction of a millimetre, which nobody notices, or not at all, because each small bay is stiff enough to resist the push.

### What makes a panel snap

Three conditions make oil-canning likely, and SP-90 had all of them:

1. **A large, flat, thin bay.** Large bays have low critical stresses and large buckle heights.
2. **Compressive residual stress.** Folding the return flanges, cutting with a laser that heats the edges, punching holes near the edge and screwing the panel down tightly on a frame that is slightly out of flat all leave the sheet slightly compressed somewhere.
3. **Loads that push both ways.** Suction pulls the panel in; hands push it in; pressure reversal when a door opens pushes it out.

The cures are the same as for thermal buckling: smaller bays, curvature, or both. A panel with a deliberate crown, even a few millimetres, has only one stable shape under pressure from its convex side and resists a push with geometric stiffness. Beads and stiffeners do the same thing by dividing the panel. Chapter 6 discusses crowns and cross-breaks alongside beads.

## The error: the afternoon buckle

This is an illustration. Shortly after the first enclosures were delivered, one customer reported that SP-90 on a machine near a west-facing window developed a visible pillowed bulge every afternoon, which disappeared overnight. The builder's first assumption was that the folding supplier had distorted the panel, and the supplier was asked to check its flatness. The returned panel measured flat within 1 mm on a surface table, and the supplier pointed out, fairly, that a distorted panel does not fix itself overnight.

The builder's designer visited the site in the afternoon with an infrared thermometer. The sunlit panel measured 34 °C; the frame behind it, shaded by the panel itself, measured 27 °C. A 7 °C difference gives a biaxial restraint stress of 24.0 MPa, about twenty-three times SP-90's biaxial critical stress, and the geometric estimate gives a buckle about 3.5 mm high across the 600 mm width. The designer measured 3 mm with a straightedge and feeler gauge, close to the estimate given that the screws allowed some slip.

The diagnosis took a temperature reading, not a flatness check, because the cause was thermal, not geometric. The immediate fix for that customer was a reflective film on the window. The permanent fix was the redesign: the target for thermal buckling was written into the SP-90 requirements, and the stiffener layout of Chapter 7 was chosen partly to meet it. The builder also changed the screw holes in the panel from a close clearance to 1 mm oversize, so that the panel can slide a little relative to the frame as it warms. At 0.072 mm of thermal expansion across 600 mm for a 10 °C difference, the movement needed is tiny, but a tightly fitting screw can still prevent it.

### Reading a buckle's cause from its pattern

A buckle's shape often says where its compression came from, which is useful before anyone is blamed:

- **One broad bulge over the whole bay** that grows and shrinks during the day points to a temperature difference between panel and frame.
- **A wave along one edge only**, with the middle flat, points to a stretched edge, such as an edge heated by laser cutting or welding, or a flange folded with too much pressure. The edge is too long for the panel and ripples.
- **A pillow in the middle with flat edges** points to the opposite: a middle that is too long for its edges, as happens when a panel is hammered, rolled unevenly or stretched while flattening.
- **A buckle that appears only when the screws are tightened** points to a frame that is out of flat, so that tightening forces the sheet to a shape it does not fit.

Each has a different cure, and none of them is cured by thicker sheet alone. Marking the pattern on a sketch, with the time of day and the temperatures, takes a few minutes and saves an argument with a supplier.

## Designing for stability

Pulling the chapter together, a thin panel's stability is improved by:

- **dividing it into smaller bays**, which raises the critical stress with the square of the bay width and reduces the buckle height in proportion to it;
- **curving it**, with a crown, cross-break or rolled bead, which turns a bistable flat panel into a stable shell;
- **letting it move**, with oversize or slotted holes and no more fastener torque than needed, so that differential expansion becomes movement instead of stress;
- **reducing residual stress**, by cutting and folding sequences that do not stretch the panel's middle, by avoiding welds on the panel face, and by choosing fastenings that do not pull a panel down onto an uneven frame.

Thicker sheet helps too, but slowly: going from 1.2 to 2.0 mm raises the critical stress less than three times, and does not change the geometric estimate of buckle height at all, because w₀ depends on the bay size and the temperature difference, not on thickness. That surprising result is worth stating plainly. Once a panel has buckled, thickness does not make the buckle smaller. Only smaller bays, curvature or freedom to move do.

## Exercise: the motor-side panel

The panel on the motor side of the enclosure runs warmer than the frame by up to 20 °C when the motor works hard. The builder proposes the same three-stiffener layout as SP-90, with bays 225 mm high and 600 mm wide.

1. Estimate the buckle height in one bay for ΔT = 20 °C, assuming the buckle forms across the 225 mm bay.
2. Does it meet the builder's 2 mm limit? If not, what bay size would?

**Worked answer.**

1. √(12 × 10⁻⁶ × 20) = √0.00024 = 0.01549. Then w₀ ≈ 0.637 × 225 × 0.01549 = **2.2 mm**.
2. It does not quite meet the 2 mm limit. Solving 0.637 × λ × 0.01549 = 2 gives λ = **203 mm**, so bays about 200 mm high would meet it under full restraint, which would mean four stiffeners instead of three. Before adding a stiffener, the designer should note that the estimate assumes no slip at the screws, and that the motor side could instead be given oversize holes and a heat shield, or an air gap between motor and panel. The cheapest fix is often to reduce ΔT rather than to stiffen against it. A 20 °C difference is also worth investigating in its own right, since it may indicate that the motor needs more cooling air.
