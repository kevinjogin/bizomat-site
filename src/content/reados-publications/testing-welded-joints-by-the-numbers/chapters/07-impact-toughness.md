---
book: testing-welded-joints-by-the-numbers
chapterSlug: impact-toughness
order: 7
title: "Impact toughness"
description: "Calculate the energy a Charpy specimen absorbs from the pendulum's swing, read a ductile-to-brittle transition curve, and handle the wide scatter of impact results near the transition."
draft: false
---

A steel that is tough at room temperature can be brittle in the cold. Below a certain temperature, many steels and their welds change from tearing slowly, absorbing a great deal of energy, to cracking suddenly with very little warning. Structures have failed this way, splitting apart in cold weather under loads they had carried safely for years, and the cracks have usually started at welds, where notches, residual stress and altered microstructure come together. The impact test measures how much energy a notched specimen absorbs when it is broken by a swinging hammer, at a chosen temperature, and so tells you whether the weld will be tough or brittle at the temperatures it will see.

This chapter explains the Charpy impact test, calculates absorbed energy from the pendulum, reads a transition curve, deals with the scatter of results, and works through the hopper procedure's impact tests.

## The Charpy test

A Charpy specimen is a small bar, typically 10 mm square and 55 mm long, with a V-shaped notch machined in the middle of one face. It is cooled or heated to the test temperature, placed across two supports, and struck on the face opposite the notch by a pendulum hammer released from a fixed height. The hammer breaks the specimen and swings on, rising less high than it would have without the specimen. The difference is the energy the specimen absorbed in breaking. ISO 148-1 describes the Charpy pendulum test; ISO 9016 sets out where specimens are taken from welds and how the notch is oriented.

```figure
type: formula
title: Energy absorbed by a Charpy specimen from the pendulum's swing
formula: KV = m × g × (h₁ − h₂)
caption: This is an illustration of the principle with a 300 J pendulum. Real machines read the absorbed energy directly from a calibrated scale or encoder, with corrections for friction.
- m | effective pendulum mass, 20.4 kg
- g | 9.81 m/s²
- h₁ | release height of the striker, 1.50 m (about 300 J available)
- h₂ | height reached after breaking the specimen, 1.23 m
step: available energy = 20.4 × 9.81 × 1.50 ≈ 300 J
step: absorbed energy = 20.4 × 9.81 × (1.50 − 1.23) ≈ 54 J
```

The result is reported in joules, with the test temperature and the specimen location, for example 54 J at −20 °C in the weld metal centre. A tough specimen absorbs a lot of energy, bends and tears before it breaks, and leaves a dull, fibrous fracture. A brittle specimen absorbs little, snaps cleanly, and leaves a bright, crystalline fracture. The proportion of fibrous fracture on the broken face, and the amount the specimen spreads sideways at the compression face, called lateral expansion, are sometimes reported as well.

## The transition curve

Testing sets of specimens at several temperatures produces a transition curve. At high temperatures, results sit on an upper shelf of high, fairly consistent energy, with ductile fracture. At low temperatures, they sit on a lower shelf of low energy, with brittle fracture. In between is the transition region, where energy rises steeply with temperature and results scatter widely, because each specimen fractures partly ductile and partly brittle.

This is an illustration. The fabricator tested sets of three weld-metal specimens from the hopper procedure at four temperatures:

```figure
type: line
title: Charpy transition curve for the hopper procedure's weld metal
x: Test temperature (°C)
y: Mean absorbed energy (J)
ymin: 0
ymax: 160
caption: This is an illustration; each point is the mean of three specimens. The steep rise between −40 °C and 0 °C is the transition region, where individual results scatter widely.
legend: Weld metal, mean of three
- -40 | 21.7
- -20 | 54.3
- 0 | 102.7
- 20 | 141.0
```

| Temperature | Individual results | Mean |
|---|---|---|
| −40 °C | 18, 25, 22 J | 21.7 J |
| −20 °C | 64, 41, 58 J | 54.3 J |
| 0 °C | 102, 96, 110 J | 102.7 J |
| +20 °C | 140, 135, 148 J | 141.0 J |

