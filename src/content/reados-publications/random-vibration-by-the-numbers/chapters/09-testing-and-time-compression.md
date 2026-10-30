---
book: random-vibration-by-the-numbers
chapterSlug: shaker-testing-and-time-compression
order: 9
title: "Shaker testing and time compression"
description: "Planning a random vibration test: what a test proves, compressing years into hours with the fatigue exponent, the limits of exaggeration, shaker force and stroke, fixtures, control and safety."
draft: false
---

Analysis predicts; testing checks. A random vibration test puts the real hardware, with its real joints, welds, solder and fasteners, on a shaker driven by a controller that reproduces a specified spectrum, and shows whether anything breaks, loosens or malfunctions. Because a shaker can only run for hours, not years, most tests compress the service life by raising the level, on the reasoning that fatigue damage rises steeply with stress and a short severe test can do the damage of a long mild life. The reasoning is sound within limits, and outside them a compressed test breaks things that would never break in service, or misses failures that would.

This chapter plans the tests for CB-7 and the sensor bracket. It derives the time-compression rule from the S–N exponent of Chapter 8, applies it to the bracket, shows how over-compression gave a false failure on the isolated enclosure, and sets out the practical side: shaker force and stroke, fixtures, control and the hazards of the test itself.

## What a test can prove

A vibration test answers narrower questions than it seems to. A test at the specification level for a few hours shows that the hardware survives and functions at that level for that time, with whatever margin the test's duration and level imply. It does not prove a ten-year life unless it has been designed to represent ten years' damage; it does not prove anything about conditions it did not include, such as the engine tone of Chapter 5 if the test profile omitted it; and one specimen passing says little about the scatter between specimens. A test plan should therefore state its purpose: a functional check at the specification level, a durability test representing a stated life, a margin test above the specification to find how much headroom exists, or an exploratory test to find weak points. Each needs different levels and durations, and IEC 60068-2-64 and MIL-STD-810H Method 514.8, the standards most often specified for random vibration testing, describe the procedures and tolerances for each kind.

## Compressing time

If fatigue life follows Basquin's line, N ∝ S^(−m), with the same exponent m for every cycle that matters, then raising the stress by a factor k shortens the life by k^m. Since stress is proportional to the square root of the PSD for a linear structure, the test duration and the PSD level trade as follows.

```figure
type: formula
title: Time compression for a random vibration test
formula: T_test ÷ T_service = (W_service ÷ W_test)^(m ÷ 2)
formula: W_test ÷ W_service = (T_service ÷ T_test)^(2 ÷ m)
caption: m is the S–N exponent, 5.71 for the bracket's weld line in Chapter 8. This is an illustration: compressing 20,000 hours of screening into 8 hours per axis.
- Service | 20,000 h at CB-7's profile, 2.55 g RMS
- Test | 8 h per axis
step: PSD factor = (20,000 ÷ 8)^(2 ÷ 5.71) = 2,500^0.350 = 15.5, about +11.9 dB
step: Test level = 2.55 × √15.5 = 10.1 g RMS; stress factor √15.5 = 3.94
```

The rule depends on three assumptions, and each needs checking. The structure must be linear, so that stress scales with the square root of the PSD. The failure mode must be the same at the test level as in service. And every cycle at both levels must lie on the same S–N line: if most service cycles are below the endurance limit, as the stiffened bracket's are, the service life is governed by the rare tail and the endurance assumption of Chapter 8, and a compressed test, whose cycles are all above the limit, does far more damage than service. The test is then conservative, possibly very much so. That is acceptable for a design check, but the result cannot be read back as a prediction of service life.

## The bracket test

This is an illustration. The final sensor bracket, with a dummy sensor and junction box of the right mass, was bolted to a rigid fixture on the shaker and tested in each of three axes for 8 hours at CB-7's profile raised by a factor of 15.5 in PSD, 10.1 g RMS. The weld toe's strain gauge, scaled from its service measurement of 16.9 MPa RMS by √15.5, should then read about 67 MPa RMS, and did, within 5%: confirmation that the bracket stayed linear at the test level. Each axis gave about 6.9 million cycles of the first mode.

