---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: choosing-the-ratio
order: 5
title: "Choosing the ratio"
description: "How the gear ratio trades motor torque against speed, why accelerating torque is least when reflected and rotor inertia are equal, and how top speed and real gearboxes set the ratio."
draft: false
---

Chapter 4 reflected the pusher's load through a 5:1 gearbox and found the servo needed 7.6 N·m. Without the gearbox it would have needed 27.1 N·m. That raises the obvious question: if 5:1 is so much better than 1:1, would 10:1 be better still? The answer is no, and the reason is one of the neatest results in drive design. Past a certain ratio, the motor spends more torque accelerating its own rotor, which must now spin faster, than it saves on the load.

This chapter finds that ratio for the DL-3's pusher with the WORKOS inertia matching ratio tool, shows why the best theoretical ratio is not always the best practical one, and sets out how the mill chose 5:1. Its mistake is a ratio chosen for least torque that would have run the servo past its top speed.

## Two inertias, one acceleration

At a ratio i, the motor must accelerate its own rotor Jm and the reflected load JL ÷ (i² η). The load must reach its speed in the given time, so the motor's angular acceleration is i times the load's. The torque to accelerate both is (Jm + JL ÷ (i² η)) × i αL.

As i rises, the reflected load term shrinks as 1 ÷ i, but the rotor term grows as i, because the rotor must be accelerated harder. Their sum is least where the two terms are equal: where JL ÷ (i² η) = Jm, or i = √(JL ÷ (η Jm)). At that ratio the load's reflected inertia exactly equals the motor's rotor inertia, which is why the result is called inertia matching.

```figure
type: formula
title: The ratio that minimises accelerating torque
formula: T accel = (Jm + JL ÷ (i² η)) × i αL
formula: Optimum: i = √(JL ÷ (η Jm))
formula: Usable: i ≤ n motor max ÷ n load
caption: αL is the load's angular acceleration. At the optimum, the reflected load equals the rotor's inertia and the inertia ratio is 1:1. Load torque, which falls as 1 ÷ i, pushes the true optimum slightly higher; the motor's top speed may cap it lower.
- Jm | motor rotor inertia, plus gearbox input inertia
- JL | load inertia at the load shaft
- αL | load's angular acceleration
```

## The pusher's ratio

For the pusher, JL = 0.173 kg·m² at the pulley, Jm = 0.0029 kg·m², and η = 0.95. The optimum ratio is √(0.173 ÷ (0.95 × 0.0029)) = 7.92. The servo's top speed is 3,000 rpm and the pulley's top speed 382 rpm, so the largest ratio the servo can turn is 3,000 ÷ 382 = 7.85.

The [inertia matching ratio tool](/tools/inertia-matching-ratio/) takes the load inertia, the motor inertia, a chosen ratio, the gearbox efficiency, the load speed and acceleration time, the load torque, the motor's top speed and its peak torque. At the chosen ratio it returns the same results as the reflected inertia tool: reflected inertia and inertia ratio, motor speed, acceleration and load torques and the motor torque. It then returns the optimum ratio for acceleration, the largest ratio within the motor's top speed, the better of the two, and the motor torque at that ratio, and checks the chosen ratio against the motor's speed and peak torque.

```figure
type: steps
title: The pusher at 5:1 in the inertia matching ratio tool
caption: This is an illustration. JL = 0.173 kg·m², Jm = 0.0029 kg·m², chosen ratio 5:1, 95%, 382 rpm in 0.3 s, load torque 3.693 N·m, servo top speed 3,000 rpm, peak torque 14.3 N·m.
- Reflected inertia and inertia ratio | 0.00728 kg·m², 2.51 : 1
- Motor speed | 1,910 rpm
- Motor torque at 5:1 | 7.567 N·m
- Optimum ratio for acceleration | 7.92 : 1
- Largest ratio within motor speed | 7.85 : 1
- * Torque at the best usable ratio | 6.623 N·m: RATIO SUITABLE at 5:1
```

### The torque curve is flat near the optimum

The best usable ratio, 7.85:1, needs 6.62 N·m. The chosen 5:1 needs 7.57 N·m, 14% more. Between 6:1 and 10:1 the torque varies by only about 6%. Near its minimum, the torque curve is so flat that a ratio well below the optimum costs little.

```figure
type: line
title: Pusher motor torque against gear ratio
x: Gear ratio, motor ÷ pulley
y: Peak motor torque, N·m
ymin: 6
ymax: 11
mark: 7.85 | motor top speed
caption: This is an illustration. The torque falls steeply up to about 5:1 and is nearly flat from 6:1 to 10:1. Ratios above 7.85:1 would run the servo past its 3,000 rpm top speed on the longest move.
- 3 | 10.549
- 4 | 8.589
- 5 | 7.567
- 6 | 7.015
- 7 | 6.731
- 8 | 6.614
- 10 | 6.683
```

The load torque moves the true minimum a little: including the 3.69 N·m of friction, which reflects as 1 ÷ i, the least torque is at about 8.5:1. That is a refinement the tool's formula leaves out, and on a curve this flat it makes no practical difference.