Reading the table and the curve together, the weld metal is on its upper shelf at room temperature, in its transition region between about −40 °C and 0 °C, and approaching its lower shelf at −40 °C.

## Why the test temperature matters

The test temperature should relate to the lowest temperature the structure will see in service, with the margin the design standard or specification requires. A weld that absorbs 141 J at +20 °C and 22 J at −40 °C is tough on a summer afternoon and close to brittle on a cold winter night in an inland mining region.

This is an illustration. The hopper customer's specification for this example requires impact testing of the weld metal and the heat-affected zone at −20 °C, with a minimum average of 40 J for each set of three and no individual result below 30 J. The weld-metal set at −20 °C, with results of 64, 41 and 58 J and a mean of 54.3 J, passes both requirements. A set from the fusion line, with the notch placed where the weld metal meets the heat-affected zone, gave 88, 72 and 95 J, a mean of 85.0 J, also passing.

```figure
type: compare
title: The hopper procedure's impact results at −20 °C against this example's requirement
cols: Weld metal | Fusion line
caption: This is an illustration. The requirement, a minimum average of 40 J and no individual result below 30 J at −20 °C, is invented for this example; the specification in force sets the real values.
- Individual results | 64, 41, 58 J | 88, 72, 95 J
- Mean of three | 54.3 J | 85.0 J
- Lowest individual | 41 J | 72 J
- Against 40 J average, 30 J individual | pass | pass
```

## Scatter in the transition region

The weld-metal results at −20 °C ranged from 41 to 64 J, a spread of 23 J around a mean of 54 J. That is typical of the transition region, where whether a specimen tears or cracks depends on small local variations in microstructure at the notch tip. On the upper and lower shelves, scatter is much smaller.

This scatter has practical consequences, which Chapter 4 introduced:

- a single impact result in the transition region is a poor estimate of the weld's toughness, which is why tests are made in sets, usually of three;
- requirements are set on the average and on the lowest individual result, because the average alone can hide a weak specimen;
- if a test temperature falls in the transition region, a small change in the weld, or in the test temperature, can move the results a long way.

The weld-metal set's lowest result, 41 J, was just above the 40 J average requirement and comfortably above the 30 J individual minimum, but it is a reminder that the hopper procedure's weld metal is in its transition region at −20 °C. A slightly colder test temperature, or a weld with slightly different heat input, could push some results below the limits.

## What controls weld toughness

The toughness of a weld depends on the consumable, the steel and, above all, the thermal cycle the welding procedure imposes.

- **Heat input.** High heat input cools the weld slowly, which tends to coarsen the grains in the weld metal and the heat-affected zone and lower their toughness. Low heat input cools them quickly, which can harden the heat-affected zone (Chapter 6). The procedure's heat input range is therefore bounded from both sides: too low risks hardness and cracking, too high risks poor toughness.
- **Interpass temperature.** Each run reheats the ones before it. If the joint is allowed to get too hot between runs, the whole weld cools slowly, with the same effect as high heat input. Procedures that require toughness usually set a maximum interpass temperature.
- **Run sequence.** In a multi-run weld, each new run reheats and refines the grain structure of the run below. Many small runs generally give tougher weld metal than a few large ones, which is one reason toughness requirements push procedures towards more, smaller runs.
- **Consumable.** Weld metal toughness depends heavily on the consumable's composition and on keeping it free of moisture and contamination, which is why procedures requiring toughness specify consumables classified for impact properties at the required temperature.

For the hopper procedure, the fabricator's low-heat-input trial in Chapter 6 raised hardness. A matching trial at high heat input lowered the weld metal's toughness at −20 °C to a mean of about 44 J, still passing in this example but with almost no margin. Together the two trials showed the fabricator where the safe window of heat input lay.

## Sub-size specimens

The standard Charpy specimen is 10 mm square. For thinner material, where a 10 mm specimen cannot be cut, sub-size specimens of reduced width are used, such as 7.5 mm or 5 mm. A sub-size specimen absorbs less energy, roughly in proportion to its reduced cross-section on the upper shelf, but its transition behaviour can also shift, so results from sub-size specimens are not simply scaled. Specifications that allow sub-size specimens state how the requirement is adjusted. The hopper's 12 mm plate allows full-size specimens, which avoids the question.

