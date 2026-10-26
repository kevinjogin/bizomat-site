---
book: machine-noise-control-by-the-numbers
chapterSlug: measuring-verifying-and-the-noise-plan
order: 10
title: "Measuring, verifying and the noise plan"
description: "Measure noise with a calibrated meter, correct for background, verify that controls worked, buy quiet, keep a noise plan, and catch a result taken from two readings 0.3 dB apart."
draft: false
---

A noise control is not finished when it is installed; it is finished when a measurement shows that it worked. Predictions are made with simplified relationships, materials perform differently from their data, installers leave gaps, and machines run differently from their brochures. Only a measurement at the receivers, with the machine in its real operating condition and the background accounted for, tells whether the target has been met. The same measurements, kept in a plan with the sources, receivers, controls and their owners, are what stop the next purchase or alteration undoing the work.

This chapter covers sound level meters and calibration, how and where to measure, how to correct for background noise and when a correction cannot be trusted, how to verify a control, how to buy quiet, and what a noise control plan contains. The running case gathers CP-30's controls into a final result, and finds that its first verification report took the compressor's contribution at the bench from two readings only 0.3 dB apart, a subtraction that could have given almost any answer.

## Instruments

Workplace noise is measured with a **sound level meter** meeting IEC 61672-1, which specifies two performance classes: class 1 for precision work and class 2 for general field use. A meter used for an exposure assessment or a compliance check should be of the class the applicable guidance requires, recently verified by a laboratory, and checked with an acoustic **calibrator** before and after each set of measurements; a drift between the two checks of more than a small amount invalidates the measurements in between. For a noise control design, the meter needs octave or one-third-octave filters and the ability to record the equivalent continuous level, L_eq, over a chosen period.

**Dosimeters**, worn by workers, measure personal exposure over a shift, as Chapter 4 described. **Accelerometers** measure vibration, as Chapter 9 described. **Intensity probes** measure sound power in place, as Chapter 2 described. Each has its own calibration and its own limits.

## Where, when and how long

A measurement describes one position, one period and one operating condition, and its record must say which.

- **Position**: for a worker's exposure, at the position their ear occupies, with the worker present where practicable, or at head height with the worker absent; for a machine's noise, at stated distances and directions; for a room, at several positions averaged on an energy basis.
- **Operating condition**: the machine loaded, unloaded or cycling, as it actually runs; for CP-30, measurements over several load and unload cycles.
- **Period**: long enough to represent the noise, from a minute for a steady machine to a whole shift for a worker who moves.
- **Background**: with the machine of interest stopped, at the same positions, close in time.
- **Conditions**: doors and enclosure panels open or closed, other machines running or not, and anything else that could change the result.

A measurement without these details cannot be repeated, and a measurement that cannot be repeated cannot show that a control worked.

## Correcting for background

When a source is measured against a background, the source's own level is found by subtracting energies, as Chapter 1 showed. How much the correction can be trusted depends on how far the total rises above the background.

```figure
type: decision
title: Can the source's level be found from the total and the background?
question: How far is the total, with the source running, above the background with it stopped?
- More than about 10 dB | No correction needed | The background adds less than half a decibel
- *About 3 to 10 dB | Subtract the energies | The result is reliable if both readings are steady
- Less than about 3 dB | The source cannot be measured reliably here | Measure closer to the source, or when the background is lower
```

The reason is that small errors in either reading become large errors in the difference. This is an illustration. A total of 75.3 dB(A) and a background of 75.0 dB(A) give a source level of 10 × log₁₀(10^7.53 − 10^7.50) ≈ **63.5 dB(A)**. If the total had read 75.8 dB(A), within the ordinary scatter of a field measurement, the result would be about 68.1 dB(A); if the background had read 75.5 dB(A), higher than the total, there would be no result at all.

## The running case: CP-30's controls together

This is an illustration. The workshop's final controls for CP-30 were:

