---
book: clutches-and-brakes-by-the-numbers
chapterSlug: motor-brakes-holding-and-proof
order: 10
title: "Motor brakes, holding and proof"
description: "How to size a spring-applied motor brake for stop time, distance, energy and holding factor, why a hoist tool differs on a slipway, and how to prove and record a brake."
draft: false
---

Every electric winch, hoist and many conveyors carry a brake on the motor itself: a disc pressed by springs whenever the power is off and pulled free by an electromagnet whenever it is on. It is the brake that holds the load when the operator stops, catches it when the power fails, and keeps it still while someone works on the machine. Because it sits on the fastest shaft, it is small; because it acts at every stop, its energy per hour matters as much as its torque.

This chapter checks the SW-25's spring-applied motor brake with the BIZOMAT holding brake sizing tool for both directions of travel, then compares the result with the winch drum brake check tool and explains why that tool, designed for hoists, gives a different answer on a slipway. It closes with proof tests and the records that show all the book's devices are fit for their duty. Its mistake is a brake rating read from the wrong column of a catalogue.

## The brake and its duty

The SW-25's motor carries a spring-applied brake with a dynamic torque rating of 40 N·m. Its engagement delay, from the power going off until the brake produces torque, is 0.08 s. Chapter 1 gave the inertia at the motor shaft: 0.040 kg·m² for the rotor, brake disc and coupling, 0.0112 kg·m² for the boat, cradle and drum seen through 450:1, and 0.0006 kg·m² for the gears, 0.0518 kg·m² in all. At 1,450 rpm that holds 598 J of kinetic energy, of which the motor's own parts hold 461 J.

The load torque at the motor depends on the direction. Hauling, the load resists the motor with 18.85 N·m. Lowering under power, with the clutch engaged and the motor holding back the boat, the load drives the motor with 12.13 N·m, the gear losses helping. Holding still, the load torque is the same 12.13 N·m.

The yard's rules for the motor brake are these illustrations: a total stop within 0.5 s from full speed in either direction, a holding factor of at least 2 on the static load torque, and energy within the brake maker's limits of 5 kJ per stop and 100 kJ an hour, with up to ten stops an hour.

## The holding brake sizing tool

The [holding brake sizing tool](/tools/holding-brake-sizing/) takes the speed at the brake, the total inertia at the brake shaft, the load torque there, whether the load drives through the stop or helps it, the brake's dynamic torque, the engagement delay and the required total stop time; then the required holding factor, the permissible energy per stop, the stops per hour and the permissible energy per hour. It returns the kinetic energy, the net decelerating torque, the slip time and total stop time including the delay, the stopping angle, the friction energy per stop and per hour, the brake torque that would meet the required stop time, and the holding factor, with checks on time, holding and both energies. It assumes the brake's torque is constant once engaged and that speed does not change during the delay.

```figure
type: steps
title: The SW-25's motor brake, lowering under power
caption: This is an illustration. 1,450 rpm, J = 0.0518 kg·m², load torque 12.13 N·m driving through the stop; brake 40 N·m, delay 0.08 s, required stop 0.5 s, holding factor 2, 5 kJ per stop, 10 stops an hour, 100 kJ an hour.
- Kinetic energy at the brake | 0.598 kJ
- Net decelerating torque | 27.87 N·m
- Slip time and total stop time | 0.282 s and 0.362 s
- Stopping angle | 5.35 motor revolutions
- * Energy per stop | 0.857 kJ
- Energy per hour | 8.6 kJ
- Brake torque for 0.5 s | 30.9 N·m
- Holding factor | 3.30: BRAKE SUITABLE
```

The lowering stop takes 0.362 s, within 0.5 s, and the motor turns 5.35 revolutions while it stops: 1.93 during the delay and 3.41 while the brake slips. Each motor revolution is π × 600 ÷ 450 = 4.19 mm of rope, so the boat moves about 22 mm down the slip after the power fails. The brake absorbs 857 J, more than the 598 J of kinetic energy, because the overhauling load keeps driving the drive train while the brake slips: 598 J of kinetic energy plus 12.13 N·m times the 3.41 slip revolutions.

### Hauling: the load does most of the work

```figure
type: compare
title: The motor brake in the two directions of travel
cols: Lowering under power | Hauling
rowhead: Result
- Load during the stop | Drives through, 12.13 N·m | Helps, 18.85 N·m
- Net decelerating torque | 27.87 N·m | 58.85 N·m
- Total stop time | 0.362 s | 0.214 s
- Rope travel after the power fails | 22 mm | 15 mm
- * Energy per stop | 0.857 kJ | 0.406 kJ
- Brake torque for 0.5 s, as reported | 30.9 N·m | 0 N·m
caption: This is an illustration. Brake 40 N·m, delay 0.08 s, J = 0.0518 kg·m². Hauling, the boat's weight would stop the drive in time on its own; the tool reports zero brake torque needed for the stop, and the brake's job is to hold the boat once it has stopped.
```

