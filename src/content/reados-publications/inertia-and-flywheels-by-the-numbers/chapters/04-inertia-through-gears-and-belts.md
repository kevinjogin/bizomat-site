---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: inertia-through-gears-and-belts
order: 4
title: "Inertia through gears and belts"
description: "How inertia and load torque look from the motor through a gearbox, belt or screw: the ratio squared, linear masses as m r², efficiency, inertia ratio and accelerating torque."
draft: false
---

A motor rarely drives its load directly. Gears, belts, chains and screws sit between them, changing speed and torque, and they change how heavy the load feels to the motor. Seen through a reduction of i to 1, a load's torque looks i times smaller and its inertia i² times smaller. That square is the reason a gearbox can let a small motor accelerate a large load, and the reason a mistake in a radius or ratio is so costly in an inertia calculation.

This chapter reflects the DL-3's length pusher to its servo motor with the KEVOS® reflected inertia tool, explains the inertia ratio that servo makers ask about, and compares the pusher with the chipper's belt drive, where the same arithmetic gives a very different answer. Its mistake is a pulley's diameter used as its radius, which made the pusher look four times heavier than it is.

## Why the ratio is squared

Take a load with moment of inertia JL turning at ωL, driven through a reduction of i to 1 by a motor turning at ωm = i ωL. The load's kinetic energy is half JL ωL². Written in terms of the motor's speed, it is half JL (ωm ÷ i)², which is half (JL ÷ i²) ωm². To the motor, the load is indistinguishable from an inertia of JL ÷ i² on its own shaft.

Torque reflects with the first power of the ratio, because power is torque times speed and the speed changes by i. A load torque TL at the load shaft appears as TL ÷ i at the motor. Gear losses make the motor's job harder in both cases, and the tool divides both by the efficiency as well.

```figure
type: formula
title: Reflecting a load to the motor shaft
formula: Rotating load: J at motor = JL ÷ (i² η)
formula: Linear mass on a pulley of radius r: JL = m r²
formula: Linear mass on a screw of lead L: JL = m (L ÷ 2π)²
formula: Load torque at motor = TL ÷ (i η)
caption: i is the speed reduction from motor to load, η the drive's efficiency. A linear mass is first turned into an inertia at the shaft that moves it, using the distance it travels per radian of that shaft: r for a pulley or pinion, L ÷ 2π for a screw. Then it is reflected through the ratio like any other inertia.
- i | motor speed ÷ load speed
- η | efficiency of the drive, as a fraction
- r | pulley or pinion pitch radius
```

## The length pusher

The DL-3's length pusher is a carriage running on linear rails beside the docking table. A dog on the carriage pushes each board along the table until its far end reaches the saw line at the length the cutting list asks for. The carriage is driven by a toothed belt round two pulleys of 100 mm pitch diameter; the drive pulley is turned by a servo motor through a 5:1 planetary gearbox with an efficiency of 95%.

Everything that moves in a straight line travels at the belt's speed: the 40 kg carriage and dog, the heaviest board on the cutting list at 24 kg, and about 4 kg of belt, 68 kg in all. At the pulley's radius of 0.05 m it is equivalent to 68 × 0.05² = 0.170 kg·m², and the two pulleys add 0.003 kg·m², so the load inertia at the pulley shaft is 0.173 kg·m². The board slides on the table with a friction coefficient of 0.25, a force of 24 × 9.81 × 0.25 = 58.9 N, and the carriage's rails and seals add about 15 N: 73.9 N in all, a load torque of 73.9 × 0.05 = 3.69 N·m at the pulley.

The pusher's longest move reaches 2.0 m/s, which is 2.0 ÷ 0.05 = 40 rad/s or 382 rpm at the pulley and 1,910 rpm at the servo. The cycle allows 0.3 s to reach that speed.

```figure
type: bars
title: The length pusher's inertia at the pulley shaft
x: Moving part
y: Moment of inertia, kg·m²
caption: This is an illustration. Total 0.173 kg·m². Each linear mass contributes m × 0.05²; the board is a third of the load, so the motor's job changes noticeably between the heaviest and lightest boards.
- * Carriage and dog, 40 kg | 0.100
- Board, 24 kg | 0.060
- Belt, 4 kg | 0.010
- Two pulleys | 0.003
```

The [reflected inertia tool](/tools/reflected-inertia/) takes the load inertia at the load shaft, the motor's rotor inertia, the reduction ratio, the gearbox efficiency, the load speed to reach, the time to reach it and the load torque at the load shaft. It returns the load inertia reflected to the motor, the inertia ratio, the motor speed, the torque to accelerate both inertias, the load torque at the motor and the peak motor torque. It assumes a constant acceleration from rest and a rigid drive, and reminds the user that the duty cycle's RMS torque must be checked separately, which Chapter 6 does, and that the coupling's and gearbox's inertia belong with the motor's.

