---
book: power-presses-by-the-numbers
chapterSlug: flywheel-energy-and-slowdown
order: 4
title: "Flywheel energy and slowdown"
description: "Energy per stroke for MP-40 and AB-75, the flywheel's stored energy and slowdown, why a variable-speed press has far less energy at low speed, motor power, and a press that stalled on the bottom."
draft: false
---

A mechanical press does not take its stroke's energy from its motor. The motor is far too small: Press 4's candidate has a 7.5 kW motor, and at full speed AB-75's stroke does 1,515 J of work in about a tenth of a second, the time the crank takes to turn through the last 77° to the bottom, a rate of about 14 kW, on top of everything else. The energy comes from the flywheel, which slows down as it gives it up, and the motor then has the time between strokes to bring the flywheel back up to speed. A press has enough energy for a job if its flywheel can give up the stroke's energy without slowing too much, and the motor can restore it before the next stroke.

This chapter works out the energy each of Press 4's jobs uses per stroke, calculates the flywheel's stored energy and its slowdown, shows why a variable-speed press has much less energy at low speeds, checks the motor, and ends with a setter who slowed the press down to be careful and stalled it on the bottom.

## Energy per stroke

The energy a die uses on each stroke is the work it does: force times distance, added up over the part of the stroke where it does work. Where the force varies, the work is the area under the force-travel curve.

**MP-40.** The cutting force rises to its peak and falls away at breakthrough, all within the 2.0 mm of the sheet's thickness. The work is less than the peak force times the thickness, because the force is not at its peak throughout. A simple estimate takes the work as the peak force times the thickness times a factor for the shape of the curve; this book uses **0.6** as an illustration for low-carbon steel. The stripper springs add the energy to compress them:

- cutting: 192.8 kN × 2.0 mm × 0.6 = **231 J**;
- springs, compressed from 5.5 to 9.5 mm at 3,000 N/mm: ½ × 3,000 × (9.5² − 5.5²) = **90 J**;
- MP-40: about **321 J** per stroke.

**AB-75.** The die maker's trial gave the force at each height (Chapter 3). Adding up the area under that curve in strips, each strip's width times its average force:

- 25 to 20 mm: 5 × (0 + 55) ÷ 2 = 137.5 J;
- 20 to 15 mm: 5 × 57.5 = 287.5 J;
- 15 to 10 mm: 5 × 61 = 305.0 J;
- 10 to 5 mm: 5 × 63.5 = 317.5 J;
- 5 to 2 mm: 3 × 72.5 = 217.5 J;
- 2 to 1 mm: 1 × 100 = 100.0 J;
- 1 mm to the bottom: 1 × 150 = 150.0 J;
- AB-75: **1,515 J** per stroke.

AB-75 needs less than half MP-40's peak force at the bottom of the stroke but almost five times its energy, because it does its work over 25 mm instead of 2. That is typical of forming against cutting, and it is why energy, not force, is usually the number that limits a forming job on a mechanical press.

```figure
type: bars
title: Energy per stroke for Press 4's two jobs
unit: J
max: 1600
caption: This is an illustration. MP-40's energy uses an assumed curve-shape factor of 0.6 for cutting; AB-75's is the area under the die maker's force-travel curve.
- MP-40 cutting | 231
- MP-40 stripper springs | 90
- * AB-75 forming | 1515
```

## The flywheel's energy

A flywheel of moment of inertia I spinning at angular speed ω stores ½ × I × ω². When it gives up an amount of energy E, it slows from ω₁ to ω₂, where:

E = ½ × I × (ω₁² − ω₂²)

The **slowdown** is the fall in speed as a fraction of the starting speed, 1 − ω₂ ÷ ω₁. Rearranging:

slowdown = 1 − √(1 − E ÷ E₁)

where E₁ = ½ × I × ω₁² is the flywheel's stored energy at full speed.

Slowdown is limited for two reasons. The motor drives the flywheel through belts and, on most presses, an induction motor whose torque rises as its speed falls; a large slowdown overloads the motor and makes it take a long time to recover. And a press that slows a great deal on each stroke changes the speed at which the die works, which matters for forming and for feed timing. Press makers state an allowable slowdown, typically lower for continuous running than for single strokes. This book uses **20%** as an illustrative limit for continuous running.

Since slowdown of 20% means ω₂ = 0.8 ω₁, the energy available at that slowdown is E₁ × (1 − 0.8²) = **0.36 E₁**: about a third of what the flywheel stores. WORKOS's [flywheel energy calculator](/tools/flywheel-energy/) and [press flywheel sizing tool](/tools/press-flywheel-sizing/) do these sums.

