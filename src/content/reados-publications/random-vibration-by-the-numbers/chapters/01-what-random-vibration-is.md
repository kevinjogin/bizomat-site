---
book: random-vibration-by-the-numbers
chapterSlug: what-random-vibration-is
order: 1
title: "What random vibration is"
description: "Random vibration as a random variable: stationary signals, why amplitudes are Gaussian, RMS as the standard deviation, how often peaks reach 2σ, 3σ and beyond, and how random differs from sine."
draft: false
---

Put an accelerometer on the frame of a vibrating screen, a truck chassis or an aircraft panel and record a few seconds. The trace looks like noise: rapid, irregular, never repeating, with occasional spikes well above its usual level. Yet if you record another few seconds under the same conditions, the new trace, different in every detail, has the same character: the same typical level, the same proportion of large spikes, the same mix of frequencies. That combination of unpredictable detail and predictable character is what engineers mean by random vibration, and it is exactly the kind of thing that the theory of random variables and random processes was built to describe.

This chapter sets out the few statistical ideas that the rest of the book depends on: stationarity, the normal distribution of amplitudes and why it arises, the RMS level as a standard deviation, and how often the peaks reach two, three or more times that level. It ends with a mounting designed to a random level read as if it were a peak. Everything later in the book, from spectra to fatigue, is built on these few ideas, so they are worth getting exactly right.

## Sine and random

A sine vibration has one frequency and one amplitude. Its acceleration swings between plus and minus its peak value in a regular rhythm, and its RMS (root mean square) value is the peak divided by √2. Engine imbalance, a fan with a heavy blade, an out-of-round roller: these produce near-sinusoidal vibration at a frequency set by their speed, and Chapter 5 deals with them.

Random vibration contains a continuous band of frequencies at once, with phases and amplitudes that wander. At any instant the acceleration is the sum of countless small contributions: wheel inputs from a rough road, impacts from rock on a screen deck, turbulence over a panel. Its value at a given instant cannot be predicted, but its statistics can, and the statistics are what a design or a test has to meet.

## Stationary and Gaussian

Two assumptions make random vibration tractable. The first is stationarity: the statistical character of the signal does not change with time. The screen running steadily on a given rock is stationary; a truck accelerating from rest is not. Real environments are stationary only in stretches, and a vibration specification is usually built from a set of stationary conditions, each with its own duration.

The second is that the instantaneous amplitude follows the normal, or Gaussian, distribution. The reason is the central limit theorem, which Lemons and every text on random processes treat as the bridge from many small random causes to a bell-shaped total: when a quantity is the sum of many independent contributions, none dominating, its distribution approaches the normal. A vibration signal made of many independent sources and many structural paths fits that description well. A quick numerical check makes the point: adding fifty sinusoids of random frequencies between 10 and 500 Hz with random phases gives a signal whose kurtosis, the statistic that is exactly 3 for a normal distribution, came out at 2.98 over 200,000 samples.

```figure
type: line
title: Twenty-four successive samples of a Gaussian random acceleration with an RMS of 2.55 g
x: Sample
y: Acceleration, g
ymin: -8
ymax: 8
caption: This is an illustration: random numbers drawn from a normal distribution with standard deviation 2.55 g, the level of CB-7's specification. In 24 samples the largest is 3.84 g, 1.5σ; in a long record, values beyond 3σ, 7.66 g, appear about three times in a thousand samples.
- 1 | -1.05
- 2 | 3.81
- 3 | -0.69
- 4 | 0.92
- 5 | 1.76
- 6 | -2.65
- 7 | 3.84
- 8 | 2.16
- 9 | -1.39
- 10 | -3.00
- 11 | -0.43
- 12 | -1.19
- 13 | 2.94
- 14 | 3.03
- 15 | -0.95
- 16 | -0.53
- 17 | -2.12
- 18 | -0.01
- 19 | 1.99
- 20 | 1.96
- 21 | 1.72
- 22 | -0.43
- 23 | -0.38
- 24 | 2.37
```

Both assumptions should be checked against measured data, as Chapter 3 discusses. Vibration dominated by occasional shocks, such as a truck crossing potholes or a screen struck by large rocks, is spikier than Gaussian, with a kurtosis well above 3, and its peaks are more frequent than this chapter's numbers suggest.

## RMS is the standard deviation

