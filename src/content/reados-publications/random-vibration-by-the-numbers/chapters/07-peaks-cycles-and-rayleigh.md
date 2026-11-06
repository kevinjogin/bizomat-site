---
book: random-vibration-by-the-numbers
chapterSlug: peaks-cycles-and-the-rayleigh-distribution
order: 7
title: "Peaks, cycles and the Rayleigh distribution"
description: "How often a resonant response reaches each level: zero-crossing rate, the Rayleigh distribution of peaks, the largest peak to expect in a given time, and the three-band approximation."
draft: false
---

Chapter 1 described how much of the time a random signal spends beyond each level. Two other questions matter more for equipment: how many times per second the response swings through a full cycle, and how high each swing's peak reaches. A part fails in fatigue according to the number and size of its stress cycles, and a relay chatters or a sensor saturates each time a peak exceeds its threshold. For the narrowband response of a resonant part, both questions have clean answers, worked out by S. O. Rice at Bell Laboratories in the 1940s: the response crosses zero at about its natural frequency, and its peaks follow the Rayleigh distribution.

This chapter applies those results to the sensor bracket's 7.52 g RMS response. It counts the peaks that reach each level per hour and over the plant's life, estimates the largest peak to expect, compares the Rayleigh distribution with the three-band approximation used in fatigue work, and checks the formulas against a simulation. It ends with a relay judged safe at 3σ that chattered seventeen hundred times an hour.

## A narrowband response

The input on the screen frame is broadband: energy spread from 5 to 500 Hz. The bracket's response is not. Chapter 4 showed that almost all of its mean square lies in a narrow band around its 120 Hz resonance. A narrowband random signal looks like a sine wave at the resonant frequency whose amplitude drifts slowly up and down at random. Each cycle has one positive peak and one negative trough, and the cycles come at very nearly the natural frequency.

Rice's formula gives the expected rate of upward zero crossings of a Gaussian process from its spectrum; for a narrowband response it is essentially the natural frequency. The bracket's response therefore crosses zero upwards about 120 times a second, 432,000 times an hour, and each crossing is followed by one peak.

## The Rayleigh distribution of peaks

For a narrowband Gaussian process, the heights of the peaks follow the Rayleigh distribution, whose tail has a simple form: the chance that a peak exceeds a level a is exp(−a² ÷ 2σ²), where σ is the RMS of the response. Lemons and other texts on random processes derive it from the joint distribution of a Gaussian signal and its rate of change.

```figure
type: compare
title: Peaks of the sensor bracket's response by level
cols: Acceleration | Share of peaks above | Peaks above, per hour | Peaks above, per 2,000-hour year
rowhead: Level
caption: This is an illustration. Response 7.52 g RMS at 120 Hz, 432,000 peaks an hour. The Rayleigh tail falls much faster than any intuition built on sine waves suggests, but so many cycles accumulate that even 5σ is reached a few times an hour.
- 1σ | 7.5 g | 60.7% | 262,000 | 524 million
- 2σ | 15.0 g | 13.5% | 58,500 | 117 million
- * 3σ | 22.6 g | 1.11% | 4,800 | 9.6 million
- 4σ | 30.1 g | 0.034% | 145 | 290,000
- 5σ | 37.6 g | 0.00037% | 1.6 | 3,200
```

The table is worth reading twice. A peak above 3σ is a one-in-ninety event among peaks, rare enough to call "the design load" in casual speech, yet the bracket reaches it 4,800 times every hour. Any threshold set at 3σ will be crossed routinely in service.

## Waiting for a rare peak

High peaks are rare enough, and independent enough of one another, that their arrivals behave like a Poisson process: the number in a given time follows the Poisson distribution, and the waiting time between them is exponential. That makes simple questions easy to answer. The bracket exceeds 4σ, 30 g, about 145 times an hour, so on average every 25 seconds; the chance of going a whole minute without one is exp(−145 ÷ 60) = 8.9%. It exceeds 5σ, 37.6 g, about 1.6 times an hour, so the chance of an hour passing without one is exp(−1.6) = 20%.

These figures guide testing as well as design. A shaker test of the bracket lasting ten minutes at the specification level would be expected to produce about 24 peaks above 4σ and a quarter of a peak above 5σ: enough to reveal a weakness that fails at 4σ, but quite likely to miss one that fails only at 5σ. Chapter 9 returns to what a short test can and cannot show.

