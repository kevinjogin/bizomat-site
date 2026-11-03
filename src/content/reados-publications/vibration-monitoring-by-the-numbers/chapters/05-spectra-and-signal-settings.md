---
book: vibration-monitoring-by-the-numbers
chapterSlug: spectra-and-signal-settings
order: 5
title: "Spectra and signal settings"
description: "From waveform to spectrum: maximum frequency, lines and resolution, windows, averaging, orders and speed, and a low-resolution spectrum that blamed a motor's mechanics for an electrical fault."
draft: false
---

A vibration signal recorded at a bearing housing is a jumble: the sum of every force in the machine, each at its own frequency, plus noise. The spectrum unscrambles it. It shows how much vibration there is at each frequency, and because each fault has its own frequencies, the spectrum turns a jumble into a list of suspects. But a spectrum is not a photograph of the machine. It is the result of a calculation, the fast Fourier transform, whose settings decide what it can separate, how accurately it shows each peak's height and how long it takes. With the wrong settings, two different faults merge into one peak, or a real peak is hidden in the noise.

This chapter explains the time waveform and the spectrum, the settings that define a spectrum, maximum frequency, number of lines and the resolution and measurement time that follow from them, windows and their amplitude errors, averaging, and plotting in orders of running speed. It finishes with a spectrum on P-4's motor whose resolution was too coarse to separate a mechanical frequency from an electrical one.

## Time waveform and spectrum

The time waveform is the signal as the sensor produced it: acceleration, or velocity after integration, against time. It shows impacts, beats and truncations clearly, and a trained analyst reads a lot from it: a bearing's periodic impacts, a gear's single knock per revolution, a rub that clips the waveform flat. But most machine signals contain many frequencies at once, and the waveform alone cannot say how much of each.

The spectrum shows the amplitude at each frequency. The fast Fourier transform, FFT, takes a block of the waveform, a fixed number of samples over a fixed time, and finds how much of each of a set of evenly spaced frequencies the block contains. Each of those frequencies is a line in the spectrum. Peaks at the running speed, its harmonics, a bearing's defect frequencies or a gear's mesh appear as tall lines, and the analyst identifies each by its frequency.

## Maximum frequency, lines and resolution

Two settings define an FFT spectrum: the maximum frequency, Fmax, and the number of lines, N. Everything else follows.

```figure
type: formula
title: Resolution and measurement time of an FFT spectrum
formula: Resolution: Δf = Fmax ÷ N
formula: Time to acquire one block: T = N ÷ Fmax = 1 ÷ Δf
caption: The resolution is the spacing between lines. Finer resolution needs a longer block of signal: a spectrum resolving 0.25 Hz needs 4 seconds of data for each average. Instruments sample faster than Fmax, typically 2.56 times, to avoid aliasing; Fmax is the highest frequency displayed.
- Fmax | highest frequency in the spectrum, Hz
- N | number of lines
- Δf | frequency resolution, Hz
- T | time per block, s
```

The trade is unavoidable. A wide Fmax covers high-frequency faults; a large N gives fine resolution; both together need many samples, and fine resolution needs a long block of data during which the machine's speed must stay steady.

```figure
type: compare
title: Spectrum settings and what they cost
cols: Resolution | Time per average | Time for 4 averages, 50% overlap
rowhead: Fmax and lines
- 1,000 Hz, 400 lines | 2.5 Hz | 0.4 s | 1.0 s
- 1,000 Hz, 1,600 lines | 0.625 Hz | 1.6 s | 4.0 s
- 400 Hz, 1,600 lines | 0.25 Hz | 4.0 s | 10.0 s
- 200 Hz, 3,200 lines | 0.0625 Hz | 16 s | 40 s
caption: Time for k averages with 50% overlap is T × (1 + (k − 1) × 0.5). Finer resolution multiplies route time per point, which adds up over a route of hundreds of points.
```

### How fine is fine enough?

Two peaks can be told apart only if they are separated by several lines, because each peak spreads over a few lines, as the next section explains. With a Hanning window, the usual choice, two peaks of similar size need to be at least about three or four lines apart to show as separate peaks. To separate P-4's 4× running-speed component at 98.67 Hz from the motor's electrical line at 100 Hz, twice the 50 Hz mains frequency, 1.33 Hz apart, the resolution must be about 0.4 Hz or finer.

### Sampling and aliasing

A digital instrument samples the signal at a fixed rate and can represent frequencies only up to half that rate. A component above half the sampling rate does not disappear; it folds back and appears at a false, lower frequency, called an alias, indistinguishable from a real component. Instruments prevent this with an analogue low-pass filter before sampling and by sampling at about 2.56 times Fmax, so that the filter has room to roll off between Fmax and half the sampling rate. The practical consequence for the user is simple: everything above Fmax is removed before analysis, so a fault whose frequencies lie above the chosen Fmax is invisible, not merely shown poorly. Choosing Fmax is choosing which faults the measurement can see. The route's acceleration spectra therefore run to 5 kHz.