Vibration acceleration averages zero over time: the frame shakes about its rest position. For a signal with zero mean, the RMS value is the square root of the average squared value, which is exactly the standard deviation. A vibration level quoted as "2.55 g RMS" therefore means a Gaussian signal with a standard deviation of 2.55 g, and every statement about the normal distribution applies to it directly.

This is an illustration. CB-7's specification profile, described in the running case, has an overall level of 2.55 g RMS. Chapter 2 shows how that figure follows from the profile's spectrum; here it is enough to read it as σ.

## How often the peaks come

The normal distribution fixes the share of time the signal spends beyond any level. Within ±1σ the signal spends 68.3% of the time; within ±2σ, 95.4%; within ±3σ, 99.73%. Beyond 3σ it spends 0.27% of the time, and beyond 4σ, 0.006%.

```figure
type: compare
title: CB-7's 2.55 g RMS specification read as a Gaussian signal
cols: Acceleration level | Share of time beyond this level | One sample in
rowhead: Level
caption: This is an illustration. Shares of time for a Gaussian signal, both signs counted. The shares fall very fast: each extra σ makes large values rarer by a factor that grows with the level.
- 1σ | ±2.55 g | 31.7% | 3
- 2σ | ±5.11 g | 4.6% | 22
- * 3σ | ±7.66 g | 0.27% | 370
- 4σ | ±10.2 g | 0.0063% | 15,800
- 5σ | ±12.8 g | 0.000057% | 1,740,000
```

The 3σ level is often used as a design load for random vibration, because 99.73% of the time the acceleration is within it. But "0.27% of the time" is not "never". A signal sampled ten thousand times a second exceeds 3σ about 27 times a second, and in hours of service it reaches 4σ and 5σ many times. Chapter 7 works out how often the peaks of a resonant part reach each level, which is the question that matters for fatigue.

## Mean squares add

Because RMS is a standard deviation, independent vibration sources combine as variances do: their mean squares add. This is the variance sum rule that Lemons and every statistics text derive, and it is the most useful single fact in vibration arithmetic.

```figure
type: formula
title: Combining independent random vibrations
formula: g²_total = g²₁ + g²₂ + …, so g_rms,total = √(g²₁ + g²₂ + …)
formula: Level change in decibels: 10 log₁₀(mean-square ratio) = 20 log₁₀(RMS ratio)
caption: This is an illustration. Sources must be independent, with no fixed phase relation. Correlated sources, such as two outputs of one gearbox, can add or partly cancel.
- Screen deck, through the frame | 2.0 g RMS
- Engine and generator, through the frame | 1.6 g RMS
step: Combined: √(2.0² + 1.6²) = √6.56 = 2.56 g RMS, not 3.6 g
step: Doubling a mean square is +3 dB and multiplies the RMS by √2 = 1.41
```

The decibel convention causes regular confusion. Vibration spectra are mean-square quantities, so a 3 dB increase doubles the spectral density and multiplies the RMS by 1.41, while a 6 dB increase quadruples the spectral density and doubles the RMS. When a test standard allows a tolerance of ±3 dB on a spectrum, it allows the spectral density to be half or double the target at some frequencies: a wide band that Chapter 9 returns to.

## Three axes, many conditions

Vibration acts in three directions at once, and a specification usually gives a profile for each axis, vertical, longitudinal and lateral, sometimes different. Equipment is analysed and tested in each axis separately, because a part's resonances and weaknesses differ between them. A bracket stiff vertically may be soft sideways.

A real service life also spans several conditions. CB-7's plant spends about 2,000 hours a year screening, a few dozen hours a year being towed between quarries on rough roads, and some time idling. Each condition has its own spectrum and duration, and the combination, sometimes called a mission profile, is the basis of a vibration specification. The screening condition dominates CB-7's life by hours, but the towing condition can dominate by severity, with occasional large shocks from potholes. Chapter 8 shows how fatigue damage from different conditions is added, and Chapter 9 how a test can represent them.

## Random against sine at the same RMS

A sine vibration and a random vibration with the same RMS are very different loads. The sine at 2.55 g RMS peaks at √2 × 2.55 = 3.61 g, every cycle, and never exceeds it. The random signal at 2.55 g RMS exceeds 3.61 g about 16% of the time, reaches 7.66 g occasionally and more rarely higher. The sine concentrates all its energy at one frequency, so it drives one resonance hard; the random signal spreads its energy over the band and drives every resonance within it at once, each in proportion to the energy near its own frequency.