No crack appeared in any axis, by dye penetrant inspection of the weld after each. On the compression rule, that represents at least the 20,000-hour service life, with the conservatism noted above. Together with the strain measurement and the analysis of Chapter 8, it was enough to release the design.

## The error: over-compressing the isolated enclosure

This is an illustration. The first test plan treated CB-7, on its soft mounts, the same way: 8 hours per axis at 10.1 g RMS. In the first hour of the vertical test the enclosure began striking its snubbers, and one of the mounting brackets that carried the snubbers cracked. The test was stopped and reported as a failure.

The engineer looked at the arithmetic. Raising the PSD by 15.5 raises the enclosure's random sway by √15.5 = 3.94, from 4.5 mm at 3σ to 17.9 mm, beyond the 15 mm clearance and well past the 12 mm snubbers. The enclosure was striking stops it would almost never meet in service, and the cracked part had been loaded by impacts that service would not produce. The structure was not linear at the test level, because the snubbers engaged, and the failure mode was not one that occurs in service. The compressed test had broken the hardware for the wrong reason.

The revised plan separated the questions. The isolated enclosure was tested at the specification level, 2.55 g RMS, for 4 hours per axis with the electronics powered and monitored, to show that it functions and that nothing loosens; its fatigue-critical parts, the mounts and their brackets, were assessed by analysis and by a separate component test at a level that kept them in their linear range. The board inside, isolated by a factor of thousands at its resonance, needed no compressed test of its own. The plan stated each test's purpose, which the first plan had not.

## Testing the engine tone

The random profile does not contain the engine tone that started CB-7's story in Chapter 5, so a random test alone cannot show that the mounts handle it. The revised specification lists the tone separately, and the test plan includes it in two ways. A sine-on-random test superimposes a sinusoid at 25 Hz and 0.80 g peak on the random profile, which reproduces screening at the governing engine speed. A slow sine sweep across the engine's speed range, from idle at 13.3 Hz to full speed, at the tone's amplitude, finds any resonance the engine could dwell on, including rocking modes of the enclosure that a vertical random test might excite weakly. The sweep on the revised mounting showed the vertical resonance at 9.4 Hz, below idle, and a rocking mode at 7.8 Hz, both safely below the tone's range.

## Looking for damage between runs

Cracks and loosening change a structure's stiffness before they become visible, and a low-level resonance search before and after each test run detects the change. The search is a gentle random or sine sweep at a level far below the test level, recording the transmissibility from the control point to response accelerometers on the item. A natural frequency that falls by more than a few per cent between runs, or a resonance whose peak broadens, signals damage even if nothing can yet be seen.

This is an illustration. On the original bracket design, tested at the specification level for comparison, the first-mode frequency fell from 121 to 116 Hz after about 11 hours of the vertical run, a drop of 4%, and dye penetrant then showed a 6 mm crack at the weld toe: consistent with the field failure and with the 10 to 17 hours predicted in Chapter 8. On the final bracket, the frequency stayed within 1 Hz of 241 Hz through all three axes.

```figure
type: checklist
title: CB-7 and bracket test sequence
caption: This is an illustration. Each step has a stated purpose; the open item is the second specimen, which the plan calls for once the first passes.
- x Low-level resonance search, all axes, before any run
- x Bracket durability: 8 h per axis at +11.9 dB, strain gauge and dye penetrant after each axis
- x Enclosure function: 4 h per axis at the specification level, electronics powered and monitored
- x Engine tone: sine-on-random at 25 Hz and a slow sweep through the engine's speed range
- x Low-level resonance search after each run, frequencies compared with the first search
- ? Second specimen of the bracket, to give a first look at scatter between parts
```

## Shaker force and stroke

A shaker must be big enough in two ways. Its force rating must cover the moving mass, armature plus fixture plus test item, times the acceleration, with headroom for the peaks of a random signal; and its stroke must cover the displacement at the low end of the profile.

