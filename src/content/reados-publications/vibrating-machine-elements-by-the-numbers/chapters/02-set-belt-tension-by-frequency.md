---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: set-belt-tension-by-frequency
order: 2
title: "Set belt tension by its frequency"
description: "Turn a belt span's natural frequency into its tension, set RF-3's belts to a target frequency, and catch the mass and span-length errors that fool a meter."
draft: false
---

A belt span between two pulleys is a string fixed at both ends. Pluck it and it vibrates at a frequency set by its length, its mass per metre and its tension. Measure that frequency and you can work out the tension, which is the quantity that decides whether the belt grips, how hard it pulls on the bearings and how long it lasts.

This is the principle behind the sonic and optical belt tension meters used in maintenance. This chapter works through the physics, sets the RF-3 belts to a target frequency, and shows how two simple input mistakes can leave a belt badly over- or under-tensioned while the meter reports the correct figure.

## Why tension needs a number

A belt transmits torque through the difference between its tight-side and slack-side tensions. Too little static tension and the belt slips under load, glazes, heats and wears quickly. Too much and it overloads the shaft bearings, bends the shafts and shortens the belt's own life through higher stress in its cords.

The right static tension for a drive comes from the drive's design: power, speed, pulley sizes, wrap angle and belt section. Belt makers publish methods and tables for that calculation, and the [V-belt drive design tool](/tools/v-belt-drive-design/) works through the main steps. This chapter assumes the design value is already known and concentrates on setting and checking it on the machine.

Feel is not a measurement. Two experienced fitters pressing the same span can disagree by a factor of two. A frequency reading turns the job into a number that can be recorded, repeated and audited.

## The string formula

For a uniform string of mass per metre m, tension T and free length L, fixed at both ends, the wave speed is **c = √(T ÷ m)** and the first natural frequency is half a wavelength across the span:

**f = c ÷ (2L) = (1 ÷ 2L) × √(T ÷ m)**

Rearranged for tension:

**T = 4 m L² f²**

The units need care. With m in kg/m, L in metres and f in hertz, T comes out in newtons. Lengths taken from a drawing in millimetres must be converted first.

Three features of this formula matter on the shop floor:

- **Tension goes as frequency squared.** A 1 per cent error in the frequency reading gives about a 2 per cent error in tension.
- **Tension goes as span length squared.** A small error in the length entered into a meter gives roughly twice that error in the reported tension.
- **Tension is directly proportional to mass per metre.** Enter the wrong belt section and the tension is wrong by the ratio of the masses.

The formula ignores the belt's own bending stiffness, which raises the frequency slightly for short, stiff spans, and treats the pulley contact as a perfect fixed end. For typical industrial spans the effect is small, but it is one reason a meter maker may apply a correction for particular belt types.

## The free span length

The vibrating length is the tangent length between the pulleys, not the centre distance. For open pulleys of pitch diameters D and d at centre distance C, the span length is:

**L = √(C² − ((D − d) ÷ 2)²)**

This is an illustration. For RF-3, C = 600 mm, D = 250 mm and d = 160 mm, so (D − d) ÷ 2 = 45 mm and:

**L = √(600² − 45²) = √(360,000 − 2,025) = 598.3 mm**

With pulleys this close in size, the span is barely shorter than the centre distance. With a large speed ratio the difference grows, and using the centre distance would overstate the tension.

## RF-3's target frequency

This is an illustration. The RF-3 drive design calls for a static tension of 450 N in each belt, and the belts are taken as 0.12 kg/m. The target frequency is:

**f = (1 ÷ (2 × 0.5983)) × √(450 ÷ 0.12) = 0.8357 × 61.24 = 51.2 Hz**

For this span and belt, the constant 4 m L² is 4 × 0.12 × 0.5983², about 0.1718, so T = 0.1718 f². That gives a quick conversion table for the fitter.

```figure
type: bars
title: Static tension against span frequency for one RF-3 belt
unit: N
max: 650
caption: This is an illustration: 0.12 kg/m belt, 598.3 mm span. Tension rises with the square of frequency, so the target band is narrow in hertz.
- 40 Hz | 274.9
- 45 Hz | 347.9
- 50 Hz | 429.6
- * 51.2 Hz, target | 450
- 55 Hz | 519.8
- 60 Hz | 618.6
```

