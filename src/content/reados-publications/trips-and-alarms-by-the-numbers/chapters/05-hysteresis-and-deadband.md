---
book: trips-and-alarms-by-the-numbers
chapterSlug: hysteresis-and-deadband
order: 5
title: "Hysteresis and deadband"
description: "Why an alarm chatters when a noisy signal hovers near its setpoint, how a deadband between set and clear levels stops it, how large the deadband must be, and what it cannot fix."
draft: false
---

A trip normally latches: once it acts, it stays acted until someone resets it. An alarm usually does not. It sets when the signal passes the alarm level and clears itself when the signal comes back. On a noisy signal hovering near the alarm level that is a recipe for chatter, the alarm setting and clearing many times a minute, each time demanding attention and each time filling a line of the alarm log. The standard cure is hysteresis, also called a deadband: the alarm sets at one level and clears only at another, a little further back towards normal. The same idea keeps a thermostat from switching a heater on and off every second and a level switch from starting a pump every few seconds.

This chapter calculates PAL-3's chatter, shows how a deadband reduces it and how large the deadband must be, and finds the point beyond which no deadband helps. Its error is a deadband programmed the wrong way round, which made the chatter worse.

## Why an alarm chatters

Chapter 2 found that at a mean of 3.90 bar, PT-3's raw readings lie below PAL-3's 3.6 bar setting 2.3% of the time. Rice's formula, with ν₀ = 5.22 per second and a margin of 2 standard deviations, predicts 5.22 × exp(−2) = 0.71 downward crossings per second, or about **2,540 an hour**. An alarm that sets on every downward crossing and clears on every upward one would therefore set about 2,500 times an hour. That is what PAL-3 had been doing, which is why the operators had shelved it.

The crossings do not arrive evenly. When a slow swell carries the pressure down towards 3.6 bar, the fast noise riding on it makes the signal dither across the level several times before the swell carries it away again. Each dither is a separate set and clear. A plot of the alarm's state against time shows bursts of activations clustered around each dip of the slow swell, with quiet periods between.

## The deadband

With a deadband, the alarm sets when the signal falls below the set level and clears only when it rises above a higher clear level. For PAL-3, a set level of 3.6 bar and a deadband of 0.05 bar give a clear level of 3.65 bar. A dither of a few hundredths of a bar around 3.6 bar now sets the alarm once and leaves it set; the alarm clears only when the signal makes a real return to above 3.65 bar.

```figure
type: svg
title: How a deadband stops chatter
viewbox: 0 0 640 300
alt: A noisy signal dips below a set line three times within one slow swell. Without a deadband the alarm toggles on and off at each crossing; with a deadband it sets once at the first crossing and clears only when the signal rises above the higher clear line.
caption: Without a deadband, each small dither across the set level is a new alarm. With the clear level set above the set level by more than the dither, one dip of the slow swell gives one alarm.
body:
<line class="kf-grid" x1="40" y1="110" x2="620" y2="110"/>
<line class="kf-grid" x1="40" y1="90" x2="620" y2="90"/>
<text class="kf-axt" x="616" y="126" text-anchor="end">set 3.60 bar</text>
<text class="kf-axt" x="616" y="104" text-anchor="end">clear 3.65 bar</text>
<path class="kf-ser kf-ser0" d="M40 60 L80 70 L100 64 L130 85 L150 78 L170 104 L180 98 L190 116 L200 106 L210 120 L222 104 L232 124 L246 104 L258 128 L270 104 L282 122 L296 104 L308 115 L320 96 L340 102 L360 80 L390 70 L420 76 L460 62 L500 70 L540 58 L620 66"/>
<text class="kf-axt" x="40" y="170">Without deadband</text>
<path class="kf-ser kf-ser1" d="M40 200 L190 200 L190 180 L200 180 L200 200 L210 200 L210 180 L222 180 L222 200 L232 200 L232 180 L246 180 L246 200 L258 200 L258 180 L270 180 L270 200 L282 200 L282 180 L296 180 L296 200 L308 200 L308 180 L320 180 L320 200 L620 200"/>
<text class="kf-axt" x="40" y="240">With 0.05 bar deadband</text>
<path class="kf-ser kf-ser0" d="M40 280 L190 280 L190 260 L360 260 L360 280 L620 280"/>
<text class="kf-axt" x="616" y="172" text-anchor="end">6 alarms</text>
<text class="kf-axt" x="616" y="252" text-anchor="end">1 alarm</text>
```

How wide should the deadband be? It must be wider than the dither, the excursions of the fast noise around the level, or the signal will still cross the clear level within one dip. A deadband of two to three times the standard deviation of whatever fast noise remains on the alarm's signal is a reasonable starting point. It must also be narrower than the margin between the set level and the normal mean, or the alarm will never clear: at a mean of 3.90 bar, a clear level above 3.90 bar would leave PAL-3 set most of the time even after the pressure had recovered, a standing alarm that is as useless as a chattering one.

