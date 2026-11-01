---
book: metal-fatigue-by-the-numbers
chapterSlug: shafts
order: 7
title: "Shafts under bending and torque"
description: "Sizing a shaft for combined bending and torque, then checking its shoulder and keyway for fatigue with von Mises alternating and mean stresses, and the error of counting torsion twice."
draft: false
---

Shafts are the classic fatigue problem. A turning shaft under a steady side load sees a fully reversed bending stress on every revolution, so a machine running for years puts hundreds of millions of cycles into every shoulder, groove and keyway. Most shafts also carry torque, which adds a stress that is usually steady. The two have to be combined properly, at the right points, with the right factors.

This chapter sizes the PK-20 camshaft with a quick rule, then checks its shoulder fillet and its keyway for fatigue under combined bending and torque. It shows why the builder chose a ground fillet instead of a larger shaft, and how a spreadsheet that counted the torsion factor twice nearly made the shaft bigger for nothing.

## Where shafts crack

Shaft fatigue cracks start at a short list of places, and a check that misses one of them misses the failure.

- **Shoulders** where the diameter steps, especially beside bearings and gears, where the bending moment is high and the fillet must be small to clear the mating part.
- **Keyways**, particularly the sharp ends of end-milled keyways, and the edges of the hub that sits over them.
- **Press-fitted hubs and bearing races**, where the shaft surface rubs against the hub by a few micrometres on every revolution and fretting starts cracks at stresses far below the plain endurance limit.
- **Retaining ring grooves**, which are deep and sharp and among the worst notches on any shaft.
- **Threads** at shaft ends, cross-holes for pins and oil, and splines.

The check is made at each such place along the shaft, with the bending moment and torque at that point. A bending moment diagram for the shaft, with the notches marked on it, is the first page of any shaft fatigue calculation.

```figure
type: compare
title: Critical points on the PK-20 camshaft
cols: Bending moment, N·m | Torque, N·m | Notch
rowhead: Point
- * Follower-side bearing shoulder | 260 | 100 | 2 mm fillet, D ÷ d = 1.2
- Cam seat keyway | 90 | 100 | end-milled keyway, 0.5 mm corner radius
- Drive-side bearing shoulder | 60 | 100 | 2 mm fillet
- Drive sprocket keyway | 0 (sprocket between the bearings) | 100 | keyway, torque only
caption: This is an illustration. Moments from the shaft's bending moment diagram under the follower load. The follower-side shoulder carries the largest moment and the highest stress concentration together.
```

## A first size

Before any notch is drawn, the shaft needs a first diameter. A long-established rule, used in older shaft design codes and handbooks, combines bending and torsion into an equivalent torque by the maximum shear stress theory, with factors for shock and fatigue, and sizes the shaft so that the shear stress from that equivalent torque stays below an allowable value.

```figure
type: formula
title: First shaft size by the equivalent torque rule
formula: Te = √[(Km M)² + (Kt T)²]
formula: d = ∛[16 Te ÷ (π τallow)]
caption: Km and Kt are shock and fatigue factors for bending and torsion; for a rotating shaft with a steadily applied load, values around 1.5 and 1.0 are commonly used. The allowable shear stress is often taken as the lesser of 0.3 Sy and 0.18 Su, reduced by a quarter where there is a keyway. This rule gives a first size, not a fatigue check.
- M, T | bending moment and torque at the section
- Km, Kt | shock and fatigue factors for bending and torsion
- τallow | allowable shear stress
- d | required solid shaft diameter
```

The [shaft diameter for bending and torsion](/tools/shaft-diameter/) tool applies that rule. It takes the bending moment, the torque, the two factors, an allowable shear stress and whether there is a keyway (which multiplies the allowable stress by 0.75), and returns the required solid diameter, the equivalent torque and, for an entered diameter, the shear stress in it.

```figure
type: steps
title: The PK-20 camshaft in the shaft diameter tool
caption: This is an illustration. M = 260 N·m, T = 100 N·m, Km = 1.5, Kt = 1.0, allowable shear the lesser of 0.3 × 700 = 210 and 0.18 × 900 = 162 MPa, keyway at the section.
- Equivalent torque | √[(1.5 × 260)² + (1.0 × 100)²] = 402.6 N·m
- Allowable shear with the keyway factor | 0.75 × 162 = 121.5 MPa
- * Required diameter | 25.65 mm
- Shear stress in a 30 mm shaft | 75.9 MPa: DIAMETER ADEQUATE
```

