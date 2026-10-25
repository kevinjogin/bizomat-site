---
book: vehicle-mechanics-by-the-numbers
chapterSlug: gearing-and-wheel-torque
order: 5
title: "Gearing, wheel torque and the motor curve"
description: "Choose a reduction ratio from motor speed and top speed, convert tractive force into wheel and motor torque, check it against the motor curve, and see what a wheel change does."
draft: false
---

A motor produces torque at a shaft turning at a few thousand revolutions per minute. A vehicle needs force at a tyre turning at a hundred or so. The gearing between them trades speed for torque, and its ratio decides both the top speed and the force the drive can deliver at low speed. Choose it wrongly and the vehicle is either sluggish on the ramp or slow everywhere.

This chapter calculates the reduction ratio for the running case tractor, converts the tractive forces from Chapters 2 and 3 into torque at the wheels and the motor, and checks them against a typical electric motor characteristic. Its error case is a set of replacement wheels that quietly made every speed reading wrong.

## Wheel speed, ratio and top speed

A wheel rolling without slip moves forward one circumference per revolution. The distance from the axle centre to the floor under load is the dynamic or rolling radius, slightly less than the free radius of the tyre. Wheel speed in revolutions per minute is:

**n_wheel = v ÷ (2π × r) × 60**

and the overall reduction ratio between motor and wheel is the motor speed divided by the wheel speed.

This is an illustration. The tractor's wheels have a dynamic radius of **0.25 m**. Its motor's maximum speed is 4,000 rpm, and the designer wants a top speed of 10 km/h, which is 2.778 m/s.

- Wheel speed at 10 km/h: **2.778 ÷ (2π × 0.25) × 60 = 106.1 rpm**
- Ratio needed: **4,000 ÷ 106.1 = 37.70**

A practical gear train gives a ratio near that value; this tractor uses **38:1**, giving a top speed of **4,000 ÷ 38 × 2π × 0.25 ÷ 60 × 3.6 = 9.92 km/h**. A ratio of 38 is too large for one gear pair, so it is usually split across two stages, for example around 6 to 1 each. [Gears by the Numbers](/reados/publications/gears-by-the-numbers/) covers how such trains are designed.

```figure
type: formula
title: From speed to ratio
formula: i = n_motor ÷ n_wheel and n_wheel = v ÷ (2π × r) × 60
caption: This is an illustration. Motor maximum speed 4,000 rpm, dynamic wheel radius 0.25 m, target top speed 10 km/h.
- i | overall reduction ratio, motor to wheel
- n_motor, n_wheel | motor and wheel speed, rpm
- v | vehicle speed, m/s
- r | dynamic (rolling) wheel radius, m
step: n_wheel = 2.778 ÷ (2π × 0.25) × 60 = 106.1 rpm
step: i = 4,000 ÷ 106.1 = 37.70; chosen ratio 38, top speed 9.92 km/h
```

## From tractive force to torque

Torque at the wheels is the tractive force times the dynamic radius. Torque at the motor is the wheel torque divided by the ratio and the drivetrain efficiency, because losses in the gears mean the motor must supply a little more than the ideal share.

**T_wheel = F × r** and **T_motor = T_wheel ÷ (i × η_d)**

This is an illustration. For the running case, with η_d = 0.85:

- **Climbing the ramp at 5 km/h:** wheel torque **4,252 × 0.25 = 1,063 N·m**; motor torque **1,063 ÷ (38 × 0.85) = 32.9 N·m**; motor speed **2,016 rpm**.
- **Starting on the ramp** at 0.3 m/s²: wheel torque **6,076 × 0.25 = 1,519 N·m**; motor torque **47.0 N·m** at very low speed.
- **Level at top speed, 9.92 km/h:** wheel torque **852 × 0.25 = 213 N·m**; motor torque **6.6 N·m** at 4,000 rpm.

The gearing multiplies the motor's torque by 38 × 0.85 = 32.3 at the wheels, and divides its speed by 38.

The efficiency of 0.85 is a teaching assumption for the whole path from motor shaft to tyre: two gear stages, the differential, bearings and seals. A single well-made spur or helical gear mesh loses only a few per cent, but losses in seals, oil churning and bearings add up, and they are proportionally larger at light load. Where the maker publishes a drivetrain efficiency, use it; where they do not, a value in the mid-80s is a cautious starting point for a small two-stage drive.

## Splitting the ratio into two stages