## Windows and amplitude error

The FFT assumes the block of signal repeats exactly, end to start. Real signals do not fit a block exactly, and the mismatch at the block's ends spreads each peak's energy into neighbouring lines, called leakage. A window function tapers the block smoothly to zero at both ends to reduce leakage, at the cost of widening each peak.

```figure
type: compare
title: Common windows for machine vibration
cols: Peak width | Worst amplitude error between lines | Use
rowhead: Window
- Rectangular, no window | narrowest | up to about 36% low | impacts and transients that fit the block; bump tests
- * Hanning | moderate | up to about 15% low | general machine spectra; the route default
- Flat top | widest | under about 1% | accurate amplitudes of well-separated peaks; calibration
caption: Typical figures. The worst error occurs when a frequency falls exactly between two lines; when it falls on a line, the error is zero for all three.
```

The Hanning window's possible error of up to about 15% in a peak's height, when its frequency falls midway between lines, is one reason why trends of single peaks scatter more than trends of overall levels, which sum the energy over several lines and are unaffected. Software that reports a peak's amplitude by combining the lines around it, rather than reading the tallest line, removes most of that error.

## Averaging

A single spectrum contains random noise as well as the machine's steady components. Averaging several spectra keeps the steady components and reduces the scatter of the noise, roughly by the square root of the number of averages. Overlapping successive blocks by half reuses data and shortens the time. The mill's route uses four averages with 50% overlap on its general spectra and eight on its high-frequency acceleration spectra, where the signal is noisier.

Averaging assumes the machine is steady. On a machine whose speed or load changes during the measurement, averaging smears its peaks. The log carriage's hydraulic pump, P-4, runs at steady speed, but its load cycles with each pass of the carriage, so its route reading is taken during a steady part of the cycle, which the technician watches for.

A different kind of averaging, synchronous time averaging, averages the time waveform itself in blocks that each start at the same point in a shaft's revolution, triggered by a tachometer. Everything that repeats exactly once per revolution of that shaft reinforces; everything else, including vibration from other shafts and random noise, averages away. It is particularly powerful for gearboxes, where it isolates the vibration of one gear from all the others, and Chapter 9 uses it on G-3.

## Phase

A spectrum gives each component's amplitude and frequency but not its timing. Phase, measured relative to a once-per-revolution reference such as a reflective tape read by an optical tachometer, gives the timing of the 1× component: where in the revolution the shaft is when the vibration peaks. Phase is what makes balancing possible, as Chapter 6 shows, and comparing phase between bearings and directions separates faults with similar spectra: unbalance gives radial vibration that is in phase across a rigid rotor's bearings, while misalignment gives axial vibration that is about 180° out of phase across a coupling. Phase is not part of the routine route, because it needs a reference on the shaft, but the technician carries a tachometer and takes phase readings whenever a 1× or 2× problem is being diagnosed.

## Orders and speed

Most machine frequencies are fixed multiples of the running speed: 1× for unbalance, 2× for misalignment, a bearing's defect frequencies at fixed, non-integer multiples, a gear's mesh at the tooth count. Plotting the spectrum in orders, multiples of running speed, rather than hertz puts each of those at the same place whatever the speed, which makes it easy to recognise them and to compare spectra taken at slightly different speeds. It needs an accurate speed, from a tachometer or from a reliable peak in the spectrum. For an induction motor whose speed falls slightly with load, from 1,490 to 1,470 r/min, the same bearing frequency moves by over 1% in hertz but not at all in orders.

## The mistake: an electrical fault called looseness

On a fast route setting of 1,000 Hz and 400 lines, 2.5 Hz resolution, P-4's motor showed a tall peak near 100 Hz. The analysis software, finding a peak close to 4× running speed with smaller peaks at 2× and 3×, suggested mechanical looseness, and a fitter was booked to check the motor's feet and bearing housing fits.

```figure
type: steps
title: Resolving the peak near 100 Hz
caption: This is an illustration. Two frequencies 1.33 Hz apart cannot be separated with 2.5 Hz lines.
- First spectrum | 1,000 Hz, 400 lines, 2.5 Hz resolution: one peak near 100 Hz
- Candidates | 4 × 24.67 = 98.67 Hz, mechanical; 2 × 50 = 100 Hz, electrical
- Second spectrum | 400 Hz, 1,600 lines, 0.25 Hz resolution, 10 s with averaging
- * Result | the peak sat at 100.0 Hz exactly, with only a small component at 98.7 Hz
- Check | switching the motor off: the 100 Hz peak vanished instantly, before the motor slowed, which is the signature of an electrical source
- Action | motor's supply and winding checked: an unbalanced phase voltage from a loose terminal; repaired
```

