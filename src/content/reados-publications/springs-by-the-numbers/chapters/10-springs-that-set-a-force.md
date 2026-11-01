---
book: springs-by-the-numbers
chapterSlug: springs-that-set-a-force
order: 10
title: "Springs that set a force: detents, relief valves and spring-applied clamps"
description: "How springs set forces and pressures in machines: ball detent release force, relief valve cracking pressure and overpressure, spring-applied hydraulic release clamps, and records."
draft: false
---

In most of this book a spring's force has been something to keep within limits. In this chapter the force is the product. A detent's spring sets how hard a part must be pushed to move it. A relief valve's spring sets the highest pressure a hydraulic system can reach. A brake's springs set how much torque it holds when the power is off. Get the spring wrong and the machine still runs, but its forces are wrong, sometimes dangerously so.

This chapter checks three such springs on the VM-8 with three WORKOS tools: the ball detent check, the relief valve spring check and the spring clamp hydraulic release check. Each section has its own mistake, because springs that set forces are the ones most often adjusted by people who do not know what they set. The chapter ends with the inspection routine and records that the rebuild left behind for every spring in the machine.

## Ball detents in the tool magazine

Each of the VM-8's 20 magazine pockets holds a tool holder by its flange, and a spring-loaded ball in the pocket wall engages a vee groove in the flange. The ball keeps the holder in its pocket while the magazine indexes, and lets go when the changer arm pulls the holder out. The pull it takes to release is the important number: too low and a heavy holder can shake out of its pocket; too high and the changer arm strains, or faults, every time it extracts a tool. The shop's target, from the changer maker's figures, is 80 to 120 N per detent. This is an illustration.

When the holder is pulled along the pocket, the groove's flank pushes the ball back into its bore against the spring. With a flank angle α measured from the direction of pull, and friction μ at the ball, the force to start the ball moving is the spring's preload times tan(α + arctan μ), the same relation as a wedge.

```figure
type: formula
title: Release force of a ball detent
formula: P = k (L0 − Lw)
formula: F release = P × tan(α + arctan μ)
formula: Locks if α + arctan μ ≥ 90°
caption: P is the spring's preload with the ball seated, α the flank angle of the notch measured from the sliding direction, and μ the friction at the ball's contact. The force applies at the start of release; as the ball rides up, the spring load rises and the contact angle changes.
- k | spring rate
- Lw | fitted length with the ball in the notch
- μ | friction coefficient at the ball
```

The [ball detent check](/tools/ball-detent-check/) takes the notch flank angle, the friction at the ball, the ball's rise out of the notch, the release force range wanted, and the spring's wire, coil, active coils, end type, shear modulus, free length, fitted length and allowable stress. It returns the spring rate, the preload and its stress, the release force, the spring's load and stress when the ball has risen fully out of the notch, and the solid length, with checks on the release force range and the stress at full rise. It refuses a combination of angle and friction that would lock.

```figure
type: steps
title: A magazine pocket detent in the ball detent check
caption: This is an illustration. Flank 45°, ball friction 0.12, rise 2 mm, release range 80 to 120 N; spring 1.6 mm music wire, 9 mm mean diameter, 6.5 active coils, closed and ground, G = 79.3 GPa, free 22 mm, fitted 16 mm, allowable 800 MPa.
- Spring rate | 13.71 N/mm
- Preload / stress | 82.26 N / 585 MPa
- * Release force | 104.7 N: DETENT FORCE IN RANGE
- Spring load / stress at full rise | 109.7 N / 780 MPa
- Solid length | 13.60 mm, 0.4 mm below the length at full rise
```

The spring is small and highly stressed: 780 MPa at full rise, against 800 MPa. The stress at full rise matters because that is where the ball sits every time a holder slides in or out. The solid length is only 0.4 mm below the length at full rise, so the bore's depth tolerance and the ball's seat must be held.

### Choosing the flank angle

