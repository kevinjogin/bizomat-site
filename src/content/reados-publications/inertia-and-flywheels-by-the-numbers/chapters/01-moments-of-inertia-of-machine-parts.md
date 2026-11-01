---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: moments-of-inertia-of-machine-parts
order: 1
title: "Moments of inertia of machine parts"
description: "How to calculate the moment of inertia and radius of gyration of discs, rings, tubes, blocks and offset parts, and why the mass far from the axis is the mass that counts."
draft: false
---

Mass resists being pushed; moment of inertia resists being turned. For a body turning about an axis, every particle of it must be swung round a circle, and the further a particle is from the axis, the faster it moves and the harder it is to start and stop. The moment of inertia adds up each particle's mass times the square of its distance from the axis, and that square is the reason a thin saw blade can be harder to spin up than the heavy motor that drives it.

This chapter works out the moments of inertia of the DL-3 line's main rotating parts with the WORKOS mass moment of inertia tool and its companion for more shapes. It introduces the radius of gyration, the parallel-axis transfer and the thin-walled approximation, and shows how much each part of a rotor contributes. Its mistake is the most common error in inertia calculations: a diameter used where the formula wants a radius.

## What the moment of inertia measures

For a body turning about a fixed axis, the moment of inertia J is the sum of m r² over all its particles, in kilograms times metres squared. It plays the part that mass plays in straight-line motion: torque equals J times angular acceleration, as force equals mass times acceleration, and kinetic energy is half J ω², as it is half m v² for a moving mass.

The radius of gyration k is the radius at which the whole mass, concentrated in a thin ring, would have the same moment of inertia: J = m k². It is a useful single number for comparing shapes. A thin ring has k equal to its radius, because all its mass is at that radius. A solid disc has k = R ÷ √2, about 0.707 of its outer radius, because much of its mass is nearer the centre.

```figure
type: formula
title: Moments of inertia of common machine shapes, about their own axis
formula: Solid disc or cylinder: J = m D² ÷ 8
formula: Hollow cylinder or ring: J = m (D² + d²) ÷ 8
formula: Thin-walled tube or thin ring: J = m Dm² ÷ 4
formula: Parallel axis: J = Jc + m e²
caption: D is the outer diameter, d the inner diameter, Dm the mean diameter of a thin wall, and e the distance from the body's own axis to the axis it turns about. In diameter form the solid disc's formula has 8 below the line; written with the radius it is m R² ÷ 2. Mixing the two is the error this chapter's mistake describes.
- J | moment of inertia, kg·m²
- k | radius of gyration, √(J ÷ m)
- Jc | moment of inertia about the body's own centroidal axis
```

## The saw blade, arbor and flanges

The docking saw's blade is a steel plate 900 mm in diameter and 4 mm thick, with a 50 mm bore. Its mass is 7,850 × π × (0.45² − 0.025²) × 0.004 = 19.91 kg. The teeth add a little mass at the rim and the expansion slots remove a little, and for a first estimate both are ignored.

The [mass moment of inertia tool](/tools/mass-moment-inertia/) takes a body and axis, chosen from a solid cylinder or disc, a hollow cylinder, a solid cylinder about a central axis across it, a rectangular block, a solid sphere and a slender rod about one end; its mass; two dimensions; and an offset of the rotation axis from the body's centre. It returns the moment of inertia about the body's own axis, about the rotation axis by the parallel-axis transfer, and the radius of gyration. It assumes uniform density and the idealised shape, and reminds the user to confirm the shape against CAD mass properties for complex parts.

```figure
type: steps
title: The saw blade in the mass moment of inertia tool
caption: This is an illustration. Hollow cylinder, mass 19.914 kg, outer diameter 900 mm, inner diameter 50 mm, no offset.
- About the body axis | 2.0225 kg·m²
- * About the rotation axis | 2.0225 kg·m²
- Radius of gyration | 318.7 mm
```

Treated as a solid disc, ignoring the bore, the blade gives 2.0163 kg·m², 0.3% less: a 50 mm hole in a 900 mm plate removes mass where it contributes almost nothing. The radius of gyration, 318.7 mm, is 0.708 of the blade's 450 mm radius, as for any thin solid disc.

The arbor, a 50 mm steel shaft 600 mm long, has a mass of 9.25 kg but a moment of inertia of only 0.0029 kg·m². Each of the two clamping flanges, 200 mm in diameter and 15 mm thick, weighs 3.70 kg and contributes 0.0185 kg·m². The motor's datasheet gives its rotor as 0.11 kg·m².

```figure
type: bars
title: Where the docking saw's moment of inertia comes from
x: Part
y: Share of the total, %
caption: This is an illustration. Total 2.172 kg·m². The blade has 19.9 kg of the saw's moving mass and 93% of its moment of inertia; the arbor has nearly half the blade's mass and a tenth of a percent of the inertia.
- * Blade, 19.9 kg | 93.1
- Motor rotor | 5.06
- Two flanges, 7.4 kg | 1.70
- Arbor, 9.2 kg | 0.13
```

