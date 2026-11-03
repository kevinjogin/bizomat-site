---
book: vibration-monitoring-by-the-numbers
chapterSlug: unbalance-and-balancing
order: 6
title: "Unbalance and balancing in place"
description: "How unbalance makes a 1× vibration, the force on the bearings, balance quality grades, single-plane balancing with a trial weight and vectors, splitting a correction, and a trial weight left on."
draft: false
---

Unbalance is the commonest cause of excessive vibration in rotating machinery, and the easiest to recognise and correct. A rotor whose mass is not evenly distributed about its axis of rotation carries a heavy spot around with it, and the spot's centrifugal force pulls the rotor, and its bearings, towards it once each revolution. The result is a vibration at exactly the running speed, 1×, in the radial directions, steady in amplitude and phase. On fans handling dusty or sticky air, unbalance grows as material builds up unevenly on the blades or flakes off, and correcting it in place, with the fan on its own bearings, is a routine job for a vibration technician.

This chapter explains how unbalance produces vibration and how large the force on the bearings becomes, sets out balance quality grades and the permissible residual unbalance they give, works a single-plane balance on F-2 with a trial weight and vector arithmetic using the KEVOS complex number and balancing tools, splits the correction between blade positions, and finishes with a trial weight that was never removed.

## How unbalance makes vibration

A mass m at a radius r from the axis, rotating at angular speed ω, needs a centripetal force m r ω² to keep it on its circle. That force is supplied by the rotor, and through the rotor by the bearings; equally, the bearings feel an outward force of the same size, rotating with the shaft. The product m r is the unbalance, usually quoted in gram-millimetres, and the force grows with the square of the speed.

```figure
type: formula
title: Force from an unbalance
formula: F = m × r × ω²        ω = 2π × n ÷ 60
formula: Unbalance: U = m × r        Specific unbalance or eccentricity: e = U ÷ M
caption: m is the unbalance mass, r its radius, n the speed in r/min, and M the rotor's mass. Doubling the speed quadruples the force from the same unbalance.
- F | rotating force on the bearings, N
- U | unbalance, g·mm
- e | eccentricity of the rotor's centre of mass, µm
```

F-2's impeller weighs 120 kg and runs at 1,480 r/min, ω = 155.0 rad/s. Dust building up unevenly on its blades can easily add 60 g more on one side than the other at a radius of 450 mm, an unbalance of 27,000 g·mm. At full speed that pulls on the bearings with 0.060 × 0.450 × 155.0² = 649 N, rotating once per revolution, more than half the impeller's own weight of 1,177 N. The bearings and supports respond with a 1× vibration that grows in direct proportion to the unbalance, as long as the machine's structure behaves linearly.

### The signature of unbalance

Unbalance produces vibration at 1× in both radial directions, usually of similar size on a symmetrical machine and larger horizontally if the support is less stiff that way. The phase difference between the horizontal and vertical readings at a bearing is close to 90°, because the same rotating force is seen a quarter of a revolution apart. On an overhung impeller like F-2's, unbalance also produces some axial vibration, which is a known exception to the rule that unbalance is radial. Little appears at 2× or above.

```figure
type: compare
title: F-2 before cleaning and balancing, outboard bearing
cols: 1× velocity | 1× phase | 2× and above
rowhead: Direction
- Horizontal | 5.0 mm/s RMS | 40° | small
- Vertical | 3.6 mm/s RMS | 128° | small
- Axial | 1.9 mm/s RMS | 35° | small
caption: This is an illustration. Horizontal and vertical phases differ by 88°, close to the 90° expected of unbalance; the axial reading is typical of an overhung rotor.
```

## How well balanced is well enough?

No rotor is perfectly balanced. Balance quality grades, defined in the ISO 21940 series for rigid rotors, express the acceptable residual unbalance as a G number, which is the eccentricity of the rotor's centre of mass multiplied by its angular speed, in mm/s. Fans are commonly balanced to grade G 6.3. For F-2, the permissible eccentricity is 6.3 ÷ 155.0 = 0.0406 mm, 40.6 µm, and the permissible residual unbalance for the 120 kg impeller is 120,000 g × 0.0406 mm = 4,878 g·mm, equivalent to about 10.8 g at the blades' 450 mm radius.

The [rotor balancing check](/tools/rotor-balancing-check/) works the same grade calculation for a two-plane rotor and splits the permissible unbalance equally between the planes. For F-2, with 120 kg, 1,480 r/min and grade G 6.3, it gives a permissible eccentricity of 40.65 µm and 2,439 g·mm per plane. Entered with the dust's 60 g at 450 mm in one plane, it gives an unbalance of 27,000 g·mm, a rotating force of 649 N and a correction of 60 g, which it flags as larger than a practical 50 g correction weight: the impeller needs cleaning before balancing, not a large balance weight to offset the dust.

