---
book: variable-speed-drives-by-the-numbers
chapterSlug: starting-stopping-and-braking
order: 8
title: "Starting, stopping and braking"
description: "How a drive starts a high-inertia fan compared with a direct-on-line start, where its energy goes when slowed, why short stop ramps trip drives on overvoltage, and how to size braking."
draft: false
---

A drive changes the two moments in a machine's life that cause the most stress: starting and stopping. A direct-on-line start slams a motor from standstill to full speed with six or seven times its rated current and a burst of torque; a drive can bring it up smoothly at little more than its running current. Stopping is the other way round. A motor disconnected from the mains simply coasts, but a drive asked to stop a machine quickly has to take the machine's kinetic energy from somewhere, and the motor turns it back into electricity that flows into the drive's DC link with nowhere to go.

This chapter works F-1's start with the BIZOMAT rotor run-up tool, both direct-on-line and on the drive, then follows the fan's kinetic energy through a stop. It explains overvoltage trips and braking resistors, and ends with a stop ramp shortened for convenience.

## The fan's inertia

F-1's impeller is about 1,000 mm in diameter and weighs about 120 kg; its hub and pulley about 25 kg on a 400 mm diameter. Treated as discs, their moments of inertia are m D² ÷ 8: 120 × 1.0² ÷ 8 = 15.0 kg·m² and 25 × 0.4² ÷ 8 = 0.5 kg·m². The motor's rotor, about 0.25 kg·m² at the motor shaft, is reflected to the fan shaft through the belt drive's ratio of 1,800 ÷ 1,482 = 1.215 as 0.25 ÷ 1.215² = 0.169 kg·m². In all, 15.67 kg·m² spinning at 1,800 rpm, 188.5 rad/s, stores ½ × 15.67 × 188.5² = 278 kJ, about as much as a one-tonne car at 85 km/h.

## Starting direct on line

Before its drive, F-1 started direct on line. An induction motor starting across the line produces a torque that varies with speed, typically about twice rated torque on average during the run-up for a motor of this kind, while drawing six to seven times rated current until it nears full speed. Referred to the fan shaft through the belt, with the belt's 95% efficiency, the average motor torque was about 2 × 194.2 × 1.215 × 0.95 = 448 N·m. The fan's own torque rises with the square of speed, from almost nothing to about 108 N·m at full speed with the damper open, an average of about 36 N·m over the run-up.

The [rotor run-up time tool](/tools/rotor-run-up-time/) adds the inertias, works the run-up time from the average accelerating torque, and estimates the energy dissipated in the motor's rotor during the start, which limits how often a motor may be started.

```figure
type: compare
title: F-1 started direct on line, from the rotor run-up time tool
cols: Value
rowhead: Result
- Total inertia at the fan shaft | 15.669 kg·m²
- Run-up time | 7.17 s, 107.5 revolutions
- Stored energy at full speed | 278.36 kJ
- Rotor energy per start | 302.69 kJ
- * Starts per hour allowed, maker's limit 1,500 kJ an hour | 4 starts, 1,211 kJ: START ACCEPTABLE; 6 starts, 1,816 kJ: START NOT ACCEPTABLE
caption: This is an illustration. Average motor torque 448 N·m and load torque 36 N·m at the fan shaft, final speed 1,800 rpm; allowed start time 15 s; the hourly rotor energy limit is an assumed figure of the kind a motor maker gives for a motor of this size.
```

During a direct-on-line start, the rotor of an induction motor dissipates at least as much heat as the kinetic energy it gives the load, because every joule passed to the load crosses the air gap with full slip at the start and less as the motor accelerates. With a load torque opposing it, it dissipates more: the tool's 302.7 kJ per start is the stored 278.4 kJ times 448 ÷ (448 − 36). That heat is concentrated in the rotor bars and is why motor makers limit starts per hour for high-inertia loads.

## Starting on the drive

On the drive, F-1 starts on a ramp. The drive raises the frequency gradually, keeping the motor's slip small, so the motor never draws much more than its rated current. With the current limit set at 110% of rated, the motor provides about 1.1 × 194.2 = 213.6 N·m at its shaft, about 246.6 N·m at the fan shaft. The rotor run-up tool gives a run-up time of 14.0 seconds for that torque. The drive's acceleration ramp was set to 20 seconds, so the current limit is rarely reached.

The tool's start time applies to the drive start, but its rotor energy does not. Its guide states that it assumes a direct-on-line induction start, and its figure of 326 kJ per start would be wrong for a drive start: on a drive, the rotor slips only by its working slip at every moment, so the rotor dissipates only a small fraction of the energy delivered to the load. That is why a drive allows a high-inertia fan to be started far more often than a direct-on-line starter could, and why the supply sees no starting current surge.