The bar chart is the chapter's main lesson in one picture. The arbor weighs nearly half as much as the blade but sits within 25 mm of the axis; the blade's mass is spread out to 450 mm. Inertia is dominated by whatever is furthest out.

## The infeed rollers and the thin-walled approximation

Each infeed roller is a steel tube, 168.3 mm outside diameter and 7.1 mm wall, 1,200 mm long. Its mass is 33.87 kg, and as a hollow cylinder its moment of inertia is 33.87 × (0.1683² + 0.1541²) ÷ 8 = 0.2205 kg·m².

For a thin wall, the simpler formula m Dm² ÷ 4, with the mean diameter of 161.2 mm, puts all the mass at the wall's mid-radius. The [more mass moments of inertia tool](/tools/mass-inertia-more/) offers it as the thin-walled cylinder about its axis, alongside a solid cone, a hollow sphere, a thin spherical shell, a torus, an ellipsoid and a thin ring about a diameter, each with a parallel-axis offset. It returns the moment of inertia about the body's axis and about the rotation axis, and the radius of gyration.

```figure
type: compare
title: The infeed roller's tube by two formulas
cols: Formula | Moment of inertia | Radius of gyration
rowhead: Method
- Hollow cylinder, exact | m (D² + d²) ÷ 8 | 0.2205 kg·m² | 80.7 mm
- * Thin-walled tube, mean diameter | m Dm² ÷ 4 | 0.2200 kg·m² | 80.6 mm
caption: This is an illustration. Mass 33.871 kg, 168.3 × 7.1 mm. The thin-wall formula is 0.19% low for a wall about a twelfth of the radius thick. It is the formula to use for rims, belts, chains and tubes whose wall is small compared with their radius.
```

The two results differ by 0.19%. The thin-walled formula is accurate whenever the wall is small compared with the radius, and it is easy to apply to anything that is mostly a rim: a pulley's rim, a belt or chain running round a sprocket, a tyre, or the lagging on a roller.

## Offset parts: the chipper's knives

The chipper's disc is a steel plate 1,400 mm in diameter and 75 mm thick, weighing 906.3 kg, with a moment of inertia of 906.3 × 1.4² ÷ 8 = 222.05 kg·m². Four knives are bolted to its face, each 400 × 100 mm and 4.5 kg, with their centres 450 mm from the axis.

A knife does not turn about its own centre; it is carried round the disc's axis. Its moment of inertia about its own centre, as a block turning about an axis square to its 400 × 100 mm face, is 4.5 × (0.4² + 0.1²) ÷ 12 = 0.0638 kg·m². The parallel-axis transfer adds 4.5 × 0.45² = 0.9113 kg·m², for 0.975 kg·m² about the disc's axis. The transfer term is fourteen times the knife's own inertia: for a small part far from the axis, the part's shape hardly matters and its mass times the distance squared is almost the whole answer.

The four knives add 3.90 kg·m², 1.8% of the disc. In the mass moment of inertia tool this is the rectangular block with an offset of 450 mm.

```figure
type: stats
title: The DL-3's main rotating parts
caption: This is an illustration. Each about its own shaft's axis. The chipper's disc has a hundred times the saw's moment of inertia and turns at 40% of its speed; Chapters 7 to 9 show what that means for starting it and for storing energy in it.
- Docking saw, blade, flanges, arbor and rotor | 2.172 kg·m²
- One infeed roller tube | 0.2205 kg·m²
- * Chipper disc, without knives or hub | 222.05 kg·m²
- Four chipper knives at 450 mm | 3.90 kg·m²
```

## Adding parts together

Moments of inertia about the same axis simply add. The docking saw's 2.172 kg·m² is the blade, the flanges, the arbor and the motor's rotor added together, because all four turn about the same axis at the same speed. That is the basis of the built-up rotors in Chapter 2.

Two cautions apply. The parts must turn about the same axis: the knives were transferred to the disc's axis before they could be added to it. And they must turn at the same speed. The chipper's motor and its disc are joined by a belt and turn at different speeds, so the motor's rotor cannot be added to the disc's inertia until it has been converted to the disc's speed, which Chapter 4 explains. Adding inertias from shafts that turn at different speeds is the second most common inertia error after the diameter-for-radius slip, and it is just as easy to make with good software as by hand.

## What the idealised shapes leave out

Every formula in this chapter describes a uniform, idealised body. Real parts have holes, teeth, ribs, keyways and bosses, and the question is always whether those details sit where they matter.

The saw blade shows both sides of the answer. Its 50 mm bore is at the centre and changes the blade's inertia by 0.3%. Its teeth are at the rim. A carbide-tipped blade of this size might carry 60 teeth, and if each tip and the extra steel behind it added 3 g at the 450 mm radius, together they would add 60 × 0.003 × 0.45² = 0.036 kg·m², 1.8% of the blade. The expansion slots cut into the rim take a little back. Neither detail changes a drive calculation much, but both are bigger than the bore, for the same reason as before: what is far out counts.

