---
book: trips-and-alarms-by-the-numbers
chapterSlug: drift-towards-the-trip
order: 7
title: "Drift towards the trip"
description: "How a drifting mean turns into nuisance trips, the expected trips over a fouling cycle, early detection with hourly means and a CUSUM, and replacing the warning the nuisance trips gave."
draft: false
---

Noise sets how often a signal reaches a threshold from a given mean. Drift moves the mean. At Plant C the noise on PT-3 has hardly changed since the finer strainer mesh was fitted; what changed is that the mean now falls steadily between cleans, and every chapter so far has shown how sharply the trip rate responds to a small change in the mean. Filters, deadbands and delays change how the trip responds to noise. Only maintenance changes where the mean sits, and maintenance needs to know when to act.

This chapter models the drift, adds up the expected trips over a fouling cycle, works out how early the drift can be detected from hourly mean pressures, and sets a cleaning trigger. Its error is a quiet loss of information: once the filter cured the nuisance trips, nothing was left to tell maintenance that the strainer needed cleaning.

## The drift

Plant C's hourly mean pressures since the finer mesh was fitted show the same pattern after every clean. The mean starts at about 4.20 bar and falls almost linearly, by about **0.025 bar per production day** of two shifts, roughly 0.0016 bar an hour. Over a fortnight of ten production days it falls to about 3.95 bar; over three weeks to about 3.83 bar. The old coarse mesh had loaded about a third as fast, and the plant's routine of cleaning the strainer every three weeks had been set for it.

```figure
type: compare
title: Mean pressure and raw-signal nuisance trips through a fouling cycle
rowhead: Production day after a clean
cols: Mean pressure | Trips that day | Cumulative trips | Chance of no trip yet
caption: This is an illustration. Rice's formula with σ = 0.150 bar and ν₀ = 5.22 per second, for the raw 10 ms readings, two shifts a day, the mean falling 0.025 bar a day. The first nuisance trip is most likely on day 10 or 11; after that they multiply.
- 2 | 4.15 bar | 0.0004 | 0.0005 | 100%
- 4 | 4.10 bar | 0.003 | 0.004 | 99.6%
- 6 | 4.05 bar | 0.020 | 0.03 | 97%
- 8 | 4.00 bar | 0.13 | 0.22 | 81%
- * 10 | 3.95 bar | 0.75 | 1.3 | 28%
- 12 | 3.90 bar | 3.9 | 6.9 | 0.1%
- 14 | 3.85 bar | 18 | 33 | 0%
- 15 | 3.83 bar | 36 | 70 | 0%
```

The table explains why the trips seemed to appear from nowhere about ten days after each clean, and why, by the end of a three-week cycle, the cell was tripping several times a shift. More than half of all the trips in a three-week cycle would fall in its last two days. The cumulative count also gives the distribution of the time to the first trip: the chance that the cell has not yet tripped falls from 81% at the end of day 8 to 28% at day 10 and to almost nothing by day 12. Because the rate grows so steeply, the first trip arrives within a fairly narrow window, and that window is set almost entirely by the drift rate and the margin, not by chance.

### The first trip as a first-passage time

The day of the first nuisance trip is what physicists call a first-passage time: the time at which a randomly moving quantity first reaches a boundary. With a drifting mean, it has a simple structure. The chance of no trip by time t is exp(−N(t)), where N(t) is the expected number of trips up to t, the cumulative column of the table. The median time to the first trip is when N(t) reaches ln 2 = 0.69, which here falls in the first shift of day 10. Because N(t) grows roughly exponentially, the spread of first-trip times is narrow: the first trip comes after day 8 about four times in five and before the end of day 11 about nineteen times in twenty. Slowing the drift stretches the whole pattern in time; doubling the noise's standard deviation, by contrast, would move it more than a week earlier. The same reasoning, applied to a quantity that drifts towards a limit with noise on top, appears in many engineering forms: a bearing temperature creeping up as grease degrades, a filter differential pressure rising, a tool wearing towards its size limit.

### Two levers, one target

The two remedies for nuisance trips work on different parts of the same calculation. A better decision rule lowers the mean pressure at which trips begin: with the 0.5 s filter of Chapter 4, Rice's formula puts the onset at about 3.6 bar, which the drift would not reach until day 24. A cleaning trigger keeps the mean above some level. The filter removes the nuisance trips; it does nothing about the strainer, which still loads at the same rate. Below about 3.75 bar the alarm of Chapter 5 begins to sound, the die is being cooled less, and the pump's suction pressure is falling towards the point where its supplier would want it checked for cavitation. The strainer still needs cleaning on time.

