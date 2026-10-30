---
book: random-vibration-by-the-numbers
chapterSlug: power-spectral-density
order: 2
title: "Power spectral density: where the energy sits"
description: "The acceleration spectral density in g²/Hz, why its area is the mean square, reading log-log profiles in dB per octave, calculating RMS by segments, band levels, and displacement from a spectrum."
draft: false
---

The RMS level of Chapter 1 says how hard a random vibration is in total. It says nothing about which frequencies carry that energy, and for a structure with resonances the frequencies matter more than the total: a bracket that rings at 120 Hz cares about the vibration near 120 Hz and hardly at all about the vibration at 20 or 400 Hz. The power spectral density, PSD, sometimes called the acceleration spectral density, describes how a random vibration's mean square is spread across frequency. It is the language in which vibration specifications are written and in which every calculation in the rest of this book begins.

This chapter defines the PSD and its units, shows why its area is the mean square, explains the log-log profiles and slopes in decibels per octave that specifications use, and calculates CB-7's 2.55 g RMS from its profile segment by segment. It shows how the same spectrum gives velocity and displacement, and ends with a spreadsheet that drew straight lines on the wrong axes.

## Mean square per hertz

Imagine passing a random vibration through a very narrow filter that lets through only the frequencies between f and f + Δf, and measuring the mean square of what comes out. Divide that mean square by the bandwidth Δf, and let the band shrink: the result is the PSD at frequency f. Its units are those of the mean square per hertz, for acceleration g² per hertz, written g²/Hz.

Two consequences follow from the definition. Adding up the mean square in every narrow band gives back the total mean square, so the area under the PSD curve equals the mean square of the signal, and its square root is the RMS. And because mean squares of independent components add, as Chapter 1 showed, the PSDs of independent sources add too, frequency by frequency.

```figure
type: formula
title: The PSD and the RMS
formula: Mean square = ∫ W(f) df over the band; RMS = √(mean square)
formula: Flat PSD of level W from f₁ to f₂: g_rms = √(W × (f₂ − f₁))
caption: W(f) is the acceleration spectral density in g²/Hz. This is an illustration: a flat 0.02 g²/Hz from 10 to 500 Hz.
- Level | 0.02 g²/Hz
- Bandwidth | 500 − 10 = 490 Hz
step: Mean square = 0.02 × 490 = 9.8 g²
step: g_rms = √9.8 = 3.13 g
```

A PSD of 0.02 g²/Hz sounds tiny until it is multiplied by a few hundred hertz of bandwidth. That is the most common source of confusion for engineers new to random vibration: the spectral density is a density, and its meaning comes from its area, not its height. A narrow spike can be very tall and carry little energy; a low, wide plateau can carry most of it.

## Profiles on log-log axes

Vibration profiles are plotted with logarithmic axes for both frequency and PSD, and their segments are straight lines on those axes. A straight line on a log-log plot is a power law, W ∝ fⁿ, and specifications describe its slope in decibels per octave: the change in 10 log₁₀ W for each doubling of frequency. A slope of +3 dB per octave doubles the PSD with each doubling of frequency (n = 1); −6 dB per octave quarters it (n = −2).

CB-7's profile, introduced in the running case, has three segments: from 5 to 40 Hz it rises from 0.0025 to 0.02 g²/Hz, three octaves at +3 dB per octave; from 40 to 200 Hz it is flat at 0.02 g²/Hz; from 200 to 500 Hz it falls to 0.005 g²/Hz, a slope of −4.55 dB per octave.

## Reading a specification profile

A vibration specification usually gives its profile as a short table of breakpoints: frequency and PSD at each corner, sometimes with the slopes between them in decibels per octave, and an overall RMS. It also states the axis or axes, the duration per axis and the tolerances allowed in a test. Three checks catch most transcription errors before any analysis starts.

- **Slopes against breakpoints.** The slope between two breakpoints must match their PSD ratio: from 0.0025 to 0.02 g²/Hz over three octaves is a factor of eight, 9.03 dB, or 3.01 dB per octave. A stated slope that disagrees with the breakpoints means one of them has been copied wrongly.
- **Overall RMS against the integral.** Integrating the profile, as below, should reproduce the stated RMS to within rounding. A large difference usually means a wrong breakpoint, a wrong unit, or a profile integrated on the wrong axes.
- **Band edges.** The lowest and highest frequencies matter: the lowest for displacement and shaker stroke, the highest for small parts with high resonances. A profile copied without its band edges is incomplete.

