---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: torque-to-speed-up-and-slow-down
order: 3
title: "Torque to speed up and slow down"
description: "How much torque it takes to bring a rotor to speed or stop it in a given time, how many turns and how much energy that involves, and how a motor's rating compares with the torque the change needs."
draft: false
---

Torque equals moment of inertia times angular acceleration. That one relation, the rotational form of Newton's second law, answers most of the questions a machine designer asks about starting and stopping: how much torque the motor needs to reach speed in time, how much a brake needs to stop it, how many turns the rotor makes on the way and how much energy is stored or must be removed.

This chapter applies it to the DL-3's docking saw with the BIZOMAT torque to accelerate a rotating load tool and the torque, power and speed tool. It covers starting the saw, comparing the result with the motor's rating, and stopping it, which turns out to be the harder problem. Its mistake is the most basic of all rotational slips: a speed in revolutions per minute used where the formula wants radians per second.

## The rotational second law

A rotor with moment of inertia J, given a net torque T, accelerates at α = T ÷ J, in radians per second squared. To change its speed from ω0 to ω1 in a time t at a constant rate, the torque needed is J (ω1 − ω0) ÷ t, plus whatever torque friction and the load take. The rotor turns through an angle equal to its average speed times the time, and its kinetic energy changes by half J (ω1² − ω0²).

```figure
type: formula
title: Changing a rotor's speed at a constant rate
formula: α = (ω1 − ω0) ÷ t
formula: T = J α + Tf
formula: Turns = (n0 + n1) ÷ 2 × t ÷ 60
formula: ΔE = ½ J (ω1² − ω0²)
caption: ω in rad/s, n in rpm, with ω = 2π n ÷ 60; 1,480 rpm is 154.99 rad/s. Tf is the friction and load torque the drive must overcome while the speed changes. When the rotor slows, α and J α are negative, and the total T is the torque the drive or brake must apply in the direction of rotation.
- α | angular acceleration, rad/s²
- J α | torque to change the speed
- Tf | friction and load torque
```

## Starting the saw

Chapter 1 gave the docking saw's moment of inertia, including the motor's rotor: 2.172 kg·m². The saw's bearings, the air drag on the blade and the motor's own fan take an estimated 3 N·m at full speed. The mill wants the blade at its 1,480 rpm working speed within 5 s of pressing start.

The [torque to accelerate a rotating load tool](/tools/angular-acceleration-torque/) takes the moment of inertia, the starting and final speeds, the time and the friction and load torque. It returns the angular acceleration, the accelerating torque, the total torque, the revolutions turned during the change, the change in kinetic energy and the peak power at the end of the change. It assumes constant acceleration, which a real motor does not give, and reminds the user that the inertia must be referred to one shaft.

```figure
type: steps
title: Starting the docking saw in 5 s
caption: This is an illustration. J = 2.172 kg·m², 0 to 1,480 rpm in 5 s, friction 3 N·m.
- Angular acceleration | 31.00 rad/s²
- Accelerating torque | 67.34 N·m
- * Total torque | 70.34 N·m
- Revolutions during the start | 61.7
- Kinetic energy at speed | 26.09 kJ
- Peak power at the end | 10.90 kW
```

The [torque, power and speed tool](/tools/torque-power/) converts a motor's rated power and speed into its rated torque: 15 kW at 1,480 rpm is 15,000 ÷ 154.99 = 96.78 N·m. The 70.3 N·m the start needs is 73% of that, so even at a constant torque no higher than its rating the motor would reach speed in time. In fact an induction motor started direct on line produces more than its rated torque for most of its run-up, often about one and a half to two times; at an average of 1.8 times its rating, 174.2 N·m, the saw would reach speed in 2.172 × 154.99 ÷ (174.2 − 3) = 1.97 s.

### Power and torque are not the same check

The tool's peak power, 10.90 kW, is the total torque times the final speed: the power the motor must deliver at the instant it reaches full speed if the acceleration were held constant to the end. It is easy to read this as the motor's power requirement and to compare it with the 15 kW rating. That comparison is not wrong, but it is not the useful one. A motor is limited by torque at low speed and by heat over time, and the start's demand is best compared with the motor's torque curve and its allowed starting time, which Chapter 7 examines for the much larger chipper.

