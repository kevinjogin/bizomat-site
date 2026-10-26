---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: keep-running-belt-spans-out-of-resonance
order: 3
title: "Keep running belt spans out of resonance"
description: "Work out tight-side and slack-side span frequencies under load and belt speed, map them across the drive range and decide what to do where harmonics cross."
draft: false
---

A belt set to 51.2 Hz on a stopped drive does not ring at 51.2 Hz once the fan is running. Torque splits the two spans into a tight side and a slack side with different tensions, and the belt's own motion through the span lowers its natural frequencies. On a variable speed drive both effects change with speed, while the excitation frequencies move the other way.

This chapter calculates RF-3's running span frequencies at full speed, follows them across the drive's range, and finds where they cross the shaft harmonics. It ends with a decision that applies to most variable-speed drives: some crossings cannot be designed out, so the question becomes which ones matter and how to keep their forcing small.

## Tight side and slack side

A belt transmits power P at belt speed v through its effective pull, the difference between its span tensions:

**T1 − T2 = P ÷ v**

where T1 is the tight-side tension and T2 the slack-side tension. A common simplification for a drive set to a fixed centre distance is that the sum of the two tensions stays close to twice the static tension: **T1 + T2 ≈ 2T0**. Real drives depart from this as the belt stretches and the drive geometry shifts, but it is a reasonable first estimate.

This is an illustration. RF-3's fan absorbs 5.5 kW at full speed, the belt speed is 12.15 m/s, and the two belts share the load equally. The effective pull is 5,500 ÷ 12.15 = 452.8 N in total, or 226.4 N per belt. With T0 = 450 N per belt:

- **T1 = 450 + 226.4 ÷ 2 = 563.2 N**
- **T2 = 450 − 226.4 ÷ 2 = 336.8 N**

On the static string formula from Chapter 2, those tensions give span frequencies of **57.25 Hz** on the tight side and **44.27 Hz** on the slack side. The single static value of 51.2 Hz has split into two frequencies about 13 Hz apart.

## The moving-belt correction

A belt is not a stationary string. Material runs through the span at the belt speed, and waves travelling with the belt move faster relative to the pulleys than waves travelling against it. For an axially moving string, the analysis by Wickert and Mote, listed in the references, shows that the natural frequencies fall as the transport speed rises:

**f = n (c² − v²) ÷ (2Lc)**

where c is the wave speed from the span tension and v is the belt speed. When v is small compared with c, the frequency is the static value multiplied by roughly (1 − v² ÷ c²).

A second effect works the other way. A belt running around a pulley carries a centrifugal tension of **m v²**, which for RF-3 is 0.12 × 12.15², about 17.7 N. Whether this adds to the span tension depends on how the drive's tensions are defined, and belt makers handle it in their own design methods. This book takes the measured static setting as T0, adds the centrifugal component in the running span, and applies the moving-string formula to the total. The two effects partly cancel, leaving a modest net reduction.

```figure
type: compare
title: RF-3 span frequencies at full speed
rowhead: Span
cols: Tension | Static formula | Running estimate
caption: This is an illustration: 0.12 kg/m belt, 598.3 mm span, 12.15 m/s belt speed. The running estimate adds 17.7 N centrifugal tension and applies the moving-string formula.
- Stopped drive | 450 N | 51.18 Hz | not applicable
- Tight side | 563.2 N | 57.25 Hz | 56.37 Hz
- * Slack side | 336.8 N | 44.27 Hz | 43.15 Hz
```

The correction matters most on fast, heavy belts with low tension, where v is a large fraction of c. For RF-3 it moves the slack side by about 1.1 Hz. The split between tight and slack sides, about 13 Hz, is the larger effect.

## Margins at full speed

At full speed, the running slack-side estimate of 43.15 Hz sits:

- about **7.0 per cent** below the fan 3× harmonic at 46.4 Hz;
- about **10.7 per cent** below the motor 2× harmonic at 48.3 Hz.

Both are inside the 15 per cent working margin. The tight side, at 56.37 Hz, is about 16.6 per cent above the motor 2× harmonic and clear of it.

Neither span is near the 1× shaft frequencies of 15.47 Hz and 24.17 Hz, which normally carry the largest forces from unbalance. The concern is limited to the harmonics, which come mainly from misalignment, belt and pulley run-out and looseness.

## Follow the spans across the drive range

The drive's speed changes three things together. The excitation frequencies fall in proportion to speed. Fan power falls roughly with the cube of speed, following the fan affinity laws, so the effective pull falls with the square of speed. With less pull, T1 and T2 move back towards T0, so the slack-side frequency rises as the fan slows.

