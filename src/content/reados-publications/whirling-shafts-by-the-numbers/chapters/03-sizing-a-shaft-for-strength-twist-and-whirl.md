---
book: whirling-shafts-by-the-numbers
chapterSlug: sizing-a-shaft-for-strength-twist-and-whirl
order: 3
title: "Sizing a shaft for strength, twist and whirl"
description: "Sizing a rotating shaft against three criteria at once, combined bending and torsion, twist and critical speed, and why on fast, heavy rotors the critical speed usually sets the diameter."
draft: false
---

A rotating shaft has three jobs that set its size. It must be strong enough to carry its bending and twisting loads, including the shocks that real machines deliver, without breaking or fatiguing. It must be stiff enough in torsion that it does not wind up too far between its ends. And it must be stiff enough in bending that its critical speed stays well away from the running speed. A designer who checks only the first, the one most textbooks start with, can produce a shaft that is perfectly strong and completely unusable.

This chapter checks the HM-30's shaft against all three with a KEVOS® tool, shows that the critical speed sets the diameter by a wide margin, works through an error in which a tool input did not match the maker's own rule, and looks at a load that no shock factor can cover: a jam.

## Strength: bending, torsion and shock

A shaft carrying a rotor between two bearings is bent by the rotor's weight and twisted by the torque it transmits. The bending stress at the surface is σ = 32M ÷ (πd³) and the torsional shear stress is τ = 16T ÷ (πd³). Combining them by the maximum shear stress theory, with factors for shock, gives the diameter needed for an allowable shear stress:

```figure
type: formula
title: Shaft diameter for combined bending and torsion with shock factors
formula: d = ∛[(16 ÷ (π × τ_allow)) × √((K_m × M)² + (K_t × T)²)]
formula: Torque from power and speed: T = P ÷ ω, with ω = 2πn ÷ 60
caption: The shock factors K_m and K_t multiply the steady bending moment and torque to allow for the suddenly applied and fluctuating loads of real machines. A keyway at the critical section is often allowed for by reducing the allowable stress, for example to 75% of its plain-shaft value.
- d | shaft diameter, mm
- τ_allow | allowable shear stress, MPa
- M | maximum bending moment, N·mm
- T | torque, N·mm
- K_m, K_t | shock factors for bending and torsion, 1.0 for steady loads and higher for shock
```

The bending in a rotating shaft is a fatigue load. The rotor's weight pulls the shaft down at all times, but the shaft turns through that bend, so every fibre goes from tension at the bottom to compression at the top and back, once per revolution. At 2,950 rpm, a shaft completes 4.2 million of those cycles every day. The allowable stress used in the formula must be low enough for that, which is why traditional allowable shear stresses for shafts are only a small fraction of the steel's strength.

### HM-30's loads

This is an illustration. The HM-30's motor delivers 30 kW at 2,950 rpm, so the torque is 30,000 ÷ 308.9 = 97.1 N·m. Its rotor, as three 60 kg masses at 300, 500 and 700 mm on a 1,000 mm span, gives bearing reactions of 882.6 N each and a bending moment at mid-span of 882.6 × 0.5 − 588.4 × 0.2 = 323.6 N·m. The maker uses shock factors of 2.0 in bending and 1.5 in torsion for a hammer mill, whose hammers strike grain and the occasional stone hundreds of times a second, and an allowable shear stress of 40 MPa for its shaft steel, reduced to 75% at a keyway.

## Twist

A shaft that transmits torque winds up by an angle θ = T × L ÷ (G × J), where J = πd⁴ ÷ 32 is its polar second moment of area. For long line shafts and for machines whose ends must stay in step, a limit on twist per metre of length is a traditional design criterion. A common choice is 0.25° per metre.

For the HM-30, with the rotor close to the coupling and a short drive between them, twist is not a practical concern, but checking it costs nothing, and on a long shaft it can govern.

## Critical speed

Chapters 1 and 2 dealt with the third criterion. For the sizing tool below, the critical speed is estimated from the static deflection of the shaft under a central mass plus the shaft's own weight, using the classic relation n_c = 946 ÷ √δ, with δ the static deflection at mid-span in millimetres and n_c in rpm. It is the same physics as Rayleigh's method with a simpler load arrangement.

## All three at once

The KEVOS® [Shaft design: strength, twist and critical speed](/tools/shaft-design-check/) tool sizes a shaft against the three criteria together. From the power, speed, maximum bending moment and shock factors, the allowable shear stress and whether there is a keyway, it gives the diameter for strength by the maximum shear theory. From the twist limit and shear modulus it gives the diameter for twist. And from the bearing span, a central mass, the modulus and density, and the required ratio of critical speed to running speed, it searches for the diameter whose critical speed meets the ratio. It reports which criterion governs and the critical speed at the governing diameter. Its guide notes that it assumes a simply supported span with one central mass, and that overhung loads and several masses need a fuller analysis.

