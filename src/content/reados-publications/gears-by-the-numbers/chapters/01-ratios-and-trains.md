---
book: gears-by-the-numbers
chapterSlug: ratios-speeds-and-gear-trains
order: 1
title: "Ratios, speeds and gear trains"
description: "Calculate gear ratio, output speed and torque for simple and compound trains, and use tooth numbers to spread wear with a hunting tooth."
draft: false
---

A gear pair does one thing above all: it trades speed for torque at a fixed ratio. Everything else in this book, from tooth geometry to strength, exists to make that trade smooth, quiet and durable. Before any tooth is drawn, the ratio and the torques it creates must be right.

This chapter sets up the conveyor case, calculates its speeds and torques, and extends the arithmetic to trains of several gears.

## The ratio comes from the tooth numbers

When two gears mesh, their teeth pass the contact point at the same rate. A pinion with z₁ teeth turning at n₁ rpm and a gear with z₂ teeth turning at n₂ rpm therefore satisfy:

**z₁ × n₁ = z₂ × n₂**

so the ratio is

**i = n₁ / n₂ = z₂ / z₁**

For the conveyor case, the 20-tooth pinion on the motor drives a 60-tooth gear:

**i = 60 / 20 = 3**

With the motor at 1,440 rpm, the output turns at:

**n₂ = 1,440 / 3 = 480 rpm**

The two gears turn in opposite directions. An external gear pair always reverses rotation.

## Torque rises as speed falls

Power is torque times angular speed. With power P in kilowatts, torque T in newton-metres and speed n in rpm:

**T = 9,550 × P / n**

The 3 kW motor delivers at the pinion:

**T₁ = 9,550 × 3 / 1,440 ≈ 19.90 N·m**

Ignoring losses, the gear carries the same power at a third of the speed, so three times the torque:

**T₂ = T₁ × i ≈ 19.90 × 3 ≈ 59.69 N·m**

Real meshes lose a little power to friction. A well-made, well-lubricated spur mesh is commonly assumed to be around 98% efficient for a first estimate; treat that as an assumption to confirm against supplier data. At 98%, the output torque becomes about 59.69 × 0.98 ≈ 58.5 N·m. The design case in later chapters uses the pinion torque of 19.90 N·m, which is not affected by the loss assumption.

```figure
type: stats
title: The conveyor drive at a glance
caption: A 3 kW motor at 1,440 rpm through a 20:60 spur pair; torques ignore losses unless noted.
- 3 : 1 | Ratio | 60 teeth ÷ 20 teeth
- 480 rpm | Output speed | from 1,440 rpm
- 19.90 N·m | Pinion torque | 9,550 × 3 ÷ 1,440
- *59.69 N·m | Gear torque | without losses
```

## Reading the ratio both ways

The ratio in this chapter is defined as input speed over output speed, so a reduction such as the conveyor drive has a ratio greater than one. Some standards and catalogues also use a **gear ratio** written as the larger tooth number over the smaller, which is always one or more whatever the direction of drive. The two agree for a reduction and differ for a **speed increaser**, where the larger gear drives the smaller one. A wind turbine gearbox and some pump drives are increasers; most industrial drives, including the conveyor, are reducers.

The habit worth keeping is to write down which gear drives, the speeds at both ends and the direction of power flow before using any ratio. A ratio of 3 means very different things for a motor driving a conveyor and for a conveyor that, under some fault, back-drives the motor.

## From torque to tooth force

Torque describes the shaft; the teeth feel a force. The force that passes from tooth to tooth acts at the pitch circle, whose diameter Chapter 3 derives from the module and tooth number. For the conveyor pinion, the pitch diameter is 60 mm, and the pitch-line speed is:

**v = π × d × n / 60,000 = π × 60 × 1,440 / 60,000 ≈ 4.524 m/s**

Power is force times speed, so the tangential force on the teeth is:

**Fₜ = P / v = 3,000 / 4.524 ≈ 663 N**

The same answer comes from torque and radius: 19.90 N·m divided by 0.030 m gives about 663 N, or 663.2 N with the unrounded torque. This force is the same on both gears, because the teeth push on each other equally. The gear's torque is larger only because its radius is larger: the 60-tooth gear has a 180 mm pitch diameter, and 663.2 N × 0.090 m ≈ 59.69 N·m, matching the torque from the ratio. Chapters 8 and 9 use this tangential force to check tooth bending and surface stress.