## Deadbands on the raw signal

The engineer tried deadbands on the raw signal first, by replaying the logged noise, at a mean of 3.90 bar, through the alarm logic with different clear levels. The replay used 20 hours of noise simulated from the two-part model of Chapter 2, because a ten-minute log is too short to count anything but the commonest events.

```figure
type: compare
title: PAL-3 activations per hour at a mean of 3.90 bar
rowhead: Deadband
cols: On raw 10 ms readings | On the 0.5 s filtered signal
caption: This is an illustration. Replay of 20 hours of the noise model through the alarm logic, set level 3.6 bar. On the raw signal, no deadband narrower than the margin helps much. On the filtered signal, a 0.05 bar deadband removes the repeat activations, and what remains is about one alarm for each slow dip that reaches 3.6 bar.
- None | 2,477 | 6.5
- 0.02 bar | 2,346 | 4.9
- * 0.05 bar | 2,222 | 4.2
- 0.10 bar | 2,082 | 4.1
- 0.20 bar | 1,835 | 4.1
```

On the raw signal, even a 0.2 bar deadband, two-thirds of the way back to the mean, left more than 1,800 activations an hour. The reason is the size of the fast noise. With a standard deviation of 0.12 bar, the fast part regularly carries the signal from below 3.6 bar to above 3.8 bar and back within a fraction of a second, so even a wide deadband is crossed repeatedly in each dip. A deadband cannot be wider than about the margin to the mean, and here the margin was only two standard deviations of the raw signal. The alarm level sat inside the noise band, and no deadband could take it out.

## Deadbands on the filtered signal

On the 0.5 s filtered signal of Chapter 4, whose fast noise is reduced to a standard deviation of about 0.03 bar, the picture changes. Without a deadband the alarm set 6.5 times an hour. A 0.05 bar deadband, nearly twice the filtered fast noise, brought that down to 4.2, and wider deadbands made little further difference. Rice's formula for the filtered signal, with σ = 0.088 bar and ν₀ = 0.44 per second, predicts 0.44 × exp(−(0.3 ÷ 0.088)² ÷ 2) = 0.0013 crossings a second, or about **4.8 an hour**, close to the counts. The deadband removed the repeat crossings within each dip, and the alarms left were single responses to dips of the slow swell that genuinely reached 3.6 bar.

Those four alarms an hour were still nuisances. Each one said that a swell from the die's cooling valves had briefly pulled the pressure down to 3.6 bar, which is true but needs no action. The deadband had done its job, removing chatter, and exposed the remaining problem, which is that PAL-3 was set too close to the normal operating band for a signal that swings this much.

## When the deadband is not enough

Hysteresis cures chatter: many activations for one event. It does not cure an alarm level that the signal reaches in normal operation. For that there are only three remedies: move the level, reduce the noise on the signal the alarm uses, or require the condition to persist, which is the subject of Chapter 6. PAL-3's purpose is to warn of a slowly falling mean pressure, and a slowly falling mean does not need a fast signal to detect it. The exercise in Chapter 4 showed that a 5 s filter reduces PT-3's noise to a standard deviation of 0.049 bar, giving PAL-3 a margin of 6.1 standard deviations at 3.90 bar.

The engineer replayed the noise through a 5 s filter and the alarm logic with a 0.05 bar deadband. At a mean of 3.90 bar the alarm did not set once in 20 hours. With the mean lowered to 3.75 bar in the replay, it set about 2.6 times an hour, a genuine warning that the strainer had loaded well past its usual cleaning point. With a 10 s filter the same mean gave only 0.05 an hour, too little warning, so 5 s was kept.

```figure
type: compare
title: PAL-3 settings considered
rowhead: Alarm signal and deadband
cols: Alarms per hour at 3.90 bar | Alarms per hour at 3.75 bar | Assessment
caption: This is an illustration. Replay of the noise model through the alarm logic. The chosen setting is silent at the normal end of the strainer cycle and alarms reliably once the mean has fallen well towards the trip.
- Raw, no deadband | 2,477 | not counted | Chatters; had been shelved
- 0.5 s filter, 0.05 bar deadband | 4.2 | not counted | No chatter, but alarms on normal swells
- * 5 s filter, 0.05 bar deadband | 0 | 2.6 | Silent in normal running; warns of a loaded strainer
- 10 s filter, 0.05 bar deadband | 0 | 0.05 | Too slow to warn
```

The alarm now uses a separate filtered tag from the trip, with its own 5 s time constant. That is acceptable because the alarm does not protect the die from a pump stop, which is the trip's job. The pump stop still raises a separate alarm through the trip itself.

### Off-delays: the other cure for chatter