```figure
type: stats
title: Shaker requirements for the bracket test
caption: This is an illustration. Moving mass 48 kg: armature 20 kg, fixture 25 kg, bracket assembly 3 kg. A shaker's random force rating is quoted as RMS; controllers clip peaks at about three times RMS.
- 4.7 kN RMS | Random force needed | 48 kg × 10.1 g × 9.807
- 14 kN | Force at 3σ peaks | within the controller's clipping limit
- 3.1 mm RMS | Table displacement at the test level | dominated by the 5 to 10 Hz part of the profile
- * 18.5 mm peak to peak at 3σ | Stroke needed | check against the shaker's rated stroke
```

The displacement figure often decides the test. CB-7's profile at 15.5 times the specification level needs about 18.5 mm of stroke at 3σ, almost all of it from the lowest frequencies. A shaker with a shorter stroke can still run the test if the profile is truncated at a slightly higher lowest frequency, but that must be agreed and recorded, because it removes the part of the input that drives low-frequency modes such as the enclosure on its mounts.

## Fixtures and control

The fixture that joins the test item to the shaker must transmit the motion faithfully across the test band. A fixture with a resonance inside the band amplifies the input at some frequencies and starves it at others, so the test item sees a different spectrum from the one the controller reports. A good fixture has its first resonance above the highest test frequency, or failing that, is controlled at the item's mounting points so that the controller corrects for it.

The controller measures the acceleration at one or more control accelerometers, compares their spectrum with the reference profile and adjusts its drive signal continuously. Where it measures matters: on the fixture at the item's mounting feet is usual. Averaging several control points smooths out local fixture behaviour. The standards set tolerances on the controlled spectrum and its overall level; a test should record the achieved spectrum as well as the reference, so that a reader can see how closely the two agreed, especially near the item's resonances.

## One specimen and scatter

Fatigue lives scatter widely, by a factor of several between nominally identical welded parts, and a single specimen that survives a test says only that this specimen survived. If the true median life at the test level were just above the test duration, a single specimen would pass about half the time. Testing more specimens, or testing one for longer than the compression rule requires, buys confidence. A common practice is to run the test for a multiple of the required duration, so that a pass demonstrates the life with margin for scatter; another is to test two or three specimens, so that their spread can be seen. CB-7's plan does the second, with the second bracket specimen still to come. The chapter on [how many units, and for how long](/reados/publications/accelerated-life-testing-by-the-numbers/how-many-units-and-how-long/) in Accelerated Life Testing by the Numbers treats the statistics of zero-failure demonstrations in detail, and the same reasoning applies here: the fewer the specimens, the longer each must run to demonstrate the same life with the same confidence.

## Safety in the test laboratory

A large shaker is powerful industrial plant. Its armature can deliver many kilonewtons, test items can fracture and release parts at high speed, and fixtures with loose bolts can shed them. The amplifiers carry high voltages, and slip tables run on oil. Test laboratories manage those hazards under work health and safety law, with Safe Work Australia's model code of practice on managing the risks of plant as a guide: guards or exclusion zones around the shaker during running, interlocks that stop the drive when a guard is opened, abort limits on the controller, torque-checked fixture bolts, and a pre-test review of how the item could fail and what it could release. A failing test item, like CB-7's cracked snubber bracket, is a hazard as well as a result.

## Exercise: a four-hour test

The test laboratory offers 4 hours per axis instead of 8 for the bracket. Using the compression rule with m = 5.71, find the PSD factor, the decibel increase and the test level in g RMS. What would you check before accepting the shorter test?

**Worked answer.** This is an illustration. The PSD factor is (20,000 ÷ 4)^(2 ÷ 5.71) = 5,000^0.350 = **19.8**, an increase of 10 log₁₀ 19.8 = **13.0 dB**, and the test level is 2.55 × √19.8 = **11.4 g RMS**. Before accepting it, check three things: that the bracket stays linear at the higher level, by scaling the strain-gauge reading as before; that the shaker's force and, especially, stroke cover the higher level, since the stroke rises by √(19.8 ÷ 15.5) = 1.13 to about 21 mm peak to peak at 3σ; and that the higher stress does not introduce a failure mode, such as yielding at the weld toe or loosening of the dummy sensor's bolts, that service would not produce. If all three hold, the shorter test is equivalent on the compression rule; if any fails, the 8-hour test at the lower level is the better evidence.