## Note the difference from Chapter 1

Chapter 1 said a Gaussian signal spends 0.27% of its time beyond ±3σ. This chapter says 1.11% of the peaks of a narrowband response exceed +3σ. Both are right; they describe different things. The first counts time, both signs, for any Gaussian signal. The second counts peaks, one sign, for a signal that oscillates at one frequency, where each excursion beyond 3σ is a peak near the top of a cycle. Confusing the two understates how often a resonant part's peaks reach a high level by about a factor of four.

## The largest peak to expect

In a long record the largest peak grows, slowly, with the number of cycles. For a narrowband Gaussian response with N cycles, the expected largest peak is roughly σ√(2 ln N). For the bracket, an hour's 432,000 cycles give about 5.1σ, 38 g; a sixteen-hour working day about 5.6σ; and the plant's 20,000 operating hours, 8.6 × 10⁹ cycles, about 6.8σ, 51 g.

```figure
type: bars
title: Expected largest peak of the bracket's response, in multiples of σ
max: 7
caption: This is an illustration, from σ√(2 ln N) with N cycles at 120 Hz. The largest peak grows only with the square root of the logarithm of time: from one hour to ten years it rises by a third.
- One hour | 5.09
- One working day | 5.61
- * Ten years of service | 6.76
```

This is the number that matters for anything that fails once: a brittle part that cracks the first time its strength is exceeded, a clearance that must never be closed, a sensor that must never saturate. A design check at 3σ covers only the routine peaks; a check against single-event failure must allow for the largest peak in the relevant time, and for the vibration being somewhat spikier than Gaussian, as Chapter 3 found for the screen frame.

## The three-band approximation

Fatigue work needs the whole distribution of cycles, not just the extremes, and a widely used shortcut, set out in Steinberg's text, replaces the continuous distribution by three bands. It assumes that 68.3% of the cycles are at 1σ, 27.1% at 2σ and 4.33% at 3σ, and none above. The percentages are the shares of a Gaussian signal's time within 1σ, between 1σ and 2σ, and between 2σ and 3σ, used as a convenient model of the cycle amplitudes.

```figure
type: compare
title: Share of peaks by band, Rayleigh against the three-band approximation
cols: Rayleigh distribution of peaks | Three-band approximation, cycles assigned to
rowhead: Band
caption: The three-band method puts more cycles at the low levels and none above 3σ; the Rayleigh distribution has a tail beyond 3σ that carries much of the fatigue damage in a steel part. Chapter 8 compares their damage.
- Up to 1σ | 39.3% | 68.3% at 1σ
- 1σ to 2σ | 47.1% | 27.1% at 2σ
- 2σ to 3σ | 12.4% | 4.33% at 3σ
- Above 3σ | 1.11% | none
```

The approximation's merit is simplicity: three stress levels and three cycle counts go straight into Miner's rule, with an S–N curve such as the BIZOMAT S–N tool provides. Its weakness is the missing tail. For a material whose S–N curve is steep, the rare high peaks do a large share of the damage, and leaving them out can make the method unconservative; in other cases the extra cycles it places at 2σ and 3σ make it conservative. Chapter 8 calculates both for the bracket.

## Checking by simulation

The formulas rest on assumptions: a Gaussian input, a single lightly damped resonance, a long stationary record. A simulation tests them cheaply. This is an illustration. A single-degree-of-freedom model of the bracket, 120 Hz with Q = 15, was driven by computer-generated white noise for about 830 seconds of simulated time. Its response crossed zero upwards 120.4 times a second, and the share of crossings followed by a peak above 3σ was 1.09%, against the Rayleigh prediction of 1.11%. The simulation also showed a few small extra peaks riding on the main cycles, about 18% more peaks than crossings, a reminder that a real response is never perfectly narrowband. Those small peaks carry little fatigue damage, which is why counting by zero crossings works.

## Broadband responses

Not every response is narrowband. A part with two or more modes inside the input band, or a heavily damped part whose resonance is wide, responds with a mixture of frequencies, and its record has many more peaks than zero crossings: small peaks riding on larger cycles, and some peaks below zero. The ratio of zero crossings to peaks, the irregularity factor, is close to one for a narrowband response and falls towards zero for a very broadband one. When it is well below one, the Rayleigh distribution no longer describes the peaks well, and counting each peak as a full cycle would overstate the fatigue damage.