This is an illustration, using the same assumptions at each supply frequency.

```figure
type: line
title: Slack-span frequency and motor 2× harmonic across the drive range
x: Supply frequency, Hz
y: Frequency, Hz
legend: Slack span, running estimate | Motor 2× harmonic
ymin: 20
ymax: 60
mark: 46 | crossing near 46 Hz
caption: This is an illustration. The slack span rises from 43.2 Hz to 48.4 Hz as the fan slows, while the motor 2× harmonic falls from 48.3 Hz to 29.0 Hz. They cross near 46 Hz supply.
- 30 | 48.43 | 29.00
- 35 | 47.40 | 33.83
- 40 | 46.19 | 38.67
- 45 | 44.78 | 43.50
- 50 | 43.15 | 48.33
```

Solving for the crossings gives two speeds of interest for the slack span:

- it equals the **motor 2× harmonic near 46.0 Hz supply**;
- it equals the **fan 3× harmonic near 47.4 Hz supply**.

The tight span stays above the motor 2× band everywhere, but the fan 4× harmonic, which runs from 37.1 Hz to 61.9 Hz across the range, crosses it near 44.8 Hz supply and crosses the slack span near 37.8 Hz supply.

## Why the slack side is the one that flutters

Two features make the slack span more lively than the tight span. The first is stiffness. The sideways stiffness of a span at its centre is 4T ÷ L, from the deflection formula in Chapter 2, so a given sideways force moves the slack span further. At full speed the tension ratio is 563.2 ÷ 336.8, so the same force deflects the slack span about 1.67 times as far as the tight span.

The second is the wave speed. Lower tension means a lower wave speed, a lower natural frequency, and a span that sits closer to the range where the strongest harmonics live. On RF-3 the slack span is the one that approaches the shaft harmonics; the tight span stays above them.

A slack span that flutters also changes its own tension as it moves, which feeds back into the drive. Large flutter shows up as belt edge wear, a rhythmic noise and a fluctuating motor current. It is worth catching early.

## Tension that pulses

Shaft harmonics push sideways on a span through pulley run-out and misalignment. There is a second route. If the torque through the drive pulses, the span tensions pulse with it, and a string whose tension varies periodically can be driven into large motion when the tension varies at about **twice** its natural frequency. This is called parametric excitation. It does not need any sideways force at all, which is why a span can flutter on a perfectly aligned drive.

On a fan, the impeller blades produce a small torque pulse at the blade-pass frequency. This is an illustration. For RF-3, the blade-pass frequency is twice the slack span's running frequency near **37.8 Hz supply**, where the span is at about 46.8 Hz and blade pass is about 93.5 Hz. For the tight span the same condition occurs near 44.8 Hz supply. These are exactly the speeds at which the fan 4× harmonic crosses each span, because twice a span frequency equalling eight times the fan speed is the same condition as the span equalling four times the fan speed.

The torque pulse from a fan impeller is usually small, and belts have useful damping, so parametric flutter on a drive like RF-3 is unlikely to be serious. The point is to know where to look if a span flutters on an aligned drive, and to record those speeds alongside the direct crossings.

## Not every crossing can be designed out

Look at the bands together. Between 30 Hz and 50 Hz supply, the motor 1× band covers 14.5 to 24.2 Hz, fan 2× covers 18.6 to 30.9 Hz, motor 2× covers 29.0 to 48.3 Hz, fan 3× covers 27.8 to 46.4 Hz and fan 4× covers 37.1 to 61.9 Hz. Together they cover almost everything from 14.5 Hz to 62 Hz. Any belt span with a natural frequency in that range will meet some harmonic at some speed.

Moving the span frequency therefore cannot clear every crossing. It can only move the crossings to different speeds. Raising the static tension to 520 N, for example, puts the full-speed slack span at about 47.6 Hz, almost exactly on the fan 3× and motor 2× harmonics at the speed where the fan spends most of its time. That is worse, not better.

The useful questions are different:

```figure
type: decision
title: Deciding what to do about a harmonic crossing
question: Does a span frequency cross a shaft harmonic inside the drive's range?
caption: Harmonic forcing comes mostly from alignment and run-out, which can be reduced at every speed; frequencies can only be moved, not removed.
- No | Record the margin | note the closest approach in the resonance register
- * Yes, at a speed the fan uses for long periods | Reduce the forcing first | align, check run-out and pulley fit; then consider moving the crossing or skipping that speed
- Yes, only while ramping through | Record and observe | a crossing passed in seconds rarely builds large motion
- Yes, and the span visibly flutters | Act before the next run | inspect, align, re-tension to target, and measure
```