```figure
type: steps
title: The length pusher in the reflected inertia tool
caption: This is an illustration. Load 0.173 kg·m² at the pulley, servo rotor 0.0029 kg·m², ratio 5:1, efficiency 95%, pulley speed 382 rpm reached in 0.3 s, load torque 3.693 N·m at the pulley.
- Reflected load inertia | 0.00728 kg·m²
- * Inertia ratio | 2.51 : 1
- Motor speed | 1,910 rpm
- Acceleration torque | 6.789 N·m
- Load torque at the motor | 0.777 N·m
- Peak motor torque | 7.567 N·m
```

The 68 kg of moving parts look, to the servo, like 0.0073 kg·m², two and a half times its own rotor. The motor needs 7.57 N·m at the end of the acceleration, of which 90% accelerates the inertias and 10% overcomes friction. The servo chosen has a peak torque of 14.3 N·m, so the move has a margin; Chapter 6 checks whether it can repeat the move all shift without overheating.

## The inertia ratio

Servo makers ask for the inertia ratio, the load inertia reflected to the motor divided by the motor's own rotor inertia, because it affects how well the servo can control the load. With a ratio near 1, the motor's rotor and the load share the acceleration evenly, and a small error in the load's estimate makes little difference to tuning. With a ratio of 20 or 50, the motor is small compared with what it drives, and any springiness in the belt or coupling lets the load lag and overshoot, so the servo must be tuned soft and settles slowly.

The reflected inertia tool flags a ratio above 10:1 for comparison with the drive maker's recommendation. Makers' limits vary with the type of motor and the stiffness of the drive: a rigid ballscrew can tolerate a higher ratio than a long belt. The DL-3's 2.5:1 is comfortable.

```figure
type: compare
title: The pusher with and without its gearbox
cols: Reflected load inertia | Inertia ratio | Motor speed | Peak motor torque
rowhead: Drive
- Direct drive, 1:1 | 0.173 kg·m² | 59.7 : 1 | 382 rpm | 27.1 N·m
- * Through a 5:1 gearbox | 0.0073 kg·m² | 2.5 : 1 | 1,910 rpm | 7.6 N·m
caption: This is an illustration. Same move, same servo rotor of 0.0029 kg·m², 95% gearbox efficiency. Without the gearbox the servo would need more than three and a half times the torque and would be driving a load sixty times its own inertia; Chapter 5 asks how large the ratio should be.
```

## Several stages

A drive with more than one stage reflects each part through all the stages between it and the motor. A part on the final shaft is divided by the overall ratio squared; a part on an intermediate shaft only by the ratio between that shaft and the motor. The rule is the same as for a single stage: find each part's speed relative to the motor's and scale its inertia by that ratio squared.

The infeed rollers give a simple example. Their gearmotor's output turns at 159 rpm and its motor at 1,450 rpm, a ratio of 9.12, and a chain of 1:1 links the output to the rollers. Chapter 3's 2.848 kg·m² at the rollers looks like 2.848 ÷ 9.12² = 0.0342 kg·m² at the motor. A 2.2 kW four-pole motor's rotor is of the order of 0.0045 kg·m², so the ratio is about 7.6:1: unremarkable for a constant-speed conveyor, and a figure that would make a servo engineer reach for a larger motor.

## Efficiency works both ways

The reflected inertia tool divides both the inertia and the load torque by the efficiency, which is right when the motor is driving the load through the gears: the gear losses add to the work the motor must do. When the load drives the motor, as it does while the motor brakes the pusher at the end of a move or holds back a lowering load, the losses help, and the reflected torque is the load torque times the efficiency instead.

For the pusher the difference is small: at 95% efficiency, dividing or multiplying changes the reflected figures by about 5% either way. For a worm gear or a low-efficiency drive it can be large, and it can change the answer to a question such as whether the load can drive the motor backwards at all. For acceleration calculations, dividing by the efficiency is the conservative choice; for braking and holding calculations, multiplying is the honest one, and the two should not be mixed in a single figure.

## Stiffness and backlash

The reflection formulas treat the drive as rigid: every part moves exactly in step with the motor. A toothed belt stretches a little under load, a gearbox has backlash and twist, and a long shaft winds up. When the servo accelerates, the load lags slightly behind; when it stops, the load overshoots and springs back. The springier the drive and the larger the load's inertia compared with the motor's, the lower the frequency of that spring-back and the harder the servo is to tune.

That is the physical meaning of the inertia-ratio guidance above. The DL-3's pusher has a 3.5 m belt run. At the 7.6 N·m peak the belt's tension changes by up to 7.567 × 5 × 0.95 ÷ 0.05 = 719 N, and the belt maker's stiffness data turns that into a stretch to be compared with the board-length tolerance of ±1 mm. Because the stretch scales with the belt's length and inversely with its stiffness, the mill chose a steel-reinforced belt, and the servo's tuning was set with the heaviest board on the table, where the spring-back is slowest.