```figure
type: compare
title: HM-30 shaft diameters from the shaft design tool
cols: Diameter needed, mm | Notes
rowhead: Criterion
- Strength, combined bending and torsion | 48.3 | K_m = 2.0, K_t = 1.5, 40 MPa allowable, 75% for the keyway
- Twist, 0.25° per metre | 41.1 | G = 79.3 GPa
- * Critical speed at least 1.25 times running | 89.7 | 180 kg central mass, 1,000 mm span, E = 206 GPa
- Critical speed at least 1.33 times running | 92.9 | the same, with the ratio matching a 25% margin below critical
caption: This is an illustration. Power 30 kW at 2,950 rpm, torque 97.1 N·m, bending moment 323.6 N·m. Critical speed governs by a factor of almost two over strength.
```

The critical speed needs a shaft almost twice the diameter that strength needs, and therefore more than six times the bending strength, which varies as the cube of the diameter. In a 90 mm shaft, the bending stress from the rotor's weight is only 32 × 323,600 ÷ (π × 90³) = 4.5 MPa, and the torsional shear 0.7 MPa. The twist over the whole span is about 0.01° per metre. The shaft is enormously over-strong, and it has to be, because it is the shaft's stiffness, not its strength, that keeps the rotor away from its critical speed.

```figure
type: bars
title: Diameter needed by each criterion, HM-30 shaft
unit: mm
caption: This is an illustration. Values from the shaft design tool. Strength and twist would allow a shaft about half the diameter that the critical speed requires.
- Twist | 41.1
- Strength | 48.3
- * Critical speed, ratio 1.25 | 89.7
- Critical speed, ratio 1.33 | 92.9
```

That is typical of fast, heavy rotors on long spans: hammer mills, fans, centrifugal pumps with long shafts, and rolls. For slow, compact machines, such as gearbox shafts or conveyor drive shafts, strength and fatigue usually govern instead. The point of checking all three every time is that the designer does not have to guess which kind of machine they are dealing with.

## The error: a ratio that did not match the rule

This is an illustration. The designer sizing the production HM-30 shaft entered a required ratio of critical speed to running speed of 1.25 in the shaft design tool, read the governing diameter of 89.7 mm, and specified 90 mm. The maker's design standard, written after the prototype's failure, required the running speed to be at least 25% below the first critical speed.

The checker noticed that the two are not the same. A 25% margin below critical means the running speed is no more than 75% of the critical speed, which is a ratio of critical to running of 1 ÷ 0.75 = 1.333, not 1.25. A ratio of 1.25 corresponds to running at 80% of critical, a 20% margin. Rerunning the tool with 1.333 gave 92.9 mm, so on the tool's own model the 90 mm shaft did not meet the maker's rule.

The checker did not simply raise the diameter. The shaft design tool lumps the whole 180 kg rotor at mid-span, which Chapter 2 showed is pessimistic for a rotor spread over 400 mm. The several-masses tool, with the rotor as three masses, gave a Dunkerley critical speed of 4,081 rpm for 90 mm, so 2,950 rpm is 72.3% of critical, inside the 75% limit. Both conclusions were recorded in the design note: the sizing tool's central-mass model flags 90 mm as marginal; the more representative three-mass model shows it meets the rule; 90 mm is accepted on the second model, and the support stiffness is to be checked (Chapter 4).

```figure
type: checklist
title: Entering a critical speed margin into a sizing tool
caption: The open item is the one the designer missed: the tool's input was a different quantity from the rule.
- Rule written in one form only | running speed at least 25% below the first critical speed
- ? Tool input converted to match the rule | ratio of critical to running = 1 ÷ (1 − 0.25) = 1.333
- Tool's model compared with the rotor | one central mass, or several masses spread out
- Result checked with a second model where marginal | Chapter 2's several-masses tool
- Assumption recorded in the design note | so the next variant is checked the same way
```

The episode had a useful consequence for the export variant. At 3,550 rpm and a ratio of 1.333, the shaft design tool asks for 102.8 mm with its central-mass model; the three-mass Dunkerley estimate in Chapter 2 shows that 100 mm, at 71.6% of critical, meets the rule. The maker chose 100 mm for the export shaft on the same reasoning as before, and recorded it.

## Details that the diameter does not cover

A shaft sized by the three criteria still has to be detailed, and the details are where shafts actually break. Rotating shafts fail by fatigue, and fatigue cracks start at stress raisers.