## Beyond the Charpy test

The Charpy test is a comparative test: it ranks materials and welds, checks them against requirements derived from experience, and detects changes, but its energy cannot be used directly to calculate the size of crack a structure will tolerate. For safety-critical structures where that question matters, such as offshore structures, pressure vessels and pipelines operating in the cold, fracture mechanics tests such as the crack tip opening displacement test measure toughness in terms that can be used in engineering critical assessments. They are more expensive and are specified where the consequences of fracture justify them. For the hoppers, the Charpy requirement in the specification is the appropriate level.

## Where the notch goes

A Charpy test measures toughness at the notch tip, so the notch's location decides what is tested. Specimens are taken from the weld metal centre, the fusion line and various positions in the heat-affected zone, as the standard and specification require, with the notch positioned on an etched specimen so that it sits exactly where intended. The heat-affected zone can be much less tough than either the weld metal or the parent, especially its coarse-grained region next to the fusion line, which Chapter 6 showed is also often the hardest.

Placing a notch in a zone a millimetre wide is precise work, and a notch that wanders into the tougher weld metal or parent overstates the zone's toughness. Good laboratories etch the specimen blank, mark the notch position and photograph it, so that the location can be checked.

## Temperature control

The specimen must be at the test temperature when it breaks. It is held in a bath or chamber at the test temperature for long enough to reach it throughout, then transferred to the machine and broken within the short time the standard allows, because a specimen taken from a −20 °C bath begins to warm the moment it leaves. A specimen that warms by a few degrees in the transition region can absorb noticeably more energy, which overstates the toughness. The transfer time is part of the method, not a detail, and so is checking the bath temperature with a calibrated thermometer rather than trusting the controller.

## Toughness in production

Impact tests are made on qualification plates, and sometimes on production test plates, but not on the production welds themselves. The toughness of production welds is protected indirectly: by keeping heat input, interpass temperature and consumables within the qualified ranges, and by supervising and recording them. A procedure qualified with impact tests is only as good as the control of those variables in production. A welder who runs hotter and wider than the procedure, to finish a long seam faster, may be producing weld metal far less tough than the qualification plate, and no visual inspection or ultrasonic test will show it. That is why heat input is recorded on the shop floor for procedures with toughness requirements, using the arc energy calculation in [Arc Welding by the Numbers](/reados/publications/arc-welding-by-the-numbers/the-arc-as-a-heat-source/).

## A failure: the slow transfer

This is an illustration. A set of heat-affected zone specimens tested by a new laboratory for the fabricator gave results of about 95 to 110 J at −20 °C, far higher than expected and higher than the weld metal. The fabricator's engineer asked how the test had been run. The laboratory's technician had been taking the specimens from the cold bath, carrying them across the room and setting them up carefully in the machine, which took well over the time the standard allows for transfer.

The specimens had been warming throughout. At −20 °C, the heat-affected zone was in its transition region, where a few degrees of warming raised the energy considerably. A retest with specimens transferred within the permitted time gave 58, 49 and 66 J, a mean of 57.7 J, which still passed but was a very different result. The fabricator now asks laboratories to record transfer times, and uses laboratories accredited for impact testing.

## Exercise: two broken specimens

Using the pendulum in this chapter, with an effective mass of 20.4 kg released from 1.50 m, calculate the energy absorbed by a specimen after which the striker rises to 1.05 m, and one after which it rises to 1.30 m. Say which specimen is likely to show a fibrous fracture.

The first absorbs about 20.4 × 9.81 × (1.50 − 1.05) ≈ **90 J**; the second about 20.4 × 9.81 × (1.50 − 1.30) ≈ **40 J**.

The 90 J specimen absorbed more energy and is more likely to show a largely fibrous, ductile fracture; the 40 J specimen is more likely to show a larger bright, crystalline area of brittle fracture. Reading the fracture face alongside the energy, and reporting both, gives a fuller picture of where the weld sits on its transition curve.
