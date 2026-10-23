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

## Choose tooth numbers that share the wear

The 20:60 pair has a hidden weakness. Because 60 is an exact multiple of 20, each pinion tooth meets only three of the gear's teeth, over and over. Any small defect on one pinion tooth always lands on the same three gear teeth, and wear patterns reinforce rather than average out.

A **hunting tooth** combination avoids this by choosing tooth numbers with no common factor, so every pinion tooth eventually meets every gear tooth. Changing the gear to 61 teeth gives a ratio of 61 / 20 = 3.05 and an output speed of 1,440 / 3.05 ≈ 472.1 rpm, about 1.6% slower. Whether that change is acceptable depends on the conveyor's required speed. The point is to consider it deliberately, because the tooth numbers decide wear behaviour as well as speed.

## Check the ratio against the requirement

Ratios are rarely free choices. A conveyor speed, a pump flow or a spindle speed sets the requirement, and tooth numbers must be whole. The usual approach is to list the tolerable output speed range, then find tooth combinations within it, preferring hunting-tooth pairs, pinions with enough teeth to avoid undercut (Chapter 5) and gears that fit the available space.

## Exercise: a compound reduction

A two-stage compound train has an 18-tooth pinion driving a 54-tooth gear, and on the same shaft as that gear, a 20-tooth pinion driving a 70-tooth gear. The input turns at 1,440 rpm. Calculate the overall ratio and the output speed. Do either of the stages form a hunting-tooth pair?

The stage ratios are **54 / 18 = 3** and **70 / 20 = 3.5**, so the overall ratio is **3 × 3.5 = 10.5**. The output speed is **1,440 / 10.5 ≈ 137.1 rpm**. Neither stage is a hunting-tooth pair: 54 is a multiple of 18, and 70 and 20 share a factor of 10. A designer wanting better wear sharing might change the first stage to 19:58, whose tooth numbers share no common factor, giving a stage ratio of about 3.05, and then check the resulting output speed against the requirement.
