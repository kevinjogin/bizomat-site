---
book: springs-by-the-numbers
chapterSlug: torsion-bars-and-flat-springs
order: 9
title: "Torsion bars and flat springs"
description: "How to size a torsion bar for stress and twist and balance a heavy panel with it, and how to check flat cantilever springs, with their limits at the ends and in large deflection."
draft: false
---

Not every spring is coiled. A straight round bar twisted about its own axis is a spring, and so is a flat strip bent as a cantilever. Both are simple to analyse, because their stress and deflection come straight from the beam and shaft formulas that every engineer learns first. They are used where a coil would not fit, or would be needlessly complicated: torsion bars along the hinge lines of heavy doors and in vehicle suspensions, flat springs as contacts, clips, wipers and hold-downs.

This chapter sizes the torsion bar that balances the VM-8's rear service panel with the BIZOMAT torsion bar tools, follows its balance through the panel's opening, and checks the flat spring wipers on the machine's way covers with the flat and leaf spring tool. Its mistake is a bar from another machine that looked identical and was 100 mm longer where it mattered.

## The rear service panel

At the back of the VM-8's enclosure, a steel panel gives access to the coolant tank, the chip conveyor drive and the hydraulic unit. It is hinged at its bottom edge and swings down and outwards through 90°, from upright when shut to horizontal when open, where two stays hold it. It weighs 45 kg and its centre of gravity is 400 mm from the hinge. Its handle, at the top edge, is 800 mm from the hinge. This is an illustration.

Shut, the panel's weight acts through its hinge and needs no holding. As it opens, its weight torque grows with the sine of the angle from upright, to 45 × 9.807 × 0.4 = 176.5 N·m when it is horizontal. Without help, an operator lowering it would have to hold back 176.5 ÷ 0.8 = 221 N at the handle near the bottom of its travel. The machine maker's answer is a torsion bar along the hinge line: anchored to the frame at one end and to the panel at the other, untwisted with the panel shut, and twisted up as it opens.

## A bar in torsion

```figure
type: formula
title: Solid round torsion bar
formula: τ = 16 T ÷ (π d³)
formula: θ = T L ÷ (G J),  J = π d⁴ ÷ 32
formula: Rate = G J ÷ L,  energy U = ½ T θ
caption: T is the torque, d the bar diameter, L its active length between the end fittings, and G the shear modulus. The stress is greatest at the surface. The twist is proportional to the active length, so a longer bar of the same diameter gives the same torque from more twist at the same stress.
- τ | surface shear stress
- θ | twist, radians
- J | polar second moment of area
```

The design question is a pair of limits. The stress must stay below the allowable at the largest torque, which sets a smallest diameter. And the bar must reach that torque within the twist the geometry gives it, here 90°, which sets the diameter for a given length. The larger of the two governs.

The [torsion bar spring design tool](/tools/torsion-bar-design/) takes the load and its arm, the active bar length, the shear modulus, the allowable shear stress, the largest twist allowed and a chosen diameter. It returns the torque, the least diameter for the stress and the least for the twist, the governing diameter, and for the chosen bar the shear stress, twist, torsional rate, the travel at the arm tip along its arc, and the energy stored. It treats a solid round bar under static load and reminds the user that splined or hexagon ends need their own check.

```figure
type: steps
title: The rear panel's torsion bar in the torsion bar design tool
caption: This is an illustration. 441.3 N at 400 mm (the panel's weight at its centre of gravity, horizontal), active length 1,200 mm, G = 79.3 GPa, allowable 650 MPa, largest twist 90°, bar chosen 11.5 mm.
- Torque | 176.5 N·m
- Diameter for stress / for twist | 11.14 / 11.47 mm
- * Diameter needed | 11.47 mm: twist governs
- Shear stress, 11.5 mm bar | 591 MPa
- Twist, 11.5 mm bar | 89.13°
- Rate | 1.980 N·m/°
- Arm-tip travel | 622.3 mm
- Energy stored | 137.3 J: BAR ADEQUATE
```

The allowable of 650 MPa is the shop's figure for a hardened and tempered alloy spring steel bar in static duty. This is an illustration; the bar's maker gives the figure for the actual steel and treatment. The panel opens a few times a week, so fatigue is not the limit.

The twist governs: a bar thick enough for the stress, 11.14 mm, would be too stiff to give 176.5 N·m within 90° unless it were longer. An 11.5 mm bar reaches the full torque at 89.13°, so with the panel horizontal it carries the panel's whole weight torque, at 591 MPa.

The [torsion bar spring check](/tools/torsion-bar/) gives the same figures from the bar's diameter, length, modulus, load, arm and allowable, without the sizing: a torque of 176.52 N·m, a twist of 89.13°, a rate of 1.980 N·m per degree, an arm-tip deflection of 622.3 mm and a shear stress of 591 MPa. The shop used it to check the bar that came out of the machine.

