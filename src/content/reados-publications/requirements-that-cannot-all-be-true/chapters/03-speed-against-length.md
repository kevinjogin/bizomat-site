---
book: requirements-that-cannot-all-be-true
chapterSlug: speed-against-length
order: 3
title: "Speed against length: critical speed and the long ball screw axis"
description: "How the critical speed of a screw links travel, traverse speed and screw size, how to prove that a set of requirements breaks that limit, and how to check what the speed requirement is really for."
draft: false
---

The first physical conflict in the inspection station request involves three requirements written by two departments. Production wants 1,500 mm of travel and a rapid traverse of 1.0 m/s. Purchasing wants the axis to cost no more than A$9,000. On paper they have nothing to do with each other. A rotating screw connects them, because a long, slender screw has a speed at which it starts to whirl, and that speed falls sharply with length.

This chapter states the linking premise, uses it to test every screw the machine builder might use, and shows that the three requirements cannot all be met by a screw-driven axis. It then asks what the speed requirement is for, which turns out to be the more useful question.

## The linking premise: critical speed

A shaft spinning between bearings has natural frequencies of bending vibration. When its rotational speed approaches the lowest of them, any small imbalance or bend is amplified, and the shaft bows outward and whirls. For a ball screw the result is noise, vibration, loss of accuracy and, at worst, a bent screw. The [Whirling Shafts chapter on critical speeds of real shafts](/reados/publications/whirling-shafts-by-the-numbers/critical-speeds-of-real-shafts/) explains the physics in detail.

For a uniform screw, the critical speed depends on four things: the root diameter, the unsupported length, the way the ends are held, and the material. Screw makers and designers apply a margin, commonly running no faster than about 80% of the critical speed.

```figure
type: formula
title: Critical speed of a uniform screw
formula: n_c = (λ² ÷ 2πL²) × √(E I ÷ ρ A) × 60
caption: For a solid round section, √(I ÷ A) is a quarter of the diameter, so the critical speed rises in proportion to the root diameter and falls with the square of the length.
- n_c | critical speed, rpm
- λ | end-fixity constant: 3.927 fixed–supported, 4.730 fixed–fixed
- L | unsupported length, m
- E, ρ | elastic modulus, Pa, and density, kg/m³
- I, A | second moment of area and area of the root section
step: Doubling the length cuts the critical speed to a quarter.
step: Fixing both ends instead of one raises it by (4.730 ÷ 3.927)², about 1.45 times.
step: A larger root diameter raises it in direct proportion: a 34 mm root runs about 1.62 times as fast as a 21 mm root.
```

The square of the length is what makes long axes hard. Every extra 100 mm of travel costs more critical speed than the last.

## The numbers for the case

This is an illustration. The screw must span more than the travel. The carriage is 150 mm long, the nut sits within it, and each end needs clearance to the bearing housing. The engineer takes the unsupported length as 1,850 mm, from the fixed bearing to the far support.

The traverse speed sets the screw speed through the lead, the distance the nut moves per revolution. At 1.0 m/s, a 25 mm lead needs 2,400 rpm, a 32 mm lead 1,875 rpm and a 40 mm lead 1,500 rpm. Longer leads reduce the speed, but each lead comes only with certain diameters in the catalogue the builder uses.

The [ball screw critical speed and buckling tool](/tools/ballscrew-limits/) in BIZOMAT Tools calculates the critical (whirling) speed and the Euler buckling load of a screw from its root diameter, unsupported length, end mounting and material, and compares them with the operating speed and axial load, using the shares of each that you allow. It models the screw as a uniform shaft at its root diameter, ignores the stiffness of the nut and supports, and reminds you that nut life and the maker's speed limit for the nut are separate checks.

The engineer runs it for three catalogue screws, each with fixed–supported and fixed–fixed mounting, steel at 206 GPa and 7,850 kg/m³, an allowed share of 80% of critical speed, and an axial load of 400 N for acceleration and friction.

```figure
type: compare
title: Three screws at 1.0 m/s over an 1,850 mm span
cols: Speed needed | Critical, fixed–supported | Critical, fixed–fixed | Verdict at 80% of critical
caption: This is an illustration. Results from the ball screw critical speed and buckling tool. Only the largest screw with both ends fixed runs at 1.0 m/s within the margin. Buckling is not a concern at 400 N for any of them.
- 25 mm, 25 mm lead, root 21 mm | 2,400 rpm | 1,157 rpm | 1,679 rpm | Outside: 207% and 143% of critical
- 32 mm, 32 mm lead, root 27 mm | 1,875 rpm | 1,488 rpm | 2,159 rpm | Outside: 126% and 86.9% of critical
- * 40 mm, 40 mm lead, root 34 mm | 1,500 rpm | 1,874 rpm | 2,718 rpm | Fixed–fixed within: 55.2% of critical
```

