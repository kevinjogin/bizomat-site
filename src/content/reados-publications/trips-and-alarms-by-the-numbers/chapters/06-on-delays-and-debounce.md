---
book: trips-and-alarms-by-the-numbers
chapterSlug: on-delays-and-debounce
order: 6
title: "On-delays and debounce"
description: "Requiring a condition to persist before a trip acts: how long noise excursions last, what an on-delay removes and costs, why it should not follow a filter, and when long delays weaken protection."
draft: false
---

A filter asks whether the recent average of a signal is beyond the threshold. An on-delay asks a different question: has the signal stayed beyond the threshold, continuously, for a stated time? If it has, the trip acts; if it returns even once before the time is up, the timer resets and nothing happens. The idea is the same as debouncing a push-button, where the contacts bounce for a few milliseconds before settling, and it rests on the observation from Chapter 3 that noise excursions far into the tail are very brief. A genuine fault stays; noise passes through.

This chapter measures how long PT-3's excursions last, calculates what on-delays of different lengths remove, compares them with the filter of Chapter 4, and finds two traps: an on-delay placed after a filter, and an on-delay long enough to weaken the trip's protection against a slow fault. Its error is a debounce counter that never reset, which produced a trip with no excursion behind it.

## How long excursions last

Chapter 3 derived the mean duration of an excursion beyond a threshold as the fraction of time spent beyond it divided by the rate of entering it. For PT-3's raw readings at a mean of 3.90 bar that is 0.016 s, and at 3.70 bar about 0.02 s. The averages hide a spread, so the engineer measured the distribution directly by replaying 20 hours of the noise model at a mean of 3.70 bar, where excursions below 3.2 bar are common enough to count.

```figure
type: stats
title: Excursions below 3.2 bar, raw readings, mean 3.70 bar
caption: This is an illustration. Replay of 20 hours of PT-3's noise model, sampled every 10 ms. Excursions this far into the tail are almost all one to five readings long; even the longest lasted a sixth of a second.
- 1,424 | excursions in 20 hours
- 0.02 s | median duration, two readings
- 0.05 s | 90th percentile
- 0.16 s | longest
```

### Why excursions are so short

The brevity has a simple geometric cause. To reach a level far out in its tail, the signal must be near the bottom of one of its swings, and near the bottom a smooth signal looks like a parabola. The further down the threshold, the closer to the very bottom the signal must be to pass it, and the shorter the stretch of parabola below the line. For a single smooth Gaussian noise, Rice's arithmetic gives a mean duration of roughly 1 ÷ (2.5 × k × ν₀) at large margins, so durations shrink in proportion to 1 ÷ k. At k = 4.67 and ν₀ = 5.22 per second that is 0.016 s, matching Chapter 3. The same arithmetic predicts that durations at high levels scatter about their mean like a Rayleigh distribution, which makes excursions of three or four times the mean length vanishingly rare.

The replay disagreed in an instructive way. The Rayleigh shape predicts essentially no excursions longer than 0.1 s at a mean of 3.70 bar, yet the replay found four in 1,424. Each of them occurred at the bottom of a slow swell from the cooling valves, where the slow part had carried the pressure well down and the fast noise only had to add a little. A single-noise theory does not see them, because it has no slow component. This is why the remedies in this book are checked by replaying the measured noise model, not only by formula: the formula describes the fast noise well and the slow noise poorly, and the slow noise sets what remains after any short delay.

A genuine pump stop, by contrast, takes the pressure below 3.2 bar and keeps it there. So an on-delay of a tenth of a second or so should ignore nearly all of the noise without seriously delaying the response to the pump stop. The replay confirmed it.

```figure
type: compare
title: Nuisance trips per shift on raw readings, by on-delay
rowhead: On-delay
cols: Mean 3.90 bar | Mean 3.80 bar | Mean 3.70 bar
caption: This is an illustration. Replay of 20 hours, 2.5 shifts, of the noise model; counts converted to trips per shift. Each additional 0.03 s of delay removes most of the remaining trips, because the excursions are so short.
- None | 4.4 | 48 | 570
- 0.02 s | 0.4 | 12 | 184
- 0.05 s | 0 | 0.8 | 28
- 0.10 s | 0 | 0 | 1.6
- * 0.30 s | 0 | 0 | 0
```

An on-delay of 0.1 s reduced the nuisance trips at 3.70 bar from 570 a shift to under two; at 3.90 bar even 0.05 s removed them entirely in the replay. The response to a pump stop rises by the length of the delay, so a 0.3 s on-delay raises the pump-stop response from 0.13 s to about 0.43 s, similar to the 0.46 s of the 0.5 s filter in Chapter 4.