## Balancing the panel

Like the hatch in Chapter 8, the panel's weight torque follows a curve and the bar's torque a straight line. The bar matches the panel at the two ends of its travel, shut and open, and not in between.

```figure
type: compare
title: Rear panel weight torque against bar torque
cols: Panel torque, N·m | Bar torque, N·m | Difference, N·m | Handle force, N
rowhead: Angle from upright
- 0°, shut | 0.0 | 0.0 | 0.0 | 0
- 15° | 45.7 | 29.7 | 16.0 | 20.0
- 30° | 88.3 | 59.4 | 28.8 | 36.1
- 45° | 124.8 | 89.1 | 35.7 | 44.6
- * 50° | 135.2 | 99.0 | 36.2 | 45.3
- 60° | 152.9 | 118.8 | 34.0 | 42.6
- 75° | 170.5 | 148.5 | 22.0 | 27.5
- 90°, open | 176.5 | 178.2 | −1.7 | panel just held up
caption: This is an illustration. Panel 45 kg at 400 mm; bar 11.5 mm × 1,200 mm, 1.980 N·m/°. The operator holds back the difference at the 800 mm handle. The largest is 45 N, near halfway, within the shop's 50 N limit.
```

The largest out-of-balance comes where the slope of the panel's torque curve equals the bar's rate, about 50° from upright, and is 36.2 N·m, or 45 N at the handle. Without the bar the operator would hold up to 221 N. The bar cannot do better with a straight-line torque from zero; linkages that change the bar's lever arm with angle can follow a sine more closely, and some vehicle tailgates use them.

### The ends

The tool's checks end with a reminder about the end fittings. A torsion bar must be gripped at both ends, usually by hexagons or splines forged or machined on the bar, and the transition from the end to the plain bar is where the stress concentrates. The ends are made larger than the bar, with generous fillet radii, and the active length is measured between the transitions. The VM-8's bar has 14 mm hexagon ends with 50 mm long transitions, and an overall length of 1,300 mm for an active length of 1,200 mm. This is an illustration.

### Where the energy goes

Lowering the panel from upright to horizontal drops its centre of gravity by 0.4 m, releasing 45 × 9.807 × 0.4 = 176.5 J. The bar stores 137.3 J of that as it twists, and the rest, about 39 J, is taken by the operator's hand and by friction in the hinge as the panel is lowered under control. Raising it again, the bar returns its 137.3 J and the operator supplies the other 39 J or so. A counterbalance cannot remove the work of lifting; it can only store most of it on the way down and give it back on the way up.

### Releasing the bar

With the panel open, the bar holds 137.3 J, and an anchor removed in that state lets the panel's end of the bar spin back through 89° with a 14 mm hexagon on it. The shop's procedure removes and fits the bar only with the panel shut, where the bar is untwisted and holds nothing, and the panel is propped so it cannot fall open while the bar is out.

### Handed bars

Highly stressed torsion bars, such as those in vehicle suspensions, are often preset in manufacture: twisted beyond their working angle in the direction they will be loaded, so that the surface yields slightly and is left with residual stresses that oppose the working stress. A preset bar carries more torque in its working direction than an unset one, but less in the other. Such bars are marked left and right, and a bar fitted on the wrong side, or turned end for end so that it twists the other way, loses the benefit and may take a set or fail early.

The VM-8's panel bar works well below the stresses where presetting is needed, but the shop checked whether it was marked, and recorded the direction of twist on its drawing in any case: with the panel opening, the panel end of the bar turns clockwise when viewed from the panel's hinge side. An unset bar works the same whichever way it is twisted, so the direction only matters for a preset one; but a preset bar fitted the wrong way round would look and work normally until it took a set or failed, which is why the record is kept.

## The mistake: a bar from the wrong machine

The bar in the VM-8 when it arrived was not the original. A previous repairer had fitted a bar from a larger model of the same machine family, with the same 11.5 mm diameter and 14 mm hexagons, which fitted the same anchors. Operators said the panel had always been heavy to close.

The shop measured it: 1,400 mm overall and 1,300 mm active, against 1,200 mm active for the correct bar. A longer bar of the same diameter is softer.

```figure
type: compare
title: The correct bar and the fitted bar
cols: Rate, N·m/° | Torque at 90°, N·m | Largest out-of-balance, N·m | Handle force, N
rowhead: Bar, 11.5 mm diameter
- * 1,200 mm active, correct | 1.980 | 178.2 | 36.2 near 50° | 45
- 1,300 mm active, fitted | 1.828 | 164.5 | 44.1 near 54° | 55
caption: This is an illustration. Same panel, same anchors. The longer bar falls 12 N·m short of balancing the panel when open and needs 55 N at the handle, over the shop's 50 N limit.
```