- **Shoulders.** A step from 90 mm to the 85 mm bearing journal concentrates stress at the corner. A generous fillet radius, as large as the bearing's chamfer allows, keeps the concentration low; a sharp, undercut corner can double the local stress.
- **Keyways.** The keyway's corners and its sudden end are both stress raisers. The tool's 75% allowance is a traditional, simple way of covering them; a sled-runner keyway, which runs out gradually, is kinder than an end-milled one that stops abruptly.
- **Fits.** Discs and hubs shrunk or pressed onto a shaft cause fretting at the edge of the fit, where small relative movement under rotating bending wears and cracks the surface. Relieving the shaft slightly just outside the fit, or rounding the hub's bore edge, helps.
- **Surface.** Machining marks, corrosion pits and weld spatter all start cracks. A rotating shaft should never have anything welded to it without a specific design check.

On the HM-30, the bending stresses are so low that none of these is likely to start a crack in normal running. They matter on the smaller coupling-end stub, which carries the full torque and its shocks, and they matter on every shaft whose diameter is set by strength rather than by stiffness.

### Material

Because stiffness, not strength, governs the HM-30's main shaft, a higher-strength steel would buy nothing: every steel has the same elastic modulus to within a few per cent. The maker uses a medium-carbon shaft steel in the normalised condition, for its machinability, its toughness and its fatigue strength at the stub, and saves alloy steels for shafts that are sized by strength. A designer who reaches for a stronger steel to raise a critical speed is making the same mistake as one who buys stronger steel for a slender column: the property that matters is the one that does not change.

## A load no shock factor covers: the jam

Shock factors cover the ordinary roughness of a machine's work. They do not cover a jam: a piece of tramp metal, a bolt or a lost hammer catching between the rotor and the screen, stopping the rotor in a fraction of a second.

This is an illustration. The HM-30's rotor has a moment of inertia of about 6.6 kg·m² (Chapter 9 shows where that comes from) and at 2,950 rpm it is turning at 308.9 rad/s. Stopping it uniformly in a time t needs a torque of J × ω ÷ t.

```figure
type: compare
title: Torque to stop the HM-30 rotor in a jam
cols: Torque, kN·m | Multiple of the motor's rated 97.1 N·m
rowhead: Stopping time
- 0.5 s | 4.1 | 42
- 0.2 s | 10.2 | 105
- * 0.05 s | 40.8 | 420
caption: This is an illustration. J = 6.6 kg·m², 2,950 rpm. The rotor's stored energy, not the motor, supplies a jam torque; the motor's own breakdown torque, about 2.5 times rated or 243 N·m, is negligible beside it.
```

A 60 mm coupling-end stub of the HM-30's shaft would reach a shear stress of 300 MPa, a typical ultimate shear strength for a medium-carbon shaft steel, at a torque of 12.7 kN·m. A hard jam in 0.05 s would demand three times that. No practical shock factor can make the shaft survive it; the shaft would be several times larger than the rest of the machine could justify.

The answer is to limit the jam torque and to prevent jams. The HM-30's swinging hammers help, because a hammer that strikes a solid object swings back on its pin instead of transmitting the full torque. Its coupling has a torque-limiting element that slips or shears at a set multiple of the rated torque, protecting the shaft and the motor. And its inlet has a magnet to catch tramp iron before it reaches the hammers, the subject of [Catching tramp metal](/reados/publications/permanent-magnets-in-machines-by-the-numbers/catching-tramp-metal/). A shaft sized for strength, twist and whirl, with its maximum torque limited by the drive, is a complete design; a shaft sized for strength alone is not.

## Exercise: the coupling-end stub

This is an illustration. Outside the drive-end bearing, the HM-30's shaft steps down to a 60 mm stub that carries a 15 kg coupling half, 120 mm from the bearing. The stub transmits the full 97.1 N·m.

1. What bending moment does the coupling half's weight put on the stub at the bearing?
2. With K_m = 1.5, K_t = 2.0 (the coupling sees the torsional shocks), 40 MPa allowable and a keyway, the shaft design tool gives a strength diameter of 32.2 mm and a twist diameter of 41.1 mm. Which governs, and is the 60 mm stub adequate?
3. Should the twist criterion govern a stub 150 mm long?

**Worked answer.**

1. M = 15 × 9.81 × 0.12 = **17.7 N·m**.
2. The tool reports **twist** as governing at 41.1 mm, since 41.1 > 32.2. The 60 mm stub is larger than both, so it is **adequate** against the tool's criteria; the critical speed criterion does not apply to the stub on its own (the tool's critical-speed input should be left at a very low ratio for this check).
3. **No.** A twist limit per metre makes sense for long shafts. Over a 150 mm stub, even 0.25° per metre is only 0.04°, which is irrelevant. The twist criterion should be judged against the actual length; here strength governs, and the stub is about twice the diameter it needs. Its size is set in practice by the coupling bore and the jam torque the torque limiter allows.