```figure
type: bars
title: Supply current during F-1's start, peak, as a multiple of rated current
x: Starting method
y: Peak current, per unit of rated
caption: This is an illustration. Direct on line about 6.5 times rated for most of the 7 s run-up, typical of a motor of this size; star–delta about a third of that at the start but with a current and torque jolt at changeover; soft starter set to 3.5 times; drive with a 110% current limit.
- Direct on line | 6.5
- Star–delta, first stage | 2.2
- Soft starter | 3.5
- * Drive | 1.1
```

## Where the energy goes when stopping

When F-1 stops, its 278 kJ of kinetic energy must go somewhere. If the drive simply switches off its output, the fan coasts, and its own air resistance, which is large at high speed, absorbs the energy. Because the fan's drag torque falls with the square of speed, the fan slows quickly at first and then lingers: it would fall to half speed in about 27 seconds but take about four minutes to fall to a tenth of its speed.

If instead the drive is told to stop the fan on a ramp faster than it would coast, it lowers the output frequency faster than the fan slows. The motor's rotor then turns faster than its field, the slip goes negative, and the motor becomes a generator, driving current back through the inverter's diodes into the DC link. The DC link has nowhere to send that energy, because a diode rectifier cannot pass power back to the supply. Its capacitors charge up.

They cannot hold much. DP-4's fan drive has about 1,100 µF in its DC link. Charging it from its normal 566 V to the overvoltage trip at about 760 V stores only ½ × 0.0011 × (760² − 566²) = 141 J. Against a fan carrying 278,000 J, that is nothing: as soon as the motor regenerates more than the drive's own losses can absorb, the DC link voltage rises to the trip in a fraction of a second.

```figure
type: compare
title: Energy F-1 returns to its drive on a linear stop ramp
cols: Energy regenerated | Peak regenerated power | Outcome without a braking resistor
rowhead: Stop ramp
- * 20 s | 176.3 kJ | 12.51 kW | Overvoltage trip
- 60 s | 63.3 kJ | 2.41 kW | Overvoltage trip
- 120 s | 31.6 kJ | 0.85 kW | Marginal; the drive's losses and flux braking may absorb it
- 240 s | 15.8 kJ | 0.30 kW | Absorbed by the drive's losses
- Coast | none | none | Fan stops in its own time, about 4 minutes to 10% speed
caption: This is an illustration. Worked by integrating the decelerating torque J ω₀ ÷ T less the fan's drag k ω², with k = 108.3 ÷ 188.5² N·m·s², over each ramp; only the positive part is regenerated. The drag absorbs the rest of the 278 kJ.
```

Drives have several ways to cope. Many limit their own deceleration automatically, stretching the ramp whenever the DC link voltage climbs, which avoids the trip at the cost of a longer stop. Flux braking raises the motor's magnetising current during deceleration so that the motor's own losses absorb a few per cent of rated power. And a braking chopper, an extra IGBT that connects a resistor across the DC link whenever the voltage exceeds a threshold, turns the regenerated energy into heat in the resistor. A regenerative front end, an active rectifier, can return it to the supply, which is worthwhile for loads that brake often and heavily, such as cranes and centrifuges.

## Sizing a braking resistor

A braking resistor is sized for two things: the peak power, which sets its resistance, and the energy, which sets its thermal capacity. To stop F-1 in 20 seconds, the chopper would need to absorb a peak of 12.5 kW at the start of the ramp. At a chopper threshold of 760 V, that needs a resistance of no more than 760² ÷ 12,510 = 46 Ω. The resistor must also absorb 176 kJ per stop without overheating, and its rating depends on how often stops occur: once an hour, its average power is only about 50 W, but its short-time rating must cover 176 kJ in 20 seconds. Resistor makers rate their products for both, and the drive's manual gives the smallest resistance its chopper can safely drive.

## Stopping safely

A drive's stop ramp is a control function, not a safety function. Emergency stops and safeguarding on machines are designed to the machinery safety standards, and IEC 60204-1, on the electrical equipment of machines, describes three stop categories: category 0, removing power at once so the machine coasts; category 1, a controlled stop with power then removed; and category 2, a controlled stop with power left on. Which is appropriate is decided by the machine's risk assessment.

