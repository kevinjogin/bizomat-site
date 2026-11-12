---
book: requirements-that-cannot-all-be-true
chapterSlug: life-preload-and-maintenance-free
order: 4
title: "Life against preload: backlash, rated life and the meaning of maintenance-free"
description: "How preload for low backlash, a stated life, a servicing limit and a budget interact through the cubic life law, what a rated life does and does not promise, and how to state a life requirement."
draft: false
---

Chapter 2 bounded three of the station's requirements: reversal error of no more than 0.003 mm at the probe, a life of 20,000 machine hours, and no servicing more often than the annual shutdown. Each is now definite. This chapter tests them together, because they meet in one place: the ball screw nut. Low reversal error needs preload. Preload is a load. Rated life falls with the cube of load. And rated life assumes the screw is lubricated, which is servicing.

This chapter calculates how those requirements interact for the case, shows what a rated life does and does not promise, and ends with an axis whose preload was raised after commissioning to cure backlash, and what that did to its life.

## What a rated life means

A ball screw's rated life is a statistical figure. It is the number of revolutions, or hours at a stated speed, that a stated share of a large group of identical screws will reach or exceed under a stated load, with proper lubrication and no contamination. Makers calculate it from the nut's dynamic load rating, which they publish, and the equivalent load the nut carries. The basic rating is the life that 90% of screws reach. One screw in ten fails sooner.

Three consequences follow for a specification.

- **A rated life is not a promise about each unit.** "Life 20,000 hours" cannot mean that every axis will last 20,000 hours. It can mean that the axis is designed so that its basic rated life at the stated duty is at least 20,000 hours, with a stated reliability. Makers give factors for higher reliability; using them shortens the calculated life.
- **The load includes the preload.** A preloaded nut carries its preload all the time, so the equivalent load is the external load plus the effect of preload. For a lightly loaded axis like this one, preload is most of the load.
- **The life assumes lubrication.** A dry or contaminated screw does not reach its rated life. A servicing requirement that prevents lubrication contradicts the life requirement.

```figure
type: formula
title: Duty-cycle life of a ball screw
formula: L = (C_a ÷ f_w F_m)³ × 10⁶ revolutions
formula: F_m = [Σ F_i³ n_i t_i ÷ Σ n_i t_i]^(1/3); hours = L ÷ (60 n_m)
caption: The cube is what makes preload expensive. Half again as much load takes life down to (1 ÷ 1.5)³, about 30% of what it was.
- C_a | dynamic load rating of the nut, from the maker, kN
- f_w | load factor for shock and vibration, about 1.2 for smooth running
- F_m, F_i | cubic mean load, and load in each step, including preload, kN
- n_m, n_i, t_i | mean speed and each step's speed, rpm, and share of time
step: Each step's share of life used rises with the cube of its load and in proportion to its speed and time.
```

## Which hours

This is an illustration. The customer's engineering manager wrote "20,000 hours" meaning five years of two shifts, about 4,000 machine hours a year. The axis does not move all the time. From the cycle in Chapter 3, the carriage is moving during about 9 to 12 s of each 57 to 60 s cycle, and the station also waits for loading. The engineer takes the screw as turning for 40% of machine hours, which leaves margin for heavier use.

So 20,000 machine hours means 8,000 hours of screw running. A rated life calculation in running hours must therefore reach 8,000 hours, not 20,000. Getting this wrong in either direction is common. Treating 20,000 as running hours oversizes the screw by a factor of 2.5 in hours, which with the cube law means a much larger nut. Treating running hours as machine hours undersizes it.

The engineer writes the interpretation into the requirement: "20,000 machine hours at the stated duty, the screw turning for no more than 40% of them".

## The calculation for the case

The [ball screw duty-cycle life tool](/tools/ballscrew-duty-life/) in BIZOMAT Tools calculates the life of a ball screw over a duty cycle of up to four load and speed steps. It works out the time-weighted mean speed and the cubic mean load, then the rated life in revolutions and hours at that load with the load factor, and the travel over the life in kilometres, and compares the hours with the life you need. Its limitations are stated with it: it gives the basic rating life at 90% reliability; poor lubrication or contamination shortens it; and preload must be included in each step's load by the user.

This is an illustration. The engineer models the duty in two steps of moving time. Rapid moves at full speed take 40% of it, with an external axial load of 0.4 kN for acceleration and friction. Slow probing moves at one fifth of full speed take the other 60%, with 0.1 kN. To each step she adds the preload, as a share of the nut's dynamic load rating, because the screw maker's guidance for the reversal error R10 needs suggests a light to medium preload of between 2 and 5% of the rating. The load factor is 1.2.