- the **roof absorber** of Chapter 5, 300 m² at the roof's underside, reducing the reverberation time from about 4.1 s to about 1.3 s;
- the **lined enclosure** of Chapter 7, with door seals and sealed penetrations;
- **1.2 m splitter silencers** on its cooling air inlet and outlet, Chapter 8;
- **rubber-in-shear mounts**, a flexible discharge hose and resilient clamps, Chapter 9.

By calculation, CP-30's contribution at the bench fell from 86.8 to about **64.2 dB(A)**. The roof absorber also lowered the reverberant part of the shop's own noise at the bench, which was measured with CP-30 stopped at about **75 dB(A)**, down from about 78 dB(A).

## The error: a subtraction within 0.3 dB

This is an illustration. The first verification report measured the bench at **75.3 dB(A)** with CP-30 running and **75.0 dB(A)** with it stopped, subtracted, and reported that CP-30 now contributed **63.5 dB(A)** at the bench, "within 1 dB of the prediction". The agreement was a coincidence. With the two readings only 0.3 dB apart, ordinary scatter of half a decibel in either could have given a result anywhere from about 68 dB(A) to nothing at all.

The reviewer of the report applied the decision above: the bench is not a position where CP-30 can now be measured, because it no longer stands out from the shop's own noise, which is exactly what the controls were meant to achieve. The verification was repeated at **1 m from the enclosure**, where CP-30 still dominates, and at the bench during a meal break, when the shop was quiet. At 1 m, the measured level of about 73.6 dB(A), against about 92.6 dB(A) before the enclosure in the treated room, confirmed an insertion loss of about 19 dB; the room equation then gave the contribution at the bench. The general lesson is that a background correction is a calculation with a validity limit, and that a successful control can make its own source unmeasurable at the receiver, which is evidence of success, not a measurement of it.

```figure
type: compare
title: CP-30's workshop before and after the controls
cols: Before | After | Target or standard
caption: This is an illustration. The fitter's exposure is now set by the shop's other work, not by CP-30; the next gains will come from those sources.
- CP-30's contribution at the bench | 86.8 dB(A) | 64.2 dB(A) | 76 dB(A) target
- Total level at the bench | 87.3 dB(A) | 75.3 dB(A) | —
- *Fitter's L_Aeq,8h | 86.1 dB(A) | 75.3 dB(A) | 80 dB(A) target, 85 dB(A) standard
- Level 1 m from CP-30, enclosure closed | 93.2 dB(A) | 73.6 dB(A) | —
- Store room, C-weighted | 73.9 dB(C) | 63.6 dB(C) | Rumble resolved
- Workshop reverberation time | 4.1 s | 1.3 s | —
```

## How each control contributed

The controls were installed one at a time, and measuring after each step showed what each contributed at the bench. This is an illustration.

```figure
type: bars
title: Total level at the fitter's bench as the controls were added, dB(A)
unit: dB(A)
max: 90
caption: This is an illustration. The roof absorber lowered both CP-30's reverberant sound and the shop's own; the silenced enclosure removed CP-30 as the dominant source.
- As found | 87.3
- Silenced enclosure alone, bare roof | 78.4
- Roof absorber alone | 83.8
- *Absorber and silenced enclosure | 75.3
```

The enclosure did most of the work on CP-30, and the absorber did work that the enclosure could not: it lowered the shop's own noise at the bench from about 78 to about 75 dB(A), because much of that noise was reverberant, and it shortened the reverberation time for everyone in the workshop. Neither alone would have reached the 80 dB(A) exposure target with a comfortable margin; together they reached about 75.3 dB(A). The step-by-step record also gives the plan a baseline for each control, so that a later measurement showing the bench creeping back up can be traced to the control that has degraded.

## After the controls

With the fitter's exposure at about 75.3 dB(A), well below the 85 dB(A) standard and the workshop's 80 dB(A) target, hearing protection is no longer needed for work at the bench. It is still needed for the tasks that remain loud at the person doing them, grinding, gouging and the cut-off saw, until those are treated in turn, and audiometric testing continues for the workers who wear protection frequently. The noise assessment is updated to show the new levels, the protector requirements by task rather than by area, and the date of the next review.

