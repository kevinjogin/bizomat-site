---
book: fine-particles-by-the-numbers
chapterSlug: drag-and-settling
order: 2
title: "Drag and settling: Stokes' law and its limits"
description: "Calculate the drag on a small particle and its settling velocity by Stokes' law, check the Reynolds number, and correct the large spatter particles where Stokes' law overestimates their speed."
draft: false
---

A particle in air feels two forces that matter most of the time: its weight, pulling it down, and the drag of the air, resisting any motion relative to the air. When the two balance, the particle falls at a steady **settling velocity**. For a grain of grit that velocity is a few centimetres a second; for a fume particle it is a few micrometres a second, so slow that any air current at all carries it wherever the air goes.

This chapter sets out Stokes' law for the drag on a small sphere, derives the settling velocity from it, tabulates settling velocities and times for LX-3's particle families, checks the particle Reynolds number that tells whether Stokes' law applies, and corrects the large spatter particles for which it does not. The failure case is a settling chamber sized with Stokes' law for particles too large for it.

## Drag at low speed

When a very small sphere moves slowly through a fluid, the fluid flows smoothly around it, and the drag is set by the fluid's viscosity rather than its inertia. George Gabriel Stokes showed in 1851 that the drag on such a sphere is **F = 3π μ d V**, where μ is the fluid's dynamic viscosity, d the sphere's diameter and V its speed relative to the fluid. Drag is proportional to the diameter, not the area, and to the speed, not its square.

For LX-3's air, with μ ≈ 1.81 × 10⁻⁵ Pa·s, a 10 µm particle moving at 1 m/s relative to the air feels a drag of about **3π × 1.81 × 10⁻⁵ × 10 × 10⁻⁶ × 1 ≈ 1.71 × 10⁻⁹ N**. Its weight, at 5,000 kg/m³, is about **2.57 × 10⁻¹¹ N**. The drag at 1 m/s is about 66 times its weight: the air dominates the particle's motion long before gravity can do much.

## Settling velocity

A particle released in still air accelerates downwards until drag balances weight. Setting Stokes' drag equal to the weight, ρp × π d³ ÷ 6 × g, and solving for V gives the settling velocity. The air's buoyancy is ignored, because air at 1.2 kg/m³ is about four thousand times less dense than the oxide.

```figure
type: formula
title: Settling velocity in the Stokes regime
formula: v_s = ρp g d² ÷ (18 μ)
caption: This is an illustration for LX-3's oxide particles at 5,000 kg/m³ in air at 20 °C, without the slip correction that Chapter 3 adds for small particles. Settling velocity grows with the square of diameter.
- 0.1 µm | 5,000 × 9.81 × (0.1 × 10⁻⁶)² ÷ (18 × 1.81 × 10⁻⁵) ≈ 1.51 × 10⁻⁶ m/s
- 1 µm | about 1.51 × 10⁻⁴ m/s
- 10 µm | about 0.0151 m/s
- 30 µm | about 0.135 m/s
- 100 µm | about 1.51 m/s, but see the Reynolds number check below
step: Ten times the diameter gives a hundred times the settling velocity
```

### How long to fall a metre and a half

Settling times make the numbers concrete. LX-3's cutting table is about 1.5 m below the top of the fume plume that rises from the kerf when the extraction is off. The time for a particle to settle that height in still air is 1.5 m divided by its settling velocity.

```figure
type: bars
title: Time to settle 1.5 m in still air, by particle size, without slip
unit: hours
max: 300
caption: This is an illustration. A 10 µm particle takes about 100 s, a 1 µm particle about 2.8 hours and a 0.1 µm particle about 277 hours, over 11 days; with the slip correction of Chapter 3 the 0.1 µm particle takes about 4 days. In any real room, air currents keep the fine particles suspended indefinitely.
- 10 µm, about 100 s | 0.03
- 1 µm, about 2.8 h | 2.8
- 0.1 µm, about 277 h | 277
```

Those numbers are why fume behaves as if it were part of the air. Even in a still room, a 1 µm particle takes hours to settle a metre and a half, and no workshop is still: people move, doors open, machines warm the air and make it rise. For practical purposes, fume particles never settle out of workshop air; they are removed only by extraction, ventilation or filtration. The coarse dust and spatter, on the other hand, settle quickly, and much of LX-3's coarse dust ends up in the plenum and the slag trays without ever reaching the filters.