```figure
type: formula
title: Flywheel slowdown from the energy a stroke takes
formula: slowdown = 1 − √(1 − E ÷ E₁), with E₁ = ½ × I × ω₁²
caption: This is an illustration for Press 4's candidate: I = 4.0 kg·m², flywheel geared 5 : 1, so it turns at 600 rpm when the press makes 120 strokes a minute.
- I | Flywheel's moment of inertia, 4.0 kg·m²
- ω₁ | Flywheel speed, 600 rpm = 62.83 rad/s at 120 strokes a minute
- E | Energy taken by the stroke: 321 J for MP-40, 1,515 J for AB-75
step: E₁ = ½ × 4.0 × 62.83² = 7,896 J
step: MP-40: slowdown = 1 − √(1 − 321 ÷ 7,896) = 2.1%
step: AB-75: slowdown = 1 − √(1 − 1,515 ÷ 7,896) = 10.1%
```

## Energy falls with the square of speed

Press 4's candidate has a variable-speed drive: the motor's speed, and so the flywheel's, is turned down to run the press slower. Because the flywheel's energy goes as the square of its speed, halving the press's speed quarters its energy:

- at 120 strokes a minute, flywheel 600 rpm: **7,896 J** stored, 2,842 J available at 20% slowdown;
- at 90 strokes a minute, 450 rpm: **4,441 J** stored, 1,599 J available;
- at 60 strokes a minute, 300 rpm: **1,974 J** stored, 711 J available;
- at 40 strokes a minute, 200 rpm: **877 J** stored, 316 J available.

At 40 strokes a minute, the flywheel holds less than AB-75's 1,515 J in total. A press run that slowly cannot make AB-75's stroke at all: it will slow, the motor will labour, and the ram will stop before the bottom.

This is the most surprising fact about variable-speed mechanical presses, and the cause of many stalls. The force curve (Chapter 3) does not change with speed, but the energy does, sharply. A press maker's rating of "energy per stroke" applies at a stated speed, usually the highest, and drops at lower speeds.

```figure
type: compare
title: Press 4's flywheel energy and each job's slowdown, by press speed
rowhead: Strokes a minute
cols: Flywheel, rpm | Stored, J | Available at 20% slowdown, J | MP-40 slowdown | AB-75 slowdown
caption: This is an illustration with I = 4.0 kg·m² and a 5 : 1 gear. AB-75 cannot be made at 40 strokes a minute, where the flywheel holds less than the stroke needs.
- * 120 | 600 | 7,896 | 2,842 | 2.1% | 10.1%
- 90 | 450 | 4,441 | 1,599 | 3.7% | 18.8%
- 60 | 300 | 1,974 | 711 | 8.5% | 51.8%
- 40 | 200 | 877 | 316 | 20.4% | not possible
```

## Single strokes and continuous running

A press runs in one of two modes.

- **Continuous**: the clutch stays engaged and the press strokes repeatedly at its set speed. The motor has only the rest of each stroke to restore the energy taken, so the slowdown must stay modest.
- **Single stroke**: the clutch engages for one stroke and the brake stops the ram at the top. The flywheel keeps turning between strokes, and the motor has the whole loading time to restore it.

MP-40 runs continuously from coil at 120 strokes a minute, taking 321 J from 7,896 J, a slowdown of 2.1%. Energy is no concern.

AB-75 is hand-loaded and runs in single strokes, about 12 a minute. In single-stroke mode, the press's speed setting does not control the output, the loader does, but the speed setting still controls the flywheel's speed and so its energy. The right setting for AB-75 is therefore the **highest**: at the 120 setting, its stroke slows the flywheel by 10.1%, and the motor has about five seconds to recover before the next one. Running it at a low setting gains nothing in output and loses most of the energy.

There is a second reason to run single strokes fast. The ram's speed when the die closes is higher, which for some forming suits the material less well; for AB-75's mild steel bend, it makes no measurable difference to the bracket. Where it does matter, a servo press (Chapter 6) can slow the ram near the bottom without slowing the flywheel, because it has none.

## The motor

The motor must replace each stroke's energy, plus the press's friction and the flywheel's own losses, before the next stroke.

- MP-40 continuously at 120 strokes a minute, two strokes a second: 321 × 2 = **642 W** of die work on average.
- AB-75 at 12 strokes a minute: 1,515 × 0.2 = **303 W** on average.

Both are small against the 7.5 kW motor, most of whose power goes into friction, the clutch and accelerating the flywheel from rest. Motor power is rarely the limit on a mechanical press. The limit is the flywheel's energy at the speed in use, and the motor matters mostly for how quickly the flywheel recovers after a heavy stroke and how long it takes to bring the flywheel up to speed at start-up.

## Starting, clutching and the flywheel's stored energy

Three practical consequences follow from the flywheel holding several kilojoules.