Most modern drives provide a safe torque off function, specified in IEC 61800-5-2, which blocks the inverter's gate signals through hardware channels independent of the drive's software, so that the drive cannot produce torque in the motor. Used with a certified safety relay or controller, it can provide a category 0 stop, or a category 1 stop if the drive first ramps down. Safe torque off is not isolation: the DC link and the motor terminals remain live, so it is never a substitute for isolating the supply before electrical work. And because it removes torque, a machine with a suspended or inclined load, such as a hoist or C-2's loaded incline, needs a mechanical brake or backstop to hold the load once torque is gone. DP-4's drives use safe torque off for the wash line's emergency stops, with the stop category for each machine set by the line's safety assessment.

## The error: a stop ramp shortened for convenience

A month after the drives were commissioned, the shift supervisors asked for F-1 to stop faster at the end of each shift, so that the hood dampers could be closed and the granulators locked out sooner. A technician changed the fan drive's deceleration ramp from coast to stop to a 20-second ramp. The next evening, the fan drive tripped on DC overvoltage at the first stop, and then again at the next.

The plant's engineer worked out the numbers above. Stopping the fan in 20 seconds meant taking about 176 kJ back through the motor, with a peak of 12.5 kW, into a drive with no braking chopper and a DC link that could hold only 141 J. The drive was doing exactly what it should in protecting itself. The real requirement was not that the fan stop, but that the hoods be safe to close and the granulators isolated, which did not depend on the fan's speed at all.

```figure
type: decision
title: Options for stopping F-1 at the end of a shift
caption: This is an illustration. The plant adopted the first.
- * Restore coast to stop, and change the lockout procedure so that hood dampers close once the drive's run command is off | No hardware; the fan coasts down in a few minutes with no load on the drive | Adopted
- Fit a braking chopper and a 46 Ω resistor rated for 176 kJ per stop | Stops in 20 s; costs a resistor, wiring, a ventilated enclosure for the heat and a chopper option | Not adopted
- Use a 240 s ramp | No trip, but no faster than coasting to a low speed | Not useful
```

The lesson is that a stop ramp is not free. Its length sets how much energy comes back to the drive, and without somewhere to put that energy, any ramp faster than the load's natural deceleration ends in a trip.

## The conveyor on its incline

C-2 is a different case. When it stops, the material on its 12 m lift tries to run the belt backwards. While the drive holds the motor, it provides holding torque; when the drive's output stops, only the gearbox's backstop, a one-way clutch that prevents reverse rotation, stops the belt running back and dumping its load into the hopper. The backstop is a mechanical safety part of the conveyor and must be specified for the conveyor's maximum holdback torque, which the conveyor sizing tool's lift term gives directly: the lift tension at the 52.1 kg/m of a slowed belt is 52.1 × 9.81 × 12 = 6,133 N, 1,227 N·m at the 400 mm pulley.

Because the belt is going uphill, C-2 never regenerates while it is decelerated: the lift does the braking. Only a conveyor carrying load downhill regenerates, and a drive for one must be specified with braking.

## Exercise: a smaller fan

A smaller extraction fan has an impeller of 600 mm diameter and 40 kg directly on a 1,475 rpm motor shaft, with a motor rotor inertia of 0.12 kg·m².

1. What is its total inertia and stored energy at full speed?
2. How much energy can the drive's 680 µF DC link absorb between 566 V and 760 V?
3. If the fan's drag at full speed is 40 N·m and the drive's losses can absorb about 200 W, roughly how long a stop ramp avoids an overvoltage trip, taking the peak regenerated power at the start of the ramp?

### Worked answer

1. Impeller J = 40 × 0.6² ÷ 8 = 1.80 kg·m²; total 1.92 kg·m². ω = 2π × 1,475 ÷ 60 = 154.5 rad/s. Stored energy = ½ × 1.92 × 154.5² = 22.9 kJ.
2. ½ × 0.00068 × (760² − 566²) = 87 J, negligible again.
3. At the start of a ramp of length T, the decelerating torque is J ω₀ ÷ T and the drag is 40 N·m, so the regenerated power is (1.92 × 154.5 ÷ T − 40) × 154.5. For this to stay below about 200 W, 1.92 × 154.5 ÷ T must be below 40 + 200 ÷ 154.5 = 41.3 N·m, so T must exceed 296.6 ÷ 41.3 = 7.2 s. But that is only the start of the ramp. The drag falls with the square of speed while the ramp's decelerating torque stays constant, so the regenerated power peaks later in the ramp. Working the ramp through, as in the table for F-1, gives peaks of about 1.5 kW for a 10 s ramp, 540 W for 20 s, 290 W for 30 s and 190 W for 40 s. A ramp of about 40 seconds, or the drive's automatic deceleration limit, would avoid trips. The start-of-ramp check alone would have been badly wrong.
