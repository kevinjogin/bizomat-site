---
book: vibration-monitoring-by-the-numbers
chapterSlug: severity-trends-and-alarm-limits
order: 4
title: "Severity, trends and alarm limits"
description: "Judging vibration against standards and a machine's own history, alert and danger levels, limits from individuals and EWMA charts, band alarms, and an overall-level alarm that missed a bearing."
draft: false
---

A vibration reading becomes a decision only when it is compared with something: a standard's severity zones, the machine maker's limits, or the machine's own past. Each comparison answers a different question. A standard says whether a machine of this type and size is vibrating acceptably for long-term operation. The machine's history says whether this machine has changed. An alarm limit turns either answer into an action, and alarm limits set badly either flood the planner with false alarms, which are soon ignored, or stay silent while a fault grows.

This chapter explains severity guidance and its limits, sets alert and danger levels from a machine's baseline, uses the individuals and EWMA control chart tools to set statistical limits that catch change early, adds alarms on frequency bands, and finishes with an alarm scheme on overall velocity alone that stayed silent while P-4's bearing deteriorated.

## Severity guidance

Severity standards for general machinery, such as ISO 20816-3 for industrial machines above 15 kW, classify broadband RMS velocity, measured on bearing housings in defined directions and bands, into zones. In outline, the lowest zone is typical of newly commissioned machines; the next is acceptable for unrestricted long-term operation; the third is normally unsatisfactory for long-term continuous operation; and the highest is severe enough to cause damage. The boundaries depend on the machine's size and on whether its support is rigid or flexible, which in vibration terms means whether its lowest natural frequency on its support lies above or below its running speed. The standard's numbers are not reproduced here and must be taken from the standard itself for any real assessment.

Severity guidance is useful for commissioning, for acceptance after repair and for judging a machine with no history. It is less useful for monitoring change. A machine can sit comfortably in an acceptable zone while its vibration doubles, which is a significant change worth investigating, and a machine with an unusual structure can run for years at a level a general standard calls unsatisfactory without damage. Monitoring therefore leans on each machine's own history, with the standard as a backstop. Where a machine maker states its own limits, those take precedence for that machine, because the maker knows its structure and bearings.

## Alarm limits from the baseline

The simplest alarms compare each reading with the machine's baseline. A common scheme sets an alert, which prompts closer attention, at a modest rise above the baseline, and a danger level, which prompts action, at a larger rise, both capped by the standard's zones. The mill sets its alerts at 1.25 times the baseline overall velocity and its danger levels at 2 times, with the danger level never above the standard's boundary for unsatisfactory operation for that machine class.

```figure
type: stats
title: F-2's baseline-relative alarm levels
caption: This is an illustration. Baseline from the first year of route readings on F-2's outboard horizontal point, velocity RMS 10 to 1,000 Hz.
- 4.5 mm/s | baseline overall velocity
- 5.6 mm/s | alert at 1.25 × baseline
- 9.0 mm/s | danger at 2 × baseline
- 5.19 mm/s | statistical upper limit from the individuals chart, below
```

Ratio-based limits are easy to explain and to apply to many machines at once. Their weakness is that they ignore how much each machine's readings scatter. A machine whose readings vary by ±20% from route to route will trip a 25% alert on noise; one whose readings hold within ±3% can rise 20% without tripping it, though such a steady rise is clearly real.

## Statistical limits

Treating each machine's route readings as a process to be controlled gives limits that reflect its own scatter. An individuals chart, with limits at the mean plus and minus three standard deviations estimated from the average moving range between successive readings, flags any single reading that is unlikely to be ordinary scatter.

The [individuals control chart check](/tools/individuals-chart-check/) takes up to twelve readings in time order. F-2's first twelve route readings, 4.4, 4.7, 4.3, 4.6, 4.5, 4.2, 4.8, 4.5, 4.4, 4.6, 4.5 and 4.6 mm/s, give a mean of 4.51 mm/s, an average moving range of 0.255 mm/s, an estimated standard deviation of 0.226 mm/s and control limits from 3.83 to 5.19 mm/s. Every reading lies within them. The upper limit, 5.19 mm/s, is lower than the 5.6 mm/s ratio-based alert, because F-2's readings are steady, and a reading above it is a meaningful change even though it is still below the alert.

### Small, sustained shifts

An individuals chart is good at single large changes and slow to see a small, sustained drift, because each reading is judged alone. An exponentially weighted moving average, EWMA, combines each reading with the previous average, giving recent readings more weight but remembering the trend, and its limits are much narrower. It detects a small sustained rise several readings before an individuals chart would.