The table shows why frequency is a sensitive check. Moving from 50 Hz to 55 Hz, a change most people could not hear, raises the tension by about 90 N.

## Write the frequency on the drive, not only the tension

A meter that reports tension does so by applying the formula to the frequency it measures and the mass and length you entered. The only quantity it actually measures is frequency. Recording the target as a frequency, 51 Hz to 52 Hz for the RF-3 belts at their stated span, removes two of the three input errors at once.

A sensible drive label for RF-3 would carry: belt section and number, span length 598 mm, target static frequency 51.2 Hz, the equivalent tension 450 N per belt at 0.12 kg/m, and the date and reading of the last check. Anyone with a meter that shows frequency can then confirm the setting without knowing which mass to enter.

## A failure case: the wrong belt mass

This is an illustration. A technician retensions RF-3 with a sonic meter, but the meter still holds the mass from the last job, 0.07 kg/m, for a smaller belt section. The belts are at their correct 450 N and ringing at 51.2 Hz. The meter calculates:

**T = 4 × 0.07 × 0.5983² × 51.2² ≈ 262.5 N**

Seeing a reading well under 450 N, the technician tightens the drive until the display shows 450 N. The meter now believes the tension is 450 N with m = 0.07 kg/m, so the real tension is 450 × 0.12 ÷ 0.07, about **771 N**. The span frequency has risen to about 67 Hz.

The belts are now carrying roughly 70 per cent more static tension than designed. Bearing loads rise in proportion, and the belts and bearings both lose life.

The error was detected at the next weekly round, when a second fitter checked the drive by frequency against the label and found 67 Hz against a target of 51.2 Hz. The correction was to slacken the drive back to 51.2 Hz and to change the procedure: the meter's mass and length are read back aloud and recorded on the job card before any adjustment.

## A second failure case: the wrong span length

Entering the centre distance, or a rounded figure, instead of the tangent length causes a smaller but similar error. Suppose 650 mm is entered for RF-3's 598.3 mm span. At the true 450 N, the meter reports 4 × 0.12 × 0.65² × 51.2², about 531 N. A technician who slackens until the meter shows 450 N leaves the belt at about 450 × (0.5983 ÷ 0.65)², or **381 N**, 15 per cent under its design tension.

```figure
type: compare
title: What the meter reports and what the belt carries
rowhead: Input error
cols: Meter reads at true 450 N | Adjusted to read 450 N | Real span frequency
caption: This is an illustration for one RF-3 belt. Both errors are invisible if only the tension display is recorded; both are obvious against a frequency target of 51.2 Hz.
- Correct inputs, 0.12 kg/m and 598 mm | 450 N | 450 N | 51.2 Hz
- * Mass entered as 0.07 kg/m | 262.5 N | about 771 N real | about 67 Hz
- Span entered as 650 mm | about 531 N | about 381 N real | about 47.1 Hz
```

## Taking a good reading

The reading is only as good as the method. A practical sequence for a belt drive like RF-3:

```figure
type: checklist
title: Span frequency measurement on a stopped drive
caption: Isolation and guarding follow the site's procedures; the drive must be stopped and isolated before the guard is removed.
- Isolate and lock out the drive | the motor must not start while hands are near the belts
- Rotate the drive by hand two or three turns | settles the belts in the grooves and evens tension between spans
- Measure mid-span on each belt in turn | pluck lightly and keep the sensor at the distance the meter maker states
- Take three readings per belt | discard a reading that differs from the other two by more than about 1 Hz and repeat
- Record frequency, not only tension | with the mass and span length used
- x Do not measure a running belt | running frequencies differ from static ones, as Chapter 3 shows
- ? Are both belts in a matched set | a large difference between belts points to unequal lengths or worn grooves
```

On RF-3's two-belt drive, suppose the readings are 49 Hz and 53 Hz. Those correspond to about 413 N and 483 N. The average is close to the target, but the difference suggests the belts are not sharing the load equally. Belts in a multi-belt drive are normally replaced as a matched set for this reason, and worn pulley grooves can produce the same symptom.

## The deflection method as a cross-check