The 25 mm screw would run at more than twice its critical speed with the usual mounting. Even with both ends fixed it would run at 143% of critical. The 32 mm screw fails both ways, though with both ends fixed it is close: 86.9% of critical against an allowed 80%. The 40 mm screw with fixed–supported mounting is just outside, at 80.1%, and comfortable with both ends fixed.

### Which length to enter

The result is sensitive to length, so the length deserves care. The tool's guidance is to enter the distance between the bearings, or from the fixed bearing to the nut at its furthest position for a screw with one free end. For the inspection station, the screw is supported at both ends, so the engineer uses bearing to bearing. Taking only the 1,500 mm travel would overstate the critical speed by (1,850 ÷ 1,500)², about 52%. The tool then shows the 32 mm screw with both ends fixed at 57.1% of critical, apparently comfortable at 1.0 m/s, when at its true length it is outside the margin.

Two further simplifications sit inside the tool's model, and both are named in its limitations. The nut and the supports are not perfectly stiff, so the real critical speed is somewhat lower than a rigid-support calculation gives. And the 80% margin is a design rule, not a law: it is the share of critical speed your own rules or the screw maker allow. Neither simplification helps the 25 mm screw, which fails by a factor of two. They matter only for borderline cases such as the 40 mm screw with fixed–supported mounting at 80.1%, which the engineer treats as a failure rather than a pass, because the modelling errors all run in the unsafe direction.

### What a coarse lead costs

Choosing a longer lead is the obvious way to cut screw speed, and it is why the 40 mm screw with a 40 mm lead survives. But a coarse lead moves other quantities. Two matter here.

The first is torque. A larger screw is heavier and has more rotational inertia, and a longer lead means each newton of carriage force needs more motor torque. For the case, the engineer estimates the torque to accelerate the screw and the 60 kg carriage at 5 m/s², ignoring the motor's own rotor and friction. The 25 mm screw, 7.13 kg over its length, needs about 1.89 N·m. The 32 mm screw, 11.68 kg, needs about 3.00 N·m. The 40 mm screw, 18.25 kg, needs about 4.78 N·m, two and a half times as much as the smallest screw, so it needs a larger motor and drive. The cost of the speed requirement therefore turns up again in the motor.

The second is resolution and sensitivity. With a 40 mm lead, one revolution of the motor moves the carriage 40 mm, so a given angular error in the motor or its encoder becomes a larger position error at the carriage than it would with a finer lead. That does not make the 40 mm screw unusable, but it adds to the case for measuring the carriage position directly with a linear scale, which Chapter 5 reaches by a different route.

### The impossibility, stated carefully

The engineer can now state the conflict precisely. The 25 mm rolled screw is the only screw assembly in the builder's catalogue whose price fits the A$9,000 budget. At 1,850 mm and 1.0 m/s, it runs well above its critical speed with any end mounting. The 40 mm screw that meets the speed costs considerably more, and once it is ground to the accuracy that R3 demands and fitted with bearings at both fixed ends, the axis cannot be built for A$9,000. Chapter 8 prices the options in full.

So R1, R2 and R11 cannot all be met by a screw-driven axis from this catalogue. That last qualification matters. An impossibility claim is always relative to a class of designs, and the claim should name the class. Outside it, the critical-speed premise does not apply in the same way.

```figure
type: compare
title: Designs that escape the critical-speed premise, and what they bring instead
cols: Why critical speed changes | What it brings instead
caption: Each alternative moves the conflict rather than removing it. The question for each is whether its new costs fall on requirements that can bear them.
- Rotating nut, fixed screw | The screw does not spin; only the nut and its housing rotate | A dearer nut and drive; higher moving mass on the carriage
- Belt drive | No long rotating shaft | Belt stretch under acceleration limits accuracy; Chapter 1's gantry failure
- Rack and pinion | Pinion speed is low and the rack is fixed | Backlash at the mesh, against R10
- Linear motor | No mechanical transmission | Cost, heat in the carriage and magnetic attraction on the beam
- Mid-span screw supports | Shorter effective length between supports | Supports that move with the carriage add parts and cost
```

## Ask what the speed is for

Before choosing among expensive alternatives, the engineer asks production why the axis needs 1.0 m/s. The answer is cycle time. Production wants to inspect a frame in under a minute. The 1.0 m/s came from the brochure of a station it had seen at a trade show.

The engineer models the cycle. This is an illustration. A typical frame has 24 holes. The probe moves about 125 mm between holes, dwells 2.0 s at each to probe it, and makes one 1,500 mm return move at the end. The axis accelerates and decelerates at 5 m/s², limited by the probe head's cabling.