### What the settling velocity is good for

The settling velocity is the single most useful number about a particle above about a micrometre. It sets how long the particle stays airborne in a room, how far it is carried along a duct before it reaches the floor, whether a settling chamber or a cyclone can remove it, and, through the aerodynamic diameter of Chapter 1, how it is classified for health purposes. It is also easy to check by experiment: particles released in a tall, still, sealed tube can be timed as they fall, which is how settling velocities were measured long before particle counters existed. Below about a micrometre, settling becomes too slow to measure directly or to matter in practice, and Brownian diffusion, which Chapter 5 calculates, takes over as the particle's characteristic motion. Between those regimes, the slip correction of Chapter 3 links them.

## The particle Reynolds number

Stokes' law assumes the flow around the particle is slow and smooth, dominated by viscosity. The **particle Reynolds number**, Re = ρa V d ÷ μ, measures how true that is: it compares the air's inertia with its viscosity at the scale of the particle. Stokes' law is accurate when Re is well below 1, and its error grows above that.

```figure
type: compare
title: Reynolds number check for LX-3's particles at their Stokes settling velocity
cols: Stokes settling velocity | Particle Reynolds number | Stokes' law
caption: This is an illustration with air at 1.20 kg/m³. Below about Re = 0.1, Stokes' law is accurate for settling; by Re = 10 it overestimates the velocity by about half.
- 1 µm | 1.51 × 10⁻⁴ m/s | about 1 × 10⁻⁵ | accurate
- 10 µm | 0.0151 m/s | about 0.010 | accurate
- 30 µm | 0.135 m/s | about 0.27 | about 5% fast
- *100 µm | 1.51 m/s | about 10 | not valid
```

For the 100 µm spatter, the Stokes velocity of 1.51 m/s gives Re ≈ 10, far outside the range where the law holds. The real drag is larger than Stokes predicts, because the air's inertia adds a pressure drag in the particle's wake, so the real settling velocity is lower.

### Correcting the large particles

For particle Reynolds numbers up to several hundred, a widely used correlation by Schiller and Naumann gives the drag coefficient as **C_D = (24 ÷ Re) × (1 + 0.15 Re^0.687)**. The first factor is Stokes' law written as a drag coefficient; the bracket is the correction for inertia. The settling velocity is then found by balancing weight with drag, **½ ρa V² C_D × π d² ÷ 4**, and solving iteratively, because C_D itself depends on V.

For LX-3's 100 µm spatter, the iteration converges to a settling velocity of about **0.98 m/s** at Re ≈ 6.5, about two-thirds of the Stokes value. For a 30 µm particle the correction is small: about **0.128 m/s** rather than 0.135 m/s. For 10 µm and below, the correction is negligible. The rule of thumb is to calculate the Stokes velocity first, check its Reynolds number, and correct only if Re exceeds about 0.1.

## Particles that are not spheres

Stokes' law is for spheres. Most real particles are not, and the usual correction is a **dynamic shape factor**, χ, the ratio of a particle's actual drag to the drag on a sphere of the same volume moving at the same speed. A compact, roughly cubic grain has a shape factor a little above 1; a flake, a fibre or a loose, branched chain of fume particles may have a shape factor well above 1, because its irregular outline drags more air with it. The settling velocity is divided by χ.

For LX-3's coarse dust, a teaching shape factor of 1.6 for irregular slag fragments reduces a 10 µm particle's settling velocity from about 0.0151 m/s to about **0.0094 m/s**; a shape factor of 2.0 for a chain agglomerate reduces it to about **0.0076 m/s**. Shape factors come from measurement or published data for similar particles, not from guesswork; for design, the point is that irregular particles settle more slowly than spheres of the same mass, and calculations that assume spheres are optimistic about how quickly dust drops out.

## Settling while being carried

In an extraction system, particles rarely settle in still air. More often they are carried horizontally by an airstream while gravity pulls them down, and the question is how far they travel before reaching a surface. If the air moves at a steady horizontal speed U and the particle settles at v_s, the particle's path slopes downwards at v_s ÷ U, and it falls a height h while travelling a horizontal distance **L = U h ÷ v_s**.