```figure
type: compare
title: Expected nuisance trips per fouling cycle, by policy
rowhead: Policy
cols: Clean on | Raw-signal trip | 0.5 s filtered trip
caption: This is an illustration. Expected trips from Rice's formula summed over each cycle. Cleaning on the advisory and filtering the trip each cut the trips sharply; together they remove them, and the strainer is cleaned about every ten production days.
- Fixed three-week schedule | Day 15 | 70 | 0
- Clean when the cell trips | About day 10 to 11 | 1 to 3 | not applicable
- * Advisory at 3.95 bar | Day 10 | 1.3 | 0
```

The comparison shows why both levers are needed. The filter on its own would let the strainer run for weeks without nuisance trips, which hides the fouling until the alarm sounds. The advisory on its own would leave about one nuisance trip in every cycle, since the raw trip begins to act on noise around day 10. With both, the trips stop and the strainer is cleaned before the die's cooling suffers.

## Estimating the fouling rate

The drift rate itself is worth estimating every cycle, because a change in it is often the first sign of something new: a torn mesh, a dirtier water source, a corroding tank. A straight line fitted by least squares to the hourly means gives the rate as its slope. Its precision depends on the scatter and on how many hours are fitted. For n equally spaced hourly means with scatter σ, the standard error of the slope is σ ÷ √(n(n² − 1) ÷ 12). After one production day of 16 hours, that is 0.010 ÷ √340 = 0.00054 bar an hour, against a true rate of 0.0016 bar an hour: the slope is known to within about a third. After two days, 32 hours, the standard error falls to 0.010 ÷ √2,728 = 0.00019 bar an hour, about 12% of the rate. Two days into each cycle, the engineer's spreadsheet therefore predicts the day on which the advisory will fire to within about a day, and the cleaning can be planned around production rather than squeezed in when the advisory arrives.

## Detecting the drift early

The drift is far too slow to see in the raw readings, where it amounts to less than a hundredth of the noise's standard deviation each hour. It becomes visible in averages. The PLC already calculates PT-3's mean for each production hour. Over many weeks, the hour-to-hour scatter of those means about the fouling trend, which includes small changes from product and die changes as well as the leftover noise, has a standard deviation of about **0.010 bar**. At 0.0016 bar an hour, the mean falls by one standard deviation of the hourly scatter in about six hours.

### A simple threshold on the hourly mean

The simplest early warning is an advisory on the hourly mean: when it falls below a set level, maintenance is told to clean the strainer at the next scheduled break. For the advisory to be dependable, the hourly scatter must not trigger it before the mean is really there, so the level is set a few hourly standard deviations below the clean value. An advisory at **3.95 bar** sets 25 standard deviations of hourly scatter below the clean-strainer mean; nothing but real fouling will reach it. It typically fires on day 10, by which time the raw trip would have given about one nuisance trip, and the filtered trip none.

### A CUSUM for the first sign of fouling

A threshold on the hourly mean says when the strainer needs cleaning. It says nothing until then. Sometimes it is useful to know sooner that fouling has begun, for instance after a clean, to confirm that the fouling rate is normal, or after the cooling tank has been topped up from a different source. A CUSUM on the hourly means, as described in [Control Charts by the Numbers](/reados/publications/control-charts-by-the-numbers/cusum-a-random-walk-that-remembers/), accumulates small departures below a target and signals when they add up, which makes it much quicker than a single-reading threshold at detecting a slow drift.

The [CUSUM chart tool](/tools/cusum-chart-check/) calculates the tabular upper and lower cumulative sums for up to twenty readings in time order, from a target mean, the standard deviation of the plotted values and the shift to be detected, and reports the first reading at which either sum exceeds the decision interval. It is designed for detecting shifts in a process mean; a steady drift is a shift that keeps growing, and the CUSUM detects it once the accumulated departure exceeds the decision interval.

The engineer entered the first twenty hourly means after a strainer clean, with a target of 4.20 bar, a standard deviation of 0.010 bar, a shift to detect of 1 standard deviation (a reference value of 0.005 bar) and a decision interval of 0.04 bar.

```figure
type: compare
title: CUSUM of hourly mean pressure after a strainer clean
rowhead: Production hour
cols: Hourly mean, bar | Lower cumulative sum, bar
caption: This is an illustration. Target 4.20 bar, reference value 0.005 bar, decision interval 0.04 bar. The lower sum passes the decision interval at hour 10, when the trend had fallen by only 0.016 bar; no single hourly mean was below 4.17 bar until hour 17.
- 1 | 4.208 | 0.000
- 4 | 4.200 | 0.000
- 7 | 4.190 | 0.011
- 8 | 4.183 | 0.023
- 9 | 4.192 | 0.026
- * 10 | 4.172 | 0.049
- 14 | 4.176 | 0.095
- 17 | 4.161 | 0.163
- 20 | 4.171 | 0.214
```