## Writing the verification report

A verification report records what was measured, how, and what it shows, so that anyone can repeat it. For CP-30, the report lists the instruments, their class, laboratory verification and the calibrator checks before and after; the positions, with a sketch; CP-30's operating condition during each measurement; the readings with and without CP-30 and the corrections applied, or the reason none could be; the comparison with the predictions, band by band at the 1 m positions; and the conclusion against the target. It also records the measurements that could not be made, such as CP-30's contribution at the bench itself, and how its value was obtained instead. A report that states its own limits is more useful, and more defensible, than one that claims a precision the measurements cannot support.

## Buying quiet

The most effective control in this book is one the workshop did not use: buying a quieter machine in the first place. A compressor with a factory acoustic canopy, or model B of Chapter 2 with its 8.6 dB lower sound power, would have needed far less treatment. Buying quiet means:

- writing the noise requirement into the purchase specification: sound power level by octave band, measured to a named standard such as ISO 3744, for the stated operating condition, and the sound pressure at stated positions;
- comparing offers on sound power, converting any other figures as Chapter 2 showed;
- including the cost of the noise controls each option would need, so that a cheaper, noisier machine is compared with a dearer, quieter one on the whole cost;
- testing the delivered machine against its declaration.

Safe Work Australia's model code treats buying quiet as part of eliminating or substituting the hazard, at the top of the hierarchy of control. Every machine bought without a noise requirement is a decision to spend on controls later.

## The noise control plan

A workplace with noisy machines should keep a noise control plan, a living record of:

- **sources**: each noisy machine and process, with its sound power or measured level and operating pattern;
- **receivers**: each work position and the people at it, with their task durations;
- **levels and exposures**: measured and predicted, with dates, instruments and conditions;
- **controls**: each one, its expected and measured effect, and its maintenance needs, such as enclosure door seals, silencer condition and mount deflections;
- **owners and dates**: who is responsible for each action, and when it will be done;
- **review triggers**: a new or changed machine, a new layout, a complaint, an audiometric result, and a scheduled review.

For CP-30's workshop, the plan's next actions follow from the result: the shop's own noise now sets the fitter's exposure, so the grinders, hammering and cut-off saw are next, and the second compressor of Chapter 1's exercise must be bought quiet or enclosed the same way before it is installed.

## Keeping the controls working

Noise controls degrade quietly. Door seals tear and harden, enclosure doors are left open, silencer linings clog or are damaged, mounts harden or sag, flexible hoses are replaced with rigid pipe by someone who did not know why the hose was there, and absorber panels are painted, which seals their surface and stops them absorbing. Each control in the plan therefore has a maintenance check, built into the routines that already exist: the compressor's service sheet includes the enclosure's seals, latches and silencers and the mounts' deflections; the building's maintenance schedule includes the roof absorber's condition; and a label on the flexible hose says why it must stay flexible. A quick measurement at the 1 m positions at each annual review, compared with the verification report, shows whether anything has slipped.

## Exercise: the second compressor, done properly

The workshop now buys the second compressor, identical to CP-30, and installs it in a matching enclosure with silencers and mounts, 8 m from the bench. In the treated room, its contribution at the bench is predicted at about 62 dB(A). What is the new total at the bench with CP-30's 64.2 dB(A) and the shop's 75 dB(A)? What should the verification measure?

**Worked answer.** The total is 10 × log₁₀(10^6.42 + 10^6.2 + 10^7.5) ≈ **75.5 dB(A)**, about 0.2 dB above the present 75.3 dB(A). The two enclosed compressors together contribute about 66.2 dB(A), well below the shop's own noise.

The verification cannot measure the new compressor at the bench, for the reason this chapter's error showed: its contribution is more than 10 dB below the background. It should be measured at 1 m from its enclosure, as CP-30's was, and compared with the matching measurement of CP-30, with the bench total recorded during normal work to confirm that the fitter's exposure has not risen. The plan is then updated with the new source, its controls and its measurements, ready for the next change.