She checks two screws. The 32 mm screw with a 32 mm lead, the one that survived Chapter 3 at 0.5 m/s, has a dynamic rating of 20 kN in the builder's catalogue and turns at 937.5 rpm at full speed. The 25 mm screw with a 25 mm lead, the only one inside the original budget, has a rating of 12 kN; she checks it at its original duty of 1.0 m/s, 2,400 rpm, to see whether life would have added a second reason to reject it.

```figure
type: compare
title: Rated life in running hours against preload
cols: Preload | Cubic mean load | Rated life | Against 8,000 h
caption: This is an illustration. Results from the ball screw duty-cycle life tool, basic rating life at 90% reliability. The 32 mm screw has life to spare at any likely preload; the 25 mm screw at 1.0 m/s runs short with a heavy preload.
- 32 mm at 0.5 m/s | 2% of 20 kN, 0.40 kN | 0.750 kN | 374,452 h | Adequate
- * 32 mm at 0.5 m/s | 5% of 20 kN, 1.00 kN | 1.342 kN | 65,460 h | Adequate
- 32 mm at 0.5 m/s | 8% of 20 kN, 1.60 kN | 1.939 kN | 21,719 h | Adequate
- 25 mm at 1.0 m/s | 2% of 12 kN, 0.24 kN | 0.595 kN | 63,377 h | Adequate
- 25 mm at 1.0 m/s | 5% of 12 kN, 0.60 kN | 0.947 kN | 15,741 h | Adequate
- 25 mm at 1.0 m/s | 8% of 12 kN, 0.96 kN | 1.303 kN | 6,043 h | Too short
```

The table shows the cube law at work. For the 32 mm screw, raising preload from 2% to 5% of the rating cuts life from about 374,000 hours to about 65,000 hours, by more than five times, even though the external load has not changed at all. Raising it again to 8% cuts life to about 22,000 hours. With no preload the external loads alone would give a life of millions of hours; on this axis, the life is set almost entirely by the preload chosen to meet R10.

The 25 mm screw is adequate with light or medium preload but falls short with heavy preload. If someone had read 20,000 as running hours, it would fail even at 5% preload: 15,741 hours against 20,000. Life would have been a second, independent reason to reject it, after critical speed.

### Is life a real conflict here?

For the 32 mm screw at 0.5 m/s, no. With the 5% preload the maker suggests, the rated life is about eight times the requirement. The engineer records that life does not conflict with R8, R10 and R11 for this screw, and says so in the report. A conflict screen that finds no conflict is still a result: it removes a worry and narrows the discussion.

But the result depends on three choices that someone could later change: the preload, the duty and the lubrication. The report names each, because a change to any one of them after delivery can turn an adequate life into an inadequate one.

### When the customer means every axis

Suppose the customer replies that 20,000 hours was meant for every station it buys, not for nine in ten. That is a request for a higher reliability than the basic rating, and it is a reasonable one for a station that stops production when its axis fails. It is not, however, a request that any rating can grant in full. No calculation can promise that every unit of a mass-produced part will survive a stated life; it can only make early failure rarer.

The honest response is to restate the requirement at a reliability the customer chooses, for example 99%, and to apply the screw maker's reliability factor to the calculated life. That factor shortens the life, and it shortens it more the higher the reliability asked for. For the 32 mm screw at 5% preload, the basic life is about eight times the requirement, so the margin can absorb a substantial reliability factor and still meet 8,000 running hours. For the 25 mm screw at 5% preload and 1.0 m/s, whose basic life is less than twice the requirement, it might not. The engineer asks the maker for its factor rather than estimating one, and puts the chosen reliability into the requirement.

This is the improbable kind of conflict from Chapter 1 appearing inside a physical calculation. "Every axis lasts 20,000 hours" is not impossible for any one axis. It is improbable for a fleet, and the improbability grows with the fleet. A requirement that names its reliability turns that improbability into a number both parties can agree.

## Travel, lubrication and the annual shutdown

The bounded servicing requirement allows one relubrication a year, at the annual shutdown, with the fill point outside the guard. Whether that is enough depends on how far the nut travels in a year, because screw makers state relubrication intervals in distance travelled, and on the capacity of the lubrication unit fitted to the nut.

This is an illustration. The duty-cycle tool reports a mean speed of 488 rpm for the 32 mm screw at 0.5 m/s. At a 32 mm lead, that is 15.6 m of travel per minute of running. At 1,600 running hours a year, 40% of 4,000 machine hours, the nut travels about 1,500 km a year.

