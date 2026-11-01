---
book: control-charts-by-the-numbers
chapterSlug: shewhart-xbar-and-r-charts
order: 2
title: "Shewhart X̄ and R charts"
description: "Common and special causes, rational subgroups, X̄ and R limits from a stable baseline, where the constants come from, reading a day of SP-12's chart, and why tolerance limits do not belong on it."
draft: false
---

In the 1920s Walter Shewhart, working on telephone equipment at Bell Laboratories, separated variation into two kinds. Common-cause variation is the steady background of many small influences that every stable process has; it can be reduced only by changing the process. Special-cause variation comes from something identifiable that has changed: a worn insert, a new bar batch, a loose gauge contact. It should be found and removed. His control chart is a device for telling the two apart in real time, by plotting a statistic against limits set so wide that common causes alone will rarely cross them.

This chapter builds SP-12's X̄ and R charts from its baseline with the WORKOS limits tool, shows where the constants in the formulas come from, reads a day of the chart, including one signal on each chart, and sets out what the operator does when a point falls outside. It ends with a chart that used the tolerance as its limits and saw nothing for a week.

## Rational subgroups

The chart's power depends on how the subgroups are chosen. Shewhart's principle, now called rational subgrouping, is that variation within a subgroup should be common-cause only, so that any special cause shows up as a difference between subgroups. For SP-12 that means five consecutive spools, made within about four minutes on the same tool edge with the machine in the same thermal state. A tool change, a bar change or a warm-up drift will then move whole subgroups rather than hide inside them.

The wrong choice is easy to make. Five spools taken at random from the half-hour's output of 40 would mix parts made before and after any change within the half-hour, inflating the within-subgroup range and widening the limits until the chart cannot see the change it should catch. Five spools from five different machines would mix the machines' differences into the "common" variation. The rule is to group what should be alike and compare what might differ. Choosing the interval between subgroups is the other half of the decision: it should be short compared with how quickly the process can change, so that a change is caught before many parts are made after it, and long enough that the measuring does not crowd out the making.

## Limits from the baseline

The limits come from the process itself, from a baseline period long enough to estimate its variation and free of known special causes. The usual recommendation, which the WORKOS tool repeats, is at least 20 to 25 subgroups. SP-12's baseline of 25 subgroups of five gave a grand average, X̿, of 12.0010 mm and an average range, R̄, of 0.0051 mm.

The [X-bar and R control chart limits tool](/tools/xbar-r-limits/) turns those into the two charts. From the grand average, the average range and the subgroup size from 2 to 10, it gives the centre line and upper and lower limits for the X̄ chart and the R chart, the estimated process standard deviation, and the constants it used. It notes that the limits are valid only for a stable process.

```figure
type: stats
title: SP-12's chart limits from the X-bar and R tool
caption: This is an illustration. Grand average 12.0010 mm, average range 0.0051 mm, subgroups of 5; constants A₂ 0.577, D₃ 0, D₄ 2.114, d₂ 2.326.
- * 11.99806 to 12.00394 mm | X̄ chart limits | 12.0010 ± 0.577 × 0.0051
- 0 to 0.01078 mm | R chart limits | centre 0.0051 mm
- 0.00219 mm | Estimated process σ | 0.0051 ÷ 2.326
- 0.00098 mm | σ of a subgroup average | 0.00219 ÷ √5
```

## Where the constants come from

The constants look arbitrary but are not. The X̄ chart's limits are meant to sit three standard deviations of the subgroup average either side of the centre: X̿ ± 3σ ÷ √n. The process σ is estimated as R̄ ÷ d₂, where d₂ is the expected range of n normal readings in units of σ, 2.326 for five. Substituting, the limits are X̿ ± 3R̄ ÷ (d₂√n), and A₂ is simply 3 ÷ (d₂√n) = 3 ÷ (2.326 × 2.236) = 0.577 for subgroups of five.

```figure
type: formula
title: X̄ and R chart limits
formula: X̄ chart: X̿ ± A₂ R̄, where A₂ = 3 ÷ (d₂ √n)
formula: R chart: from D₃ R̄ to D₄ R̄
caption: The R chart's constants place its limits three standard deviations of the range either side of R̄; for subgroups of six or fewer the lower limit would be negative and is set to zero. This is an illustration with SP-12's numbers.
- d₂ for n = 5 | 2.326: the average range of five normal readings is 2.326σ
- A₂ for n = 5 | 3 ÷ (2.326 × √5) = 0.577
step: X̄ limits: 12.0010 ± 0.577 × 0.0051 = 12.0010 ± 0.00294 mm
step: R upper limit: 2.114 × 0.0051 = 0.01078 mm
```