CB-7's specification passes all three: its slopes match its breakpoints, its stated 2.55 g RMS matches the integral, and its band is 5 to 500 Hz. Ten minutes spent on these checks at the start of a project has saved many a test from being run to the wrong profile.

## Area of a sloped segment

The area under a straight log-log segment is not a trapezoid. With W₁ at f₁, W₂ at f₂ and exponent n = log(W₂ ÷ W₁) ÷ log(f₂ ÷ f₁), the area is W₁f₁ ÷ (n + 1) × [(f₂ ÷ f₁)ⁿ⁺¹ − 1], except for n = −1, where it is W₁f₁ ln(f₂ ÷ f₁). The exponent follows from the slope: n = slope in dB per octave ÷ 3.01.

```figure
type: steps
title: CB-7's profile, segment by segment
caption: This is an illustration. Each segment's area from the log-log formula; the total is the mean square of the whole profile.
- 5 to 40 Hz, +3 dB/oct, n = 1 | 0.0025 × 5 ÷ 2 × (8² − 1) = 0.394 g²
- 40 to 200 Hz, flat | 0.02 × 160 = 3.200 g²
- 200 to 500 Hz, −4.55 dB/oct, n = −1.513 | 0.02 × 200 ÷ (−0.513) × (2.5^(−0.513) − 1) = 2.924 g²
- * Total | 6.518 g², so g_rms = √6.518 = 2.55 g
```

The breakdown shows where the profile's energy lies: 6.0% below 40 Hz, 49.1% in the flat band and 44.9% above 200 Hz.

```figure
type: bars
title: Share of CB-7's mean square by segment
unit: %
max: 60
caption: This is an illustration. Almost all of the profile's energy lies above 40 Hz, where the enclosure's isolators will work best. The small low-frequency share still dominates displacement, as the next section shows.
- 5 to 40 Hz | 6.0
- * 40 to 200 Hz | 49.1
- 200 to 500 Hz | 44.9
```

## Band levels

The RMS in any part of the band is the square root of the area over that part. This is an illustration. Between 100 and 300 Hz, which contains the circuit board's resonance at 180 Hz, CB-7's profile holds 3.46 g² of mean square, an RMS of 1.86 g: nearly three-quarters of the total RMS in about a quarter of the band on a logarithmic frequency scale. Engineers checking a part with a resonance in a particular band often compare band levels between two profiles, because two profiles with the same overall RMS can differ greatly in the band that matters to that part.

## Units and conversions

PSDs appear in g²/Hz in most specifications and in (m/s²)²/Hz in many analysis programs and standards written in SI units. The conversion factor is g² = 9.807² = 96.17, so CB-7's flat level of 0.02 g²/Hz is 1.92 (m/s²)²/Hz. The factor is squared because the PSD is a mean-square quantity; converting with 9.807 instead of 96.17 is a common slip that understates an SI spectrum tenfold. The RMS, being a square root, converts with the ordinary factor: 2.55 g RMS is 25.0 m/s² RMS.

## Comparing two profiles

Engineers are often asked whether one profile covers another: whether a supplier's standard test covers the customer's specification, or whether a measured environment exceeds the design profile. Comparing overall RMS values is not enough, as the band-level example above showed. The right comparison is frequency by frequency, at least around each resonance of the equipment, because a part responds mainly to the PSD near its own natural frequency, as Chapter 4 shows. A profile that is higher everywhere covers the other; one that is higher overall but lower near a key resonance does not, however impressive its total.

When several measured spectra must be covered by one design profile, as when a plant works on different rock types and roads, the usual approach is an envelope: a set of straight log-log segments that lie on or above every measured spectrum. Enveloping is conservative by construction, and the margin it adds should be noted, because a profile that envelopes the worst peak of every condition at once describes no real condition, and a test to it may be much more severe than service.

## Velocity and displacement from the spectrum