## The chipper's belt drive, seen the same way

The same arithmetic applies to the chipper's V-belt drive, with a very different result. The chipper's disc and hub, 222.72 kg·m² at 600 rpm, are driven from a motor at 1,480 rpm through a belt ratio of 1,480 ÷ 600 = 2.467. Seen from the motor, they look like 222.72 ÷ 2.467² = 36.6 kg·m², thirty times the motor's own rotor of 1.20 kg·m².

For a servo that ratio would be alarming. For an induction motor starting a chipper and then running it at constant speed, it is normal: the motor is not trying to follow a precise move, only to reach speed within its allowed time and then hold it. Chapter 7 works that start. The comparison is a reminder that the inertia ratio is a servo-tuning concern; for a constant-speed drive the questions are starting time and motor heating.

## Screws and racks

A linear axis driven by a screw reflects its moving mass through the screw's lead. One revolution of a screw with a lead L moves the nut L, so each radian moves it L ÷ 2π, and a mass m on the nut looks like m (L ÷ 2π)² at the screw. For a 20 mm lead, L ÷ 2π is 3.18 mm, and a 120 kg table looks like 120 × 0.00318² = 0.00122 kg·m², about the same as the screw itself.

A rack and pinion behaves like a belt: the moving mass is m r² at the pinion's pitch radius. In both cases the first step turns the linear mass into an inertia at the shaft that moves it, and the second reflects it through any gearbox, exactly as for the pusher's belt.

## The mistake: the pulley's diameter as its radius

The first sizing of the pusher took the 100 mm pulley's dimension as its radius. The linear masses became 68 × 0.1² = 0.68 kg·m², the load 0.683 kg·m², and the reflected inertia 0.0288 kg·m², four times too large. The tool reported an inertia ratio of 9.9:1 and a peak torque of 21.9 N·m, beyond the servo's 14.3 N·m peak, and the controls designer began specifying a larger servo.

As in Chapter 1, the factor of four was the giveaway. The reviewer checked the pulley's catalogue entry, which listed its pitch diameter as 100 mm, and the belt speed: 382 rpm on a 0.1 m radius would move the belt at 4 m/s, twice the speed the cutting list called for. The speed check exposed the radius error that the inertia figure alone had hidden.

```figure
type: checklist
title: Before trusting a reflected inertia
caption: The DL-3 review's checks. This is an illustration.
- x Pulley, pinion and sprocket radii taken from pitch diameters, halved
- x Linear speed implied by the pulley speed and radius matches the move required
- x Every linear mass included: carriage, product, belt or chain
- x Ratio defined as motor speed ÷ load speed, and squared for inertia
- x Gearbox and coupling inertia added on the motor side
- x Inertia ratio compared with the servo maker's guidance for this kind of drive
```

## Exercise: a ballscrew table

**Problem.** A 120 kg machine table is driven by a ballscrew with a 20 mm lead, directly coupled to a servo with a rotor inertia of 0.0016 kg·m². The screw's own inertia is 0.0012 kg·m² and the screw drive's efficiency is 90%. The table must reach 0.5 m/s in 0.1 s against a friction force of 200 N. Find (a) the load inertia at the screw, (b) the screw speed, (c) the load torque at the screw, and (d) the peak motor torque and inertia ratio.

**Answer.** (a) L ÷ 2π = 0.02 ÷ 6.283 = 0.003183 m. Table: 120 × 0.003183² = 0.001216 kg·m². With the screw, 0.002416 kg·m².

(b) 0.5 m/s ÷ 0.02 m per revolution = 25 rev/s = 1,500 rpm.

(c) 200 × 0.003183 = 0.637 N·m before losses.

(d) With i = 1 and η = 0.90: reflected inertia = 0.002416 ÷ 0.9 = 0.002684 kg·m²; ratio = 0.002684 ÷ 0.0016 = 1.68:1. α = 157.1 ÷ 0.1 = 1,571 rad/s². Acceleration torque = (0.0016 + 0.002684) × 1,571 = 6.73 N·m. Load torque = 0.637 ÷ 0.9 = 0.707 N·m. Peak = 7.44 N·m.

**The check.** The table's 120 kg looks no heavier to the servo than the screw does, because each radian of the screw moves the table only 3.2 mm. A coarser lead would reduce the motor speed but raise the reflected mass with the square of the lead.

The same servo through a 1:1 coupling would see a load ratio of 1.68:1 with this screw; with a 40 mm lead, the reflected table mass would grow fourfold to 0.00486 kg·m² while the screw speed for 0.5 m/s halved to 750 rpm. Choosing the lead is the screw axis's version of choosing a gear ratio, which Chapter 5 takes up.