## Compound trains multiply

When one stage cannot give the ratio needed, or would need an impractically large gear, stages are combined. In a **compound train**, a gear and a pinion share a shaft, so the output of one stage drives the next. The overall ratio is the product of the stage ratios:

**i = i₁ × i₂ × …**

Two stages of 4:1 and 5:1 give 20:1, using four gears of modest size instead of one pinion and a gear twenty times its diameter.

An **idler** placed between two gears changes the direction of rotation and the spacing between shafts, but not the ratio. The idler's tooth number cancels out: the driver passes its tooth rate to the idler, which passes the same rate to the driven gear.

```figure
type: tree
title: Three ways to arrange gears
caption: Only the gears that change the tooth rate between shafts change the ratio.
- Gear trains
  - Simple pair | ratio z₂ ÷ z₁, rotation reversed
  - Idler between | same ratio, direction restored, spacing changed
  - *Compound train | stage ratios multiply
```

## Losses add up through a train

Each mesh loses a little power to sliding friction between the teeth. In a train, the stage efficiencies multiply, so two stages at an assumed 98% each give:

**0.98 × 0.98 ≈ 0.960, or about 96%**

That sounds small, but the lost power becomes heat. A 2% loss at 3 kW is about 60 W per stage, which the lubricant and housing must carry away. Bearings, seals and the churning of oil add further losses, especially at high speed or with deep oil baths. For a first estimate, the stage efficiencies are useful; for a gearbox that must not overheat, the losses are calculated or taken from supplier data and checked by running temperature.

## How much ratio to put in one stage

A single spur or helical stage can in principle give a large ratio, but the gear grows in proportion. A 20:1 single stage with a 20-tooth pinion needs a 400-tooth gear, which at module 3 would be 1.2 m in diameter. As a rule of thumb, designers often keep one external stage to about 5:1 or 6:1 and split larger ratios between stages, then check the result against space, cost and noise.

Splitting the ratio evenly keeps the largest gear as small as practical. For 20:1 in two stages, the even split is √20 ≈ 4.47 per stage. Whole tooth numbers rarely give exactly that, so a pair of stages such as 4:1 and 5:1 is a natural starting point, refined later by hunting-tooth choices and the available centre distances.

## Torque grows along the train

The torque on each shaft rises by each stage's ratio. In the 20:1 example with the conveyor's 3 kW motor, ignoring losses:

- **Input shaft:** 19.90 N·m at 1,440 rpm
- **Intermediate shaft**, after the 4:1 stage: 79.6 N·m at 360 rpm
- **Output shaft**, after the 5:1 stage: 397.9 N·m at 72 rpm

```figure
type: bars
title: Shaft torque through a 4:1 and 5:1 compound train
unit: N·m
max: 400
caption: 3 kW input at 1,440 rpm, losses ignored. The slow end carries twenty times the input torque.
- Input shaft, 1,440 rpm | 19.9
- Intermediate shaft, 360 rpm | 79.6
- *Output shaft, 72 rpm | 397.9
```

The consequence is that the slow end of a train sets most of its size. The output gear, its shaft, key or spline, bearings and housing must carry twenty times the input torque, and the second stage usually needs a larger module or wider face than the first. A drive that looks small at the motor can be heavy at the output.

## Direction of rotation, and internal gears

An external pair reverses rotation; each further external mesh reverses it again. Counting meshes is the quickest check: an odd number of external meshes between input and output reverses the direction, an even number restores it. That is why an idler is used where the output must turn the same way as the input.

An **internal gear**, with teeth cut on the inside of a ring, behaves differently. A pinion meshing inside a ring turns in the same direction as the ring, and the centre distance is the difference of the two pitch radii rather than their sum, so the pair is compact. Internal gears are the basis of planetary gearboxes, where several planet pinions share the load between a central sun gear and an outer ring. Their geometry has extra constraints, such as interference between the tips of the pinion and the ring, that are beyond the scope of this book; the arithmetic of ratio and torque still begins with tooth numbers in the same way.

## Choose tooth numbers that share the wear

The 20:60 pair has a hidden weakness. Because 60 is an exact multiple of 20, each pinion tooth meets only three of the gear's teeth, over and over. Any small defect on one pinion tooth always lands on the same three gear teeth, and wear patterns reinforce rather than average out.