Before frequency meters were common, belt tension was set by pressing the middle of the span with a known force and measuring how far it moved. The method still has a place as a cross-check when no meter is available or when a reading looks doubtful.

The physics is the same taut string, loaded sideways instead of plucked. For a string of tension T and span L with a small central force F, ignoring the belt's bending stiffness, the mid-span deflection is approximately:

**δ = F L ÷ (4T)**

This is an illustration. Pressing an RF-3 belt at mid-span with 20 N gives δ = 20 × 598.3 ÷ (4 × 450), about **6.65 mm**, at the design tension. At the over-tightened 771 N from the failure case, the same force moves it only about 3.9 mm. At the under-tightened 381 N, about 7.9 mm.

The deflection method is less precise than a frequency reading. The force gauge must push square to the span, the deflection is read against a straightedge laid across both pulleys, and the belt's bending stiffness makes a real span a little stiffer than the formula. Belt makers that publish a deflection method give their own force and deflection values for each belt section, which already allow for these effects; use those rather than the idealised formula when setting a real drive. The formula's value here is to show that the deflection and frequency methods measure the same tension, so a large disagreement between them points to an input error rather than a problem with the belt.

## Other belt types

The same string formula applies to flat belts, multi-rib belts and synchronous (timing) belts. Each has its own mass per metre, which the belt maker publishes by section and width. A timing belt's tension mainly controls tooth engagement and running position rather than grip, and too little tension lets the belt jump teeth under shock load. A multi-rib belt's mass depends on the number of ribs, so the mass entered into a meter must match the actual rib count, not just the profile.

Long spans on conveyors and large drives can sag noticeably under their own weight. When the sag is no longer small compared with the span, the simple string formula no longer describes the span accurately, because the sag adds stiffness to some modes and not others. The maker's method should govern there.

## Run-in and the second check

New belts seat into their grooves and stretch during their first hours of running, and their tension falls. Belt makers commonly specify a higher installation tension for a new belt and a recheck after a short run-in period; use the values and timing they publish for the belt in question.

This is an illustration. If the RF-3 belts lost 30 per cent of their tension during run-in, from 450 N to 315 N, the span frequency would fall to √0.7 × 51.2, about 42.8 Hz. A recheck by frequency finds that immediately. A recheck by feel may not.

Record the installation reading, the run-in recheck and later routine checks on the same card. A steady downward drift in frequency between checks is an early sign of wear, contamination in the grooves or a pulley moving on its shaft.

## Tension and the resonance check

The static span frequency is also the first natural frequency of the span, and that links this chapter to the rest of the book. At 51.2 Hz, the static span sits about 6 per cent above the motor 2× harmonic at full speed, 48.3 Hz, and about 10 per cent above the fan 3× harmonic, 46.4 Hz. On the static figure alone, both are inside the 15 per cent working margin set in Chapter 1.

That does not yet mean RF-3 has a belt resonance problem. Under load the two spans carry different tensions, and a moving belt's natural frequencies are lower than its static ones. Chapter 3 works out the running frequencies before deciding whether anything needs to change.

## Exercise: a heavier replacement belt

RF-3's belts are replaced with a different wedge belt section of 0.18 kg/m, assumed for this exercise. The drive design still calls for 450 N static tension per belt on the same 598.3 mm span. What static span frequency should the fitter set? Is that frequency within 15 per cent of the motor 2× harmonic (48.3 Hz), the fan 3× harmonic (46.4 Hz) or the fan 2× harmonic (30.9 Hz) at full speed?

**Answer.** f = (1 ÷ (2 × 0.5983)) × √(450 ÷ 0.18) = 0.8357 × 50.0 = **41.8 Hz**.

Against 48.3 Hz it is (48.3 − 41.8) ÷ 48.3, about 13.5 per cent below. Against 46.4 Hz it is about 9.9 per cent below. Both are inside the 15 per cent margin. Against 30.9 Hz it is about 35 per cent above, which is clear.

The heavier belt has moved the span frequency down onto the harmonics rather than away from them. If the frequency had been set using the old 51.2 Hz target, the belts would carry 450 × 0.18 ÷ 0.12 = 675 N, half as much again as designed. The new belt needs its own target frequency on the drive label.