The [EWMA control chart check](/tools/ewma-chart-check/) takes a target, a historical standard deviation, a weighting factor and up to twenty readings. Using F-2's baseline mean of 4.508 mm/s and standard deviation of 0.2257 mm/s, a weighting factor of 0.2 and limits at three standard deviations, it gives control limits that settle at 4.28 to 4.73 mm/s. Over the next twelve routes, F-2 read 4.6, 4.5, 4.7, 4.8, 4.7, 4.9, 4.8, 5.0, 4.9, 5.0, 5.1 and 5.0 mm/s. None of those readings reaches the individuals chart's 5.19 mm/s, and none the 5.6 mm/s alert, but the EWMA rises above its upper limit at the eighth reading, four months into the drift.

```figure
type: compare
title: Three alarm schemes on F-2's slowly rising vibration
cols: Limit | First signal
rowhead: Scheme
- Ratio alert, 1.25 × baseline | 5.6 mm/s | none in twelve routes
- Individuals chart | 5.19 mm/s | none in twelve routes
- * EWMA chart, λ = 0.2 | settles at 4.73 mm/s | eighth route, when the EWMA reached 4.76 mm/s
caption: This is an illustration from the individuals and EWMA chart tools. The EWMA's earlier signal led to a balance check that found dust build-up on F-2's impeller blades, cleaned at the next shutdown.
```

The EWMA's signal sent the technician to look at F-2's spectrum, where the rise was entirely at 1×, the signature of unbalance. Dust from the sawmill had begun to build up on the fan's blades, unevenly, as it does on fans handling dusty air. Cleaning the blades at the next planned shutdown brought F-2 back to its baseline, and blade cleaning was added to F-2's six-monthly maintenance so that the build-up never again reaches the point where it shows in the trend. The ratio alert would not have tripped until the build-up was much heavier, and Chapter 6 shows how much force that unbalance would then have put on the bearings.

### Choosing the weighting

The EWMA's weighting factor sets the trade between speed and noise. A small factor, such as 0.1, averages over many readings and detects very small shifts, but responds slowly to a sudden change; a large factor, such as 0.4, follows each reading closely and behaves more like an individuals chart. A factor of about 0.2 is a common compromise for route data, and the mill runs both charts side by side on its critical machines: the individuals chart for sudden changes, the EWMA for slow drift. Both need a stable baseline period to estimate their standard deviation, and both are reset after a repair, as the review later in this chapter describes. For machines on the online system, which produce a reading every few minutes, the charts use daily averages, because consecutive readings minutes apart are not independent and would make the limits far too narrow.

## Alarms on frequency bands

An overall level is dominated by the largest component in the signal, as Chapter 2 showed, and a small new component barely moves it. A bearing defect in its early stage, a small gear mesh change or a rise at the vane-passing frequency of a pump can grow by a factor of several while the overall level stays within its limits. Band alarms divide the spectrum into frequency ranges chosen for each machine's likely faults and set a limit on the energy in each.

```figure
type: compare
title: The band alarms on P-4's motor, drive-end horizontal point
cols: Range | Looks for | Alert
rowhead: Band
- Below 0.8× | 0 to 19.7 Hz | looseness, rubs, oil whirl | 0.5 mm/s RMS
- Around 1× | 19.7 to 29.6 Hz | unbalance | 2.5 mm/s RMS
- Around 2× and 3× | 39.5 to 78.9 Hz | misalignment, looseness | 1.5 mm/s RMS
- Bearing defect frequencies and harmonics | 70 to 500 Hz | rolling bearing defects | 0.8 mm/s RMS
- High-frequency acceleration | 1 to 5 kHz | early bearing damage, lubrication | 0.5 g RMS
caption: This is an illustration. Running speed 24.67 Hz. Bands and limits set from P-4's baseline spectrum; the bearing defect frequencies come from Chapter 8.
```

## The mistake: overall velocity alone

When the mill's route first started, its software was set up with alarms on overall velocity only, because they were simple to set and understand. Over three months P-4's drive-end bearing developed an outer-race defect. Its overall velocity rose from 2.6 to 2.8 mm/s, well within its alert of 3.3 mm/s. No alarm sounded. The technician noticed the defect only because the route's spectrum plot for P-4 happened to be open on the screen when a fitter asked about the motor's noise.