Reduce the forcing first. Harmonics at 2× and 3× running speed come mostly from angular and parallel misalignment of the pulleys, pulleys running out of true on their shafts, and worn grooves. Precise alignment reduces these forces at every speed, which is better than chasing a frequency. The [shaft alignment correction tool](/tools/rim-face-alignment/) covers the arithmetic for coupled shafts; belt drives are usually aligned with a straightedge or a laser across the pulley faces.

## A failure case: flutter after a motor change

This is an illustration. RF-3's motor is replaced after a bearing failure. The new motor is mounted, the belts are tensioned to 51.2 Hz by frequency, and the fan returns to service. The building management system holds the fan at about 46 Hz supply for most of the day.

Within a week a maintenance round notes that the slack span is fluttering visibly, with an amplitude of several millimetres, and the belts show edge wear. The tension is checked and found correct.

The diagnosis follows the method. At 46 Hz supply the slack span's running estimate is about 44.5 Hz and the motor 2× harmonic is 46 ÷ 50 × 48.33, also about 44.5 Hz: the span is sitting on its crossing. That crossing existed before the motor change, so something else must have increased the forcing. A straightedge across the pulleys shows the new motor's pulley is set 3 mm out of line, and the motor feet were not shimmed to the same height as the old motor's.

The correction was to realign the motor pulley, shim the feet, and recheck the tension by frequency after a short run. The flutter fell to a level that could not be seen. The procedure was changed so that any motor or pulley change ends with an alignment check and a run at the fan's usual operating speed while someone watches the slack span. Chapter 10 records the 46 Hz crossing in the resonance register as a speed band to watch.

## Ways to move a span frequency

When a crossing sits at a speed the fan uses constantly and alignment alone does not settle it, the span frequency itself can be moved. Each option has side effects:

```figure
type: compare
title: Options for moving a belt span's frequency
rowhead: Change
cols: Effect on span frequency | Side effects to check
caption: The span frequency depends on tension, mass per metre and length. Changing any of them also changes something else about the drive.
- Raise static tension | rises with the square root of tension | bearing and shaft loads, belt life; may move the crossing onto a worse speed
- Change centre distance | falls roughly in proportion to longer span | drive geometry, wrap angle, guard and base changes
- Add an idler on the slack side | rises sharply as the span is divided | idler bearing life, reverse bending of the belt, new span frequencies
- * Change belt section or number | falls if mass per metre rises | needs its own tension target, as Chapter 2 showed
- Change pulley sizes | moves the shaft speeds and harmonics instead | fan duty point and motor loading
```

For RF-3 the case accepts the 46 Hz crossing after realignment, on the evidence of the follow-up observation, and records it for the next time the drive is changed.

## Strobe and spectrum checks

Two simple measurements confirm what the calculation suggests. A stroboscope set close to the span's flutter frequency makes the moving span appear to stand still or move slowly, which shows the mode shape and lets you read the frequency from the strobe setting. A handheld vibration analyser on the motor and fan bearings, with a spectrum display, shows whether the 2× and 3× harmonics are unusually high. Chapter 10 covers the spectrum reading in more detail.

Both measurements are made on running plant, near moving belts. They must follow the site's procedures for working near rotating equipment, normally with guards in place and the strobe or sensor used through openings provided for inspection.

## Exercise: the slack span at 40 Hz supply

At 40 Hz supply, using the chapter's assumptions, the belt speed is 9.72 m/s and the fan absorbs 5.5 × 0.8³ = 2.82 kW. Find the effective pull per belt, the slack-side tension and its static-formula span frequency. Then compare that frequency with the motor 2×, fan 3× and fan 4× harmonics at 40 Hz supply.

**Answer.** Total effective pull is 2,816 ÷ 9.72 ≈ 289.7 N, or about 144.9 N per belt. The slack-side tension is 450 − 144.9 ÷ 2 ≈ 377.6 N. Its static span frequency is 0.8357 × √(377.6 ÷ 0.12) ≈ **46.9 Hz**; the running estimate is about 46.2 Hz.

At 40 Hz supply the motor 2× harmonic is 38.7 Hz, the fan 3× harmonic 37.1 Hz and the fan 4× harmonic 49.5 Hz. Using the running estimate, the span is about 19 per cent above the motor 2×, 24 per cent above the fan 3× and about 6.7 per cent below the fan 4×. Only the fan 4× harmonic is inside the 15 per cent margin, and 4× is usually a small force; record it, and check the spectrum for 4× content if the span is ever seen to flutter at this speed.