Hauling, the load helps: the net decelerating torque is 40 + 18.85 = 58.85 N·m, and the drive stops in 0.214 s. The tool reports that no brake torque is needed to stop within 0.5 s, because the load alone would do it. That is true and incomplete: once stopped, the boat would start back down the slip, and the brake must then hold it. The holding factor the tool reports for this case, 2.12, is calculated against the hauling torque entered; against the static holding torque of 12.13 N·m it is 3.30, as in the lowering case.

## The winch tool, and why the slipway is different

The [winch drum brake check tool](/tools/winch-drum-brake-check/) works the same problem from the winch's own data: the rope load, the drum diameter, the gear ratio and efficiency, the motor speed and the motor, brake and coupling inertia, followed by the same brake data as the holding brake tool. It calculates the drum torque, the load torque at the brake with the gear efficiency helping, the rope speed, and the inertia at the brake including the load reflected through the drum and gears, then the stop time, the stop distance of the rope, the holding factor and the energies, treating the load as overhauling.

The tool reflects the load's inertia as the rope load's mass, F ÷ g, seen through the drum radius and gear ratio. For a hoist, where the rope carries a hanging mass, that is exactly right. On a slipway the rope carries only the component of the weight along the slope, 20,367 N for a 25 t boat, while the whole 25 t must be stopped. Entered with the slipway's rope load, the tool treats the moving mass as 20,367 ÷ 9.81 = 2,077 kg instead of 25,000 kg.

```figure
type: compare
title: The SW-25's lowering stop, two tools
cols: Inertia at the brake | Total stop time | Rope travel | Energy per stop
rowhead: Method
- Winch drum brake check, rope load 20.37 kN | 0.0415 kg·m² | 0.306 s | 19.5 mm | 0.687 kJ
- * Holding brake sizing, full 25 t reflected | 0.0518 kg·m² | 0.362 s | 22.4 mm | 0.857 kJ
caption: This is an illustration. Same brake, delay, ratio and load torque at the brake, 12.13 N·m, and the same holding factor, 3.30. The winch tool's model of the load as a hanging mass understates the inertia of a load on a slope; the difference here is 20% in inertia and 13% in stopping distance.
```

The two tools agree on the load torque, 12.13 N·m, and on the holding factor, 3.30. They differ only in the inertia, and the difference is modest here because the motor's own inertia dominates. On a winch with a lower ratio, or a heavier load on a gentler slope, it would be larger. The yard used the holding brake sizing tool with the full inertia as its design check, and kept the winch tool's result as a complement that confirmed the torque calculation.

## The mistake: the static rating

The brake maker's catalogue lists two torques for each size: a static torque, the torque the brake holds without slipping, and a dynamic torque, the torque it produces while slipping. For the SW-25's brake they are 50 N·m and 40 N·m. The first run of the tool used 50 N·m.

Static friction is higher than sliding friction, as Chapter 2 explained, and a brake stopping a moving load is sliding. With 50 N·m the lowering stop would appear to take 0.29 s instead of 0.36 s. The error was in the unsafe direction, and it was found because the reviewer asked which column the number came from. The holding factor uses the static figure, or conservatively the dynamic one; the stop must use the dynamic one. The yard's sheet now records both, with the column named.

A worse error would be a brake that is simply too small. With a 20 N·m brake the lowering stop takes 1.08 s and the holding factor is 1.65; the tool reports BRAKE NOT SUITABLE on both counts. The kinetic energy and the overhauling load together would have made the stop twice as long as the target.

## The air gap and a brake that drags

A spring-applied brake is released by an electromagnet that pulls an armature plate away from the friction disc against the springs. The magnet's pull falls steeply as the gap it must close grows, and the gap grows as the friction linings wear. A brake that released cleanly when new can, after enough wear, reach a gap the magnet can no longer close. The brake then fails to release fully, and the motor drives against a dragging brake.

A dragging brake is not merely inefficient. It turns the motor's power into heat in a part designed to absorb energy only during stops, and the brake maker's hourly energy limit, 100 kJ for the SW-25's brake, is reached very quickly. A drag of just 4 N·m at 1,450 rpm is 4 × 151.84 = 607 W, or 2,186 kJ an hour, more than twenty times the limit. The lining glazes, its friction falls, and the brake that was dragging becomes a brake that slips when it is needed.