A second way to stop chatter is an off-delay: once set, the alarm stays set until the condition has been clear continuously for a stated time, say 5 s. A deadband works in the signal's units and an off-delay in time, and the two are often combined. The off-delay suits signals whose dither is fast but irregular in size, where no single deadband is wide enough without being too wide; the deadband suits signals that move slowly but noisily, where a delay would hold the alarm long after a genuine recovery. Both reduce the number of activations without hiding the first one, so neither delays the warning. That distinguishes them from the on-delay of Chapter 6, which holds back the first activation until the condition has persisted, and so trades warning time for fewer false activations.

The alarm management standards named in the references discuss deadbands, on-delays and off-delays as standard tools and suggest typical starting values by type of signal. Those values are starting points only. The arithmetic in this chapter, using the signal's own measured noise, is what shows whether a particular value will work on a particular signal.

### Deadbands on trips

A latching trip does not chatter, because it stays acted until reset. A deadband still has a use on a trip, as a **reset permissive**: the reset button is ignored until the signal has returned above a level clear of the trip setting. At Plant C, PSLL-3 can be reset only when the filtered pressure is above 3.4 bar. Without the permissive, an operator pressing reset while the pressure was still hovering near 3.2 bar would see the cell trip again within seconds, and might be tempted to press reset faster than the pressure could recover.

### On-off control

The same arithmetic sizes the switching band of any on-off control on a noisy signal: a sump pump that starts at one level and stops at a lower one, a compressor that loads and unloads between two pressures, a heater with a thermostat. Too narrow a band and the noise switches the equipment on and off far more often than the process needs, wearing contactors and motors; the motor supplier's limit on starts per hour sets how narrow the band may be.

## The error: a deadband on the wrong side

The programmer added the deadband to PAL-3's logic with a set level of 3.6 bar and a clear level of 3.6 − 0.05 = 3.55 bar, by analogy with a high alarm, for which the clear level lies below the set level. For a low alarm the clear level must lie above the set level, towards normal. With the clear level below the set level, the alarm could clear while the pressure was still below 3.6 bar and set again as soon as it fell, so the deadband added nothing; worse, a pressure sitting between 3.55 and 3.6 bar was being reported as normal and then alarming again on the next small dip.

The engineer found it during the loop check, by injecting a slow ramp with the calibrator from 3.8 bar down to 3.5 bar and back up while watching the alarm. The alarm set correctly at 3.60 bar on the way down, but on the way up it should have stayed set until 3.65 bar, and the HMI showed it had already cleared when the ramp passed 3.56 bar, while the pressure was still below the alarm level. A ramp test in both directions is the only reliable way to check a deadband, because a step test passes through both levels at once and cannot show which one acts.

```figure
type: checklist
title: Setting an alarm deadband
caption: The deadband sits between the set level and the normal mean; it must be wider than the remaining fast noise and narrower than the margin to normal.
- Put the clear level on the normal side | Above the set level for a low alarm, below it for a high one.
- Make it wider than the dither | Two to three times the standard deviation of the fast noise on the alarm's signal.
- Keep it inside the margin | The clear level must lie well short of the normal mean, or the alarm stands.
- Ramp-test both directions | Watch the set and clear levels on the way out and on the way back.
- ? Is the alarm still set inside the noise band | If so, filter its signal or move it; a deadband will not help.
```

## How this applies to a small Australian business

Look at the alarm log for alarms that set and clear many times within a minute. Those are chattering, and a deadband of two or three times the fast noise will usually cure them. If an alarm still sets several times an hour with a deadband, it is set too close to normal for the signal it uses: give it a more heavily filtered signal if it is meant to warn of something slow, or move it. An alarm that operators have shelved is not protecting anything, and putting it back into service is often the most valuable safety improvement a small plant can make.

## Exercise: the reset permissive

PSLL-3 trips on the 0.5 s filtered signal, whose noise has a standard deviation of 0.088 bar and a mean-crossing rate of 0.44 per second. After a strainer has been cleaned, the mean returns to 4.20 bar. (a) The reset permissive is set at 3.4 bar. What is its margin in standard deviations at 4.20 bar? (b) If the operator presses reset after a genuine low-flow trip, when the strainer has been cleaned and the mean is back to 4.20 bar, how often would the filtered signal fall back below 3.4 bar by noise alone, per shift? (c) Why is the permissive set below the alarm level rather than at it?

**Worked answer.** (a) k = (4.20 − 3.4) ÷ 0.088 = **9.1**. (b) Rice's formula gives 0.44 × exp(−9.1² ÷ 2) = 0.44 × exp(−41.3) ≈ 5 × 10⁻¹⁹ per second, or about 10⁻¹⁴ per shift: **effectively never**. The permissive will not block a legitimate reset with the pressure restored. (c) The permissive only needs to show that the pressure has recovered clear of the trip, not that it is back to normal. Setting it at the alarm level, 3.6 bar, on a 0.5 s signal, would make resets after a partial recovery wait for noise to settle, and would not add protection, because the trip itself remains armed at 3.2 bar once reset.