### Where the remaining excursions come from

At lower mean pressures some trips survive even a 0.3 s delay. The replay at 3.55 bar gave about 0.8 trips a shift with a 0.3 s on-delay. These are not fast excursions but the slow swell from the die's cooling valves, which, once the mean is low enough, carries the pressure below 3.2 bar for a large part of a second at a time. An on-delay removes fast noise; it does nothing for slow noise unless it is as long as the slow excursions themselves. That is the same limit the filter met in Chapter 4, and for the same reason.

## On-delay or filter?

The engineer replayed the noise through four candidate rules and compared them on the three things that matter: nuisance trips at a low mean pressure, the response to a pump stop, and the response to a slow loss of flow.

```figure
type: compare
title: Candidate decision rules for PSLL-3
rowhead: Rule
cols: Nuisance trips per shift at 3.55 bar | Pump stop to trip, from 4.20 bar | Mean pressure when a slow fall trips
caption: This is an illustration. Replay of the noise model. The slow-fault column is the median mean pressure at which the trip acted when the mean was lowered steadily by 0.01 bar a minute; a trip acting near or above 3.2 bar is doing its job, one acting below it is late.
- 0.5 s filter | 7.6 | 0.46 s | 3.46 bar
- 0.3 s on-delay on raw readings | 0.8 | 0.43 s | 3.40 bar
- 0.5 s filter then 0.3 s on-delay | 2.0 | 0.76 s | 3.41 bar
- 1.0 s on-delay on raw readings | 0 | 1.13 s | 3.24 bar
- 2.0 s on-delay on raw readings | 0 | 2.13 s | 3.16 bar
```

Three findings come out of the table.

**An on-delay on raw readings beats the filter on nuisance trips at the same response time.** The 0.3 s delay and the 0.5 s filter both respond to a pump stop in under half a second, but the delay allows about a tenth as many nuisance trips at 3.55 bar. The delay exploits the brevity of fast excursions more completely than an average can.

**A filter followed by an on-delay is worse than the delay alone.** That surprises most people, who expect two remedies to be better than one. The filter smooths the fast noise, but in doing so it stretches every excursion: a sharp dip of two readings becomes a gentle sag lasting a sizeable fraction of the time constant. The delay that follows then sees longer excursions and passes more of them. Meanwhile the response to a pump stop pays for both, 0.76 s. If an on-delay is used, it should act on readings that have not been smoothed, or only lightly.

**Long on-delays on raw readings weaken the slow-fault protection.** As the mean falls slowly towards 3.2 bar, the raw signal crosses the threshold many times a second, and to stay below it continuously for a whole second the mean must fall well past it. With a 1 s delay the trip acted, in the median, with the mean at 3.24 bar, and in some runs below 3.2 bar; with a 2 s delay the median was 3.16 bar, below the die's minimum flow. A filtered signal does not have this problem, because near the threshold it is smooth and stays below once its mean is below.

### The choice at Plant C

The 0.3 s on-delay on raw readings looks best on nuisance trips. The engineer nevertheless kept the 0.5 s filter of Chapter 4 for PSLL-3, for two reasons. First, both rules already give no nuisance trips across the strainer's normal operating band, from 4.20 bar down to about 3.6 bar, so the delay's advantage at 3.55 bar would only matter if the strainer were neglected, and Chapter 7 prevents that. Second, the filter behaves more predictably for the slow fault, the trip's second duty: its trip point depends little on the exact noise, while an on-delay's trip point slides lower as the noise grows. A trip that should act at 3.2 bar, and would act at 3.0 bar if the noise doubled, is harder to justify in the trip register. The on-delay remains a good tool for signals with a fast-only duty, and for the uses below.

## Debounce for digital inputs

On-delays are essential on digital inputs from contacts. A mechanical pressure switch, flow switch or limit switch does not change state cleanly: its contacts bounce for a few milliseconds, and in a plant with vibration they can chatter for longer. A PLC scanning every 10 ms may read several transitions for one real change. Plant C's pump-running contact on P-3's starter, which also feeds the trip logic, has a 50 ms debounce for that reason. The arithmetic of this chapter applies unchanged: measure how long the bounces last, set the debounce comfortably longer, and add the debounce time to the response budget.

### Variations on the timer

Two common variations relax the requirement that the condition hold continuously.