The rule says 26 mm would do. The PK-16 shaft was 30 mm at the same point, and it cracked. The rule's factors were set for ordinary keyed shafts with ordinary fillets; they cannot know that the PK-16's fillet was 0.5 mm, or that its load was close to the endurance limit for part of every week. The rule is useful for a first size and for comparing designs. The fatigue check at each notch is what decides.

The order matters: a shaft's diameter is often fixed early by bearings and hubs bought from catalogues, so the fatigue check at the notches is best done while fillets, finishes and the positions of keyways can still change at no cost.

## Combining bending and torsion for fatigue

At the follower-side shoulder the shaft carries a fully reversed bending stress and a steady shear stress. For a ductile steel, the widely used method, described in Shigley's and other texts, is:

1. Split each stress into its alternating and mean parts, with its own fatigue notch factor: Kf for bending, Kfs for torsion.
2. Combine the alternating parts into a von Mises alternating stress, and the mean parts into a von Mises mean stress.
3. Use those two in the Goodman check against the corrected endurance limit, with kc = 1, because the von Mises combination has already accounted for the shear.

```figure
type: formula
title: Von Mises alternating and mean stresses for bending and torsion
formula: σ′a = √[(Kf σa)² + 3 (Kfs τa)²]
formula: σ′m = √[(Kf σm)² + 3 (Kfs τm)²]
caption: σa, σm are the nominal alternating and mean bending stresses; τa, τm the nominal alternating and mean torsional shear stresses. With rotating bending and steady torque, σm = 0 and τa = 0, so σ′a = Kf σa and σ′m = √3 Kfs τm.
- Kf | fatigue notch factor in bending
- Kfs | fatigue notch factor in torsion
- σ′a, σ′m | von Mises alternating and mean stresses for the Goodman check
```

### The shoulder

From Chapter 4, the 2 mm fillet's bending notch factor is Kf = 1.662. The designer read Kts = 1.4 for torsion at the same fillet, and with the same notch sensitivity, q = 0.946, Kfs = 1 + 0.946 × 0.4 = 1.378. This is an illustration.

The nominal bending stress is 98.1 MPa fully reversed and the nominal torsional shear stress is 18.9 MPa steady (Chapter 2). So σ′a = 1.662 × 98.1 = 163.1 MPa and σ′m = √3 × 1.378 × 18.9 = 45.0 MPa.

Entered in the [Goodman fatigue safety factor](/tools/goodman-fatigue/) tool with the turned fillet's endurance limit of 250.5 MPa, these give a Goodman factor of 1.43. The bending-only check of Chapter 4 gave 1.54; the steady torque has cost about 7%, and the shaft now falls short of the builder's 1.5.

```figure
type: compare
title: The PK-20 shoulder with combined bending and torque, in the Goodman fatigue tool
cols: Corrected endurance limit, MPa | Goodman factor | First-cycle yield factor | Against 1.5
rowhead: Fillet finish
- Turned, bending only (Chapter 4) | 250.5 | 1.54 | 4.29 | passes, but torque left out
- Turned, bending and torque | 250.5 | 1.43 | 3.36 | INADEQUATE
- * Ground, bending and torque | 298.3 | 1.68 | 3.36 | ADEQUATE
caption: This is an illustration. σ′a = 163.1 MPa, σ′m = 45.0 MPa, Su = 900 MPa, Sy = 700 MPa. Grinding the fillet raises the surface factor from 0.744 to 0.886.
```

### Grinding or a bigger shaft

Two fixes were on the table: a larger seat, or a ground fillet. A 31 mm seat would lift the turned fillet's Goodman factor to about 1.57. But the seat diameter is set by the bearing bore, and the bearings come in 30 and 35 mm bores, not 31. A 35 mm seat would mean larger bearings, a larger housing and a larger cam hub.