For a first estimate, the useful rule is to model the parts that are large or far from the axis carefully and to treat everything near the axis roughly. When the drive calculation depends on the answer to better than a few per cent, as it does for a servo axis with a small margin, the CAD model's mass properties are the better source, provided the model's materials and densities have been set correctly. A CAD model in which every part has the default density of the software's template is as wrong as a hand calculation with the wrong radius.

## Measuring a moment of inertia

When there is no drawing, or the drawing and the part disagree, the moment of inertia can be measured. The simplest method for a part that can be lifted is to hang it as a pendulum from a knife edge and time its swing.

A body swinging about a pivot at a distance d from its centre of mass has a period T = 2π √(Jp ÷ (m g d)), where Jp is its moment of inertia about the pivot. Rearranged, Jp = m g d T² ÷ (4π²), and the parallel-axis rule then gives the moment of inertia about its own centre: J = Jp − m d².

The mill tested the chipper's motor pulley this way. Hung by the inside of its rim on a knife edge, its centre was 170 mm below the pivot. Twenty small swings took 22.9 s, a period of 1.145 s. The pivot moment of inertia is 24 × 9.81 × 0.17 × 1.145² ÷ (4π²) = 1.3292 kg·m², and the pulley's own moment of inertia is 1.3292 − 24 × 0.17² = 0.6356 kg·m², within 0.22% of the 0.6370 kg·m² calculated in the exercise below.

```figure
type: steps
title: Measuring the motor pulley's moment of inertia by swinging it
caption: This is an illustration. Mass 24 kg on a scale, pivot 170 mm from the centre, 20 swings of small amplitude timed with a stopwatch.
- Period, 22.9 s ÷ 20 | 1.145 s
- Moment of inertia about the pivot, m g d T² ÷ 4π² | 1.3292 kg·m²
- Transfer term, m d² | 0.6936 kg·m²
- * Moment of inertia about its own centre | 0.6356 kg·m²
```

The method needs only a scale, a tape and a stopwatch, and it has a convenient property: a small error in measuring d partly cancels, because d appears in both terms. Timing many swings, and keeping them small, matters more. Larger rotors are measured in place by a run-down test instead: the motor is given a known torque, or switched off and allowed to coast against a known friction, and the change in speed over a measured time gives J from torque equals J times angular acceleration. Chapter 3 uses that relation in the other direction.

## The mistake: a diameter where a radius belongs

The first inertia list for the docking saw gave the blade as 8.065 kg·m², four times the correct value. The calculation had used m R² ÷ 2, correctly, but with R entered as 0.9 m, the blade's diameter.

The factor of four is the signature of this error: the formula squares the dimension, so doubling it quadruples the result. It was found because the saw's motor, sized by the machine builder, appeared unable to bring the blade up to speed within its allowed start time, which made the reviewer recheck the inertia. A quick check against the radius of gyration would have caught it at once: 8.065 kg·m² for a 19.9 kg blade means k = 636 mm, larger than the blade's 450 mm radius, which is impossible. No body can have a radius of gyration larger than its outermost radius.

```figure
type: checklist
title: Before trusting a moment of inertia
caption: The DL-3 review's checks. This is an illustration.
- x Formula written in diameter or radius form, and the dimension entered to match
- x Radius of gyration smaller than the part's outer radius
- x Mass checked against the part's volume and density, or its weight on a scale
- x Offset parts transferred to the rotation axis by m e²
- x Parts near the axis checked for whether they matter at all
- ? Complex castings confirmed against CAD mass properties
```

## Exercise: a V-belt pulley

**Problem.** The chipper's motor pulley is a cast-iron rim of 400 mm outside and 340 mm inside diameter weighing 18 kg, on a hub that can be treated as a solid disc 150 mm in diameter weighing 6 kg. Find (a) the moment of inertia of the rim and hub, (b) the pulley's radius of gyration, and (c) the error of treating the rim as a thin ring at its mean diameter.

**Answer.** (a) Rim: 18 × (0.4² + 0.34²) ÷ 8 = 0.6201 kg·m². Hub: 6 × 0.15² ÷ 8 = 0.0169 kg·m². Total 0.6370 kg·m².

(b) k = √(0.6370 ÷ 24) = 0.1629 m, or 162.9 mm.

(c) Thin ring at 370 mm mean diameter: 18 × 0.37² ÷ 4 = 0.6161 kg·m², 0.65% below the hollow-cylinder figure. The wall, 30 mm on a 200 mm radius, is thick enough to make a small difference, and the hub, a quarter of the mass, contributes under 3% of the inertia.

**The check.** k = 162.9 mm is less than the pulley's 200 mm outer radius, as it must be.

The same calculation also shows how little the hub matters for driving the pulley: it is a quarter of the mass and under 3% of the inertia. A lighter hub would make the pulley easier to lift, not easier to spin up.