```figure
type: compare
title: The docking saw's start against the motor
cols: Needed for a 5 s start | Motor
rowhead: Quantity
- Torque | 70.3 N·m, constant | 96.8 N·m rated; about 174 N·m average on a direct start
- Power at full speed | 10.9 kW at the instant speed is reached | 15 kW rated, continuous
- * Time to speed | 5 s target | about 2.0 s at 1.8 times rated torque
- Energy | 26.1 kJ stored in the saw | delivered once per start
caption: This is an illustration. The average starting torque of 1.8 times rated is a typical figure for this kind of motor, not a datasheet value; the motor's own torque-speed curve governs a real check.
```

## Stopping the saw

A saw that takes 2 s to start may take minutes to stop. With nothing but its 3 N·m of friction to slow it, the blade's 26.1 kJ would take 2.172 × 154.99 ÷ 3 = 112 s to run down, nearly two minutes in which a blade that looks slow is still cutting. The mill's own rule, an illustration, is that the blade must stop within 10 s of the stop button, so the drive must brake it.

The same tool works the stop, with the final speed below the starting speed. From 1,480 rpm to rest in 10 s, the angular acceleration is −15.50 rad/s² and the torque to decelerate the blade is −33.67 N·m. Friction helps, so the total the drive must apply is −33.67 + 3 = −30.67 N·m: a braking torque of 30.7 N·m.

```figure
type: steps
title: Stopping the docking saw in 10 s
caption: This is an illustration. J = 2.172 kg·m², 1,480 rpm to rest in 10 s, friction 3 N·m.
- Angular acceleration | −15.50 rad/s²: braking
- Torque to decelerate the inertia | −33.67 N·m
- * Torque the drive must apply | −30.67 N·m
- Revolutions while stopping | 123.3
- Energy removed | 26.09 kJ
- Braking power at the start of the stop | 4.75 kW
```

The energy is the same 26.1 kJ that the start put in, and it has to go somewhere. The DL-3's saw motor is fed by a variable-speed drive, which brakes the motor as a generator and sends the energy to a braking resistor: an average of 26.09 ÷ 10 = 2.6 kW over the stop, peaking at 4.75 kW at the start. A drive without a resistor or a regenerative supply could not take the energy and would trip, leaving the blade to coast.

The blade turns 123 times while it stops, twice as many as while it starts, because it spends twice as long slowing at half the rate. Half its energy is gone when its speed has fallen to 1,480 ÷ √2 = 1,047 rpm, less than a third of the way through the stop: a blade at two-thirds of its speed still has half its energy.

## How often: starts, stops and the resistor's heat

One stop puts 26.1 kJ into the braking resistor, and one start draws a similar energy from the supply, plus the motor's own losses. What matters for the resistor and the motor is how often that happens. The DL-3's saw is stopped at each break, at each change of product and whenever an operator opens the guard: up to twenty times an hour on a bad shift. Twenty stops put 20 × 26.09 = 522 kJ an hour into the resistor, an average of 145 W, while each stop's peak is 4.75 kW.

A braking resistor is therefore rated in two ways, much as a friction lining is: for its peak power during a stop, and for its average power over a duty cycle, usually stated as a percentage of time on. The drive's supplier sized the DL-3's resistor from the 4.75 kW peak, the 10 s stop and a duty of twenty stops an hour, and the mill recorded those three figures so that a later change, a heavier blade or a shorter stop, would prompt the check to be repeated.

## Stopping as a safety function

The saw's 10 s stop is not a convenience. A circular saw blade that is coasting is still dangerous, and the operator who opens a guard because the blade looks slow is exposed to most of its energy: at two-thirds of its speed, the blade still has half its kinetic energy. The model WHS laws require the risks of plant to be controlled, and guarding and stopping are among the main controls for a machine like this.

Electrical braking through a drive depends on the drive working. If the drive faults during a stop, or the supply fails, the braking stops with it and the blade coasts for up to two minutes. For that reason the DL-3's guard is interlocked so that it cannot be opened until a speed sensor on the arbor confirms the blade has stopped, not merely until a timer has run. Whether a mechanical brake should be added as well is a question for the machine's risk assessment, and the energy and torque figures in this chapter are the starting point for sizing one if it is.

## Starting loaded and unloaded