The seat is ground anyway, to give the bearing its fit. Extending the grinding through the fillet with a wheel dressed to the 2 mm radius costs a few minutes a shaft. It raises the surface factor from 0.744 to 0.886 and the Goodman factor from 1.43 to 1.68. The builder chose grinding, and the drawing now calls up the fillet as ground, with its roughness limit (Chapter 10).

## The keyway at the cam

The cam sits on a 30 mm seat with an end-milled keyway, where the bending moment is 90 N·m and the torque 100 N·m. The keyway's corners have a 0.5 mm radius. The designer read Kt = 2.2 in bending and Kts = 3.0 in torsion for the keyway's corner. This is an illustration. With q = 0.815 for 0.5 mm, Kf = 1 + 0.815 × 1.2 = 1.978 and Kfs = 1 + 0.815 × 2.0 = 2.630.

```figure
type: steps
title: Fatigue check of the PK-20 cam keyway
caption: This is an illustration. 30 mm seat, M = 90 N·m rotating, T = 100 N·m steady, turned keyway, Se = 250.5 MPa.
- Nominal bending stress | 90,000 ÷ 2,651 = 33.95 MPa, fully reversed
- Nominal torsional shear | 18.9 MPa, steady
- Von Mises alternating | 1.978 × 33.95 = 67.2 MPa
- Von Mises mean | √3 × 2.630 × 18.9 = 85.9 MPa
- * Goodman factor | 1 ÷ (67.2 ÷ 250.5 + 85.9 ÷ 900) = 2.75: ADEQUATE
```

The keyway has a much sharper notch than the shoulder but a third of the bending moment, and it passes comfortably. That is the result of putting it in the right place: the cam was moved, on the PK-20, to sit closer to the drive-side bearing, where the moment is lower. The torsion notch factor at a keyway is large, and on a shaft with a large alternating torque the keyway could govern.

## The error: counting torsion twice

The builder's first PK-20 shaft spreadsheet produced a frightening answer at the shoulder: a Goodman factor of 0.87. The design engineer proposed going to a 35 mm seat with larger bearings, at a cost of about A$180 including GST per machine in bearings, housing and cam. This is an illustration.

The checker traced the 0.87 to the endurance limit. The spreadsheet had applied a load factor kc = 0.59, the factor that converts a bending endurance limit into a torsional one, to the endurance limit used for the combined check. The corrected limit had become 0.59 × 250.5 = 147.8 MPa. But the von Mises combination already converts the shear stress into an equivalent normal stress, through the factor √3. Applying both counted the effect of torsion twice; and here, since the alternating stress was entirely from bending, the 0.59 should never have touched it at all.

```figure
type: compare
title: The double count, and the correct check
cols: Load factor kc | Corrected endurance limit, MPa | Goodman factor
rowhead: Method
- Von Mises stresses and kc = 0.59 (double count) | 0.59 | 147.8 | 0.87
- * Von Mises stresses and kc = 1 | 1 | 250.5 | 1.43
- Torsion alone, in shear, with kc = 0.59 | 0.59 | 147.8 in shear | used only for a pure torsion check
caption: This is an illustration. Turned fillet, σ′a = 163.1 MPa, σ′m = 45.0 MPa. Use kc = 0.59 only when comparing a shear stress with a torsional endurance limit, never with a von Mises equivalent stress.
```

The correct answer, 1.43, still fell short of 1.5, so the spreadsheet's alarm was right in direction but wrong in size; the fix was a ground fillet, not a larger shaft. The rule the builder wrote down is short: one method, applied consistently. Either check bending and torsion separately against their own endurance limits, or combine them by von Mises and use the bending endurance limit. Never both.

## The whole check in one tool

For a single notch carrying a uniaxial stress, the [fatigue design check](/tools/fatigue-design-check/) tool runs the whole chain: endurance limit estimate, correction factors, notch factor, alternating and mean stresses, Goodman, Soderberg and Gerber, yield and life. It treats the stress as uniaxial, so for the PK-20 shoulder it checks bending only, with the ground finish. Entering Su = 900, Sy = 700, factors 0.886, 0.862, 1, 1 and 0.868, Kt = 1.7, r = 2 mm, and nominal stresses of +98.1 and −98.1 MPa gives a corrected endurance limit of 298.3 MPa, Kf = 1.662 and a Goodman factor of 1.83. The torque's contribution is then added by the von Mises step above, giving 1.68.