The torsion bar check, with a length of 1,300 mm, gives a rate of 1.828 N·m per degree and a twist of 96.6° to carry the panel's full 176.5 N·m: more than the 90° the panel can give it. The panel was never fully balanced open, and at its worst it needed 55 N to control. The correct bar was ordered by part number, and its active length was added to the shop's records so the next repair would not depend on appearance.

## Flat springs

The VM-8's telescopic way covers, the steel plates that slide over each other to protect the machine's guideways, have wiper lips at the end of each section. Each lip is pressed against the next plate by a flat spring steel strip, a simple cantilever clamped at one end. The strips are 25 mm wide, 0.4 mm thick and 35 mm long from the clamp to the lip, and are set to deflect about 2 mm to press the lip with 4 N. This is an illustration.

```figure
type: formula
title: Flat cantilever spring
formula: σ = 6 F L ÷ (b t²)
formula: δ = 4 F L³ ÷ (E b t³)
caption: F is the load at the free end, L the length from the clamp, b the width and t the thickness. The stress is largest at the clamp. The formulas assume small deflections, under about a third of the length.
- σ | bending stress at the clamp
- δ | deflection at the free end
```

The [flat and leaf spring tool](/tools/leaf-spring/) takes the spring type (single flat cantilever, graduated multi-leaf cantilever, or semi-elliptic leaf spring loaded at the centre), the load, the length, the width, the leaf thickness, the number of leaves, the modulus and an allowable bending stress. It returns the deflection, the rate, the largest bending stress and the ratio of deflection to length, with a warning when the deflection is too large for the linear formulas. It ignores friction between leaves and the effect of clamp bolts.

```figure
type: steps
title: A way cover wiper strip in the flat and leaf spring tool
caption: This is an illustration. Single flat cantilever, 4 N, 35 mm long, 25 mm wide, 0.4 mm thick, E = 207 GPa, allowable 900 MPa.
- Deflection | 2.071 mm
- Spring rate | 1.931 N/mm
- * Bending stress | 210 MPa: STRESS WITHIN ALLOWABLE
- Deflection ÷ length | 0.059: small deflection
```

The strip works at less than a quarter of its allowable. What matters more for a wiper is the force, because it sets both how well the lip wipes and how fast it wears, and the force depends on the cube of the thickness.

### Thin strip, large effect

When the shop reordered strip for the rebuild, the supplier delivered 0.5 mm instead of 0.4 mm, as the nearest stocked size. Fitted with the same 2.07 mm set, each wiper pressed with 7.8 N instead of 4 N, because the rate rises by (0.5 ÷ 0.4)³ = 1.95 times. The lips would have worn about twice as fast, and the extra drag would have added load to the axis drives at every move. The tool, entered with 0.5 mm, gives a rate of 3.772 N/mm. The 0.5 mm strip was returned, and the strip thickness was added to the parts list with a tolerance.

### Leaf springs

The same tool handles two other forms. A graduated multi-leaf cantilever stacks leaves of decreasing length so that the stack is deepest at the clamp, where the bending moment is largest; for a given load it approaches a beam of uniform strength, with the same stress all along its length, and its formulas are those of a triangular plate. A semi-elliptic leaf spring, the familiar vehicle spring, is two such cantilevers back to back, supported at its ends and loaded at its centre. The [semi-elliptic leaf spring design tool](/tools/leaf-spring-design/) sizes the number of leaves for stress and deflection.

Real leaf springs are stiffer than the formulas say and show hysteresis, because the leaves rub on each other as they bend. That friction damps vehicle suspensions usefully and makes the spring's rate uncertain by several per cent, so leaf springs for a particular duty are usually tested rather than trusted to the formula. The VM-8 has no leaf springs; the wipers are single strips.

## Exercise: a shorter wiper

On one section of the way cover, the space allows only a 30 mm strip. Using the same 0.4 mm × 25 mm strip and the same 4 N lip force, find the deflection, rate and stress. What set must the fitter give it, and is it still within the small-deflection range?

### Worked answer

The stress is 6 × 4 × 30 ÷ (25 × 0.4²) = 180 MPa. The deflection is 4 × 4 × 30³ ÷ (207,000 × 25 × 0.4³) = 432,000 ÷ 331,200 = 1.304 mm, so the rate is 4 ÷ 1.304 = 3.067 N/mm.

The fitter must set the strip to deflect 1.3 mm instead of 2.07 mm for the same force. The ratio of deflection to length is 1.304 ÷ 30 = 0.043, well within the small-deflection range. The flat and leaf spring tool gives the same: a deflection of 1.304 mm, a rate of 3.067 N/mm and a stress of 180 MPa. Because the shorter strip is stiffer, an error of 0.3 mm in its set changes the lip force by 0.9 N, against 0.6 N for the longer strip, so the shop sets the shorter strips with a feeler gauge rather than by eye.