The flank angle multiplies the spring's preload, and it does so steeply. With the pocket spring's 82.26 N preload and a friction of 0.12, a 30° flank releases at 61.6 N, 45° at 104.7 N, 60° at 192.3 N and 75° at 573.9 N. At 83.2°, the angle plus the friction angle reaches 90° and the detent locks: no pull along the pocket will push the ball back. Steep flanks therefore make a small spring hold hard, but they also make the release force very sensitive to friction and wear, as the grease showed. The changer maker's 45° groove is a middle choice: firm enough to hold with a small spring, and far enough from locking that a change in friction moves the release force by tens of newtons, not hundreds.

### The mistake: grease in the grooves

A month after the rebuild, the changer began to fault on extraction from some pockets but not others. The faulting pockets had holders whose grooves had been packed with grease to stop rust during storage. The grease mixed with fine swarf and made a paste.

```figure
type: compare
title: Detent release force against groove condition
cols: Flank angle | Friction | Release force, N | Against 80 to 120 N
rowhead: Groove
- * Clean, as designed | 45° | 0.12 | 104.7 | In range
- Grease and swarf | 45° | 0.25 | 137.1 | Too high: changer faults
- Badly worn flank | 35° | 0.12 | 73.7 | Too low: holder can shake out
caption: This is an illustration. Same spring and preload, 82.26 N. Friction at the ball and the angle of the flank both change the release force as much as the spring does.
```

The check with a friction of 0.25 gives 137.1 N, above the range, which matched the faults. The grooves were cleaned and the storage practice changed to a dry film. The table's third line came from the inspection that followed: a few old holders had grooves worn to a flatter flank, and at 35° the release force falls to 73.7 N, low enough for a heavy holder to work loose. Those holders were retired.

## The relief valve

The VM-8's hydraulic unit supplies the drawbar's unclamp cylinder from Chapter 7 and the rotary table brake below, at a working pressure of 6.5 MPa. A direct-acting poppet relief valve protects it. The valve's spring holds a poppet on a 5 mm seat; when the pressure under the seat times the seat's area exceeds the spring's installed load, the poppet lifts and oil passes to tank. The design asks for the valve to crack at 7.0 MPa ± 5%, and to pass full flow at 0.8 mm of lift with no more than 12% rise above the cracking pressure. This is an illustration.

```figure
type: formula
title: A direct-acting relief valve's spring
formula: p crack = k (L0 − Lw) ÷ A,  A = π ds² ÷ 4
formula: p full = k (L0 − Lw + lift) ÷ A
formula: Overpressure = p full ÷ p crack − 1
caption: Lw is the installed length with the valve shut and ds the sealing diameter of the seat. The valve's pressure rises as it opens because the spring is compressed further; a softer spring with more preload gives less overpressure. Flow forces on the poppet, which also affect a real valve, are not included.
- k | spring rate
- lift | poppet lift at full flow
- A | seat area
```

The [relief valve spring check](/tools/relief-valve-spring-check/) takes the seat diameter, full lift, the set pressure wanted with its tolerance, the largest overpressure allowed, and the spring's wire, coil, active coils, end type, shear modulus, free length, installed length and allowable stress. It returns the spring rate and seat area, the installed load and the load at full lift, the cracking and full-lift pressures, the overpressure, the spring stress at full lift, the installed length that would give the wanted pressure, and the room left before solid at full lift. It balances the spring against pressure on the seat area only.

```figure
type: steps
title: The hydraulic unit's relief valve in the relief valve spring check
caption: This is an illustration. Seat 5 mm, lift 0.8 mm, set pressure 7.0 MPa ± 5%, largest overpressure 12%; spring 2.2 mm wire, 14 mm mean diameter, 8 active coils, closed and ground, G = 79.3 GPa, free 40 mm, installed 27.0 mm, allowable 700 MPa.
- Spring rate / seat area | 10.58 N/mm / 19.63 mm²
- Installed load / at full lift | 137.5 / 146.0 N
- * Cracking / full-lift pressure | 7.003 / 7.434 MPa
- Overpressure | 6.2%
- Spring stress at full lift | 604 MPa
- Installed length for 7.0 MPa | 27.01 mm
- Room before solid at full lift | 4.2 mm: VALVE SPRING ADEQUATE
```

The valve is set by its adjusting screw, which changes the installed length. Each 1 mm of screw movement changes the cracking pressure by 10.58 ÷ 19.63 = 0.54 MPa, so the valve is set on a test stand with a gauge, not by counting turns.