```figure
type: stats
title: The servicing question in numbers
caption: This is an illustration. The annual travel is what the lubrication unit must cover between shutdowns. The figure goes to the screw maker as a question, not to the customer as a promise.
- 488 rpm | Mean screw speed | From the duty-cycle life tool
- 15.6 m/min | Travel while running | 488 rpm × 32 mm lead
- 1,600 h | Running hours a year | 40% of 4,000 machine hours
- * About 1,500 km | Nut travel a year | The distance one fill must last
```

The engineer sends that figure to the screw maker with a question: what lubrication unit and interval would cover 1,500 km, in a workshop up to 35 °C with welding fume nearby? The maker's answer, not the engineer's estimate, decides whether R9 and the life calculation are consistent. If one fill cannot cover a year, either the servicing requirement or the lubrication method must change. That is the contradiction from Chapter 1 between maintenance-free and the general condition G1, now made definite and testable.

## Why not the 25 mm screw at 0.5 m/s?

A careful reader will ask whether the cheaper 25 mm screw would do at 0.5 m/s, now that the speed has been halved. At 0.5 m/s it turns at 1,200 rpm. Chapter 3's figures show that with fixed–supported mounting its allowed speed is 926 rpm, so it still fails. With both ends fixed its allowed speed is 1,343 rpm, so it passes at 71.5% of critical, and its life at half the speed would be twice the 15,741 hours shown above for 5% preload.

The engineer still prefers the 32 mm screw, for a reason that belongs to the next chapter. A screw fixed at both ends cannot grow freely when it warms. In a workshop that runs from 15 to 35 °C, with a preloaded nut adding heat, a fixed–fixed screw either builds up thermal axial load or must be pre-tensioned to absorb its growth. Either adds cost and design work. The 32 mm screw with one end free to slide avoids that, and its margins on speed and life are wider. The choice is recorded as a judgement with its reasons, not as an impossibility.

## The failure case: preload raised to cure backlash

This is an illustration. Two years ago the builder supplied an axis whose customer complained, a few months after delivery, of a small lost motion on reversal. A service technician increased the nut's preload by fitting oversize balls, as the maker's service manual allowed. The lost motion went away. Nobody recalculated the life.

The original preload was about 5% of the dynamic rating; the new one about 8%. For a duty like the one above, the cube law cuts life to about a third, since (1.342 ÷ 1.939)³ ≈ 0.33. The axis that had been designed with a comfortable margin now had little. Eighteen months later the nut ran rough, and teardown showed spalling on the balls and grooves, the classic sign of rolling fatigue.

### How it is detected and corrected

The error is detected by treating preload as a design value with a record, like a bolt torque. Any change to it triggers a life recalculation with the duty-cycle tool, using the new step loads. On the shop floor, a rise in drag torque, measured by the drive's current at constant slow speed, shows that preload has gone up even when nobody recorded it.

The correction in that case was a replacement nut at the original preload and a change to the probing routine. The lost motion the customer saw was not from the nut at all, but from a slightly loose coupling, which the higher preload had masked by stiffening the drive. The real fault was fixed in ten minutes; the masking had cost a nut.

## Writing the life requirement

The engineer's rewrite of R8 makes every assumption visible.

```figure
type: checklist
title: What a life requirement states
caption: Each line removes a way the requirement could be read differently by designer, customer and service technician.
- The life and its unit | 20,000 machine hours
- The duty | screw turning for no more than 40% of machine hours, at the stated speed steps and loads
- The reliability | basic rating life, 90% of a large group, unless a higher reliability is specified
- The preload | design value as a share of the dynamic rating, recorded on the drawing
- The lubrication | method, interval and quantity from the screw maker for the stated travel
- ? The trigger for recalculation | any change to preload, duty, speed or lubrication after delivery
```

## Exercise: the effect of a preload change

On the 32 mm screw at 0.5 m/s, with the duty above, a service technician proposes raising preload from 5% to 8% of the rating.

1. By what factor does the rated life fall, and what is the new life in running hours?
2. Does the axis still meet 20,000 machine hours? What would you check before agreeing?

**Worked answer.**

1. At 5% preload the cubic mean load is 1.342 kN and the rated life 65,460 hours. At 8% the duty-cycle life tool gives a cubic mean load of 1.939 kN and a life of 21,719 hours. The factor is 21,719 ÷ 65,460 ≈ 0.33, matching (1.342 ÷ 1.939)³.
2. The axis needs 8,000 running hours for 20,000 machine hours at 40% running, so 21,719 hours still meets the requirement, with a smaller margin. Before agreeing, check why the change is wanted. If the complaint is lost motion, measure the reversal error and look for other causes, such as a loose coupling or bearing, before adding preload. Then check the drag torque and motor current at the higher preload, the nut temperature in a warm workshop, which affects accuracy, and the lubrication interval, which may shorten. Record the new preload on the drawing.