Under LX-3's table, air sweeps across the plenum towards the duct connection at about 0.4 m/s in a space about 0.3 m deep. A 10 µm particle released at the top of the plenum travels about **0.4 × 0.3 ÷ 0.0151 ≈ 7.9 m** horizontally before reaching the plenum floor, far longer than the plenum, so it reaches the duct still airborne. A 1 µm particle would travel nearly 800 m, which is another way of saying it never settles there at all. Only the coarsest dust and the spatter drop out in the plenum. This simple calculation, horizontal distance equals air speed times height divided by settling velocity, is the basis of every settling chamber and of the duct deposition estimates in Chapter 7.

### How quickly terminal velocity is reached

The settling velocity is reached almost instantly for small particles. A particle starting from rest approaches its terminal velocity exponentially, with a time constant called the **relaxation time**, which Chapter 4 develops. For a 10 µm oxide particle the relaxation time is about **1.56 ms**, so within about three relaxation times, under 5 ms, it is falling at its terminal velocity, having travelled only a few hundredths of a millimetre. For practical purposes, particles of 10 µm and smaller are always at their terminal velocity relative to the air, which is why settling velocity alone describes their motion so well. Only the large spatter, with relaxation times of a tenth of a second or more, keeps a memory of how it was thrown.

## What settling means for extraction

The extraction air through LX-3's table moves downwards at a speed set by the flow and the open area: with 0.60 m³/s through an active zone of about 1.5 × 1.0 m, the downdraught is about **0.4 m/s**. That is more than twenty times the settling velocity of a 10 µm particle and more than two thousand times that of a 1 µm particle, so the downdraught, not gravity, decides where those particles go. For the 100 µm spatter, settling at nearly 1 m/s and thrown from the kerf at much higher speeds by the assist gas, the downdraught is a minor influence; the spatter goes where its own momentum takes it, which Chapter 4 calculates.

Settling also sets where dust collects in the system. In the horizontal duct, air moves at about 19 m/s and the duct is 0.2 m across, so a particle crosses the duct's height in 0.2 ÷ v_s seconds while it is carried along. Chapter 7 uses exactly that comparison to estimate deposition in the duct.

## A failure case: Stokes' law past its limit

This is an illustration. A shop designing a simple settling box ahead of the filters for a plasma cutting table wanted to drop out particles of 100 µm and larger. The designer used Stokes' law: a settling velocity of about 1.5 m/s for 100 µm oxide, a box 0.5 m high, so a particle needed 0.33 s to fall to the floor of the box, and the box was made just long enough for the air to take 0.35 s to cross it.

In use, the box caught far less spatter than expected, and the filter cartridges downstream showed scorch marks within weeks. The detection came from the scorched cartridges, found at the first filter change. A check of the design found the error: at 1.5 m/s, a 100 µm particle has a Reynolds number of about 10, and its true settling velocity is only about 1 m/s, so it needed about 0.5 s to fall through the box rather than 0.33 s, and many particles reached the far end still airborne.

The correction was a longer box with a baffle, and a spark arrestor ahead of the filters. The shop's calculation sheet now checks the particle Reynolds number on every settling calculation and applies a drag correlation above Re ≈ 0.1.

## How this applies to a small Australian business

Use Stokes' law to estimate drag and settling velocity for particles up to about 30 µm, and remember that settling velocity grows with the square of the diameter. Check the particle Reynolds number every time, and correct with a drag correlation when it exceeds about 0.1. Convert settling velocities into settling times over real heights to see which particles will stay in the air. Compare settling velocities with the extraction air's velocities to see whether gravity or the air decides where each particle goes.

## Exercise: grinding grit

A bench grinder throws oxide and abrasive particles of 20 µm, density about 4,000 kg/m³, into air at 20 °C. What is the Stokes settling velocity, and what is the particle Reynolds number at that speed? How long would such a particle take to settle 1.2 m in still air? Is a correction needed?

**Worked answer.** The settling velocity is **4,000 × 9.81 × (20 × 10⁻⁶)² ÷ (18 × 1.81 × 10⁻⁵) ≈ 0.0482 m/s**. The Reynolds number is **1.20 × 0.0482 × 20 × 10⁻⁶ ÷ 1.81 × 10⁻⁵ ≈ 0.064**, below 0.1, so Stokes' law is adequate and no correction is needed. The particle takes about **1.2 ÷ 0.0482 ≈ 25 s** to settle 1.2 m in still air, long enough for any draught to carry it well away from the grinder.