That is why a part that survives a sine test can fail a random test of the same RMS, and the reverse, and why a vibration specification must state which kind of excitation it means. A requirement written simply as "2.55 g" is ambiguous until it says RMS or peak, random or sine, over what frequency band and for how long.

## Acceleration, velocity and displacement

Vibration specifications are usually written in acceleration, because accelerometers measure it and because force on a mass is mass times acceleration. But the same acceleration means very different motion at different frequencies. For a sinusoid, displacement amplitude is acceleration divided by (2πf)², and velocity amplitude is acceleration divided by 2πf.

This is an illustration. One g of acceleration at 5 Hz is a displacement amplitude of about 9.9 mm; at 10 Hz, 2.5 mm; at 100 Hz, 0.025 mm; at 500 Hz, 0.001 mm. Low-frequency vibration moves things a long way with little acceleration, which matters for clearances, cables and isolators; high-frequency vibration accelerates things hard while barely moving them, which matters for small components, solder joints and fasteners. A broadband profile does both. When Chapter 5 puts CB-7 on soft isolators, it trades lower acceleration for more movement, and the clearance around the enclosure has to be checked against that movement.

## Quoting a level properly

An RMS value depends on the frequency band over which it is measured, because a wider band includes more of the signal's energy. A measured "3 g RMS" from an accelerometer filtered to 2,000 Hz and a "2.55 g RMS" specification over 5 to 500 Hz may describe the same vibration, or very different ones. A level should always be quoted with its band, its direction and whether it is RMS or peak: "2.55 g RMS, 5 to 500 Hz, vertical" leaves nothing to guess. The spectrum of Chapter 2 is the fuller description, from which the RMS over any band can be calculated.

## Generating a random signal

Engineers often need random time histories, to drive a simulation, to check an analysis or to play into a shaker controller. The simplest method follows from the central limit theorem: add many sinusoids with the right amplitudes at closely spaced frequencies, each with a random phase. The result is Gaussian, stationary and has whatever spectrum the amplitudes were chosen to give. Shaker controllers do essentially this, continuously updating the phases. A Monte Carlo simulation can then pass the synthetic signal through a model of the structure and count peaks or cycles directly, which is a useful check on the formulas of Chapters 4, 7 and 8.

Langevin's 1908 treatment of Brownian motion, which Lemons reprints in translation, used the same idea from the other direction: a particle pushed by a rapidly fluctuating random force whose individual pushes cannot be predicted, but whose statistical character, its mean square, can. A structure on a vibrating frame is in the same position. The engineer cannot know the next push, only its spectrum, and every prediction in this book is a prediction about statistics, not about individual cycles.

## The error: a random level read as a peak

This is an illustration. An early version of CB-7's mounting was designed by a supplier who read the specification's "2.55 g" as the maximum acceleration. The four mounting bolts and their brackets were sized for the enclosure's 18 kg weight times 2.55 g in each direction, a force of 18 × 9.807 × 2.55 = 450 N, shared between four mounts, with a modest safety factor.

The engineer reviewing the design read the specification properly: 2.55 g RMS, Gaussian, broadband. The input reaches 3σ, 7.66 g, routinely; and the enclosure, if it has a resonance in the band, will respond with a larger RMS than the input at that frequency, as Chapter 4 shows. A static check at 2.55 g covered less than the 1σ level of a load that the parts would see millions of times. The bolts, at the load they were sized for, would have been working well beyond it for a few per cent of the time, and Chapter 8 shows that it is those excursions that cause fatigue.

The design was sent back with three requests: state whether each load is RMS or peak, check strength at no less than the 3σ response of the mounted enclosure, and check fatigue under the random load over the service life. The supplier's revised design used the isolators of Chapter 5, which changed the problem altogether.

## Exercise: levels for a lighter profile

A second plant, for sand rather than rock, has a specification of 1.6 g RMS, Gaussian. Find the 1σ, 2σ and 3σ levels, the peak of a sine with the same RMS, and the share of time the random signal spends beyond that sine peak.

**Worked answer.** This is an illustration. The levels are **1.6 g**, **3.2 g** and **4.8 g**. A sine at 1.6 g RMS peaks at √2 × 1.6 = **2.26 g**. The sine peak is √2 = 1.414 standard deviations, and the share of time a Gaussian signal spends beyond ±1.414σ is 2 × Φ(−1.414) = 2 × 0.0786 = **15.7%**. For about a sixth of the time, the random signal exceeds anything the sine of the same RMS ever reaches, which is why the two cannot be treated as equivalent.