Two approaches handle broadband responses. One counts cycles directly from a time history, measured or simulated, by the rainflow method, which pairs each peak with the trough that closes its cycle; ASTM E1049 sets out standard cycle-counting practices, including rainflow. The other estimates the distribution of rainflow cycle ranges directly from the response spectrum; the best known of these spectral methods is Dirlik's empirical formula of 1985. For the sensor bracket, a single dominant mode, the narrowband results of this chapter are adequate; for the enclosure's response, which mixes its 9 Hz suspension motion with the frame's broadband input above, a rainflow count of a simulated record would be the better basis for a fatigue check of its mounts.

## Counting cycles from a record

When a measured record of the response itself is available, from a strain gauge on the bracket, for instance, it can be rainflow-counted directly and the resulting histogram of cycle ranges compared with the Rayleigh prediction. This is an illustration. A strain gauge at the bracket's root, recorded for ten minutes during screening, gave about 72,000 cycles; their amplitudes, counted by rainflow and expressed in units of the record's own RMS, followed the Rayleigh curve closely up to about 3.5σ, with somewhat more cycles above that than the curve predicts. That agrees with the frame's kurtosis of 3.4 from Chapter 3: a little spikier than Gaussian, so the extremes come a little more often.

The direct count is the most trustworthy input to a fatigue calculation, because it carries whatever non-Gaussian character the real environment has. Its limitation is the length of the record: ten minutes cannot show what happens once a month, and the tail beyond the record's largest cycle must still be extrapolated, usually with the Rayleigh form as a guide.

## Strength checks and single events

Two kinds of check follow from this chapter, and they need different numbers. A strength check, against yield or ultimate strength, asks whether a single peak can break the part. Common practice uses the 3σ load with a factor of safety, which in effect covers peaks to several σ; this chapter's expected largest peak, about 6.8σ over the bracket's life, shows how large a factor that implicitly has to be. A threshold check, for a relay, a sensor, a clearance or anything else that misbehaves at a single exceedance, asks how often a level is crossed, and is answered directly by the Rayleigh tail and the number of cycles. Neither is a fatigue check, which needs all the cycles and their sizes, and which Chapter 8 takes up.

## The error: a relay checked at 3σ

This is an illustration. The junction box on the sensor bracket carries a small relay whose data sheet gives a vibration rating of 25 g: above that, its contacts may open momentarily. The designer compared the rating with the bracket's 3σ response, 22.6 g, found a margin, and approved the arrangement.

In service, the plant's control system logged intermittent drop-outs of the signal through the relay, hundreds an hour. The engineer did the calculation this chapter sets out. The rating, 25 g, is 3.32σ for a 7.52 g RMS response, and the chance that a peak exceeds it is exp(−3.32² ÷ 2) = 0.40%. At 432,000 peaks an hour, that is about 1,700 exceedances an hour, each a possible contact bounce.

A 3σ margin is meaningless for a single-event threshold. The relay was moved from the bracket into CB-7, on its soft mounts, where its 3σ acceleration is about 1.6 g, and a solid-state switch replaced it at the bracket end. The drop-outs stopped. The general rule from this chapter: compare a threshold with the peak distribution and the number of cycles, never with a fixed multiple of σ alone. A data sheet rating is usually for sine vibration, so a relay rated at 25 g has been tested at 25 g peaks every cycle; in random service its rating is exceeded only by the tail, but the tail is long and busy.

## Exercise: the stiffened bracket and the relay

Chapter 4's stiffened bracket has a response of 9.26 g RMS at 240 Hz. If the relay had stayed on the bracket, how often per hour would its 25 g rating be exceeded? Compare with the original bracket.

**Worked answer.** This is an illustration. The rating is 25 ÷ 9.26 = **2.70σ**, so the chance a peak exceeds it is exp(−2.70² ÷ 2) = **2.6%**. At 240 Hz there are 864,000 peaks an hour, so the rating is exceeded about **22,600 times an hour**, thirteen times as often as on the original bracket. Stiffening the bracket reduced its bending stress, as Chapter 4 showed and Chapter 8 confirms, but raised the acceleration of everything it carries and doubled the number of cycles. For the relay, stiffening would have made matters much worse; moving it to the isolated enclosure was the right answer.