- **n out of m readings.** The trip acts when at least n of the last m readings are beyond the threshold, for example 25 of the last 30. One reading above the threshold no longer resets everything, so a genuine fault with some noise riding on it is caught more reliably, at the cost of a little more susceptibility to clustered noise.
- **A counter with leak.** A counter rises by one for each reading beyond the threshold and falls by one for each reading inside it, never below zero, and the trip acts when it reaches a set count. It behaves between an on-delay and a filter, and the leak is essential, as the error below shows.

### Testing an on-delay

An on-delay needs two tests, not one. The first is the usual step: force the input from normal to well beyond the threshold and time the trip, which should equal the delay plus the fixed stages. The second is a pulse shorter than the delay: force the input beyond the threshold for, say, two-thirds of the delay and then back, and confirm that nothing happens; then repeat the short pulse several times in quick succession and confirm that nothing happens then either. The first test proves the delay is not too long. The second proves the timer actually resets, which is the property that fails most often in practice, as the next section shows. A calibrator with a programmable pulse output, or a test routine in the PLC that overrides the input for a set number of scans, makes the second test easy.

## The error: the counter that never reset

Before the investigation, a previous programmer had added a debounce to PSLL-3 in an attempt to cure the nuisance trips: a counter that rose by one each scan the pressure was below 3.2 bar, with the trip acting when the counter reached 30, meant as a 0.3 s on-delay. The counter was cleared only when the trip was reset. There was no decrement when the pressure was above the threshold.

At a mean of 3.90 bar, Chapter 2 found about 4.4 readings a shift below 3.2 bar, almost all in excursions of one or two readings. A counter that keeps every one of them reaches 30 after about seven shifts of running, and then trips the cell on a single reading below 3.2 bar, or on none at all if the 30th reading had arrived a moment earlier. That is exactly what the trip log showed: alongside the frequent ordinary nuisance trips, there were occasional trips at moments when the full-rate log, running for the investigation, showed no excursion longer than two readings. The engineer found the missing decrement by reading the code after the log failed to explain a trip.

The general rule is that any debounce must forget. A timer must reset when the condition clears; a counter must leak; an n-out-of-m window must slide. A memory that only accumulates turns rare, harmless excursions into a certainty of tripping eventually, with a period that depends on the noise and on how long it has been since the last reset.

```figure
type: checklist
title: Using on-delays on a trip
caption: An on-delay is the most effective remedy for fast noise on a fast trip, provided it acts on unsmoothed readings and stays short.
- Measure excursion durations first | From a replay or a long full-rate log, at a mean where excursions are common.
- Set the delay well beyond the longest noise excursion | And well short of the response allowance.
- Put the delay on raw or lightly filtered readings | A filter in front stretches excursions and defeats the delay.
- Make every debounce forget | Timers reset, counters leak, windows slide.
- Check the slow-fault duty | Ramp the mean slowly and confirm where the trip acts.
- x Use a long delay on a noisy raw signal | It moves a slow-fault trip below its setting.
```

## How this applies to a small Australian business

For trips with a fast-fault duty only, such as overspeed or a guard interlock confirmation, a short on-delay on unsmoothed readings is often the best cure for nuisance trips. Measure how long the noise excursions last and set the delay a few times longer. For trips that must also catch a slow drift to the setting, prefer a filter, or keep any on-delay short and check where the trip acts on a slow ramp. Read the debounce code on any trip that misbehaves; an accumulating counter is a common and well-hidden fault.

## Exercise: debouncing the flow switch

A die-cooling circuit has a mechanical flow switch whose contacts, when its paddle is lifted, bounce for up to 15 ms, and in vibration occasionally drop out for up to 40 ms. The PLC scans every 10 ms. The circuit's trip allowance is 3 s, of which 0.5 s is already used by other stages. (a) What is the shortest on-delay that ignores both effects with a margin of at least two scans? (b) How much of the allowance remains? (c) Why is a counter that rises when the switch is open and resets when it closes acceptable here, when the non-resetting counter above was not?

**Worked answer.** (a) The longest dropout is 40 ms, which spans at most five scans of 10 ms; two scans of margin make **70 ms**. (b) 3 − 0.5 − 0.07 = **2.43 s** remains. (c) A counter that resets to zero whenever the switch closes is an on-delay: it measures how long the switch has been continuously open. It forgets every dropout as soon as the contact recloses, so brief dropouts never accumulate. The faulty counter on PSLL-3 accumulated excursions across hours, which turned harmless events into an inevitable trip.