The saw starts unloaded: no timber is fed until it is at speed. Its friction is a few newton metres, and nearly all the starting torque goes into the inertia. Some machines must start loaded: a conveyor full of material, a pump against a closed valve, a mixer full of product. For them the load torque in the formula is large, and it may be largest at standstill, where breakaway friction is highest. A motor that starts a machine easily when empty may stall when the machine is full. The infeed rollers in the exercise below start with a board on them, which is why the board's inertia and the chain's friction both appear in their calculation.

## What a constant-acceleration model leaves out

The tool assumes the torque is constant and the acceleration uniform. Real drives depart from that in three ways that matter for some calculations and not others.

An induction motor started direct on line gives a torque that varies with speed: high at standstill, sometimes dipping in the middle of the run-up, rising to a peak near full speed and then falling to its working value. The average torque over the run-up decides the start time, and Chapter 7 uses that average for the chipper. A variable-speed drive or a servo, on the other hand, can hold a constant torque or a constant acceleration, and for those drives the tool's model is close to exact.

Friction and load torque also vary with speed. Bearing and seal friction is roughly constant, air drag on a blade or a fan grows with the square of speed, and a process load may appear only at speed. Using the full-speed value throughout, as here, overstates the friction during most of the start and understates the help it gives at the start of a stop. For the saw the friction is so small that either way changes nothing; for a fan, whose air load is its main load, it does.

Finally, the rotor's inertia is assumed to be rigidly connected. A belt, a long shaft or a flexible coupling lets the parts of the drive move slightly out of step, and a sudden torque can excite a twisting vibration. For the starts and stops in this book that is a second-order effect, and the whirling shafts book in this library treats torsional vibration directly.

## The mistake: rpm where rad/s belongs

The machine builder's first sizing note for the saw motor computed the angular acceleration as 1,480 ÷ 5 = 296 and the accelerating torque as 2.172 × 296 = 643 N·m. On that basis it proposed a 55 kW motor in place of the 15 kW one on the order.

The error is the factor of 2π ÷ 60 = 0.1047 between revolutions per minute and radians per second, and it inflates the result by 9.55 times. It was found by an order-of-magnitude check: 643 N·m at 1,480 rpm would be 100 kW of power at the end of the start, for a saw whose cutting load is a few kilowatts. Every rotational formula in this book uses radians per second; revolutions per minute appear only at the start, to be converted, and at the end, to be reported.

```figure
type: checklist
title: Before trusting a start or stop calculation
caption: The DL-3 review's checks. This is an illustration.
- x Speeds converted to rad/s before use: 1 rpm = 0.10472 rad/s
- x Inertia referred to the shaft whose speed is used
- x Friction and load torque signed correctly for starting and for stopping
- x Torque compared with the motor's torque curve, not only its power
- x Stopping energy given somewhere to go: a brake, a resistor or the supply
- x Result checked against the power it implies at full speed
```

## Exercise: starting the infeed rollers

**Problem.** The DL-3's eight infeed rollers, with a board on them and their chain, have 2.848 kg·m² at the roller shaft. They must reach 159 rpm from rest in 0.5 s against 20 N·m of bearing and chain friction. Their gearmotor is rated at 2.2 kW at an output speed of 159 rpm. Find (a) the torque needed, (b) the revolutions and energy, and (c) the gearmotor's rated output torque and whether the start is within it.

**Answer.** (a) ω1 = 16.65 rad/s. α = 16.65 ÷ 0.5 = 33.30 rad/s². Accelerating torque = 2.848 × 33.30 = 94.84 N·m. Total = 114.84 N·m.

(b) Revolutions = 159 ÷ 2 × 0.5 ÷ 60 = 0.66. Energy = 0.5 × 2.848 × 16.65² = 395 J. Peak power at the end = 114.84 × 16.65 = 1.91 kW.

(c) Rated torque = 2,200 ÷ 16.65 = 132.1 N·m. The start needs 114.8 N·m, 87% of rated, so the gearmotor can make it even at its rated torque.

**The check.** The rollers' start is short because their inertia is small, but the board's 0.19 kg·m² is part of it: without a board, the rollers would reach speed a little faster, and a calculation that left the board out would understate the torque by about 6%.

If the start time were halved to 0.25 s, the accelerating torque would double to 189.7 N·m and the total would be 209.7 N·m, beyond the gearmotor's rating: the start time is a design choice that sets the drive's size, and a short one is expensive.
The longer start of 0.5 s chosen for the DL-3 costs nothing in production, because the rollers start once a shift and run continuously.