The CUSUM signalled a downward shift at hour 10, when the fouling had lowered the mean by about 0.016 bar, under two standard deviations of the hourly scatter. A threshold three standard deviations below target, at 4.17 bar, did not trip until hour 17. The tool's output also reports the hour at which the lower sum last left zero, hour 5 here, as the probable start of the change. For Plant C that is useful as a check of each cycle: a signal around hour 10 means normal fouling, a signal at hour 3 means something has brought a load of debris and the strainer needs looking at sooner. The tool's own check is worth repeating here: the decision interval and the shift to detect should be chosen for an acceptable false alarm rate on in-control data, and a CUSUM set this tightly will occasionally signal on hour-to-hour variation alone, so it suits an advisory, not a trip.

```figure
type: timeline
title: Warnings through a fouling cycle, with the new settings
caption: This is an illustration. The mean falls 0.025 bar a day. Each warning arrives with time to act before the next, and the filtered trip is reached only if all of them are ignored.
- Day 0 | Strainer cleaned | Mean returns to 4.20 bar.
- Hour 10 | CUSUM signals | Fouling has started at a normal rate.
- Day 10 | Advisory at 3.95 bar | Clean the strainer at the next scheduled break.
- * Day 18 | PAL-3 at about 3.75 bar | The strainer is overdue; the operator is alarmed.
- Day 24 | Filtered trip starts to act on noise | Mean about 3.6 bar, nuisance trips resume.
- Day 40 | Mean reaches 3.2 bar | The trip acts on the slow fault, as designed.
```

## The error: the warning that disappeared

The filter was commissioned first, before the advisory and the CUSUM had been programmed, and it worked: the nuisance trips stopped. Three weeks later, PAL-3, now on its 5 s filtered signal, alarmed for the first time since it had been brought back into service. The strainer had not been cleaned for 18 production days, and the mean was 3.75 bar.

The cause was in the maintenance routine rather than the control system. Since the finer mesh had been fitted, the maintenance team had stopped following the three-week schedule and instead cleaned the strainer whenever the cell began tripping. It worked, crudely: the nuisance trips appeared a week and a half into each cycle, and the strainer was cleaned. The nuisance trips had become, without anyone deciding it, the plant's strainer-loading indicator. When the filter removed them, it also removed the only signal maintenance was acting on, and the strainer loaded until the next alarm.

No damage was done: the alarm did its job, which is what it is there for, and the strainer was cleaned the same day. But the event shows a general trap. A nuisance often carries information, and when you remove the nuisance you must find out what information it carried and replace it deliberately. The advisory at 3.95 bar and the CUSUM were programmed the following week, and the maintenance procedure was changed to act on them.

```figure
type: checklist
title: Managing drift towards a threshold
caption: Noise sets how often the threshold is reached from a given mean; drift decides where the mean is. Both need managing, by different people.
- Trend an average of the signal | Hourly or shift means show drift that the raw readings hide.
- Set an advisory well clear of the trip | Far enough below normal that only real drift reaches it.
- Use a CUSUM for the first sign of change | It accumulates small departures and signals early.
- Give the advisory to the people who act | Maintenance, with a stated response time.
- ? Did the nuisance carry information | If people were acting on it, replace it before removing it.
```

## How this applies to a small Australian business

Most slow faults, a loading filter, a scaling heat exchanger, a wearing pump, a drifting sensor, show up first as a gradual change in the mean of a signal that already has a trip or alarm on it. Trend an hourly or shift average of each protected signal and set an advisory well before the alarm. Before curing a nuisance trip or alarm, ask who has been relying on it, and give them something better. Under work health and safety law, a maintenance practice that depends on a protective function misbehaving is itself a risk that needs controlling.

## Exercise: a faster fouling rate

A batch of dirtier make-up water doubles the fouling rate to 0.05 bar per production day. (a) On what day after a clean does the advisory at 3.95 bar fire? (b) What is the expected number of raw-signal nuisance trips per shift on that day, at its mean pressure, and why does it not matter now that the 0.5 s filter is fitted? (c) With the CUSUM settings above and hourly scatter of 0.010 bar, roughly when would you expect the CUSUM to signal?

**Worked answer.** (a) The mean falls 0.25 bar to 3.95 bar in 0.25 ÷ 0.05 = **5 production days**. (b) At 3.95 bar the raw-signal rate is 0.56 trips a shift (Chapter 3); with the filter, Rice's formula with σ = 0.088 bar and ν₀ = 0.44 per second gives a margin of 8.5 standard deviations and **effectively no trips**, so the advisory, not the trip, decides when the strainer is cleaned. (c) The trend now falls 0.0031 bar an hour. The lower sum gains on average (0.0031 × t − 0.005) per hour, which first becomes positive after about 1.6 hours; summing that excess, the expected sum passes 0.04 bar at about **hour 7**, against hour 10 at the normal rate. In practice the hourly scatter will make the signal arrive a few hours either side.