### Setting a relief valve

The shop sets the valve on a small test stand rather than on the machine: a hand pump, a calibrated gauge and a sight of the valve's outlet. The pressure is raised slowly until oil first appears at the outlet, which is the cracking pressure, and the adjuster is moved until that reads 7.0 MPa. The adjuster's lock nut is then tightened and marked with paint, so that any later movement shows. On the machine, the gauge's dead-head reading should then sit a little above 7.0 MPa, because at full pump flow the valve is partly open and the spring is compressed a little further. A reading far above the set pressure, as the VM-8 gave when it arrived, means the valve is not doing its job.

### The mistake: screwed down for speed

On the VM-8 as delivered, the unit's gauge read 9.4 MPa when the pump was dead-headed, not 7. A previous owner, finding the tool release slow, had screwed the relief valve's adjuster down to raise the pressure. Measured, the spring's installed length was 22.6 mm.

Entered with that length, the relief valve check refuses the case: at full lift the spring would be 21.8 mm long, shorter than its 22.0 mm solid length. The valve cracks at 9.37 MPa, but cannot open to its full 0.8 mm before the spring goes solid, so at full pump flow it cannot pass all the oil, and the pressure rises until something else gives. The unclamp cylinder and the brake piston were both rated for 10 MPa. This is an illustration.

The adjuster was reset to 27.0 mm on the test stand, the valve cracked at 7.0 MPa, and the slow tool release was traced to a partly blocked filter. A relief valve set above its design to cure a slow machine treats a symptom and removes the protection.

## The rotary table brake

The VM-8's fourth axis is a rotary table that must be held still while it is machined in a fixed position. Its brake is spring-applied and hydraulically released: twelve coil springs press a clamping ring against the table's brake disc, and to rotate the table, hydraulic pressure on an annular piston pushes the ring back against the springs. If the power or pressure fails, the springs clamp the table. The design needs at least 6.0 kN of clamping force. This is an illustration.

The [spring clamp hydraulic release check](/tools/spring-clamp-hydraulic-release/) takes the clamping force needed, the number of springs, the release stroke, each spring's wire, coil, active coils, end type, shear modulus, free length and clamped length and the allowable stress, the release piston's outside and inside diameters, an allowance for seal friction and the pressure available. It returns each spring's rate and clamped load, the total clamping force, the load at release, the piston area, the release pressure, and the spring stresses clamped and released, with checks on the clamping force, the release pressure and the stress. It assumes the springs share the load equally.

```figure
type: steps
title: The rotary table brake in the spring clamp hydraulic release check
caption: This is an illustration. 12 springs of 5 mm wire, 25 mm mean diameter, 6 active coils, closed and ground, free 56 mm, clamped 48 mm; release stroke 1.2 mm; piston 90 × 60 mm; seal friction 10%; pressure available 65 bar; clamp needed 6,000 N; allowable 700 MPa.
- Spring rate / clamped load each | 66.08 N/mm / 528.7 N
- * Clamping force | 6,344 N
- Load at release, all springs | 7,296 N
- Piston area | 3,534 mm²
- Release pressure | 22.7 bar against 65 bar available
- Spring stress clamped / released | 353 / 406 MPa: CLAMP ADEQUATE
```

The release pressure has a wide margin, so the brake releases even with the unit's pressure low. The clamping force has a narrower one, 6% above the need, and the tool's last check warns why that matters: as the brake's linings wear, the clamping ring moves closer to the disc, the springs extend, and the force falls.

### Twelve springs sharing a load

The check assumes the twelve springs share the clamping force equally. They do only if they have the same rate and free length and sit in pockets of the same depth. A spring 0.5 mm shorter than the others carries 33 N less; a pocket 0.5 mm deeper does the same. Each alone matters little against a margin of 344 N, but a set of springs bought at different times can differ by more than that, and their errors add. The rebuild replaced all twelve springs as one batch, checked their free lengths on a surface plate to within ± 0.2 mm, and measured the pocket depths, so that the twelve really did act as one spring of twelve times the rate.

