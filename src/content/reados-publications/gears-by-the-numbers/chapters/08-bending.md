---
book: gears-by-the-numbers
chapterSlug: tooth-bending-strength
order: 8
title: "Tooth bending strength"
description: "Screen tooth root bending stress with the Lewis equation and a velocity factor, and see why modern rating methods add many more factors."
draft: false
---

A gear tooth is a short, thick cantilever. Every time it carries load, it bends at its root, and if the bending stress is too high the tooth eventually cracks there and breaks off. Bending fatigue is one of the two main ways gear teeth fail; the other, surface fatigue, is the subject of Chapter 9.

In 1892, Wilfred Lewis presented to the Engineers' Club of Philadelphia a way of estimating that root stress. His equation is still taught as the starting point for gear strength, and it remains a useful screening tool. This chapter applies it to the conveyor pair and explains what modern methods add.

## The forces on the tooth

From Chapter 1, the pinion carries 19.90 N·m. The tangential force at the pitch circle is:

**Fₜ = 2 × T / d = 2 × 19.90 / 0.060 ≈ 663.2 N**

With the 20° pressure angle, the radial force is about 663.2 × 0.364 ≈ 241.4 N and the normal force about 705.8 N. The Lewis method uses the tangential component, which does the bending.

## The Lewis equation

Lewis modelled the tooth as a cantilever of uniform strength, loaded at its tip, and found that the bending stress depends on the load, the face width, the tooth size and a factor describing the tooth shape. In module form:

**σ = Fₜ / (b × m × Y)**

where b is the face width, m the module and Y the **Lewis form factor**, which depends on the number of teeth and the tooth system. Values for 20° full-depth teeth are tabulated in standard texts; the reference used here is chapter 14 of *Shigley's Mechanical Engineering Design*, which gives Y ≈ 0.322 for 20 teeth and Y ≈ 0.422 for 60 teeth.

For the conveyor pinion, with b = 30 mm and m = 3 mm:

**σ = 663.2 / (30 × 3 × 0.322) ≈ 663.2 / 28.98 ≈ 22.9 MPa**

## Allow for speed

Gears running at speed carry extra dynamic load from small errors in tooth spacing and profile. Lewis's method was later combined with velocity factors derived from tests. For cut or milled profiles, Shigley gives, in SI units with pitch-line velocity V in metres per second:

**Kᵥ = (6.1 + V) / 6.1**

The pinion's pitch-line velocity is:

**V = π × d × n / 60,000 = π × 60 × 1,440 / 60,000 ≈ 4.524 m/s**

so

**Kᵥ = (6.1 + 4.524) / 6.1 ≈ 1.742**

and the screened bending stress becomes:

**σ = Kᵥ × Fₜ / (b × m × Y) ≈ 1.742 × 22.9 ≈ 39.9 MPa**

The 60-tooth gear, with Y ≈ 0.422, sees **663.2 / (30 × 3 × 0.422) ≈ 17.5 MPa** before the velocity factor and about **30.4 MPa** after it. The pinion's teeth, narrower at the root, carry the higher bending stress, as is usual.

```figure
type: bars
title: Screened tooth bending stress, conveyor pair
unit: MPa
max: 45
caption: Lewis equation with a cut-profile velocity factor of 1.742. A screening estimate, not a rating.
- Pinion, static | 22.9
- *Pinion, with velocity factor | 39.9
- Gear, static | 17.5
- Gear, with velocity factor | 30.4
```

## What the Lewis method leaves out

Lewis's equation assumes the full load acts at the tip of a single tooth, ignores the stress concentration at the root fillet, ignores the compressive effect of the radial force and treats the tooth as perfectly made and aligned. Shigley notes that, with adequate contact ratio and accuracy, the tip-load case is not actually the worst, and that the highest stress usually occurs when one pair of teeth carries the whole load near the middle of the tooth.

Modern rating methods, such as those published by AGMA and in ISO 6336, retain Lewis's cantilever idea but add factors for root geometry and stress concentration, load sharing, dynamic effects tied to gear accuracy, misalignment and load distribution across the face, overloads from the driven machine, size effects, material quality, reliability and life. Their allowable stresses come from tested material data at a stated number of cycles.

The practical consequence is clear. A low Lewis stress is encouraging; it shows the teeth are not grossly undersized. It is not a rating. A drive that matters needs a calculation to a recognised method, with the supplier's material data, or a supplier's own rating for the gears.

```figure
type: tree
title: What a modern rating adds to Lewis
caption: The cantilever idea survives; each factor corrects one of its simplifications.
- Bending rating
  - Root stress concentration | fillet geometry
  - Load sharing | contact ratio and accuracy
  - *Dynamic factor | tied to accuracy grade and speed
  - Load distribution | alignment across the face
  - Application factor | shocks from the driven machine
  - Material and life | tested allowable stress
```

## Using the screen to compare options

Where the Lewis method shines is in comparing alternatives quickly. Chapter 3 proposed a module 2.5 pair with 24 and 72 teeth on the same centre distance. The tangential force is unchanged, because the pitch diameters are the same. With Y ≈ 0.337 for 24 teeth:

**σ = 663.2 / (30 × 2.5 × 0.337) ≈ 26.2 MPa**, or about **45.7 MPa** with the same velocity factor.

The finer pitch gives about 15% more bending stress in the pinion than module 3. It runs with a slightly higher contact ratio, as Chapter 4 showed, so it may be quieter. Whether the trade is acceptable depends on the margin the full rating shows.

## Exercise: double the speed

Suppose the same pair transmitted the same torque at twice the speed, 2,880 rpm. Calculate the pitch-line velocity, the velocity factor and the screened pinion bending stress.

The pitch-line velocity doubles to about **9.048 m/s**. The velocity factor becomes **(6.1 + 9.048) / 6.1 ≈ 2.483**. With the same tangential force, the screened stress is **2.483 × 22.9 ≈ 56.8 MPa**. The power has also doubled, to 6 kW. Explain why higher speeds push designers towards more accurate gears, which modern methods reward with lower dynamic factors.