The same spectrum gives velocity and displacement, by dividing each frequency's acceleration PSD by (2πf)² for velocity and (2πf)⁴ for displacement, after converting g to m/s². The division weights low frequencies very heavily. This is an illustration. CB-7's profile, integrated this way, has a velocity of 60 mm/s RMS and a displacement of 0.78 mm RMS. Three-quarters of the displacement's mean square comes from the 5 to 10 Hz part of the profile, which holds only a tiny fraction of the acceleration.

That is why the low-frequency end of a profile matters for clearances and isolator travel even when it contributes little to the RMS acceleration, and why the lowest frequency of a test profile is often limited by the shaker's stroke rather than its force. A profile extended down to 2 Hz with the same slope would barely change the RMS acceleration and would multiply the displacement.

## The PSD is a statistic

A PSD describes a stationary random process, and like any statistic it summarises a great deal of information while discarding the rest. It does not record the phase between frequencies, so it cannot distinguish a Gaussian random signal from a non-Gaussian one with the same spectrum; it does not record changes over time, so a vibration that is quiet most of the time and violent occasionally can have the same PSD as one that is steadily moderate. For Gaussian, stationary vibration the PSD says everything that matters; for vibration with shocks or changing conditions it must be supplemented, by kurtosis, by separate profiles for separate conditions, or by shock specifications. Chapter 3 shows how to check measured data for these features before trusting a PSD made from it.

## Adding a sine to random

Some environments contain both random vibration and strong discrete tones, such as CB-7's engine at 25 Hz or a gearbox's meshing frequency. A sinusoid has all its mean square at a single frequency, so on a PSD it appears as a narrow spike whose height depends on the analysis bandwidth: halve the bandwidth and the spike doubles in height while its area stays the same. That makes tones on a PSD easy to misread. Specifications usually separate them: a random profile for the broadband part and a list of sine tones, each with its frequency and amplitude, to be tested as sine-on-random. Chapter 5 deals with CB-7's engine tone on its own, as a sine, because that is what it is.

## The error: straight lines on linear axes

This is an illustration. A spreadsheet used to check vibration profiles calculated each segment's area as a trapezoid, the average of the two end PSD values times the bandwidth: a straight line on linear axes, not on log-log axes. For CB-7's rising and flat segments the trapezoid happened to give the same answer, but for the falling segment from 200 to 500 Hz it gave (0.02 + 0.005) ÷ 2 × 300 = 3.75 g² against the correct 2.924 g². The total came out at 7.344 g², an RMS of 2.71 g, 6% above the true 2.55 g.

Six per cent sounds small, but the spreadsheet was being used to compare a supplier's test profile with the specification, and the supplier's profile, correctly integrated, was 4% below the specification. The spreadsheet's error hid the shortfall. The engineer caught it by integrating the falling segment numerically at 1 Hz steps, which reproduced 2.924 g², and the spreadsheet was corrected to use the log-log formula. The lesson generalises: a profile defined on log-log axes must be integrated on log-log axes, and any tool used to compare profiles should be checked against a case with a known answer, such as a flat segment, and a sloped one integrated numerically.

## Exercise: a supplier's test profile

A supplier proposes a test profile rising from 0.01 g²/Hz at 20 Hz to 0.04 g²/Hz at 80 Hz, flat at 0.04 g²/Hz to 350 Hz, then falling at −6 dB per octave to 1,000 Hz. Find the PSD at 1,000 Hz, the area of each segment and the overall RMS.

**Worked answer.** This is an illustration. The rising segment quadruples over two octaves, +3 dB per octave, n = 1: area 0.01 × 20 ÷ 2 × (4² − 1) = **1.500 g²**. The flat segment: 0.04 × 270 = **10.800 g²**. The falling segment has n = −2, so the PSD at 1,000 Hz is 0.04 × (1000 ÷ 350)⁻² = **0.0049 g²/Hz**, and the area is 0.04 × 350 ÷ (−1) × ((1000 ÷ 350)⁻¹ − 1) = 14 × (1 − 0.35) = **9.100 g²**. The total is 21.4 g², an overall level of **4.63 g RMS**, much more severe than CB-7's 2.55 g, mostly because of its higher flat level and its extension to 1,000 Hz. Before accepting it as covering the specification, the band levels around each of CB-7's resonances should be compared, not only the totals.