## Why the mill chose 5:1

Planetary gearboxes for servos come in standard ratios: 3, 4, 5, 7, 8 and 10 to 1 in a single stage are common. The candidates near the optimum were 7:1 and 8:1. The mill's controls engineer chose 5:1 for three reasons, each of which the numbers support.

First, speed margin. At 7:1 the servo would run at 2,674 rpm on the longest move, 89% of its top speed, leaving little room for a faster cutting list later. At 8:1 it would need 3,056 rpm, beyond its limit. At 5:1 it runs at 1,910 rpm, 64% of its top speed, and the pusher could be speeded up by half without a new gearbox.

Second, the torque saving from a higher ratio was small: 7:1 saves 0.84 N·m against a peak of 14.3 N·m. The servo already has nearly twice the peak torque the 5:1 move needs.

Third, the load is not fixed. The board's 24 kg is the heaviest on the cutting list; the lightest weighs 6 kg, which brings JL down to 0.128 kg·m² and the optimum to 6.8:1. A ratio chosen to match one board exactly is mismatched for every other.

```figure
type: compare
title: Three standard ratios for the pusher
cols: Motor speed on the longest move | Share of top speed | Peak torque | Inertia ratio
rowhead: Ratio
- 4:1 | 1,528 rpm | 51% | 8.59 N·m | 3.92 : 1
- * 5:1 | 1,910 rpm | 64% | 7.57 N·m | 2.51 : 1
- 7:1 | 2,674 rpm | 89% | 6.73 N·m | 1.28 : 1
caption: This is an illustration. Heaviest board. All three are within the servo's 14.3 N·m peak; the choice is made on speed margin and on the range of boards, not on torque alone.
```

## Other things the ratio changes

The ratio also changes how fine the motor's control of the load is. The servo's encoder resolves a fraction of a motor revolution; through 5:1 and a 100 mm pulley, one motor revolution moves the carriage π × 100 ÷ 5 = 62.8 mm, so an encoder of, say, 20 bits resolves about 0.06 µm. Positioning resolution is not a limit here, but on a direct drive with a coarse encoder it can be.

It changes the holding torque at rest, which falls as 1 ÷ i, and the torque the drive must provide to resist a disturbance, such as a board striking the stop. And it changes the gearbox's own size and cost: higher ratios in one stage are less efficient and, beyond about 10:1, usually need a second stage.

A ratio is therefore a compromise between acceleration torque, top speed, load variation, stiffness and cost. The inertia-matching formula identifies where the acceleration term is least, and shows how much is lost by moving away from it; it does not choose the ratio on its own.

## For a linear axis, the pulley is part of the ratio

On a belt, rack or screw axis the gearbox is only half the ratio. The other half is the pulley, pinion or screw lead, which sets how far the load moves for each turn of the gearbox's output. What the motor actually sees is the number of radians it turns for each metre the load travels: the gearbox ratio divided by the pulley's radius. For the pusher, 5 ÷ 0.05 = 100 rad per metre, or 15.9 motor revolutions per metre.

Any combination with the same overall figure gives nearly the same result. A 60 mm pulley with a 3:1 gearbox is also 100 rad per metre. Its linear masses reflect as 68 × 0.03² = 0.061 kg·m², and the pulley must turn at 637 rpm for 2 m/s, so the servo again runs at 1,910 rpm and needs 7.56 N·m, within 0.1% of the 100 mm pulley with 5:1. The tiny difference comes from the smaller pulleys' own inertia.

For a linear mass m alone, the inertia-matching optimum can be written directly in these terms: the motor should turn √(m ÷ (η Jm)) radians per metre. For 68 kg and the pusher's servo that is √(68 ÷ (0.95 × 0.0029)) = 157 rad per metre, which with the 100 mm pulley is the 7.85:1 found above. The form is useful when a designer is choosing the pulley and the gearbox together: it gives the target, and any pair of standard parts near it will do.

```figure
type: compare
title: Two ways to get 100 rad per metre on the pusher
cols: Pulley pitch diameter | Gearbox ratio | Motor speed at 2 m/s | Peak motor torque
rowhead: Arrangement
- * As built | 100 mm | 5:1 | 1,910 rpm | 7.57 N·m
- Smaller pulley | 60 mm | 3:1 | 1,910 rpm | 7.56 N·m
- Smaller pulley, same gearbox | 60 mm | 5:1 | 3,183 rpm: too fast | 6.60 N·m
caption: This is an illustration. 68 kg moving, servo rotor 0.0029 kg·m², 95%, 0.3 s to 2 m/s. The overall ratio in radians per metre, not the gearbox alone, sets the result. Keeping the gearbox and shrinking the pulley would overspeed the servo.
```

## The gearbox's own inertia

A gearbox has inertia too, quoted by its maker at the input shaft, and it belongs on the motor's side of the calculation. A planetary gearbox of the pusher's size might add about 0.0004 kg·m² at its input. Adding it to the servo's 0.0029 kg·m² gives 0.0033 kg·m², which moves the optimum from 7.92:1 to 7.43:1 and raises the torque at 5:1 from 7.57 to 7.83 N·m.