### Before balancing, confirm it is unbalance

A balance job is quick, but done on the wrong fault it wastes a shutdown and can mask the real problem. The mill's technician checks five things first. The vibration is dominated by 1×, with little at 2× and above. The horizontal and vertical 1× phases differ by roughly 90°. The 1× amplitude is steady from reading to reading, not wandering. The 1× amplitude rises with speed roughly as the square, where the speed can be varied, rather than peaking at one speed, which would point to resonance. And the machine's mountings are tight and its alignment is within tolerance, because a soft foot or a misaligned coupling can produce 1× vibration that balancing will not fix. On F-2, all five held, and the cleaning that came first removed the dust before any weight was added.

## Balancing in place with a trial weight

Balancing in place uses the machine's own response to find where the heavy spot is and how heavy it is. The method rests on linearity: adding a known weight changes the 1× vibration by an amount proportional to that weight, so measuring the change once gives the machine's sensitivity, and the correction follows by vector arithmetic.

```figure
type: steps
title: Single-plane balancing with one trial weight
caption: Phases must be measured with the same reference and convention throughout; angles of weights are measured in the same sense as the phase readings.
- Measure the original 1× vibration, O, amplitude and phase, at a chosen point and direction
- Fit a trial weight T of known mass at a marked angular position
- Measure the new 1× vibration, O + T effect, at the same point, direction and speed
- Calculate the effect of the trial weight: (O + T) − O, by vector subtraction
- * Correction weight W = −(O ÷ effect) × trial weight, by complex division
- Remove the trial weight, fit W, and check the residual vibration
```

On F-2, after its blades had been cleaned, the outboard bearing's horizontal 1× vibration was O = 5.0 mm/s at 40°. A 30 g trial weight bolted to a blade at the 0° mark changed it to 7.2 mm/s at 95°. Each reading is a vector, an amplitude and an angle, and the arithmetic is the arithmetic of complex numbers.

In rectangular form, O = 3.830 + 3.214i and O + T = −0.628 + 7.173i, so the trial weight's effect was −4.458 + 3.959i, a vector of 5.96 mm/s at 138.4°. The machine's sensitivity is 5.96 ÷ 30 = 0.199 mm/s per gram at that point. A trial weight should be large enough to change the vibration clearly, by at least 30% in amplitude or 30° in phase, so that the effect is not lost in the scatter of the readings, but not so large that it drives the vibration to an unsafe level during the trial run. The 30 g trial on F-2 was chosen from the rule that its centrifugal force should be about a tenth of the rotor's weight: 0.030 × 0.450 × 155.0² = 324 N, a little over a quarter of 1,177 N, on the generous side because the fan was known to be robust.

The [complex number calculator](/tools/complex-number/) performs the division. Dividing O, 3.8302 + 3.2139i, by the effect, −4.4577 + 3.9587i, gives 0.8387 at −98.4°. The correction is minus that ratio times the 30 g trial weight: 0.8387 × 30 = 25.2 g, at −98.4° + 180° = 81.6°. A 25.2 g weight at 81.6° from the trial weight's position should cancel the original vibration.

```figure
type: stats
title: F-2's single-plane balance
caption: This is an illustration. Vector arithmetic from the complex number calculator; residual measured after fitting the correction.
- 5.0 mm/s at 40° | original 1× vibration, outboard horizontal
- 7.2 mm/s at 95° | with a 30 g trial weight at 0°
- 5.96 mm/s at 138.4° | effect of the trial weight
- 25.2 g at 81.6° | calculated correction
- 0.8 mm/s | residual 1× after correction
```

### Splitting the correction between blades

A balance weight can only be fixed where the impeller has somewhere to fix it: on F-2, on its eight blades at 45° spacing. A correction at 81.6° falls between the blades at 45° and 90°, so it is split into two weights on those blades whose vector sum equals the correction. Solving the two components, 5.2 g at 45° and 21.2 g at 90° give the required vector.

The [counterbalancing masses in one plane tool](/tools/rotating-balance-plane/) checks the split. Entered with 5.2 g at 45° and 21.2 g at 90°, both at 450 mm, it gives a resultant of 11,316 g·mm at 81.6°, equal to 25.15 g at 450 mm in the required direction. The weights were welded to the blades, the trial weight removed, and the residual 1× vibration fell to 0.8 mm/s, within the permissible unbalance and an improvement of more than six times.

## The mistake: a trial weight left on