A **hunting tooth** combination avoids this by choosing tooth numbers with no common factor, so every pinion tooth eventually meets every gear tooth. Changing the gear to 61 teeth gives a ratio of 61 / 20 = 3.05 and an output speed of 1,440 / 3.05 ≈ 472.1 rpm, about 1.6% slower. Whether that change is acceptable depends on the conveyor's required speed. The point is to consider it deliberately, because the tooth numbers decide wear behaviour as well as speed.

## How often the same teeth meet

The number of different gear teeth that one pinion tooth meets is the gear's tooth number divided by the greatest common factor of the two tooth numbers. For 20:60, the common factor is 20, so each pinion tooth meets only 60 / 20 = 3 gear teeth. For 20:62, the common factor is 2, and each pinion tooth meets 31. For 20:61, there is no common factor, and each pinion tooth meets all 61 gear teeth in turn.

A small common factor is often acceptable; a large one, as in an exact integer ratio, concentrates wear. Some gear sets deliberately use a common factor for assembly reasons, such as matching timing marks, in which case the marked teeth must be meshed as the maker intended.

## Check the ratio against the requirement

Ratios are rarely free choices. A conveyor speed, a pump flow or a spindle speed sets the requirement, and tooth numbers must be whole. The usual approach is to list the tolerable output speed range, then find tooth combinations within it, preferring hunting-tooth pairs, pinions with enough teeth to avoid undercut (Chapter 5) and gears that fit the available space.

## Finding tooth numbers for a speed range

This is an illustration. Suppose the conveyor's required output speed is 475 rpm, with a tolerance of ±5 rpm, and the pinion may have between 18 and 24 teeth. The exact 3:1 pairs give 480 rpm, at the edge of the range and not hunting. Adding one tooth to each gear gives a hunting pair that lands inside it:

```figure
type: compare
title: Candidate pairs for 475 ± 5 rpm from a 1,440 rpm motor
cols: Output speed | Hunting tooth
caption: Adding one tooth to the gear moves each exact 3:1 pair into the range and removes the common factor.
- 20 : 60 | 480.0 rpm | No, common factor 20
- 18 : 55 | 471.3 rpm | Yes
- 20 : 61 | 472.1 rpm | Yes
- 22 : 67 | 472.8 rpm | Yes
- *24 : 73 | 473.4 rpm | Yes
```

Larger pinions come closer to the target, but they also enlarge both gears and the centre distance, which Chapter 4 shows can matter as much as the speed. A short table like this, computed before any drawing, prevents the common mistake of fixing tooth numbers early and discovering later that they do not suit the space, the speed or the wear.

## A ratio that must be steady, not just right on average

The ratio z₂ / z₁ holds over each full revolution whatever the tooth shape, because every tooth that passes must be matched by a tooth on the other gear. What the tooth shape decides is whether the ratio is also steady **within** each tooth's engagement. If the instantaneous ratio wobbles as each tooth enters and leaves contact, the output speed ripples at the tooth-passing frequency, and the teeth hammer and whine.

For the conveyor pinion, the tooth-passing frequency is the number of teeth times the revolutions per second:

**20 × 1,440 / 60 = 480 Hz**

A ripple at that frequency, and at its multiples, is what a listener hears as gear whine. Chapter 2 explains how the involute tooth shape makes the instantaneous ratio constant in principle, and later chapters show how errors in spacing, profile and alignment reintroduce small variations, called transmission error, that designers and gear makers work to keep small.

## Exercise: a compound reduction

A two-stage compound train has an 18-tooth pinion driving a 54-tooth gear, and on the same shaft as that gear, a 20-tooth pinion driving a 70-tooth gear. The input turns at 1,440 rpm. Calculate the overall ratio and the output speed. Do either of the stages form a hunting-tooth pair?

The stage ratios are **54 / 18 = 3** and **70 / 20 = 3.5**, so the overall ratio is **3 × 3.5 = 10.5**. The output speed is **1,440 / 10.5 ≈ 137.1 rpm**. Neither stage is a hunting-tooth pair: 54 is a multiple of 18, and 70 and 20 share a factor of 10. A designer wanting better wear sharing might change the first stage to 19:58, whose tooth numbers share no common factor, giving a stage ratio of about 3.05, and then check the resulting output speed against the requirement.