The effect is small here, a 3.5% rise in peak torque, but it is easily forgotten, and on a small servo with a large gearbox it can be a substantial share of the motor's side. The inertia ratio is then more honestly reported as reflected load ÷ (rotor + gearbox), which is how some servo makers define it.

## Checking the choice in commissioning

A ratio chosen on paper is confirmed on the machine. A servo drive records the motor's torque, speed and position as it runs, and during commissioning the mill ran the pusher through its longest move with the heaviest board and read the drive's peak torque from its trace. A peak close to the predicted 7.6 N·m confirms the inertia and friction estimates; a peak well above it points to friction the calculation missed, such as a carriage rail out of line, or to an inertia larger than assumed. The same trace shows how far the carriage overshoots at the end of the move, which is the practical measure of whether the inertia ratio and the belt's stiffness allow the tuning the cutting list needs.

## When something else sets the ratio

Inertia matching answers one question: which ratio makes acceleration cheapest in torque. Many drives are governed by something else, and then the ratio follows from that.

A drive that spends most of its time running at constant speed, such as the infeed rollers or a conveyor, is sized by its running torque and speed. Its ratio is simply the motor's rated speed divided by the load's working speed, 1,450 ÷ 159 = 9.12 for the infeed, and acceleration is checked afterwards, as Chapter 3 did. A drive that must hold a large static load, such as a vertical axis, may need a high ratio so that a modest motor can hold it, whatever that does to acceleration. A drive whose motor runs hot over a long cycle is governed by its RMS torque, which depends on the ratio in a slightly different way from the peak, and Chapter 6 shows how to check it.

Induction motors on variable-speed drives sit between the two worlds. They can be accelerated quickly, but their rotors are larger for the same torque than a servo's, and their drives cannot usually hold a precise position. For such a drive the ratio is normally set by speed, the motor's base speed against the load's top speed, and the inertia ratio matters less than the time the motor can spend above its rated current while it accelerates.

The pusher is the case inertia matching was made for: short, repeated, fast moves where acceleration is almost the whole job. Even there, as this chapter has shown, the formula gives a starting point and a measure of what is lost by moving away from it, and the practical choice comes from the speed margin, the range of loads and the parts that can be bought.

## The mistake: the optimum past the top speed

An early design note took the optimum ratio, 7.92:1, rounded it to 8:1 as a standard size, and recorded it as the design ratio because it needed the least torque. Run through the tool, 8:1 gives a motor speed of 3,056 rpm on the longest move, and the tool reports RATIO NOT SUITABLE on speed.

The error was trusting the formula's optimum without its second line, the cap set by the motor's top speed. The tool reports both figures and the better of the two for that reason. Here the cap, 7.85:1, falls just below the optimum, and the nearest standard ratio below the cap is 7:1. The reviewer's further point was the one in the previous section: even 7:1 would leave too little speed margin for a line whose cutting lists change.

```figure
type: checklist
title: Before choosing a gear ratio for a servo axis
caption: The DL-3 review's checks. This is an illustration.
- x Optimum ratio calculated from the heaviest and lightest loads
- x Ratio capped by the motor's top speed on the fastest move, with a margin
- x Standard gearbox ratios listed and each checked for torque and speed
- x Peak torque within the motor's peak rating at the chosen ratio
- x Inertia ratio within the servo maker's guidance for the drive's stiffness
- ? RMS torque over the duty cycle (Chapter 6)
```

## Exercise: an indexing table

**Problem.** A rotary indexing table has 0.6 kg·m² and must reach 60 rpm in 0.2 s against 5 N·m of friction. The servo has 0.0015 kg·m², a top speed of 3,000 rpm and a peak torque of 6.4 N·m; the gearbox efficiency is 90%. Find (a) the optimum ratio and the speed cap, (b) the motor torque at 10:1, 20:1, 30:1 and 50:1, and (c) a sensible ratio.

**Answer.** (a) Optimum = √(0.6 ÷ (0.9 × 0.0015)) = 21.1:1. Speed cap = 3,000 ÷ 60 = 50:1.

(b) α of the table = 6.283 ÷ 0.2 = 31.42 rad/s². Motor torque = (0.0015 + 0.6 ÷ (0.9 i²)) × 31.42 i + 5 ÷ (0.9 i). At 10:1, 3.12 N·m; at 20:1, 2.27 N·m; at 30:1, 2.30 N·m; at 50:1, 2.89 N·m.

(c) Anything from about 20:1 to 30:1 needs within 2% of the least torque, which is 2.25 N·m at 21.1:1, and leaves the motor well within its speed. A standard 20:1 or 25:1 gearbox would suit, at an inertia ratio near 1:1.

**The check.** At 10:1 the torque is 39% higher than at 21.1:1, and the inertia ratio is 4.4:1: a ratio too low costs more than one too high, because the curve rises steeply below the optimum and gently above it.