The two candidate frequencies, 98.67 Hz for 4× running speed and 100 Hz for twice the line frequency, were 1.33 Hz apart, about half of one 2.5 Hz line, and appeared as one peak. A second measurement at 400 Hz and 1,600 lines, 0.25 Hz resolution, put the peak at exactly 100.0 Hz, with only a small component at 98.7 Hz. A simple check confirmed it: when the motor was switched off, the 100 Hz peak vanished at once, while mechanical components fade only as the rotor slows. An electrical cause, here an unbalanced supply from a loose terminal in the motor's connection box, produces magnetic forces at twice the line frequency; a mechanical cause would have stayed. The loose terminal was repaired, the fitter's booking cancelled, and the route now takes a high-resolution spectrum on every motor whenever a peak appears near 100 Hz. The extra measurement costs about ten seconds at the point; the unnecessary mechanical inspection it replaced would have cost a fitter half a day and left the real fault, a loose terminal that could have overheated, in place.

## Reading a spectrum, step by step

Experienced analysts read a spectrum in a consistent order, which keeps them from fixing on the first tall peak they see.

1. Find the running speed. Locate 1× from a tachometer reading or the motor's nameplate and slip, and confirm it with a peak in the spectrum.
2. Mark the harmonics of 1×: 2×, 3× and onwards. Note which are present and how large compared with 1×.
3. Mark the machine's known frequencies: bearing defect frequencies from Chapter 8, gear mesh and its harmonics from Chapter 9, blade or vane pass, belt frequencies, and electrical frequencies at multiples of 100 Hz.
4. Look for sidebands, peaks spaced evenly either side of a larger one, which show that one frequency is being modulated by another, typical of bearing and gear faults.
5. Note anything unaccounted for, including sub-synchronous peaks below 1× and raised broadband noise.
6. Compare the three directions at the bearing and the same point on other bearings of the machine.
7. Compare with the machine's baseline and last few spectra, and decide which components have changed.

The order matters: a peak that is a known, steady frequency of the machine and has not changed since the baseline is not a fault, however tall it is.

## Watching spectra change

A single spectrum shows what is present; a series of them shows what is changing. The mill's software stacks successive route spectra for each point into a waterfall plot, with time running into the page, which makes a growing peak or a new family of bearing frequencies stand out against unchanged ones. For the chipper's online sensors, which produce spectra every few minutes, the same plot over a day shows how the vibration varies with the chipper's load as logs pass through it. A component that grows steadily across a waterfall is a fault developing; one that comes and goes with load is part of the machine's normal behaviour.

## Setting up a route's spectra

The mill uses a small set of standard measurements at each point, chosen to cover the faults likely on each machine without making the route too slow.

```figure
type: checklist
title: Standard measurements at each route point on a motor or fan bearing
caption: This is an illustration. Settings chosen from each machine's running speed and its likely faults.
- x Overall velocity, RMS, 10 to 1,000 Hz | the trend and the main alarm
- x Velocity spectrum, Fmax 40 orders, 1,600 lines | unbalance to bearing and vane frequencies
- x Acceleration spectrum, Fmax 5 kHz, 800 lines | high-frequency bearing and gear energy
- x Envelope spectrum, Chapter 8 | early bearing defects
- x Time waveform, a few revolutions | impacts, rubs, beats
- ? High-resolution spectrum near 2 × line frequency | taken whenever a peak appears near 100 Hz on a motor
```

## Exercise: resolving a cooling fan's blade pass

F-2's impeller has 8 blades and runs at 1,480 r/min. Its motor is a four-pole machine on 50 Hz mains. Calculate the blade-pass frequency, the nearest motor electrical frequency of 2 × line frequency multiplied by a whole number, and the separation between them. Then choose an Fmax and number of lines from the chapter's table that would separate them with at least four lines between them, and give the time for four averages with 50% overlap.

### Answer

**Given:** 8 blades; 1,480 r/min = 24.67 Hz; line frequency 50 Hz.

**Assumptions:** steady speed; four lines between peaks needed with a Hanning window.

**Method:** blade pass = blades × running speed; compare with multiples of 100 Hz; required Δf = separation ÷ 4.

**Blade pass:** 8 × 24.67 = 197.3 Hz.

**Nearest electrical frequency:** 2 × 100 = 200 Hz.

**Separation:** 200 − 197.3 = 2.7 Hz.

**Required resolution:** 2.7 ÷ 4 = 0.67 Hz or finer.

**Choice:** 1,000 Hz and 1,600 lines gives 0.625 Hz, enough, and covers both peaks with room for harmonics. Time for four averages with 50% overlap: 1.6 × (1 + 3 × 0.5) = 4.0 s. The route's coarse setting, 2.5 Hz, could not separate them.

**Verification:** 2.7 ÷ 0.625 = 4.3 lines between the peaks, more than the four required, and 400 Hz with 1,600 lines would give 10.7 lines but would cut off the blade pass's second harmonic at 394.7 Hz only just inside the range.