- **Run-up takes time.** At full speed the flywheel holds 7,896 J. Even if the 7.5 kW motor put all its power into it, bringing it up from rest would take more than a second; with the motor's starting characteristics and the drive's losses, run-up takes considerably longer, and the press's control does not allow a stroke until the flywheel is at speed.
- **The clutch makes heat.** Every time the clutch engages, it slips briefly while it brings the stationary crankshaft, connecting rod, ram and upper die up to speed, and the energy lost in that slip becomes heat in its friction surfaces. In single-stroke work the clutch engages on every stroke, so press makers state a limit on the number of single strokes a minute. AB-75's 12 a minute is well within the illustrative press's limit; a fast single-stroke job would need checking against it.
- **Isolation is not stopping.** Switching off the motor does not stop the flywheel. It runs down over minutes, and while it turns, the press holds energy that a clutch fault could release into a stroke. Lockout procedures for a mechanical press therefore include waiting for the flywheel to stop, or braking it, before work inside the press begins.

## Sizing a flywheel

Turned around, the same formulas size a flywheel for a job. To take an energy E at a slowdown s, the flywheel must store E₁ = E ÷ (1 − (1 − s)²) at full speed. For AB-75's 1,515 J at 20% slowdown, E₁ = 1,515 ÷ 0.36 = **4,208 J**; at the 600 rpm flywheel speed, that needs I = 2 × 4,208 ÷ 62.83² = **2.13 kg·m²**. The candidate's 4.0 kg·m² is nearly twice that, and has a comfortable margin at full speed.

Press makers do not usually fit a different flywheel for each customer; the inertia is part of the press's design. The calculation is still worth doing, because it shows how much margin a press has, and how quickly the margin disappears at lower speeds.

## The error: slowed down to be careful

This is an illustration. When AB-75 first ran on the shop's existing press, which has a similar flywheel and speed range, the setter turned the press's speed down to its minimum of **40 strokes a minute**, reasoning that a slower press would be safer and gentler for a hand-loaded job. On the first stroke, the ram slowed visibly as the leg was wiped, the motor note dropped, and the ram stopped about 3 mm above the bottom with the die nearly closed on the bracket.

A press stuck near the bottom is a hazardous condition: the die is under load, the flywheel and clutch are still connected, and freeing it involves deliberate work on the drive. The setter isolated the press and called the maintenance supervisor, who freed it by the maker's procedure for a press stuck on the bottom.

The arithmetic explains it. At 40 strokes a minute, the flywheel stores 877 J, and AB-75 needs 1,515 J. There was never enough energy. At the highest setting, 120 strokes a minute, the same stroke slows the flywheel by about 10%. The press's force curve was never the problem: 180 kN at the bottom is well under its rating.

The shop's setting sheet for AB-75 now specifies the highest speed setting with single-stroke operation, and its general procedure says that a forming job's energy is checked at the speed setting to be used before the first stroke. The setter's instinct, to slow down when unsure, was sound in general and wrong for this machine, because the safety of a hand-loaded press comes from its guarding (Chapter 9), not from its speed.

```figure
type: checklist
title: Energy checks before a die runs on a mechanical press
caption: The force curve and the energy are separate checks; this chapter's error passed the first and failed the second.
- Energy per stroke from the area under the force-travel curve | 1,515 J for AB-75
- Flywheel energy at the speed setting to be used | 7,896 J at 120; 877 J at 40
- Slowdown within the maker's limit for the mode | 10.1% in single strokes at 120
- Highest speed setting used for single-stroke forming | output set by the loader, not the press
- Procedure for a press stuck on the bottom known before it happens | maker's procedure, by maintenance
- x Speed turned down to be careful | 877 J available for a 1,515 J stroke
```

## Exercise: a heavier forming job

A future bracket, AB-90, in 4.0 mm steel, needs an estimated 2,600 J per stroke, single strokes, hand-loaded. Can Press 4's candidate make it, at what speed setting, and with what slowdown?

**Worked answer.** The flywheel stores 7,896 J at the 120 setting and 4,441 J at the 90 setting.

- At 120: slowdown = 1 − √(1 − 2,600 ÷ 7,896) = 1 − √0.6707 = **18.1%**, within the 20% used for continuous running and acceptable in single strokes.
- At 90: slowdown = 1 − √(1 − 2,600 ÷ 4,441) = 1 − √0.4145 = **35.6%**, too much.
- At 60 and 40, the flywheel stores less than 2,600 J in total; impossible.

AB-90 can be made at the 120 setting only, with an 18% slowdown, which leaves little margin for harder steel or a duller die. The shop would check the force curve as well, and would treat AB-90 as the job that sets the press's energy requirement if it is likely to come.