A single pair of gears with a ratio of 38 would need a pinion so small or a wheel so large that neither is practical. Two stages of roughly equal ratio keep both gears of each pair a sensible size. The equal split is the square root of the overall ratio: **√38 = 6.16** per stage.

This is an illustration. Two identical stages, each a 13-tooth pinion driving an 80-tooth wheel, give **80 ÷ 13 = 6.154** per stage and **6.154 × 6.154 = 37.87** overall, which moves the top speed to **9.95 km/h**, close enough to the 38:1 design. Thirteen and eighty share no common factor, so every pinion tooth meets every wheel tooth in turn, which spreads wear evenly. A pinion with as few as 13 teeth usually needs a corrected tooth profile to avoid undercut at the root; [Gears by the Numbers](/reados/publications/gears-by-the-numbers/) explains why and how to check it. In practice, the drive maker selects the stages; the vehicle designer's job is to state the overall ratio, the torque at each shaft and the duty, and to check the resulting top speed and tractive force.

## The motor curve

An electric traction motor with its controller typically delivers a constant maximum torque from standstill up to a base speed, and above that a roughly constant maximum power, so the available torque falls as speed rises. This is an illustration. Assume the tractor's motor delivers **60 N·m** for short periods up to a base speed of about **1,270 rpm**, and **8 kW** above it.

```figure
type: compare
title: Torque needed and torque available at the motor
cols: Motor speed | Torque needed | Torque available
caption: This is an illustration. Ratio 38, drivetrain efficiency 0.85, assumed motor characteristic of 60 N·m to about 1,270 rpm and 8 kW above. Available torque above base speed is power divided by angular speed.
- Starting on the ramp | near 0 rpm | 47.0 N·m | 60 N·m
- *Climbing the ramp at 5 km/h | 2,016 rpm | 32.9 N·m | 37.9 N·m
- Level at top speed, 9.92 km/h | 4,000 rpm | 6.6 N·m | 19.1 N·m
```

At 2,016 rpm, the available torque is **8,000 ÷ (2π × 2,016 ÷ 60) = 37.9 N·m**, which covers the 32.9 N·m needed for the ramp with a margin of about 15%. That small margin is the gearing's way of saying what Chapter 4 said about power: the ramp at 5 km/h is near the motor's limit, and at higher speed it would be beyond it.

At standstill, the motor can push the wheels with a force of **60 × 38 × 0.85 ÷ 0.25 = 7,752 N**. That is more than the grip available even on a dry ramp, 6,952 N from Chapter 3. At low speed this tractor is limited by its tyres, not its motor. Above base speed it is limited by its motor. A well-matched drive puts the change-over near the conditions that matter most.

## Choosing a different ratio

The ratio is a compromise. A higher ratio gives more wheel torque and a lower top speed; a lower ratio does the reverse. The motor can be thought of as having a fixed power above base speed. Gearing does not create power; it only chooses where on the speed range the vehicle gets it.

This is an illustration. If the ratio were changed to 30:1, the top speed would rise to about **12.6 km/h**, and the torque multiplication at the wheels would fall to **30 × 0.85 = 25.5**. Starting on the ramp would then need **1,519 ÷ 25.5 = 59.6 N·m** from the motor, almost exactly its 60 N·m limit, with no margin. The 38:1 ratio trades about 2.7 km/h of top speed, which the site's 10 km/h limit does not allow anyway, for a start on the ramp with about 28% torque in hand.

## Torque at each wheel and the open differential

The rear axle of the tractor has a differential, so the two rear wheels can turn at different speeds on a bend. An ordinary open differential divides the torque equally between the two wheels. On the ramp, each rear wheel receives **1,063 ÷ 2 = 531.5 N·m** while climbing and **1,519 ÷ 2 = 759.5 N·m** when starting.

Equal torque has a consequence for grip. Each wheel can transmit only as much torque as its own grip allows, and the open differential cannot send more to one wheel than to the other. The axle's total tractive force is therefore twice the grip of the worse wheel.

This is an illustration. On the ramp, each rear wheel carries **11,586 ÷ 2 = 5,793 N**. If one wheel stands on a wet patch with μ = 0.3 and the other on dry concrete with μ = 0.6, the open differential limits the axle to **2 × 0.3 × 5,793 = 3,476 N**, exactly the same as a fully wet ramp. A single puddle under one wheel is as bad as rain on the whole ramp. With a locking or limited-slip differential, the axle could use **0.3 × 5,793 + 0.6 × 5,793 = 5,214 N**, more than the 4,252 N the climb needs.