A move of 125 mm at 5 m/s² never reaches 1.0 m/s. Accelerating to 1.0 m/s takes 0.1 m, and decelerating takes another 0.1 m, so a move needs at least 200 mm to touch full speed. A 125 mm move peaks at about 0.79 m/s and takes 0.316 s. Only the return move reaches 1.0 m/s.

```figure
type: bars
title: Cycle time for a 24-hole frame at two rapid speeds
unit: s
caption: This is an illustration. Moves of 125 mm at 5 m/s² peak at 0.79 m/s, so the speed limit affects them little. Halving the rapid speed adds 2.21 s to a 57.29 s cycle, 3.86%.
- Probing dwell, either speed | 48.00
- Moves between holes at 1.0 m/s | 7.59
- Moves between holes at 0.5 m/s | 8.40
- Return move at 1.0 m/s | 1.70
- * Return move at 0.5 m/s | 3.10
```

The cycle at 1.0 m/s is 57.29 s; at 0.5 m/s it is 59.50 s. The difference, 2.21 s or 3.86%, is the whole value of the speed requirement. At 6,000 frames a year it amounts to about 3.7 hours of station time. Both cycles meet production's actual target of under a minute.

At 0.5 m/s, the 32 mm screw with a 32 mm lead turns at 937.5 rpm. With the usual fixed–supported mounting, the tool gives an allowed speed of 1,190 rpm, and the screw runs at 63% of its critical speed. The conflict disappears, not because anyone found a cleverer screw, but because the requirement was restated from its purpose.

## The failure case: the catalogue speed without the length

This is an illustration. The builder has met this conflict before, from the other side. On an earlier axis, a designer selected a screw from the maker's table of maximum speeds, which lists a speed for each size. The table's speeds applied to a short reference length. The installed screw was more than twice that length. At commissioning, the axis ran smoothly up to about 1,800 rpm, then began to hum and shake. Above 2,000 rpm the carriage position wandered by several hundredths of a millimetre.

### How it is detected and corrected

The error is detected in design by checking critical speed at the actual unsupported length, with the actual end mounting, every time. A maker's maximum speed is usually a limit for the nut or the ball recirculation, not a whirling limit for your length, and the two are separate checks. If the error escapes design, a commissioning run-up detects it: increase speed in steps with a vibration probe on the bearing housing, and stop at the first rise in amplitude.

The correction on that job was to lower the maximum speed in the control to 75% of the measured onset and accept a slightly longer cycle. That worked only because, as here, the speed mattered less than anyone had assumed. Had the speed been essential, the fix would have been a larger screw or fixed bearings at both ends, at far higher cost after the machine was built.

## What this chapter has proved and what it has not

The calculation proves that R1, R2 and R11 cannot all be met by a screw-driven axis from the builder's catalogue. It does not prove that the station cannot meet production's real need. It also leaves several things for later chapters. The 32 mm screw at 0.5 m/s must still be checked for life under preload (Chapter 4), for accuracy over a 1.5 m length in a warm workshop (Chapter 5), and for cost (Chapter 8). The beam that carries it has its own conflict (Chapter 6). A requirement that survives one physical test has not survived them all.

The chapter has also shown a pattern that recurs through the book. The conflict was real and could be proved by calculation. But the most valuable step was not the calculation; it was the question it prompted. Once the engineer could show that 1.0 m/s cost a larger screw, a larger motor and the budget, it became reasonable to ask production what 1.0 m/s bought. Without the calculation, that question would have sounded like a supplier trying to deliver less. With it, the question was an offer: here is what the number costs, and here is what it buys, so which do you want? Production agreed in a five-minute conversation that 0.5 m/s would do, subject to the checks in the chapters that follow.

## Exercise: a shorter axis

A different customer wants 1.0 m/s on an axis whose screw spans 1,200 mm, using the same 25 mm screw with a 25 mm lead and a 21 mm root.

1. Can it run at 1.0 m/s with fixed–supported mounting, using an 80% margin? With fixed–fixed mounting?
2. What is the longest fixed–supported span at which it could?

**Worked answer.**

1. At 1.0 m/s the screw turns at 2,400 rpm. The ball screw critical speed and buckling tool gives a critical speed of 2,750 rpm for fixed–supported mounting, so the allowed speed is 2,200 rpm and the screw would run at 87.3% of critical: outside the margin. With fixed–fixed mounting the critical speed is 3,990 rpm and the allowed speed 3,192 rpm; the screw runs at 60.1% of critical, within the margin.
2. The screw needs a critical speed of 2,400 ÷ 0.8 = 3,000 rpm. Critical speed falls with the square of length, so the longest span is 1,200 × √(2,750.4 ÷ 3,000) ≈ 1,149 mm. The tool confirms that at 1,149 mm the allowed speed is 2,400 rpm. In practice the designer would leave some margin below that length, and would also check the nut's own speed limit with its maker.