The defence is maintenance, not calculation. The brake's air gap is measured with feeler gauges at the service interval the maker gives, and reset or the friction disc replaced when it reaches the maker's maximum. The yard also listens: a brake that drags often squeals at start-up, and a brake whose release is marginal clicks late. Both are recorded as defects.

## How the SW-25's brakes work together

The refit leaves the SW-25 with three brakes, each designed for a different job, and the numbers in this book show why each is where it is.

The motor brake, on the fastest shaft, is small and quick. It stops the drive train at the end of every power-driven movement and holds the boat whenever the motor is stopped with the clutch engaged. Its energies are under a kilojoule a stop, and its main enemies are wear of the air gap and a static rating mistaken for a dynamic one.

The band brake, on the drum, controls every lowering with the clutch out. It is applied by a weight and released by the operator, so it fails safe. Its job is mostly heat: up to 1,222 kJ in a lowering, more than a thousand times a motor-brake stop. Its enemies are anchoring the wrong way round, a wet lining and a rim that has not cooled.

The caliper, also on the drum, is the independent second brake. It does nothing in normal use and everything in an emergency, so its numbers are its surplus over the overhauling load, its delay and its trip speed. Its enemies are contaminated pads and a delay longer than assumed.

No single brake on the SW-25 is relied on alone for a lowering, and every one has been checked with its friction at the low end of its range. That, more than any single calculation, is what makes the winch safe to use.

## Proof and records

A brake calculation shows what a brake should do; a proof test shows what it does. The yard's commissioning and annual tests for the SW-25's brakes are these illustrations, prepared for its own winch and checked against the maker's instructions and the applicable standard by the competent person who signs the winch off.

```figure
type: checklist
title: SW-25 brake proof and records
caption: This is an illustration. Rope travel is measured from a chalk mark on the drum against a fixed pointer.
- x Motor brake static holding: torque arm on the motor shaft, slips above 50 N·m
- x Motor brake dynamic stop: power cut while lowering at full speed, rope travel at most 30 mm
- x Band brake: holds the largest boat on the slip with the clutch out and the motor stopped
- x Band brake: stop from 10 m/min by releasing the lever, rope travel recorded
- x Caliper: hydraulic delay measured; stop from the trip speed with the band released
- x Clutch: slip torque bench test, spring force at the worn limit
- x Lining thickness, drum and disc condition, rim temperature after a lowering
- x Every result recorded with the date, the boat's mass and the person testing
```

The static test on the motor brake uses the brake arm of Chapter 2: an arm 0.5 m long on the motor shaft and a spring balance, with the brake applied and the motor isolated. A slip at 80 N on the balance is 40 N·m; the maker's static rating of 50 N·m corresponds to 100 N. The dynamic test compares the measured rope travel after a power cut with the calculated 22 mm. A travel that has grown between tests is the earliest sign of a worn or contaminated brake, and is worth more than a single pass.

Under the model WHS laws, plant such as the SW-25 must be inspected and maintained so that it remains safe, and its brakes are among the parts that matter most. The records are how the yard shows that it has done so, and how the next engineer will know what the brakes were designed to do.

## Exercise: a hoist's motor brake

**Problem.** A hoist motor runs at 1,450 rpm with 0.08 kg·m² at the brake shaft. The load torque at the brake is 25 N·m. The brake is rated at 60 N·m dynamic, with a delay of 0.10 s. The hoist must stop within 0.6 s, with a holding factor of 2. Find (a) the stop time when lowering, (b) the energy per stop and, at 30 stops an hour, per hour, (c) the brake torque that would just meet 0.6 s, and (d) the stop time when raising.

**Answer.** ω = 151.84 rad/s.

(a) Lowering, the load drives: net torque = 60 − 25 = 35 N·m. Slip time = 0.08 × 151.84 ÷ 35 = 0.347 s. Total = 0.447 s, within 0.6 s.

(b) Energy = 60 × 151.84 × 0.347 ÷ 2 = 1,581 J, or 1.58 kJ. Per hour: 1.581 × 30 = 47.4 kJ.

(c) Torque for 0.6 s: 0.08 × 151.84 ÷ (0.6 − 0.1) + 25 = 49.3 N·m. The 60 N·m brake has a margin.

(d) Raising, the load helps: net torque = 85 N·m, slip time 0.143 s, total 0.243 s. Holding factor = 60 ÷ 25 = 2.40, which meets the requirement of 2.