### How much wear the brake can take

Each spring must give at least 6,000 ÷ 12 = 500 N, which needs a deflection of 500 ÷ 66.08 = 7.57 mm from its 56 mm free length: a clamped length of no more than 48.43 mm. The brake leaves the factory clamped at 48.0 mm, so it can lose only 0.43 mm to wear before it falls below 6.0 kN.

```figure
type: bars
title: Rotary table clamping force against lining wear
x: Lining wear
y: Clamping force, N
caption: This is an illustration. Twelve springs of 66.08 N/mm, clamped at 48.0 mm when new. The brake needs 6,000 N. Shimming the springs back to 48.0 mm restores the force.
- New, 48.0 mm | 6344
- 0.2 mm worn | 6185
- * 0.43 mm worn, the limit | 6000
- 0.5 mm worn | 5947
- 1.0 mm worn | 5551
```

The shop's maintenance plan measures the brake's air gap at each annual service and shims the spring seats back to the design length when wear reaches 0.3 mm, leaving a margin below the 0.43 mm limit.

## The rebuild's spring records

By the end of the rebuild every spring in the VM-8 had a line in a register: what it does, its specification, the WORKOS check that confirmed it, the figure that shows it is healthy, and how often that figure is checked.

```figure
type: compare
title: The VM-8's spring inspection routine
cols: Health check | Limit | Interval
rowhead: Spring
- Changer lock plunger | Pin force with a push–pull gauge; cam stop setting | At least 50 N; 38 mm retracted | Annual
- Fixture pad springs | Combined force at 52 mm on the tester | 650 to 900 N | At each fixture overhaul
- Magazine shutter springs | Close fully; hooks inspected | No open coils or cracked hooks | Six-monthly
- Drawbar stack | Clamping force with the drawbar gauge | 9.5 kN investigate, 9.0 kN stop | Quarterly
- Top hatch springs | Hatch holds open and rests shut | No drift | Six-monthly
- Rear panel bar | Handle force at mid-travel | At most 50 N | Annual
- Pocket detents | Release force on a sample of pockets | 80 to 120 N | Six-monthly
- Relief valve | Cracking pressure on the gauge | 7.0 MPa ± 5% | Annual
- Rotary table brake | Air gap and lining wear | Shim at 0.3 mm wear | Annual
caption: This is an illustration. Each limit comes from a calculation in this book. The intervals are the shop's choices and are reviewed after the first year's results.
```

The register also records which springs hold significant stored energy, from Chapter 1, and points to the release procedure for each. That satisfies the shop's duty under the model Code of Practice for managing the risks of plant to identify stored energy and control it during maintenance, and it means the next fitter to open the drawbar or the rear panel finds the procedure before the spring finds them.

## Exercise: a stronger brake

The shop is asked whether the rotary table brake could hold 7.0 kN for a heavier fixture by shimming the springs to a shorter clamped length. What clamped length would give 7.0 kN, what release pressure would then be needed, and what would the spring stress be at release?

### Worked answer

Each spring must give 7,000 ÷ 12 = 583.3 N, a deflection of 583.3 ÷ 66.08 = 8.83 mm, so the clamped length is 56 − 8.83 = 47.17 mm. At release the springs are compressed a further 1.2 mm to 45.97 mm, a deflection of 10.03 mm and a load of 662.6 N each, 7,951 N in total.

The release pressure is 7,951 × 1.1 ÷ 3,534 = 2.475 MPa, or 24.7 bar, well within 65 bar. The stress at release, with an index of 5 and a Wahl factor of 1.310, is 1.310 × 8 × 662.6 × 25 ÷ (π × 125) = 442 MPa, within 700 MPa. The released length, 45.97 mm, stays above the solid length of 40 mm.

The spring clamp check, entered with a clamped length of 47.17 mm, confirms a clamping force of 7,000 N, a release pressure of 24.7 bar and stresses of 389 and 442 MPa. The brake can be made stronger this way, but the wear allowance shrinks to nothing: at 47.17 mm any wear at all takes it below 7.0 kN, so the shimming interval would have to be much shorter. The shop recommended a second brake caliper for the heavier fixture instead.