The first time the mill balanced F-2, a contractor fitted the calculated correction but left the 30 g trial weight bolted to its blade, intending to remove it after a final reading. The final reading was taken with the trial weight still in place, came out at 6.1 mm/s, and the contractor, short of time, recorded it as "balanced, improvement limited by fan condition" and left.

```figure
type: steps
title: Finding the forgotten trial weight
caption: This is an illustration. The correction assumes the trial weight is removed; left on, it adds its own effect to the residual.
- Recorded result | 6.1 mm/s after "balancing", worse than expected
- Arithmetic | residual with trial weight left on ≈ the trial weight's own effect, 5.96 mm/s at 138°
- Inspection at the next stop | 30 g trial weight still bolted to a blade at 0°
- * Fix | trial weight removed; 1× vibration fell to 0.9 mm/s
- Procedure changed | trial weights painted red and logged on the job card; job not closed until the log shows them removed
```

The mill's technician, reviewing the job, noticed that a residual of about 6 mm/s at about 140° was almost exactly the trial weight's own effect: the correction had cancelled the original unbalance, and the trial weight, still in place, was now the only unbalance left. At the next stop, the trial weight was found bolted to its blade. Removed, the vibration fell to 0.9 mm/s. Trial weights are now painted red, logged on the job card with their position, and the job cannot be closed until the card shows each one removed or deliberately left and included in the calculation.

## Safety and records

Balancing in place means stopping, isolating and restarting a machine several times, and fixing weights to a rotor that will spin at full speed. Each start must follow the site's isolation procedure, and each weight must be fixed so that it cannot come off: a trial weight bolted with a locking nut or tack-welded, a final weight welded fully by a qualified welder, never just a clamp or magnet. A weight that leaves a fan at 1,480 r/min carries the energy of a bullet. The mill's record of each balance job lists the original, trial and final readings with their phases, the trial weight's mass and position, the correction calculated, the weights fitted and where, and the residual. That record makes the next balance on the same fan quicker, because the sensitivity found this time can be used to estimate the correction next time without a trial run.

## When single-plane balancing is not enough

Single-plane balancing corrects the unbalance in one plane, which is enough for a narrow rotor like F-2's overhung impeller. A long rotor, such as a motor's armature or a multi-stage pump's shaft, can have unbalance at both ends acting in different directions, a couple unbalance, which rocks the rotor and shows as 1× vibration out of phase between its two bearings. Correcting it needs weights in two planes and a two-plane calculation with two trial runs, each trial weight affecting both bearings. The rotor balancing check handles that arithmetic for known unbalances. Very flexible rotors running above a bending critical speed need modal balancing, a specialist job.

Balancing also corrects only unbalance. If the 1× vibration comes from a bent shaft, an eccentric pulley, a cracked rotor, a soft foot or a resonance, balancing will appear to work at one speed and fail at another, or not work at all. A balance job that needs repeated corrections, or whose results drift, is a sign that the 1× has another cause, which Chapter 7 considers.

## Exercise: balancing a second fan

The mill's kiln fan has a 1× vibration of 4.2 mm/s at 300° at its bearing. A 20 g trial weight at 0° changes it to 2.6 mm/s at 20°. Using the method of this chapter, calculate the trial weight's effect, the machine's sensitivity in mm/s per gram, and the correction weight and its angle. Then say what the residual would be if the trial weight were left on after the correction was fitted.

### Answer

**Given:** O = 4.2 mm/s at 300°; O + T = 2.6 mm/s at 20°; trial weight 20 g at 0°.

**Assumptions:** linear response; same speed, point, direction and phase reference for both readings.

**Method:** convert to rectangular form; effect = (O + T) − O; W = −(O ÷ effect) × 20 g.

**Rectangular forms:** O = 4.2 cos 300° + 4.2 sin 300° i = 2.100 − 3.637i; O + T = 2.443 + 0.889i.

**Effect:** 0.343 + 4.526i, which is 4.54 mm/s at 85.7°.

**Sensitivity:** 4.54 ÷ 20 = 0.227 mm/s per gram.

**Ratio O ÷ effect:** 4.2 ÷ 4.54 = 0.925 in magnitude, at 300° − 85.7° = 214.3°.

**Correction:** W = −0.925 × 20 g at 214.3°, which is 18.5 g at 214.3° − 180° = 34.3°.

**Trial weight left on:** the correction cancels the original unbalance, leaving the trial weight's own effect, about 4.5 mm/s at 85.7°, roughly as large as the original 4.2 mm/s, so the balance job would appear to have achieved nothing.

**Verification:** adding the correction's predicted effect, 18.5 × 0.227 = 4.2 mm/s at 34.3° + 85.7° = 120°, to the original 4.2 mm/s at 300° gives zero, since the two are equal and opposite.