Three standard deviations is a choice, and Shewhart made it on economic grounds rather than from a formula: limits wide enough that the operator is rarely sent chasing nothing, narrow enough that real changes show. For a normal statistic, a point falls beyond three-sigma limits by chance with probability 0.27%, about once in 370 points. Chapter 4 turns that into run lengths and shows what it costs in detection speed.

## Read the R chart first

The two charts are read in a particular order. The R chart shows whether the variation within subgroups is stable; the X̄ chart's limits are calculated from R̄, so if the spread is out of control the X̄ limits are meaningless. Only when the R chart is in control does it make sense to ask whether the mean has moved.

In SP-12's baseline the R chart stayed within 0 to 0.01078 mm for all 25 subgroups, and so did the X̄ chart within its limits. Had a subgroup been out on either chart with a known cause, such as the gauge being recalibrated mid-baseline, it would have been removed and the limits recalculated: this first, retrospective use of the chart to establish a clean baseline is usually called Phase I. Ongoing monitoring against the fixed limits is Phase II.

## A day on the chart

This is an illustration. Eight subgroups from the morning shift after the baseline was set:

```figure
type: compare
title: SP-12, eight subgroups on the morning shift
cols: X̄, mm | R, mm | Reading against the limits
rowhead: Subgroup
caption: This is an illustration. X̄ limits 11.99806 to 12.00394 mm; R limit 0.01078 mm. Subgroup 4 signals on the R chart; subgroups 7 and 8 on the X̄ chart, after an insert change.
- 1 | 12.0012 | 0.0044 | in control
- 2 | 11.9998 | 0.0057 | in control
- 3 | 12.0021 | 0.0049 | in control
- * 4 | 12.0006 | 0.0121 | R above its upper limit
- 5 | 12.0015 | 0.0052 | in control
- 6 | 12.0019 | 0.0038 | in control
- * 7 | 12.0047 | 0.0055 | X̄ above its upper limit
- 8 | 12.0043 | 0.0047 | X̄ above its upper limit
```

Subgroup 4's range of 0.0121 mm is above the R chart's limit while its mean is normal. One of its five spools read 12.0061 mm and another 11.9940 mm. The operator found a chip lodged on the gauge's anvil, which made readings jump; the spools were remeasured on a bench gauge and all were within 11.9985 to 12.0035 mm. The cause was in the measurement, not the process, which the R chart showed and the X̄ chart alone could not have.

Subgroups 7 and 8 sit above the X̄ limit with ordinary ranges: the whole distribution has moved up about 0.0035 mm. The log showed an insert change between subgroups 6 and 7, and the new insert's offset had been entered from the previous edge's value without a trial cut. The operator applied a −0.0035 mm offset, and the next subgroup returned to 12.0012 mm. No spool was out of tolerance: the largest in subgroups 7 and 8 measured 12.0071 mm, still 0.003 mm inside the limit. The chart caught the shift while it was still harmless, which is the point.

## How good are limits from 25 subgroups?

Limits calculated from a baseline are estimates, and they carry the baseline's uncertainty. SP-12's σ came from 125 spools in 25 subgroups; Chapter 1 showed that such an estimate is uncertain by roughly 6% either way. If the true σ were 6% larger than estimated, the limits would sit at about 2.8 rather than 3 true standard deviations, and false alarms would come about 1.7 times as often as planned, once in about 215 points instead of 370; if 6% smaller, at about 3.2, false alarms would come about once in 700 points, while real shifts would take a little longer to show. The asymmetry is worth noticing: the tail of the normal curve is so steep that a small error in σ changes the false alarm rate by a large factor. Neither is a disaster, but both mean that a new chart's false alarm rate is only approximately what the theory promises.

The practical answer is to treat the first limits as provisional. SP-12's procedure recalculates them once 100 subgroups have accumulated without unexplained signals, about three days of production, using all of that data. After that, the limits are fixed and changed only when the process itself is deliberately changed: a new tool grade, a different machine, a revised program. Recalculating limits every week from recent data is a common habit and a bad one, because a slow drift in the process then drags the limits along with it, and the chart never signals the drift it was meant to catch.

## When the chart and the tolerance disagree