## Choosing the steel

It is tempting to answer a fatigue problem by buying a stronger steel. The PK-20 file records why the builder did not. Moving from the 900 MPa alloy steel to a 1,100 MPa grade would raise the specimen endurance limit estimate from 450 to 550 MPa, a 22% gain. But the turned surface factor would fall from 0.744 to 0.705, and the notch sensitivity at the 2 mm fillet would rise from 0.946 to about 0.96. Allowing for both, the gain at the fillet shrinks to about 15% for a turned fillet, and it would come with a dearer bar, harder machining and a heat treatment that needs closer control.

The ground fillet, by comparison, gained 19% on the same steel for a few minutes' grinding. In fatigue, the surface and the notch are usually cheaper to improve than the material, and improving them also helps whatever steel is used. A stronger steel earns its place when the surface and notches are already as good as they can be, or when the static load, not fatigue, sets the size.

### Hollow shafts

A hollow shaft carries bending and torsion with less weight, because the material near the centre does little work. The section modulus of a tube with a bore of half its outside diameter is 94% of the solid bar's, for 75% of the weight. The fatigue check is the same, with the tube's section modulus; the bore surface is usually lightly stressed but must still be free of deep tool marks and corrosion, and the size factor is taken on the outside diameter. The PK-20's camshaft stays solid, because its diameter is set by the bearings and the weight saving would be small.

## A shaft check in order

```figure
type: checklist
title: The builder's shaft fatigue check, in order
caption: This is an illustration. Every PK-20 shaft goes through these steps; the file holds one sheet per critical point.
- x Bending moment and torque diagrams, with every notch marked
- x First diameter from the equivalent torque rule
- x At each notch: nominal alternating and mean stresses in bending and torsion, with signs
- x Kt from a named chart or analysis for each load type, then Kf and Kfs
- x Von Mises alternating and mean stresses; corrected endurance limit with kc = 1
- x Goodman and first-cycle yield factors against 1.5
- x Finite-life damage for jams and other occasional loads (Chapter 6)
- x Deflection, slope, critical speed and static overload
- ? Drawing notes: critical radii, ground finishes and their roughness limits
```

## Beyond fatigue

A shaft that passes its fatigue check can still fail in other ways, and the PK-20 file checks them too.

- **Deflection and slope.** The bearings need the shaft's slope at their seats to be within their limits, and the cam follower needs the cam to stay square.
- **Critical speed.** The camshaft turns at 40 rpm, far below any critical speed; a fast spindle would need the check described in Whirling Shafts by the Numbers.
- **Fretting at fits.** The cam hub is a light press fit and keyed; the fit is chosen so the hub does not rock on the shaft under the follower's load.
- **Static overload.** A jam with the torque limiter set too high could yield the shaft in torsion; the limiter's setting is checked against the shaft's static strength.

Each of these is a separate check with its own tools and its own record. The fatigue sheet for a shaft is not complete until it notes that they have been done, by whom, and where the results are filed; a shaft that passes fatigue and then fails by fretting under its cam hub has still failed.

## Exercise: a heavier carton erector

A PK-20 variant for corrugated cases needs a steady cam torque of 200 N·m with the same bending moment. Using the ground fillet figures (Kf = 1.662, Kfs = 1.378, Se = 298.3 MPa, Su = 900 MPa, Sy = 700 MPa), find the von Mises mean stress, the Goodman factor and the yield factor. Does the shaft still meet 1.5?

**Worked answer.** The nominal torsional shear doubles to 37.7 MPa, so the local mean shear is 1.378 × 37.7 = 52.0 MPa and the von Mises mean stress is √3 × 52.0 = 90.0 MPa. The alternating stress is unchanged at 163.1 MPa. Goodman: 1 ÷ n = 163.1 ÷ 298.3 + 90.0 ÷ 900 = 0.5468 + 0.1000 = 0.6468, so n = 1.55. Yield: n = 700 ÷ (163.1 + 90.0) = 2.77.

The shaft still meets 1.5, just. Doubling the torque cost only about 8% of the margin, because the mean stress has a small effect beside the alternating one when the tensile strength is high. If the variant also raised the bending moment, the margin would go quickly, and the shaft would need re-checking at every notch.