```figure
type: bars
title: Axle tractive force with one wheel on a wet patch
unit: N
max: 7200
caption: This is an illustration. Rear axle load on the ramp 11,586 N, shared equally between the wheels; μ 0.3 under one wheel and 0.6 under the other. The climb needs 4,252 N.
- Force needed to climb | 4252
- *Open differential, one wheel wet | 3476
- Locked differential, one wheel wet | 5214
- Both wheels dry | 6952
```

The lesson for the site was not to buy a different differential but to keep the ramp uniformly dry and clean: the open differential makes the worst square metre of floor the one that matters.

## Holding the train on the ramp

Gearing also works in reverse. When the train stands on the ramp, the gradient force tries to roll it back, and the gearing carries that force back to the motor shaft, where many electric tractors have their parking brake.

This is an illustration. The gradient force on the whole train is 3,402 N, so the wheel torque to hold it is **3,402 × 0.25 = 850.5 N·m**. Rolling resistance helps a little but cannot be relied upon at rest, so it is ignored. Divided by the ratio, that is **850.5 ÷ 38 = 22.4 N·m** at the motor shaft. Gear friction would reduce this to about 19.0 N·m, but a holding brake should not depend on friction losses that vary with temperature and wear, so the check uses 22.4 N·m and compares it with the brake maker's rated static torque, with a margin. If the trailers have no brakes of their own, the tractor's brake holds the whole train through the hitch, which is one more reason for the no-stopping rule on the ramp.

## The error: bigger wheels, wrong speeds

During a tyre shortage, the maintenance team fitted replacement wheels with a dynamic radius of **0.27 m** instead of 0.25 m, because they fitted the hubs and were in stock. The tractor's speed display, like many, calculates speed from motor speed, the ratio and the original wheel radius.

Two things changed without anyone noticing:

- **Speed.** At any motor speed, the vehicle now travels **0.27 ÷ 0.25 = 1.08** times faster than the display shows. When the display read the 10 km/h limit, the tractor was travelling at **10.8 km/h**, and its top speed rose to **10.71 km/h**.
- **Torque.** Climbing the ramp at the same force now needs **4,252 × 0.27 ÷ (38 × 0.85) = 35.5 N·m** at the motor, reducing the ramp margin from 15% to about 7%.

The error was detected when a supervisor timed the train between two marks on a straight aisle and found it covering 30 m in 10.0 s, which is 10.8 km/h, while the driver's display read 10. The correction was to refit wheels of the specified size and add a rule: any wheel or tyre change must keep the dynamic radius within the maker's tolerance, or the speed calibration must be changed to match. Worn tyres cause the opposite, smaller error: at a radius of 0.24 m, the tractor travels 4% slower than displayed, which errs on the safe side for speed but not for stopping-distance calculations based on displayed speed.

## Measuring the dynamic radius

The dynamic radius is easy to measure and often guessed. Mark the tyre and the floor, drive the vehicle slowly in a straight line for ten wheel revolutions under its normal load, and measure the distance covered. Divide by ten revolutions and by 2π. Repeat loaded and unloaded if the vehicle carries load on the driven axle, since the radius falls slightly as load rises. For solid tyres the change is small; for pneumatic tyres it depends strongly on pressure, which is another reason to keep pressures at the specified value.

This is an illustration. Ten revolutions of the tractor's rear wheel cover 15.71 m. The dynamic radius is **15.71 ÷ (10 × 2π) = 0.250 m**, confirming the design value.

## Exercise: a faster site

The site considers raising the level speed limit to 12 km/h. Keeping the motor's 4,000 rpm limit and the 0.25 m wheels, what ratio would allow 12 km/h, and what would it do to the motor torque needed to start on the ramp?

**Worked answer.** At 12 km/h, which is 3.333 m/s, the wheel speed is **3.333 ÷ (2π × 0.25) × 60 = 127.3 rpm**, so the ratio would be **4,000 ÷ 127.3 = 31.4**. Use 31:1 as a practical value.

Starting on the ramp needs a wheel torque of 1,519 N·m. With a ratio of 31 and an efficiency of 0.85, the motor would need **1,519 ÷ (31 × 0.85) = 57.6 N·m**, against its 60 N·m short-time limit. That leaves a margin of only about 4%, too small for wet conditions, worn tyres or a heavier load. The faster site needs either a larger motor, a two-speed gearbox, or a rule that trains never stop on the ramp. The site already has that rule, but a design that depends entirely on a rule being obeyed is weaker than one with margin built in.