Three situations look alike on the shop floor and mean different things. A point outside the control limits with every spool inside the tolerance means the process has changed but no harm has yet been done: investigate and correct, which is the chart doing its job early. A point inside the control limits with a spool outside the tolerance means the process is behaving as usual but its usual is not good enough: the process needs a capability improvement, not an adjustment, as Chapter 9 explains. And a point outside the limits with spools outside the tolerance means both have happened: contain the parts first, then find the cause. Training operators to tell these apart, rather than reacting to every signal by adjusting the offset, removes a great deal of self-inflicted variation.

## Run rules

A point beyond the limits is not the only pattern a special cause leaves. A run of points on one side of the centre line, a steady climb, or points crowding near a limit can show a change before any single point crosses. Supplementary run rules, of which the best known were published by the Western Electric Company in the 1950s, test for such patterns: for instance, two of three successive points beyond two standard deviations on the same side, or eight successive points on one side of the centre.

The rules add sensitivity at a cost. Each one is another way for a stable process to signal by chance, so using several together shortens the run between false alarms considerably. They also overlap with what the CUSUM and EWMA charts of Chapters 5 and 6 do more systematically. SP-12's procedure uses the beyond-limits rule and the eight-on-one-side rule only, and leaves small-shift detection to a CUSUM run alongside.

## What the operator does

A signal is useful only if it triggers the right action. SP-12's out-of-control action plan, posted at the cell, lists the response to each kind of signal in order.

```figure
type: steps
title: SP-12's response to a signal
caption: This is an illustration. The plan separates measurement causes from process causes first, because adjusting a good process to chase a bad reading creates the variation it is trying to remove.
- Check the measurement | clean and zero the gauge, remeasure the subgroup on the bench gauge
- R chart signal | look for loose clamping, a chipped insert edge, chips or coolant on the gauge
- X̄ chart signal | check the log for insert, bar or offset changes, and the machine's warm-up state
- * Act on the cause | correct the offset or replace the insert; never adjust without a cause
- Contain | remeasure the spools made since the last good subgroup if any could be near a limit
- Record | note the signal, the cause and the action on the chart for the next review
```

The plan's last line matters for the long run. Recorded causes become a list of the cell's special causes, ranked by frequency, and the most frequent are candidates for permanent fixes, such as a tool-offset check after every insert change, which in SP-12's case was added to the setter's checklist after the morning above.

## The error: tolerance limits on an X̄ chart

This is an illustration. In the first week the chart was in use, a new operator drew the tolerance limits, 11.990 and 12.010 mm, on the X̄ chart instead of the control limits. Nothing signalled for a week, while two insert changes had moved the mean by about 0.0035 mm each time without correction, the second time to 12.0048 mm.

The quality engineer spotted it at the weekly review: the plotted averages had stepped twice, each time by more than three times the standard deviation of an average, and the chart showed no signal because its "limits" were ten times wider than they should be. Two errors were compounded. Control limits come from the process, not the drawing. And the averages of five spools vary much less than single spools, so even if tolerance limits had a place, they would belong on a chart of individual parts, not on a chart of averages: an average can sit comfortably inside the tolerance while some of the spools it averages are near or beyond it.

The chart was redrawn with the process limits, the setter's offset check was introduced, and the spools from the second shifted period were sorted on the bench gauge. Three of about 900 measured between 12.0090 and 12.0098 mm, inside the tolerance but closer than the plant liked. The chart's job, from then on, was to stop the mean wandering before that happened again.

## Exercise: subgroups of four

The second shift wants to measure four spools each half hour instead of five. A baseline of 25 subgroups of four gives a grand average of 12.0010 mm and an average range of 0.0046 mm. With A₂ = 0.729, D₄ = 2.282 and d₂ = 2.059 for subgroups of four, find the X̄ and R limits and the estimated σ. Is the process the same?

**Worked answer.** This is an illustration. The X̄ limits are 12.0010 ± 0.729 × 0.0046 = 12.0010 ± 0.00335 mm, so **11.99765 to 12.00435 mm**, wider than the ±0.00294 mm for subgroups of five because averages of four vary more. The R chart's upper limit is 2.282 × 0.0046 = **0.0105 mm**, with a lower limit of zero. The estimated σ is 0.0046 ÷ 2.059 = **0.00223 mm**, against 0.00219 mm from subgroups of five: the same process within the precision of the estimates, as it should be. The smaller subgroup costs some sensitivity: Chapter 4 shows that a shift of half a standard deviation would take about 44 subgroups to detect on average with subgroups of four against about 33 with five.