```figure
type: steps
title: Adding band alarms after a near miss
caption: This is an illustration. The defect's energy was a small share of the overall velocity and a large share of the high-frequency acceleration.
- Overall velocity | 2.6 to 2.8 mm/s over three months; alert at 3.3 mm/s not reached
- Spectrum | new peaks at about 75 Hz and harmonics: the bearing's outer-race frequency
- High-frequency acceleration | 0.12 to 0.6 g RMS over the same months, a fivefold rise
- * Cause | an overall level dominated by 1× and 2× hides a small new component
- Fix | band alarms on every machine, including a high-frequency acceleration band for bearings
```

The defect's energy, at about 75 Hz and its harmonics in velocity and in the kilohertz ringing it excited in acceleration, was a small share of the overall velocity, which was dominated by P-4's ordinary 1× and 2× vibration. In the high-frequency acceleration band the same defect had raised the level fivefold. The mill set up band alarms on every machine, with a high-frequency acceleration band on every rolling-bearing machine, and P-4's bearing was replaced at the next planned shutdown, three weeks later, before it failed.

## Acting on an alarm

An alarm is a question, not an answer. The mill's response to any alert follows the same few steps. First, check the measurement: the sensor's bias, the mounting, the units and the machine's operating state, because many alarms come from those, as Chapters 2 and 3 showed. Second, look at the spectrum and the three directions to identify which component has changed, which points to the fault. Third, compare with the machine's history and with similar machines. Fourth, decide: shorten the interval and watch, plan a repair at the next convenient stop, or, at a danger level or with a rapidly rising trend, stop the machine. The technician records each step in the alarm log, which feeds the quarterly review below.

The speed of the rise matters as much as its size. A reading that has crept up over six months can usually wait for a planned stop; one that has doubled in a fortnight cannot, even if it is still below the danger level, because the fault is accelerating. The mill's software therefore also alarms on the rate of change, a rise of more than 25% between consecutive routes, whatever the level.

## Severity at commissioning and after repair

Severity standards come into their own at the beginning of a machine's life and after each overhaul. A new or rebuilt machine should run in the lowest zone of the applicable standard, typical of new machines in good order; one that starts higher has an installation or build problem, such as a soft foot, residual unbalance or misalignment, that will shorten its life and that is cheapest to fix before it is handed over. The mill's acceptance check for any rebuilt motor, pump or fan is a set of readings in all directions within a week of start-up, compared with the standard and with the machine's previous baseline, and a contractor's job is not signed off until they pass. Those readings then become the new baseline for the alarms.

## Reviewing and adjusting limits

Limits are not set once. A limit that trips often without a fault is costing attention and should be reviewed; one that never trips while faults are found by other means is too loose. The mill reviews its alarm log each quarter: every alarm is classed as a true fault, a false alarm or a change of operating state, and limits are adjusted where false alarms cluster. Baselines and limits are reset after every repair that changes a machine's vibration, because a machine with a new bearing or a freshly balanced rotor has a new normal.

## Exercise: limits for the gearbox

G-3's first ten route readings of overall velocity on its input bearing were 3.1, 3.3, 3.0, 3.2, 3.4, 3.1, 3.2, 3.0, 3.3 and 3.2 mm/s. Calculate the mean, the average moving range, the estimated standard deviation as the average moving range divided by 1.128, and the individuals chart's upper limit. Compare it with the mill's ratio-based alert at 1.25 times the mean, and say which would signal first if the gearbox's vibration rose steadily by 0.05 mm/s per route.

### Answer

**Given:** ten readings; d₂ = 1.128 for moving ranges of two; ratio 1.25.

**Assumptions:** the ten readings come from a stable machine in its normal state.

**Method:** mean; moving ranges |xᵢ − xᵢ₋₁|; σ = MR̄ ÷ 1.128; UCL = mean + 3σ.

**Mean:** 31.8 ÷ 10 = 3.18 mm/s.

**Moving ranges:** 0.2, 0.3, 0.2, 0.2, 0.3, 0.1, 0.2, 0.3, 0.1; sum 1.9, average 1.9 ÷ 9 = 0.211 mm/s.

**Standard deviation:** 0.211 ÷ 1.128 = 0.187 mm/s.

**Upper limit:** 3.18 + 3 × 0.187 = 3.74 mm/s.

**Ratio alert:** 1.25 × 3.18 = 3.98 mm/s.

**A steady rise of 0.05 mm/s per route:** starting from the mean, the vibration reaches 3.74 mm/s after (3.74 − 3.18) ÷ 0.05 = 11.2 routes and 3.98 mm/s after 16 routes. The individuals chart signals about five routes, ten weeks on a fortnightly route, earlier. An EWMA chart would signal earlier still.

**Verification:** the individuals chart check, given these ten readings, gives the same mean, average moving range and upper limit of about 3.74 mm/s.
